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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var IObject   = ns.type.Object;

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
    var Entity = Interface(null, [IObject]);

    /**
     *  Get entity ID
     *
     * @return {ID}
     */
    Entity.prototype.getIdentifier = function () {};

    /**
     *  Get entity type
     *
     * @return {uint} ID.type
     */
    Entity.prototype.getType = function () {};

    /**
     *  Get meta for this entity
     *
     * @returns {Meta}
     */
    Entity.prototype.getMeta = function () {};

    /**
     *  Get documents for this entity
     *
     * @returns {Document[]} available documents
     */
    Entity.prototype.getDocuments = function () {};

    /**
     *  Set data source for entity
     *
     * @param {EntityDataSource} barrack
     */
    Entity.prototype.setDataSource = function (barrack) {};
    Entity.prototype.getDataSource = function () {};

    /**
     *  Entity Data Source
     *  ~~~~~~~~~~~~~~~~~~
     *  Barrack
     */
    var EntityDataSource = Interface(null, null);

    /**
     *  Get meta for entity ID
     *
     * @param {ID} identifier - entity ID
     * @returns {Meta}
     */
    EntityDataSource.prototype.getMeta = function (identifier) {};

    /**
     *  Get profile for entity ID
     *
     * @param {ID} identifier - entity ID
     * @returns {Document[]} available documents
     */
    EntityDataSource.prototype.getDocuments = function (identifier) {};

    /**
     *  Entity Delegate
     *  ~~~~~~~~~~~~~~~
     *  Barrack
     */
    var EntityDelegate = Interface(null, null);

    /**
     *  Create user with ID
     *
     * @param {ID} identifier - user ID
     * @return {User}
     */
    EntityDelegate.prototype.getUser = function (identifier) {};

    /**
     *  Create group with ID
     *
     * @param identifier - group ID
     * @return {Group}
     */
    EntityDelegate.prototype.getGroup = function (identifier) {};

    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;

    //-------- namespace --------
    ns.mkm.Entity = Entity;
    ns.mkm.EntityDelegate = EntityDelegate;
    ns.mkm.EntityDataSource = EntityDataSource;

})(DIMP);

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var BaseObject = ns.type.BaseObject;

    var Entity = ns.mkm.Entity;

    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__barrack = null;
    };
    Class(BaseEntity, BaseObject, [Entity], null);

    // Override
    BaseEntity.prototype.equals = function (other) {
        if (this === other) {
            // same object
            return true;
        } else if (!other) {
            return false;
        } else if (Interface.conforms(other, Entity)) {
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
        var clazz = Object.getPrototypeOf(this).constructor.name;
        var id = this.__identifier;
        var network = id.getAddress().getType();
        return '<' + clazz + ' id="' + id.toString() + '" network="' + network + '" />';
    };

    //-------- IEntity

    // Override
    BaseEntity.prototype.setDataSource = function (barrack) {
        this.__barrack = barrack;
    };
    // Override
    BaseEntity.prototype.getDataSource = function () {
        return this.__barrack;
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
        var delegate = this.getDataSource();
        return delegate.getMeta(this.__identifier);
    };

    // Override
    BaseEntity.prototype.getDocuments = function () {
        var delegate = this.getDataSource();
        return delegate.getDocuments(this.__identifier);
    };

    //-------- namespace --------
    ns.mkm.BaseEntity = BaseEntity;

})(DIMP);
