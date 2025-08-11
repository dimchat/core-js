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
 *      data     : "...",  // base64_encode( symmetric_encrypt(content))
 *      key      : "...",  // base64_encode(asymmetric_encrypt(password))
 *      keys     : {
 *          "ID1": "key1", // base64_encode(asymmetric_encrypt(password))
 *      },
 *      //-- signature
 *      signature: "..."   // base64_encode(asymmetric_sign(data))
 *  }
 */

//! require 'secure.js'

    /**
     *  Create reliable message
     *
     * @param {{String:Object}} msg - message info with envelope, data, key/keys, signature
     * @constructor
     */
    dkd.msg.NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        // lazy load
        this.__signature = null;  // TransportableData
    };
    var NetworkMessage = dkd.msg.NetworkMessage;

    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {

        // Override
        getSignature: function () {
            var ted = this.__signature;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__signature = ted;
            }
            return !ted ? null : ted.getData();
        }
    });
