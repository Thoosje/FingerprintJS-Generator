var chance = require('chance').Chance();
const murmurHash3 = require('murmur-hash').v3;
const axios = require('axios');

const browserData = require('./browsers.js');

class OpensourceFPgen {
    constructor(browser) {
        this._version = '3.3.3';

        const supportedBrowsers = ['chrome', 'edge'];
        if (!supportedBrowsers.includes(browser)) throw Error(`${browser} is not in the supported browsers list: ${supportedBrowsers.join(' ')}`);

        this._browser = browser;
        this._browserData = browserData[browser];
    };

    getRandomLanguage() {
        var languages = [
            'en-US', 'en-GB', 'fr-FR', 'fr-CA', 'de-DE', 'es-ES', 'es-MX', 'it-IT', 'pt-PT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW'
        ];
        var randomIndex = Math.floor(Math.random() * languages.length)
        switch (this._browser) {
            case 'chrome':
                return languages[randomIndex]
            case 'edge':
                return languages[randomIndex].split('-')[0]
        };
    };

    getRandomResulotion() {
        const resolutions = [
            '1920x1080',
            '1366x768',
            '1280x1024',
            '1440x900',
            '1600x900',
            '1280x800',
            '1024x768',
            '1280x720',
            '1680x1050',
            '2560x1440',
            '3840x2160',
            '3440x1440',
            '2560x1080'
        ];
        const randomIndex = Math.floor(Math.random() * resolutions.length);
        return resolutions[randomIndex];
    };

    getRandomTimeZoneUTC() {
        const utcs = chance.timezone().utc;
        const randomIndex = Math.floor(Math.random() * utcs.length);

        return utcs[randomIndex];
    };

