import idb from 'idb';
console.log(idb)
var staticCacheName = 'RESTAURANT-APP-v3';
var files = [
	'/',
	'restaurant.html',
	'js/main.js',
	'js/bundle.js',
	'css/styles.css',
	'manifest.json',
	'images/1-350small.jpg',
	'images/2-350small.jpg',
	'images/3-350small.jpg',
	'images/4-350small.jpg',
	'images/5-350small.jpg',
	'images/6-350small.jpg',
	'images/7-350small.jpg',
	'images/8-350small.jpg',
	'images/9-350small.jpg',
	'images/10-350small.jpg',
	'images/1-800medium.jpg',
	'images/2-800medium.jpg',
	'images/3-800medium.jpg',
	'images/4-800medium.jpg',
	'images/5-800medium.jpg',
	'images/6-800medium.jpg',
	'images/7-800medium.jpg',
	'images/8-800medium.jpg',
	'images/9-800medium.jpg',
	'images/10-800medium.jpg',
	'images/stockImg.png',
]

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll(files)
		})
	)
})

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('RESTAURANT-APP-') && cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName)
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {

	var requestUrl = new URL(event.request.url)
	if (requestUrl == 'http://localhost:1337/restaurants') {
		event.respondWith(getRestaurants(event.request));
		return
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

function getRestaurants(request) {
	var dbPromise = openDatabase();
	return dbPromise.then(function(db) {
		if (!db) {
			return
		}
		var restaurantsObject = db.transaction('restaurants').objectStore('restaurants')
		return restaurantsObject.getAll();
	}).then(function(restaurants) {
		var netWorkFetch = fetch(request).then(function(netWorkRestaurants) {
			addRestaurantToDb(netWorkRestaurants.clone())
			return netWorkRestaurants
		})
		if (restaurants[0]) {
			return new Response(JSON.stringify(restaurants[0]))
		}
		return netWorkFetch
	})
}

function addRestaurantToDb(netWorkRestaurants) {
	netWorkRestaurants.json().then(function(restaurants) {
		var dbPromise = openDatabase()
		dbPromise.then(function(db) {
			var tx = db.transaction('restaurants', 'readwrite')
			var restaurantsObjectStore = tx.objectStore('restaurants')
			restaurantsObjectStore.put(restaurants, 'restaurantsData')
			return tx.complete
		}).then(function(val) {
			console.log("complete: " + val)
		})
	})
}


function openDatabase() {
	return idb.open('restaurantReview', 1, (upgradeDb => {
		var store = upgradeDb.createObjectStore('restaurants', { keyPath: 'id' })
	}))
}
