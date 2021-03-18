

// START NORMAL STUFF //
$(document).bind("mobileinit", function() {
                 //apply overrides here
                 $.extend($.mobile, {
                          loadingMessage : "lade",
                          loadingMessageTextVisible : true,
                          pageLoadErrorMessage : "Seite konnte nicht geladen werden",
                          phonegapNavigationEnabled : true,
                          touchOverflowEnabled : true,
                          allowCrossDomainPages : true,
                          transitionFallbacks : "fade",
                          });
                 
                 
                 //button shadow off
                 $('a').buttonMarkup({
                                     iconshadow : false
                                     });
                 
                 $.fn.buttonMarkup.defaults.corners = false;
                 
                 
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



$(document).bind("pagebeforeshow", "#greetings",  function(event) {
                 greetingcardslider = $("#greetingcards");
                 greetingcardslider.owlCarousel({
                                                slideSpeed : 300,
                                                paginationSpeed : 400,
                                                singleItem:true,
                                                itemsTablet: [768,2],
                                                itemsMobile : [479,1],
                                                afterAction: setecard
                                                });
                 });
//change ecard number on swiper change
function setecard() {
	ecardnumber = this.currentItem;
	activeecard = "grusskarte0" + (ecardnumber + 1);
	$("input#ecard").val(activeecard);
	////console.log(activeecard);
}

$(document).on("pageinit", "#reminder", loadReminders );







//logout function
// clear local storage credentials
// redirect to login page
function logMeout() {
	if(!window.localStorage.getItem("rememberme")) {
        window.localStorage.removeItem("uid");
	    window.localStorage.removeItem("password");
        window.localStorage.removeItem("cp_used");
    }else {
    }
    window.sessionStorage.removeItem("uid");
    window.sessionStorage.removeItem("password");
    $.mobile.changePage("#login");
    
}


//load reminders
function loadReminders() {
    $.mobile.showPageLoadingMsg(true);
	//console.log(window.localStorage.getItem("uid"));
	//console.log(window.localStorage.getItem("password"));
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
           $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
           },
           complete: function() {
           //alert("complete");
           },
           success: function(data){
           // This callback function will trigger on data sent/received complete
           $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
           //alert("success");
           },
           error: function(data){
           alert("Es ist ein Fehler aufgetreten! Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.");
           }
           
           }).done(function( data, status ) {
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
                   .addClass("synced")
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
                   reminderNav.trigger("owl.goTo", num - reminderNavvisible.length+2)
                   }else{
                   if(num - 1 === -1){
                   num = 0;
                   }
                   reminderNav.trigger("owl.goTo", num);
                   }
                   } else if(num === reminderNavvisible[reminderNavvisible.length-1]){
                   reminderNav.trigger("owl.goTo", reminderNavvisible[1])
                   } else if(num === reminderNavvisible[0]){
                   reminderNav.trigger("owl.goTo", num-1)
                   }
                   
                   }
                   reminderContent = "";
                   reminderContent = $("#reminderContent").owlCarousel({
                                                                       singleItem : true,
                                                                       slideSpeed : 100,
                                                                       animation: false,
                                                                       pagination:false,
                                                                       afterAction : syncPosition,
                                                                       responsiveRefreshRate : 200
                                                                       });
                   reminderNav = "";
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
                            if(reminder.rm_type == "Jubiläum"){
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
                          reminderOffsetDate = moment([currentYear, rmDateMonth, rmDateDay]);
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
                              presents = "geschenk_hochzeit";
                              if(reminderYearsToDate < 25) {
                                  if(reminderDaysToDate < 1){
                                      if(reminderOffsetDate.isSame(now, 'day')){
                                        reminderTypeText = "feiert heute Hochzeit";
                                      } else {
                                        reminderTypeText = "feiert morgen Hochzeit";
                                      }
                                  } else if(reminderDaysToDate == 1) {
                                        reminderTypeText = "feiert morgen Hochzeit";
                                  } else if(reminderDaysToDate == 2) {
                                        reminderTypeText = "feiert übermorgen Hochzeit";
                                  } else if(reminderDaysToDate < 30) {
                                        reminderTypeText = "feiert in " + reminderDaysToDate + " Tagen Hochzeit";
                                  }else if(reminderDaysToDate > 30) {
                                        if(reminderMonthsToDate > 1) {
                                            reminderTypeText = "feiert in " + reminderMonthsToDate + " Monaten Hochzeit";
                                        }else if (reminderMonthsToDate == 1) {
                                            reminderTypeText = "feiert nächsten Monat Hochzeit";
                                        }else if(reminderMonthsToDate == 0) {
                                            reminderTypText = "feiert diesen Monat Hochzeit";
                                        }
                                  }
                              }else if(reminderYearsToDate == 25) {
                                    if(reminderDaysToDate < 1){
                                          if(reminderOffsetDate.isSame(now, 'day')){
                                            reminderTypeText = "feiert heute Silberhochzeit";
                                          } else {
                                            reminderTypeText = "feiert morgen Silberhochzeit";
                                          }
                                      } else if(reminderDaysToDate == 1) {
                                            reminderTypeText = "feiert morgen Silberhochzeit";
                                      } else if(reminderDaysToDate == 2) {
                                            reminderTypeText = "feiert übermorgen Silberhochzeit";
                                      } else if(reminderDaysToDate < 30) {
                                            reminderTypeText = "feiert in " + reminderDaysToDate + " Tagen Silberhochzeit";
                                      }else if(reminderDaysToDate > 30) {
                                            if(reminderMonthsToDate > 1) {
                                                reminderTypeText = "feiert in " + reminderMonthsToDate + " Monaten Silberhochzeit";
                                            }else if (reminderMonthsToDate == 1) {
                                                reminderTypeText = "feiert nächsten Monat Silberhochzeit";
                                            }else if(reminderMonthsToDate == 0) {
                                                reminderTypText = "feiert diesen Monat Silberhochzeit";
                                            }
                                      }
                                    presents = "geschenk_jubilaeum";

                              }else if(reminderYearsToDate == 50) {
                                    if(reminderDaysToDate < 1){
                                          if(reminderOffsetDate.isSame(now, 'day')){
                                            reminderTypeText = "feiert heute goldene Hochzeit";
                                          } else {
                                            reminderTypeText = "feiert morgen goldene Hochzeit";
                                          }
                                      } else if(reminderDaysToDate == 1) {
                                            reminderTypeText = "feiert morgen goldene Hochzeit";
                                      } else if(reminderDaysToDate == 2) {
                                            reminderTypeText = "feiert übermorgen goldene Hochzeit";
                                      } else if(reminderDaysToDate < 30) {
                                            reminderTypeText = "feiert in " + reminderDaysToDate + " Tagen goldene Hochzeit";
                                      }else if(reminderDaysToDate > 30) {
                                            if(reminderMonthsToDate > 1) {
                                                reminderTypeText = "feiert in " + reminderMonthsToDate + " Monaten goldene Hochzeit";
                                            }else if (reminderMonthsToDate == 1) {
                                                reminderTypeText = "feiert nächsten Monat goldene Hochzeit";
                                            }else if(reminderMonthsToDate == 0) {
                                                reminderTypText = "feiert diesen Monat goldene Hochzeit";
                                            }
                                      }
                                    presents = "geschenk_jubilaeum";

                              }else if(reminderYearsToDate == 60) {
                                    if(reminderDaysToDate < 1){
                                          if(reminderOffsetDate.isSame(now, 'day')){
                                            reminderTypeText = "feiert heute goldene Diamantene Hochzeit";
                                          } else {
                                            reminderTypeText = "feiert morgen goldene Diamantene Hochzeit";
                                          }
                                      } else if(reminderDaysToDate == 1) {
                                            reminderTypeText = "feiert morgen goldene Diamantene Hochzeit";
                                      } else if(reminderDaysToDate == 2) {
                                            reminderTypeText = "feiert übermorgen goldene Diamantene Hochzeit";
                                      } else if(reminderDaysToDate < 30) {
                                            reminderTypeText = "feiert in " + reminderDaysToDate + " Tagen goldene Diamantene Hochzeit";
                                      }else if(reminderDaysToDate > 30) {
                                            if(reminderMonthsToDate > 1) {
                                                reminderTypeText = "feiert in " + reminderMonthsToDate + " Monaten goldene Diamantene Hochzeit";
                                            }else if (reminderMonthsToDate == 1) {
                                                reminderTypeText = "feiert nächsten Monat goldene Diamantene Hochzeit";
                                            }else if(reminderMonthsToDate == 0) {
                                                reminderTypText = "feiert diesen Monat goldene Diamantene Hochzeit";
                                            }
                                      }
                                    presents = "geschenk_jubilaeum";

                              }else {
                                    return;
                              }
                              break;
                          case "Jubiläum":
                              presents = "geschenk_jubilaeum";
                              if(reminderDaysToDate < 1){
                                  if(reminderOffsetDate.isSame(now, 'day')){
                                    reminderTypeText = "feiert heute Jubiläum";
                                  } else {
                                    reminderTypeText = "feiert morgen Jubiläum";
                                  }
                              } else if(reminderDaysToDate == 1){
                                reminderTypeText = "feiert morgen Jubiläum";
                              } else if(reminderDaysToDate == 2){
                                reminderTypeText = "feiert übermorgen Jubiläum";
                              } else if(reminderDaysToDate < 30) {
                                reminderTypeText = "feiert in " + reminderDaysToDate + " Tagen Jubiläum";
                              } else if(reminderDaysToDate > 30) {
                                    if (reminderMonthsToDate == 1) {
                                        reminderTypeText = "feiert nächsten Monat Jubiläum";
                                    }else if(reminderMonthsToDate > 1) {
                                        reminderTypeText = "feiert in " + reminderMonthsToDate + " Monaten Jubiläum";
                                    }else if(reminderMonthsToDate == 0) {
                                        reminderTypText = "feiert diesen Monat Jubiläum";
                                    }
                              }
                              break;
                          }
                         
                          
                          //--- RANGE Calculation
                          // next seven days
                          oneWeek = moment([currentYear, currentMonth, currentDay]).add('weeks', 1); //8 days from now
                       //alert(oneWeek);
                          oneMonth = moment([currentYear, currentMonth, currentDay]).add('months', 1);
                       //alert(oneMonth);
                       oneYear = moment([currentYear, currentMonth, currentDay]).add('year', 1);
                         // alert(oneYear);
                       rmImage = "data:image/jpeg;base64,"+reminder.rm_image;
                          
                          weekRange = now.range(moment([currentYear, currentMonth, currentDay]), oneWeek);
                        console.log(weekRange);   
                       monthRange = now.range(moment([currentYear, currentMonth, currentDay]), oneMonth);
                        console.log(monthRange);   
                          yearRange = now.range(moment([currentYear, currentMonth, currentDay]), oneYear);
                        console.log(yearRange);   
                        console.log(reminder.rm_name + " " + reminderOffsetDate.within(yearRange));
                       
                       if(reminderOffsetDate.within(weekRange)) {
                          reminderElementsMobileNext7Days += '<li data-swipeurl="swiped.html?'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                          } else if (reminderOffsetDate.within(monthRange)) {
                          reminderElementsMobileNext30Days += '<li data-swipeurl="swiped.html?'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                          } else if (reminderOffsetDate.within(yearRange)) {
                          reminderElementsMobileAfter30Days += '<li data-swipeurl="swiped.html?'+reminder.rm_id+'"><a href="http://oliverkierepka.de/kunden/schleyapp/'+presents+'.html" data-transition="slide"><img src="'+rmImage+'" id="rmImage'+i+'" alt="'+reminder.rm_name+'" width="150" /><h3 class="ui-li-heading">'+reminder.rm_name+'</h3><p>'+reminderTypeText+'</p><p>' + reminderText + '</p><span class="ui-li-aside">'+finalDateMobile+'</span></a></li>';
                          }
                          //serve data to mobile view
                          
                          //collect data for tablet view
                          reminderElementTabletContent =  "";
                          reminderElementTabletNav 	 =  "";
                          reminderElementTabletNav 	 =  '<div class="item"><img src="'+rmImage+'" width="100"><p class="reminderNavName">'+reminder.rm_name+'</p></div>';
                          reminderElementTabletContent =  '<div class="item"><div class="reminder_profile_detail clearfix"><div class="reminderprofile-pic-wrapper"><img height="100" class="reminderprofile-pic" src="'+rmImage+'" height="150" width="150" alt="'+reminder.rm_name+'"></div><div class="reminderprofile-text"><h1>'+reminder.rm_name+'</h1><p class="ui-li-desc">'+finalDate+'<br />'+reminderTypeText+'<br />' + reminderText + '</p></div><a href="#greetings" class="button greeting ui-link"><span data-icon="greeting" class="icon greeting"></span><span class="btn-text">Grusskarte versenden</span></a><div class="geschenke_tablet present'+reminder.rm_id+'"></div></div></div>';
                          
                          
                          //add slide to owl slider
                          reminderNav.data('owlCarousel').addItem(reminderElementTabletNav);
                          reminderContent.data('owlCarousel').addItem(reminderElementTabletContent);
                          
                          $(".geschenke_tablet.present"+reminder.rm_id).load( "http://oliverkierepka.de/kunden/schleyapp/"+presents+"_tablet.html" );
                          });
                   reinitReminders();
                   //mobile list view
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >In den nächsten 7 Tagen</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileNext7Days).listview('refresh');
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >in den nächsten 30 Tagen</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileNext30Days).listview('refresh');
                   $('ul#reminderlist').append('<li data-role="list-divider" role="heading" >in den nächsten 12 Monaten</li>').listview('refresh');
                   $('ul#reminderlist').append(reminderElementsMobileAfter30Days).listview('refresh');
                   });
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
    return age;
}


