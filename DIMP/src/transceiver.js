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

//! require <crypto.js>
//! require <mkm.js>
//! require 'cache.js'
//! require 'barrack.js'

!function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;

    var Content = ns.Content;
    var InstantMessage = ns.InstantMessage;
    var ReliableMessage = ns.ReliableMessage;

    var InstantMessageDelegate = ns.InstantMessageDelegate;
    var SecureMessageDelegate = ns.SecureMessageDelegate;
    var ReliableMessageDelegate = ns.ReliableMessageDelegate;

    var Transceiver = function () {
        this.entityDelegate = null;
        this.cipherKeyDelegate = null;
    };
    Transceiver.inherits(Object, InstantMessageDelegate, SecureMessageDelegate, ReliableMessageDelegate);

    var get_key = function (sender, receiver) {
        var key = this.cipherKeyDelegate.getCipherKey(sender, receiver);
        if (!key) {
            // create new key and cache it
            key = SymmetricKey.generate(SymmetricKey.AES);
            this.cipherKeyDelegate.cacheCipherKey(sender, receiver, key);
        }
        return key;
    };

    var is_broadcast_msg = function (msg) {
        var receiver;
        if (msg instanceof InstantMessage) {
            receiver = msg.content.getGroup();
        } else {
            receiver = msg.envelope.getGroup();
        }
        if (!receiver) {
            receiver = msg.envelope.receiver;
        }
        receiver = this.entityDelegate.getIdentifier(receiver);
        return receiver && receiver.isBroadcast();
    };

    //
    //  Transform
    //
    Transceiver.prototype.encryptMessage = function (msg) {
        var sender = this.entityDelegate.getIdentifier(msg.envelope.sender);
        var receiver = this.entityDelegate.getIdentifier(msg.envelope.receiver);
        // if 'group' exists and the 'receiver' is a group ID,
        // they must be equal
        var group = this.entityDelegate.getIdentifier(msg.content.getGroup());

        // 1. get symmetric key
        var password;
        if (group) {
            // group message
            password = get_key.call(sender, group);
        } else {
            password = get_key.call(sender, receiver);
        }
        // check message delegate
        if (msg.delegate === null) {
            msg.delegate = this;
        }

        // 2. encrypt 'content' to 'data' for receiver/group members
        var sMsg;
        if (receiver.getType().isGroup()) {
            // group message
            var members = this.entityDelegate.getMembers(receiver);
            sMsg = msg.encrypt(password, members);
        } else {
            // personal message (or split group message)
            sMsg = msg.encrypt(password);
        }

        // OK
        return sMsg;
    };

    Transceiver.prototype.signMessage = function (msg) {
        if (msg.delegate === null) {
            msg.delegate = this;
        }
        // sign 'data' by sender
        return msg.sign();
    };

    Transceiver.prototype.verifyMessage = function (msg) {
        //
        //  TODO: check [Meta Protocol]
        //        make sure the sender's meta exists
        //        (do in by application)
        //
        if (msg.delegate == null) {
            msg.delegate = this;
        }
        // verify 'data' with 'signature'
        return msg.verify();
    };

    Transceiver.prototype.decryptMessage = function (msg) {
        //
        //  NOTICE: make sure the receiver is YOU!
        //          which means the receiver's private key exists;
        //          if the receiver is a group ID, split it first
        //
        if (msg.delegate == null) {
            msg.delegate = this;
        }
        // decrypt 'data' to 'content'
        return msg.decrypt();
        // TODO: check top-secret message
        //       (do it by application)
    };

    //
    //  De/serialize message content and symmetric key
    //

    Transceiver.prototype.serializeContent = function (content, msg) {
        var json = ns.format.JSON.encode(content);
        var str = new ns.type.String(json);
        return str.getBytes('UTF-8');
    };

    Transceiver.prototype.serializeKey = function (password, msg) {
        var json = ns.format.JSON.encode(password);
        var str = new ns.type.String(json);
        return str.getBytes('UTF-8');
    };

    Transceiver.prototype.serializeMessage = function (msg) {
        var json = ns.format.JSON.encode(msg);
        var str = new ns.type.String(json);
        return str.getBytes('UTF-8');
    };

    Transceiver.prototype.deserializeMessage = function (data) {
        var str = new ns.type.String(data, 'UTF-8');
        var dict = ns.format.JSON.decode(str.toString());
        // TODO: translate short keys
        //       'S' -> 'sender'
        //       'R' -> 'receiver'
        //       'W' -> 'time'
        //       'T' -> 'type'
        //       'G' -> 'group'
        //       ------------------
        //       'D' -> 'data'
        //       'V' -> 'signature'
        //       'K' -> 'key'
        //       ------------------
        //       'M' -> 'meta'
        return ReliableMessage.getInstance(dict);
    };

    Transceiver.prototype.deserializeKey = function (data, msg) {
        var str = new ns.type.String(data, 'UTF-8');
        var dict = ns.format.JSON.decode(str.toString());
        // TODO: translate short keys
        //       'A' -> 'algorithm'
        //       'D' -> 'data'
        //       'V' -> 'iv'
        //       'M' -> 'mode'
        //       'P' -> 'padding'
        return SymmetricKey.getInstance(dict);
    };

    Transceiver.prototype.deserializeContent = function (data, msg) {
        var str = new ns.type.String(data, 'UTF-8');
        var dict = ns.format.JSON.decode(str.toString());
        // TODO: translate short keys
        //       'T' -> 'type'
        //       'N' -> 'sn'
        //       'G' -> 'group'
        return Content.getInstance(dict);
    };

    //-------- InstantMessageDelegate --------

    Transceiver.prototype.encryptContent = function (content, pwd, msg) {
        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         before serialize content, this job should be do in subclass
        var key = SymmetricKey.getInstance(pwd);
        if (key) {
            var data = this.serializeContent(content, msg);
            return key.encrypt(data);
        } else {
            throw Error('key error: ' + pwd);
        }
    };

    Transceiver.prototype.encodeData = function (data, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so no need to encode to Base64 here
            var str = new ns.type.String(data, 'UTF-8');
            return str.toString;
        }
        return ns.format.Base64.encode(data);
    };

    Transceiver.prototype.encryptKey = function (pwd, receiver, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            // broadcast message has no key
            return null;
        }
        var key = SymmetricKey.getInstance(pwd);
        // TODO: check whether support reused key

        var data = this.serializeKey(key, msg);
        // encrypt with receiver's public key
        receiver = this.entityDelegate.getIdentifier(receiver);
        var contact = this.entityDelegate.getUser(receiver);
        if (contact) {
            return contact.encrypt(data);
        } else {
            throw Error('failed to get encrypt key for receiver: ' + receiver);
        }
    };

    Transceiver.prototype.encodeKey = function (key, msg) {
        return ns.format.Base64.encode(key);
    };

    //-------- SecureMessageDelegate --------

    Transceiver.prototype.decodeKey = function (key, msg) {
        return ns.format.Base64.decode(key);
    };

    Transceiver.prototype.decryptKey = function (key, sender, receiver, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        receiver = this.entityDelegate.getIdentifier(receiver);
        var password = null;
        if (key) {
            // decrypt key data with the receiver/group member's private key
            var identifier = msg.envelope.receiver;
            identifier = this.entityDelegate.getIdentifier(identifier);
            var user = this.entityDelegate.getUser(identifier);
            if (!user) {
                throw Error('failed to get decrypt keys: ' + identifier);
            }
            var plaintext = user.decrypt(key);
            if (!plaintext) {
                throw Error('failed to decrypt key in msg: ' + msg);
            }
            // deserialize it to symmetric key
            password = this.deserializeKey(plaintext, msg);
        }
        return this.cipherKeyDelegate.reuseCipherKey(sender, receiver, password);
    };

    Transceiver.prototype.decodeData = function (data, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so return the string data directly
            var str = new ns.type.String(data);
            return str.getBytes('UTF-8');
        }
        return ns.format.Base64.decode(data);
    };

    Transceiver.prototype.decryptContent = function (data, pwd, msg) {
        var key = SymmetricKey.getInstance(pwd);
        if (!key) {
            return null;
        }
        // decrypt message.data to content
        var plaintext = key.decrypt(data);
        if (!plaintext) {
            // throw Error('failed to decrypt data: ' + pwd);
            return null;
        }
        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         after deserialize content, this job should be do in subclass
        return this.deserializeContent(plaintext, msg);
    };

    Transceiver.prototype.signData = function (data, sender, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var user = this.entityDelegate.getUser(sender);
        if (user) {
            return user.sign(data);
        } else {
            throw Error('failed to get sign key for sender: ' + sender);
        }
    };

    Transceiver.prototype.encodeSignature = function (signature, msg) {
        return ns.format.Base64.encode(signature);
    };

    //-------- ReliableMessageDelegate --------

    Transceiver.prototype.decodeSignature = function (signature, msg) {
        return ns.format.Base64.decode(signature);
    };

    Transceiver.prototype.verifyDataSignature = function (data, signature, sender, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var contact = this.entityDelegate.getUser(sender);
        if (contact) {
            return contact.verify(data, signature);
        } else {
            throw Error('failed to get verify key for sender: ' + sender);
        }
    };


    //-------- namespace --------
    ns.Transceiver = Transceiver;

}(DIMP);
