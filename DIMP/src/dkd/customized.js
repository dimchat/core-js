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

//! require 'protocol/customized.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var CustomizedContent = ns.protocol.CustomizedContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create app customized content
     *
     *  Usages:
     *      1. new AppCustomizedContent(map);
     *      2. new AppCustomizedContent(app, mod, act);
     *      3. new AppCustomizedContent(type, app, mod, act);
     */
    var AppCustomizedContent = function () {
        var app = null;
        var mod = null;
        var act = null;
        if (arguments.length === 1) {
            // new AppCustomizedContent(map);
            BaseContent.call(this, arguments[0]);
        } else if (arguments.length === 3) {
            // new AppCustomizedContent(app, mod, act);
            BaseContent.call(this, ContentType.CUSTOMIZED);
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
        } else {
            // new AppCustomizedContent(type, app, mod, act);
            BaseContent.call(this, arguments[0]);
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3];
        }
        if (app) {
            this.setValue('app', app);
        }
        if (mod) {
            this.setValue('mod', mod);
        }
        if (act) {
            this.setValue('act', act);
        }
    };
    Class(AppCustomizedContent, BaseContent, [CustomizedContent], {

        // Override
        getApplication: function () {
            return this.getString('app');
        },

        // Override
        getModule: function () {
            return this.getString('mod');
        },

        // Override
        getAction: function () {
            return this.getString('act');
        }
    });

    //-------- namespace --------
    ns.dkd.AppCustomizedContent = AppCustomizedContent;

})(DIMP);
