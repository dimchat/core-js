;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
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

//! require 'namespace.js'

!function (ns) {
    'use strict';

    var EntityDelegate = function () {
    };
    ns.Interface(EntityDelegate, null);

    /**
     *  Create entity ID with String
     *
     * @param string {String}
     * @returns {ID}
     */
    EntityDelegate.prototype.getIdentifier = function (string) {
        console.assert(string !== null, 'ID string empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Create user with ID
     *
     * @param identifier {ID}
     * @returns {User}
     */
    EntityDelegate.prototype.getUser = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Create group with ID
     *
     * @param identifier {ID}
     * @returns {Group}
     */
    EntityDelegate.prototype.getGroup = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.EntityDelegate = EntityDelegate;

    ns.register('EntityDelegate');

}(DIMP);

!function (ns) {
    'use strict';

    var CipherKeyDelegate = function () {
    };
    ns.Interface(CipherKeyDelegate, null);

    /**
     *  Get cipher key for encrypt message from 'sender' to 'receiver'
     *
     * @param sender {ID}
     * @param receiver {ID}
     * @returns {SymmetricKey}
     */
    CipherKeyDelegate.prototype.getCipherKey = function (sender, receiver) {
        console.assert(sender !== null, 'sender empty');
        console.assert(receiver !== null, 'receiver empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Cache cipher key for reusing, with the direction (from 'sender' to 'receiver')
     *
     * @param sender {ID}
     * @param receiver {ID}
     * @param key {SymmetricKey}
     */
    CipherKeyDelegate.prototype.cacheCipherKey = function (sender, receiver, key) {
        console.assert(sender !== null, 'sender empty');
        console.assert(receiver !== null, 'receiver empty');
        console.assert(key !== null, 'key empty');
        console.assert(false, 'implement me!');
    };

    /**
     *  Get/cache cipher key for decrypt message from 'sender' to 'receiver'
     *
     * @param sender {ID}
     * @param receiver {ID}
     * @param key {SymmetricKey}
     * @returns {SymmetricKey}
     */
    CipherKeyDelegate.prototype.reuseCipherKey = function (sender, receiver, key) {
        console.assert(sender !== null, 'sender empty');
        console.assert(receiver !== null, 'receiver empty');
        console.assert(key !== null, 'key empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.CipherKeyDelegate = CipherKeyDelegate;

    ns.register('CipherKeyDelegate');

}(DIMP);
