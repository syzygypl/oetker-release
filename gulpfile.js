const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', ['watch']);

gulp.task('build', () =>
    gulp.src('app/**')
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('dist'))
);

gulp.task('watch', () =>
    gulp.watch('app/**', ['build'])
);
