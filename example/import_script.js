
WW.ImportScriptTask = function(){
	WW.WorkerTask.call(this);

	this.addListener('import_script', function(a, b){

		Reply('print', additionner(a , b));

	});

	return this;	
}

WW.ImportScriptTask.prototype = Object.call(WW.WorkerTask.prototype);

