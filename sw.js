var staticCacheName = 'RESTAURANT-APP-v3';
var files = [
	'/',
	'restaurant.html',
	'js/main.js',
	'js/dbhelper.js',
	'js/restaurant_info.js',
	'css/styles.css',
	'data/restaurants.json',
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
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});