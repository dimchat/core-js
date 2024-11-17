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

//! require 'protocol/receipt.js'

(function (ns) {
    'use strict';

    var Class     = ns.type.Class;
    var Converter = ns.type.Converter;

    var Envelope        = ns.protocol.Envelope;
    var Command         = ns.protocol.Command;
    var ReceiptCommand     = ns.protocol.ReceiptCommand;

    var BaseCommand = ns.dkd.cmd.BaseCommand;

    /**
     *  Create receipt command
     *
     *  Usages:
     *      1. new BaseMetaCommand(map);
     *      2. new BaseMetaCommand(text, origin);
     */
    var BaseReceiptCommand = function () {
        if (arguments.length === 2) {
            // new BaseReceiptCommand(map);
            BaseCommand.call(this, arguments[0]);
        } else {
            // new BaseReceiptCommand(text, origin);
            BaseCommand.call(this, Command.RECEIPT);
            this.setValue('text', arguments[0]);
            // original envelope of message responding to,
            // includes 'sn' and 'signature'
            var origin = arguments[1];
            if (origin) {
                this.setValue('origin', origin);
            }
        }
        this.__env = null;
    };
    Class(BaseReceiptCommand, BaseCommand, [ReceiptCommand], {

        // Override
        getText: function () {
            return this.getString('text', '');
        },

        // protected
        getOrigin: function () {
            // origin: { sender: "...", receiver: "...", time: 0 }
            return this.getValue('origin');
        },

        // Override
        getOriginalEnvelope: function () {
            var env = this.__env;
            if (!env) {
                env = Envelope.parse(this.getOrigin());
                this.__env = env;
            }
            return env;
        },

        // Override
        getOriginalSerialNumber: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null;
            }
            return Converter.getInt(origin['sn'], null);
        },

        // Override
        getOriginalSignature: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null;
            }
            return Converter.getString(origin['signature'], null);
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseReceiptCommand = BaseReceiptCommand;

})(DIMP);
