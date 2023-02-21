;

//
//  Test Cases
//
core_tests = [];

!function (ns) {
    'use strict';

    var ContentType = ns.protocol.ContentType;
    var BaseTextContent = ns.dkd.BaseTextContent;
    var ImageFileContent = ns.dkd.ImageFileContent;
    var AudioFileContent = ns.dkd.AudioFileContent;
    var VideoFileContent = ns.dkd.VideoFileContent;

    var test_text_content = function () {
        var text = 'Hello world!';
        var content = new BaseTextContent(text);
        log('content: ', content);
        assert(content.getText() === text, 'text content error');
    };
    core_tests.push(test_text_content);

    var test_image_content = function () {
        var filename = 'avatar.jpg';
        var data = 'Base64==';
        var content = new ImageFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.IMAGE.equals(content.getType()) === true, 'image content error');
    };
    core_tests.push(test_image_content);

    var test_audio_content = function () {
        var filename = 'voice.mp3';
        var data = 'Base64==';
        var content = new AudioFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.AUDIO.equals(content.getType()) === true, 'audio content error');
    };
    core_tests.push(test_audio_content);

    var test_video_content = function () {
        var filename = 'movie.mp4';
        var data = 'Base64==';
        var content = new VideoFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.VIDEO.equals(content.getType()) === true, 'video content error');
    };
    core_tests.push(test_video_content);

}(DIMP);

!function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;

    var group = 'group id';
    var member = ID.ANYONE;
    var members = [member];

    var test_invite_group = function () {
        var cmd = GroupCommand.invite(group, members);
        log('invite command: ', cmd);
        assert(Interface.conforms(cmd, InviteCommand), 'invite command error');
    };
    core_tests.push(test_invite_group);

    var test_expel_group = function () {
        var cmd = GroupCommand.expel(group, member);
        log('expel command: ', cmd);
        assert(Interface.conforms(cmd, ExpelCommand), 'expel command error');
    };
    core_tests.push(test_expel_group);

    var test_join_group = function () {
        var cmd = GroupCommand.join(group);
        log('join command: ', cmd);
        assert(Interface.conforms(cmd, JoinCommand), 'join command error');
    };
    core_tests.push(test_join_group);

    var test_quit_group = function () {
        var cmd = GroupCommand.quit(group);
        log('quit command: ', cmd);
        assert(Interface.conforms(cmd, QuitCommand), 'quit command error');
    };
    core_tests.push(test_quit_group);

    var test_query_group = function () {
        var cmd = GroupCommand.query(group);
        log('query command: ', cmd);
        assert(Interface.conforms(cmd, QueryCommand), 'query command error');
    };
    core_tests.push(test_query_group);

    var test_reset_group = function () {
        var cmd = GroupCommand.reset(group, members);
        log('reset command: ', cmd);
        assert(Interface.conforms(cmd, ResetCommand), 'reset command error');
    };
    core_tests.push(test_reset_group);

}(DIMP);
