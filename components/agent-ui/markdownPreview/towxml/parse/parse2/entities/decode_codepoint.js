'use strict';
// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
var _a;
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.replaceCodePoint = exports.fromCodePoint = void 0;
var decodeMap = new Map([
    [0, 65533],
    [128, 8364],
    [130, 8218],
    [131, 402],
    [132, 8222],
    [133, 8230],
    [134, 8224],
    [135, 8225],
    [136, 710],
    [137, 8240],
    [138, 352],
    [139, 8249],
    [140, 338],
    [142, 381],
    [145, 8216],
    [146, 8217],
    [147, 8220],
    [148, 8221],
    [149, 8226],
    [150, 8211],
    [151, 8212],
    [152, 732],
    [153, 8482],
    [154, 353],
    [155, 8250],
    [156, 339],
    [158, 382],
    [159, 376]
]);
exports.fromCodePoint =
    (_a = String.fromCodePoint) !== null && _a !== void 0
        ? _a
        : function (codePoint) {
              var output = '';
              if (codePoint > 65535) {
                  codePoint -= 65536;
                  output += String.fromCharCode(((codePoint >>> 10) & 1023) | 55296);
                  codePoint = 56320 | (codePoint & 1023);
              }
              output += String.fromCharCode(codePoint);
              return output;
          };
function replaceCodePoint(codePoint) {
    var _a;
    if ((codePoint >= 55296 && codePoint <= 57343) || codePoint > 1114111) {
        return 65533;
    }
    return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
exports.replaceCodePoint = replaceCodePoint;
function decodeCodePoint(codePoint) {
    return (0, exports.fromCodePoint)(replaceCodePoint(codePoint));
}
exports.default = decodeCodePoint;
//# sourceMappingURL=decode_codepoint.js.map
