'use strict';
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

//! require <crypto.js>

    /**
     *  Transportable Data Mixin: {
     *
     *      algorithm : "base64",
     *      data      : "...",      // base64_encode(data)
     *      ...
     *  }
     *
     *  data format:
     *      0. "{BASE64_ENCODE}"
     *      1. "base64,{BASE64_ENCODE}"
     *      2. "data:image/png;base64,{BASE64_ENCODE}"
     */
    mk.format.BaseDataWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__data = null;
    };
    var BaseDataWrapper = mk.format.BaseDataWrapper;

    Class(BaseDataWrapper, Dictionary, null);

    Implementation(BaseDataWrapper, {

        // // Override
        // isEmpty: function () {
        //     if (Dictionary.prototype.isEmpty.call(this)) {
        //         return true;
        //     }
        //     var bin = this.__data;
        //     return bin === null || bin.length === 0;
        // },

        // Override
        toString: function () {
            var encoded = this.getString('data', null);
            if (!encoded/* || encoded.length === 0*/) {
                return '';
            }
            var alg = this.getString('algorithm', null);
            if (!alg || alg === EncodeAlgorithms.DEFAULT) {
                alg = '';
            }
            if (alg === '') {
                // 0. "{BASE64_ENCODE}"
                return encoded;
            } else {
                // 1. "base64,{BASE64_ENCODE}"
                return alg + ',' + encoded;
            }
        },

        // toString(mimeType)
        encode: function (mimeType) {
            var encoded = this.getString('data', null);
            if (!encoded/* || encoded.length === 0*/) {
                return '';
            }
            var alg = this.getAlgorithm();
            // "data:image/png;base64,{BASE64_ENCODE}"
            return 'data:' + mimeType + ';' + alg + ',' + encoded;
        },

        // encode algorithm
        getAlgorithm: function () {
            var alg = this.getString('algorithm', null);
            if (!alg) {
                alg = EncodeAlgorithms.DEFAULT;
            }
            return alg;
        },
        setAlgorithm: function (name) {
            if (!name) {
                this.removeValue('algorithm');
            } else {
                this.setValue('algorithm', name);
            }
        },

        /**
         *  file data
         */
        getData: function () {
            var bin = this.__data;
            if (!bin) {
                var encoded = this.getString('data', null);
                if (!encoded/* || encoded.length === 0*/) {
                    return null;
                } else {
                    var alg = this.getAlgorithm();
                    if (alg === EncodeAlgorithms.BASE_64) {
                        bin = Base64.decode(encoded);
                    } else if (alg === EncodeAlgorithms.BASE_58) {
                        bin = Base58.decode(encoded);
                    } else if (alg === EncodeAlgorithms.HEX) {
                        bin = Hex.decode(encoded);
                    } else {
                        throw new Error('data algorithm not support: ' + alg);
                    }
                }
                this.__data = bin;
            }
            return bin;
        },
        setData: function (bin) {
            if (!bin) {
                this.removeValue('data');
            } else {
                var encoded = null;
                var alg = this.getAlgorithm();
                if (alg === EncodeAlgorithms.BASE_64) {
                    encoded = Base64.encode(bin);
                } else if (alg === EncodeAlgorithms.BASE_58) {
                    encoded = Base58.encode(bin);
                } else if (alg === EncodeAlgorithms.HEX) {
                    encoded = Hex.encode(bin);
                } else {
                    throw new Error('data algorithm not support: ' + alg);
                }
                this.setValue('data', encoded);
            }
            this.__data = bin;
        }
    });
