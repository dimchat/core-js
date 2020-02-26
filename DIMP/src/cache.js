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

    var SymmetricKey = ns.crypto.SymmetricKey;

    var PlainKey = function (key) {
        SymmetricKey.call(this, key)
    };
    ns.Class(PlainKey, SymmetricKey, null);

    PlainKey.prototype.encrypt = function (data) {
        return data;
    };

    PlainKey.prototype.decrypt = function (data) {
        return data;
    };

    //-------- runtime --------
    var plain_key = null;

    PlainKey.getInstance = function () {
        if (!plain_key) {
            var key = {
                'algorithm': PlainKey.PLAIN
            };
            plain_key = new PlainKey(key);
        }
        return plain_key;
    };

    PlainKey.PLAIN = 'PLAIN';

    //-------- register --------
    SymmetricKey.register(PlainKey.PLAIN, PlainKey);

    //-------- namespace --------
    ns.plugins.PlainKey = PlainKey;

    // ns.plugins.register('PlainKey');

}(DIMP);

!function (ns) {
    'use strict';

    var CipherKeyDelegate = ns.CipherKeyDelegate;

    /**
     *  Symmetric Keys Cache
     *  ~~~~~~~~~~~~~~~~~~~~
     *  Manage keys for conversations
     */
    var KeyCache = function () {
        // memory cache
        this.keyMap = {};
        this.isDirty = false;
    };
    ns.Class(KeyCache, ns.type.Object, CipherKeyDelegate);

    /**
     *  Trigger for loading cipher key table
     *
     * @returns {boolean}
     */
    KeyCache.prototype.reload = function () {
        var map = this.loadKeys();
        if (!map) {
            return false;
        }
        return this.updateKeys(map);
    };

    /**
     *  Trigger for saving cipher key table
     */
    KeyCache.prototype.flush = function () {
        if (this.isDirty) {
            if (this.saveKeys(this.keyMap)) {
                // keys saved
                this.isDirty = false;
            }
        }
    };

    /**
     *  Callback for saving cipher key table into local storage
     *  (Override it to access database)
     *
     * @param map {{}} - all cipher keys(with direction) from memory cache
     * @returns {boolean}
     */
    KeyCache.prototype.saveKeys = function (map) {
        console.assert(map !== null, 'map empty');
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Load cipher key table from local storage
     *  (Override it to access database)
     *
     * @returns {{}}
     */
    KeyCache.prototype.loadKeys = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Update cipher key table into memory cache
     *
     * @param map {{}} - cipher keys(with direction) from local storage
     * @returns {boolean}
     */
    KeyCache.prototype.updateKeys = function (map) {
        if (!map) {
            return false;
        }
        var changed = false;
        var sender, receiver;
        var oldKey, newKey;
        var table;
        for (sender in map) {
            if (!map.hasOwnProperty(sender)) continue;
            table = map[sender];
            for (receiver in table) {
                if (!table.hasOwnProperty(receiver)) continue;
                newKey = table[receiver];
                // check whether exists an old key
                oldKey = get_key.call(this, sender, receiver);
                if (oldKey !== newKey) {
                    changed = true;
                }
                // cache key with direction
                set_key.call(this, sender, receiver, newKey);
            }
        }
        return changed;
    };

    var get_key = function (sender, receiver) {
        var table = this.keyMap[sender];
        if (table) {
            return table[receiver];
        } else {
            return null;
        }
    };

    var set_key = function (sender, receiver, key) {
        var table = this.keyMap[sender];
        if (!table) {
            table = {};
            this.keyMap[sender] = table;
        }
        table[receiver] = key;
    };

    //-------- CipherKeyDelegate --------

    // @override
    KeyCache.prototype.getCipherKey = function (sender, receiver) {
        if (receiver.isBroadcast()) {
            return ns.plugins.PlainKey.getInstance();
        }
        // get key from cache
        return get_key.call(this, sender, receiver);
    };

    // @override
    KeyCache.prototype.cacheCipherKey = function (sender, receiver, key) {
        if (receiver.isBroadcast()) {
            // broadcast message has no key
        } else {
            set_key.call(this, sender, receiver, key);
            this.isDirty = true;
        }
    };

    // @override
    KeyCache.prototype.reuseCipherKey = function (sender, receiver, key) {
        if (key) {
            // cache the key for reuse
            this.cacheCipherKey(sender, receiver, key);
            return key;
        } else {
            // reuse key from cache
            return this.getCipherKey(sender, receiver);
        }
    };

    //-------- namespace --------
    ns.core.KeyCache = KeyCache;

    ns.core.register('KeyCache');

}(DIMP);
