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
 *  Entity Database
 *  ~~~~~~~~~~~~~~~
 *  Manage meta for all entities
 */

//! require <mkm.js>
//! require 'delegate.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;

    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;

    var ID = ns.protocol.ID;
    var NetworkType = ns.protocol.NetworkType;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;

    var Entity  = ns.Entity;
    var User  = ns.User;
    var Group = ns.Group;

    var Barrack = function () {
        obj.call(this);
        // memory caches
        this.__users  = {};  // String -> User
        this.__groups = {};  // String -> Group
    };
    ns.Class(Barrack, obj, [Entity.Delegate, User.DataSource, Group.DataSource]);

    /**
     *  Remove 1/2 objects from the dictionary
     *  (Thanos can kill half lives of a world with a snap of the finger)
     *
     * @param {{}} map
     * @param {Number} finger
     * @returns {Number} number of survivors
     */
    var thanos = function (map, finger) {
        var keys = Object.keys(map);
        for (var i = 0; i < keys.length; ++i) {
            var p = map[keys[i]];
            if (typeof p === 'function') continue;
            if ((++finger & 1) === 1) {
                // kill it
                delete map[p];
            }
            // let it go
        }
        return finger;
    };

    /**
     *  Call it when received 'UIApplicationDidReceiveMemoryWarningNotification',
     *  this will remove 50% of cached objects
     *
     * @returns {Number}
     */
    Barrack.prototype.reduceMemory = function () {
        var finger = 0;
        finger = thanos(this.__users, finger);
        finger = thanos(this.__groups, finger);
        return finger >> 1;
    };

    //
    //  cache
    //

    var cacheUser = function (user) {
        if (!user.getDataSource()) {
            user.setDataSource(this);
        }
        this.__users[user.identifier.toString()] = user;
        return true;
    };

    var cacheGroup = function (group) {
        if (!group.getDataSource()) {
            group.setDataSource(this);
        }
        this.__groups[group.identifier.toString()] = group;
        return true;
    };

    // noinspection JSUnusedLocalSymbols
    Barrack.prototype.createUser = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    Barrack.prototype.createGroup = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get all local users (for decrypting received message)
     *
     * @return {User[]} users with private key
     */
    Barrack.prototype.getLocalUsers = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- EntityDelegate --------

    // @override
    Barrack.prototype.selectLocalUser = function (receiver) {
        var users = this.getLocalUsers();
        if (users == null || users.length === 0) {
            throw new Error("local users should not be empty");
        } else if (receiver.isBroadcast()) {
            // broadcast message can decrypt by anyone, so just return current user
            return users[0];
        }
        var i, user;
        if (receiver.isGroup()) {
            // group message (recipient not designated)
            var members = this.getMembers(receiver);
            if (members == null || members.length === 0) {
                // TODO: group not ready, waiting for group info
                return null;
            }
            var j, member;
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                for (j = 0; j < members.length; ++j) {
                    member = members[j];
                    if (member.equals(user.identifier)) {
                        // DISCUSS: set this item to be current user?
                        return user;
                    }
                }
            }
        } else {
            // 1. personal message
            // 2. split group message
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                if (receiver.equals(user.identifier)) {
                    // DISCUSS: set this item to be current user?
                    return user;
                }
            }
        }
        return null;
    };

    // @override
    Barrack.prototype.getUser = function (identifier) {
        // 1. get from user cache
        var user = this.__users[identifier.toString()];
        if (!user) {
            // 2. create user and cache it
            user = this.createUser(identifier);
            if (user) {
                cacheUser.call(this, user);
            }
        }
        return user;
    };

    // @override
    Barrack.prototype.getGroup = function (identifier) {
        // 1. get from group cache
        var group = this.__groups[identifier.toString()];
        if (!group) {
            // 2. create group and cache it
            group = this.createGroup(identifier);
            if (group) {
                cacheGroup.call(this, group);
            }
        }
        return group;
    };

    //-------- User DataSource --------

    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
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

    Barrack.prototype.getPublicKeyForEncryption = function (identifier) {
        // 1. get key from visa
        var key = visa_key.call(this, identifier);
        if (key) {
            // if visa.key exists, use it for encryption
            return key;
        }
        // 2. get key from meta
        key = meta_key.call(this, identifier);
        if (ns.Interface.conforms(key, EncryptKey)) {
            // if visa.key not exists and meta.key is encrypt key,
            // use it for encryption
            return key;
        }
        return null;
    };

    Barrack.prototype.getPublicKeysForVerification = function (identifier) {
        var keys = [];
        // 1. get key from visa
        var key = visa_key.call(this, identifier);
        if (ns.Interface.conforms(key, VerifyKey)) {
            // the sender may use communication key to sign message.data,
            // so try to verify it with visa.key here
            keys.push(key);
        }
        // 2. get key from meta
        key = meta_key.call(this, identifier);
        if (key) {
            // the sender may use identity key to sign message.data,
            // try to verify it with meta.key
            keys.push(key);
        }
        return keys;
    };

    //-------- Group DataSource --------

    var group_seed = function (identifier) {
        var seed = identifier.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === 'everyone')) {
                seed = null;
            }
        }
        return seed;
    };

    Barrack.prototype.getBroadcastFounder = function (group) {
        var seed = group_seed(group);
        if (seed) {
            // DISCUSS: who should be the founder of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.founder@anywhere'
            return ID.parse(seed + ".founder@anywhere");
        } else {
            // Consensus: the founder of group 'everyone@everywhere'
            //            'Albert Moky'
            return ID.FOUNDER;
        }
    };

    Barrack.prototype.getBroadcastOwner = function (group) {
        var seed = group_seed(group);
        if (seed) {
            // DISCUSS: who should be the owner of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.owner@anywhere'
            return ID.parse(seed + ".owner@anywhere");
        } else {
            // Consensus: the owner of group 'everyone@everywhere'
            //            'anyone@anywhere'
            return ID.ANYONE;
        }
    };

    Barrack.prototype.getBroadcastMembers = function (group) {
        var seed = group_seed(group);
        if (seed) {
            // DISCUSS: who should be the member of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.member@anywhere'
            return ID.parse(seed + ".member@anywhere");
        } else {
            // Consensus: the member of group 'everyone@everywhere'
            //            'anyone@anywhere'
            return ID.ANYONE;
        }
    };

    Barrack.prototype.getFounder = function (group) {
        // check for broadcast
        if (group.isBroadcast()) {
            // founder of broadcast group
            return this.getBroadcastFounder(group);
        }
        // check group meta
        var gMeta = this.getMeta(group);
        if (!gMeta) {
            // FIXME: when group profile was arrived but the meta still on the way,
            //        here will cause founder not found
            return null;
        }
        // check each member's public key with group meta
        var members = this.getMembers(group);
        if (members != null) {
            var mMeta;
            for (var i = 0; i < members.length; ++i) {
                mMeta = this.getMeta(members[i]);
                if (!mMeta) {
                    // failed to get member's meta
                    continue;
                }
                if (gMeta.matches(mMeta.getKey())) {
                    // if the member's public key matches with the group's meta,
                    // it means this meta was generated by the member's private key
                    return members[i];
                }
            }
        }
        // TODO: load founder from database
        return null;
    };

    Barrack.prototype.getOwner = function (group) {
        // check broadcast group
        if (group.isBroadcast()) {
            // owner of broadcast group
            return this.getBroadcastOwner(group);
        }
        // check group type
        if (NetworkType.POLYLOGUE.equals(group.getType())) {
            // Polylogue's owner is its founder
            return this.getFounder(group);
        }
        // TODO: load owner from database
        return null;
    };

    Barrack.prototype.getMembers = function (group) {
        // check broadcast group
        if (group.isBroadcast()) {
            // members of broadcast group
            return this.getBroadcastMembers(group);
        }
        // TODO: load members from database
        return null;
    };

    Barrack.prototype.getAssistants = function (group) {
        var doc = this.getDocument(group, Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            if (doc.isValid()) {
                return doc.getAssistants();
            }
        }
        // TODO: get group bots from SP configuration
        return null;
    };

    //-------- namespace --------
    ns.core.Barrack = Barrack;

    ns.core.registers('Barrack');

})(DIMP);
