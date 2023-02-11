;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
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

//! require 'entity.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;

    var Group = Interface(null, [Entity]);

    /**
     *  Get group document
     *
     * @return {Bulletin}
     */
    Group.prototype.getBulletin = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group founder
     *
     * @return {ID}
     */
    Group.prototype.getFounder = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group owner
     *
     * @return {ID}
     */
    Group.prototype.getOwner = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group members
     *  (NOTICE: the owner must be a member, usually the first one)
     *
     * @return {ID[]}
     */
    Group.prototype.getMembers = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group assistants
     *
     * @return {ID[]} bots IDs
     */
    Group.prototype.getAssistants = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Group Data Source
     *  ~~~~~~~~~~~~~~~~~
     */
    var GroupDataSource = Interface(null, [Entity.DataSource]);

    /**
     *  Get group founder
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getFounder = function (identifier) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group owner
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getOwner = function (identifier) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get group members list
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]}
     */
    GroupDataSource.prototype.getMembers = function (identifier) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get assistants for this group
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]} robot ID list
     */
    GroupDataSource.prototype.getAssistants = function (identifier) {
        throw new Error('NotImplemented');
    };

    Group.DataSource = GroupDataSource;

    //-------- namespace --------
    ns.mkm.Group = Group;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;

    var Document   = ns.protocol.Document;
    var Bulletin   = ns.protocol.Bulletin;
    var Group      = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;

    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    Class(BaseGroup, BaseEntity, [Group], {

        // Override
        getBulletin: function () {
            var doc = this.getDocument(Document.BULLETIN);
            if (Interface.conforms(doc, Bulletin)) {
                return doc;
            } else {
                return null;
            }
        },

        // Override
        getFounder: function () {
            if (this.__founder === null) {
                var barrack = this.getDataSource();
                var gid = this.getIdentifier();
                this.__founder = barrack.getFounder(gid);
            }
            return this.__founder;
        },

        // Override
        getOwner: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getOwner(gid);
        },

        // Override
        getMembers: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getMembers(gid);
        },

        // Override
        getAssistants: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getAssistants(gid);
        }
    });

    //-------- namespace --------
    ns.mkm.BaseGroup = BaseGroup;

})(DIMP);
