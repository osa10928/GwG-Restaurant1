/**
 * Common database helper functions.
 */
const port = 1337 // Change this to your server port

export default class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  static DATABASE_URL() {
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL()).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants().then(restaurants => {
      const restaurant = restaurants.find(r => r.id == id);
      if (restaurant) { // Got the restaurant
        callback(null, restaurant);
      } else { // Restaurant does not exist in the database
        callback('Restaurant does not exist', null);
      }
    }).catch(error => {
      callback(error, null)
    })
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants().then(restaurants => {
      // Filter restaurants to have only given cuisine type
      const results = restaurants.filter(r => r.cuisine_type == cuisine);
      callback(null, results);
    }).catch(error => {
      callback(error, null)
    })
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants

    DBHelper.fetchRestaurants().then(restaurants => {
      // Filter restaurants to have only given neighborhood
      const results = restaurants.filter(r => r.neighborhood == neighborhood);
      callback(null, results);
    }).catch(error => {
      callback(error, null)
    })
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, isFavoritesFiltered, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants().then(restaurants => {
      let results = restaurants
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }
      if (isFavoritesFiltered) {//filter by favorited restaurants
        results = results.filter(r => r.is_favorite === "true")
      }
      callback(null, results);
    }).catch(error => {
      callback(error, null)
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants().then(restaurants => {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
      callback(null, uniqueNeighborhoods);
    }).catch(error => {
      callback(error, null)
    })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants().then(restaurants => {
      // Get all cuisines from all restaurants
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
      callback(null, uniqueCuisines);
    }).catch(error => {
      callback(error, null)
    })
  }

  static fetchReviews(restaurant_id) {
    return fetch(DBHelper.urlForGetRestaurantReviews(restaurant_id)).then(response => {
      return response.json()
    }).catch(error => {
      console.log(error)
      return error
    })
  }

  static postReview(review) {
    return fetch(DBHelper.urlForPostRestaurantReview(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(review),
    }).then(response => {
      return response.json()
    }).catch(e => {
      alert("The server is currently unreachable, but review will be posted when it is online.")
      console.log(e)
    })
  }

  static editReview(review, review_id) {
    return fetch(DBHelper.urlForEditRestaurantReview(review_id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(review),
    }).then(response => {
      return response.json()
    })
  }

  static deleteReview(review_id) {
    return fetch(DBHelper.urlForDeleteRestaurantReview(review_id), {
      method: "DELETE"
    }).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static putFavorite(is_favorite, restaurant_id) {
    return fetch(DBHelper.urlForPutFavoriteRestaurant(is_favorite, restaurant_id), {
      method: "PUT"
    }).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant page Reviews URL.
   */
  static urlForGetRestaurantReviews(restaurant_id) {
    return (`http://localhost:${port}/reviews/?restaurant_id=${restaurant_id}`);
  }

  static urlForPostRestaurantReview() {
    return (`http://localhost:${port}/reviews/`)
  }

  static urlForEditRestaurantReview(review_id) {
    return (`http://localhost:${port}/reviews/${review_id}`)
  }

  static urlForDeleteRestaurantReview(review_id) {
    return (`http://localhost:${port}/reviews/${review_id}`)
  }

  static urlForPutFavoriteRestaurant(is_favorite, restaurant_id) {
    return (`http://localhost:${port}/restaurants/${restaurant_id}/?is_favorite=${is_favorite}`)
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
