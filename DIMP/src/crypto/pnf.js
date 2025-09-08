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
     *  File Content MixIn: {
     *
     *      data     : "...",        // base64_encode(fileContent)
     *      filename : "photo.png",
     *
     *      URL      : "http://...", // download from CDN
     *      // before fileContent uploaded to a public CDN,
     *      // it should be encrypted by a symmetric key
     *      key      : {             // symmetric key to decrypt file content
     *          algorithm : "AES",   // "DES", ...
     *          data      : "{BASE64_ENCODE}",
     *          ...
     *      }
     *  }
     */
    mk.format.BaseFileWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__attachment = null;  // file data (not encrypted)
        this.__password = null;    // key to decrypt data downloaded from CDN
    };
    var BaseFileWrapper = mk.format.BaseFileWrapper;

    Class(BaseFileWrapper, Dictionary, null);

    Implementation(BaseFileWrapper, {

        /**
         *  file data
         */
        getData: function () {
            var ted = this.__attachment;
            if (!ted) {
                var base64 = this.getValue('data');
                ted = TransportableData.parse(base64);
                this.__attachment = ted;
            }
            return ted;
        },
        setData: function (ted) {
            if (!ted) {
                this.removeValue('data');
            } else {
                this.setValue('data', ted.toObject());
            }
            this.__attachment = ted;
        },
        setBinaryData: function (bin) {
            var ted;
            if (!bin) {
                ted = null;
                this.removeValue('data');
            } else {
                ted = TransportableData.create(bin);
                this.setValue('data', ted.toObject());
            }
            this.__attachment = ted;
        },

        /**
         *  file data
         */
        getFilename: function () {
            return this.getString('filename', null);
        },
        setFilename: function (filename) {
            if (!filename) {
                this.removeValue('filename');
            } else {
                this.setValue('filename', filename);
            }
        },

        /**
         *  download URL
         */
        getURL: function () {
            return this.getString('URL', null);
        },
        setURL: function (url) {
            if (!url) {
                this.removeValue('URL');
            } else {
                this.setValue('URL', url);
            }
        },

        /**
         *  decrypt key
         */
        getPassword: function () {
            var pwd = this.__password;
            if (!pwd) {
                var key = this.getValue('password');
                pwd = SymmetricKey.parse(key);
                this.__password = pwd;
            }
            return pwd;
        },
        setPassword: function (key) {
            if (!key) {
                this.removeValue('password');
            } else {
                this.setMap('password', key);
            }
            this.__password = key;
        }
    });
