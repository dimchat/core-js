'use strict';
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

/**
 *  Envelope for message
 *  ~~~~~~~~~~~~~~~~~~~~
 *  This class is used to create a message envelope
 *  which contains 'sender', 'receiver' and 'time'
 *
 *  data format: {
 *      sender   : "moki@xxx",
 *      receiver : "hulk@yyy",
 *      time     : 123
 *  }
 */

//! require <crypto.js>
//! require <mkm.js>
//! require <dkd.js>

    /**
     *  Create envelope
     *
     *  Usages:
     *      1. new MessageEnvelope(map);
     *      2. new MessageEnvelope(sender, receiver);
     *      3. new MessageEnvelope(sender, receiver, time);
     */
    dkd.msg.MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            // new MessageEnvelope(map);
            env = arguments[0];
            from = null;
            to = null;
            when = null;
        } else if (arguments.length === 2 || arguments.length === 3) {
            // new MessageEnvelope(sender, receiver);
            // new MessageEnvelope(sender, receiver, time);
            from = arguments[0];
            to = arguments[1];
            if (arguments.length === 2) {
                when = new Date();
            } else {
                when = arguments[2];
                if (when === null || when === 0) {
                    when = new Date();
                } else {
                    when = Converter.getDateTime(when, null);
                }
            }
            env = {
                'sender': from.toString(),
                'receiver': to.toString(),
                'time': when.getTime() / 1000.0
            };
        } else {
            throw new SyntaxError('envelope arguments error: ' + arguments);
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when;
    };
    var MessageEnvelope = dkd.msg.MessageEnvelope;

    Class(MessageEnvelope, Dictionary, [Envelope]);

    Implementation(MessageEnvelope, {

        // Override
        getSender: function () {
            var sender = this.__sender;
            if (!sender) {
                sender = ID.parse(this.getValue('sender'));
                this.__sender = sender;
            }
            return sender;
        },

        // Override
        getReceiver: function () {
            var receiver = this.__receiver;
            if (!receiver) {
                receiver = ID.parse(this.getValue('receiver'));
                if (!receiver) {
                    receiver = ID.ANYONE;
                }
                this.__receiver = receiver;
            }
            return receiver;
        },

        // Override
        getTime: function () {
            var time = this.__time;
            if (!time) {
                time = this.getDateTime('time', null);
                this.__time = time;
            }
            return time;
        },

        // Override
        getGroup: function () {
            return ID.parse(this.getValue('group'));
        },

        // Override
        setGroup: function (identifier) {
            this.setString('group', identifier);
        },

        // Override
        getType: function () {
            return this.getInt('type', null);
        },

        // Override
        setType: function (type) {
            this.setValue('type', type);
        }
    });
