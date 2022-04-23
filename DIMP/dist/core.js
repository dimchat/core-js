/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.2.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Apr. 23, 2022
 * @copyright (c) 2022 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = new MingKeMing.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.core !== "object") {
        ns.core = new ns.Namespace();
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = new ns.Namespace();
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = new ns.Namespace();
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = new ns.Namespace();
    }
    ns.registers("core");
    ns.registers("dkd");
    ns.registers("mkm");
    ns.registers("protocol");
    ns.protocol.registers("group");
})(DIMP, DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Content = ns.protocol.Content;
    var ForwardContent = function () {};
    ns.Interface(ForwardContent, [Content]);
    ForwardContent.prototype.setMessage = function (secret) {
        console.assert(false, "implement me!");
    };
    ForwardContent.prototype.getMessage = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ForwardContent.getMessage = function (content) {
        content = Wrapper.fetchMap(content);
        var secret = content["forward"];
        return ReliableMessage.parse(secret);
    };
    ForwardContent.setMessage = function (secret, content) {
        content = Wrapper.fetchMap(content);
        if (secret) {
            content["forward"] = Wrapper.fetchMap(secret);
        } else {
            delete content["forward"];
        }
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.registers("ForwardContent");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var FileContent = function () {};
    ns.Interface(FileContent, [Content]);
    FileContent.prototype.setURL = function (url) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getURL = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setURL = function (url, content) {
        content = Wrapper.fetchMap(content);
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    FileContent.getURL = function (content) {
        content = Wrapper.fetchMap(content);
        return content["URL"];
    };
    FileContent.prototype.setFilename = function (filename) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getFilename = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setFilename = function (filename, content) {
        content = Wrapper.fetchMap(content);
        if (filename) {
            content["filename"] = filename;
        } else {
            delete content["filename"];
        }
    };
    FileContent.getFilename = function (content) {
        content = Wrapper.fetchMap(content);
        return content["filename"];
    };
    FileContent.prototype.setData = function (data) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getData = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setData = function (data, content) {
        content = Wrapper.fetchMap(content);
        if (data) {
            content["data"] = ns.format.Base64.encode(data);
        } else {
            delete content["data"];
        }
    };
    FileContent.getData = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["data"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    FileContent.prototype.setPassword = function (key) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getPassword = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setPassword = function (key, content) {
        content = Wrapper.fetchMap(content);
        if (key) {
            content["password"] = Wrapper.fetchMap(key);
        } else {
            delete content["password"];
        }
    };
    FileContent.getPassword = function (content) {
        content = Wrapper.fetchMap(content);
        var key = content["password"];
        return SymmetricKey.parse(key);
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.registers("FileContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function () {};
    ns.Interface(ImageContent, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        console.assert(false, "implement me!");
    };
    ImageContent.prototype.getThumbnail = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ImageContent.setThumbnail = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["thumbnail"] = ns.format.Base64.encode(image);
        } else {
            delete content["thumbnail"];
        }
    };
    ImageContent.getThumbnail = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["thumbnail"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    var VideoContent = function () {};
    ns.Interface(VideoContent, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        console.assert(false, "implement me!");
    };
    VideoContent.prototype.getSnapshot = function () {
        console.assert(false, "implement me!");
        return null;
    };
    VideoContent.setSnapshot = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["snapshot"] = ns.format.Base64.encode(image);
        } else {
            delete content["snapshot"];
        }
    };
    VideoContent.getSnapshot = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["snapshot"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    var AudioContent = function () {};
    ns.Interface(AudioContent, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        console.assert(false, "implement me!");
    };
    AudioContent.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.registers("ImageContent");
    ns.protocol.registers("VideoContent");
    ns.protocol.registers("AudioContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var TextContent = function () {};
    ns.Interface(TextContent, [Content]);
    TextContent.prototype.setText = function (text) {
        console.assert(false, "implement me!");
    };
    TextContent.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.registers("TextContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var PageContent = function () {};
    ns.Interface(PageContent, [Content]);
    PageContent.prototype.setURL = function (url) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getURL = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getURL = function (content) {
        content = Wrapper.fetchMap(content);
        return content["URL"];
    };
    PageContent.setURL = function (url, content) {
        content = Wrapper.fetchMap(content);
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    PageContent.prototype.setTitle = function (title) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getTitle = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getTitle = function (content) {
        content = Wrapper.fetchMap(content);
        return content["title"];
    };
    PageContent.setTitle = function (title, content) {
        content = Wrapper.fetchMap(content);
        if (title) {
            content["title"] = title;
        } else {
            delete content["title"];
        }
    };
    PageContent.prototype.setDesc = function (text) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getDesc = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getDesc = function (content) {
        content = Wrapper.fetchMap(content);
        return content["desc"];
    };
    PageContent.setDesc = function (text, content) {
        content = Wrapper.fetchMap(content);
        if (text) {
            content["desc"] = text;
        } else {
            delete content["desc"];
        }
    };
    PageContent.prototype.setIcon = function (image) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getIcon = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.setIcon = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["icon"] = ns.format.Base64.encode(image);
        } else {
            delete content["icon"];
        }
    };
    PageContent.getIcon = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["icon"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.registers("PageContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var MoneyContent = function () {};
    ns.Interface(MoneyContent, [Content]);
    MoneyContent.prototype.setCurrency = function (currency) {
        console.assert(false, "implement me!");
    };
    MoneyContent.prototype.getCurrency = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setCurrency = function (currency, content) {
        content = Wrapper.fetchMap(content);
        content["currency"] = currency;
    };
    MoneyContent.getCurrency = function (content) {
        content = Wrapper.fetchMap(content);
        return content["currency"];
    };
    MoneyContent.prototype.setAmount = function (amount) {
        console.assert(false, "implement me!");
    };
    MoneyContent.prototype.getAmount = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setAmount = function (amount, content) {
        content = Wrapper.fetchMap(content);
        content["amount"] = amount;
    };
    MoneyContent.getAmount = function (content) {
        content = Wrapper.fetchMap(content);
        return content["amount"];
    };
    var TransferContent = function () {};
    ns.Interface(TransferContent, [MoneyContent]);
    TransferContent.prototype.setComment = function (text) {
        console.assert(false, "implement me!");
    };
    TransferContent.prototype.getComment = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.registers("MoneyContent");
    ns.protocol.registers("TransferContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var Command = function () {};
    ns.Interface(Command, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    Command.prototype.getCommand = function () {
        console.assert(false, "implement me!");
        return "";
    };
    Command.getCommand = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["command"];
    };
    var CommandFactory = function () {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        console.assert(false, "implement me!");
        return null;
    };
    Command.Factory = CommandFactory;
    var s_command_factories = {};
    Command.setFactory = function (name, factory) {
        s_command_factories[name] = factory;
    };
    Command.getFactory = function (name) {
        return s_command_factories[name];
    };
    ns.protocol.Command = Command;
    ns.protocol.registers("Command");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function () {};
    ns.Interface(MetaCommand, [Command]);
    MetaCommand.prototype.setIdentifier = function (identifier) {
        console.assert(false, "implement me!");
    };
    MetaCommand.prototype.getIdentifier = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (identifier) {
            cmd["ID"] = identifier.toString();
        } else {
            delete cmd["ID"];
        }
    };
    MetaCommand.getIdentifier = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return ID.parse(cmd["ID"]);
    };
    MetaCommand.prototype.setMeta = function (meta) {
        console.assert(false, "implement me!");
    };
    MetaCommand.prototype.getMeta = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setMeta = function (meta, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (meta) {
            cmd["meta"] = Wrapper.fetchMap(meta);
        } else {
            delete cmd["meta"];
        }
    };
    MetaCommand.getMeta = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return Meta.parse(cmd["meta"]);
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.registers("MetaCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function () {};
    ns.Interface(DocumentCommand, [MetaCommand]);
    DocumentCommand.prototype.setDocument = function (doc) {
        console.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getDocument = function () {
        console.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (doc) {
            cmd["document"] = Wrapper.fetchMap(doc);
        } else {
            delete cmd["command"];
        }
    };
    DocumentCommand.getDocument = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        var doc = cmd["document"];
        return Document.parse(doc);
    };
    DocumentCommand.prototype.setSignature = function (base64) {
        console.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getSignature = function () {
        console.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        cmd["signature"] = base64;
    };
    DocumentCommand.getSignature = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["signature"];
    };
    DocumentCommand.query = function (identifier, signature) {
        return new DocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        return new DocumentCommand(identifier, meta, doc);
    };
    ns.protocol.DocumentCommand = DocumentCommand;
    ns.protocol.registers("DocumentCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Command = ns.protocol.Command;
    var HistoryCommand = function () {};
    ns.Interface(HistoryCommand, [Command]);
    HistoryCommand.prototype.getHistoryEvent = function () {
        console.assert(false, "implement me!");
        return null;
    };
    HistoryCommand.getHistoryEvent = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["event"];
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.registers("HistoryCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function () {};
    ns.Interface(GroupCommand, [HistoryCommand]);
    GroupCommand.FOUND = "found";
    GroupCommand.ABDICATE = "abdicate";
    GroupCommand.INVITE = "invite";
    GroupCommand.EXPEL = "expel";
    GroupCommand.JOIN = "join";
    GroupCommand.QUIT = "quit";
    GroupCommand.QUERY = "query";
    GroupCommand.RESET = "reset";
    GroupCommand.HIRE = "hire";
    GroupCommand.FIRE = "fire";
    GroupCommand.RESIGN = "resign";
    GroupCommand.prototype.setMember = function (identifier) {
        console.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMember = function () {
        console.assert(false, "implement me!");
        return null;
    };
    GroupCommand.prototype.setMembers = function (members) {
        console.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    GroupCommand.setMember = function (member, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (member) {
            cmd["member"] = member.toString();
        } else {
            delete cmd["member"];
        }
    };
    GroupCommand.getMember = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return ID.parse(cmd["member"]);
    };
    GroupCommand.setMembers = function (members, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (members) {
            cmd["members"] = ID.revert(members);
        } else {
            delete cmd["members"];
        }
    };
    GroupCommand.getMembers = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        var members = cmd["members"];
        if (members) {
            return ID.convert(members);
        } else {
            return null;
        }
    };
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.registers("GroupCommand");
})(DIMP);
(function (ns) {
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function () {};
    ns.Interface(InviteCommand, [GroupCommand]);
    InviteCommand.prototype.getInviteMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var ExpelCommand = function () {};
    ns.Interface(ExpelCommand, [GroupCommand]);
    ExpelCommand.prototype.getExpelMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var JoinCommand = function () {};
    ns.Interface(JoinCommand, [GroupCommand]);
    JoinCommand.prototype.getAsk = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var QuitCommand = function () {};
    ns.Interface(QuitCommand, [GroupCommand]);
    QuitCommand.prototype.getBye = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var ResetCommand = function () {};
    ns.Interface(ResetCommand, [GroupCommand]);
    ResetCommand.prototype.getAllMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var QueryCommand = function () {};
    ns.Interface(QueryCommand, [GroupCommand]);
    QueryCommand.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.registers("InviteCommand");
    ns.protocol.group.registers("ExpelCommand");
    ns.protocol.group.registers("JoinCommand");
    ns.protocol.group.registers("QuitCommand");
    ns.protocol.group.registers("ResetCommand");
    ns.protocol.group.registers("QueryCommand");
})(DIMP);
(function (ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;
    var SecretContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FORWARD);
            this.__forward = null;
        } else {
            if (ns.Interface.conforms(arguments[0], ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                this.setMessage(arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
                this.__forward = null;
            }
        }
    };
    ns.Class(SecretContent, BaseContent, [ForwardContent]);
    SecretContent.prototype.getMessage = function () {
        if (!this.__forward) {
            this.__forward = ForwardContent.getMessage(this);
        }
        return this.__forward;
    };
    SecretContent.prototype.setMessage = function (secret) {
        ForwardContent.setMessage(secret, this);
        this.__forward = secret;
    };
    ns.dkd.SecretContent = SecretContent;
    ns.dkd.registers("SecretContent");
})(DaoKeDao);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FILE);
            this.__data = null;
        } else {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0]);
                this.__data = null;
            } else {
                if (arguments.length === 2) {
                    BaseContent.call(this, ContentType.FILE);
                    this.setFilename(arguments[0]);
                    this.setData(arguments[1]);
                } else {
                    if (arguments.length === 3) {
                        BaseContent.call(this, arguments[0]);
                        this.setFilename(arguments[1]);
                        this.setData(arguments[2]);
                    } else {
                        throw new SyntaxError("file content arguments error: " + arguments);
                    }
                }
            }
        }
        this.__password = null;
    };
    ns.Class(BaseFileContent, BaseContent, [FileContent]);
    BaseFileContent.prototype.setURL = function (url) {
        FileContent.setURL(url, this);
    };
    BaseFileContent.prototype.getURL = function () {
        return FileContent.getURL(this);
    };
    BaseFileContent.prototype.setFilename = function (filename) {
        FileContent.setFilename(filename, this);
    };
    BaseFileContent.prototype.getFilename = function () {
        return FileContent.getFilename(this);
    };
    BaseFileContent.prototype.setData = function (data) {
        FileContent.setData(data, this);
        this.__data = data;
    };
    BaseFileContent.prototype.getData = function () {
        if (!this.__data) {
            this.__data = FileContent.getData(this);
        }
        return this.__data;
    };
    BaseFileContent.prototype.setPassword = function (key) {
        FileContent.setPassword(key, this);
        this.__password = key;
    };
    BaseFileContent.prototype.getPassword = function () {
        if (!this.__password) {
            this.__password = FileContent.getPassword(this);
        }
        return this.__password;
    };
    ns.dkd.BaseFileContent = BaseFileContent;
    ns.dkd.registers("BaseFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.IMAGE);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.IMAGE,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("image content arguments error: " + arguments);
                }
            }
        }
        this.__thumbnail = null;
    };
    ns.Class(ImageFileContent, BaseFileContent, [ImageContent]);
    ImageFileContent.prototype.getThumbnail = function () {
        if (!this.__thumbnail) {
            this.__thumbnail = ImageContent.getThumbnail(this);
        }
        return this.__thumbnail;
    };
    ImageFileContent.prototype.setThumbnail = function (image) {
        ImageContent.setThumbnail(image, this);
        this.__thumbnail = image;
    };
    var VideoFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.VIDEO);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.VIDEO,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("video content arguments error: " + arguments);
                }
            }
        }
        this.__snapshot = null;
    };
    ns.Class(VideoFileContent, BaseFileContent, [VideoContent]);
    VideoFileContent.prototype.getSnapshot = function () {
        if (!this.__snapshot) {
            this.__snapshot = VideoContent.getSnapshot(this);
        }
        return this.__snapshot;
    };
    VideoFileContent.prototype.setSnapshot = function (image) {
        VideoContent.setSnapshot(image, this);
        this.__snapshot = image;
    };
    var AudioFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.AUDIO);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.AUDIO,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("audio content arguments error: " + arguments);
                }
            }
        }
    };
    ns.Class(AudioFileContent, BaseFileContent, [AudioContent]);
    AudioFileContent.prototype.getText = function () {
        return this.getValue("text");
    };
    AudioFileContent.prototype.setText = function (asr) {
        this.setValue("text", asr);
    };
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;
    ns.dkd.registers("ImageFileContent");
    ns.dkd.registers("VideoFileContent");
    ns.dkd.registers("AudioFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.TEXT);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.TEXT);
                this.setText(arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseTextContent, BaseContent, [TextContent]);
    BaseTextContent.prototype.getText = function () {
        return this.getValue("text");
    };
    BaseTextContent.prototype.setText = function (text) {
        this.setValue("text", text);
    };
    ns.dkd.BaseTextContent = BaseTextContent;
    ns.dkd.registers("BaseTextContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var PageContent = ns.protocol.PageContent;
    var BaseContent = ns.dkd.BaseContent;
    var WebPageContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
            this.__icon = null;
        } else {
            if (arguments.length === 4) {
                BaseContent.call(this, ContentType.PAGE);
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3]);
            } else {
                throw new SyntaxError("web page content arguments error: " + arguments);
            }
        }
    };
    ns.Class(WebPageContent, BaseContent, [PageContent]);
    WebPageContent.prototype.getURL = function () {
        return PageContent.getURL(this);
    };
    WebPageContent.prototype.setURL = function (url) {
        PageContent.setURL(url, this);
    };
    WebPageContent.prototype.getTitle = function () {
        return PageContent.getTitle(this);
    };
    WebPageContent.prototype.setTitle = function (title) {
        PageContent.setTitle(title, this);
    };
    WebPageContent.prototype.getDesc = function () {
        return PageContent.getDesc(this);
    };
    WebPageContent.prototype.setDesc = function (text) {
        PageContent.setDesc(text, this);
    };
    WebPageContent.prototype.getIcon = function () {
        if (!this.__icon) {
            this.__icon = PageContent.getIcon(this);
        }
        return this.__icon;
    };
    WebPageContent.prototype.setIcon = function (image) {
        PageContent.setIcon(image, this);
        this.__icon = image;
    };
    ns.dkd.WebPageContent = WebPageContent;
    ns.dkd.registers("WebPageContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1]);
            } else {
                if (typeof arguments[0] === "string") {
                    BaseContent.call(ContentType.MONEY);
                    this.setCurrency(arguments[0]);
                } else {
                    BaseContent.call(arguments[0]);
                }
            }
        }
    };
    ns.Class(BaseMoneyContent, BaseContent, [MoneyContent]);
    BaseMoneyContent.prototype.setCurrency = function (currency) {
        MoneyContent.setCurrency(currency, this);
    };
    BaseMoneyContent.prototype.getCurrency = function () {
        return MoneyContent.getCurrency(this);
    };
    BaseMoneyContent.prototype.setAmount = function (amount) {
        MoneyContent.setAmount(amount, this);
    };
    BaseMoneyContent.prototype.getAmount = function () {
        return MoneyContent.getAmount(this);
    };
    var TransferMoneyContent = function () {
        if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], 0);
            } else {
                MoneyContent.call(arguments[0]);
            }
        }
    };
    ns.Class(TransferMoneyContent, BaseMoneyContent, [TransferContent]);
    TransferMoneyContent.prototype.getText = function () {
        return this.getValue("text");
    };
    TransferMoneyContent.prototype.setText = function (text) {
        this.setValue("text", text);
    };
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent;
    ns.dkd.registers("BaseMoneyContent");
    ns.dkd.registers("TransferMoneyContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue("command", arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setValue("command", arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseCommand, BaseContent, [Command]);
    BaseCommand.prototype.getCommand = function () {
        return Command.getCommand(this);
    };
    ns.dkd.BaseCommand = BaseCommand;
    ns.dkd.registers("BaseCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseMetaCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseCommand.call(this, Command.META);
                this.setIdentifier(arguments[0]);
            } else {
                BaseCommand.call(this, arguments[0]);
                this.__identifier = null;
            }
            this.__meta = null;
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[0], ID)) {
                    BaseCommand.call(this, Command.META);
                    this.setIdentifier(arguments[0]);
                    this.setMeta(arguments[1]);
                } else {
                    BaseCommand.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.__meta = null;
                }
            } else {
                if (arguments.length === 3) {
                    BaseCommand.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.setMeta(arguments[2]);
                } else {
                    throw new SyntaxError("meta command arguments error: " + arguments);
                }
            }
        }
    };
    ns.Class(BaseMetaCommand, BaseCommand, [MetaCommand]);
    BaseMetaCommand.prototype.setIdentifier = function (identifier) {
        MetaCommand.setIdentifier(identifier, this);
        this.__identifier = identifier;
    };
    BaseMetaCommand.prototype.getIdentifier = function () {
        if (!this.__identifier) {
            this.__identifier = MetaCommand.getIdentifier(this);
        }
        return this.__identifier;
    };
    BaseMetaCommand.prototype.setMeta = function (meta) {
        MetaCommand.setMeta(meta, this);
        this.__meta = meta;
    };
    BaseMetaCommand.prototype.getMeta = function () {
        if (!this.__meta) {
            this.__meta = MetaCommand.getMeta(this);
        }
        return this.__meta;
    };
    MetaCommand.query = function (identifier) {
        return new BaseMetaCommand(identifier);
    };
    MetaCommand.response = function (identifier, meta) {
        return new BaseMetaCommand(identifier, meta);
    };
    ns.dkd.BaseMetaCommand = BaseMetaCommand;
    ns.dkd.registers("BaseMetaCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.BaseMetaCommand;
    var BaseDocumentCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0]);
            } else {
                BaseMetaCommand.call(this, arguments[0]);
            }
            this.__document = null;
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[1], Meta)) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    if (typeof arguments[1] === "string") {
                        BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                        this.setSignature(arguments[1]);
                    } else {
                        throw new SyntaxError(
                            "document command arguments error: " + arguments
                        );
                    }
                }
                this.__document = null;
            } else {
                if (arguments.length === 3) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                    this.setDocument(arguments[2]);
                } else {
                    throw new SyntaxError(
                        "document command arguments error: " + arguments
                    );
                }
            }
        }
    };
    ns.Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand]);
    BaseDocumentCommand.prototype.setDocument = function (doc) {
        DocumentCommand.setDocument(doc, this);
        this.__document = doc;
    };
    BaseDocumentCommand.prototype.getDocument = function () {
        if (!this.__document) {
            this.__document = DocumentCommand.getDocument(this);
        }
        return this.__document;
    };
    BaseDocumentCommand.prototype.setSignature = function (base64) {
        DocumentCommand.setSignature(base64, this);
    };
    BaseDocumentCommand.prototype.getSignature = function () {
        return DocumentCommand.getSignature(this);
    };
    BaseDocumentCommand.query = function (identifier, signature) {
        return new BaseDocumentCommand(identifier, signature);
    };
    BaseDocumentCommand.response = function (identifier, meta, doc) {
        return new BaseDocumentCommand(identifier, meta, doc);
    };
    ns.dkd.BaseDocumentCommand = BaseDocumentCommand;
    ns.dkd.registers("BaseDocumentCommand");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[0], arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseCommand.call(this, ContentType.HISTORY, arguments[0]);
            } else {
                BaseCommand.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseHistoryCommand, BaseCommand, [HistoryCommand]);
    BaseHistoryCommand.prototype.getHistoryEvent = function () {
        return HistoryCommand.getHistoryEvent(this);
    };
    ns.dkd.BaseHistoryCommand = BaseHistoryCommand;
    ns.dkd.registers("BaseHistoryCommand");
})(DIMP);
(function (ns) {
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseHistoryCommand = ns.dkd.BaseHistoryCommand;
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0]);
            this.__member = null;
            this.__members = null;
        } else {
            if (arguments.length === 2) {
                BaseHistoryCommand.call(this, arguments[0]);
                this.setGroup(arguments[1]);
                this.__member = null;
                this.__members = null;
            } else {
                if (arguments[2] instanceof Array) {
                    BaseHistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.__member = null;
                    this.setMembers(arguments[2]);
                } else {
                    BaseHistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.setMember(arguments[2]);
                    this.__members = null;
                }
            }
        }
    };
    ns.Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand]);
    BaseGroupCommand.prototype.setMember = function (identifier) {
        GroupCommand.setMembers(null, this);
        GroupCommand.setMember(identifier, this);
        this.__member = identifier;
    };
    BaseGroupCommand.prototype.getMember = function () {
        if (!this.__member) {
            this.__member = GroupCommand.getMember(this);
        }
        return this.__member;
    };
    BaseGroupCommand.prototype.setMembers = function (members) {
        GroupCommand.setMember(null, this);
        GroupCommand.setMembers(members, this);
        this.__members = members;
    };
    BaseGroupCommand.prototype.getMembers = function () {
        if (!this.__members) {
            this.__members = GroupCommand.getMembers(this);
        }
        return this.__members;
    };
    ns.dkd.BaseGroupCommand = BaseGroupCommand;
    ns.dkd.registers("BaseGroupCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var BaseGroupCommand = ns.dkd.BaseGroupCommand;
    var InviteGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.INVITE,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand]);
    InviteGroupCommand.prototype.getInviteMembers = function () {
        return this.getMembers();
    };
    var ExpelGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.EXPEL,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand]);
    ExpelGroupCommand.prototype.getExpelMembers = function () {
        return this.getMembers();
    };
    var JoinGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand]);
    JoinGroupCommand.prototype.getAsk = function () {
        return this.getValue("text");
    };
    var QuitGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand]);
    QuitGroupCommand.prototype.getBye = function () {
        return this.getValue("text");
    };
    var ResetGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.RESET,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand]);
    ResetGroupCommand.prototype.getAllMembers = function () {
        return this.getMembers();
    };
    var QueryGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand]);
    QueryGroupCommand.prototype.getText = function () {
        return this.getValue("text");
    };
    GroupCommand.invite = function (group, members) {
        return new InviteGroupCommand(group, members);
    };
    GroupCommand.expel = function (group, members) {
        return new ExpelGroupCommand(group, members);
    };
    GroupCommand.join = function (group) {
        return new JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new QuitGroupCommand(group);
    };
    GroupCommand.reset = function (group, members) {
        return new ResetGroupCommand(group, members);
    };
    GroupCommand.query = function (group) {
        return new QueryGroupCommand(group);
    };
    ns.dkd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.QueryGroupCommand = QueryGroupCommand;
    ns.dkd.registers("InviteGroupCommand");
    ns.dkd.registers("ExpelGroupCommand");
    ns.dkd.registers("JoinGroupCommand");
    ns.dkd.registers("QuitGroupCommand");
    ns.dkd.registers("ResetGroupCommand");
    ns.dkd.registers("QueryGroupCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Entity = function () {};
    ns.Interface(Entity, [ns.type.Object]);
    Entity.prototype.getIdentifier = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getType = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Entity.prototype.getMeta = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getDocument = function (type) {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.setDataSource = function (barrack) {
        console.assert(false, "implement me!");
    };
    Entity.prototype.getDataSource = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var EntityDataSource = function () {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        console.assert(false, "implement me!");
        return null;
    };
    var EntityDelegate = function () {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
    ns.mkm.registers("Entity");
})(DIMP);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__datasource = null;
    };
    ns.Class(BaseEntity, BaseObject, [Entity]);
    BaseEntity.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else {
            if (ns.Interface.conforms(other, Entity)) {
                other = other.getIdentifier();
            }
        }
        return this.__identifier.equals(other);
    };
    BaseEntity.prototype.valueOf = function () {
        return desc.call(this);
    };
    BaseEntity.prototype.toString = function () {
        return desc.call(this);
    };
    var desc = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return (
            "<" +
            clazz.name +
            "|" +
            this.__identifier.getType() +
            " " +
            this.__identifier +
            ">"
        );
    };
    BaseEntity.prototype.setDataSource = function (delegate) {
        this.__datasource = delegate;
    };
    BaseEntity.prototype.getDataSource = function () {
        return this.__datasource;
    };
    BaseEntity.prototype.getIdentifier = function () {
        return this.__identifier;
    };
    BaseEntity.prototype.getType = function () {
        return this.__identifier.getType();
    };
    BaseEntity.prototype.getMeta = function () {
        return this.__datasource.getMeta(this.__identifier);
    };
    BaseEntity.prototype.getDocument = function (type) {
        return this.__datasource.getDocument(this.__identifier, type);
    };
    ns.mkm.BaseEntity = BaseEntity;
    ns.mkm.registers("BaseEntity");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var User = function () {};
    ns.Interface(User, [Entity]);
    User.prototype.getVisa = function () {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.getContacts = function () {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.verify = function (data, signature) {
        console.assert(false, "implement me!");
        return false;
    };
    User.prototype.encrypt = function (plaintext) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.sign = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.decrypt = function (ciphertext) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.signVisa = function (visa) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.verifyVisa = function (visa) {
        console.assert(false, "implement me!");
        return null;
    };
    var UserDataSource = function () {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
        return null;
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (
        identifier
    ) {
        return null;
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User;
    ns.mkm.registers("User");
})(DIMP);
(function (ns) {
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier);
    };
    ns.Class(BaseUser, BaseEntity, [User]);
    BaseUser.prototype.getVisa = function () {
        var doc = this.getDocument(Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            return doc;
        } else {
            return null;
        }
    };
    BaseUser.prototype.getContacts = function () {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        return barrack.getContacts(uid);
    };
    BaseUser.prototype.verify = function (data, signature) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var keys = barrack.getPublicKeysForVerification(uid);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get verify keys for user: " + uid);
        }
        for (var i = 0; i < keys.length; ++i) {
            if (keys[i].verify(data, signature)) {
                return true;
            }
        }
        return false;
    };
    BaseUser.prototype.encrypt = function (plaintext) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var key = barrack.getPublicKeyForEncryption(uid);
        if (!key) {
            throw new Error("failed to get encrypt key for user: " + uid);
        }
        return key.encrypt(plaintext);
    };
    BaseUser.prototype.sign = function (data) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var key = barrack.getPrivateKeyForSignature(uid);
        if (!key) {
            throw new Error("failed to get sign key for user: " + uid);
        }
        return key.sign(data);
    };
    BaseUser.prototype.decrypt = function (ciphertext) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var keys = barrack.getPrivateKeysForDecryption(uid);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get decrypt keys for user: " + uid);
        }
        var plaintext;
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    return plaintext;
                }
            } catch (e) {
                console.log("User::decrypt() error", this, e, keys[i], ciphertext);
            }
        }
        return null;
    };
    BaseUser.prototype.signVisa = function (visa) {
        var uid = this.getIdentifier();
        if (!uid.equals(visa.getIdentifier())) {
            return null;
        }
        var barrack = this.getDataSource();
        var key = barrack.getPrivateKeyForVisaSignature(uid);
        if (!key) {
            throw new Error("failed to get sign key for user: " + uid);
        }
        visa.sign(key);
        return visa;
    };
    BaseUser.prototype.verifyVisa = function (visa) {
        var uid = this.getIdentifier();
        if (!uid.equals(visa.getIdentifier())) {
            return null;
        }
        var meta = this.getMeta();
        var key = meta.getKey();
        if (!key) {
            throw new Error("failed to get meta key for user: " + uid);
        }
        return visa.verify(key);
    };
    ns.mkm.BaseUser = BaseUser;
    ns.mkm.registers("BaseUser");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var Group = function () {};
    ns.Interface(Group, [Entity]);
    Group.prototype.getBulletin = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getFounder = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getOwner = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getAssistants = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var GroupDataSource = function () {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group;
    ns.mkm.registers("Group");
})(DIMP);
(function (ns) {
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    ns.Class(BaseGroup, BaseEntity, [Group]);
    BaseGroup.prototype.getBulletin = function () {
        var doc = this.getDocument(Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            return doc;
        } else {
            return null;
        }
    };
    BaseGroup.prototype.getFounder = function () {
        if (!this.__founder) {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            this.__founder = barrack.getFounder(gid);
        }
        return this.__founder;
    };
    BaseGroup.prototype.getOwner = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getOwner(gid);
    };
    BaseGroup.prototype.getMembers = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getMembers(gid);
    };
    BaseGroup.prototype.getAssistants = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getAssistants(gid);
    };
    ns.mkm.BaseGroup = BaseGroup;
    ns.mkm.registers("BaseGroup");
})(DIMP);
(function (ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var ID = ns.protocol.ID;
    var NetworkType = ns.protocol.NetworkType;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.mkm.Entity;
    var User = ns.mkm.User;
    var Group = ns.mkm.Group;
    var Barrack = function () {
        Object.call(this);
    };
    ns.Class(Barrack, Object, [
        Entity.Delegate,
        User.DataSource,
        Group.DataSource
    ]);
    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            if (doc.isValid()) {
                return doc.getKey();
            }
        }
        return null;
    };
    var meta_key = function (user) {
        var meta = this.getMeta(user);
        if (meta) {
            return meta.getKey();
        }
        return null;
    };
    Barrack.prototype.getPublicKeyForEncryption = function (identifier) {
        var key = visa_key.call(this, identifier);
        if (key) {
            return key;
        }
        key = meta_key.call(this, identifier);
        if (ns.Interface.conforms(key, EncryptKey)) {
            return key;
        }
        return null;
    };
    Barrack.prototype.getPublicKeysForVerification = function (identifier) {
        var keys = [];
        var key = visa_key.call(this, identifier);
        if (ns.Interface.conforms(key, VerifyKey)) {
            keys.push(key);
        }
        key = meta_key.call(this, identifier);
        if (key) {
            keys.push(key);
        }
        return keys;
    };
    var group_seed = function (gid) {
        var seed = gid.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === "everyone")) {
                seed = null;
            }
        }
        return seed;
    };
    Barrack.prototype.getBroadcastFounder = function (group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".founder@anywhere");
        } else {
            return ID.FOUNDER;
        }
    };
    Barrack.prototype.getBroadcastOwner = function (group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".owner@anywhere");
        } else {
            return ID.ANYONE;
        }
    };
    Barrack.prototype.getBroadcastMembers = function (group) {
        var members = [];
        var seed = group_seed(group);
        if (seed) {
            var owner = ID.parse(seed + ".owner@anywhere");
            var member = ID.parse(seed + ".member@anywhere");
            members.push(owner);
            members.push(member);
        } else {
            members.push(ID.ANYONE);
        }
        return members;
    };
    Barrack.prototype.getFounder = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastFounder(group);
        }
        var gMeta = this.getMeta(group);
        if (!gMeta) {
            return null;
        }
        var members = this.getMembers(group);
        if (members) {
            var item, mMeta;
            for (var i = 0; i < members.length; ++i) {
                item = members[i];
                mMeta = this.getMeta(item);
                if (!mMeta) {
                    continue;
                }
                if (Meta.matches(gMeta, mMeta.getKey())) {
                    return item;
                }
            }
        }
        return null;
    };
    Barrack.prototype.getOwner = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastOwner(group);
        }
        if (NetworkType.POLYLOGUE.equals(group.getType())) {
            return this.getFounder(group);
        }
        return null;
    };
    Barrack.prototype.getMembers = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastMembers(group);
        }
        return null;
    };
    Barrack.prototype.getAssistants = function (group) {
        var doc = this.getDocument(group, Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            if (doc.isValid()) {
                return doc.getAssistants();
            }
        }
        return null;
    };
    ns.core.Barrack = Barrack;
    ns.core.registers("Barrack");
})(DIMP);
(function (ns) {
    var Packer = function () {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function (content) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.signMessage = function (sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.deserializeMessage = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.core.Packer = Packer;
    ns.core.registers("Packer");
})(DIMP);
(function (ns) {
    var Processor = function () {};
    ns.Interface(Processor, null);
    Processor.prototype.processPackage = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processContent = function (content, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.core.Processor = Processor;
    ns.core.registers("Processor");
})(DIMP);
(function (ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = function () {
        Object.call(this);
    };
    ns.Class(Transceiver, Object, [
        InstantMessage.Delegate,
        ReliableMessage.Delegate
    ]);
    Transceiver.prototype.getEntityDelegate = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var is_broadcast = function (msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver();
        }
        return receiver.isBroadcast();
    };
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        var dict = content.toMap();
        var json = ns.format.JSON.encode(dict);
        return ns.format.UTF8.encode(json);
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast(iMsg)) {
            return ns.format.UTF8.decode(data);
        }
        return ns.format.Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast(iMsg)) {
            return null;
        }
        var dict = pwd.toMap();
        var json = ns.format.JSON.encode(dict);
        return ns.format.UTF8.encode(json);
    };
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        return contact.encrypt(data);
    };
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return ns.format.Base64.encode(key);
    };
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return ns.format.Base64.decode(key);
    };
    Transceiver.prototype.decryptKey = function (data, sender, receiver, sMsg) {
        var barrack = this.getEntityDelegate();
        var identifier = sMsg.getReceiver();
        var user = barrack.getUser(identifier);
        return user.decrypt(data);
    };
    Transceiver.prototype.deserializeKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        var json = ns.format.UTF8.decode(data);
        var dict = ns.format.JSON.decode(json);
        return SymmetricKey.parse(dict);
    };
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast(sMsg)) {
            return ns.format.UTF8.encode(data);
        }
        return ns.format.Base64.decode(data);
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = ns.format.UTF8.decode(data);
        var dict = ns.format.JSON.decode(json);
        return Content.parse(dict);
    };
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return ns.format.Base64.encode(signature);
    };
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return ns.format.Base64.decode(signature);
    };
    Transceiver.prototype.verifyDataSignature = function (
        data,
        signature,
        sender,
        rMsg
    ) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(sender);
        return contact.verify(data, signature);
    };
    ns.core.Transceiver = Transceiver;
    ns.core.registers("Transceiver");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var ContentFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(ContentFactory, Object, [Content.Factory]);
    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };
    var CommandFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(CommandFactory, Object, [Command.Factory]);
    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };
    var GeneralCommandFactory = function () {
        Object.call(this);
    };
    ns.Class(GeneralCommandFactory, Object, [Content.Factory, Command.Factory]);
    GeneralCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            if (Content.getGroup(content)) {
                factory = Command.getFactory("group");
            }
            if (!factory) {
                factory = this;
            }
        }
        return factory.parseCommand(content);
    };
    GeneralCommandFactory.prototype.parseCommand = function (cmd) {
        return new Command(cmd);
    };
    var HistoryCommandFactory = function () {
        GeneralCommandFactory.call(this);
    };
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);
    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    };
    var GroupCommandFactory = function () {
        HistoryCommandFactory.call(this);
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);
    GroupCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this;
        }
        return factory.parseCommand(content);
    };
    GroupCommandFactory.prototype.parseCommand = function (cmd) {
        return new GroupCommand(cmd);
    };
    var registerContentFactories = function () {
        Content.setFactory(
            ContentType.FORWARD,
            new ContentFactory(ns.dkd.SecretContent)
        );
        Content.setFactory(
            ContentType.TEXT,
            new ContentFactory(ns.dkd.BaseTextContent)
        );
        Content.setFactory(
            ContentType.FILE,
            new ContentFactory(ns.dkd.BaseFileContent)
        );
        Content.setFactory(
            ContentType.IMAGE,
            new ContentFactory(ns.dkd.ImageFileContent)
        );
        Content.setFactory(
            ContentType.AUDIO,
            new ContentFactory(ns.dkd.AudioFileContent)
        );
        Content.setFactory(
            ContentType.VIDEO,
            new ContentFactory(ns.dkd.VideoFileContent)
        );
        Content.setFactory(
            ContentType.PAGE,
            new ContentFactory(ns.dkd.WebPageContent)
        );
        Content.setFactory(
            ContentType.MONEY,
            new ContentFactory(ns.dkd.BaseMoneyContent)
        );
        Content.setFactory(
            ContentType.TRANSFER,
            new ContentFactory(ns.dkd.TransferMoneyContent)
        );
        Content.setFactory(ContentType.COMMAND, new GeneralCommandFactory());
        Content.setFactory(ContentType.HISTORY, new HistoryCommandFactory());
        Content.setFactory(0, new ContentFactory(ns.dkd.BaseContent));
    };
    var registerCommandFactories = function () {
        Command.setFactory(
            Command.META,
            new CommandFactory(ns.dkd.BaseMetaCommand)
        );
        Command.setFactory(
            Command.DOCUMENT,
            new CommandFactory(ns.dkd.BaseDocumentCommand)
        );
        Command.setFactory("group", new GroupCommandFactory());
        Command.setFactory(
            GroupCommand.INVITE,
            new CommandFactory(ns.dkd.InviteGroupCommand)
        );
        Command.setFactory(
            GroupCommand.EXPEL,
            new CommandFactory(ns.dkd.ExpelGroupCommand)
        );
        Command.setFactory(
            GroupCommand.JOIN,
            new CommandFactory(ns.dkd.JoinGroupCommand)
        );
        Command.setFactory(
            GroupCommand.QUIT,
            new CommandFactory(ns.dkd.QuitGroupCommand)
        );
        Command.setFactory(
            GroupCommand.QUERY,
            new CommandFactory(ns.dkd.QueryGroupCommand)
        );
        Command.setFactory(
            GroupCommand.RESET,
            new CommandFactory(ns.dkd.ResetGroupCommand)
        );
    };
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.registerContentFactories = registerContentFactories;
    ns.core.registerCommandFactories = registerCommandFactories;
    ns.core.registers("ContentFactory");
    ns.core.registers("CommandFactory");
    ns.core.registers("GeneralCommandFactory");
    ns.core.registers("HistoryCommandFactory");
    ns.core.registers("GroupCommandFactory");
    ns.core.registers("registerContentFactories");
    ns.core.registers("registerCommandFactories");
})(DIMP);
