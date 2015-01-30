var FB_URL = require('./gitconfig').FB_URL;
var GIT_REPO = require('./gitconfig').GIT_REPO;
var Firebase = require('firebase');
var myRootRef = new Firebase(FB_URL);
var spawn = require('child_process').spawn;
var initialize = false;


myRootRef.limitToLast(1).on('child_added', function(childSnapshot, prevChildName) {
   // code to handle child data changes.
   var data = childSnapshot.val();
   var localref = childSnapshot.ref();

    if (initialize){
       if (data["commits"][0]["modified"][0] == "app.js") {
          console.log("Pull me some new code");
          result    = spawn('git', ['pull', GIT_REPO]);
          result.on('close', function (code) {
            console.log("Got the data good");
          });
       }
       //console.log(data["commits"]);
    }
    initialize = true;
});
