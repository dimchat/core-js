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

(function (ns) {
    'use strict';

    /**
     *  Cipher Key Delegate
     *  ~~~~~~~~~~~~~~~~~~~
     */
    var CipherKeyDelegate = function () {
    };
    ns.Interface(CipherKeyDelegate, null);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get cipher key for encrypt message from 'sender' to 'receiver'
     *
     * @param {ID} from          - sender (user or contact ID)
     * @param {ID} to            - receiver (contact or user/group ID)
     * @param {boolean} generate - generate when key not exists
     * @returns {SymmetricKey}
     */
    CipherKeyDelegate.prototype.getCipherKey = function (from, to, generate) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Cache cipher key for reusing, with the direction (from 'sender' to 'receiver')
     *
     * @param {ID} from          - sender (user or contact ID)
     * @param {ID} to            - receiver (contact or user/group ID)
     * @param {SymmetricKey} key
     */
    CipherKeyDelegate.prototype.cacheCipherKey = function (from, to, key) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.CipherKeyDelegate = CipherKeyDelegate;

    ns.registers('CipherKeyDelegate');

})(DIMP);

(function (ns) {
    'use strict';

    /**
     *  Message Packer
     *  ~~~~~~~~~~~~~~
     */
    var Packer = function () {
    };
    ns.Interface(Packer, null);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get group ID which should be exposed to public network
     *
     * @param {Content} content - message content
     * @return {ID} exposed group ID
     */
    Packer.prototype.getOvertGroup = function (content) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  InstantMessage -> SecureMessage -> ReliableMessage -> Data
    //

    // noinspection JSUnusedLocalSymbols
    /**
     *  Encrypt message content
     *
     * @param {InstantMessage} iMsg - plain message
     * @return {SecureMessage} encrypted message
     */
    Packer.prototype.encryptMessage = function (iMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Sign content data
     *
     * @param {SecureMessage} sMsg - encrypted message
     * @return {ReliableMessage} network message
     */
    Packer.prototype.signMessage = function (sMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Serialize network message
     *
     * @param {ReliableMessage} rMsg - network message
     * @return {Uint8Array} data package
     */
    Packer.prototype.serializeMessage = function (rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Data -> ReliableMessage -> SecureMessage -> InstantMessage
    //

    // noinspection JSUnusedLocalSymbols
    /**
     *  Deserialize network message
     *
     * @param {Uint8Array} data - data package
     * @return {ReliableMessage} network message
     */
    Packer.prototype.deserializeMessage = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Verify encrypted content data
     *
     * @param {ReliableMessage} rMsg - network message
     * @return {SecureMessage} encrypted message
     */
    Packer.prototype.verifyMessage = function (rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Decrypt message content
     *
     * @param {SecureMessage} sMsg - encrypted message
     * @return {InstantMessage} plain message
     */
    Packer.prototype.decryptMessage = function (sMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

//     //-------- namespace --------
//     ns.Packer = Packer;
//
//     ns.registers('Packer');
//
// })(DIMP);
//
// (function (ns) {
//     'use strict';

    /**
     *  Message Processor
     *  ~~~~~~~~~~~~~~~~~
     */
    var Processor = function () {
    };
    ns.Interface(Processor, null);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Process data package
     *
     * @param {Uint8Array} data - data to be processed
     * @return {Uint8Array} response data
     */
    Processor.prototype.processData = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Process network message
     *
     * @param {ReliableMessage} rMsg - message to be processed
     * @return {ReliableMessage} response message
     */
    Processor.prototype.processReliableMessage = function (rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Process encrypted message
     *
     * @param {SecureMessage} sMsg - message to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {SecureMessage} response message
     */
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Process plain message
     *
     * @param {InstantMessage} iMsg - message to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {InstantMessage} response message
     */
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Process message content
     *
     * @param {Content} content - content to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {Content} response content
     */
    Processor.prototype.processContent = function (content, rMsg) {
        console.assert(false, 'implement me!');
        return null;
    };

//     //-------- namespace --------
//     ns.Processor = Processor;
//
//     ns.registers('Processor');
//
// })(DIMP);
//
// (function (ns) {
//     'use strict';
//
//     var Packer = ns.Packer;
//     var Processor = ns.Processor;

    var Message = ns.protocol.Message;

    var Entity = ns.Entity;
    var CipherKeyDelegate = ns.CipherKeyDelegate;

    /**
     *  Message Transceiver
     *  ~~~~~~~~~~~~~~~~~~~
     */
    var Transceiver = function () {
    };
    ns.Interface(Transceiver, [Entity.Delegate, CipherKeyDelegate, Message.Delegate, Packer, Processor]);

    Transceiver.Packer = Packer;
    Transceiver.Processor = Processor;

    //-------- namespace --------
    ns.Transceiver = Transceiver;

    ns.registers('Transceiver');

})(DIMP);
