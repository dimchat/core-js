/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.2.2)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Feb. 11, 2023
 * @copyright (c) 2023 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== "object") {
    MONKEY = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = {};
    }
    if (typeof ns.format !== "object") {
        ns.format = {};
    }
    if (typeof ns.digest !== "object") {
        ns.digest = {};
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = {};
    }
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
    var check_class = function (constructor, protocol) {
        var interfaces = constructor._mk_interfaces;
        if (interfaces && check_interfaces(interfaces, protocol)) {
            return true;
        }
        var parent = constructor._mk_parent;
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
    var def_methods = function (clazz, methods) {
        var names = Object.keys(methods);
        var key, fn;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            fn = methods[key];
            if (typeof fn === "function") {
                clazz.prototype[key] = fn;
            }
        }
        return clazz;
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        if (parents) {
            child._mk_parents = parents;
        }
        return child;
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces, methods) {
        if (!child) {
            child = function () {
                Object.call(this);
            };
        }
        if (parent) {
            child._mk_parent = parent;
        } else {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        if (interfaces) {
            child._mk_interfaces = interfaces;
        }
        if (methods) {
            def_methods(child, methods);
        }
        return child;
    };
    ns.type.Interface = interfacefy;
    ns.type.Class = classify;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
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
        if (object instanceof Date) {
            return true;
        }
        if (object instanceof RegExp) {
            return true;
        }
        return object instanceof Error;
    };
    var IObject = Interface(null, null);
    IObject.prototype.toString = function () {
        throw new Error("NotImplemented");
    };
    IObject.prototype.valueOf = function () {
        throw new Error("NotImplemented");
    };
    IObject.prototype.equals = function (other) {
        throw new Error("NotImplemented");
    };
    IObject.isNull = is_null;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this);
    };
    Class(BaseObject, Object, [IObject], null);
    BaseObject.prototype.equals = function (other) {
        return this === other;
    };
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject;
})(MONKEY);
(function (ns) {
    var IObject = ns.type.Object;
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
                            if (IObject.isBaseType(obj1)) {
                                return obj1 === obj2;
                            } else {
                                if (IObject.isBaseType(obj2)) {
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
})(MONKEY);
(function (ns) {
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var is_enum = function (obj) {
        return obj instanceof Enum;
    };
    var get_alias = function (enumeration, value) {
        var keys = Object.keys(enumeration);
        var e;
        for (var k in keys) {
            e = enumeration[k];
            if (e instanceof Enum && e.equals(value)) {
                return e.__alias;
            }
        }
        return null;
    };
    var Enum = function (value, alias) {
        BaseObject.call(this);
        if (!alias) {
            alias = get_alias(this, value);
        }
        this.__value = value;
        this.__alias = alias;
    };
    Class(Enum, BaseObject, null, null);
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
    var enumify = function (enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                Enum.call(this, value, alias);
            };
        }
        Class(enumeration, Enum, null, null);
        var keys = Object.keys(elements);
        var alias, value;
        for (var i = 0; i < keys.length; ++i) {
            alias = keys[i];
            value = elements[alias];
            if (value instanceof Enum) {
                value = value.valueOf();
            } else {
                if (typeof value !== "number") {
                    throw new TypeError("Enum value must be a number!");
                }
            }
            enumeration[alias] = new enumeration(value, alias);
        }
        return enumeration;
    };
    enumify.isEnum = is_enum;
    ns.type.Enum = enumify;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Stringer = Interface(null, [IObject]);
    Stringer.prototype.toString = function () {
        throw new Error("NotImplemented");
    };
    Stringer.prototype.getLength = function () {
        throw new Error("NotImplemented");
    };
    Stringer.prototype.isEmpty = function () {
        throw new Error("NotImplemented");
    };
    Stringer.prototype.equalsIgnoreCase = function (other) {
        throw new Error("NotImplemented");
    };
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = "";
        } else {
            if (Interface.conforms(str, Stringer)) {
                str = str.toString();
            }
        }
        this.__string = str;
    };
    Class(ConstantString, BaseObject, [Stringer], null);
    ConstantString.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (Interface.conforms(other, Stringer)) {
                    return this.__string === other.toString();
                } else {
                    return this.__string === other;
                }
            }
        }
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
    ConstantString.prototype.isEmpty = function () {
        return this.__string.length === 0;
    };
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this === other) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (Interface.conforms(other, Stringer)) {
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
    ns.type.Stringer = Stringer;
    ns.type.ConstantString = ConstantString;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var arrays_equals = function (a1, a2) {
        return ns.type.Arrays.equals(a1, a2);
    };
    var copy_map = function (map, deep) {
        if (deep) {
            return ns.type.Copier.deepCopyMap(map);
        } else {
            return ns.type.Copier.copyMap(map);
        }
    };
    var json_encode = function (dict) {
        return ns.format.JSON.encode(dict);
    };
    var Mapper = Interface(null, [IObject]);
    Mapper.prototype.toMap = function () {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.copyMap = function (deepCopy) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.allKeys = function () {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.getValue = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.setValue = function (key, value) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.removeValue = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.getString = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.getBoolean = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.getNumber = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.getTime = function (key) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.setTime = function (key, time) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.setString = function (key, stringer) {
        throw new Error("NotImplemented");
    };
    Mapper.prototype.setMap = function (key, mapper) {
        throw new Error("NotImplemented");
    };
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {};
        } else {
            if (Interface.conforms(dict, Mapper)) {
                dict = dict.toMap();
            }
        }
        this.__dictionary = dict;
    };
    Class(Dictionary, BaseObject, [Mapper], null);
    Dictionary.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else {
            if (!other) {
                return !this.__dictionary;
            } else {
                if (Interface.conforms(other, Mapper)) {
                    return arrays_equals(this.__dictionary, other.toMap());
                } else {
                    return arrays_equals(this.__dictionary, other);
                }
            }
        }
    };
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.toString = function () {
        return json_encode(this.__dictionary);
    };
    Dictionary.prototype.toMap = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.copyMap = function (deepCopy) {
        return copy_map(this.__dictionary, deepCopy);
    };
    Dictionary.prototype.allKeys = function () {
        return Object.keys(this.__dictionary);
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
        var value;
        if (this.__dictionary.hasOwnProperty(key)) {
            value = this.__dictionary[key];
            delete this.__dictionary[key];
        } else {
            value = null;
        }
        return value;
    };
    Dictionary.prototype.getString = function (key) {
        return this.__dictionary[key];
    };
    Dictionary.prototype.getBoolean = function (key) {
        var value = this.__dictionary[key];
        return value === null ? 0 : value.valueOf();
    };
    Dictionary.prototype.getNumber = function (key) {
        var value = this.__dictionary[key];
        return value === null ? 0 : value.valueOf();
    };
    Dictionary.prototype.getTime = function (key) {
        var seconds = this.getNumber(key);
        if (seconds <= 0) {
            return null;
        }
        var millis = seconds * 1000;
        return new Date(millis);
    };
    Dictionary.prototype.setTime = function (key, time) {
        if (time instanceof Date) {
            time = time.getTime() / 1000;
        }
        this.setValue(key, time);
    };
    Dictionary.prototype.setString = function (key, string) {
        if (string) {
            string = string.toString();
        }
        this.setValue(key, string);
    };
    Dictionary.prototype.setMap = function (key, map) {
        if (map) {
            map = map.toMap();
        }
        this.setValue(key, map);
    };
    ns.type.Mapper = Mapper;
    ns.type.Dictionary = Dictionary;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var fetch_string = function (str) {
        if (Interface.conforms(str, Stringer)) {
            return str.toString();
        } else {
            return str;
        }
    };
    var fetch_map = function (dict) {
        if (Interface.conforms(dict, Mapper)) {
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
                if (Enum.isEnum(object)) {
                    return object.valueOf();
                } else {
                    if (Interface.conforms(object, Stringer)) {
                        return object.toString();
                    } else {
                        if (Interface.conforms(object, Mapper)) {
                            return unwrap_map(object.toMap());
                        } else {
                            if (!Arrays.isArray(object)) {
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
            }
        }
    };
    var unwrap_map = function (dict) {
        var result = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            result[key] = unwrap(dict[key]);
        }
        return result;
    };
    var unwrap_list = function (array) {
        var result = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            result[i] = unwrap(array[i]);
        }
        return result;
    };
    ns.type.Wrapper = {
        fetchString: fetch_string,
        fetchMap: fetch_map,
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    };
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
                return object;
            } else {
                if (Enum.isEnum(object)) {
                    return object.valueOf();
                } else {
                    if (Interface.conforms(object, Stringer)) {
                        return object.toString();
                    } else {
                        if (Interface.conforms(object, Mapper)) {
                            return copy_map(object.toMap());
                        } else {
                            if (!Arrays.isArray(object)) {
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
            }
        }
    };
    var copy_map = function (dict) {
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
                if (Enum.isEnum(object)) {
                    return object.valueOf();
                } else {
                    if (Interface.conforms(object, Stringer)) {
                        return object.toString();
                    } else {
                        if (Interface.conforms(object, Mapper)) {
                            return deep_copy_map(object.toMap());
                        } else {
                            if (!Arrays.isArray(object)) {
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
            }
        }
    };
    var deep_copy_map = function (dict) {
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
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var DataDigester = Interface(null, null);
    DataDigester.prototype.digest = function (data) {
        throw new Error("NotImplemented");
    };
    ns.digest.DataDigester = DataDigester;
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
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var DataCoder = Interface(null, null);
    DataCoder.prototype.encode = function (data) {
        throw new Error("NotImplemented");
    };
    DataCoder.prototype.decode = function (string) {
        throw new Error("NotImplemented");
    };
    var ObjectCoder = Interface(null, null);
    ObjectCoder.prototype.encode = function (object) {
        throw new Error("NotImplemented");
    };
    ObjectCoder.prototype.decode = function (string) {
        throw new Error("NotImplemented");
    };
    var StringCoder = Interface(null, null);
    StringCoder.prototype.encode = function (string) {
        throw new Error("NotImplemented");
    };
    StringCoder.prototype.decode = function (data) {
        throw new Error("NotImplemented");
    };
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder;
})(MONKEY);
(function (ns) {
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
    var hexCoder = null;
    ns.format.Hex = Hex;
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
})(MONKEY);
(function (ns) {
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
    var jsonCoder = null;
    ns.format.JSON = JsON;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var CryptographyKey = Interface(null, [Mapper]);
    CryptographyKey.prototype.getAlgorithm = function () {
        throw new Error("NotImplemented");
    };
    CryptographyKey.prototype.getData = function () {
        throw new Error("NotImplemented");
    };
    var EncryptKey = Interface(null, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext) {
        throw new Error("NotImplemented");
    };
    var DecryptKey = Interface(null, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext) {
        throw new Error("NotImplemented");
    };
    DecryptKey.prototype.match = function (pKey) {
        throw new Error("NotImplemented");
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = Interface(null, [CryptographyKey]);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    var SignKey = Interface(null, [AsymmetricKey]);
    SignKey.prototype.sign = function (data) {
        throw new Error("NotImplemented");
    };
    var VerifyKey = Interface(null, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
        throw new Error("NotImplemented");
    };
    VerifyKey.prototype.match = function (sKey) {
        throw new Error("NotImplemented");
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = Interface(null, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    var SymmetricKeyFactory = Interface(null, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        throw new Error("NotImplemented");
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        throw new Error("NotImplemented");
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var general_factory = function () {
        var man = ns.crypto.FactoryManager;
        return man.generalFactory;
    };
    SymmetricKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setSymmetricKeyFactory(algorithm, factory);
    };
    SymmetricKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getSymmetricKeyFactory(algorithm);
    };
    SymmetricKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generateSymmetricKey(algorithm);
    };
    SymmetricKey.parse = function (key) {
        var gf = general_factory();
        return gf.parseSymmetricKey(key);
    };
    ns.crypto.SymmetricKey = SymmetricKey;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = Interface(null, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    var PublicKeyFactory = Interface(null, null);
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        throw new Error("NotImplemented");
    };
    PublicKey.Factory = PublicKeyFactory;
    var general_factory = function () {
        var man = ns.crypto.FactoryManager;
        return man.generalFactory;
    };
    PublicKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPublicKeyFactory(algorithm, factory);
    };
    PublicKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPublicKeyFactory(algorithm);
    };
    PublicKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePublicKey(key);
    };
    ns.crypto.PublicKey = PublicKey;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = Interface(null, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function () {
        throw new Error("NotImplemented");
    };
    var PrivateKeyFactory = Interface(null, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        throw new Error("NotImplemented");
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        throw new Error("NotImplemented");
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var general_factory = function () {
        var man = ns.crypto.FactoryManager;
        return man.generalFactory;
    };
    PrivateKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPrivateKeyFactory(algorithm, factory);
    };
    PrivateKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPrivateKeyFactory(algorithm);
    };
    PrivateKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generatePrivateKey(algorithm);
    };
    PrivateKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePrivateKey(key);
    };
    ns.crypto.PrivateKey = PrivateKey;
})(MONKEY);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;
    var promise = "Moky loves May Lee forever!";
    var get_promise = function () {
        if (typeof promise === "string") {
            promise = ns.format.UTF8.encode(promise);
        }
        return promise;
    };
    var GeneralFactory = function () {
        this.__symmetricKeyFactories = {};
        this.__publicKeyFactories = {};
        this.__privateKeyFactories = {};
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.matchSignKey = function (sKey, pKey) {
        var data = get_promise();
        var signature = sKey.sign(data);
        return pKey.verify(data, signature);
    };
    GeneralFactory.prototype.matchEncryptKey = function (pKey, sKey) {
        var data = get_promise();
        var ciphertext = pKey.encrypt(data);
        var plaintext = sKey.decrypt(ciphertext);
        if (!plaintext || plaintext.length !== data.length) {
            return false;
        }
        for (var i = 0; i < data.length; ++i) {
            if (plaintext[i] !== data[i]) {
                return false;
            }
        }
        return true;
    };
    GeneralFactory.prototype.getAlgorithm = function (key) {
        return key["algorithm"];
    };
    GeneralFactory.prototype.setSymmetricKeyFactory = function (
        algorithm,
        factory
    ) {
        this.__symmetricKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getSymmetricKeyFactory = function (algorithm) {
        return this.__symmetricKeyFactories[algorithm];
    };
    GeneralFactory.prototype.generateSymmetricKey = function (algorithm) {
        var factory = this.getSymmetricKeyFactory(algorithm);
        return factory.generateSymmetricKey();
    };
    GeneralFactory.prototype.parseSymmetricKey = function (key) {
        if (!key) {
            return null;
        } else {
            if (Interface.conforms(key, SymmetricKey)) {
                return key;
            }
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getSymmetricKeyFactory(algorithm);
        if (!factory) {
            factory = this.getSymmetricKeyFactory("*");
        }
        return factory.parseSymmetricKey(info);
    };
    GeneralFactory.prototype.setPrivateKeyFactory = function (
        algorithm,
        factory
    ) {
        this.__privateKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getPrivateKeyFactory = function (algorithm) {
        return this.__privateKeyFactories[algorithm];
    };
    GeneralFactory.prototype.generatePrivateKey = function (algorithm) {
        var factory = this.getPrivateKeyFactory(algorithm);
        return factory.generatePrivateKey();
    };
    GeneralFactory.prototype.parsePrivateKey = function (key) {
        if (!key) {
            return null;
        } else {
            if (Interface.conforms(key, PrivateKey)) {
                return key;
            }
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPrivateKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPrivateKeyFactory("*");
        }
        return factory.parsePrivateKey(info);
    };
    GeneralFactory.prototype.setPublicKeyFactory = function (algorithm, factory) {
        this.__publicKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getPublicKeyFactory = function (algorithm) {
        return this.__publicKeyFactories[algorithm];
    };
    GeneralFactory.prototype.parsePublicKey = function (key) {
        if (!key) {
            return null;
        } else {
            if (Interface.conforms(key, PublicKey)) {
                return key;
            }
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPublicKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPublicKeyFactory("*");
        }
        return factory.parsePublicKey(info);
    };
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.crypto.GeneralFactory = GeneralFactory;
    ns.crypto.FactoryManager = FactoryManager;
})(MONKEY);
if (typeof MingKeMing !== "object") {
    MingKeMing = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== "object") {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== "object") {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = MONKEY.crypto;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = {};
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = {};
    }
})(MingKeMing);
(function (ns) {
    var EntityType = ns.type.Enum(null, {
        USER: 0,
        GROUP: 1,
        STATION: 2,
        ISP: 3,
        BOT: 4,
        ICP: 5,
        SUPERVISOR: 6,
        COMPANY: 7,
        ANY: 128,
        EVERY: 129
    });
    EntityType.isUser = function (network) {
        var user = EntityType.USER.valueOf();
        var group = EntityType.GROUP.valueOf();
        return (network & group) === user;
    };
    EntityType.isGroup = function (network) {
        var group = EntityType.GROUP.valueOf();
        return (network & group) === group;
    };
    EntityType.isBroadcast = function (network) {
        var any = EntityType.ANY.valueOf();
        return (network & any) === any;
    };
    ns.protocol.EntityType = EntityType;
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
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = Interface(null, [Stringer]);
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isBroadcast = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isUser = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isGroup = function () {
        throw new Error("NotImplemented");
    };
    var AddressFactory = Interface(null, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        throw new Error("NotImplemented");
    };
    AddressFactory.prototype.createAddress = function (address) {
        throw new Error("NotImplemented");
    };
    AddressFactory.prototype.parseAddress = function (address) {
        throw new Error("NotImplemented");
    };
    Address.Factory = AddressFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Address.setFactory = function (factory) {
        var gf = general_factory();
        gf.setAddressFactory(factory);
    };
    Address.getFactory = function () {
        var gf = general_factory();
        return gf.getAddressFactory();
    };
    Address.generate = function (meta, network) {
        var gf = general_factory();
        return gf.generateAddress(meta, network);
    };
    Address.create = function (address) {
        var gf = general_factory();
        return gf.createAddress(address);
    };
    Address.parse = function (address) {
        var gf = general_factory();
        return gf.parseAddress(address);
    };
    ns.protocol.Address = Address;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = ns.protocol.Address;
    var ID = Interface(null, [Stringer]);
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.prototype.getName = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getAddress = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getTerminal = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isBroadcast = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isUser = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isGroup = function () {
        throw new Error("NotImplemented");
    };
    ID.convert = function (list) {
        var gf = general_factory();
        return gf.convertIDList(list);
    };
    ID.revert = function (list) {
        var gf = general_factory();
        return gf.revertIDList(list);
    };
    var IDFactory = Interface(null, null);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        throw new Error("NotImplemented");
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        throw new Error("NotImplemented");
    };
    IDFactory.prototype.parseID = function (identifier) {
        throw new Error("NotImplemented");
    };
    ID.Factory = IDFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    ID.setFactory = function (factory) {
        var gf = general_factory();
        gf.setIDFactory(factory);
    };
    ID.getFactory = function () {
        var gf = general_factory();
        return gf.getIDFactory();
    };
    ID.generate = function (meta, network, terminal) {
        var gf = general_factory();
        return gf.generateID(meta, network, terminal);
    };
    ID.create = function (name, address, terminal) {
        var gf = general_factory();
        return gf.createID(name, address, terminal);
    };
    ID.parse = function (identifier) {
        var gf = general_factory();
        return gf.parseID(identifier);
    };
    ns.protocol.ID = ID;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var PublicKey = ns.crypto.PublicKey;
    var Address = ns.protocol.Address;
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = Interface(null, [Mapper]);
    Meta.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getKey = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getSeed = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getFingerprint = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.generateAddress = function (network) {
        throw new Error("NotImplemented");
    };
    Meta.check = function (meta) {
        var gf = general_factory();
        return gf.checkMeta(meta);
    };
    Meta.matchID = function (identifier, meta) {
        var gf = general_factory();
        return gf.matchID(identifier, meta);
    };
    Meta.matchKey = function (key, meta) {
        var gf = general_factory();
        return gf.matchKey(key, meta);
    };
    var MetaFactory = Interface(null, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        throw new Error("NotImplemented");
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        throw new Error("NotImplemented");
    };
    MetaFactory.prototype.parseMeta = function (meta) {
        throw new Error("NotImplemented");
    };
    Meta.Factory = MetaFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Meta.setFactory = function (version, factory) {
        var gf = general_factory();
        gf.setMetaFactory(version, factory);
    };
    Meta.getFactory = function (version) {
        var gf = general_factory();
        return gf.getMetaFactory(version);
    };
    Meta.create = function (version, key, seed, fingerprint) {
        var gf = general_factory();
        return gf.createMeta(version, key, seed, fingerprint);
    };
    Meta.generate = function (version, sKey, seed) {
        var gf = general_factory();
        return gf.generateMeta(version, sKey, seed);
    };
    Meta.parse = function (meta) {
        var gf = general_factory();
        return gf.parseMeta(meta);
    };
    ns.protocol.Meta = Meta;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var TAI = Interface(null, null);
    TAI.prototype.isValid = function () {
        throw new Error("NotImplemented");
    };
    TAI.prototype.verify = function (publicKey) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.sign = function (privateKey) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.allProperties = function () {
        throw new Error("NotImplemented");
    };
    TAI.prototype.getProperty = function (name) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.setProperty = function (name, value) {
        throw new Error("NotImplemented");
    };
    ns.protocol.TAI = TAI;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = Interface(null, [TAI, Mapper]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getTime = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getName = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.setName = function (name) {
        throw new Error("NotImplemented");
    };
    var DocumentFactory = Interface(null, null);
    DocumentFactory.prototype.createDocument = function (
        identifier,
        data,
        signature
    ) {
        throw new Error("NotImplemented");
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
        throw new Error("NotImplemented");
    };
    Document.Factory = DocumentFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Document.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setDocumentFactory(type, factory);
    };
    Document.getFactory = function (type) {
        var gf = general_factory();
        return gf.getDocumentFactory(type);
    };
    Document.create = function (type, identifier, data, signature) {
        var gf = general_factory();
        return gf.createDocument(type, identifier, data, signature);
    };
    Document.parse = function (doc) {
        var gf = general_factory();
        return gf.parseDocument(doc);
    };
    ns.protocol.Document = Document;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Document = ns.protocol.Document;
    var Visa = Interface(null, [Document]);
    Visa.prototype.getKey = function () {
        throw new Error("NotImplemented");
    };
    Visa.prototype.setKey = function (publicKey) {
        throw new Error("NotImplemented");
    };
    Visa.prototype.getAvatar = function () {
        throw new Error("NotImplemented");
    };
    Visa.prototype.setAvatar = function (url) {
        throw new Error("NotImplemented");
    };
    var Bulletin = Interface(null, [Document]);
    Bulletin.prototype.getAssistants = function () {
        throw new Error("NotImplemented");
    };
    Bulletin.prototype.setAssistants = function (assistants) {
        throw new Error("NotImplemented");
    };
    ns.protocol.Visa = Visa;
    ns.protocol.Bulletin = Bulletin;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var EntityType = ns.protocol.EntityType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        if (network instanceof EntityType) {
            network = network.valueOf();
        }
        this.__network = network;
    };
    Class(BroadcastAddress, ConstantString, [Address], null);
    BroadcastAddress.prototype.getType = function () {
        return this.__network;
    };
    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };
    BroadcastAddress.prototype.isUser = function () {
        var any = EntityType.ANY.valueOf();
        return this.__network === any;
    };
    BroadcastAddress.prototype.isGroup = function () {
        var every = EntityType.EVERY.valueOf();
        return this.__network === every;
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", EntityType.ANY);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", EntityType.EVERY);
    ns.mkm.BroadcastAddress = BroadcastAddress;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    Class(Identifier, ConstantString, [ID], null);
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
        return this.getAddress().getType();
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
    ID.ANYONE = new Identifier(
        "anyone@anywhere",
        "anyone",
        Address.ANYWHERE,
        null
    );
    ID.EVERYONE = new Identifier(
        "everyone@everywhere",
        "everyone",
        Address.EVERYWHERE,
        null
    );
    ID.FOUNDER = new Identifier("moky@anywhere", "moky", Address.ANYWHERE, null);
    ns.mkm.Identifier = Identifier;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Stringer = ns.type.Stringer;
    var Wrapper = ns.type.Wrapper;
    var UTF8 = ns.format.UTF8;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};
        this.__documentFactories = {};
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.setAddressFactory = function (factory) {
        this.__addressFactory = factory;
    };
    GeneralFactory.prototype.getAddressFactory = function () {
        return this.__addressFactory;
    };
    GeneralFactory.prototype.parseAddress = function (address) {
        if (!address) {
            return null;
        } else {
            if (Interface.conforms(address, Address)) {
                return address;
            }
        }
        address = Wrapper.fetchString(address);
        var factory = this.getAddressFactory();
        return factory.parseAddress(address);
    };
    GeneralFactory.prototype.createAddress = function (address) {
        var factory = this.getAddressFactory();
        return factory.createAddress(address);
    };
    GeneralFactory.prototype.generateAddress = function (meta, network) {
        var factory = this.getAddressFactory();
        return factory.generateAddress(meta, network);
    };
    GeneralFactory.prototype.setIDFactory = function (factory) {
        this.__idFactory = factory;
    };
    GeneralFactory.prototype.getIDFactory = function () {
        return this.__idFactory;
    };
    GeneralFactory.prototype.parseID = function (identifier) {
        if (!identifier) {
            return null;
        } else {
            if (Interface.conforms(identifier, ID)) {
                return identifier;
            }
        }
        identifier = Wrapper.fetchString(identifier);
        var factory = this.getIDFactory();
        return factory.parseID(identifier);
    };
    GeneralFactory.prototype.createID = function (name, address, terminal) {
        var factory = this.getIDFactory();
        return factory.createID(name, address, terminal);
    };
    GeneralFactory.prototype.generateID = function (meta, network, terminal) {
        var factory = this.getIDFactory();
        return factory.generateID(meta, network, terminal);
    };
    GeneralFactory.prototype.convertIDList = function (list) {
        var array = [];
        var id;
        for (var i = 0; i < list.length; ++i) {
            id = ID.parse(list[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    };
    GeneralFactory.prototype.revertIDList = function (list) {
        var array = [];
        var id;
        for (var i = 0; i < list.length; ++i) {
            id = list[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else {
                if (typeof id === "string") {
                    array.push(id);
                }
            }
        }
        return array;
    };
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    GeneralFactory.prototype.setMetaFactory = function (version, factory) {
        version = EnumToUint(version);
        this.__metaFactories[version] = factory;
    };
    GeneralFactory.prototype.getMetaFactory = function (version) {
        version = EnumToUint(version);
        return this.__metaFactories[version];
    };
    GeneralFactory.prototype.getMetaType = function (meta) {
        return meta["type"];
    };
    GeneralFactory.prototype.createMeta = function (
        version,
        key,
        seed,
        fingerprint
    ) {
        var factory = this.getMetaFactory(version);
        return factory.createMeta(key, seed, fingerprint);
    };
    GeneralFactory.prototype.generateMeta = function (version, sKey, seed) {
        var factory = this.getMetaFactory(version);
        return factory.generateMeta(sKey, seed);
    };
    GeneralFactory.prototype.parseMeta = function (meta) {
        if (!meta) {
            return null;
        } else {
            if (Interface.conforms(meta, Meta)) {
                return meta;
            }
        }
        meta = Wrapper.fetchMap(meta);
        var type = this.getMetaType(meta);
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory(0);
        }
        return factory.parseMeta(meta);
    };
    GeneralFactory.prototype.checkMeta = function (meta) {
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
    GeneralFactory.prototype.matchID = function (identifier, meta) {
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== identifier.getName()) {
                return false;
            }
        }
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen);
    };
    GeneralFactory.prototype.matchKey = function (key, meta) {
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
    GeneralFactory.prototype.setDocumentFactory = function (type, factory) {
        this.__documentFactories[type] = factory;
    };
    GeneralFactory.prototype.getDocumentFactory = function (type) {
        return this.__documentFactories[type];
    };
    GeneralFactory.prototype.getDocumentType = function (doc) {
        return doc["type"];
    };
    GeneralFactory.prototype.createDocument = function (
        type,
        identifier,
        data,
        signature
    ) {
        var factory = this.getDocumentFactory(type);
        return factory.createDocument(identifier, data, signature);
    };
    GeneralFactory.prototype.parseDocument = function (doc) {
        if (!doc) {
            return null;
        } else {
            if (Interface.conforms(doc, Document)) {
                return doc;
            }
        }
        doc = Wrapper.fetchMap(doc);
        var type = this.getDocumentType(doc);
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory("*");
        }
        return factory.parseDocument(doc);
    };
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.mkm.GeneralFactory = GeneralFactory;
    ns.mkm.FactoryManager = FactoryManager;
})(MingKeMing);
if (typeof DaoKeDao !== "object") {
    DaoKeDao = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== "object") {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== "object") {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = MONKEY.crypto;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = MingKeMing.protocol;
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = MingKeMing.mkm;
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = {};
    }
})(DaoKeDao);
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
        APPLICATION: 160,
        ARRAY: 202,
        CUSTOMIZED: 204,
        FORWARD: 255
    });
    ns.protocol.ContentType = ContentType;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Content = Interface(null, [Mapper]);
    Content.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Content.prototype.getSerialNumber = function () {
        throw new Error("NotImplemented");
    };
    Content.prototype.getTime = function () {
        throw new Error("NotImplemented");
    };
    Content.prototype.getGroup = function () {
        throw new Error("NotImplemented");
    };
    Content.prototype.setGroup = function (identifier) {
        throw new Error("NotImplemented");
    };
    var ContentFactory = Interface(null, null);
    ContentFactory.prototype.parseContent = function (content) {
        throw new Error("NotImplemented");
    };
    Content.Factory = ContentFactory;
    var general_factory = function () {
        var man = ns.dkd.FactoryManager;
        return man.generalFactory;
    };
    Content.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setContentFactory(type, factory);
    };
    Content.getFactory = function (type) {
        var gf = general_factory();
        return gf.getContentFactory(type);
    };
    Content.parse = function (content) {
        var gf = general_factory();
        return gf.parseContent(content);
    };
    ns.protocol.Content = Content;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Envelope = Interface(null, [Mapper]);
    Envelope.prototype.getSender = function () {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.getReceiver = function () {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.getTime = function () {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.getGroup = function () {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.setGroup = function (identifier) {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Envelope.prototype.setType = function (type) {
        throw new Error("NotImplemented");
    };
    var EnvelopeFactory = Interface(null, null);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        throw new Error("NotImplemented");
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        throw new Error("NotImplemented");
    };
    Envelope.Factory = EnvelopeFactory;
    var general_factory = function () {
        var man = ns.dkd.FactoryManager;
        return man.generalFactory;
    };
    Envelope.getFactory = function () {
        var gf = general_factory();
        return gf.getEnvelopeFactory();
    };
    Envelope.setFactory = function (factory) {
        var gf = general_factory();
        gf.setEnvelopeFactory(factory);
    };
    Envelope.create = function (from, to, when) {
        var gf = general_factory();
        return gf.createEnvelope(from, to, when);
    };
    Envelope.parse = function (env) {
        var gf = general_factory();
        return gf.parseEnvelope(env);
    };
    ns.protocol.Envelope = Envelope;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Message = Interface(null, [Mapper]);
    Message.prototype.getDelegate = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.setDelegate = function (delegate) {
        throw new Error("NotImplemented");
    };
    Message.prototype.getEnvelope = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.getSender = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.getReceiver = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.getTime = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.getGroup = function () {
        throw new Error("NotImplemented");
    };
    Message.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    var MessageDelegate = Interface(null, null);
    Message.Delegate = MessageDelegate;
    ns.protocol.Message = Message;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Message = ns.protocol.Message;
    var InstantMessage = Interface(null, [Message]);
    InstantMessage.prototype.getContent = function () {
        throw new Error("NotImplemented");
    };
    InstantMessage.prototype.encrypt = function (password, members) {
        throw new Error("NotImplemented");
    };
    var InstantMessageDelegate = Interface(null, [Message.Delegate]);
    InstantMessageDelegate.prototype.serializeContent = function (
        content,
        pwd,
        iMsg
    ) {
        throw new Error("NotImplemented");
    };
    InstantMessageDelegate.prototype.encryptContent = function (data, pwd, iMsg) {
        throw new Error("NotImplemented");
    };
    InstantMessageDelegate.prototype.encodeData = function (data, iMsg) {
        throw new Error("NotImplemented");
    };
    InstantMessageDelegate.prototype.serializeKey = function (pwd, iMsg) {
        throw new Error("NotImplemented");
    };
    InstantMessageDelegate.prototype.encryptKey = function (
        data,
        receiver,
        iMsg
    ) {
        throw new Error("NotImplemented");
    };
    InstantMessageDelegate.prototype.encodeKey = function (data, iMsg) {
        throw new Error("NotImplemented");
    };
    InstantMessage.Delegate = InstantMessageDelegate;
    var InstantMessageFactory = Interface(null, null);
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        throw new Error("NotImplemented");
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        throw new Error("NotImplemented");
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        throw new Error("NotImplemented");
    };
    InstantMessage.Factory = InstantMessageFactory;
    var general_factory = function () {
        var man = ns.dkd.FactoryManager;
        return man.generalFactory;
    };
    InstantMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getInstantMessageFactory();
    };
    InstantMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setInstantMessageFactory(factory);
    };
    InstantMessage.generateSerialNumber = function (type, now) {
        var gf = general_factory();
        return gf.generateSerialNumber(type, now);
    };
    InstantMessage.create = function (head, body) {
        var gf = general_factory();
        return gf.createInstantMessage(head, body);
    };
    InstantMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseInstantMessage(msg);
    };
    ns.protocol.InstantMessage = InstantMessage;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Message = ns.protocol.Message;
    var SecureMessage = Interface(null, [Message]);
    SecureMessage.prototype.getData = function () {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.getEncryptedKey = function () {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.getEncryptedKeys = function () {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.decrypt = function () {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.sign = function () {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.split = function (members) {
        throw new Error("NotImplemented");
    };
    SecureMessage.prototype.trim = function (member) {
        throw new Error("NotImplemented");
    };
    var SecureMessageDelegate = Interface(null, [Message.Delegate]);
    SecureMessageDelegate.prototype.decodeKey = function (key, sMsg) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.decryptKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.deserializeKey = function (
        data,
        sender,
        receiver,
        sMsg
    ) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.decodeData = function (data, sMsg) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.decryptContent = function (data, pwd, sMsg) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.deserializeContent = function (
        data,
        pwd,
        sMsg
    ) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.signData = function (data, sender, sMsg) {
        throw new Error("NotImplemented");
    };
    SecureMessageDelegate.prototype.encodeSignature = function (signature, sMsg) {
        throw new Error("NotImplemented");
    };
    SecureMessage.Delegate = SecureMessageDelegate;
    var SecureMessageFactory = Interface(null, null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        throw new Error("NotImplemented");
    };
    SecureMessage.Factory = SecureMessageFactory;
    var general_factory = function () {
        var man = ns.dkd.FactoryManager;
        return man.generalFactory;
    };
    SecureMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getSecureMessageFactory();
    };
    SecureMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setSecureMessageFactory(factory);
    };
    SecureMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseSecureMessage(msg);
    };
    ns.protocol.SecureMessage = SecureMessage;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = Interface(null, [SecureMessage]);
    ReliableMessage.prototype.getSignature = function () {
        throw new Error("NotImplemented");
    };
    ReliableMessage.prototype.getMeta = function () {
        throw new Error("NotImplemented");
    };
    ReliableMessage.prototype.setMeta = function (meta) {
        throw new Error("NotImplemented");
    };
    ReliableMessage.prototype.getVisa = function () {
        throw new Error("NotImplemented");
    };
    ReliableMessage.prototype.setVisa = function (doc) {
        throw new Error("NotImplemented");
    };
    ReliableMessage.prototype.verify = function () {
        throw new Error("NotImplemented");
    };
    var ReliableMessageDelegate = Interface(null, [SecureMessage.Delegate]);
    ReliableMessageDelegate.prototype.decodeSignature = function (
        signature,
        rMsg
    ) {
        throw new Error("NotImplemented");
    };
    ReliableMessageDelegate.prototype.verifyDataSignature = function (
        data,
        signature,
        sender,
        rMsg
    ) {
        throw new Error("NotImplemented");
    };
    ReliableMessage.Delegate = ReliableMessageDelegate;
    var ReliableMessageFactory = Interface(null, null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        throw new Error("NotImplemented");
    };
    ReliableMessage.Factory = ReliableMessageFactory;
    var general_factory = function () {
        var man = ns.dkd.FactoryManager;
        return man.generalFactory;
    };
    ReliableMessage.getFactory = function () {
        var gf = general_factory();
        return gf.getReliableMessageFactory();
    };
    ReliableMessage.setFactory = function (factory) {
        var gf = general_factory();
        gf.setReliableMessageFactory(factory);
    };
    ReliableMessage.parse = function (msg) {
        var gf = general_factory();
        return gf.parseReliableMessage(msg);
    };
    ns.protocol.ReliableMessage = ReliableMessage;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
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
        this.__reliableMessageFactory = null;
    };
    Class(GeneralFactory, null, null, null);
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    GeneralFactory.prototype.setContentFactory = function (type, factory) {
        type = EnumToUint(type);
        this.__contentFactories[type] = factory;
    };
    GeneralFactory.prototype.getContentFactory = function (type) {
        type = EnumToUint(type);
        return this.__contentFactories[type];
    };
    GeneralFactory.prototype.getContentType = function (content) {
        return content["type"];
    };
    GeneralFactory.prototype.parseContent = function (content) {
        if (!content) {
            return null;
        } else {
            if (Interface.conforms(content, Content)) {
                return content;
            }
        }
        content = Wrapper.fetchMap(content);
        var type = this.getContentType(content);
        var factory = this.getContentFactory(type);
        if (!factory) {
            factory = this.getContentFactory(0);
        }
        return factory.parseContent(content);
    };
    GeneralFactory.prototype.setEnvelopeFactory = function (factory) {
        this.__envelopeFactory = factory;
    };
    GeneralFactory.prototype.getEnvelopeFactory = function () {
        return this.__envelopeFactory;
    };
    GeneralFactory.prototype.createEnvelope = function (from, to, when) {
        var factory = this.getEnvelopeFactory();
        return factory.createEnvelope(from, to, when);
    };
    GeneralFactory.prototype.parseEnvelope = function (env) {
        if (!env) {
            return null;
        } else {
            if (Interface.conforms(env, Envelope)) {
                return env;
            }
        }
        env = Wrapper.fetchMap(env);
        var factory = this.getEnvelopeFactory();
        return factory.parseEnvelope(env);
    };
    GeneralFactory.prototype.setInstantMessageFactory = function (factory) {
        this.__instantMessageFactory = factory;
    };
    GeneralFactory.prototype.getInstantMessageFactory = function () {
        return this.__instantMessageFactory;
    };
    GeneralFactory.prototype.createInstantMessage = function (head, body) {
        var factory = this.getInstantMessageFactory();
        return factory.createInstantMessage(head, body);
    };
    GeneralFactory.prototype.parseInstantMessage = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (Interface.conforms(msg, InstantMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = this.getInstantMessageFactory();
        return factory.parseInstantMessage(msg);
    };
    GeneralFactory.prototype.generateSerialNumber = function (type, now) {
        var factory = this.getInstantMessageFactory();
        return factory.generateSerialNumber(type, now);
    };
    GeneralFactory.prototype.setSecureMessageFactory = function (factory) {
        this.__secureMessageFactory = factory;
    };
    GeneralFactory.prototype.getSecureMessageFactory = function () {
        return this.__secureMessageFactory;
    };
    GeneralFactory.prototype.parseSecureMessage = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (Interface.conforms(msg, SecureMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = this.getSecureMessageFactory();
        return factory.parseSecureMessage(msg);
    };
    GeneralFactory.prototype.setReliableMessageFactory = function (factory) {
        this.__reliableMessageFactory = factory;
    };
    GeneralFactory.prototype.getReliableMessageFactory = function () {
        return this.__reliableMessageFactory;
    };
    GeneralFactory.prototype.parseReliableMessage = function (msg) {
        if (!msg) {
            return null;
        } else {
            if (Interface.conforms(msg, ReliableMessage)) {
                return msg;
            }
        }
        msg = Wrapper.fetchMap(msg);
        var factory = this.getReliableMessageFactory();
        return factory.parseReliableMessage(msg);
    };
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.dkd.GeneralFactory = GeneralFactory;
    ns.dkd.FactoryManager = FactoryManager;
})(DaoKeDao);
if (typeof DIMP !== "object") {
    DIMP = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== "object") {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== "object") {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = MONKEY.crypto;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = MingKeMing.protocol;
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = MingKeMing.mkm;
    }
    if (typeof ns.dkd !== "object") {
        ns.dkd = DaoKeDao.dkd;
    }
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = {};
    }
    if (typeof ns.dkd.cmd !== "object") {
        ns.dkd.cmd = {};
    }
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var TextContent = Interface(null, [Content]);
    TextContent.prototype.setText = function (text) {
        throw new Error("NotImplemented");
    };
    TextContent.prototype.getText = function () {
        throw new Error("NotImplemented");
    };
    TextContent.create = function (text) {
        return new ns.dkd.BaseTextContent(text);
    };
    ns.protocol.TextContent = TextContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var FileContent = Interface(null, [Content]);
    FileContent.prototype.setURL = function (url) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getURL = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getFilename = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setFilename = function (filename) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getData = function () {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setData = function (data) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.setPassword = function (key) {
        throw new Error("NotImplemented");
    };
    FileContent.prototype.getPassword = function () {
        throw new Error("NotImplemented");
    };
    FileContent.file = function (filename, data) {
        return new ns.dkd.BaseFileContent(filename, data);
    };
    FileContent.image = function (filename, data) {
        return new ns.dkd.ImageFileContent(filename, data);
    };
    FileContent.audio = function (filename, data) {
        return new ns.dkd.AudioFileContent(filename, data);
    };
    FileContent.video = function (filename, data) {
        return new ns.dkd.VideoFileContent(filename, data);
    };
    ns.protocol.FileContent = FileContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = Interface(null, [FileContent]);
    ImageContent.prototype.setThumbnail = function (image) {
        throw new Error("NotImplemented");
    };
    ImageContent.prototype.getThumbnail = function () {
        throw new Error("NotImplemented");
    };
    var VideoContent = Interface(null, [FileContent]);
    VideoContent.prototype.setSnapshot = function (image) {
        throw new Error("NotImplemented");
    };
    VideoContent.prototype.getSnapshot = function () {
        throw new Error("NotImplemented");
    };
    var AudioContent = Interface(null, [FileContent]);
    AudioContent.prototype.setText = function (asr) {
        throw new Error("NotImplemented");
    };
    AudioContent.prototype.getText = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.AudioContent = AudioContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var PageContent = Interface(null, [Content]);
    PageContent.prototype.getURL = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setURL = function (url) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setTitle = function (title) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getTitle = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setDesc = function (text) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getDesc = function () {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.setIcon = function (image) {
        throw new Error("NotImplemented");
    };
    PageContent.prototype.getIcon = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.PageContent = PageContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var MoneyContent = Interface(null, [Content]);
    MoneyContent.prototype.getCurrency = function () {
        throw new Error("NotImplemented");
    };
    MoneyContent.prototype.setAmount = function (amount) {
        throw new Error("NotImplemented");
    };
    MoneyContent.prototype.getAmount = function () {
        throw new Error("NotImplemented");
    };
    var TransferContent = Interface(null, [MoneyContent]);
    TransferContent.prototype.setRemitter = function (sender) {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.getRemitter = function () {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.setRemittee = function (receiver) {
        throw new Error("NotImplemented");
    };
    TransferContent.prototype.getRemittee = function () {
        throw new Error("NotImplemented");
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.TransferContent = TransferContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ForwardContent = Interface(null, [Content]);
    ForwardContent.prototype.getForward = function () {
        throw new Error("NotImplemented");
    };
    ForwardContent.prototype.getSecrets = function () {
        throw new Error("NotImplemented");
    };
    ForwardContent.create = function (secrets) {
        return new ns.dkd.SecretContent(secrets);
    };
    ns.protocol.ForwardContent = ForwardContent;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var ArrayContent = Interface(null, [Content]);
    ArrayContent.prototype.getContents = function () {
        throw new Error("NotImplemented");
    };
    ArrayContent.create = function (contents) {
        return new ns.dkd.ListContent(contents);
    };
    ns.protocol.ArrayContent = ArrayContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var CustomizedContent = Interface(null, [Content]);
    CustomizedContent.prototype.getApplication = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.prototype.getModule = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.prototype.getAction = function () {
        throw new Error("NotImplemented");
    };
    CustomizedContent.create = function (contents) {
        return new ns.dkd.AppCustomizedContent(contents);
    };
    ns.protocol.CustomizedContent = CustomizedContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Content = ns.protocol.Content;
    var Command = Interface(null, [Content]);
    Command.META = "meta";
    Command.DOCUMENT = "document";
    Command.prototype.getCmd = function () {
        throw new Error("NotImplemented");
    };
    var CommandFactory = Interface(null, null);
    CommandFactory.prototype.parseCommand = function (cmd) {
        throw new Error("NotImplemented");
    };
    Command.Factory = CommandFactory;
    var general_factory = function () {
        var man = ns.dkd.cmd.FactoryManager;
        return man.generalFactory;
    };
    Command.setFactory = function (cmd, factory) {
        var gf = general_factory();
        gf.setCommandFactory(cmd, factory);
    };
    Command.getFactory = function (cmd) {
        var gf = general_factory();
        return gf.getCommandFactory(cmd);
    };
    Command.parse = function (command) {
        var gf = general_factory();
        return gf.parseCommand(command);
    };
    ns.protocol.Command = Command;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = Interface(null, [Command]);
    MetaCommand.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    MetaCommand.prototype.getMeta = function () {
        throw new Error("NotImplemented");
    };
    MetaCommand.query = function (identifier) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier);
    };
    MetaCommand.response = function (identifier, meta) {
        return new ns.dkd.cmd.BaseMetaCommand(identifier, meta);
    };
    ns.protocol.MetaCommand = MetaCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = Interface(null, [MetaCommand]);
    DocumentCommand.prototype.getDocument = function () {
        throw new Error("NotImplemented");
    };
    DocumentCommand.prototype.getSignature = function () {
        throw new Error("NotImplemented");
    };
    DocumentCommand.query = function (identifier, signature) {
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, signature);
    };
    DocumentCommand.response = function (identifier, meta, doc) {
        return new ns.dkd.cmd.BaseDocumentCommand(identifier, meta, doc);
    };
    ns.protocol.DocumentCommand = DocumentCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Command = ns.protocol.Command;
    var HistoryCommand = Interface(null, [Command]);
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = Interface(null, [HistoryCommand]);
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
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.getMember = function () {
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.setMembers = function (members) {
        throw new Error("NotImplemented");
    };
    GroupCommand.prototype.getMembers = function () {
        throw new Error("NotImplemented");
    };
    GroupCommand.invite = function (group, members) {
        return new ns.dkd.cmd.InviteGroupCommand(group, members);
    };
    GroupCommand.expel = function (group, members) {
        return new ns.dkd.cmd.ExpelGroupCommand(group, members);
    };
    GroupCommand.join = function (group) {
        return new ns.dkd.cmd.JoinGroupCommand(group);
    };
    GroupCommand.quit = function (group) {
        return new ns.dkd.cmd.QuitGroupCommand(group);
    };
    GroupCommand.reset = function (group, members) {
        return new ns.dkd.cmd.ResetGroupCommand(group, members);
    };
    GroupCommand.query = function (group) {
        return new ns.dkd.cmd.QueryGroupCommand(group);
    };
    ns.protocol.GroupCommand = GroupCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = Interface(null, [GroupCommand]);
    var ExpelCommand = Interface(null, [GroupCommand]);
    var JoinCommand = Interface(null, [GroupCommand]);
    var QuitCommand = Interface(null, [GroupCommand]);
    var ResetCommand = Interface(null, [GroupCommand]);
    var QueryCommand = Interface(null, [GroupCommand]);
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
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
            type = 0;
            sn = 0;
            time = null;
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time;
    };
    Class(BaseContent, Dictionary, [Content], {
        getType: function () {
            if (this.__type === 0) {
                this.__type = this.getNumber("type");
            }
            return this.__type;
        },
        getSerialNumber: function () {
            if (this.__sn === 0) {
                this.__sn = this.getNumber("sn");
            }
            return this.__sn;
        },
        getTime: function () {
            if (this.__time === null) {
                this.__time = get_time(this, "time");
            }
            return this.__time;
        },
        getGroup: function () {
            var group = this.getValue("group");
            return ID.parse(group);
        },
        setGroup: function (identifier) {
            this.setString("group", identifier);
        }
    });
    var get_time = function (dict, key) {
        return Dictionary.prototype.getTime.call(dict, key);
    };
    ns.dkd.BaseContent = BaseContent;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var TextContent = ns.protocol.TextContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseTextContent = function () {
        if (typeof arguments[0] === "string") {
            BaseContent.call(this, ContentType.TEXT);
            this.setText(arguments[0]);
        } else {
            BaseContent.call(this, arguments[0]);
        }
    };
    Class(BaseTextContent, BaseContent, [TextContent], {
        getText: function () {
            return this.getString("text");
        },
        setText: function (text) {
            this.setValue("text", text);
        }
    });
    ns.dkd.BaseTextContent = BaseTextContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseFileContent = function () {
        var filename = null;
        var data = null;
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(this, ContentType.FILE);
                filename = arguments[0];
                data = arguments[1];
            } else {
                if (arguments.length === 3) {
                    BaseContent.call(this, arguments[0]);
                    filename = arguments[1];
                    data = arguments[2];
                } else {
                    throw new SyntaxError("File content arguments error: " + arguments);
                }
            }
        }
        if (filename) {
            this.setValue("filename", filename);
        }
        if (data) {
            var base64 = null;
            if (typeof data === "string") {
                base64 = data;
                data = null;
            } else {
                if (data instanceof Uint8Array) {
                    base64 = Base64.encode(data);
                } else {
                    throw TypeError("file data error: " + typeof data);
                }
            }
            this.setValue("data", base64);
        }
        this.__data = data;
        this.__password = null;
    };
    Class(BaseFileContent, BaseContent, [FileContent], {
        setURL: function (url) {
            this.setValue("URL", url);
        },
        getURL: function () {
            return this.getString("URL");
        },
        setFilename: function (filename) {
            this.setValue("filename");
        },
        getFilename: function () {
            return this.getString("filename");
        },
        setData: function (data) {
            if (data && data.length > 0) {
                this.setValue("data", Base64.encode(data));
            } else {
                this.removeValue("data");
            }
            this.__data = data;
        },
        getData: function () {
            if (this.__data === null) {
                var base64 = this.getString("data");
                if (base64) {
                    this.__data = Base64.decode(base64);
                }
            }
            return this.__data;
        },
        setPassword: function (key) {
            this.setMap("password", key);
            this.__password = key;
        },
        getPassword: function () {
            if (this.__password === null) {
                var key = this.getValue("password");
                this.__password = SymmetricKey.parse(key);
            }
            return this.__password;
        }
    });
    ns.dkd.BaseFileContent = BaseFileContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
    var ContentType = ns.protocol.ContentType;
    var ImageContent = ns.protocol.ImageContent;
    var VideoContent = ns.protocol.VideoContent;
    var AudioContent = ns.protocol.AudioContent;
    var BaseFileContent = ns.dkd.BaseFileContent;
    var ImageFileContent = function () {
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
                throw new SyntaxError("Image content arguments error: " + arguments);
            }
        }
        this.__thumbnail = null;
    };
    Class(ImageFileContent, BaseFileContent, [ImageContent], {
        getThumbnail: function () {
            if (this.__thumbnail === null) {
                var base64 = this.getString("thumbnail");
                if (base64) {
                    this.__thumbnail = Base64.decode(base64);
                }
            }
            return this.__thumbnail;
        },
        setThumbnail: function (image) {
            if (image && image.length > 0) {
                this.setValue("thumbnail", Base64.encode(image));
            } else {
                this.removeValue("thumbnail");
            }
            this.__thumbnail = image;
        }
    });
    var VideoFileContent = function () {
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
                throw new SyntaxError("Video content arguments error: " + arguments);
            }
        }
        this.__snapshot = null;
    };
    Class(VideoFileContent, BaseFileContent, [VideoContent], {
        getSnapshot: function () {
            if (this.__snapshot === null) {
                var base64 = this.getString("snapshot");
                if (base64) {
                    this.__snapshot = Base64.decode(base64);
                }
            }
            return this.__snapshot;
        },
        setSnapshot: function (image) {
            if (image && image.length > 0) {
                this.setValue("snapshot", Base64.encode(image));
            } else {
                this.removeValue("snapshot");
            }
            this.__snapshot = image;
        }
    });
    var AudioFileContent = function () {
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
                throw new SyntaxError("Audio content arguments error: " + arguments);
            }
        }
    };
    Class(AudioFileContent, BaseFileContent, [AudioContent], {
        getText: function () {
            return this.getString("text");
        },
        setText: function (asr) {
            this.setValue("text", asr);
        }
    });
    ns.dkd.ImageFileContent = ImageFileContent;
    ns.dkd.VideoFileContent = VideoFileContent;
    ns.dkd.AudioFileContent = AudioFileContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Base64 = ns.format.Base64;
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
                this.__icon = null;
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3]);
            } else {
                throw new SyntaxError("Web page content arguments error: " + arguments);
            }
        }
    };
    Class(WebPageContent, BaseContent, [PageContent], {
        getURL: function () {
            return this.getString("URL");
        },
        setURL: function (url) {
            this.setValue("URL", url);
        },
        getTitle: function () {
            return this.getString("title");
        },
        setTitle: function (title) {
            this.setValue("title", title);
        },
        getDesc: function () {
            return this.getString("desc");
        },
        setDesc: function (text) {
            this.setValue("desc", text);
        },
        getIcon: function () {
            if (this.__icon === null) {
                var base64 = this.getString("icon");
                if (base64) {
                    this.__icon = Base64.decode(base64);
                }
            }
            return this.__icon;
        },
        setIcon: function (image) {
            if (image && image.length > 0) {
                this.setValue("icon", Base64.encode(image));
            } else {
                this.removeValue("icon");
            }
            this.__icon = image;
        }
    });
    ns.dkd.WebPageContent = WebPageContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.protocol.MoneyContent;
    var TransferContent = ns.protocol.TransferContent;
    var BaseContent = ns.dkd.BaseContent;
    var BaseMoneyContent = function () {
        if (arguments.length === 1) {
            BaseContent.call(arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1]);
            } else {
                if (arguments.length === 3) {
                    BaseContent.call(arguments[0]);
                    this.setCurrency(arguments[1]);
                    this.setAmount(arguments[2]);
                } else {
                    throw new SyntaxError("money content arguments error: " + arguments);
                }
            }
        }
    };
    Class(BaseMoneyContent, BaseContent, [MoneyContent], {
        setCurrency: function (currency) {
            this.setValue("currency", currency);
        },
        getCurrency: function () {
            return this.getString("currency");
        },
        setAmount: function (amount) {
            this.setValue("amount", amount);
        },
        getAmount: function () {
            return this.getNumber("amount");
        }
    });
    var TransferMoneyContent = function () {
        if (arguments.length === 1) {
            MoneyContent.call(arguments[0]);
        } else {
            if (arguments.length === 2) {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1]);
            } else {
                throw new SyntaxError("money content arguments error: " + arguments);
            }
        }
    };
    Class(TransferMoneyContent, BaseMoneyContent, [TransferContent], {
        getRemitter: function () {
            var sender = this.getValue("remitter");
            return ID.parse(sender);
        },
        setRemitter: function (sender) {
            this.setString("remitter", sender);
        },
        getRemittee: function () {
            var receiver = this.getValue("remittee");
            return ID.parse(receiver);
        },
        setRemittee: function (receiver) {
            this.setString("remittee", receiver);
        }
    });
    ns.dkd.BaseMoneyContent = BaseMoneyContent;
    ns.dkd.TransferMoneyContent = TransferMoneyContent;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var ForwardContent = ns.protocol.ForwardContent;
    var BaseContent = ns.dkd.BaseContent;
    var SecretContent = function () {
        var info = arguments[0];
        var forward = null;
        var secrets = null;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.FORWARD);
            secrets = info;
        } else {
            if (Interface.conforms(info, ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                forward = info;
            } else {
                BaseContent.call(this, info);
            }
        }
        if (forward) {
            this.setMap("forward", forward);
        } else {
            if (secrets) {
                var array = SecretContent.revert(secrets);
                this.setValue("secrets", array);
            }
        }
        this.__forward = forward;
        this.__secrets = secrets;
    };
    Class(SecretContent, BaseContent, [ForwardContent], {
        getForward: function () {
            if (this.__forward === null) {
                var forward = this.getValue("forward");
                this.__forward = ReliableMessage.parse(forward);
            }
            return this.__forward;
        },
        getSecrets: function () {
            if (this.__secrets === null) {
                var array = this.getValue("secrets");
                if (array) {
                    this.__secrets = SecretContent.convert(array);
                } else {
                    this.__secrets = [];
                    var msg = this.getForward();
                    if (msg) {
                        this.__secrets.push(msg);
                    }
                }
            }
            return this.__secrets;
        }
    });
    SecretContent.convert = function (messages) {
        var array = [];
        var msg;
        for (var i = 0; i < messages.length; ++i) {
            msg = ReliableMessage.parse(messages[i]);
            if (msg) {
                array.push(msg);
            }
        }
        return array;
    };
    SecretContent.revert = function (messages) {
        var array = [];
        for (var i = 0; i < messages.length; ++i) {
            array.push(messages[i].toMap());
        }
        return array;
    };
    ns.dkd.SecretContent = SecretContent;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var ArrayContent = ns.protocol.ArrayContent;
    var BaseContent = ns.dkd.BaseContent;
    var ListContent = function () {
        var info = arguments[0];
        var list;
        if (info instanceof Array) {
            BaseContent.call(this, ContentType.ARRAY);
            list = info;
            this.setValue("contents", ListContent.revert(list));
        } else {
            BaseContent.call(this, arguments[0]);
            list = null;
        }
        this.__list = list;
    };
    Class(ListContent, BaseContent, [ArrayContent], {
        getContents: function () {
            if (this.__list === null) {
                var array = this.getValue("contents");
                if (array) {
                    this.__list = ListContent.convert(array);
                } else {
                    this.__list = [];
                }
            }
            return this.__list;
        }
    });
    ListContent.convert = function (contents) {
        var array = [];
        var item;
        for (var i = 0; i < contents.length; ++i) {
            item = Content.parse(contents[i]);
            if (item) {
                array.push(item);
            }
        }
        return array;
    };
    ListContent.revert = function (contents) {
        var array = [];
        for (var i = 0; i < contents.length; ++i) {
            array.push(contents[i].toMap());
        }
        return array;
    };
    ns.dkd.ListContent = ListContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var CustomizedContent = ns.protocol.CustomizedContent;
    var BaseContent = ns.dkd.BaseContent;
    var AppCustomizedContent = function () {
        var app = null;
        var mod = null;
        var act = null;
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
        } else {
            if (arguments.length === 3) {
                BaseContent.call(this, ContentType.CUSTOMIZED);
                app = arguments[0];
                mod = arguments[1];
                act = arguments[2];
            } else {
                BaseContent.call(this, arguments[0]);
                app = arguments[1];
                mod = arguments[2];
                act = arguments[3];
            }
        }
        if (app) {
            this.setValue("app", app);
        }
        if (mod) {
            this.setValue("mod", mod);
        }
        if (act) {
            this.setValue("act", act);
        }
    };
    Class(AppCustomizedContent, BaseContent, [CustomizedContent], {
        getApplication: function () {
            return this.getString("app");
        },
        getModule: function () {
            return this.getString("mod");
        },
        getAction: function () {
            return this.getString("act");
        }
    });
    ns.dkd.AppCustomizedContent = AppCustomizedContent;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var BaseContent = ns.dkd.BaseContent;
    var BaseCommand = function () {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setValue("cmd", arguments[1]);
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setValue("cmd", arguments[0]);
            } else {
                BaseContent.call(this, arguments[0]);
            }
        }
    };
    Class(BaseCommand, BaseContent, [Command], {
        getCmd: function () {
            return this.getString("cmd");
        }
    });
    ns.dkd.cmd.BaseCommand = BaseCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseMetaCommand = function () {
        var identifier = null;
        var meta = null;
        if (arguments.length === 3) {
            BaseCommand.call(this, arguments[0]);
            identifier = arguments[1];
            meta = arguments[2];
        } else {
            if (arguments.length === 2) {
                BaseCommand.call(this, Command.META);
                identifier = arguments[0];
                meta = arguments[1];
            } else {
                if (Interface.conforms(arguments[0], ID)) {
                    BaseCommand.call(this, Command.META);
                    identifier = arguments[0];
                } else {
                    BaseCommand.call(this, arguments[0]);
                }
            }
        }
        if (identifier) {
            this.setString("ID", identifier);
        }
        if (meta) {
            this.setMap("meta", meta);
        }
        this.__identifier = identifier;
        this.__meta = meta;
    };
    Class(BaseMetaCommand, BaseCommand, [MetaCommand], {
        getIdentifier: function () {
            if (this.__identifier == null) {
                var identifier = this.getValue("ID");
                this.__identifier = ID.parse(identifier);
            }
            return this.__identifier;
        },
        getMeta: function () {
            if (this.__meta === null) {
                var meta = this.getValue("meta");
                this.__meta = Meta.parse(meta);
            }
            return this.__meta;
        }
    });
    ns.dkd.cmd.BaseMetaCommand = BaseMetaCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var DocumentCommand = ns.protocol.DocumentCommand;
    var BaseMetaCommand = ns.dkd.cmd.BaseMetaCommand;
    var BaseDocumentCommand = function () {
        var doc = null;
        var sig = null;
        if (arguments.length === 1) {
            if (Interface.conforms(arguments[0], ID)) {
                BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
            } else {
                BaseMetaCommand.call(this, arguments[0]);
            }
        } else {
            if (arguments.length === 2) {
                if (Interface.conforms(arguments[1], Document)) {
                    BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                    doc = arguments[1];
                } else {
                    BaseMetaCommand.call(this, Command.DOCUMENT, arguments[0], null);
                    sig = arguments[1];
                }
            } else {
                if (arguments.length === 3) {
                    BaseMetaCommand.call(
                        this,
                        Command.DOCUMENT,
                        arguments[0],
                        arguments[1]
                    );
                    doc = arguments[2];
                } else {
                    throw new SyntaxError(
                        "document command arguments error: " + arguments
                    );
                }
            }
        }
        if (doc) {
            this.setMap("document", doc);
        }
        if (sig) {
            this.setValue("signature", sig);
        }
        this.__document = doc;
    };
    Class(BaseDocumentCommand, BaseMetaCommand, [DocumentCommand], {
        getDocument: function () {
            if (this.__document === null) {
                var doc = this.getValue("document");
                this.__document = Document.parse(doc);
            }
            return this.__document;
        },
        getSignature: function () {
            return this.getString("signature");
        }
    });
    ns.dkd.cmd.BaseDocumentCommand = BaseDocumentCommand;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var ContentType = ns.protocol.ContentType;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var BaseCommand = ns.dkd.cmd.BaseCommand;
    var BaseHistoryCommand = function () {
        if (typeof arguments[0] === "string") {
            BaseCommand.call(this, ContentType.HISTORY, arguments[0]);
        } else {
            BaseCommand.call(this, arguments[0]);
        }
    };
    Class(BaseHistoryCommand, BaseCommand, [HistoryCommand], null);
    ns.dkd.cmd.BaseHistoryCommand = BaseHistoryCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var BaseHistoryCommand = ns.dkd.cmd.BaseHistoryCommand;
    var BaseGroupCommand = function () {
        var group = null;
        var member = null;
        var members = null;
        if (arguments.length === 1) {
            BaseHistoryCommand.call(this, arguments[0]);
        } else {
            if (arguments.length === 2) {
                BaseHistoryCommand.call(this, arguments[0]);
                group = arguments[1];
            } else {
                if (arguments[2] instanceof Array) {
                    BaseHistoryCommand.call(this, arguments[0]);
                    group = arguments[1];
                    members = arguments[2];
                } else {
                    if (Interface.conforms(arguments[2], ID)) {
                        BaseHistoryCommand.call(this, arguments[0]);
                        group = arguments[1];
                        member = arguments[2];
                    } else {
                        throw new SyntaxError(
                            "Group command arguments error: " + arguments
                        );
                    }
                }
            }
        }
        if (group) {
            this.setGroup(group);
        }
        if (member) {
            this.setMember(member);
        } else {
            if (members) {
                this.setMembers(members);
            }
        }
        this.__member = member;
        this.__members = members;
    };
    Class(BaseGroupCommand, BaseHistoryCommand, [GroupCommand], {
        setMember: function (identifier) {
            this.setString("member", identifier);
            this.__member = identifier;
        },
        getMember: function () {
            if (this.__member === null) {
                var member = this.getValue("member");
                this.__member = ID.parse(member);
            }
            return this.__member;
        },
        setMembers: function (members) {
            if (members) {
                var array = ID.revert(members);
                this.setValue("members", array);
            } else {
                this.removeValue("members");
            }
            this.__members = members;
        },
        getMembers: function () {
            if (this.__members === null) {
                var array = this.getValue("members");
                if (array) {
                    this.__members = ID.convert(array);
                }
            }
            return this.__members;
        }
    });
    ns.dkd.cmd.BaseGroupCommand = BaseGroupCommand;
})(DIMP);
(function (ns) {
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
    var BaseGroupCommand = ns.dkd.cmd.BaseGroupCommand;
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
    Class(InviteGroupCommand, BaseGroupCommand, [InviteCommand], null);
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
    Class(ExpelGroupCommand, BaseGroupCommand, [ExpelCommand], null);
    var JoinGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.JOIN, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(JoinGroupCommand, BaseGroupCommand, [JoinCommand], null);
    var QuitGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUIT, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QuitGroupCommand, BaseGroupCommand, [QuitCommand], null);
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
    Class(ResetGroupCommand, BaseGroupCommand, [ResetCommand], null);
    var QueryGroupCommand = function () {
        if (Interface.conforms(arguments[0], ID)) {
            BaseGroupCommand.call(this, GroupCommand.QUERY, arguments[0]);
        } else {
            BaseGroupCommand.call(this, arguments[0]);
        }
    };
    Class(QueryGroupCommand, BaseGroupCommand, [QueryCommand], null);
    ns.dkd.cmd.InviteGroupCommand = InviteGroupCommand;
    ns.dkd.cmd.ExpelGroupCommand = ExpelGroupCommand;
    ns.dkd.cmd.JoinGroupCommand = JoinGroupCommand;
    ns.dkd.cmd.QuitGroupCommand = QuitGroupCommand;
    ns.dkd.cmd.ResetGroupCommand = ResetGroupCommand;
    ns.dkd.cmd.QueryGroupCommand = QueryGroupCommand;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var Command = ns.protocol.Command;
    var GeneralContentFactory = ns.dkd.GeneralFactory;
    var GeneralFactory = function () {
        this.__commandFactories = {};
    };
    Class(GeneralFactory, GeneralContentFactory, null, {
        setCommandFactory: function (cmd, factory) {
            this.__commandFactories[cmd] = factory;
        },
        getCommandFactory: function (cmd) {
            return this.__commandFactories[cmd];
        },
        getCmd: function (command) {
            return command["cmd"];
        },
        parseCommand: function (command) {
            if (!command) {
                return null;
            } else {
                if (Interface.conforms(command, Command)) {
                    return command;
                }
            }
            command = Wrapper.fetchMap(command);
            var cmd = this.getCmd(command);
            var factory = this.getCommandFactory(cmd);
            if (!factory) {
                var type = this.getContentType(command);
                factory = this.getContentFactory(type);
            }
            return factory.parseContent(command);
        }
    });
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.dkd.cmd.GeneralFactory = GeneralFactory;
    ns.dkd.cmd.FactoryManager = FactoryManager;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var ID = ns.protocol.ID;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function () {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = null;
            to = null;
            when = null;
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
    Class(MessageEnvelope, Dictionary, [Envelope], {
        getSender: function () {
            if (this.__sender === null) {
                this.__sender = get_id(this, "sender");
            }
            return this.__sender;
        },
        getReceiver: function () {
            if (this.__receiver === null) {
                this.__receiver = get_id(this, "receiver");
            }
            return this.__receiver;
        },
        getTime: function () {
            if (this.__time === null) {
                this.__time = get_time(this, "time");
            }
            return this.__time;
        },
        getGroup: function () {
            return get_id(this, "group");
        },
        setGroup: function (identifier) {
            this.setString("group", identifier);
        },
        getType: function () {
            return this.getNumber("type");
        },
        setType: function (type) {
            this.setValue("type", type);
        }
    });
    var get_id = function (dict, key) {
        return ID.parse(dict.getValue(key));
    };
    var get_time = function (dict, key) {
        return Dictionary.prototype.getTime.call(dict, key);
    };
    ns.dkd.MessageEnvelope = MessageEnvelope;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = ns.dkd.MessageEnvelope;
    var EnvelopeFactory = function () {
        Object.call(this);
    };
    Class(EnvelopeFactory, Object, [Envelope.Factory], null);
    EnvelopeFactory.prototype.createEnvelope = function (from, to, when) {
        return new MessageEnvelope(from, to, when);
    };
    EnvelopeFactory.prototype.parseEnvelope = function (env) {
        if (!env["sender"]) {
            return null;
        }
        return new MessageEnvelope(env);
    };
    ns.dkd.EnvelopeFactory = EnvelopeFactory;
})(DaoKeDao);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function (msg) {
        var env = null;
        if (Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.toMap();
        }
        Dictionary.call(this, msg);
        this.__envelope = env;
        this.__delegate = null;
    };
    Class(BaseMessage, Dictionary, [Message], {
        getDelegate: function () {
            return this.__delegate;
        },
        setDelegate: function (delegate) {
            this.__delegate = delegate;
        },
        getEnvelope: function () {
            if (this.__envelope === null) {
                this.__envelope = Envelope.parse(this.toMap());
            }
            return this.__envelope;
        },
        getSender: function () {
            var env = this.getEnvelope();
            return env.getSender();
        },
        getReceiver: function () {
            var env = this.getEnvelope();
            return env.getReceiver();
        },
        getTime: function () {
            var env = this.getEnvelope();
            return env.getTime();
        },
        getGroup: function () {
            var env = this.getEnvelope();
            return env.getGroup();
        },
        getType: function () {
            var env = this.getEnvelope();
            return env.getTime();
        }
    });
    ns.dkd.BaseMessage = BaseMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.dkd.BaseMessage;
    var PlainMessage = function () {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = null;
            body = null;
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
    Class(PlainMessage, BaseMessage, [InstantMessage], {
        getContent: function () {
            if (this.__content === null) {
                this.__content = Content.parse(this.getValue("content"));
            }
            return this.__content;
        },
        getTime: function () {
            var content = this.getContent();
            var time = content.getTime();
            if (time) {
                return time;
            } else {
                var env = this.getEnvelope();
                return env.getTime();
            }
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
        var msg = prepare_data.call(this, password);
        var delegate = this.getDelegate();
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
        var msg = prepare_data.call(this, password);
        var delegate = this.getDelegate();
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
            keys[member.toString()] = delegate.encodeKey(data, this);
            ++count;
        }
        if (count > 0) {
            msg["keys"] = keys;
        }
        return SecureMessage.parse(msg);
    };
    var prepare_data = function (password) {
        var delegate = this.getDelegate();
        var data = delegate.serializeContent(this.getContent(), password, this);
        data = delegate.encryptContent(data, password, this);
        var base64 = delegate.encodeData(data, this);
        var msg = this.copyMap(false);
        delete msg["content"];
        msg["data"] = base64;
        return msg;
    };
    ns.dkd.PlainMessage = PlainMessage;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var InstantMessage = ns.protocol.InstantMessage;
    var PlainMessage = ns.dkd.PlainMessage;
    var InstantMessageFactory = function () {
        Object.call(this);
        this.__sn = randomPositiveInteger();
    };
    Class(InstantMessageFactory, Object, [InstantMessage.Factory], null);
    var MAX_SN = 2147483647;
    var randomPositiveInteger = function () {
        var sn = Math.ceil(Math.random() * MAX_SN);
        if (sn > 0) {
            return sn;
        } else {
            if (sn < 0) {
                return -sn;
            }
        }
        return 9527 + 9394;
    };
    var next = function () {
        if (this.__sn < MAX_SN) {
            this.__sn += 1;
        } else {
            this.__sn = 1;
        }
        return this.__sn;
    };
    InstantMessageFactory.prototype.generateSerialNumber = function (
        msgType,
        now
    ) {
        return next.call(this);
    };
    InstantMessageFactory.prototype.createInstantMessage = function (head, body) {
        return new PlainMessage(head, body);
    };
    InstantMessageFactory.prototype.parseInstantMessage = function (msg) {
        if (!msg["sender"] || !msg["content"]) {
            return null;
        }
        return new PlainMessage(msg);
    };
    ns.dkd.InstantMessageFactory = InstantMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
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
    Class(EncryptedMessage, BaseMessage, [SecureMessage], {
        getData: function () {
            if (this.__data === null) {
                var base64 = this.getValue("data");
                var delegate = this.getDelegate();
                this.__data = delegate.decodeData(base64, this);
            }
            return this.__data;
        },
        getEncryptedKey: function () {
            if (this.__key === null) {
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
            if (this.__keys === null) {
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
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var SecureMessage = ns.protocol.SecureMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var SecureMessageFactory = function () {
        Object.call(this);
    };
    Class(SecureMessageFactory, Object, [SecureMessage.Factory], null);
    SecureMessageFactory.prototype.parseSecureMessage = function (msg) {
        if (!msg["sender"] || !msg["data"]) {
            return null;
        }
        if (msg["signature"]) {
            return new NetworkMessage(msg);
        }
        return new EncryptedMessage(msg);
    };
    ns.dkd.SecureMessageFactory = SecureMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.dkd.EncryptedMessage;
    var NetworkMessage = function (msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null;
        this.__meta = null;
        this.__visa = null;
    };
    Class(NetworkMessage, EncryptedMessage, [ReliableMessage], {
        getSignature: function () {
            if (this.__signature === null) {
                var base64 = this.getValue("signature");
                var delegate = this.getDelegate();
                this.__signature = delegate.decodeSignature(base64, this);
            }
            return this.__signature;
        },
        setMeta: function (meta) {
            this.setMap("meta", meta);
            this.__meta = meta;
        },
        getMeta: function () {
            if (this.__meta === null) {
                var dict = this.getValue("meta");
                this.__meta = Meta.parse(dict);
            }
            return this.__meta;
        },
        setVisa: function (visa) {
            this.setMap("visa", visa);
            this.__visa = visa;
        },
        getVisa: function () {
            if (this.__visa === null) {
                var dict = this.getValue("visa");
                this.__visa = Document.parse(dict);
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
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var NetworkMessage = ns.dkd.NetworkMessage;
    var ReliableMessageFactory = function () {
        Object.call(this);
    };
    Class(ReliableMessageFactory, Object, [ReliableMessage.Factory], null);
    ReliableMessageFactory.prototype.parseReliableMessage = function (msg) {
        if (!msg["sender"] || !msg["data"] || !msg["signature"]) {
            return null;
        }
        return new NetworkMessage(msg);
    };
    ns.dkd.ReliableMessageFactory = ReliableMessageFactory;
})(DaoKeDao);
(function (ns) {
    var Class = ns.type.Class;
    var Address = ns.protocol.Address;
    var AddressFactory = function () {
        Object.call(this);
        this.__addresses = {};
    };
    Class(AddressFactory, Object, [Address.Factory], null);
    AddressFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__addresses, finger);
        return finger >> 1;
    };
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
    var thanos = function (planet, finger) {
        var keys = Object.keys(planet);
        var k, p;
        for (var i = 0; i < keys.length; ++i) {
            k = keys[i];
            p = planet[k];
            finger += 1;
            if ((finger & 1) === 1) {
                delete planet[k];
            }
        }
        return finger;
    };
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.thanos = thanos;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;
    var IDFactory = function () {
        Object.call(this);
        this.__identifiers = {};
    };
    Class(IDFactory, Object, [ID.Factory], null);
    IDFactory.prototype.reduceMemory = function () {
        var finger = 0;
        finger = ns.mkm.thanos(this.__identifiers, finger);
        return finger >> 1;
    };
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        var address = Address.generate(meta, network);
        return ID.create(meta.getSeed(), address, terminal);
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = this.newID(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    };
    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = this.parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };
    IDFactory.prototype.newID = function (string, name, address, terminal) {
        return new Identifier(string, name, address, terminal);
    };
    IDFactory.prototype.parse = function (string) {
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
        return this.newID(string, name, address, terminal);
    };
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
    ns.mkm.IDFactory = IDFactory;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var Base64 = ns.format.Base64;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
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
            type = 0;
            key = null;
            seed = null;
            fingerprint = null;
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
    Class(BaseMeta, Dictionary, [Meta], {
        getType: function () {
            if (this.__type === 0) {
                this.__type = this.getNumber("type");
            }
            return this.__type;
        },
        getKey: function () {
            if (this.__key === null) {
                var key = this.getValue("key");
                this.__key = PublicKey.parse(key);
            }
            return this.__key;
        },
        getSeed: function () {
            if (this.__seed === null && MetaType.hasSeed(this.getType())) {
                this.__seed = this.getString("seed");
            }
            return this.__seed;
        },
        getFingerprint: function () {
            if (this.__fingerprint === null && MetaType.hasSeed(this.getType())) {
                var base64 = this.getString("fingerprint");
                this.__fingerprint = Base64.decode(base64);
            }
            return this.__fingerprint;
        }
    });
    ns.mkm.BaseMeta = BaseMeta;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var Dictionary = ns.type.Dictionary;
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var ID = ns.protocol.ID;
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
    Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0;
        },
        getType: function () {
            var type = this.getProperty("type");
            if (!type) {
                type = this.getString("type");
            }
            return type;
        },
        getIdentifier: function () {
            if (this.__identifier === null) {
                this.__identifier = ID.parse(this.getValue("ID"));
            }
            return this.__identifier;
        },
        getData: function () {
            if (this.__json === null) {
                this.__json = this.getString("data");
            }
            return this.__json;
        },
        getSignature: function () {
            if (this.__sig === null) {
                var base64 = this.getString("signature");
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
                    this.__properties = JsON.decode(data);
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
            if (value) {
                dict[name] = value;
            } else {
                delete dict[name];
            }
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
            return this.__status === 1;
        },
        sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature();
            }
            var now = new Date();
            this.setProperty("time", now.getTime() / 1000);
            var data = JsON.encode(this.allProperties());
            if (!data || data.length === 0) {
                return null;
            }
            var signature = privateKey.sign(UTF8.encode(data));
            if (!signature || signature.length === 0) {
                return null;
            }
            this.setValue("data", data);
            this.setValue("signature", Base64.encode(signature));
            this.__json = data;
            this.__sig = signature;
            this.__status = 1;
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
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
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
            if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__key = null;
    };
    Class(BaseVisa, BaseDocument, [Visa], {
        getKey: function () {
            if (this.__key === null) {
                var key = this.getProperty("key");
                key = PublicKey.parse(key);
                if (Interface.conforms(key, EncryptKey)) {
                    this.__key = key;
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
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__assistants = null;
    };
    Class(BaseBulletin, BaseDocument, [Bulletin], {
        getAssistants: function () {
            if (this.__assistants === null) {
                var assistants = this.getProperty("assistants");
                if (assistants) {
                    this.__assistants = ID.convert(assistants);
                }
            }
            return this.__assistants;
        },
        setAssistants: function (assistants) {
            if (assistants) {
                this.setProperty("assistants", ID.revert(assistants));
            } else {
                this.setProperty("assistants", null);
            }
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = Interface(null, [ns.type.Object]);
    Entity.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getMeta = function () {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getDocument = function (type) {
        throw new Error("NotImplemented");
    };
    Entity.prototype.setDataSource = function (barrack) {
        throw new Error("NotImplemented");
    };
    Entity.prototype.getDataSource = function () {
        throw new Error("NotImplemented");
    };
    var EntityDataSource = Interface(null, null);
    EntityDataSource.prototype.getMeta = function (identifier) {
        throw new Error("NotImplemented");
    };
    EntityDataSource.prototype.getDocument = function (identifier, type) {
        throw new Error("NotImplemented");
    };
    var EntityDelegate = Interface(null, null);
    EntityDelegate.prototype.getUser = function (identifier) {
        throw new Error("NotImplemented");
    };
    EntityDelegate.prototype.getGroup = function (identifier) {
        throw new Error("NotImplemented");
    };
    Entity.DataSource = EntityDataSource;
    Entity.Delegate = EntityDelegate;
    ns.mkm.Entity = Entity;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var Entity = ns.mkm.Entity;
    var BaseEntity = function (identifier) {
        BaseObject.call(this);
        this.__identifier = identifier;
        this.__datasource = null;
    };
    Class(BaseEntity, BaseObject, [Entity], null);
    BaseEntity.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else {
            if (!other) {
                return false;
            } else {
                if (Interface.conforms(other, Entity)) {
                    other = other.getIdentifier();
                }
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
        var clazz = Object.getPrototypeOf(this).constructor.name;
        var id = this.__identifier;
        var network = id.getAddress().getType();
        return (
            "<" + clazz + ' id="' + id.toString() + '" network="' + network + '" />'
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
        var delegate = this.getDataSource();
        return delegate.getMeta(this.__identifier);
    };
    BaseEntity.prototype.getDocument = function (type) {
        var delegate = this.getDataSource();
        return delegate.getDocument(this.__identifier, type);
    };
    ns.mkm.BaseEntity = BaseEntity;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var User = Interface(null, [Entity]);
    User.prototype.getVisa = function () {
        throw new Error("NotImplemented");
    };
    User.prototype.getContacts = function () {
        throw new Error("NotImplemented");
    };
    User.prototype.verify = function (data, signature) {
        throw new Error("NotImplemented");
    };
    User.prototype.encrypt = function (plaintext) {
        throw new Error("NotImplemented");
    };
    User.prototype.sign = function (data) {
        throw new Error("NotImplemented");
    };
    User.prototype.decrypt = function (ciphertext) {
        throw new Error("NotImplemented");
    };
    User.prototype.signVisa = function (doc) {
        throw new Error("NotImplemented");
    };
    User.prototype.verifyVisa = function (doc) {
        throw new Error("NotImplemented");
    };
    var UserDataSource = Interface(null, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPublicKeysForVerification = function (
        identifier
    ) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        throw new Error("NotImplemented");
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function (
        identifier
    ) {
        throw new Error("NotImplemented");
    };
    User.DataSource = UserDataSource;
    ns.mkm.User = User;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var User = ns.mkm.User;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseUser = function (identifier) {
        BaseEntity.call(this, identifier);
    };
    Class(BaseUser, BaseEntity, [User], {
        getVisa: function () {
            var doc = this.getDocument(Document.VISA);
            if (Interface.conforms(doc, Visa)) {
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
            return key.encrypt(plaintext);
        },
        sign: function (data) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var key = barrack.getPrivateKeyForSignature(uid);
            return key.sign(data);
        },
        decrypt: function (ciphertext) {
            var barrack = this.getDataSource();
            var uid = this.getIdentifier();
            var keys = barrack.getPrivateKeysForDecryption(uid);
            var plaintext;
            for (var i = 0; i < keys.length; ++i) {
                try {
                    plaintext = keys[i].decrypt(ciphertext);
                    if (plaintext && plaintext.length > 0) {
                        return plaintext;
                    }
                } catch (e) {}
            }
            return null;
        },
        signVisa: function (doc) {
            var uid = this.getIdentifier();
            var barrack = this.getDataSource();
            var key = barrack.getPrivateKeyForVisaSignature(uid);
            doc.sign(key);
            return doc;
        },
        verifyVisa: function (doc) {
            var uid = this.getIdentifier();
            if (!uid.equals(doc.getIdentifier())) {
                return false;
            }
            var meta = this.getMeta();
            var key = meta.getKey();
            return doc.verify(key);
        }
    });
    ns.mkm.BaseUser = BaseUser;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Entity = ns.mkm.Entity;
    var Group = Interface(null, [Entity]);
    Group.prototype.getBulletin = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getFounder = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getOwner = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getMembers = function () {
        throw new Error("NotImplemented");
    };
    Group.prototype.getAssistants = function () {
        throw new Error("NotImplemented");
    };
    var GroupDataSource = Interface(null, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getOwner = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getMembers = function (identifier) {
        throw new Error("NotImplemented");
    };
    GroupDataSource.prototype.getAssistants = function (identifier) {
        throw new Error("NotImplemented");
    };
    Group.DataSource = GroupDataSource;
    ns.mkm.Group = Group;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Group = ns.mkm.Group;
    var BaseEntity = ns.mkm.BaseEntity;
    var BaseGroup = function (identifier) {
        BaseEntity.call(this, identifier);
        this.__founder = null;
    };
    Class(BaseGroup, BaseEntity, [Group], {
        getBulletin: function () {
            var doc = this.getDocument(Document.BULLETIN);
            if (Interface.conforms(doc, Bulletin)) {
                return doc;
            } else {
                return null;
            }
        },
        getFounder: function () {
            if (this.__founder === null) {
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
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var EntityType = ns.protocol.EntityType;
    var ID = ns.protocol.ID;
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
    Class(Barrack, Object, [Entity.Delegate, User.DataSource, Group.DataSource], {
        getBroadcastFounder: function (group) {
            var name = group_seed(group);
            if (name) {
                return ID.parse(name + ".founder@anywhere");
            } else {
                return ID.FOUNDER;
            }
        },
        getBroadcastOwner: function (group) {
            var name = group_seed(group);
            if (name) {
                return ID.parse(name + ".owner@anywhere");
            } else {
                return ID.ANYONE;
            }
        },
        getBroadcastMembers: function (group) {
            var members = [];
            var name = group_seed(group);
            if (name) {
                var owner = ID.parse(name + ".owner@anywhere");
                var member = ID.parse(name + ".member@anywhere");
                members.push(owner);
                members.push(member);
            } else {
                members.push(ID.ANYONE);
            }
            return members;
        },
        getPublicKeyForEncryption: function (identifier) {
            var key = visa_key.call(this, identifier);
            if (key) {
                return key;
            }
            key = meta_key.call(this, identifier);
            if (Interface.conforms(key, EncryptKey)) {
                return key;
            }
            return null;
        },
        getPublicKeysForVerification: function (identifier) {
            var keys = [];
            var key = visa_key.call(this, identifier);
            if (Interface.conforms(key, VerifyKey)) {
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
                    if (Meta.matchKey(mMeta.getKey(), gMeta)) {
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
            if (EntityType.GROUP.equals(group.getType())) {
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
            if (Interface.conforms(doc, Bulletin)) {
                if (doc.isValid()) {
                    return doc.getAssistants();
                }
            }
            return null;
        }
    });
    var visa_key = function (user) {
        var doc = this.getDocument(user, Document.VISA);
        if (Interface.conforms(doc, Visa)) {
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
    ns.Barrack = Barrack;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Packer = Interface(null, null);
    Packer.prototype.getOvertGroup = function (content) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.encryptMessage = function (iMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.signMessage = function (sMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.serializeMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.deserializeMessage = function (data) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.verifyMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Packer.prototype.decryptMessage = function (sMsg) {
        throw new Error("NotImplemented");
    };
    ns.Packer = Packer;
})(DIMP);
(function (ns) {
    var Interface = ns.type.Interface;
    var Processor = Interface(null, null);
    Processor.prototype.processPackage = function (data) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processReliableMessage = function (rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processSecureMessage = function (sMsg, rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processInstantMessage = function (iMsg, rMsg) {
        throw new Error("NotImplemented");
    };
    Processor.prototype.processContent = function (content, rMsg) {
        throw new Error("NotImplemented");
    };
    ns.Processor = Processor;
})(DIMP);
(function (ns) {
    var Class = ns.type.Class;
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
    Class(
        Transceiver,
        Object,
        [InstantMessage.Delegate, ReliableMessage.Delegate],
        null
    );
    Transceiver.prototype.getEntityDelegate = function () {
        throw new Error("NotImplemented");
    };
    Transceiver.prototype.isBroadcast = function (msg) {
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
        if (this.isBroadcast(iMsg)) {
            return UTF8.decode(data);
        }
        return Base64.encode(data);
    };
    Transceiver.prototype.serializeKey = function (pwd, iMsg) {
        if (this.isBroadcast(iMsg)) {
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
        if (this.isBroadcast(sMsg)) {
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
    ns.Transceiver = Transceiver;
})(DIMP);
