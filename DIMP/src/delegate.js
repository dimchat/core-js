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

    // noinspection JSUnusedLocalSymbols
    /**
     *  Create entity ID with String
     *
     * @param {String} string
     * @returns {ID}
     */
    EntityDelegate.prototype.getIdentifier = function (string) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Create user with ID
     *
     * @param {ID} identifier - user ID
     * @returns {User}
     */
    EntityDelegate.prototype.getUser = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Create group with ID
     *
     * @param {ID} identifier - group ID
     * @returns {Group}
     */
    EntityDelegate.prototype.getGroup = function (identifier) {
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

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get cipher key for encrypt message from 'sender' to 'receiver'
     *
     * @param {ID} sender
     * @param {ID} receiver
     * @returns {SymmetricKey}
     */
    CipherKeyDelegate.prototype.getCipherKey = function (sender, receiver) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Cache cipher key for reusing, with the direction (from 'sender' to 'receiver')
     *
     * @param {ID} sender
     * @param {ID} receiver
     * @param {SymmetricKey} key
     */
    CipherKeyDelegate.prototype.cacheCipherKey = function (sender, receiver, key) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.CipherKeyDelegate = CipherKeyDelegate;

    ns.register('CipherKeyDelegate');

}(DIMP);
