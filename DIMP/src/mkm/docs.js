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

//! require 'document.js'

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey  = ns.crypto.PublicKey;
    var PortableNetworkFile = ns.format.PortableNetworkFile;

    var ID       = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa     = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;

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
    var BaseVisa = function () {
        if (arguments.length === 3) {
            // new BaseVisa(identifier, data, signature);
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseVisa(identifier);
            BaseDocument.call(this, arguments[0], Document.VISA);
        } else if (arguments.length === 1) {
            // new BaseVisa(map);
            BaseDocument.call(this, arguments[0]);
        }
        /// Public Key for encryption
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~
        /// For safety considerations, the visa.key which used to encrypt message data
        /// should be different with meta.key
        this.__key = null;     // EncryptKey
        /// Avatar URL
        this.__avatar = null;  // PortableNetworkFile
    };
    Class(BaseVisa, BaseDocument, [Visa], {

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
                pnf = PortableNetworkFile.parse(url);
                this.__avatar = pnf;
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

    //-------- namespace --------
    ns.mkm.BaseVisa = BaseVisa;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;

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
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            // new BaseBulletin(identifier, data, signature);
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else if (Interface.conforms(arguments[0], ID)) {
            // new BaseBulletin(identifier);
            BaseDocument.call(this, arguments[0], Document.BULLETIN);
        } else if (arguments.length === 1) {
            // new BaseBulletin(map);
            BaseDocument.call(this, arguments[0]);
        }
        this.__assistants = null;  // List<ID>
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {

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

    //-------- namespace --------
    ns.mkm.BaseBulletin = BaseBulletin;

})(DIMP);
