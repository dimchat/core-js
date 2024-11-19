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

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var ID      = ns.protocol.ID;
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
    var HistoryCommand = Interface(null, [Command]);

    //-------- history command names begin --------
    // account
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE  = 'suicide';
    //-------- history command names end --------

    /**
     *  Group history command: {
     *      type : 0x89,
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
    var GroupCommand = Interface(null, [HistoryCommand]);

    //-------- group command names begin --------
    // founder/owner
    GroupCommand.FOUND    = 'found';
    GroupCommand.ABDICATE = 'abdicate';
    // member
    GroupCommand.INVITE   = 'invite';
    GroupCommand.EXPEL    = 'expel';
    GroupCommand.JOIN     = 'join';
    GroupCommand.QUIT     = 'quit';
    GroupCommand.QUERY    = 'query';
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
    //  Factories
    //

    GroupCommand.create = function (cmd, group, members) {
        var command = new ns.dkd.cmd.BaseGroupCommand(cmd, group);
        if (!members) {
            // join, query, quit
        } else if (members instanceof Array) {
            command.setMembers(members);
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members);
        } else {
            throw new TypeError('group members error: ' + members);
        }
        return command;
    };

    GroupCommand.invite = function (group, members) {
        var command = new ns.dkd.cmd.InviteGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members);
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members);
        } else {
            throw new TypeError('invite members error: ' + members);
        }
        return command;
    };
    // TODO: Deprecated (use 'reset' instead)
    GroupCommand.expel = function (group, members) {
        var command = new ns.dkd.cmd.ExpelGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members);
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members);
        } else {
            throw new TypeError('expel members error: ' + members);
        }
        return command;
    };

    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group);
    };

    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group);
    };
    GroupCommand.reset = function (group, members) {
        var command = new ns.dkd.cmd.ResetGroupCommand(group, members);
        if (members instanceof Array) {
            command.setMembers(members);
        } else {
            throw new TypeError('reset members error: ' + members);
        }
        return command;
    };

    // Administrators, Assistants

    var get_targets = function (info, batch, single) {
        var users = info[batch];
        if (users) {
            return ID.convert(users);
        }
        var usr = ID.parse(info[single]);
        if (usr) {
            return [usr];
        } else {
            return [];
        }
    };

    GroupCommand.hire = function (group, targets) {
        var command = new ns.dkd.cmd.HireGroupCommand(group);
        // hire administrators
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins);
        }
        // hire assistants
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots);
        }
        return command;
    };

    GroupCommand.fire = function (group, targets) {
        var command = new ns.dkd.cmd.FireGroupCommand(group);
        // hire administrators
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins);
        }
        // hire assistants
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots);
        }
        return command;
    };

    GroupCommand.resign = function (group) {
        return new ns.dkd.cmd.ResignGroupCommand(group);
    };

    //-------- namespace --------
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.GroupCommand = GroupCommand;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var GroupCommand = ns.protocol.GroupCommand;

    var InviteCommand = Interface(null, [GroupCommand]);
    // TODO: Deprecated (use 'reset' instead)
    var ExpelCommand = Interface(null, [GroupCommand]);

    var JoinCommand = Interface(null, [GroupCommand]);
    var QuitCommand = Interface(null, [GroupCommand]);

    var ResetCommand = Interface(null, [GroupCommand]);
    /**
     *  NOTICE:
     *      This command is just for querying group info,
     *      should not be saved in group history
     */
    var QueryCommand = Interface(null, [GroupCommand]);

    //  Administrators, Assistants

    var HireCommand = Interface(null, [GroupCommand]);
    HireCommand.prototype.getAdministrators = function () {};
    HireCommand.prototype.setAdministrators = function (members) {};
    HireCommand.prototype.getAssistants = function () {};
    HireCommand.prototype.setAssistants = function (bots) {};

    var FireCommand = Interface(null, [GroupCommand]);
    FireCommand.prototype.getAdministrators = function () {};
    FireCommand.prototype.setAdministrators = function (members) {};
    FireCommand.prototype.getAssistants = function () {};
    FireCommand.prototype.setAssistants = function (bots) {};

    var ResignCommand = Interface(null, [GroupCommand]);

    //-------- namespace --------
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;

    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;

    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;

    ns.protocol.group.HireCommand = HireCommand;
    ns.protocol.group.FireCommand = FireCommand;
    ns.protocol.group.ResignCommand = ResignCommand;

})(DIMP);
