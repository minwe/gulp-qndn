# gulp-qndn

Qiniu DN gulp tasks.

## Install

```
npm install --save-dev gulp-react
```

## Usage

```js
var gulp = require('gulp');
var upload = require('gulp-qndn').upload;

var qnOptions = {
  accessKey: 'your access key',
  secretKey: 'your secret key',
  bucket: 'your bucket name',
  domain: 'http://xxxx.xxx.xx.glb.clouddn.com'
};

gulp.task('default', function () {
  return gulp.src('template.jsx')
    .pipe(upload({qn: qnOptions}))
    .pipe(gulp.dest('dist'));
});
```

## API

### `.upload(options)`

### `options.qn`

`object` Qinniu DN config, see [qn docs](https://www.npmjs.com/package/qn#upload).

#### `options.prefix`

`string` fiel path prefix, default `''`.

#### `options.flatten`

`bool`, flatten file path or not, default `false`.
