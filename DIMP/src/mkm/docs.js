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

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;

    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;

    /**
     *  Create base visa document
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
        this.__key = null;
    };
    Class(BaseVisa, BaseDocument, [Visa], {

        // Override
        getKey: function () {
            if (this.__key === null) {
                var key = this.getProperty('key');
                key = PublicKey.parse(key);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key;
                }
            }
            return this.__key;
        },

        // Override
        setKey: function (publicKey) {
            this.setProperty('key', publicKey.toMap());
            this.__key = publicKey;
        },

        //-------- extra info --------

        // Override
        getAvatar: function () {
            return this.getProperty('avatar');
        },

        // Override
        setAvatar: function (url) {
            this.setProperty('avatar', url);
        }
    });

    //-------- namespace --------
    ns.mkm.BaseVisa = BaseVisa;

})(MingKeMing);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;

    /**
     *  Create base group profile
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
        this.__assistants = null;
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {

        // Override
        getAssistants: function () {
            if (this.__assistants === null) {
                var assistants = this.getProperty('assistants');
                if (assistants) {
                    this.__assistants = ID.convert(assistants);
                }
            }
            return this.__assistants;
        },

        // Override
        setAssistants: function (assistants) {
            if (assistants) {
                this.setProperty('assistants', ID.revert(assistants));
            } else {
                this.setProperty('assistants', null);
            }
        }
    });

    //-------- namespace --------
    ns.mkm.BaseBulletin = BaseBulletin;

})(MingKeMing);
