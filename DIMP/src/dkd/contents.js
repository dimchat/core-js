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

//! require 'protocol/text.js'

(function (ns) {
    'use strict';

    var Class               = ns.type.Class;
    var Interface           = ns.type.Interface;
    var IObject             = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;

    var ID              = ns.protocol.ID;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType     = ns.protocol.ContentType;
    var TextContent     = ns.protocol.TextContent;
    var ArrayContent    = ns.protocol.ArrayContent;
    var ForwardContent  = ns.protocol.ForwardContent;
    var PageContent     = ns.protocol.PageContent;
    var NameCard        = ns.protocol.NameCard;

    var BaseContent = ns.dkd.BaseContent;

    /**
     *  Create text message content
     *
     *  Usages:
     *      1. new BaseTextContent(map);
     *      2. new BaseTextContent(text);
     */
    var BaseTextContent = function (info) {
        if (typeof info === 'string') {
            // new BaseTextContent(text);
            BaseContent.call(this, ContentType.TEXT);
            this.setText(info);
        } else {
            // new BaseTextContent(map);
            BaseContent.call(this, info);
        }
    };
    Class(BaseTextContent, BaseContent, [TextContent], {

        // Override
        getText: function () {
            return this.getString('text', '');
        },

        // Override
        setText: function (text) {
            this.setValue('text', text);
        }
    });

    /**
     *  Create array list content
     *
     *  Usages:
     *      1. new ListContent(map);
     *      2. new ListContent(contents);
     */
    var ListContent = function (info) {
        var list;
        if (info instanceof Array) {
            // new ListContent(contents);
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', ArrayContent.revert(list));
        } else {
            // new ListContent(map);
            BaseContent.call(this, info);
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
                    this.__list = ArrayContent.convert(array);
                } else {
                    this.__list = [];
                }
            }
            return this.__list;
        }
    });

    /**
     *  Create top-secret message content
     *
     *  Usages:
     *      1. new SecretContent(map);
     *      2. new SecretContent(msg);
     *      3. new SecretContent(messages);
     */
    var SecretContent = function (info) {
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            // new SecretContent(messages);
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info;
        } else if (Interface.conforms(info, ReliableMessage)) {
            // new SecretContent(msg);
            BaseContent.call(this, ContentType.FORWARD);
            forward = info;
        } else {
            // new SecretContent(map);
            BaseContent.call(this, info);
        }
        if (forward) {
            this.setMap('forward', forward);
        } else if (secrets) {
            var array = ForwardContent.revert(secrets);
            this.setValue('secrets', array);
        }
        this.__forward = forward;
        this.__secrets = secrets;
    };
    Class(SecretContent, BaseContent, [ForwardContent], {

        // Override
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue('forward');
                this.__forward = ReliableMessage.parse(forward);
            }
            return this.__forward;
        },

        // Override
        getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue('secrets');
                if (array) {
                    // get from 'secrets'
                    this.__secrets = ForwardContent.convert(array);
                } else {
                    // get from 'forward'
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg);
                    }
                }
            }
            return this.__secrets;
        }
    });

    /**
     *  Create web page message content
     *
     *  Usages:
     *      1. new WebPageContent(map);
     *      2. new WebPageContent();
     */
    var WebPageContent = function (info) {
        if (info) {
            // new WebPageContent(map);
            BaseContent.call(this, info);
        } else {
            // new WebPageContent();
            BaseContent.call(this, ContentType.PAGE);
        }
        this.__icon = null;
    };
    Class(WebPageContent, BaseContent, [PageContent], {

        // Override
        getTitle: function () {
            return this.getString('title', '');
        },
        // Override
        setTitle: function (title) {
            this.setValue('title', title);
        },

        // Override
        getDesc: function () {
            return this.getString('desc', null);
        },
        // Override
        setDesc: function (text) {
            this.setValue('desc', text);
        },

        // Override
        getURL: function () {
            return this.getString('URL', null);
        },
        // Override
        setURL: function (url) {
            this.setValue('URL', url);
        },

        // Override
        getHTML: function () {
            return this.getString('HTML', null);
        },
        // Override
        setHTML: function (html) {
            this.setValue('HTML', html);
        },

        // Override
        getIcon: function () {
            var pnf = this.__icon;
            if (!pnf) {
                var url = this.getString('icon', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf;
            }
            return pnf;
        },
        // Override
        setIcon: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('icon', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('icon', image);
            } else {
                this.removeValue('icon');
            }
            this.__icon = pnf;
        }
    });

    /**
     *  Create name card content
     *
     *  Usages:
     *      1. new NameCardContent(map);
     *      2. new NameCardContent(id);
     */
    var NameCardContent = function (info) {
        if (Interface.conforms(info, ID)) {
            // new NameCardContent(id);
            BaseContent.call(this, ContentType.NAME_CARD);
            this.setString('ID', info);
        } else {
            // new NameCardContent(map);
            BaseContent.call(this, info);
        }
        this.__image = null;
    };
    Class(NameCardContent, BaseContent, [NameCard], {

        // Override
        getIdentifier: function () {
            var id = this.getValue('ID');
            return ID.parse(id);
        },

        // Override
        getName: function () {
            return this.getString('name', '');
        },
        setName: function (name) {
            this.setValue('name', name);
        },

        // Override
        getAvatar: function () {
            var pnf = this.__image;
            if (!pnf) {
                var url = this.getString('avatar', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf;
            }
            return pnf;
        },
        setAvatar: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('avatar', pnf.toObject());
            } else if (IObject.isString(image)) {
                this.setValue('avatar', image);
            } else {
                this.removeValue('avatar');
            }
            this.__image = pnf;
        }
    });

    //-------- namespace --------
    ns.dkd.BaseTextContent = BaseTextContent;
    ns.dkd.ListContent = ListContent;
    ns.dkd.SecretContent = SecretContent;
    ns.dkd.WebPageContent = WebPageContent;
    ns.dkd.NameCardContent = NameCardContent;

})(DIMP);
