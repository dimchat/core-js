;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
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

//! require 'protocol/file.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create file content
     *
     *  Usages:
     *      1. new BaseFileContent(map);
     *      2. new BaseFileContent(filename, data);
     *      3. new BaseFileContent(type, filename, data);
     */
    var BaseFileContent = function () {
        var filename = null;
        var data = null;
        if (arguments.length === 1) {
            // new BaseFileContent(map);
            BaseContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new BaseFileContent(filename, data);
            BaseContent.call(this, ContentType.FILE);
            filename = arguments[0];
            data = arguments[1];
        } else if (arguments.length === 3) {
            // new BaseFileContent(type, filename, data);
            BaseContent.call(this, arguments[0]);
            filename = arguments[1];
            data = arguments[2];
        } else {
            throw new SyntaxError('File content arguments error: ' + arguments);
        }
        if (filename) {
            this.setValue('filename', filename);
        }
        if (data) {
            var base64 = null;
            if (typeof data === 'string') {
                base64 = data;
                data = null;
            } else if (data instanceof Uint8Array) {
                base64 = Base64.encode(data);
            } else {
                throw TypeError('file data error: ' + (typeof data));
            }
            this.setValue('data', base64);
        }
        this.__data = data;
        this.__password = null;  // symmetric key for decrypting file data
    };
    Class(BaseFileContent, BaseContent, [FileContent], {

        // Override
        setURL: function (url) {
            this.setValue('URL', url);
        },

        // Override
        getURL: function () {
            return this.getString('URL');
        },

        // Override
        setFilename: function (filename) {
            this.setValue('filename');
        },

        // Override
        getFilename: function () {
            return this.getString('filename');
        },

        // Override
        setData: function (data) {
            if (data && data.length > 0) {
                this.setValue('data', Base64.encode(data));
            } else {
                this.removeValue('data');
            }
            this.__data = data;
        },

        // Override
        getData: function () {
            if (this.__data === null) {
                var base64 = this.getString('data');
                if (base64) {
                    this.__data = Base64.decode(base64);
                }
            }
            return this.__data;
        },

        // Override
        setPassword: function (key) {
            this.setMap('password', key);
            this.__password = key;
        },

        // Override
        getPassword: function () {
            if (this.__password === null) {
                var key = this.getValue('password');
                this.__password = SymmetricKey.parse(key);
            }
            return this.__password;
        }
    });

    //-------- namespace --------
    ns.dkd.BaseFileContent = BaseFileContent;

})(DIMP);
