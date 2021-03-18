// START NORMAL STUFF //
$(document).bind("mobileinit", function() {    
    //swipe preferences
    $.event.special.swipe.scrollSupressionThreshold = (screen.availWidth) / 6;  // (default: 10) (pixels) – More than this horizontal displacement, and we will suppress scrolling.  
    $.event.special.swipe.horizontalDistanceThreshold = 250; // (default: 30) (pixels) – Swipe horizontal displacement must be less than this. 
    $.event.special.swipe.verticalDistanceThreshold = 20; // (default: 75) (pixels) – Swipe vertical displacement must be less than this.
    $.event.special.swipe.durationThreshold = 1200; // (default: 1000) (milliseconds) – More time than this, and it isn't a swipe.
    
    //config for page loading widget
     $.mobile.loader.prototype.options.text = "lade";
     $.mobile.loader.prototype.options.textVisible = true;
     $.mobile.loader.prototype.options.theme = "b";
     $.mobile.loader.prototype.options.html = "";
});

$.support.cors = true;

//HEIGHT PROBLEM SOLUTION from Rhettajf , BIG THANKS!!!!
function doResizeMaps() {
    var winhigh = $.mobile.getScreenHeight(); //Get available screen height, not including any browser chrome
    var headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
    var foothigh = $('[data-role="footer"]').first().outerHeight(); //Get height of first page's header
    var $content=$('[data-role="content"]');
    var contentpaddingheight = parseInt($content.css("padding-top").replace("px", "")) + parseInt($content.css("padding-bottom").replace("px", "")); //Get height of themes content containers padding
    winhigh = winhigh - headhigh - foothigh - contentpaddingheight; //Calculate out new height (-2 if you have a 1px border on content container)
    $content.css('min-height',winhigh + 'px'); //Set new content height
}

function doResize() {
	var winhight = $.mobile.getScreenHeight();
	var headhight = $('[data-role="header"]').first().outerHeight();
	var foothight = $('[data-role="footer"]').first().outerHeight();
	var $content = $('[data-role="content"]');
	newhight = winhight - headhight - foothight;
	$content.css('min-height', newhight + 'px');
}

$(document).on("pageinit", "#greetings", function() {
    greetingcardslider = $("#greetingcards");
    greetingcardslider.owlCarousel({
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        itemsTablet: [768,2],
        itemsMobile : [479,1],
        afterAction: setecard
    });
    greetingCardSelect = greetingcardslider.data('owlCarousel');
    
    $("#privacypolicy").checkboxradio({
      create: function( event, ui ) {}
    });
    
});

$(document).on("pagebeforeshow", "#greetings",  function(event) {
    
    if( window.localStorage.getItem("rememberme") ) {
        var mail = window.localStorage.getItem("mail");
    }else {
        var mail = window.sessionStorage.getItem("mail");
    }
    
    //reset elements
    $("#sender_m").val(mail);
    $("#reciever_m").val("");
    greetingCardSelect.jumpTo(0);
    $("#privacypolicy").prop('checked', false).checkboxradio("refresh");
    $("#greetingtext").val("");
    
 });
//change ecard number on swiper change
function setecard() {
	ecardnumber = this.currentItem;
	activeecard = "grusskarte0" + (ecardnumber + 1);
	$("input#ecard").val(activeecard);
	////console.log(activeecard);
}

// greetings form
//ask the user to fill out the greeting text or send it empty
function confirmSendGreetingCard(buttonIndex) {
  if(buttonIndex == 2) {
    sendGreetingCard();
  }else {
    $("#greetingtext").focus();
  }
}
$(document).on('click', '#greetingsButton', function() {
                
    //evaluate form fields
   if($("#reciever_m").val() != "" && $("#sender_m").val() != "" && $("label[for='privacypolicy']").hasClass("ui-checkbox-on") ) {
        if( $("#greetingtext").val() == "" ) {
                
                
                // Show a custom confirmation dialog
                var greetingQuestion = 'Die Grußkarte an ' + $("#reciever_m").val() + ' enthält keinen persönlichen Grußtext.';
                navigator.notification.confirm(
                        greetingQuestion,                                 //message
                        confirmSendGreetingCard,             // callback to invoke with index of button pressed
                        'Achtung',                        // title
                        ['Abbrechen','Trotzdem senden']             // buttonLabels
                );

           }else {
                sendGreetingCard();
           }
        
       }else {
            
           if( $("#reciever_m").val() == "" || !validateEmail($("#reciever_m").val()) ) {
                 if( $("#reciever_m").val() == "" ) {
                        navigator.notification.alert(
                            'Bitte geben Sie einen Empfänger für die Grußkarte an!', function() { $("#reciever_m").focus(); },'Bitte überprüfen Sie Ihre Eingabe'
                        );
                  }else if( !validateEmail( $("#reciever_m").val()) ) {
                        navigator.notification.alert(
                            'Bitte geben Sie eine gültige E-Mailadresse als Empfänger an!', function() { $("#reciever_m").focus(); },'Bitte überprüfen Sie Ihre Eingabe'
                        );
                  }
           }else if($("#sender_m").val() == "" || !validateEmail($("#sender_m").val()) ) {
                 if($("#sender_m").val() == "") {
                        navigator.notification.alert(
                            'Bitte geben Sie Ihre E-Mailadresse an!', function() { $("#sender_m").focus(); },'Bitte überprüfen Sie Ihre Eingabe'
                        );
                  }else if( !validateEmail( $("#sender_m").val() ) ) {
                        navigator.notification.alert(
                            'Bitte geben Sie eine gültige E-Mailadresse als Absender an!', function() { $("#sender_m").focus(); },'Bitte überprüfen Sie Ihre Eingabe'
                        );
                  }
                  
           }else if( !$("label[for='privacypolicy']").hasClass("ui-checkbox-on") ) {
                 localAlert(
                    'Bitte akzeptieren Sie unsere Datenschutzbedingungen!', // message
                    'Bitte überprüfen Sie Ihre Eingabe',           // title
                    'Ok'         // buttonLabels
                );                                                 
           }
       }
});

function sendGreetingCard() {
    var greetingFormdata = $("#greetingsformular").serialize();
       
       $.ajax({
              url: 'http://oliverkierepka.de/kunden/schleyapp/greetingcards/optformmail.php',  //server script to process data
              type: 'POST',
              async: true,
              cache: false,
              data: greetingFormdata,
              beforeSend: function() {
                  connectionCheck();           
                  // This callback function will trigger before data is sent
                $.mobile.loading( 'show'); // This will show ajax spinner
              },
              complete: function() {
                // This callback function will trigger on data sent/received complete
       
              },error: function(data){
                // Show a custom confirmation dialog
                navigator.notification.alert('Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.','Es ist ein Fehler aufgetreten! ','Ok');
                  
              }
      }).done(function(data) {
            if(data.status == "ok") {
                $.mobile.changePage("#greetings_thanks");
                $.mobile.loading( 'hide'); // This will hide ajax spinner
            }else {
                navigator.notification.alert(
                'Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.', // message
                'Es ist ein Fehler aufgetreten!',           // title
                'Ok'         // buttonLabels
            );
            }
      });
}

 //Greetings sending


function confirmGreetingCheck() {
    var senderMail = window.sessionStorage.getItem("sm");
    var receiverMail = window.sessionStorage.getItem("rm");
    var senderChar = window.sessionStorage.getItem("se");
    var ecardDate = window.sessionStorage.getItem("ecardDate");
    //alert(senderMail, receiverMail, senderChar, ecardDate);
    
    if( window.localStorage.getItem("rememberme") == 1 ) {                
        //get URIVars from localStorage
        var mail = window.localStorage.getItem("mail");
        //alert(senderMail + " " + mail);
        if( senderMail == mail ) {
            sendGreetingCardFinal(senderMail, receiverMail, senderChar, ecardDate);
        }else {
            navigator.notification.alert(
                'Bitte melden Sie sich mit dem richtigen Account an um die Grußkarte zu versenden und klicken Sie den Bestätigungslink dann erneut an.', 
                function() { 
                    logMeout();
                },'Keine Berechtigung','zum Login');
        }    
    }else {              
        //rememberme is not set...ergo user data is in sessionStorage
        var mail = window.sessionStorage.getItem("mail");
        if( senderMail == mail ) {
            sendGreetingCardFinal(senderMail, receiverMail, senderChar, ecardDate);
        }else {
            //user not allowed to send ecard //notify the user that he/she is logged in with the wrong account
            navigator.notification.alert(
                'Bitte melden Sie sich mit dem richtigen Account an um die Grußkarte zu versenden und klicken Sie den Bestätigungslink dann erneut an.', 
                function() { 
                    logMeout();
            },'Keine Berechtigung','zum Login');
        }
    }
}
        
