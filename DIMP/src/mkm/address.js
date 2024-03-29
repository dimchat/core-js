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

    var AddressFactory = function () {
        Object.call(this);
        this.__addresses = {};  // string -> Address
    };
    Class(AddressFactory, Object, [Address.Factory], null);

    /**
     * Call it when received 'UIApplicationDidReceiveMemoryWarningNotification',
     * this will remove 50% of cached objects
     *
     * @return number of survivors
     */
    AddressFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__addresses, finger);
        return finger >> 1;
    };

    // Override
    AddressFactory.prototype.generateAddress = function (meta, network) {
        var address = meta.generateAddress(network);
        if (address) {
            this.__addresses[address.toString()] = address;
        }
        return address;
    };

    // Override
    AddressFactory.prototype.parseAddress = function (string) {
        var address = this.__addresses[string];
        if (!address) {
            address = Address.create(string);
            if (address) {
                this.__addresses[string] = address;
            }
        }
        return address;
    };

    /**
     *  Remove 1/2 objects from the dictionary
     *  (Thanos can kill half lives of a world with a snap of the finger)
     *
     * @param {{}} planet
     * @param {Number} finger
     * @returns {Number} number of survivors
     */
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            //if (typeof p === 'function') {
            //    // ignore
            //    continue;
            //}
            finger += 1;
            if ((finger & 1) === 1) {
                // kill it
                delete planet[k];
            } // else, let it go
        }
        return finger;
    };

    //-------- namespace --------
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.thanos = thanos;

})(MingKeMing);
