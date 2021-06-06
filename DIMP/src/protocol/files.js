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

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;

    /**
     *  Create image content
     *
     *  Usages:
     *      1. new ImageContent();
     *      2. new ImageContent(map);
     *      3. new ImageContent(filename, data);
     */
    var ImageContent = function () {
        if (arguments.length === 0) {
            // new ImageContent();
            FileContent.call(this, ContentType.IMAGE);
        } else if (arguments.length === 1) {
            // new ImageContent(map);
            FileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new ImageContent(filename, data);
            FileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('image content arguments error: ' + arguments);
        }
        this.__thumbnail = null;
    };
    ns.Class(ImageContent, FileContent, null);

    ImageContent.getThumbnail = function (content) {
        var base64 = content['thumbnail'];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    ImageContent.setThumbnail = function (image, content) {
        if (image && image.length > 0) {
            content['thumbnail'] = ns.format.Base64.encode(image);
        } else {
            delete content['thumbnail'];
        }
    }

    //-------- setter/getter --------

    /**
     *  Get small image data
     *
     * @returns {Uint8Array}
     */
    ImageContent.prototype.getThumbnail = function () {
        if (!this.__thumbnail) {
            this.__thumbnail = ImageContent.getThumbnail(this.getMap());
        }
        return this.__thumbnail;
    };
    /**
     *  Set small image data
     *
     * @param {Uint8Array} image
     */
    ImageContent.prototype.setThumbnail = function (image) {
        ImageContent.setThumbnail(image, this.getMap());
        this.__thumbnail = image;
    };

    //-------- namespace --------
    ns.protocol.ImageContent = ImageContent;

    ns.protocol.register('ImageContent');

})(DIMP);

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

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;

    /**
     *  Create video message content
     *
     *  Usages:
     *      1. new VideoContent();
     *      2. new VideoContent(map);
     *      3. new VideoContent(filename, data);
     */
    var VideoContent = function () {
        if (arguments.length === 0) {
            // new VideoContent();
            FileContent.call(this, ContentType.VIDEO);
        } else if (arguments.length === 1) {
            // new VideoContent(map);
            FileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new VideoContent(filename, data);
            FileContent.call(this, ContentType.VIDEO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('video content arguments error: ' + arguments);
        }
        this.__snapshot = null;
    };
    ns.Class(VideoContent, FileContent, null);

    VideoContent.getSnapshot = function (content) {
        var base64 = content['snapshot'];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    VideoContent.setSnapshot = function (image, content) {
        if (image && image.length > 0) {
            content['snapshot'] = ns.format.Base64.encode(image);
        } else {
            delete content['snapshot'];
        }
    }

    //-------- setter/getter --------

    /**
     *  Get small image data
     *
     * @returns {Uint8Array}
     */
    VideoContent.prototype.getSnapshot = function () {
        if (!this.__snapshot) {
            this.__snapshot = VideoContent.getSnapshot(this.getMap());
        }
        return this.__snapshot;
    };
    /**
     *  Set small image data
     *
     * @param {Uint8Array} image
     */
    VideoContent.prototype.setSnapshot = function (image) {
        VideoContent.setSnapshot(image, this.getMap());
        this.__snapshot = image;
    };

    //-------- namespace --------
    ns.protocol.VideoContent = VideoContent;

    ns.protocol.register('VideoContent');

})(DIMP);

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

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;

    /**
     *  Create audio message content
     *
     *  Usages:
     *      1. new AudioContent();
     *      2. new AudioContent(map);
     *      3. new AudioContent(filename, data);
     */
    var AudioContent = function () {
        if (arguments.length === 0) {
            // new AudioContent();
            FileContent.call(this, ContentType.AUDIO);
        } else if (arguments.length === 1) {
            // new AudioContent(map);
            FileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new AudioContent(filename, data);
            FileContent.call(this, ContentType.AUDIO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('audio content arguments error: ' + arguments);
        }
    };
    ns.Class(AudioContent, FileContent, null);

    //-------- setter/getter --------

    /**
     *  Get ASR text
     *
     * @returns {String}
     */
    AudioContent.prototype.getText = function () {
        return this.getValue('text');
    };
    /**
     *  Set ASR text
     *
     * @param {String} asr
     */
    AudioContent.prototype.setText = function (asr) {
        this.setValue('text', asr);
    };

    //-------- namespace --------
    ns.protocol.AudioContent = AudioContent;

    ns.protocol.register('AudioContent');

})(DIMP);
