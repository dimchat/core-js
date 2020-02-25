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
 *      password : {},             // message.key for decrypting file data
 *  }
 */

//! require 'namespace.js'

!function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;

    /**
     *  Create file message content
     *
     * @param content {{}}
     * @constructor
     */
    var FileContent = function (content) {
        if (!content) {
            // create empty file content
            content = ContentType.FILE;
        }
        Content.call(this, content);
        // file data
        this.attachment = null;
        // symmetric key for decrypting file data
        this.password = null;
    };
    ns.Class(FileContent, Content, null);

    //-------- setter/getter --------

    FileContent.prototype.getURL = function () {
        return this.getValue('URL');
    };
    FileContent.prototype.setURL = function (url) {
        this.setValue('URL', url);
    };

    FileContent.prototype.getFilename = function () {
        return this.getValue('filename');
    };
    FileContent.prototype.setFilename = function (filename) {
        this.setValue('filename', filename);
    };

    var file_ext = function () {
        var filename = this.getFilename();
        if (!filename) {
            return null;
        }
        var pos = filename.lastIndexOf('.');
        if (pos < 0) {
            return null;
        }
        return filename.substring(pos + 1);
    };

    var md5 = function (data) {
        var hash = ns.digest.MD5.digest(data);
        return ns.format.Hex.encode(hash);
    };

    /*
     *  File data will not include in the message content.
     *  The sender should upload it to CDN before sending message out.
     */
    FileContent.prototype.getData = function () {
        return this.attachment;
    };
    /**
     *  Set file data
     *
     * @param data {Uint8Array}
     */
    FileContent.prototype.setData = function (data) {
        if (data && data.length > 0) {
            // update filename as MD5(data)
            var filename = md5(data);
            var ext = file_ext.call(this);
            if (ext) {
                filename = filename + '.' + ext;
            }
            this.setValue('filename', filename);
        }
        this.attachment = data;
    };

    /**
     *  Get password for decrypt file data download from CDN
     *
     * @returns {SymmetricKey}
     */
    FileContent.prototype.getPassword = function () {
        if (!this.password) {
            var key = this.getValue('password');
            if (key) {
                this.password = SymmetricKey.getInstance(key);
            }
        }
        return this.password;
    };
    /**
     *  Set password for decryption
     *
     * @param key {SymmetricKey}
     */
    FileContent.prototype.setPassword = function (key) {
        this.setValue('password', key);
        this.password = key;
    };

    //-------- register --------
    Content.register(ContentType.FILE, FileContent);

    //-------- namespace --------
    ns.protocol.FileContent = FileContent;

    ns.protocol.register('FileContent');

}(DIMP);
