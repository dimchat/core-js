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

    var Interface = ns.type.Interface;
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
    var FileContent = Interface(null, [Content]);

    /**
     *  Set uploaded URL (CDN)
     * @param {string} url
     */
    FileContent.prototype.setURL = function (url) {
        throw new Error('NotImplemented');
    };
    FileContent.prototype.getURL = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Set filename
     *
     * @return {string} filename
     */
    FileContent.prototype.getFilename = function () {
        throw new Error('NotImplemented');
    };
    FileContent.prototype.setFilename = function (filename) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set file data
     *  ~~~~~~~~~~~~~
     *  File data will not include in the message content.
     *  The sender should upload it to CDN before sending message out.
     *
     * @return {Uint8Array} data
     */
    FileContent.prototype.getData = function () {
        throw new Error('NotImplemented');
    };
    FileContent.prototype.setData = function (data) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set password for decrypt file data uploaded onto CDN
     *
     * @param {DecryptKey} key - symmetric key to decrypt file data
     */
    FileContent.prototype.setPassword = function (key) {
        throw new Error('NotImplemented');
    };
    FileContent.prototype.getPassword = function () {
        throw new Error('NotImplemented');
    };

    //-------- factories --------

    /**
     *  Create file content
     *
     * @param {string} filename
     * @param {Uint8Array|string} data
     * @return {FileContent}
     */
    FileContent.file = function (filename, data) {
        return new ns.dkd.BaseFileContent(filename, data);
    };

    /**
     *  Create image content
     *
     * @param {string} filename
     * @param {Uint8Array|string} data
     * @return {ImageContent}
     */
    FileContent.image = function (filename, data) {
        return new ns.dkd.ImageFileContent(filename, data);
    };

    /**
     *  Create audio content
     *
     * @param {string} filename
     * @param {Uint8Array|string} data
     * @return {AudioContent}
     */
    FileContent.audio = function (filename, data) {
        return new ns.dkd.AudioFileContent(filename, data);
    };

    /**
     *  Create video content
     *
     * @param {string} filename
     * @param {Uint8Array|string} data
     * @return {VideoContent}
     */
    FileContent.video = function (filename, data) {
        return new ns.dkd.VideoFileContent(filename, data);
    };

    //-------- namespace --------
    ns.protocol.FileContent = FileContent;

})(DIMP);
