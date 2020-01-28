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

//! require 'command.js'

!function (ns) {

    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;

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
    var HistoryCommand = function (info) {
        if (!info) {
            // create empty history command
            Command.call(this, ContentType.HISTORY);
            this.time = get_time.call(this);
        } else if (typeof info === 'number' || info instanceof ContentType) {
            // create command with special type
            Command.call(this, info);
            this.time = get_time.call(this);
        } else if (typeof info === 'string') {
            // create command with name
            Command.call(this, ContentType.HISTORY);
            this.time = get_time.call(this);
            this.setCommand(info);
        } else {
            // create command
            Command.call(this, info);
            this.time = get_time.call(this, info);
        }
    };
    HistoryCommand.inherits(Command);

    var get_time = function (cmd) {
        var time;
        if (cmd) {
            time = cmd['time'];
            if (time) {
                time = new Date(time * 1000);
            }
        } else {
            time = new Date();
            this.setValue('time', time.getTime() / 1000);
        }
        return time;
    };

    //-------- command names --------
    // account
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE  = 'suicide';
    // group: founder/owner
    HistoryCommand.FOUND    = 'found';
    HistoryCommand.ABDICATE = 'abdicate';
    // group: member
    HistoryCommand.INVITE   = 'invite';
    HistoryCommand.EXPEL    = 'expel';
    HistoryCommand.JOIN     = 'join';
    HistoryCommand.QUIT     = 'quit';
    HistoryCommand.QUERY    = 'query';
    HistoryCommand.RESET    = 'reset';
    // group: administrator/assistant
    HistoryCommand.HIRE     = 'hire';
    HistoryCommand.FIRE     = 'fire';
    HistoryCommand.RESIGN   = 'resign';

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
            return ns.GroupCommand.getInstance(cmd);
        }
        // custom history command
        return new HistoryCommand(cmd);
    };

    //-------- register --------
    Content.register(ContentType.HISTORY, HistoryCommand);

    //-------- namespace --------
    ns.protocol.HistoryCommand = HistoryCommand;

}(DIMP);
