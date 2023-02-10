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
    DIMP = {};
}

(function (ns) {
    'use strict';

    //-------- namespace --------
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto;
    }

    if (typeof ns.protocol !== 'object') {
        ns.protocol = MingKeMing.protocol;
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = MingKeMing.mkm;
    }
    if (typeof ns.dkd !== 'object') {
        ns.dkd = DaoKeDao.dkd;
    }

    if (typeof ns.dkd.cmd !== 'object') {
        ns.dkd.cmd = {};
    }

})(DIMP);
