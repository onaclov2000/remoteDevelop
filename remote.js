var FB_URL = require('./gitconfig').FB_URL;
var GIT_REPO = require('./gitconfig').GIT_REPO;
var Firebase = require('firebase');
var myRootRef = new Firebase(FB_URL);
var spawn = require('child_process').spawn;
var initialize = false;

// OK, basically, the first time we call this, we want to ignore, then we're good,
// second, you'll need to have cloned initially in teh same folder, then after that, you're good.
// third, you'll need webhooks, and put that path into gitconfig.js, and your git repo in there too.

myRootRef.limitToLast(1).on('child_added', function(childSnapshot, prevChildName) {
   // code to handle child data changes.
   var data = childSnapshot.val();
   var localref = childSnapshot.ref();
    console.log("got here")
    if (initialize){
          console.log("Pull me some new code");
          pull    = spawn('git', ['pull', GIT_REPO]);
          pull.on('close', function (code) {
            console.log("Clone Complete");
            // re-run ant, then re-run the test.
            ant    = spawn('ant');
            ant.stderr.on('data',function(buf) {
	          console.log(buf.toString('utf8'));
            });
            ant.on('close', function (code) {
		console.log(code);
            console.log("Built jar");
            
            // finally upload results to AWS.
 	    //./send-to-s3.py path/to/my/local/file "mystore/mybackups"
            // Then re-run the test.
               test_results = ""
               fourpeaks    = spawn('java', ['-cp', 'ABAGAIL.jar', 'opt.test.FourPeaksTest']);
               fourpeaks.stdout.on('data',function(buf) {
	          test_results = test_results + buf
               });
	       fourpeaks.stderr.on('data',function(buf) {
	          test_results = test_results + buf
               });
               fourpeaks.on('close', function (code) {
               var fs = require('fs');
                the_time = new Date().getTime()
                filename = "/home/tyson/machine_learning/Assignment2/onaclov2000/ABAGAIL/fourpeaks_log_" + the_time + ".txt"
                fs.writeFile(filename, test_results, function(err) {
                if(err) {
                    return console.log(err);
                  }
		 send_to_s3    = spawn('./send-to-s3.py', [filename, 'ML/abagail/test_results']);
                 console.log("The file was saved!");
		 send_to_s3.stderr.on('data', function(buf){
                
		 });
                 send_to_s3.on('close', function (code) {
                 
                 console.log("The file was uploaded!");
		  }); 
                }); 
               console.log("Completed Test Run");
               //console.log(test_results);
            // re-run ant, then re-run the test.
            // finally upload results to AWS.
 	    //./send-to-s3.py path/to/my/local/file "mystore/mybackups"
          
                });
             });
            // finally upload results to AWS.
 	    //./send-to-s3.py path/to/my/local/file "mystore/mybackups"
          });
    }
    initialize = true;
});
