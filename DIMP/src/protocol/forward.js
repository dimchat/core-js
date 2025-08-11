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
     *  Top-Secret message: {
     *      type : i2s(0xFF),
     *      sn   : 456,
     *
     *      forward : {...}  // reliable (secure + certified) message
     *      secrets : [...]  // reliable (secure + certified) messages
     *  }
     */
    dkd.protocol.ForwardContent = Interface(null, [Content]);
    var ForwardContent = dkd.protocol.ForwardContent;

    ForwardContent.prototype.getForward = function () {};
    ForwardContent.prototype.getSecrets = function () {};

    //
    //  Factory
    //
    ForwardContent.create = function (secrets) {
        return new SecretContent(secrets);
    };


    /**
     *  Combine Forward message: {
     *      type : i2s(0xCF),
     *      sn   : 123,
     *
     *      title    : "...",  // chat title
     *      messages : [...]   // chat history (Instant Messages)
     *  }
     */
    dkd.protocol.CombineContent = Interface(null, [Content]);
    var CombineContent = dkd.protocol.CombineContent;

    CombineContent.prototype.getTitle = function () {};
    CombineContent.prototype.getMessages = function () {};

    //
    //  Factory
    //
    ForwardContent.create = function (title, messages) {
        return new CombineForwardContent(title, messages);
    };


    /**
     *  Content Array message: {
     *      type : i2s(0xCA),
     *      sn   : 123,
     *
     *      contents : [...]  // content array
     *  }
     */
    dkd.protocol.ArrayContent = Interface(null, [Content]);
    var ArrayContent = dkd.protocol.ArrayContent;

    ArrayContent.prototype.getContents = function () {};

    //
    //  Factory
    //
    ArrayContent.create = function (contents) {
        return new ListContent(contents);
    };
