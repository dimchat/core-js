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

    var Class = ns.type.Class;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;

    var IDFactory = function () {
        Object.call(this);
        this.__identifiers = {};  // string -> ID
    };
    Class(IDFactory, Object, [ID.Factory], null);

    /**
     * Call it when received 'UIApplicationDidReceiveMemoryWarningNotification',
     * this will remove 50% of cached objects
     *
     * @return number of survivors
     */
    IDFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__identifiers, finger);
        return finger >> 1;
    };

    // Override
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        var address = Address.generate(meta, network);
        return ID.create(meta.getSeed(), address, terminal);
    };

    // Override
    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = this.newID(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    }

    // Override
    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = this.parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };

    // protected
    IDFactory.prototype.newID = function (string, name, address, terminal) {
        // override for customized ID
        return new Identifier(string, name, address, terminal);
    };

    // protected
    /**
     *  Parse ID from string
     *
     * @param {String} string
     * @return {Identifier}
     */
    IDFactory.prototype.parse = function (string) {
        var name, address, terminal;
        // split ID string for terminal
        var pair = string.split('/');
        if (pair.length === 1) {
            // no terminal
            terminal = null;
        } else {
            // got terminal
            terminal = pair[1];
        }
        // name @ address
        pair = pair[0].split('@');
        if (pair.length === 1) {
            // got address without name
            name = null;
            address = Address.parse(pair[0]);
        } else {
            name = pair[0];
            address = Address.parse(pair[1]);
        }
        if (!address) {
            return null;
        }
        return this.newID(string, name, address, terminal);
    };

    /**
     *  Concat ID with components
     *
     * @param {String} name
     * @param {Address} address
     * @param {String} terminal
     * @return {String}
     */
    var concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + '@' + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + '/' + terminal;
        }
        return string;
    };

    //-------- namespace --------
    ns.mkm.IDFactory = IDFactory;

})(MingKeMing);
