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
 *      data     : "...",  // base64_encode( symmetric_encrypt(content))
 *      key      : "...",  // base64_encode(asymmetric_encrypt(password))
 *      keys     : {
 *          "ID1": "key1", // base64_encode(asymmetric_encrypt(password))
 *      }
 *  }
 */

//! require 'message.js'

    /**
     *  Create secure message
     *
     * @param {{String:Object}} msg - message info with envelope, data, key/keys
     * @constructor
     */
    dkd.msg.EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        // lazy load
        this.__data = null;  // Uint8Array
        this.__key = null;   // TransportableData
        this.__keys = null;  // String => String
    };
    var EncryptedMessage = dkd.msg.EncryptedMessage;

    Class(EncryptedMessage, BaseMessage, [SecureMessage]);

    Implementation(EncryptedMessage, {

        // Override
        getData: function () {
            var binary = this.__data;
            if (!binary) {
                var base64 = this.getValue('data');
                if (!base64) {
                    throw new ReferenceError('message data not found: ' + this);
                } else if (!BaseMessage.isBroadcast(this)) {
                    // message content had been encrypted by a symmetric key,
                    // so the data should be encoded here (with algorithm 'base64' as default).
                    binary = TransportableData.decode(base64);
                } else if (IObject.isString(base64)) {
                    // broadcast message content will not be encrypted (just encoded to JsON),
                    // so return the string data directly
                    binary = UTF8.encode(base64);  // JsON
                } else {
                    throw new ReferenceError('message data error: ' + base64);
                }
                this.__data = binary;
            }
            return binary;
        },

        // Override
        getEncryptedKey: function () {
            var ted = this.__key;
            if (!ted) {
                var base64 = this.getValue('key');
                if (!base64) {
                    // check 'keys'
                    var keys = this.getEncryptedKeys();
                    if (keys) {
                        var receiver = this.getReceiver();
                        base64 = keys[receiver.toString()];
                    }
                }
                ted = TransportableData.parse(base64);
                this.__key = ted;
            }
            return !ted ? null : ted.getData();
        },

        // Override
        getEncryptedKeys: function () {
            var keys = this.__keys;
            if (!keys) {
                keys = this.getValue('keys');
                this.__keys = keys;
            }
            return keys;
        }
    });
