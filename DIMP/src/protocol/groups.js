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

//! require 'command.js'

    /**
     *  History command: {
     *      type : i2s(0x89),
     *      sn   : 123,
     *
     *      command : "...", // command name
     *      time    : 0,     // command timestamp
     *      extra   : info   // command parameters
     *  }
     */
    dkd.protocol.HistoryCommand = Interface(null, [Command]);
    var HistoryCommand = dkd.protocol.HistoryCommand;

    //-------- history command names begin --------
    // account
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE  = 'suicide';
    //-------- history command names end --------

    /**
     *  Group history command: {
     *      type : i2s(0x89),
     *      sn   : 123,
     *
     *      command : "reset",   // "invite", "quit", "query", ...
     *      time    : 123.456,   // command timestamp
     *
     *      group   : "{GROUP_ID}",
     *      member  : "{MEMBER_ID}",
     *      members : ["{MEMBER_ID}", ],
     *  }
     */
    dkd.protocol.GroupCommand = Interface(null, [HistoryCommand]);
    var GroupCommand = dkd.protocol.GroupCommand;

    //-------- group command names begin --------
    // founder/owner
    GroupCommand.FOUND    = 'found';
    GroupCommand.ABDICATE = 'abdicate';
    // member
    GroupCommand.INVITE   = 'invite';
    GroupCommand.EXPEL    = 'expel';  // Deprecated (use 'reset' instead)
    GroupCommand.JOIN     = 'join';
    GroupCommand.QUIT     = 'quit';
    //GroupCommand.QUERY  = 'query';  // Deprecated
    GroupCommand.RESET    = 'reset';
    // administrator/assistant
    GroupCommand.HIRE     = 'hire';
    GroupCommand.FIRE     = 'fire';
    GroupCommand.RESIGN   = 'resign';
    //-------- group command names end --------

    GroupCommand.prototype.setMember = function (identifier) {};
    GroupCommand.prototype.getMember = function () {};

    GroupCommand.prototype.setMembers = function (members) {};
    GroupCommand.prototype.getMembers = function () {};

    //
    //  Factory methods
    //

    var _command_init_members = function (content, members) {
        if (members instanceof Array) {
            content.setMembers(members);
        } else if (Interface.conforms(members, ID)) {
            content.setMember(members);
        } else {
            throw new TypeError('group members error: ' + members);
        }
        return content;
    };

    GroupCommand.create = function (cmd, group, members) {
        var content = new BaseGroupCommand(cmd, group);
        if (members) {
            _command_init_members(content, members);
        }
        return content;
    };

    GroupCommand.invite = function (group, members) {
        var content = new InviteGroupCommand(group);
        return _command_init_members(content, members);
    };
    // TODO: Deprecated (use 'reset' instead)
    GroupCommand.expel = function (group, members) {
        var content = new ExpelGroupCommand(group);
        return _command_init_members(content, members);
    };

    GroupCommand.join = function (group) {
        return new JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new QuitGroupCommand(group);
    };

    GroupCommand.reset = function (group, members) {
        var content = new ResetGroupCommand(group, members);
        if (members instanceof Array) {
            content.setMembers(members);
        } else {
            throw new TypeError('reset members error: ' + members);
        }
        return content;
    };

    // Administrators, Assistants

    var _command_init_admins = function (content, administrators, assistants) {
        if (administrators && administrators.length > 0) {
            content.setAdministrators(administrators);
        }
        if (assistants && assistants.length > 0) {
            content.setAssistants(assistants);
        }
        return content;
    };

    GroupCommand.hire = function (group, administrators, assistants) {
        var content = new HireGroupCommand(group);
        return _command_init_admins(content, administrators, assistants);
    };

    GroupCommand.fire = function (group, administrators, assistants) {
        var content = new FireGroupCommand(group);
        return _command_init_admins(content, administrators, assistants);
    };

    GroupCommand.resign = function (group) {
        return new ResignGroupCommand(group);
    };


    dkd.protocol.InviteCommand = Interface(null, [GroupCommand]);
    var InviteCommand = dkd.protocol.InviteCommand;

    // TODO: Deprecated (use 'reset' instead)
    dkd.protocol.ExpelCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = dkd.protocol.ExpelCommand;

    dkd.protocol.JoinCommand = Interface(null, [GroupCommand]);
    var JoinCommand = dkd.protocol.JoinCommand;

    dkd.protocol.QuitCommand = Interface(null, [GroupCommand]);
    var QuitCommand = dkd.protocol.QuitCommand;

    dkd.protocol.ResetCommand = Interface(null, [GroupCommand]);
    var ResetCommand = dkd.protocol.ResetCommand;

    //  Administrators, Assistants

    dkd.protocol.HireCommand = Interface(null, [GroupCommand]);
    var HireCommand = dkd.protocol.HireCommand;
    HireCommand.prototype.getAdministrators = function () {};
    HireCommand.prototype.setAdministrators = function (members) {};
    HireCommand.prototype.getAssistants = function () {};
    HireCommand.prototype.setAssistants = function (bots) {};

    dkd.protocol.FireCommand = Interface(null, [GroupCommand]);
    var FireCommand = dkd.protocol.FireCommand;
    FireCommand.prototype.getAdministrators = function () {};
    FireCommand.prototype.setAdministrators = function (members) {};
    FireCommand.prototype.getAssistants = function () {};
    FireCommand.prototype.setAssistants = function (bots) {};

    dkd.protocol.ResignCommand = Interface(null, [GroupCommand]);
    var ResignCommand = dkd.protocol.ResignCommand;