//finally sending the ecard (double opt in)
function sendGreetingCardFinal(senderMail, receiverMail, senderChar, eCardDate) {
      var senderMail2 = senderMail;
      var receiverMail2 = receiverMail;
      var senderChar2 = senderChar;
      var eCardDate2 = eCardDate;
      $.ajax({
              url: 'http://oliverkierepka.de/kunden/schleyapp/greetingcards/confirm_neu.php',  //server script to process data
              type: "POST",
              async: true,
              cache: false,
              dataType: 'json',
              data: { sm: senderMail2, rm: receiverMail2, se: senderChar2, sentDate: eCardDate2 },
              beforeSend: function() {
                  connectionCheck(); 
                  $.mobile.loading( 'show');
              },
              success: function( data  ) {
                  //alert( data.status );
              },
              error: function( data ){
                  //alert( data );
                 $.mobile.loading( 'hide'); // This will hide ajax spinner
                  //alert("error: " + data.status);
                  // Show a custom confirmation dialog
                  navigator.notification.alert('Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.', function() { $.mobile.changePage("#dashboard"); } ,'Es ist ein Fehler aufgetreten!','Ok');   
              }
      }).done( function( data ) {
            $.mobile.loading( 'hide'); // This will hide ajax spinner
               //alert("the stat: " + data.status);
                switch( data.status ) {
                    case "ok":
                        $.mobile.changePage("#greetings_sent");    
                        break;
                    case "invalid":
                        navigator.notification.alert('Die Grußkarte wurde bereits versandt!', function() { $.mobile.changePage("#dashboard"); },'Link nicht mehr gültig!','zum Dashboard'); 
                        break;
                    case "error":
                        navigator.notification.alert('Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.', function() { $.mobile.changePage("#dashboard"); },'Es ist ein Fehler aufgetreten!','zum Dashboard');   
                        break;
                    case "notfound":
                        navigator.notification.alert('Es konnte kein Eintrag gefunden werden!', function() { $.mobile.changePage("#dashboard"); },'Es konnte kein Eintrag gefunden werden.','zum Dashboard'); 
                        break;
                }
    });
    window.sessionStorage.removeItem("sm");
    window.sessionStorage.removeItem("rm");
    window.sessionStorage.removeItem("se");
}

function validateEmail(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
}


$( document ).on("pagebeforeshow", "#dashboard", function() {
    
    //check if email local storage is available
    if( !window.localStorage.getItem("mail") && !window.sessionStorage.getItem("mail") ) {
        //get the firstname, lastname and email for signed in user
        getUserData();
    }
});

function getUserData() {
    
    if( window.localStorage.getItem("rememberme") ) {
        var uid = window.localStorage.getItem("uid");
        var password = window.localStorage.getItem("password");
    }else {
        var uid = window.sessionStorage.getItem("uid");
        var password = window.sessionStorage.getItem("password");
    }
    
    $.ajax({
           url: 'http://oliverkierepka.de/kunden/schleyapp/getuserdata.php',
           type: "POST",
           async: true,
           cache: false,
           dataType: 'json',
           data: { uid: uid, pswd: password },
           beforeSend: function() {
           },
           complete: function() {
                console.log("complete");
           },
           success: function(data){
               //get the data
               var email = data.mail;
               //save the user data to local storage
                if( window.localStorage.getItem("rememberme") ) {
                    window.localStorage.setItem("mail", email);
                }else {
                    window.sessionStorage.setItem("mail", email);
                }
               
               
           }     
    });
}



//logout function
// clear local storage credentials
// redirect to login page
function logMeout() {
	if(!window.localStorage.getItem("rememberme")) {
        window.localStorage.removeItem("uid");
	    window.localStorage.removeItem("password");
        window.localStorage.removeItem("cp_coffeeimg");
        window.localStorage.removeItem("cp_end");
        window.localStorage.removeItem("cp_firstname");
        window.localStorage.removeItem("cp_lastname");
        window.localStorage.removeItem("cp_mail");
        window.localStorage.removeItem("cp_name");
        window.localStorage.removeItem("cp_shoppingimg");
        window.localStorage.removeItem("cp_start");
        window.localStorage.removeItem("cp_valid");
        window.localStorage.removeItem("cp_used");
        window.localStorage.removeItem("mail");
    }
    window.sessionStorage.removeItem("uid");
    window.sessionStorage.removeItem("password");
    window.sessionStorage.removeItem("mail");

    $.mobile.changePage("#login");
    
}
//swipe delete for mobile listview
$( document ).on( "swipeleft", "#reminderlist li.ui-li.ui-btn", function( event ) {
    $("body").addClass("preventScroll");
    listItem = $( this ).attr("id");
    // These are the classnames used for the CSS transition
    transition = "left";
    rmid = listItem.replace("reminder_", "");
    confirmAndDelete( listItem, transition, rmid );   
});

