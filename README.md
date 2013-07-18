##Project - WW 

Extention of Web Worker

###Basic Usage : 

Create a WW.WorkerTask :
	
```javascript
var myTask = new WW.WorkerTask();
```

Add Whatever function to your WorkerTask with function :

Don't miss the Reply function call in order to send your worker response to the client.

addListener('listener_name', function( /* eventually args */){
	/* your worker task code executed by the web worker */
	Reply('client_listener_name', /* eventually args */);
})

exemple :

```javascript
myTask.addListener('bonjour', function(o){
	Reply('print', "Bonjour "+o);
});
```

Then create a web WW.Worker like that :

```javascript
var myWorker = new WW.Worker(myTask.toBlob());
```
And now add your Listener called from your WW.WorkerTask Listener ( cf : Reply):

for exemple :

Note that you receive results in the same order you sent them.

```javascript
myWorker.addListener('print', function (pResult) {
	alert(pResult);
});
```

That's All, By now you can reach whatever Listener you've added before 
by calling the method Query on you WW.Worker Object. 
(Query("WW.WorkerTask Listener_name", /* args */))

for exemple :

```javascript
myWorker.Query("bonjour", "Friends");
```

##Advance Usage, Transferable Objects :

In your WorkerTask Listener :

```javascript
myTask.addListener('native_example', function(pArgs){
								var ab = pArgs[0];
								Reply('print',  ab);
							});
```

at Last you can Query your worker as usual like this :

```javascript
myWorker.Query("native_example", my_native_array);
```
