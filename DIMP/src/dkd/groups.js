'use strict';
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

//! require 'protocol/groups.js'
//! require 'base.js'

    /**
     *  Create history command
     *
     *  Usages:
     *      1. new BaseHistoryCommand(map);
     *      2. new BaseHistoryCommand(cmd);
     *      3. new BaseHistoryCommand(type, cmd);
     */
    dkd.dkd.BaseHistoryCommand = function () {
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
    var BaseHistoryCommand = dkd.dkd.BaseHistoryCommand;
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand]);


    /**
     *  Create group command
     *
     *  Usages:
     *      1. new BaseGroupCommand(map);
     *      2. new BaseGroupCommand(cmd, group);
     */
    dkd.dkd.BaseGroupCommand = function () {
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
    var BaseGroupCommand = dkd.dkd.BaseGroupCommand;
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand]);
    Implementation(BaseGroupCommand, {

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


    /**
     *  Invite group command
     */
    dkd.dkd.InviteGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new InviteGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.INVITE, info)
        } else {
            // new InviteGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var InviteGroupCommand = dkd.dkd.InviteGroupCommand;
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand]);

    /**
     *  Expel group command
     */
    dkd.dkd.ExpelGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ExpelGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
        } else {
            // new ExpelGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var ExpelGroupCommand = dkd.dkd.ExpelGroupCommand;
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand]);

    /**
     *  Join group command
     */
    dkd.dkd.JoinGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new JoinGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.JOIN, info)
        } else {
            // new JoinGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var JoinGroupCommand = dkd.dkd.JoinGroupCommand;
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand]);

    /**
     *  Quit group command
     */
    dkd.dkd.QuitGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new QuitGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.QUIT, info)
        } else {
            // new QuitGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var QuitGroupCommand = dkd.dkd.QuitGroupCommand;
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand]);

    /**
     *  Reset group command
     */
    dkd.dkd.ResetGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ResetGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.RESET, info)
        } else {
            // new ResetGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var ResetGroupCommand = dkd.dkd.ResetGroupCommand;
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand]);

    //  Administrators, Assistants

    /**
     *  Hire group command
     */
    dkd.dkd.HireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new HireGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.HIRE, info)
        } else {
            // new HireGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var HireGroupCommand = dkd.dkd.HireGroupCommand;
    Class(HireGroupCommand, BaseGroupCommand, [HireCommand]);
    Implementation(HireGroupCommand, {
        // Override
        getAdministrators: function () {
            var array = this.getValue('administrators');
            return !array ? null : ID.convert(array);
        },
        // Override
        setAdministrators: function (admins) {
            if (!admins) {
                this.removeValue('administrators');
            } else {
                var array = ID.revert(admins);
                this.setValue('administrators', array);
            }
        },
        // Override
        getAssistants: function () {
            var array = this.getValue('assistants');
            return !array ? null : ID.convert(array);
        },
        // Override
        setAssistants: function (bots) {
            if (!bots) {
                this.removeValue('assistants');
            } else {
                var array = ID.revert(bots);
                this.setValue('assistants', array);
            }
        }
    });

    /**
     *  Fire group command
     */
    dkd.dkd.FireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new FireGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.FIRE, info)
        } else {
            // new FireGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var FireGroupCommand = dkd.dkd.FireGroupCommand;
    Class(FireGroupCommand, BaseGroupCommand, [FireCommand]);
    Implementation(FireGroupCommand, {
        // Override
        getAssistants: function () {
            var array = this.getValue('assistants');
            return !array ? null : ID.convert(array);
        },
        // Override
        setAssistants: function (bots) {
            if (!bots) {
                this.removeValue('assistants');
            } else {
                var array = ID.revert(bots);
                this.setValue('assistants', array);
            }
        },
        // Override
        getAdministrators: function () {
            var array = this.getValue('administrators');
            return !array ? null : ID.convert(array);
        },
        // Override
        setAdministrators: function (admins) {
            if (!admins) {
                this.removeValue('administrators');
            } else {
                var array = ID.revert(admins);
                this.setValue('administrators', array);
            }
        }
    });

    /**
     *  Resign group command
     */
    dkd.dkd.ResignGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new ResignGroupCommand(group);
            BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
        } else {
            // new ResignGroupCommand(map);
            BaseGroupCommand.call(this, info);
        }
    };
    var ResignGroupCommand = dkd.dkd.ResignGroupCommand;
    Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand]);
