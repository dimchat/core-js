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
//! require 'helper.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;

    /**
     *  This class is for creating group
     *
     *      roles:
     *          founder
     *          owner
     *          members
     *          administrators - Optional
     *          assistants     - group bots
     */
    var Group = Interface(null, [Entity]);

    /**
     *  Get group document
     *
     * @return {Bulletin}
     */
    Group.prototype.getBulletin = function () {};

    /**
     *  Get group founder
     *
     * @return {ID}
     */
    Group.prototype.getFounder = function () {};

    /**
     *  Get group owner
     *
     * @return {ID}
     */
    Group.prototype.getOwner = function () {};

    /**
     *  Get group members
     *  (NOTICE: the owner must be a member, usually the first one)
     *
     * @return {ID[]}
     */
    Group.prototype.getMembers = function () {};

    /**
     *  Get group assistants
     *
     * @return {ID[]} bots IDs
     */
    Group.prototype.getAssistants = function () {};

    /**
     *  This interface is for getting information for group
     *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *
     *  1. founder has the same public key with the group's meta.key
     *  2. owner and members should be set complying with the consensus algorithm
     */
    var GroupDataSource = Interface(null, [Entity.DataSource]);

    /**
     *  Get group founder
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getFounder = function (identifier) {};

    /**
     *  Get group owner
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getOwner = function (identifier) {};

    /**
     *  Get group members list
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]}
     */
    GroupDataSource.prototype.getMembers = function (identifier) {};

    /**
     *  Get assistants for this group
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]} robot ID list
     */
    GroupDataSource.prototype.getAssistants = function (identifier) {};

    Group.DataSource = GroupDataSource;

    //-------- namespace --------
    ns.mkm.Group = Group;
    // ns.mkm.GroupDataSource = GroupDataSource;

})(DIMP);

(function (ns) {
    'use strict';

    var Class          = ns.type.Class;
    var Group          = ns.mkm.Group;
    var BaseEntity     = ns.mkm.BaseEntity;
    var DocumentHelper = ns.mkm.DocumentHelper;

    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    Class(BaseGroup, BaseEntity, [Group], {

        // Override
        getBulletin: function () {
            var docs = this.getDocuments();
            return DocumentHelper.lastBulletin(docs);
        },

        // Override
        getFounder: function () {
            var founder = this.__founder;
            if (!founder) {
                var barrack = this.getDataSource();
                var group = this.getIdentifier();
                founder = barrack.getFounder(group);
                this.__founder = founder;
            }
            return founder;
        },

        // Override
        getOwner: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getOwner(group);
        },

        // Override
        getMembers: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getMembers(group);
        },

        // Override
        getAssistants: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getAssistants(group);
        }
    });

    //-------- namespace --------
    ns.mkm.BaseGroup = BaseGroup;

})(DIMP);
