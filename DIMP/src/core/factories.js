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

//!require 'protocol/forward.js'
//!require 'protocol/text.js'
//!require 'protocol/page.js'
//!require 'protocol/money.js'
//!require 'protocol/files.js'
//!require 'protocol/groups.js'
//!require 'protocol/documents.js'

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
        this.__class = clazz;
    };
    ns.Class(ContentFactory, null, [Content.Factory]);

    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };

    /**
     *  Command Factory
     *  ~~~~~~~~~~~~~~~
     */
    var CommandFactory = function (clazz) {
        this.__class = clazz;
    };
    ns.Class(CommandFactory, null, [Command.Factory]);

    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };

    /**
     *  General Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var GeneralCommandFactory = function () {
    };
    ns.Class(GeneralCommandFactory, null, [Content.Factory, Command.Factory]);

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

    GeneralCommandFactory.prototype.parseCommand = function (cmd) {
        return new Command(cmd);
    }

    /**
     *  History Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var HistoryCommandFactory = function () {
    };
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);

    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    }

    /**
     *  Group Command Factory
     *  ~~~~~~~~~~~~~~~~~~~~~~~
     */
    var GroupCommandFactory = function () {
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);

    GroupCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        // get factory by command name
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this;
        }
        return factory.parseCommand(content);
    };

    GroupCommandFactory.prototype.parseCommand = function (cmd) {
        return new GroupCommand(cmd);
    }

    /**
     *  Register core content factories
     */
    var registerContentFactories = function () {

        // Top-Secret
        Content.register(ContentType.FORWARD, new ContentFactory(ns.protocol.ForwardContent));
        // Text
        Content.register(ContentType.TEXT, new ContentFactory(ns.protocol.TextContent));

        // File
        Content.register(ContentType.FILE, new ContentFactory(ns.protocol.FileContent));
        // Image
        Content.register(ContentType.IMAGE, new ContentFactory(ns.protocol.ImageContent));
        // Audio
        Content.register(ContentType.AUDIO, new ContentFactory(ns.protocol.AudioContent));
        // Video
        Content.register(ContentType.VIDEO, new ContentFactory(ns.protocol.VideoContent));

        // Web Page
        Content.register(ContentType.PAGE, new ContentFactory(ns.protocol.PageContent));

        // Money
        Content.register(ContentType.MONEY, new ContentFactory(ns.protocol.MoneyContent));
        Content.register(ContentType.TRANSFER, new ContentFactory(ns.protocol.TransferContent));
        // ...

        // Command
        Content.register(ContentType.COMMAND, new GeneralCommandFactory());

        // History Command
        Content.register(ContentType.HISTORY, new HistoryCommandFactory());

        // unknown content type
        Content.register(0, new ContentFactory(ns.BaseContent));
    };

    /**
     *  Register core command factories
     */
    var registerCommandFactories = function () {

        // Meta Command
        Command.register(Command.META, new CommandFactory(ns.protocol.MetaCommand));

        // Document Command
        var dpu = new CommandFactory(ns.protocol.DocumentCommand);
        Command.register(Command.DOCUMENT, dpu);
        Command.register('profile', dpu);
        Command.register('visa', dpu);
        Command.register('bulletin', dpu);

        // Group Commands
        Command.register('group', new GroupCommandFactory());
        Command.register(GroupCommand.INVITE, new CommandFactory(ns.protocol.group.InviteCommand));
        Command.register(GroupCommand.EXPEL, new CommandFactory(ns.protocol.group.ExpelCommand));
        Command.register(GroupCommand.JOIN, new CommandFactory(ns.protocol.group.JoinCommand));
        Command.register(GroupCommand.QUIT, new CommandFactory(ns.protocol.group.QuitCommand));
        Command.register(GroupCommand.QUERY, new CommandFactory(ns.protocol.group.QueryCommand));
        Command.register(GroupCommand.RESET, new CommandFactory(ns.protocol.group.ResetCommand));
    };

    var registerCoreFactories = function () {
        registerContentFactories();
        registerCommandFactories();
    };

    //-------- namespace --------
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.registerAllFactories = registerCoreFactories;

    ns.core.register('ContentFactory');
    ns.core.register('CommandFactory');
    ns.core.register('GeneralCommandFactory');
    ns.core.register('HistoryCommandFactory');
    ns.core.register('GroupCommandFactory');
    ns.core.register('registerAllFactories');

})(DIMP);
