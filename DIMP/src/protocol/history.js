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

(function (ns) {
    'use strict';

    var Content = ns.protocol.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;

    /**
     *  Create history command
     *
     *  Usages:
     *      1. new HistoryCommand(map);
     *      2. new HistoryCommand(cmd);
     *      3. new HistoryCommand(type, cmd);
     */
    var HistoryCommand = function () {
        if (arguments.length === 2) {
            // new HistoryCommand(type, cmd);
            Command.call(this, arguments[0], arguments[1]);
        } else if (typeof arguments[0] === 'string') {
            // new HistoryCommand(cmd);
            Command.call(this, ContentType.HISTORY, arguments[0]);
        } else {
            // new HistoryCommand(map);
            Command.call(this, arguments[0]);
        }
    };
    ns.Class(HistoryCommand, Command, null);

    HistoryCommand.register = Command.register;

    //-------- history command names --------
    // account
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE  = 'suicide';

    //-------- register --------
    Content.register(ContentType.HISTORY, HistoryCommand);

    //-------- namespace --------
    ns.protocol.HistoryCommand = HistoryCommand;

    ns.protocol.register('HistoryCommand');

})(DIMP);