function reinitReminders() {
	reminderContent.data('owlCarousel').reinit({singleItem:true})
  	reminderNav.data('owlCarousel').reinit();
}



//calc age
function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//following code runs every time before a page is shown
$(document).bind("pageinit", function() {
                 //resize
                 doResize();
                 });


$(document).on("pageinit", "#anfahrt", function() {
               doResizeMaps();
               initialize();
               });

$(document).on('click', '#anfahrt #submit2', function(e) {
               e.preventDefault();
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
	}
    
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

function calculateRoute() {
	var selectedMode = $("#mode").val(), start = $("#from").val(), end = $("#to").val();
    
	if (start == '' || end == '') {
		// cannot calculate route
		$("#results").hide();
		return;
	} else {
		var request = {
			origin : start,
			destination : end,
			travelMode : google.maps.DirectionsTravelMode[selectedMode]
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
                                });
        
	}
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success, error);
} else {
	alert("Not Supported!");
}
function success(position) {
	//console.log(position.coords.latitude);
	//console.log(position.coords.longitude);
	var startPosMarkerImage = 'img/mapmarker_start.png';
	var startLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var startposMarker = new google.maps.Marker({
                                                position : startLatLng,
                                                map : map,
                                                icon : startPosMarkerImage
                                                });
}

function error(msg) {
	//console.log( typeof msg == 'string' ? msg : "error");
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
function loadpage() {
	$.mobile.loadPage( "http://oliverkierepka.de/kunden/schleyapp/aktuellercoupon.php", true, {
                      type: "post",
                      pageContainer: "#currentcoupon",
                      changeHash : true,
                      data: $("#couponformular").serialize()
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
        alert('Sie sind offline! Bitte gehen Sie online um fortzufahren.');
        return false;
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

$(document).on('submit', '#reminderform2', function(event) {
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
                          $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                              //alert("before");
                          },
                          complete: function() {
                          // This callback function will trigger on data sent/received complete
                            //  alert("complete");
                   
                          },
                          success: function(data){
                          //alert("success now hiding loading message");
                            if(data.status = "ok") {
                                loadReminders();
                                $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                                $.mobile.changePage("#reminder");
                            }
                          },
                          error: function(data){
                          alert("Es ist ein Fehler aufgetreten! Wir bitten dies zu entschuldigen. Wenn der Fehler weiterhin auftritt dann schreiben Sie bitte ein E-Mail an app@schley.de. Danke für Ihre Mithilfe.");
                          }
                          });
                   }else {
                       if(eventName22.val() == "") {
                            alert("Bitte geben Sie einen Namen für das Event an");
                       }else if(eventtypeChecked22 == false) {
                            alert("Bitte wählen Sie die Art des Events aus");
                       }else if(eventDate22.val() == "") {
                            alert("Bitte geben Sie ein Datum an");
                       }
                   }

               return false;

               });



