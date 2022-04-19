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

//! require 'protocol/text.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new BaseTextContent();
     *      2. new BaseTextContent(text);
     *      3. new BaseTextContent(map);
     */
    var BaseTextContent = function () {
        if (arguments.length === 0) {
            // new BaseTextContent();
            BaseContent.call(this, ContentType.TEXT);
        } else if (typeof arguments[0] === 'string') {
            // new BaseTextContent(text);
            BaseContent.call(this, ContentType.TEXT);
            this.setText(arguments[0]);
        } else {
            // new BaseTextContent(map);
            BaseContent.call(this, arguments[0]);
        }
    };
    ns.Class(BaseTextContent, BaseContent, [TextContent]);

    // Override
    BaseTextContent.prototype.getText = function () {
        return this.getValue('text');
    };

    // Override
    BaseTextContent.prototype.setText = function (text) {
        this.setValue('text', text);
    };

    //-------- namespace --------
    ns.dkd.BaseTextContent = BaseTextContent;

    ns.dkd.registers('BaseTextContent');

})(DIMP);
