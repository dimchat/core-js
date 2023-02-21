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
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      cmd     : "meta", // command name
     *      ID      : "{ID}", // contact's ID
     *      meta    : {...}   // when meta is empty, means query meta for ID
     *  }
     */
    var MetaCommand = Interface(null, [Command]);

    /**
     *  Get entity ID for meta
     *
     * @return {ID} identifier
     */
    MetaCommand.prototype.getIdentifier = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get meta info
     *
     * @return {Meta} meta
     */
    MetaCommand.prototype.getMeta = function () {
        throw new Error('NotImplemented');
    };

    //-------- factories --------

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @returns {MetaCommand}
     */
    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier);
    };
    /**
     *  Create response command
     *
     * @param {ID} identifier
     * @param {Meta} meta
     * @returns {MetaCommand}
     */
    MetaCommand.response = function (identifier, meta) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier, meta);
    };

    //-------- namespace --------
    ns.protocol.MetaCommand = MetaCommand;

})(DIMP);