    createComponents() {
        let components = {
            'audio': {
                'value': this._browserData.sound
            },
            'canvas': {
                'value': {
                    'geometry': this._browserData.canvas.geometry,
                    'text': this._browserData.canvas.text,
                    'winding': true
                }
            },
            'colorDepth': {
                'value': 24
            },
            'colorGamut': {
                'value': 'srgb'
            },
            'contrast': {
                'value': [-1, 0, 1, 10][chance.integer({
                    min: 0,
                    max: 3
                })]
            },
            'cookiesEnabled': {
                'value': false
            },
            'cpuClass': {
                'value': undefined // Looks like this method is deprecated so no value will be suplied.
            },
            'deviceMemory': {
                'value': [0.25, 0.5, 1, 2, 4, 8][chance.integer({
                    min: 0,
                    max: 5
                })] // Might need to remove super smazll numbers as I doubt ppl actually have this much ram
            },
            'domBlockers': {
                'value': undefined, // Not exactly sure what this is. TODO: See if I can play around with this to get more random results
            },
            'fontPreferences': { // Not sure if this is statis per system or per browser
                'value': this._browserData.fontPreferences
            },
            'fonts': {
                'value': this._browserData.fonts
            },
            'forcedColors': {
                'value': chance.bool()
            },
            'hardwareConcurrency': {
                'value': [4, 8, 16, 32, 64, 128][chance.integer({
                    min: 0,
                    max: 5
                })]
            },
            'hdr': {
                'value': [true, false, undefined][chance.integer({
                    min: 0,
                    max: 2
                })]
            },
            'indexedDB': {
                'value': true // False on old devices
            },
            'invertedColors': {
                'value': [true, false, undefined][chance.integer({
                    min: 0,
                    max: 2
                })]
            },
            'languages': {
                'value': [
                    this.getRandomLanguage()
                ]
            },
            'localStorage': {
                'value': true,
            },
            'math': {
                'value': {
                    'acos': 1.4473588658278522,
                    'acosh': 709.889355822726,
                    'acoshPf': 355.291251501643,
                    'asin': 0.12343746096704435,
                    'asinh': 0.881373587019543,
                    'asinhPf': 0.8813735870195429,
                    'atan': 0.4636476090008061,
                    'atanh': 0.5493061443340548,
                    'atanhPf': 0.5493061443340548,
                    'cos': -0.8390715290095377,
                    'cosh': 1.5430806348152437,
                    'coshPf': 1.5430806348152437,
                    'exp': 2.718281828459045,
                    'expm1': 1.718281828459045,
                    'expm1Pf': 1.718281828459045,
                    'log1p': 2.3978952727983707,
                    'log1pPf': 2.3978952727983707,
                    'powPI': 1.9275814160560204e-50,
                    'sin': 0.8178819121159085,
                    'sinh': 1.1752011936438014,
                    'sinhPf': 2.534342107873324,
                    'tan': -1.4214488238747245,
                    'tanh': 0.7615941559557649,
                    'tanhPf': 0.7615941559557649
                }
            },
            'monochrome': {
                'value': chance.integer({
                    min: 0,
                    max: 100
                }) // Random int between 0 and 100 but maybe it's better to keep it at 0
            },
            'openDatabase': {
                'value': true // True on edge and chrome, false on firefox
            },
            'osCpu': {
                'value': undefined // Not defined on chrome and edge. Well on firefox
            },
            'platform': {
                'value': 'Win32' // For now Win32 till we checked Mac properties
            },
            'plugins': { // Same for Edge and chrome
                'value': [{
                        'description': 'Portable Document Format',
                        'mimeTypes': [{
                                'suffixes': 'pdf',
                                'type': 'application/pdf'
                            },
                            {
                                'suffixes': 'pdf',
                                'type': 'text/pdf'
                            }
                        ],
                        'name': 'PDF Viewer'
                    },
                    {
                        'description': 'Portable Document Format',
                        'mimeTypes': [{
                                'suffixes': 'pdf',
                                'type': 'application/pdf'
                            },
                            {
                                'suffixes': 'pdf',
                                'type': 'text/pdf'
                            }
                        ],
                        'name': 'Chrome PDF Viewer'
                    },
                    {
                        'description': 'Portable Document Format',
                        'mimeTypes': [{
                                'suffixes': 'pdf',
                                'type': 'application/pdf'
                            },
                            {
                                'suffixes': 'pdf',
                                'type': 'text/pdf'
                            }
                        ],
                        'name': 'Chromium PDF Viewer'
                    },
                    {
                        'description': 'Portable Document Format',
                        'mimeTypes': [{
                                'suffixes': 'pdf',
                                'type': 'application/pdf'
                            },
                            {
                                'suffixes': 'pdf',
                                'type': 'text/pdf'
                            }
                        ],
                        'name': 'Microsoft Edge PDF Viewer'
                    },
                    {
                        'description': 'Portable Document Format',
                        'mimeTypes': [{
                                'suffixes': 'pdf',
                                'type': 'application/pdf'
                            },
                            {
                                'suffixes': 'pdf',
                                'type': 'text/pdf'
                            }
                        ],
                        'name': 'WebKit built-in PDF'
                    }
                ]
            },
            'reducedMotion': {
                'value': [true, false, undefined][chance.integer({
                    min: 0,
                    max: 2
                })]
            },
            'screenFrame': {
                'value': [0, 0, 0, 0]
            },
            'screenResolution': {
                'value': this.getRandomResulotion().split('x')
            },
            'sessionStorage': {
                'value': true
            },
            'timezone': {
                'value': this.getRandomTimeZoneUTC()
            },
            'touchSupport': { // Possible to randomize this
                'value': {
                    'maxTouchPoints': 0,
                    'touchEvent': false,
                    'touchStart': false
                }
            },
            'vendor': {
                'value': 'Google Inc.'
            },
            'vendorFlavors': {
                'value': [
                    'chrome'
                ]
            }
        };

        return components;
    };

    // Copied from source
    hashComponents(components) {
        for (var t = "", n = 0, r = Object.keys(components).sort(); n < r.length; n++) {
            var a = r[n],
                o = components[a],
                i = o.error ? "error" : JSON.stringify(o.value);
            t += (t ? "|" : "") + a.replace(/([:|\\])/g, "\\$1") + ":" + i
        }
        return t
    }