//load reminders
function loadReminders(callCount) {
    
    //clear reminders
    $(".noreminders_notice").hide();
    $( "#reminderlist, #reminderNav, #reminderContent" ).empty();

    if(!window.localStorage.getItem("uid") || !window.localStorage.getItem("password") || window.localStorage.getItem("uid") == "" || window.localStorage.getItem("password") == "") {
        uid = window.sessionStorage.getItem("uid");
        password = window.sessionStorage.getItem("password");
    }else {
        
        uid = window.localStorage.getItem("uid");
        password = window.localStorage.getItem("password");
    }
	//clear swiper content (tablet view)
	$("#reminderNav").html("");
	$("#reminderContent").html("");
	$("#reminderlist").html("");
	$.ajax({
           url: 'http://oliverkierepka.de/kunden/schleyapp/reminder.php',
           type: "POST",
           async: true,
           cache: false,
           dataType: 'json',
           data: { uid: uid, pswd: password },
           beforeSend: function() {
                //alert("beforeSend");
                // This callback function will trigger before data is sent
                $.mobile.loading( 'show'); // This will show ajax spinner
           },
           complete: function() {
           //alert("complete");
           },
           success: function(data){
                // This callback function will trigger on data sent/received complete
                $.mobile.loading( 'hide'); // This will hide ajax spinner
                var reminderElementsMobile = "";
                   var reminderElementsMobileNext7Days = "";
                   var reminderElementsMobileNext30Days = "";
                   var reminderElementsMobileAfter30Days = "";
                   var reminderElementTabletContent = "";
                   var reminderElementTabletNav = "";
                   
                   function syncPosition(el){
                       var current = this.currentItem;
                       $("#reminderNav")
                       .find(".owl-item")
                       .removeClass("synced")
                       .eq(current)
                       .addClass("synced");
                       if($("#reminderNav").data("owlCarousel") !== undefined){
                            center(current);
                       }
                   }
                   
                   //method to change slide on click the reminderNav item
                   $("#reminderNav").on("click", ".owl-item", function(e){
                        e.preventDefault();
                        var number = $(this).data("owlItem");
                        reminderContent.trigger("owl.goTo",number);
                    });
                   
                   function center(number){
                       var reminderNavvisible = reminderNav.data("owlCarousel").owl.visibleItems;
                       var num = number;
                       var found = false;
                       for(var i in reminderNavvisible){
                           if(num === reminderNavvisible[i]){
                           var found = true;
                       }
                   }
                   
                   if(found===false){
                   if(num>reminderNavvisible[reminderNavvisible.length-1]){
                   reminderNav.trigger("owl.goTo", num - reminderNavvisible.length+2);
                   }else{
                   if(num - 1 === -1){
                   num = 0;
                   }
                   reminderNav.trigger("owl.goTo", num);
                   }
                   } else if(num === reminderNavvisible[reminderNavvisible.length-1]){
                   reminderNav.trigger("owl.goTo", reminderNavvisible[1]);
                   } else if(num === reminderNavvisible[0]){
                   reminderNav.trigger("owl.goTo", num-1);
                   }
                   
                   }
                   reminderContent = $("#reminderContent").owlCarousel({
                       singleItem : true,
                       slideSpeed : 100,
                       animation: false,
                       pagination:false,
                       afterAction : syncPosition,
                       responsiveRefreshRate : 200
                   });
                   reminderNav = $("#reminderNav").owlCarousel({
                       items : 15,
                       itemsDesktop      : [1199,10],
                       itemsDesktopSmall : [979,10],
                       itemsTablet       : [768,8],
                       itemsMobile       : [479,4],
                       responsiveRefreshRate : 100,
                       afterInit : function(el){
                            el.find(".owl-item").eq(0).addClass("synced");
                       }
                   });
                   reminderContentOwl = $("#reminderContent").data('owlCarousel');
                   reminderNavOwl = $("#reminderNav").data('owlCarousel');
        

                   
                   
                   //currentDate
                   //now = moment();
                   currentYear = moment().get('year');
                   currentMonth = moment().get('month');
                   currentDay = moment().date();
                   
                   //console.log("- - - - next 7 days - - - - ");
                   data.reminders.sort(
                                       function(a,b){
                                           momentA = moment(a.rm_date);
                                           momentB = moment(b.rm_date);
                                           if(momentA.month() < momentB.month()){
                                           return -1;
                                           } else if(momentA.month() > momentB.month()){
                                           return 1;
                                           } else {
                                           if(momentA.date() < momentB.date()){
                                           return -1;
                                           } else if(momentA.date() > momentB.date()){
                                           return 1;
                                           } else {
                                           return 0;
                                           }
                                           }
                                            return 0;
                                       }
                                       );
                   $.each(data.reminders, function(i,reminder){
                          
                          //Workaround - START
                          
                          //timestamp
                          timestamp = new Date(reminder.rm_date);
                          
                          //reminderDate
                          var rmDate = moment(reminder.rm_date);
                          //console.log("-------------------" + rmDate);
                          
                          var rmDateYear = rmDate.year();
                          var rmDateMonth = rmDate.month();
                          var rmDateDay = rmDate.date();
                          
                          now = moment([currentYear, currentMonth, currentDay]);
                          if(now.isAfter(rmDate, 'years', 1)){
                            if(reminder.rm_type == "Jubiläum" || reminder.rm_type == "Hochzeit"){
                                return;
                            }
                          }
                          // Workaround - ENDE
                          
                          dayOfWeek = timestamp.getDay();
                          monthOfYear = timestamp.getMonth();
                          monthName = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
                          monthName = monthName[monthOfYear];
                          dayOfMonth = timestamp.getDate();
                          weekDay = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
                          dayOfWeek = weekDay[dayOfWeek];
                          yearOfYear = timestamp.getFullYear();
                          //---- BIRTHDAY ----//
                          
                          
                          //Workaround - START
                          
                          //age of person
                          reminderAge = getAge(timestamp);
                          //days to birthday
                          if(rmDateMonth < currentMonth && rmDateYear != currentYear) {
                              //event liegt im nächsten jahr
                                reminderOffsetDate = moment([currentYear+1, rmDateMonth, rmDateDay]);
                          }else {
                                reminderOffsetDate = moment([currentYear, rmDateMonth, rmDateDay]);
                          }
                           //console.log("---- rmDateMonth: " + rmDateMonth + ", rmCurrentDate: " + currentMonth);
                          reminderDaysToDate = reminderOffsetDate.diff(now, 'days');
                          reminderMonthsToDate = reminderOffsetDate.diff(now, 'months');
                          reminderYearsToDate = reminderOffsetDate.diff(rmDate, 'years ');
                          
                          // Workaround - ENDE
                          
                          //---- WEDDING ----//
                          
                          
                          //---- ANNIVERSARY ----//
                          finalDate = dayOfWeek + ", " + dayOfMonth + ". " + monthName;
                          finalDateMobile = dayOfMonth + ". " + monthName;
                          finalBirthdate = dayOfMonth + ". " + monthName + " " + yearOfYear;
                          idreminderdetail = reminder.rm_id;
                          
                          var presents = "";
                          var reminderText = "";
                          
                          //event type
                          reminderType = reminder.rm_type;
                          switch(reminderType) {
                          case "Geburtstag":
                              presents = "geschenk_geburtstag";
                              //calculate the age
                              reminderTypeText = "hat Geburtstag";
                              
                              if(reminderAge <= 0 ){
                                  if(reminderDaysToDate < 1){
                                      if(reminderOffsetDate.isSame(now, 'day')){
                                        reminderText = "wird heute geboren";
                                      } else {
                                        reminderText = "wird morgen geboren";
                                      }
                                  } else if(reminderDaysToDate == 1){
                                    reminderText = "wird morgen geboren";
                                  } else if(reminderDaysToDate == 2){
                                    reminderText = "wird übermorgen geboren";
                                  } else {
                                    reminderText = "wird in " + reminderDaysToDate + " Tagen geboren";
                                  }
                              } else {
                                  if(reminderDaysToDate < 1){
                                      if(reminderOffsetDate.isSame(now, 'day')){
                                        reminderText = "wird heute " + (reminderAge-1);
                                      } else {
                                        reminderText = "wird morgen " + reminderAge;
                                      }
                                  } else if(reminderDaysToDate == 1){
                                        reminderText = "wird morgen " + reminderAge;
                                  } else if(reminderDaysToDate == 2){
                                        reminderText = "wird übermorgen " + reminderAge;
                                  } else if(reminderDaysToDate < 30) {
                                        reminderText = "wird in " + reminderDaysToDate + " Tagen " + reminderAge;
                                  } else if(reminderDaysToDate >= 30) {
                                        if(reminderMonthsToDate == 0) {
                                            reminderTypText = "wird diesen Monat" + reminderAge + "<br />geboren am " + finalBirthdate;
                                        }else if (reminderMonthsToDate == 1) {
                                            reminderTypeText = "wird nächsten Monat " + reminderAge + "<br />geboren am " + finalBirthdate;
                                        }else if(reminderMonthsToDate > 1) {
                                            reminderText = "wird in " + reminderMonthsToDate + " Monaten " + reminderAge + "<br />geboren am " + finalBirthdate;
                                        }  
                                  }
                              }
                              break;
                          case "Hochzeit":
                              reminderTypeText = "feiert Hochzeit";
                              presents = "geschenk_hochzeit";
                                  if(reminderDaysToDate < 1){
                                      if(reminderOffsetDate.isSame(now, 'day')){
                                        reminderTypeText = "Hochzeit heute";
                                      } else {
                                        reminderTypeText = "Hochzeit morgen";
                                      }
                                  } else if(reminderDaysToDate == 1) {
                                        reminderTypeText = "Hochzeit morgen";
                                  } else if(reminderDaysToDate == 2) {
                                        reminderTypeText = "Hochzeit übermorgen";
                                  } else if(reminderDaysToDate < 30) {
                                        reminderTypeText = " Hochzeit in " + reminderDaysToDate + " Tagen";
                                  }else if(reminderDaysToDate > 30) {
                                        if(reminderMonthsToDate > 1) {
                                            reminderTypeText = "Hochzeit in " + reminderMonthsToDate + " Monaten";
                                        }else if (reminderMonthsToDate == 1) {
                                            reminderTypeText = "Hochzeit nächsten Monat";
                                        }else if(reminderMonthsToDate == 0) {
                                            reminderTypText = "Hochzeit diesen Monat";
                                        }
                                  }
                              
                              break;
                          case "Jubiläum":
                              presents = "geschenk_jubilaeum";
                              reminderTypeText = "feiert Jubiläum";

                              if(reminderDaysToDate < 1){
                                  if(reminderOffsetDate.isSame(now, 'day')){
                                    reminderTypeText = "Jubiläum heute";
                                  } else {
                                    reminderTypeText = "Jubiläum morgen";
                                  }
                              } else if(reminderDaysToDate == 1){
                                reminderTypeText = "Jubiläum morgen";
                              } else if(reminderDaysToDate == 2){
                                reminderTypeText = "Jubiläum übermorgen";
                              } else if(reminderDaysToDate < 30) {
                                reminderTypeText = "Jubiläum in " + reminderDaysToDate + " Tagen";
                              } else if(reminderDaysToDate > 30) {
                                    if (reminderMonthsToDate == 1) {
                                        reminderTypeText = "Jubiläum nächsten Monat";
                                    }else if(reminderMonthsToDate > 1) {
                                        reminderTypeText = "Jubiläum in " + reminderMonthsToDate + " Monaten";
                                    }else if(reminderMonthsToDate == 0) {
                                        reminderTypText = "Jubiläum diesen Monat";
                                    }
                              }
                              break;
                          }
                         
                          
                          //--- RANGE Calculation
                          // next seven days
                    
                          oneWeek = moment([currentYear, currentMonth, currentDay]).add('weeks', 1); //7 days from now
                          //next 30 days
                          oneMonth = moment([currentYear, currentMonth, currentDay]).add('months', 1);
                          //next year
                          oneYear = moment([currentYear, currentMonth, currentDay]).add('years', 1);
                       rmImage = "data:image/jpeg;base64,"+reminder.rm_image;
                          
                          weekRange = now.range(moment([currentYear, currentMonth, currentDay]), oneWeek);
                        //console.log(weekRange);   
                       monthRange = now.range(moment([currentYear, currentMonth, currentDay]), oneMonth);
                        //console.log(monthRange);   
                          yearRange = now.range(moment([currentYear, currentMonth, currentDay]), oneYear);
                        //console.log(yearRange);   
                        
                       
                       //console.log(reminder.rm_name + " ("+ reminderOffsetDate + " " + reminderOffsetDate.within(weekRange) +") is in week range " + reminderOffsetDate.within(weekRange));
                       
                       
                       if(reminderOffsetDate.within(weekRange)) {
                          reminderElementsMobileNext7Days += '<li id="reminder_'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                           //collect data for tablet view
                          reminderElementTabletContent =  "";
                          reminderElementTabletNav 	 =  "";
                          reminderElementTabletNav 	 =  '<div class="item" id="reminderTabletNav_'+reminder.rm_id+'"><img src="'+rmImage+'" width="100"><p class="reminderNavName">'+reminder.rm_name+'</p></div>';
                          reminderElementTabletContent =  '<div class="item" id="reminderTabletContent_'+reminder.rm_id+'"><div class="reminder_profile_detail"><div class="reminderprofile-pic-wrapper"><img height="100" class="reminderprofile-pic" src="'+rmImage+'" height="150" width="150" alt="'+reminder.rm_name+'"></div><div class="reminderprofile-text"><h1>'+reminder.rm_name+'</h1><p class="ui-li-desc">'+finalDate+'<br />'+reminderTypeText+'<br />' + reminderText + '</p><a href="" class="btn autowidth delete reminderDeleteButton" title="Diesen Eintrag löschen"><i class="fa fa-times-circle"></i><span class="label">Löschen</span></a></div><a href="#greetings" class="button greeting ui-link"><span data-icon="greeting" class="icon greeting"></span><span class="btn-text">Grusskarte versenden</span></a><div class="geschenke_tablet present'+reminder.rm_id+'"></div></div></div>';    
                              
                           
                          } else if (reminderOffsetDate.within(monthRange)) {
                          reminderElementsMobileNext30Days += '<li id="reminder_'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                              //collect data for tablet view
                          reminderElementTabletContent =  "";
                          reminderElementTabletNav 	 =  "";
                          reminderElementTabletNav 	 =  '<div class="item" id="reminderTabletNav_'+reminder.rm_id+'"><img src="'+rmImage+'" width="100"><p class="reminderNavName">'+reminder.rm_name+'</p></div>';
                          reminderElementTabletContent =  '<div class="item" id="reminderTabletContent_'+reminder.rm_id+'"><div class="reminder_profile_detail"><div class="reminderprofile-pic-wrapper"><img height="100" class="reminderprofile-pic" src="'+rmImage+'" height="150" width="150" alt="'+reminder.rm_name+'"></div><div class="reminderprofile-text"><h1>'+reminder.rm_name+'</h1><p class="ui-li-desc">'+finalDate+'<br />'+reminderTypeText+'<br />' + reminderText + '</p><a href="" class="btn autowidth delete reminderDeleteButton" title="Diesen Eintrag löschen"><i class="fa fa-times-circle"></i><span class="label">Löschen</span></a></div><a href="#greetings" class="button greeting ui-link"><span data-icon="greeting" class="icon greeting"></span><span class="btn-text">Grusskarte versenden</span></a><div class="geschenke_tablet present'+reminder.rm_id+'"></div></div></div>';    
                                
                              
                              
                          } else if (reminderOffsetDate.within(yearRange)) {
                          reminderElementsMobileAfter30Days += '<li id="reminder_'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                          
                          
                          //collect data for tablet view
                          reminderElementTabletContent =  "";
                          reminderElementTabletNav 	 =  "";
                          reminderElementTabletNav 	 =  '<div class="item" id="reminderTabletNav_'+reminder.rm_id+'"><img src="'+rmImage+'" width="100"><p class="reminderNavName">'+reminder.rm_name+'</p></div>';
                          reminderElementTabletContent =  '<div class="item" id="reminderTabletContent_'+reminder.rm_id+'"><div class="reminder_profile_detail"><div class="reminderprofile-pic-wrapper"><img height="100" class="reminderprofile-pic" src="'+rmImage+'" height="150" width="150" alt="'+reminder.rm_name+'"></div><div class="reminderprofile-text"><h1>'+reminder.rm_name+'</h1><p class="ui-li-desc">'+finalDate+'<br />'+reminderTypeText+'<br />' + reminderText + '</p><a href="" class="btn autowidth delete reminderDeleteButton" title="Diesen Eintrag löschen"><i class="fa fa-times-circle"></i><span class="label">Löschen</span></a></div><a href="#greetings" class="button greeting ui-link"><span data-icon="greeting" class="icon greeting"></span><span class="btn-text">Grusskarte versenden</span></a><div class="geschenke_tablet present'+reminder.rm_id+'"></div></div></div>';    
                              
                          }
                          //serve data to mobile view
                             
                    //add slide to owl slider
                   reminderNav.data('owlCarousel').addItem(reminderElementTabletNav);
                   reminderContent.data('owlCarousel').addItem(reminderElementTabletContent);
                      reinitReminders();

                          $(".geschenke_tablet.present"+reminder.rm_id).load( "http://oliverkierepka.de/kunden/schleyapp/"+presents+"_tablet.html" );
              });
                                      
                  
                   //mobile list view
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >In den nächsten 7 Tagen</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileNext7Days).listview('refresh');
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >in den nächsten 30 Tagen</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileNext30Days).listview('refresh');
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >in den nächsten 12 Monaten</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileAfter30Days).listview('refresh');
                   
                    //init delete buttons
                   
                //alert("success");
           },
           error: function(data){
            localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
           }
           
           });

    
    checkEmpty();

}



