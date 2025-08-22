'use strict';

//
//  Test Cases
//
var core_tests = [];

!function (dkd, mkm, mk) {

    var TransportableData = mk.protocol.TransportableData;
    var ContentType = dkd.protocol.ContentType;
    var FileContent = dkd.protocol.FileContent;
    var BaseTextContent  = dkd.dkd.BaseTextContent;
    var ImageFileContent = dkd.dkd.ImageFileContent;
    var AudioFileContent = dkd.dkd.AudioFileContent;
    var VideoFileContent = dkd.dkd.VideoFileContent;

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
        var ted = TransportableData.parse(data);
        var content = FileContent.image(ted, filename, null, null);
        // var content = new ImageFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.IMAGE === content.getType(), 'image content error');
    };
    core_tests.push(test_image_content);

    var test_audio_content = function () {
        var filename = 'voice.mp3';
        var data = 'Base64==';
        var ted = TransportableData.parse(data);
        var content = FileContent.audio(ted, filename, null, null);
        // var content = new AudioFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.AUDIO === content.getType(), 'audio content error');
    };
    core_tests.push(test_audio_content);

    var test_video_content = function () {
        var filename = 'movie.mp4';
        var data = 'Base64==';
        var ted = TransportableData.parse(data);
        var content = FileContent.video(ted, filename, null, null);
        // var content = new VideoFileContent(filename, data);
        log('content: ', content);
        assert(ContentType.VIDEO === content.getType(), 'video content error');
    };
    core_tests.push(test_video_content);

}(DaoKeDao, MingKeMing, MONKEY);

!function (dkd, mkm, mk) {

    var Interface = mk.type.Interface;
    var ID = mkm.protocol.ID;
    var GroupCommand  = dkd.protocol.GroupCommand;
    var InviteCommand = dkd.protocol.InviteCommand;
    var ExpelCommand  = dkd.protocol.ExpelCommand;
    var JoinCommand   = dkd.protocol.JoinCommand;
    var QuitCommand   = dkd.protocol.QuitCommand;
    var ResetCommand  = dkd.protocol.ResetCommand;

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

    // var test_query_group = function () {
    //     var cmd = GroupCommand.query(group);
    //     log('query command: ', cmd);
    //     assert(Interface.conforms(cmd, QueryCommand), 'query command error');
    // };
    // core_tests.push(test_query_group);

    var test_reset_group = function () {
        var cmd = GroupCommand.reset(group, members);
        log('reset command: ', cmd);
        assert(Interface.conforms(cmd, ResetCommand), 'reset command error');
    };
    core_tests.push(test_reset_group);

}(DaoKeDao, MingKeMing, MONKEY);