    createVisitorId() {
        const components = this.createComponents();
        const componentsString = this.hashComponents(components);

        const visitorId = murmurHash3.x64.hash128(componentsString);

        return {
            browser: this._browser,
            components,
            visitorId
        };
    }
};

class FingerprintProGen {
    constructor(openSourceData, token, endpoint, url, user, tag) {
        this._token = token;
        this._endpoint = endpoint;
        this._url = url;
        this._user = user;
        this._tag = tag;

        this._version = '3.5.4';

        this._openSourceData = openSourceData;
        this._browser = openSourceData.browser;
        this._osComps = openSourceData.components;
    };

    possibleNullVal(value, defaultValue) { // Et
        return this.transformValue(value, (e) => {
            return {
                s: e == null ? defaultValue : 0,
                v: e != null ? e : null
            };
        });
    };

    originalVal(value) { // wt
        return this.transformValue(value, (e) => {
            return {
                s: 0,
                v: e
            };
        });
    };

    numberValue(value) {
        return this.transformValue(value, (e) => {
            return "number" == typeof e ? {
                s: e,
                v: null
            } : {
                s: 0,
                v: e
            }
        });
    };

    boolValue(value) { // yt
        return this.transformValue(value, (e) => {
            return e
        });
    };

    transformValue(value, transform) {
        return transform(value.value);
    };

    mergeObjects() {
        let targetObj = arguments[0];

        for (let i = 1; i < arguments.length; i++) {
            const sourceObj = arguments[i];

            if (sourceObj && typeof sourceObj === 'object') {
                for (let prop in sourceObj) {
                    if (Object.prototype.hasOwnProperty.call(sourceObj, prop)) {
                        targetObj[prop] = sourceObj[prop];
                    }
                }
            }
        }

        return targetObj;
    }


