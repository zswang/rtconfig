/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var jdists = require('gulp-jdists');
var examplejs = require('gulp-examplejs');

gulp.task('build', function() {
  return gulp.src(['src/rtconfig.js'])
    .pipe(jdists({
      trigger: 'release'
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('example', function() {
  return gulp.src('src/**.js')
    .pipe(examplejs({
      header: "var RealtimeConfig = require('../');\n"
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('default', ['build']);