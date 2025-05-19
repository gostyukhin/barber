import gulp from 'gulp';
const { src, dest } = gulp;

import pug from 'gulp-pug';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

import svgSprite from 'gulp-svg-sprite';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import gulpSourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
const server = browserSync.create();

import realFavicon from 'gulp-real-favicon';

const paths = {
  pug: 'src/pug/pages/*.pug',
  sass: 'src/scss/styles.scss',
  js: 'src/js/**/*.js',
  fonts: 'src/fonts/**/*',
  images: 'src/images/**/*.{jpg,jpeg,png,webp}',
  svg: 'src/icons/**/*.svg',
  imagesSvg: 'src/images/**/*.svg',
  dist: 'docs/',
  swiper: 'node_modules/swiper/',
  fancybox: 'node_modules/@fancyapps/ui/dist/fancybox/',
  libs: 'docs/libs/',
  AOS: 'node_modules/aos/dist/',
};

gulp.task('clean', function () {
  return deleteAsync([paths.dist]);
});

gulp.task('pug', function () {
  return gulp.src(paths.pug)
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(server.stream());
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(gulpSourcemaps.init())
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: ['> 1%', 'last 5 versions'] })]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(server.stream());
});

gulp.task('scripts', function () {
  return gulp.src(paths.js)
    .pipe(gulpSourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist + 'js'))
    .pipe(server.stream());
});

gulp.task('svg', function () {
  return gulp.src(paths.imagesSvg)
    .pipe(imagemin([
      imageminSvgo({
        plugins: [
          { name: 'removeViewBox', active: false }
        ]
      })
    ]))
    .pipe(gulp.dest(paths.dist + 'icons'));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 }),
    ]))
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest(paths.dist + 'images'));
});

gulp.task('svg-sprite', function () {
  return gulp.src(paths.svg)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: 'sprite.svg',
        },
      },
    }))
    .pipe(gulp.dest(paths.dist + 'images/'))
    .pipe(rename('_sprite.pug'))
    .pipe(gulp.dest('src/includes/'))
});

gulp.task('fonts', function () {
  gulp.src(paths.fonts)
    .pipe(fonter({ formats: ['woff'] }))
    .pipe(gulp.dest(paths.dist + 'fonts'));

  return gulp.src(paths.fonts)
    .pipe(ttf2woff2())
    .pipe(gulp.dest(paths.dist + 'fonts'));
});

gulp.task('copy-swiper', () => {
  return gulp.src([
    `${paths.swiper}swiper-bundle.min.js`,
    `${paths.swiper}swiper-bundle.min.css`
  ])
    .pipe(gulp.dest(`${paths.libs}swiper`));
});

gulp.task('copy-fancybox', () => {
  return gulp.src([
    `${paths.fancybox}fancybox.umd.js`,
    `${paths.fancybox}fancybox.css`,
  ])
    .pipe(gulp.dest(`${paths.libs}fancybox`));
});

const FAVICON_SRC = 'src/favicons/favicon.png';
const FAVICON_DEST = 'docs/favicons/';
const FAVICON_DATA_FILE = 'src/data/faviconData.json';

gulp.task('generate-favicon', function (done) {
  realFavicon.generateFavicon({
    masterPicture: FAVICON_SRC,
    dest: FAVICON_DEST,
    iconsPath: '/favicons',
    design: {
      ios: { pictureAspect: 'noChange' },
      desktopBrowser: {},
      windows: { pictureAspect: 'noChange', backgroundColor: '#ffffff', onConflict: 'override' },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'My Website',
          display: 'standalone',
          orientation: 'portrait',
          onConflict: 'override',
          declared: true
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
});

gulp.task('generate-favicon-code', function () {
  return gulp.src(FAVICON_DATA_FILE)
    .pipe(realFavicon.injectFaviconMarkups())
    .pipe(gulp.dest('docs/'));
});

gulp.task('copy-aos', () => {
  return gulp.src([
    `${paths.AOS}aos.js`,
    `${paths.AOS}aos.css`,
  ])
    .pipe(gulp.dest(paths.libs + 'aos'));
});

gulp.task('copy:sprite-inline', function () {
  return gulp.src('src/includes/_sprite.pug')
    .pipe(gulp.dest('docs/includes'));
});

gulp.task('watch', function () {
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch(paths.js, gulp.series('scripts'));
  gulp.watch(paths.fonts, gulp.series('fonts'));
  gulp.watch(paths.images, gulp.series('images'));
  gulp.watch(paths.imagesSvg, gulp.series('svg'));
  gulp.watch(paths.svg, gulp.series('svg-sprite'));
});

gulp.task('browser-sync', function () {
  server.init({
    server: {
      baseDir: paths.dist,
    },
    notify: false,
    open: true,
  });
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('pug', 'sass', 'scripts', 'fonts',
    'images', 'svg', 'svg-sprite', 'copy-swiper',
    'copy-fancybox', 'copy-aos', 'generate-favicon',
    'generate-favicon-code', 'copy:sprite-inline'),
  gulp.parallel('browser-sync', 'watch')
));