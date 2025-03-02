!(function (e) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = e();
    else if ('function' == typeof define && define.amd) {
        define([], e);
    } else {
        var r;
        r = 'undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : this;
        r.markdownitSub = e();
    }
})(function () {
    return (function e(r, o, n) {
        function t(i, u) {
            if (!o[i]) {
                if (!r[i]) {
                    var f = 'function' == typeof require && require;
                    if (!u && f) {
                        return f(i, true);
                    }
                    if (s) {
                        return s(i, true);
                    }
                    var p = new Error("Cannot find module '" + i + "'");
                    throw ((p.code = 'MODULE_NOT_FOUND'), p);
                }
                var a = (o[i] = {
                    exports: {}
                });
                r[i][0].call(
                    a.exports,
                    function (e) {
                        var o = r[i][1][e];
                        return t(o ? o : e);
                    },
                    a,
                    a.exports,
                    e,
                    r,
                    o,
                    n
                );
            }
            return o[i].exports;
        }
        for (var s = 'function' == typeof require && require, i = 0; i < n.length; i++) {
            t(n[i]);
        }
        return t;
    })(
        {
            1: [
                function (e, r) {
                    'use strict';

                    function o(e, r) {
                        var o;
                        var t;
                        var s;
                        var i = e.posMax;
                        var u = e.pos;
                        if (126 !== e.src.charCodeAt(u)) {
                            return false;
                        }
                        if (r) {
                            return false;
                        }
                        if (u + 2 >= i) {
                            return false;
                        }
                        for (e.pos = u + 1; e.pos < i; ) {
                            if (126 === e.src.charCodeAt(e.pos)) {
                                o = true;
                                break;
                            }
                            e.md.inline.skipToken(e);
                        }
                        return o && u + 1 !== e.pos
                            ? ((t = e.src.slice(u + 1, e.pos)),
                              t.match(/(^|[^\\])(\\\\)*\s/)
                                  ? ((e.pos = u), false)
                                  : ((e.posMax = e.pos),
                                    (e.pos = u + 1),
                                    (s = e.push('sub_open', 'sub', 1)),
                                    (s.markup = '~'),
                                    (s = e.push('text', '', 0)),
                                    (s.content = t.replace(n, '$1')),
                                    (s = e.push('sub_close', 'sub', -1)),
                                    (s.markup = '~'),
                                    (e.pos = e.posMax + 1),
                                    (e.posMax = i),
                                    true))
                            : ((e.pos = u), false);
                    }
                    var n = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
                    r.exports = function (e) {
                        e.inline.ruler.after('emphasis', 'sub', o);
                    };
                },
                {}
            ]
        },
        {},
        [1]
    )(1);
});
