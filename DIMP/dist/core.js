/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 4, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    if (typeof ns.plugins !== "object") {
        ns.plugins = {}
    }
    if (typeof ns.core !== "object") {
        ns.core = {}
    }
    ns.Namespace(ns.protocol);
    ns.Namespace(ns.plugins);
    ns.Namespace(ns.core);
    ns.register("protocol");
    ns.register("plugins");
    ns.register("core")
})(DIMP, DaoKeDao);
(function(ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;
    var ForwardContent = function(info) {
        var secret;
        if (!info) {
            secret = null;
            info = {
                "type": ContentType.FORWARD
            }
        } else {
            if (info instanceof ReliableMessage) {
                secret = info;
                info = {
                    "type": ContentType.FORWARD
                };
                ForwardContent.setMessage(secret, info)
            } else {
                secret = null
            }
        }
        BaseContent.call(this, info);
        this.forward = secret
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
        if (!this.forward) {
            this.forward = ForwardContent.getMessage(this.getMap())
        }
        return this.forward
    };
    ForwardContent.prototype.setMessage = function(secret) {
        ForwardContent.setMessage(secret, this.getMap());
        this.forward = secret
    };
    Content.register(ContentType.FORWARD, ForwardContent);
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.register("ForwardContent")
})(DaoKeDao);
(function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;
    var FileContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FILE);
            this.filename = null;
            this.attachment = null
        } else {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0]);
                this.filename = null;
                this.attachment = null
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
                        throw SyntaxError("file content arguments error: " + arguments)
                    }
                }
            }
        }
        this.password = null
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
        if (!this.filename) {
            this.filename = FileContent.getFilename(this.getMap())
        }
        return this.filename
    };
    FileContent.prototype.setFilename = function(filename) {
        FileContent.setFilename(filename, this.getMap());
        this.filename = filename
    };
    FileContent.prototype.getData = function() {
        if (!this.attachment) {
            this.attachment = FileContent.getData(this.getMap())
        }
        return this.attachment
    };
    FileContent.prototype.setData = function(data) {
        FileContent.setData(data, this.getMap());
        this.attachment = data
    };
    FileContent.prototype.getPassword = function() {
        if (!this.password) {
            this.password = FileContent.getPassword(console)
        }
        return this.password
    };
    FileContent.prototype.setPassword = function(key) {
        FileContent.setPassword(key, this.getMap());
        this.password = key
    };
    Content.register(ContentType.FILE, FileContent);
    ns.protocol.FileContent = FileContent;
    ns.protocol.register("FileContent")
})(DIMP);
(function(ns) {
    var Content = ns.protocol.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function(content) {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.IMAGE)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1])
                } else {
                    throw SyntaxError("image content arguments error: " + arguments)
                }
            }
        }
        this.thumbnail = null
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
        if (!this.thumbnail) {
            this.thumbnail = ImageContent.getThumbnail(this.getMap())
        }
        return this.thumbnail
    };
    ImageContent.prototype.setThumbnail = function(image) {
        ImageContent.setThumbnail(image, this.getMap());
        this.thumbnail = image
    };
    Content.register(ContentType.IMAGE, ImageContent);
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.register("ImageContent")
})(DIMP);
(function(ns) {
    var Content = ns.protocol.Content;
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
                    throw SyntaxError("video content arguments error: " + arguments)
                }
            }
        }
        this.snapshot = null
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
        if (!this.snapshot) {
            this.snapshot = VideoContent.getSnapshot(this.getMap())
        }
        return this.snapshot
    };
    VideoContent.prototype.setSnapshot = function(image) {
        VideoContent.setSnapshot(image, this.getMap());
        this.snapshot = image
    };
    Content.register(ContentType.VIDEO, VideoContent);
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.register("VideoContent")
})(DIMP);
(function(ns) {
    var Content = ns.protocol.Content;
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
                    throw SyntaxError("audio content arguments error: " + arguments)
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
    Content.register(ContentType.AUDIO, AudioContent);
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.register("AudioContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;
    var TextContent = function(info) {
        if (!info) {
            info = {
                "type": ContentType.TEXT
            }
        } else {
            if (typeof info === "string") {
                info = {
                    "type": ContentType.TEXT,
                    "text": info
                }
            }
        }
        BaseContent.call(this, info)
    };
    ns.Class(TextContent, BaseContent, null);
    TextContent.prototype.getText = function() {
        return this.getValue("text")
    };
    TextContent.prototype.setText = function(text) {
        this.setValue("text", text)
    };
    Content.register(ContentType.TEXT, TextContent);
    ns.protocol.TextContent = TextContent;
    ns.protocol.register("TextContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;
    var PageContent = function() {
        var url, title, desc, icon;
        var content;
        if (arguments.length === 1) {
            content = arguments[0];
            icon = PageContent.getIcon(content)
        } else {
            if (arguments.length === 4) {
                content = {
                    "type": ContentType.PAGE
                };
                url = arguments[0];
                title = arguments[1];
                desc = arguments[2];
                icon = arguments[3];
                PageContent.setURL(url, content);
                PageContent.setTitle(title, content);
                PageContent.setDesc(desc, content);
                PageContent.setIcon(icon, content)
            }
        }
        BaseContent.call(this, content);
        this.icon = icon
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
        if (!this.icon) {
            this.icon = PageContent.getIcon(this.getMap())
        }
        return this.icon
    };
    PageContent.prototype.setIcon = function(image) {
        PageContent.setIcon(image, this.getMap());
        this.icon = image
    };
    Content.register(ContentType.PAGE, PageContent);
    ns.protocol.PageContent = PageContent;
    ns.protocol.register("PageContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var BaseContent = ns.BaseContent;
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
    Content.register(ContentType.MONEY, MoneyContent);
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.register("MoneyContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
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
    Content.register(ContentType.TRANSFER, TransferContent);
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.register("TransferContent")
})(DIMP);
(function(ns) {
    var Content = ns.protocol.Content;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var Command = function() {
        var cmd;
        if (arguments.length === 2) {
            var type = arguments[0];
            var name = arguments[1];
            if (type instanceof ContentType) {
                type = type.valueOf()
            }
            cmd = {
                "type": type
            };
            Command.setCommand(name, cmd)
        } else {
            if (typeof arguments[0] === "string") {
                cmd = {
                    "type": ContentType.COMMAND.valueOf()
                };
                Command.setCommand(arguments[0], cmd)
            }
        }
        BaseContent.call(this, cmd)
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
    Command.PROFILE = "profile";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    Content.register(ContentType.COMMAND, Command);
    ns.protocol.Command = Command;
    ns.protocol.register("Command")
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
            if (arguments[0] instanceof ID) {
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0])
            } else {
                Command.call(this, arguments[0]);
                this.identifier = null
            }
            this.meta = null
        } else {
            if (arguments.length === 2) {
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0]);
                this.setMeta(arguments[1])
            } else {
                if (arguments.length === 3) {
                    Command.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.setMeta(arguments[2])
                } else {
                    throw SyntaxError("meta command arguments error: " + arguments)
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
        if (!this.identifier) {
            this.identifier = MetaCommand.getIdentifier(this.getMap())
        }
        return this.identifier
    };
    MetaCommand.prototype.setIdentifier = function(identifier) {
        MetaCommand.setIdentifier(identifier, this.getMap());
        this.identifier = identifier
    };
    MetaCommand.prototype.getMeta = function() {
        if (!this.meta) {
            this.meta = MetaCommand.getMeta(this.getMap())
        }
        return this.meta
    };
    MetaCommand.prototype.setMeta = function(meta) {
        MetaCommand.setMeta(meta, this.getMap());
        this.meta = meta
    };
    MetaCommand.query = function(identifier) {
        return new MetaCommand(identifier)
    };
    MetaCommand.response = function(identifier, meta) {
        return new MetaCommand(identifier, meta)
    };
    Command.register(Command.META, MetaCommand);
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.register("MetaCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function() {
        if (arguments.length === 1) {
            if (arguments[0] instanceof ID) {
                MetaCommand.call(this, Command.PROFILE, arguments[0])
            } else {
                MetaCommand.call(this, arguments[0])
            }
            this.document = null
        } else {
            if (arguments.length === 2) {
                if (arguments[1] instanceof Meta) {
                    MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1])
                } else {
                    if (typeof arguments[1] === "string") {
                        MetaCommand.call(this, Command.PROFILE, arguments[0], null);
                        this.setSignature(arguments[1])
                    } else {
                        throw SyntaxError("document command arguments error: " + arguments)
                    }
                }
                this.document = null
            } else {
                if (arguments.length === 3) {
                    MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1]);
                    this.setDocument(arguments[2])
                } else {
                    throw SyntaxError("document command arguments error: " + arguments)
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
        if (!this.document) {
            this.document = DocumentCommand.getDocument(this.getMap())
        }
        return this.document
    };
    DocumentCommand.prototype.setDocument = function(doc) {
        DocumentCommand.setDocument(doc, this.getMap());
        this.document = doc
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
    Command.register(Command.DOCUMENT, DocumentCommand);
    Command.register(Command.PROFILE, DocumentCommand);
    ns.protocol.DocumentCommand = DocumentCommand;
    ns.protocol.register("DocumentCommand")
})(DIMP);
(function(ns) {
    var Content = ns.protocol.Content;
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
    Content.register(ContentType.HISTORY, HistoryCommand);
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.register("HistoryCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function() {
        if (arguments.length === 1) {
            HistoryCommand.call(this, arguments[0]);
            this.member = null;
            this.members = null
        } else {
            if (arguments.length === 2) {
                HistoryCommand.call(this, arguments[0]);
                this.setGroup(arguments[1]);
                this.member = null;
                this.members = null
            } else {
                if (arguments[2] instanceof Array) {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.member = null;
                    this.setMembers(arguments[2])
                } else {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.setMember(arguments[2]);
                    this.members = null
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
        if (!this.member) {
            this.member = GroupCommand.getMember(this.getMap())
        }
        return this.member
    };
    GroupCommand.prototype.setMember = function(identifier) {
        GroupCommand.setMembers(null, this.getMap());
        GroupCommand.setMember(identifier, this.getMap());
        this.member = identifier
    };
    GroupCommand.prototype.getMembers = function() {
        if (!this.members) {
            this.members = GroupCommand.getMembers(this.getMap())
        }
        return this.members
    };
    GroupCommand.prototype.setMembers = function(members) {
        GroupCommand.setMember(null, this.getMap());
        GroupCommand.setMembers(members, this.getMap());
        this.members = members
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
    ns.protocol.register("GroupCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function(info) {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.INVITE, arguments[0], arguments[1])
        }
    };
    ns.Class(InviteCommand, GroupCommand, null);
    var ExpelCommand = function(info) {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.EXPEL, arguments[0], arguments[1])
        }
    };
    ns.Class(ExpelCommand, GroupCommand, null);
    var JoinCommand = function(info) {
        if (arguments[0] instanceof ID) {
            GroupCommand.call(this, GroupCommand.JOIN, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(JoinCommand, GroupCommand, null);
    var QuitCommand = function(info) {
        if (arguments[0] instanceof ID) {
            GroupCommand.call(this, GroupCommand.QUIT, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(QuitCommand, GroupCommand, null);
    var ResetCommand = function(info) {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.RESET, arguments[0], arguments[1])
        }
    };
    ns.Class(ResetCommand, GroupCommand, null);
    var QueryCommand = function() {
        if (arguments[0] instanceof ID) {
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
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = {}
    }
    ns.Namespace(ns.protocol.group);
    ns.protocol.register("group");
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.register("InviteCommand");
    ns.protocol.group.register("ExpelCommand");
    ns.protocol.group.register("JoinCommand");
    ns.protocol.group.register("QuitCommand");
    ns.protocol.group.register("ResetCommand");
    ns.protocol.group.register("QueryCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Entity = function(identifier) {
        this.identifier = identifier;
        this.datasource = null
    };
    ns.Class(Entity, ns.type.Object, null);
    Entity.prototype.equals = function(other) {
        if (this === other) {
            return true
        } else {
            if (other instanceof Entity) {
                return this.identifier.equals(other.identifier)
            } else {
                if (other instanceof ID) {
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
        return this.datasource
    };
    Entity.prototype.getMeta = function() {
        return this.getDataSource().getMeta(this.identifier)
    };
    Entity.prototype.getDocument = function(type) {
        return this.getDataSource().getDocument(this.identifier, type)
    };
    ns.Entity = Entity;
    ns.register("Entity")
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
        if (doc instanceof Visa) {
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
            throw Error("failed to get verify keys for user: " + this.identifier)
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
            throw Error("failed to get encrypt key for user: " + this.identifier)
        }
        return key.encrypt(plaintext)
    };
    User.prototype.sign = function(data) {
        var key = this.getDataSource().getPrivateKeyForSignature(this.identifier);
        if (!key) {
            throw Error("failed to get sign key for user: " + this.identifier)
        }
        return key.sign(data)
    };
    User.prototype.decrypt = function(ciphertext) {
        var keys = this.getDataSource().getPrivateKeysForDecryption(this.identifier);
        if (!keys || keys.length === 0) {
            throw Error("failed to get decrypt keys for user: " + this.identifier)
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
            throw Error("failed to get sign key for user: " + this.identifier)
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
            throw Error("failed to get meta key for user: " + this.identifier)
        }
        return visa.verify(key)
    };
    ns.User = User;
    ns.register("User")
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
        this.founder = null
    };
    ns.Class(Group, Entity, null);
    Group.prototype.getBulletin = function() {
        var doc = this.getDocument(Document.BULLETIN);
        if (doc instanceof Bulletin) {
            return doc
        } else {
            return null
        }
    };
    Group.prototype.getFounder = function() {
        if (!this.founder) {
            this.founder = this.getDataSource().getFounder(this.identifier)
        }
        return this.founder
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
    ns.register("Group")
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
    ns.register("CipherKeyDelegate")
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
    ns.register("Transceiver")
})(DIMP);
(function(ns) {
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
        this.userMap = {};
        this.groupMap = {}
    };
    ns.Class(Barrack, ns.type.Object, [Entity.Delegate, User.DataSource, Group.DataSource]);
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
        finger = thanos(this.userMap, finger);
        finger = thanos(this.groupMap, finger);
        return finger >> 1
    };
    var cacheUser = function(user) {
        if (!user.getDelegate()) {
            user.setDelegate(this)
        }
        this.userMap[user.identifier.toString()] = user;
        return true
    };
    var cacheGroup = function(group) {
        if (!group.getDelegate()) {
            group.setDelegate(this)
        }
        this.groupMap[group.identifier.toString()] = group;
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
        var user = this.userMap[identifier.toString()];
        if (!user) {
            user = this.createUser(identifier);
            if (user) {
                cacheUser.call(this, user)
            }
        }
        return user
    };
    Barrack.prototype.getGroup = function(identifier) {
        var group = this.groupMap[identifier.toString()];
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
        if (doc instanceof Visa) {
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
        if (key instanceof EncryptKey) {
            return key
        }
        return null
    };
    Barrack.prototype.getPublicKeysForVerification = function(identifier) {
        var keys = [];
        var key = visa_key.call(this, identifier);
        if (key instanceof VerifyKey) {
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
        if (doc instanceof Bulletin) {
            if (doc.isValid()) {
                return doc.getAssistants()
            }
        }
        return null
    };
    ns.core.Barrack = Barrack;
    ns.core.register("Barrack")
})(DIMP);
(function(ns) {
    var Command = ns.protocol.Command;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var Packer = function(transceiver) {
        this.transceiver = transceiver
    };
    ns.Class(Packer, ns.type.Object, [Transceiver.Packer]);
    Packer.prototype.getTransceiver = function() {
        return this.transceiver
    };
    Packer.prototype.getOvertGroup = function(content) {
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
    Packer.prototype.encryptMessage = function(iMsg) {
        var transceiver = this.getTransceiver();
        if (!iMsg.getDelegate()) {
            iMsg.setDelegate(transceiver)
        }
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var group = transceiver.getOverGroup(iMsg.getContent());
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
    Packer.prototype.signMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.sign()
    };
    Packer.prototype.serializeMessage = function(rMsg) {
        return ns.format.JSON.encode(rMsg.getMap())
    };
    Packer.prototype.deserializeMessage = function(data) {
        var dict = ns.format.JSON.decode(data);
        return ReliableMessage.parse(dict)
    };
    Packer.prototype.verifyMessage = function(rMsg) {
        if (!rMsg.getDelegate()) {
            rMsg.setDelegate(this.getTransceiver())
        }
        return rMsg.verify()
    };
    Packer.prototype.decryptMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.decrypt()
    };
    ns.core.Packer = Packer;
    ns.core.register("Packer")
})(DIMP);
(function(ns) {
    var Envelope = ns.protocol.Envelope;
    var InstantMessage = ns.protocol.InstantMessage;
    var Transceiver = ns.Transceiver;
    var Processor = function(transceiver) {
        this.transceiver = transceiver
    };
    ns.Class(Processor, ns.type.Object, [Transceiver.Processor]);
    Processor.prototype.getTransceiver = function() {
        return this.transceiver
    };
    Processor.prototype.processData = function(data) {
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
    Processor.prototype.processReliableMessage = function(rMsg) {
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
    Processor.prototype.processSecureMessage = function(sMsg, rMsg) {
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
    Processor.prototype.processInstantMessage = function(iMsg, rMsg) {
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
    ns.core.Processor = Processor;
    ns.core.register("Processor")
})(DIMP);
(function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var CoreTransceiver = function() {
        this.entityDelegate = null;
        this.cipherKeyDelegate = null;
        this.parker = null;
        this.processor = null
    };
    ns.Class(CoreTransceiver, ns.type.Object, [Transceiver, InstantMessage.Delegate, ReliableMessage.Delegate]);
    CoreTransceiver.prototype.setEntityDelegate = function(barrack) {
        this.entityDelegate = barrack
    };
    CoreTransceiver.prototype.getEntityDelegate = function() {
        return this.entityDelegate
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
        this.cipherKeyDelegate = keyCache
    };
    CoreTransceiver.prototype.getCipherKeyDelegate = function() {
        return this.cipherKeyDelegate
    };
    CoreTransceiver.prototype.getCipherKey = function(from, to, generate) {
        return this.getCipherKeyDelegate().getCipherKey(from, to, generate)
    };
    CoreTransceiver.prototype.cacheCipherKey = function(from, to, key) {
        return this.getCipherKeyDelegate().cacheCipherKey(from, to, key)
    };
    CoreTransceiver.prototype.setPacker = function(packer) {
        this.parker = packer
    };
    CoreTransceiver.prototype.getPacker = function() {
        return this.parker
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
        this.processor = processor
    };
    CoreTransceiver.prototype.getProcessor = function() {
        return this.processor
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
        return ns.format.JSON.encode(pwd)
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
    ns.core.register("Transceiver")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var ContentFactory = function(className) {
        this.className = className
    };
    ns.Class(ContentFactory, null, [Content.Factory]);
    ContentFactory.prototype.parseContent = function(content) {
        return new this.className(content)
    };
    var CommandFactory = function(className) {
        this.className = className
    };
    ns.Class(CommandFactory, null, [Command.Factory]);
    CommandFactory.prototype.parseCommand = function(content) {
        return new this.className(content)
    };
    var GeneralCommandFactory = function() {};
    ns.Class(GeneralCommandFactory, null, [Content.Factory, Command.Factory]);
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
    var HistoryCommandFactory = function() {};
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);
    HistoryCommandFactory.prototype.parseCommand = function(cmd) {
        return new HistoryCommand(cmd)
    };
    var GroupCommandFactory = function() {};
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
        Content.register(0, new ContentFactory(ns.BaseContent))
    };
    var registerCommandFactories = function() {
        Command.register(Command.META, new CommandFactory(ns.protocol.MetaCommand));
        var dpu = new CommandFactory(ns.protocol.DocumentCommand);
        Command.register(Command.DOCUMENT, dpu);
        Command.register(Command.PROFILE, dpu);
        Command.register("group", new GroupCommandFactory());
        Command.register(GroupCommand.INVITE, new CommandFactory(ns.protocol.group.InviteCommand));
        Command.register(GroupCommand.EXPEL, new CommandFactory(ns.protocol.group.ExpelCommand));
        Command.register(GroupCommand.JOIN, new CommandFactory(ns.protocol.group.JoinCommand));
        Command.register(GroupCommand.QUIT, new CommandFactory(ns.protocol.group.QuitCommand));
        Command.register(GroupCommand.QUERY, new CommandFactory(ns.protocol.group.QueryCommand));
        Command.register(GroupCommand.RESET, new CommandFactory(ns.protocol.group.ResetCommand))
    };
    registerContentFactories();
    registerCommandFactories();
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.register("ContentFactory");
    ns.core.register("CommandFactory");
    ns.core.register("GeneralCommandFactory");
    ns.core.register("HistoryCommandFactory");
    ns.core.register("GroupCommandFactory")
})(DIMP);
