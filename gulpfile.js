var gulp = require('gulp');
const zip = require('gulp-zip');
var del = require('del');

const OUTPUT_NAME_FOLDER = 'teste';

const clean = () => {
    return del([OUTPUT_NAME_FOLDER +'/**', '!' + OUTPUT_NAME_FOLDER]);
}

const zipFolder = () => (
    gulp.src('./*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest(OUTPUT_NAME_FOLDER))
);

exports.default = gulp.series(clean,zipFolder);