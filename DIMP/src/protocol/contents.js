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

    var Interface = ns.type.Interface;

    var Content         = ns.protocol.Content;
    var ReliableMessage = ns.protocol.ReliableMessage;

    /**
     *  Text message: {
     *      type : 0x01,
     *      sn   : 123,
     *
     *      text : "..."
     *  }
     */
    var TextContent = Interface(null, [Content]);

    TextContent.prototype.setText = function (text) {};
    TextContent.prototype.getText = function () {};

    //
    //  factory method
    //

    TextContent.create = function (text) {
        return new ns.dkd.BaseTextContent(text);
    };

    /**
     *  Content Array message: {
     *      type : 0xCA,
     *      sn   : 123,
     *
     *      contents : [...]  // content array
     *  }
     */
    var ArrayContent = Interface(null, [Content]);

    ArrayContent.prototype.getContents = function () {};

    //
    //  conveniences
    //

    ArrayContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item);
            }
        }
        return array;
    };
    ArrayContent.revert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = contents[i];
            if (Interface.conforms(item, Content)) {
                array.push(item.toMap());
            } else {
                // error
                array.push(item);
            }
        }
        return array;
    };

    //
    //  factory method
    //

    ArrayContent.create = function (contents) {
        return new ns.dkd.ListContent(contents);
    };

    /**
     *  Top-Secret message: {
     *      type : 0xFF,
     *      sn   : 456,
     *
     *      forward : {...}  // reliable (secure + certified) message
     *      secrets : [...]  // reliable (secure + certified) messages
     *  }
     */
    var ForwardContent = Interface(null, [Content]);

    ForwardContent.prototype.getForward = function () {};
    ForwardContent.prototype.getSecrets = function () {};

    //
    //  conveniences
    //

    ForwardContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg);
            }
        }
        return array;
    };
    ForwardContent.revert = function (messages) {
        var array = [];
        var item;
        for (var i = 0; i < messages.length; ++i) {
            item = messages[i];
            if (Interface.conforms(item, ReliableMessage)) {
                array.push(item.toMap());
            } else {
                // error
                array.push(item);
            }
        }
        return array;
    };

    //
    //  factory method
    //

    ForwardContent.create = function (secrets) {
        return new ns.dkd.SecretContent(secrets);
    };

    /**
     *  Web Page message: {
     *      type : 0x20,
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
    var PageContent = Interface(null, [Content]);

    PageContent.prototype.setTitle = function (title) {};
    PageContent.prototype.getTitle = function () {};

    // Base-64 image
    PageContent.prototype.setIcon = function (pnf) {};
    PageContent.prototype.getIcon = function () {};

    PageContent.prototype.setDesc = function (text) {};
    PageContent.prototype.getDesc = function () {};

    PageContent.prototype.getURL = function () {};
    PageContent.prototype.setURL = function (url) {};

    PageContent.prototype.getHTML = function () {};
    PageContent.prototype.setHTML = function (url) {};

    //
    //  factory method
    //

    PageContent.create = function (info) {
        var content = new ns.dkd.WebPageContent();
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
     *      type : 0xCA,
     *      sn   : 123,
     *
     *      ID     : "{ID}",        // contact's ID
     *      name   : "{nickname}}", // contact's name
     *      avatar : "{URL}",       // avatar - PNF(URL)
     *  }
     */
    var NameCard = Interface(null, [Content]);

    NameCard.prototype.getIdentifier = function () {};
    NameCard.prototype.getName = function () {};
    NameCard.prototype.getAvatar = function () {};

    //
    //  factory method
    //

    NameCard.create = function (identifier, mame, avatar) {
        var content = new ns.dkd.NameCardContent(identifier);
        content.setName(name);
        content.setAvatar(avatar);
        return content;
    };

    //-------- namespace --------
    ns.protocol.TextContent = TextContent;
    ns.protocol.ArrayContent = ArrayContent;
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.PageContent = PageContent;
    ns.protocol.NameCard = NameCard;

})(DIMP);
