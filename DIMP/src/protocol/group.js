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

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;

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
    var GroupCommand = function () {};
    ns.Interface(GroupCommand, [HistoryCommand]);

    //-------- group command names --------
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

    /**
     *  Set member ID
     *
     * @param {ID} identifier - member ID
     */
    GroupCommand.prototype.setMember = function (identifier) {
        console.assert(false, 'implement me!');
    };
    GroupCommand.prototype.getMember = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set member ID list
     *
     * @param {ID[]} members - ID array
     */
    GroupCommand.prototype.setMembers = function (members) {
        console.assert(false, 'implement me!');
    };
    GroupCommand.prototype.getMembers = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    GroupCommand.setMember = function (member, cmd) {
        if (member) {
            cmd['member'] = member.toString();
        } else {
            delete cmd['member'];
        }
    };
    GroupCommand.getMember = function (cmd) {
        return ID.parse(cmd['member']);
    };

    GroupCommand.setMembers = function (members, cmd) {
        if (members/* && members.length > 0*/) {
            cmd['members'] = ID.revert(members);
        } else {
            delete cmd['members'];
        }
    };
    GroupCommand.getMembers = function (cmd) {
        var members = cmd['members'];
        if (members) {
            return ID.convert(members);
        } else {
            return null;
        }
    };

    //-------- namespace --------
    ns.protocol.GroupCommand = GroupCommand;

    ns.protocol.registers('GroupCommand');

})(DIMP);