//getAge function
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age+1;
}


function reinitReminders() {
	reminderContentOwl.reinit();
  	reminderNavOwl.reinit();
}



//calc age
function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}



$(document).bind('pageinit', function(event) {
    var activePage = $(event.target).attr("data-role");        
    if(activePage != "dialog") {
        doResize();
    }
});



$(document).on('click', '#calcRouteBtn', function(e) {
       calculateRoute();
});

var directionDisplay, directionsService = new google.maps.DirectionsService(), map;

function initialize() {
	geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer();
	mapCenter = new google.maps.LatLng(51.40482, 6.95103);
    
	var myOptions = {
		zoom : 13,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : mapCenter
	};
    
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directions"));
	var image = 'img/mapmarker_schley.png';
	var schleymarker = new google.maps.Marker({
      position : mapCenter,
      map : map,
      icon : image
    });
}


$(document).on("pageinit", "#anfahrt", function(e) {               
    doResize();
    doResizeMaps();
    initialize();
});

$(document).on("pagebeforeshow", "#anfahrt", function() {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
});

function calculateRoute() {
    if( $("input#from").val() != "") {
        $.mobile.loading( 'show');
    
        var selectedMode = $("#mode").val();
        var start = $("#from").val();
        var end = $("#to").val();
        
        if (start == '' || end == '') {
            // cannot calculate route
            $("#results").hide();
            return;
        } else {
            var request = {
                origin : start,
                destination : end,
                travelMode : selectedMode
            };
            
            directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
    
                        directionsDisplay.setDirections(response);
                        $("#results").show();
                        /*
                         var myRoute = response.routes[0].legs[0];
                         for (var i = 0; i < myRoute.steps.length; i++) {
                         alert(myRoute.steps[i].instructions);
                         }
                         */
                    } else {
                        $("#results").hide();
                    }
                $.mobile.loading( 'hide');
            });
            
        }
    }else {
            localAlert("Bitte geben Sie den Start für die Routenberechnung an", "Bitte überprüfen Sie Ihre Eingaben");
            $("input#from").focus();
    }
}

function geoSuccess(position) {
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
    
	var startPosMarkerImage = 'img/mapmarker_start.png';
	var startLatLng = new google.maps.LatLng(lat,lon);
	var startposMarker = new google.maps.Marker({
        position : startLatLng,
        map : map,
        icon : startPosMarkerImage
    });
}

function geoError(error) {
	console.log( error );
}



//overlay content when panel is open
function addoverlay() {
	var docHeight = $(document).height();
	$("body").append("<div id='overlay'></div>");
	$("#overlay").height(docHeight).css({
                                        'opacity' : 0.6,
                                        'position' : 'absolute',
                                        'top' : 0,
                                        'left' : 0,
                                        'background-color' : 'black',
                                        'width' : '100%',
                                        'z-index' : 500
                                        });
}



var connectionStatus = false;

//capability vars for modernizr checks
var localStorage = true;
var sessionStorage = true;


$(document).on('offline online', function (event) {
    if(event.type == "offline") {
        connectionStatus = false;
    }else {
        connectionStatus = "online";
    }
});

function connectionCheck() {
    if(connectionStatus == "offline") {
        navigator.notification.alert('Sie sind offline! Bitte gehen Sie online um fortzufahren.','Sie sind Offline!','Ok');
        return false;
    }
}
function loggedInCheck() {
    if(window.localStorage.getItem("rememberme")) {
        //data must be in localStorage 
         var user_uid = window.localStorage.getItem("uid");
         var user_pass = window.localStorage.getItem("password");    
         var user_mail = window.localStorage.getItem("mail");
     }else {
        //find userdata in sessionStorage
        var user_uid = window.sessionStorage.getItem("uid");
        var user_pass = window.sessionStorage.getItem("password");
        var user_mail = window.sessionStorage.getItem("mail");
     }
    if(!user_uid || !user_pass) {
        window.localStorage.removeItem("uid");
        window.localStorage.removeItem("password");
        window.localStorage.removeItem("mail");
        window.sessionStorage.removeItem("uid");
        window.sessionStorage.removeItem("password");
        window.sessionStorage.removeItem("mail");
        $.mobile.changePage("#loggedout");
    }
} 

$(document).ready(function() {
    //fastclick
window.addEventListener('load', function() {
                        FastClick.attach(document.body);
                        }, false);

    if (!Modernizr.localstorage) {
        localStorage = false;
    }
    if(!Modernizr.sessionstorage) {
        sessionStorage = false;
    }
    
    var uid = "" ;
    var password = "";
    $("#timestamp").change(function() {
        //console.log("dfadsfdf");
     });
    
    //simple field validation
    eventName22 = $("#eventname");
    eventDate22 = $("#eventdate");
    eventtypeChecked22 = false;
    eventtype122 = $("#eventtype1");
    eventtype222 = $("#eventtype2");
    eventtype322 = $("#eventtype3");
    
    $("input[name='eventtype']").change(function() {
        checkEventTypeChecked();
    });
    
    
    
    
});


function checkEventTypeChecked() {
    if( eventtype122.is(":checked") || eventtype222.is(":checked") || eventtype322.is(":checked") ){ 
      eventtypeChecked22 = true;
    } else {
      eventtypeChecked22 = false;
    }
} 

