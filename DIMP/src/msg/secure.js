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
 *  Secure Message
 *  ~~~~~~~~~~~~~~
 *  Instant Message encrypted by a symmetric key
 *
 *  data format: {
 *      //-- envelope
 *      sender   : "moki@xxx",
 *      receiver : "hulk@yyy",
 *      time     : 123,
 *      //-- content data and key/keys
 *      data     : "...",  // base64_encode(symmetric)
 *      key      : "...",  // base64_encode(asymmetric)
 *      keys     : {
 *          "ID1": "key1", // base64_encode(asymmetric)
 *      }
 *  }
 */

//! require 'message.js'

(function (ns) {
    'use strict';

    var Class  = ns.type.Class;
    var Copier = ns.type.Copier;
    var InstantMessage  = ns.protocol.InstantMessage;
    var SecureMessage   = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.dkd.BaseMessage;

    /**
     *  Create secure message
     *
     * @param {{String:Object}} msg - message info with envelope, data, key/keys
     * @constructor
     */
    var EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        // lazy load
        this.__data = null;
        this.__key = null;
        this.__keys = null;
    };
    Class(EncryptedMessage, BaseMessage, [SecureMessage]);

    // Override
    EncryptedMessage.prototype.getData = function () {
        if (this.__data === null) {
            var base64 = this.getValue('data');
            var delegate = this.getDelegate();
            this.__data = delegate.decodeData(base64, this);
        }
        return this.__data;
    };

    // Override
    EncryptedMessage.prototype.getEncryptedKey = function () {
        if (this.__key === null) {
            var base64 = this.getValue('key');
            if (!base64) {
                // check 'keys'
                var keys = this.getEncryptedKeys();
                if (keys) {
                    var receiver = this.getReceiver();
                    base64 = keys[receiver.toString()];
                }
            }
            if (base64) {
                var delegate = this.getDelegate();
                this.__key = delegate.decodeKey(base64, this);
            }
        }
        return this.__key;
    };

    // Override
    EncryptedMessage.prototype.getEncryptedKeys = function () {
        if (this.__keys === null) {
            this.__keys = this.getValue('keys');
        }
        return this.__keys;
    };

    /*
     *  Decrypt the Secure Message to Instant Message
     *
     *    +----------+      +----------+
     *    | sender   |      | sender   |
     *    | receiver |      | receiver |
     *    | time     |  ->  | time     |
     *    |          |      |          |  1. PW      = decrypt(key, receiver.SK)
     *    | data     |      | content  |  2. content = decrypt(data, PW)
     *    | key/keys |      +----------+
     *    +----------+
     */

    // Override
    EncryptedMessage.prototype.decrypt = function () {
        var sender = this.getSender();
        var receiver;
        var group = this.getGroup();
        if (group) {
            // group message
            receiver = group;
        } else {
            // personal message
            // not split group message
            receiver = this.getReceiver();
        }

        // 1. decrypt 'message.key' to symmetric key
        var delegate = this.getDelegate();
        // 1.1. decode encrypted key data
        var key = this.getEncryptedKey();
        // 1.2. decrypt key data
        if (key) {
            key = delegate.decryptKey(key, sender, receiver, this);
            if (!key) {
                throw new Error('failed to decrypt key in msg: ' + this);
            }
        }
        // 1.3. deserialize key
        //      if key is empty, means it should be reused, get it from key cache
        var password = delegate.deserializeKey(key, sender, receiver, this);
        if (!password) {
            throw new Error('failed to get msg key: ' + sender + ' -> ' + receiver + ', ' + key);
        }

        // 2. decrypt 'message.data' to 'message.content'
        // 2.1. decode encrypted content data
        var data = this.getData();
        if (!data) {
            throw new Error('failed to decode content data: ' + this);
        }
        // 2.2. decrypt content data
        data = delegate.decryptContent(data, password, this);
        if (!data) {
            throw new Error('failed to decrypt data with key: ' + password);
        }
        // 2.3. deserialize content
        var content = delegate.deserializeContent(data, password, this);
        if (!content) {
            throw new Error('failed to deserialize content: ' + data);
        }
        // 2.4. check attachment for File/Image/Audio/Video message content
        //      if file data not download yet,
        //          decrypt file data with password;
        //      else,
        //          save password to 'message.content.password'.
        //      (do it in 'core' module)

        // 3. pack message
        var msg = this.copyMap(false);
        delete msg['key'];
        delete msg['keys'];
        delete msg['data'];
        msg['content'] = content.toMap();
        return InstantMessage.parse(msg);
    };

    // Override
    EncryptedMessage.prototype.sign = function () {
        var delegate = this.getDelegate();
        // 1. sign with sender's private key
        var signature = delegate.signData(this.getData(), this.getSender(), this);
        // 2. encode signature
        var base64 = delegate.encodeSignature(signature, this);
        // 3. pack message
        var msg = this.copyMap(false);
        msg['signature'] = base64;
        return ReliableMessage.parse(msg);
    };

    /*
     *  Split/Trim group message
     *
     *  for each members, get key from 'keys' and replace 'receiver' to member ID
     */

    // Override
    EncryptedMessage.prototype.split = function (members) {
        var msg = this.copyMap(false);
        // check 'keys'
        var keys = this.getEncryptedKeys();
        if (keys) {
            delete msg['keys'];
        } else {
            keys = {};
        }

        // 1. move the receiver(group ID) to 'group'
        //    this will help the receiver knows the group ID
        //    when the group message separated to multi-messages;
        //    if don't want the others know your membership,
        //    DON'T do this.
        msg['group'] = this.getReceiver().toString();

        var messages = [];
        var base64;
        var item;
        var receiver;
        for (var i = 0; i < members.length; ++i) {
            receiver = members[i].toString();
            // 2. change 'receiver' for each group member
            msg['receiver'] = receiver;
            // 3. get encrypted key
            base64 = keys[receiver];
            if (base64) {
                msg['key'] = base64;
            } else {
                delete msg['key'];
            }
            // 4. repack message
            item = SecureMessage.parse(Copier.copyMap(msg))
            if (item) {
                messages.push(item);
            }
        }
        return messages;
    };

    // Override
    EncryptedMessage.prototype.trim = function (member) {
        var msg = this.copyMap(false);
        // check 'keys'
        var keys = this.getEncryptedKeys();
        if (keys) {
            // move key data from 'keys' to 'key'
            var base64 = keys[member.toString()];
            if (base64) {
                msg['key'] = base64;
            }
            delete msg['keys'];
        }
        // check 'group'
        var group = this.getGroup();
        if (!group) {
            // if 'group' not exists, the 'receiver' must be a group ID here, and
            // it will not be equal to the member of course,
            // so move 'receiver' to 'group'
            msg['group'] = this.getReceiver().toString();
        }
        msg['receiver'] = member.toString();
        // repack
        return SecureMessage.parse(msg);
    };

    //-------- namespace --------
    ns.dkd.EncryptedMessage = EncryptedMessage;

})(DaoKeDao);

(function (ns) {
    'use strict';

    var Class  = ns.type.Class;
    var SecureMessage = ns.protocol.SecureMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;

    var SecureMessageFactory = function () {
        Object.call(this);
    };
    Class(SecureMessageFactory, Object, [SecureMessage.Factory]);

    // Override
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        // check 'sender', 'data'
        if (!msg["sender"] || !msg["data"]) {
            // msg.sender should not be empty
            // msg.data should not be empty
            return null;
        }
        // check 'signature'
        if (msg['signature']) {
            return new NetworkMessage(msg);
        }
        return new EncryptedMessage(msg);
    };

    //-------- namespace --------
    ns.dkd.SecureMessageFactory = SecureMessageFactory;

})(DaoKeDao);
