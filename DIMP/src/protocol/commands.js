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

//! require 'base.js'

    /**
     *  Meta command message: {
     *      type : i2s(0x88),
     *      sn   : 123,
     *
     *      command : "meta", // command name
     *      did     : "{ID}", // contact's ID
     *      meta    : {...}   // when meta is empty, means query meta for ID
     *  }
     */
    dkd.protocol.MetaCommand = Interface(null, [Command]);
    var MetaCommand = dkd.protocol.MetaCommand;

    MetaCommand.prototype.getIdentifier = function () {};
    MetaCommand.prototype.getMeta = function () {};

    //
    //  Factory methods
    //

    MetaCommand.query = function (identifier) {
        return new BaseMetaCommand(identifier);
    };

    MetaCommand.response = function (identifier, meta) {
        var command = new BaseMetaCommand(identifier);
        command.setMeta(meta);
        return command;
    };


    /**
     *  Document command message: {
     *      type : i2s(0x88),
     *      sn   : 123,
     *
     *      command   : "documents", // command name
     *      did       : "{ID}",      // entity ID
     *      meta      : {...},       // only for handshaking with new friend
     *      documents : [...],       // when this is null, means to query
     *      last_time : 12345        // old document time for querying
     *  }
     */
    dkd.protocol.DocumentCommand = Interface(null, [MetaCommand]);
    var DocumentCommand = dkd.protocol.DocumentCommand;

    // Entity documents
    DocumentCommand.prototype.getDocuments = function () {};
    // Last document time for querying
    DocumentCommand.prototype.getLastTime = function () {};

    //
    //  Factory methods
    //

    DocumentCommand.query = function (identifier, lastTime) {
        var command = new BaseDocumentCommand(identifier);
        if (lastTime) {
            command.setLastTime(lastTime);
        }
        return command;
    };

    DocumentCommand.response = function (identifier, meta, docs) {
        var command = new BaseDocumentCommand(identifier);
        command.setMeta(meta);
        command.setDocuments(docs);
        return command;
    };
