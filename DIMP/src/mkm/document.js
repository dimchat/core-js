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

//! require <crypto.js>
//! require <mkm.js>

    /**
     *  Create base document
     *
     *  1. Create document with info
     *      new BaseDocument(map);
     *  2. Create a new empty document with ID & type
     *      new BaseDocument(type, identifier);
     *  3. Create document with data & signature loaded from local storage
     *      new BaseDocument(type, identifier, data, signature);
     */
    mkm.mkm.BaseDocument = function () {
        var map, status;
        var type;
        var identifier, data, signature;
        var properties;
        if (arguments.length === 1) {
            // new BaseDocument(map);
            map = arguments[0];
            status = 0;
            // lazy
            identifier = null;
            data = null;
            signature = null;
            properties = null;
        } else if (arguments.length === 2) {
            // new BaseDocument(identifier, type);
            type       = arguments[0];  // string
            identifier = arguments[1];  // ID
            map = {
                'type': type,
                'did': identifier.toString()
            };
            status = 0;
            data = null;
            signature = null;
            var now = new Date();
            properties = {
                'type': type,  // deprecated
                'created_time': (now.getTime() / 1000.0)
            };
        } else if (arguments.length === 4) {
            // new BaseDocument(identifier, data, signature);
            type       = arguments[0];  // string
            identifier = arguments[1];  // ID
            data       = arguments[2];  // string: JSON
            signature  = arguments[3];  // TransportableData
            map = {
                'type': type,
                'did': identifier.toString(),
                'data': data,
                'signature': signature.toObject()
            };
            status = 1;  // all documents must be verified before saving into local storage
            properties = null;
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;      // JSONMap.encode(properties)
        this.__sig = signature;  // LocalUser(identifier).sign(data)
        this.__properties = properties;
        this.__status = status;  // 1 for valid, -1 for invalid
    };
    var BaseDocument = mkm.mkm.BaseDocument;

    Class(BaseDocument, Dictionary, [Document], {

        // Override
        isValid: function () {
            return this.__status > 0;
        },

        // Override
        getIdentifier: function () {
            var did = this.__identifier;
            if (!did) {
                did = ID.parse(this.getValue('did'));
                this.__identifier = did;
            }
            return did;
        },

        // private
        getData: function () {
            var base64 = this.__json;
            if (!base64) {
                base64 = this.getString('data', null);
                this.__json = base64;
            }
            // return json string
            return base64;
        },

        // private
        getSignature: function () {
            var ted = this.__sig;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__sig = ted;
            }
            // return binary data
            if (!ted) {
                return null;
            }
            return ted.getData();
        },

        //-------- properties --------

        // Override
        allProperties: function () {
            if (this.__status < 0) {
                // invalid
                return null;
            }
            var dict = this.__properties;
            if (!dict) {
                var json = this.getData();
                if (json) {
                    dict = JSONMap.decode(json);
                } else {
                    // create new properties
                    dict = {};
                }
                this.__properties = dict;
            }
            return dict;
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
            if (!dict) {
                // throw new Error('failed to get properties: ' + this.toMap());
            } else if (value) {
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
            var dict = this.allProperties();
            if (!dict) {
                // document error
                return null;
            }
            var data = JSONMap.encode(dict);
            if (!data || data.length === 0) {
                // properties error
                return null;
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                // signature error
                return null;
            }
            var ted = TransportableData.create(signature);
            // 3. update 'data' & 'signature' fields
            this.setValue('data', data);                 // JSON string
            this.setValue('signature', ted.toObject());  // BASE-64
            this.__json = data;
            this.__sig = ted;
            // 4. update status
            this.__status = 1;
            return signature;
        },

        //-------- extra info --------

        // Override
        getTime: function () {
            var timestamp = this.getProperty('time');
            return Converter.getDateTime(timestamp, null);
        },

        // Override
        getName: function () {
            var name = this.getProperty('name');
            return Converter.getString(name, null);
        },

        // Override
        setName: function (name) {
            this.setProperty('name', name);
        }
    });
