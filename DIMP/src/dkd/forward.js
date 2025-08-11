'use strict';
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

//! require 'protocol/forward.js'
//! require 'base.js'

    /**
     *  Create top-secret message content
     *
     *  Usages:
     *      1. new SecretContent(map);
     *      2. new SecretContent(msg);
     *      3. new SecretContent(messages);
     */
    dkd.dkd.SecretContent = function (info) {
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
            var array = ReliableMessage.revert(secrets);
            this.setValue('secrets', array);
        }
        this.__forward = forward;
        this.__secrets = secrets;
    };
    var SecretContent = dkd.dkd.SecretContent;

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
            var messages = this.__secrets;
            if (!messages) {
                var array = this.getValue('secrets');
                if (array) {
                    // get from 'secrets'
                    messages = ReliableMessage.convert(array);
                } else {
                    // get from 'forward'
                    var msg = this.getForward();
                    messages = !msg ? [] : [msg];
                }
                this.__secrets = messages;
            }
            return messages;
        }
    });

    /**
     *  Create chat-history content
     *
     *  Usages:
     *      1. new CombineForwardContent(map);
     *      2. new CombineForwardContent(title, messages);
     */
    dkd.dkd.CombineForwardContent = function () {
        var title;
        var messages;
        if (arguments.length === 2) {
            // new CombineForwardContent(title, messages);
            BaseContent.call(this, ContentType.COMBINE_FORWARD);
            title = arguments[0];
            messages = arguments[1];
        } else {
            // new CombineForwardContent(map);
            BaseContent.call(this, arguments[0]);
            title = null;
            messages = null;
        }
        if (title) {
            this.setValue('title', title);
        }
        if (messages) {
            var array = InstantMessage.revert(messages);
            this.setValue('messages', array);
        }
        this.__history = messages;
    };
    var CombineForwardContent = dkd.dkd.CombineForwardContent;

    Class(CombineForwardContent, BaseContent, [CombineContent], {

        // Override
        getTitle: function () {
            return this.getString('title', '');
        },

        // Override
        getMessages: function () {
            var messages = this.__history;
            if (!messages) {
                var array = this.getValue('messages');
                if (array) {
                    messages = InstantMessage.convert(array);
                } else {
                    messages = [];
                }
                this.__history = messages;
            }
            return messages;
        }
    });


    /**
     *  Create array list content
     *
     *  Usages:
     *      1. new ListContent(map);
     *      2. new ListContent(contents);
     */
    dkd.dkd.ListContent = function (info) {
        var list;
        if (info instanceof Array) {
            // new ListContent(contents);
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', Content.revert(list));
        } else {
            // new ListContent(map);
            BaseContent.call(this, info);
            // lazy load
            list = null;
        }
        this.__list = list;
    };
    var ListContent = dkd.dkd.ListContent;

    Class(ListContent, BaseContent, [ArrayContent], {

        // Override
        getContents: function () {
            var contents = this.__list;
            if (!contents) {
                var array = this.getValue('contents');
                if (array) {
                    contents = Content.convert(array);
                } else {
                    contents = [];
                }
                this.__list = contents;
            }
            return contents;
        }
    });
