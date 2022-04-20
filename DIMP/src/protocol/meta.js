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

    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      command : "meta", // command name
     *      ID      : "{ID}", // contact's ID
     *      meta    : {...}   // when meta is empty, means query meta for ID
     *  }
     */
    var MetaCommand = function () {};
    ns.Interface(MetaCommand, [Command]);

    /**
     *  Set entity ID for meta
     *
     * @param {ID} identifier
     */
    MetaCommand.prototype.setIdentifier = function (identifier) {
        console.assert(false, 'implement me!');
    };
    MetaCommand.prototype.getIdentifier = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (identifier) {
            cmd['ID'] = identifier.toString();
        } else {
            delete cmd['ID'];
        }
    };
    MetaCommand.getIdentifier = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return ID.parse(cmd['ID']);
    };

    /**
     *  Set meta info
     *
     * @param {Meta} meta
     */
    MetaCommand.prototype.setMeta = function (meta) {
        console.assert(false, 'implement me!');
    };
    MetaCommand.prototype.getMeta = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    MetaCommand.setMeta = function (meta, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (meta) {
            cmd['meta'] = Wrapper.fetchMap(meta);
        } else {
            delete cmd['meta'];
        }
    };
    MetaCommand.getMeta = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return Meta.parse(cmd['meta']);
    };

    //-------- namespace --------
    ns.protocol.MetaCommand = MetaCommand;

    ns.protocol.registers('MetaCommand');

})(DIMP);
