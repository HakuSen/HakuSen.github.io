const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

gulp.task('js', () => {
    return watch('index.js', function() {
        gulp.src('index.js')
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));
            console.log('小河弯弯');
    })
});
