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
            this.setURL(arguments[0]);
            this.setTitle(arguments[1]);
            this.setDesc(arguments[2]);
            this.setIcon(arguments[3]);
        } else {
            throw new SyntaxError('web page content arguments error: ' + arguments);
        }
    };
    ns.Class(WebPageContent, BaseContent, [PageContent]);

    // Override
    WebPageContent.prototype.getURL = function () {
        return PageContent.getURL(this);
    };

    // Override
    WebPageContent.prototype.setURL = function (url) {
        PageContent.setURL(url, this);
    };

    // Override
    WebPageContent.prototype.getTitle = function () {
        return PageContent.getTitle(this);
    };

    // Override
    WebPageContent.prototype.setTitle = function (title) {
        PageContent.setTitle(title, this);
    };

    // Override
    WebPageContent.prototype.getDesc = function () {
        return PageContent.getDesc(this);
    };

    // Override
    WebPageContent.prototype.setDesc = function (text) {
        PageContent.setDesc(text, this);
    };

    // Override
    WebPageContent.prototype.getIcon = function () {
        if (!this.__icon) {
            this.__icon = PageContent.getIcon(this);
        }
        return this.__icon;
    };

    // Override
    WebPageContent.prototype.setIcon = function (image) {
        PageContent.setIcon(image, this);
        this.__icon = image;
    };

    //-------- namespace --------
    ns.dkd.WebPageContent = WebPageContent;

    ns.dkd.registers('WebPageContent');

})(DIMP);