$(document).ready(function() {

  
 
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
	    		 var reminderContent = $("#reminderContent").owlCarousel({
				    singleItem : true,
				    slideSpeed : 1000,
				    navigation: true,
				    pagination:false,
				    afterAction : syncPosition,
				    responsiveRefreshRate : 200
				  });
				 	
				
				  var reminderNav = $("#reminderNav").owlCarousel({
				    items : 15,
				    itemsDesktop      : [1199,10],
				    itemsDesktopSmall : [979,10],
				    itemsTablet       : [768,8],
				    itemsMobile       : [479,4],
				    pagination:false,
				    responsiveRefreshRate : 100,
				    afterInit : function(el){
				      el.find(".owl-item").eq(0).addClass("synced");
				    }
				  });
				  
			
});
