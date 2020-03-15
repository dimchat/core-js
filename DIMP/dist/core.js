/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Mar. 10, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
! function(ns) {
    DaoKeDao.exports(ns);
    MingKeMing.exports(ns);
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
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var TextContent = function(content) {
        var text = null;
        if (!content) {
            content = ContentType.TEXT
        } else {
            if (typeof content === "string") {
                text = content;
                content = ContentType.TEXT
            }
        }
        Content.call(this, content);
        if (text) {
            this.setText(text)
        }
    };
    ns.Class(TextContent, Content, null);
    TextContent.prototype.getText = function() {
        return this.getValue("text")
    };
    TextContent.prototype.setText = function(text) {
        this.setValue("text", text)
    };
    Content.register(ContentType.TEXT, TextContent);
    ns.protocol.TextContent = TextContent;
    ns.protocol.register("TextContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var PageContent = function(content) {
        var url = null;
        if (!content) {
            content = ContentType.PAGE
        } else {
            if (typeof content === "string") {
                url = content;
                content = ContentType.PAGE
            }
        }
        Content.call(this, content);
        if (url) {
            this.setURL(url)
        }
        this.icon = null
    };
    ns.Class(PageContent, Content, null);
    PageContent.prototype.getURL = function() {
        return this.getValue("URL")
    };
    PageContent.prototype.setURL = function(url) {
        this.setValue("URL", url)
    };
    PageContent.prototype.getTitle = function() {
        return this.getValue("title")
    };
    PageContent.prototype.setTitle = function(text) {
        this.setValue("title", text)
    };
    PageContent.prototype.getDesc = function() {
        return this.getValue("desc")
    };
    PageContent.prototype.setDesc = function(text) {
        this.setValue("desc", text)
    };
    PageContent.prototype.getIcon = function() {
        if (!this.icon) {
            var base64 = this.getValue("icon");
            if (base64) {
                this.icon = ns.format.Base64.decode(base64)
            }
        }
        return this.icon
    };
    PageContent.prototype.setIcon = function(data) {
        var base64 = null;
        if (data) {
            base64 = ns.format.Base64.encode(data)
        }
        this.setValue("icon", base64);
        this.icon = data
    };
    Content.register(ContentType.PAGE, PageContent);
    ns.protocol.PageContent = PageContent;
    ns.protocol.register("PageContent")
}(DIMP);
! function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = function(content) {
        if (!content) {
            content = ContentType.FILE
        }
        Content.call(this, content);
        this.attachment = null;
        this.password = null
    };
    ns.Class(FileContent, Content, null);
    FileContent.prototype.getURL = function() {
        return this.getValue("URL")
    };
    FileContent.prototype.setURL = function(url) {
        this.setValue("URL", url)
    };
    FileContent.prototype.getFilename = function() {
        return this.getValue("filename")
    };
    FileContent.prototype.setFilename = function(filename) {
        this.setValue("filename", filename)
    };
    var file_ext = function() {
        var filename = this.getFilename();
        if (!filename) {
            return null
        }
        var pos = filename.lastIndexOf(".");
        if (pos < 0) {
            return null
        }
        return filename.substring(pos + 1)
    };
    var md5 = function(data) {
        var hash = ns.digest.MD5.digest(data);
        return ns.format.Hex.encode(hash)
    };
    FileContent.prototype.getData = function() {
        return this.attachment
    };
    FileContent.prototype.setData = function(data) {
        if (data && data.length > 0) {
            var filename = md5(data);
            var ext = file_ext.call(this);
            if (ext) {
                filename = filename + "." + ext
            }
            this.setValue("filename", filename)
        }
        this.attachment = data
    };
    FileContent.prototype.getPassword = function() {
        if (!this.password) {
            var key = this.getValue("password");
            if (key) {
                this.password = SymmetricKey.getInstance(key)
            }
        }
        return this.password
    };
    FileContent.prototype.setPassword = function(key) {
        this.setValue("password", key);
        this.password = key
    };
    Content.register(ContentType.FILE, FileContent);
    ns.protocol.FileContent = FileContent;
    ns.protocol.register("FileContent")
}(DIMP);
! function(ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function(content) {
        if (!content) {
            content = ContentType.IMAGE
        }
        FileContent.call(this, content);
        this.thumbnail = null
    };
    ns.Class(ImageContent, FileContent, null);
    ImageContent.prototype.getThumbnail = function() {
        if (!this.thumbnail) {
            var base64 = this.getValue("thumbnail");
            if (base64) {
                this.thumbnail = Base64.decode(base64)
            }
        }
        return this.thumbnail
    };
    ImageContent.prototype.setThumbnail = function(image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue("thumbnail", base64)
        } else {
            this.setValue("thumbnail", null)
        }
        this.thumbnail = image
    };
    Content.register(ContentType.IMAGE, ImageContent);
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.register("ImageContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var AudioContent = function(content) {
        if (!content) {
            content = ContentType.AUDIO
        }
        FileContent.call(this, content)
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
}(DIMP);
! function(ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var VideoContent = function(content) {
        if (!content) {
            content = ContentType.VIDEO
        }
        FileContent.call(this, content);
        this.snapshot = null
    };
    ns.Class(VideoContent, FileContent, null);
    VideoContent.prototype.getSnapshot = function() {
        if (!this.snapshot) {
            var base64 = this.getValue("snapshot");
            if (base64) {
                this.snapshot = Base64.decode(base64)
            }
        }
        return this.snapshot
    };
    VideoContent.prototype.setSnapshot = function(image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue("snapshot", base64)
        } else {
            this.setValue("snapshot", null)
        }
        this.snapshot = image
    };
    Content.register(ContentType.VIDEO, VideoContent);
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.register("VideoContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = function(info) {
        var name = null;
        if (!info) {
            info = ContentType.COMMAND
        } else {
            if (typeof info === "string") {
                name = info;
                info = ContentType.COMMAND
            }
        }
        Content.call(this, info);
        if (name) {
            this.setCommand(name)
        }
    };
    ns.Class(Command, Content, null);
    Command.prototype.getCommand = function() {
        return this.getValue("command")
    };
    Command.prototype.setCommand = function(name) {
        this.setValue("command", name)
    };
    Command.HANDSHAKE = "handshake";
    Command.RECEIPT = "receipt";
    Command.META = "meta";
    Command.PROFILE = "profile";
    var command_classes = {};
    Command.register = function(name, clazz) {
        command_classes[name] = clazz
    };
    Command.getClass = function(cmd) {
        if (typeof cmd === "string") {
            return command_classes[cmd]
        }
        var command = cmd["command"];
        if (!command) {
            return null
        }
        return command_classes[command]
    };
    Command.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof Command) {
                return cmd
            }
        }
        var clazz = Command.getClass(cmd);
        if (typeof clazz === "function") {
            return Content.createInstance(clazz, cmd)
        }
        return new Command(cmd)
    };
    Content.register(ContentType.COMMAND, Command);
    ns.protocol.Command = Command;
    ns.protocol.register("Command")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Meta = ns.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function(info) {
        var identifier = null;
        if (!info) {
            info = Command.META
        } else {
            if (info instanceof ID) {
                identifier = info;
                info = Command.META
            }
        }
        Command.call(this, info);
        if (identifier) {
            this.setIdentifier(identifier)
        }
        this.meta = null
    };
    ns.Class(MetaCommand, Command, null);
    MetaCommand.prototype.getIdentifier = function() {
        return this.getValue("ID")
    };
    MetaCommand.prototype.setIdentifier = function(identifier) {
        this.setValue("ID", identifier)
    };
    MetaCommand.prototype.getMeta = function() {
        if (!this.meta) {
            var dict = this.getValue("meta");
            this.meta = Meta.getInstance(dict)
        }
        return this.meta
    };
    MetaCommand.prototype.setMeta = function(meta) {
        this.setValue("meta", meta);
        this.meta = meta
    };
    MetaCommand.query = function(identifier) {
        return new MetaCommand(identifier)
    };
    MetaCommand.response = function(identifier, meta) {
        var cmd = new MetaCommand(identifier);
        cmd.setMeta(meta);
        return cmd
    };
    Command.register(Command.META, MetaCommand);
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.register("MetaCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Profile = ns.Profile;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var ProfileCommand = function(info) {
        var identifier = null;
        if (!info) {
            info = Command.PROFILE
        } else {
            if (info instanceof ID) {
                identifier = info;
                info = Command.PROFILE
            }
        }
        MetaCommand.call(this, info);
        if (identifier) {
            this.setIdentifier(identifier)
        }
        this.profile = null
    };
    ns.Class(ProfileCommand, MetaCommand, null);
    ProfileCommand.prototype.getProfile = function() {
        if (!this.profile) {
            var info = this.getValue("profile");
            if (typeof info === "string") {
                info = {
                    "ID": this.getIdentifier(),
                    "data": info,
                    "signature": this.getValue("signature")
                }
            } else {}
            this.profile = Profile.getInstance(info)
        }
        return this.profile
    };
    ProfileCommand.prototype.setProfile = function(profile) {
        this.setValue("profile", profile);
        this.profile = profile
    };
    ProfileCommand.prototype.getSignature = function() {
        return this.getValue("signature")
    };
    ProfileCommand.prototype.setSignature = function(base64) {
        this.setValue("signature", base64)
    };
    ProfileCommand.query = function(identifier, signature) {
        var cmd = new ProfileCommand(identifier);
        if (signature) {
            cmd.setSignature(signature)
        }
        return cmd
    };
    ProfileCommand.response = function(identifier, profile, meta) {
        var cmd = new ProfileCommand(identifier);
        cmd.setProfile(profile);
        if (meta) {
            cmd.setMeta(meta)
        }
        return cmd
    };
    Command.register(Command.PROFILE, ProfileCommand);
    ns.protocol.ProfileCommand = ProfileCommand;
    ns.protocol.register("ProfileCommand")
}(DIMP);
! function(ns) {
    var HandshakeState = ns.type.Enum(null, {
        INIT: 0,
        START: 1,
        AGAIN: 2,
        RESTART: 3,
        SUCCESS: 4
    });
    var Command = ns.protocol.Command;
    var HandshakeCommand = function(info) {
        var message = null;
        if (!info) {
            info = Command.HANDSHAKE
        } else {
            if (typeof info === "string") {
                message = info;
                info = Command.HANDSHAKE
            }
        }
        Command.call(this, info);
        if (message) {
            this.setMessage(message)
        }
    };
    ns.Class(HandshakeCommand, Command, null);
    HandshakeCommand.prototype.getMessage = function() {
        return this.getValue("message")
    };
    HandshakeCommand.prototype.setMessage = function(text) {
        this.setValue("message", text)
    };
    HandshakeCommand.prototype.getSessionKey = function() {
        return this.getValue("session")
    };
    HandshakeCommand.prototype.setSessionKey = function(session) {
        this.setValue("session", session)
    };
    HandshakeCommand.prototype.getState = function() {
        var text = this.getMessage();
        var session = this.getSessionKey();
        if (!text) {
            return HandshakeState.INIT
        }
        if (text === "DIM?") {
            return HandshakeState.AGAIN
        }
        if (text === "DIM!" || text === "OK!") {
            return HandshakeState.SUCCESS
        }
        if (session) {
            return HandshakeState.RESTART
        } else {
            return HandshakeState.START
        }
    };
    var handshake = function(text, session) {
        var cmd = new HandshakeCommand(text);
        if (session) {
            cmd.setSessionKey(session)
        }
        return cmd
    };
    HandshakeCommand.start = function() {
        return handshake("Hello world!")
    };
    HandshakeCommand.restart = function(session) {
        return handshake("Hello world!", session)
    };
    HandshakeCommand.again = function(session) {
        return handshake("DIM?", session)
    };
    HandshakeCommand.success = function() {
        return handshake("DIM!")
    };
    Command.register(Command.HANDSHAKE, HandshakeCommand);
    ns.protocol.HandshakeCommand = HandshakeCommand;
    ns.protocol.HandshakeState = HandshakeState;
    ns.protocol.register("HandshakeCommand");
    ns.protocol.register("HandshakeState")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var HistoryCommand = function(info) {
        var name = null;
        var time = null;
        if (!info) {
            time = new Date();
            info = ContentType.HISTORY
        } else {
            if (typeof info === "string") {
                name = info;
                time = new Date();
                info = ContentType.HISTORY
            }
        }
        Command.call(this, info);
        if (name) {
            this.setCommand(name)
        }
        if (time) {
            this.setTime(time)
        }
    };
    ns.Class(HistoryCommand, Command, null);
    HistoryCommand.prototype.getTime = function() {
        var time = this.getValue("time");
        if (time) {
            return new Date(time * 1000)
        } else {
            return null
        }
    };
    HistoryCommand.prototype.setTime = function(time) {
        if (!time) {
            time = new Date()
        }
        if (time instanceof Date) {
            this.setValue("time", time.getTime() / 1000)
        } else {
            if (typeof time === "number") {
                this.setValue("time", time)
            } else {
                throw TypeError("time error: " + time)
            }
        }
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    HistoryCommand.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof HistoryCommand) {
                return cmd
            }
        }
        if (cmd.hasOwnProperty("group")) {
            return ns.protocol.GroupCommand.getInstance(cmd)
        }
        return new HistoryCommand(cmd)
    };
    Content.register(ContentType.HISTORY, HistoryCommand);
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.register("HistoryCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Content = ns.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function(info) {
        var group = null;
        if (info instanceof ID) {
            group = info;
            info = null
        }
        HistoryCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(GroupCommand, HistoryCommand, null);
    GroupCommand.prototype.getGroup = function() {
        return Content.prototype.getGroup.call(this)
    };
    GroupCommand.prototype.setGroup = function(identifier) {
        Content.prototype.setGroup.call(this, identifier)
    };
    GroupCommand.prototype.getMember = function() {
        return this.getValue("member")
    };
    GroupCommand.prototype.setMember = function(identifier) {
        this.setValue("member", identifier)
    };
    GroupCommand.prototype.getMembers = function() {
        var members = this.getValue("members");
        if (!members) {
            var member = this.getValue("member");
            if (member) {
                members = [member]
            }
        }
        return members
    };
    GroupCommand.prototype.setMembers = function(members) {
        this.setValue("members", members);
        this.setValue("member", null)
    };
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
    GroupCommand.register = function(name, clazz) {
        Command.register(name, clazz)
    };
    GroupCommand.getClass = function(cmd) {
        return Command.getClass(cmd)
    };
    GroupCommand.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof GroupCommand) {
                return cmd
            }
        }
        var clazz = GroupCommand.getClass(cmd);
        if (typeof clazz === "function") {
            return Content.createInstance(clazz, cmd)
        }
        return new GroupCommand(cmd)
    };
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.register("GroupCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Command = ns.protocol.Command;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.INVITE
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.INVITE
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(InviteCommand, GroupCommand, null);
    var ExpelCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.EXPEL
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.EXPEL
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(ExpelCommand, GroupCommand, null);
    var JoinCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.JOIN
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.JOIN
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(JoinCommand, GroupCommand, null);
    var QuitCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.QUIT
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.QUIT
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(QuitCommand, GroupCommand, null);
    var ResetCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.RESET
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.RESET
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(ResetCommand, GroupCommand, null);
    var QueryCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.QUERY
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.QUERY
            }
        }
        Command.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.Class(QueryCommand, Command, null);
    var create = function(clazz, group, member) {
        var cmd = new clazz(group);
        if (typeof member === "string" || member instanceof ID) {
            cmd.setMember(member)
        } else {
            if (member instanceof Array) {
                cmd.setMembers(member)
            }
        }
        return cmd
    };
    GroupCommand.invite = function(group, member) {
        return create(InviteCommand, group, member)
    };
    GroupCommand.expel = function(group, member) {
        return create(ExpelCommand, group, member)
    };
    GroupCommand.join = function(group) {
        return create(JoinCommand, group)
    };
    GroupCommand.quit = function(group) {
        return create(QuitCommand, group)
    };
    GroupCommand.reset = function(group, member) {
        return create(ResetCommand, group, member)
    };
    GroupCommand.query = function(group) {
        return create(QueryCommand, group)
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
}(DIMP);
! function(ns) {
    var EntityDelegate = function() {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.getIdentifier = function(string) {
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
    ns.EntityDelegate = EntityDelegate;
    ns.register("EntityDelegate")
}(DIMP);
! function(ns) {
    var CipherKeyDelegate = function() {};
    ns.Interface(CipherKeyDelegate, null);
    CipherKeyDelegate.prototype.getCipherKey = function(sender, receiver) {
        console.assert(false, "implement me!");
        return null
    };
    CipherKeyDelegate.prototype.cacheCipherKey = function(sender, receiver, key) {
        console.assert(false, "implement me!")
    };
    ns.CipherKeyDelegate = CipherKeyDelegate;
    ns.register("CipherKeyDelegate")
}(DIMP);
! function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var PlainKey = function(key) {
        SymmetricKey.call(this, key)
    };
    ns.Class(PlainKey, SymmetricKey, null);
    PlainKey.prototype.encrypt = function(data) {
        return data
    };
    PlainKey.prototype.decrypt = function(data) {
        return data
    };
    var plain_key = null;
    PlainKey.getInstance = function() {
        if (!plain_key) {
            var key = {
                "algorithm": PlainKey.PLAIN
            };
            plain_key = new PlainKey(key)
        }
        return plain_key
    };
    PlainKey.PLAIN = "PLAIN";
    SymmetricKey.register(PlainKey.PLAIN, PlainKey);
    ns.plugins.PlainKey = PlainKey
}(DIMP);
! function(ns) {
    var CipherKeyDelegate = ns.CipherKeyDelegate;
    var KeyCache = function() {
        this.keyMap = {};
        this.isDirty = false
    };
    ns.Class(KeyCache, ns.type.Object, [CipherKeyDelegate]);
    KeyCache.prototype.reload = function() {
        var map = this.loadKeys();
        if (!map) {
            return false
        }
        return this.updateKeys(map)
    };
    KeyCache.prototype.flush = function() {
        if (this.isDirty) {
            if (this.saveKeys(this.keyMap)) {
                this.isDirty = false
            }
        }
    };
    KeyCache.prototype.saveKeys = function(map) {
        console.assert(false, "implement me!");
        return false
    };
    KeyCache.prototype.loadKeys = function() {
        console.assert(false, "implement me!");
        return null
    };
    KeyCache.prototype.updateKeys = function(map) {
        if (!map) {
            return false
        }
        var changed = false;
        var sender, receiver;
        var oldKey, newKey;
        var table;
        for (sender in map) {
            if (!map.hasOwnProperty(sender)) {
                continue
            }
            table = map[sender];
            for (receiver in table) {
                if (!table.hasOwnProperty(receiver)) {
                    continue
                }
                newKey = table[receiver];
                oldKey = get_key.call(this, sender, receiver);
                if (oldKey !== newKey) {
                    changed = true
                }
                set_key.call(this, sender, receiver, newKey)
            }
        }
        return changed
    };
    var get_key = function(sender, receiver) {
        var table = this.keyMap[sender];
        if (table) {
            return table[receiver]
        } else {
            return null
        }
    };
    var set_key = function(sender, receiver, key) {
        var table = this.keyMap[sender];
        if (table) {
            var old = table[receiver];
            if (old) {
                var equals = true;
                var v1, v2;
                for (var k in key) {
                    if (!key.hasOwnProperty(k)) {
                        continue
                    }
                    v1 = key[k];
                    v2 = old[k];
                    if (v1 === v2) {
                        continue
                    }
                    equals = false;
                    break
                }
                if (equals) {
                    return
                }
            }
        } else {
            table = {};
            this.keyMap[sender] = table
        }
        table[receiver] = key
    };
    KeyCache.prototype.getCipherKey = function(sender, receiver) {
        if (receiver.isBroadcast()) {
            return ns.plugins.PlainKey.getInstance()
        }
        return get_key.call(this, sender, receiver)
    };
    KeyCache.prototype.cacheCipherKey = function(sender, receiver, key) {
        if (receiver.isBroadcast()) {} else {
            set_key.call(this, sender, receiver, key);
            this.isDirty = true
        }
    };
    ns.core.KeyCache = KeyCache;
    ns.core.register("KeyCache")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var User = ns.User;
    var Group = ns.Group;
    var EntityDelegate = ns.EntityDelegate;
    var UserDataSource = ns.UserDataSource;
    var GroupDataSource = ns.GroupDataSource;
    var Barrack = function() {
        this.idMap = {};
        this.metaMap = {};
        this.userMap = {};
        this.groupMap = {}
    };
    ns.Class(Barrack, ns.type.Object, [EntityDelegate, UserDataSource, GroupDataSource]);
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
        finger = thanos(this.idMap, finger);
        finger = thanos(this.metaMap, finger);
        finger = thanos(this.userMap, finger);
        finger = thanos(this.groupMap, finger);
        return finger >> 1
    };
    Barrack.prototype.cacheIdentifier = function(identifier) {
        this.idMap[identifier.toString()] = identifier;
        return true
    };
    Barrack.prototype.cacheMeta = function(meta, identifier) {
        this.metaMap[identifier] = meta;
        return true
    };
    Barrack.prototype.cacheUser = function(user) {
        if (!user.delegate) {
            user.delegate = this
        }
        this.userMap[user.identifier] = user;
        return true
    };
    Barrack.prototype.cacheGroup = function(group) {
        if (!group.delegate) {
            group.delegate = this
        }
        this.groupMap[group.identifier] = group;
        return true
    };
    Barrack.prototype.createIdentifier = function(string) {
        return ID.getInstance(string)
    };
    Barrack.prototype.createUser = function(identifier) {
        return new User(identifier)
    };
    Barrack.prototype.createGroup = function(identifier) {
        return new Group(identifier)
    };
    Barrack.prototype.getIdentifier = function(string) {
        if (!string || string instanceof ID) {
            return string
        }
        var identifier = this.idMap[string];
        if (identifier) {
            return identifier
        }
        identifier = this.createIdentifier(string);
        if (identifier && this.cacheIdentifier(identifier)) {
            return identifier
        }
        return null
    };
    Barrack.prototype.getUser = function(identifier) {
        var user = this.userMap[identifier];
        if (user) {
            return user
        }
        user = this.createUser(identifier);
        if (user && this.cacheUser(user)) {
            return user
        }
        return null
    };
    Barrack.prototype.getGroup = function(identifier) {
        var group = this.groupMap[identifier];
        if (group) {
            return group
        }
        group = this.createGroup(identifier);
        if (group && this.cacheGroup(group)) {
            return group
        }
        return null
    };
    Barrack.prototype.getMeta = function(identifier) {
        return this.metaMap[identifier]
    };
    Barrack.prototype.getPublicKeyForEncryption = function(identifier) {
        return null
    };
    Barrack.prototype.getPublicKeysForVerification = function(identifier) {
        return null
    };
    Barrack.prototype.getFounder = function(identifier) {
        if (identifier.isBroadcast()) {
            var founder;
            var name = identifier.name;
            if (!name || name === "everyone") {
                founder = "moky@anywhere"
            } else {
                founder = name + ".founder@anywhere"
            }
            return this.getIdentifier(founder)
        }
        return null
    };
    Barrack.prototype.getOwner = function(identifier) {
        if (identifier.isBroadcast()) {
            var owner;
            var name = identifier.name;
            if (!name || name === "everyone") {
                owner = "anyone@anywhere"
            } else {
                owner = name + ".owner@anywhere"
            }
            return this.getIdentifier(owner)
        }
        return null
    };
    Barrack.prototype.getMembers = function(identifier) {
        if (identifier.isBroadcast()) {
            var member;
            var name = identifier.name;
            if (!name || name === "everyone") {
                member = "anyone@anywhere"
            } else {
                member = name + ".member@anywhere"
            }
            var list = [];
            var owner = this.getOwner(identifier);
            if (owner) {
                list.push(owner)
            }
            member = this.getIdentifier(member);
            if (member && !member.equals(owner)) {
                list.push(member)
            }
            return list
        }
        return null
    };
    ns.core.Barrack = Barrack;
    ns.core.register("Barrack")
}(DIMP);
! function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.Content;
    var Command = ns.protocol.Command;
    var InstantMessage = ns.InstantMessage;
    var ReliableMessage = ns.ReliableMessage;
    var InstantMessageDelegate = ns.InstantMessageDelegate;
    var SecureMessageDelegate = ns.SecureMessageDelegate;
    var ReliableMessageDelegate = ns.ReliableMessageDelegate;
    var Transceiver = function() {
        this.entityDelegate = null;
        this.cipherKeyDelegate = null
    };
    ns.Class(Transceiver, ns.type.Object, [InstantMessageDelegate, SecureMessageDelegate, ReliableMessageDelegate]);
    var get_key = function(sender, receiver) {
        var key = this.cipherKeyDelegate.getCipherKey(sender, receiver);
        if (!key) {
            key = SymmetricKey.generate(SymmetricKey.AES);
            this.cipherKeyDelegate.cacheCipherKey(sender, receiver, key)
        }
        return key
    };
    var is_broadcast_msg = function(msg) {
        var receiver;
        if (msg instanceof InstantMessage) {
            receiver = msg.content.getGroup()
        } else {
            receiver = msg.envelope.getGroup()
        }
        if (!receiver) {
            receiver = msg.envelope.receiver
        }
        receiver = this.entityDelegate.getIdentifier(receiver);
        return receiver && receiver.isBroadcast()
    };
    Transceiver.prototype.encryptMessage = function(iMsg) {
        var sender = this.entityDelegate.getIdentifier(iMsg.envelope.sender);
        var receiver = this.entityDelegate.getIdentifier(iMsg.envelope.receiver);
        var group = this.entityDelegate.getIdentifier(iMsg.content.getGroup());
        var password;
        if (!group || (iMsg.content instanceof Command)) {
            password = get_key.call(this, sender, receiver)
        } else {
            password = get_key.call(this, sender, group)
        }
        if (!iMsg.delegate) {
            iMsg.delegate = this
        }
        var sMsg;
        if (receiver.isGroup()) {
            var members = this.entityDelegate.getMembers(receiver);
            sMsg = iMsg.encrypt(password, members)
        } else {
            sMsg = iMsg.encrypt(password, null)
        }
        return sMsg
    };
    Transceiver.prototype.signMessage = function(sMsg) {
        if (!sMsg.delegate) {
            sMsg.delegate = this
        }
        return sMsg.sign()
    };
    Transceiver.prototype.verifyMessage = function(rMsg) {
        if (!rMsg.delegate) {
            rMsg.delegate = this
        }
        return rMsg.verify()
    };
    Transceiver.prototype.decryptMessage = function(sMsg) {
        if (!sMsg.delegate) {
            sMsg.delegate = this
        }
        return sMsg.decrypt()
    };
    Transceiver.prototype.serializeContent = function(content, iMsg) {
        var json = ns.format.JSON.encode(content);
        return ns.type.String.from(json).getBytes("UTF-8")
    };
    Transceiver.prototype.serializeKey = function(password, iMsg) {
        var json = ns.format.JSON.encode(password);
        return ns.type.String.from(json).getBytes("UTF-8")
    };
    Transceiver.prototype.serializeMessage = function(rMsg) {
        var json = ns.format.JSON.encode(rMsg);
        return ns.type.String.from(json).getBytes("UTF-8")
    };
    Transceiver.prototype.deserializeMessage = function(data) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return ReliableMessage.getInstance(dict)
    };
    Transceiver.prototype.deserializeKey = function(data, sMsg) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return SymmetricKey.getInstance(dict)
    };
    Transceiver.prototype.deserializeContent = function(data, sMsg) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return Content.getInstance(dict)
    };
    Transceiver.prototype.encryptContent = function(content, pwd, iMsg) {
        var key = SymmetricKey.getInstance(pwd);
        if (key) {
            var data = this.serializeContent(content, iMsg);
            return key.encrypt(data)
        } else {
            throw Error("key error: " + pwd)
        }
    };
    Transceiver.prototype.encodeData = function(data, iMsg) {
        if (is_broadcast_msg.call(this, iMsg)) {
            var str = new ns.type.String(data, "UTF-8");
            return str.toString()
        }
        return ns.format.Base64.encode(data)
    };
    Transceiver.prototype.encryptKey = function(pwd, receiver, iMsg) {
        if (is_broadcast_msg.call(this, iMsg)) {
            return null
        }
        var key = SymmetricKey.getInstance(pwd);
        var data = this.serializeKey(key, iMsg);
        receiver = this.entityDelegate.getIdentifier(receiver);
        var contact = this.entityDelegate.getUser(receiver);
        if (contact) {
            return contact.encrypt(data)
        } else {
            throw Error("failed to get encrypt key for receiver: " + receiver)
        }
    };
    Transceiver.prototype.encodeKey = function(key, iMsg) {
        return ns.format.Base64.encode(key)
    };
    Transceiver.prototype.decodeKey = function(key, sMsg) {
        return ns.format.Base64.decode(key)
    };
    Transceiver.prototype.decryptKey = function(key, sender, receiver, sMsg) {
        sender = this.entityDelegate.getIdentifier(sender);
        receiver = this.entityDelegate.getIdentifier(receiver);
        var password;
        if (key) {
            var identifier = sMsg.envelope.receiver;
            identifier = this.entityDelegate.getIdentifier(identifier);
            var user = this.entityDelegate.getUser(identifier);
            if (!user) {
                throw Error("failed to get decrypt keys: " + identifier)
            }
            var plaintext = user.decrypt(key);
            if (!plaintext) {
                throw Error("failed to decrypt key in msg: " + sMsg)
            }
            password = this.deserializeKey(plaintext, sMsg)
        } else {
            password = this.cipherKeyDelegate.getCipherKey(sender, receiver)
        }
        return password
    };
    Transceiver.prototype.decodeData = function(data, sMsg) {
        if (is_broadcast_msg.call(this, sMsg)) {
            return ns.type.String.from(data).getBytes("UTF-8")
        }
        return ns.format.Base64.decode(data)
    };
    Transceiver.prototype.decryptContent = function(data, pwd, sMsg) {
        var key = SymmetricKey.getInstance(pwd);
        if (!key) {
            return null
        }
        var plaintext = key.decrypt(data);
        if (!plaintext) {
            return null
        }
        var content = this.deserializeContent(plaintext, sMsg);
        var sender = this.entityDelegate.getIdentifier(sMsg.envelope.sender);
        var group = this.entityDelegate.getIdentifier(content.getGroup());
        if (!group || (content instanceof Command)) {
            var receiver = this.entityDelegate.getIdentifier(sMsg.envelope.receiver);
            this.cipherKeyDelegate.cacheCipherKey(sender, receiver, key)
        } else {
            this.cipherKeyDelegate.cacheCipherKey(sender, group, key)
        }
        return content
    };
    Transceiver.prototype.signData = function(data, sender, sMsg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var user = this.entityDelegate.getUser(sender);
        if (user) {
            return user.sign(data)
        } else {
            throw Error("failed to get sign key for sender: " + sMsg)
        }
    };
    Transceiver.prototype.encodeSignature = function(signature, sMsg) {
        return ns.format.Base64.encode(signature)
    };
    Transceiver.prototype.decodeSignature = function(signature, rMsg) {
        return ns.format.Base64.decode(signature)
    };
    Transceiver.prototype.verifyDataSignature = function(data, signature, sender, rMsg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var contact = this.entityDelegate.getUser(sender);
        if (contact) {
            return contact.verify(data, signature)
        } else {
            throw Error("failed to get verify key for sender: " + rMsg)
        }
    };
    ns.core.Transceiver = Transceiver;
    ns.core.register("Transceiver")
}(DIMP);
