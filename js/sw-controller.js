import idb from 'idb';

function openDatabase() {
	if (!navigator.serviceWorker) {
		return Promise.resolve()
	}


	return idb.open('restaurantReview', 1, (upgradeDb => {
		let store = upgradeDb.createObjectStore('restaurants')
	}))
}


export default class SwController {
	constructor() {
		this.dbPromise = openDatabase();
		this.registerServiceWorker = this.registerServiceWorker.bind(this);
		this.getCachedRestaurants = this.getCachedRestaurants.bind(this);
		this.registerServiceWorker();
		this.getCachedRestaurants();
	}

	registerServiceWorker() {
		if (!navigator.serviceWorker) return;

		navigator.serviceWorker.register('/sw.js').then(reg => {
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