$(document).bind('submit', '#reminderform2', function(event) {
    connectionCheck();           
    if(!window.localStorage.getItem("uid") || !window.localStorage.getItem("password") || window.localStorage.getItem("uid") == "" || window.localStorage.getItem("password") == "") {
                   var myuid = window.sessionStorage.getItem("uid");
                    var password = window.sessionStorage.getItem("password");
                }else {
                    var myuid = window.localStorage.getItem("uid");
                    var password = window.localStorage.getItem("password");
                }
        

               if(eventName22.val() != "" && eventDate22.val() != "" && eventtypeChecked22 == true) {
                        
                   var formData = new FormData($("#reminderform2")[0]);
                   
                   formData.append("uid", myuid);
                   formData.append("pswd", password);

                   $.ajax({
                          url: 'http://oliverkierepka.de/kunden/schleyapp/addreminder_neu.php',  //server script to process data
                          type: 'POST',
                          async: 'true',
                          dataType: 'json',
                          data: formData,
                          cache: false,
                          contentType: false,
                          processData: false,
                          beforeSend: function() {
                          // This callback function will trigger before data is sent
                            $.mobile.loading( 'show'); // This will show ajax spinner
                              //alert("before");
                          },
                          complete: function() {
                          // This callback function will trigger on data sent/received complete
                            //  alert("complete");
                   
                          },
                          success: function(data){
                          //alert("success now hiding loading message");
                            if(data.status == "ok") {
                                $.mobile.loading( 'hide'); // This will show ajax spinner
                                $.mobile.changePage("#reminder");
                            }
                          },
                          error: function(data){
                          localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
                          }
                          });
                   }else {
                       if(eventName22.val() == "") {
                            localAlert("Bitte geben Sie eine Eventbezeichnung an","Bitte überprüfen Sie Ihre Eingaben");
                       }else if(eventtypeChecked22 == false) {
                            localAlert("Bitte wählen Sie die Art des Events aus","Bitte überprüfen Sie Ihre Eingaben");
                       }else if(eventDate22.val() == "") {
                            localAlert("Bitte geben Sie eine Datum an","Bitte überprüfen Sie Ihre Eingaben");
                       }
                   }

               return false;

               });


// Swipe to remove list item

var listItem = "";
var transition = "";
var rmid = "";

function checkEmpty( elToCheck ) {    //bind the change event to the swiper and listview containers 
    $( "#reminderlist, #reminderTabletContent, #reminderNav" ).bind("DOMSubtreeModified",function(){
        if( $( "#reminderlist" ).find(".ui-btn").length != 0 ) {
            $( "#reminderlist" ).show();
            $( "#reminderNav" ).show();
            $( "#reminderContent" ).show();
    
            $(".noreminders_notice").hide();
        }else {
            $( "#reminderlist" ).hide();
            $( "#reminderNav" ).hide();
            $( "#reminderContent" ).hide();
            $(".noreminders_notice").show();
        } 
    });
}    



$( document ).on( "pageinit", "#reminder", function() {
            
    calImportState = window.localStorage.getItem("calImported");
    if(!calImportState) {
        window.setTimeout(function() { importCalendar(); }, 2000);
    }
    
    //calImport Function
    function importCalendar() {
        // PLUGIN CALENDAR IMPORT
        // prep some variables
        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        
        //set the date scope for the search to one year from the curent date
        startDate = new Date();
        endDate= new Date();
        endDate.setDate(startDate.getDate()+365);
        //title = "My nice event2";
        //location = "Home";
        //notes = "Some notes about this event 2.";
        
        // create event
        //window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
        
        // find event
        //window.plugins.calendar.findEvent('%nice%','%home%','%notes%',startDate, endDate,success,error);

        //promt to import calendar
        var calendarConfirm = confirm("Sollen Festtage aus dem Kalender importiert werden?");
        if ( calendarConfirm ) {
            var calImportSuccess = function(message) { 
                calImport = JSON.stringify(message);
                if( window.localStorage.getItem("rememberme") == 1 ) {
                    uid = window.localStorage.getItem("uid");
                    password = window.localStorage.getItem("password");
                }else {
                    uid = window.sessionStorage.getItem("uid");
                    password = window.sessionStorage.getItem("password");
                }
                
                $.ajax({
                       type: "POST",
                       async: true,
                       url: "http://oliverkierepka.de/kunden/schleyapp/importreminder.php",
                       dateType: "json",
                       data: {events: calImport, uid: uid, pswd: password},         
                       cache: false,
                       beforeSend: function() {
                           $.mobile.loading( 'show');
                           connectionCheck();
                       },
                       success: function(data){
                           $.mobile.loading( 'hide');
                           localAlert( "Kalendereinträge wurden erfolgreich importiert, Import erfolgreich" );
                           //window.localStorage.setItem("calImported", 1);
                           loadReminders();
                           return true;    
                       },
                       error: function(xhr, textStatus, errorThrown) {
                           $.mobile.loading( 'hide');
                           localAlert("Beim Kalenderimport sind Fehler aufgetreten! Bitte legen Sie Reminder manuell an.", "Fehler beim Kalender-Import!","Diesen Hinweis schließen");   
                           //window.localStorage.setItem("calImported", 1);
                           return false;
                       }
                });
            };
            var calImportError = function(message) { 
                localAlert("Es konnten keine Events importiert werden. Bitte legen Sie Ihre Event-Reminder manuell an","Fehler beim Kalender-Import");
                //window.localStorage.setItem("calImported", 1);
            };
        
            var types = '[{"search":"%Jubiläum%", "type":"2"},{"search":"%Geburtstag%", "type":"1"},{"search":"%Hochzeit%", "type":"3"}]';
            var arr = JSON.parse(types);
            calendar.findEvent(arr, startDate, endDate,calImportSuccess,calImportError); 
        
        }else {
            window.localStorage.setItem("calImported", 1);
        }
    }
    //tablet delete function
    $( document ).on("click", ".reminderDeleteButton", function() {
        var itemToRemove = $(this).closest('.item');
        var itemToRemoveId = itemToRemove.attr("id");
        //console.log(itemToRemoveId);
        rmid = itemToRemoveId.replace("reminderTabletContent_", "");
        console.log("item rmid: "+rmid);
        var listItem = "reminder_"+rmid; 
        var transition = "left";
        confirmAndDelete( listItem, transition, rmid );
    }); 
});

$( document ).on("pagebeforeshow", "#reminder", function() {
    loadReminders();
});

function confirmAndDelete( listItem, transition, rmid ) {
    // opacity down for element to delete
    $( "#"+listItem ).addClass( "todelete" );
    $( "#reminderTabletNav_"+rmid + ", #reminderTabletContent_"+rmid ).parent().addClass("todelete");
    // Inject topic in confirmation popup after removing any previous injected topics
    var entrytodeleteName = "";
    entrytodeleteName = $( "#"+listItem ).find( ".ui-li-heading" ).css({"font-weight":"bold"}).text();
    $("#entrytodelete").text(entrytodeleteName);
    // Show the confirmation popup

    //$( "#confirm" ).popup( "open" );
    // Proceed when the user confirms
   
     // process the confirmation dialog result
    function deleteReminderConfirm(buttonIndex) {
        if(buttonIndex == 2) {
            //delete it, user confirmed
            //run ajax request to remove item from db
            deleteReminder(rmid, listItem, transition);
        }else {
            //get out and leave like it is, user canceled
            $( "#"+listItem ).removeClass( "todelete" );
            $( "#reminderTabletNav_"+rmid + ", #reminderTabletContent_"+rmid ).closest(".owl-item").removeClass("todelete");
            $( "#confirm #yes" ).off();
        }
    }
    
    // Show a custom confirmation dialog
    var deleteQuestion = 'Möchten Sie ' + entrytodeleteName + ' wirklich löschen?';
    navigator.notification.confirm(
            '',                                 //message
            deleteReminderConfirm,             // callback to invoke with index of button pressed
            deleteQuestion,                        // title
            ['Abbrechen','Löschen']             // buttonLabels
    );

    $("body").removeClass("preventScroll");
}


//delete reminder entry function
function deleteReminder(rmid, listItem, transition) {
    var rmid = rmid;
    var listItem = listItem;
    var transition = transition;
    if( !window.localStorage.getItem("rememberme") ) {
        if( !window.sessionStorage.getItem("uid") || !window.sessionStorage.getItem("password") || window.sessionStorage.getItem("uid") == "" || window.sessionStorage.getItem("password") == "" ) {
            $( "#"+listItem ).removeClass( "todelete" );
            $( "#reminderTabletNav_"+rmid + ", #reminderTabletContent_"+rmid ).closest(".owl-item").removeClass("todelete");
            return false;

        }else {
            var myuid = window.sessionStorage.getItem("uid");
            var password = window.sessionStorage.getItem("password");
        }
    }else if( window.localStorage.getItem("rememberme") == 1 ) {
        if( !window.localStorage.getItem("uid") || !window.localStorage.getItem("password") || window.localStorage.getItem("uid") == "" || window.localStorage.getItem("password") == "" ) {
            $( "#"+listItem ).removeClass( "todelete" );
            $( "#reminderTabletNav_"+rmid + ", #reminderTabletContent_"+rmid ).closest(".owl-item").removeClass("todelete");
        	  return false;
        }else {
            var myuid = window.localStorage.getItem("uid");
            var password = window.localStorage.getItem("password");
        }
    }else {
        $( "#"+listItem ).removeClass( "todelete" );
        $( "#reminderTabletNav_"+rmid + ", #reminderTabletContent_"+rmid ).closest(".owl-item").removeClass("todelete");
        return false;
    }
    
    var formData = new FormData();
    formData.append("uid", myuid);
    formData.append("pswd", password);
    formData.append("rmid", rmid);

    $.ajax({
           url: 'http://oliverkierepka.de/kunden/schleyapp/reminder_delete.php',
           type: "POST",
           async: true,
           cache: false,
           dataType: 'json',
           data: formData,
           contentType: false,
           processData: false,
           
           beforeSend: function() {
                connectionCheck();           
                // This callback function will trigger before data is sent
                $.mobile.loading( 'show'); // This will show ajax spinner
           },
           complete: function() {   
               //console.log("deletion complete");
           },
           success: function(data){             
               //console.log("deletion success");   

           // This callback function will trigger on data sent/received complete
                
           },
           error: function(data){
                localAlert("Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut. Falls dieser Fehler weiterhin auftritt kontaktieren Sie bitte den technischen Support unter app@schley.de. Danke!","Eintrag konnte nicht gelöscht werden");
           }
           
           }).done(function( data, status ) {
                $.mobile.loading( 'hide'); // This will hide ajax spinner 
               //console.log("deletion done");                    
                if(data.status == "ok") {
                    //console.log("deletion status: "+data.status);
                    // Remove list item with a transition
                    if ( transition && $("#"+listItem).is(":visible") ) {
                        $( "#"+listItem ).addClass( "left" ).on( "webkitTransitionEnd transitionend otransitionend", function() {                               
                            
                            $( "#"+listItem ).remove();
                            $( "#reminderlist" ).listview( "refresh" );
                        });
                    }else {
                        $( "#"+listItem ).remove();
                        console.log( $( "#"+listItem ) );
                        $( "#reminderlist" ).listview( "refresh" );
                    }  
                    
                    //remove the corresponding tablet items too...
                    $( "#reminderTabletContent_"+rmid ).closest(".owl-item").remove();
                    $( "#reminderTabletNav_"+rmid ).closest(".owl-item").remove();
                    
                    //right now update the owl sliders 
                    reinitReminders();
                    reminderContentOwl.next(); 
                }
    });
    
    checkEmpty();
}


