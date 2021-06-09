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

    var ID = ns.protocol.ID;

    var GroupCommand = ns.protocol.GroupCommand;

    //
    //  Invite group command
    //
    var InviteCommand = function () {
        if (arguments.length === 1) {
            // new InviteCommand(map);
            GroupCommand.call(this, arguments[0]);
        } else {
            // new InviteCommand(group, member);
            // new InviteCommand(group, members);
            GroupCommand.call(this, GroupCommand.INVITE, arguments[0], arguments[1]);
        }
    };
    ns.Class(InviteCommand, GroupCommand, null);

    //
    //  Expel group command
    //
    var ExpelCommand = function () {
        if (arguments.length === 1) {
            // new ExpelCommand(map);
            GroupCommand.call(this, arguments[0]);
        } else {
            // new ExpelCommand(group, member);
            // new ExpelCommand(group, members);
            GroupCommand.call(this, GroupCommand.EXPEL, arguments[0], arguments[1]);
        }
    };
    ns.Class(ExpelCommand, GroupCommand, null);

    //
    //  Join group command
    //
    var JoinCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new JoinCommand(group);
            GroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            // new JoinCommand(map);
            GroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinCommand, GroupCommand, null);

    //
    //  Quit group command
    //
    var QuitCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new QuitCommand(group);
            GroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            // new QuitCommand(map);
            GroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitCommand, GroupCommand, null);

    //
    //  Reset group command
    //
    var ResetCommand = function () {
        if (arguments.length === 1) {
            // new ResetCommand(map);
            GroupCommand.call(this, arguments[0]);
        } else {
            // new ResetCommand(group, members);
            GroupCommand.call(this, GroupCommand.RESET, arguments[0], arguments[1]);
        }
    };
    ns.Class(ResetCommand, GroupCommand, null);

    //
    //  Query group command
    //
    var QueryCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new QueryCommand(group);
            GroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            // new QueryCommand(map);
            GroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryCommand, GroupCommand, null);

    //-------- factories --------

    GroupCommand.invite = function (group, members) {
        return new InviteCommand(group, members);
    };

    GroupCommand.expel = function (group, members) {
        return new ExpelCommand(group, members);
    };

    GroupCommand.join = function (group) {
        return new JoinCommand(group);
    };

    GroupCommand.quit = function (group) {
        return new QuitCommand(group);
    };

    GroupCommand.reset = function (group, members) {
        return new ResetCommand(group, members);
    };

    GroupCommand.query = function (group) {
        return new QueryCommand(group);
    };

    //-------- register --------
    GroupCommand.register(GroupCommand.INVITE, InviteCommand);
    GroupCommand.register(GroupCommand.EXPEL, ExpelCommand);
    GroupCommand.register(GroupCommand.JOIN, JoinCommand);
    GroupCommand.register(GroupCommand.QUIT, QuitCommand);

    GroupCommand.register(GroupCommand.RESET, ResetCommand);
    GroupCommand.register(GroupCommand.QUERY, QueryCommand);

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
