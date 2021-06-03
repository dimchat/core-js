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
 *      command   : "document", // command name
 *      ID        : "{ID}",     // entity ID
 *      meta      : {...},      // only for handshaking with new friend
 *      profile   : {...},      // when profile is empty, means query for ID
 *      signature : "..."       // old profile's signature for querying
 *  }
 */

//! require 'meta.js'

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;

    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;

    /**
     *  Create document command
     *
     *  Usages:
     *      1. new DocumentCommand(map);
     *      2. new DocumentCommand(identifier);
     *      3. new DocumentCommand(identifier, meta);
     *      4. new DocumentCommand(identifier, meta, document);
     *      5. new DocumentCommand(identifier, signature);
     */
    var DocumentCommand = function () {
        if (arguments.length === 1) {
            if (arguments[0] instanceof ID) {
                // new DocumentCommand(identifier);
                MetaCommand.call(this, Command.PROFILE, arguments[0]);
            } else {
                // new DocumentCommand(map);
                MetaCommand.call(this, arguments[0]);
            }
            this.document = null;
        } else if (arguments.length === 2) {
            if (arguments[1] instanceof Meta) {
                // new DocumentCommand(identifier, meta);
                MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1]);
            } else if (typeof arguments[1] === 'string') {
                // new DocumentCommand(identifier, signature);
                MetaCommand.call(this, Command.PROFILE, arguments[0], null);
                this.setSignature(arguments[1]);
            } else {
                throw SyntaxError('document command arguments error: ' + arguments);
            }
            this.document = null;
        } else if (arguments.length === 3) {
            // new DocumentCommand(identifier, meta, document);
            MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1]);
            this.setDocument(arguments[2]);
        } else {
            throw SyntaxError('document command arguments error: ' + arguments);
        }
    };
    ns.Class(DocumentCommand, MetaCommand, null);

    DocumentCommand.getDocument = function (cmd) {
        var data = cmd['profile'];
        if (!data) {
            // (v1.1)
            //    "ID"       : "{ID}",
            //    "document" : {
            //        "ID"        : "{ID}",
            //        "data"      : "{JsON}",
            //        "signature" : "{BASE64}"
            //    }
            data = cmd['document'];
        } else if (typeof data === 'string') {
            // compatible with v1.0
            //    "ID"        : "{ID}",
            //    "profile"   : "{JsON}",
            //    "signature" : "{BASE64}"
            data = {
                'ID': cmd['ID'],
                'data': data,
                'signature': cmd['signature']
            }
        }
        if (data) {
            return Document.parse(data);
        } else {
            return null;
        }
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        if (doc) {
            cmd['document'] = doc.getMap();
        } else {
            delete cmd['command'];
        }
    };

    DocumentCommand.getSignature = function (cmd) {
        return cmd['signature'];
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd['signature'] = base64;
    };

    //-------- setter/getter --------

    /**
     *  Get profile
     *
     * @returns {Document}
     */
    DocumentCommand.prototype.getDocument = function () {
        if (!this.document) {
            this.document = DocumentCommand.getDocument(this.getMap());
        }
        return this.document;
    };
    /**
     *  Set Profile
     *
     * @param {Document} doc
     */
    DocumentCommand.prototype.setDocument = function (doc) {
        DocumentCommand.setDocument(doc, this.getMap());
        this.document = doc;
    };

    /**
     *  Get signature string for old profile
     *
     * @returns {String}
     */
    DocumentCommand.prototype.getSignature = function () {
        return DocumentCommand.getSignature(this.getMap());
    };
    /**
     *  Set signature string for old profile
     *
     * @param {String} base64 - encoded signature
     */
    DocumentCommand.prototype.setSignature = function (base64) {
        DocumentCommand.setSignature(base64, this.getMap());
    };

    //-------- factories --------

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @param {String} signature - OPTIONAL
     * @returns {DocumentCommand}
     */
    DocumentCommand.query = function (identifier, signature) {
        return new DocumentCommand(identifier, signature);
    };

    /**
     *  Create response command
     *
     * @param {ID} identifier
     * @param {Meta} meta - OPTIONAL
     * @param {Document} doc
     * @returns {DocumentCommand}
     */
    DocumentCommand.response = function (identifier, meta, doc) {
        return new DocumentCommand(identifier, meta, doc);
    };

    //-------- register --------
    Command.register(Command.DOCUMENT, DocumentCommand);
    Command.register(Command.PROFILE, DocumentCommand);

    //-------- namespace --------
    ns.protocol.DocumentCommand = DocumentCommand;

    ns.protocol.register('DocumentCommand');

})(DIMP);
