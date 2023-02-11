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

/*
 *  Message Transforming
 *  ~~~~~~~~~~~~~~~~~~~~
 *
 *     Instant Message <-> Secure Message <-> Reliable Message
 *     +-------------+     +------------+     +--------------+
 *     |  sender     |     |  sender    |     |  sender      |
 *     |  receiver   |     |  receiver  |     |  receiver    |
 *     |  time       |     |  time      |     |  time        |
 *     |             |     |            |     |              |
 *     |  content    |     |  data      |     |  data        |
 *     +-------------+     |  key/keys  |     |  key/keys    |
 *                         +------------+     |  signature   |
 *                                            +--------------+
 *     Algorithm:
 *         data      = password.encrypt(content)
 *         key       = receiver.public_key.encrypt(password)
 *         signature = sender.private_key.sign(data)
 */

/**
 *  Message with Envelope
 *  ~~~~~~~~~~~~~~~~~~~~~
 *  Base classes for messages
 *  This class is used to create a message
 *  with the envelope fields, such as 'sender', 'receiver', and 'time'
 *
 *  data format: {
 *      //-- envelope
 *      sender   : "moki@xxx",
 *      receiver : "hulk@yyy",
 *      time     : 123,
 *      //-- body
 *      ...
 *  }
 */

//! require <crypto.js>
//! require <dkd.js>

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var Dictionary = ns.type.Dictionary;

    var Envelope = ns.protocol.Envelope;
    var Message  = ns.protocol.Message;

    /**
     *  Create message
     *
     *  Usages:
     *      1. new BaseMessage(map);
     *      2. new BaseMessage(envelope);
     */
    var BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap();
        }
        Dictionary.call(this, msg);
        // envelope, which shared the same dictionary with the message
        this.__envelope = env;
        // delegate to transform messages
        this.__delegate = null;
    };
    Class(BaseMessage, Dictionary, [Message], {

        // Override
        getDelegate: function () {
            return this.__delegate;
        },

        // Override
        setDelegate: function (delegate) {
            this.__delegate = delegate;
        },

        // Override
        getEnvelope: function () {
            if (this.__envelope === null) {
                this.__envelope = Envelope.parse(this.toMap());
            }
            return this.__envelope;
        },

        // Override
        getSender: function () {
            var env = this.getEnvelope();
            return env.getSender();
        },

        // Override
        getReceiver: function () {
            var env = this.getEnvelope();
            return env.getReceiver()
        },

        // Override
        getTime: function () {
            var env = this.getEnvelope();
            return env.getTime();
        },

        // Override
        getGroup: function () {
            var env = this.getEnvelope();
            return env.getGroup();
        },

        // Override
        getType: function () {
            var env = this.getEnvelope();
            return env.getTime();
        }
    });

    //-------- namespace --------
    ns.dkd.BaseMessage = BaseMessage;

})(DaoKeDao);