$(document).on("pagebeforeshow", "#addreminder", function() {
               
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
               $(eventtype122, eventtype222, eventtype322).prop('checked', false);
        
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




$(document).on('click', '#couponformular #submit3', function(event) {
               if($('#cp_mail').val().length > 0 && $('#cp_firstname').val().length > 0 && $('#cp_lastname').val().length > 0) {
               if($("label[for='cp_privacypolicy']").hasClass("ui-checkbox-on")) {
               // Send data to server through ajax call
               var formData = $("#couponformular").serialize();
               $.ajax({
                      url: 'http://oliverkierepka.de/kunden/schleyapp/getcoupon.php',
                      data: formData,
                      type: 'POST',
                      beforeSend: function() {
                      // This callback function will trigger before data is sent
                      $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                      },
                      complete: function() {
                      // This callback function will trigger on data sent/received complete
                      $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                      },
                      success: function (data) {
                      //return data from php file and change page accordingly
                      coupon_success(data);
                      },
                      error: function (data) {
                      // This callback function will trigger on unsuccessful action
                      alert('Es ist ein Fehler aufgetreten! Bitte versuchen Sie es erneut!');
                      }
                      });
               }else {
               alert("Bitte akzeptieren Sie unsere Datenschutzbedingungen");
               }
               } else {
               alert('Bitte füllen Sie alle Felder aus!');
               }
               return false; // cancel original event to prevent form submitting
               });




//------ COUPON: SUCCESS CALLBACK begin ------ //
function coupon_success(data) {
    
    //get the json response from php file
    var response = $.parseJSON(data);
	//console.log(response);
       var cp_firstname = response.cp_firstname;
       var cp_lastname = response.cp_lastname;
       var cp_mail = response.cp_mail;
    
    var cp_name = response.cp_name;
    var cp_start = response.cp_start;
    var cp_end = response.cp_end;
    var cp_coffeeimg = response.cp_coffeeimg;
    var cp_shoppingimg = response.cp_shoppingimg;
    
    //write data to local storage
    if($.jStorage.storageAvailable()) {
        
        window.localStorage.setItem("cp_firstname", cp_firstname);
        window.localStorage.setItem("cp_lastname", cp_lastname);
        window.localStorage.setItem("cp_mail", cp_mail);
        
        window.localStorage.setItem("cp_name", cp_name);
        window.localStorage.setItem("cp_start", cp_start);
        window.localStorage.setItem("cp_end", cp_end);
        window.localStorage.setItem("cp_coffeeimg", cp_coffeeimg);
        window.localStorage.setItem("cp_shoppingimg", cp_shoppingimg);
    }
    //change to aktueller coupon page
	showcoupon(data);
}
//--- COUPON: SUCCESS CALLBACK end ---//

// Show coupon function begin
function showcoupon(data) {
    //get the json response from php file
    var coupon = $.parseJSON(data);
    var cp_name = coupon.cp_name;
    var cp_start = coupon.cp_start;
    var cp_end = coupon.cp_end;
    var cp_coffeeimg = coupon.cp_coffeeimg;
    var cp_shoppingimg = coupon.cp_shoppingimg;
    
    var valid = coupon.valid;
    
    if(valid) {
        //build the coupon output
        $("#aktuellercoupon .ui-content").html('<h2 class="centered" style="margin-top:20px">Ihr aktueller Coupon</h2><p class="centered">Gültig bis '+ cp_end +'</p><div class="owl-carousel" id="couponswiper"><div  class="item"><img src="http://www.schley.de/coupons_app/'+ cp_coffeeimg +'" alt="" id="kaffeecoupon" /><a href="" data-role="button" id="coupon_button" class="fakebutton">Kaffegutschein einlösen</a></div><div class="item"><img src="http://www.schley.de/coupons_app/'+ cp_shoppingimg +'" alt="" /></div></div>');
        $("#couponswiper").owlCarousel({
                                       slideSpeed : 300,
                                       paginationSpeed : 400,
                                       items: 2
                                       });
    }else {
        //show an patience message
        $("#aktuellercoupon .ui-content").html('<img src="img/gutschein_no.gif" class="centered" alt=""><h2 class="centered">Coupon nicht mehr gültig</h2><p class="centered">Ein neuer Schley Coupon wird bald hier verfügbar sein.</p>');
    }
    
	
	
}



// Show coupon function end


//Kaffegutschein einlösen function
function kaffegutscheineinloesen(e) {
    window.localStorage.setItem("cp_used", 1);
    alert("Der Kaffegutschein wurde eingelöst! Vielen Dank!");
    $("#coupon_button, #kaffeecoupon").addClass("disabled");
     e.preventDefault();
    $("#coupon_button").text("bereits eingelöst");
}


$(document).on("pagebeforeshow", "#coupon", function(event) {
               
                   $.ajax({
                          url: 'http://oliverkierepka.de/kunden/schleyapp/getcoupon.php',
                          beforeSend: function() {
                          // This callback function will trigger before data is sent
                          $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                          },
                          complete: function() {
                          // This callback function will trigger on data sent/received complete
                          $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                          },
                          success: function (data) {
                          //return data from php file and change page accordingly
                          
                              coupon_success(data);
                          },
                          error: function (data) {
                          // This callback function will trigger on unsuccessful action
                          alert('Es ist ein Fehler aufgetreten! Bitte versuchen Sie es erneut!');
                          }
                          });
                   
                   if(localStorage) {
                   if(window.localStorage.getItem("cp_name") && window.localStorage.getItem("cp_firstname") && window.localStorage.getItem("cp_lastname") && window.localStorage.getItem("cp_end") && window.localStorage.getItem("cp_mail")) {
                   $("#schleycoupon_btn .ui-btn-text").text("Aktuellen Coupon anzeigen");
                   $("#schleycoupon_btn").attr("href", "#aktuellercoupon");
                   }else {
                   //Do nothing and show the normal button
                   }
                   }else {
                   //local storage is not available ... so show the form
                   //show the button that goes to the form
                   }
                
   });

$(document).on("pageshow", "#aktuellercoupon", function() {
    
    if(localStorage && window.localStorage.getItem("cp_used") == 1) {
        $("#coupon_button, #kaffeecoupon").addClass("disabled");
        $("#coupon_button").text("bereits eingelöst");
    }else {
        $("#coupon_button").on("click", function() {
            kaffegutscheineinloesen();
        });
    }
    
});

$(document).on("pagebeforeshow", "#aktuellercoupon", function(event) {
               $.ajax({
                      url: 'http://oliverkierepka.de/kunden/schleyapp/getcoupon.php',
                      beforeSend: function() {
                      // This callback function will trigger before data is sent
                      $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                      },
                      complete: function() {
                      // This callback function will trigger on data sent/received complete
                      $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                      },
                      success: function (data) {
                      //return data from php file and change page accordingly
                        showcoupon(data);
                      },
                      error: function (data) {
                      // This callback function will trigger on unsuccessful action
                      alert('Es ist ein Fehler aufgetreten! Bitte versuchen Sie es erneut!');
                      }
                      });
               
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
$(document).on('submit', '#SignInForm', function(event) {
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

                        $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                      },
                      complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
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
                            }
                        }else {
                            if(sessionStorage) {
                                window.sessionStorage.setItem("uid", username);
                                window.sessionStorage.setItem("password", password);
                                window.localStorage.removeItem("uid");
                                window.localStorage.removeItem("password");
                            }
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
                      $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                      },
                      complete: function() {
                      // This callback function will trigger on data sent/received complete
                      $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                      },
                      success: function(data){
                      $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                      
                      
                      if(data.status == 'ok'){
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
    return (reg.test(email))
}

$(document).on('change', '#reg-name', function(event) {
               return dbCheckUserName();
               });
$(document).on('blur', '#reg-email', function(e) {
               return dbCheckEmail()
               });
$(document).on('focusout', '#reg-password', function(e) {
               return CheckPassword()
               });
$(document).on('blur', '#name', function(e) {
               return checkSignInUsername()
               });
$(document).on('blur', '#password', function(e) {
               return checkSignInPass()
               });

function dbCheckEmail() {
    if ($('#reg-email').val() == '' ||!CheckEmail($('#reg-email').val())) {
        $("#reg-email").parent().addClass('error');
        return false
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

           $('#reg-email').addClass('ajax-loading')
           },
           success: function(r) {
           if (r.ok == true) {
           $("#reg-email").parent().removeClass('error');
           ret = true
           } else {
           $("#reg-email").parent().addClass('error');
           ret = false
           }
           },
           error: function(data){
           alert("Some Error!");
           },
           complete: function() {
           $('#reg-email').removeClass('ajax-loading')
           }
           });
    return ret
}
function dbCheckUserName() {
    if ($('#reg-name').val() == '') {
        $("#reg-name").parent().addClass('error');
        return false
    }
    ret = false;
    $.ajax({
           url: $("#RegisterForm").attr('action'),
           data: 'action=check_username&username=' + $("#reg-name").val(),
           dataType: 'json',
           type: 'POST',
           beforeSend: function() {
                   connectionCheck();           

           $('#reg-name').addClass('ajax-loading')
           },
           success: function(r) {
           if (r.ok == true) {
           $("#reg-name").parent().removeClass('error');
           ret = true
           } else {
           $("#reg-name").parent().addClass('error');
           ret = false
           }
           },
           error: function(data){
           alert("Some Error!");
           },
           complete: function() {
           $('#reg-name').removeClass('ajax-loading')
           }
           });
    return ret
}

function CheckPassword() {
    var ret = false;
    if ($('#reg-password').val() == '') {
        $('#reg-password').parent().addClass('error');
        ret = false
    } else {
        $('#reg-password').parent().removeClass('error');
        ret = true
    }
    return ret
}

function checkSignInUsername() {
    var username = $('#name');
    if (username.val() == '') {
        username.parent().addClass('error');
        return false
    } else {
        username.parent().removeClass('error');
        return true
    }
}

function checkSignInPass() {
    var password = $('#password');
    if (password.val() == '') {
        password.parent().addClass('error');
        return false
    } else {
        password.parent().removeClass('error');
        return true
    }
}

document.addEventListener("deviceready", onDeviceReady, false);



fileinput = "";
takePhotoBtn = "";
takePhotoBtnText = "";
picturePreview = "";
picturePreviewIMG = "";
eventDateBlock = "";
removePictureBtn = "";

$(document).ready(function() {
      fileinput = $("#eventphoto");
      takePhotoBtn = $("#takePhotoBtn");
      takePhotoBtnText = $("#takePhotoBtn .ui-btn-text");
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
});  	 

function onDeviceReady() {
	
	//online offline status
    //document.addEventListener("online", onOnline, false);
    
	//menu button toggles panel
	document.addEventListener("menubutton", togglePanel, false);
    
    //show the takePhotoButton and bind the click event
    takePhotoBtn.show().bind("click", function(e) {
                             e.preventDefault();
                             takePhoto();
                             });
	
    //open all "_blank" links in inappbrowser
    $("a[target='_blank']").bind('click', function (e) {
                                 e.preventDefault();
                                 var targetURL = $(this).attr("href");
                                 window.open(targetURL, "_system");
                                 });
	
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
    
	calImportState = window.localStorage.getItem("calImported");
	
	success = function(message) { 
		calImport = JSON.stringify(message);
		window.localStorage.setItem("calImported", 1);
		
        uid = window.localStorage.getItem("uid");
        password = window.localStorage.getItem("password");
        
		$.ajax({
               type: "POST",
               async: false,
               url: "http://oliverkierepka.de/kunden/schleyapp/importreminder.php",
               dateType: "json",
               data: {events: calImport, uid: uid, pswd: password},
               beforeSend:     function() {
               connectionCheck();
               },
               success: function(data){
               alert("hat geklappt" + data);
               // code does not stop with this solution
               //task: find solution like alert
               $.mobile.changePage( "#calsuccess", { role: "dialog" } );
               // link the ok button in the dialoge to #dashboard
               return true;
               },
               error: function(xhr, textStatus, errorThrown) {
               //alert('ajax loading error...');
               $.mobile.changePage( "#calerror", { role: "dialog" } );
               return false;
               // link the ok button in the dialoge to #dashboard
               }
               });
	}
	
	error = function(message) { 
		alert("Es konnten keine Events importiert werden. Bitte legen Sie Events manuell an"); 
	}
	
    //check if storage var for importing cal entries is done before (set)
    if(!calImportState) {
     	var types = '[{"search":"%Jubiläum%", "type":"2"},{"search":"%Geburtstag%", "type":"1"},{"search":"%Hochzeit%", "type":"3"}]';
     	var arr = JSON.parse(types);
     	calendar.findEvent(arr, startDate, endDate,success,error);
    }else {
     	//do nothing
    }
	
	
	
}


//open panel menu on press the menu button (android only)
function togglePanel() {
	$("#optionspanel").panel("toggle");
} 

//camera function 
function takePhoto() {
    picturePreview.hide();
	navigator.camera.getPicture(CameraURISuccess, CameraonFail, { 
        quality: 49,
        destinationType: 0, //0 = base64, 1 = dataURI
        allowEdit : false,
        encodingType: 0, //0 = jpeg, 1 = png
        targetWidth: 200,
        targetHeight: 200,
        saveToPhotoAlbum: false,
        correctOrientation:1
        });
}

// Called when a photo is successfully retrieved
function CameraURISuccess(imageURI) {
    
    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    picturePreview.show();
    picturePreviewIMG.attr("src","data:image/jpeg;base64," + imageURI);
    fileinput.val(imageURI);
    takePhotoBtnText.text("Foto erneut aufnehmen");
    removePictureBtn.show();
}

function CameraonFail(message) {
    //alert('Fehler: ' + message);
}

function removePhoto() {
    fileinput.val("/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAyMSA3OS4xNTQ5MTEsIDIwMTMvMTAvMjktMTE6NDc6MTYgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NUM3NjkwMzdFMTgxMUUzQUQwMEREOTc0ODU0QTk4MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NUM3NjkwNDdFMTgxMUUzQUQwMEREOTc0ODU0QTk4MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg1Qzc2OTAxN0UxODExRTNBRDAwREQ5NzQ4NTRBOTgzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg1Qzc2OTAyN0UxODExRTNBRDAwREQ5NzQ4NTRBOTgzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMC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");
    picturePreviewIMG.attr("src", "");
    picturePreview.hide();
    removePictureBtn.hide();
    $(takePhotoBtnText).text("Foto aufnehmen");
}
