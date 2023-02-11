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

    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;

    /**
     *  Create image content
     *
     *  Usages:
     *      1. new ImageFileContent(map);
     *      2. new ImageFileContent(filename, data);
     */
    var ImageFileContent = function () {
        if (arguments.length === 1) {
            // new ImageFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new ImageFileContent(filename, data);
            BaseFileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('Image content arguments error: ' + arguments);
        }
        this.__thumbnail = null;
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {

        // Override
        getThumbnail: function () {
            if (this.__thumbnail === null) {
                var base64 = this.getString('thumbnail');
                if (base64) {
                    this.__thumbnail = Base64.decode(base64);
                }
            }
            return this.__thumbnail;
        },

        // Override
        setThumbnail: function (image) {
            if (image && image.length > 0) {
                this.setValue('thumbnail', Base64.encode(image));
            } else {
                this.removeValue('thumbnail');
            }
            this.__thumbnail = image;
        }
    });

    /**
     *  Create video message content
     *
     *  Usages:
     *      1. new VideoFileContent(map);
     *      2. new VideoFileContent(filename, data);
     */
    var VideoFileContent = function () {
        if (arguments.length === 1) {
            // new VideoFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new VideoFileContent(filename, data);
            BaseFileContent.call(this, ContentType.VIDEO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('Video content arguments error: ' + arguments);
        }
        this.__snapshot = null;
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {

        // Override
        getSnapshot: function () {
            if (this.__snapshot === null) {
                var base64 = this.getString('snapshot');
                if (base64) {
                    this.__snapshot = Base64.decode(base64);
                }
            }
            return this.__snapshot;
        },

        // Override
        setSnapshot: function (image) {
            if (image && image.length > 0) {
                this.setValue('snapshot', Base64.encode(image));
            } else {
                this.removeValue('snapshot');
            }
            this.__snapshot = image;
        }
    });

    /**
     *  Create audio message content
     *
     *  Usages:
     *      1. new AudioFileContent(map);
     *      2. new AudioFileContent(filename, data);
     */
    var AudioFileContent = function () {
        if (arguments.length === 1) {
            // new AudioFileContent(map);
            BaseFileContent.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new AudioFileContent(filename, data);
            BaseFileContent.call(this, ContentType.AUDIO, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('Audio content arguments error: ' + arguments);
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {

        // Override
        getText: function () {
            return this.getString('text');
        },

        // Override
        setText: function (asr) {
            this.setValue('text', asr);
        }
    });

    //
    //  Factories
    //

    //-------- namespace --------
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;

})(DIMP);
