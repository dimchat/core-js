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

/**
 *  User/Group Meta data
 *  ~~~~~~~~~~~~~~~~~~~~
 *  This class is used to generate entity ID
 *
 *      data format: {
 *          version: 1,          // algorithm version
 *          seed: "moKy",        // user/group name
 *          key: "{public key}", // PK = secp256k1(SK);
 *          fingerprint: "..."   // CT = sign(seed, SK);
 *      }
 *
 *      algorithm:
 *          fingerprint = sign(seed, SK);
 */

//! require <crypto.js>
//! require <mkm.js>

(function (ns) {
    'use strict';

    var Class      = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Base64     = ns.format.Base64;

    var PublicKey = ns.crypto.PublicKey;

    var MetaType = ns.protocol.MetaType;
    var Meta     = ns.protocol.Meta;

    var EnumToUint = function (type) {
        if (typeof type === 'number') {
            return type;
        } else {
            return type.valueOf();
        }
    };

    /**
     *  Create Meta
     *
     *  Usages:
     *      1. new BaseMeta(map);
     *      2. new BaseMeta(type, key);
     *      3. new BaseMeta(type, key, seed, fingerprint);
     */
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var meta;
        if (arguments.length === 1) {
            // new BaseMeta(map);
            meta = arguments[0];
            // lazy load
            type = 0;
            key = null;
            seed = null;
            fingerprint = null;
        } else if (arguments.length === 2) {
            // new BaseMeta(type, key);
            type = EnumToUint(arguments[0]);
            key = arguments[1];
            seed = null;
            fingerprint = null;
            meta = {
                'type': type,
                'key': key.toMap()
            };
        } else if (arguments.length === 4) {
            // new BaseMeta(type, key, seed, fingerprint);
            type = EnumToUint(arguments[0]);
            key = arguments[1];
            seed = arguments[2];
            fingerprint = arguments[3];
            meta = {
                'type': type,
                'key': key.toMap(),
                'seed': seed,
                'fingerprint': Base64.encode(fingerprint)
            };
        } else {
            throw new SyntaxError('meta arguments error: ' + arguments);
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
    };
    Class(BaseMeta, Dictionary, [Meta]);

    // Override
    BaseMeta.prototype.getType = function () {
        if (this.__type === 0) {
            this.__type = this.getNumber('type');
        }
        return this.__type;
    };

    // Override
    BaseMeta.prototype.getKey = function () {
        if (this.__key === null) {
            var key = this.getValue('key');
            this.__key = PublicKey.parse(key);
        }
        return this.__key;
    };

    // Override
    BaseMeta.prototype.getSeed = function () {
        if (this.__seed === null && MetaType.hasSeed(this.getType())) {
            this.__seed = this.getString('seed');
        }
        return this.__seed;
    };

    // Override
    BaseMeta.prototype.getFingerprint = function () {
        if (this.__fingerprint === null && MetaType.hasSeed(this.getType())) {
            var base64 = this.getString('fingerprint');
            this.__fingerprint = Base64.decode(base64);
        }
        return this.__fingerprint;
    };

    //-------- namespace --------
    ns.mkm.BaseMeta = BaseMeta;

})(MingKeMing);
