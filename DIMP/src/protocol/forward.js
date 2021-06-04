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

/**
 *  Top-Secret message: {
 *      type : 0xFF,
 *      sn   : 456,
 *
 *      forward : {...}  // reliable (secure + certified) message
 *  }
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;

    /**
     *  Create top-secret message content
     *
     *  Usages:
     *      1. new ForwardContent();
     *      2. new ForwardContent(msg);
     *      3. new ForwardContent(map);
     */
    var ForwardContent = function () {
        if (arguments.length === 0) {
            // new ForwardContent();
            BaseContent.call(this, ContentType.FORWARD);
            this.forward = null;
        } else if (arguments[0] instanceof ReliableMessage) {
            // new ForwardContent(msg);
            BaseContent.call(this, ContentType.FORWARD);
            this.setMessage(arguments[0]);
        } else {
            // new ForwardContent(map);
            BaseContent.call(this, arguments[0]);
            this.forward = null;
        }
    };
    ns.Class(ForwardContent, BaseContent, null);

    ForwardContent.getMessage = function (content) {
        var secret = content['forward'];
        if (secret) {
            return ReliableMessage.parse(secret);
        } else {
            return null;
        }
    };
    ForwardContent.setMessage = function (secret, content) {
        if (secret) {
            content['forward'] = secret.getMap();
        } else {
            delete content['forward'];
        }
    };

    /**
     *  Get secret message
     *
     * @returns {ReliableMessage}
     */
    ForwardContent.prototype.getMessage = function () {
        if (!this.forward) {
            this.forward = ForwardContent.getMessage(this.getMap());
        }
        return this.forward;
    };
    /**
     *  Set secret message
     *
     * @param {ReliableMessage} secret - message to be forwarded
     */
    ForwardContent.prototype.setMessage = function (secret) {
        ForwardContent.setMessage(secret, this.getMap());
        this.forward = secret;
    };

    //-------- namespace --------
    ns.protocol.ForwardContent = ForwardContent;

    ns.protocol.register('ForwardContent');

})(DaoKeDao);
