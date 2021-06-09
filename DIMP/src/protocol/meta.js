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

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;

    var Command = ns.protocol.Command;

    /**
     *  Create meta command
     *
     *  Usages:
     *      1. new MetaCommand(map);
     *      2. new MetaCommand(identifier);
     *      3. new MetaCommand(identifier, meta);
     *      4. new MetaCommand(command, identifier, meta);
     */
    var MetaCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                // new MetaCommand(identifier);
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0]);
            } else {
                // new MetaCommand(map);
                Command.call(this, arguments[0]);
                this.__identifier = null;
            }
            this.__meta = null;
        } else if (arguments.length === 2) {
            // new MetaCommand(identifier, meta);
            Command.call(this, Command.META);
            this.setIdentifier(arguments[0]);
            this.setMeta(arguments[1]);
        } else if (arguments.length === 3) {
            // new MetaCommand(command, identifier, meta);
            Command.call(this, arguments[0]);
            this.setIdentifier(arguments[1]);
            this.setMeta(arguments[2]);
        } else {
            throw new SyntaxError('meta command arguments error: ' + arguments);
        }
    };
    ns.Class(MetaCommand, Command, null);

    MetaCommand.getIdentifier = function (cmd) {
        return ID.parse(cmd['ID']);
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        if (identifier) {
            cmd['ID'] = identifier.toString();
        } else {
            delete cmd['ID'];
        }
    };

    MetaCommand.getMeta = function (cmd) {
        return Meta.parse(cmd['meta']);
    };
    MetaCommand.setMeta = function (meta, cmd) {
        if (meta) {
            cmd['meta'] = meta.getMap();
        } else {
            delete cmd['meta'];
        }
    }

    //-------- setter/getter --------

    /**
     *  Get entity ID for meta
     *
     * @returns {ID}
     */
    MetaCommand.prototype.getIdentifier = function () {
        if (!this.__identifier) {
            this.__identifier = MetaCommand.getIdentifier(this.getMap());
        }
        return this.__identifier;
    };
    /**
     *  Set entity ID for meta
     *
     * @param {ID} identifier
     */
    MetaCommand.prototype.setIdentifier = function (identifier) {
        MetaCommand.setIdentifier(identifier, this.getMap());
        this.__identifier = identifier;
    };

    /**
     *  Get meta
     *
     * @returns {Meta}
     */
    MetaCommand.prototype.getMeta = function () {
        if (!this.__meta) {
            this.__meta = MetaCommand.getMeta(this.getMap());
        }
        return this.__meta;
    };
    /**
     *  Set meta
     *
     * @param {Meta} meta
     */
    MetaCommand.prototype.setMeta = function (meta) {
        MetaCommand.setMeta(meta, this.getMap());
        this.__meta = meta;
    };

    //-------- factories --------

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @returns {MetaCommand}
     */
    MetaCommand.query = function (identifier) {
        return new MetaCommand(identifier);
    };
    /**
     *  Create response command
     *
     * @param {ID} identifier
     * @param {Meta} meta
     * @returns {MetaCommand}
     */
    MetaCommand.response = function (identifier, meta) {
        return new MetaCommand(identifier, meta);
    };

    //-------- namespace --------
    ns.protocol.MetaCommand = MetaCommand;

    ns.protocol.registers('MetaCommand');

})(DIMP);
