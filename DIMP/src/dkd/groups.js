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
    ns.Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand]);

    // Override
    InviteGroupCommand.prototype.getInviteMembers = function () {
        return this.getMembers();
    };

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
    ns.Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand]);

    // Override
    ExpelGroupCommand.prototype.getExpelMembers = function () {
        return this.getMembers();
    };

    //
    //  Join group command
    //
    var JoinGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new JoinGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            // new JoinGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand]);

    // Override
    JoinGroupCommand.prototype.getAsk = function () {
        return this.getValue('text');
    };

    //
    //  Quit group command
    //
    var QuitGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new QuitGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            // new QuitGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand]);

    // Override
    QuitGroupCommand.prototype.getBye = function () {
        return this.getValue('text');
    };

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
    ns.Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand]);

    // Override
    ResetGroupCommand.prototype.getAllMembers = function () {
        return this.getMembers();
    };

    //
    //  Query group command
    //
    var QueryGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            // new QueryGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            // new QueryGroupCommand(map);
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand]);

    // Override
    QueryGroupCommand.prototype.getText = function () {
        return this.getValue('text');
    };

    //-------- factories --------

    GroupCommand.invite = function (group, members) {
        return new InviteGroupCommand(group, members);
    };

    GroupCommand.expel = function (group, members) {
        return new ExpelGroupCommand(group, members);
    };

    GroupCommand.join = function (group) {
        return new JoinGroupCommand(group);
    };

    GroupCommand.quit = function (group) {
        return new QuitGroupCommand(group);
    };

    GroupCommand.reset = function (group, members) {
        return new ResetGroupCommand(group, members);
    };

    GroupCommand.query = function (group) {
        return new QueryGroupCommand(group);
    };

    //-------- namespace --------
    ns.dkd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.QuitGroupCommand = QuitGroupCommand;

    ns.dkd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.QueryGroupCommand = QueryGroupCommand;

    ns.dkd.registers('InviteGroupCommand');
    ns.dkd.registers('ExpelGroupCommand');
    ns.dkd.registers('JoinGroupCommand');
    ns.dkd.registers('QuitGroupCommand');

    ns.dkd.registers('ResetGroupCommand');
    ns.dkd.registers('QueryGroupCommand');

})(DIMP);
