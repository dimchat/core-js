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
 *  Text message: {
 *      type : 0x01,
 *      sn   : 123,
 *
 *      text : "..."
 *  }
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new TextContent();
     *      2. new TextContent(text);
     *      3. new TextContent(map);
     */
    var TextContent = function () {
        if (arguments.length === 0) {
            // new TextContent();
            BaseContent.call(this, ContentType.TEXT);
        } else if (typeof arguments[0] === 'string') {
            // new TextContent(text);
            BaseContent.call(this, ContentType.TEXT);
            this.setText(arguments[0]);
        } else {
            // new TextContent(map);
            BaseContent.call(this, arguments[0]);
        }
    };
    ns.Class(TextContent, BaseContent, null);

    //-------- setter/getter --------

    TextContent.prototype.getText = function () {
        return this.getValue('text');
    };

    TextContent.prototype.setText = function (text) {
        this.setValue('text', text);
    };

    //-------- namespace --------
    ns.protocol.TextContent = TextContent;

    ns.protocol.register('TextContent');

})(DIMP);
