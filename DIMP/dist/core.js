/**
 * DIMP - Decentralized Instant Messaging Protocol (v1.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Nov. 17, 2024
 * @copyright (c) 2024 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = MingKeMing.protocol
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = MingKeMing.mkm
    }
    if (typeof ns.dkd !== 'object') {
        ns.dkd = DaoKeDao.dkd
    }
    if (typeof ns.protocol.group !== 'object') {
        ns.protocol.group = {}
    }
    if (typeof ns.dkd.cmd !== 'object') {
        ns.dkd.cmd = {}
    }
    if (typeof ns.msg !== 'object') {
        ns.msg = {}
    }
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    var getKeyAlgorithm = function (key) {
        var gf = general_factory();
        return gf.getAlgorithm(key, '')
    };
    var matchSymmetricKeys = function (pKey, sKey) {
        var gf = general_factory();
        return gf.matchEncryptKey(pKey, sKey)
    };
    var matchAsymmetricKeys = function (sKey, pKey) {
        var gf = general_factory();
        return gf.matchSignKey(sKey, pKey)
    };
    var symmetricKeyEquals = function (a, b) {
        if (a === b) {
            return true
        }
        return matchSymmetricKeys(a, b)
    };
    var privateKeyEquals = function (a, b) {
        if (a === b) {
            return true
        }
        return matchAsymmetricKeys(a, b.publicKey)
    };
    var BaseKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseKey, Dictionary, [CryptographyKey], {
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    BaseKey.getKeyAlgorithm = getKeyAlgorithm;
    BaseKey.matchEncryptKey = matchSymmetricKeys;
    BaseKey.matchSignKey = matchAsymmetricKeys;
    BaseKey.symmetricKeyEquals = symmetricKeyEquals;
    BaseKey.privateKeyEquals = privateKeyEquals;
    var BaseSymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseSymmetricKey, Dictionary, [SymmetricKey], {
        equals: function (other) {
            return Interface.conforms(other, SymmetricKey) && symmetricKeyEquals(other, this)
        }, matchEncryptKey: function (pKey) {
            return matchSymmetricKeys(pKey, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BaseAsymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey], {
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BasePrivateKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BasePrivateKey, Dictionary, [PrivateKey], {
        equals: function (other) {
            return Interface.conforms(other, PrivateKey) && privateKeyEquals(other, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BasePublicKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BasePublicKey, Dictionary, [PublicKey], {
        matchSignKey: function (sKey) {
            return matchAsymmetricKeys(sKey, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    ns.crypto.BaseKey = BaseKey;
    ns.crypto.BaseSymmetricKey = BaseSymmetricKey;
    ns.crypto.BaseAsymmetricKey = BaseAsymmetricKey;
    ns.crypto.BasePrivateKey = BasePrivateKey;
    ns.crypto.BasePublicKey = BasePublicKey
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var Base64 = ns.format.Base64;
    var Base58 = ns.format.Base58;
    var Hex = ns.format.Hex;
    var BaseDataWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__data = null
    };
    Class(BaseDataWrapper, Dictionary, null, {
        isEmpty: function () {
            if (Dictionary.prototype.isEmpty.call(this)) {
                return true
            }
            var bin = this.__data;
            return bin === null || bin.length === 0
        }, toString: function () {
            var encoded = this.getString('data', '');
            if (encoded.length === 0) {
                return encoded
            }
            var alg = this.getString('algorithm', '');
            if (alg === TransportableData.DEFAULT) {
                alg = ''
            }
            if (alg === '') {
                return encoded
            } else {
                return alg + ',' + encoded
            }
        }, encode: function (mimeType) {
            var encoded = this.getString('data', '');
            if (encoded.length === 0) {
                return encoded
            }
            var alg = this.getAlgorithm();
            return 'data:' + mimeType + ';' + alg + ',' + encoded
        }, getAlgorithm: function () {
            var alg = this.getString('algorithm', '');
            if (alg === '') {
                alg = TransportableData.DEFAULT
            }
            return alg
        }, setAlgorithm: function (name) {
            if (!name) {
                this.removeValue('algorithm')
            } else {
                this.setValue('algorithm', name)
            }
        }, getData: function () {
            var bin = this.__data;
            if (!bin) {
                var encoded = this.getString('data', '');
                if (encoded.length > 0) {
                    var alg = this.getAlgorithm();
                    if (alg === TransportableData.BASE64) {
                        bin = Base64.decode(encoded)
                    } else if (alg === TransportableData.BASE58) {
                        bin = Base58.decode(encoded)
                    } else if (alg === TransportableData.HEX) {
                        bin = Hex.decode(encoded)
                    }
                }
            }
            return bin
        }, setData: function (bin) {
            if (!bin) {
                this.removeValue('data')
            } else {
                var encoded = '';
                var alg = this.getAlgorithm();
                if (alg === TransportableData.BASE64) {
                    encoded = Base64.encode(bin)
                } else if (alg === TransportableData.BASE58) {
                    encoded = Base58.encode(bin)
                } else if (alg === TransportableData.HEX) {
                    encoded = Hex.encode(bin)
                }
                this.setValue('data', encoded)
            }
            this.__data = bin
        }
    });
    ns.format.BaseDataWrapper = BaseDataWrapper
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var BaseFileWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__attachment = null;
        this.__password = null
    };
    Class(BaseFileWrapper, Dictionary, null, {
        getData: function () {
            var ted = this.__attachment;
            if (!ted) {
                var base64 = this.getValue('data');
                ted = TransportableData.parse(base64);
                this.__attachment = ted
            }
            return ted
        }, setData: function (ted) {
            if (!ted) {
                this.removeValue('data')
            } else {
                this.setValue('data', ted.toObject())
            }
            this.__attachment = ted
        }, setBinaryData: function (bin) {
            if (!bin) {
                this.setData(null)
            } else {
                this.setData(TransportableData.create(bin))
            }
        }, getFilename: function () {
            return this.getString('filename', null)
        }, setFilename: function (filename) {
            if (!filename) {
                this.removeValue('filename')
            } else {
                this.setValue('filename', filename)
            }
        }, getURL: function () {
            return this.getString('URL', null)
        }, setURL: function (url) {
            if (!url) {
                this.removeValue('URL')
            } else {
                this.setValue('URL', url)
            }
        }, getPassword: function () {
            var pwd = this.__password;
            if (!pwd) {
                var key = this.getValue('password');
                pwd = SymmetricKey.parse(key);
                this.__password = pwd
            }
            return pwd
        }, setPassword: function (key) {
            if (!key) {
                this.removeValue('password')
            } else {
                this.setMap('password', key)
            }
            this.__password = key
        }
    });
    ns.format.BaseFileWrapper = BaseFileWrapper
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var TextContent = Interface(null, [Content]);
    TextContent.prototype.setText = function (text) {
    };
    TextContent.prototype.getText = function () {
    };
    TextContent.create = function (text) {
        return new ns.dkd.BaseTextContent(text)
    };
    var ArrayContent = Interface(null, [Content]);
    ArrayContent.prototype.getContents = function () {
    };
    ArrayContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item)
            }
        }
        return array
    };
    ArrayContent.revert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = contents[i];
            if (Interface.conforms(item, Content)) {
                array.push(item.toMap())
            } else {
                array.push(item)
            }
        }
        return array
    };
    ArrayContent.create = function (contents) {
        return new ns.dkd.ListContent(contents)
    };
    var ForwardContent = Interface(null, [Content]);
    ForwardContent.prototype.getForward = function () {
    };
    ForwardContent.prototype.getSecrets = function () {
    };
    ForwardContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg)
            }
        }
        return array
    };
    ForwardContent.revert = function (messages) {
        var array = [];
        var item;
        for (var i = 0; i < messages.length; ++i) {
            item = messages[i];
            if (Interface.conforms(item, ReliableMessage)) {
                array.push(item.toMap())
            } else {
                array.push(item)
            }
        }
        return array
    };
    ForwardContent.create = function (secrets) {
        return new ns.dkd.SecretContent(secrets)
    };
    var PageContent = Interface(null, [Content]);
    PageContent.prototype.setTitle = function (title) {
    };
    PageContent.prototype.getTitle = function () {
    };
    PageContent.prototype.setIcon = function (pnf) {
    };
    PageContent.prototype.getIcon = function () {
    };
    PageContent.prototype.setDesc = function (text) {
    };
    PageContent.prototype.getDesc = function () {
    };
    PageContent.prototype.getURL = function () {
    };
    PageContent.prototype.setURL = function (url) {
    };
    PageContent.prototype.getHTML = function () {
    };
    PageContent.prototype.setHTML = function (url) {
    };
    PageContent.create = function (info) {
        var content = new ns.dkd.WebPageContent();
        var title = info['title'];
        if (title) {
            content.setTitle(title)
        }
        var desc = info['desc'];
        if (desc) {
            content.setDesc(desc)
        }
        var url = info['URL'];
        if (url) {
            content.setURL(url)
        }
        var html = info['HTML'];
        if (html) {
            content.setHTML(html)
        }
        var icon = info['icon'];
        if (icon) {
            content.setIcon(icon)
        }
        return content
    };
    var NameCard = Interface(null, [Content]);
    NameCard.prototype.getIdentifier = function () {
    };
    NameCard.prototype.getName = function () {
    };
    NameCard.prototype.getAvatar = function () {
    };
    NameCard.create = function (identifier, mame, avatar) {
        var content = new ns.dkd.NameCardContent(identifier);
        content.setName(name);
        content.setAvatar(avatar);
        return content
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.ArrayContent = ArrayContent;
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.PageContent = PageContent;
    ns.protocol.NameCard = NameCard
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var FileContent = Interface(null, [Content]);
    FileContent.prototype.setData = function (data) {
    };
    FileContent.prototype.getData = function () {
    };
    FileContent.prototype.setFilename = function (filename) {
    };
    FileContent.prototype.getFilename = function () {
    };
    FileContent.prototype.setURL = function (url) {
    };
    FileContent.prototype.getURL = function () {
    };
    FileContent.prototype.setPassword = function (key) {
    };
    FileContent.prototype.getPassword = function () {
    };
    var init_content = function (content, data, filename, url, password) {
        if (data) {
            content.setTransportableData(data)
        }
        if (filename) {
            content.setFilename(filename)
        }
        if (url) {
            content.setURL(url)
        }
        if (password) {
            content.setPassword(password)
        }
        return content
    };
    FileContent.create = function (type, data, filename, url, password) {
        var content = new ns.dkd.BaseFileContent(type);
        return init_content(content, data, filename, url, password)
    };
    FileContent.file = function (data, filename, url, password) {
        var content = new ns.dkd.BaseFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.image = function (data, filename, url, password) {
        var content = new ns.dkd.ImageFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.audio = function (data, filename, url, password) {
        var content = new ns.dkd.AudioFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.video = function (data, filename, url, password) {
        var content = new ns.dkd.VideoFileContent();
        return init_content(content, data, filename, url, password)
    };
    ns.protocol.FileContent = FileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = Interface(null, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
    };
    ImageContent.prototype.getThumbnail = function () {
    };
    var VideoContent = Interface(null, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
    };
    VideoContent.prototype.getSnapshot = function () {
    };
    var AudioContent = Interface(null, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
    };
    AudioContent.prototype.getText = function () {
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.VideoContent = VideoContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var MoneyContent = Interface(null, [Content]);
    MoneyContent.prototype.getCurrency = function () {
    };
    MoneyContent.prototype.setAmount = function (amount) {
    };
    MoneyContent.prototype.getAmount = function () {
    };
    MoneyContent.create = function (type, currency, amount) {
        return new ns.dkd.BaseMoneyContent(type, currency, amount)
    };
    var TransferContent = Interface(null, [MoneyContent]);
    TransferContent.prototype.setRemitter = function (sender) {
    };
    TransferContent.prototype.getRemitter = function () {
    };
    TransferContent.prototype.setRemittee = function (receiver) {
    };
    TransferContent.prototype.getRemittee = function () {
    };
    TransferContent.create = function (currency, amount) {
        return new ns.dkd.TransferMoneyContent(currency, amount)
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var CustomizedContent = Interface(null, [Content]);
    CustomizedContent.prototype.getApplication = function () {
    };
    CustomizedContent.prototype.getModule = function () {
    };
    CustomizedContent.prototype.getAction = function () {
    };
    CustomizedContent.create = function () {
        var type, app, mod, act;
        if (arguments.length === 4) {
            type = arguments[0];
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3];
            return new ns.dkd.AppCustomizedContent(type, app, mod, act)
        } else if (arguments.length === 3) {
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
            return new ns.dkd.AppCustomizedContent(app, mod, act)
        } else {
            throw new SyntaxError('customized content arguments error: ' + arguments);
        }
    };
    ns.protocol.CustomizedContent = CustomizedContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var Command = Interface(null, [Content]);
    Command.META = 'meta';
    Command.DOCUMENT = 'document';
    Command.RECEIPT = 'receipt';
    Command.prototype.getCmd = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.cmd.CommandFactoryManager;
        return man.generalFactory
    };
    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command)
    };
    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory)
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd)
    };
    var CommandFactory = Interface(null, null);
    CommandFactory.prototype.parseCommand = function (content) {
    };
    Command.Factory = CommandFactory;
    ns.protocol.Command = Command
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var MetaCommand = Interface(null, [Command]);
    MetaCommand.prototype.getIdentifier = function () {
    };
    MetaCommand.prototype.getMeta = function () {
    };
    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier)
    };
    MetaCommand.response = function (identifier, meta) {
        var command = new ns.dkd.cmd.BaseMetaCommand(identifier);
        command.setMeta(meta);
        return command
    };
    var DocumentCommand = Interface(null, [MetaCommand]);
    DocumentCommand.prototype.getDocument = function () {
    };
    DocumentCommand.prototype.getLastTime = function () {
    };
    DocumentCommand.query = function (identifier, lastTime) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        if (lastTime) {
            command.setLastTime(lastTime)
        }
        return command
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        command.setMeta(meta);
        command.setDocument(doc);
        return command
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.DocumentCommand = DocumentCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Command = ns.protocol.Command;
    var HistoryCommand = Interface(null, [Command]);
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE = 'suicide';
    var GroupCommand = Interface(null, [HistoryCommand]);
    GroupCommand.FOUND = 'found';
    GroupCommand.ABDICATE = 'abdicate';
    GroupCommand.INVITE = 'invite';
    GroupCommand.EXPEL = 'expel';
    GroupCommand.JOIN = 'join';
    GroupCommand.QUIT = 'quit';
    GroupCommand.QUERY = 'query';
    GroupCommand.RESET = 'reset';
    GroupCommand.HIRE = 'hire';
    GroupCommand.FIRE = 'fire';
    GroupCommand.RESIGN = 'resign';
    GroupCommand.prototype.setMember = function (identifier) {
    };
    GroupCommand.prototype.getMember = function () {
    };
    GroupCommand.prototype.setMembers = function (members) {
    };
    GroupCommand.prototype.getMembers = function () {
    };
    GroupCommand.create = function (cmd, group, members) {
        var command = new ns.dkd.cmd.BaseGroupCommand(cmd, group);
        if (!members) {
        } else if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('group members error: ' + members);
        }
        return command
    };
    GroupCommand.invite = function (group, members) {
        var command = new ns.dkd.cmd.InviteGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('invite members error: ' + members);
        }
        return command
    };
    GroupCommand.expel = function (group, members) {
        var command = new ns.dkd.cmd.ExpelGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('expel members error: ' + members);
        }
        return command
    };
    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group)
    };
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group)
    };
    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group)
    };
    GroupCommand.reset = function (group, members) {
        var command = new ns.dkd.cmd.ResetGroupCommand(group, members);
        if (members instanceof Array) {
            command.setMembers(members)
        } else {
            throw new TypeError('reset members error: ' + members);
        }
        return command
    };
    var get_targets = function (info, batch, single) {
        var users = info[batch];
        if (users) {
            return ID.convert(users)
        }
        var usr = ID.parse(info[single]);
        if (usr) {
            return [usr]
        } else {
            return []
        }
    };
    GroupCommand.hire = function (group, targets) {
        var command = new ns.dkd.cmd.HireGroupCommand(group);
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins)
        }
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots)
        }
        return command
    };
    GroupCommand.fire = function (group, targets) {
        var command = new ns.dkd.cmd.FireGroupCommand(group);
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins)
        }
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots)
        }
        return command
    };
    GroupCommand.resign = function (group) {
        return new ns.dkd.cmd.ResignGroupCommand(group)
    };
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.GroupCommand = GroupCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = Interface(null, [GroupCommand]);
    var JoinCommand = Interface(null, [GroupCommand]);
    var QuitCommand = Interface(null, [GroupCommand]);
    var ResetCommand = Interface(null, [GroupCommand]);
    var QueryCommand = Interface(null, [GroupCommand]);
    var HireCommand = Interface(null, [GroupCommand]);
    HireCommand.prototype.getAdministrators = function () {
    };
    HireCommand.prototype.setAdministrators = function (members) {
    };
    HireCommand.prototype.getAssistants = function () {
    };
    HireCommand.prototype.setAssistants = function (bots) {
    };
    var FireCommand = Interface(null, [GroupCommand]);
    FireCommand.prototype.getAdministrators = function () {
    };
    FireCommand.prototype.setAdministrators = function (members) {
    };
    FireCommand.prototype.getAssistants = function () {
    };
    FireCommand.prototype.setAssistants = function (bots) {
    };
    var ResignCommand = Interface(null, [GroupCommand]);
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.HireCommand = HireCommand;
    ns.protocol.group.FireCommand = FireCommand;
    ns.protocol.group.ResignCommand = ResignCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var ReceiptCommand = Interface(null, [Command]);
    ReceiptCommand.prototype.getText = function () {
    };
    ReceiptCommand.prototype.getOriginalEnvelope = function () {
    };
    ReceiptCommand.prototype.getOriginalSerialNumber = function () {
    };
    ReceiptCommand.prototype.getOriginalSignature = function () {
    };
    var purify = function (envelope) {
        var info = envelope.copyMap(false);
        if (info['data']) {
            delete info['data'];
            delete info['key'];
            delete info['keys'];
            delete info['meta'];
            delete info['visa']
        }
        return info
    };
    ReceiptCommand.create = function (text, head, body) {
        var info;
        if (!head) {
            info = null
        } else if (!body) {
            info = purify(head)
        } else {
            info = purify(head);
            info['sn'] = body.getSerialNumber()
        }
        var command = new ns.dkd.cmd.BaseReceiptCommand(text, info);
        if (body) {
            var group = body.getGroup();
            if (group) {
                command.setGroup(group)
            }
        }
        return command
    };
    ReceiptCommand.purify = purify;
    ns.protocol.ReceiptCommand = ReceiptCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Document = ns.protocol.Document;
    var Visa = Interface(null, [Document]);
    Visa.prototype.getPublicKey = function () {
    };
    Visa.prototype.setPublicKey = function (pKey) {
    };
    Visa.prototype.getAvatar = function () {
    };
    Visa.prototype.setAvatar = function (image) {
    };
    var Bulletin = Interface(null, [Document]);
    Bulletin.prototype.getFounder = function () {
    };
    Bulletin.prototype.getAssistants = function () {
    };
    Bulletin.prototype.setAssistants = function (assistants) {
    };
    ns.protocol.Visa = Visa;
    ns.protocol.Bulletin = Bulletin
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseContent = function (info) {
        if (Enum.isEnum(info)) {
            info = info.getValue()
        }
        var content, type, sn, time;
        if (IObject.isNumber(info)) {
            type = info;
            time = new Date();
            sn = InstantMessage.generateSerialNumber(type, time);
            content = {'type': type, 'sn': sn, 'time': time.getTime() / 1000.0}
        } else {
            content = info;
            type = 0;
            sn = 0;
            time = null
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time
    };
    Class(BaseContent, Dictionary, [Content], {
        getType: function () {
            if (this.__type === 0) {
                var gf = ns.dkd.MessageFactoryManager.generalFactory;
                this.__type = gf.getContentType(this.toMap(), 0)
            }
            return this.__type
        }, getSerialNumber: function () {
            if (this.__sn === 0) {
                this.__sn = this.getInt('sn', 0)
            }
            return this.__sn
        }, getTime: function () {
            if (this.__time === null) {
                this.__time = this.getDateTime('time', null)
            }
            return this.__time
        }, getGroup: function () {
            var group = this.getValue('group');
            return ID.parse(group)
        }, setGroup: function (identifier) {
            this.setString('group', identifier)
        }
    });
    ns.dkd.BaseContent = BaseContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ID = ns.protocol.ID;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var ArrayContent = ns.protocol.ArrayContent;
    var ForwardContent = ns.protocol.ForwardContent;
    var PageContent = ns.protocol.PageContent;
    var NameCard = ns.protocol.NameCard;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function (info) {
        if (IObject.isString(info)) {
            BaseContent.call(this, ContentType.TEXT);
            this.setText(info)
        } else {
            BaseContent.call(this, info)
        }
    };
    Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getString('text', '')
        }, setText: function (text) {
            this.setValue('text', text)
        }
    });
    var ListContent = function (info) {
        var list;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', ArrayContent.revert(list))
        } else {
            BaseContent.call(this, info);
            list = null
        }
        this.__list = list
    };
    Class(ListContent, BaseContent, [ArrayContent], {
        getContents: function () {
            if (this.__list === null) {
                var array = this.getValue('contents');
                if (array) {
                    this.__list = ArrayContent.convert(array)
                } else {
                    this.__list = []
                }
            }
            return this.__list
        }
    });
    var SecretContent = function (info) {
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info
        } else if (Interface.conforms(info, ReliableMessage)) {
            BaseContent.call(this, ContentType.FORWARD);
            forward = info
        } else {
            BaseContent.call(this, info)
        }
        if (forward) {
            this.setMap('forward', forward)
        } else if (secrets) {
            var array = ForwardContent.revert(secrets);
            this.setValue('secrets', array)
        }
        this.__forward = forward;
        this.__secrets = secrets
    };
    Class(SecretContent, BaseContent, [ForwardContent], {
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue('forward');
                this.__forward = ReliableMessage.parse(forward)
            }
            return this.__forward
        }, getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue('secrets');
                if (array) {
                    this.__secrets = ForwardContent.convert(array)
                } else {
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg)
                    }
                }
            }
            return this.__secrets
        }
    });
    var WebPageContent = function (info) {
        if (info) {
            BaseContent.call(this, info)
        } else {
            BaseContent.call(this, ContentType.PAGE)
        }
        this.__icon = null
    };
    Class(WebPageContent, BaseContent, [PageContent], {
        getTitle: function () {
            return this.getString('title', '')
        }, setTitle: function (title) {
            this.setValue('title', title)
        }, getDesc: function () {
            return this.getString('desc', null)
        }, setDesc: function (text) {
            this.setValue('desc', text)
        }, getURL: function () {
            return this.getString('URL', null)
        }, setURL: function (url) {
            this.setValue('URL', url)
        }, getHTML: function () {
            return this.getString('HTML', null)
        }, setHTML: function (html) {
            this.setValue('HTML', html)
        }, getIcon: function () {
            var pnf = this.__icon;
            if (!pnf) {
                var url = this.getString('icon', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf
            }
            return pnf
        }, setIcon: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('icon', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('icon', image)
            } else {
                this.removeValue('icon')
            }
            this.__icon = pnf
        }
    });
    var NameCardContent = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseContent.call(this, ContentType.NAME_CARD);
            this.setString('ID', info)
        } else {
            BaseContent.call(this, info)
        }
        this.__image = null
    };
    Class(NameCardContent, BaseContent, [NameCard], {
        getIdentifier: function () {
            var id = this.getValue('ID');
            return ID.parse(id)
        }, getName: function () {
            return this.getString('name', '')
        }, setName: function (name) {
            this.setValue('name', name)
        }, getAvatar: function () {
            var pnf = this.__image;
            if (!pnf) {
                var url = this.getString('avatar', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf
            }
            return pnf
        }, setAvatar: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('avatar', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('avatar', image)
            } else {
                this.removeValue('avatar')
            }
            this.__image = pnf
        }
    });
    ns.dkd.BaseTextContent = BaseTextContent;
    ns.dkd.ListContent = ListContent;
    ns.dkd.SecretContent = SecretContent;
    ns.dkd.WebPageContent = WebPageContent;
    ns.dkd.NameCardContent = NameCardContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var BaseFileWrapper = ns.format.BaseFileWrapper;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function (info) {
        if (!info) {
            info = ContentType.FILE
        }
        BaseContent.call(this, info);
        this.__wrapper = new BaseFileWrapper(this.toMap())
    };
    Class(BaseFileContent, BaseContent, [FileContent], {
        getData: function () {
            var ted = this.__wrapper.getData();
            return !ted ? null : ted.getData()
        }, setData: function (data) {
            this.__wrapper.setBinaryData(data)
        }, setTransportableData: function (ted) {
            this.__wrapper.setData(ted)
        }, getFilename: function () {
            return this.__wrapper.getFilename()
        }, setFilename: function (filename) {
            this.__wrapper.setFilename(filename)
        }, getURL: function () {
            return this.__wrapper.getURL()
        }, setURL: function (url) {
            this.__wrapper.setURL(url)
        }, getPassword: function () {
            return this.__wrapper.getPassword()
        }, setPassword: function (key) {
            this.__wrapper.setPassword(key)
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.IMAGE)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__thumbnail = null
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            var pnf = this.__thumbnail;
            if (!pnf) {
                var base64 = this.getString('thumbnail', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__thumbnail = pnf
            }
            return pnf
        }, setThumbnail: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('thumbnail')
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('thumbnail', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('thumbnail', image)
            }
            this.__thumbnail = pnf
        }
    });
    var VideoFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.VIDEO)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__snapshot = null
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            var pnf = this.__snapshot;
            if (!pnf) {
                var base64 = this.getString('snapshot', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__snapshot = pnf
            }
            return pnf
        }, setSnapshot: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('snapshot')
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('snapshot', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('snapshot', image)
            }
            this.__snapshot = pnf
        }
    });
    var AudioFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.AUDIO)
        } else {
            BaseFileContent.call(this, info)
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getString('text', null)
        }, setText: function (asr) {
            this.setValue('text', asr)
        }
    });
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(arguments[0])
        } else if (arguments.length === 2) {
            BaseContent.call(ContentType.MONEY);
            this.setCurrency(arguments[0]);
            this.setAmount(arguments[1])
        } else if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            this.setValue('currency', currency)
        }, getCurrency: function () {
            return this.getString('currency', null)
        }, setAmount: function (amount) {
            this.setValue('amount', amount)
        }, getAmount: function () {
            return this.getFloat('amount', 0)
        }
    });
    var TransferMoneyContent = function () {
        if (arguments.length === 1) {
            MoneyContent.call(arguments[0])
        } else if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getRemitter: function () {
            var sender = this.getValue('remitter');
            return ID.parse(sender)
        }, setRemitter: function (sender) {
            this.setString('remitter', sender)
        }, getRemittee: function () {
            var receiver = this.getValue('remittee');
            return ID.parse(receiver)
        }, setRemittee: function (receiver) {
            this.setString('remittee', receiver)
        }
    });
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var CustomizedContent = ns.protocol.CustomizedContent;
    var BaseContent = ns.dkd.BaseContent;
    var AppCustomizedContent = function () {
        var app = null;
        var mod = null;
        var act = null;
        if (arguments.length === 4) {
            BaseContent.call(this, arguments[0]);
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3]
        } else if (arguments.length === 3) {
            BaseContent.call(this, ContentType.CUSTOMIZED);
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2]
        } else {
            BaseContent.call(this, arguments[0])
        }
        if (app) {
            this.setValue('app', app)
        }
        if (mod) {
            this.setValue('mod', mod)
        }
        if (act) {
            this.setValue('act', act)
        }
    };
    Class(AppCustomizedContent, BaseContent, [CustomizedContent], {
        getApplication: function () {
            return this.getString('app', null)
        }, getModule: function () {
            return this.getString('mod', null)
        }, getAction: function () {
            return this.getString('act', null)
        }
    });
    ns.dkd.AppCustomizedContent = AppCustomizedContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue('command', arguments[1])
        } else if (IObject.isString(arguments[0])) {
            BaseContent.call(this, ContentType.COMMAND);
            this.setValue('command', arguments[0])
        } else {
            BaseContent.call(this, arguments[0])
        }
    };
    Class(BaseCommand, BaseContent, [Command], {
        getCmd: function () {
            var gf = ns.dkd.cmd.CommandFactoryManager.generalFactory;
            return gf.getCmd(this.toMap(), '')
        }
    });
    ns.dkd.cmd.BaseCommand = BaseCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseMetaCommand = function () {
        var identifier = null;
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[1]);
            identifier = arguments[0]
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseCommand.call(this, Command.META);
            identifier = arguments[0]
        } else {
            BaseCommand.call(this, arguments[0])
        }
        if (identifier) {
            this.setString('ID', identifier)
        }
        this.__identifier = identifier;
        this.__meta = null
    };
    Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("ID");
                this.__identifier = ID.parse(identifier)
            }
            return this.__identifier
        }, getMeta: function () {
            if (this.__meta === null) {
                var meta = this.getValue('meta');
                this.__meta = Meta.parse(meta)
            }
            return this.__meta
        }, setMeta: function (meta) {
            this.setMap('meta', meta);
            this.__meta = meta
        }
    });
    var BaseDocumentCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseMetaCommand.call(this, info, Command.DOCUMENT)
        } else {
            BaseMetaCommand.call(this, info)
        }
        this.__document = null
    };
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        getDocument: function () {
            if (this.__document === null) {
                var doc = this.getValue('document');
                this.__document = Document.parse(doc)
            }
            return this.__document
        }, setDocument: function (doc) {
            this.setMap('document', doc);
            this.__document = doc
        }, getLastTime: function () {
            return this.getDateTime('last_time', null)
        }, setLastTime: function (when) {
            this.setDateTime('last_time', when)
        }
    });
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[0], arguments[1])
        } else if (IObject.isString(arguments[0])) {
            BaseCommand.call(this, ContentType.HISTORY, arguments[0])
        } else {
            BaseCommand.call(this, arguments[0])
        }
    };
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0])
        } else if (arguments.length === 2) {
            BaseHistoryCommand.call(this, ContentType.COMMAND, arguments[0]);
            this.setGroup(arguments[1])
        } else {
            throw new SyntaxError('Group command arguments error: ' + arguments);
        }
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            this.setString('member', identifier);
            this.removeValue('members')
        }, getMember: function () {
            var member = this.getValue('member');
            return ID.parse(member)
        }, setMembers: function (users) {
            if (!users) {
                this.removeValue('members')
            } else {
                var array = ID.revert(users);
                this.setValue('members', array)
            }
            this.removeValue('member')
        }, getMembers: function () {
            var array = this.getValue('members');
            if (array instanceof Array) {
                return ID.convert(array)
            }
            var single = this.getMember();
            return !single ? [] : [single]
        }
    });
    ns.dkd.cmd.BaseHistoryCommand = BaseHistoryCommand;
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand
})(DIMP);
(function (ns) {
    'use strict';
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
    var HireCommand = ns.protocol.group.HireCommand;
    var FireCommand = ns.protocol.group.FireCommand;
    var ResignCommand = ns.protocol.group.ResignCommand;
    var BaseGroupCommand = ns.dkd.cmd.BaseGroupCommand;
    var InviteGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.INVITE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);
    var ExpelGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);
    var JoinGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);
    var QuitGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);
    var ResetGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESET, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);
    var QueryGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);
    var HireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.HIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(HireGroupCommand, BaseGroupCommand, [HireCommand], null);
    var FireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.FIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(FireGroupCommand, BaseGroupCommand, [FireCommand], null);
    var ResignGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand], null);
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;
    ns.dkd.cmd.HireGroupCommand = HireGroupCommand;
    ns.dkd.cmd.FireGroupCommand = FireGroupCommand;
    ns.dkd.cmd.ResignGroupCommand = ResignGroupCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Converter = ns.type.Converter;
    var Envelope = ns.protocol.Envelope;
    var Command = ns.protocol.Command;
    var ReceiptCommand = ns.protocol.ReceiptCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseReceiptCommand = function () {
        if (arguments.length === 1) {
            BaseCommand.call(this, arguments[0])
        } else {
            BaseCommand.call(this, Command.RECEIPT);
            this.setValue('text', arguments[0]);
            var origin = arguments[1];
            if (origin) {
                this.setValue('origin', origin)
            }
        }
        this.__env = null
    };
    Class(BaseReceiptCommand, BaseCommand, [ReceiptCommand], {
        getText: function () {
            return this.getString('text', '')
        }, getOrigin: function () {
            return this.getValue('origin')
        }, getOriginalEnvelope: function () {
            var env = this.__env;
            if (!env) {
                env = Envelope.parse(this.getOrigin());
                this.__env = env
            }
            return env
        }, getOriginalSerialNumber: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null
            }
            return Converter.getInt(origin['sn'], null)
        }, getOriginalSignature: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null
            }
            return Converter.getString(origin['signature'], null)
        }
    });
    ns.dkd.cmd.BaseReceiptCommand = BaseReceiptCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var Command = ns.protocol.Command;
    var GeneralFactory = function () {
        this.__commandFactories = {}
    };
    Class(GeneralFactory, null, null, {
        setCommandFactory: function (cmd, factory) {
            this.__commandFactories[cmd] = factory
        }, getCommandFactory: function (cmd) {
            return this.__commandFactories[cmd]
        }, getCmd: function (content, defaultValue) {
            return Converter.getString(content['command'], defaultValue)
        }, parseCommand: function (content) {
            if (!content) {
                return null
            } else if (Interface.conforms(content, Command)) {
                return content
            }
            var info = Wrapper.fetchMap(content);
            if (!info) {
                return null
            }
            var cmd = this.getCmd(info, '');
            var factory = this.getCommandFactory(cmd);
            if (!factory) {
                factory = default_factory(info)
            }
            return factory.parseCommand(info)
        }
    });
    var default_factory = function (info) {
        var man = ns.dkd.MessageFactoryManager;
        var gf = man.generalFactory;
        var type = gf.getContentType(info, 0);
        var factory = gf.getContentFactory(type);
        if (Interface.conforms(factory, Command.Factory)) {
            return factory
        }
        return null
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.dkd.cmd.CommandGeneralFactory = GeneralFactory;
    ns.dkd.cmd.CommandFactoryManager = FactoryManager
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Converter = ns.type.Converter;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = null;
            to = null;
            when = null
        } else if (arguments.length === 2 || arguments.length === 3) {
            from = arguments[0];
            to = arguments[1];
            if (arguments.length === 2) {
                when = new Date()
            } else {
                when = arguments[2];
                if (when === null || when === 0) {
                    when = new Date()
                } else {
                    when = Converter.getDateTime(when, null)
                }
            }
            env = {'sender': from.toString(), 'receiver': to.toString(), 'time': when.getTime() / 1000.0}
        } else {
            throw new SyntaxError('envelope arguments error: ' + arguments);
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when
    };
    Class(MessageEnvelope, Dictionary, [Envelope], {
        getSender: function () {
            var sender = this.__sender;
            if (!sender) {
                sender = ID.parse(this.getValue('sender'));
                this.__sender = sender
            }
            return sender
        }, getReceiver: function () {
            var receiver = this.__receiver;
            if (!receiver) {
                receiver = ID.parse(this.getValue('receiver'));
                if (!receiver) {
                    receiver = ID.ANYONE
                }
                this.__receiver = receiver
            }
            return receiver
        }, getTime: function () {
            var time = this.__time;
            if (!time) {
                time = this.getDateTime('time', null);
                this.__time = time
            }
            return time
        }, getGroup: function () {
            return ID.parse(this.getValue('group'))
        }, setGroup: function (identifier) {
            this.setString('group', identifier)
        }, getType: function () {
            return this.getInt('type', null)
        }, setType: function (type) {
            this.setValue('type', type)
        }
    });
    ns.msg.MessageEnvelope = MessageEnvelope
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap()
        }
        Dictionary.call(this, msg);
        this.__envelope = env
    };
    Class(BaseMessage, Dictionary, [Message], {
        getEnvelope: function () {
            var env = this.__envelope;
            if (!env) {
                env = Envelope.parse(this.toMap());
                this.__envelope = env
            }
            return env
        }, getSender: function () {
            var env = this.getEnvelope();
            return env.getSender()
        }, getReceiver: function () {
            var env = this.getEnvelope();
            return env.getReceiver()
        }, getTime: function () {
            var env = this.getEnvelope();
            return env.getTime()
        }, getGroup: function () {
            var env = this.getEnvelope();
            return env.getGroup()
        }, getType: function () {
            var env = this.getEnvelope();
            return env.getTime()
        }
    });
    BaseMessage.isBroadcast = function (msg) {
        if (msg.getReceiver().isBroadcast()) {
            return true
        }
        var group = ID.parse(msg.getValue('group'));
        if (!group) {
            return false
        }
        return group.isBroadcast()
    };
    ns.msg.BaseMessage = BaseMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = null;
            body = null
        } else if (arguments.length === 2) {
            head = arguments[0];
            body = arguments[1];
            msg = head.toMap();
            msg['content'] = body.toMap()
        } else {
            throw new SyntaxError('message arguments error: ' + arguments);
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body
    };
    Class(PlainMessage, BaseMessage, [InstantMessage], {
        getTime: function () {
            var body = this.getContent();
            var time = body.getTime();
            if (time) {
                return time
            }
            var head = this.getEnvelope();
            return head.getTime()
        }, getGroup: function () {
            var body = this.getContent();
            return body.getGroup()
        }, getType: function () {
            var body = this.getContent();
            return body.getType()
        }, getContent: function () {
            var body = this.__content;
            if (!body) {
                body = Content.parse(this.getValue('content'));
                this.__content = body
            }
            return body
        }, setContent: function (body) {
            this.setMap('content', body);
            this.__content = body
        }
    });
    ns.msg.PlainMessage = PlainMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var UTF8 = ns.format.UTF8;
    var TransportableData = ns.format.TransportableData;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null
    };
    Class(EncryptedMessage, BaseMessage, [SecureMessage], {
        getData: function () {
            var data = this.__data;
            if (!data) {
                var base64 = this.getValue('data');
                if (!base64) {
                    throw new ReferenceError('message data not found: ' + this);
                } else if (!BaseMessage.isBroadcast(this)) {
                    data = TransportableData.decode(base64)
                } else if (IObject.isString(base64)) {
                    data = UTF8.encode(base64)
                } else {
                    throw new ReferenceError('message data error: ' + base64);
                }
                this.__data = data
            }
            return data
        }, getEncryptedKey: function () {
            var ted = this.__key;
            if (!ted) {
                var base64 = this.getValue('key');
                if (!base64) {
                    var keys = this.getEncryptedKeys();
                    if (keys) {
                        var receiver = this.getReceiver();
                        base64 = keys[receiver.toString()]
                    }
                }
                ted = TransportableData.parse(base64);
                this.__key = ted
            }
            return !ted ? null : ted.getData()
        }, getEncryptedKeys: function () {
            var keys = this.__keys;
            if (!keys) {
                keys = this.getValue('keys');
                this.__keys = keys
            }
            return keys
        }
    });
    ns.msg.EncryptedMessage = EncryptedMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var TransportableData = ns.format.TransportableData;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.msg.EncryptedMessage;
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null
    };
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {
        getSignature: function () {
            var ted = this.__signature;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__signature = ted
            }
            return !ted ? null : ted.getData()
        }
    });
    ns.msg.NetworkMessage = NetworkMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var UTF8 = ns.format.UTF8;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var getGroupSeed = function (group_id) {
        var name = group_id.getName();
        if (name) {
            var len = name.length;
            if (len === 0) {
                return null
            } else if (name === 8 && name.toLowerCase() === 'everyone') {
                return null
            }
        }
        return name
    };
    var getBroadcastFounder = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return ID.FOUNDER
        } else {
            return ID.parse(name + '.founder@anywhere')
        }
    };
    var getBroadcastOwner = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return ID.ANYONE
        } else {
            return ID.parse(name + '.owner@anywhere')
        }
    };
    var getBroadcastMembers = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return [ID.ANYONE]
        } else {
            var owner = ID.parse(name + '.owner@anywhere');
            var member = ID.parse(name + '.member@anywhere');
            return [owner, member]
        }
    };
    var checkMeta = function (meta) {
        var pKey = meta.getPublicKey();
        if (!pKey) {
            return false
        }
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        if (!seed || seed.length === 0) {
            return !fingerprint || fingerprint.length === 0
        } else if (!fingerprint || fingerprint.length === 0) {
            return false
        }
        var data = UTF8.encode(seed);
        return pKey.verify(data, fingerprint)
    };
    var matchIdentifier = function (identifier, meta) {
        var seed = meta.getSeed();
        var name = identifier.getName();
        if (seed !== name) {
            return false
        }
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen)
    };
    var matchPublicKey = function (pKey, meta) {
        if (meta.getPublicKey().equals(pKey)) {
            return true
        }
        var seed = meta.getSeed();
        if (seed && seed.length > 0) {
            var data = UTF8.encode(seed);
            var fingerprint = meta.getFingerprint();
            return pKey.verify(data, fingerprint)
        } else {
            return false
        }
    };
    var isBefore = function (oldTime, thisTime) {
        if (!oldTime || !thisTime) {
            return false
        }
        return thisTime.getTime() < oldTime.getTime()
    };
    var isExpired = function (thisDoc, oldDoc) {
        var thisTime = thisDoc.getTime();
        var oldTime = oldDoc.getTime();
        return isBefore(oldTime, thisTime)
    };
    var lastDocument = function (documents, type) {
        if (!documents || documents.length === 0) {
            return null
        } else if (!type || type === '*') {
            type = ''
        }
        var checkType = type.length > 0;
        var last = null;
        var doc, docType, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            if (checkType) {
                docType = doc.getType();
                matched = !docType || docType.length === 0 || docType === type;
                if (!matched) {
                    continue
                }
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    var lastVisa = function (documents) {
        if (!documents || documents.length === 0) {
            return null
        }
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            matched = Interface.conforms(doc, Visa);
            if (!matched) {
                continue
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    var lastBulletin = function (documents) {
        if (!documents || documents.length === 0) {
            return null
        }
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            matched = Interface.conforms(doc, Bulletin);
            if (!matched) {
                continue
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    ns.mkm.BroadcastHelper = {
        getGroupSeed: getGroupSeed,
        getBroadcastFounder: getBroadcastFounder,
        getBroadcastOwner: getBroadcastOwner,
        getBroadcastMembers: getBroadcastMembers
    };
    ns.mkm.MetaHelper = {checkMeta: checkMeta, matchIdentifier: matchIdentifier, matchPublicKey: matchPublicKey}
    ns.mkm.DocumentHelper = {
        isBefore: isBefore,
        isExpired: isExpired,
        lastDocument: lastDocument,
        lastVisa: lastVisa,
        lastBulletin: lastBulletin
    }
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var PublicKey = ns.crypto.PublicKey;
    var Meta = ns.protocol.Meta;
    var MetaHelper = ns.mkm.MetaHelper;
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var status;
        var meta;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = null;
            key = null;
            seed = null;
            fingerprint = null;
            status = 0
        } else if (arguments.length === 2) {
            type = arguments[0];
            key = arguments[1];
            seed = null;
            fingerprint = null;
            status = 1;
            meta = {'type': type, 'key': key.toMap()}
        } else if (arguments.length === 4) {
            type = arguments[0];
            key = arguments[1];
            seed = arguments[2];
            fingerprint = arguments[3];
            status = 1;
            meta = {'type': type, 'key': key.toMap(), 'seed': seed, 'fingerprint': fingerprint.toObject()}
        } else {
            throw new SyntaxError('meta arguments error: ' + arguments);
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
        this.__status = status
    };
    Class(BaseMeta, Dictionary, [Meta], {
        getType: function () {
            var type = this.__type;
            if (type === null) {
                var man = ns.mkm.AccountFactoryManager;
                type = man.generalFactory.getMetaType(this.toMap(), '');
                this.__type = type
            }
            return type
        }, getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                var info = this.getValue('key');
                key = PublicKey.parse(info);
                this.__key = key
            }
            return key
        }, hasSeed: function () {
            return this.__seed || this.getValue('seed')
        }, getSeed: function () {
            var seed = this.__seed;
            if (seed === null && this.hasSeed()) {
                seed = this.getString('seed', null);
                this.__seed = seed
            }
            return seed
        }, getFingerprint: function () {
            var ted = this.__fingerprint;
            if (!ted && this.hasSeed()) {
                var base64 = this.getValue('fingerprint');
                ted = TransportableData.parse(base64);
                this.__fingerprint = ted
            }
            return !ted ? null : ted.getData()
        }, isValid: function () {
            if (this.__status === 0) {
                if (MetaHelper.checkMeta(this)) {
                    this.__status = 1
                } else {
                    this.__status = -1
                }
            }
            return this.__status > 0
        }, matchIdentifier: function (identifier) {
            return MetaHelper.matchIdentifier(identifier, this)
        }, matchPublicKey: function (pKey) {
            return MetaHelper.matchPublicKey(pKey, this)
        }
    });
    ns.mkm.BaseMeta = BaseMeta
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Converter = ns.type.Converter;
    var UTF8 = ns.format.UTF8;
    var JsON = ns.format.JSON;
    var TransportableData = ns.format.TransportableData;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var BaseDocument = function () {
        var map, status;
        var identifier, data, signature;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            status = 0;
            identifier = null;
            data = null;
            signature = null;
            properties = null
        } else if (arguments.length === 2) {
            identifier = arguments[0];
            var type = arguments[1];
            map = {'ID': identifier.toString()};
            status = 0;
            data = null;
            signature = null;
            var now = new Date();
            properties = {'type': type, 'created_time': (now.getTime() / 1000.0)}
        } else if (arguments.length === 3) {
            identifier = arguments[0];
            data = arguments[1];
            signature = arguments[2];
            map = {'ID': identifier.toString(), 'data': data, 'signature': signature.toObject()}
            status = 1;
            properties = null
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;
        this.__sig = signature;
        this.__properties = properties;
        this.__status = status
    };
    Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0
        }, getType: function () {
            var type = this.getProperty('type');
            if (!type) {
                var man = ns.mkm.AccountFactoryManager;
                var gf = man.generalFactory;
                type = gf.getDocumentType(this.toMap(), null)
            }
            return type
        }, getIdentifier: function () {
            var did = this.__identifier;
            if (!did) {
                did = ID.parse(this.getValue('ID'))
                this.__identifier = did
            }
            return did
        }, getData: function () {
            var base64 = this.__json;
            if (!base64) {
                base64 = this.getString('data', null);
                this.__json = base64
            }
            return base64
        }, getSignature: function () {
            var ted = this.__sig;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__sig = ted
            }
            if (!ted) {
                return null
            }
            return ted.getData()
        }, allProperties: function () {
            if (this.__status < 0) {
                return null
            }
            var dict = this.__properties;
            if (!dict) {
                var json = this.getData();
                if (json) {
                    dict = JsON.decode(json)
                } else {
                    dict = {}
                }
                this.__properties = dict
            }
            return dict
        }, getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null
            }
            return dict[name]
        }, setProperty: function (name, value) {
            this.__status = 0;
            var dict = this.allProperties();
            if (value) {
                dict[name] = value
            } else {
                delete dict[name]
            }
            this.removeValue('data');
            this.removeValue('signature');
            this.__json = null;
            this.__sig = null
        }, verify: function (publicKey) {
            if (this.__status > 0) {
                return true
            }
            var data = this.getData();
            var signature = this.getSignature();
            if (!data) {
                if (!signature) {
                    this.__status = 0
                } else {
                    this.__status = -1
                }
            } else if (!signature) {
                this.__status = -1
            } else if (publicKey.verify(UTF8.encode(data), signature)) {
                this.__status = 1
            }
            return this.__status === 1
        }, sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature()
            }
            var now = new Date();
            this.setProperty('time', now.getTime() / 1000.0);
            var dict = this.allProperties();
            if (!dict) {
                return null
            }
            var data = JsON.encode(dict);
            if (!data || data.length === 0) {
                return null
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                return null
            }
            var ted = TransportableData.create(signature);
            this.setValue('data', data);
            this.setValue('signature', ted.toObject());
            this.__json = data;
            this.__sig = ted;
            this.__status = 1;
            return signature
        }, getTime: function () {
            var timestamp = this.getProperty('time');
            return Converter.getDateTime(timestamp, null)
        }, getName: function () {
            var name = this.getProperty('name');
            return Converter.getString(name, null)
        }, setName: function (name) {
            this.setProperty('name', name)
        }
    });
    ns.mkm.BaseDocument = BaseDocument
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, arguments[0], Document.VISA)
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        }
        this.__key = null;
        this.__avatar = null
    };
    Class(BaseVisa, BaseDocument, [Visa], {
        getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                var info = this.getProperty('key');
                key = PublicKey.parse(info);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key
                } else {
                    key = null
                }
            }
            return key
        }, setPublicKey: function (pKey) {
            if (!pKey) {
                this.setProperty('key', null)
            } else {
                this.setProperty('key', pKey.toMap())
            }
            this.__key = pKey
        }, getAvatar: function () {
            var pnf = this.__avatar;
            if (!pnf) {
                var url = this.getProperty('avatar');
                pnf = PortableNetworkFile.parse(url);
                this.__avatar = pnf
            }
            return pnf
        }, setAvatar: function (pnf) {
            if (!pnf) {
                this.setProperty('avatar', null)
            } else {
                this.setProperty('avatar', pnf.toObject())
            }
            this.__avatar = pnf
        }
    });
    ns.mkm.BaseVisa = BaseVisa
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, arguments[0], Document.BULLETIN)
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        }
        this.__assistants = null
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {
        getFounder: function () {
            return ID.parse(this.getProperty('founder'))
        }, getAssistants: function () {
            var bots = this.__assistants;
            if (!bots) {
                var assistants = this.getProperty('assistants');
                if (assistants) {
                    bots = ID.convert(assistants)
                } else {
                    var single = ID.parse(this.getProperty('assistant'));
                    bots = !single ? [] : [single]
                }
                this.__assistants = bots
            }
            return bots
        }, setAssistants: function (bots) {
            if (bots) {
                this.setProperty('assistants', ID.revert(bots))
            } else {
                this.setProperty('assistants', null)
            }
            this.setProperty('assistant', null);
            this.__assistants = bots
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Entity = Interface(null, [IObject]);
    Entity.prototype.getIdentifier = function () {
    };
    Entity.prototype.getType = function () {
    };
    Entity.prototype.getMeta = function () {
    };
    Entity.prototype.getDocuments = function () {
    };
    Entity.prototype.setDataSource = function (barrack) {
    };
    Entity.prototype.getDataSource = function () {
    };
    var EntityDataSource = Interface(null, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
    };
    EntityDataSource.prototype.getDocuments = function (identifier) {
    };
    var EntityDelegate = Interface(null, null);
    EntityDelegate.prototype.getUser = function (identifier) {
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
    ns.mkm.EntityDelegate = EntityDelegate;
    ns.mkm.EntityDataSource = EntityDataSource
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__barrack = null
    };
    Class(BaseEntity, BaseObject, [Entity], null);
    BaseEntity.prototype.equals = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return false
        } else if (Interface.conforms(other, Entity)) {
            other = other.getIdentifier()
        }
        return this.__identifier.equals(other)
    };
    BaseEntity.prototype.valueOf = function () {
        return desc.call(this)
    };
    BaseEntity.prototype.toString = function () {
        return desc.call(this)
    };
    var desc = function () {
        var clazz = Object.getPrototypeOf(this).constructor.name;
        var id = this.__identifier;
        var network = id.getAddress().getType();
        return '<' + clazz + ' id="' + id.toString() + '" network="' + network + '" />'
    };
    BaseEntity.prototype.setDataSource = function (barrack) {
        this.__barrack = barrack
    };
    BaseEntity.prototype.getDataSource = function () {
        return this.__barrack
    };
    BaseEntity.prototype.getIdentifier = function () {
        return this.__identifier
    };
    BaseEntity.prototype.getType = function () {
        return this.__identifier.getType()
    };
    BaseEntity.prototype.getMeta = function () {
        var delegate = this.getDataSource();
        return delegate.getMeta(this.__identifier)
    };
    BaseEntity.prototype.getDocuments = function () {
        var delegate = this.getDataSource();
        return delegate.getDocuments(this.__identifier)
    };
    ns.mkm.BaseEntity = BaseEntity
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var User = Interface(null, [Entity]);
    User.prototype.getVisa = function () {
    };
    User.prototype.getContacts = function () {
    };
    User.prototype.verify = function (data, signature) {
    };
    User.prototype.encrypt = function (plaintext) {
    };
    User.prototype.sign = function (data) {
    };
    User.prototype.decrypt = function (ciphertext) {
    };
    User.prototype.signVisa = function (doc) {
    };
    User.prototype.verifyVisa = function (doc) {
    };
    var UserDataSource = Interface(null, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (identifier) {
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier)
    };
    Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var docs = this.getDocuments();
            return DocumentHelper.lastVisa(docs)
        }, getContacts: function () {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            return barrack.getContacts(user)
        }, verify: function (data, signature) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var keys = barrack.getPublicKeysForVerification(user);
            for (var i = 0; i < keys.length; ++i) {
                if (keys[i].verify(data, signature)) {
                    return true
                }
            }
            return false
        }, encrypt: function (plaintext) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var key = barrack.getPublicKeyForEncryption(user);
            return key.encrypt(plaintext)
        }, sign: function (data) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(user);
            return key.sign(data)
        }, decrypt: function (ciphertext) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var keys = barrack.getPrivateKeysForDecryption(user);
            var plaintext;
            for (var i = 0; i < keys.length; ++i) {
                try {
                    plaintext = keys[i].decrypt(ciphertext);
                    if (plaintext && plaintext.length > 0) {
                        return plaintext
                    }
                } catch (e) {
                }
            }
            return null
        }, signVisa: function (doc) {
            var user = this.getIdentifier();
            var barrack = this.getDataSource();
            var key = barrack.getPrivateKeyForVisaSignature(user);
            var sig = doc.sign(key);
            if (!sig) {
                return null
            }
            return doc
        }, verifyVisa: function (doc) {
            var uid = this.getIdentifier();
            if (!uid.equals(doc.getIdentifier())) {
                return false
            }
            var meta = this.getMeta();
            var key = meta.getPublicKey();
            return doc.verify(key)
        }
    });
    ns.mkm.BaseUser = BaseUser
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var Group = Interface(null, [Entity]);
    Group.prototype.getBulletin = function () {
    };
    Group.prototype.getFounder = function () {
    };
    Group.prototype.getOwner = function () {
    };
    Group.prototype.getMembers = function () {
    };
    Group.prototype.getAssistants = function () {
    };
    var GroupDataSource = Interface(null, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null
    };
    Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var docs = this.getDocuments();
            return DocumentHelper.lastBulletin(docs)
        }, getFounder: function () {
            var founder = this.__founder;
            if (!founder) {
                var barrack = this.getDataSource();
                var group = this.getIdentifier();
                founder = barrack.getFounder(group);
                this.__founder = founder
            }
            return founder
        }, getOwner: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getOwner(group)
        }, getMembers: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getMembers(group)
        }, getAssistants: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getAssistants(group)
        }
    });
    ns.mkm.BaseGroup = BaseGroup
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var EntityType = ns.protocol.EntityType;
    var Entity = ns.mkm.Entity;
    var User = ns.mkm.User;
    var Group = ns.mkm.Group;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BroadcastHelper = ns.mkm.BroadcastHelper;
    var Barrack = function () {
        Object.call(this);
        this.__users = {};
        this.__groups = {}
    };
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {
        cacheUser: function (user) {
            var delegate = user.getDataSource();
            if (!delegate) {
                user.setDataSource(this)
            }
            this.__users[user.getIdentifier()] = user
        }, cacheGroup: function (group) {
            var delegate = group.getDataSource();
            if (!delegate) {
                group.setDataSource(this)
            }
            this.__groups[group.getIdentifier()] = group
        }, reduceMemory: function () {
            var finger = 0;
            finger = thanos(this.__users, finger);
            finger = thanos(this.__groups, finger);
            return finger >> 1
        }, createUser: function (identifier) {
        }, createGroup: function (identifier) {
        }, getVisaKey: function (identifier) {
            var doc = this.getVisa(identifier);
            return !doc ? null : doc.getPublicKey()
        }, getMetaKey: function (identifier) {
            var meta = this.getMeta(identifier);
            return !meta ? null : meta.getPublicKey()
        }, getVisa: function (identifier) {
            return DocumentHelper.lastVisa(this.getDocuments(identifier))
        }, getBulletin: function (identifier) {
            return DocumentHelper.lastBulletin(this.getDocuments(identifier))
        }, getUser: function (identifier) {
            var user = this.__users[identifier];
            if (!user) {
                user = this.createUser(identifier);
                if (user) {
                    this.cacheUser(user)
                }
            }
            return user
        }, getGroup: function (identifier) {
            var group = this.__groups[identifier];
            if (!group) {
                group = this.createGroup(identifier);
                if (group) {
                    this.cacheGroup(group)
                }
            }
            return group
        }, getPublicKeyForEncryption: function (identifier) {
            var key = this.getVisaKey(identifier);
            if (key) {
                return key
            }
            key = this.getMetaKey(identifier);
            if (Interface.conforms(key, EncryptKey)) {
                return key
            }
            return null
        }, getPublicKeysForVerification: function (identifier) {
            var keys = [];
            var key = this.getVisaKey(identifier);
            if (Interface.conforms(key, VerifyKey)) {
                keys.push(key)
            }
            key = this.getMetaKey(identifier);
            if (key) {
                keys.push(key)
            }
            return keys
        }, getFounder: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastFounder(group)
            }
            var doc = this.getBulletin(group);
            if (doc) {
                return doc.getFounder()
            }
            return null
        }, getOwner: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastOwner(group)
            }
            if (EntityType.GROUP.equals(group.getType())) {
                return this.getFounder(group)
            }
            return null
        }, getMembers: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastMembers(group)
            }
            return []
        }, getAssistants: function (group) {
            var doc = this.getBulletin(group);
            if (doc) {
                var bots = doc.getAssistants();
                if (bots) {
                    return bots
                }
            }
            return []
        }
    });
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            finger += 1;
            if ((finger & 1) === 1) {
                delete planet[k]
            }
        }
        return finger
    };
    ns.Barrack = Barrack;
    ns.mkm.thanos = thanos
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Packer = Interface(null, null);
    Packer.prototype.encryptMessage = function (iMsg) {
    };
    Packer.prototype.signMessage = function (sMsg) {
    };
    Packer.prototype.serializeMessage = function (rMsg) {
    };
    Packer.prototype.deserializeMessage = function (data) {
    };
    Packer.prototype.verifyMessage = function (rMsg) {
    };
    Packer.prototype.decryptMessage = function (sMsg) {
    };
    ns.Packer = Packer
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Processor = Interface(null, null);
    Processor.prototype.processPackage = function (data) {
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
    };
    Processor.prototype.processContent = function (content, rMsg) {
    };
    ns.Processor = Processor
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var UTF8 = ns.format.UTF8;
    var JsON = ns.format.JSON;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var Transceiver = function () {
        Object.call(this)
    };
    Class(Transceiver, Object, [InstantMessage.Delegate, SecureMessage.Delegate, ReliableMessage.Delegate], null);
    Transceiver.prototype.getEntityDelegate = function () {
    };
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        var dict = content.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json)
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data, iMsg.toMap())
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (BaseMessage.isBroadcast(iMsg)) {
            return null
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json)
    };
    Transceiver.prototype.encryptKey = function (keyData, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        if (!contact) {
            return null
        }
        return contact.encrypt(keyData)
    };
    Transceiver.prototype.decryptKey = function (keyData, receiver, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(receiver);
        if (!user) {
            return null
        }
        return user.decrypt(keyData)
    };
    Transceiver.prototype.deserializeKey = function (keyData, sMsg) {
        if (!keyData) {
            return null
        }
        var json = UTF8.decode(keyData);
        if (!json) {
            return null
        }
        var dict = JsON.decode(json);
        return SymmetricKey.parse(dict)
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data, sMsg.toMap())
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        if (!json) {
            return null
        }
        var dict = JsON.decode(json);
        return Content.parse(dict)
    };
    Transceiver.prototype.signData = function (data, sMsg) {
        var barrack = this.getEntityDelegate();
        var sender = sMsg.getSender();
        var user = barrack.getUser(sender);
        return user.sign(data)
    };
    Transceiver.prototype.verifyDataSignature = function (data, signature, rMsg) {
        var barrack = this.getEntityDelegate();
        var sender = rMsg.getSender();
        var contact = barrack.getUser(sender);
        if (!contact) {
            return false
        }
        return contact.verify(data, signature)
    };
    ns.Transceiver = Transceiver
})(DIMP);
