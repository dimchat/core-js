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

/**
 *  Command message: {
 *      type : 0x88,
 *      sn   : 123,
 *
 *      command : "...", // command name
 *      extra   : info   // command parameters
 *  }
 */

//! require <dkd.js>

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;

    /**
     *  Create command
     *
     *  Usages:
     *      1. new Command(map);
     *      2. new Command(cmd);
     *      3. new Command(type, cmd);
     */
    var Command = function () {
        if (arguments.length === 2) {
            // new Command(type, cmd);
            BaseContent.call(this, arguments[0]);
            this.setCommand(arguments[1]);
        } else if (typeof arguments[0] === 'string') {
            // new Command(cmd);
            BaseContent.call(this, ContentType.COMMAND);
            this.setCommand(arguments[0]);
        } else {
            // new Command(map);
            BaseContent.call(this, arguments[0]);
        }
    };
    ns.Class(Command, BaseContent, null);

    Command.getCommand = function (cmd) {
        return cmd['command'];
    };
    Command.setCommand = function (name, cmd) {
        if (name && name.length > 0) {
            cmd['command'] = name;
        } else {
            delete cmd['command'];
        }
    };

    //-------- setter/getter --------

    /**
     *  Command name
     *
     * @returns {String}
     */
    Command.prototype.getCommand = function () {
        return Command.getCommand(this.getMap());
    };
    Command.prototype.setCommand = function (name) {
        Command.setCommand(name, this.getMap());
    };

    //-------- command names --------
    Command.META      = 'meta';
    Command.DOCUMENT  = 'document';
    Command.RECEIPT   = 'receipt';
    Command.HANDSHAKE = 'handshake';
    Command.LOGIN     = 'login';

    //-------- namespace --------
    ns.protocol.Command = Command;

    ns.protocol.register('Command');

})(DIMP);

(function (ns) {
    'use strict';

    var Command = ns.protocol.Command;

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = function () {
    };
    ns.Interface(CommandFactory, null);

    // noinspection JSUnusedLocalSymbols
    CommandFactory.prototype.parseCommand = function (cmd) {
        console.assert(false, 'implement me!');
        return null;
    };

    Command.Factory = CommandFactory;

    var s_factories = {};  // String -> CommandFactory

    /**
     *  Register command factory with name
     *
     * @param {String} name
     * @param {CommandFactory} factory
     */
    Command.register = function (name, factory) {
        s_factories[name] = factory;
    };
    Command.getFactory = function (name) {
        return s_factories[name];
    }

})(DIMP);
