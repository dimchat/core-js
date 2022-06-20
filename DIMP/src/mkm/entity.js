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

    var Entity = function () {};
    ns.Interface(Entity, [ns.type.Object]);

    /**
     *  Get entity ID
     *
     * @return {ID}
     */
    Entity.prototype.getIdentifier = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get entity type
     *
     * @return {uint} ID.type
     */
    Entity.prototype.getType = function () {
        ns.assert(false, 'implement me!');
        return 0;
    };

    /**
     *  Get meta for this entity
     *
     * @returns {Meta}
     */
    Entity.prototype.getMeta = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get profile for this entity
     *
     * @param {String} type - document type
     * @returns {Document}
     */
    Entity.prototype.getDocument = function (type) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set data source for entity
     *
     * @param {EntityDataSource} barrack
     */
    Entity.prototype.setDataSource = function (barrack) {
        ns.assert(false, 'implement me!');
    };
    Entity.prototype.getDataSource = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Entity Data Source
     *  ~~~~~~~~~~~~~~~~~~
     *  Barrack
     */
    var EntityDataSource = function () {};
    ns.Interface(EntityDataSource, null);

    /**
     *  Get meta for entity ID
     *
     * @param {ID} identifier - entity ID
     * @returns {Meta}
     */
    EntityDataSource.prototype.getMeta = function (identifier) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get profile for entity ID
     *
     * @param {ID} identifier - entity ID
     * @param {String} type - document type
     * @returns {Document}
     */
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Entity Delegate
     *  ~~~~~~~~~~~~~~~
     *  Barrack
     */
    var EntityDelegate = function () {};
    ns.Interface(EntityDelegate, null);

    /**
     *  Create user with ID
     *
     * @param {ID} identifier - user ID
     * @return {User}
     */
    EntityDelegate.prototype.getUser = function (identifier) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Create group with ID
     *
     * @param identifier - group ID
     * @return {Group}
     */
    EntityDelegate.prototype.getGroup = function (identifier) {
        ns.assert(false, 'implement me!');
        return null;
    };

    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;

    //-------- namespace --------
    ns.mkm.Entity = Entity;

    ns.mkm.registers('Entity');

})(DIMP);

(function (ns) {
    'use strict';

    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;

    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__datasource = null;
    };
    ns.Class(BaseEntity, BaseObject, [Entity], null);

    //-------- IObject

    // Override
    BaseEntity.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else if (ns.Interface.conforms(other, Entity)) {
            // check with entity ID
            other = other.getIdentifier();
        }
        return this.__identifier.equals(other);
    };

    // Override
    BaseEntity.prototype.valueOf = function () {
        return desc.call(this);
    };
    // Override
    BaseEntity.prototype.toString = function () {
        return desc.call(this);
    };
    var desc = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return '<' + clazz.name
            + '|' + this.__identifier.getType()
            + ' ' + this.__identifier + '>';
    };

    //-------- IEntity

    // Override
    BaseEntity.prototype.setDataSource = function (delegate) {
        this.__datasource = delegate;
    };
    // Override
    BaseEntity.prototype.getDataSource = function () {
        return this.__datasource;
    };

    // Override
    BaseEntity.prototype.getIdentifier = function () {
        return this.__identifier;
    };

    // Override
    BaseEntity.prototype.getType = function () {
        return this.__identifier.getType();
    };

    // Override
    BaseEntity.prototype.getMeta = function () {
        return this.__datasource.getMeta(this.__identifier);
    };

    // Override
    BaseEntity.prototype.getDocument = function (type) {
        return this.__datasource.getDocument(this.__identifier, type);
    };

    //-------- namespace --------
    ns.mkm.BaseEntity = BaseEntity;

    ns.mkm.registers('BaseEntity');

})(DIMP);
