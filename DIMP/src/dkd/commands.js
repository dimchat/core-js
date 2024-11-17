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

//! require 'protocol/commands.js'

(function (ns) {
    'use strict';

    var Class   = ns.type.Class;
    var IObject = ns.type.Object;

    var ContentType = ns.protocol.ContentType;
    var Command     = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create command
     *
     *  Usages:
     *      1. new BaseCommand(map);
     *      2. new BaseCommand(cmd);
     *      3. new BaseCommand(type, cmd);
     */
    var BaseCommand = function () {
        if (arguments.length === 2) {
            // new BaseCommand(type, cmd);
            BaseContent.call(this, arguments[0]);
            this.setValue('cmd', arguments[1]);
        } else if (IObject.isString(arguments[0])) {
            // new BaseCommand(cmd);
            BaseContent.call(this, ContentType.COMMAND);
            this.setValue('cmd', arguments[0]);
        } else {
            // new BaseCommand(map);
            BaseContent.call(this, arguments[0]);
        }
    };
    Class(BaseCommand, BaseContent, [Command], {

        // Override
        getCmd: function () {
            var gf = ns.dkd.CommandFactoryManager.generalFactory;
            return gf.getCmd(this.toMap(), '');
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseCommand = BaseCommand;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class     = ns.type.Class;

    var ID              = ns.protocol.ID;
    var Meta            = ns.protocol.Meta;
    var Document        = ns.protocol.Document;
    var Command         = ns.protocol.Command;
    var MetaCommand     = ns.protocol.MetaCommand;
    var DocumentCommand = ns.protocol.DocumentCommand;

    var BaseCommand = ns.dkd.cmd.BaseCommand;

    /**
     *  Create meta command
     *
     *  Usages:
     *      1. new BaseMetaCommand(map);
     *      2. new BaseMetaCommand(identifier);
     *      3. new BaseMetaCommand(identifier, command);
     */
    var BaseMetaCommand = function () {
        var identifier = null;
        if (arguments.length === 2) {
            // new BaseMetaCommand(identifier, command);
            BaseCommand.call(this, arguments[1]);
            identifier = arguments[0];
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
        this.__identifier = identifier;
        this.__meta = null;
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
        },
        setMeta: function (meta) {
            this.setMap('meta', meta);
            this.__meta = meta;
        }
    });

    /**
     *  Create document command
     *
     *  Usages:
     *      1. new BaseDocumentCommand(map);
     *      2. new BaseDocumentCommand(identifier);
     */
    var BaseDocumentCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new BaseDocumentCommand(identifier);
            BaseMetaCommand.call(this, info, Command.DOCUMENT);
        } else {
            // new BaseDocumentCommand(map);
            BaseMetaCommand.call(this, info);
        }
        this.__document = null;
    };
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {

        // Override
        getDocument: function () {
            if (this.__document === null) {
                var doc = this.getValue('document');
                this.__document = Document.parse(doc);
            }
            return this.__document;
        },
        setDocument: function (doc) {
            this.setMap('document', doc);
            this.__document = doc;
        },

        // Override
        getLastTime: function () {
            return this.getDateTime('last_time', null);
        },
        setLastTime: function (when) {
            this.setDateTime('last_time', when);
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand;

})(DIMP);
