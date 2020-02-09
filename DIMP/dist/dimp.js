/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Jan. 28, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(ns) {
    var is_space = function(space) {
        if (typeof space.exports !== "function") {
            return false
        }
        if (typeof space.register !== "function") {
            return false
        }
        return space.__all__ instanceof Array
    };
    var register = function(name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            return true
        } else {
            return false
        }
    };
    var exports = function(outerSpace) {
        if (!is_space(outerSpace)) {
            namespace(outerSpace)
        }
        var all = this.__all__;
        var name, inner;
        for (var i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw Error("empty object: " + name)
            }
            if (is_space(inner)) {
                if (typeof outerSpace[name] !== "object") {
                    outerSpace[name] = {}
                }
                inner.exports(outerSpace[name])
            } else {
                if (outerSpace.hasOwnProperty(name)) {} else {
                    outerSpace[name] = inner
                }
            }
            outerSpace.register(name)
        }
        return outerSpace
    };
    var namespace = function(space) {
        if (!space) {
            space = {}
        }
        if (!(space.__all__ instanceof Array)) {
            space.__all__ = []
        }
        space.register = register;
        space.exports = exports;
        return space
    };
    if (typeof ns.type !== "object") {
        ns.type = {}
    }
    if (typeof ns.format !== "object") {
        ns.format = {}
    }
    if (typeof ns.digest !== "object") {
        ns.digest = {}
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = {}
    }
    namespace(ns);
    namespace(ns.type);
    namespace(ns.format);
    namespace(ns.digest);
    namespace(ns.crypto);
    ns.namespace = namespace;
    ns.register("type");
    ns.register("format");
    ns.register("digest");
    ns.register("crypto")
}(DIMP);
! function(ns) {
    var is_instance = function(object, clazz) {
        if (object instanceof clazz) {
            return true
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(clazz.prototype);
        for (var i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                return false
            }
        }
        return true
    };
    var inherit = function(clazz, protocol) {
        var prototype = protocol.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var i = 0; i < names.length; ++i) {
            var key = names[i];
            if (clazz.prototype.hasOwnProperty(key)) {
                continue
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue
            }
            clazz.prototype[key] = fn
        }
        return clazz
    };
    var inherits = function(clazz, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            clazz = inherit(clazz, interfaces[i])
        }
        return clazz
    };
    var face = function(child, parent) {
        if (!child) {
            child = function() {}
        }
        if (parent) {
            if (!(parent instanceof Array)) {
                var list = [];
                for (var i = 1; i < arguments.length; ++i) {
                    list.push(arguments[i])
                }
                parent = list
            }
            child = inherits(child, parent)
        }
        return child
    };
    var clazz = function(child, parent, interfaces) {
        if (!child) {
            child = function() {}
        }
        if (!parent) {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        inherit(child, parent);
        if (interfaces) {
            if (!(interfaces instanceof Array)) {
                var list = [];
                for (var i = 2; i < arguments.length; ++i) {
                    list.push(arguments[i])
                }
                interfaces = list
            }
            child = inherits(child, interfaces)
        }
        child.prototype.constructor = child;
        return child
    };
    var obj = clazz();
    obj.prototype.equals = function(other) {
        return this === other
    };
    obj.isinstance = is_instance;
    ns.type.Interface = face;
    ns.type.Class = clazz;
    ns.type.Object = obj;
    ns.type.register("Interface");
    ns.type.register("Class");
    ns.type.register("Object")
}(DIMP);
! function(ns) {
    var base_enum = function(value, alias) {
        ns.type.Object.call(this);
        if (value instanceof base_enum) {
            this.value = value.value
        } else {
            this.value = value
        }
        this.alias = alias
    };
    ns.type.Class(base_enum, ns.type.Object);
    base_enum.prototype.equals = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof base_enum) {
                return this.value === other.value
            } else {
                return this.value === other
            }
        }
    };
    base_enum.prototype.valueOf = function() {
        return this.value
    };
    base_enum.prototype.toString = function() {
        return "<" + this.alias.toString() + ": " + this.value.toString() + ">"
    };
    base_enum.prototype.toLocaleString = function() {
        return "<" + this.alias.toLocaleString() + ": " + this.value.toLocaleString() + ">"
    };
    base_enum.prototype.toJSON = function() {
        return this.value
    };
    var enu = function(elements) {
        var enumeration = function(value, alias) {
            if (!alias) {
                alias = get_name(value, enumeration);
                if (!alias) {
                    throw RangeError("enum error: " + value)
                }
            }
            base_enum.call(this, value, alias)
        };
        ns.type.Class(enumeration, base_enum);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue
            }
            v = elements[name];
            if (typeof v === "function") {
                continue
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    var get_name = function(value, enumeration) {
        if (value instanceof enumeration) {
            return value.alias
        }
        var e;
        for (var k in enumeration) {
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.alias
                }
            }
        }
        return null
    };
    ns.type.Enum = enu;
    ns.type.register("Enum")
}(DIMP);
! function(ns) {
    var UTF8 = {
        encode: function(str) {
            var array = [];
            var len = str.length;
            var c;
            for (var i = 0; i < len; ++i) {
                c = str.charCodeAt(i);
                if (c <= 0) {
                    break
                } else {
                    if (c < 128) {
                        array.push(c)
                    } else {
                        if (c < 2048) {
                            array.push(192 | ((c >> 6) & 31));
                            array.push(128 | ((c >> 0) & 63))
                        } else {
                            array.push(224 | ((c >> 12) & 15));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        }
                    }
                }
            }
            return array
        },
        decode: function(array) {
            var string = "";
            var len = array.length;
            var c, c2, c3;
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
                        break
                }
                string += String.fromCharCode(c)
            }
            return string
        }
    };
    var str = function(value, charset) {
        if (!value) {
            value = ""
        } else {
            if (value instanceof Array) {
                if (!charset || charset === "UTF-8") {
                    value = UTF8.decode(value)
                } else {
                    throw Error("only UTF-8 now")
                }
            } else {
                if (value instanceof str) {
                    value = value.string
                } else {
                    if (typeof value !== "string") {
                        throw Error("string value error: " + value)
                    }
                }
            }
        }
        ns.type.Object.call(this);
        this.string = value
    };
    ns.type.Class(str, ns.type.Object);
    str.prototype.getBytes = function(charset) {
        if (!charset || charset === "UTF-8") {
            return UTF8.encode(this.string)
        }
        throw Error("unknown charset: " + charset)
    };
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.string
        } else {
            if (other instanceof str) {
                return this.string === other.string
            } else {
                return this.string === other
            }
        }
    };
    var equalsIgnoreCase = function(str1, str2) {
        if (str1.length !== str2.length) {
            return false
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2
    };
    str.prototype.equalsIgnoreCase = function(other) {
        if (!other) {
            return !this.string
        } else {
            if (other instanceof str) {
                return equalsIgnoreCase(this.string, other.string)
            } else {
                return equalsIgnoreCase(this.string, other)
            }
        }
    };
    str.prototype.valueOf = function() {
        return this.string
    };
    str.prototype.toString = function() {
        return this.string
    };
    str.prototype.toLocaleString = function() {
        return this.string.toLocaleString()
    };
    str.prototype.toJSON = function() {
        return this.string
    };
    str.prototype.getLength = function() {
        return this.string.length
    };
    ns.type.String = str;
    ns.type.register("String")
}(DIMP);
! function(ns) {
    var arrays = {
        remove: function(array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                return null
            }
            return array.splice(index, 1)
        },
        equals: function(a1, a2) {
            if (a1 === a2) {
                return true
            }
            if (a1.length !== a2.length) {
                return false
            }
            for (var k in a1) {
                if (a1[k] !== a2[k]) {
                    return false
                }
            }
            return true
        }
    };
    var map = function(value) {
        if (!value) {
            value = {}
        } else {
            if (value instanceof map) {
                value = value.dictionary
            } else {
                if (value instanceof ns.type.String) {
                    value = ns.format.JSON.decode(value.toString())
                } else {
                    if (typeof value === "string") {
                        value = ns.format.JSON.decode(value)
                    }
                }
            }
        }
        ns.type.Object.call(this);
        this.dictionary = value
    };
    ns.type.Class(map, ns.type.Object);
    map.prototype.equals = function(other) {
        if (!other) {
            return !this.dictionary
        } else {
            if (other instanceof map) {
                return arrays.equals(this.dictionary, other.dictionary)
            } else {
                return arrays.equals(this.dictionary, other)
            }
        }
    };
    map.prototype.valueOf = function() {
        return this.dictionary
    };
    map.prototype.toString = function() {
        return this.dictionary.toString()
    };
    map.prototype.toLocaleString = function() {
        return this.dictionary.toLocaleString()
    };
    map.prototype.toJSON = function() {
        return this.dictionary
    };
    map.prototype.getMap = function(copy) {
        if (copy) {
            var json = ns.format.JSON.encode(this.dictionary);
            return ns.format.JSON.decode(json)
        } else {
            return this.dictionary
        }
    };
    map.prototype.allKeys = function() {
        return Object.keys(this.dictionary)
    };
    map.prototype.getValue = function(key) {
        return this.dictionary[key]
    };
    map.prototype.setValue = function(key, value) {
        if (value) {
            this.dictionary[key] = value
        } else {
            if (this.dictionary.hasOwnProperty(key)) {
                delete this.dictionary[key]
            }
        }
    };
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;
    ns.type.register("Dictionary");
    ns.type.register("Arrays")
}(DIMP);
! function(ns) {
    var hex_encode = function(data) {
        var i = 0;
        var len = data.length;
        var num;
        var str = "";
        var s;
        for (; i < len; ++i) {
            num = Number(data[i]);
            s = num.toString(16);
            if (s.length % 2) {
                str += "0" + s
            } else {
                str += s
            }
        }
        return str
    };
    var hex_decode = function(str) {
        var i = 0;
        var len = str.length;
        if (len > 2) {
            if (str[0] === "0") {
                if (str[1] === "x" || str[1] === "X") {
                    i += 2
                }
            }
        }
        var ch;
        var data = [];
        for (;
            (i + 1) < len; i += 2) {
            ch = str.substring(i, i + 2);
            data.push(parseInt(ch, 16))
        }
        return data
    };
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_values = [];
    ! function(chars, values) {
        var i;
        for (i = 0; i < 128; ++i) {
            values[i] = -1
        }
        for (i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
        values[61] = 0
    }(base64_chars, base64_values);
    var base64_encode = function(data) {
        var base64 = "";
        var length = data.length;
        var tail = "";
        var remainder = length % 3;
        if (remainder === 1) {
            length -= 1;
            tail = "=="
        } else {
            if (remainder === 2) {
                length -= 2;
                tail = "="
            }
        }
        var x1, x2, x3;
        var i;
        for (i = 0; i < length; i += 3) {
            x1 = data[i];
            x2 = data[i + 1];
            x3 = data[i + 2];
            base64 += base64_chars.charAt((x1 & 252) >> 2);
            base64 += base64_chars.charAt(((x1 & 3) << 4) | ((x2 & 240) >> 4));
            base64 += base64_chars.charAt(((x2 & 15) << 2) | ((x3 & 192) >> 6));
            base64 += base64_chars.charAt(x3 & 63)
        }
        if (remainder === 1) {
            x1 = data[i];
            base64 += base64_chars.charAt((x1 & 252) >> 2);
            base64 += base64_chars.charAt((x1 & 3) << 4)
        } else {
            if (remainder === 2) {
                x1 = data[i];
                x2 = data[i + 1];
                base64 += base64_chars.charAt((x1 & 252) >> 2);
                base64 += base64_chars.charAt(((x1 & 3) << 4) | ((x2 & 240) >> 4));
                base64 += base64_chars.charAt((x2 & 15) << 2)
            }
        }
        return base64 + tail
    };
    var base64_decode = function(string) {
        var str = string.replace(/[^A-Za-z0-9+\/=]/g, "");
        var length = str.length;
        if ((length % 4) !== 0 || !/^[A-Za-z0-9+\/]+={0,2}$/.test(str)) {
            throw Error("base64 string error: " + string)
        }
        var array = [];
        var ch1, ch2, ch3, ch4;
        var i;
        for (i = 0; i < length; i += 4) {
            ch1 = base64_values[str.charCodeAt(i)];
            ch2 = base64_values[str.charCodeAt(i + 1)];
            ch3 = base64_values[str.charCodeAt(i + 2)];
            ch4 = base64_values[str.charCodeAt(i + 3)];
            array.push(((ch1 & 63) << 2) | ((ch2 & 48) >> 4));
            array.push(((ch2 & 15) << 4) | ((ch3 & 60) >> 2));
            array.push(((ch3 & 3) << 6) | ((ch4 & 63) >> 0))
        }
        while (str[--i] === "=") {
            array.pop()
        }
        return array
    };
    var coder = function() {};
    ns.type.Interface(coder);
    coder.prototype.encode = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    coder.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var hex = function() {};
    ns.type.Class(hex, null, coder);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    var base64 = function() {};
    ns.type.Class(base64, null, coder);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    var base58 = function() {};
    ns.type.Class(base58, null, coder);
    base58.prototype.encode = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    var C = function(lib) {
        this.coder = lib
    };
    ns.type.Class(C, null, coder);
    C.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    C.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.Hex = new C(new hex());
    ns.format.Base58 = new C(new base58());
    ns.format.Base64 = new C(new base64());
    ns.format.register("BaseCoder");
    ns.format.register("Hex");
    ns.format.register("Base58");
    ns.format.register("Base64")
}(DIMP);
! function(ns) {
    var hash = function() {};
    ns.type.Interface(hash);
    hash.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var md5 = function() {};
    ns.type.Class(md5, null, hash);
    md5.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "MD5 not implemented");
        return null
    };
    var sha256 = function() {};
    ns.type.Class(sha256, null, hash);
    sha256.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "SHA256 not implemented");
        return null
    };
    var ripemd160 = function() {};
    ns.type.Class(ripemd160, null, hash);
    ripemd160.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    var H = function(lib) {
        this.hash = lib
    };
    ns.type.Class(H, null, hash);
    H.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.MD5 = new H(new md5());
    ns.digest.SHA256 = new H(new sha256());
    ns.digest.RIPEMD160 = new H(new ripemd160());
    ns.digest.register("Hash");
    ns.digest.register("MD5");
    ns.digest.register("SHA256");
    ns.digest.register("RIPEMD160")
}(DIMP);
! function(ns) {
    var parser = function() {};
    ns.type.Interface(parser);
    parser.prototype.encode = function(container) {
        console.assert(container != null, "container empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var json = function() {};
    ns.type.Class(json, null, parser);
    json.prototype.encode = function(container) {
        return JSON.stringify(container)
    };
    json.prototype.decode = function(string) {
        return JSON.parse(string)
    };
    var P = function(lib) {
        this.parser = lib
    };
    ns.type.Class(P, null, parser);
    P.prototype.encode = function(container) {
        return this.parser.encode(container)
    };
    P.prototype.decode = function(string) {
        return this.parser.decode(string)
    };
    ns.format.DataParser = parser;
    ns.format.JSON = new P(new json());
    ns.format.register("DataParser");
    ns.format.register("JSON")
}(DIMP);
! function(ns) {
    var parser = function() {};
    ns.type.Interface(parser);
    parser.prototype.encodePublicKey = function(key) {
        console.assert(key != null, "public key empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.encodePrivateKey = function(key) {
        console.assert(key != null, "private key empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decodePublicKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decodePrivateKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    var pem = function() {};
    ns.type.Class(pem, null, parser);
    pem.prototype.encodePublicKey = function(key) {
        console.assert(key != null, "public key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.encodePrivateKey = function(key) {
        console.assert(key != null, "private key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.decodePublicKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.decodePrivateKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    var P = function(lib) {
        this.parser = lib
    };
    ns.type.Class(P, null, parser);
    P.prototype.encodePublicKey = function(key) {
        return this.parser.encodePublicKey(key)
    };
    P.prototype.encodePrivateKey = function(key) {
        return this.parser.encodePrivateKey(key)
    };
    P.prototype.decodePublicKey = function(pem) {
        return this.parser.decodePublicKey(pem)
    };
    P.prototype.decodePrivateKey = function(pem) {
        return this.parser.decodePrivateKey(pem)
    };
    ns.format.KeyParser = parser;
    ns.format.PEM = new P(new pem());
    ns.format.register("KeyParser");
    ns.format.register("PEM")
}(DIMP);
! function(ns) {
    var CryptographyKey = function() {};
    ns.type.Interface(CryptographyKey);
    CryptographyKey.prototype.equals = function(other) {
        console.assert(other != null, "other key empty");
        console.assert(false, "implement me!");
        return false
    };
    CryptographyKey.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.prototype.getSize = function() {
        console.assert(false, "implement me!");
        return 0
    };
    CryptographyKey.createInstance = function(clazz, map) {
        if (typeof clazz.getInstance === "function") {
            return clazz.getInstance(map)
        } else {
            return new clazz(map)
        }
    };
    var EncryptKey = function() {};
    ns.type.Interface(EncryptKey, CryptographyKey);
    EncryptKey.prototype.encrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    ns.type.Interface(DecryptKey, CryptographyKey);
    DecryptKey.prototype.decrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var SignKey = function() {};
    ns.type.Interface(SignKey, CryptographyKey);
    SignKey.prototype.sign = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    ns.type.Interface(VerifyKey, CryptographyKey);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(data != null, "data empty");
        console.assert(signature != null, "signature empty");
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.register("EncryptKey");
    ns.crypto.register("DecryptKey");
    ns.crypto.register("SignKey");
    ns.crypto.register("VerifyKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var SymmetricKey = function() {};
    ns.type.Interface(SymmetricKey, EncryptKey, DecryptKey);
    SymmetricKey.prototype.equals = function(other) {
        var ciphertext = other.encrypt(promise);
        var plaintext = this.decrypt(ciphertext);
        return ns.type.Arrays.equals(promise, plaintext)
    };
    SymmetricKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    var key_classes = {};
    SymmetricKey.register = function(algorithm, clazz) {
        key_classes[algorithm] = clazz
    };
    SymmetricKey.getInstance = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.type.Object.isinstance(key, SymmetricKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.register("SymmetricKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function() {};
    ns.type.Interface(AsymmetricKey, CryptographyKey);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.register("AsymmetricKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var PublicKey = function() {};
    ns.type.Interface(PublicKey, AsymmetricKey, VerifyKey);
    PublicKey.prototype.matches = function(privateKey) {
        if (!privateKey) {
            return false
        }
        var publicKey = privateKey.getPublicKey();
        if (this.equals(publicKey)) {
            return true
        }
        var signature = privateKey.sign(promise);
        return this.verify(promise, signature)
    };
    var public_key_classes = {};
    PublicKey.register = function(algorithm, clazz) {
        public_key_classes[algorithm] = clazz
    };
    PublicKey.getInstance = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.type.Object.isinstance(key, PublicKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = public_key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.register("PublicKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    ns.type.Interface(PrivateKey, AsymmetricKey, SignKey);
    PrivateKey.prototype.equals = function(other) {
        var publicKey = this.getPublicKey();
        if (!publicKey) {
            return false
        }
        return publicKey.matches(other)
    };
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    var private_key_classes = {};
    PrivateKey.register = function(algorithm, clazz) {
        private_key_classes[algorithm] = clazz
    };
    PrivateKey.getInstance = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.type.Object.isinstance(key, PrivateKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = private_key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.register("PrivateKey")
}(DIMP);
if (typeof MingKeMing !== "object") {
    MingKeMing = {}
}! function(ns) {
    DIMP.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    DIMP.namespace(ns.protocol);
    ns.register("protocol")
}(MingKeMing);
! function(ns) {
    var NetworkType = ns.type.Enum({
        BTCMain: (0),
        Main: (8),
        Group: (16),
        Polylogue: (16),
        Chatroom: (48),
        Provider: (118),
        Station: (136),
        Thing: (128),
        Robot: (200)
    });
    NetworkType.prototype.toByte = function() {
        return String.fromCharCode(this.value)
    };
    NetworkType.prototype.isPerson = function() {
        return (this.value === NetworkType.Main.value) || (this.value === NetworkType.BTCMain.value)
    };
    NetworkType.prototype.isUser = function() {
        return ((this.value & NetworkType.Main.value) === NetworkType.Main.value) || (this.value === NetworkType.BTCMain.value)
    };
    NetworkType.prototype.isGroup = function() {
        return (this.value & NetworkType.Group.value) === NetworkType.Group.value
    };
    NetworkType.prototype.isStation = function() {
        return this.value === NetworkType.Station.value
    };
    NetworkType.prototype.isProvider = function() {
        return this.value === NetworkType.Provider.value
    };
    NetworkType.prototype.isThing = function() {
        return (this.value & NetworkType.Thing.value) === NetworkType.Thing.value
    };
    NetworkType.prototype.isRobot = function() {
        return this.value === NetworkType.Robot.value
    };
    ns.protocol.NetworkType = NetworkType;
    ns.protocol.register("NetworkType")
}(MingKeMing);
! function(ns) {
    var MetaType = ns.type.Enum({
        Default: (1),
        MKM: (1),
        BTC: (2),
        ExBTC: (3),
        ETH: (4),
        ExETH: (5)
    });
    MetaType.prototype.hasSeed = function() {
        return (this.value & MetaType.MKM.value) === MetaType.MKM.value
    };
    ns.protocol.MetaType = MetaType;
    ns.protocol.register("MetaType")
}(MingKeMing);
! function(ns) {
    var NetworkType = ns.protocol.NetworkType;
    var Address = function(string) {
        ns.type.String.call(this, string)
    };
    ns.type.Class(Address, ns.type.String);
    Address.prototype.getNetwork = function() {
        console.assert(false, "implement me!");
        return null
    };
    Address.prototype.getCode = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Address.prototype.isBroadcast = function() {
        var network = this.getNetwork();
        if (Address.EVERYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.EVERYWHERE)
        }
        if (Address.ANYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.ANYWHERE)
        }
        return false
    };
    var address_classes = [];
    Address.register = function(clazz) {
        address_classes.push(clazz)
    };
    Address.getInstance = function(string) {
        if (!string) {
            return null
        } else {
            if (string instanceof Address) {
                return string
            }
        }
        if (Address.ANYWHERE.equalsIgnoreCase(string)) {
            return Address.ANYWHERE
        }
        if (Address.EVERYWHERE.equalsIgnoreCase(string)) {
            return Address.EVERYWHERE
        }
        var clazz;
        for (var i = address_classes.length - 1; i >= 0; --i) {
            clazz = address_classes[i];
            try {
                var addr = new clazz(string);
                if (addr) {
                    return addr
                }
            } catch (e) {}
        }
        throw TypeError("unrecognized address: " + string)
    };
    var ConstantAddress = function(string, network, number) {
        Address.call(this, string);
        this.network = network;
        this.number = number
    };
    ns.type.Class(ConstantAddress, Address);
    ConstantAddress.prototype.getNetwork = function() {
        return this.network
    };
    ConstantAddress.prototype.getCode = function() {
        return this.number
    };
    Address.ANYWHERE = new ConstantAddress("anywhere", ns.protocol.NetworkType.Main, 9527);
    Address.EVERYWHERE = new ConstantAddress("everywhere", ns.protocol.NetworkType.Group, 9527);
    ns.Address = Address;
    ns.register("Address")
}(MingKeMing);
! function(ns) {
    var Address = ns.Address;
    var ID = function(name, address, terminal) {
        var string;
        if (name instanceof ID) {
            string = name.toString();
            address = name.address;
            terminal = name.terminal;
            name = name.name
        } else {
            if (!address) {
                string = name;
                var pair = name.split("/");
                if (pair.length === 1) {
                    terminal = null
                } else {
                    terminal = pair[1]
                }
                pair = pair[0].split("@");
                if (pair.length === 1) {
                    name = null;
                    address = Address.getInstance(pair[0])
                } else {
                    name = pair[0];
                    address = Address.getInstance(pair[1])
                }
            } else {
                address = Address.getInstance(address);
                string = address.toString();
                if (name && name.length > 0) {
                    string = name + "@" + string
                }
                if (terminal && terminal.length > 0) {
                    string = string + "/" + terminal
                }
            }
        }
        ns.type.String.call(this, string);
        this.name = name;
        this.address = address;
        this.terminal = terminal
    };
    ns.type.Class(ID, ns.type.String);
    ID.prototype.equals = function(other) {
        if (!other) {
            return false
        } else {
            if (ns.type.String.prototype.equals.call(this, other)) {
                return true
            } else {
                if (other instanceof ID) {
                    if (!this.address.equals(other.address)) {
                        return false
                    }
                    if (!this.name) {
                        return !other.name
                    } else {
                        return this.name === other.name
                    }
                }
            }
        }
        var pair = other.split("/");
        if (!this.terminal) {
            return pair[0] === this.string
        } else {
            return pair[0] === this.string.split("/")[0]
        }
    };
    ID.prototype.getType = function() {
        return this.address.getNetwork()
    };
    ID.prototype.getNumber = function() {
        return this.address.getCode()
    };
    ID.prototype.isValid = function() {
        return this.getNumber() > 0
    };
    ID.prototype.isBroadcast = function() {
        return this.address.isBroadcast()
    };
    ID.ANYONE = new ID("anyone", Address.ANYWHERE);
    ID.EVERYONE = new ID("everyone", Address.EVERYWHERE);
    ID.getInstance = function(string) {
        if (!string) {
            return null
        } else {
            if (string instanceof ID) {
                return string
            }
        }
        return new ID(string)
    };
    ns.ID = ID;
    ns.register("ID")
}(MingKeMing);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;
    var Base64 = ns.format.Base64;
    var MetaType = ns.protocol.MetaType;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.Address;
    var ID = ns.ID;
    var Meta = function(map) {
        Dictionary.call(this, map);
        this.version = new MetaType(map["version"]);
        this.key = PublicKey.getInstance(map["key"]);
        if (this.version.hasSeed()) {
            this.seed = map["seed"];
            this.fingerprint = Base64.decode(map["fingerprint"])
        } else {
            this.seed = null;
            this.fingerprint = null
        }
        this.status = 0
    };
    ns.type.Class(Meta, Dictionary);
    Meta.prototype.equals = function(other) {
        if (!other) {
            return false
        } else {
            if (Dictionary.prototype.equals.call(this, other)) {
                return true
            }
        }
        other = Meta.getInstance(other);
        var identifier = other.generateIdentifier(NetworkType.Main);
        return this.matches(identifier)
    };
    Meta.prototype.isValid = function() {
        if (this.status === 0) {
            if (!this.key) {
                this.status = -1
            } else {
                if (this.version.hasSeed()) {
                    if (!this.seed || !this.fingerprint) {
                        this.status = -1
                    } else {
                        var data = (new ns.type.String(this.seed)).getBytes();
                        var signature = this.fingerprint;
                        if (this.key.verify(data, signature)) {
                            this.status = 1
                        } else {
                            this.status = -1
                        }
                    }
                } else {
                    this.status = 1
                }
            }
        }
        return this.status === 1
    };
    var match_public_key = function(publicKey) {
        if (this.key.equals(publicKey)) {
            return true
        }
        if (this.version.hasSeed()) {
            var data = (new ns.type.String(this.seed)).getBytes();
            var signature = this.fingerprint;
            return publicKey.verify(data, signature)
        } else {
            return false
        }
    };
    var match_identifier = function(identifier) {
        return this.generateIdentifier(identifier.getType()).equals(identifier)
    };
    var match_address = function(address) {
        return this.generateAddress(address.getNetwork()).equals(address)
    };
    Meta.prototype.matches = function(key_id_addr) {
        if (!this.isValid()) {
            return false
        }
        if (key_id_addr instanceof ID) {
            return match_identifier.call(this, key_id_addr)
        } else {
            if (key_id_addr instanceof Address) {
                return match_address.call(this, key_id_addr)
            } else {
                if (ns.type.Object.isinstance(key_id_addr, PublicKey)) {
                    return match_public_key.call(this, key_id_addr)
                }
            }
        }
        return false
    };
    Meta.prototype.generateIdentifier = function(network) {
        var address = this.generateAddress(network);
        return new ID(this.seed, address)
    };
    Meta.prototype.generateAddress = function(network) {
        console.assert(network instanceof NetworkType, "network error: " + network);
        console.assert(false, "implement me!");
        return null
    };
    Meta.generate = function(version, privateKey, seed) {
        var meta = {
            "version": version,
            "key": privateKey.getPublicKey()
        };
        if (!(version instanceof MetaType)) {
            version = new MetaType(version)
        }
        if (version.hasSeed()) {
            var data = (new ns.type.String(seed)).getBytes();
            var fingerprint = privateKey.sign(data);
            meta["seed"] = seed;
            meta["fingerprint"] = Base64.encode(fingerprint)
        }
        return Meta.getInstance(meta)
    };
    var meta_classes = {};
    Meta.register = function(version, clazz) {
        if (version instanceof MetaType) {
            version = version.value
        }
        meta_classes[version] = clazz
    };
    Meta.getInstance = function(meta) {
        if (!meta) {
            return null
        } else {
            if (meta instanceof Meta) {
                return meta
            }
        }
        var version = meta["version"];
        if (version instanceof MetaType) {
            version = version.value
        }
        var clazz = meta_classes[version];
        if (typeof clazz !== "function") {
            throw TypeError("meta not supported: " + meta)
        }
        if (typeof clazz.getInstance === "function") {
            return clazz.getInstance(meta)
        }
        return new clazz(meta)
    };
    ns.Meta = Meta;
    ns.register("Meta")
}(MingKeMing);
! function(ns) {
    var TAI = function() {};
    ns.type.Interface(TAI);
    TAI.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.getIdentifier = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.allPropertyNames = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getProperty = function(name) {
        console.assert(name !== null, "property name empty");
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.setProperty = function(name, value) {
        console.assert(name !== null, "property name empty");
        console.assert(value !== null, "property value empty");
        console.assert(false, "implement me!")
    };
    TAI.prototype.verify = function(publicKey) {
        console.assert(publicKey !== null, "public key empty");
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.sign = function(privateKey) {
        console.assert(privateKey !== null, "private key empty");
        console.assert(false, "implement me!");
        return null
    };
    var Dictionary = ns.type.Dictionary;
    var Base64 = ns.format.Base64;
    var JSON = ns.format.JSON;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.ID;
    var Profile = function(info) {
        if (!info) {
            info = {}
        } else {
            if (typeof info === "string" || info instanceof ID) {
                info = {
                    "ID": info
                }
            }
        }
        Dictionary.call(this, info);
        this.identifier = null;
        this.key = null;
        this.data = null;
        this.signature = null;
        this.properties = null;
        this.status = 0
    };
    ns.type.Class(Profile, Dictionary, TAI);
    Profile.prototype.isValid = function() {
        return this.status >= 0
    };
    Profile.prototype.getIdentifier = function() {
        if (!this.identifier) {
            this.identifier = this.getValue("ID")
        }
        return this.identifier
    };
    Profile.prototype.getData = function() {
        if (!this.data) {
            var string = this.getValue("data");
            if (string) {
                var str = new ns.type.String(string);
                this.data = str.getBytes()
            }
        }
        return this.data
    };
    Profile.prototype.getSignature = function() {
        if (!this.signature) {
            var base64 = this.getValue("signature");
            if (base64) {
                this.signature = Base64.decode(base64)
            }
        }
        return this.signature
    };
    Profile.prototype.getProperties = function() {
        if (this.status < 0) {
            return null
        }
        if (!this.properties) {
            var string = this.getValue("data");
            if (string) {
                this.properties = JSON.decode(string)
            } else {
                this.properties = {}
            }
        }
        return this.properties
    };
    Profile.prototype.allPropertyNames = function() {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return Object.keys(dict)
    };
    Profile.prototype.getProperty = function(name) {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return dict[name]
    };
    Profile.prototype.setProperty = function(name, value) {
        this.status = 0;
        var dict = this.getProperties();
        dict[name] = value;
        this.setValue("data", null);
        this.setValue("signature", null);
        this.data = null;
        this.signature = null
    };
    Profile.prototype.verify = function(publicKey) {
        if (this.status > 0) {
            return true
        }
        var data = this.getData();
        var signature = this.getSignature();
        if (!data) {
            if (!signature) {
                this.status = 0
            } else {
                this.status = -1
            }
        } else {
            if (!signature) {
                this.status = -1
            } else {
                if (publicKey.verify(data, signature)) {
                    this.status = 1
                }
            }
        }
        return this.status > 0
    };
    Profile.prototype.sign = function(privateKey) {
        if (this.status > 0) {
            return this.signature
        }
        this.status = 1;
        var string = JSON.encode(this.getProperties());
        var str = new ns.type.String(string);
        this.data = str.getBytes();
        this.signature = privateKey.sign(this.data);
        this.setValue("data", string);
        this.setValue("signature", Base64.encode(this.signature));
        return this.signature
    };
    Profile.prototype.getName = function() {
        return this.getProperty("name")
    };
    Profile.prototype.setName = function(name) {
        this.setProperty("name", name)
    };
    Profile.prototype.getKey = function() {
        if (!this.key) {
            var key = this.getProperty("key");
            if (key) {
                this.key = PublicKey.getInstance(key)
            }
        }
        return this.key
    };
    Profile.prototype.setKey = function(publicKey) {
        this.key = publicKey;
        this.setProperty("key", publicKey)
    };
    var tai_classes = [];
    Profile.register = function(clazz) {
        tai_classes.push(clazz)
    };
    Profile.getInstance = function(dict) {
        if (!dict) {
            return null
        } else {
            if (dict instanceof Profile) {
                return dict
            }
        }
        var clazz;
        for (var i = tai_classes.length - 1; i >= 0; --i) {
            clazz = tai_classes[i];
            try {
                var tai = new clazz(dict);
                if (tai) {
                    return tai
                }
            } catch (e) {}
        }
        return new Profile(dict)
    };
    ns.Profile = Profile;
    ns.register("Profile")
}(MingKeMing);
! function(ns) {
    var EntityDataSource = function() {};
    ns.type.Interface(EntityDataSource);
    EntityDataSource.prototype.getMeta = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    EntityDataSource.prototype.getProfile = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    ns.EntityDataSource = EntityDataSource;
    ns.register("EntityDataSource")
}(MingKeMing);
! function(ns) {
    var EntityDataSource = ns.EntityDataSource;
    var UserDataSource = function() {};
    ns.type.Interface(UserDataSource, EntityDataSource);
    UserDataSource.prototype.getContacts = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        return null
    };
    UserDataSource.prototype.getPublicKeysForVerification = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        return null
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    ns.UserDataSource = UserDataSource;
    ns.register("UserDataSource")
}(MingKeMing);
! function(ns) {
    var EntityDataSource = ns.EntityDataSource;
    var GroupDataSource = function() {};
    ns.type.Interface(GroupDataSource, EntityDataSource);
    GroupDataSource.prototype.getFounder = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getOwner = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getMembers = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    ns.GroupDataSource = GroupDataSource;
    ns.register("GroupDataSource")
}(MingKeMing);
! function(ns) {
    var Entity = function(identifier) {
        this.identifier = identifier;
        this.delegate = null
    };
    ns.type.Class(Entity);
    Entity.prototype.equals = function(other) {
        if (this === other) {
            return true
        } else {
            if (other instanceof Entity) {
                return this.identifier.equals(other.identifier)
            } else {
                return false
            }
        }
    };
    Entity.prototype.valueOf = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + " (" + this.getNumber() + ")" + ' "' + this.getName() + '">'
    };
    Entity.prototype.toString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType().toString() + " " + this.identifier + " (" + this.getNumber().toString() + ")" + ' "' + this.getName() + '">'
    };
    Entity.prototype.toLocaleString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType().toLocaleString() + " " + this.identifier + " (" + this.getNumber().toLocaleString() + ")" + ' "' + this.getName() + '">'
    };
    Entity.prototype.getType = function() {
        return this.identifier.getType()
    };
    Entity.prototype.getNumber = function() {
        return this.identifier.getNumber()
    };
    Entity.prototype.getName = function() {
        var profile = this.getProfile();
        if (profile) {
            var name = profile.getName();
            if (name) {
                return name
            }
        }
        return this.identifier.name
    };
    Entity.prototype.getMeta = function() {
        return this.delegate.getMeta(this.identifier)
    };
    Entity.prototype.getProfile = function() {
        return this.delegate.getProfile(this.identifier)
    };
    ns.Entity = Entity;
    ns.register("Entity")
}(MingKeMing);
! function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var Entity = ns.Entity;
    var User = function(identifier) {
        Entity.call(this, identifier)
    };
    ns.type.Class(User, Entity);
    User.prototype.getContacts = function() {
        return this.delegate.getContacts(this.identifier)
    };
    var meta_key = function() {
        var meta = this.getMeta();
        return meta.key
    };
    var profile_key = function() {
        var profile = this.getProfile();
        if (!profile || !profile.isValid()) {
            return null
        }
        return profile.getKey()
    };
    var encrypt_key = function() {
        var key = this.delegate.getPublicKeyForEncryption(this.identifier);
        if (key) {
            return key
        }
        key = profile_key.call(this);
        if (key) {
            return key
        }
        key = meta_key.call(this);
        if (key && ns.type.Object.isinstance(key, EncryptKey)) {
            return key
        }
        throw Error("failed to get encrypt key for user: " + this.identifier)
    };
    var verify_keys = function() {
        var keys = this.delegate.getPublicKeysForVerification(this.identifier);
        if (keys && keys.length > 0) {
            return keys
        }
        keys = [];
        var key = profile_key.call(this);
        if (key && ns.type.Object.isinstance(key, VerifyKey)) {
            keys.push(key)
        }
        key = meta_key.call(this);
        keys.push(key);
        return keys
    };
    User.prototype.verify = function(data, signature) {
        var keys = verify_keys.call(this);
        if (keys) {
            for (var i = 0; i < keys.length; ++i) {
                if (keys[i].verify(data, signature)) {
                    return true
                }
            }
        }
        return false
    };
    User.prototype.encrypt = function(plaintext) {
        var key = encrypt_key.call(this);
        if (!key) {
            throw Error("failed to get encrypt key for user: " + this.identifier)
        }
        return key.encrypt(plaintext)
    };
    var sign_key = function() {
        return this.delegate.getPrivateKeyForSignature(this.identifier)
    };
    var decrypt_keys = function() {
        return this.delegate.getPrivateKeysForDecryption(this.identifier)
    };
    User.prototype.sign = function(data) {
        var key = sign_key.call(this);
        return key.sign(data)
    };
    User.prototype.decrypt = function(ciphertext) {
        var plaintext;
        var keys = decrypt_keys.call(this);
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    return plaintext
                }
            } catch (e) {}
        }
        return null
    };
    ns.User = User;
    ns.register("User")
}(MingKeMing);
! function(ns) {
    var Entity = ns.Entity;
    var Group = function(identifier) {
        Entity.call(this, identifier);
        this.founder = null
    };
    ns.type.Class(Group, Entity);
    Group.prototype.getFounder = function() {
        if (!this.founder) {
            this.founder = this.delegate.getFounder(this.identifier)
        }
        return this.founder
    };
    Group.prototype.getOwner = function() {
        return this.delegate.getOwner(this.identifier)
    };
    Group.prototype.getMembers = function() {
        return this.delegate.getMembers(this.identifier)
    };
    ns.Group = Group;
    ns.register("Group")
}(MingKeMing);
if (typeof DaoKeDao !== "object") {
    DaoKeDao = {}
}! function(ns) {
    DIMP.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    DIMP.namespace(ns.protocol);
    ns.register("protocol")
}(DaoKeDao);
! function(ns) {
    var ContentType = ns.type.Enum({
        UNKNOWN: (0),
        TEXT: (1),
        FILE: (16),
        IMAGE: (18),
        AUDIO: (20),
        VIDEO: (22),
        PAGE: (32),
        QUOTE: (55),
        MONEY: (64),
        COMMAND: (136),
        HISTORY: (137),
        FORWARD: (255)
    });
    ns.protocol.ContentType = ContentType;
    ns.protocol.register("ContentType")
}(DaoKeDao);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var ContentType = ns.protocol.ContentType;
    var MAX_LONG = 4294967295;
    var randomPositiveInteger = function() {
        var sn = Math.ceil(Math.random() * MAX_LONG);
        if (sn > 0) {
            return sn
        } else {
            if (sn < 0) {
                return -sn
            }
        }
        return 9527 + 9394
    };
    var Content = function(info) {
        if ((typeof info === "number") || info instanceof ContentType) {
            info = {
                "type": info,
                "sn": randomPositiveInteger()
            }
        }
        Dictionary.call(this, info);
        this.type = new ContentType(info["type"]);
        this.sn = info["sn"]
    };
    ns.type.Class(Content, Dictionary);
    Content.prototype.getGroup = function() {
        return this.getValue("group")
    };
    Content.prototype.setGroup = function(identifier) {
        this.setValue("group", identifier)
    };
    var content_classes = {};
    Content.register = function(type, clazz) {
        if (type instanceof ContentType) {
            type = type.value
        }
        content_classes[type] = clazz
    };
    Content.getInstance = function(content) {
        if (!content) {
            return null
        } else {
            if (content instanceof Content) {
                return content
            }
        }
        var type = content["type"];
        if (type instanceof ContentType) {
            type = type.value
        }
        var clazz = content_classes[type];
        if (typeof clazz === "function") {
            return Content.createInstance(clazz, content)
        }
        return new Content(content)
    };
    Content.createInstance = function(clazz, map) {
        if (typeof clazz.getInstance === "function") {
            return clazz.getInstance(map)
        } else {
            return new clazz(map)
        }
    };
    ns.Content = Content;
    ns.register("Content")
}(DaoKeDao);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var ContentType = ns.protocol.ContentType;
    var Envelope = function(env) {
        Dictionary.call(this, env);
        this.sender = env["sender"];
        this.receiver = env["receiver"];
        this.time = env["time"]
    };
    ns.type.Class(Envelope, Dictionary);
    Envelope.newEnvelope = function(sender, receiver, time) {
        var env = {
            "sender": sender,
            "receiver": receiver
        };
        if (!time) {
            time = new Date();
            env["time"] = Math.ceil(time.getTime() / 1000)
        } else {
            if (time instanceof Date) {
                env["time"] = Math.ceil(time.getTime() / 1000)
            } else {
                env["time"] = time
            }
        }
        return new Envelope(env)
    };
    Envelope.getInstance = function(env) {
        if (!env) {
            return null
        } else {
            if (env instanceof Envelope) {
                return env
            }
        }
        return new Envelope(env)
    };
    Envelope.prototype.getGroup = function() {
        return this.getValue("group")
    };
    Envelope.prototype.setGroup = function(identifier) {
        this.setValue("group", identifier)
    };
    Envelope.prototype.getType = function() {
        var type = this.getValue("type");
        if (type) {
            return new ContentType(type)
        } else {
            return null
        }
    };
    Envelope.prototype.setType = function(type) {
        this.setValue("type", type)
    };
    ns.Envelope = Envelope;
    ns.register("Envelope")
}(DaoKeDao);
! function(ns) {
    var MessageDelegate = function() {};
    ns.type.Interface(MessageDelegate);
    var InstantMessageDelegate = function() {};
    ns.type.Interface(InstantMessageDelegate, MessageDelegate);
    InstantMessageDelegate.prototype.encryptContent = function(content, pwd, msg) {
        console.assert(content !== null, "content empty");
        console.assert(pwd !== null, "key empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encodeData = function(data, msg) {
        console.assert(data !== null, "msg data empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encryptKey = function(pwd, receiver, msg) {
        console.assert(pwd !== null, "key empty");
        console.assert(receiver !== null, "receiver empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encodeKey = function(key, msg) {
        console.assert(key !== null, "key data empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    var SecureMessageDelegate = function() {};
    ns.type.Interface(SecureMessageDelegate, MessageDelegate);
    SecureMessageDelegate.prototype.decodeKey = function(key, msg) {
        console.assert(key !== null, "key string empty");
        console.assert(msg !== null, "secure message empty");
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decryptKey = function(key, sender, receiver, msg) {
        console.assert(key !== null, "key data empty");
        console.assert(sender !== null, "sender empty");
        console.assert(receiver !== null, "receiver empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decodeData = function(data, msg) {
        console.assert(data !== null, "msg data empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decryptContent = function(data, pwd, msg) {
        console.assert(data !== null, "msg data empty");
        console.assert(pwd !== null, "key empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.signData = function(data, sender, msg) {
        console.assert(data !== null, "msg data empty");
        console.assert(sender !== null, "sender empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.encodeSignature = function(signature, msg) {
        console.assert(signature !== null, "msg signature empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    var ReliableMessageDelegate = function() {};
    ns.type.Interface(ReliableMessageDelegate, SecureMessageDelegate);
    ReliableMessageDelegate.prototype.decodeSignature = function(signature, msg) {
        console.assert(msg !== null, "msg empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessageDelegate.prototype.verifyDataSignature = function(data, signature, sender, msg) {
        console.assert(msg !== null, "msg empty");
        console.assert(msg !== null, "msg empty");
        console.assert(msg !== null, "msg empty");
        console.assert(msg !== null, "msg empty");
        console.assert(false, "implement me!");
        return false
    };
    ns.InstantMessageDelegate = InstantMessageDelegate;
    ns.SecureMessageDelegate = SecureMessageDelegate;
    ns.ReliableMessageDelegate = ReliableMessageDelegate;
    ns.register("InstantMessageDelegate");
    ns.register("SecureMessageDelegate");
    ns.register("ReliableMessageDelegate")
}(DaoKeDao);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.Envelope;
    var Message = function(msg) {
        Dictionary.call(this, msg);
        this.envelope = Envelope.getInstance(msg);
        this.delegate = null
    };
    ns.type.Class(Message, Dictionary);
    Message.getInstance = function(msg) {
        if (!msg) {
            return null
        }
        if (msg.hasOwnProperty("content")) {
            return ns.InstantMessage.getInstance(msg)
        }
        if (msg.hasOwnProperty("signature")) {
            return ns.ReliableMessage.getInstance(msg)
        }
        if (msg.hasOwnProperty("data")) {
            return ns.SecureMessage.getInstance(msg)
        }
        if (msg instanceof Message) {
            return msg
        }
        return new Message(msg)
    };
    ns.Message = Message;
    ns.register("Message")
}(DaoKeDao);
! function(ns) {
    var Envelope = ns.Envelope;
    var Content = ns.Content;
    var Message = ns.Message;
    var InstantMessage = function(msg) {
        Message.call(this, msg);
        this.content = Content.getInstance(msg["content"])
    };
    ns.type.Class(InstantMessage, Message);
    InstantMessage.newMessage = function(content, envelope) {
        envelope = Envelope.getInstance(envelope);
        var msg = envelope.getMap(true);
        msg["content"] = content;
        return new InstantMessage(msg)
    };
    InstantMessage.getInstance = function(msg) {
        if (!msg) {
            return null
        }
        if (msg instanceof InstantMessage) {
            return msg
        }
        return new InstantMessage(msg)
    };
    InstantMessage.prototype.encrypt = function(password, members) {
        var msg = this.getMap(true);
        var data = this.delegate.encryptContent(this.content, password, this);
        msg["data"] = this.delegate.encodeData(data, this);
        delete msg["content"];
        var key;
        if (members && members.length > 0) {
            var keys = {};
            var member;
            for (var i = 0; i < members.length; ++i) {
                member = members[i];
                key = this.delegate.encryptKey(password, member, this);
                if (key) {
                    keys[member] = this.delegate.encodeKey(key, this)
                }
            }
            if (keys.length > 0) {
                msg["keys"] = keys
            }
            msg["group"] = this.content.getGroup()
        } else {
            var receiver = this.envelope.receiver;
            key = this.delegate.encryptKey(password, receiver, this);
            if (key) {
                msg["key"] = this.delegate.encodeKey(key, this)
            }
        }
        return new ns.SecureMessage(msg)
    };
    ns.InstantMessage = InstantMessage;
    ns.register("InstantMessage")
}(DaoKeDao);
! function(ns) {
    var Message = ns.Message;
    var SecureMessage = function(msg) {
        Message.call(this, msg)
    };
    ns.type.Class(SecureMessage, Message);
    SecureMessage.prototype.getData = function() {
        var base64 = this.getValue("data");
        return this.delegate.decodeData(base64, this)
    };
    SecureMessage.prototype.getKey = function() {
        var base64 = this.getValue("key");
        if (!base64) {
            var keys = this.getKeys();
            if (keys) {
                base64 = keys[this.envelope.receiver]
            }
        }
        if (base64) {
            return this.delegate.decodeKey(base64, this)
        } else {
            return null
        }
    };
    SecureMessage.prototype.getKeys = function() {
        return this.getValue("keys")
    };
    SecureMessage.getInstance = function(msg) {
        if (!msg) {
            return null
        }
        if (msg.hasOwnProperty("signature")) {
            return ns.ReliableMessage.getInstance(msg)
        }
        if (msg instanceof SecureMessage) {
            return msg
        }
        return new SecureMessage(msg)
    };
    SecureMessage.prototype.decrypt = function() {
        var sender = this.envelope.sender;
        var receiver = this.envelope.receiver;
        var group = this.envelope.getGroup();
        var key = this.getKey();
        var password;
        if (group) {
            password = this.delegate.decryptKey(key, sender, group, this)
        } else {
            password = this.delegate.decryptKey(key, sender, receiver, this)
        }
        var data = this.getData();
        var content = this.delegate.decryptContent(data, password, this);
        if (!content) {
            throw Error("failed to decrypt message data: " + this)
        }
        var msg = this.getMap(true);
        delete msg["key"];
        delete msg["keys"];
        delete msg["data"];
        msg["content"] = content;
        return new ns.InstantMessage(msg)
    };
    SecureMessage.prototype.sign = function() {
        var sender = this.envelope.sender;
        var signature = this.delegate.signData(this.getData(), sender, this);
        var base64 = this.delegate.encodeSignature(signature, this);
        var msg = this.getMap(true);
        msg["signature"] = base64;
        return new ns.ReliableMessage(msg)
    };
    SecureMessage.prototype.split = function(members) {
        var reliable = this instanceof ns.ReliableMessage;
        var keys = this.getKeys();
        var group = this.envelope.receiver;
        var messages = [];
        var msg;
        var receiver;
        for (var i = 0; i < members.length; ++i) {
            receiver = members[i];
            msg = this.getMap(true);
            msg["receiver"] = receiver;
            msg["group"] = group;
            if (keys) {
                delete msg["keys"];
                msg["key"] = keys[receiver]
            }
            if (reliable) {
                messages.push(new ns.ReliableMessage(msg))
            } else {
                messages.push(new SecureMessage(msg))
            }
        }
        return messages
    };
    SecureMessage.prototype.trim = function(member) {
        var msg = this.getMap(true);
        msg["receiver"] = member;
        var keys = this.getKeys();
        if (keys) {
            var base64 = keys[member];
            if (base64) {
                msg["key"] = base64
            }
            delete msg["keys"]
        }
        var group = this.envelope.getGroup();
        if (!group) {
            msg["group"] = this.envelope.receiver
        }
        var reliable = this instanceof ns.ReliableMessage;
        if (reliable) {
            return new ns.ReliableMessage(msg)
        } else {
            return new SecureMessage(msg)
        }
    };
    ns.SecureMessage = SecureMessage;
    ns.register("SecureMessage")
}(DaoKeDao);
! function(ns) {
    var SecureMessage = ns.SecureMessage;
    var ReliableMessage = function(msg) {
        SecureMessage.call(this, msg)
    };
    ns.type.Class(ReliableMessage, SecureMessage);
    ReliableMessage.prototype.getSignature = function() {
        var base64 = this.getValue("signature");
        return this.delegate.decodeSignature(base64, this)
    };
    ReliableMessage.prototype.setMeta = function(meta) {
        this.setValue("meta", meta)
    };
    ReliableMessage.prototype.getMeta = function() {
        return this.getValue("meta")
    };
    ReliableMessage.getInstance = function(msg) {
        if (!msg) {
            return null
        }
        if (msg instanceof ReliableMessage) {
            return msg
        }
        return new ReliableMessage(msg)
    };
    ReliableMessage.prototype.verify = function() {
        var sender = this.envelope.sender;
        var data = this.getData();
        var signature = this.getSignature();
        if (this.delegate.verifyDataSignature(data, signature, sender, this)) {
            var msg = this.getMap(true);
            delete msg["signature"];
            return new SecureMessage(msg)
        } else {
            return null
        }
    };
    ns.ReliableMessage = ReliableMessage;
    ns.register("ReliableMessage")
}(DaoKeDao);
! function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.Content;
    var Message = ns.Message;
    var ForwardContent = function(info) {
        var secret = null;
        if (!info) {
            info = ContentType.FORWARD
        } else {
            if (info instanceof Message) {
                secret = info;
                info = ContentType.FORWARD
            }
        }
        Content.call(this, info);
        if (secret) {
            this.setMessage(secret)
        } else {
            if (info.hasOwnProperty("forward")) {
                this.getMessage()
            } else {
                this.forward = null
            }
        }
    };
    ns.type.Class(ForwardContent, Content);
    ForwardContent.prototype.getMessage = function() {
        if (!this.forward) {
            var forward = this.getValue("forward");
            this.forward = Message.getInstance(forward)
        }
        return this.forward
    };
    ForwardContent.prototype.setMessage = function(secret) {
        this.setValue("forward", secret);
        this.forward = secret
    };
    Content.register(ContentType.FORWARD, ForwardContent);
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.register("ForwardContent")
}(DaoKeDao);
! function(ns) {
    DaoKeDao.exports(ns);
    MingKeMing.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    if (typeof ns.plugins !== "object") {
        ns.plugins = {}
    }
    if (typeof ns.core !== "object") {
        ns.core = {}
    }
    DIMP.namespace(ns.protocol);
    DIMP.namespace(ns.plugins);
    DIMP.namespace(ns.core);
    ns.register("protocol");
    ns.register("plugins");
    ns.register("core")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var TextContent = function(content) {
        var text = null;
        if (!content) {
            content = ContentType.TEXT
        } else {
            if (typeof content === "string") {
                text = content;
                content = ContentType.TEXT
            }
        }
        Content.call(this, content);
        if (text) {
            this.setText(text)
        }
    };
    ns.type.Class(TextContent, Content);
    TextContent.prototype.getText = function() {
        return this.getValue("text")
    };
    TextContent.prototype.setText = function(text) {
        this.setValue("text", text)
    };
    Content.register(ContentType.TEXT, TextContent);
    ns.protocol.TextContent = TextContent;
    ns.protocol.register("TextContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var PageContent = function(content) {
        var url = null;
        if (!content) {
            content = ContentType.PAGE
        } else {
            if (typeof content === "string") {
                url = content;
                content = ContentType.PAGE
            }
        }
        Content.call(this, content);
        if (url) {
            this.setURL(url)
        }
        this.icon = null
    };
    ns.type.Class(PageContent, Content);
    PageContent.prototype.getURL = function() {
        return this.getValue("URL")
    };
    PageContent.prototype.setURL = function(url) {
        this.setValue("URL", url)
    };
    PageContent.prototype.getTitle = function() {
        return this.getValue("title")
    };
    PageContent.prototype.setTitle = function(text) {
        this.setValue("title", text)
    };
    PageContent.prototype.getDesc = function() {
        return this.getValue("desc")
    };
    PageContent.prototype.setDesc = function(text) {
        this.setValue("desc", text)
    };
    PageContent.prototype.getIcon = function() {
        if (!this.icon) {
            var base64 = this.getValue("icon");
            if (base64) {
                this.icon = ns.format.Base64.decode(base64)
            }
        }
        return this.icon
    };
    PageContent.prototype.setIcon = function(data) {
        var base64 = null;
        if (data) {
            base64 = ns.format.Base64.encode(data)
        }
        this.setValue("icon", base64);
        this.icon = data
    };
    Content.register(ContentType.PAGE, PageContent);
    ns.protocol.PageContent = PageContent;
    ns.protocol.register("PageContent")
}(DIMP);
! function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = function(content) {
        if (!content) {
            content = ContentType.FILE
        }
        Content.call(this, content);
        this.attachment = null;
        this.password = null
    };
    ns.type.Class(FileContent, Content);
    FileContent.prototype.getURL = function() {
        return this.getValue("URL")
    };
    FileContent.prototype.setURL = function(url) {
        this.setValue("URL", url)
    };
    FileContent.prototype.getFilename = function() {
        return this.getValue("filename")
    };
    FileContent.prototype.setFilename = function(filename) {
        this.setValue("filename", filename)
    };
    var file_ext = function() {
        var filename = this.getFilename();
        if (!filename) {
            return null
        }
        var pos = filename.lastIndexOf(".");
        if (pos < 0) {
            return null
        }
        return filename.substring(pos + 1)
    };
    var md5 = function(data) {
        var hash = ns.digest.MD5.digest(data);
        return ns.format.Hex.encode(hash)
    };
    FileContent.prototype.getData = function() {
        return this.attachment
    };
    FileContent.prototype.setData = function(data) {
        if (data && data.length > 0) {
            var filename = md5(data);
            var ext = file_ext.call(this);
            if (ext) {
                filename = filename + "." + ext
            }
            this.setValue("filename", filename)
        }
        this.attachment = data
    };
    FileContent.prototype.getPassword = function() {
        if (!this.password) {
            var key = this.getValue("password");
            if (key) {
                this.password = SymmetricKey.getInstance(key)
            }
        }
        return this.password
    };
    FileContent.prototype.setPassword = function(key) {
        this.setValue("password", key);
        this.password = key
    };
    Content.register(ContentType.FILE, FileContent);
    ns.protocol.FileContent = FileContent;
    ns.protocol.register("FileContent")
}(DIMP);
! function(ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function(content) {
        if (!content) {
            content = ContentType.IMAGE
        }
        FileContent.call(this, content);
        this.thumbnail = null
    };
    ns.type.Class(ImageContent, FileContent);
    ImageContent.prototype.getThumbnail = function() {
        if (!this.thumbnail) {
            var base64 = this.getValue("thumbnail");
            if (base64) {
                this.thumbnail = Base64.decode(base64)
            }
        }
        return this.thumbnail
    };
    ImageContent.prototype.setThumbnail = function(image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue("thumbnail", base64)
        } else {
            this.setValue("thumbnail", null)
        }
        this.thumbnail = image
    };
    Content.register(ContentType.IMAGE, ImageContent);
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.register("ImageContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var AudioContent = function(content) {
        if (!content) {
            content = ContentType.AUDIO
        }
        FileContent.call(this, content)
    };
    ns.type.Class(AudioContent, FileContent);
    AudioContent.prototype.getText = function() {
        return this.getValue("text")
    };
    AudioContent.prototype.setText = function(asr) {
        this.setValue("text", asr)
    };
    Content.register(ContentType.AUDIO, AudioContent);
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.register("AudioContent")
}(DIMP);
! function(ns) {
    var Base64 = ns.format.Base64;
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var VideoContent = function(content) {
        if (!content) {
            content = ContentType.VIDEO
        }
        FileContent.call(this, content);
        this.snapshot = null
    };
    ns.type.Class(VideoContent, FileContent);
    VideoContent.prototype.getSnapshot = function() {
        if (!this.snapshot) {
            var base64 = this.getValue("snapshot");
            if (base64) {
                this.snapshot = Base64.decode(base64)
            }
        }
        return this.snapshot
    };
    VideoContent.prototype.setSnapshot = function(image) {
        if (image) {
            var base64 = Base64.encode(image);
            this.setValue("snapshot", base64)
        } else {
            this.setValue("snapshot", null)
        }
        this.snapshot = image
    };
    Content.register(ContentType.VIDEO, VideoContent);
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.register("VideoContent")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = function(info) {
        var name = null;
        if (!info) {
            info = ContentType.COMMAND
        } else {
            if (typeof info === "string") {
                name = info;
                info = ContentType.COMMAND
            }
        }
        Content.call(this, info);
        if (name) {
            this.setCommand(name)
        }
    };
    ns.type.Class(Command, Content);
    Command.prototype.getCommand = function() {
        return this.getValue("command")
    };
    Command.prototype.setCommand = function(name) {
        this.setValue("command", name)
    };
    Command.HANDSHAKE = "handshake";
    Command.RECEIPT = "receipt";
    Command.META = "meta";
    Command.PROFILE = "profile";
    var command_classes = {};
    Command.register = function(name, clazz) {
        command_classes[name] = clazz
    };
    Command.getClass = function(cmd) {
        if (typeof cmd === "string") {
            return command_classes[cmd]
        }
        var command = cmd["command"];
        if (!command) {
            return null
        }
        return command_classes[command]
    };
    Command.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof Command) {
                return cmd
            }
        }
        var clazz = Command.getClass(cmd);
        if (typeof clazz === "function") {
            return Content.createInstance(clazz, cmd)
        }
        return new Command(cmd)
    };
    Content.register(ContentType.COMMAND, Command);
    ns.protocol.Command = Command;
    ns.protocol.register("Command")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Meta = ns.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function(info) {
        var identifier = null;
        if (!info) {
            info = Command.META
        } else {
            if (info instanceof ID) {
                identifier = info;
                info = Command.META
            }
        }
        Command.call(this, info);
        if (identifier) {
            this.setIdentifier(identifier)
        }
        this.meta = null
    };
    ns.type.Class(MetaCommand, Command);
    MetaCommand.prototype.getIdentifier = function() {
        return this.getValue("ID")
    };
    MetaCommand.prototype.setIdentifier = function(identifier) {
        this.setValue("ID", identifier)
    };
    MetaCommand.prototype.getMeta = function() {
        if (!this.meta) {
            var dict = this.getValue("meta");
            this.meta = Meta.getInstance(dict)
        }
        return this.meta
    };
    MetaCommand.prototype.setMeta = function(meta) {
        this.setValue("meta", meta);
        this.meta = meta
    };
    MetaCommand.query = function(identifier) {
        return new MetaCommand(identifier)
    };
    MetaCommand.response = function(identifier, meta) {
        var cmd = new MetaCommand(identifier);
        cmd.setMeta(meta);
        return cmd
    };
    Command.register(Command.META, MetaCommand);
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.register("MetaCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Profile = ns.Profile;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var ProfileCommand = function(info) {
        var identifier = null;
        if (!info) {
            info = Command.PROFILE
        } else {
            if (info instanceof ID) {
                identifier = info;
                info = Command.PROFILE
            }
        }
        MetaCommand.call(this, info);
        if (identifier) {
            this.setIdentifier(identifier)
        }
        this.profile = null
    };
    ns.type.Class(ProfileCommand, MetaCommand);
    ProfileCommand.prototype.getProfile = function() {
        if (!this.profile) {
            var info = this.getValue("profile");
            if (typeof info === "string") {
                info = {
                    "ID": this.getIdentifier(),
                    "data": info,
                    "signature": this.getValue("signature")
                }
            } else {}
            this.profile = Profile.getInstance(info)
        }
        return this.profile
    };
    ProfileCommand.prototype.setProfile = function(profile) {
        this.setValue("profile", profile);
        this.profile = profile
    };
    ProfileCommand.prototype.getSignature = function() {
        return this.getValue("signature")
    };
    ProfileCommand.prototype.setSignature = function(base64) {
        this.setValue("signature", base64)
    };
    ProfileCommand.query = function(identifier, signature) {
        var cmd = new ProfileCommand(identifier);
        if (signature) {
            cmd.setSignature(signature)
        }
        return cmd
    };
    ProfileCommand.response = function(identifier, profile, meta) {
        var cmd = new ProfileCommand(identifier);
        cmd.setProfile(profile);
        if (meta) {
            cmd.setMeta(meta)
        }
        return cmd
    };
    Command.register(Command.PROFILE, ProfileCommand);
    ns.protocol.ProfileCommand = ProfileCommand;
    ns.protocol.register("ProfileCommand")
}(DIMP);
! function(ns) {
    var HandshakeState = ns.type.Enum({
        INIT: 0,
        START: 1,
        AGAIN: 2,
        RESTART: 3,
        SUCCESS: 4
    });
    var Command = ns.protocol.Command;
    var HandshakeCommand = function(info) {
        var message = null;
        if (!info) {
            info = Command.HANDSHAKE
        } else {
            if (typeof info === "string") {
                message = info;
                info = Command.HANDSHAKE
            }
        }
        Command.call(this, info);
        if (message) {
            this.setMessage(message)
        }
    };
    ns.type.Class(HandshakeCommand, Command);
    HandshakeCommand.prototype.getMessage = function() {
        return this.getValue("message")
    };
    HandshakeCommand.prototype.setMessage = function(text) {
        this.setValue("message", text)
    };
    HandshakeCommand.prototype.getSessionKey = function() {
        return this.getValue("session")
    };
    HandshakeCommand.prototype.setSessionKey = function(session) {
        this.setValue("session", session)
    };
    HandshakeCommand.prototype.getState = function() {
        var text = this.getMessage();
        var session = this.getSessionKey();
        if (!text) {
            return HandshakeState.INIT
        }
        if (text === "DIM?") {
            return HandshakeState.AGAIN
        }
        if (text === "DIM!" || text === "OK!") {
            return HandshakeState.SUCCESS
        }
        if (session) {
            return HandshakeState.RESTART
        } else {
            return HandshakeState.START
        }
    };
    var handshake = function(text, session) {
        var cmd = new HandshakeCommand(text);
        if (session) {
            cmd.setSessionKey(session)
        }
        return cmd
    };
    HandshakeCommand.start = function() {
        return handshake("Hello world!")
    };
    HandshakeCommand.restart = function(session) {
        return handshake("Hello world!", session)
    };
    HandshakeCommand.again = function(session) {
        return handshake("DIM?", session)
    };
    HandshakeCommand.success = function() {
        return handshake("DIM!")
    };
    Command.register(Command.HANDSHAKE, HandshakeCommand);
    ns.protocol.HandshakeCommand = HandshakeCommand;
    ns.protocol.HandshakeState = HandshakeState;
    ns.protocol.register("HandshakeCommand");
    ns.protocol.register("HandshakeState")
}(DIMP);
! function(ns) {
    var Content = ns.Content;
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var HistoryCommand = function(info) {
        var name = null;
        var time = null;
        if (!info) {
            time = new Date();
            info = ContentType.HISTORY
        } else {
            if (typeof info === "string") {
                name = info;
                time = new Date();
                info = ContentType.HISTORY
            }
        }
        Command.call(this, info);
        if (name) {
            this.setCommand(name)
        }
        if (time) {
            this.setTime(time)
        }
    };
    ns.type.Class(HistoryCommand, Command);
    HistoryCommand.prototype.getTime = function() {
        var time = this.getValue("time");
        if (time) {
            return new Date(time * 1000)
        } else {
            return null
        }
    };
    HistoryCommand.prototype.setTime = function(time) {
        if (!time) {
            time = new Date()
        }
        if (time instanceof Date) {
            this.setValue("time", time.getTime() / 1000)
        } else {
            if (typeof time === "number") {
                this.setValue("time", time)
            } else {
                throw TypeError("time error: " + time)
            }
        }
    };
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    HistoryCommand.FOUND = "found";
    HistoryCommand.ABDICATE = "abdicate";
    HistoryCommand.INVITE = "invite";
    HistoryCommand.EXPEL = "expel";
    HistoryCommand.JOIN = "join";
    HistoryCommand.QUIT = "quit";
    HistoryCommand.QUERY = "query";
    HistoryCommand.RESET = "reset";
    HistoryCommand.HIRE = "hire";
    HistoryCommand.FIRE = "fire";
    HistoryCommand.RESIGN = "resign";
    HistoryCommand.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof HistoryCommand) {
                return cmd
            }
        }
        if (cmd.hasOwnProperty("group")) {
            return ns.GroupCommand.getInstance(cmd)
        }
        return new HistoryCommand(cmd)
    };
    Content.register(ContentType.HISTORY, HistoryCommand);
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.register("HistoryCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Content = ns.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function(info) {
        var group = null;
        if (info instanceof ID) {
            group = info;
            info = null
        }
        HistoryCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(GroupCommand, HistoryCommand);
    GroupCommand.prototype.getGroup = function() {
        return Content.prototype.getGroup.call(this)
    };
    GroupCommand.prototype.setGroup = function(identifier) {
        Content.prototype.setGroup.call(this, identifier)
    };
    GroupCommand.prototype.getMember = function() {
        return this.getValue("member")
    };
    GroupCommand.prototype.setMember = function(identifier) {
        this.setValue("member", identifier)
    };
    GroupCommand.prototype.getMembers = function() {
        return this.getValue("members")
    };
    GroupCommand.prototype.setMembers = function(identifier) {
        this.setValue("members", identifier)
    };
    GroupCommand.FOUND = HistoryCommand.FOUND;
    GroupCommand.ABDICATE = HistoryCommand.ABDICATE;
    GroupCommand.INVITE = HistoryCommand.INVITE;
    GroupCommand.EXPEL = HistoryCommand.EXPEL;
    GroupCommand.JOIN = HistoryCommand.JOIN;
    GroupCommand.QUIT = HistoryCommand.QUIT;
    GroupCommand.QUERY = HistoryCommand.QUERY;
    GroupCommand.RESET = HistoryCommand.RESET;
    GroupCommand.HIRE = HistoryCommand.HIRE;
    GroupCommand.FIRE = HistoryCommand.FIRE;
    GroupCommand.RESIGN = HistoryCommand.RESIGN;
    GroupCommand.register = function(name, clazz) {
        Command.register(name, clazz)
    };
    GroupCommand.getClass = function(cmd) {
        return Command.getClass(cmd)
    };
    GroupCommand.getInstance = function(cmd) {
        if (!cmd) {
            return null
        } else {
            if (cmd instanceof GroupCommand) {
                return cmd
            }
        }
        var clazz = GroupCommand.getClass(cmd);
        if (typeof clazz === "function") {
            return Content.createInstance(clazz, cmd)
        }
        return new GroupCommand(cmd)
    };
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.register("GroupCommand")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.INVITE
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.INVITE
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(InviteCommand, GroupCommand);
    var ExpelCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.EXPEL
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.EXPEL
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(ExpelCommand, GroupCommand);
    var JoinCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.JOIN
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.JOIN
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(JoinCommand, GroupCommand);
    var QuitCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.QUIT
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.QUIT
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(QuitCommand, GroupCommand);
    var ResetCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.RESET
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.RESET
            }
        }
        GroupCommand.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(ResetCommand, GroupCommand);
    var QueryCommand = function(info) {
        var group = null;
        if (!info) {
            info = GroupCommand.QUERY
        } else {
            if (typeof info === "string" || info instanceof ID) {
                group = info;
                info = GroupCommand.QUERY
            }
        }
        Command.call(this, info);
        if (group) {
            this.setGroup(group)
        }
    };
    ns.type.Class(QueryCommand, Command);
    GroupCommand.invite = function(group, member) {
        var cmd = new InviteCommand(group);
        if (typeof member === "string" || member instanceof ID) {
            cmd.setMember(member)
        } else {
            cmd.setMembers(member)
        }
        return cmd
    };
    GroupCommand.expel = function(group, member) {
        var cmd = new ExpelCommand(group);
        if (typeof member === "string" || member instanceof ID) {
            cmd.setMember(member)
        } else {
            cmd.setMembers(member)
        }
        return cmd
    };
    GroupCommand.join = function(group) {
        return new JoinCommand(group)
    };
    GroupCommand.quit = function(group) {
        return new QuitCommand(group)
    };
    GroupCommand.reset = function(group, member) {
        var cmd = new ResetCommand(group);
        if (typeof member === "string" || member instanceof ID) {
            cmd.setMember(member)
        } else {
            cmd.setMembers(member)
        }
        return cmd
    };
    GroupCommand.query = function(group) {
        return new QueryCommand(group)
    };
    GroupCommand.register(GroupCommand.INVITE, InviteCommand);
    GroupCommand.register(GroupCommand.EXPEL, ExpelCommand);
    GroupCommand.register(GroupCommand.JOIN, JoinCommand);
    GroupCommand.register(GroupCommand.QUIT, QuitCommand);
    GroupCommand.register(GroupCommand.RESET, ResetCommand);
    GroupCommand.register(GroupCommand.QUERY, QueryCommand);
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = {}
    }
    DIMP.namespace(ns.protocol.group);
    ns.protocol.register("group");
    ns.protocol.group.InviteCommand = InviteCommand;
    ns.protocol.group.ExpelCommand = ExpelCommand;
    ns.protocol.group.JoinCommand = JoinCommand;
    ns.protocol.group.QuitCommand = QuitCommand;
    ns.protocol.group.ResetCommand = ResetCommand;
    ns.protocol.group.QueryCommand = QueryCommand;
    ns.protocol.group.register("InviteCommand");
    ns.protocol.group.register("ExpelCommand");
    ns.protocol.group.register("JoinCommand");
    ns.protocol.group.register("QuitCommand");
    ns.protocol.group.register("ResetCommand");
    ns.protocol.group.register("QueryCommand")
}(DIMP);
! function(ns) {
    var EntityDelegate = function() {};
    ns.type.Interface(EntityDelegate);
    EntityDelegate.prototype.getIdentifier = function(string) {
        console.assert(string !== null, "ID string empty");
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getUser = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getGroup = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    ns.EntityDelegate = EntityDelegate;
    ns.register("EntityDelegate")
}(DIMP);
! function(ns) {
    var CipherKeyDelegate = function() {};
    ns.type.Interface(CipherKeyDelegate);
    CipherKeyDelegate.prototype.getCipherKey = function(sender, receiver) {
        console.assert(sender !== null, "sender empty");
        console.assert(receiver !== null, "receiver empty");
        console.assert(false, "implement me!");
        return null
    };
    CipherKeyDelegate.prototype.cacheCipherKey = function(sender, receiver, key) {
        console.assert(sender !== null, "sender empty");
        console.assert(receiver !== null, "receiver empty");
        console.assert(key !== null, "key empty");
        console.assert(false, "implement me!")
    };
    CipherKeyDelegate.prototype.reuseCipherKey = function(sender, receiver, key) {
        console.assert(sender !== null, "sender empty");
        console.assert(receiver !== null, "receiver empty");
        console.assert(key !== null, "key empty");
        console.assert(false, "implement me!");
        return null
    };
    ns.CipherKeyDelegate = CipherKeyDelegate;
    ns.register("CipherKeyDelegate")
}(DIMP);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var PlainKey = function(key) {
        Dictionary.call(this, key)
    };
    ns.type.Class(PlainKey, Dictionary, SymmetricKey);
    PlainKey.prototype.encrypt = function(data) {
        return data
    };
    PlainKey.prototype.decrypt = function(data) {
        return data
    };
    var plain_key = null;
    PlainKey.getInstance = function() {
        if (!plain_key) {
            var key = {
                "algorithm": PlainKey.PLAIN
            };
            plain_key = new PlainKey(key)
        }
        return plain_key
    };
    PlainKey.PLAIN = "PLAIN";
    SymmetricKey.register(PlainKey.PLAIN, PlainKey);
    ns.plugins.PlainKey = PlainKey
}(DIMP);
! function(ns) {
    var CipherKeyDelegate = ns.CipherKeyDelegate;
    var KeyCache = function() {
        this.keyMap = {};
        this.isDirty = false
    };
    ns.type.Class(KeyCache, null, CipherKeyDelegate);
    KeyCache.prototype.reload = function() {
        var map = this.loadKeys();
        if (!map) {
            return false
        }
        return this.updateKeys(map)
    };
    KeyCache.prototype.flush = function() {
        if (this.isDirty) {
            if (this.saveKeys(this.keyMap)) {
                this.isDirty = false
            }
        }
    };
    KeyCache.prototype.saveKeys = function(map) {
        console.assert(map !== null, "map empty");
        console.assert(false, "implement me!");
        return false
    };
    KeyCache.prototype.loadKeys = function() {
        console.assert(false, "implement me!");
        return null
    };
    KeyCache.prototype.updateKeys = function(map) {
        if (!map) {
            return false
        }
        var changed = false;
        var sender, receiver;
        var oldKey, newKey;
        var table;
        for (sender in map) {
            if (!map.hasOwnProperty(sender)) {
                continue
            }
            table = map[sender];
            for (receiver in table) {
                if (!table.hasOwnProperty(receiver)) {
                    continue
                }
                newKey = table[receiver];
                oldKey = get_key.call(this, sender, receiver);
                if (oldKey !== newKey) {
                    changed = true
                }
                set_key.call(this, sender, receiver, newKey)
            }
        }
        return changed
    };
    var get_key = function(sender, receiver) {
        var table = this.keyMap[sender];
        if (table) {
            return table[receiver]
        } else {
            return null
        }
    };
    var set_key = function(sender, receiver, key) {
        var table = this.keyMap[sender];
        if (!table) {
            table = {};
            this.keyMap[sender] = table
        }
        table[receiver] = key
    };
    KeyCache.prototype.getCipherKey = function(sender, receiver) {
        if (receiver.isBroadcast()) {
            return ns.plugins.PlainKey.getInstance()
        }
        return get_key.call(this, sender, receiver)
    };
    KeyCache.prototype.cacheCipherKey = function(sender, receiver, key) {
        if (receiver.isBroadcast()) {} else {
            set_key.call(this, sender, receiver, key);
            this.isDirty = true
        }
    };
    KeyCache.prototype.reuseCipherKey = function(sender, receiver, key) {
        if (key) {
            this.cacheCipherKey(sender, receiver, key);
            return key
        } else {
            return this.getCipherKey(sender, receiver)
        }
    };
    ns.core.KeyCache = KeyCache;
    ns.core.register("KeyCache")
}(DIMP);
! function(ns) {
    var ID = ns.ID;
    var User = ns.User;
    var Group = ns.Group;
    var EntityDelegate = ns.EntityDelegate;
    var UserDataSource = ns.UserDataSource;
    var GroupDataSource = ns.GroupDataSource;
    var Barrack = function() {
        this.idMap = {};
        this.metaMap = {};
        this.userMap = {};
        this.groupMap = {}
    };
    ns.type.Class(Barrack, null, EntityDelegate, UserDataSource, GroupDataSource);
    var thanos = function(map, finger) {
        var keys = Object.keys(map);
        for (var i = 0; i < keys.length; ++i) {
            var p = map[keys[i]];
            if (typeof p === "function") {
                continue
            }
            if ((++finger & 1) === 1) {
                delete map[p]
            }
        }
        return finger
    };
    Barrack.prototype.reduceMemory = function() {
        var finger = 0;
        finger = thanos(this.idMap, finger);
        finger = thanos(this.metaMap, finger);
        finger = thanos(this.userMap, finger);
        finger = thanos(this.groupMap, finger);
        return finger >> 1
    };
    Barrack.prototype.cacheIdentifier = function(identifier) {
        this.idMap[identifier.toString()] = identifier;
        return true
    };
    Barrack.prototype.cacheMeta = function(meta, identifier) {
        this.metaMap[identifier] = meta;
        return true
    };
    Barrack.prototype.cacheUser = function(user) {
        if (!user.delegate) {
            user.delegate = this
        }
        this.userMap[user.identifier] = user;
        return true
    };
    Barrack.prototype.cacheGroup = function(group) {
        if (!group.delegate) {
            group.delegate = this
        }
        this.groupMap[group.identifier] = group;
        return true
    };
    Barrack.prototype.createIdentifier = function(string) {
        return ID.getInstance(string)
    };
    Barrack.prototype.createUser = function(identifier) {
        return new User(identifier)
    };
    Barrack.prototype.createGroup = function(identifier) {
        return new Group(identifier)
    };
    Barrack.prototype.getIdentifier = function(string) {
        if (!string || string instanceof ID) {
            return string
        }
        var identifier = this.idMap[string];
        if (identifier) {
            return identifier
        }
        identifier = this.createIdentifier(string);
        if (identifier && this.cacheIdentifier(identifier)) {
            return identifier
        }
        return null
    };
    Barrack.prototype.getUser = function(identifier) {
        var user = this.userMap[identifier];
        if (user) {
            return user
        }
        user = this.createUser(identifier);
        if (user && this.cacheUser(user)) {
            return user
        }
        return null
    };
    Barrack.prototype.getGroup = function(identifier) {
        var group = this.groupMap[identifier];
        if (group) {
            return group
        }
        group = this.createGroup(identifier);
        if (group && this.cacheGroup(group)) {
            return group
        }
        return null
    };
    Barrack.prototype.getMeta = function(identifier) {
        return this.metaMap[identifier]
    };
    Barrack.prototype.getPublicKeyForEncryption = function(identifier) {
        console.assert(identifier.getType().isUser(), "user ID error");
        return null
    };
    Barrack.prototype.getPublicKeysForVerification = function(identifier) {
        console.assert(identifier.getType().isUser(), "user ID error");
        return null
    };
    Barrack.prototype.getFounder = function(identifier) {
        if (identifier.isBroadcast()) {
            var founder;
            var name = identifier.name;
            if (!name || name === "everyone") {
                founder = "moky@anywhere"
            } else {
                founder = name + ".founder@anywhere"
            }
            return this.getIdentifier(founder)
        }
        return null
    };
    Barrack.prototype.getOwner = function(identifier) {
        if (identifier.isBroadcast()) {
            var owner;
            var name = identifier.name;
            if (!name || name === "everyone") {
                owner = "anyone@anywhere"
            } else {
                owner = name + ".owner@anywhere"
            }
            return this.getIdentifier(owner)
        }
        return null
    };
    Barrack.prototype.getMembers = function(identifier) {
        if (identifier.isBroadcast()) {
            var member;
            var name = identifier.name;
            if (!name || name === "everyone") {
                member = "anyone@anywhere"
            } else {
                member = name + ".member@anywhere"
            }
            var list = [];
            var owner = this.getOwner(identifier);
            if (owner) {
                list.push(owner)
            }
            member = this.getIdentifier(member);
            if (member && !member.equals(owner)) {
                list.push(member)
            }
            return list
        }
        return null
    };
    ns.core.Barrack = Barrack;
    ns.core.register("Barrack")
}(DIMP);
! function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.Content;
    var InstantMessage = ns.InstantMessage;
    var ReliableMessage = ns.ReliableMessage;
    var InstantMessageDelegate = ns.InstantMessageDelegate;
    var SecureMessageDelegate = ns.SecureMessageDelegate;
    var ReliableMessageDelegate = ns.ReliableMessageDelegate;
    var Transceiver = function() {
        this.entityDelegate = null;
        this.cipherKeyDelegate = null
    };
    ns.type.Class(Transceiver, null, InstantMessageDelegate, SecureMessageDelegate, ReliableMessageDelegate);
    var get_key = function(sender, receiver) {
        var key = this.cipherKeyDelegate.getCipherKey(sender, receiver);
        if (!key) {
            key = SymmetricKey.generate(SymmetricKey.AES);
            this.cipherKeyDelegate.cacheCipherKey(sender, receiver, key)
        }
        return key
    };
    var is_broadcast_msg = function(msg) {
        var receiver;
        if (msg instanceof InstantMessage) {
            receiver = msg.content.getGroup()
        } else {
            receiver = msg.envelope.getGroup()
        }
        if (!receiver) {
            receiver = msg.envelope.receiver
        }
        receiver = this.entityDelegate.getIdentifier(receiver);
        return receiver && receiver.isBroadcast()
    };
    Transceiver.prototype.encryptMessage = function(msg) {
        var sender = this.entityDelegate.getIdentifier(msg.envelope.sender);
        var receiver = this.entityDelegate.getIdentifier(msg.envelope.receiver);
        var group = this.entityDelegate.getIdentifier(msg.content.getGroup());
        var password;
        if (group) {
            password = get_key.call(this, sender, group)
        } else {
            password = get_key.call(this, sender, receiver)
        }
        if (!msg.delegate) {
            msg.delegate = this
        }
        var sMsg;
        if (receiver.getType().isGroup()) {
            var members = this.entityDelegate.getMembers(receiver);
            sMsg = msg.encrypt(password, members)
        } else {
            sMsg = msg.encrypt(password)
        }
        return sMsg
    };
    Transceiver.prototype.signMessage = function(msg) {
        if (!msg.delegate) {
            msg.delegate = this
        }
        return msg.sign()
    };
    Transceiver.prototype.verifyMessage = function(msg) {
        if (!msg.delegate) {
            msg.delegate = this
        }
        return msg.verify()
    };
    Transceiver.prototype.decryptMessage = function(msg) {
        if (!msg.delegate) {
            msg.delegate = this
        }
        return msg.decrypt()
    };
    Transceiver.prototype.serializeContent = function(content, msg) {
        var json = ns.format.JSON.encode(content);
        var str = new ns.type.String(json);
        return str.getBytes("UTF-8")
    };
    Transceiver.prototype.serializeKey = function(password, msg) {
        var json = ns.format.JSON.encode(password);
        var str = new ns.type.String(json);
        return str.getBytes("UTF-8")
    };
    Transceiver.prototype.serializeMessage = function(msg) {
        var json = ns.format.JSON.encode(msg);
        var str = new ns.type.String(json);
        return str.getBytes("UTF-8")
    };
    Transceiver.prototype.deserializeMessage = function(data) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return ReliableMessage.getInstance(dict)
    };
    Transceiver.prototype.deserializeKey = function(data, msg) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return SymmetricKey.getInstance(dict)
    };
    Transceiver.prototype.deserializeContent = function(data, msg) {
        var str = new ns.type.String(data, "UTF-8");
        var dict = ns.format.JSON.decode(str.toString());
        return Content.getInstance(dict)
    };
    Transceiver.prototype.encryptContent = function(content, pwd, msg) {
        var key = SymmetricKey.getInstance(pwd);
        if (key) {
            var data = this.serializeContent(content, msg);
            return key.encrypt(data)
        } else {
            throw Error("key error: " + pwd)
        }
    };
    Transceiver.prototype.encodeData = function(data, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            var str = new ns.type.String(data, "UTF-8");
            return str.toString
        }
        return ns.format.Base64.encode(data)
    };
    Transceiver.prototype.encryptKey = function(pwd, receiver, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            return null
        }
        var key = SymmetricKey.getInstance(pwd);
        var data = this.serializeKey(key, msg);
        receiver = this.entityDelegate.getIdentifier(receiver);
        var contact = this.entityDelegate.getUser(receiver);
        if (contact) {
            return contact.encrypt(data)
        } else {
            throw Error("failed to get encrypt key for receiver: " + receiver)
        }
    };
    Transceiver.prototype.encodeKey = function(key, msg) {
        return ns.format.Base64.encode(key)
    };
    Transceiver.prototype.decodeKey = function(key, msg) {
        return ns.format.Base64.decode(key)
    };
    Transceiver.prototype.decryptKey = function(key, sender, receiver, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        receiver = this.entityDelegate.getIdentifier(receiver);
        var password = null;
        if (key) {
            var identifier = msg.envelope.receiver;
            identifier = this.entityDelegate.getIdentifier(identifier);
            var user = this.entityDelegate.getUser(identifier);
            if (!user) {
                throw Error("failed to get decrypt keys: " + identifier)
            }
            var plaintext = user.decrypt(key);
            if (!plaintext) {
                throw Error("failed to decrypt key in msg: " + msg)
            }
            password = this.deserializeKey(plaintext, msg)
        }
        return this.cipherKeyDelegate.reuseCipherKey(sender, receiver, password)
    };
    Transceiver.prototype.decodeData = function(data, msg) {
        if (is_broadcast_msg.call(this, msg)) {
            var str = new ns.type.String(data);
            return str.getBytes("UTF-8")
        }
        return ns.format.Base64.decode(data)
    };
    Transceiver.prototype.decryptContent = function(data, pwd, msg) {
        var key = SymmetricKey.getInstance(pwd);
        if (!key) {
            return null
        }
        var plaintext = key.decrypt(data);
        if (!plaintext) {
            return null
        }
        return this.deserializeContent(plaintext, msg)
    };
    Transceiver.prototype.signData = function(data, sender, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var user = this.entityDelegate.getUser(sender);
        if (user) {
            return user.sign(data)
        } else {
            throw Error("failed to get sign key for sender: " + sender)
        }
    };
    Transceiver.prototype.encodeSignature = function(signature, msg) {
        return ns.format.Base64.encode(signature)
    };
    Transceiver.prototype.decodeSignature = function(signature, msg) {
        return ns.format.Base64.decode(signature)
    };
    Transceiver.prototype.verifyDataSignature = function(data, signature, sender, msg) {
        sender = this.entityDelegate.getIdentifier(sender);
        var contact = this.entityDelegate.getUser(sender);
        if (contact) {
            return contact.verify(data, signature)
        } else {
            throw Error("failed to get verify key for sender: " + sender)
        }
    };
    ns.core.Transceiver = Transceiver;
    ns.core.register("Transceiver")
}(DIMP);
