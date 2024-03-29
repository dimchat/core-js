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

    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      cmd       : "document", // command name
     *      ID        : "{ID}",     // entity ID
     *      meta      : {...},      // only for handshaking with new friend
     *      profile   : {...},      // when profile is empty, means query for ID
     *      signature : "..."       // old profile's signature for querying
     *  }
     */
    var DocumentCommand = Interface(null, [MetaCommand]);

    /**
     *  Get document
     *
     * @return {Document}
     */
    DocumentCommand.prototype.getDocument = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Set signature string for old document
     *
     * @return {String} encoded signature
     */
    DocumentCommand.prototype.getSignature = function () {
        throw new Error('NotImplemented');
    };

    //-------- factories --------

    /**
     *  Create query command
     *
     * @param {ID} identifier
     * @param {string} signature - OPTIONAL
     * @returns {DocumentCommand}
     */
    DocumentCommand.query = function (identifier, signature) {
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, signature);
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
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, meta, doc);
    };

    //-------- namespace --------
    ns.protocol.DocumentCommand = DocumentCommand;

})(DIMP);
