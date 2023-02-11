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

    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      cmd     : "...", // command name
     *      extra   : info   // command parameters
     *  }
     */
    var Command = Interface(null, [Content]);

    //-------- command names begin --------
    Command.META      = 'meta';
    Command.DOCUMENT  = 'document';
    //-------- command names end --------

    /**
     *  Command name
     *
     * @returns {String}
     */
    Command.prototype.getCmd = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = Interface(null, null);

    CommandFactory.prototype.parseCommand = function (cmd) {
        throw new Error('NotImplemented');
    };

    Command.Factory = CommandFactory;

    var general_factory = function () {
        var man = ns.dkd.cmd.FactoryManager;
        return man.generalFactory;
    };

    /**
     *  Register command factory with name
     *
     * @param {String} cmd
     * @param {CommandFactory} factory
     */
    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory);
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd);
    };

    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command);
    };

    //-------- namespace --------
    ns.protocol.Command = Command;

})(DIMP);
