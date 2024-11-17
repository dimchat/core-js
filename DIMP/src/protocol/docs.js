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

//! require <mkm.js>

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Document  = ns.protocol.Document;

    /**
     *  User Document
     *  ~~~~~~~~~~~~~
     *  This interface is defined for authorizing other apps to login,
     *  which can generate a temporary asymmetric key pair for messaging.
     */
    var Visa = Interface(null, [Document]);

    /**
     *  Get public key to encrypt message for user
     *
     * @returns {EncryptKey} public key as visa.key
     */
    Visa.prototype.getPublicKey = function () {};

    /**
     *  Set public key for other user to encrypt message
     *
     * @param {EncryptKey} pKey - public key as visa.key
     */
    Visa.prototype.setPublicKey = function (pKey) {};

    /**
     *  Get avatar URL
     *
     * @returns {PortableNetworkFile} image URL
     */
    Visa.prototype.getAvatar = function () {};

    /**
     *  Set avatar URL
     *
     * @param {PortableNetworkFile} image - image URL
     */
    Visa.prototype.setAvatar = function (image) {};

    /**
     *  Group Document
     *  ~~~~~~~~~~~~~~
     */
    var Bulletin = Interface(null, [Document]);

    /**
     *  Get group founder
     *
     * @return {ID} user ID
     */
    Bulletin.prototype.getFounder = function () {};

    /**
     *  Get group assistants
     *
     * @return {ID[]} bot ID list
     */
    Bulletin.prototype.getAssistants = function () {};

    /**
     *  Set group assistants
     *
     * @param {ID[]} assistants - bot ID list
     */
    Bulletin.prototype.setAssistants = function (assistants) {};

    //-------- namespace --------
    ns.protocol.Visa = Visa;
    ns.protocol.Bulletin = Bulletin;

})(MingKeMing);
