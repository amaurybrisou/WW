if(typeof WW == 'undefined') WW = {};

var USE_TRANSFERABLE = true;
var supported = false;
window.supported = supported;

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
    console.log('Transferables are supported ')
  }
}());


getType = function(obj){
  return Object.prototype.toString.call(obj).match(/\s\w+/)[0].trim();
}

WW.Worker = function(pURL, pListener, pOnError ){
	var worker = new Worker(pURL);
	var that = worker;
  
	worker.defaultListener = pListener || function(){};

	//Listeners list
	worker.listeners = {};
  worker.trans_data = [];

	worker.onmessage = function(pEvent){
		if(pEvent.data instanceof Object &&
			pEvent.data.hasOwnProperty('method')){

			worker.listeners[pEvent.data.method].apply(
				that,
				[pEvent.data] );
		} else {
			worker.defaultListener.call(that, pEvent.data);
		}
	};

	//Define onerror function
	if(pOnError){
		worker.onerror = pOnError || function(error){
                                    console.log(error);
                                 };
	}

	worker.Query = function(/* n args */){
		if(arguments.length < 1){
			throw new TypeError("Worker.Query - not enough arguments");
			return;
		}

    var data = Array.prototype.slice.call(arguments, 1);

    if(supported && USE_TRANSFERABLE && worker.trans_data.length){
      
      data["method"] = arguments[0];
      
      worker.postMessage(data, worker.trans_data);

      for(var i in worker.trans_data){
        if(worker.trans_data[i].byteLength){
          content.innerHTML += "Buffer is Defined After postMessage : Using Copy Mode<br>/";
        }else{
          content.innerHTML += "Buffer is Undefined After postMessage : Using Transferables<br/>";
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
    if(pNatArr.buffer || pNatArr instanceof ArrayBuffer){
      if(pNatArr instanceof ArrayBuffer){
       worker.trans_data.push(pNatArr);  
      } else {
       worker.trans_data.push(pNatArr.buffer);
      }
    } else {
      throw "addNativeArray : Error Not A NativeArray";
    }
  };

	return worker;
};

WW.WorkerTask = function(){
  var that = this;
  var queryableFunctions = {};
  var trans_data = [];
  var indexes;
  

  function Reply(/* listener name, arguments... */) {
    if (arguments.length < 1) { 
      throw new TypeError("reply - not enough arguments");
      return;
    }

    var data = Array.prototype.slice.call(arguments, 1);
    

    if(supported && USE_TRANSFERABLE && trans_data.length) {
      
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

      queryableFunctions[pEvent.data.method].apply(
        self,
        [data]);

    } else {
      defaultQuery(pEvent.data);
    }
  };

  function addNativeArray(pNatArr) {
    if(pNatArr.buffer || pNatArr instanceof ArrayBuffer){
      if(pNatArr instanceof ArrayBuffer){
        trans_data.push(pNatArr);  
      } else {
        trans_data.push(pNatArr.buffer);
      }
    } else {
      log("addNativeArray : Error Not A NativeArray");
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

  function log(str){
    throw JSON.stringify(str);
  };

  function defaultQuery(str){
    throw JSON.stringify(str);
  };  

  this.toBlob = function(){
  	
  	var t = Reply.toString()+';';
    t += log.toString()+";";
    t += defaultQuery.toString()+";";
    t += addNativeArray.toString()+";";
    t += "var supported ="+supported+";";
    t += "var USE_TRANSFERABLE ="+USE_TRANSFERABLE+";";
    t += "var trans_data = [];";
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
