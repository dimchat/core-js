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

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;

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
    var PageContent = function (content) {
        if (typeof content === 'string') {
            // create web page content with URL
            Content.call(this, ContentType.PAGE);
            this.setURL(content);
        } else {
            // create text content
            Content.call(this, content);
        }
    };
    PageContent.inherits(Content);

    //-------- setter/getter --------

    PageContent.prototype.getURL = function () {
        return this.getValue('URL');
    };
    PageContent.prototype.setURL = function (url) {
        this.setValue('URL', url);
    };

    //-------- register --------
    Content.register(ContentType.TEXT, TextContent);

    //-------- namespace --------
    ns.protocol.TextContent = TextContent;

}(DIMP);
