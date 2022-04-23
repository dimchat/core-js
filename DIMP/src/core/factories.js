;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2021 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2021 Albert Moky
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

//!require 'dkd/command.js'
//!require 'dkd/document.js'
//!require 'dkd/file.js'
//!require 'dkd/files.js'
//!require 'dkd/forward.js'
//!require 'dkd/group.js'
//!require 'dkd/groups.js'
//!require 'dkd/history.js'
//!require 'dkd/meta.js'
//!require 'dkd/money.js'
//!require 'dkd/page.js'
//!require 'dkd/text.js'

(function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;

    /**
     *  Content Factory
     *  ~~~~~~~~~~~~~~~
     */
    var ContentFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(ContentFactory, Object, [Content.Factory]);

    // Override
    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(CommandFactory, Object, [Command.Factory]);

    // Override
    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };

    /**
     *  General Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var GeneralCommandFactory = function () {
        Object.call(this);
    };
    ns.Class(GeneralCommandFactory, Object, [Content.Factory, Command.Factory]);

    // Override
    GeneralCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        // get factory by command name
        var factory = Command.getFactory(command);
        if (!factory) {
            // check for group command
            if (Content.getGroup(content)) {
                factory = Command.getFactory('group');
            }
            if (!factory) {
                factory = this;
            }
        }
        return factory.parseCommand(content);
    };

    // Override
    GeneralCommandFactory.prototype.parseCommand = function (cmd) {
        return new Command(cmd);
    }

    /**
     *  History Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var HistoryCommandFactory = function () {
        GeneralCommandFactory.call(this);
    };
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);

    // Override
    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    }

    /**
     *  Group Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var GroupCommandFactory = function () {
        HistoryCommandFactory.call(this);
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);

    // Override
    GroupCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        // get factory by command name
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this;
        }
        return factory.parseCommand(content);
    };

    // Override
    GroupCommandFactory.prototype.parseCommand = function (cmd) {
        return new GroupCommand(cmd);
    }

    /**
     *  Register core content factories
     */
    var registerContentFactories = function () {

        // Top-Secret
        Content.setFactory(ContentType.FORWARD, new ContentFactory(ns.dkd.SecretContent));
        // Text
        Content.setFactory(ContentType.TEXT, new ContentFactory(ns.dkd.BaseTextContent));

        // File
        Content.setFactory(ContentType.FILE, new ContentFactory(ns.dkd.BaseFileContent));
        // Image
        Content.setFactory(ContentType.IMAGE, new ContentFactory(ns.dkd.ImageFileContent));
        // Audio
        Content.setFactory(ContentType.AUDIO, new ContentFactory(ns.dkd.AudioFileContent));
        // Video
        Content.setFactory(ContentType.VIDEO, new ContentFactory(ns.dkd.VideoFileContent));

        // Web Page
        Content.setFactory(ContentType.PAGE, new ContentFactory(ns.dkd.WebPageContent));

        // Money
        Content.setFactory(ContentType.MONEY, new ContentFactory(ns.dkd.BaseMoneyContent));
        Content.setFactory(ContentType.TRANSFER, new ContentFactory(ns.dkd.TransferMoneyContent));
        // ...

        // Command
        Content.setFactory(ContentType.COMMAND, new GeneralCommandFactory());

        // History Command
        Content.setFactory(ContentType.HISTORY, new HistoryCommandFactory());

        // unknown content type
        Content.setFactory(0, new ContentFactory(ns.dkd.BaseContent));
    };

    /**
     *  Register core command factories
     */
    var registerCommandFactories = function () {

        // Meta Command
        Command.setFactory(Command.META, new CommandFactory(ns.dkd.BaseMetaCommand));

        // Document Command
        Command.setFactory(Command.DOCUMENT, new CommandFactory(ns.dkd.BaseDocumentCommand));

        // Group Commands
        Command.setFactory('group', new GroupCommandFactory());
        Command.setFactory(GroupCommand.INVITE, new CommandFactory(ns.dkd.InviteGroupCommand));
        Command.setFactory(GroupCommand.EXPEL, new CommandFactory(ns.dkd.ExpelGroupCommand));
        Command.setFactory(GroupCommand.JOIN, new CommandFactory(ns.dkd.JoinGroupCommand));
        Command.setFactory(GroupCommand.QUIT, new CommandFactory(ns.dkd.QuitGroupCommand));
        Command.setFactory(GroupCommand.QUERY, new CommandFactory(ns.dkd.QueryGroupCommand));
        Command.setFactory(GroupCommand.RESET, new CommandFactory(ns.dkd.ResetGroupCommand));
    };

    //-------- namespace --------
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.registerContentFactories = registerContentFactories;
    ns.core.registerCommandFactories = registerCommandFactories;

    ns.core.registers('ContentFactory');
    ns.core.registers('CommandFactory');
    ns.core.registers('GeneralCommandFactory');
    ns.core.registers('HistoryCommandFactory');
    ns.core.registers('GroupCommandFactory');
    ns.core.registers('registerContentFactories');
    ns.core.registers('registerCommandFactories');

})(DIMP);
