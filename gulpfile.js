const { src, dest, watch, parallel, series } = require('gulp')

const concat        = require('gulp-concat')
const uglify        = require('gulp-uglify-es').default
const scss          = require('gulp-sass')(require('sass'))
const browserSync   = require('browser-sync').create()
const autoprefixer  = require('gulp-autoprefixer')
const cleancss      = require('gulp-clean-css')
const panini        = require('panini')
const plumber       = require('gulp-plumber')
const notify        = require('gulp-notify')
const del           = require('del')
// const imagemin      = require('gulp-imagemin')
// const rigger        = require('gulp-rigger')
// const webpackStream = require('webpack-stream')


function html() {
	panini.refresh()
	return src(['src/*.html', '!src/**/_*.html'])
	.pipe(plumber())
	.pipe(panini({
		root: 'src/',
		layouts: 'src/templates/layouts/',
		partials: 'src/templates/partials/',
		data: 'src/templates/data/'
	}))
	.pipe(dest('dist'))
	.pipe(browserSync.stream())
}

function styles() {
	return src([
		//'node_modules/swiper/swiper-bundle.min.css',
		//'node_modules/lightgallery.js/dist/css/lightgallery.min.css',
		//'node_modules/magnific-popup/dist/magnific-popup.css',
		//'node_modules/simplebar/dist/simplebar.min.css',
		'src/assets/scss/style.scss'
	])
	.pipe(plumber({
		errorHandler : function(err) {
			notify.onError({
				title:    "SCSS Error",
				message:  "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		}
	}))
	.pipe(scss())
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 10 version'],
		grid: true
	}))
	.pipe(cleancss({
		level:{1: {specialComments:0}},
		format: 'beautify'
	}))
	.pipe(concat('style.css'))
	.pipe(dest('dist/assets/css'))
	.pipe(browserSync.stream())
}

function scripts() {		
	return src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
		//'node_modules/swiper/swiper-bundle.min.js',
		//'node_modules/lightgallery.js/dist/js/lightgallery.min.js',
		//'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
		//'node_modules/enllax/dist/jquery.enllax.min.js',
		//'node_modules/jquery-validation/dist/jquery.validate.min.js',
		//'node_modules/simplebar/dist/simplebar.min.js',
		// 'src/assets/js/_popup.js',
		// 'src/assets/js/_amount.js',
		// 'src/assets/js/_select.js',
		// 'src/assets/js/_tabs.js',
		// 'src/assets/js/_validPrice.js',
		// 'src/assets/js/_dynamic_adapt.js',
		'src/assets/js/main.js'
	])
	.pipe(plumber({
		errorHandler : function(err) {
			notify.onError({
				title:    "JS Error",
				message:  "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		}
	}))
	.pipe(concat('main.js'))
	.pipe(dest('dist/assets/js'))
	.pipe(browserSync.stream())
}

function images() {
	return src('src/assets/images/**/*')
	.pipe(dest('dist/assets/images'))
	.pipe(browserSync.stream())
}

function clean() {
	return del('dist/**/*')
}

function startwatch() {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		//proxy: 'folder/dist',
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	});
	watch('src/**/*.html', html)
	watch('src/assets/scss/**/*.scss', styles)
	watch(['src/assets/js/**/*.js', '!src/js/**/*.min.js'], scripts)
	watch('src/assets/images/**/*.{jpg,jpeg,png,webp,avif,svg,gif,ico,webmanifest,xml,json}', images)
}



exports.html    = html
exports.scripts = scripts
exports.styles  = styles
exports.images  = images
exports.clean   = clean;

exports.build   = series(clean, html, scripts, styles, images)
exports.default = series(html, scripts, styles, images, parallel(startwatch))