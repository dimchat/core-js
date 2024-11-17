;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
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

    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;

    /**
     *  Receipt command message: {
     *      type : 0x88,
     *      sn   : 456,
     *
     *      command : "receipt",
     *      text    : "...",  // text message
     *      origin  : {       // original message envelope
     *          sender    : "...",
     *          receiver  : "...",
     *          time      : 0,
     *
     *          sn        : 123,
     *          signature : "..."
     *      }
     *  }
     */
    var ReceiptCommand = Interface(null, [Command]);

    ReceiptCommand.prototype.getText = function () {};

    ReceiptCommand.prototype.getOriginalEnvelope     = function () {};
    ReceiptCommand.prototype.getOriginalSerialNumber = function () {};
    ReceiptCommand.prototype.getOriginalSignature    = function () {};

    var purify = function (envelope) {
        var info = envelope.copyMap(false);
        if (info['data']) {
            delete info['data'];
            delete info['key'];
            delete info['keys'];
            delete info['meta'];
            delete info['visa'];
        }
        return info;
    };

    //
    //  factory method
    //

    /**
     *  Create base receipt command with text & original message info
     *
     * @param {String} text
     * @param {Envelope} head
     * @param {Content} body
     */
    ReceiptCommand.create = function (text, head, body) {
        var info;
        if (!head) {
            info = null;
        } else if (!body) {
            info = purify(head);
        } else {
            info = purify(head);
            info['sn'] = body.getSerialNumber();
        }
        var command = new ns.dkd.cmd.BaseReceiptCommand(text, info);
        if (body) {
            // check group
            var group = body.getGroup();
            if (group) {
                command.setGroup(group);
            }
        }
        return command;
    };

    ReceiptCommand.purify = purify;

    //-------- namespace --------
    ns.protocol.ReceiptCommand = ReceiptCommand;

})(DIMP);
