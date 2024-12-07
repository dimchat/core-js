;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
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

//! require 'protocol/docs.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var UTF8      = ns.format.UTF8;

    var Address   = ns.protocol.Address;
    var ID        = ns.protocol.ID;
    var Visa      = ns.protocol.Visa;
    var Bulletin  = ns.protocol.Bulletin;

    /**
     *  BroadcastHelper
     *  ~~~~~~~~~~~~~~~
     */

    var getGroupSeed = function (group_id) {
        var name = group_id.getName();
        if (name) {
            var len = name.length;
            if (len === 0) {
                return null;
            } else if (name === 8 && name.toLowerCase() === 'everyone') {
                return null;
            }
        }
        return name;
    };

    var getBroadcastFounder = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            // Consensus: the founder of group 'everyone@everywhere'
            //            'Albert Moky'
            return ID.FOUNDER;
        } else {
            // DISCUSS: who should be the founder of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.founder@anywhere'
            return ID.parse(name + '.founder@anywhere');
        }
    };

    var getBroadcastOwner = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            // Consensus: the owner of group 'everyone@everywhere'
            //            'anyone@anywhere'
            return ID.ANYONE;
        } else {
            // DISCUSS: who should be the owner of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.owner@anywhere'
            return ID.parse(name + '.owner@anywhere');
        }
    };

    var getBroadcastMembers = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            // Consensus: the member of group 'everyone@everywhere'
            //            'anyone@anywhere'
            return [ID.ANYONE];
        } else {
            // DISCUSS: who should be the member of group 'xxx@everywhere'?
            //          'anyone@anywhere', or 'xxx.member@anywhere'
            var owner = ID.parse(name + '.owner@anywhere');
            var member = ID.parse(name + '.member@anywhere');
            return [owner, member];
        }
    };

    /**
     *  MetaHelper
     *  ~~~~~~~~~~
     */

    var checkMeta = function (meta) {
        var pKey = meta.getPublicKey();
        if (!pKey) {
            // meta.key should not be empty
            return false;
        }
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        // check meta seed & signature
        if (!seed || seed.length === 0) {
            // this meta has no seed, so no fingerprint too
            return !fingerprint || fingerprint.length === 0;
        } else if (!fingerprint || fingerprint.length === 0) {
            // fingerprint should not be empty here
            return false;
        }
        // verify fingerprint
        var data = UTF8.encode(seed);
        return pKey.verify(data, fingerprint);
    };

    var matchIdentifier = function (identifier, meta) {
        // check ID.name
        var seed = meta.getSeed();
        var name = identifier.getName();
        if (seed !== name) {
            return false;
        }
        // check ID.address
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen);
    };

    var matchPublicKey = function (pKey, meta) {
        // check whether the public key equals to meta.key
        if (meta.getPublicKey().equals(pKey)) {
            return true;
        }
        // check with seed & fingerprint
        var seed = meta.getSeed();
        if (seed && seed.length > 0) {
            // check whether keys equal by verifying signature
            var data = UTF8.encode(seed);
            var fingerprint = meta.getFingerprint();
            return pKey.verify(data, fingerprint);
        } else {
            // NOTICE: ID with BTC/ETH address has no username, so
            //         just compare the key.data to check matching
            return false;
        }
    };

    /**
     *  DocumentHelper
     *  ~~~~~~~~~~~~~~
     */

    // Check whether this time is before old time
    var isBefore = function (oldTime, thisTime) {
        if (!oldTime || !thisTime) {
            return false;
        }
        return thisTime.getTime() < oldTime.getTime();
    };

    // Check whether this document's time is before old document's time
    var isExpired = function (thisDoc, oldDoc) {
        var thisTime = thisDoc.getTime();
        var oldTime = oldDoc.getTime();
        return isBefore(oldTime, thisTime);
    };

    // Select last document matched the type
    var lastDocument = function (documents, type) {
        if (!documents || documents.length === 0) {
            return null;
        } else if (!type || type === '*') {
            type = '';
        }
        var checkType = type.length > 0;
        var last = null;
        var doc, docType, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            // 1. check type
            if (checkType) {
                docType = doc.getType();
                matched = !docType || docType.length === 0 || docType === type;
                if (!matched) {
                    // type not matched, skip it
                    continue;
                }
            }
            // 2. check time
            if (last != null && isExpired(doc, last)) {
                // skip expired document
                continue;
            }
            // got it
            last = doc;
        }
        return last;
    };

    // Select last visa document
    var lastVisa = function (documents) {
        if (!documents || documents.length === 0) {
            return null;
        }
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            // 1. check type
            matched = Interface.conforms(doc, Visa);
            if (!matched) {
                // type not matched, skip it
                continue;
            }
            // 2. check time
            if (last != null && isExpired(doc, last)) {
                // skip expired document
                continue;
            }
            // got it
            last = doc;
        }
        return last;
    };

    // Select last bulletin document
    var lastBulletin = function (documents) {
        if (!documents || documents.length === 0) {
            return null;
        }
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            // 1. check type
            matched = Interface.conforms(doc, Bulletin);
            if (!matched) {
                // type not matched, skip it
                continue;
            }
            // 2. check time
            if (last != null && isExpired(doc, last)) {
                // skip expired document
                continue;
            }
            // got it
            last = doc;
        }
        return last;
    };

    //-------- namespace --------
    ns.mkm.BroadcastHelper = {
        getGroupSeed: getGroupSeed,

        getBroadcastFounder: getBroadcastFounder,
        getBroadcastOwner  : getBroadcastOwner,
        getBroadcastMembers: getBroadcastMembers
    };
    ns.mkm.MetaHelper = {
        checkMeta      : checkMeta,
        matchIdentifier: matchIdentifier,
        matchPublicKey : matchPublicKey
    }
    ns.mkm.DocumentHelper = {
        isBefore : isBefore,
        isExpired: isExpired,

        lastDocument: lastDocument,
        lastVisa    : lastVisa,
        lastBulletin: lastBulletin
    }

})(DIMP);
