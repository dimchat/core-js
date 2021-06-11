/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 4, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = new MingKeMing.Namespace()
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.core !== "object") {
        ns.core = new ns.Namespace()
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace()
    }
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = new ns.Namespace()
    }
    ns.registers("core");
    ns.registers("protocol");
    ns.protocol.registers("group")
})(DIMP, DaoKeDao);
(function(ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var ForwardContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FORWARD);
            this.__forward = null
        } else {
            if (ns.Interface.conforms(arguments[0], ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                this.setMessage(arguments[0])
            } else {
                BaseContent.call(this, arguments[0]);
                this.__forward = null
            }
        }
    };
    ns.Class(ForwardContent, BaseContent, null);
    ForwardContent.getMessage = function(content) {
        var secret = content["forward"];
        if (secret) {
            return ReliableMessage.parse(secret)
        } else {
            return null
        }
    };
    ForwardContent.setMessage = function(secret, content) {
        if (secret) {
            content["forward"] = secret.getMap()
        } else {
            delete content["forward"]
        }
    };
    ForwardContent.prototype.getMessage = function() {
        if (!this.__forward) {
            this.__forward = ForwardContent.getMessage(this.getMap())
        }
        return this.__forward
    };
    ForwardContent.prototype.setMessage = function(secret) {
        ForwardContent.setMessage(secret, this.getMap());
        this.__forward = secret
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.registers("ForwardContent")
})(DaoKeDao);
(function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var FileContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FILE);
            this.__data = null
        } else {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0]);
                this.__data = null
            } else {
                if (arguments.length === 2) {
                    BaseContent.call(this, ContentType.FILE);
                    this.setFilename(arguments[0]);
                    this.setData(arguments[1])
                } else {
                    if (arguments.length === 3) {
                        BaseContent.call(this, arguments[0]);
                        this.setFilename(arguments[1]);
                        this.setData(arguments[2])
                    } else {
                        throw new SyntaxError("file content arguments error: " + arguments)
                    }
                }
            }
        }
        this.__password = null
    };
    ns.Class(FileContent, BaseContent, null);
    FileContent.getURL = function(content) {
        return content["URL"]
    };
    FileContent.setURL = function(url, content) {
        if (url && url.indexOf("://") > 0) {
            content["URL"] = url
        } else {
            delete content["URL"]
        }
    };
    FileContent.getFilename = function(content) {
        return content["filename"]
    };
    FileContent.setFilename = function(filename, content) {
        if (filename && filename.length > 0) {
            content["filename"] = filename
        } else {
            delete content["filename"]
        }
    };
    FileContent.getData = function(content) {
        var base64 = content["data"];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    FileContent.setData = function(data, content) {
        if (data && data.length > 0) {
            content["data"] = ns.format.Base64.encode(data)
        } else {
            delete content["data"]
        }
    };
    FileContent.getPassword = function(content) {
        var key = content["password"];
        if (key) {
            return SymmetricKey.parse(key)
        } else {
            return null
        }
    };
    FileContent.setPassword = function(key, content) {
        if (key) {
            content["password"] = key.getMap()
        } else {
            delete content["password"]
        }
    };
    FileContent.prototype.getURL = function() {
        return FileContent.getURL(this.getMap())
    };
    FileContent.prototype.setURL = function(url) {
        FileContent.setURL(url, this.getMap())
    };
    FileContent.prototype.getFilename = function() {
        return FileContent.getFilename(this.getMap())
    };
    FileContent.prototype.setFilename = function(filename) {
        FileContent.setFilename(filename, this.getMap())
    };
    FileContent.prototype.getData = function() {
        if (!this.__data) {
            this.__data = FileContent.getData(this.getMap())
        }
        return this.__data
    };
    FileContent.prototype.setData = function(data) {
        FileContent.setData(data, this.getMap());
        this.__data = data
    };
    FileContent.prototype.getPassword = function() {
        if (!this.__password) {
            this.__password = FileContent.getPassword(console)
        }
        return this.__password
    };
    FileContent.prototype.setPassword = function(key) {
        FileContent.setPassword(key, this.getMap());
        this.__password = key
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.registers("FileContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.IMAGE)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("image content arguments error: " + arguments)
                }
            }
        }
        this.__thumbnail = null
    };
    ns.Class(ImageContent, FileContent, null);
    ImageContent.getThumbnail = function(content) {
        var base64 = content["thumbnail"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    ImageContent.setThumbnail = function(image, content) {
        if (image && image.length > 0) {
            content["thumbnail"] = ns.format.Base64.encode(image)
        } else {
            delete content["thumbnail"]
        }
    };
    ImageContent.prototype.getThumbnail = function() {
        if (!this.__thumbnail) {
            this.__thumbnail = ImageContent.getThumbnail(this.getMap())
        }
        return this.__thumbnail
    };
    ImageContent.prototype.setThumbnail = function(image) {
        ImageContent.setThumbnail(image, this.getMap());
        this.__thumbnail = image
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.registers("ImageContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var VideoContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.VIDEO)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.VIDEO, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("video content arguments error: " + arguments)
                }
            }
        }
        this.__snapshot = null
    };
    ns.Class(VideoContent, FileContent, null);
    VideoContent.getSnapshot = function(content) {
        var base64 = content["snapshot"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    VideoContent.setSnapshot = function(image, content) {
        if (image && image.length > 0) {
            content["snapshot"] = ns.format.Base64.encode(image)
        } else {
            delete content["snapshot"]
        }
    };
    VideoContent.prototype.getSnapshot = function() {
        if (!this.__snapshot) {
            this.__snapshot = VideoContent.getSnapshot(this.getMap())
        }
        return this.__snapshot
    };
    VideoContent.prototype.setSnapshot = function(image) {
        VideoContent.setSnapshot(image, this.getMap());
        this.__snapshot = image
    };
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.registers("VideoContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var AudioContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.AUDIO)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.AUDIO, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("audio content arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(AudioContent, FileContent, null);
    AudioContent.prototype.getText = function() {
        return this.getValue("text")
    };
    AudioContent.prototype.setText = function(asr) {
        this.setValue("text", asr)
    };
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.registers("AudioContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var TextContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.TEXT)
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.TEXT);
                this.setText(arguments[0])
            } else {
                BaseContent.call(this, arguments[0])
            }
        }
    };
    ns.Class(TextContent, BaseContent, null);
    TextContent.prototype.getText = function() {
        return this.getValue("text")
    };
    TextContent.prototype.setText = function(text) {
        this.setValue("text", text)
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.registers("TextContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var PageContent = function() {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
            this.__icon = null
        } else {
            if (arguments.length === 4) {
                BaseContent.call(this, ContentType.PAGE);
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3])
            } else {
                throw new SyntaxError("web page content arguments error: " + arguments)
            }
        }
    };
    ns.Class(PageContent, BaseContent, null);
    PageContent.getURL = function(content) {
        return content["URL"]
    };
    PageContent.setURL = function(url, content) {
        if (url && url.indexOf("://") > 0) {
            content["URL"] = url
        } else {
            delete content["URL"]
        }
    };
    PageContent.getTitle = function(content) {
        return content["title"]
    };
    PageContent.setTitle = function(title, content) {
        if (title && title.length > 0) {
            content["title"] = title
        } else {
            delete content["title"]
        }
    };
    PageContent.getDesc = function(content) {
        return content["desc"]
    };
    PageContent.setDesc = function(text, content) {
        if (text && text.length > 0) {
            content["desc"] = text
        } else {
            delete content["desc"]
        }
    };
    PageContent.getIcon = function(content) {
        var base64 = content["icon"];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    PageContent.setIcon = function(image, content) {
        if (image && image.length > 0) {
            content["icon"] = ns.format.Base64.encode(image)
        } else {
            delete content["icon"]
        }
    };
    PageContent.prototype.getURL = function() {
        return PageContent.getURL(this.getMap())
    };
    PageContent.prototype.setURL = function(url) {
        PageContent.setURL(url, this.getMap())
    };
    PageContent.prototype.getTitle = function() {
        return PageContent.getTitle(this.getMap())
    };
    PageContent.prototype.setTitle = function(title) {
        PageContent.setTitle(title, this.getMap())
    };
    PageContent.prototype.getDesc = function() {
        return PageContent.getDesc(this.getMap())
    };
    PageContent.prototype.setDesc = function(text) {
        PageContent.setDesc(text, this.getMap())
    };
    PageContent.prototype.getIcon = function() {
        if (!this.__icon) {
            this.__icon = PageContent.getIcon(this.getMap())
        }
        return this.__icon
    };
    PageContent.prototype.setIcon = function(image) {
        PageContent.setIcon(image, this.getMap());
        this.__icon = image
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.registers("PageContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var MoneyContent = function() {
        if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2])
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1])
            } else {
                if (typeof arguments[0] === "string") {
                    BaseContent.call(ContentType.MONEY);
                    this.setCurrency(arguments[0])
                } else {
                    BaseContent.call(arguments[0])
                }
            }
        }
    };
    ns.Class(MoneyContent, BaseContent, null);
    MoneyContent.getCurrency = function(content) {
        return content["currency"]
    };
    MoneyContent.setCurrency = function(currency, content) {
        content["currency"] = currency
    };
    MoneyContent.getAmount = function(content) {
        return content["amount"]
    };
    MoneyContent.setAmount = function(amount, content) {
        content["amount"] = amount
    };
    MoneyContent.prototype.getCurrency = function() {
        return MoneyContent.getCurrency(this.getMap())
    };
    MoneyContent.prototype.setCurrency = function(currency) {
        MoneyContent.setCurrency(currency, this.getMap())
    };
    MoneyContent.prototype.getAmount = function() {
        return MoneyContent.getAmount(this.getMap())
    };
    MoneyContent.prototype.setAmount = function(amount) {
        MoneyContent.setAmount(amount, this.getMap())
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.registers("MoneyContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.MoneyContent;
    var TransferContent = function() {
        if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], 0)
            } else {
                MoneyContent.call(arguments[0])
            }
        }
    };
    ns.Class(TransferContent, MoneyContent, null);
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.registers("TransferContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.dkd.BaseContent;
    var Command = function() {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setCommand(arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setCommand(arguments[0])
            } else {
                BaseContent.call(this, arguments[0])
            }
        }
    };
    ns.Class(Command, BaseContent, null);
    Command.getCommand = function(cmd) {
        return cmd["command"]
    };
    Command.setCommand = function(name, cmd) {
        if (name && name.length > 0) {
            cmd["command"] = name
        } else {
            delete cmd["command"]
        }
    };
    Command.prototype.getCommand = function() {
        return Command.getCommand(this.getMap())
    };
    Command.prototype.setCommand = function(name) {
        Command.setCommand(name, this.getMap())
    };
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    ns.protocol.Command = Command;
    ns.protocol.registers("Command")
})(DIMP);
(function(ns) {
    var Command = ns.protocol.Command;
    var CommandFactory = function() {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function(cmd) {
        console.assert(false, "implement me!");
        return null
    };
    Command.Factory = CommandFactory;
    var s_factories = {};
    Command.register = function(name, factory) {
        s_factories[name] = factory
    };
    Command.getFactory = function(name) {
        return s_factories[name]
    }
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function() {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0])
            } else {
                Command.call(this, arguments[0]);
                this.__identifier = null
            }
            this.__meta = null
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[0], ID)) {
                    Command.call(this, Command.META);
                    this.setIdentifier(arguments[0]);
                    this.setMeta(arguments[1])
                } else {
                    Command.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.__meta = null
                }
            } else {
                if (arguments.length === 3) {
                    Command.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.setMeta(arguments[2])
                } else {
                    throw new SyntaxError("meta command arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(MetaCommand, Command, null);
    MetaCommand.getIdentifier = function(cmd) {
        return ID.parse(cmd["ID"])
    };
    MetaCommand.setIdentifier = function(identifier, cmd) {
        if (identifier) {
            cmd["ID"] = identifier.toString()
        } else {
            delete cmd["ID"]
        }
    };
    MetaCommand.getMeta = function(cmd) {
        return Meta.parse(cmd["meta"])
    };
    MetaCommand.setMeta = function(meta, cmd) {
        if (meta) {
            cmd["meta"] = meta.getMap()
        } else {
            delete cmd["meta"]
        }
    };
    MetaCommand.prototype.getIdentifier = function() {
        if (!this.__identifier) {
            this.__identifier = MetaCommand.getIdentifier(this.getMap())
        }
        return this.__identifier
    };
    MetaCommand.prototype.setIdentifier = function(identifier) {
        MetaCommand.setIdentifier(identifier, this.getMap());
        this.__identifier = identifier
    };
    MetaCommand.prototype.getMeta = function() {
        if (!this.__meta) {
            this.__meta = MetaCommand.getMeta(this.getMap())
        }
        return this.__meta
    };
    MetaCommand.prototype.setMeta = function(meta) {
        MetaCommand.setMeta(meta, this.getMap());
        this.__meta = meta
    };
    MetaCommand.query = function(identifier) {
        return new MetaCommand(identifier)
    };
    MetaCommand.response = function(identifier, meta) {
        return new MetaCommand(identifier, meta)
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.registers("MetaCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function() {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                MetaCommand.call(this, Command.DOCUMENT, arguments[0])
            } else {
                MetaCommand.call(this, arguments[0])
            }
            this.__document = null
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[1], Meta)) {
                    MetaCommand.call(this, Command.DOCUMENT, arguments[0], arguments[1])
                } else {
                    if (typeof arguments[1] === "string") {
                        MetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                        this.setSignature(arguments[1])
                    } else {
                        throw new SyntaxError("document command arguments error: " + arguments)
                    }
                }
                this.__document = null
            } else {
                if (arguments.length === 3) {
                    MetaCommand.call(this, Command.DOCUMENT, arguments[0], arguments[1]);
                    this.setDocument(arguments[2])
                } else {
                    throw new SyntaxError("document command arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(DocumentCommand, MetaCommand, null);
    DocumentCommand.getDocument = function(cmd) {
        var data = cmd["profile"];
        if (!data) {
            data = cmd["document"]
        } else {
            if (typeof data === "string") {
                data = {
                    "ID": cmd["ID"],
                    "data": data,
                    "signature": cmd["signature"]
                }
            }
        }
        if (data) {
            return Document.parse(data)
        } else {
            return null
        }
    };
    DocumentCommand.setDocument = function(doc, cmd) {
        if (doc) {
            cmd["document"] = doc.getMap()
        } else {
            delete cmd["command"]
        }
    };
    DocumentCommand.getSignature = function(cmd) {
        return cmd["signature"]
    };
    DocumentCommand.setSignature = function(base64, cmd) {
        cmd["signature"] = base64
    };
    DocumentCommand.prototype.getDocument = function() {
        if (!this.__document) {
            this.__document = DocumentCommand.getDocument(this.getMap())
        }
        return this.__document
    };
    DocumentCommand.prototype.setDocument = function(doc) {
        DocumentCommand.setDocument(doc, this.getMap());
        this.__document = doc
    };
    DocumentCommand.prototype.getSignature = function() {
        return DocumentCommand.getSignature(this.getMap())
    };
    DocumentCommand.prototype.setSignature = function(base64) {
        DocumentCommand.setSignature(base64, this.getMap())
    };
    DocumentCommand.query = function(identifier, signature) {
        return new DocumentCommand(identifier, signature)
    };
    DocumentCommand.response = function(identifier, meta, doc) {
        return new DocumentCommand(identifier, meta, doc)
    };
    ns.protocol.DocumentCommand = DocumentCommand;
    ns.protocol.registers("DocumentCommand")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var HistoryCommand = function() {
        if (arguments.length === 2) {
            Command.call(this, arguments[0], arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                Command.call(this, ContentType.HISTORY, arguments[0])
            } else {
                Command.call(this, arguments[0])
            }
        }
    };
    ns.Class(HistoryCommand, Command, null);
    HistoryCommand.register = Command.register;
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.registers("HistoryCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function() {
        if (arguments.length === 1) {
            HistoryCommand.call(this, arguments[0]);
            this.__member = null;
            this.__members = null
        } else {
            if (arguments.length === 2) {
                HistoryCommand.call(this, arguments[0]);
                this.setGroup(arguments[1]);
                this.__member = null;
                this.__members = null
            } else {
                if (arguments[2] instanceof Array) {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.__member = null;
                    this.setMembers(arguments[2])
                } else {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.setMember(arguments[2]);
                    this.__members = null
                }
            }
        }
    };
    ns.Class(GroupCommand, HistoryCommand, null);
    GroupCommand.getMember = function(cmd) {
        return ID.parse(cmd["member"])
    };
    GroupCommand.setMember = function(member, cmd) {
        if (member) {
            cmd["member"] = member.toString()
        } else {
            delete cmd["member"]
        }
    };
    GroupCommand.getMembers = function(cmd) {
        var members = cmd["members"];
        if (members) {
            return ID.convert(members)
        } else {
            return null
        }
    };
    GroupCommand.setMembers = function(members, cmd) {
        if (members && members.length > 0) {
            cmd["members"] = ID.revert(members)
        } else {
            delete cmd["members"]
        }
    };
    GroupCommand.prototype.getMember = function() {
        if (!this.__member) {
            this.__member = GroupCommand.getMember(this.getMap())
        }
        return this.__member
    };
    GroupCommand.prototype.setMember = function(identifier) {
        GroupCommand.setMembers(null, this.getMap());
        GroupCommand.setMember(identifier, this.getMap());
        this.__member = identifier
    };
    GroupCommand.prototype.getMembers = function() {
        if (!this.__members) {
            this.__members = GroupCommand.getMembers(this.getMap())
        }
        return this.__members
    };
    GroupCommand.prototype.setMembers = function(members) {
        GroupCommand.setMember(null, this.getMap());
        GroupCommand.setMembers(members, this.getMap());
        this.__members = members
    };
    GroupCommand.register = HistoryCommand.register;
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
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.registers("GroupCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.INVITE, arguments[0], arguments[1])
        }
    };
    ns.Class(InviteCommand, GroupCommand, null);
    var ExpelCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.EXPEL, arguments[0], arguments[1])
        }
    };
    ns.Class(ExpelCommand, GroupCommand, null);
    var JoinCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.JOIN, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(JoinCommand, GroupCommand, null);
    var QuitCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.QUIT, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(QuitCommand, GroupCommand, null);
    var ResetCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.RESET, arguments[0], arguments[1])
        }
    };
    ns.Class(ResetCommand, GroupCommand, null);
    var QueryCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.QUERY, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(QueryCommand, GroupCommand, null);
    GroupCommand.invite = function(group, members) {
        return new InviteCommand(group, members)
    };
    GroupCommand.expel = function(group, members) {
        return new ExpelCommand(group, members)
    };
    GroupCommand.join = function(group) {
        return new JoinCommand(group)
    };
    GroupCommand.quit = function(group) {
        return new QuitCommand(group)
    };
    GroupCommand.reset = function(group, members) {
        return new ResetCommand(group, members)
    };
    GroupCommand.query = function(group) {
        return new QueryCommand(group)
    };
    GroupCommand.register(GroupCommand.INVITE, InviteCommand);
    GroupCommand.register(GroupCommand.EXPEL, ExpelCommand);
    GroupCommand.register(GroupCommand.JOIN, JoinCommand);
    GroupCommand.register(GroupCommand.QUIT, QuitCommand);
    GroupCommand.register(GroupCommand.RESET, ResetCommand);
    GroupCommand.register(GroupCommand.QUERY, QueryCommand);
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
    ns.protocol.group.registers("QueryCommand")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var ID = ns.protocol.ID;
    var Entity = function(identifier) {
        obj.call(this);
        this.identifier = identifier;
        this.__datasource = null
    };
    ns.Class(Entity, obj, null);
    Entity.prototype.equals = function(other) {
        if (this === other) {
            return true
        } else {
            if (other instanceof Entity) {
                return this.identifier.equals(other.identifier)
            } else {
                if (ns.Interface.conforms(other, ID)) {
                    return this.identifier.equals(other)
                } else {
                    return false
                }
            }
        }
    };
    Entity.prototype.valueOf = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.toString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.toLocaleString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.getType = function() {
        return this.identifier.getType()
    };
    Entity.prototype.getDataSource = function() {
        return this.__datasource
    };
    Entity.prototype.setDataSource = function(delegate) {
        this.__datasource = delegate
    };
    Entity.prototype.getMeta = function() {
        return this.getDataSource().getMeta(this.identifier)
    };
    Entity.prototype.getDocument = function(type) {
        return this.getDataSource().getDocument(this.identifier, type)
    };
    ns.Entity = Entity;
    ns.registers("Entity")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var EntityDataSource = function() {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDataSource.prototype.getDocument = function(identifier, type) {
        console.assert(false, "implement me!");
        return null
    };
    Entity.DataSource = EntityDataSource
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var EntityDelegate = function() {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.selectLocalUser = function(receiver) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getUser = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getGroup = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Entity.Delegate = EntityDelegate
})(DIMP);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Entity = ns.Entity;
    var User = function(identifier) {
        Entity.call(this, identifier)
    };
    ns.Class(User, Entity, null);
    User.prototype.getVisa = function() {
        var doc = this.getDocument(Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            return doc
        } else {
            return null
        }
    };
    User.prototype.getContacts = function() {
        return this.getDataSource().getContacts(this.identifier)
    };
    User.prototype.verify = function(data, signature) {
        var keys = this.getDataSource().getPublicKeysForVerification(this.identifier);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get verify keys for user: " + this.identifier)
        }
        for (var i = 0; i < keys.length; ++i) {
            if (keys[i].verify(data, signature)) {
                return true
            }
        }
        return false
    };
    User.prototype.encrypt = function(plaintext) {
        var key = this.getDataSource().getPublicKeyForEncryption(this.identifier);
        if (!key) {
            throw new Error("failed to get encrypt key for user: " + this.identifier)
        }
        return key.encrypt(plaintext)
    };
    User.prototype.sign = function(data) {
        var key = this.getDataSource().getPrivateKeyForSignature(this.identifier);
        if (!key) {
            throw new Error("failed to get sign key for user: " + this.identifier)
        }
        return key.sign(data)
    };
    User.prototype.decrypt = function(ciphertext) {
        var keys = this.getDataSource().getPrivateKeysForDecryption(this.identifier);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get decrypt keys for user: " + this.identifier)
        }
        var plaintext;
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    return plaintext
                }
            } catch (e) {}
        }
        return null
    };
    User.prototype.signVisa = function(visa) {
        if (!this.identifier.equals(visa.getIdentifier())) {
            return null
        }
        var key = this.getDataSource().getPrivateKeyForVisaSignature(this.identifier);
        if (!key) {
            throw new Error("failed to get sign key for user: " + this.identifier)
        }
        visa.sign(key);
        return visa
    };
    User.prototype.verifyVisa = function(visa) {
        if (!this.identifier.equals(visa.getIdentifier())) {
            return null
        }
        var key = this.getMeta().getKey();
        if (!key) {
            throw new Error("failed to get meta key for user: " + this.identifier)
        }
        return visa.verify(key)
    };
    ns.User = User;
    ns.registers("User")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var User = ns.User;
    var UserDataSource = function() {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function(identifier) {
        return null
    };
    UserDataSource.prototype.getPublicKeysForVerification = function(identifier) {
        return null
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    User.DataSource = UserDataSource
})(DIMP);
(function(ns) {
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.Entity;
    var Group = function(identifier) {
        Entity.call(this, identifier);
        this.__founder = null
    };
    ns.Class(Group, Entity, null);
    Group.prototype.getBulletin = function() {
        var doc = this.getDocument(Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            return doc
        } else {
            return null
        }
    };
    Group.prototype.getFounder = function() {
        if (!this.__founder) {
            this.__founder = this.getDataSource().getFounder(this.identifier)
        }
        return this.__founder
    };
    Group.prototype.getOwner = function() {
        return this.getDataSource().getOwner(this.identifier)
    };
    Group.prototype.getMembers = function() {
        return this.getDataSource().getMembers(this.identifier)
    };
    Group.prototype.getAssistants = function() {
        return this.getDataSource().getAssistants(this.identifier)
    };
    ns.Group = Group;
    ns.registers("Group")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var Group = ns.Group;
    var GroupDataSource = function() {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getOwner = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getMembers = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getAssistants = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Group.DataSource = GroupDataSource
})(DIMP);
(function(ns) {
    var CipherKeyDelegate = function() {};
    ns.Interface(CipherKeyDelegate, null);
    CipherKeyDelegate.prototype.getCipherKey = function(from, to, generate) {
        console.assert(false, "implement me!");
        return null
    };
    CipherKeyDelegate.prototype.cacheCipherKey = function(from, to, key) {
        console.assert(false, "implement me!")
    };
    ns.CipherKeyDelegate = CipherKeyDelegate;
    ns.registers("CipherKeyDelegate")
})(DIMP);
(function(ns) {
    var Packer = function() {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function(content) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.encryptMessage = function(iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.signMessage = function(sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.serializeMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.deserializeMessage = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.verifyMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.decryptMessage = function(sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    var Processor = function() {};
    ns.Interface(Processor, null);
    Processor.prototype.processData = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processReliableMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processSecureMessage = function(sMsg, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processInstantMessage = function(iMsg, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processContent = function(content, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    var Message = ns.protocol.Message;
    var Entity = ns.Entity;
    var CipherKeyDelegate = ns.CipherKeyDelegate;
    var Transceiver = function() {};
    ns.Interface(Transceiver, [Entity.Delegate, CipherKeyDelegate, Message.Delegate, Packer, Processor]);
    Transceiver.Packer = Packer;
    Transceiver.Processor = Processor;
    ns.Transceiver = Transceiver;
    ns.registers("Transceiver")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var ID = ns.protocol.ID;
    var NetworkType = ns.protocol.NetworkType;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.Entity;
    var User = ns.User;
    var Group = ns.Group;
    var Barrack = function() {
        obj.call(this);
        this.__users = {};
        this.__groups = {}
    };
    ns.Class(Barrack, obj, [Entity.Delegate, User.DataSource, Group.DataSource]);
    var thanos = function(map, finger) {
        var keys = Object.keys(map);
        for (var i = 0; i < keys.length; ++i) {
            var p = map[keys[i]];
            if (typeof p === "function") {
                continue
            }
            if ((++finger & 1) === 1) {
                delete map[p]
            }
        }
        return finger
    };
    Barrack.prototype.reduceMemory = function() {
        var finger = 0;
        finger = thanos(this.__users, finger);
        finger = thanos(this.__groups, finger);
        return finger >> 1
    };
    var cacheUser = function(user) {
        if (!user.getDataSource()) {
            user.setDataSource(this)
        }
        this.__users[user.identifier.toString()] = user;
        return true
    };
    var cacheGroup = function(group) {
        if (!group.getDataSource()) {
            group.setDataSource(this)
        }
        this.__groups[group.identifier.toString()] = group;
        return true
    };
    Barrack.prototype.createUser = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.createGroup = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.getLocalUsers = function() {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.selectLocalUser = function(receiver) {
        var users = this.getLocalUsers();
        if (users == null || users.length === 0) {
            throw new Error("local users should not be empty")
        } else {
            if (receiver.isBroadcast()) {
                return users[0]
            }
        }
        var i, user;
        if (receiver.isGroup()) {
            var members = this.getMembers(receiver);
            if (members == null || members.length === 0) {
                return null
            }
            var j, member;
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                for (j = 0; j < members.length; ++j) {
                    member = members[j];
                    if (member.equals(user.identifier)) {
                        return user
                    }
                }
            }
        } else {
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                if (receiver.equals(user.identifier)) {
                    return user
                }
            }
        }
        return null
    };
    Barrack.prototype.getUser = function(identifier) {
        var user = this.__users[identifier.toString()];
        if (!user) {
            user = this.createUser(identifier);
            if (user) {
                cacheUser.call(this, user)
            }
        }
        return user
    };
    Barrack.prototype.getGroup = function(identifier) {
        var group = this.__groups[identifier.toString()];
        if (!group) {
            group = this.createGroup(identifier);
            if (group) {
                cacheGroup.call(this, group)
            }
        }
        return group
    };
    var visa_key = function(user) {
        var doc = this.getDocument(user, Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            if (doc.isValid()) {
                return doc.getKey()
            }
        }
        return null
    };
    var meta_key = function(user) {
        var meta = this.getMeta(user);
        if (meta) {
            return meta.getKey()
        }
        return null
    };
    Barrack.prototype.getPublicKeyForEncryption = function(identifier) {
        var key = visa_key.call(this, identifier);
        if (key) {
            return key
        }
        key = meta_key.call(this, identifier);
        if (ns.Interface.conforms(key, EncryptKey)) {
            return key
        }
        return null
    };
    Barrack.prototype.getPublicKeysForVerification = function(identifier) {
        var keys = [];
        var key = visa_key.call(this, identifier);
        if (ns.Interface.conforms(key, VerifyKey)) {
            keys.push(key)
        }
        key = meta_key.call(this, identifier);
        if (key) {
            keys.push(key)
        }
        return keys
    };
    var group_seed = function(identifier) {
        var seed = identifier.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === "everyone")) {
                seed = null
            }
        }
        return seed
    };
    Barrack.prototype.getBroadcastFounder = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".founder@anywhere")
        } else {
            return ID.FOUNDER
        }
    };
    Barrack.prototype.getBroadcastOwner = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".owner@anywhere")
        } else {
            return ID.ANYONE
        }
    };
    Barrack.prototype.getBroadcastMembers = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".member@anywhere")
        } else {
            return ID.ANYONE
        }
    };
    Barrack.prototype.getFounder = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastFounder(group)
        }
        var gMeta = this.getMeta(group);
        if (!gMeta) {
            return null
        }
        var members = this.getMembers(group);
        if (members != null) {
            var mMeta;
            for (var i = 0; i < members.length; ++i) {
                mMeta = this.getMeta(members[i]);
                if (!mMeta) {
                    continue
                }
                if (gMeta.matches(mMeta.getKey())) {
                    return members[i]
                }
            }
        }
        return null
    };
    Barrack.prototype.getOwner = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastOwner(group)
        }
        if (NetworkType.POLYLOGUE.equals(group.getType())) {
            return this.getFounder(group)
        }
        return null
    };
    Barrack.prototype.getMembers = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastMembers(group)
        }
        return null
    };
    Barrack.prototype.getAssistants = function(group) {
        var doc = this.getDocument(group, Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            if (doc.isValid()) {
                return doc.getAssistants()
            }
        }
        return null
    };
    ns.core.Barrack = Barrack;
    ns.core.registers("Barrack")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var Command = ns.protocol.Command;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var CorePacker = function(transceiver) {
        obj.call(this);
        this.__transceiver = transceiver
    };
    ns.Class(CorePacker, obj, [Transceiver.Packer]);
    CorePacker.prototype.getTransceiver = function() {
        return this.__transceiver
    };
    CorePacker.prototype.getOvertGroup = function(content) {
        var group = content.getGroup();
        if (!group) {
            return null
        }
        if (group.isBroadcast()) {
            return group
        }
        if (content instanceof Command) {
            return null
        }
        return group
    };
    CorePacker.prototype.encryptMessage = function(iMsg) {
        var transceiver = this.getTransceiver();
        if (!iMsg.getDelegate()) {
            iMsg.setDelegate(transceiver)
        }
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var group = transceiver.getOvertGroup(iMsg.getContent());
        var password;
        if (group) {
            password = transceiver.getCipherKey(sender, group, true)
        } else {
            password = transceiver.getCipherKey(sender, receiver, true)
        }
        var sMsg;
        if (receiver.isGroup()) {
            var grp = transceiver.getGroup(receiver);
            if (!grp) {
                return null
            }
            var members = grp.getMembers();
            if (!members || members.length === 0) {
                return null
            }
            sMsg = iMsg.encrypt(password, members)
        } else {
            sMsg = iMsg.encrypt(password, null)
        }
        if (!sMsg) {
            return null
        }
        if (group && !receiver.equals(group)) {
            sMsg.getEnvelope().setGroup(group)
        }
        sMsg.getEnvelope().setType(iMsg.getContent().getType());
        return sMsg
    };
    CorePacker.prototype.signMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.sign()
    };
    CorePacker.prototype.serializeMessage = function(rMsg) {
        return ns.format.JSON.encode(rMsg.getMap())
    };
    CorePacker.prototype.deserializeMessage = function(data) {
        var dict = ns.format.JSON.decode(data);
        return ReliableMessage.parse(dict)
    };
    CorePacker.prototype.verifyMessage = function(rMsg) {
        if (!rMsg.getDelegate()) {
            rMsg.setDelegate(this.getTransceiver())
        }
        return rMsg.verify()
    };
    CorePacker.prototype.decryptMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.decrypt()
    };
    ns.core.Packer = CorePacker;
    ns.core.registers("Packer")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var Envelope = ns.protocol.Envelope;
    var InstantMessage = ns.protocol.InstantMessage;
    var Transceiver = ns.Transceiver;
    var CoreProcessor = function(transceiver) {
        obj.call(this);
        this.__transceiver = transceiver
    };
    ns.Class(CoreProcessor, obj, [Transceiver.Processor]);
    CoreProcessor.prototype.getTransceiver = function() {
        return this.__transceiver
    };
    CoreProcessor.prototype.processData = function(data) {
        var transceiver = this.getTransceiver();
        var rMsg = transceiver.deserializeMessage(data);
        if (rMsg == null) {
            return null
        }
        rMsg = transceiver.processReliableMessage(rMsg);
        if (rMsg == null) {
            return null
        }
        return transceiver.serializeMessage(rMsg)
    };
    CoreProcessor.prototype.processReliableMessage = function(rMsg) {
        var transceiver = this.getTransceiver();
        var sMsg = transceiver.verifyMessage(rMsg);
        if (sMsg == null) {
            return null
        }
        sMsg = transceiver.processSecureMessage(sMsg, rMsg);
        if (sMsg == null) {
            return null
        }
        return transceiver.signMessage(sMsg)
    };
    CoreProcessor.prototype.processSecureMessage = function(sMsg, rMsg) {
        var transceiver = this.getTransceiver();
        var iMsg = transceiver.decryptMessage(sMsg);
        if (iMsg == null) {
            return null
        }
        iMsg = transceiver.processInstantMessage(iMsg, rMsg);
        if (iMsg == null) {
            return null
        }
        return transceiver.encryptMessage(iMsg)
    };
    CoreProcessor.prototype.processInstantMessage = function(iMsg, rMsg) {
        var transceiver = this.getTransceiver();
        var response = transceiver.processContent(iMsg.getContent(), rMsg);
        if (response == null) {
            return null
        }
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var user = transceiver.selectLocalUser(receiver);
        var env = Envelope.create(user.identifier, sender, null);
        return InstantMessage.create(env, response)
    };
    ns.core.Processor = CoreProcessor;
    ns.core.registers("Processor")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var CoreTransceiver = function() {
        obj.call(this);
        this.__barrack = null;
        this.__keycache = null;
        this.__packer = null;
        this.__processor = null
    };
    ns.Class(CoreTransceiver, obj, [Transceiver, InstantMessage.Delegate, ReliableMessage.Delegate]);
    CoreTransceiver.prototype.setEntityDelegate = function(barrack) {
        this.__barrack = barrack
    };
    CoreTransceiver.prototype.getEntityDelegate = function() {
        return this.__barrack
    };
    CoreTransceiver.prototype.selectLocalUser = function(receiver) {
        return this.getEntityDelegate().selectLocalUser(receiver)
    };
    CoreTransceiver.prototype.getUser = function(identifier) {
        return this.getEntityDelegate().getUser(identifier)
    };
    CoreTransceiver.prototype.getGroup = function(identifier) {
        return this.getEntityDelegate().getGroup(identifier)
    };
    CoreTransceiver.prototype.setCipherKeyDelegate = function(keyCache) {
        this.__keycache = keyCache
    };
    CoreTransceiver.prototype.getCipherKeyDelegate = function() {
        return this.__keycache
    };
    CoreTransceiver.prototype.getCipherKey = function(from, to, generate) {
        return this.getCipherKeyDelegate().getCipherKey(from, to, generate)
    };
    CoreTransceiver.prototype.cacheCipherKey = function(from, to, key) {
        return this.getCipherKeyDelegate().cacheCipherKey(from, to, key)
    };
    CoreTransceiver.prototype.setPacker = function(packer) {
        this.__packer = packer
    };
    CoreTransceiver.prototype.getPacker = function() {
        return this.__packer
    };
    CoreTransceiver.prototype.getOvertGroup = function(content) {
        return this.getPacker().getOvertGroup(content)
    };
    CoreTransceiver.prototype.encryptMessage = function(iMsg) {
        return this.getPacker().encryptMessage(iMsg)
    };
    CoreTransceiver.prototype.signMessage = function(sMsg) {
        return this.getPacker().signMessage(sMsg)
    };
    CoreTransceiver.prototype.serializeMessage = function(rMsg) {
        return this.getPacker().serializeMessage(rMsg)
    };
    CoreTransceiver.prototype.deserializeMessage = function(data) {
        return this.getPacker().deserializeMessage(data)
    };
    CoreTransceiver.prototype.verifyMessage = function(rMsg) {
        return this.getPacker().verifyMessage(rMsg)
    };
    CoreTransceiver.prototype.decryptMessage = function(sMsg) {
        return this.getPacker().decryptMessage(sMsg)
    };
    CoreTransceiver.prototype.setProcessor = function(processor) {
        this.__processor = processor
    };
    CoreTransceiver.prototype.getProcessor = function() {
        return this.__processor
    };
    CoreTransceiver.prototype.processData = function(data) {
        return this.getProcessor().processData(data)
    };
    CoreTransceiver.prototype.processReliableMessage = function(rMsg) {
        return this.getProcessor().processReliableMessage(rMsg)
    };
    CoreTransceiver.prototype.processSecureMessage = function(sMsg, rMsg) {
        return this.getProcessor().processSecureMessage(sMsg, rMsg)
    };
    CoreTransceiver.prototype.processInstantMessage = function(iMsg, rMsg) {
        return this.getProcessor().processInstantMessage(iMsg, rMsg)
    };
    CoreTransceiver.prototype.processContent = function(content, rMsg) {
        return this.getProcessor().processContent(content, rMsg)
    };
    var is_broadcast_msg = function(msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver()
        }
        return receiver.isBroadcast()
    };
    CoreTransceiver.prototype.serializeContent = function(content, pwd, iMsg) {
        return ns.format.JSON.encode(content.getMap())
    };
    CoreTransceiver.prototype.encryptContent = function(data, pwd, iMsg) {
        return pwd.encrypt(data)
    };
    CoreTransceiver.prototype.encodeData = function(data, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            return ns.format.UTF8.decode(data)
        }
        return ns.format.Base64.encode(data)
    };
    CoreTransceiver.prototype.serializeKey = function(pwd, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            return null
        }
        return ns.format.JSON.encode(pwd.getMap())
    };
    CoreTransceiver.prototype.encryptKey = function(data, receiver, iMsg) {
        var contact = this.getUser(receiver);
        return contact.encrypt(data)
    };
    CoreTransceiver.prototype.encodeKey = function(key, iMsg) {
        return ns.format.Base64.encode(key)
    };
    CoreTransceiver.prototype.decodeKey = function(key, sMsg) {
        return ns.format.Base64.decode(key)
    };
    CoreTransceiver.prototype.decryptKey = function(data, sender, receiver, sMsg) {
        var identifier = sMsg.getReceiver();
        var user = this.getUser(identifier);
        return user.decrypt(data)
    };
    CoreTransceiver.prototype.deserializeKey = function(data, sender, receiver, sMsg) {
        if (data) {
            var dict = ns.format.JSON.decode(data);
            return SymmetricKey.parse(dict)
        } else {
            return this.getCipherKey(sender, receiver, false)
        }
    };
    CoreTransceiver.prototype.decodeData = function(data, sMsg) {
        if (is_broadcast_msg(sMsg)) {
            return ns.format.UTF8.encode(data)
        }
        return ns.format.Base64.decode(data)
    };
    CoreTransceiver.prototype.decryptContent = function(data, pwd, sMsg) {
        return pwd.decrypt(data)
    };
    CoreTransceiver.prototype.deserializeContent = function(data, pwd, sMsg) {
        var dict = ns.format.JSON.decode(data);
        var content = Content.parse(dict);
        if (!is_broadcast_msg(sMsg)) {
            var sender = sMsg.getSender();
            var group = this.getOvertGroup(content);
            if (group) {
                this.cacheCipherKey(sender, group, pwd)
            } else {
                var receiver = sMsg.getReceiver();
                this.cacheCipherKey(sender, receiver, pwd)
            }
        }
        return content
    };
    CoreTransceiver.prototype.signData = function(data, sender, sMsg) {
        var user = this.getUser(sender);
        return user.sign(data)
    };
    CoreTransceiver.prototype.encodeSignature = function(signature, sMsg) {
        return ns.format.Base64.encode(signature)
    };
    CoreTransceiver.prototype.decodeSignature = function(signature, rMsg) {
        return ns.format.Base64.decode(signature)
    };
    CoreTransceiver.prototype.verifyDataSignature = function(data, signature, sender, rMsg) {
        var contact = this.getUser(sender);
        return contact.verify(data, signature)
    };
    ns.core.Transceiver = CoreTransceiver;
    ns.core.registers("Transceiver")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseContent = ns.dkd.BaseContent;
    var ContentFactory = function(clazz) {
        obj.call(this);
        this.__class = clazz
    };
    ns.Class(ContentFactory, obj, [Content.Factory]);
    ContentFactory.prototype.parseContent = function(content) {
        return new this.__class(content)
    };
    var CommandFactory = function(clazz) {
        obj.call(this);
        this.__class = clazz
    };
    ns.Class(CommandFactory, obj, [Command.Factory]);
    CommandFactory.prototype.parseCommand = function(content) {
        return new this.__class(content)
    };
    var GeneralCommandFactory = function() {
        obj.call(this)
    };
    ns.Class(GeneralCommandFactory, obj, [Content.Factory, Command.Factory]);
    GeneralCommandFactory.prototype.parseContent = function(content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            if (Content.getGroup(content)) {
                factory = Command.getFactory("group")
            }
            if (!factory) {
                factory = this
            }
        }
        return factory.parseCommand(content)
    };
    GeneralCommandFactory.prototype.parseCommand = function(cmd) {
        return new Command(cmd)
    };
    var HistoryCommandFactory = function() {
        GeneralCommandFactory.call(this)
    };
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);
    HistoryCommandFactory.prototype.parseCommand = function(cmd) {
        return new HistoryCommand(cmd)
    };
    var GroupCommandFactory = function() {
        HistoryCommandFactory.call(this)
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);
    GroupCommandFactory.prototype.parseContent = function(content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this
        }
        return factory.parseCommand(content)
    };
    GroupCommandFactory.prototype.parseCommand = function(cmd) {
        return new GroupCommand(cmd)
    };
    var registerContentFactories = function() {
        Content.register(ContentType.FORWARD, new ContentFactory(ns.protocol.ForwardContent));
        Content.register(ContentType.TEXT, new ContentFactory(ns.protocol.TextContent));
        Content.register(ContentType.FILE, new ContentFactory(ns.protocol.FileContent));
        Content.register(ContentType.IMAGE, new ContentFactory(ns.protocol.ImageContent));
        Content.register(ContentType.AUDIO, new ContentFactory(ns.protocol.AudioContent));
        Content.register(ContentType.VIDEO, new ContentFactory(ns.protocol.VideoContent));
        Content.register(ContentType.PAGE, new ContentFactory(ns.protocol.PageContent));
        Content.register(ContentType.MONEY, new ContentFactory(ns.protocol.MoneyContent));
        Content.register(ContentType.TRANSFER, new ContentFactory(ns.protocol.TransferContent));
        Content.register(ContentType.COMMAND, new GeneralCommandFactory());
        Content.register(ContentType.HISTORY, new HistoryCommandFactory());
        Content.register(0, new ContentFactory(BaseContent))
    };
    var registerCommandFactories = function() {
        Command.register(Command.META, new CommandFactory(ns.protocol.MetaCommand));
        var dpu = new CommandFactory(ns.protocol.DocumentCommand);
        Command.register(Command.DOCUMENT, dpu);
        Command.register("profile", dpu);
        Command.register("visa", dpu);
        Command.register("bulletin", dpu);
        Command.register("group", new GroupCommandFactory());
        Command.register(GroupCommand.INVITE, new CommandFactory(ns.protocol.group.InviteCommand));
        Command.register(GroupCommand.EXPEL, new CommandFactory(ns.protocol.group.ExpelCommand));
        Command.register(GroupCommand.JOIN, new CommandFactory(ns.protocol.group.JoinCommand));
        Command.register(GroupCommand.QUIT, new CommandFactory(ns.protocol.group.QuitCommand));
        Command.register(GroupCommand.QUERY, new CommandFactory(ns.protocol.group.QueryCommand));
        Command.register(GroupCommand.RESET, new CommandFactory(ns.protocol.group.ResetCommand))
    };
    var registerCoreFactories = function() {
        registerContentFactories();
        registerCommandFactories()
    };
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.registerAllFactories = registerCoreFactories;
    ns.core.registers("ContentFactory");
    ns.core.registers("CommandFactory");
    ns.core.registers("GeneralCommandFactory");
    ns.core.registers("HistoryCommandFactory");
    ns.core.registers("GroupCommandFactory");
    ns.core.registers("registerAllFactories")
})(DIMP);
