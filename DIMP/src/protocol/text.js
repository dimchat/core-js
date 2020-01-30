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

//! require <dkd.js>

!function (ns) {
    'use strict';

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;

    /**
     *  Text message: {
     *      type : 0x01,
     *      sn   : 123,
     *
     *      text : "..."
     *  }
     */
    var TextContent = function (content) {
        if (!content) {
            // create empty text content
            Content.call(this, ContentType.TEXT);
        } else if (typeof content === 'string') {
            // create text content with message string
            Content.call(this, ContentType.TEXT);
            this.setText(content);
        } else {
            // create text content
            Content.call(this, content);
        }
    };
    TextContent.inherits(Content);

    //-------- setter/getter --------

    TextContent.prototype.getText = function () {
        return this.getValue('text');
    };

    TextContent.prototype.setText = function (text) {
        this.setValue('text', text);
    };

    //-------- register --------
    Content.register(ContentType.TEXT, TextContent);

    //-------- namespace --------
    ns.protocol.TextContent = TextContent;

}(DIMP);
