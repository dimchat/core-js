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
//! require 'msg/base.js'

(function (ns) {
    'use strict';

    var Class  = ns.type.Class;
    var UTF8   = ns.format.UTF8;
    var JsON   = ns.format.JSON;
    // var TransportableData = ns.format.TransportableData;

    var SymmetricKey    = ns.crypto.SymmetricKey;

    var Content         = ns.protocol.Content;
    var InstantMessage  = ns.protocol.InstantMessage;
    var SecureMessage   = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;

    var BaseMessage     = ns.msg.BaseMessage;

    /**
     *  Message Transceiver
     *  ~~~~~~~~~~~~~~~~~~~
     *
     *  Converting message format between PlainMessage and NetworkMessage
     */
    var Transceiver = function () {
        Object.call(this);
    };
    Class(Transceiver, Object, [InstantMessage.Delegate, SecureMessage.Delegate, ReliableMessage.Delegate], null);

    // protected
    Transceiver.prototype.getEntityDelegate = function () {};

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
        // store 'IV' in iMsg for AES decryption
        return pwd.encrypt(data, iMsg.toMap());
    };

    // // Override
    // Transceiver.prototype.encodeData = function (data, iMsg) {
    //     if (BaseMessage.isBroadcast(iMsg)) {
    //         // broadcast message content will not be encrypted (just encoded to JsON),
    //         // so no need to encode to Base64 here
    //         return UTF8.decode(data);
    //     }
    //     // message content had been encrypted by a symmetric key,
    //     // so the data should be encoded here (with algorithm 'base64' as default).
    //     return TransportableData.encode(data);
    // };

    // Override
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (BaseMessage.isBroadcast(iMsg)) {
            // broadcast message has no key
            return null;
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };

    // Override
    Transceiver.prototype.encryptKey = function (keyData, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        // TODO: make sure the receiver's public key exists
        var contact = barrack.getUser(receiver);
        if (!contact) {
            // error
            return null;
        }
        // encrypt with public key of the receiver (or group member)
        return contact.encrypt(keyData);
    };

    // // Override
    // Transceiver.prototype.encodeKey = function (keyData, iMsg) {
    //     // message key had been encrypted by a public key,
    //     // so the data should be encode here (with algorithm 'base64' as default).
    //     return TransportableData.encode(keyData);
    // };

    //-------- SecureMessage Delegate --------

    // // Override
    // Transceiver.prototype.decodeKey = function (key, sMsg) {
    //     return TransportableData.decode(key);
    // };

    // Override
    Transceiver.prototype.decryptKey = function (keyData, receiver, sMsg) {
        // NOTICE: the receiver must be a member ID
        //         if it's a group message
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(receiver);
        if (!user) {
            // error
            return null;
        }
        // decrypt key data with the receiver/group member's private key
        return user.decrypt(keyData);
    };

    // Override
    Transceiver.prototype.deserializeKey = function (keyData, sMsg) {
        if (!keyData) {
            // key data is empty
            // reused key? get it from cache
            return null;
        }
        var json = UTF8.decode(keyData);
        if (!json) {
            // key data error
            return null;
        }
        var dict = JsON.decode(json);
        // TODO: translate short keys
        //       'A' -> 'algorithm'
        //       'D' -> 'data'
        //       'V' -> 'iv'
        //       'M' -> 'mode'
        //       'P' -> 'padding'
        return SymmetricKey.parse(dict);
    };

    // // Override
    // Transceiver.prototype.decodeData = function (data, sMsg) {
    //     if (BaseMessage.isBroadcast(sMsg)) {
    //         // broadcast message content will not be encrypted (just encoded to JsON),
    //         // so return the string data directly
    //         return UTF8.encode(data);
    //     }
    //     // message content had been encrypted by a symmetric key,
    //     // so the data should be encoded here (with algorithm 'base64' as default).
    //     return TransportableData.decode(data);
    // };

    // Override
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        // check 'IV' in sMsg for AES decryption
        return pwd.decrypt(data, sMsg.toMap());
    };

    // Override
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        if (!json) {
            // content data error
            return null;
        }
        var dict = JsON.decode(json);
        // TODO: translate short keys
        //       'T' -> 'type'
        //       'N' -> 'sn'
        //       'W' -> 'time'
        //       'G' -> 'group'
        return Content.parse(dict);
    };

    // Override
    Transceiver.prototype.signData = function (data, sMsg) {
        var barrack = this.getEntityDelegate();
        var sender = sMsg.getSender();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };

    // // Override
    // Transceiver.prototype.encodeSignature = function (signature, sMsg) {
    //     return TransportableData.encode(signature);
    // };

    //-------- ReliableMessage Delegate --------

    // // Override
    // Transceiver.prototype.decodeSignature = function (signature, rMsg) {
    //     return TransportableData.decode(signature);
    // };

    // Override
    Transceiver.prototype.verifyDataSignature = function (data, signature, rMsg) {
        var barrack = this.getEntityDelegate();
        var sender = rMsg.getSender();
        var contact = barrack.getUser(sender);
        if (!contact) {
            // error
            return false;
        }
        return contact.verify(data, signature);
    };

    //-------- namespace --------
    ns.Transceiver = Transceiver;

})(DIMP);
