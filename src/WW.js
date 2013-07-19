if(typeof WW == 'undefined') WW = {};

window.supported = false;

(function(){
  //Check Wether Transferable Objects are supported
  var worker = new Worker(window.URL.createObjectURL(
    new Blob(["onmessage=function(e){};"], { type : "text/javascript"})));
  var ab = new ArrayBuffer(1);
  worker.postMessage(ab, [ab]);
  if (ab.byteLength) {
    console.log('Transferables are not supported in your browser!');
  } else {
    supported = true;
    //console.log('Transferables are supported ')
  }
}());

WW.Worker = function(pURL, pListener, pOnError ){
	var worker = new Worker(pURL);
	var that = worker;
  
	worker.defaultListener = pListener || function(){};

	//Listeners list
	worker.listeners = {};


	worker.onmessage = function(pEvent){
		if(pEvent.data instanceof Object &&
			pEvent.data.hasOwnProperty('method')){

			worker.listeners[pEvent.data.method].apply(
				that,
				pEvent.data );
		} else {
			worker.defaultListener.call(that, pEvent.data);
		}
	};

	//Define onerror function
	worker.onerror = pOnError || 
    function(error){
      throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
   };


	worker.Query = function(/* n args */){
		if(arguments.length < 1){
			throw new TypeError("Worker.Query - not enough arguments");
			return;
		}

    var data = Array.prototype.slice.call(arguments, 1);

    if(supported && USE_TRANSFERABLE){
      var trans_data = [];
      for(var i = 0; i < data.length; i++){
        var obj = data[i];
        if(obj instanceof Object){
          if(obj.buffer){
            trans_data.push(obj.buffer);
          } else if(obj instanceof ArrayBuffer){
            trans_data.push(obj);  
          }
        }
      }
    
      
      data["method"] = arguments[0];

      
      worker.postMessage(data, trans_data);

      if(debug){
        for(var i in trans_data){
          if(trans_data[i].byteLength){
            console.log("Buffer is Defined After postMessage : Using Copy Mode");
          }else{
            console.log("Buffer is Undefined After postMessage : Using Transferables");
          }
        }
      }
    } else {
      data["method"] = arguments[0];
  		worker.postMessage(data);
    }
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

  worker.addNativeArray = function(pNatArr) {
    if(pNatArr.buffer){
      worker.trans_data.push(pNatArr.buffer);
    } else if(pNatArr instanceof ArrayBuffer){
      worker.trans_data.push(pNatArr);  
    } else {
      throw "addNativeArray : Error Not A NativeArray";
    }
  };

	return worker;
};












WW.WorkerTask = function(){
  var that = this;
  var queryable_functions = {};
  var external_scripts = [];

  function Reply(/* listener name, arguments... */) {
    if (arguments.length < 1) {
      throw new TypeError("reply - not enough arguments");
      return;
    }

    var data = Array.prototype.slice.call(arguments, 1);
    

    if(supported && USE_TRANSFERABLE) {
      var trans_data = [];
      for(var i = 0; i < data.length; i++){
        var obj = data[i];
        if(obj instanceof Object){
          if(obj.buffer){
            trans_data.push(obj.buffer);
          } else if(obj instanceof ArrayBuffer){
            trans_data.push(obj);
          }
        }
      }

      data["method"] = arguments[0];

      self.postMessage(data, trans_data);

    } else {
      data["method"] = arguments[0];
      self.postMessage(data);
    }
  };


  onmessage = function(pEvent) {

    if (pEvent.data instanceof Object &&
     pEvent.data.hasOwnProperty("method")) {

      var data = pEvent.data;

    

      queryable_functions[pEvent.data.method].apply(
        self,
        data);

    } else {
      defaultQuery(pEvent.data);
    }
  };

  function addNativeArray(pNatArr) {

    if(pNatArr.buffer || pNatArr instanceof ArrayBuffer ||
        pNatArr instanceof ArrayBufferView){
      if(pNatArr instanceof ArrayBuffer){
        trans_data.push(pNatArr);  
      } else {
        trans_data.push(pNatArr.buffer);
      }
    }
  };



  var len = 0;
  this.addListener = function(pLName, pLFunction){
    queryable_functions[pLName] = pLFunction;
    len++;
  };

  this.removeListener = function(pLName){
    delete queryable_functions[pLName];
    len--;
  };

  this.addExternalScript = function(pSName){
    external_scripts.push(pSName);
  };

  function log(str){
    throw JSON.stringify(str);
  };

  function defaultQuery(str){
    throw JSON.stringify(str);
  };

  this.toBlob = function(){
  	if(!len) throw new Error('No Listener found');

  	var t = Reply.toString()+';';
    t += log.toString()+";";
    t += defaultQuery.toString()+";";
    t += addNativeArray.toString()+";";
    t += "var supported ="+supported+";";
    t += "var trans_data = [];";
    t += "var USE_TRANSFERABLE ="+USE_TRANSFERABLE+";";
  	t += "queryable_functions = {";

    var i =0;
  	for(var key in queryable_functions){
  		t += key+" : "+queryable_functions[key];
      t += (++i != len  ) ? ',' : "";
  	}
    t += "};";

    if(external_scripts.length){
      for(var key in external_scripts){
        t += "importScripts('"+document.location.href.replace(/\/[^/]*$/,"/")+external_scripts[key]+"');";
      }
  	} else {
       t += "var external_scripts = [];";
    }
  	
  	t += "self.onmessage="+onmessage.toString()+';';
  	
  	var blob = new Blob([t], { type : "text/javascript"});
  	return window.URL.createObjectURL(blob);
  };
};
