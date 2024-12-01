/**
 * DIMP - Decentralized Instant Messaging Protocol (v1.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Nov. 17, 2024
 * @copyright (c) 2024 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== 'object') {
    MONKEY = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = {}
    }
    if (typeof ns.format !== 'object') {
        ns.format = {}
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = {}
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = {}
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var conforms = function (object, protocol) {
        if (!object) {
            return false
        } else if (object instanceof protocol) {
            return true
        }
        return check_class(object.constructor, protocol)
    };
    var check_class = function (constructor, protocol) {
        var interfaces = constructor._mk_interfaces;
        if (interfaces && check_interfaces(interfaces, protocol)) {
            return true
        }
        var parent = constructor._mk_parent;
        return parent && check_class(parent, protocol)
    };
    var check_interfaces = function (interfaces, protocol) {
        var child, parents;
        for (var i = 0; i < interfaces.length; ++i) {
            child = interfaces[i];
            if (child === protocol) {
                return true
            }
            parents = child._mk_parents;
            if (parents && check_interfaces(parents, protocol)) {
                return true
            }
        }
        return false
    };
    var def_methods = function (clazz, methods) {
        var names = Object.keys(methods);
        var key, fn;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            fn = methods[key];
            if (typeof fn === 'function') {
                clazz.prototype[key] = fn
            }
        }
        return clazz
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {
            }
        }
        if (parents) {
            child._mk_parents = parents
        }
        return child
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces, methods) {
        if (!child) {
            child = function () {
                Object.call(this)
            }
        }
        if (parent) {
            child._mk_parent = parent
        } else {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        if (interfaces) {
            child._mk_interfaces = interfaces
        }
        if (methods) {
            def_methods(child, methods)
        }
        return child
    };
    ns.type.Interface = interfacefy;
    ns.type.Class = classify
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var is_null = function (object) {
        if (typeof object === 'undefined') {
            return true
        } else {
            return object === null
        }
    };
    var is_string = function (object) {
        return typeof object === 'string'
    };
    var is_number = function (object) {
        return typeof object === 'number'
    };
    var is_boolean = function (object) {
        return typeof object === 'boolean'
    };
    var is_function = function (object) {
        return typeof object === 'function'
    };
    var is_base_type = function (object) {
        var t = typeof object;
        if (t === 'string' || t === 'number' || t === 'boolean' || t === 'function') {
            return true
        }
        if (object instanceof Date) {
            return true
        }
        if (object instanceof RegExp) {
            return true
        }
        return object instanceof Error
    };
    var IObject = Interface(null, null);
    IObject.prototype.getClassName = function () {
    };
    IObject.prototype.equals = function (other) {
    };
    IObject.prototype.valueOf = function () {
    };
    IObject.prototype.toString = function () {
    };
    IObject.isNull = is_null;
    IObject.isString = is_string;
    IObject.isNumber = is_number;
    IObject.isBoolean = is_boolean;
    IObject.isFunction = is_function;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this)
    };
    Class(BaseObject, Object, [IObject], null);
    BaseObject.prototype.getClassName = function () {
        return Object.getPrototypeOf(this).constructor.name
    };
    BaseObject.prototype.equals = function (other) {
        return this === other
    };
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject
})(MONKEY);
(function (ns) {
    'use strict';
    var IObject = ns.type.Object;
    var getString = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (IObject.isString(value)) {
            return value
        } else {
            return value.toString()
        }
    };
    var getDateTime = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof Date) {
            return value
        }
        var seconds = getFloat(value, 0);
        var millis = seconds * 1000;
        return new Date(millis)
    };
    var getInt = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (IObject.isNumber(value)) {
            return value
        } else if (IObject.isBoolean(value)) {
            return value ? 1 : 0
        } else {
            var str = IObject.isString(value) ? value : value.toString();
            return parseInt(str)
        }
    };
    var getFloat = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (IObject.isNumber(value)) {
            return value
        } else if (IObject.isBoolean(value)) {
            return value ? 1.0 : 0.0
        } else {
            var str = IObject.isString(value) ? value : value.toString();
            return parseFloat(str)
        }
    };
    var getBoolean = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (IObject.isBoolean(value)) {
            return value
        } else if (IObject.isNumber(value)) {
            return value > 0 || value < 0
        }
        var text;
        if (IObject.isString(value)) {
            text = value
        } else {
            text = value.toString()
        }
        text = text.trim();
        var size = text.length;
        if (size === 0) {
            return false
        } else if (size > ns.type.Converter.kMaxBoolLen) {
            return true
        } else {
            text = text.toLowerCase()
        }
        var state = kBoolStates[text];
        return IObject.isNull(state) || state
    };
    var kBoolStates = {
        '1': true,
        'yes': true,
        'true': true,
        'on': true,
        '0': false,
        'no': false,
        'false': false,
        'off': false,
        '+0': false,
        '-0': false,
        '+0.0': false,
        '-0.0': false,
        'none': false,
        'null': false,
        'undefined': false
    };
    var kMaxBoolLen = 'undefined'.length;
    ns.type.Converter = {
        getString: getString,
        getDateTime: getDateTime,
        getInt: getInt,
        getFloat: getFloat,
        getBoolean: getBoolean,
        kBoolStates: kBoolStates,
        kMaxBoolLen: kMaxBoolLen
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var IObject = ns.type.Object;
    var is_array = function (obj) {
        return obj instanceof Array || is_number_array(obj)
    };
    var is_number_array = function (obj) {
        if (obj instanceof Uint8ClampedArray) {
            return true
        } else if (obj instanceof Uint8Array) {
            return true
        } else if (obj instanceof Int8Array) {
            return true
        } else if (obj instanceof Uint16Array) {
            return true
        } else if (obj instanceof Int16Array) {
            return true
        } else if (obj instanceof Uint32Array) {
            return true
        } else if (obj instanceof Int32Array) {
            return true
        } else if (obj instanceof Float32Array) {
            return true
        } else if (obj instanceof Float64Array) {
            return true
        }
        return false
    };
    var number_arrays_equal = function (array1, array2) {
        var pos = array1.length;
        if (pos !== array2.length) {
            return false
        }
        while (pos > 0) {
            pos -= 1;
            if (array1[pos] !== array2[pos]) {
                return false
            }
        }
        return true
    };
    var arrays_equal = function (array1, array2) {
        if (is_number_array(array1) || is_number_array(array2)) {
            return number_arrays_equal(array1, array2)
        }
        var pos = array1.length;
        if (pos !== array2.length) {
            return false
        }
        while (pos > 0) {
            pos -= 1;
            if (!objects_equal(array1[pos], array2[pos], false)) {
                return false
            }
        }
        return true
    };
    var maps_equal = function (dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        var pos = keys1.length;
        if (pos !== keys2.length) {
            return false
        }
        var key;
        while (pos > 0) {
            pos -= 1;
            key = keys1[pos];
            if (!key || key.length === 0) {
                continue
            }
            if (!objects_equal(dict1[key], dict2[key], key.charAt(0) === '_')) {
                return false
            }
        }
        return true
    };
    var objects_equal = function (obj1, obj2, shallow) {
        if (!obj1) {
            return !obj2
        } else if (!obj2) {
            return false
        } else if (obj1 === obj2) {
            return true
        }
        if (typeof obj1['equals'] === 'function') {
            return obj1.equals(obj2)
        } else if (typeof obj2['equals'] === 'function') {
            return obj2.equals(obj1)
        }
        if (is_array(obj1)) {
            return is_array(obj2) && arrays_equal(obj1, obj2)
        } else if (is_array(obj2)) {
            return false
        }
        if (obj1 instanceof Date) {
            return obj2 instanceof Date && obj1.getTime() === obj2.getTime()
        } else if (obj2 instanceof Date) {
            return false
        } else if (IObject.isBaseType(obj1)) {
            return false
        } else if (IObject.isBaseType(obj2)) {
            return false
        }
        return !shallow && maps_equal(obj1, obj2)
    };
    var copy_items = function (src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length)
        }
        dest.set(src, destPos)
    };
    var insert_item = function (array, index, item) {
        if (index < 0) {
            index += array.length + 1;
            if (index < 0) {
                return false
            }
        }
        if (index === 0) {
            array.unshift(item)
        } else if (index === array.length) {
            array.push(item)
        } else if (index > array.length) {
            array[index] = item
        } else {
            array.splice(index, 0, item)
        }
        return true
    };
    var update_item = function (array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false
            }
        }
        array[index] = item;
        return true
    };
    var remove_item = function (array, item) {
        var index = find_item(array, item);
        if (index < 0) {
            return false
        } else if (index === 0) {
            array.shift()
        } else if ((index + 1) === array.length) {
            array.pop()
        } else {
            array.splice(index, 1)
        }
        return true
    };
    var find_item = function (array, item) {
        for (var i = 0; i < array.length; ++i) {
            if (objects_equal(array[i], item, false)) {
                return i
            }
        }
        return -1
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        find: find_item,
        equals: function (array1, array2) {
            return objects_equal(array1, array2, false)
        },
        copy: copy_items,
        isArray: is_array
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var is_enum = function (obj) {
        return obj instanceof BaseEnum
    };
    var get_int = function (obj) {
        if (obj instanceof BaseEnum) {
            return obj.getValue()
        } else if (IObject.isNumber(obj)) {
            return obj
        }
        return obj.valueOf()
    };
    var get_alias = function (enumeration, value) {
        var keys = Object.keys(enumeration);
        var e;
        for (var k in keys) {
            e = enumeration[k];
            if (e instanceof BaseEnum && e.equals(value)) {
                return e.__alias
            }
        }
        return null
    };
    var BaseEnum = function (value, alias) {
        BaseObject.call(this);
        if (!alias) {
            alias = get_alias(this, value)
        }
        this.__value = value;
        this.__alias = alias
    };
    Class(BaseEnum, BaseObject, null, null);
    BaseEnum.prototype.equals = function (other) {
        if (other instanceof BaseEnum) {
            if (this === other) {
                return true
            }
            other = other.valueOf()
        }
        return this.__value === other
    };
    BaseEnum.prototype.toString = function () {
        return '<' + this.getName() + ': ' + this.getValue() + '>'
    };
    BaseEnum.prototype.valueOf = function () {
        return this.__value
    };
    BaseEnum.prototype.getValue = function () {
        return this.__value
    };
    BaseEnum.prototype.getName = function () {
        return this.__alias
    };
    var enum_class = function (type) {
        var Enum = function (value, alias) {
            BaseEnum.call(this, value, alias)
        };
        Class(Enum, BaseEnum, null, {
            toString: function () {
                var clazz = Enum.__type;
                if (!clazz) {
                    clazz = this.getClassName()
                }
                return '<' + clazz + ' ' + this.getName() + ': ' + this.getValue() + '>'
            }
        });
        Enum.__type = type;
        return Enum
    };
    var enumify = function (enumeration, elements) {
        if (IObject.isString(enumeration)) {
            enumeration = enum_class(enumeration)
        } else if (!enumeration) {
            enumeration = enum_class(null)
        } else {
            Class(enumeration, BaseEnum, null, null)
        }
        var keys = Object.keys(elements);
        var alias, value;
        for (var i = 0; i < keys.length; ++i) {
            alias = keys[i];
            value = elements[alias];
            if (value instanceof BaseEnum) {
                value = value.getValue()
            } else if (typeof value !== 'number') {
                throw new TypeError('Enum value must be a number!');
            }
            enumeration[alias] = new enumeration(value, alias)
        }
        return enumeration
    };
    enumify.isEnum = is_enum;
    enumify.getInt = get_int;
    ns.type.Enum = enumify
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Arrays = ns.type.Arrays;
    var Set = Interface(null, [IObject]);
    Set.prototype.isEmpty = function () {
    };
    Set.prototype.getLength = function () {
    };
    Set.prototype.contains = function (element) {
    };
    Set.prototype.add = function (element) {
    };
    Set.prototype.remove = function (element) {
    };
    Set.prototype.clear = function () {
    };
    Set.prototype.toArray = function () {
    };
    var HashSet = function () {
        BaseObject.call(this);
        this.__array = []
    };
    Class(HashSet, BaseObject, [Set], null);
    HashSet.prototype.equals = function (other) {
        if (Interface.conforms(other, Set)) {
            if (this === other) {
                return true
            }
            other = other.valueOf()
        }
        return Arrays.equals(this.__array, other)
    };
    HashSet.prototype.valueOf = function () {
        return this.__array
    };
    HashSet.prototype.toString = function () {
        return this.__array.toString()
    };
    HashSet.prototype.isEmpty = function () {
        return this.__array.length === 0
    };
    HashSet.prototype.getLength = function () {
        return this.__array.length
    };
    HashSet.prototype.contains = function (item) {
        var pos = Arrays.find(this.__array, item);
        return pos >= 0
    };
    HashSet.prototype.add = function (item) {
        var pos = Arrays.find(this.__array, item);
        if (pos < 0) {
            this.__array.push(item);
            return true
        } else {
            return false
        }
    };
    HashSet.prototype.remove = function (item) {
        return Arrays.remove(this.__array, item)
    };
    HashSet.prototype.clear = function () {
        this.__array = []
    };
    HashSet.prototype.toArray = function () {
        return this.__array.slice()
    };
    ns.type.Set = Set;
    ns.type.HashSet = HashSet
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Stringer = Interface(null, [IObject]);
    Stringer.prototype.isEmpty = function () {
    };
    Stringer.prototype.getLength = function () {
    };
    Stringer.prototype.equalsIgnoreCase = function (other) {
    };
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = ''
        } else if (Interface.conforms(str, Stringer)) {
            str = str.toString()
        }
        this.__string = str
    };
    Class(ConstantString, BaseObject, [Stringer], null);
    ConstantString.prototype.equals = function (other) {
        if (Interface.conforms(other, Stringer)) {
            if (this === other) {
                return true
            }
            other = other.valueOf()
        }
        return this.__string === other
    };
    ConstantString.prototype.valueOf = function () {
        return this.__string
    };
    ConstantString.prototype.toString = function () {
        return this.__string
    };
    ConstantString.prototype.isEmpty = function () {
        return this.__string.length === 0
    };
    ConstantString.prototype.getLength = function () {
        return this.__string.length
    };
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return !this.__string
        } else if (Interface.conforms(other, Stringer)) {
            return equalsIgnoreCase(this.__string, other.toString())
        } else {
            return equalsIgnoreCase(this.__string, other)
        }
    };
    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2
    };
    ns.type.Stringer = Stringer;
    ns.type.ConstantString = ConstantString
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Converter = ns.type.Converter;
    var copy_map = function (map, deep) {
        if (deep) {
            return ns.type.Copier.deepCopyMap(map)
        } else {
            return ns.type.Copier.copyMap(map)
        }
    };
    var json_encode = function (dict) {
        return ns.format.JSON.encode(dict)
    };
    var Mapper = Interface(null, [IObject]);
    Mapper.prototype.toMap = function () {
    };
    Mapper.prototype.copyMap = function (deepCopy) {
    };
    Mapper.prototype.isEmpty = function () {
    };
    Mapper.prototype.getLength = function () {
    };
    Mapper.prototype.allKeys = function () {
    };
    Mapper.prototype.getValue = function (key) {
    };
    Mapper.prototype.setValue = function (key, value) {
    };
    Mapper.prototype.removeValue = function (key) {
    };
    Mapper.prototype.getString = function (key, defaultValue) {
    };
    Mapper.prototype.getBoolean = function (key, defaultValue) {
    };
    Mapper.prototype.getInt = function (key, defaultValue) {
    };
    Mapper.prototype.getFloat = function (key, defaultValue) {
    };
    Mapper.prototype.getDateTime = function (key, defaultValue) {
    };
    Mapper.prototype.setDateTime = function (key, time) {
    };
    Mapper.prototype.setString = function (key, stringer) {
    };
    Mapper.prototype.setMap = function (key, mapper) {
    };
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {}
        } else if (Interface.conforms(dict, Mapper)) {
            dict = dict.toMap()
        }
        this.__dictionary = dict
    };
    Class(Dictionary, BaseObject, [Mapper], null);
    Dictionary.prototype.equals = function (other) {
        if (Interface.conforms(other, Mapper)) {
            if (this === other) {
                return true
            }
            other = other.valueOf()
        }
        return ns.type.Arrays.equals(this.__dictionary, other)
    };
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary
    };
    Dictionary.prototype.toString = function () {
        return json_encode(this.__dictionary)
    };
    Dictionary.prototype.toMap = function () {
        return this.__dictionary
    };
    Dictionary.prototype.copyMap = function (deepCopy) {
        return copy_map(this.__dictionary, deepCopy)
    };
    Dictionary.prototype.isEmpty = function () {
        var keys = Object.keys(this.__dictionary);
        return keys.length === 0
    };
    Dictionary.prototype.getLength = function () {
        var keys = Object.keys(this.__dictionary);
        return keys.length
    };
    Dictionary.prototype.allKeys = function () {
        return Object.keys(this.__dictionary)
    };
    Dictionary.prototype.getValue = function (key) {
        return this.__dictionary[key]
    };
    Dictionary.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value
        } else if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key]
        }
    };
    Dictionary.prototype.removeValue = function (key) {
        var value;
        if (this.__dictionary.hasOwnProperty(key)) {
            value = this.__dictionary[key];
            delete this.__dictionary[key]
        } else {
            value = null
        }
        return value
    };
    Dictionary.prototype.getString = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getString(value, defaultValue)
    };
    Dictionary.prototype.getBoolean = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getBoolean(value, defaultValue)
    };
    Dictionary.prototype.getInt = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getInt(value, defaultValue)
    };
    Dictionary.prototype.getFloat = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getFloat(value, defaultValue)
    };
    Dictionary.prototype.getDateTime = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getDateTime(value, defaultValue)
    };
    Dictionary.prototype.setDateTime = function (key, time) {
        if (!time) {
            this.removeValue(key)
        } else if (time instanceof Date) {
            time = time.getTime() / 1000.0;
            this.__dictionary[key] = time
        } else {
            time = Converter.getFloat(time, 0);
            this.__dictionary[key] = time
        }
    };
    Dictionary.prototype.setString = function (key, string) {
        if (!string) {
            this.removeValue(key)
        } else {
            this.__dictionary[key] = string.toString()
        }
    };
    Dictionary.prototype.setMap = function (key, map) {
        if (!map) {
            this.removeValue(key)
        } else {
            this.__dictionary[key] = map.toMap()
        }
    };
    ns.type.Mapper = Mapper;
    ns.type.Dictionary = Dictionary
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var fetch_string = function (str) {
        if (Interface.conforms(str, Stringer)) {
            return str.toString()
        } else {
            return str
        }
    };
    var fetch_map = function (dict) {
        if (Interface.conforms(dict, Mapper)) {
            return dict.toMap()
        } else {
            return dict
        }
    };
    var unwrap = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.getValue()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return unwrap_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return unwrap_map(object)
        } else if (object instanceof Array) {
            return unwrap_list(object)
        } else {
            return object
        }
    };
    var unwrap_map = function (dict) {
        var result = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            result[key] = unwrap(dict[key])
        }
        return result
    };
    var unwrap_list = function (array) {
        var result = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            result[i] = unwrap(array[i])
        }
        return result
    };
    ns.type.Wrapper = {
        fetchString: fetch_string,
        fetchMap: fetch_map,
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.getValue()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return copy_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return copy_map(object)
        } else if (object instanceof Array) {
            return copy_list(object)
        } else {
            return object
        }
    };
    var copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = dict[key]
        }
        return clone
    };
    var copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(array[i])
        }
        return clone
    };
    var deep_copy = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.getValue()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return deep_copy_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return deep_copy_map(object)
        } else if (object instanceof Array) {
            return deep_copy_list(object)
        } else {
            return object
        }
    };
    var deep_copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = deep_copy(dict[key])
        }
        return clone
    };
    var deep_copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(deep_copy(array[i]))
        }
        return clone
    };
    ns.type.Copier = {
        copy: copy,
        copyMap: copy_map,
        copyList: copy_list,
        deepCopy: deep_copy,
        deepCopyMap: deep_copy_map,
        deepCopyList: deep_copy_list
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var DataDigester = Interface(null, null);
    DataDigester.prototype.digest = function (data) {
    };
    ns.digest.DataDigester = DataDigester
})(MONKEY);
(function (ns) {
    'use strict';
    var MD5 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return md5Digester
        }, setDigester: function (digester) {
            md5Digester = digester
        }
    };
    var md5Digester = null;
    ns.digest.MD5 = MD5
})(MONKEY);
(function (ns) {
    'use strict';
    var SHA1 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return sha1Digester
        }, setDigester: function (digester) {
            sha1Digester = digester
        }
    };
    var sha1Digester = null;
    ns.digest.SHA1 = SHA1
})(MONKEY);
(function (ns) {
    'use strict';
    var SHA256 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return sha256Digester
        }, setDigester: function (digester) {
            sha256Digester = digester
        }
    };
    var sha256Digester = null;
    ns.digest.SHA256 = SHA256
})(MONKEY);
(function (ns) {
    'use strict';
    var RipeMD160 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return ripemd160Digester
        }, setDigester: function (digester) {
            ripemd160Digester = digester
        }
    };
    var ripemd160Digester = null;
    ns.digest.RIPEMD160 = RipeMD160
})(MONKEY);
(function (ns) {
    'use strict';
    var Keccak256 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return keccak256Digester
        }, setDigester: function (digester) {
            keccak256Digester = digester
        }
    };
    var keccak256Digester = null;
    ns.digest.KECCAK256 = Keccak256
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var DataCoder = Interface(null, null);
    DataCoder.prototype.encode = function (data) {
    };
    DataCoder.prototype.decode = function (string) {
    };
    var ObjectCoder = Interface(null, null);
    ObjectCoder.prototype.encode = function (object) {
    };
    ObjectCoder.prototype.decode = function (string) {
    };
    var StringCoder = Interface(null, null);
    StringCoder.prototype.encode = function (string) {
    };
    StringCoder.prototype.decode = function (data) {
    };
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder
})(MONKEY);
(function (ns) {
    'use strict';
    var Hex = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return hexCoder
        }, setCoder: function (coder) {
            hexCoder = coder
        }
    };
    var hexCoder = null;
    ns.format.Hex = Hex
})(MONKEY);
(function (ns) {
    'use strict';
    var Base58 = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return base58Coder
        }, setCoder: function (coder) {
            base58Coder = coder
        }
    };
    var base58Coder = null;
    ns.format.Base58 = Base58
})(MONKEY);
(function (ns) {
    'use strict';
    var Base64 = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return base64Coder
        }, setCoder: function (coder) {
            base64Coder = coder
        }
    };
    var base64Coder = null;
    ns.format.Base64 = Base64
})(MONKEY);
(function (ns) {
    'use strict';
    var UTF8 = {
        encode: function (string) {
            return this.getCoder().encode(string)
        }, decode: function (data) {
            return this.getCoder().decode(data)
        }, getCoder: function () {
            return utf8Coder
        }, setCoder: function (coder) {
            utf8Coder = coder
        }
    };
    var utf8Coder = null;
    ns.format.UTF8 = UTF8
})(MONKEY);
(function (ns) {
    'use strict';
    var JsON = {
        encode: function (object) {
            return this.getCoder().encode(object)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return jsonCoder
        }, setCoder: function (coder) {
            jsonCoder = coder
        }
    };
    var jsonCoder = null;
    ns.format.JSON = JsON
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TransportableData = Interface(null, [Mapper]);
    TransportableData.DEFAULT = 'base64';
    TransportableData.BASE64 = 'base64';
    TransportableData.BASE58 = 'base58';
    TransportableData.HEX = 'hex';
    TransportableData.prototype.getAlgorithm = function () {
    };
    TransportableData.prototype.getData = function () {
    };
    TransportableData.prototype.toString = function () {
    };
    TransportableData.prototype.toObject = function () {
    };
    TransportableData.encode = function (data) {
        var ted = TransportableData.create(data);
        return ted.toObject()
    };
    TransportableData.decode = function (encoded) {
        var ted = TransportableData.parse(encoded);
        if (!ted) {
            return null
        }
        return ted.getData()
    };
    var general_factory = function () {
        var man = ns.format.FormatFactoryManager;
        return man.generalFactory
    };
    TransportableData.create = function (data, algorithm) {
        if (!algorithm) {
            algorithm = TransportableData.DEFAULT
        }
        var gf = general_factory();
        return gf.createTransportableData(algorithm, data)
    };
    TransportableData.parse = function (ted) {
        var gf = general_factory();
        return gf.parseTransportableData(ted)
    };
    TransportableData.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        return gf.setTransportableDataFactory(algorithm, factory)
    };
    TransportableData.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getTransportableDataFactory(algorithm)
    };
    var TransportableDataFactory = Interface(null, null);
    TransportableDataFactory.prototype.createTransportableData = function (data) {
    };
    TransportableDataFactory.prototype.parseTransportableData = function (ted) {
    };
    TransportableData.Factory = TransportableDataFactory;
    ns.format.TransportableData = TransportableData
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TransportableData = ns.format.TransportableData;
    var PortableNetworkFile = Interface(null, [Mapper]);
    PortableNetworkFile.prototype.setData = function (fileData) {
    };
    PortableNetworkFile.prototype.getData = function () {
    };
    PortableNetworkFile.prototype.setFilename = function (filename) {
    };
    PortableNetworkFile.prototype.getFilename = function () {
    };
    PortableNetworkFile.prototype.setURL = function (url) {
    };
    PortableNetworkFile.prototype.getURL = function () {
    };
    PortableNetworkFile.prototype.setPassword = function (key) {
    };
    PortableNetworkFile.prototype.getPassword = function () {
    };
    PortableNetworkFile.prototype.toString = function () {
    };
    PortableNetworkFile.prototype.toObject = function () {
    };
    var general_factory = function () {
        var man = ns.format.FormatFactoryManager;
        return man.generalFactory
    };
    PortableNetworkFile.createFromURL = function (url, password) {
        return PortableNetworkFile.create(null, null, url, password)
    };
    PortableNetworkFile.createFromData = function (data, filename) {
        var ted = TransportableData.create(data);
        return PortableNetworkFile.create(ted, filename, null, null)
    };
    PortableNetworkFile.create = function (ted, filename, url, password) {
        var gf = general_factory();
        return gf.createPortableNetworkFile(ted, filename, url, password)
    };
    PortableNetworkFile.parse = function (pnf) {
        var gf = general_factory();
        return gf.parsePortableNetworkFile(pnf)
    };
    PortableNetworkFile.setFactory = function (factory) {
        var gf = general_factory();
        return gf.setPortableNetworkFileFactory(factory)
    };
    PortableNetworkFile.getFactory = function () {
        var gf = general_factory();
        return gf.getPortableNetworkFileFactory()
    };
    var PortableNetworkFileFactory = Interface(null, null);
    PortableNetworkFileFactory.prototype.createPortableNetworkFile = function (ted, filename, url, password) {
    };
    PortableNetworkFileFactory.prototype.parsePortableNetworkFile = function (pnf) {
    };
    PortableNetworkFile.Factory = PortableNetworkFileFactory;
    ns.format.PortableNetworkFile = PortableNetworkFile
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var Mapper = ns.type.Mapper;
    var Stringer = ns.type.Stringer;
    var Converter = ns.type.Converter
    var TransportableData = ns.format.TransportableData;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var split = function (text) {
        var pos1 = text.indexOf('://');
        if (pos1 > 0) {
            return [text]
        } else {
            pos1 = text.indexOf(':') + 1
        }
        var array = [];
        var pos2 = text.indexOf(';', pos1);
        if (pos2 > pos1) {
            array.push(text.substring(pos1, pos2));
            pos1 = pos2 + 1
        }
        pos2 = text.indexOf(',', pos1);
        if (pos2 > pos1) {
            array.unshift(text.substring(pos1, pos2));
            pos1 = pos2 + 1
        }
        if (pos1 === 0) {
            array.unshift(text)
        } else {
            array.unshift(text.substring(pos1))
        }
        return array
    };
    var decode = function (data, defaultKey) {
        var text;
        if (Interface.conforms(data, Mapper)) {
            return data.toMap()
        } else if (Interface.conforms(data, Stringer)) {
            text = data.toString()
        } else if (IObject.isString(data)) {
            text = data
        } else {
            return data
        }
        if (text.length === 0) {
            return null
        } else if (text.charAt(0) === '{' && text.charAt(text.length - 1) === '}') {
            ns.type.JSON.decode(text)
        }
        var info = {};
        var array = split(text);
        var size = array.length;
        if (size === 1) {
            info[defaultKey] = array[0]
        } else {
            info['data'] = array[0];
            info['algorithm'] = array[1];
            if (size > 2) {
                info['content-type'] = array[2];
                if (text.length > 5 && text.substring(0, 5) === 'data:') {
                    info['URL'] = text
                }
            }
        }
        return info
    };
    var GeneralFactory = function () {
        this.__tedFactories = {};
        this.__pnfFactory = null
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.getDataAlgorithm = function (ted, defaultValue) {
        return Converter.getString(ted['algorithm'], defaultValue)
    };
    GeneralFactory.prototype.setTransportableDataFactory = function (algorithm, factory) {
        this.__tedFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getTransportableDataFactory = function (algorithm) {
        return this.__tedFactories[algorithm]
    };
    GeneralFactory.prototype.createTransportableData = function (algorithm, data) {
        var factory = this.getTransportableDataFactory(algorithm);
        return factory.createTransportableData(data)
    };
    GeneralFactory.prototype.parseTransportableData = function (ted) {
        if (!ted) {
            return null
        } else if (Interface.conforms(ted, TransportableData)) {
            return ted
        }
        var info = decode(ted, 'data');
        if (!info) {
            return null
        }
        var algorithm = this.getDataAlgorithm(info, '*');
        var factory = this.getTransportableDataFactory(algorithm);
        if (!factory) {
            factory = this.getTransportableDataFactory('*')
        }
        return factory.parseTransportableData(info)
    };
    GeneralFactory.prototype.setPortableNetworkFileFactory = function (factory) {
        this.__pnfFactory = factory
    };
    GeneralFactory.prototype.getPortableNetworkFileFactory = function () {
        return this.__pnfFactory
    };
    GeneralFactory.prototype.createPortableNetworkFile = function (ted, filename, url, password) {
        var factory = this.getPortableNetworkFileFactory();
        return factory.createPortableNetworkFile(ted, filename, url, password)
    };
    GeneralFactory.prototype.parsePortableNetworkFile = function (pnf) {
        if (!pnf) {
            return null
        } else if (Interface.conforms(pnf, PortableNetworkFile)) {
            return pnf
        }
        var info = decode(pnf, 'URL');
        if (!info) {
            return null
        }
        var factory = this.getPortableNetworkFileFactory();
        return factory.parsePortableNetworkFile(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.format.FormatGeneralFactory = GeneralFactory;
    ns.format.FormatFactoryManager = FactoryManager
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var CryptographyKey = Interface(null, [Mapper]);
    CryptographyKey.prototype.getAlgorithm = function () {
    };
    CryptographyKey.prototype.getData = function () {
    };
    var EncryptKey = Interface(null, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext, extra) {
    };
    var DecryptKey = Interface(null, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext, params) {
    };
    DecryptKey.prototype.matchEncryptKey = function (pKey) {
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = Interface(null, [CryptographyKey]);
    AsymmetricKey.RSA = 'RSA';
    AsymmetricKey.ECC = 'ECC';
    var SignKey = Interface(null, [AsymmetricKey]);
    SignKey.prototype.sign = function (data) {
    };
    var VerifyKey = Interface(null, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
    };
    VerifyKey.prototype.matchSignKey = function (sKey) {
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = Interface(null, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = 'AES';
    SymmetricKey.DES = 'DES';
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    SymmetricKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generateSymmetricKey(algorithm)
    };
    SymmetricKey.parse = function (key) {
        var gf = general_factory();
        return gf.parseSymmetricKey(key)
    };
    SymmetricKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setSymmetricKeyFactory(algorithm, factory)
    };
    SymmetricKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getSymmetricKeyFactory(algorithm)
    };
    var SymmetricKeyFactory = Interface(null, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    ns.crypto.SymmetricKey = SymmetricKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = Interface(null, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    PublicKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePublicKey(key)
    };
    PublicKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPublicKeyFactory(algorithm, factory)
    };
    PublicKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPublicKeyFactory(algorithm)
    };
    var PublicKeyFactory = Interface(null, null);
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
    };
    PublicKey.Factory = PublicKeyFactory;
    ns.crypto.PublicKey = PublicKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = Interface(null, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function () {
    };
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    PrivateKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generatePrivateKey(algorithm)
    };
    PrivateKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePrivateKey(key)
    };
    PrivateKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPrivateKeyFactory(algorithm, factory)
    };
    PrivateKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPrivateKeyFactory(algorithm)
    };
    var PrivateKeyFactory = Interface(null, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
    };
    PrivateKey.Factory = PrivateKeyFactory;
    ns.crypto.PrivateKey = PrivateKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;
    var promise = 'Moky loves May Lee forever!';
    var get_promise = function () {
        if (typeof promise === 'string') {
            promise = ns.format.UTF8.encode(promise)
        }
        return promise
    };
    var GeneralFactory = function () {
        this.__symmetricKeyFactories = {};
        this.__publicKeyFactories = {};
        this.__privateKeyFactories = {}
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.matchSignKey = function (sKey, pKey) {
        var data = get_promise();
        var signature = sKey.sign(data);
        return pKey.verify(data, signature)
    };
    GeneralFactory.prototype.matchEncryptKey = function (pKey, sKey) {
        var data = get_promise();
        var extra_params = {};
        var ciphertext = pKey.encrypt(data, extra_params);
        var plaintext = sKey.decrypt(ciphertext, extra_params);
        if (!plaintext || plaintext.length !== data.length) {
            return false
        }
        for (var i = 0; i < data.length; ++i) {
            if (plaintext[i] !== data[i]) {
                return false
            }
        }
        return true
    };
    GeneralFactory.prototype.getAlgorithm = function (key, defaultValue) {
        return Converter.getString(key['algorithm'], defaultValue)
    };
    GeneralFactory.prototype.setSymmetricKeyFactory = function (algorithm, factory) {
        this.__symmetricKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getSymmetricKeyFactory = function (algorithm) {
        return this.__symmetricKeyFactories[algorithm]
    };
    GeneralFactory.prototype.generateSymmetricKey = function (algorithm) {
        var factory = this.getSymmetricKeyFactory(algorithm);
        return factory.generateSymmetricKey()
    };
    GeneralFactory.prototype.parseSymmetricKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, SymmetricKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info, '*');
        var factory = this.getSymmetricKeyFactory(algorithm);
        if (!factory) {
            factory = this.getSymmetricKeyFactory('*')
        }
        return factory.parseSymmetricKey(info)
    };
    GeneralFactory.prototype.setPrivateKeyFactory = function (algorithm, factory) {
        this.__privateKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getPrivateKeyFactory = function (algorithm) {
        return this.__privateKeyFactories[algorithm]
    };
    GeneralFactory.prototype.generatePrivateKey = function (algorithm) {
        var factory = this.getPrivateKeyFactory(algorithm);
        return factory.generatePrivateKey()
    };
    GeneralFactory.prototype.parsePrivateKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, PrivateKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info, '*');
        var factory = this.getPrivateKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPrivateKeyFactory('*')
        }
        return factory.parsePrivateKey(info)
    };
    GeneralFactory.prototype.setPublicKeyFactory = function (algorithm, factory) {
        this.__publicKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getPublicKeyFactory = function (algorithm) {
        return this.__publicKeyFactories[algorithm]
    };
    GeneralFactory.prototype.parsePublicKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, PublicKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info, '*');
        var factory = this.getPublicKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPublicKeyFactory('*')
        }
        return factory.parsePublicKey(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.crypto.CryptographyKeyGeneralFactory = GeneralFactory;
    ns.crypto.CryptographyKeyFactoryManager = FactoryManager
})(MONKEY);
if (typeof MingKeMing !== 'object') {
    MingKeMing = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {}
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = {}
    }
})(MingKeMing);
(function (ns) {
    'use strict';
    var EntityType = ns.type.Enum('EntityType', {
        USER: (0x00),
        GROUP: (0x01),
        STATION: (0x02),
        ISP: (0x03),
        BOT: (0x04),
        ICP: (0x05),
        SUPERVISOR: (0x06),
        COMPANY: (0x07),
        ANY: (0x80),
        EVERY: (0x81)
    });
    EntityType.isUser = function (network) {
        var user = EntityType.USER.getValue();
        var group = EntityType.GROUP.getValue();
        return (network & group) === user
    };
    EntityType.isGroup = function (network) {
        var group = EntityType.GROUP.getValue();
        return (network & group) === group
    };
    EntityType.isBroadcast = function (network) {
        var any = EntityType.ANY.getValue();
        return (network & any) === any
    };
    ns.protocol.EntityType = EntityType
})(MingKeMing);
(function (ns) {
    'use strict';
    var MetaType = ns.type.Enum('MetaType', {
        DEFAULT: (0x01),
        MKM: (0x01),
        BTC: (0x02),
        ExBTC: (0x03),
        ETH: (0x04),
        ExETH: (0x05)
    });
    MetaType.hasSeed = function (version) {
        var mkm = MetaType.MKM.getValue();
        return (version & mkm) === mkm
    };
    ns.protocol.MetaType = MetaType
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = Interface(null, [Stringer]);
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.prototype.getType = function () {
    };
    Address.prototype.isBroadcast = function () {
    };
    Address.prototype.isUser = function () {
    };
    Address.prototype.isGroup = function () {
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Address.generate = function (meta, network) {
        var gf = general_factory();
        return gf.generateAddress(meta, network)
    };
    Address.create = function (address) {
        var gf = general_factory();
        return gf.createAddress(address)
    };
    Address.parse = function (address) {
        var gf = general_factory();
        return gf.parseAddress(address)
    };
    Address.setFactory = function (factory) {
        var gf = general_factory();
        gf.setAddressFactory(factory)
    };
    Address.getFactory = function () {
        var gf = general_factory();
        return gf.getAddressFactory()
    };
    var AddressFactory = Interface(null, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
    };
    AddressFactory.prototype.createAddress = function (address) {
    };
    AddressFactory.prototype.parseAddress = function (address) {
    };
    Address.Factory = AddressFactory;
    ns.protocol.Address = Address
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var ID = Interface(null, [Stringer]);
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.prototype.getName = function () {
    };
    ID.prototype.getAddress = function () {
    };
    ID.prototype.getTerminal = function () {
    };
    ID.prototype.getType = function () {
    };
    ID.prototype.isBroadcast = function () {
    };
    ID.prototype.isUser = function () {
    };
    ID.prototype.isGroup = function () {
    };
    ID.convert = function (list) {
        var gf = general_factory();
        return gf.convertIdentifiers(list)
    };
    ID.revert = function (list) {
        var gf = general_factory();
        return gf.revertIdentifiers(list)
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    ID.generate = function (meta, network, terminal) {
        var gf = general_factory();
        return gf.generateIdentifier(meta, network, terminal)
    };
    ID.create = function (name, address, terminal) {
        var gf = general_factory();
        return gf.createIdentifier(name, address, terminal)
    };
    ID.parse = function (identifier) {
        var gf = general_factory();
        return gf.parseIdentifier(identifier)
    };
    ID.setFactory = function (factory) {
        var gf = general_factory();
        gf.setIdentifierFactory(factory)
    };
    ID.getFactory = function () {
        var gf = general_factory();
        return gf.getIdentifierFactory()
    };
    var IDFactory = Interface(null, null);
    IDFactory.prototype.generateIdentifier = function (meta, network, terminal) {
    };
    IDFactory.prototype.createIdentifier = function (name, address, terminal) {
    };
    IDFactory.prototype.parseIdentifier = function (identifier) {
    };
    ID.Factory = IDFactory;
    ns.protocol.ID = ID
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Meta = Interface(null, [Mapper]);
    Meta.prototype.getType = function () {
    };
    Meta.prototype.getPublicKey = function () {
    };
    Meta.prototype.getSeed = function () {
    };
    Meta.prototype.getFingerprint = function () {
    };
    Meta.prototype.generateAddress = function (network) {
    };
    Meta.prototype.isValid = function () {
    };
    Meta.prototype.matchIdentifier = function (identifier) {
    };
    Meta.prototype.matchPublicKey = function (pKey) {
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Meta.create = function (version, key, seed, fingerprint) {
        var gf = general_factory();
        return gf.createMeta(version, key, seed, fingerprint)
    };
    Meta.generate = function (version, sKey, seed) {
        var gf = general_factory();
        return gf.generateMeta(version, sKey, seed)
    };
    Meta.parse = function (meta) {
        var gf = general_factory();
        return gf.parseMeta(meta)
    };
    Meta.setFactory = function (version, factory) {
        var gf = general_factory();
        gf.setMetaFactory(version, factory)
    };
    Meta.getFactory = function (version) {
        var gf = general_factory();
        return gf.getMetaFactory(version)
    };
    var MetaFactory = Interface(null, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
    };
    MetaFactory.prototype.parseMeta = function (meta) {
    };
    Meta.Factory = MetaFactory;
    ns.protocol.Meta = Meta
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var TAI = Interface(null, null);
    TAI.prototype.isValid = function () {
    };
    TAI.prototype.verify = function (pKey) {
    };
    TAI.prototype.sign = function (sKey) {
    };
    TAI.prototype.allProperties = function () {
    };
    TAI.prototype.getProperty = function (name) {
    };
    TAI.prototype.setProperty = function (name, value) {
    };
    ns.protocol.TAI = TAI
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var Document = Interface(null, [TAI, Mapper]);
    Document.VISA = 'visa';
    Document.PROFILE = 'profile';
    Document.BULLETIN = 'bulletin';
    Document.prototype.getType = function () {
    };
    Document.prototype.getIdentifier = function () {
    };
    Document.prototype.getTime = function () {
    };
    Document.prototype.setName = function (name) {
    };
    Document.prototype.getName = function () {
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Document.create = function (type, identifier, data, signature) {
        var gf = general_factory();
        return gf.createDocument(type, identifier, data, signature)
    };
    Document.parse = function (doc) {
        var gf = general_factory();
        return gf.parseDocument(doc)
    };
    Document.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setDocumentFactory(type, factory)
    };
    Document.getFactory = function (type) {
        var gf = general_factory();
        return gf.getDocumentFactory(type)
    };
    var DocumentFactory = Interface(null, null);
    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
    };
    Document.Factory = DocumentFactory;
    ns.protocol.Document = Document
})(MingKeMing);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var ConstantString = ns.type.ConstantString;
    var EntityType = ns.protocol.EntityType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        this.__network = Enum.getInt(network)
    };
    Class(BroadcastAddress, ConstantString, [Address], null);
    BroadcastAddress.prototype.getType = function () {
        return this.__network
    };
    BroadcastAddress.prototype.isBroadcast = function () {
        return true
    };
    BroadcastAddress.prototype.isUser = function () {
        var any = EntityType.ANY.getValue();
        return this.__network === any
    };
    BroadcastAddress.prototype.isGroup = function () {
        var every = EntityType.EVERY.getValue();
        return this.__network === every
    };
    Address.ANYWHERE = new BroadcastAddress('anywhere', EntityType.ANY);
    Address.EVERYWHERE = new BroadcastAddress('everywhere', EntityType.EVERY);
    ns.mkm.BroadcastAddress = BroadcastAddress
})(MingKeMing);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal
    };
    Class(Identifier, ConstantString, [ID], null);
    Identifier.prototype.getName = function () {
        return this.__name
    };
    Identifier.prototype.getAddress = function () {
        return this.__address
    };
    Identifier.prototype.getTerminal = function () {
        return this.__terminal
    };
    Identifier.prototype.getType = function () {
        return this.getAddress().getType()
    };
    Identifier.prototype.isBroadcast = function () {
        return this.getAddress().isBroadcast()
    };
    Identifier.prototype.isUser = function () {
        return this.getAddress().isUser()
    };
    Identifier.prototype.isGroup = function () {
        return this.getAddress().isGroup()
    };
    ID.ANYONE = new Identifier("anyone@anywhere", "anyone", Address.ANYWHERE, null);
    ID.EVERYONE = new Identifier("everyone@everywhere", "everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = new Identifier("moky@anywhere", "moky", Address.ANYWHERE, null);
    ns.mkm.Identifier = Identifier
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};
        this.__documentFactories = {}
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.setAddressFactory = function (factory) {
        this.__addressFactory = factory
    };
    GeneralFactory.prototype.getAddressFactory = function () {
        return this.__addressFactory
    };
    GeneralFactory.prototype.parseAddress = function (address) {
        if (!address) {
            return null
        } else if (Interface.conforms(address, Address)) {
            return address
        }
        var str = Wrapper.fetchString(address);
        var factory = this.getAddressFactory();
        return factory.parseAddress(str)
    };
    GeneralFactory.prototype.createAddress = function (address) {
        var factory = this.getAddressFactory();
        return factory.createAddress(address)
    };
    GeneralFactory.prototype.generateAddress = function (meta, network) {
        var factory = this.getAddressFactory();
        return factory.generateAddress(meta, network)
    };
    GeneralFactory.prototype.setIdentifierFactory = function (factory) {
        this.__idFactory = factory
    };
    GeneralFactory.prototype.getIdentifierFactory = function () {
        return this.__idFactory
    };
    GeneralFactory.prototype.parseIdentifier = function (identifier) {
        if (!identifier) {
            return null
        } else if (Interface.conforms(identifier, ID)) {
            return identifier
        }
        var str = Wrapper.fetchString(identifier);
        var factory = this.getIdentifierFactory();
        return factory.parseIdentifier(str)
    };
    GeneralFactory.prototype.createIdentifier = function (name, address, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.createIdentifier(name, address, terminal)
    }
    GeneralFactory.prototype.generateIdentifier = function (meta, network, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.generateIdentifier(meta, network, terminal)
    };
    GeneralFactory.prototype.convertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id)
            }
        }
        return array
    }
    GeneralFactory.prototype.revertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString())
            } else if (typeof id === 'string') {
                array.push(id)
            }
        }
        return array
    };
    GeneralFactory.prototype.setMetaFactory = function (version, factory) {
        version = Enum.getInt(version);
        this.__metaFactories[version] = factory
    };
    GeneralFactory.prototype.getMetaFactory = function (version) {
        version = Enum.getInt(version);
        return this.__metaFactories[version]
    };
    GeneralFactory.prototype.getMetaType = function (meta, defaultVersion) {
        var version = meta['type'];
        return Converter.getInt(version, defaultVersion)
    };
    GeneralFactory.prototype.createMeta = function (version, key, seed, fingerprint) {
        var factory = this.getMetaFactory(version);
        return factory.createMeta(key, seed, fingerprint)
    };
    GeneralFactory.prototype.generateMeta = function (version, sKey, seed) {
        var factory = this.getMetaFactory(version);
        return factory.generateMeta(sKey, seed)
    };
    GeneralFactory.prototype.parseMeta = function (meta) {
        if (!meta) {
            return null
        } else if (Interface.conforms(meta, Meta)) {
            return meta
        }
        var info = Wrapper.fetchMap(meta);
        if (!info) {
            return null
        }
        var type = this.getMetaType(info, 0);
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory(0)
        }
        return factory.parseMeta(info)
    };
    GeneralFactory.prototype.setDocumentFactory = function (type, factory) {
        this.__documentFactories[type] = factory
    };
    GeneralFactory.prototype.getDocumentFactory = function (type) {
        return this.__documentFactories[type]
    };
    GeneralFactory.prototype.getDocumentType = function (doc, defaultType) {
        return Converter.getString(doc['type'], defaultType)
    };
    GeneralFactory.prototype.createDocument = function (type, identifier, data, signature) {
        var factory = this.getDocumentFactory(type);
        return factory.createDocument(identifier, data, signature)
    };
    GeneralFactory.prototype.parseDocument = function (doc) {
        if (!doc) {
            return null
        } else if (Interface.conforms(doc, Document)) {
            return doc
        }
        var info = Wrapper.fetchMap(doc);
        if (!info) {
            return null
        }
        var type = this.getDocumentType(info, '*');
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory('*')
        }
        return factory.parseDocument(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.mkm.AccountGeneralFactory = GeneralFactory;
    ns.mkm.AccountFactoryManager = FactoryManager
})(MingKeMing);
if (typeof DaoKeDao !== 'object') {
    DaoKeDao = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = MingKeMing.protocol
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = MingKeMing.mkm
    }
    if (typeof ns.dkd !== 'object') {
        ns.dkd = {}
    }
})(DaoKeDao);
(function (ns) {
    'use strict';
    var ContentType = ns.type.Enum('ContentType', {
        TEXT: (0x01),
        FILE: (0x10),
        IMAGE: (0x12),
        AUDIO: (0x14),
        VIDEO: (0x16),
        PAGE: (0x20),
        NAME_CARD: (0x33),
        QUOTE: (0x37),
        MONEY: (0x40),
        TRANSFER: (0x41),
        LUCKY_MONEY: (0x42),
        CLAIM_PAYMENT: (0x48),
        SPLIT_BILL: (0x49),
        COMMAND: (0x88),
        HISTORY: (0x89),
        APPLICATION: (0xA0),
        ARRAY: (0xCA),
        CUSTOMIZED: (0xCC),
        FORWARD: (0xFF)
    });
    ns.protocol.ContentType = ContentType
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Content = Interface(null, [Mapper]);
    Content.prototype.getType = function () {
    };
    Content.prototype.getSerialNumber = function () {
    };
    Content.prototype.getTime = function () {
    };
    Content.prototype.setGroup = function (identifier) {
    };
    Content.prototype.getGroup = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.MessageFactoryManager;
        return man.generalFactory
    };
    Content.parse = function (content) {
        var gf = general_factory();
        return gf.parseContent(content)
    };
    Content.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setContentFactory(type, factory)
    };
    Content.getFactory = function (type) {
        var gf = general_factory();
        return gf.getContentFactory(type)
    };
    var ContentFactory = Interface(null, null);
    ContentFactory.prototype.parseContent = function (content) {
    };
    Content.Factory = ContentFactory;
    ns.protocol.Content = Content
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Envelope = Interface(null, [Mapper]);
    Envelope.prototype.getSender = function () {
    };
    Envelope.prototype.getReceiver = function () {
    };
    Envelope.prototype.getTime = function () {
    };
    Envelope.prototype.setGroup = function (identifier) {
    };
    Envelope.prototype.getGroup = function () {
    };
    Envelope.prototype.setType = function (type) {
    };
    Envelope.prototype.getType = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.MessageFactoryManager;
        return man.generalFactory
    };
    Envelope.create = function (from, to, when) {
        var gf = general_factory();
        return gf.createEnvelope(from, to, when)
    };
    Envelope.parse = function (env) {
        var gf = general_factory();
        return gf.parseEnvelope(env)
    };
    Envelope.getFactory = function () {
        var gf = general_factory();
        return gf.getEnvelopeFactory()
    }
    Envelope.setFactory = function (factory) {
        var gf = general_factory();
        gf.setEnvelopeFactory(factory)
    };
    var EnvelopeFactory = Interface(null, null);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
    };
    Envelope.Factory = EnvelopeFactory;
    ns.protocol.Envelope = Envelope
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Message = Interface(null, [Mapper]);
    Message.prototype.getEnvelope = function () {
    };
    Message.prototype.getSender = function () {
    };
    Message.prototype.getReceiver = function () {
    };
    Message.prototype.getTime = function () {
    };
    Message.prototype.getGroup = function () {
    };
    Message.prototype.getType = function () {
    };
    ns.protocol.Message = Message
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Message = ns.protocol.Message;
    var InstantMessage = Interface(null, [Message]);
    InstantMessage.prototype.getContent = function () {
    };
    InstantMessage.prototype.setContent = function (body) {
    };
    var general_factory = function () {
        var man = ns.dkd.MessageFactoryManager;
        return man.generalFactory
    };
    InstantMessage.generateSerialNumber = function (type, now) {
        var gf = general_factory();
        return gf.generateSerialNumber(type, now)
    };
    InstantMessage.create = function (head, body) {
        var gf = general_factory();
        return gf.createInstantMessage(head, body)
    };
    InstantMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseInstantMessage(msg)
    };
    InstantMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getInstantMessageFactory()
    };
    InstantMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setInstantMessageFactory(factory)
    };
    var InstantMessageFactory = Interface(null, null);
    InstantMessageFactory.prototype.generateSerialNumber = function (msgType, now) {
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
    };
    InstantMessage.Factory = InstantMessageFactory;
    ns.protocol.InstantMessage = InstantMessage
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Message = ns.protocol.Message;
    var SecureMessage = Interface(null, [Message]);
    SecureMessage.prototype.getData = function () {
    };
    SecureMessage.prototype.getEncryptedKey = function () {
    };
    SecureMessage.prototype.getEncryptedKeys = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.MessageFactoryManager;
        return man.generalFactory
    };
    SecureMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseSecureMessage(msg)
    };
    SecureMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getSecureMessageFactory()
    };
    SecureMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setSecureMessageFactory(factory)
    };
    var SecureMessageFactory = Interface(null, null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
    };
    SecureMessage.Factory = SecureMessageFactory;
    ns.protocol.SecureMessage = SecureMessage
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = Interface(null, [SecureMessage]);
    ReliableMessage.prototype.getSignature = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.MessageFactoryManager;
        return man.generalFactory
    };
    ReliableMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseReliableMessage(msg)
    };
    ReliableMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getReliableMessageFactory()
    };
    ReliableMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setReliableMessageFactory(factory)
    };
    var ReliableMessageFactory = Interface(null, null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
    };
    ReliableMessage.Factory = ReliableMessageFactory;
    ns.protocol.ReliableMessage = ReliableMessage
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var InstantMessage = ns.protocol.InstantMessage;
    var InstantMessageDelegate = Interface(null, null);
    InstantMessageDelegate.prototype.serializeContent = function (content, pwd, iMsg) {
    };
    InstantMessageDelegate.prototype.encryptContent = function (data, pwd, iMsg) {
    };
    InstantMessageDelegate.prototype.serializeKey = function (pwd, iMsg) {
    };
    InstantMessageDelegate.prototype.encryptKey = function (data, receiver, iMsg) {
    };
    InstantMessage.Delegate = InstantMessageDelegate
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var SecureMessage = ns.protocol.SecureMessage;
    var SecureMessageDelegate = Interface(null, null);
    SecureMessageDelegate.prototype.decryptKey = function (data, receiver, sMsg) {
    };
    SecureMessageDelegate.prototype.deserializeKey = function (data, sMsg) {
    };
    SecureMessageDelegate.prototype.decryptContent = function (data, pwd, sMsg) {
    };
    SecureMessageDelegate.prototype.deserializeContent = function (data, pwd, sMsg) {
    };
    SecureMessageDelegate.prototype.signData = function (data, sMsg) {
    };
    SecureMessage.Delegate = SecureMessageDelegate
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ReliableMessageDelegate = Interface(null, null);
    ReliableMessageDelegate.prototype.verifyDataSignature = function (data, signature, rMsg) {
    };
    ReliableMessage.Delegate = ReliableMessageDelegate
})(DaoKeDao);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var Content = ns.protocol.Content;
    var Envelope = ns.protocol.Envelope;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var GeneralFactory = function () {
        this.__contentFactories = {};
        this.__envelopeFactory = null;
        this.__instantMessageFactory = null;
        this.__secureMessageFactory = null;
        this.__reliableMessageFactory = null
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.setContentFactory = function (type, factory) {
        type = Enum.getInt(type);
        this.__contentFactories[type] = factory
    };
    GeneralFactory.prototype.getContentFactory = function (type) {
        type = Enum.getInt(type);
        return this.__contentFactories[type]
    };
    GeneralFactory.prototype.getContentType = function (content, defaultType) {
        return Converter.getInt(content['type'], defaultType)
    };
    GeneralFactory.prototype.parseContent = function (content) {
        if (!content) {
            return null
        } else if (Interface.conforms(content, Content)) {
            return content
        }
        var info = Wrapper.fetchMap(content);
        if (!info) {
            return null
        }
        var type = this.getContentType(info, 0);
        var factory = this.getContentFactory(type);
        if (!factory) {
            factory = this.getContentFactory(0)
        }
        return factory.parseContent(info)
    };
    GeneralFactory.prototype.setEnvelopeFactory = function (factory) {
        this.__envelopeFactory = factory
    };
    GeneralFactory.prototype.getEnvelopeFactory = function () {
        return this.__envelopeFactory
    };
    GeneralFactory.prototype.createEnvelope = function (from, to, when) {
        var factory = this.getEnvelopeFactory();
        return factory.createEnvelope(from, to, when)
    };
    GeneralFactory.prototype.parseEnvelope = function (env) {
        if (!env) {
            return null
        } else if (Interface.conforms(env, Envelope)) {
            return env
        }
        var info = Wrapper.fetchMap(env);
        if (!info) {
            return null
        }
        var factory = this.getEnvelopeFactory();
        return factory.parseEnvelope(info)
    };
    GeneralFactory.prototype.setInstantMessageFactory = function (factory) {
        this.__instantMessageFactory = factory
    };
    GeneralFactory.prototype.getInstantMessageFactory = function () {
        return this.__instantMessageFactory
    };
    GeneralFactory.prototype.createInstantMessage = function (head, body) {
        var factory = this.getInstantMessageFactory();
        return factory.createInstantMessage(head, body)
    };
    GeneralFactory.prototype.parseInstantMessage = function (msg) {
        if (!msg) {
            return null
        } else if (Interface.conforms(msg, InstantMessage)) {
            return msg
        }
        var info = Wrapper.fetchMap(msg);
        if (!info) {
            return null
        }
        var factory = this.getInstantMessageFactory();
        return factory.parseInstantMessage(info)
    };
    GeneralFactory.prototype.generateSerialNumber = function (type, now) {
        var factory = this.getInstantMessageFactory();
        return factory.generateSerialNumber(type, now)
    };
    GeneralFactory.prototype.setSecureMessageFactory = function (factory) {
        this.__secureMessageFactory = factory
    };
    GeneralFactory.prototype.getSecureMessageFactory = function () {
        return this.__secureMessageFactory
    };
    GeneralFactory.prototype.parseSecureMessage = function (msg) {
        if (!msg) {
            return null
        } else if (Interface.conforms(msg, SecureMessage)) {
            return msg
        }
        var info = Wrapper.fetchMap(msg);
        if (!info) {
            return null
        }
        var factory = this.getSecureMessageFactory();
        return factory.parseSecureMessage(info)
    };
    GeneralFactory.prototype.setReliableMessageFactory = function (factory) {
        this.__reliableMessageFactory = factory
    };
    GeneralFactory.prototype.getReliableMessageFactory = function () {
        return this.__reliableMessageFactory
    };
    GeneralFactory.prototype.parseReliableMessage = function (msg) {
        if (!msg) {
            return null
        } else if (Interface.conforms(msg, ReliableMessage)) {
            return msg
        }
        var info = Wrapper.fetchMap(msg);
        if (!info) {
            return null
        }
        var factory = this.getReliableMessageFactory();
        return factory.parseReliableMessage(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.dkd.MessageGeneralFactory = GeneralFactory;
    ns.dkd.MessageFactoryManager = FactoryManager
})(DaoKeDao);
if (typeof DIMP !== "object") {
    DIMP = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = MingKeMing.protocol
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = MingKeMing.mkm
    }
    if (typeof ns.dkd !== 'object') {
        ns.dkd = DaoKeDao.dkd
    }
    if (typeof ns.protocol.group !== 'object') {
        ns.protocol.group = {}
    }
    if (typeof ns.dkd.cmd !== 'object') {
        ns.dkd.cmd = {}
    }
    if (typeof ns.msg !== 'object') {
        ns.msg = {}
    }
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    var getKeyAlgorithm = function (key) {
        var gf = general_factory();
        return gf.getAlgorithm(key, '')
    };
    var matchSymmetricKeys = function (pKey, sKey) {
        var gf = general_factory();
        return gf.matchEncryptKey(pKey, sKey)
    };
    var matchAsymmetricKeys = function (sKey, pKey) {
        var gf = general_factory();
        return gf.matchSignKey(sKey, pKey)
    };
    var symmetricKeyEquals = function (a, b) {
        if (a === b) {
            return true
        }
        return matchSymmetricKeys(a, b)
    };
    var privateKeyEquals = function (a, b) {
        if (a === b) {
            return true
        }
        return matchAsymmetricKeys(a, b.publicKey)
    };
    var BaseKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseKey, Dictionary, [CryptographyKey], {
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    BaseKey.getKeyAlgorithm = getKeyAlgorithm;
    BaseKey.matchEncryptKey = matchSymmetricKeys;
    BaseKey.matchSignKey = matchAsymmetricKeys;
    BaseKey.symmetricKeyEquals = symmetricKeyEquals;
    BaseKey.privateKeyEquals = privateKeyEquals;
    var BaseSymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseSymmetricKey, Dictionary, [SymmetricKey], {
        equals: function (other) {
            return Interface.conforms(other, SymmetricKey) && symmetricKeyEquals(other, this)
        }, matchEncryptKey: function (pKey) {
            return matchSymmetricKeys(pKey, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BaseAsymmetricKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey], {
        getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BasePrivateKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BasePrivateKey, Dictionary, [PrivateKey], {
        equals: function (other) {
            return Interface.conforms(other, PrivateKey) && privateKeyEquals(other, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    var BasePublicKey = function (dict) {
        Dictionary.call(this, dict)
    };
    Class(BasePublicKey, Dictionary, [PublicKey], {
        matchSignKey: function (sKey) {
            return matchAsymmetricKeys(sKey, this)
        }, getAlgorithm: function () {
            return getKeyAlgorithm(this.toMap())
        }
    });
    ns.crypto.BaseKey = BaseKey;
    ns.crypto.BaseSymmetricKey = BaseSymmetricKey;
    ns.crypto.BaseAsymmetricKey = BaseAsymmetricKey;
    ns.crypto.BasePrivateKey = BasePrivateKey;
    ns.crypto.BasePublicKey = BasePublicKey
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var Base64 = ns.format.Base64;
    var Base58 = ns.format.Base58;
    var Hex = ns.format.Hex;
    var BaseDataWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__data = null
    };
    Class(BaseDataWrapper, Dictionary, null, {
        isEmpty: function () {
            if (Dictionary.prototype.isEmpty.call(this)) {
                return true
            }
            var bin = this.__data;
            return bin === null || bin.length === 0
        }, toString: function () {
            var encoded = this.getString('data', '');
            if (encoded.length === 0) {
                return encoded
            }
            var alg = this.getString('algorithm', '');
            if (alg === TransportableData.DEFAULT) {
                alg = ''
            }
            if (alg === '') {
                return encoded
            } else {
                return alg + ',' + encoded
            }
        }, encode: function (mimeType) {
            var encoded = this.getString('data', '');
            if (encoded.length === 0) {
                return encoded
            }
            var alg = this.getAlgorithm();
            return 'data:' + mimeType + ';' + alg + ',' + encoded
        }, getAlgorithm: function () {
            var alg = this.getString('algorithm', '');
            if (alg === '') {
                alg = TransportableData.DEFAULT
            }
            return alg
        }, setAlgorithm: function (name) {
            if (!name) {
                this.removeValue('algorithm')
            } else {
                this.setValue('algorithm', name)
            }
        }, getData: function () {
            var bin = this.__data;
            if (!bin) {
                var encoded = this.getString('data', '');
                if (encoded.length > 0) {
                    var alg = this.getAlgorithm();
                    if (alg === TransportableData.BASE64) {
                        bin = Base64.decode(encoded)
                    } else if (alg === TransportableData.BASE58) {
                        bin = Base58.decode(encoded)
                    } else if (alg === TransportableData.HEX) {
                        bin = Hex.decode(encoded)
                    }
                }
            }
            return bin
        }, setData: function (bin) {
            if (!bin) {
                this.removeValue('data')
            } else {
                var encoded = '';
                var alg = this.getAlgorithm();
                if (alg === TransportableData.BASE64) {
                    encoded = Base64.encode(bin)
                } else if (alg === TransportableData.BASE58) {
                    encoded = Base58.encode(bin)
                } else if (alg === TransportableData.HEX) {
                    encoded = Hex.encode(bin)
                }
                this.setValue('data', encoded)
            }
            this.__data = bin
        }
    });
    ns.format.BaseDataWrapper = BaseDataWrapper
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var BaseFileWrapper = function (dict) {
        Dictionary.call(this, dict);
        this.__attachment = null;
        this.__password = null
    };
    Class(BaseFileWrapper, Dictionary, null, {
        getData: function () {
            var ted = this.__attachment;
            if (!ted) {
                var base64 = this.getValue('data');
                ted = TransportableData.parse(base64);
                this.__attachment = ted
            }
            return ted
        }, setData: function (ted) {
            if (!ted) {
                this.removeValue('data')
            } else {
                this.setValue('data', ted.toObject())
            }
            this.__attachment = ted
        }, setBinaryData: function (bin) {
            if (!bin) {
                this.setData(null)
            } else {
                this.setData(TransportableData.create(bin))
            }
        }, getFilename: function () {
            return this.getString('filename', null)
        }, setFilename: function (filename) {
            if (!filename) {
                this.removeValue('filename')
            } else {
                this.setValue('filename', filename)
            }
        }, getURL: function () {
            return this.getString('URL', null)
        }, setURL: function (url) {
            if (!url) {
                this.removeValue('URL')
            } else {
                this.setValue('URL', url)
            }
        }, getPassword: function () {
            var pwd = this.__password;
            if (!pwd) {
                var key = this.getValue('password');
                pwd = SymmetricKey.parse(key);
                this.__password = pwd
            }
            return pwd
        }, setPassword: function (key) {
            if (!key) {
                this.removeValue('password')
            } else {
                this.setMap('password', key)
            }
            this.__password = key
        }
    });
    ns.format.BaseFileWrapper = BaseFileWrapper
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var TextContent = Interface(null, [Content]);
    TextContent.prototype.setText = function (text) {
    };
    TextContent.prototype.getText = function () {
    };
    TextContent.create = function (text) {
        return new ns.dkd.BaseTextContent(text)
    };
    var ArrayContent = Interface(null, [Content]);
    ArrayContent.prototype.getContents = function () {
    };
    ArrayContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item)
            }
        }
        return array
    };
    ArrayContent.revert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = contents[i];
            if (Interface.conforms(item, Content)) {
                array.push(item.toMap())
            } else {
                array.push(item)
            }
        }
        return array
    };
    ArrayContent.create = function (contents) {
        return new ns.dkd.ListContent(contents)
    };
    var ForwardContent = Interface(null, [Content]);
    ForwardContent.prototype.getForward = function () {
    };
    ForwardContent.prototype.getSecrets = function () {
    };
    ForwardContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg)
            }
        }
        return array
    };
    ForwardContent.revert = function (messages) {
        var array = [];
        var item;
        for (var i = 0; i < messages.length; ++i) {
            item = messages[i];
            if (Interface.conforms(item, ReliableMessage)) {
                array.push(item.toMap())
            } else {
                array.push(item)
            }
        }
        return array
    };
    ForwardContent.create = function (secrets) {
        return new ns.dkd.SecretContent(secrets)
    };
    var PageContent = Interface(null, [Content]);
    PageContent.prototype.setTitle = function (title) {
    };
    PageContent.prototype.getTitle = function () {
    };
    PageContent.prototype.setIcon = function (pnf) {
    };
    PageContent.prototype.getIcon = function () {
    };
    PageContent.prototype.setDesc = function (text) {
    };
    PageContent.prototype.getDesc = function () {
    };
    PageContent.prototype.getURL = function () {
    };
    PageContent.prototype.setURL = function (url) {
    };
    PageContent.prototype.getHTML = function () {
    };
    PageContent.prototype.setHTML = function (url) {
    };
    PageContent.create = function (info) {
        var content = new ns.dkd.WebPageContent();
        var title = info['title'];
        if (title) {
            content.setTitle(title)
        }
        var desc = info['desc'];
        if (desc) {
            content.setDesc(desc)
        }
        var url = info['URL'];
        if (url) {
            content.setURL(url)
        }
        var html = info['HTML'];
        if (html) {
            content.setHTML(html)
        }
        var icon = info['icon'];
        if (icon) {
            content.setIcon(icon)
        }
        return content
    };
    var NameCard = Interface(null, [Content]);
    NameCard.prototype.getIdentifier = function () {
    };
    NameCard.prototype.getName = function () {
    };
    NameCard.prototype.getAvatar = function () {
    };
    NameCard.create = function (identifier, mame, avatar) {
        var content = new ns.dkd.NameCardContent(identifier);
        content.setName(name);
        content.setAvatar(avatar);
        return content
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.ArrayContent = ArrayContent;
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.PageContent = PageContent;
    ns.protocol.NameCard = NameCard
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var FileContent = Interface(null, [Content]);
    FileContent.prototype.setData = function (data) {
    };
    FileContent.prototype.getData = function () {
    };
    FileContent.prototype.setFilename = function (filename) {
    };
    FileContent.prototype.getFilename = function () {
    };
    FileContent.prototype.setURL = function (url) {
    };
    FileContent.prototype.getURL = function () {
    };
    FileContent.prototype.setPassword = function (key) {
    };
    FileContent.prototype.getPassword = function () {
    };
    var init_content = function (content, data, filename, url, password) {
        if (data) {
            content.setTransportableData(data)
        }
        if (filename) {
            content.setFilename(filename)
        }
        if (url) {
            content.setURL(url)
        }
        if (password) {
            content.setPassword(password)
        }
        return content
    };
    FileContent.create = function (type, data, filename, url, password) {
        var content = new ns.dkd.BaseFileContent(type);
        return init_content(content, data, filename, url, password)
    };
    FileContent.file = function (data, filename, url, password) {
        var content = new ns.dkd.BaseFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.image = function (data, filename, url, password) {
        var content = new ns.dkd.ImageFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.audio = function (data, filename, url, password) {
        var content = new ns.dkd.AudioFileContent();
        return init_content(content, data, filename, url, password)
    };
    FileContent.video = function (data, filename, url, password) {
        var content = new ns.dkd.VideoFileContent();
        return init_content(content, data, filename, url, password)
    };
    ns.protocol.FileContent = FileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = Interface(null, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
    };
    ImageContent.prototype.getThumbnail = function () {
    };
    var VideoContent = Interface(null, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
    };
    VideoContent.prototype.getSnapshot = function () {
    };
    var AudioContent = Interface(null, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
    };
    AudioContent.prototype.getText = function () {
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.VideoContent = VideoContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var MoneyContent = Interface(null, [Content]);
    MoneyContent.prototype.getCurrency = function () {
    };
    MoneyContent.prototype.setAmount = function (amount) {
    };
    MoneyContent.prototype.getAmount = function () {
    };
    MoneyContent.create = function (type, currency, amount) {
        return new ns.dkd.BaseMoneyContent(type, currency, amount)
    };
    var TransferContent = Interface(null, [MoneyContent]);
    TransferContent.prototype.setRemitter = function (sender) {
    };
    TransferContent.prototype.getRemitter = function () {
    };
    TransferContent.prototype.setRemittee = function (receiver) {
    };
    TransferContent.prototype.getRemittee = function () {
    };
    TransferContent.create = function (currency, amount) {
        return new ns.dkd.TransferMoneyContent(currency, amount)
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var CustomizedContent = Interface(null, [Content]);
    CustomizedContent.prototype.getApplication = function () {
    };
    CustomizedContent.prototype.getModule = function () {
    };
    CustomizedContent.prototype.getAction = function () {
    };
    CustomizedContent.create = function () {
        var type, app, mod, act;
        if (arguments.length === 4) {
            type = arguments[0];
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3];
            return new ns.dkd.AppCustomizedContent(type, app, mod, act)
        } else if (arguments.length === 3) {
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2];
            return new ns.dkd.AppCustomizedContent(app, mod, act)
        } else {
            throw new SyntaxError('customized content arguments error: ' + arguments);
        }
    };
    ns.protocol.CustomizedContent = CustomizedContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var Command = Interface(null, [Content]);
    Command.META = 'meta';
    Command.DOCUMENT = 'document';
    Command.RECEIPT = 'receipt';
    Command.prototype.getCmd = function () {
    };
    var general_factory = function () {
        var man = ns.dkd.cmd.CommandFactoryManager;
        return man.generalFactory
    };
    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command)
    };
    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory)
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd)
    };
    var CommandFactory = Interface(null, null);
    CommandFactory.prototype.parseCommand = function (content) {
    };
    Command.Factory = CommandFactory;
    ns.protocol.Command = Command
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var MetaCommand = Interface(null, [Command]);
    MetaCommand.prototype.getIdentifier = function () {
    };
    MetaCommand.prototype.getMeta = function () {
    };
    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier)
    };
    MetaCommand.response = function (identifier, meta) {
        var command = new ns.dkd.cmd.BaseMetaCommand(identifier);
        command.setMeta(meta);
        return command
    };
    var DocumentCommand = Interface(null, [MetaCommand]);
    DocumentCommand.prototype.getDocument = function () {
    };
    DocumentCommand.prototype.getLastTime = function () {
    };
    DocumentCommand.query = function (identifier, lastTime) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        if (lastTime) {
            command.setLastTime(lastTime)
        }
        return command
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        var command = new ns.dkd.cmd.BaseDocumentCommand(identifier);
        command.setMeta(meta);
        command.setDocument(doc);
        return command
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.DocumentCommand = DocumentCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Command = ns.protocol.Command;
    var HistoryCommand = Interface(null, [Command]);
    HistoryCommand.REGISTER = 'register';
    HistoryCommand.SUICIDE = 'suicide';
    var GroupCommand = Interface(null, [HistoryCommand]);
    GroupCommand.FOUND = 'found';
    GroupCommand.ABDICATE = 'abdicate';
    GroupCommand.INVITE = 'invite';
    GroupCommand.EXPEL = 'expel';
    GroupCommand.JOIN = 'join';
    GroupCommand.QUIT = 'quit';
    GroupCommand.QUERY = 'query';
    GroupCommand.RESET = 'reset';
    GroupCommand.HIRE = 'hire';
    GroupCommand.FIRE = 'fire';
    GroupCommand.RESIGN = 'resign';
    GroupCommand.prototype.setMember = function (identifier) {
    };
    GroupCommand.prototype.getMember = function () {
    };
    GroupCommand.prototype.setMembers = function (members) {
    };
    GroupCommand.prototype.getMembers = function () {
    };
    GroupCommand.create = function (cmd, group, members) {
        var command = new ns.dkd.cmd.BaseGroupCommand(cmd, group);
        if (!members) {
        } else if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('group members error: ' + members);
        }
        return command
    };
    GroupCommand.invite = function (group, members) {
        var command = new ns.dkd.cmd.InviteGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('invite members error: ' + members);
        }
        return command
    };
    GroupCommand.expel = function (group, members) {
        var command = new ns.dkd.cmd.ExpelGroupCommand(group);
        if (members instanceof Array) {
            command.setMembers(members)
        } else if (Interface.conforms(members, ID)) {
            command.setMember(members)
        } else {
            throw new TypeError('expel members error: ' + members);
        }
        return command
    };
    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group)
    };
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group)
    };
    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group)
    };
    GroupCommand.reset = function (group, members) {
        var command = new ns.dkd.cmd.ResetGroupCommand(group, members);
        if (members instanceof Array) {
            command.setMembers(members)
        } else {
            throw new TypeError('reset members error: ' + members);
        }
        return command
    };
    var get_targets = function (info, batch, single) {
        var users = info[batch];
        if (users) {
            return ID.convert(users)
        }
        var usr = ID.parse(info[single]);
        if (usr) {
            return [usr]
        } else {
            return []
        }
    };
    GroupCommand.hire = function (group, targets) {
        var command = new ns.dkd.cmd.HireGroupCommand(group);
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins)
        }
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots)
        }
        return command
    };
    GroupCommand.fire = function (group, targets) {
        var command = new ns.dkd.cmd.FireGroupCommand(group);
        var admins = get_targets(targets, 'administrators', 'administrator');
        if (admins.length > 0) {
            command.setAdministrators(admins)
        }
        var bots = get_targets(targets, 'assistants', 'assistant');
        if (bots.length > 0) {
            command.setAssistants(bots)
        }
        return command
    };
    GroupCommand.resign = function (group) {
        return new ns.dkd.cmd.ResignGroupCommand(group)
    };
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.GroupCommand = GroupCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = Interface(null, [GroupCommand]);
    var JoinCommand = Interface(null, [GroupCommand]);
    var QuitCommand = Interface(null, [GroupCommand]);
    var ResetCommand = Interface(null, [GroupCommand]);
    var QueryCommand = Interface(null, [GroupCommand]);
    var HireCommand = Interface(null, [GroupCommand]);
    HireCommand.prototype.getAdministrators = function () {
    };
    HireCommand.prototype.setAdministrators = function (members) {
    };
    HireCommand.prototype.getAssistants = function () {
    };
    HireCommand.prototype.setAssistants = function (bots) {
    };
    var FireCommand = Interface(null, [GroupCommand]);
    FireCommand.prototype.getAdministrators = function () {
    };
    FireCommand.prototype.setAdministrators = function (members) {
    };
    FireCommand.prototype.getAssistants = function () {
    };
    FireCommand.prototype.setAssistants = function (bots) {
    };
    var ResignCommand = Interface(null, [GroupCommand]);
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.HireCommand = HireCommand;
    ns.protocol.group.FireCommand = FireCommand;
    ns.protocol.group.ResignCommand = ResignCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var ReceiptCommand = Interface(null, [Command]);
    ReceiptCommand.prototype.getText = function () {
    };
    ReceiptCommand.prototype.getOriginalEnvelope = function () {
    };
    ReceiptCommand.prototype.getOriginalSerialNumber = function () {
    };
    ReceiptCommand.prototype.getOriginalSignature = function () {
    };
    var purify = function (envelope) {
        var info = envelope.copyMap(false);
        if (info['data']) {
            delete info['data'];
            delete info['key'];
            delete info['keys'];
            delete info['meta'];
            delete info['visa']
        }
        return info
    };
    ReceiptCommand.create = function (text, head, body) {
        var info;
        if (!head) {
            info = null
        } else if (!body) {
            info = purify(head)
        } else {
            info = purify(head);
            info['sn'] = body.getSerialNumber()
        }
        var command = new ns.dkd.cmd.BaseReceiptCommand(text, info);
        if (body) {
            var group = body.getGroup();
            if (group) {
                command.setGroup(group)
            }
        }
        return command
    };
    ReceiptCommand.purify = purify;
    ns.protocol.ReceiptCommand = ReceiptCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Document = ns.protocol.Document;
    var Visa = Interface(null, [Document]);
    Visa.prototype.getPublicKey = function () {
    };
    Visa.prototype.setPublicKey = function (pKey) {
    };
    Visa.prototype.getAvatar = function () {
    };
    Visa.prototype.setAvatar = function (image) {
    };
    var Bulletin = Interface(null, [Document]);
    Bulletin.prototype.getFounder = function () {
    };
    Bulletin.prototype.getAssistants = function () {
    };
    Bulletin.prototype.setAssistants = function (assistants) {
    };
    ns.protocol.Visa = Visa;
    ns.protocol.Bulletin = Bulletin
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseContent = function (info) {
        if (Enum.isEnum(info)) {
            info = info.getValue()
        }
        var content, type, sn, time;
        if (typeof info === 'number') {
            type = info;
            time = new Date();
            sn = InstantMessage.generateSerialNumber(type, time);
            content = {'type': type, 'sn': sn, 'time': time.getTime() / 1000.0}
        } else {
            content = info;
            type = 0;
            sn = 0;
            time = null
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time
    };
    Class(BaseContent, Dictionary, [Content], {
        getType: function () {
            if (this.__type === 0) {
                var gf = ns.dkd.MessageFactoryManager.generalFactory;
                this.__type = gf.getContentType(this.toMap(), 0)
            }
            return this.__type
        }, getSerialNumber: function () {
            if (this.__sn === 0) {
                this.__sn = this.getInt('sn', 0)
            }
            return this.__sn
        }, getTime: function () {
            if (this.__time === null) {
                this.__time = this.getDateTime('time', null)
            }
            return this.__time
        }, getGroup: function () {
            var group = this.getValue('group');
            return ID.parse(group)
        }, setGroup: function (identifier) {
            this.setString('group', identifier)
        }
    });
    ns.dkd.BaseContent = BaseContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ID = ns.protocol.ID;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var ArrayContent = ns.protocol.ArrayContent;
    var ForwardContent = ns.protocol.ForwardContent;
    var PageContent = ns.protocol.PageContent;
    var NameCard = ns.protocol.NameCard;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function (info) {
        if (typeof info === 'string') {
            BaseContent.call(this, ContentType.TEXT);
            this.setText(info)
        } else {
            BaseContent.call(this, info)
        }
    };
    Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getString('text', '')
        }, setText: function (text) {
            this.setValue('text', text)
        }
    });
    var ListContent = function (info) {
        var list;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue('contents', ArrayContent.revert(list))
        } else {
            BaseContent.call(this, info);
            list = null
        }
        this.__list = list
    };
    Class(ListContent, BaseContent, [ArrayContent], {
        getContents: function () {
            if (this.__list === null) {
                var array = this.getValue('contents');
                if (array) {
                    this.__list = ArrayContent.convert(array)
                } else {
                    this.__list = []
                }
            }
            return this.__list
        }
    });
    var SecretContent = function (info) {
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info
        } else if (Interface.conforms(info, ReliableMessage)) {
            BaseContent.call(this, ContentType.FORWARD);
            forward = info
        } else {
            BaseContent.call(this, info)
        }
        if (forward) {
            this.setMap('forward', forward)
        } else if (secrets) {
            var array = ForwardContent.revert(secrets);
            this.setValue('secrets', array)
        }
        this.__forward = forward;
        this.__secrets = secrets
    };
    Class(SecretContent, BaseContent, [ForwardContent], {
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue('forward');
                this.__forward = ReliableMessage.parse(forward)
            }
            return this.__forward
        }, getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue('secrets');
                if (array) {
                    this.__secrets = ForwardContent.convert(array)
                } else {
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg)
                    }
                }
            }
            return this.__secrets
        }
    });
    var WebPageContent = function (info) {
        if (info) {
            BaseContent.call(this, info)
        } else {
            BaseContent.call(this, ContentType.PAGE)
        }
        this.__icon = null
    };
    Class(WebPageContent, BaseContent, [PageContent], {
        getTitle: function () {
            return this.getString('title', '')
        }, setTitle: function (title) {
            this.setValue('title', title)
        }, getDesc: function () {
            return this.getString('desc', null)
        }, setDesc: function (text) {
            this.setValue('desc', text)
        }, getURL: function () {
            return this.getString('URL', null)
        }, setURL: function (url) {
            this.setValue('URL', url)
        }, getHTML: function () {
            return this.getString('HTML', null)
        }, setHTML: function (html) {
            this.setValue('HTML', html)
        }, getIcon: function () {
            var pnf = this.__icon;
            if (!pnf) {
                var url = this.getString('icon', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf
            }
            return pnf
        }, setIcon: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('icon', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('icon', image)
            } else {
                this.removeValue('icon')
            }
            this.__icon = pnf
        }
    });
    var NameCardContent = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseContent.call(this, ContentType.NAME_CARD);
            this.setString('ID', info)
        } else {
            BaseContent.call(this, info)
        }
        this.__image = null
    };
    Class(NameCardContent, BaseContent, [NameCard], {
        getIdentifier: function () {
            var id = this.getValue('ID');
            return ID.parse(id)
        }, getName: function () {
            return this.getString('name', '')
        }, setName: function (name) {
            this.setValue('name', name)
        }, getAvatar: function () {
            var pnf = this.__image;
            if (!pnf) {
                var url = this.getString('avatar', null);
                pnf = PortableNetworkFile.parse(url);
                this.__icon = pnf
            }
            return pnf
        }, setAvatar: function (image) {
            var pnf = null;
            if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('avatar', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('avatar', image)
            } else {
                this.removeValue('avatar')
            }
            this.__image = pnf
        }
    });
    ns.dkd.BaseTextContent = BaseTextContent;
    ns.dkd.ListContent = ListContent;
    ns.dkd.SecretContent = SecretContent;
    ns.dkd.WebPageContent = WebPageContent;
    ns.dkd.NameCardContent = NameCardContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var BaseFileWrapper = ns.format.BaseFileWrapper;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function (info) {
        if (!info) {
            info = ContentType.FILE
        }
        BaseContent.call(this, info);
        this.__wrapper = new BaseFileWrapper(this.toMap())
    };
    Class(BaseFileContent, BaseContent, [FileContent], {
        getData: function () {
            var ted = this.__wrapper.getData();
            return !ted ? null : ted.getData()
        }, setData: function (data) {
            this.__wrapper.setBinaryData(data)
        }, setTransportableData: function (ted) {
            this.__wrapper.setData(ted)
        }, getFilename: function () {
            return this.__wrapper.getFilename()
        }, setFilename: function (filename) {
            this.__wrapper.setFilename(filename)
        }, getURL: function () {
            return this.__wrapper.getURL()
        }, setURL: function (url) {
            this.__wrapper.setURL(url)
        }, getPassword: function () {
            return this.__wrapper.getPassword()
        }, setPassword: function (key) {
            this.__wrapper.setPassword(key)
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.IMAGE)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__thumbnail = null
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            var pnf = this.__thumbnail;
            if (!pnf) {
                var base64 = this.getString('thumbnail', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__thumbnail = pnf
            }
            return pnf
        }, setThumbnail: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('thumbnail')
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('thumbnail', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('thumbnail', image)
            }
            this.__thumbnail = pnf
        }
    });
    var VideoFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.VIDEO)
        } else {
            BaseFileContent.call(this, info)
        }
        this.__snapshot = null
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            var pnf = this.__snapshot;
            if (!pnf) {
                var base64 = this.getString('snapshot', null);
                pnf = PortableNetworkFile.parse(base64);
                this.__snapshot = pnf
            }
            return pnf
        }, setSnapshot: function (image) {
            var pnf = null;
            if (!image) {
                this.removeValue('snapshot')
            } else if (Interface.conforms(image, PortableNetworkFile)) {
                pnf = image;
                this.setValue('snapshot', pnf.toObject())
            } else if (IObject.isString(image)) {
                this.setValue('snapshot', image)
            }
            this.__snapshot = pnf
        }
    });
    var AudioFileContent = function (info) {
        if (!info) {
            BaseFileContent.call(this, ContentType.AUDIO)
        } else {
            BaseFileContent.call(this, info)
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getString('text', null)
        }, setText: function (asr) {
            this.setValue('text', asr)
        }
    });
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(arguments[0])
        } else if (arguments.length === 2) {
            BaseContent.call(ContentType.MONEY);
            this.setCurrency(arguments[0]);
            this.setAmount(arguments[1])
        } else if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            this.setValue('currency', currency)
        }, getCurrency: function () {
            return this.getString('currency', null)
        }, setAmount: function (amount) {
            this.setValue('amount', amount)
        }, getAmount: function () {
            return this.getFloat('amount', 0)
        }
    });
    var TransferMoneyContent = function () {
        if (arguments.length === 1) {
            MoneyContent.call(arguments[0])
        } else if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1])
        } else {
            throw new SyntaxError('money content arguments error: ' + arguments);
        }
    };
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getRemitter: function () {
            var sender = this.getValue('remitter');
            return ID.parse(sender)
        }, setRemitter: function (sender) {
            this.setString('remitter', sender)
        }, getRemittee: function () {
            var receiver = this.getValue('remittee');
            return ID.parse(receiver)
        }, setRemittee: function (receiver) {
            this.setString('remittee', receiver)
        }
    });
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var CustomizedContent = ns.protocol.CustomizedContent;
    var BaseContent = ns.dkd.BaseContent;
    var AppCustomizedContent = function () {
        var app = null;
        var mod = null;
        var act = null;
        if (arguments.length === 4) {
            BaseContent.call(this, arguments[0]);
            app = arguments[1];
            mod = arguments[2];
            act = arguments[3]
        } else if (arguments.length === 3) {
            BaseContent.call(this, ContentType.CUSTOMIZED);
            app = arguments[0];
            mod = arguments[1];
            act = arguments[2]
        } else {
            BaseContent.call(this, arguments[0])
        }
        if (app) {
            this.setValue('app', app)
        }
        if (mod) {
            this.setValue('mod', mod)
        }
        if (act) {
            this.setValue('act', act)
        }
    };
    Class(AppCustomizedContent, BaseContent, [CustomizedContent], {
        getApplication: function () {
            return this.getString('app', null)
        }, getModule: function () {
            return this.getString('mod', null)
        }, getAction: function () {
            return this.getString('act', null)
        }
    });
    ns.dkd.AppCustomizedContent = AppCustomizedContent
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue('command', arguments[1])
        } else if (IObject.isString(arguments[0])) {
            BaseContent.call(this, ContentType.COMMAND);
            this.setValue('command', arguments[0])
        } else {
            BaseContent.call(this, arguments[0])
        }
    };
    Class(BaseCommand, BaseContent, [Command], {
        getCmd: function () {
            var gf = ns.dkd.cmd.CommandFactoryManager.generalFactory;
            return gf.getCmd(this.toMap(), '')
        }
    });
    ns.dkd.cmd.BaseCommand = BaseCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseMetaCommand = function () {
        var identifier = null;
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[1]);
            identifier = arguments[0]
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseCommand.call(this, Command.META);
            identifier = arguments[0]
        } else {
            BaseCommand.call(this, arguments[0])
        }
        if (identifier) {
            this.setString('ID', identifier)
        }
        this.__identifier = identifier;
        this.__meta = null
    };
    Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("ID");
                this.__identifier = ID.parse(identifier)
            }
            return this.__identifier
        }, getMeta: function () {
            if (this.__meta === null) {
                var meta = this.getValue('meta');
                this.__meta = Meta.parse(meta)
            }
            return this.__meta
        }, setMeta: function (meta) {
            this.setMap('meta', meta);
            this.__meta = meta
        }
    });
    var BaseDocumentCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseMetaCommand.call(this, info, Command.DOCUMENT)
        } else {
            BaseMetaCommand.call(this, info)
        }
        this.__document = null
    };
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        getDocument: function () {
            if (this.__document === null) {
                var doc = this.getValue('document');
                this.__document = Document.parse(doc)
            }
            return this.__document
        }, setDocument: function (doc) {
            this.setMap('document', doc);
            this.__document = doc
        }, getLastTime: function () {
            return this.getDateTime('last_time', null)
        }, setLastTime: function (when) {
            this.setDateTime('last_time', when)
        }
    });
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[0], arguments[1])
        } else if (IObject.isString(arguments[0])) {
            BaseCommand.call(this, ContentType.HISTORY, arguments[0])
        } else {
            BaseCommand.call(this, arguments[0])
        }
    };
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0])
        } else if (arguments.length === 2) {
            BaseHistoryCommand.call(this, ContentType.COMMAND, arguments[0]);
            this.setGroup(arguments[1])
        } else {
            throw new SyntaxError('Group command arguments error: ' + arguments);
        }
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            this.setString('member', identifier);
            this.removeValue('members')
        }, getMember: function () {
            var member = this.getValue('member');
            return ID.parse(member)
        }, setMembers: function (users) {
            if (!users) {
                this.removeValue('members')
            } else {
                var array = ID.revert(users);
                this.setValue('members', array)
            }
            this.removeValue('member')
        }, getMembers: function () {
            var array = this.getValue('members');
            if (array instanceof Array) {
                return ID.convert(array)
            }
            var single = this.getMember();
            return !single ? [] : [single]
        }
    });
    ns.dkd.cmd.BaseHistoryCommand = BaseHistoryCommand;
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var HireCommand = ns.protocol.group.HireCommand;
    var FireCommand = ns.protocol.group.FireCommand;
    var ResignCommand = ns.protocol.group.ResignCommand;
    var BaseGroupCommand = ns.dkd.cmd.BaseGroupCommand;
    var InviteGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.INVITE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);
    var ExpelGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);
    var JoinGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);
    var QuitGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);
    var ResetGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESET, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);
    var QueryGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);
    var HireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.HIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(HireGroupCommand, BaseGroupCommand, [HireCommand], null);
    var FireGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.FIRE, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(FireGroupCommand, BaseGroupCommand, [FireCommand], null);
    var ResignGroupCommand = function (info) {
        if (Interface.conforms(info, ID)) {
            BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
        } else {
            BaseGroupCommand.call(this, info)
        }
    };
    Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand], null);
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;
    ns.dkd.cmd.HireGroupCommand = HireGroupCommand;
    ns.dkd.cmd.FireGroupCommand = FireGroupCommand;
    ns.dkd.cmd.ResignGroupCommand = ResignGroupCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Converter = ns.type.Converter;
    var Envelope = ns.protocol.Envelope;
    var Command = ns.protocol.Command;
    var ReceiptCommand = ns.protocol.ReceiptCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseReceiptCommand = function () {
        if (arguments.length === 1) {
            BaseCommand.call(this, arguments[0])
        } else {
            BaseCommand.call(this, Command.RECEIPT);
            this.setValue('text', arguments[0]);
            var origin = arguments[1];
            if (origin) {
                this.setValue('origin', origin)
            }
        }
        this.__env = null
    };
    Class(BaseReceiptCommand, BaseCommand, [ReceiptCommand], {
        getText: function () {
            return this.getString('text', '')
        }, getOrigin: function () {
            return this.getValue('origin')
        }, getOriginalEnvelope: function () {
            var env = this.__env;
            if (!env) {
                env = Envelope.parse(this.getOrigin());
                this.__env = env
            }
            return env
        }, getOriginalSerialNumber: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null
            }
            return Converter.getInt(origin['sn'], null)
        }, getOriginalSignature: function () {
            var origin = this.getOrigin();
            if (!origin) {
                return null
            }
            return Converter.getString(origin['signature'], null)
        }
    });
    ns.dkd.cmd.BaseReceiptCommand = BaseReceiptCommand
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var Command = ns.protocol.Command;
    var GeneralFactory = function () {
        this.__commandFactories = {}
    };
    Class(GeneralFactory, null, null, {
        setCommandFactory: function (cmd, factory) {
            this.__commandFactories[cmd] = factory
        }, getCommandFactory: function (cmd) {
            return this.__commandFactories[cmd]
        }, getCmd: function (content, defaultValue) {
            return Converter.getString(content['command'], defaultValue)
        }, parseCommand: function (content) {
            if (!content) {
                return null
            } else if (Interface.conforms(content, Command)) {
                return content
            }
            var info = Wrapper.fetchMap(content);
            if (!info) {
                return null
            }
            var cmd = this.getCmd(info, '');
            var factory = this.getCommandFactory(cmd);
            if (!factory) {
                factory = default_factory(info)
            }
            return factory.parseCommand(info)
        }
    });
    var default_factory = function (info) {
        var man = ns.dkd.MessageFactoryManager;
        var gf = man.generalFactory;
        var type = gf.getContentType(info, 0);
        var factory = gf.getContentFactory(type);
        if (Interface.conforms(factory, Command.Factory)) {
            return factory
        }
        return null
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.dkd.cmd.CommandGeneralFactory = GeneralFactory;
    ns.dkd.cmd.CommandFactoryManager = FactoryManager
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Converter = ns.type.Converter;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = null;
            to = null;
            when = null
        } else if (arguments.length === 2 || arguments.length === 3) {
            from = arguments[0];
            to = arguments[1];
            if (arguments.length === 2) {
                when = new Date()
            } else {
                when = arguments[2];
                if (when === null || when === 0) {
                    when = new Date()
                } else {
                    when = Converter.getDateTime(when, null)
                }
            }
            env = {'sender': from.toString(), 'receiver': to.toString(), 'time': when.getTime() / 1000.0}
        } else {
            throw new SyntaxError('envelope arguments error: ' + arguments);
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when
    };
    Class(MessageEnvelope, Dictionary, [Envelope], {
        getSender: function () {
            var sender = this.__sender;
            if (!sender) {
                sender = ID.parse(this.getValue('sender'));
                this.__sender = sender
            }
            return sender
        }, getReceiver: function () {
            var receiver = this.__receiver;
            if (!receiver) {
                receiver = ID.parse(this.getValue('receiver'));
                if (!receiver) {
                    receiver = ID.ANYONE
                }
                this.__receiver = receiver
            }
            return receiver
        }, getTime: function () {
            var time = this.__time;
            if (!time) {
                time = this.getDateTime('time', null);
                this.__time = time
            }
            return time
        }, getGroup: function () {
            return ID.parse(this.getValue('group'))
        }, setGroup: function (identifier) {
            this.setString('group', identifier)
        }, getType: function () {
            return this.getInt('type', null)
        }, setType: function (type) {
            this.setValue('type', type)
        }
    });
    ns.msg.MessageEnvelope = MessageEnvelope
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap()
        }
        Dictionary.call(this, msg);
        this.__envelope = env
    };
    Class(BaseMessage, Dictionary, [Message], {
        getEnvelope: function () {
            var env = this.__envelope;
            if (!env) {
                env = Envelope.parse(this.toMap());
                this.__envelope = env
            }
            return env
        }, getSender: function () {
            var env = this.getEnvelope();
            return env.getSender()
        }, getReceiver: function () {
            var env = this.getEnvelope();
            return env.getReceiver()
        }, getTime: function () {
            var env = this.getEnvelope();
            return env.getTime()
        }, getGroup: function () {
            var env = this.getEnvelope();
            return env.getGroup()
        }, getType: function () {
            var env = this.getEnvelope();
            return env.getTime()
        }
    });
    BaseMessage.isBroadcast = function (msg) {
        if (msg.getReceiver().isBroadcast()) {
            return true
        }
        var group = ID.parse(msg.getValue('group'));
        if (!group) {
            return false
        }
        return group.isBroadcast()
    };
    ns.msg.BaseMessage = BaseMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = null;
            body = null
        } else if (arguments.length === 2) {
            head = arguments[0];
            body = arguments[1];
            msg = head.toMap();
            msg['content'] = body.toMap()
        } else {
            throw new SyntaxError('message arguments error: ' + arguments);
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body
    };
    Class(PlainMessage, BaseMessage, [InstantMessage], {
        getTime: function () {
            var body = this.getContent();
            var time = body.getTime();
            if (time) {
                return time
            }
            var head = this.getEnvelope();
            return head.getTime()
        }, getGroup: function () {
            var body = this.getContent();
            return body.getGroup()
        }, getType: function () {
            var body = this.getContent();
            return body.getType()
        }, getContent: function () {
            var body = this.__content;
            if (!body) {
                body = Content.parse(this.getValue('content'));
                this.__content = body
            }
            return body
        }, setContent: function (body) {
            this.setMap('content', body);
            this.__content = body
        }
    });
    ns.msg.PlainMessage = PlainMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var UTF8 = ns.format.UTF8;
    var TransportableData = ns.format.TransportableData;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null
    };
    Class(EncryptedMessage, BaseMessage, [SecureMessage], {
        getData: function () {
            var data = this.__data;
            if (!data) {
                var base64 = this.getValue('data');
                if (!base64) {
                    throw new ReferenceError('message data not found: ' + this);
                } else if (!BaseMessage.isBroadcast(this)) {
                    data = TransportableData.decode(base64)
                } else if (IObject.isString(base64)) {
                    data = UTF8.encode(base64)
                } else {
                    throw new ReferenceError('message data error: ' + base64);
                }
                this.__data = data
            }
            return data
        }, getEncryptedKey: function () {
            var ted = this.__key;
            if (!ted) {
                var base64 = this.getValue('key');
                if (!base64) {
                    var keys = this.getEncryptedKeys();
                    if (keys) {
                        var receiver = this.getReceiver();
                        base64 = keys[receiver.toString()]
                    }
                }
                ted = TransportableData.parse(base64);
                this.__key = ted
            }
            return !ted ? null : ted.getData()
        }, getEncryptedKeys: function () {
            var keys = this.__keys;
            if (!keys) {
                keys = this.getValue('keys');
                this.__keys = keys
            }
            return keys
        }
    });
    ns.msg.EncryptedMessage = EncryptedMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var TransportableData = ns.format.TransportableData;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.msg.EncryptedMessage;
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null
    };
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {
        getSignature: function () {
            var ted = this.__signature;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__signature = ted
            }
            return !ted ? null : ted.getData()
        }
    });
    ns.msg.NetworkMessage = NetworkMessage
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var UTF8 = ns.format.UTF8;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var MetaType = ns.protocol.MetaType;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var getGroupSeed = function (group_id) {
        var name = group_id.getName();
        if (IObject.isString(name)) {
            var len = name.length;
            if (len === 0) {
                return null
            } else if (name === 8 && name.toLowerCase() === 'everyone') {
                return null
            }
            return name
        }
        return null
    };
    var getBroadcastFounder = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return ID.FOUNDER
        } else {
            return ID.parse(name + '.founder@anywhere')
        }
    };
    var getBroadcastOwner = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return ID.ANYONE
        } else {
            return ID.parse(name + '.owner@anywhere')
        }
    };
    var getBroadcastMembers = function (group_id) {
        var name = getGroupSeed(group_id);
        if (!name) {
            return [ID.ANYONE]
        } else {
            var owner = ID.parse(name + '.owner@anywhere');
            var member = ID.parse(name + '.member@anywhere');
            return [owner, member]
        }
    };
    var checkMeta = function (meta) {
        var pKey = meta.getPublicKey();
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        var noSeed = !seed || seed.length === 0;
        var noSig = !fingerprint || fingerprint.length === 0;
        if (!MetaType.hasSeed(meta.getType())) {
            return noSeed && noSig
        } else if (noSeed || noSig) {
            return false
        }
        var data = UTF8.encode(seed);
        return pKey.verify(data, fingerprint)
    };
    var matchIdentifier = function (identifier, meta) {
        var seed = meta.getSeed();
        var name = identifier.getName();
        if (seed !== name) {
            return false
        }
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen)
    };
    var matchPublicKey = function (pKey, meta) {
        if (meta.getPublicKey().equals(pKey)) {
            return true
        }
        if (MetaType.hasSeed(meta.getType())) {
            var seed = meta.getSeed();
            var fingerprint = meta.getFingerprint();
            var data = UTF8.encode(seed);
            return pKey.verify(data, fingerprint)
        } else {
            return false
        }
    };
    var isBefore = function (oldTime, thisTime) {
        if (!oldTime || !thisTime) {
            return false
        }
        return thisTime.getTime() < oldTime.getTime()
    };
    var isExpired = function (thisDoc, oldDoc) {
        var thisTime = thisDoc.getTime();
        var oldTime = oldDoc.getTime();
        return isBefore(oldTime, thisTime)
    };
    var lastDocument = function (documents, type) {
        if (!type || type === '*') {
            type = ''
        }
        var checkType = type.length > 0;
        var last = null;
        var doc, docType, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            if (checkType) {
                docType = doc.getType();
                matched = !docType || docType.length === 0 || docType === type;
                if (!matched) {
                    continue
                }
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    var lastVisa = function (documents) {
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            matched = Interface.conforms(doc, Visa);
            if (!matched) {
                continue
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    var lastBulletin = function (documents) {
        var last = null
        var doc, matched;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            matched = Interface.conforms(doc, Bulletin);
            if (!matched) {
                continue
            }
            if (last != null && isExpired(doc, last)) {
                continue
            }
            last = doc
        }
        return last
    };
    ns.mkm.BroadcastHelper = {
        getGroupSeed: getGroupSeed,
        getBroadcastFounder: getBroadcastFounder,
        getBroadcastOwner: getBroadcastOwner,
        getBroadcastMembers: getBroadcastMembers
    };
    ns.mkm.MetaHelper = {checkMeta: checkMeta, matchIdentifier: matchIdentifier, matchPublicKey: matchPublicKey}
    ns.mkm.DocumentHelper = {
        isBefore: isBefore,
        isExpired: isExpired,
        lastDocument: lastDocument,
        lastVisa: lastVisa,
        lastBulletin: lastBulletin
    }
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var Dictionary = ns.type.Dictionary;
    var TransportableData = ns.format.TransportableData;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var MetaHelper = ns.mkm.MetaHelper;
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var status = 0;
        var meta;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = 0;
            key = null;
            seed = null;
            fingerprint = null
        } else if (arguments.length === 2) {
            type = Enum.getInt(arguments[0]);
            key = arguments[1];
            seed = null;
            fingerprint = null;
            status = 1;
            meta = {'type': type, 'key': key.toMap()}
        } else if (arguments.length === 4) {
            type = Enum.getInt(arguments[0]);
            key = arguments[1];
            seed = arguments[2];
            fingerprint = arguments[3];
            status = 1;
            meta = {'type': type, 'key': key.toMap(), 'seed': seed, 'fingerprint': fingerprint.toObject()}
        } else {
            throw new SyntaxError('meta arguments error: ' + arguments);
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
        this.__status = status
    };
    Class(BaseMeta, Dictionary, [Meta], {
        getType: function () {
            var type = this.__type;
            if (!type) {
                var man = ns.mkm.AccountFactoryManager;
                var gf = man.generalFactory;
                type = gf.getMetaType(this.toMap(), 0);
                this.__type = type
            }
            return type
        }, getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                key = PublicKey.parse(this.getValue('key'));
                this.__key = key
            }
            return key
        }, getSeed: function () {
            var seed = this.__seed;
            if (!seed && MetaType.hasSeed(this.getType())) {
                seed = this.getString('seed', null);
                this.__seed = seed
            }
            return seed
        }, getFingerprint: function () {
            var ted = this.__fingerprint;
            if (!ted && MetaType.hasSeed(this.getType())) {
                var base64 = this.getValue('fingerprint');
                ted = TransportableData.parse(base64);
                this.__fingerprint = ted
            }
            return !ted ? null : ted.getData()
        }, isValid: function () {
            if (this.__status === 0) {
                if (MetaHelper.checkMeta(this)) {
                    this.__status = 1
                } else {
                    this.__status = -1
                }
            }
            return this.__status > 0
        }, matchIdentifier: function (identifier) {
            return MetaHelper.matchIdentifier(identifier, this)
        }, matchPublicKey: function (pKey) {
            return MetaHelper.matchPublicKey(pKey, this)
        }
    });
    ns.mkm.BaseMeta = BaseMeta
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Converter = ns.type.Converter;
    var UTF8 = ns.format.UTF8;
    var JsON = ns.format.JSON;
    var TransportableData = ns.format.TransportableData;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var BaseDocument = function () {
        var map, status;
        var identifier, data, signature;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            status = 0;
            identifier = null;
            data = null;
            signature = null;
            properties = null
        } else if (arguments.length === 2) {
            identifier = arguments[0];
            var type = arguments[1];
            map = {'ID': identifier.toString()};
            status = 0;
            data = null;
            signature = null;
            var now = new Date();
            properties = {'type': type, 'created_time': (now.getTime() / 1000.0)}
        } else if (arguments.length === 3) {
            identifier = arguments[0];
            data = arguments[1];
            signature = arguments[2];
            map = {'ID': identifier.toString(), 'data': data, 'signature': signature.toObject()}
            status = 1;
            properties = null
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;
        this.__sig = signature;
        this.__properties = properties;
        this.__status = status
    };
    Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0
        }, getType: function () {
            var type = this.getProperty('type');
            if (!type) {
                var man = ns.mkm.AccountFactoryManager;
                var gf = man.generalFactory;
                type = gf.getDocumentType(this.toMap(), null)
            }
            return type
        }, getIdentifier: function () {
            var did = this.__identifier;
            if (!did) {
                did = ID.parse(this.getValue('ID'))
                this.__identifier = did
            }
            return did
        }, getData: function () {
            var base64 = this.__json;
            if (!base64) {
                base64 = this.getString('data', null);
                this.__json = base64
            }
            return base64
        }, getSignature: function () {
            var ted = this.__sig;
            if (!ted) {
                var base64 = this.getValue('signature');
                ted = TransportableData.parse(base64);
                this.__sig = ted
            }
            if (!ted) {
                return null
            }
            return ted.getData()
        }, allProperties: function () {
            if (this.__status < 0) {
                return null
            }
            var dict = this.__properties;
            if (!dict) {
                var json = this.getData();
                if (json) {
                    dict = JsON.decode(json)
                } else {
                    dict = {}
                }
                this.__properties = dict
            }
            return dict
        }, getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null
            }
            return dict[name]
        }, setProperty: function (name, value) {
            this.__status = 0;
            var dict = this.allProperties();
            if (value) {
                dict[name] = value
            } else {
                delete dict[name]
            }
            this.removeValue('data');
            this.removeValue('signature');
            this.__json = null;
            this.__sig = null
        }, verify: function (publicKey) {
            if (this.__status > 0) {
                return true
            }
            var data = this.getData();
            var signature = this.getSignature();
            if (!data) {
                if (!signature) {
                    this.__status = 0
                } else {
                    this.__status = -1
                }
            } else if (!signature) {
                this.__status = -1
            } else if (publicKey.verify(UTF8.encode(data), signature)) {
                this.__status = 1
            }
            return this.__status === 1
        }, sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature()
            }
            var now = new Date();
            this.setProperty('time', now.getTime() / 1000.0);
            var dict = this.allProperties();
            if (!dict) {
                return null
            }
            var data = JsON.encode(dict);
            if (!data || data.length === 0) {
                return null
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                return null
            }
            var ted = TransportableData.create(signature);
            this.setValue('data', data);
            this.setValue('signature', ted.toObject());
            this.__json = data;
            this.__sig = ted;
            this.__status = 1;
            return signature
        }, getTime: function () {
            var timestamp = this.getProperty('time');
            return Converter.getDateTime(timestamp, null)
        }, getName: function () {
            var name = this.getProperty('name');
            return Converter.getString(name, null)
        }, setName: function (name) {
            this.setProperty('name', name)
        }
    });
    ns.mkm.BaseDocument = BaseDocument
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, arguments[0], Document.VISA)
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        }
        this.__key = null;
        this.__avatar = null
    };
    Class(BaseVisa, BaseDocument, [Visa], {
        getPublicKey: function () {
            var key = this.__key;
            if (!key) {
                var info = this.getProperty('key');
                key = PublicKey.parse(info);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key
                } else {
                    key = null
                }
            }
            return key
        }, setPublicKey: function (pKey) {
            if (!pKey) {
                this.setProperty('key', null)
            } else {
                this.setProperty('key', pKey.toMap())
            }
            this.__key = pKey
        }, getAvatar: function () {
            var pnf = this.__avatar;
            if (!pnf) {
                var url = this.getProperty('avatar');
                pnf = PortableNetworkFile.parse(url);
                this.__avatar = pnf
            }
            return pnf
        }, setAvatar: function (pnf) {
            if (!pnf) {
                this.setProperty('avatar', null)
            } else {
                this.setProperty('avatar', pnf.toObject())
            }
            this.__avatar = pnf
        }
    });
    ns.mkm.BaseVisa = BaseVisa
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else if (Interface.conforms(arguments[0], ID)) {
            BaseDocument.call(this, arguments[0], Document.BULLETIN)
        } else if (arguments.length === 1) {
            BaseDocument.call(this, arguments[0])
        }
        this.__assistants = null
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {
        getFounder: function () {
            return ID.parse(this.getProperty('founder'))
        }, getAssistants: function () {
            var bots = this.__assistants;
            if (!bots) {
                var assistants = this.getProperty('assistants');
                if (assistants) {
                    bots = ID.convert(assistants)
                } else {
                    var single = ID.parse(this.getProperty('assistant'));
                    bots = !single ? [] : [single]
                }
                this.__assistants = bots
            }
            return bots
        }, setAssistants: function (bots) {
            if (bots) {
                this.setProperty('assistants', ID.revert(bots))
            } else {
                this.setProperty('assistants', null)
            }
            this.setProperty('assistant', null);
            this.__assistants = bots
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Entity = Interface(null, [IObject]);
    Entity.prototype.getIdentifier = function () {
    };
    Entity.prototype.getType = function () {
    };
    Entity.prototype.getMeta = function () {
    };
    Entity.prototype.getDocuments = function () {
    };
    Entity.prototype.setDataSource = function (barrack) {
    };
    Entity.prototype.getDataSource = function () {
    };
    var EntityDataSource = Interface(null, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
    };
    EntityDataSource.prototype.getDocuments = function (identifier) {
    };
    var EntityDelegate = Interface(null, null);
    EntityDelegate.prototype.getUser = function (identifier) {
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
    ns.mkm.EntityDelegate = EntityDelegate;
    ns.mkm.EntityDataSource = EntityDataSource
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__barrack = null
    };
    Class(BaseEntity, BaseObject, [Entity], null);
    BaseEntity.prototype.equals = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return false
        } else if (Interface.conforms(other, Entity)) {
            other = other.getIdentifier()
        }
        return this.__identifier.equals(other)
    };
    BaseEntity.prototype.valueOf = function () {
        return desc.call(this)
    };
    BaseEntity.prototype.toString = function () {
        return desc.call(this)
    };
    var desc = function () {
        var clazz = Object.getPrototypeOf(this).constructor.name;
        var id = this.__identifier;
        var network = id.getAddress().getType();
        return '<' + clazz + ' id="' + id.toString() + '" network="' + network + '" />'
    };
    BaseEntity.prototype.setDataSource = function (barrack) {
        this.__barrack = barrack
    };
    BaseEntity.prototype.getDataSource = function () {
        return this.__barrack
    };
    BaseEntity.prototype.getIdentifier = function () {
        return this.__identifier
    };
    BaseEntity.prototype.getType = function () {
        return this.__identifier.getType()
    };
    BaseEntity.prototype.getMeta = function () {
        var delegate = this.getDataSource();
        return delegate.getMeta(this.__identifier)
    };
    BaseEntity.prototype.getDocuments = function () {
        var delegate = this.getDataSource();
        return delegate.getDocuments(this.__identifier)
    };
    ns.mkm.BaseEntity = BaseEntity
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var User = Interface(null, [Entity]);
    User.prototype.getVisa = function () {
    };
    User.prototype.getContacts = function () {
    };
    User.prototype.verify = function (data, signature) {
    };
    User.prototype.encrypt = function (plaintext) {
    };
    User.prototype.sign = function (data) {
    };
    User.prototype.decrypt = function (ciphertext) {
    };
    User.prototype.signVisa = function (doc) {
    };
    User.prototype.verifyVisa = function (doc) {
    };
    var UserDataSource = Interface(null, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (identifier) {
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier)
    };
    Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var docs = this.getDocuments();
            return DocumentHelper.lastVisa(docs)
        }, getContacts: function () {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            return barrack.getContacts(user)
        }, verify: function (data, signature) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var keys = barrack.getPublicKeysForVerification(user);
            for (var i = 0; i < keys.length; ++i) {
                if (keys[i].verify(data, signature)) {
                    return true
                }
            }
            return false
        }, encrypt: function (plaintext) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var key = barrack.getPublicKeyForEncryption(user);
            return key.encrypt(plaintext)
        }, sign: function (data) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(user);
            return key.sign(data)
        }, decrypt: function (ciphertext) {
            var barrack = this.getDataSource();
            var user = this.getIdentifier();
            var keys = barrack.getPrivateKeysForDecryption(user);
            var plaintext;
            for (var i = 0; i < keys.length; ++i) {
                try {
                    plaintext = keys[i].decrypt(ciphertext);
                    if (plaintext && plaintext.length > 0) {
                        return plaintext
                    }
                } catch (e) {
                }
            }
            return null
        }, signVisa: function (doc) {
            var user = this.getIdentifier();
            var barrack = this.getDataSource();
            var key = barrack.getPrivateKeyForVisaSignature(user);
            var sig = doc.sign(key);
            if (!sig) {
                return null
            }
            return doc
        }, verifyVisa: function (doc) {
            var uid = this.getIdentifier();
            if (!uid.equals(doc.getIdentifier())) {
                return false
            }
            var meta = this.getMeta();
            var key = meta.getPublicKey();
            return doc.verify(key)
        }
    });
    ns.mkm.BaseUser = BaseUser
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var Group = Interface(null, [Entity]);
    Group.prototype.getBulletin = function () {
    };
    Group.prototype.getFounder = function () {
    };
    Group.prototype.getOwner = function () {
    };
    Group.prototype.getMembers = function () {
    };
    Group.prototype.getAssistants = function () {
    };
    var GroupDataSource = Interface(null, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null
    };
    Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var docs = this.getDocuments();
            return DocumentHelper.lastBulletin(docs)
        }, getFounder: function () {
            var founder = this.__founder;
            if (!founder) {
                var barrack = this.getDataSource();
                var group = this.getIdentifier();
                founder = barrack.getFounder(group);
                this.__founder = founder
            }
            return founder
        }, getOwner: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getOwner(group)
        }, getMembers: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getMembers(group)
        }, getAssistants: function () {
            var barrack = this.getDataSource();
            var group = this.getIdentifier();
            return barrack.getAssistants(group)
        }
    });
    ns.mkm.BaseGroup = BaseGroup
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var EntityType = ns.protocol.EntityType;
    var Entity = ns.mkm.Entity;
    var User = ns.mkm.User;
    var Group = ns.mkm.Group;
    var DocumentHelper = ns.mkm.DocumentHelper;
    var BroadcastHelper = ns.mkm.BroadcastHelper;
    var Barrack = function () {
        Object.call(this);
        this.__users = {};
        this.__groups = {}
    };
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {
        cacheUser: function (user) {
            var delegate = user.getDataSource();
            if (!delegate) {
                user.setDataSource(this)
            }
            this.__users[user.getIdentifier()] = user
        }, cacheGroup: function (group) {
            var delegate = group.getDataSource();
            if (!delegate) {
                group.setDataSource(this)
            }
            this.__groups[group.getIdentifier()] = group
        }, reduceMemory: function () {
            var finger = 0;
            finger = thanos(this.__users, finger);
            finger = thanos(this.__groups, finger);
            return finger >> 1
        }, createUser: function (identifier) {
        }, createGroup: function (identifier) {
        }, getVisaKey: function (identifier) {
            var doc = this.getVisa(identifier);
            return !doc ? null : doc.getPublicKey()
        }, getMetaKey: function (identifier) {
            var meta = this.getMeta(identifier);
            return !meta ? null : meta.getPublicKey()
        }, getVisa: function (identifier) {
            return DocumentHelper.lastVisa(this.getDocuments(identifier))
        }, getBulletin: function (identifier) {
            return DocumentHelper.lastBulletin(this.getDocuments(identifier))
        }, getUser: function (identifier) {
            var user = this.__users[identifier];
            if (!user) {
                user = this.createUser(identifier);
                if (user) {
                    this.cacheUser(user)
                }
            }
            return user
        }, getGroup: function (identifier) {
            var group = this.__groups[identifier];
            if (!group) {
                group = this.createGroup(identifier);
                if (group) {
                    this.cacheGroup(group)
                }
            }
            return group
        }, getPublicKeyForEncryption: function (identifier) {
            var key = this.getVisaKey(identifier);
            if (key) {
                return key
            }
            key = this.getMetaKey(identifier);
            if (Interface.conforms(key, EncryptKey)) {
                return key
            }
            return null
        }, getPublicKeysForVerification: function (identifier) {
            var keys = [];
            var key = this.getVisaKey(identifier);
            if (Interface.conforms(key, VerifyKey)) {
                keys.push(key)
            }
            key = this.getMetaKey(identifier);
            if (key) {
                keys.push(key)
            }
            return keys
        }, getFounder: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastFounder(group)
            }
            var doc = this.getBulletin(group);
            if (doc) {
                return doc.getFounder()
            }
            return null
        }, getOwner: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastOwner(group)
            }
            if (EntityType.GROUP.equals(group.getType())) {
                return this.getFounder(group)
            }
            return null
        }, getMembers: function (group) {
            if (group.isBroadcast()) {
                return BroadcastHelper.getBroadcastMembers(group)
            }
            return []
        }, getAssistants: function (group) {
            var doc = this.getBulletin(group);
            if (doc) {
                var bots = doc.getAssistants();
                if (bots) {
                    return bots
                }
            }
            return []
        }
    });
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            finger += 1;
            if ((finger & 1) === 1) {
                delete planet[k]
            }
        }
        return finger
    };
    ns.Barrack = Barrack;
    ns.mkm.thanos = thanos
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Packer = Interface(null, null);
    Packer.prototype.encryptMessage = function (iMsg) {
    };
    Packer.prototype.signMessage = function (sMsg) {
    };
    Packer.prototype.serializeMessage = function (rMsg) {
    };
    Packer.prototype.deserializeMessage = function (data) {
    };
    Packer.prototype.verifyMessage = function (rMsg) {
    };
    Packer.prototype.decryptMessage = function (sMsg) {
    };
    ns.Packer = Packer
})(DIMP);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Processor = Interface(null, null);
    Processor.prototype.processPackage = function (data) {
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
    };
    Processor.prototype.processContent = function (content, rMsg) {
    };
    ns.Processor = Processor
})(DIMP);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var UTF8 = ns.format.UTF8;
    var JsON = ns.format.JSON;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.msg.BaseMessage;
    var Transceiver = function () {
        Object.call(this)
    };
    Class(Transceiver, Object, [InstantMessage.Delegate, SecureMessage.Delegate, ReliableMessage.Delegate], null);
    Transceiver.prototype.getEntityDelegate = function () {
    };
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        var dict = content.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json)
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data, iMsg.toMap())
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (BaseMessage.isBroadcast(iMsg)) {
            return null
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json)
    };
    Transceiver.prototype.encryptKey = function (keyData, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        if (!contact) {
            return null
        }
        return contact.encrypt(keyData)
    };
    Transceiver.prototype.decryptKey = function (keyData, receiver, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(receiver);
        if (!user) {
            return null
        }
        return user.decrypt(keyData)
    };
    Transceiver.prototype.deserializeKey = function (keyData, sMsg) {
        if (!keyData) {
            return null
        }
        var json = UTF8.decode(keyData);
        if (!json) {
            return null
        }
        var dict = JsON.decode(json);
        return SymmetricKey.parse(dict)
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data, sMsg.toMap())
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        if (!json) {
            return null
        }
        var dict = JsON.decode(json);
        return Content.parse(dict)
    };
    Transceiver.prototype.signData = function (data, sMsg) {
        var barrack = this.getEntityDelegate();
        var sender = sMsg.getSender();
        var user = barrack.getUser(sender);
        return user.sign(data)
    };
    Transceiver.prototype.verifyDataSignature = function (data, signature, rMsg) {
        var barrack = this.getEntityDelegate();
        var sender = rMsg.getSender();
        var contact = barrack.getUser(sender);
        if (!contact) {
            return false
        }
        return contact.verify(data, signature)
    };
    ns.Transceiver = Transceiver
})(DIMP);
