##Project - WW 

Extention of Web Worker. It enables you :     

_to write your web worker code wherever you want ! ( just a TaskWorker Object able to convert itself to Blob Url);    
_avoid managing with odd Web Worker syntax. (arguments are sent and received in the same order)    
_reduce sources of errors.    
_manage your worker behaviour with Listeners (as many as you want).   
_think like you're only used to think !!    


##Usage : 


###Create a WW.WorkerTask :
	
```javascript
var myTask = new WW.WorkerTask();
```

Add whatever function to your WorkerTask with function :

Don't miss the Reply function call in order to send your worker response to the client.

```javascript
myTask.addListener('worker_listener_name', function( /* eventually args */){
	
	/* your worker task code executed by the web worker */

	Reply('client_listener_name', /* eventually args */);
})
```

######Exemple :

```javascript
myTask.addListener('bonjour', function(o){
	Reply('print', "Bonjour "+o);
});
```


######If you need an external script in your worker context :

```javascript
myTask.addExternalScript("my_external_script.js");
```


###Then create a WW.Worker :

```javascript
var myWorker = new WW.Worker(myTask.toBlob(), /*Default Listener : Optionnal ,  OnError Function : Optionnal*/);
```

And now add your Listener called from your WW.WorkerTask Listener ( cf : Reply):

######Exemple :

########Note : that you receive results in the same order you sent them.

```javascript
myWorker.addListener('print', function (pResult) {
	alert(pResult);
});
```

That's All, By now you can reach whatever Listener you've added before 
by calling the method Query on you WW.Worker Object. 

######Exemple :

```javascript
myWorker.Query("bonjour", "Friends");
```

###Transferable Objects :

With WW, there's no major difference between ArrayBuffer, ArrayBufferView or any other variable.
Juste put it in argument !

In your WorkerTask Listener :

```javascript
myTask.addListener('native_example',
	function(pArg){
		var ab = pArg;
		Reply('print',  ab);
	});
```

at Last you can Query your worker as usual like this :

```javascript
myWorker.Query("native_example", my_native_array);
```

########Note : that you receive results in the same order you sent them.

Performance doesn't seems to be tremendously affected by my work since i use WW
in my WebGL video game. For some details, check the three examples in the bundle.
()