    createData() {
        // Check some extra values that might be in the actual payload like 'cr': referer etc
        const data = {
            c: this._token,
            url: this._url,
            t: this._tag,
            lid: this._user,
            s1: this.possibleNullVal(this._osComps.osCpu, -1),
            s2: [
                this.originalVal(this._osComps.languages)
            ],
            s3: this.originalVal(this._osComps.colorDepth),
            s4: this.possibleNullVal(this._osComps.deviceMemory, -1),
            s5: this.transformValue(this._osComps.screenResolution, ((e) => {
                return {
                    s: 0,
                    v: e.map(((e) => {
                        e = parseInt(e)
                        return null === e ? -1 : e
                    }))
                }
            })),
            s6: {
                s: -1,
                v: null // 'TODO'
            }, // this.numberValue(r[5])
            s7: this.possibleNullVal(this._osComps.hardwareConcurrency, -1),
            s8: {
                s: -1,
                v: null // 'TODO'
            }, // this.numberValue(r[6]),
            s9: this.originalVal(this._osComps.timezone),
            s10: this.originalVal(this._osComps.sessionStorage),
            s11: this.originalVal(this._osComps.localStorage),
            s12: this.possibleNullVal(this._osComps.indexedDB, -1),
            s13: this.originalVal(this._osComps.openDatabase),
            s14: this.possibleNullVal(this._osComps.cpuClass, -1),
            s15: this.originalVal(this._osComps.platform),
            s16: this.possibleNullVal(this._osComps.plugins, -1),
            s17: this.transformValue(this._osComps.canvas, ((e) => {
                return {
                    s: 0,
                    v: this.mergeObjects(this.mergeObjects({}, e), {
                        geometry: murmurHash3.x64.hash128(e.geometry),
                        text: murmurHash3.x64.hash128(e.text)
                    })
                }
            })),
            s18: {
                s: -1,
                v: null // 'TODO'
            }, // this.numberValue(r[7]),
            s19: this.originalVal(this._osComps.touchSupport),
            s20: this.originalVal(this._osComps.fonts),
            s21: this.transformValue(this._osComps.audio, ((e) => {
                return -1 === e || -2 === e || -3 === e ? {
                    s: e,
                    v: null
                } : {
                    s: 0,
                    v: e
                }
            })),
            s22: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[10], -1)
            s24: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[31]),
            s26: {
                s: -1,
                v: null // 'TODO'
            }, // this.numberValue(r[8]),
            s27: this.originalVal(this._osComps.vendor),
            s28: this.originalVal(this._osComps.vendorFlavors),
            s30: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[11], -1)
            s31: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[4]),
            s32: this.originalVal(this._osComps.cookiesEnabled),
            s33: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[12]),
            s34: {
                s: -1,
                v: null // 'TODO'
            }, // this.boolValue(r[0])
            s35: {
                s: -1,
                v: null // 'TODO'
            }, // this.boolValue(r[3])
            s36: this.possibleNullVal(this._osComps.domBlockers, -1),
            s37: this.possibleNullVal(this._osComps.colorGamut, -1),
            s38: this.possibleNullVal(this._osComps.contrast, -1),
            s39: this.possibleNullVal(this._osComps.forcedColors, -1),
            s40: this.possibleNullVal(this._osComps.hdr, -1),
            s41: this.possibleNullVal(this._osComps.invertedColors, -1),
            s42: this.possibleNullVal(this._osComps.monochrome, -1),
            s43: this.possibleNullVal(this._osComps.reducedMotion, -1),
            s44: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[13], -1)
            s45: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalVal(r[14])
            s46: this.transformValue(this._osComps.math, ((e) => {
                return {
                    s: 0,
                    v: murmurHash3.x64.hash128(Object.keys(e).map(((t) => {
                        return t + "=" + e[t]
                    })).join(","))
                }
            })),
            s47: {
                s: -1,
                v: null // 'TODO'
            }, //this.transformValue(r.j, (function (e) {
            //     return {
            //         s: e ? 0 : -1,
            //         v: e ? this.mergeObjects(this.mergeObjects({}, e), {
            //             contextAttributes: murmurHash3.x64.hash128(e.contextAttributes),
            //             parameters: murmurHash3.x64.hash128(e.parameters),
            //             shaderPrecisions: murmurHash3.x64.hash128(e.shaderPrecisions),
            //             extensions: murmurHash3.x64.hash128(e.extensions),
            //             extensionParameters: murmurHash3.x64.hash128(e.extensionParameters),
            //             fingerprint: murmurHash3.x64.hash128(e.fingerprint)
            //         }) : null
            //     }
            // })),
            s48: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalVal(r[15])
            s49: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[16], -1)
            s50: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[17], -1)
            s51: this.originalVal(this._osComps.fontPreferences),
            s52: {
                s: -1,
                v: null // 'TODO'
            }, //this.transformValue(r[2], (function (e) {
            //     return {
            //         s: "number" == typeof e ? e : e.length ? 0 : 1,
            //         v: "number" == typeof e ? "" : murmurHash3.x64.hash128(JSON.stringify(e))
            //     }
            // })), 
            s53: {
                s: -1,
                v: null // 'TODO'
            }, // this.boolValue(r[18])
            s54: {
                s: -1,
                v: null // 'TODO'
            }, // this.numberValue(r[1])
            s55: { // Visitor token -> token you get from being a visitor already
                s: -1,
                v: null
            },
            s56: {
                s: -1,
                v: null // 'TODO'
            }, // TLS token
            s57: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[19], -1)
            s58: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[9], -1)
            s59: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[20])
            s60: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[21])
            s61: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[22])
            s62: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[23])
            s63: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[24])
            s64: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[25])
            s65: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[26])
            s66: {
                s: -1,
                v: null // 'TODO'
            }, // this.possibleNullVal(r[27], -1)
            s67: { // customComponents, for EQL there are none. Possibly for other sites there are
                s: -1,
                v: null
            },
            s68: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[28])
            s69: {
                s: -1,
                v: null // 'TODO'
            }, // this.boolValue(r[29])
            s71: {
                s: -1,
                v: null // 'TODO'
            }, // this.originalValue(r[30])
        };
        
        console.log(JSON.stringify(data))
        return data
    };

    encodeData(e, t, n, r, i) {
        void 0 === i && (i = (() => {
            return 256 * Math.random() | 0
        }));
        var o = i() % (n + 1),
            a = function (e) {
                if ("function" == typeof TextEncoder) return (new TextEncoder).encode(e);
                for (var t = unescape(encodeURI(e)), n = new Uint8Array(t.length), r = 0; r < t.length; ++r) n[r] = t.charCodeAt(r);
                return n
            }(JSON.stringify(e)),
            u = 1 + t.length + 1 + o + r + a.length,
            s = new ArrayBuffer(u),
            c = new Uint8Array(s),
            l = 0,
            f = i();
        c[l++] = f;
        for (var d = 0, v = t; d < v.length; d++) {
            var h = v[d];
            c[l++] = f + h
        }
        c[l++] = f + o;
        for (var m = 0; m < o; ++m) c[l++] = i();
        var p = new Uint8Array(r);
        for (m = 0; m < r; ++m) p[m] = i(), c[l++] = p[m];
        for (m = 0; m < a.length; ++m) c[l++] = a[m] ^ p[m % r];
        return s
    }

    decompressData(e, t, n) {
        let isBufffer = (e) => {
            return e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
        }

        let T = (e, t) => {
            return (e - t + 256) % 256
        }

        let R = (e) => {
            if ("function" == typeof TextDecoder) {
                var t = (new TextDecoder).decode(e);
                if (t) return t
            }
            var n = b(e);
            return decodeURIComponent(escape(String.fromCharCode.apply(null, n)))
        }

        var r = function () {
                throw new Error("Invalid data")
            },
            i = isBufffer(e);
        i.length < t.length + 2 && r();
        for (var o = 0; o < t.length; ++o) T(i[1 + o], i[0]) !== t[o] && r();
        var a = 1 + t.length,
            u = T(i[a], i[0]);
        i.length < a + 1 + u + n && r();
        var s = a + 1 + u,
            c = s + n,
            l = new Uint8Array(i.length - c);
        for (o = 0; o < l.length; ++o) l[o] = i[c + o] ^ i[s + o % n];
        return JSON.parse(R(l))
    }

    async submitData(nonEncodedData, responseFormat = 'binary') {
        const body = this.encodeData(nonEncodedData, [3, 7], 3, 7);
        
        const config = {
            method: 'POST',
            url: `${this._endpoint}?ci=js/${this._version}`,
            headers: { // fix the headers
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
                'cache-control': 'no-cache',
                'content-type': 'text/plain', 
                'origin': new URL(this._url).origin,
                'pragma': 'no-cache',
                'sec-ch-ua': `"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"`,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            },
            timeout: 5000,
            responseType: responseFormat === 'binary' ? 'arraybuffer' : 'text',
            data: body instanceof ArrayBuffer ? Buffer.from(body) : body,
        };

        try {
            const response = await axios(config);
            console.log(this.decompressData(response.data, [3, 7], 7).products);
        } catch (error) {
            const decompressedData = this.decompressData(error.response.data, [3, 7], 7);
            console.log(decompressedData.products)
        }
    }
};


const run = () => {
    const osGen = new OpensourceFPgen(
        'chrome'
    );

    const osData = osGen.createVisitorId();
    const proGen = new FingerprintProGen(
        osData,
        'aOJXIJqnGJ53Jd2HbLIP',
        'https://metrics.eql.xyz/',
        'https://launch.footlocker.nl/nl-NL/launch/mens-air-jordan-1-high-og-lucky-green-nl',
        'test@gmail.com', 
        {
            drawId: '123'
        }
    );
    const data = proGen.createData();
    proGen.submitData(data)
};
run()