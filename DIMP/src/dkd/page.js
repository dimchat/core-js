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

//! require 'protocol/page.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var ContentType = ns.protocol.ContentType;
    var PageContent = ns.protocol.PageContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create web page message content
     *
     *  Usages:
     *      1. new WebPageContent(map);
     *      2. new WebPageContent(url, title, desc, icon);
     */
    var WebPageContent = function () {
        if (arguments.length === 1) {
            // new WebPageContent(map);
            BaseContent.call(this, arguments[0]);
            this.__icon = null;
        } else if (arguments.length === 4) {
            // new WebPageContent(url, title, desc, icon);
            BaseContent.call(this, ContentType.PAGE);
            this.__icon = null;
            this.setURL(arguments[0]);
            this.setTitle(arguments[1]);
            this.setDesc(arguments[2]);
            this.setIcon(arguments[3]);
        } else {
            throw new SyntaxError('Web page content arguments error: ' + arguments);
        }
    };
    Class(WebPageContent, BaseContent, [PageContent], {

        // Override
        getURL: function () {
            return this.getString('URL');
        },
        // Override
        setURL: function (url) {
            this.setValue('URL', url);
        },

        // Override
        getTitle: function () {
            return this.getString('title');
        },
        // Override
        setTitle: function (title) {
            this.setValue('title', title);
        },

        // Override
        getDesc: function () {
            return this.getString('desc');
        },
        // Override
        setDesc: function (text) {
            this.setValue('desc', text);
        },

        // Override
        getIcon: function () {
            if (this.__icon === null) {
                var base64 = this.getString('icon');
                if (base64) {
                    this.__icon = Base64.decode(base64);
                }
            }
            return this.__icon;
        },
        // Override
        setIcon: function (image) {
            if (image && image.length > 0) {
                this.setValue('icon', Base64.encode(image));
            } else {
                this.removeValue('icon');
            }
            this.__icon = image;
        }
    });

    //-------- namespace --------
    ns.dkd.WebPageContent = WebPageContent;

})(DIMP);
