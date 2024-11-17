;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2023 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2023 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

//!require 'protocol/command.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class     = ns.type.Class;
    var Wrapper   = ns.type.Wrapper;
    var Converter = ns.type.Converter;

    var Command = ns.protocol.Command;

    var GeneralFactory = function () {
        this.__commandFactories = {};  // name => Command.Factory
    };
    Class(GeneralFactory, null, null, {

        setCommandFactory: function (cmd, factory) {
            this.__commandFactories[cmd] = factory;
        },
        getCommandFactory: function (cmd) {
            return this.__commandFactories[cmd];
        },

        getCmd: function (content, defaultValue) {
            return Converter.getString(content['command'], defaultValue);
        },

        parseCommand: function (content) {
            if (!content) {
                return null;
            } else if (Interface.conforms(content, Command)) {
                return content;
            }
            var info = Wrapper.fetchMap(content);
            if (!info) {
                return null;
            }
            // get factory by command name
            var cmd = this.getCmd(info, '');
            var factory = this.getCommandFactory(cmd);
            if (!factory) {
                // unknown command name, get base command factory
                factory = default_factory(info);
            }
            return factory.parseCommand(info);
        }
    });

    var default_factory = function (info) {
        var man = ns.dkd.MessageFactoryManager;
        var gf = man.generalFactory;
        var type = gf.getContentType(info, 0);
        var factory = gf.getContentFactory(type);
        if (Interface.conforms(factory, Command.Factory)) {
            return factory;
        }
        return null;
    };

    var FactoryManager = {
        generalFactory: new GeneralFactory()
    };

    //-------- namespace --------
    ns.dkd.cmd.CommandGeneralFactory = GeneralFactory;
    ns.dkd.cmd.CommandFactoryManager = FactoryManager;

})(DIMP);
