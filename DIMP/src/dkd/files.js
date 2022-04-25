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

//! require 'protocol/files.js'
//! require 'file.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;

    /**
     *  Create image content
     *
     *  Usages:
     *      1. new ImageFileContent();
     *      2. new ImageFileContent(map);
     *      3. new ImageFileContent(filename, data);
     */
    var ImageFileContent = function () {
        if (arguments.length === 0) {
            // new ImageFileContent();
            BaseFileContent.call(this, ContentType.IMAGE);
        } else if (arguments.length === 1) {
            // new ImageFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new ImageFileContent(filename, data);
            BaseFileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('image content arguments error: ' + arguments);
        }
        this.__thumbnail = null;
    };
    ns.Class(ImageFileContent, BaseFileContent, [ImageContent]);

    // Override
    ImageFileContent.prototype.getThumbnail = function () {
        if (!this.__thumbnail) {
            var dict = this.toMap();
            this.__thumbnail = ImageContent.getThumbnail(dict);
        }
        return this.__thumbnail;
    };

    // Override
    ImageFileContent.prototype.setThumbnail = function (image) {
        var dict = this.toMap();
        ImageContent.setThumbnail(image, dict);
        this.__thumbnail = image;
    };

    /**
     *  Create video message content
     *
     *  Usages:
     *      1. new VideoFileContent();
     *      2. new VideoFileContent(map);
     *      3. new VideoFileContent(filename, data);
     */
    var VideoFileContent = function () {
        if (arguments.length === 0) {
            // new VideoFileContent();
            BaseFileContent.call(this, ContentType.VIDEO);
        } else if (arguments.length === 1) {
            // new VideoFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new VideoFileContent(filename, data);
            BaseFileContent.call(this, ContentType.VIDEO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('video content arguments error: ' + arguments);
        }
        this.__snapshot = null;
    };
    ns.Class(VideoFileContent, BaseFileContent, [VideoContent]);

    // Override
    VideoFileContent.prototype.getSnapshot = function () {
        if (!this.__snapshot) {
            var dict = this.toMap();
            this.__snapshot = VideoContent.getSnapshot(dict);
        }
        return this.__snapshot;
    };

    // Override
    VideoFileContent.prototype.setSnapshot = function (image) {
        var dict = this.toMap();
        VideoContent.setSnapshot(image, dict);
        this.__snapshot = image;
    };

    /**
     *  Create audio message content
     *
     *  Usages:
     *      1. new AudioFileContent();
     *      2. new AudioFileContent(map);
     *      3. new AudioFileContent(filename, data);
     */
    var AudioFileContent = function () {
        if (arguments.length === 0) {
            // new AudioFileContent();
            BaseFileContent.call(this, ContentType.AUDIO);
        } else if (arguments.length === 1) {
            // new AudioFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new AudioFileContent(filename, data);
            BaseFileContent.call(this, ContentType.AUDIO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('audio content arguments error: ' + arguments);
        }
    };
    ns.Class(AudioFileContent, BaseFileContent, [AudioContent]);

    // Override
    AudioFileContent.prototype.getText = function () {
        return this.getValue('text');
    };

    // Override
    AudioFileContent.prototype.setText = function (asr) {
        this.setValue('text', asr);
    };

    //
    //  Factories
    //

    /**
     *  Create file content
     *
     * @param {String} filename
     * @param {Uint8Array} data
     * @return {FileContent}
     */
    FileContent.file = function (filename, data) {
        return new BaseFileContent(filename, data);
    };

    /**
     *  Create image content
     *
     * @param {String} filename
     * @param {Uint8Array} data
     * @return {ImageContent}
     */
    FileContent.image = function (filename, data) {
        return new ImageFileContent(filename, data);
    };

    /**
     *  Create audio content
     *
     * @param {String} filename
     * @param {Uint8Array} data
     * @return {AudioContent}
     */
    FileContent.audio = function (filename, data) {
        return new AudioFileContent(filename, data);
    };

    /**
     *  Create video content
     *
     * @param {String} filename
     * @param {Uint8Array} data
     * @return {VideoContent}
     */
    FileContent.video = function (filename, data) {
        return new VideoFileContent(filename, data);
    };

    //-------- namespace --------
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;

    ns.dkd.registers('ImageFileContent');
    ns.dkd.registers('VideoFileContent');
    ns.dkd.registers('AudioFileContent');

})(DIMP);
