import DBHelper from './dbhelper';

export default class RestaurantController {
  constructor() {
    this.reviews
    this.restaurant
    this.map
    this.fetchRestaurantFromURL = this.fetchRestaurantFromURL.bind(this)
    this.fillRestaurantHTML = this.fillRestaurantHTML.bind(this)
    this.fillReviewsHTML = this.fillReviewsHTML.bind(this)
  }


  /**
   * Get current restaurant from page URL.
   */
  fetchRestaurantFromURL(callback) {
    if (this.restaurant) { // restaurant already fetched!
      callback(null, this.restaurant)
      return;
    }
    const id = this.getParameterByName('id');
    if (!id) { // no id found in URL
      error = 'No restaurant id in URL'
      callback(error, null);
    } else {
      DBHelper.fetchRestaurantById(id, (error, restaurant) => {
        this.restaurant = restaurant;
        if (!restaurant) {
          console.error(error);
          return;
        }
        this.fillRestaurantHTML();
        callback(null, this.restaurant)
      });
    }
  }

  /**
   * Create restaurant HTML and add it to the webpage
   */
  fillRestaurantHTML(restaurant = this.restaurant) {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = `${restaurant.name}   `

    const favoriteStar = document.createElement("i")
    favoriteStar.setAttribute("class", "fa fa-star")
    this.restaurant.is_favorite ? null : favoriteStar.classList.add("not-favorite")
    favoriteStar.setAttribute("aria-hidden", "true")
    this.restaurant.is_favorite ? favoriteStar.setAttribute("title",  "Unfavorite Restaurant") : favoriteStar.setAttribute("title",  "Favorite Restaurant")
    favoriteStar.setAttribute("data-is_favorite", restaurant.is_favorite)
    favoriteStar.setAttribute("data-restaurant_id", restaurant.id)
    favoriteStar.addEventListener("click", this.toggleFavorite.bind(this), false)
    
    name.appendChild(favoriteStar)


    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    let srcPrefix = DBHelper.imageUrlForRestaurant(restaurant)
    const srcPrefixArr = srcPrefix.split('/');
    srcPrefixArr[1] = 'images'
    srcPrefixArr[2] = srcPrefixArr[2].split('.')[0]
    srcPrefix = srcPrefixArr.join('/')

    const picture = document.getElementById('restaurant-img');

    const source1 = document.createElement('source');
    source1.setAttribute('media', '(max-width:949px)')
    source1.setAttribute('srcset', `${srcPrefix}-800medium.jpg`);

    const source2 = document.createElement('source');
    source2.setAttribute('media', '(min-width:950px)')
    source2.setAttribute('srcset', `${srcPrefix}-350small.jpg 1x, ${srcPrefix}-800medium.jpg 2x`);

    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt', `image of restaurant ${restaurant.name}`)

    picture.append(source1);
    picture.append(source2);
    picture.append(image)

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;
    cuisine.setAttribute('aria-label', `cuisine type: ${restaurant.cuisine_type}`)

    // fill operating hours
    if (restaurant.operating_hours) {
      this.fillRestaurantHoursHTML();
    }
  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage.
   */
  fillRestaurantHoursHTML(operatingHours = this.restaurant.operating_hours) {
    const hours = document.getElementById('restaurant-hours');
    const weekdayAbbr = ['M', 'Tue', 'W', 'Th', 'F', 'Sat', 'Sun'];
    const keys = Object.keys(operatingHours);
    for (let i=0; i<keys.length; i++) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = keys[i];
      day.setAttribute('data-td', 'full');
      row.appendChild(day);

      const dayAbbr = document.createElement('td');
      dayAbbr.innerHTML = weekdayAbbr[i];
      dayAbbr.setAttribute('data-td', 'abbr');
      row.appendChild(dayAbbr);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[keys[i]];
      time.setAttribute('data-td', 'timesOpen')
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  /**
   * Create all reviews HTML and add them to the webpage.
   */
  fillReviewsHTML(reviews) {
    const container = document.getElementById('reviews-container');
    
    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    const ulClone = ul.cloneNode(false)
    ul.remove()

    reviews.forEach(review => {
      ulClone.appendChild(this.createReviewHTML(review));
    });
    container.appendChild(ulClone);
  }

  /**
   * Create review HTML and add it to the webpage.
   */
  createReviewHTML(review) {

    const li = document.createElement('li');
    li.setAttribute("data-review_id", review.id);
    li.setAttribute("class", "review-container")

    //Create Visible Review
    const visibleReview = document.createElement('div')
    visibleReview.setAttribute("class", "review showing")

    const name = document.createElement('p');
    name.innerHTML = review.name;
    visibleReview.appendChild(name);

    if (review.createdAt) {
      const date = document.createElement('p');
      const dateOptions = {
        "hour":"numeric", "minute":"numeric", "month":"short", "day":"numeric", "year":"numeric"
      }
      date.innerHTML = new Date(review.createdAt).toLocaleDateString('en-US', dateOptions)
      visibleReview.appendChild(date);
    }

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    visibleReview.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    visibleReview.appendChild(comments);

    const editDeleteBtns = document.createElement('div')
    editDeleteBtns.setAttribute("class", "review-btns")

    const editBtn = document.createElement("button")
    editBtn.setAttribute("class", "edit-delete-btn edit-btn")
    editBtn.innerHTML = "Edit"
    editBtn.addEventListener("click", this.toggleEditReview, false)
    editDeleteBtns.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("class", "edit-delete-btn delete-btn")
    deleteBtn.innerHTML = "Delete"
    deleteBtn.addEventListener("click", this.toggleDeleteModal, false)
    deleteBtn.setAttribute("data-review_id", review.id)
    editDeleteBtns.appendChild(deleteBtn)

    visibleReview.appendChild(editDeleteBtns)

    //Generate edit form
    const reviewForm = document.createElement("form")
    reviewForm.setAttribute("class", "hiding review-edit-form")
    reviewForm.setAttribute("data-review_id", review.id)

    const formGroupName = document.createElement("div")
    formGroupName.setAttribute("class", "form-group")

    const labelName = document.createElement("label")
    labelName.setAttribute("for", "name")
    labelName.innerHTML = "Name: "
    formGroupName.appendChild(labelName)

    const inputName = document.createElement("input")
    inputName.setAttribute("class", "form-value")
    inputName.setAttribute("name", "name")
    inputName.setAttribute("required", "")
    inputName.setAttribute("value", review.name)

    formGroupName.appendChild(inputName)
    reviewForm.appendChild(formGroupName)


    const formGroupRating = document.createElement("div")
    formGroupRating.setAttribute("class", "form-group")

    const labelRating = document.createElement("label")
    labelRating.setAttribute("for", "rating")
    labelRating.innerHTML = "Rating: "
    formGroupRating.appendChild(labelRating)

    const inputRating = document.createElement("input")
    inputRating.setAttribute("class", "form-value")
    inputRating.setAttribute("name", "rating")
    inputRating.setAttribute("required", "")
    inputRating.setAttribute("pattern", "[1-9]|10")
    inputRating.setAttribute("value", review.rating)

    formGroupRating.appendChild(inputRating)
    reviewForm.appendChild(formGroupRating)


    const formGroupComment = document.createElement("div")
    formGroupComment.setAttribute("class", "form-group")

    const labelComment = document.createElement("label")
    labelComment.setAttribute("for", "comments")
    formGroupComment.appendChild(labelComment)

    const textareaComment = document.createElement("textarea")
    textareaComment.setAttribute("class", "review-text form-value")
    textareaComment.setAttribute("name", "comments")
    textareaComment.setAttribute("cols", "40")
    textareaComment.setAttribute("rows", "7")
    textareaComment.innerHTML = review.comments

    formGroupComment.appendChild(textareaComment)
    reviewForm.appendChild(formGroupComment)

    const formGroupButtons = document.createElement("div")
    formGroupButtons.setAttribute("class", "form-group btn-group")

    const cancelInput = document.createElement("input")
    cancelInput.setAttribute("type", "button")
    cancelInput.setAttribute("class", "cancel-post-btns cancel-btn")
    cancelInput.setAttribute("value", "Cancel")
    cancelInput.addEventListener("click", this.toggleEditReview, false)
    formGroupButtons.appendChild(cancelInput)

    const postInput = document.createElement("input")
    postInput.setAttribute("type", "submit")
    postInput.setAttribute("class", "cancel-post-btns post-btn")
    formGroupButtons.appendChild(postInput)

    reviewForm.appendChild(formGroupButtons)
    reviewForm.addEventListener("submit", this.editReview.bind(this), false)

    li.appendChild(visibleReview)
    li.appendChild(reviewForm)

    return li;
  }

  /**
   * Add restaurant name to the breadcrumb navigation menu
   */
  fillBreadcrumb(restaurant=this.restaurant) {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
  }

  /**
   * Get a parameter by name from page URL.
   */
  getParameterByName(name, url) {
    if (!url)
      url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
  * For Stage 3. Get Reviews and Post Reviews
  */

  getReviews(restaurant_id) {
    DBHelper.fetchReviews(restaurant_id).then(reviews => {
      this.fillReviewsHTML(reviews)
    }).catch(error => {
      console.log(error)
      reject()
    })
  }

  submitReview(e) {
    e.preventDefault()
    const parsedReview = this.parseReview(e)

    DBHelper.postReview(parsedReview).then(data => {
      this.clearReview(e)
      this.getReviews(this.restaurant.id)
      this.viewRecentReview()
    }).catch(error => {
        console.log(error)
    })

  }

  editReview(e) {
    e.preventDefault()
    const parsedReview = this.parseReview(e, true)
    const review_id = e.srcElement.dataset.review_id

    DBHelper.editReview(parsedReview, review_id).then(data => {
        this.getReviews(this.restaurant.id)
      }).catch(error => {
        console.log(error)
    })
  }

  deleteReview(e) {
    const review_id = e.srcElement.dataset.review_id

    DBHelper.deleteReview(review_id).then(data => {
      this.toggleDeleteModal()
      this.getReviews(this.restaurant.id)
    }).catch(error => {
      console.log(error)
    })
    
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

  toggleEditReview() {
    const reviewList = this.closest("li")
    if (reviewList.children[0].classList.contains("showing")) {
      reviewList.children[0].classList.remove("showing")
      reviewList.children[0].classList.add("hiding")
      reviewList.children[1].classList.add("showing")
      reviewList.children[1].classList.remove("hiding")
    } else {
      reviewList.children[0].classList.add("showing")
      reviewList.children[0].classList.remove("hiding")
      reviewList.children[1].classList.remove("showing")
      reviewList.children[1].classList.add("hiding")
    }
  }

  toggleDeleteModal(e) {
    const modalContainer = document.getElementById("modal-container")
    const modal = document.getElementById("modal")

    if (modalContainer.classList.contains("hide-modal")) {
      modalContainer.classList.remove("hide-modal")

      const modalDeleteBtn = document.getElementById("modal-delete-btn")
      modalDeleteBtn.setAttribute("data-review_id", e.srcElement.dataset.review_id)

      setTimeout(() => {
        modal.classList.add("show-modal")
        modal.style.transform = "translateY(-30px)"
      }, 200)

    } else {
      modal.classList.remove("show-modal")
      modal.style.transform = "translateY(30px)"
      modalContainer.classList.add("hide-modal")
    }
  }

  parseReview(e, edit=false) {
    const id = this.getParameterByName('id')
    const formValues = Array.from(e.srcElement)
    let parsedReview = {}

    for (let i=0;i<3;i++) {
      parsedReview[formValues[i].name] = formValues[i].value
    }
    parsedReview["rating"] = parseInt(parsedReview["rating"])
    edit ? null : parsedReview["restaurant_id"] = parseInt(id)
    return parsedReview
  }

  clearReview(e) {
    const formValues = Array.from(e.srcElement)
    for (let i=0;i<3;i++) {
      formValues[i].value = ""
    }
  }

  viewRecentReview() {
    window.scroll({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

}

