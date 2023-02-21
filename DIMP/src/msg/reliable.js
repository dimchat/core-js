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
 *  Reliable Message signed by an asymmetric key
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  This class is used to sign the SecureMessage
 *  It contains a 'signature' field which signed with sender's private key
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
 *      },
 *      //-- signature
 *      signature: "..."   // base64_encode()
 *  }
 */

//! require 'secure.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;

    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;

    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;

    /**
     *  Create reliable message
     *
     * @param {{String:Object}} msg - message info with envelope, data, key/keys, signature
     * @constructor
     */
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        // lazy load
        this.__signature = null;
        this.__meta = null;
        this.__visa = null;
    };
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {

        // Override
        getSignature: function () {
            if (this.__signature === null) {
                var base64 = this.getValue('signature');
                var delegate = this.getDelegate();
                this.__signature = delegate.decodeSignature(base64, this);
            }
            return this.__signature;
        },

        // Override
        setMeta: function (meta) {
            this.setMap('meta', meta);
            this.__meta = meta;
        },

        // Override
        getMeta: function () {
            if (this.__meta === null) {
                var dict = this.getValue('meta');
                this.__meta = Meta.parse(dict);
            }
            return this.__meta;
        },

        // Override
        setVisa: function (visa) {
            this.setMap('visa', visa);
            this.__visa = visa;
        },

        // Override
        getVisa: function () {
            if (this.__visa === null) {
                var dict = this.getValue('visa');
                this.__visa = Document.parse(dict);
            }
            return this.__visa;
        },

        /*
         *  Verify the Reliable Message to Secure Message
         *
         *    +----------+      +----------+
         *    | sender   |      | sender   |
         *    | receiver |      | receiver |
         *    | time     |  ->  | time     |
         *    |          |      |          |
         *    | data     |      | data     |  1. verify(data, signature, sender.PK)
         *    | key/keys |      | key/keys |
         *    | signature|      +----------+
         *    +----------+
         */

        // Override
        verify: function () {
            var data = this.getData();
            if (!data) {
                throw new Error('failed to decode content data: ' + this);
            }
            var signature = this.getSignature();
            if (!signature) {
                throw new Error('failed to decode message signature: ' + this);
            }
            // 1. verify data signature with sender's public key
            var delegate = this.getDelegate();
            if (delegate.verifyDataSignature(data, signature, this.getSender(), this)) {
                // 2. pack message
                var msg = this.copyMap(false);
                delete msg['signature'];
                return SecureMessage.parse(msg);
            } else {
                // throw new Error('message signature not match: ' + this);
                return null;
            }
        }
    });

    //-------- namespace --------
    ns.dkd.NetworkMessage = NetworkMessage;

})(DaoKeDao);

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;

    var ReliableMessageFactory = function () {
        Object.call(this);
    };
    Class(ReliableMessageFactory, Object, [ReliableMessage.Factory], null);

    // Override
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        // check 'sender', 'data', 'signature'
        if (!msg['sender'] || !msg['data'] || !msg['signature']) {
            // msg.sender should not empty
            // msg.data should not empty
            // msg.signature should not empty
            return null;
        }
        return new NetworkMessage(msg);
    };

    //-------- namespace --------
    ns.dkd.ReliableMessageFactory = ReliableMessageFactory;

})(DaoKeDao);
