'use strict';
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

//! require <dkd.js>

    /**
     *  Content for Application 0nly: {
     *      type : i2s(0xA0),
     *      sn   : 123,
     *
     *      app   : "{APP_ID}",  // application (e.g.: "chat.dim.sechat")
     *      mod   : "{MODULE}",  // module name (e.g.: "drift_bottle")
     *      act   : "{ACTION}",  // action name (e.g.: "throw")
     *      extra : info         // action parameters
     *  }
     */
    dkd.protocol.ApplicationContent = Interface(null, [Content]);
    var ApplicationContent = dkd.protocol.ApplicationContent;

    // get App ID
    ApplicationContent.prototype.getApplication = function () {};

    // get Module name
    ApplicationContent.prototype.getModule = function () {};

    // get Action name
    ApplicationContent.prototype.getAction = function () {};


    /**
     *  Application Customized message: {
     *      type : i2s(0xCC),
     *      sn   : 123,
     *
     *      app   : "{APP_ID}",  // application (e.g.: "chat.dim.sechat")
     *      mod   : "{MODULE}",  // module name (e.g.: "drift_bottle")
     *      act   : "{ACTION}",  // action name (e.g.: "throw")
     *      extra : info         // action parameters
     *  }
     */
    dkd.protocol.CustomizedContent = Interface(null, [ApplicationContent]);
    var CustomizedContent = dkd.protocol.CustomizedContent;

    //
    //  Factory
    //
    CustomizedContent.create = function () {
        var type, app, mod, act;
        if (arguments.length === 4) {
            // create(type, app, mod, act);
            type = arguments[0];
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3];
            return new AppCustomizedContent(type, app, mod, act);
        } else if (arguments.length === 3) {
            // create(app, mod, act);
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
            return new AppCustomizedContent(app, mod, act);
        // } else if (arguments.length === 0) {
        //     // create();
        //     return new AppCustomizedContent();
        } else {
            throw new SyntaxError('customized content arguments error: ' + arguments);
        }
    };
