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

    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;

    var Entity = ns.Entity;

    var Group = function (identifier) {
        Entity.call(this, identifier);
        this.__founder = null;
    };
    ns.Class(Group, Entity, null);

    Group.prototype.getBulletin = function () {
        var doc = this.getDocument(Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            return doc;
        } else {
            return null;
        }
    };

    Group.prototype.getFounder = function () {
        if (!this.__founder) {
            this.__founder = this.getDataSource().getFounder(this.identifier);
        }
        return this.__founder;
    };

    Group.prototype.getOwner = function () {
        return this.getDataSource().getOwner(this.identifier);
    };

    // NOTICE: the owner must be a member
    //         (usually the first one)
    Group.prototype.getMembers = function () {
        return this.getDataSource().getMembers(this.identifier);
    };

    Group.prototype.getAssistants = function () {
        return this.getDataSource().getAssistants(this.identifier);
    };

    //-------- namespace --------
    ns.Group = Group;

    ns.registers('Group');

})(DIMP);

(function (ns) {
    'use strict';

    var Entity = ns.Entity;
    var Group = ns.Group;

    var GroupDataSource = function () {
    };
    ns.Interface(GroupDataSource, [Entity.DataSource]);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get group founder
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getFounder = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get group owner
     *
     * @param {ID} identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getOwner = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get group members list
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]}
     */
    GroupDataSource.prototype.getMembers = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get assistants for this group
     *
     * @param {ID} identifier - group ID
     * @returns {ID[]} robot ID list
     */
    GroupDataSource.prototype.getAssistants = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    Group.DataSource = GroupDataSource;

})(DIMP);
