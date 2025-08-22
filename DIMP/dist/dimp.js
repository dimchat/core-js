/**
 * DIMP - Decentralized Instant Messaging Protocol (v2.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Aug. 20, 2025
 * @copyright (c) 2020-2025 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== 'object') {
    DIMP = {}
}
(function (dkd, mkm, mk) {
    var DaoKeDao = dkd;
    var MingKeMing = mkm;
    var MONKEY = mk;
    if (typeof MONKEY !== 'object') {
        MONKEY = {}
    }
    (function (mk) {
        if (typeof mk.type !== 'object') {
            mk.type = {}
        }
        if (typeof mk.format !== 'object') {
            mk.format = {}
        }
        if (typeof mk.digest !== 'object') {
            mk.digest = {}
        }
        if (typeof mk.protocol !== 'object') {
            mk.protocol = {}
        }
        if (typeof mk.ext !== 'object') {
            mk.ext = {}
        }
        mk.type.Class = function (child, parent, interfaces, methods) {
            if (!child) {
                child = function () {
                    Object.call(this)
                }
            }
            if (parent) {
                child._mk_super_class = parent
            } else {
                parent = Object
            }
            child.prototype = Object.create(parent.prototype);
            child.prototype.constructor = child;
            if (interfaces) {
                child._mk_interfaces = interfaces
            }
            if (methods) {
                override_methods(child, methods)
            }
            return child
        };
        var Class = mk.type.Class;
        var override_methods = function (clazz, methods) {
            var names = Object.keys(methods);
            var key, fn;
            for (var i = 0; i < names.length; ++i) {
                key = names[i];
                fn = methods[key];
                if (typeof fn === 'function') {
                    clazz.prototype[key] = fn
                }
            }
        };
        mk.type.Interface = function (child, parents) {
            if (!child) {
                child = function () {
                }
            }
            if (parents) {
                child._mk_super_interfaces = parents
            }
            return child
        };
        var Interface = mk.type.Interface;
        Interface.conforms = function (object, protocol) {
            if (!object) {
                return false
            } else if (object instanceof protocol) {
                return true
            }
            return check_extends(object.constructor, protocol)
        };
        var check_extends = function (constructor, protocol) {
            var interfaces = constructor._mk_interfaces;
            if (interfaces && check_implements(interfaces, protocol)) {
                return true
            }
            var parent = constructor._mk_super_class;
            return parent && check_extends(parent, protocol)
        };
        var check_implements = function (interfaces, protocol) {
            var child, parents;
            for (var i = 0; i < interfaces.length; ++i) {
                child = interfaces[i];
                if (child === protocol) {
                    return true
                }
                parents = child._mk_super_interfaces;
                if (parents && check_implements(parents, protocol)) {
                    return true
                }
            }
            return false
        };
        mk.type.Object = Interface(null, null);
        var IObject = mk.type.Object;
        IObject.prototype = {
            getClassName: function () {
            }, equals: function () {
            }, valueOf: function () {
            }, toString: function () {
            }
        };
        IObject.isNull = function (object) {
            if (typeof object === 'undefined') {
                return true
            } else {
                return object === null
            }
        };
        IObject.isString = function (object) {
            return typeof object === 'string'
        };
        IObject.isNumber = function (object) {
            return typeof object === 'number'
        };
        IObject.isBoolean = function (object) {
            return typeof object === 'boolean'
        };
        IObject.isFunction = function (object) {
            return typeof object === 'function'
        };
        IObject.isBaseType = function (object) {
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
        mk.type.BaseObject = function () {
            Object.call(this)
        };
        var BaseObject = mk.type.BaseObject;
        Class(BaseObject, null, [IObject], {
            getClassName: function () {
                return Object.getPrototypeOf(this).constructor.name
            }, equals: function (other) {
                return this === other
            }
        });
        mk.type.DataConverter = Interface(null, null);
        var DataConverter = mk.type.DataConverter;
        DataConverter.prototype = {
            getString: function (value, defaultValue) {
            }, getBoolean: function (value, defaultValue) {
            }, getInt: function (value, defaultValue) {
            }, getFloat: function (value, defaultValue) {
            }, getDateTime: function (value, defaultValue) {
            }
        };
        mk.type.BaseConverter = function () {
            BaseObject.call(this)
        };
        var BaseConverter = mk.type.BaseConverter;
        Class(BaseConverter, BaseObject, [DataConverter], {
            getDateTime: function (value, defaultValue) {
                if (IObject.isNull(value)) {
                    return defaultValue
                } else if (value instanceof Date) {
                    return value
                }
                var seconds = this.getFloat(value, 0);
                var millis = seconds * 1000;
                return new Date(millis)
            }, getFloat: function (value, defaultValue) {
                if (IObject.isNull(value)) {
                    return defaultValue
                } else if (IObject.isNumber(value)) {
                    return value
                } else if (IObject.isBoolean(value)) {
                    return value ? 1.0 : 0.0
                }
                var text = this.getStr(value);
                return parseFloat(text)
            }, getInt: function (value, defaultValue) {
                if (IObject.isNull(value)) {
                    return defaultValue
                } else if (IObject.isNumber(value)) {
                    return value
                } else if (IObject.isBoolean(value)) {
                    return value ? 1 : 0
                }
                var text = this.getStr(value);
                return parseInt(text)
            }, getBoolean: function (value, defaultValue) {
                if (IObject.isNull(value)) {
                    return defaultValue
                } else if (IObject.isBoolean(value)) {
                    return value
                } else if (IObject.isNumber(value)) {
                    return value > 0 || value < 0
                }
                var text = this.getStr(value);
                text = text.trim();
                var size = text.length;
                if (size === 0) {
                    return false
                } else if (size > Converter.MAX_BOOLEAN_LEN) {
                    throw new TypeError('Boolean value error: "' + value + '"');
                } else {
                    text = text.toLowerCase()
                }
                var state = Converter.BOOLEAN_STATES[text];
                if (IObject.isNull(state)) {
                    throw new TypeError('Boolean value error: "' + value + '"');
                }
                return state
            }, getString: function (value, defaultValue) {
                if (IObject.isNull(value)) {
                    return defaultValue
                } else if (IObject.isString(value)) {
                    return value
                } else {
                    return value.toString()
                }
            }, getStr: function (value) {
                if (IObject.isString(value)) {
                    return value
                } else {
                    return value.toString()
                }
            }
        });
        mk.type.Converter = {
            getString: function (value, defaultValue) {
                return this.converter.getString(value, defaultValue)
            },
            getBoolean: function (value, defaultValue) {
                return this.converter.getBoolean(value, defaultValue)
            },
            getInt: function (value, defaultValue) {
                return this.converter.getInt(value, defaultValue)
            },
            getFloat: function (value, defaultValue) {
                return this.converter.getFloat(value, defaultValue)
            },
            getDateTime: function (value, defaultValue) {
                return this.converter.getDateTime(value, defaultValue)
            },
            converter: new BaseConverter(),
            BOOLEAN_STATES: {
                '1': true,
                'yes': true,
                'true': true,
                'on': true,
                '0': false,
                'no': false,
                'false': false,
                'off': false,
                'null': false,
                'none': false,
                'undefined': false
            },
            MAX_BOOLEAN_LEN: 'undefined'.length
        };
        var Converter = mk.type.Converter;
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
        mk.type.Arrays = {
            insert: insert_item,
            update: update_item,
            remove: remove_item,
            find: find_item,
            equals: function (array1, array2) {
                return objects_equal(array1, array2, false)
            },
            copy: copy_items,
            isArray: is_array
        };
        var Arrays = mk.type.Arrays;
        var get_enum_alias = function (enumeration, value) {
            var alias = null;
            Mapper.forEach(enumeration, function (n, e) {
                if (e instanceof BaseEnum && e.equals(value)) {
                    alias = e.__alias;
                    return true
                }
                return false
            });
            return alias
        };
        mk.type.BaseEnum = function (value, alias) {
            BaseObject.call(this);
            if (!alias) {
                alias = get_enum_alias(this, value)
            }
            this.__value = value;
            this.__alias = alias
        };
        var BaseEnum = mk.type.BaseEnum;
        Class(BaseEnum, BaseObject, null, {
            equals: function (other) {
                if (other instanceof BaseEnum) {
                    if (this === other) {
                        return true
                    }
                    other = other.valueOf()
                }
                return this.__value === other
            }, toString: function () {
                return '<' + this.getName() + ': ' + this.getValue() + '>'
            }, valueOf: function () {
                return this.__value
            }, getValue: function () {
                return this.__value
            }, getName: function () {
                return this.__alias
            }
        });
        var enum_class = function (type) {
            var NamedEnum = function (value, alias) {
                BaseEnum.call(this, value, alias)
            };
            Class(NamedEnum, BaseEnum, null, {
                toString: function () {
                    var clazz = NamedEnum.__type;
                    if (!clazz) {
                        clazz = this.getClassName()
                    }
                    return '<' + clazz + ' ' + this.getName() + ': ' + this.getValue() + '>'
                }
            });
            NamedEnum.__type = type;
            return NamedEnum
        };
        mk.type.Enum = function (enumeration, elements) {
            if (IObject.isString(enumeration)) {
                enumeration = enum_class(enumeration)
            } else if (!enumeration) {
                enumeration = enum_class(null)
            } else {
                Class(enumeration, BaseEnum, null, null)
            }
            Mapper.forEach(elements, function (alias, value) {
                if (value instanceof BaseEnum) {
                    value = value.getValue()
                } else if (typeof value !== 'number') {
                    throw new TypeError('Enum value must be a number!');
                }
                enumeration[alias] = new enumeration(value, alias);
                return false
            });
            return enumeration
        };
        var Enum = mk.type.Enum;
        Enum.isEnum = function (obj) {
            return obj instanceof BaseEnum
        };
        Enum.getInt = function (obj) {
            if (obj instanceof BaseEnum) {
                return obj.getValue()
            } else if (IObject.isNumber(obj)) {
                return obj
            }
            return obj.valueOf()
        };
        mk.type.Set = Interface(null, [IObject]);
        var Set = mk.type.Set;
        Set.prototype = {
            isEmpty: function () {
            }, getLength: function () {
            }, contains: function (element) {
            }, add: function (element) {
            }, remove: function (element) {
            }, clear: function () {
            }, toArray: function () {
            }
        };
        mk.type.HashSet = function () {
            BaseObject.call(this);
            this.__array = []
        };
        var HashSet = mk.type.HashSet;
        Class(HashSet, BaseObject, [Set], {
            equals: function (other) {
                if (Interface.conforms(other, Set)) {
                    if (this === other) {
                        return true
                    }
                    other = other.valueOf()
                }
                return Arrays.equals(this.__array, other)
            }, valueOf: function () {
                return this.__array
            }, toString: function () {
                return this.__array.toString()
            }, isEmpty: function () {
                return this.__array.length === 0
            }, getLength: function () {
                return this.__array.length
            }, contains: function (item) {
                var pos = Arrays.find(this.__array, item);
                return pos >= 0
            }, add: function (item) {
                var pos = Arrays.find(this.__array, item);
                if (pos < 0) {
                    this.__array.push(item);
                    return true
                } else {
                    return false
                }
            }, remove: function (item) {
                return Arrays.remove(this.__array, item)
            }, clear: function () {
                this.__array = []
            }, toArray: function () {
                return this.__array.slice()
            }
        });
        mk.type.Stringer = Interface(null, [IObject]);
        var Stringer = mk.type.Stringer;
        Stringer.prototype = {
            isEmpty: function () {
            }, getLength: function () {
            }, equalsIgnoreCase: function (other) {
            }
        };
        mk.type.ConstantString = function (str) {
            BaseObject.call(this);
            if (!str) {
                str = ''
            } else if (Interface.conforms(str, Stringer)) {
                str = str.toString()
            }
            this.__string = str
        };
        var ConstantString = mk.type.ConstantString;
        Class(ConstantString, BaseObject, [Stringer], {
            equals: function (other) {
                if (Interface.conforms(other, Stringer)) {
                    if (this === other) {
                        return true
                    }
                    other = other.valueOf()
                }
                return this.__string === other
            }, valueOf: function () {
                return this.__string
            }, toString: function () {
                return this.__string
            }, isEmpty: function () {
                return this.__string.length === 0
            }, getLength: function () {
                return this.__string.length
            }, equalsIgnoreCase: function (other) {
                if (this === other) {
                    return true
                } else if (!other) {
                    return !this.__string
                } else if (Interface.conforms(other, Stringer)) {
                    return equalsIgnoreCase(this.__string, other.toString())
                } else {
                    return equalsIgnoreCase(this.__string, other)
                }
            }
        });
        var equalsIgnoreCase = function (str1, str2) {
            if (str1.length !== str2.length) {
                return false
            }
            var low1 = str1.toLowerCase();
            var low2 = str2.toLowerCase();
            return low1 === low2
        };
        mk.type.Mapper = Interface(null, [IObject]);
        var Mapper = mk.type.Mapper;
        Mapper.prototype = {
            toMap: function () {
            }, copyMap: function (deepCopy) {
            }, isEmpty: function () {
            }, getLength: function () {
            }, allKeys: function () {
            }, getValue: function (key) {
            }, setValue: function (key, value) {
            }, removeValue: function (key) {
            }, getString: function (key, defaultValue) {
            }, getBoolean: function (key, defaultValue) {
            }, getInt: function (key, defaultValue) {
            }, getFloat: function (key, defaultValue) {
            }, getDateTime: function (key, defaultValue) {
            }, setDateTime: function (key, time) {
            }, setString: function (key, stringer) {
            }, setMap: function (key, mapper) {
            }
        };
        Mapper.count = function (dict) {
            if (!dict) {
                return 0
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            } else if (typeof dict !== 'object') {
                throw TypeError('not a map: ' + dict);
            }
            return Object.keys(dict).length
        };
        Mapper.isEmpty = function (dict) {
            return Mapper.count(dict) === 0
        };
        Mapper.keys = function (dict) {
            if (!dict) {
                return null
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            } else if (typeof dict !== 'object') {
                throw TypeError('not a map: ' + dict);
            }
            return Object.keys(dict)
        };
        Mapper.removeKey = function (dict, key) {
            if (!dict) {
                return null
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            } else if (typeof dict !== 'object') {
                throw TypeError('not a map: ' + dict);
            }
            var value = dict[key];
            delete dict[key];
            return value
        };
        Mapper.forEach = function (dict, handleKeyValue) {
            if (!dict) {
                return -1
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            } else if (typeof dict !== 'object') {
                throw TypeError('not a map: ' + dict);
            }
            var keys = Object.keys(dict);
            var cnt = keys.length;
            var stop;
            var i = 0, k, v;
            for (; i < cnt; ++i) {
                k = keys[i];
                v = dict[k];
                stop = handleKeyValue(k, v);
                if (stop) {
                    break
                }
            }
            return i
        };
        Mapper.addAll = function (dict, fromDict) {
            if (!dict) {
                return -1
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            } else if (typeof dict !== 'object') {
                throw TypeError('not a map: ' + dict);
            }
            return Mapper.forEach(fromDict, function (key, value) {
                dict[key] = value;
                return false
            })
        };
        mk.type.Dictionary = function (dict) {
            BaseObject.call(this);
            if (!dict) {
                dict = {}
            } else if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap()
            }
            this.__dictionary = dict
        };
        var Dictionary = mk.type.Dictionary;
        Class(Dictionary, BaseObject, [Mapper], {
            equals: function (other) {
                if (Interface.conforms(other, Mapper)) {
                    if (this === other) {
                        return true
                    }
                    other = other.valueOf()
                }
                return Arrays.equals(this.__dictionary, other)
            }, valueOf: function () {
                return this.__dictionary
            }, toString: function () {
                return mk.format.JSON.encode(this.__dictionary)
            }, toMap: function () {
                return this.__dictionary
            }, copyMap: function (deepCopy) {
                if (deepCopy) {
                    return Copier.deepCopyMap(this.__dictionary)
                } else {
                    return Copier.copyMap(this.__dictionary)
                }
            }, isEmpty: function () {
                var keys = Object.keys(this.__dictionary);
                return keys.length === 0
            }, getLength: function () {
                var keys = Object.keys(this.__dictionary);
                return keys.length
            }, allKeys: function () {
                return Object.keys(this.__dictionary)
            }, getValue: function (key) {
                return this.__dictionary[key]
            }, setValue: function (key, value) {
                if (value) {
                    this.__dictionary[key] = value
                } else if (this.__dictionary.hasOwnProperty(key)) {
                    delete this.__dictionary[key]
                }
            }, removeValue: function (key) {
                var value;
                if (this.__dictionary.hasOwnProperty(key)) {
                    value = this.__dictionary[key];
                    delete this.__dictionary[key]
                } else {
                    value = null
                }
                return value
            }, getString: function (key, defaultValue) {
                var value = this.__dictionary[key];
                return Converter.getString(value, defaultValue)
            }, getBoolean: function (key, defaultValue) {
                var value = this.__dictionary[key];
                return Converter.getBoolean(value, defaultValue)
            }, getInt: function (key, defaultValue) {
                var value = this.__dictionary[key];
                return Converter.getInt(value, defaultValue)
            }, getFloat: function (key, defaultValue) {
                var value = this.__dictionary[key];
                return Converter.getFloat(value, defaultValue)
            }, getDateTime: function (key, defaultValue) {
                var value = this.__dictionary[key];
                return Converter.getDateTime(value, defaultValue)
            }, setDateTime: function (key, time) {
                if (!time) {
                    this.removeValue(key)
                } else if (time instanceof Date) {
                    time = time.getTime() / 1000.0;
                    this.__dictionary[key] = time
                } else {
                    time = Converter.getFloat(time, 0);
                    this.__dictionary[key] = time
                }
            }, setString: function (key, string) {
                if (!string) {
                    this.removeValue(key)
                } else {
                    this.__dictionary[key] = string.toString()
                }
            }, setMap: function (key, map) {
                if (!map) {
                    this.removeValue(key)
                } else {
                    this.__dictionary[key] = map.toMap()
                }
            }
        });
        mk.type.Wrapper = {
            fetchString: function (str) {
                if (Interface.conforms(str, Stringer)) {
                    return str.toString()
                } else if (typeof str === 'string') {
                    return str
                } else {
                    return null
                }
            }, fetchMap: function (dict) {
                if (Interface.conforms(dict, Mapper)) {
                    return dict.toMap()
                } else if (typeof dict === 'object') {
                    return dict
                } else {
                    return null
                }
            }, unwrap: function (object) {
                if (IObject.isNull(object)) {
                    return null
                } else if (IObject.isBaseType(object)) {
                    return object
                } else if (Enum.isEnum(object)) {
                    return object.getValue()
                } else if (Interface.conforms(object, Stringer)) {
                    return object.toString()
                } else if (Interface.conforms(object, Mapper)) {
                    return this.unwrapMap(object.toMap())
                } else if (!Arrays.isArray(object)) {
                    return this.unwrapMap(object)
                } else if (object instanceof Array) {
                    return this.unwrapList(object)
                } else {
                    return object
                }
            }, unwrapMap: function (dict) {
                var result = {};
                Mapper.forEach(dict, function (key, value) {
                    result[key] = Wrapper.unwrap(value);
                    return false
                });
                return result
            }, unwrapList: function (array) {
                var result = [];
                var count = array.length;
                for (var i = 0; i < count; ++i) {
                    result[i] = this.unwrap(array[i])
                }
                return result
            }
        };
        var Wrapper = mk.type.Wrapper;
        mk.type.Copier = {
            copy: function (object) {
                if (IObject.isNull(object)) {
                    return null
                } else if (IObject.isBaseType(object)) {
                    return object
                } else if (Enum.isEnum(object)) {
                    return object.getValue()
                } else if (Interface.conforms(object, Stringer)) {
                    return object.toString()
                } else if (Interface.conforms(object, Mapper)) {
                    return this.copyMap(object.toMap())
                } else if (!Arrays.isArray(object)) {
                    return this.copyMap(object)
                } else if (object instanceof Array) {
                    return this.copyList(object)
                } else {
                    return object
                }
            }, copyMap: function (dict) {
                var clone = {};
                Mapper.forEach(dict, function (key, value) {
                    clone[key] = value;
                    return false
                });
                return clone
            }, copyList: function (array) {
                var clone = [];
                var count = array.length;
                for (var i = 0; i < count; ++i) {
                    clone.push(array[i])
                }
                return clone
            }, deepCopy: function (object) {
                if (IObject.isNull(object)) {
                    return null
                } else if (IObject.isBaseType(object)) {
                    return object
                } else if (Enum.isEnum(object)) {
                    return object.getValue()
                } else if (Interface.conforms(object, Stringer)) {
                    return object.toString()
                } else if (Interface.conforms(object, Mapper)) {
                    return this.deepCopyMap(object.toMap())
                } else if (!Arrays.isArray(object)) {
                    return this.deepCopyMap(object)
                } else if (object instanceof Array) {
                    return this.deepCopyList(object)
                } else {
                    return object
                }
            }, deepCopyMap: function (dict) {
                var clone = {};
                Mapper.forEach(dict, function (key, value) {
                    clone[key] = Copier.deepCopy(value);
                    return false
                });
                return clone
            }, deepCopyList: function (array) {
                var clone = [];
                var count = array.length;
                for (var i = 0; i < count; ++i) {
                    clone.push(this.deepCopy(array[i]))
                }
                return clone
            }
        };
        var Copier = mk.type.Copier;
        mk.digest.MessageDigester = Interface(null, null);
        var MessageDigester = mk.digest.MessageDigester;
        MessageDigester.prototype = {
            digest: function (data) {
            }
        };
        mk.digest.SHA256 = {
            digest: function (data) {
                return this.getDigester().digest(data)
            }, getDigester: function () {
                return sha256Digester
            }, setDigester: function (digester) {
                sha256Digester = digester
            }
        };
        var SHA256 = mk.digest.SHA256;
        var sha256Digester = null;
        mk.digest.RIPEMD160 = {
            digest: function (data) {
                return this.getDigester().digest(data)
            }, getDigester: function () {
                return ripemd160Digester
            }, setDigester: function (digester) {
                ripemd160Digester = digester
            }
        };
        var RIPEMD160 = mk.digest.RIPEMD160;
        var ripemd160Digester = null;
        mk.digest.KECCAK256 = {
            digest: function (data) {
                return this.getDigester().digest(data)
            }, getDigester: function () {
                return keccak256Digester
            }, setDigester: function (digester) {
                keccak256Digester = digester
            }
        };
        var KECCAK256 = mk.digest.KECCAK256;
        var keccak256Digester = null;
        mk.format.DataCoder = Interface(null, null);
        var DataCoder = mk.format.DataCoder;
        DataCoder.prototype = {
            encode: function (data) {
            }, decode: function (string) {
            }
        };
        mk.format.ObjectCoder = Interface(null, null);
        var ObjectCoder = mk.format.ObjectCoder;
        ObjectCoder.prototype = {
            encode: function (object) {
            }, decode: function (string) {
            }
        };
        mk.format.StringCoder = Interface(null, null);
        var StringCoder = mk.format.StringCoder;
        StringCoder.prototype = {
            encode: function (string) {
            }, decode: function (data) {
            }
        };
        mk.format.Hex = {
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
        var Hex = mk.format.Hex;
        var hexCoder = null;
        mk.format.Base58 = {
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
        var Base58 = mk.format.Base58;
        var base58Coder = null;
        mk.format.Base64 = {
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
        var Base64 = mk.format.Base64;
        var base64Coder = null;
        mk.format.UTF8 = {
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
        var UTF8 = mk.format.UTF8;
        var utf8Coder = null;
        mk.format.JSON = {
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
        mk.format.JSONMap = {
            encode: function (dictionary) {
                return this.getCoder().encode(dictionary)
            }, decode: function (string) {
                return this.getCoder().decode(string)
            }, getCoder: function () {
                return jsonCoder
            }, setCoder: function (coder) {
                jsonCoder = coder
            }
        };
        var JSONMap = mk.format.JSONMap;
        mk.protocol.TransportableData = Interface(null, [Mapper]);
        var TransportableData = mk.protocol.TransportableData;
        TransportableData.prototype = {
            getAlgorithm: function () {
            }, getData: function () {
            }, toString: function () {
            }, toObject: function () {
            }
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
        TransportableData.create = function (data, algorithm) {
            var helper = FormatExtensions.getTEDHelper();
            return helper.createTransportableData(data, algorithm)
        };
        TransportableData.parse = function (ted) {
            var helper = FormatExtensions.getTEDHelper();
            return helper.parseTransportableData(ted)
        };
        TransportableData.setFactory = function (algorithm, factory) {
            var helper = FormatExtensions.getTEDHelper();
            return helper.setTransportableDataFactory(algorithm, factory)
        };
        TransportableData.getFactory = function (algorithm) {
            var helper = FormatExtensions.getTEDHelper();
            return helper.getTransportableDataFactory(algorithm)
        };
        TransportableData.Factory = Interface(null, null);
        var TransportableDataFactory = TransportableData.Factory;
        TransportableDataFactory.prototype = {
            createTransportableData: function (data) {
            }, parseTransportableData: function (ted) {
            }
        };
        mk.protocol.PortableNetworkFile = Interface(null, [Mapper]);
        var PortableNetworkFile = mk.protocol.PortableNetworkFile;
        PortableNetworkFile.prototype = {
            setData: function (fileData) {
            }, getData: function () {
            }, setFilename: function (filename) {
            }, getFilename: function () {
            }, setURL: function (url) {
            }, getURL: function () {
            }, setPassword: function (key) {
            }, getPassword: function () {
            }, toString: function () {
            }, toObject: function () {
            }
        };
        PortableNetworkFile.createFromURL = function (url, password) {
            return PortableNetworkFile.create(null, null, url, password)
        };
        PortableNetworkFile.createFromData = function (ted, filename) {
            return PortableNetworkFile.create(ted, filename, null, null)
        };
        PortableNetworkFile.create = function (ted, filename, url, password) {
            var helper = FormatExtensions.getPNFHelper();
            return helper.createPortableNetworkFile(ted, filename, url, password)
        };
        PortableNetworkFile.parse = function (pnf) {
            var helper = FormatExtensions.getPNFHelper();
            return helper.parsePortableNetworkFile(pnf)
        };
        PortableNetworkFile.setFactory = function (factory) {
            var helper = FormatExtensions.getPNFHelper();
            return helper.setPortableNetworkFileFactory(factory)
        };
        PortableNetworkFile.getFactory = function () {
            var helper = FormatExtensions.getPNFHelper();
            return helper.getPortableNetworkFileFactory()
        };
        PortableNetworkFile.Factory = Interface(null, null);
        var PortableNetworkFileFactory = PortableNetworkFile.Factory;
        PortableNetworkFileFactory.prototype = {
            createPortableNetworkFile: function (ted, filename, url, password) {
            }, parsePortableNetworkFile: function (pnf) {
            }
        };
        mk.protocol.CryptographyKey = Interface(null, [Mapper]);
        var CryptographyKey = mk.protocol.CryptographyKey;
        CryptographyKey.prototype = {
            getAlgorithm: function () {
            }, getData: function () {
            }
        };
        mk.protocol.EncryptKey = Interface(null, [CryptographyKey]);
        var EncryptKey = mk.protocol.EncryptKey;
        EncryptKey.prototype = {
            encrypt: function (plaintext, extra) {
            }
        };
        mk.protocol.DecryptKey = Interface(null, [CryptographyKey]);
        var DecryptKey = mk.protocol.DecryptKey;
        DecryptKey.prototype = {
            decrypt: function (ciphertext, params) {
            }, matchEncryptKey: function (pKey) {
            }
        };
        mk.protocol.AsymmetricKey = Interface(null, [CryptographyKey]);
        var AsymmetricKey = mk.protocol.AsymmetricKey;
        mk.protocol.SignKey = Interface(null, [AsymmetricKey]);
        var SignKey = mk.protocol.SignKey;
        SignKey.prototype = {
            sign: function (data) {
            }
        };
        mk.protocol.VerifyKey = Interface(null, [AsymmetricKey]);
        var VerifyKey = mk.protocol.VerifyKey;
        VerifyKey.prototype = {
            verify: function (data, signature) {
            }, matchSignKey: function (sKey) {
            }
        };
        mk.protocol.SymmetricKey = Interface(null, [EncryptKey, DecryptKey]);
        var SymmetricKey = mk.protocol.SymmetricKey;
        SymmetricKey.generate = function (algorithm) {
            var helper = CryptoExtensions.getSymmetricHelper();
            return helper.generateSymmetricKey(algorithm)
        };
        SymmetricKey.parse = function (key) {
            var helper = CryptoExtensions.getSymmetricHelper();
            return helper.parseSymmetricKey(key)
        };
        SymmetricKey.setFactory = function (algorithm, factory) {
            var helper = CryptoExtensions.getSymmetricHelper();
            helper.setSymmetricKeyFactory(algorithm, factory)
        };
        SymmetricKey.getFactory = function (algorithm) {
            var helper = CryptoExtensions.getSymmetricHelper();
            return helper.getSymmetricKeyFactory(algorithm)
        };
        SymmetricKey.Factory = Interface(null, null);
        var SymmetricKeyFactory = SymmetricKey.Factory;
        SymmetricKeyFactory.prototype = {
            generateSymmetricKey: function () {
            }, parseSymmetricKey: function (key) {
            }
        };
        mk.protocol.PublicKey = Interface(null, [VerifyKey]);
        var PublicKey = mk.protocol.PublicKey;
        PublicKey.parse = function (key) {
            var helper = CryptoExtensions.getPublicHelper();
            return helper.parsePublicKey(key)
        };
        PublicKey.setFactory = function (algorithm, factory) {
            var helper = CryptoExtensions.getPublicHelper();
            helper.setPublicKeyFactory(algorithm, factory)
        };
        PublicKey.getFactory = function (algorithm) {
            var helper = CryptoExtensions.getPublicHelper();
            return helper.getPublicKeyFactory(algorithm)
        };
        PublicKey.Factory = Interface(null, null);
        var PublicKeyFactory = PublicKey.Factory;
        PublicKeyFactory.prototype = {
            parsePublicKey: function (key) {
            }
        };
        mk.protocol.PrivateKey = Interface(null, [SignKey]);
        var PrivateKey = mk.protocol.PrivateKey;
        PrivateKey.prototype = {
            getPublicKey: function () {
            }
        };
        PrivateKey.generate = function (algorithm) {
            var helper = CryptoExtensions.getPrivateHelper();
            return helper.generatePrivateKey(algorithm)
        };
        PrivateKey.parse = function (key) {
            var helper = CryptoExtensions.getPrivateHelper();
            return helper.parsePrivateKey(key)
        };
        PrivateKey.setFactory = function (algorithm, factory) {
            var helper = CryptoExtensions.getPrivateHelper();
            helper.setPrivateKeyFactory(algorithm, factory)
        };
        PrivateKey.getFactory = function (algorithm) {
            var helper = CryptoExtensions.getPrivateHelper();
            return helper.getPrivateKeyFactory(algorithm)
        };
        PrivateKey.Factory = Interface(null, null);
        var PrivateKeyFactory = PrivateKey.Factory;
        PrivateKeyFactory.prototype = {
            generatePrivateKey: function () {
            }, parsePrivateKey: function (key) {
            }
        };
        mk.ext.PublicKeyHelper = Interface(null, null);
        var PublicKeyHelper = mk.ext.PublicKeyHelper;
        PublicKeyHelper.prototype = {
            setPublicKeyFactory: function (algorithm, factory) {
            }, getPublicKeyFactory: function (algorithm) {
            }, parsePublicKey: function (key) {
            }
        };
        mk.ext.PrivateKeyHelper = Interface(null, null);
        var PrivateKeyHelper = mk.ext.PrivateKeyHelper;
        PrivateKeyHelper.prototype = {
            setPrivateKeyFactory: function (algorithm, factory) {
            }, getPrivateKeyFactory: function (algorithm) {
            }, generatePrivateKey: function (algorithm) {
            }, parsePrivateKey: function (key) {
            }
        };
        mk.ext.SymmetricKeyHelper = Interface(null, null);
        var SymmetricKeyHelper = mk.ext.SymmetricKeyHelper;
        SymmetricKeyHelper.prototype = {
            setSymmetricKeyFactory: function (algorithm, factory) {
            }, getSymmetricKeyFactory: function (algorithm) {
            }, generateSymmetricKey: function (algorithm) {
            }, parseSymmetricKey: function (key) {
            }
        };
        mk.ext.CryptoExtensions = {
            setPublicHelper: function (helper) {
                publicHelper = helper
            }, getPublicHelper: function () {
                return publicHelper
            }, setPrivateHelper: function (helper) {
                privateHelper = helper
            }, getPrivateHelper: function () {
                return privateHelper
            }, setSymmetricHelper: function (helper) {
                symmetricHelper = helper
            }, getSymmetricHelper: function () {
                return symmetricHelper
            }
        };
        var CryptoExtensions = mk.ext.CryptoExtensions;
        var publicHelper = null;
        var privateHelper = null;
        var symmetricHelper = null;
        mk.ext.GeneralCryptoHelper = Interface(null, null);
        var GeneralCryptoHelper = mk.ext.GeneralCryptoHelper;
        GeneralCryptoHelper.prototype = {
            getKeyAlgorithm: function (key, defaultValue) {
            }
        };
        GeneralCryptoHelper.PROMISE = 'Moky loves May Lee forever!';
        var sample_data = function () {
            var promise = GeneralCryptoHelper.PROMISE;
            if (promise instanceof Uint8Array) {
                return promise
            } else {
                var data = UTF8.encode(promise);
                GeneralCryptoHelper.PROMISE = data;
                return data
            }
        };
        GeneralCryptoHelper.matchAsymmetricKeys = function (sKey, pKey) {
            var promise = sample_data();
            var signature = sKey.sign(promise);
            return pKey.verify(promise, signature)
        };
        GeneralCryptoHelper.matchSymmetricKeys = function (encKey, decKey) {
            var promise = sample_data();
            var params = {};
            var ciphertext = encKey.encrypt(promise, params);
            var plaintext = decKey.decrypt(ciphertext, params);
            return plaintext && Arrays.equals(plaintext, promise)
        };
        mk.ext.SharedCryptoExtensions = {
            setPublicHelper: function (helper) {
                CryptoExtensions.setPublicHelper(helper)
            }, getPublicHelper: function () {
                return CryptoExtensions.getPublicHelper()
            }, setPrivateHelper: function (helper) {
                CryptoExtensions.setPrivateHelper(helper)
            }, getPrivateHelper: function () {
                return CryptoExtensions.getPrivateHelper()
            }, setSymmetricHelper: function (helper) {
                CryptoExtensions.setSymmetricHelper(helper)
            }, getSymmetricHelper: function () {
                return CryptoExtensions.getSymmetricHelper()
            }, setHelper: function (helper) {
                generalCryptoHelper = helper
            }, getHelper: function () {
                return generalCryptoHelper
            }
        };
        var SharedCryptoExtensions = mk.ext.SharedCryptoExtensions;
        var generalCryptoHelper = null;
        mk.ext.TransportableDataHelper = Interface(null, null);
        var TransportableDataHelper = mk.ext.TransportableDataHelper;
        TransportableDataHelper.prototype = {
            setTransportableDataFactory: function (algorithm, factory) {
            }, getTransportableDataFactory: function (algorithm) {
            }, createTransportableData: function (data, algorithm) {
            }, parseTransportableData: function (ted) {
            }
        };
        mk.ext.PortableNetworkFileHelper = Interface(null, null);
        var PortableNetworkFileHelper = mk.ext.PortableNetworkFileHelper;
        PortableNetworkFileHelper.prototype = {
            setPortableNetworkFileFactory: function (factory) {
            }, getPortableNetworkFileFactory: function () {
            }, createPortableNetworkFile: function (data, filename, url, password) {
            }, parsePortableNetworkFile: function (pnf) {
            }
        };
        mk.ext.FormatExtensions = {
            setTEDHelper: function (helper) {
                tedHelper = helper
            }, getTEDHelper: function () {
                return tedHelper
            }, setPNFHelper: function (helper) {
                pnfHelper = helper
            }, getPNFHelper: function () {
                return pnfHelper
            }
        };
        var FormatExtensions = mk.ext.FormatExtensions;
        var tedHelper = null;
        var pnfHelper = null;
        mk.ext.GeneralFormatHelper = Interface(null, null);
        var GeneralFormatHelper = mk.ext.GeneralFormatHelper;
        GeneralFormatHelper.prototype = {
            getFormatAlgorithm: function (ted, defaultValue) {
            }
        };
        mk.ext.SharedFormatExtensions = {
            setTEDHelper: function (helper) {
                FormatExtensions.setTEDHelper(helper)
            }, getTEDHelper: function () {
                return FormatExtensions.getTEDHelper()
            }, setPNFHelper: function (helper) {
                FormatExtensions.setPNFHelper(helper)
            }, getPNFHelper: function () {
                return FormatExtensions.getPNFHelper()
            }, setHelper: function (helper) {
                generalFormatHelper = helper
            }, getHelper: function () {
                return generalFormatHelper
            }
        };
        var SharedFormatExtensions = mk.ext.SharedFormatExtensions;
        var generalFormatHelper = null
    })(MONKEY);
    if (typeof MingKeMing !== 'object') {
        MingKeMing = {}
    }
    (function (mkm, mk) {
        if (typeof mkm.protocol !== 'object') {
            mkm.protocol = {}
        }
        if (typeof mkm.mkm !== 'object') {
            mkm.mkm = {}
        }
        if (typeof mkm.ext !== 'object') {
            mkm.ext = {}
        }
        var Interface = mk.type.Interface;
        var Class = mk.type.Class;
        var IObject = mk.type.Object;
        var Stringer = mk.type.Stringer;
        var Mapper = mk.type.Mapper;
        var Enum = mk.type.Enum;
        var ConstantString = mk.type.ConstantString;
        mkm.protocol.EntityType = Enum('EntityType', {
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
        var EntityType = mkm.protocol.EntityType;
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
        mkm.protocol.Address = Interface(null, [Stringer]);
        var Address = mkm.protocol.Address;
        Address.prototype.getType = function () {
        };
        Address.ANYWHERE = null;
        Address.EVERYWHERE = null;
        Address.generate = function (meta, network) {
            var helper = AccountExtensions.getAddressHelper();
            return helper.generateAddress(meta, network)
        };
        Address.parse = function (address) {
            var helper = AccountExtensions.getAddressHelper();
            return helper.parseAddress(address)
        };
        Address.setFactory = function (factory) {
            var helper = AccountExtensions.getAddressHelper();
            helper.setAddressFactory(factory)
        };
        Address.getFactory = function () {
            var helper = AccountExtensions.getAddressHelper();
            return helper.getAddressFactory()
        };
        Address.Factory = Interface(null, null);
        var AddressFactory = Address.Factory;
        AddressFactory.prototype.generateAddress = function (meta, network) {
        };
        AddressFactory.prototype.parseAddress = function (address) {
        };
        mkm.protocol.ID = Interface(null, [Stringer]);
        var ID = mkm.protocol.ID;
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
        ID.ANYONE = null;
        ID.EVERYONE = null;
        ID.FOUNDER = null;
        ID.convert = function (array) {
            var members = [];
            var did;
            for (var i = 0; i < array.length; ++i) {
                did = ID.parse(array[i]);
                if (did) {
                    members.push(did)
                }
            }
            return members
        };
        ID.revert = function (identifiers) {
            var array = [];
            var did;
            for (var i = 0; i < identifiers.length; ++i) {
                did = identifiers[i];
                if (Interface.conforms(did, Stringer)) {
                    array.push(did.toString())
                } else if (IObject.isString(did)) {
                    array.push(did)
                }
            }
            return array
        };
        ID.generate = function (meta, network, terminal) {
            var helper = AccountExtensions.getIdentifierHelper();
            return helper.generateIdentifier(meta, network, terminal)
        };
        ID.create = function (name, address, terminal) {
            var helper = AccountExtensions.getIdentifierHelper();
            return helper.createIdentifier(name, address, terminal)
        };
        ID.parse = function (identifier) {
            var helper = AccountExtensions.getIdentifierHelper();
            return helper.parseIdentifier(identifier)
        };
        ID.setFactory = function (factory) {
            var helper = AccountExtensions.getIdentifierHelper();
            helper.setIdentifierFactory(factory)
        };
        ID.getFactory = function () {
            var helper = AccountExtensions.getIdentifierHelper();
            return helper.getIdentifierFactory()
        };
        ID.Factory = Interface(null, null);
        var IDFactory = ID.Factory;
        IDFactory.prototype.generateIdentifier = function (meta, network, terminal) {
        };
        IDFactory.prototype.createIdentifier = function (name, address, terminal) {
        };
        IDFactory.prototype.parseIdentifier = function (identifier) {
        };
        mkm.protocol.Meta = Interface(null, [Mapper]);
        var Meta = mkm.protocol.Meta;
        Meta.prototype.getType = function () {
        };
        Meta.prototype.getPublicKey = function () {
        };
        Meta.prototype.getSeed = function () {
        };
        Meta.prototype.getFingerprint = function () {
        };
        Meta.prototype.isValid = function () {
        };
        Meta.prototype.generateAddress = function (network) {
        };
        Meta.create = function (type, key, seed, fingerprint) {
            var helper = AccountExtensions.getMetaHelper();
            return helper.createMeta(type, key, seed, fingerprint)
        };
        Meta.generate = function (type, sKey, seed) {
            var helper = AccountExtensions.getMetaHelper();
            return helper.generateMeta(type, sKey, seed)
        };
        Meta.parse = function (meta) {
            var helper = AccountExtensions.getMetaHelper();
            return helper.parseMeta(meta)
        };
        Meta.setFactory = function (type, factory) {
            var helper = AccountExtensions.getMetaHelper();
            helper.setMetaFactory(type, factory)
        };
        Meta.getFactory = function (type) {
            var helper = AccountExtensions.getMetaHelper();
            return helper.getMetaFactory(type)
        };
        Meta.Factory = Interface(null, null);
        var MetaFactory = Meta.Factory;
        MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        };
        MetaFactory.prototype.generateMeta = function (sKey, seed) {
        };
        MetaFactory.prototype.parseMeta = function (meta) {
        };
        mkm.protocol.TAI = Interface(null, null);
        var TAI = mkm.protocol.TAI;
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
        mkm.protocol.Document = Interface(null, [TAI, Mapper]);
        var Document = mkm.protocol.Document;
        Document.prototype.getIdentifier = function () {
        };
        Document.prototype.getTime = function () {
        };
        Document.prototype.setName = function (name) {
        };
        Document.prototype.getName = function () {
        };
        Document.convert = function (array) {
            var documents = [];
            var doc;
            for (var i = 0; i < array.length; ++i) {
                doc = Document.parse(array[i]);
                if (doc) {
                    documents.push(doc)
                }
            }
            return documents
        };
        Document.revert = function (documents) {
            var array = [];
            var doc;
            for (var i = 0; i < documents.length; ++i) {
                doc = documents[i];
                if (Interface.conforms(doc, Mapper)) {
                    array.push(doc.toMap())
                } else {
                    array.push(doc)
                }
            }
            return array
        };
        Document.create = function (type, identifier, data, signature) {
            var helper = AccountExtensions.getDocumentHelper();
            return helper.createDocument(type, identifier, data, signature)
        };
        Document.parse = function (doc) {
            var helper = AccountExtensions.getDocumentHelper();
            return helper.parseDocument(doc)
        };
        Document.setFactory = function (type, factory) {
            var helper = AccountExtensions.getDocumentHelper();
            helper.setDocumentFactory(type, factory)
        };
        Document.getFactory = function (type) {
            var helper = AccountExtensions.getDocumentHelper();
            return helper.getDocumentFactory(type)
        };
        Document.Factory = Interface(null, null);
        var DocumentFactory = Document.Factory;
        DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
        };
        DocumentFactory.prototype.parseDocument = function (doc) {
        };
        mkm.mkm.BroadcastAddress = function (string, network) {
            ConstantString.call(this, string);
            this.__network = Enum.getInt(network)
        };
        var BroadcastAddress = mkm.mkm.BroadcastAddress;
        Class(BroadcastAddress, ConstantString, [Address], {
            getType: function () {
                return this.__network
            }
        });
        Address.ANYWHERE = new BroadcastAddress('anywhere', EntityType.ANY);
        Address.EVERYWHERE = new BroadcastAddress('everywhere', EntityType.EVERY);
        mkm.mkm.Identifier = function (identifier, name, address, terminal) {
            ConstantString.call(this, identifier);
            this.__name = name;
            this.__address = address;
            this.__terminal = terminal
        };
        var Identifier = mkm.mkm.Identifier;
        Class(Identifier, ConstantString, [ID], {
            getName: function () {
                return this.__name
            }, getAddress: function () {
                return this.__address
            }, getTerminal: function () {
                return this.__terminal
            }, getType: function () {
                var address = this.__address;
                return address.getType()
            }, isBroadcast: function () {
                var network = this.getType();
                return EntityType.isBroadcast(network)
            }, isUser: function () {
                var network = this.getType();
                return EntityType.isUser(network)
            }, isGroup: function () {
                var network = this.getType();
                return EntityType.isGroup(network)
            }
        });
        Identifier.create = function (name, address, terminal) {
            var string = Identifier.concat(name, address, terminal);
            return new Identifier(string, name, address, terminal)
        };
        Identifier.concat = function (name, address, terminal) {
            var string = address.toString();
            if (name && name.length > 0) {
                string = name + '@' + string
            }
            if (terminal && terminal.length > 0) {
                string = string + '/' + terminal
            }
            return string
        };
        ID.ANYONE = Identifier.create("anyone", Address.ANYWHERE, null);
        ID.EVERYONE = Identifier.create("everyone", Address.EVERYWHERE, null);
        ID.FOUNDER = Identifier.create("moky", Address.ANYWHERE, null);
        mkm.ext.AddressHelper = Interface(null, null);
        var AddressHelper = mkm.ext.AddressHelper;
        AddressHelper.prototype = {
            setAddressFactory: function (factory) {
            }, getAddressFactory: function () {
            }, parseAddress: function (address) {
            }, generateAddress: function (meta, network) {
            }
        };
        mkm.ext.IdentifierHelper = Interface(null, null);
        var IdentifierHelper = mkm.ext.IdentifierHelper;
        IdentifierHelper.prototype = {
            setIdentifierFactory: function (factory) {
            }, getIdentifierFactory: function () {
            }, parseIdentifier: function (identifier) {
            }, createIdentifier: function (name, address, terminal) {
            }, generateIdentifier: function (meta, network, terminal) {
            }
        };
        mkm.ext.MetaHelper = Interface(null, null);
        var MetaHelper = mkm.ext.MetaHelper;
        MetaHelper.prototype = {
            setMetaFactory: function (type, factory) {
            }, getMetaFactory: function (type) {
            }, createMeta: function (type, key, seed, fingerprint) {
            }, generateMeta: function (type, sKey, seed) {
            }, parseMeta: function (meta) {
            }
        };
        mkm.ext.DocumentHelper = Interface(null, null);
        var DocumentHelper = mkm.ext.DocumentHelper;
        DocumentHelper.prototype = {
            setDocumentFactory: function (type, factory) {
            }, getDocumentFactory: function (type) {
            }, createDocument: function (type, identifier, data, signature) {
            }, parseDocument: function (doc) {
            }
        };
        mkm.ext.AccountExtensions = {
            setAddressHelper: function (helper) {
                addressHelper = helper
            }, getAddressHelper: function () {
                return addressHelper
            }, setIdentifierHelper: function (helper) {
                idHelper = helper
            }, getIdentifierHelper: function () {
                return idHelper
            }, setMetaHelper: function (helper) {
                metaHelper = helper
            }, getMetaHelper: function () {
                return metaHelper
            }, setDocumentHelper: function (helper) {
                docHelper = helper
            }, getDocumentHelper: function () {
                return docHelper
            }
        };
        var AccountExtensions = mkm.ext.AccountExtensions;
        var addressHelper = null;
        var idHelper = null;
        var metaHelper = null;
        var docHelper = null;
        mkm.ext.GeneralAccountHelper = Interface(null, null);
        var GeneralAccountHelper = mkm.ext.GeneralAccountHelper;
        GeneralAccountHelper.prototype = {
            getMetaType: function (meta, defaultValue) {
            }, getDocumentType: function (doc, defaultValue) {
            }
        };
        mkm.ext.SharedAccountExtensions = {
            setAddressHelper: function (helper) {
                AccountExtensions.setAddressHelper(helper)
            }, getAddressHelper: function () {
                return AccountExtensions.getAddressHelper()
            }, setIdentifierHelper: function (helper) {
                AccountExtensions.setIdentifierHelper(helper)
            }, getIdentifierHelper: function () {
                return AccountExtensions.getIdentifierHelper()
            }, setMetaHelper: function (helper) {
                AccountExtensions.setMetaHelper(helper)
            }, getMetaHelper: function () {
                return AccountExtensions.getMetaHelper()
            }, setDocumentHelper: function (helper) {
                AccountExtensions.setDocumentHelper(helper)
            }, getDocumentHelper: function () {
                return AccountExtensions.getDocumentHelper()
            }, setHelper: function (helper) {
                generalAccountHelper = helper
            }, getHelper: function () {
                return generalAccountHelper
            }
        };
        var SharedAccountExtensions = mkm.ext.SharedAccountExtensions;
        var generalAccountHelper = null
    })(MingKeMing, MONKEY);
    if (typeof DaoKeDao !== 'object') {
        DaoKeDao = {}
    }
    (function (dkd, mk) {
        if (typeof dkd.protocol !== 'object') {
            dkd.protocol = {}
        }
        if (typeof dkd.ext !== 'object') {
            dkd.ext = {}
        }
        var Interface = mk.type.Interface;
        var Mapper = mk.type.Mapper;
        dkd.protocol.Content = Interface(null, [Mapper]);
        var Content = dkd.protocol.Content;
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
        Content.convert = function (array) {
            var contents = [];
            var msg;
            for (var i = 0; i < array.length; ++i) {
                msg = Content.parse(array[i]);
                if (msg) {
                    contents.push(msg)
                }
            }
            return contents
        };
        Content.revert = function (contents) {
            var array = [];
            var msg;
            for (var i = 0; i < contents.length; ++i) {
                msg = contents[i];
                if (Interface.conforms(msg, Mapper)) {
                    array.push(msg.toMap())
                } else {
                    array.push(msg)
                }
            }
            return array
        };
        Content.parse = function (content) {
            var helper = MessageExtensions.getContentHelper();
            return helper.parseContent(content)
        };
        Content.setFactory = function (type, factory) {
            var helper = MessageExtensions.getContentHelper();
            helper.setContentFactory(type, factory)
        };
        Content.getFactory = function (type) {
            var helper = MessageExtensions.getContentHelper();
            return helper.getContentFactory(type)
        };
        Content.Factory = Interface(null, null);
        var ContentFactory = Content.Factory;
        ContentFactory.prototype.parseContent = function (content) {
        };
        dkd.protocol.Envelope = Interface(null, [Mapper]);
        var Envelope = dkd.protocol.Envelope;
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
        Envelope.create = function (from, to, when) {
            var helper = MessageExtensions.getEnvelopeHelper();
            return helper.createEnvelope(from, to, when)
        };
        Envelope.parse = function (env) {
            var helper = MessageExtensions.getEnvelopeHelper();
            return helper.parseEnvelope(env)
        };
        Envelope.getFactory = function () {
            var helper = MessageExtensions.getEnvelopeHelper();
            return helper.getEnvelopeFactory()
        };
        Envelope.setFactory = function (factory) {
            var helper = MessageExtensions.getEnvelopeHelper();
            helper.setEnvelopeFactory(factory)
        };
        Envelope.Factory = Interface(null, null);
        var EnvelopeFactory = Envelope.Factory;
        EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        };
        EnvelopeFactory.prototype.parseEnvelope = function (env) {
        };
        dkd.protocol.Message = Interface(null, [Mapper]);
        var Message = dkd.protocol.Message;
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
        dkd.protocol.InstantMessage = Interface(null, [Message]);
        var InstantMessage = dkd.protocol.InstantMessage;
        InstantMessage.prototype.getContent = function () {
        };
        InstantMessage.convert = function (array) {
            var messages = [];
            var msg;
            for (var i = 0; i < array.length; ++i) {
                msg = InstantMessage.parse(array[i]);
                if (msg) {
                    messages.push(msg)
                }
            }
            return messages
        };
        InstantMessage.revert = function (messages) {
            var array = [];
            var msg;
            for (var i = 0; i < messages.length; ++i) {
                msg = messages[i];
                if (Interface.conforms(msg, Mapper)) {
                    array.push(msg.toMap())
                } else {
                    array.push(msg)
                }
            }
            return array
        };
        InstantMessage.generateSerialNumber = function (type, now) {
            var helper = MessageExtensions.getInstantHelper();
            return helper.generateSerialNumber(type, now)
        };
        InstantMessage.create = function (head, body) {
            var helper = MessageExtensions.getInstantHelper();
            return helper.createInstantMessage(head, body)
        };
        InstantMessage.parse = function (msg) {
            var helper = MessageExtensions.getInstantHelper();
            return helper.parseInstantMessage(msg)
        };
        InstantMessage.getFactory = function () {
            var helper = MessageExtensions.getInstantHelper();
            return helper.getInstantMessageFactory()
        };
        InstantMessage.setFactory = function (factory) {
            var helper = MessageExtensions.getInstantHelper();
            helper.setInstantMessageFactory(factory)
        };
        InstantMessage.Factory = Interface(null, null);
        var InstantMessageFactory = InstantMessage.Factory;
        InstantMessageFactory.prototype.generateSerialNumber = function (msgType, now) {
        };
        InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        };
        InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        };
        dkd.protocol.SecureMessage = Interface(null, [Message]);
        var SecureMessage = dkd.protocol.SecureMessage;
        SecureMessage.prototype.getData = function () {
        };
        SecureMessage.prototype.getEncryptedKey = function () {
        };
        SecureMessage.prototype.getEncryptedKeys = function () {
        };
        SecureMessage.parse = function (msg) {
            var helper = MessageExtensions.getSecureHelper();
            return helper.parseSecureMessage(msg)
        };
        SecureMessage.getFactory = function () {
            var helper = MessageExtensions.getSecureHelper();
            return helper.getSecureMessageFactory()
        };
        SecureMessage.setFactory = function (factory) {
            var helper = MessageExtensions.getSecureHelper();
            helper.setSecureMessageFactory(factory)
        };
        SecureMessage.Factory = Interface(null, null);
        var SecureMessageFactory = SecureMessage.Factory;
        SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        };
        dkd.protocol.ReliableMessage = Interface(null, [SecureMessage]);
        var ReliableMessage = dkd.protocol.ReliableMessage;
        ReliableMessage.prototype.getSignature = function () {
        };
        ReliableMessage.convert = function (array) {
            var messages = [];
            var msg;
            for (var i = 0; i < array.length; ++i) {
                msg = ReliableMessage.parse(array[i]);
                if (msg) {
                    messages.push(msg)
                }
            }
            return messages
        };
        ReliableMessage.revert = function (messages) {
            var array = [];
            var msg;
            for (var i = 0; i < messages.length; ++i) {
                msg = messages[i];
                if (Interface.conforms(msg, Mapper)) {
                    array.push(msg.toMap())
                } else {
                    array.push(msg)
                }
            }
            return array
        };
        ReliableMessage.parse = function (msg) {
            var helper = MessageExtensions.getReliableHelper();
            return helper.parseReliableMessage(msg)
        };
        ReliableMessage.getFactory = function () {
            var helper = MessageExtensions.getReliableHelper();
            return helper.getReliableMessageFactory()
        };
        ReliableMessage.setFactory = function (factory) {
            var helper = MessageExtensions.getReliableHelper();
            helper.setReliableMessageFactory(factory)
        };
        ReliableMessage.Factory = Interface(null, null);
        var ReliableMessageFactory = ReliableMessage.Factory;
        ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        };
        dkd.ext.ContentHelper = Interface(null, null);
        var ContentHelper = dkd.ext.ContentHelper;
        ContentHelper.prototype = {
            setContentFactory: function (msg_type, factory) {
            }, getContentFactory: function (msg_type) {
            }, parseContent: function (content) {
            }
        };
        dkd.ext.EnvelopeHelper = Interface(null, null);
        var EnvelopeHelper = dkd.ext.EnvelopeHelper;
        EnvelopeHelper.prototype = {
            setEnvelopeFactory: function (factory) {
            }, getEnvelopeFactory: function () {
            }, createEnvelope: function (sender, receiver, time) {
            }, parseEnvelope: function (env) {
            }
        };
        dkd.ext.InstantMessageHelper = Interface(null, null);
        var InstantMessageHelper = dkd.ext.InstantMessageHelper;
        InstantMessageHelper.prototype = {
            setInstantMessageFactory: function (factory) {
            }, getInstantMessageFactory: function () {
            }, createInstantMessage: function (head, body) {
            }, parseInstantMessage: function (msg) {
            }, generateSerialNumber: function (msg_type, when) {
            }
        };
        dkd.ext.SecureMessageHelper = Interface(null, null);
        var SecureMessageHelper = dkd.ext.SecureMessageHelper;
        SecureMessageHelper.prototype = {
            setSecureMessageFactory: function (factory) {
            }, getSecureMessageFactory: function () {
            }, parseSecureMessage: function (msg) {
            }
        };
        dkd.ext.ReliableMessageHelper = Interface(null, null);
        var ReliableMessageHelper = dkd.ext.ReliableMessageHelper;
        ReliableMessageHelper.prototype = {
            setReliableMessageFactory: function (factory) {
            }, getReliableMessageFactory: function () {
            }, parseReliableMessage: function (msg) {
            }
        };
        dkd.ext.MessageExtensions = {
            setContentHelper: function (helper) {
                contentHelper = helper
            }, getContentHelper: function () {
                return contentHelper
            }, setEnvelopeHelper: function (helper) {
                envelopeHelper = helper
            }, getEnvelopeHelper: function () {
                return envelopeHelper
            }, setInstantHelper: function (helper) {
                instantHelper = helper
            }, getInstantHelper: function () {
                return instantHelper
            }, setSecureHelper: function (helper) {
                secureHelper = helper
            }, getSecureHelper: function () {
                return secureHelper
            }, setReliableHelper: function (helper) {
                reliableHelper = helper
            }, getReliableHelper: function () {
                return reliableHelper
            }
        };
        var MessageExtensions = dkd.ext.MessageExtensions;
        var contentHelper = null;
        var envelopeHelper = null;
        var instantHelper = null;
        var secureHelper = null;
        var reliableHelper = null;
        dkd.ext.GeneralMessageHelper = Interface(null, null);
        var GeneralMessageHelper = dkd.ext.GeneralMessageHelper;
        GeneralMessageHelper.prototype = {
            getContentType: function (content, defaultValue) {
            }
        };
        dkd.ext.SharedMessageExtensions = {
            setContentHelper: function (helper) {
                MessageExtensions.setContentHelper(helper)
            }, getContentHelper: function () {
                return MessageExtensions.getContentHelper()
            }, setEnvelopeHelper: function (helper) {
                MessageExtensions.setEnvelopeHelper(helper)
            }, getEnvelopeHelper: function () {
                return MessageExtensions.getEnvelopeHelper()
            }, setInstantHelper: function (helper) {
                MessageExtensions.setInstantHelper(helper)
            }, getInstantHelper: function () {
                return MessageExtensions.getInstantHelper()
            }, setSecureHelper: function (helper) {
                MessageExtensions.setSecureHelper(helper)
            }, getSecureHelper: function () {
                return MessageExtensions.getSecureHelper()
            }, setReliableHelper: function (helper) {
                MessageExtensions.setReliableHelper(helper)
            }, getReliableHelper: function () {
                return MessageExtensions.getReliableHelper()
            }, setHelper: function (helper) {
                generalMessageHelper = helper
            }, getHelper: function () {
                return generalMessageHelper
            }
        };
        var SharedMessageExtensions = dkd.ext.SharedMessageExtensions;
        var generalMessageHelper = null
    })(DaoKeDao, MONKEY);
    (function (dkd, mkm, mk) {
        if (typeof mk.crypto !== 'object') {
            mk.crypto = {}
        }
        if (typeof dkd.dkd !== 'object') {
            dkd.dkd = {}
        }
        if (typeof dkd.msg !== 'object') {
            dkd.msg = {}
        }
        var Interface = mk.type.Interface;
        var Class = mk.type.Class;
        var IObject = mk.type.Object;
        var Dictionary = mk.type.Dictionary;
        var Converter = mk.type.Converter;
        var Base64 = mk.format.Base64;
        var Base58 = mk.format.Base58;
        var Hex = mk.format.Hex;
        var UTF8 = mk.format.UTF8;
        var JSONMap = mk.format.JSONMap;
        var TransportableData = mk.protocol.TransportableData;
        var PortableNetworkFile = mk.protocol.PortableNetworkFile;
        var CryptographyKey = mk.protocol.CryptographyKey;
        var EncryptKey = mk.protocol.EncryptKey;
        var SymmetricKey = mk.protocol.SymmetricKey;
        var AsymmetricKey = mk.protocol.AsymmetricKey;
        var PrivateKey = mk.protocol.PrivateKey;
        var PublicKey = mk.protocol.PublicKey;
        var GeneralCryptoHelper = mk.ext.GeneralCryptoHelper;
        var SharedCryptoExtensions = mk.ext.SharedCryptoExtensions;
        var ID = mkm.protocol.ID;
        var Meta = mkm.protocol.Meta;
        var Document = mkm.protocol.Document;
        var SharedAccountExtensions = mkm.ext.SharedAccountExtensions;
        var Envelope = dkd.protocol.Envelope;
        var Content = dkd.protocol.Content;
        var Message = dkd.protocol.Message;
        var InstantMessage = dkd.protocol.InstantMessage;
        var SecureMessage = dkd.protocol.SecureMessage;
        var ReliableMessage = dkd.protocol.ReliableMessage;
        var SharedMessageExtensions = dkd.ext.SharedMessageExtensions;
        mk.protocol.AsymmetricAlgorithms = {RSA: 'RSA', ECC: 'ECC'};
        var AsymmetricAlgorithms = mk.protocol.AsymmetricAlgorithms;
        mk.protocol.SymmetricAlgorithms = {AES: 'AES', DES: 'DES', PLAIN: 'PLAIN'};
        var SymmetricAlgorithms = mk.protocol.SymmetricAlgorithms;
        mk.protocol.EncodeAlgorithms = {DEFAULT: 'base64', BASE_64: 'base64', BASE_58: 'base58', HEX: 'hex'};
        var EncodeAlgorithms = mk.protocol.EncodeAlgorithms;
        mkm.protocol.MetaType = {
            DEFAULT: '' + (1),
            MKM: '' + (1),
            BTC: '' + (2),
            ExBTC: '' + (3),
            ETH: '' + (4),
            ExETH: '' + (5)
        };
        var MetaType = mkm.protocol.MetaType;
        mkm.protocol.DocumentType = {VISA: 'visa', PROFILE: 'profile', BULLETIN: 'bulletin'};
        var DocumentType = mkm.protocol.DocumentType;
        mkm.protocol.Visa = Interface(null, [Document]);
        var Visa = mkm.protocol.Visa;
        Visa.prototype.getPublicKey = function () {
        };
        Visa.prototype.setPublicKey = function (pKey) {
        };
        Visa.prototype.getAvatar = function () {
        };
        Visa.prototype.setAvatar = function (image) {
        };
        mkm.protocol.Bulletin = Interface(null, [Document]);
        var Bulletin = mkm.protocol.Bulletin;
        Bulletin.prototype.getFounder = function () {
        };
        Bulletin.prototype.getAssistants = function () {
        };
        Bulletin.prototype.setAssistants = function (bots) {
        };
        dkd.protocol.ContentType = {
            ANY: '' + (0x00),
            TEXT: '' + (0x01),
            FILE: '' + (0x10),
            IMAGE: '' + (0x12),
            AUDIO: '' + (0x14),
            VIDEO: '' + (0x16),
            PAGE: '' + (0x20),
            NAME_CARD: '' + (0x33),
            QUOTE: '' + (0x37),
            MONEY: '' + (0x40),
            TRANSFER: '' + (0x41),
            LUCKY_MONEY: '' + (0x42),
            CLAIM_PAYMENT: '' + (0x48),
            SPLIT_BILL: '' + (0x49),
            COMMAND: '' + (0x88),
            HISTORY: '' + (0x89),
            APPLICATION: '' + (0xA0),
            ARRAY: '' + (0xCA),
            CUSTOMIZED: '' + (0xCC),
            COMBINE_FORWARD: '' + (0xCF),
            FORWARD: '' + (0xFF)
        };
        var ContentType = dkd.protocol.ContentType;
        dkd.protocol.TextContent = Interface(null, [Content]);
        var TextContent = dkd.protocol.TextContent;
        TextContent.prototype.getText = function () {
        };
        TextContent.create = function (text) {
            return new BaseTextContent(text)
        };
        dkd.protocol.PageContent = Interface(null, [Content]);
        var PageContent = dkd.protocol.PageContent;
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
            var content = new WebPageContent();
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
        dkd.protocol.NameCard = Interface(null, [Content]);
        var NameCard = dkd.protocol.NameCard;
        NameCard.prototype.getIdentifier = function () {
        };
        NameCard.prototype.getName = function () {
        };
        NameCard.prototype.getAvatar = function () {
        };
        NameCard.create = function (identifier, mame, avatar) {
            var content = new NameCardContent(identifier);
            content.setName(name);
            content.setAvatar(avatar);
            return content
        };
        dkd.protocol.FileContent = Interface(null, [Content]);
        var FileContent = dkd.protocol.FileContent;
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
        var _init_file_content = function (content, data, filename, url, password) {
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
            var content;
            if (type === ContentType.IMAGE) {
                content = new ImageFileContent()
            } else if (type === ContentType.AUDIO) {
                content = new AudioFileContent()
            } else if (type === ContentType.VIDEO) {
                content = new VideoFileContent()
            } else {
                content = new BaseFileContent(type)
            }
            return _init_file_content(content, data, filename, url, password)
        };
        FileContent.file = function (data, filename, url, password) {
            var content = new BaseFileContent();
            return _init_file_content(content, data, filename, url, password)
        };
        FileContent.image = function (data, filename, url, password) {
            var content = new ImageFileContent();
            return _init_file_content(content, data, filename, url, password)
        };
        FileContent.audio = function (data, filename, url, password) {
            var content = new AudioFileContent();
            return _init_file_content(content, data, filename, url, password)
        };
        FileContent.video = function (data, filename, url, password) {
            var content = new VideoFileContent();
            return _init_file_content(content, data, filename, url, password)
        };
        dkd.protocol.ImageContent = Interface(null, [FileContent]);
        var ImageContent = dkd.protocol.ImageContent;
        ImageContent.prototype.setThumbnail = function (image) {
        };
        ImageContent.prototype.getThumbnail = function () {
        };
        dkd.protocol.VideoContent = Interface(null, [FileContent]);
        var VideoContent = dkd.protocol.VideoContent;
        VideoContent.prototype.setSnapshot = function (image) {
        };
        VideoContent.prototype.getSnapshot = function () {
        };
        dkd.protocol.AudioContent = Interface(null, [FileContent]);
        var AudioContent = dkd.protocol.AudioContent;
        AudioContent.prototype.setText = function (asr) {
        };
        AudioContent.prototype.getText = function () {
        };
        dkd.protocol.ForwardContent = Interface(null, [Content]);
        var ForwardContent = dkd.protocol.ForwardContent;
        ForwardContent.prototype.getForward = function () {
        };
        ForwardContent.prototype.getSecrets = function () {
        };
        ForwardContent.create = function (secrets) {
            return new SecretContent(secrets)
        };
        dkd.protocol.CombineContent = Interface(null, [Content]);
        var CombineContent = dkd.protocol.CombineContent;
        CombineContent.prototype.getTitle = function () {
        };
        CombineContent.prototype.getMessages = function () {
        };
        ForwardContent.create = function (title, messages) {
            return new CombineForwardContent(title, messages)
        };
        dkd.protocol.ArrayContent = Interface(null, [Content]);
        var ArrayContent = dkd.protocol.ArrayContent;
        ArrayContent.prototype.getContents = function () {
        };
        ArrayContent.create = function (contents) {
            return new ListContent(contents)
        };
        dkd.protocol.QuoteContent = Interface(null, [Content]);
        var QuoteContent = dkd.protocol.QuoteContent;
        QuoteContent.prototype.getText = function () {
        };
        QuoteContent.prototype.getOriginalEnvelope = function () {
        };
        QuoteContent.prototype.getOriginalSerialNumber = function () {
        };
        QuoteContent.create = function (text, head, body) {
            var origin = QuoteContent.purify(head);
            origin['type'] = body.getType();
            origin['sn'] = body.getSerialNumber();
            var group = body.getGroup();
            if (group) {
                origin['receiver'] = group.toString()
            }
            return new BaseQuoteContent(text, origin)
        };
        QuoteContent.purify = function (envelope) {
            var from = envelope.getSender();
            var to = envelope.getGroup();
            if (!to) {
                to = envelope.getReceiver()
            }
            return {'sender': from.toString(), 'receiver': to.toString()}
        };
        dkd.protocol.MoneyContent = Interface(null, [Content]);
        var MoneyContent = dkd.protocol.MoneyContent;
        MoneyContent.prototype.getCurrency = function () {
        };
        MoneyContent.prototype.setAmount = function (amount) {
        };
        MoneyContent.prototype.getAmount = function () {
        };
        MoneyContent.create = function (type, currency, amount) {
            return new BaseMoneyContent(type, currency, amount)
        };
        dkd.protocol.TransferContent = Interface(null, [MoneyContent]);
        var TransferContent = dkd.protocol.TransferContent;
        TransferContent.prototype.setRemitter = function (sender) {
        };
        TransferContent.prototype.getRemitter = function () {
        };
        TransferContent.prototype.setRemittee = function (receiver) {
        };
        TransferContent.prototype.getRemittee = function () {
        };
        TransferContent.create = function (currency, amount) {
            return new TransferMoneyContent(currency, amount)
        };
        dkd.protocol.AppContent = Interface(null, [Content]);
        var AppContent = dkd.protocol.AppContent;
        AppContent.prototype.getApplication = function () {
        };
        dkd.protocol.CustomizedContent = Interface(null, [AppContent]);
        var CustomizedContent = dkd.protocol.CustomizedContent;
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
                return new AppCustomizedContent(type, app, mod, act)
            } else if (arguments.length === 3) {
                app = arguments[0];
                mod = arguments[1];
                act = arguments[2];
                return new AppCustomizedContent(app, mod, act)
            } else {
                throw new SyntaxError('customized content arguments error: ' + arguments);
            }
        };
        dkd.protocol.Command = Interface(null, [Content]);
        var Command = dkd.protocol.Command;
        Command.META = 'meta';
        Command.DOCUMENTS = 'documents';
        Command.RECEIPT = 'receipt';
        Command.prototype.getCmd = function () {
        };
        Command.parse = function (command) {
            var helper = CommandExtensions.getCommandHelper();
            return helper.parseCommand(command)
        };
        Command.setFactory = function (cmd, factory) {
            var helper = CommandExtensions.getCommandHelper();
            helper.setCommandFactory(cmd, factory)
        };
        Command.getFactory = function (cmd) {
            var helper = CommandExtensions.getCommandHelper();
            return helper.getCommandFactory(cmd)
        };
        Command.Factory = Interface(null, null);
        var CommandFactory = Command.Factory;
        CommandFactory.prototype.parseCommand = function (content) {
        };
        dkd.protocol.MetaCommand = Interface(null, [Command]);
        var MetaCommand = dkd.protocol.MetaCommand;
        MetaCommand.prototype.getIdentifier = function () {
        };
        MetaCommand.prototype.getMeta = function () {
        };
        MetaCommand.query = function (identifier) {
            return new BaseMetaCommand(identifier)
        };
        MetaCommand.response = function (identifier, meta) {
            var command = new BaseMetaCommand(identifier);
            command.setMeta(meta);
            return command
        };
        dkd.protocol.DocumentCommand = Interface(null, [MetaCommand]);
        var DocumentCommand = dkd.protocol.DocumentCommand;
        DocumentCommand.prototype.getDocuments = function () {
        };
        DocumentCommand.prototype.getLastTime = function () {
        };
        DocumentCommand.query = function (identifier, lastTime) {
            var command = new BaseDocumentCommand(identifier);
            if (lastTime) {
                command.setLastTime(lastTime)
            }
            return command
        };
        DocumentCommand.response = function (identifier, meta, docs) {
            var command = new BaseDocumentCommand(identifier);
            command.setMeta(meta);
            command.setDocuments(docs);
            return command
        };
        dkd.protocol.HistoryCommand = Interface(null, [Command]);
        var HistoryCommand = dkd.protocol.HistoryCommand;
        HistoryCommand.REGISTER = 'register';
        HistoryCommand.SUICIDE = 'suicide';
        dkd.protocol.GroupCommand = Interface(null, [HistoryCommand]);
        var GroupCommand = dkd.protocol.GroupCommand;
        GroupCommand.FOUND = 'found';
        GroupCommand.ABDICATE = 'abdicate';
        GroupCommand.INVITE = 'invite';
        GroupCommand.EXPEL = 'expel';
        GroupCommand.JOIN = 'join';
        GroupCommand.QUIT = 'quit';
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
        var _command_init_members = function (content, members) {
            if (members instanceof Array) {
                content.setMembers(members)
            } else if (Interface.conforms(members, ID)) {
                content.setMember(members)
            } else {
                throw new TypeError('group members error: ' + members);
            }
            return content
        };
        GroupCommand.create = function (cmd, group, members) {
            var content = new BaseGroupCommand(cmd, group);
            if (members) {
                _command_init_members(content, members)
            }
            return content
        };
        GroupCommand.invite = function (group, members) {
            var content = new InviteGroupCommand(group);
            return _command_init_members(content, members)
        };
        GroupCommand.expel = function (group, members) {
            var content = new ExpelGroupCommand(group);
            return _command_init_members(content, members)
        };
        GroupCommand.join = function (group) {
            return new JoinGroupCommand(group)
        };
        GroupCommand.quit = function (group) {
            return new QuitGroupCommand(group)
        };
        GroupCommand.reset = function (group, members) {
            var content = new ResetGroupCommand(group, members);
            if (members instanceof Array) {
                content.setMembers(members)
            } else {
                throw new TypeError('reset members error: ' + members);
            }
            return content
        };
        var _command_init_admins = function (content, administrators, assistants) {
            if (administrators && administrators.length > 0) {
                content.setAdministrators(administrators)
            }
            if (assistants && assistants.length > 0) {
                content.setAssistants(assistants)
            }
            return content
        };
        GroupCommand.hire = function (group, administrators, assistants) {
            var content = new HireGroupCommand(group);
            return _command_init_admins(content, administrators, assistants)
        };
        GroupCommand.fire = function (group, administrators, assistants) {
            var content = new FireGroupCommand(group);
            return _command_init_admins(content, administrators, assistants)
        };
        GroupCommand.resign = function (group) {
            return new ResignGroupCommand(group)
        };
        dkd.protocol.InviteCommand = Interface(null, [GroupCommand]);
        var InviteCommand = dkd.protocol.InviteCommand;
        dkd.protocol.ExpelCommand = Interface(null, [GroupCommand]);
        var ExpelCommand = dkd.protocol.ExpelCommand;
        dkd.protocol.JoinCommand = Interface(null, [GroupCommand]);
        var JoinCommand = dkd.protocol.JoinCommand;
        dkd.protocol.QuitCommand = Interface(null, [GroupCommand]);
        var QuitCommand = dkd.protocol.QuitCommand;
        dkd.protocol.ResetCommand = Interface(null, [GroupCommand]);
        var ResetCommand = dkd.protocol.ResetCommand;
        dkd.protocol.HireCommand = Interface(null, [GroupCommand]);
        var HireCommand = dkd.protocol.HireCommand;
        HireCommand.prototype.getAdministrators = function () {
        };
        HireCommand.prototype.setAdministrators = function (members) {
        };
        HireCommand.prototype.getAssistants = function () {
        };
        HireCommand.prototype.setAssistants = function (bots) {
        };
        dkd.protocol.FireCommand = Interface(null, [GroupCommand]);
        var FireCommand = dkd.protocol.FireCommand;
        FireCommand.prototype.getAdministrators = function () {
        };
        FireCommand.prototype.setAdministrators = function (members) {
        };
        FireCommand.prototype.getAssistants = function () {
        };
        FireCommand.prototype.setAssistants = function (bots) {
        };
        dkd.protocol.ResignCommand = Interface(null, [GroupCommand]);
        var ResignCommand = dkd.protocol.ResignCommand;
        dkd.protocol.ReceiptCommand = Interface(null, [Command]);
        var ReceiptCommand = dkd.protocol.ReceiptCommand;
        ReceiptCommand.prototype.getText = function () {
        };
        ReceiptCommand.prototype.getOriginalEnvelope = function () {
        };
        ReceiptCommand.prototype.getOriginalSerialNumber = function () {
        };
        ReceiptCommand.prototype.getOriginalSignature = function () {
        };
        ReceiptCommand.create = function (text, head, body) {
            var origin;
            if (!head) {
                origin = null
            } else if (!body) {
                origin = ReceiptCommand.purify(head)
            } else {
                origin = ReceiptCommand.purify(head);
                origin['sn'] = body.getSerialNumber()
            }
            var command = new BaseReceiptCommand(text, origin);
            if (body) {
                var group = body.getGroup();
                if (group) {
                    command.setGroup(group)
                }
            }
            return command
        };
        ReceiptCommand.purify = function (envelope) {
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
        mk.crypto.BaseKey = function (dict) {
            Dictionary.call(this, dict)
        };
        var BaseKey = mk.crypto.BaseKey;
        Class(BaseKey, Dictionary, [CryptographyKey], {
            getAlgorithm: function () {
                return BaseKey.getKeyAlgorithm(this.toMap())
            }
        });
        BaseKey.getKeyAlgorithm = function (key) {
            var helper = SharedCryptoExtensions.getHelper();
            var algorithm = helper.getKeyAlgorithm(key);
            return algorithm ? algorithm : ''
        };
        BaseKey.matchEncryptKey = function (pKey, sKey) {
            return GeneralCryptoHelper.matchSymmetricKeys(pKey, sKey)
        };
        BaseKey.matchSignKey = function (sKey, pKey) {
            return GeneralCryptoHelper.matchAsymmetricKeys(sKey, pKey)
        };
        BaseKey.symmetricKeyEquals = function (key1, key2) {
            if (key1 === key2) {
                return true
            }
            return BaseKey.matchEncryptKey(key1, key2)
        };
        BaseKey.privateKeyEquals = function (key1, key2) {
            if (key1 === key2) {
                return true
            }
            return BaseKey.matchSignKey(key1, key2)
        };
        mk.crypto.BaseSymmetricKey = function (dict) {
            Dictionary.call(this, dict)
        };
        var BaseSymmetricKey = mk.crypto.BaseSymmetricKey;
        Class(BaseSymmetricKey, Dictionary, [SymmetricKey], {
            equals: function (other) {
                return Interface.conforms(other, SymmetricKey) && BaseKey.symmetricKeyEquals(other, this)
            }, matchEncryptKey: function (pKey) {
                return BaseKey.matchEncryptKey(pKey, this)
            }, getAlgorithm: function () {
                return BaseKey.getKeyAlgorithm(this.toMap())
            }
        });
        mk.crypto.BaseAsymmetricKey = function (dict) {
            Dictionary.call(this, dict)
        };
        var BaseAsymmetricKey = mk.crypto.BaseAsymmetricKey;
        Class(BaseAsymmetricKey, Dictionary, [AsymmetricKey], {
            getAlgorithm: function () {
                return BaseKey.getKeyAlgorithm(this.toMap())
            }
        });
        mk.crypto.BasePrivateKey = function (dict) {
            Dictionary.call(this, dict)
        };
        var BasePrivateKey = mk.crypto.BasePrivateKey;
        Class(BasePrivateKey, Dictionary, [PrivateKey], {
            equals: function (other) {
                return Interface.conforms(other, PrivateKey) && BaseKey.privateKeyEquals(other, this)
            }, getAlgorithm: function () {
                return BaseKey.getKeyAlgorithm(this.toMap())
            }
        });
        mk.crypto.BasePublicKey = function (dict) {
            Dictionary.call(this, dict)
        };
        var BasePublicKey = mk.crypto.BasePublicKey;
        Class(BasePublicKey, Dictionary, [PublicKey], {
            matchSignKey: function (sKey) {
                return BaseKey.matchSignKey(sKey, this)
            }, getAlgorithm: function () {
                return BaseKey.getKeyAlgorithm(this.toMap())
            }
        });
        mk.format.BaseDataWrapper = function (dict) {
            Dictionary.call(this, dict);
            this.__data = null
        };
        var BaseDataWrapper = mk.format.BaseDataWrapper;
        Class(BaseDataWrapper, Dictionary, null, {
            toString: function () {
                var encoded = this.getString('data', null);
                if (!encoded) {
                    return ''
                }
                var alg = this.getString('algorithm', null);
                if (!alg || alg === EncodeAlgorithms.DEFAULT) {
                    alg = ''
                }
                if (alg === '') {
                    return encoded
                } else {
                    return alg + ',' + encoded
                }
            }, encode: function (mimeType) {
                var encoded = this.getString('data', null);
                if (!encoded) {
                    return ''
                }
                var alg = this.getAlgorithm();
                return 'data:' + mimeType + ';' + alg + ',' + encoded
            }, getAlgorithm: function () {
                var alg = this.getString('algorithm', null);
                if (!alg) {
                    alg = EncodeAlgorithms.DEFAULT
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
                    var encoded = this.getString('data', null);
                    if (!encoded) {
                        return null
                    } else {
                        var alg = this.getAlgorithm();
                        if (alg === EncodeAlgorithms.BASE_64) {
                            bin = Base64.decode(encoded)
                        } else if (alg === EncodeAlgorithms.BASE_58) {
                            bin = Base58.decode(encoded)
                        } else if (alg === EncodeAlgorithms.HEX) {
                            bin = Hex.decode(encoded)
                        } else {
                            throw new Error('data algorithm not support: ' + alg);
                        }
                    }
                    this.__data = bin
                }
                return bin
            }, setData: function (bin) {
                if (!bin) {
                    this.removeValue('data')
                } else {
                    var encoded = null;
                    var alg = this.getAlgorithm();
                    if (alg === EncodeAlgorithms.BASE_64) {
                        encoded = Base64.encode(bin)
                    } else if (alg === EncodeAlgorithms.BASE_58) {
                        encoded = Base58.encode(bin)
                    } else if (alg === EncodeAlgorithms.HEX) {
                        encoded = Hex.encode(bin)
                    } else {
                        throw new Error('data algorithm not support: ' + alg);
                    }
                    this.setValue('data', encoded)
                }
                this.__data = bin
            }
        });
        mk.format.BaseFileWrapper = function (dict) {
            Dictionary.call(this, dict);
            this.__attachment = null;
            this.__password = null
        };
        var BaseFileWrapper = mk.format.BaseFileWrapper;
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
                var ted;
                if (!bin) {
                    ted = null;
                    this.removeValue('data')
                } else {
                    ted = TransportableData.create(bin);
                    this.setValue('data', ted.toObject())
                }
                this.__attachment = ted
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
        mkm.mkm.BaseMeta = function () {
            var type, key, seed, fingerprint;
            var status;
            var meta;
            if (arguments.length === 1) {
                meta = arguments[0];
                type = null;
                key = null;
                seed = null;
                fingerprint = null;
                status = 0
            } else if (arguments.length === 2) {
                type = arguments[0];
                key = arguments[1];
                seed = null;
                fingerprint = null;
                status = 1;
                meta = {'type': type, 'key': key.toMap()}
            } else if (arguments.length === 4) {
                type = arguments[0];
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
        var BaseMeta = mkm.mkm.BaseMeta;
        Class(BaseMeta, Dictionary, [Meta], {
            getType: function () {
                var type = this.__type;
                if (type === null) {
                    var helper = SharedAccountExtensions.getHelper();
                    type = helper.getMetaType(this.toMap(), '');
                    this.__type = type
                }
                return type
            }, getPublicKey: function () {
                var key = this.__key;
                if (!key) {
                    var info = this.getValue('key');
                    key = PublicKey.parse(info);
                    this.__key = key
                }
                return key
            }, hasSeed: function () {
                return this.__seed || this.getValue('seed')
            }, getSeed: function () {
                var seed = this.__seed;
                if (seed === null && this.hasSeed()) {
                    seed = this.getString('seed', null);
                    this.__seed = seed
                }
                return seed
            }, getFingerprint: function () {
                var ted = this.__fingerprint;
                if (!ted && this.hasSeed()) {
                    var base64 = this.getValue('fingerprint');
                    ted = TransportableData.parse(base64);
                    this.__fingerprint = ted
                }
                return !ted ? null : ted.getData()
            }, isValid: function () {
                if (this.__status === 0) {
                    if (this.checkValid()) {
                        this.__status = 1
                    } else {
                        this.__status = -1
                    }
                }
                return this.__status > 0
            }, checkValid: function () {
                var key = this.getPublicKey();
                if (!key) {
                    return false
                } else if (this.hasSeed()) {
                } else if (this.getValue('seed') || this.getValue('fingerprint')) {
                    return false
                } else {
                    return true
                }
                var name = this.getSeed();
                var signature = this.getFingerprint();
                if (!signature || !name) {
                    return false
                }
                var data = UTF8.encode(name);
                return key.verify(data, signature)
            }
        });
        mkm.mkm.BaseDocument = function () {
            var map, status;
            var type;
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
                type = arguments[0];
                identifier = arguments[1];
                map = {'type': type, 'did': identifier.toString()};
                status = 0;
                data = null;
                signature = null;
                var now = new Date();
                properties = {'type': type, 'created_time': (now.getTime() / 1000.0)}
            } else if (arguments.length === 4) {
                type = arguments[0];
                identifier = arguments[1];
                data = arguments[2];
                signature = arguments[3];
                map = {'type': type, 'did': identifier.toString(), 'data': data, 'signature': signature.toObject()};
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
        var BaseDocument = mkm.mkm.BaseDocument;
        Class(BaseDocument, Dictionary, [Document], {
            isValid: function () {
                return this.__status > 0
            }, getIdentifier: function () {
                var did = this.__identifier;
                if (!did) {
                    did = ID.parse(this.getValue('did'));
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
                        dict = JSONMap.decode(json)
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
                if (!dict) {
                } else if (value) {
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
                var data = JSONMap.encode(dict);
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
        mkm.mkm.BaseVisa = function () {
            if (arguments.length === 3) {
                BaseDocument.call(this, DocumentType.VISA, arguments[0], arguments[1], arguments[2])
            } else if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, DocumentType.VISA, arguments[0])
            } else if (arguments.length === 1) {
                BaseDocument.call(this, arguments[0])
            } else {
                throw new SyntaxError('visa params error: ' + arguments);
            }
            this.__key = null;
            this.__avatar = null
        };
        var BaseVisa = mkm.mkm.BaseVisa;
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
                    if (typeof url === 'string' && url.length === 0) {
                    } else {
                        pnf = PortableNetworkFile.parse(url);
                        this.__avatar = pnf
                    }
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
        mkm.mkm.BaseBulletin = function () {
            if (arguments.length === 3) {
                BaseDocument.call(this, DocumentType.BULLETIN, arguments[0], arguments[1], arguments[2])
            } else if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, DocumentType.BULLETIN, arguments[0])
            } else if (arguments.length === 1) {
                BaseDocument.call(this, arguments[0])
            } else {
                throw new SyntaxError('bulletin params error: ' + arguments);
            }
            this.__assistants = null
        };
        var BaseBulletin = mkm.mkm.BaseBulletin;
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
        dkd.dkd.BaseContent = function (info) {
            var content, type, sn, time;
            if (IObject.isString(info)) {
                type = info;
                time = new Date();
                sn = InstantMessage.generateSerialNumber(type, time);
                content = {'type': type, 'sn': sn, 'time': time.getTime() / 1000.0}
            } else {
                content = info;
                type = null;
                sn = null;
                time = null
            }
            Dictionary.call(this, content);
            this.__type = type;
            this.__sn = sn;
            this.__time = time
        };
        var BaseContent = dkd.dkd.BaseContent;
        Class(BaseContent, Dictionary, [Content], {
            getType: function () {
                if (this.__type === null) {
                    var helper = SharedMessageExtensions.getHelper();
                    this.__type = helper.getContentType(this.toMap(), '')
                }
                return this.__type
            }, getSerialNumber: function () {
                if (this.__sn === null) {
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
        dkd.dkd.BaseCommand = function () {
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
        var BaseCommand = dkd.dkd.BaseCommand;
        Class(BaseCommand, BaseContent, [Command], {
            getCmd: function () {
                var helper = SharedCommandExtensions.getHelper();
                return helper.getCmd(this.toMap(), '')
            }
        });
        dkd.dkd.BaseTextContent = function (info) {
            if (IObject.isString(info)) {
                BaseContent.call(this, ContentType.TEXT);
                this.setText(info)
            } else {
                BaseContent.call(this, info)
            }
        };
        var BaseTextContent = dkd.dkd.BaseTextContent;
        Class(BaseTextContent, BaseContent, [TextContent], {
            getText: function () {
                return this.getString('text', '')
            }, setText: function (text) {
                this.setValue('text', text)
            }
        });
        dkd.dkd.WebPageContent = function (info) {
            if (info) {
                BaseContent.call(this, info)
            } else {
                BaseContent.call(this, ContentType.PAGE)
            }
            this.__icon = null
        };
        var WebPageContent = dkd.dkd.WebPageContent;
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
        dkd.dkd.NameCardContent = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseContent.call(this, ContentType.NAME_CARD);
                this.setString('did', info)
            } else {
                BaseContent.call(this, info)
            }
            this.__image = null
        };
        var NameCardContent = dkd.dkd.NameCardContent;
        Class(NameCardContent, BaseContent, [NameCard], {
            getIdentifier: function () {
                var id = this.getValue('did');
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
        dkd.dkd.BaseFileContent = function (info) {
            if (!info) {
                info = ContentType.FILE
            }
            BaseContent.call(this, info);
            this.__wrapper = new BaseFileWrapper(this.toMap())
        };
        var BaseFileContent = dkd.dkd.BaseFileContent;
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
        dkd.dkd.ImageFileContent = function (info) {
            if (!info) {
                BaseFileContent.call(this, ContentType.IMAGE)
            } else {
                BaseFileContent.call(this, info)
            }
            this.__thumbnail = null
        };
        var ImageFileContent = dkd.dkd.ImageFileContent;
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
        dkd.dkd.VideoFileContent = function (info) {
            if (!info) {
                BaseFileContent.call(this, ContentType.VIDEO)
            } else {
                BaseFileContent.call(this, info)
            }
            this.__snapshot = null
        };
        var VideoFileContent = dkd.dkd.VideoFileContent;
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
        dkd.dkd.AudioFileContent = function (info) {
            if (!info) {
                BaseFileContent.call(this, ContentType.AUDIO)
            } else {
                BaseFileContent.call(this, info)
            }
        };
        var AudioFileContent = dkd.dkd.AudioFileContent;
        Class(AudioFileContent, BaseFileContent, [AudioContent], {
            getText: function () {
                return this.getString('text', null)
            }, setText: function (asr) {
                this.setValue('text', asr)
            }
        });
        dkd.dkd.SecretContent = function (info) {
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
                var array = ReliableMessage.revert(secrets);
                this.setValue('secrets', array)
            }
            this.__forward = forward;
            this.__secrets = secrets
        };
        var SecretContent = dkd.dkd.SecretContent;
        Class(SecretContent, BaseContent, [ForwardContent], {
            getForward: function () {
                if (this.__forward === null) {
                    var forward = this.getValue('forward');
                    this.__forward = ReliableMessage.parse(forward)
                }
                return this.__forward
            }, getSecrets: function () {
                var messages = this.__secrets;
                if (!messages) {
                    var array = this.getValue('secrets');
                    if (array) {
                        messages = ReliableMessage.convert(array)
                    } else {
                        var msg = this.getForward();
                        messages = !msg ? [] : [msg]
                    }
                    this.__secrets = messages
                }
                return messages
            }
        });
        dkd.dkd.CombineForwardContent = function () {
            var title;
            var messages;
            if (arguments.length === 2) {
                BaseContent.call(this, ContentType.COMBINE_FORWARD);
                title = arguments[0];
                messages = arguments[1]
            } else {
                BaseContent.call(this, arguments[0]);
                title = null;
                messages = null
            }
            if (title) {
                this.setValue('title', title)
            }
            if (messages) {
                var array = InstantMessage.revert(messages);
                this.setValue('messages', array)
            }
            this.__history = messages
        };
        var CombineForwardContent = dkd.dkd.CombineForwardContent;
        Class(CombineForwardContent, BaseContent, [CombineContent], {
            getTitle: function () {
                return this.getString('title', '')
            }, getMessages: function () {
                var messages = this.__history;
                if (!messages) {
                    var array = this.getValue('messages');
                    if (array) {
                        messages = InstantMessage.convert(array)
                    } else {
                        messages = []
                    }
                    this.__history = messages
                }
                return messages
            }
        });
        dkd.dkd.ListContent = function (info) {
            var list;
            if (info instanceof Array) {
                BaseContent.call(this, ContentType.ARRAY);
                list = info;
                this.setValue('contents', Content.revert(list))
            } else {
                BaseContent.call(this, info);
                list = null
            }
            this.__list = list
        };
        var ListContent = dkd.dkd.ListContent;
        Class(ListContent, BaseContent, [ArrayContent], {
            getContents: function () {
                var contents = this.__list;
                if (!contents) {
                    var array = this.getValue('contents');
                    if (array) {
                        contents = Content.convert(array)
                    } else {
                        contents = []
                    }
                    this.__list = contents
                }
                return contents
            }
        });
        dkd.dkd.BaseQuoteContent = function () {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0])
            } else {
                BaseContent.call(this, Command.RECEIPT);
                this.setValue('text', arguments[0]);
                var origin = arguments[1];
                if (origin) {
                    this.setValue('origin', origin)
                }
            }
            this.__env = null
        };
        var BaseQuoteContent = dkd.dkd.BaseQuoteContent;
        Class(BaseQuoteContent, BaseContent, [QuoteContent], {
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
            }
        });
        dkd.dkd.BaseMoneyContent = function () {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0])
            } else if (arguments.length === 2) {
                BaseContent.call(this, ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1])
            } else if (arguments.length === 3) {
                BaseContent.call(this, arguments[0]);
                this.setCurrency(arguments[1]);
                this.setAmount(arguments[2])
            } else {
                throw new SyntaxError('money content arguments error: ' + arguments);
            }
        };
        var BaseMoneyContent = dkd.dkd.BaseMoneyContent;
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
        dkd.dkd.TransferMoneyContent = function () {
            if (arguments.length === 1) {
                MoneyContent.call(this, arguments[0])
            } else if (arguments.length === 2) {
                MoneyContent.call(this, ContentType.TRANSFER, arguments[0], arguments[1])
            } else {
                throw new SyntaxError('money content arguments error: ' + arguments);
            }
        };
        var TransferMoneyContent = dkd.dkd.TransferMoneyContent;
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
        dkd.dkd.AppCustomizedContent = function () {
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
        var AppCustomizedContent = dkd.dkd.AppCustomizedContent;
        Class(AppCustomizedContent, BaseContent, [CustomizedContent], {
            getApplication: function () {
                return this.getString('app', '')
            }, getModule: function () {
                return this.getString('mod', '')
            }, getAction: function () {
                return this.getString('act', '')
            }
        });
        dkd.dkd.BaseMetaCommand = function () {
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
                this.setString('did', identifier)
            }
            this.__identifier = identifier;
            this.__meta = null
        };
        var BaseMetaCommand = dkd.dkd.BaseMetaCommand;
        Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
            getIdentifier: function () {
                if (this.__identifier == null) {
                    var identifier = this.getValue("did");
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
        dkd.dkd.BaseDocumentCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseMetaCommand.call(this, info, Command.DOCUMENTS)
            } else {
                BaseMetaCommand.call(this, info)
            }
            this.__docs = null
        };
        var BaseDocumentCommand = dkd.dkd.BaseDocumentCommand;
        Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
            getDocuments: function () {
                if (this.__docs === null) {
                    var docs = this.getValue('documents');
                    this.__docs = Document.convert(docs)
                }
                return this.__docs
            }, setDocuments: function (docs) {
                if (!docs) {
                    this.removeValue('documents')
                } else {
                    this.setValue('documents', Document.revert(docs))
                }
                this.__docs = docs
            }, getLastTime: function () {
                return this.getDateTime('last_time', null)
            }, setLastTime: function (when) {
                this.setDateTime('last_time', when)
            }
        });
        dkd.dkd.BaseHistoryCommand = function () {
            if (arguments.length === 2) {
                BaseCommand.call(this, arguments[0], arguments[1])
            } else if (IObject.isString(arguments[0])) {
                BaseCommand.call(this, ContentType.HISTORY, arguments[0])
            } else {
                BaseCommand.call(this, arguments[0])
            }
        };
        var BaseHistoryCommand = dkd.dkd.BaseHistoryCommand;
        Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);
        dkd.dkd.BaseGroupCommand = function () {
            if (arguments.length === 1) {
                BaseHistoryCommand.call(this, arguments[0])
            } else if (arguments.length === 2) {
                BaseHistoryCommand.call(this, ContentType.COMMAND, arguments[0]);
                this.setGroup(arguments[1])
            } else {
                throw new SyntaxError('Group command arguments error: ' + arguments);
            }
        };
        var BaseGroupCommand = dkd.dkd.BaseGroupCommand;
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
        dkd.dkd.InviteGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.INVITE, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var InviteGroupCommand = dkd.dkd.InviteGroupCommand;
        Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);
        dkd.dkd.ExpelGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.EXPEL, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var ExpelGroupCommand = dkd.dkd.ExpelGroupCommand;
        Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);
        dkd.dkd.JoinGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.JOIN, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var JoinGroupCommand = dkd.dkd.JoinGroupCommand;
        Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);
        dkd.dkd.QuitGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.QUIT, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var QuitGroupCommand = dkd.dkd.QuitGroupCommand;
        Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);
        dkd.dkd.ResetGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.RESET, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var ResetGroupCommand = dkd.dkd.ResetGroupCommand;
        Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);
        dkd.dkd.HireGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.HIRE, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var HireGroupCommand = dkd.dkd.HireGroupCommand;
        Class(HireGroupCommand, BaseGroupCommand, [HireCommand], {
            getAdministrators: function () {
                var array = this.getValue('administrators');
                return !array ? null : ID.convert(array)
            }, setAdministrators: function (admins) {
                if (!admins) {
                    this.removeValue('administrators')
                } else {
                    var array = ID.revert(admins);
                    this.setValue('administrators', array)
                }
            }, getAssistants: function () {
                var array = this.getValue('assistants');
                return !array ? null : ID.convert(array)
            }, setAssistants: function (bots) {
                if (!bots) {
                    this.removeValue('assistants')
                } else {
                    var array = ID.revert(bots);
                    this.setValue('assistants', array)
                }
            }
        });
        dkd.dkd.FireGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.FIRE, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var FireGroupCommand = dkd.dkd.FireGroupCommand;
        Class(FireGroupCommand, BaseGroupCommand, [FireCommand], {
            getAssistants: function () {
                var array = this.getValue('assistants');
                return !array ? null : ID.convert(array)
            }, setAssistants: function (bots) {
                if (!bots) {
                    this.removeValue('assistants')
                } else {
                    var array = ID.revert(bots);
                    this.setValue('assistants', array)
                }
            }, getAdministrators: function () {
                var array = this.getValue('administrators');
                return !array ? null : ID.convert(array)
            }, setAdministrators: function (admins) {
                if (!admins) {
                    this.removeValue('administrators')
                } else {
                    var array = ID.revert(admins);
                    this.setValue('administrators', array)
                }
            }
        });
        dkd.dkd.ResignGroupCommand = function (info) {
            if (Interface.conforms(info, ID)) {
                BaseGroupCommand.call(this, GroupCommand.RESIGN, info)
            } else {
                BaseGroupCommand.call(this, info)
            }
        };
        var ResignGroupCommand = dkd.dkd.ResignGroupCommand;
        Class(ResignGroupCommand, BaseGroupCommand, [ResignCommand], null);
        dkd.dkd.BaseReceiptCommand = function () {
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
        var BaseReceiptCommand = dkd.dkd.BaseReceiptCommand;
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
        dkd.msg.MessageEnvelope = function () {
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
        var MessageEnvelope = dkd.msg.MessageEnvelope;
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
        dkd.msg.BaseMessage = function (msg) {
            var env = null;
            if (Interface.conforms(msg, Envelope)) {
                env = msg;
                msg = env.toMap()
            }
            Dictionary.call(this, msg);
            this.__envelope = env
        };
        var BaseMessage = dkd.msg.BaseMessage;
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
        dkd.msg.PlainMessage = function () {
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
        var PlainMessage = dkd.msg.PlainMessage;
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
        dkd.msg.EncryptedMessage = function (msg) {
            BaseMessage.call(this, msg);
            this.__data = null;
            this.__key = null;
            this.__keys = null
        };
        var EncryptedMessage = dkd.msg.EncryptedMessage;
        Class(EncryptedMessage, BaseMessage, [SecureMessage], {
            getData: function () {
                var binary = this.__data;
                if (!binary) {
                    var base64 = this.getValue('data');
                    if (!base64) {
                        throw new ReferenceError('message data not found: ' + this);
                    } else if (!BaseMessage.isBroadcast(this)) {
                        binary = TransportableData.decode(base64)
                    } else if (IObject.isString(base64)) {
                        binary = UTF8.encode(base64)
                    } else {
                        throw new ReferenceError('message data error: ' + base64);
                    }
                    this.__data = binary
                }
                return binary
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
        dkd.msg.NetworkMessage = function (msg) {
            EncryptedMessage.call(this, msg);
            this.__signature = null
        };
        var NetworkMessage = dkd.msg.NetworkMessage;
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
        dkd.ext.CommandHelper = Interface(null, null);
        var CommandHelper = dkd.ext.CommandHelper;
        CommandHelper.prototype = {
            setCommandFactory: function (cmd, factory) {
            }, getCommandFactory: function (cmd) {
            }, parseCommand: function (content) {
            }
        };
        dkd.ext.CommandExtensions = {
            setCommandHelper: function (helper) {
                cmdHelper = helper
            }, getCommandHelper: function () {
                return cmdHelper
            }
        };
        var CommandExtensions = dkd.ext.CommandExtensions;
        var cmdHelper = null;
        dkd.ext.GeneralCommandHelper = Interface(null, null);
        var GeneralCommandHelper = dkd.ext.GeneralCommandHelper;
        GeneralCommandHelper.prototype = {
            getCmd: function (content, defaultValue) {
            }
        };
        dkd.ext.SharedCommandExtensions = {
            setCommandHelper: function (helper) {
                CommandExtensions.setCommandHelper(helper)
            }, getCommandHelper: function () {
                return CommandExtensions.getCommandHelper()
            }, setHelper: function (helper) {
                generalCommandHelper = helper
            }, getHelper: function () {
                return generalCommandHelper
            }
        };
        var SharedCommandExtensions = dkd.ext.SharedCommandExtensions;
        var generalCommandHelper = null
    })(DaoKeDao, MingKeMing, MONKEY)
})(DIMP, DIMP, DIMP);
