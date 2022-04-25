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

//! require 'protocol/meta.js'
//! require 'command.js'

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var BaseCommand = ns.dkd.BaseCommand;

    /**
     *  Create meta command
     *
     *  Usages:
     *      1. new BaseMetaCommand(map);
     *      2. new BaseMetaCommand(identifier);
     *      3. new BaseMetaCommand(identifier, meta);
     *      4. new BaseMetaCommand(command, identifier);
     *      5. new BaseMetaCommand(command, identifier, meta);
     */
    var BaseMetaCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                // new BaseMetaCommand(identifier);
                BaseCommand.call(this, Command.META);
                this.setIdentifier(arguments[0]);
            } else {
                // new BaseMetaCommand(map);
                BaseCommand.call(this, arguments[0]);
                this.__identifier = null;
            }
            this.__meta = null;
        } else if (arguments.length === 2) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                // new BaseMetaCommand(identifier, meta);
                BaseCommand.call(this, Command.META);
                this.setIdentifier(arguments[0]);
                this.setMeta(arguments[1]);
            } else {
                // new BaseMetaCommand(command, identifier);
                BaseCommand.call(this, arguments[0]);
                this.setIdentifier(arguments[1]);
                this.__meta = null;
            }
        } else if (arguments.length === 3) {
            // new BaseMetaCommand(command, identifier, meta);
            BaseCommand.call(this, arguments[0]);
            this.setIdentifier(arguments[1]);
            this.setMeta(arguments[2]);
        } else {
            throw new SyntaxError('meta command arguments error: ' + arguments);
        }
    };
    ns.Class(BaseMetaCommand, BaseCommand, [MetaCommand]);

    // Override
    BaseMetaCommand.prototype.setIdentifier = function (identifier) {
        var dict = this.toMap();
        MetaCommand.setIdentifier(identifier, dict);
        this.__identifier = identifier;
    };

    // Override
    BaseMetaCommand.prototype.getIdentifier = function () {
        if (!this.__identifier) {
            var dict = this.toMap();
            this.__identifier = MetaCommand.getIdentifier(dict);
        }
        return this.__identifier;
    };

    // Override
    BaseMetaCommand.prototype.setMeta = function (meta) {
        var dict = this.toMap();
        MetaCommand.setMeta(meta, dict);
        this.__meta = meta;
    };

    // Override
    BaseMetaCommand.prototype.getMeta = function () {
        if (!this.__meta) {
            var dict = this.toMap();
            this.__meta = MetaCommand.getMeta(dict);
        }
        return this.__meta;
    };

    //
    //  Factories
    //

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @returns {MetaCommand}
     */
    MetaCommand.query = function (identifier) {
        return new BaseMetaCommand(identifier);
    };
    /**
     *  Create response command
     *
     * @param {ID} identifier
     * @param {Meta} meta
     * @returns {MetaCommand}
     */
    MetaCommand.response = function (identifier, meta) {
        return new BaseMetaCommand(identifier, meta);
    };

    //-------- namespace --------
    ns.dkd.BaseMetaCommand = BaseMetaCommand;

    ns.dkd.registers('BaseMetaCommand');

})(DIMP);
