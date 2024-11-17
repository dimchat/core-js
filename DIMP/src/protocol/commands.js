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

//! require <dkd.js>

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;

    /**
     *  Command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      command : "...", // command name
     *      extra   : info   // command parameters
     *  }
     */
    var Command = Interface(null, [Content]);

    //-------- command names begin --------
    Command.META      = 'meta';
    Command.DOCUMENT  = 'document';
    Command.RECEIPT   = 'receipt';
    //-------- command names end --------

    /**
     *  Command name
     *
     * @returns {String}
     */
    Command.prototype.getCmd = function () {};

    //
    //  Factory method
    //

    var general_factory = function () {
        var man = ns.dkd.cmd.CommandFactoryManager;
        return man.generalFactory;
    };

    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command);
    };

    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory);
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd);
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = Interface(null, null);

    /**
     *  Parse map object to command
     *
     * @param {*} content - command content
     * @return {Command}
     */
    CommandFactory.prototype.parseCommand = function (content) {};

    Command.Factory = CommandFactory;

    //-------- namespace --------
    ns.protocol.Command = Command;
    // ns.protocol.CommandFactory = CommandFactory;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;

    /**
     *  Meta command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      command : "meta", // command name
     *      ID      : "{ID}", // contact's ID
     *      meta    : {...}   // when meta is empty, means query meta for ID
     *  }
     */
    var MetaCommand = Interface(null, [Command]);

    MetaCommand.prototype.getIdentifier = function () {};
    MetaCommand.prototype.getMeta = function () {};

    //
    //  factory method
    //

    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier);
    };

    MetaCommand.response = function (identifier, meta) {
        var command = new ns.dkd.cmd.BaseMetaCommand(identifier);
        command.setMeta(meta);
        return command;
    };

    /**
     *  Document command message: {
     *      type : 0x88,
     *      sn   : 123,
     *
     *      command   : "document", // command name
     *      ID        : "{ID}",     // entity ID
     *      meta      : {...},      // only for handshaking with new friend
     *      document  : {...},      // when document is empty, means query for ID
     *      last_time : 12345       // old document time for querying
     *  }
     */
    var DocumentCommand = Interface(null, [MetaCommand]);

    DocumentCommand.prototype.getDocument = function () {};
    DocumentCommand.prototype.getLastTime = function () {};

    //
    //  factory method
    //

    DocumentCommand.query = function (identifier, lastTime) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        if (lastTime) {
            command.setLastTime(lastTime);
        }
        return command;
    };

    DocumentCommand.response = function (identifier, meta, doc) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        command.setMeta(meta);
        command.setDocument(doc);
        return command;
    };

    //-------- namespace --------
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.DocumentCommand = DocumentCommand;

})(DIMP);
