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

//! require 'protocol/group.js'
//! require 'history.js'

(function (ns) {
    'use strict';

    var GroupCommand = ns.protocol.GroupCommand;
    var BaseHistoryCommand = ns.dkd.BaseHistoryCommand;

    /**
     *  Create group command
     *
     *  Usages:
     *      1. new BaseGroupCommand(map);
     *      2. new BaseGroupCommand(cmd, group);
     *      3. new BaseGroupCommand(cmd, group, members);
     *      4. new BaseGroupCommand(cmd, group, member);
     */
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            // new BaseGroupCommand(map);
            BaseHistoryCommand.call(this, arguments[0]);
            this.__member = null;
            this.__members = null;
        } else if (arguments.length === 2) {
            // new BaseGroupCommand(cmd, group);
            BaseHistoryCommand.call(this, arguments[0]);
            this.setGroup(arguments[1]);
            this.__member = null;
            this.__members = null;
        } else if (arguments[2] instanceof Array) {
            // new BaseGroupCommand(cmd, group, members);
            BaseHistoryCommand.call(this, arguments[0]);
            this.setGroup(arguments[1]);
            this.__member = null;
            this.setMembers(arguments[2]);
        } else {
            // new BaseGroupCommand(cmd, group, member);
            BaseHistoryCommand.call(this, arguments[0]);
            this.setGroup(arguments[1]);
            this.setMember(arguments[2]);
            this.__members = null;
        }
    };
    ns.Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand]);

    // Override
    BaseGroupCommand.prototype.setMember = function (identifier) {
        var dict = this.toMap();
        GroupCommand.setMembers(null, dict);
        GroupCommand.setMember(identifier, dict);
        this.__member = identifier;
    };

    // Override
    BaseGroupCommand.prototype.getMember = function () {
        if (!this.__member) {
            var dict = this.toMap();
            this.__member = GroupCommand.getMember(dict);
        }
        return this.__member;
    };

    // Override
    BaseGroupCommand.prototype.setMembers = function (members) {
        var dict = this.toMap();
        GroupCommand.setMember(null, dict);
        GroupCommand.setMembers(members, dict);
        this.__members = members;
    };

    // Override
    BaseGroupCommand.prototype.getMembers = function () {
        if (!this.__members) {
            var dict = this.toMap();
            this.__members = GroupCommand.getMembers(dict);
            // TODO: get from 'member'?
        }
        return this.__members;
    };

    //-------- namespace --------
    ns.dkd.BaseGroupCommand = BaseGroupCommand;

    ns.dkd.registers('BaseGroupCommand');

})(DIMP);
