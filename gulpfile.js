var gulp = require('gulp');
var babelify = require('babelify');
var babel = require('gulp-babel');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var merge = require('merge');
var rename = require('gulp-rename')
var source = require('vinyl-source-stream');
var sourceMaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');

gulp.task('clean', function(done) {
	del(['build'], done)
})

var config = {
	js: {
		src: './js/main.js', // Entry point
		outputDir: './build/js/',  // Bundle output Directory
		mapDir: './maps/', // Subdirectory for sourcemaps
		outputFile: 'bundle.js' // Bundle name
	},
	sw: {
		src: './pre-sw.js',
		outputDir: './build/',
		mapDir: './maps/',
		outputFile: 'sw.js'
	}
}

function bundle(bundler) {
	// Options for the base 'bundler' object

	bundler.bundle()
	  .pipe(source(config.js.src))
	  .pipe(buffer())
	  .pipe(rename(config.js.outputFile))
	  .pipe(sourceMaps.init({ loadMaps: true })) // Strip inline source maps
	  .pipe(uglify())
	  .pipe(sourceMaps.write(config.js.mapDir)) // Save sourcemaps to destination
	  .pipe(gulp.dest(config.js.outputDir))
}

function prodBundle(bundler) {
	bundler.bundle()
	  .pipe(source(config.js.src))
	  .pipe(buffer())
	  .pipe(rename(config.js.outputFile))
	  .pipe(uglify())
	  .pipe(gulp.dest(config.js.outputDir))
}

function swBundle(bundler) {

	bundler.bundle()
	  .pipe(source(config.sw.src))
	  .pipe(buffer())
	  .pipe(rename(config.sw.outputFile))
	  .pipe(sourceMaps.init({ loadMaps: true }))
	  .pipe(uglify())
	  .pipe(sourceMaps.write(config.sw.mapDir))
	  .pipe(gulp.dest(config.sw.outputDir))

}

function prodSwBundle(bundler) {
	bundler.bundle()
	  .pipe(source(config.sw.src))
	  .pipe(buffer())
	  .pipe(rename(config.sw.outputFile))
	  .pipe(sourceMaps.init({ loadMaps: true }))
	  .pipe(uglify())
	  .pipe(sourceMaps.write(config.sw.mapDir))
	  .pipe(gulp.dest(config.sw.outputDir))
}

gulp.task('bundle', function() {
	var bundler = browserify(config.js.src)
	  .transform(babelify, { presets: ['env'] })

	bundle(bundler)
})

gulp.task('prodBundle', function() {
	var bundler = browserify(config.js.src)
	  .transform(babelify, { presets: ['env'] })

	prodBundle(bundler)
})

gulp.task('mainjs', function() {
	gulp.src('js/main.js')
	.pipe(gulp.dest('./build/js'))
})

gulp.task('sw', function() {
	var bundler = browserify(config.sw.src)
	  .transform(babelify, { presets: ['env'] })

	swBundle(bundler)
})

gulp.task('prodSw', function() {
	var bundler = browserify(config.sw.src)
	  .transform(babelify, { presets: ['env'] })

	prodSwBundle(bundler)
})

gulp.task('minify-css', function() {
	gulp.src('css/styles.css')
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('./build/css/'))
})

gulp.task('html', function() {
	gulp.src('*.html')
	.pipe(gulp.dest('./build/'))
})

gulp.task('manifest', function() {
	gulp.src('manifest.json')
	.pipe(gulp.dest('./build/'))
})

gulp.task('compress-medium', function() {
	gulp.src(['img/*', '!img/icons/'])
	  .pipe(imagemin())
	  .pipe(rename(function(path) {
	  	path.basename += "-800medium"
	  }))
	  .pipe(gulp.dest('./build/images/'))
})

gulp.task('compress-small', function() {
	gulp.src(['img/*', '!img/icons/'])
	  .pipe(imagemin())
	  .pipe(imageResize({
	  	imageMagick: true,
	  	width: 350
	  }))
	  .pipe(rename(function(path) {
	  	path.basename += "-350small"
	  }))
	  .pipe(gulp.dest('./build/images/'))
})

gulp.task('icons', function() {
	gulp.src('img/icons/*')
	  .pipe(gulp.dest('./build/images/icons'))
})

gulp.task('images', ['compress-small', 'compress-medium', 'icons'])

gulp.task('watch', function() {
	gulp.watch('./js/**/*.js', ['bundle']);
	gulp.watch('*.html', ['html']);
	gulp.watch('pre-sw.js', ['sw']);
	gulp.watch('css/styles.css', ['minify-css']);
	gulp.watch('mainfest.json', ['manifest'])
})


gulp.task('default', ['bundle', 'mainjs', 'sw', 'minify-css', 'html', 'manifest', 'images', 'watch'])

gulp.task('prod', ['prodBundle', 'mainjs', 'prodSw', 'minify-css', 'html', 'images', 'manifest'])
