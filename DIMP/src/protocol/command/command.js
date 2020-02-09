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

!function (ns) {
    'use strict';

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;

    /**
     *  Create command
     *
     * @param info - command info; or command name
     * @constructor
     */
    var Command = function (info) {
        var name = null;
        if (!info) {
            // create empty command
            info = ContentType.COMMAND;
        } else if (typeof info === 'string') {
            // create new command with name
            name = info;
            info = ContentType.COMMAND;
        }
        Content.call(this, info);
        if (name) {
            this.setCommand(name);
        }
    };
    ns.type.Class(Command, Content);

    /**
     *  Command name
     *
     * @returns {string}
     */
    Command.prototype.getCommand = function () {
        return this.getValue('command');
    };
    Command.prototype.setCommand = function (name) {
        this.setValue('command', name);
    };

    //-------- command names --------
    Command.HANDSHAKE = 'handshake';
    Command.RECEIPT   = 'receipt';
    Command.META      = 'meta';
    Command.PROFILE   = 'profile';

    //-------- Runtime --------
    var command_classes = {};

    Command.register = function (name, clazz) {
        command_classes[name] = clazz;
    };

    // get subclass by command name
    Command.getClass = function (cmd) {
        if (typeof cmd === 'string') {
            return command_classes[cmd];
        }
        var command = cmd['command'];
        if (!command) {
            return null;
        }
        return command_classes[command];
    };

    Command.getInstance = function (cmd) {
        if (!cmd) {
            return null;
        } else if (cmd instanceof Command) {
            return cmd;
        }
        // create instance by subclass (with command name)
        var clazz = Command.getClass(cmd);
        if (typeof clazz === 'function') {
            return Content.createInstance(clazz, cmd);
        }
        // custom command
        return new Command(cmd);
    };

    //-------- register --------
    Content.register(ContentType.COMMAND, Command);

    //-------- namespace --------
    ns.protocol.Command = Command;

    ns.protocol.register('Command');

}(DIMP);
