import idb from 'idb';

function openDatabase() {
	if (!navigator.serviceWorker) {
		return Promise.resolve()
	}


	return idb.open('restaurantReview', 2, (upgradeDb => {
		switch (upgradeDb.oldVersion) {
			case 0:
			  upgradeDb.createObjectStore('restaurants')

			case 1:
			  upgradeDb.createObjectStore("reviews", { keyPath: 'id' })

			case 2:
			  upgradeDb.createObjectStore("failedReviewTransactions")
		}
	}))
}


export default class SwController {
	constructor() {
		//this.dbPromise = openDatabase();
		this.registerServiceWorker = this.registerServiceWorker.bind(this);
		//this.getCachedRestaurants = this.getCachedRestaurants.bind(this);
		this.registerServiceWorker();
		//this.getCachedRestaurants();
	}

	registerServiceWorker() {
		if (!navigator.serviceWorker) return;

		navigator.serviceWorker.register('/sw.js', {scope: "./"}).then(reg => {
			console.log("serviceWorker registered!")
		}).catch(function(error) {
			console.log(error)
		})
	}

	getCachedRestaurants() {
		return this.dbPromise.then(db => {
			if (!db) {
				return
			}

			var index = db.transaction('restaurants').objectStore('restaurants')

			return index.getAll()
		})
	}

}