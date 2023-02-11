/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.2.2)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Feb. 11, 2023
 * @copyright (c) 2023 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== "object") {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== "object") {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = MONKEY.crypto;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = MingKeMing.protocol;
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = MingKeMing.mkm;
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = DaoKeDao.dkd;
    }
    if (typeof ns.dkd.cmd !== "object") {
        ns.dkd.cmd = {};
    }
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var TextContent = Interface(null, [Content]);
    TextContent.prototype.setText = function (text) {
        throw new Error("NotImplemented");
    };
    TextContent.prototype.getText = function () {
        throw new Error("NotImplemented");
    };
    TextContent.create = function (text) {
        return new ns.dkd.BaseTextContent(text);
    };
    ns.protocol.TextContent = TextContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var FileContent = Interface(null, [Content]);
    FileContent.prototype.setURL = function (url) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getURL = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getFilename = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setFilename = function (filename) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getData = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setData = function (data) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setPassword = function (key) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getPassword = function () {
        throw new Error("NotImplemented");
    };
    FileContent.file = function (filename, data) {
        return new ns.dkd.BaseFileContent(filename, data);
    };
    FileContent.image = function (filename, data) {
        return new ns.dkd.ImageFileContent(filename, data);
    };
    FileContent.audio = function (filename, data) {
        return new ns.dkd.AudioFileContent(filename, data);
    };
    FileContent.video = function (filename, data) {
        return new ns.dkd.VideoFileContent(filename, data);
    };
    ns.protocol.FileContent = FileContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = Interface(null, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        throw new Error("NotImplemented");
    };
    ImageContent.prototype.getThumbnail = function () {
        throw new Error("NotImplemented");
    };
    var VideoContent = Interface(null, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        throw new Error("NotImplemented");
    };
    VideoContent.prototype.getSnapshot = function () {
        throw new Error("NotImplemented");
    };
    var AudioContent = Interface(null, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        throw new Error("NotImplemented");
    };
    AudioContent.prototype.getText = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var PageContent = Interface(null, [Content]);
    PageContent.prototype.getURL = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setURL = function (url) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setTitle = function (title) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getTitle = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setDesc = function (text) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getDesc = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setIcon = function (image) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getIcon = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.PageContent = PageContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var MoneyContent = Interface(null, [Content]);
    MoneyContent.prototype.getCurrency = function () {
        throw new Error("NotImplemented");
    };
    MoneyContent.prototype.setAmount = function (amount) {
        throw new Error("NotImplemented");
    };
    MoneyContent.prototype.getAmount = function () {
        throw new Error("NotImplemented");
    };
    var TransferContent = Interface(null, [MoneyContent]);
    TransferContent.prototype.setRemitter = function (sender) {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.getRemitter = function () {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.setRemittee = function (receiver) {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.getRemittee = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ForwardContent = Interface(null, [Content]);
    ForwardContent.prototype.getForward = function () {
        throw new Error("NotImplemented");
    };
    ForwardContent.prototype.getSecrets = function () {
        throw new Error("NotImplemented");
    };
    ForwardContent.create = function (secrets) {
        return new ns.dkd.SecretContent(secrets);
    };
    ns.protocol.ForwardContent = ForwardContent;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ArrayContent = Interface(null, [Content]);
    ArrayContent.prototype.getContents = function () {
        throw new Error("NotImplemented");
    };
    ArrayContent.create = function (contents) {
        return new ns.dkd.ListContent(contents);
    };
    ns.protocol.ArrayContent = ArrayContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var CustomizedContent = Interface(null, [Content]);
    CustomizedContent.prototype.getApplication = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.prototype.getModule = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.prototype.getAction = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.create = function (contents) {
        return new ns.dkd.AppCustomizedContent(contents);
    };
    ns.protocol.CustomizedContent = CustomizedContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var Command = Interface(null, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.prototype.getCmd = function () {
        throw new Error("NotImplemented");
    };
    var CommandFactory = Interface(null, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        throw new Error("NotImplemented");
    };
    Command.Factory = CommandFactory;
    var general_factory = function () {
        var man = ns.dkd.cmd.FactoryManager;
        return man.generalFactory;
    };
    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory);
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd);
    };
    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command);
    };
    ns.protocol.Command = Command;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = Interface(null, [Command]);
    MetaCommand.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    MetaCommand.prototype.getMeta = function () {
        throw new Error("NotImplemented");
    };
    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier);
    };
    MetaCommand.response = function (identifier, meta) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier, meta);
    };
    ns.protocol.MetaCommand = MetaCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = Interface(null, [MetaCommand]);
    DocumentCommand.prototype.getDocument = function () {
        throw new Error("NotImplemented");
    };
    DocumentCommand.prototype.getSignature = function () {
        throw new Error("NotImplemented");
    };
    DocumentCommand.query = function (identifier, signature) {
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, meta, doc);
    };
    ns.protocol.DocumentCommand = DocumentCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var HistoryCommand = Interface(null, [Command]);
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = Interface(null, [HistoryCommand]);
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
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.getMember = function () {
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.setMembers = function (members) {
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.getMembers = function () {
        throw new Error("NotImplemented");
    };
    GroupCommand.invite = function (group, members) {
        return new ns.dkd.cmd.InviteGroupCommand(group, members);
    };
    GroupCommand.expel = function (group, members) {
        return new ns.dkd.cmd.ExpelGroupCommand(group, members);
    };
    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group);
    };
    GroupCommand.reset = function (group, members) {
        return new ns.dkd.cmd.ResetGroupCommand(group, members);
    };
    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group);
    };
    ns.protocol.GroupCommand = GroupCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = Interface(null, [GroupCommand]);
    var JoinCommand = Interface(null, [GroupCommand]);
    var QuitCommand = Interface(null, [GroupCommand]);
    var ResetCommand = Interface(null, [GroupCommand]);
    var QueryCommand = Interface(null, [GroupCommand]);
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseContent = function (info) {
        if (info instanceof ContentType) {
            info = info.valueOf();
        }
        var content, type, sn, time;
        if (typeof info === "number") {
            type = info;
            time = new Date();
            sn = InstantMessage.generateSerialNumber(type, time);
            content = { type: type, sn: sn, time: time.getTime() / 1000 };
        } else {
            content = info;
            type = 0;
            sn = 0;
            time = null;
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time;
    };
    Class(BaseContent, Dictionary, [Content], {
        getType: function () {
            if (this.__type === 0) {
                this.__type = this.getNumber("type");
            }
            return this.__type;
        },
        getSerialNumber: function () {
            if (this.__sn === 0) {
                this.__sn = this.getNumber("sn");
            }
            return this.__sn;
        },
        getTime: function () {
            if (this.__time === null) {
                this.__time = get_time(this, "time");
            }
            return this.__time;
        },
        getGroup: function () {
            var group = this.getValue("group");
            return ID.parse(group);
        },
        setGroup: function (identifier) {
            this.setString("group", identifier);
        }
    });
    var get_time = function (dict, key) {
        return Dictionary.prototype.getTime.call(dict, key);
    };
    ns.dkd.BaseContent = BaseContent;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function () {
        if (typeof arguments[0] === "string") {
            BaseContent.call(this, ContentType.TEXT);
            this.setText(arguments[0]);
        } else {
            BaseContent.call(this, arguments[0]);
        }
    };
    Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getString("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
    ns.dkd.BaseTextContent = BaseTextContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function () {
        var filename = null;
        var data = null;
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(this, ContentType.FILE);
                filename = arguments[0];
                data = arguments[1];
            } else {
                if (arguments.length === 3) {
                    BaseContent.call(this, arguments[0]);
                    filename = arguments[1];
                    data = arguments[2];
                } else {
                    throw new SyntaxError("File content arguments error: " + arguments);
                }
            }
        }
        if (filename) {
            this.setValue("filename", filename);
        }
        if (data) {
            var base64 = null;
            if (typeof data === "string") {
                base64 = data;
                data = null;
            } else {
                if (data instanceof Uint8Array) {
                    base64 = Base64.encode(data);
                } else {
                    throw TypeError("file data error: " + typeof data);
                }
            }
            this.setValue("data", base64);
        }
        this.__data = data;
        this.__password = null;
    };
    Class(BaseFileContent, BaseContent, [FileContent], {
        setURL: function (url) {
            this.setValue("URL", url);
        },
        getURL: function () {
            return this.getString("URL");
        },
        setFilename: function (filename) {
            this.setValue("filename");
        },
        getFilename: function () {
            return this.getString("filename");
        },
        setData: function (data) {
            if (data && data.length > 0) {
                this.setValue("data", Base64.encode(data));
            } else {
                this.removeValue("data");
            }
            this.__data = data;
        },
        getData: function () {
            if (this.__data === null) {
                var base64 = this.getString("data");
                if (base64) {
                    this.__data = Base64.decode(base64);
                }
            }
            return this.__data;
        },
        setPassword: function (key) {
            this.setMap("password", key);
            this.__password = key;
        },
        getPassword: function () {
            if (this.__password === null) {
                var key = this.getValue("password");
                this.__password = SymmetricKey.parse(key);
            }
            return this.__password;
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function () {
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
                throw new SyntaxError("Image content arguments error: " + arguments);
            }
        }
        this.__thumbnail = null;
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            if (this.__thumbnail === null) {
                var base64 = this.getString("thumbnail");
                if (base64) {
                    this.__thumbnail = Base64.decode(base64);
                }
            }
            return this.__thumbnail;
        },
        setThumbnail: function (image) {
            if (image && image.length > 0) {
                this.setValue("thumbnail", Base64.encode(image));
            } else {
                this.removeValue("thumbnail");
            }
            this.__thumbnail = image;
        }
    });
    var VideoFileContent = function () {
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
                throw new SyntaxError("Video content arguments error: " + arguments);
            }
        }
        this.__snapshot = null;
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            if (this.__snapshot === null) {
                var base64 = this.getString("snapshot");
                if (base64) {
                    this.__snapshot = Base64.decode(base64);
                }
            }
            return this.__snapshot;
        },
        setSnapshot: function (image) {
            if (image && image.length > 0) {
                this.setValue("snapshot", Base64.encode(image));
            } else {
                this.removeValue("snapshot");
            }
            this.__snapshot = image;
        }
    });
    var AudioFileContent = function () {
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
                throw new SyntaxError("Audio content arguments error: " + arguments);
            }
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getString("text");
        },
        setText: function (asr) {
            this.setValue("text", asr);
        }
    });
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
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
                this.__icon = null;
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3]);
            } else {
                throw new SyntaxError("Web page content arguments error: " + arguments);
            }
        }
    };
    Class(WebPageContent, BaseContent, [PageContent], {
        getURL: function () {
            return this.getString("URL");
        },
        setURL: function (url) {
            this.setValue("URL", url);
        },
        getTitle: function () {
            return this.getString("title");
        },
        setTitle: function (title) {
            this.setValue("title", title);
        },
        getDesc: function () {
            return this.getString("desc");
        },
        setDesc: function (text) {
            this.setValue("desc", text);
        },
        getIcon: function () {
            if (this.__icon === null) {
                var base64 = this.getString("icon");
                if (base64) {
                    this.__icon = Base64.decode(base64);
                }
            }
            return this.__icon;
        },
        setIcon: function (image) {
            if (image && image.length > 0) {
                this.setValue("icon", Base64.encode(image));
            } else {
                this.removeValue("icon");
            }
            this.__icon = image;
        }
    });
    ns.dkd.WebPageContent = WebPageContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1]);
            } else {
                if (arguments.length === 3) {
                    BaseContent.call(arguments[0]);
                    this.setCurrency(arguments[1]);
                    this.setAmount(arguments[2]);
                } else {
                    throw new SyntaxError("money content arguments error: " + arguments);
                }
            }
        }
    };
    Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            this.setValue("currency", currency);
        },
        getCurrency: function () {
            return this.getString("currency");
        },
        setAmount: function (amount) {
            this.setValue("amount", amount);
        },
        getAmount: function () {
            return this.getNumber("amount");
        }
    });
    var TransferMoneyContent = function () {
        if (arguments.length === 1) {
            MoneyContent.call(arguments[0]);
        } else {
            if (arguments.length === 2) {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
            } else {
                throw new SyntaxError("money content arguments error: " + arguments);
            }
        }
    };
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getRemitter: function () {
            var sender = this.getValue("remitter");
            return ID.parse(sender);
        },
        setRemitter: function (sender) {
            this.setString("remitter", sender);
        },
        getRemittee: function () {
            var receiver = this.getValue("remittee");
            return ID.parse(receiver);
        },
        setRemittee: function (receiver) {
            this.setString("remittee", receiver);
        }
    });
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;
    var SecretContent = function () {
        var info = arguments[0];
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info;
        } else {
            if (Interface.conforms(info, ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                forward = info;
            } else {
                BaseContent.call(this, info);
            }
        }
        if (forward) {
            this.setMap("forward", forward);
        } else {
            if (secrets) {
                var array = SecretContent.revert(secrets);
                this.setValue("secrets", array);
            }
        }
        this.__forward = forward;
        this.__secrets = secrets;
    };
    Class(SecretContent, BaseContent, [ForwardContent], {
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue("forward");
                this.__forward = ReliableMessage.parse(forward);
            }
            return this.__forward;
        },
        getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue("secrets");
                if (array) {
                    this.__secrets = SecretContent.convert(array);
                } else {
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg);
                    }
                }
            }
            return this.__secrets;
        }
    });
    SecretContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg);
            }
        }
        return array;
    };
    SecretContent.revert = function (messages) {
        var array = [];
        for (var i = 0; i < messages.length; ++i) {
            array.push(messages[i].toMap());
        }
        return array;
    };
    ns.dkd.SecretContent = SecretContent;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var ArrayContent = ns.protocol.ArrayContent;
    var BaseContent = ns.dkd.BaseContent;
    var ListContent = function () {
        var info = arguments[0];
        var list;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue("contents", ListContent.revert(list));
        } else {
            BaseContent.call(this, arguments[0]);
            list = null;
        }
        this.__list = list;
    };
    Class(ListContent, BaseContent, [ArrayContent], {
        getContents: function () {
            if (this.__list === null) {
                var array = this.getValue("contents");
                if (array) {
                    this.__list = ListContent.convert(array);
                } else {
                    this.__list = [];
                }
            }
            return this.__list;
        }
    });
    ListContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item);
            }
        }
        return array;
    };
    ListContent.revert = function (contents) {
        var array = [];
        for (var i = 0; i < contents.length; ++i) {
            array.push(contents[i].toMap());
        }
        return array;
    };
    ns.dkd.ListContent = ListContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var CustomizedContent = ns.protocol.CustomizedContent;
    var BaseContent = ns.dkd.BaseContent;
    var AppCustomizedContent = function () {
        var app = null;
        var mod = null;
        var act = null;
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
        } else {
            if (arguments.length === 3) {
                BaseContent.call(this, ContentType.CUSTOMIZED);
                app = arguments[0];
                mod = arguments[1];
                act = arguments[2];
            } else {
                BaseContent.call(this, arguments[0]);
                app = arguments[1];
                mod = arguments[2];
                act = arguments[3];
            }
        }
        if (app) {
            this.setValue("app", app);
        }
        if (mod) {
            this.setValue("mod", mod);
        }
        if (act) {
            this.setValue("act", act);
        }
    };
    Class(AppCustomizedContent, BaseContent, [CustomizedContent], {
        getApplication: function () {
            return this.getString("app");
        },
        getModule: function () {
            return this.getString("mod");
        },
        getAction: function () {
            return this.getString("act");
        }
    });
    ns.dkd.AppCustomizedContent = AppCustomizedContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue("cmd", arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setValue("cmd", arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    Class(BaseCommand, BaseContent, [Command], {
        getCmd: function () {
            return this.getString("cmd");
        }
    });
    ns.dkd.cmd.BaseCommand = BaseCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseMetaCommand = function () {
        var identifier = null;
        var meta = null;
        if (arguments.length === 3) {
            BaseCommand.call(this, arguments[0]);
            identifier = arguments[1];
            meta = arguments[2];
        } else {
            if (arguments.length === 2) {
                BaseCommand.call(this, Command.META);
                identifier = arguments[0];
                meta = arguments[1];
            } else {
                if (Interface.conforms(arguments[0], ID)) {
                    BaseCommand.call(this, Command.META);
                    identifier = arguments[0];
                } else {
                    BaseCommand.call(this, arguments[0]);
                }
            }
        }
        if (identifier) {
            this.setString("ID", identifier);
        }
        if (meta) {
            this.setMap("meta", meta);
        }
        this.__identifier = identifier;
        this.__meta = meta;
    };
    Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("ID");
                this.__identifier = ID.parse(identifier);
            }
            return this.__identifier;
        },
        getMeta: function () {
            if (this.__meta === null) {
                var meta = this.getValue("meta");
                this.__meta = Meta.parse(meta);
            }
            return this.__meta;
        }
    });
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.cmd.BaseMetaCommand;
    var BaseDocumentCommand = function () {
        var doc = null;
        var sig = null;
        if (arguments.length === 1) {
            if (Interface.conforms(arguments[0], ID)) {
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
            } else {
                BaseMetaCommand.call(this, arguments[0]);
            }
        } else {
            if (arguments.length === 2) {
                if (Interface.conforms(arguments[1], Document)) {
                    BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                    doc = arguments[1];
                } else {
                    if (typeof arguments[1] === "string") {
                        BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                        sig = arguments[1];
                    } else {
                        throw new SyntaxError(
                            "document command arguments error: " + arguments
                        );
                    }
                }
            } else {
                if (arguments.length === 3) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                    doc = arguments[2];
                } else {
                    throw new SyntaxError(
                        "document command arguments error: " + arguments
                    );
                }
            }
        }
        if (doc) {
            this.setMap("document", doc);
        }
        if (sig) {
            this.setValue("signature", sig);
        }
        this.__document = doc;
    };
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        getDocument: function () {
            if (this.__document === null) {
                var doc = this.getValue("document");
                this.__document = Document.parse(doc);
            }
            return this.__document;
        },
        getSignature: function () {
            return this.getString("signature");
        }
    });
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (typeof arguments[0] === "string") {
            BaseCommand.call(this, ContentType.HISTORY, arguments[0]);
        } else {
            BaseCommand.call(this, arguments[0]);
        }
    };
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);
    ns.dkd.cmd.BaseHistoryCommand = BaseHistoryCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseHistoryCommand = ns.dkd.BaseHistoryCommand;
    var BaseGroupCommand = function () {
        var group = null;
        var member = null;
        var members = null;
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseHistoryCommand.call(this, arguments[0]);
                group = arguments[1];
            } else {
                if (arguments[2] instanceof Array) {
                    BaseHistoryCommand.call(this, arguments[0]);
                    group = arguments[1];
                    members = arguments[2];
                } else {
                    if (Interface.conforms(arguments[2], ID)) {
                        BaseHistoryCommand.call(this, arguments[0]);
                        group = arguments[1];
                        member = arguments[2];
                    } else {
                        throw new SyntaxError(
                            "Group command arguments error: " + arguments
                        );
                    }
                }
            }
        }
        if (group) {
            this.setGroup(group);
        }
        if (member) {
            this.setMember(member);
        } else {
            if (members) {
                this.setMembers(members);
            }
        }
        this.__member = member;
        this.__members = members;
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            this.setString("member", identifier);
            this.__member = identifier;
        },
        getMember: function () {
            if (this.__member === null) {
                var member = this.getValue("member");
                this.__member = ID.parse(member);
            }
            return this.__member;
        },
        setMembers: function (members) {
            if (members) {
                var array = ID.revert(members);
                this.setValue("members", array);
            } else {
                this.removeValue("members");
            }
            this.__members = members;
        },
        getMembers: function () {
            if (this.__members === null) {
                var array = this.getValue("members");
                if (array) {
                    this.__members = ID.convert(array);
                }
            }
            return this.__members;
        }
    });
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
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
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);
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
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);
    var JoinGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);
    var QuitGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);
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
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);
    var QueryGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var Command = ns.protocol.Command;
    var GeneralContentFactory = ns.dkd.GeneralFactory;
    var GeneralFactory = function () {
        this.__commandFactories = {};
    };
    Class(GeneralFactory, GeneralContentFactory, null, {
        setCommandFactory: function (cmd, factory) {
            this.__commandFactories[cmd] = factory;
        },
        getCommandFactory: function (cmd) {
            return this.__commandFactories[cmd];
        },
        getCmd: function (command) {
            return command["cmd"];
        },
        parseCommand: function (command) {
            if (!command) {
                return null;
            } else {
                if (Interface.conforms(command, Command)) {
                    return command;
                }
            }
            command = Wrapper.fetchMap(command);
            var cmd = this.getCmd(command);
            var factory = this.getCommandFactory(cmd);
            if (!factory) {
                var type = this.getContentType(command);
                factory = this.getContentFactory(type);
            }
            return factory.parseContent(command);
        }
    });
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.dkd.cmd.GeneralFactory = GeneralFactory;
    ns.dkd.cmd.FactoryManager = FactoryManager;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = null;
            to = null;
            when = null;
        } else {
            if (arguments.length === 2) {
                from = arguments[0];
                to = arguments[1];
                when = new Date();
                env = {
                    sender: from.toString(),
                    receiver: to.toString(),
                    time: when.getTime() / 1000
                };
            } else {
                if (arguments.length === 3) {
                    from = arguments[0];
                    to = arguments[1];
                    when = arguments[2];
                    if (!when) {
                        when = new Date();
                    } else {
                        if (typeof when === "number") {
                            when = new Date(when * 1000);
                        }
                    }
                    env = {
                        sender: from.toString(),
                        receiver: to.toString(),
                        time: when.getTime() / 1000
                    };
                } else {
                    throw new SyntaxError("envelope arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when;
    };
    Class(MessageEnvelope, Dictionary, [Envelope], {
        getSender: function () {
            if (this.__sender === null) {
                this.__sender = get_id(this, "sender");
            }
            return this.__sender;
        },
        getReceiver: function () {
            if (this.__receiver === null) {
                this.__receiver = get_id(this, "receiver");
            }
            return this.__receiver;
        },
        getTime: function () {
            if (this.__time === null) {
                this.__time = get_time(this, "time");
            }
            return this.__time;
        },
        getGroup: function () {
            return get_id(this, "group");
        },
        setGroup: function (identifier) {
            this.setString("group", identifier);
        },
        getType: function () {
            return this.getNumber("type");
        },
        setType: function (type) {
            this.setValue("type", type);
        }
    });
    var get_id = function (dict, key) {
        return ID.parse(this.getValue(key));
    };
    var get_time = function (dict, key) {
        return Dictionary.prototype.getTime.call(dict, key);
    };
    ns.dkd.MessageEnvelope = MessageEnvelope;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = ns.dkd.MessageEnvelope;
    var EnvelopeFactory = function () {
        Object.call(this);
    };
    Class(EnvelopeFactory, Object, [Envelope.Factory], null);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        return new MessageEnvelope(from, to, when);
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        if (!env["sender"]) {
            return null;
        }
        return new MessageEnvelope(env);
    };
    ns.dkd.EnvelopeFactory = EnvelopeFactory;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap();
        }
        Dictionary.call(this, msg);
        this.__envelope = env;
        this.__delegate = null;
    };
    Class(BaseMessage, Dictionary, [Message], {
        getDelegate: function () {
            return this.__delegate;
        },
        setDelegate: function (delegate) {
            this.__delegate = delegate;
        },
        getEnvelope: function () {
            if (this.__envelope === null) {
                this.__envelope = Envelope.parse(this.toMap());
            }
            return this.__envelope;
        },
        getSender: function () {
            var env = this.getEnvelope();
            return env.getSender();
        },
        getReceiver: function () {
            var env = this.getEnvelope();
            return env.getReceiver();
        },
        getTime: function () {
            var env = this.getEnvelope();
            return env.getTime();
        },
        getGroup: function () {
            var env = this.getEnvelope();
            return env.getGroup();
        },
        getType: function () {
            var env = this.getEnvelope();
            return env.getTime();
        }
    });
    ns.dkd.BaseMessage = BaseMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.dkd.BaseMessage;
    var PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = null;
            body = null;
        } else {
            if (arguments.length === 2) {
                head = arguments[0];
                body = arguments[1];
                msg = head.toMap();
                msg["content"] = body.toMap();
            } else {
                throw new SyntaxError("message arguments error: " + arguments);
            }
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body;
    };
    Class(PlainMessage, BaseMessage, [InstantMessage], {
        getContent: function () {
            if (this.__content === null) {
                this.__content = Content.parse(this.getValue("content"));
            }
            return this.__content;
        },
        getTime: function () {
            var content = this.getContent();
            var time = content.getTime();
            if (time) {
                return time;
            } else {
                var env = this.getEnvelope();
                return env.getTime();
            }
        },
        getGroup: function () {
            var content = this.getContent();
            return content.getGroup();
        },
        getType: function () {
            var content = this.getContent();
            return content.getType();
        },
        encrypt: function (password, members) {
            if (members && members.length > 0) {
                return encrypt_group_message.call(this, password, members);
            } else {
                return encrypt_message.call(this, password);
            }
        }
    });
    var encrypt_message = function (password) {
        var msg = prepare_data.call(this, password);
        var delegate = this.getDelegate();
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg);
        }
        var data = delegate.encryptKey(key, this.getReceiver(), this);
        if (!data) {
            return null;
        }
        msg["key"] = delegate.encodeKey(data, this);
        return SecureMessage.parse(msg);
    };
    var encrypt_group_message = function (password, members) {
        var msg = prepare_data.call(this, password);
        var delegate = this.getDelegate();
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg);
        }
        var keys = {};
        var count = 0;
        var member;
        var data;
        for (var i = 0; i < members.length; ++i) {
            member = members[i];
            data = delegate.encryptKey(key, member, this);
            if (!data) {
                continue;
            }
            keys[member.toString()] = delegate.encodeKey(data, this);
            ++count;
        }
        if (count > 0) {
            msg["keys"] = keys;
        }
        return SecureMessage.parse(msg);
    };
    var prepare_data = function (password) {
        var delegate = this.getDelegate();
        var data = delegate.serializeContent(this.getContent(), password, this);
        data = delegate.encryptContent(data, password, this);
        var base64 = delegate.encodeData(data, this);
        var msg = this.copyMap(false);
        delete msg["content"];
        msg["data"] = base64;
        return msg;
    };
    ns.dkd.PlainMessage = PlainMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var InstantMessage = ns.protocol.InstantMessage;
    var PlainMessage = ns.dkd.PlainMessage;
    var InstantMessageFactory = function () {
        Object.call(this);
        this.__sn = randomPositiveInteger();
    };
    Class(InstantMessageFactory, Object, [InstantMessage.Factory], null);
    var MAX_SN = 2147483647;
    var randomPositiveInteger = function () {
        var sn = Math.ceil(Math.random() * MAX_SN);
        if (sn > 0) {
            return sn;
        } else {
            if (sn < 0) {
                return -sn;
            }
        }
        return 9527 + 9394;
    };
    var next = function () {
        if (this.__sn < MAX_SN) {
            this.__sn += 1;
        } else {
            this.__sn = 1;
        }
        return this.__sn;
    };
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        return next.call(this);
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        return new PlainMessage(head, body);
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        if (!msg["sender"] || !msg["content"]) {
            return null;
        }
        return new PlainMessage(msg);
    };
    ns.dkd.InstantMessageFactory = InstantMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Copier = ns.type.Copier;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.dkd.BaseMessage;
    var EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null;
    };
    Class(EncryptedMessage, BaseMessage, [SecureMessage], {
        getData: function () {
            if (this.__data === null) {
                var base64 = this.getValue("data");
                var delegate = this.getDelegate();
                this.__data = delegate.decodeData(base64, this);
            }
            return this.__data;
        },
        getEncryptedKey: function () {
            if (this.__key === null) {
                var base64 = this.getValue("key");
                if (!base64) {
                    var keys = this.getEncryptedKeys();
                    if (keys) {
                        var receiver = this.getReceiver();
                        base64 = keys[receiver.toString()];
                    }
                }
                if (base64) {
                    var delegate = this.getDelegate();
                    this.__key = delegate.decodeKey(base64, this);
                }
            }
            return this.__key;
        },
        getEncryptedKeys: function () {
            if (this.__keys === null) {
                this.__keys = this.getValue("keys");
            }
            return this.__keys;
        },
        decrypt: function () {
            var sender = this.getSender();
            var receiver;
            var group = this.getGroup();
            if (group) {
                receiver = group;
            } else {
                receiver = this.getReceiver();
            }
            var delegate = this.getDelegate();
            var key = this.getEncryptedKey();
            if (key) {
                key = delegate.decryptKey(key, sender, receiver, this);
                if (!key) {
                    throw new Error("failed to decrypt key in msg: " + this);
                }
            }
            var password = delegate.deserializeKey(key, sender, receiver, this);
            if (!password) {
                throw new Error(
                    "failed to get msg key: " + sender + " -> " + receiver + ", " + key
                );
            }
            var data = this.getData();
            if (!data) {
                throw new Error("failed to decode content data: " + this);
            }
            data = delegate.decryptContent(data, password, this);
            if (!data) {
                throw new Error("failed to decrypt data with key: " + password);
            }
            var content = delegate.deserializeContent(data, password, this);
            if (!content) {
                throw new Error("failed to deserialize content: " + data);
            }
            var msg = this.copyMap(false);
            delete msg["key"];
            delete msg["keys"];
            delete msg["data"];
            msg["content"] = content.toMap();
            return InstantMessage.parse(msg);
        },
        sign: function () {
            var delegate = this.getDelegate();
            var signature = delegate.signData(this.getData(), this.getSender(), this);
            var base64 = delegate.encodeSignature(signature, this);
            var msg = this.copyMap(false);
            msg["signature"] = base64;
            return ReliableMessage.parse(msg);
        },
        split: function (members) {
            var msg = this.copyMap(false);
            var keys = this.getEncryptedKeys();
            if (keys) {
                delete msg["keys"];
            } else {
                keys = {};
            }
            msg["group"] = this.getReceiver().toString();
            var messages = [];
            var base64;
            var item;
            var receiver;
            for (var i = 0; i < members.length; ++i) {
                receiver = members[i].toString();
                msg["receiver"] = receiver;
                base64 = keys[receiver];
                if (base64) {
                    msg["key"] = base64;
                } else {
                    delete msg["key"];
                }
                item = SecureMessage.parse(Copier.copyMap(msg));
                if (item) {
                    messages.push(item);
                }
            }
            return messages;
        },
        trim: function (member) {
            var msg = this.copyMap(false);
            var keys = this.getEncryptedKeys();
            if (keys) {
                var base64 = keys[member.toString()];
                if (base64) {
                    msg["key"] = base64;
                }
                delete msg["keys"];
            }
            var group = this.getGroup();
            if (!group) {
                msg["group"] = this.getReceiver().toString();
            }
            msg["receiver"] = member.toString();
            return SecureMessage.parse(msg);
        }
    });
    ns.dkd.EncryptedMessage = EncryptedMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var SecureMessage = ns.protocol.SecureMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var SecureMessageFactory = function () {
        Object.call(this);
    };
    Class(SecureMessageFactory, Object, [SecureMessage.Factory], null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        if (!msg["sender"] || !msg["data"]) {
            return null;
        }
        if (msg["signature"]) {
            return new NetworkMessage(msg);
        }
        return new EncryptedMessage(msg);
    };
    ns.dkd.SecureMessageFactory = SecureMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Meta = ns.protocol.Meta;
    var Visa = ns.protocol.Visa;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null;
        this.__meta = null;
        this.__visa = null;
    };
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {
        getSignature: function () {
            if (this.__signature === null) {
                var base64 = this.getValue("signature");
                var delegate = this.getDelegate();
                this.__signature = delegate.decodeSignature(base64, this);
            }
            return this.__signature;
        },
        setMeta: function (meta) {
            this.setMap("meta", meta);
            this.__meta = meta;
        },
        getMeta: function () {
            if (this.__meta === null) {
                var dict = this.getValue("meta");
                this.__meta = Meta.parse(dict);
            }
            return this.__meta;
        },
        setVisa: function (visa) {
            this.setMap("visa", visa);
            this.__visa = visa;
        },
        getVisa: function () {
            if (this.__visa === null) {
                var dict = this.getValue("visa");
                this.__visa = Visa.parse(dict);
            }
            return this.__visa;
        },
        verify: function () {
            var data = this.getData();
            if (!data) {
                throw new Error("failed to decode content data: " + this);
            }
            var signature = this.getSignature();
            if (!signature) {
                throw new Error("failed to decode message signature: " + this);
            }
            var delegate = this.getDelegate();
            if (
                delegate.verifyDataSignature(data, signature, this.getSender(), this)
            ) {
                var msg = this.copyMap(false);
                delete msg["signature"];
                return SecureMessage.parse(msg);
            } else {
                return null;
            }
        }
    });
    ns.dkd.NetworkMessage = NetworkMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var ReliableMessageFactory = function () {
        Object.call(this);
    };
    Class(ReliableMessageFactory, Object, [ReliableMessage.Factory], null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        if (!msg["sender"] || !msg["data"] || !msg["signature"]) {
            return null;
        }
        return new NetworkMessage(msg);
    };
    ns.dkd.ReliableMessageFactory = ReliableMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Address = ns.protocol.Address;
    var AddressFactory = function () {
        Object.call(this);
        this.__addresses = {};
    };
    Class(AddressFactory, Object, [Address.Factory], null);
    AddressFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__addresses, finger);
        return finger >> 1;
    };
    AddressFactory.prototype.generateAddress = function (meta, network) {
        var address = meta.generateAddress(network);
        if (address) {
            this.__addresses[address.toString()] = address;
        }
        return address;
    };
    AddressFactory.prototype.parseAddress = function (string) {
        var address = this.__addresses[string];
        if (!address) {
            address = Address.create(string);
            if (address) {
                this.__addresses[string] = address;
            }
        }
        return address;
    };
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            finger += 1;
            if ((finger & 1) === 1) {
                delete planet[k];
            }
        }
        return finger;
    };
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.thanos = thanos;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;
    var IDFactory = function () {
        Object.call(this);
        this.__identifiers = {};
    };
    Class(IDFactory, Object, [ID.Factory], null);
    IDFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__identifiers, finger);
        return finger >> 1;
    };
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        var address = Address.generate(meta, network);
        return ID.create(meta.getSeed(), address, terminal);
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = this.newID(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    };
    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = this.parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };
    IDFactory.prototype.newID = function (string, name, address, terminal) {
        return new Identifier(string, name, address, terminal);
    };
    IDFactory.prototype.parse = function (string) {
        var name, address, terminal;
        var pair = string.split("/");
        if (pair.length === 1) {
            terminal = null;
        } else {
            terminal = pair[1];
        }
        pair = pair[0].split("@");
        if (pair.length === 1) {
            name = null;
            address = Address.parse(pair[0]);
        } else {
            name = pair[0];
            address = Address.parse(pair[1]);
        }
        if (!address) {
            return null;
        }
        return this.newID(string, name, address, terminal);
    };
    var concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + "@" + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + "/" + terminal;
        }
        return string;
    };
    ns.mkm.IDFactory = IDFactory;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Base64 = ns.format.Base64;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var meta;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = 0;
            key = null;
            seed = null;
            fingerprint = null;
        } else {
            if (arguments.length === 2) {
                type = EnumToUint(arguments[0]);
                key = arguments[1];
                seed = null;
                fingerprint = null;
                meta = { type: type, key: key.toMap() };
            } else {
                if (arguments.length === 4) {
                    type = EnumToUint(arguments[0]);
                    key = arguments[1];
                    seed = arguments[2];
                    fingerprint = arguments[3];
                    meta = {
                        type: type,
                        key: key.toMap(),
                        seed: seed,
                        fingerprint: Base64.encode(fingerprint)
                    };
                } else {
                    throw new SyntaxError("meta arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
    };
    Class(BaseMeta, Dictionary, [Meta], {
        getType: function () {
            if (this.__type === 0) {
                this.__type = this.getNumber("type");
            }
            return this.__type;
        },
        getKey: function () {
            if (this.__key === null) {
                var key = this.getValue("key");
                this.__key = PublicKey.parse(key);
            }
            return this.__key;
        },
        getSeed: function () {
            if (this.__seed === null && MetaType.hasSeed(this.getType())) {
                this.__seed = this.getString("seed");
            }
            return this.__seed;
        },
        getFingerprint: function () {
            if (this.__fingerprint === null && MetaType.hasSeed(this.getType())) {
                var base64 = this.getString("fingerprint");
                this.__fingerprint = Base64.decode(base64);
            }
            return this.__fingerprint;
        }
    });
    ns.mkm.BaseMeta = BaseMeta;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var BaseDocument = function () {
        var map, status;
        var identifier, data;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            status = 0;
            identifier = null;
            data = null;
            properties = null;
        } else {
            if (arguments.length === 2) {
                identifier = arguments[0];
                var type = arguments[1];
                map = { ID: identifier.toString() };
                status = 0;
                data = null;
                if (type && type.length > 1) {
                    properties = { type: type };
                } else {
                    properties = null;
                }
            } else {
                if (arguments.length === 3) {
                    identifier = arguments[0];
                    data = arguments[1];
                    var signature = arguments[2];
                    map = { ID: identifier.toString(), data: data, signature: signature };
                    status = 1;
                    properties = null;
                } else {
                    throw new SyntaxError("document arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;
        this.__sig = null;
        this.__properties = properties;
        this.__status = status;
    };
    Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0;
        },
        getType: function () {
            var type = this.getProperty("type");
            if (!type) {
                type = this.getString("type");
            }
            return type;
        },
        getIdentifier: function () {
            if (this.__identifier === null) {
                this.__identifier = ID.parse(this.getValue("ID"));
            }
            return this.__identifier;
        },
        getData: function () {
            if (this.__json === null) {
                this.__json = this.getString("data");
            }
            return this.__json;
        },
        getSignature: function () {
            if (this.__sig === null) {
                var base64 = this.getString("signature");
                if (base64) {
                    this.__sig = Base64.decode(base64);
                }
            }
            return this.__sig;
        },
        allProperties: function () {
            if (this.__status < 0) {
                return null;
            }
            if (this.__properties === null) {
                var data = this.getData();
                if (data) {
                    this.__properties = JsON.decode(data);
                } else {
                    this.__properties = {};
                }
            }
            return this.__properties;
        },
        getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null;
            }
            return dict[name];
        },
        setProperty: function (name, value) {
            this.__status = 0;
            var dict = this.allProperties();
            if (value) {
                dict[name] = value;
            } else {
                delete dict[name];
            }
            this.removeValue("data");
            this.removeValue("signature");
            this.__json = null;
            this.__sig = null;
        },
        verify: function (publicKey) {
            if (this.__status > 0) {
                return true;
            }
            var data = this.getData();
            var signature = this.getSignature();
            if (!data) {
                if (!signature) {
                    this.__status = 0;
                } else {
                    this.__status = -1;
                }
            } else {
                if (!signature) {
                    this.__status = -1;
                } else {
                    if (publicKey.verify(UTF8.encode(data), signature)) {
                        this.__status = 1;
                    }
                }
            }
            return this.__status === 1;
        },
        sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature();
            }
            var now = new Date();
            this.setProperty("time", now.getTime() / 1000);
            var data = JsON.encode(this.allProperties());
            if (!data || data.length === 0) {
                return null;
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                return null;
            }
            this.setValue("data", data);
            this.setValue("signature", Base64.encode(signature));
            this.__json = data;
            this.__sig = signature;
            this.__status = 1;
            return this.__sig;
        },
        getTime: function () {
            var timestamp = this.getProperty("time");
            if (timestamp) {
                return new Date(timestamp * 1000);
            } else {
                return null;
            }
        },
        getName: function () {
            return this.getProperty("name");
        },
        setName: function (name) {
            this.setProperty("name", name);
        }
    });
    ns.mkm.BaseDocument = BaseDocument;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__key = null;
    };
    Class(BaseVisa, BaseDocument, [Visa], {
        getKey: function () {
            if (this.__key === null) {
                var key = this.getProperty("key");
                key = PublicKey.parse(key);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key;
                }
            }
            return this.__key;
        },
        setKey: function (publicKey) {
            this.setProperty("key", publicKey.toMap());
            this.__key = publicKey;
        },
        getAvatar: function () {
            return this.getProperty("avatar");
        },
        setAvatar: function (url) {
            this.setProperty("avatar", url);
        }
    });
    ns.mkm.BaseVisa = BaseVisa;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__assistants = null;
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {
        getAssistants: function () {
            if (this.__assistants === null) {
                var assistants = this.getProperty("assistants");
                if (assistants) {
                    this.__assistants = ID.convert(assistants);
                }
            }
            return this.__assistants;
        },
        setAssistants: function (assistants) {
            if (assistants) {
                this.setProperty("assistants", ID.revert(assistants));
            } else {
                this.setProperty("assistants", null);
            }
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = Interface(null, [ns.type.Object]);
    Entity.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getMeta = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getDocument = function (type) {
        throw new Error("NotImplemented");
    };
    Entity.prototype.setDataSource = function (barrack) {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getDataSource = function () {
        throw new Error("NotImplemented");
    };
    var EntityDataSource = Interface(null, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        throw new Error("NotImplemented");
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        throw new Error("NotImplemented");
    };
    var EntityDelegate = Interface(null, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        throw new Error("NotImplemented");
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        throw new Error("NotImplemented");
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__datasource = null;
    };
    Class(BaseEntity, BaseObject, [Entity], null);
    BaseEntity.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else {
            if (!other) {
                return false;
            } else {
                if (Interface.conforms(other, Entity)) {
                    other = other.getIdentifier();
                }
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
        var clazz = Object.getPrototypeOf(this).constructor.name;
        var id = this.__identifier;
        var network = id.getAddress().getType();
        return (
            "<" + clazz + ' id="' + id.toString() + '" network="' + network + '" />'
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
        var delegate = this.getDataSource();
        return delegate.getMeta(this.__identifier);
    };
    BaseEntity.prototype.getDocument = function (type) {
        var delegate = this.getDataSource();
        return delegate.getDocument(this.__identifier, type);
    };
    ns.mkm.BaseEntity = BaseEntity;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var User = Interface(null, [Entity]);
    User.prototype.getVisa = function () {
        throw new Error("NotImplemented");
    };
    User.prototype.getContacts = function () {
        throw new Error("NotImplemented");
    };
    User.prototype.verify = function (data, signature) {
        throw new Error("NotImplemented");
    };
    User.prototype.encrypt = function (plaintext) {
        throw new Error("NotImplemented");
    };
    User.prototype.sign = function (data) {
        throw new Error("NotImplemented");
    };
    User.prototype.decrypt = function (ciphertext) {
        throw new Error("NotImplemented");
    };
    User.prototype.signVisa = function (doc) {
        throw new Error("NotImplemented");
    };
    User.prototype.verifyVisa = function (doc) {
        throw new Error("NotImplemented");
    };
    var UserDataSource = Interface(null, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (
        identifier
    ) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        throw new Error("NotImplemented");
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier);
    };
    Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var doc = this.getDocument(Document.VISA);
            if (Interface.conforms(doc, Visa)) {
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
            return key.encrypt(plaintext);
        },
        sign: function (data) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(uid);
            return key.sign(data);
        },
        decrypt: function (ciphertext) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var keys = barrack.getPrivateKeysForDecryption(uid);
            var plaintext;
            for (var i = 0; i < keys.length; ++i) {
                try {
                    plaintext = keys[i].decrypt(ciphertext);
                    if (plaintext && plaintext.length > 0) {
                        return plaintext;
                    }
                } catch (e) {}
            }
            return null;
        },
        signVisa: function (doc) {
            var uid = this.getIdentifier();
            var barrack = this.getDataSource();
            var key = barrack.getPrivateKeyForVisaSignature(uid);
            doc.sign(key);
            return doc;
        },
        verifyVisa: function (doc) {
            var uid = this.getIdentifier();
            if (!uid.equals(doc.getIdentifier())) {
                return false;
            }
            var meta = this.getMeta();
            var key = meta.getKey();
            return doc.verify(key);
        }
    });
    ns.mkm.BaseUser = BaseUser;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var Group = Interface(null, [Entity]);
    Group.prototype.getBulletin = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getFounder = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getOwner = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getMembers = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getAssistants = function () {
        throw new Error("NotImplemented");
    };
    var GroupDataSource = Interface(null, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        throw new Error("NotImplemented");
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var doc = this.getDocument(Document.BULLETIN);
            if (Interface.conforms(doc, Bulletin)) {
                return doc;
            } else {
                return null;
            }
        },
        getFounder: function () {
            if (this.__founder === null) {
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
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var EntityType = ns.protocol.EntityType;
    var ID = ns.protocol.ID;
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
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {
        getBroadcastFounder: function (group) {
            var name = group_seed(group);
            if (name) {
                return ID.parse(name + ".founder@anywhere");
            } else {
                return ID.FOUNDER;
            }
        },
        getBroadcastOwner: function (group) {
            var name = group_seed(group);
            if (name) {
                return ID.parse(name + ".owner@anywhere");
            } else {
                return ID.ANYONE;
            }
        },
        getBroadcastMembers: function (group) {
            var members = [];
            var name = group_seed(group);
            if (name) {
                var owner = ID.parse(name + ".owner@anywhere");
                var member = ID.parse(name + ".member@anywhere");
                members.push(owner);
                members.push(member);
            } else {
                members.push(ID.ANYONE);
            }
            return members;
        },
        getPublicKeyForEncryption: function (identifier) {
            var key = visa_key.call(this, identifier);
            if (key) {
                return key;
            }
            key = meta_key.call(this, identifier);
            if (Interface.conforms(key, EncryptKey)) {
                return key;
            }
            return null;
        },
        getPublicKeysForVerification: function (identifier) {
            var keys = [];
            var key = visa_key.call(this, identifier);
            if (Interface.conforms(key, VerifyKey)) {
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
                    if (Meta.matchKey(mMeta.getKey(), gMeta)) {
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
            if (EntityType.GROUP.equals(group.getType())) {
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
            if (Interface.conforms(doc, Bulletin)) {
                if (doc.isValid()) {
                    return doc.getAssistants();
                }
            }
            return null;
        }
    });
    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (Interface.conforms(doc, Visa)) {
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
    ns.Barrack = Barrack;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Packer = Interface(null, null);
    Packer.prototype.getOvertGroup = function (content) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.signMessage = function (sMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.deserializeMessage = function (data) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        throw new Error("NotImplemented");
    };
    ns.Packer = Packer;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Processor = Interface(null, null);
    Processor.prototype.processPackage = function (data) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processContent = function (content, rMsg) {
        throw new Error("NotImplemented");
    };
    ns.Processor = Processor;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
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
    Class(
        Transceiver,
        Object,
        [InstantMessage.Delegate, ReliableMessage.Delegate],
        null
    );
    Transceiver.prototype.getEntityDelegate = function () {
        throw new Error("NotImplemented");
    };
    Transceiver.prototype.isBroadcast = function (msg) {
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
        if (this.isBroadcast(iMsg)) {
            return UTF8.decode(data);
        }
        return Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (this.isBroadcast(iMsg)) {
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
        if (this.isBroadcast(sMsg)) {
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
    ns.Transceiver = Transceiver;
})(DIMP);
