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
 *  Core Processor
 *  ~~~~~~~~~~~~~~
 */

//! require '../transceiver.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;

    var Envelope = ns.protocol.Envelope;
    var InstantMessage = ns.protocol.InstantMessage;
    var Transceiver = ns.Transceiver;

    var CoreProcessor = function (transceiver) {
        obj.call(this);
        this.__transceiver = transceiver;
    };
    ns.Class(CoreProcessor, obj, [Transceiver.Processor]);

    CoreProcessor.prototype.getTransceiver = function () {
        return this.__transceiver;
    };

    CoreProcessor.prototype.processData = function (data) {
        var transceiver = this.getTransceiver();
        // 1. deserialize message
        var rMsg = transceiver.deserializeMessage(data);
        if (rMsg == null) {
            // no valid message received
            return null;
        }
        // 2. process message
        rMsg = transceiver.processReliableMessage(rMsg);
        if (rMsg == null) {
            // nothing to respond
            return null;
        }
        // 3. serialize message
        return transceiver.serializeMessage(rMsg);
    };

    CoreProcessor.prototype.processReliableMessage = function (rMsg) {
        var transceiver = this.getTransceiver();
        // TODO: override to check broadcast message before calling it
        // 1. verify message
        var sMsg = transceiver.verifyMessage(rMsg);
        if (sMsg == null) {
            // waiting for sender's meta if not exists
            return null;
        }
        // 2. process message
        sMsg = transceiver.processSecureMessage(sMsg, rMsg);
        if (sMsg == null) {
            // nothing to respond
            return null;
        }
        // 3. sign message
        return transceiver.signMessage(sMsg);
        // TODO: override to deliver to the receiver when catch exception "receiver error ..."
    };

    CoreProcessor.prototype.processSecureMessage = function (sMsg, rMsg) {
        var transceiver = this.getTransceiver();
        // 1. decrypt message
        var iMsg = transceiver.decryptMessage(sMsg);
        if (iMsg == null) {
            // cannot decrypt this message, not for you?
            // delivering message to other receiver?
            return null;
        }
        // 2. process message
        iMsg = transceiver.processInstantMessage(iMsg, rMsg);
        if (iMsg == null) {
            // nothing to respond
            return null;
        }
        // 3. encrypt message
        return transceiver.encryptMessage(iMsg);
    };

    CoreProcessor.prototype.processInstantMessage = function (iMsg, rMsg) {
        var transceiver = this.getTransceiver();
        // 1. process content
        var response = transceiver.processContent(iMsg.getContent(), rMsg);
        if (response == null) {
            // nothing to respond
            return null;
        }

        // 2. select a local user to build message
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var user = transceiver.selectLocalUser(receiver);

        // 3. pack message
        var env = Envelope.create(user.identifier, sender, null);
        return InstantMessage.create(env, response);
    };

    // CoreProcessor.prototype.processContent = function (content, rMsg) {
    //     console.assert(false, 'implement me!');
    //     return null;
    // };

    //-------- namespace --------
    ns.core.Processor = CoreProcessor;

    ns.core.registers('Processor');

})(DIMP);
