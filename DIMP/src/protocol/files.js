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

//! require 'file.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var FileContent = ns.protocol.FileContent;

    /**
     *  Image message: {
     *      type : 0x12,
     *      sn   : 123,
     *
     *      URL      : "http://",      // for encrypted file data from CDN
     *      filename : "photo.png",
     *      thumbnail : "...",         // base64_encode(smallImage)
     *  }
     */
    var ImageContent = Interface(null, [FileContent]);

    /**
     *  Set small image data
     *
     * @param {Uint8Array} image data
     */
    ImageContent.prototype.setThumbnail = function (image) {
        throw new Error('NotImplemented');
    };
    ImageContent.prototype.getThumbnail = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Video message: {
     *      type : 0x16,
     *      sn   : 123,
     *
     *      URL      : "http://",      // for encrypted file data from CDN
     *      filename : "movie.mp4",
     *      snapshot : "...",          // base64_encode(smallImage)
     *  }
     */
    var VideoContent = Interface(null, [FileContent]);

    /**
     *  Set small image data
     *
     * @param {Uint8Array} image data
     */
    VideoContent.prototype.setSnapshot = function (image) {
        throw new Error('NotImplemented');
    };
    VideoContent.prototype.getSnapshot = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Audio message: {
     *      type : 0x14,
     *      sn   : 123,
     *
     *      URL      : "http://",      // for encrypted file data from CDN
     *      filename : "voice.mp3",
     *      data     : "...",          // if (!URL) base64_encode(audio)
     *      text     : "...",          // Automatic Speech Recognition
     *  }
     */
    var AudioContent = Interface(null, [FileContent]);

    /**
     *  Set ASR text
     *
     * @param {string} asr
     */
    AudioContent.prototype.setText = function (asr) {
        throw new Error('NotImplemented');
    };
    AudioContent.prototype.getText = function () {
        throw new Error('NotImplemented');
    };

    //-------- namespace --------
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;

})(DIMP);
