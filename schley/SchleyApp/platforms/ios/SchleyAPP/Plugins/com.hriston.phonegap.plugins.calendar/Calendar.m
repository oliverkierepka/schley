#import "Calendar.h"

@implementation Calendar

    @synthesize eventStore;
    
    - (CDVPlugin*) initWithWebView:(UIWebView*)theWebView {
        self = (Calendar*)[super initWithWebView:theWebView];
        if (self) {
            [self initEventStoreWithCalendarCapabilities];
        }
        return self;
    }
    
    - (void)initEventStoreWithCalendarCapabilities {
        __block BOOL accessGranted = NO;
        eventStore= [[EKEventStore alloc] init];
        if([eventStore respondsToSelector:@selector(requestAccessToEntityType:completion:)]) {
            dispatch_semaphore_t sema = dispatch_semaphore_create(0);
            [eventStore requestAccessToEntityType:EKEntityTypeEvent completion:^(BOOL granted, NSError *error) {
                accessGranted = granted;
                dispatch_semaphore_signal(sema);
            }];
            dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
        } else { // we're on iOS 5 or older
            accessGranted = YES;
        }
        
        if (accessGranted) {
            self.eventStore = eventStore;
        }
    }
    
    -(void)findEvent:(CDVInvokedUrlCommand*)command {
        NSString *callbackId = command.callbackId;
        NSArray* searchQuery      = [command.arguments objectAtIndex:0];
        NSString *startDate  = [command.arguments objectAtIndex:1];
        NSString *endDate    = [command.arguments objectAtIndex:2];
        
        NSTimeInterval _startInterval = [startDate doubleValue] / 1000;
        NSDate *myStartDate = [NSDate dateWithTimeIntervalSince1970:_startInterval];
        NSTimeInterval _endInterval = [endDate doubleValue] / 1000;
        NSDate *myEndDate = [NSDate dateWithTimeIntervalSince1970:_endInterval];
        NSDateFormatter *df = [[NSDateFormatter alloc] init];
        [df setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
        
        NSMutableArray *finalResults = [[NSMutableArray alloc] initWithCapacity:1];
        for (NSDictionary *query in searchQuery) {
            NSArray *matchingEvents = [self findEKEventsWithSearchQuery:[query valueForKey:@"search"] startDate:myStartDate endDate:myEndDate calendar:self.eventStore.defaultCalendarForNewEvents];
            for (EKEvent * event in matchingEvents) {
                NSMutableDictionary *entry = [[NSMutableDictionary alloc] init];
                [entry setValue:event.title forKey:@"title"];
                [entry setValue:event.location forKey:@"location"];
                [entry setValue:event.notes forKey:@"description"];
                [entry setValue:[NSString stringWithFormat:@"%.0f", [event.startDate timeIntervalSince1970]*1000] forKey:@"beginTime"];
                [entry setValue:[NSString stringWithFormat:@"%.0f", [event.endDate timeIntervalSince1970]*1000] forKey:@"endTime"];
                [entry setValue:[query valueForKey:@"type"] forKey:@"eventType"];
                [entry setValue:@"2" forKey:@"allDay"];
                [finalResults addObject:entry];
            }
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsArray:finalResults];
        [self writeJavascript:[result toSuccessCallbackString:callbackId]];
    }
    
    -(NSArray*)findEKEventsWithSearchQuery: (NSString *)query startDate: (NSDate *)startDate endDate: (NSDate *)endDate calendar: (EKCalendar *) calendar {
        
        NSMutableString *predicateString= [[NSMutableString alloc] initWithString:@""];
        [predicateString appendString:[NSString stringWithFormat:@"title like '%@'", query]];
        [predicateString appendString:[NSString stringWithFormat:@" OR location like '%@'" , query]];
        [predicateString appendString:[NSString stringWithFormat:@" OR notes like '%@'" , query]];
        
        NSPredicate *matches = [NSPredicate predicateWithFormat:predicateString];
        NSArray *calendarArray = [NSArray arrayWithObject:calendar];
        NSArray *datedEvents = [self.eventStore eventsMatchingPredicate:[eventStore predicateForEventsWithStartDate:startDate endDate:endDate calendars:calendarArray]];
        NSArray *matchingEvents = [datedEvents filteredArrayUsingPredicate:matches];
        return matchingEvents;
    }
@end