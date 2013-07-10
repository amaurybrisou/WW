#Project - WW 

Extention of Web Worker

Usage : 

Create a WW.WorkerTask :
	
var myTask = new WW.WorkerTask();


Add Whatever function to your WorkerTask with function :

addListener('listener_name', function( /* eventually args */){
	/* your worker task code executed by the web worker */
})

exemple :

myTask.addListener('bonjour', function(o){
	Reply('print', "Bonjour "+o);
});

Then create a web WW.Worker like that :

var myWorker = new WW.Worker(myTask.toBlob());


That's All, By now you can reach whatever Listener you've add before 
by calling the method Query on you WW.Worker Object.

for exemple : 

myWorker.Query("bonjour", "Amaury");


forthcoming !
