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

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
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
        var group = null;
        var member = null;
        var members = null;
        if (arguments.length === 1) {
            // new BaseGroupCommand(map);
            BaseHistoryCommand.call(this, arguments[0]);
        } else if (arguments.length === 2) {
            // new BaseGroupCommand(cmd, group);
            BaseHistoryCommand.call(this, arguments[0]);
            group = arguments[1];
        } else if (arguments[2] instanceof Array) {
            // new BaseGroupCommand(cmd, group, members);
            BaseHistoryCommand.call(this, arguments[0]);
            group = arguments[1];
            members = arguments[2];
        } else if (Interface.conforms(arguments[2], ID)) {
            // new BaseGroupCommand(cmd, group, member);
            BaseHistoryCommand.call(this, arguments[0]);
            group = arguments[1];
            member = arguments[2];
        } else {
            throw new SyntaxError('Group command arguments error: ' + arguments);
        }
        if (group) {
            this.setGroup(group);
        }
        if (member) {
            this.setMember(member);
        } else if (members) {
            this.setMembers(members);
        }
        this.__member = member;
        this.__members = members;
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {

        // Override
        setMember: function (identifier) {
            this.setString('member', identifier);
            // TODO: remove 'members'?
            this.__member = identifier;
        },

        // Override
        getMember: function () {
            if (this.__member === null) {
                var member = this.getValue('member');
                this.__member = ID.parse(member);
            }
            return this.__member;
        },

        // Override
        setMembers: function (members) {
            if (members) {
                var array = ID.revert(members);
                this.setValue('members', array);
            } else {
                this.removeValue('members');
            }
            // TODO: remove 'member'?
            this.__members = members;
        },

        // Override
        getMembers: function () {
            if (this.__members === null) {
                var array = this.getValue('members');
                if (array) {
                    this.__members = ID.convert(array);
                }
                // TODO: get from 'member'?
            }
            return this.__members;
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand;

})(DIMP);
