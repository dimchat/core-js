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

//! require 'protocol/array.js'

(function (ns) {
    'use strict';

    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var ArrayContent = ns.protocol.ArrayContent;
    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create array list content
     *
     *  Usages:
     *      1. new ListContent(map);
     *      2. new ListContent(contents);
     */
    var ListContent = function () {
        var info = arguments[0];
        var list;
        if (info instanceof Array) {
            // new ListContent(contents);
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', ListContent.revert(list));
        } else {
            // new ListContent(map);
            BaseContent.call(this, arguments[0]);
            // lazy load
            list = null;
        }
        this.__list = list;
    };
    Class(ListContent, BaseContent, [ArrayContent], {

        // Override
        getContents: function () {
            if (this.__list === null) {
                var array = this.getValue('contents');
                if (array) {
                    this.__list = ListContent.convert(array);
                } else {
                    this.__list = [];
                }
            }
            return this.__list;
        }
    });

    ListContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item);
            }
        }
        return array;
    };
    ListContent.revert = function (contents) {
        var array = [];
        for (var i = 0; i < contents.length; ++i) {
            array.push(contents[i].toMap());
        }
        return array;
    };

    //-------- namespace --------
    ns.dkd.ListContent = ListContent;

})(DIMP);
