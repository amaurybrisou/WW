WW.PrimeNumberTask = function(){
	WW.WorkerTask.call(this);



	this.addListener('prime_number', function(delay){

		var _this = this;
		this.prime = 1;


	    // return true if NUM is prime
	    function isPrime(num) {
	        var result = true;
	        if (num !== 2) {
	            if (num % 2 == 0) {
	                result = false;
	            } else {
	                for (x=3; x<=Math.sqrt(num); x+=2) {
	                    if (num % x == 0) result = false;
	                }
	            }
	        }
	        return result;
	    }

		
		function prime(){			
			_this.prime++;
			while (!isPrime(_this.prime)){
		    	_this.prime++;
		    }
		    Reply('print', _this.prime);

		    setTimeout(prime, delay || 100);
		}
	
		setTimeout(prime, delay || 100);
	});
	return this;	
};

WW.PrimeNumberTask.prototype = Object.call(WW.WorkerTask.prototype);


WW.TransferableObjectTask = function(){
	WW.WorkerTask.call(this);

	this.addListener('transferable', function(data){
		var buffer_view = data[0];
		

		//var uInt8View = new Uint8Array(buffer_view);
		//for(var i = 0; i < uInt8View.length; i++){
			buffer_view[0] += 1;
		//}

		Reply('print', buffer_view, Date.now());

	});

	return this;	
};

WW.TransferableObjectTask.prototype = Object.call(WW.WorkerTask.prototype);