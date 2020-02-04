;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
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

/**
 *  Command message: {
 *      type : 0x88,
 *      sn   : 123,
 *
 *      command   : "profile", // command name
 *      ID        : "{ID}",    // entity ID
 *      meta      : {...},     // only for handshaking with new friend
 *      profile   : {...},     // when profile is empty, means query for ID
 *      signature : "..."      // old profile's signature for querying
 *  }
 */

//! require 'meta.js'

!function (ns) {
    'use strict';

    var ID = ns.ID;
    var Profile = ns.Profile;

    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;

    /**
     *  Create profile command
     *
     * @param info - command info; or entity ID
     * @constructor
     */
    var ProfileCommand = function (info) {
        var identifier = null;
        if (!info) {
            // create empty profile command
            info = Command.PROFILE;
        } else if (info instanceof ID) {
            // create query profile command with entity ID
            identifier = info;
            info = Command.PROFILE;
        }
        MetaCommand.call(this, info);
        if (identifier) {
            this.setIdentifier(info);
        }
        // lazy
        this.profile = null;
    };
    ProfileCommand.inherits(MetaCommand);

    //-------- setter/getter --------

    ProfileCommand.prototype.getProfile = function () {
        if (!this.profile) {
            var info = this.getValue('profile');
            if (typeof info === 'string') {
                // compatible with v1.0
                //    "ID"        : "{ID}",
                //    "profile"   : "{JsON}",
                //    "signature" : "{BASE64}"
                info = {
                    'ID': this.getIdentifier(),
                    'data': info,
                    'signature': this.getValue('signature')
                };
            } else {
                // (v1.1)
                //    "ID"      : "{ID}",
                //    "profile" : {
                //        "ID"        : "{ID}",
                //        "data"      : "{JsON}",
                //        "signature" : "{BASE64}"
                //    }
            }
            this.profile = Profile.getInstance(info);
        }
        return this.profile;
    };
    ProfileCommand.prototype.setProfile = function (profile) {
        this.setValue('profile', profile);
        this.profile = profile;
    };

    ProfileCommand.prototype.getSignature = function () {
        return this.getValue('signature');
    };
    ProfileCommand.prototype.setSignature = function (base64) {
        this.setValue('signature', base64);
    };

    //-------- factories --------

    ProfileCommand.query = function (identifier, signature) {
        var cmd = new ProfileCommand(identifier);
        if (signature) {
            cmd.setSignature(signature);
        }
        return cmd;
    };

    ProfileCommand.response = function (identifier, profile, meta) {
        var cmd = new ProfileCommand(identifier);
        cmd.setProfile(profile);
        if (meta) {
            cmd.setMeta(meta);
        }
        return cmd;
    };

    //-------- register --------
    Command.register(Command.PROFILE, ProfileCommand);

    //-------- namespace --------
    ns.protocol.ProfileCommand = ProfileCommand;

}(DIMP);
