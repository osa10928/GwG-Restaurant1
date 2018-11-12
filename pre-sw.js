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
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
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

	if (requestUrl.href.startsWith("http://localhost:1337/reviews/?restaurant")) {
		const restaurant_id = +requestUrl.search.split("=")[1]
		event.respondWith(getAllRestaurantReviews(event.request, restaurant_id))
		return
	}

	if (requestUrl.href.startsWith("http://localhost:1337/reviews/")) {
		if (event.request.method==="POST") {
			event.respondWith(postReview(event.request))
			return
		}

		if (event.request.method==="PUT") {
			const review_id = requestUrl.pathname.split("/").pop()
			event.respondWith(editReview(event.request, review_id))
			return
		}

		if (event.request.method==="DELETE") {
			const review_id = requestUrl.pathname.split("/").pop()
			event.respondWith(deleteReview(event.request, review_id))
			return
		}

	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});


function deleteReview(request, review_id) {
	var review = fetch(request).then(function(deletedReview) {
		deleteReviewFromDb(deletedReview.clone())
		return deletedReview
	})
	return review
}

function editReview(request, review_id) {
	var review = fetch(request).then(function(editedReview) {
		addReviewToDb(editedReview.clone())
		return editedReview
	})
	return review
}

function postReview(request) {
	var requestCopy = request.clone()
	var review = fetch(request).then(function(newReview) {
		addReviewToDb(newReview.clone())
		return newReview
	}).catch(function(error) {
		return requestCopy.json().then(function(review) {
			addFailedReviewToDb(review)
			return new Error("Post Failed")
		})
	})
	return review
}

function getAllRestaurantReviews(request, restaurant_id) {
	return postOfflineTransactions().then(function(outcome) {
		return getRestaurantReviews(request, restaurant_id).then(function(response) {
			return response.json().then(function(posts) {
				return getFailedReviewPosts().then(function(failedPosts) {
					if (failedPosts) {
						failedPosts.forEach(function(review) {
							review.restaurant_id === restaurant_id ? posts.push(review) : null
						})
					}
					return new Response(JSON.stringify(posts))
				})
			})
		})
	})
}

function getRestaurantReviews(request, restaurant_id) {
	var dbPromise = openDatabase();
	return dbPromise.then(function(db) {
		if (!db) {
			return
		}
		var reviewsObject = db.transaction('reviews').objectStore('reviews')
		return reviewsObject.getAll();
	}).then(function(reviews) {
		var filteredReviews = reviews.filter(review => review.restaurant_id === restaurant_id)
		var netWorkFetch = fetch(request).then(function(netWorkReviews) {
			return netWorkReviews
		}).then(function(netWorkReviews) {
			addReviewsToDb(netWorkReviews.clone())
			return netWorkReviews
		})

		if (filteredReviews.length) {
			return new Response(JSON.stringify(filteredReviews))
		}

		return netWorkFetch
		
	})
}

function getFailedReviewPosts() {
	var dbPromise = openDatabase();
	return dbPromise.then(function(db) {
		if (!db) {
			return
		}
		var failedPostsObjectStore = db.transaction('failedReviewTransactions').objectStore('failedReviewTransactions')
		return failedPostsObjectStore.get("Post");
	})
}

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

function postOfflineTransactions() {
	return new Promise(function(resolve, reject) {
		var dbPromise = openDatabase()
		dbPromise.then(function(db) {
			var failedTransactionObjectStore = db.transaction('failedReviewTransactions', "readwrite").objectStore('failedReviewTransactions')
			failedTransactionObjectStore.get("Post").then(function(posts) {
				if (posts) {
					failedTransactionObjectStore.delete("Post")
					posts.forEach(function(post, index, array) {
						post.id = null
						fetch(postUrl(), {
							method: "POST",
							headers: {
								"Content-Type": "application/json; charset=utf-8"
							},
							body: JSON.stringify(post),
						}).then(function(post) {
							addReviewToDb(post).then(function() {
								if (index === array.length - 1) {
									resolve("posts")
								}
							})
						}).catch(function(e) {
							addFailedReviewToDb(post)
							if (index === array.length - 1) {
								resolve("posts")
							}
						})
					})
				} else {
					resolve("no posts")
				}
			})
		})
	})
}

function deleteReviewFromDb(review) {
	review.json().then(function(review) {
		var dbPromise = openDatabase()
		dbPromise.then(function(db) {
			var tx = db.transaction("reviews", "readwrite")
			var reviewsObjectStore = tx.objectStore('reviews')
			reviewsObjectStore.delete(review.id)
			return tx.complete
		}).catch(function(error) {
			console.log(error)
		})
	})
}

function addReviewToDb(review) {
	return new Promise(function(resolve, reject) {
		review.json().then(function(review) {
			var dbPromise = openDatabase()
			dbPromise.then(function(db) {
				var tx = db.transaction("reviews", "readwrite")
				var reviewsObjectStore = tx.objectStore('reviews')
				reviewsObjectStore.put(review)
				return tx.complete
			}).catch(function(error) {
				console.log(error)
			}).finally(function() {
				resolve()
			})
		})
	})
}

function addReviewsToDb(netWorkReviews) {
	netWorkReviews.json().then(function(reviews) {
		var dbPromise = openDatabase()
		dbPromise.then(function(db) {
			var tx = db.transaction('reviews', 'readwrite')
			var reviewsObjectStore = tx.objectStore('reviews')
			reviewsObjectStore.getAll()
			reviews.forEach(function(review) {
				reviewsObjectStore.put(review)
			})
			return tx.complete
		}).catch(function(error){
			console.log(error)
		})
	})
}

function addFailedReviewToDb(review) {
	var dbPromise = openDatabase()
	dbPromise.then(function(db) {
		var failedPostsObjectStore = db.transaction('failedReviewTransactions', "readwrite").objectStore('failedReviewTransactions')
		failedPostsObjectStore.get("Post").then(function(failedPosts) {
			if (failedPosts) {
				review.id = failedPosts.length
				failedPosts.push(review)
				failedPostsObjectStore.put(failedPosts, "Post")
			} else {
				review.id = 0
				failedPostsObjectStore.put([review], "Post")
			}
		})
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
		})
	})
}


function openDatabase() {
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

function postUrl() {
	return `http://localhost:1337/reviews`
}
