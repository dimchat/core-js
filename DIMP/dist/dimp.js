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
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
    if (typeof ns.type !== "object") {
        ns.type = new ns.Namespace();
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
            }
        }
        return check_class(object.constructor, protocol);
    };
    var check_class = function (child, protocol) {
        var interfaces = child._mk_interfaces;
        if (!interfaces) {
            return false;
        } else {
            if (check_interfaces(interfaces, protocol)) {
                return true;
            }
        }
        var parent = child._mk_parent;
        return parent && check_class(parent, protocol);
    };
    var check_interfaces = function (interfaces, protocol) {
        var child, parents;
        for (var i = 0; i < interfaces.length; ++i) {
            child = interfaces[i];
            if (child === protocol) {
                return true;
            }
            parents = child._mk_parents;
            if (parents && check_interfaces(parents, protocol)) {
                return true;
            }
        }
        return false;
    };
    var get_interfaces = function (interfaces) {
        if (!interfaces) {
            return [];
        } else {
            if (interfaces instanceof Array) {
                return interfaces;
            } else {
                return [interfaces];
            }
        }
    };
    var set_functions = function (child, functions) {
        if (functions) {
            var names = Object.getOwnPropertyNames(functions);
            var key, fn;
            for (var idx = 0; idx < names.length; ++idx) {
                key = names[idx];
                if (key === "constructor") {
                    continue;
                }
                fn = functions[key];
                if (typeof fn === "function") {
                    child.prototype[key] = fn;
                }
            }
        }
        return child;
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        child._mk_parents = get_interfaces(parents);
        return child;
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces, functions) {
        if (!child) {
            child = function () {};
        }
        if (parent) {
            child._mk_parent = parent;
        } else {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child._mk_interfaces = get_interfaces(interfaces);
        set_functions(child, functions);
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
        ns.assert(false, "implement me!");
        return false;
    };
    IObject.prototype.valueOf = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    IObject.isNull = is_null;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this);
    };
    ns.Class(BaseObject, Object, [IObject], {
        equals: function (other) {
            return this === other;
        }
    });
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
    var BaseObject = ns.type.BaseObject;
    var enumify = function (enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                Enum.call(this, value, alias);
            };
        }
        ns.Class(enumeration, Enum, null, null);
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
        BaseObject.call(this);
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
    ns.Class(Enum, BaseObject, null, null);
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
        ns.assert(false, "implement me!");
        return false;
    };
    Stringer.prototype.toString = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Stringer.prototype.getLength = function () {
        ns.assert(false, "implement me!");
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
    ns.Class(ConstantString, BaseObject, [Stringer], null);
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
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.setValue = function (key, value) {
        ns.assert(false, "implement me!");
    };
    Mapper.prototype.removeValue = function (key) {
        ns.assert(false, "implement me!");
    };
    Mapper.prototype.allKeys = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.toMap = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.copyMap = function (deepCopy) {
        ns.assert(false, "implement me!");
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
    ns.Class(Dictionary, BaseObject, [Mapper], null);
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
    var IObject = ns.type.Object;
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
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
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
    var IObject = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
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
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
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
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    DataCoder.prototype.decode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    var ObjectCoder = function () {};
    ns.Interface(ObjectCoder, null);
    ObjectCoder.prototype.encode = function (object) {
        ns.assert(false, "implement me!");
        return null;
    };
    ObjectCoder.prototype.decode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    var StringCoder = function () {};
    ns.Interface(StringCoder, null);
    StringCoder.prototype.encode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    StringCoder.prototype.decode = function (data) {
        ns.assert(false, "implement me!");
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
    ns.Class(HexCoder, Object, [DataCoder], {
        encode: function (data) {
            return hex_encode(data);
        },
        decode: function (string) {
            return hex_decode(string);
        }
    });
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
    var utf8Coder = null;
    ns.format.UTF8 = UTF8;
    ns.format.registers("UTF8");
})(MONKEY);
(function (ns) {
    var ObjectCoder = ns.format.ObjectCoder;
    var JsonCoder = function () {
        Object.call(this);
    };
    ns.Class(JsonCoder, Object, [ObjectCoder], {
        encode: function (object) {
            return JSON.stringify(object);
        },
        decode: function (string) {
            return JSON.parse(string);
        }
    });
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
        ns.assert(false, "implement me!");
        return null;
    };
    CryptographyKey.prototype.getData = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var EncryptKey = function () {};
    ns.Interface(EncryptKey, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext) {
        ns.assert(false, "implement me!");
        return null;
    };
    var DecryptKey = function () {};
    ns.Interface(DecryptKey, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext) {
        ns.assert(false, "implement me!");
        return null;
    };
    DecryptKey.prototype.matches = function (pKey) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    var VerifyKey = function () {};
    ns.Interface(VerifyKey, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
        ns.assert(false, "implement me!");
        return false;
    };
    VerifyKey.prototype.matches = function (sKey) {
        ns.assert(false, "implement me!");
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
    var promise = "Moky loves May Lee forever!";
    CryptographyKey.getPromise = function () {
        if (typeof promise === "string") {
            promise = ns.format.UTF8.encode(promise);
        }
        return promise;
    };
    AsymmetricKey.matches = function (sKey, pKey) {
        var promise = CryptographyKey.getPromise();
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
        var promise = CryptographyKey.getPromise();
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
        ns.assert(false, "implement me!");
        return null;
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var s_symmetric_factories = {};
    SymmetricKey.setFactory = function (algorithm, factory) {
        s_symmetric_factories[algorithm] = factory;
    };
    SymmetricKey.getFactory = function (algorithm) {
        return s_symmetric_factories[algorithm];
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
        ns.assert(false, "implement me!");
        return null;
    };
    PublicKey.Factory = PublicKeyFactory;
    var s_public_factories = {};
    PublicKey.setFactory = function (algorithm, factory) {
        s_public_factories[algorithm] = factory;
    };
    PublicKey.getFactory = function (algorithm) {
        return s_public_factories[algorithm];
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
        ns.assert(false, "implement me!");
        return null;
    };
    var PrivateKeyFactory = function () {};
    ns.Interface(PrivateKeyFactory, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var s_private_factories = {};
    PrivateKey.setFactory = function (algorithm, factory) {
        s_private_factories[algorithm] = factory;
    };
    PrivateKey.getFactory = function (algorithm) {
        return s_private_factories[algorithm];
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
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
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
        ns.assert(false, "implement me!");
        return 0;
    };
    Address.prototype.isBroadcast = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isUser = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isGroup = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    var AddressFactory = function () {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        ns.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.createAddress = function (address) {
        ns.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.parseAddress = function (address) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getAddress = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getTerminal = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    ID.prototype.isBroadcast = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isUser = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isGroup = function () {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        ns.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.parseID = function (identifier) {
        ns.assert(false, "implement me!");
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
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = function () {};
    ns.Interface(Meta, [Mapper]);
    Meta.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Meta.prototype.getKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getSeed = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getFingerprint = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.generateAddress = function (network) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.parseMeta = function (meta) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.verify = function (publicKey) {
        ns.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.sign = function (privateKey) {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.allProperties = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.getProperty = function (name) {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.setProperty = function (name, value) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getIdentifier = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getTime = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getName = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.setName = function (name) {
        ns.assert(false, "implement me!");
    };
    Document.getType = function (doc) {
        return doc["type"];
    };
    Document.getIdentifier = function (doc) {
        return ID.parse(doc["ID"]);
    };
    var DocumentFactory = function () {};
    ns.Interface(DocumentFactory, null);
    DocumentFactory.prototype.createDocument = function (
        identifier,
        data,
        signature
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setKey = function (publicKey) {
        ns.assert(false, "implement me!");
    };
    Visa.prototype.getAvatar = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setAvatar = function (url) {
        ns.assert(false, "implement me!");
    };
    ns.protocol.Visa = Visa;
    ns.protocol.registers("Visa");
})(MingKeMing);
(function (ns) {
    var Document = ns.protocol.Document;
    var Bulletin = function () {};
    ns.Interface(Bulletin, [Document]);
    Bulletin.prototype.getAssistants = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Bulletin.prototype.setAssistants = function (assistants) {
        ns.assert(false, "implement me!");
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
    ns.Class(Identifier, ConstantString, [ID], null);
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
    ns.Class(IDFactory, Object, [ID.Factory], null);
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
    ns.Class(AddressFactory, Object, [Address.Factory], null);
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
    ns.Class(BroadcastAddress, ConstantString, [Address], null);
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
    ns.Class(BaseMeta, Dictionary, [Meta], null);
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
    var JsON = ns.format.JSON;
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
    ns.Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0;
        },
        getType: function () {
            var type = this.getProperty("type");
            if (!type) {
                var dict = this.toMap();
                type = Document.getType(dict);
            }
            return type;
        },
        getIdentifier: function () {
            if (this.__identifier === null) {
                var dict = this.toMap();
                this.__identifier = Document.getIdentifier(dict);
            }
            return this.__identifier;
        },
        getData: function () {
            if (this.__json === null) {
                this.__json = this.getValue("data");
            }
            return this.__json;
        },
        getSignature: function () {
            if (this.__sig === null) {
                var base64 = this.getValue("signature");
                if (base64) {
                    this.__sig = Base64.decode(base64);
                }
            }
            return this.__sig;
        },
        allProperties: function () {
            if (this.__status < 0) {
                return null;
            }
            if (this.__properties === null) {
                var data = this.getData();
                if (data) {
                    var json = UTF8.decode(data);
                    this.__properties = JsON.decode(json);
                } else {
                    this.__properties = {};
                }
            }
            return this.__properties;
        },
        getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null;
            }
            return dict[name];
        },
        setProperty: function (name, value) {
            this.__status = 0;
            var dict = this.allProperties();
            dict[name] = value;
            this.removeValue("data");
            this.removeValue("signature");
            this.__json = null;
            this.__sig = null;
        },
        verify: function (publicKey) {
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
        },
        sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature();
            }
            var now = new Date();
            this.setProperty("time", now.getTime() / 1000);
            this.__status = 1;
            var dict = this.allProperties();
            var json = JsON.encode(dict);
            var data = UTF8.encode(json);
            var sig = privateKey.sign(data);
            var b64 = Base64.encode(sig);
            this.__json = json;
            this.__sig = sig;
            this.setValue("data", json);
            this.setValue("signature", b64);
            return this.__sig;
        },
        getTime: function () {
            var timestamp = this.getProperty("time");
            if (timestamp) {
                return new Date(timestamp * 1000);
            } else {
                return null;
            }
        },
        getName: function () {
            return this.getProperty("name");
        },
        setName: function (name) {
            this.setProperty("name", name);
        }
    });
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
    ns.Class(BaseVisa, BaseDocument, [Visa], {
        getKey: function () {
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
        },
        setKey: function (publicKey) {
            this.setProperty("key", publicKey.toMap());
            this.__key = publicKey;
        },
        getAvatar: function () {
            return this.getProperty("avatar");
        },
        setAvatar: function (url) {
            this.setProperty("avatar", url);
        }
    });
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
    ns.Class(BaseBulletin, BaseDocument, [Bulletin], {
        getAssistants: function () {
            if (!this.__assistants) {
                var assistants = this.getProperty("assistants");
                if (assistants) {
                    this.__assistants = ID.convert(assistants);
                }
            }
            return this.__assistants;
        },
        setAssistants: function (assistants) {
            if (assistants && assistants.length > 0) {
                this.setProperty("assistants", ID.revert(assistants));
            } else {
                this.setProperty("assistants", null);
            }
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin;
    ns.mkm.registers("BaseBulletin");
})(MingKeMing);
if (typeof DaoKeDao !== "object") {
    DaoKeDao = new MingKeMing.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
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
    var Mapper = ns.type.Mapper;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Content = function () {};
    ns.Interface(Content, [Mapper]);
    Content.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Content.getType = function (content) {
        return content["type"];
    };
    Content.prototype.getSerialNumber = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Content.getSerialNumber = function (content) {
        return content["sn"];
    };
    Content.prototype.getTime = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Content.getTime = function (content) {
        var timestamp = content["time"];
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };
    Content.prototype.getGroup = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Content.prototype.setGroup = function (identifier) {
        ns.assert(false, "implement me!");
    };
    Content.getGroup = function (content) {
        return ID.parse(content["group"]);
    };
    Content.setGroup = function (group, content) {
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
        ns.assert(false, "implement me!");
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
        content = ns.type.Wrapper.fetchMap(content);
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
    var Mapper = ns.type.Mapper;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Envelope = function () {};
    ns.Interface(Envelope, [Mapper]);
    Envelope.prototype.getSender = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Envelope.getSender = function (env) {
        return ID.parse(env["sender"]);
    };
    Envelope.prototype.getReceiver = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Envelope.getReceiver = function (env) {
        return ID.parse(env["receiver"]);
    };
    Envelope.prototype.getTime = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Envelope.getTime = function (env) {
        var timestamp = env["time"];
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };
    Envelope.prototype.getGroup = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Envelope.prototype.setGroup = function (identifier) {
        ns.assert(false, "implement me!");
    };
    Envelope.getGroup = function (env) {
        return ID.parse(env["group"]);
    };
    Envelope.setGroup = function (group, env) {
        if (group) {
            env["group"] = group.toString();
        } else {
            delete env["group"];
        }
    };
    Envelope.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Envelope.prototype.setType = function (type) {
        ns.assert(false, "implement me!");
    };
    Envelope.getType = function (env) {
        var type = env["type"];
        if (type) {
            return type;
        } else {
            return 0;
        }
    };
    Envelope.setType = function (type, env) {
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
        ns.assert(false, "implement me!");
        return null;
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        ns.assert(false, "implement me!");
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
        env = ns.type.Wrapper.fetchMap(env);
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
        ns.assert(false, "implement me!");
        return null;
    };
    Message.prototype.setDelegate = function (delegate) {
        ns.assert(false, "implement me!");
    };
    Message.prototype.getEnvelope = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Message.getEnvelope = function (msg) {
        return Envelope.parse(msg);
    };
    Message.prototype.getSender = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getReceiver = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getTime = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getGroup = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Message.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var MessageDelegate = function () {};
    ns.Interface(MessageDelegate, null);
    Message.Delegate = MessageDelegate;
    ns.protocol.Message = Message;
    ns.protocol.registers("Message");
})(DaoKeDao);
(function (ns) {
    var Content = ns.protocol.Content;
    var Message = ns.protocol.Message;
    var InstantMessage = function () {};
    ns.Interface(InstantMessage, [Message]);
    InstantMessage.prototype.getContent = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessage.getContent = function (msg) {
        return Content.parse(msg["content"]);
    };
    InstantMessage.prototype.encrypt = function (password, members) {
        ns.assert(false, "implement me!");
        return null;
    };
    var InstantMessageDelegate = function () {};
    ns.Interface(InstantMessageDelegate, [Message.Delegate]);
    InstantMessageDelegate.prototype.serializeContent = function (
        content,
        pwd,
        iMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encryptContent = function (data, pwd, iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encodeData = function (data, iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.serializeKey = function (pwd, iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encryptKey = function (
        data,
        receiver,
        iMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageDelegate.prototype.encodeKey = function (data, iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessage.Delegate = InstantMessageDelegate;
    var InstantMessageFactory = function () {};
    ns.Interface(InstantMessageFactory, null);
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        ns.assert(false, "implement me!");
        return 0;
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        ns.assert(false, "implement me!");
        return null;
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        ns.assert(false, "implement me!");
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
        msg = ns.type.Wrapper.fetchMap(msg);
        var factory = InstantMessage.getFactory();
        return factory.parseInstantMessage(msg);
    };
    ns.protocol.InstantMessage = InstantMessage;
    ns.protocol.registers("InstantMessage");
})(DaoKeDao);
(function (ns) {
    var Message = ns.protocol.Message;
    var SecureMessage = function () {};
    ns.Interface(SecureMessage, [Message]);
    SecureMessage.prototype.getData = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.getEncryptedKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.getEncryptedKeys = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.decrypt = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.sign = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.split = function (members) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.prototype.trim = function (member) {
        ns.assert(false, "implement me!");
        return null;
    };
    var SecureMessageDelegate = function () {};
    ns.Interface(SecureMessageDelegate, [Message.Delegate]);
    SecureMessageDelegate.prototype.decodeKey = function (key, sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decryptKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.deserializeKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decodeData = function (data, sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.decryptContent = function (data, pwd, sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.deserializeContent = function (
        data,
        pwd,
        sMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.signData = function (data, sender, sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessageDelegate.prototype.encodeSignature = function (signature, sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    SecureMessage.Delegate = SecureMessageDelegate;
    var SecureMessageFactory = function () {};
    ns.Interface(SecureMessageFactory, null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        ns.assert(false, "implement me!");
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
        msg = ns.type.Wrapper.fetchMap(msg);
        var factory = SecureMessage.getFactory();
        return factory.parseSecureMessage(msg);
    };
    ns.protocol.SecureMessage = SecureMessage;
    ns.protocol.registers("SecureMessage");
})(DaoKeDao);
(function (ns) {
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = function () {};
    ns.Interface(ReliableMessage, [SecureMessage]);
    ReliableMessage.prototype.getSignature = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.getMeta = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.setMeta = function (meta) {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.getMeta = function (msg) {
        return Meta.parse(msg["meta"]);
    };
    ReliableMessage.setMeta = function (meta, msg) {
        if (meta) {
            msg["meta"] = meta.toMap();
        } else {
            delete msg["meta"];
        }
    };
    ReliableMessage.prototype.getVisa = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.prototype.setVisa = function (doc) {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessage.getVisa = function (msg) {
        return Document.parse(msg["visa"]);
    };
    ReliableMessage.setVisa = function (doc, msg) {
        if (doc) {
            msg["visa"] = doc.toMap();
        } else {
            delete msg["visa"];
        }
    };
    ReliableMessage.prototype.verify = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var ReliableMessageDelegate = function () {};
    ns.Interface(ReliableMessageDelegate, [SecureMessage.Delegate]);
    ReliableMessageDelegate.prototype.decodeSignature = function (
        signature,
        rMsg
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    ReliableMessageDelegate.prototype.verifyDataSignature = function (
        data,
        signature,
        sender,
        rMsg
    ) {
        ns.assert(false, "implement me!");
        return false;
    };
    ReliableMessage.Delegate = ReliableMessageDelegate;
    var ReliableMessageFactory = function () {};
    ns.Interface(ReliableMessageFactory, null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        ns.assert(false, "implement me!");
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
        msg = ns.type.Wrapper.fetchMap(msg);
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
    ns.Class(BaseContent, Dictionary, [Content], {
        getType: function () {
            return this.__type;
        },
        getSerialNumber: function () {
            return this.__sn;
        },
        getTime: function () {
            return this.__time;
        },
        getGroup: function () {
            var dict = this.toMap();
            return Content.getGroup(dict);
        },
        setGroup: function (identifier) {
            var dict = this.toMap();
            Content.setGroup(identifier, dict);
        }
    });
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
    ns.Class(MessageEnvelope, Dictionary, [Envelope], {
        getSender: function () {
            return this.__sender;
        },
        getReceiver: function () {
            return this.__receiver;
        },
        getTime: function () {
            return this.__time;
        },
        getGroup: function () {
            var dict = this.toMap();
            return Envelope.getGroup(dict);
        },
        setGroup: function (identifier) {
            var dict = this.toMap();
            Envelope.setGroup(identifier, dict);
        },
        getType: function () {
            var dict = this.toMap();
            return Envelope.getType(dict);
        },
        setType: function (type) {
            var dict = this.toMap();
            Envelope.setType(type, dict);
        }
    });
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
    ns.Class(BaseMessage, Dictionary, [Message], null);
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
    ns.Class(PlainMessage, BaseMessage, [InstantMessage], {
        getContent: function () {
            return this.__content;
        },
        getTime: function () {
            var content = this.getContent();
            var time = content.getTime();
            if (!time) {
                var env = this.getEnvelope();
                time = env.getTime();
            }
            return time;
        },
        getGroup: function () {
            var content = this.getContent();
            return content.getGroup();
        },
        getType: function () {
            var content = this.getContent();
            return content.getType();
        },
        encrypt: function (password, members) {
            if (members && members.length > 0) {
                return encrypt_group_message.call(this, password, members);
            } else {
                return encrypt_message.call(this, password);
            }
        }
    });
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
    ns.Class(EncryptedMessage, BaseMessage, [SecureMessage], {
        getData: function () {
            if (!this.__data) {
                var base64 = this.getValue("data");
                var delegate = this.getDelegate();
                this.__data = delegate.decodeData(base64, this);
            }
            return this.__data;
        },
        getEncryptedKey: function () {
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
        },
        getEncryptedKeys: function () {
            if (!this.__keys) {
                this.__keys = this.getValue("keys");
            }
            return this.__keys;
        },
        decrypt: function () {
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
        },
        sign: function () {
            var delegate = this.getDelegate();
            var signature = delegate.signData(this.getData(), this.getSender(), this);
            var base64 = delegate.encodeSignature(signature, this);
            var msg = this.copyMap(false);
            msg["signature"] = base64;
            return ReliableMessage.parse(msg);
        },
        split: function (members) {
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
        },
        trim: function (member) {
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
        }
    });
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
    ns.Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {
        getSignature: function () {
            if (!this.__signature) {
                var base64 = this.getValue("signature");
                var delegate = this.getDelegate();
                this.__signature = delegate.decodeSignature(base64, this);
            }
            return this.__signature;
        },
        setMeta: function (meta) {
            var dict = this.toMap();
            ReliableMessage.setMeta(meta, dict);
            this.__meta = meta;
        },
        getMeta: function () {
            if (!this.__meta) {
                var dict = this.toMap();
                this.__meta = ReliableMessage.getMeta(dict);
            }
            return this.__meta;
        },
        setVisa: function (visa) {
            var dict = this.toMap();
            ReliableMessage.setVisa(visa, dict);
            this.__visa = visa;
        },
        getVisa: function () {
            if (!this.__visa) {
                var dict = this.toMap();
                this.__visa = ReliableMessage.getVisa(dict);
            }
            return this.__visa;
        },
        verify: function () {
            var data = this.getData();
            if (!data) {
                throw new Error("failed to decode content data: " + this);
            }
            var signature = this.getSignature();
            if (!signature) {
                throw new Error("failed to decode message signature: " + this);
            }
            var delegate = this.getDelegate();
            if (
                delegate.verifyDataSignature(data, signature, this.getSender(), this)
            ) {
                var msg = this.copyMap(false);
                delete msg["signature"];
                return SecureMessage.parse(msg);
            } else {
                return null;
            }
        }
    });
    ns.dkd.NetworkMessage = NetworkMessage;
    ns.dkd.registers("NetworkMessage");
})(DaoKeDao);
(function (ns) {
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = ns.dkd.MessageEnvelope;
    var EnvelopeFactory = function () {
        Object.call(this);
    };
    ns.Class(EnvelopeFactory, Object, [Envelope.Factory], null);
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
    ns.Class(InstantMessageFactory, Object, [InstantMessage.Factory], null);
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
    ns.Class(SecureMessageFactory, Object, [SecureMessage.Factory], null);
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
    ns.Class(ReliableMessageFactory, Object, [ReliableMessage.Factory], null);
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
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
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
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Content = ns.protocol.Content;
    var ForwardContent = function () {};
    ns.Interface(ForwardContent, [Content]);
    ForwardContent.prototype.setMessage = function (secret) {
        ns.assert(false, "implement me!");
    };
    ForwardContent.prototype.getMessage = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ForwardContent.getMessage = function (content) {
        var secret = content["forward"];
        return ReliableMessage.parse(secret);
    };
    ForwardContent.setMessage = function (secret, content) {
        if (secret) {
            content["forward"] = secret.toMap();
        } else {
            delete content["forward"];
        }
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.registers("ForwardContent");
})(DaoKeDao);
(function (ns) {
    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var FileContent = function () {};
    ns.Interface(FileContent, [Content]);
    FileContent.prototype.setURL = function (url) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getURL = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setURL = function (url, content) {
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    FileContent.getURL = function (content) {
        return content["URL"];
    };
    FileContent.prototype.setFilename = function (filename) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getFilename = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setFilename = function (filename, content) {
        if (filename) {
            content["filename"] = filename;
        } else {
            delete content["filename"];
        }
    };
    FileContent.getFilename = function (content) {
        return content["filename"];
    };
    FileContent.prototype.setData = function (data) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getData = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setData = function (data, content) {
        if (data) {
            content["data"] = Base64.encode(data);
        } else {
            delete content["data"];
        }
    };
    FileContent.getData = function (content) {
        var base64 = content["data"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    FileContent.prototype.setPassword = function (key) {
        ns.assert(false, "implement me!");
    };
    FileContent.prototype.getPassword = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    FileContent.setPassword = function (key, content) {
        if (key) {
            content["password"] = key.toMap();
        } else {
            delete content["password"];
        }
    };
    FileContent.getPassword = function (content) {
        var key = content["password"];
        return SymmetricKey.parse(key);
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.registers("FileContent");
})(DIMP);
(function (ns) {
    var Base64 = ns.format.Base64;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function () {};
    ns.Interface(ImageContent, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        ns.assert(false, "implement me!");
    };
    ImageContent.prototype.getThumbnail = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ImageContent.setThumbnail = function (image, content) {
        if (image) {
            content["thumbnail"] = Base64.encode(image);
        } else {
            delete content["thumbnail"];
        }
    };
    ImageContent.getThumbnail = function (content) {
        var base64 = content["thumbnail"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    var VideoContent = function () {};
    ns.Interface(VideoContent, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        ns.assert(false, "implement me!");
    };
    VideoContent.prototype.getSnapshot = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    VideoContent.setSnapshot = function (image, content) {
        if (image) {
            content["snapshot"] = Base64.encode(image);
        } else {
            delete content["snapshot"];
        }
    };
    VideoContent.getSnapshot = function (content) {
        var base64 = content["snapshot"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    var AudioContent = function () {};
    ns.Interface(AudioContent, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        ns.assert(false, "implement me!");
    };
    AudioContent.prototype.getText = function () {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
    };
    TextContent.prototype.getText = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.registers("TextContent");
})(DIMP);
(function (ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.protocol.Content;
    var PageContent = function () {};
    ns.Interface(PageContent, [Content]);
    PageContent.prototype.setURL = function (url) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getURL = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getURL = function (content) {
        return content["URL"];
    };
    PageContent.setURL = function (url, content) {
        if (url) {
            content["URL"] = url;
        } else {
            delete content["URL"];
        }
    };
    PageContent.prototype.setTitle = function (title) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getTitle = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getTitle = function (content) {
        return content["title"];
    };
    PageContent.setTitle = function (title, content) {
        if (title) {
            content["title"] = title;
        } else {
            delete content["title"];
        }
    };
    PageContent.prototype.setDesc = function (text) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getDesc = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.getDesc = function (content) {
        return content["desc"];
    };
    PageContent.setDesc = function (text, content) {
        if (text) {
            content["desc"] = text;
        } else {
            delete content["desc"];
        }
    };
    PageContent.prototype.setIcon = function (image) {
        ns.assert(false, "implement me!");
    };
    PageContent.prototype.getIcon = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PageContent.setIcon = function (image, content) {
        if (image) {
            content["icon"] = Base64.encode(image);
        } else {
            delete content["icon"];
        }
    };
    PageContent.getIcon = function (content) {
        var base64 = content["icon"];
        if (base64) {
            return Base64.decode(base64);
        } else {
            return null;
        }
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.registers("PageContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var MoneyContent = function () {};
    ns.Interface(MoneyContent, [Content]);
    MoneyContent.prototype.setCurrency = function (currency) {
        ns.assert(false, "implement me!");
    };
    MoneyContent.prototype.getCurrency = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setCurrency = function (currency, content) {
        content["currency"] = currency;
    };
    MoneyContent.getCurrency = function (content) {
        return content["currency"];
    };
    MoneyContent.prototype.setAmount = function (amount) {
        ns.assert(false, "implement me!");
    };
    MoneyContent.prototype.getAmount = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MoneyContent.setAmount = function (amount, content) {
        content["amount"] = amount;
    };
    MoneyContent.getAmount = function (content) {
        return content["amount"];
    };
    var TransferContent = function () {};
    ns.Interface(TransferContent, [MoneyContent]);
    TransferContent.prototype.setComment = function (text) {
        ns.assert(false, "implement me!");
    };
    TransferContent.prototype.getComment = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.registers("MoneyContent");
    ns.protocol.registers("TransferContent");
})(DIMP);
(function (ns) {
    var Content = ns.protocol.Content;
    var Command = function () {};
    ns.Interface(Command, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    Command.prototype.getCommand = function () {
        ns.assert(false, "implement me!");
        return "";
    };
    Command.getCommand = function (cmd) {
        return cmd["command"];
    };
    var CommandFactory = function () {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        ns.assert(false, "implement me!");
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
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function () {};
    ns.Interface(MetaCommand, [Command]);
    MetaCommand.prototype.setIdentifier = function (identifier) {
        ns.assert(false, "implement me!");
    };
    MetaCommand.prototype.getIdentifier = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setIdentifier = function (identifier, cmd) {
        if (identifier) {
            cmd["ID"] = identifier.toString();
        } else {
            delete cmd["ID"];
        }
    };
    MetaCommand.getIdentifier = function (cmd) {
        return ID.parse(cmd["ID"]);
    };
    MetaCommand.prototype.setMeta = function (meta) {
        ns.assert(false, "implement me!");
    };
    MetaCommand.prototype.getMeta = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaCommand.setMeta = function (meta, cmd) {
        if (meta) {
            cmd["meta"] = meta.toMap();
        } else {
            delete cmd["meta"];
        }
    };
    MetaCommand.getMeta = function (cmd) {
        return Meta.parse(cmd["meta"]);
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.registers("MetaCommand");
})(DIMP);
(function (ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function () {};
    ns.Interface(DocumentCommand, [MetaCommand]);
    DocumentCommand.prototype.setDocument = function (doc) {
        ns.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getDocument = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setDocument = function (doc, cmd) {
        if (doc) {
            cmd["document"] = doc.toMap();
        } else {
            delete cmd["command"];
        }
    };
    DocumentCommand.getDocument = function (cmd) {
        var doc = cmd["document"];
        return Document.parse(doc);
    };
    DocumentCommand.prototype.setSignature = function (base64) {
        ns.assert(false, "implement me!");
    };
    DocumentCommand.prototype.getSignature = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentCommand.setSignature = function (base64, cmd) {
        cmd["signature"] = base64;
    };
    DocumentCommand.getSignature = function (cmd) {
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
    var Command = ns.protocol.Command;
    var HistoryCommand = function () {};
    ns.Interface(HistoryCommand, [Command]);
    HistoryCommand.prototype.getHistoryEvent = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    HistoryCommand.getHistoryEvent = function (cmd) {
        return cmd["event"];
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.registers("HistoryCommand");
})(DIMP);
(function (ns) {
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
        ns.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMember = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupCommand.prototype.setMembers = function (members) {
        ns.assert(false, "implement me!");
    };
    GroupCommand.prototype.getMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupCommand.setMember = function (member, cmd) {
        if (member) {
            cmd["member"] = member.toString();
        } else {
            delete cmd["member"];
        }
    };
    GroupCommand.getMember = function (cmd) {
        return ID.parse(cmd["member"]);
    };
    GroupCommand.setMembers = function (members, cmd) {
        if (members) {
            cmd["members"] = ID.revert(members);
        } else {
            delete cmd["members"];
        }
    };
    GroupCommand.getMembers = function (cmd) {
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
        ns.assert(false, "implement me!");
        return null;
    };
    var ExpelCommand = function () {};
    ns.Interface(ExpelCommand, [GroupCommand]);
    ExpelCommand.prototype.getExpelMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var JoinCommand = function () {};
    ns.Interface(JoinCommand, [GroupCommand]);
    JoinCommand.prototype.getAsk = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var QuitCommand = function () {};
    ns.Interface(QuitCommand, [GroupCommand]);
    QuitCommand.prototype.getBye = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var ResetCommand = function () {};
    ns.Interface(ResetCommand, [GroupCommand]);
    ResetCommand.prototype.getAllMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var QueryCommand = function () {};
    ns.Interface(QueryCommand, [GroupCommand]);
    QueryCommand.prototype.getText = function () {
        ns.assert(false, "implement me!");
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
    ns.Class(SecretContent, BaseContent, [ForwardContent], {
        getMessage: function () {
            if (!this.__forward) {
                var dict = this.toMap();
                this.__forward = ForwardContent.getMessage(dict);
            }
            return this.__forward;
        },
        setMessage: function (secret) {
            var dict = this.toMap();
            ForwardContent.setMessage(secret, dict);
            this.__forward = secret;
        }
    });
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
    ns.Class(BaseFileContent, BaseContent, [FileContent], {
        setURL: function (url) {
            var dict = this.toMap();
            FileContent.setURL(url, dict);
        },
        getURL: function () {
            var dict = this.toMap();
            return FileContent.getURL(dict);
        },
        setFilename: function (filename) {
            var dict = this.toMap();
            FileContent.setFilename(filename, dict);
        },
        getFilename: function () {
            var dict = this.toMap();
            return FileContent.getFilename(dict);
        },
        setData: function (data) {
            var dict = this.toMap();
            FileContent.setData(data, dict);
            this.__data = data;
        },
        getData: function () {
            if (!this.__data) {
                var dict = this.toMap();
                this.__data = FileContent.getData(dict);
            }
            return this.__data;
        },
        setPassword: function (key) {
            var dict = this.toMap();
            FileContent.setPassword(key, dict);
            this.__password = key;
        },
        getPassword: function () {
            if (!this.__password) {
                var dict = this.toMap();
                this.__password = FileContent.getPassword(dict);
            }
            return this.__password;
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent;
    ns.dkd.registers("BaseFileContent");
})(DIMP);
(function (ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
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
    ns.Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            if (!this.__thumbnail) {
                var dict = this.toMap();
                this.__thumbnail = ImageContent.getThumbnail(dict);
            }
            return this.__thumbnail;
        },
        setThumbnail: function (image) {
            var dict = this.toMap();
            ImageContent.setThumbnail(image, dict);
            this.__thumbnail = image;
        }
    });
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
    ns.Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            if (!this.__snapshot) {
                var dict = this.toMap();
                this.__snapshot = VideoContent.getSnapshot(dict);
            }
            return this.__snapshot;
        },
        setSnapshot: function (image) {
            var dict = this.toMap();
            VideoContent.setSnapshot(image, dict);
            this.__snapshot = image;
        }
    });
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
    ns.Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (asr) {
            this.setValue("text", asr);
        }
    });
    FileContent.file = function (filename, data) {
        return new BaseFileContent(filename, data);
    };
    FileContent.image = function (filename, data) {
        return new ImageFileContent(filename, data);
    };
    FileContent.audio = function (filename, data) {
        return new AudioFileContent(filename, data);
    };
    FileContent.video = function (filename, data) {
        return new VideoFileContent(filename, data);
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
    ns.Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
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
    ns.Class(WebPageContent, BaseContent, [PageContent], {
        getURL: function () {
            var dict = this.toMap();
            return PageContent.getURL(dict);
        },
        setURL: function (url) {
            var dict = this.toMap();
            PageContent.setURL(url, dict);
        },
        getTitle: function () {
            var dict = this.toMap();
            return PageContent.getTitle(dict);
        },
        setTitle: function (title) {
            var dict = this.toMap();
            PageContent.setTitle(title, dict);
        },
        getDesc: function () {
            var dict = this.toMap();
            return PageContent.getDesc(dict);
        },
        setDesc: function (text) {
            var dict = this.toMap();
            PageContent.setDesc(text, dict);
        },
        getIcon: function () {
            if (!this.__icon) {
                var dict = this.toMap();
                this.__icon = PageContent.getIcon(dict);
            }
            return this.__icon;
        },
        setIcon: function (image) {
            var dict = this.toMap();
            PageContent.setIcon(image, dict);
            this.__icon = image;
        }
    });
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
    ns.Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            var dict = this.toMap();
            MoneyContent.setCurrency(currency, dict);
        },
        getCurrency: function () {
            var dict = this.toMap();
            return MoneyContent.getCurrency(dict);
        },
        setAmount: function (amount) {
            var dict = this.toMap();
            MoneyContent.setAmount(amount, dict);
        },
        getAmount: function () {
            var dict = this.toMap();
            return MoneyContent.getAmount(dict);
        }
    });
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
    ns.Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getText: function () {
            return this.getValue("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
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
    ns.Class(BaseCommand, BaseContent, [Command], {
        getCommand: function () {
            var dict = this.toMap();
            return Command.getCommand(dict);
        }
    });
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
    ns.Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        setIdentifier: function (identifier) {
            var dict = this.toMap();
            MetaCommand.setIdentifier(identifier, dict);
            this.__identifier = identifier;
        },
        getIdentifier: function () {
            if (!this.__identifier) {
                var dict = this.toMap();
                this.__identifier = MetaCommand.getIdentifier(dict);
            }
            return this.__identifier;
        },
        setMeta: function (meta) {
            var dict = this.toMap();
            MetaCommand.setMeta(meta, dict);
            this.__meta = meta;
        },
        getMeta: function () {
            if (!this.__meta) {
                var dict = this.toMap();
                this.__meta = MetaCommand.getMeta(dict);
            }
            return this.__meta;
        }
    });
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
    ns.Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        setDocument: function (doc) {
            var dict = this.toMap();
            DocumentCommand.setDocument(doc, dict);
            this.__document = doc;
        },
        getDocument: function () {
            if (!this.__document) {
                var dict = this.toMap();
                this.__document = DocumentCommand.getDocument(dict);
            }
            return this.__document;
        },
        setSignature: function (base64) {
            var dict = this.toMap();
            DocumentCommand.setSignature(base64, dict);
        },
        getSignature: function () {
            var dict = this.toMap();
            return DocumentCommand.getSignature(dict);
        }
    });
    DocumentCommand.query = function (identifier, signature) {
        return new BaseDocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
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
    ns.Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], {
        getHistoryEvent: function () {
            var dict = this.toMap();
            return HistoryCommand.getHistoryEvent(dict);
        }
    });
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
    ns.Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            var dict = this.toMap();
            GroupCommand.setMembers(null, dict);
            GroupCommand.setMember(identifier, dict);
            this.__member = identifier;
        },
        getMember: function () {
            if (!this.__member) {
                var dict = this.toMap();
                this.__member = GroupCommand.getMember(dict);
            }
            return this.__member;
        },
        setMembers: function (members) {
            var dict = this.toMap();
            GroupCommand.setMember(null, dict);
            GroupCommand.setMembers(members, dict);
            this.__members = members;
        },
        getMembers: function () {
            if (!this.__members) {
                var dict = this.toMap();
                this.__members = GroupCommand.getMembers(dict);
            }
            return this.__members;
        }
    });
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
    ns.Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], {
        getInviteMembers: function () {
            return this.getMembers();
        }
    });
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
    ns.Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], {
        getExpelMembers: function () {
            return this.getMembers();
        }
    });
    var JoinGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], {
        getAsk: function () {
            return this.getValue("text");
        }
    });
    var QuitGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], {
        getBye: function () {
            return this.getValue("text");
        }
    });
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
    ns.Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], {
        getAllMembers: function () {
            return this.getMembers();
        }
    });
    var QueryGroupCommand = function () {
        if (ns.Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    ns.Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], {
        getText: function () {
            return this.getValue("text");
        }
    });
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
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Entity.prototype.getMeta = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.getDocument = function (type) {
        ns.assert(false, "implement me!");
        return null;
    };
    Entity.prototype.setDataSource = function (barrack) {
        ns.assert(false, "implement me!");
    };
    Entity.prototype.getDataSource = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var EntityDataSource = function () {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        ns.assert(false, "implement me!");
        return null;
    };
    var EntityDelegate = function () {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseEntity, BaseObject, [Entity], null);
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
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.getContacts = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.verify = function (data, signature) {
        ns.assert(false, "implement me!");
        return false;
    };
    User.prototype.encrypt = function (plaintext) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.sign = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.decrypt = function (ciphertext) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.signVisa = function (visa) {
        ns.assert(false, "implement me!");
        return null;
    };
    User.prototype.verifyVisa = function (visa) {
        ns.assert(false, "implement me!");
        return null;
    };
    var UserDataSource = function () {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        ns.assert(false, "implement me!");
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
        ns.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var doc = this.getDocument(Document.VISA);
            if (ns.Interface.conforms(doc, Visa)) {
                return doc;
            } else {
                return null;
            }
        },
        getContacts: function () {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            return barrack.getContacts(uid);
        },
        verify: function (data, signature) {
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
        },
        encrypt: function (plaintext) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPublicKeyForEncryption(uid);
            if (!key) {
                throw new Error("failed to get encrypt key for user: " + uid);
            }
            return key.encrypt(plaintext);
        },
        sign: function (data) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(uid);
            if (!key) {
                throw new Error("failed to get sign key for user: " + uid);
            }
            return key.sign(data);
        },
        decrypt: function (ciphertext) {
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
        },
        signVisa: function (visa) {
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
        },
        verifyVisa: function (visa) {
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
        }
    });
    ns.mkm.BaseUser = BaseUser;
    ns.mkm.registers("BaseUser");
})(DIMP);
(function (ns) {
    var Entity = ns.mkm.Entity;
    var Group = function () {};
    ns.Interface(Group, [Entity]);
    Group.prototype.getBulletin = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getFounder = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getOwner = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getMembers = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Group.prototype.getAssistants = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var GroupDataSource = function () {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        ns.assert(false, "implement me!");
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
    ns.Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var doc = this.getDocument(Document.BULLETIN);
            if (ns.Interface.conforms(doc, Bulletin)) {
                return doc;
            } else {
                return null;
            }
        },
        getFounder: function () {
            if (!this.__founder) {
                var barrack = this.getDataSource();
                var gid = this.getIdentifier();
                this.__founder = barrack.getFounder(gid);
            }
            return this.__founder;
        },
        getOwner: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getOwner(gid);
        },
        getMembers: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getMembers(gid);
        },
        getAssistants: function () {
            var barrack = this.getDataSource();
            var gid = this.getIdentifier();
            return barrack.getAssistants(gid);
        }
    });
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
    ns.Class(
        Barrack,
        Object,
        [Entity.Delegate, User.DataSource, Group.DataSource],
        {
            getPublicKeyForEncryption: function (identifier) {
                var key = visa_key.call(this, identifier);
                if (key) {
                    return key;
                }
                key = meta_key.call(this, identifier);
                if (ns.Interface.conforms(key, EncryptKey)) {
                    return key;
                }
                return null;
            },
            getPublicKeysForVerification: function (identifier) {
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
            },
            getFounder: function (group) {
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
            },
            getOwner: function (group) {
                if (group.isBroadcast()) {
                    return this.getBroadcastOwner(group);
                }
                if (NetworkType.POLYLOGUE.equals(group.getType())) {
                    return this.getFounder(group);
                }
                return null;
            },
            getMembers: function (group) {
                if (group.isBroadcast()) {
                    return this.getBroadcastMembers(group);
                }
                return null;
            },
            getAssistants: function (group) {
                var doc = this.getDocument(group, Document.BULLETIN);
                if (ns.Interface.conforms(doc, Bulletin)) {
                    if (doc.isValid()) {
                        return doc.getAssistants();
                    }
                }
                return null;
            }
        }
    );
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
    ns.core.Barrack = Barrack;
    ns.core.registers("Barrack");
})(DIMP);
(function (ns) {
    var Packer = function () {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function (content) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.signMessage = function (sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.deserializeMessage = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.core.Packer = Packer;
    ns.core.registers("Packer");
})(DIMP);
(function (ns) {
    var Processor = function () {};
    ns.Interface(Processor, null);
    Processor.prototype.processPackage = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    Processor.prototype.processContent = function (content, rMsg) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.core.Processor = Processor;
    ns.core.registers("Processor");
})(DIMP);
(function (ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = function () {
        Object.call(this);
    };
    ns.Class(
        Transceiver,
        Object,
        [InstantMessage.Delegate, ReliableMessage.Delegate],
        null
    );
    Transceiver.prototype.getEntityDelegate = function () {
        ns.assert(false, "implement me!");
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
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };
    Transceiver.prototype.encryptContent = function (data, pwd, iMsg) {
        return pwd.encrypt(data);
    };
    Transceiver.prototype.encodeData = function (data, iMsg) {
        if (is_broadcast(iMsg)) {
            return UTF8.decode(data);
        }
        return Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (is_broadcast(iMsg)) {
            return null;
        }
        var dict = pwd.toMap();
        var json = JsON.encode(dict);
        return UTF8.encode(json);
    };
    Transceiver.prototype.encryptKey = function (data, receiver, iMsg) {
        var barrack = this.getEntityDelegate();
        var contact = barrack.getUser(receiver);
        return contact.encrypt(data);
    };
    Transceiver.prototype.encodeKey = function (key, iMsg) {
        return Base64.encode(key);
    };
    Transceiver.prototype.decodeKey = function (key, sMsg) {
        return Base64.decode(key);
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
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        return SymmetricKey.parse(dict);
    };
    Transceiver.prototype.decodeData = function (data, sMsg) {
        if (is_broadcast(sMsg)) {
            return UTF8.encode(data);
        }
        return Base64.decode(data);
    };
    Transceiver.prototype.decryptContent = function (data, pwd, sMsg) {
        return pwd.decrypt(data);
    };
    Transceiver.prototype.deserializeContent = function (data, pwd, sMsg) {
        var json = UTF8.decode(data);
        var dict = JsON.decode(json);
        return Content.parse(dict);
    };
    Transceiver.prototype.signData = function (data, sender, sMsg) {
        var barrack = this.getEntityDelegate();
        var user = barrack.getUser(sender);
        return user.sign(data);
    };
    Transceiver.prototype.encodeSignature = function (signature, sMsg) {
        return Base64.encode(signature);
    };
    Transceiver.prototype.decodeSignature = function (signature, rMsg) {
        return Base64.decode(signature);
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
    ns.Class(ContentFactory, Object, [Content.Factory], null);
    ContentFactory.prototype.parseContent = function (content) {
        return new this.__class(content);
    };
    var CommandFactory = function (clazz) {
        Object.call(this);
        this.__class = clazz;
    };
    ns.Class(CommandFactory, Object, [Command.Factory], null);
    CommandFactory.prototype.parseCommand = function (content) {
        return new this.__class(content);
    };
    var GeneralCommandFactory = function () {
        Object.call(this);
    };
    ns.Class(
        GeneralCommandFactory,
        Object,
        [Content.Factory, Command.Factory],
        null
    );
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
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null, null);
    HistoryCommandFactory.prototype.parseCommand = function (cmd) {
        return new HistoryCommand(cmd);
    };
    var GroupCommandFactory = function () {
        HistoryCommandFactory.call(this);
    };
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null, null);
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
