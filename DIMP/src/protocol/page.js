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

/**
 *  Web Page message: {
 *      type : 0x20,
 *      sn   : 123,
 *
 *      URL   : "https://github.com/moky/dimp", // Page URL
 *      icon  : "...",                          // base64_encode(icon)
 *      title : "...",
 *      desc  : "..."
 *  }
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;

    /**
     *  Create web page message content
     *
     *  Usages:
     *      1. new PageContent(map);
     *      2. new PageContent(url, title, desc, icon);
     */
    var PageContent = function () {
        if (arguments.length === 1) {
            // new PageContent(map);
            BaseContent.call(this, arguments[0]);
            this.icon = null;
        } else if (arguments.length === 4) {
            // new PageContent(url, title, desc, icon);
            BaseContent.call(this, ContentType.PAGE);
            this.setURL(arguments[0]);
            this.setTitle(arguments[1]);
            this.setDesc(arguments[2]);
            this.setIcon(arguments[3]);
        } else {
            throw new SyntaxError('web page content arguments error: ' + arguments);
        }
    };
    ns.Class(PageContent, BaseContent, null);

    PageContent.getURL = function (content) {
        return content['URL'];
    };
    PageContent.setURL = function (url, content) {
        if (url && url.indexOf('://') > 0) {
            content['URL'] = url;
        } else {
            delete content['URL'];
        }
    };

    PageContent.getTitle = function (content) {
        return content['title'];
    };
    PageContent.setTitle = function (title, content) {
        if (title && title.length > 0) {
            content['title'] = title;
        } else {
            delete content['title'];
        }
    };

    PageContent.getDesc = function (content) {
        return content['desc'];
    };
    PageContent.setDesc = function (text, content) {
        if (text && text.length > 0) {
            content['desc'] = text;
        } else {
            delete content['desc'];
        }
    };

    PageContent.getIcon = function (content) {
        var base64 = content['icon'];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    PageContent.setIcon = function (image, content) {
        if (image && image.length > 0) {
            content['icon'] = ns.format.Base64.encode(image);
        } else {
            delete content['icon'];
        }
    };

    //-------- setter/getter --------

    PageContent.prototype.getURL = function () {
        return PageContent.getURL(this.getMap());
    };
    PageContent.prototype.setURL = function (url) {
        PageContent.setURL(url, this.getMap());
    };

    PageContent.prototype.getTitle = function () {
        return PageContent.getTitle(this.getMap());
    };
    PageContent.prototype.setTitle = function (title) {
        PageContent.setTitle(title, this.getMap());
    };

    PageContent.prototype.getDesc = function () {
        return PageContent.getDesc(this.getMap());
    };
    PageContent.prototype.setDesc = function (text) {
        PageContent.setDesc(text, this.getMap());
    };

    /**
     *  Get small image data
     *
     * @returns {Uint8Array}
     */
    PageContent.prototype.getIcon = function () {
        if (!this.icon) {
            this.icon = PageContent.getIcon(this.getMap());
        }
        return this.icon;
    };
    /**
     *  Set small image data
     *
     * @param {Uint8Array} image
     */
    PageContent.prototype.setIcon = function (image) {
        PageContent.setIcon(image, this.getMap());
        this.icon = image;
    };

    //-------- namespace --------
    ns.protocol.PageContent = PageContent;

    ns.protocol.register('PageContent');

})(DIMP);
