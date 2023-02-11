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

    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;

    /**
     *  Group history command: {
     *      type : 0x89,
     *      sn   : 123,
     *
     *      cmd     : "invite",      // expel, ...
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

    /**
     *  Set member ID
     *
     * @param {ID} identifier - member ID
     */
    GroupCommand.prototype.setMember = function (identifier) {
        throw new Error('NotImplemented');
    };
    GroupCommand.prototype.getMember = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Set member ID list
     *
     * @param {ID[]} members - ID array
     */
    GroupCommand.prototype.setMembers = function (members) {
        throw new Error('NotImplemented');
    };
    GroupCommand.prototype.getMembers = function () {
        throw new Error('NotImplemented');
    };

    //-------- factories --------

    /**
     *  Create invite group command
     *
     * @param {ID} group
     * @param {ID|ID[]} members
     * @return {InviteCommand}
     */
    GroupCommand.invite = function (group, members) {
        return new ns.dkd.cmd.InviteGroupCommand(group, members);
    };

    /**
     *  Create expel group command
     *
     * @param {ID} group
     * @param {ID|ID[]} members
     * @return {ExpelCommand}
     */
    GroupCommand.expel = function (group, members) {
        return new ns.dkd.cmd.ExpelGroupCommand(group, members);
    };

    /**
     *  Create join group command
     *
     * @param {ID} group
     * @return {JoinCommand}
     */
    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group);
    };

    /**
     *  Create quit group command
     *
     * @param {ID} group
     * @return {QuitCommand}
     */
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group);
    };

    /**
     *  Create reset group command
     *
     * @param {ID} group
     * @param {ID[]} members
     * @return {ResetCommand}
     */
    GroupCommand.reset = function (group, members) {
        return new ns.dkd.cmd.ResetGroupCommand(group, members);
    };

    /**
     *  Create query group command
     *
     * @param {ID} group
     * @return {QueryCommand}
     */
    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group);
    };

    //-------- namespace --------
    ns.protocol.GroupCommand = GroupCommand;

})(DIMP);
