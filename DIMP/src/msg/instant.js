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

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.dkd.BaseMessage;

    /**
     *  Create instant message
     *
     *  Usages:
     *      1. new PlainMessage(map);
     *      2. new PlainMessage(envelope, content);
     */
    var PlainMessage = function () {
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
    Class(PlainMessage, BaseMessage, [InstantMessage]);

    // Override
    PlainMessage.prototype.getContent = function () {
        if (this.__content === null) {
            this.__content = Content.parse(this.getValue('content'));
        }
        return this.__content;
    };

    // Override
    PlainMessage.prototype.getTime = function () {
        var content = this.getContent();
        var time = content.getTime();
        if (time) {
            return time;
        } else {
            var env = this.getEnvelope();
            return env.getTime();
        }
    };

    // Override
    PlainMessage.prototype.getGroup = function () {
        var content = this.getContent();
        return content.getGroup();
    };

    // Override
    PlainMessage.prototype.getType = function () {
        var content = this.getContent();
        return content.getType();
    };

    /*
     *  Encrypt the Instant Message to Secure Message
     *
     *    +----------+      +----------+
     *    | sender   |      | sender   |
     *    | receiver |      | receiver |
     *    | time     |  ->  | time     |
     *    |          |      |          |
     *    | content  |      | data     |  1. data = encrypt(content, PW)
     *    +----------+      | key/keys |  2. key  = encrypt(PW, receiver.PK)
     *                      +----------+
     */

    // Override
    PlainMessage.prototype.encrypt = function (password, members) {
        // 0. check attachment for File/Image/Audio/Video message content
        //    (do it in 'core' module)

        // 1., 2., 3.
        if (members && members.length > 0) {
            // group message
            return encrypt_group_message.call(this, password, members);
        } else {
            // personal message
            return encrypt_message.call(this, password);
        }
    };

    var encrypt_message = function (password) {
        // 1. encrypt 'message.content' to 'message.data'
        var msg = prepare_data.call(this, password);

        // 2. encrypt symmetric key(password) to 'message.key'
        var delegate = this.getDelegate();
        // 2.1. serialize symmetric key
        var key = delegate.serializeKey(password, this);
        if (!key) {
            // A) broadcast message has no key
            // B) reused key
            return SecureMessage.parse(msg);
        }
        // 2.2. encrypt symmetric key
        var data = delegate.encryptKey(key, this.getReceiver(), this);
        if (!data) {
            // public key for encryption not found
            // TODO: suspend this message for waiting receiver's meta
            return null;
        }
        // 2.3. encode encrypted key data to Base64
        // 2.4. insert as 'key'
        msg['key'] = delegate.encodeKey(data, this);

        // 3. pack message
        return SecureMessage.parse(msg);
    };

    var encrypt_group_message = function (password, members) {
        // 1. encrypt 'message.content' to 'message.data'
        var msg = prepare_data.call(this, password);

        // 2. encrypt symmetric key(password) to 'message.key'
        var delegate = this.getDelegate();
        // 2.1. serialize symmetric key
        var key = delegate.serializeKey(password, this);
        if (!key) {
            // A) broadcast message has no key
            // B) reused key
            return SecureMessage.parse(msg);
        }
        // encrypt key data to 'message.keys'
        var keys = {};
        var count = 0;
        var member;
        var data;
        for (var i = 0; i < members.length; ++i) {
            member = members[i];
            // 2.2. encrypt symmetric key data
            data = delegate.encryptKey(key, member, this);
            if (!data) {
                // public key for encryption not found
                // TODO: suspend this message for waiting receiver's meta
                continue;
            }
            // 2.3. encode encrypted key data
            // 2.4. insert to 'message.keys' with member ID
            keys[member.toString()] = delegate.encodeKey(data, this);
            ++count;
        }
        if (count > 0) {
            msg['keys'] = keys;
        }
        // 3. pack message
        return SecureMessage.parse(msg);
    };

    var prepare_data = function (password) {
        var delegate = this.getDelegate();
        // 1. serialize message content
        var data = delegate.serializeContent(this.getContent(), password, this);
        // 2. encrypt content data with password
        data = delegate.encryptContent(data, password, this);
        // 3. encode encrypted data
        var base64 = delegate.encodeData(data, this);
        // 4. replace 'content' with encrypted 'data'
        var msg = this.copyMap(false);
        delete msg['content'];
        msg['data'] = base64;
        return msg;
    };

    //-------- namespace --------
    ns.dkd.PlainMessage = PlainMessage;

})(DaoKeDao);

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var InstantMessage = ns.protocol.InstantMessage;
    var PlainMessage = ns.dkd.PlainMessage;

    var InstantMessageFactory = function () {
        Object.call(this);
        this.__sn = randomPositiveInteger();
    };
    Class(InstantMessageFactory, Object, [InstantMessage.Factory]);

    var MAX_SN = 0x7fffffff;
    var randomPositiveInteger = function () {
        var sn = Math.ceil(Math.random() * MAX_SN);
        if (sn > 0) {
            return sn;
        } else if (sn < 0) {
            return -sn;
        }
        // ZERO? do it again!
        return 9527 + 9394; // randomPositiveInteger();
    };
    var next = function () {
        if (this.__sn < MAX_SN) {
            this.__sn += 1;
        } else {
            this.__sn = 1;
        }
        return this.__sn;
    };

    // Override
    InstantMessageFactory.prototype.generateSerialNumber = function (msgType, now) {
        // because we must make sure all messages in a same chat box won't have
        // same serial numbers, so we can't use time-related numbers, therefore
        // the best choice is a totally random number, maybe.
        return next.call(this);
    };

    // Override
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        return new PlainMessage(head, body);
    };

    // Override
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        // check 'sender', 'content'
        if (!msg["sender"] || !msg["content"]) {
            // msg.sender should not be empty
            // msg.content should not be empty
            return null;
        }
        return new PlainMessage(msg);
    };

    //-------- namespace --------
    ns.dkd.InstantMessageFactory = InstantMessageFactory;

})(DaoKeDao);
