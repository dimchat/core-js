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
    DIMP = {}
}

(function (ns, base) {
    'use strict';

    // exports namespace from DaoKeDao
    base.exports(ns);

    //-------- namespace --------
    if (typeof ns.core !== 'object') {
        ns.core = {};
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {};
    }
    if (typeof ns.protocol.group !== 'object') {
        ns.protocol.group = {};
    }

    ns.Namespace(ns.core);
    ns.Namespace(ns.protocol);
    ns.Namespace(ns.protocol.group);

    ns.register('core');
    ns.register('protocol');
    ns.protocol.register('group');

})(DIMP, DaoKeDao);
