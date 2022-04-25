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

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create file content
     *
     *  Usages:
     *      1. new BaseFileContent();
     *      2. new BaseFileContent(map);
     *      3. new BaseFileContent(type);
     *      4. new BaseFileContent(filename, data);
     *      5. new BaseFileContent(type, filename, data);
     */
    var BaseFileContent = function () {
        if (arguments.length === 0) {
            // new BaseFileContent();
            BaseContent.call(this, ContentType.FILE);
            this.__data = null;
        } else if (arguments.length === 1) {
            // new BaseFileContent(map);
            // new BaseFileContent(type);
            BaseContent.call(this, arguments[0]);
            this.__data = null;
        } else if (arguments.length === 2) {
            // new BaseFileContent(filename, data);
            BaseContent.call(this, ContentType.FILE);
            this.setFilename(arguments[0]);
            this.setData(arguments[1]);
        } else if (arguments.length === 3) {
            // new BaseFileContent(type, filename, data);
            BaseContent.call(this, arguments[0]);
            this.setFilename(arguments[1]);
            this.setData(arguments[2]);
        } else {
            throw new SyntaxError('file content arguments error: ' + arguments);
        }
        this.__password = null;  // symmetric key for decrypting file data
    };
    ns.Class(BaseFileContent, BaseContent, [FileContent]);

    // Override
    BaseFileContent.prototype.setURL = function (url) {
        var dict = this.toMap();
        FileContent.setURL(url, dict);
    };

    // Override
    BaseFileContent.prototype.getURL = function () {
        var dict = this.toMap();
        return FileContent.getURL(dict);
    };

    // Override
    BaseFileContent.prototype.setFilename = function (filename) {
        var dict = this.toMap();
        FileContent.setFilename(filename, dict)
    };

    // Override
    BaseFileContent.prototype.getFilename = function () {
        var dict = this.toMap();
        return FileContent.getFilename(dict);
    };

    // Override
    BaseFileContent.prototype.setData = function (data) {
        var dict = this.toMap();
        FileContent.setData(data, dict);
        this.__data = data;
    };

    // Override
    BaseFileContent.prototype.getData = function () {
        if (!this.__data) {
            var dict = this.toMap();
            this.__data = FileContent.getData(dict);
        }
        return this.__data;
    };

    // Override
    BaseFileContent.prototype.setPassword = function (key) {
        var dict = this.toMap();
        FileContent.setPassword(key, dict);
        this.__password = key;
    };

    // Override
    BaseFileContent.prototype.getPassword = function () {
        if (!this.__password) {
            var dict = this.toMap();
            this.__password = FileContent.getPassword(dict);
        }
        return this.__password;
    };

    //-------- namespace --------
    ns.dkd.BaseFileContent = BaseFileContent;

    ns.dkd.registers('BaseFileContent');

})(DIMP);
