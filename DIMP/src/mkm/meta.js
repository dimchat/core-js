'use strict';
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
 *          type       : 1,              // algorithm version
 *          key        : "{public key}", // PK = secp256k1(SK);
 *          seed       : "moKy",         // user/group name
 *          fingerprint: "..."           // CT = sign(seed, SK);
 *      }
 *
 *      algorithm:
 *          fingerprint = sign(seed, SK);
 *
 *  abstract method:
 *      - Address generateAddress(int? network);
 */

//! require <crypto.js>
//! require <mkm.js>

    /**
     *  Create Meta
     *
     *  Usages:
     *      1. new BaseMeta(map);
     *      2. new BaseMeta(type, key);
     *      3. new BaseMeta(type, key, seed, fingerprint);
     */
    mkm.mkm.BaseMeta = function () {
        var type, key, seed, fingerprint;
        var status;  // 1 for valid, -1 for invalid
        var meta;
        if (arguments.length === 1) {
            // new BaseMeta(map);
            meta = arguments[0];
            // lazy load
            type        = null;
            key         = null;
            seed        = null;
            fingerprint = null;
            status      = 0;
        } else if (arguments.length === 2) {
            // new BaseMeta(type, key);
            type        = arguments[0];
            key         = arguments[1];
            seed        = null;
            fingerprint = null;
            status      = 1;
            meta = {
                'type': type,
                'key': key.toMap()
            };
        } else if (arguments.length === 4) {
            // new BaseMeta(type, key, seed, fingerprint);
            type        = arguments[0];
            key         = arguments[1];
            seed        = arguments[2];
            fingerprint = arguments[3];
            status      = 1;
            meta = {
                'type': type,
                'key': key.toMap(),
                'seed': seed,
                'fingerprint': fingerprint.toObject()
            };
        } else {
            throw new SyntaxError('meta arguments error: ' + arguments);
        }
        Dictionary.call(this, meta);
        this.__type        = type;
        this.__key         = key;
        this.__seed        = seed;
        this.__fingerprint = fingerprint;
        this.__status      = status;
    };
    var BaseMeta = mkm.mkm.BaseMeta;

    Class(BaseMeta, Dictionary, [Meta], {

        // Override
        getType: function () {
            var type = this.__type;
            if (type === null) {
                var helper = SharedAccountExtensions.getHelper();
                type = helper.getMetaType(this.toMap(), '');
                // type = this.getInt('type', 0);
                this.__type = type;
            }
            return type;
        },

        // Override
        getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                var info = this.getValue('key');
                key = PublicKey.parse(info);
                this.__key = key;
            }
            return key;
        },

        // protected
        hasSeed: function () {
            //var algorithm = this.getType();
            //return algorithm === 'mkm' || algorithm === '1';
            return this.__seed || this.getValue('seed');
        },

        // Override
        getSeed: function () {
            var seed = this.__seed;
            if (seed === null && this.hasSeed()) {
                seed = this.getString('seed', null);
                this.__seed = seed;
            }
            return seed;
        },

        // Override
        getFingerprint: function () {
            var ted = this.__fingerprint;
            if (!ted && this.hasSeed()) {
                var base64 = this.getValue('fingerprint');
                ted = TransportableData.parse(base64);
                this.__fingerprint = ted;
            }
            return !ted ? null : ted.getData();
        },

        //
        //  Validation
        //

        // Override
        isValid: function () {
            if (this.__status === 0) {
                // meta from network, try to verify
                if (this.checkValid()) {
                    // correct
                    this.__status = 1;
                } else {
                    // error
                    this.__status = -1;
                }
            }
            return this.__status > 0;
        },

        // private
        checkValid: function () {
            var key = this.getPublicKey();
            if (this.hasSeed()) {
                // check 'seed' & 'fingerprint'
            } else if (this.getValue('seed') || this.getValue('fingerprint')) {
                // this meta has no seed, so
                // it should not contains 'seed' or 'fingerprint'
                return false;
            } else {
                // this meta has no seed, so it's always valid
                // when the public key exists
                return true;
            }
            var name = this.getSeed();
            var signature = this.getFingerprint();
            // check meta seed & signature
            if (!signature || !name) {
                // throw new Error('mea error: ' + this.toMap());
                return false;
            }
            // verify fingerprint
            var data = UTF8.encode(name);
            return key.verify(data, signature);
        }

    });
