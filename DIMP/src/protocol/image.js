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
//! require 'file.js'

!function (ns) {

    var Base64 = ns.format.Base64;

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;

    /**
     *  Image message: {
     *      type : 0x12,
     *      sn   : 123,
     *
     *      URL      : "http://",      // for encrypted file data from CDN
     *      filename : "photo.png",
     *      thumbnail : "...",         // base64_encode(smallImage)
     *  }
     */
    var ImageContent = function (content) {
        if (!content) {
            // create empty image file content
            FileContent.call(this, ContentType.IMAGE);
        } else {
            // create image file content
            FileContent.call(this, content);
        }
        this.thumbnail = null;
    };
    ImageContent.inherits(FileContent);

    //-------- setter/getter --------

    ImageContent.prototype.getThumbnail = function () {
        if (!this.thumbnail) {
            var base64 = this.getValue('thumbnail');
            if (base64) {
                this.thumbnail = Base64.decode(base64);
            }
        }
        return this.thumbnail;
    };

    ImageContent.prototype.setThumbnail = function (image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue('thumbnail', base64);
        } else {
            this.setValue('thumbnail', null);
        }
        this.thumbnail = image;
    };

    //-------- register --------
    Content.register(ContentType.IMAGE, ImageContent);

    //-------- namespace --------
    ns.protocol.ImageContent = ImageContent;

}(DIMP);
