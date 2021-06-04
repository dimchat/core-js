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

/**
 *  Entity (User/Group)
 *  ~~~~~~~~~~~~~~~~~~~
 *  Base class of User and Group, ...
 *
 *  properties:
 *      identifier - entity ID
 *      type       - entity type
 *      meta       - meta for generate ID
 *      document   - entity profile
 */

//! require <mkm.js>
//! require 'namespace.js'

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;

    var Entity = function (identifier) {
        this.identifier = identifier;
        this.datasource = null;
    };
    ns.Class(Entity, ns.type.Object, null);

    /**
     *  Check whether the same user/group
     *
     * @param {Entity|ID} other - another entity
     * @returns {boolean}
     */
    Entity.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else if (other instanceof Entity) {
            // check with entity ID
            return this.identifier.equals(other.identifier);
        } else if (other instanceof ID) {
            return this.identifier.equals(other);
        } else {
            // null or unknown object
            return false;
        }
    };

    Entity.prototype.valueOf = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return '<' + clazz.name
            + '|' + this.getType()
            + ' ' + this.identifier + '>';
    };
    Entity.prototype.toString = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return '<' + clazz.name
            + '|' + this.getType()
            + ' ' + this.identifier + '>';
    };
    Entity.prototype.toLocaleString = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return '<' + clazz.name
            + '|' + this.getType()
            + ' ' + this.identifier + '>';
    };

    /**
     *  Get entity type
     *
     * @returns {char} 0 ~ 255
     */
    Entity.prototype.getType = function () {
        return this.identifier.getType();
    };

    /**
     *  Get data source for entity
     *
     * @return {*}
     */
    Entity.prototype.getDataSource = function () {
        return this.datasource;
    };
    Entity.prototype.setDataSource = function (delegate) {
        this.datasource = delegate;
    };

    /**
     *  Get meta for this entity
     *
     * @returns {Meta}
     */
    Entity.prototype.getMeta = function () {
        return this.getDataSource().getMeta(this.identifier);
    };

    /**
     *  Get profile for this entity
     *
     * @param {String} type - document type
     * @returns {Document}
     */
    Entity.prototype.getDocument = function (type) {
        return this.getDataSource().getDocument(this.identifier, type);
    };

    //-------- namespace --------
    ns.Entity = Entity;

    ns.register('Entity');

})(DIMP);

(function (ns) {
    'use strict';

    var Entity = ns.Entity;

    /**
     *  Entity Data Source
     *  ~~~~~~~~~~~~~~~~~~
     */
    var EntityDataSource = function () {
    };
    ns.Interface(EntityDataSource, null);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get meta for entity ID
     *
     * @param {ID} identifier - entity ID
     * @returns {Meta}
     */
    EntityDataSource.prototype.getMeta = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get profile for entity ID
     *
     * @param {ID} identifier - entity ID
     * @param {String} type - document type
     * @returns {Document}
     */
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        console.assert(false, 'implement me!');
        return null;
    };

    Entity.DataSource = EntityDataSource;

})(DIMP);

(function (ns) {
    'use strict';

    var Entity = ns.Entity;

    /**
     *  Entity Delegate
     *  ~~~~~~~~~~~~~~~
     */
    var EntityDelegate = function () {
    };
    ns.Interface(EntityDelegate, null);

    // noinspection JSUnusedLocalSymbols
    /**
     *  Select local user for receiver
     *
     * @param {ID} receiver - user/group ID
     * @return {User} local user
     */
    EntityDelegate.prototype.selectLocalUser = function (receiver) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Create user with ID
     *
     * @param {ID} identifier - user ID
     * @return {User}
     */
    EntityDelegate.prototype.getUser = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Create group with ID
     *
     * @param identifier - group ID
     * @return {Group}
     */
    EntityDelegate.prototype.getGroup = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    Entity.Delegate = EntityDelegate;

})(DIMP);
