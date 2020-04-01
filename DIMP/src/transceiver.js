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

//! require 'namespace.js'
//! require 'cache.js'
//! require 'barrack.js'

!function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;

    var Content = ns.Content;
    var Command = ns.protocol.Command;

    var InstantMessage = ns.InstantMessage;
    var ReliableMessage = ns.ReliableMessage;

    var InstantMessageDelegate = ns.InstantMessageDelegate;
    var SecureMessageDelegate = ns.SecureMessageDelegate;
    var ReliableMessageDelegate = ns.ReliableMessageDelegate;

    var Transceiver = function () {
        this.entityDelegate = null;
        this.cipherKeyDelegate = null;
    };
    ns.Class(Transceiver, ns.type.Object, [InstantMessageDelegate, SecureMessageDelegate, ReliableMessageDelegate]);

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

    var overt_group = function (content, facebook) {
        var group = content.getGroup();
        if (group) {
            group = facebook.getIdentifier(group);
            if (group.isBroadcast()) {
                // broadcast message is always overt
                return group;
            }
            if (content instanceof Command) {
                // group command should be sent to each member directly, so
                // don't expose group ID
                return null;
            }
        }
        return group;
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     *  Encrypt instant message
     *
     * @param {InstantMessage|Message} iMsg
     * @returns {SecureMessage}
     */
    Transceiver.prototype.encryptMessage = function (iMsg) {
        var sender = this.entityDelegate.getIdentifier(iMsg.envelope.sender);
        var receiver = this.entityDelegate.getIdentifier(iMsg.envelope.receiver);
        // if 'group' exists and the 'receiver' is a group ID,
        // they must be equal

        // NOTICE: while sending group message, don't split it before encrypting.
        //         this means you could set group ID into message content, but
        //         keep the "receiver" to be the group ID;
        //         after encrypted (and signed), you could split the message
        //         with group members before sending out, or just send it directly
        //         to the group assistant to let it split messages for you!
        //    BUT,
        //         if you don't want to share the symmetric key with other members,
        //         you could split it (set group ID into message content and
        //         set contact ID to the "receiver") before encrypting, this usually
        //         for sending group command to assistant robot, which should not
        //         share the symmetric key (group msg key) with other members.

        // 1. get symmetric key
        var group = overt_group(iMsg.content, this.entityDelegate);
        var password;
        if (group) {
            // group message (excludes group command)
            password = get_key.call(this, sender, group);
        } else {
            // personal message or (group) command
            password = get_key.call(this, sender, receiver);
        }

        // check message delegate
        if (!iMsg.delegate) {
            iMsg.delegate = this;
        }

        // 2. encrypt 'content' to 'data' for receiver/group members
        var sMsg;
        if (receiver.isGroup()) {
            // group message
            var members = this.entityDelegate.getMembers(receiver);
            sMsg = iMsg.encrypt(password, members);
        } else {
            // personal message (or split group message)
            sMsg = iMsg.encrypt(password, null);
        }

        // overt group ID
        if (group && !receiver.equals(group)) {
            // NOTICE: this help the receiver knows the group ID
            //         when the group message separated to multi-messages,
            //         if don't want the others know you are the group members,
            //         remove it.
            sMsg.envelope.setGroup(group);
        }

        // NOTICE: copy content type to envelope
        //         this help the intermediate nodes to recognize message type
        sMsg.envelope.setType(iMsg.content.type);

        // OK
        return sMsg;
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     *  Sign secure message
     *
     * @param {SecureMessage|Message} sMsg
     * @returns {ReliableMessage}
     */
    Transceiver.prototype.signMessage = function (sMsg) {
        if (!sMsg.delegate) {
            sMsg.delegate = this;
        }
        // sign 'data' by sender
        return sMsg.sign();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     *  Verify reliable message
     *
     * @param {ReliableMessage|Message} rMsg
     * @returns {SecureMessage}
     */
    Transceiver.prototype.verifyMessage = function (rMsg) {
        //
        //  TODO: check [Meta Protocol]
        //        make sure the sender's meta exists
        //        (do in by application)
        //
        if (!rMsg.delegate) {
            rMsg.delegate = this;
        }
        // verify 'data' with 'signature'
        return rMsg.verify();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     *  Decrypt secure message
     *
     * @param {SecureMessage|Message} sMsg
     * @returns {InstantMessage}
     */
    Transceiver.prototype.decryptMessage = function (sMsg) {
        //
        //  NOTICE: make sure the receiver is YOU!
        //          which means the receiver's private key exists;
        //          if the receiver is a group ID, split it first
        //
        if (!sMsg.delegate) {
            sMsg.delegate = this;
        }
        // decrypt 'data' to 'content'
        return sMsg.decrypt();
        // TODO: check top-secret message
        //       (do it by application)
    };

    //-------- InstantMessageDelegate --------

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         before serialize content, this job should be do in subclass

        var json = ns.format.JSON.encode(content);
        return ns.type.String.from(json).getBytes('UTF-8');
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        var key = SymmetricKey.getInstance(pwd);
        return key.encrypt(data);
    };

    // @override
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast_msg.call(this, iMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so no need to encode to Base64 here
            var str = new ns.type.String(data, 'UTF-8');
            return str.toString();
        }
        return ns.format.Base64.encode(data);
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        var json = ns.format.JSON.encode(pwd);
        return ns.type.String.from(json).getBytes('UTF-8');
    };

    // @override
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        if (is_broadcast_msg.call(this, iMsg)) {
            // broadcast message has no key
            return null;
        }
        // encrypt with receiver's public key
        receiver = this.entityDelegate.getIdentifier(receiver);
        var contact = this.entityDelegate.getUser(receiver);
        return contact.encrypt(data);
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return ns.format.Base64.encode(key);
    };

    //-------- SecureMessageDelegate --------

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return ns.format.Base64.decode(key);
    };

    // @override
    Transceiver.prototype.decryptKey = function (data, sender, receiver, sMsg) {
        if (!data) {
            return null;
        }
        // decrypt key data with the receiver/group member's private key
        var identifier = sMsg.envelope.receiver;
        identifier = this.entityDelegate.getIdentifier(identifier);
        var user = this.entityDelegate.getUser(identifier);
        var plaintext = user.decrypt(data);
        if (!plaintext) {
            throw Error('failed to decrypt key in msg: ' + sMsg);
        }
        return plaintext;
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.deserializeKey = function (data, sender, receiver, sMsg) {
        if (data) {
            var str = new ns.type.String(data, 'UTF-8');
            var dict = ns.format.JSON.decode(str.toString());
            // TODO: translate short keys
            //       'A' -> 'algorithm'
            //       'D' -> 'data'
            //       'V' -> 'iv'
            //       'M' -> 'mode'
            //       'P' -> 'padding'
            return SymmetricKey.getInstance(dict);
        } else {
            // get key from cache
            sender = this.entityDelegate.getIdentifier(sender);
            receiver = this.entityDelegate.getIdentifier(receiver);
            return this.cipherKeyDelegate.getCipherKey(sender, receiver);
        }
    };

    // @override
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast_msg.call(this, sMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so return the string data directly
            return ns.type.String.from(data).getBytes('UTF-8');
        }
        return ns.format.Base64.decode(data);
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        var key = SymmetricKey.getInstance(pwd);
        if (!key) {
            return null;
        }
        // decrypt message.data
        var plaintext = key.decrypt(data);
        if (!plaintext) {
            throw Error('failed to decrypt data: ' + pwd);
        }
        return plaintext;
    };

    // @override
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var str = new ns.type.String(data, 'UTF-8');
        var dict = ns.format.JSON.decode(str.toString());
        // TODO: translate short keys
        //       'T' -> 'type'
        //       'N' -> 'sn'
        //       'G' -> 'group'
        var content = Content.getInstance(dict);

        if (!is_broadcast_msg.call(this, sMsg)) {
            var key = SymmetricKey.getInstance(pwd);
            // check and cache key for reuse
            var sender = this.entityDelegate.getIdentifier(sMsg.envelope.sender);
            var group = overt_group(content, this.entityDelegate);
            if (group) {
                // group message (excludes group command)
                // cache the key with direction (sender -> group)
                this.cipherKeyDelegate.cacheCipherKey(sender, group, key);
            } else {
                var receiver = this.entityDelegate.getIdentifier(sMsg.envelope.receiver);
                // personal message or (group) command
                // cache key with direction (sender -> receiver)
                this.cipherKeyDelegate.cacheCipherKey(sender, receiver, key);
            }
        }

        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         after deserialize content, this job should be do in subclass
        return content;
    };

    // @override
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var user = this.entityDelegate.getUser(sender);
        if (user) {
            return user.sign(data);
        } else {
            throw Error('failed to get sign key for sender: ' + sMsg);
        }
    };

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return ns.format.Base64.encode(signature);
    };

    //-------- ReliableMessageDelegate --------

    // @override
    // noinspection JSUnusedLocalSymbols
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return ns.format.Base64.decode(signature);
    };

    // @override
    Transceiver.prototype.verifyDataSignature = function (data, signature, sender, rMsg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var contact = this.entityDelegate.getUser(sender);
        if (contact) {
            return contact.verify(data, signature);
        } else {
            throw Error('failed to get verify key for sender: ' + rMsg);
        }
    };


    //-------- namespace --------
    ns.core.Transceiver = Transceiver;

    ns.core.register('Transceiver');

}(DIMP);
