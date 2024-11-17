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

//! require 'protocol/history.js'
//! require 'command.js'

(function (ns) {
    'use strict';

    var Class   = ns.type.Class;
    var IObject = ns.type.Object;
    var ID             = ns.protocol.ID;
    var ContentType    = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand   = ns.protocol.GroupCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;

    /**
     *  Create history command
     *
     *  Usages:
     *      1. new BaseHistoryCommand(map);
     *      2. new BaseHistoryCommand(cmd);
     *      3. new BaseHistoryCommand(type, cmd);
     */
    var BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            // new BaseCommand(type, cmd);
            BaseCommand.call(this, arguments[0], arguments[1]);
        } else if (IObject.isString(arguments[0])) {
            // new BaseCommand(cmd);
            BaseCommand.call(this, ContentType.HISTORY, arguments[0]);
        } else {
            // new BaseCommand(map);
            BaseCommand.call(this, arguments[0]);
        }
    };
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);

    /**
     *  Create group command
     *
     *  Usages:
     *      1. new BaseGroupCommand(map);
     *      2. new BaseGroupCommand(cmd, group);
     */
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            // new BaseGroupCommand(map);
            BaseHistoryCommand.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new BaseGroupCommand(cmd, group);
            BaseHistoryCommand.call(this, ContentType.COMMAND, arguments[0]);
            this.setGroup(arguments[1]);
        } else {
            throw new SyntaxError('Group command arguments error: ' + arguments);
        }
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {

        // Override
        setMember: function (identifier) {
            this.setString('member', identifier);
            this.removeValue('members');
        },

        // Override
        getMember: function () {
            var member = this.getValue('member');
            return ID.parse(member);
        },

        // Override
        setMembers: function (users) {
            if (!users) {
                this.removeValue('members');
            } else {
                var array = ID.revert(users);
                this.setValue('members', array);
            }
            this.removeValue('member');
        },

        // Override
        getMembers: function () {
            var array = this.getValue('members');
            if (array instanceof Array) {
                // convert all items to ID objects
                return ID.convert(array);
            }
            // get from 'member'
            var single = this.getMember();
            return !single ? [] : [single];
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseHistoryCommand = BaseHistoryCommand;
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class     = ns.type.Class;
    var ID            = ns.protocol.ID;
    var GroupCommand  = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand  = ns.protocol.group.ExpelCommand;
    var JoinCommand   = ns.protocol.group.JoinCommand;
    var QuitCommand   = ns.protocol.group.QuitCommand;
    var ResetCommand  = ns.protocol.group.ResetCommand;
    var QueryCommand  = ns.protocol.group.QueryCommand;
    var HireCommand   = ns.protocol.group.HireCommand;
    var FireCommand   = ns.protocol.group.FireCommand;
    var ResignCommand = ns.protocol.group.ResignCommand;
    var BaseGroupCommand = ns.dkd.cmd.BaseGroupCommand;

    /**
     *  Invite group command
     */
    var InviteGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new InviteGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.INVITE, info)
        } else {
            // new InviteGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);

    /**
     *  Expel group command
     */
    var ExpelGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ExpelGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
        } else {
            // new ExpelGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);

    /**
     *  Join group command
     */
    var JoinGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new JoinGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.JOIN, info)
        } else {
            // new JoinGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);

    /**
     *  Quit group command
     */
    var QuitGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new QuitGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUIT, info)
        } else {
            // new QuitGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);

    /**
     *  Reset group command
     */
    var ResetGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ResetGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.RESET, info)
        } else {
            // new ResetGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);

    /**
     *  Query group command
     */
    var QueryGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new QueryGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUERY, info)
        } else {
            // new QueryGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);

    //  Administrators, Assistants

    /**
     *  Hire group command
     */
    var HireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new HireGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.HIRE, info)
        } else {
            // new HireGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(HireGroupCommand, BaseGroupCommand, [HireCommand], null);

    /**
     *  Fire group command
     */
    var FireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new FireGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.FIRE, info)
        } else {
            // new FireGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(FireGroupCommand, BaseGroupCommand, [FireCommand], null);

    /**
     *  Resign group command
     */
    var ResignGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ResignGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
        } else {
            // new ResignGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand], null);


    //-------- namespace --------
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand  = ExpelGroupCommand;

    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;

    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;

    ns.dkd.cmd.HireGroupCommand = HireGroupCommand;
    ns.dkd.cmd.FireGroupCommand = FireGroupCommand;
    ns.dkd.cmd.ResignGroupCommand = ResignGroupCommand;

})(DIMP);
