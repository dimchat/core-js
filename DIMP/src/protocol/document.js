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

//! require 'meta.js'

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;

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
    var DocumentCommand = function () {};
    ns.Interface(DocumentCommand, [MetaCommand]);

    /**
     *  Set document info
     *
     * @param {Document} doc
     */
    DocumentCommand.prototype.setDocument = function (doc) {
        ns.assert(false, 'implement me!');
    };
    DocumentCommand.prototype.getDocument = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        if (doc) {
            cmd['document'] = doc.toMap();
        } else {
            delete cmd['command'];
        }
    };
    DocumentCommand.getDocument = function (cmd) {
        var doc = cmd['document'];
        return Document.parse(doc);
    };

    /**
     *  Set signature string for old document
     *
     * @param {String} base64 - encoded signature
     */
    DocumentCommand.prototype.setSignature = function (base64) {
        ns.assert(false, 'implement me!');
    };
    DocumentCommand.prototype.getSignature = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd['signature'] = base64;
    };
    DocumentCommand.getSignature = function (cmd) {
        return cmd['signature'];
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

    //-------- namespace --------
    ns.protocol.DocumentCommand = DocumentCommand;

    ns.protocol.registers('DocumentCommand');

})(DIMP);
