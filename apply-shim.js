(function() {
    /*

        Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
        This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
        The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
        The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
        Code distributed by Google as part of the polymer project is also
        subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
        */
    'use strict';
    var l = !(window.ShadyDOM && window.ShadyDOM.inUse),
        p;

    function r(a) { p = a && a.shimcssproperties ? !1 : l || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)")) }
    var t;
    window.ShadyCSS && void 0 !== window.ShadyCSS.cssBuild && (t = window.ShadyCSS.cssBuild);
    var aa = !(!window.ShadyCSS || !window.ShadyCSS.disableRuntime);
    window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? p = window.ShadyCSS.nativeCss : window.ShadyCSS ? (r(window.ShadyCSS), window.ShadyCSS = void 0) : r(window.WebComponents && window.WebComponents.flags);
    var u = p,
        v = t;

    function w() { this.end = this.start = 0;
        this.rules = this.parent = this.previous = null;
        this.cssText = this.parsedCssText = "";
        this.atRule = !1;
        this.type = 0;
        this.parsedSelector = this.selector = this.keyframesName = "" }

    function x(a) { a = a.replace(ba, "").replace(ca, ""); var b = y,
            c = a,
            e = new w;
        e.start = 0;
        e.end = c.length; for (var d = e, f = 0, g = c.length; f < g; f++)
            if ("{" === c[f]) { d.rules || (d.rules = []); var h = d,
                    k = h.rules[h.rules.length - 1] || null;
                d = new w;
                d.start = f + 1;
                d.parent = h;
                d.previous = k;
                h.rules.push(d) } else "}" === c[f] && (d.end = f + 1, d = d.parent || e);
        return b(e, a) }

    function y(a, b) {
        var c = b.substring(a.start, a.end - 1);
        a.parsedCssText = a.cssText = c.trim();
        a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = da(c), c = c.replace(z, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = A : c.match(ea) && (a.type = B, a.keyframesName = a.selector.split(z).pop()) : a.type = 0 === c.indexOf("--") ? C : D);
        if (c = a.rules)
            for (var e = 0, d = c.length, f = void 0; e < d && (f = c[e]); e++) y(f, b);
        return a
    }

    function da(a) { return a.replace(/\\([0-9a-f]{1,6})\s/gi, function(a, c) { a = c; for (c = 6 - a.length; c--;) a = "0" + a; return "\\" + a }) }

    function E(a, b, c) { c = void 0 === c ? "" : c; var e = ""; if (a.cssText || a.rules) { var d = a.rules,
                f; if (f = d) f = d[0], f = !(f && f.selector && 0 === f.selector.indexOf("--")); if (f) { f = 0; for (var g = d.length, h = void 0; f < g && (h = d[f]); f++) e = E(h, b, e) } else b ? b = a.cssText : (b = a.cssText, b = b.replace(fa, "").replace(ha, ""), b = b.replace(ia, "").replace(ja, "")), (e = b.trim()) && (e = "  " + e + "\n") }
        e && (a.selector && (c += a.selector + " {\n"), c += e, a.selector && (c += "}\n\n")); return c }
    var D = 1,
        B = 7,
        A = 4,
        C = 1E3,
        ba = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
        ca = /@import[^;]*;/gim,
        fa = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        ha = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        ia = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
        ja = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        ea = /^@[^\s]*keyframes/,
        z = /\s+/g;
    var G = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
        H = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
        ka = /@media\s(.*)/;
    var I = new Set;

    function J(a) { if (!a) return ""; "string" === typeof a && (a = x(a)); return E(a, u) }

    function K(a) {!a.__cssRules && a.textContent && (a.__cssRules = x(a.textContent)); return a.__cssRules || null }

    function L(a, b, c, e) { if (a) { var d = !1,
                f = a.type; if (e && f === A) { var g = a.selector.match(ka);
                g && (window.matchMedia(g[1]).matches || (d = !0)) }
            f === D ? b(a) : c && f === B ? c(a) : f === C && (d = !0); if ((a = a.rules) && !d)
                for (d = 0, f = a.length, g = void 0; d < f && (g = a[d]); d++) L(g, b, c, e) } }

    function M(a, b) { var c = a.indexOf("var("); if (-1 === c) return b(a, "", "", "");
        a: { var e = 0; var d = c + 3; for (var f = a.length; d < f; d++)
                if ("(" === a[d]) e++;
                else if (")" === a[d] && 0 === --e) break a;d = -1 }
        e = a.substring(c + 4, d);
        c = a.substring(0, c);
        a = M(a.substring(d + 1), b);
        d = e.indexOf(","); return -1 === d ? b(c, e.trim(), "", a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a) }

    function N(a) { if (void 0 !== v) return v; if (void 0 === a.__cssBuild) { var b = a.getAttribute("css-build"); if (b) a.__cssBuild = b;
            else { a: { b = "template" === a.localName ? a.content.firstChild : a.firstChild; if (b instanceof Comment && (b = b.textContent.trim().split(":"), "css-build" === b[0])) { b = b[1]; break a }
                    b = "" } if ("" !== b) { var c = "template" === a.localName ? a.content.firstChild : a.firstChild;
                    c.parentNode.removeChild(c) }
                a.__cssBuild = b } } return a.__cssBuild || "" };
    var la = /;\s*/m,
        ma = /^\s*(initial)|(inherit)\s*$/,
        O = /\s*!important/;

    function P() { this.a = {} }
    P.prototype.set = function(a, b) { a = a.trim();
        this.a[a] = { h: b, i: {} } };
    P.prototype.get = function(a) { a = a.trim(); return this.a[a] || null };
    var Q = null;

    function R() { this.b = this.c = null;
        this.a = new P }
    R.prototype.o = function(a) { a = H.test(a) || G.test(a);
        H.lastIndex = 0;
        G.lastIndex = 0; return a };
    R.prototype.m = function(a, b) {
        if (void 0 === a._gatheredStyle) {
            var c = [];
            for (var e = a.content.querySelectorAll("style"), d = 0; d < e.length; d++) { var f = e[d]; if (f.hasAttribute("shady-unscoped")) { if (!l) { var g = f.textContent;
                        I.has(g) || (I.add(g), g = f.cloneNode(!0), document.head.appendChild(g));
                        f.parentNode.removeChild(f) } } else c.push(f.textContent), f.parentNode.removeChild(f) }(c = c.join("").trim()) ? (e = document.createElement("style"), e.textContent = c, a.content.insertBefore(e, a.content.firstChild), c = e) : c = null;
            a._gatheredStyle =
                c
        }
        return (a = a._gatheredStyle) ? this.j(a, b) : null
    };
    R.prototype.j = function(a, b) { b = void 0 === b ? "" : b; var c = K(a);
        this.l(c, b);
        a.textContent = J(c); return c };
    R.prototype.f = function(a) { var b = this,
            c = K(a);
        L(c, function(a) { ":root" === a.selector && (a.selector = "html");
            b.g(a) });
        a.textContent = J(c); return c };
    R.prototype.l = function(a, b) { var c = this;
        this.c = b;
        L(a, function(a) { c.g(a) });
        this.c = null };
    R.prototype.g = function(a) { a.cssText = na(this, a.parsedCssText, a); ":root" === a.selector && (a.selector = ":host > *") };

    function na(a, b, c) { b = b.replace(G, function(b, d, f, g) { return oa(a, b, d, f, g, c) }); return S(a, b, c) }

    function pa(a, b) { for (var c = b; c.parent;) c = c.parent; var e = {},
            d = !1;
        L(c, function(c) {
            (d = d || c === b) || c.selector === b.selector && Object.assign(e, T(a, c.parsedCssText)) }); return e }

    function S(a, b, c) { for (var e; e = H.exec(b);) { var d = e[0],
                f = e[1];
            e = e.index; var g = b.slice(0, e + d.indexOf("@apply"));
            b = b.slice(e + d.length); var h = c ? pa(a, c) : {};
            Object.assign(h, T(a, g));
            d = void 0; var k = a;
            f = f.replace(la, ""); var n = []; var m = k.a.get(f);
            m || (k.a.set(f, {}), m = k.a.get(f)); if (m) { k.c && (m.i[k.c] = !0); var q = m.h; for (d in q) k = h && h[d], m = [d, ": var(", f, "_-_", d], k && m.push(",", k.replace(O, "")), m.push(")"), O.test(q[d]) && m.push(" !important"), n.push(m.join("")) }
            d = n.join("; ");
            b = g + d + b;
            H.lastIndex = e + d.length } return b }

    function T(a, b, c) { c = void 0 === c ? !1 : c;
        b = b.split(";"); for (var e, d, f = {}, g = 0, h; g < b.length; g++)
            if (e = b[g])
                if (h = e.split(":"), 1 < h.length) { e = h[0].trim();
                    d = h.slice(1).join(":"); if (c) { var k = a;
                        h = e; var n = ma.exec(d);
                        n && (n[1] ? (k.b || (k.b = document.createElement("meta"), k.b.setAttribute("apply-shim-measure", ""), k.b.style.all = "initial", document.head.appendChild(k.b)), h = window.getComputedStyle(k.b).getPropertyValue(h)) : h = "apply-shim-inherit", d = h) }
                    f[e] = d }
        return f }

    function qa(a, b) { if (Q)
            for (var c in b.i) c !== a.c && Q(c) }

    function oa(a, b, c, e, d, f) { e && M(e, function(b, c) { c && a.a.get(c) && (d = "@apply " + c + ";") }); if (!d) return b; var g = S(a, "" + d, f);
        f = b.slice(0, b.indexOf("--")); var h = g = T(a, g, !0),
            k = a.a.get(c),
            n = k && k.h;
        n ? h = Object.assign(Object.create(n), g) : a.a.set(c, h); var m = [],
            q, Z = !1; for (q in h) { var F = g[q];
            void 0 === F && (F = "initial");!n || q in n || (Z = !0);
            m.push(c + "_-_" + q + ": " + F) }
        Z && qa(a, k);
        k && (k.h = h);
        e && (f = b + ";" + f); return f + m.join("; ") + ";" }
    R.prototype.detectMixin = R.prototype.o;
    R.prototype.transformStyle = R.prototype.j;
    R.prototype.transformCustomStyle = R.prototype.f;
    R.prototype.transformRules = R.prototype.l;
    R.prototype.transformRule = R.prototype.g;
    R.prototype.transformTemplate = R.prototype.m;
    R.prototype._separator = "_-_";
    Object.defineProperty(R.prototype, "invalidCallback", { get: function() { return Q }, set: function(a) { Q = a } });
    var U = {};
    var ra = Promise.resolve();

    function sa(a) { if (a = U[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1 }

    function ta(a) { return a._applyShimCurrentVersion === a._applyShimNextVersion }

    function ua(a) { a._applyShimValidatingVersion = a._applyShimNextVersion;
        a._validating || (a._validating = !0, ra.then(function() { a._applyShimCurrentVersion = a._applyShimNextVersion;
            a._validating = !1 })) };
    var V = new R;

    function W() { this.a = null;
        V.invalidCallback = sa }

    function X(a) {!a.a && window.ShadyCSS.CustomStyleInterface && (a.a = window.ShadyCSS.CustomStyleInterface, a.a.transformCallback = function(a) { V.f(a) }, a.a.validateCallback = function() { requestAnimationFrame(function() { a.a.enqueued && a.flushCustomStyles() }) }) }
    W.prototype.prepareTemplate = function(a, b) { X(this); "" === N(a) && (U[b] = a, b = V.m(a, b), a._styleAst = b) };
    W.prototype.flushCustomStyles = function() { X(this); if (this.a) { var a = this.a.processStyles(); if (this.a.enqueued) { for (var b = 0; b < a.length; b++) { var c = this.a.getStyleForCustomStyle(a[b]);
                    c && V.f(c) }
                this.a.enqueued = !1 } } };
    W.prototype.styleSubtree = function(a, b) { X(this); if (b)
            for (var c in b) null === c ? a.style.removeProperty(c) : a.style.setProperty(c, b[c]); if (a.shadowRoot)
            for (this.styleElement(a), a = a.shadowRoot.children || a.shadowRoot.childNodes, b = 0; b < a.length; b++) this.styleSubtree(a[b]);
        else
            for (a = a.children || a.childNodes, b = 0; b < a.length; b++) this.styleSubtree(a[b]) };
    W.prototype.styleElement = function(a) { X(this); var b = a.localName,
            c;
        b ? -1 < b.indexOf("-") ? c = b : c = a.getAttribute && a.getAttribute("is") || "" : c = a.is;
        b = U[c]; if (!(b && "" !== N(b) || !b || ta(b))) { if (ta(b) || b._applyShimValidatingVersion !== b._applyShimNextVersion) this.prepareTemplate(b, c), ua(b); if (a = a.shadowRoot)
                if (a = a.querySelector("style")) a.__cssRules = b._styleAst, a.textContent = J(b._styleAst) } };
    W.prototype.styleDocument = function(a) { X(this);
        this.styleSubtree(document.body, a) };
    if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
        var Y = new W,
            va = window.ShadyCSS && window.ShadyCSS.CustomStyleInterface;
        window.ShadyCSS = {
            prepareTemplate: function(a, b) { Y.flushCustomStyles();
                Y.prepareTemplate(a, b) },
            prepareTemplateStyles: function(a, b, c) { window.ShadyCSS.prepareTemplate(a, b, c) },
            prepareTemplateDom: function() {},
            styleSubtree: function(a, b) { Y.flushCustomStyles();
                Y.styleSubtree(a, b) },
            styleElement: function(a) { Y.flushCustomStyles();
                Y.styleElement(a) },
            styleDocument: function(a) {
                Y.flushCustomStyles();
                Y.styleDocument(a)
            },
            getComputedStyleValue: function(a, b) { return (a = window.getComputedStyle(a).getPropertyValue(b)) ? a.trim() : "" },
            flushCustomStyles: function() { Y.flushCustomStyles() },
            nativeCss: u,
            nativeShadow: l,
            cssBuild: v,
            disableRuntime: aa
        };
        va && (window.ShadyCSS.CustomStyleInterface = va)
    }
    window.ShadyCSS.ApplyShim = V;
}).call(this);

//# sourceMappingURL=apply-shim.min.js.map