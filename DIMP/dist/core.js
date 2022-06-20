/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.2.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Jun. 20, 2022
 * @copyright (c) 2022 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = new MingKeMing.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
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
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Content = ns.protocol.Content;
    var ForwardContent = function () {};
    ns.Interface(ForwardContent, [Content]);
    ForwardContent.prototype.setMessage = function (secret) {
        ns.assert(false, "implement me!");
    };
    ForwardContent.prototype.getMessage = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ForwardContent.getMessage = function (content) {
        var secret = content["forward"];
        return ReliableMessage.parse(secret);
    };
    ForwardContent.setMessage = function (secret, content) {
        if (secret) {
            content["forward"] = secret.toMap();
        } else {
            delete content["forward"];
        }
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.registers("ForwardContent");
})(DaoKeDao);
(function (ns) {
    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var FileContent = function () {};
    ns.Interface(FileContent, [Content]);
    FileContent.prototype.setURL = function (url) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getURL = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setURL = function (url, content) {
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    FileContent.getURL = function (content) {
        return content["URL"];
    };
    FileContent.prototype.setFilename = function (filename) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getFilename = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setFilename = function (filename, content) {
        if (filename) {
            content["filename"] = filename;
        } else {
            delete content["filename"];
        }
    };
    FileContent.getFilename = function (content) {
        return content["filename"];
    };
    FileContent.prototype.setData = function (data) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getData = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setData = function (data, content) {
        if (data) {
            content["data"] = Base64.encode(data);
        } else {
            delete content["data"];
        }
    };
    FileContent.getData = function (content) {
        var base64 = content["data"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    FileContent.prototype.setPassword = function (key) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getPassword = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setPassword = function (key, content) {
        if (key) {
            content["password"] = key.toMap();
        } else {
            delete content["password"];
        }
    };
    FileContent.getPassword = function (content) {
        var key = content["password"];
        return SymmetricKey.parse(key);
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.registers("FileContent");
})(DIMP);
(function (ns) {
    var Base64 = ns.format.Base64;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function () {};
    ns.Interface(ImageContent, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        ns.assert(false, "implement me!");
    };
    ImageContent.prototype.getThumbnail = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ImageContent.setThumbnail = function (image, content) {
        if (image) {
            content["thumbnail"] = Base64.encode(image);
        } else {
            delete content["thumbnail"];
        }
    };
    ImageContent.getThumbnail = function (content) {
        var base64 = content["thumbnail"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    var VideoContent = function () {};
    ns.Interface(VideoContent, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        ns.assert(false, "implement me!");
    };
    VideoContent.prototype.getSnapshot = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    VideoContent.setSnapshot = function (image, content) {
        if (image) {
            content["snapshot"] = Base64.encode(image);
        } else {
            delete content["snapshot"];
        }
    };
    VideoContent.getSnapshot = function (content) {
        var base64 = content["snapshot"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    var AudioContent = function () {};
    ns.Interface(AudioContent, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        ns.assert(false, "implement me!");
    };
    AudioContent.prototype.getText = function () {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
    };
    TextContent.prototype.getText = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.registers("TextContent");
})(DIMP);
(function (ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.protocol.Content;
    var PageContent = function () {};
    ns.Interface(PageContent, [Content]);
    PageContent.prototype.setURL = function (url) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getURL = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getURL = function (content) {
        return content["URL"];
    };
    PageContent.setURL = function (url, content) {
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    PageContent.prototype.setTitle = function (title) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getTitle = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getTitle = function (content) {
        return content["title"];
    };
    PageContent.setTitle = function (title, content) {
        if (title) {
            content["title"] = title;
        } else {
            delete content["title"];
        }
    };
    PageContent.prototype.setDesc = function (text) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getDesc = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getDesc = function (content) {
        return content["desc"];
    };
    PageContent.setDesc = function (text, content) {
        if (text) {
            content["desc"] = text;
        } else {
            delete content["desc"];
        }
    };
    PageContent.prototype.setIcon = function (image) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getIcon = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.setIcon = function (image, content) {
        if (image) {
            content["icon"] = Base64.encode(image);
        } else {
            delete content["icon"];
        }
    };
    PageContent.getIcon = function (content) {
        var base64 = content["icon"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.registers("PageContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var MoneyContent = function () {};
    ns.Interface(MoneyContent, [Content]);
    MoneyContent.prototype.setCurrency = function (currency) {
        ns.assert(false, "implement me!");
    };
    MoneyContent.prototype.getCurrency = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setCurrency = function (currency, content) {
        content["currency"] = currency;
    };
    MoneyContent.getCurrency = function (content) {
        return content["currency"];
    };
    MoneyContent.prototype.setAmount = function (amount) {
        ns.assert(false, "implement me!");
    };
    MoneyContent.prototype.getAmount = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setAmount = function (amount, content) {
        content["amount"] = amount;
    };
    MoneyContent.getAmount = function (content) {
        return content["amount"];
    };
    var TransferContent = function () {};
    ns.Interface(TransferContent, [MoneyContent]);
    TransferContent.prototype.setComment = function (text) {
        ns.assert(false, "implement me!");
    };
    TransferContent.prototype.getComment = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.registers("MoneyContent");
    ns.protocol.registers("TransferContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var Command = function () {};
    ns.Interface(Command, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    Command.prototype.getCommand = function () {
        ns.assert(false, "implement me!");
        return "";
    };
    Command.getCommand = function (cmd) {
        return cmd["command"];
    };
    var CommandFactory = function () {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        ns.assert(false, "implement me!");
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
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function () {};
    ns.Interface(MetaCommand, [Command]);
    MetaCommand.prototype.setIdentifier = function (identifier) {
        ns.assert(false, "implement me!");
    };
    MetaCommand.prototype.getIdentifier = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        if (identifier) {
            cmd["ID"] = identifier.toString();
        } else {
            delete cmd["ID"];
        }
    };
    MetaCommand.getIdentifier = function (cmd) {
        return ID.parse(cmd["ID"]);
    };
    MetaCommand.prototype.setMeta = function (meta) {
        ns.assert(false, "implement me!");
    };
    MetaCommand.prototype.getMeta = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setMeta = function (meta, cmd) {
        if (meta) {
            cmd["meta"] = meta.toMap();
        } else {
            delete cmd["meta"];
        }
    };
    MetaCommand.getMeta = function (cmd) {
        return Meta.parse(cmd["meta"]);
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.registers("MetaCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function () {};
    ns.Interface(DocumentCommand, [MetaCommand]);
    DocumentCommand.prototype.setDocument = function (doc) {
        ns.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getDocument = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        if (doc) {
            cmd["document"] = doc.toMap();
        } else {
            delete cmd["command"];
        }
    };
    DocumentCommand.getDocument = function (cmd) {
        var doc = cmd["document"];
        return Document.parse(doc);
    };
    DocumentCommand.prototype.setSignature = function (base64) {
        ns.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getSignature = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd["signature"] = base64;
    };
    DocumentCommand.getSignature = function (cmd) {
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
    var Command = ns.protocol.Command;
    var HistoryCommand = function () {};
    ns.Interface(HistoryCommand, [Command]);
    HistoryCommand.prototype.getHistoryEvent = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    HistoryCommand.getHistoryEvent = function (cmd) {
        return cmd["event"];
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.registers("HistoryCommand");
})(DIMP);
(function (ns) {
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
        ns.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMember = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupCommand.prototype.setMembers = function (members) {
        ns.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupCommand.setMember = function (member, cmd) {
        if (member) {
            cmd["member"] = member.toString();
        } else {
            delete cmd["member"];
        }
    };
    GroupCommand.getMember = function (cmd) {
        return ID.parse(cmd["member"]);
    };
    GroupCommand.setMembers = function (members, cmd) {
        if (members) {
            cmd["members"] = ID.revert(members);
        } else {
            delete cmd["members"];
        }
    };
    GroupCommand.getMembers = function (cmd) {
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
        ns.assert(false, "implement me!");
        return null;
    };
    var ExpelCommand = function () {};
    ns.Interface(ExpelCommand, [GroupCommand]);
    ExpelCommand.prototype.getExpelMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var JoinCommand = function () {};
    ns.Interface(JoinCommand, [GroupCommand]);
    JoinCommand.prototype.getAsk = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var QuitCommand = function () {};
    ns.Interface(QuitCommand, [GroupCommand]);
    QuitCommand.prototype.getBye = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var ResetCommand = function () {};
    ns.Interface(ResetCommand, [GroupCommand]);
    ResetCommand.prototype.getAllMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var QueryCommand = function () {};
    ns.Interface(QueryCommand, [GroupCommand]);
    QueryCommand.prototype.getText = function () {
        ns.assert(false, "implement me!");
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
    ns.Class(SecretContent, BaseContent, [ForwardContent], {
        getMessage: function () {
            if (!this.__forward) {
                var dict = this.toMap();
                this.__forward = ForwardContent.getMessage(dict);
            }
            return this.__forward;
        },
        setMessage: function (secret) {
            var dict = this.toMap();
            ForwardContent.setMessage(secret, dict);
            this.__forward = secret;
        }
    });
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
    ns.Class(BaseFileContent, BaseContent, [FileContent], {
        setURL: function (url) {
            var dict = this.toMap();
            FileContent.setURL(url, dict);
        },
        getURL: function () {
            var dict = this.toMap();
            return FileContent.getURL(dict);
        },
        setFilename: function (filename) {
            var dict = this.toMap();
            FileContent.setFilename(filename, dict);
        },
        getFilename: function () {
            var dict = this.toMap();
            return FileContent.getFilename(dict);
        },
        setData: function (data) {
            var dict = this.toMap();
            FileContent.setData(data, dict);
            this.__data = data;
        },
        getData: function () {
            if (!this.__data) {
                var dict = this.toMap();
                this.__data = FileContent.getData(dict);
            }
            return this.__data;
        },
        setPassword: function (key) {
            var dict = this.toMap();
            FileContent.setPassword(key, dict);
            this.__password = key;
        },
        getPassword: function () {
            if (!this.__password) {
                var dict = this.toMap();
                this.__password = FileContent.getPassword(dict);
            }
            return this.__password;
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent;
    ns.dkd.registers("BaseFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
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
    ns.Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            if (!this.__thumbnail) {
                var dict = this.toMap();
                this.__thumbnail = ImageContent.getThumbnail(dict);
            }
            return this.__thumbnail;
        },
        setThumbnail: function (image) {
            var dict = this.toMap();
            ImageContent.setThumbnail(image, dict);
            this.__thumbnail = image;
        }
    });
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
    ns.Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            if (!this.__snapshot) {
                var dict = this.toMap();
                this.__snapshot = VideoContent.getSnapshot(dict);
            }
            return this.__snapshot;
        },
        setSnapshot: function (image) {
            var dict = this.toMap();
            VideoContent.setSnapshot(image, dict);
            this.__snapshot = image;
        }
    });
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
    ns.Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (asr) {
            this.setValue("text", asr);
        }
    });
    FileContent.file = function (filename, data) {
        return new BaseFileContent(filename, data);
    };
    FileContent.image = function (filename, data) {
        return new ImageFileContent(filename, data);
    };
    FileContent.audio = function (filename, data) {
        return new AudioFileContent(filename, data);
    };
    FileContent.video = function (filename, data) {
        return new VideoFileContent(filename, data);
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
    ns.Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
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
    ns.Class(WebPageContent, BaseContent, [PageContent], {
        getURL: function () {
            var dict = this.toMap();
            return PageContent.getURL(dict);
        },
        setURL: function (url) {
            var dict = this.toMap();
            PageContent.setURL(url, dict);
        },
        getTitle: function () {
            var dict = this.toMap();
            return PageContent.getTitle(dict);
        },
        setTitle: function (title) {
            var dict = this.toMap();
            PageContent.setTitle(title, dict);
        },
        getDesc: function () {
            var dict = this.toMap();
            return PageContent.getDesc(dict);
        },
        setDesc: function (text) {
            var dict = this.toMap();
            PageContent.setDesc(text, dict);
        },
        getIcon: function () {
            if (!this.__icon) {
                var dict = this.toMap();
                this.__icon = PageContent.getIcon(dict);
            }
            return this.__icon;
        },
        setIcon: function (image) {
            var dict = this.toMap();
            PageContent.setIcon(image, dict);
            this.__icon = image;
        }
    });
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
    ns.Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            var dict = this.toMap();
            MoneyContent.setCurrency(currency, dict);
        },
        getCurrency: function () {
            var dict = this.toMap();
            return MoneyContent.getCurrency(dict);
        },
        setAmount: function (amount) {
            var dict = this.toMap();
            MoneyContent.setAmount(amount, dict);
        },
        getAmount: function () {
            var dict = this.toMap();
            return MoneyContent.getAmount(dict);
        }
    });
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
    ns.Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
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
    ns.Class(BaseCommand, BaseContent, [Command], {
        getCommand: function () {
            var dict = this.toMap();
            return Command.getCommand(dict);
        }
    });
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
    ns.Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        setIdentifier: function (identifier) {
            var dict = this.toMap();
            MetaCommand.setIdentifier(identifier, dict);
            this.__identifier = identifier;
        },
        getIdentifier: function () {
            if (!this.__identifier) {
                var dict = this.toMap();
                this.__identifier = MetaCommand.getIdentifier(dict);
            }
            return this.__identifier;
        },
        setMeta: function (meta) {
            var dict = this.toMap();
            MetaCommand.setMeta(meta, dict);
            this.__meta = meta;
        },
        getMeta: function () {
            if (!this.__meta) {
                var dict = this.toMap();
                this.__meta = MetaCommand.getMeta(dict);
            }
            return this.__meta;
        }
    });
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
    ns.Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        setDocument: function (doc) {
            var dict = this.toMap();
            DocumentCommand.setDocument(doc, dict);
            this.__document = doc;
        },
        getDocument: function () {
            if (!this.__document) {
                var dict = this.toMap();
                this.__document = DocumentCommand.getDocument(dict);
            }
            return this.__document;
        },
        setSignature: function (base64) {
            var dict = this.toMap();
            DocumentCommand.setSignature(base64, dict);
        },
        getSignature: function () {
            var dict = this.toMap();
            return DocumentCommand.getSignature(dict);
        }
    });
    DocumentCommand.query = function (identifier, signature) {
        return new BaseDocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
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
    ns.Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], {
        getHistoryEvent: function () {
            var dict = this.toMap();
            return HistoryCommand.getHistoryEvent(dict);
        }
    });
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
    ns.Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            var dict = this.toMap();
            GroupCommand.setMembers(null, dict);
            GroupCommand.setMember(identifier, dict);
            this.__member = identifier;
        },
        getMember: function () {
            if (!this.__member) {
                var dict = this.toMap();
                this.__member = GroupCommand.getMember(dict);
            }
            return this.__member;
        },
        setMembers: function (members) {
            var dict = this.toMap();
            GroupCommand.setMember(null, dict);
            GroupCommand.setMembers(members, dict);
            this.__members = members;
        },
        getMembers: function () {
            if (!this.__members) {
                var dict = this.toMap();
                this.__members = GroupCommand.getMembers(dict);
            }
            return this.__members;
        }
    });
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
    ns.Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], {
        getInviteMembers: function () {
            return this.getMembers();
        }
    });
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
    ns.Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], {
        getExpelMembers: function () {
            return this.getMembers();
        }
    });
    var JoinGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], {
        getAsk: function () {
            return this.getValue("text");
        }
    });
    var QuitGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], {
        getBye: function () {
            return this.getValue("text");
        }
    });
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
    ns.Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], {
        getAllMembers: function () {
            return this.getMembers();
        }
    });
    var QueryGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], {
        getText: function () {
            return this.getValue("text");
        }
    });
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
    var Entity = function () {};
    ns.Interface(Entity, [ns.type.Object]);
    Entity.prototype.getIdentifier = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Entity.prototype.getMeta = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getDocument = function (type) {
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.setDataSource = function (barrack) {
        ns.assert(false, "implement me!");
    };
    Entity.prototype.getDataSource = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var EntityDataSource = function () {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        ns.assert(false, "implement me!");
        return null;
    };
    var EntityDelegate = function () {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseEntity, BaseObject, [Entity], null);
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
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.getContacts = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.verify = function (data, signature) {
        ns.assert(false, "implement me!");
        return false;
    };
    User.prototype.encrypt = function (plaintext) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.sign = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.decrypt = function (ciphertext) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.signVisa = function (visa) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.verifyVisa = function (visa) {
        ns.assert(false, "implement me!");
        return null;
    };
    var UserDataSource = function () {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var doc = this.getDocument(Document.VISA);
            if (ns.Interface.conforms(doc, Visa)) {
                return doc;
            } else {
                return null;
            }
        },
        getContacts: function () {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            return barrack.getContacts(uid);
        },
        verify: function (data, signature) {
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
        },
        encrypt: function (plaintext) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPublicKeyForEncryption(uid);
            if (!key) {
                throw new Error("failed to get encrypt key for user: " + uid);
            }
            return key.encrypt(plaintext);
        },
        sign: function (data) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(uid);
            if (!key) {
                throw new Error("failed to get sign key for user: " + uid);
            }
            return key.sign(data);
        },
        decrypt: function (ciphertext) {
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
        },
        signVisa: function (visa) {
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
        },
        verifyVisa: function (visa) {
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
        }
    });
    ns.mkm.BaseUser = BaseUser;
    ns.mkm.registers("BaseUser");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var Group = function () {};
    ns.Interface(Group, [Entity]);
    Group.prototype.getBulletin = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getFounder = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getOwner = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getAssistants = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var GroupDataSource = function () {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var doc = this.getDocument(Document.BULLETIN);
            if (ns.Interface.conforms(doc, Bulletin)) {
                return doc;
            } else {
                return null;
            }
        },
        getFounder: function () {
            if (!this.__founder) {
                var barrack = this.getDataSource();
                var gid = this.getIdentifier();
                this.__founder = barrack.getFounder(gid);
            }
            return this.__founder;
        },
        getOwner: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getOwner(gid);
        },
        getMembers: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getMembers(gid);
        },
        getAssistants: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getAssistants(gid);
        }
    });
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
    ns.Class(
        Barrack,
        Object,
        [Entity.Delegate, User.DataSource, Group.DataSource],
        {
            getPublicKeyForEncryption: function (identifier) {
                var key = visa_key.call(this, identifier);
                if (key) {
                    return key;
                }
                key = meta_key.call(this, identifier);
                if (ns.Interface.conforms(key, EncryptKey)) {
                    return key;
                }
                return null;
            },
            getPublicKeysForVerification: function (identifier) {
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
            },
            getFounder: function (group) {
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
            },
            getOwner: function (group) {
                if (group.isBroadcast()) {
                    return this.getBroadcastOwner(group);
                }
                if (NetworkType.POLYLOGUE.equals(group.getType())) {
                    return this.getFounder(group);
                }
                return null;
            },
            getMembers: function (group) {
                if (group.isBroadcast()) {
                    return this.getBroadcastMembers(group);
                }
                return null;
            },
            getAssistants: function (group) {
                var doc = this.getDocument(group, Document.BULLETIN);
                if (ns.Interface.conforms(doc, Bulletin)) {
                    if (doc.isValid()) {
                        return doc.getAssistants();
                    }
                }
                return null;
            }
        }
    );
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
    ns.core.Barrack = Barrack;
    ns.core.registers("Barrack");
})(DIMP);
(function (ns) {
    var Packer = function () {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function (content) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.signMessage = function (sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.deserializeMessage = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.core.Packer = Packer;
    ns.core.registers("Packer");
})(DIMP);
(function (ns) {
    var Processor = function () {};
    ns.Interface(Processor, null);
    Processor.prototype.processPackage = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processContent = function (content, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.core.Processor = Processor;
    ns.core.registers("Processor");
})(DIMP);
(function (ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = function () {
        Object.call(this);
    };
    ns.Class(
        Transceiver,
        Object,
        [InstantMessage.Delegate, ReliableMessage.Delegate],
        null
    );
    Transceiver.prototype.getEntityDelegate = function () {
        ns.assert(false, "implement me!");
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
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast(iMsg)) {
            return UTF8.decode(data);
        }
        return Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast(iMsg)) {
            return null;
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        return contact.encrypt(data);
    };
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return Base64.encode(key);
    };
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return Base64.decode(key);
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
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        return SymmetricKey.parse(dict);
    };
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast(sMsg)) {
            return UTF8.encode(data);
        }
        return Base64.decode(data);
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        return Content.parse(dict);
    };
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return Base64.encode(signature);
    };
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return Base64.decode(signature);
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
    ns.Class(ContentFactory, Object, [Content.Factory], null);
    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };
    var CommandFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(CommandFactory, Object, [Command.Factory], null);
    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };
    var GeneralCommandFactory = function () {
        Object.call(this);
    };
    ns.Class(
        GeneralCommandFactory,
        Object,
        [Content.Factory, Command.Factory],
        null
    );
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
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null, null);
    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    };
    var GroupCommandFactory = function () {
        HistoryCommandFactory.call(this);
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null, null);
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
