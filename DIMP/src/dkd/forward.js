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

//! require 'protocol/forward.js'

(function (ns) {
    'use strict';

    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create top-secret message content
     *
     *  Usages:
     *      1. new SecretContent();
     *      2. new SecretContent(msg);
     *      3. new SecretContent(map);
     */
    var SecretContent = function () {
        if (arguments.length === 0) {
            // new SecretContent();
            BaseContent.call(this, ContentType.FORWARD);
            this.__forward = null;
        } else if (ns.Interface.conforms(arguments[0], ReliableMessage)) {
            // new SecretContent(msg);
            BaseContent.call(this, ContentType.FORWARD);
            this.setMessage(arguments[0]);
        } else {
            // new SecretContent(map);
            BaseContent.call(this, arguments[0]);
            this.__forward = null;
        }
    };
    ns.Class(SecretContent, BaseContent, [ForwardContent], {
        // Override
        getMessage: function () {
            if (!this.__forward) {
                var dict = this.toMap();
                this.__forward = ForwardContent.getMessage(dict);
            }
            return this.__forward;
        },

        // Override
        setMessage: function (secret) {
            var dict = this.toMap();
            ForwardContent.setMessage(secret, dict);
            this.__forward = secret;
        }
    });

    //-------- namespace --------
    ns.dkd.SecretContent = SecretContent;

    ns.dkd.registers('SecretContent');

})(DaoKeDao);
