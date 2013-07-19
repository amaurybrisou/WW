function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function initViewArray(size){
	var ab = new ArrayBuffer(size);
	var uInt8View = new Uint8Array(ab);
	for(var i = 0; i < uInt8View.length; i++){
		uInt8View[i] = i;
	}
	return uInt8View;
}

var scrollPage = (function(){
  var last_min_y = 0,
      last_max_y = 2;

  return function(inc){
    var inc = inc || 100;
    window.scroll(last_min_y+=inc, last_max_y+=inc);
  };

}());