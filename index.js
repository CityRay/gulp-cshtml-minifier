'use strict';
var Transform = require('readable-stream/transform');
var rs = require('replacestream');

module.exports = function(options) {
  return new Transform({
    objectMode: true,
    transform: function(file, enc, callback) {
      if (file.isNull()) {
        // 不做處理
        return callback(null, file);
      }

      function doReplace() {
        if (file.isStream()) {
          // file.contents 是一個 Stream - https://nodejs.org/api/stream.html
          file.contents = file.contents.pipe(rs());
          return callback(null, file);
        }

        if (file.isBuffer()) {
          // file.contents 是 Buffer - https://nodejs.org/api/buffer.html
          var temp = String(file.contents);

          // Ideas: https://github.com/deanhume/html-minifier
          //        https://github.com/RehanSaeed/gulp-minify-cshtml

          if ((options !== undefined) && options.htmlComments) {
            // <!--    - Match the start of the comment.
            // [\s\S]* - Match anything in between.
            // ?       - Or nothing at all.
            // -->     - Match the end of the comment.
            // g       - Match globally.
            temp = temp.replace(/<!--[\s\S]*?-->/g, '');
          }

          if ((options !== undefined) && options.jsComments) {
            // /\*    - Match the start of the comment.
            // [\s\S]* - Match anything in between.
            // ?       - Or nothing at all.
            // \*\/     - Match the end of the comment.
            // g       - Match globally.
            temp = temp.replace(/\/\*[\s\S]*?\*\//g, '');
          }

          if ((options === undefined) || options.razorComments) {
            // @\*     - Match the start of the comment.
            // [\s\S]* - Match anything in between.
            // ?       - Or nothing at all.
            // \*@     - Match the end of the comment.
            // g       - Match globally.
            temp = temp.replace(/@\*[\s\S]*?\*@/g, '');
          }

          if ((options === undefined) || options.whitespace) {
            // >           - Match the end of a tag.
            // [\s]*       - Match any white-space.
            // \<          - Match the start of a tag.
            // (?!(\/pre)) - Do not match /pre. This stops removing white space between pre tags.
            // gi          - Match globally and case insensitive.
            temp = temp.replace(/>[\s]*\<(?!(\/pre))/gi, '><');
          }

          if (options.replaceHash && options.replaceHash instanceof RegExp) {
            temp = temp.replace(options.replaceHash, new Date().getTime());
          }

          // Replace All Newline
          temp = temp.replace(/\s*\n\s*/gi, '\n');

          file.contents = new Buffer(temp);

          return callback(null, file);
        }

        callback(null, file);
      }

      doReplace();
    }
  });
};
