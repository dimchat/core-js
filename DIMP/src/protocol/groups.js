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
 *  Group history command: {
 *      type : 0x89,
 *      sn   : 123,
 *
 *      command : "invite",      // expel, ...
 *      group   : "{GROUP_ID}",
 *      member  : "{MEMBER_ID}",
 *      members : ["{MEMBER_ID}", ],
 *  }
 */

//! require 'group.js'

(function (ns) {
    'use strict';

    var GroupCommand = ns.protocol.GroupCommand;

    //
    //  Invite group command
    //
    var InviteCommand = function () {};
    ns.Interface(InviteCommand, [GroupCommand]);

    // get members
    InviteCommand.prototype.getInviteMembers = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Expel group command
    //
    var ExpelCommand = function () {};
    ns.Interface(ExpelCommand, [GroupCommand]);

    // get members
    ExpelCommand.prototype.getExpelMembers = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Join group command
    //
    var JoinCommand = function () {};
    ns.Interface(JoinCommand, [GroupCommand]);

    // get text
    JoinCommand.prototype.getAsk = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Quit group command
    //
    var QuitCommand = function () {};
    ns.Interface(QuitCommand, [GroupCommand]);

    // get text
    QuitCommand.prototype.getBye = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Reset group command
    //
    var ResetCommand = function () {};
    ns.Interface(ResetCommand, [GroupCommand]);

    // get members
    ResetCommand.prototype.getAllMembers = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Query group command
    //
    var QueryCommand = function () {};
    ns.Interface(QueryCommand, [GroupCommand]);

    // get text
    QueryCommand.prototype.getText = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;

    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;

    ns.protocol.group.registers('InviteCommand');
    ns.protocol.group.registers('ExpelCommand');
    ns.protocol.group.registers('JoinCommand');
    ns.protocol.group.registers('QuitCommand');

    ns.protocol.group.registers('ResetCommand');
    ns.protocol.group.registers('QueryCommand');

})(DIMP);
