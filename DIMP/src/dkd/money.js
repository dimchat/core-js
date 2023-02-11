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

//! require 'protocol/money.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create money message content
     *
     *  Usages:
     *      1. new BaseMoneyContent(map);
     *      2. new BaseMoneyContent(currency, amount);
     *      3. new BaseMoneyContent(type, currency, amount);
     */
    var BaseMoneyContent = function () {
        if (arguments.length === 1) {
            // new BaseMoneyContent(map);
            BaseContent.call(arguments[0]);
        } else if (arguments.length === 2) {
            // new BaseMoneyContent(currency, amount);
            BaseContent.call(ContentType.MONEY);
            this.setCurrency(arguments[0]);
            this.setAmount(arguments[1]);
        } else if (arguments.length === 3) {
            // new BaseMoneyContent(type, currency, amount);
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2]);
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(BaseMoneyContent, BaseContent, [MoneyContent], {

        // Override
        setCurrency: function (currency) {
            this.setValue('currency', currency);
        },
        // Override
        getCurrency: function () {
            return this.getString('currency');
        },

        // Override
        setAmount: function (amount) {
            this.setValue('amount', amount);
        },
        // Override
        getAmount: function () {
            return this.getNumber('amount');
        }
    });

    /**
     *  Create transfer money message content
     *
     *  Usages:
     *      1. new TransferMoneyContent(map);
     *      3. new TransferMoneyContent(currency, amount);
     */
    var TransferMoneyContent = function () {
        if (arguments.length === 1) {
            // new TransferMoneyContent(map);
            MoneyContent.call(arguments[0]);
        } else if (arguments.length === 2) {
            // new TransferMoneyContent(currency, amount);
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {

        // Override
        getRemitter: function () {
            var sender = this.getValue('remitter');
            return ID.parse(sender);
        },

        // Override
        setRemitter: function (sender) {
            this.setString('remitter', sender);
        },

        // Override
        getRemittee: function () {
            var receiver = this.getValue('remittee');
            return ID.parse(receiver);
        },

        // Override
        setRemittee: function (receiver) {
            this.setString('remittee', receiver);
        }
    });

    //-------- namespace --------
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent;

})(DIMP);
