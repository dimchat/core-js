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
