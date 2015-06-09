'use strict';

// https://github.com/qiniu/qetag
// http://developer.qiniu.com/docs/v6/api/overview/appendix.html
// https://github.com/qiniu/qetag/blob/master/qetag.js
// https://github.com/demohi/gulp-qn/blob/master/lib/hash.js

var crypto = require('crypto');

// 计算文件的 eTag，参数为 buffer 或者 readableStream 或者文件路径
function getEtag(buffer, callback) {
  // 判断传入的参数是buffer还是stream还是filepath
  var mode = 'buffer';

  if (typeof buffer === 'string') {
    buffer = require('fs').createReadStream(buffer);
    mode = 'stream';
  } else if (buffer instanceof require('stream')) {
    mode = 'stream';
  }

  // sha1 算法
  var sha1 = function(content) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(content);
    return sha1.digest();
  };

  // 以 4M 为单位分割
  var blockSize = 4 * 1024 * 1024;
  var sha1String = [];
  var prefix = 0x16;
  var blockCount = 0;

  switch (mode) {
    case 'buffer':
      var bufferSize = buffer.length;
      blockCount = Math.ceil(bufferSize / blockSize);

      for (var i = 0; i < blockCount; i++) {
        sha1String.push(sha1(buffer.slice(i * blockSize, (i + 1) * blockSize)));
      }
      process.nextTick(function() {
        callback(calcEtag());
      });
      break;
    case 'stream':
      var stream = buffer;
      stream.on('readable', function() {
        var chunk;
        while (chunk = stream.read(blockSize)) {
          sha1String.push(sha1(chunk));
          blockCount++;
        }
      });
      stream.on('end', function() {
        callback(calcEtag());
      });
      break;
  }

  function calcEtag() {
    if (!sha1String.length) {
      return 'Fto5o-5ea0sNMlW_75VgGJCv2AcJ';
    }
    var sha1Buffer = Buffer.concat(sha1String, blockCount * 20);

    // 如果大于4M，则对各个块的sha1结果再次sha1
    if (blockCount > 1) {
      prefix = 0x96;
      sha1Buffer = sha1(sha1Buffer);
    }

    sha1Buffer = Buffer.concat(
        [new Buffer([prefix]), sha1Buffer],
        sha1Buffer.length + 1
    );

    return sha1Buffer.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
  }
}

module.exports = getEtag;
