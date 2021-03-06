import DBHelper from './dbhelper';

export default class MainController {
  constructor() {
    this.restaurants;
    this.neighborhoods;
    this.cuisines;
    this.map;
    this.markers = []
    this.fetchNeighborhoods = this.fetchNeighborhoods.bind(this)
    this.fetchCuisines = this.fetchCuisines.bind(this)
    this.updateRestaurants = this.updateRestaurants.bind(this)
    this.resetRestaurants = this.resetRestaurants.bind(this)
    this.fillRestaurantsHTML = this.fillRestaurantsHTML.bind(this)
  }

  /**
   * Fetch all neighborhoods and set their HTML.
   */
  fetchNeighborhoods() {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
      if (error) { // Got an error
        console.error(error);
      } else {
        this.neighborhoods = neighborhoods;
        this.fillNeighborhoodsHTML();
      }
    });
  }

  /**
   * Set neighborhoods HTML.
   */
  fillNeighborhoodsHTML(neighborhoods = this.neighborhoods) {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
      const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      select.append(option);
    });
  }

  /**
   * Fetch all cuisines and set their HTML.
   */
  fetchCuisines() {
    DBHelper.fetchCuisines((error, cuisines) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        this.cuisines = cuisines;
        this.fillCuisinesHTML();
      }
    });
  }

  /**
   * Set cuisines HTML.
   */
  fillCuisinesHTML(cuisines = this.cuisines) {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    });
  }

  /**
   * Update page and map for current restaurants.
   */
  updateRestaurants() {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');
    const favoritesFilter = document.getElementById("filter-favorites-checkbox")

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    const isFilteredForFavorites = favoritesFilter.checked

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, isFilteredForFavorites, (error, restaurants) => {
      if (error) { // Got an error!
      } else {
        //console.log(this)
        this.resetRestaurants(restaurants);
        this.fillRestaurantsHTML();
      }
    })
  }

  /**
   * Clear current restaurants, their HTML and remove their map markers.
   */
  resetRestaurants(restaurants) {
    //console.log('hey')
    // Remove all restaurants
    this.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    this.restaurants = restaurants;
  }

  /**
   * Create all restaurants HTML and add them to the webpage.
   */
  fillRestaurantsHTML(restaurants = this.restaurants) {
    //console.log('ho')
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
      ul.append(this.createRestaurantHTML(restaurant));
    });
    this.observeImages()
    if (this.google) {
      this.addMarkersToMap();
    }
  }

  /**
   * Create restaurant HTML.
   */
  createRestaurantHTML(restaurant) {
    const li = document.createElement('li');

    let srcPrefix = DBHelper.imageUrlForRestaurant(restaurant)
    const srcPrefixArr = srcPrefix.split('/');
    srcPrefixArr[1] = 'images'
    srcPrefixArr[2] = srcPrefixArr[2].split('.')[0]
    srcPrefix = srcPrefixArr.join('/')

    const picture = document.createElement('picture');

    const source1 = document.createElement('source');
    source1.setAttribute('media', '(max-width:949px)')
    source1.setAttribute('srcset', `images/stockIcon.jpg`);
    source1.setAttribute('data-srcset', `${srcPrefix}-800medium.jpg`);

    const source2 = document.createElement('source');
    source2.setAttribute('media', '(min-width:950px)')
    source2.setAttribute('srcset', `images/stockIcon.jpg`);
    source2.setAttribute('data-srcset', `${srcPrefix}-350small.jpg 1x, ${srcPrefix}-800medium.jpg 2x`);

    const image = document.createElement('img');
    image.className += 'img-responsive';
    image.className += ' observed-img'
    image.src = 'images/stockIcon.jpg'
    image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
    image.setAttribute('alt', `image of restaurant ${restaurant.name}`)

    picture.append(source1);
    picture.append(source2);
    picture.append(image)
    li.append(picture);

    const name = document.createElement('h2');
    name.innerHTML = `${restaurant.name}   `;

    const favoriteStar = document.createElement("i")
    favoriteStar.setAttribute("class", "fa fa-star")
    if (restaurant.is_favorite==="false" || !restaurant.is_favorite) {
      favoriteStar.classList.add("not-favorite")
    }
    favoriteStar.setAttribute("aria-hidden", "true")
    restaurant.is_favorite ? favoriteStar.setAttribute("title",  "Unfavorite Restaurant") : favoriteStar.setAttribute("title",  "Favorite Restaurant")
    favoriteStar.setAttribute("data-is_favorite", restaurant.is_favorite)
    favoriteStar.setAttribute("data-restaurant_id", restaurant.id)
    favoriteStar.addEventListener("click", this.toggleFavorite.bind(this), false)

    name.appendChild(favoriteStar)
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.setAttribute('aria-label', `view details for restaurant ${restaurant.name}`)
    li.append(more)

    return li
  }

  observeImages() {
    const imgs = document.querySelectorAll('.observed-img')

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          let img = entry.target
          let parent = entry.target.parentElement
          let src1 = entry.target.parentElement.childNodes[0]
          let src2 = entry.target.parentElement.childNodes[1]
          img.setAttribute('src', img.getAttribute('data-src'))
          src1.setAttribute('srcset', src1.getAttribute('data-srcset'))
          src2.setAttribute('srcset', src2.getAttribute('data-srcset'))
          observer.unobserve(entry.target)
        }
      })
    })

    imgs.forEach(image => {
      observer.observe(image)
    })

    return
  }

  /**
   * Add markers for current restaurants to the map.
   */
  addMarkersToMap(restaurants = this.restaurants) {
    restaurants.forEach(restaurant => {
      // Add marker to the map
      const marker = DBHelper.mapMarkerForRestaurant(restaurant, window.map);
      this.google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url
      });
      this.markers.push(marker);
    });
  }

  toggleFavorite(e) {
    const id = e.srcElement.dataset.restaurant_id
    const is_favorite = e.srcElement.dataset.is_favorite !== "false"
    
    DBHelper.putFavorite(!is_favorite, id).then(data => {
      setTimeout(() => {
        this.toggleStarIcon(!is_favorite, e)
      }, 60)
      e.srcElement.setAttribute("data-is_favorite", `${!is_favorite}`)
    }).catch(error => {
      console.log(error)
    })

  }

  toggleStarIcon(is_favorite, e) {
    if (is_favorite) {
      e.srcElement.classList.remove("not-favorite")
      e.srcElement.title = "Unfavorite Restaurant?"
    } else {
      e.srcElement.classList.add("not-favorite")
      e.srcElement.title = "Favorite Restaurant?"
    }
  }

}
