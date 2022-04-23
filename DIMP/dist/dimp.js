/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.2.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Apr. 23, 2022
 * @copyright (c) 2022 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== "object") {
    MONKEY = {};
}
(function (ns) {
    var namespacefy = function (space) {
        space.__all__ = [];
        space.registers = namespace.prototype.registers;
        space.exports = namespace.prototype.exports;
        return space;
    };
    var is_space = function (space) {
        if (space instanceof namespace) {
            return true;
        }
        if (typeof space.exports !== "function") {
            return false;
        }
        if (typeof space.registers !== "function") {
            return false;
        }
        return space.__all__ instanceof Array;
    };
    var namespace = function () {
        this.__all__ = [];
    };
    namespace.prototype.registers = function (name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
        }
    };
    namespace.prototype.exports = function (to) {
        var names = this.__all__;
        var name;
        for (var i = 0; i < names.length; ++i) {
            name = names[i];
            export_one(this, to, name);
            to.registers(name);
        }
        return to;
    };
    var export_one = function (from, to, name) {
        var source = from[name];
        var target = to[name];
        if (source === target) {
        } else {
            if (typeof target === "undefined") {
                to[name] = source;
            } else {
                if (is_space(source)) {
                    if (!is_space(target)) {
                        namespacefy(target);
                    }
                    source.exports(target);
                } else {
                    export_all(source, target);
                }
            }
        }
    };
    var export_all = function (from, to) {
        var names = Object.getOwnPropertyNames(from);
        for (var i = 0; i < names.length; ++i) {
            export_one(from, to, names[i]);
        }
    };
    ns.Namespace = namespace;
    namespacefy(ns);
    ns.registers("Namespace");
})(MONKEY);
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = new ns.Namespace();
    }
    if (typeof ns.threading !== "object") {
        ns.threading = new ns.Namespace();
    }
    if (typeof ns.format !== "object") {
        ns.format = new ns.Namespace();
    }
    if (typeof ns.digest !== "object") {
        ns.digest = new ns.Namespace();
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = new ns.Namespace();
    }
    ns.registers("type");
    ns.registers("threading");
    ns.registers("format");
    ns.registers("digest");
    ns.registers("crypto");
})(MONKEY);
(function (ns) {
    var conforms = function (object, protocol) {
        if (!object) {
            return false;
        } else {
            if (object instanceof protocol) {
                return true;
            } else {
                if (ns.type.Object.isBaseType(object)) {
                    return false;
                }
            }
        }
        var child = Object.getPrototypeOf(object);
        if (child === Object.getPrototypeOf({})) {
            child = object;
        }
        var names = Object.getOwnPropertyNames(protocol.prototype);
        var p;
        for (var i = 0; i < names.length; ++i) {
            p = names[i];
            if (p === "constructor") {
                continue;
            }
            if (!child.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    };
    var inherits = function (child, parent) {
        var prototype = parent.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            if (child.prototype.hasOwnProperty(key)) {
                continue;
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue;
            }
            child.prototype[key] = fn;
        }
        return child;
    };
    var inherits_interfaces = function (child, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            child = inherits(child, interfaces[i]);
        }
        return child;
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        if (parents) {
            var ancestors;
            if (parents instanceof Array) {
                ancestors = parents;
            } else {
                ancestors = [];
                for (var i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i]);
                }
            }
            child = inherits_interfaces(child, ancestors);
        }
        return child;
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces) {
        if (!child) {
            child = function () {};
        }
        if (!parent) {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        inherits(child, parent);
        if (interfaces) {
            var ancestors;
            if (interfaces instanceof Array) {
                ancestors = interfaces;
            } else {
                ancestors = [];
                for (var i = 2; i < arguments.length; ++i) {
                    ancestors.push(arguments[i]);
                }
            }
            child = inherits_interfaces(child, ancestors);
        }
        child.prototype.constructor = child;
        return child;
    };
    ns.Interface = interfacefy;
    ns.Class = classify;
    ns.registers("Interface");
    ns.registers("Class");
})(MONKEY);
(function (ns) {
    var is_null = function (object) {
        if (typeof object === "undefined") {
            return true;
        } else {
            return object === null;
        }
    };
    var is_base_type = function (object) {
        var t = typeof object;
        if (
            t === "string" ||
            t === "number" ||
            t === "boolean" ||
            t === "function"
        ) {
            return true;
        }
        if (object instanceof String) {
            return true;
        }
        if (object instanceof Number) {
            return true;
        }
        if (object instanceof Boolean) {
            return true;
        }
        if (object instanceof Date) {
            return true;
        }
        if (object instanceof RegExp) {
            return true;
        }
        return object instanceof Error;
    };
    var IObject = function () {};
    ns.Interface(IObject, null);
    IObject.prototype.equals = function (other) {
        console.assert(false, "implement me!");
        return false;
    };
    IObject.prototype.valueOf = function () {
        console.assert(false, "implement me!");
        return false;
    };
    IObject.isNull = is_null;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this);
    };
    ns.Class(BaseObject, Object, [IObject]);
    BaseObject.prototype.equals = function (other) {
        return this === other;
    };
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject;
    ns.type.registers("Object");
    ns.type.registers("BaseObject");
})(MONKEY);
(function (ns) {
    var is_array = function (obj) {
        if (obj instanceof Array) {
            return true;
        } else {
            if (obj instanceof Uint8Array) {
                return true;
            } else {
                if (obj instanceof Int8Array) {
                    return true;
                } else {
                    if (obj instanceof Uint8ClampedArray) {
                        return true;
                    } else {
                        if (obj instanceof Uint16Array) {
                            return true;
                        } else {
                            if (obj instanceof Int16Array) {
                                return true;
                            } else {
                                if (obj instanceof Uint32Array) {
                                    return true;
                                } else {
                                    if (obj instanceof Int32Array) {
                                        return true;
                                    } else {
                                        if (obj instanceof Float32Array) {
                                            return true;
                                        } else {
                                            if (obj instanceof Float64Array) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    var arrays_equal = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!objects_equal(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    };
    var maps_equal = function (dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        var len1 = keys1.length;
        var len2 = keys2.length;
        if (len1 !== len2) {
            return false;
        }
        var k;
        for (var i = 0; i < len1; ++i) {
            k = keys1[i];
            if (keys2.indexOf(k) < 0) {
                return false;
            }
            if (!objects_equal(dict1[k], dict2[k])) {
                return false;
            }
        }
        return true;
    };
    var objects_equal = function (obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        } else {
            if (!obj1) {
                return !obj2;
            } else {
                if (!obj2) {
                    return false;
                } else {
                    if (typeof obj1["equals"] === "function") {
                        return obj1.equals(obj2);
                    } else {
                        if (typeof obj2["equals"] === "function") {
                            return obj2.equals(obj1);
                        } else {
                            if (ns.type.Object.isBaseType(obj1)) {
                                return obj1 === obj2;
                            } else {
                                if (ns.type.Object.isBaseType(obj2)) {
                                    return false;
                                } else {
                                    if (is_array(obj1)) {
                                        return is_array(obj2) && arrays_equal(obj1, obj2);
                                    } else {
                                        if (is_array(obj2)) {
                                            return false;
                                        } else {
                                            return maps_equal(obj1, obj2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var copy_items = function (src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length);
        }
        dest.set(src, destPos);
    };
    var insert_item = function (array, index, item) {
        if (index < 0) {
            index += array.length + 1;
            if (index < 0) {
                return false;
            }
        }
        if (index === 0) {
            array.unshift(item);
        } else {
            if (index === array.length) {
                array.push(item);
            } else {
                if (index > array.length) {
                    array[index] = item;
                } else {
                    array.splice(index, 0, item);
                }
            }
        }
        return true;
    };
    var update_item = function (array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false;
            }
        }
        array[index] = item;
        return true;
    };
    var remove_item = function (array, item) {
        var index = array.indexOf(item);
        if (index < 0) {
            return false;
        } else {
            if (index === 0) {
                array.shift();
            } else {
                if (index + 1 === array.length) {
                    array.pop();
                } else {
                    array.splice(index, 1);
                }
            }
        }
        return true;
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    };
    ns.type.registers("Arrays");
})(MONKEY);
(function (ns) {
    var base = ns.type.BaseObject;
    var enumify = function (enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                Enum.call(this, value, alias);
            };
        }
        ns.Class(enumeration, Enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue;
            }
            v = elements[name];
            if (v instanceof Enum) {
                v = v.__value;
            } else {
                if (typeof v !== "number") {
                    throw new TypeError("Enum value must be a number!");
                }
            }
            e = new enumeration(v, name);
            enumeration[name] = e;
        }
        return enumeration;
    };
    var get_alias = function (enumeration, value) {
        var e;
        for (var k in enumeration) {
            if (!enumeration.hasOwnProperty(k)) {
                continue;
            }
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.__alias;
                }
            }
        }
        return null;
    };
    var Enum = function (value, alias) {
        base.call(this);
        if (!alias) {
            if (value instanceof Enum) {
                alias = value.__alias;
            } else {
                alias = get_alias(this.constructor, value);
            }
        }
        if (value instanceof Enum) {
            value = value.__value;
        }
        this.__value = value;
        this.__alias = alias;
    };
    ns.Class(Enum, base, null);
    Enum.prototype.equals = function (other) {
        if (!other) {
            return !this.__value;
        } else {
            if (other instanceof Enum) {
                return this.__value === other.valueOf();
            } else {
                return this.__value === other;
            }
        }
    };
    Enum.prototype.valueOf = function () {
        return this.__value;
    };
    Enum.prototype.toString = function () {
        return "<" + this.__alias.toString() + ": " + this.__value.toString() + ">";
    };
    ns.type.Enum = enumify;
    ns.type.registers("Enum");
})(MONKEY);
(function (ns) {
    var Stringer = function () {};
    ns.Interface(Stringer, [ns.type.Object]);
    Stringer.prototype.equalsIgnoreCase = function (other) {
        console.assert(false, "implement me!");
        return false;
    };
    Stringer.prototype.toString = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Stringer.prototype.getLength = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    ns.type.Stringer = Stringer;
    ns.type.registers("Stringer");
})(MONKEY);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Stringer = ns.type.Stringer;
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = "";
        } else {
            if (ns.Interface.conforms(str, Stringer)) {
                str = str.toString();
            }
        }
        this.__string = str;
    };
    ns.Class(ConstantString, BaseObject, [Stringer]);
    ConstantString.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (ns.Interface.conforms(other, Stringer)) {
                    return this.__string === other.toString();
                } else {
                    return this.__string === other;
                }
            }
        }
    };
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this.equals(other)) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (ns.Interface.conforms(other, Stringer)) {
                    return equalsIgnoreCase(this.__string, other.toString());
                } else {
                    return equalsIgnoreCase(this.__string, other);
                }
            }
        }
    };
    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2;
    };
    ConstantString.prototype.valueOf = function () {
        return this.__string;
    };
    ConstantString.prototype.toString = function () {
        return this.__string;
    };
    ConstantString.prototype.getLength = function () {
        return this.__string.length;
    };
    ns.type.ConstantString = ConstantString;
    ns.type.registers("ConstantString");
})(MONKEY);
(function (ns) {
    var Mapper = function () {};
    ns.Interface(Mapper, [ns.type.Object]);
    Mapper.prototype.getValue = function (key) {
        console.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.setValue = function (key, value) {
        console.assert(false, "implement me!");
    };
    Mapper.prototype.removeValue = function (key) {
        console.assert(false, "implement me!");
    };
    Mapper.prototype.allKeys = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.toMap = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.copyMap = function (deepCopy) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.type.Mapper = Mapper;
    ns.type.registers("Mapper");
})(MONKEY);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Mapper = ns.type.Mapper;
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {};
        } else {
            if (ns.Interface.conforms(dict, Mapper)) {
                dict = dict.toMap();
            }
        }
        this.__dictionary = dict;
    };
    ns.Class(Dictionary, BaseObject, [Mapper]);
    Dictionary.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else {
            if (!other) {
                return !this.__dictionary;
            } else {
                if (ns.Interface.conforms(other, Mapper)) {
                    return ns.type.Arrays.equals(this.__dictionary, other.toMap());
                } else {
                    return ns.type.Arrays.equals(this.__dictionary, other);
                }
            }
        }
    };
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.getValue = function (key) {
        return this.__dictionary[key];
    };
    Dictionary.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value;
        } else {
            if (this.__dictionary.hasOwnProperty(key)) {
                delete this.__dictionary[key];
            }
        }
    };
    Dictionary.prototype.removeValue = function (key) {
        if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key];
        }
    };
    Dictionary.prototype.allKeys = function () {
        return Object.keys(this.__dictionary);
    };
    Dictionary.prototype.toMap = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.copyMap = function (deepCopy) {
        if (deepCopy) {
            return ns.type.Copier.deepCopyMap(this.__dictionary);
        } else {
            return ns.type.Copier.copyMap(this.__dictionary);
        }
    };
    ns.type.Dictionary = Dictionary;
    ns.type.registers("Dictionary");
})(MONKEY);
(function (ns) {
    var obj = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    var fetch_string = function (str) {
        if (ns.Interface.conforms(str, Stringer)) {
            return str.toString();
        } else {
            return str;
        }
    };
    var fetch_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            return dict.toMap();
        } else {
            return dict;
        }
    };
    var unwrap = function (object) {
        if (obj.isNull(object)) {
            return null;
        } else {
            if (obj.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return unwrap_map(object);
                    } else {
                        if (object instanceof Array) {
                            return unwrap_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var unwrap_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var allKeys = Object.keys(dict);
        var key;
        var naked, value;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            value = dict[key];
            naked = unwrap(value);
            if (naked !== value) {
                dict[key] = naked;
            }
        }
        return dict;
    };
    var unwrap_list = function (array) {
        var naked, item;
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            item = array[i];
            naked = unwrap(item);
            if (naked !== item) {
                array[i] = naked;
            }
        }
        return array;
    };
    ns.type.Wrapper = {
        fetchString: fetch_string,
        fetchMap: fetch_map,
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    };
    ns.type.registers("Wrapper");
})(MONKEY);
(function (ns) {
    var obj = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (obj.isNull(object)) {
            return null;
        } else {
            if (obj.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return copy_map(object);
                    } else {
                        if (object instanceof Array) {
                            return copy_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var copy_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = dict[key];
        }
        return clone;
    };
    var copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(array[i]);
        }
        return clone;
    };
    var deep_copy = function (object) {
        if (obj.isNull(object)) {
            return null;
        } else {
            if (obj.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return deep_copy_map(object);
                    } else {
                        if (object instanceof Array) {
                            return deep_copy_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var deep_copy_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = deep_copy(dict[key]);
        }
        return clone;
    };
    var deep_copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(deep_copy(array[i]));
        }
        return clone;
    };
    ns.type.Copier = {
        copy: copy,
        copyMap: copy_map,
        copyList: copy_list,
        deepCopy: deep_copy,
        deepCopyMap: deep_copy_map,
        deepCopyList: deep_copy_list
    };
    ns.type.registers("Copier");
})(MONKEY);
(function (ns) {
    var DataDigester = function () {};
    ns.Interface(DataDigester, null);
    DataDigester.prototype.digest = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.digest.DataDigester = DataDigester;
    ns.digest.registers("DataDigester");
})(MONKEY);
(function (ns) {
    var MD5 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return md5Digester;
        },
        setDigester: function (digester) {
            md5Digester = digester;
        }
    };
    var md5Digester = null;
    ns.digest.MD5 = MD5;
    ns.digest.registers("MD5");
})(MONKEY);
(function (ns) {
    var SHA1 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return sha1Digester;
        },
        setDigester: function (digester) {
            sha1Digester = digester;
        }
    };
    var sha1Digester = null;
    ns.digest.SHA1 = SHA1;
    ns.digest.registers("SHA1");
})(MONKEY);
(function (ns) {
    var SHA256 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return sha256Digester;
        },
        setDigester: function (digester) {
            sha256Digester = digester;
        }
    };
    var sha256Digester = null;
    ns.digest.SHA256 = SHA256;
    ns.digest.registers("SHA256");
})(MONKEY);
(function (ns) {
    var RipeMD160 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return ripemd160Digester;
        },
        setDigester: function (digester) {
            ripemd160Digester = digester;
        }
    };
    var ripemd160Digester = null;
    ns.digest.RIPEMD160 = RipeMD160;
    ns.digest.registers("RIPEMD160");
})(MONKEY);
(function (ns) {
    var Keccak256 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return keccak256Digester;
        },
        setDigester: function (digester) {
            keccak256Digester = digester;
        }
    };
    var keccak256Digester = null;
    ns.digest.KECCAK256 = Keccak256;
    ns.digest.registers("KECCAK256");
})(MONKEY);
(function (ns) {
    var DataCoder = function () {};
    ns.Interface(DataCoder, null);
    DataCoder.prototype.encode = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    DataCoder.prototype.decode = function (string) {
        console.assert(false, "implement me!");
        return null;
    };
    var ObjectCoder = function () {};
    ns.Interface(ObjectCoder, null);
    ObjectCoder.prototype.encode = function (object) {
        console.assert(false, "implement me!");
        return null;
    };
    ObjectCoder.prototype.decode = function (string) {
        console.assert(false, "implement me!");
        return null;
    };
    var StringCoder = function () {};
    ns.Interface(StringCoder, null);
    StringCoder.prototype.encode = function (string) {
        console.assert(false, "implement me!");
        return null;
    };
    StringCoder.prototype.decode = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder;
    ns.format.registers("DataCoder");
    ns.format.registers("ObjectCoder");
    ns.format.registers("StringCoder");
})(MONKEY);
(function (ns) {
    var DataCoder = ns.format.DataCoder;
    var hex_chars = "0123456789abcdef";
    var hex_values = new Int8Array(128);
    (function (chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i;
        }
        values["A".charCodeAt(0)] = 10;
        values["B".charCodeAt(0)] = 11;
        values["C".charCodeAt(0)] = 12;
        values["D".charCodeAt(0)] = 13;
        values["E".charCodeAt(0)] = 14;
        values["F".charCodeAt(0)] = 15;
    })(hex_chars, hex_values);
    var hex_encode = function (data) {
        var len = data.length;
        var str = "";
        var byt;
        for (var i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];
            str += hex_chars[byt & 15];
        }
        return str;
    };
    var hex_decode = function (string) {
        var len = string.length;
        if (len > 2) {
            if (string[0] === "0") {
                if (string[1] === "x" || string[1] === "X") {
                    string = string.substring(2);
                    len -= 2;
                }
            }
        }
        if (len % 2 === 1) {
            string = "0" + string;
            len += 1;
        }
        var cnt = len >> 1;
        var hi, lo;
        var data = new Uint8Array(cnt);
        for (var i = 0, j = 0; i < cnt; ++i, j += 2) {
            hi = hex_values[string.charCodeAt(j)];
            lo = hex_values[string.charCodeAt(j + 1)];
            data[i] = (hi << 4) | lo;
        }
        return data;
    };
    var HexCoder = function () {
        Object.call(this);
    };
    ns.Class(HexCoder, Object, [DataCoder]);
    HexCoder.prototype.encode = function (data) {
        return hex_encode(data);
    };
    HexCoder.prototype.decode = function (string) {
        return hex_decode(string);
    };
    var Hex = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return hexCoder;
        },
        setCoder: function (coder) {
            hexCoder = coder;
        }
    };
    var hexCoder = new HexCoder();
    ns.format.Hex = Hex;
    ns.format.registers("Hex");
})(MONKEY);
(function (ns) {
    var Base58 = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return base58Coder;
        },
        setCoder: function (coder) {
            base58Coder = coder;
        }
    };
    var base58Coder = null;
    ns.format.Base58 = Base58;
    ns.format.registers("Base58");
})(MONKEY);
(function (ns) {
    var Base64 = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return base64Coder;
        },
        setCoder: function (coder) {
            base64Coder = coder;
        }
    };
    var base64Coder = null;
    ns.format.Base64 = Base64;
    ns.format.registers("Base64");
})(MONKEY);
(function (ns) {
    var StringCoder = ns.format.StringCoder;
    var utf8_encode = function (string) {
        var len = string.length;
        var array = [];
        var c, l;
        for (var i = 0; i < len; ++i) {
            c = string.charCodeAt(i);
            if (55296 <= c && c <= 56319) {
                l = string.charCodeAt(++i);
                c = ((c - 55296) << 10) + 65536 + l - 56320;
            }
            if (c <= 0) {
                break;
            } else {
                if (c < 128) {
                    array.push(c);
                } else {
                    if (c < 2048) {
                        array.push(192 | ((c >> 6) & 31));
                        array.push(128 | ((c >> 0) & 63));
                    } else {
                        if (c < 65536) {
                            array.push(224 | ((c >> 12) & 15));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63));
                        } else {
                            array.push(240 | ((c >> 18) & 7));
                            array.push(128 | ((c >> 12) & 63));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63));
                        }
                    }
                }
            }
        }
        return Uint8Array.from(array);
    };
    var utf8_decode = function (array) {
        var string = "";
        var len = array.length;
        var c, c2, c3, c4;
        for (var i = 0; i < len; ++i) {
            c = array[i];
            switch (c >> 4) {
                case 12:
                case 13:
                    c2 = array[++i];
                    c = ((c & 31) << 6) | (c2 & 63);
                    break;
                case 14:
                    c2 = array[++i];
                    c3 = array[++i];
                    c = ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63);
                    break;
                case 15:
                    c2 = array[++i];
                    c3 = array[++i];
                    c4 = array[++i];
                    c =
                        ((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
                    break;
            }
            if (c < 65536) {
                string += String.fromCharCode(c);
            } else {
                c -= 65536;
                string += String.fromCharCode((c >> 10) + 55296);
                string += String.fromCharCode((c & 1023) + 56320);
            }
        }
        return string;
    };
    var UTF8Coder = function () {
        Object.call(this);
    };
    ns.Class(UTF8Coder, Object, [StringCoder]);
    UTF8Coder.prototype.encode = function (string) {
        return utf8_encode(string);
    };
    UTF8Coder.prototype.decode = function (data) {
        return utf8_decode(data);
    };
    var UTF8 = {
        encode: function (string) {
            return this.getCoder().encode(string);
        },
        decode: function (data) {
            return this.getCoder().decode(data);
        },
        getCoder: function () {
            return utf8Coder;
        },
        setCoder: function (coder) {
            utf8Coder = coder;
        }
    };
    var utf8Coder = new UTF8Coder();
    ns.format.UTF8 = UTF8;
    ns.format.registers("UTF8");
})(MONKEY);
(function (ns) {
    var ObjectCoder = ns.format.ObjectCoder;
    var JsonCoder = function () {
        Object.call(this);
    };
    ns.Class(JsonCoder, Object, [ObjectCoder]);
    JsonCoder.prototype.encode = function (object) {
        return JSON.stringify(object);
    };
    JsonCoder.prototype.decode = function (string) {
        return JSON.parse(string);
    };
    var JsON = {
        encode: function (object) {
            return this.getCoder().encode(object);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return jsonCoder;
        },
        setCoder: function (coder) {
            jsonCoder = coder;
        }
    };
    var jsonCoder = new JsonCoder();
    ns.format.JSON = JsON;
    ns.format.registers("JSON");
})(MONKEY);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var CryptographyKey = function () {};
    ns.Interface(CryptographyKey, [Mapper]);
    CryptographyKey.prototype.getAlgorithm = function () {
        console.assert(false, "implement me!");
        return null;
    };
    CryptographyKey.prototype.getData = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var EncryptKey = function () {};
    ns.Interface(EncryptKey, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext) {
        console.assert(false, "implement me!");
        return null;
    };
    var DecryptKey = function () {};
    ns.Interface(DecryptKey, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext) {
        console.assert(false, "implement me!");
        return null;
    };
    DecryptKey.prototype.matches = function (pKey) {
        console.assert(false, "implement me!");
        return false;
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.registers("CryptographyKey");
    ns.crypto.registers("EncryptKey");
    ns.crypto.registers("DecryptKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function () {};
    ns.Interface(AsymmetricKey, [CryptographyKey]);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    var SignKey = function () {};
    ns.Interface(SignKey, [AsymmetricKey]);
    SignKey.prototype.sign = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    var VerifyKey = function () {};
    ns.Interface(VerifyKey, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
        console.assert(false, "implement me!");
        return false;
    };
    VerifyKey.prototype.matches = function (sKey) {
        console.assert(false, "implement me!");
        return false;
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.registers("AsymmetricKey");
    ns.crypto.registers("SignKey");
    ns.crypto.registers("VerifyKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    CryptographyKey.getAlgorithm = function (key) {
        return key["algorithm"];
    };
    CryptographyKey.promise = ns.format.UTF8.encode(
        "Moky loves May Lee forever!"
    );
    AsymmetricKey.matches = function (sKey, pKey) {
        var promise = CryptographyKey.promise;
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature);
    };
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = function () {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    SymmetricKey.matches = function (pKey, sKey) {
        var promise = CryptographyKey.promise;
        var ciphertext = pKey.encrypt(promise);
        var plaintext = sKey.decrypt(ciphertext);
        if (!plaintext || plaintext.length !== promise.length) {
            return false;
        }
        for (var i = 0; i < promise.length; ++i) {
            if (plaintext[i] !== promise[i]) {
                return false;
            }
        }
        return true;
    };
    var SymmetricKeyFactory = function () {};
    ns.Interface(SymmetricKeyFactory, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        console.assert(false, "implement me!");
        return null;
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var s_factories = {};
    SymmetricKey.setFactory = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    SymmetricKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    };
    SymmetricKey.generate = function (algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm);
        }
        return factory.generateSymmetricKey();
    };
    SymmetricKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, SymmetricKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory("*");
        }
        return factory.parseSymmetricKey(key);
    };
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.registers("SymmetricKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = function () {};
    ns.Interface(PublicKey, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    var PublicKeyFactory = function () {};
    ns.Interface(PublicKeyFactory, null);
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        console.assert(false, "implement me!");
        return null;
    };
    PublicKey.Factory = PublicKeyFactory;
    var s_factories = {};
    PublicKey.setFactory = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    PublicKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    };
    PublicKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, PublicKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (!factory) {
            factory = PublicKey.getFactory("*");
        }
        return factory.parsePublicKey(key);
    };
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.registers("PublicKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function () {};
    ns.Interface(PrivateKey, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var PrivateKeyFactory = function () {};
    ns.Interface(PrivateKeyFactory, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        console.assert(false, "implement me!");
        return null;
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var s_factories = {};
    PrivateKey.setFactory = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    PrivateKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    };
    PrivateKey.generate = function (algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm);
        }
        return factory.generatePrivateKey();
    };
    PrivateKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, PrivateKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory("*");
        }
        return factory.parsePrivateKey(key);
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.registers("PrivateKey");
})(MONKEY);
if (typeof MingKeMing !== "object") {
    MingKeMing = new MONKEY.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = new ns.Namespace();
    }
    ns.registers("protocol");
    ns.registers("mkm");
})(MingKeMing, MONKEY);
(function (ns) {
    var NetworkType = ns.type.Enum(null, {
        BTC_MAIN: 0,
        MAIN: 8,
        GROUP: 16,
        POLYLOGUE: 16,
        CHATROOM: 48,
        PROVIDER: 118,
        STATION: 136,
        THING: 128,
        ROBOT: 200
    });
    NetworkType.isUser = function (network) {
        var main = NetworkType.MAIN.valueOf();
        var btcMain = NetworkType.BTC_MAIN.valueOf();
        return (network & main) === main || network === btcMain;
    };
    NetworkType.isGroup = function (network) {
        var group = NetworkType.GROUP.valueOf();
        return (network & group) === group;
    };
    ns.protocol.NetworkType = NetworkType;
    ns.protocol.registers("NetworkType");
})(MingKeMing);
(function (ns) {
    var MetaType = ns.type.Enum(null, {
        DEFAULT: 1,
        MKM: 1,
        BTC: 2,
        ExBTC: 3,
        ETH: 4,
        ExETH: 5
    });
    MetaType.hasSeed = function (version) {
        var mkm = MetaType.MKM.valueOf();
        return (version & mkm) === mkm;
    };
    ns.protocol.MetaType = MetaType;
    ns.protocol.registers("MetaType");
})(MingKeMing);
(function (ns) {
    var Stringer = ns.type.Stringer;
    var Address = function () {};
    ns.Interface(Address, [Stringer]);
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.prototype.getNetwork = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Address.prototype.isBroadcast = function () {
        console.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isUser = function () {
        console.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isGroup = function () {
        console.assert(false, "implement me!");
        return false;
    };
    var AddressFactory = function () {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        console.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.createAddress = function (address) {
        console.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.parseAddress = function (address) {
        console.assert(false, "implement me!");
        return null;
    };
    Address.Factory = AddressFactory;
    var s_factory = null;
    Address.setFactory = function (factory) {
        s_factory = factory;
    };
    Address.getFactory = function () {
        return s_factory;
    };
    Address.generate = function (meta, network) {
        var factory = Address.getFactory();
        return factory.generateAddress(meta, network);
    };
    Address.create = function (address) {
        var factory = Address.getFactory();
        return factory.createAddress(address);
    };
    Address.parse = function (address) {
        if (!address) {
            return null;
        } else {
            if (ns.Interface.conforms(address, Address)) {
                return address;
            }
        }
        address = ns.type.Wrapper.fetchString(address);
        var factory = Address.getFactory();
        return factory.parseAddress(address);
    };
    ns.protocol.Address = Address;
    ns.protocol.registers("Address");
})(MingKeMing);
(function (ns) {
    var Stringer = ns.type.Stringer;
    var Address = ns.protocol.Address;
    var ID = function () {};
    ns.Interface(ID, [Stringer]);
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.prototype.getName = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getAddress = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getTerminal = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getType = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    ID.prototype.isBroadcast = function () {
        console.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isUser = function () {
        console.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isGroup = function () {
        console.assert(false, "implement me!");
        return false;
    };
    ID.convert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    };
    ID.revert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (ns.Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else {
                if (typeof id === "string") {
                    array.push(id);
                }
            }
        }
        return array;
    };
    var IDFactory = function () {};
    ns.Interface(IDFactory, null);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        console.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        console.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.parseID = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    ID.Factory = IDFactory;
    var s_factory;
    ID.setFactory = function (factory) {
        s_factory = factory;
    };
    ID.getFactory = function () {
        return s_factory;
    };
    ID.generate = function (meta, network, terminal) {
        var factory = ID.getFactory();
        return factory.generateID(meta, network, terminal);
    };
    ID.create = function (name, address, terminal) {
        var factory = ID.getFactory();
        return factory.createID(name, address, terminal);
    };
    ID.parse = function (identifier) {
        if (!identifier) {
            return null;
        } else {
            if (ns.Interface.conforms(identifier, ID)) {
                return identifier;
            }
        }
        identifier = ns.type.Wrapper.fetchString(identifier);
        var factory = ID.getFactory();
        return factory.parseID(identifier);
    };
    ns.protocol.ID = ID;
    ns.protocol.registers("ID");
})(MingKeMing);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var Base64 = ns.format.Base64;
    var UTF8 = ns.format.UTF8;
    var PublicKey = ns.crypto.PublicKey;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Meta = function () {};
    ns.Interface(Meta, [Mapper]);
    Meta.prototype.getType = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Meta.prototype.getKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getSeed = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getFingerprint = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.generateAddress = function (network) {
        console.assert(false, "implement me!");
        return null;
    };
    Meta.getType = function (meta) {
        var version = meta["type"];
        if (!version) {
            version = meta["version"];
        }
        return version;
    };
    Meta.getKey = function (meta) {
        var key = meta["key"];
        if (!key) {
            throw new TypeError("meta key not found: " + meta);
        }
        return PublicKey.parse(key);
    };
    Meta.getSeed = function (meta) {
        return meta["seed"];
    };
    Meta.getFingerprint = function (meta) {
        var base64 = meta["fingerprint"];
        if (!base64) {
            return null;
        }
        return Base64.decode(base64);
    };
    Meta.check = function (meta) {
        var key = meta.getKey();
        if (!key) {
            return false;
        }
        if (!MetaType.hasSeed(meta.getType())) {
            return true;
        }
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        if (!seed || !fingerprint) {
            return false;
        }
        return key.verify(UTF8.encode(seed), fingerprint);
    };
    Meta.matches = function (meta, id_or_key) {
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_id(meta, id_or_key);
        } else {
            if (ns.Interface.conforms(id_or_key, PublicKey)) {
                return match_key(meta, id_or_key);
            } else {
                return false;
            }
        }
    };
    var match_id = function (meta, id) {
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== id.getName()) {
                return false;
            }
        }
        var address = Address.generate(meta, id.getType());
        return id.getAddress().equals(address);
    };
    var match_key = function (meta, key) {
        if (meta.getKey().equals(key)) {
            return true;
        }
        if (MetaType.hasSeed(meta.getType())) {
            var seed = meta.getSeed();
            var fingerprint = meta.getFingerprint();
            return key.every(UTF8.encode(seed), fingerprint);
        } else {
            return false;
        }
    };
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var MetaFactory = function () {};
    ns.Interface(MetaFactory, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        console.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        console.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.parseMeta = function (meta) {
        console.assert(false, "implement me!");
        return null;
    };
    Meta.Factory = MetaFactory;
    var s_factories = {};
    Meta.setFactory = function (type, factory) {
        s_factories[EnumToUint(type)] = factory;
    };
    Meta.getFactory = function (type) {
        return s_factories[EnumToUint(type)];
    };
    Meta.create = function (type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type);
        }
        return factory.createMeta(key, seed, fingerprint);
    };
    Meta.generate = function (type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type);
        }
        return factory.generateMeta(sKey, seed);
    };
    Meta.parse = function (meta) {
        if (!meta) {
            return null;
        } else {
            if (ns.Interface.conforms(meta, Meta)) {
                return meta;
            }
        }
        meta = ns.type.Wrapper.fetchMap(meta);
        var type = Meta.getType(meta);
        var factory = Meta.getFactory(type);
        if (!factory) {
            factory = Meta.getFactory(0);
        }
        return factory.parseMeta(meta);
    };
    ns.protocol.Meta = Meta;
    ns.protocol.registers("Meta");
})(MingKeMing);
(function (ns) {
    var TAI = function () {};
    ns.Interface(TAI, null);
    TAI.prototype.isValid = function () {
        console.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.verify = function (publicKey) {
        console.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.sign = function (privateKey) {
        console.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.allProperties = function () {
        console.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.getProperty = function (name) {
        console.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.setProperty = function (name, value) {
        console.assert(false, "implement me!");
    };
    ns.protocol.TAI = TAI;
    ns.protocol.registers("TAI");
})(MingKeMing);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = function () {};
    ns.Interface(Document, [TAI, Mapper]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getIdentifier = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getTime = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getName = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Document.prototype.setName = function (name) {
        console.assert(false, "implement me!");
    };
    Document.getType = function (doc) {
        return doc["type"];
    };
    Document.getIdentifier = function (doc) {
        return ID.parse(doc["ID"]);
    };
    Document.getData = function (doc) {
        var utf8 = doc["data"];
        if (utf8) {
            return ns.format.UTF8.encode(utf8);
        } else {
            return null;
        }
    };
    Document.getSignature = function (doc) {
        var base64 = doc["signature"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    var DocumentFactory = function () {};
    ns.Interface(DocumentFactory, null);
    DocumentFactory.prototype.createDocument = function (
        identifier,
        data,
        signature
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
        console.assert(false, "implement me!");
        return null;
    };
    Document.Factory = DocumentFactory;
    var s_factories = {};
    Document.setFactory = function (type, factory) {
        s_factories[type] = factory;
    };
    Document.getFactory = function (type) {
        return s_factories[type];
    };
    Document.create = function (type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw new ReferenceError("document type not support: " + type);
        }
        return factory.createDocument(identifier, data, signature);
    };
    Document.parse = function (doc) {
        if (!doc) {
            return null;
        } else {
            if (ns.Interface.conforms(doc, Document)) {
                return doc;
            }
        }
        doc = ns.type.Wrapper.fetchMap(doc);
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory("*");
        }
        return factory.parseDocument(doc);
    };
    ns.protocol.Document = Document;
    ns.protocol.registers("Document");
})(MingKeMing);
(function (ns) {
    var Document = ns.protocol.Document;
    var Visa = function () {};
    ns.Interface(Visa, [Document]);
    Visa.prototype.getKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setKey = function (publicKey) {
        console.assert(false, "implement me!");
    };
    Visa.prototype.getAvatar = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setAvatar = function (url) {
        console.assert(false, "implement me!");
    };
    ns.protocol.Visa = Visa;
    ns.protocol.registers("Visa");
})(MingKeMing);
(function (ns) {
    var Document = ns.protocol.Document;
    var Bulletin = function () {};
    ns.Interface(Bulletin, [Document]);
    Bulletin.prototype.getAssistants = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Bulletin.prototype.setAssistants = function (assistants) {
        console.assert(false, "implement me!");
    };
    ns.protocol.Bulletin = Bulletin;
    ns.protocol.registers("Bulletin");
})(MingKeMing);
(function (ns) {
    var ConstantString = ns.type.ConstantString;
    var ID = ns.protocol.ID;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    ns.Class(Identifier, ConstantString, [ID]);
    Identifier.prototype.getName = function () {
        return this.__name;
    };
    Identifier.prototype.getAddress = function () {
        return this.__address;
    };
    Identifier.prototype.getTerminal = function () {
        return this.__terminal;
    };
    Identifier.prototype.getType = function () {
        return this.getAddress().getNetwork();
    };
    Identifier.prototype.isBroadcast = function () {
        return this.getAddress().isBroadcast();
    };
    Identifier.prototype.isUser = function () {
        return this.getAddress().isUser();
    };
    Identifier.prototype.isGroup = function () {
        return this.getAddress().isGroup();
    };
    ns.mkm.Identifier = Identifier;
    ns.mkm.registers("Identifier");
})(MingKeMing);
(function (ns) {
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;
    var concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + "@" + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + "/" + terminal;
        }
        return string;
    };
    var parse = function (string) {
        var name, address, terminal;
        var pair = string.split("/");
        if (pair.length === 1) {
            terminal = null;
        } else {
            terminal = pair[1];
        }
        pair = pair[0].split("@");
        if (pair.length === 1) {
            name = null;
            address = Address.parse(pair[0]);
        } else {
            name = pair[0];
            address = Address.parse(pair[1]);
        }
        if (!address) {
            return null;
        }
        return new Identifier(string, name, address, terminal);
    };
    var IDFactory = function () {
        Object.call(this);
        this.__identifiers = {};
    };
    ns.Class(IDFactory, Object, [ID.Factory]);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        var address = Address.generate(meta, network);
        return ID.create(meta.getSeed(), address, terminal);
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    };
    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };
    ns.mkm.IDFactory = IDFactory;
    ns.mkm.registers("IDFactory");
})(MingKeMing);
(function (ns) {
    var Address = ns.protocol.Address;
    var AddressFactory = function () {
        Object.call(this);
        this.__addresses = {};
        this.__addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.__addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE;
    };
    ns.Class(AddressFactory, Object, [Address.Factory]);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        var address = meta.generateAddress(network);
        if (address) {
            this.__addresses[address.toString()] = address;
        }
        return address;
    };
    AddressFactory.prototype.parseAddress = function (string) {
        var address = this.__addresses[string];
        if (!address) {
            address = Address.create(string);
            if (address) {
                this.__addresses[string] = address;
            }
        }
        return address;
    };
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.registers("AddressFactory");
})(MingKeMing);
(function (ns) {
    var ConstantString = ns.type.ConstantString;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf();
        }
        this.__network = network;
    };
    ns.Class(BroadcastAddress, ConstantString, [Address]);
    BroadcastAddress.prototype.getNetwork = function () {
        return this.__network;
    };
    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };
    BroadcastAddress.prototype.isUser = function () {
        return NetworkType.isUser(this.__network);
    };
    BroadcastAddress.prototype.isGroup = function () {
        return NetworkType.isGroup(this.__network);
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", NetworkType.GROUP);
    ns.mkm.BroadcastAddress = BroadcastAddress;
    ns.mkm.registers("BroadcastAddress");
})(MingKeMing);
(function (ns) {
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.mkm.IDFactory;
    var factory = new IDFactory();
    ID.setFactory(factory);
    ID.ANYONE = factory.createID("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID("everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = factory.createID("moky", Address.ANYWHERE, null);
})(MingKeMing);
(function (ns) {
    var Base64 = ns.format.Base64;
    var Dictionary = ns.type.Dictionary;
    var Meta = ns.protocol.Meta;
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var meta;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = Meta.getType(meta);
            key = Meta.getKey(meta);
            seed = Meta.getSeed(meta);
            fingerprint = Meta.getFingerprint(meta);
        } else {
            if (arguments.length === 2) {
                type = EnumToUint(arguments[0]);
                key = arguments[1];
                seed = null;
                fingerprint = null;
                meta = { type: type, key: key.toMap() };
            } else {
                if (arguments.length === 4) {
                    type = EnumToUint(arguments[0]);
                    key = arguments[1];
                    seed = arguments[2];
                    fingerprint = arguments[3];
                    meta = {
                        type: type,
                        key: key.toMap(),
                        seed: seed,
                        fingerprint: Base64.encode(fingerprint)
                    };
                } else {
                    throw new SyntaxError("meta arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
    };
    ns.Class(BaseMeta, Dictionary, [Meta]);
    BaseMeta.prototype.getType = function () {
        return this.__type;
    };
    BaseMeta.prototype.getKey = function () {
        return this.__key;
    };
    BaseMeta.prototype.getSeed = function () {
        return this.__seed;
    };
    BaseMeta.prototype.getFingerprint = function () {
        return this.__fingerprint;
    };
    ns.mkm.BaseMeta = BaseMeta;
    ns.mkm.registers("BaseMeta");
})(MingKeMing);
(function (ns) {
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JSON = ns.format.JSON;
    var Dictionary = ns.type.Dictionary;
    var Document = ns.protocol.Document;
    var BaseDocument = function () {
        var map, status;
        var identifier, data;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            status = 0;
            identifier = null;
            data = null;
            properties = null;
        } else {
            if (arguments.length === 2) {
                identifier = arguments[0];
                var type = arguments[1];
                map = { ID: identifier.toString() };
                status = 0;
                data = null;
                if (type && type.length > 1) {
                    properties = { type: type };
                } else {
                    properties = null;
                }
            } else {
                if (arguments.length === 3) {
                    identifier = arguments[0];
                    data = arguments[1];
                    var signature = arguments[2];
                    map = { ID: identifier.toString(), data: data, signature: signature };
                    status = 1;
                    properties = null;
                } else {
                    throw new SyntaxError("document arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;
        this.__sig = null;
        this.__properties = properties;
        this.__status = status;
    };
    ns.Class(BaseDocument, Dictionary, [Document]);
    BaseDocument.prototype.isValid = function () {
        return this.__status > 0;
    };
    BaseDocument.prototype.getType = function () {
        var type = this.getProperty("type");
        if (!type) {
            type = Document.getType(this.toMap());
        }
        return type;
    };
    BaseDocument.prototype.getIdentifier = function () {
        if (this.__identifier === null) {
            this.__identifier = Document.getIdentifier(this.toMap());
        }
        return this.__identifier;
    };
    BaseDocument.prototype.getData = function () {
        if (this.__json === null) {
            this.__json = this.getValue("data");
        }
        return this.__json;
    };
    BaseDocument.prototype.getSignature = function () {
        if (this.__sig === null) {
            var base64 = this.getValue("signature");
            if (base64) {
                this.__sig = Base64.decode(base64);
            }
        }
        return this.__sig;
    };
    BaseDocument.prototype.allProperties = function () {
        if (this.__status < 0) {
            return null;
        }
        if (this.__properties === null) {
            var data = this.getData();
            if (data) {
                this.__properties = JSON.decode(data);
            } else {
                this.__properties = {};
            }
        }
        return this.__properties;
    };
    BaseDocument.prototype.getProperty = function (name) {
        var dict = this.allProperties();
        if (!dict) {
            return null;
        }
        return dict[name];
    };
    BaseDocument.prototype.setProperty = function (name, value) {
        this.__status = 0;
        var dict = this.allProperties();
        dict[name] = value;
        this.removeValue("data");
        this.removeValue("signature");
        this.__json = null;
        this.__sig = null;
    };
    BaseDocument.prototype.verify = function (publicKey) {
        if (this.__status > 0) {
            return true;
        }
        var data = this.getData();
        var signature = this.getSignature();
        if (!data) {
            if (!signature) {
                this.__status = 0;
            } else {
                this.__status = -1;
            }
        } else {
            if (!signature) {
                this.__status = -1;
            } else {
                if (publicKey.verify(UTF8.encode(data), signature)) {
                    this.__status = 1;
                }
            }
        }
        return this.__status > 0;
    };
    BaseDocument.prototype.sign = function (privateKey) {
        if (this.__status > 0) {
            return this.getSignature();
        }
        var now = new Date();
        this.setProperty("time", now.getTime() / 1000);
        this.__status = 1;
        var dict = this.allProperties();
        var json = JSON.encode(dict);
        var data = UTF8.encode(json);
        var sig = privateKey.sign(data);
        var b64 = Base64.encode(sig);
        this.__json = json;
        this.__sig = sig;
        this.setValue("data", json);
        this.setValue("signature", b64);
        return this.__sig;
    };
    BaseDocument.prototype.getTime = function () {
        var timestamp = this.getProperty("time");
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };
    BaseDocument.prototype.getName = function () {
        return this.getProperty("name");
    };
    BaseDocument.prototype.setName = function (name) {
        this.setProperty("name", name);
    };
    ns.mkm.BaseDocument = BaseDocument;
    ns.mkm.registers("BaseDocument");
})(MingKeMing);
(function (ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__key = null;
    };
    ns.Class(BaseVisa, BaseDocument, [Visa]);
    BaseVisa.prototype.getKey = function () {
        if (this.__key === null) {
            var key = this.getProperty("key");
            if (key) {
                key = PublicKey.parse(key);
                if (ns.Interface.conforms(key, EncryptKey)) {
                    this.__key = key;
                }
            }
        }
        return this.__key;
    };
    BaseVisa.prototype.setKey = function (publicKey) {
        this.setProperty("key", publicKey.toMap());
        this.__key = publicKey;
    };
    BaseVisa.prototype.getAvatar = function () {
        return this.getProperty("avatar");
    };
    BaseVisa.prototype.setAvatar = function (url) {
        this.setProperty("avatar", url);
    };
    ns.mkm.BaseVisa = BaseVisa;
    ns.mkm.registers("BaseVisa");
})(MingKeMing);
(function (ns) {
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__assistants = null;
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin]);
    BaseBulletin.prototype.getAssistants = function () {
        if (!this.__assistants) {
            var assistants = this.getProperty("assistants");
            if (assistants) {
                this.__assistants = ID.convert(assistants);
            }
        }
        return this.__assistants;
    };
    BaseBulletin.prototype.setAssistants = function (assistants) {
        if (assistants && assistants.length > 0) {
            this.setProperty("assistants", ID.revert(assistants));
        } else {
            this.setProperty("assistants", null);
        }
    };
    ns.mkm.BaseBulletin = BaseBulletin;
    ns.mkm.registers("BaseBulletin");
})(MingKeMing);
if (typeof DaoKeDao !== "object") {
    DaoKeDao = new MingKeMing.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = new ns.Namespace();
    }
    ns.registers("protocol");
    ns.registers("dkd");
})(DaoKeDao, MingKeMing);
(function (ns) {
    var ContentType = ns.type.Enum(null, {
        TEXT: 1,
        FILE: 16,
        IMAGE: 18,
        AUDIO: 20,
        VIDEO: 22,
        PAGE: 32,
        QUOTE: 55,
        MONEY: 64,
        TRANSFER: 65,
        LUCKY_MONEY: 66,
        CLAIM_PAYMENT: 72,
        SPLIT_BILL: 73,
        COMMAND: 136,
        HISTORY: 137,
        FORWARD: 255
    });
    ns.protocol.ContentType = ContentType;
    ns.protocol.registers("ContentType");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Mapper = ns.type.Mapper;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Content = function () {};
    ns.Interface(Content, [Mapper]);
    Content.prototype.getType = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Content.getType = function (content) {
        content = Wrapper.fetchMap(content);
        return content["type"];
    };
    Content.prototype.getSerialNumber = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Content.getSerialNumber = function (content) {
        content = Wrapper.fetchMap(content);
        return content["sn"];
    };
    Content.prototype.getTime = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Content.getTime = function (content) {
        content = Wrapper.fetchMap(content);
        var timestamp = content["time"];
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };
    Content.prototype.getGroup = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Content.prototype.setGroup = function (identifier) {
        console.assert(false, "implement me!");
    };
    Content.getGroup = function (content) {
        content = Wrapper.fetchMap(content);
        return ID.parse(content["group"]);
    };
    Content.setGroup = function (group, content) {
        content = Wrapper.fetchMap(content);
        if (group) {
            content["group"] = group.toString();
        } else {
            delete content["group"];
        }
    };
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var ContentFactory = function () {};
    ns.Interface(ContentFactory, null);
    ContentFactory.prototype.parseContent = function (content) {
        console.assert(false, "implement me!");
        return null;
    };
    Content.Factory = ContentFactory;
    var s_content_factories = {};
    Content.setFactory = function (type, factory) {
        s_content_factories[EnumToUint(type)] = factory;
    };
    Content.getFactory = function (type) {
        return s_content_factories[EnumToUint(type)];
    };
    Content.parse = function (content) {
        if (!content) {
            return null;
        } else {
            if (ns.Interface.conforms(content, Content)) {
                return content;
            }
        }
        content = Wrapper.fetchMap(content);
        var type = Content.getType(content);
        var factory = Content.getFactory(type);
        if (!factory) {
            factory = Content.getFactory(0);
        }
        return factory.parseContent(content);
    };
    ns.protocol.Content = Content;
    ns.protocol.registers("Content");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Mapper = ns.type.Mapper;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Envelope = function () {};
    ns.Interface(Envelope, [Mapper]);
    Envelope.prototype.getSender = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.getSender = function (env) {
        env = Wrapper.fetchMap(env);
        return ID.parse(env["sender"]);
    };
    Envelope.prototype.getReceiver = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.getReceiver = function (env) {
        env = Wrapper.fetchMap(env);
        return ID.parse(env["receiver"]);
    };
    Envelope.prototype.getTime = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.getTime = function (env) {
        env = Wrapper.fetchMap(env);
        var timestamp = env["time"];
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };
    Envelope.prototype.getGroup = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.prototype.setGroup = function (identifier) {
        console.assert(false, "implement me!");
    };
    Envelope.getGroup = function (env) {
        env = Wrapper.fetchMap(env);
        return ID.parse(env["group"]);
    };
    Envelope.setGroup = function (group, env) {
        env = Wrapper.fetchMap(env);
        if (group) {
            env["group"] = group.toString();
        } else {
            delete env["group"];
        }
    };
    Envelope.prototype.getType = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.prototype.setType = function (type) {
        console.assert(false, "implement me!");
    };
    Envelope.getType = function (env) {
        env = Wrapper.fetchMap(env);
        var type = env["type"];
        if (type) {
            return type;
        } else {
            return 0;
        }
    };
    Envelope.setType = function (type, env) {
        env = Wrapper.fetchMap(env);
        if (type) {
            if (type instanceof ContentType) {
                type = type.valueOf();
            }
            env["type"] = type;
        } else {
            delete env["type"];
        }
    };
    var EnvelopeFactory = function () {};
    ns.Interface(EnvelopeFactory, null);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        console.assert(false, "implement me!");
        return null;
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        console.assert(false, "implement me!");
        return null;
    };
    Envelope.Factory = EnvelopeFactory;
    var s_envelope_factory = null;
    Envelope.getFactory = function () {
        return s_envelope_factory;
    };
    Envelope.setFactory = function (factory) {
        s_envelope_factory = factory;
    };
    Envelope.create = function (from, to, when) {
        var factory = Envelope.getFactory();
        return factory.createEnvelope(from, to, when);
    };
    Envelope.parse = function (env) {
        if (!env) {
            return null;
        } else {
            if (ns.Interface.conforms(env, Envelope)) {
                return env;
            }
        }
        env = Wrapper.fetchMap(env);
        var factory = Envelope.getFactory();
        return factory.parseEnvelope(env);
    };
    ns.protocol.Envelope = Envelope;
    ns.protocol.registers("Envelope");
})(DaoKeDao);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var Envelope = ns.protocol.Envelope;
    var Message = function () {};
    ns.Interface(Message, [Mapper]);
    Message.prototype.getDelegate = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.prototype.setDelegate = function (delegate) {
        console.assert(false, "implement me!");
    };
    Message.prototype.getEnvelope = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.getEnvelope = function (msg) {
        return Envelope.parse(msg);
    };
    Message.prototype.getSender = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getReceiver = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getTime = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getGroup = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getType = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var MessageDelegate = function () {};
    ns.Interface(MessageDelegate, null);
    Message.Delegate = MessageDelegate;
    ns.protocol.Message = Message;
    ns.protocol.registers("Message");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var Message = ns.protocol.Message;
    var InstantMessage = function () {};
    ns.Interface(InstantMessage, [Message]);
    InstantMessage.prototype.getContent = function () {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessage.getContent = function (msg) {
        msg = Wrapper.fetchMap(msg);
        return Content.parse(msg["content"]);
    };
    InstantMessage.prototype.encrypt = function (password, members) {
        console.assert(false, "implement me!");
        return null;
    };
    var InstantMessageDelegate = function () {};
    ns.Interface(InstantMessageDelegate, [Message.Delegate]);
    InstantMessageDelegate.prototype.serializeContent = function (
        content,
        pwd,
        iMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encryptContent = function (data, pwd, iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encodeData = function (data, iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.serializeKey = function (pwd, iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encryptKey = function (
        data,
        receiver,
        iMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encodeKey = function (data, iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessage.Delegate = InstantMessageDelegate;
    var InstantMessageFactory = function () {};
    ns.Interface(InstantMessageFactory, null);
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        console.assert(false, "implement me!");
        return 0;
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        console.assert(false, "implement me!");
        return null;
    };
    InstantMessage.Factory = InstantMessageFactory;
    var s_instant_factory = null;
    InstantMessage.getFactory = function () {
        return s_instant_factory;
    };
    InstantMessage.setFactory = function (factory) {
        s_instant_factory = factory;
    };
    InstantMessage.generateSerialNumber = function (msgType, now) {
        var factory = InstantMessage.getFactory();
        return factory.generateSerialNumber(msgType, now);
    };
    InstantMessage.create = function (head, body) {
        var factory = InstantMessage.getFactory();
        return factory.createInstantMessage(head, body);
    };
    InstantMessage.parse = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (ns.Interface.conforms(msg, InstantMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = InstantMessage.getFactory();
        return factory.parseInstantMessage(msg);
    };
    ns.protocol.InstantMessage = InstantMessage;
    ns.protocol.registers("InstantMessage");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Message = ns.protocol.Message;
    var SecureMessage = function () {};
    ns.Interface(SecureMessage, [Message]);
    SecureMessage.prototype.getData = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.getEncryptedKey = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.getEncryptedKeys = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.decrypt = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.sign = function () {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.split = function (members) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.trim = function (member) {
        console.assert(false, "implement me!");
        return null;
    };
    var SecureMessageDelegate = function () {};
    ns.Interface(SecureMessageDelegate, [Message.Delegate]);
    SecureMessageDelegate.prototype.decodeKey = function (key, sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decryptKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.deserializeKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decodeData = function (data, sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decryptContent = function (data, pwd, sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.deserializeContent = function (
        data,
        pwd,
        sMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.signData = function (data, sender, sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.encodeSignature = function (signature, sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.Delegate = SecureMessageDelegate;
    var SecureMessageFactory = function () {};
    ns.Interface(SecureMessageFactory, null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        console.assert(false, "implement me!");
        return null;
    };
    SecureMessage.Factory = SecureMessageFactory;
    var s_secure_factory = null;
    SecureMessage.getFactory = function () {
        return s_secure_factory;
    };
    SecureMessage.setFactory = function (factory) {
        s_secure_factory = factory;
    };
    SecureMessage.parse = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (ns.Interface.conforms(msg, SecureMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = SecureMessage.getFactory();
        return factory.parseSecureMessage(msg);
    };
    ns.protocol.SecureMessage = SecureMessage;
    ns.protocol.registers("SecureMessage");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = function () {};
    ns.Interface(ReliableMessage, [SecureMessage]);
    ReliableMessage.prototype.getSignature = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.getMeta = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.setMeta = function (meta) {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.getMeta = function (msg) {
        msg = Wrapper.fetchMap(msg);
        return Meta.parse(msg["meta"]);
    };
    ReliableMessage.setMeta = function (meta, msg) {
        msg = Wrapper.fetchMap(msg);
        if (meta) {
            msg["meta"] = meta.toMap();
        } else {
            delete msg["meta"];
        }
    };
    ReliableMessage.prototype.getVisa = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.setVisa = function (doc) {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.getVisa = function (msg) {
        msg = Wrapper.fetchMap(msg);
        return Document.parse(msg["visa"]);
    };
    ReliableMessage.setVisa = function (doc, msg) {
        msg = Wrapper.fetchMap(msg);
        if (doc) {
            msg["visa"] = doc.toMap();
        } else {
            delete msg["visa"];
        }
    };
    ReliableMessage.prototype.verify = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var ReliableMessageDelegate = function () {};
    ns.Interface(ReliableMessageDelegate, [SecureMessage.Delegate]);
    ReliableMessageDelegate.prototype.decodeSignature = function (
        signature,
        rMsg
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessageDelegate.prototype.verifyDataSignature = function (
        data,
        signature,
        sender,
        rMsg
    ) {
        console.assert(false, "implement me!");
        return false;
    };
    ReliableMessage.Delegate = ReliableMessageDelegate;
    var ReliableMessageFactory = function () {};
    ns.Interface(ReliableMessageFactory, null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        console.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.Factory = ReliableMessageFactory;
    var s_reliable_factory = null;
    ReliableMessage.getFactory = function () {
        return s_reliable_factory;
    };
    ReliableMessage.setFactory = function (factory) {
        s_reliable_factory = factory;
    };
    ReliableMessage.parse = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (ns.Interface.conforms(msg, ReliableMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = ReliableMessage.getFactory();
        return factory.parseReliableMessage(msg);
    };
    ns.protocol.ReliableMessage = ReliableMessage;
    ns.protocol.registers("ReliableMessage");
})(DaoKeDao);
(function (ns) {
    var Dictionary = ns.type.Dictionary;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var BaseContent = function (info) {
        if (info instanceof ContentType) {
            info = info.valueOf();
        }
        var content, type, sn, time;
        if (typeof info === "number") {
            type = info;
            time = new Date();
            sn = InstantMessage.generateSerialNumber(type, time);
            content = { type: type, sn: sn, time: time.getTime() / 1000 };
        } else {
            content = info;
            type = Content.getType(content);
            sn = Content.getSerialNumber(content);
            time = Content.getTime(content);
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time;
    };
    ns.Class(BaseContent, Dictionary, [Content]);
    BaseContent.prototype.getType = function () {
        return this.__type;
    };
    BaseContent.prototype.getSerialNumber = function () {
        return this.__sn;
    };
    BaseContent.prototype.getTime = function () {
        return this.__time;
    };
    BaseContent.prototype.getGroup = function () {
        return Content.getGroup(this);
    };
    BaseContent.prototype.setGroup = function (identifier) {
        Content.setGroup(identifier, this);
    };
    ns.dkd.BaseContent = BaseContent;
    ns.dkd.registers("BaseContent");
})(DaoKeDao);
(function (ns) {
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = Envelope.getSender(env);
            to = Envelope.getReceiver(env);
            when = Envelope.getTime(env);
        } else {
            if (arguments.length === 2) {
                from = arguments[0];
                to = arguments[1];
                when = new Date();
                env = {
                    sender: from.toString(),
                    receiver: to.toString(),
                    time: when.getTime() / 1000
                };
            } else {
                if (arguments.length === 3) {
                    from = arguments[0];
                    to = arguments[1];
                    when = arguments[2];
                    if (!when) {
                        when = new Date();
                    } else {
                        if (typeof when === "number") {
                            when = new Date(when * 1000);
                        }
                    }
                    env = {
                        sender: from.toString(),
                        receiver: to.toString(),
                        time: when.getTime() / 1000
                    };
                } else {
                    throw new SyntaxError("envelope arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when;
    };
    ns.Class(MessageEnvelope, Dictionary, [Envelope]);
    MessageEnvelope.prototype.getSender = function () {
        return this.__sender;
    };
    MessageEnvelope.prototype.getReceiver = function () {
        return this.__receiver;
    };
    MessageEnvelope.prototype.getTime = function () {
        return this.__time;
    };
    MessageEnvelope.prototype.getGroup = function () {
        return Envelope.getGroup(this);
    };
    MessageEnvelope.prototype.setGroup = function (identifier) {
        Envelope.setGroup(identifier, this);
    };
    MessageEnvelope.prototype.getType = function () {
        return Envelope.getType(this);
    };
    MessageEnvelope.prototype.setType = function (type) {
        Envelope.setType(type, this);
    };
    ns.dkd.MessageEnvelope = MessageEnvelope;
    ns.dkd.registers("MessageEnvelope");
})(DaoKeDao);
(function (ns) {
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function (msg) {
        var env;
        if (ns.Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap();
        } else {
            env = Message.getEnvelope(msg);
        }
        Dictionary.call(this, msg);
        this.__envelope = env;
        this.__delegate = null;
    };
    ns.Class(BaseMessage, Dictionary, [Message]);
    BaseMessage.prototype.getDelegate = function () {
        return this.__delegate;
    };
    BaseMessage.prototype.setDelegate = function (delegate) {
        this.__delegate = delegate;
    };
    BaseMessage.prototype.getEnvelope = function () {
        return this.__envelope;
    };
    BaseMessage.prototype.getSender = function () {
        var env = this.getEnvelope();
        return env.getSender();
    };
    BaseMessage.prototype.getReceiver = function () {
        var env = this.getEnvelope();
        return env.getReceiver();
    };
    BaseMessage.prototype.getTime = function () {
        var env = this.getEnvelope();
        return env.getTime();
    };
    BaseMessage.prototype.getGroup = function () {
        var env = this.getEnvelope();
        return env.getGroup();
    };
    BaseMessage.prototype.getType = function () {
        var env = this.getEnvelope();
        return env.getTime();
    };
    ns.dkd.BaseMessage = BaseMessage;
    ns.dkd.registers("BaseMessage");
})(DaoKeDao);
(function (ns) {
    var Message = ns.protocol.Message;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.dkd.BaseMessage;
    var PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = Message.getEnvelope(msg);
            body = InstantMessage.getContent(msg);
        } else {
            if (arguments.length === 2) {
                head = arguments[0];
                body = arguments[1];
                msg = head.toMap();
                msg["content"] = body.toMap();
            } else {
                throw new SyntaxError("message arguments error: " + arguments);
            }
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body;
    };
    ns.Class(PlainMessage, BaseMessage, [InstantMessage]);
    PlainMessage.prototype.getContent = function () {
        return this.__content;
    };
    PlainMessage.prototype.getTime = function () {
        var content = this.getContent();
        var time = content.getTime();
        if (!time) {
            var env = this.getEnvelope();
            time = env.getTime();
        }
        return time;
    };
    PlainMessage.prototype.getGroup = function () {
        var content = this.getContent();
        return content.getGroup();
    };
    PlainMessage.prototype.getType = function () {
        var content = this.getContent();
        return content.getType();
    };
    PlainMessage.prototype.encrypt = function (password, members) {
        if (members && members.length > 0) {
            return encrypt_group_message.call(this, password, members);
        } else {
            return encrypt_message.call(this, password);
        }
    };
    var encrypt_message = function (password) {
        var delegate = this.getDelegate();
        var msg = prepare_data.call(this, password);
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg);
        }
        var data = delegate.encryptKey(key, this.getReceiver(), this);
        if (!data) {
            return null;
        }
        msg["key"] = delegate.encodeKey(data, this);
        return SecureMessage.parse(msg);
    };
    var encrypt_group_message = function (password, members) {
        var delegate = this.getDelegate();
        var msg = prepare_data.call(this, password);
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg);
        }
        var keys = {};
        var count = 0;
        var member;
        var data;
        for (var i = 0; i < members.length; ++i) {
            member = members[i];
            data = delegate.encryptKey(key, member, this);
            if (!data) {
                continue;
            }
            keys[member] = delegate.encodeKey(data, this);
            ++count;
        }
        if (count > 0) {
            msg["keys"] = keys;
        }
        return SecureMessage.parse(msg);
    };
    var prepare_data = function (password) {
        var delegate = this.getDelegate();
        var data = delegate.serializeContent(this.__content, password, this);
        data = delegate.encryptContent(data, password, this);
        var base64 = delegate.encodeData(data, this);
        var msg = this.copyMap();
        delete msg["content"];
        msg["data"] = base64;
        return msg;
    };
    ns.dkd.PlainMessage = PlainMessage;
    ns.dkd.registers("PlainMessage");
})(DaoKeDao);
(function (ns) {
    var Copier = ns.type.Copier;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.dkd.BaseMessage;
    var EncryptedMessage = function (msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null;
    };
    ns.Class(EncryptedMessage, BaseMessage, [SecureMessage]);
    EncryptedMessage.prototype.getData = function () {
        if (!this.__data) {
            var base64 = this.getValue("data");
            var delegate = this.getDelegate();
            this.__data = delegate.decodeData(base64, this);
        }
        return this.__data;
    };
    EncryptedMessage.prototype.getEncryptedKey = function () {
        if (!this.__key) {
            var base64 = this.getValue("key");
            if (!base64) {
                var keys = this.getEncryptedKeys();
                if (keys) {
                    var receiver = this.getReceiver();
                    base64 = keys[receiver.toString()];
                }
            }
            if (base64) {
                var delegate = this.getDelegate();
                this.__key = delegate.decodeKey(base64, this);
            }
        }
        return this.__key;
    };
    EncryptedMessage.prototype.getEncryptedKeys = function () {
        if (!this.__keys) {
            this.__keys = this.getValue("keys");
        }
        return this.__keys;
    };
    EncryptedMessage.prototype.decrypt = function () {
        var sender = this.getSender();
        var receiver;
        var group = this.getGroup();
        if (group) {
            receiver = group;
        } else {
            receiver = this.getReceiver();
        }
        var delegate = this.getDelegate();
        var key = this.getEncryptedKey();
        if (key) {
            key = delegate.decryptKey(key, sender, receiver, this);
            if (!key) {
                throw new Error("failed to decrypt key in msg: " + this);
            }
        }
        var password = delegate.deserializeKey(key, sender, receiver, this);
        if (!password) {
            throw new Error(
                "failed to get msg key: " + sender + " -> " + receiver + ", " + key
            );
        }
        var data = this.getData();
        if (!data) {
            throw new Error("failed to decode content data: " + this);
        }
        data = delegate.decryptContent(data, password, this);
        if (!data) {
            throw new Error("failed to decrypt data with key: " + password);
        }
        var content = delegate.deserializeContent(data, password, this);
        if (!content) {
            throw new Error("failed to deserialize content: " + data);
        }
        var msg = this.copyMap(false);
        delete msg["key"];
        delete msg["keys"];
        delete msg["data"];
        msg["content"] = content.toMap();
        return InstantMessage.parse(msg);
    };
    EncryptedMessage.prototype.sign = function () {
        var delegate = this.getDelegate();
        var signature = delegate.signData(this.getData(), this.getSender(), this);
        var base64 = delegate.encodeSignature(signature, this);
        var msg = this.copyMap(false);
        msg["signature"] = base64;
        return ReliableMessage.parse(msg);
    };
    EncryptedMessage.prototype.split = function (members) {
        var msg = this.copyMap(false);
        var keys = this.getEncryptedKeys();
        if (keys) {
            delete msg["keys"];
        } else {
            keys = {};
        }
        msg["group"] = this.getReceiver().toString();
        var messages = [];
        var base64;
        var item;
        var receiver;
        for (var i = 0; i < members.length; ++i) {
            receiver = members[i].toString();
            msg["receiver"] = receiver;
            base64 = keys[receiver];
            if (base64) {
                msg["key"] = base64;
            } else {
                delete msg["key"];
            }
            item = SecureMessage.parse(Copier.copyMap(msg));
            if (item) {
                messages.push(item);
            }
        }
        return messages;
    };
    EncryptedMessage.prototype.trim = function (member) {
        var msg = this.copyMap(false);
        var keys = this.getEncryptedKeys();
        if (keys) {
            var base64 = keys[member.toString()];
            if (base64) {
                msg["key"] = base64;
            }
            delete msg["keys"];
        }
        var group = this.getGroup();
        if (!group) {
            msg["group"] = this.getReceiver().toString();
        }
        msg["receiver"] = member.toString();
        return SecureMessage.parse(msg);
    };
    ns.dkd.EncryptedMessage = EncryptedMessage;
    ns.dkd.registers("EncryptedMessage");
})(DaoKeDao);
(function (ns) {
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null;
        this.__meta = null;
        this.__visa = null;
    };
    ns.Class(NetworkMessage, EncryptedMessage, [ReliableMessage]);
    NetworkMessage.prototype.getSignature = function () {
        if (!this.__signature) {
            var base64 = this.getValue("signature");
            var delegate = this.getDelegate();
            this.__signature = delegate.decodeSignature(base64, this);
        }
        return this.__signature;
    };
    NetworkMessage.prototype.setMeta = function (meta) {
        ReliableMessage.setMeta(meta, this);
        this.__meta = meta;
    };
    NetworkMessage.prototype.getMeta = function () {
        if (!this.__meta) {
            this.__meta = ReliableMessage.getMeta(this);
        }
        return this.__meta;
    };
    NetworkMessage.prototype.setVisa = function (visa) {
        ReliableMessage.setVisa(visa, this);
        this.__visa = visa;
    };
    NetworkMessage.prototype.getVisa = function () {
        if (!this.__visa) {
            this.__visa = ReliableMessage.getVisa(this);
        }
        return this.__visa;
    };
    NetworkMessage.prototype.verify = function () {
        var data = this.getData();
        if (!data) {
            throw new Error("failed to decode content data: " + this);
        }
        var signature = this.getSignature();
        if (!signature) {
            throw new Error("failed to decode message signature: " + this);
        }
        var delegate = this.getDelegate();
        if (delegate.verifyDataSignature(data, signature, this.getSender(), this)) {
            var msg = this.copyMap(false);
            delete msg["signature"];
            return SecureMessage.parse(msg);
        } else {
            return null;
        }
    };
    ns.dkd.NetworkMessage = NetworkMessage;
    ns.dkd.registers("NetworkMessage");
})(DaoKeDao);
(function (ns) {
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = ns.dkd.MessageEnvelope;
    var EnvelopeFactory = function () {
        Object.call(this);
    };
    ns.Class(EnvelopeFactory, Object, [Envelope.Factory]);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        if (!when) {
            when = new Date();
        }
        return new MessageEnvelope(from, to, when);
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        if (!env["sender"]) {
            return null;
        }
        return new MessageEnvelope(env);
    };
    Envelope.setFactory(new EnvelopeFactory());
    ns.dkd.EnvelopeFactory = EnvelopeFactory;
    ns.dkd.registers("EnvelopeFactory");
})(DaoKeDao);
(function (ns) {
    var InstantMessage = ns.protocol.InstantMessage;
    var PlainMessage = ns.dkd.PlainMessage;
    var InstantMessageFactory = function () {
        Object.call(this);
    };
    ns.Class(InstantMessageFactory, Object, [InstantMessage.Factory]);
    var MAX_LONG = 4294967295;
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        var sn = Math.ceil(Math.random() * MAX_LONG);
        if (sn > 0) {
            return sn;
        } else {
            if (sn < 0) {
                return -sn;
            }
        }
        return 9527 + 9394;
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        return new PlainMessage(head, body);
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        return new PlainMessage(msg);
    };
    InstantMessage.setFactory(new InstantMessageFactory());
    ns.dkd.InstantMessageFactory = InstantMessageFactory;
    ns.dkd.registers("InstantMessageFactory");
})(DaoKeDao);
(function (ns) {
    var SecureMessage = ns.protocol.SecureMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var SecureMessageFactory = function () {
        Object.call(this);
    };
    ns.Class(SecureMessageFactory, Object, [SecureMessage.Factory]);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        if (msg["signature"]) {
            return new NetworkMessage(msg);
        }
        return new EncryptedMessage(msg);
    };
    SecureMessage.setFactory(new SecureMessageFactory());
    ns.dkd.SecureMessageFactory = SecureMessageFactory;
    ns.dkd.registers("SecureMessageFactory");
})(DaoKeDao);
(function (ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var ReliableMessageFactory = function () {
        Object.call(this);
    };
    ns.Class(ReliableMessageFactory, Object, [ReliableMessage.Factory]);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        if (!msg["sender"] || !msg["data"] || !msg["signature"]) {
            return null;
        }
        return new NetworkMessage(msg);
    };
    ReliableMessage.setFactory(new ReliableMessageFactory());
    ns.dkd.ReliableMessageFactory = ReliableMessageFactory;
    ns.dkd.registers("ReliableMessageFactory");
})(DaoKeDao);
if (typeof DIMP !== "object") {
    DIMP = new MingKeMing.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.core !== "object") {
        ns.core = new ns.Namespace();
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = new ns.Namespace();
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = new ns.Namespace();
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = new ns.Namespace();
    }
    ns.registers("core");
    ns.registers("dkd");
    ns.registers("mkm");
    ns.registers("protocol");
    ns.protocol.registers("group");
})(DIMP, DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Content = ns.protocol.Content;
    var ForwardContent = function () {};
    ns.Interface(ForwardContent, [Content]);
    ForwardContent.prototype.setMessage = function (secret) {
        console.assert(false, "implement me!");
    };
    ForwardContent.prototype.getMessage = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ForwardContent.getMessage = function (content) {
        content = Wrapper.fetchMap(content);
        var secret = content["forward"];
        return ReliableMessage.parse(secret);
    };
    ForwardContent.setMessage = function (secret, content) {
        content = Wrapper.fetchMap(content);
        if (secret) {
            content["forward"] = Wrapper.fetchMap(secret);
        } else {
            delete content["forward"];
        }
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.registers("ForwardContent");
})(DaoKeDao);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var FileContent = function () {};
    ns.Interface(FileContent, [Content]);
    FileContent.prototype.setURL = function (url) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getURL = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setURL = function (url, content) {
        content = Wrapper.fetchMap(content);
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    FileContent.getURL = function (content) {
        content = Wrapper.fetchMap(content);
        return content["URL"];
    };
    FileContent.prototype.setFilename = function (filename) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getFilename = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setFilename = function (filename, content) {
        content = Wrapper.fetchMap(content);
        if (filename) {
            content["filename"] = filename;
        } else {
            delete content["filename"];
        }
    };
    FileContent.getFilename = function (content) {
        content = Wrapper.fetchMap(content);
        return content["filename"];
    };
    FileContent.prototype.setData = function (data) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getData = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setData = function (data, content) {
        content = Wrapper.fetchMap(content);
        if (data) {
            content["data"] = ns.format.Base64.encode(data);
        } else {
            delete content["data"];
        }
    };
    FileContent.getData = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["data"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    FileContent.prototype.setPassword = function (key) {
        console.assert(false, "implement me!");
    };
    FileContent.prototype.getPassword = function () {
        console.assert(false, "implement me!");
        return null;
    };
    FileContent.setPassword = function (key, content) {
        content = Wrapper.fetchMap(content);
        if (key) {
            content["password"] = Wrapper.fetchMap(key);
        } else {
            delete content["password"];
        }
    };
    FileContent.getPassword = function (content) {
        content = Wrapper.fetchMap(content);
        var key = content["password"];
        return SymmetricKey.parse(key);
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.registers("FileContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function () {};
    ns.Interface(ImageContent, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        console.assert(false, "implement me!");
    };
    ImageContent.prototype.getThumbnail = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ImageContent.setThumbnail = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["thumbnail"] = ns.format.Base64.encode(image);
        } else {
            delete content["thumbnail"];
        }
    };
    ImageContent.getThumbnail = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["thumbnail"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    var VideoContent = function () {};
    ns.Interface(VideoContent, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        console.assert(false, "implement me!");
    };
    VideoContent.prototype.getSnapshot = function () {
        console.assert(false, "implement me!");
        return null;
    };
    VideoContent.setSnapshot = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["snapshot"] = ns.format.Base64.encode(image);
        } else {
            delete content["snapshot"];
        }
    };
    VideoContent.getSnapshot = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["snapshot"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    var AudioContent = function () {};
    ns.Interface(AudioContent, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        console.assert(false, "implement me!");
    };
    AudioContent.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.registers("ImageContent");
    ns.protocol.registers("VideoContent");
    ns.protocol.registers("AudioContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var TextContent = function () {};
    ns.Interface(TextContent, [Content]);
    TextContent.prototype.setText = function (text) {
        console.assert(false, "implement me!");
    };
    TextContent.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.registers("TextContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var PageContent = function () {};
    ns.Interface(PageContent, [Content]);
    PageContent.prototype.setURL = function (url) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getURL = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getURL = function (content) {
        content = Wrapper.fetchMap(content);
        return content["URL"];
    };
    PageContent.setURL = function (url, content) {
        content = Wrapper.fetchMap(content);
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    PageContent.prototype.setTitle = function (title) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getTitle = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getTitle = function (content) {
        content = Wrapper.fetchMap(content);
        return content["title"];
    };
    PageContent.setTitle = function (title, content) {
        content = Wrapper.fetchMap(content);
        if (title) {
            content["title"] = title;
        } else {
            delete content["title"];
        }
    };
    PageContent.prototype.setDesc = function (text) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getDesc = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.getDesc = function (content) {
        content = Wrapper.fetchMap(content);
        return content["desc"];
    };
    PageContent.setDesc = function (text, content) {
        content = Wrapper.fetchMap(content);
        if (text) {
            content["desc"] = text;
        } else {
            delete content["desc"];
        }
    };
    PageContent.prototype.setIcon = function (image) {
        console.assert(false, "implement me!");
    };
    PageContent.prototype.getIcon = function () {
        console.assert(false, "implement me!");
        return null;
    };
    PageContent.setIcon = function (image, content) {
        content = Wrapper.fetchMap(content);
        if (image) {
            content["icon"] = ns.format.Base64.encode(image);
        } else {
            delete content["icon"];
        }
    };
    PageContent.getIcon = function (content) {
        content = Wrapper.fetchMap(content);
        var base64 = content["icon"];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.registers("PageContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var MoneyContent = function () {};
    ns.Interface(MoneyContent, [Content]);
    MoneyContent.prototype.setCurrency = function (currency) {
        console.assert(false, "implement me!");
    };
    MoneyContent.prototype.getCurrency = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setCurrency = function (currency, content) {
        content = Wrapper.fetchMap(content);
        content["currency"] = currency;
    };
    MoneyContent.getCurrency = function (content) {
        content = Wrapper.fetchMap(content);
        return content["currency"];
    };
    MoneyContent.prototype.setAmount = function (amount) {
        console.assert(false, "implement me!");
    };
    MoneyContent.prototype.getAmount = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setAmount = function (amount, content) {
        content = Wrapper.fetchMap(content);
        content["amount"] = amount;
    };
    MoneyContent.getAmount = function (content) {
        content = Wrapper.fetchMap(content);
        return content["amount"];
    };
    var TransferContent = function () {};
    ns.Interface(TransferContent, [MoneyContent]);
    TransferContent.prototype.setComment = function (text) {
        console.assert(false, "implement me!");
    };
    TransferContent.prototype.getComment = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.registers("MoneyContent");
    ns.protocol.registers("TransferContent");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Content = ns.protocol.Content;
    var Command = function () {};
    ns.Interface(Command, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    Command.prototype.getCommand = function () {
        console.assert(false, "implement me!");
        return "";
    };
    Command.getCommand = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["command"];
    };
    var CommandFactory = function () {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        console.assert(false, "implement me!");
        return null;
    };
    Command.Factory = CommandFactory;
    var s_command_factories = {};
    Command.setFactory = function (name, factory) {
        s_command_factories[name] = factory;
    };
    Command.getFactory = function (name) {
        return s_command_factories[name];
    };
    ns.protocol.Command = Command;
    ns.protocol.registers("Command");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function () {};
    ns.Interface(MetaCommand, [Command]);
    MetaCommand.prototype.setIdentifier = function (identifier) {
        console.assert(false, "implement me!");
    };
    MetaCommand.prototype.getIdentifier = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (identifier) {
            cmd["ID"] = identifier.toString();
        } else {
            delete cmd["ID"];
        }
    };
    MetaCommand.getIdentifier = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return ID.parse(cmd["ID"]);
    };
    MetaCommand.prototype.setMeta = function (meta) {
        console.assert(false, "implement me!");
    };
    MetaCommand.prototype.getMeta = function () {
        console.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setMeta = function (meta, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (meta) {
            cmd["meta"] = Wrapper.fetchMap(meta);
        } else {
            delete cmd["meta"];
        }
    };
    MetaCommand.getMeta = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return Meta.parse(cmd["meta"]);
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.registers("MetaCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function () {};
    ns.Interface(DocumentCommand, [MetaCommand]);
    DocumentCommand.prototype.setDocument = function (doc) {
        console.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getDocument = function () {
        console.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (doc) {
            cmd["document"] = Wrapper.fetchMap(doc);
        } else {
            delete cmd["command"];
        }
    };
    DocumentCommand.getDocument = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        var doc = cmd["document"];
        return Document.parse(doc);
    };
    DocumentCommand.prototype.setSignature = function (base64) {
        console.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getSignature = function () {
        console.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        cmd["signature"] = base64;
    };
    DocumentCommand.getSignature = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["signature"];
    };
    DocumentCommand.query = function (identifier, signature) {
        return new DocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        return new DocumentCommand(identifier, meta, doc);
    };
    ns.protocol.DocumentCommand = DocumentCommand;
    ns.protocol.registers("DocumentCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var Command = ns.protocol.Command;
    var HistoryCommand = function () {};
    ns.Interface(HistoryCommand, [Command]);
    HistoryCommand.prototype.getHistoryEvent = function () {
        console.assert(false, "implement me!");
        return null;
    };
    HistoryCommand.getHistoryEvent = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return cmd["event"];
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.registers("HistoryCommand");
})(DIMP);
(function (ns) {
    var Wrapper = ns.type.Wrapper;
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function () {};
    ns.Interface(GroupCommand, [HistoryCommand]);
    GroupCommand.FOUND = "found";
    GroupCommand.ABDICATE = "abdicate";
    GroupCommand.INVITE = "invite";
    GroupCommand.EXPEL = "expel";
    GroupCommand.JOIN = "join";
    GroupCommand.QUIT = "quit";
    GroupCommand.QUERY = "query";
    GroupCommand.RESET = "reset";
    GroupCommand.HIRE = "hire";
    GroupCommand.FIRE = "fire";
    GroupCommand.RESIGN = "resign";
    GroupCommand.prototype.setMember = function (identifier) {
        console.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMember = function () {
        console.assert(false, "implement me!");
        return null;
    };
    GroupCommand.prototype.setMembers = function (members) {
        console.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    GroupCommand.setMember = function (member, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (member) {
            cmd["member"] = member.toString();
        } else {
            delete cmd["member"];
        }
    };
    GroupCommand.getMember = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        return ID.parse(cmd["member"]);
    };
    GroupCommand.setMembers = function (members, cmd) {
        cmd = Wrapper.fetchMap(cmd);
        if (members) {
            cmd["members"] = ID.revert(members);
        } else {
            delete cmd["members"];
        }
    };
    GroupCommand.getMembers = function (cmd) {
        cmd = Wrapper.fetchMap(cmd);
        var members = cmd["members"];
        if (members) {
            return ID.convert(members);
        } else {
            return null;
        }
    };
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.registers("GroupCommand");
})(DIMP);
(function (ns) {
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function () {};
    ns.Interface(InviteCommand, [GroupCommand]);
    InviteCommand.prototype.getInviteMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var ExpelCommand = function () {};
    ns.Interface(ExpelCommand, [GroupCommand]);
    ExpelCommand.prototype.getExpelMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var JoinCommand = function () {};
    ns.Interface(JoinCommand, [GroupCommand]);
    JoinCommand.prototype.getAsk = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var QuitCommand = function () {};
    ns.Interface(QuitCommand, [GroupCommand]);
    QuitCommand.prototype.getBye = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var ResetCommand = function () {};
    ns.Interface(ResetCommand, [GroupCommand]);
    ResetCommand.prototype.getAllMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var QueryCommand = function () {};
    ns.Interface(QueryCommand, [GroupCommand]);
    QueryCommand.prototype.getText = function () {
        console.assert(false, "implement me!");
        return null;
    };
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.registers("InviteCommand");
    ns.protocol.group.registers("ExpelCommand");
    ns.protocol.group.registers("JoinCommand");
    ns.protocol.group.registers("QuitCommand");
    ns.protocol.group.registers("ResetCommand");
    ns.protocol.group.registers("QueryCommand");
})(DIMP);
(function (ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;
    var SecretContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FORWARD);
            this.__forward = null;
        } else {
            if (ns.Interface.conforms(arguments[0], ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                this.setMessage(arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
                this.__forward = null;
            }
        }
    };
    ns.Class(SecretContent, BaseContent, [ForwardContent]);
    SecretContent.prototype.getMessage = function () {
        if (!this.__forward) {
            this.__forward = ForwardContent.getMessage(this);
        }
        return this.__forward;
    };
    SecretContent.prototype.setMessage = function (secret) {
        ForwardContent.setMessage(secret, this);
        this.__forward = secret;
    };
    ns.dkd.SecretContent = SecretContent;
    ns.dkd.registers("SecretContent");
})(DaoKeDao);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FILE);
            this.__data = null;
        } else {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0]);
                this.__data = null;
            } else {
                if (arguments.length === 2) {
                    BaseContent.call(this, ContentType.FILE);
                    this.setFilename(arguments[0]);
                    this.setData(arguments[1]);
                } else {
                    if (arguments.length === 3) {
                        BaseContent.call(this, arguments[0]);
                        this.setFilename(arguments[1]);
                        this.setData(arguments[2]);
                    } else {
                        throw new SyntaxError("file content arguments error: " + arguments);
                    }
                }
            }
        }
        this.__password = null;
    };
    ns.Class(BaseFileContent, BaseContent, [FileContent]);
    BaseFileContent.prototype.setURL = function (url) {
        FileContent.setURL(url, this);
    };
    BaseFileContent.prototype.getURL = function () {
        return FileContent.getURL(this);
    };
    BaseFileContent.prototype.setFilename = function (filename) {
        FileContent.setFilename(filename, this);
    };
    BaseFileContent.prototype.getFilename = function () {
        return FileContent.getFilename(this);
    };
    BaseFileContent.prototype.setData = function (data) {
        FileContent.setData(data, this);
        this.__data = data;
    };
    BaseFileContent.prototype.getData = function () {
        if (!this.__data) {
            this.__data = FileContent.getData(this);
        }
        return this.__data;
    };
    BaseFileContent.prototype.setPassword = function (key) {
        FileContent.setPassword(key, this);
        this.__password = key;
    };
    BaseFileContent.prototype.getPassword = function () {
        if (!this.__password) {
            this.__password = FileContent.getPassword(this);
        }
        return this.__password;
    };
    ns.dkd.BaseFileContent = BaseFileContent;
    ns.dkd.registers("BaseFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.IMAGE);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.IMAGE,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("image content arguments error: " + arguments);
                }
            }
        }
        this.__thumbnail = null;
    };
    ns.Class(ImageFileContent, BaseFileContent, [ImageContent]);
    ImageFileContent.prototype.getThumbnail = function () {
        if (!this.__thumbnail) {
            this.__thumbnail = ImageContent.getThumbnail(this);
        }
        return this.__thumbnail;
    };
    ImageFileContent.prototype.setThumbnail = function (image) {
        ImageContent.setThumbnail(image, this);
        this.__thumbnail = image;
    };
    var VideoFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.VIDEO);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.VIDEO,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("video content arguments error: " + arguments);
                }
            }
        }
        this.__snapshot = null;
    };
    ns.Class(VideoFileContent, BaseFileContent, [VideoContent]);
    VideoFileContent.prototype.getSnapshot = function () {
        if (!this.__snapshot) {
            this.__snapshot = VideoContent.getSnapshot(this);
        }
        return this.__snapshot;
    };
    VideoFileContent.prototype.setSnapshot = function (image) {
        VideoContent.setSnapshot(image, this);
        this.__snapshot = image;
    };
    var AudioFileContent = function () {
        if (arguments.length === 0) {
            BaseFileContent.call(this, ContentType.AUDIO);
        } else {
            if (arguments.length === 1) {
                BaseFileContent.call(this, arguments[0]);
            } else {
                if (arguments.length === 2) {
                    BaseFileContent.call(
                        this,
                        ContentType.AUDIO,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    throw new SyntaxError("audio content arguments error: " + arguments);
                }
            }
        }
    };
    ns.Class(AudioFileContent, BaseFileContent, [AudioContent]);
    AudioFileContent.prototype.getText = function () {
        return this.getValue("text");
    };
    AudioFileContent.prototype.setText = function (asr) {
        this.setValue("text", asr);
    };
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;
    ns.dkd.registers("ImageFileContent");
    ns.dkd.registers("VideoFileContent");
    ns.dkd.registers("AudioFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function () {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.TEXT);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.TEXT);
                this.setText(arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseTextContent, BaseContent, [TextContent]);
    BaseTextContent.prototype.getText = function () {
        return this.getValue("text");
    };
    BaseTextContent.prototype.setText = function (text) {
        this.setValue("text", text);
    };
    ns.dkd.BaseTextContent = BaseTextContent;
    ns.dkd.registers("BaseTextContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var PageContent = ns.protocol.PageContent;
    var BaseContent = ns.dkd.BaseContent;
    var WebPageContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
            this.__icon = null;
        } else {
            if (arguments.length === 4) {
                BaseContent.call(this, ContentType.PAGE);
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3]);
            } else {
                throw new SyntaxError("web page content arguments error: " + arguments);
            }
        }
    };
    ns.Class(WebPageContent, BaseContent, [PageContent]);
    WebPageContent.prototype.getURL = function () {
        return PageContent.getURL(this);
    };
    WebPageContent.prototype.setURL = function (url) {
        PageContent.setURL(url, this);
    };
    WebPageContent.prototype.getTitle = function () {
        return PageContent.getTitle(this);
    };
    WebPageContent.prototype.setTitle = function (title) {
        PageContent.setTitle(title, this);
    };
    WebPageContent.prototype.getDesc = function () {
        return PageContent.getDesc(this);
    };
    WebPageContent.prototype.setDesc = function (text) {
        PageContent.setDesc(text, this);
    };
    WebPageContent.prototype.getIcon = function () {
        if (!this.__icon) {
            this.__icon = PageContent.getIcon(this);
        }
        return this.__icon;
    };
    WebPageContent.prototype.setIcon = function (image) {
        PageContent.setIcon(image, this);
        this.__icon = image;
    };
    ns.dkd.WebPageContent = WebPageContent;
    ns.dkd.registers("WebPageContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1]);
            } else {
                if (typeof arguments[0] === "string") {
                    BaseContent.call(ContentType.MONEY);
                    this.setCurrency(arguments[0]);
                } else {
                    BaseContent.call(arguments[0]);
                }
            }
        }
    };
    ns.Class(BaseMoneyContent, BaseContent, [MoneyContent]);
    BaseMoneyContent.prototype.setCurrency = function (currency) {
        MoneyContent.setCurrency(currency, this);
    };
    BaseMoneyContent.prototype.getCurrency = function () {
        return MoneyContent.getCurrency(this);
    };
    BaseMoneyContent.prototype.setAmount = function (amount) {
        MoneyContent.setAmount(amount, this);
    };
    BaseMoneyContent.prototype.getAmount = function () {
        return MoneyContent.getAmount(this);
    };
    var TransferMoneyContent = function () {
        if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], 0);
            } else {
                MoneyContent.call(arguments[0]);
            }
        }
    };
    ns.Class(TransferMoneyContent, BaseMoneyContent, [TransferContent]);
    TransferMoneyContent.prototype.getText = function () {
        return this.getValue("text");
    };
    TransferMoneyContent.prototype.setText = function (text) {
        this.setValue("text", text);
    };
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent;
    ns.dkd.registers("BaseMoneyContent");
    ns.dkd.registers("TransferMoneyContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue("command", arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setValue("command", arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseCommand, BaseContent, [Command]);
    BaseCommand.prototype.getCommand = function () {
        return Command.getCommand(this);
    };
    ns.dkd.BaseCommand = BaseCommand;
    ns.dkd.registers("BaseCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseMetaCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseCommand.call(this, Command.META);
                this.setIdentifier(arguments[0]);
            } else {
                BaseCommand.call(this, arguments[0]);
                this.__identifier = null;
            }
            this.__meta = null;
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[0], ID)) {
                    BaseCommand.call(this, Command.META);
                    this.setIdentifier(arguments[0]);
                    this.setMeta(arguments[1]);
                } else {
                    BaseCommand.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.__meta = null;
                }
            } else {
                if (arguments.length === 3) {
                    BaseCommand.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.setMeta(arguments[2]);
                } else {
                    throw new SyntaxError("meta command arguments error: " + arguments);
                }
            }
        }
    };
    ns.Class(BaseMetaCommand, BaseCommand, [MetaCommand]);
    BaseMetaCommand.prototype.setIdentifier = function (identifier) {
        MetaCommand.setIdentifier(identifier, this);
        this.__identifier = identifier;
    };
    BaseMetaCommand.prototype.getIdentifier = function () {
        if (!this.__identifier) {
            this.__identifier = MetaCommand.getIdentifier(this);
        }
        return this.__identifier;
    };
    BaseMetaCommand.prototype.setMeta = function (meta) {
        MetaCommand.setMeta(meta, this);
        this.__meta = meta;
    };
    BaseMetaCommand.prototype.getMeta = function () {
        if (!this.__meta) {
            this.__meta = MetaCommand.getMeta(this);
        }
        return this.__meta;
    };
    MetaCommand.query = function (identifier) {
        return new BaseMetaCommand(identifier);
    };
    MetaCommand.response = function (identifier, meta) {
        return new BaseMetaCommand(identifier, meta);
    };
    ns.dkd.BaseMetaCommand = BaseMetaCommand;
    ns.dkd.registers("BaseMetaCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.BaseMetaCommand;
    var BaseDocumentCommand = function () {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0]);
            } else {
                BaseMetaCommand.call(this, arguments[0]);
            }
            this.__document = null;
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[1], Meta)) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                } else {
                    if (typeof arguments[1] === "string") {
                        BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                        this.setSignature(arguments[1]);
                    } else {
                        throw new SyntaxError(
                            "document command arguments error: " + arguments
                        );
                    }
                }
                this.__document = null;
            } else {
                if (arguments.length === 3) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                    this.setDocument(arguments[2]);
                } else {
                    throw new SyntaxError(
                        "document command arguments error: " + arguments
                    );
                }
            }
        }
    };
    ns.Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand]);
    BaseDocumentCommand.prototype.setDocument = function (doc) {
        DocumentCommand.setDocument(doc, this);
        this.__document = doc;
    };
    BaseDocumentCommand.prototype.getDocument = function () {
        if (!this.__document) {
            this.__document = DocumentCommand.getDocument(this);
        }
        return this.__document;
    };
    BaseDocumentCommand.prototype.setSignature = function (base64) {
        DocumentCommand.setSignature(base64, this);
    };
    BaseDocumentCommand.prototype.getSignature = function () {
        return DocumentCommand.getSignature(this);
    };
    BaseDocumentCommand.query = function (identifier, signature) {
        return new BaseDocumentCommand(identifier, signature);
    };
    BaseDocumentCommand.response = function (identifier, meta, doc) {
        return new BaseDocumentCommand(identifier, meta, doc);
    };
    ns.dkd.BaseDocumentCommand = BaseDocumentCommand;
    ns.dkd.registers("BaseDocumentCommand");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var BaseCommand = ns.dkd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (arguments.length === 2) {
            BaseCommand.call(this, arguments[0], arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseCommand.call(this, ContentType.HISTORY, arguments[0]);
            } else {
                BaseCommand.call(this, arguments[0]);
            }
        }
    };
    ns.Class(BaseHistoryCommand, BaseCommand, [HistoryCommand]);
    BaseHistoryCommand.prototype.getHistoryEvent = function () {
        return HistoryCommand.getHistoryEvent(this);
    };
    ns.dkd.BaseHistoryCommand = BaseHistoryCommand;
    ns.dkd.registers("BaseHistoryCommand");
})(DIMP);
(function (ns) {
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseHistoryCommand = ns.dkd.BaseHistoryCommand;
    var BaseGroupCommand = function () {
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0]);
            this.__member = null;
            this.__members = null;
        } else {
            if (arguments.length === 2) {
                BaseHistoryCommand.call(this, arguments[0]);
                this.setGroup(arguments[1]);
                this.__member = null;
                this.__members = null;
            } else {
                if (arguments[2] instanceof Array) {
                    BaseHistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.__member = null;
                    this.setMembers(arguments[2]);
                } else {
                    BaseHistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.setMember(arguments[2]);
                    this.__members = null;
                }
            }
        }
    };
    ns.Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand]);
    BaseGroupCommand.prototype.setMember = function (identifier) {
        GroupCommand.setMembers(null, this);
        GroupCommand.setMember(identifier, this);
        this.__member = identifier;
    };
    BaseGroupCommand.prototype.getMember = function () {
        if (!this.__member) {
            this.__member = GroupCommand.getMember(this);
        }
        return this.__member;
    };
    BaseGroupCommand.prototype.setMembers = function (members) {
        GroupCommand.setMember(null, this);
        GroupCommand.setMembers(members, this);
        this.__members = members;
    };
    BaseGroupCommand.prototype.getMembers = function () {
        if (!this.__members) {
            this.__members = GroupCommand.getMembers(this);
        }
        return this.__members;
    };
    ns.dkd.BaseGroupCommand = BaseGroupCommand;
    ns.dkd.registers("BaseGroupCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = ns.protocol.group.InviteCommand;
    var ExpelCommand = ns.protocol.group.ExpelCommand;
    var JoinCommand = ns.protocol.group.JoinCommand;
    var QuitCommand = ns.protocol.group.QuitCommand;
    var ResetCommand = ns.protocol.group.ResetCommand;
    var QueryCommand = ns.protocol.group.QueryCommand;
    var BaseGroupCommand = ns.dkd.BaseGroupCommand;
    var InviteGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.INVITE,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand]);
    InviteGroupCommand.prototype.getInviteMembers = function () {
        return this.getMembers();
    };
    var ExpelGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.EXPEL,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand]);
    ExpelGroupCommand.prototype.getExpelMembers = function () {
        return this.getMembers();
    };
    var JoinGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand]);
    JoinGroupCommand.prototype.getAsk = function () {
        return this.getValue("text");
    };
    var QuitGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand]);
    QuitGroupCommand.prototype.getBye = function () {
        return this.getValue("text");
    };
    var ResetGroupCommand = function () {
        if (arguments.length === 1) {
            BaseGroupCommand.call(this, arguments[0]);
        } else {
            BaseGroupCommand.call(
                this,
                GroupCommand.RESET,
                arguments[0],
                arguments[1]
            );
        }
    };
    ns.Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand]);
    ResetGroupCommand.prototype.getAllMembers = function () {
        return this.getMembers();
    };
    var QueryGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand]);
    QueryGroupCommand.prototype.getText = function () {
        return this.getValue("text");
    };
    GroupCommand.invite = function (group, members) {
        return new InviteGroupCommand(group, members);
    };
    GroupCommand.expel = function (group, members) {
        return new ExpelGroupCommand(group, members);
    };
    GroupCommand.join = function (group) {
        return new JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new QuitGroupCommand(group);
    };
    GroupCommand.reset = function (group, members) {
        return new ResetGroupCommand(group, members);
    };
    GroupCommand.query = function (group) {
        return new QueryGroupCommand(group);
    };
    ns.dkd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.QueryGroupCommand = QueryGroupCommand;
    ns.dkd.registers("InviteGroupCommand");
    ns.dkd.registers("ExpelGroupCommand");
    ns.dkd.registers("JoinGroupCommand");
    ns.dkd.registers("QuitGroupCommand");
    ns.dkd.registers("ResetGroupCommand");
    ns.dkd.registers("QueryGroupCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Entity = function () {};
    ns.Interface(Entity, [ns.type.Object]);
    Entity.prototype.getIdentifier = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getType = function () {
        console.assert(false, "implement me!");
        return 0;
    };
    Entity.prototype.getMeta = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getDocument = function (type) {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.setDataSource = function (barrack) {
        console.assert(false, "implement me!");
    };
    Entity.prototype.getDataSource = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var EntityDataSource = function () {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        console.assert(false, "implement me!");
        return null;
    };
    var EntityDelegate = function () {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
    ns.mkm.registers("Entity");
})(DIMP);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__datasource = null;
    };
    ns.Class(BaseEntity, BaseObject, [Entity]);
    BaseEntity.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else {
            if (ns.Interface.conforms(other, Entity)) {
                other = other.getIdentifier();
            }
        }
        return this.__identifier.equals(other);
    };
    BaseEntity.prototype.valueOf = function () {
        return desc.call(this);
    };
    BaseEntity.prototype.toString = function () {
        return desc.call(this);
    };
    var desc = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return (
            "<" +
            clazz.name +
            "|" +
            this.__identifier.getType() +
            " " +
            this.__identifier +
            ">"
        );
    };
    BaseEntity.prototype.setDataSource = function (delegate) {
        this.__datasource = delegate;
    };
    BaseEntity.prototype.getDataSource = function () {
        return this.__datasource;
    };
    BaseEntity.prototype.getIdentifier = function () {
        return this.__identifier;
    };
    BaseEntity.prototype.getType = function () {
        return this.__identifier.getType();
    };
    BaseEntity.prototype.getMeta = function () {
        return this.__datasource.getMeta(this.__identifier);
    };
    BaseEntity.prototype.getDocument = function (type) {
        return this.__datasource.getDocument(this.__identifier, type);
    };
    ns.mkm.BaseEntity = BaseEntity;
    ns.mkm.registers("BaseEntity");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var User = function () {};
    ns.Interface(User, [Entity]);
    User.prototype.getVisa = function () {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.getContacts = function () {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.verify = function (data, signature) {
        console.assert(false, "implement me!");
        return false;
    };
    User.prototype.encrypt = function (plaintext) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.sign = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.decrypt = function (ciphertext) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.signVisa = function (visa) {
        console.assert(false, "implement me!");
        return null;
    };
    User.prototype.verifyVisa = function (visa) {
        console.assert(false, "implement me!");
        return null;
    };
    var UserDataSource = function () {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
        return null;
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (
        identifier
    ) {
        return null;
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        console.assert(false, "implement me!");
        return null;
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User;
    ns.mkm.registers("User");
})(DIMP);
(function (ns) {
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier);
    };
    ns.Class(BaseUser, BaseEntity, [User]);
    BaseUser.prototype.getVisa = function () {
        var doc = this.getDocument(Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            return doc;
        } else {
            return null;
        }
    };
    BaseUser.prototype.getContacts = function () {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        return barrack.getContacts(uid);
    };
    BaseUser.prototype.verify = function (data, signature) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var keys = barrack.getPublicKeysForVerification(uid);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get verify keys for user: " + uid);
        }
        for (var i = 0; i < keys.length; ++i) {
            if (keys[i].verify(data, signature)) {
                return true;
            }
        }
        return false;
    };
    BaseUser.prototype.encrypt = function (plaintext) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var key = barrack.getPublicKeyForEncryption(uid);
        if (!key) {
            throw new Error("failed to get encrypt key for user: " + uid);
        }
        return key.encrypt(plaintext);
    };
    BaseUser.prototype.sign = function (data) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var key = barrack.getPrivateKeyForSignature(uid);
        if (!key) {
            throw new Error("failed to get sign key for user: " + uid);
        }
        return key.sign(data);
    };
    BaseUser.prototype.decrypt = function (ciphertext) {
        var barrack = this.getDataSource();
        var uid = this.getIdentifier();
        var keys = barrack.getPrivateKeysForDecryption(uid);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get decrypt keys for user: " + uid);
        }
        var plaintext;
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    return plaintext;
                }
            } catch (e) {
                console.log("User::decrypt() error", this, e, keys[i], ciphertext);
            }
        }
        return null;
    };
    BaseUser.prototype.signVisa = function (visa) {
        var uid = this.getIdentifier();
        if (!uid.equals(visa.getIdentifier())) {
            return null;
        }
        var barrack = this.getDataSource();
        var key = barrack.getPrivateKeyForVisaSignature(uid);
        if (!key) {
            throw new Error("failed to get sign key for user: " + uid);
        }
        visa.sign(key);
        return visa;
    };
    BaseUser.prototype.verifyVisa = function (visa) {
        var uid = this.getIdentifier();
        if (!uid.equals(visa.getIdentifier())) {
            return null;
        }
        var meta = this.getMeta();
        var key = meta.getKey();
        if (!key) {
            throw new Error("failed to get meta key for user: " + uid);
        }
        return visa.verify(key);
    };
    ns.mkm.BaseUser = BaseUser;
    ns.mkm.registers("BaseUser");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var Group = function () {};
    ns.Interface(Group, [Entity]);
    Group.prototype.getBulletin = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getFounder = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getOwner = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getMembers = function () {
        console.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getAssistants = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var GroupDataSource = function () {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        console.assert(false, "implement me!");
        return null;
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group;
    ns.mkm.registers("Group");
})(DIMP);
(function (ns) {
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    ns.Class(BaseGroup, BaseEntity, [Group]);
    BaseGroup.prototype.getBulletin = function () {
        var doc = this.getDocument(Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            return doc;
        } else {
            return null;
        }
    };
    BaseGroup.prototype.getFounder = function () {
        if (!this.__founder) {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            this.__founder = barrack.getFounder(gid);
        }
        return this.__founder;
    };
    BaseGroup.prototype.getOwner = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getOwner(gid);
    };
    BaseGroup.prototype.getMembers = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getMembers(gid);
    };
    BaseGroup.prototype.getAssistants = function () {
        var barrack = this.getDataSource();
        var gid = this.getIdentifier();
        return barrack.getAssistants(gid);
    };
    ns.mkm.BaseGroup = BaseGroup;
    ns.mkm.registers("BaseGroup");
})(DIMP);
(function (ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var ID = ns.protocol.ID;
    var NetworkType = ns.protocol.NetworkType;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.mkm.Entity;
    var User = ns.mkm.User;
    var Group = ns.mkm.Group;
    var Barrack = function () {
        Object.call(this);
    };
    ns.Class(Barrack, Object, [
        Entity.Delegate,
        User.DataSource,
        Group.DataSource
    ]);
    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            if (doc.isValid()) {
                return doc.getKey();
            }
        }
        return null;
    };
    var meta_key = function (user) {
        var meta = this.getMeta(user);
        if (meta) {
            return meta.getKey();
        }
        return null;
    };
    Barrack.prototype.getPublicKeyForEncryption = function (identifier) {
        var key = visa_key.call(this, identifier);
        if (key) {
            return key;
        }
        key = meta_key.call(this, identifier);
        if (ns.Interface.conforms(key, EncryptKey)) {
            return key;
        }
        return null;
    };
    Barrack.prototype.getPublicKeysForVerification = function (identifier) {
        var keys = [];
        var key = visa_key.call(this, identifier);
        if (ns.Interface.conforms(key, VerifyKey)) {
            keys.push(key);
        }
        key = meta_key.call(this, identifier);
        if (key) {
            keys.push(key);
        }
        return keys;
    };
    var group_seed = function (gid) {
        var seed = gid.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === "everyone")) {
                seed = null;
            }
        }
        return seed;
    };
    Barrack.prototype.getBroadcastFounder = function (group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".founder@anywhere");
        } else {
            return ID.FOUNDER;
        }
    };
    Barrack.prototype.getBroadcastOwner = function (group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".owner@anywhere");
        } else {
            return ID.ANYONE;
        }
    };
    Barrack.prototype.getBroadcastMembers = function (group) {
        var members = [];
        var seed = group_seed(group);
        if (seed) {
            var owner = ID.parse(seed + ".owner@anywhere");
            var member = ID.parse(seed + ".member@anywhere");
            members.push(owner);
            members.push(member);
        } else {
            members.push(ID.ANYONE);
        }
        return members;
    };
    Barrack.prototype.getFounder = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastFounder(group);
        }
        var gMeta = this.getMeta(group);
        if (!gMeta) {
            return null;
        }
        var members = this.getMembers(group);
        if (members) {
            var item, mMeta;
            for (var i = 0; i < members.length; ++i) {
                item = members[i];
                mMeta = this.getMeta(item);
                if (!mMeta) {
                    continue;
                }
                if (Meta.matches(gMeta, mMeta.getKey())) {
                    return item;
                }
            }
        }
        return null;
    };
    Barrack.prototype.getOwner = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastOwner(group);
        }
        if (NetworkType.POLYLOGUE.equals(group.getType())) {
            return this.getFounder(group);
        }
        return null;
    };
    Barrack.prototype.getMembers = function (group) {
        if (group.isBroadcast()) {
            return this.getBroadcastMembers(group);
        }
        return null;
    };
    Barrack.prototype.getAssistants = function (group) {
        var doc = this.getDocument(group, Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            if (doc.isValid()) {
                return doc.getAssistants();
            }
        }
        return null;
    };
    ns.core.Barrack = Barrack;
    ns.core.registers("Barrack");
})(DIMP);
(function (ns) {
    var Packer = function () {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function (content) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.signMessage = function (sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.deserializeMessage = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.core.Packer = Packer;
    ns.core.registers("Packer");
})(DIMP);
(function (ns) {
    var Processor = function () {};
    ns.Interface(Processor, null);
    Processor.prototype.processPackage = function (data) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processContent = function (content, rMsg) {
        console.assert(false, "implement me!");
        return null;
    };
    ns.core.Processor = Processor;
    ns.core.registers("Processor");
})(DIMP);
(function (ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = function () {
        Object.call(this);
    };
    ns.Class(Transceiver, Object, [
        InstantMessage.Delegate,
        ReliableMessage.Delegate
    ]);
    Transceiver.prototype.getEntityDelegate = function () {
        console.assert(false, "implement me!");
        return null;
    };
    var is_broadcast = function (msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver();
        }
        return receiver.isBroadcast();
    };
    Transceiver.prototype.serializeContent = function (content, pwd, iMsg) {
        var dict = content.toMap();
        var json = ns.format.JSON.encode(dict);
        return ns.format.UTF8.encode(json);
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast(iMsg)) {
            return ns.format.UTF8.decode(data);
        }
        return ns.format.Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast(iMsg)) {
            return null;
        }
        var dict = pwd.toMap();
        var json = ns.format.JSON.encode(dict);
        return ns.format.UTF8.encode(json);
    };
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        return contact.encrypt(data);
    };
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return ns.format.Base64.encode(key);
    };
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return ns.format.Base64.decode(key);
    };
    Transceiver.prototype.decryptKey = function (data, sender, receiver, sMsg) {
        var barrack = this.getEntityDelegate();
        var identifier = sMsg.getReceiver();
        var user = barrack.getUser(identifier);
        return user.decrypt(data);
    };
    Transceiver.prototype.deserializeKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        var json = ns.format.UTF8.decode(data);
        var dict = ns.format.JSON.decode(json);
        return SymmetricKey.parse(dict);
    };
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast(sMsg)) {
            return ns.format.UTF8.encode(data);
        }
        return ns.format.Base64.decode(data);
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = ns.format.UTF8.decode(data);
        var dict = ns.format.JSON.decode(json);
        return Content.parse(dict);
    };
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return ns.format.Base64.encode(signature);
    };
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return ns.format.Base64.decode(signature);
    };
    Transceiver.prototype.verifyDataSignature = function (
        data,
        signature,
        sender,
        rMsg
    ) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(sender);
        return contact.verify(data, signature);
    };
    ns.core.Transceiver = Transceiver;
    ns.core.registers("Transceiver");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var ContentFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(ContentFactory, Object, [Content.Factory]);
    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };
    var CommandFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(CommandFactory, Object, [Command.Factory]);
    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };
    var GeneralCommandFactory = function () {
        Object.call(this);
    };
    ns.Class(GeneralCommandFactory, Object, [Content.Factory, Command.Factory]);
    GeneralCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            if (Content.getGroup(content)) {
                factory = Command.getFactory("group");
            }
            if (!factory) {
                factory = this;
            }
        }
        return factory.parseCommand(content);
    };
    GeneralCommandFactory.prototype.parseCommand = function (cmd) {
        return new Command(cmd);
    };
    var HistoryCommandFactory = function () {
        GeneralCommandFactory.call(this);
    };
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);
    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    };
    var GroupCommandFactory = function () {
        HistoryCommandFactory.call(this);
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);
    GroupCommandFactory.prototype.parseContent = function (content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this;
        }
        return factory.parseCommand(content);
    };
    GroupCommandFactory.prototype.parseCommand = function (cmd) {
        return new GroupCommand(cmd);
    };
    var registerContentFactories = function () {
        Content.setFactory(
            ContentType.FORWARD,
            new ContentFactory(ns.dkd.SecretContent)
        );
        Content.setFactory(
            ContentType.TEXT,
            new ContentFactory(ns.dkd.BaseTextContent)
        );
        Content.setFactory(
            ContentType.FILE,
            new ContentFactory(ns.dkd.BaseFileContent)
        );
        Content.setFactory(
            ContentType.IMAGE,
            new ContentFactory(ns.dkd.ImageFileContent)
        );
        Content.setFactory(
            ContentType.AUDIO,
            new ContentFactory(ns.dkd.AudioFileContent)
        );
        Content.setFactory(
            ContentType.VIDEO,
            new ContentFactory(ns.dkd.VideoFileContent)
        );
        Content.setFactory(
            ContentType.PAGE,
            new ContentFactory(ns.dkd.WebPageContent)
        );
        Content.setFactory(
            ContentType.MONEY,
            new ContentFactory(ns.dkd.BaseMoneyContent)
        );
        Content.setFactory(
            ContentType.TRANSFER,
            new ContentFactory(ns.dkd.TransferMoneyContent)
        );
        Content.setFactory(ContentType.COMMAND, new GeneralCommandFactory());
        Content.setFactory(ContentType.HISTORY, new HistoryCommandFactory());
        Content.setFactory(0, new ContentFactory(ns.dkd.BaseContent));
    };
    var registerCommandFactories = function () {
        Command.setFactory(
            Command.META,
            new CommandFactory(ns.dkd.BaseMetaCommand)
        );
        Command.setFactory(
            Command.DOCUMENT,
            new CommandFactory(ns.dkd.BaseDocumentCommand)
        );
        Command.setFactory("group", new GroupCommandFactory());
        Command.setFactory(
            GroupCommand.INVITE,
            new CommandFactory(ns.dkd.InviteGroupCommand)
        );
        Command.setFactory(
            GroupCommand.EXPEL,
            new CommandFactory(ns.dkd.ExpelGroupCommand)
        );
        Command.setFactory(
            GroupCommand.JOIN,
            new CommandFactory(ns.dkd.JoinGroupCommand)
        );
        Command.setFactory(
            GroupCommand.QUIT,
            new CommandFactory(ns.dkd.QuitGroupCommand)
        );
        Command.setFactory(
            GroupCommand.QUERY,
            new CommandFactory(ns.dkd.QueryGroupCommand)
        );
        Command.setFactory(
            GroupCommand.RESET,
            new CommandFactory(ns.dkd.ResetGroupCommand)
        );
    };
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.registerContentFactories = registerContentFactories;
    ns.core.registerCommandFactories = registerCommandFactories;
    ns.core.registers("ContentFactory");
    ns.core.registers("CommandFactory");
    ns.core.registers("GeneralCommandFactory");
    ns.core.registers("HistoryCommandFactory");
    ns.core.registers("GroupCommandFactory");
    ns.core.registers("registerContentFactories");
    ns.core.registers("registerCommandFactories");
})(DIMP);
