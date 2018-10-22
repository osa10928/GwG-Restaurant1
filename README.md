# GwG - Restaurant Review App
This repo is part one of a Udacity Grow With Google project. The code was cloned from a boilerplate code [at this repository](https://github.com/udacity/mws-restaurant-stage-1). The goal of this repository is to show 3 stages of transformations this application undergoes. This README will guide users through the transformations this boilerplate code undergoes taking it from a plain an unintelligent website to a responsive progressive web application.

## Part I
The goal of part 1 was to take the boilerplate code I received and transform it into a responsive application that exhibited appropriate levels of accessibility and made steps towards becoming a Progressive Web Application by initiating a Service Worker and caching assets. You can read more on the specific requirements for this assignments at the original repositories READ.me listed above.

### Requirements
This application uses node for an environment and npm as a package manager. The application also uses image magick to resize images:
1. `node v9.4.0`
2. `npm v6.0.0`
3. `imagemagick v8.6`

Furthermore, this Application uses a GoogleMaps Javascript API. In order to get the full funcitonality it is necessary you register your application and obtain an API key from [google's developer console.](https://console.developers.google.com/project?pli=1)


### Running Application
This application is fairly basic and therefore easy to get up and running:
1. Clone repository
2. Visit the stage1 version of this application by going to the stage1 branch. Run `git checkout stage1`.
3. On the last `script` tag of the `index.html` and the `restaurant.html` pages be sure to replace the 'YOUR_API_KEY' portions of the src attribute with the google maps API key given to you by Google.
4. In console, enter the directory and run `npm install`
5. Run `grunt`
6. Run `npm run start` to start a localhost server on port 8080
7. Navigate to localhost:8080 in your browser and explore


## Part II
The goal of this stage of the assignment is to turn the application into a complete Front End Progressive Web Application. The involved getting the data from a remote serve instead of from a json file. The next step was getting the application to rate above a 90% in Google Chromes Lighthouse for Progressive Web applications. This mark is achieved if we disregard the how the rating is affected by the Google Maps API. While it was not explicitly required, this step was also made vastly easier and faster by utilizing Front End development automation tools, in this case, Gulp. This application also leverages several optimizations such as image, Javascript and CSS compressions, lazy-loaded images, serving gzip files and data storage using the browser's index database.

### Requirements
The requirements for this stage of the project are the same as those of the first, namely, node, npm, and imagemagick:
1. `node v9.4.0`
2. `npm v6.0.0`
3. `imagemagick v8.6`
4. `gulp-cli v2.0.1`

The Google Maps API code is still required as well ([google's developer console](https://console.developers.google.com/project?pli=1)).

### Running Application
This application involves running BackEnd server to serve data to the this repositories FrontEnd application. The steps are as follows:
1. Clone [server repository](https://github.com/udacity/mws-restaurant-stage-2).
2. Follow steps server repository README page to get the server up and running.
3. From another terminal window clone this repository.
4. On the last `script` tag of the `index.html` and the `restaurant.html` pages be sure to replace the 'YOUR_API_KEY' portions of the src attribute with the google maps API key given to you by Google.
5. In console, enter the directory and run `npm install`
6. Run `gulp prod` to generate the production build of this application. If you want to run this in development simply run `gulp`.
7. Run `node server.js` to start a localhost server on port 8000
8. Navigate to localhost:8000 in your browser and explore.
9. If your in chrome download the lighthouse plugin in. Then open devtools and run an audit.
10. If you want to delete the build folder and return the application to original state run `gulp clean` in the terminal.

### Google Maps API
As mentioned before, the call to the google maps api severely decreases performance and causes the Progressive Web Application rating to decrease as well. This is because Google is delivering several images (which are not next gen images) that take time to render. Unfortunately this is not something that changed as the code and files coming from Google cannot be altered. To get a more accurate rating from Lighthouse about the code written in this repository simply comment out the `<script>` calls to google maps in both of the html files.

#### Special Thanks
I would like to send a thanks to Udacity and the Grow with Google team for giving me the opportunity to participate in their Scholarship program.


