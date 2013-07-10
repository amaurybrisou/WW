#Project - WW 

Extention of Web Worker

Usage : 

Create a WW.WorkerTask :
	
var myTask = new WW.WorkerTask();


Add Whatever function to your WorkerTask with function :

Warning : Don't miss the Reply function call in order to send your worker response
		  to the client.

addListener('listener_name', function( /* eventually args */){
	/* your worker task code executed by the web worker */
	Reply('client_listener_name', /* eventually args */);
})

exemple :

myTask.addListener('bonjour', function(o){
	Reply('print', "Bonjour "+o);
});

Then create a web WW.Worker like that :

var myWorker = new WW.Worker(myTask.toBlob());

And now add your Listener called from your WW.WorkerTask Listener ( cf : Reply):

for exemple :

myWorker.addListener('print', function (pResult) {
	alert(pResult);
});


That's All, By now you can reach whatever Listener you've added before 
by calling the method Query on you WW.Worker Object. 
(Query("WW.WorkerTask Listener_name", /* args */))

for exemple : 

myWorker.Query("bonjour", "Amaury");


forthcoming !
