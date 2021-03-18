#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <EventKitUI/EventKitUI.h>
#import <EventKit/EventKit.h>

@interface Calendar : CDVPlugin
    @property (nonatomic, retain) EKEventStore* eventStore;
    - (void)initEventStoreWithCalendarCapabilities;
    - (void)findEvent:(CDVInvokedUrlCommand*)command;
    -(NSArray*)findEKEventsWithSearchQuery:(NSString *)searchQuery
                           startDate: (NSDate *)startDate
                             endDate: (NSDate *)endDate
                            calendar: (EKCalendar *) calendar;
@end