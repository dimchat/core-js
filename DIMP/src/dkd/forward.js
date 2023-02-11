;
// license: https://mit-license.org
//
//  Dao-Ke-Dao: Universal Message Module
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

//! require 'protocol/forward.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create top-secret message content
     *
     *  Usages:
     *      1. new SecretContent(map);
     *      2. new SecretContent(msg);
     *      3. new SecretContent(messages);
     */
    var SecretContent = function () {
        var info = arguments[0];
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            // new SecretContent(messages);
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info;
        } else if (Interface.conforms(info, ReliableMessage)) {
            // new SecretContent(msg);
            BaseContent.call(this, ContentType.FORWARD);
            forward = info;
        } else {
            // new SecretContent(map);
            BaseContent.call(this, info);
        }
        if (forward) {
            this.setMap('forward', forward);
        } else if (secrets) {
            var array = SecretContent.revert(secrets);
            this.setValue('secrets', array);
        }
        this.__forward = forward;
        this.__secrets = secrets;
    };
    Class(SecretContent, BaseContent, [ForwardContent], {

        // Override
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue('forward');
                this.__forward = ReliableMessage.parse(forward);
            }
            return this.__forward;
        },

        // Override
        getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue('secrets');
                if (array) {
                    // get from 'secrets'
                    this.__secrets = SecretContent.convert(array);
                } else {
                    // get from 'forward'
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg);
                    }
                }
            }
            return this.__secrets;
        }
    });

    SecretContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg);
            }
        }
        return array;
    };
    SecretContent.revert = function (messages) {
        var array = [];
        for (var i = 0; i < messages.length; ++i) {
            array.push(messages[i].toMap());
        }
        return array;
    };

    //-------- namespace --------
    ns.dkd.SecretContent = SecretContent;

})(DaoKeDao);