$(document).on("pagebeforeshow", "#addreminder", function() {
    $("#addreminderBtn").on("click", function() {
        $("#reminderform2").submit();
    });

                   $("input[name=eventdate2]").blur(function() {
                    var myDatecomes = $("input[name=eventdate2]").val();
                    //console.log(myDatecomes);
                    var myDate = moment(myDatecomes);
                    //console.log("test "+myDate.valueOf());
                    if(!isNaN(myDate)) {
                    $("input[name=eventdate]").val( myDate.valueOf() );
                    }else {
                    }
                });
               
               //Clear formfields
               $("#eventname, #eventdate, #eventdate2").val("");
               $(eventtype122, eventtype222, eventtype322).prop('checked', false).checkboxradio("refresh");
    
                
                picturePreviewIMG.attr("src","");
               picturePreview.hide();
               
               //hide eventDateBlock
               eventDateBlock.hide();
               removePhoto();
               
               $("input[name='eventtype']").change(function() {
                   var selectedType = $(this).val();
                   switch(selectedType) {
                       case "Geburtstag":
                           eventDateBlockLabel.text("Geburtsdatum");
                           break;
                       case "Jubiläum":
                           eventDateBlockLabel.text("Termin des Jubiläums");
                           break;
                       case "Hochzeit":
                           eventDateBlockLabel.text("Termin der Hochzeit");
                           break;
                   }
                   eventDateBlock.show();
                   
            });
});

$(document).on('submit', '#couponformular', function(event) {
   if($('#cp_mail').val().length > 0 && $('#cp_firstname').val().length > 0 && $('#cp_lastname').val().length > 0) {
       if($("label[for='cp_privacypolicy']").hasClass("ui-checkbox-on")) {
       // Send data to server through ajax call
   
           var uid = window.localStorage.getItem("uid");
           var password = window.localStorage.getItem("password");
           var formData = new FormData($("#couponformular")[0]);
           formData.append("uid", uid);
           formData.append("pswd", password);
               
           $.ajax({
                  url: 'http://oliverkierepka.de/kunden/schleyapp/getcoupon.php',
                  type: "POST",
                  async: true,
                  cache: false,
                  dataType: 'json',
                  data: formData,
                  contentType: false,
                  processData: false,
                  beforeSend: function() {
                      //console.log("before send");
                  // This callback function will trigger before data is sent
                  $.mobile.loading( 'show'); // This will show ajax spinner

                  },
                  success: function (data) {
                        //console.log("success");
                        coupon_success(data);
                  //return data from php file and change page accordingly
                  },
                  complete: function() {
                        //console.log("complete");
                        
                      // This callback function will trigger on data sent/received complete
                        $.mobile.loading( 'hide'); // This will hide ajax spinner
                      //redirect
                      $.mobile.changePage("#aktuellercoupon");
                  },
                  error: function (data) {
                      //console.log("error");
                  // This callback function will trigger on unsuccessful action
                      localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
                  }
                  });
           }else {
                localAlert("Bitte akzeptieren Sie die Datenschutzbedingungen!", "","Diesen Hinweis schließen");   
           }
       
   } else {
   localAlert("Bitte füllen Sie alle Felder aus.", "","Diesen Hinweis schließen");   
   }
   return false; // cancel original event to prevent form submitting
});

//native local notifications
function localAlert(alertMessage, alertTitle, alertButtonLabel) {
    navigator.notification.alert(alertMessage,alertCallback,alertTitle,alertButtonLabel);
}
function alertCallback() {
    //just an empty callback
}


// coupon_success function begin
function coupon_success(data) {
        console.log(data);
        //get the json response from php file
        var cp_firstname = data.cp_firstname;
        var cp_lastname = data.cp_lastname;
        var cp_mail = data.cp_mail;
        
        var cp_name = data.cp_name;
        var cp_start = data.cp_start;
        var cp_end = data.cp_end;
        var cpEndDate = moment(cp_end).format("D MMM YYYY");
    
        var cp_coffeeimg = data.cp_coffeeimg;
        var redirect = data.redirect;
        var cp_shoppingimg = data.cp_shoppingimg;
        var cp_valid = data.cp_valid;
        var signed = data.signed;
        var cp_coffee_used = data.coffee_used;
        var cp_shopping_used = data.shopping_used;
    
        if(cp_coffee_used == 1) {
            var coffeeLabel = "eingelöst";
        }else {
            var coffeeLabel = "Einlösen";
        }
        if(cp_shopping_used == 1) {
            var shoppingLabel = "eingelöst";
        }else {
            var shoppingLabel = "Einlösen";
        }
    
        if(cp_valid) {
            
                if(signed == true) {
                    
                    var disableCoffee = "";
                    var disableShopping = "";
            
                    if(cp_coffee_used == 1) {
                        disableCoffee = " used";
                    }
                    if(cp_shopping_used == 1) {
                        disableShopping = " used";
                    }
                  
                    //change button text
                    $("#schleycoupon_btn .label").text("Aktuellen Coupon anzeigen");
                    
                     //build the coupon output
                    aktuellerCouponContent = '<h2 class="centered" style="margin-top:20px">Ihr aktueller Coupon</h2><p class="centered">Gültig bis '+ cpEndDate +'</p><div class="owl-carousel" id="couponswiper"><div  class="item '+disableCoffee+'" id="coffeeCouponSlide"><img src="http://www.schley.de/coupons_app/'+ cp_coffeeimg +'" alt="" id="kaffeecoupon" /><a id="coffee_button" href="" class="btn couponbuttons"><i class="fa fa-check-circle pull-right"></i><span class="label">'+coffeeLabel+'</span></a></div><div class="item '+disableShopping+'" id="shoppingCouponSlide"><img src="http://www.schley.de/coupons_app/'+ cp_shoppingimg +'" alt="" /><a id="shopping_button" href="" class="btn couponbuttons"><i class="fa fa-check-circle pull-right"></i><span class="label">'+shoppingLabel+'</span></a></div></div>';
                     
                        
                            
                        $("#aktuellercoupon .ui-content").html(aktuellerCouponContent);
                    
                   
                    
                        $("#couponswiper").owlCarousel({
                           slideSpeed : 300,
                           paginationSpeed : 400,
                           items: 2
                       });
                    
                         //init coupon buttons
                        couponowl = $("#couponswiper").data('owlCarousel');
                        
                        if(cp_coffee_used == 0) {
                            $("#coffee_button").on("click", function(e) {
                                  useCoupon(e);
                            });
                        }
                        if(cp_shopping_used == 0) {
                            $("#shopping_button").on("click", function(e) {
                                  useCoupon(e);
                            });
                        }
                }else {
                     $("#schleycoupon_btn .label").text("Coupon abholen");
                }            
                $("a#schleycoupon_btn").attr("href", redirect);
            
                }else {
                        //show an patience message
                        $("#coupon .ui-content").html('<img src="img/gutschein_no.gif" class="centered" alt=""><h2 class="centered">Coupon nicht mehr gültig</h2><p class="centered">Ein neuer Schley Coupon wird bald hier verfügbar sein.</p>');
                    }
                
                
               
    
}

$(document).on("pagebeforeshow", "#aktuellercoupon", function() {          
    checkCoupon(); 
});
$(document).on("pagebeforeshow", "#coupon", function(e) {
    checkCoupon();
});

