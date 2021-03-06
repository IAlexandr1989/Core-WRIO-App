var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');

gulp.task('babel-server', function() {
    gulp.src('src/index.js')
        .pipe(babel())
        .on('error', function(err) {
            console.log('Babel server:', err.toString());
        })
        .pipe(gulp.dest('app'));
        
    gulp.src('src/server/**/*.*')
        .pipe(babel())
        .on('error', function(err) {
            console.log('Babel server:', err.toString());
        })
        .pipe(gulp.dest('app/server'));
});

gulp.task('babel-client', function() {
    browserify({ 
            entries: './src/client/js/client.js',
            debug: true 
        })
        .transform(babelify)
        .bundle()
        .pipe(source('client.js'))
        .pipe(gulp.dest('app/client'));
});

gulp.task('views', function() {
    gulp.src('src/client/views/**/*.*')
        .pipe(gulp.dest('app/client/views'));
});

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['src/**']
    }) 
        .on('error', function(error) {
            console.log('Nodemon:', event.message);
        });
});

gulp.task('default', ['babel-server', 'babel-client', 'views']);

gulp.task('watch', ['default', 'nodemon'], function() {
    gulp.watch(['src/index.js', 'src/server/**/*.*'], ['babel-server']);
    gulp.watch('src/client/js/**/*.*', ['babel-client']);
    gulp.watch('src/client/views/**/*.*', ['views']);
});