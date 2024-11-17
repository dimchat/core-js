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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey  = ns.crypto.VerifyKey;

    var EntityType = ns.protocol.EntityType;
    var ID         = ns.protocol.ID;

    var Entity          = ns.mkm.Entity;
    var User            = ns.mkm.User;
    var Group           = ns.mkm.Group;
    var DocumentHelper  = ns.mkm.DocumentHelper;
    var BroadcastHelper = ns.mkm.BroadcastHelper;

    /**
     *  Entity Database
     *  ~~~~~~~~~~~~~~~
     *  Entity pool to manage User/Contact/Group/Member instances
     *  Manage meta/document for all entities
     *
     *      1st, get instance here to avoid create same instance,
     *      2nd, if they were updated, we can refresh them immediately here
     */
    var Barrack = function () {
        Object.call(this);
        // memory caches
        this.__users = {};   // ID => User
        this.__groups = {};  // ID => Group
    };
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {

        // protected
        cacheUser: function (user) {
            var delegate = user.getDataSource();
            if (!delegate) {
                user.setDataSource(this);
            }
            this.__users[user.getIdentifier()] = user;
        },

        // protected
        cacheGroup: function (group) {
            var delegate = group.getDataSource();
            if (!delegate) {
                group.setDataSource(this);
            }
            this.__groups[group.getIdentifier()] = group;
        },

        /**
         *  Call it when received 'UIApplicationDidReceiveMemoryWarningNotification',
         *  this will remove 50% of cached objects
         *
         * @return number of survivors
         */
        reduceMemory: function () {
            var finger = 0;
            finger = thanos(this.__users, finger);
            finger = thanos(this.__groups, finger);
            return finger >> 1;
        },

        /**
         *  Create user when visa.key exists
         *
         * @param {ID} identifier - user ID
         * @return {User} null on not ready
         */
        // protected
        createUser: function (identifier) {
            // throw Error('NotImplemented');
        },

        /**
         *  Create group when members exist
         *
         * @param {ID} identifier - group ID
         * @return {Group} null on not ready
         */
        // protected
        createGroup: function (identifier) {
            // throw Error('NotImplemented');
        },

        // protected
        getVisaKey: function (identifier) {
            var doc = this.getVisa(identifier);
            return !doc ? null : doc.getPublicKey();
        },

        // protected
        getMetaKey: function (identifier) {
            var meta = this.getMeta(identifier);
            return !meta ? null : meta.getPublicKey();
        },

        getVisa: function (identifier) {
            return DocumentHelper.lastVisa(this.getDocuments(identifier));
        },

        getBulletin: function (identifier) {
            return DocumentHelper.lastBulletin(this.getDocuments(identifier));
        },

        //
        //  Entity Delegate
        //

        // Override
        getUser: function (identifier) {
            // 1. get from user cache
            var user = this.__users[identifier];
            if (!user) {
                // 2. create user and cache it
                user = this.createUser(identifier);
                if (user) {
                    this.cacheUser(user);
                }
            }
            return user;
        },

        // Override
        getGroup: function (identifier) {
            // 1. get from group cache
            var group = this.__groups[identifier];
            if (!group) {
                // 2. create group and cache it
                group = this.createGroup(identifier);
                if (group) {
                    this.cacheGroup(group);
                }
            }
            return group;
        },

        //
        //  User Data Source
        //

        // Override
        getPublicKeyForEncryption: function (identifier) {
            // 1. get key from visa
            var key = this.getVisaKey(identifier);
            if (key) {
                // if visa.key exists, use it for encryption
                return key;
            }
            // 2. get key from meta
            key = this.getMetaKey(identifier);
            if (Interface.conforms(key, EncryptKey)) {
                // if visa.key not exists and meta.key is encrypt key,
                // use it for encryption
                return key;
            }
            //throw new Error("failed to get encrypt key for user: " + identifier);
            return null;
        },

        // Override
        getPublicKeysForVerification: function (identifier) {
            var keys = [];
            // 1. get key from visa
            var key = this.getVisaKey(identifier);
            if (Interface.conforms(key, VerifyKey)) {
                // the sender may use identity key to sign message.data,
                // try to verify it with meta.key
                keys.push(key);
            }
            // 2. get key from meta
            key = this.getMetaKey(identifier);
            if (key) {
                // the sender may use communication key to sign message.data,
                // so try to verify it with visa.key here
                keys.push(key);
            }
            //assert(keys.size() > 0, "failed to get verify key for user: " + identifier);
            return keys;
        },

        //
        //  Group Data Source
        //

        // Override
        getFounder: function (group) {
            // check for broadcast
            if (group.isBroadcast()) {
                // founder of broadcast group
                return BroadcastHelper.getBroadcastFounder(group);
            }
            // get from document
            var doc = this.getBulletin(group);
            if (doc/* && doc.isValid()*/) {
                return doc.getFounder();
            }
            // TODO: load founder from database
            return null;
        },

        // Override
        getOwner: function (group) {
            // check broadcast group
            if (group.isBroadcast()) {
                // owner of broadcast group
                return BroadcastHelper.getBroadcastOwner(group);
            }
            // check group type
            if (EntityType.GROUP.equals(group.getType())) {
                // Polylogue owner is its founder
                return this.getFounder(group);
            }
            // TODO: load owner from database
            return null;
        },

        // Override
        getMembers: function (group) {
            // check broadcast group
            if (group.isBroadcast()) {
                // members of broadcast group
                return BroadcastHelper.getBroadcastMembers(group);
            }
            // TODO: load members from database
            return [];
        },

        // Override
        getAssistants: function (group) {
            // get from document
            var doc = this.getBulletin(group);
            if (doc/* && doc.isValid()*/) {
                var bots = doc.getAssistants();
                if (bots) {
                    return bots;
                }
            }
            // TODO: get group bots from SP configuration
            return [];
        }
    });

    /**
     *  Remove 1/2 objects from the dictionary
     *  (Thanos can kill half lives of a world with a snap of the finger)
     *
     * @param {{}} planet
     * @param {number} finger
     * @returns {number} number of survivors
     */
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            //if (typeof p === 'function') {
            //    // ignore
            //    continue;
            //}
            finger += 1;
            if ((finger & 1) === 1) {
                // kill it
                delete planet[k];
            } // else, let it go
        }
        return finger;
    };

    //-------- namespace --------
    ns.Barrack = Barrack;

})(DIMP);
