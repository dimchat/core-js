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

    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.BaseMetaCommand;

    /**
     *  Create document command
     *
     *  Usages:
     *      1. new BaseDocumentCommand(map);
     *      2. new BaseDocumentCommand(identifier);
     *      3. new BaseDocumentCommand(identifier, meta);
     *      4. new BaseDocumentCommand(identifier, meta, document);
     *      5. new BaseDocumentCommand(identifier, signature);
     */
    var BaseDocumentCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                // new BaseDocumentCommand(identifier);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0]);
            } else {
                // new BaseDocumentCommand(map);
                BaseMetaCommand.call(this, arguments[0]);
            }
            this.__document = null;
        } else if (arguments.length === 2) {
            if (ns.Interface.conforms(arguments[1], Meta)) {
                // new BaseDocumentCommand(identifier, meta);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], arguments[1]);
            } else if (typeof arguments[1] === 'string') {
                // new BaseDocumentCommand(identifier, signature);
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                this.setSignature(arguments[1]);
            } else {
                throw new SyntaxError('document command arguments error: ' + arguments);
            }
            this.__document = null;
        } else if (arguments.length === 3) {
            // new BaseDocumentCommand(identifier, meta, document);
            BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], arguments[1]);
            this.setDocument(arguments[2]);
        } else {
            throw new SyntaxError('document command arguments error: ' + arguments);
        }
    };
    ns.Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand]);

    // Override
    BaseDocumentCommand.prototype.setDocument = function (doc) {
        DocumentCommand.setDocument(doc, this);
        this.__document = doc;
    };

    // Override
    BaseDocumentCommand.prototype.getDocument = function () {
        if (!this.__document) {
            this.__document = DocumentCommand.getDocument(this);
        }
        return this.__document;
    };

    // Override
    BaseDocumentCommand.prototype.setSignature = function (base64) {
        DocumentCommand.setSignature(base64, this);
    };

    // Override
    BaseDocumentCommand.prototype.getSignature = function () {
        return DocumentCommand.getSignature(this);
    };

    //-------- factories --------

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @param {String} signature - OPTIONAL
     * @returns {DocumentCommand}
     */
    BaseDocumentCommand.query = function (identifier, signature) {
        return new BaseDocumentCommand(identifier, signature);
    };

    /**
     *  Create response command
     *
     * @param {ID} identifier
     * @param {Meta} meta - OPTIONAL
     * @param {Document} doc
     * @returns {DocumentCommand}
     */
    BaseDocumentCommand.response = function (identifier, meta, doc) {
        return new BaseDocumentCommand(identifier, meta, doc);
    };

    //-------- namespace --------
    ns.dkd.BaseDocumentCommand = BaseDocumentCommand;

    ns.dkd.registers('BaseDocumentCommand');

})(DIMP);
