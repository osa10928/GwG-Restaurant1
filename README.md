# GwG - Restaurant Review App
This repo is part one of a Udacity Grow With Google project. The code was cloned from a boilerplate code [at this repository](https://github.com/udacity/mws-restaurant-stage-1). The goal of this repository was to transform the application I recieved to a responsive application that exhibited appropriate levels of accessibility and made steps towards becoming a Progressive Web Application by initiating a Service Worker and caching assets. You can read more on the assignments for this application at the original repositories READ.me listed above.

## Requirements
This application uses node for an environement and npm as a package manger:
`node v9.4.0`
`npm v6.0.0`

Furthermore, this Application uses a GoogleMaps Javascript API. In order to get the full funcitonality it is necessary you register your application and obtain an API key from [google's developer console.](https://console.developers.google.com/project?pli=1)


## Running Application
This application is fairly basic and therefore easy to get up and running:
1. Clone repository
2. On the last `script` tag of the `index.html` and the `restaurant.html` pages be sure to replace the 'YOUR_API_KEY' portions of the src attribute witht the google maps API key given to you by Google.
3. In console, enter the directory and run `npm install`
4. Run `grunt`
5. Run `npm run start` to start a localhost server on port 8080
6. Navigate to localhost:8080 in your browser and explore


### Special Thanks
I would like to send a thanks to Udacity and the Grow with Google team for giving me the opportunity to participate in their Scholarship program.