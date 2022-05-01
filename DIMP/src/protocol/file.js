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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;

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
    var FileContent = function () {};
    ns.Interface(FileContent, [Content]);

    /**
     *  Set uploaded URL (CDN)
     * @param {String} url
     */
    FileContent.prototype.setURL = function (url) {
        ns.assert(false, 'implement me!');
    };
    FileContent.prototype.getURL = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    FileContent.setURL = function (url, content) {
        if (url/* && url.indexOf('://') > 0*/) {
            content['URL'] = url;
        } else {
            delete content['URL'];
        }
    };
    FileContent.getURL = function (content) {
        return content['URL'];
    };

    /**
     *  Set filename
     *
     * @param {String} filename
     */
    FileContent.prototype.setFilename = function (filename) {
        ns.assert(false, 'implement me!');
    };
    FileContent.prototype.getFilename = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    FileContent.setFilename = function (filename, content) {
        if (filename/* && filename.length > 0*/) {
            content['filename'] = filename;
        } else {
            delete content['filename'];
        }
    };
    FileContent.getFilename = function (content) {
        return content['filename'];
    };

    /**
     *  Set file data
     *  ~~~~~~~~~~~~~
     *  File data will not include in the message content.
     *  The sender should upload it to CDN before sending message out.
     *
     * @param {Uint8Array} data
     */
    FileContent.prototype.setData = function (data) {
        ns.assert(false, 'implement me!');
    };
    FileContent.prototype.getData = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    FileContent.setData = function (data, content) {
        if (data/* && data.length > 0*/) {
            content['data'] = Base64.encode(data);
        } else {
            delete content['data'];
        }
    };
    FileContent.getData = function (content) {
        var base64 = content['data'];
        if (base64/* && base64.length > 0*/) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };

    /**
     *  Set password for decrypt file data uploaded onto CDN
     *
     * @param {DecryptKey} key - symmetric key to decrypt file data
     */
    FileContent.prototype.setPassword = function (key) {
        ns.assert(false, 'implement me!');
    };
    FileContent.prototype.getPassword = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    FileContent.setPassword = function (key, content) {
        if (key) {
            content['password'] = key.toMap();
        } else {
            delete content['password'];
        }
    };
    FileContent.getPassword = function (content) {
        var key = content['password'];
        return SymmetricKey.parse(key);
    };

    //-------- namespace --------
    ns.protocol.FileContent = FileContent;

    ns.protocol.registers('FileContent');

})(DIMP);
