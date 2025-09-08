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

//! require 'document.js'

    /**
     *  Create base document for user
     *
     *  1. Create visa with info
     *      new BaseVisa(map);
     *  2. Create a new empty visa with ID
     *      new BaseVisa(identifier);
     *  3. Create visa with data & signature loaded from local storage
     *      new BaseVisa(identifier, data, signature);
     */
    mkm.mkm.BaseVisa = function () {
        if (arguments.length === 3) {
            // new BaseVisa(identifier, data, signature);
            BaseDocument.call(this, DocumentType.VISA, arguments[0], arguments[1], arguments[2]);
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseVisa(identifier);
            BaseDocument.call(this, DocumentType.VISA, arguments[0]);
        } else if (arguments.length === 1) {
            // new BaseVisa(map);
            BaseDocument.call(this, arguments[0]);
        } else {
            throw new SyntaxError('visa params error: ' + arguments);
        }
        /// Public Key for encryption
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~
        /// For safety considerations, the visa.key which used to encrypt message data
        /// should be different with meta.key
        this.__key = null;     // EncryptKey
        /// Avatar URL
        this.__avatar = null;  // PortableNetworkFile
    };
    var BaseVisa = mkm.mkm.BaseVisa;

    Class(BaseVisa, BaseDocument, [Visa]);

    Implementation(BaseVisa, {

        // Override
        getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                var info = this.getProperty('key');
                key = PublicKey.parse(info);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key;
                } else {
                    key = null;
                }
            }
            return key;
        },

        // Override
        setPublicKey: function (pKey) {
            if (!pKey) {
                this.setProperty('key', null);
            } else {
                this.setProperty('key', pKey.toMap());
            }
            this.__key = pKey;
        },

        //-------- extra info --------

        // Override
        getAvatar: function () {
            var pnf = this.__avatar;
            if (!pnf) {
                var url = this.getProperty('avatar');
                if (typeof url === 'string' && url.length === 0) {
                    // ignore empty URL
                } else {
                    pnf = PortableNetworkFile.parse(url);
                    this.__avatar = pnf;
                }
            }
            return pnf;
        },

        // Override
        setAvatar: function (pnf) {
            if (!pnf) {
                this.setProperty('avatar', null);
            } else {
                this.setProperty('avatar', pnf.toObject());
            }
            this.__avatar = pnf;
        }
    });


    /**
     *  Create base document for group
     *
     *  1. Create group profile with info
     *      new BaseBulletin(map);
     *  2. Create a new empty group profile with ID
     *      new BaseBulletin(identifier);
     *  3. Create group profile with data & signature loaded from local storage
     *      new BaseBulletin(identifier, data, signature);
     */
    mkm.mkm.BaseBulletin = function () {
        if (arguments.length === 3) {
            // new BaseBulletin(identifier, data, signature);
            BaseDocument.call(this, DocumentType.BULLETIN, arguments[0], arguments[1], arguments[2]);
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseBulletin(identifier);
            BaseDocument.call(this, DocumentType.BULLETIN, arguments[0]);
        } else if (arguments.length === 1) {
            // new BaseBulletin(map);
            BaseDocument.call(this, arguments[0]);
        } else {
            throw new SyntaxError('bulletin params error: ' + arguments);
        }
        this.__assistants = null;  // List<ID>
    };
    var BaseBulletin = mkm.mkm.BaseBulletin;

    Class(BaseBulletin, BaseDocument, [Bulletin]);

    Implementation(BaseBulletin, {

        // Override
        getFounder: function () {
            return ID.parse(this.getProperty('founder'));
        },

        // Override
        getAssistants: function () {
            var bots = this.__assistants;
            if (!bots) {
                var assistants = this.getProperty('assistants');
                if (assistants) {
                    bots = ID.convert(assistants);
                } else {
                    // get from 'assistant'
                    var single = ID.parse(this.getProperty('assistant'));
                    bots = !single ? [] : [single];
                }
                this.__assistants = bots;
            }
            return bots;
        },

        // Override
        setAssistants: function (bots) {
            if (bots) {
                this.setProperty('assistants', ID.revert(bots));
            } else {
                this.setProperty('assistants', null);
            }
            this.setProperty('assistant', null);
            this.__assistants = bots;
        }
    });
