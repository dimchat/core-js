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

//! require <crypto.js>
//! require <mkm.js>
//! require <dkd.js>

if (typeof DIMP !== "object") {
    DIMP = new MingKeMing.Namespace();
}

(function (ns, base) {
    'use strict';

    // exports namespace from DaoKeDao
    base.exports(ns);

    if (typeof ns.assert !== 'function') {
        ns.assert = console.assert;
    }

    //-------- namespace --------
    if (typeof ns.core !== 'object') {
        ns.core = new ns.Namespace();
    }
    if (typeof ns.dkd !== 'object') {
        ns.dkd = new ns.Namespace();
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = new ns.Namespace();
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.protocol.group !== 'object') {
        ns.protocol.group = new ns.Namespace();
    }

    ns.registers('core');
    ns.registers('dkd');
    ns.registers('mkm');
    ns.registers('protocol');
    ns.protocol.registers('group');

})(DIMP, DaoKeDao);
