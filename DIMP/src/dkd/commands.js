'use strict';
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
//! require 'base.js'

    /**
     *  Create meta command
     *
     *  Usages:
     *      1. new BaseMetaCommand(map);
     *      2. new BaseMetaCommand(did);
     *      3. new BaseMetaCommand(did, command);
     */
    dkd.dkd.BaseMetaCommand = function () {
        var identifier = null;
        if (arguments.length === 2) {
            // new BaseMetaCommand(did, command);
            BaseCommand.call(this, arguments[1]);
            identifier = arguments[0];
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseMetaCommand(did);
            BaseCommand.call(this, Command.META);
            identifier = arguments[0];
        } else {
            // new BaseMetaCommand(map);
            BaseCommand.call(this, arguments[0]);
        }
        if (identifier) {
            this.setString('did', identifier);
        }
        this.__identifier = identifier;
        this.__meta = null;
    };
    var BaseMetaCommand = dkd.dkd.BaseMetaCommand;

    Class(BaseMetaCommand, BaseCommand, [MetaCommand]);

    Implementation(BaseMetaCommand, {

        // Override
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("did");
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
     *      2. new BaseDocumentCommand(did);
     */
    dkd.dkd.BaseDocumentCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            // new BaseDocumentCommand(did);
            BaseMetaCommand.call(this, info, Command.DOCUMENTS);
        } else {
            // new BaseDocumentCommand(map);
            BaseMetaCommand.call(this, info);
        }
        this.__docs = null;
    };
    var BaseDocumentCommand = dkd.dkd.BaseDocumentCommand;

    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand]);

    Implementation(BaseDocumentCommand, {

        // Override
        getDocuments: function () {
            if (this.__docs === null) {
                var docs = this.getValue('documents');
                this.__docs = Document.convert(docs);
            }
            return this.__docs;
        },
        setDocuments: function (docs) {
            if (!docs) {
                this.removeValue('documents');
            } else {
                this.setValue('documents', Document.revert(docs));
            }
            this.__docs = docs;
        },

        // Override
        getLastTime: function () {
            return this.getDateTime('last_time', null);
        },
        setLastTime: function (when) {
            this.setDateTime('last_time', when);
        }
    });
