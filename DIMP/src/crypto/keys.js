'use strict';
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

    /**
     *  Base Crypto Key
     *  ~~~~~~~~~~~~~~~
     */
    mk.crypto.BaseKey = function (dict) {
        Dictionary.call(this, dict);
    };
    var BaseKey = mk.crypto.BaseKey;

    Class(BaseKey, Dictionary, [CryptographyKey], {

        // Override
        getAlgorithm: function () {
            return BaseKey.getKeyAlgorithm(this.toMap());
        }
    });

    //
    //  Conveniences
    //

    BaseKey.getKeyAlgorithm = function (key) {
        var helper = SharedCryptoExtensions.getHelper();
        var algorithm = helper.getKeyAlgorithm(key);
        return algorithm ? algorithm : '';
    };

    BaseKey.matchEncryptKey = function (pKey, sKey) {
        return GeneralCryptoHelper.matchSymmetricKeys(pKey, sKey);
    };

    BaseKey.matchSignKey = function (sKey, pKey) {
        return GeneralCryptoHelper.matchAsymmetricKeys(sKey, pKey);
    };

    BaseKey.symmetricKeyEquals = function (key1, key2) {
        if (key1 === key2) {
            // same object
            return true;
        }
        // compare by encryption
        return BaseKey.matchEncryptKey(key1, key2);
    };

    BaseKey.privateKeyEquals = function (key1, key2) {
        if (key1 === key2) {
            // same object
            return true;
        }
        // compare by signature
        return BaseKey.matchSignKey(key1, key2);
    };


    /**
     *  Base Symmetric Key
     *  ~~~~~~~~~~~~~~~~~~
     */
    mk.crypto.BaseSymmetricKey = function (dict) {
        Dictionary.call(this, dict);
    };
    var BaseSymmetricKey = mk.crypto.BaseSymmetricKey;

    Class(BaseSymmetricKey, Dictionary, [SymmetricKey], {

        // Override
        equals: function (other) {
            return Interface.conforms(other, SymmetricKey)
                && BaseKey.symmetricKeyEquals(other, this);
        },

        // Override
        matchEncryptKey: function (pKey) {
            return BaseKey.matchEncryptKey(pKey, this);
        },

        // Override
        getAlgorithm: function () {
            return BaseKey.getKeyAlgorithm(this.toMap());
        }
    });


    /**
     *  Base Asymmetric Key
     *  ~~~~~~~~~~~~~~~~~~~
     */
    mk.crypto.BaseAsymmetricKey = function (dict) {
        Dictionary.call(this, dict);
    };
    var BaseAsymmetricKey = mk.crypto.BaseAsymmetricKey;

    Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey], {

        // Override
        getAlgorithm: function () {
            return BaseKey.getKeyAlgorithm(this.toMap());
        }
    });

    /**
     *  Base Private Key
     *  ~~~~~~~~~~~~~~~~
     */
    mk.crypto.BasePrivateKey = function (dict) {
        Dictionary.call(this, dict);
    };
    var BasePrivateKey = mk.crypto.BasePrivateKey;

    Class(BasePrivateKey, Dictionary, [PrivateKey], {

        // Override
        equals: function (other) {
            return Interface.conforms(other, PrivateKey)
                && BaseKey.privateKeyEquals(other, this);
        },

        // Override
        getAlgorithm: function () {
            return BaseKey.getKeyAlgorithm(this.toMap());
        }
    });

    /**
     *  Base Public Key
     *  ~~~~~~~~~~~~~~~
     */
    mk.crypto.BasePublicKey = function (dict) {
        Dictionary.call(this, dict);
    };
    var BasePublicKey = mk.crypto.BasePublicKey;

    Class(BasePublicKey, Dictionary, [PublicKey], {

        // Override
        matchSignKey: function (sKey) {
            return BaseKey.matchSignKey(sKey, this);
        },

        // Override
        getAlgorithm: function () {
            return BaseKey.getKeyAlgorithm(this.toMap());
        }
    });
