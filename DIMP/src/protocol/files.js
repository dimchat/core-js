'use strict';
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

//! require <dkd.js>

    /**
     *  File message: {
     *      type : i2s(0x10),
     *      sn   : 123,
     *
     *      data     : "...",        // base64_encode(fileContent)
     *      filename : "filename.ext",
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
    dkd.protocol.FileContent = Interface(null, [Content]);
    var FileContent = dkd.protocol.FileContent;

    // Uint8Array
    FileContent.prototype.setData = function (data) {};
    FileContent.prototype.getData = function () {};

    FileContent.prototype.setFilename = function (filename) {};
    FileContent.prototype.getFilename = function () {};

    FileContent.prototype.setURL = function (url) {};
    FileContent.prototype.getURL = function () {};

    // DecryptKey
    FileContent.prototype.setPassword = function (key) {};
    FileContent.prototype.getPassword = function () {};

    //
    //  Factory methods
    //

    var _init_file_content = function (content, data, filename, url, password) {
        if (data) {
            content.setTransportableData(data);
        }
        if (filename) {
            content.setFilename(filename);
        }
        if (url) {
            content.setURL(url);
        }
        if (password) {
            content.setPassword(password);
        }
        return content;
    };

    /**
     *  Create file content with type
     *
     * @param {String} type            - message type
     * @param {TransportableData} data - file data
     * @param {String} filename        - file name
     * @param {String} url             - download URL
     * @param {DecryptKey} password    - download key
     * @return {FileContent}
     */
    FileContent.create = function (type, data, filename, url, password) {
        var content;
        if (type === ContentType.IMAGE) {
            content = new ImageFileContent();
        } else if (type === ContentType.AUDIO) {
            content = new AudioFileContent();
        } else if (type === ContentType.VIDEO) {
            content = new VideoFileContent();
        } else {
            content = new BaseFileContent(type);
        }
        return _init_file_content(content, data, filename, url, password);
    };

    /**
     *  Create file content
     *
     * @param {TransportableData} data - file data
     * @param {String} filename        - file name
     * @param {String} url             - download URL
     * @param {DecryptKey} password    - download key
     * @return {FileContent}
     */
    FileContent.file = function (data, filename, url, password) {
        var content = new BaseFileContent();
        return _init_file_content(content, data, filename, url, password);
    };

    /**
     *  Create image content
     *
     * @param {TransportableData} data - file data
     * @param {String} filename        - file name
     * @param {String} url             - download URL
     * @param {DecryptKey} password    - download key
     * @return {ImageContent}
     */
    FileContent.image = function (data, filename, url, password) {
        var content = new ImageFileContent();
        return _init_file_content(content, data, filename, url, password);
    };

    /**
     *  Create audio content
     *
     * @param {TransportableData} data - file data
     * @param {String} filename        - file name
     * @param {String} url             - download URL
     * @param {DecryptKey} password    - download key
     * @return {AudioContent}
     */
    FileContent.audio = function (data, filename, url, password) {
        var content = new AudioFileContent();
        return _init_file_content(content, data, filename, url, password);
    };

    /**
     *  Create video content
     *
     * @param {TransportableData} data - file data
     * @param {String} filename        - file name
     * @param {String} url             - download URL
     * @param {DecryptKey} password    - download key
     * @return {VideoContent}
     */
    FileContent.video = function (data, filename, url, password) {
        var content = new VideoFileContent();
        return _init_file_content(content, data, filename, url, password);
    };


    /**
     *  Image message: {
     *      type : i2s(0x12),
     *      sn   : 123,
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
     *      },
     *      thumbnail : "data:image/jpeg;base64,..."
     *  }
     */
    dkd.protocol.ImageContent = Interface(null, [FileContent]);
    var ImageContent = dkd.protocol.ImageContent;

    // PortableNetworkFile
    ImageContent.prototype.setThumbnail = function (image) {};
    ImageContent.prototype.getThumbnail = function () {};


    /**
     *  Video message: {
     *      type : i2s(0x16),
     *      sn   : 123,
     *
     *      data     : "...",        // base64_encode(fileContent)
     *      filename : "movie.mp4",
     *
     *      URL      : "http://...", // download from CDN
     *      // before fileContent uploaded to a public CDN,
     *      // it should be encrypted by a symmetric key
     *      key      : {             // symmetric key to decrypt file content
     *          algorithm : "AES",   // "DES", ...
     *          data      : "{BASE64_ENCODE}",
     *          ...
     *      },
     *      snapshot : "data:image/jpeg;base64,..."
     *  }
     */
    dkd.protocol.VideoContent = Interface(null, [FileContent]);
    var VideoContent = dkd.protocol.VideoContent;

    // PortableNetworkFile
    VideoContent.prototype.setSnapshot = function (image) {};
    VideoContent.prototype.getSnapshot = function () {};


    /**
     *  Audio message: {
     *      type : i2s(0x14),
     *      sn   : 123,
     *
     *      data     : "...",        // base64_encode(fileContent)
     *      filename : "movie.mp4",
     *
     *      URL      : "http://...", // download from CDN
     *      // before fileContent uploaded to a public CDN,
     *      // it should be encrypted by a symmetric key
     *      key      : {             // symmetric key to decrypt file content
     *          algorithm : "AES",   // "DES", ...
     *          data      : "{BASE64_ENCODE}",
     *          ...
     *      },
     *      text     : "...",          // Automatic Speech Recognition
     *  }
     */
    dkd.protocol.AudioContent = Interface(null, [FileContent]);
    var AudioContent = dkd.protocol.AudioContent;

    AudioContent.prototype.setText = function (asr) {};
    AudioContent.prototype.getText = function () {};
