

'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var os = require('os');
var release_windows = require('./build.windows');


var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy-base', ['clean'], function() {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: [
            './node_modules/**/*',
            '*.html',
            'assets/**/*',
            'main.js',
            'package.json'
        ]
    });
}); 

gulp.task('copy-font-awesome', ['copy-base'], function() {
    return gulp.src('./bower_components/font-awesome/fonts/*')
        .pipe(rename({
            dirname: 'fonts'
        }))
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build', ['copy-font-awesome'], function() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});


gulp.task('run', function() {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});

gulp.task('package', ['build'], function() {
    switch (os.platform()) {
        case 'darwin':
            // execute build.osx.js 
            break;
        case 'linux':
            //execute build.linux.js
            break;
        case 'win32':
            return release_windows.build();
    }
});
