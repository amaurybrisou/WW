if(typeof WW == 'undefined') WW = {};

WW.Worker = function(pURL, pListener, pOnError ){
	var worker = new Worker(pURL);

	var that = worker;
	worker.defaultListener = pListener || function(){};

	//Listeners list
	worker.listeners = {};

	worker.onmessage = function(pEvent){
		if(pEvent.data instanceof Object &&
			pEvent.data.hasOwnProperty('vo42t30') &&
			pEvent.data.hasOwnProperty('rnb93qh')){

			worker.listeners[pEvent.data.vo42t30].apply(
				that,
				pEvent.data.rnb93qh );
		} else {
			worker.defaultListener.call(that, pEvent.data);
		}
	};

	//Define onerror function
	if(pOnError){
		worker.onerror = pOnError;
	}

	worker.Query = function(/* n args */){
		if(arguments.length < 1){
			throw new TypeError("Worker.Query - not enough arguments");
			return;
		}  
		worker.postMessage({
			"pokxasur": arguments[0],
			"daslqkjs" : Array.prototype.slice.call(arguments, 1)
		});
	};

	worker.postMessage = function(pMsg){
		Worker.prototype.postMessage.call(worker, pMsg);
	};

	worker.terminate = function(){
		Worker.prototype.terminate.call(worker);
	};

	worker.addListener = function(pLName, pLFunction){
		worker.listeners[pLName] = pLFunction;
	};

	worker.removeListener = function(pLName){
		delete worker.listeners[pLName];
	};

	return worker;
};


WW.WorkerTask = function(){
  var that = this;
  var queryableFunctions = {};

  function Reply(/* listener name, arguments... */) {
    if (arguments.length < 1) { 
      throw new TypeError("reply - not enough arguments");
      return;
    }

    postMessage({
      "vo42t30": arguments[0],
      "rnb93qh": Array.prototype.slice.call(arguments, 1) 
    });
  };

  onmessage = function(pEvent) {
  	
    if (pEvent.data instanceof Object &&
     pEvent.data.hasOwnProperty("pokxasur") &&
      pEvent.data.hasOwnProperty("daslqkjs")) {

      queryableFunctions[pEvent.data.pokxasur].apply(
        self,
        pEvent.data.daslqkjs);

    } else {
      defaultQuery(pEvent.data);
    }
  };

  var len = 0;
  this.addListener = function(pLName, pLFunction){
    queryableFunctions[pLName] = pLFunction;
    len++;
  };

  this.removeListener = function(pLName){
    delete queryableFunctions[pLName];
    len--;
  };

  this.toBlob = function(){
  	
  	var t = Reply.toString()+';';
  	t += "queryableFunctions = {";


    var i =0;
  	for(var key in queryableFunctions){
      
  		t += key+" : "+queryableFunctions[key];
      t += (++i != len  ) ? ',' : "";
  	}
  	
  	t += "};";
  	t += "self.onmessage="+onmessage.toString()+';';
  	


  	var blob = new Blob([t], { type : "text/javascript"});
  	return window.URL.createObjectURL(blob);
  };
};