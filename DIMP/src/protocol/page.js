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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Base64 = ns.format.Base64;
    var Content = ns.protocol.Content;

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
    var PageContent = function () {};
    ns.Interface(PageContent, [Content]);

    /**
     *  Set webpage URL
     * @param {String} url
     */
    PageContent.prototype.setURL = function (url) {
        ns.assert(false, 'implement me!');
    };
    PageContent.prototype.getURL = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    PageContent.getURL = function (content) {
        return content['URL'];
    };
    PageContent.setURL = function (url, content) {
        if (url/* && url.indexOf('://') > 0*/) {
            content['URL'] = url;
        } else {
            delete content['URL'];
        }
    };

    /**
     *  Set webpage title
     *
     * @param {String} title
     */
    PageContent.prototype.setTitle = function (title) {
        ns.assert(false, 'implement me!');
    };
    PageContent.prototype.getTitle = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    PageContent.getTitle = function (content) {
        return content['title'];
    };
    PageContent.setTitle = function (title, content) {
        if (title/* && title.length > 0*/) {
            content['title'] = title;
        } else {
            delete content['title'];
        }
    };

    /**
     *  Get webpage description
     *
     * @param {String} text
     */
    PageContent.prototype.setDesc = function (text) {
        ns.assert(false, 'implement me!');
    };
    PageContent.prototype.getDesc = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    PageContent.getDesc = function (content) {
        return content['desc'];
    };
    PageContent.setDesc = function (text, content) {
        if (text/* && text.length > 0*/) {
            content['desc'] = text;
        } else {
            delete content['desc'];
        }
    };

    /**
     *  Set small image data
     *
     * @param {Uint8Array} image
     */
    PageContent.prototype.setIcon = function (image) {
        ns.assert(false, 'implement me!');
    };
    PageContent.prototype.getIcon = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    PageContent.setIcon = function (image, content) {
        if (image/* && image.length > 0*/) {
            content['icon'] = Base64.encode(image);
        } else {
            delete content['icon'];
        }
    };
    PageContent.getIcon = function (content) {
        var base64 = content['icon'];
        if (base64/* && base64.length > 0*/) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };

    //-------- namespace --------
    ns.protocol.PageContent = PageContent;

    ns.protocol.registers('PageContent');

})(DIMP);
