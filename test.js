WW.TestWorker = function(size){
  if(!size){
    throw "WWTest : Too Few Arguments : give buffer length !";
    return;
  }
  var worker = new Worker(window.URL.createObjectURL(
    new Blob(["onmessage=function(e){"+
                "var ab = e.data;"+
                "/*var ab = new ArrayBuffer(e.data);*/"+
                "self.postMessage(ab, [ab]);"+
              "};"], { type : "text/javascript"})));
  var ab = new ArrayBuffer(32*1024*1024);

  worker.onmessage = function(e){
    console.log("RTT : "+(Date.now() - SentTime)+" ms");
    console.log(e.data);
  }
  var SentTime = Date.now();
  worker.postMessage(ab, [ab]);

  if (ab.byteLength) {
    console.log('Transferables are not supported in your browser!');
  } else {
    supported = true;
    console.log('Transferables are supported ')
  };
}