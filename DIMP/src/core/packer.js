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
 *  Message Packer
 *  ~~~~~~~~~~~~~~
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;

    var Packer = Interface(null, null);

    /**
     *  Get group ID which should be exposed to public network
     *
     * @param {Content} content - message content
     * @return {ID} exposed group ID
     */
    Packer.prototype.getOvertGroup = function (content) {
        throw new Error('NotImplemented');
    };

    //
    //  InstantMessage -> SecureMessage -> ReliableMessage -> Data
    //

    /**
     *  Encrypt message content
     *
     * @param {InstantMessage} iMsg - plain message
     * @return {SecureMessage} encrypted message
     */
    Packer.prototype.encryptMessage = function (iMsg) {
        throw new Error('NotImplemented');
    };

    /**
     *  Sign content data
     *
     * @param {SecureMessage} sMsg - encrypted message
     * @return {ReliableMessage} network message
     */
    Packer.prototype.signMessage = function (sMsg) {
        throw new Error('NotImplemented');
    };

    /**
     *  Serialize network message
     *
     * @param {ReliableMessage} rMsg - network message
     * @return {Uint8Array} data package
     */
    Packer.prototype.serializeMessage = function (rMsg) {
        throw new Error('NotImplemented');
    };

    //
    //  Data -> ReliableMessage -> SecureMessage -> InstantMessage
    //

    /**
     *  Deserialize network message
     *
     * @param {Uint8Array} data - data package
     * @return {ReliableMessage} network message
     */
    Packer.prototype.deserializeMessage = function (data) {
        throw new Error('NotImplemented');
    };

    /**
     *  Verify encrypted content data
     *
     * @param {ReliableMessage} rMsg - network message
     * @return {SecureMessage} encrypted message
     */
    Packer.prototype.verifyMessage = function (rMsg) {
        throw new Error('NotImplemented');
    };

    /**
     *  Decrypt message content
     *
     * @param {SecureMessage} sMsg - encrypted message
     * @return {InstantMessage} plain message
     */
    Packer.prototype.decryptMessage = function (sMsg) {
        throw new Error('NotImplemented');
    };

    //-------- namespace --------
    ns.Packer = Packer;

})(DIMP);
