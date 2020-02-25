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

//! require <dkd.js>

!function (ns) {
    'use strict';

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;

    /**
     *  Create web page message content
     *
     * @param content {{}|String}
     * @constructor
     */
    var PageContent = function (content) {
        var url = null;
        if (!content) {
            // create empty web page content
            content = ContentType.PAGE;
        } else if (typeof content === 'string') {
            // create web page content with URL
            url = content;
            content = ContentType.PAGE;
        }
        Content.call(this, content);
        if (url) {
            this.setURL(url);
        }
        this.icon = null;
    };
    ns.Class(PageContent, Content);

    //-------- setter/getter --------

    PageContent.prototype.getURL = function () {
        return this.getValue('URL');
    };
    PageContent.prototype.setURL = function (url) {
        this.setValue('URL', url);
    };

    PageContent.prototype.getTitle = function () {
        return this.getValue('title');
    };
    PageContent.prototype.setTitle = function (text) {
        this.setValue('title', text);
    };

    PageContent.prototype.getDesc = function () {
        return this.getValue('desc');
    };
    PageContent.prototype.setDesc = function (text) {
        this.setValue('desc', text);
    };

    PageContent.prototype.getIcon = function () {
        if (!this.icon) {
            var base64 = this.getValue('icon');
            if (base64) {
                this.icon = ns.format.Base64.decode(base64);
            }
        }
        return this.icon;
    };
    PageContent.prototype.setIcon = function (data) {
        var base64 = null;
        if (data) {
            base64 = ns.format.Base64.encode(data);
        }
        this.setValue('icon', base64);
        this.icon = data;
    };

    //-------- register --------
    Content.register(ContentType.PAGE, PageContent);

    //-------- namespace --------
    ns.protocol.PageContent = PageContent;

    ns.protocol.register('PageContent');

}(DIMP);
