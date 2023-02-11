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

//! require 'protocol/document.js'
//! require 'meta.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.cmd.BaseMetaCommand;

    /**
     *  Create document command
     *
     *  Usages:
     *      1. new BaseDocumentCommand(map);
     *      2. new BaseDocumentCommand(identifier);             // query
     *      3. new BaseDocumentCommand(identifier, signature);  // query
     *      4. new BaseDocumentCommand(identifier, document);
     *      5. new BaseDocumentCommand(identifier, meta, document);
     */
    var BaseDocumentCommand = function () {
        var doc = null;
        var sig = null;
        if (arguments.length === 1) {
            if (Interface.conforms(arguments[0], ID)) {
                // new BaseDocumentCommand(identifier);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
            } else {
                // new BaseDocumentCommand(map);
                BaseMetaCommand.call(this, arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (Interface.conforms(arguments[1], Document)) {
                // new BaseDocumentCommand(identifier, document);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                doc = arguments[1];
            } else if (typeof arguments[1] === 'string') {
                // new BaseDocumentCommand(identifier, signature);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                sig = arguments[1];
            } else {
                throw new SyntaxError('document command arguments error: ' + arguments);
            }
        } else if (arguments.length === 3) {
            // new BaseDocumentCommand(identifier, meta, document);
            BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], arguments[1]);
            doc = arguments[2];
        } else {
            throw new SyntaxError('document command arguments error: ' + arguments);
        }
        if (doc) {
            this.setMap('document', doc);
        }
        if (sig) {
            this.setValue('signature', sig);
        }
        this.__document = doc;
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

        // Override
        getSignature: function () {
            return this.getString('signature');
        }
    });

    //-------- namespace --------
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand;

})(DIMP);
