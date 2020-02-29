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
 *  History command: {
 *      type : 0x89,
 *      sn   : 123,
 *
 *      command : "...", // command name
 *      time    : 0,     // command timestamp
 *      extra   : info   // command parameters
 *  }
 */

//! require 'command.js'

!function (ns) {
    'use strict';

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;

    /**
     *  Create history command
     *
     * @param info {{}|String} - command info; or command name
     * @constructor
     */
    var HistoryCommand = function (info) {
        var name = null;
        var time = null;
        if (!info) {
            // create empty history command
            time = new Date();
            info = ContentType.HISTORY;
        } else if (typeof info === 'string') {
            // create new history command with name
            name = info;
            time = new Date();
            info = ContentType.HISTORY;
        }
        Command.call(this, info);
        if (name) {
            this.setCommand(name);
        }
        if (time) {
            this.setTime(time);
        }
    };
    ns.Class(HistoryCommand, Command, null);

    /**
     *  Command time
     *
     * @returns {Date}
     */
    HistoryCommand.prototype.getTime = function () {
        var time = this.getValue('time');
        if (time) {
            return new Date(time * 1000);
        } else {
            return null;
        }
    };
    HistoryCommand.prototype.setTime = function (time) {
        if (!time) {
            // get current time
            time = new Date();
        }
        if (time instanceof Date) {
            // set timestamp in seconds
            this.setValue('time', time.getTime() / 1000);
        } else if (typeof time === 'number') {
            this.setValue('time', time);
        } else {
            throw TypeError('time error: ' + time);
        }
    };

    //-------- history command names --------
    // account
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE  = 'suicide';

    //-------- Runtime --------

    HistoryCommand.getInstance = function (cmd) {
        if (!cmd) {
            return null;
        } else if (cmd instanceof HistoryCommand) {
            return cmd;
        }
        // check group
        if (cmd.hasOwnProperty('group')) {
            // create instance as group command
            return ns.protocol.GroupCommand.getInstance(cmd);
        }
        // custom history command
        return new HistoryCommand(cmd);
    };

    //-------- register --------
    Content.register(ContentType.HISTORY, HistoryCommand);

    //-------- namespace --------
    ns.protocol.HistoryCommand = HistoryCommand;

    ns.protocol.register('HistoryCommand');

}(DIMP);
