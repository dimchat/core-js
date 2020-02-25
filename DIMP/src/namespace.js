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
//! require <dkd.js>
//! require <mkm.js>

!function (ns) {
    'use strict';

    // exports namespace from DaoKeDao
    DaoKeDao.exports(ns);
    // exports namespace from MingKeMing
    MingKeMing.exports(ns);

    //-------- namespace --------
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {};
    }
    if (typeof ns.plugins !== 'object') {
        ns.plugins = {};
    }
    if (typeof ns.core !== 'object') {
        ns.core = {};
    }

    DIMP.Namespace(ns.protocol);
    DIMP.Namespace(ns.plugins);
    DIMP.Namespace(ns.core);

    ns.register('protocol');
    ns.register('plugins');
    ns.register('core');

}(DIMP);