//Kaffegutschein einlösen function
function useCoupon(e) {
    usedCoupon = e.currentTarget.id;
    usedCoupon = usedCoupon.replace("_button", "");
    
    if(usedCoupon == "coffee") {
        var whatUsed = "Kaffeecoupon";
    }else {
        var whatUsed = "Einkaufsgutschein";
    }
    var localConfirmTitle = whatUsed + " wirklich einlösen?";
    var localConfirmMessage = "Bitte lösen Sie diesen " + whatUsed +  " nur bei uns vor Ort ein.";
    
    navigator.notification.confirm(localConfirmMessage, couponCallback, localConfirmTitle, ["Später einlösen", "Jetzt Einlösen"]);
    
    function couponCallback(buttonIndex) {
        if(buttonIndex == 2) {
            var uid = window.localStorage.getItem("uid");
            var password = window.localStorage.getItem("password");
            $.ajax({
                   url: 'http://oliverkierepka.de/kunden/schleyapp/coupon_used.php', 
                   type: "POST",
                   async: false,
                   cache: false,
                   dataType: 'json',
                   data: { uid: uid, pswd: password, used: usedCoupon },
                   beforeSend: function() {
                       //console.log("beforeSend");
                       // This callback function will trigger before data is sent
                        $.mobile.loading( 'show'); // This will show ajax spinner
                   },
                   complete: function() {
                        //console.log("complete");
                   },
                   success: function(data){
                        // This callback function will trigger on data sent/received complete
                        $.mobile.loading( 'hide'); // This will hide ajax spinner
                        var coffeeused = data.cp_coffeeused;
                        var shoppingused = data.cp_shoppingused;
                        couponeinloesen(e, coffeeused, shoppingused);
                        
                   },
                   error: function(data){
                        localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
                   }
                   
            });
        }
    }
    
    
}


 //Kaffegutschein einlösen function
function couponeinloesen(e, mycoffeeused, myshoppingused) {
    if(e) {
        
        var callFrom = e.type;
        var coffeeused2 = mycoffeeused;
        var shoppingused2 = myshoppingused;
        
        if(callFrom == "click") {
            if(e.currentTarget.id == "coffee_button") {
                localAlert("Vielen Dank!","Kaffegutschein eingelöst!"); 
            }else if(e.currentTarget.id == "shopping_button") {
                localAlert("Vielen Dank!","Einkaufsgutschein eingelöst!"); 
            }
        }
        //alert(coffeeused2);
        if(coffeeused2 == 1) {
            $("#coffee_button .label").text("eingelöst");
            $("#coffeeCouponSlide").addClass("used");
        }
        if(shoppingused2 == 1) {
            $("#shopping_button .label").text("eingelöst");
            $("#shoppingCouponSlide").addClass("used");
        }
        
    }else {
        localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
    }
}

function checkCoupon() {

    if( window.localStorage.getItem("rememberme") ) {
        var uid = window.localStorage.getItem("uid");
        var password = window.localStorage.getItem("password");
    }else {
        var uid = window.sessionStorage.getItem("uid");
        var password = window.sessionStorage.getItem("password");
    }
    $.ajax({
           url: 'http://oliverkierepka.de/kunden/schleyapp/checkcoupon.php',
           type: "POST",
           async: true,
           cache: false,
           dataType: 'json',
           data: { uid: uid, pswd: password },
           beforeSend: function() {
               //console.log("beforeSend");
               // This callback function will trigger before data is sent
                $.mobile.loading( 'show'); // This will show ajax spinner
           },
           complete: function() {
                //console.log("complete");
           },
           success: function(data){
                // This callback function will trigger on data sent/received complete
                $.mobile.loading( 'hide'); // This will hide ajax spinner
                coupon_success(data);
                
               
           },
           error: function(data){
                localAlert("Bitte versuchen Sie es erneut! Falls der Fehler weiterhin auftritt wenden Sie sich gerne an den technischen Support unter app@schley.de. Vielen Dank.", "Es ist ein Fehler aufgetreten!","Diesen Hinweis schließen");   
           }
           
    });
}

$(document).on("pagebeforeshow", "registrieren", function() {
    $("form#RegisterForm").find("input[type='text'], input[type='email'], input[type='password']").val("");
});


$(document).on("pagebeforeshow", function() {
     connectionCheck();
     if( $.mobile.activePage.attr("id") != "loggedout" && $.mobile.activePage.attr("id") != "login" && $.mobile.activePage.attr("id") != "registrieren" && $.mobile.activePage.attr("id") != "calsuccess" && $.mobile.activePage.attr("id") != "calerror" && $.mobile.activePage.attr("id") != "registersuccess" && $.mobile.activePage.attr("id") != "greetings_sent" ) {
         loggedInCheck();
     }
 });

$(document).on("pagebeforeshow", "#login", function() {
    if(localStorage) {
        $("input[name='name']").val(window.localStorage.getItem("uid"));
        $("input[name='password']").val(window.localStorage.getItem("password"));
        //rememberme checkbox status change
        if(window.localStorage.getItem("rememberme")) {
            $("#rememberme").attr("checked",true).checkboxradio("refresh");
        }
    }else {
        $("#rememberme").hide();
    }
});
$(document).on('click', '#btnLogin', function(event) {
               var SignInFormData = $("#SignInForm").serialize();
               $.ajax({
                      url: 'http://oliverkierepka.de/kunden/schleyapp/login_register/user/login.php',  //server script to process data
                      type: 'POST',
                      // Form data
                      data: SignInFormData,
                      //Ajax events
                      beforeSend: function() {
                        // This callback function will trigger before data is sent
                          connectionCheck();           

                        $.mobile.loading( 'show'); // This will show ajax spinner
                      },
                      complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.loading( 'hide'); // This will hide ajax spinner
                      },
                      success: function(data){
                        if(data.status == 'ok'){
                        $("#SignInFormMessage").hide().html('');
                      
                        var username = $("input#name").val();
                        var password = $("input#password").val();
                        if($("#rememberme").is(":checked")) {
                              
                            if(localStorage) {   
                                window.localStorage.setItem("uid", username);
                                window.localStorage.setItem("password", password);
                                window.localStorage.setItem("rememberme", 1);
                            }
                        }else {   
                            //remove item 
                            if( sessionStorage ) {
                                window.sessionStorage.setItem("uid", username);
                                window.sessionStorage.setItem("password", password);
                            }
                            window.localStorage.removeItem("uid");
                            window.localStorage.removeItem("password");
                            window.localStorage.removeItem("rememberme");
                            window.localStorage.removeItem("mail");
                        }
                      $.mobile.changePage(data.page);
                      
                      } else {
                      $("#SignInFormMessage").html(data.message).show();
                      $.mobile.changePage(data.page);
                      }
                      },
                      error: function(data){
                      $("#SignInFormMessage").html("Bitte füllen Sie alle Felder aus!").show();
                      }
                      });
               return false; // cancel original event to prevent form submitting
               
               });



$(document).on('click', '#RegisterForm #btnRegister', function(event) {
               var RegisterFormData = $("#RegisterForm").serialize();
               $.ajax({
                      url: 'http://oliverkierepka.de/kunden/schleyapp/login_register/user/register.php',
                      type: 'POST',
                      data: RegisterFormData,
                      //Ajax events
                      beforeSend: function() {
                              connectionCheck();           

                      // This callback function will trigger before data is sent
                      $.mobile.loading( 'show'); // This will show ajax spinner
                      },
                      complete: function() {
                      // This callback function will trigger on data sent/received complete
                      $.mobile.loading( 'hide'); // This will hide ajax spinner
                      },
                      success: function(data){
                      $.mobile.loading( 'hide'); // This will hide ajax spinner
                      
                      
                      if(data.status == 'ok'){
                        window.localStorage.removeItem("uid");
                        window.sessionStorage.removeItem("uid");
                        window.localStorage.removeItem("password");
                        window.sessionStorage.removeItem("password");
                        window.localStorage.removeItem("mail");
                        window.sessionStorage.removeItem("mail");
                          
                        window.localStorage.setItem("uid", data.username);
                        window.localStorage.setItem("password", data.password);
                      $("#RegisterFormMessage").html('').hide();
                      $.mobile.changePage(data.page);
                      } else {
                      $("#RegisterFormMessage").html(data.message).show();
                      $.mobile.changePage(data.page);
                      }
                      },
                      error: function(data){
                      $("#RegisterFormMessage").html("Bitte füllen Sie alle Felder aus!").show();
                      
                      }
                      });
               return false; // cancel original event to prevent form submitting
               });

function CheckEmail(email) {
    var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
    return (reg.test(email));
}

$(document).on('change', '#reg-name', function(event) {
               return dbCheckUserName();
               });
$(document).on('blur', '#reg-email', function(e) {
               return dbCheckEmail();
               });
$(document).on('focusout', '#reg-password', function(e) {
               return CheckPassword();
               });
$(document).on('blur', '#name', function(e) {
               return checkSignInUsername();
               });
$(document).on('blur', '#password', function(e) {
               return checkSignInPass();
               });

