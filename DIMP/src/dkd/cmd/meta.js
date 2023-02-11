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

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
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
     *      4. new BaseMetaCommand(command, identifier, meta);
     */
    var BaseMetaCommand = function () {
        var identifier = null;
        var meta = null;
        if (arguments.length === 3) {
            // new BaseMetaCommand(command, identifier, meta);
            BaseCommand.call(this, arguments[0]);
            identifier = arguments[1];
            meta = arguments[2];
        } else if (arguments.length === 2) {
            // new BaseMetaCommand(identifier, meta);
            BaseCommand.call(this, Command.META);
            identifier = arguments[0];
            meta = arguments[1];
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseMetaCommand(identifier);
            BaseCommand.call(this, Command.META);
            identifier = arguments[0];
        } else {
            // new BaseMetaCommand(map);
            BaseCommand.call(this, arguments[0]);
        }
        if (identifier) {
            this.setString('ID', identifier);
        }
        if (meta) {
            this.setMap('meta', meta);
        }
        this.__identifier = identifier;
        this.__meta = meta;
    };
    Class(BaseMetaCommand, BaseCommand, [MetaCommand], {

        // Override
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("ID");
                this.__identifier = ID.parse(identifier);
            }
            return this.__identifier;
        },

        // Override
        getMeta: function () {
            if (this.__meta === null) {
                var meta = this.getValue('meta');
                this.__meta = Meta.parse(meta);
            }
            return this.__meta;
        }
    });

    //
    //  Factories
    //

    //-------- namespace --------
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;

})(DIMP);
