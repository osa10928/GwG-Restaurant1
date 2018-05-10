function SwController() {
	this._registerServiceWorker();
}


SwController.prototype._registerServiceWorker = function() {
	if (!navigator.serviceWorker) return;

	var swWorker = this;

	navigator.serviceWorker.register('/sw.js').then(function(reg) {
		console.log("serviceWorker registered!")
	}).catch(function(error) {
		console.log(error)
	})
}

new SwController();