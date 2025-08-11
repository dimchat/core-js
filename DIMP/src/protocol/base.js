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

//! require <dkd.js>

    /**
     *  Command message: {
     *      type : i2s(0x88),
     *      sn   : 123,
     *
     *      command : "...", // command name
     *      extra   : info   // command parameters
     *  }
     */
    dkd.protocol.Command = Interface(null, [Content]);
    var Command = dkd.protocol.Command;

    //-------- command names begin --------
    Command.META      = 'meta';
    Command.DOCUMENTS = 'documents';
    Command.RECEIPT   = 'receipt';
    //-------- command names end --------

    /**
     *  Get command name
     *
     * @returns {String} command/method/declaration
     */
    Command.prototype.getCmd = function () {};

    //
    //  Factory method
    //

    Command.parse = function (command) {
        var helper = CommandExtensions.getCommandHelper();
        return helper.parseCommand(command);
    };

    Command.setFactory = function (cmd, factory) {
        var helper = CommandExtensions.getCommandHelper();
        helper.setCommandFactory(cmd, factory);
    };
    Command.getFactory = function (cmd) {
        var helper = CommandExtensions.getCommandHelper();
        return helper.getCommandFactory(cmd);
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    Command.Factory = Interface(null, null);
    var CommandFactory = Command.Factory;

    /**
     *  Parse map object to command
     *
     * @param {*} content - command content
     * @return {Command}
     */
    CommandFactory.prototype.parseCommand = function (content) {};
