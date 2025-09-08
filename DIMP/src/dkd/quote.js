'use strict';
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

//! require 'protocol/quote.js'
//! require 'base.js'

    /**
     *  Create receipt command
     *
     *  Usages:
     *      1. new BaseQuoteContent(map);
     *      2. new BaseQuoteContent(text, origin);
     */
    dkd.dkd.BaseQuoteContent = function () {
        if (arguments.length === 1) {
            // new BaseQuoteContent(map);
            BaseContent.call(this, arguments[0]);
        } else {
            // new BaseQuoteContent(text, origin);
            BaseContent.call(this, Command.RECEIPT);
            this.setValue('text', arguments[0]);
            // original envelope of message quote with,
            // includes 'sender', 'receiver', 'type' and 'sn'
            var origin = arguments[1];
            if (origin) {
                this.setValue('origin', origin);
            }
        }
        this.__env = null;
    };
    var BaseQuoteContent = dkd.dkd.BaseQuoteContent;

    Class(BaseQuoteContent, BaseContent, [QuoteContent]);

    Implementation(BaseQuoteContent, {

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
        }
    });
