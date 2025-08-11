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

//! require <dkd.js>

    /**
     *  Text message: {
     *      type : i2s(0x01),
     *      sn   : 123,
     *
     *      text : "..."
     *  }
     */
    dkd.protocol.TextContent = Interface(null, [Content]);
    var TextContent = dkd.protocol.TextContent;

    TextContent.prototype.getText = function () {};

    //
    //  Factory
    //
    TextContent.create = function (text) {
        return new BaseTextContent(text);
    };


    /**
     *  Web Page message: {
     *      type : i2s(0x20),
     *      sn   : 123,
     *
     *      title : "...",                // Web title
     *      desc  : "...",
     *      icon  : "data:image/x-icon;base64,...",  // PNF
     *
     *      URL   : "https://github.com/moky/dimp",  // Page URL
     *
     *      HTML      : "...",            // Web content
     *      mime_type : "text/html",      // Content-Type
     *      encoding  : "utf8",
     *      base      : "about:blank"     // Base URL
     *  }
     */
    dkd.protocol.PageContent = Interface(null, [Content]);
    var PageContent = dkd.protocol.PageContent;

    PageContent.prototype.setTitle = function (title) {};
    PageContent.prototype.getTitle = function () {};

    /**
     *  Base-64 image
     *
     * @param {PortableNetworkFile} pnf
     */
    PageContent.prototype.setIcon = function (pnf) {};
    PageContent.prototype.getIcon = function () {};

    PageContent.prototype.setDesc = function (text) {};
    PageContent.prototype.getDesc = function () {};

    PageContent.prototype.getURL = function () {};
    PageContent.prototype.setURL = function (url) {};

    PageContent.prototype.getHTML = function () {};
    PageContent.prototype.setHTML = function (url) {};

    //
    //  Factory
    //
    PageContent.create = function (info) {
        var content = new WebPageContent();
        var title = info['title'];
        if (title) {
            content.setTitle(title);
        }
        var desc = info['desc'];
        if (desc) {
            content.setDesc(desc);
        }
        var url = info['URL'];
        if (url) {
            content.setURL(url);
        }
        var html = info['HTML'];
        if (html) {
            content.setHTML(html);
        }
        var icon = info['icon'];
        if (icon) {
            content.setIcon(icon);
        }
        return content;
    };


    /**
     *  Name Card content: {
     *      type : i2s(0x33),
     *      sn   : 123,
     *
     *      did    : "{ID}",        // contact's ID
     *      name   : "{nickname}}", // contact's name
     *      avatar : "{URL}",       // avatar - PNF(URL)
     *  }
     */
    dkd.protocol.NameCard = Interface(null, [Content]);
    var NameCard = dkd.protocol.NameCard;

    NameCard.prototype.getIdentifier = function () {};
    NameCard.prototype.getName = function () {};
    NameCard.prototype.getAvatar = function () {};

    //
    //  Factory
    //
    NameCard.create = function (identifier, mame, avatar) {
        var content = new NameCardContent(identifier);
        content.setName(name);
        content.setAvatar(avatar);
        return content;
    };
