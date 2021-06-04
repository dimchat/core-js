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

/**
 *  Money message: {
 *      type : 0x40,
 *      sn   : 123,
 *
 *      currency : "RMB", // USD, USDT, ...
 *      amount   : 100.00
 *  }
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new MoneyContent(map);
     *      2. new MoneyContent(currency);
     *      3. new MoneyContent(currency, amount);
     *      4. new MoneyContent(type, currency, amount);
     */
    var MoneyContent = function () {
        if (arguments.length === 3) {
            // new MoneyContent(type, currency, amount);
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2]);
        } else if (arguments.length === 2) {
            // new MoneyContent(currency, amount);
            BaseContent.call(ContentType.MONEY);
            this.setCurrency(arguments[0]);
            this.setAmount(arguments[1]);
        } else if (typeof arguments[0] === 'string') {
            // new MoneyContent(currency);
            BaseContent.call(ContentType.MONEY);
            this.setCurrency(arguments[0]);
        } else {
            // new MoneyContent(map);
            BaseContent.call(arguments[0]);
        }
    };
    ns.Class(MoneyContent, BaseContent, null);

    MoneyContent.getCurrency = function (content) {
        return content['currency'];
    };
    MoneyContent.setCurrency = function (currency, content) {
        content['currency'] = currency;
    };

    MoneyContent.getAmount = function (content) {
        return content['amount'];
    };
    MoneyContent.setAmount = function (amount, content) {
        content['amount'] = amount;
    };

    //-------- setter/getter --------

    MoneyContent.prototype.getCurrency = function () {
        return MoneyContent.getCurrency(this.getMap());
    };

    MoneyContent.prototype.setCurrency = function (currency) {
        MoneyContent.setCurrency(currency, this.getMap());
    };

    MoneyContent.prototype.getAmount = function () {
        return MoneyContent.getAmount(this.getMap());
    };

    MoneyContent.prototype.setAmount = function (amount) {
        MoneyContent.setAmount(amount, this.getMap());
    };

    //-------- namespace --------
    ns.protocol.MoneyContent = MoneyContent;

    ns.protocol.register('MoneyContent');

})(DIMP);

/**
 *  Transfer money message: {
 *      type : 0x41,
 *      sn   : 123,
 *
 *      currency : "RMB", // USD, USDT, ...
 *      amount   : 100.00
 *  }
 */

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.MoneyContent;

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new TransferContent(map);
     *      2. new TransferContent(currency);
     *      3. new TransferContent(currency, amount);
     */
    var TransferContent = function () {
        if (arguments.length === 2) {
            // new TransferContent(currency, amount);
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
        } else if (typeof arguments[0] === 'string') {
            // new TransferContent(currency);
            MoneyContent.call(ContentType.TRANSFER, arguments[0], 0);
        } else {
            // new TransferContent(map);
            MoneyContent.call(arguments[0]);
        }
    };
    ns.Class(TransferContent, MoneyContent, null);

    //-------- namespace --------
    ns.protocol.TransferContent = TransferContent;

    ns.protocol.register('TransferContent');

})(DIMP);
