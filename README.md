# gulp-cshtml-minifier [![NPM version][npm-image]][npm-url]
Minify ASP.NET Razor Views (.cshtml files) & REPLACE HASH to Datetime string

## Usage

First, install `gulp-cshtml-minifier` as a development dependency:

```shell
npm install --save-dev gulp-cshtml-minifier
```

Then, add it to your `gulpfile.js`:

### Simple
```javascript
var minifyCshtml = require('gulp-cshtml-minifier');

gulp.task('minify-cshtml', function(){
  gulp.src('./Views/Shared/_Layout_Template.cshtml')
    .pipe(minifyCshtml())
    .pipe(gulp.dest('./Views/Shared/'));
});
```
### Advanced
```javascript
var minifyCshtml = require('gulp-cshtml-minifier');
var rename = require("gulp-rename"); // install gulp-rename
var header = require('gulp-header'); // install gulp-header

gulp.task('minify-cshtml', function(){
  gulp.src(['./Views/Shared/_Layout_Template.cshtml'])
    .pipe(rename('_Layout.cshtml')) // File Rename
    .pipe(minifyCshtml({
      htmlComments: true,   // Remove HTML comments <!-- -->
      jsComments: true,     // Remove JS comments /* */
      razorComments: true,  // Remove Razor comments @* *@
      whitespace: true      // Remove white-space
      replaceHash: /hash/ig // Replace 'hash' to datetime string
    }))
    .pipe(header('\ufeff')) // Fixed encode issue (可解決中文亂碼問題)
    .pipe(gulp.dest('./Views/Shared/'));
});
```

## API

gulp-cshtml-minifier can be called with an optional 'options' object.

### minifyCshtml(options)

#### options
Type: `Object`

##### options.htmlComments
Type: `boolean`
Default: `false`

Remove HTML comments `<!-- -->`

##### options.jsComments
Type: `boolean`
Default: `false`

Remove Javascript comments `/* */`

##### options.razorComments
Type: `boolean`
Default: `true`

Remove Razor comments `@* *@`

##### options.whitespace
Type: `boolean`
Default: `true`

Remove white-space between angle brackets `> <`


[npm-url]: https://www.npmjs.com/package/gulp-cshtml-minifier
[npm-image]: https://badge.fury.io/js/gulp-cshtml-minifier.svg
