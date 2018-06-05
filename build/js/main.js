require('intersection-observer');
import MainController from './mainController';
import RestaurantController from './restaurant_info';
import DBHelper from './dbhelper';
import SwController from './sw-controller';


// Initiate service worker with SwController
const swController = new SwController();

if (window.location.pathname == '/') {
  const mainController = new MainController()

  window.initMap = () => {
    let loc = {
      lat: 40.722216,
      lng: -73.987501
    };
    window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: loc,
      scrollwheel: false
    });
    mainController.google = google
    mainController.addMarkersToMap()
  }

  /**
     * Fetch neighborhoods and cuisines as soon as the page is loaded.
     */
  document.addEventListener('DOMContentLoaded', (event) => {
      mainController.fetchNeighborhoods()
      mainController.fetchCuisines()
      mainController.updateRestaurants()
      document.getElementById('neighborhoods-select').onchange=mainController.updateRestaurants
      document.getElementById('cuisines-select').onchange=mainController.updateRestaurants
      document.getElementById('static-map').addEventListener('click', toggleMap)
  });

} else {

  let restaurantController = new RestaurantController()
  /**
  * Initialize Google map, called from HTML.
  */
  window.initMap = () => {
    restaurantController.fetchRestaurantFromURL((error, restaurant) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        window.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: restaurant.latlng,
          scrollwheel: false
        });
        restaurantController.fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(restaurant, window.map);
      }
    });
  }
}


function toggleMap(e) {
  let staticMap = document.getElementById('static-map')
  let map = document.getElementById('map')
  let p = document.getElementById('static-map-p')
  map.classList.toggle('hide')
  staticMap.classList.toggle('hide')
  p.classList.toggle('hide')
}