function dbCheckEmail() {
    if ($('#reg-email').val() == '' ||!CheckEmail($('#reg-email').val())) {
        $("#reg-email").parent().addClass('error');
        return false;
    }
    var ret = false;
    $('#reg-email').addClass('ajax-loading');
    $.ajax({
           url: $("#RegisterForm").attr('action'),
           data: 'action=check_email&email=' + $("#reg-email").val(),
           dataType: 'json',
           type: 'POST',
           beforeSend: function() {
                   connectionCheck();           

           $('#reg-email').addClass('ajax-loading');
           },
           success: function(r) {
           if (r.ok == true) {
           $("#reg-email").parent().removeClass('error');
           ret = true;
           } else {
           $("#reg-email").parent().addClass('error');
           ret = false;
           }
           },
           error: function(data){
                navigator.notification.alert(
                    'Es ist ein Fehler aufgetreten! Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.','Fehler aufgetreten','Ok');
           },
           complete: function() {
           $('#reg-email').removeClass('ajax-loading');
           }
           });
    return ret;
}
function dbCheckUserName() {
    if ($('#reg-name').val() == '') {
        $("#reg-name").parent().addClass('error');
        return false;
    }
    ret = false;
    $.ajax({
           url: $("#RegisterForm").attr('action'),
           data: 'action=check_username&username=' + $("#reg-name").val(),
           dataType: 'json',
           type: 'POST',
           beforeSend: function() {
                   connectionCheck();           

           $('#reg-name').addClass('ajax-loading');
           },
           success: function(r) {
           if (r.ok == true) {
           $("#reg-name").parent().removeClass('error');
           ret = true;
           } else {
           $("#reg-name").parent().addClass('error');
           ret = false;
           }
           },
           error: function(data){
            navigator.notification.alert(
                    'Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.','Es ist ein Fehler aufgetreten!','Ok');
           },
           complete: function() {
           $('#reg-name').removeClass('ajax-loading');
           }
           });
    return ret;
}

function CheckPassword() {
    var ret = false;
    if ($('#reg-password').val() == '') {
        $('#reg-password').parent().addClass('error');
        ret = false;
    } else {
        $('#reg-password').parent().removeClass('error');
        ret = true;
    }
    return ret;
}

function checkSignInUsername() {
    var username = $('#name');
    if (username.val() == '') {
        username.parent().addClass('error');
        return false;
    } else {
        username.parent().removeClass('error');
        return true;
    }
}

function checkSignInPass() {
    var password = $('#password');
    if (password.val() == '') {
        password.parent().addClass('error');
        return false;
    } else {
        password.parent().removeClass('error');
        return true;
    }
}

document.addEventListener("deviceready", onDeviceReady, false);



fileinput = "";
takePhotoBtn = "";
takePhotoBtnText = "";
choosePhotoBtn = "";
choosePhotoBtnText = "";

picturePreview = "";
picturePreviewIMG = "";
eventDateBlock = "";
removePictureBtn = "";
couponowl = "";
aktuellerCouponContent = "";
eventtype122 = "";
eventtype222 = "";
eventtype322 = "";

//reminder swiper tablet
reminderContent = "";
reminderNav = "";
reminderNavOwl = "";
reminderContentOwl = "";


$(document).ready(function() {
      fileinput = $("#eventphoto");
      takePhotoBtn = $("#takePhotoBtn");
      takePhotoBtnText = $("#takePhotoBtn .ui-btn-text");
      choosePhotoBtn = $("#choosePhotoBtn");
      choosePhotoBtnText = $("#choosePhotoBtn .ui-btn-text");
      picturePreview = $("#reminderPicPreview");
      picturePreviewIMG = $("#reminderPicPreview img");
      eventDateBlock = $("#eventDateBlock");
      eventDateBlockLabel = $("#eventdateLabel");
      removePictureBtn = $("#removeReminderPicPreviewBtn");
      //bind delete button method
      removePictureBtn.bind("click", function(e) {
         e.preventDefault();
         removePhoto();
      });
    
    //set momentjs lang 
    moment.lang('de');
});  	 

function onDeviceReady() {
    //show the statusbar    
    StatusBar.overlaysWebView(false);
    StatusBar.styleLightContent();
	StatusBar.backgroundColorByHexString("#a6ce39");
    StatusBar.show();

    //alert the device model
    var model = device.model;
    var deviceModel = "";
    //translate the modelnumbers to human readable format
    switch( model ) {
        //iphone
        case "iPhone1,1":
            deviceModel = "iPhone2G";
            break;
        case "iPhone1,2":
            deviceModel = "iPhone3G";
            break;
        case "iPhone2,1 ":
            deviceModel = "iPhone3GS";
            break;
        case "iPhone3,1":
            deviceModel = "iPhone4";
            break;
        case "iPhone3,2":
            deviceModel = "iPhone4";
            break;
        case "iPhone3,3":
            deviceModel = "iPhone4";
            break;
        case "iPhone4,1":
            deviceModel = "iPhone4S";
            break;
        case "iPhone5,1":
            deviceModel = "iPhone5";
            break;
        case "iPhone5,2":
            deviceModel = "iPhone5";
            break;
        case "iPhone5,3":
            deviceModel = "iPhone5C";
            break;
        case "iPhone6,1":
            deviceModel = "iPhone5S";
            break;
        //IPAD
        case "iPad1,1":
            deviceModel = "iPad1G";
            break;
        case "iPad2,1":
            deviceModel = "iPad2";
            break;
        case "iPad2,1":
            deviceModel = "iPad2";
            break;
        case "iPad2,2":
            deviceModel = "iPad2";
            break;
        case "iPad2,3":
            deviceModel = "iPad2";
            break;
        case "iPad2,4":
            deviceModel = "iPad2";
            break;
        case "iPad3,1":
            deviceModel = "iPad3";
            break;
        case "iPad3,2":
            deviceModel = "iPad3";
            break;
        case "iPad3,3":
            deviceModel = "iPad3";
            break;
        case "iPad3,4":
            deviceModel = "iPad4";
            break;
        case "iPad3,3":
            deviceModel = "iPad4";
            break;
        case "iPad3,4":
            deviceModel = "iPad4";
            break;
        case "iPad3,5":
            deviceModel = "iPad4";
            break;
        case "iPad3,6":
            deviceModel = "iPad4";
            break;
        //IPAD AIR
        case "iPad4,1":
            deviceModel = "iPadAir";
            break;
        case "iPad4,2":
            deviceModel = "iPadAir";
            break;
        case "iPad4,3":
            deviceModel = "iPadAir";
            break;
        //IPAD MINI
        case "iPad2,5":
            deviceModel = "iPadmini1G";
            break;
        case "iPad2,6":
            deviceModel = "iPadmini1G";
            break;
        case "iPad2,7":
            deviceModel = "iPadmini1G";
            break;
        case "iPad4,4":
            deviceModel = "iPadmini2G";
            break;
        case "iPad4,5":
            deviceModel = "iPadmini2G";
            break;
        case "iPad4,6":
            deviceModel = "iPadmini2G";
            break;
        //iPod touch
        case "iPod1,1":
            deviceModel = "iPodtouch1G";
            break;
        case "iPod2,1":
            deviceModel = "iPodtouch2G";
            break;
        case "iPod3,1":
            deviceModel = "iPodtouch3G";
            break;
        case "iPod4,1":
            deviceModel = "iPodtouch4G";
            break;
        case "iPod5,1":
            deviceModel = "iPodtouch5G";
            break;
        default:
            break;
    }
    //group by resolution
    //alert( deviceModel );
    
    
    //online offline status
    //document.addEventListener("online", onOnline, false);
    
	//menu button toggles panel
	document.addEventListener("menubutton", togglePanel, false);
    
    //show the takePhotoButton and bind the click event
    takePhotoBtn.show().bind("click", function(e) {
                             e.preventDefault();
                             takePhoto();
                             });
    choosePhotoBtn.show().bind("click", function(e) {
                             e.preventDefault();
                             selectPhoto();
                             });
	
    //open all "_blank" links in inappbrowser
    $("a[target='_blank']").bind('click', function (e) {
                                 e.preventDefault();
                                 var targetURL = $(this).attr("href");
                                 window.open(targetURL, "_system");
                                 });

}


//open panel menu on press the menu button (android only)
function togglePanel() {
	$("#optionspanel").panel("toggle");
} 

//camera function 
function takePhoto() {
	navigator.camera.getPicture(CameraURISuccess, CameraonFail, { 
        quality: 49,
        destinationType: 0, //0 = base64, 1 = dataURI
        allowEdit : true,
        encodingType: 0, //0 = jpeg, 1 = png
        targetWidth: 200,
        targetHeight: 200,
        saveToPhotoAlbum: false,
        correctOrientation:1
    });
}

//camera function 
function selectPhoto() {
	navigator.camera.getPicture(CameraURISuccess, CameraonFail, { 
        quality: 49,
        destinationType: 0, //0 = base64, 1 = dataURI
        allowEdit : true,
        encodingType: 0, //0 = jpeg, 1 = png
        targetWidth: 200,
        targetHeight: 200,
        correctOrientation:1,
        mediaType: 0, 
        sourceType: 0
        });
}

// Called when a photo is successfully retrieved
function CameraURISuccess(imageURI) {
    
    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    picturePreview.show();
    picturePreviewIMG.attr("src","data:image/jpeg;base64," + imageURI);
    fileinput.val(imageURI);
    removePictureBtn.show();
}

function CameraonFail(message) {
}

function removePhoto() {
    fileinput.val("/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAyMSA3OS4xNTQ5MTEsIDIwMTMvMTAvMjktMTE6NDc6MTYgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NUM3NjkwMzdFMTgxMUUzQUQwMEREOTc0ODU0QTk4MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NUM3NjkwNDdFMTgxMUUzQUQwMEREOTc0ODU0QTk4MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg1Qzc2OTAxN0UxODExRTNBRDAwREQ5NzQ4NTRBOTgzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg1Qzc2OTAyN0UxODExRTNBRDAwREQ5NzQ4NTRBOTgzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMC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");
    picturePreviewIMG.attr("src", "");
    picturePreview.hide();
    removePictureBtn.hide();
}
