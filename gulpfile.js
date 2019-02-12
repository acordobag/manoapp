'use strict'

const gulp = require('gulp')
const rename = require('gulp-rename')

gulp.task('development', () => {
  gulp.src('./enviroments/dev.js')
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./config/'))
  gulp.src('./enviroments/dev.vue.js')
    .pipe(rename('vue.js'))
    .pipe(gulp.dest('./config/'))
})

gulp.task('staging', () => {
  gulp.src('./enviroments/stag.js')
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./config/'))
  gulp.src('./enviroments/stag.vue.js')
    .pipe(rename('vue.js'))
    .pipe(gulp.dest('./config/'))
})

gulp.task('production', () => {
  gulp.src('./enviroments/prod.js')
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./config/'))
  gulp.src('./enviroments/prod.vue.js')
    .pipe(rename('vue.js'))
    .pipe(gulp.dest('./config/'))
})
