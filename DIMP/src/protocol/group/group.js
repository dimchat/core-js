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
