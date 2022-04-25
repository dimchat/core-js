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
 *  Message Transceiver
 *  ~~~~~~~~~~~~~~~~~~~
 *
 *  Converting message format between PlainMessage and NetworkMessage
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var SymmetricKey = ns.crypto.SymmetricKey;
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;

    var Transceiver = function () {
        Object.call(this);
    };
    ns.Class(Transceiver, Object, [InstantMessage.Delegate, ReliableMessage.Delegate]);

    /**
     *  Get entity delegate
     */
    Transceiver.prototype.getEntityDelegate = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    var is_broadcast = function (msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver();
        }
        return receiver.isBroadcast();
    };

    //-------- InstantMessage Delegate --------

    // Override
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        // NOTICE: check attachment for File/Image/Audio/Video message content
        //         before serialize content, this job should be do in subclass
        var dict = content.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };

    // Override
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };

    // Override
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast(iMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so no need to encode to Base64 here
            return UTF8.decode(data);
        }
        return Base64.encode(data);
    };

    // Override
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast(iMsg)) {
            // broadcast message has no key
            return null;
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };

    // Override
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        // NOTICE: make sure the receiver's public key exists
        var contact = barrack.getUser(receiver);
        return contact.encrypt(data);
    };

    // Override
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return Base64.encode(key);
    };

    //-------- SecureMessage Delegate --------

    // Override
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return Base64.decode(key);
    };

    // Override
    Transceiver.prototype.decryptKey = function (data, sender, receiver, sMsg) {
        // NOTICE: the receiver will be group ID in a group message here
        var barrack = this.getEntityDelegate();
        // decrypt key data with the receiver/group member's private key
        var identifier = sMsg.getReceiver();
        var user = barrack.getUser(identifier);
        return user.decrypt(data);
    };

    // Override
    Transceiver.prototype.deserializeKey = function (data, sender, receiver, sMsg) {
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        // TODO: translate short keys
        //       'A' -> 'algorithm'
        //       'D' -> 'data'
        //       'V' -> 'iv'
        //       'M' -> 'mode'
        //       'P' -> 'padding'
        return SymmetricKey.parse(dict);
    };

    // Override
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast(sMsg)) {
            // broadcast message content will not be encrypted (just encoded to JsON),
            // so return the string data directly
            return UTF8.encode(data);
        }
        return Base64.decode(data);
    };

    // Override
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };

    // Override
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        // TODO: translate short keys
        //       'T' -> 'type'
        //       'N' -> 'sn'
        //       'G' -> 'group'
        return Content.parse(dict);
    };

    // Override
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };

    // Override
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return Base64.encode(signature);
    };

    //-------- ReliableMessage Delegate --------

    // Override
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return Base64.decode(signature);
    };

    // Override
    Transceiver.prototype.verifyDataSignature = function (data, signature, sender, rMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(sender);
        return contact.verify(data, signature);
    };

    //-------- namespace --------
    ns.core.Transceiver = Transceiver;

    ns.core.registers('Transceiver');

})(DIMP);
