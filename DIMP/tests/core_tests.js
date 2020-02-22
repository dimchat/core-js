;

//
//  Test Cases
//
core_tests = [];

!function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;

    var TextContent = ns.protocol.TextContent;
    var ImageContent = ns.protocol.ImageContent;
    var AudioContent = ns.protocol.AudioContent;
    var VideoContent = ns.protocol.VideoContent;

    var test_text_content = function () {
        var text = 'Hello world!';
        var content = new TextContent(text);
        log('content: ', content);
        assert(content.getText() === text, 'text content error');
    };
    core_tests.push(test_text_content);

    var test_image_content = function () {
        var content = new ImageContent();
        log('content: ', content);
        assert(ContentType.IMAGE.equals(content.type) === true, 'image content error');
    };
    core_tests.push(test_image_content);

    var test_audio_content = function () {
        var content = new AudioContent();
        log('content: ', content);
        assert(ContentType.AUDIO.equals(content.type) === true, 'audio content error');
    };
    core_tests.push(test_audio_content);

    var test_video_content = function () {
        var content = new VideoContent();
        log('content: ', content);
        assert(ContentType.VIDEO.equals(content.type) === true, 'video content error');
    };
    core_tests.push(test_video_content);

}(DIMP);

!function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;

    var Command = ns.protocol.Command;

    var HandshakeCommand = ns.protocol.HandshakeCommand;
    var HandshakeState = ns.protocol.HandshakeState;

    var test_command = function () {
        var cmd = new Command();
        log('command: ', cmd);
        assert(ContentType.COMMAND.equals(cmd.type) === true, 'command error');
    };
    core_tests.push(test_command);

    var test_handshake = function () {
        var cmd = HandshakeCommand.start();
        log('handshake: ', cmd);
        var state = cmd.getState();
        log('handshake state: ', state);
        assert(HandshakeState.START.equals(state) === true, 'handshake command error');
    };
    core_tests.push(test_handshake);

}(DIMP);

!function (ns) {
    'use strict';

    var GroupCommand = ns.protocol.GroupCommand;

    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;

    var group = 'group id';
    var member = 'member id';
    var members = [member];

    var test_invite_group = function () {
        var cmd = GroupCommand.invite(group, members);
        log('invite command: ', cmd);
        assert(cmd instanceof InviteCommand, 'invite command error');
    };
    core_tests.push(test_invite_group);

    var test_expel_group = function () {
        var cmd = GroupCommand.expel(group, member);
        log('expel command: ', cmd);
        assert(cmd instanceof ExpelCommand, 'expel command error');
    };
    core_tests.push(test_expel_group);

    var test_join_group = function () {
        var cmd = GroupCommand.join(group);
        log('join command: ', cmd);
        assert(cmd instanceof JoinCommand, 'join command error');
    };
    core_tests.push(test_join_group);

    var test_quit_group = function () {
        var cmd = GroupCommand.quit(group);
        log('quit command: ', cmd);
        assert(cmd instanceof QuitCommand, 'quit command error');
    };
    core_tests.push(test_quit_group);

    var test_query_group = function () {
        var cmd = GroupCommand.query(group);
        log('query command: ', cmd);
        assert(cmd instanceof QueryCommand, 'query command error');
    };
    core_tests.push(test_query_group);

    var test_reset_group = function () {
        var cmd = GroupCommand.reset(group, members);
        log('reset command: ', cmd);
        assert(cmd instanceof ResetCommand, 'reset command error');
    };
    core_tests.push(test_reset_group);

}(DIMP);

!function (ns) {
    'use strict';

    var ID = ns.ID;

    var KeyCache = ns.core.KeyCache;
    var Barrack = ns.core.Barrack;
    var Transceiver = ns.core.Transceiver;

    var PlainKey = ns.plugins.PlainKey;

    var TextContent = ns.protocol.TextContent;
    var Envelope = ns.Envelope;
    var InstantMessage = ns.InstantMessage;

    var key_cache;
    var barrack;
    var transceiver;

    var sender = ID.ANYONE;
    var receiver = ID.EVERYONE;

    var test_key_cache = function () {
        key_cache = new KeyCache();
        // get key
        var key = key_cache.getCipherKey(sender, receiver);
        log('plain key: ', key);
        assert(key instanceof PlainKey, 'broadcast key error');
    };
    core_tests.push(test_key_cache);

    var test_barrack = function () {
        barrack = new Barrack();
        // get user
        var user = barrack.getUser(sender);
        log('user: ', user);
        assert(user.getType().isUser() === true, 'user error');
        // get group
        var group = barrack.getUser(receiver);
        log('group: ', group);
        assert(group.getType().isGroup() === true, 'group error');
    };
    core_tests.push(test_barrack);

    var test_transceiver = function () {
        transceiver = new Transceiver();
        transceiver.cipherKeyDelegate = key_cache;
        transceiver.entityDelegate = barrack;
        // test
        var content = new TextContent('Hello world!');
        log('content: ', content);
        var env = Envelope.newEnvelope(sender, receiver);
        log('envelope: ', env);
        var iMsg = InstantMessage.newMessage(content, env);
        log('instant message: ', iMsg);
        
        var sMsg = transceiver.encryptMessage(iMsg);
        log('secure message: ', sMsg);
        var nMsg = transceiver.decryptMessage(sMsg);
        log('decrypt message: ', nMsg);
        assert(nMsg.equals(iMsg) === true, 'decrypt failed');
    };
    core_tests.push(test_transceiver);

}(DIMP);
