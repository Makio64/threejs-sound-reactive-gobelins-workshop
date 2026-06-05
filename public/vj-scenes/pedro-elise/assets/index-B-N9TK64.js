(function () {
    let e = document.createElement(`link`).relList;
    if (e && e.supports && e.supports(`modulepreload`)) return;
    for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
    new MutationObserver((e) => {
        for (let t of e)
            if (t.type === `childList`)
                for (let e of t.addedNodes)
                    e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
    }).observe(document, { childList: !0, subtree: !0 });
    function t(e) {
        let t = {};
        return (
            e.integrity && (t.integrity = e.integrity),
            e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
            e.crossOrigin === `use-credentials`
                ? (t.credentials = `include`)
                : e.crossOrigin === `anonymous`
                  ? (t.credentials = `omit`)
                  : (t.credentials = `same-origin`),
            t
        );
    }
    function n(e) {
        if (e.ep) return;
        e.ep = !0;
        let n = t(e);
        fetch(e.href, n);
    }
})();
var e = {
    tame: {
        startBin: 1,
        endBin: 8,
        beatHold: 0.28,
        beatDecay: 0.98,
        beatMin: 0.15,
        beatMult: 1.15,
        beat2Hold: 0.35,
        beat2Decay: 0.993,
        beat2Min: 0.26,
        beat2Mult: 1.32,
        volumeMult: 1.25,
    },
    stones: {
        startBin: 2,
        endBin: 9,
        beatHold: 0.18,
        beatDecay: 0.968,
        beatMin: 0.12,
        beatMult: 1.12,
        beat2Hold: 0.22,
        beat2Decay: 0.988,
        beat2Min: 0.22,
        beat2Mult: 1.28,
        volumeMult: 1.15,
    },
    digeridoo: {
        startBin: 4,
        endBin: 10,
        beatHold: 0.26,
        beatDecay: 0.975,
        beatMin: 0.18,
        beatMult: 1.18,
        beat2Hold: 0.32,
        beat2Decay: 0.994,
        beat2Min: 0.3,
        beat2Mult: 1.35,
        volumeMult: 1.3,
    },
    default: {
        startBin: 1,
        endBin: 8,
        beatHold: 0.3,
        beatDecay: 0.982,
        beatMin: 0.15,
        beatMult: 1.15,
        beat2Hold: 0.4,
        beat2Decay: 0.994,
        beat2Min: 0.28,
        beat2Mult: 1.35,
        volumeMult: 1,
    },
};
function t(t) {
    return e[t] ?? e.default;
}
function n(e) {
    let t = decodeURIComponent(e);
    return /01-Tame/i.test(t)
        ? `tame`
        : /02-The/i.test(t)
          ? `stones`
          : /03-Digeridoo/i.test(t)
            ? `digeridoo`
            : ``;
}
var r = `modulepreload`,
    i = function (e) {
        return `/` + e;
    },
    a = {},
    o = function (e, t, n) {
        let o = Promise.resolve();
        if (t && t.length > 0) {
            let e = document.getElementsByTagName(`link`),
                s = document.querySelector(`meta[property=csp-nonce]`),
                c = s?.nonce || s?.getAttribute(`nonce`);
            function l(e) {
                return Promise.all(
                    e.map((e) =>
                        Promise.resolve(e).then(
                            (e) => ({ status: `fulfilled`, value: e }),
                            (e) => ({ status: `rejected`, reason: e }),
                        ),
                    ),
                );
            }
            o = l(
                t.map((t) => {
                    if (((t = i(t, n)), t in a)) return;
                    a[t] = !0;
                    let o = t.endsWith(`.css`),
                        s = o ? `[rel="stylesheet"]` : ``;
                    if (n)
                        for (let n = e.length - 1; n >= 0; n--) {
                            let r = e[n];
                            if (r.href === t && (!o || r.rel === `stylesheet`))
                                return;
                        }
                    else if (document.querySelector(`link[href="${t}"]${s}`))
                        return;
                    let l = document.createElement(`link`);
                    if (
                        ((l.rel = o ? `stylesheet` : r),
                        o || (l.as = `script`),
                        (l.crossOrigin = ``),
                        (l.href = t),
                        c && l.setAttribute(`nonce`, c),
                        document.head.appendChild(l),
                        o)
                    )
                        return new Promise((e, n) => {
                            (l.addEventListener(`load`, e),
                                l.addEventListener(`error`, () =>
                                    n(Error(`Unable to preload CSS for ${t}`)),
                                ));
                        });
                }),
            );
        }
        function s(e) {
            let t = new Event(`vite:preloadError`, { cancelable: !0 });
            if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
                throw e;
        }
        return o.then((t) => {
            for (let e of t || []) e.status === `rejected` && s(e.reason);
            return e().catch(s);
        });
    },
    s = class {
        constructor({
            mode: e = `auto`,
            fftSize: t = 512,
            autoTick: n = !0,
        } = {}) {
            let r = window.self !== window.top;
            ((this.mode = e === `auto` ? (r ? `receive` : `live`) : e),
                (this.fftSize = t),
                (this.autoTick = n),
                (this.binCount = t / 2),
                (this.volume = 0),
                (this.volumeSmooth = 0),
                (this.volumeByFrequency = new Float32Array(this.binCount)),
                (this.kick = 0),
                (this.kickEnergy = 0),
                (this.kickThreshold = 0.15),
                (this.kickTimer = 0),
                (this.kickHard = 0),
                (this.kickHardEnergy = 0),
                (this.kickHardThreshold = 0.3),
                (this.kickHardTimer = 0),
                (this.onCallbacks = {
                    load: [],
                    warmup: [],
                    play: [],
                    stop: [],
                    audio: [],
                }),
                (this.queue = Promise.resolve()),
                (this.agc = 0.2),
                (this.activeTrackId = ``),
                this.mode === `receive` ? this.initReceive() : this.initLive());
        }
        onLoad = (e) => (this.onCallbacks.load.push(e), e);
        onWarmup = (e) => (this.onCallbacks.warmup.push(e), e);
        onPlay = (e) => (this.onCallbacks.play.push(e), e);
        onStop = (e) => (this.onCallbacks.stop.push(e), e);
        onAudio = (e) => (this.onCallbacks.audio.push(e), e);
        fire = (e) => {
            this.queue = this.queue
                .then(() => Promise.all(this.onCallbacks[e].map((e) => e())))
                .catch((t) => console.error(`[analyzer] ` + e, t));
        };
        emitAudio = () => {
            for (let e = 0; e < this.onCallbacks.audio.length; e++)
                this.onCallbacks.audio[e](this);
        };
        onMessage = (e) => {
            let t = e.data;
            t?.type === `vj` &&
                (t.kind === `audio`
                    ? ((this.volume = t.volume),
                      (this.volumeSmooth = t.volumeSmooth),
                      (this.kick = t.kick),
                      (this.kickEnergy = t.kickEnergy ?? 0),
                      (this.kickThreshold = t.kickThreshold ?? 0),
                      (this.kickHard = t.kickHard ?? 0),
                      (this.kickHardEnergy = t.kickHardEnergy ?? 0),
                      (this.kickHardThreshold = t.kickHardThreshold ?? 0),
                      t.volumeByFrequency &&
                          this.volumeByFrequency.set(t.volumeByFrequency),
                      this.emitAudio())
                    : this.onCallbacks[t.kind] && this.fire(t.kind));
        };
        initReceive = () => {
            window.addEventListener(`message`, this.onMessage);
        };
        gesture = () => this.start();
        onKey = (e) => {
            (document.activeElement &&
                (document.activeElement.tagName === `INPUT` ||
                    document.activeElement.tagName === `TEXTAREA`)) ||
                (e.key === `d` && this.toggleDebug());
        };
        initLive = () => {
            if (
                ((this.ctx = new (
                    window.AudioContext || window.webkitAudioContext
                )()),
                (this.analyser = this.ctx.createAnalyser()),
                (this.analyser.fftSize = this.fftSize),
                (this.binCount = this.analyser.frequencyBinCount),
                (this.volumeByFrequency = new Float32Array(this.binCount)),
                (this.freqBytes = new Uint8Array(this.binCount)),
                (this.waveBytes = new Uint8Array(this.binCount)),
                (this.mediaNode = null),
                (this.mediaEl = null),
                (this.micNode = null),
                (this.payload = {
                    type: `vj`,
                    kind: `audio`,
                    volume: 0,
                    volumeSmooth: 0,
                    kick: 0,
                    kickEnergy: 0,
                    kickThreshold: 0,
                    kickHard: 0,
                    kickHardEnergy: 0,
                    kickHardThreshold: 0,
                    volumeByFrequency: this.volumeByFrequency,
                }),
                this.autoTick)
            ) {
                for (let e of [`pointerdown`, `keydown`, `touchstart`])
                    window.addEventListener(e, this.gesture);
                (this.fire(`load`),
                    this.fire(`warmup`),
                    window.addEventListener(`keydown`, this.onKey),
                    this.toggleDebug(),
                    this.start(),
                    (this.last = 0),
                    (this.raf = requestAnimationFrame(this.tick)));
            }
        };
        start = async () => {
            if (!this.started) {
                if (this.ctx.state !== `running`)
                    try {
                        await this.ctx.resume();
                    } catch {}
                if (this.ctx.state === `running`) {
                    this.started = !0;
                    for (let e of [`pointerdown`, `keydown`, `touchstart`])
                        window.removeEventListener(e, this.gesture);
                    if (this.autoTick && !this.player)
                        try {
                            let { default: e } = await o(async () => {
                                let { default: e } = await import(
                                    `./SoundPlayer-qPQLjO91.js`
                                );
                                return { default: e };
                            }, []);
                            this.player = new e(this);
                        } catch (e) {
                            console.error(
                                `[analyzer] failed to load SoundPlayer`,
                                e,
                            );
                        }
                    this.fire(`play`);
                }
            }
        };
        connectMediaElement = (e) => {
            (this.mediaEl !== e &&
                ((this.mediaNode = this.ctx.createMediaElementSource(e)),
                (this.mediaEl = e)),
                this.disconnectSources(),
                this.mediaNode.connect(this.analyser),
                this.mediaNode.connect(this.ctx.destination));
        };
        connectMic = (e) => {
            ((this.micNode ||= this.ctx.createMediaStreamSource(e)),
                this.disconnectSources(),
                this.micNode.connect(this.analyser));
        };
        disconnectSources = () => {
            try {
                this.mediaNode?.disconnect();
            } catch {}
            try {
                this.micNode?.disconnect();
            } catch {}
        };
        setTrackId = (e) => {
            this.activeTrackId = e ?? ``;
        };
        toggleDebug = async () => {
            if (this.debugOverlay) this.debugOverlay.toggle();
            else
                try {
                    let { default: e } = await o(async () => {
                        let { default: e } = await import(
                            `./AnalyzerDebug-BsNYi7-t.js`
                        );
                        return { default: e };
                    }, []);
                    this.debugOverlay = new e(this);
                } catch (e) {
                    console.error(`Failed to load AnalyzerDebug`, e);
                }
        };
        tick = (e = 0) => {
            if (this.disposed) return;
            let t = this.last ? Math.min(0.05, (e - this.last) / 1e3) : 0;
            ((this.last = e),
                this.started && this.update(t),
                (this.raf = requestAnimationFrame(this.tick)));
        };
        update = (e) => {
            if (this.mode !== `live` || !this.analyser) return;
            let n = this.binCount;
            (this.analyser.getByteFrequencyData(this.freqBytes),
                this.analyser.getByteTimeDomainData(this.waveBytes));
            for (let e = 0; e < n; e++)
                this.volumeByFrequency[e] = this.freqBytes[e] / 255;
            let r = 0;
            for (let e = 0; e < n; e++) {
                let t = (this.waveBytes[e] - 128) / 128;
                r += t * t;
            }
            let i = Math.sqrt(r / n);
            this.agc = Math.max(i, this.agc * 0.999);
            let a = t(this.activeTrackId);
            this.volume = Math.min(
                (i / Math.max(this.agc, 0.05)) * a.volumeMult,
                1,
            );
            let o = this.volume > this.volumeSmooth ? 0.5 : 0.08;
            this.volumeSmooth +=
                (this.volume - this.volumeSmooth) * (1 - (1 - o) ** (e * 120));
            let s = 0;
            for (let e = a.startBin; e < a.endBin; e++) s += this.freqBytes[e];
            ((s /= (a.endBin - a.startBin) * 255),
                (this.kickTimer += e),
                this.kickTimer >= a.beatHold &&
                s > this.kickThreshold &&
                s > a.beatMin
                    ? ((this.kick = 1),
                      (this.kickThreshold = s * a.beatMult),
                      (this.kickTimer = 0))
                    : this.kickTimer > a.beatHold &&
                      ((this.kickThreshold *= a.beatDecay ** (e * 60)),
                      (this.kickThreshold = Math.max(
                          this.kickThreshold,
                          a.beatMin,
                      ))),
                (this.kick = Math.max(0, this.kick - e * 6)),
                (this.kickEnergy = s),
                (this.kickHardTimer += e),
                this.kickHardTimer >= a.beat2Hold &&
                s > this.kickHardThreshold &&
                s > a.beat2Min
                    ? ((this.kickHard = 1),
                      (this.kickHardThreshold = s * a.beat2Mult),
                      (this.kickHardTimer = 0))
                    : this.kickHardTimer > a.beat2Hold &&
                      ((this.kickHardThreshold *= a.beat2Decay ** (e * 60)),
                      (this.kickHardThreshold = Math.max(
                          this.kickHardThreshold,
                          a.beat2Min,
                      ))),
                (this.kickHard = Math.max(0, this.kickHard - e * 2.5)),
                (this.kickHardEnergy = s));
            let c = this.payload;
            ((c.volume = this.volume),
                (c.volumeSmooth = this.volumeSmooth),
                (c.kick = this.kick),
                (c.kickEnergy = this.kickEnergy),
                (c.kickThreshold = this.kickThreshold),
                (c.kickHard = this.kickHard),
                (c.kickHardEnergy = this.kickHardEnergy),
                (c.kickHardThreshold = this.kickHardThreshold),
                this.emitAudio());
        };
        dispose = () => {
            if (
                ((this.disposed = !0),
                this.raf && cancelAnimationFrame(this.raf),
                this.onMessage &&
                    window.removeEventListener(`message`, this.onMessage),
                this.onKey && window.removeEventListener(`keydown`, this.onKey),
                this.gesture)
            )
                for (let e of [`pointerdown`, `keydown`, `touchstart`])
                    window.removeEventListener(e, this.gesture);
            if ((this.player?.dispose(), this.disconnectSources(), this.ctx))
                try {
                    this.ctx.close();
                } catch {}
        };
    },
    c = 1e3,
    l = 1001,
    u = 1002,
    d = 1003,
    f = 1004,
    p = 1005,
    m = 1006,
    h = 1007,
    g = 1008,
    _ = 1009,
    v = 1010,
    y = 1011,
    b = 1012,
    x = 1013,
    S = 1014,
    C = 1015,
    w = 1016,
    T = 1017,
    E = 1018,
    D = 1020,
    O = 35902,
    k = 35899,
    A = 1021,
    j = 1022,
    M = 1023,
    N = 1026,
    ee = 1027,
    P = 1028,
    F = 1029,
    te = 1030,
    ne = 1031,
    re = 1033,
    ie = 33776,
    I = 33777,
    ae = 33778,
    oe = 33779,
    L = 35840,
    se = 35841,
    ce = 35842,
    le = 35843,
    ue = 36196,
    de = 37492,
    fe = 37496,
    R = 37488,
    pe = 37489,
    me = 37490,
    he = 37491,
    ge = 37808,
    _e = 37809,
    ve = 37810,
    ye = 37811,
    be = 37812,
    xe = 37813,
    Se = 37814,
    Ce = 37815,
    we = 37816,
    Te = 37817,
    Ee = 37818,
    z = 37819,
    De = 37820,
    B = 37821,
    Oe = 36492,
    V = 36494,
    ke = 36495,
    H = 36283,
    U = 36284,
    Ae = 36285,
    je = 36286,
    Me = 2300,
    Ne = 2301,
    Pe = 2302,
    Fe = 2303,
    Ie = 2400,
    Le = 2401,
    Re = 2402,
    ze = 3200,
    Be = `srgb`,
    Ve = `srgb-linear`,
    He = `linear`,
    Ue = `srgb`,
    We = 7680,
    Ge = 35044,
    Ke = 35048,
    qe = 2e3;
function Je(e) {
    for (let t = e.length - 1; t >= 0; --t) if (e[t] >= 65535) return !0;
    return !1;
}
function Ye(e) {
    return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Xe(e) {
    return document.createElementNS(`http://www.w3.org/1999/xhtml`, e);
}
function Ze() {
    let e = Xe(`canvas`);
    return ((e.style.display = `block`), e);
}
var Qe = {},
    $e = null;
function et(...e) {
    let t = `THREE.` + e.shift();
    $e ? $e(`log`, t, ...e) : console.log(t, ...e);
}
function tt(e) {
    let t = e[0];
    if (typeof t == `string` && t.startsWith(`TSL:`)) {
        let t = e[1];
        t && t.isStackTrace
            ? (e[0] += ` ` + t.getLocation())
            : (e[1] = `Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`);
    }
    return e;
}
function W(...e) {
    e = tt(e);
    let t = `THREE.` + e.shift();
    if ($e) $e(`warn`, t, ...e);
    else {
        let n = e[0];
        n && n.isStackTrace
            ? console.warn(n.getError(t))
            : console.warn(t, ...e);
    }
}
function G(...e) {
    e = tt(e);
    let t = `THREE.` + e.shift();
    if ($e) $e(`error`, t, ...e);
    else {
        let n = e[0];
        n && n.isStackTrace
            ? console.error(n.getError(t))
            : console.error(t, ...e);
    }
}
function nt(...e) {
    let t = e.join(` `);
    t in Qe || ((Qe[t] = !0), W(...e));
}
function rt(e, t, n) {
    return new Promise(function (r, i) {
        function a() {
            switch (e.clientWaitSync(t, e.SYNC_FLUSH_COMMANDS_BIT, 0)) {
                case e.WAIT_FAILED:
                    i();
                    break;
                case e.TIMEOUT_EXPIRED:
                    setTimeout(a, n);
                    break;
                default:
                    r();
            }
        }
        setTimeout(a, n);
    });
}
var it = { 0: 1, 2: 6, 4: 7, 3: 5, 1: 0, 6: 2, 7: 4, 5: 3 },
    at = class {
        addEventListener(e, t) {
            this._listeners === void 0 && (this._listeners = {});
            let n = this._listeners;
            (n[e] === void 0 && (n[e] = []),
                n[e].indexOf(t) === -1 && n[e].push(t));
        }
        hasEventListener(e, t) {
            let n = this._listeners;
            return n === void 0
                ? !1
                : n[e] !== void 0 && n[e].indexOf(t) !== -1;
        }
        removeEventListener(e, t) {
            let n = this._listeners;
            if (n === void 0) return;
            let r = n[e];
            if (r !== void 0) {
                let e = r.indexOf(t);
                e !== -1 && r.splice(e, 1);
            }
        }
        dispatchEvent(e) {
            let t = this._listeners;
            if (t === void 0) return;
            let n = t[e.type];
            if (n !== void 0) {
                e.target = this;
                let t = n.slice(0);
                for (let n = 0, r = t.length; n < r; n++) t[n].call(this, e);
                e.target = null;
            }
        }
    },
    ot =
        `00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(
            `.`,
        ),
    st = Math.PI / 180,
    ct = 180 / Math.PI;
function lt() {
    let e = (Math.random() * 4294967295) | 0,
        t = (Math.random() * 4294967295) | 0,
        n = (Math.random() * 4294967295) | 0,
        r = (Math.random() * 4294967295) | 0;
    return (
        ot[e & 255] +
        ot[(e >> 8) & 255] +
        ot[(e >> 16) & 255] +
        ot[(e >> 24) & 255] +
        `-` +
        ot[t & 255] +
        ot[(t >> 8) & 255] +
        `-` +
        ot[((t >> 16) & 15) | 64] +
        ot[(t >> 24) & 255] +
        `-` +
        ot[(n & 63) | 128] +
        ot[(n >> 8) & 255] +
        `-` +
        ot[(n >> 16) & 255] +
        ot[(n >> 24) & 255] +
        ot[r & 255] +
        ot[(r >> 8) & 255] +
        ot[(r >> 16) & 255] +
        ot[(r >> 24) & 255]
    ).toLowerCase();
}
function K(e, t, n) {
    return Math.max(t, Math.min(n, e));
}
function ut(e, t) {
    return ((e % t) + t) % t;
}
function dt(e, t, n) {
    return (1 - n) * e + n * t;
}
function ft(e, t) {
    switch (t.constructor) {
        case Float32Array:
            return e;
        case Uint32Array:
            return e / 4294967295;
        case Uint16Array:
            return e / 65535;
        case Uint8Array:
            return e / 255;
        case Int32Array:
            return Math.max(e / 2147483647, -1);
        case Int16Array:
            return Math.max(e / 32767, -1);
        case Int8Array:
            return Math.max(e / 127, -1);
        default:
            throw Error(`Invalid component type.`);
    }
}
function pt(e, t) {
    switch (t.constructor) {
        case Float32Array:
            return e;
        case Uint32Array:
            return Math.round(e * 4294967295);
        case Uint16Array:
            return Math.round(e * 65535);
        case Uint8Array:
            return Math.round(e * 255);
        case Int32Array:
            return Math.round(e * 2147483647);
        case Int16Array:
            return Math.round(e * 32767);
        case Int8Array:
            return Math.round(e * 127);
        default:
            throw Error(`Invalid component type.`);
    }
}
var q = class e {
        static {
            e.prototype.isVector2 = !0;
        }
        constructor(e = 0, t = 0) {
            ((this.x = e), (this.y = t));
        }
        get width() {
            return this.x;
        }
        set width(e) {
            this.x = e;
        }
        get height() {
            return this.y;
        }
        set height(e) {
            this.y = e;
        }
        set(e, t) {
            return ((this.x = e), (this.y = t), this);
        }
        setScalar(e) {
            return ((this.x = e), (this.y = e), this);
        }
        setX(e) {
            return ((this.x = e), this);
        }
        setY(e) {
            return ((this.y = e), this);
        }
        setComponent(e, t) {
            switch (e) {
                case 0:
                    this.x = t;
                    break;
                case 1:
                    this.y = t;
                    break;
                default:
                    throw Error(`index is out of range: ` + e);
            }
            return this;
        }
        getComponent(e) {
            switch (e) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw Error(`index is out of range: ` + e);
            }
        }
        clone() {
            return new this.constructor(this.x, this.y);
        }
        copy(e) {
            return ((this.x = e.x), (this.y = e.y), this);
        }
        add(e) {
            return ((this.x += e.x), (this.y += e.y), this);
        }
        addScalar(e) {
            return ((this.x += e), (this.y += e), this);
        }
        addVectors(e, t) {
            return ((this.x = e.x + t.x), (this.y = e.y + t.y), this);
        }
        addScaledVector(e, t) {
            return ((this.x += e.x * t), (this.y += e.y * t), this);
        }
        sub(e) {
            return ((this.x -= e.x), (this.y -= e.y), this);
        }
        subScalar(e) {
            return ((this.x -= e), (this.y -= e), this);
        }
        subVectors(e, t) {
            return ((this.x = e.x - t.x), (this.y = e.y - t.y), this);
        }
        multiply(e) {
            return ((this.x *= e.x), (this.y *= e.y), this);
        }
        multiplyScalar(e) {
            return ((this.x *= e), (this.y *= e), this);
        }
        divide(e) {
            return ((this.x /= e.x), (this.y /= e.y), this);
        }
        divideScalar(e) {
            return this.multiplyScalar(1 / e);
        }
        applyMatrix3(e) {
            let t = this.x,
                n = this.y,
                r = e.elements;
            return (
                (this.x = r[0] * t + r[3] * n + r[6]),
                (this.y = r[1] * t + r[4] * n + r[7]),
                this
            );
        }
        min(e) {
            return (
                (this.x = Math.min(this.x, e.x)),
                (this.y = Math.min(this.y, e.y)),
                this
            );
        }
        max(e) {
            return (
                (this.x = Math.max(this.x, e.x)),
                (this.y = Math.max(this.y, e.y)),
                this
            );
        }
        clamp(e, t) {
            return (
                (this.x = K(this.x, e.x, t.x)),
                (this.y = K(this.y, e.y, t.y)),
                this
            );
        }
        clampScalar(e, t) {
            return (
                (this.x = K(this.x, e, t)),
                (this.y = K(this.y, e, t)),
                this
            );
        }
        clampLength(e, t) {
            let n = this.length();
            return this.divideScalar(n || 1).multiplyScalar(K(n, e, t));
        }
        floor() {
            return (
                (this.x = Math.floor(this.x)),
                (this.y = Math.floor(this.y)),
                this
            );
        }
        ceil() {
            return (
                (this.x = Math.ceil(this.x)),
                (this.y = Math.ceil(this.y)),
                this
            );
        }
        round() {
            return (
                (this.x = Math.round(this.x)),
                (this.y = Math.round(this.y)),
                this
            );
        }
        roundToZero() {
            return (
                (this.x = Math.trunc(this.x)),
                (this.y = Math.trunc(this.y)),
                this
            );
        }
        negate() {
            return ((this.x = -this.x), (this.y = -this.y), this);
        }
        dot(e) {
            return this.x * e.x + this.y * e.y;
        }
        cross(e) {
            return this.x * e.y - this.y * e.x;
        }
        lengthSq() {
            return this.x * this.x + this.y * this.y;
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        manhattanLength() {
            return Math.abs(this.x) + Math.abs(this.y);
        }
        normalize() {
            return this.divideScalar(this.length() || 1);
        }
        angle() {
            return Math.atan2(-this.y, -this.x) + Math.PI;
        }
        angleTo(e) {
            let t = Math.sqrt(this.lengthSq() * e.lengthSq());
            if (t === 0) return Math.PI / 2;
            let n = this.dot(e) / t;
            return Math.acos(K(n, -1, 1));
        }
        distanceTo(e) {
            return Math.sqrt(this.distanceToSquared(e));
        }
        distanceToSquared(e) {
            let t = this.x - e.x,
                n = this.y - e.y;
            return t * t + n * n;
        }
        manhattanDistanceTo(e) {
            return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
        }
        setLength(e) {
            return this.normalize().multiplyScalar(e);
        }
        lerp(e, t) {
            return (
                (this.x += (e.x - this.x) * t),
                (this.y += (e.y - this.y) * t),
                this
            );
        }
        lerpVectors(e, t, n) {
            return (
                (this.x = e.x + (t.x - e.x) * n),
                (this.y = e.y + (t.y - e.y) * n),
                this
            );
        }
        equals(e) {
            return e.x === this.x && e.y === this.y;
        }
        fromArray(e, t = 0) {
            return ((this.x = e[t]), (this.y = e[t + 1]), this);
        }
        toArray(e = [], t = 0) {
            return ((e[t] = this.x), (e[t + 1] = this.y), e);
        }
        fromBufferAttribute(e, t) {
            return ((this.x = e.getX(t)), (this.y = e.getY(t)), this);
        }
        rotateAround(e, t) {
            let n = Math.cos(t),
                r = Math.sin(t),
                i = this.x - e.x,
                a = this.y - e.y;
            return (
                (this.x = i * n - a * r + e.x),
                (this.y = i * r + a * n + e.y),
                this
            );
        }
        random() {
            return ((this.x = Math.random()), (this.y = Math.random()), this);
        }
        *[Symbol.iterator]() {
            (yield this.x, yield this.y);
        }
    },
    mt = class {
        constructor(e = 0, t = 0, n = 0, r = 1) {
            ((this.isQuaternion = !0),
                (this._x = e),
                (this._y = t),
                (this._z = n),
                (this._w = r));
        }
        static slerpFlat(e, t, n, r, i, a, o) {
            let s = n[r + 0],
                c = n[r + 1],
                l = n[r + 2],
                u = n[r + 3],
                d = i[a + 0],
                f = i[a + 1],
                p = i[a + 2],
                m = i[a + 3];
            if (u !== m || s !== d || c !== f || l !== p) {
                let e = s * d + c * f + l * p + u * m;
                e < 0 && ((d = -d), (f = -f), (p = -p), (m = -m), (e = -e));
                let t = 1 - o;
                if (e < 0.9995) {
                    let n = Math.acos(e),
                        r = Math.sin(n);
                    ((t = Math.sin(t * n) / r),
                        (o = Math.sin(o * n) / r),
                        (s = s * t + d * o),
                        (c = c * t + f * o),
                        (l = l * t + p * o),
                        (u = u * t + m * o));
                } else {
                    ((s = s * t + d * o),
                        (c = c * t + f * o),
                        (l = l * t + p * o),
                        (u = u * t + m * o));
                    let e = 1 / Math.sqrt(s * s + c * c + l * l + u * u);
                    ((s *= e), (c *= e), (l *= e), (u *= e));
                }
            }
            ((e[t] = s), (e[t + 1] = c), (e[t + 2] = l), (e[t + 3] = u));
        }
        static multiplyQuaternionsFlat(e, t, n, r, i, a) {
            let o = n[r],
                s = n[r + 1],
                c = n[r + 2],
                l = n[r + 3],
                u = i[a],
                d = i[a + 1],
                f = i[a + 2],
                p = i[a + 3];
            return (
                (e[t] = o * p + l * u + s * f - c * d),
                (e[t + 1] = s * p + l * d + c * u - o * f),
                (e[t + 2] = c * p + l * f + o * d - s * u),
                (e[t + 3] = l * p - o * u - s * d - c * f),
                e
            );
        }
        get x() {
            return this._x;
        }
        set x(e) {
            ((this._x = e), this._onChangeCallback());
        }
        get y() {
            return this._y;
        }
        set y(e) {
            ((this._y = e), this._onChangeCallback());
        }
        get z() {
            return this._z;
        }
        set z(e) {
            ((this._z = e), this._onChangeCallback());
        }
        get w() {
            return this._w;
        }
        set w(e) {
            ((this._w = e), this._onChangeCallback());
        }
        set(e, t, n, r) {
            return (
                (this._x = e),
                (this._y = t),
                (this._z = n),
                (this._w = r),
                this._onChangeCallback(),
                this
            );
        }
        clone() {
            return new this.constructor(this._x, this._y, this._z, this._w);
        }
        copy(e) {
            return (
                (this._x = e.x),
                (this._y = e.y),
                (this._z = e.z),
                (this._w = e.w),
                this._onChangeCallback(),
                this
            );
        }
        setFromEuler(e, t = !0) {
            let n = e._x,
                r = e._y,
                i = e._z,
                a = e._order,
                o = Math.cos,
                s = Math.sin,
                c = o(n / 2),
                l = o(r / 2),
                u = o(i / 2),
                d = s(n / 2),
                f = s(r / 2),
                p = s(i / 2);
            switch (a) {
                case `XYZ`:
                    ((this._x = d * l * u + c * f * p),
                        (this._y = c * f * u - d * l * p),
                        (this._z = c * l * p + d * f * u),
                        (this._w = c * l * u - d * f * p));
                    break;
                case `YXZ`:
                    ((this._x = d * l * u + c * f * p),
                        (this._y = c * f * u - d * l * p),
                        (this._z = c * l * p - d * f * u),
                        (this._w = c * l * u + d * f * p));
                    break;
                case `ZXY`:
                    ((this._x = d * l * u - c * f * p),
                        (this._y = c * f * u + d * l * p),
                        (this._z = c * l * p + d * f * u),
                        (this._w = c * l * u - d * f * p));
                    break;
                case `ZYX`:
                    ((this._x = d * l * u - c * f * p),
                        (this._y = c * f * u + d * l * p),
                        (this._z = c * l * p - d * f * u),
                        (this._w = c * l * u + d * f * p));
                    break;
                case `YZX`:
                    ((this._x = d * l * u + c * f * p),
                        (this._y = c * f * u + d * l * p),
                        (this._z = c * l * p - d * f * u),
                        (this._w = c * l * u - d * f * p));
                    break;
                case `XZY`:
                    ((this._x = d * l * u - c * f * p),
                        (this._y = c * f * u - d * l * p),
                        (this._z = c * l * p + d * f * u),
                        (this._w = c * l * u + d * f * p));
                    break;
                default:
                    W(
                        `Quaternion: .setFromEuler() encountered an unknown order: ` +
                            a,
                    );
            }
            return (t === !0 && this._onChangeCallback(), this);
        }
        setFromAxisAngle(e, t) {
            let n = t / 2,
                r = Math.sin(n);
            return (
                (this._x = e.x * r),
                (this._y = e.y * r),
                (this._z = e.z * r),
                (this._w = Math.cos(n)),
                this._onChangeCallback(),
                this
            );
        }
        setFromRotationMatrix(e) {
            let t = e.elements,
                n = t[0],
                r = t[4],
                i = t[8],
                a = t[1],
                o = t[5],
                s = t[9],
                c = t[2],
                l = t[6],
                u = t[10],
                d = n + o + u;
            if (d > 0) {
                let e = 0.5 / Math.sqrt(d + 1);
                ((this._w = 0.25 / e),
                    (this._x = (l - s) * e),
                    (this._y = (i - c) * e),
                    (this._z = (a - r) * e));
            } else if (n > o && n > u) {
                let e = 2 * Math.sqrt(1 + n - o - u);
                ((this._w = (l - s) / e),
                    (this._x = 0.25 * e),
                    (this._y = (r + a) / e),
                    (this._z = (i + c) / e));
            } else if (o > u) {
                let e = 2 * Math.sqrt(1 + o - n - u);
                ((this._w = (i - c) / e),
                    (this._x = (r + a) / e),
                    (this._y = 0.25 * e),
                    (this._z = (s + l) / e));
            } else {
                let e = 2 * Math.sqrt(1 + u - n - o);
                ((this._w = (a - r) / e),
                    (this._x = (i + c) / e),
                    (this._y = (s + l) / e),
                    (this._z = 0.25 * e));
            }
            return (this._onChangeCallback(), this);
        }
        setFromUnitVectors(e, t) {
            let n = e.dot(t) + 1;
            return (
                n < 1e-8
                    ? ((n = 0),
                      Math.abs(e.x) > Math.abs(e.z)
                          ? ((this._x = -e.y),
                            (this._y = e.x),
                            (this._z = 0),
                            (this._w = n))
                          : ((this._x = 0),
                            (this._y = -e.z),
                            (this._z = e.y),
                            (this._w = n)))
                    : ((this._x = e.y * t.z - e.z * t.y),
                      (this._y = e.z * t.x - e.x * t.z),
                      (this._z = e.x * t.y - e.y * t.x),
                      (this._w = n)),
                this.normalize()
            );
        }
        angleTo(e) {
            return 2 * Math.acos(Math.abs(K(this.dot(e), -1, 1)));
        }
        rotateTowards(e, t) {
            let n = this.angleTo(e);
            if (n === 0) return this;
            let r = Math.min(1, t / n);
            return (this.slerp(e, r), this);
        }
        identity() {
            return this.set(0, 0, 0, 1);
        }
        invert() {
            return this.conjugate();
        }
        conjugate() {
            return (
                (this._x *= -1),
                (this._y *= -1),
                (this._z *= -1),
                this._onChangeCallback(),
                this
            );
        }
        dot(e) {
            return (
                this._x * e._x +
                this._y * e._y +
                this._z * e._z +
                this._w * e._w
            );
        }
        lengthSq() {
            return (
                this._x * this._x +
                this._y * this._y +
                this._z * this._z +
                this._w * this._w
            );
        }
        length() {
            return Math.sqrt(
                this._x * this._x +
                    this._y * this._y +
                    this._z * this._z +
                    this._w * this._w,
            );
        }
        normalize() {
            let e = this.length();
            return (
                e === 0
                    ? ((this._x = 0),
                      (this._y = 0),
                      (this._z = 0),
                      (this._w = 1))
                    : ((e = 1 / e),
                      (this._x *= e),
                      (this._y *= e),
                      (this._z *= e),
                      (this._w *= e)),
                this._onChangeCallback(),
                this
            );
        }
        multiply(e) {
            return this.multiplyQuaternions(this, e);
        }
        premultiply(e) {
            return this.multiplyQuaternions(e, this);
        }
        multiplyQuaternions(e, t) {
            let n = e._x,
                r = e._y,
                i = e._z,
                a = e._w,
                o = t._x,
                s = t._y,
                c = t._z,
                l = t._w;
            return (
                (this._x = n * l + a * o + r * c - i * s),
                (this._y = r * l + a * s + i * o - n * c),
                (this._z = i * l + a * c + n * s - r * o),
                (this._w = a * l - n * o - r * s - i * c),
                this._onChangeCallback(),
                this
            );
        }
        slerp(e, t) {
            let n = e._x,
                r = e._y,
                i = e._z,
                a = e._w,
                o = this.dot(e);
            o < 0 && ((n = -n), (r = -r), (i = -i), (a = -a), (o = -o));
            let s = 1 - t;
            if (o < 0.9995) {
                let e = Math.acos(o),
                    c = Math.sin(e);
                ((s = Math.sin(s * e) / c),
                    (t = Math.sin(t * e) / c),
                    (this._x = this._x * s + n * t),
                    (this._y = this._y * s + r * t),
                    (this._z = this._z * s + i * t),
                    (this._w = this._w * s + a * t),
                    this._onChangeCallback());
            } else
                ((this._x = this._x * s + n * t),
                    (this._y = this._y * s + r * t),
                    (this._z = this._z * s + i * t),
                    (this._w = this._w * s + a * t),
                    this.normalize());
            return this;
        }
        slerpQuaternions(e, t, n) {
            return this.copy(e).slerp(t, n);
        }
        random() {
            let e = 2 * Math.PI * Math.random(),
                t = 2 * Math.PI * Math.random(),
                n = Math.random(),
                r = Math.sqrt(1 - n),
                i = Math.sqrt(n);
            return this.set(
                r * Math.sin(e),
                r * Math.cos(e),
                i * Math.sin(t),
                i * Math.cos(t),
            );
        }
        equals(e) {
            return (
                e._x === this._x &&
                e._y === this._y &&
                e._z === this._z &&
                e._w === this._w
            );
        }
        fromArray(e, t = 0) {
            return (
                (this._x = e[t]),
                (this._y = e[t + 1]),
                (this._z = e[t + 2]),
                (this._w = e[t + 3]),
                this._onChangeCallback(),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this._x),
                (e[t + 1] = this._y),
                (e[t + 2] = this._z),
                (e[t + 3] = this._w),
                e
            );
        }
        fromBufferAttribute(e, t) {
            return (
                (this._x = e.getX(t)),
                (this._y = e.getY(t)),
                (this._z = e.getZ(t)),
                (this._w = e.getW(t)),
                this._onChangeCallback(),
                this
            );
        }
        toJSON() {
            return this.toArray();
        }
        _onChange(e) {
            return ((this._onChangeCallback = e), this);
        }
        _onChangeCallback() {}
        *[Symbol.iterator]() {
            (yield this._x, yield this._y, yield this._z, yield this._w);
        }
    },
    J = class e {
        static {
            e.prototype.isVector3 = !0;
        }
        constructor(e = 0, t = 0, n = 0) {
            ((this.x = e), (this.y = t), (this.z = n));
        }
        set(e, t, n) {
            return (
                n === void 0 && (n = this.z),
                (this.x = e),
                (this.y = t),
                (this.z = n),
                this
            );
        }
        setScalar(e) {
            return ((this.x = e), (this.y = e), (this.z = e), this);
        }
        setX(e) {
            return ((this.x = e), this);
        }
        setY(e) {
            return ((this.y = e), this);
        }
        setZ(e) {
            return ((this.z = e), this);
        }
        setComponent(e, t) {
            switch (e) {
                case 0:
                    this.x = t;
                    break;
                case 1:
                    this.y = t;
                    break;
                case 2:
                    this.z = t;
                    break;
                default:
                    throw Error(`index is out of range: ` + e);
            }
            return this;
        }
        getComponent(e) {
            switch (e) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw Error(`index is out of range: ` + e);
            }
        }
        clone() {
            return new this.constructor(this.x, this.y, this.z);
        }
        copy(e) {
            return ((this.x = e.x), (this.y = e.y), (this.z = e.z), this);
        }
        add(e) {
            return ((this.x += e.x), (this.y += e.y), (this.z += e.z), this);
        }
        addScalar(e) {
            return ((this.x += e), (this.y += e), (this.z += e), this);
        }
        addVectors(e, t) {
            return (
                (this.x = e.x + t.x),
                (this.y = e.y + t.y),
                (this.z = e.z + t.z),
                this
            );
        }
        addScaledVector(e, t) {
            return (
                (this.x += e.x * t),
                (this.y += e.y * t),
                (this.z += e.z * t),
                this
            );
        }
        sub(e) {
            return ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this);
        }
        subScalar(e) {
            return ((this.x -= e), (this.y -= e), (this.z -= e), this);
        }
        subVectors(e, t) {
            return (
                (this.x = e.x - t.x),
                (this.y = e.y - t.y),
                (this.z = e.z - t.z),
                this
            );
        }
        multiply(e) {
            return ((this.x *= e.x), (this.y *= e.y), (this.z *= e.z), this);
        }
        multiplyScalar(e) {
            return ((this.x *= e), (this.y *= e), (this.z *= e), this);
        }
        multiplyVectors(e, t) {
            return (
                (this.x = e.x * t.x),
                (this.y = e.y * t.y),
                (this.z = e.z * t.z),
                this
            );
        }
        applyEuler(e) {
            return this.applyQuaternion(gt.setFromEuler(e));
        }
        applyAxisAngle(e, t) {
            return this.applyQuaternion(gt.setFromAxisAngle(e, t));
        }
        applyMatrix3(e) {
            let t = this.x,
                n = this.y,
                r = this.z,
                i = e.elements;
            return (
                (this.x = i[0] * t + i[3] * n + i[6] * r),
                (this.y = i[1] * t + i[4] * n + i[7] * r),
                (this.z = i[2] * t + i[5] * n + i[8] * r),
                this
            );
        }
        applyNormalMatrix(e) {
            return this.applyMatrix3(e).normalize();
        }
        applyMatrix4(e) {
            let t = this.x,
                n = this.y,
                r = this.z,
                i = e.elements,
                a = 1 / (i[3] * t + i[7] * n + i[11] * r + i[15]);
            return (
                (this.x = (i[0] * t + i[4] * n + i[8] * r + i[12]) * a),
                (this.y = (i[1] * t + i[5] * n + i[9] * r + i[13]) * a),
                (this.z = (i[2] * t + i[6] * n + i[10] * r + i[14]) * a),
                this
            );
        }
        applyQuaternion(e) {
            let t = this.x,
                n = this.y,
                r = this.z,
                i = e.x,
                a = e.y,
                o = e.z,
                s = e.w,
                c = 2 * (a * r - o * n),
                l = 2 * (o * t - i * r),
                u = 2 * (i * n - a * t);
            return (
                (this.x = t + s * c + a * u - o * l),
                (this.y = n + s * l + o * c - i * u),
                (this.z = r + s * u + i * l - a * c),
                this
            );
        }
        project(e) {
            return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(
                e.projectionMatrix,
            );
        }
        unproject(e) {
            return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(
                e.matrixWorld,
            );
        }
        transformDirection(e) {
            let t = this.x,
                n = this.y,
                r = this.z,
                i = e.elements;
            return (
                (this.x = i[0] * t + i[4] * n + i[8] * r),
                (this.y = i[1] * t + i[5] * n + i[9] * r),
                (this.z = i[2] * t + i[6] * n + i[10] * r),
                this.normalize()
            );
        }
        divide(e) {
            return ((this.x /= e.x), (this.y /= e.y), (this.z /= e.z), this);
        }
        divideScalar(e) {
            return this.multiplyScalar(1 / e);
        }
        min(e) {
            return (
                (this.x = Math.min(this.x, e.x)),
                (this.y = Math.min(this.y, e.y)),
                (this.z = Math.min(this.z, e.z)),
                this
            );
        }
        max(e) {
            return (
                (this.x = Math.max(this.x, e.x)),
                (this.y = Math.max(this.y, e.y)),
                (this.z = Math.max(this.z, e.z)),
                this
            );
        }
        clamp(e, t) {
            return (
                (this.x = K(this.x, e.x, t.x)),
                (this.y = K(this.y, e.y, t.y)),
                (this.z = K(this.z, e.z, t.z)),
                this
            );
        }
        clampScalar(e, t) {
            return (
                (this.x = K(this.x, e, t)),
                (this.y = K(this.y, e, t)),
                (this.z = K(this.z, e, t)),
                this
            );
        }
        clampLength(e, t) {
            let n = this.length();
            return this.divideScalar(n || 1).multiplyScalar(K(n, e, t));
        }
        floor() {
            return (
                (this.x = Math.floor(this.x)),
                (this.y = Math.floor(this.y)),
                (this.z = Math.floor(this.z)),
                this
            );
        }
        ceil() {
            return (
                (this.x = Math.ceil(this.x)),
                (this.y = Math.ceil(this.y)),
                (this.z = Math.ceil(this.z)),
                this
            );
        }
        round() {
            return (
                (this.x = Math.round(this.x)),
                (this.y = Math.round(this.y)),
                (this.z = Math.round(this.z)),
                this
            );
        }
        roundToZero() {
            return (
                (this.x = Math.trunc(this.x)),
                (this.y = Math.trunc(this.y)),
                (this.z = Math.trunc(this.z)),
                this
            );
        }
        negate() {
            return (
                (this.x = -this.x),
                (this.y = -this.y),
                (this.z = -this.z),
                this
            );
        }
        dot(e) {
            return this.x * e.x + this.y * e.y + this.z * e.z;
        }
        lengthSq() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
        length() {
            return Math.sqrt(
                this.x * this.x + this.y * this.y + this.z * this.z,
            );
        }
        manhattanLength() {
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        }
        normalize() {
            return this.divideScalar(this.length() || 1);
        }
        setLength(e) {
            return this.normalize().multiplyScalar(e);
        }
        lerp(e, t) {
            return (
                (this.x += (e.x - this.x) * t),
                (this.y += (e.y - this.y) * t),
                (this.z += (e.z - this.z) * t),
                this
            );
        }
        lerpVectors(e, t, n) {
            return (
                (this.x = e.x + (t.x - e.x) * n),
                (this.y = e.y + (t.y - e.y) * n),
                (this.z = e.z + (t.z - e.z) * n),
                this
            );
        }
        cross(e) {
            return this.crossVectors(this, e);
        }
        crossVectors(e, t) {
            let n = e.x,
                r = e.y,
                i = e.z,
                a = t.x,
                o = t.y,
                s = t.z;
            return (
                (this.x = r * s - i * o),
                (this.y = i * a - n * s),
                (this.z = n * o - r * a),
                this
            );
        }
        projectOnVector(e) {
            let t = e.lengthSq();
            if (t === 0) return this.set(0, 0, 0);
            let n = e.dot(this) / t;
            return this.copy(e).multiplyScalar(n);
        }
        projectOnPlane(e) {
            return (ht.copy(this).projectOnVector(e), this.sub(ht));
        }
        reflect(e) {
            return this.sub(ht.copy(e).multiplyScalar(2 * this.dot(e)));
        }
        angleTo(e) {
            let t = Math.sqrt(this.lengthSq() * e.lengthSq());
            if (t === 0) return Math.PI / 2;
            let n = this.dot(e) / t;
            return Math.acos(K(n, -1, 1));
        }
        distanceTo(e) {
            return Math.sqrt(this.distanceToSquared(e));
        }
        distanceToSquared(e) {
            let t = this.x - e.x,
                n = this.y - e.y,
                r = this.z - e.z;
            return t * t + n * n + r * r;
        }
        manhattanDistanceTo(e) {
            return (
                Math.abs(this.x - e.x) +
                Math.abs(this.y - e.y) +
                Math.abs(this.z - e.z)
            );
        }
        setFromSpherical(e) {
            return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
        }
        setFromSphericalCoords(e, t, n) {
            let r = Math.sin(t) * e;
            return (
                (this.x = r * Math.sin(n)),
                (this.y = Math.cos(t) * e),
                (this.z = r * Math.cos(n)),
                this
            );
        }
        setFromCylindrical(e) {
            return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
        }
        setFromCylindricalCoords(e, t, n) {
            return (
                (this.x = e * Math.sin(t)),
                (this.y = n),
                (this.z = e * Math.cos(t)),
                this
            );
        }
        setFromMatrixPosition(e) {
            let t = e.elements;
            return ((this.x = t[12]), (this.y = t[13]), (this.z = t[14]), this);
        }
        setFromMatrixScale(e) {
            let t = this.setFromMatrixColumn(e, 0).length(),
                n = this.setFromMatrixColumn(e, 1).length(),
                r = this.setFromMatrixColumn(e, 2).length();
            return ((this.x = t), (this.y = n), (this.z = r), this);
        }
        setFromMatrixColumn(e, t) {
            return this.fromArray(e.elements, t * 4);
        }
        setFromMatrix3Column(e, t) {
            return this.fromArray(e.elements, t * 3);
        }
        setFromEuler(e) {
            return ((this.x = e._x), (this.y = e._y), (this.z = e._z), this);
        }
        setFromColor(e) {
            return ((this.x = e.r), (this.y = e.g), (this.z = e.b), this);
        }
        equals(e) {
            return e.x === this.x && e.y === this.y && e.z === this.z;
        }
        fromArray(e, t = 0) {
            return (
                (this.x = e[t]),
                (this.y = e[t + 1]),
                (this.z = e[t + 2]),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this.x),
                (e[t + 1] = this.y),
                (e[t + 2] = this.z),
                e
            );
        }
        fromBufferAttribute(e, t) {
            return (
                (this.x = e.getX(t)),
                (this.y = e.getY(t)),
                (this.z = e.getZ(t)),
                this
            );
        }
        random() {
            return (
                (this.x = Math.random()),
                (this.y = Math.random()),
                (this.z = Math.random()),
                this
            );
        }
        randomDirection() {
            let e = Math.random() * Math.PI * 2,
                t = Math.random() * 2 - 1,
                n = Math.sqrt(1 - t * t);
            return (
                (this.x = n * Math.cos(e)),
                (this.y = t),
                (this.z = n * Math.sin(e)),
                this
            );
        }
        *[Symbol.iterator]() {
            (yield this.x, yield this.y, yield this.z);
        }
    },
    ht = new J(),
    gt = new mt(),
    Y = class e {
        static {
            e.prototype.isMatrix3 = !0;
        }
        constructor(e, t, n, r, i, a, o, s, c) {
            ((this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
                e !== void 0 && this.set(e, t, n, r, i, a, o, s, c));
        }
        set(e, t, n, r, i, a, o, s, c) {
            let l = this.elements;
            return (
                (l[0] = e),
                (l[1] = r),
                (l[2] = o),
                (l[3] = t),
                (l[4] = i),
                (l[5] = s),
                (l[6] = n),
                (l[7] = a),
                (l[8] = c),
                this
            );
        }
        identity() {
            return (this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this);
        }
        copy(e) {
            let t = this.elements,
                n = e.elements;
            return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[3]),
                (t[4] = n[4]),
                (t[5] = n[5]),
                (t[6] = n[6]),
                (t[7] = n[7]),
                (t[8] = n[8]),
                this
            );
        }
        extractBasis(e, t, n) {
            return (
                e.setFromMatrix3Column(this, 0),
                t.setFromMatrix3Column(this, 1),
                n.setFromMatrix3Column(this, 2),
                this
            );
        }
        setFromMatrix4(e) {
            let t = e.elements;
            return (
                this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]),
                this
            );
        }
        multiply(e) {
            return this.multiplyMatrices(this, e);
        }
        premultiply(e) {
            return this.multiplyMatrices(e, this);
        }
        multiplyMatrices(e, t) {
            let n = e.elements,
                r = t.elements,
                i = this.elements,
                a = n[0],
                o = n[3],
                s = n[6],
                c = n[1],
                l = n[4],
                u = n[7],
                d = n[2],
                f = n[5],
                p = n[8],
                m = r[0],
                h = r[3],
                g = r[6],
                _ = r[1],
                v = r[4],
                y = r[7],
                b = r[2],
                x = r[5],
                S = r[8];
            return (
                (i[0] = a * m + o * _ + s * b),
                (i[3] = a * h + o * v + s * x),
                (i[6] = a * g + o * y + s * S),
                (i[1] = c * m + l * _ + u * b),
                (i[4] = c * h + l * v + u * x),
                (i[7] = c * g + l * y + u * S),
                (i[2] = d * m + f * _ + p * b),
                (i[5] = d * h + f * v + p * x),
                (i[8] = d * g + f * y + p * S),
                this
            );
        }
        multiplyScalar(e) {
            let t = this.elements;
            return (
                (t[0] *= e),
                (t[3] *= e),
                (t[6] *= e),
                (t[1] *= e),
                (t[4] *= e),
                (t[7] *= e),
                (t[2] *= e),
                (t[5] *= e),
                (t[8] *= e),
                this
            );
        }
        determinant() {
            let e = this.elements,
                t = e[0],
                n = e[1],
                r = e[2],
                i = e[3],
                a = e[4],
                o = e[5],
                s = e[6],
                c = e[7],
                l = e[8];
            return (
                t * a * l -
                t * o * c -
                n * i * l +
                n * o * s +
                r * i * c -
                r * a * s
            );
        }
        invert() {
            let e = this.elements,
                t = e[0],
                n = e[1],
                r = e[2],
                i = e[3],
                a = e[4],
                o = e[5],
                s = e[6],
                c = e[7],
                l = e[8],
                u = l * a - o * c,
                d = o * s - l * i,
                f = c * i - a * s,
                p = t * u + n * d + r * f;
            if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
            let m = 1 / p;
            return (
                (e[0] = u * m),
                (e[1] = (r * c - l * n) * m),
                (e[2] = (o * n - r * a) * m),
                (e[3] = d * m),
                (e[4] = (l * t - r * s) * m),
                (e[5] = (r * i - o * t) * m),
                (e[6] = f * m),
                (e[7] = (n * s - c * t) * m),
                (e[8] = (a * t - n * i) * m),
                this
            );
        }
        transpose() {
            let e,
                t = this.elements;
            return (
                (e = t[1]),
                (t[1] = t[3]),
                (t[3] = e),
                (e = t[2]),
                (t[2] = t[6]),
                (t[6] = e),
                (e = t[5]),
                (t[5] = t[7]),
                (t[7] = e),
                this
            );
        }
        getNormalMatrix(e) {
            return this.setFromMatrix4(e).invert().transpose();
        }
        transposeIntoArray(e) {
            let t = this.elements;
            return (
                (e[0] = t[0]),
                (e[1] = t[3]),
                (e[2] = t[6]),
                (e[3] = t[1]),
                (e[4] = t[4]),
                (e[5] = t[7]),
                (e[6] = t[2]),
                (e[7] = t[5]),
                (e[8] = t[8]),
                this
            );
        }
        setUvTransform(e, t, n, r, i, a, o) {
            let s = Math.cos(i),
                c = Math.sin(i);
            return (
                this.set(
                    n * s,
                    n * c,
                    -n * (s * a + c * o) + a + e,
                    -r * c,
                    r * s,
                    -r * (-c * a + s * o) + o + t,
                    0,
                    0,
                    1,
                ),
                this
            );
        }
        scale(e, t) {
            return (this.premultiply(_t.makeScale(e, t)), this);
        }
        rotate(e) {
            return (this.premultiply(_t.makeRotation(-e)), this);
        }
        translate(e, t) {
            return (this.premultiply(_t.makeTranslation(e, t)), this);
        }
        makeTranslation(e, t) {
            return (
                e.isVector2
                    ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1)
                    : this.set(1, 0, e, 0, 1, t, 0, 0, 1),
                this
            );
        }
        makeRotation(e) {
            let t = Math.cos(e),
                n = Math.sin(e);
            return (this.set(t, -n, 0, n, t, 0, 0, 0, 1), this);
        }
        makeScale(e, t) {
            return (this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this);
        }
        equals(e) {
            let t = this.elements,
                n = e.elements;
            for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
            return !0;
        }
        fromArray(e, t = 0) {
            for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
            return this;
        }
        toArray(e = [], t = 0) {
            let n = this.elements;
            return (
                (e[t] = n[0]),
                (e[t + 1] = n[1]),
                (e[t + 2] = n[2]),
                (e[t + 3] = n[3]),
                (e[t + 4] = n[4]),
                (e[t + 5] = n[5]),
                (e[t + 6] = n[6]),
                (e[t + 7] = n[7]),
                (e[t + 8] = n[8]),
                e
            );
        }
        clone() {
            return new this.constructor().fromArray(this.elements);
        }
    },
    _t = new Y(),
    vt = new Y().set(
        0.4123908,
        0.3575843,
        0.1804808,
        0.212639,
        0.7151687,
        0.0721923,
        0.0193308,
        0.1191948,
        0.9505322,
    ),
    yt = new Y().set(
        3.2409699,
        -1.5373832,
        -0.4986108,
        -0.9692436,
        1.8759675,
        0.0415551,
        0.0556301,
        -0.203977,
        1.0569715,
    );
function bt() {
    let e = {
            enabled: !0,
            workingColorSpace: Ve,
            spaces: {},
            convert: function (e, t, n) {
                return this.enabled === !1 || t === n || !t || !n
                    ? e
                    : (this.spaces[t].transfer === `srgb` &&
                          ((e.r = xt(e.r)), (e.g = xt(e.g)), (e.b = xt(e.b))),
                      this.spaces[t].primaries !== this.spaces[n].primaries &&
                          (e.applyMatrix3(this.spaces[t].toXYZ),
                          e.applyMatrix3(this.spaces[n].fromXYZ)),
                      this.spaces[n].transfer === `srgb` &&
                          ((e.r = St(e.r)), (e.g = St(e.g)), (e.b = St(e.b))),
                      e);
            },
            workingToColorSpace: function (e, t) {
                return this.convert(e, this.workingColorSpace, t);
            },
            colorSpaceToWorking: function (e, t) {
                return this.convert(e, t, this.workingColorSpace);
            },
            getPrimaries: function (e) {
                return this.spaces[e].primaries;
            },
            getTransfer: function (e) {
                return e === `` ? He : this.spaces[e].transfer;
            },
            getToneMappingMode: function (e) {
                return (
                    this.spaces[e].outputColorSpaceConfig.toneMappingMode ||
                    `standard`
                );
            },
            getLuminanceCoefficients: function (e, t = this.workingColorSpace) {
                return e.fromArray(this.spaces[t].luminanceCoefficients);
            },
            define: function (e) {
                Object.assign(this.spaces, e);
            },
            _getMatrix: function (e, t, n) {
                return e
                    .copy(this.spaces[t].toXYZ)
                    .multiply(this.spaces[n].fromXYZ);
            },
            _getDrawingBufferColorSpace: function (e) {
                return this.spaces[e].outputColorSpaceConfig
                    .drawingBufferColorSpace;
            },
            _getUnpackColorSpace: function (e = this.workingColorSpace) {
                return this.spaces[e].workingColorSpaceConfig.unpackColorSpace;
            },
            fromWorkingColorSpace: function (t, n) {
                return (
                    nt(
                        `ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`,
                    ),
                    e.workingToColorSpace(t, n)
                );
            },
            toWorkingColorSpace: function (t, n) {
                return (
                    nt(
                        `ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`,
                    ),
                    e.colorSpaceToWorking(t, n)
                );
            },
        },
        t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
        n = [0.2126, 0.7152, 0.0722],
        r = [0.3127, 0.329];
    return (
        e.define({
            [Ve]: {
                primaries: t,
                whitePoint: r,
                transfer: He,
                toXYZ: vt,
                fromXYZ: yt,
                luminanceCoefficients: n,
                workingColorSpaceConfig: { unpackColorSpace: Be },
                outputColorSpaceConfig: { drawingBufferColorSpace: Be },
            },
            [Be]: {
                primaries: t,
                whitePoint: r,
                transfer: Ue,
                toXYZ: vt,
                fromXYZ: yt,
                luminanceCoefficients: n,
                outputColorSpaceConfig: { drawingBufferColorSpace: Be },
            },
        }),
        e
    );
}
var X = bt();
function xt(e) {
    return e < 0.04045
        ? e * 0.0773993808
        : (e * 0.9478672986 + 0.0521327014) ** 2.4;
}
function St(e) {
    return e < 0.0031308 ? e * 12.92 : 1.055 * e ** 0.41666 - 0.055;
}
var Ct,
    wt = class {
        static getDataURL(e, t = `image/png`) {
            if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > `u`)
                return e.src;
            let n;
            if (e instanceof HTMLCanvasElement) n = e;
            else {
                (Ct === void 0 && (Ct = Xe(`canvas`)),
                    (Ct.width = e.width),
                    (Ct.height = e.height));
                let t = Ct.getContext(`2d`);
                (e instanceof ImageData
                    ? t.putImageData(e, 0, 0)
                    : t.drawImage(e, 0, 0, e.width, e.height),
                    (n = Ct));
            }
            return n.toDataURL(t);
        }
        static sRGBToLinear(e) {
            if (
                (typeof HTMLImageElement < `u` &&
                    e instanceof HTMLImageElement) ||
                (typeof HTMLCanvasElement < `u` &&
                    e instanceof HTMLCanvasElement) ||
                (typeof ImageBitmap < `u` && e instanceof ImageBitmap)
            ) {
                let t = Xe(`canvas`);
                ((t.width = e.width), (t.height = e.height));
                let n = t.getContext(`2d`);
                n.drawImage(e, 0, 0, e.width, e.height);
                let r = n.getImageData(0, 0, e.width, e.height),
                    i = r.data;
                for (let e = 0; e < i.length; e++) i[e] = xt(i[e] / 255) * 255;
                return (n.putImageData(r, 0, 0), t);
            } else if (e.data) {
                let t = e.data.slice(0);
                for (let e = 0; e < t.length; e++)
                    t instanceof Uint8Array || t instanceof Uint8ClampedArray
                        ? (t[e] = Math.floor(xt(t[e] / 255) * 255))
                        : (t[e] = xt(t[e]));
                return { data: t, width: e.width, height: e.height };
            } else
                return (
                    W(
                        `ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`,
                    ),
                    e
                );
        }
    },
    Tt = 0,
    Et = class {
        constructor(e = null) {
            ((this.isSource = !0),
                Object.defineProperty(this, "id", { value: Tt++ }),
                (this.uuid = lt()),
                (this.data = e),
                (this.dataReady = !0),
                (this.version = 0));
        }
        getSize(e) {
            let t = this.data;
            return (
                typeof HTMLVideoElement < `u` && t instanceof HTMLVideoElement
                    ? e.set(t.videoWidth, t.videoHeight, 0)
                    : typeof VideoFrame < `u` && t instanceof VideoFrame
                      ? e.set(t.displayWidth, t.displayHeight, 0)
                      : t === null
                        ? e.set(0, 0, 0)
                        : e.set(t.width, t.height, t.depth || 0),
                e
            );
        }
        set needsUpdate(e) {
            e === !0 && this.version++;
        }
        toJSON(e) {
            let t = e === void 0 || typeof e == `string`;
            if (!t && e.images[this.uuid] !== void 0)
                return e.images[this.uuid];
            let n = { uuid: this.uuid, url: `` },
                r = this.data;
            if (r !== null) {
                let e;
                if (Array.isArray(r)) {
                    e = [];
                    for (let t = 0, n = r.length; t < n; t++)
                        r[t].isDataTexture
                            ? e.push(Dt(r[t].image))
                            : e.push(Dt(r[t]));
                } else e = Dt(r);
                n.url = e;
            }
            return (t || (e.images[this.uuid] = n), n);
        }
    };
function Dt(e) {
    return (typeof HTMLImageElement < `u` && e instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < `u` && e instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < `u` && e instanceof ImageBitmap)
        ? wt.getDataURL(e)
        : e.data
          ? {
                data: Array.from(e.data),
                width: e.width,
                height: e.height,
                type: e.data.constructor.name,
            }
          : (W(`Texture: Unable to serialize Texture.`), {});
}
var Ot = 0,
    kt = new J(),
    At = class e extends at {
        constructor(
            t = e.DEFAULT_IMAGE,
            n = e.DEFAULT_MAPPING,
            r = l,
            i = l,
            a = m,
            o = g,
            s = M,
            c = _,
            u = e.DEFAULT_ANISOTROPY,
            d = ``,
        ) {
            (super(),
                (this.isTexture = !0),
                Object.defineProperty(this, "id", { value: Ot++ }),
                (this.uuid = lt()),
                (this.name = ``),
                (this.source = new Et(t)),
                (this.mipmaps = []),
                (this.mapping = n),
                (this.channel = 0),
                (this.wrapS = r),
                (this.wrapT = i),
                (this.magFilter = a),
                (this.minFilter = o),
                (this.anisotropy = u),
                (this.format = s),
                (this.internalFormat = null),
                (this.type = c),
                (this.offset = new q(0, 0)),
                (this.repeat = new q(1, 1)),
                (this.center = new q(0, 0)),
                (this.rotation = 0),
                (this.matrixAutoUpdate = !0),
                (this.matrix = new Y()),
                (this.generateMipmaps = !0),
                (this.premultiplyAlpha = !1),
                (this.flipY = !0),
                (this.unpackAlignment = 4),
                (this.colorSpace = d),
                (this.userData = {}),
                (this.updateRanges = []),
                (this.version = 0),
                (this.onUpdate = null),
                (this.renderTarget = null),
                (this.isRenderTargetTexture = !1),
                (this.isArrayTexture = !!(t && t.depth && t.depth > 1)),
                (this.pmremVersion = 0),
                (this.normalized = !1));
        }
        get width() {
            return this.source.getSize(kt).x;
        }
        get height() {
            return this.source.getSize(kt).y;
        }
        get depth() {
            return this.source.getSize(kt).z;
        }
        get image() {
            return this.source.data;
        }
        set image(e) {
            this.source.data = e;
        }
        updateMatrix() {
            this.matrix.setUvTransform(
                this.offset.x,
                this.offset.y,
                this.repeat.x,
                this.repeat.y,
                this.rotation,
                this.center.x,
                this.center.y,
            );
        }
        addUpdateRange(e, t) {
            this.updateRanges.push({ start: e, count: t });
        }
        clearUpdateRanges() {
            this.updateRanges.length = 0;
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            return (
                (this.name = e.name),
                (this.source = e.source),
                (this.mipmaps = e.mipmaps.slice(0)),
                (this.mapping = e.mapping),
                (this.channel = e.channel),
                (this.wrapS = e.wrapS),
                (this.wrapT = e.wrapT),
                (this.magFilter = e.magFilter),
                (this.minFilter = e.minFilter),
                (this.anisotropy = e.anisotropy),
                (this.format = e.format),
                (this.internalFormat = e.internalFormat),
                (this.type = e.type),
                (this.normalized = e.normalized),
                this.offset.copy(e.offset),
                this.repeat.copy(e.repeat),
                this.center.copy(e.center),
                (this.rotation = e.rotation),
                (this.matrixAutoUpdate = e.matrixAutoUpdate),
                this.matrix.copy(e.matrix),
                (this.generateMipmaps = e.generateMipmaps),
                (this.premultiplyAlpha = e.premultiplyAlpha),
                (this.flipY = e.flipY),
                (this.unpackAlignment = e.unpackAlignment),
                (this.colorSpace = e.colorSpace),
                (this.renderTarget = e.renderTarget),
                (this.isRenderTargetTexture = e.isRenderTargetTexture),
                (this.isArrayTexture = e.isArrayTexture),
                (this.userData = JSON.parse(JSON.stringify(e.userData))),
                (this.needsUpdate = !0),
                this
            );
        }
        setValues(e) {
            for (let t in e) {
                let n = e[t];
                if (n === void 0) {
                    W(
                        `Texture.setValues(): parameter '${t}' has value of undefined.`,
                    );
                    continue;
                }
                let r = this[t];
                if (r === void 0) {
                    W(`Texture.setValues(): property '${t}' does not exist.`);
                    continue;
                }
                (r && n && r.isVector2 && n.isVector2) ||
                (r && n && r.isVector3 && n.isVector3) ||
                (r && n && r.isMatrix3 && n.isMatrix3)
                    ? r.copy(n)
                    : (this[t] = n);
            }
        }
        toJSON(e) {
            let t = e === void 0 || typeof e == `string`;
            if (!t && e.textures[this.uuid] !== void 0)
                return e.textures[this.uuid];
            let n = {
                metadata: {
                    version: 4.7,
                    type: `Texture`,
                    generator: `Texture.toJSON`,
                },
                uuid: this.uuid,
                name: this.name,
                image: this.source.toJSON(e).uuid,
                mapping: this.mapping,
                channel: this.channel,
                repeat: [this.repeat.x, this.repeat.y],
                offset: [this.offset.x, this.offset.y],
                center: [this.center.x, this.center.y],
                rotation: this.rotation,
                wrap: [this.wrapS, this.wrapT],
                format: this.format,
                internalFormat: this.internalFormat,
                type: this.type,
                normalized: this.normalized,
                colorSpace: this.colorSpace,
                minFilter: this.minFilter,
                magFilter: this.magFilter,
                anisotropy: this.anisotropy,
                flipY: this.flipY,
                generateMipmaps: this.generateMipmaps,
                premultiplyAlpha: this.premultiplyAlpha,
                unpackAlignment: this.unpackAlignment,
            };
            return (
                Object.keys(this.userData).length > 0 &&
                    (n.userData = this.userData),
                t || (e.textures[this.uuid] = n),
                n
            );
        }
        dispose() {
            this.dispatchEvent({ type: `dispose` });
        }
        transformUv(e) {
            if (this.mapping !== 300) return e;
            if ((e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1))
                switch (this.wrapS) {
                    case c:
                        e.x -= Math.floor(e.x);
                        break;
                    case l:
                        e.x = e.x < 0 ? 0 : 1;
                        break;
                    case u:
                        Math.abs(Math.floor(e.x) % 2) === 1
                            ? (e.x = Math.ceil(e.x) - e.x)
                            : (e.x -= Math.floor(e.x));
                        break;
                }
            if (e.y < 0 || e.y > 1)
                switch (this.wrapT) {
                    case c:
                        e.y -= Math.floor(e.y);
                        break;
                    case l:
                        e.y = e.y < 0 ? 0 : 1;
                        break;
                    case u:
                        Math.abs(Math.floor(e.y) % 2) === 1
                            ? (e.y = Math.ceil(e.y) - e.y)
                            : (e.y -= Math.floor(e.y));
                        break;
                }
            return (this.flipY && (e.y = 1 - e.y), e);
        }
        set needsUpdate(e) {
            e === !0 && (this.version++, (this.source.needsUpdate = !0));
        }
        set needsPMREMUpdate(e) {
            e === !0 && this.pmremVersion++;
        }
    };
((At.DEFAULT_IMAGE = null),
    (At.DEFAULT_MAPPING = 300),
    (At.DEFAULT_ANISOTROPY = 1));
var jt = class e {
        static {
            e.prototype.isVector4 = !0;
        }
        constructor(e = 0, t = 0, n = 0, r = 1) {
            ((this.x = e), (this.y = t), (this.z = n), (this.w = r));
        }
        get width() {
            return this.z;
        }
        set width(e) {
            this.z = e;
        }
        get height() {
            return this.w;
        }
        set height(e) {
            this.w = e;
        }
        set(e, t, n, r) {
            return (
                (this.x = e),
                (this.y = t),
                (this.z = n),
                (this.w = r),
                this
            );
        }
        setScalar(e) {
            return (
                (this.x = e),
                (this.y = e),
                (this.z = e),
                (this.w = e),
                this
            );
        }
        setX(e) {
            return ((this.x = e), this);
        }
        setY(e) {
            return ((this.y = e), this);
        }
        setZ(e) {
            return ((this.z = e), this);
        }
        setW(e) {
            return ((this.w = e), this);
        }
        setComponent(e, t) {
            switch (e) {
                case 0:
                    this.x = t;
                    break;
                case 1:
                    this.y = t;
                    break;
                case 2:
                    this.z = t;
                    break;
                case 3:
                    this.w = t;
                    break;
                default:
                    throw Error(`index is out of range: ` + e);
            }
            return this;
        }
        getComponent(e) {
            switch (e) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                case 3:
                    return this.w;
                default:
                    throw Error(`index is out of range: ` + e);
            }
        }
        clone() {
            return new this.constructor(this.x, this.y, this.z, this.w);
        }
        copy(e) {
            return (
                (this.x = e.x),
                (this.y = e.y),
                (this.z = e.z),
                (this.w = e.w === void 0 ? 1 : e.w),
                this
            );
        }
        add(e) {
            return (
                (this.x += e.x),
                (this.y += e.y),
                (this.z += e.z),
                (this.w += e.w),
                this
            );
        }
        addScalar(e) {
            return (
                (this.x += e),
                (this.y += e),
                (this.z += e),
                (this.w += e),
                this
            );
        }
        addVectors(e, t) {
            return (
                (this.x = e.x + t.x),
                (this.y = e.y + t.y),
                (this.z = e.z + t.z),
                (this.w = e.w + t.w),
                this
            );
        }
        addScaledVector(e, t) {
            return (
                (this.x += e.x * t),
                (this.y += e.y * t),
                (this.z += e.z * t),
                (this.w += e.w * t),
                this
            );
        }
        sub(e) {
            return (
                (this.x -= e.x),
                (this.y -= e.y),
                (this.z -= e.z),
                (this.w -= e.w),
                this
            );
        }
        subScalar(e) {
            return (
                (this.x -= e),
                (this.y -= e),
                (this.z -= e),
                (this.w -= e),
                this
            );
        }
        subVectors(e, t) {
            return (
                (this.x = e.x - t.x),
                (this.y = e.y - t.y),
                (this.z = e.z - t.z),
                (this.w = e.w - t.w),
                this
            );
        }
        multiply(e) {
            return (
                (this.x *= e.x),
                (this.y *= e.y),
                (this.z *= e.z),
                (this.w *= e.w),
                this
            );
        }
        multiplyScalar(e) {
            return (
                (this.x *= e),
                (this.y *= e),
                (this.z *= e),
                (this.w *= e),
                this
            );
        }
        applyMatrix4(e) {
            let t = this.x,
                n = this.y,
                r = this.z,
                i = this.w,
                a = e.elements;
            return (
                (this.x = a[0] * t + a[4] * n + a[8] * r + a[12] * i),
                (this.y = a[1] * t + a[5] * n + a[9] * r + a[13] * i),
                (this.z = a[2] * t + a[6] * n + a[10] * r + a[14] * i),
                (this.w = a[3] * t + a[7] * n + a[11] * r + a[15] * i),
                this
            );
        }
        divide(e) {
            return (
                (this.x /= e.x),
                (this.y /= e.y),
                (this.z /= e.z),
                (this.w /= e.w),
                this
            );
        }
        divideScalar(e) {
            return this.multiplyScalar(1 / e);
        }
        setAxisAngleFromQuaternion(e) {
            this.w = 2 * Math.acos(e.w);
            let t = Math.sqrt(1 - e.w * e.w);
            return (
                t < 1e-4
                    ? ((this.x = 1), (this.y = 0), (this.z = 0))
                    : ((this.x = e.x / t),
                      (this.y = e.y / t),
                      (this.z = e.z / t)),
                this
            );
        }
        setAxisAngleFromRotationMatrix(e) {
            let t,
                n,
                r,
                i,
                a = 0.01,
                o = 0.1,
                s = e.elements,
                c = s[0],
                l = s[4],
                u = s[8],
                d = s[1],
                f = s[5],
                p = s[9],
                m = s[2],
                h = s[6],
                g = s[10];
            if (
                Math.abs(l - d) < a &&
                Math.abs(u - m) < a &&
                Math.abs(p - h) < a
            ) {
                if (
                    Math.abs(l + d) < o &&
                    Math.abs(u + m) < o &&
                    Math.abs(p + h) < o &&
                    Math.abs(c + f + g - 3) < o
                )
                    return (this.set(1, 0, 0, 0), this);
                t = Math.PI;
                let e = (c + 1) / 2,
                    s = (f + 1) / 2,
                    _ = (g + 1) / 2,
                    v = (l + d) / 4,
                    y = (u + m) / 4,
                    b = (p + h) / 4;
                return (
                    e > s && e > _
                        ? e < a
                            ? ((n = 0), (r = 0.707106781), (i = 0.707106781))
                            : ((n = Math.sqrt(e)), (r = v / n), (i = y / n))
                        : s > _
                          ? s < a
                              ? ((n = 0.707106781), (r = 0), (i = 0.707106781))
                              : ((r = Math.sqrt(s)), (n = v / r), (i = b / r))
                          : _ < a
                            ? ((n = 0.707106781), (r = 0.707106781), (i = 0))
                            : ((i = Math.sqrt(_)), (n = y / i), (r = b / i)),
                    this.set(n, r, i, t),
                    this
                );
            }
            let _ = Math.sqrt(
                (h - p) * (h - p) + (u - m) * (u - m) + (d - l) * (d - l),
            );
            return (
                Math.abs(_) < 0.001 && (_ = 1),
                (this.x = (h - p) / _),
                (this.y = (u - m) / _),
                (this.z = (d - l) / _),
                (this.w = Math.acos((c + f + g - 1) / 2)),
                this
            );
        }
        setFromMatrixPosition(e) {
            let t = e.elements;
            return (
                (this.x = t[12]),
                (this.y = t[13]),
                (this.z = t[14]),
                (this.w = t[15]),
                this
            );
        }
        min(e) {
            return (
                (this.x = Math.min(this.x, e.x)),
                (this.y = Math.min(this.y, e.y)),
                (this.z = Math.min(this.z, e.z)),
                (this.w = Math.min(this.w, e.w)),
                this
            );
        }
        max(e) {
            return (
                (this.x = Math.max(this.x, e.x)),
                (this.y = Math.max(this.y, e.y)),
                (this.z = Math.max(this.z, e.z)),
                (this.w = Math.max(this.w, e.w)),
                this
            );
        }
        clamp(e, t) {
            return (
                (this.x = K(this.x, e.x, t.x)),
                (this.y = K(this.y, e.y, t.y)),
                (this.z = K(this.z, e.z, t.z)),
                (this.w = K(this.w, e.w, t.w)),
                this
            );
        }
        clampScalar(e, t) {
            return (
                (this.x = K(this.x, e, t)),
                (this.y = K(this.y, e, t)),
                (this.z = K(this.z, e, t)),
                (this.w = K(this.w, e, t)),
                this
            );
        }
        clampLength(e, t) {
            let n = this.length();
            return this.divideScalar(n || 1).multiplyScalar(K(n, e, t));
        }
        floor() {
            return (
                (this.x = Math.floor(this.x)),
                (this.y = Math.floor(this.y)),
                (this.z = Math.floor(this.z)),
                (this.w = Math.floor(this.w)),
                this
            );
        }
        ceil() {
            return (
                (this.x = Math.ceil(this.x)),
                (this.y = Math.ceil(this.y)),
                (this.z = Math.ceil(this.z)),
                (this.w = Math.ceil(this.w)),
                this
            );
        }
        round() {
            return (
                (this.x = Math.round(this.x)),
                (this.y = Math.round(this.y)),
                (this.z = Math.round(this.z)),
                (this.w = Math.round(this.w)),
                this
            );
        }
        roundToZero() {
            return (
                (this.x = Math.trunc(this.x)),
                (this.y = Math.trunc(this.y)),
                (this.z = Math.trunc(this.z)),
                (this.w = Math.trunc(this.w)),
                this
            );
        }
        negate() {
            return (
                (this.x = -this.x),
                (this.y = -this.y),
                (this.z = -this.z),
                (this.w = -this.w),
                this
            );
        }
        dot(e) {
            return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
        }
        lengthSq() {
            return (
                this.x * this.x +
                this.y * this.y +
                this.z * this.z +
                this.w * this.w
            );
        }
        length() {
            return Math.sqrt(
                this.x * this.x +
                    this.y * this.y +
                    this.z * this.z +
                    this.w * this.w,
            );
        }
        manhattanLength() {
            return (
                Math.abs(this.x) +
                Math.abs(this.y) +
                Math.abs(this.z) +
                Math.abs(this.w)
            );
        }
        normalize() {
            return this.divideScalar(this.length() || 1);
        }
        setLength(e) {
            return this.normalize().multiplyScalar(e);
        }
        lerp(e, t) {
            return (
                (this.x += (e.x - this.x) * t),
                (this.y += (e.y - this.y) * t),
                (this.z += (e.z - this.z) * t),
                (this.w += (e.w - this.w) * t),
                this
            );
        }
        lerpVectors(e, t, n) {
            return (
                (this.x = e.x + (t.x - e.x) * n),
                (this.y = e.y + (t.y - e.y) * n),
                (this.z = e.z + (t.z - e.z) * n),
                (this.w = e.w + (t.w - e.w) * n),
                this
            );
        }
        equals(e) {
            return (
                e.x === this.x &&
                e.y === this.y &&
                e.z === this.z &&
                e.w === this.w
            );
        }
        fromArray(e, t = 0) {
            return (
                (this.x = e[t]),
                (this.y = e[t + 1]),
                (this.z = e[t + 2]),
                (this.w = e[t + 3]),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this.x),
                (e[t + 1] = this.y),
                (e[t + 2] = this.z),
                (e[t + 3] = this.w),
                e
            );
        }
        fromBufferAttribute(e, t) {
            return (
                (this.x = e.getX(t)),
                (this.y = e.getY(t)),
                (this.z = e.getZ(t)),
                (this.w = e.getW(t)),
                this
            );
        }
        random() {
            return (
                (this.x = Math.random()),
                (this.y = Math.random()),
                (this.z = Math.random()),
                (this.w = Math.random()),
                this
            );
        }
        *[Symbol.iterator]() {
            (yield this.x, yield this.y, yield this.z, yield this.w);
        }
    },
    Mt = class extends at {
        constructor(e = 1, t = 1, n = {}) {
            (super(),
                (n = Object.assign(
                    {
                        generateMipmaps: !1,
                        internalFormat: null,
                        minFilter: m,
                        depthBuffer: !0,
                        stencilBuffer: !1,
                        resolveDepthBuffer: !0,
                        resolveStencilBuffer: !0,
                        depthTexture: null,
                        samples: 0,
                        count: 1,
                        depth: 1,
                        multiview: !1,
                    },
                    n,
                )),
                (this.isRenderTarget = !0),
                (this.width = e),
                (this.height = t),
                (this.depth = n.depth),
                (this.scissor = new jt(0, 0, e, t)),
                (this.scissorTest = !1),
                (this.viewport = new jt(0, 0, e, t)),
                (this.textures = []));
            let r = new At({ width: e, height: t, depth: n.depth }),
                i = n.count;
            for (let e = 0; e < i; e++)
                ((this.textures[e] = r.clone()),
                    (this.textures[e].isRenderTargetTexture = !0),
                    (this.textures[e].renderTarget = this));
            (this._setTextureOptions(n),
                (this.depthBuffer = n.depthBuffer),
                (this.stencilBuffer = n.stencilBuffer),
                (this.resolveDepthBuffer = n.resolveDepthBuffer),
                (this.resolveStencilBuffer = n.resolveStencilBuffer),
                (this._depthTexture = null),
                (this.depthTexture = n.depthTexture),
                (this.samples = n.samples),
                (this.multiview = n.multiview));
        }
        _setTextureOptions(e = {}) {
            let t = {
                minFilter: m,
                generateMipmaps: !1,
                flipY: !1,
                internalFormat: null,
            };
            (e.mapping !== void 0 && (t.mapping = e.mapping),
                e.wrapS !== void 0 && (t.wrapS = e.wrapS),
                e.wrapT !== void 0 && (t.wrapT = e.wrapT),
                e.wrapR !== void 0 && (t.wrapR = e.wrapR),
                e.magFilter !== void 0 && (t.magFilter = e.magFilter),
                e.minFilter !== void 0 && (t.minFilter = e.minFilter),
                e.format !== void 0 && (t.format = e.format),
                e.type !== void 0 && (t.type = e.type),
                e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy),
                e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace),
                e.flipY !== void 0 && (t.flipY = e.flipY),
                e.generateMipmaps !== void 0 &&
                    (t.generateMipmaps = e.generateMipmaps),
                e.internalFormat !== void 0 &&
                    (t.internalFormat = e.internalFormat));
            for (let e = 0; e < this.textures.length; e++)
                this.textures[e].setValues(t);
        }
        get texture() {
            return this.textures[0];
        }
        set texture(e) {
            this.textures[0] = e;
        }
        set depthTexture(e) {
            (this._depthTexture !== null &&
                (this._depthTexture.renderTarget = null),
                e !== null && (e.renderTarget = this),
                (this._depthTexture = e));
        }
        get depthTexture() {
            return this._depthTexture;
        }
        setSize(e, t, n = 1) {
            if (this.width !== e || this.height !== t || this.depth !== n) {
                ((this.width = e), (this.height = t), (this.depth = n));
                for (let r = 0, i = this.textures.length; r < i; r++)
                    ((this.textures[r].image.width = e),
                        (this.textures[r].image.height = t),
                        (this.textures[r].image.depth = n),
                        this.textures[r].isData3DTexture !== !0 &&
                            (this.textures[r].isArrayTexture =
                                this.textures[r].image.depth > 1));
                this.dispose();
            }
            (this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t));
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            ((this.width = e.width),
                (this.height = e.height),
                (this.depth = e.depth),
                this.scissor.copy(e.scissor),
                (this.scissorTest = e.scissorTest),
                this.viewport.copy(e.viewport),
                (this.textures.length = 0));
            for (let t = 0, n = e.textures.length; t < n; t++) {
                ((this.textures[t] = e.textures[t].clone()),
                    (this.textures[t].isRenderTargetTexture = !0),
                    (this.textures[t].renderTarget = this));
                let n = Object.assign({}, e.textures[t].image);
                this.textures[t].source = new Et(n);
            }
            return (
                (this.depthBuffer = e.depthBuffer),
                (this.stencilBuffer = e.stencilBuffer),
                (this.resolveDepthBuffer = e.resolveDepthBuffer),
                (this.resolveStencilBuffer = e.resolveStencilBuffer),
                e.depthTexture !== null &&
                    (this.depthTexture = e.depthTexture.clone()),
                (this.samples = e.samples),
                (this.multiview = e.multiview),
                this
            );
        }
        dispose() {
            this.dispatchEvent({ type: `dispose` });
        }
    },
    Nt = class extends Mt {
        constructor(e = 1, t = 1, n = {}) {
            (super(e, t, n), (this.isWebGLRenderTarget = !0));
        }
    },
    Pt = class extends At {
        constructor(e = null, t = 1, n = 1, r = 1) {
            (super(null),
                (this.isDataArrayTexture = !0),
                (this.image = { data: e, width: t, height: n, depth: r }),
                (this.magFilter = d),
                (this.minFilter = d),
                (this.wrapR = l),
                (this.generateMipmaps = !1),
                (this.flipY = !1),
                (this.unpackAlignment = 1),
                (this.layerUpdates = new Set()));
        }
        addLayerUpdate(e) {
            this.layerUpdates.add(e);
        }
        clearLayerUpdates() {
            this.layerUpdates.clear();
        }
    },
    Ft = class extends At {
        constructor(e = null, t = 1, n = 1, r = 1) {
            (super(null),
                (this.isData3DTexture = !0),
                (this.image = { data: e, width: t, height: n, depth: r }),
                (this.magFilter = d),
                (this.minFilter = d),
                (this.wrapR = l),
                (this.generateMipmaps = !1),
                (this.flipY = !1),
                (this.unpackAlignment = 1));
        }
    },
    It = class e {
        static {
            e.prototype.isMatrix4 = !0;
        }
        constructor(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
            ((this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                e !== void 0 &&
                    this.set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h));
        }
        set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
            let g = this.elements;
            return (
                (g[0] = e),
                (g[4] = t),
                (g[8] = n),
                (g[12] = r),
                (g[1] = i),
                (g[5] = a),
                (g[9] = o),
                (g[13] = s),
                (g[2] = c),
                (g[6] = l),
                (g[10] = u),
                (g[14] = d),
                (g[3] = f),
                (g[7] = p),
                (g[11] = m),
                (g[15] = h),
                this
            );
        }
        identity() {
            return (
                this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1),
                this
            );
        }
        clone() {
            return new e().fromArray(this.elements);
        }
        copy(e) {
            let t = this.elements,
                n = e.elements;
            return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[3]),
                (t[4] = n[4]),
                (t[5] = n[5]),
                (t[6] = n[6]),
                (t[7] = n[7]),
                (t[8] = n[8]),
                (t[9] = n[9]),
                (t[10] = n[10]),
                (t[11] = n[11]),
                (t[12] = n[12]),
                (t[13] = n[13]),
                (t[14] = n[14]),
                (t[15] = n[15]),
                this
            );
        }
        copyPosition(e) {
            let t = this.elements,
                n = e.elements;
            return ((t[12] = n[12]), (t[13] = n[13]), (t[14] = n[14]), this);
        }
        setFromMatrix3(e) {
            let t = e.elements;
            return (
                this.set(
                    t[0],
                    t[3],
                    t[6],
                    0,
                    t[1],
                    t[4],
                    t[7],
                    0,
                    t[2],
                    t[5],
                    t[8],
                    0,
                    0,
                    0,
                    0,
                    1,
                ),
                this
            );
        }
        extractBasis(e, t, n) {
            return this.determinant() === 0
                ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this)
                : (e.setFromMatrixColumn(this, 0),
                  t.setFromMatrixColumn(this, 1),
                  n.setFromMatrixColumn(this, 2),
                  this);
        }
        makeBasis(e, t, n) {
            return (
                this.set(
                    e.x,
                    t.x,
                    n.x,
                    0,
                    e.y,
                    t.y,
                    n.y,
                    0,
                    e.z,
                    t.z,
                    n.z,
                    0,
                    0,
                    0,
                    0,
                    1,
                ),
                this
            );
        }
        extractRotation(e) {
            if (e.determinant() === 0) return this.identity();
            let t = this.elements,
                n = e.elements,
                r = 1 / Lt.setFromMatrixColumn(e, 0).length(),
                i = 1 / Lt.setFromMatrixColumn(e, 1).length(),
                a = 1 / Lt.setFromMatrixColumn(e, 2).length();
            return (
                (t[0] = n[0] * r),
                (t[1] = n[1] * r),
                (t[2] = n[2] * r),
                (t[3] = 0),
                (t[4] = n[4] * i),
                (t[5] = n[5] * i),
                (t[6] = n[6] * i),
                (t[7] = 0),
                (t[8] = n[8] * a),
                (t[9] = n[9] * a),
                (t[10] = n[10] * a),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                this
            );
        }
        makeRotationFromEuler(e) {
            let t = this.elements,
                n = e.x,
                r = e.y,
                i = e.z,
                a = Math.cos(n),
                o = Math.sin(n),
                s = Math.cos(r),
                c = Math.sin(r),
                l = Math.cos(i),
                u = Math.sin(i);
            if (e.order === `XYZ`) {
                let e = a * l,
                    n = a * u,
                    r = o * l,
                    i = o * u;
                ((t[0] = s * l),
                    (t[4] = -s * u),
                    (t[8] = c),
                    (t[1] = n + r * c),
                    (t[5] = e - i * c),
                    (t[9] = -o * s),
                    (t[2] = i - e * c),
                    (t[6] = r + n * c),
                    (t[10] = a * s));
            } else if (e.order === `YXZ`) {
                let e = s * l,
                    n = s * u,
                    r = c * l,
                    i = c * u;
                ((t[0] = e + i * o),
                    (t[4] = r * o - n),
                    (t[8] = a * c),
                    (t[1] = a * u),
                    (t[5] = a * l),
                    (t[9] = -o),
                    (t[2] = n * o - r),
                    (t[6] = i + e * o),
                    (t[10] = a * s));
            } else if (e.order === `ZXY`) {
                let e = s * l,
                    n = s * u,
                    r = c * l,
                    i = c * u;
                ((t[0] = e - i * o),
                    (t[4] = -a * u),
                    (t[8] = r + n * o),
                    (t[1] = n + r * o),
                    (t[5] = a * l),
                    (t[9] = i - e * o),
                    (t[2] = -a * c),
                    (t[6] = o),
                    (t[10] = a * s));
            } else if (e.order === `ZYX`) {
                let e = a * l,
                    n = a * u,
                    r = o * l,
                    i = o * u;
                ((t[0] = s * l),
                    (t[4] = r * c - n),
                    (t[8] = e * c + i),
                    (t[1] = s * u),
                    (t[5] = i * c + e),
                    (t[9] = n * c - r),
                    (t[2] = -c),
                    (t[6] = o * s),
                    (t[10] = a * s));
            } else if (e.order === `YZX`) {
                let e = a * s,
                    n = a * c,
                    r = o * s,
                    i = o * c;
                ((t[0] = s * l),
                    (t[4] = i - e * u),
                    (t[8] = r * u + n),
                    (t[1] = u),
                    (t[5] = a * l),
                    (t[9] = -o * l),
                    (t[2] = -c * l),
                    (t[6] = n * u + r),
                    (t[10] = e - i * u));
            } else if (e.order === `XZY`) {
                let e = a * s,
                    n = a * c,
                    r = o * s,
                    i = o * c;
                ((t[0] = s * l),
                    (t[4] = -u),
                    (t[8] = c * l),
                    (t[1] = e * u + i),
                    (t[5] = a * l),
                    (t[9] = n * u - r),
                    (t[2] = r * u - n),
                    (t[6] = o * l),
                    (t[10] = i * u + e));
            }
            return (
                (t[3] = 0),
                (t[7] = 0),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                this
            );
        }
        makeRotationFromQuaternion(e) {
            return this.compose(zt, e, Bt);
        }
        lookAt(e, t, n) {
            let r = this.elements;
            return (
                Ut.subVectors(e, t),
                Ut.lengthSq() === 0 && (Ut.z = 1),
                Ut.normalize(),
                Vt.crossVectors(n, Ut),
                Vt.lengthSq() === 0 &&
                    (Math.abs(n.z) === 1 ? (Ut.x += 1e-4) : (Ut.z += 1e-4),
                    Ut.normalize(),
                    Vt.crossVectors(n, Ut)),
                Vt.normalize(),
                Ht.crossVectors(Ut, Vt),
                (r[0] = Vt.x),
                (r[4] = Ht.x),
                (r[8] = Ut.x),
                (r[1] = Vt.y),
                (r[5] = Ht.y),
                (r[9] = Ut.y),
                (r[2] = Vt.z),
                (r[6] = Ht.z),
                (r[10] = Ut.z),
                this
            );
        }
        multiply(e) {
            return this.multiplyMatrices(this, e);
        }
        premultiply(e) {
            return this.multiplyMatrices(e, this);
        }
        multiplyMatrices(e, t) {
            let n = e.elements,
                r = t.elements,
                i = this.elements,
                a = n[0],
                o = n[4],
                s = n[8],
                c = n[12],
                l = n[1],
                u = n[5],
                d = n[9],
                f = n[13],
                p = n[2],
                m = n[6],
                h = n[10],
                g = n[14],
                _ = n[3],
                v = n[7],
                y = n[11],
                b = n[15],
                x = r[0],
                S = r[4],
                C = r[8],
                w = r[12],
                T = r[1],
                E = r[5],
                D = r[9],
                O = r[13],
                k = r[2],
                A = r[6],
                j = r[10],
                M = r[14],
                N = r[3],
                ee = r[7],
                P = r[11],
                F = r[15];
            return (
                (i[0] = a * x + o * T + s * k + c * N),
                (i[4] = a * S + o * E + s * A + c * ee),
                (i[8] = a * C + o * D + s * j + c * P),
                (i[12] = a * w + o * O + s * M + c * F),
                (i[1] = l * x + u * T + d * k + f * N),
                (i[5] = l * S + u * E + d * A + f * ee),
                (i[9] = l * C + u * D + d * j + f * P),
                (i[13] = l * w + u * O + d * M + f * F),
                (i[2] = p * x + m * T + h * k + g * N),
                (i[6] = p * S + m * E + h * A + g * ee),
                (i[10] = p * C + m * D + h * j + g * P),
                (i[14] = p * w + m * O + h * M + g * F),
                (i[3] = _ * x + v * T + y * k + b * N),
                (i[7] = _ * S + v * E + y * A + b * ee),
                (i[11] = _ * C + v * D + y * j + b * P),
                (i[15] = _ * w + v * O + y * M + b * F),
                this
            );
        }
        multiplyScalar(e) {
            let t = this.elements;
            return (
                (t[0] *= e),
                (t[4] *= e),
                (t[8] *= e),
                (t[12] *= e),
                (t[1] *= e),
                (t[5] *= e),
                (t[9] *= e),
                (t[13] *= e),
                (t[2] *= e),
                (t[6] *= e),
                (t[10] *= e),
                (t[14] *= e),
                (t[3] *= e),
                (t[7] *= e),
                (t[11] *= e),
                (t[15] *= e),
                this
            );
        }
        determinant() {
            let e = this.elements,
                t = e[0],
                n = e[4],
                r = e[8],
                i = e[12],
                a = e[1],
                o = e[5],
                s = e[9],
                c = e[13],
                l = e[2],
                u = e[6],
                d = e[10],
                f = e[14],
                p = e[3],
                m = e[7],
                h = e[11],
                g = e[15],
                _ = s * f - c * d,
                v = o * f - c * u,
                y = o * d - s * u,
                b = a * f - c * l,
                x = a * d - s * l,
                S = a * u - o * l;
            return (
                t * (m * _ - h * v + g * y) -
                n * (p * _ - h * b + g * x) +
                r * (p * v - m * b + g * S) -
                i * (p * y - m * x + h * S)
            );
        }
        transpose() {
            let e = this.elements,
                t;
            return (
                (t = e[1]),
                (e[1] = e[4]),
                (e[4] = t),
                (t = e[2]),
                (e[2] = e[8]),
                (e[8] = t),
                (t = e[6]),
                (e[6] = e[9]),
                (e[9] = t),
                (t = e[3]),
                (e[3] = e[12]),
                (e[12] = t),
                (t = e[7]),
                (e[7] = e[13]),
                (e[13] = t),
                (t = e[11]),
                (e[11] = e[14]),
                (e[14] = t),
                this
            );
        }
        setPosition(e, t, n) {
            let r = this.elements;
            return (
                e.isVector3
                    ? ((r[12] = e.x), (r[13] = e.y), (r[14] = e.z))
                    : ((r[12] = e), (r[13] = t), (r[14] = n)),
                this
            );
        }
        invert() {
            let e = this.elements,
                t = e[0],
                n = e[1],
                r = e[2],
                i = e[3],
                a = e[4],
                o = e[5],
                s = e[6],
                c = e[7],
                l = e[8],
                u = e[9],
                d = e[10],
                f = e[11],
                p = e[12],
                m = e[13],
                h = e[14],
                g = e[15],
                _ = t * o - n * a,
                v = t * s - r * a,
                y = t * c - i * a,
                b = n * s - r * o,
                x = n * c - i * o,
                S = r * c - i * s,
                C = l * m - u * p,
                w = l * h - d * p,
                T = l * g - f * p,
                E = u * h - d * m,
                D = u * g - f * m,
                O = d * g - f * h,
                k = _ * O - v * D + y * E + b * T - x * w + S * C;
            if (k === 0)
                return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            let A = 1 / k;
            return (
                (e[0] = (o * O - s * D + c * E) * A),
                (e[1] = (r * D - n * O - i * E) * A),
                (e[2] = (m * S - h * x + g * b) * A),
                (e[3] = (d * x - u * S - f * b) * A),
                (e[4] = (s * T - a * O - c * w) * A),
                (e[5] = (t * O - r * T + i * w) * A),
                (e[6] = (h * y - p * S - g * v) * A),
                (e[7] = (l * S - d * y + f * v) * A),
                (e[8] = (a * D - o * T + c * C) * A),
                (e[9] = (n * T - t * D - i * C) * A),
                (e[10] = (p * x - m * y + g * _) * A),
                (e[11] = (u * y - l * x - f * _) * A),
                (e[12] = (o * w - a * E - s * C) * A),
                (e[13] = (t * E - n * w + r * C) * A),
                (e[14] = (m * v - p * b - h * _) * A),
                (e[15] = (l * b - u * v + d * _) * A),
                this
            );
        }
        scale(e) {
            let t = this.elements,
                n = e.x,
                r = e.y,
                i = e.z;
            return (
                (t[0] *= n),
                (t[4] *= r),
                (t[8] *= i),
                (t[1] *= n),
                (t[5] *= r),
                (t[9] *= i),
                (t[2] *= n),
                (t[6] *= r),
                (t[10] *= i),
                (t[3] *= n),
                (t[7] *= r),
                (t[11] *= i),
                this
            );
        }
        getMaxScaleOnAxis() {
            let e = this.elements,
                t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
                n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
                r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
            return Math.sqrt(Math.max(t, n, r));
        }
        makeTranslation(e, t, n) {
            return (
                e.isVector3
                    ? this.set(
                          1,
                          0,
                          0,
                          e.x,
                          0,
                          1,
                          0,
                          e.y,
                          0,
                          0,
                          1,
                          e.z,
                          0,
                          0,
                          0,
                          1,
                      )
                    : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1),
                this
            );
        }
        makeRotationX(e) {
            let t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1),
                this
            );
        }
        makeRotationY(e) {
            let t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1),
                this
            );
        }
        makeRotationZ(e) {
            let t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1),
                this
            );
        }
        makeRotationAxis(e, t) {
            let n = Math.cos(t),
                r = Math.sin(t),
                i = 1 - n,
                a = e.x,
                o = e.y,
                s = e.z,
                c = i * a,
                l = i * o;
            return (
                this.set(
                    c * a + n,
                    c * o - r * s,
                    c * s + r * o,
                    0,
                    c * o + r * s,
                    l * o + n,
                    l * s - r * a,
                    0,
                    c * s - r * o,
                    l * s + r * a,
                    i * s * s + n,
                    0,
                    0,
                    0,
                    0,
                    1,
                ),
                this
            );
        }
        makeScale(e, t, n) {
            return (
                this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1),
                this
            );
        }
        makeShear(e, t, n, r, i, a) {
            return (
                this.set(1, n, i, 0, e, 1, a, 0, t, r, 1, 0, 0, 0, 0, 1),
                this
            );
        }
        compose(e, t, n) {
            let r = this.elements,
                i = t._x,
                a = t._y,
                o = t._z,
                s = t._w,
                c = i + i,
                l = a + a,
                u = o + o,
                d = i * c,
                f = i * l,
                p = i * u,
                m = a * l,
                h = a * u,
                g = o * u,
                _ = s * c,
                v = s * l,
                y = s * u,
                b = n.x,
                x = n.y,
                S = n.z;
            return (
                (r[0] = (1 - (m + g)) * b),
                (r[1] = (f + y) * b),
                (r[2] = (p - v) * b),
                (r[3] = 0),
                (r[4] = (f - y) * x),
                (r[5] = (1 - (d + g)) * x),
                (r[6] = (h + _) * x),
                (r[7] = 0),
                (r[8] = (p + v) * S),
                (r[9] = (h - _) * S),
                (r[10] = (1 - (d + m)) * S),
                (r[11] = 0),
                (r[12] = e.x),
                (r[13] = e.y),
                (r[14] = e.z),
                (r[15] = 1),
                this
            );
        }
        decompose(e, t, n) {
            let r = this.elements;
            ((e.x = r[12]), (e.y = r[13]), (e.z = r[14]));
            let i = this.determinant();
            if (i === 0) return (n.set(1, 1, 1), t.identity(), this);
            let a = Lt.set(r[0], r[1], r[2]).length(),
                o = Lt.set(r[4], r[5], r[6]).length(),
                s = Lt.set(r[8], r[9], r[10]).length();
            (i < 0 && (a = -a), Rt.copy(this));
            let c = 1 / a,
                l = 1 / o,
                u = 1 / s;
            return (
                (Rt.elements[0] *= c),
                (Rt.elements[1] *= c),
                (Rt.elements[2] *= c),
                (Rt.elements[4] *= l),
                (Rt.elements[5] *= l),
                (Rt.elements[6] *= l),
                (Rt.elements[8] *= u),
                (Rt.elements[9] *= u),
                (Rt.elements[10] *= u),
                t.setFromRotationMatrix(Rt),
                (n.x = a),
                (n.y = o),
                (n.z = s),
                this
            );
        }
        makePerspective(e, t, n, r, i, a, o = qe, s = !1) {
            let c = this.elements,
                l = (2 * i) / (t - e),
                u = (2 * i) / (n - r),
                d = (t + e) / (t - e),
                f = (n + r) / (n - r),
                p,
                m;
            if (s) ((p = i / (a - i)), (m = (a * i) / (a - i)));
            else if (o === 2e3)
                ((p = -(a + i) / (a - i)), (m = (-2 * a * i) / (a - i)));
            else if (o === 2001) ((p = -a / (a - i)), (m = (-a * i) / (a - i)));
            else
                throw Error(
                    `THREE.Matrix4.makePerspective(): Invalid coordinate system: ` +
                        o,
                );
            return (
                (c[0] = l),
                (c[4] = 0),
                (c[8] = d),
                (c[12] = 0),
                (c[1] = 0),
                (c[5] = u),
                (c[9] = f),
                (c[13] = 0),
                (c[2] = 0),
                (c[6] = 0),
                (c[10] = p),
                (c[14] = m),
                (c[3] = 0),
                (c[7] = 0),
                (c[11] = -1),
                (c[15] = 0),
                this
            );
        }
        makeOrthographic(e, t, n, r, i, a, o = qe, s = !1) {
            let c = this.elements,
                l = 2 / (t - e),
                u = 2 / (n - r),
                d = -(t + e) / (t - e),
                f = -(n + r) / (n - r),
                p,
                m;
            if (s) ((p = 1 / (a - i)), (m = a / (a - i)));
            else if (o === 2e3) ((p = -2 / (a - i)), (m = -(a + i) / (a - i)));
            else if (o === 2001) ((p = -1 / (a - i)), (m = -i / (a - i)));
            else
                throw Error(
                    `THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ` +
                        o,
                );
            return (
                (c[0] = l),
                (c[4] = 0),
                (c[8] = 0),
                (c[12] = d),
                (c[1] = 0),
                (c[5] = u),
                (c[9] = 0),
                (c[13] = f),
                (c[2] = 0),
                (c[6] = 0),
                (c[10] = p),
                (c[14] = m),
                (c[3] = 0),
                (c[7] = 0),
                (c[11] = 0),
                (c[15] = 1),
                this
            );
        }
        equals(e) {
            let t = this.elements,
                n = e.elements;
            for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
            return !0;
        }
        fromArray(e, t = 0) {
            for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
            return this;
        }
        toArray(e = [], t = 0) {
            let n = this.elements;
            return (
                (e[t] = n[0]),
                (e[t + 1] = n[1]),
                (e[t + 2] = n[2]),
                (e[t + 3] = n[3]),
                (e[t + 4] = n[4]),
                (e[t + 5] = n[5]),
                (e[t + 6] = n[6]),
                (e[t + 7] = n[7]),
                (e[t + 8] = n[8]),
                (e[t + 9] = n[9]),
                (e[t + 10] = n[10]),
                (e[t + 11] = n[11]),
                (e[t + 12] = n[12]),
                (e[t + 13] = n[13]),
                (e[t + 14] = n[14]),
                (e[t + 15] = n[15]),
                e
            );
        }
    },
    Lt = new J(),
    Rt = new It(),
    zt = new J(0, 0, 0),
    Bt = new J(1, 1, 1),
    Vt = new J(),
    Ht = new J(),
    Ut = new J(),
    Wt = new It(),
    Gt = new mt(),
    Kt = class e {
        constructor(t = 0, n = 0, r = 0, i = e.DEFAULT_ORDER) {
            ((this.isEuler = !0),
                (this._x = t),
                (this._y = n),
                (this._z = r),
                (this._order = i));
        }
        get x() {
            return this._x;
        }
        set x(e) {
            ((this._x = e), this._onChangeCallback());
        }
        get y() {
            return this._y;
        }
        set y(e) {
            ((this._y = e), this._onChangeCallback());
        }
        get z() {
            return this._z;
        }
        set z(e) {
            ((this._z = e), this._onChangeCallback());
        }
        get order() {
            return this._order;
        }
        set order(e) {
            ((this._order = e), this._onChangeCallback());
        }
        set(e, t, n, r = this._order) {
            return (
                (this._x = e),
                (this._y = t),
                (this._z = n),
                (this._order = r),
                this._onChangeCallback(),
                this
            );
        }
        clone() {
            return new this.constructor(this._x, this._y, this._z, this._order);
        }
        copy(e) {
            return (
                (this._x = e._x),
                (this._y = e._y),
                (this._z = e._z),
                (this._order = e._order),
                this._onChangeCallback(),
                this
            );
        }
        setFromRotationMatrix(e, t = this._order, n = !0) {
            let r = e.elements,
                i = r[0],
                a = r[4],
                o = r[8],
                s = r[1],
                c = r[5],
                l = r[9],
                u = r[2],
                d = r[6],
                f = r[10];
            switch (t) {
                case `XYZ`:
                    ((this._y = Math.asin(K(o, -1, 1))),
                        Math.abs(o) < 0.9999999
                            ? ((this._x = Math.atan2(-l, f)),
                              (this._z = Math.atan2(-a, i)))
                            : ((this._x = Math.atan2(d, c)), (this._z = 0)));
                    break;
                case `YXZ`:
                    ((this._x = Math.asin(-K(l, -1, 1))),
                        Math.abs(l) < 0.9999999
                            ? ((this._y = Math.atan2(o, f)),
                              (this._z = Math.atan2(s, c)))
                            : ((this._y = Math.atan2(-u, i)), (this._z = 0)));
                    break;
                case `ZXY`:
                    ((this._x = Math.asin(K(d, -1, 1))),
                        Math.abs(d) < 0.9999999
                            ? ((this._y = Math.atan2(-u, f)),
                              (this._z = Math.atan2(-a, c)))
                            : ((this._y = 0), (this._z = Math.atan2(s, i))));
                    break;
                case `ZYX`:
                    ((this._y = Math.asin(-K(u, -1, 1))),
                        Math.abs(u) < 0.9999999
                            ? ((this._x = Math.atan2(d, f)),
                              (this._z = Math.atan2(s, i)))
                            : ((this._x = 0), (this._z = Math.atan2(-a, c))));
                    break;
                case `YZX`:
                    ((this._z = Math.asin(K(s, -1, 1))),
                        Math.abs(s) < 0.9999999
                            ? ((this._x = Math.atan2(-l, c)),
                              (this._y = Math.atan2(-u, i)))
                            : ((this._x = 0), (this._y = Math.atan2(o, f))));
                    break;
                case `XZY`:
                    ((this._z = Math.asin(-K(a, -1, 1))),
                        Math.abs(a) < 0.9999999
                            ? ((this._x = Math.atan2(d, c)),
                              (this._y = Math.atan2(o, i)))
                            : ((this._x = Math.atan2(-l, f)), (this._y = 0)));
                    break;
                default:
                    W(
                        `Euler: .setFromRotationMatrix() encountered an unknown order: ` +
                            t,
                    );
            }
            return (
                (this._order = t),
                n === !0 && this._onChangeCallback(),
                this
            );
        }
        setFromQuaternion(e, t, n) {
            return (
                Wt.makeRotationFromQuaternion(e),
                this.setFromRotationMatrix(Wt, t, n)
            );
        }
        setFromVector3(e, t = this._order) {
            return this.set(e.x, e.y, e.z, t);
        }
        reorder(e) {
            return (Gt.setFromEuler(this), this.setFromQuaternion(Gt, e));
        }
        equals(e) {
            return (
                e._x === this._x &&
                e._y === this._y &&
                e._z === this._z &&
                e._order === this._order
            );
        }
        fromArray(e) {
            return (
                (this._x = e[0]),
                (this._y = e[1]),
                (this._z = e[2]),
                e[3] !== void 0 && (this._order = e[3]),
                this._onChangeCallback(),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this._x),
                (e[t + 1] = this._y),
                (e[t + 2] = this._z),
                (e[t + 3] = this._order),
                e
            );
        }
        _onChange(e) {
            return ((this._onChangeCallback = e), this);
        }
        _onChangeCallback() {}
        *[Symbol.iterator]() {
            (yield this._x, yield this._y, yield this._z, yield this._order);
        }
    };
Kt.DEFAULT_ORDER = `XYZ`;
var qt = class {
        constructor() {
            this.mask = 1;
        }
        set(e) {
            this.mask = ((1 << e) | 0) >>> 0;
        }
        enable(e) {
            this.mask |= (1 << e) | 0;
        }
        enableAll() {
            this.mask = -1;
        }
        toggle(e) {
            this.mask ^= (1 << e) | 0;
        }
        disable(e) {
            this.mask &= ~((1 << e) | 0);
        }
        disableAll() {
            this.mask = 0;
        }
        test(e) {
            return (this.mask & e.mask) !== 0;
        }
        isEnabled(e) {
            return (this.mask & ((1 << e) | 0)) != 0;
        }
    },
    Jt = 0,
    Yt = new J(),
    Xt = new mt(),
    Zt = new It(),
    Qt = new J(),
    $t = new J(),
    en = new J(),
    tn = new mt(),
    nn = new J(1, 0, 0),
    rn = new J(0, 1, 0),
    an = new J(0, 0, 1),
    on = { type: `added` },
    sn = { type: `removed` },
    cn = { type: `childadded`, child: null },
    ln = { type: `childremoved`, child: null },
    un = class e extends at {
        constructor() {
            (super(),
                (this.isObject3D = !0),
                Object.defineProperty(this, "id", { value: Jt++ }),
                (this.uuid = lt()),
                (this.name = ``),
                (this.type = `Object3D`),
                (this.parent = null),
                (this.children = []),
                (this.up = e.DEFAULT_UP.clone()));
            let t = new J(),
                n = new Kt(),
                r = new mt(),
                i = new J(1, 1, 1);
            function a() {
                r.setFromEuler(n, !1);
            }
            function o() {
                n.setFromQuaternion(r, void 0, !1);
            }
            (n._onChange(a),
                r._onChange(o),
                Object.defineProperties(this, {
                    position: { configurable: !0, enumerable: !0, value: t },
                    rotation: { configurable: !0, enumerable: !0, value: n },
                    quaternion: { configurable: !0, enumerable: !0, value: r },
                    scale: { configurable: !0, enumerable: !0, value: i },
                    modelViewMatrix: { value: new It() },
                    normalMatrix: { value: new Y() },
                }),
                (this.matrix = new It()),
                (this.matrixWorld = new It()),
                (this.matrixAutoUpdate = e.DEFAULT_MATRIX_AUTO_UPDATE),
                (this.matrixWorldAutoUpdate =
                    e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
                (this.matrixWorldNeedsUpdate = !1),
                (this.layers = new qt()),
                (this.visible = !0),
                (this.castShadow = !1),
                (this.receiveShadow = !1),
                (this.frustumCulled = !0),
                (this.renderOrder = 0),
                (this.animations = []),
                (this.customDepthMaterial = void 0),
                (this.customDistanceMaterial = void 0),
                (this.static = !1),
                (this.userData = {}),
                (this.pivot = null));
        }
        onBeforeShadow() {}
        onAfterShadow() {}
        onBeforeRender() {}
        onAfterRender() {}
        applyMatrix4(e) {
            (this.matrixAutoUpdate && this.updateMatrix(),
                this.matrix.premultiply(e),
                this.matrix.decompose(
                    this.position,
                    this.quaternion,
                    this.scale,
                ));
        }
        applyQuaternion(e) {
            return (this.quaternion.premultiply(e), this);
        }
        setRotationFromAxisAngle(e, t) {
            this.quaternion.setFromAxisAngle(e, t);
        }
        setRotationFromEuler(e) {
            this.quaternion.setFromEuler(e, !0);
        }
        setRotationFromMatrix(e) {
            this.quaternion.setFromRotationMatrix(e);
        }
        setRotationFromQuaternion(e) {
            this.quaternion.copy(e);
        }
        rotateOnAxis(e, t) {
            return (
                Xt.setFromAxisAngle(e, t),
                this.quaternion.multiply(Xt),
                this
            );
        }
        rotateOnWorldAxis(e, t) {
            return (
                Xt.setFromAxisAngle(e, t),
                this.quaternion.premultiply(Xt),
                this
            );
        }
        rotateX(e) {
            return this.rotateOnAxis(nn, e);
        }
        rotateY(e) {
            return this.rotateOnAxis(rn, e);
        }
        rotateZ(e) {
            return this.rotateOnAxis(an, e);
        }
        translateOnAxis(e, t) {
            return (
                Yt.copy(e).applyQuaternion(this.quaternion),
                this.position.add(Yt.multiplyScalar(t)),
                this
            );
        }
        translateX(e) {
            return this.translateOnAxis(nn, e);
        }
        translateY(e) {
            return this.translateOnAxis(rn, e);
        }
        translateZ(e) {
            return this.translateOnAxis(an, e);
        }
        localToWorld(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                e.applyMatrix4(this.matrixWorld)
            );
        }
        worldToLocal(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                e.applyMatrix4(Zt.copy(this.matrixWorld).invert())
            );
        }
        lookAt(e, t, n) {
            e.isVector3 ? Qt.copy(e) : Qt.set(e, t, n);
            let r = this.parent;
            (this.updateWorldMatrix(!0, !1),
                $t.setFromMatrixPosition(this.matrixWorld),
                this.isCamera || this.isLight
                    ? Zt.lookAt($t, Qt, this.up)
                    : Zt.lookAt(Qt, $t, this.up),
                this.quaternion.setFromRotationMatrix(Zt),
                r &&
                    (Zt.extractRotation(r.matrixWorld),
                    Xt.setFromRotationMatrix(Zt),
                    this.quaternion.premultiply(Xt.invert())));
        }
        add(e) {
            if (arguments.length > 1) {
                for (let e = 0; e < arguments.length; e++)
                    this.add(arguments[e]);
                return this;
            }
            return e === this
                ? (G(
                      `Object3D.add: object can't be added as a child of itself.`,
                      e,
                  ),
                  this)
                : (e && e.isObject3D
                      ? (e.removeFromParent(),
                        (e.parent = this),
                        this.children.push(e),
                        e.dispatchEvent(on),
                        (cn.child = e),
                        this.dispatchEvent(cn),
                        (cn.child = null))
                      : G(
                            `Object3D.add: object not an instance of THREE.Object3D.`,
                            e,
                        ),
                  this);
        }
        remove(e) {
            if (arguments.length > 1) {
                for (let e = 0; e < arguments.length; e++)
                    this.remove(arguments[e]);
                return this;
            }
            let t = this.children.indexOf(e);
            return (
                t !== -1 &&
                    ((e.parent = null),
                    this.children.splice(t, 1),
                    e.dispatchEvent(sn),
                    (ln.child = e),
                    this.dispatchEvent(ln),
                    (ln.child = null)),
                this
            );
        }
        removeFromParent() {
            let e = this.parent;
            return (e !== null && e.remove(this), this);
        }
        clear() {
            return this.remove(...this.children);
        }
        attach(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                Zt.copy(this.matrixWorld).invert(),
                e.parent !== null &&
                    (e.parent.updateWorldMatrix(!0, !1),
                    Zt.multiply(e.parent.matrixWorld)),
                e.applyMatrix4(Zt),
                e.removeFromParent(),
                (e.parent = this),
                this.children.push(e),
                e.updateWorldMatrix(!1, !0),
                e.dispatchEvent(on),
                (cn.child = e),
                this.dispatchEvent(cn),
                (cn.child = null),
                this
            );
        }
        getObjectById(e) {
            return this.getObjectByProperty(`id`, e);
        }
        getObjectByName(e) {
            return this.getObjectByProperty(`name`, e);
        }
        getObjectByProperty(e, t) {
            if (this[e] === t) return this;
            for (let n = 0, r = this.children.length; n < r; n++) {
                let r = this.children[n].getObjectByProperty(e, t);
                if (r !== void 0) return r;
            }
        }
        getObjectsByProperty(e, t, n = []) {
            this[e] === t && n.push(this);
            let r = this.children;
            for (let i = 0, a = r.length; i < a; i++)
                r[i].getObjectsByProperty(e, t, n);
            return n;
        }
        getWorldPosition(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                e.setFromMatrixPosition(this.matrixWorld)
            );
        }
        getWorldQuaternion(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                this.matrixWorld.decompose($t, e, en),
                e
            );
        }
        getWorldScale(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                this.matrixWorld.decompose($t, tn, e),
                e
            );
        }
        getWorldDirection(e) {
            this.updateWorldMatrix(!0, !1);
            let t = this.matrixWorld.elements;
            return e.set(t[8], t[9], t[10]).normalize();
        }
        raycast() {}
        traverse(e) {
            e(this);
            let t = this.children;
            for (let n = 0, r = t.length; n < r; n++) t[n].traverse(e);
        }
        traverseVisible(e) {
            if (this.visible === !1) return;
            e(this);
            let t = this.children;
            for (let n = 0, r = t.length; n < r; n++) t[n].traverseVisible(e);
        }
        traverseAncestors(e) {
            let t = this.parent;
            t !== null && (e(t), t.traverseAncestors(e));
        }
        updateMatrix() {
            this.matrix.compose(this.position, this.quaternion, this.scale);
            let e = this.pivot;
            if (e !== null) {
                let t = e.x,
                    n = e.y,
                    r = e.z,
                    i = this.matrix.elements;
                ((i[12] += t - i[0] * t - i[4] * n - i[8] * r),
                    (i[13] += n - i[1] * t - i[5] * n - i[9] * r),
                    (i[14] += r - i[2] * t - i[6] * n - i[10] * r));
            }
            this.matrixWorldNeedsUpdate = !0;
        }
        updateMatrixWorld(e) {
            (this.matrixAutoUpdate && this.updateMatrix(),
                (this.matrixWorldNeedsUpdate || e) &&
                    (this.matrixWorldAutoUpdate === !0 &&
                        (this.parent === null
                            ? this.matrixWorld.copy(this.matrix)
                            : this.matrixWorld.multiplyMatrices(
                                  this.parent.matrixWorld,
                                  this.matrix,
                              )),
                    (this.matrixWorldNeedsUpdate = !1),
                    (e = !0)));
            let t = this.children;
            for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
        }
        updateWorldMatrix(e, t) {
            let n = this.parent;
            if (
                (e === !0 && n !== null && n.updateWorldMatrix(!0, !1),
                this.matrixAutoUpdate && this.updateMatrix(),
                this.matrixWorldAutoUpdate === !0 &&
                    (this.parent === null
                        ? this.matrixWorld.copy(this.matrix)
                        : this.matrixWorld.multiplyMatrices(
                              this.parent.matrixWorld,
                              this.matrix,
                          )),
                t === !0)
            ) {
                let e = this.children;
                for (let t = 0, n = e.length; t < n; t++)
                    e[t].updateWorldMatrix(!1, !0);
            }
        }
        toJSON(e) {
            let t = e === void 0 || typeof e == `string`,
                n = {};
            t &&
                ((e = {
                    geometries: {},
                    materials: {},
                    textures: {},
                    images: {},
                    shapes: {},
                    skeletons: {},
                    animations: {},
                    nodes: {},
                }),
                (n.metadata = {
                    version: 4.7,
                    type: `Object`,
                    generator: `Object3D.toJSON`,
                }));
            let r = {};
            ((r.uuid = this.uuid),
                (r.type = this.type),
                this.name !== `` && (r.name = this.name),
                this.castShadow === !0 && (r.castShadow = !0),
                this.receiveShadow === !0 && (r.receiveShadow = !0),
                this.visible === !1 && (r.visible = !1),
                this.frustumCulled === !1 && (r.frustumCulled = !1),
                this.renderOrder !== 0 && (r.renderOrder = this.renderOrder),
                this.static !== !1 && (r.static = this.static),
                Object.keys(this.userData).length > 0 &&
                    (r.userData = this.userData),
                (r.layers = this.layers.mask),
                (r.matrix = this.matrix.toArray()),
                (r.up = this.up.toArray()),
                this.pivot !== null && (r.pivot = this.pivot.toArray()),
                this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1),
                this.morphTargetDictionary !== void 0 &&
                    (r.morphTargetDictionary = Object.assign(
                        {},
                        this.morphTargetDictionary,
                    )),
                this.morphTargetInfluences !== void 0 &&
                    (r.morphTargetInfluences =
                        this.morphTargetInfluences.slice()),
                this.isInstancedMesh &&
                    ((r.type = `InstancedMesh`),
                    (r.count = this.count),
                    (r.instanceMatrix = this.instanceMatrix.toJSON()),
                    this.instanceColor !== null &&
                        (r.instanceColor = this.instanceColor.toJSON())),
                this.isBatchedMesh &&
                    ((r.type = `BatchedMesh`),
                    (r.perObjectFrustumCulled = this.perObjectFrustumCulled),
                    (r.sortObjects = this.sortObjects),
                    (r.drawRanges = this._drawRanges),
                    (r.reservedRanges = this._reservedRanges),
                    (r.geometryInfo = this._geometryInfo.map((e) => ({
                        ...e,
                        boundingBox: e.boundingBox
                            ? e.boundingBox.toJSON()
                            : void 0,
                        boundingSphere: e.boundingSphere
                            ? e.boundingSphere.toJSON()
                            : void 0,
                    }))),
                    (r.instanceInfo = this._instanceInfo.map((e) => ({
                        ...e,
                    }))),
                    (r.availableInstanceIds =
                        this._availableInstanceIds.slice()),
                    (r.availableGeometryIds =
                        this._availableGeometryIds.slice()),
                    (r.nextIndexStart = this._nextIndexStart),
                    (r.nextVertexStart = this._nextVertexStart),
                    (r.geometryCount = this._geometryCount),
                    (r.maxInstanceCount = this._maxInstanceCount),
                    (r.maxVertexCount = this._maxVertexCount),
                    (r.maxIndexCount = this._maxIndexCount),
                    (r.geometryInitialized = this._geometryInitialized),
                    (r.matricesTexture = this._matricesTexture.toJSON(e)),
                    (r.indirectTexture = this._indirectTexture.toJSON(e)),
                    this._colorsTexture !== null &&
                        (r.colorsTexture = this._colorsTexture.toJSON(e)),
                    this.boundingSphere !== null &&
                        (r.boundingSphere = this.boundingSphere.toJSON()),
                    this.boundingBox !== null &&
                        (r.boundingBox = this.boundingBox.toJSON())));
            function i(t, n) {
                return (
                    t[n.uuid] === void 0 && (t[n.uuid] = n.toJSON(e)),
                    n.uuid
                );
            }
            if (this.isScene)
                (this.background &&
                    (this.background.isColor
                        ? (r.background = this.background.toJSON())
                        : this.background.isTexture &&
                          (r.background = this.background.toJSON(e).uuid)),
                    this.environment &&
                        this.environment.isTexture &&
                        this.environment.isRenderTargetTexture !== !0 &&
                        (r.environment = this.environment.toJSON(e).uuid));
            else if (this.isMesh || this.isLine || this.isPoints) {
                r.geometry = i(e.geometries, this.geometry);
                let t = this.geometry.parameters;
                if (t !== void 0 && t.shapes !== void 0) {
                    let n = t.shapes;
                    if (Array.isArray(n))
                        for (let t = 0, r = n.length; t < r; t++) {
                            let r = n[t];
                            i(e.shapes, r);
                        }
                    else i(e.shapes, n);
                }
            }
            if (
                (this.isSkinnedMesh &&
                    ((r.bindMode = this.bindMode),
                    (r.bindMatrix = this.bindMatrix.toArray()),
                    this.skeleton !== void 0 &&
                        (i(e.skeletons, this.skeleton),
                        (r.skeleton = this.skeleton.uuid))),
                this.material !== void 0)
            )
                if (Array.isArray(this.material)) {
                    let t = [];
                    for (let n = 0, r = this.material.length; n < r; n++)
                        t.push(i(e.materials, this.material[n]));
                    r.material = t;
                } else r.material = i(e.materials, this.material);
            if (this.children.length > 0) {
                r.children = [];
                for (let t = 0; t < this.children.length; t++)
                    r.children.push(this.children[t].toJSON(e).object);
            }
            if (this.animations.length > 0) {
                r.animations = [];
                for (let t = 0; t < this.animations.length; t++) {
                    let n = this.animations[t];
                    r.animations.push(i(e.animations, n));
                }
            }
            if (t) {
                let t = a(e.geometries),
                    r = a(e.materials),
                    i = a(e.textures),
                    o = a(e.images),
                    s = a(e.shapes),
                    c = a(e.skeletons),
                    l = a(e.animations),
                    u = a(e.nodes);
                (t.length > 0 && (n.geometries = t),
                    r.length > 0 && (n.materials = r),
                    i.length > 0 && (n.textures = i),
                    o.length > 0 && (n.images = o),
                    s.length > 0 && (n.shapes = s),
                    c.length > 0 && (n.skeletons = c),
                    l.length > 0 && (n.animations = l),
                    u.length > 0 && (n.nodes = u));
            }
            return ((n.object = r), n);
            function a(e) {
                let t = [];
                for (let n in e) {
                    let r = e[n];
                    (delete r.metadata, t.push(r));
                }
                return t;
            }
        }
        clone(e) {
            return new this.constructor().copy(this, e);
        }
        copy(e, t = !0) {
            if (
                ((this.name = e.name),
                this.up.copy(e.up),
                this.position.copy(e.position),
                (this.rotation.order = e.rotation.order),
                this.quaternion.copy(e.quaternion),
                this.scale.copy(e.scale),
                (this.pivot = e.pivot === null ? null : e.pivot.clone()),
                this.matrix.copy(e.matrix),
                this.matrixWorld.copy(e.matrixWorld),
                (this.matrixAutoUpdate = e.matrixAutoUpdate),
                (this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate),
                (this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate),
                (this.layers.mask = e.layers.mask),
                (this.visible = e.visible),
                (this.castShadow = e.castShadow),
                (this.receiveShadow = e.receiveShadow),
                (this.frustumCulled = e.frustumCulled),
                (this.renderOrder = e.renderOrder),
                (this.static = e.static),
                (this.animations = e.animations.slice()),
                (this.userData = JSON.parse(JSON.stringify(e.userData))),
                t === !0)
            )
                for (let t = 0; t < e.children.length; t++) {
                    let n = e.children[t];
                    this.add(n.clone());
                }
            return this;
        }
    };
((un.DEFAULT_UP = new J(0, 1, 0)),
    (un.DEFAULT_MATRIX_AUTO_UPDATE = !0),
    (un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0));
var dn = class extends un {
        constructor() {
            (super(), (this.isGroup = !0), (this.type = `Group`));
        }
    },
    fn = { type: `move` },
    pn = class {
        constructor() {
            ((this._targetRay = null),
                (this._grip = null),
                (this._hand = null));
        }
        getHandSpace() {
            return (
                this._hand === null &&
                    ((this._hand = new dn()),
                    (this._hand.matrixAutoUpdate = !1),
                    (this._hand.visible = !1),
                    (this._hand.joints = {}),
                    (this._hand.inputState = { pinching: !1 })),
                this._hand
            );
        }
        getTargetRaySpace() {
            return (
                this._targetRay === null &&
                    ((this._targetRay = new dn()),
                    (this._targetRay.matrixAutoUpdate = !1),
                    (this._targetRay.visible = !1),
                    (this._targetRay.hasLinearVelocity = !1),
                    (this._targetRay.linearVelocity = new J()),
                    (this._targetRay.hasAngularVelocity = !1),
                    (this._targetRay.angularVelocity = new J())),
                this._targetRay
            );
        }
        getGripSpace() {
            return (
                this._grip === null &&
                    ((this._grip = new dn()),
                    (this._grip.matrixAutoUpdate = !1),
                    (this._grip.visible = !1),
                    (this._grip.hasLinearVelocity = !1),
                    (this._grip.linearVelocity = new J()),
                    (this._grip.hasAngularVelocity = !1),
                    (this._grip.angularVelocity = new J()),
                    (this._grip.eventsEnabled = !1)),
                this._grip
            );
        }
        dispatchEvent(e) {
            return (
                this._targetRay !== null && this._targetRay.dispatchEvent(e),
                this._grip !== null && this._grip.dispatchEvent(e),
                this._hand !== null && this._hand.dispatchEvent(e),
                this
            );
        }
        connect(e) {
            if (e && e.hand) {
                let t = this._hand;
                if (t) for (let n of e.hand.values()) this._getHandJoint(t, n);
            }
            return (this.dispatchEvent({ type: `connected`, data: e }), this);
        }
        disconnect(e) {
            return (
                this.dispatchEvent({ type: `disconnected`, data: e }),
                this._targetRay !== null && (this._targetRay.visible = !1),
                this._grip !== null && (this._grip.visible = !1),
                this._hand !== null && (this._hand.visible = !1),
                this
            );
        }
        update(e, t, n) {
            let r = null,
                i = null,
                a = null,
                o = this._targetRay,
                s = this._grip,
                c = this._hand;
            if (e && t.session.visibilityState !== `visible-blurred`) {
                if (c && e.hand) {
                    a = !0;
                    for (let r of e.hand.values()) {
                        let e = t.getJointPose(r, n),
                            i = this._getHandJoint(c, r);
                        (e !== null &&
                            (i.matrix.fromArray(e.transform.matrix),
                            i.matrix.decompose(i.position, i.rotation, i.scale),
                            (i.matrixWorldNeedsUpdate = !0),
                            (i.jointRadius = e.radius)),
                            (i.visible = e !== null));
                    }
                    let r = c.joints[`index-finger-tip`],
                        i = c.joints[`thumb-tip`],
                        o = r.position.distanceTo(i.position);
                    c.inputState.pinching && o > 0.025
                        ? ((c.inputState.pinching = !1),
                          this.dispatchEvent({
                              type: `pinchend`,
                              handedness: e.handedness,
                              target: this,
                          }))
                        : !c.inputState.pinching &&
                          o <= 0.015 &&
                          ((c.inputState.pinching = !0),
                          this.dispatchEvent({
                              type: `pinchstart`,
                              handedness: e.handedness,
                              target: this,
                          }));
                } else
                    s !== null &&
                        e.gripSpace &&
                        ((i = t.getPose(e.gripSpace, n)),
                        i !== null &&
                            (s.matrix.fromArray(i.transform.matrix),
                            s.matrix.decompose(s.position, s.rotation, s.scale),
                            (s.matrixWorldNeedsUpdate = !0),
                            i.linearVelocity
                                ? ((s.hasLinearVelocity = !0),
                                  s.linearVelocity.copy(i.linearVelocity))
                                : (s.hasLinearVelocity = !1),
                            i.angularVelocity
                                ? ((s.hasAngularVelocity = !0),
                                  s.angularVelocity.copy(i.angularVelocity))
                                : (s.hasAngularVelocity = !1),
                            s.eventsEnabled &&
                                s.dispatchEvent({
                                    type: `gripUpdated`,
                                    data: e,
                                    target: this,
                                })));
                o !== null &&
                    ((r = t.getPose(e.targetRaySpace, n)),
                    r === null && i !== null && (r = i),
                    r !== null &&
                        (o.matrix.fromArray(r.transform.matrix),
                        o.matrix.decompose(o.position, o.rotation, o.scale),
                        (o.matrixWorldNeedsUpdate = !0),
                        r.linearVelocity
                            ? ((o.hasLinearVelocity = !0),
                              o.linearVelocity.copy(r.linearVelocity))
                            : (o.hasLinearVelocity = !1),
                        r.angularVelocity
                            ? ((o.hasAngularVelocity = !0),
                              o.angularVelocity.copy(r.angularVelocity))
                            : (o.hasAngularVelocity = !1),
                        this.dispatchEvent(fn)));
            }
            return (
                o !== null && (o.visible = r !== null),
                s !== null && (s.visible = i !== null),
                c !== null && (c.visible = a !== null),
                this
            );
        }
        _getHandJoint(e, t) {
            if (e.joints[t.jointName] === void 0) {
                let n = new dn();
                ((n.matrixAutoUpdate = !1),
                    (n.visible = !1),
                    (e.joints[t.jointName] = n),
                    e.add(n));
            }
            return e.joints[t.jointName];
        }
    },
    mn = {
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074,
    },
    hn = { h: 0, s: 0, l: 0 },
    gn = { h: 0, s: 0, l: 0 };
function _n(e, t, n) {
    return (
        n < 0 && (n += 1),
        n > 1 && --n,
        n < 1 / 6
            ? e + (t - e) * 6 * n
            : n < 1 / 2
              ? t
              : n < 2 / 3
                ? e + (t - e) * 6 * (2 / 3 - n)
                : e
    );
}
var Z = class {
        constructor(e, t, n) {
            return (
                (this.isColor = !0),
                (this.r = 1),
                (this.g = 1),
                (this.b = 1),
                this.set(e, t, n)
            );
        }
        set(e, t, n) {
            if (t === void 0 && n === void 0) {
                let t = e;
                t && t.isColor
                    ? this.copy(t)
                    : typeof t == `number`
                      ? this.setHex(t)
                      : typeof t == `string` && this.setStyle(t);
            } else this.setRGB(e, t, n);
            return this;
        }
        setScalar(e) {
            return ((this.r = e), (this.g = e), (this.b = e), this);
        }
        setHex(e, t = Be) {
            return (
                (e = Math.floor(e)),
                (this.r = ((e >> 16) & 255) / 255),
                (this.g = ((e >> 8) & 255) / 255),
                (this.b = (e & 255) / 255),
                X.colorSpaceToWorking(this, t),
                this
            );
        }
        setRGB(e, t, n, r = X.workingColorSpace) {
            return (
                (this.r = e),
                (this.g = t),
                (this.b = n),
                X.colorSpaceToWorking(this, r),
                this
            );
        }
        setHSL(e, t, n, r = X.workingColorSpace) {
            if (((e = ut(e, 1)), (t = K(t, 0, 1)), (n = K(n, 0, 1)), t === 0))
                this.r = this.g = this.b = n;
            else {
                let r = n <= 0.5 ? n * (1 + t) : n + t - n * t,
                    i = 2 * n - r;
                ((this.r = _n(i, r, e + 1 / 3)),
                    (this.g = _n(i, r, e)),
                    (this.b = _n(i, r, e - 1 / 3)));
            }
            return (X.colorSpaceToWorking(this, r), this);
        }
        setStyle(e, t = Be) {
            function n(t) {
                t !== void 0 &&
                    parseFloat(t) < 1 &&
                    W(`Color: Alpha component of ` + e + ` will be ignored.`);
            }
            let r;
            if ((r = /^(\w+)\(([^\)]*)\)/.exec(e))) {
                let i,
                    a = r[1],
                    o = r[2];
                switch (a) {
                    case `rgb`:
                    case `rgba`:
                        if (
                            (i =
                                /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                                    o,
                                ))
                        )
                            return (
                                n(i[4]),
                                this.setRGB(
                                    Math.min(255, parseInt(i[1], 10)) / 255,
                                    Math.min(255, parseInt(i[2], 10)) / 255,
                                    Math.min(255, parseInt(i[3], 10)) / 255,
                                    t,
                                )
                            );
                        if (
                            (i =
                                /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                                    o,
                                ))
                        )
                            return (
                                n(i[4]),
                                this.setRGB(
                                    Math.min(100, parseInt(i[1], 10)) / 100,
                                    Math.min(100, parseInt(i[2], 10)) / 100,
                                    Math.min(100, parseInt(i[3], 10)) / 100,
                                    t,
                                )
                            );
                        break;
                    case `hsl`:
                    case `hsla`:
                        if (
                            (i =
                                /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                                    o,
                                ))
                        )
                            return (
                                n(i[4]),
                                this.setHSL(
                                    parseFloat(i[1]) / 360,
                                    parseFloat(i[2]) / 100,
                                    parseFloat(i[3]) / 100,
                                    t,
                                )
                            );
                        break;
                    default:
                        W(`Color: Unknown color model ` + e);
                }
            } else if ((r = /^\#([A-Fa-f\d]+)$/.exec(e))) {
                let n = r[1],
                    i = n.length;
                if (i === 3)
                    return this.setRGB(
                        parseInt(n.charAt(0), 16) / 15,
                        parseInt(n.charAt(1), 16) / 15,
                        parseInt(n.charAt(2), 16) / 15,
                        t,
                    );
                if (i === 6) return this.setHex(parseInt(n, 16), t);
                W(`Color: Invalid hex color ` + e);
            } else if (e && e.length > 0) return this.setColorName(e, t);
            return this;
        }
        setColorName(e, t = Be) {
            let n = mn[e.toLowerCase()];
            return (
                n === void 0
                    ? W(`Color: Unknown color ` + e)
                    : this.setHex(n, t),
                this
            );
        }
        clone() {
            return new this.constructor(this.r, this.g, this.b);
        }
        copy(e) {
            return ((this.r = e.r), (this.g = e.g), (this.b = e.b), this);
        }
        copySRGBToLinear(e) {
            return (
                (this.r = xt(e.r)),
                (this.g = xt(e.g)),
                (this.b = xt(e.b)),
                this
            );
        }
        copyLinearToSRGB(e) {
            return (
                (this.r = St(e.r)),
                (this.g = St(e.g)),
                (this.b = St(e.b)),
                this
            );
        }
        convertSRGBToLinear() {
            return (this.copySRGBToLinear(this), this);
        }
        convertLinearToSRGB() {
            return (this.copyLinearToSRGB(this), this);
        }
        getHex(e = Be) {
            return (
                X.workingToColorSpace(vn.copy(this), e),
                Math.round(K(vn.r * 255, 0, 255)) * 65536 +
                    Math.round(K(vn.g * 255, 0, 255)) * 256 +
                    Math.round(K(vn.b * 255, 0, 255))
            );
        }
        getHexString(e = Be) {
            return (`000000` + this.getHex(e).toString(16)).slice(-6);
        }
        getHSL(e, t = X.workingColorSpace) {
            X.workingToColorSpace(vn.copy(this), t);
            let n = vn.r,
                r = vn.g,
                i = vn.b,
                a = Math.max(n, r, i),
                o = Math.min(n, r, i),
                s,
                c,
                l = (o + a) / 2;
            if (o === a) ((s = 0), (c = 0));
            else {
                let e = a - o;
                switch (((c = l <= 0.5 ? e / (a + o) : e / (2 - a - o)), a)) {
                    case n:
                        s = (r - i) / e + (r < i ? 6 : 0);
                        break;
                    case r:
                        s = (i - n) / e + 2;
                        break;
                    case i:
                        s = (n - r) / e + 4;
                        break;
                }
                s /= 6;
            }
            return ((e.h = s), (e.s = c), (e.l = l), e);
        }
        getRGB(e, t = X.workingColorSpace) {
            return (
                X.workingToColorSpace(vn.copy(this), t),
                (e.r = vn.r),
                (e.g = vn.g),
                (e.b = vn.b),
                e
            );
        }
        getStyle(e = Be) {
            X.workingToColorSpace(vn.copy(this), e);
            let t = vn.r,
                n = vn.g,
                r = vn.b;
            return e === `srgb`
                ? `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(r * 255)})`
                : `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`;
        }
        offsetHSL(e, t, n) {
            return (this.getHSL(hn), this.setHSL(hn.h + e, hn.s + t, hn.l + n));
        }
        add(e) {
            return ((this.r += e.r), (this.g += e.g), (this.b += e.b), this);
        }
        addColors(e, t) {
            return (
                (this.r = e.r + t.r),
                (this.g = e.g + t.g),
                (this.b = e.b + t.b),
                this
            );
        }
        addScalar(e) {
            return ((this.r += e), (this.g += e), (this.b += e), this);
        }
        sub(e) {
            return (
                (this.r = Math.max(0, this.r - e.r)),
                (this.g = Math.max(0, this.g - e.g)),
                (this.b = Math.max(0, this.b - e.b)),
                this
            );
        }
        multiply(e) {
            return ((this.r *= e.r), (this.g *= e.g), (this.b *= e.b), this);
        }
        multiplyScalar(e) {
            return ((this.r *= e), (this.g *= e), (this.b *= e), this);
        }
        lerp(e, t) {
            return (
                (this.r += (e.r - this.r) * t),
                (this.g += (e.g - this.g) * t),
                (this.b += (e.b - this.b) * t),
                this
            );
        }
        lerpColors(e, t, n) {
            return (
                (this.r = e.r + (t.r - e.r) * n),
                (this.g = e.g + (t.g - e.g) * n),
                (this.b = e.b + (t.b - e.b) * n),
                this
            );
        }
        lerpHSL(e, t) {
            (this.getHSL(hn), e.getHSL(gn));
            let n = dt(hn.h, gn.h, t),
                r = dt(hn.s, gn.s, t),
                i = dt(hn.l, gn.l, t);
            return (this.setHSL(n, r, i), this);
        }
        setFromVector3(e) {
            return ((this.r = e.x), (this.g = e.y), (this.b = e.z), this);
        }
        applyMatrix3(e) {
            let t = this.r,
                n = this.g,
                r = this.b,
                i = e.elements;
            return (
                (this.r = i[0] * t + i[3] * n + i[6] * r),
                (this.g = i[1] * t + i[4] * n + i[7] * r),
                (this.b = i[2] * t + i[5] * n + i[8] * r),
                this
            );
        }
        equals(e) {
            return e.r === this.r && e.g === this.g && e.b === this.b;
        }
        fromArray(e, t = 0) {
            return (
                (this.r = e[t]),
                (this.g = e[t + 1]),
                (this.b = e[t + 2]),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this.r),
                (e[t + 1] = this.g),
                (e[t + 2] = this.b),
                e
            );
        }
        fromBufferAttribute(e, t) {
            return (
                (this.r = e.getX(t)),
                (this.g = e.getY(t)),
                (this.b = e.getZ(t)),
                this
            );
        }
        toJSON() {
            return this.getHex();
        }
        *[Symbol.iterator]() {
            (yield this.r, yield this.g, yield this.b);
        }
    },
    vn = new Z();
Z.NAMES = mn;
var yn = class extends un {
        constructor() {
            (super(),
                (this.isScene = !0),
                (this.type = `Scene`),
                (this.background = null),
                (this.environment = null),
                (this.fog = null),
                (this.backgroundBlurriness = 0),
                (this.backgroundIntensity = 1),
                (this.backgroundRotation = new Kt()),
                (this.environmentIntensity = 1),
                (this.environmentRotation = new Kt()),
                (this.overrideMaterial = null),
                typeof __THREE_DEVTOOLS__ < `u` &&
                    __THREE_DEVTOOLS__.dispatchEvent(
                        new CustomEvent(`observe`, { detail: this }),
                    ));
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                e.background !== null &&
                    (this.background = e.background.clone()),
                e.environment !== null &&
                    (this.environment = e.environment.clone()),
                e.fog !== null && (this.fog = e.fog.clone()),
                (this.backgroundBlurriness = e.backgroundBlurriness),
                (this.backgroundIntensity = e.backgroundIntensity),
                this.backgroundRotation.copy(e.backgroundRotation),
                (this.environmentIntensity = e.environmentIntensity),
                this.environmentRotation.copy(e.environmentRotation),
                e.overrideMaterial !== null &&
                    (this.overrideMaterial = e.overrideMaterial.clone()),
                (this.matrixAutoUpdate = e.matrixAutoUpdate),
                this
            );
        }
        toJSON(e) {
            let t = super.toJSON(e);
            return (
                this.fog !== null && (t.object.fog = this.fog.toJSON()),
                this.backgroundBlurriness > 0 &&
                    (t.object.backgroundBlurriness = this.backgroundBlurriness),
                this.backgroundIntensity !== 1 &&
                    (t.object.backgroundIntensity = this.backgroundIntensity),
                (t.object.backgroundRotation =
                    this.backgroundRotation.toArray()),
                this.environmentIntensity !== 1 &&
                    (t.object.environmentIntensity = this.environmentIntensity),
                (t.object.environmentRotation =
                    this.environmentRotation.toArray()),
                t
            );
        }
    },
    bn = new J(),
    xn = new J(),
    Sn = new J(),
    Cn = new J(),
    wn = new J(),
    Tn = new J(),
    En = new J(),
    Dn = new J(),
    On = new J(),
    kn = new J(),
    An = new jt(),
    jn = new jt(),
    Mn = new jt(),
    Nn = class e {
        constructor(e = new J(), t = new J(), n = new J()) {
            ((this.a = e), (this.b = t), (this.c = n));
        }
        static getNormal(e, t, n, r) {
            (r.subVectors(n, t), bn.subVectors(e, t), r.cross(bn));
            let i = r.lengthSq();
            return i > 0 ? r.multiplyScalar(1 / Math.sqrt(i)) : r.set(0, 0, 0);
        }
        static getBarycoord(e, t, n, r, i) {
            (bn.subVectors(r, t), xn.subVectors(n, t), Sn.subVectors(e, t));
            let a = bn.dot(bn),
                o = bn.dot(xn),
                s = bn.dot(Sn),
                c = xn.dot(xn),
                l = xn.dot(Sn),
                u = a * c - o * o;
            if (u === 0) return (i.set(0, 0, 0), null);
            let d = 1 / u,
                f = (c * s - o * l) * d,
                p = (a * l - o * s) * d;
            return i.set(1 - f - p, p, f);
        }
        static containsPoint(e, t, n, r) {
            return this.getBarycoord(e, t, n, r, Cn) === null
                ? !1
                : Cn.x >= 0 && Cn.y >= 0 && Cn.x + Cn.y <= 1;
        }
        static getInterpolation(e, t, n, r, i, a, o, s) {
            return this.getBarycoord(e, t, n, r, Cn) === null
                ? ((s.x = 0),
                  (s.y = 0),
                  `z` in s && (s.z = 0),
                  `w` in s && (s.w = 0),
                  null)
                : (s.setScalar(0),
                  s.addScaledVector(i, Cn.x),
                  s.addScaledVector(a, Cn.y),
                  s.addScaledVector(o, Cn.z),
                  s);
        }
        static getInterpolatedAttribute(e, t, n, r, i, a) {
            return (
                An.setScalar(0),
                jn.setScalar(0),
                Mn.setScalar(0),
                An.fromBufferAttribute(e, t),
                jn.fromBufferAttribute(e, n),
                Mn.fromBufferAttribute(e, r),
                a.setScalar(0),
                a.addScaledVector(An, i.x),
                a.addScaledVector(jn, i.y),
                a.addScaledVector(Mn, i.z),
                a
            );
        }
        static isFrontFacing(e, t, n, r) {
            return (
                bn.subVectors(n, t),
                xn.subVectors(e, t),
                bn.cross(xn).dot(r) < 0
            );
        }
        set(e, t, n) {
            return (this.a.copy(e), this.b.copy(t), this.c.copy(n), this);
        }
        setFromPointsAndIndices(e, t, n, r) {
            return (
                this.a.copy(e[t]),
                this.b.copy(e[n]),
                this.c.copy(e[r]),
                this
            );
        }
        setFromAttributeAndIndices(e, t, n, r) {
            return (
                this.a.fromBufferAttribute(e, t),
                this.b.fromBufferAttribute(e, n),
                this.c.fromBufferAttribute(e, r),
                this
            );
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            return (this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this);
        }
        getArea() {
            return (
                bn.subVectors(this.c, this.b),
                xn.subVectors(this.a, this.b),
                bn.cross(xn).length() * 0.5
            );
        }
        getMidpoint(e) {
            return e
                .addVectors(this.a, this.b)
                .add(this.c)
                .multiplyScalar(1 / 3);
        }
        getNormal(t) {
            return e.getNormal(this.a, this.b, this.c, t);
        }
        getPlane(e) {
            return e.setFromCoplanarPoints(this.a, this.b, this.c);
        }
        getBarycoord(t, n) {
            return e.getBarycoord(t, this.a, this.b, this.c, n);
        }
        getInterpolation(t, n, r, i, a) {
            return e.getInterpolation(t, this.a, this.b, this.c, n, r, i, a);
        }
        containsPoint(t) {
            return e.containsPoint(t, this.a, this.b, this.c);
        }
        isFrontFacing(t) {
            return e.isFrontFacing(this.a, this.b, this.c, t);
        }
        intersectsBox(e) {
            return e.intersectsTriangle(this);
        }
        closestPointToPoint(e, t) {
            let n = this.a,
                r = this.b,
                i = this.c,
                a,
                o;
            (wn.subVectors(r, n), Tn.subVectors(i, n), Dn.subVectors(e, n));
            let s = wn.dot(Dn),
                c = Tn.dot(Dn);
            if (s <= 0 && c <= 0) return t.copy(n);
            On.subVectors(e, r);
            let l = wn.dot(On),
                u = Tn.dot(On);
            if (l >= 0 && u <= l) return t.copy(r);
            let d = s * u - l * c;
            if (d <= 0 && s >= 0 && l <= 0)
                return ((a = s / (s - l)), t.copy(n).addScaledVector(wn, a));
            kn.subVectors(e, i);
            let f = wn.dot(kn),
                p = Tn.dot(kn);
            if (p >= 0 && f <= p) return t.copy(i);
            let m = f * c - s * p;
            if (m <= 0 && c >= 0 && p <= 0)
                return ((o = c / (c - p)), t.copy(n).addScaledVector(Tn, o));
            let h = l * p - f * u;
            if (h <= 0 && u - l >= 0 && f - p >= 0)
                return (
                    En.subVectors(i, r),
                    (o = (u - l) / (u - l + (f - p))),
                    t.copy(r).addScaledVector(En, o)
                );
            let g = 1 / (h + m + d);
            return (
                (a = m * g),
                (o = d * g),
                t.copy(n).addScaledVector(wn, a).addScaledVector(Tn, o)
            );
        }
        equals(e) {
            return (
                e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c)
            );
        }
    },
    Pn = class {
        constructor(
            e = new J(1 / 0, 1 / 0, 1 / 0),
            t = new J(-1 / 0, -1 / 0, -1 / 0),
        ) {
            ((this.isBox3 = !0), (this.min = e), (this.max = t));
        }
        set(e, t) {
            return (this.min.copy(e), this.max.copy(t), this);
        }
        setFromArray(e) {
            this.makeEmpty();
            for (let t = 0, n = e.length; t < n; t += 3)
                this.expandByPoint(In.fromArray(e, t));
            return this;
        }
        setFromBufferAttribute(e) {
            this.makeEmpty();
            for (let t = 0, n = e.count; t < n; t++)
                this.expandByPoint(In.fromBufferAttribute(e, t));
            return this;
        }
        setFromPoints(e) {
            this.makeEmpty();
            for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
            return this;
        }
        setFromCenterAndSize(e, t) {
            let n = In.copy(t).multiplyScalar(0.5);
            return (this.min.copy(e).sub(n), this.max.copy(e).add(n), this);
        }
        setFromObject(e, t = !1) {
            return (this.makeEmpty(), this.expandByObject(e, t));
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            return (this.min.copy(e.min), this.max.copy(e.max), this);
        }
        makeEmpty() {
            return (
                (this.min.x = this.min.y = this.min.z = 1 / 0),
                (this.max.x = this.max.y = this.max.z = -1 / 0),
                this
            );
        }
        isEmpty() {
            return (
                this.max.x < this.min.x ||
                this.max.y < this.min.y ||
                this.max.z < this.min.z
            );
        }
        getCenter(e) {
            return this.isEmpty()
                ? e.set(0, 0, 0)
                : e.addVectors(this.min, this.max).multiplyScalar(0.5);
        }
        getSize(e) {
            return this.isEmpty()
                ? e.set(0, 0, 0)
                : e.subVectors(this.max, this.min);
        }
        expandByPoint(e) {
            return (this.min.min(e), this.max.max(e), this);
        }
        expandByVector(e) {
            return (this.min.sub(e), this.max.add(e), this);
        }
        expandByScalar(e) {
            return (this.min.addScalar(-e), this.max.addScalar(e), this);
        }
        expandByObject(e, t = !1) {
            e.updateWorldMatrix(!1, !1);
            let n = e.geometry;
            if (n !== void 0) {
                let r = n.getAttribute(`position`);
                if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0)
                    for (let t = 0, n = r.count; t < n; t++)
                        (e.isMesh === !0
                            ? e.getVertexPosition(t, In)
                            : In.fromBufferAttribute(r, t),
                            In.applyMatrix4(e.matrixWorld),
                            this.expandByPoint(In));
                else
                    (e.boundingBox === void 0
                        ? (n.boundingBox === null && n.computeBoundingBox(),
                          Ln.copy(n.boundingBox))
                        : (e.boundingBox === null && e.computeBoundingBox(),
                          Ln.copy(e.boundingBox)),
                        Ln.applyMatrix4(e.matrixWorld),
                        this.union(Ln));
            }
            let r = e.children;
            for (let e = 0, n = r.length; e < n; e++)
                this.expandByObject(r[e], t);
            return this;
        }
        containsPoint(e) {
            return (
                e.x >= this.min.x &&
                e.x <= this.max.x &&
                e.y >= this.min.y &&
                e.y <= this.max.y &&
                e.z >= this.min.z &&
                e.z <= this.max.z
            );
        }
        containsBox(e) {
            return (
                this.min.x <= e.min.x &&
                e.max.x <= this.max.x &&
                this.min.y <= e.min.y &&
                e.max.y <= this.max.y &&
                this.min.z <= e.min.z &&
                e.max.z <= this.max.z
            );
        }
        getParameter(e, t) {
            return t.set(
                (e.x - this.min.x) / (this.max.x - this.min.x),
                (e.y - this.min.y) / (this.max.y - this.min.y),
                (e.z - this.min.z) / (this.max.z - this.min.z),
            );
        }
        intersectsBox(e) {
            return (
                e.max.x >= this.min.x &&
                e.min.x <= this.max.x &&
                e.max.y >= this.min.y &&
                e.min.y <= this.max.y &&
                e.max.z >= this.min.z &&
                e.min.z <= this.max.z
            );
        }
        intersectsSphere(e) {
            return (
                this.clampPoint(e.center, In),
                In.distanceToSquared(e.center) <= e.radius * e.radius
            );
        }
        intersectsPlane(e) {
            let t, n;
            return (
                e.normal.x > 0
                    ? ((t = e.normal.x * this.min.x),
                      (n = e.normal.x * this.max.x))
                    : ((t = e.normal.x * this.max.x),
                      (n = e.normal.x * this.min.x)),
                e.normal.y > 0
                    ? ((t += e.normal.y * this.min.y),
                      (n += e.normal.y * this.max.y))
                    : ((t += e.normal.y * this.max.y),
                      (n += e.normal.y * this.min.y)),
                e.normal.z > 0
                    ? ((t += e.normal.z * this.min.z),
                      (n += e.normal.z * this.max.z))
                    : ((t += e.normal.z * this.max.z),
                      (n += e.normal.z * this.min.z)),
                t <= -e.constant && n >= -e.constant
            );
        }
        intersectsTriangle(e) {
            if (this.isEmpty()) return !1;
            (this.getCenter(Wn),
                Gn.subVectors(this.max, Wn),
                Rn.subVectors(e.a, Wn),
                zn.subVectors(e.b, Wn),
                Bn.subVectors(e.c, Wn),
                Vn.subVectors(zn, Rn),
                Hn.subVectors(Bn, zn),
                Un.subVectors(Rn, Bn));
            let t = [
                0,
                -Vn.z,
                Vn.y,
                0,
                -Hn.z,
                Hn.y,
                0,
                -Un.z,
                Un.y,
                Vn.z,
                0,
                -Vn.x,
                Hn.z,
                0,
                -Hn.x,
                Un.z,
                0,
                -Un.x,
                -Vn.y,
                Vn.x,
                0,
                -Hn.y,
                Hn.x,
                0,
                -Un.y,
                Un.x,
                0,
            ];
            return !Jn(t, Rn, zn, Bn, Gn) ||
                ((t = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !Jn(t, Rn, zn, Bn, Gn))
                ? !1
                : (Kn.crossVectors(Vn, Hn),
                  (t = [Kn.x, Kn.y, Kn.z]),
                  Jn(t, Rn, zn, Bn, Gn));
        }
        clampPoint(e, t) {
            return t.copy(e).clamp(this.min, this.max);
        }
        distanceToPoint(e) {
            return this.clampPoint(e, In).distanceTo(e);
        }
        getBoundingSphere(e) {
            return (
                this.isEmpty()
                    ? e.makeEmpty()
                    : (this.getCenter(e.center),
                      (e.radius = this.getSize(In).length() * 0.5)),
                e
            );
        }
        intersect(e) {
            return (
                this.min.max(e.min),
                this.max.min(e.max),
                this.isEmpty() && this.makeEmpty(),
                this
            );
        }
        union(e) {
            return (this.min.min(e.min), this.max.max(e.max), this);
        }
        applyMatrix4(e) {
            return this.isEmpty()
                ? this
                : (Fn[0]
                      .set(this.min.x, this.min.y, this.min.z)
                      .applyMatrix4(e),
                  Fn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e),
                  Fn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e),
                  Fn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e),
                  Fn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e),
                  Fn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e),
                  Fn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e),
                  Fn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e),
                  this.setFromPoints(Fn),
                  this);
        }
        translate(e) {
            return (this.min.add(e), this.max.add(e), this);
        }
        equals(e) {
            return e.min.equals(this.min) && e.max.equals(this.max);
        }
        toJSON() {
            return { min: this.min.toArray(), max: this.max.toArray() };
        }
        fromJSON(e) {
            return (this.min.fromArray(e.min), this.max.fromArray(e.max), this);
        }
    },
    Fn = [
        new J(),
        new J(),
        new J(),
        new J(),
        new J(),
        new J(),
        new J(),
        new J(),
    ],
    In = new J(),
    Ln = new Pn(),
    Rn = new J(),
    zn = new J(),
    Bn = new J(),
    Vn = new J(),
    Hn = new J(),
    Un = new J(),
    Wn = new J(),
    Gn = new J(),
    Kn = new J(),
    qn = new J();
function Jn(e, t, n, r, i) {
    for (let a = 0, o = e.length - 3; a <= o; a += 3) {
        qn.fromArray(e, a);
        let o =
                i.x * Math.abs(qn.x) +
                i.y * Math.abs(qn.y) +
                i.z * Math.abs(qn.z),
            s = t.dot(qn),
            c = n.dot(qn),
            l = r.dot(qn);
        if (Math.max(-Math.max(s, c, l), Math.min(s, c, l)) > o) return !1;
    }
    return !0;
}
var Yn = new J(),
    Xn = new q(),
    Zn = 0,
    Qn = class extends at {
        constructor(e, t, n = !1) {
            if ((super(), Array.isArray(e)))
                throw TypeError(
                    `THREE.BufferAttribute: array should be a Typed Array.`,
                );
            ((this.isBufferAttribute = !0),
                Object.defineProperty(this, "id", { value: Zn++ }),
                (this.name = ``),
                (this.array = e),
                (this.itemSize = t),
                (this.count = e === void 0 ? 0 : e.length / t),
                (this.normalized = n),
                (this.usage = Ge),
                (this.updateRanges = []),
                (this.gpuType = C),
                (this.version = 0));
        }
        onUploadCallback() {}
        set needsUpdate(e) {
            e === !0 && this.version++;
        }
        setUsage(e) {
            return ((this.usage = e), this);
        }
        addUpdateRange(e, t) {
            this.updateRanges.push({ start: e, count: t });
        }
        clearUpdateRanges() {
            this.updateRanges.length = 0;
        }
        copy(e) {
            return (
                (this.name = e.name),
                (this.array = new e.array.constructor(e.array)),
                (this.itemSize = e.itemSize),
                (this.count = e.count),
                (this.normalized = e.normalized),
                (this.usage = e.usage),
                (this.gpuType = e.gpuType),
                this
            );
        }
        copyAt(e, t, n) {
            ((e *= this.itemSize), (n *= t.itemSize));
            for (let r = 0, i = this.itemSize; r < i; r++)
                this.array[e + r] = t.array[n + r];
            return this;
        }
        copyArray(e) {
            return (this.array.set(e), this);
        }
        applyMatrix3(e) {
            if (this.itemSize === 2)
                for (let t = 0, n = this.count; t < n; t++)
                    (Xn.fromBufferAttribute(this, t),
                        Xn.applyMatrix3(e),
                        this.setXY(t, Xn.x, Xn.y));
            else if (this.itemSize === 3)
                for (let t = 0, n = this.count; t < n; t++)
                    (Yn.fromBufferAttribute(this, t),
                        Yn.applyMatrix3(e),
                        this.setXYZ(t, Yn.x, Yn.y, Yn.z));
            return this;
        }
        applyMatrix4(e) {
            for (let t = 0, n = this.count; t < n; t++)
                (Yn.fromBufferAttribute(this, t),
                    Yn.applyMatrix4(e),
                    this.setXYZ(t, Yn.x, Yn.y, Yn.z));
            return this;
        }
        applyNormalMatrix(e) {
            for (let t = 0, n = this.count; t < n; t++)
                (Yn.fromBufferAttribute(this, t),
                    Yn.applyNormalMatrix(e),
                    this.setXYZ(t, Yn.x, Yn.y, Yn.z));
            return this;
        }
        transformDirection(e) {
            for (let t = 0, n = this.count; t < n; t++)
                (Yn.fromBufferAttribute(this, t),
                    Yn.transformDirection(e),
                    this.setXYZ(t, Yn.x, Yn.y, Yn.z));
            return this;
        }
        set(e, t = 0) {
            return (this.array.set(e, t), this);
        }
        getComponent(e, t) {
            let n = this.array[e * this.itemSize + t];
            return (this.normalized && (n = ft(n, this.array)), n);
        }
        setComponent(e, t, n) {
            return (
                this.normalized && (n = pt(n, this.array)),
                (this.array[e * this.itemSize + t] = n),
                this
            );
        }
        getX(e) {
            let t = this.array[e * this.itemSize];
            return (this.normalized && (t = ft(t, this.array)), t);
        }
        setX(e, t) {
            return (
                this.normalized && (t = pt(t, this.array)),
                (this.array[e * this.itemSize] = t),
                this
            );
        }
        getY(e) {
            let t = this.array[e * this.itemSize + 1];
            return (this.normalized && (t = ft(t, this.array)), t);
        }
        setY(e, t) {
            return (
                this.normalized && (t = pt(t, this.array)),
                (this.array[e * this.itemSize + 1] = t),
                this
            );
        }
        getZ(e) {
            let t = this.array[e * this.itemSize + 2];
            return (this.normalized && (t = ft(t, this.array)), t);
        }
        setZ(e, t) {
            return (
                this.normalized && (t = pt(t, this.array)),
                (this.array[e * this.itemSize + 2] = t),
                this
            );
        }
        getW(e) {
            let t = this.array[e * this.itemSize + 3];
            return (this.normalized && (t = ft(t, this.array)), t);
        }
        setW(e, t) {
            return (
                this.normalized && (t = pt(t, this.array)),
                (this.array[e * this.itemSize + 3] = t),
                this
            );
        }
        setXY(e, t, n) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                    ((t = pt(t, this.array)), (n = pt(n, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                this
            );
        }
        setXYZ(e, t, n, r) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                    ((t = pt(t, this.array)),
                    (n = pt(n, this.array)),
                    (r = pt(r, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                (this.array[e + 2] = r),
                this
            );
        }
        setXYZW(e, t, n, r, i) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                    ((t = pt(t, this.array)),
                    (n = pt(n, this.array)),
                    (r = pt(r, this.array)),
                    (i = pt(i, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                (this.array[e + 2] = r),
                (this.array[e + 3] = i),
                this
            );
        }
        onUpload(e) {
            return ((this.onUploadCallback = e), this);
        }
        clone() {
            return new this.constructor(this.array, this.itemSize).copy(this);
        }
        toJSON() {
            let e = {
                itemSize: this.itemSize,
                type: this.array.constructor.name,
                array: Array.from(this.array),
                normalized: this.normalized,
            };
            return (
                this.name !== `` && (e.name = this.name),
                this.usage !== 35044 && (e.usage = this.usage),
                e
            );
        }
        dispose() {
            this.dispatchEvent({ type: `dispose` });
        }
    },
    $n = class extends Qn {
        constructor(e, t, n) {
            super(new Uint16Array(e), t, n);
        }
    },
    er = class extends Qn {
        constructor(e, t, n) {
            super(new Uint32Array(e), t, n);
        }
    },
    tr = class extends Qn {
        constructor(e, t, n) {
            super(new Float32Array(e), t, n);
        }
    },
    nr = new Pn(),
    rr = new J(),
    ir = new J(),
    ar = class {
        constructor(e = new J(), t = -1) {
            ((this.isSphere = !0), (this.center = e), (this.radius = t));
        }
        set(e, t) {
            return (this.center.copy(e), (this.radius = t), this);
        }
        setFromPoints(e, t) {
            let n = this.center;
            t === void 0 ? nr.setFromPoints(e).getCenter(n) : n.copy(t);
            let r = 0;
            for (let t = 0, i = e.length; t < i; t++)
                r = Math.max(r, n.distanceToSquared(e[t]));
            return ((this.radius = Math.sqrt(r)), this);
        }
        copy(e) {
            return (this.center.copy(e.center), (this.radius = e.radius), this);
        }
        isEmpty() {
            return this.radius < 0;
        }
        makeEmpty() {
            return (this.center.set(0, 0, 0), (this.radius = -1), this);
        }
        containsPoint(e) {
            return (
                e.distanceToSquared(this.center) <= this.radius * this.radius
            );
        }
        distanceToPoint(e) {
            return e.distanceTo(this.center) - this.radius;
        }
        intersectsSphere(e) {
            let t = this.radius + e.radius;
            return e.center.distanceToSquared(this.center) <= t * t;
        }
        intersectsBox(e) {
            return e.intersectsSphere(this);
        }
        intersectsPlane(e) {
            return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
        }
        clampPoint(e, t) {
            let n = this.center.distanceToSquared(e);
            return (
                t.copy(e),
                n > this.radius * this.radius &&
                    (t.sub(this.center).normalize(),
                    t.multiplyScalar(this.radius).add(this.center)),
                t
            );
        }
        getBoundingBox(e) {
            return this.isEmpty()
                ? (e.makeEmpty(), e)
                : (e.set(this.center, this.center),
                  e.expandByScalar(this.radius),
                  e);
        }
        applyMatrix4(e) {
            return (
                this.center.applyMatrix4(e),
                (this.radius *= e.getMaxScaleOnAxis()),
                this
            );
        }
        translate(e) {
            return (this.center.add(e), this);
        }
        expandByPoint(e) {
            if (this.isEmpty())
                return (this.center.copy(e), (this.radius = 0), this);
            rr.subVectors(e, this.center);
            let t = rr.lengthSq();
            if (t > this.radius * this.radius) {
                let e = Math.sqrt(t),
                    n = (e - this.radius) * 0.5;
                (this.center.addScaledVector(rr, n / e), (this.radius += n));
            }
            return this;
        }
        union(e) {
            return e.isEmpty()
                ? this
                : this.isEmpty()
                  ? (this.copy(e), this)
                  : (this.center.equals(e.center) === !0
                        ? (this.radius = Math.max(this.radius, e.radius))
                        : (ir
                              .subVectors(e.center, this.center)
                              .setLength(e.radius),
                          this.expandByPoint(rr.copy(e.center).add(ir)),
                          this.expandByPoint(rr.copy(e.center).sub(ir))),
                    this);
        }
        equals(e) {
            return e.center.equals(this.center) && e.radius === this.radius;
        }
        clone() {
            return new this.constructor().copy(this);
        }
        toJSON() {
            return { radius: this.radius, center: this.center.toArray() };
        }
        fromJSON(e) {
            return (
                (this.radius = e.radius),
                this.center.fromArray(e.center),
                this
            );
        }
    },
    or = 0,
    sr = new It(),
    cr = new un(),
    lr = new J(),
    ur = new Pn(),
    dr = new Pn(),
    fr = new J(),
    pr = class e extends at {
        constructor() {
            (super(),
                (this.isBufferGeometry = !0),
                Object.defineProperty(this, "id", { value: or++ }),
                (this.uuid = lt()),
                (this.name = ``),
                (this.type = `BufferGeometry`),
                (this.index = null),
                (this.indirect = null),
                (this.indirectOffset = 0),
                (this.attributes = {}),
                (this.morphAttributes = {}),
                (this.morphTargetsRelative = !1),
                (this.groups = []),
                (this.boundingBox = null),
                (this.boundingSphere = null),
                (this.drawRange = { start: 0, count: 1 / 0 }),
                (this.userData = {}));
        }
        getIndex() {
            return this.index;
        }
        setIndex(e) {
            return (
                Array.isArray(e)
                    ? (this.index = new (Je(e) ? er : $n)(e, 1))
                    : (this.index = e),
                this
            );
        }
        setIndirect(e, t = 0) {
            return ((this.indirect = e), (this.indirectOffset = t), this);
        }
        getIndirect() {
            return this.indirect;
        }
        getAttribute(e) {
            return this.attributes[e];
        }
        setAttribute(e, t) {
            return ((this.attributes[e] = t), this);
        }
        deleteAttribute(e) {
            return (delete this.attributes[e], this);
        }
        hasAttribute(e) {
            return this.attributes[e] !== void 0;
        }
        addGroup(e, t, n = 0) {
            this.groups.push({ start: e, count: t, materialIndex: n });
        }
        clearGroups() {
            this.groups = [];
        }
        setDrawRange(e, t) {
            ((this.drawRange.start = e), (this.drawRange.count = t));
        }
        applyMatrix4(e) {
            let t = this.attributes.position;
            t !== void 0 && (t.applyMatrix4(e), (t.needsUpdate = !0));
            let n = this.attributes.normal;
            if (n !== void 0) {
                let t = new Y().getNormalMatrix(e);
                (n.applyNormalMatrix(t), (n.needsUpdate = !0));
            }
            let r = this.attributes.tangent;
            return (
                r !== void 0 && (r.transformDirection(e), (r.needsUpdate = !0)),
                this.boundingBox !== null && this.computeBoundingBox(),
                this.boundingSphere !== null && this.computeBoundingSphere(),
                this
            );
        }
        applyQuaternion(e) {
            return (
                sr.makeRotationFromQuaternion(e),
                this.applyMatrix4(sr),
                this
            );
        }
        rotateX(e) {
            return (sr.makeRotationX(e), this.applyMatrix4(sr), this);
        }
        rotateY(e) {
            return (sr.makeRotationY(e), this.applyMatrix4(sr), this);
        }
        rotateZ(e) {
            return (sr.makeRotationZ(e), this.applyMatrix4(sr), this);
        }
        translate(e, t, n) {
            return (sr.makeTranslation(e, t, n), this.applyMatrix4(sr), this);
        }
        scale(e, t, n) {
            return (sr.makeScale(e, t, n), this.applyMatrix4(sr), this);
        }
        lookAt(e) {
            return (
                cr.lookAt(e),
                cr.updateMatrix(),
                this.applyMatrix4(cr.matrix),
                this
            );
        }
        center() {
            return (
                this.computeBoundingBox(),
                this.boundingBox.getCenter(lr).negate(),
                this.translate(lr.x, lr.y, lr.z),
                this
            );
        }
        setFromPoints(e) {
            let t = this.getAttribute(`position`);
            if (t === void 0) {
                let t = [];
                for (let n = 0, r = e.length; n < r; n++) {
                    let r = e[n];
                    t.push(r.x, r.y, r.z || 0);
                }
                this.setAttribute(`position`, new tr(t, 3));
            } else {
                let n = Math.min(e.length, t.count);
                for (let r = 0; r < n; r++) {
                    let n = e[r];
                    t.setXYZ(r, n.x, n.y, n.z || 0);
                }
                (e.length > t.count &&
                    W(
                        `BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`,
                    ),
                    (t.needsUpdate = !0));
            }
            return this;
        }
        computeBoundingBox() {
            this.boundingBox === null && (this.boundingBox = new Pn());
            let e = this.attributes.position,
                t = this.morphAttributes.position;
            if (e && e.isGLBufferAttribute) {
                (G(
                    `BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,
                    this,
                ),
                    this.boundingBox.set(
                        new J(-1 / 0, -1 / 0, -1 / 0),
                        new J(1 / 0, 1 / 0, 1 / 0),
                    ));
                return;
            }
            if (e !== void 0) {
                if ((this.boundingBox.setFromBufferAttribute(e), t))
                    for (let e = 0, n = t.length; e < n; e++) {
                        let n = t[e];
                        (ur.setFromBufferAttribute(n),
                            this.morphTargetsRelative
                                ? (fr.addVectors(this.boundingBox.min, ur.min),
                                  this.boundingBox.expandByPoint(fr),
                                  fr.addVectors(this.boundingBox.max, ur.max),
                                  this.boundingBox.expandByPoint(fr))
                                : (this.boundingBox.expandByPoint(ur.min),
                                  this.boundingBox.expandByPoint(ur.max)));
                    }
            } else this.boundingBox.makeEmpty();
            (isNaN(this.boundingBox.min.x) ||
                isNaN(this.boundingBox.min.y) ||
                isNaN(this.boundingBox.min.z)) &&
                G(
                    `BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,
                    this,
                );
        }
        computeBoundingSphere() {
            this.boundingSphere === null && (this.boundingSphere = new ar());
            let e = this.attributes.position,
                t = this.morphAttributes.position;
            if (e && e.isGLBufferAttribute) {
                (G(
                    `BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,
                    this,
                ),
                    this.boundingSphere.set(new J(), 1 / 0));
                return;
            }
            if (e) {
                let n = this.boundingSphere.center;
                if ((ur.setFromBufferAttribute(e), t))
                    for (let e = 0, n = t.length; e < n; e++) {
                        let n = t[e];
                        (dr.setFromBufferAttribute(n),
                            this.morphTargetsRelative
                                ? (fr.addVectors(ur.min, dr.min),
                                  ur.expandByPoint(fr),
                                  fr.addVectors(ur.max, dr.max),
                                  ur.expandByPoint(fr))
                                : (ur.expandByPoint(dr.min),
                                  ur.expandByPoint(dr.max)));
                    }
                ur.getCenter(n);
                let r = 0;
                for (let t = 0, i = e.count; t < i; t++)
                    (fr.fromBufferAttribute(e, t),
                        (r = Math.max(r, n.distanceToSquared(fr))));
                if (t)
                    for (let i = 0, a = t.length; i < a; i++) {
                        let a = t[i],
                            o = this.morphTargetsRelative;
                        for (let t = 0, i = a.count; t < i; t++)
                            (fr.fromBufferAttribute(a, t),
                                o && (lr.fromBufferAttribute(e, t), fr.add(lr)),
                                (r = Math.max(r, n.distanceToSquared(fr))));
                    }
                ((this.boundingSphere.radius = Math.sqrt(r)),
                    isNaN(this.boundingSphere.radius) &&
                        G(
                            `BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,
                            this,
                        ));
            }
        }
        computeTangents() {
            let e = this.index,
                t = this.attributes;
            if (
                e === null ||
                t.position === void 0 ||
                t.normal === void 0 ||
                t.uv === void 0
            ) {
                G(
                    `BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`,
                );
                return;
            }
            let n = t.position,
                r = t.normal,
                i = t.uv;
            this.hasAttribute(`tangent`) === !1 &&
                this.setAttribute(
                    `tangent`,
                    new Qn(new Float32Array(4 * n.count), 4),
                );
            let a = this.getAttribute(`tangent`),
                o = [],
                s = [];
            for (let e = 0; e < n.count; e++)
                ((o[e] = new J()), (s[e] = new J()));
            let c = new J(),
                l = new J(),
                u = new J(),
                d = new q(),
                f = new q(),
                p = new q(),
                m = new J(),
                h = new J();
            function g(e, t, r) {
                (c.fromBufferAttribute(n, e),
                    l.fromBufferAttribute(n, t),
                    u.fromBufferAttribute(n, r),
                    d.fromBufferAttribute(i, e),
                    f.fromBufferAttribute(i, t),
                    p.fromBufferAttribute(i, r),
                    l.sub(c),
                    u.sub(c),
                    f.sub(d),
                    p.sub(d));
                let a = 1 / (f.x * p.y - p.x * f.y);
                isFinite(a) &&
                    (m
                        .copy(l)
                        .multiplyScalar(p.y)
                        .addScaledVector(u, -f.y)
                        .multiplyScalar(a),
                    h
                        .copy(u)
                        .multiplyScalar(f.x)
                        .addScaledVector(l, -p.x)
                        .multiplyScalar(a),
                    o[e].add(m),
                    o[t].add(m),
                    o[r].add(m),
                    s[e].add(h),
                    s[t].add(h),
                    s[r].add(h));
            }
            let _ = this.groups;
            _.length === 0 && (_ = [{ start: 0, count: e.count }]);
            for (let t = 0, n = _.length; t < n; ++t) {
                let n = _[t],
                    r = n.start,
                    i = n.count;
                for (let t = r, n = r + i; t < n; t += 3)
                    g(e.getX(t + 0), e.getX(t + 1), e.getX(t + 2));
            }
            let v = new J(),
                y = new J(),
                b = new J(),
                x = new J();
            function S(e) {
                (b.fromBufferAttribute(r, e), x.copy(b));
                let t = o[e];
                (v.copy(t),
                    v.sub(b.multiplyScalar(b.dot(t))).normalize(),
                    y.crossVectors(x, t));
                let n = y.dot(s[e]) < 0 ? -1 : 1;
                a.setXYZW(e, v.x, v.y, v.z, n);
            }
            for (let t = 0, n = _.length; t < n; ++t) {
                let n = _[t],
                    r = n.start,
                    i = n.count;
                for (let t = r, n = r + i; t < n; t += 3)
                    (S(e.getX(t + 0)), S(e.getX(t + 1)), S(e.getX(t + 2)));
            }
        }
        computeVertexNormals() {
            let e = this.index,
                t = this.getAttribute(`position`);
            if (t !== void 0) {
                let n = this.getAttribute(`normal`);
                if (n === void 0)
                    ((n = new Qn(new Float32Array(t.count * 3), 3)),
                        this.setAttribute(`normal`, n));
                else
                    for (let e = 0, t = n.count; e < t; e++)
                        n.setXYZ(e, 0, 0, 0);
                let r = new J(),
                    i = new J(),
                    a = new J(),
                    o = new J(),
                    s = new J(),
                    c = new J(),
                    l = new J(),
                    u = new J();
                if (e)
                    for (let d = 0, f = e.count; d < f; d += 3) {
                        let f = e.getX(d + 0),
                            p = e.getX(d + 1),
                            m = e.getX(d + 2);
                        (r.fromBufferAttribute(t, f),
                            i.fromBufferAttribute(t, p),
                            a.fromBufferAttribute(t, m),
                            l.subVectors(a, i),
                            u.subVectors(r, i),
                            l.cross(u),
                            o.fromBufferAttribute(n, f),
                            s.fromBufferAttribute(n, p),
                            c.fromBufferAttribute(n, m),
                            o.add(l),
                            s.add(l),
                            c.add(l),
                            n.setXYZ(f, o.x, o.y, o.z),
                            n.setXYZ(p, s.x, s.y, s.z),
                            n.setXYZ(m, c.x, c.y, c.z));
                    }
                else
                    for (let e = 0, o = t.count; e < o; e += 3)
                        (r.fromBufferAttribute(t, e + 0),
                            i.fromBufferAttribute(t, e + 1),
                            a.fromBufferAttribute(t, e + 2),
                            l.subVectors(a, i),
                            u.subVectors(r, i),
                            l.cross(u),
                            n.setXYZ(e + 0, l.x, l.y, l.z),
                            n.setXYZ(e + 1, l.x, l.y, l.z),
                            n.setXYZ(e + 2, l.x, l.y, l.z));
                (this.normalizeNormals(), (n.needsUpdate = !0));
            }
        }
        normalizeNormals() {
            let e = this.attributes.normal;
            for (let t = 0, n = e.count; t < n; t++)
                (fr.fromBufferAttribute(e, t),
                    fr.normalize(),
                    e.setXYZ(t, fr.x, fr.y, fr.z));
        }
        toNonIndexed() {
            function t(e, t) {
                let n = e.array,
                    r = e.itemSize,
                    i = e.normalized,
                    a = new n.constructor(t.length * r),
                    o = 0,
                    s = 0;
                for (let i = 0, c = t.length; i < c; i++) {
                    o = e.isInterleavedBufferAttribute
                        ? t[i] * e.data.stride + e.offset
                        : t[i] * r;
                    for (let e = 0; e < r; e++) a[s++] = n[o++];
                }
                return new Qn(a, r, i);
            }
            if (this.index === null)
                return (
                    W(
                        `BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`,
                    ),
                    this
                );
            let n = new e(),
                r = this.index.array,
                i = this.attributes;
            for (let e in i) {
                let a = i[e],
                    o = t(a, r);
                n.setAttribute(e, o);
            }
            let a = this.morphAttributes;
            for (let e in a) {
                let i = [],
                    o = a[e];
                for (let e = 0, n = o.length; e < n; e++) {
                    let n = o[e],
                        a = t(n, r);
                    i.push(a);
                }
                n.morphAttributes[e] = i;
            }
            n.morphTargetsRelative = this.morphTargetsRelative;
            let o = this.groups;
            for (let e = 0, t = o.length; e < t; e++) {
                let t = o[e];
                n.addGroup(t.start, t.count, t.materialIndex);
            }
            return n;
        }
        toJSON() {
            let e = {
                metadata: {
                    version: 4.7,
                    type: `BufferGeometry`,
                    generator: `BufferGeometry.toJSON`,
                },
            };
            if (
                ((e.uuid = this.uuid),
                (e.type = this.type),
                this.name !== `` && (e.name = this.name),
                Object.keys(this.userData).length > 0 &&
                    (e.userData = this.userData),
                this.parameters !== void 0)
            ) {
                let t = this.parameters;
                for (let n in t) t[n] !== void 0 && (e[n] = t[n]);
                return e;
            }
            e.data = { attributes: {} };
            let t = this.index;
            t !== null &&
                (e.data.index = {
                    type: t.array.constructor.name,
                    array: Array.prototype.slice.call(t.array),
                });
            let n = this.attributes;
            for (let t in n) {
                let r = n[t];
                e.data.attributes[t] = r.toJSON(e.data);
            }
            let r = {},
                i = !1;
            for (let t in this.morphAttributes) {
                let n = this.morphAttributes[t],
                    a = [];
                for (let t = 0, r = n.length; t < r; t++) {
                    let r = n[t];
                    a.push(r.toJSON(e.data));
                }
                a.length > 0 && ((r[t] = a), (i = !0));
            }
            i &&
                ((e.data.morphAttributes = r),
                (e.data.morphTargetsRelative = this.morphTargetsRelative));
            let a = this.groups;
            a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
            let o = this.boundingSphere;
            return (o !== null && (e.data.boundingSphere = o.toJSON()), e);
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            ((this.index = null),
                (this.attributes = {}),
                (this.morphAttributes = {}),
                (this.groups = []),
                (this.boundingBox = null),
                (this.boundingSphere = null));
            let t = {};
            this.name = e.name;
            let n = e.index;
            n !== null && this.setIndex(n.clone());
            let r = e.attributes;
            for (let e in r) {
                let n = r[e];
                this.setAttribute(e, n.clone(t));
            }
            let i = e.morphAttributes;
            for (let e in i) {
                let n = [],
                    r = i[e];
                for (let e = 0, i = r.length; e < i; e++) n.push(r[e].clone(t));
                this.morphAttributes[e] = n;
            }
            this.morphTargetsRelative = e.morphTargetsRelative;
            let a = e.groups;
            for (let e = 0, t = a.length; e < t; e++) {
                let t = a[e];
                this.addGroup(t.start, t.count, t.materialIndex);
            }
            let o = e.boundingBox;
            o !== null && (this.boundingBox = o.clone());
            let s = e.boundingSphere;
            return (
                s !== null && (this.boundingSphere = s.clone()),
                (this.drawRange.start = e.drawRange.start),
                (this.drawRange.count = e.drawRange.count),
                (this.userData = e.userData),
                this
            );
        }
        dispose() {
            this.dispatchEvent({ type: `dispose` });
        }
    },
    mr = 0,
    hr = class extends at {
        constructor() {
            (super(),
                (this.isMaterial = !0),
                Object.defineProperty(this, "id", { value: mr++ }),
                (this.uuid = lt()),
                (this.name = ``),
                (this.type = `Material`),
                (this.blending = 1),
                (this.side = 0),
                (this.vertexColors = !1),
                (this.opacity = 1),
                (this.transparent = !1),
                (this.alphaHash = !1),
                (this.blendSrc = 204),
                (this.blendDst = 205),
                (this.blendEquation = 100),
                (this.blendSrcAlpha = null),
                (this.blendDstAlpha = null),
                (this.blendEquationAlpha = null),
                (this.blendColor = new Z(0, 0, 0)),
                (this.blendAlpha = 0),
                (this.depthFunc = 3),
                (this.depthTest = !0),
                (this.depthWrite = !0),
                (this.stencilWriteMask = 255),
                (this.stencilFunc = 519),
                (this.stencilRef = 0),
                (this.stencilFuncMask = 255),
                (this.stencilFail = We),
                (this.stencilZFail = We),
                (this.stencilZPass = We),
                (this.stencilWrite = !1),
                (this.clippingPlanes = null),
                (this.clipIntersection = !1),
                (this.clipShadows = !1),
                (this.shadowSide = null),
                (this.colorWrite = !0),
                (this.precision = null),
                (this.polygonOffset = !1),
                (this.polygonOffsetFactor = 0),
                (this.polygonOffsetUnits = 0),
                (this.dithering = !1),
                (this.alphaToCoverage = !1),
                (this.premultipliedAlpha = !1),
                (this.forceSinglePass = !1),
                (this.allowOverride = !0),
                (this.visible = !0),
                (this.toneMapped = !0),
                (this.userData = {}),
                (this.version = 0),
                (this._alphaTest = 0));
        }
        get alphaTest() {
            return this._alphaTest;
        }
        set alphaTest(e) {
            (this._alphaTest > 0 != e > 0 && this.version++,
                (this._alphaTest = e));
        }
        onBeforeRender() {}
        onBeforeCompile() {}
        customProgramCacheKey() {
            return this.onBeforeCompile.toString();
        }
        setValues(e) {
            if (e !== void 0)
                for (let t in e) {
                    let n = e[t];
                    if (n === void 0) {
                        W(`Material: parameter '${t}' has value of undefined.`);
                        continue;
                    }
                    let r = this[t];
                    if (r === void 0) {
                        W(
                            `Material: '${t}' is not a property of THREE.${this.type}.`,
                        );
                        continue;
                    }
                    r && r.isColor
                        ? r.set(n)
                        : r && r.isVector3 && n && n.isVector3
                          ? r.copy(n)
                          : (this[t] = n);
                }
        }
        toJSON(e) {
            let t = e === void 0 || typeof e == `string`;
            t && (e = { textures: {}, images: {} });
            let n = {
                metadata: {
                    version: 4.7,
                    type: `Material`,
                    generator: `Material.toJSON`,
                },
            };
            ((n.uuid = this.uuid),
                (n.type = this.type),
                this.name !== `` && (n.name = this.name),
                this.color &&
                    this.color.isColor &&
                    (n.color = this.color.getHex()),
                this.roughness !== void 0 && (n.roughness = this.roughness),
                this.metalness !== void 0 && (n.metalness = this.metalness),
                this.sheen !== void 0 && (n.sheen = this.sheen),
                this.sheenColor &&
                    this.sheenColor.isColor &&
                    (n.sheenColor = this.sheenColor.getHex()),
                this.sheenRoughness !== void 0 &&
                    (n.sheenRoughness = this.sheenRoughness),
                this.emissive &&
                    this.emissive.isColor &&
                    (n.emissive = this.emissive.getHex()),
                this.emissiveIntensity !== void 0 &&
                    this.emissiveIntensity !== 1 &&
                    (n.emissiveIntensity = this.emissiveIntensity),
                this.specular &&
                    this.specular.isColor &&
                    (n.specular = this.specular.getHex()),
                this.specularIntensity !== void 0 &&
                    (n.specularIntensity = this.specularIntensity),
                this.specularColor &&
                    this.specularColor.isColor &&
                    (n.specularColor = this.specularColor.getHex()),
                this.shininess !== void 0 && (n.shininess = this.shininess),
                this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
                this.clearcoatRoughness !== void 0 &&
                    (n.clearcoatRoughness = this.clearcoatRoughness),
                this.clearcoatMap &&
                    this.clearcoatMap.isTexture &&
                    (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
                this.clearcoatRoughnessMap &&
                    this.clearcoatRoughnessMap.isTexture &&
                    (n.clearcoatRoughnessMap =
                        this.clearcoatRoughnessMap.toJSON(e).uuid),
                this.clearcoatNormalMap &&
                    this.clearcoatNormalMap.isTexture &&
                    ((n.clearcoatNormalMap =
                        this.clearcoatNormalMap.toJSON(e).uuid),
                    (n.clearcoatNormalScale =
                        this.clearcoatNormalScale.toArray())),
                this.sheenColorMap &&
                    this.sheenColorMap.isTexture &&
                    (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid),
                this.sheenRoughnessMap &&
                    this.sheenRoughnessMap.isTexture &&
                    (n.sheenRoughnessMap =
                        this.sheenRoughnessMap.toJSON(e).uuid),
                this.dispersion !== void 0 && (n.dispersion = this.dispersion),
                this.iridescence !== void 0 &&
                    (n.iridescence = this.iridescence),
                this.iridescenceIOR !== void 0 &&
                    (n.iridescenceIOR = this.iridescenceIOR),
                this.iridescenceThicknessRange !== void 0 &&
                    (n.iridescenceThicknessRange =
                        this.iridescenceThicknessRange),
                this.iridescenceMap &&
                    this.iridescenceMap.isTexture &&
                    (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid),
                this.iridescenceThicknessMap &&
                    this.iridescenceThicknessMap.isTexture &&
                    (n.iridescenceThicknessMap =
                        this.iridescenceThicknessMap.toJSON(e).uuid),
                this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
                this.anisotropyRotation !== void 0 &&
                    (n.anisotropyRotation = this.anisotropyRotation),
                this.anisotropyMap &&
                    this.anisotropyMap.isTexture &&
                    (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid),
                this.map &&
                    this.map.isTexture &&
                    (n.map = this.map.toJSON(e).uuid),
                this.matcap &&
                    this.matcap.isTexture &&
                    (n.matcap = this.matcap.toJSON(e).uuid),
                this.alphaMap &&
                    this.alphaMap.isTexture &&
                    (n.alphaMap = this.alphaMap.toJSON(e).uuid),
                this.lightMap &&
                    this.lightMap.isTexture &&
                    ((n.lightMap = this.lightMap.toJSON(e).uuid),
                    (n.lightMapIntensity = this.lightMapIntensity)),
                this.aoMap &&
                    this.aoMap.isTexture &&
                    ((n.aoMap = this.aoMap.toJSON(e).uuid),
                    (n.aoMapIntensity = this.aoMapIntensity)),
                this.bumpMap &&
                    this.bumpMap.isTexture &&
                    ((n.bumpMap = this.bumpMap.toJSON(e).uuid),
                    (n.bumpScale = this.bumpScale)),
                this.normalMap &&
                    this.normalMap.isTexture &&
                    ((n.normalMap = this.normalMap.toJSON(e).uuid),
                    (n.normalMapType = this.normalMapType),
                    (n.normalScale = this.normalScale.toArray())),
                this.displacementMap &&
                    this.displacementMap.isTexture &&
                    ((n.displacementMap = this.displacementMap.toJSON(e).uuid),
                    (n.displacementScale = this.displacementScale),
                    (n.displacementBias = this.displacementBias)),
                this.roughnessMap &&
                    this.roughnessMap.isTexture &&
                    (n.roughnessMap = this.roughnessMap.toJSON(e).uuid),
                this.metalnessMap &&
                    this.metalnessMap.isTexture &&
                    (n.metalnessMap = this.metalnessMap.toJSON(e).uuid),
                this.emissiveMap &&
                    this.emissiveMap.isTexture &&
                    (n.emissiveMap = this.emissiveMap.toJSON(e).uuid),
                this.specularMap &&
                    this.specularMap.isTexture &&
                    (n.specularMap = this.specularMap.toJSON(e).uuid),
                this.specularIntensityMap &&
                    this.specularIntensityMap.isTexture &&
                    (n.specularIntensityMap =
                        this.specularIntensityMap.toJSON(e).uuid),
                this.specularColorMap &&
                    this.specularColorMap.isTexture &&
                    (n.specularColorMap = this.specularColorMap.toJSON(e).uuid),
                this.envMap &&
                    this.envMap.isTexture &&
                    ((n.envMap = this.envMap.toJSON(e).uuid),
                    this.combine !== void 0 && (n.combine = this.combine)),
                this.envMapRotation !== void 0 &&
                    (n.envMapRotation = this.envMapRotation.toArray()),
                this.envMapIntensity !== void 0 &&
                    (n.envMapIntensity = this.envMapIntensity),
                this.reflectivity !== void 0 &&
                    (n.reflectivity = this.reflectivity),
                this.refractionRatio !== void 0 &&
                    (n.refractionRatio = this.refractionRatio),
                this.gradientMap &&
                    this.gradientMap.isTexture &&
                    (n.gradientMap = this.gradientMap.toJSON(e).uuid),
                this.transmission !== void 0 &&
                    (n.transmission = this.transmission),
                this.transmissionMap &&
                    this.transmissionMap.isTexture &&
                    (n.transmissionMap = this.transmissionMap.toJSON(e).uuid),
                this.thickness !== void 0 && (n.thickness = this.thickness),
                this.thicknessMap &&
                    this.thicknessMap.isTexture &&
                    (n.thicknessMap = this.thicknessMap.toJSON(e).uuid),
                this.attenuationDistance !== void 0 &&
                    this.attenuationDistance !== 1 / 0 &&
                    (n.attenuationDistance = this.attenuationDistance),
                this.attenuationColor !== void 0 &&
                    (n.attenuationColor = this.attenuationColor.getHex()),
                this.size !== void 0 && (n.size = this.size),
                this.shadowSide !== null && (n.shadowSide = this.shadowSide),
                this.sizeAttenuation !== void 0 &&
                    (n.sizeAttenuation = this.sizeAttenuation),
                this.blending !== 1 && (n.blending = this.blending),
                this.side !== 0 && (n.side = this.side),
                this.vertexColors === !0 && (n.vertexColors = !0),
                this.opacity < 1 && (n.opacity = this.opacity),
                this.transparent === !0 && (n.transparent = !0),
                this.blendSrc !== 204 && (n.blendSrc = this.blendSrc),
                this.blendDst !== 205 && (n.blendDst = this.blendDst),
                this.blendEquation !== 100 &&
                    (n.blendEquation = this.blendEquation),
                this.blendSrcAlpha !== null &&
                    (n.blendSrcAlpha = this.blendSrcAlpha),
                this.blendDstAlpha !== null &&
                    (n.blendDstAlpha = this.blendDstAlpha),
                this.blendEquationAlpha !== null &&
                    (n.blendEquationAlpha = this.blendEquationAlpha),
                this.blendColor &&
                    this.blendColor.isColor &&
                    (n.blendColor = this.blendColor.getHex()),
                this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
                this.depthFunc !== 3 && (n.depthFunc = this.depthFunc),
                this.depthTest === !1 && (n.depthTest = this.depthTest),
                this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
                this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
                this.stencilWriteMask !== 255 &&
                    (n.stencilWriteMask = this.stencilWriteMask),
                this.stencilFunc !== 519 && (n.stencilFunc = this.stencilFunc),
                this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
                this.stencilFuncMask !== 255 &&
                    (n.stencilFuncMask = this.stencilFuncMask),
                this.stencilFail !== 7680 && (n.stencilFail = this.stencilFail),
                this.stencilZFail !== 7680 &&
                    (n.stencilZFail = this.stencilZFail),
                this.stencilZPass !== 7680 &&
                    (n.stencilZPass = this.stencilZPass),
                this.stencilWrite === !0 &&
                    (n.stencilWrite = this.stencilWrite),
                this.rotation !== void 0 &&
                    this.rotation !== 0 &&
                    (n.rotation = this.rotation),
                this.polygonOffset === !0 && (n.polygonOffset = !0),
                this.polygonOffsetFactor !== 0 &&
                    (n.polygonOffsetFactor = this.polygonOffsetFactor),
                this.polygonOffsetUnits !== 0 &&
                    (n.polygonOffsetUnits = this.polygonOffsetUnits),
                this.linewidth !== void 0 &&
                    this.linewidth !== 1 &&
                    (n.linewidth = this.linewidth),
                this.dashSize !== void 0 && (n.dashSize = this.dashSize),
                this.gapSize !== void 0 && (n.gapSize = this.gapSize),
                this.scale !== void 0 && (n.scale = this.scale),
                this.dithering === !0 && (n.dithering = !0),
                this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
                this.alphaHash === !0 && (n.alphaHash = !0),
                this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
                this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
                this.forceSinglePass === !0 && (n.forceSinglePass = !0),
                this.allowOverride === !1 && (n.allowOverride = !1),
                this.wireframe === !0 && (n.wireframe = !0),
                this.wireframeLinewidth > 1 &&
                    (n.wireframeLinewidth = this.wireframeLinewidth),
                this.wireframeLinecap !== `round` &&
                    (n.wireframeLinecap = this.wireframeLinecap),
                this.wireframeLinejoin !== `round` &&
                    (n.wireframeLinejoin = this.wireframeLinejoin),
                this.flatShading === !0 && (n.flatShading = !0),
                this.visible === !1 && (n.visible = !1),
                this.toneMapped === !1 && (n.toneMapped = !1),
                this.fog === !1 && (n.fog = !1),
                Object.keys(this.userData).length > 0 &&
                    (n.userData = this.userData));
            function r(e) {
                let t = [];
                for (let n in e) {
                    let r = e[n];
                    (delete r.metadata, t.push(r));
                }
                return t;
            }
            if (t) {
                let t = r(e.textures),
                    i = r(e.images);
                (t.length > 0 && (n.textures = t),
                    i.length > 0 && (n.images = i));
            }
            return n;
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            ((this.name = e.name),
                (this.blending = e.blending),
                (this.side = e.side),
                (this.vertexColors = e.vertexColors),
                (this.opacity = e.opacity),
                (this.transparent = e.transparent),
                (this.blendSrc = e.blendSrc),
                (this.blendDst = e.blendDst),
                (this.blendEquation = e.blendEquation),
                (this.blendSrcAlpha = e.blendSrcAlpha),
                (this.blendDstAlpha = e.blendDstAlpha),
                (this.blendEquationAlpha = e.blendEquationAlpha),
                this.blendColor.copy(e.blendColor),
                (this.blendAlpha = e.blendAlpha),
                (this.depthFunc = e.depthFunc),
                (this.depthTest = e.depthTest),
                (this.depthWrite = e.depthWrite),
                (this.stencilWriteMask = e.stencilWriteMask),
                (this.stencilFunc = e.stencilFunc),
                (this.stencilRef = e.stencilRef),
                (this.stencilFuncMask = e.stencilFuncMask),
                (this.stencilFail = e.stencilFail),
                (this.stencilZFail = e.stencilZFail),
                (this.stencilZPass = e.stencilZPass),
                (this.stencilWrite = e.stencilWrite));
            let t = e.clippingPlanes,
                n = null;
            if (t !== null) {
                let e = t.length;
                n = Array(e);
                for (let r = 0; r !== e; ++r) n[r] = t[r].clone();
            }
            return (
                (this.clippingPlanes = n),
                (this.clipIntersection = e.clipIntersection),
                (this.clipShadows = e.clipShadows),
                (this.shadowSide = e.shadowSide),
                (this.colorWrite = e.colorWrite),
                (this.precision = e.precision),
                (this.polygonOffset = e.polygonOffset),
                (this.polygonOffsetFactor = e.polygonOffsetFactor),
                (this.polygonOffsetUnits = e.polygonOffsetUnits),
                (this.dithering = e.dithering),
                (this.alphaTest = e.alphaTest),
                (this.alphaHash = e.alphaHash),
                (this.alphaToCoverage = e.alphaToCoverage),
                (this.premultipliedAlpha = e.premultipliedAlpha),
                (this.forceSinglePass = e.forceSinglePass),
                (this.allowOverride = e.allowOverride),
                (this.visible = e.visible),
                (this.toneMapped = e.toneMapped),
                (this.userData = JSON.parse(JSON.stringify(e.userData))),
                this
            );
        }
        dispose() {
            this.dispatchEvent({ type: `dispose` });
        }
        set needsUpdate(e) {
            e === !0 && this.version++;
        }
    },
    gr = new J(),
    _r = new J(),
    vr = new J(),
    yr = new J(),
    br = new J(),
    xr = new J(),
    Sr = new J(),
    Cr = class {
        constructor(e = new J(), t = new J(0, 0, -1)) {
            ((this.origin = e), (this.direction = t));
        }
        set(e, t) {
            return (this.origin.copy(e), this.direction.copy(t), this);
        }
        copy(e) {
            return (
                this.origin.copy(e.origin),
                this.direction.copy(e.direction),
                this
            );
        }
        at(e, t) {
            return t.copy(this.origin).addScaledVector(this.direction, e);
        }
        lookAt(e) {
            return (this.direction.copy(e).sub(this.origin).normalize(), this);
        }
        recast(e) {
            return (this.origin.copy(this.at(e, gr)), this);
        }
        closestPointToPoint(e, t) {
            t.subVectors(e, this.origin);
            let n = t.dot(this.direction);
            return n < 0
                ? t.copy(this.origin)
                : t.copy(this.origin).addScaledVector(this.direction, n);
        }
        distanceToPoint(e) {
            return Math.sqrt(this.distanceSqToPoint(e));
        }
        distanceSqToPoint(e) {
            let t = gr.subVectors(e, this.origin).dot(this.direction);
            return t < 0
                ? this.origin.distanceToSquared(e)
                : (gr.copy(this.origin).addScaledVector(this.direction, t),
                  gr.distanceToSquared(e));
        }
        distanceSqToSegment(e, t, n, r) {
            (_r.copy(e).add(t).multiplyScalar(0.5),
                vr.copy(t).sub(e).normalize(),
                yr.copy(this.origin).sub(_r));
            let i = e.distanceTo(t) * 0.5,
                a = -this.direction.dot(vr),
                o = yr.dot(this.direction),
                s = -yr.dot(vr),
                c = yr.lengthSq(),
                l = Math.abs(1 - a * a),
                u,
                d,
                f,
                p;
            if (l > 0)
                if (((u = a * s - o), (d = a * o - s), (p = i * l), u >= 0))
                    if (d >= -p)
                        if (d <= p) {
                            let e = 1 / l;
                            ((u *= e),
                                (d *= e),
                                (f =
                                    u * (u + a * d + 2 * o) +
                                    d * (a * u + d + 2 * s) +
                                    c));
                        } else
                            ((d = i),
                                (u = Math.max(0, -(a * d + o))),
                                (f = -u * u + d * (d + 2 * s) + c));
                    else
                        ((d = -i),
                            (u = Math.max(0, -(a * d + o))),
                            (f = -u * u + d * (d + 2 * s) + c));
                else
                    d <= -p
                        ? ((u = Math.max(0, -(-a * i + o))),
                          (d = u > 0 ? -i : Math.min(Math.max(-i, -s), i)),
                          (f = -u * u + d * (d + 2 * s) + c))
                        : d <= p
                          ? ((u = 0),
                            (d = Math.min(Math.max(-i, -s), i)),
                            (f = d * (d + 2 * s) + c))
                          : ((u = Math.max(0, -(a * i + o))),
                            (d = u > 0 ? i : Math.min(Math.max(-i, -s), i)),
                            (f = -u * u + d * (d + 2 * s) + c));
            else
                ((d = a > 0 ? -i : i),
                    (u = Math.max(0, -(a * d + o))),
                    (f = -u * u + d * (d + 2 * s) + c));
            return (
                n && n.copy(this.origin).addScaledVector(this.direction, u),
                r && r.copy(_r).addScaledVector(vr, d),
                f
            );
        }
        intersectSphere(e, t) {
            gr.subVectors(e.center, this.origin);
            let n = gr.dot(this.direction),
                r = gr.dot(gr) - n * n,
                i = e.radius * e.radius;
            if (r > i) return null;
            let a = Math.sqrt(i - r),
                o = n - a,
                s = n + a;
            return s < 0 ? null : o < 0 ? this.at(s, t) : this.at(o, t);
        }
        intersectsSphere(e) {
            return e.radius < 0
                ? !1
                : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
        }
        distanceToPlane(e) {
            let t = e.normal.dot(this.direction);
            if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
            let n = -(this.origin.dot(e.normal) + e.constant) / t;
            return n >= 0 ? n : null;
        }
        intersectPlane(e, t) {
            let n = this.distanceToPlane(e);
            return n === null ? null : this.at(n, t);
        }
        intersectsPlane(e) {
            let t = e.distanceToPoint(this.origin);
            return t === 0 || e.normal.dot(this.direction) * t < 0;
        }
        intersectBox(e, t) {
            let n,
                r,
                i,
                a,
                o,
                s,
                c = 1 / this.direction.x,
                l = 1 / this.direction.y,
                u = 1 / this.direction.z,
                d = this.origin;
            return (
                c >= 0
                    ? ((n = (e.min.x - d.x) * c), (r = (e.max.x - d.x) * c))
                    : ((n = (e.max.x - d.x) * c), (r = (e.min.x - d.x) * c)),
                l >= 0
                    ? ((i = (e.min.y - d.y) * l), (a = (e.max.y - d.y) * l))
                    : ((i = (e.max.y - d.y) * l), (a = (e.min.y - d.y) * l)),
                n > a ||
                i > r ||
                ((i > n || isNaN(n)) && (n = i),
                (a < r || isNaN(r)) && (r = a),
                u >= 0
                    ? ((o = (e.min.z - d.z) * u), (s = (e.max.z - d.z) * u))
                    : ((o = (e.max.z - d.z) * u), (s = (e.min.z - d.z) * u)),
                n > s || o > r) ||
                ((o > n || n !== n) && (n = o),
                (s < r || r !== r) && (r = s),
                r < 0)
                    ? null
                    : this.at(n >= 0 ? n : r, t)
            );
        }
        intersectsBox(e) {
            return this.intersectBox(e, gr) !== null;
        }
        intersectTriangle(e, t, n, r, i) {
            (br.subVectors(t, e), xr.subVectors(n, e), Sr.crossVectors(br, xr));
            let a = this.direction.dot(Sr),
                o;
            if (a > 0) {
                if (r) return null;
                o = 1;
            } else if (a < 0) ((o = -1), (a = -a));
            else return null;
            yr.subVectors(this.origin, e);
            let s = o * this.direction.dot(xr.crossVectors(yr, xr));
            if (s < 0) return null;
            let c = o * this.direction.dot(br.cross(yr));
            if (c < 0 || s + c > a) return null;
            let l = -o * yr.dot(Sr);
            return l < 0 ? null : this.at(l / a, i);
        }
        applyMatrix4(e) {
            return (
                this.origin.applyMatrix4(e),
                this.direction.transformDirection(e),
                this
            );
        }
        equals(e) {
            return (
                e.origin.equals(this.origin) &&
                e.direction.equals(this.direction)
            );
        }
        clone() {
            return new this.constructor().copy(this);
        }
    },
    wr = class extends hr {
        constructor(e) {
            (super(),
                (this.isMeshBasicMaterial = !0),
                (this.type = `MeshBasicMaterial`),
                (this.color = new Z(16777215)),
                (this.map = null),
                (this.lightMap = null),
                (this.lightMapIntensity = 1),
                (this.aoMap = null),
                (this.aoMapIntensity = 1),
                (this.specularMap = null),
                (this.alphaMap = null),
                (this.envMap = null),
                (this.envMapRotation = new Kt()),
                (this.combine = 0),
                (this.reflectivity = 1),
                (this.refractionRatio = 0.98),
                (this.wireframe = !1),
                (this.wireframeLinewidth = 1),
                (this.wireframeLinecap = `round`),
                (this.wireframeLinejoin = `round`),
                (this.fog = !0),
                this.setValues(e));
        }
        copy(e) {
            return (
                super.copy(e),
                this.color.copy(e.color),
                (this.map = e.map),
                (this.lightMap = e.lightMap),
                (this.lightMapIntensity = e.lightMapIntensity),
                (this.aoMap = e.aoMap),
                (this.aoMapIntensity = e.aoMapIntensity),
                (this.specularMap = e.specularMap),
                (this.alphaMap = e.alphaMap),
                (this.envMap = e.envMap),
                this.envMapRotation.copy(e.envMapRotation),
                (this.combine = e.combine),
                (this.reflectivity = e.reflectivity),
                (this.refractionRatio = e.refractionRatio),
                (this.wireframe = e.wireframe),
                (this.wireframeLinewidth = e.wireframeLinewidth),
                (this.wireframeLinecap = e.wireframeLinecap),
                (this.wireframeLinejoin = e.wireframeLinejoin),
                (this.fog = e.fog),
                this
            );
        }
    },
    Tr = new It(),
    Er = new Cr(),
    Dr = new ar(),
    Or = new J(),
    kr = new J(),
    Ar = new J(),
    jr = new J(),
    Mr = new J(),
    Nr = new J(),
    Pr = new J(),
    Fr = new J(),
    Ir = class extends un {
        constructor(e = new pr(), t = new wr()) {
            (super(),
                (this.isMesh = !0),
                (this.type = `Mesh`),
                (this.geometry = e),
                (this.material = t),
                (this.morphTargetDictionary = void 0),
                (this.morphTargetInfluences = void 0),
                (this.count = 1),
                this.updateMorphTargets());
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                e.morphTargetInfluences !== void 0 &&
                    (this.morphTargetInfluences =
                        e.morphTargetInfluences.slice()),
                e.morphTargetDictionary !== void 0 &&
                    (this.morphTargetDictionary = Object.assign(
                        {},
                        e.morphTargetDictionary,
                    )),
                (this.material = Array.isArray(e.material)
                    ? e.material.slice()
                    : e.material),
                (this.geometry = e.geometry),
                this
            );
        }
        updateMorphTargets() {
            let e = this.geometry.morphAttributes,
                t = Object.keys(e);
            if (t.length > 0) {
                let n = e[t[0]];
                if (n !== void 0) {
                    ((this.morphTargetInfluences = []),
                        (this.morphTargetDictionary = {}));
                    for (let e = 0, t = n.length; e < t; e++) {
                        let t = n[e].name || String(e);
                        (this.morphTargetInfluences.push(0),
                            (this.morphTargetDictionary[t] = e));
                    }
                }
            }
        }
        getVertexPosition(e, t) {
            let n = this.geometry,
                r = n.attributes.position,
                i = n.morphAttributes.position,
                a = n.morphTargetsRelative;
            t.fromBufferAttribute(r, e);
            let o = this.morphTargetInfluences;
            if (i && o) {
                Nr.set(0, 0, 0);
                for (let n = 0, r = i.length; n < r; n++) {
                    let r = o[n],
                        s = i[n];
                    r !== 0 &&
                        (Mr.fromBufferAttribute(s, e),
                        a
                            ? Nr.addScaledVector(Mr, r)
                            : Nr.addScaledVector(Mr.sub(t), r));
                }
                t.add(Nr);
            }
            return t;
        }
        raycast(e, t) {
            let n = this.geometry,
                r = this.material,
                i = this.matrixWorld;
            r !== void 0 &&
                (n.boundingSphere === null && n.computeBoundingSphere(),
                Dr.copy(n.boundingSphere),
                Dr.applyMatrix4(i),
                Er.copy(e.ray).recast(e.near),
                !(
                    Dr.containsPoint(Er.origin) === !1 &&
                    (Er.intersectSphere(Dr, Or) === null ||
                        Er.origin.distanceToSquared(Or) > (e.far - e.near) ** 2)
                ) &&
                    (Tr.copy(i).invert(),
                    Er.copy(e.ray).applyMatrix4(Tr),
                    !(
                        n.boundingBox !== null &&
                        Er.intersectsBox(n.boundingBox) === !1
                    ) && this._computeIntersections(e, t, Er)));
        }
        _computeIntersections(e, t, n) {
            let r,
                i = this.geometry,
                a = this.material,
                o = i.index,
                s = i.attributes.position,
                c = i.attributes.uv,
                l = i.attributes.uv1,
                u = i.attributes.normal,
                d = i.groups,
                f = i.drawRange;
            if (o !== null)
                if (Array.isArray(a))
                    for (let i = 0, s = d.length; i < s; i++) {
                        let s = d[i],
                            p = a[s.materialIndex],
                            m = Math.max(s.start, f.start),
                            h = Math.min(
                                o.count,
                                Math.min(s.start + s.count, f.start + f.count),
                            );
                        for (let i = m, a = h; i < a; i += 3) {
                            let a = o.getX(i),
                                d = o.getX(i + 1),
                                f = o.getX(i + 2);
                            ((r = Rr(this, p, e, n, c, l, u, a, d, f)),
                                r &&
                                    ((r.faceIndex = Math.floor(i / 3)),
                                    (r.face.materialIndex = s.materialIndex),
                                    t.push(r)));
                        }
                    }
                else {
                    let i = Math.max(0, f.start),
                        s = Math.min(o.count, f.start + f.count);
                    for (let d = i, f = s; d < f; d += 3) {
                        let i = o.getX(d),
                            s = o.getX(d + 1),
                            f = o.getX(d + 2);
                        ((r = Rr(this, a, e, n, c, l, u, i, s, f)),
                            r &&
                                ((r.faceIndex = Math.floor(d / 3)), t.push(r)));
                    }
                }
            else if (s !== void 0)
                if (Array.isArray(a))
                    for (let i = 0, o = d.length; i < o; i++) {
                        let o = d[i],
                            p = a[o.materialIndex],
                            m = Math.max(o.start, f.start),
                            h = Math.min(
                                s.count,
                                Math.min(o.start + o.count, f.start + f.count),
                            );
                        for (let i = m, a = h; i < a; i += 3) {
                            let a = i,
                                s = i + 1,
                                d = i + 2;
                            ((r = Rr(this, p, e, n, c, l, u, a, s, d)),
                                r &&
                                    ((r.faceIndex = Math.floor(i / 3)),
                                    (r.face.materialIndex = o.materialIndex),
                                    t.push(r)));
                        }
                    }
                else {
                    let i = Math.max(0, f.start),
                        o = Math.min(s.count, f.start + f.count);
                    for (let s = i, d = o; s < d; s += 3) {
                        let i = s,
                            o = s + 1,
                            d = s + 2;
                        ((r = Rr(this, a, e, n, c, l, u, i, o, d)),
                            r &&
                                ((r.faceIndex = Math.floor(s / 3)), t.push(r)));
                    }
                }
        }
    };
function Lr(e, t, n, r, i, a, o, s) {
    let c;
    if (
        ((c =
            t.side === 1
                ? r.intersectTriangle(o, a, i, !0, s)
                : r.intersectTriangle(i, a, o, t.side === 0, s)),
        c === null)
    )
        return null;
    (Fr.copy(s), Fr.applyMatrix4(e.matrixWorld));
    let l = n.ray.origin.distanceTo(Fr);
    return l < n.near || l > n.far
        ? null
        : { distance: l, point: Fr.clone(), object: e };
}
function Rr(e, t, n, r, i, a, o, s, c, l) {
    (e.getVertexPosition(s, kr),
        e.getVertexPosition(c, Ar),
        e.getVertexPosition(l, jr));
    let u = Lr(e, t, n, r, kr, Ar, jr, Pr);
    if (u) {
        let e = new J();
        (Nn.getBarycoord(Pr, kr, Ar, jr, e),
            i && (u.uv = Nn.getInterpolatedAttribute(i, s, c, l, e, new q())),
            a && (u.uv1 = Nn.getInterpolatedAttribute(a, s, c, l, e, new q())),
            o &&
                ((u.normal = Nn.getInterpolatedAttribute(
                    o,
                    s,
                    c,
                    l,
                    e,
                    new J(),
                )),
                u.normal.dot(r.direction) > 0 && u.normal.multiplyScalar(-1)));
        let t = { a: s, b: c, c: l, normal: new J(), materialIndex: 0 };
        (Nn.getNormal(kr, Ar, jr, t.normal), (u.face = t), (u.barycoord = e));
    }
    return u;
}
var zr = class extends At {
        constructor(e = null, t = 1, n = 1, r, i, a, o, s, c = d, l = d, u, f) {
            (super(null, a, o, s, c, l, r, i, u, f),
                (this.isDataTexture = !0),
                (this.image = { data: e, width: t, height: n }),
                (this.generateMipmaps = !1),
                (this.flipY = !1),
                (this.unpackAlignment = 1));
        }
    },
    Br = class extends Qn {
        constructor(e, t, n, r = 1) {
            (super(e, t, n),
                (this.isInstancedBufferAttribute = !0),
                (this.meshPerAttribute = r));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.meshPerAttribute = e.meshPerAttribute),
                this
            );
        }
        toJSON() {
            let e = super.toJSON();
            return (
                (e.meshPerAttribute = this.meshPerAttribute),
                (e.isInstancedBufferAttribute = !0),
                e
            );
        }
    },
    Vr = new It(),
    Hr = new It(),
    Ur = [],
    Wr = new Pn(),
    Gr = new It(),
    Kr = new Ir(),
    qr = new ar(),
    Jr = class extends Ir {
        constructor(e, t, n) {
            (super(e, t),
                (this.isInstancedMesh = !0),
                (this.instanceMatrix = new Br(new Float32Array(n * 16), 16)),
                (this.previousInstanceMatrix = null),
                (this.instanceColor = null),
                (this.morphTexture = null),
                (this.count = n),
                (this.boundingBox = null),
                (this.boundingSphere = null));
            for (let e = 0; e < n; e++) this.setMatrixAt(e, Gr);
        }
        computeBoundingBox() {
            let e = this.geometry,
                t = this.count;
            (this.boundingBox === null && (this.boundingBox = new Pn()),
                e.boundingBox === null && e.computeBoundingBox(),
                this.boundingBox.makeEmpty());
            for (let n = 0; n < t; n++)
                (this.getMatrixAt(n, Vr),
                    Wr.copy(e.boundingBox).applyMatrix4(Vr),
                    this.boundingBox.union(Wr));
        }
        computeBoundingSphere() {
            let e = this.geometry,
                t = this.count;
            (this.boundingSphere === null && (this.boundingSphere = new ar()),
                e.boundingSphere === null && e.computeBoundingSphere(),
                this.boundingSphere.makeEmpty());
            for (let n = 0; n < t; n++)
                (this.getMatrixAt(n, Vr),
                    qr.copy(e.boundingSphere).applyMatrix4(Vr),
                    this.boundingSphere.union(qr));
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                this.instanceMatrix.copy(e.instanceMatrix),
                e.previousInstanceMatrix !== null &&
                    (this.previousInstanceMatrix =
                        e.previousInstanceMatrix.clone()),
                e.morphTexture !== null &&
                    (this.morphTexture = e.morphTexture.clone()),
                e.instanceColor !== null &&
                    (this.instanceColor = e.instanceColor.clone()),
                (this.count = e.count),
                e.boundingBox !== null &&
                    (this.boundingBox = e.boundingBox.clone()),
                e.boundingSphere !== null &&
                    (this.boundingSphere = e.boundingSphere.clone()),
                this
            );
        }
        getColorAt(e, t) {
            return this.instanceColor === null
                ? t.setRGB(1, 1, 1)
                : t.fromArray(this.instanceColor.array, e * 3);
        }
        getMatrixAt(e, t) {
            return t.fromArray(this.instanceMatrix.array, e * 16);
        }
        getMorphAt(e, t) {
            let n = t.morphTargetInfluences,
                r = this.morphTexture.source.data.data,
                i = e * (n.length + 1) + 1;
            for (let e = 0; e < n.length; e++) n[e] = r[i + e];
        }
        raycast(e, t) {
            let n = this.matrixWorld,
                r = this.count;
            if (
                ((Kr.geometry = this.geometry),
                (Kr.material = this.material),
                Kr.material !== void 0 &&
                    (this.boundingSphere === null &&
                        this.computeBoundingSphere(),
                    qr.copy(this.boundingSphere),
                    qr.applyMatrix4(n),
                    e.ray.intersectsSphere(qr) !== !1))
            )
                for (let i = 0; i < r; i++) {
                    (this.getMatrixAt(i, Vr),
                        Hr.multiplyMatrices(n, Vr),
                        (Kr.matrixWorld = Hr),
                        Kr.raycast(e, Ur));
                    for (let e = 0, n = Ur.length; e < n; e++) {
                        let n = Ur[e];
                        ((n.instanceId = i), (n.object = this), t.push(n));
                    }
                    Ur.length = 0;
                }
        }
        setColorAt(e, t) {
            return (
                this.instanceColor === null &&
                    (this.instanceColor = new Br(
                        new Float32Array(this.instanceMatrix.count * 3).fill(1),
                        3,
                    )),
                t.toArray(this.instanceColor.array, e * 3),
                this
            );
        }
        setMatrixAt(e, t) {
            return (t.toArray(this.instanceMatrix.array, e * 16), this);
        }
        setMorphAt(e, t) {
            let n = t.morphTargetInfluences,
                r = n.length + 1;
            this.morphTexture === null &&
                (this.morphTexture = new zr(
                    new Float32Array(r * this.count),
                    r,
                    this.count,
                    P,
                    C,
                ));
            let i = this.morphTexture.source.data.data,
                a = 0;
            for (let e = 0; e < n.length; e++) a += n[e];
            let o = this.geometry.morphTargetsRelative ? 1 : 1 - a,
                s = r * e;
            return ((i[s] = o), i.set(n, s + 1), this);
        }
        updateMorphTargets() {}
        dispose() {
            (this.dispatchEvent({ type: `dispose` }),
                this.morphTexture !== null &&
                    (this.morphTexture.dispose(), (this.morphTexture = null)));
        }
    },
    Yr = new J(),
    Xr = new J(),
    Zr = new Y(),
    Qr = class {
        constructor(e = new J(1, 0, 0), t = 0) {
            ((this.isPlane = !0), (this.normal = e), (this.constant = t));
        }
        set(e, t) {
            return (this.normal.copy(e), (this.constant = t), this);
        }
        setComponents(e, t, n, r) {
            return (this.normal.set(e, t, n), (this.constant = r), this);
        }
        setFromNormalAndCoplanarPoint(e, t) {
            return (
                this.normal.copy(e),
                (this.constant = -t.dot(this.normal)),
                this
            );
        }
        setFromCoplanarPoints(e, t, n) {
            let r = Yr.subVectors(n, t).cross(Xr.subVectors(e, t)).normalize();
            return (this.setFromNormalAndCoplanarPoint(r, e), this);
        }
        copy(e) {
            return (
                this.normal.copy(e.normal),
                (this.constant = e.constant),
                this
            );
        }
        normalize() {
            let e = 1 / this.normal.length();
            return (this.normal.multiplyScalar(e), (this.constant *= e), this);
        }
        negate() {
            return ((this.constant *= -1), this.normal.negate(), this);
        }
        distanceToPoint(e) {
            return this.normal.dot(e) + this.constant;
        }
        distanceToSphere(e) {
            return this.distanceToPoint(e.center) - e.radius;
        }
        projectPoint(e, t) {
            return t
                .copy(e)
                .addScaledVector(this.normal, -this.distanceToPoint(e));
        }
        intersectLine(e, t, n = !0) {
            let r = e.delta(Yr),
                i = this.normal.dot(r);
            if (i === 0)
                return this.distanceToPoint(e.start) === 0
                    ? t.copy(e.start)
                    : null;
            let a = -(e.start.dot(this.normal) + this.constant) / i;
            return n === !0 && (a < 0 || a > 1)
                ? null
                : t.copy(e.start).addScaledVector(r, a);
        }
        intersectsLine(e) {
            let t = this.distanceToPoint(e.start),
                n = this.distanceToPoint(e.end);
            return (t < 0 && n > 0) || (n < 0 && t > 0);
        }
        intersectsBox(e) {
            return e.intersectsPlane(this);
        }
        intersectsSphere(e) {
            return e.intersectsPlane(this);
        }
        coplanarPoint(e) {
            return e.copy(this.normal).multiplyScalar(-this.constant);
        }
        applyMatrix4(e, t) {
            let n = t || Zr.getNormalMatrix(e),
                r = this.coplanarPoint(Yr).applyMatrix4(e),
                i = this.normal.applyMatrix3(n).normalize();
            return ((this.constant = -r.dot(i)), this);
        }
        translate(e) {
            return ((this.constant -= e.dot(this.normal)), this);
        }
        equals(e) {
            return e.normal.equals(this.normal) && e.constant === this.constant;
        }
        clone() {
            return new this.constructor().copy(this);
        }
    },
    $r = new ar(),
    ei = new q(0.5, 0.5),
    ti = new J(),
    ni = class {
        constructor(
            e = new Qr(),
            t = new Qr(),
            n = new Qr(),
            r = new Qr(),
            i = new Qr(),
            a = new Qr(),
        ) {
            this.planes = [e, t, n, r, i, a];
        }
        set(e, t, n, r, i, a) {
            let o = this.planes;
            return (
                o[0].copy(e),
                o[1].copy(t),
                o[2].copy(n),
                o[3].copy(r),
                o[4].copy(i),
                o[5].copy(a),
                this
            );
        }
        copy(e) {
            let t = this.planes;
            for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
            return this;
        }
        setFromProjectionMatrix(e, t = qe, n = !1) {
            let r = this.planes,
                i = e.elements,
                a = i[0],
                o = i[1],
                s = i[2],
                c = i[3],
                l = i[4],
                u = i[5],
                d = i[6],
                f = i[7],
                p = i[8],
                m = i[9],
                h = i[10],
                g = i[11],
                _ = i[12],
                v = i[13],
                y = i[14],
                b = i[15];
            if (
                (r[0].setComponents(c - a, f - l, g - p, b - _).normalize(),
                r[1].setComponents(c + a, f + l, g + p, b + _).normalize(),
                r[2].setComponents(c + o, f + u, g + m, b + v).normalize(),
                r[3].setComponents(c - o, f - u, g - m, b - v).normalize(),
                n)
            )
                (r[4].setComponents(s, d, h, y).normalize(),
                    r[5].setComponents(c - s, f - d, g - h, b - y).normalize());
            else if (
                (r[4].setComponents(c - s, f - d, g - h, b - y).normalize(),
                t === 2e3)
            )
                r[5].setComponents(c + s, f + d, g + h, b + y).normalize();
            else if (t === 2001) r[5].setComponents(s, d, h, y).normalize();
            else
                throw Error(
                    `THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: ` +
                        t,
                );
            return this;
        }
        intersectsObject(e) {
            if (e.boundingSphere !== void 0)
                (e.boundingSphere === null && e.computeBoundingSphere(),
                    $r.copy(e.boundingSphere).applyMatrix4(e.matrixWorld));
            else {
                let t = e.geometry;
                (t.boundingSphere === null && t.computeBoundingSphere(),
                    $r.copy(t.boundingSphere).applyMatrix4(e.matrixWorld));
            }
            return this.intersectsSphere($r);
        }
        intersectsSprite(e) {
            return (
                $r.center.set(0, 0, 0),
                ($r.radius = 0.7071067811865476 + ei.distanceTo(e.center)),
                $r.applyMatrix4(e.matrixWorld),
                this.intersectsSphere($r)
            );
        }
        intersectsSphere(e) {
            let t = this.planes,
                n = e.center,
                r = -e.radius;
            for (let e = 0; e < 6; e++)
                if (t[e].distanceToPoint(n) < r) return !1;
            return !0;
        }
        intersectsBox(e) {
            let t = this.planes;
            for (let n = 0; n < 6; n++) {
                let r = t[n];
                if (
                    ((ti.x = r.normal.x > 0 ? e.max.x : e.min.x),
                    (ti.y = r.normal.y > 0 ? e.max.y : e.min.y),
                    (ti.z = r.normal.z > 0 ? e.max.z : e.min.z),
                    r.distanceToPoint(ti) < 0)
                )
                    return !1;
            }
            return !0;
        }
        containsPoint(e) {
            let t = this.planes;
            for (let n = 0; n < 6; n++)
                if (t[n].distanceToPoint(e) < 0) return !1;
            return !0;
        }
        clone() {
            return new this.constructor().copy(this);
        }
    },
    ri = class extends At {
        constructor(e = [], t = 301, n, r, i, a, o, s, c, l) {
            (super(e, t, n, r, i, a, o, s, c, l),
                (this.isCubeTexture = !0),
                (this.flipY = !1));
        }
        get images() {
            return this.image;
        }
        set images(e) {
            this.image = e;
        }
    },
    ii = class extends At {
        constructor(e, t, n = S, r, i, a, o = d, s = d, c, l = N, u = 1) {
            if (l !== 1026 && l !== 1027)
                throw Error(
                    `DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`,
                );
            (super({ width: e, height: t, depth: u }, r, i, a, o, s, l, n, c),
                (this.isDepthTexture = !0),
                (this.flipY = !1),
                (this.generateMipmaps = !1),
                (this.compareFunction = null));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.source = new Et(Object.assign({}, e.image))),
                (this.compareFunction = e.compareFunction),
                this
            );
        }
        toJSON(e) {
            let t = super.toJSON(e);
            return (
                this.compareFunction !== null &&
                    (t.compareFunction = this.compareFunction),
                t
            );
        }
    },
    ai = class extends ii {
        constructor(e, t = S, n = 301, r, i, a = d, o = d, s, c = N) {
            let l = { width: e, height: e, depth: 1 },
                u = [l, l, l, l, l, l];
            (super(e, e, t, n, r, i, a, o, s, c),
                (this.image = u),
                (this.isCubeDepthTexture = !0),
                (this.isCubeTexture = !0));
        }
        get images() {
            return this.image;
        }
        set images(e) {
            this.image = e;
        }
    },
    oi = class extends At {
        constructor(e = null) {
            (super(), (this.sourceTexture = e), (this.isExternalTexture = !0));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.sourceTexture = e.sourceTexture),
                this
            );
        }
    },
    si = class e extends pr {
        constructor(e = 1, t = 1, n = 1, r = 1, i = 1, a = 1) {
            (super(),
                (this.type = `BoxGeometry`),
                (this.parameters = {
                    width: e,
                    height: t,
                    depth: n,
                    widthSegments: r,
                    heightSegments: i,
                    depthSegments: a,
                }));
            let o = this;
            ((r = Math.floor(r)), (i = Math.floor(i)), (a = Math.floor(a)));
            let s = [],
                c = [],
                l = [],
                u = [],
                d = 0,
                f = 0;
            (p(`z`, `y`, `x`, -1, -1, n, t, e, a, i, 0),
                p(`z`, `y`, `x`, 1, -1, n, t, -e, a, i, 1),
                p(`x`, `z`, `y`, 1, 1, e, n, t, r, a, 2),
                p(`x`, `z`, `y`, 1, -1, e, n, -t, r, a, 3),
                p(`x`, `y`, `z`, 1, -1, e, t, n, r, i, 4),
                p(`x`, `y`, `z`, -1, -1, e, t, -n, r, i, 5),
                this.setIndex(s),
                this.setAttribute(`position`, new tr(c, 3)),
                this.setAttribute(`normal`, new tr(l, 3)),
                this.setAttribute(`uv`, new tr(u, 2)));
            function p(e, t, n, r, i, a, p, m, h, g, _) {
                let v = a / h,
                    y = p / g,
                    b = a / 2,
                    x = p / 2,
                    S = m / 2,
                    C = h + 1,
                    w = g + 1,
                    T = 0,
                    E = 0,
                    D = new J();
                for (let a = 0; a < w; a++) {
                    let o = a * y - x;
                    for (let s = 0; s < C; s++)
                        ((D[e] = (s * v - b) * r),
                            (D[t] = o * i),
                            (D[n] = S),
                            c.push(D.x, D.y, D.z),
                            (D[e] = 0),
                            (D[t] = 0),
                            (D[n] = m > 0 ? 1 : -1),
                            l.push(D.x, D.y, D.z),
                            u.push(s / h),
                            u.push(1 - a / g),
                            (T += 1));
                }
                for (let e = 0; e < g; e++)
                    for (let t = 0; t < h; t++) {
                        let n = d + t + C * e,
                            r = d + t + C * (e + 1),
                            i = d + (t + 1) + C * (e + 1),
                            a = d + (t + 1) + C * e;
                        (s.push(n, r, a), s.push(r, i, a), (E += 6));
                    }
                (o.addGroup(f, E, _), (f += E), (d += T));
            }
        }
        copy(e) {
            return (
                super.copy(e),
                (this.parameters = Object.assign({}, e.parameters)),
                this
            );
        }
        static fromJSON(t) {
            return new e(
                t.width,
                t.height,
                t.depth,
                t.widthSegments,
                t.heightSegments,
                t.depthSegments,
            );
        }
    },
    ci = class e extends pr {
        constructor(e = 1, t = 1, n = 1, r = 1) {
            (super(),
                (this.type = `PlaneGeometry`),
                (this.parameters = {
                    width: e,
                    height: t,
                    widthSegments: n,
                    heightSegments: r,
                }));
            let i = e / 2,
                a = t / 2,
                o = Math.floor(n),
                s = Math.floor(r),
                c = o + 1,
                l = s + 1,
                u = e / o,
                d = t / s,
                f = [],
                p = [],
                m = [],
                h = [];
            for (let e = 0; e < l; e++) {
                let t = e * d - a;
                for (let n = 0; n < c; n++) {
                    let r = n * u - i;
                    (p.push(r, -t, 0),
                        m.push(0, 0, 1),
                        h.push(n / o),
                        h.push(1 - e / s));
                }
            }
            for (let e = 0; e < s; e++)
                for (let t = 0; t < o; t++) {
                    let n = t + c * e,
                        r = t + c * (e + 1),
                        i = t + 1 + c * (e + 1),
                        a = t + 1 + c * e;
                    (f.push(n, r, a), f.push(r, i, a));
                }
            (this.setIndex(f),
                this.setAttribute(`position`, new tr(p, 3)),
                this.setAttribute(`normal`, new tr(m, 3)),
                this.setAttribute(`uv`, new tr(h, 2)));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.parameters = Object.assign({}, e.parameters)),
                this
            );
        }
        static fromJSON(t) {
            return new e(t.width, t.height, t.widthSegments, t.heightSegments);
        }
    };
function li(e) {
    let t = {};
    for (let n in e) {
        t[n] = {};
        for (let r in e[n]) {
            let i = e[n][r];
            if (di(i))
                i.isRenderTargetTexture
                    ? (W(
                          `UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`,
                      ),
                      (t[n][r] = null))
                    : (t[n][r] = i.clone());
            else if (Array.isArray(i))
                if (di(i[0])) {
                    let e = [];
                    for (let t = 0, n = i.length; t < n; t++)
                        e[t] = i[t].clone();
                    t[n][r] = e;
                } else t[n][r] = i.slice();
            else t[n][r] = i;
        }
    }
    return t;
}
function ui(e) {
    let t = {};
    for (let n = 0; n < e.length; n++) {
        let r = li(e[n]);
        for (let e in r) t[e] = r[e];
    }
    return t;
}
function di(e) {
    return (
        e &&
        (e.isColor ||
            e.isMatrix3 ||
            e.isMatrix4 ||
            e.isVector2 ||
            e.isVector3 ||
            e.isVector4 ||
            e.isTexture ||
            e.isQuaternion)
    );
}
function fi(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) t.push(e[n].clone());
    return t;
}
function pi(e) {
    let t = e.getRenderTarget();
    return t === null
        ? e.outputColorSpace
        : t.isXRRenderTarget === !0
          ? t.texture.colorSpace
          : X.workingColorSpace;
}
var mi = { clone: li, merge: ui },
    hi = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
    gi = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,
    _i = class extends hr {
        constructor(e) {
            (super(),
                (this.isShaderMaterial = !0),
                (this.type = `ShaderMaterial`),
                (this.defines = {}),
                (this.uniforms = {}),
                (this.uniformsGroups = []),
                (this.vertexShader = hi),
                (this.fragmentShader = gi),
                (this.linewidth = 1),
                (this.wireframe = !1),
                (this.wireframeLinewidth = 1),
                (this.fog = !1),
                (this.lights = !1),
                (this.clipping = !1),
                (this.forceSinglePass = !0),
                (this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
                (this.defaultAttributeValues = {
                    color: [1, 1, 1],
                    uv: [0, 0],
                    uv1: [0, 0],
                }),
                (this.index0AttributeName = void 0),
                (this.uniformsNeedUpdate = !1),
                (this.glslVersion = null),
                e !== void 0 && this.setValues(e));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.fragmentShader = e.fragmentShader),
                (this.vertexShader = e.vertexShader),
                (this.uniforms = li(e.uniforms)),
                (this.uniformsGroups = fi(e.uniformsGroups)),
                (this.defines = Object.assign({}, e.defines)),
                (this.wireframe = e.wireframe),
                (this.wireframeLinewidth = e.wireframeLinewidth),
                (this.fog = e.fog),
                (this.lights = e.lights),
                (this.clipping = e.clipping),
                (this.extensions = Object.assign({}, e.extensions)),
                (this.glslVersion = e.glslVersion),
                (this.defaultAttributeValues = Object.assign(
                    {},
                    e.defaultAttributeValues,
                )),
                (this.index0AttributeName = e.index0AttributeName),
                (this.uniformsNeedUpdate = e.uniformsNeedUpdate),
                this
            );
        }
        toJSON(e) {
            let t = super.toJSON(e);
            ((t.glslVersion = this.glslVersion), (t.uniforms = {}));
            for (let n in this.uniforms) {
                let r = this.uniforms[n].value;
                r && r.isTexture
                    ? (t.uniforms[n] = { type: `t`, value: r.toJSON(e).uuid })
                    : r && r.isColor
                      ? (t.uniforms[n] = { type: `c`, value: r.getHex() })
                      : r && r.isVector2
                        ? (t.uniforms[n] = { type: `v2`, value: r.toArray() })
                        : r && r.isVector3
                          ? (t.uniforms[n] = { type: `v3`, value: r.toArray() })
                          : r && r.isVector4
                            ? (t.uniforms[n] = {
                                  type: `v4`,
                                  value: r.toArray(),
                              })
                            : r && r.isMatrix3
                              ? (t.uniforms[n] = {
                                    type: `m3`,
                                    value: r.toArray(),
                                })
                              : r && r.isMatrix4
                                ? (t.uniforms[n] = {
                                      type: `m4`,
                                      value: r.toArray(),
                                  })
                                : (t.uniforms[n] = { value: r });
            }
            (Object.keys(this.defines).length > 0 && (t.defines = this.defines),
                (t.vertexShader = this.vertexShader),
                (t.fragmentShader = this.fragmentShader),
                (t.lights = this.lights),
                (t.clipping = this.clipping));
            let n = {};
            for (let e in this.extensions)
                this.extensions[e] === !0 && (n[e] = !0);
            return (Object.keys(n).length > 0 && (t.extensions = n), t);
        }
    },
    vi = class extends _i {
        constructor(e) {
            (super(e),
                (this.isRawShaderMaterial = !0),
                (this.type = `RawShaderMaterial`));
        }
    },
    yi = class extends hr {
        constructor(e) {
            (super(),
                (this.isMeshDepthMaterial = !0),
                (this.type = `MeshDepthMaterial`),
                (this.depthPacking = ze),
                (this.map = null),
                (this.alphaMap = null),
                (this.displacementMap = null),
                (this.displacementScale = 1),
                (this.displacementBias = 0),
                (this.wireframe = !1),
                (this.wireframeLinewidth = 1),
                this.setValues(e));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.depthPacking = e.depthPacking),
                (this.map = e.map),
                (this.alphaMap = e.alphaMap),
                (this.displacementMap = e.displacementMap),
                (this.displacementScale = e.displacementScale),
                (this.displacementBias = e.displacementBias),
                (this.wireframe = e.wireframe),
                (this.wireframeLinewidth = e.wireframeLinewidth),
                this
            );
        }
    },
    bi = class extends hr {
        constructor(e) {
            (super(),
                (this.isMeshDistanceMaterial = !0),
                (this.type = `MeshDistanceMaterial`),
                (this.map = null),
                (this.alphaMap = null),
                (this.displacementMap = null),
                (this.displacementScale = 1),
                (this.displacementBias = 0),
                this.setValues(e));
        }
        copy(e) {
            return (
                super.copy(e),
                (this.map = e.map),
                (this.alphaMap = e.alphaMap),
                (this.displacementMap = e.displacementMap),
                (this.displacementScale = e.displacementScale),
                (this.displacementBias = e.displacementBias),
                this
            );
        }
    };
function xi(e, t) {
    return !e || e.constructor === t
        ? e
        : typeof t.BYTES_PER_ELEMENT == `number`
          ? new t(e)
          : Array.prototype.slice.call(e);
}
var Si = class {
        constructor(e, t, n, r) {
            ((this.parameterPositions = e),
                (this._cachedIndex = 0),
                (this.resultBuffer = r === void 0 ? new t.constructor(n) : r),
                (this.sampleValues = t),
                (this.valueSize = n),
                (this.settings = null),
                (this.DefaultSettings_ = {}));
        }
        evaluate(e) {
            let t = this.parameterPositions,
                n = this._cachedIndex,
                r = t[n],
                i = t[n - 1];
            validate_interval: {
                seek: {
                    let a;
                    linear_scan: {
                        forward_scan: if (!(e < r)) {
                            for (let a = n + 2; ; ) {
                                if (r === void 0) {
                                    if (e < i) break forward_scan;
                                    return (
                                        (n = t.length),
                                        (this._cachedIndex = n),
                                        this.copySampleValue_(n - 1)
                                    );
                                }
                                if (n === a) break;
                                if (((i = r), (r = t[++n]), e < r)) break seek;
                            }
                            a = t.length;
                            break linear_scan;
                        }
                        if (!(e >= i)) {
                            let o = t[1];
                            e < o && ((n = 2), (i = o));
                            for (let a = n - 2; ; ) {
                                if (i === void 0)
                                    return (
                                        (this._cachedIndex = 0),
                                        this.copySampleValue_(0)
                                    );
                                if (n === a) break;
                                if (((r = i), (i = t[--n - 1]), e >= i))
                                    break seek;
                            }
                            ((a = n), (n = 0));
                            break linear_scan;
                        }
                        break validate_interval;
                    }
                    for (; n < a; ) {
                        let r = (n + a) >>> 1;
                        e < t[r] ? (a = r) : (n = r + 1);
                    }
                    if (((r = t[n]), (i = t[n - 1]), i === void 0))
                        return (
                            (this._cachedIndex = 0),
                            this.copySampleValue_(0)
                        );
                    if (r === void 0)
                        return (
                            (n = t.length),
                            (this._cachedIndex = n),
                            this.copySampleValue_(n - 1)
                        );
                }
                ((this._cachedIndex = n), this.intervalChanged_(n, i, r));
            }
            return this.interpolate_(n, i, e, r);
        }
        getSettings_() {
            return this.settings || this.DefaultSettings_;
        }
        copySampleValue_(e) {
            let t = this.resultBuffer,
                n = this.sampleValues,
                r = this.valueSize,
                i = e * r;
            for (let e = 0; e !== r; ++e) t[e] = n[i + e];
            return t;
        }
        interpolate_() {
            throw Error(`call to abstract method`);
        }
        intervalChanged_() {}
    },
    Ci = class extends Si {
        constructor(e, t, n, r) {
            (super(e, t, n, r),
                (this._weightPrev = -0),
                (this._offsetPrev = -0),
                (this._weightNext = -0),
                (this._offsetNext = -0),
                (this.DefaultSettings_ = { endingStart: Ie, endingEnd: Ie }));
        }
        intervalChanged_(e, t, n) {
            let r = this.parameterPositions,
                i = e - 2,
                a = e + 1,
                o = r[i],
                s = r[a];
            if (o === void 0)
                switch (this.getSettings_().endingStart) {
                    case Le:
                        ((i = e), (o = 2 * t - n));
                        break;
                    case Re:
                        ((i = r.length - 2), (o = t + r[i] - r[i + 1]));
                        break;
                    default:
                        ((i = e), (o = n));
                }
            if (s === void 0)
                switch (this.getSettings_().endingEnd) {
                    case Le:
                        ((a = e), (s = 2 * n - t));
                        break;
                    case Re:
                        ((a = 1), (s = n + r[1] - r[0]));
                        break;
                    default:
                        ((a = e - 1), (s = t));
                }
            let c = (n - t) * 0.5,
                l = this.valueSize;
            ((this._weightPrev = c / (t - o)),
                (this._weightNext = c / (s - n)),
                (this._offsetPrev = i * l),
                (this._offsetNext = a * l));
        }
        interpolate_(e, t, n, r) {
            let i = this.resultBuffer,
                a = this.sampleValues,
                o = this.valueSize,
                s = e * o,
                c = s - o,
                l = this._offsetPrev,
                u = this._offsetNext,
                d = this._weightPrev,
                f = this._weightNext,
                p = (n - t) / (r - t),
                m = p * p,
                h = m * p,
                g = -d * h + 2 * d * m - d * p,
                _ = (1 + d) * h + (-1.5 - 2 * d) * m + (-0.5 + d) * p + 1,
                v = (-1 - f) * h + (1.5 + f) * m + 0.5 * p,
                y = f * h - f * m;
            for (let e = 0; e !== o; ++e)
                i[e] =
                    g * a[l + e] + _ * a[c + e] + v * a[s + e] + y * a[u + e];
            return i;
        }
    },
    wi = class extends Si {
        constructor(e, t, n, r) {
            super(e, t, n, r);
        }
        interpolate_(e, t, n, r) {
            let i = this.resultBuffer,
                a = this.sampleValues,
                o = this.valueSize,
                s = e * o,
                c = s - o,
                l = (n - t) / (r - t),
                u = 1 - l;
            for (let e = 0; e !== o; ++e) i[e] = a[c + e] * u + a[s + e] * l;
            return i;
        }
    },
    Ti = class extends Si {
        constructor(e, t, n, r) {
            super(e, t, n, r);
        }
        interpolate_(e) {
            return this.copySampleValue_(e - 1);
        }
    },
    Ei = class extends Si {
        interpolate_(e, t, n, r) {
            let i = this.resultBuffer,
                a = this.sampleValues,
                o = this.valueSize,
                s = e * o,
                c = s - o,
                l = this.settings || this.DefaultSettings_,
                u = l.inTangents,
                d = l.outTangents;
            if (!u || !d) {
                let e = (n - t) / (r - t),
                    l = 1 - e;
                for (let t = 0; t !== o; ++t)
                    i[t] = a[c + t] * l + a[s + t] * e;
                return i;
            }
            let f = o * 2,
                p = e - 1;
            for (let l = 0; l !== o; ++l) {
                let o = a[c + l],
                    m = a[s + l],
                    h = p * f + l * 2,
                    g = d[h],
                    _ = d[h + 1],
                    v = e * f + l * 2,
                    y = u[v],
                    b = u[v + 1],
                    x = (n - t) / (r - t),
                    S,
                    C,
                    w,
                    T,
                    E;
                for (let e = 0; e < 8; e++) {
                    ((S = x * x),
                        (C = S * x),
                        (w = 1 - x),
                        (T = w * w),
                        (E = T * w));
                    let e = E * t + 3 * T * x * g + 3 * w * S * y + C * r - n;
                    if (Math.abs(e) < 1e-10) break;
                    let i =
                        3 * T * (g - t) + 6 * w * x * (y - g) + 3 * S * (r - y);
                    if (Math.abs(i) < 1e-10) break;
                    ((x -= e / i), (x = Math.max(0, Math.min(1, x))));
                }
                i[l] = E * o + 3 * T * x * _ + 3 * w * S * b + C * m;
            }
            return i;
        }
    },
    Di = class {
        constructor(e, t, n, r) {
            if (e === void 0)
                throw Error(`THREE.KeyframeTrack: track name is undefined`);
            if (t === void 0 || t.length === 0)
                throw Error(
                    `THREE.KeyframeTrack: no keyframes in track named ` + e,
                );
            ((this.name = e),
                (this.times = xi(t, this.TimeBufferType)),
                (this.values = xi(n, this.ValueBufferType)),
                this.setInterpolation(r || this.DefaultInterpolation));
        }
        static toJSON(e) {
            let t = e.constructor,
                n;
            if (t.toJSON !== this.toJSON) n = t.toJSON(e);
            else {
                n = {
                    name: e.name,
                    times: xi(e.times, Array),
                    values: xi(e.values, Array),
                };
                let t = e.getInterpolation();
                t !== e.DefaultInterpolation && (n.interpolation = t);
            }
            return ((n.type = e.ValueTypeName), n);
        }
        InterpolantFactoryMethodDiscrete(e) {
            return new Ti(this.times, this.values, this.getValueSize(), e);
        }
        InterpolantFactoryMethodLinear(e) {
            return new wi(this.times, this.values, this.getValueSize(), e);
        }
        InterpolantFactoryMethodSmooth(e) {
            return new Ci(this.times, this.values, this.getValueSize(), e);
        }
        InterpolantFactoryMethodBezier(e) {
            let t = new Ei(this.times, this.values, this.getValueSize(), e);
            return (this.settings && (t.settings = this.settings), t);
        }
        setInterpolation(e) {
            let t;
            switch (e) {
                case Me:
                    t = this.InterpolantFactoryMethodDiscrete;
                    break;
                case Ne:
                    t = this.InterpolantFactoryMethodLinear;
                    break;
                case Pe:
                    t = this.InterpolantFactoryMethodSmooth;
                    break;
                case Fe:
                    t = this.InterpolantFactoryMethodBezier;
                    break;
            }
            if (t === void 0) {
                let t =
                    `unsupported interpolation for ` +
                    this.ValueTypeName +
                    ` keyframe track named ` +
                    this.name;
                if (this.createInterpolant === void 0)
                    if (e !== this.DefaultInterpolation)
                        this.setInterpolation(this.DefaultInterpolation);
                    else throw Error(t);
                return (W(`KeyframeTrack:`, t), this);
            }
            return ((this.createInterpolant = t), this);
        }
        getInterpolation() {
            switch (this.createInterpolant) {
                case this.InterpolantFactoryMethodDiscrete:
                    return Me;
                case this.InterpolantFactoryMethodLinear:
                    return Ne;
                case this.InterpolantFactoryMethodSmooth:
                    return Pe;
                case this.InterpolantFactoryMethodBezier:
                    return Fe;
            }
        }
        getValueSize() {
            return this.values.length / this.times.length;
        }
        shift(e) {
            if (e !== 0) {
                let t = this.times;
                for (let n = 0, r = t.length; n !== r; ++n) t[n] += e;
            }
            return this;
        }
        scale(e) {
            if (e !== 1) {
                let t = this.times;
                for (let n = 0, r = t.length; n !== r; ++n) t[n] *= e;
            }
            return this;
        }
        trim(e, t) {
            let n = this.times,
                r = n.length,
                i = 0,
                a = r - 1;
            for (; i !== r && n[i] < e; ) ++i;
            for (; a !== -1 && n[a] > t; ) --a;
            if ((++a, i !== 0 || a !== r)) {
                i >= a && ((a = Math.max(a, 1)), (i = a - 1));
                let e = this.getValueSize();
                ((this.times = n.slice(i, a)),
                    (this.values = this.values.slice(i * e, a * e)));
            }
            return this;
        }
        validate() {
            let e = !0,
                t = this.getValueSize();
            t - Math.floor(t) !== 0 &&
                (G(`KeyframeTrack: Invalid value size in track.`, this),
                (e = !1));
            let n = this.times,
                r = this.values,
                i = n.length;
            i === 0 && (G(`KeyframeTrack: Track is empty.`, this), (e = !1));
            let a = null;
            for (let t = 0; t !== i; t++) {
                let r = n[t];
                if (typeof r == `number` && isNaN(r)) {
                    (G(
                        `KeyframeTrack: Time is not a valid number.`,
                        this,
                        t,
                        r,
                    ),
                        (e = !1));
                    break;
                }
                if (a !== null && a > r) {
                    (G(`KeyframeTrack: Out of order keys.`, this, t, r, a),
                        (e = !1));
                    break;
                }
                a = r;
            }
            if (r !== void 0 && Ye(r))
                for (let t = 0, n = r.length; t !== n; ++t) {
                    let n = r[t];
                    if (isNaN(n)) {
                        (G(
                            `KeyframeTrack: Value is not a valid number.`,
                            this,
                            t,
                            n,
                        ),
                            (e = !1));
                        break;
                    }
                }
            return e;
        }
        optimize() {
            let e = this.times.slice(),
                t = this.values.slice(),
                n = this.getValueSize(),
                r = this.getInterpolation() === Pe,
                i = e.length - 1,
                a = 1;
            for (let o = 1; o < i; ++o) {
                let i = !1,
                    s = e[o];
                if (s !== e[o + 1] && (o !== 1 || s !== e[0]))
                    if (r) i = !0;
                    else {
                        let e = o * n,
                            r = e - n,
                            a = e + n;
                        for (let o = 0; o !== n; ++o) {
                            let n = t[e + o];
                            if (n !== t[r + o] || n !== t[a + o]) {
                                i = !0;
                                break;
                            }
                        }
                    }
                if (i) {
                    if (o !== a) {
                        e[a] = e[o];
                        let r = o * n,
                            i = a * n;
                        for (let e = 0; e !== n; ++e) t[i + e] = t[r + e];
                    }
                    ++a;
                }
            }
            if (i > 0) {
                e[a] = e[i];
                for (let e = i * n, r = a * n, o = 0; o !== n; ++o)
                    t[r + o] = t[e + o];
                ++a;
            }
            return (
                a === e.length
                    ? ((this.times = e), (this.values = t))
                    : ((this.times = e.slice(0, a)),
                      (this.values = t.slice(0, a * n))),
                this
            );
        }
        clone() {
            let e = this.times.slice(),
                t = this.values.slice(),
                n = this.constructor,
                r = new n(this.name, e, t);
            return ((r.createInterpolant = this.createInterpolant), r);
        }
    };
((Di.prototype.ValueTypeName = ``),
    (Di.prototype.TimeBufferType = Float32Array),
    (Di.prototype.ValueBufferType = Float32Array),
    (Di.prototype.DefaultInterpolation = Ne));
var Oi = class extends Di {
    constructor(e, t, n) {
        super(e, t, n);
    }
};
((Oi.prototype.ValueTypeName = `bool`),
    (Oi.prototype.ValueBufferType = Array),
    (Oi.prototype.DefaultInterpolation = Me),
    (Oi.prototype.InterpolantFactoryMethodLinear = void 0),
    (Oi.prototype.InterpolantFactoryMethodSmooth = void 0));
var ki = class extends Di {
    constructor(e, t, n, r) {
        super(e, t, n, r);
    }
};
ki.prototype.ValueTypeName = `color`;
var Ai = class extends Di {
    constructor(e, t, n, r) {
        super(e, t, n, r);
    }
};
Ai.prototype.ValueTypeName = `number`;
var ji = class extends Si {
        constructor(e, t, n, r) {
            super(e, t, n, r);
        }
        interpolate_(e, t, n, r) {
            let i = this.resultBuffer,
                a = this.sampleValues,
                o = this.valueSize,
                s = (n - t) / (r - t),
                c = e * o;
            for (let e = c + o; c !== e; c += 4)
                mt.slerpFlat(i, 0, a, c - o, a, c, s);
            return i;
        }
    },
    Mi = class extends Di {
        constructor(e, t, n, r) {
            super(e, t, n, r);
        }
        InterpolantFactoryMethodLinear(e) {
            return new ji(this.times, this.values, this.getValueSize(), e);
        }
    };
((Mi.prototype.ValueTypeName = `quaternion`),
    (Mi.prototype.InterpolantFactoryMethodSmooth = void 0));
var Ni = class extends Di {
    constructor(e, t, n) {
        super(e, t, n);
    }
};
((Ni.prototype.ValueTypeName = `string`),
    (Ni.prototype.ValueBufferType = Array),
    (Ni.prototype.DefaultInterpolation = Me),
    (Ni.prototype.InterpolantFactoryMethodLinear = void 0),
    (Ni.prototype.InterpolantFactoryMethodSmooth = void 0));
var Pi = class extends Di {
    constructor(e, t, n, r) {
        super(e, t, n, r);
    }
};
Pi.prototype.ValueTypeName = `vector`;
var Fi = {
    enabled: !1,
    files: {},
    add: function (e, t) {
        this.enabled !== !1 && (Ii(e) || (this.files[e] = t));
    },
    get: function (e) {
        if (this.enabled !== !1 && !Ii(e)) return this.files[e];
    },
    remove: function (e) {
        delete this.files[e];
    },
    clear: function () {
        this.files = {};
    },
};
function Ii(e) {
    try {
        let t = e.slice(e.indexOf(`:`) + 1);
        return new URL(t).protocol === `blob:`;
    } catch {
        return !1;
    }
}
var Li = new (class {
        constructor(e, t, n) {
            let r = this,
                i = !1,
                a = 0,
                o = 0,
                s,
                c = [];
            ((this.onStart = void 0),
                (this.onLoad = e),
                (this.onProgress = t),
                (this.onError = n),
                (this._abortController = null),
                (this.itemStart = function (e) {
                    (o++,
                        i === !1 && r.onStart !== void 0 && r.onStart(e, a, o),
                        (i = !0));
                }),
                (this.itemEnd = function (e) {
                    (a++,
                        r.onProgress !== void 0 && r.onProgress(e, a, o),
                        a === o &&
                            ((i = !1), r.onLoad !== void 0 && r.onLoad()));
                }),
                (this.itemError = function (e) {
                    r.onError !== void 0 && r.onError(e);
                }),
                (this.resolveURL = function (e) {
                    return s ? s(e) : e;
                }),
                (this.setURLModifier = function (e) {
                    return ((s = e), this);
                }),
                (this.addHandler = function (e, t) {
                    return (c.push(e, t), this);
                }),
                (this.removeHandler = function (e) {
                    let t = c.indexOf(e);
                    return (t !== -1 && c.splice(t, 2), this);
                }),
                (this.getHandler = function (e) {
                    for (let t = 0, n = c.length; t < n; t += 2) {
                        let n = c[t],
                            r = c[t + 1];
                        if ((n.global && (n.lastIndex = 0), n.test(e)))
                            return r;
                    }
                    return null;
                }),
                (this.abort = function () {
                    return (
                        this.abortController.abort(),
                        (this._abortController = null),
                        this
                    );
                }));
        }
        get abortController() {
            return (
                (this._abortController ||= new AbortController()),
                this._abortController
            );
        }
    })(),
    Ri = class {
        constructor(e) {
            ((this.manager = e === void 0 ? Li : e),
                (this.crossOrigin = `anonymous`),
                (this.withCredentials = !1),
                (this.path = ``),
                (this.resourcePath = ``),
                (this.requestHeader = {}),
                typeof __THREE_DEVTOOLS__ < `u` &&
                    __THREE_DEVTOOLS__.dispatchEvent(
                        new CustomEvent(`observe`, { detail: this }),
                    ));
        }
        load() {}
        loadAsync(e, t) {
            let n = this;
            return new Promise(function (r, i) {
                n.load(e, r, t, i);
            });
        }
        parse() {}
        setCrossOrigin(e) {
            return ((this.crossOrigin = e), this);
        }
        setWithCredentials(e) {
            return ((this.withCredentials = e), this);
        }
        setPath(e) {
            return ((this.path = e), this);
        }
        setResourcePath(e) {
            return ((this.resourcePath = e), this);
        }
        setRequestHeader(e) {
            return ((this.requestHeader = e), this);
        }
        abort() {
            return this;
        }
    };
Ri.DEFAULT_MATERIAL_NAME = `__DEFAULT`;
var zi = new WeakMap(),
    Bi = class extends Ri {
        constructor(e) {
            super(e);
        }
        load(e, t, n, r) {
            (this.path !== void 0 && (e = this.path + e),
                (e = this.manager.resolveURL(e)));
            let i = this,
                a = Fi.get(`image:${e}`);
            if (a !== void 0) {
                if (a.complete === !0)
                    (i.manager.itemStart(e),
                        setTimeout(function () {
                            (t && t(a), i.manager.itemEnd(e));
                        }, 0));
                else {
                    let e = zi.get(a);
                    (e === void 0 && ((e = []), zi.set(a, e)),
                        e.push({ onLoad: t, onError: r }));
                }
                return a;
            }
            let o = Xe(`img`);
            function s() {
                (l(), t && t(this));
                let n = zi.get(this) || [];
                for (let e = 0; e < n.length; e++) {
                    let t = n[e];
                    t.onLoad && t.onLoad(this);
                }
                (zi.delete(this), i.manager.itemEnd(e));
            }
            function c(t) {
                (l(), r && r(t), Fi.remove(`image:${e}`));
                let n = zi.get(this) || [];
                for (let e = 0; e < n.length; e++) {
                    let r = n[e];
                    r.onError && r.onError(t);
                }
                (zi.delete(this), i.manager.itemError(e), i.manager.itemEnd(e));
            }
            function l() {
                (o.removeEventListener(`load`, s, !1),
                    o.removeEventListener(`error`, c, !1));
            }
            return (
                o.addEventListener(`load`, s, !1),
                o.addEventListener(`error`, c, !1),
                e.slice(0, 5) !== `data:` &&
                    this.crossOrigin !== void 0 &&
                    (o.crossOrigin = this.crossOrigin),
                Fi.add(`image:${e}`, o),
                i.manager.itemStart(e),
                (o.src = e),
                o
            );
        }
    },
    Vi = class extends Ri {
        constructor(e) {
            super(e);
        }
        load(e, t, n, r) {
            let i = new At(),
                a = new Bi(this.manager);
            return (
                a.setCrossOrigin(this.crossOrigin),
                a.setPath(this.path),
                a.load(
                    e,
                    function (e) {
                        ((i.image = e),
                            (i.needsUpdate = !0),
                            t !== void 0 && t(i));
                    },
                    n,
                    r,
                ),
                i
            );
        }
    },
    Hi = new J(),
    Ui = new mt(),
    Wi = new J(),
    Gi = class extends un {
        constructor() {
            (super(),
                (this.isCamera = !0),
                (this.type = `Camera`),
                (this.matrixWorldInverse = new It()),
                (this.projectionMatrix = new It()),
                (this.projectionMatrixInverse = new It()),
                (this.coordinateSystem = qe),
                (this._reversedDepth = !1));
        }
        get reversedDepth() {
            return this._reversedDepth;
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                this.matrixWorldInverse.copy(e.matrixWorldInverse),
                this.projectionMatrix.copy(e.projectionMatrix),
                this.projectionMatrixInverse.copy(e.projectionMatrixInverse),
                (this.coordinateSystem = e.coordinateSystem),
                this
            );
        }
        getWorldDirection(e) {
            return super.getWorldDirection(e).negate();
        }
        updateMatrixWorld(e) {
            (super.updateMatrixWorld(e),
                this.matrixWorld.decompose(Hi, Ui, Wi),
                Wi.x === 1 && Wi.y === 1 && Wi.z === 1
                    ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
                    : this.matrixWorldInverse
                          .compose(Hi, Ui, Wi.set(1, 1, 1))
                          .invert());
        }
        updateWorldMatrix(e, t) {
            (super.updateWorldMatrix(e, t),
                this.matrixWorld.decompose(Hi, Ui, Wi),
                Wi.x === 1 && Wi.y === 1 && Wi.z === 1
                    ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
                    : this.matrixWorldInverse
                          .compose(Hi, Ui, Wi.set(1, 1, 1))
                          .invert());
        }
        clone() {
            return new this.constructor().copy(this);
        }
    },
    Ki = new J(),
    qi = new q(),
    Ji = new q(),
    Yi = class extends Gi {
        constructor(e = 50, t = 1, n = 0.1, r = 2e3) {
            (super(),
                (this.isPerspectiveCamera = !0),
                (this.type = `PerspectiveCamera`),
                (this.fov = e),
                (this.zoom = 1),
                (this.near = n),
                (this.far = r),
                (this.focus = 10),
                (this.aspect = t),
                (this.view = null),
                (this.filmGauge = 35),
                (this.filmOffset = 0),
                this.updateProjectionMatrix());
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                (this.fov = e.fov),
                (this.zoom = e.zoom),
                (this.near = e.near),
                (this.far = e.far),
                (this.focus = e.focus),
                (this.aspect = e.aspect),
                (this.view =
                    e.view === null ? null : Object.assign({}, e.view)),
                (this.filmGauge = e.filmGauge),
                (this.filmOffset = e.filmOffset),
                this
            );
        }
        setFocalLength(e) {
            let t = (0.5 * this.getFilmHeight()) / e;
            ((this.fov = ct * 2 * Math.atan(t)), this.updateProjectionMatrix());
        }
        getFocalLength() {
            let e = Math.tan(st * 0.5 * this.fov);
            return (0.5 * this.getFilmHeight()) / e;
        }
        getEffectiveFOV() {
            return (
                ct * 2 * Math.atan(Math.tan(st * 0.5 * this.fov) / this.zoom)
            );
        }
        getFilmWidth() {
            return this.filmGauge * Math.min(this.aspect, 1);
        }
        getFilmHeight() {
            return this.filmGauge / Math.max(this.aspect, 1);
        }
        getViewBounds(e, t, n) {
            (Ki.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
                t.set(Ki.x, Ki.y).multiplyScalar(-e / Ki.z),
                Ki.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
                n.set(Ki.x, Ki.y).multiplyScalar(-e / Ki.z));
        }
        getViewSize(e, t) {
            return (this.getViewBounds(e, qi, Ji), t.subVectors(Ji, qi));
        }
        setViewOffset(e, t, n, r, i, a) {
            ((this.aspect = e / t),
                this.view === null &&
                    (this.view = {
                        enabled: !0,
                        fullWidth: 1,
                        fullHeight: 1,
                        offsetX: 0,
                        offsetY: 0,
                        width: 1,
                        height: 1,
                    }),
                (this.view.enabled = !0),
                (this.view.fullWidth = e),
                (this.view.fullHeight = t),
                (this.view.offsetX = n),
                (this.view.offsetY = r),
                (this.view.width = i),
                (this.view.height = a),
                this.updateProjectionMatrix());
        }
        clearViewOffset() {
            (this.view !== null && (this.view.enabled = !1),
                this.updateProjectionMatrix());
        }
        updateProjectionMatrix() {
            let e = this.near,
                t = (e * Math.tan(st * 0.5 * this.fov)) / this.zoom,
                n = 2 * t,
                r = this.aspect * n,
                i = -0.5 * r,
                a = this.view;
            if (this.view !== null && this.view.enabled) {
                let e = a.fullWidth,
                    o = a.fullHeight;
                ((i += (a.offsetX * r) / e),
                    (t -= (a.offsetY * n) / o),
                    (r *= a.width / e),
                    (n *= a.height / o));
            }
            let o = this.filmOffset;
            (o !== 0 && (i += (e * o) / this.getFilmWidth()),
                this.projectionMatrix.makePerspective(
                    i,
                    i + r,
                    t,
                    t - n,
                    e,
                    this.far,
                    this.coordinateSystem,
                    this.reversedDepth,
                ),
                this.projectionMatrixInverse
                    .copy(this.projectionMatrix)
                    .invert());
        }
        toJSON(e) {
            let t = super.toJSON(e);
            return (
                (t.object.fov = this.fov),
                (t.object.zoom = this.zoom),
                (t.object.near = this.near),
                (t.object.far = this.far),
                (t.object.focus = this.focus),
                (t.object.aspect = this.aspect),
                this.view !== null &&
                    (t.object.view = Object.assign({}, this.view)),
                (t.object.filmGauge = this.filmGauge),
                (t.object.filmOffset = this.filmOffset),
                t
            );
        }
    },
    Xi = class extends Gi {
        constructor(e = -1, t = 1, n = 1, r = -1, i = 0.1, a = 2e3) {
            (super(),
                (this.isOrthographicCamera = !0),
                (this.type = `OrthographicCamera`),
                (this.zoom = 1),
                (this.view = null),
                (this.left = e),
                (this.right = t),
                (this.top = n),
                (this.bottom = r),
                (this.near = i),
                (this.far = a),
                this.updateProjectionMatrix());
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                (this.left = e.left),
                (this.right = e.right),
                (this.top = e.top),
                (this.bottom = e.bottom),
                (this.near = e.near),
                (this.far = e.far),
                (this.zoom = e.zoom),
                (this.view =
                    e.view === null ? null : Object.assign({}, e.view)),
                this
            );
        }
        setViewOffset(e, t, n, r, i, a) {
            (this.view === null &&
                (this.view = {
                    enabled: !0,
                    fullWidth: 1,
                    fullHeight: 1,
                    offsetX: 0,
                    offsetY: 0,
                    width: 1,
                    height: 1,
                }),
                (this.view.enabled = !0),
                (this.view.fullWidth = e),
                (this.view.fullHeight = t),
                (this.view.offsetX = n),
                (this.view.offsetY = r),
                (this.view.width = i),
                (this.view.height = a),
                this.updateProjectionMatrix());
        }
        clearViewOffset() {
            (this.view !== null && (this.view.enabled = !1),
                this.updateProjectionMatrix());
        }
        updateProjectionMatrix() {
            let e = (this.right - this.left) / (2 * this.zoom),
                t = (this.top - this.bottom) / (2 * this.zoom),
                n = (this.right + this.left) / 2,
                r = (this.top + this.bottom) / 2,
                i = n - e,
                a = n + e,
                o = r + t,
                s = r - t;
            if (this.view !== null && this.view.enabled) {
                let e =
                        (this.right - this.left) /
                        this.view.fullWidth /
                        this.zoom,
                    t =
                        (this.top - this.bottom) /
                        this.view.fullHeight /
                        this.zoom;
                ((i += e * this.view.offsetX),
                    (a = i + e * this.view.width),
                    (o -= t * this.view.offsetY),
                    (s = o - t * this.view.height));
            }
            (this.projectionMatrix.makeOrthographic(
                i,
                a,
                o,
                s,
                this.near,
                this.far,
                this.coordinateSystem,
                this.reversedDepth,
            ),
                this.projectionMatrixInverse
                    .copy(this.projectionMatrix)
                    .invert());
        }
        toJSON(e) {
            let t = super.toJSON(e);
            return (
                (t.object.zoom = this.zoom),
                (t.object.left = this.left),
                (t.object.right = this.right),
                (t.object.top = this.top),
                (t.object.bottom = this.bottom),
                (t.object.near = this.near),
                (t.object.far = this.far),
                this.view !== null &&
                    (t.object.view = Object.assign({}, this.view)),
                t
            );
        }
    },
    Zi = -90,
    Qi = 1,
    $i = class extends un {
        constructor(e, t, n) {
            (super(),
                (this.type = `CubeCamera`),
                (this.renderTarget = n),
                (this.coordinateSystem = null),
                (this.activeMipmapLevel = 0));
            let r = new Yi(Zi, Qi, e, t);
            ((r.layers = this.layers), this.add(r));
            let i = new Yi(Zi, Qi, e, t);
            ((i.layers = this.layers), this.add(i));
            let a = new Yi(Zi, Qi, e, t);
            ((a.layers = this.layers), this.add(a));
            let o = new Yi(Zi, Qi, e, t);
            ((o.layers = this.layers), this.add(o));
            let s = new Yi(Zi, Qi, e, t);
            ((s.layers = this.layers), this.add(s));
            let c = new Yi(Zi, Qi, e, t);
            ((c.layers = this.layers), this.add(c));
        }
        updateCoordinateSystem() {
            let e = this.coordinateSystem,
                t = this.children.concat(),
                [n, r, i, a, o, s] = t;
            for (let e of t) this.remove(e);
            if (e === 2e3)
                (n.up.set(0, 1, 0),
                    n.lookAt(1, 0, 0),
                    r.up.set(0, 1, 0),
                    r.lookAt(-1, 0, 0),
                    i.up.set(0, 0, -1),
                    i.lookAt(0, 1, 0),
                    a.up.set(0, 0, 1),
                    a.lookAt(0, -1, 0),
                    o.up.set(0, 1, 0),
                    o.lookAt(0, 0, 1),
                    s.up.set(0, 1, 0),
                    s.lookAt(0, 0, -1));
            else if (e === 2001)
                (n.up.set(0, -1, 0),
                    n.lookAt(-1, 0, 0),
                    r.up.set(0, -1, 0),
                    r.lookAt(1, 0, 0),
                    i.up.set(0, 0, 1),
                    i.lookAt(0, 1, 0),
                    a.up.set(0, 0, -1),
                    a.lookAt(0, -1, 0),
                    o.up.set(0, -1, 0),
                    o.lookAt(0, 0, 1),
                    s.up.set(0, -1, 0),
                    s.lookAt(0, 0, -1));
            else
                throw Error(
                    `THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: ` +
                        e,
                );
            for (let e of t) (this.add(e), e.updateMatrixWorld());
        }
        update(e, t) {
            this.parent === null && this.updateMatrixWorld();
            let { renderTarget: n, activeMipmapLevel: r } = this;
            this.coordinateSystem !== e.coordinateSystem &&
                ((this.coordinateSystem = e.coordinateSystem),
                this.updateCoordinateSystem());
            let [i, a, o, s, c, l] = this.children,
                u = e.getRenderTarget(),
                d = e.getActiveCubeFace(),
                f = e.getActiveMipmapLevel(),
                p = e.xr.enabled;
            e.xr.enabled = !1;
            let m = n.texture.generateMipmaps;
            n.texture.generateMipmaps = !1;
            let h = !1;
            ((h =
                e.isWebGLRenderer === !0
                    ? e.state.buffers.depth.getReversed()
                    : e.reversedDepthBuffer),
                e.setRenderTarget(n, 0, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, i),
                e.setRenderTarget(n, 1, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, a),
                e.setRenderTarget(n, 2, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, o),
                e.setRenderTarget(n, 3, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, s),
                e.setRenderTarget(n, 4, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, c),
                (n.texture.generateMipmaps = m),
                e.setRenderTarget(n, 5, r),
                h && e.autoClear === !1 && e.clearDepth(),
                e.render(t, l),
                e.setRenderTarget(u, d, f),
                (e.xr.enabled = p),
                (n.texture.needsPMREMUpdate = !0));
        }
    },
    ea = class extends Yi {
        constructor(e = []) {
            (super(),
                (this.isArrayCamera = !0),
                (this.isMultiViewCamera = !1),
                (this.cameras = e));
        }
    },
    ta = class {
        constructor() {
            ((this._previousTime = 0),
                (this._currentTime = 0),
                (this._startTime = performance.now()),
                (this._delta = 0),
                (this._elapsed = 0),
                (this._timescale = 1),
                (this._document = null),
                (this._pageVisibilityHandler = null));
        }
        connect(e) {
            ((this._document = e),
                e.hidden !== void 0 &&
                    ((this._pageVisibilityHandler = na.bind(this)),
                    e.addEventListener(
                        `visibilitychange`,
                        this._pageVisibilityHandler,
                        !1,
                    )));
        }
        disconnect() {
            (this._pageVisibilityHandler !== null &&
                (this._document.removeEventListener(
                    `visibilitychange`,
                    this._pageVisibilityHandler,
                ),
                (this._pageVisibilityHandler = null)),
                (this._document = null));
        }
        getDelta() {
            return this._delta / 1e3;
        }
        getElapsed() {
            return this._elapsed / 1e3;
        }
        getTimescale() {
            return this._timescale;
        }
        setTimescale(e) {
            return ((this._timescale = e), this);
        }
        reset() {
            return (
                (this._currentTime = performance.now() - this._startTime),
                this
            );
        }
        dispose() {
            this.disconnect();
        }
        update(e) {
            return (
                this._pageVisibilityHandler !== null &&
                this._document.hidden === !0
                    ? (this._delta = 0)
                    : ((this._previousTime = this._currentTime),
                      (this._currentTime =
                          (e === void 0 ? performance.now() : e) -
                          this._startTime),
                      (this._delta =
                          (this._currentTime - this._previousTime) *
                          this._timescale),
                      (this._elapsed += this._delta)),
                this
            );
        }
    };
function na() {
    this._document.hidden === !1 && this.reset();
}
var ra = `\\[\\]\\.:\\/`,
    ia = RegExp(`[\\[\\]\\.:\\/]`, `g`),
    aa = `[^\\[\\]\\.:\\/]`,
    oa = `[^` + ra.replace(`\\.`, ``) + `]`,
    sa = `((?:WC+[\\/:])*)`.replace(`WC`, aa),
    ca = `(WCOD+)?`.replace(`WCOD`, oa),
    la = `(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`, aa),
    ua = `\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`, aa),
    da = RegExp(`^` + sa + ca + la + ua + `$`),
    fa = [`material`, `materials`, `bones`, `map`],
    pa = class {
        constructor(e, t, n) {
            let r = n || ma.parseTrackName(t);
            ((this._targetGroup = e), (this._bindings = e.subscribe_(t, r)));
        }
        getValue(e, t) {
            this.bind();
            let n = this._targetGroup.nCachedObjects_,
                r = this._bindings[n];
            r !== void 0 && r.getValue(e, t);
        }
        setValue(e, t) {
            let n = this._bindings;
            for (
                let r = this._targetGroup.nCachedObjects_, i = n.length;
                r !== i;
                ++r
            )
                n[r].setValue(e, t);
        }
        bind() {
            let e = this._bindings;
            for (
                let t = this._targetGroup.nCachedObjects_, n = e.length;
                t !== n;
                ++t
            )
                e[t].bind();
        }
        unbind() {
            let e = this._bindings;
            for (
                let t = this._targetGroup.nCachedObjects_, n = e.length;
                t !== n;
                ++t
            )
                e[t].unbind();
        }
    },
    ma = class e {
        constructor(t, n, r) {
            ((this.path = n),
                (this.parsedPath = r || e.parseTrackName(n)),
                (this.node = e.findNode(t, this.parsedPath.nodeName)),
                (this.rootNode = t),
                (this.getValue = this._getValue_unbound),
                (this.setValue = this._setValue_unbound));
        }
        static create(t, n, r) {
            return t && t.isAnimationObjectGroup
                ? new e.Composite(t, n, r)
                : new e(t, n, r);
        }
        static sanitizeNodeName(e) {
            return e.replace(/\s/g, `_`).replace(ia, ``);
        }
        static parseTrackName(e) {
            let t = da.exec(e);
            if (t === null)
                throw Error(`PropertyBinding: Cannot parse trackName: ` + e);
            let n = {
                    nodeName: t[2],
                    objectName: t[3],
                    objectIndex: t[4],
                    propertyName: t[5],
                    propertyIndex: t[6],
                },
                r = n.nodeName && n.nodeName.lastIndexOf(`.`);
            if (r !== void 0 && r !== -1) {
                let e = n.nodeName.substring(r + 1);
                fa.indexOf(e) !== -1 &&
                    ((n.nodeName = n.nodeName.substring(0, r)),
                    (n.objectName = e));
            }
            if (n.propertyName === null || n.propertyName.length === 0)
                throw Error(
                    `PropertyBinding: can not parse propertyName from trackName: ` +
                        e,
                );
            return n;
        }
        static findNode(e, t) {
            if (
                t === void 0 ||
                t === `` ||
                t === `.` ||
                t === -1 ||
                t === e.name ||
                t === e.uuid
            )
                return e;
            if (e.skeleton) {
                let n = e.skeleton.getBoneByName(t);
                if (n !== void 0) return n;
            }
            if (e.children) {
                let n = function (e) {
                        for (let r = 0; r < e.length; r++) {
                            let i = e[r];
                            if (i.name === t || i.uuid === t) return i;
                            let a = n(i.children);
                            if (a) return a;
                        }
                        return null;
                    },
                    r = n(e.children);
                if (r) return r;
            }
            return null;
        }
        _getValue_unavailable() {}
        _setValue_unavailable() {}
        _getValue_direct(e, t) {
            e[t] = this.targetObject[this.propertyName];
        }
        _getValue_array(e, t) {
            let n = this.resolvedProperty;
            for (let r = 0, i = n.length; r !== i; ++r) e[t++] = n[r];
        }
        _getValue_arrayElement(e, t) {
            e[t] = this.resolvedProperty[this.propertyIndex];
        }
        _getValue_toArray(e, t) {
            this.resolvedProperty.toArray(e, t);
        }
        _setValue_direct(e, t) {
            this.targetObject[this.propertyName] = e[t];
        }
        _setValue_direct_setNeedsUpdate(e, t) {
            ((this.targetObject[this.propertyName] = e[t]),
                (this.targetObject.needsUpdate = !0));
        }
        _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
            ((this.targetObject[this.propertyName] = e[t]),
                (this.targetObject.matrixWorldNeedsUpdate = !0));
        }
        _setValue_array(e, t) {
            let n = this.resolvedProperty;
            for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
        }
        _setValue_array_setNeedsUpdate(e, t) {
            let n = this.resolvedProperty;
            for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
            this.targetObject.needsUpdate = !0;
        }
        _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
            let n = this.resolvedProperty;
            for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
            this.targetObject.matrixWorldNeedsUpdate = !0;
        }
        _setValue_arrayElement(e, t) {
            this.resolvedProperty[this.propertyIndex] = e[t];
        }
        _setValue_arrayElement_setNeedsUpdate(e, t) {
            ((this.resolvedProperty[this.propertyIndex] = e[t]),
                (this.targetObject.needsUpdate = !0));
        }
        _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
            ((this.resolvedProperty[this.propertyIndex] = e[t]),
                (this.targetObject.matrixWorldNeedsUpdate = !0));
        }
        _setValue_fromArray(e, t) {
            this.resolvedProperty.fromArray(e, t);
        }
        _setValue_fromArray_setNeedsUpdate(e, t) {
            (this.resolvedProperty.fromArray(e, t),
                (this.targetObject.needsUpdate = !0));
        }
        _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
            (this.resolvedProperty.fromArray(e, t),
                (this.targetObject.matrixWorldNeedsUpdate = !0));
        }
        _getValue_unbound(e, t) {
            (this.bind(), this.getValue(e, t));
        }
        _setValue_unbound(e, t) {
            (this.bind(), this.setValue(e, t));
        }
        bind() {
            let t = this.node,
                n = this.parsedPath,
                r = n.objectName,
                i = n.propertyName,
                a = n.propertyIndex;
            if (
                (t ||
                    ((t = e.findNode(this.rootNode, n.nodeName)),
                    (this.node = t)),
                (this.getValue = this._getValue_unavailable),
                (this.setValue = this._setValue_unavailable),
                !t)
            ) {
                W(
                    `PropertyBinding: No target node found for track: ` +
                        this.path +
                        `.`,
                );
                return;
            }
            if (r) {
                let e = n.objectIndex;
                switch (r) {
                    case `materials`:
                        if (!t.material) {
                            G(
                                `PropertyBinding: Can not bind to material as node does not have a material.`,
                                this,
                            );
                            return;
                        }
                        if (!t.material.materials) {
                            G(
                                `PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,
                                this,
                            );
                            return;
                        }
                        t = t.material.materials;
                        break;
                    case `bones`:
                        if (!t.skeleton) {
                            G(
                                `PropertyBinding: Can not bind to bones as node does not have a skeleton.`,
                                this,
                            );
                            return;
                        }
                        t = t.skeleton.bones;
                        for (let n = 0; n < t.length; n++)
                            if (t[n].name === e) {
                                e = n;
                                break;
                            }
                        break;
                    case `map`:
                        if (`map` in t) {
                            t = t.map;
                            break;
                        }
                        if (!t.material) {
                            G(
                                `PropertyBinding: Can not bind to material as node does not have a material.`,
                                this,
                            );
                            return;
                        }
                        if (!t.material.map) {
                            G(
                                `PropertyBinding: Can not bind to material.map as node.material does not have a map.`,
                                this,
                            );
                            return;
                        }
                        t = t.material.map;
                        break;
                    default:
                        if (t[r] === void 0) {
                            G(
                                `PropertyBinding: Can not bind to objectName of node undefined.`,
                                this,
                            );
                            return;
                        }
                        t = t[r];
                }
                if (e !== void 0) {
                    if (t[e] === void 0) {
                        G(
                            `PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,
                            this,
                            t,
                        );
                        return;
                    }
                    t = t[e];
                }
            }
            let o = t[i];
            if (o === void 0) {
                let e = n.nodeName;
                G(
                    `PropertyBinding: Trying to update property for track: ` +
                        e +
                        `.` +
                        i +
                        ` but it wasn't found.`,
                    t,
                );
                return;
            }
            let s = this.Versioning.None;
            ((this.targetObject = t),
                t.isMaterial === !0
                    ? (s = this.Versioning.NeedsUpdate)
                    : t.isObject3D === !0 &&
                      (s = this.Versioning.MatrixWorldNeedsUpdate));
            let c = this.BindingType.Direct;
            if (a !== void 0) {
                if (i === `morphTargetInfluences`) {
                    if (!t.geometry) {
                        G(
                            `PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,
                            this,
                        );
                        return;
                    }
                    if (!t.geometry.morphAttributes) {
                        G(
                            `PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,
                            this,
                        );
                        return;
                    }
                    t.morphTargetDictionary[a] !== void 0 &&
                        (a = t.morphTargetDictionary[a]);
                }
                ((c = this.BindingType.ArrayElement),
                    (this.resolvedProperty = o),
                    (this.propertyIndex = a));
            } else
                o.fromArray !== void 0 && o.toArray !== void 0
                    ? ((c = this.BindingType.HasFromToArray),
                      (this.resolvedProperty = o))
                    : Array.isArray(o)
                      ? ((c = this.BindingType.EntireArray),
                        (this.resolvedProperty = o))
                      : (this.propertyName = i);
            ((this.getValue = this.GetterByBindingType[c]),
                (this.setValue = this.SetterByBindingTypeAndVersioning[c][s]));
        }
        unbind() {
            ((this.node = null),
                (this.getValue = this._getValue_unbound),
                (this.setValue = this._setValue_unbound));
        }
    };
((ma.Composite = pa),
    (ma.prototype.BindingType = {
        Direct: 0,
        EntireArray: 1,
        ArrayElement: 2,
        HasFromToArray: 3,
    }),
    (ma.prototype.Versioning = {
        None: 0,
        NeedsUpdate: 1,
        MatrixWorldNeedsUpdate: 2,
    }),
    (ma.prototype.GetterByBindingType = [
        ma.prototype._getValue_direct,
        ma.prototype._getValue_array,
        ma.prototype._getValue_arrayElement,
        ma.prototype._getValue_toArray,
    ]),
    (ma.prototype.SetterByBindingTypeAndVersioning = [
        [
            ma.prototype._setValue_direct,
            ma.prototype._setValue_direct_setNeedsUpdate,
            ma.prototype._setValue_direct_setMatrixWorldNeedsUpdate,
        ],
        [
            ma.prototype._setValue_array,
            ma.prototype._setValue_array_setNeedsUpdate,
            ma.prototype._setValue_array_setMatrixWorldNeedsUpdate,
        ],
        [
            ma.prototype._setValue_arrayElement,
            ma.prototype._setValue_arrayElement_setNeedsUpdate,
            ma.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate,
        ],
        [
            ma.prototype._setValue_fromArray,
            ma.prototype._setValue_fromArray_setNeedsUpdate,
            ma.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate,
        ],
    ]),
    class e {
        static {
            e.prototype.isMatrix2 = !0;
        }
        constructor(e, t, n, r) {
            ((this.elements = [1, 0, 0, 1]),
                e !== void 0 && this.set(e, t, n, r));
        }
        identity() {
            return (this.set(1, 0, 0, 1), this);
        }
        fromArray(e, t = 0) {
            for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
            return this;
        }
        set(e, t, n, r) {
            let i = this.elements;
            return ((i[0] = e), (i[2] = t), (i[1] = n), (i[3] = r), this);
        }
    });
function ha(e, t, n, r) {
    let i = ga(r);
    switch (n) {
        case A:
            return e * t;
        case P:
            return ((e * t) / i.components) * i.byteLength;
        case F:
            return ((e * t) / i.components) * i.byteLength;
        case te:
            return ((e * t * 2) / i.components) * i.byteLength;
        case ne:
            return ((e * t * 2) / i.components) * i.byteLength;
        case j:
            return ((e * t * 3) / i.components) * i.byteLength;
        case M:
            return ((e * t * 4) / i.components) * i.byteLength;
        case re:
            return ((e * t * 4) / i.components) * i.byteLength;
        case ie:
        case I:
            return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
        case ae:
        case oe:
            return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
        case se:
        case le:
            return (Math.max(e, 16) * Math.max(t, 8)) / 4;
        case L:
        case ce:
            return (Math.max(e, 8) * Math.max(t, 8)) / 2;
        case ue:
        case de:
        case R:
        case pe:
            return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
        case fe:
        case me:
        case he:
            return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
        case ge:
            return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
        case _e:
            return Math.floor((e + 4) / 5) * Math.floor((t + 3) / 4) * 16;
        case ve:
            return Math.floor((e + 4) / 5) * Math.floor((t + 4) / 5) * 16;
        case ye:
            return Math.floor((e + 5) / 6) * Math.floor((t + 4) / 5) * 16;
        case be:
            return Math.floor((e + 5) / 6) * Math.floor((t + 5) / 6) * 16;
        case xe:
            return Math.floor((e + 7) / 8) * Math.floor((t + 4) / 5) * 16;
        case Se:
            return Math.floor((e + 7) / 8) * Math.floor((t + 5) / 6) * 16;
        case Ce:
            return Math.floor((e + 7) / 8) * Math.floor((t + 7) / 8) * 16;
        case we:
            return Math.floor((e + 9) / 10) * Math.floor((t + 4) / 5) * 16;
        case Te:
            return Math.floor((e + 9) / 10) * Math.floor((t + 5) / 6) * 16;
        case Ee:
            return Math.floor((e + 9) / 10) * Math.floor((t + 7) / 8) * 16;
        case z:
            return Math.floor((e + 9) / 10) * Math.floor((t + 9) / 10) * 16;
        case De:
            return Math.floor((e + 11) / 12) * Math.floor((t + 9) / 10) * 16;
        case B:
            return Math.floor((e + 11) / 12) * Math.floor((t + 11) / 12) * 16;
        case Oe:
        case V:
        case ke:
            return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
        case H:
        case U:
            return Math.ceil(e / 4) * Math.ceil(t / 4) * 8;
        case Ae:
        case je:
            return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
    }
    throw Error(`Unable to determine texture byte length for ${n} format.`);
}
function ga(e) {
    switch (e) {
        case _:
        case v:
            return { byteLength: 1, components: 1 };
        case b:
        case y:
        case w:
            return { byteLength: 2, components: 1 };
        case T:
        case E:
            return { byteLength: 2, components: 4 };
        case S:
        case x:
        case C:
            return { byteLength: 4, components: 1 };
        case O:
        case k:
            return { byteLength: 4, components: 3 };
    }
    throw Error(`Unknown texture type ${e}.`);
}
(typeof __THREE_DEVTOOLS__ < `u` &&
    __THREE_DEVTOOLS__.dispatchEvent(
        new CustomEvent(`register`, { detail: { revision: `184` } }),
    ),
    typeof window < `u` &&
        (window.__THREE__
            ? W(`WARNING: Multiple instances of Three.js being imported.`)
            : (window.__THREE__ = `184`)));
function _a() {
    let e = null,
        t = !1,
        n = null,
        r = null;
    function i(t, a) {
        (n(t, a), (r = e.requestAnimationFrame(i)));
    }
    return {
        start: function () {
            t !== !0 &&
                n !== null &&
                e !== null &&
                ((r = e.requestAnimationFrame(i)), (t = !0));
        },
        stop: function () {
            (e !== null && e.cancelAnimationFrame(r), (t = !1));
        },
        setAnimationLoop: function (e) {
            n = e;
        },
        setContext: function (t) {
            e = t;
        },
    };
}
function va(e) {
    let t = new WeakMap();
    function n(t, n) {
        let r = t.array,
            i = t.usage,
            a = r.byteLength,
            o = e.createBuffer();
        (e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback());
        let s;
        if (r instanceof Float32Array) s = e.FLOAT;
        else if (typeof Float16Array < `u` && r instanceof Float16Array)
            s = e.HALF_FLOAT;
        else if (r instanceof Uint16Array)
            s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
        else if (r instanceof Int16Array) s = e.SHORT;
        else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
        else if (r instanceof Int32Array) s = e.INT;
        else if (r instanceof Int8Array) s = e.BYTE;
        else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
        else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
        else
            throw Error(
                `THREE.WebGLAttributes: Unsupported buffer data format: ` + r,
            );
        return {
            buffer: o,
            type: s,
            bytesPerElement: r.BYTES_PER_ELEMENT,
            version: t.version,
            size: a,
        };
    }
    function r(t, n, r) {
        let i = n.array,
            a = n.updateRanges;
        if ((e.bindBuffer(r, t), a.length === 0)) e.bufferSubData(r, 0, i);
        else {
            a.sort((e, t) => e.start - t.start);
            let t = 0;
            for (let e = 1; e < a.length; e++) {
                let n = a[t],
                    r = a[e];
                r.start <= n.start + n.count + 1
                    ? (n.count = Math.max(n.count, r.start + r.count - n.start))
                    : (++t, (a[t] = r));
            }
            a.length = t + 1;
            for (let t = 0, n = a.length; t < n; t++) {
                let n = a[t];
                e.bufferSubData(
                    r,
                    n.start * i.BYTES_PER_ELEMENT,
                    i,
                    n.start,
                    n.count,
                );
            }
            n.clearUpdateRanges();
        }
        n.onUploadCallback();
    }
    function i(e) {
        return (e.isInterleavedBufferAttribute && (e = e.data), t.get(e));
    }
    function a(n) {
        n.isInterleavedBufferAttribute && (n = n.data);
        let r = t.get(n);
        r && (e.deleteBuffer(r.buffer), t.delete(n));
    }
    function o(e, i) {
        if (
            (e.isInterleavedBufferAttribute && (e = e.data),
            e.isGLBufferAttribute)
        ) {
            let n = t.get(e);
            (!n || n.version < e.version) &&
                t.set(e, {
                    buffer: e.buffer,
                    type: e.type,
                    bytesPerElement: e.elementSize,
                    version: e.version,
                });
            return;
        }
        let a = t.get(e);
        if (a === void 0) t.set(e, n(e, i));
        else if (a.version < e.version) {
            if (a.size !== e.array.byteLength)
                throw Error(
                    `THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`,
                );
            (r(a.buffer, e, i), (a.version = e.version));
        }
    }
    return { get: i, remove: a, update: o };
}
var Q = {
        alphahash_fragment: `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
        alphahash_pars_fragment: `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
        alphamap_fragment: `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
        alphamap_pars_fragment: `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
        alphatest_fragment: `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
        alphatest_pars_fragment: `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
        aomap_fragment: `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
        aomap_pars_fragment: `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
        batching_pars_vertex: `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,
        batching_vertex: `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
        begin_vertex: `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
        beginnormal_vertex: `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
        bsdfs: `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
        iridescence_fragment: `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
        bumpmap_pars_fragment: `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
        clipping_planes_fragment: `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
        clipping_planes_pars_fragment: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
        clipping_planes_pars_vertex: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
        clipping_planes_vertex: `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
        color_fragment: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,
        color_pars_fragment: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,
        color_pars_vertex: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,
        color_vertex: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,
        common: `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
        cube_uv_reflection_fragment: `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
        defaultnormal_vertex: `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
        displacementmap_pars_vertex: `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
        displacementmap_vertex: `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
        emissivemap_fragment: `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
        emissivemap_pars_fragment: `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
        colorspace_fragment: `gl_FragColor = linearToOutputTexel( gl_FragColor );`,
        colorspace_pars_fragment: `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
        envmap_fragment: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,
        envmap_common_pars_fragment: `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,
        envmap_pars_fragment: `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
        envmap_pars_vertex: `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
        envmap_physical_pars_fragment: `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
        envmap_vertex: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
        fog_vertex: `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
        fog_pars_vertex: `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
        fog_fragment: `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
        fog_pars_fragment: `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
        gradientmap_pars_fragment: `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
        lightmap_pars_fragment: `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
        lights_lambert_fragment: `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
        lights_lambert_pars_fragment: `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
        lights_pars_begin: `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,
        lights_toon_fragment: `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
        lights_toon_pars_fragment: `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
        lights_phong_fragment: `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
        lights_phong_pars_fragment: `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
        lights_physical_fragment: `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
        lights_physical_pars_fragment: `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
        lights_fragment_begin: `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
        lights_fragment_maps: `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
        lights_fragment_end: `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
        lightprobes_pars_fragment: `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,
        logdepthbuf_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
        logdepthbuf_pars_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
        logdepthbuf_pars_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
        logdepthbuf_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
        map_fragment: `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
        map_pars_fragment: `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
        map_particle_fragment: `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
        map_particle_pars_fragment: `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
        metalnessmap_fragment: `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
        metalnessmap_pars_fragment: `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
        morphinstance_vertex: `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
        morphcolor_vertex: `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
        morphnormal_vertex: `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
        morphtarget_pars_vertex: `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
        morphtarget_vertex: `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
        normal_fragment_begin: `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
        normal_fragment_maps: `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
        normal_pars_fragment: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
        normal_pars_vertex: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
        normal_vertex: `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
        normalmap_pars_fragment: `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
        clearcoat_normal_fragment_begin: `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
        clearcoat_normal_fragment_maps: `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
        clearcoat_pars_fragment: `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
        iridescence_pars_fragment: `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
        opaque_fragment: `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        packing: `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,
        premultiplied_alpha_fragment: `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
        project_vertex: `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
        dithering_fragment: `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
        dithering_pars_fragment: `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
        roughnessmap_fragment: `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
        roughnessmap_pars_fragment: `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
        shadowmap_pars_fragment: `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,
        shadowmap_pars_vertex: `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
        shadowmap_vertex: `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
        shadowmask_pars_fragment: `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
        skinbase_vertex: `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
        skinning_pars_vertex: `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
        skinning_vertex: `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
        skinnormal_vertex: `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
        specularmap_fragment: `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
        specularmap_pars_fragment: `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
        tonemapping_fragment: `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
        tonemapping_pars_fragment: `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
        transmission_fragment: `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
        transmission_pars_fragment: `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
        uv_pars_fragment: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
        uv_pars_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
        uv_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
        worldpos_vertex: `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,
        background_vert: `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
        background_frag: `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
        backgroundCube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
        backgroundCube_frag: `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
        cube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
        cube_frag: `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
        depth_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
        depth_frag: `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
        distance_vert: `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
        distance_frag: `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,
        equirect_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
        equirect_frag: `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
        linedashed_vert: `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
        linedashed_frag: `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
        meshbasic_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
        meshbasic_frag: `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        meshlambert_vert: `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
        meshlambert_frag: `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        meshmatcap_vert: `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
        meshmatcap_frag: `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        meshnormal_vert: `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
        meshnormal_frag: `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
        meshphong_vert: `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
        meshphong_frag: `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        meshphysical_vert: `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
        meshphysical_frag: `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        meshtoon_vert: `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
        meshtoon_frag: `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
        points_vert: `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
        points_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
        shadow_vert: `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
        shadow_frag: `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
        sprite_vert: `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
        sprite_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
    },
    $ = {
        common: {
            diffuse: { value: new Z(16777215) },
            opacity: { value: 1 },
            map: { value: null },
            mapTransform: { value: new Y() },
            alphaMap: { value: null },
            alphaMapTransform: { value: new Y() },
            alphaTest: { value: 0 },
        },
        specularmap: {
            specularMap: { value: null },
            specularMapTransform: { value: new Y() },
        },
        envmap: {
            envMap: { value: null },
            envMapRotation: { value: new Y() },
            reflectivity: { value: 1 },
            ior: { value: 1.5 },
            refractionRatio: { value: 0.98 },
            dfgLUT: { value: null },
        },
        aomap: {
            aoMap: { value: null },
            aoMapIntensity: { value: 1 },
            aoMapTransform: { value: new Y() },
        },
        lightmap: {
            lightMap: { value: null },
            lightMapIntensity: { value: 1 },
            lightMapTransform: { value: new Y() },
        },
        bumpmap: {
            bumpMap: { value: null },
            bumpMapTransform: { value: new Y() },
            bumpScale: { value: 1 },
        },
        normalmap: {
            normalMap: { value: null },
            normalMapTransform: { value: new Y() },
            normalScale: { value: new q(1, 1) },
        },
        displacementmap: {
            displacementMap: { value: null },
            displacementMapTransform: { value: new Y() },
            displacementScale: { value: 1 },
            displacementBias: { value: 0 },
        },
        emissivemap: {
            emissiveMap: { value: null },
            emissiveMapTransform: { value: new Y() },
        },
        metalnessmap: {
            metalnessMap: { value: null },
            metalnessMapTransform: { value: new Y() },
        },
        roughnessmap: {
            roughnessMap: { value: null },
            roughnessMapTransform: { value: new Y() },
        },
        gradientmap: { gradientMap: { value: null } },
        fog: {
            fogDensity: { value: 25e-5 },
            fogNear: { value: 1 },
            fogFar: { value: 2e3 },
            fogColor: { value: new Z(16777215) },
        },
        lights: {
            ambientLightColor: { value: [] },
            lightProbe: { value: [] },
            directionalLights: {
                value: [],
                properties: { direction: {}, color: {} },
            },
            directionalLightShadows: {
                value: [],
                properties: {
                    shadowIntensity: 1,
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {},
                },
            },
            directionalShadowMatrix: { value: [] },
            spotLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    direction: {},
                    distance: {},
                    coneCos: {},
                    penumbraCos: {},
                    decay: {},
                },
            },
            spotLightShadows: {
                value: [],
                properties: {
                    shadowIntensity: 1,
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {},
                },
            },
            spotLightMap: { value: [] },
            spotLightMatrix: { value: [] },
            pointLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    decay: {},
                    distance: {},
                },
            },
            pointLightShadows: {
                value: [],
                properties: {
                    shadowIntensity: 1,
                    shadowBias: {},
                    shadowNormalBias: {},
                    shadowRadius: {},
                    shadowMapSize: {},
                    shadowCameraNear: {},
                    shadowCameraFar: {},
                },
            },
            pointShadowMatrix: { value: [] },
            hemisphereLights: {
                value: [],
                properties: { direction: {}, skyColor: {}, groundColor: {} },
            },
            rectAreaLights: {
                value: [],
                properties: { color: {}, position: {}, width: {}, height: {} },
            },
            ltc_1: { value: null },
            ltc_2: { value: null },
            probesSH: { value: null },
            probesMin: { value: new J() },
            probesMax: { value: new J() },
            probesResolution: { value: new J() },
        },
        points: {
            diffuse: { value: new Z(16777215) },
            opacity: { value: 1 },
            size: { value: 1 },
            scale: { value: 1 },
            map: { value: null },
            alphaMap: { value: null },
            alphaMapTransform: { value: new Y() },
            alphaTest: { value: 0 },
            uvTransform: { value: new Y() },
        },
        sprite: {
            diffuse: { value: new Z(16777215) },
            opacity: { value: 1 },
            center: { value: new q(0.5, 0.5) },
            rotation: { value: 0 },
            map: { value: null },
            mapTransform: { value: new Y() },
            alphaMap: { value: null },
            alphaMapTransform: { value: new Y() },
            alphaTest: { value: 0 },
        },
    },
    ya = {
        basic: {
            uniforms: ui([
                $.common,
                $.specularmap,
                $.envmap,
                $.aomap,
                $.lightmap,
                $.fog,
            ]),
            vertexShader: Q.meshbasic_vert,
            fragmentShader: Q.meshbasic_frag,
        },
        lambert: {
            uniforms: ui([
                $.common,
                $.specularmap,
                $.envmap,
                $.aomap,
                $.lightmap,
                $.emissivemap,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                $.fog,
                $.lights,
                {
                    emissive: { value: new Z(0) },
                    envMapIntensity: { value: 1 },
                },
            ]),
            vertexShader: Q.meshlambert_vert,
            fragmentShader: Q.meshlambert_frag,
        },
        phong: {
            uniforms: ui([
                $.common,
                $.specularmap,
                $.envmap,
                $.aomap,
                $.lightmap,
                $.emissivemap,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                $.fog,
                $.lights,
                {
                    emissive: { value: new Z(0) },
                    specular: { value: new Z(1118481) },
                    shininess: { value: 30 },
                    envMapIntensity: { value: 1 },
                },
            ]),
            vertexShader: Q.meshphong_vert,
            fragmentShader: Q.meshphong_frag,
        },
        standard: {
            uniforms: ui([
                $.common,
                $.envmap,
                $.aomap,
                $.lightmap,
                $.emissivemap,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                $.roughnessmap,
                $.metalnessmap,
                $.fog,
                $.lights,
                {
                    emissive: { value: new Z(0) },
                    roughness: { value: 1 },
                    metalness: { value: 0 },
                    envMapIntensity: { value: 1 },
                },
            ]),
            vertexShader: Q.meshphysical_vert,
            fragmentShader: Q.meshphysical_frag,
        },
        toon: {
            uniforms: ui([
                $.common,
                $.aomap,
                $.lightmap,
                $.emissivemap,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                $.gradientmap,
                $.fog,
                $.lights,
                { emissive: { value: new Z(0) } },
            ]),
            vertexShader: Q.meshtoon_vert,
            fragmentShader: Q.meshtoon_frag,
        },
        matcap: {
            uniforms: ui([
                $.common,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                $.fog,
                { matcap: { value: null } },
            ]),
            vertexShader: Q.meshmatcap_vert,
            fragmentShader: Q.meshmatcap_frag,
        },
        points: {
            uniforms: ui([$.points, $.fog]),
            vertexShader: Q.points_vert,
            fragmentShader: Q.points_frag,
        },
        dashed: {
            uniforms: ui([
                $.common,
                $.fog,
                {
                    scale: { value: 1 },
                    dashSize: { value: 1 },
                    totalSize: { value: 2 },
                },
            ]),
            vertexShader: Q.linedashed_vert,
            fragmentShader: Q.linedashed_frag,
        },
        depth: {
            uniforms: ui([$.common, $.displacementmap]),
            vertexShader: Q.depth_vert,
            fragmentShader: Q.depth_frag,
        },
        normal: {
            uniforms: ui([
                $.common,
                $.bumpmap,
                $.normalmap,
                $.displacementmap,
                { opacity: { value: 1 } },
            ]),
            vertexShader: Q.meshnormal_vert,
            fragmentShader: Q.meshnormal_frag,
        },
        sprite: {
            uniforms: ui([$.sprite, $.fog]),
            vertexShader: Q.sprite_vert,
            fragmentShader: Q.sprite_frag,
        },
        background: {
            uniforms: {
                uvTransform: { value: new Y() },
                t2D: { value: null },
                backgroundIntensity: { value: 1 },
            },
            vertexShader: Q.background_vert,
            fragmentShader: Q.background_frag,
        },
        backgroundCube: {
            uniforms: {
                envMap: { value: null },
                backgroundBlurriness: { value: 0 },
                backgroundIntensity: { value: 1 },
                backgroundRotation: { value: new Y() },
            },
            vertexShader: Q.backgroundCube_vert,
            fragmentShader: Q.backgroundCube_frag,
        },
        cube: {
            uniforms: {
                tCube: { value: null },
                tFlip: { value: -1 },
                opacity: { value: 1 },
            },
            vertexShader: Q.cube_vert,
            fragmentShader: Q.cube_frag,
        },
        equirect: {
            uniforms: { tEquirect: { value: null } },
            vertexShader: Q.equirect_vert,
            fragmentShader: Q.equirect_frag,
        },
        distance: {
            uniforms: ui([
                $.common,
                $.displacementmap,
                {
                    referencePosition: { value: new J() },
                    nearDistance: { value: 1 },
                    farDistance: { value: 1e3 },
                },
            ]),
            vertexShader: Q.distance_vert,
            fragmentShader: Q.distance_frag,
        },
        shadow: {
            uniforms: ui([
                $.lights,
                $.fog,
                { color: { value: new Z(0) }, opacity: { value: 1 } },
            ]),
            vertexShader: Q.shadow_vert,
            fragmentShader: Q.shadow_frag,
        },
    };
ya.physical = {
    uniforms: ui([
        ya.standard.uniforms,
        {
            clearcoat: { value: 0 },
            clearcoatMap: { value: null },
            clearcoatMapTransform: { value: new Y() },
            clearcoatNormalMap: { value: null },
            clearcoatNormalMapTransform: { value: new Y() },
            clearcoatNormalScale: { value: new q(1, 1) },
            clearcoatRoughness: { value: 0 },
            clearcoatRoughnessMap: { value: null },
            clearcoatRoughnessMapTransform: { value: new Y() },
            dispersion: { value: 0 },
            iridescence: { value: 0 },
            iridescenceMap: { value: null },
            iridescenceMapTransform: { value: new Y() },
            iridescenceIOR: { value: 1.3 },
            iridescenceThicknessMinimum: { value: 100 },
            iridescenceThicknessMaximum: { value: 400 },
            iridescenceThicknessMap: { value: null },
            iridescenceThicknessMapTransform: { value: new Y() },
            sheen: { value: 0 },
            sheenColor: { value: new Z(0) },
            sheenColorMap: { value: null },
            sheenColorMapTransform: { value: new Y() },
            sheenRoughness: { value: 1 },
            sheenRoughnessMap: { value: null },
            sheenRoughnessMapTransform: { value: new Y() },
            transmission: { value: 0 },
            transmissionMap: { value: null },
            transmissionMapTransform: { value: new Y() },
            transmissionSamplerSize: { value: new q() },
            transmissionSamplerMap: { value: null },
            thickness: { value: 0 },
            thicknessMap: { value: null },
            thicknessMapTransform: { value: new Y() },
            attenuationDistance: { value: 0 },
            attenuationColor: { value: new Z(0) },
            specularColor: { value: new Z(1, 1, 1) },
            specularColorMap: { value: null },
            specularColorMapTransform: { value: new Y() },
            specularIntensity: { value: 1 },
            specularIntensityMap: { value: null },
            specularIntensityMapTransform: { value: new Y() },
            anisotropyVector: { value: new q() },
            anisotropyMap: { value: null },
            anisotropyMapTransform: { value: new Y() },
        },
    ]),
    vertexShader: Q.meshphysical_vert,
    fragmentShader: Q.meshphysical_frag,
};
var ba = { r: 0, b: 0, g: 0 },
    xa = new It(),
    Sa = new Y();
Sa.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function Ca(e, t, n, r, i, a) {
    let o = new Z(0),
        s = i === !0 ? 0 : 1,
        c,
        l,
        u = null,
        d = 0,
        f = null;
    function p(e) {
        let n = e.isScene === !0 ? e.background : null;
        if (n && n.isTexture) {
            let r = e.backgroundBlurriness > 0;
            n = t.get(n, r);
        }
        return n;
    }
    function m(t) {
        let r = !1,
            i = p(t);
        i === null ? g(o, s) : i && i.isColor && (g(i, 1), (r = !0));
        let c = e.xr.getEnvironmentBlendMode();
        (c === `additive`
            ? n.buffers.color.setClear(0, 0, 0, 1, a)
            : c === `alpha-blend` && n.buffers.color.setClear(0, 0, 0, 0, a),
            (e.autoClear || r) &&
                (n.buffers.depth.setTest(!0),
                n.buffers.depth.setMask(!0),
                n.buffers.color.setMask(!0),
                e.clear(
                    e.autoClearColor,
                    e.autoClearDepth,
                    e.autoClearStencil,
                )));
    }
    function h(t, n) {
        let i = p(n);
        i && (i.isCubeTexture || i.mapping === 306)
            ? (l === void 0 &&
                  ((l = new Ir(
                      new si(1, 1, 1),
                      new _i({
                          name: `BackgroundCubeMaterial`,
                          uniforms: li(ya.backgroundCube.uniforms),
                          vertexShader: ya.backgroundCube.vertexShader,
                          fragmentShader: ya.backgroundCube.fragmentShader,
                          side: 1,
                          depthTest: !1,
                          depthWrite: !1,
                          fog: !1,
                          allowOverride: !1,
                      }),
                  )),
                  l.geometry.deleteAttribute(`normal`),
                  l.geometry.deleteAttribute(`uv`),
                  (l.onBeforeRender = function (e, t, n) {
                      this.matrixWorld.copyPosition(n.matrixWorld);
                  }),
                  Object.defineProperty(l.material, "envMap", {
                      get: function () {
                          return this.uniforms.envMap.value;
                      },
                  }),
                  r.update(l)),
              (l.material.uniforms.envMap.value = i),
              (l.material.uniforms.backgroundBlurriness.value =
                  n.backgroundBlurriness),
              (l.material.uniforms.backgroundIntensity.value =
                  n.backgroundIntensity),
              l.material.uniforms.backgroundRotation.value
                  .setFromMatrix4(
                      xa.makeRotationFromEuler(n.backgroundRotation),
                  )
                  .transpose(),
              i.isCubeTexture &&
                  i.isRenderTargetTexture === !1 &&
                  l.material.uniforms.backgroundRotation.value.premultiply(Sa),
              (l.material.toneMapped = X.getTransfer(i.colorSpace) !== Ue),
              (u !== i || d !== i.version || f !== e.toneMapping) &&
                  ((l.material.needsUpdate = !0),
                  (u = i),
                  (d = i.version),
                  (f = e.toneMapping)),
              l.layers.enableAll(),
              t.unshift(l, l.geometry, l.material, 0, 0, null))
            : i &&
              i.isTexture &&
              (c === void 0 &&
                  ((c = new Ir(
                      new ci(2, 2),
                      new _i({
                          name: `BackgroundMaterial`,
                          uniforms: li(ya.background.uniforms),
                          vertexShader: ya.background.vertexShader,
                          fragmentShader: ya.background.fragmentShader,
                          side: 0,
                          depthTest: !1,
                          depthWrite: !1,
                          fog: !1,
                          allowOverride: !1,
                      }),
                  )),
                  c.geometry.deleteAttribute(`normal`),
                  Object.defineProperty(c.material, "map", {
                      get: function () {
                          return this.uniforms.t2D.value;
                      },
                  }),
                  r.update(c)),
              (c.material.uniforms.t2D.value = i),
              (c.material.uniforms.backgroundIntensity.value =
                  n.backgroundIntensity),
              (c.material.toneMapped = X.getTransfer(i.colorSpace) !== Ue),
              i.matrixAutoUpdate === !0 && i.updateMatrix(),
              c.material.uniforms.uvTransform.value.copy(i.matrix),
              (u !== i || d !== i.version || f !== e.toneMapping) &&
                  ((c.material.needsUpdate = !0),
                  (u = i),
                  (d = i.version),
                  (f = e.toneMapping)),
              c.layers.enableAll(),
              t.unshift(c, c.geometry, c.material, 0, 0, null));
    }
    function g(t, r) {
        (t.getRGB(ba, pi(e)), n.buffers.color.setClear(ba.r, ba.g, ba.b, r, a));
    }
    function _() {
        (l !== void 0 &&
            (l.geometry.dispose(), l.material.dispose(), (l = void 0)),
            c !== void 0 &&
                (c.geometry.dispose(), c.material.dispose(), (c = void 0)));
    }
    return {
        getClearColor: function () {
            return o;
        },
        setClearColor: function (e, t = 1) {
            (o.set(e), (s = t), g(o, s));
        },
        getClearAlpha: function () {
            return s;
        },
        setClearAlpha: function (e) {
            ((s = e), g(o, s));
        },
        render: m,
        addToRenderList: h,
        dispose: _,
    };
}
function wa(e, t) {
    let n = e.getParameter(e.MAX_VERTEX_ATTRIBS),
        r = {},
        i = f(null),
        a = i,
        o = !1;
    function s(n, r, i, s, c) {
        let u = !1,
            f = d(n, s, i, r);
        (a !== f && ((a = f), l(a.object)),
            (u = p(n, s, i, c)),
            u && m(n, s, i, c),
            c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER),
            (u || o) &&
                ((o = !1),
                b(n, r, i, s),
                c !== null &&
                    e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer)));
    }
    function c() {
        return e.createVertexArray();
    }
    function l(t) {
        return e.bindVertexArray(t);
    }
    function u(t) {
        return e.deleteVertexArray(t);
    }
    function d(e, t, n, i) {
        let a = i.wireframe === !0,
            o = r[t.id];
        o === void 0 && ((o = {}), (r[t.id] = o));
        let s = e.isInstancedMesh === !0 ? e.id : 0,
            l = o[s];
        l === void 0 && ((l = {}), (o[s] = l));
        let u = l[n.id];
        u === void 0 && ((u = {}), (l[n.id] = u));
        let d = u[a];
        return (d === void 0 && ((d = f(c())), (u[a] = d)), d);
    }
    function f(e) {
        let t = [],
            r = [],
            i = [];
        for (let e = 0; e < n; e++) ((t[e] = 0), (r[e] = 0), (i[e] = 0));
        return {
            geometry: null,
            program: null,
            wireframe: !1,
            newAttributes: t,
            enabledAttributes: r,
            attributeDivisors: i,
            object: e,
            attributes: {},
            index: null,
        };
    }
    function p(e, t, n, r) {
        let i = a.attributes,
            o = t.attributes,
            s = 0,
            c = n.getAttributes();
        for (let t in c)
            if (c[t].location >= 0) {
                let n = i[t],
                    r = o[t];
                if (
                    (r === void 0 &&
                        (t === `instanceMatrix` &&
                            e.instanceMatrix &&
                            (r = e.instanceMatrix),
                        t === `instanceColor` &&
                            e.instanceColor &&
                            (r = e.instanceColor)),
                    n === void 0 ||
                        n.attribute !== r ||
                        (r && n.data !== r.data))
                )
                    return !0;
                s++;
            }
        return a.attributesNum !== s || a.index !== r;
    }
    function m(e, t, n, r) {
        let i = {},
            o = t.attributes,
            s = 0,
            c = n.getAttributes();
        for (let t in c)
            if (c[t].location >= 0) {
                let n = o[t];
                n === void 0 &&
                    (t === `instanceMatrix` &&
                        e.instanceMatrix &&
                        (n = e.instanceMatrix),
                    t === `instanceColor` &&
                        e.instanceColor &&
                        (n = e.instanceColor));
                let r = {};
                ((r.attribute = n),
                    n && n.data && (r.data = n.data),
                    (i[t] = r),
                    s++);
            }
        ((a.attributes = i), (a.attributesNum = s), (a.index = r));
    }
    function h() {
        let e = a.newAttributes;
        for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
    }
    function g(e) {
        _(e, 0);
    }
    function _(t, n) {
        let r = a.newAttributes,
            i = a.enabledAttributes,
            o = a.attributeDivisors;
        ((r[t] = 1),
            i[t] === 0 && (e.enableVertexAttribArray(t), (i[t] = 1)),
            o[t] !== n && (e.vertexAttribDivisor(t, n), (o[t] = n)));
    }
    function v() {
        let t = a.newAttributes,
            n = a.enabledAttributes;
        for (let r = 0, i = n.length; r < i; r++)
            n[r] !== t[r] && (e.disableVertexAttribArray(r), (n[r] = 0));
    }
    function y(t, n, r, i, a, o, s) {
        s === !0
            ? e.vertexAttribIPointer(t, n, r, a, o)
            : e.vertexAttribPointer(t, n, r, i, a, o);
    }
    function b(n, r, i, a) {
        h();
        let o = a.attributes,
            s = i.getAttributes(),
            c = r.defaultAttributeValues;
        for (let r in s) {
            let i = s[r];
            if (i.location >= 0) {
                let s = o[r];
                if (
                    (s === void 0 &&
                        (r === `instanceMatrix` &&
                            n.instanceMatrix &&
                            (s = n.instanceMatrix),
                        r === `instanceColor` &&
                            n.instanceColor &&
                            (s = n.instanceColor)),
                    s !== void 0)
                ) {
                    let r = s.normalized,
                        o = s.itemSize,
                        c = t.get(s);
                    if (c === void 0) continue;
                    let l = c.buffer,
                        u = c.type,
                        d = c.bytesPerElement,
                        f =
                            u === e.INT ||
                            u === e.UNSIGNED_INT ||
                            s.gpuType === 1013;
                    if (s.isInterleavedBufferAttribute) {
                        let t = s.data,
                            c = t.stride,
                            p = s.offset;
                        if (t.isInstancedInterleavedBuffer) {
                            for (let e = 0; e < i.locationSize; e++)
                                _(i.location + e, t.meshPerAttribute);
                            n.isInstancedMesh !== !0 &&
                                a._maxInstanceCount === void 0 &&
                                (a._maxInstanceCount =
                                    t.meshPerAttribute * t.count);
                        } else
                            for (let e = 0; e < i.locationSize; e++)
                                g(i.location + e);
                        e.bindBuffer(e.ARRAY_BUFFER, l);
                        for (let e = 0; e < i.locationSize; e++)
                            y(
                                i.location + e,
                                o / i.locationSize,
                                u,
                                r,
                                c * d,
                                (p + (o / i.locationSize) * e) * d,
                                f,
                            );
                    } else {
                        if (s.isInstancedBufferAttribute) {
                            for (let e = 0; e < i.locationSize; e++)
                                _(i.location + e, s.meshPerAttribute);
                            n.isInstancedMesh !== !0 &&
                                a._maxInstanceCount === void 0 &&
                                (a._maxInstanceCount =
                                    s.meshPerAttribute * s.count);
                        } else
                            for (let e = 0; e < i.locationSize; e++)
                                g(i.location + e);
                        e.bindBuffer(e.ARRAY_BUFFER, l);
                        for (let e = 0; e < i.locationSize; e++)
                            y(
                                i.location + e,
                                o / i.locationSize,
                                u,
                                r,
                                o * d,
                                (o / i.locationSize) * e * d,
                                f,
                            );
                    }
                } else if (c !== void 0) {
                    let t = c[r];
                    if (t !== void 0)
                        switch (t.length) {
                            case 2:
                                e.vertexAttrib2fv(i.location, t);
                                break;
                            case 3:
                                e.vertexAttrib3fv(i.location, t);
                                break;
                            case 4:
                                e.vertexAttrib4fv(i.location, t);
                                break;
                            default:
                                e.vertexAttrib1fv(i.location, t);
                        }
                }
            }
        }
        v();
    }
    function x() {
        T();
        for (let e in r) {
            let t = r[e];
            for (let e in t) {
                let n = t[e];
                for (let e in n) {
                    let t = n[e];
                    for (let e in t) (u(t[e].object), delete t[e]);
                    delete n[e];
                }
            }
            delete r[e];
        }
    }
    function S(e) {
        if (r[e.id] === void 0) return;
        let t = r[e.id];
        for (let e in t) {
            let n = t[e];
            for (let e in n) {
                let t = n[e];
                for (let e in t) (u(t[e].object), delete t[e]);
                delete n[e];
            }
        }
        delete r[e.id];
    }
    function C(e) {
        for (let t in r) {
            let n = r[t];
            for (let t in n) {
                let r = n[t];
                if (r[e.id] === void 0) continue;
                let i = r[e.id];
                for (let e in i) (u(i[e].object), delete i[e]);
                delete r[e.id];
            }
        }
    }
    function w(e) {
        for (let t in r) {
            let n = r[t],
                i = e.isInstancedMesh === !0 ? e.id : 0,
                a = n[i];
            if (a !== void 0) {
                for (let e in a) {
                    let t = a[e];
                    for (let e in t) (u(t[e].object), delete t[e]);
                    delete a[e];
                }
                (delete n[i], Object.keys(n).length === 0 && delete r[t]);
            }
        }
    }
    function T() {
        (E(), (o = !0), a !== i && ((a = i), l(a.object)));
    }
    function E() {
        ((i.geometry = null), (i.program = null), (i.wireframe = !1));
    }
    return {
        setup: s,
        reset: T,
        resetDefaultState: E,
        dispose: x,
        releaseStatesOfGeometry: S,
        releaseStatesOfObject: w,
        releaseStatesOfProgram: C,
        initAttributes: h,
        enableAttribute: g,
        disableUnusedAttributes: v,
    };
}
function Ta(e, t, n) {
    let r;
    function i(e) {
        r = e;
    }
    function a(t, i) {
        (e.drawArrays(r, t, i), n.update(i, r, 1));
    }
    function o(t, i, a) {
        a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
    }
    function s(e, i, a) {
        if (a === 0) return;
        t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r, e, 0, i, 0, a);
        let o = 0;
        for (let e = 0; e < a; e++) o += i[e];
        n.update(o, r, 1);
    }
    ((this.setMode = i),
        (this.render = a),
        (this.renderInstances = o),
        (this.renderMultiDraw = s));
}
function Ea(e, t, n, r) {
    let i;
    function a() {
        if (i !== void 0) return i;
        if (t.has(`EXT_texture_filter_anisotropic`) === !0) {
            let n = t.get(`EXT_texture_filter_anisotropic`);
            i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        } else i = 0;
        return i;
    }
    function o(t) {
        return !(
            t !== 1023 &&
            r.convert(t) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)
        );
    }
    function s(n) {
        let i =
            n === 1016 &&
            (t.has(`EXT_color_buffer_half_float`) ||
                t.has(`EXT_color_buffer_float`));
        return !(
            n !== 1009 &&
            r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE) &&
            n !== 1015 &&
            !i
        );
    }
    function c(t) {
        if (t === `highp`) {
            if (
                e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT)
                    .precision > 0 &&
                e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT)
                    .precision > 0
            )
                return `highp`;
            t = `mediump`;
        }
        return t === `mediump` &&
            e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT)
                .precision > 0 &&
            e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT)
                .precision > 0
            ? `mediump`
            : `lowp`;
    }
    let l = n.precision === void 0 ? `highp` : n.precision,
        u = c(l);
    u !== l &&
        (W(`WebGLRenderer:`, l, `not supported, using`, u, `instead.`),
        (l = u));
    let d = n.logarithmicDepthBuffer === !0,
        f = n.reversedDepthBuffer === !0 && t.has(`EXT_clip_control`);
    n.reversedDepthBuffer === !0 &&
        f === !1 &&
        W(
            `WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`,
        );
    let p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),
        m = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        h = e.getParameter(e.MAX_TEXTURE_SIZE),
        g = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),
        _ = e.getParameter(e.MAX_VERTEX_ATTRIBS),
        v = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),
        y = e.getParameter(e.MAX_VARYING_VECTORS),
        b = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),
        x = e.getParameter(e.MAX_SAMPLES),
        S = e.getParameter(e.SAMPLES);
    return {
        isWebGL2: !0,
        getMaxAnisotropy: a,
        getMaxPrecision: c,
        textureFormatReadable: o,
        textureTypeReadable: s,
        precision: l,
        logarithmicDepthBuffer: d,
        reversedDepthBuffer: f,
        maxTextures: p,
        maxVertexTextures: m,
        maxTextureSize: h,
        maxCubemapSize: g,
        maxAttributes: _,
        maxVertexUniforms: v,
        maxVaryings: y,
        maxFragmentUniforms: b,
        maxSamples: x,
        samples: S,
    };
}
function Da(e) {
    let t = this,
        n = null,
        r = 0,
        i = !1,
        a = !1,
        o = new Qr(),
        s = new Y(),
        c = { value: null, needsUpdate: !1 };
    ((this.uniform = c),
        (this.numPlanes = 0),
        (this.numIntersection = 0),
        (this.init = function (e, t) {
            let n = e.length !== 0 || t || r !== 0 || i;
            return ((i = t), (r = e.length), n);
        }),
        (this.beginShadows = function () {
            ((a = !0), u(null));
        }),
        (this.endShadows = function () {
            a = !1;
        }),
        (this.setGlobalState = function (e, t) {
            n = u(e, t, 0);
        }),
        (this.setState = function (t, o, s) {
            let d = t.clippingPlanes,
                f = t.clipIntersection,
                p = t.clipShadows,
                m = e.get(t);
            if (!i || d === null || d.length === 0 || (a && !p))
                a ? u(null) : l();
            else {
                let e = a ? 0 : r,
                    t = e * 4,
                    i = m.clippingState || null;
                ((c.value = i), (i = u(d, o, t, s)));
                for (let e = 0; e !== t; ++e) i[e] = n[e];
                ((m.clippingState = i),
                    (this.numIntersection = f ? this.numPlanes : 0),
                    (this.numPlanes += e));
            }
        }));
    function l() {
        (c.value !== n && ((c.value = n), (c.needsUpdate = r > 0)),
            (t.numPlanes = r),
            (t.numIntersection = 0));
    }
    function u(e, n, r, i) {
        let a = e === null ? 0 : e.length,
            l = null;
        if (a !== 0) {
            if (((l = c.value), i !== !0 || l === null)) {
                let t = r + a * 4,
                    i = n.matrixWorldInverse;
                (s.getNormalMatrix(i),
                    (l === null || l.length < t) && (l = new Float32Array(t)));
                for (let t = 0, n = r; t !== a; ++t, n += 4)
                    (o.copy(e[t]).applyMatrix4(i, s),
                        o.normal.toArray(l, n),
                        (l[n + 3] = o.constant));
            }
            ((c.value = l), (c.needsUpdate = !0));
        }
        return ((t.numPlanes = a), (t.numIntersection = 0), l);
    }
}
var Oa = 4,
    ka = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
    Aa = 20,
    ja = 256,
    Ma = new Xi(),
    Na = new Z(),
    Pa = null,
    Fa = 0,
    Ia = 0,
    La = !1,
    Ra = new J(),
    za = class {
        constructor(e) {
            ((this._renderer = e),
                (this._pingPongRenderTarget = null),
                (this._lodMax = 0),
                (this._cubeSize = 0),
                (this._sizeLods = []),
                (this._sigmas = []),
                (this._lodMeshes = []),
                (this._backgroundBox = null),
                (this._cubemapMaterial = null),
                (this._equirectMaterial = null),
                (this._blurMaterial = null),
                (this._ggxMaterial = null));
        }
        fromScene(e, t = 0, n = 0.1, r = 100, i = {}) {
            let { size: a = 256, position: o = Ra } = i;
            ((Pa = this._renderer.getRenderTarget()),
                (Fa = this._renderer.getActiveCubeFace()),
                (Ia = this._renderer.getActiveMipmapLevel()),
                (La = this._renderer.xr.enabled),
                (this._renderer.xr.enabled = !1),
                this._setSize(a));
            let s = this._allocateTargets();
            return (
                (s.depthBuffer = !0),
                this._sceneToCubeUV(e, n, r, s, o),
                t > 0 && this._blur(s, 0, 0, t),
                this._applyPMREM(s),
                this._cleanup(s),
                s
            );
        }
        fromEquirectangular(e, t = null) {
            return this._fromTexture(e, t);
        }
        fromCubemap(e, t = null) {
            return this._fromTexture(e, t);
        }
        compileCubemapShader() {
            this._cubemapMaterial === null &&
                ((this._cubemapMaterial = Ka()),
                this._compileMaterial(this._cubemapMaterial));
        }
        compileEquirectangularShader() {
            this._equirectMaterial === null &&
                ((this._equirectMaterial = Ga()),
                this._compileMaterial(this._equirectMaterial));
        }
        dispose() {
            (this._dispose(),
                this._cubemapMaterial !== null &&
                    this._cubemapMaterial.dispose(),
                this._equirectMaterial !== null &&
                    this._equirectMaterial.dispose(),
                this._backgroundBox !== null &&
                    (this._backgroundBox.geometry.dispose(),
                    this._backgroundBox.material.dispose()));
        }
        _setSize(e) {
            ((this._lodMax = Math.floor(Math.log2(e))),
                (this._cubeSize = 2 ** this._lodMax));
        }
        _dispose() {
            (this._blurMaterial !== null && this._blurMaterial.dispose(),
                this._ggxMaterial !== null && this._ggxMaterial.dispose(),
                this._pingPongRenderTarget !== null &&
                    this._pingPongRenderTarget.dispose());
            for (let e = 0; e < this._lodMeshes.length; e++)
                this._lodMeshes[e].geometry.dispose();
        }
        _cleanup(e) {
            (this._renderer.setRenderTarget(Pa, Fa, Ia),
                (this._renderer.xr.enabled = La),
                (e.scissorTest = !1),
                Ha(e, 0, 0, e.width, e.height));
        }
        _fromTexture(e, t) {
            (e.mapping === 301 || e.mapping === 302
                ? this._setSize(
                      e.image.length === 0
                          ? 16
                          : e.image[0].width || e.image[0].image.width,
                  )
                : this._setSize(e.image.width / 4),
                (Pa = this._renderer.getRenderTarget()),
                (Fa = this._renderer.getActiveCubeFace()),
                (Ia = this._renderer.getActiveMipmapLevel()),
                (La = this._renderer.xr.enabled),
                (this._renderer.xr.enabled = !1));
            let n = t || this._allocateTargets();
            return (
                this._textureToCubeUV(e, n),
                this._applyPMREM(n),
                this._cleanup(n),
                n
            );
        }
        _allocateTargets() {
            let e = 3 * Math.max(this._cubeSize, 112),
                t = 4 * this._cubeSize,
                n = {
                    magFilter: m,
                    minFilter: m,
                    generateMipmaps: !1,
                    type: w,
                    format: M,
                    colorSpace: Ve,
                    depthBuffer: !1,
                },
                r = Va(e, t, n);
            if (
                this._pingPongRenderTarget === null ||
                this._pingPongRenderTarget.width !== e ||
                this._pingPongRenderTarget.height !== t
            ) {
                (this._pingPongRenderTarget !== null && this._dispose(),
                    (this._pingPongRenderTarget = Va(e, t, n)));
                let { _lodMax: r } = this;
                (({
                    lodMeshes: this._lodMeshes,
                    sizeLods: this._sizeLods,
                    sigmas: this._sigmas,
                } = Ba(r)),
                    (this._blurMaterial = Wa(r, e, t)),
                    (this._ggxMaterial = Ua(r, e, t)));
            }
            return r;
        }
        _compileMaterial(e) {
            let t = new Ir(new pr(), e);
            this._renderer.compile(t, Ma);
        }
        _sceneToCubeUV(e, t, n, r, i) {
            let a = new Yi(90, 1, t, n),
                o = [1, -1, 1, 1, 1, 1],
                s = [1, 1, 1, -1, -1, -1],
                c = this._renderer,
                l = c.autoClear,
                u = c.toneMapping;
            (c.getClearColor(Na),
                (c.toneMapping = 0),
                (c.autoClear = !1),
                c.state.buffers.depth.getReversed() &&
                    (c.setRenderTarget(r),
                    c.clearDepth(),
                    c.setRenderTarget(null)),
                this._backgroundBox === null &&
                    (this._backgroundBox = new Ir(
                        new si(),
                        new wr({
                            name: `PMREM.Background`,
                            side: 1,
                            depthWrite: !1,
                            depthTest: !1,
                        }),
                    )));
            let d = this._backgroundBox,
                f = d.material,
                p = !1,
                m = e.background;
            m
                ? m.isColor &&
                  (f.color.copy(m), (e.background = null), (p = !0))
                : (f.color.copy(Na), (p = !0));
            for (let t = 0; t < 6; t++) {
                let n = t % 3;
                n === 0
                    ? (a.up.set(0, o[t], 0),
                      a.position.set(i.x, i.y, i.z),
                      a.lookAt(i.x + s[t], i.y, i.z))
                    : n === 1
                      ? (a.up.set(0, 0, o[t]),
                        a.position.set(i.x, i.y, i.z),
                        a.lookAt(i.x, i.y + s[t], i.z))
                      : (a.up.set(0, o[t], 0),
                        a.position.set(i.x, i.y, i.z),
                        a.lookAt(i.x, i.y, i.z + s[t]));
                let l = this._cubeSize;
                (Ha(r, n * l, t > 2 ? l : 0, l, l),
                    c.setRenderTarget(r),
                    p && c.render(d, a),
                    c.render(e, a));
            }
            ((c.toneMapping = u), (c.autoClear = l), (e.background = m));
        }
        _textureToCubeUV(e, t) {
            let n = this._renderer,
                r = e.mapping === 301 || e.mapping === 302;
            r
                ? (this._cubemapMaterial === null &&
                      (this._cubemapMaterial = Ka()),
                  (this._cubemapMaterial.uniforms.flipEnvMap.value =
                      e.isRenderTargetTexture === !1 ? -1 : 1))
                : this._equirectMaterial === null &&
                  (this._equirectMaterial = Ga());
            let i = r ? this._cubemapMaterial : this._equirectMaterial,
                a = this._lodMeshes[0];
            a.material = i;
            let o = i.uniforms;
            o.envMap.value = e;
            let s = this._cubeSize;
            (Ha(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, Ma));
        }
        _applyPMREM(e) {
            let t = this._renderer,
                n = t.autoClear;
            t.autoClear = !1;
            let r = this._lodMeshes.length;
            for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
            t.autoClear = n;
        }
        _applyGGXFilter(e, t, n) {
            let r = this._renderer,
                i = this._pingPongRenderTarget,
                a = this._ggxMaterial,
                o = this._lodMeshes[n];
            o.material = a;
            let s = a.uniforms,
                c = n / (this._lodMeshes.length - 1),
                l = t / (this._lodMeshes.length - 1),
                u = Math.sqrt(c * c - l * l) * (0 + c * 1.25),
                { _lodMax: d } = this,
                f = this._sizeLods[n],
                p = 3 * f * (n > d - Oa ? n - d + Oa : 0),
                m = 4 * (this._cubeSize - f);
            ((s.envMap.value = e.texture),
                (s.roughness.value = u),
                (s.mipInt.value = d - t),
                Ha(i, p, m, 3 * f, 2 * f),
                r.setRenderTarget(i),
                r.render(o, Ma),
                (s.envMap.value = i.texture),
                (s.roughness.value = 0),
                (s.mipInt.value = d - n),
                Ha(e, p, m, 3 * f, 2 * f),
                r.setRenderTarget(e),
                r.render(o, Ma));
        }
        _blur(e, t, n, r, i) {
            let a = this._pingPongRenderTarget;
            (this._halfBlur(e, a, t, n, r, `latitudinal`, i),
                this._halfBlur(a, e, n, n, r, `longitudinal`, i));
        }
        _halfBlur(e, t, n, r, i, a, o) {
            let s = this._renderer,
                c = this._blurMaterial;
            a !== `latitudinal` &&
                a !== `longitudinal` &&
                G(`blur direction must be either latitudinal or longitudinal!`);
            let l = this._lodMeshes[r];
            l.material = c;
            let u = c.uniforms,
                d = this._sizeLods[n] - 1,
                f = isFinite(i)
                    ? Math.PI / (2 * d)
                    : (2 * Math.PI) / (2 * Aa - 1),
                p = i / f,
                m = isFinite(i) ? 1 + Math.floor(3 * p) : Aa;
            m > Aa &&
                W(
                    `sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Aa}`,
                );
            let h = [],
                g = 0;
            for (let e = 0; e < Aa; ++e) {
                let t = e / p,
                    n = Math.exp((-t * t) / 2);
                (h.push(n), e === 0 ? (g += n) : e < m && (g += 2 * n));
            }
            for (let e = 0; e < h.length; e++) h[e] = h[e] / g;
            ((u.envMap.value = e.texture),
                (u.samples.value = m),
                (u.weights.value = h),
                (u.latitudinal.value = a === `latitudinal`),
                o && (u.poleAxis.value = o));
            let { _lodMax: _ } = this;
            ((u.dTheta.value = f), (u.mipInt.value = _ - n));
            let v = this._sizeLods[r];
            (Ha(
                t,
                3 * v * (r > _ - Oa ? r - _ + Oa : 0),
                4 * (this._cubeSize - v),
                3 * v,
                2 * v,
            ),
                s.setRenderTarget(t),
                s.render(l, Ma));
        }
    };
function Ba(e) {
    let t = [],
        n = [],
        r = [],
        i = e,
        a = e - Oa + 1 + ka.length;
    for (let o = 0; o < a; o++) {
        let a = 2 ** i;
        t.push(a);
        let s = 1 / a;
        (o > e - Oa ? (s = ka[o - e + Oa - 1]) : o === 0 && (s = 0), n.push(s));
        let c = 1 / (a - 2),
            l = -c,
            u = 1 + c,
            d = [l, l, u, l, u, u, l, l, u, u, l, u],
            f = new Float32Array(108),
            p = new Float32Array(72),
            m = new Float32Array(36);
        for (let e = 0; e < 6; e++) {
            let t = ((e % 3) * 2) / 3 - 1,
                n = e > 2 ? 0 : -1,
                r = [
                    t,
                    n,
                    0,
                    t + 2 / 3,
                    n,
                    0,
                    t + 2 / 3,
                    n + 1,
                    0,
                    t,
                    n,
                    0,
                    t + 2 / 3,
                    n + 1,
                    0,
                    t,
                    n + 1,
                    0,
                ];
            (f.set(r, 18 * e), p.set(d, 12 * e));
            let i = [e, e, e, e, e, e];
            m.set(i, 6 * e);
        }
        let h = new pr();
        (h.setAttribute(`position`, new Qn(f, 3)),
            h.setAttribute(`uv`, new Qn(p, 2)),
            h.setAttribute(`faceIndex`, new Qn(m, 1)),
            r.push(new Ir(h, null)),
            i > Oa && i--);
    }
    return { lodMeshes: r, sizeLods: t, sigmas: n };
}
function Va(e, t, n) {
    let r = new Nt(e, t, n);
    return (
        (r.texture.mapping = 306),
        (r.texture.name = `PMREM.cubeUv`),
        (r.scissorTest = !0),
        r
    );
}
function Ha(e, t, n, r, i) {
    (e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i));
}
function Ua(e, t, n) {
    return new _i({
        name: `PMREMGGXConvolution`,
        defines: {
            GGX_SAMPLES: ja,
            CUBEUV_TEXEL_WIDTH: 1 / t,
            CUBEUV_TEXEL_HEIGHT: 1 / n,
            CUBEUV_MAX_MIP: `${e}.0`,
        },
        uniforms: {
            envMap: { value: null },
            roughness: { value: 0 },
            mipInt: { value: 0 },
        },
        vertexShader: qa(),
        fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1,
    });
}
function Wa(e, t, n) {
    let r = new Float32Array(Aa),
        i = new J(0, 1, 0);
    return new _i({
        name: `SphericalGaussianBlur`,
        defines: {
            n: Aa,
            CUBEUV_TEXEL_WIDTH: 1 / t,
            CUBEUV_TEXEL_HEIGHT: 1 / n,
            CUBEUV_MAX_MIP: `${e}.0`,
        },
        uniforms: {
            envMap: { value: null },
            samples: { value: 1 },
            weights: { value: r },
            latitudinal: { value: !1 },
            dTheta: { value: 0 },
            mipInt: { value: 0 },
            poleAxis: { value: i },
        },
        vertexShader: qa(),
        fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1,
    });
}
function Ga() {
    return new _i({
        name: `EquirectangularToCubeUV`,
        uniforms: { envMap: { value: null } },
        vertexShader: qa(),
        fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1,
    });
}
function Ka() {
    return new _i({
        name: `CubemapToCubeUV`,
        uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
        vertexShader: qa(),
        fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1,
    });
}
function qa() {
    return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
var Ja = class extends Nt {
    constructor(e = 1, t = {}) {
        (super(e, e, t), (this.isWebGLCubeRenderTarget = !0));
        let n = { width: e, height: e, depth: 1 },
            r = [n, n, n, n, n, n];
        ((this.texture = new ri(r)),
            this._setTextureOptions(t),
            (this.texture.isRenderTargetTexture = !0));
    }
    fromEquirectangularTexture(e, t) {
        ((this.texture.type = t.type),
            (this.texture.colorSpace = t.colorSpace),
            (this.texture.generateMipmaps = t.generateMipmaps),
            (this.texture.minFilter = t.minFilter),
            (this.texture.magFilter = t.magFilter));
        let n = {
                uniforms: { tEquirect: { value: null } },
                vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
                fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
            },
            r = new si(5, 5, 5),
            i = new _i({
                name: `CubemapFromEquirect`,
                uniforms: li(n.uniforms),
                vertexShader: n.vertexShader,
                fragmentShader: n.fragmentShader,
                side: 1,
                blending: 0,
            });
        i.uniforms.tEquirect.value = t;
        let a = new Ir(r, i),
            o = t.minFilter;
        return (
            t.minFilter === 1008 && (t.minFilter = m),
            new $i(1, 10, this).update(e, a),
            (t.minFilter = o),
            a.geometry.dispose(),
            a.material.dispose(),
            this
        );
    }
    clear(e, t = !0, n = !0, r = !0) {
        let i = e.getRenderTarget();
        for (let i = 0; i < 6; i++)
            (e.setRenderTarget(this, i), e.clear(t, n, r));
        e.setRenderTarget(i);
    }
};
function Ya(e) {
    let t = new WeakMap(),
        n = new WeakMap(),
        r = null;
    function i(e, t = !1) {
        return e == null ? null : t ? o(e) : a(e);
    }
    function a(n) {
        if (n && n.isTexture) {
            let r = n.mapping;
            if (r === 303 || r === 304)
                if (t.has(n)) {
                    let e = t.get(n).texture;
                    return s(e, n.mapping);
                } else {
                    let r = n.image;
                    if (r && r.height > 0) {
                        let i = new Ja(r.height);
                        return (
                            i.fromEquirectangularTexture(e, n),
                            t.set(n, i),
                            n.addEventListener(`dispose`, l),
                            s(i.texture, n.mapping)
                        );
                    } else return null;
                }
        }
        return n;
    }
    function o(t) {
        if (t && t.isTexture) {
            let i = t.mapping,
                a = i === 303 || i === 304,
                o = i === 301 || i === 302;
            if (a || o) {
                let i = n.get(t),
                    s = i === void 0 ? 0 : i.texture.pmremVersion;
                if (t.isRenderTargetTexture && t.pmremVersion !== s)
                    return (
                        r === null && (r = new za(e)),
                        (i = a
                            ? r.fromEquirectangular(t, i)
                            : r.fromCubemap(t, i)),
                        (i.texture.pmremVersion = t.pmremVersion),
                        n.set(t, i),
                        i.texture
                    );
                if (i !== void 0) return i.texture;
                {
                    let s = t.image;
                    return (a && s && s.height > 0) || (o && s && c(s))
                        ? (r === null && (r = new za(e)),
                          (i = a ? r.fromEquirectangular(t) : r.fromCubemap(t)),
                          (i.texture.pmremVersion = t.pmremVersion),
                          n.set(t, i),
                          t.addEventListener(`dispose`, u),
                          i.texture)
                        : null;
                }
            }
        }
        return t;
    }
    function s(e, t) {
        return (
            t === 303 ? (e.mapping = 301) : t === 304 && (e.mapping = 302),
            e
        );
    }
    function c(e) {
        let t = 0;
        for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
        return t === 6;
    }
    function l(e) {
        let n = e.target;
        n.removeEventListener(`dispose`, l);
        let r = t.get(n);
        r !== void 0 && (t.delete(n), r.dispose());
    }
    function u(e) {
        let t = e.target;
        t.removeEventListener(`dispose`, u);
        let r = n.get(t);
        r !== void 0 && (n.delete(t), r.dispose());
    }
    function d() {
        ((t = new WeakMap()),
            (n = new WeakMap()),
            r !== null && (r.dispose(), (r = null)));
    }
    return { get: i, dispose: d };
}
function Xa(e) {
    let t = {};
    function n(n) {
        if (t[n] !== void 0) return t[n];
        let r = e.getExtension(n);
        return ((t[n] = r), r);
    }
    return {
        has: function (e) {
            return n(e) !== null;
        },
        init: function () {
            (n(`EXT_color_buffer_float`),
                n(`WEBGL_clip_cull_distance`),
                n(`OES_texture_float_linear`),
                n(`EXT_color_buffer_half_float`),
                n(`WEBGL_multisampled_render_to_texture`),
                n(`WEBGL_render_shared_exponent`));
        },
        get: function (e) {
            let t = n(e);
            return (
                t === null &&
                    nt(`WebGLRenderer: ` + e + ` extension not supported.`),
                t
            );
        },
    };
}
function Za(e, t, n, r) {
    let i = {},
        a = new WeakMap();
    function o(e) {
        let s = e.target;
        s.index !== null && t.remove(s.index);
        for (let e in s.attributes) t.remove(s.attributes[e]);
        (s.removeEventListener(`dispose`, o), delete i[s.id]);
        let c = a.get(s);
        (c && (t.remove(c), a.delete(s)),
            r.releaseStatesOfGeometry(s),
            s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount,
            n.memory.geometries--);
    }
    function s(e, t) {
        return i[t.id] === !0
            ? t
            : (t.addEventListener(`dispose`, o),
              (i[t.id] = !0),
              n.memory.geometries++,
              t);
    }
    function c(n) {
        let r = n.attributes;
        for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
    }
    function l(e) {
        let n = [],
            r = e.index,
            i = e.attributes.position,
            o = 0;
        if (i === void 0) return;
        if (r !== null) {
            let e = r.array;
            o = r.version;
            for (let t = 0, r = e.length; t < r; t += 3) {
                let r = e[t + 0],
                    i = e[t + 1],
                    a = e[t + 2];
                n.push(r, i, i, a, a, r);
            }
        } else {
            let e = i.array;
            o = i.version;
            for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
                let e = t + 0,
                    r = t + 1,
                    i = t + 2;
                n.push(e, r, r, i, i, e);
            }
        }
        let s = new (i.count >= 65535 ? er : $n)(n, 1);
        s.version = o;
        let c = a.get(e);
        (c && t.remove(c), a.set(e, s));
    }
    function u(e) {
        let t = a.get(e);
        if (t) {
            let n = e.index;
            n !== null && t.version < n.version && l(e);
        } else l(e);
        return a.get(e);
    }
    return { get: s, update: c, getWireframeAttribute: u };
}
function Qa(e, t, n) {
    let r;
    function i(e) {
        r = e;
    }
    let a, o;
    function s(e) {
        ((a = e.type), (o = e.bytesPerElement));
    }
    function c(t, i) {
        (e.drawElements(r, i, a, t * o), n.update(i, r, 1));
    }
    function l(t, i, s) {
        s !== 0 &&
            (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
    }
    function u(e, i, o) {
        if (o === 0) return;
        t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
        let s = 0;
        for (let e = 0; e < o; e++) s += i[e];
        n.update(s, r, 1);
    }
    ((this.setMode = i),
        (this.setIndex = s),
        (this.render = c),
        (this.renderInstances = l),
        (this.renderMultiDraw = u));
}
function $a(e) {
    let t = { geometries: 0, textures: 0 },
        n = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
    function r(t, r, i) {
        switch ((n.calls++, r)) {
            case e.TRIANGLES:
                n.triangles += (t / 3) * i;
                break;
            case e.LINES:
                n.lines += (t / 2) * i;
                break;
            case e.LINE_STRIP:
                n.lines += i * (t - 1);
                break;
            case e.LINE_LOOP:
                n.lines += i * t;
                break;
            case e.POINTS:
                n.points += i * t;
                break;
            default:
                G(`WebGLInfo: Unknown draw mode:`, r);
                break;
        }
    }
    function i() {
        ((n.calls = 0), (n.triangles = 0), (n.points = 0), (n.lines = 0));
    }
    return {
        memory: t,
        render: n,
        programs: null,
        autoReset: !0,
        reset: i,
        update: r,
    };
}
function eo(e, t, n) {
    let r = new WeakMap(),
        i = new jt();
    function a(a, o, s) {
        let c = a.morphTargetInfluences,
            l =
                o.morphAttributes.position ||
                o.morphAttributes.normal ||
                o.morphAttributes.color,
            u = l === void 0 ? 0 : l.length,
            d = r.get(o);
        if (d === void 0 || d.count !== u) {
            d !== void 0 && d.texture.dispose();
            let e = o.morphAttributes.position !== void 0,
                n = o.morphAttributes.normal !== void 0,
                a = o.morphAttributes.color !== void 0,
                s = o.morphAttributes.position || [],
                c = o.morphAttributes.normal || [],
                l = o.morphAttributes.color || [],
                f = 0;
            (e === !0 && (f = 1), n === !0 && (f = 2), a === !0 && (f = 3));
            let p = o.attributes.position.count * f,
                m = 1;
            p > t.maxTextureSize &&
                ((m = Math.ceil(p / t.maxTextureSize)), (p = t.maxTextureSize));
            let h = new Float32Array(p * m * 4 * u),
                g = new Pt(h, p, m, u);
            ((g.type = C), (g.needsUpdate = !0));
            let _ = f * 4;
            for (let t = 0; t < u; t++) {
                let r = s[t],
                    o = c[t],
                    u = l[t],
                    d = p * m * 4 * t;
                for (let t = 0; t < r.count; t++) {
                    let s = t * _;
                    (e === !0 &&
                        (i.fromBufferAttribute(r, t),
                        (h[d + s + 0] = i.x),
                        (h[d + s + 1] = i.y),
                        (h[d + s + 2] = i.z),
                        (h[d + s + 3] = 0)),
                        n === !0 &&
                            (i.fromBufferAttribute(o, t),
                            (h[d + s + 4] = i.x),
                            (h[d + s + 5] = i.y),
                            (h[d + s + 6] = i.z),
                            (h[d + s + 7] = 0)),
                        a === !0 &&
                            (i.fromBufferAttribute(u, t),
                            (h[d + s + 8] = i.x),
                            (h[d + s + 9] = i.y),
                            (h[d + s + 10] = i.z),
                            (h[d + s + 11] = u.itemSize === 4 ? i.w : 1)));
                }
            }
            ((d = { count: u, texture: g, size: new q(p, m) }), r.set(o, d));
            function v() {
                (g.dispose(), r.delete(o), o.removeEventListener(`dispose`, v));
            }
            o.addEventListener(`dispose`, v);
        }
        if (a.isInstancedMesh === !0 && a.morphTexture !== null)
            s.getUniforms().setValue(e, `morphTexture`, a.morphTexture, n);
        else {
            let t = 0;
            for (let e = 0; e < c.length; e++) t += c[e];
            let n = o.morphTargetsRelative ? 1 : 1 - t;
            (s.getUniforms().setValue(e, `morphTargetBaseInfluence`, n),
                s.getUniforms().setValue(e, `morphTargetInfluences`, c));
        }
        (s.getUniforms().setValue(e, `morphTargetsTexture`, d.texture, n),
            s.getUniforms().setValue(e, `morphTargetsTextureSize`, d.size));
    }
    return { update: a };
}
function to(e, t, n, r, i) {
    let a = new WeakMap();
    function o(r) {
        let o = i.render.frame,
            s = r.geometry,
            l = t.get(r, s);
        if (
            (a.get(l) !== o && (t.update(l), a.set(l, o)),
            r.isInstancedMesh &&
                (r.hasEventListener(`dispose`, c) === !1 &&
                    r.addEventListener(`dispose`, c),
                a.get(r) !== o &&
                    (n.update(r.instanceMatrix, e.ARRAY_BUFFER),
                    r.instanceColor !== null &&
                        n.update(r.instanceColor, e.ARRAY_BUFFER),
                    a.set(r, o))),
            r.isSkinnedMesh)
        ) {
            let e = r.skeleton;
            a.get(e) !== o && (e.update(), a.set(e, o));
        }
        return l;
    }
    function s() {
        a = new WeakMap();
    }
    function c(e) {
        let t = e.target;
        (t.removeEventListener(`dispose`, c),
            r.releaseStatesOfObject(t),
            n.remove(t.instanceMatrix),
            t.instanceColor !== null && n.remove(t.instanceColor));
    }
    return { update: o, dispose: s };
}
var no = {
    1: `LINEAR_TONE_MAPPING`,
    2: `REINHARD_TONE_MAPPING`,
    3: `CINEON_TONE_MAPPING`,
    4: `ACES_FILMIC_TONE_MAPPING`,
    6: `AGX_TONE_MAPPING`,
    7: `NEUTRAL_TONE_MAPPING`,
    5: `CUSTOM_TONE_MAPPING`,
};
function ro(e, t, n, r, i) {
    let a = new Nt(t, n, {
            type: e,
            depthBuffer: r,
            stencilBuffer: i,
            depthTexture: r ? new ii(t, n) : void 0,
        }),
        o = new Nt(t, n, { type: w, depthBuffer: !1, stencilBuffer: !1 }),
        s = new pr();
    (s.setAttribute(`position`, new tr([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
        s.setAttribute(`uv`, new tr([0, 2, 0, 0, 2, 0], 2)));
    let c = new vi({
            uniforms: { tDiffuse: { value: null } },
            vertexShader: `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
            fragmentShader: `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,
            depthTest: !1,
            depthWrite: !1,
        }),
        l = new Ir(s, c),
        u = new Xi(-1, 1, 1, -1, 0, 1),
        d = null,
        f = null,
        p = !1,
        m,
        h = null,
        g = [],
        _ = !1;
    ((this.setSize = function (e, t) {
        (a.setSize(e, t), o.setSize(e, t));
        for (let n = 0; n < g.length; n++) {
            let r = g[n];
            r.setSize && r.setSize(e, t);
        }
    }),
        (this.setEffects = function (e) {
            ((g = e), (_ = g.length > 0 && g[0].isRenderPass === !0));
            let t = a.width,
                n = a.height;
            for (let e = 0; e < g.length; e++) {
                let r = g[e];
                r.setSize && r.setSize(t, n);
            }
        }),
        (this.begin = function (e, t) {
            if (p || (e.toneMapping === 0 && g.length === 0)) return !1;
            if (((h = t), t !== null)) {
                let e = t.width,
                    n = t.height;
                (a.width !== e || a.height !== n) && this.setSize(e, n);
            }
            return (
                _ === !1 && e.setRenderTarget(a),
                (m = e.toneMapping),
                (e.toneMapping = 0),
                !0
            );
        }),
        (this.hasRenderPass = function () {
            return _;
        }),
        (this.end = function (e, t) {
            ((e.toneMapping = m), (p = !0));
            let n = a,
                r = o;
            for (let i = 0; i < g.length; i++) {
                let a = g[i];
                if (
                    a.enabled !== !1 &&
                    (a.render(e, r, n, t), a.needsSwap !== !1)
                ) {
                    let e = n;
                    ((n = r), (r = e));
                }
            }
            if (d !== e.outputColorSpace || f !== e.toneMapping) {
                ((d = e.outputColorSpace),
                    (f = e.toneMapping),
                    (c.defines = {}),
                    X.getTransfer(d) === `srgb` &&
                        (c.defines.SRGB_TRANSFER = ``));
                let t = no[f];
                (t && (c.defines[t] = ``), (c.needsUpdate = !0));
            }
            ((c.uniforms.tDiffuse.value = n.texture),
                e.setRenderTarget(h),
                e.render(l, u),
                (h = null),
                (p = !1));
        }),
        (this.isCompositing = function () {
            return p;
        }),
        (this.dispose = function () {
            (a.depthTexture && a.depthTexture.dispose(),
                a.dispose(),
                o.dispose(),
                s.dispose(),
                c.dispose());
        }));
}
var io = new At(),
    ao = new ii(1, 1),
    oo = new Pt(),
    so = new Ft(),
    co = new ri(),
    lo = [],
    uo = [],
    fo = new Float32Array(16),
    po = new Float32Array(9),
    mo = new Float32Array(4);
function ho(e, t, n) {
    let r = e[0];
    if (r <= 0 || r > 0) return e;
    let i = t * n,
        a = lo[i];
    if ((a === void 0 && ((a = new Float32Array(i)), (lo[i] = a)), t !== 0)) {
        r.toArray(a, 0);
        for (let r = 1, i = 0; r !== t; ++r) ((i += n), e[r].toArray(a, i));
    }
    return a;
}
function go(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
    return !0;
}
function _o(e, t) {
    for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function vo(e, t) {
    let n = uo[t];
    n === void 0 && ((n = new Int32Array(t)), (uo[t] = n));
    for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
    return n;
}
function yo(e, t) {
    let n = this.cache;
    n[0] !== t && (e.uniform1f(this.addr, t), (n[0] = t));
}
function bo(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y) &&
            (e.uniform2f(this.addr, t.x, t.y), (n[0] = t.x), (n[1] = t.y));
    else {
        if (go(n, t)) return;
        (e.uniform2fv(this.addr, t), _o(n, t));
    }
}
function xo(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) &&
            (e.uniform3f(this.addr, t.x, t.y, t.z),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z));
    else if (t.r !== void 0)
        (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) &&
            (e.uniform3f(this.addr, t.r, t.g, t.b),
            (n[0] = t.r),
            (n[1] = t.g),
            (n[2] = t.b));
    else {
        if (go(n, t)) return;
        (e.uniform3fv(this.addr, t), _o(n, t));
    }
}
function So(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) &&
            (e.uniform4f(this.addr, t.x, t.y, t.z, t.w),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z),
            (n[3] = t.w));
    else {
        if (go(n, t)) return;
        (e.uniform4fv(this.addr, t), _o(n, t));
    }
}
function Co(e, t) {
    let n = this.cache,
        r = t.elements;
    if (r === void 0) {
        if (go(n, t)) return;
        (e.uniformMatrix2fv(this.addr, !1, t), _o(n, t));
    } else {
        if (go(n, r)) return;
        (mo.set(r), e.uniformMatrix2fv(this.addr, !1, mo), _o(n, r));
    }
}
function wo(e, t) {
    let n = this.cache,
        r = t.elements;
    if (r === void 0) {
        if (go(n, t)) return;
        (e.uniformMatrix3fv(this.addr, !1, t), _o(n, t));
    } else {
        if (go(n, r)) return;
        (po.set(r), e.uniformMatrix3fv(this.addr, !1, po), _o(n, r));
    }
}
function To(e, t) {
    let n = this.cache,
        r = t.elements;
    if (r === void 0) {
        if (go(n, t)) return;
        (e.uniformMatrix4fv(this.addr, !1, t), _o(n, t));
    } else {
        if (go(n, r)) return;
        (fo.set(r), e.uniformMatrix4fv(this.addr, !1, fo), _o(n, r));
    }
}
function Eo(e, t) {
    let n = this.cache;
    n[0] !== t && (e.uniform1i(this.addr, t), (n[0] = t));
}
function Do(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y) &&
            (e.uniform2i(this.addr, t.x, t.y), (n[0] = t.x), (n[1] = t.y));
    else {
        if (go(n, t)) return;
        (e.uniform2iv(this.addr, t), _o(n, t));
    }
}
function Oo(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) &&
            (e.uniform3i(this.addr, t.x, t.y, t.z),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z));
    else {
        if (go(n, t)) return;
        (e.uniform3iv(this.addr, t), _o(n, t));
    }
}
function ko(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) &&
            (e.uniform4i(this.addr, t.x, t.y, t.z, t.w),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z),
            (n[3] = t.w));
    else {
        if (go(n, t)) return;
        (e.uniform4iv(this.addr, t), _o(n, t));
    }
}
function Ao(e, t) {
    let n = this.cache;
    n[0] !== t && (e.uniform1ui(this.addr, t), (n[0] = t));
}
function jo(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y) &&
            (e.uniform2ui(this.addr, t.x, t.y), (n[0] = t.x), (n[1] = t.y));
    else {
        if (go(n, t)) return;
        (e.uniform2uiv(this.addr, t), _o(n, t));
    }
}
function Mo(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) &&
            (e.uniform3ui(this.addr, t.x, t.y, t.z),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z));
    else {
        if (go(n, t)) return;
        (e.uniform3uiv(this.addr, t), _o(n, t));
    }
}
function No(e, t) {
    let n = this.cache;
    if (t.x !== void 0)
        (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) &&
            (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w),
            (n[0] = t.x),
            (n[1] = t.y),
            (n[2] = t.z),
            (n[3] = t.w));
    else {
        if (go(n, t)) return;
        (e.uniform4uiv(this.addr, t), _o(n, t));
    }
}
function Po(e, t, n) {
    let r = this.cache,
        i = n.allocateTextureUnit();
    r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i));
    let a;
    (this.type === e.SAMPLER_2D_SHADOW
        ? ((ao.compareFunction = n.isReversedDepthBuffer() ? 518 : 515),
          (a = ao))
        : (a = io),
        n.setTexture2D(t || a, i));
}
function Fo(e, t, n) {
    let r = this.cache,
        i = n.allocateTextureUnit();
    (r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
        n.setTexture3D(t || so, i));
}
function Io(e, t, n) {
    let r = this.cache,
        i = n.allocateTextureUnit();
    (r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
        n.setTextureCube(t || co, i));
}
function Lo(e, t, n) {
    let r = this.cache,
        i = n.allocateTextureUnit();
    (r[0] !== i && (e.uniform1i(this.addr, i), (r[0] = i)),
        n.setTexture2DArray(t || oo, i));
}
function Ro(e) {
    switch (e) {
        case 5126:
            return yo;
        case 35664:
            return bo;
        case 35665:
            return xo;
        case 35666:
            return So;
        case 35674:
            return Co;
        case 35675:
            return wo;
        case 35676:
            return To;
        case 5124:
        case 35670:
            return Eo;
        case 35667:
        case 35671:
            return Do;
        case 35668:
        case 35672:
            return Oo;
        case 35669:
        case 35673:
            return ko;
        case 5125:
            return Ao;
        case 36294:
            return jo;
        case 36295:
            return Mo;
        case 36296:
            return No;
        case 35678:
        case 36198:
        case 36298:
        case 36306:
        case 35682:
            return Po;
        case 35679:
        case 36299:
        case 36307:
            return Fo;
        case 35680:
        case 36300:
        case 36308:
        case 36293:
            return Io;
        case 36289:
        case 36303:
        case 36311:
        case 36292:
            return Lo;
    }
}
function zo(e, t) {
    e.uniform1fv(this.addr, t);
}
function Bo(e, t) {
    let n = ho(t, this.size, 2);
    e.uniform2fv(this.addr, n);
}
function Vo(e, t) {
    let n = ho(t, this.size, 3);
    e.uniform3fv(this.addr, n);
}
function Ho(e, t) {
    let n = ho(t, this.size, 4);
    e.uniform4fv(this.addr, n);
}
function Uo(e, t) {
    let n = ho(t, this.size, 4);
    e.uniformMatrix2fv(this.addr, !1, n);
}
function Wo(e, t) {
    let n = ho(t, this.size, 9);
    e.uniformMatrix3fv(this.addr, !1, n);
}
function Go(e, t) {
    let n = ho(t, this.size, 16);
    e.uniformMatrix4fv(this.addr, !1, n);
}
function Ko(e, t) {
    e.uniform1iv(this.addr, t);
}
function qo(e, t) {
    e.uniform2iv(this.addr, t);
}
function Jo(e, t) {
    e.uniform3iv(this.addr, t);
}
function Yo(e, t) {
    e.uniform4iv(this.addr, t);
}
function Xo(e, t) {
    e.uniform1uiv(this.addr, t);
}
function Zo(e, t) {
    e.uniform2uiv(this.addr, t);
}
function Qo(e, t) {
    e.uniform3uiv(this.addr, t);
}
function $o(e, t) {
    e.uniform4uiv(this.addr, t);
}
function es(e, t, n) {
    let r = this.cache,
        i = t.length,
        a = vo(n, i);
    go(r, a) || (e.uniform1iv(this.addr, a), _o(r, a));
    let o;
    o = this.type === e.SAMPLER_2D_SHADOW ? ao : io;
    for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function ts(e, t, n) {
    let r = this.cache,
        i = t.length,
        a = vo(n, i);
    go(r, a) || (e.uniform1iv(this.addr, a), _o(r, a));
    for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || so, a[e]);
}
function ns(e, t, n) {
    let r = this.cache,
        i = t.length,
        a = vo(n, i);
    go(r, a) || (e.uniform1iv(this.addr, a), _o(r, a));
    for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || co, a[e]);
}
function rs(e, t, n) {
    let r = this.cache,
        i = t.length,
        a = vo(n, i);
    go(r, a) || (e.uniform1iv(this.addr, a), _o(r, a));
    for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || oo, a[e]);
}
function is(e) {
    switch (e) {
        case 5126:
            return zo;
        case 35664:
            return Bo;
        case 35665:
            return Vo;
        case 35666:
            return Ho;
        case 35674:
            return Uo;
        case 35675:
            return Wo;
        case 35676:
            return Go;
        case 5124:
        case 35670:
            return Ko;
        case 35667:
        case 35671:
            return qo;
        case 35668:
        case 35672:
            return Jo;
        case 35669:
        case 35673:
            return Yo;
        case 5125:
            return Xo;
        case 36294:
            return Zo;
        case 36295:
            return Qo;
        case 36296:
            return $o;
        case 35678:
        case 36198:
        case 36298:
        case 36306:
        case 35682:
            return es;
        case 35679:
        case 36299:
        case 36307:
            return ts;
        case 35680:
        case 36300:
        case 36308:
        case 36293:
            return ns;
        case 36289:
        case 36303:
        case 36311:
        case 36292:
            return rs;
    }
}
var as = class {
        constructor(e, t, n) {
            ((this.id = e),
                (this.addr = n),
                (this.cache = []),
                (this.type = t.type),
                (this.setValue = Ro(t.type)));
        }
    },
    os = class {
        constructor(e, t, n) {
            ((this.id = e),
                (this.addr = n),
                (this.cache = []),
                (this.type = t.type),
                (this.size = t.size),
                (this.setValue = is(t.type)));
        }
    },
    ss = class {
        constructor(e) {
            ((this.id = e), (this.seq = []), (this.map = {}));
        }
        setValue(e, t, n) {
            let r = this.seq;
            for (let i = 0, a = r.length; i !== a; ++i) {
                let a = r[i];
                a.setValue(e, t[a.id], n);
            }
        }
    },
    cs = /(\w+)(\])?(\[|\.)?/g;
function ls(e, t) {
    (e.seq.push(t), (e.map[t.id] = t));
}
function us(e, t, n) {
    let r = e.name,
        i = r.length;
    for (cs.lastIndex = 0; ; ) {
        let a = cs.exec(r),
            o = cs.lastIndex,
            s = a[1],
            c = a[2] === `]`,
            l = a[3];
        if ((c && (s |= 0), l === void 0 || (l === `[` && o + 2 === i))) {
            ls(n, l === void 0 ? new as(s, e, t) : new os(s, e, t));
            break;
        } else {
            let e = n.map[s];
            (e === void 0 && ((e = new ss(s)), ls(n, e)), (n = e));
        }
    }
}
var ds = class {
    constructor(e, t) {
        ((this.seq = []), (this.map = {}));
        let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
        for (let r = 0; r < n; ++r) {
            let n = e.getActiveUniform(t, r);
            us(n, e.getUniformLocation(t, n.name), this);
        }
        let r = [],
            i = [];
        for (let t of this.seq)
            t.type === e.SAMPLER_2D_SHADOW ||
            t.type === e.SAMPLER_CUBE_SHADOW ||
            t.type === e.SAMPLER_2D_ARRAY_SHADOW
                ? r.push(t)
                : i.push(t);
        r.length > 0 && (this.seq = r.concat(i));
    }
    setValue(e, t, n, r) {
        let i = this.map[t];
        i !== void 0 && i.setValue(e, n, r);
    }
    setOptional(e, t, n) {
        let r = t[n];
        r !== void 0 && this.setValue(e, n, r);
    }
    static upload(e, t, n, r) {
        for (let i = 0, a = t.length; i !== a; ++i) {
            let a = t[i],
                o = n[a.id];
            o.needsUpdate !== !1 && a.setValue(e, o.value, r);
        }
    }
    static seqWithValue(e, t) {
        let n = [];
        for (let r = 0, i = e.length; r !== i; ++r) {
            let i = e[r];
            i.id in t && n.push(i);
        }
        return n;
    }
};
function fs(e, t, n) {
    let r = e.createShader(t);
    return (e.shaderSource(r, n), e.compileShader(r), r);
}
var ps = 37297,
    ms = 0;
function hs(e, t) {
    let n = e.split(`
`),
        r = [],
        i = Math.max(t - 6, 0),
        a = Math.min(t + 6, n.length);
    for (let e = i; e < a; e++) {
        let i = e + 1;
        r.push(`${i === t ? `>` : ` `} ${i}: ${n[e]}`);
    }
    return r.join(`
`);
}
var gs = new Y();
function _s(e) {
    X._getMatrix(gs, X.workingColorSpace, e);
    let t = `mat3( ${gs.elements.map((e) => e.toFixed(4))} )`;
    switch (X.getTransfer(e)) {
        case He:
            return [t, `LinearTransferOETF`];
        case Ue:
            return [t, `sRGBTransferOETF`];
        default:
            return (
                W(`WebGLProgram: Unsupported color space: `, e),
                [t, `LinearTransferOETF`]
            );
    }
}
function vs(e, t, n) {
    let r = e.getShaderParameter(t, e.COMPILE_STATUS),
        i = (e.getShaderInfoLog(t) || ``).trim();
    if (r && i === ``) return ``;
    let a = /ERROR: 0:(\d+)/.exec(i);
    if (a) {
        let r = parseInt(a[1]);
        return (
            n.toUpperCase() +
            `

` +
            i +
            `

` +
            hs(e.getShaderSource(t), r)
        );
    } else return i;
}
function ys(e, t) {
    let n = _s(t);
    return [
        `vec4 ${e}( vec4 value ) {`,
        `	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
        `}`,
    ].join(`
`);
}
var bs = {
    1: `Linear`,
    2: `Reinhard`,
    3: `Cineon`,
    4: `ACESFilmic`,
    6: `AgX`,
    7: `Neutral`,
    5: `Custom`,
};
function xs(e, t) {
    let n = bs[t];
    return n === void 0
        ? (W(`WebGLProgram: Unsupported toneMapping:`, t),
          `vec3 ` + e + `( vec3 color ) { return LinearToneMapping( color ); }`)
        : `vec3 ` +
              e +
              `( vec3 color ) { return ` +
              n +
              `ToneMapping( color ); }`;
}
var Ss = new J();
function Cs() {
    return (
        X.getLuminanceCoefficients(Ss),
        [
            `float luminance( const in vec3 rgb ) {`,
            `	const vec3 weights = vec3( ${Ss.x.toFixed(4)}, ${Ss.y.toFixed(4)}, ${Ss.z.toFixed(4)} );`,
            `	return dot( weights, rgb );`,
            `}`,
        ].join(`
`)
    );
}
function ws(e) {
    return [
        e.extensionClipCullDistance
            ? `#extension GL_ANGLE_clip_cull_distance : require`
            : ``,
        e.extensionMultiDraw ? `#extension GL_ANGLE_multi_draw : require` : ``,
    ].filter(Ds).join(`
`);
}
function Ts(e) {
    let t = [];
    for (let n in e) {
        let r = e[n];
        r !== !1 && t.push(`#define ` + n + ` ` + r);
    }
    return t.join(`
`);
}
function Es(e, t) {
    let n = {},
        r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < r; i++) {
        let r = e.getActiveAttrib(t, i),
            a = r.name,
            o = 1;
        (r.type === e.FLOAT_MAT2 && (o = 2),
            r.type === e.FLOAT_MAT3 && (o = 3),
            r.type === e.FLOAT_MAT4 && (o = 4),
            (n[a] = {
                type: r.type,
                location: e.getAttribLocation(t, a),
                locationSize: o,
            }));
    }
    return n;
}
function Ds(e) {
    return e !== ``;
}
function Os(e, t) {
    let n =
        t.numSpotLightShadows +
        t.numSpotLightMaps -
        t.numSpotLightShadowsWithMaps;
    return e
        .replace(/NUM_DIR_LIGHTS/g, t.numDirLights)
        .replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights)
        .replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps)
        .replace(/NUM_SPOT_LIGHT_COORDS/g, n)
        .replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights)
        .replace(/NUM_POINT_LIGHTS/g, t.numPointLights)
        .replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights)
        .replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows)
        .replace(
            /NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,
            t.numSpotLightShadowsWithMaps,
        )
        .replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows)
        .replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function ks(e, t) {
    return e
        .replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes)
        .replace(
            /UNION_CLIPPING_PLANES/g,
            t.numClippingPlanes - t.numClipIntersection,
        );
}
var As = /^[ \t]*#include +<([\w\d./]+)>/gm;
function js(e) {
    return e.replace(As, Ns);
}
var Ms = new Map();
function Ns(e, t) {
    let n = Q[t];
    if (n === void 0) {
        let e = Ms.get(t);
        if (e !== void 0)
            ((n = Q[e]),
                W(
                    `WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,
                    t,
                    e,
                ));
        else throw Error(`Can not resolve #include <` + t + `>`);
    }
    return js(n);
}
var Ps =
    /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Fs(e) {
    return e.replace(Ps, Is);
}
function Is(e, t, n, r) {
    let i = ``;
    for (let e = parseInt(t); e < parseInt(n); e++)
        i += r
            .replace(/\[\s*i\s*\]/g, `[ ` + e + ` ]`)
            .replace(/UNROLLED_LOOP_INDEX/g, e);
    return i;
}
function Ls(e) {
    let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
    return (
        e.precision === `highp`
            ? (t += `
#define HIGH_PRECISION`)
            : e.precision === `mediump`
              ? (t += `
#define MEDIUM_PRECISION`)
              : e.precision === `lowp` &&
                (t += `
#define LOW_PRECISION`),
        t
    );
}
var Rs = { 1: `SHADOWMAP_TYPE_PCF`, 3: `SHADOWMAP_TYPE_VSM` };
function zs(e) {
    return Rs[e.shadowMapType] || `SHADOWMAP_TYPE_BASIC`;
}
var Bs = {
    301: `ENVMAP_TYPE_CUBE`,
    302: `ENVMAP_TYPE_CUBE`,
    306: `ENVMAP_TYPE_CUBE_UV`,
};
function Vs(e) {
    return e.envMap === !1
        ? `ENVMAP_TYPE_CUBE`
        : Bs[e.envMapMode] || `ENVMAP_TYPE_CUBE`;
}
var Hs = { 302: `ENVMAP_MODE_REFRACTION` };
function Us(e) {
    return e.envMap === !1
        ? `ENVMAP_MODE_REFLECTION`
        : Hs[e.envMapMode] || `ENVMAP_MODE_REFLECTION`;
}
var Ws = {
    0: `ENVMAP_BLENDING_MULTIPLY`,
    1: `ENVMAP_BLENDING_MIX`,
    2: `ENVMAP_BLENDING_ADD`,
};
function Gs(e) {
    return e.envMap === !1
        ? `ENVMAP_BLENDING_NONE`
        : Ws[e.combine] || `ENVMAP_BLENDING_NONE`;
}
function Ks(e) {
    let t = e.envMapCubeUVHeight;
    if (t === null) return null;
    let n = Math.log2(t) - 2,
        r = 1 / t;
    return {
        texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
        texelHeight: r,
        maxMip: n,
    };
}
function qs(e, t, n, r) {
    let i = e.getContext(),
        a = n.defines,
        o = n.vertexShader,
        s = n.fragmentShader,
        c = zs(n),
        l = Vs(n),
        u = Us(n),
        d = Gs(n),
        f = Ks(n),
        p = ws(n),
        m = Ts(a),
        h = i.createProgram(),
        g,
        _,
        v = n.glslVersion
            ? `#version ` +
              n.glslVersion +
              `
`
            : ``;
    (n.isRawShaderMaterial
        ? ((g = [
              `#define SHADER_TYPE ` + n.shaderType,
              `#define SHADER_NAME ` + n.shaderName,
              m,
          ].filter(Ds).join(`
`)),
          g.length > 0 &&
              (g += `
`),
          (_ = [
              `#define SHADER_TYPE ` + n.shaderType,
              `#define SHADER_NAME ` + n.shaderName,
              m,
          ].filter(Ds).join(`
`)),
          _.length > 0 &&
              (_ += `
`))
        : ((g = [
              Ls(n),
              `#define SHADER_TYPE ` + n.shaderType,
              `#define SHADER_NAME ` + n.shaderName,
              m,
              n.extensionClipCullDistance ? `#define USE_CLIP_DISTANCE` : ``,
              n.batching ? `#define USE_BATCHING` : ``,
              n.batchingColor ? `#define USE_BATCHING_COLOR` : ``,
              n.instancing ? `#define USE_INSTANCING` : ``,
              n.instancingColor ? `#define USE_INSTANCING_COLOR` : ``,
              n.instancingMorph ? `#define USE_INSTANCING_MORPH` : ``,
              n.useFog && n.fog ? `#define USE_FOG` : ``,
              n.useFog && n.fogExp2 ? `#define FOG_EXP2` : ``,
              n.map ? `#define USE_MAP` : ``,
              n.envMap ? `#define USE_ENVMAP` : ``,
              n.envMap ? `#define ` + u : ``,
              n.lightMap ? `#define USE_LIGHTMAP` : ``,
              n.aoMap ? `#define USE_AOMAP` : ``,
              n.bumpMap ? `#define USE_BUMPMAP` : ``,
              n.normalMap ? `#define USE_NORMALMAP` : ``,
              n.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``,
              n.normalMapTangentSpace
                  ? `#define USE_NORMALMAP_TANGENTSPACE`
                  : ``,
              n.displacementMap ? `#define USE_DISPLACEMENTMAP` : ``,
              n.emissiveMap ? `#define USE_EMISSIVEMAP` : ``,
              n.anisotropy ? `#define USE_ANISOTROPY` : ``,
              n.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``,
              n.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``,
              n.clearcoatRoughnessMap
                  ? `#define USE_CLEARCOAT_ROUGHNESSMAP`
                  : ``,
              n.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``,
              n.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``,
              n.iridescenceThicknessMap
                  ? `#define USE_IRIDESCENCE_THICKNESSMAP`
                  : ``,
              n.specularMap ? `#define USE_SPECULARMAP` : ``,
              n.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``,
              n.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``,
              n.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``,
              n.metalnessMap ? `#define USE_METALNESSMAP` : ``,
              n.alphaMap ? `#define USE_ALPHAMAP` : ``,
              n.alphaHash ? `#define USE_ALPHAHASH` : ``,
              n.transmission ? `#define USE_TRANSMISSION` : ``,
              n.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``,
              n.thicknessMap ? `#define USE_THICKNESSMAP` : ``,
              n.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``,
              n.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``,
              n.mapUv ? `#define MAP_UV ` + n.mapUv : ``,
              n.alphaMapUv ? `#define ALPHAMAP_UV ` + n.alphaMapUv : ``,
              n.lightMapUv ? `#define LIGHTMAP_UV ` + n.lightMapUv : ``,
              n.aoMapUv ? `#define AOMAP_UV ` + n.aoMapUv : ``,
              n.emissiveMapUv
                  ? `#define EMISSIVEMAP_UV ` + n.emissiveMapUv
                  : ``,
              n.bumpMapUv ? `#define BUMPMAP_UV ` + n.bumpMapUv : ``,
              n.normalMapUv ? `#define NORMALMAP_UV ` + n.normalMapUv : ``,
              n.displacementMapUv
                  ? `#define DISPLACEMENTMAP_UV ` + n.displacementMapUv
                  : ``,
              n.metalnessMapUv
                  ? `#define METALNESSMAP_UV ` + n.metalnessMapUv
                  : ``,
              n.roughnessMapUv
                  ? `#define ROUGHNESSMAP_UV ` + n.roughnessMapUv
                  : ``,
              n.anisotropyMapUv
                  ? `#define ANISOTROPYMAP_UV ` + n.anisotropyMapUv
                  : ``,
              n.clearcoatMapUv
                  ? `#define CLEARCOATMAP_UV ` + n.clearcoatMapUv
                  : ``,
              n.clearcoatNormalMapUv
                  ? `#define CLEARCOAT_NORMALMAP_UV ` + n.clearcoatNormalMapUv
                  : ``,
              n.clearcoatRoughnessMapUv
                  ? `#define CLEARCOAT_ROUGHNESSMAP_UV ` +
                    n.clearcoatRoughnessMapUv
                  : ``,
              n.iridescenceMapUv
                  ? `#define IRIDESCENCEMAP_UV ` + n.iridescenceMapUv
                  : ``,
              n.iridescenceThicknessMapUv
                  ? `#define IRIDESCENCE_THICKNESSMAP_UV ` +
                    n.iridescenceThicknessMapUv
                  : ``,
              n.sheenColorMapUv
                  ? `#define SHEEN_COLORMAP_UV ` + n.sheenColorMapUv
                  : ``,
              n.sheenRoughnessMapUv
                  ? `#define SHEEN_ROUGHNESSMAP_UV ` + n.sheenRoughnessMapUv
                  : ``,
              n.specularMapUv
                  ? `#define SPECULARMAP_UV ` + n.specularMapUv
                  : ``,
              n.specularColorMapUv
                  ? `#define SPECULAR_COLORMAP_UV ` + n.specularColorMapUv
                  : ``,
              n.specularIntensityMapUv
                  ? `#define SPECULAR_INTENSITYMAP_UV ` +
                    n.specularIntensityMapUv
                  : ``,
              n.transmissionMapUv
                  ? `#define TRANSMISSIONMAP_UV ` + n.transmissionMapUv
                  : ``,
              n.thicknessMapUv
                  ? `#define THICKNESSMAP_UV ` + n.thicknessMapUv
                  : ``,
              n.vertexTangents && n.flatShading === !1
                  ? `#define USE_TANGENT`
                  : ``,
              n.vertexNormals ? `#define HAS_NORMAL` : ``,
              n.vertexColors ? `#define USE_COLOR` : ``,
              n.vertexAlphas ? `#define USE_COLOR_ALPHA` : ``,
              n.vertexUv1s ? `#define USE_UV1` : ``,
              n.vertexUv2s ? `#define USE_UV2` : ``,
              n.vertexUv3s ? `#define USE_UV3` : ``,
              n.pointsUvs ? `#define USE_POINTS_UV` : ``,
              n.flatShading ? `#define FLAT_SHADED` : ``,
              n.skinning ? `#define USE_SKINNING` : ``,
              n.morphTargets ? `#define USE_MORPHTARGETS` : ``,
              n.morphNormals && n.flatShading === !1
                  ? `#define USE_MORPHNORMALS`
                  : ``,
              n.morphColors ? `#define USE_MORPHCOLORS` : ``,
              n.morphTargetsCount > 0
                  ? `#define MORPHTARGETS_TEXTURE_STRIDE ` +
                    n.morphTextureStride
                  : ``,
              n.morphTargetsCount > 0
                  ? `#define MORPHTARGETS_COUNT ` + n.morphTargetsCount
                  : ``,
              n.doubleSided ? `#define DOUBLE_SIDED` : ``,
              n.flipSided ? `#define FLIP_SIDED` : ``,
              n.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``,
              n.shadowMapEnabled ? `#define ` + c : ``,
              n.sizeAttenuation ? `#define USE_SIZEATTENUATION` : ``,
              n.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``,
              n.logarithmicDepthBuffer
                  ? `#define USE_LOGARITHMIC_DEPTH_BUFFER`
                  : ``,
              n.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``,
              `uniform mat4 modelMatrix;`,
              `uniform mat4 modelViewMatrix;`,
              `uniform mat4 projectionMatrix;`,
              `uniform mat4 viewMatrix;`,
              `uniform mat3 normalMatrix;`,
              `uniform vec3 cameraPosition;`,
              `uniform bool isOrthographic;`,
              `#ifdef USE_INSTANCING`,
              `	attribute mat4 instanceMatrix;`,
              `#endif`,
              `#ifdef USE_INSTANCING_COLOR`,
              `	attribute vec3 instanceColor;`,
              `#endif`,
              `#ifdef USE_INSTANCING_MORPH`,
              `	uniform sampler2D morphTexture;`,
              `#endif`,
              `attribute vec3 position;`,
              `attribute vec3 normal;`,
              `attribute vec2 uv;`,
              `#ifdef USE_UV1`,
              `	attribute vec2 uv1;`,
              `#endif`,
              `#ifdef USE_UV2`,
              `	attribute vec2 uv2;`,
              `#endif`,
              `#ifdef USE_UV3`,
              `	attribute vec2 uv3;`,
              `#endif`,
              `#ifdef USE_TANGENT`,
              `	attribute vec4 tangent;`,
              `#endif`,
              `#if defined( USE_COLOR_ALPHA )`,
              `	attribute vec4 color;`,
              `#elif defined( USE_COLOR )`,
              `	attribute vec3 color;`,
              `#endif`,
              `#ifdef USE_SKINNING`,
              `	attribute vec4 skinIndex;`,
              `	attribute vec4 skinWeight;`,
              `#endif`,
              `
`,
          ].filter(Ds).join(`
`)),
          (_ = [
              Ls(n),
              `#define SHADER_TYPE ` + n.shaderType,
              `#define SHADER_NAME ` + n.shaderName,
              m,
              n.useFog && n.fog ? `#define USE_FOG` : ``,
              n.useFog && n.fogExp2 ? `#define FOG_EXP2` : ``,
              n.alphaToCoverage ? `#define ALPHA_TO_COVERAGE` : ``,
              n.map ? `#define USE_MAP` : ``,
              n.matcap ? `#define USE_MATCAP` : ``,
              n.envMap ? `#define USE_ENVMAP` : ``,
              n.envMap ? `#define ` + l : ``,
              n.envMap ? `#define ` + u : ``,
              n.envMap ? `#define ` + d : ``,
              f ? `#define CUBEUV_TEXEL_WIDTH ` + f.texelWidth : ``,
              f ? `#define CUBEUV_TEXEL_HEIGHT ` + f.texelHeight : ``,
              f ? `#define CUBEUV_MAX_MIP ` + f.maxMip + `.0` : ``,
              n.lightMap ? `#define USE_LIGHTMAP` : ``,
              n.aoMap ? `#define USE_AOMAP` : ``,
              n.bumpMap ? `#define USE_BUMPMAP` : ``,
              n.normalMap ? `#define USE_NORMALMAP` : ``,
              n.normalMapObjectSpace ? `#define USE_NORMALMAP_OBJECTSPACE` : ``,
              n.normalMapTangentSpace
                  ? `#define USE_NORMALMAP_TANGENTSPACE`
                  : ``,
              n.packedNormalMap ? `#define USE_PACKED_NORMALMAP` : ``,
              n.emissiveMap ? `#define USE_EMISSIVEMAP` : ``,
              n.anisotropy ? `#define USE_ANISOTROPY` : ``,
              n.anisotropyMap ? `#define USE_ANISOTROPYMAP` : ``,
              n.clearcoat ? `#define USE_CLEARCOAT` : ``,
              n.clearcoatMap ? `#define USE_CLEARCOATMAP` : ``,
              n.clearcoatRoughnessMap
                  ? `#define USE_CLEARCOAT_ROUGHNESSMAP`
                  : ``,
              n.clearcoatNormalMap ? `#define USE_CLEARCOAT_NORMALMAP` : ``,
              n.dispersion ? `#define USE_DISPERSION` : ``,
              n.iridescence ? `#define USE_IRIDESCENCE` : ``,
              n.iridescenceMap ? `#define USE_IRIDESCENCEMAP` : ``,
              n.iridescenceThicknessMap
                  ? `#define USE_IRIDESCENCE_THICKNESSMAP`
                  : ``,
              n.specularMap ? `#define USE_SPECULARMAP` : ``,
              n.specularColorMap ? `#define USE_SPECULAR_COLORMAP` : ``,
              n.specularIntensityMap ? `#define USE_SPECULAR_INTENSITYMAP` : ``,
              n.roughnessMap ? `#define USE_ROUGHNESSMAP` : ``,
              n.metalnessMap ? `#define USE_METALNESSMAP` : ``,
              n.alphaMap ? `#define USE_ALPHAMAP` : ``,
              n.alphaTest ? `#define USE_ALPHATEST` : ``,
              n.alphaHash ? `#define USE_ALPHAHASH` : ``,
              n.sheen ? `#define USE_SHEEN` : ``,
              n.sheenColorMap ? `#define USE_SHEEN_COLORMAP` : ``,
              n.sheenRoughnessMap ? `#define USE_SHEEN_ROUGHNESSMAP` : ``,
              n.transmission ? `#define USE_TRANSMISSION` : ``,
              n.transmissionMap ? `#define USE_TRANSMISSIONMAP` : ``,
              n.thicknessMap ? `#define USE_THICKNESSMAP` : ``,
              n.vertexTangents && n.flatShading === !1
                  ? `#define USE_TANGENT`
                  : ``,
              n.vertexColors || n.instancingColor ? `#define USE_COLOR` : ``,
              n.vertexAlphas || n.batchingColor
                  ? `#define USE_COLOR_ALPHA`
                  : ``,
              n.vertexUv1s ? `#define USE_UV1` : ``,
              n.vertexUv2s ? `#define USE_UV2` : ``,
              n.vertexUv3s ? `#define USE_UV3` : ``,
              n.pointsUvs ? `#define USE_POINTS_UV` : ``,
              n.gradientMap ? `#define USE_GRADIENTMAP` : ``,
              n.flatShading ? `#define FLAT_SHADED` : ``,
              n.doubleSided ? `#define DOUBLE_SIDED` : ``,
              n.flipSided ? `#define FLIP_SIDED` : ``,
              n.shadowMapEnabled ? `#define USE_SHADOWMAP` : ``,
              n.shadowMapEnabled ? `#define ` + c : ``,
              n.premultipliedAlpha ? `#define PREMULTIPLIED_ALPHA` : ``,
              n.numLightProbes > 0 ? `#define USE_LIGHT_PROBES` : ``,
              n.numLightProbeGrids > 0 ? `#define USE_LIGHT_PROBES_GRID` : ``,
              n.decodeVideoTexture ? `#define DECODE_VIDEO_TEXTURE` : ``,
              n.decodeVideoTextureEmissive
                  ? `#define DECODE_VIDEO_TEXTURE_EMISSIVE`
                  : ``,
              n.logarithmicDepthBuffer
                  ? `#define USE_LOGARITHMIC_DEPTH_BUFFER`
                  : ``,
              n.reversedDepthBuffer ? `#define USE_REVERSED_DEPTH_BUFFER` : ``,
              `uniform mat4 viewMatrix;`,
              `uniform vec3 cameraPosition;`,
              `uniform bool isOrthographic;`,
              n.toneMapping === 0 ? `` : `#define TONE_MAPPING`,
              n.toneMapping === 0 ? `` : Q.tonemapping_pars_fragment,
              n.toneMapping === 0 ? `` : xs(`toneMapping`, n.toneMapping),
              n.dithering ? `#define DITHERING` : ``,
              n.opaque ? `#define OPAQUE` : ``,
              Q.colorspace_pars_fragment,
              ys(`linearToOutputTexel`, n.outputColorSpace),
              Cs(),
              n.useDepthPacking
                  ? `#define DEPTH_PACKING ` + n.depthPacking
                  : ``,
              `
`,
          ].filter(Ds).join(`
`))),
        (o = js(o)),
        (o = Os(o, n)),
        (o = ks(o, n)),
        (s = js(s)),
        (s = Os(s, n)),
        (s = ks(s, n)),
        (o = Fs(o)),
        (s = Fs(s)),
        n.isRawShaderMaterial !== !0 &&
            ((v = `#version 300 es
`),
            (g =
                [
                    p,
                    `#define attribute in`,
                    `#define varying out`,
                    `#define texture2D texture`,
                ].join(`
`) +
                `
` +
                g),
            (_ =
                [
                    `#define varying in`,
                    n.glslVersion === `300 es`
                        ? ``
                        : `layout(location = 0) out highp vec4 pc_fragColor;`,
                    n.glslVersion === `300 es`
                        ? ``
                        : `#define gl_FragColor pc_fragColor`,
                    `#define gl_FragDepthEXT gl_FragDepth`,
                    `#define texture2D texture`,
                    `#define textureCube texture`,
                    `#define texture2DProj textureProj`,
                    `#define texture2DLodEXT textureLod`,
                    `#define texture2DProjLodEXT textureProjLod`,
                    `#define textureCubeLodEXT textureLod`,
                    `#define texture2DGradEXT textureGrad`,
                    `#define texture2DProjGradEXT textureProjGrad`,
                    `#define textureCubeGradEXT textureGrad`,
                ].join(`
`) +
                `
` +
                _)));
    let y = v + g + o,
        b = v + _ + s,
        x = fs(i, i.VERTEX_SHADER, y),
        S = fs(i, i.FRAGMENT_SHADER, b);
    (i.attachShader(h, x),
        i.attachShader(h, S),
        n.index0AttributeName === void 0
            ? n.morphTargets === !0 && i.bindAttribLocation(h, 0, `position`)
            : i.bindAttribLocation(h, 0, n.index0AttributeName),
        i.linkProgram(h));
    function C(t) {
        if (e.debug.checkShaderErrors) {
            let n = i.getProgramInfoLog(h) || ``,
                r = i.getShaderInfoLog(x) || ``,
                a = i.getShaderInfoLog(S) || ``,
                o = n.trim(),
                s = r.trim(),
                c = a.trim(),
                l = !0,
                u = !0;
            if (i.getProgramParameter(h, i.LINK_STATUS) === !1)
                if (((l = !1), typeof e.debug.onShaderError == `function`))
                    e.debug.onShaderError(i, h, x, S);
                else {
                    let e = vs(i, x, `vertex`),
                        n = vs(i, S, `fragment`);
                    G(
                        `THREE.WebGLProgram: Shader Error ` +
                            i.getError() +
                            ` - VALIDATE_STATUS ` +
                            i.getProgramParameter(h, i.VALIDATE_STATUS) +
                            `

Material Name: ` +
                            t.name +
                            `
Material Type: ` +
                            t.type +
                            `

Program Info Log: ` +
                            o +
                            `
` +
                            e +
                            `
` +
                            n,
                    );
                }
            else
                o === ``
                    ? (s === `` || c === ``) && (u = !1)
                    : W(`WebGLProgram: Program Info Log:`, o);
            u &&
                (t.diagnostics = {
                    runnable: l,
                    programLog: o,
                    vertexShader: { log: s, prefix: g },
                    fragmentShader: { log: c, prefix: _ },
                });
        }
        (i.deleteShader(x),
            i.deleteShader(S),
            (w = new ds(i, h)),
            (T = Es(i, h)));
    }
    let w;
    this.getUniforms = function () {
        return (w === void 0 && C(this), w);
    };
    let T;
    this.getAttributes = function () {
        return (T === void 0 && C(this), T);
    };
    let E = n.rendererExtensionParallelShaderCompile === !1;
    return (
        (this.isReady = function () {
            return (E === !1 && (E = i.getProgramParameter(h, ps)), E);
        }),
        (this.destroy = function () {
            (r.releaseStatesOfProgram(this),
                i.deleteProgram(h),
                (this.program = void 0));
        }),
        (this.type = n.shaderType),
        (this.name = n.shaderName),
        (this.id = ms++),
        (this.cacheKey = t),
        (this.usedTimes = 1),
        (this.program = h),
        (this.vertexShader = x),
        (this.fragmentShader = S),
        this
    );
}
var Js = 0,
    Ys = class {
        constructor() {
            ((this.shaderCache = new Map()), (this.materialCache = new Map()));
        }
        update(e) {
            let t = e.vertexShader,
                n = e.fragmentShader,
                r = this._getShaderStage(t),
                i = this._getShaderStage(n),
                a = this._getShaderCacheForMaterial(e);
            return (
                a.has(r) === !1 && (a.add(r), r.usedTimes++),
                a.has(i) === !1 && (a.add(i), i.usedTimes++),
                this
            );
        }
        remove(e) {
            let t = this.materialCache.get(e);
            for (let e of t)
                (e.usedTimes--,
                    e.usedTimes === 0 && this.shaderCache.delete(e.code));
            return (this.materialCache.delete(e), this);
        }
        getVertexShaderID(e) {
            return this._getShaderStage(e.vertexShader).id;
        }
        getFragmentShaderID(e) {
            return this._getShaderStage(e.fragmentShader).id;
        }
        dispose() {
            (this.shaderCache.clear(), this.materialCache.clear());
        }
        _getShaderCacheForMaterial(e) {
            let t = this.materialCache,
                n = t.get(e);
            return (n === void 0 && ((n = new Set()), t.set(e, n)), n);
        }
        _getShaderStage(e) {
            let t = this.shaderCache,
                n = t.get(e);
            return (n === void 0 && ((n = new Xs(e)), t.set(e, n)), n);
        }
    },
    Xs = class {
        constructor(e) {
            ((this.id = Js++), (this.code = e), (this.usedTimes = 0));
        }
    };
function Zs(e) {
    return e === 1030 || e === 37490 || e === 36285;
}
function Qs(e, t, n, r, i, a) {
    let o = new qt(),
        s = new Ys(),
        c = new Set(),
        l = [],
        u = new Map(),
        d = r.logarithmicDepthBuffer,
        f = r.precision,
        p = {
            MeshDepthMaterial: `depth`,
            MeshDistanceMaterial: `distance`,
            MeshNormalMaterial: `normal`,
            MeshBasicMaterial: `basic`,
            MeshLambertMaterial: `lambert`,
            MeshPhongMaterial: `phong`,
            MeshToonMaterial: `toon`,
            MeshStandardMaterial: `physical`,
            MeshPhysicalMaterial: `physical`,
            MeshMatcapMaterial: `matcap`,
            LineBasicMaterial: `basic`,
            LineDashedMaterial: `dashed`,
            PointsMaterial: `points`,
            ShadowMaterial: `shadow`,
            SpriteMaterial: `sprite`,
        };
    function m(e) {
        return (c.add(e), e === 0 ? `uv` : `uv${e}`);
    }
    function h(i, o, l, u, h, g) {
        let _ = u.fog,
            v = h.geometry,
            y =
                i.isMeshStandardMaterial ||
                i.isMeshLambertMaterial ||
                i.isMeshPhongMaterial
                    ? u.environment
                    : null,
            b =
                i.isMeshStandardMaterial ||
                (i.isMeshLambertMaterial && !i.envMap) ||
                (i.isMeshPhongMaterial && !i.envMap),
            x = t.get(i.envMap || y, b),
            S = x && x.mapping === 306 ? x.image.height : null,
            C = p[i.type];
        i.precision !== null &&
            ((f = r.getMaxPrecision(i.precision)),
            f !== i.precision &&
                W(
                    `WebGLProgram.getParameters:`,
                    i.precision,
                    `not supported, using`,
                    f,
                    `instead.`,
                ));
        let w =
                v.morphAttributes.position ||
                v.morphAttributes.normal ||
                v.morphAttributes.color,
            T = w === void 0 ? 0 : w.length,
            E = 0;
        (v.morphAttributes.position !== void 0 && (E = 1),
            v.morphAttributes.normal !== void 0 && (E = 2),
            v.morphAttributes.color !== void 0 && (E = 3));
        let D, O, k, A;
        if (C) {
            let e = ya[C];
            ((D = e.vertexShader), (O = e.fragmentShader));
        } else
            ((D = i.vertexShader),
                (O = i.fragmentShader),
                s.update(i),
                (k = s.getVertexShaderID(i)),
                (A = s.getFragmentShaderID(i)));
        let j = e.getRenderTarget(),
            M = e.state.buffers.depth.getReversed(),
            N = h.isInstancedMesh === !0,
            ee = h.isBatchedMesh === !0,
            P = !!i.map,
            F = !!i.matcap,
            te = !!x,
            ne = !!i.aoMap,
            re = !!i.lightMap,
            ie = !!i.bumpMap,
            I = !!i.normalMap,
            ae = !!i.displacementMap,
            oe = !!i.emissiveMap,
            L = !!i.metalnessMap,
            se = !!i.roughnessMap,
            ce = i.anisotropy > 0,
            le = i.clearcoat > 0,
            ue = i.dispersion > 0,
            de = i.iridescence > 0,
            fe = i.sheen > 0,
            R = i.transmission > 0,
            pe = ce && !!i.anisotropyMap,
            me = le && !!i.clearcoatMap,
            he = le && !!i.clearcoatNormalMap,
            ge = le && !!i.clearcoatRoughnessMap,
            _e = de && !!i.iridescenceMap,
            ve = de && !!i.iridescenceThicknessMap,
            ye = fe && !!i.sheenColorMap,
            be = fe && !!i.sheenRoughnessMap,
            xe = !!i.specularMap,
            Se = !!i.specularColorMap,
            Ce = !!i.specularIntensityMap,
            we = R && !!i.transmissionMap,
            Te = R && !!i.thicknessMap,
            Ee = !!i.gradientMap,
            z = !!i.alphaMap,
            De = i.alphaTest > 0,
            B = !!i.alphaHash,
            Oe = !!i.extensions,
            V = 0;
        i.toneMapped &&
            (j === null || j.isXRRenderTarget === !0) &&
            (V = e.toneMapping);
        let ke = {
            shaderID: C,
            shaderType: i.type,
            shaderName: i.name,
            vertexShader: D,
            fragmentShader: O,
            defines: i.defines,
            customVertexShaderID: k,
            customFragmentShaderID: A,
            isRawShaderMaterial: i.isRawShaderMaterial === !0,
            glslVersion: i.glslVersion,
            precision: f,
            batching: ee,
            batchingColor: ee && h._colorsTexture !== null,
            instancing: N,
            instancingColor: N && h.instanceColor !== null,
            instancingMorph: N && h.morphTexture !== null,
            outputColorSpace:
                j === null
                    ? e.outputColorSpace
                    : j.isXRRenderTarget === !0
                      ? j.texture.colorSpace
                      : X.workingColorSpace,
            alphaToCoverage: !!i.alphaToCoverage,
            map: P,
            matcap: F,
            envMap: te,
            envMapMode: te && x.mapping,
            envMapCubeUVHeight: S,
            aoMap: ne,
            lightMap: re,
            bumpMap: ie,
            normalMap: I,
            displacementMap: ae,
            emissiveMap: oe,
            normalMapObjectSpace: I && i.normalMapType === 1,
            normalMapTangentSpace: I && i.normalMapType === 0,
            packedNormalMap:
                I && i.normalMapType === 0 && Zs(i.normalMap.format),
            metalnessMap: L,
            roughnessMap: se,
            anisotropy: ce,
            anisotropyMap: pe,
            clearcoat: le,
            clearcoatMap: me,
            clearcoatNormalMap: he,
            clearcoatRoughnessMap: ge,
            dispersion: ue,
            iridescence: de,
            iridescenceMap: _e,
            iridescenceThicknessMap: ve,
            sheen: fe,
            sheenColorMap: ye,
            sheenRoughnessMap: be,
            specularMap: xe,
            specularColorMap: Se,
            specularIntensityMap: Ce,
            transmission: R,
            transmissionMap: we,
            thicknessMap: Te,
            gradientMap: Ee,
            opaque:
                i.transparent === !1 &&
                i.blending === 1 &&
                i.alphaToCoverage === !1,
            alphaMap: z,
            alphaTest: De,
            alphaHash: B,
            combine: i.combine,
            mapUv: P && m(i.map.channel),
            aoMapUv: ne && m(i.aoMap.channel),
            lightMapUv: re && m(i.lightMap.channel),
            bumpMapUv: ie && m(i.bumpMap.channel),
            normalMapUv: I && m(i.normalMap.channel),
            displacementMapUv: ae && m(i.displacementMap.channel),
            emissiveMapUv: oe && m(i.emissiveMap.channel),
            metalnessMapUv: L && m(i.metalnessMap.channel),
            roughnessMapUv: se && m(i.roughnessMap.channel),
            anisotropyMapUv: pe && m(i.anisotropyMap.channel),
            clearcoatMapUv: me && m(i.clearcoatMap.channel),
            clearcoatNormalMapUv: he && m(i.clearcoatNormalMap.channel),
            clearcoatRoughnessMapUv: ge && m(i.clearcoatRoughnessMap.channel),
            iridescenceMapUv: _e && m(i.iridescenceMap.channel),
            iridescenceThicknessMapUv:
                ve && m(i.iridescenceThicknessMap.channel),
            sheenColorMapUv: ye && m(i.sheenColorMap.channel),
            sheenRoughnessMapUv: be && m(i.sheenRoughnessMap.channel),
            specularMapUv: xe && m(i.specularMap.channel),
            specularColorMapUv: Se && m(i.specularColorMap.channel),
            specularIntensityMapUv: Ce && m(i.specularIntensityMap.channel),
            transmissionMapUv: we && m(i.transmissionMap.channel),
            thicknessMapUv: Te && m(i.thicknessMap.channel),
            alphaMapUv: z && m(i.alphaMap.channel),
            vertexTangents: !!v.attributes.tangent && (I || ce),
            vertexNormals: !!v.attributes.normal,
            vertexColors: i.vertexColors,
            vertexAlphas:
                i.vertexColors === !0 &&
                !!v.attributes.color &&
                v.attributes.color.itemSize === 4,
            pointsUvs: h.isPoints === !0 && !!v.attributes.uv && (P || z),
            fog: !!_,
            useFog: i.fog === !0,
            fogExp2: !!_ && _.isFogExp2,
            flatShading:
                i.wireframe === !1 &&
                (i.flatShading === !0 ||
                    (v.attributes.normal === void 0 &&
                        I === !1 &&
                        (i.isMeshLambertMaterial ||
                            i.isMeshPhongMaterial ||
                            i.isMeshStandardMaterial ||
                            i.isMeshPhysicalMaterial))),
            sizeAttenuation: i.sizeAttenuation === !0,
            logarithmicDepthBuffer: d,
            reversedDepthBuffer: M,
            skinning: h.isSkinnedMesh === !0,
            morphTargets: v.morphAttributes.position !== void 0,
            morphNormals: v.morphAttributes.normal !== void 0,
            morphColors: v.morphAttributes.color !== void 0,
            morphTargetsCount: T,
            morphTextureStride: E,
            numDirLights: o.directional.length,
            numPointLights: o.point.length,
            numSpotLights: o.spot.length,
            numSpotLightMaps: o.spotLightMap.length,
            numRectAreaLights: o.rectArea.length,
            numHemiLights: o.hemi.length,
            numDirLightShadows: o.directionalShadowMap.length,
            numPointLightShadows: o.pointShadowMap.length,
            numSpotLightShadows: o.spotShadowMap.length,
            numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
            numLightProbes: o.numLightProbes,
            numLightProbeGrids: g.length,
            numClippingPlanes: a.numPlanes,
            numClipIntersection: a.numIntersection,
            dithering: i.dithering,
            shadowMapEnabled: e.shadowMap.enabled && l.length > 0,
            shadowMapType: e.shadowMap.type,
            toneMapping: V,
            decodeVideoTexture:
                P &&
                i.map.isVideoTexture === !0 &&
                X.getTransfer(i.map.colorSpace) === `srgb`,
            decodeVideoTextureEmissive:
                oe &&
                i.emissiveMap.isVideoTexture === !0 &&
                X.getTransfer(i.emissiveMap.colorSpace) === `srgb`,
            premultipliedAlpha: i.premultipliedAlpha,
            doubleSided: i.side === 2,
            flipSided: i.side === 1,
            useDepthPacking: i.depthPacking >= 0,
            depthPacking: i.depthPacking || 0,
            index0AttributeName: i.index0AttributeName,
            extensionClipCullDistance:
                Oe &&
                i.extensions.clipCullDistance === !0 &&
                n.has(`WEBGL_clip_cull_distance`),
            extensionMultiDraw:
                ((Oe && i.extensions.multiDraw === !0) || ee) &&
                n.has(`WEBGL_multi_draw`),
            rendererExtensionParallelShaderCompile: n.has(
                `KHR_parallel_shader_compile`,
            ),
            customProgramCacheKey: i.customProgramCacheKey(),
        };
        return (
            (ke.vertexUv1s = c.has(1)),
            (ke.vertexUv2s = c.has(2)),
            (ke.vertexUv3s = c.has(3)),
            c.clear(),
            ke
        );
    }
    function g(t) {
        let n = [];
        if (
            (t.shaderID
                ? n.push(t.shaderID)
                : (n.push(t.customVertexShaderID),
                  n.push(t.customFragmentShaderID)),
            t.defines !== void 0)
        )
            for (let e in t.defines) (n.push(e), n.push(t.defines[e]));
        return (
            t.isRawShaderMaterial === !1 &&
                (_(n, t), v(n, t), n.push(e.outputColorSpace)),
            n.push(t.customProgramCacheKey),
            n.join()
        );
    }
    function _(e, t) {
        (e.push(t.precision),
            e.push(t.outputColorSpace),
            e.push(t.envMapMode),
            e.push(t.envMapCubeUVHeight),
            e.push(t.mapUv),
            e.push(t.alphaMapUv),
            e.push(t.lightMapUv),
            e.push(t.aoMapUv),
            e.push(t.bumpMapUv),
            e.push(t.normalMapUv),
            e.push(t.displacementMapUv),
            e.push(t.emissiveMapUv),
            e.push(t.metalnessMapUv),
            e.push(t.roughnessMapUv),
            e.push(t.anisotropyMapUv),
            e.push(t.clearcoatMapUv),
            e.push(t.clearcoatNormalMapUv),
            e.push(t.clearcoatRoughnessMapUv),
            e.push(t.iridescenceMapUv),
            e.push(t.iridescenceThicknessMapUv),
            e.push(t.sheenColorMapUv),
            e.push(t.sheenRoughnessMapUv),
            e.push(t.specularMapUv),
            e.push(t.specularColorMapUv),
            e.push(t.specularIntensityMapUv),
            e.push(t.transmissionMapUv),
            e.push(t.thicknessMapUv),
            e.push(t.combine),
            e.push(t.fogExp2),
            e.push(t.sizeAttenuation),
            e.push(t.morphTargetsCount),
            e.push(t.morphAttributeCount),
            e.push(t.numDirLights),
            e.push(t.numPointLights),
            e.push(t.numSpotLights),
            e.push(t.numSpotLightMaps),
            e.push(t.numHemiLights),
            e.push(t.numRectAreaLights),
            e.push(t.numDirLightShadows),
            e.push(t.numPointLightShadows),
            e.push(t.numSpotLightShadows),
            e.push(t.numSpotLightShadowsWithMaps),
            e.push(t.numLightProbes),
            e.push(t.shadowMapType),
            e.push(t.toneMapping),
            e.push(t.numClippingPlanes),
            e.push(t.numClipIntersection),
            e.push(t.depthPacking));
    }
    function v(e, t) {
        (o.disableAll(),
            t.instancing && o.enable(0),
            t.instancingColor && o.enable(1),
            t.instancingMorph && o.enable(2),
            t.matcap && o.enable(3),
            t.envMap && o.enable(4),
            t.normalMapObjectSpace && o.enable(5),
            t.normalMapTangentSpace && o.enable(6),
            t.clearcoat && o.enable(7),
            t.iridescence && o.enable(8),
            t.alphaTest && o.enable(9),
            t.vertexColors && o.enable(10),
            t.vertexAlphas && o.enable(11),
            t.vertexUv1s && o.enable(12),
            t.vertexUv2s && o.enable(13),
            t.vertexUv3s && o.enable(14),
            t.vertexTangents && o.enable(15),
            t.anisotropy && o.enable(16),
            t.alphaHash && o.enable(17),
            t.batching && o.enable(18),
            t.dispersion && o.enable(19),
            t.batchingColor && o.enable(20),
            t.gradientMap && o.enable(21),
            t.packedNormalMap && o.enable(22),
            t.vertexNormals && o.enable(23),
            e.push(o.mask),
            o.disableAll(),
            t.fog && o.enable(0),
            t.useFog && o.enable(1),
            t.flatShading && o.enable(2),
            t.logarithmicDepthBuffer && o.enable(3),
            t.reversedDepthBuffer && o.enable(4),
            t.skinning && o.enable(5),
            t.morphTargets && o.enable(6),
            t.morphNormals && o.enable(7),
            t.morphColors && o.enable(8),
            t.premultipliedAlpha && o.enable(9),
            t.shadowMapEnabled && o.enable(10),
            t.doubleSided && o.enable(11),
            t.flipSided && o.enable(12),
            t.useDepthPacking && o.enable(13),
            t.dithering && o.enable(14),
            t.transmission && o.enable(15),
            t.sheen && o.enable(16),
            t.opaque && o.enable(17),
            t.pointsUvs && o.enable(18),
            t.decodeVideoTexture && o.enable(19),
            t.decodeVideoTextureEmissive && o.enable(20),
            t.alphaToCoverage && o.enable(21),
            t.numLightProbeGrids > 0 && o.enable(22),
            e.push(o.mask));
    }
    function y(e) {
        let t = p[e.type],
            n;
        if (t) {
            let e = ya[t];
            n = mi.clone(e.uniforms);
        } else n = e.uniforms;
        return n;
    }
    function b(t, n) {
        let r = u.get(n);
        return (
            r === void 0
                ? ((r = new qs(e, n, t, i)), l.push(r), u.set(n, r))
                : ++r.usedTimes,
            r
        );
    }
    function x(e) {
        if (--e.usedTimes === 0) {
            let t = l.indexOf(e);
            ((l[t] = l[l.length - 1]),
                l.pop(),
                u.delete(e.cacheKey),
                e.destroy());
        }
    }
    function S(e) {
        s.remove(e);
    }
    function C() {
        s.dispose();
    }
    return {
        getParameters: h,
        getProgramCacheKey: g,
        getUniforms: y,
        acquireProgram: b,
        releaseProgram: x,
        releaseShaderCache: S,
        programs: l,
        dispose: C,
    };
}
function $s() {
    let e = new WeakMap();
    function t(t) {
        return e.has(t);
    }
    function n(t) {
        let n = e.get(t);
        return (n === void 0 && ((n = {}), e.set(t, n)), n);
    }
    function r(t) {
        e.delete(t);
    }
    function i(t, n, r) {
        e.get(t)[n] = r;
    }
    function a() {
        e = new WeakMap();
    }
    return { has: t, get: n, remove: r, update: i, dispose: a };
}
function ec(e, t) {
    return e.groupOrder === t.groupOrder
        ? e.renderOrder === t.renderOrder
            ? e.material.id === t.material.id
                ? e.materialVariant === t.materialVariant
                    ? e.z === t.z
                        ? e.id - t.id
                        : e.z - t.z
                    : e.materialVariant - t.materialVariant
                : e.material.id - t.material.id
            : e.renderOrder - t.renderOrder
        : e.groupOrder - t.groupOrder;
}
function tc(e, t) {
    return e.groupOrder === t.groupOrder
        ? e.renderOrder === t.renderOrder
            ? e.z === t.z
                ? e.id - t.id
                : t.z - e.z
            : e.renderOrder - t.renderOrder
        : e.groupOrder - t.groupOrder;
}
function nc() {
    let e = [],
        t = 0,
        n = [],
        r = [],
        i = [];
    function a() {
        ((t = 0), (n.length = 0), (r.length = 0), (i.length = 0));
    }
    function o(e) {
        let t = 0;
        return (e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t);
    }
    function s(n, r, i, a, s, c) {
        let l = e[t];
        return (
            l === void 0
                ? ((l = {
                      id: n.id,
                      object: n,
                      geometry: r,
                      material: i,
                      materialVariant: o(n),
                      groupOrder: a,
                      renderOrder: n.renderOrder,
                      z: s,
                      group: c,
                  }),
                  (e[t] = l))
                : ((l.id = n.id),
                  (l.object = n),
                  (l.geometry = r),
                  (l.material = i),
                  (l.materialVariant = o(n)),
                  (l.groupOrder = a),
                  (l.renderOrder = n.renderOrder),
                  (l.z = s),
                  (l.group = c)),
            t++,
            l
        );
    }
    function c(e, t, a, o, c, l) {
        let u = s(e, t, a, o, c, l);
        a.transmission > 0
            ? r.push(u)
            : a.transparent === !0
              ? i.push(u)
              : n.push(u);
    }
    function l(e, t, a, o, c, l) {
        let u = s(e, t, a, o, c, l);
        a.transmission > 0
            ? r.unshift(u)
            : a.transparent === !0
              ? i.unshift(u)
              : n.unshift(u);
    }
    function u(e, t) {
        (n.length > 1 && n.sort(e || ec),
            r.length > 1 && r.sort(t || tc),
            i.length > 1 && i.sort(t || tc));
    }
    function d() {
        for (let n = t, r = e.length; n < r; n++) {
            let t = e[n];
            if (t.id === null) break;
            ((t.id = null),
                (t.object = null),
                (t.geometry = null),
                (t.material = null),
                (t.group = null));
        }
    }
    return {
        opaque: n,
        transmissive: r,
        transparent: i,
        init: a,
        push: c,
        unshift: l,
        finish: d,
        sort: u,
    };
}
function rc() {
    let e = new WeakMap();
    function t(t, n) {
        let r = e.get(t),
            i;
        return (
            r === void 0
                ? ((i = new nc()), e.set(t, [i]))
                : n >= r.length
                  ? ((i = new nc()), r.push(i))
                  : (i = r[n]),
            i
        );
    }
    function n() {
        e = new WeakMap();
    }
    return { get: t, dispose: n };
}
function ic() {
    let e = {};
    return {
        get: function (t) {
            if (e[t.id] !== void 0) return e[t.id];
            let n;
            switch (t.type) {
                case `DirectionalLight`:
                    n = { direction: new J(), color: new Z() };
                    break;
                case `SpotLight`:
                    n = {
                        position: new J(),
                        direction: new J(),
                        color: new Z(),
                        distance: 0,
                        coneCos: 0,
                        penumbraCos: 0,
                        decay: 0,
                    };
                    break;
                case `PointLight`:
                    n = {
                        position: new J(),
                        color: new Z(),
                        distance: 0,
                        decay: 0,
                    };
                    break;
                case `HemisphereLight`:
                    n = {
                        direction: new J(),
                        skyColor: new Z(),
                        groundColor: new Z(),
                    };
                    break;
                case `RectAreaLight`:
                    n = {
                        color: new Z(),
                        position: new J(),
                        halfWidth: new J(),
                        halfHeight: new J(),
                    };
                    break;
            }
            return ((e[t.id] = n), n);
        },
    };
}
function ac() {
    let e = {};
    return {
        get: function (t) {
            if (e[t.id] !== void 0) return e[t.id];
            let n;
            switch (t.type) {
                case `DirectionalLight`:
                    n = {
                        shadowIntensity: 1,
                        shadowBias: 0,
                        shadowNormalBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new q(),
                    };
                    break;
                case `SpotLight`:
                    n = {
                        shadowIntensity: 1,
                        shadowBias: 0,
                        shadowNormalBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new q(),
                    };
                    break;
                case `PointLight`:
                    n = {
                        shadowIntensity: 1,
                        shadowBias: 0,
                        shadowNormalBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new q(),
                        shadowCameraNear: 1,
                        shadowCameraFar: 1e3,
                    };
                    break;
            }
            return ((e[t.id] = n), n);
        },
    };
}
var oc = 0;
function sc(e, t) {
    return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function cc(e) {
    let t = new ic(),
        n = ac(),
        r = {
            version: 0,
            hash: {
                directionalLength: -1,
                pointLength: -1,
                spotLength: -1,
                rectAreaLength: -1,
                hemiLength: -1,
                numDirectionalShadows: -1,
                numPointShadows: -1,
                numSpotShadows: -1,
                numSpotMaps: -1,
                numLightProbes: -1,
            },
            ambient: [0, 0, 0],
            probe: [],
            directional: [],
            directionalShadow: [],
            directionalShadowMap: [],
            directionalShadowMatrix: [],
            spot: [],
            spotLightMap: [],
            spotShadow: [],
            spotShadowMap: [],
            spotLightMatrix: [],
            rectArea: [],
            rectAreaLTC1: null,
            rectAreaLTC2: null,
            point: [],
            pointShadow: [],
            pointShadowMap: [],
            pointShadowMatrix: [],
            hemi: [],
            numSpotLightShadowsWithMaps: 0,
            numLightProbes: 0,
        };
    for (let e = 0; e < 9; e++) r.probe.push(new J());
    let i = new J(),
        a = new It(),
        o = new It();
    function s(i) {
        let a = 0,
            o = 0,
            s = 0;
        for (let e = 0; e < 9; e++) r.probe[e].set(0, 0, 0);
        let c = 0,
            l = 0,
            u = 0,
            d = 0,
            f = 0,
            p = 0,
            m = 0,
            h = 0,
            g = 0,
            _ = 0,
            v = 0;
        i.sort(sc);
        for (let e = 0, y = i.length; e < y; e++) {
            let y = i[e],
                b = y.color,
                x = y.intensity,
                S = y.distance,
                C = null;
            if (
                (y.shadow &&
                    y.shadow.map &&
                    (C =
                        y.shadow.map.texture.format === 1030
                            ? y.shadow.map.texture
                            : y.shadow.map.depthTexture ||
                              y.shadow.map.texture),
                y.isAmbientLight)
            )
                ((a += b.r * x), (o += b.g * x), (s += b.b * x));
            else if (y.isLightProbe) {
                for (let e = 0; e < 9; e++)
                    r.probe[e].addScaledVector(y.sh.coefficients[e], x);
                v++;
            } else if (y.isDirectionalLight) {
                let e = t.get(y);
                if (
                    (e.color.copy(y.color).multiplyScalar(y.intensity),
                    y.castShadow)
                ) {
                    let e = y.shadow,
                        t = n.get(y);
                    ((t.shadowIntensity = e.intensity),
                        (t.shadowBias = e.bias),
                        (t.shadowNormalBias = e.normalBias),
                        (t.shadowRadius = e.radius),
                        (t.shadowMapSize = e.mapSize),
                        (r.directionalShadow[c] = t),
                        (r.directionalShadowMap[c] = C),
                        (r.directionalShadowMatrix[c] = y.shadow.matrix),
                        p++);
                }
                ((r.directional[c] = e), c++);
            } else if (y.isSpotLight) {
                let e = t.get(y);
                (e.position.setFromMatrixPosition(y.matrixWorld),
                    e.color.copy(b).multiplyScalar(x),
                    (e.distance = S),
                    (e.coneCos = Math.cos(y.angle)),
                    (e.penumbraCos = Math.cos(y.angle * (1 - y.penumbra))),
                    (e.decay = y.decay),
                    (r.spot[u] = e));
                let i = y.shadow;
                if (
                    (y.map &&
                        ((r.spotLightMap[g] = y.map),
                        g++,
                        i.updateMatrices(y),
                        y.castShadow && _++),
                    (r.spotLightMatrix[u] = i.matrix),
                    y.castShadow)
                ) {
                    let e = n.get(y);
                    ((e.shadowIntensity = i.intensity),
                        (e.shadowBias = i.bias),
                        (e.shadowNormalBias = i.normalBias),
                        (e.shadowRadius = i.radius),
                        (e.shadowMapSize = i.mapSize),
                        (r.spotShadow[u] = e),
                        (r.spotShadowMap[u] = C),
                        h++);
                }
                u++;
            } else if (y.isRectAreaLight) {
                let e = t.get(y);
                (e.color.copy(b).multiplyScalar(x),
                    e.halfWidth.set(y.width * 0.5, 0, 0),
                    e.halfHeight.set(0, y.height * 0.5, 0),
                    (r.rectArea[d] = e),
                    d++);
            } else if (y.isPointLight) {
                let e = t.get(y);
                if (
                    (e.color.copy(y.color).multiplyScalar(y.intensity),
                    (e.distance = y.distance),
                    (e.decay = y.decay),
                    y.castShadow)
                ) {
                    let e = y.shadow,
                        t = n.get(y);
                    ((t.shadowIntensity = e.intensity),
                        (t.shadowBias = e.bias),
                        (t.shadowNormalBias = e.normalBias),
                        (t.shadowRadius = e.radius),
                        (t.shadowMapSize = e.mapSize),
                        (t.shadowCameraNear = e.camera.near),
                        (t.shadowCameraFar = e.camera.far),
                        (r.pointShadow[l] = t),
                        (r.pointShadowMap[l] = C),
                        (r.pointShadowMatrix[l] = y.shadow.matrix),
                        m++);
                }
                ((r.point[l] = e), l++);
            } else if (y.isHemisphereLight) {
                let e = t.get(y);
                (e.skyColor.copy(y.color).multiplyScalar(x),
                    e.groundColor.copy(y.groundColor).multiplyScalar(x),
                    (r.hemi[f] = e),
                    f++);
            }
        }
        (d > 0 &&
            (e.has(`OES_texture_float_linear`) === !0
                ? ((r.rectAreaLTC1 = $.LTC_FLOAT_1),
                  (r.rectAreaLTC2 = $.LTC_FLOAT_2))
                : ((r.rectAreaLTC1 = $.LTC_HALF_1),
                  (r.rectAreaLTC2 = $.LTC_HALF_2))),
            (r.ambient[0] = a),
            (r.ambient[1] = o),
            (r.ambient[2] = s));
        let y = r.hash;
        (y.directionalLength !== c ||
            y.pointLength !== l ||
            y.spotLength !== u ||
            y.rectAreaLength !== d ||
            y.hemiLength !== f ||
            y.numDirectionalShadows !== p ||
            y.numPointShadows !== m ||
            y.numSpotShadows !== h ||
            y.numSpotMaps !== g ||
            y.numLightProbes !== v) &&
            ((r.directional.length = c),
            (r.spot.length = u),
            (r.rectArea.length = d),
            (r.point.length = l),
            (r.hemi.length = f),
            (r.directionalShadow.length = p),
            (r.directionalShadowMap.length = p),
            (r.pointShadow.length = m),
            (r.pointShadowMap.length = m),
            (r.spotShadow.length = h),
            (r.spotShadowMap.length = h),
            (r.directionalShadowMatrix.length = p),
            (r.pointShadowMatrix.length = m),
            (r.spotLightMatrix.length = h + g - _),
            (r.spotLightMap.length = g),
            (r.numSpotLightShadowsWithMaps = _),
            (r.numLightProbes = v),
            (y.directionalLength = c),
            (y.pointLength = l),
            (y.spotLength = u),
            (y.rectAreaLength = d),
            (y.hemiLength = f),
            (y.numDirectionalShadows = p),
            (y.numPointShadows = m),
            (y.numSpotShadows = h),
            (y.numSpotMaps = g),
            (y.numLightProbes = v),
            (r.version = oc++));
    }
    function c(e, t) {
        let n = 0,
            s = 0,
            c = 0,
            l = 0,
            u = 0,
            d = t.matrixWorldInverse;
        for (let t = 0, f = e.length; t < f; t++) {
            let f = e[t];
            if (f.isDirectionalLight) {
                let e = r.directional[n];
                (e.direction.setFromMatrixPosition(f.matrixWorld),
                    i.setFromMatrixPosition(f.target.matrixWorld),
                    e.direction.sub(i),
                    e.direction.transformDirection(d),
                    n++);
            } else if (f.isSpotLight) {
                let e = r.spot[c];
                (e.position.setFromMatrixPosition(f.matrixWorld),
                    e.position.applyMatrix4(d),
                    e.direction.setFromMatrixPosition(f.matrixWorld),
                    i.setFromMatrixPosition(f.target.matrixWorld),
                    e.direction.sub(i),
                    e.direction.transformDirection(d),
                    c++);
            } else if (f.isRectAreaLight) {
                let e = r.rectArea[l];
                (e.position.setFromMatrixPosition(f.matrixWorld),
                    e.position.applyMatrix4(d),
                    o.identity(),
                    a.copy(f.matrixWorld),
                    a.premultiply(d),
                    o.extractRotation(a),
                    e.halfWidth.set(f.width * 0.5, 0, 0),
                    e.halfHeight.set(0, f.height * 0.5, 0),
                    e.halfWidth.applyMatrix4(o),
                    e.halfHeight.applyMatrix4(o),
                    l++);
            } else if (f.isPointLight) {
                let e = r.point[s];
                (e.position.setFromMatrixPosition(f.matrixWorld),
                    e.position.applyMatrix4(d),
                    s++);
            } else if (f.isHemisphereLight) {
                let e = r.hemi[u];
                (e.direction.setFromMatrixPosition(f.matrixWorld),
                    e.direction.transformDirection(d),
                    u++);
            }
        }
    }
    return { setup: s, setupView: c, state: r };
}
function lc(e) {
    let t = new cc(e),
        n = [],
        r = [],
        i = [];
    function a(e) {
        ((d.camera = e), (n.length = 0), (r.length = 0), (i.length = 0));
    }
    function o(e) {
        n.push(e);
    }
    function s(e) {
        r.push(e);
    }
    function c(e) {
        i.push(e);
    }
    function l() {
        t.setup(n);
    }
    function u(e) {
        t.setupView(n, e);
    }
    let d = {
        lightsArray: n,
        shadowsArray: r,
        lightProbeGridArray: i,
        camera: null,
        lights: t,
        transmissionRenderTarget: {},
        textureUnits: 0,
    };
    return {
        init: a,
        state: d,
        setupLights: l,
        setupLightsView: u,
        pushLight: o,
        pushShadow: s,
        pushLightProbeGrid: c,
    };
}
function uc(e) {
    let t = new WeakMap();
    function n(n, r = 0) {
        let i = t.get(n),
            a;
        return (
            i === void 0
                ? ((a = new lc(e)), t.set(n, [a]))
                : r >= i.length
                  ? ((a = new lc(e)), i.push(a))
                  : (a = i[r]),
            a
        );
    }
    function r() {
        t = new WeakMap();
    }
    return { get: n, dispose: r };
}
var dc = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
    fc = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,
    pc = [
        new J(1, 0, 0),
        new J(-1, 0, 0),
        new J(0, 1, 0),
        new J(0, -1, 0),
        new J(0, 0, 1),
        new J(0, 0, -1),
    ],
    mc = [
        new J(0, -1, 0),
        new J(0, -1, 0),
        new J(0, 0, 1),
        new J(0, 0, -1),
        new J(0, -1, 0),
        new J(0, -1, 0),
    ],
    hc = new It(),
    gc = new J(),
    _c = new J();
function vc(e, t, n) {
    let r = new ni(),
        i = new q(),
        a = new q(),
        o = new jt(),
        s = new yi(),
        c = new bi(),
        l = {},
        u = n.maxTextureSize,
        f = { 0: 1, 1: 0, 2: 2 },
        p = new _i({
            defines: { VSM_SAMPLES: 8 },
            uniforms: {
                shadow_pass: { value: null },
                resolution: { value: new q() },
                radius: { value: 4 },
            },
            vertexShader: dc,
            fragmentShader: fc,
        }),
        h = p.clone();
    h.defines.HORIZONTAL_PASS = 1;
    let g = new pr();
    g.setAttribute(
        `position`,
        new Qn(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3),
    );
    let _ = new Ir(g, p),
        v = this;
    ((this.enabled = !1),
        (this.autoUpdate = !0),
        (this.needsUpdate = !1),
        (this.type = 1));
    let y = this.type;
    this.render = function (t, n, s) {
        if (
            v.enabled === !1 ||
            (v.autoUpdate === !1 && v.needsUpdate === !1) ||
            t.length === 0
        )
            return;
        this.type === 2 &&
            (W(
                `WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`,
            ),
            (this.type = 1));
        let c = e.getRenderTarget(),
            l = e.getActiveCubeFace(),
            f = e.getActiveMipmapLevel(),
            p = e.state;
        (p.setBlending(0),
            p.buffers.depth.getReversed() === !0
                ? p.buffers.color.setClear(0, 0, 0, 0)
                : p.buffers.color.setClear(1, 1, 1, 1),
            p.buffers.depth.setTest(!0),
            p.setScissorTest(!1));
        let h = y !== this.type;
        h &&
            n.traverse(function (e) {
                e.material &&
                    (Array.isArray(e.material)
                        ? e.material.forEach((e) => (e.needsUpdate = !0))
                        : (e.material.needsUpdate = !0));
            });
        for (let c = 0, l = t.length; c < l; c++) {
            let l = t[c],
                f = l.shadow;
            if (f === void 0) {
                W(`WebGLShadowMap:`, l, `has no shadow.`);
                continue;
            }
            if (f.autoUpdate === !1 && f.needsUpdate === !1) continue;
            i.copy(f.mapSize);
            let g = f.getFrameExtents();
            (i.multiply(g),
                a.copy(f.mapSize),
                (i.x > u || i.y > u) &&
                    (i.x > u &&
                        ((a.x = Math.floor(u / g.x)),
                        (i.x = a.x * g.x),
                        (f.mapSize.x = a.x)),
                    i.y > u &&
                        ((a.y = Math.floor(u / g.y)),
                        (i.y = a.y * g.y),
                        (f.mapSize.y = a.y))));
            let _ = e.state.buffers.depth.getReversed();
            if (((f.camera._reversedDepth = _), f.map === null || h === !0)) {
                if (
                    (f.map !== null &&
                        (f.map.depthTexture !== null &&
                            (f.map.depthTexture.dispose(),
                            (f.map.depthTexture = null)),
                        f.map.dispose()),
                    this.type === 3)
                ) {
                    if (l.isPointLight) {
                        W(
                            `WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`,
                        );
                        continue;
                    }
                    ((f.map = new Nt(i.x, i.y, {
                        format: te,
                        type: w,
                        minFilter: m,
                        magFilter: m,
                        generateMipmaps: !1,
                    })),
                        (f.map.texture.name = l.name + `.shadowMap`),
                        (f.map.depthTexture = new ii(i.x, i.y, C)),
                        (f.map.depthTexture.name = l.name + `.shadowMapDepth`),
                        (f.map.depthTexture.format = N),
                        (f.map.depthTexture.compareFunction = null),
                        (f.map.depthTexture.minFilter = d),
                        (f.map.depthTexture.magFilter = d));
                } else
                    (l.isPointLight
                        ? ((f.map = new Ja(i.x)),
                          (f.map.depthTexture = new ai(i.x, S)))
                        : ((f.map = new Nt(i.x, i.y)),
                          (f.map.depthTexture = new ii(i.x, i.y, S))),
                        (f.map.depthTexture.name = l.name + `.shadowMap`),
                        (f.map.depthTexture.format = N),
                        this.type === 1
                            ? ((f.map.depthTexture.compareFunction = _
                                  ? 518
                                  : 515),
                              (f.map.depthTexture.minFilter = m),
                              (f.map.depthTexture.magFilter = m))
                            : ((f.map.depthTexture.compareFunction = null),
                              (f.map.depthTexture.minFilter = d),
                              (f.map.depthTexture.magFilter = d)));
                f.camera.updateProjectionMatrix();
            }
            let v = f.map.isWebGLCubeRenderTarget ? 6 : 1;
            for (let t = 0; t < v; t++) {
                if (f.map.isWebGLCubeRenderTarget)
                    (e.setRenderTarget(f.map, t), e.clear());
                else {
                    t === 0 && (e.setRenderTarget(f.map), e.clear());
                    let n = f.getViewport(t);
                    (o.set(a.x * n.x, a.y * n.y, a.x * n.z, a.y * n.w),
                        p.viewport(o));
                }
                if (l.isPointLight) {
                    let e = f.camera,
                        n = f.matrix,
                        r = l.distance || e.far;
                    (r !== e.far && ((e.far = r), e.updateProjectionMatrix()),
                        gc.setFromMatrixPosition(l.matrixWorld),
                        e.position.copy(gc),
                        _c.copy(e.position),
                        _c.add(pc[t]),
                        e.up.copy(mc[t]),
                        e.lookAt(_c),
                        e.updateMatrixWorld(),
                        n.makeTranslation(-gc.x, -gc.y, -gc.z),
                        hc.multiplyMatrices(
                            e.projectionMatrix,
                            e.matrixWorldInverse,
                        ),
                        f._frustum.setFromProjectionMatrix(
                            hc,
                            e.coordinateSystem,
                            e.reversedDepth,
                        ));
                } else f.updateMatrices(l);
                ((r = f.getFrustum()), T(n, s, f.camera, l, this.type));
            }
            (f.isPointLightShadow !== !0 && this.type === 3 && b(f, s),
                (f.needsUpdate = !1));
        }
        ((y = this.type), (v.needsUpdate = !1), e.setRenderTarget(c, l, f));
    };
    function b(n, r) {
        let a = t.update(_);
        (p.defines.VSM_SAMPLES !== n.blurSamples &&
            ((p.defines.VSM_SAMPLES = n.blurSamples),
            (h.defines.VSM_SAMPLES = n.blurSamples),
            (p.needsUpdate = !0),
            (h.needsUpdate = !0)),
            n.mapPass === null &&
                (n.mapPass = new Nt(i.x, i.y, { format: te, type: w })),
            (p.uniforms.shadow_pass.value = n.map.depthTexture),
            (p.uniforms.resolution.value = n.mapSize),
            (p.uniforms.radius.value = n.radius),
            e.setRenderTarget(n.mapPass),
            e.clear(),
            e.renderBufferDirect(r, null, a, p, _, null),
            (h.uniforms.shadow_pass.value = n.mapPass.texture),
            (h.uniforms.resolution.value = n.mapSize),
            (h.uniforms.radius.value = n.radius),
            e.setRenderTarget(n.map),
            e.clear(),
            e.renderBufferDirect(r, null, a, h, _, null));
    }
    function x(t, n, r, i) {
        let a = null,
            o =
                r.isPointLight === !0
                    ? t.customDistanceMaterial
                    : t.customDepthMaterial;
        if (o !== void 0) a = o;
        else if (
            ((a = r.isPointLight === !0 ? c : s),
            (e.localClippingEnabled &&
                n.clipShadows === !0 &&
                Array.isArray(n.clippingPlanes) &&
                n.clippingPlanes.length !== 0) ||
                (n.displacementMap && n.displacementScale !== 0) ||
                (n.alphaMap && n.alphaTest > 0) ||
                (n.map && n.alphaTest > 0) ||
                n.alphaToCoverage === !0)
        ) {
            let e = a.uuid,
                t = n.uuid,
                r = l[e];
            r === void 0 && ((r = {}), (l[e] = r));
            let i = r[t];
            (i === void 0 &&
                ((i = a.clone()), (r[t] = i), n.addEventListener(`dispose`, E)),
                (a = i));
        }
        if (
            ((a.visible = n.visible),
            (a.wireframe = n.wireframe),
            i === 3
                ? (a.side = n.shadowSide === null ? n.side : n.shadowSide)
                : (a.side = n.shadowSide === null ? f[n.side] : n.shadowSide),
            (a.alphaMap = n.alphaMap),
            (a.alphaTest = n.alphaToCoverage === !0 ? 0.5 : n.alphaTest),
            (a.map = n.map),
            (a.clipShadows = n.clipShadows),
            (a.clippingPlanes = n.clippingPlanes),
            (a.clipIntersection = n.clipIntersection),
            (a.displacementMap = n.displacementMap),
            (a.displacementScale = n.displacementScale),
            (a.displacementBias = n.displacementBias),
            (a.wireframeLinewidth = n.wireframeLinewidth),
            (a.linewidth = n.linewidth),
            r.isPointLight === !0 && a.isMeshDistanceMaterial === !0)
        ) {
            let t = e.properties.get(a);
            t.light = r;
        }
        return a;
    }
    function T(n, i, a, o, s) {
        if (n.visible === !1) return;
        if (
            n.layers.test(i.layers) &&
            (n.isMesh || n.isLine || n.isPoints) &&
            (n.castShadow || (n.receiveShadow && s === 3)) &&
            (!n.frustumCulled || r.intersectsObject(n))
        ) {
            n.modelViewMatrix.multiplyMatrices(
                a.matrixWorldInverse,
                n.matrixWorld,
            );
            let r = t.update(n),
                c = n.material;
            if (Array.isArray(c)) {
                let t = r.groups;
                for (let l = 0, u = t.length; l < u; l++) {
                    let u = t[l],
                        d = c[u.materialIndex];
                    if (d && d.visible) {
                        let t = x(n, d, o, s);
                        (n.onBeforeShadow(e, n, i, a, r, t, u),
                            e.renderBufferDirect(a, null, r, t, n, u),
                            n.onAfterShadow(e, n, i, a, r, t, u));
                    }
                }
            } else if (c.visible) {
                let t = x(n, c, o, s);
                (n.onBeforeShadow(e, n, i, a, r, t, null),
                    e.renderBufferDirect(a, null, r, t, n, null),
                    n.onAfterShadow(e, n, i, a, r, t, null));
            }
        }
        let c = n.children;
        for (let e = 0, t = c.length; e < t; e++) T(c[e], i, a, o, s);
    }
    function E(e) {
        e.target.removeEventListener(`dispose`, E);
        for (let t in l) {
            let n = l[t],
                r = e.target.uuid;
            r in n && (n[r].dispose(), delete n[r]);
        }
    }
}
function yc(e, t) {
    function n() {
        let t = !1,
            n = new jt(),
            r = null,
            i = new jt(0, 0, 0, 0);
        return {
            setMask: function (n) {
                r !== n && !t && (e.colorMask(n, n, n, n), (r = n));
            },
            setLocked: function (e) {
                t = e;
            },
            setClear: function (t, r, a, o, s) {
                (s === !0 && ((t *= o), (r *= o), (a *= o)),
                    n.set(t, r, a, o),
                    i.equals(n) === !1 &&
                        (e.clearColor(t, r, a, o), i.copy(n)));
            },
            reset: function () {
                ((t = !1), (r = null), i.set(-1, 0, 0, 0));
            },
        };
    }
    function r() {
        let n = !1,
            r = !1,
            i = null,
            a = null,
            o = null;
        return {
            setReversed: function (e) {
                if (r !== e) {
                    let n = t.get(`EXT_clip_control`);
                    (e
                        ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT)
                        : n.clipControlEXT(
                              n.LOWER_LEFT_EXT,
                              n.NEGATIVE_ONE_TO_ONE_EXT,
                          ),
                        (r = e));
                    let i = o;
                    ((o = null), this.setClear(i));
                }
            },
            getReversed: function () {
                return r;
            },
            setTest: function (t) {
                t ? L(e.DEPTH_TEST) : se(e.DEPTH_TEST);
            },
            setMask: function (t) {
                i !== t && !n && (e.depthMask(t), (i = t));
            },
            setFunc: function (t) {
                if ((r && (t = it[t]), a !== t)) {
                    switch (t) {
                        case 0:
                            e.depthFunc(e.NEVER);
                            break;
                        case 1:
                            e.depthFunc(e.ALWAYS);
                            break;
                        case 2:
                            e.depthFunc(e.LESS);
                            break;
                        case 3:
                            e.depthFunc(e.LEQUAL);
                            break;
                        case 4:
                            e.depthFunc(e.EQUAL);
                            break;
                        case 5:
                            e.depthFunc(e.GEQUAL);
                            break;
                        case 6:
                            e.depthFunc(e.GREATER);
                            break;
                        case 7:
                            e.depthFunc(e.NOTEQUAL);
                            break;
                        default:
                            e.depthFunc(e.LEQUAL);
                    }
                    a = t;
                }
            },
            setLocked: function (e) {
                n = e;
            },
            setClear: function (t) {
                o !== t && ((o = t), r && (t = 1 - t), e.clearDepth(t));
            },
            reset: function () {
                ((n = !1), (i = null), (a = null), (o = null), (r = !1));
            },
        };
    }
    function i() {
        let t = !1,
            n = null,
            r = null,
            i = null,
            a = null,
            o = null,
            s = null,
            c = null,
            l = null;
        return {
            setTest: function (n) {
                t || (n ? L(e.STENCIL_TEST) : se(e.STENCIL_TEST));
            },
            setMask: function (r) {
                n !== r && !t && (e.stencilMask(r), (n = r));
            },
            setFunc: function (t, n, o) {
                (r !== t || i !== n || a !== o) &&
                    (e.stencilFunc(t, n, o), (r = t), (i = n), (a = o));
            },
            setOp: function (t, n, r) {
                (o !== t || s !== n || c !== r) &&
                    (e.stencilOp(t, n, r), (o = t), (s = n), (c = r));
            },
            setLocked: function (e) {
                t = e;
            },
            setClear: function (t) {
                l !== t && (e.clearStencil(t), (l = t));
            },
            reset: function () {
                ((t = !1),
                    (n = null),
                    (r = null),
                    (i = null),
                    (a = null),
                    (o = null),
                    (s = null),
                    (c = null),
                    (l = null));
            },
        };
    }
    let a = new n(),
        o = new r(),
        s = new i(),
        c = new WeakMap(),
        l = new WeakMap(),
        u = {},
        d = {},
        f = {},
        p = new WeakMap(),
        m = [],
        h = null,
        g = !1,
        _ = null,
        v = null,
        y = null,
        b = null,
        x = null,
        S = null,
        C = null,
        w = new Z(0, 0, 0),
        T = 0,
        E = !1,
        D = null,
        O = null,
        k = null,
        A = null,
        j = null,
        M = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        N = !1,
        ee = 0,
        P = e.getParameter(e.VERSION);
    P.indexOf(`WebGL`) === -1
        ? P.indexOf(`OpenGL ES`) !== -1 &&
          ((ee = parseFloat(/^OpenGL ES (\d)/.exec(P)[1])), (N = ee >= 2))
        : ((ee = parseFloat(/^WebGL (\d)/.exec(P)[1])), (N = ee >= 1));
    let F = null,
        te = {},
        ne = e.getParameter(e.SCISSOR_BOX),
        re = e.getParameter(e.VIEWPORT),
        ie = new jt().fromArray(ne),
        I = new jt().fromArray(re);
    function ae(t, n, r, i) {
        let a = new Uint8Array(4),
            o = e.createTexture();
        (e.bindTexture(t, o),
            e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST),
            e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST));
        for (let o = 0; o < r; o++)
            t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY
                ? e.texImage3D(
                      n,
                      0,
                      e.RGBA,
                      1,
                      1,
                      i,
                      0,
                      e.RGBA,
                      e.UNSIGNED_BYTE,
                      a,
                  )
                : e.texImage2D(
                      n + o,
                      0,
                      e.RGBA,
                      1,
                      1,
                      0,
                      e.RGBA,
                      e.UNSIGNED_BYTE,
                      a,
                  );
        return o;
    }
    let oe = {};
    ((oe[e.TEXTURE_2D] = ae(e.TEXTURE_2D, e.TEXTURE_2D, 1)),
        (oe[e.TEXTURE_CUBE_MAP] = ae(
            e.TEXTURE_CUBE_MAP,
            e.TEXTURE_CUBE_MAP_POSITIVE_X,
            6,
        )),
        (oe[e.TEXTURE_2D_ARRAY] = ae(
            e.TEXTURE_2D_ARRAY,
            e.TEXTURE_2D_ARRAY,
            1,
            1,
        )),
        (oe[e.TEXTURE_3D] = ae(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1)),
        a.setClear(0, 0, 0, 1),
        o.setClear(1),
        s.setClear(0),
        L(e.DEPTH_TEST),
        o.setFunc(3),
        me(!1),
        he(1),
        L(e.CULL_FACE),
        R(0));
    function L(t) {
        u[t] !== !0 && (e.enable(t), (u[t] = !0));
    }
    function se(t) {
        u[t] !== !1 && (e.disable(t), (u[t] = !1));
    }
    function ce(t, n) {
        return f[t] === n
            ? !1
            : (e.bindFramebuffer(t, n),
              (f[t] = n),
              t === e.DRAW_FRAMEBUFFER && (f[e.FRAMEBUFFER] = n),
              t === e.FRAMEBUFFER && (f[e.DRAW_FRAMEBUFFER] = n),
              !0);
    }
    function le(t, n) {
        let r = m,
            i = !1;
        if (t) {
            ((r = p.get(n)), r === void 0 && ((r = []), p.set(n, r)));
            let a = t.textures;
            if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
                for (let t = 0, n = a.length; t < n; t++)
                    r[t] = e.COLOR_ATTACHMENT0 + t;
                ((r.length = a.length), (i = !0));
            }
        } else r[0] !== e.BACK && ((r[0] = e.BACK), (i = !0));
        i && e.drawBuffers(r);
    }
    function ue(t) {
        return h === t ? !1 : (e.useProgram(t), (h = t), !0);
    }
    let de = {
        100: e.FUNC_ADD,
        101: e.FUNC_SUBTRACT,
        102: e.FUNC_REVERSE_SUBTRACT,
    };
    ((de[103] = e.MIN), (de[104] = e.MAX));
    let fe = {
        200: e.ZERO,
        201: e.ONE,
        202: e.SRC_COLOR,
        204: e.SRC_ALPHA,
        210: e.SRC_ALPHA_SATURATE,
        208: e.DST_COLOR,
        206: e.DST_ALPHA,
        203: e.ONE_MINUS_SRC_COLOR,
        205: e.ONE_MINUS_SRC_ALPHA,
        209: e.ONE_MINUS_DST_COLOR,
        207: e.ONE_MINUS_DST_ALPHA,
        211: e.CONSTANT_COLOR,
        212: e.ONE_MINUS_CONSTANT_COLOR,
        213: e.CONSTANT_ALPHA,
        214: e.ONE_MINUS_CONSTANT_ALPHA,
    };
    function R(t, n, r, i, a, o, s, c, l, u) {
        if (t === 0) {
            g === !0 && (se(e.BLEND), (g = !1));
            return;
        }
        if ((g === !1 && (L(e.BLEND), (g = !0)), t !== 5)) {
            if (t !== _ || u !== E) {
                if (
                    ((v !== 100 || x !== 100) &&
                        (e.blendEquation(e.FUNC_ADD), (v = 100), (x = 100)),
                    u)
                )
                    switch (t) {
                        case 1:
                            e.blendFuncSeparate(
                                e.ONE,
                                e.ONE_MINUS_SRC_ALPHA,
                                e.ONE,
                                e.ONE_MINUS_SRC_ALPHA,
                            );
                            break;
                        case 2:
                            e.blendFunc(e.ONE, e.ONE);
                            break;
                        case 3:
                            e.blendFuncSeparate(
                                e.ZERO,
                                e.ONE_MINUS_SRC_COLOR,
                                e.ZERO,
                                e.ONE,
                            );
                            break;
                        case 4:
                            e.blendFuncSeparate(
                                e.DST_COLOR,
                                e.ONE_MINUS_SRC_ALPHA,
                                e.ZERO,
                                e.ONE,
                            );
                            break;
                        default:
                            G(`WebGLState: Invalid blending: `, t);
                            break;
                    }
                else
                    switch (t) {
                        case 1:
                            e.blendFuncSeparate(
                                e.SRC_ALPHA,
                                e.ONE_MINUS_SRC_ALPHA,
                                e.ONE,
                                e.ONE_MINUS_SRC_ALPHA,
                            );
                            break;
                        case 2:
                            e.blendFuncSeparate(
                                e.SRC_ALPHA,
                                e.ONE,
                                e.ONE,
                                e.ONE,
                            );
                            break;
                        case 3:
                            G(
                                `WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`,
                            );
                            break;
                        case 4:
                            G(
                                `WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`,
                            );
                            break;
                        default:
                            G(`WebGLState: Invalid blending: `, t);
                            break;
                    }
                ((y = null),
                    (b = null),
                    (S = null),
                    (C = null),
                    w.set(0, 0, 0),
                    (T = 0),
                    (_ = t),
                    (E = u));
            }
            return;
        }
        ((a ||= n),
            (o ||= r),
            (s ||= i),
            (n !== v || a !== x) &&
                (e.blendEquationSeparate(de[n], de[a]), (v = n), (x = a)),
            (r !== y || i !== b || o !== S || s !== C) &&
                (e.blendFuncSeparate(fe[r], fe[i], fe[o], fe[s]),
                (y = r),
                (b = i),
                (S = o),
                (C = s)),
            (c.equals(w) === !1 || l !== T) &&
                (e.blendColor(c.r, c.g, c.b, l), w.copy(c), (T = l)),
            (_ = t),
            (E = !1));
    }
    function pe(t, n) {
        t.side === 2 ? se(e.CULL_FACE) : L(e.CULL_FACE);
        let r = t.side === 1;
        (n && (r = !r),
            me(r),
            t.blending === 1 && t.transparent === !1
                ? R(0)
                : R(
                      t.blending,
                      t.blendEquation,
                      t.blendSrc,
                      t.blendDst,
                      t.blendEquationAlpha,
                      t.blendSrcAlpha,
                      t.blendDstAlpha,
                      t.blendColor,
                      t.blendAlpha,
                      t.premultipliedAlpha,
                  ),
            o.setFunc(t.depthFunc),
            o.setTest(t.depthTest),
            o.setMask(t.depthWrite),
            a.setMask(t.colorWrite));
        let i = t.stencilWrite;
        (s.setTest(i),
            i &&
                (s.setMask(t.stencilWriteMask),
                s.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask),
                s.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)),
            _e(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits),
            t.alphaToCoverage === !0
                ? L(e.SAMPLE_ALPHA_TO_COVERAGE)
                : se(e.SAMPLE_ALPHA_TO_COVERAGE));
    }
    function me(t) {
        D !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), (D = t));
    }
    function he(t) {
        (t === 0
            ? se(e.CULL_FACE)
            : (L(e.CULL_FACE),
              t !== O &&
                  (t === 1
                      ? e.cullFace(e.BACK)
                      : t === 2
                        ? e.cullFace(e.FRONT)
                        : e.cullFace(e.FRONT_AND_BACK))),
            (O = t));
    }
    function ge(t) {
        t !== k && (N && e.lineWidth(t), (k = t));
    }
    function _e(t, n, r) {
        t
            ? (L(e.POLYGON_OFFSET_FILL),
              (A !== n || j !== r) &&
                  ((A = n),
                  (j = r),
                  o.getReversed() && (n = -n),
                  e.polygonOffset(n, r)))
            : se(e.POLYGON_OFFSET_FILL);
    }
    function ve(t) {
        t ? L(e.SCISSOR_TEST) : se(e.SCISSOR_TEST);
    }
    function ye(t) {
        (t === void 0 && (t = e.TEXTURE0 + M - 1),
            F !== t && (e.activeTexture(t), (F = t)));
    }
    function be(t, n, r) {
        r === void 0 && (r = F === null ? e.TEXTURE0 + M - 1 : F);
        let i = te[r];
        (i === void 0 && ((i = { type: void 0, texture: void 0 }), (te[r] = i)),
            (i.type !== t || i.texture !== n) &&
                (F !== r && (e.activeTexture(r), (F = r)),
                e.bindTexture(t, n || oe[t]),
                (i.type = t),
                (i.texture = n)));
    }
    function xe() {
        let t = te[F];
        t !== void 0 &&
            t.type !== void 0 &&
            (e.bindTexture(t.type, null),
            (t.type = void 0),
            (t.texture = void 0));
    }
    function Se() {
        try {
            e.compressedTexImage2D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function Ce() {
        try {
            e.compressedTexImage3D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function we() {
        try {
            e.texSubImage2D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function Te() {
        try {
            e.texSubImage3D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function Ee() {
        try {
            e.compressedTexSubImage2D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function z() {
        try {
            e.compressedTexSubImage3D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function De() {
        try {
            e.texStorage2D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function B() {
        try {
            e.texStorage3D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function Oe() {
        try {
            e.texImage2D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function V() {
        try {
            e.texImage3D(...arguments);
        } catch (e) {
            G(`WebGLState:`, e);
        }
    }
    function ke(t) {
        return d[t] === void 0 ? e.getParameter(t) : d[t];
    }
    function H(t, n) {
        d[t] !== n && (e.pixelStorei(t, n), (d[t] = n));
    }
    function U(t) {
        ie.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), ie.copy(t));
    }
    function Ae(t) {
        I.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), I.copy(t));
    }
    function je(t, n) {
        let r = l.get(n);
        r === void 0 && ((r = new WeakMap()), l.set(n, r));
        let i = r.get(t);
        i === void 0 && ((i = e.getUniformBlockIndex(n, t.name)), r.set(t, i));
    }
    function Me(t, n) {
        let r = l.get(n).get(t);
        c.get(n) !== r &&
            (e.uniformBlockBinding(n, r, t.__bindingPointIndex), c.set(n, r));
    }
    function Ne() {
        (e.disable(e.BLEND),
            e.disable(e.CULL_FACE),
            e.disable(e.DEPTH_TEST),
            e.disable(e.POLYGON_OFFSET_FILL),
            e.disable(e.SCISSOR_TEST),
            e.disable(e.STENCIL_TEST),
            e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),
            e.blendEquation(e.FUNC_ADD),
            e.blendFunc(e.ONE, e.ZERO),
            e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO),
            e.blendColor(0, 0, 0, 0),
            e.colorMask(!0, !0, !0, !0),
            e.clearColor(0, 0, 0, 0),
            e.depthMask(!0),
            e.depthFunc(e.LESS),
            o.setReversed(!1),
            e.clearDepth(1),
            e.stencilMask(4294967295),
            e.stencilFunc(e.ALWAYS, 0, 4294967295),
            e.stencilOp(e.KEEP, e.KEEP, e.KEEP),
            e.clearStencil(0),
            e.cullFace(e.BACK),
            e.frontFace(e.CCW),
            e.polygonOffset(0, 0),
            e.activeTexture(e.TEXTURE0),
            e.bindFramebuffer(e.FRAMEBUFFER, null),
            e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null),
            e.bindFramebuffer(e.READ_FRAMEBUFFER, null),
            e.useProgram(null),
            e.lineWidth(1),
            e.scissor(0, 0, e.canvas.width, e.canvas.height),
            e.viewport(0, 0, e.canvas.width, e.canvas.height),
            e.pixelStorei(e.PACK_ALIGNMENT, 4),
            e.pixelStorei(e.UNPACK_ALIGNMENT, 4),
            e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1),
            e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            e.pixelStorei(
                e.UNPACK_COLORSPACE_CONVERSION_WEBGL,
                e.BROWSER_DEFAULT_WEBGL,
            ),
            e.pixelStorei(e.PACK_ROW_LENGTH, 0),
            e.pixelStorei(e.PACK_SKIP_PIXELS, 0),
            e.pixelStorei(e.PACK_SKIP_ROWS, 0),
            e.pixelStorei(e.UNPACK_ROW_LENGTH, 0),
            e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0),
            e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0),
            e.pixelStorei(e.UNPACK_SKIP_ROWS, 0),
            e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0),
            (u = {}),
            (d = {}),
            (F = null),
            (te = {}),
            (f = {}),
            (p = new WeakMap()),
            (m = []),
            (h = null),
            (g = !1),
            (_ = null),
            (v = null),
            (y = null),
            (b = null),
            (x = null),
            (S = null),
            (C = null),
            (w = new Z(0, 0, 0)),
            (T = 0),
            (E = !1),
            (D = null),
            (O = null),
            (k = null),
            (A = null),
            (j = null),
            ie.set(0, 0, e.canvas.width, e.canvas.height),
            I.set(0, 0, e.canvas.width, e.canvas.height),
            a.reset(),
            o.reset(),
            s.reset());
    }
    return {
        buffers: { color: a, depth: o, stencil: s },
        enable: L,
        disable: se,
        bindFramebuffer: ce,
        drawBuffers: le,
        useProgram: ue,
        setBlending: R,
        setMaterial: pe,
        setFlipSided: me,
        setCullFace: he,
        setLineWidth: ge,
        setPolygonOffset: _e,
        setScissorTest: ve,
        activeTexture: ye,
        bindTexture: be,
        unbindTexture: xe,
        compressedTexImage2D: Se,
        compressedTexImage3D: Ce,
        texImage2D: Oe,
        texImage3D: V,
        pixelStorei: H,
        getParameter: ke,
        updateUBOMapping: je,
        uniformBlockBinding: Me,
        texStorage2D: De,
        texStorage3D: B,
        texSubImage2D: we,
        texSubImage3D: Te,
        compressedTexSubImage2D: Ee,
        compressedTexSubImage3D: z,
        scissor: U,
        viewport: Ae,
        reset: Ne,
    };
}
function bc(e, t, n, r, i, a, o) {
    let s = t.has(`WEBGL_multisampled_render_to_texture`)
            ? t.get(`WEBGL_multisampled_render_to_texture`)
            : null,
        _ =
            typeof navigator > `u`
                ? !1
                : /OculusBrowser/g.test(navigator.userAgent),
        v = new q(),
        y = new WeakMap(),
        b = new Set(),
        x,
        S = new WeakMap(),
        C = !1;
    try {
        C =
            typeof OffscreenCanvas < `u` &&
            new OffscreenCanvas(1, 1).getContext(`2d`) !== null;
    } catch {}
    function w(e, t) {
        return C ? new OffscreenCanvas(e, t) : Xe(`canvas`);
    }
    function T(e, t, n) {
        let r = 1,
            i = ke(e);
        if (
            ((i.width > n || i.height > n) &&
                (r = n / Math.max(i.width, i.height)),
            r < 1)
        )
            if (
                (typeof HTMLImageElement < `u` &&
                    e instanceof HTMLImageElement) ||
                (typeof HTMLCanvasElement < `u` &&
                    e instanceof HTMLCanvasElement) ||
                (typeof ImageBitmap < `u` && e instanceof ImageBitmap) ||
                (typeof VideoFrame < `u` && e instanceof VideoFrame)
            ) {
                let n = Math.floor(r * i.width),
                    a = Math.floor(r * i.height);
                x === void 0 && (x = w(n, a));
                let o = t ? w(n, a) : x;
                return (
                    (o.width = n),
                    (o.height = a),
                    o.getContext(`2d`).drawImage(e, 0, 0, n, a),
                    W(
                        `WebGLRenderer: Texture has been resized from (` +
                            i.width +
                            `x` +
                            i.height +
                            `) to (` +
                            n +
                            `x` +
                            a +
                            `).`,
                    ),
                    o
                );
            } else
                return (
                    `data` in e &&
                        W(
                            `WebGLRenderer: Image in DataTexture is too big (` +
                                i.width +
                                `x` +
                                i.height +
                                `).`,
                        ),
                    e
                );
        return e;
    }
    function E(e) {
        return e.generateMipmaps;
    }
    function D(t) {
        e.generateMipmap(t);
    }
    function O(t) {
        return t.isWebGLCubeRenderTarget
            ? e.TEXTURE_CUBE_MAP
            : t.isWebGL3DRenderTarget
              ? e.TEXTURE_3D
              : t.isWebGLArrayRenderTarget || t.isCompressedArrayTexture
                ? e.TEXTURE_2D_ARRAY
                : e.TEXTURE_2D;
    }
    function k(n, r, i, a, o, s = !1) {
        if (n !== null) {
            if (e[n] !== void 0) return e[n];
            W(
                `WebGLRenderer: Attempt to use non-existing WebGL internal format '` +
                    n +
                    `'`,
            );
        }
        let c;
        a &&
            ((c = t.get(`EXT_texture_norm16`)),
            c ||
                W(
                    `WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`,
                ));
        let l = r;
        if (
            (r === e.RED &&
                (i === e.FLOAT && (l = e.R32F),
                i === e.HALF_FLOAT && (l = e.R16F),
                i === e.UNSIGNED_BYTE && (l = e.R8),
                i === e.UNSIGNED_SHORT && c && (l = c.R16_EXT),
                i === e.SHORT && c && (l = c.R16_SNORM_EXT)),
            r === e.RED_INTEGER &&
                (i === e.UNSIGNED_BYTE && (l = e.R8UI),
                i === e.UNSIGNED_SHORT && (l = e.R16UI),
                i === e.UNSIGNED_INT && (l = e.R32UI),
                i === e.BYTE && (l = e.R8I),
                i === e.SHORT && (l = e.R16I),
                i === e.INT && (l = e.R32I)),
            r === e.RG &&
                (i === e.FLOAT && (l = e.RG32F),
                i === e.HALF_FLOAT && (l = e.RG16F),
                i === e.UNSIGNED_BYTE && (l = e.RG8),
                i === e.UNSIGNED_SHORT && c && (l = c.RG16_EXT),
                i === e.SHORT && c && (l = c.RG16_SNORM_EXT)),
            r === e.RG_INTEGER &&
                (i === e.UNSIGNED_BYTE && (l = e.RG8UI),
                i === e.UNSIGNED_SHORT && (l = e.RG16UI),
                i === e.UNSIGNED_INT && (l = e.RG32UI),
                i === e.BYTE && (l = e.RG8I),
                i === e.SHORT && (l = e.RG16I),
                i === e.INT && (l = e.RG32I)),
            r === e.RGB_INTEGER &&
                (i === e.UNSIGNED_BYTE && (l = e.RGB8UI),
                i === e.UNSIGNED_SHORT && (l = e.RGB16UI),
                i === e.UNSIGNED_INT && (l = e.RGB32UI),
                i === e.BYTE && (l = e.RGB8I),
                i === e.SHORT && (l = e.RGB16I),
                i === e.INT && (l = e.RGB32I)),
            r === e.RGBA_INTEGER &&
                (i === e.UNSIGNED_BYTE && (l = e.RGBA8UI),
                i === e.UNSIGNED_SHORT && (l = e.RGBA16UI),
                i === e.UNSIGNED_INT && (l = e.RGBA32UI),
                i === e.BYTE && (l = e.RGBA8I),
                i === e.SHORT && (l = e.RGBA16I),
                i === e.INT && (l = e.RGBA32I)),
            r === e.RGB &&
                (i === e.UNSIGNED_SHORT && c && (l = c.RGB16_EXT),
                i === e.SHORT && c && (l = c.RGB16_SNORM_EXT),
                i === e.UNSIGNED_INT_5_9_9_9_REV && (l = e.RGB9_E5),
                i === e.UNSIGNED_INT_10F_11F_11F_REV && (l = e.R11F_G11F_B10F)),
            r === e.RGBA)
        ) {
            let t = s ? He : X.getTransfer(o);
            (i === e.FLOAT && (l = e.RGBA32F),
                i === e.HALF_FLOAT && (l = e.RGBA16F),
                i === e.UNSIGNED_BYTE &&
                    (l = t === `srgb` ? e.SRGB8_ALPHA8 : e.RGBA8),
                i === e.UNSIGNED_SHORT && c && (l = c.RGBA16_EXT),
                i === e.SHORT && c && (l = c.RGBA16_SNORM_EXT),
                i === e.UNSIGNED_SHORT_4_4_4_4 && (l = e.RGBA4),
                i === e.UNSIGNED_SHORT_5_5_5_1 && (l = e.RGB5_A1));
        }
        return (
            (l === e.R16F ||
                l === e.R32F ||
                l === e.RG16F ||
                l === e.RG32F ||
                l === e.RGBA16F ||
                l === e.RGBA32F) &&
                t.get(`EXT_color_buffer_float`),
            l
        );
    }
    function A(t, n) {
        let r;
        return (
            t
                ? n === null || n === 1014 || n === 1020
                    ? (r = e.DEPTH24_STENCIL8)
                    : n === 1015
                      ? (r = e.DEPTH32F_STENCIL8)
                      : n === 1012 &&
                        ((r = e.DEPTH24_STENCIL8),
                        W(
                            `DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`,
                        ))
                : n === null || n === 1014 || n === 1020
                  ? (r = e.DEPTH_COMPONENT24)
                  : n === 1015
                    ? (r = e.DEPTH_COMPONENT32F)
                    : n === 1012 && (r = e.DEPTH_COMPONENT16),
            r
        );
    }
    function j(e, t) {
        return E(e) === !0 ||
            (e.isFramebufferTexture &&
                e.minFilter !== 1003 &&
                e.minFilter !== 1006)
            ? Math.log2(Math.max(t.width, t.height)) + 1
            : e.mipmaps !== void 0 && e.mipmaps.length > 0
              ? e.mipmaps.length
              : e.isCompressedTexture && Array.isArray(e.image)
                ? t.mipmaps.length
                : 1;
    }
    function M(e) {
        let t = e.target;
        (t.removeEventListener(`dispose`, M),
            P(t),
            t.isVideoTexture && y.delete(t),
            t.isHTMLTexture && b.delete(t));
    }
    function N(e) {
        let t = e.target;
        (t.removeEventListener(`dispose`, N), te(t));
    }
    function P(e) {
        let t = r.get(e);
        if (t.__webglInit === void 0) return;
        let n = e.source,
            i = S.get(n);
        if (i) {
            let r = i[t.__cacheKey];
            (r.usedTimes--,
                r.usedTimes === 0 && F(e),
                Object.keys(i).length === 0 && S.delete(n));
        }
        r.remove(e);
    }
    function F(t) {
        let n = r.get(t);
        e.deleteTexture(n.__webglTexture);
        let i = t.source,
            a = S.get(i);
        (delete a[n.__cacheKey], o.memory.textures--);
    }
    function te(t) {
        let n = r.get(t);
        if (
            (t.depthTexture &&
                (t.depthTexture.dispose(), r.remove(t.depthTexture)),
            t.isWebGLCubeRenderTarget)
        )
            for (let t = 0; t < 6; t++) {
                if (Array.isArray(n.__webglFramebuffer[t]))
                    for (let r = 0; r < n.__webglFramebuffer[t].length; r++)
                        e.deleteFramebuffer(n.__webglFramebuffer[t][r]);
                else e.deleteFramebuffer(n.__webglFramebuffer[t]);
                n.__webglDepthbuffer &&
                    e.deleteRenderbuffer(n.__webglDepthbuffer[t]);
            }
        else {
            if (Array.isArray(n.__webglFramebuffer))
                for (let t = 0; t < n.__webglFramebuffer.length; t++)
                    e.deleteFramebuffer(n.__webglFramebuffer[t]);
            else e.deleteFramebuffer(n.__webglFramebuffer);
            if (
                (n.__webglDepthbuffer &&
                    e.deleteRenderbuffer(n.__webglDepthbuffer),
                n.__webglMultisampledFramebuffer &&
                    e.deleteFramebuffer(n.__webglMultisampledFramebuffer),
                n.__webglColorRenderbuffer)
            )
                for (let t = 0; t < n.__webglColorRenderbuffer.length; t++)
                    n.__webglColorRenderbuffer[t] &&
                        e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);
            n.__webglDepthRenderbuffer &&
                e.deleteRenderbuffer(n.__webglDepthRenderbuffer);
        }
        let i = t.textures;
        for (let t = 0, n = i.length; t < n; t++) {
            let n = r.get(i[t]);
            (n.__webglTexture &&
                (e.deleteTexture(n.__webglTexture), o.memory.textures--),
                r.remove(i[t]));
        }
        r.remove(t);
    }
    let ne = 0;
    function re() {
        ne = 0;
    }
    function ie() {
        return ne;
    }
    function I(e) {
        ne = e;
    }
    function ae() {
        let e = ne;
        return (
            e >= i.maxTextures &&
                W(
                    `WebGLTextures: Trying to use ` +
                        e +
                        ` texture units while this GPU supports only ` +
                        i.maxTextures,
                ),
            (ne += 1),
            e
        );
    }
    function oe(e) {
        let t = [];
        return (
            t.push(e.wrapS),
            t.push(e.wrapT),
            t.push(e.wrapR || 0),
            t.push(e.magFilter),
            t.push(e.minFilter),
            t.push(e.anisotropy),
            t.push(e.internalFormat),
            t.push(e.format),
            t.push(e.type),
            t.push(e.generateMipmaps),
            t.push(e.premultiplyAlpha),
            t.push(e.flipY),
            t.push(e.unpackAlignment),
            t.push(e.colorSpace),
            t.join()
        );
    }
    function L(t, i) {
        let a = r.get(t);
        if (
            (t.isVideoTexture && Oe(t),
            t.isRenderTargetTexture === !1 &&
                t.isExternalTexture !== !0 &&
                t.version > 0 &&
                a.__version !== t.version)
        ) {
            let e = t.image;
            if (e === null)
                W(
                    `WebGLRenderer: Texture marked for update but no image data found.`,
                );
            else if (e.complete === !1)
                W(
                    `WebGLRenderer: Texture marked for update but image is incomplete`,
                );
            else {
                ge(a, t, i);
                return;
            }
        } else
            t.isExternalTexture &&
                (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null);
        n.bindTexture(e.TEXTURE_2D, a.__webglTexture, e.TEXTURE0 + i);
    }
    function se(t, i) {
        let a = r.get(t);
        if (
            t.isRenderTargetTexture === !1 &&
            t.version > 0 &&
            a.__version !== t.version
        ) {
            ge(a, t, i);
            return;
        } else
            t.isExternalTexture &&
                (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null);
        n.bindTexture(e.TEXTURE_2D_ARRAY, a.__webglTexture, e.TEXTURE0 + i);
    }
    function ce(t, i) {
        let a = r.get(t);
        if (
            t.isRenderTargetTexture === !1 &&
            t.version > 0 &&
            a.__version !== t.version
        ) {
            ge(a, t, i);
            return;
        }
        n.bindTexture(e.TEXTURE_3D, a.__webglTexture, e.TEXTURE0 + i);
    }
    function le(t, i) {
        let a = r.get(t);
        if (
            t.isCubeDepthTexture !== !0 &&
            t.version > 0 &&
            a.__version !== t.version
        ) {
            _e(a, t, i);
            return;
        }
        n.bindTexture(e.TEXTURE_CUBE_MAP, a.__webglTexture, e.TEXTURE0 + i);
    }
    let ue = { [c]: e.REPEAT, [l]: e.CLAMP_TO_EDGE, [u]: e.MIRRORED_REPEAT },
        de = {
            [d]: e.NEAREST,
            [f]: e.NEAREST_MIPMAP_NEAREST,
            [p]: e.NEAREST_MIPMAP_LINEAR,
            [m]: e.LINEAR,
            [h]: e.LINEAR_MIPMAP_NEAREST,
            [g]: e.LINEAR_MIPMAP_LINEAR,
        },
        fe = {
            512: e.NEVER,
            519: e.ALWAYS,
            513: e.LESS,
            515: e.LEQUAL,
            514: e.EQUAL,
            518: e.GEQUAL,
            516: e.GREATER,
            517: e.NOTEQUAL,
        };
    function R(n, a) {
        if (
            (a.type === 1015 &&
                t.has(`OES_texture_float_linear`) === !1 &&
                (a.magFilter === 1006 ||
                    a.magFilter === 1007 ||
                    a.magFilter === 1005 ||
                    a.magFilter === 1008 ||
                    a.minFilter === 1006 ||
                    a.minFilter === 1007 ||
                    a.minFilter === 1005 ||
                    a.minFilter === 1008) &&
                W(
                    `WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`,
                ),
            e.texParameteri(n, e.TEXTURE_WRAP_S, ue[a.wrapS]),
            e.texParameteri(n, e.TEXTURE_WRAP_T, ue[a.wrapT]),
            (n === e.TEXTURE_3D || n === e.TEXTURE_2D_ARRAY) &&
                e.texParameteri(n, e.TEXTURE_WRAP_R, ue[a.wrapR]),
            e.texParameteri(n, e.TEXTURE_MAG_FILTER, de[a.magFilter]),
            e.texParameteri(n, e.TEXTURE_MIN_FILTER, de[a.minFilter]),
            a.compareFunction &&
                (e.texParameteri(
                    n,
                    e.TEXTURE_COMPARE_MODE,
                    e.COMPARE_REF_TO_TEXTURE,
                ),
                e.texParameteri(
                    n,
                    e.TEXTURE_COMPARE_FUNC,
                    fe[a.compareFunction],
                )),
            t.has(`EXT_texture_filter_anisotropic`) === !0)
        ) {
            if (
                a.magFilter === 1003 ||
                (a.minFilter !== 1005 && a.minFilter !== 1008) ||
                (a.type === 1015 && t.has(`OES_texture_float_linear`) === !1)
            )
                return;
            if (a.anisotropy > 1 || r.get(a).__currentAnisotropy) {
                let o = t.get(`EXT_texture_filter_anisotropic`);
                (e.texParameterf(
                    n,
                    o.TEXTURE_MAX_ANISOTROPY_EXT,
                    Math.min(a.anisotropy, i.getMaxAnisotropy()),
                ),
                    (r.get(a).__currentAnisotropy = a.anisotropy));
            }
        }
    }
    function pe(t, n) {
        let r = !1;
        t.__webglInit === void 0 &&
            ((t.__webglInit = !0), n.addEventListener(`dispose`, M));
        let i = n.source,
            a = S.get(i);
        a === void 0 && ((a = {}), S.set(i, a));
        let s = oe(n);
        if (s !== t.__cacheKey) {
            (a[s] === void 0 &&
                ((a[s] = { texture: e.createTexture(), usedTimes: 0 }),
                o.memory.textures++,
                (r = !0)),
                a[s].usedTimes++);
            let i = a[t.__cacheKey];
            (i !== void 0 &&
                (a[t.__cacheKey].usedTimes--, i.usedTimes === 0 && F(n)),
                (t.__cacheKey = s),
                (t.__webglTexture = a[s].texture));
        }
        return r;
    }
    function me(e, t, n) {
        return Math.floor(Math.floor(e / n) / t);
    }
    function he(t, r, i, a) {
        let o = t.updateRanges;
        if (o.length === 0)
            n.texSubImage2D(
                e.TEXTURE_2D,
                0,
                0,
                0,
                r.width,
                r.height,
                i,
                a,
                r.data,
            );
        else {
            o.sort((e, t) => e.start - t.start);
            let s = 0;
            for (let e = 1; e < o.length; e++) {
                let t = o[s],
                    n = o[e],
                    i = t.start + t.count,
                    a = me(n.start, r.width, 4),
                    c = me(t.start, r.width, 4);
                n.start <= i + 1 &&
                a === c &&
                me(n.start + n.count - 1, r.width, 4) === a
                    ? (t.count = Math.max(t.count, n.start + n.count - t.start))
                    : (++s, (o[s] = n));
            }
            o.length = s + 1;
            let c = n.getParameter(e.UNPACK_ROW_LENGTH),
                l = n.getParameter(e.UNPACK_SKIP_PIXELS),
                u = n.getParameter(e.UNPACK_SKIP_ROWS);
            n.pixelStorei(e.UNPACK_ROW_LENGTH, r.width);
            for (let t = 0, s = o.length; t < s; t++) {
                let s = o[t],
                    c = Math.floor(s.start / 4),
                    l = Math.ceil(s.count / 4),
                    u = c % r.width,
                    d = Math.floor(c / r.width),
                    f = l;
                (n.pixelStorei(e.UNPACK_SKIP_PIXELS, u),
                    n.pixelStorei(e.UNPACK_SKIP_ROWS, d),
                    n.texSubImage2D(e.TEXTURE_2D, 0, u, d, f, 1, i, a, r.data));
            }
            (t.clearUpdateRanges(),
                n.pixelStorei(e.UNPACK_ROW_LENGTH, c),
                n.pixelStorei(e.UNPACK_SKIP_PIXELS, l),
                n.pixelStorei(e.UNPACK_SKIP_ROWS, u));
        }
    }
    function ge(t, o, s) {
        let c = e.TEXTURE_2D;
        ((o.isDataArrayTexture || o.isCompressedArrayTexture) &&
            (c = e.TEXTURE_2D_ARRAY),
            o.isData3DTexture && (c = e.TEXTURE_3D));
        let l = pe(t, o),
            u = o.source;
        n.bindTexture(c, t.__webglTexture, e.TEXTURE0 + s);
        let d = r.get(u);
        if (u.version !== d.__version || l === !0) {
            if (
                (n.activeTexture(e.TEXTURE0 + s),
                !(typeof ImageBitmap < `u` && o.image instanceof ImageBitmap))
            ) {
                let t = X.getPrimaries(X.workingColorSpace),
                    r =
                        o.colorSpace === ``
                            ? null
                            : X.getPrimaries(o.colorSpace),
                    i =
                        o.colorSpace === `` || t === r
                            ? e.NONE
                            : e.BROWSER_DEFAULT_WEBGL;
                (n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, o.flipY),
                    n.pixelStorei(
                        e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                        o.premultiplyAlpha,
                    ),
                    n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, i));
            }
            n.pixelStorei(e.UNPACK_ALIGNMENT, o.unpackAlignment);
            let t = T(o.image, !1, i.maxTextureSize);
            t = V(o, t);
            let r = a.convert(o.format, o.colorSpace),
                f = a.convert(o.type),
                p = k(
                    o.internalFormat,
                    r,
                    f,
                    o.normalized,
                    o.colorSpace,
                    o.isVideoTexture,
                );
            R(c, o);
            let m,
                h = o.mipmaps,
                g = o.isVideoTexture !== !0,
                _ = d.__version === void 0 || l === !0,
                v = u.dataReady,
                y = j(o, t);
            if (o.isDepthTexture)
                ((p = A(o.format === ee, o.type)),
                    _ &&
                        (g
                            ? n.texStorage2D(
                                  e.TEXTURE_2D,
                                  1,
                                  p,
                                  t.width,
                                  t.height,
                              )
                            : n.texImage2D(
                                  e.TEXTURE_2D,
                                  0,
                                  p,
                                  t.width,
                                  t.height,
                                  0,
                                  r,
                                  f,
                                  null,
                              )));
            else if (o.isDataTexture)
                if (h.length > 0) {
                    g &&
                        _ &&
                        n.texStorage2D(
                            e.TEXTURE_2D,
                            y,
                            p,
                            h[0].width,
                            h[0].height,
                        );
                    for (let t = 0, i = h.length; t < i; t++)
                        ((m = h[t]),
                            g
                                ? v &&
                                  n.texSubImage2D(
                                      e.TEXTURE_2D,
                                      t,
                                      0,
                                      0,
                                      m.width,
                                      m.height,
                                      r,
                                      f,
                                      m.data,
                                  )
                                : n.texImage2D(
                                      e.TEXTURE_2D,
                                      t,
                                      p,
                                      m.width,
                                      m.height,
                                      0,
                                      r,
                                      f,
                                      m.data,
                                  ));
                    o.generateMipmaps = !1;
                } else
                    g
                        ? (_ &&
                              n.texStorage2D(
                                  e.TEXTURE_2D,
                                  y,
                                  p,
                                  t.width,
                                  t.height,
                              ),
                          v && he(o, t, r, f))
                        : n.texImage2D(
                              e.TEXTURE_2D,
                              0,
                              p,
                              t.width,
                              t.height,
                              0,
                              r,
                              f,
                              t.data,
                          );
            else if (o.isCompressedTexture)
                if (o.isCompressedArrayTexture) {
                    g &&
                        _ &&
                        n.texStorage3D(
                            e.TEXTURE_2D_ARRAY,
                            y,
                            p,
                            h[0].width,
                            h[0].height,
                            t.depth,
                        );
                    for (let i = 0, a = h.length; i < a; i++)
                        if (((m = h[i]), o.format !== 1023))
                            if (r !== null)
                                if (g) {
                                    if (v)
                                        if (o.layerUpdates.size > 0) {
                                            let t = ha(
                                                m.width,
                                                m.height,
                                                o.format,
                                                o.type,
                                            );
                                            for (let a of o.layerUpdates) {
                                                let o = m.data.subarray(
                                                    (a * t) /
                                                        m.data
                                                            .BYTES_PER_ELEMENT,
                                                    ((a + 1) * t) /
                                                        m.data
                                                            .BYTES_PER_ELEMENT,
                                                );
                                                n.compressedTexSubImage3D(
                                                    e.TEXTURE_2D_ARRAY,
                                                    i,
                                                    0,
                                                    0,
                                                    a,
                                                    m.width,
                                                    m.height,
                                                    1,
                                                    r,
                                                    o,
                                                );
                                            }
                                            o.clearLayerUpdates();
                                        } else
                                            n.compressedTexSubImage3D(
                                                e.TEXTURE_2D_ARRAY,
                                                i,
                                                0,
                                                0,
                                                0,
                                                m.width,
                                                m.height,
                                                t.depth,
                                                r,
                                                m.data,
                                            );
                                } else
                                    n.compressedTexImage3D(
                                        e.TEXTURE_2D_ARRAY,
                                        i,
                                        p,
                                        m.width,
                                        m.height,
                                        t.depth,
                                        0,
                                        m.data,
                                        0,
                                        0,
                                    );
                            else
                                W(
                                    `WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`,
                                );
                        else
                            g
                                ? v &&
                                  n.texSubImage3D(
                                      e.TEXTURE_2D_ARRAY,
                                      i,
                                      0,
                                      0,
                                      0,
                                      m.width,
                                      m.height,
                                      t.depth,
                                      r,
                                      f,
                                      m.data,
                                  )
                                : n.texImage3D(
                                      e.TEXTURE_2D_ARRAY,
                                      i,
                                      p,
                                      m.width,
                                      m.height,
                                      t.depth,
                                      0,
                                      r,
                                      f,
                                      m.data,
                                  );
                } else {
                    g &&
                        _ &&
                        n.texStorage2D(
                            e.TEXTURE_2D,
                            y,
                            p,
                            h[0].width,
                            h[0].height,
                        );
                    for (let t = 0, i = h.length; t < i; t++)
                        ((m = h[t]),
                            o.format === 1023
                                ? g
                                    ? v &&
                                      n.texSubImage2D(
                                          e.TEXTURE_2D,
                                          t,
                                          0,
                                          0,
                                          m.width,
                                          m.height,
                                          r,
                                          f,
                                          m.data,
                                      )
                                    : n.texImage2D(
                                          e.TEXTURE_2D,
                                          t,
                                          p,
                                          m.width,
                                          m.height,
                                          0,
                                          r,
                                          f,
                                          m.data,
                                      )
                                : r === null
                                  ? W(
                                        `WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`,
                                    )
                                  : g
                                    ? v &&
                                      n.compressedTexSubImage2D(
                                          e.TEXTURE_2D,
                                          t,
                                          0,
                                          0,
                                          m.width,
                                          m.height,
                                          r,
                                          m.data,
                                      )
                                    : n.compressedTexImage2D(
                                          e.TEXTURE_2D,
                                          t,
                                          p,
                                          m.width,
                                          m.height,
                                          0,
                                          m.data,
                                      ));
                }
            else if (o.isDataArrayTexture)
                if (g) {
                    if (
                        (_ &&
                            n.texStorage3D(
                                e.TEXTURE_2D_ARRAY,
                                y,
                                p,
                                t.width,
                                t.height,
                                t.depth,
                            ),
                        v)
                    )
                        if (o.layerUpdates.size > 0) {
                            let i = ha(t.width, t.height, o.format, o.type);
                            for (let a of o.layerUpdates) {
                                let o = t.data.subarray(
                                    (a * i) / t.data.BYTES_PER_ELEMENT,
                                    ((a + 1) * i) / t.data.BYTES_PER_ELEMENT,
                                );
                                n.texSubImage3D(
                                    e.TEXTURE_2D_ARRAY,
                                    0,
                                    0,
                                    0,
                                    a,
                                    t.width,
                                    t.height,
                                    1,
                                    r,
                                    f,
                                    o,
                                );
                            }
                            o.clearLayerUpdates();
                        } else
                            n.texSubImage3D(
                                e.TEXTURE_2D_ARRAY,
                                0,
                                0,
                                0,
                                0,
                                t.width,
                                t.height,
                                t.depth,
                                r,
                                f,
                                t.data,
                            );
                } else
                    n.texImage3D(
                        e.TEXTURE_2D_ARRAY,
                        0,
                        p,
                        t.width,
                        t.height,
                        t.depth,
                        0,
                        r,
                        f,
                        t.data,
                    );
            else if (o.isData3DTexture)
                g
                    ? (_ &&
                          n.texStorage3D(
                              e.TEXTURE_3D,
                              y,
                              p,
                              t.width,
                              t.height,
                              t.depth,
                          ),
                      v &&
                          n.texSubImage3D(
                              e.TEXTURE_3D,
                              0,
                              0,
                              0,
                              0,
                              t.width,
                              t.height,
                              t.depth,
                              r,
                              f,
                              t.data,
                          ))
                    : n.texImage3D(
                          e.TEXTURE_3D,
                          0,
                          p,
                          t.width,
                          t.height,
                          t.depth,
                          0,
                          r,
                          f,
                          t.data,
                      );
            else if (o.isFramebufferTexture) {
                if (_)
                    if (g)
                        n.texStorage2D(e.TEXTURE_2D, y, p, t.width, t.height);
                    else {
                        let i = t.width,
                            a = t.height;
                        for (let t = 0; t < y; t++)
                            (n.texImage2D(
                                e.TEXTURE_2D,
                                t,
                                p,
                                i,
                                a,
                                0,
                                r,
                                f,
                                null,
                            ),
                                (i >>= 1),
                                (a >>= 1));
                    }
            } else if (o.isHTMLTexture) {
                if (`texElementImage2D` in e) {
                    let n = e.canvas;
                    if (
                        (n.hasAttribute(`layoutsubtree`) ||
                            n.setAttribute(`layoutsubtree`, `true`),
                        t.parentNode !== n)
                    ) {
                        (n.appendChild(t),
                            b.add(o),
                            (n.onpaint = (e) => {
                                let t = e.changedElements;
                                for (let e of b)
                                    t.includes(e.image) && (e.needsUpdate = !0);
                            }),
                            n.requestPaint());
                        return;
                    }
                    let r = e.RGBA,
                        i = e.RGBA,
                        a = e.UNSIGNED_BYTE;
                    (e.texElementImage2D(e.TEXTURE_2D, 0, r, i, a, t),
                        e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_MIN_FILTER,
                            e.LINEAR,
                        ),
                        e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_WRAP_S,
                            e.CLAMP_TO_EDGE,
                        ),
                        e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_WRAP_T,
                            e.CLAMP_TO_EDGE,
                        ));
                }
            } else if (h.length > 0) {
                if (g && _) {
                    let t = ke(h[0]);
                    n.texStorage2D(e.TEXTURE_2D, y, p, t.width, t.height);
                }
                for (let t = 0, i = h.length; t < i; t++)
                    ((m = h[t]),
                        g
                            ? v &&
                              n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, r, f, m)
                            : n.texImage2D(e.TEXTURE_2D, t, p, r, f, m));
                o.generateMipmaps = !1;
            } else if (g) {
                if (_) {
                    let r = ke(t);
                    n.texStorage2D(e.TEXTURE_2D, y, p, r.width, r.height);
                }
                v && n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r, f, t);
            } else n.texImage2D(e.TEXTURE_2D, 0, p, r, f, t);
            (E(o) && D(c),
                (d.__version = u.version),
                o.onUpdate && o.onUpdate(o));
        }
        t.__version = o.version;
    }
    function _e(t, o, s) {
        if (o.image.length !== 6) return;
        let c = pe(t, o),
            l = o.source;
        n.bindTexture(e.TEXTURE_CUBE_MAP, t.__webglTexture, e.TEXTURE0 + s);
        let u = r.get(l);
        if (l.version !== u.__version || c === !0) {
            n.activeTexture(e.TEXTURE0 + s);
            let t = X.getPrimaries(X.workingColorSpace),
                r = o.colorSpace === `` ? null : X.getPrimaries(o.colorSpace),
                d =
                    o.colorSpace === `` || t === r
                        ? e.NONE
                        : e.BROWSER_DEFAULT_WEBGL;
            (n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, o.flipY),
                n.pixelStorei(
                    e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                    o.premultiplyAlpha,
                ),
                n.pixelStorei(e.UNPACK_ALIGNMENT, o.unpackAlignment),
                n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, d));
            let f = o.isCompressedTexture || o.image[0].isCompressedTexture,
                p = o.image[0] && o.image[0].isDataTexture,
                m = [];
            for (let e = 0; e < 6; e++)
                (!f && !p
                    ? (m[e] = T(o.image[e], !0, i.maxCubemapSize))
                    : (m[e] = p ? o.image[e].image : o.image[e]),
                    (m[e] = V(o, m[e])));
            let h = m[0],
                g = a.convert(o.format, o.colorSpace),
                _ = a.convert(o.type),
                v = k(o.internalFormat, g, _, o.normalized, o.colorSpace),
                y = o.isVideoTexture !== !0,
                b = u.__version === void 0 || c === !0,
                x = l.dataReady,
                S = j(o, h);
            R(e.TEXTURE_CUBE_MAP, o);
            let C;
            if (f) {
                y &&
                    b &&
                    n.texStorage2D(e.TEXTURE_CUBE_MAP, S, v, h.width, h.height);
                for (let t = 0; t < 6; t++) {
                    C = m[t].mipmaps;
                    for (let r = 0; r < C.length; r++) {
                        let i = C[r];
                        o.format === 1023
                            ? y
                                ? x &&
                                  n.texSubImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r,
                                      0,
                                      0,
                                      i.width,
                                      i.height,
                                      g,
                                      _,
                                      i.data,
                                  )
                                : n.texImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r,
                                      v,
                                      i.width,
                                      i.height,
                                      0,
                                      g,
                                      _,
                                      i.data,
                                  )
                            : g === null
                              ? W(
                                    `WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`,
                                )
                              : y
                                ? x &&
                                  n.compressedTexSubImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r,
                                      0,
                                      0,
                                      i.width,
                                      i.height,
                                      g,
                                      i.data,
                                  )
                                : n.compressedTexImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r,
                                      v,
                                      i.width,
                                      i.height,
                                      0,
                                      i.data,
                                  );
                    }
                }
            } else {
                if (((C = o.mipmaps), y && b)) {
                    C.length > 0 && S++;
                    let t = ke(m[0]);
                    n.texStorage2D(e.TEXTURE_CUBE_MAP, S, v, t.width, t.height);
                }
                for (let t = 0; t < 6; t++)
                    if (p) {
                        y
                            ? x &&
                              n.texSubImage2D(
                                  e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                  0,
                                  0,
                                  0,
                                  m[t].width,
                                  m[t].height,
                                  g,
                                  _,
                                  m[t].data,
                              )
                            : n.texImage2D(
                                  e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                  0,
                                  v,
                                  m[t].width,
                                  m[t].height,
                                  0,
                                  g,
                                  _,
                                  m[t].data,
                              );
                        for (let r = 0; r < C.length; r++) {
                            let i = C[r].image[t].image;
                            y
                                ? x &&
                                  n.texSubImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r + 1,
                                      0,
                                      0,
                                      i.width,
                                      i.height,
                                      g,
                                      _,
                                      i.data,
                                  )
                                : n.texImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r + 1,
                                      v,
                                      i.width,
                                      i.height,
                                      0,
                                      g,
                                      _,
                                      i.data,
                                  );
                        }
                    } else {
                        y
                            ? x &&
                              n.texSubImage2D(
                                  e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                  0,
                                  0,
                                  0,
                                  g,
                                  _,
                                  m[t],
                              )
                            : n.texImage2D(
                                  e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                  0,
                                  v,
                                  g,
                                  _,
                                  m[t],
                              );
                        for (let r = 0; r < C.length; r++) {
                            let i = C[r];
                            y
                                ? x &&
                                  n.texSubImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r + 1,
                                      0,
                                      0,
                                      g,
                                      _,
                                      i.image[t],
                                  )
                                : n.texImage2D(
                                      e.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                                      r + 1,
                                      v,
                                      g,
                                      _,
                                      i.image[t],
                                  );
                        }
                    }
            }
            (E(o) && D(e.TEXTURE_CUBE_MAP),
                (u.__version = l.version),
                o.onUpdate && o.onUpdate(o));
        }
        t.__version = o.version;
    }
    function ve(t, i, o, c, l, u) {
        let d = a.convert(o.format, o.colorSpace),
            f = a.convert(o.type),
            p = k(o.internalFormat, d, f, o.normalized, o.colorSpace),
            m = r.get(i),
            h = r.get(o);
        if (((h.__renderTarget = i), !m.__hasExternalTextures)) {
            let t = Math.max(1, i.width >> u),
                r = Math.max(1, i.height >> u);
            l === e.TEXTURE_3D || l === e.TEXTURE_2D_ARRAY
                ? n.texImage3D(l, u, p, t, r, i.depth, 0, d, f, null)
                : n.texImage2D(l, u, p, t, r, 0, d, f, null);
        }
        (n.bindFramebuffer(e.FRAMEBUFFER, t),
            B(i)
                ? s.framebufferTexture2DMultisampleEXT(
                      e.FRAMEBUFFER,
                      c,
                      l,
                      h.__webglTexture,
                      0,
                      De(i),
                  )
                : (l === e.TEXTURE_2D ||
                      (l >= e.TEXTURE_CUBE_MAP_POSITIVE_X &&
                          l <= e.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
                  e.framebufferTexture2D(
                      e.FRAMEBUFFER,
                      c,
                      l,
                      h.__webglTexture,
                      u,
                  ),
            n.bindFramebuffer(e.FRAMEBUFFER, null));
    }
    function ye(t, n, r) {
        if ((e.bindRenderbuffer(e.RENDERBUFFER, t), n.depthBuffer)) {
            let i = n.depthTexture,
                a = i && i.isDepthTexture ? i.type : null,
                o = A(n.stencilBuffer, a),
                c = n.stencilBuffer
                    ? e.DEPTH_STENCIL_ATTACHMENT
                    : e.DEPTH_ATTACHMENT;
            (B(n)
                ? s.renderbufferStorageMultisampleEXT(
                      e.RENDERBUFFER,
                      De(n),
                      o,
                      n.width,
                      n.height,
                  )
                : r
                  ? e.renderbufferStorageMultisample(
                        e.RENDERBUFFER,
                        De(n),
                        o,
                        n.width,
                        n.height,
                    )
                  : e.renderbufferStorage(e.RENDERBUFFER, o, n.width, n.height),
                e.framebufferRenderbuffer(e.FRAMEBUFFER, c, e.RENDERBUFFER, t));
        } else {
            let t = n.textures;
            for (let i = 0; i < t.length; i++) {
                let o = t[i],
                    c = a.convert(o.format, o.colorSpace),
                    l = a.convert(o.type),
                    u = k(o.internalFormat, c, l, o.normalized, o.colorSpace);
                B(n)
                    ? s.renderbufferStorageMultisampleEXT(
                          e.RENDERBUFFER,
                          De(n),
                          u,
                          n.width,
                          n.height,
                      )
                    : r
                      ? e.renderbufferStorageMultisample(
                            e.RENDERBUFFER,
                            De(n),
                            u,
                            n.width,
                            n.height,
                        )
                      : e.renderbufferStorage(
                            e.RENDERBUFFER,
                            u,
                            n.width,
                            n.height,
                        );
            }
        }
        e.bindRenderbuffer(e.RENDERBUFFER, null);
    }
    function be(t, i, o) {
        let c = i.isWebGLCubeRenderTarget === !0;
        if (
            (n.bindFramebuffer(e.FRAMEBUFFER, t),
            !(i.depthTexture && i.depthTexture.isDepthTexture))
        )
            throw Error(
                `renderTarget.depthTexture must be an instance of THREE.DepthTexture`,
            );
        let l = r.get(i.depthTexture);
        if (
            ((l.__renderTarget = i),
            (!l.__webglTexture ||
                i.depthTexture.image.width !== i.width ||
                i.depthTexture.image.height !== i.height) &&
                ((i.depthTexture.image.width = i.width),
                (i.depthTexture.image.height = i.height),
                (i.depthTexture.needsUpdate = !0)),
            c)
        ) {
            if (
                (l.__webglInit === void 0 &&
                    ((l.__webglInit = !0),
                    i.depthTexture.addEventListener(`dispose`, M)),
                l.__webglTexture === void 0)
            ) {
                ((l.__webglTexture = e.createTexture()),
                    n.bindTexture(e.TEXTURE_CUBE_MAP, l.__webglTexture),
                    R(e.TEXTURE_CUBE_MAP, i.depthTexture));
                let t = a.convert(i.depthTexture.format),
                    r = a.convert(i.depthTexture.type),
                    o;
                i.depthTexture.format === 1026
                    ? (o = e.DEPTH_COMPONENT24)
                    : i.depthTexture.format === 1027 &&
                      (o = e.DEPTH24_STENCIL8);
                for (let n = 0; n < 6; n++)
                    e.texImage2D(
                        e.TEXTURE_CUBE_MAP_POSITIVE_X + n,
                        0,
                        o,
                        i.width,
                        i.height,
                        0,
                        t,
                        r,
                        null,
                    );
            }
        } else L(i.depthTexture, 0);
        let u = l.__webglTexture,
            d = De(i),
            f = c ? e.TEXTURE_CUBE_MAP_POSITIVE_X + o : e.TEXTURE_2D,
            p =
                i.depthTexture.format === 1027
                    ? e.DEPTH_STENCIL_ATTACHMENT
                    : e.DEPTH_ATTACHMENT;
        if (i.depthTexture.format === 1026)
            B(i)
                ? s.framebufferTexture2DMultisampleEXT(
                      e.FRAMEBUFFER,
                      p,
                      f,
                      u,
                      0,
                      d,
                  )
                : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
        else if (i.depthTexture.format === 1027)
            B(i)
                ? s.framebufferTexture2DMultisampleEXT(
                      e.FRAMEBUFFER,
                      p,
                      f,
                      u,
                      0,
                      d,
                  )
                : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
        else throw Error(`Unknown depthTexture format`);
    }
    function xe(t) {
        let i = r.get(t),
            a = t.isWebGLCubeRenderTarget === !0;
        if (i.__boundDepthTexture !== t.depthTexture) {
            let e = t.depthTexture;
            if ((i.__depthDisposeCallback && i.__depthDisposeCallback(), e)) {
                let t = () => {
                    (delete i.__boundDepthTexture,
                        delete i.__depthDisposeCallback,
                        e.removeEventListener(`dispose`, t));
                };
                (e.addEventListener(`dispose`, t),
                    (i.__depthDisposeCallback = t));
            }
            i.__boundDepthTexture = e;
        }
        if (t.depthTexture && !i.__autoAllocateDepthBuffer)
            if (a)
                for (let e = 0; e < 6; e++) be(i.__webglFramebuffer[e], t, e);
            else {
                let e = t.texture.mipmaps;
                e && e.length > 0
                    ? be(i.__webglFramebuffer[0], t, 0)
                    : be(i.__webglFramebuffer, t, 0);
            }
        else if (a) {
            i.__webglDepthbuffer = [];
            for (let r = 0; r < 6; r++)
                if (
                    (n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[r]),
                    i.__webglDepthbuffer[r] === void 0)
                )
                    ((i.__webglDepthbuffer[r] = e.createRenderbuffer()),
                        ye(i.__webglDepthbuffer[r], t, !1));
                else {
                    let n = t.stencilBuffer
                            ? e.DEPTH_STENCIL_ATTACHMENT
                            : e.DEPTH_ATTACHMENT,
                        a = i.__webglDepthbuffer[r];
                    (e.bindRenderbuffer(e.RENDERBUFFER, a),
                        e.framebufferRenderbuffer(
                            e.FRAMEBUFFER,
                            n,
                            e.RENDERBUFFER,
                            a,
                        ));
                }
        } else {
            let r = t.texture.mipmaps;
            if (
                (r && r.length > 0
                    ? n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[0])
                    : n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer),
                i.__webglDepthbuffer === void 0)
            )
                ((i.__webglDepthbuffer = e.createRenderbuffer()),
                    ye(i.__webglDepthbuffer, t, !1));
            else {
                let n = t.stencilBuffer
                        ? e.DEPTH_STENCIL_ATTACHMENT
                        : e.DEPTH_ATTACHMENT,
                    r = i.__webglDepthbuffer;
                (e.bindRenderbuffer(e.RENDERBUFFER, r),
                    e.framebufferRenderbuffer(
                        e.FRAMEBUFFER,
                        n,
                        e.RENDERBUFFER,
                        r,
                    ));
            }
        }
        n.bindFramebuffer(e.FRAMEBUFFER, null);
    }
    function Se(t, n, i) {
        let a = r.get(t);
        (n !== void 0 &&
            ve(
                a.__webglFramebuffer,
                t,
                t.texture,
                e.COLOR_ATTACHMENT0,
                e.TEXTURE_2D,
                0,
            ),
            i !== void 0 && xe(t));
    }
    function Ce(t) {
        let i = t.texture,
            s = r.get(t),
            c = r.get(i);
        t.addEventListener(`dispose`, N);
        let l = t.textures,
            u = t.isWebGLCubeRenderTarget === !0,
            d = l.length > 1;
        if (
            (d ||
                (c.__webglTexture === void 0 &&
                    (c.__webglTexture = e.createTexture()),
                (c.__version = i.version),
                o.memory.textures++),
            u)
        ) {
            s.__webglFramebuffer = [];
            for (let t = 0; t < 6; t++)
                if (i.mipmaps && i.mipmaps.length > 0) {
                    s.__webglFramebuffer[t] = [];
                    for (let n = 0; n < i.mipmaps.length; n++)
                        s.__webglFramebuffer[t][n] = e.createFramebuffer();
                } else s.__webglFramebuffer[t] = e.createFramebuffer();
        } else {
            if (i.mipmaps && i.mipmaps.length > 0) {
                s.__webglFramebuffer = [];
                for (let t = 0; t < i.mipmaps.length; t++)
                    s.__webglFramebuffer[t] = e.createFramebuffer();
            } else s.__webglFramebuffer = e.createFramebuffer();
            if (d)
                for (let t = 0, n = l.length; t < n; t++) {
                    let n = r.get(l[t]);
                    n.__webglTexture === void 0 &&
                        ((n.__webglTexture = e.createTexture()),
                        o.memory.textures++);
                }
            if (t.samples > 0 && B(t) === !1) {
                ((s.__webglMultisampledFramebuffer = e.createFramebuffer()),
                    (s.__webglColorRenderbuffer = []),
                    n.bindFramebuffer(
                        e.FRAMEBUFFER,
                        s.__webglMultisampledFramebuffer,
                    ));
                for (let n = 0; n < l.length; n++) {
                    let r = l[n];
                    ((s.__webglColorRenderbuffer[n] = e.createRenderbuffer()),
                        e.bindRenderbuffer(
                            e.RENDERBUFFER,
                            s.__webglColorRenderbuffer[n],
                        ));
                    let i = a.convert(r.format, r.colorSpace),
                        o = a.convert(r.type),
                        c = k(
                            r.internalFormat,
                            i,
                            o,
                            r.normalized,
                            r.colorSpace,
                            t.isXRRenderTarget === !0,
                        ),
                        u = De(t);
                    (e.renderbufferStorageMultisample(
                        e.RENDERBUFFER,
                        u,
                        c,
                        t.width,
                        t.height,
                    ),
                        e.framebufferRenderbuffer(
                            e.FRAMEBUFFER,
                            e.COLOR_ATTACHMENT0 + n,
                            e.RENDERBUFFER,
                            s.__webglColorRenderbuffer[n],
                        ));
                }
                (e.bindRenderbuffer(e.RENDERBUFFER, null),
                    t.depthBuffer &&
                        ((s.__webglDepthRenderbuffer = e.createRenderbuffer()),
                        ye(s.__webglDepthRenderbuffer, t, !0)),
                    n.bindFramebuffer(e.FRAMEBUFFER, null));
            }
        }
        if (u) {
            (n.bindTexture(e.TEXTURE_CUBE_MAP, c.__webglTexture),
                R(e.TEXTURE_CUBE_MAP, i));
            for (let n = 0; n < 6; n++)
                if (i.mipmaps && i.mipmaps.length > 0)
                    for (let r = 0; r < i.mipmaps.length; r++)
                        ve(
                            s.__webglFramebuffer[n][r],
                            t,
                            i,
                            e.COLOR_ATTACHMENT0,
                            e.TEXTURE_CUBE_MAP_POSITIVE_X + n,
                            r,
                        );
                else
                    ve(
                        s.__webglFramebuffer[n],
                        t,
                        i,
                        e.COLOR_ATTACHMENT0,
                        e.TEXTURE_CUBE_MAP_POSITIVE_X + n,
                        0,
                    );
            (E(i) && D(e.TEXTURE_CUBE_MAP), n.unbindTexture());
        } else if (d) {
            for (let i = 0, a = l.length; i < a; i++) {
                let a = l[i],
                    o = r.get(a),
                    c = e.TEXTURE_2D;
                ((t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) &&
                    (c = t.isWebGL3DRenderTarget
                        ? e.TEXTURE_3D
                        : e.TEXTURE_2D_ARRAY),
                    n.bindTexture(c, o.__webglTexture),
                    R(c, a),
                    ve(
                        s.__webglFramebuffer,
                        t,
                        a,
                        e.COLOR_ATTACHMENT0 + i,
                        c,
                        0,
                    ),
                    E(a) && D(c));
            }
            n.unbindTexture();
        } else {
            let r = e.TEXTURE_2D;
            if (
                ((t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) &&
                    (r = t.isWebGL3DRenderTarget
                        ? e.TEXTURE_3D
                        : e.TEXTURE_2D_ARRAY),
                n.bindTexture(r, c.__webglTexture),
                R(r, i),
                i.mipmaps && i.mipmaps.length > 0)
            )
                for (let n = 0; n < i.mipmaps.length; n++)
                    ve(
                        s.__webglFramebuffer[n],
                        t,
                        i,
                        e.COLOR_ATTACHMENT0,
                        r,
                        n,
                    );
            else ve(s.__webglFramebuffer, t, i, e.COLOR_ATTACHMENT0, r, 0);
            (E(i) && D(r), n.unbindTexture());
        }
        t.depthBuffer && xe(t);
    }
    function we(e) {
        let t = e.textures;
        for (let i = 0, a = t.length; i < a; i++) {
            let a = t[i];
            if (E(a)) {
                let t = O(e),
                    i = r.get(a).__webglTexture;
                (n.bindTexture(t, i), D(t), n.unbindTexture());
            }
        }
    }
    let Te = [],
        Ee = [];
    function z(t) {
        if (t.samples > 0) {
            if (B(t) === !1) {
                let i = t.textures,
                    a = t.width,
                    o = t.height,
                    s = e.COLOR_BUFFER_BIT,
                    c = t.stencilBuffer
                        ? e.DEPTH_STENCIL_ATTACHMENT
                        : e.DEPTH_ATTACHMENT,
                    l = r.get(t),
                    u = i.length > 1;
                if (u)
                    for (let t = 0; t < i.length; t++)
                        (n.bindFramebuffer(
                            e.FRAMEBUFFER,
                            l.__webglMultisampledFramebuffer,
                        ),
                            e.framebufferRenderbuffer(
                                e.FRAMEBUFFER,
                                e.COLOR_ATTACHMENT0 + t,
                                e.RENDERBUFFER,
                                null,
                            ),
                            n.bindFramebuffer(
                                e.FRAMEBUFFER,
                                l.__webglFramebuffer,
                            ),
                            e.framebufferTexture2D(
                                e.DRAW_FRAMEBUFFER,
                                e.COLOR_ATTACHMENT0 + t,
                                e.TEXTURE_2D,
                                null,
                                0,
                            ));
                n.bindFramebuffer(
                    e.READ_FRAMEBUFFER,
                    l.__webglMultisampledFramebuffer,
                );
                let d = t.texture.mipmaps;
                d && d.length > 0
                    ? n.bindFramebuffer(
                          e.DRAW_FRAMEBUFFER,
                          l.__webglFramebuffer[0],
                      )
                    : n.bindFramebuffer(
                          e.DRAW_FRAMEBUFFER,
                          l.__webglFramebuffer,
                      );
                for (let n = 0; n < i.length; n++) {
                    if (
                        (t.resolveDepthBuffer &&
                            (t.depthBuffer && (s |= e.DEPTH_BUFFER_BIT),
                            t.stencilBuffer &&
                                t.resolveStencilBuffer &&
                                (s |= e.STENCIL_BUFFER_BIT)),
                        u)
                    ) {
                        e.framebufferRenderbuffer(
                            e.READ_FRAMEBUFFER,
                            e.COLOR_ATTACHMENT0,
                            e.RENDERBUFFER,
                            l.__webglColorRenderbuffer[n],
                        );
                        let t = r.get(i[n]).__webglTexture;
                        e.framebufferTexture2D(
                            e.DRAW_FRAMEBUFFER,
                            e.COLOR_ATTACHMENT0,
                            e.TEXTURE_2D,
                            t,
                            0,
                        );
                    }
                    (e.blitFramebuffer(0, 0, a, o, 0, 0, a, o, s, e.NEAREST),
                        _ === !0 &&
                            ((Te.length = 0),
                            (Ee.length = 0),
                            Te.push(e.COLOR_ATTACHMENT0 + n),
                            t.depthBuffer &&
                                t.resolveDepthBuffer === !1 &&
                                (Te.push(c),
                                Ee.push(c),
                                e.invalidateFramebuffer(
                                    e.DRAW_FRAMEBUFFER,
                                    Ee,
                                )),
                            e.invalidateFramebuffer(e.READ_FRAMEBUFFER, Te)));
                }
                if (
                    (n.bindFramebuffer(e.READ_FRAMEBUFFER, null),
                    n.bindFramebuffer(e.DRAW_FRAMEBUFFER, null),
                    u)
                )
                    for (let t = 0; t < i.length; t++) {
                        (n.bindFramebuffer(
                            e.FRAMEBUFFER,
                            l.__webglMultisampledFramebuffer,
                        ),
                            e.framebufferRenderbuffer(
                                e.FRAMEBUFFER,
                                e.COLOR_ATTACHMENT0 + t,
                                e.RENDERBUFFER,
                                l.__webglColorRenderbuffer[t],
                            ));
                        let a = r.get(i[t]).__webglTexture;
                        (n.bindFramebuffer(e.FRAMEBUFFER, l.__webglFramebuffer),
                            e.framebufferTexture2D(
                                e.DRAW_FRAMEBUFFER,
                                e.COLOR_ATTACHMENT0 + t,
                                e.TEXTURE_2D,
                                a,
                                0,
                            ));
                    }
                n.bindFramebuffer(
                    e.DRAW_FRAMEBUFFER,
                    l.__webglMultisampledFramebuffer,
                );
            } else if (t.depthBuffer && t.resolveDepthBuffer === !1 && _) {
                let n = t.stencilBuffer
                    ? e.DEPTH_STENCIL_ATTACHMENT
                    : e.DEPTH_ATTACHMENT;
                e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, [n]);
            }
        }
    }
    function De(e) {
        return Math.min(i.maxSamples, e.samples);
    }
    function B(e) {
        let n = r.get(e);
        return (
            e.samples > 0 &&
            t.has(`WEBGL_multisampled_render_to_texture`) === !0 &&
            n.__useRenderToTexture !== !1
        );
    }
    function Oe(e) {
        let t = o.render.frame;
        y.get(e) !== t && (y.set(e, t), e.update());
    }
    function V(e, t) {
        let n = e.colorSpace,
            r = e.format,
            i = e.type;
        return (
            e.isCompressedTexture === !0 ||
                e.isVideoTexture === !0 ||
                (n !== `srgb-linear` &&
                    n !== `` &&
                    (X.getTransfer(n) === `srgb`
                        ? (r !== 1023 || i !== 1009) &&
                          W(
                              `WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`,
                          )
                        : G(
                              `WebGLTextures: Unsupported texture color space:`,
                              n,
                          ))),
            t
        );
    }
    function ke(e) {
        return (
            typeof HTMLImageElement < `u` && e instanceof HTMLImageElement
                ? ((v.width = e.naturalWidth || e.width),
                  (v.height = e.naturalHeight || e.height))
                : typeof VideoFrame < `u` && e instanceof VideoFrame
                  ? ((v.width = e.displayWidth), (v.height = e.displayHeight))
                  : ((v.width = e.width), (v.height = e.height)),
            v
        );
    }
    ((this.allocateTextureUnit = ae),
        (this.resetTextureUnits = re),
        (this.getTextureUnits = ie),
        (this.setTextureUnits = I),
        (this.setTexture2D = L),
        (this.setTexture2DArray = se),
        (this.setTexture3D = ce),
        (this.setTextureCube = le),
        (this.rebindTextures = Se),
        (this.setupRenderTarget = Ce),
        (this.updateRenderTargetMipmap = we),
        (this.updateMultisampleRenderTarget = z),
        (this.setupDepthRenderbuffer = xe),
        (this.setupFrameBufferTexture = ve),
        (this.useMultisampledRTT = B),
        (this.isReversedDepthBuffer = function () {
            return n.buffers.depth.getReversed();
        }));
}
function xc(e, t) {
    function n(n, r = ``) {
        let i,
            a = X.getTransfer(r);
        if (n === 1009) return e.UNSIGNED_BYTE;
        if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
        if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
        if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
        if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
        if (n === 1010) return e.BYTE;
        if (n === 1011) return e.SHORT;
        if (n === 1012) return e.UNSIGNED_SHORT;
        if (n === 1013) return e.INT;
        if (n === 1014) return e.UNSIGNED_INT;
        if (n === 1015) return e.FLOAT;
        if (n === 1016) return e.HALF_FLOAT;
        if (n === 1021) return e.ALPHA;
        if (n === 1022) return e.RGB;
        if (n === 1023) return e.RGBA;
        if (n === 1026) return e.DEPTH_COMPONENT;
        if (n === 1027) return e.DEPTH_STENCIL;
        if (n === 1028) return e.RED;
        if (n === 1029) return e.RED_INTEGER;
        if (n === 1030) return e.RG;
        if (n === 1031) return e.RG_INTEGER;
        if (n === 1033) return e.RGBA_INTEGER;
        if (n === 33776 || n === 33777 || n === 33778 || n === 33779)
            if (a === `srgb`)
                if (
                    ((i = t.get(`WEBGL_compressed_texture_s3tc_srgb`)),
                    i !== null)
                ) {
                    if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
                    if (n === 33777)
                        return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
                    if (n === 33778)
                        return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
                    if (n === 33779)
                        return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
                } else return null;
            else if (
                ((i = t.get(`WEBGL_compressed_texture_s3tc`)), i !== null)
            ) {
                if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
                if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
            } else return null;
        if (n === 35840 || n === 35841 || n === 35842 || n === 35843)
            if (((i = t.get(`WEBGL_compressed_texture_pvrtc`)), i !== null)) {
                if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
            } else return null;
        if (
            n === 36196 ||
            n === 37492 ||
            n === 37496 ||
            n === 37488 ||
            n === 37489 ||
            n === 37490 ||
            n === 37491
        )
            if (((i = t.get(`WEBGL_compressed_texture_etc`)), i !== null)) {
                if (n === 36196 || n === 37492)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ETC2
                        : i.COMPRESSED_RGB8_ETC2;
                if (n === 37496)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
                        : i.COMPRESSED_RGBA8_ETC2_EAC;
                if (n === 37488) return i.COMPRESSED_R11_EAC;
                if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
                if (n === 37490) return i.COMPRESSED_RG11_EAC;
                if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
            } else return null;
        if (
            n === 37808 ||
            n === 37809 ||
            n === 37810 ||
            n === 37811 ||
            n === 37812 ||
            n === 37813 ||
            n === 37814 ||
            n === 37815 ||
            n === 37816 ||
            n === 37817 ||
            n === 37818 ||
            n === 37819 ||
            n === 37820 ||
            n === 37821
        )
            if (((i = t.get(`WEBGL_compressed_texture_astc`)), i !== null)) {
                if (n === 37808)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
                        : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
                if (n === 37809)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
                        : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
                if (n === 37810)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
                        : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
                if (n === 37811)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
                        : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
                if (n === 37812)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
                        : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
                if (n === 37813)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
                        : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
                if (n === 37814)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
                        : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
                if (n === 37815)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
                        : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
                if (n === 37816)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
                        : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
                if (n === 37817)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
                        : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
                if (n === 37818)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
                        : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
                if (n === 37819)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
                        : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
                if (n === 37820)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
                        : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
                if (n === 37821)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
                        : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
            } else return null;
        if (n === 36492 || n === 36494 || n === 36495)
            if (((i = t.get(`EXT_texture_compression_bptc`)), i !== null)) {
                if (n === 36492)
                    return a === `srgb`
                        ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
                        : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
                if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
                if (n === 36495)
                    return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
            } else return null;
        if (n === 36283 || n === 36284 || n === 36285 || n === 36286)
            if (((i = t.get(`EXT_texture_compression_rgtc`)), i !== null)) {
                if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
                if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
                if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
                if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
            } else return null;
        return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
    }
    return { convert: n };
}
var Sc = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
    Cc = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,
    wc = class {
        constructor() {
            ((this.texture = null),
                (this.mesh = null),
                (this.depthNear = 0),
                (this.depthFar = 0));
        }
        init(e, t) {
            if (this.texture === null) {
                let n = new oi(e.texture);
                ((e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) &&
                    ((this.depthNear = e.depthNear),
                    (this.depthFar = e.depthFar)),
                    (this.texture = n));
            }
        }
        getMesh(e) {
            if (this.texture !== null && this.mesh === null) {
                let t = e.cameras[0].viewport,
                    n = new _i({
                        vertexShader: Sc,
                        fragmentShader: Cc,
                        uniforms: {
                            depthColor: { value: this.texture },
                            depthWidth: { value: t.z },
                            depthHeight: { value: t.w },
                        },
                    });
                this.mesh = new Ir(new ci(20, 20), n);
            }
            return this.mesh;
        }
        reset() {
            ((this.texture = null), (this.mesh = null));
        }
        getDepthTexture() {
            return this.texture;
        }
    },
    Tc = class extends at {
        constructor(e, t) {
            super();
            let n = this,
                r = null,
                i = 1,
                a = null,
                o = `local-floor`,
                s = 1,
                c = null,
                l = null,
                u = null,
                d = null,
                f = null,
                p = null,
                m = typeof XRWebGLBinding < `u`,
                h = new wc(),
                g = {},
                v = t.getContextAttributes(),
                y = null,
                b = null,
                x = [],
                C = [],
                w = new q(),
                T = null,
                E = new Yi();
            E.viewport = new jt();
            let O = new Yi();
            O.viewport = new jt();
            let k = [E, O],
                A = new ea(),
                j = null,
                P = null;
            ((this.cameraAutoUpdate = !0),
                (this.enabled = !1),
                (this.isPresenting = !1),
                (this.getController = function (e) {
                    let t = x[e];
                    return (
                        t === void 0 && ((t = new pn()), (x[e] = t)),
                        t.getTargetRaySpace()
                    );
                }),
                (this.getControllerGrip = function (e) {
                    let t = x[e];
                    return (
                        t === void 0 && ((t = new pn()), (x[e] = t)),
                        t.getGripSpace()
                    );
                }),
                (this.getHand = function (e) {
                    let t = x[e];
                    return (
                        t === void 0 && ((t = new pn()), (x[e] = t)),
                        t.getHandSpace()
                    );
                }));
            function F(e) {
                let t = C.indexOf(e.inputSource);
                if (t === -1) return;
                let n = x[t];
                n !== void 0 &&
                    (n.update(e.inputSource, e.frame, c || a),
                    n.dispatchEvent({ type: e.type, data: e.inputSource }));
            }
            function te() {
                (r.removeEventListener(`select`, F),
                    r.removeEventListener(`selectstart`, F),
                    r.removeEventListener(`selectend`, F),
                    r.removeEventListener(`squeeze`, F),
                    r.removeEventListener(`squeezestart`, F),
                    r.removeEventListener(`squeezeend`, F),
                    r.removeEventListener(`end`, te),
                    r.removeEventListener(`inputsourceschange`, ne));
                for (let e = 0; e < x.length; e++) {
                    let t = C[e];
                    t !== null && ((C[e] = null), x[e].disconnect(t));
                }
                ((j = null), (P = null), h.reset());
                for (let e in g) delete g[e];
                (e.setRenderTarget(y),
                    (f = null),
                    (d = null),
                    (u = null),
                    (r = null),
                    (b = null),
                    ce.stop(),
                    (n.isPresenting = !1),
                    e.setPixelRatio(T),
                    e.setSize(w.width, w.height, !1),
                    n.dispatchEvent({ type: `sessionend` }));
            }
            ((this.setFramebufferScaleFactor = function (e) {
                ((i = e),
                    n.isPresenting === !0 &&
                        W(
                            `WebXRManager: Cannot change framebuffer scale while presenting.`,
                        ));
            }),
                (this.setReferenceSpaceType = function (e) {
                    ((o = e),
                        n.isPresenting === !0 &&
                            W(
                                `WebXRManager: Cannot change reference space type while presenting.`,
                            ));
                }),
                (this.getReferenceSpace = function () {
                    return c || a;
                }),
                (this.setReferenceSpace = function (e) {
                    c = e;
                }),
                (this.getBaseLayer = function () {
                    return d === null ? f : d;
                }),
                (this.getBinding = function () {
                    return (
                        u === null && m && (u = new XRWebGLBinding(r, t)),
                        u
                    );
                }),
                (this.getFrame = function () {
                    return p;
                }),
                (this.getSession = function () {
                    return r;
                }),
                (this.setSession = async function (l) {
                    if (((r = l), r !== null)) {
                        if (
                            ((y = e.getRenderTarget()),
                            r.addEventListener(`select`, F),
                            r.addEventListener(`selectstart`, F),
                            r.addEventListener(`selectend`, F),
                            r.addEventListener(`squeeze`, F),
                            r.addEventListener(`squeezestart`, F),
                            r.addEventListener(`squeezeend`, F),
                            r.addEventListener(`end`, te),
                            r.addEventListener(`inputsourceschange`, ne),
                            v.xrCompatible !== !0 &&
                                (await t.makeXRCompatible()),
                            (T = e.getPixelRatio()),
                            e.getSize(w),
                            m &&
                                `createProjectionLayer` in
                                    XRWebGLBinding.prototype)
                        ) {
                            let n = null,
                                a = null,
                                o = null;
                            v.depth &&
                                ((o = v.stencil
                                    ? t.DEPTH24_STENCIL8
                                    : t.DEPTH_COMPONENT24),
                                (n = v.stencil ? ee : N),
                                (a = v.stencil ? D : S));
                            let s = {
                                colorFormat: t.RGBA8,
                                depthFormat: o,
                                scaleFactor: i,
                            };
                            ((u = this.getBinding()),
                                (d = u.createProjectionLayer(s)),
                                r.updateRenderState({ layers: [d] }),
                                e.setPixelRatio(1),
                                e.setSize(d.textureWidth, d.textureHeight, !1),
                                (b = new Nt(d.textureWidth, d.textureHeight, {
                                    format: M,
                                    type: _,
                                    depthTexture: new ii(
                                        d.textureWidth,
                                        d.textureHeight,
                                        a,
                                        void 0,
                                        void 0,
                                        void 0,
                                        void 0,
                                        void 0,
                                        void 0,
                                        n,
                                    ),
                                    stencilBuffer: v.stencil,
                                    colorSpace: e.outputColorSpace,
                                    samples: v.antialias ? 4 : 0,
                                    resolveDepthBuffer:
                                        d.ignoreDepthValues === !1,
                                    resolveStencilBuffer:
                                        d.ignoreDepthValues === !1,
                                })));
                        } else {
                            let n = {
                                antialias: v.antialias,
                                alpha: !0,
                                depth: v.depth,
                                stencil: v.stencil,
                                framebufferScaleFactor: i,
                            };
                            ((f = new XRWebGLLayer(r, t, n)),
                                r.updateRenderState({ baseLayer: f }),
                                e.setPixelRatio(1),
                                e.setSize(
                                    f.framebufferWidth,
                                    f.framebufferHeight,
                                    !1,
                                ),
                                (b = new Nt(
                                    f.framebufferWidth,
                                    f.framebufferHeight,
                                    {
                                        format: M,
                                        type: _,
                                        colorSpace: e.outputColorSpace,
                                        stencilBuffer: v.stencil,
                                        resolveDepthBuffer:
                                            f.ignoreDepthValues === !1,
                                        resolveStencilBuffer:
                                            f.ignoreDepthValues === !1,
                                    },
                                )));
                        }
                        ((b.isXRRenderTarget = !0),
                            this.setFoveation(s),
                            (c = null),
                            (a = await r.requestReferenceSpace(o)),
                            ce.setContext(r),
                            ce.start(),
                            (n.isPresenting = !0),
                            n.dispatchEvent({ type: `sessionstart` }));
                    }
                }),
                (this.getEnvironmentBlendMode = function () {
                    if (r !== null) return r.environmentBlendMode;
                }),
                (this.getDepthTexture = function () {
                    return h.getDepthTexture();
                }));
            function ne(e) {
                for (let t = 0; t < e.removed.length; t++) {
                    let n = e.removed[t],
                        r = C.indexOf(n);
                    r >= 0 && ((C[r] = null), x[r].disconnect(n));
                }
                for (let t = 0; t < e.added.length; t++) {
                    let n = e.added[t],
                        r = C.indexOf(n);
                    if (r === -1) {
                        for (let e = 0; e < x.length; e++)
                            if (e >= C.length) {
                                (C.push(n), (r = e));
                                break;
                            } else if (C[e] === null) {
                                ((C[e] = n), (r = e));
                                break;
                            }
                        if (r === -1) break;
                    }
                    let i = x[r];
                    i && i.connect(n);
                }
            }
            let re = new J(),
                ie = new J();
            function I(e, t, n) {
                (re.setFromMatrixPosition(t.matrixWorld),
                    ie.setFromMatrixPosition(n.matrixWorld));
                let r = re.distanceTo(ie),
                    i = t.projectionMatrix.elements,
                    a = n.projectionMatrix.elements,
                    o = i[14] / (i[10] - 1),
                    s = i[14] / (i[10] + 1),
                    c = (i[9] + 1) / i[5],
                    l = (i[9] - 1) / i[5],
                    u = (i[8] - 1) / i[0],
                    d = (a[8] + 1) / a[0],
                    f = o * u,
                    p = o * d,
                    m = r / (-u + d),
                    h = m * -u;
                if (
                    (t.matrixWorld.decompose(e.position, e.quaternion, e.scale),
                    e.translateX(h),
                    e.translateZ(m),
                    e.matrixWorld.compose(e.position, e.quaternion, e.scale),
                    e.matrixWorldInverse.copy(e.matrixWorld).invert(),
                    i[10] === -1)
                )
                    (e.projectionMatrix.copy(t.projectionMatrix),
                        e.projectionMatrixInverse.copy(
                            t.projectionMatrixInverse,
                        ));
                else {
                    let t = o + m,
                        n = s + m,
                        i = f - h,
                        a = p + (r - h),
                        u = ((c * s) / n) * t,
                        d = ((l * s) / n) * t;
                    (e.projectionMatrix.makePerspective(i, a, u, d, t, n),
                        e.projectionMatrixInverse
                            .copy(e.projectionMatrix)
                            .invert());
                }
            }
            function ae(e, t) {
                (t === null
                    ? e.matrixWorld.copy(e.matrix)
                    : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix),
                    e.matrixWorldInverse.copy(e.matrixWorld).invert());
            }
            this.updateCamera = function (e) {
                if (r === null) return;
                let t = e.near,
                    n = e.far;
                (h.texture !== null &&
                    (h.depthNear > 0 && (t = h.depthNear),
                    h.depthFar > 0 && (n = h.depthFar)),
                    (A.near = O.near = E.near = t),
                    (A.far = O.far = E.far = n),
                    (j !== A.near || P !== A.far) &&
                        (r.updateRenderState({
                            depthNear: A.near,
                            depthFar: A.far,
                        }),
                        (j = A.near),
                        (P = A.far)),
                    (A.layers.mask = e.layers.mask | 6),
                    (E.layers.mask = A.layers.mask & -5),
                    (O.layers.mask = A.layers.mask & -3));
                let i = e.parent,
                    a = A.cameras;
                ae(A, i);
                for (let e = 0; e < a.length; e++) ae(a[e], i);
                (a.length === 2
                    ? I(A, E, O)
                    : A.projectionMatrix.copy(E.projectionMatrix),
                    oe(e, A, i));
            };
            function oe(e, t, n) {
                (n === null
                    ? e.matrix.copy(t.matrixWorld)
                    : (e.matrix.copy(n.matrixWorld),
                      e.matrix.invert(),
                      e.matrix.multiply(t.matrixWorld)),
                    e.matrix.decompose(e.position, e.quaternion, e.scale),
                    e.updateMatrixWorld(!0),
                    e.projectionMatrix.copy(t.projectionMatrix),
                    e.projectionMatrixInverse.copy(t.projectionMatrixInverse),
                    e.isPerspectiveCamera &&
                        ((e.fov =
                            ct *
                            2 *
                            Math.atan(1 / e.projectionMatrix.elements[5])),
                        (e.zoom = 1)));
            }
            ((this.getCamera = function () {
                return A;
            }),
                (this.getFoveation = function () {
                    if (!(d === null && f === null)) return s;
                }),
                (this.setFoveation = function (e) {
                    ((s = e),
                        d !== null && (d.fixedFoveation = e),
                        f !== null &&
                            f.fixedFoveation !== void 0 &&
                            (f.fixedFoveation = e));
                }),
                (this.hasDepthSensing = function () {
                    return h.texture !== null;
                }),
                (this.getDepthSensingMesh = function () {
                    return h.getMesh(A);
                }),
                (this.getCameraTexture = function (e) {
                    return g[e];
                }));
            let L = null;
            function se(t, i) {
                if (((l = i.getViewerPose(c || a)), (p = i), l !== null)) {
                    let t = l.views;
                    f !== null &&
                        (e.setRenderTargetFramebuffer(b, f.framebuffer),
                        e.setRenderTarget(b));
                    let i = !1;
                    t.length !== A.cameras.length &&
                        ((A.cameras.length = 0), (i = !0));
                    for (let n = 0; n < t.length; n++) {
                        let r = t[n],
                            a = null;
                        if (f !== null) a = f.getViewport(r);
                        else {
                            let t = u.getViewSubImage(d, r);
                            ((a = t.viewport),
                                n === 0 &&
                                    (e.setRenderTargetTextures(
                                        b,
                                        t.colorTexture,
                                        t.depthStencilTexture,
                                    ),
                                    e.setRenderTarget(b)));
                        }
                        let o = k[n];
                        (o === void 0 &&
                            ((o = new Yi()),
                            o.layers.enable(n),
                            (o.viewport = new jt()),
                            (k[n] = o)),
                            o.matrix.fromArray(r.transform.matrix),
                            o.matrix.decompose(
                                o.position,
                                o.quaternion,
                                o.scale,
                            ),
                            o.projectionMatrix.fromArray(r.projectionMatrix),
                            o.projectionMatrixInverse
                                .copy(o.projectionMatrix)
                                .invert(),
                            o.viewport.set(a.x, a.y, a.width, a.height),
                            n === 0 &&
                                (A.matrix.copy(o.matrix),
                                A.matrix.decompose(
                                    A.position,
                                    A.quaternion,
                                    A.scale,
                                )),
                            i === !0 && A.cameras.push(o));
                    }
                    let a = r.enabledFeatures;
                    if (
                        a &&
                        a.includes(`depth-sensing`) &&
                        r.depthUsage == `gpu-optimized` &&
                        m
                    ) {
                        u = n.getBinding();
                        let e = u.getDepthInformation(t[0]);
                        e && e.isValid && e.texture && h.init(e, r.renderState);
                    }
                    if (a && a.includes(`camera-access`) && m) {
                        (e.state.unbindTexture(), (u = n.getBinding()));
                        for (let e = 0; e < t.length; e++) {
                            let n = t[e].camera;
                            if (n) {
                                let e = g[n];
                                e || ((e = new oi()), (g[n] = e));
                                let t = u.getCameraImage(n);
                                e.sourceTexture = t;
                            }
                        }
                    }
                }
                for (let e = 0; e < x.length; e++) {
                    let t = C[e],
                        n = x[e];
                    t !== null && n !== void 0 && n.update(t, i, c || a);
                }
                (L && L(t, i),
                    i.detectedPlanes &&
                        n.dispatchEvent({ type: `planesdetected`, data: i }),
                    (p = null));
            }
            let ce = new _a();
            (ce.setAnimationLoop(se),
                (this.setAnimationLoop = function (e) {
                    L = e;
                }),
                (this.dispose = function () {}));
        }
    },
    Ec = new It(),
    Dc = new Y();
Dc.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function Oc(e, t) {
    function n(e, t) {
        (e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix));
    }
    function r(t, n) {
        (n.color.getRGB(t.fogColor.value, pi(e)),
            n.isFog
                ? ((t.fogNear.value = n.near), (t.fogFar.value = n.far))
                : n.isFogExp2 && (t.fogDensity.value = n.density));
    }
    function i(e, t, n, r, i) {
        t.isNodeMaterial
            ? (t.uniformsNeedUpdate = !1)
            : t.isMeshBasicMaterial
              ? a(e, t)
              : t.isMeshLambertMaterial
                ? (a(e, t),
                  t.envMap && (e.envMapIntensity.value = t.envMapIntensity))
                : t.isMeshToonMaterial
                  ? (a(e, t), d(e, t))
                  : t.isMeshPhongMaterial
                    ? (a(e, t),
                      u(e, t),
                      t.envMap && (e.envMapIntensity.value = t.envMapIntensity))
                    : t.isMeshStandardMaterial
                      ? (a(e, t),
                        f(e, t),
                        t.isMeshPhysicalMaterial && p(e, t, i))
                      : t.isMeshMatcapMaterial
                        ? (a(e, t), m(e, t))
                        : t.isMeshDepthMaterial
                          ? a(e, t)
                          : t.isMeshDistanceMaterial
                            ? (a(e, t), h(e, t))
                            : t.isMeshNormalMaterial
                              ? a(e, t)
                              : t.isLineBasicMaterial
                                ? (o(e, t), t.isLineDashedMaterial && s(e, t))
                                : t.isPointsMaterial
                                  ? c(e, t, n, r)
                                  : t.isSpriteMaterial
                                    ? l(e, t)
                                    : t.isShadowMaterial
                                      ? (e.color.value.copy(t.color),
                                        (e.opacity.value = t.opacity))
                                      : t.isShaderMaterial &&
                                        (t.uniformsNeedUpdate = !1);
    }
    function a(e, r) {
        ((e.opacity.value = r.opacity),
            r.color && e.diffuse.value.copy(r.color),
            r.emissive &&
                e.emissive.value
                    .copy(r.emissive)
                    .multiplyScalar(r.emissiveIntensity),
            r.map && ((e.map.value = r.map), n(r.map, e.mapTransform)),
            r.alphaMap &&
                ((e.alphaMap.value = r.alphaMap),
                n(r.alphaMap, e.alphaMapTransform)),
            r.bumpMap &&
                ((e.bumpMap.value = r.bumpMap),
                n(r.bumpMap, e.bumpMapTransform),
                (e.bumpScale.value = r.bumpScale),
                r.side === 1 && (e.bumpScale.value *= -1)),
            r.normalMap &&
                ((e.normalMap.value = r.normalMap),
                n(r.normalMap, e.normalMapTransform),
                e.normalScale.value.copy(r.normalScale),
                r.side === 1 && e.normalScale.value.negate()),
            r.displacementMap &&
                ((e.displacementMap.value = r.displacementMap),
                n(r.displacementMap, e.displacementMapTransform),
                (e.displacementScale.value = r.displacementScale),
                (e.displacementBias.value = r.displacementBias)),
            r.emissiveMap &&
                ((e.emissiveMap.value = r.emissiveMap),
                n(r.emissiveMap, e.emissiveMapTransform)),
            r.specularMap &&
                ((e.specularMap.value = r.specularMap),
                n(r.specularMap, e.specularMapTransform)),
            r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest));
        let i = t.get(r),
            a = i.envMap,
            o = i.envMapRotation;
        (a &&
            ((e.envMap.value = a),
            e.envMapRotation.value
                .setFromMatrix4(Ec.makeRotationFromEuler(o))
                .transpose(),
            a.isCubeTexture &&
                a.isRenderTargetTexture === !1 &&
                e.envMapRotation.value.premultiply(Dc),
            (e.reflectivity.value = r.reflectivity),
            (e.ior.value = r.ior),
            (e.refractionRatio.value = r.refractionRatio)),
            r.lightMap &&
                ((e.lightMap.value = r.lightMap),
                (e.lightMapIntensity.value = r.lightMapIntensity),
                n(r.lightMap, e.lightMapTransform)),
            r.aoMap &&
                ((e.aoMap.value = r.aoMap),
                (e.aoMapIntensity.value = r.aoMapIntensity),
                n(r.aoMap, e.aoMapTransform)));
    }
    function o(e, t) {
        (e.diffuse.value.copy(t.color),
            (e.opacity.value = t.opacity),
            t.map && ((e.map.value = t.map), n(t.map, e.mapTransform)));
    }
    function s(e, t) {
        ((e.dashSize.value = t.dashSize),
            (e.totalSize.value = t.dashSize + t.gapSize),
            (e.scale.value = t.scale));
    }
    function c(e, t, r, i) {
        (e.diffuse.value.copy(t.color),
            (e.opacity.value = t.opacity),
            (e.size.value = t.size * r),
            (e.scale.value = i * 0.5),
            t.map && ((e.map.value = t.map), n(t.map, e.uvTransform)),
            t.alphaMap &&
                ((e.alphaMap.value = t.alphaMap),
                n(t.alphaMap, e.alphaMapTransform)),
            t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest));
    }
    function l(e, t) {
        (e.diffuse.value.copy(t.color),
            (e.opacity.value = t.opacity),
            (e.rotation.value = t.rotation),
            t.map && ((e.map.value = t.map), n(t.map, e.mapTransform)),
            t.alphaMap &&
                ((e.alphaMap.value = t.alphaMap),
                n(t.alphaMap, e.alphaMapTransform)),
            t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest));
    }
    function u(e, t) {
        (e.specular.value.copy(t.specular),
            (e.shininess.value = Math.max(t.shininess, 1e-4)));
    }
    function d(e, t) {
        t.gradientMap && (e.gradientMap.value = t.gradientMap);
    }
    function f(e, t) {
        ((e.metalness.value = t.metalness),
            t.metalnessMap &&
                ((e.metalnessMap.value = t.metalnessMap),
                n(t.metalnessMap, e.metalnessMapTransform)),
            (e.roughness.value = t.roughness),
            t.roughnessMap &&
                ((e.roughnessMap.value = t.roughnessMap),
                n(t.roughnessMap, e.roughnessMapTransform)),
            t.envMap && (e.envMapIntensity.value = t.envMapIntensity));
    }
    function p(e, t, r) {
        ((e.ior.value = t.ior),
            t.sheen > 0 &&
                (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),
                (e.sheenRoughness.value = t.sheenRoughness),
                t.sheenColorMap &&
                    ((e.sheenColorMap.value = t.sheenColorMap),
                    n(t.sheenColorMap, e.sheenColorMapTransform)),
                t.sheenRoughnessMap &&
                    ((e.sheenRoughnessMap.value = t.sheenRoughnessMap),
                    n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))),
            t.clearcoat > 0 &&
                ((e.clearcoat.value = t.clearcoat),
                (e.clearcoatRoughness.value = t.clearcoatRoughness),
                t.clearcoatMap &&
                    ((e.clearcoatMap.value = t.clearcoatMap),
                    n(t.clearcoatMap, e.clearcoatMapTransform)),
                t.clearcoatRoughnessMap &&
                    ((e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap),
                    n(
                        t.clearcoatRoughnessMap,
                        e.clearcoatRoughnessMapTransform,
                    )),
                t.clearcoatNormalMap &&
                    ((e.clearcoatNormalMap.value = t.clearcoatNormalMap),
                    n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform),
                    e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),
                    t.side === 1 && e.clearcoatNormalScale.value.negate())),
            t.dispersion > 0 && (e.dispersion.value = t.dispersion),
            t.iridescence > 0 &&
                ((e.iridescence.value = t.iridescence),
                (e.iridescenceIOR.value = t.iridescenceIOR),
                (e.iridescenceThicknessMinimum.value =
                    t.iridescenceThicknessRange[0]),
                (e.iridescenceThicknessMaximum.value =
                    t.iridescenceThicknessRange[1]),
                t.iridescenceMap &&
                    ((e.iridescenceMap.value = t.iridescenceMap),
                    n(t.iridescenceMap, e.iridescenceMapTransform)),
                t.iridescenceThicknessMap &&
                    ((e.iridescenceThicknessMap.value =
                        t.iridescenceThicknessMap),
                    n(
                        t.iridescenceThicknessMap,
                        e.iridescenceThicknessMapTransform,
                    ))),
            t.transmission > 0 &&
                ((e.transmission.value = t.transmission),
                (e.transmissionSamplerMap.value = r.texture),
                e.transmissionSamplerSize.value.set(r.width, r.height),
                t.transmissionMap &&
                    ((e.transmissionMap.value = t.transmissionMap),
                    n(t.transmissionMap, e.transmissionMapTransform)),
                (e.thickness.value = t.thickness),
                t.thicknessMap &&
                    ((e.thicknessMap.value = t.thicknessMap),
                    n(t.thicknessMap, e.thicknessMapTransform)),
                (e.attenuationDistance.value = t.attenuationDistance),
                e.attenuationColor.value.copy(t.attenuationColor)),
            t.anisotropy > 0 &&
                (e.anisotropyVector.value.set(
                    t.anisotropy * Math.cos(t.anisotropyRotation),
                    t.anisotropy * Math.sin(t.anisotropyRotation),
                ),
                t.anisotropyMap &&
                    ((e.anisotropyMap.value = t.anisotropyMap),
                    n(t.anisotropyMap, e.anisotropyMapTransform))),
            (e.specularIntensity.value = t.specularIntensity),
            e.specularColor.value.copy(t.specularColor),
            t.specularColorMap &&
                ((e.specularColorMap.value = t.specularColorMap),
                n(t.specularColorMap, e.specularColorMapTransform)),
            t.specularIntensityMap &&
                ((e.specularIntensityMap.value = t.specularIntensityMap),
                n(t.specularIntensityMap, e.specularIntensityMapTransform)));
    }
    function m(e, t) {
        t.matcap && (e.matcap.value = t.matcap);
    }
    function h(e, n) {
        let r = t.get(n).light;
        (e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),
            (e.nearDistance.value = r.shadow.camera.near),
            (e.farDistance.value = r.shadow.camera.far));
    }
    return { refreshFogUniforms: r, refreshMaterialUniforms: i };
}
function kc(e, t, n, r) {
    let i = {},
        a = {},
        o = [],
        s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
    function c(e, t) {
        let n = t.program;
        r.uniformBlockBinding(e, n);
    }
    function l(e, n) {
        let o = i[e.id];
        o === void 0 &&
            (m(e), (o = u(e)), (i[e.id] = o), e.addEventListener(`dispose`, g));
        let s = n.program;
        r.updateUBOMapping(e, s);
        let c = t.render.frame;
        a[e.id] !== c && (f(e), (a[e.id] = c));
    }
    function u(t) {
        let n = d();
        t.__bindingPointIndex = n;
        let r = e.createBuffer(),
            i = t.__size,
            a = t.usage;
        return (
            e.bindBuffer(e.UNIFORM_BUFFER, r),
            e.bufferData(e.UNIFORM_BUFFER, i, a),
            e.bindBuffer(e.UNIFORM_BUFFER, null),
            e.bindBufferBase(e.UNIFORM_BUFFER, n, r),
            r
        );
    }
    function d() {
        for (let e = 0; e < s; e++)
            if (o.indexOf(e) === -1) return (o.push(e), e);
        return (
            G(
                `WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`,
            ),
            0
        );
    }
    function f(t) {
        let n = i[t.id],
            r = t.uniforms,
            a = t.__cache;
        e.bindBuffer(e.UNIFORM_BUFFER, n);
        for (let t = 0, n = r.length; t < n; t++) {
            let n = Array.isArray(r[t]) ? r[t] : [r[t]];
            for (let r = 0, i = n.length; r < i; r++) {
                let i = n[r];
                if (p(i, t, r, a) === !0) {
                    let t = i.__offset,
                        n = Array.isArray(i.value) ? i.value : [i.value],
                        r = 0;
                    for (let a = 0; a < n.length; a++) {
                        let o = n[a],
                            s = h(o);
                        typeof o == `number` || typeof o == `boolean`
                            ? ((i.__data[0] = o),
                              e.bufferSubData(
                                  e.UNIFORM_BUFFER,
                                  t + r,
                                  i.__data,
                              ))
                            : o.isMatrix3
                              ? ((i.__data[0] = o.elements[0]),
                                (i.__data[1] = o.elements[1]),
                                (i.__data[2] = o.elements[2]),
                                (i.__data[3] = 0),
                                (i.__data[4] = o.elements[3]),
                                (i.__data[5] = o.elements[4]),
                                (i.__data[6] = o.elements[5]),
                                (i.__data[7] = 0),
                                (i.__data[8] = o.elements[6]),
                                (i.__data[9] = o.elements[7]),
                                (i.__data[10] = o.elements[8]),
                                (i.__data[11] = 0))
                              : ArrayBuffer.isView(o)
                                ? i.__data.set(
                                      new o.constructor(
                                          o.buffer,
                                          o.byteOffset,
                                          i.__data.length,
                                      ),
                                  )
                                : (o.toArray(i.__data, r),
                                  (r +=
                                      s.storage /
                                      Float32Array.BYTES_PER_ELEMENT));
                    }
                    e.bufferSubData(e.UNIFORM_BUFFER, t, i.__data);
                }
            }
        }
        e.bindBuffer(e.UNIFORM_BUFFER, null);
    }
    function p(e, t, n, r) {
        let i = e.value,
            a = t + `_` + n;
        if (r[a] === void 0)
            return (
                typeof i == `number` || typeof i == `boolean`
                    ? (r[a] = i)
                    : ArrayBuffer.isView(i)
                      ? (r[a] = i.slice())
                      : (r[a] = i.clone()),
                !0
            );
        {
            let e = r[a];
            if (typeof i == `number` || typeof i == `boolean`) {
                if (e !== i) return ((r[a] = i), !0);
            } else if (ArrayBuffer.isView(i)) return !0;
            else if (e.equals(i) === !1) return (e.copy(i), !0);
        }
        return !1;
    }
    function m(e) {
        let t = e.uniforms,
            n = 0;
        for (let e = 0, r = t.length; e < r; e++) {
            let r = Array.isArray(t[e]) ? t[e] : [t[e]];
            for (let e = 0, t = r.length; e < t; e++) {
                let t = r[e],
                    i = Array.isArray(t.value) ? t.value : [t.value];
                for (let e = 0, r = i.length; e < r; e++) {
                    let r = i[e],
                        a = h(r),
                        o = n % 16,
                        s = o % a.boundary,
                        c = o + s;
                    ((n += s),
                        c !== 0 && 16 - c < a.storage && (n += 16 - c),
                        (t.__data = new Float32Array(
                            a.storage / Float32Array.BYTES_PER_ELEMENT,
                        )),
                        (t.__offset = n),
                        (n += a.storage));
                }
            }
        }
        let r = n % 16;
        return (r > 0 && (n += 16 - r), (e.__size = n), (e.__cache = {}), this);
    }
    function h(e) {
        let t = { boundary: 0, storage: 0 };
        return (
            typeof e == `number` || typeof e == `boolean`
                ? ((t.boundary = 4), (t.storage = 4))
                : e.isVector2
                  ? ((t.boundary = 8), (t.storage = 8))
                  : e.isVector3 || e.isColor
                    ? ((t.boundary = 16), (t.storage = 12))
                    : e.isVector4
                      ? ((t.boundary = 16), (t.storage = 16))
                      : e.isMatrix3
                        ? ((t.boundary = 48), (t.storage = 48))
                        : e.isMatrix4
                          ? ((t.boundary = 64), (t.storage = 64))
                          : e.isTexture
                            ? W(
                                  `WebGLRenderer: Texture samplers can not be part of an uniforms group.`,
                              )
                            : ArrayBuffer.isView(e)
                              ? ((t.boundary = 16), (t.storage = e.byteLength))
                              : W(
                                    `WebGLRenderer: Unsupported uniform value type.`,
                                    e,
                                ),
            t
        );
    }
    function g(t) {
        let n = t.target;
        n.removeEventListener(`dispose`, g);
        let r = o.indexOf(n.__bindingPointIndex);
        (o.splice(r, 1),
            e.deleteBuffer(i[n.id]),
            delete i[n.id],
            delete a[n.id]);
    }
    function _() {
        for (let t in i) e.deleteBuffer(i[t]);
        ((o = []), (i = {}), (a = {}));
    }
    return { bind: c, update: l, dispose: _ };
}
var Ac = new Uint16Array([
        12469, 15057, 12620, 14925, 13266, 14620, 13807, 14376, 14323, 13990,
        14545, 13625, 14713, 13328, 14840, 12882, 14931, 12528, 14996, 12233,
        15039, 11829, 15066, 11525, 15080, 11295, 15085, 10976, 15082, 10705,
        15073, 10495, 13880, 14564, 13898, 14542, 13977, 14430, 14158, 14124,
        14393, 13732, 14556, 13410, 14702, 12996, 14814, 12596, 14891, 12291,
        14937, 11834, 14957, 11489, 14958, 11194, 14943, 10803, 14921, 10506,
        14893, 10278, 14858, 9960, 14484, 14039, 14487, 14025, 14499, 13941,
        14524, 13740, 14574, 13468, 14654, 13106, 14743, 12678, 14818, 12344,
        14867, 11893, 14889, 11509, 14893, 11180, 14881, 10751, 14852, 10428,
        14812, 10128, 14765, 9754, 14712, 9466, 14764, 13480, 14764, 13475,
        14766, 13440, 14766, 13347, 14769, 13070, 14786, 12713, 14816, 12387,
        14844, 11957, 14860, 11549, 14868, 11215, 14855, 10751, 14825, 10403,
        14782, 10044, 14729, 9651, 14666, 9352, 14599, 9029, 14967, 12835,
        14966, 12831, 14963, 12804, 14954, 12723, 14936, 12564, 14917, 12347,
        14900, 11958, 14886, 11569, 14878, 11247, 14859, 10765, 14828, 10401,
        14784, 10011, 14727, 9600, 14660, 9289, 14586, 8893, 14508, 8533, 15111,
        12234, 15110, 12234, 15104, 12216, 15092, 12156, 15067, 12010, 15028,
        11776, 14981, 11500, 14942, 11205, 14902, 10752, 14861, 10393, 14812,
        9991, 14752, 9570, 14682, 9252, 14603, 8808, 14519, 8445, 14431, 8145,
        15209, 11449, 15208, 11451, 15202, 11451, 15190, 11438, 15163, 11384,
        15117, 11274, 15055, 10979, 14994, 10648, 14932, 10343, 14871, 9936,
        14803, 9532, 14729, 9218, 14645, 8742, 14556, 8381, 14461, 8020, 14365,
        7603, 15273, 10603, 15272, 10607, 15267, 10619, 15256, 10631, 15231,
        10614, 15182, 10535, 15118, 10389, 15042, 10167, 14963, 9787, 14883,
        9447, 14800, 9115, 14710, 8665, 14615, 8318, 14514, 7911, 14411, 7507,
        14279, 7198, 15314, 9675, 15313, 9683, 15309, 9712, 15298, 9759, 15277,
        9797, 15229, 9773, 15166, 9668, 15084, 9487, 14995, 9274, 14898, 8910,
        14800, 8539, 14697, 8234, 14590, 7790, 14479, 7409, 14367, 7067, 14178,
        6621, 15337, 8619, 15337, 8631, 15333, 8677, 15325, 8769, 15305, 8871,
        15264, 8940, 15202, 8909, 15119, 8775, 15022, 8565, 14916, 8328, 14804,
        8009, 14688, 7614, 14569, 7287, 14448, 6888, 14321, 6483, 14088, 6171,
        15350, 7402, 15350, 7419, 15347, 7480, 15340, 7613, 15322, 7804, 15287,
        7973, 15229, 8057, 15148, 8012, 15046, 7846, 14933, 7611, 14810, 7357,
        14682, 7069, 14552, 6656, 14421, 6316, 14251, 5948, 14007, 5528, 15356,
        5942, 15356, 5977, 15353, 6119, 15348, 6294, 15332, 6551, 15302, 6824,
        15249, 7044, 15171, 7122, 15070, 7050, 14949, 6861, 14818, 6611, 14679,
        6349, 14538, 6067, 14398, 5651, 14189, 5311, 13935, 4958, 15359, 4123,
        15359, 4153, 15356, 4296, 15353, 4646, 15338, 5160, 15311, 5508, 15263,
        5829, 15188, 6042, 15088, 6094, 14966, 6001, 14826, 5796, 14678, 5543,
        14527, 5287, 14377, 4985, 14133, 4586, 13869, 4257, 15360, 1563, 15360,
        1642, 15358, 2076, 15354, 2636, 15341, 3350, 15317, 4019, 15273, 4429,
        15203, 4732, 15105, 4911, 14981, 4932, 14836, 4818, 14679, 4621, 14517,
        4386, 14359, 4156, 14083, 3795, 13808, 3437, 15360, 122, 15360, 137,
        15358, 285, 15355, 636, 15344, 1274, 15322, 2177, 15281, 2765, 15215,
        3223, 15120, 3451, 14995, 3569, 14846, 3567, 14681, 3466, 14511, 3305,
        14344, 3121, 14037, 2800, 13753, 2467, 15360, 0, 15360, 1, 15359, 21,
        15355, 89, 15346, 253, 15325, 479, 15287, 796, 15225, 1148, 15133, 1492,
        15008, 1749, 14856, 1882, 14685, 1886, 14506, 1783, 14324, 1608, 13996,
        1398, 13702, 1183,
    ]),
    jc = null;
function Mc() {
    return (
        jc === null &&
            ((jc = new zr(Ac, 16, 16, te, w)),
            (jc.name = `DFG_LUT`),
            (jc.minFilter = m),
            (jc.magFilter = m),
            (jc.wrapS = l),
            (jc.wrapT = l),
            (jc.generateMipmaps = !1),
            (jc.needsUpdate = !0)),
        jc
    );
}
var Nc = class {
        constructor(e = {}) {
            let {
                canvas: t = Ze(),
                context: n = null,
                depth: r = !0,
                stencil: i = !1,
                alpha: a = !1,
                antialias: o = !1,
                premultipliedAlpha: s = !0,
                preserveDrawingBuffer: c = !1,
                powerPreference: l = `default`,
                failIfMajorPerformanceCaveat: u = !1,
                reversedDepthBuffer: d = !1,
                outputBufferType: f = _,
            } = e;
            this.isWebGLRenderer = !0;
            let p;
            if (n !== null) {
                if (
                    typeof WebGLRenderingContext < `u` &&
                    n instanceof WebGLRenderingContext
                )
                    throw Error(
                        `THREE.WebGLRenderer: WebGL 1 is not supported since r163.`,
                    );
                p = n.getContextAttributes().alpha;
            } else p = a;
            let m = f,
                h = new Set([re, ne, F]),
                v = new Set([_, S, b, D, T, E]),
                y = new Uint32Array(4),
                x = new Int32Array(4),
                C = new J(),
                O = null,
                k = null,
                A = [],
                j = [],
                M = null;
            ((this.domElement = t),
                (this.debug = { checkShaderErrors: !0, onShaderError: null }),
                (this.autoClear = !0),
                (this.autoClearColor = !0),
                (this.autoClearDepth = !0),
                (this.autoClearStencil = !0),
                (this.sortObjects = !0),
                (this.clippingPlanes = []),
                (this.localClippingEnabled = !1),
                (this.toneMapping = 0),
                (this.toneMappingExposure = 1),
                (this.transmissionResolutionScale = 1));
            let N = this,
                ee = !1,
                P = null;
            this._outputColorSpace = Be;
            let te = 0,
                ie = 0,
                I = null,
                ae = -1,
                oe = null,
                L = new jt(),
                se = new jt(),
                ce = null,
                le = new Z(0),
                ue = 0,
                de = t.width,
                fe = t.height,
                R = 1,
                pe = null,
                me = null,
                he = new jt(0, 0, de, fe),
                ge = new jt(0, 0, de, fe),
                _e = !1,
                ve = new ni(),
                ye = !1,
                be = !1,
                xe = new It(),
                Se = new J(),
                Ce = new jt(),
                we = {
                    background: null,
                    fog: null,
                    environment: null,
                    overrideMaterial: null,
                    isScene: !0,
                },
                Te = !1;
            function Ee() {
                return I === null ? R : 1;
            }
            let z = n;
            function De(e, n) {
                return t.getContext(e, n);
            }
            try {
                let e = {
                    alpha: !0,
                    depth: r,
                    stencil: i,
                    antialias: o,
                    premultipliedAlpha: s,
                    preserveDrawingBuffer: c,
                    powerPreference: l,
                    failIfMajorPerformanceCaveat: u,
                };
                if (
                    (`setAttribute` in t &&
                        t.setAttribute(`data-engine`, `three.js r184`),
                    t.addEventListener(`webglcontextlost`, Qe, !1),
                    t.addEventListener(`webglcontextrestored`, $e, !1),
                    t.addEventListener(`webglcontextcreationerror`, tt, !1),
                    z === null)
                ) {
                    let t = `webgl2`;
                    if (((z = De(t, e)), z === null))
                        throw De(t)
                            ? Error(
                                  `Error creating WebGL context with your selected attributes.`,
                              )
                            : Error(`Error creating WebGL context.`);
                }
            } catch (e) {
                throw (G(`WebGLRenderer: ` + e.message), e);
            }
            let B,
                Oe,
                V,
                ke,
                H,
                U,
                Ae,
                je,
                Me,
                Ne,
                Pe,
                Fe,
                Ie,
                Le,
                Re,
                ze,
                Ve,
                He,
                Ue,
                We,
                Ge,
                Ke,
                Je;
            function Ye() {
                ((B = new Xa(z)),
                    B.init(),
                    (Ge = new xc(z, B)),
                    (Oe = new Ea(z, B, e, Ge)),
                    (V = new yc(z, B)),
                    Oe.reversedDepthBuffer &&
                        d &&
                        V.buffers.depth.setReversed(!0),
                    (ke = new $a(z)),
                    (H = new $s()),
                    (U = new bc(z, B, V, H, Oe, Ge, ke)),
                    (Ae = new Ya(N)),
                    (je = new va(z)),
                    (Ke = new wa(z, je)),
                    (Me = new Za(z, je, ke, Ke)),
                    (Ne = new to(z, Me, je, Ke, ke)),
                    (He = new eo(z, Oe, U)),
                    (Re = new Da(H)),
                    (Pe = new Qs(N, Ae, B, Oe, Ke, Re)),
                    (Fe = new Oc(N, H)),
                    (Ie = new rc()),
                    (Le = new uc(B)),
                    (Ve = new Ca(N, Ae, V, Ne, p, s)),
                    (ze = new vc(N, Ne, Oe)),
                    (Je = new kc(z, ke, Oe, V)),
                    (Ue = new Ta(z, B, ke)),
                    (We = new Qa(z, B, ke)),
                    (ke.programs = Pe.programs),
                    (N.capabilities = Oe),
                    (N.extensions = B),
                    (N.properties = H),
                    (N.renderLists = Ie),
                    (N.shadowMap = ze),
                    (N.state = V),
                    (N.info = ke));
            }
            (Ye(), m !== 1009 && (M = new ro(m, t.width, t.height, r, i)));
            let Xe = new Tc(N, z);
            ((this.xr = Xe),
                (this.getContext = function () {
                    return z;
                }),
                (this.getContextAttributes = function () {
                    return z.getContextAttributes();
                }),
                (this.forceContextLoss = function () {
                    let e = B.get(`WEBGL_lose_context`);
                    e && e.loseContext();
                }),
                (this.forceContextRestore = function () {
                    let e = B.get(`WEBGL_lose_context`);
                    e && e.restoreContext();
                }),
                (this.getPixelRatio = function () {
                    return R;
                }),
                (this.setPixelRatio = function (e) {
                    e !== void 0 && ((R = e), this.setSize(de, fe, !1));
                }),
                (this.getSize = function (e) {
                    return e.set(de, fe);
                }),
                (this.setSize = function (e, n, r = !0) {
                    if (Xe.isPresenting) {
                        W(
                            `WebGLRenderer: Can't change size while VR device is presenting.`,
                        );
                        return;
                    }
                    ((de = e),
                        (fe = n),
                        (t.width = Math.floor(e * R)),
                        (t.height = Math.floor(n * R)),
                        r === !0 &&
                            ((t.style.width = e + `px`),
                            (t.style.height = n + `px`)),
                        M !== null && M.setSize(t.width, t.height),
                        this.setViewport(0, 0, e, n));
                }),
                (this.getDrawingBufferSize = function (e) {
                    return e.set(de * R, fe * R).floor();
                }),
                (this.setDrawingBufferSize = function (e, n, r) {
                    ((de = e),
                        (fe = n),
                        (R = r),
                        (t.width = Math.floor(e * r)),
                        (t.height = Math.floor(n * r)),
                        this.setViewport(0, 0, e, n));
                }),
                (this.setEffects = function (e) {
                    if (m === 1009) {
                        G(
                            `THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`,
                        );
                        return;
                    }
                    if (e) {
                        for (let t = 0; t < e.length; t++)
                            if (e[t].isOutputPass === !0) {
                                W(
                                    `THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`,
                                );
                                break;
                            }
                    }
                    M.setEffects(e || []);
                }),
                (this.getCurrentViewport = function (e) {
                    return e.copy(L);
                }),
                (this.getViewport = function (e) {
                    return e.copy(he);
                }),
                (this.setViewport = function (e, t, n, r) {
                    (e.isVector4
                        ? he.set(e.x, e.y, e.z, e.w)
                        : he.set(e, t, n, r),
                        V.viewport(L.copy(he).multiplyScalar(R).round()));
                }),
                (this.getScissor = function (e) {
                    return e.copy(ge);
                }),
                (this.setScissor = function (e, t, n, r) {
                    (e.isVector4
                        ? ge.set(e.x, e.y, e.z, e.w)
                        : ge.set(e, t, n, r),
                        V.scissor(se.copy(ge).multiplyScalar(R).round()));
                }),
                (this.getScissorTest = function () {
                    return _e;
                }),
                (this.setScissorTest = function (e) {
                    V.setScissorTest((_e = e));
                }),
                (this.setOpaqueSort = function (e) {
                    pe = e;
                }),
                (this.setTransparentSort = function (e) {
                    me = e;
                }),
                (this.getClearColor = function (e) {
                    return e.copy(Ve.getClearColor());
                }),
                (this.setClearColor = function () {
                    Ve.setClearColor(...arguments);
                }),
                (this.getClearAlpha = function () {
                    return Ve.getClearAlpha();
                }),
                (this.setClearAlpha = function () {
                    Ve.setClearAlpha(...arguments);
                }),
                (this.clear = function (e = !0, t = !0, n = !0) {
                    let r = 0;
                    if (e) {
                        let e = !1;
                        if (I !== null) {
                            let t = I.texture.format;
                            e = h.has(t);
                        }
                        if (e) {
                            let e = I.texture.type,
                                t = v.has(e),
                                n = Ve.getClearColor(),
                                r = Ve.getClearAlpha(),
                                i = n.r,
                                a = n.g,
                                o = n.b;
                            t
                                ? ((y[0] = i),
                                  (y[1] = a),
                                  (y[2] = o),
                                  (y[3] = r),
                                  z.clearBufferuiv(z.COLOR, 0, y))
                                : ((x[0] = i),
                                  (x[1] = a),
                                  (x[2] = o),
                                  (x[3] = r),
                                  z.clearBufferiv(z.COLOR, 0, x));
                        } else r |= z.COLOR_BUFFER_BIT;
                    }
                    (t &&
                        ((r |= z.DEPTH_BUFFER_BIT),
                        this.state.buffers.depth.setMask(!0)),
                        n &&
                            ((r |= z.STENCIL_BUFFER_BIT),
                            this.state.buffers.stencil.setMask(4294967295)),
                        r !== 0 && z.clear(r));
                }),
                (this.clearColor = function () {
                    this.clear(!0, !1, !1);
                }),
                (this.clearDepth = function () {
                    this.clear(!1, !0, !1);
                }),
                (this.clearStencil = function () {
                    this.clear(!1, !1, !0);
                }),
                (this.setNodesHandler = function (e) {
                    (e.setRenderer(this), (P = e));
                }),
                (this.dispose = function () {
                    (t.removeEventListener(`webglcontextlost`, Qe, !1),
                        t.removeEventListener(`webglcontextrestored`, $e, !1),
                        t.removeEventListener(
                            `webglcontextcreationerror`,
                            tt,
                            !1,
                        ),
                        Ve.dispose(),
                        Ie.dispose(),
                        Le.dispose(),
                        H.dispose(),
                        Ae.dispose(),
                        Ne.dispose(),
                        Ke.dispose(),
                        Je.dispose(),
                        Pe.dispose(),
                        Xe.dispose(),
                        Xe.removeEventListener(`sessionstart`, lt),
                        Xe.removeEventListener(`sessionend`, K),
                        ut.stop());
                }));
            function Qe(e) {
                (e.preventDefault(),
                    et(`WebGLRenderer: Context Lost.`),
                    (ee = !0));
            }
            function $e() {
                (et(`WebGLRenderer: Context Restored.`), (ee = !1));
                let e = ke.autoReset,
                    t = ze.enabled,
                    n = ze.autoUpdate,
                    r = ze.needsUpdate,
                    i = ze.type;
                (Ye(),
                    (ke.autoReset = e),
                    (ze.enabled = t),
                    (ze.autoUpdate = n),
                    (ze.needsUpdate = r),
                    (ze.type = i));
            }
            function tt(e) {
                G(
                    `WebGLRenderer: A WebGL context could not be created. Reason: `,
                    e.statusMessage,
                );
            }
            function nt(e) {
                let t = e.target;
                (t.removeEventListener(`dispose`, nt), it(t));
            }
            function it(e) {
                (at(e), H.remove(e));
            }
            function at(e) {
                let t = H.get(e).programs;
                t !== void 0 &&
                    (t.forEach(function (e) {
                        Pe.releaseProgram(e);
                    }),
                    e.isShaderMaterial && Pe.releaseShaderCache(e));
            }
            this.renderBufferDirect = function (e, t, n, r, i, a) {
                t === null && (t = we);
                let o = i.isMesh && i.matrixWorld.determinant() < 0,
                    s = vt(e, t, n, r, i);
                V.setMaterial(r, o);
                let c = n.index,
                    l = 1;
                if (r.wireframe === !0) {
                    if (((c = Me.getWireframeAttribute(n)), c === void 0))
                        return;
                    l = 2;
                }
                let u = n.drawRange,
                    d = n.attributes.position,
                    f = u.start * l,
                    p = (u.start + u.count) * l;
                (a !== null &&
                    ((f = Math.max(f, a.start * l)),
                    (p = Math.min(p, (a.start + a.count) * l))),
                    c === null
                        ? d != null &&
                          ((f = Math.max(f, 0)), (p = Math.min(p, d.count)))
                        : ((f = Math.max(f, 0)), (p = Math.min(p, c.count))));
                let m = p - f;
                if (m < 0 || m === 1 / 0) return;
                Ke.setup(i, r, s, n, c);
                let h,
                    g = Ue;
                if (
                    (c !== null && ((h = je.get(c)), (g = We), g.setIndex(h)),
                    i.isMesh)
                )
                    r.wireframe === !0
                        ? (V.setLineWidth(r.wireframeLinewidth * Ee()),
                          g.setMode(z.LINES))
                        : g.setMode(z.TRIANGLES);
                else if (i.isLine) {
                    let e = r.linewidth;
                    (e === void 0 && (e = 1),
                        V.setLineWidth(e * Ee()),
                        i.isLineSegments
                            ? g.setMode(z.LINES)
                            : i.isLineLoop
                              ? g.setMode(z.LINE_LOOP)
                              : g.setMode(z.LINE_STRIP));
                } else
                    i.isPoints
                        ? g.setMode(z.POINTS)
                        : i.isSprite && g.setMode(z.TRIANGLES);
                if (i.isBatchedMesh)
                    if (B.get(`WEBGL_multi_draw`))
                        g.renderMultiDraw(
                            i._multiDrawStarts,
                            i._multiDrawCounts,
                            i._multiDrawCount,
                        );
                    else {
                        let e = i._multiDrawStarts,
                            t = i._multiDrawCounts,
                            n = i._multiDrawCount,
                            a = c ? je.get(c).bytesPerElement : 1,
                            o = H.get(r).currentProgram.getUniforms();
                        for (let r = 0; r < n; r++)
                            (o.setValue(z, `_gl_DrawID`, r),
                                g.render(e[r] / a, t[r]));
                    }
                else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
                else if (n.isInstancedBufferGeometry) {
                    let e =
                            n._maxInstanceCount === void 0
                                ? 1 / 0
                                : n._maxInstanceCount,
                        t = Math.min(n.instanceCount, e);
                    g.renderInstances(f, m, t);
                } else g.render(f, m);
            };
            function ot(e, t, n) {
                e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1
                    ? ((e.side = 1),
                      (e.needsUpdate = !0),
                      ht(e, t, n),
                      (e.side = 0),
                      (e.needsUpdate = !0),
                      ht(e, t, n),
                      (e.side = 2))
                    : ht(e, t, n);
            }
            ((this.compile = function (e, t, n = null) {
                (n === null && (n = e),
                    (k = Le.get(n)),
                    k.init(t),
                    j.push(k),
                    n.traverseVisible(function (e) {
                        e.isLight &&
                            e.layers.test(t.layers) &&
                            (k.pushLight(e), e.castShadow && k.pushShadow(e));
                    }),
                    e !== n &&
                        e.traverseVisible(function (e) {
                            e.isLight &&
                                e.layers.test(t.layers) &&
                                (k.pushLight(e),
                                e.castShadow && k.pushShadow(e));
                        }),
                    k.setupLights());
                let r = new Set();
                return (
                    e.traverse(function (e) {
                        if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite))
                            return;
                        let t = e.material;
                        if (t)
                            if (Array.isArray(t))
                                for (let i = 0; i < t.length; i++) {
                                    let a = t[i];
                                    (ot(a, n, e), r.add(a));
                                }
                            else (ot(t, n, e), r.add(t));
                    }),
                    (k = j.pop()),
                    r
                );
            }),
                (this.compileAsync = function (e, t, n = null) {
                    let r = this.compile(e, t, n);
                    return new Promise((t) => {
                        function n() {
                            if (
                                (r.forEach(function (e) {
                                    H.get(e).currentProgram.isReady() &&
                                        r.delete(e);
                                }),
                                r.size === 0)
                            ) {
                                t(e);
                                return;
                            }
                            setTimeout(n, 10);
                        }
                        B.get(`KHR_parallel_shader_compile`) === null
                            ? setTimeout(n, 10)
                            : n();
                    });
                }));
            let st = null;
            function ct(e) {
                st && st(e);
            }
            function lt() {
                ut.stop();
            }
            function K() {
                ut.start();
            }
            let ut = new _a();
            (ut.setAnimationLoop(ct),
                typeof self < `u` && ut.setContext(self),
                (this.setAnimationLoop = function (e) {
                    ((st = e),
                        Xe.setAnimationLoop(e),
                        e === null ? ut.stop() : ut.start());
                }),
                Xe.addEventListener(`sessionstart`, lt),
                Xe.addEventListener(`sessionend`, K),
                (this.render = function (e, t) {
                    if (t !== void 0 && t.isCamera !== !0) {
                        G(
                            `WebGLRenderer.render: camera is not an instance of THREE.Camera.`,
                        );
                        return;
                    }
                    if (ee === !0) return;
                    P !== null && P.renderStart(e, t);
                    let n = Xe.enabled === !0 && Xe.isPresenting === !0,
                        r = M !== null && (I === null || n) && M.begin(N, I);
                    if (
                        (e.matrixWorldAutoUpdate === !0 &&
                            e.updateMatrixWorld(),
                        t.parent === null &&
                            t.matrixWorldAutoUpdate === !0 &&
                            t.updateMatrixWorld(),
                        Xe.enabled === !0 &&
                            Xe.isPresenting === !0 &&
                            (M === null || M.isCompositing() === !1) &&
                            (Xe.cameraAutoUpdate === !0 && Xe.updateCamera(t),
                            (t = Xe.getCamera())),
                        e.isScene === !0 && e.onBeforeRender(N, e, t, I),
                        (k = Le.get(e, j.length)),
                        k.init(t),
                        (k.state.textureUnits = U.getTextureUnits()),
                        j.push(k),
                        xe.multiplyMatrices(
                            t.projectionMatrix,
                            t.matrixWorldInverse,
                        ),
                        ve.setFromProjectionMatrix(xe, qe, t.reversedDepth),
                        (be = this.localClippingEnabled),
                        (ye = Re.init(this.clippingPlanes, be)),
                        (O = Ie.get(e, A.length)),
                        O.init(),
                        A.push(O),
                        Xe.enabled === !0 && Xe.isPresenting === !0)
                    ) {
                        let e = N.xr.getDepthSensingMesh();
                        e !== null && dt(e, t, -1 / 0, N.sortObjects);
                    }
                    (dt(e, t, 0, N.sortObjects),
                        O.finish(),
                        N.sortObjects === !0 && O.sort(pe, me),
                        (Te =
                            Xe.enabled === !1 ||
                            Xe.isPresenting === !1 ||
                            Xe.hasDepthSensing() === !1),
                        Te && Ve.addToRenderList(O, e),
                        this.info.render.frame++,
                        ye === !0 && Re.beginShadows());
                    let i = k.state.shadowsArray;
                    if (
                        (ze.render(i, e, t),
                        ye === !0 && Re.endShadows(),
                        this.info.autoReset === !0 && this.info.reset(),
                        (r && M.hasRenderPass()) === !1)
                    ) {
                        let n = O.opaque,
                            r = O.transmissive;
                        if ((k.setupLights(), t.isArrayCamera)) {
                            let i = t.cameras;
                            if (r.length > 0)
                                for (let t = 0, a = i.length; t < a; t++) {
                                    let a = i[t];
                                    pt(n, r, e, a);
                                }
                            Te && Ve.render(e);
                            for (let t = 0, n = i.length; t < n; t++) {
                                let n = i[t];
                                ft(O, e, n, n.viewport);
                            }
                        } else
                            (r.length > 0 && pt(n, r, e, t),
                                Te && Ve.render(e),
                                ft(O, e, t));
                    }
                    (I !== null &&
                        ie === 0 &&
                        (U.updateMultisampleRenderTarget(I),
                        U.updateRenderTargetMipmap(I)),
                        r && M.end(N),
                        e.isScene === !0 && e.onAfterRender(N, e, t),
                        Ke.resetDefaultState(),
                        (ae = -1),
                        (oe = null),
                        j.pop(),
                        j.length > 0
                            ? ((k = j[j.length - 1]),
                              U.setTextureUnits(k.state.textureUnits),
                              ye === !0 &&
                                  Re.setGlobalState(
                                      N.clippingPlanes,
                                      k.state.camera,
                                  ))
                            : (k = null),
                        A.pop(),
                        (O = A.length > 0 ? A[A.length - 1] : null),
                        P !== null && P.renderEnd());
                }));
            function dt(e, t, n, r) {
                if (e.visible === !1) return;
                if (e.layers.test(t.layers)) {
                    if (e.isGroup) n = e.renderOrder;
                    else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
                    else if (e.isLightProbeGrid) k.pushLightProbeGrid(e);
                    else if (e.isLight)
                        (k.pushLight(e), e.castShadow && k.pushShadow(e));
                    else if (e.isSprite) {
                        if (!e.frustumCulled || ve.intersectsSprite(e)) {
                            r &&
                                Ce.setFromMatrixPosition(
                                    e.matrixWorld,
                                ).applyMatrix4(xe);
                            let t = Ne.update(e),
                                i = e.material;
                            i.visible && O.push(e, t, i, n, Ce.z, null);
                        }
                    } else if (
                        (e.isMesh || e.isLine || e.isPoints) &&
                        (!e.frustumCulled || ve.intersectsObject(e))
                    ) {
                        let t = Ne.update(e),
                            i = e.material;
                        if (
                            (r &&
                                (e.boundingSphere === void 0
                                    ? (t.boundingSphere === null &&
                                          t.computeBoundingSphere(),
                                      Ce.copy(t.boundingSphere.center))
                                    : (e.boundingSphere === null &&
                                          e.computeBoundingSphere(),
                                      Ce.copy(e.boundingSphere.center)),
                                Ce.applyMatrix4(e.matrixWorld).applyMatrix4(
                                    xe,
                                )),
                            Array.isArray(i))
                        ) {
                            let r = t.groups;
                            for (let a = 0, o = r.length; a < o; a++) {
                                let o = r[a],
                                    s = i[o.materialIndex];
                                s && s.visible && O.push(e, t, s, n, Ce.z, o);
                            }
                        } else i.visible && O.push(e, t, i, n, Ce.z, null);
                    }
                }
                let i = e.children;
                for (let e = 0, a = i.length; e < a; e++) dt(i[e], t, n, r);
            }
            function ft(e, t, n, r) {
                let { opaque: i, transmissive: a, transparent: o } = e;
                (k.setupLightsView(n),
                    ye === !0 && Re.setGlobalState(N.clippingPlanes, n),
                    r && V.viewport(L.copy(r)),
                    i.length > 0 && q(i, t, n),
                    a.length > 0 && q(a, t, n),
                    o.length > 0 && q(o, t, n),
                    V.buffers.depth.setTest(!0),
                    V.buffers.depth.setMask(!0),
                    V.buffers.color.setMask(!0),
                    V.setPolygonOffset(!1));
            }
            function pt(e, t, n, r) {
                if ((n.isScene === !0 ? n.overrideMaterial : null) !== null)
                    return;
                if (k.state.transmissionRenderTarget[r.id] === void 0) {
                    let e =
                        B.has(`EXT_color_buffer_half_float`) ||
                        B.has(`EXT_color_buffer_float`);
                    k.state.transmissionRenderTarget[r.id] = new Nt(1, 1, {
                        generateMipmaps: !0,
                        type: e ? w : _,
                        minFilter: g,
                        samples: Math.max(4, Oe.samples),
                        stencilBuffer: i,
                        resolveDepthBuffer: !1,
                        resolveStencilBuffer: !1,
                        colorSpace: X.workingColorSpace,
                    });
                }
                let a = k.state.transmissionRenderTarget[r.id],
                    o = r.viewport || L;
                a.setSize(
                    o.z * N.transmissionResolutionScale,
                    o.w * N.transmissionResolutionScale,
                );
                let s = N.getRenderTarget(),
                    c = N.getActiveCubeFace(),
                    l = N.getActiveMipmapLevel();
                (N.setRenderTarget(a),
                    N.getClearColor(le),
                    (ue = N.getClearAlpha()),
                    ue < 1 && N.setClearColor(16777215, 0.5),
                    N.clear(),
                    Te && Ve.render(n));
                let u = N.toneMapping;
                N.toneMapping = 0;
                let d = r.viewport;
                if (
                    (r.viewport !== void 0 && (r.viewport = void 0),
                    k.setupLightsView(r),
                    ye === !0 && Re.setGlobalState(N.clippingPlanes, r),
                    q(e, n, r),
                    U.updateMultisampleRenderTarget(a),
                    U.updateRenderTargetMipmap(a),
                    B.has(`WEBGL_multisampled_render_to_texture`) === !1)
                ) {
                    let e = !1;
                    for (let i = 0, a = t.length; i < a; i++) {
                        let {
                            object: a,
                            geometry: o,
                            material: s,
                            group: c,
                        } = t[i];
                        if (s.side === 2 && a.layers.test(r.layers)) {
                            let t = s.side;
                            ((s.side = 1),
                                (s.needsUpdate = !0),
                                mt(a, n, r, o, s, c),
                                (s.side = t),
                                (s.needsUpdate = !0),
                                (e = !0));
                        }
                    }
                    e === !0 &&
                        (U.updateMultisampleRenderTarget(a),
                        U.updateRenderTargetMipmap(a));
                }
                (N.setRenderTarget(s, c, l),
                    N.setClearColor(le, ue),
                    d !== void 0 && (r.viewport = d),
                    (N.toneMapping = u));
            }
            function q(e, t, n) {
                let r = t.isScene === !0 ? t.overrideMaterial : null;
                for (let i = 0, a = e.length; i < a; i++) {
                    let a = e[i],
                        { object: o, geometry: s, group: c } = a,
                        l = a.material;
                    (l.allowOverride === !0 && r !== null && (l = r),
                        o.layers.test(n.layers) && mt(o, t, n, s, l, c));
                }
            }
            function mt(e, t, n, r, i, a) {
                (e.onBeforeRender(N, t, n, r, i, a),
                    e.modelViewMatrix.multiplyMatrices(
                        n.matrixWorldInverse,
                        e.matrixWorld,
                    ),
                    e.normalMatrix.getNormalMatrix(e.modelViewMatrix),
                    i.onBeforeRender(N, t, n, r, e, a),
                    i.transparent === !0 &&
                    i.side === 2 &&
                    i.forceSinglePass === !1
                        ? ((i.side = 1),
                          (i.needsUpdate = !0),
                          N.renderBufferDirect(n, t, r, i, e, a),
                          (i.side = 0),
                          (i.needsUpdate = !0),
                          N.renderBufferDirect(n, t, r, i, e, a),
                          (i.side = 2))
                        : N.renderBufferDirect(n, t, r, i, e, a),
                    e.onAfterRender(N, t, n, r, i, a));
            }
            function ht(e, t, n) {
                t.isScene !== !0 && (t = we);
                let r = H.get(e),
                    i = k.state.lights,
                    a = k.state.shadowsArray,
                    o = i.state.version,
                    s = Pe.getParameters(
                        e,
                        i.state,
                        a,
                        t,
                        n,
                        k.state.lightProbeGridArray,
                    ),
                    c = Pe.getProgramCacheKey(s),
                    l = r.programs;
                ((r.environment =
                    e.isMeshStandardMaterial ||
                    e.isMeshLambertMaterial ||
                    e.isMeshPhongMaterial
                        ? t.environment
                        : null),
                    (r.fog = t.fog));
                let u =
                    e.isMeshStandardMaterial ||
                    (e.isMeshLambertMaterial && !e.envMap) ||
                    (e.isMeshPhongMaterial && !e.envMap);
                ((r.envMap = Ae.get(e.envMap || r.environment, u)),
                    (r.envMapRotation =
                        r.environment !== null && e.envMap === null
                            ? t.environmentRotation
                            : e.envMapRotation),
                    l === void 0 &&
                        (e.addEventListener(`dispose`, nt),
                        (l = new Map()),
                        (r.programs = l)));
                let d = l.get(c);
                if (d !== void 0) {
                    if (r.currentProgram === d && r.lightsStateVersion === o)
                        return (Y(e, s), d);
                } else
                    ((s.uniforms = Pe.getUniforms(e)),
                        P !== null && e.isNodeMaterial && P.build(e, n, s),
                        e.onBeforeCompile(s, N),
                        (d = Pe.acquireProgram(s, c)),
                        l.set(c, d),
                        (r.uniforms = s.uniforms));
                let f = r.uniforms;
                return (
                    ((!e.isShaderMaterial && !e.isRawShaderMaterial) ||
                        e.clipping === !0) &&
                        (f.clippingPlanes = Re.uniform),
                    Y(e, s),
                    (r.needsLights = bt(e)),
                    (r.lightsStateVersion = o),
                    r.needsLights &&
                        ((f.ambientLightColor.value = i.state.ambient),
                        (f.lightProbe.value = i.state.probe),
                        (f.directionalLights.value = i.state.directional),
                        (f.directionalLightShadows.value =
                            i.state.directionalShadow),
                        (f.spotLights.value = i.state.spot),
                        (f.spotLightShadows.value = i.state.spotShadow),
                        (f.rectAreaLights.value = i.state.rectArea),
                        (f.ltc_1.value = i.state.rectAreaLTC1),
                        (f.ltc_2.value = i.state.rectAreaLTC2),
                        (f.pointLights.value = i.state.point),
                        (f.pointLightShadows.value = i.state.pointShadow),
                        (f.hemisphereLights.value = i.state.hemi),
                        (f.directionalShadowMatrix.value =
                            i.state.directionalShadowMatrix),
                        (f.spotLightMatrix.value = i.state.spotLightMatrix),
                        (f.spotLightMap.value = i.state.spotLightMap),
                        (f.pointShadowMatrix.value =
                            i.state.pointShadowMatrix)),
                    (r.lightProbeGrid = k.state.lightProbeGridArray.length > 0),
                    (r.currentProgram = d),
                    (r.uniformsList = null),
                    d
                );
            }
            function gt(e) {
                if (e.uniformsList === null) {
                    let t = e.currentProgram.getUniforms();
                    e.uniformsList = ds.seqWithValue(t.seq, e.uniforms);
                }
                return e.uniformsList;
            }
            function Y(e, t) {
                let n = H.get(e);
                ((n.outputColorSpace = t.outputColorSpace),
                    (n.batching = t.batching),
                    (n.batchingColor = t.batchingColor),
                    (n.instancing = t.instancing),
                    (n.instancingColor = t.instancingColor),
                    (n.instancingMorph = t.instancingMorph),
                    (n.skinning = t.skinning),
                    (n.morphTargets = t.morphTargets),
                    (n.morphNormals = t.morphNormals),
                    (n.morphColors = t.morphColors),
                    (n.morphTargetsCount = t.morphTargetsCount),
                    (n.numClippingPlanes = t.numClippingPlanes),
                    (n.numIntersection = t.numClipIntersection),
                    (n.vertexAlphas = t.vertexAlphas),
                    (n.vertexTangents = t.vertexTangents),
                    (n.toneMapping = t.toneMapping));
            }
            function _t(e, t) {
                if (e.length === 0) return null;
                if (e.length === 1) return e[0].texture === null ? null : e[0];
                C.setFromMatrixPosition(t.matrixWorld);
                for (let t = 0, n = e.length; t < n; t++) {
                    let n = e[t];
                    if (n.texture !== null && n.boundingBox.containsPoint(C))
                        return n;
                }
                return null;
            }
            function vt(e, t, n, r, i) {
                (t.isScene !== !0 && (t = we), U.resetTextureUnits());
                let a = t.fog,
                    o =
                        r.isMeshStandardMaterial ||
                        r.isMeshLambertMaterial ||
                        r.isMeshPhongMaterial
                            ? t.environment
                            : null,
                    s =
                        I === null
                            ? N.outputColorSpace
                            : I.isXRRenderTarget === !0
                              ? I.texture.colorSpace
                              : X.workingColorSpace,
                    c =
                        r.isMeshStandardMaterial ||
                        (r.isMeshLambertMaterial && !r.envMap) ||
                        (r.isMeshPhongMaterial && !r.envMap),
                    l = Ae.get(r.envMap || o, c),
                    u =
                        r.vertexColors === !0 &&
                        !!n.attributes.color &&
                        n.attributes.color.itemSize === 4,
                    d =
                        !!n.attributes.tangent &&
                        (!!r.normalMap || r.anisotropy > 0),
                    f = !!n.morphAttributes.position,
                    p = !!n.morphAttributes.normal,
                    m = !!n.morphAttributes.color,
                    h = 0;
                r.toneMapped &&
                    (I === null || I.isXRRenderTarget === !0) &&
                    (h = N.toneMapping);
                let g =
                        n.morphAttributes.position ||
                        n.morphAttributes.normal ||
                        n.morphAttributes.color,
                    _ = g === void 0 ? 0 : g.length,
                    v = H.get(r),
                    y = k.state.lights;
                if (ye === !0 && (be === !0 || e !== oe)) {
                    let t = e === oe && r.id === ae;
                    Re.setState(r, e, t);
                }
                let b = !1;
                r.version === v.__version
                    ? v.needsLights && v.lightsStateVersion !== y.state.version
                        ? (b = !0)
                        : v.outputColorSpace === s
                          ? (i.isBatchedMesh && v.batching === !1) ||
                            (!i.isBatchedMesh && v.batching === !0) ||
                            (i.isBatchedMesh &&
                                v.batchingColor === !0 &&
                                i.colorTexture === null) ||
                            (i.isBatchedMesh &&
                                v.batchingColor === !1 &&
                                i.colorTexture !== null) ||
                            (i.isInstancedMesh && v.instancing === !1) ||
                            (!i.isInstancedMesh && v.instancing === !0) ||
                            (i.isSkinnedMesh && v.skinning === !1) ||
                            (!i.isSkinnedMesh && v.skinning === !0) ||
                            (i.isInstancedMesh &&
                                v.instancingColor === !0 &&
                                i.instanceColor === null) ||
                            (i.isInstancedMesh &&
                                v.instancingColor === !1 &&
                                i.instanceColor !== null) ||
                            (i.isInstancedMesh &&
                                v.instancingMorph === !0 &&
                                i.morphTexture === null) ||
                            (i.isInstancedMesh &&
                                v.instancingMorph === !1 &&
                                i.morphTexture !== null)
                              ? (b = !0)
                              : v.envMap === l
                                ? (r.fog === !0 && v.fog !== a) ||
                                  (v.numClippingPlanes !== void 0 &&
                                      (v.numClippingPlanes !== Re.numPlanes ||
                                          v.numIntersection !==
                                              Re.numIntersection))
                                    ? (b = !0)
                                    : v.vertexAlphas === u &&
                                        v.vertexTangents === d &&
                                        v.morphTargets === f &&
                                        v.morphNormals === p &&
                                        v.morphColors === m &&
                                        v.toneMapping === h &&
                                        v.morphTargetsCount === _
                                      ? !!v.lightProbeGrid !=
                                            k.state.lightProbeGridArray.length >
                                                0 && (b = !0)
                                      : (b = !0)
                                : (b = !0)
                          : (b = !0)
                    : ((b = !0), (v.__version = r.version));
                let x = v.currentProgram;
                b === !0 &&
                    ((x = ht(r, t, i)),
                    P && r.isNodeMaterial && P.onUpdateProgram(r, x, v));
                let S = !1,
                    C = !1,
                    w = !1,
                    T = x.getUniforms(),
                    E = v.uniforms;
                if (
                    (V.useProgram(x.program) && ((S = !0), (C = !0), (w = !0)),
                    r.id !== ae && ((ae = r.id), (C = !0)),
                    v.needsLights)
                ) {
                    let e = _t(k.state.lightProbeGridArray, i);
                    v.lightProbeGrid !== e &&
                        ((v.lightProbeGrid = e), (C = !0));
                }
                if (S || oe !== e) {
                    (V.buffers.depth.getReversed() &&
                        e.reversedDepth !== !0 &&
                        ((e._reversedDepth = !0), e.updateProjectionMatrix()),
                        T.setValue(z, `projectionMatrix`, e.projectionMatrix),
                        T.setValue(z, `viewMatrix`, e.matrixWorldInverse));
                    let t = T.map.cameraPosition;
                    (t !== void 0 &&
                        t.setValue(z, Se.setFromMatrixPosition(e.matrixWorld)),
                        Oe.logarithmicDepthBuffer &&
                            T.setValue(
                                z,
                                `logDepthBufFC`,
                                2 / (Math.log(e.far + 1) / Math.LN2),
                            ),
                        (r.isMeshPhongMaterial ||
                            r.isMeshToonMaterial ||
                            r.isMeshLambertMaterial ||
                            r.isMeshBasicMaterial ||
                            r.isMeshStandardMaterial ||
                            r.isShaderMaterial) &&
                            T.setValue(
                                z,
                                `isOrthographic`,
                                e.isOrthographicCamera === !0,
                            ),
                        oe !== e && ((oe = e), (C = !0), (w = !0)));
                }
                if (
                    (v.needsLights &&
                        (y.state.directionalShadowMap.length > 0 &&
                            T.setValue(
                                z,
                                `directionalShadowMap`,
                                y.state.directionalShadowMap,
                                U,
                            ),
                        y.state.spotShadowMap.length > 0 &&
                            T.setValue(
                                z,
                                `spotShadowMap`,
                                y.state.spotShadowMap,
                                U,
                            ),
                        y.state.pointShadowMap.length > 0 &&
                            T.setValue(
                                z,
                                `pointShadowMap`,
                                y.state.pointShadowMap,
                                U,
                            )),
                    i.isSkinnedMesh)
                ) {
                    (T.setOptional(z, i, `bindMatrix`),
                        T.setOptional(z, i, `bindMatrixInverse`));
                    let e = i.skeleton;
                    e &&
                        (e.boneTexture === null && e.computeBoneTexture(),
                        T.setValue(z, `boneTexture`, e.boneTexture, U));
                }
                i.isBatchedMesh &&
                    (T.setOptional(z, i, `batchingTexture`),
                    T.setValue(z, `batchingTexture`, i._matricesTexture, U),
                    T.setOptional(z, i, `batchingIdTexture`),
                    T.setValue(z, `batchingIdTexture`, i._indirectTexture, U),
                    T.setOptional(z, i, `batchingColorTexture`),
                    i._colorsTexture !== null &&
                        T.setValue(
                            z,
                            `batchingColorTexture`,
                            i._colorsTexture,
                            U,
                        ));
                let D = n.morphAttributes;
                if (
                    ((D.position !== void 0 ||
                        D.normal !== void 0 ||
                        D.color !== void 0) &&
                        He.update(i, n, x),
                    (C || v.receiveShadow !== i.receiveShadow) &&
                        ((v.receiveShadow = i.receiveShadow),
                        T.setValue(z, `receiveShadow`, i.receiveShadow)),
                    (r.isMeshStandardMaterial ||
                        r.isMeshLambertMaterial ||
                        r.isMeshPhongMaterial) &&
                        r.envMap === null &&
                        t.environment !== null &&
                        (E.envMapIntensity.value = t.environmentIntensity),
                    E.dfgLUT !== void 0 && (E.dfgLUT.value = Mc()),
                    C)
                ) {
                    if (
                        (T.setValue(
                            z,
                            `toneMappingExposure`,
                            N.toneMappingExposure,
                        ),
                        v.needsLights && yt(E, w),
                        a && r.fog === !0 && Fe.refreshFogUniforms(E, a),
                        Fe.refreshMaterialUniforms(
                            E,
                            r,
                            R,
                            fe,
                            k.state.transmissionRenderTarget[e.id],
                        ),
                        v.needsLights && v.lightProbeGrid)
                    ) {
                        let e = v.lightProbeGrid;
                        ((E.probesSH.value = e.texture),
                            E.probesMin.value.copy(e.boundingBox.min),
                            E.probesMax.value.copy(e.boundingBox.max),
                            E.probesResolution.value.copy(e.resolution));
                    }
                    ds.upload(z, gt(v), E, U);
                }
                if (
                    (r.isShaderMaterial &&
                        r.uniformsNeedUpdate === !0 &&
                        (ds.upload(z, gt(v), E, U),
                        (r.uniformsNeedUpdate = !1)),
                    r.isSpriteMaterial && T.setValue(z, `center`, i.center),
                    T.setValue(z, `modelViewMatrix`, i.modelViewMatrix),
                    T.setValue(z, `normalMatrix`, i.normalMatrix),
                    T.setValue(z, `modelMatrix`, i.matrixWorld),
                    r.uniformsGroups !== void 0)
                ) {
                    let e = r.uniformsGroups;
                    for (let t = 0, n = e.length; t < n; t++) {
                        let n = e[t];
                        (Je.update(n, x), Je.bind(n, x));
                    }
                }
                return x;
            }
            function yt(e, t) {
                ((e.ambientLightColor.needsUpdate = t),
                    (e.lightProbe.needsUpdate = t),
                    (e.directionalLights.needsUpdate = t),
                    (e.directionalLightShadows.needsUpdate = t),
                    (e.pointLights.needsUpdate = t),
                    (e.pointLightShadows.needsUpdate = t),
                    (e.spotLights.needsUpdate = t),
                    (e.spotLightShadows.needsUpdate = t),
                    (e.rectAreaLights.needsUpdate = t),
                    (e.hemisphereLights.needsUpdate = t));
            }
            function bt(e) {
                return (
                    e.isMeshLambertMaterial ||
                    e.isMeshToonMaterial ||
                    e.isMeshPhongMaterial ||
                    e.isMeshStandardMaterial ||
                    e.isShadowMaterial ||
                    (e.isShaderMaterial && e.lights === !0)
                );
            }
            ((this.getActiveCubeFace = function () {
                return te;
            }),
                (this.getActiveMipmapLevel = function () {
                    return ie;
                }),
                (this.getRenderTarget = function () {
                    return I;
                }),
                (this.setRenderTargetTextures = function (e, t, n) {
                    let r = H.get(e);
                    ((r.__autoAllocateDepthBuffer =
                        e.resolveDepthBuffer === !1),
                        r.__autoAllocateDepthBuffer === !1 &&
                            (r.__useRenderToTexture = !1),
                        (H.get(e.texture).__webglTexture = t),
                        (H.get(e.depthTexture).__webglTexture =
                            r.__autoAllocateDepthBuffer ? void 0 : n),
                        (r.__hasExternalTextures = !0));
                }),
                (this.setRenderTargetFramebuffer = function (e, t) {
                    let n = H.get(e);
                    ((n.__webglFramebuffer = t),
                        (n.__useDefaultFramebuffer = t === void 0));
                }));
            let xt = z.createFramebuffer();
            ((this.setRenderTarget = function (e, t = 0, n = 0) {
                ((I = e), (te = t), (ie = n));
                let r = null,
                    i = !1,
                    a = !1;
                if (e) {
                    let o = H.get(e);
                    if (o.__useDefaultFramebuffer !== void 0) {
                        (V.bindFramebuffer(z.FRAMEBUFFER, o.__webglFramebuffer),
                            L.copy(e.viewport),
                            se.copy(e.scissor),
                            (ce = e.scissorTest),
                            V.viewport(L),
                            V.scissor(se),
                            V.setScissorTest(ce),
                            (ae = -1));
                        return;
                    } else if (o.__webglFramebuffer === void 0)
                        U.setupRenderTarget(e);
                    else if (o.__hasExternalTextures)
                        U.rebindTextures(
                            e,
                            H.get(e.texture).__webglTexture,
                            H.get(e.depthTexture).__webglTexture,
                        );
                    else if (e.depthBuffer) {
                        let t = e.depthTexture;
                        if (o.__boundDepthTexture !== t) {
                            if (
                                t !== null &&
                                H.has(t) &&
                                (e.width !== t.image.width ||
                                    e.height !== t.image.height)
                            )
                                throw Error(
                                    `WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`,
                                );
                            U.setupDepthRenderbuffer(e);
                        }
                    }
                    let s = e.texture;
                    (s.isData3DTexture ||
                        s.isDataArrayTexture ||
                        s.isCompressedArrayTexture) &&
                        (a = !0);
                    let c = H.get(e).__webglFramebuffer;
                    (e.isWebGLCubeRenderTarget
                        ? ((r = Array.isArray(c[t]) ? c[t][n] : c[t]), (i = !0))
                        : (r =
                              e.samples > 0 && U.useMultisampledRTT(e) === !1
                                  ? H.get(e).__webglMultisampledFramebuffer
                                  : Array.isArray(c)
                                    ? c[n]
                                    : c),
                        L.copy(e.viewport),
                        se.copy(e.scissor),
                        (ce = e.scissorTest));
                } else
                    (L.copy(he).multiplyScalar(R).floor(),
                        se.copy(ge).multiplyScalar(R).floor(),
                        (ce = _e));
                if (
                    (n !== 0 && (r = xt),
                    V.bindFramebuffer(z.FRAMEBUFFER, r) && V.drawBuffers(e, r),
                    V.viewport(L),
                    V.scissor(se),
                    V.setScissorTest(ce),
                    i)
                ) {
                    let r = H.get(e.texture);
                    z.framebufferTexture2D(
                        z.FRAMEBUFFER,
                        z.COLOR_ATTACHMENT0,
                        z.TEXTURE_CUBE_MAP_POSITIVE_X + t,
                        r.__webglTexture,
                        n,
                    );
                } else if (a) {
                    let r = t;
                    for (let t = 0; t < e.textures.length; t++) {
                        let i = H.get(e.textures[t]);
                        z.framebufferTextureLayer(
                            z.FRAMEBUFFER,
                            z.COLOR_ATTACHMENT0 + t,
                            i.__webglTexture,
                            n,
                            r,
                        );
                    }
                } else if (e !== null && n !== 0) {
                    let t = H.get(e.texture);
                    z.framebufferTexture2D(
                        z.FRAMEBUFFER,
                        z.COLOR_ATTACHMENT0,
                        z.TEXTURE_2D,
                        t.__webglTexture,
                        n,
                    );
                }
                ae = -1;
            }),
                (this.readRenderTargetPixels = function (
                    e,
                    t,
                    n,
                    r,
                    i,
                    a,
                    o,
                    s = 0,
                ) {
                    if (!(e && e.isWebGLRenderTarget)) {
                        G(
                            `WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`,
                        );
                        return;
                    }
                    let c = H.get(e).__webglFramebuffer;
                    if (
                        (e.isWebGLCubeRenderTarget &&
                            o !== void 0 &&
                            (c = c[o]),
                        c)
                    ) {
                        V.bindFramebuffer(z.FRAMEBUFFER, c);
                        try {
                            let o = e.textures[s],
                                c = o.format,
                                l = o.type;
                            if (
                                (e.textures.length > 1 &&
                                    z.readBuffer(z.COLOR_ATTACHMENT0 + s),
                                !Oe.textureFormatReadable(c))
                            ) {
                                G(
                                    `WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`,
                                );
                                return;
                            }
                            if (!Oe.textureTypeReadable(l)) {
                                G(
                                    `WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`,
                                );
                                return;
                            }
                            t >= 0 &&
                                t <= e.width - r &&
                                n >= 0 &&
                                n <= e.height - i &&
                                z.readPixels(
                                    t,
                                    n,
                                    r,
                                    i,
                                    Ge.convert(c),
                                    Ge.convert(l),
                                    a,
                                );
                        } finally {
                            let e =
                                I === null ? null : H.get(I).__webglFramebuffer;
                            V.bindFramebuffer(z.FRAMEBUFFER, e);
                        }
                    }
                }),
                (this.readRenderTargetPixelsAsync = async function (
                    e,
                    t,
                    n,
                    r,
                    i,
                    a,
                    o,
                    s = 0,
                ) {
                    if (!(e && e.isWebGLRenderTarget))
                        throw Error(
                            `THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`,
                        );
                    let c = H.get(e).__webglFramebuffer;
                    if (
                        (e.isWebGLCubeRenderTarget &&
                            o !== void 0 &&
                            (c = c[o]),
                        c)
                    )
                        if (
                            t >= 0 &&
                            t <= e.width - r &&
                            n >= 0 &&
                            n <= e.height - i
                        ) {
                            V.bindFramebuffer(z.FRAMEBUFFER, c);
                            let o = e.textures[s],
                                l = o.format,
                                u = o.type;
                            if (
                                (e.textures.length > 1 &&
                                    z.readBuffer(z.COLOR_ATTACHMENT0 + s),
                                !Oe.textureFormatReadable(l))
                            )
                                throw Error(
                                    `THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`,
                                );
                            if (!Oe.textureTypeReadable(u))
                                throw Error(
                                    `THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`,
                                );
                            let d = z.createBuffer();
                            (z.bindBuffer(z.PIXEL_PACK_BUFFER, d),
                                z.bufferData(
                                    z.PIXEL_PACK_BUFFER,
                                    a.byteLength,
                                    z.STREAM_READ,
                                ),
                                z.readPixels(
                                    t,
                                    n,
                                    r,
                                    i,
                                    Ge.convert(l),
                                    Ge.convert(u),
                                    0,
                                ));
                            let f =
                                I === null ? null : H.get(I).__webglFramebuffer;
                            V.bindFramebuffer(z.FRAMEBUFFER, f);
                            let p = z.fenceSync(
                                z.SYNC_GPU_COMMANDS_COMPLETE,
                                0,
                            );
                            return (
                                z.flush(),
                                await rt(z, p, 4),
                                z.bindBuffer(z.PIXEL_PACK_BUFFER, d),
                                z.getBufferSubData(z.PIXEL_PACK_BUFFER, 0, a),
                                z.deleteBuffer(d),
                                z.deleteSync(p),
                                a
                            );
                        } else
                            throw Error(
                                `THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`,
                            );
                }),
                (this.copyFramebufferToTexture = function (e, t = null, n = 0) {
                    let r = 2 ** -n,
                        i = Math.floor(e.image.width * r),
                        a = Math.floor(e.image.height * r),
                        o = t === null ? 0 : t.x,
                        s = t === null ? 0 : t.y;
                    (U.setTexture2D(e, 0),
                        z.copyTexSubImage2D(z.TEXTURE_2D, n, 0, 0, o, s, i, a),
                        V.unbindTexture());
                }));
            let St = z.createFramebuffer(),
                Ct = z.createFramebuffer();
            ((this.copyTextureToTexture = function (
                e,
                t,
                n = null,
                r = null,
                i = 0,
                a = 0,
            ) {
                let o,
                    s,
                    c,
                    l,
                    u,
                    d,
                    f,
                    p,
                    m,
                    h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
                if (n !== null)
                    ((o = n.max.x - n.min.x),
                        (s = n.max.y - n.min.y),
                        (c = n.isBox3 ? n.max.z - n.min.z : 1),
                        (l = n.min.x),
                        (u = n.min.y),
                        (d = n.isBox3 ? n.min.z : 0));
                else {
                    let t = 2 ** -i;
                    ((o = Math.floor(h.width * t)),
                        (s = Math.floor(h.height * t)),
                        (c = e.isDataArrayTexture
                            ? h.depth
                            : e.isData3DTexture
                              ? Math.floor(h.depth * t)
                              : 1),
                        (l = 0),
                        (u = 0),
                        (d = 0));
                }
                r === null
                    ? ((f = 0), (p = 0), (m = 0))
                    : ((f = r.x), (p = r.y), (m = r.z));
                let g = Ge.convert(t.format),
                    _ = Ge.convert(t.type),
                    v;
                (t.isData3DTexture
                    ? (U.setTexture3D(t, 0), (v = z.TEXTURE_3D))
                    : t.isDataArrayTexture || t.isCompressedArrayTexture
                      ? (U.setTexture2DArray(t, 0), (v = z.TEXTURE_2D_ARRAY))
                      : (U.setTexture2D(t, 0), (v = z.TEXTURE_2D)),
                    V.activeTexture(z.TEXTURE0),
                    V.pixelStorei(z.UNPACK_FLIP_Y_WEBGL, t.flipY),
                    V.pixelStorei(
                        z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                        t.premultiplyAlpha,
                    ),
                    V.pixelStorei(z.UNPACK_ALIGNMENT, t.unpackAlignment));
                let y = V.getParameter(z.UNPACK_ROW_LENGTH),
                    b = V.getParameter(z.UNPACK_IMAGE_HEIGHT),
                    x = V.getParameter(z.UNPACK_SKIP_PIXELS),
                    S = V.getParameter(z.UNPACK_SKIP_ROWS),
                    C = V.getParameter(z.UNPACK_SKIP_IMAGES);
                (V.pixelStorei(z.UNPACK_ROW_LENGTH, h.width),
                    V.pixelStorei(z.UNPACK_IMAGE_HEIGHT, h.height),
                    V.pixelStorei(z.UNPACK_SKIP_PIXELS, l),
                    V.pixelStorei(z.UNPACK_SKIP_ROWS, u),
                    V.pixelStorei(z.UNPACK_SKIP_IMAGES, d));
                let w = e.isDataArrayTexture || e.isData3DTexture,
                    T = t.isDataArrayTexture || t.isData3DTexture;
                if (e.isDepthTexture) {
                    let n = H.get(e),
                        r = H.get(t),
                        h = H.get(n.__renderTarget),
                        g = H.get(r.__renderTarget);
                    (V.bindFramebuffer(
                        z.READ_FRAMEBUFFER,
                        h.__webglFramebuffer,
                    ),
                        V.bindFramebuffer(
                            z.DRAW_FRAMEBUFFER,
                            g.__webglFramebuffer,
                        ));
                    for (let n = 0; n < c; n++)
                        (w &&
                            (z.framebufferTextureLayer(
                                z.READ_FRAMEBUFFER,
                                z.COLOR_ATTACHMENT0,
                                H.get(e).__webglTexture,
                                i,
                                d + n,
                            ),
                            z.framebufferTextureLayer(
                                z.DRAW_FRAMEBUFFER,
                                z.COLOR_ATTACHMENT0,
                                H.get(t).__webglTexture,
                                a,
                                m + n,
                            )),
                            z.blitFramebuffer(
                                l,
                                u,
                                o,
                                s,
                                f,
                                p,
                                o,
                                s,
                                z.DEPTH_BUFFER_BIT,
                                z.NEAREST,
                            ));
                    (V.bindFramebuffer(z.READ_FRAMEBUFFER, null),
                        V.bindFramebuffer(z.DRAW_FRAMEBUFFER, null));
                } else if (i !== 0 || e.isRenderTargetTexture || H.has(e)) {
                    let n = H.get(e),
                        r = H.get(t);
                    (V.bindFramebuffer(z.READ_FRAMEBUFFER, St),
                        V.bindFramebuffer(z.DRAW_FRAMEBUFFER, Ct));
                    for (let e = 0; e < c; e++)
                        (w
                            ? z.framebufferTextureLayer(
                                  z.READ_FRAMEBUFFER,
                                  z.COLOR_ATTACHMENT0,
                                  n.__webglTexture,
                                  i,
                                  d + e,
                              )
                            : z.framebufferTexture2D(
                                  z.READ_FRAMEBUFFER,
                                  z.COLOR_ATTACHMENT0,
                                  z.TEXTURE_2D,
                                  n.__webglTexture,
                                  i,
                              ),
                            T
                                ? z.framebufferTextureLayer(
                                      z.DRAW_FRAMEBUFFER,
                                      z.COLOR_ATTACHMENT0,
                                      r.__webglTexture,
                                      a,
                                      m + e,
                                  )
                                : z.framebufferTexture2D(
                                      z.DRAW_FRAMEBUFFER,
                                      z.COLOR_ATTACHMENT0,
                                      z.TEXTURE_2D,
                                      r.__webglTexture,
                                      a,
                                  ),
                            i === 0
                                ? T
                                    ? z.copyTexSubImage3D(
                                          v,
                                          a,
                                          f,
                                          p,
                                          m + e,
                                          l,
                                          u,
                                          o,
                                          s,
                                      )
                                    : z.copyTexSubImage2D(
                                          v,
                                          a,
                                          f,
                                          p,
                                          l,
                                          u,
                                          o,
                                          s,
                                      )
                                : z.blitFramebuffer(
                                      l,
                                      u,
                                      o,
                                      s,
                                      f,
                                      p,
                                      o,
                                      s,
                                      z.COLOR_BUFFER_BIT,
                                      z.NEAREST,
                                  ));
                    (V.bindFramebuffer(z.READ_FRAMEBUFFER, null),
                        V.bindFramebuffer(z.DRAW_FRAMEBUFFER, null));
                } else
                    T
                        ? e.isDataTexture || e.isData3DTexture
                            ? z.texSubImage3D(
                                  v,
                                  a,
                                  f,
                                  p,
                                  m,
                                  o,
                                  s,
                                  c,
                                  g,
                                  _,
                                  h.data,
                              )
                            : t.isCompressedArrayTexture
                              ? z.compressedTexSubImage3D(
                                    v,
                                    a,
                                    f,
                                    p,
                                    m,
                                    o,
                                    s,
                                    c,
                                    g,
                                    h.data,
                                )
                              : z.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h)
                        : e.isDataTexture
                          ? z.texSubImage2D(
                                z.TEXTURE_2D,
                                a,
                                f,
                                p,
                                o,
                                s,
                                g,
                                _,
                                h.data,
                            )
                          : e.isCompressedTexture
                            ? z.compressedTexSubImage2D(
                                  z.TEXTURE_2D,
                                  a,
                                  f,
                                  p,
                                  h.width,
                                  h.height,
                                  g,
                                  h.data,
                              )
                            : z.texSubImage2D(
                                  z.TEXTURE_2D,
                                  a,
                                  f,
                                  p,
                                  o,
                                  s,
                                  g,
                                  _,
                                  h,
                              );
                (V.pixelStorei(z.UNPACK_ROW_LENGTH, y),
                    V.pixelStorei(z.UNPACK_IMAGE_HEIGHT, b),
                    V.pixelStorei(z.UNPACK_SKIP_PIXELS, x),
                    V.pixelStorei(z.UNPACK_SKIP_ROWS, S),
                    V.pixelStorei(z.UNPACK_SKIP_IMAGES, C),
                    a === 0 && t.generateMipmaps && z.generateMipmap(v),
                    V.unbindTexture());
            }),
                (this.initRenderTarget = function (e) {
                    H.get(e).__webglFramebuffer === void 0 &&
                        U.setupRenderTarget(e);
                }),
                (this.initTexture = function (e) {
                    (e.isCubeTexture
                        ? U.setTextureCube(e, 0)
                        : e.isData3DTexture
                          ? U.setTexture3D(e, 0)
                          : e.isDataArrayTexture || e.isCompressedArrayTexture
                            ? U.setTexture2DArray(e, 0)
                            : U.setTexture2D(e, 0),
                        V.unbindTexture());
                }),
                (this.resetState = function () {
                    ((te = 0), (ie = 0), (I = null), V.reset(), Ke.reset());
                }),
                typeof __THREE_DEVTOOLS__ < `u` &&
                    __THREE_DEVTOOLS__.dispatchEvent(
                        new CustomEvent(`observe`, { detail: this }),
                    ));
        }
        get coordinateSystem() {
            return qe;
        }
        get outputColorSpace() {
            return this._outputColorSpace;
        }
        set outputColorSpace(e) {
            this._outputColorSpace = e;
            let t = this.getContext();
            ((t.drawingBufferColorSpace = X._getDrawingBufferColorSpace(e)),
                (t.unpackColorSpace = X._getUnpackColorSpace()));
        }
    },
    Pc = `assets/spritesheet-B2Kn5ehD.png`,
    Fc = {
        frames: {
            "anonymous.png": {
                frame: { x: 1, y: 1, w: 316, h: 418 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 316, h: 418 },
                sourceSize: { w: 316, h: 418 },
            },
            "anotherdayinparadise.png": {
                frame: { x: 319, y: 1, w: 527, h: 249 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 527, h: 249 },
                sourceSize: { w: 527, h: 249 },
            },
            "background.png": {
                frame: { x: 1, y: 421, w: 1920, h: 1080 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 1920, h: 1080 },
                sourceSize: { w: 1920, h: 1080 },
            },
            "code.png": {
                frame: { x: 1923, y: 1, w: 756, h: 755 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 756, h: 755 },
                sourceSize: { w: 756, h: 755 },
            },
            "fakenews.png": {
                frame: { x: 1, y: 1503, w: 1018, h: 626 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 1018, h: 626 },
                sourceSize: { w: 1018, h: 626 },
            },
            "justdoit.png": {
                frame: { x: 848, y: 1, w: 684, h: 196 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 684, h: 196 },
                sourceSize: { w: 684, h: 196 },
            },
            "sylvain.png": {
                frame: { x: 1923, y: 758, w: 756, h: 755 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 756, h: 755 },
                sourceSize: { w: 756, h: 755 },
            },
            "takeyourpill.png": {
                frame: { x: 1021, y: 1515, w: 604, h: 432 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 604, h: 432 },
                sourceSize: { w: 604, h: 432 },
            },
            "viruks.png": {
                frame: { x: 1534, y: 1, w: 294, h: 294 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 294, h: 294 },
                sourceSize: { w: 294, h: 294 },
            },
            "wtf.png": {
                frame: { x: 1627, y: 1515, w: 380, h: 121 },
                rotated: !1,
                trimmed: !1,
                spriteSourceSize: { x: 0, y: 0, w: 380, h: 121 },
                sourceSize: { w: 380, h: 121 },
            },
        },
        meta: {
            app: `https://www.codeandweb.com/texturepacker`,
            version: `1.0`,
            image: `spritesheet.png`,
            format: `RGBA8888`,
            size: { w: 2680, h: 2130 },
            scale: `1`,
            comment: `Created with TexturePacker Online (free version)
https://www.codeandweb.com/texturepacker-online

TexturePacker desktop offers better support for Pixi and Phaser with sprite trimming, better packing algorithms, hardware texture compression, and PNG optimization.
Try TexturePacker desktop: https://www.codeandweb.com/texturepacker`,
        },
    },
    Ic = class {
        texture;
        material;
        uvMap;
        maxInstances;
        constructor(e, t) {
            ((this.maxInstances = t), (this.uvMap = new Map()));
            let n = new Vi();
            ((this.texture = n.load(e)),
                (this.texture.colorSpace = Be),
                this.parseConfig(),
                this.createMaterial());
        }
        parseConfig() {
            let e = Fc.meta.size.w,
                t = Fc.meta.size.h;
            for (let [n, r] of Object.entries(Fc.frames)) {
                let { x: i, y: a, w: o, h: s } = r.frame;
                this.uvMap.set(n, {
                    uOffset: i / e,
                    vOffset: 1 - (a + s) / t,
                    uScale: o / e,
                    vScale: s / t,
                    w: o,
                    h: s,
                });
            }
        }
        createMaterial() {
            ((this.material = new wr({
                map: this.texture,
                transparent: !0,
                side: 2,
                depthWrite: !1,
            })),
                (this.material.onBeforeCompile = (e) => {
                    ((e.vertexShader =
                        `
                attribute vec4 aInstanceUV;
                varying vec4 vInstanceUV;
            ` + e.vertexShader),
                        (e.vertexShader = e.vertexShader.replace(
                            `#include <uv_vertex>`,
                            `
                #include <uv_vertex>
                vInstanceUV = aInstanceUV;
                `,
                        )),
                        (e.fragmentShader =
                            `
                varying vec4 vInstanceUV;
            ` + e.fragmentShader),
                        (e.fragmentShader = e.fragmentShader.replace(
                            `#include <map_fragment>`,
                            `
                #ifdef USE_MAP
                    // Apply our instance offset & scale to the varying UV
                    vec2 customMapUv = vMapUv * vInstanceUV.zw + vInstanceUV.xy;
                    
                    // Sample the texture using our custom coordinates
                    vec4 sampledDiffuseColor = texture2D( map, customMapUv );
                    
                    // Apply it to the material
                    diffuseColor *= sampledDiffuseColor;
                #endif
                `,
                        )));
                }));
        }
        setupGeometryAttributes(e) {
            let t = new Br(new Float32Array(this.maxInstances * 4), 4);
            e.setAttribute(`aInstanceUV`, t);
        }
        getUVBounds(e) {
            return this.uvMap.get(e);
        }
    },
    Lc = 1e5,
    Rc = new (class {
        instances;
        instanceCounters;
        recycledIds;
        atlas;
        constructor() {
            ((this.instances = new Map()),
                (this.instanceCounters = new Map()),
                (this.recycledIds = new Map()),
                (this.atlas = new Ic(Pc, Lc)),
                this.initialize());
        }
        initialize() {
            let e = new ci(1, 1);
            this.atlas.setupGeometryAttributes(e);
            let t = new Jr(e, this.atlas.material, Lc);
            (t.instanceMatrix.setUsage(Ke),
                (t.count = 0),
                this.instances.set(`window`, t),
                this.instanceCounters.set(`window`, 0),
                this.recycledIds.set(`window`, []),
                console.log(
                    `InstanceManager initialized with instances:`,
                    this.instances,
                ));
        }
        logState(e, t) {
            let n = this.instanceCounters.get(e),
                r = this.recycledIds.get(e),
                i = n - r.length;
            console.log(
                `[%c${t}%c] ${e.toUpperCase()} POOL -> Active: %c${i}%c | Generated: ${n}/${Lc} | Trash: [${r.join(`, `)}]`,
                `color: #00ff00; font-weight: bold;`,
                `color: inherit;`,
                `color: #00d2ff; font-weight: bold;`,
                `color: inherit;`,
            );
        }
        getSpriteSize(e) {
            let t = this.atlas.getUVBounds(e);
            return t ? { w: t.w, h: t.h } : { w: 100, h: 100 };
        }
        updateInstanceTexture(e, t, n) {
            let r = this.instances.get(e).geometry.getAttribute(`aInstanceUV`),
                i = this.atlas.getUVBounds(n);
            if (!i || !r) return;
            let a = t * 4;
            ((r.array[a] = i.uOffset),
                (r.array[a + 1] = i.vOffset),
                (r.array[a + 2] = i.uScale),
                (r.array[a + 3] = i.vScale),
                (r.needsUpdate = !0));
        }
        spawnInstance(e, t) {
            let n = this.instances.get(e),
                r = this.recycledIds.get(e),
                i = this.instanceCounters.get(e),
                a,
                o = !1;
            if (r.length > 0) ((a = r.pop()), (o = !0));
            else if (i < Lc)
                ((a = i),
                    this.instanceCounters.set(e, i + 1),
                    (n.count = i + 1));
            else
                return (
                    console.warn(`Limit reached for ${e}. Stopped spawning.`),
                    -1
                );
            return (
                n.setMatrixAt(a, t),
                (n.instanceMatrix.needsUpdate = !0),
                this.logState(e, o ? `RECYCLED SPAWN` : `NEW SPAWN`),
                a
            );
        }
        killInstance(e, t) {
            if (t === -1) return;
            let n = this.instances.get(e),
                r = new un();
            (r.scale.set(0, 0, 0),
                r.updateMatrix(),
                n.setMatrixAt(t, r.matrix),
                (n.instanceMatrix.needsUpdate = !0),
                this.recycledIds.get(e).push(t),
                this.logState(e, `KILLED & TRASHED`));
        }
        updateInstanceMatrix(e, t, n) {
            this.instances.get(e).setMatrixAt(t, n);
        }
        addToScene(e) {
            (this.instances.forEach((t) => {
                e.add(t);
            }),
                console.log(`Instanced meshes added to scene!`));
        }
    })(),
    zc = 0,
    Bc = class {
        scene;
        alive;
        animations;
        instanceType;
        instanceId;
        transform;
        baseWidth;
        baseHeight;
        scaleMultiplier;
        persistent;
        constructor(e) {
            ((this.scene = e),
                (this.alive = !1),
                (this.animations = []),
                (this.instanceType = null),
                (this.instanceId = -1),
                (this.transform = new un()),
                (this.baseWidth = 100),
                (this.baseHeight = 100),
                (this.scaleMultiplier = 1),
                (this.persistent = !1));
        }
        spawn(e, t) {
            if (!this.instanceType) return;
            console.log(`Spawning ${this.instanceType} at:`, e, t);
            let n = (zc % 400) * 0.01;
            (zc++,
                this.transform.position.set(e, t, n),
                this.transform.scale.set(1, 1, 1),
                this.transform.updateMatrix(),
                (this.instanceId = Rc.spawnInstance(
                    this.instanceType,
                    this.transform.matrix,
                )),
                this.instanceId !== -1 && (this.alive = !0));
        }
        setTextureKey(e) {
            if (!this.alive || this.instanceId === -1 || !this.instanceType)
                return;
            Rc.updateInstanceTexture(this.instanceType, this.instanceId, e);
            let t = Rc.getSpriteSize(e);
            ((this.baseWidth = t.w),
                (this.baseHeight = t.h),
                this.applyScale());
        }
        setMultiplier(e) {
            ((this.scaleMultiplier = e), this.applyScale());
        }
        applyScale() {
            !this.alive ||
                this.instanceId === -1 ||
                (this.transform.scale.set(
                    this.baseWidth * this.scaleMultiplier,
                    this.baseHeight * this.scaleMultiplier,
                    1,
                ),
                this.transform.updateMatrix(),
                Rc.updateInstanceMatrix(
                    this.instanceType,
                    this.instanceId,
                    this.transform.matrix,
                ));
        }
        kill() {
            !this.alive ||
                this.instanceId === -1 ||
                !this.instanceType ||
                ((this.alive = !1),
                Rc.killInstance(this.instanceType, this.instanceId),
                (this.instanceId = -1));
        }
        addAnimation(e) {
            this.animations.push(e);
        }
        update(e, t) {
            !this.alive ||
                this.instanceId === -1 ||
                !this.instanceType ||
                ((this.animations = this.animations.filter((e) => !e.done)),
                this.animations.length > 0 &&
                    (this.animations[0].update(e, this.transform, t),
                    this.transform.updateMatrix(),
                    Rc.updateInstanceMatrix(
                        this.instanceType,
                        this.instanceId,
                        this.transform.matrix,
                    )));
        }
    },
    Vc = class extends Bc {
        constructor(e) {
            (super(e), (this.instanceType = `window`));
        }
    },
    Hc = class {
        duration;
        elapsed;
        done;
        constructor(e) {
            ((this.duration = e), (this.elapsed = 0), (this.done = !1));
        }
        update(e, t, n) {
            ((this.elapsed = Math.min(this.elapsed + e, this.duration)),
                (this.done = this.elapsed >= this.duration),
                this.apply(this.elapsed / this.duration, t, n));
        }
        apply(e, t, n) {}
    },
    Uc = class extends Hc {
        originalScale = null;
        apply(e, t) {
            ((this.originalScale ||= t.scale.clone()),
                t.scale.set(0, 0, 0),
                this.done && t.scale.copy(this.originalScale));
        }
    },
    Wc = class extends Hc {
        intensity;
        pos;
        constructor(e, t, n) {
            (super(e), (this.intensity = t), (this.pos = n));
        }
        apply(e, t, n) {
            let r = this.intensity;
            if (n) {
                let e = n.volumeSmooth ** 4;
                r = this.intensity * e;
            }
            ((t.position.x = this.pos.x + (Math.random() - 0.5) * r),
                (t.position.y = this.pos.y + (Math.random() - 0.5) * r));
        }
    },
    Gc = class extends Hc {
        speed;
        constructor(e, t = 5) {
            (super(e), (this.speed = t));
        }
        apply(e, t) {
            t.rotation.z = this.elapsed * this.speed;
        }
    },
    Kc = class {
        scene;
        windows;
        kickCounter;
        hasTriggeredKick = !1;
        hasTriggeredHardKick = !1;
        constructor(e) {
            ((this.scene = e), (this.windows = []), (this.kickCounter = 0));
        }
        handleAudio(e, t) {
            (this.onVolume(e.volumeSmooth),
                e.kick > 0.5
                    ? (this.hasTriggeredKick ||= (this.onKick(e.kick), !0))
                    : (this.hasTriggeredKick = !1),
                e.kickHard > 0.9
                    ? (this.hasTriggeredHardKick ||=
                          (this.onHardKick(e.kickHard), !0))
                    : (this.hasTriggeredHardKick = !1));
            let n = e.volumeByFrequency,
                r = (e, t) => {
                    let r = 0;
                    for (let i = e; i < t; i++) r += n[i];
                    return r / (t - e);
                },
                i = r(0, 10),
                a = r(10, 100),
                o = r(100, 250);
            this.onFrequencies(i, a, o);
        }
        onVolume(e) {
            e > 0.98 &&
                (console.log(`Volume level:`, e.toFixed(3)),
                this.spawnMask(
                    (Math.random() - 0.5) * window.innerWidth,
                    (Math.random() - 0.5) * window.innerHeight,
                ));
        }
        onKick(e) {
            (this.kickCounter++,
                this.kickCounter === 5
                    ? this.spawnWave(
                          (Math.random() - 0.5) * window.innerWidth,
                          0,
                      )
                    : this.kickCounter >= 10 &&
                      (this.spawnCascade(
                          (Math.random() - 0.5) * window.innerWidth,
                          (Math.random() - 0.5) * window.innerHeight,
                      ),
                      (this.kickCounter = 0)));
        }
        onHardKick(e) {
            this.spawnVirus(
                (Math.random() - 0.5) * window.innerWidth,
                (Math.random() - 0.5) * window.innerHeight,
            );
        }
        onFrequencies(e, t, n) {
            (t > 0.6 &&
                (console.log(`Mids are strong! Spawning Mask. : `, t),
                this.spawnMask(
                    (Math.random() - 0.5) * window.innerWidth,
                    (Math.random() - 0.5) * window.innerHeight,
                )),
                n > 0.36 &&
                    (console.log(`highs: `, n),
                    this.spawnCluster(
                        (Math.random() - 0.5) * window.innerWidth,
                        (Math.random() - 0.5) * window.innerHeight,
                    )));
        }
        spawnBackground(e, t = 1) {
            console.log(`Spawning permanent background:`, e);
            let n = new Vc(this.scene);
            return (
                n.spawn(0, 0),
                n.setTextureKey(e),
                n.transform.scale.set(window.innerWidth, window.innerHeight, 1),
                n.transform.updateMatrix(),
                Rc.updateInstanceMatrix(
                    n.instanceType,
                    n.instanceId,
                    n.transform.matrix,
                ),
                (n.persistent = !0),
                this.windows.push(n),
                n
            );
        }
        spawnMask(e, t) {
            console.log(`Spawning Mask at:`, e, t);
            let n = new Vc(this.scene);
            return (
                n.spawn(e, t),
                n.setTextureKey(`anonymous.png`),
                n.setMultiplier(0.5),
                n.addAnimation(new Wc(1.5, 50, { x: e, y: t })),
                this.windows.push(n),
                n
            );
        }
        spawnVirus(e, t) {
            console.log(`Spawning Virus at:`, e, t);
            let n = new Vc(this.scene);
            return (
                n.spawn(e, t),
                n.setTextureKey(`viruks.png`),
                n.setMultiplier(0.4),
                n.addAnimation(new Gc(1, 20)),
                this.windows.push(n),
                n
            );
        }
        spawnCascade(e, t) {
            console.log(`Spawning Adware Cascade at:`, e, t);
            let n = Math.random() > 0.5 ? 1 : -1,
                r = Math.random() > 0.5 ? 1 : -1,
                i = [
                    { texture: `sylvain.png`, scale: 0.3 },
                    { texture: `takeyourpill.png`, scale: 0.7 },
                    { texture: `justdoit.png`, scale: 0.6 },
                    { texture: `anotherdayinparadise.png`, scale: 0.7 },
                ],
                a = i[Math.floor(Math.random() * i.length)];
            for (let i = 0; i < 15; i++) {
                let o = new Vc(this.scene);
                (o.spawn(e + i * 40 * n, t + i * 40 * r),
                    o.setTextureKey(a.texture),
                    o.setMultiplier(a.scale),
                    i > 0 && o.addAnimation(new Uc(i * 0.15)),
                    o.addAnimation(new Hc(1.5)),
                    o.update(0),
                    this.windows.push(o));
            }
        }
        spawnWave(e, t) {
            console.log(`Spawning Sine Wave at:`, e, t);
            let n = Math.random() > 0.5 ? 1 : -1,
                r = [
                    { texture: `sylvain.png`, scale: 0.3 },
                    { texture: `takeyourpill.png`, scale: 0.7 },
                    { texture: `justdoit.png`, scale: 0.6 },
                    { texture: `anotherdayinparadise.png`, scale: 0.7 },
                ],
                i = r[Math.floor(Math.random() * r.length)];
            for (let r = 0; r < 25; r++) {
                let a = new Vc(this.scene),
                    o = e + r * 40 * n,
                    s = t + Math.sin(r * 0.4) * 200;
                (a.spawn(o, s),
                    a.setTextureKey(i.texture),
                    a.setMultiplier(i.scale),
                    r > 0 && a.addAnimation(new Uc(r * 0.08)),
                    a.addAnimation(new Hc(1.5)),
                    a.update(0),
                    this.windows.push(a));
            }
        }
        spawnCluster(e, t) {
            console.log(`Spawning Adware Cluster at:`, e, t);
            let n = Math.floor(Math.random() * 2) + 2;
            for (let r = 0; r < n; r++) {
                let n = new Vc(this.scene),
                    i = (Math.random() - 0.5) * 250,
                    a = (Math.random() - 0.5) * 250;
                (n.spawn(e + i, t + a),
                    n.setTextureKey(`fakenews.png`),
                    n.setMultiplier(0.3),
                    n.addAnimation(new Hc(1 + r * 0.1)),
                    this.windows.push(n));
            }
        }
        update(e, t) {
            (this.windows.forEach((n) => {
                (n.update(e, t),
                    n.alive &&
                        !n.persistent &&
                        n.animations.length === 0 &&
                        n.kill());
            }),
                (this.windows = this.windows.filter((e) => e.alive)),
                t && this.handleAudio(t, e),
                Rc.instances.get(`window`) &&
                    (Rc.instances.get(`window`).instanceMatrix.needsUpdate =
                        !0));
        }
    },
    qc = {
        uniforms: {
            tDiffuse: { value: null },
            uTime: { value: 0 },
            uResolution: { value: new q() },
        },
        vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
        fragmentShader: `
    uniform sampler2D tDiffuse; // Changed from uTexture to tDiffuse
    uniform float uTime;
    uniform vec2 uResolution;
    
    varying vec2 vUv; // Input from the vertex shader

    // Function to generate pseudo-random numbers
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv; // Use the varying instead of gl_FragCoord

      // Add periodic interference effect to the y-coordinate
      float intensity = abs(sin(uTime * 0.2)); // Control the appearance with a sine function
      if (intensity > 0.998) { // Only apply the effect when the intensity is high
        float noise = random(vec2(uv.y * 100.0, uTime));  // Random noise based on y coordinate and time
        float glitchOffset = (noise - 0.5) * 0.05 * intensity;  // Center noise around 0 and scale
        uv.y += glitchOffset;
      } else {
        // Add interference effect to the y-coordinate
        float noise = random(vec2(uv.y * 0.01, uTime));  // Random noise based on y coordinate and time
        float glitchOffset = (noise - 0.5) * 0.008;  // Center noise around 0 and scale
        uv.y += glitchOffset;
      }

      // Convex curvature
      vec2 p = uv * 2.0 - 1.0;
      vec2 offset = abs(p.yx) / vec2(6.0, 4.0);
      p = p + p * offset * offset;
      p = p * 0.5 + 0.5;

      // Chromatic aberration
      vec2 offsetR = vec2(0.002, 0.0); // Red channel offset
      vec2 offsetB = vec2(-0.002, 0.0); // Blue channel offset

      vec3 color;
      color.r = texture2D(tDiffuse, p + offsetR).r;
      color.g = texture2D(tDiffuse, p).g;
      color.b = texture2D(tDiffuse, p + offsetB).b;

      // Scanlines
      float scanlineIntensity = 0.02;
      float scanline = sin((gl_FragCoord.y + uTime * 30.0) * 1.0) * scanlineIntensity; // Increased speed by multiplying uTime
      color -= scanline;
      
      // Black out out-of-bounds pixels
      if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) {
        color = vec3(0.0, 0.0, 0.0);
      }

      // Vignette
      float vignette = p.x * p.y * (1.0 - p.x) * (1.0 - p.y);
      vignette = clamp(pow(16.0 * vignette, 0.3), 0.0, 1.0);
      color *= vignette;

      gl_FragColor = vec4(color, 1.0); // Use gl_FragColor for the final output
    }
  `,
    },
    Jc = {
        name: `CopyShader`,
        uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } },
        vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
        fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`,
    },
    Yc = class {
        constructor() {
            ((this.isPass = !0),
                (this.enabled = !0),
                (this.needsSwap = !0),
                (this.clear = !1),
                (this.renderToScreen = !1));
        }
        setSize() {}
        render() {
            console.error(
                `THREE.Pass: .render() must be implemented in derived pass.`,
            );
        }
        dispose() {}
    },
    Xc = new Xi(-1, 1, 1, -1, 0, 1),
    Zc = new (class extends pr {
        constructor() {
            (super(),
                this.setAttribute(
                    `position`,
                    new tr([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
                ),
                this.setAttribute(`uv`, new tr([0, 2, 0, 0, 2, 0], 2)));
        }
    })(),
    Qc = class {
        constructor(e) {
            this._mesh = new Ir(Zc, e);
        }
        dispose() {
            this._mesh.geometry.dispose();
        }
        render(e) {
            e.render(this._mesh, Xc);
        }
        get material() {
            return this._mesh.material;
        }
        set material(e) {
            this._mesh.material = e;
        }
    },
    $c = class extends Yc {
        constructor(e, t = `tDiffuse`) {
            (super(),
                (this.textureID = t),
                (this.uniforms = null),
                (this.material = null),
                e instanceof _i
                    ? ((this.uniforms = e.uniforms), (this.material = e))
                    : e &&
                      ((this.uniforms = mi.clone(e.uniforms)),
                      (this.material = new _i({
                          name: e.name === void 0 ? `unspecified` : e.name,
                          defines: Object.assign({}, e.defines),
                          uniforms: this.uniforms,
                          vertexShader: e.vertexShader,
                          fragmentShader: e.fragmentShader,
                      }))),
                (this._fsQuad = new Qc(this.material)));
        }
        render(e, t, n) {
            (this.uniforms[this.textureID] &&
                (this.uniforms[this.textureID].value = n.texture),
                (this._fsQuad.material = this.material),
                this.renderToScreen
                    ? (e.setRenderTarget(null), this._fsQuad.render(e))
                    : (e.setRenderTarget(t),
                      this.clear &&
                          e.clear(
                              e.autoClearColor,
                              e.autoClearDepth,
                              e.autoClearStencil,
                          ),
                      this._fsQuad.render(e)));
        }
        dispose() {
            (this.material.dispose(), this._fsQuad.dispose());
        }
    },
    el = class extends Yc {
        constructor(e, t) {
            (super(),
                (this.scene = e),
                (this.camera = t),
                (this.clear = !0),
                (this.needsSwap = !1),
                (this.inverse = !1));
        }
        render(e, t, n) {
            let r = e.getContext(),
                i = e.state;
            (i.buffers.color.setMask(!1),
                i.buffers.depth.setMask(!1),
                i.buffers.color.setLocked(!0),
                i.buffers.depth.setLocked(!0));
            let a, o;
            (this.inverse ? ((a = 0), (o = 1)) : ((a = 1), (o = 0)),
                i.buffers.stencil.setTest(!0),
                i.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE),
                i.buffers.stencil.setFunc(r.ALWAYS, a, 4294967295),
                i.buffers.stencil.setClear(o),
                i.buffers.stencil.setLocked(!0),
                e.setRenderTarget(n),
                this.clear && e.clear(),
                e.render(this.scene, this.camera),
                e.setRenderTarget(t),
                this.clear && e.clear(),
                e.render(this.scene, this.camera),
                i.buffers.color.setLocked(!1),
                i.buffers.depth.setLocked(!1),
                i.buffers.color.setMask(!0),
                i.buffers.depth.setMask(!0),
                i.buffers.stencil.setLocked(!1),
                i.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295),
                i.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP),
                i.buffers.stencil.setLocked(!0));
        }
    },
    tl = class extends Yc {
        constructor() {
            (super(), (this.needsSwap = !1));
        }
        render(e) {
            (e.state.buffers.stencil.setLocked(!1),
                e.state.buffers.stencil.setTest(!1));
        }
    },
    nl = class {
        constructor(e, t) {
            if (
                ((this.renderer = e),
                (this._pixelRatio = e.getPixelRatio()),
                t === void 0)
            ) {
                let n = e.getSize(new q());
                ((this._width = n.width),
                    (this._height = n.height),
                    (t = new Nt(
                        this._width * this._pixelRatio,
                        this._height * this._pixelRatio,
                        { type: w },
                    )),
                    (t.texture.name = `EffectComposer.rt1`));
            } else ((this._width = t.width), (this._height = t.height));
            ((this.renderTarget1 = t),
                (this.renderTarget2 = t.clone()),
                (this.renderTarget2.texture.name = `EffectComposer.rt2`),
                (this.writeBuffer = this.renderTarget1),
                (this.readBuffer = this.renderTarget2),
                (this.renderToScreen = !0),
                (this.passes = []),
                (this.copyPass = new $c(Jc)),
                (this.copyPass.material.blending = 0),
                (this.timer = new ta()));
        }
        swapBuffers() {
            let e = this.readBuffer;
            ((this.readBuffer = this.writeBuffer), (this.writeBuffer = e));
        }
        addPass(e) {
            (this.passes.push(e),
                e.setSize(
                    this._width * this._pixelRatio,
                    this._height * this._pixelRatio,
                ));
        }
        insertPass(e, t) {
            (this.passes.splice(t, 0, e),
                e.setSize(
                    this._width * this._pixelRatio,
                    this._height * this._pixelRatio,
                ));
        }
        removePass(e) {
            let t = this.passes.indexOf(e);
            t !== -1 && this.passes.splice(t, 1);
        }
        isLastEnabledPass(e) {
            for (let t = e + 1; t < this.passes.length; t++)
                if (this.passes[t].enabled) return !1;
            return !0;
        }
        render(e) {
            (this.timer.update(), e === void 0 && (e = this.timer.getDelta()));
            let t = this.renderer.getRenderTarget(),
                n = !1;
            for (let t = 0, r = this.passes.length; t < r; t++) {
                let r = this.passes[t];
                if (r.enabled !== !1) {
                    if (
                        ((r.renderToScreen =
                            this.renderToScreen && this.isLastEnabledPass(t)),
                        r.render(
                            this.renderer,
                            this.writeBuffer,
                            this.readBuffer,
                            e,
                            n,
                        ),
                        r.needsSwap)
                    ) {
                        if (n) {
                            let t = this.renderer.getContext(),
                                n = this.renderer.state.buffers.stencil;
                            (n.setFunc(t.NOTEQUAL, 1, 4294967295),
                                this.copyPass.render(
                                    this.renderer,
                                    this.writeBuffer,
                                    this.readBuffer,
                                    e,
                                ),
                                n.setFunc(t.EQUAL, 1, 4294967295));
                        }
                        this.swapBuffers();
                    }
                    el !== void 0 &&
                        (r instanceof el
                            ? (n = !0)
                            : r instanceof tl && (n = !1));
                }
            }
            this.renderer.setRenderTarget(t);
        }
        reset(e) {
            if (e === void 0) {
                let t = this.renderer.getSize(new q());
                ((this._pixelRatio = this.renderer.getPixelRatio()),
                    (this._width = t.width),
                    (this._height = t.height),
                    (e = this.renderTarget1.clone()),
                    e.setSize(
                        this._width * this._pixelRatio,
                        this._height * this._pixelRatio,
                    ));
            }
            (this.renderTarget1.dispose(),
                this.renderTarget2.dispose(),
                (this.renderTarget1 = e),
                (this.renderTarget2 = e.clone()),
                (this.writeBuffer = this.renderTarget1),
                (this.readBuffer = this.renderTarget2));
        }
        setSize(e, t) {
            ((this._width = e), (this._height = t));
            let n = this._width * this._pixelRatio,
                r = this._height * this._pixelRatio;
            (this.renderTarget1.setSize(n, r),
                this.renderTarget2.setSize(n, r));
            for (let e = 0; e < this.passes.length; e++)
                this.passes[e].setSize(n, r);
        }
        setPixelRatio(e) {
            ((this._pixelRatio = e), this.setSize(this._width, this._height));
        }
        dispose() {
            (this.renderTarget1.dispose(),
                this.renderTarget2.dispose(),
                this.copyPass.dispose());
        }
    },
    rl = class extends Yc {
        constructor(e, t, n = null, r = null, i = null) {
            (super(),
                (this.scene = e),
                (this.camera = t),
                (this.overrideMaterial = n),
                (this.clearColor = r),
                (this.clearAlpha = i),
                (this.clear = !0),
                (this.clearDepth = !1),
                (this.needsSwap = !1),
                (this.isRenderPass = !0),
                (this._oldClearColor = new Z()));
        }
        render(e, t, n) {
            let r = e.autoClear;
            e.autoClear = !1;
            let i, a;
            (this.overrideMaterial !== null &&
                ((a = this.scene.overrideMaterial),
                (this.scene.overrideMaterial = this.overrideMaterial)),
                this.clearColor !== null &&
                    (e.getClearColor(this._oldClearColor),
                    e.setClearColor(this.clearColor, e.getClearAlpha())),
                this.clearAlpha !== null &&
                    ((i = e.getClearAlpha()), e.setClearAlpha(this.clearAlpha)),
                this.clearDepth == 1 && e.clearDepth(),
                e.setRenderTarget(this.renderToScreen ? null : n),
                this.clear === !0 &&
                    e.clear(
                        e.autoClearColor,
                        e.autoClearDepth,
                        e.autoClearStencil,
                    ),
                e.render(this.scene, this.camera),
                this.clearColor !== null &&
                    e.setClearColor(this._oldClearColor),
                this.clearAlpha !== null && e.setClearAlpha(i),
                this.overrideMaterial !== null &&
                    (this.scene.overrideMaterial = a),
                (e.autoClear = r));
        }
    },
    il = {
        name: `OutputShader`,
        uniforms: {
            tDiffuse: { value: null },
            toneMappingExposure: { value: 1 },
        },
        vertexShader: `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
        fragmentShader: `

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`,
    },
    al = class extends Yc {
        constructor() {
            (super(),
                (this.isOutputPass = !0),
                (this.uniforms = mi.clone(il.uniforms)),
                (this.material = new vi({
                    name: il.name,
                    uniforms: this.uniforms,
                    vertexShader: il.vertexShader,
                    fragmentShader: il.fragmentShader,
                })),
                (this._fsQuad = new Qc(this.material)),
                (this._outputColorSpace = null),
                (this._toneMapping = null));
        }
        render(e, t, n) {
            ((this.uniforms.tDiffuse.value = n.texture),
                (this.uniforms.toneMappingExposure.value =
                    e.toneMappingExposure),
                (this._outputColorSpace !== e.outputColorSpace ||
                    this._toneMapping !== e.toneMapping) &&
                    ((this._outputColorSpace = e.outputColorSpace),
                    (this._toneMapping = e.toneMapping),
                    (this.material.defines = {}),
                    X.getTransfer(this._outputColorSpace) === `srgb` &&
                        (this.material.defines.SRGB_TRANSFER = ``),
                    this._toneMapping === 1
                        ? (this.material.defines.LINEAR_TONE_MAPPING = ``)
                        : this._toneMapping === 2
                          ? (this.material.defines.REINHARD_TONE_MAPPING = ``)
                          : this._toneMapping === 3
                            ? (this.material.defines.CINEON_TONE_MAPPING = ``)
                            : this._toneMapping === 4
                              ? (this.material.defines.ACES_FILMIC_TONE_MAPPING = ``)
                              : this._toneMapping === 6
                                ? (this.material.defines.AGX_TONE_MAPPING = ``)
                                : this._toneMapping === 7
                                  ? (this.material.defines.NEUTRAL_TONE_MAPPING = ``)
                                  : this._toneMapping === 5 &&
                                    (this.material.defines.CUSTOM_TONE_MAPPING = ``),
                    (this.material.needsUpdate = !0)),
                this.renderToScreen === !0
                    ? (e.setRenderTarget(null), this._fsQuad.render(e))
                    : (e.setRenderTarget(t),
                      this.clear &&
                          e.clear(
                              e.autoClearColor,
                              e.autoClearDepth,
                              e.autoClearStencil,
                          ),
                      this._fsQuad.render(e)));
        }
        dispose() {
            (this.material.dispose(), this._fsQuad.dispose());
        }
    },
    ol = {
        name: `LuminosityHighPassShader`,
        uniforms: {
            tDiffuse: { value: null },
            luminosityThreshold: { value: 1 },
            smoothWidth: { value: 1 },
            defaultColor: { value: new Z(0) },
            defaultOpacity: { value: 0 },
        },
        vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
        fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`,
    },
    sl = class e extends Yc {
        constructor(e, t = 1, n, r) {
            (super(),
                (this.strength = t),
                (this.radius = n),
                (this.threshold = r),
                (this.resolution =
                    e === void 0 ? new q(256, 256) : new q(e.x, e.y)),
                (this.clearColor = new Z(0, 0, 0)),
                (this.needsSwap = !1),
                (this.renderTargetsHorizontal = []),
                (this.renderTargetsVertical = []),
                (this.nMips = 5));
            let i = Math.round(this.resolution.x / 2),
                a = Math.round(this.resolution.y / 2);
            ((this.renderTargetBright = new Nt(i, a, { type: w })),
                (this.renderTargetBright.texture.name = `UnrealBloomPass.bright`),
                (this.renderTargetBright.texture.generateMipmaps = !1));
            for (let e = 0; e < this.nMips; e++) {
                let t = new Nt(i, a, { type: w });
                ((t.texture.name = `UnrealBloomPass.h` + e),
                    (t.texture.generateMipmaps = !1),
                    this.renderTargetsHorizontal.push(t));
                let n = new Nt(i, a, { type: w });
                ((n.texture.name = `UnrealBloomPass.v` + e),
                    (n.texture.generateMipmaps = !1),
                    this.renderTargetsVertical.push(n),
                    (i = Math.round(i / 2)),
                    (a = Math.round(a / 2)));
            }
            let o = ol;
            ((this.highPassUniforms = mi.clone(o.uniforms)),
                (this.highPassUniforms.luminosityThreshold.value = r),
                (this.highPassUniforms.smoothWidth.value = 0.01),
                (this.materialHighPassFilter = new _i({
                    uniforms: this.highPassUniforms,
                    vertexShader: o.vertexShader,
                    fragmentShader: o.fragmentShader,
                })),
                (this.separableBlurMaterials = []));
            let s = [6, 10, 14, 18, 22];
            ((i = Math.round(this.resolution.x / 2)),
                (a = Math.round(this.resolution.y / 2)));
            for (let e = 0; e < this.nMips; e++)
                (this.separableBlurMaterials.push(
                    this._getSeparableBlurMaterial(s[e]),
                ),
                    (this.separableBlurMaterials[e].uniforms.invSize.value =
                        new q(1 / i, 1 / a)),
                    (i = Math.round(i / 2)),
                    (a = Math.round(a / 2)));
            ((this.compositeMaterial = this._getCompositeMaterial(this.nMips)),
                (this.compositeMaterial.uniforms.blurTexture1.value =
                    this.renderTargetsVertical[0].texture),
                (this.compositeMaterial.uniforms.blurTexture2.value =
                    this.renderTargetsVertical[1].texture),
                (this.compositeMaterial.uniforms.blurTexture3.value =
                    this.renderTargetsVertical[2].texture),
                (this.compositeMaterial.uniforms.blurTexture4.value =
                    this.renderTargetsVertical[3].texture),
                (this.compositeMaterial.uniforms.blurTexture5.value =
                    this.renderTargetsVertical[4].texture),
                (this.compositeMaterial.uniforms.bloomStrength.value = t),
                (this.compositeMaterial.uniforms.bloomRadius.value = 0.1));
            let c = [1, 0.8, 0.6, 0.4, 0.2];
            ((this.compositeMaterial.uniforms.bloomFactors.value = c),
                (this.bloomTintColors = [
                    new J(1, 1, 1),
                    new J(1, 1, 1),
                    new J(1, 1, 1),
                    new J(1, 1, 1),
                    new J(1, 1, 1),
                ]),
                (this.compositeMaterial.uniforms.bloomTintColors.value =
                    this.bloomTintColors),
                (this.copyUniforms = mi.clone(Jc.uniforms)),
                (this.blendMaterial = new _i({
                    uniforms: this.copyUniforms,
                    vertexShader: Jc.vertexShader,
                    fragmentShader: Jc.fragmentShader,
                    premultipliedAlpha: !0,
                    blending: 2,
                    depthTest: !1,
                    depthWrite: !1,
                    transparent: !0,
                })),
                (this._oldClearColor = new Z()),
                (this._oldClearAlpha = 1),
                (this._basic = new wr()),
                (this._fsQuad = new Qc(null)));
        }
        dispose() {
            for (let e = 0; e < this.renderTargetsHorizontal.length; e++)
                this.renderTargetsHorizontal[e].dispose();
            for (let e = 0; e < this.renderTargetsVertical.length; e++)
                this.renderTargetsVertical[e].dispose();
            this.renderTargetBright.dispose();
            for (let e = 0; e < this.separableBlurMaterials.length; e++)
                this.separableBlurMaterials[e].dispose();
            (this.compositeMaterial.dispose(),
                this.blendMaterial.dispose(),
                this._basic.dispose(),
                this._fsQuad.dispose());
        }
        setSize(e, t) {
            let n = Math.round(e / 2),
                r = Math.round(t / 2);
            this.renderTargetBright.setSize(n, r);
            for (let e = 0; e < this.nMips; e++)
                (this.renderTargetsHorizontal[e].setSize(n, r),
                    this.renderTargetsVertical[e].setSize(n, r),
                    (this.separableBlurMaterials[e].uniforms.invSize.value =
                        new q(1 / n, 1 / r)),
                    (n = Math.round(n / 2)),
                    (r = Math.round(r / 2)));
        }
        render(t, n, r, i, a) {
            (t.getClearColor(this._oldClearColor),
                (this._oldClearAlpha = t.getClearAlpha()));
            let o = t.autoClear;
            ((t.autoClear = !1),
                t.setClearColor(this.clearColor, 0),
                a && t.state.buffers.stencil.setTest(!1),
                this.renderToScreen &&
                    ((this._fsQuad.material = this._basic),
                    (this._basic.map = r.texture),
                    t.setRenderTarget(null),
                    t.clear(),
                    this._fsQuad.render(t)),
                (this.highPassUniforms.tDiffuse.value = r.texture),
                (this.highPassUniforms.luminosityThreshold.value =
                    this.threshold),
                (this._fsQuad.material = this.materialHighPassFilter),
                t.setRenderTarget(this.renderTargetBright),
                t.clear(),
                this._fsQuad.render(t));
            let s = this.renderTargetBright;
            for (let n = 0; n < this.nMips; n++)
                ((this._fsQuad.material = this.separableBlurMaterials[n]),
                    (this.separableBlurMaterials[
                        n
                    ].uniforms.colorTexture.value = s.texture),
                    (this.separableBlurMaterials[n].uniforms.direction.value =
                        e.BlurDirectionX),
                    t.setRenderTarget(this.renderTargetsHorizontal[n]),
                    t.clear(),
                    this._fsQuad.render(t),
                    (this.separableBlurMaterials[
                        n
                    ].uniforms.colorTexture.value =
                        this.renderTargetsHorizontal[n].texture),
                    (this.separableBlurMaterials[n].uniforms.direction.value =
                        e.BlurDirectionY),
                    t.setRenderTarget(this.renderTargetsVertical[n]),
                    t.clear(),
                    this._fsQuad.render(t),
                    (s = this.renderTargetsVertical[n]));
            ((this._fsQuad.material = this.compositeMaterial),
                (this.compositeMaterial.uniforms.bloomStrength.value =
                    this.strength),
                (this.compositeMaterial.uniforms.bloomRadius.value =
                    this.radius),
                (this.compositeMaterial.uniforms.bloomTintColors.value =
                    this.bloomTintColors),
                t.setRenderTarget(this.renderTargetsHorizontal[0]),
                t.clear(),
                this._fsQuad.render(t),
                (this._fsQuad.material = this.blendMaterial),
                (this.copyUniforms.tDiffuse.value =
                    this.renderTargetsHorizontal[0].texture),
                a && t.state.buffers.stencil.setTest(!0),
                this.renderToScreen
                    ? (t.setRenderTarget(null), this._fsQuad.render(t))
                    : (t.setRenderTarget(r), this._fsQuad.render(t)),
                t.setClearColor(this._oldClearColor, this._oldClearAlpha),
                (t.autoClear = o));
        }
        _getSeparableBlurMaterial(e) {
            let t = [],
                n = e / 3;
            for (let r = 0; r < e; r++)
                t.push((0.39894 * Math.exp((-0.5 * r * r) / (n * n))) / n);
            return new _i({
                defines: { KERNEL_RADIUS: e },
                uniforms: {
                    colorTexture: { value: null },
                    invSize: { value: new q(0.5, 0.5) },
                    direction: { value: new q(0.5, 0.5) },
                    gaussianCoefficients: { value: t },
                },
                vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
                fragmentShader: `

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`,
            });
        }
        _getCompositeMaterial(e) {
            return new _i({
                defines: { NUM_MIPS: e },
                uniforms: {
                    blurTexture1: { value: null },
                    blurTexture2: { value: null },
                    blurTexture3: { value: null },
                    blurTexture4: { value: null },
                    blurTexture5: { value: null },
                    bloomStrength: { value: 1 },
                    bloomFactors: { value: null },
                    bloomTintColors: { value: null },
                    bloomRadius: { value: 0 },
                },
                vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
                fragmentShader: `

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`,
            });
        }
    };
((sl.BlurDirectionX = new q(1, 0)), (sl.BlurDirectionY = new q(0, 1)));
var cl = {
        name: `HalftoneShader`,
        uniforms: {
            tDiffuse: { value: null },
            shape: { value: 1 },
            radius: { value: 4 },
            rotateR: { value: (Math.PI / 12) * 1 },
            rotateG: { value: (Math.PI / 12) * 2 },
            rotateB: { value: (Math.PI / 12) * 3 },
            scatter: { value: 0 },
            width: { value: 1 },
            height: { value: 1 },
            blending: { value: 1 },
            blendingMode: { value: 1 },
            greyscale: { value: !1 },
            disable: { value: !1 },
        },
        vertexShader: `

		varying vec2 vUV;

		void main() {

			vUV = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

		}`,
        fragmentShader: `

		#define SQRT2_MINUS_ONE 0.41421356
		#define SQRT2_HALF_MINUS_ONE 0.20710678
		#define PI 3.14159265
		#define PI2 6.28318531
		#define SHAPE_DOT 1
		#define SHAPE_ELLIPSE 2
		#define SHAPE_LINE 3
		#define SHAPE_SQUARE 4
		#define SHAPE_DIAMOND 5
		#define BLENDING_LINEAR 1
		#define BLENDING_MULTIPLY 2
		#define BLENDING_ADD 3
		#define BLENDING_LIGHTER 4
		#define BLENDING_DARKER 5
		uniform sampler2D tDiffuse;
		uniform float radius;
		uniform float rotateR;
		uniform float rotateG;
		uniform float rotateB;
		uniform float scatter;
		uniform float width;
		uniform float height;
		uniform int shape;
		uniform bool disable;
		uniform float blending;
		uniform int blendingMode;
		varying vec2 vUV;
		uniform bool greyscale;
		const int samples = 8;

		float blend( float a, float b, float t ) {

		// linear blend
			return a * ( 1.0 - t ) + b * t;

		}

		float hypot( float x, float y ) {

		// vector magnitude
			return sqrt( x * x + y * y );

		}

		float rand( vec2 seed ){

		// get pseudo-random number
			return fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

		}

		float distanceToDotRadius( float channel, vec2 coord, vec2 normal, vec2 p, float angle, float rad_max ) {

		// apply shape-specific transforms
			float dist = hypot( coord.x - p.x, coord.y - p.y );
			float rad = channel;

			if ( shape == SHAPE_DOT ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

			} else if ( shape == SHAPE_ELLIPSE ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

				if ( dist != 0.0 ) {
					float dot_p = abs( ( p.x - coord.x ) / dist * normal.x + ( p.y - coord.y ) / dist * normal.y );
					dist = ( dist * ( 1.0 - SQRT2_HALF_MINUS_ONE ) ) + dot_p * dist * SQRT2_MINUS_ONE;
				}

			} else if ( shape == SHAPE_LINE ) {

				rad = pow( abs( rad ), 1.5) * rad_max;
				float dot_p = ( p.x - coord.x ) * normal.x + ( p.y - coord.y ) * normal.y;
				dist = hypot( normal.x * dot_p, normal.y * dot_p );

			} else if ( shape == SHAPE_SQUARE ) {

				float theta = atan( p.y - coord.y, p.x - coord.x ) - angle;
				float sin_t = abs( sin( theta ) );
				float cos_t = abs( cos( theta ) );
				rad = pow( abs( rad ), 1.4 );
				rad = rad_max * ( rad + ( ( sin_t > cos_t ) ? rad - sin_t * rad : rad - cos_t * rad ) );

			} else if ( shape == SHAPE_DIAMOND ) {

				float angle45 = PI / 4.0;
				float theta = atan( p.y - coord.y, p.x - coord.x ) - angle - angle45;
				float sin_t = abs( sin( theta ) );
				float cos_t = abs( cos( theta ) );
				rad = pow( abs( rad ), 1.4 );
				rad = rad_max * ( rad + ( ( sin_t > cos_t ) ? rad - sin_t * rad : rad - cos_t * rad ) );

			}

			return rad - dist;

		}

		struct Cell {

		// grid sample positions
			vec2 normal;
			vec2 p1;
			vec2 p2;
			vec2 p3;
			vec2 p4;
			float samp2;
			float samp1;
			float samp3;
			float samp4;

		};

		vec4 getSample( vec2 point ) {

		// multi-sampled point
			vec4 tex = texture2D( tDiffuse, vec2( point.x / width, point.y / height ) );
			float base = rand( vec2( floor( point.x ), floor( point.y ) ) ) * PI2;
			float step = PI2 / float( samples );
			float dist = radius * 0.66;

			for ( int i = 0; i < samples; ++i ) {

				float r = base + step * float( i );
				vec2 coord = point + vec2( cos( r ) * dist, sin( r ) * dist );
				tex += texture2D( tDiffuse, vec2( coord.x / width, coord.y / height ) );

			}

			tex /= float( samples ) + 1.0;
			return tex;

		}

		float getDotColour( Cell c, vec2 p, int channel, float angle, float aa ) {

		// get colour for given point
			float dist_c_1, dist_c_2, dist_c_3, dist_c_4, res;

			if ( channel == 0 ) {

				c.samp1 = getSample( c.p1 ).r;
				c.samp2 = getSample( c.p2 ).r;
				c.samp3 = getSample( c.p3 ).r;
				c.samp4 = getSample( c.p4 ).r;

			} else if (channel == 1) {

				c.samp1 = getSample( c.p1 ).g;
				c.samp2 = getSample( c.p2 ).g;
				c.samp3 = getSample( c.p3 ).g;
				c.samp4 = getSample( c.p4 ).g;

			} else {

				c.samp1 = getSample( c.p1 ).b;
				c.samp3 = getSample( c.p3 ).b;
				c.samp2 = getSample( c.p2 ).b;
				c.samp4 = getSample( c.p4 ).b;

			}

			dist_c_1 = distanceToDotRadius( c.samp1, c.p1, c.normal, p, angle, radius );
			dist_c_2 = distanceToDotRadius( c.samp2, c.p2, c.normal, p, angle, radius );
			dist_c_3 = distanceToDotRadius( c.samp3, c.p3, c.normal, p, angle, radius );
			dist_c_4 = distanceToDotRadius( c.samp4, c.p4, c.normal, p, angle, radius );
			res = ( dist_c_1 > 0.0 ) ? clamp( dist_c_1 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_2 > 0.0 ) ? clamp( dist_c_2 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_3 > 0.0 ) ? clamp( dist_c_3 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_4 > 0.0 ) ? clamp( dist_c_4 / aa, 0.0, 1.0 ) : 0.0;
			res = clamp( res, 0.0, 1.0 );

			return res;

		}

		Cell getReferenceCell( vec2 p, vec2 origin, float grid_angle, float step ) {

		// get containing cell
			Cell c;

		// calc grid
			vec2 n = vec2( cos( grid_angle ), sin( grid_angle ) );
			float threshold = step * 0.5;
			float dot_normal = n.x * ( p.x - origin.x ) + n.y * ( p.y - origin.y );
			float dot_line = -n.y * ( p.x - origin.x ) + n.x * ( p.y - origin.y );
			vec2 offset = vec2( n.x * dot_normal, n.y * dot_normal );
			float offset_normal = mod( hypot( offset.x, offset.y ), step );
			float normal_dir = ( dot_normal < 0.0 ) ? 1.0 : -1.0;
			float normal_scale = ( ( offset_normal < threshold ) ? -offset_normal : step - offset_normal ) * normal_dir;
			float offset_line = mod( hypot( ( p.x - offset.x ) - origin.x, ( p.y - offset.y ) - origin.y ), step );
			float line_dir = ( dot_line < 0.0 ) ? 1.0 : -1.0;
			float line_scale = ( ( offset_line < threshold ) ? -offset_line : step - offset_line ) * line_dir;

		// get closest corner
			c.normal = n;
			c.p1.x = p.x - n.x * normal_scale + n.y * line_scale;
			c.p1.y = p.y - n.y * normal_scale - n.x * line_scale;

		// scatter
			if ( scatter != 0.0 ) {

				float off_mag = scatter * threshold * 0.5;
				float off_angle = rand( vec2( floor( c.p1.x ), floor( c.p1.y ) ) ) * PI2;
				c.p1.x += cos( off_angle ) * off_mag;
				c.p1.y += sin( off_angle ) * off_mag;

			}

		// find corners
			float normal_step = normal_dir * ( ( offset_normal < threshold ) ? step : -step );
			float line_step = line_dir * ( ( offset_line < threshold ) ? step : -step );
			c.p2.x = c.p1.x - n.x * normal_step;
			c.p2.y = c.p1.y - n.y * normal_step;
			c.p3.x = c.p1.x + n.y * line_step;
			c.p3.y = c.p1.y - n.x * line_step;
			c.p4.x = c.p1.x - n.x * normal_step + n.y * line_step;
			c.p4.y = c.p1.y - n.y * normal_step - n.x * line_step;

			return c;

		}

		float blendColour( float a, float b, float t ) {

		// blend colours
			if ( blendingMode == BLENDING_LINEAR ) {
				return blend( a, b, 1.0 - t );
			} else if ( blendingMode == BLENDING_ADD ) {
				return blend( a, min( 1.0, a + b ), t );
			} else if ( blendingMode == BLENDING_MULTIPLY ) {
				return blend( a, max( 0.0, a * b ), t );
			} else if ( blendingMode == BLENDING_LIGHTER ) {
				return blend( a, max( a, b ), t );
			} else if ( blendingMode == BLENDING_DARKER ) {
				return blend( a, min( a, b ), t );
			} else {
				return blend( a, b, 1.0 - t );
			}

		}

		void main() {

			if ( ! disable ) {

		// setup
				vec2 p = vec2( vUV.x * width, vUV.y * height );
				vec2 origin = vec2( 0, 0 );
				float aa = ( radius < 2.5 ) ? radius * 0.5 : 1.25;

		// get channel samples
				Cell cell_r = getReferenceCell( p, origin, rotateR, radius );
				Cell cell_g = getReferenceCell( p, origin, rotateG, radius );
				Cell cell_b = getReferenceCell( p, origin, rotateB, radius );
				float r = getDotColour( cell_r, p, 0, rotateR, aa );
				float g = getDotColour( cell_g, p, 1, rotateG, aa );
				float b = getDotColour( cell_b, p, 2, rotateB, aa );

		// blend with original
				vec4 colour = texture2D( tDiffuse, vUV );
				r = blendColour( r, colour.r, blending );
				g = blendColour( g, colour.g, blending );
				b = blendColour( b, colour.b, blending );

				if ( greyscale ) {
					r = g = b = (r + b + g) / 3.0;
				}

				gl_FragColor = vec4( r, g, b, 1.0 );

			} else {

				gl_FragColor = texture2D( tDiffuse, vUV );

			}

		}`,
    },
    ll = class extends Yc {
        constructor(e) {
            (super(),
                (this.uniforms = mi.clone(cl.uniforms)),
                (this.material = new _i({
                    uniforms: this.uniforms,
                    fragmentShader: cl.fragmentShader,
                    vertexShader: cl.vertexShader,
                })));
            for (let t in e)
                e.hasOwnProperty(t) &&
                    this.uniforms.hasOwnProperty(t) &&
                    (this.uniforms[t].value = e[t]);
            this._fsQuad = new Qc(this.material);
        }
        render(e, t, n) {
            ((this.material.uniforms.tDiffuse.value = n.texture),
                this.renderToScreen
                    ? (e.setRenderTarget(null), this._fsQuad.render(e))
                    : (e.setRenderTarget(t),
                      this.clear && e.clear(),
                      this._fsQuad.render(e)));
        }
        setSize(e, t) {
            ((this.uniforms.width.value = e), (this.uniforms.height.value = t));
        }
        dispose() {
            (this.material.dispose(), this._fsQuad.dispose());
        }
    },
    ul = {
        name: `RGBShiftShader`,
        uniforms: {
            tDiffuse: { value: null },
            amount: { value: 0.005 },
            angle: { value: 0 },
        },
        vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
        fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform float amount;
		uniform float angle;

		varying vec2 vUv;

		void main() {

			vec2 offset = amount * vec2( cos(angle), sin(angle));
			vec4 cr = texture2D(tDiffuse, vUv + offset);
			vec4 cga = texture2D(tDiffuse, vUv);
			vec4 cb = texture2D(tDiffuse, vUv - offset);
			gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);

		}`,
    },
    dl = 0,
    fl = class {
        width;
        height;
        scene;
        camera;
        renderer;
        cube;
        AnimationManager;
        audio;
        composer;
        rgbShiftPass;
        crtPass;
        bloomPass;
        halftonePass;
        constructor(e) {
            ((this.audio = e),
                (this.width = window.innerWidth),
                (this.height = window.innerHeight),
                (this.scene = new yn()),
                (this.onResize = this.onResize.bind(this)),
                window.addEventListener(`resize`, this.onResize));
        }
        init() {
            (this.setupCamera(),
                this.setupRenderer(),
                this.setupPostProcessing(),
                Rc.addToScene(this.scene),
                (this.AnimationManager = new Kc(this.scene)),
                this.addBackgroud());
        }
        warmup() {
            this.composer.render();
        }
        play() {
            ((dl = performance.now()),
                this.renderer.setAnimationLoop((e) => this.tick(e)));
        }
        stop() {
            this.renderer.setAnimationLoop(null);
        }
        setupCamera() {
            ((this.camera = new Xi(
                -this.width / 2,
                this.width / 2,
                this.height / 2,
                -this.height / 2,
                0.1,
                1e3,
            )),
                (this.camera.position.z = 5),
                this.scene.add(this.camera));
        }
        setupRenderer() {
            ((this.renderer = new Nc({ antialias: !0, alpha: !0 })),
                this.renderer.setSize(this.width, this.height),
                this.renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2),
                ),
                document.body.appendChild(this.renderer.domElement));
        }
        setupPostProcessing() {
            ((this.composer = new nl(this.renderer)),
                this.composer.setSize(this.width, this.height));
            let e = new rl(this.scene, this.camera);
            (this.composer.addPass(e),
                (this.rgbShiftPass = new $c(ul)),
                (this.rgbShiftPass.uniforms.amount.value = 0.0015),
                this.composer.addPass(this.rgbShiftPass));
            let t = {
                shape: 1,
                radius: 6,
                rotateR: Math.PI / 12,
                rotateB: (Math.PI / 12) * 2,
                rotateG: (Math.PI / 12) * 3,
                scatter: 1,
                blending: 2,
                blendingMode: 3,
                greyscale: !1,
                disable: !1,
            };
            ((this.halftonePass = new ll(t)),
                this.composer.addPass(this.halftonePass),
                (this.bloomPass = new sl(
                    new q(this.width, this.height),
                    0.8,
                    0.4,
                    0.95,
                )),
                this.composer.addPass(this.bloomPass),
                (this.crtPass = new $c(qc)),
                this.crtPass.uniforms.uResolution.value.set(
                    this.width,
                    this.height,
                ),
                this.composer.addPass(this.crtPass),
                this.composer.addPass(new al()));
        }
        addBackgroud() {
            this.AnimationManager.spawnBackground(`background.png`, 1);
        }
        onResize() {
            ((this.width = window.innerWidth),
                (this.height = window.innerHeight),
                this.renderer.setSize(this.width, this.height),
                this.renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2),
                ),
                this.composer.setSize(this.width, this.height),
                (this.camera.left = -this.width / 2),
                (this.camera.right = this.width / 2),
                (this.camera.top = this.height / 2),
                (this.camera.bottom = -this.height / 2),
                this.camera.updateProjectionMatrix(),
                this.crtPass &&
                    this.crtPass.uniforms.uResolution.value.set(
                        this.width,
                        this.height,
                    ));
        }
        tick(e) {
            let t = (e - dl) / 1e3;
            if (
                ((dl = e),
                this.AnimationManager.update(t, this.audio),
                this.audio)
            ) {
                this.rgbShiftPass.uniforms.amount.value =
                    0.0015 + this.audio.kick * 0.005;
                let e = this.audio.volumeSmooth ** 4;
                this.halftonePass.uniforms.blending.value = e * 3;
            }
            (this.crtPass &&
                this.crtPass.uniforms.uTime &&
                (this.crtPass.uniforms.uTime.value = e * 0.001),
                this.composer.render());
        }
    },
    pl = new s(),
    ml = new fl(pl);
(pl.onLoad(async () => {
    ml.init();
}),
    pl.onWarmup(() => ml.warmup()),
    pl.onPlay(() => ml.play()),
    pl.onStop(() => ml.stop()));
export { n as t };
