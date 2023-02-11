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

//! require <crypto.js>
//! require <mkm.js>

(function (ns) {
    'use strict';

    var Class      = ns.type.Class;
    var Dictionary = ns.type.Dictionary;

    var UTF8   = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON   = ns.format.JSON;

    var ID       = ns.protocol.ID;
    var Document = ns.protocol.Document;

    /**
     *  Create base document
     *
     *  1. Create document with info
     *      new BaseDocument(map);
     *  2. Create a new empty document with ID & type
     *      new BaseDocument(identifier, type);
     *  3. Create document with data & signature loaded from local storage
     *      new BaseDocument(identifier, data, signature);
     */
    var BaseDocument = function () {
        var map, status;
        var identifier, data;
        var properties;
        if (arguments.length === 1) {
            // new BaseDocument(map);
            map = arguments[0];
            status = 0;
            // lazy
            identifier = null;
            data = null;
            properties = null;
        } else if (arguments.length === 2) {
            // new BaseDocument(identifier, type);
            identifier = arguments[0];  // ID
            var type = arguments[1];    // string
            map = {
                'ID': identifier.toString()
            };
            status = 0;
            data = null;
            if (type && type.length > 1) {
                properties = {
                    'type': type
                };
            } else {
                properties = null;
            }
        } else if (arguments.length === 3) {
            // new BaseDocument(identifier, data, signature);
            identifier = arguments[0];     // ID
            data = arguments[1];           // string: JSON
            var signature = arguments[2];  // string: base64
            map = {
                'ID': identifier.toString(),
                'data': data,
                'signature': signature
            }
            status = 1;  // all documents must be verified before saving into local storage
            properties = null;
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;      // JsON.encode(properties)
        this.__sig = null;       // LocalUser(identifier).sign(data)
        this.__properties = properties;
        this.__status = status;  // 1 for valid, -1 for invalid
    };
    Class(BaseDocument, Dictionary, [Document], {

        // Override
        isValid: function () {
            return this.__status > 0;
        },

        // Override
        getType: function () {
            var type = this.getProperty('type');
            if (!type) {
                type = this.getString('type');
            }
            return type;
        },

        // Override
        getIdentifier: function () {
            if (this.__identifier === null) {
                this.__identifier = ID.parse(this.getValue('ID'));
            }
            return this.__identifier;
        },

        // private
        getData: function () {
            if (this.__json === null) {
                this.__json = this.getString('data');
            }
            return this.__json;
        },

        // private
        getSignature: function () {
            if (this.__sig === null) {
                var base64 = this.getString('signature');
                if (base64) {
                    this.__sig = Base64.decode(base64);
                }
            }
            return this.__sig;
        },

        //-------- properties --------

        // Override
        allProperties: function () {
            if (this.__status < 0) {
                // invalid
                return null;
            }
            if (this.__properties === null) {
                var data = this.getData();  // json string
                if (data) {
                    this.__properties = JsON.decode(data);
                } else {
                    this.__properties = {};
                }
            }
            return this.__properties;
        },

        // Override
        getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null;
            }
            return dict[name];
        },

        // Override
        setProperty: function (name, value) {
            // 1. reset status
            this.__status = 0;
            // 2. update property value with name
            var dict = this.allProperties();
            if (value) {
                dict[name] = value;
            } else {
                delete dict[name];
            }
            // 3. clear data signature after properties changed
            this.removeValue('data');
            this.removeValue('signature');
            this.__json = null;
            this.__sig = null;
        },

        //-------- signature --------

        // Override
        verify: function (publicKey) {
            if (this.__status > 0) {
                // already verify OK
                return true;
            }
            var data = this.getData();
            var signature = this.getSignature();
            if (!data) {
                // NOTICE: if data is empty, signature should be empty at the same time
                //         this happen while document not found
                if (!signature) {
                    this.__status = 0;
                } else {
                    // data signature error
                    this.__status = -1;
                }
            } else if (!signature) {
                // signature error
                this.__status = -1;
            } else if (publicKey.verify(UTF8.encode(data), signature)) {
                // signature matched
                this.__status = 1;
            }
            // NOTICE: if status is 0, it doesn't mean the entity document is invalid,
            //         try another key
            return this.__status === 1;
        },

        // Override
        sign: function (privateKey) {
            if (this.__status > 0) {
                // already signed/verified
                return this.getSignature();
            }
            // 1. update sign time
            var now = new Date();
            this.setProperty('time', now.getTime() / 1000.0);
            // 2. encode & sign
            var data = JsON.encode(this.allProperties());
            if (!data || data.length === 0) {
                // properties error
                return null;
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                // signature error
                return null;
            }
            // 3. update 'data' & 'signature' fields
            this.setValue('data', data);
            this.setValue('signature', Base64.encode(signature));
            this.__json = data;
            this.__sig = signature;
            // 4. update status
            this.__status = 1;
            return this.__sig;
        },

        //-------- extra info --------

        // Override
        getTime: function () {
            var timestamp = this.getProperty('time');
            if (timestamp) {
                return new Date(timestamp * 1000);
            } else {
                return null;
            }
        },

        // Override
        getName: function () {
            return this.getProperty('name');
        },

        // Override
        setName: function (name) {
            this.setProperty('name', name);
        }
    });

    //-------- namespace --------
    ns.mkm.BaseDocument = BaseDocument;

})(MingKeMing);
