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

/**
 *  Core Transceiver
 *  ~~~~~~~~~~~~~~~~
 */

//! require '../transceiver.js'

(function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;

    var Content = ns.protocol.Content;

    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;

    var CoreTransceiver = function () {
        this.__barrack = null;
        this.__keycache = null;
        this.__packer = null;
        this.__processor = null;
    };
    ns.Class(CoreTransceiver, ns.type.Object, [Transceiver, InstantMessage.Delegate, ReliableMessage.Delegate]);

    //
    //  Interfaces for User/Group
    //
    CoreTransceiver.prototype.setEntityDelegate = function (barrack) {
        this.__barrack = barrack;
    };
    CoreTransceiver.prototype.getEntityDelegate = function () {
        return this.__barrack;
    };

    CoreTransceiver.prototype.selectLocalUser = function (receiver) {
        return this.getEntityDelegate().selectLocalUser(receiver);
    };

    CoreTransceiver.prototype.getUser = function (identifier) {
        return this.getEntityDelegate().getUser(identifier);
    };

    CoreTransceiver.prototype.getGroup = function (identifier) {
        return this.getEntityDelegate().getGroup(identifier);
    };

    //
    //  Interfaces for Cipher Key
    //
    CoreTransceiver.prototype.setCipherKeyDelegate = function (keyCache) {
        this.__keycache = keyCache;
    };
    CoreTransceiver.prototype.getCipherKeyDelegate = function () {
        return this.__keycache;
    };

    CoreTransceiver.prototype.getCipherKey = function (from, to, generate) {
        return this.getCipherKeyDelegate().getCipherKey(from, to, generate);
    };

    CoreTransceiver.prototype.cacheCipherKey = function (from, to, key) {
        return this.getCipherKeyDelegate().cacheCipherKey(from, to, key);
    };

    //
    //  Interfaces for Packing Message
    //
    CoreTransceiver.prototype.setPacker = function (packer) {
        this.__packer = packer;
    };
    CoreTransceiver.prototype.getPacker = function () {
        return this.__packer;
    };

    CoreTransceiver.prototype.getOvertGroup = function (content) {
        return this.getPacker().getOvertGroup(content);
    };

    CoreTransceiver.prototype.encryptMessage = function (iMsg) {
        return this.getPacker().encryptMessage(iMsg);
    };

    CoreTransceiver.prototype.signMessage = function (sMsg) {
        return this.getPacker().signMessage(sMsg);
    };

    CoreTransceiver.prototype.serializeMessage = function (rMsg) {
        return this.getPacker().serializeMessage(rMsg);
    };

    CoreTransceiver.prototype.deserializeMessage = function (data) {
        return this.getPacker().deserializeMessage(data);
    };

    CoreTransceiver.prototype.verifyMessage = function (rMsg) {
        return this.getPacker().verifyMessage(rMsg);
    };

    CoreTransceiver.prototype.decryptMessage = function (sMsg) {
        return this.getPacker().decryptMessage(sMsg);
    };

    //
    //  Interfaces for Processing Message
    //
    CoreTransceiver.prototype.setProcessor = function (processor) {
        this.__processor = processor;
    };
    CoreTransceiver.prototype.getProcessor = function () {
        return this.__processor;
    };

    CoreTransceiver.prototype.processData = function (data) {
        return this.getProcessor().processData(data);
    };

    CoreTransceiver.prototype.processReliableMessage = function (rMsg) {
        return this.getProcessor().processReliableMessage(rMsg);
    };

    CoreTransceiver.prototype.processSecureMessage = function (sMsg, rMsg) {
        return this.getProcessor().processSecureMessage(sMsg, rMsg);
    };

    CoreTransceiver.prototype.processInstantMessage = function (iMsg, rMsg) {
        return this.getProcessor().processInstantMessage(iMsg, rMsg);
    };

    CoreTransceiver.prototype.processContent = function (content, rMsg) {
        return this.getProcessor().processContent(content, rMsg);
    };

    var is_broadcast_msg = function (msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver();
        }
        return receiver.isBroadcast();
    };

    //-------- InstantMessage Delegate --------

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         before serialize content, this job should be do in subclass
        return ns.format.JSON.encode(content.getMap());
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };

    CoreTransceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so no need to encode to Base64 here
            return ns.format.UTF8.decode(data);
        }
        return ns.format.Base64.encode(data);
    };

    CoreTransceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            // broadcast message has no key
            return null;
        }
        return ns.format.JSON.encode(pwd);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        // encrypt with receiver's public key
        var contact = this.getUser(receiver);
        return contact.encrypt(data);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.encodeKey = function (key, iMsg) {
        return ns.format.Base64.encode(key);
    };

    //-------- SecureMessage Delegate --------

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.decodeKey = function (key, sMsg) {
        return ns.format.Base64.decode(key);
    };

    CoreTransceiver.prototype.decryptKey = function (data, sender, receiver, sMsg) {
        // decrypt key data with the receiver/group member's private key
        var identifier = sMsg.getReceiver();
        var user = this.getUser(identifier);
        return user.decrypt(data);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.deserializeKey = function (data, sender, receiver, sMsg) {
        if (data) {
            var dict = ns.format.JSON.decode(data);
            // TODO: translate short keys
            //       'A' -> 'algorithm'
            //       'D' -> 'data'
            //       'V' -> 'iv'
            //       'M' -> 'mode'
            //       'P' -> 'padding'
            return SymmetricKey.parse(dict);
        } else {
            // get key from cache
            return this.getCipherKey(sender, receiver, false);
        }
    };

    CoreTransceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast_msg(sMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so return the string data directly
            return ns.format.UTF8.encode(data);
        }
        return ns.format.Base64.decode(data);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };

    CoreTransceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var dict = ns.format.JSON.decode(data);
        // TODO: translate short keys
        //       'T' -> 'type'
        //       'N' -> 'sn'
        //       'G' -> 'group'
        var content = Content.parse(dict);

        if (!is_broadcast_msg(sMsg)) {
            // check and cache key for reuse
            var sender = sMsg.getSender();
            var group = this.getOvertGroup(content);
            if (group) {
                // group message (excludes group command)
                // cache the key with direction (sender -> group)
                this.cacheCipherKey(sender, group, pwd);
            } else {
                var receiver = sMsg.getReceiver();
                // personal message or (group) command
                // cache key with direction (sender -> receiver)
                this.cacheCipherKey(sender, receiver, pwd);
            }
        }

        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         after deserialize content, this job should be do in subclass
        return content;
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.signData = function (data, sender, sMsg) {
        var user = this.getUser(sender);
        return user.sign(data);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.encodeSignature = function (signature, sMsg) {
        return ns.format.Base64.encode(signature);
    };

    //-------- ReliableMessage Delegate --------

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.decodeSignature = function (signature, rMsg) {
        return ns.format.Base64.decode(signature);
    };

    // noinspection JSUnusedLocalSymbols
    CoreTransceiver.prototype.verifyDataSignature = function (data, signature, sender, rMsg) {
        var contact = this.getUser(sender);
        return contact.verify(data, signature);
    };


    //-------- namespace --------
    ns.core.Transceiver = CoreTransceiver;

    ns.core.register('Transceiver');

})(DIMP);
