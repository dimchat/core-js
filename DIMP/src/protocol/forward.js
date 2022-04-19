;
// license: https://mit-license.org
//
//  Dao-Ke-Dao: Universal Message Module
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

    var Wrapper = ns.type.Wrapper;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Content = ns.protocol.Content;

    /**
     *  Top-Secret message: {
     *      type : 0xFF,
     *      sn   : 456,
     *
     *      forward : {...}  // reliable (secure + certified) message
     *  }
     */
    var ForwardContent = function () {};
    ns.Interface(ForwardContent, [Content]);

    /**
     *  Set secret message
     *
     * @param {ReliableMessage} secret - message to be forwarded
     */
    ForwardContent.prototype.setMessage = function (secret) {
        console.assert(false, 'implement me!');
    };
    ForwardContent.prototype.getMessage = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    ForwardContent.getMessage = function (content) {
        content = Wrapper.fetchMap(content);
        var secret = content['forward'];
        return ReliableMessage.parse(secret);
    };
    ForwardContent.setMessage = function (secret, content) {
        content = Wrapper.fetchMap(content);
        if (secret) {
            content['forward'] = Wrapper.fetchMap(secret);
        } else {
            delete content['forward'];
        }
    };

    //-------- namespace --------
    ns.protocol.ForwardContent = ForwardContent;

    ns.protocol.registers('ForwardContent');

})(DaoKeDao);
