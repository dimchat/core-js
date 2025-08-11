'use strict';
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
 *  Instant Message
 *  ~~~~~~~~~~~~~~~
 *
 *  data format: {
 *      //-- envelope
 *      sender   : "moki@xxx",
 *      receiver : "hulk@yyy",
 *      time     : 123,
 *      //-- content
 *      content  : {...}
 *  }
 */

//! require 'message.js'

    /**
     *  Create instant message
     *
     *  Usages:
     *      1. new PlainMessage(map);
     *      2. new PlainMessage(envelope, content);
     */
    dkd.msg.PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            // new PlainMessage(map);
            msg = arguments[0];
            head = null;
            body = null;
        } else if (arguments.length === 2) {
            // new PlainMessage(envelope, content);
            head = arguments[0];
            body = arguments[1];
            msg = head.toMap();
            msg['content'] = body.toMap();
        } else {
            throw new SyntaxError('message arguments error: ' + arguments);
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body;
    };
    var PlainMessage = dkd.msg.PlainMessage;

    Class(PlainMessage, BaseMessage, [InstantMessage], {

        // Override
        getTime: function () {
            var body = this.getContent();
            var time = body.getTime();
            if (time) {
                return time;
            }
            var head = this.getEnvelope();
            return head.getTime();
        },

        // Override
        getGroup: function () {
            var body = this.getContent();
            return body.getGroup();
        },

        // Override
        getType: function () {
            var body = this.getContent();
            return body.getType();
        },

        // Override
        getContent: function () {
            var body = this.__content;
            if (!body) {
                body = Content.parse(this.getValue('content'));
                this.__content = body;
            }
            return body;
        },

        // protected
        setContent: function (body) {
            this.setMap('content', body);
            this.__content = body;
        }
    });
