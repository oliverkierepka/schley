"use strict";


//get vars from url
function getUriVars( URIwithVars ) {
    var URIvars = {};
    var parts = URIwithVars.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        URIvars[key] = value;
    });
    return URIvars;
}
//handle custom urls
function handleOpenURL(url) {
  setTimeout(function() {
      //alert("received url: " + url);
      var URIVars2 = getUriVars( url );
       //save each var and key to sessionStorage
      window.sessionStorage.setItem("sm", URIVars2.sm );
      //alert( URIVars2.sm + " " + URIVars2.rm );
      window.sessionStorage.setItem("rm",URIVars2.rm);
      window.sessionStorage.setItem("se",URIVars2.se);   
      window.sessionStorage.setItem("ecardDate",URIVars2.ecarddate);   
      confirmGreetingCheck();
      //alert( window.sessionStorage.getItem("se") + " " + window.sessionStorage.getItem("sm") + " " + window.sessionStorage.getItem("rm") + " " + window.sessionStorage.getItem("ecardDate") );

  }, 0);

}