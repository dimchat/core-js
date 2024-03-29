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
 *
 *  Manage meta/document for all entities
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey  = ns.crypto.VerifyKey;

    var EntityType = ns.protocol.EntityType;
    var ID         = ns.protocol.ID;
    var Meta       = ns.protocol.Meta;
    var Document   = ns.protocol.Document;
    var Visa       = ns.protocol.Visa;
    var Bulletin   = ns.protocol.Bulletin;

    var Entity = ns.mkm.Entity;
    var User   = ns.mkm.User;
    var Group  = ns.mkm.Group;

    var Barrack = function () {
        Object.call(this);
    };
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {

        // protected
        getBroadcastFounder: function (group) {
            var name = group_seed(group);
            if (name) {
                // DISCUSS: who should be the founder of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.founder@anywhere'
                return ID.parse(name + ".founder@anywhere");
            } else {
                // Consensus: the founder of group 'everyone@everywhere'
                //            'Albert Moky'
                return ID.FOUNDER;
            }
        },

        // protected
        getBroadcastOwner: function (group) {
            var name = group_seed(group);
            if (name) {
                // DISCUSS: who should be the owner of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.owner@anywhere'
                return ID.parse(name + ".owner@anywhere");
            } else {
                // Consensus: the owner of group 'everyone@everywhere'
                //            'anyone@anywhere'
                return ID.ANYONE;
            }
        },

        // protected
        getBroadcastMembers: function (group) {
            var members = [];
            var name = group_seed(group);
            if (name) {
                // DISCUSS: who should be the member of group 'xxx@everywhere'?
                //          'anyone@anywhere', or 'xxx.member@anywhere'
                var owner = ID.parse(name + ".owner@anywhere");
                var member = ID.parse(name + ".member@anywhere");
                members.push(owner);
                members.push(member);
            } else {
                // Consensus: the member of group 'everyone@everywhere'
                //            'anyone@anywhere'
                members.push(ID.ANYONE);
            }
            return members;
        },

        //-------- User DataSource --------

        // Override
        getPublicKeyForEncryption: function (identifier) {
            // 1. get key from visa
            var key = visa_key.call(this, identifier);
            if (key) {
                // if visa.key exists, use it for encryption
                return key;
            }
            // 2. get key from meta
            key = meta_key.call(this, identifier);
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
            var key = visa_key.call(this, identifier);
            if (Interface.conforms(key, VerifyKey)) {
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
            //assert(keys.size() > 0, "failed to get verify key for user: " + identifier);
            return keys;
        },

        //-------- Group DataSource --------

        // Override
        getFounder: function (group) {
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
            if (members) {
                var item, mMeta;
                for (var i = 0; i < members.length; ++i) {
                    item = members[i];
                    mMeta = this.getMeta(item);
                    if (!mMeta) {
                        // failed to get member's meta
                        continue;
                    }
                    if (Meta.matchKey(mMeta.getKey(), gMeta)) {
                        // if the member's public key matches with the group's meta,
                        // it means this meta was generated by the member's private key
                        return item;
                    }
                }
            }
            // TODO: load founder from database
            return null;
        },

        // Override
        getOwner: function (group) {
            // check broadcast group
            if (group.isBroadcast()) {
                // owner of broadcast group
                return this.getBroadcastOwner(group);
            }
            // check group type
            if (EntityType.GROUP.equals(group.getType())) {
                // Polylogue's owner is its founder
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
                return this.getBroadcastMembers(group);
            }
            // TODO: load members from database
            return null;
        },

        // Override
        getAssistants: function (group) {
            var doc = this.getDocument(group, Document.BULLETIN);
            if (Interface.conforms(doc, Bulletin)) {
                if (doc.isValid()) {
                    return doc.getAssistants();
                }
            }
            // TODO: get group bots from SP configuration
            return null;
        }
    });

    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (Interface.conforms(doc, Visa)) {
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

    var group_seed = function (gid) {
        var seed = gid.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === 'everyone')) {
                seed = null;
            }
        }
        return seed;
    };

    //-------- namespace --------
    ns.Barrack = Barrack;

})(DIMP);
