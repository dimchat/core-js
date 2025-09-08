/**
 * DIMP - Decentralized Instant Messaging Protocol (v2.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Aug. 20, 2025
 * @copyright (c) 2020-2025 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
(function (dkd, mkm, mk) {
    if (typeof mk.crypto !== 'object') {
        mk.crypto = {}
    }
    if (typeof dkd.dkd !== 'object') {
        dkd.dkd = {}
    }
    if (typeof dkd.msg !== 'object') {
        dkd.msg = {}
    }
    var Interface = mk.type.Interface;
    var Class = mk.type.Class;
    var Implementation = mk.type.Implementation;
    var IObject = mk.type.Object;
    var Dictionary = mk.type.Dictionary;
    var Converter = mk.type.Converter;
    var Base64 = mk.format.Base64;
    var Base58 = mk.format.Base58;
    var Hex = mk.format.Hex;
    var UTF8 = mk.format.UTF8;
    var JSONMap = mk.format.JSONMap;
    var TransportableData = mk.protocol.TransportableData;
    var PortableNetworkFile = mk.protocol.PortableNetworkFile;
    var CryptographyKey = mk.protocol.CryptographyKey;
    var EncryptKey = mk.protocol.EncryptKey;
    var SymmetricKey = mk.protocol.SymmetricKey;
    var AsymmetricKey = mk.protocol.AsymmetricKey;
    var PrivateKey = mk.protocol.PrivateKey;
    var PublicKey = mk.protocol.PublicKey;
    var GeneralCryptoHelper = mk.ext.GeneralCryptoHelper;
    var SharedCryptoExtensions = mk.ext.SharedCryptoExtensions;
    var ID = mkm.protocol.ID;
    var Meta = mkm.protocol.Meta;
    var Document = mkm.protocol.Document;
    var SharedAccountExtensions = mkm.ext.SharedAccountExtensions;
    var Envelope = dkd.protocol.Envelope;
    var Content = dkd.protocol.Content;
    var Message = dkd.protocol.Message;
    var InstantMessage = dkd.protocol.InstantMessage;
    var SecureMessage = dkd.protocol.SecureMessage;
    var ReliableMessage = dkd.protocol.ReliableMessage;
    var SharedMessageExtensions = dkd.ext.SharedMessageExtensions;
    mk.protocol.AsymmetricAlgorithms = {RSA: 'RSA', ECC: 'ECC'};
    var AsymmetricAlgorithms = mk.protocol.AsymmetricAlgorithms;
    mk.protocol.SymmetricAlgorithms = {AES: 'AES', DES: 'DES', PLAIN: 'PLAIN'};
    var SymmetricAlgorithms = mk.protocol.SymmetricAlgorithms;
    mk.protocol.EncodeAlgorithms = {DEFAULT: 'base64', BASE_64: 'base64', BASE_58: 'base58', HEX: 'hex'};
    var EncodeAlgorithms = mk.protocol.EncodeAlgorithms;
    mkm.protocol.MetaType = {
        DEFAULT: '' + (1),
        MKM: '' + (1),
        BTC: '' + (2),
        ExBTC: '' + (3),
        ETH: '' + (4),
        ExETH: '' + (5)
    };
    var MetaType = mkm.protocol.MetaType;
    mkm.protocol.DocumentType = {VISA: 'visa', PROFILE: 'profile', BULLETIN: 'bulletin'};
    var DocumentType = mkm.protocol.DocumentType;
    mkm.protocol.Visa = Interface(null, [Document]);
    var Visa = mkm.protocol.Visa;
    Visa.prototype.getPublicKey = function () {
    };
    Visa.prototype.setPublicKey = function (pKey) {
    };
    Visa.prototype.getAvatar = function () {
    };
    Visa.prototype.setAvatar = function (image) {
    };
    mkm.protocol.Bulletin = Interface(null, [Document]);
    var Bulletin = mkm.protocol.Bulletin;
    Bulletin.prototype.getFounder = function () {
    };
    Bulletin.prototype.getAssistants = function () {
    };
    Bulletin.prototype.setAssistants = function (bots) {
    };
    dkd.protocol.ContentType = {
        ANY: '' + (0x00),
        TEXT: '' + (0x01),
        FILE: '' + (0x10),
        IMAGE: '' + (0x12),
        AUDIO: '' + (0x14),
        VIDEO: '' + (0x16),
        PAGE: '' + (0x20),
        NAME_CARD: '' + (0x33),
        QUOTE: '' + (0x37),
        MONEY: '' + (0x40),
        TRANSFER: '' + (0x41),
        LUCKY_MONEY: '' + (0x42),
        CLAIM_PAYMENT: '' + (0x48),
        SPLIT_BILL: '' + (0x49),
        COMMAND: '' + (0x88),
        HISTORY: '' + (0x89),
        APPLICATION: '' + (0xA0),
        ARRAY: '' + (0xCA),
        CUSTOMIZED: '' + (0xCC),
        COMBINE_FORWARD: '' + (0xCF),
        FORWARD: '' + (0xFF)
    };
    var ContentType = dkd.protocol.ContentType;
    dkd.protocol.TextContent = Interface(null, [Content]);
    var TextContent = dkd.protocol.TextContent;
    TextContent.prototype.getText = function () {
    };
    TextContent.create = function (text) {
        return new BaseTextContent(text)
    };
    dkd.protocol.PageContent = Interface(null, [Content]);
    var PageContent = dkd.protocol.PageContent;
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
        var content = new WebPageContent();
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
    dkd.protocol.NameCard = Interface(null, [Content]);
    var NameCard = dkd.protocol.NameCard;
    NameCard.prototype.getIdentifier = function () {
    };
    NameCard.prototype.getName = function () {
    };
    NameCard.prototype.getAvatar = function () {
    };
    NameCard.create = function (identifier, mame, avatar) {
        var content = new NameCardContent(identifier);
        content.setName(name);
        content.setAvatar(avatar);
        return content
    };
    dkd.protocol.FileContent = Interface(null, [Content]);
    var FileContent = dkd.protocol.FileContent;
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
    var _init_file_content = function (content, data, filename, url, password) {
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
        var content;
        if (type === ContentType.IMAGE) {
            content = new ImageFileContent()
        } else if (type === ContentType.AUDIO) {
            content = new AudioFileContent()
        } else if (type === ContentType.VIDEO) {
            content = new VideoFileContent()
        } else {
            content = new BaseFileContent(type)
        }
        return _init_file_content(content, data, filename, url, password)
    };
    FileContent.file = function (data, filename, url, password) {
        var content = new BaseFileContent();
        return _init_file_content(content, data, filename, url, password)
    };
    FileContent.image = function (data, filename, url, password) {
        var content = new ImageFileContent();
        return _init_file_content(content, data, filename, url, password)
    };
    FileContent.audio = function (data, filename, url, password) {
        var content = new AudioFileContent();
        return _init_file_content(content, data, filename, url, password)
    };
    FileContent.video = function (data, filename, url, password) {
        var content = new VideoFileContent();
        return _init_file_content(content, data, filename, url, password)
    };
    dkd.protocol.ImageContent = Interface(null, [FileContent]);
    var ImageContent = dkd.protocol.ImageContent;
    ImageContent.prototype.setThumbnail = function (image) {
    };
    ImageContent.prototype.getThumbnail = function () {
    };
    dkd.protocol.VideoContent = Interface(null, [FileContent]);
    var VideoContent = dkd.protocol.VideoContent;
    VideoContent.prototype.setSnapshot = function (image) {
    };
    VideoContent.prototype.getSnapshot = function () {
    };
    dkd.protocol.AudioContent = Interface(null, [FileContent]);
    var AudioContent = dkd.protocol.AudioContent;
    AudioContent.prototype.setText = function (asr) {
    };
    AudioContent.prototype.getText = function () {
    };
    dkd.protocol.ForwardContent = Interface(null, [Content]);
    var ForwardContent = dkd.protocol.ForwardContent;
    ForwardContent.prototype.getForward = function () {
    };
    ForwardContent.prototype.getSecrets = function () {
    };
    ForwardContent.create = function (secrets) {
        return new SecretContent(secrets)
    };
    dkd.protocol.CombineContent = Interface(null, [Content]);
    var CombineContent = dkd.protocol.CombineContent;
    CombineContent.prototype.getTitle = function () {
    };
    CombineContent.prototype.getMessages = function () {
    };
    ForwardContent.create = function (title, messages) {
        return new CombineForwardContent(title, messages)
    };
    dkd.protocol.ArrayContent = Interface(null, [Content]);
    var ArrayContent = dkd.protocol.ArrayContent;
    ArrayContent.prototype.getContents = function () {
    };
    ArrayContent.create = function (contents) {
        return new ListContent(contents)
    };
    dkd.protocol.QuoteContent = Interface(null, [Content]);
    var QuoteContent = dkd.protocol.QuoteContent;
    QuoteContent.prototype.getText = function () {
    };
    QuoteContent.prototype.getOriginalEnvelope = function () {
    };
    QuoteContent.prototype.getOriginalSerialNumber = function () {
    };
    QuoteContent.create = function (text, head, body) {
        var origin = QuoteContent.purify(head);
        origin['type'] = body.getType();
        origin['sn'] = body.getSerialNumber();
        var group = body.getGroup();
        if (group) {
            origin['receiver'] = group.toString()
        }
        return new BaseQuoteContent(text, origin)
    };
    QuoteContent.purify = function (envelope) {
        var from = envelope.getSender();
        var to = envelope.getGroup();
        if (!to) {
            to = envelope.getReceiver()
        }
        return {'sender': from.toString(), 'receiver': to.toString()}
    };
    dkd.protocol.MoneyContent = Interface(null, [Content]);
    var MoneyContent = dkd.protocol.MoneyContent;
    MoneyContent.prototype.getCurrency = function () {
    };
    MoneyContent.prototype.setAmount = function (amount) {
    };
    MoneyContent.prototype.getAmount = function () {
    };
    MoneyContent.create = function (type, currency, amount) {
        return new BaseMoneyContent(type, currency, amount)
    };
    dkd.protocol.TransferContent = Interface(null, [MoneyContent]);
    var TransferContent = dkd.protocol.TransferContent;
    TransferContent.prototype.setRemitter = function (sender) {
    };
    TransferContent.prototype.getRemitter = function () {
    };
    TransferContent.prototype.setRemittee = function (receiver) {
    };
    TransferContent.prototype.getRemittee = function () {
    };
    TransferContent.create = function (currency, amount) {
        return new TransferMoneyContent(currency, amount)
    };
    dkd.protocol.AppContent = Interface(null, [Content]);
    var AppContent = dkd.protocol.AppContent;
    AppContent.prototype.getApplication = function () {
    };
    dkd.protocol.CustomizedContent = Interface(null, [AppContent]);
    var CustomizedContent = dkd.protocol.CustomizedContent;
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
            return new AppCustomizedContent(type, app, mod, act)
        } else if (arguments.length === 3) {
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
            return new AppCustomizedContent(app, mod, act)
        } else {
            throw new SyntaxError('customized content arguments error: ' + arguments);
        }
    };
    dkd.protocol.Command = Interface(null, [Content]);
    var Command = dkd.protocol.Command;
    Command.META = 'meta';
    Command.DOCUMENTS = 'documents';
    Command.RECEIPT = 'receipt';
    Command.prototype.getCmd = function () {
    };
    Command.parse = function (command) {
        var helper = CommandExtensions.getCommandHelper();
        return helper.parseCommand(command)
    };
    Command.setFactory = function (cmd, factory) {
        var helper = CommandExtensions.getCommandHelper();
        helper.setCommandFactory(cmd, factory)
    };
    Command.getFactory = function (cmd) {
        var helper = CommandExtensions.getCommandHelper();
        return helper.getCommandFactory(cmd)
    };
    Command.Factory = Interface(null, null);
    var CommandFactory = Command.Factory;
    CommandFactory.prototype.parseCommand = function (content) {
    };
    dkd.protocol.MetaCommand = Interface(null, [Command]);
    var MetaCommand = dkd.protocol.MetaCommand;
    MetaCommand.prototype.getIdentifier = function () {
    };
    MetaCommand.prototype.getMeta = function () {
    };
    MetaCommand.query = function (identifier) {
        return new BaseMetaCommand(identifier)
    };
    MetaCommand.response = function (identifier, meta) {
        var command = new BaseMetaCommand(identifier);
        command.setMeta(meta);
        return command
    };
    dkd.protocol.DocumentCommand = Interface(null, [MetaCommand]);
    var DocumentCommand = dkd.protocol.DocumentCommand;
    DocumentCommand.prototype.getDocuments = function () {
    };
    DocumentCommand.prototype.getLastTime = function () {
    };
    DocumentCommand.query = function (identifier, lastTime) {
        var command = new BaseDocumentCommand(identifier);
        if (lastTime) {
            command.setLastTime(lastTime)
        }
        return command
    };
    DocumentCommand.response = function (identifier, meta, docs) {
        var command = new BaseDocumentCommand(identifier);
        command.setMeta(meta);
        command.setDocuments(docs);
        return command
    };
    dkd.protocol.HistoryCommand = Interface(null, [Command]);
    var HistoryCommand = dkd.protocol.HistoryCommand;
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE = 'suicide';
    dkd.protocol.GroupCommand = Interface(null, [HistoryCommand]);
    var GroupCommand = dkd.protocol.GroupCommand;
    GroupCommand.FOUND = 'found';
    GroupCommand.ABDICATE = 'abdicate';
    GroupCommand.INVITE = 'invite';
    GroupCommand.EXPEL = 'expel';
    GroupCommand.JOIN = 'join';
    GroupCommand.QUIT = 'quit';
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
    var _command_init_members = function (content, members) {
        if (members instanceof Array) {
            content.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            content.setMember(members)
        } else {
            throw new TypeError('group members error: ' + members);
        }
        return content
    };
    GroupCommand.create = function (cmd, group, members) {
        var content = new BaseGroupCommand(cmd, group);
        if (members) {
            _command_init_members(content, members)
        }
        return content
    };
    GroupCommand.invite = function (group, members) {
        var content = new InviteGroupCommand(group);
        return _command_init_members(content, members)
    };
    GroupCommand.expel = function (group, members) {
        var content = new ExpelGroupCommand(group);
        return _command_init_members(content, members)
    };
    GroupCommand.join = function (group) {
        return new JoinGroupCommand(group)
    };
    GroupCommand.quit = function (group) {
        return new QuitGroupCommand(group)
    };
    GroupCommand.reset = function (group, members) {
        var content = new ResetGroupCommand(group, members);
        if (members instanceof Array) {
            content.setMembers(members)
        } else {
            throw new TypeError('reset members error: ' + members);
        }
        return content
    };
    var _command_init_admins = function (content, administrators, assistants) {
        if (administrators && administrators.length > 0) {
            content.setAdministrators(administrators)
        }
        if (assistants && assistants.length > 0) {
            content.setAssistants(assistants)
        }
        return content
    };
    GroupCommand.hire = function (group, administrators, assistants) {
        var content = new HireGroupCommand(group);
        return _command_init_admins(content, administrators, assistants)
    };
    GroupCommand.fire = function (group, administrators, assistants) {
        var content = new FireGroupCommand(group);
        return _command_init_admins(content, administrators, assistants)
    };
    GroupCommand.resign = function (group) {
        return new ResignGroupCommand(group)
    };
    dkd.protocol.InviteCommand = Interface(null, [GroupCommand]);
    var InviteCommand = dkd.protocol.InviteCommand;
    dkd.protocol.ExpelCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = dkd.protocol.ExpelCommand;
    dkd.protocol.JoinCommand = Interface(null, [GroupCommand]);
    var JoinCommand = dkd.protocol.JoinCommand;
    dkd.protocol.QuitCommand = Interface(null, [GroupCommand]);
    var QuitCommand = dkd.protocol.QuitCommand;
    dkd.protocol.ResetCommand = Interface(null, [GroupCommand]);
    var ResetCommand = dkd.protocol.ResetCommand;
    dkd.protocol.HireCommand = Interface(null, [GroupCommand]);
    var HireCommand = dkd.protocol.HireCommand;
    HireCommand.prototype.getAdministrators = function () {
    };
    HireCommand.prototype.setAdministrators = function (members) {
    };
    HireCommand.prototype.getAssistants = function () {
    };
    HireCommand.prototype.setAssistants = function (bots) {
    };
    dkd.protocol.FireCommand = Interface(null, [GroupCommand]);
    var FireCommand = dkd.protocol.FireCommand;
    FireCommand.prototype.getAdministrators = function () {
    };
    FireCommand.prototype.setAdministrators = function (members) {
    };
    FireCommand.prototype.getAssistants = function () {
    };
    FireCommand.prototype.setAssistants = function (bots) {
    };
    dkd.protocol.ResignCommand = Interface(null, [GroupCommand]);
    var ResignCommand = dkd.protocol.ResignCommand;
    dkd.protocol.ReceiptCommand = Interface(null, [Command]);
    var ReceiptCommand = dkd.protocol.ReceiptCommand;
    ReceiptCommand.prototype.getText = function () {
    };
    ReceiptCommand.prototype.getOriginalEnvelope = function () {
    };
    ReceiptCommand.prototype.getOriginalSerialNumber = function () {
    };
    ReceiptCommand.prototype.getOriginalSignature = function () {
    };
    ReceiptCommand.create = function (text, head, body) {
        var origin;
        if (!head) {
            origin = null
        } else if (!body) {
            origin = ReceiptCommand.purify(head)
        } else {
            origin = ReceiptCommand.purify(head);
            origin['sn'] = body.getSerialNumber()
        }
        var command = new BaseReceiptCommand(text, origin);
        if (body) {
            var group = body.getGroup();
            if (group) {
                command.setGroup(group)
            }
        }
        return command
    };
    ReceiptCommand.purify = function (envelope) {
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
    mk.crypto.BaseKey = function (dict) {
        Dictionary.call(this, dict)
    };
    var BaseKey = mk.crypto.BaseKey;
    Class(BaseKey, Dictionary, [CryptographyKey]);
    BaseKey.prototype.getAlgorithm = function () {
        return BaseKey.getKeyAlgorithm(this.toMap())
    };
    BaseKey.getKeyAlgorithm = function (key) {
        var helper = SharedCryptoExtensions.getHelper();
        var algorithm = helper.getKeyAlgorithm(key);
        return algorithm ? algorithm : ''
    };
    BaseKey.matchEncryptKey = function (pKey, sKey) {
        return GeneralCryptoHelper.matchSymmetricKeys(pKey, sKey)
    };
    BaseKey.matchSignKey = function (sKey, pKey) {
        return GeneralCryptoHelper.matchAsymmetricKeys(sKey, pKey)
    };
    BaseKey.symmetricKeyEquals = function (key1, key2) {
        if (key1 === key2) {
            return true
        }
        return BaseKey.matchEncryptKey(key1, key2)
    };
    BaseKey.privateKeyEquals = function (key1, key2) {
        if (key1 === key2) {
            return true
        }
        return BaseKey.matchSignKey(key1, key2)
    };
    mk.crypto.BaseSymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    var BaseSymmetricKey = mk.crypto.BaseSymmetricKey;
    Class(BaseSymmetricKey, Dictionary, [SymmetricKey]);
    BaseSymmetricKey.prototype.equals = function (other) {
        return Interface.conforms(other, SymmetricKey) && BaseKey.symmetricKeyEquals(other, this)
    };
    BaseSymmetricKey.prototype.matchEncryptKey = function (pKey) {
        return BaseKey.matchEncryptKey(pKey, this)
    };
    BaseSymmetricKey.prototype.getAlgorithm = function () {
        return BaseKey.getKeyAlgorithm(this.toMap())
    };
    mk.crypto.BaseAsymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    var BaseAsymmetricKey = mk.crypto.BaseAsymmetricKey;
    Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey]);
    BaseAsymmetricKey.prototype.getAlgorithm = function () {
        return BaseKey.getKeyAlgorithm(this.toMap())
    };
    mk.crypto.BasePrivateKey = function (dict) {
        Dictionary.call(this, dict)
    };
    var BasePrivateKey = mk.crypto.BasePrivateKey;
    Class(BasePrivateKey, Dictionary, [PrivateKey]);
    BasePrivateKey.prototype.equals = function (other) {
        return Interface.conforms(other, PrivateKey) && BaseKey.privateKeyEquals(other, this)
    };
    BasePrivateKey.prototype.getAlgorithm = function () {
        return BaseKey.getKeyAlgorithm(this.toMap())
    };
    mk.crypto.BasePublicKey = function (dict) {
        Dictionary.call(this, dict)
    };
    var BasePublicKey = mk.crypto.BasePublicKey;
    Class(BasePublicKey, Dictionary, [PublicKey]);
    BasePublicKey.prototype.matchSignKey = function (sKey) {
        return BaseKey.matchSignKey(sKey, this)
    };
    BasePublicKey.prototype.getAlgorithm = function () {
        return BaseKey.getKeyAlgorithm(this.toMap())
    };
    mk.format.BaseDataWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__data = null
    };
    var BaseDataWrapper = mk.format.BaseDataWrapper;
    Class(BaseDataWrapper, Dictionary, null);
    Implementation(BaseDataWrapper, {
        toString: function () {
            var encoded = this.getString('data', null);
            if (!encoded) {
                return ''
            }
            var alg = this.getString('algorithm', null);
            if (!alg || alg === EncodeAlgorithms.DEFAULT) {
                alg = ''
            }
            if (alg === '') {
                return encoded
            } else {
                return alg + ',' + encoded
            }
        }, encode: function (mimeType) {
            var encoded = this.getString('data', null);
            if (!encoded) {
                return ''
            }
            var alg = this.getAlgorithm();
            return 'data:' + mimeType + ';' + alg + ',' + encoded
        }, getAlgorithm: function () {
            var alg = this.getString('algorithm', null);
            if (!alg) {
                alg = EncodeAlgorithms.DEFAULT
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
                var encoded = this.getString('data', null);
                if (!encoded) {
                    return null
                } else {
                    var alg = this.getAlgorithm();
                    if (alg === EncodeAlgorithms.BASE_64) {
                        bin = Base64.decode(encoded)
                    } else if (alg === EncodeAlgorithms.BASE_58) {
                        bin = Base58.decode(encoded)
                    } else if (alg === EncodeAlgorithms.HEX) {
                        bin = Hex.decode(encoded)
                    } else {
                        throw new Error('data algorithm not support: ' + alg);
                    }
                }
                this.__data = bin
            }
            return bin
        }, setData: function (bin) {
            if (!bin) {
                this.removeValue('data')
            } else {
                var encoded = null;
                var alg = this.getAlgorithm();
                if (alg === EncodeAlgorithms.BASE_64) {
                    encoded = Base64.encode(bin)
                } else if (alg === EncodeAlgorithms.BASE_58) {
                    encoded = Base58.encode(bin)
                } else if (alg === EncodeAlgorithms.HEX) {
                    encoded = Hex.encode(bin)
                } else {
                    throw new Error('data algorithm not support: ' + alg);
                }
                this.setValue('data', encoded)
            }
            this.__data = bin
        }
    });
    mk.format.BaseFileWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__attachment = null;
        this.__password = null
    };
    var BaseFileWrapper = mk.format.BaseFileWrapper;
    Class(BaseFileWrapper, Dictionary, null);
    Implementation(BaseFileWrapper, {
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
            var ted;
            if (!bin) {
                ted = null;
                this.removeValue('data')
            } else {
                ted = TransportableData.create(bin);
                this.setValue('data', ted.toObject())
            }
            this.__attachment = ted
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
    mkm.mkm.BaseMeta = function () {
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
    var BaseMeta = mkm.mkm.BaseMeta;
    Class(BaseMeta, Dictionary, [Meta]);
    Implementation(BaseMeta, {
        getType: function () {
            var type = this.__type;
            if (type === null) {
                var helper = SharedAccountExtensions.getHelper();
                type = helper.getMetaType(this.toMap(), '');
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
                if (this.checkValid()) {
                    this.__status = 1
                } else {
                    this.__status = -1
                }
            }
            return this.__status > 0
        }, checkValid: function () {
            var key = this.getPublicKey();
            if (!key) {
                return false
            } else if (this.hasSeed()) {
            } else if (this.getValue('seed') || this.getValue('fingerprint')) {
                return false
            } else {
                return true
            }
            var name = this.getSeed();
            var signature = this.getFingerprint();
            if (!signature || !name) {
                return false
            }
            var data = UTF8.encode(name);
            return key.verify(data, signature)
        }
    });
    mkm.mkm.BaseDocument = function () {
        var map, status;
        var type;
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
            type = arguments[0];
            identifier = arguments[1];
            map = {'type': type, 'did': identifier.toString()};
            status = 0;
            data = null;
            signature = null;
            var now = new Date();
            properties = {'type': type, 'created_time': (now.getTime() / 1000.0)}
        } else if (arguments.length === 4) {
            type = arguments[0];
            identifier = arguments[1];
            data = arguments[2];
            signature = arguments[3];
            map = {'type': type, 'did': identifier.toString(), 'data': data, 'signature': signature.toObject()};
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
    var BaseDocument = mkm.mkm.BaseDocument;
    Class(BaseDocument, Dictionary, [Document]);
    Implementation(BaseDocument, {
        isValid: function () {
            return this.__status > 0
        }, getIdentifier: function () {
            var did = this.__identifier;
            if (!did) {
                did = ID.parse(this.getValue('did'));
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
                    dict = JSONMap.decode(json)
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
            if (!dict) {
            } else if (value) {
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
            var data = JSONMap.encode(dict);
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
    mkm.mkm.BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, DocumentType.VISA, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, DocumentType.VISA, arguments[0])
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        } else {
            throw new SyntaxError('visa params error: ' + arguments);
        }
        this.__key = null;
        this.__avatar = null
    };
    var BaseVisa = mkm.mkm.BaseVisa;
    Class(BaseVisa, BaseDocument, [Visa]);
    Implementation(BaseVisa, {
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
                if (typeof url === 'string' && url.length === 0) {
                } else {
                    pnf = PortableNetworkFile.parse(url);
                    this.__avatar = pnf
                }
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
    mkm.mkm.BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, DocumentType.BULLETIN, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, DocumentType.BULLETIN, arguments[0])
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        } else {
            throw new SyntaxError('bulletin params error: ' + arguments);
        }
        this.__assistants = null
    };
    var BaseBulletin = mkm.mkm.BaseBulletin;
    Class(BaseBulletin, BaseDocument, [Bulletin]);
    Implementation(BaseBulletin, {
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
    dkd.dkd.BaseContent = function (info) {
        var content, type, sn, time;
        if (IObject.isString(info)) {
            type = info;
            time = new Date();
            sn = InstantMessage.generateSerialNumber(type, time);
            content = {'type': type, 'sn': sn, 'time': time.getTime() / 1000.0}
        } else {
            content = info;
            type = null;
            sn = null;
            time = null
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time
    };
    var BaseContent = dkd.dkd.BaseContent;
    Class(BaseContent, Dictionary, [Content]);
    Implementation(BaseContent, {
        getType: function () {
            if (this.__type === null) {
                var helper = SharedMessageExtensions.getHelper();
                this.__type = helper.getContentType(this.toMap(), '')
            }
            return this.__type
        }, getSerialNumber: function () {
            if (this.__sn === null) {
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
    dkd.dkd.BaseCommand = function () {
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
    var BaseCommand = dkd.dkd.BaseCommand;
    Class(BaseCommand, BaseContent, [Command]);
    Implementation(BaseCommand, {
        getCmd: function () {
            var helper = SharedCommandExtensions.getHelper();
            return helper.getCmd(this.toMap(), '')
        }
    });
    dkd.dkd.BaseTextContent = function (info) {
        if (IObject.isString(info)) {
            BaseContent.call(this, ContentType.TEXT);
            this.setText(info)
        } else {
            BaseContent.call(this, info)
        }
    };
    var BaseTextContent = dkd.dkd.BaseTextContent;
    Class(BaseTextContent, BaseContent, [TextContent]);
    Implementation(BaseTextContent, {
        getText: function () {
            return this.getString('text', '')
        }, setText: function (text) {
            this.setValue('text', text)
        }
    });
    dkd.dkd.WebPageContent = function (info) {
        if (info) {
            BaseContent.call(this, info)
        } else {
            BaseContent.call(this, ContentType.PAGE)
        }
        this.__icon = null
    };
    var WebPageContent = dkd.dkd.WebPageContent;
    Class(WebPageContent, BaseContent, [PageContent]);
    Implementation(WebPageContent, {
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
    dkd.dkd.NameCardContent = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseContent.call(this, ContentType.NAME_CARD);
            this.setString('did', info)
        } else {
            BaseContent.call(this, info)
        }
        this.__image = null
    };
    var NameCardContent = dkd.dkd.NameCardContent;
    Class(NameCardContent, BaseContent, [NameCard]);
    Implementation(NameCardContent, {
        getIdentifier: function () {
            var id = this.getValue('did');
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
    dkd.dkd.BaseFileContent = function (info) {
        if (!info) {
            info = ContentType.FILE
        }
        BaseContent.call(this, info);
        this.__wrapper = new BaseFileWrapper(this.toMap())
    };
    var BaseFileContent = dkd.dkd.BaseFileContent;
    Class(BaseFileContent, BaseContent, [FileContent]);
    Implementation(BaseFileContent, {
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
    dkd.dkd.ImageFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.IMAGE)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__thumbnail = null
    };
    var ImageFileContent = dkd.dkd.ImageFileContent;
    Class(ImageFileContent, BaseFileContent, [ImageContent]);
    Implementation(ImageFileContent, {
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
    dkd.dkd.VideoFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.VIDEO)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__snapshot = null
    };
    var VideoFileContent = dkd.dkd.VideoFileContent;
    Class(VideoFileContent, BaseFileContent, [VideoContent]);
    Implementation(VideoFileContent, {
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
    dkd.dkd.AudioFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.AUDIO)
        } else {
            BaseFileContent.call(this, info)
        }
    };
    var AudioFileContent = dkd.dkd.AudioFileContent;
    Class(AudioFileContent, BaseFileContent, [AudioContent]);
    Implementation(AudioFileContent, {
        getText: function () {
            return this.getString('text', null)
        }, setText: function (asr) {
            this.setValue('text', asr)
        }
    });
    dkd.dkd.SecretContent = function (info) {
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
            var array = ReliableMessage.revert(secrets);
            this.setValue('secrets', array)
        }
        this.__forward = forward;
        this.__secrets = secrets
    };
    var SecretContent = dkd.dkd.SecretContent;
    Class(SecretContent, BaseContent, [ForwardContent]);
    Implementation(SecretContent, {
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue('forward');
                this.__forward = ReliableMessage.parse(forward)
            }
            return this.__forward
        }, getSecrets: function () {
            var messages = this.__secrets;
            if (!messages) {
                var array = this.getValue('secrets');
                if (array) {
                    messages = ReliableMessage.convert(array)
                } else {
                    var msg = this.getForward();
                    messages = !msg ? [] : [msg]
                }
                this.__secrets = messages
            }
            return messages
        }
    });
    dkd.dkd.CombineForwardContent = function () {
        var title;
        var messages;
        if (arguments.length === 2) {
            BaseContent.call(this, ContentType.COMBINE_FORWARD);
            title = arguments[0];
            messages = arguments[1]
        } else {
            BaseContent.call(this, arguments[0]);
            title = null;
            messages = null
        }
        if (title) {
            this.setValue('title', title)
        }
        if (messages) {
            var array = InstantMessage.revert(messages);
            this.setValue('messages', array)
        }
        this.__history = messages
    };
    var CombineForwardContent = dkd.dkd.CombineForwardContent;
    Class(CombineForwardContent, BaseContent, [CombineContent]);
    Implementation(CombineForwardContent, {
        getTitle: function () {
            return this.getString('title', '')
        }, getMessages: function () {
            var messages = this.__history;
            if (!messages) {
                var array = this.getValue('messages');
                if (array) {
                    messages = InstantMessage.convert(array)
                } else {
                    messages = []
                }
                this.__history = messages
            }
            return messages
        }
    });
    dkd.dkd.ListContent = function (info) {
        var list;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', Content.revert(list))
        } else {
            BaseContent.call(this, info);
            list = null
        }
        this.__list = list
    };
    var ListContent = dkd.dkd.ListContent;
    Class(ListContent, BaseContent, [ArrayContent]);
    Implementation(ListContent, {
        getContents: function () {
            var contents = this.__list;
            if (!contents) {
                var array = this.getValue('contents');
                if (array) {
                    contents = Content.convert(array)
                } else {
                    contents = []
                }
                this.__list = contents
            }
            return contents
        }
    });
    dkd.dkd.BaseQuoteContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0])
        } else {
            BaseContent.call(this, Command.RECEIPT);
            this.setValue('text', arguments[0]);
            var origin = arguments[1];
            if (origin) {
                this.setValue('origin', origin)
            }
        }
        this.__env = null
    };
    var BaseQuoteContent = dkd.dkd.BaseQuoteContent;
    Class(BaseQuoteContent, BaseContent, [QuoteContent]);
    Implementation(BaseQuoteContent, {
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
        }
    });
    dkd.dkd.BaseMoneyContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0])
        } else if (arguments.length === 2) {
            BaseContent.call(this, ContentType.MONEY);
            this.setCurrency(arguments[0]);
            this.setAmount(arguments[1])
        } else if (arguments.length === 3) {
            BaseContent.call(this, arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    var BaseMoneyContent = dkd.dkd.BaseMoneyContent;
    Class(BaseMoneyContent, BaseContent, [MoneyContent]);
    Implementation(BaseMoneyContent, {
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
    dkd.dkd.TransferMoneyContent = function () {
        if (arguments.length === 1) {
            MoneyContent.call(this, arguments[0])
        } else if (arguments.length === 2) {
            MoneyContent.call(this, ContentType.TRANSFER, arguments[0], arguments[1])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    var TransferMoneyContent = dkd.dkd.TransferMoneyContent;
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent]);
    Implementation(TransferMoneyContent, {
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
    dkd.dkd.AppCustomizedContent = function () {
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
    var AppCustomizedContent = dkd.dkd.AppCustomizedContent;
    Class(AppCustomizedContent, BaseContent, [CustomizedContent]);
    Implementation(AppCustomizedContent, {
        getApplication: function () {
            return this.getString('app', '')
        }, getModule: function () {
            return this.getString('mod', '')
        }, getAction: function () {
            return this.getString('act', '')
        }
    });
    dkd.dkd.BaseMetaCommand = function () {
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
            this.setString('did', identifier)
        }
        this.__identifier = identifier;
        this.__meta = null
    };
    var BaseMetaCommand = dkd.dkd.BaseMetaCommand;
    Class(BaseMetaCommand, BaseCommand, [MetaCommand]);
    Implementation(BaseMetaCommand, {
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("did");
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
    dkd.dkd.BaseDocumentCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseMetaCommand.call(this, info, Command.DOCUMENTS)
        } else {
            BaseMetaCommand.call(this, info)
        }
        this.__docs = null
    };
    var BaseDocumentCommand = dkd.dkd.BaseDocumentCommand;
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand]);
    Implementation(BaseDocumentCommand, {
        getDocuments: function () {
            if (this.__docs === null) {
                var docs = this.getValue('documents');
                this.__docs = Document.convert(docs)
            }
            return this.__docs
        }, setDocuments: function (docs) {
            if (!docs) {
                this.removeValue('documents')
            } else {
                this.setValue('documents', Document.revert(docs))
            }
            this.__docs = docs
        }, getLastTime: function () {
            return this.getDateTime('last_time', null)
        }, setLastTime: function (when) {
            this.setDateTime('last_time', when)
        }
    });
    dkd.dkd.BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[0], arguments[1])
        } else if (IObject.isString(arguments[0])) {
            BaseCommand.call(this, ContentType.HISTORY, arguments[0])
        } else {
            BaseCommand.call(this, arguments[0])
        }
    };
    var BaseHistoryCommand = dkd.dkd.BaseHistoryCommand;
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand]);
    dkd.dkd.BaseGroupCommand = function () {
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0])
        } else if (arguments.length === 2) {
            BaseHistoryCommand.call(this, ContentType.COMMAND, arguments[0]);
            this.setGroup(arguments[1])
        } else {
            throw new SyntaxError('Group command arguments error: ' + arguments);
        }
    };
    var BaseGroupCommand = dkd.dkd.BaseGroupCommand;
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand]);
    Implementation(BaseGroupCommand, {
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
    dkd.dkd.InviteGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.INVITE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var InviteGroupCommand = dkd.dkd.InviteGroupCommand;
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand]);
    dkd.dkd.ExpelGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var ExpelGroupCommand = dkd.dkd.ExpelGroupCommand;
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand]);
    dkd.dkd.JoinGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var JoinGroupCommand = dkd.dkd.JoinGroupCommand;
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand]);
    dkd.dkd.QuitGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var QuitGroupCommand = dkd.dkd.QuitGroupCommand;
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand]);
    dkd.dkd.ResetGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESET, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var ResetGroupCommand = dkd.dkd.ResetGroupCommand;
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand]);
    dkd.dkd.HireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.HIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var HireGroupCommand = dkd.dkd.HireGroupCommand;
    Class(HireGroupCommand, BaseGroupCommand, [HireCommand]);
    Implementation(HireGroupCommand, {
        getAdministrators: function () {
            var array = this.getValue('administrators');
            return !array ? null : ID.convert(array)
        }, setAdministrators: function (admins) {
            if (!admins) {
                this.removeValue('administrators')
            } else {
                var array = ID.revert(admins);
                this.setValue('administrators', array)
            }
        }, getAssistants: function () {
            var array = this.getValue('assistants');
            return !array ? null : ID.convert(array)
        }, setAssistants: function (bots) {
            if (!bots) {
                this.removeValue('assistants')
            } else {
                var array = ID.revert(bots);
                this.setValue('assistants', array)
            }
        }
    });
    dkd.dkd.FireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.FIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var FireGroupCommand = dkd.dkd.FireGroupCommand;
    Class(FireGroupCommand, BaseGroupCommand, [FireCommand]);
    Implementation(FireGroupCommand, {
        getAssistants: function () {
            var array = this.getValue('assistants');
            return !array ? null : ID.convert(array)
        }, setAssistants: function (bots) {
            if (!bots) {
                this.removeValue('assistants')
            } else {
                var array = ID.revert(bots);
                this.setValue('assistants', array)
            }
        }, getAdministrators: function () {
            var array = this.getValue('administrators');
            return !array ? null : ID.convert(array)
        }, setAdministrators: function (admins) {
            if (!admins) {
                this.removeValue('administrators')
            } else {
                var array = ID.revert(admins);
                this.setValue('administrators', array)
            }
        }
    });
    dkd.dkd.ResignGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    var ResignGroupCommand = dkd.dkd.ResignGroupCommand;
    Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand]);
    dkd.dkd.BaseReceiptCommand = function () {
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
    var BaseReceiptCommand = dkd.dkd.BaseReceiptCommand;
    Class(BaseReceiptCommand, BaseCommand, [ReceiptCommand]);
    Implementation(BaseReceiptCommand, {
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
    dkd.msg.MessageEnvelope = function () {
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
    var MessageEnvelope = dkd.msg.MessageEnvelope;
    Class(MessageEnvelope, Dictionary, [Envelope]);
    Implementation(MessageEnvelope, {
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
    dkd.msg.BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap()
        }
        Dictionary.call(this, msg);
        this.__envelope = env
    };
    var BaseMessage = dkd.msg.BaseMessage;
    Class(BaseMessage, Dictionary, [Message]);
    Implementation(BaseMessage, {
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
    dkd.msg.PlainMessage = function () {
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
    var PlainMessage = dkd.msg.PlainMessage;
    Class(PlainMessage, BaseMessage, [InstantMessage]);
    Implementation(PlainMessage, {
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
    dkd.msg.EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null
    };
    var EncryptedMessage = dkd.msg.EncryptedMessage;
    Class(EncryptedMessage, BaseMessage, [SecureMessage]);
    Implementation(EncryptedMessage, {
        getData: function () {
            var binary = this.__data;
            if (!binary) {
                var base64 = this.getValue('data');
                if (!base64) {
                    throw new ReferenceError('message data not found: ' + this);
                } else if (!BaseMessage.isBroadcast(this)) {
                    binary = TransportableData.decode(base64)
                } else if (IObject.isString(base64)) {
                    binary = UTF8.encode(base64)
                } else {
                    throw new ReferenceError('message data error: ' + base64);
                }
                this.__data = binary
            }
            return binary
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
    dkd.msg.NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null
    };
    var NetworkMessage = dkd.msg.NetworkMessage;
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage]);
    Implementation(NetworkMessage, {
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
    dkd.ext.CommandHelper = Interface(null, null);
    var CommandHelper = dkd.ext.CommandHelper;
    CommandHelper.prototype = {
        setCommandFactory: function (cmd, factory) {
        }, getCommandFactory: function (cmd) {
        }, parseCommand: function (content) {
        }
    };
    dkd.ext.CommandExtensions = {
        setCommandHelper: function (helper) {
            cmdHelper = helper
        }, getCommandHelper: function () {
            return cmdHelper
        }
    };
    var CommandExtensions = dkd.ext.CommandExtensions;
    var cmdHelper = null;
    dkd.ext.GeneralCommandHelper = Interface(null, null);
    var GeneralCommandHelper = dkd.ext.GeneralCommandHelper;
    GeneralCommandHelper.prototype = {
        getCmd: function (content, defaultValue) {
        }
    };
    dkd.ext.SharedCommandExtensions = {
        setCommandHelper: function (helper) {
            CommandExtensions.setCommandHelper(helper)
        }, getCommandHelper: function () {
            return CommandExtensions.getCommandHelper()
        }, setHelper: function (helper) {
            generalCommandHelper = helper
        }, getHelper: function () {
            return generalCommandHelper
        }
    };
    var SharedCommandExtensions = dkd.ext.SharedCommandExtensions;
    var generalCommandHelper = null
})(DaoKeDao, MingKeMing, MONKEY);
