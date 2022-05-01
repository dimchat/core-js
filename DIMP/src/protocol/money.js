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
    var MoneyContent = function () {};
    ns.Interface(MoneyContent, [Content]);

    /**
     *  Set currency (BTC, ETH, USD, CNY, ...)
     *
     * @param {String} currency
     */
    MoneyContent.prototype.setCurrency = function (currency) {
        ns.assert(false, 'implement me!');
    };
    MoneyContent.prototype.getCurrency = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    MoneyContent.setCurrency = function (currency, content) {
        content['currency'] = currency;
    };
    MoneyContent.getCurrency = function (content) {
        return content['currency'];
    };

    /**
     *  Set amount
     *
     * @param {float} amount
     */
    MoneyContent.prototype.setAmount = function (amount) {
        ns.assert(false, 'implement me!');
    };
    MoneyContent.prototype.getAmount = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    MoneyContent.setAmount = function (amount, content) {
        content['amount'] = amount;
    };
    MoneyContent.getAmount = function (content) {
        return content['amount'];
    };

    /**
     *  Transfer money message: {
     *      type : 0x41,
     *      sn   : 123,
     *
     *      currency : "RMB", // USD, USDT, ...
     *      amount   : 100.00
     *  }
     */
    var TransferContent = function () {};
    ns.Interface(TransferContent, [MoneyContent]);

    TransferContent.prototype.setComment = function (text) {
        ns.assert(false, 'implement me!');
    };
    TransferContent.prototype.getComment = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;

    ns.protocol.registers('MoneyContent');
    ns.protocol.registers('TransferContent');

})(DIMP);
