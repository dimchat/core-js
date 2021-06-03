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

/**
 *  File message: {
 *      type : 0x10,
 *      sn   : 123,
 *
 *      URL      : "http://",      // for encrypted file data from CDN
 *      filename : "filename.ext",
 *      data     : "...",          // if (!URL) base64_encode(audio)
 *      password : {},             // message.key for decrypting file data
 *  }
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;

    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;

    /**
     *  Create file content
     *
     *  Usages:
     *      1. new FileContent();
     *      2. new FileContent(map);
     *      3. new FileContent(type);
     *      4. new FileContent(filename, data);
     *      5. new FileContent(type, filename, data);
     */
    var FileContent = function () {
        if (arguments.length === 0) {
            // new FileContent();
            BaseContent.call(this, ContentType.FILE);
            this.filename = null;
            this.attachment = null;
        } else if (arguments.length === 1) {
            // new FileContent(map);
            // new FileContent(type);
            BaseContent.call(this, arguments[0]);
            this.filename = null;
            this.attachment = null;
        } else if (arguments.length === 2) {
            // new FileContent(filename, data);
            BaseContent.call(this, ContentType.FILE);
            this.setFilename(arguments[0]);
            this.setData(arguments[1]);
        } else if (arguments.length === 3) {
            // new FileContent(type, filename, data);
            BaseContent.call(this, arguments[0]);
            this.setFilename(arguments[1]);
            this.setData(arguments[2]);
        } else {
            throw SyntaxError('file content arguments error: ' + arguments);
        }
        this.password = null;  // symmetric key for decrypting file data
    };
    ns.Class(FileContent, BaseContent, null);

    FileContent.getURL = function (content) {
        return content['URL'];
    };
    FileContent.setURL = function (url, content) {
        if (url && url.indexOf('://') > 0) {
            content['URL'] = url;
        } else {
            delete content['URL'];
        }
    };

    FileContent.getFilename = function (content) {
        return content['filename'];
    };
    FileContent.setFilename = function (filename, content) {
        if (filename && filename.length > 0) {
            content['filename'] = filename;
        } else {
            delete content['filename'];
        }
    };

    FileContent.getData = function (content) {
        var base64 = content['data'];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    FileContent.setData = function (data, content) {
        if (data && data.length > 0) {
            content['data'] = ns.format.Base64.encode(data);
        } else {
            delete content['data'];
        }
    };

    FileContent.getPassword = function (content) {
        var key = content['password'];
        if (key) {
            return SymmetricKey.parse(key);
        } else {
            return null;
        }
    };
    FileContent.setPassword = function (key, content) {
        if (key) {
            content['password'] = key.getMap();
        } else {
            delete content['password'];
        }
    };

    //-------- setter/getter --------

    FileContent.prototype.getURL = function () {
        return FileContent.getURL(this.getMap());
    };
    FileContent.prototype.setURL = function (url) {
        FileContent.setURL(url, this.getMap());
    };

    FileContent.prototype.getFilename = function () {
        if (!this.filename) {
            this.filename = FileContent.getFilename(this.getMap());
        }
        return this.filename;
    };
    FileContent.prototype.setFilename = function (filename) {
        FileContent.setFilename(filename, this.getMap())
        this.filename = filename;
    };

    /*
     *  File data will not include in the message content.
     *  The sender should upload it to CDN before sending message out.
     */
    FileContent.prototype.getData = function () {
        if (!this.attachment) {
            this.attachment = FileContent.getData(this.getMap());
        }
        return this.attachment;
    };
    /**
     *  Set file data
     *
     * @param {Uint8Array} data
     */
    FileContent.prototype.setData = function (data) {
        FileContent.setData(data, this.getMap());
        this.attachment = data;
    };

    /**
     *  Get password for decrypt file data download from CDN
     *
     * @returns {SymmetricKey}
     */
    FileContent.prototype.getPassword = function () {
        if (!this.password) {
            this.password = FileContent.getPassword(console);
        }
        return this.password;
    };
    /**
     *  Set password for decryption
     *
     * @param {SymmetricKey} key - symmetric key to decrypt file data
     */
    FileContent.prototype.setPassword = function (key) {
        FileContent.setPassword(key, this.getMap());
        this.password = key;
    };

    //-------- register --------
    Content.register(ContentType.FILE, FileContent);

    //-------- namespace --------
    ns.protocol.FileContent = FileContent;

    ns.protocol.register('FileContent');

})(DIMP);
