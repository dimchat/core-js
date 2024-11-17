;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
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

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var Dictionary = ns.type.Dictionary;

    var CryptographyKey = ns.crypto.CryptographyKey;
    var SymmetricKey    = ns.crypto.SymmetricKey;
    var AsymmetricKey   = ns.crypto.AsymmetricKey;
    var PrivateKey      = ns.crypto.PrivateKey;
    var PublicKey      = ns.crypto.PublicKey;

    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory;
    };

    var getKeyAlgorithm = function (key) {
        var gf = general_factory();
        return gf.getAlgorithm(key, '');
    };

    var matchSymmetricKeys = function (pKey, sKey) {
        var gf = general_factory();
        return gf.matchEncryptKey(pKey, sKey);
    };
    var matchAsymmetricKeys = function (sKey, pKey) {
        var gf = general_factory();
        return gf.matchSignKey(sKey, pKey);
    };

    var symmetricKeyEquals = function (a, b) {
        if (a === b) {
            // same object
            return true;
        }
        // compare by encryption
        return matchSymmetricKeys(a, b);
    };
    var privateKeyEquals = function (a, b) {
        if (a === b) {
            // same object
            return true;
        }
        // compare by signature
        return matchAsymmetricKeys(a, b.publicKey);
    };

    /**
     *  Base Crypto Key
     */
    var BaseKey = function (dict) {
        Dictionary.call(this, dict);
    };
    Class(BaseKey, Dictionary, [CryptographyKey], {

        // Override
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap());
        }
    });

    //
    //  Conveniences
    //

    BaseKey.getKeyAlgorithm = getKeyAlgorithm;
    BaseKey.matchEncryptKey = matchSymmetricKeys;
    BaseKey.matchSignKey = matchAsymmetricKeys;
    BaseKey.symmetricKeyEquals = symmetricKeyEquals;
    BaseKey.privateKeyEquals = privateKeyEquals;

    /**
     *  Symmetric Key
     */
    var BaseSymmetricKey = function (dict) {
        Dictionary.call(this, dict);
    };
    Class(BaseSymmetricKey, Dictionary, [SymmetricKey], {

        // Override
        equals: function (other) {
            return Interface.conforms(other, SymmetricKey)
                && symmetricKeyEquals(other, this);
        },

        // Override
        matchEncryptKey: function (pKey) {
            return matchSymmetricKeys(pKey, this);
        },

        // Override
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap());
        }
    });

    /**
     *  Asymmetric Key
     */
    var BaseAsymmetricKey = function (dict) {
        Dictionary.call(this, dict);
    };
    Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey], {

        // Override
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap());
        }
    });

    var BasePrivateKey = function (dict) {
        Dictionary.call(this, dict);
    };
    Class(BasePrivateKey, Dictionary, [PrivateKey], {

        // Override
        equals: function (other) {
            return Interface.conforms(other, PrivateKey)
                && privateKeyEquals(other, this);
        },

        // Override
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap());
        }
    });

    var BasePublicKey = function (dict) {
        Dictionary.call(this, dict);
    };
    Class(BasePublicKey, Dictionary, [PublicKey], {

        // Override
        matchSignKey: function (sKey) {
            return matchAsymmetricKeys(sKey, this);
        },

        // Override
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap());
        }
    });

    //-------- namespace --------
    ns.crypto.BaseKey = BaseKey;
    ns.crypto.BaseSymmetricKey = BaseSymmetricKey;
    ns.crypto.BaseAsymmetricKey = BaseAsymmetricKey;
    ns.crypto.BasePrivateKey = BasePrivateKey;
    ns.crypto.BasePublicKey = BasePublicKey;

})(DIMP);
