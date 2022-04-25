;
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

//! require <dkd.js>

(function (ns) {
    'use strict';

    var Content = ns.protocol.Content;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      command : "...", // command name
     *      extra   : info   // command parameters
     *  }
     */
    var Command = function () {};
    ns.Interface(Command, [Content]);

    //-------- command names --------
    Command.META      = 'meta';
    Command.DOCUMENT  = 'document';
    Command.RECEIPT   = 'receipt';
    Command.HANDSHAKE = 'handshake';
    Command.LOGIN     = 'login';

    /**
     *  Command name
     *
     * @returns {String}
     */
    Command.prototype.getCommand = function () {
        console.assert(false, 'implement me!');
        return '';
    };
    Command.getCommand = function (cmd) {
        return cmd['command'];
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = function () {};
    ns.Interface(CommandFactory, null);

    // noinspection JSUnusedLocalSymbols
    CommandFactory.prototype.parseCommand = function (cmd) {
        console.assert(false, 'implement me!');
        return null;
    };

    Command.Factory = CommandFactory;

    //
    //  Instances of CommandFactory
    //
    var s_command_factories = {};  // String -> CommandFactory

    /**
     *  Register command factory with name
     *
     * @param {String} name
     * @param {CommandFactory} factory
     */
    Command.setFactory = function (name, factory) {
        s_command_factories[name] = factory;
    };
    Command.getFactory = function (name) {
        return s_command_factories[name];
    }

    //-------- namespace --------
    ns.protocol.Command = Command;

    ns.protocol.registers('Command');

})(DIMP);
