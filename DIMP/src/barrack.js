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

//! require <mkm.js>
//! require 'delegate.js'

!function (ns) {
    'use strict';

    var ID = ns.ID;
    var User = ns.User;
    var Group = ns.Group;

    var EntityDelegate  = ns.EntityDelegate;
    var UserDataSource  = ns.UserDataSource;
    var GroupDataSource = ns.GroupDataSource;

    var Barrack = function () {
        // memory caches
        this.idMap    = {};  // String -> ID
        this.metaMap  = {};  // ID -> Meta
        this.userMap  = {};  // ID -> User
        this.groupMap = {};  // ID -> Group
    };
    ns.Class(Barrack, ns.type.Object, EntityDelegate, UserDataSource, GroupDataSource);

    /**
     *  Remove 1/2 objects from the dictionary
     *  (Thanos can kill half lives of a world with a snap of the finger)
     *
     * @param map {{}}
     * @param finger {Number}
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
        finger = thanos(this.idMap, finger);
        finger = thanos(this.metaMap, finger);
        finger = thanos(this.userMap, finger);
        finger = thanos(this.groupMap, finger);
        return finger >> 1;
    };

    //
    //  cache
    //

    Barrack.prototype.cacheIdentifier = function (identifier) {
        this.idMap[identifier.toString()] = identifier;
        return true;
    };

    Barrack.prototype.cacheMeta = function (meta, identifier) {
        this.metaMap[identifier] = meta;
        return true;
    };

    Barrack.prototype.cacheUser = function (user) {
        if (!user.delegate) {
            user.delegate = this;
        }
        this.userMap[user.identifier] = user;
        return true;
    };

    Barrack.prototype.cacheGroup = function (group) {
        if (!group.delegate) {
            group.delegate = this;
        }
        this.groupMap[group.identifier] = group;
        return true;
    };

    //
    //  factory
    //

    Barrack.prototype.createIdentifier = function (string) {
        return ID.getInstance(string);
    };

    Barrack.prototype.createUser = function (identifier) {
        // make sure meta exits before creating user
        return new User(identifier);
    };

    Barrack.prototype.createGroup = function (identifier) {
        // make sure meta exits before creating group
        return new Group(identifier);
    };

    //-------- EntityDelegate --------

    // @override
    Barrack.prototype.getIdentifier = function (string) {
        if (!string || string instanceof ID) {
            return string;
        }
        // 1. get from ID cache
        var identifier = this.idMap[string];
        if (identifier) {
            return identifier;
        }
        // 2. create ID and cache it
        identifier = this.createIdentifier(string);
        if (identifier && this.cacheIdentifier(identifier)) {
            return identifier;
        }
        // failed to create ID
        return null;
    };

    // @override
    Barrack.prototype.getUser = function (identifier) {
        // 1. get from user cache
        var user = this.userMap[identifier];
        if (user) {
            return user;
        }
        // 2. create user and cache it
        user = this.createUser(identifier);
        if (user && this.cacheUser(user)) {
            return user;
        }
        // failed to create user
        return null;
    };

    // @override
    Barrack.prototype.getGroup = function (identifier) {
        // 1. get from group cache
        var group = this.groupMap[identifier];
        if (group) {
            return group;
        }
        // 2. create group and cache it
        group = this.createGroup(identifier);
        if (group && this.cacheGroup(group)) {
            return group;
        }
        // failed to create group
        return null;
    };

    //-------- EntityDataSource --------

    // @override
    Barrack.prototype.getMeta = function (identifier) {
        return this.metaMap[identifier];
    };

    //-------- UserDataSource --------

    // @override
    Barrack.prototype.getPublicKeyForEncryption = function (identifier) {
        console.assert(identifier.getType().isUser(), 'user ID error');
        // NOTICE: return nothing to use profile.key or meta.key
        return null;
    };

    // @override
    Barrack.prototype.getPublicKeysForVerification = function (identifier) {
        console.assert(identifier.getType().isUser(), 'user ID error');
        // NOTICE: return nothing to use profile.key or meta.key
        return null;
    };

    //-------- GroupDataSource --------

    // @override
    Barrack.prototype.getFounder = function (identifier) {
        // check for broadcast
        if (identifier.isBroadcast()) {
            var founder;
            var name = identifier.name;
            if (!name || name === 'everyone') {
                // Consensus: the founder of group 'everyone@everywhere'
                //            'Albert Moky'
                founder = 'moky@anywhere';
            } else {
                // DISCUSS: who should be the founder of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.founder@anywhere'
                founder = name + ".founder@anywhere";
            }
            return this.getIdentifier(founder);
        }
        // do it by subclass
        return null;
    };

    // @override
    Barrack.prototype.getOwner = function (identifier) {
        // check for broadcast
        if (identifier.isBroadcast()) {
            var owner;
            var name = identifier.name;
            if (!name || name === 'everyone') {
                // Consensus: the owner of group 'everyone@everywhere'
                //            'anyone@anywhere'
                owner = 'anyone@anywhere';
            } else {
                // DISCUSS: who should be the owner of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.owner@anywhere'
                owner = name + ".owner@anywhere";
            }
            return this.getIdentifier(owner);
        }
        // do it by subclass
        return null;
    };

    // @override
    Barrack.prototype.getMembers = function (identifier) {
        // check for broadcast
        if (identifier.isBroadcast()) {
            var member;
            var name = identifier.name;
            if (!name || name === 'everyone') {
                // Consensus: the member of group 'everyone@everywhere'
                //            'anyone@anywhere'
                member = 'anyone@anywhere';
            } else {
                // DISCUSS: who should be the member of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.member@anywhere'
                member = name + ".member@anywhere";
            }
            var list = [];
            // add the owner first
            var owner = this.getOwner(identifier);
            if (owner) {
                list.push(owner);
            }
            // check and add member
            member = this.getIdentifier(member);
            if (member && !member.equals(owner)) {
                list.push(member);
            }
            return list;
        }
        // do it by subclass
        return null;
    };

    //-------- namespace --------
    ns.core.Barrack = Barrack;

    ns.core.register('Barrack');

}(DIMP);
