var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var del = require('del');
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gls = require('gulp-live-server');
var env = require('gulp-env');

var config = {
	js: 'js/**/*.js',
    images : 'images/*.*',
    fonts : 'fonts/*.*',
  	html: 'templates/*.html',
	temp: 'temp/'
}

var dist = {
    path : 'dist/',
    images : 'images/',
    fonts : 'fonts/',
    css   : 'css/',
    js    : 'js/'
}

gulp.task('env',function(){
    env({
        gmail_id : 'your gmail id' , // used as from email address
        gmail_password : 'gmail password', // gmail password
        to_email : 'to email id', // email id to send emails to
        send_grid_key : 'send grid API key' // send grid API Key
    });
});


gulp.task('watch', function () {
  gulp.watch(['index.html','js/**/*.js','styles/**/*.css','templates/**/*.html'], ['build-dev']);
});

gulp.task('default', ['server', 'build-dev', 'watch']);


gulp.task('server',['env'],function(){
   var server = gls('server.js');
   server.start();
   var serverRestset = function(){
       server.stop();
       server.start();
   }
   gulp.watch('server.js',serverRestset);
});

gulp.task('build', ['minifyjs'], function(){
  del(config.temp);
});

gulp.task('build-dev',['concat'],function(){
  del(config.temp);
});

gulp.task('minifyjs',['concat'],function(){
   return gulp.src([dist.path+'js/scripts.js'])
   .pipe(uglify())
   .pipe(gulp.dest('dist/js/'));
});

gulp.task('concat',['useref','templatecache'],function(){
    return gulp.src(['dist/js/scripts.js','temp/templates.js'])
    .pipe(concat('scripts.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('vet', function(){
  return gulp.src([
    config.js
  ])
  .pipe(jshint())
  .pipe(jscs())
  .pipe(jshint.reporter('jshint-stylish'), {verbose: true})
  .pipe(jshint.reporter('fail'));
});

gulp.task('templatecache',function(){
    return gulp.src([config.html])
    .pipe(minifyHtml({empty:true}))
    .pipe(angularTemplatecache('templates.js',{
        module:'news',
        standAlone: false,
        root : 'templates/'
    }))
    .pipe(gulp.dest(config.temp));
})

gulp.task('useref',['vet','clean-js','clean-styles'],function(){

    return gulp.src('index.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// helper tasks

gulp.task('clean-js',function(){
    del(dist.path + dist.js);
});

gulp.task('clean-styles',function(){
    del(dist.path + dist.css);
});
