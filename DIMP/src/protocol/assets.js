'use strict';
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

//! require <dkd.js>

    /**
     *  Money message: {
     *      type : i2s(0x40),
     *      sn   : 123,
     *
     *      currency : "RMB", // USD, USDT, ...
     *      amount   : 100.00
     *  }
     */
    dkd.protocol.MoneyContent = Interface(null, [Content]);
    var MoneyContent = dkd.protocol.MoneyContent;

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
    //  Factory
    //
    MoneyContent.create = function (type, currency, amount) {
        return new BaseMoneyContent(type, currency, amount);
    };


    /**
     *  Transfer money message: {
     *      type : i2s(0x41),
     *      sn   : 123,
     *
     *      currency : "RMB",    // USD, USDT, ...
     *      amount   : 100.00,
     *      remitter : "{FROM}", // sender ID
     *      remittee : "{TO}"    // receiver ID
     *  }
     */
    dkd.protocol.TransferContent = Interface(null, [MoneyContent]);
    var TransferContent = dkd.protocol.TransferContent;

    // sender
    TransferContent.prototype.setRemitter = function (sender) {};
    TransferContent.prototype.getRemitter = function () {};

    // receiver
    TransferContent.prototype.setRemittee = function (receiver) {};
    TransferContent.prototype.getRemittee = function () {};

    //
    //  Factory
    //
    TransferContent.create = function (currency, amount) {
        return new TransferMoneyContent(currency, amount);
    };
