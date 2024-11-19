;
// license: https://mit-license.org
//
//  DIMP : Decentralized Instant Messaging Protocol
//
//                               Written in 2023 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2023 Albert Moky
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

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;

    /**
     *  Application Customized message: {
     *      type : 0xCC,
     *      sn   : 123,
     *
     *      app   : "{APP_ID}",  // application (e.g.: "chat.dim.sechat")
     *      mod   : "{MODULE}",  // module name (e.g.: "drift_bottle")
     *      act   : "{ACTION}",  // action name (e.g.: "throw")
     *      extra : info         // action parameters
     *  }
     */
    var CustomizedContent = Interface(null, [Content]);

    // get App ID
    CustomizedContent.prototype.getApplication = function () {};

    // get Module name
    CustomizedContent.prototype.getModule = function () {};

    // get Action name
    CustomizedContent.prototype.getAction = function () {};

    //-------- factory --------

    CustomizedContent.create = function () {
        var type, app, mod, act;
        if (arguments.length === 4) {
            // create(type, app, mod, act);
            type = arguments[0];
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3];
            return new ns.dkd.AppCustomizedContent(type, app, mod, act);
        } else if (arguments.length === 3) {
            // create(app, mod, act);
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
            return new ns.dkd.AppCustomizedContent(app, mod, act);
        // } else if (arguments.length === 0) {
        //     // create();
        //     return new ns.dkd.AppCustomizedContent();
        } else {
            throw new SyntaxError('customized content arguments error: ' + arguments);
        }
    };

    //-------- namespace --------
    ns.protocol.CustomizedContent = CustomizedContent;

})(DIMP);
