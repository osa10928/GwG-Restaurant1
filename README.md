# GwG - Restaurant Review App
This repo is part one of a Udacity Grow With Google project. The code was cloned from a boilerplate code [at this repository](https://github.com/udacity/mws-restaurant-stage-1). The goal of this repository is to show the complete transformation of this example Restaurant Review website to a fully formed offline first web application. This README will guide users through the setup and execution of the complete webite application.


## Requirements
The requirements for this stage of the project are the same as those of the first, namely, node, npm, and imagemagick:
1. `node v9.4.0`
2. `npm v6.0.0`
3. `imagemagick v8.6`
4. `gulp-cli v2.0.1`

The Google Maps API code is required as well ([google's developer console](https://console.developers.google.com/project?pli=1)).

## Running Application
This application involves running BackEnd server to serve data to the this repositories FrontEnd application. The steps are as follows:
1. Clone [server repository](https://github.com/udacity/mws-restaurant-stage-3).
2. Follow steps on the server repository README page to get the server up and running.
3. From another terminal window clone this repository.
4. On the last `script` tag of the `index.html` and the `restaurant.html` pages be sure to replace the 'YOUR_API_KEY' portions of the src attribute with the google maps API key given to you by Google.
5. In console, enter the directory and run `npm install`
6. Run `gulp prod` to generate the production build of this application. If you want to run this in development simply run `gulp`.
7. Run `node server.js` to start a localhost server on port 8000
8. Navigate to localhost:8000 in your browser and explore.
9. If your in chrome download the lighthouse plugin in. Then open devtools and run an audit (more information on this step below).
10. If you want to delete the build folder and return the application to original state run `gulp clean` in the terminal.

## Running the Application
The application has several features that are capable of being tested namely: Favoriting and Unfavoriting Restaurants, CRUD functions for Restaurant Reviews, and Offline First design for the Creation of Reviews. These can be tested in the following ways:

1. Favoriting and Unfavoriting Restaurants
  * Restaurants can be favorited by clicking the star next to Restaurant names. The favorited restaurants can be used for filtering on the home page
2. CRUD function for Restaurant Reviews
  * Restaurant reviews can be created, updated, deleted, and are shown on the specific restaurant details page. Create a review by using the review creation form. Edit and delete the review by using the buttons on the displayed review.
3. Offline First Design
  * The application features the beginning of an offline first design pattern. The user can post a review without being connected to the server. To test this feature first stop the server used to serve the restaurants and reviews. Then post a review. The applicatiaon will warn that the server is unreachable and that the review will be posted once the server is reachable. The review will still be displayed as if it had been posted. Finish testing this feature by starting up the server again and refreshing the page. The review will then be posted. (Note: This feature is only functional with the creation of review, not with the deletion or editing of reviews).

## Google Lighthouse Plugin Use
The Google Lighthouse plugin allows you to run a audit on a website that analyzes a webpage for certain metrics. This web application sought to maximize the three metrics in particular: Performance, Progressive Web Application and Accessibility. All these metrics should be above 90%. Please ensure that the devloper toolbar is across the bottom of the screen to ensure the Progessive Web App criteria scores above 90%.

## Google Maps API
As mentioned before, the call to the google maps api severely decreases performance and causes the Progressive Web Application rating to decrease as well. This is because Google is delivering several images (which are not next gen images) that take time to render. Unfortunately this is not something that changed as the code and files coming from Google cannot be altered. To get a more accurate rating from Lighthouse about the code written in this repository simply comment out the `<script>` calls to google maps in both of the html files.

#### Special Thanks
I would like to send a thanks to Udacity and the Grow with Google team for giving me the opportunity to participate in their Scholarship program.


