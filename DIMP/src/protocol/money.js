;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2021 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2021 Albert Moky
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
    var Content = ns.protocol.Content;

    /**
     *  Money message: {
     *      type : 0x40,
     *      sn   : 123,
     *
     *      currency : "RMB", // USD, USDT, ...
     *      amount   : 100.00
     *  }
     */
    var MoneyContent = Interface(null, [Content]);

    /**
     *  Get currency (BTC, ETH, USD, CNY, ...)
     *
     * @return {String} currency
     */
    MoneyContent.prototype.getCurrency = function () {};

    /**
     *  Set amount
     *
     * @param {float} amount
     */
    MoneyContent.prototype.setAmount = function (amount) {};
    MoneyContent.prototype.getAmount = function () {};

    //
    //  factory method
    //

    MoneyContent.create = function (type, currency, amount) {
        return new ns.dkd.BaseMoneyContent(type, currency, amount);
    };

    /**
     *  Transfer money message: {
     *      type : 0x41,
     *      sn   : 123,
     *
     *      currency : "RMB",    // USD, USDT, ...
     *      amount   : 100.00,
     *      remitter : "{FROM}", // sender ID
     *      remittee : "{TO}"    // receiver ID
     *  }
     */
    var TransferContent = Interface(null, [MoneyContent]);

    // sender
    TransferContent.prototype.setRemitter = function (sender) {};
    TransferContent.prototype.getRemitter = function () {};

    // receiver
    TransferContent.prototype.setRemittee = function (receiver) {};
    TransferContent.prototype.getRemittee = function () {};

    //
    //  factory method
    //

    TransferContent.create = function (currency, amount) {
        return new ns.dkd.TransferMoneyContent(currency, amount);
    };

    //-------- namespace --------
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;

})(DIMP);
