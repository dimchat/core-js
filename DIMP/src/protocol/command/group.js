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

//! require 'history.js'

!function (ns) {
    'use strict';

    var ID = ns.ID;

    var Content = ns.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;

    /**
     *  Create group command
     *
     * @param info - command info; or group ID
     * @constructor
     */
    var GroupCommand = function (info) {
        var group = null;
        if (info instanceof ID) {
            // create new group command with group ID
            group = info;
            info = null;
        }
        HistoryCommand.call(this, info);
        if (group) {
            this.setGroup(info);
        }
    };
    GroupCommand.inherits(HistoryCommand);

    /**
     *  Group ID (or string)
     *
     * @returns {ID|string}
     */
    GroupCommand.prototype.getGroup = function () {
        return Content.prototype.getGroup.call(this);
    };
    GroupCommand.prototype.setGroup = function (identifier) {
        Content.prototype.setGroup.call(this, identifier);
    };

    /**
     *  Member ID (or String)
     *
     * @returns {ID|string}
     */
    GroupCommand.prototype.getMember = function () {
        return this.getValue('member');
    };
    GroupCommand.prototype.setMember = function (identifier) {
        this.setValue('member', identifier);
    };

    /**
     *  Member ID (or String) list
     *
     * @returns {String[]}
     */
    GroupCommand.prototype.getMembers= function () {
        // TODO: get from 'member'?
        return this.getValue('members');
    };
    GroupCommand.prototype.setMembers = function (identifier) {
        this.setValue('members', identifier);
        // TODO: remove 'member'?
    };

    //-------- command names --------
    // group: founder/owner
    GroupCommand.FOUND    = HistoryCommand.FOUND;
    GroupCommand.ABDICATE = HistoryCommand.ABDICATE;
    // group: member
    GroupCommand.INVITE   = HistoryCommand.INVITE;
    GroupCommand.EXPEL    = HistoryCommand.EXPEL;
    GroupCommand.JOIN     = HistoryCommand.JOIN;
    GroupCommand.QUIT     = HistoryCommand.QUIT;
    GroupCommand.QUERY    = HistoryCommand.QUERY;
    GroupCommand.RESET    = HistoryCommand.RESET;
    // group: administrator/assistant
    GroupCommand.HIRE     = HistoryCommand.HIRE;
    GroupCommand.FIRE     = HistoryCommand.FIRE;
    GroupCommand.RESIGN   = HistoryCommand.RESIGN;

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
    'use strict';

    var ID = ns.ID;

    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;

    //
    //  Invite group command
    //
    var InviteCommand = function (info) {
        var group = null;
        if (!info) {
            // create empty invite command
            info = GroupCommand.INVITE;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new invite command with group ID
            group = info;
            info = GroupCommand.INVITE;
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group);
        }
    };
    InviteCommand.inherits(GroupCommand);

    //
    //  Expel group command
    //
    var ExpelCommand = function (info) {
        var group = null;
        if (!info) {
            // create empty expel command
            info = GroupCommand.EXPEL;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new expel command with group ID
            group = info;
            info = GroupCommand.EXPEL;
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group);
        }
    };
    ExpelCommand.inherits(GroupCommand);

    //
    //  Join group command
    //
    var JoinCommand = function (info) {
        var group = null;
        if (!info) {
            // create empty join command
            info = GroupCommand.JOIN;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new join command with group ID
            group = info;
            info = GroupCommand.JOIN;
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group);
        }
    };
    JoinCommand.inherits(GroupCommand);

    //
    //  Quit group command
    //
    var QuitCommand = function (info) {
        var group = null;
        if (!info) {
            // create empty quit command
            info = GroupCommand.QUIT;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new quit command with group ID
            group = info;
            info = GroupCommand.QUIT;
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group);
        }
    };
    QuitCommand.inherits(GroupCommand);

    //
    //  Reset group command
    //
    var ResetCommand = function (info) {
        var group = null;
        if (!info) {
            // create empty reset command
            info = GroupCommand.RESET;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new reset command with group ID
            group = info;
            info = GroupCommand.RESET;
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group);
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
        var group = null;
        if (!info) {
            // create empty query command
            info = GroupCommand.QUERY;
        } else if (typeof info === 'string' || info instanceof ID) {
            // create new query command with group ID
            group = info;
            info = GroupCommand.QUERY;
        }
        Command.call(this, info);
        if (group) {
            this.setGroup(group);
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
    GroupCommand.register(GroupCommand.INVITE, InviteCommand);
    GroupCommand.register(GroupCommand.EXPEL, ExpelCommand);
    GroupCommand.register(GroupCommand.JOIN, JoinCommand);
    GroupCommand.register(GroupCommand.QUIT, QuitCommand);

    GroupCommand.register(GroupCommand.RESET, ResetCommand);
    GroupCommand.register(GroupCommand.QUERY, QueryCommand);

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
