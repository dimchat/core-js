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

//! require 'protocol/groups.js'
//! require 'group.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var BaseGroupCommand = ns.dkd.BaseGroupCommand;

    //
    //  Invite group command
    //
    var InviteGroupCommand = function () {
        if (arguments.length === 1) {
            // new InviteGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            // new InviteGroupCommand(group, member);
            // new InviteGroupCommand(group, members);
            BaseGroupCommand.call(this, GroupCommand.INVITE, arguments[0], arguments[1]);
        }
    };
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);

    //
    //  Expel group command
    //
    var ExpelGroupCommand = function () {
        if (arguments.length === 1) {
            // new ExpelGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            // new ExpelGroupCommand(group, member);
            // new ExpelGroupCommand(group, members);
            BaseGroupCommand.call(this, GroupCommand.EXPEL, arguments[0], arguments[1]);
        }
    };
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);

    //
    //  Join group command
    //
    var JoinGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            // new JoinGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            // new JoinGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);

    //
    //  Quit group command
    //
    var QuitGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            // new QuitGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            // new QuitGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);

    //
    //  Reset group command
    //
    var ResetGroupCommand = function () {
        if (arguments.length === 1) {
            // new ResetGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            // new ResetGroupCommand(group, members);
            BaseGroupCommand.call(this, GroupCommand.RESET, arguments[0], arguments[1]);
        }
    };
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);

    //
    //  Query group command
    //
    var QueryGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            // new QueryGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            // new QueryGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);

    //
    //  Factories
    //

    //-------- namespace --------
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;

    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;

})(DIMP);
