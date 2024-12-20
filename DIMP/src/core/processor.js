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

/**
 *  Message Processor
 *  ~~~~~~~~~~~~~~~~~
 */

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;

    /**
     *  Message Processor
     *  ~~~~~~~~~~~~~~~~~
     */
    var Processor = Interface(null, null);

    /**
     *  Process data package
     *
     * @param {Uint8Array} data - data to be processed
     * @return {Uint8Array} response data
     */
    Processor.prototype.processPackage = function (data) {};

    /**
     *  Process network message
     *
     * @param {ReliableMessage} rMsg - message to be processed
     * @return {ReliableMessage} response message
     */
    Processor.prototype.processReliableMessage = function (rMsg) {};

    /**
     *  Process encrypted message
     *
     * @param {SecureMessage} sMsg - message to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {SecureMessage} response message
     */
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {};

    /**
     *  Process plain message
     *
     * @param {InstantMessage} iMsg - message to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {InstantMessage} response message
     */
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {};

    /**
     *  Process message content
     *
     * @param {Content} content - content to be processed
     * @param {ReliableMessage} rMsg - message received
     * @return {Content} response content
     */
    Processor.prototype.processContent = function (content, rMsg) {};

    //-------- namespace --------
    ns.Processor = Processor;

})(DIMP);
