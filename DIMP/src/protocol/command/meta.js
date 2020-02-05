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
 *  Command message: {
 *      type : 0x88,
 *      sn   : 123,
 *
 *      command : "meta", // command name
 *      ID      : "{ID}", // contact's ID
 *      meta    : {...}   // when meta is empty, means query meta for ID
 *  }
 */

//! require 'command.js'

!function (ns) {
    'use strict';

    var ID = ns.ID;
    var Meta = ns.Meta;

    var Command = ns.protocol.Command;

    /**
     *  Create meta command
     *
     * @param info - command info; or entity ID
     * @constructor
     */
    var MetaCommand = function (info) {
        var identifier = null;
        if (!info) {
            // create empty meta command
            info = Command.META;
        } else if (info instanceof ID) {
            // create query meta command with entity ID
            identifier = info;
            info = Command.META;
        }
        Command.call(this, info);
        if (identifier) {
            this.setIdentifier(identifier);
        }
        // lazy
        this.meta = null;
    };
    MetaCommand.inherits(Command);

    //-------- setter/getter --------

    MetaCommand.prototype.getIdentifier = function () {
        return this.getValue('ID');
    };
    MetaCommand.prototype.setIdentifier = function (identifier) {
        this.setValue('ID', identifier);
    };

    MetaCommand.prototype.getMeta = function () {
        if (!this.meta) {
            var dict = this.getValue('meta');
            this.meta = Meta.getInstance(dict);
        }
        return this.meta;
    };
    MetaCommand.prototype.setMeta = function (meta) {
        this.setValue('meta', meta);
        this.meta = meta;
    };

    //-------- factories --------

    MetaCommand.query = function (identifier) {
        return new MetaCommand(identifier);
    };

    MetaCommand.response = function (identifier, meta) {
        var cmd = new MetaCommand(identifier);
        cmd.setMeta(meta);
        return cmd;
    };

    //-------- register --------
    Command.register(Command.META, MetaCommand);

    //-------- namespace --------
    ns.protocol.MetaCommand = MetaCommand;

}(DIMP);
