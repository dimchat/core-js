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
     *  Video message: {
     *      type : 0x16,
     *      sn   : 123,
     *
     *      URL      : "http://",      // for encrypted file data from CDN
     *      filename : "movie.mp4",
     *      snapshot : "...",          // base64_encode(smallImage)
     *  }
     */
    var VideoContent = function (content) {
        if (!content) {
            // create empty video file content
            FileContent.call(this, ContentType.VIDEO);
        } else {
            // create video file content
            FileContent.call(this, content);
        }
        this.snapshot = null;
    };
    VideoContent.inherits(FileContent);

    //-------- setter/getter --------

    VideoContent.prototype.getSnapshot = function () {
        if (!this.snapshot) {
            var base64 = this.getValue('snapshot');
            if (base64) {
                this.snapshot = Base64.decode(base64);
            }
        }
        return this.snapshot;
    };

    VideoContent.prototype.setSnapshot = function (image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue('snapshot', base64);
        } else {
            this.setValue('snapshot', null);
        }
        this.snapshot = image;
    };

    //-------- register --------
    Content.register(ContentType.VIDEO, VideoContent);

    //-------- namespace --------
    ns.protocol.VideoContent = VideoContent;

}(DIMP);
