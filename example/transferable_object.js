WW.TransferableObjectTask = function(){
	WW.WorkerTask.call(this);

	this.addListener('transferable', function(data){
		var buffer_view = data;
		

		//var uInt8View = new Uint8Array(buffer_view);
		//for(var i = 0; i < uInt8View.length; i++){
			buffer_view[0] += 1;
		//}

		Reply('print', buffer_view, Date.now());

	});

	return this;	
};

WW.TransferableObjectTask.prototype = Object.call(WW.WorkerTask.prototype);