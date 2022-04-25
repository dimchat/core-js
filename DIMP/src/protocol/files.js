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

    var Base64 = ns.format.Base64;
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
    var ImageContent = function () {};
    ns.Interface(ImageContent, [FileContent]);

    /**
     *  Set small image data
     *
     * @param {Uint8Array} image data
     */
    ImageContent.prototype.setThumbnail = function (image) {
        console.assert(false, 'implement me!');
    };
    ImageContent.prototype.getThumbnail = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    ImageContent.setThumbnail = function (image, content) {
        if (image/* && image.length > 0*/) {
            content['thumbnail'] = Base64.encode(image);
        } else {
            delete content['thumbnail'];
        }
    }
    ImageContent.getThumbnail = function (content) {
        var base64 = content['thumbnail'];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
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
    var VideoContent = function () {};
    ns.Interface(VideoContent, [FileContent]);

    /**
     *  Set small image data
     *
     * @param {Uint8Array} image data
     */
    VideoContent.prototype.setSnapshot = function (image) {
        console.assert(false, 'implement me!');
    };
    VideoContent.prototype.getSnapshot = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    VideoContent.setSnapshot = function (image, content) {
        if (image/* && image.length > 0*/) {
            content['snapshot'] = Base64.encode(image);
        } else {
            delete content['snapshot'];
        }
    }
    VideoContent.getSnapshot = function (content) {
        var base64 = content['snapshot'];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
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
    var AudioContent = function () {};
    ns.Interface(AudioContent, [FileContent]);

    /**
     *  Set ASR text
     *
     * @param {String} asr
     */
    AudioContent.prototype.setText = function (asr) {
        console.assert(false, 'implement me!');
    };
    AudioContent.prototype.getText = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;

    ns.protocol.registers('ImageContent');
    ns.protocol.registers('VideoContent');
    ns.protocol.registers('AudioContent');

})(DIMP);
