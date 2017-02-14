"use strict";

var gulp = require('gulp');

// gulp flow control
var gulpif = require('gulp-if'),
	sync = require('gulp-sync')(gulp);

// build tools
var del = require('del'),
	debug = require('gulp-debug'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	replace = require('gulp-replace');

// dist minification
var useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	cssMin = require('gulp-clean-css'),
	htmlMin = require('gulp-htmlmin');

// runtine tools
var browserSync = require('browser-sync').create();



// where we pace out source code
var srcPath = 'client/src';
// where ay processed code or vendor files gets paced for use i development
var buildPath = 'client/build';
// location to place vendor files for use in develpment
var vendorBuildPath = buildPath + '/vendor';

// where the final web application is placed
var distPath = 'public/client';
// location of our vendor packages
var bowerPath = 'bower_components'; 

var cfg = {
// our client application source code src globs and build paths
	root_html : { src: srcPath + '/index.html', bld: buildPath },
	css : { src: srcPath + '/stylesheets/**/*.css', bld: buildPath + '/stylesheets' },
	js : { src: srcPath + '/javascripts/**/*.js' },
	html : {src: [srcPath + '/**/*.html', '!'+srcPath + '/*.html']},


	// vendor css src globs
	bootstrap_sass : { src: bowerPath + '/bootstrap-sass/assets/stylesheets/'},

	// vendor fonts
	bootstrap_fonts : { src: bowerPath + '/bootstrap-sass/assets/fonts/**/*'},

	// vendor js src globs
	jquery : { src: bowerPath + '/jquery2/jquery.js'},
	angular : { src: bowerPath + '/angular/angular.js'},
	bootstrap_js : { src: bowerPath + '/bootstrap-sass/assets/javascripts/bootstrap.js'},
	angular_ui_router : { src: bowerPath + '/angular-ui-router/release/angular-ui-router.js'},
	angular_resource : { src: bowerPath + '/angular-resource/angular-resource.js'},

	// vendor build locations
	vendor_js : { bld: vendorBuildPath + '/javascripts'},
	vendor_css : { bld: vendorBuildPath + '/stylesheets'},
	vendor_fonts : { bld: vendorBuildPath + '/stylesheets/fonts'},

	apiUrl : { dev: 'http://localhost:3000/',
		prd: 'https://capstone.herokuapp.com'
	}

};

// files within this directory will be served as root-level resources in this priority order
var devResourcePath = [
	cfg.vendor_js.bld,
	cfg.vendor_css.bld,
	buildPath + '/javascripts',
	buildPath + '/stylesheets',
	srcPath,
	srcPath + '/javascripts',
	srcPath + '/stylesheets'
]


// remove all files below the build area
gulp.task('clean:build', function () {
	// console.log('buildPath = ' + buildPath );
	return del(buildPath);
});

// remove all files below the dist area
gulp.task('clean:dist', function () {
	return del(distPath);
});

// remove all file below both dist and build
gulp.task('clean', ['clean:build', 'clean:dist']);

// place vendor css files in build area
gulp.task('vendor_css', function () {
	return gulp.src([
	])
		.pipe(gulp.dest(cfg.vendor_css.bld));
});

// place vendor JS files in build area
gulp.task('vendor_js', function () {
	return gulp.src([
		cfg.angular.src,
		cfg.jquery.src,
		cfg.bootstrap_js.src,
		cfg.angular_resource.src,
		cfg.angular_ui_router.src
	])
		.pipe(gulp.dest(cfg.vendor_js.bld));
});

// place all font files in build area
gulp.task('vendor_fonts', function () {
	return gulp.src([
		cfg.bootstrap_fonts.src
	])
		.pipe(gulp.dest(cfg.vendor_fonts.bld))
});

// compile SASS CSS and copy over to build area
gulp.task('css', function () {
	return gulp.src(cfg.css.src).pipe(debug())
		.pipe(sourcemaps.init())
		.pipe(sass({ includePaths: [cfg.bootstrap_sass.src] }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(cfg.css.bld)).pipe(debug());
});


// prepare the development area
gulp.task('build', sync.sync(['clean:build', ['vendor_css', 'vendor_js', 'vendor_fonts', 'css']]));



// Helper method to launch server and watch for changes
function browserSyncInit( baseDir, watchFiles) {
	browserSync.instance = browserSync.init(watchFiles, {
		server: { baseDir: baseDir},
		port: 8080,
		ui: { port: 8090}
	});
};

// run the browwser against the developmet/build area and watch files been edited
gulp.task('browserSync', ['build'], function () {
	browserSyncInit(devResourcePath, [
		cfg.root_html.src,
		cfg.css.bld + '/**/*.css',
		cfg.js.src,
		cfg.html.src
	]);
});

// prepare the development environment, launch server and watch for changes
gulp.task('run', ['build', 'browserSync'], function () {
	// extensions to watch() within even if we need to pre-process source tree
	gulp.watch(cfg.css.src, ['css']);
});

// build assets referenced from root-level HTML file and create reference in HTML file
gulp.task('dist:assets', ['build'], function () {
	return gulp.src(cfg.root_html.src).pipe(debug())
		.pipe(useref( {searchPath: devResourcePath}))
		.pipe(gulpif(['**/*.js'], replace(cfg.apiUrl.dev, cfg.apiUrl.prd))) // Change Urls
		.pipe(gulpif(['**/*.js'], uglify())) // Minify JS
		.pipe(gulpif(['**/*.css'], cssMin())) // Minify CSS
		.pipe(gulp.dest(distPath)).pipe(debug());
});

// build/copy over HTML files
gulp.task('dist:html',  function () {
	return gulp.src(cfg.html.src).pipe(debug())
		.pipe(htmlMin({ collapseWhiteSpace: true})) // minify HTML
		.pipe(gulp.dest(distPath)).pipe(debug());
});

//build/copy over fonts files
gulp.task('dist:fonts', function () {
	return gulp.src(cfg.vendor_fonts.bld + '/**/*', { base: cfg.vendor_css.bld }).pipe(debug())
		.pipe(gulp.dest(distPath));
});


// build all dist artifact ready for deployment
gulp.task('dist', sync.sync(['clean', 'build', 'dist:assets', 'dist:fonts', 'dist:html']));


// execute the dist webapp in a web server
gulp.task('dist:run', ['dist'], function () {
	browserSyncInit(distPath);
});



// gulp.task("hello", function () {
// 	console.log("Hello, World!");
// });
//
// gulp.task("world",["hello"], function() {
// 	console.log("world");
// });
//
// gulp.task("default", ["world"])

