if(typeof WW == 'undefined') WW = {};

WW.Worker = function(pURL, pListener, pOnError ){
	Worker.call(this, pURL);

	this.defaultListener = pListener || function(){};
	this.listeners = {};

	this.onmessage = function(Event){
		
	};

	if(pOnError){
		this.onerror = pOnError;
	}

	this.Query = function(/* n args */){
		if(arguments.length < 1){
			throw new TypeError("Worker.Query - not enough arguments");
			return;
		}  
		this.postMessage({
			"pokxasur": arguments[0],
			"daslqkjs" : Array.prototype.slice.call(arguments, 1)}
		});
	};

	this.postMessage = function(pMsg){
		Worker.prototype.postMessage.call(this, pMsg);
	};

	this.terminate = function(){
		Worker.prototype.terminate.call(this);
	};

	this.addListener = function(pLName, pLFunction){
		this.listeners[pLName] = pLFunction;
	};

	this.removeListener = function(pLName){
		delete this.listeners[pLName];
	};

	return this;
}

WW.Worker.prototype = Object.create(Worker.prototype);