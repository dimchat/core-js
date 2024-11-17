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

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var BaseFileWrapper = ns.format.BaseFileWrapper;

    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create file content
     *
     *  Usages:
     *      1. new BaseFileContent(map);
     *      2. new BaseFileContent(type);
     *      3. new BaseFileContent();
     */
    var BaseFileContent = function (info) {
        if (!info) {
            // new BaseFileContent();
            BaseContent.call(this, ContentType.FIRE.valueOf);
        } else if (info instanceof ContentType) {
            // new BaseFileContent(type);
            BaseContent.call(this, info.valueOf());
        // } else if (IObject.isNumber(info)) {
        //     // new BaseFileContent(type);
        //     BaseContent.call(this, info);
        } else {
            // new BaseFileContent(map);
            BaseContent.call(this, info);
        }
        this.__wrapper = new BaseFileWrapper(this.toMap());
    };
    Class(BaseFileContent, BaseContent, [FileContent], {

        // Override
        getData: function () {
            var ted = this.__wrapper.getData();
            return !ted ? null : ted.getData();
        },

        // Override
        setData: function (data) {
            this.__wrapper.setBinaryData(data);
        },
        setTransportableData: function (ted) {
            this.__wrapper.setData(ted);
        },

        // Override
        getFilename: function () {
            return this.__wrapper.getFilename();
        },

        // Override
        setFilename: function (filename) {
            this.__wrapper.setFilename(filename);
        },

        // Override
        getURL: function () {
            return this.__wrapper.getURL();
        },

        // Override
        setURL: function (url) {
            this.__wrapper.setURL(url);
        },

        // Override
        getPassword: function () {
            return this.__wrapper.getPassword();
        },

        // Override
        setPassword: function (key) {
            this.__wrapper.setPassword(key);
        }
    });

    //-------- namespace --------
    ns.dkd.BaseFileContent = BaseFileContent;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class     = ns.type.Class;
    var IObject   = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ContentType  = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;

    /**
     *  Create image content
     *
     *  Usages:
     *      1. new ImageFileContent(map);
     *      2. new ImageFileContent();
     */
    var ImageFileContent = function (info) {
        if (!info) {
            // new ImageFileContent();
            BaseFileContent.call(this, ContentType.IMAGE);
        } else {
            // new ImageFileContent(map);
            BaseFileContent.call(this, info);
        }
        this.__thumbnail = null;
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {

        // Override
        getThumbnail: function () {
            var pnf = this.__thumbnail;
            if (!pnf) {
                var base64 = this.getString('thumbnail', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__thumbnail = pnf;
            }
            return pnf;
        },

        // Override
        setThumbnail: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('thumbnail');
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('thumbnail', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('thumbnail', image);
            }
            this.__thumbnail = pnf;
        }
    });

    /**
     *  Create video message content
     *
     *  Usages:
     *      1. new VideoFileContent(map);
     *      2. new VideoFileContent();
     */
    var VideoFileContent = function (info) {
        if (!info) {
            // new VideoFileContent();
            BaseFileContent.call(this, ContentType.VIDEO);
        } else {
            // new VideoFileContent(map);
            BaseFileContent.call(this, info);
        }
        this.__snapshot = null;
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {

        // Override
        getSnapshot: function () {
            var pnf = this.__snapshot;
            if (!pnf) {
                var base64 = this.getString('snapshot', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__snapshot = pnf;
            }
            return pnf;
        },

        // Override
        setSnapshot: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('snapshot');
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('snapshot', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('snapshot', image);
            }
            this.__snapshot = pnf;
        }
    });

    /**
     *  Create audio message content
     *
     *  Usages:
     *      1. new AudioFileContent(map);
     *      2. new AudioFileContent();
     */
    var AudioFileContent = function (info) {
        if (!info) {
            // new AudioFileContent();
            BaseFileContent.call(this, ContentType.AUDIO);
        } else {
            // new AudioFileContent(map);
            BaseFileContent.call(this, info);
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {

        // Override
        getText: function () {
            return this.getString('text', null);
        },

        // Override
        setText: function (asr) {
            this.setValue('text', asr);
        }
    });

    //-------- namespace --------
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;

})(DIMP);
