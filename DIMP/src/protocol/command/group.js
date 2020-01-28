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

//! require 'history.js'

!function (ns) {

    var Content = ns.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;

    /*
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
    var GroupCommand = function (info) {
        HistoryCommand.call(this, info);
    };
    GroupCommand.inherits(HistoryCommand);

    /*
     *  Member ID (or String)
     *
     */
    GroupCommand.prototype.getMember = function () {
        return this.getValue('member');
    };
    GroupCommand.prototype.setMember = function (identifier) {
        this.setValue('member', identifier);
    };

    /*
     *  Member ID (or String) list
     *
     */
    GroupCommand.prototype.getMembers= function () {
        // TODO: get from 'member'?
        return this.getValue('members');
    };
    GroupCommand.prototype.setMembers = function (identifier) {
        this.setValue('members', identifier);
        // TODO: remove 'member'?
    };

    //-------- Runtime --------

    GroupCommand.register = function (name, clazz) {
        Command.register(name, clazz);
    };

    // get subclass by command name
    GroupCommand.getClass = function (cmd) {
        return Command.getClass(cmd);
    };

    GroupCommand.getInstance = function (cmd) {
        if (!cmd) {
            return null;
        } else if (cmd instanceof GroupCommand) {
            return cmd;
        }
        // create instance by subclass (with command name)
        var clazz = GroupCommand.getClass(cmd);
        if (typeof clazz === 'function') {
            return Content.createInstance(clazz, cmd);
        }
        // custom group command
        return new GroupCommand(cmd);
    };

    //-------- namespace --------
    ns.protocol.GroupCommand = GroupCommand;

}(DIMP);

!function (ns) {

    var ID = ns.ID;

    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;

    //
    //  Invite group command
    //
    var InviteCommand = function (info) {
        if (!info) {
            GroupCommand.call(this, HistoryCommand.INVITE);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            GroupCommand.call(this, HistoryCommand.INVITE);
            this.setGroup(info);
        } else {
            GroupCommand.call(this, info);
        }
    };
    InviteCommand.inherits(GroupCommand);

    //
    //  Expel group command
    //
    var ExpelCommand = function (info) {
        if (!info) {
            GroupCommand.call(this, HistoryCommand.EXPEL);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            GroupCommand.call(this, HistoryCommand.EXPEL);
            this.setGroup(info);
        } else {
            GroupCommand.call(this, info);
        }
    };
    ExpelCommand.inherits(GroupCommand);

    //
    //  Join group command
    //
    var JoinCommand = function (info) {
        if (!info) {
            GroupCommand.call(this, HistoryCommand.JOIN);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            GroupCommand.call(this, HistoryCommand.JOIN);
            this.setGroup(info);
        } else {
            GroupCommand.call(this, info);
        }
    };
    JoinCommand.inherits(GroupCommand);

    //
    //  Quit group command
    //
    var QuitCommand = function (info) {
        if (!info) {
            GroupCommand.call(this, HistoryCommand.QUIT);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            GroupCommand.call(this, HistoryCommand.QUIT);
            this.setGroup(info);
        } else {
            GroupCommand.call(this, info);
        }
    };
    QuitCommand.inherits(GroupCommand);

    //
    //  Reset group command
    //
    var ResetCommand = function (info) {
        if (!info) {
            GroupCommand.call(this, HistoryCommand.RESET);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            GroupCommand.call(this, HistoryCommand.RESET);
            this.setGroup(info);
        } else {
            GroupCommand.call(this, info);
        }
    };
    ResetCommand.inherits(GroupCommand);

    //
    //  Query group command
    //
    /**
     *  NOTICE:
     *      This command is just for querying group info,
     *      should not be saved in history
     */
    var QueryCommand = function (info) {
        if (!info) {
            Command.call(this, HistoryCommand.QUERY);
        } else if (typeof info === 'string' || info instanceof ID) {
            // 'info' is a group ID
            Command.call(this, HistoryCommand.QUERY);
            this.setGroup(info);
        } else {
            Command.call(this, info);
        }
    };
    QueryCommand.inherits(Command);

    //-------- factories --------

    GroupCommand.invite = function (group, member) {
        var cmd = new InviteCommand(group);
        if (typeof member === 'string' || member instanceof ID) {
            cmd.setMember(member);
        } else {
            // the second argument is an array
            cmd.setMembers(member);
        }
        return cmd;
    };

    GroupCommand.expel = function (group, member) {
        var cmd = new ExpelCommand(group);
        if (typeof member === 'string' || member instanceof ID) {
            cmd.setMember(member);
        } else {
            // the second argument is an array
            cmd.setMembers(member);
        }
        return cmd;
    };

    GroupCommand.join = function (group) {
        return new JoinCommand(group);
    };

    GroupCommand.quit = function (group) {
        return new QuitCommand(group);
    };

    GroupCommand.reset = function (group, member) {
        var cmd = new ResetCommand(group);
        if (typeof member === 'string' || member instanceof ID) {
            cmd.setMember(member);
        } else {
            // the second argument is an array
            cmd.setMembers(member);
        }
        return cmd;
    };

    GroupCommand.query = function (group) {
        return new QueryCommand(group);
    };

    //-------- register --------
    GroupCommand.register(HistoryCommand.INVITE, InviteCommand);
    GroupCommand.register(HistoryCommand.EXPEL, ExpelCommand);
    GroupCommand.register(HistoryCommand.JOIN, JoinCommand);
    GroupCommand.register(HistoryCommand.QUIT, QuitCommand);

    GroupCommand.register(HistoryCommand.RESET, ResetCommand);
    Command.register(HistoryCommand.QUERY, QueryCommand);

    //-------- namespace --------
    if (typeof ns.protocol.group !== 'object') {
        ns.protocol.group = {}
    }
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;

    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;

}(DIMP);
