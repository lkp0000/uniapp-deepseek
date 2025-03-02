!(function (e) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = e();
    else if ('function' == typeof define && define.amd) {
        define([], e);
    } else {
        var n;
        n = 'undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : this;
        n.markdownitIns = e();
    }
})(function () {
    return (function e(n, t, o) {
        function r(s, f) {
            if (!t[s]) {
                if (!n[s]) {
                    var u = 'function' == typeof require && require;
                    if (!f && u) {
                        return u(s, true);
                    }
                    if (i) {
                        return i(s, true);
                    }
                    var l = new Error("Cannot find module '" + s + "'");
                    throw ((l.code = 'MODULE_NOT_FOUND'), l);
                }
                var p = (t[s] = {
                    exports: {}
                });
                n[s][0].call(
                    p.exports,
                    function (e) {
                        var t = n[s][1][e];
                        return r(t ? t : e);
                    },
                    p,
                    p.exports,
                    e,
                    n,
                    t,
                    o
                );
            }
            return t[s].exports;
        }
        for (var i = 'function' == typeof require && require, s = 0; s < o.length; s++) {
            r(o[s]);
        }
        return r;
    })(
        {
            1: [
                function (e, n, t) {
                    'use strict';

                    n.exports = function (e) {
                        function n(e, n) {
                            var t;
                            var o;
                            var r;
                            var i;
                            var s;
                            var f = e.pos;
                            var u = e.src.charCodeAt(f);
                            if (n) {
                                return false;
                            }
                            if (43 !== u) {
                                return false;
                            }
                            o = e.scanDelims(e.pos, true);
                            i = o.length;
                            s = String.fromCharCode(u);
                            if (2 > i) {
                                return false;
                            }
                            for (i % 2 && ((r = e.push('text', '', 0)), (r.content = s), i--), t = 0; i > t; t += 2) {
                                r = e.push('text', '', 0);
                                r.content = s + s;
                                e.delimiters.push({
                                    marker: u,
                                    jump: t,
                                    token: e.tokens.length - 1,
                                    level: e.level,
                                    end: -1,
                                    open: o.can_open,
                                    close: o.can_close
                                });
                            }
                            e.pos += o.length;
                            return true;
                        }
                        function t(e) {
                            var n;
                            var t;
                            var o;
                            var r;
                            var i;
                            var s = [];
                            var f = e.delimiters;
                            var u = e.delimiters.length;
                            for (n = 0; u > n; n++) {
                                o = f[n];
                                if (43 === o.marker && -1 !== o.end) {
                                    r = f[o.end];
                                    i = e.tokens[o.token];
                                    i.type = 'ins_open';
                                    i.tag = 'ins';
                                    i.nesting = 1;
                                    i.markup = '++';
                                    i.content = '';
                                    i = e.tokens[r.token];
                                    i.type = 'ins_close';
                                    i.tag = 'ins';
                                    i.nesting = -1;
                                    i.markup = '++';
                                    i.content = '';
                                    if ('text' === e.tokens[r.token - 1].type && '+' === e.tokens[r.token - 1].content) {
                                        s.push(r.token - 1);
                                    }
                                }
                            }
                            for (; s.length; ) {
                                for (n = s.pop(), t = n + 1; t < e.tokens.length && 'ins_close' === e.tokens[t].type; ) {
                                    t++;
                                }
                                t--;
                                if (n !== t) {
                                    i = e.tokens[t];
                                    e.tokens[t] = e.tokens[n];
                                    e.tokens[n] = i;
                                }
                            }
                        }
                        e.inline.ruler.before('emphasis', 'ins', n);
                        e.inline.ruler2.before('emphasis', 'ins', t);
                    };
                },
                {}
            ]
        },
        {},
        [1]
    )(1);
});
