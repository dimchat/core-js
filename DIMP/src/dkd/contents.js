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

//! require 'protocol/contents.js'
//! require 'base.js'

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new BaseTextContent(map);
     *      2. new BaseTextContent(text);
     */
    dkd.dkd.BaseTextContent = function (info) {
        if (IObject.isString(info)) {
            // new BaseTextContent(text);
            BaseContent.call(this, ContentType.TEXT);
            this.setText(info);
        } else {
            // new BaseTextContent(map);
            BaseContent.call(this, info);
        }
    };
    var BaseTextContent = dkd.dkd.BaseTextContent;

    Class(BaseTextContent, BaseContent, [TextContent]);

    Implementation(BaseTextContent, {

        // Override
        getText: function () {
            return this.getString('text', '');
        },

        // Override
        setText: function (text) {
            this.setValue('text', text);
        }
    });


    /**
     *  Create web page message content
     *
     *  Usages:
     *      1. new WebPageContent(map);
     *      2. new WebPageContent();
     */
    dkd.dkd.WebPageContent = function (info) {
        if (info) {
            // new WebPageContent(map);
            BaseContent.call(this, info);
        } else {
            // new WebPageContent();
            BaseContent.call(this, ContentType.PAGE);
        }
        this.__icon = null;
    };
    var WebPageContent = dkd.dkd.WebPageContent;

    Class(WebPageContent, BaseContent, [PageContent]);

    Implementation(WebPageContent, {

        // Override
        getTitle: function () {
            return this.getString('title', '');
        },
        // Override
        setTitle: function (title) {
            this.setValue('title', title);
        },

        // Override
        getDesc: function () {
            return this.getString('desc', null);
        },
        // Override
        setDesc: function (text) {
            this.setValue('desc', text);
        },

        // Override
        getURL: function () {
            return this.getString('URL', null);
        },
        // Override
        setURL: function (url) {
            this.setValue('URL', url);
        },

        // Override
        getHTML: function () {
            return this.getString('HTML', null);
        },
        // Override
        setHTML: function (html) {
            this.setValue('HTML', html);
        },

        // Override
        getIcon: function () {
            var pnf = this.__icon;
            if (!pnf) {
                var url = this.getString('icon', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf;
            }
            return pnf;
        },
        // Override
        setIcon: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('icon', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('icon', image);
            } else {
                this.removeValue('icon');
            }
            this.__icon = pnf;
        }
    });

    /**
     *  Create name card content
     *
     *  Usages:
     *      1. new NameCardContent(map);
     *      2. new NameCardContent(did);
     */
    dkd.dkd.NameCardContent = function (info) {
        if (Interface.conforms(info, ID)) {
            // new NameCardContent(did);
            BaseContent.call(this, ContentType.NAME_CARD);
            this.setString('did', info);
        } else {
            // new NameCardContent(map);
            BaseContent.call(this, info);
        }
        this.__image = null;
    };
    var NameCardContent = dkd.dkd.NameCardContent;

    Class(NameCardContent, BaseContent, [NameCard]);

    Implementation(NameCardContent, {

        // Override
        getIdentifier: function () {
            var id = this.getValue('did');
            return ID.parse(id);
        },

        // Override
        getName: function () {
            return this.getString('name', '');
        },
        setName: function (name) {
            this.setValue('name', name);
        },

        // Override
        getAvatar: function () {
            var pnf = this.__image;
            if (!pnf) {
                var url = this.getString('avatar', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf;
            }
            return pnf;
        },
        setAvatar: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('avatar', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('avatar', image);
            } else {
                this.removeValue('avatar');
            }
            this.__image = pnf;
        }
    });
