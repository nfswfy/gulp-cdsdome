/**
 * Created by zhangsb on 2016/11/30.
 */
// var gulp = require('gulp'),
//     eslint = require('gulp-eslint'),
//     minify = require('gulp-minify-css'),//css压缩
//     concat = require('gulp-concat'),//文件合并
//     uglify = require('gulp-uglify'),//js压缩
//     rename = require('gulp-rename'),//文件重命名
//     imagemin = require('gulp-imagemin'),//压缩图片
//     clean = require('gulp-clean'),//清空文件夹
//     rev = require('gulp-rev'),//更改版本号
//     revCollector = require('gulp-rev-collector');//gulp-rev插件，用于html模板更改引用路径

//压缩css
// gulp.task('minifyCss', function () {
//     return gulp.src('public/css/*.css')
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(minify())
//         .pipe(concat('main.css'))
//         .pipe(gulp.dest('dist/css'));
// });

//压缩js
// gulp.task('minifyJs', function () {
// return gulp.src('public/js/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/js'));

// gulp.src("./app/app.js")
//     // .pipe(assetRev())
//     .pipe(gulp.dest('dist/js'));
// gulp.src('./app/controllers/**/*.js')
//     .pipe(JSHint())
//     .pipe(JSHint.reporter('default'));
// gulp.src(['./app/services/**/*.js'])
//     .pipe(JSHint())
//     .pipe(JSHint.reporter('default'));
// });

//压缩图片
// gulp.task('minifyImg', function () {
//     return gulp.src('public/img/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/image'));
// });

var gulp = require('gulp');
var assetRev = require('gulp-asset-rev');
var minifyCss = require("gulp-minify-css"); //压缩是css
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var JSHint = require("gulp-jshint");
var uglify = require('gulp-uglify');
var map = require("map-stream");
var customerReporter = map(function (file, cb) {
    if (!file.jshint.success) {
        //打印出错误信息  
        console.log('[ ' + file.jshint.errorCount + ' errors in ]' + file.path);
        file.jshint.results.forEach(function (err) {
            if (err) {
                console.log("在 " + file.path + " 文件的\n第" + err.error.line + " 行的第" + err.error.character + " 列发生错误", "错code误内容为  " + err.error.code + ', ' + err.error.raw);
            }
        });
    }
    cb(null, file);
});
gulp.task('html', function () {
    gulp.src("./index.html")
        .pipe(assetRev())
        .pipe(gulp.dest('./'));
});
gulp.task("cssmin", function () { //编译任务，压缩css
    gulp.src(['assets/**/css/*.css', 'assets/**/css/**/*.css'])
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest("build"))
        .pipe(rev.manifest()) //生成一个rev-manifest.json
        .pipe(gulp.dest("build/revcss")) //将rev-manifest.json保存到rev目录内
});
gulp.task('js', function () {
    gulp.src("./app/app.js")
        .pipe(assetRev())
        .pipe(gulp.dest('./app'));
});
gulp.task('js-check', function () {
    gulp.src('./app/controllers/**/*.js')
        .pipe(JSHint())
        .pipe(customerReporter)
        .pipe(JSHint.reporter('default'));
    gulp.src(['./app/services/**/*.js'])
        .pipe(JSHint())
        .pipe(customerReporter)
        .pipe(JSHint.reporter('default'));
});
gulp.task('default', ['html', 'cssmin', 'js']);

// gulp.task('default', ['minifyCss', 'minifyJs']);