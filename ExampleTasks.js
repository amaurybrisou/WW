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