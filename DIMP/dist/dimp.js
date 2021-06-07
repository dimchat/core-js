/**
 * DIMP - Decentralized Instant Messaging Protocol (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 4, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== "object") {
    MONKEY = {}
}
(function(ns) {
    var namespacefy = function(space) {
        if (!space) {
            space = new namespace()
        } else {
            if (!is_space(space)) {
                space.__all__ = [];
                space.register = namespace.prototype.register;
                space.exports = namespace.prototype.exports
            }
        }
        return space
    };
    var is_space = function(space) {
        if (space instanceof namespace) {
            return true
        }
        if (typeof space.exports !== "function") {
            return false
        }
        if (typeof space.register !== "function") {
            return false
        }
        return space.__all__ instanceof Array
    };
    var namespace = function() {
        this.__all__ = []
    };
    namespace.prototype.register = function(name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            return true
        } else {
            return false
        }
    };
    namespace.prototype.exports = function(outerSpace) {
        namespacefy(outerSpace);
        var all = this.__all__;
        var name, inner;
        for (var i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw new Error("empty object: " + name)
            }
            if (is_space(inner)) {
                if (typeof outerSpace[name] !== "object") {
                    outerSpace[name] = new namespace()
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
    ns.Namespace = namespacefy;
    namespacefy(ns);
    ns.register("Namespace")
})(MONKEY);
(function(ns) {
    if (typeof ns.type !== "object") {
        ns.type = {}
    }
    if (typeof ns.threading !== "object") {
        ns.threading = {}
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
    ns.Namespace(ns.type);
    ns.Namespace(ns.threading);
    ns.Namespace(ns.format);
    ns.Namespace(ns.digest);
    ns.Namespace(ns.crypto);
    ns.register("type");
    ns.register("threading");
    ns.register("format");
    ns.register("digest");
    ns.register("crypto")
})(MONKEY);
(function(ns) {
    var conforms = function(object, protocol) {
        if (!object) {
            return false
        }
        if (object instanceof protocol) {
            return true
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(protocol.prototype);
        for (var i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                return false
            }
        }
        return true
    };
    var inherits = function(child, parent) {
        var prototype = parent.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            if (child.prototype.hasOwnProperty(key)) {
                continue
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue
            }
            child.prototype[key] = fn
        }
        return child
    };
    var inherits_interfaces = function(child, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            child = inherits(child, interfaces[i])
        }
        return child
    };
    var interfacefy = function(child, parents) {
        if (!child) {
            child = function() {}
        }
        if (parents) {
            var ancestors;
            if (parents instanceof Array) {
                ancestors = parents
            } else {
                ancestors = [];
                for (var i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits_interfaces(child, ancestors)
        }
        return child
    };
    interfacefy.conforms = conforms;
    var classify = function(child, parent, interfaces) {
        if (!child) {
            child = function() {}
        }
        if (!parent) {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        inherits(child, parent);
        if (interfaces) {
            var ancestors;
            if (interfaces instanceof Array) {
                ancestors = interfaces
            } else {
                ancestors = [];
                for (var i = 2; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits_interfaces(child, ancestors)
        }
        child.prototype.constructor = child;
        return child
    };
    ns.Interface = interfacefy;
    ns.Class = classify;
    ns.register("Interface");
    ns.register("Class")
})(MONKEY);
(function(ns) {
    var is_null = function(object) {
        if (typeof object === "undefined") {
            return true
        } else {
            return object === null
        }
    };
    var is_base_type = function(object) {
        var t = typeof object;
        if (t === "string" || t === "number" || t === "boolean" || t === "function") {
            return true
        }
        if (object instanceof String) {
            return true
        }
        if (object instanceof Number) {
            return true
        }
        if (object instanceof Boolean) {
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
    var obj = function() {};
    ns.Class(obj, Object, null);
    obj.isNull = is_null;
    obj.isBaseType = is_base_type;
    obj.prototype.equals = function(other) {
        return this === other
    };
    ns.type.Object = obj;
    ns.type.register("Object")
})(MONKEY);
(function(ns) {
    var is_array = function(obj) {
        if (obj instanceof Array) {
            return true
        } else {
            if (obj instanceof Uint8Array) {
                return true
            } else {
                if (obj instanceof Int8Array) {
                    return true
                } else {
                    if (obj instanceof Uint8ClampedArray) {
                        return true
                    } else {
                        if (obj instanceof Uint16Array) {
                            return true
                        } else {
                            if (obj instanceof Int16Array) {
                                return true
                            } else {
                                if (obj instanceof Uint32Array) {
                                    return true
                                } else {
                                    if (obj instanceof Int32Array) {
                                        return true
                                    } else {
                                        if (obj instanceof Float32Array) {
                                            return true
                                        } else {
                                            if (obj instanceof Float64Array) {
                                                return true
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
        return false
    };
    var arrays_equal = function(array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!objects_equal(array1[i], array2[i])) {
                return false
            }
        }
        return true
    };
    var maps_equal = function(dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        var len1 = keys1.length;
        var len2 = keys2.length;
        if (len1 !== len2) {
            return false
        }
        var k;
        for (var i = 0; i < len1; ++i) {
            k = keys1[i];
            if (!objects_equal(dict1[k], dict2[k])) {
                return false
            }
        }
        return true
    };
    var objects_equal = function(obj1, obj2) {
        if (obj1 === obj2) {
            return true
        } else {
            if (!obj1) {
                return !obj2
            } else {
                if (!obj2) {
                    return false
                } else {
                    if (typeof obj1 === "string" || typeof obj2 === "string") {
                        return false
                    } else {
                        if (typeof obj1["equals"] === "function") {
                            return obj1.equals(obj2)
                        } else {
                            if (typeof obj2["equals"] === "function") {
                                return obj2.equals(obj1)
                            }
                        }
                    }
                }
            }
        }
        if (is_array(obj1)) {
            if (is_array(obj2)) {
                return arrays_equal(obj1, obj2)
            } else {
                return false
            }
        } else {
            if (is_array(obj2)) {
                return false
            }
        }
        return maps_equal(obj1, obj2)
    };
    var copy_items = function(src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length)
        }
        dest.set(src, destPos)
    };
    var insert_item = function(array, index, item) {
        if (index < 0) {
            index += array.length + 1;
            if (index < 0) {
                return false
            }
        }
        if (index === 0) {
            array.unshift(item)
        } else {
            if (index === array.length) {
                array.push(item)
            } else {
                if (index > array.length) {
                    array[index] = item
                } else {
                    array.splice(index, 0, item)
                }
            }
        }
        return true
    };
    var update_item = function(array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false
            }
        }
        array[index] = item;
        return true
    };
    var remove_item = function(array, item) {
        var index = array.indexOf(item);
        if (index < 0) {
            return false
        } else {
            if (index === 0) {
                array.shift()
            } else {
                if ((index + 1) === array.length) {
                    array.pop()
                } else {
                    array.splice(index, 1)
                }
            }
        }
        return true
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    };
    ns.type.register("Arrays")
})(MONKEY);
(function(ns) {
    var get_alias = function(value) {
        var enumeration = this.constructor;
        var e;
        for (var k in enumeration) {
            if (!enumeration.hasOwnProperty(k)) {
                continue
            }
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.__alias
                }
            }
        }
        return null
    };
    var base_enum = function(value, alias) {
        ns.type.Object.call(this);
        if (!alias) {
            if (value instanceof base_enum) {
                alias = value.__alias
            } else {
                alias = get_alias.call(this, value)
            }
        }
        if (value instanceof base_enum) {
            value = value.__value
        }
        this.__value = value;
        this.__alias = alias
    };
    ns.Class(base_enum, ns.type.Object, null);
    base_enum.prototype.equals = function(other) {
        if (!other) {
            return !this.__value
        } else {
            if (other instanceof base_enum) {
                return this.__value === other.valueOf()
            } else {
                return this.__value === other
            }
        }
    };
    base_enum.prototype.valueOf = function() {
        return this.__value
    };
    base_enum.prototype.toString = function() {
        return "<" + this.__alias.toString() + ": " + this.__value.toString() + ">"
    };
    var enumify = function(enumeration, elements) {
        if (!enumeration) {
            enumeration = function(value, alias) {
                base_enum.call(this, value, alias)
            }
        }
        ns.Class(enumeration, base_enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue
            }
            v = elements[name];
            if (v instanceof base_enum) {
                v = v.__value
            } else {
                if (typeof v !== "number") {
                    throw new TypeError("Enum value must be a number!")
                }
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    ns.type.BaseEnum = base_enum;
    ns.type.Enum = enumify;
    ns.type.register("BaseEnum");
    ns.type.register("Enum")
})(MONKEY);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var bytes = function() {
        ns.type.Object.call(this);
        this._buffer = null;
        this._offset = 0;
        this._length = 0;
        if (arguments.length === 0) {
            this._buffer = new Uint8Array(4)
        } else {
            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === "number") {
                    this._buffer = new Uint8Array(arg)
                } else {
                    if (arg instanceof bytes) {
                        this._buffer = arg._buffer;
                        this._offset = arg._offset;
                        this._length = arg._length
                    } else {
                        if (arg instanceof Uint8Array) {
                            this._buffer = arg
                        } else {
                            this._buffer = new Uint8Array(arg)
                        }
                        this._length = arg.length
                    }
                }
            } else {
                if (arguments.length === 3) {
                    this._buffer = arguments[0];
                    this._offset = arguments[1];
                    this._length = arguments[2]
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(bytes, ns.type.Object, null);
    bytes.ZERO = new bytes(new Uint8Array(0), 0, 0);
    bytes.prototype.getBuffer = function() {
        return this._buffer
    };
    bytes.prototype.getOffset = function() {
        return this._offset
    };
    bytes.prototype.equals = function(other) {
        if (!other) {
            return this._length === 0
        } else {
            if (this === other) {
                return true
            }
        }
        var otherBuffer, otherOffset, otherLength;
        if (other instanceof bytes) {
            otherBuffer = other._buffer;
            otherOffset = other._offset;
            otherLength = other._length
        } else {
            otherBuffer = other;
            otherOffset = 0;
            otherLength = other.length
        }
        if (this._length !== otherLength) {
            return false
        } else {
            if (this._buffer === otherBuffer && this._offset === otherOffset) {
                return true
            }
        }
        var buffer = this._buffer;
        var pos1 = this._offset + this._length - 1;
        var pos2 = otherOffset + otherLength - 1;
        for (; pos2 >= otherOffset; --pos1, --pos2) {
            if (buffer[pos1] !== otherBuffer[pos2]) {
                return false
            }
        }
        return true
    };
    var adjust = function(pos, len) {
        if (pos < 0) {
            pos += len;
            if (pos < 0) {
                return 0
            }
        } else {
            if (pos > len) {
                return len
            }
        }
        return pos
    };
    bytes.adjust = adjust;
    var find_value = function(value, start, end) {
        start += this._offset;
        end += this._offset;
        for (; start < end; ++start) {
            if (this._buffer[start] === value) {
                return start - this._offset
            }
        }
        return -1
    };
    var find_sub = function(sub, start, end) {
        if ((end - start) < sub._length) {
            return -1
        }
        start += this._offset;
        end += this._offset - sub._length + 1;
        if (this._buffer === sub._buffer) {
            if (start === sub._offset) {
                return start - this._offset
            }
        }
        var index;
        for (; start < end; ++start) {
            for (index = 0; index < sub._length; ++index) {
                if (this._buffer[start + index] !== sub._buffer[sub._offset + index]) {
                    break
                }
            }
            if (index === sub._length) {
                return start - this._offset
            }
        }
        return -1
    };
    bytes.prototype.find = function() {
        var sub, start, end;
        if (arguments.length === 1) {
            sub = arguments[0];
            start = 0;
            end = this._length
        } else {
            if (arguments.length === 2) {
                sub = arguments[0];
                start = arguments[1];
                end = this._length;
                start = adjust(start, this._length)
            } else {
                if (arguments.length === 3) {
                    sub = arguments[0];
                    start = arguments[1];
                    end = arguments[2];
                    start = adjust(start, this._length);
                    end = adjust(end, this._length)
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
                }
            }
        }
        if (typeof sub === "number") {
            return find_value.call(this, sub & 255, start, end)
        } else {
            if (sub instanceof bytes) {
                return find_sub.call(this, sub, start, end)
            } else {
                return find_sub.call(this, new bytes(sub), start, end)
            }
        }
    };
    bytes.prototype.getByte = function(index) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                throw new RangeError("error index: " + (index - this._length) + ", length: " + this._length)
            }
        } else {
            if (index >= this._length) {
                throw new RangeError("error index: " + index + ", length: " + this._length)
            }
        }
        return this._buffer[this._offset + index]
    };
    var get_bytes = function(start, end) {
        start += this._offset;
        end += this._offset;
        if (start === 0 && end === this._buffer.length) {
            return this._buffer
        } else {
            if (start < end) {
                return this._buffer.subarray(start, end)
            } else {
                return this.ZERO.getBytes()
            }
        }
    };
    bytes.prototype.getBytes = function() {
        var start, end;
        if (arguments.length === 0) {
            start = 0;
            end = this._length
        } else {
            if (arguments.length === 1) {
                start = arguments[0];
                end = this._length;
                start = adjust(start, this._length)
            } else {
                if (arguments.length === 2) {
                    start = arguments[0];
                    end = arguments[1];
                    start = adjust(start, this._length);
                    end = adjust(end, this._length)
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
                }
            }
        }
        return get_bytes.call(this, start, end)
    };
    bytes.prototype.slice = function(start) {
        var end;
        if (arguments.length === 2) {
            end = arguments[1];
            end = adjust(end, this._length)
        } else {
            end = this._length
        }
        start = adjust(start, this._length);
        return slice(this, start, end)
    };
    var slice = function(data, start, end) {
        if (start === 0 && end === data._length) {
            return data
        } else {
            if (start < end) {
                return new bytes(data._buffer, data._offset + start, end - start)
            } else {
                return bytes.ZERO
            }
        }
    };
    bytes.prototype.concat = function() {
        var result = this;
        var arg, other;
        for (var i = 0; i < arguments.length; ++i) {
            arg = arguments[i];
            if (arg instanceof bytes) {
                other = arg
            } else {
                other = new bytes(arg)
            }
            result = concat(result, other)
        }
        return result
    };
    var concat = function(left, right) {
        if (left._length === 0) {
            return right
        } else {
            if (right._length === 0) {
                return left
            } else {
                if (left._buffer === right._buffer && (left._offset + left._length) === right._offset) {
                    return new bytes(left._buffer, left._offset, left._length + right._length)
                } else {
                    var joined = new Uint8Array(left._length + right._length);
                    Arrays.copy(left._buffer, left._offset, joined, 0, left._length);
                    Arrays.copy(right._buffer, right._offset, joined, left._length, right._length);
                    return new bytes(joined, 0, joined.length)
                }
            }
        }
    };
    bytes.prototype.copy = function() {
        return new bytes(this._buffer, this._offset, this._length)
    };
    bytes.prototype.mutableCopy = function() {
        var buffer = this.getBytes();
        buffer = new Uint8Array(buffer);
        return new bytes(buffer, 0, buffer.length)
    };
    bytes.prototype.toArray = function() {
        var array = this.getBytes();
        if (typeof Array.from === "function") {
            return Array.from(array)
        } else {
            return [].slice.call(array)
        }
    };
    ns.type.Data = bytes;
    ns.type.register("Data")
})(MONKEY);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var bytes = ns.type.Data;
    var adjust = bytes.adjust;
    var resize = function(size) {
        var bigger = new Uint8Array(size);
        Arrays.copy(this._buffer, this._offset, bigger, 0, this._length);
        this._buffer = bigger;
        this._offset = 0
    };
    var expand = function() {
        var capacity = this._buffer.length - this._offset;
        if (capacity > 4) {
            resize.call(this, capacity << 1)
        } else {
            resize.call(this, 8)
        }
    };
    bytes.prototype.setByte = function(index, value) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this._length) {
            if (this._offset + index >= this._buffer.length) {
                if (index < this._buffer.length) {
                    Arrays.copy(this._buffer, this._offset, this._buffer, 0, this._length);
                    this._offset = 0
                } else {
                    resize.call(this, index + 1)
                }
            }
            this._length = index + 1
        }
        this._buffer[this._offset + index] = value & 255;
        return true
    };
    var copy_buffer = function(data, pos, source, start, end) {
        var copyLen = end - start;
        if (copyLen > 0) {
            var copyEnd = pos + copyLen;
            if (source !== data._buffer || (data._offset + pos) !== start) {
                if (data._offset + copyEnd > data._buffer.length) {
                    resize.call(data, copyEnd)
                }
                Arrays.copy(source, start, data._buffer, data._offset + pos, copyLen)
            }
            if (copyEnd > data._length) {
                data._length = copyEnd
            }
        }
    };
    bytes.prototype.fill = function(pos, source) {
        if (pos < 0) {
            pos += this._length;
            if (pos < 0) {
                throw new RangeError("error position: " + (pos - this._length) + ", length: " + this._length)
            }
        }
        var start, end;
        if (arguments.length === 4) {
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, get_length(source));
            end = adjust(end, get_length(source))
        } else {
            if (arguments.length === 3) {
                start = arguments[2];
                end = get_length(source);
                start = adjust(start, get_length(source))
            } else {
                start = 0;
                end = get_length(source)
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, pos, source._buffer, source._offset + start, source._offset + end)
        } else {
            copy_buffer(this, pos, source, start, end)
        }
    };
    var get_length = function(source) {
        if (source instanceof bytes) {
            return source._length
        } else {
            return source.length
        }
    };
    bytes.prototype.append = function(source) {
        if (arguments.length > 1 && typeof arguments[1] !== "number") {
            for (var i = 0; i < arguments.length; ++i) {
                this.append(arguments[i])
            }
            return
        }
        var start, end;
        if (arguments.length === 3) {
            start = arguments[1];
            end = arguments[2];
            start = adjust(start, get_length(source));
            end = adjust(end, get_length(source))
        } else {
            if (arguments.length === 2) {
                start = arguments[1];
                end = get_length(source);
                start = adjust(start, get_length(source))
            } else {
                start = 0;
                end = get_length(source)
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, this._length, source._buffer, source._offset + start, source._offset + end)
        } else {
            copy_buffer(this, this._length, source, start, end)
        }
    };
    bytes.prototype.insert = function(index, value) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this._length) {
            return this.setByte(index, value)
        }
        if (index === 0) {
            if (this._offset > 0) {
                this._offset -= 1
            } else {
                if (this._length === this._buffer.length) {
                    expand.call(this)
                }
                Arrays.copy(this._buffer, 0, this._buffer, 1, this._length)
            }
        } else {
            if (index < (this._length >> 1)) {
                if (this._offset > 0) {
                    Arrays.copy(this._buffer, this._offset, this._buffer, this._offset - 1, index);
                    this._offset -= 1
                } else {
                    if ((this._offset + this._length) === this._buffer.length) {
                        expand.call(this)
                    }
                    Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                }
            } else {
                if ((this._offset + this._length) < this._buffer.length) {
                    Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                } else {
                    if (this._offset > 0) {
                        Arrays.copy(this._buffer, this._offset, this._buffer, this._offset - 1, index);
                        this._offset -= 1
                    } else {
                        expand.call(this);
                        Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                    }
                }
            }
        }
        this._buffer[this._offset + index] = value & 255;
        this._length += 1;
        return true
    };
    bytes.prototype.remove = function(index) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                throw new RangeError("error index: " + (index - this._length) + ", length: " + this._length)
            }
        } else {
            if (index >= this._length) {
                throw new RangeError("index error: " + index + ", length: " + this._length)
            }
        }
        if (index === 0) {
            return this.shift()
        } else {
            if (index === (this._length - 1)) {
                return this.pop()
            }
        }
        var erased = this._buffer[this._offset + index];
        if (index < (this._length >> 1)) {
            Arrays.copy(this._buffer, this._offset, this._buffer, this._offset + 1, index)
        } else {
            Arrays.copy(this._buffer, this._offset + index + 1, this._buffer, this._offset + index, this._length - index - 1)
        }
        return erased
    };
    bytes.prototype.shift = function() {
        if (this._length < 1) {
            throw new RangeError("data empty!")
        }
        var erased = this._buffer[this._offset];
        this._offset += 1;
        this._length -= 1;
        return erased
    };
    bytes.prototype.pop = function() {
        if (this._length < 1) {
            throw new RangeError("data empty!")
        }
        this._length -= 1;
        return this._buffer[this._offset + this._length]
    };
    bytes.prototype.push = function(element) {
        this.setByte(this._length, element)
    };
    ns.type.MutableData = bytes;
    ns.type.register("MutableData")
})(MONKEY);
(function(ns) {
    var str = function(value) {
        if (!value) {
            value = ""
        } else {
            if (value instanceof str) {
                value = value.toString()
            }
        }
        ns.type.Object.call(this);
        this.__string = value
    };
    ns.Class(str, ns.type.Object, null);
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.__string
        } else {
            if (other instanceof str) {
                return this.__string === other.__string
            } else {
                return this.__string === other
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
            return !this.__string
        } else {
            if (other instanceof str) {
                return equalsIgnoreCase(this.__string, other.__string)
            } else {
                return equalsIgnoreCase(this.__string, other)
            }
        }
    };
    str.prototype.valueOf = function() {
        return this.__string
    };
    str.prototype.toString = function() {
        return this.__string
    };
    str.prototype.getLength = function() {
        return this.__string.length
    };
    ns.type.String = str;
    ns.type.register("String")
})(MONKEY);
(function(ns) {
    var map = function() {};
    ns.Interface(map, null);
    map.prototype.getMap = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.copyMap = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.copyMap = function(dictionary) {
        if (ns.Interface.conforms(dictionary, map)) {
            dictionary = dictionary.getMap()
        }
        var json = ns.format.JSON.encode(dictionary);
        return ns.format.JSON.decode(json)
    };
    map.prototype.equals = function(other) {
        console.assert(false, "implement me!");
        return false
    };
    map.prototype.allKeys = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.getValue = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.setValue = function(key, value) {
        console.assert(false, "implement me!")
    };
    ns.type.Map = map;
    ns.type.register("Map")
})(MONKEY);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var map = ns.type.Map;
    var dict = function(dictionary) {
        if (!dictionary) {
            dictionary = {}
        } else {
            if (ns.Interface.conforms(dictionary, map)) {
                dictionary = dictionary.getMap()
            }
        }
        ns.type.Object.call(this);
        this.__dictionary = dictionary
    };
    ns.Class(dict, ns.type.Object, [map]);
    dict.prototype.getMap = function() {
        return this.__dictionary
    };
    dict.prototype.copyMap = function() {
        return map.copyMap(this.__dictionary)
    };
    dict.prototype.valueOf = function() {
        return this.__dictionary
    };
    dict.prototype.equals = function(other) {
        if (!other) {
            return !this.__dictionary
        } else {
            if (ns.Interface.conforms(other, map)) {
                return Arrays.equals(this.__dictionary, other.getMap())
            } else {
                return Arrays.equals(this.__dictionary, other)
            }
        }
    };
    dict.prototype.allKeys = function() {
        return Object.keys(this.__dictionary)
    };
    dict.prototype.getValue = function(key) {
        return this.__dictionary[key]
    };
    dict.prototype.setValue = function(key, value) {
        if (value) {
            this.__dictionary[key] = value
        } else {
            if (this.__dictionary.hasOwnProperty(key)) {
                delete this.__dictionary[key]
            }
        }
    };
    ns.type.Dictionary = dict;
    ns.type.register("Dictionary")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var str = ns.type.String;
    var map = ns.type.Map;
    var Enum = ns.type.Enum;
    var Data = ns.type.Data;
    var Arrays = ns.type.Arrays;
    var map_unwrap = function(dict) {
        var result = {};
        var keys = Object.keys(dict);
        var key;
        for (var i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key instanceof str) {
                key = key.toString()
            }
            result[key] = unwrap(dict[key], true)
        }
        return result
    };
    var list_unwrap = function(array) {
        var result = [];
        var item;
        for (var i = 0; i < array.length; ++i) {
            item = array[i];
            if (item) {
                item = unwrap(item, true);
                if (item) {
                    result[i] = item
                }
            }
        }
        return result
    };
    var unwrap = function(object, circularly) {
        if (obj.isNull(object)) {
            return null
        } else {
            if (obj.isBaseType(object)) {
                return object
            }
        }
        if (object instanceof str) {
            return object.toString()
        }
        if (object instanceof Enum) {
            return object.valueOf()
        }
        if (object instanceof Data) {
            return object.getBytes()
        }
        if (circularly) {
            if (Arrays.isArray(object)) {
                if (object instanceof Array) {
                    return list_unwrap(object)
                }
            } else {
                if (ns.Interface.conforms(object, map)) {
                    object = object.getMap()
                }
                return map_unwrap(object)
            }
        } else {
            if (ns.Interface.conforms(object, map)) {
                object = object.getMap()
            }
        }
        return object
    };
    var wrapper = function() {};
    ns.Interface(wrapper, null);
    wrapper.unwrap = unwrap;
    ns.type.Wrapper = wrapper;
    ns.type.register("Wrapper")
})(MONKEY);
(function(ns) {
    var Runnable = function() {};
    ns.Interface(Runnable, null);
    Runnable.prototype.run = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Runnable = Runnable;
    ns.threading.register("Runnable")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Runnable = ns.threading.Runnable;
    var Thread = function() {
        obj.call(this);
        if (arguments.length === 0) {
            this.__target = null;
            this.__interval = 128
        } else {
            if (arguments.length === 2) {
                this.__target = arguments[0];
                this.__interval = arguments[1]
            } else {
                if (typeof arguments[0] === "number") {
                    this.__target = null;
                    this.__interval = arguments[0]
                } else {
                    this.__target = arguments[0];
                    this.__interval = 128
                }
            }
        }
        this.__running = false;
        this.__thread_id = 0
    };
    ns.Class(Thread, obj, [Runnable]);
    Thread.prototype.start = function() {
        this.__running = true;
        run(this)
    };
    Thread.prototype.stop = function() {
        this.__running = false;
        var tid = this.__thread_id;
        if (tid > 0) {
            this.__thread_id = 0;
            clearTimeout(tid)
        }
    };
    var run = function(thread) {
        if (thread.isRunning() && thread.run()) {
            thread.__thread_id = setTimeout(function() {
                thread.__thread_id = 0;
                run(thread)
            }, thread.getInterval())
        }
    };
    Thread.prototype.isRunning = function() {
        return this.__running
    };
    Thread.prototype.getInterval = function() {
        return this.__interval
    };
    Thread.prototype.run = function() {
        var target = this.__target;
        if (!target || target === this) {
            throw SyntaxError("Thread::run() > override me!")
        } else {
            return target.run()
        }
    };
    ns.threading.Thread = Thread;
    ns.threading.register("Thread")
})(MONKEY);
(function(ns) {
    var Handler = function() {};
    ns.Interface(Handler, null);
    Handler.prototype.setup = function() {
        console.assert(false, "implement me!");
        return false
    };
    Handler.prototype.handle = function() {
        console.assert(false, "implement me!");
        return false
    };
    Handler.prototype.finish = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Handler = Handler;
    ns.threading.register("Handler")
})(MONKEY);
(function(ns) {
    var Processor = function() {};
    ns.Interface(Processor, null);
    Processor.prototype.process = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Processor = Processor;
    ns.threading.register("Processor")
})(MONKEY);
(function(ns) {
    var Thread = ns.threading.Thread;
    var Handler = ns.threading.Handler;
    var Processor = ns.threading.Processor;
    var STAGE_INIT = 0;
    var STAGE_HANDLING = 1;
    var STAGE_CLEANING = 2;
    var STAGE_STOPPED = 3;
    var Runner = function() {
        if (arguments.length === 0) {
            Thread.call(this);
            this.__processor = null
        } else {
            if (arguments.length === 2) {
                Thread.call(this, arguments[1]);
                this.__processor = arguments[0]
            } else {
                if (typeof arguments[0] === "number") {
                    Thread.call(this, arguments[0]);
                    this.__processor = null
                } else {
                    Thread.call(this);
                    this.__processor = arguments[0]
                }
            }
        }
        this.__stage = STAGE_INIT
    };
    ns.Class(Runner, Thread, [Handler, Processor]);
    Runner.prototype.run = function() {
        if (this.__stage === STAGE_INIT) {
            if (this.setup()) {
                return true
            }
            this.__stage = STAGE_HANDLING
        }
        if (this.__stage === STAGE_HANDLING) {
            try {
                if (this.handle()) {
                    return true
                }
            } catch (e) {}
            this.__stage = STAGE_CLEANING
        }
        if (this.__stage === STAGE_CLEANING) {
            if (this.finish()) {
                return true
            }
            this.__stage = STAGE_STOPPED
        }
        return false
    };
    Runner.prototype.setup = function() {
        return false
    };
    Runner.prototype.handle = function() {
        while (this.process()) {
            if (this.isRunning()) {
                continue
            }
            return false
        }
        return this.isRunning()
    };
    Runner.prototype.finish = function() {
        return false
    };
    Runner.prototype.process = function() {
        var processor = this.__processor;
        if (!processor || processor === this) {
            throw SyntaxError("Runner::process() > override me!")
        } else {
            return processor.process()
        }
    };
    ns.threading.Runner = Runner;
    ns.threading.register("Runner")
})(MONKEY);
(function(ns) {
    var hash = function() {};
    ns.Interface(hash, null);
    hash.prototype.digest = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var lib = function(hash) {
        this.hash = hash
    };
    ns.Class(lib, ns.type.Object, [hash]);
    lib.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.HashLib = lib;
    ns.digest.register("Hash");
    ns.digest.register("HashLib")
})(MONKEY);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var md5 = function() {};
    ns.Class(md5, ns.type.Object, [Hash]);
    md5.prototype.digest = function(data) {
        console.assert(false, "MD5 not implemented");
        return null
    };
    ns.digest.MD5 = new Lib(new md5());
    ns.digest.register("MD5")
})(MONKEY);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha1 = function() {};
    ns.Class(sha1, ns.type.Object, [Hash]);
    sha1.prototype.digest = function(data) {
        console.assert(false, "SHA1 not implemented");
        return null
    };
    ns.digest.SHA1 = new Lib(new sha1());
    ns.digest.register("SHA1")
})(MONKEY);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha256 = function() {};
    ns.Class(sha256, ns.type.Object, [Hash]);
    sha256.prototype.digest = function(data) {
        console.assert(false, "SHA256 not implemented");
        return null
    };
    ns.digest.SHA256 = new Lib(new sha256());
    ns.digest.register("SHA256")
})(MONKEY);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var ripemd160 = function() {};
    ns.Class(ripemd160, ns.type.Object, [Hash]);
    ripemd160.prototype.digest = function(data) {
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    ns.digest.RIPEMD160 = new Lib(new ripemd160());
    ns.digest.register("RIPEMD160")
})(MONKEY);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var keccak256 = function() {};
    ns.Class(keccak256, ns.type.Object, [Hash]);
    keccak256.prototype.digest = function(data) {
        console.assert(false, "KECCAK256 not implemented");
        return null
    };
    ns.digest.KECCAK256 = new Lib(new keccak256());
    ns.digest.register("KECCAK256")
})(MONKEY);
(function(ns) {
    var coder = function() {};
    ns.Interface(coder, null);
    coder.prototype.encode = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    coder.prototype.decode = function(string) {
        console.assert(false, "implement me!");
        return null
    };
    var lib = function(coder) {
        this.coder = coder
    };
    ns.Class(lib, ns.type.Object, [coder]);
    lib.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    lib.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.CoderLib = lib;
    ns.format.register("BaseCoder");
    ns.format.register("CoderLib")
})(MONKEY);
(function(ns) {
    var Data = ns.type.Data;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var hex_chars = "0123456789abcdef";
    var hex_values = new Int8Array(128);
    (function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
        values["A".charCodeAt(0)] = 10;
        values["B".charCodeAt(0)] = 11;
        values["C".charCodeAt(0)] = 12;
        values["D".charCodeAt(0)] = 13;
        values["E".charCodeAt(0)] = 14;
        values["F".charCodeAt(0)] = 15
    })(hex_chars, hex_values);
    var hex_encode = function(data) {
        var len = data.length;
        var str = "";
        var byt;
        for (var i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];
            str += hex_chars[byt & 15]
        }
        return str
    };
    var hex_decode = function(string) {
        var i = 0;
        var len = string.length;
        if (len > 2) {
            if (string[0] === "0") {
                if (string[1] === "x" || string[1] === "X") {
                    i += 2
                }
            }
        }
        var size = Math.floor(len / 2);
        var data = new Data(size);
        --len;
        var hi, lo;
        for (; i < len; i += 2) {
            hi = hex_values[string.charCodeAt(i)];
            lo = hex_values[string.charCodeAt(i + 1)];
            data.push((hi << 4) | lo)
        }
        return data.getBytes()
    };
    var hex = function() {};
    ns.Class(hex, ns.type.Object, [Coder]);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    ns.format.Hex = new Lib(new hex());
    ns.format.register("Hex")
})(MONKEY);
(function(ns) {
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var base58 = function() {};
    ns.Class(base58, ns.type.Object, [Coder]);
    base58.prototype.encode = function(data) {
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    ns.format.Base58 = new Lib(new base58());
    ns.format.register("Base58")
})(MONKEY);
(function(ns) {
    var Data = ns.type.Data;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_values = new Int8Array(128);
    (function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
    })(base64_chars, base64_values);
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
            throw new Error("base64 string error: " + string)
        }
        var array = new Data(length * 3 / 4);
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
        return array.getBytes()
    };
    var base64 = function() {};
    ns.Class(base64, ns.type.Object, [Coder]);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    ns.format.Base64 = new Lib(new base64());
    ns.format.register("Base64")
})(MONKEY);
(function(ns) {
    var parser = function() {};
    ns.Interface(parser, null);
    parser.prototype.encode = function(object) {
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decode = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var lib = function(parser) {
        this.parser = parser
    };
    ns.Class(lib, ns.type.Object, [parser]);
    lib.prototype.encode = function(object) {
        return this.parser.encode(object)
    };
    lib.prototype.decode = function(data) {
        return this.parser.decode(data)
    };
    ns.format.DataParser = parser;
    ns.format.ParserLib = lib;
    ns.format.register("DataParser");
    ns.format.register("ParserLib")
})(MONKEY);
(function(ns) {
    var Data = ns.type.Data;
    var Parser = ns.format.DataParser;
    var Lib = ns.format.ParserLib;
    var utf8_encode = function(string) {
        var len = string.length;
        var array = new Data(len);
        var c, l;
        for (var i = 0; i < len; ++i) {
            c = string.charCodeAt(i);
            if (55296 <= c && c <= 56319) {
                l = string.charCodeAt(++i);
                c = ((c - 55296) << 10) + 65536 + l - 56320
            }
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
                        if (c < 65536) {
                            array.push(224 | ((c >> 12) & 15));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        } else {
                            array.push(240 | ((c >> 18) & 7));
                            array.push(128 | ((c >> 12) & 63));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        }
                    }
                }
            }
        }
        return array.getBytes()
    };
    var utf8_decode = function(array) {
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
                    c = ((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
                    break
            }
            if (c < 65536) {
                string += String.fromCharCode(c)
            } else {
                c -= 65536;
                string += String.fromCharCode((c >> 10) + 55296);
                string += String.fromCharCode((c & 1023) + 56320)
            }
        }
        return string
    };
    var utf8 = function() {};
    ns.Class(utf8, ns.type.Object, [Parser]);
    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;
    ns.format.UTF8 = new Lib(new utf8());
    ns.format.register("UTF8")
})(MONKEY);
(function(ns) {
    var Parser = ns.format.DataParser;
    var Lib = ns.format.ParserLib;
    var json = function() {};
    ns.Class(json, ns.type.Object, [Parser]);
    json.prototype.encode = function(container) {
        var string = JSON.stringify(container);
        if (!string) {
            throw new TypeError("failed to encode JSON object: " + container)
        }
        return ns.format.UTF8.encode(string)
    };
    json.prototype.decode = function(json) {
        var string;
        if (typeof json === "string") {
            string = json
        } else {
            string = ns.format.UTF8.decode(json)
        }
        if (!string) {
            throw new TypeError("failed to decode JSON data: " + json)
        }
        return JSON.parse(string)
    };
    ns.format.JSON = new Lib(new json());
    ns.format.register("JSON")
})(MONKEY);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = function() {};
    ns.Interface(CryptographyKey, [map]);
    CryptographyKey.prototype.getAlgorithm = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.getAlgorithm = function(key) {
        return key["algorithm"]
    };
    CryptographyKey.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.promise = ns.format.UTF8.encode("Moky loves May Lee forever!");
    CryptographyKey.matches = function(pKey, sKey) {
        var promise = CryptographyKey.promise;
        var ciphertext = pKey.encrypt(promise);
        var plaintext = sKey.decrypt(ciphertext);
        if (!plaintext || plaintext.length !== promise.length) {
            return false
        }
        for (var i = 0; i < promise.length; ++i) {
            if (plaintext[i] !== promise[i]) {
                return false
            }
        }
        return true
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.register("CryptographyKey")
})(MONKEY);
(function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = function() {};
    ns.Interface(EncryptKey, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function(plaintext) {
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    ns.Interface(DecryptKey, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function(ciphertext) {
        console.assert(false, "implement me!");
        return null
    };
    DecryptKey.prototype.matches = function(pKey) {
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.register("EncryptKey");
    ns.crypto.register("DecryptKey")
})(MONKEY);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = function() {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.register("SymmetricKey")
})(MONKEY);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var SymmetricKeyFactory = function() {};
    ns.Interface(SymmetricKeyFactory, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var s_factories = {};
    SymmetricKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    SymmetricKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    SymmetricKey.generate = function(algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generateSymmetricKey()
    };
    SymmetricKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.Interface.conforms(key, SymmetricKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory("*")
        }
        return factory.parseSymmetricKey(key)
    }
})(MONKEY);
(function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function(key) {};
    ns.Interface(AsymmetricKey, [CryptographyKey]);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    AsymmetricKey.matches = function(sKey, pKey) {
        var promise = CryptographyKey.promise;
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature)
    };
    var SignKey = function() {};
    ns.Interface(SignKey, [AsymmetricKey]);
    SignKey.prototype.sign = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    ns.Interface(VerifyKey, [AsymmetricKey]);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(false, "implement me!");
        return false
    };
    VerifyKey.prototype.matches = function(sKey) {
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.register("AsymmetricKey");
    ns.crypto.register("SignKey");
    ns.crypto.register("VerifyKey")
})(MONKEY);
(function(ns) {
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = function() {};
    ns.Interface(PublicKey, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.register("PublicKey")
})(MONKEY);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var PublicKey = ns.crypto.PublicKey;
    var PublicKeyFactory = function() {};
    ns.Interface(PublicKeyFactory, null);
    PublicKeyFactory.prototype.parsePublicKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    PublicKey.Factory = PublicKeyFactory;
    var s_factories = {};
    PublicKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    PublicKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    PublicKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.Interface.conforms(key, PublicKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (!factory) {
            factory = PublicKey.getFactory("*")
        }
        return factory.parsePublicKey(key)
    }
})(MONKEY);
(function(ns) {
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    ns.Interface(PrivateKey, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.register("PrivateKey")
})(MONKEY);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PrivateKeyFactory = function() {};
    ns.Interface(PrivateKeyFactory, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var s_factories = {};
    PrivateKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    PrivateKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    PrivateKey.generate = function(algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generatePrivateKey()
    };
    PrivateKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.Interface.conforms(key, PrivateKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory("*")
        }
        return factory.parsePrivateKey(key)
    }
})(MONKEY);
if (typeof MingKeMing !== "object") {
    MingKeMing = {}
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    base.Namespace(ns.protocol);
    ns.register("protocol")
})(MingKeMing, MONKEY);
(function(ns) {
    var NetworkType = ns.type.Enum(null, {
        BTC_MAIN: (0),
        MAIN: (8),
        GROUP: (16),
        POLYLOGUE: (16),
        CHATROOM: (48),
        PROVIDER: (118),
        STATION: (136),
        THING: (128),
        ROBOT: (200)
    });
    NetworkType.isUser = function(network) {
        var main = NetworkType.MAIN.valueOf();
        var btcMain = NetworkType.BTC_MAIN.valueOf();
        return ((network & main) === main) || (network === btcMain)
    };
    NetworkType.isGroup = function(network) {
        var group = NetworkType.GROUP.valueOf();
        return (network & group) === group
    };
    ns.protocol.NetworkType = NetworkType;
    ns.protocol.register("NetworkType")
})(MingKeMing);
(function(ns) {
    var MetaType = ns.type.Enum(null, {
        DEFAULT: (1),
        MKM: (1),
        BTC: (2),
        ExBTC: (3),
        ETH: (4),
        ExETH: (5)
    });
    MetaType.hasSeed = function(version) {
        var mkm = MetaType.MKM.valueOf();
        return (version & mkm) === mkm
    };
    ns.protocol.MetaType = MetaType;
    ns.protocol.register("MetaType")
})(MingKeMing);
(function(ns) {
    var Address = function() {};
    ns.Interface(Address, null);
    Address.prototype.getNetwork = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Address.prototype.isBroadcast = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.prototype.isUser = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.prototype.isGroup = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    ns.protocol.Address = Address;
    ns.protocol.register("Address")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var Address = ns.protocol.Address;
    var AddressFactory = function() {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.parseAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    Address.Factory = AddressFactory;
    var s_factory = null;
    Address.getFactory = function() {
        return s_factory
    };
    Address.setFactory = function(factory) {
        s_factory = factory
    };
    Address.parse = function(address) {
        if (!address) {
            return null
        } else {
            if (ns.Interface.conforms(address, Address)) {
                return address
            } else {
                if (address instanceof str) {
                    address = address.toString()
                }
            }
        }
        return Address.getFactory().parseAddress(address)
    }
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var ID = function() {};
    ns.Interface(ID, null);
    ID.prototype.getName = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getAddress = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getTerminal = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getType = function() {
        console.assert(false, "implement me!");
        return 0
    };
    ID.prototype.isBroadcast = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.prototype.isUser = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.prototype.isGroup = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.convert = function(members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id)
            }
        }
        return array
    };
    ID.revert = function(members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (typeof id === "string") {
                array.push(id)
            } else {
                array.push(id.toString())
            }
        }
        return array
    };
    ns.protocol.ID = ID;
    ns.protocol.register("ID")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var ID = ns.protocol.ID;
    var IDFactory = function() {};
    ns.Interface(IDFactory, null);
    IDFactory.prototype.createID = function(name, address, terminal) {
        console.assert(false, "implement me!");
        return null
    };
    IDFactory.prototype.parseID = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    ID.Factory = IDFactory;
    var s_factory;
    ID.getFactory = function() {
        return s_factory
    };
    ID.setFactory = function(factory) {
        s_factory = factory
    };
    ID.create = function(name, address, terminal) {
        return ID.getFactory().createID(name, address, terminal)
    };
    ID.parse = function(identifier) {
        if (!identifier) {
            return null
        } else {
            if (ns.Interface.conforms(identifier, ID)) {
                return identifier
            } else {
                if (identifier instanceof str) {
                    identifier = identifier.toString()
                }
            }
        }
        return ID.getFactory().parseID(identifier)
    }
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Meta = function() {};
    ns.Interface(Meta, [map]);
    Meta.prototype.getType = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Meta.getType = function(meta) {
        var version = meta["type"];
        if (!version) {
            version = meta["version"]
        }
        return version
    };
    Meta.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getKey = function(meta) {
        var key = meta["key"];
        if (!key) {
            throw new TypeError("meta key not found: " + meta)
        }
        return PublicKey.parse(key)
    };
    Meta.prototype.getSeed = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getSeed = function(meta) {
        return meta["seed"]
    };
    Meta.prototype.getFingerprint = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getFingerprint = function(meta) {
        var base64 = meta["fingerprint"];
        if (!base64) {
            return null
        }
        return ns.format.Base64.decode(base64)
    };
    Meta.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    Meta.prototype.generateID = function(type, terminal) {
        console.assert(false, "implement me!");
        return null
    };
    Meta.prototype.matches = function(id_or_key) {
        console.assert(false, "implement me!");
        return false
    };
    ns.protocol.Meta = Meta;
    ns.protocol.register("Meta")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var MetaFactory = function() {};
    ns.Interface(MetaFactory, null);
    MetaFactory.prototype.createMeta = function(key, seed, fingerprint) {
        console.assert(false, "implement me!");
        return null
    };
    MetaFactory.prototype.generateMeta = function(sKey, seed) {
        console.assert(false, "implement me!");
        return null
    };
    MetaFactory.prototype.parseMeta = function(meta) {
        console.assert(false, "implement me!");
        return null
    };
    Meta.Factory = MetaFactory;
    var s_factories = {};
    Meta.register = function(type, factory) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        s_factories[type] = factory
    };
    Meta.getFactory = function(type) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        return s_factories[type]
    };
    Meta.create = function(type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type)
        }
        return factory.createMeta(key, seed, fingerprint)
    };
    Meta.generate = function(type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type)
        }
        return factory.generateMeta(sKey, seed)
    };
    Meta.parse = function(meta) {
        if (!meta) {
            return null
        } else {
            if (ns.Interface.conforms(meta, Meta)) {
                return meta
            } else {
                if (ns.Interface.conforms(meta, map)) {
                    meta = meta.getMap()
                }
            }
        }
        var type = Meta.getType(meta);
        var factory = Meta.getFactory(type);
        if (!factory) {
            factory = Meta.getFactory(0)
        }
        return factory.parseMeta(meta)
    }
})(MingKeMing);
(function(ns) {
    var TAI = function() {};
    ns.Interface(TAI, null);
    TAI.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.verify = function(publicKey) {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.sign = function(privateKey) {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.allPropertyNames = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getProperty = function(name) {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.setProperty = function(name, value) {
        console.assert(false, "implement me!")
    };
    ns.protocol.TAI = TAI;
    ns.protocol.register("TAI")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = function() {};
    ns.Interface(Document, [TAI, map]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.getType = function(doc) {
        return doc["type"]
    };
    Document.prototype.getIdentifier = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.getIdentifier = function(doc) {
        return ID.parse(doc["ID"])
    };
    Document.getData = function(doc) {
        var utf8 = doc["data"];
        if (utf8) {
            return ns.format.UTF8.encode(utf8)
        } else {
            return null
        }
    };
    Document.getSignature = function(doc) {
        var base64 = doc["signature"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    Document.prototype.getTime = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.prototype.getName = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.prototype.setName = function(name) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Document = Document;
    ns.protocol.register("Document")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var Document = ns.protocol.Document;
    var DocumentFactory = function() {};
    ns.Interface(DocumentFactory, null);
    DocumentFactory.prototype.createDocument = function(identifier, data, signature) {
        console.assert(false, "implement me!");
        return null
    };
    DocumentFactory.prototype.parseDocument = function(doc) {
        console.assert(false, "implement me!");
        return null
    };
    Document.Factory = DocumentFactory;
    var s_factories = {};
    Document.register = function(type, factory) {
        s_factories[type] = factory
    };
    Document.getFactory = function(type) {
        return s_factories[type]
    };
    Document.create = function(type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw new ReferenceError("document type not support: " + type)
        }
        return factory.createDocument(identifier, data, signature)
    };
    Document.parse = function(doc) {
        if (!doc) {
            return null
        } else {
            if (ns.Interface.conforms(doc, Document)) {
                return doc
            } else {
                if (ns.Interface.conforms(doc, map)) {
                    doc = doc.getMap()
                }
            }
        }
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory("*")
        }
        return factory.parseDocument(doc)
    }
})(MingKeMing);
(function(ns) {
    var Document = ns.protocol.Document;
    var Visa = function() {};
    ns.Interface(Visa, [Document]);
    Visa.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    Visa.prototype.setKey = function(publicKey) {
        console.assert(false, "implement me!")
    };
    Visa.prototype.getAvatar = function() {
        console.assert(false, "implement me!");
        return null
    };
    Visa.prototype.setAvatar = function(url) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Visa = Visa;
    ns.protocol.register("Visa")
})(MingKeMing);
(function(ns) {
    var Document = ns.protocol.Document;
    var Bulletin = function() {};
    ns.Interface(Bulletin, [Document]);
    Bulletin.prototype.getAssistants = function() {
        console.assert(false, "implement me!");
        return null
    };
    Bulletin.prototype.setAssistants = function(assistants) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Bulletin = Bulletin;
    ns.protocol.register("Bulletin")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var ID = ns.protocol.ID;
    var Identifier = function(identifier, name, address, terminal) {
        str.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal
    };
    ns.Class(Identifier, str, [ID]);
    Identifier.prototype.getName = function() {
        return this.__name
    };
    Identifier.prototype.getAddress = function() {
        return this.__address
    };
    Identifier.prototype.getTerminal = function() {
        return this.__terminal
    };
    Identifier.prototype.getType = function() {
        return this.getAddress().getNetwork()
    };
    Identifier.prototype.isBroadcast = function() {
        return this.getAddress().isBroadcast()
    };
    Identifier.prototype.isUser = function() {
        return this.getAddress().isUser()
    };
    Identifier.prototype.isGroup = function() {
        return this.getAddress().isGroup()
    };
    ns.Identifier = Identifier;
    ns.register("Identifier")
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.Identifier;
    var concat = function(name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + "@" + string
        }
        if (terminal && terminal.length > 0) {
            string = string + "/" + terminal
        }
        return string
    };
    var parse = function(string) {
        var name, address, terminal;
        var pair = string.split("/");
        if (pair.length === 1) {
            terminal = null
        } else {
            terminal = pair[1]
        }
        pair = pair[0].split("@");
        if (pair.length === 1) {
            name = null;
            address = Address.parse(pair[0])
        } else {
            name = pair[0];
            address = Address.parse(pair[1])
        }
        return new Identifier(string, name, address, terminal)
    };
    var IDFactory = function() {
        this.__identifiers = {}
    };
    ns.Class(IDFactory, null, [ID.Factory]);
    IDFactory.prototype.createID = function(name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.__identifiers[string] = id
        }
        return id
    };
    IDFactory.prototype.parseID = function(identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id
            }
        }
        return id
    };
    ns.IDFactory = IDFactory;
    ns.register("IDFactory")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function(string, network) {
        str.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf()
        }
        this.__network = network
    };
    ns.Class(BroadcastAddress, str, [Address]);
    BroadcastAddress.prototype.getNetwork = function() {
        return this.__network
    };
    BroadcastAddress.prototype.isBroadcast = function() {
        return true
    };
    BroadcastAddress.prototype.isUser = function() {
        return NetworkType.isUser(this.__network)
    };
    BroadcastAddress.prototype.isGroup = function() {
        return NetworkType.isGroup(this.__network)
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", NetworkType.GROUP);
    ns.BroadcastAddress = BroadcastAddress;
    ns.register("BroadcastAddress")
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var AddressFactory = function() {
        this.__addresses = {};
        this.__addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.__addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE
    };
    ns.Class(AddressFactory, null, [Address.Factory]);
    AddressFactory.prototype.parseAddress = function(string) {
        var address = this.__addresses[string];
        if (!address) {
            address = this.createAddress(string);
            if (address) {
                this.__addresses[string] = address
            }
        }
        return address
    };
    AddressFactory.prototype.createAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    ns.AddressFactory = AddressFactory;
    ns.register("AddressFactory")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.IDFactory;
    var factory = new IDFactory();
    ID.setFactory(factory);
    ID.ANYONE = factory.createID("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID("everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = factory.createID("moky", Address.ANYWHERE, null)
})(MingKeMing);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var BaseMeta = function() {
        var type, key, seed, fingerprint;
        var meta, status;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = Meta.getType(meta);
            key = Meta.getKey(meta);
            seed = Meta.getSeed(meta);
            fingerprint = Meta.getFingerprint(meta);
            status = 0
        } else {
            if (arguments.length === 2) {
                type = arguments[0];
                key = arguments[1];
                seed = null;
                fingerprint = null;
                if (type instanceof MetaType) {
                    type = type.valueOf()
                }
                meta = {
                    "type": type,
                    "key": key.getMap()
                };
                status = 1
            } else {
                if (arguments.length === 4) {
                    type = arguments[0];
                    key = arguments[1];
                    seed = arguments[2];
                    fingerprint = arguments[3];
                    if (type instanceof MetaType) {
                        type = type.valueOf()
                    }
                    meta = {
                        "type": type,
                        "key": key.getMap(),
                        "seed": seed,
                        "fingerprint": ns.format.Base64.encode(fingerprint)
                    };
                    status = 1
                } else {
                    throw new SyntaxError("meta arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
        this.__status = status
    };
    ns.Class(BaseMeta, Dictionary, [Meta]);
    BaseMeta.prototype.getType = function() {
        return this.__type
    };
    BaseMeta.prototype.getKey = function() {
        return this.__key
    };
    BaseMeta.prototype.getSeed = function() {
        return this.__seed
    };
    BaseMeta.prototype.getFingerprint = function() {
        return this.__fingerprint
    };
    BaseMeta.prototype.isValid = function() {
        if (this.__status === 0) {
            if (!this.__key) {
                this.__status = -1
            } else {
                if (MetaType.hasSeed(this.__type)) {
                    if (!this.__seed || !this.__fingerprint) {
                        this.__status = -1
                    } else {
                        if (this.__key.verify(ns.format.UTF8.encode(this.__seed), this.__fingerprint)) {
                            this.__status = 1
                        } else {
                            this.__status = -1
                        }
                    }
                } else {
                    this.__status = 1
                }
            }
        }
        return this.__status === 1
    };
    BaseMeta.prototype.generateAddress = function(network) {
        console.assert(false, "implement me!");
        return null
    };
    BaseMeta.prototype.generateID = function(type, terminal) {
        var address = this.generateAddress(type);
        if (!address) {
            return null
        }
        return ID.create(this.getSeed(), address, terminal)
    };
    BaseMeta.prototype.matches = function(id_or_key) {
        if (!this.isValid()) {
            return false
        }
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_identifier.call(this, id_or_key)
        } else {
            if (ns.Interface.conforms(id_or_key, PublicKey)) {
                return match_public_key.call(this, id_or_key)
            }
        }
        return false
    };
    var match_identifier = function(identifier) {
        if (MetaType.hasSeed(this.__type)) {
            if (identifier.getName() !== this.__seed) {
                return false
            }
        }
        var address = this.generateAddress(identifier.getType());
        return identifier.getAddress().equals(address)
    };
    var match_public_key = function(publicKey) {
        if (this.__key.equals(publicKey)) {
            return true
        }
        if (MetaType.hasSeed(this.__type)) {
            var data = ns.format.UTF8.encode(this.__seed);
            var signature = this.__fingerprint;
            return publicKey.verify(data, signature)
        } else {
            return false
        }
    };
    ns.BaseMeta = BaseMeta;
    ns.register("BaseMeta")
})(MingKeMing);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var Document = ns.protocol.Document;
    var BaseDocument = function() {
        var identifier, data, signature;
        var map, status;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            identifier = Document.getIdentifier(map);
            data = Document.getData(map);
            signature = Document.getSignature(map);
            properties = null;
            status = 0
        } else {
            if (arguments.length === 2) {
                identifier = arguments[0];
                var type = arguments[1];
                data = null;
                signature = null;
                map = {
                    "ID": identifier.toString()
                };
                if (type && type.length > 1) {
                    properties = {
                        "type": type
                    }
                } else {
                    properties = null
                }
                status = 0
            } else {
                if (arguments.length === 3) {
                    identifier = arguments[0];
                    data = arguments[1];
                    signature = arguments[2];
                    map = {
                        "ID": identifier.toString(),
                        "data": ns.format.UTF8.decode(data),
                        "signature": ns.format.Base64.encode(signature)
                    };
                    properties = null;
                    status = 1
                } else {
                    throw new SyntaxError("document arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__data = data;
        this.__signature = signature;
        this.__properties = properties;
        this.__status = status
    };
    ns.Class(BaseDocument, Dictionary, [Document]);
    BaseDocument.prototype.isValid = function() {
        return this.__status > 0
    };
    BaseDocument.prototype.getType = function() {
        var type = this.getProperty("type");
        if (!type) {
            type = Document.getType(this.getMap())
        }
        return type
    };
    BaseDocument.prototype.getIdentifier = function() {
        return this.__identifier
    };
    BaseDocument.prototype.allPropertyNames = function() {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return Object.keys(dict)
    };
    BaseDocument.prototype.getProperties = function() {
        if (this.__status < 0) {
            return null
        }
        if (!this.__properties) {
            var data = this.__data;
            if (data) {
                this.__properties = ns.format.JSON.decode(data)
            } else {
                this.__properties = {}
            }
        }
        return this.__properties
    };
    BaseDocument.prototype.getProperty = function(name) {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return dict[name]
    };
    BaseDocument.prototype.setProperty = function(name, value) {
        this.__status = 0;
        var dict = this.getProperties();
        dict[name] = value;
        this.setValue("data", null);
        this.setValue("signature", null);
        this.__data = null;
        this.__signature = null
    };
    BaseDocument.prototype.verify = function(publicKey) {
        if (this.__status > 0) {
            return true
        }
        var data = this.__data;
        var signature = this.__signature;
        if (!data) {
            if (!signature) {
                this.__status = 0
            } else {
                this.__status = -1
            }
        } else {
            if (!signature) {
                this.__status = -1
            } else {
                if (publicKey.verify(data, signature)) {
                    this.__status = 1
                }
            }
        }
        return this.__status > 0
    };
    BaseDocument.prototype.sign = function(privateKey) {
        if (this.__status > 0) {
            return this.__signature
        }
        var now = new Date();
        this.setProperty("time", now.getTime() / 1000);
        this.__status = 1;
        this.__data = ns.format.JSON.encode(this.getProperties());
        this.__signature = privateKey.sign(this.__data);
        this.setValue("data", ns.format.UTF8.decode(this.__data));
        this.setValue("signature", ns.format.Base64.encode(this.__signature));
        return this.__signature
    };
    BaseDocument.prototype.getTime = function() {
        var timestamp = this.getProperty("time");
        if (timestamp) {
            return new Date(timestamp * 1000)
        } else {
            return null
        }
    };
    BaseDocument.prototype.getName = function() {
        return this.getProperty("name")
    };
    BaseDocument.prototype.setName = function(name) {
        this.setProperty("name", name)
    };
    ns.BaseDocument = BaseDocument;
    ns.register("BaseDocument")
})(MingKeMing);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.BaseDocument;
    var BaseVisa = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.__key = null
    };
    ns.Class(BaseVisa, BaseDocument, [Visa]);
    BaseVisa.prototype.getKey = function() {
        if (!this.__key) {
            var key = this.getProperty("key");
            if (key) {
                key = PublicKey.parse(key);
                if (ns.Interface.conforms(key, EncryptKey)) {
                    this.__key = key
                }
            }
        }
        return this.__key
    };
    BaseVisa.prototype.setKey = function(publicKey) {
        this.setProperty("key", publicKey.getMap());
        this.__key = publicKey
    };
    BaseVisa.prototype.getAvatar = function() {
        return this.getProperty("avatar")
    };
    BaseVisa.prototype.setAvatar = function(url) {
        this.setProperty("avatar", url)
    };
    ns.BaseVisa = BaseVisa;
    ns.register("BaseVisa")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.BaseDocument;
    var BaseBulletin = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.__assistants = null
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin]);
    BaseBulletin.prototype.getAssistants = function() {
        if (!this.__assistants) {
            var assistants = this.getProperty("assistants");
            if (assistants) {
                this.__assistants = ID.convert(assistants)
            }
        }
        return this.__assistants
    };
    BaseBulletin.prototype.setAssistants = function(assistants) {
        if (assistants && assistants.length > 0) {
            this.setProperty("assistants", ID.revert(assistants))
        } else {
            this.setProperty("assistants", null)
        }
    };
    ns.BaseBulletin = BaseBulletin;
    ns.register("BaseBulletin")
})(MingKeMing);
if (typeof DaoKeDao !== "object") {
    DaoKeDao = {}
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    base.Namespace(ns.protocol);
    ns.register("protocol")
})(DaoKeDao, MingKeMing);
(function(ns) {
    var ContentType = ns.type.Enum(null, {
        TEXT: (1),
        FILE: (16),
        IMAGE: (18),
        AUDIO: (20),
        VIDEO: (22),
        PAGE: (32),
        QUOTE: (55),
        MONEY: (64),
        TRANSFER: (65),
        LUCKY_MONEY: (66),
        CLAIM_PAYMENT: (72),
        SPLIT_BILL: (73),
        COMMAND: (136),
        HISTORY: (137),
        FORWARD: (255)
    });
    ns.protocol.ContentType = ContentType;
    ns.protocol.register("ContentType")
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var ID = ns.protocol.ID;
    var Content = function() {};
    ns.Interface(Content, [map]);
    Content.prototype.getType = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Content.getType = function(content) {
        return content["type"]
    };
    Content.prototype.getSerialNumber = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Content.getSerialNumber = function(content) {
        return content["sn"]
    };
    Content.prototype.getTime = function() {
        console.assert(false, "implement me!");
        return null
    };
    Content.getTime = function(content) {
        var timestamp = content["time"];
        if (timestamp) {
            return new Date(timestamp * 1000)
        } else {
            return null
        }
    };
    Content.prototype.getGroup = function() {
        console.assert(false, "implement me!");
        return null
    };
    Content.prototype.setGroup = function(identifier) {
        console.assert(false, "implement me!")
    };
    Content.getGroup = function(content) {
        return ID.parse(content["group"])
    };
    Content.setGroup = function(group, content) {
        if (group) {
            content["group"] = group.toString()
        } else {
            delete content["group"]
        }
    };
    ns.protocol.Content = Content;
    ns.protocol.register("Content")
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var ContentFactory = function() {};
    ns.Interface(ContentFactory, null);
    ContentFactory.prototype.parseContent = function(content) {
        console.assert(false, "implement me!");
        return null
    };
    Content.Factory = ContentFactory;
    var s_factories = {};
    Content.register = function(type, factory) {
        if (type instanceof ContentType) {
            type = type.valueOf()
        }
        s_factories[type] = factory
    };
    Content.getFactory = function(type) {
        if (type instanceof ContentType) {
            type = type.valueOf()
        }
        return s_factories[type]
    };
    Content.parse = function(content) {
        if (!content) {
            return null
        } else {
            if (ns.Interface.conforms(content, Content)) {
                return content
            } else {
                if (ns.Interface.conforms(content, map)) {
                    content = content.getMap()
                }
            }
        }
        var type = Content.getType(content);
        var factory = Content.getFactory(type);
        if (!factory) {
            factory = Content.getFactory(0)
        }
        return factory.parseContent(content)
    }
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var ID = ns.protocol.ID;
    var ContentType = ns.protocol.ContentType;
    var Envelope = function() {};
    ns.Interface(Envelope, [map]);
    Envelope.prototype.getSender = function() {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.getSender = function(env) {
        return ns.protocol.ID.parse(env["sender"])
    };
    Envelope.prototype.getReceiver = function() {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.getReceiver = function(env) {
        return ID.parse(env["receiver"])
    };
    Envelope.prototype.getTime = function() {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.getTime = function(env) {
        var timestamp = env["time"];
        if (timestamp) {
            return new Date(timestamp * 1000)
        } else {
            return null
        }
    };
    Envelope.prototype.getGroup = function() {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.prototype.setGroup = function(identifier) {
        console.assert(false, "implement me!")
    };
    Envelope.getGroup = function(env) {
        return ID.parse(env["group"])
    };
    Envelope.setGroup = function(group, env) {
        if (group) {
            env["group"] = group.toString()
        } else {
            delete env["group"]
        }
    };
    Envelope.prototype.getType = function() {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.prototype.setType = function(type) {
        console.assert(false, "implement me!")
    };
    Envelope.getType = function(env) {
        var type = env["type"];
        if (type) {
            return type
        } else {
            return 0
        }
    };
    Envelope.setType = function(type, env) {
        if (type) {
            if (type instanceof ContentType) {
                type = type.valueOf()
            }
            env["type"] = type
        } else {
            delete env["type"]
        }
    };
    ns.protocol.Envelope = Envelope;
    ns.protocol.register("Envelope")
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var Envelope = ns.protocol.Envelope;
    var EnvelopeFactory = function() {};
    ns.Interface(EnvelopeFactory, null);
    EnvelopeFactory.prototype.createEnvelope = function(from, to, when) {
        console.assert(false, "implement me!");
        return null
    };
    EnvelopeFactory.prototype.parseEnvelope = function(env) {
        console.assert(false, "implement me!");
        return null
    };
    Envelope.Factory = EnvelopeFactory;
    var s_factory = null;
    Envelope.getFactory = function() {
        return s_factory
    };
    Envelope.setFactory = function(factory) {
        s_factory = factory
    };
    Envelope.create = function(from, to, when) {
        return Envelope.getFactory().createEnvelope(from, to, when)
    };
    Envelope.parse = function(env) {
        if (!env) {
            return null
        } else {
            if (ns.Interface.conforms(env, Envelope)) {
                return env
            } else {
                if (ns.Interface.conforms(env, map)) {
                    env = env.getMap()
                }
            }
        }
        return Envelope.getFactory().parseEnvelope(env)
    }
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var Envelope = ns.protocol.Envelope;
    var Message = function() {};
    ns.Interface(Message, [map]);
    Message.prototype.getDelegate = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.prototype.setDelegate = function(delegate) {
        console.assert(false, "implement me!")
    };
    Message.prototype.getEnvelope = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.getEnvelope = function(msg) {
        return Envelope.parse(msg)
    };
    Message.prototype.getSender = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.prototype.getReceiver = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.prototype.getTime = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.prototype.getGroup = function() {
        console.assert(false, "implement me!");
        return null
    };
    Message.prototype.getType = function() {
        console.assert(false, "implement me!");
        return null
    };
    ns.protocol.Message = Message;
    ns.protocol.register("Message")
})(DaoKeDao);
(function(ns) {
    var Message = ns.protocol.Message;
    var MessageDelegate = function() {};
    ns.Interface(MessageDelegate, null);
    Message.Delegate = MessageDelegate
})(DaoKeDao);
(function(ns) {
    var Content = ns.protocol.Content;
    var Message = ns.protocol.Message;
    var InstantMessage = function() {};
    ns.Interface(InstantMessage, [Message]);
    InstantMessage.prototype.getContent = function() {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessage.getContent = function(msg) {
        return Content.parse(msg["content"])
    };
    InstantMessage.prototype.encrypt = function(password, members) {
        console.assert(false, "implement me!");
        return null
    };
    ns.protocol.InstantMessage = InstantMessage;
    ns.protocol.register("InstantMessage")
})(DaoKeDao);
(function(ns) {
    var Message = ns.protocol.Message;
    var InstantMessage = ns.protocol.InstantMessage;
    var InstantMessageDelegate = function() {};
    ns.Interface(InstantMessageDelegate, [Message.Delegate]);
    InstantMessageDelegate.prototype.serializeContent = function(content, pwd, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encryptContent = function(data, pwd, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encodeData = function(data, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.serializeKey = function(pwd, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encryptKey = function(data, receiver, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageDelegate.prototype.encodeKey = function(data, iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessage.Delegate = InstantMessageDelegate
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var InstantMessage = ns.protocol.InstantMessage;
    var InstantMessageFactory = function() {};
    ns.Interface(InstantMessageFactory, null);
    InstantMessageFactory.prototype.createInstantMessage = function(head, body) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessageFactory.prototype.parseInstantMessage = function(msg) {
        console.assert(false, "implement me!");
        return null
    };
    InstantMessage.Factory = InstantMessageFactory;
    var s_factory = null;
    InstantMessage.getFactory = function() {
        return s_factory
    };
    InstantMessage.setFactory = function(factory) {
        s_factory = factory
    };
    InstantMessage.create = function(head, body) {
        return InstantMessage.getFactory().createInstantMessage(head, body)
    };
    InstantMessage.parse = function(msg) {
        if (!msg) {
            return null
        } else {
            if (ns.Interface.conforms(msg, InstantMessage)) {
                return msg
            } else {
                if (ns.Interface.conforms(msg, map)) {
                    msg = msg.getMap()
                }
            }
        }
        return InstantMessage.getFactory().parseInstantMessage(msg)
    }
})(DaoKeDao);
(function(ns) {
    var Message = ns.protocol.Message;
    var SecureMessage = function() {};
    ns.Interface(SecureMessage, [Message]);
    SecureMessage.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.getEncryptedKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.getEncryptedKeys = function() {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.decrypt = function() {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.sign = function() {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.split = function(members) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.prototype.trim = function(member) {
        console.assert(false, "implement me!");
        return null
    };
    ns.protocol.SecureMessage = SecureMessage;
    ns.protocol.register("SecureMessage")
})(DaoKeDao);
(function(ns) {
    var Message = ns.protocol.Message;
    var SecureMessage = ns.protocol.SecureMessage;
    var SecureMessageDelegate = function() {};
    ns.Interface(SecureMessageDelegate, [Message.Delegate]);
    SecureMessageDelegate.prototype.decodeKey = function(key, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decryptKey = function(data, sender, receiver, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.deserializeKey = function(data, sender, receiver, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decodeData = function(data, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.decryptContent = function(data, pwd, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.deserializeContent = function(data, pwd, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.signData = function(data, sender, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessageDelegate.prototype.encodeSignature = function(signature, sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.Delegate = SecureMessageDelegate
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var SecureMessage = ns.protocol.SecureMessage;
    var SecureMessageFactory = function() {};
    ns.Interface(SecureMessageFactory, null);
    SecureMessageFactory.prototype.parseSecureMessage = function(msg) {
        console.assert(false, "implement me!");
        return null
    };
    SecureMessage.Factory = SecureMessageFactory;
    var s_factory = null;
    SecureMessage.getFactory = function() {
        return s_factory
    };
    SecureMessage.setFactory = function(factory) {
        s_factory = factory
    };
    SecureMessage.parse = function(msg) {
        if (!msg) {
            return null
        } else {
            if (ns.Interface.conforms(msg, SecureMessage)) {
                return msg
            } else {
                if (ns.Interface.conforms(msg, map)) {
                    msg = msg.getMap()
                }
            }
        }
        return SecureMessage.getFactory().parseSecureMessage(msg)
    }
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = function() {};
    ns.Interface(ReliableMessage, [SecureMessage]);
    ReliableMessage.prototype.getSignature = function() {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.prototype.getMeta = function() {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.prototype.setMeta = function(meta) {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.getMeta = function(msg) {
        return Meta.parse(msg["meta"])
    };
    ReliableMessage.setMeta = function(meta, msg) {
        if (meta) {
            msg["meta"] = meta.getMap()
        } else {
            delete msg["meta"]
        }
    };
    ReliableMessage.prototype.getVisa = function() {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.prototype.setVisa = function(doc) {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.getVisa = function(msg) {
        var doc = msg["visa"];
        if (!doc) {
            doc = msg["profile"]
        }
        return Document.parse(doc)
    };
    ReliableMessage.setVisa = function(doc, msg) {
        delete msg["visa"];
        if (doc) {
            msg["profile"] = doc.getMap()
        } else {
            delete msg["profile"]
        }
    };
    ReliableMessage.prototype.verify = function() {
        console.assert(false, "implement me!");
        return null
    };
    ns.protocol.ReliableMessage = ReliableMessage;
    ns.protocol.register("ReliableMessage")
})(DaoKeDao);
(function(ns) {
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ReliableMessageDelegate = function() {};
    ns.Interface(ReliableMessageDelegate, [SecureMessage.Delegate]);
    ReliableMessageDelegate.prototype.decodeSignature = function(signature, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessageDelegate.prototype.verifyDataSignature = function(data, signature, sender, rMsg) {
        console.assert(false, "implement me!");
        return false
    };
    ReliableMessage.Delegate = ReliableMessageDelegate
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ReliableMessageFactory = function() {};
    ns.Interface(ReliableMessageFactory, null);
    ReliableMessageFactory.prototype.parseReliableMessage = function(msg) {
        console.assert(false, "implement me!");
        return null
    };
    ReliableMessage.Factory = ReliableMessageFactory;
    var s_factory = null;
    ReliableMessage.getFactory = function() {
        return s_factory
    };
    ReliableMessage.setFactory = function(factory) {
        s_factory = factory
    };
    ReliableMessage.parse = function(msg) {
        if (!msg) {
            return null
        } else {
            if (ns.Interface.conforms(msg, ReliableMessage)) {
                return msg
            } else {
                if (ns.Interface.conforms(msg, map)) {
                    msg = msg.getMap()
                }
            }
        }
        return ReliableMessage.getFactory().parseReliableMessage(msg)
    }
})(DaoKeDao);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
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
    var BaseContent = function(info) {
        var content, type, sn, time;
        if (info instanceof ContentType) {
            type = info.valueOf();
            sn = null;
            time = null;
            content = {
                "type": type
            }
        } else {
            if (typeof info === "number") {
                type = info;
                sn = null;
                time = null;
                content = {
                    "type": type
                }
            } else {
                content = info;
                type = Content.getType(content);
                sn = Content.getSerialNumber(content);
                time = Content.getTime(content)
            }
        }
        if (!sn) {
            sn = randomPositiveInteger();
            content["sn"] = sn
        }
        if (!time) {
            time = new Date();
            content["time"] = time.getTime() / 1000
        }
        Dictionary.call(this, content);
        this.__type = type;
        this.__sn = sn;
        this.__time = time
    };
    ns.Class(BaseContent, Dictionary, [Content]);
    BaseContent.prototype.getType = function() {
        return this.__type
    };
    BaseContent.prototype.getSerialNumber = function() {
        return this.__sn
    };
    BaseContent.prototype.getTime = function() {
        return this.__time
    };
    BaseContent.prototype.getGroup = function() {
        return Content.getGroup(this.getMap())
    };
    BaseContent.prototype.setGroup = function(identifier) {
        Content.setGroup(identifier, this.getMap())
    };
    ns.BaseContent = BaseContent;
    ns.register("BaseContent")
})(DaoKeDao);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = function() {
        var from, to, when;
        var env;
        if (arguments.length === 1) {
            env = arguments[0];
            from = Envelope.getSender(env);
            to = Envelope.getReceiver(env);
            when = Envelope.getTime(env)
        } else {
            if (arguments.length === 2) {
                from = arguments[0];
                to = arguments[1];
                when = new Date();
                env = {
                    "sender": from.toString(),
                    "receiver": to.toString(),
                    "time": Math.ceil(when.getTime() / 1000)
                }
            } else {
                if (arguments.length === 3) {
                    from = arguments[0];
                    to = arguments[1];
                    if (arguments[2] instanceof Date) {
                        when = arguments[2]
                    } else {
                        when = new Date(arguments[2] * 1000)
                    }
                    env = {
                        "sender": from.toString(),
                        "receiver": to.toString(),
                        "time": Math.ceil(when.getTime() / 1000)
                    }
                } else {
                    throw new SyntaxError("envelope arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, env);
        this.__sender = from;
        this.__receiver = to;
        this.__time = when
    };
    ns.Class(MessageEnvelope, Dictionary, [Envelope]);
    MessageEnvelope.prototype.getSender = function() {
        return this.__sender
    };
    MessageEnvelope.prototype.getReceiver = function() {
        return this.__receiver
    };
    MessageEnvelope.prototype.getTime = function() {
        return this.__time
    };
    MessageEnvelope.prototype.getGroup = function() {
        return Envelope.getGroup(this.getMap())
    };
    MessageEnvelope.prototype.setGroup = function(identifier) {
        Envelope.setGroup(identifier, this.getMap())
    };
    MessageEnvelope.prototype.getType = function() {
        return Envelope.getType(this.getMap())
    };
    MessageEnvelope.prototype.setType = function(type) {
        Envelope.setType(type, this.getMap())
    };
    ns.MessageEnvelope = MessageEnvelope;
    ns.register("MessageEnvelope")
})(DaoKeDao);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var Envelope = ns.protocol.Envelope;
    var Message = ns.protocol.Message;
    var BaseMessage = function(msg) {
        var env;
        if (ns.Interface.conforms(msg, Envelope)) {
            env = msg;
            msg = env.getMap()
        } else {
            env = Message.getEnvelope(msg)
        }
        Dictionary.call(this, msg);
        this.__envelope = env;
        this.__delegate = null
    };
    ns.Class(BaseMessage, Dictionary, [Message]);
    BaseMessage.prototype.getDelegate = function() {
        return this.__delegate
    };
    BaseMessage.prototype.setDelegate = function(delegate) {
        this.__delegate = delegate
    };
    BaseMessage.prototype.getEnvelope = function() {
        return this.__envelope
    };
    BaseMessage.prototype.getSender = function() {
        return this.getEnvelope().getSender()
    };
    BaseMessage.prototype.getReceiver = function() {
        return this.getEnvelope().getReceiver()
    };
    BaseMessage.prototype.getTime = function() {
        return this.getEnvelope().getTime()
    };
    BaseMessage.prototype.getGroup = function() {
        return this.getEnvelope().getGroup()
    };
    BaseMessage.prototype.getType = function() {
        return this.getEnvelope().getTime()
    };
    ns.BaseMessage = BaseMessage;
    ns.register("BaseMessage")
})(DaoKeDao);
(function(ns) {
    var Message = ns.protocol.Message;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var BaseMessage = ns.BaseMessage;
    var PlainMessage = function() {
        var msg, head, body;
        if (arguments.length === 1) {
            msg = arguments[0];
            head = Message.getEnvelope(msg);
            body = InstantMessage.getContent(msg)
        } else {
            if (arguments.length === 2) {
                head = arguments[0];
                body = arguments[1];
                msg = head.getMap();
                msg["content"] = body.getMap()
            } else {
                throw new SyntaxError("message arguments error: " + arguments)
            }
        }
        BaseMessage.call(this, msg);
        this.__envelope = head;
        this.__content = body
    };
    ns.Class(PlainMessage, BaseMessage, [InstantMessage]);
    PlainMessage.prototype.getContent = function() {
        return this.__content
    };
    PlainMessage.prototype.getTime = function() {
        var time = this.getContent().getTime();
        if (!time) {
            time = this.getEnvelope().getTime()
        }
        return time
    };
    PlainMessage.prototype.getGroup = function() {
        return this.getContent().getGroup()
    };
    PlainMessage.prototype.getType = function() {
        return this.getContent().getType()
    };
    PlainMessage.prototype.encrypt = function(password, members) {
        if (members && members.length > 0) {
            return encrypt_group_message.call(this, password, members)
        } else {
            return encrypt_message.call(this, password)
        }
    };
    var encrypt_message = function(password) {
        var delegate = this.getDelegate();
        var msg = prepare_data.call(this, password);
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg)
        }
        var data = delegate.encryptKey(key, this.getReceiver(), this);
        if (!data) {
            return null
        }
        msg["key"] = delegate.encodeKey(data, this);
        return SecureMessage.parse(msg)
    };
    var encrypt_group_message = function(password, members) {
        var delegate = this.getDelegate();
        var msg = prepare_data.call(this, password);
        var key = delegate.serializeKey(password, this);
        if (!key) {
            return SecureMessage.parse(msg)
        }
        var keys = {};
        var count = 0;
        var member;
        var data;
        for (var i = 0; i < members.length; ++i) {
            member = members[i];
            data = delegate.encryptKey(key, member, this);
            if (!data) {
                continue
            }
            keys[member] = delegate.encodeKey(data, this);
            ++count
        }
        if (count > 0) {
            msg["keys"] = keys
        }
        return SecureMessage.parse(msg)
    };
    var prepare_data = function(password) {
        var delegate = this.getDelegate();
        var data = delegate.serializeContent(this.__content, password, this);
        data = delegate.encryptContent(data, password, this);
        var base64 = delegate.encodeData(data, this);
        var msg = this.copyMap();
        delete msg["content"];
        msg["data"] = base64;
        return msg
    };
    ns.PlainMessage = PlainMessage;
    ns.register("PlainMessage")
})(DaoKeDao);
(function(ns) {
    var map = ns.type.Map;
    var InstantMessage = ns.protocol.InstantMessage;
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var BaseMessage = ns.BaseMessage;
    var EncryptedMessage = function(msg) {
        BaseMessage.call(this, msg);
        this.__data = null;
        this.__key = null;
        this.__keys = null
    };
    ns.Class(EncryptedMessage, BaseMessage, [SecureMessage]);
    EncryptedMessage.prototype.getData = function() {
        if (!this.__data) {
            var base64 = this.getValue("data");
            this.__data = this.getDelegate().decodeData(base64, this)
        }
        return this.__data
    };
    EncryptedMessage.prototype.getEncryptedKey = function() {
        if (!this.__key) {
            var base64 = this.getValue("key");
            if (!base64) {
                var keys = this.getEncryptedKeys();
                if (keys) {
                    var receiver = this.getReceiver();
                    base64 = keys[receiver.toString()]
                }
            }
            if (base64) {
                this.__key = this.getDelegate().decodeKey(base64, this)
            }
        }
        return this.__key
    };
    EncryptedMessage.prototype.getEncryptedKeys = function() {
        if (!this.__keys) {
            this.__keys = this.getValue("keys")
        }
        return this.__keys
    };
    EncryptedMessage.prototype.decrypt = function() {
        var sender = this.getSender();
        var receiver;
        var group = this.getGroup();
        if (group) {
            receiver = group
        } else {
            receiver = this.getReceiver()
        }
        var delegate = this.getDelegate();
        var key = this.getEncryptedKey();
        if (key) {
            key = delegate.decryptKey(key, sender, receiver, this);
            if (!key) {
                throw new Error("failed to decrypt key in msg: " + this)
            }
        }
        var password = delegate.deserializeKey(key, sender, receiver, this);
        if (!password) {
            throw new Error("failed to get msg key: " + sender + " -> " + receiver + ", " + key)
        }
        var data = this.getData();
        if (!data) {
            throw new Error("failed to decode content data: " + this)
        }
        data = delegate.decryptContent(data, password, this);
        if (!data) {
            throw new Error("failed to decrypt data with key: " + password)
        }
        var content = delegate.deserializeContent(data, password, this);
        if (!content) {
            throw new Error("failed to deserialize content: " + data)
        }
        var msg = this.copyMap();
        delete msg["key"];
        delete msg["keys"];
        delete msg["data"];
        msg["content"] = content.getMap();
        return InstantMessage.parse(msg)
    };
    EncryptedMessage.prototype.sign = function() {
        var delegate = this.getDelegate();
        var signature = delegate.signData(this.getData(), this.getSender(), this);
        var base64 = delegate.encodeSignature(signature, this);
        var msg = this.copyMap();
        msg["signature"] = base64;
        return ReliableMessage.parse(msg)
    };
    EncryptedMessage.prototype.split = function(members) {
        var msg = this.copyMap();
        var keys = this.getEncryptedKeys();
        if (keys) {
            delete msg["keys"]
        } else {
            keys = {}
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
                msg["key"] = base64
            } else {
                delete msg["key"]
            }
            item = SecureMessage.parse(map.copyMap(msg));
            if (item) {
                messages.push(item)
            }
        }
        return messages
    };
    EncryptedMessage.prototype.trim = function(member) {
        var msg = this.copyMap();
        var keys = this.getEncryptedKeys();
        if (keys) {
            var base64 = keys[member.toString()];
            if (base64) {
                msg["key"] = base64
            }
            delete msg["keys"]
        }
        var group = this.getGroup();
        if (!group) {
            msg["group"] = this.getReceiver().toString()
        }
        msg["receiver"] = member.toString();
        return SecureMessage.parse(msg)
    };
    ns.EncryptedMessage = EncryptedMessage;
    ns.register("EncryptedMessage")
})(DaoKeDao);
(function(ns) {
    var SecureMessage = ns.protocol.SecureMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var EncryptedMessage = ns.EncryptedMessage;
    var NetworkMessage = function(msg) {
        EncryptedMessage.call(this, msg);
        this.__signature = null;
        this.__meta = null;
        this.__visa = null
    };
    ns.Class(NetworkMessage, EncryptedMessage, [ReliableMessage]);
    NetworkMessage.prototype.getSignature = function() {
        if (!this.__signature) {
            var base64 = this.getValue("signature");
            this.__signature = this.getDelegate().decodeSignature(base64, this)
        }
        return this.__signature
    };
    NetworkMessage.prototype.setMeta = function(meta) {
        ReliableMessage.setMeta(meta, this.getMap());
        this.__meta = meta
    };
    NetworkMessage.prototype.getMeta = function() {
        if (!this.__meta) {
            this.__meta = ReliableMessage.getMeta(this.getMap())
        }
        return this.__meta
    };
    NetworkMessage.prototype.setVisa = function(visa) {
        ReliableMessage.setVisa(visa, this.getMap());
        this.__visa = visa
    };
    NetworkMessage.prototype.getVisa = function() {
        if (!this.__visa) {
            this.__visa = ReliableMessage.getVisa(this.getMap())
        }
        return this.__visa
    };
    NetworkMessage.prototype.verify = function() {
        var data = this.getData();
        if (!data) {
            throw new Error("failed to decode content data: " + this)
        }
        var signature = this.getSignature();
        if (!signature) {
            throw new Error("failed to decode message signature: " + this)
        }
        if (this.getDelegate().verifyDataSignature(data, signature, this.getSender(), this)) {
            var msg = this.copyMap();
            delete msg["signature"];
            return SecureMessage.parse(msg)
        } else {
            return null
        }
    };
    ns.NetworkMessage = NetworkMessage;
    ns.register("NetworkMessage")
})(DaoKeDao);
(function(ns) {
    var Envelope = ns.protocol.Envelope;
    var MessageEnvelope = ns.MessageEnvelope;
    var EnvelopeFactory = function() {};
    ns.Class(EnvelopeFactory, null, [Envelope.Factory]);
    EnvelopeFactory.prototype.createEnvelope = function(from, to, when) {
        if (!when) {
            when = new Date()
        }
        return new MessageEnvelope(from, to, when)
    };
    EnvelopeFactory.prototype.parseEnvelope = function(env) {
        if (!env || !env["sender"]) {
            return null
        }
        return new MessageEnvelope(env)
    };
    Envelope.setFactory(new EnvelopeFactory());
    ns.EnvelopeFactory = EnvelopeFactory;
    ns.register("EnvelopeFactory")
})(DaoKeDao);
(function(ns) {
    var InstantMessage = ns.protocol.InstantMessage;
    var PlainMessage = ns.PlainMessage;
    var InstantMessageFactory = function() {};
    ns.Class(InstantMessageFactory, null, [InstantMessage.Factory]);
    InstantMessageFactory.prototype.createInstantMessage = function(head, body) {
        return new PlainMessage(head, body)
    };
    InstantMessageFactory.prototype.parseInstantMessage = function(msg) {
        return new PlainMessage(msg)
    };
    InstantMessage.setFactory(new InstantMessageFactory());
    ns.InstantMessageFactory = InstantMessageFactory;
    ns.register("InstantMessageFactory")
})(DaoKeDao);
(function(ns) {
    var SecureMessage = ns.protocol.SecureMessage;
    var EncryptedMessage = ns.EncryptedMessage;
    var SecureMessageFactory = function() {};
    ns.Class(SecureMessageFactory, null, [SecureMessage.Factory]);
    SecureMessageFactory.prototype.parseSecureMessage = function(msg) {
        return new EncryptedMessage(msg)
    };
    SecureMessage.setFactory(new SecureMessageFactory());
    ns.SecureMessageFactory = SecureMessageFactory;
    ns.register("SecureMessageFactory")
})(DaoKeDao);
(function(ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var NetworkMessage = ns.NetworkMessage;
    var ReliableMessageFactory = function() {};
    ns.Class(ReliableMessageFactory, null, [ReliableMessage.Factory]);
    ReliableMessageFactory.prototype.parseReliableMessage = function(msg) {
        return new NetworkMessage(msg)
    };
    ReliableMessage.setFactory(new ReliableMessageFactory());
    ns.ReliableMessageFactory = ReliableMessageFactory;
    ns.register("ReliableMessageFactory")
})(DaoKeDao);
if (typeof DIMP !== "object") {
    DIMP = {}
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.core !== "object") {
        ns.core = {}
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    if (typeof ns.protocol.group !== "object") {
        ns.protocol.group = {}
    }
    ns.Namespace(ns.core);
    ns.Namespace(ns.protocol);
    ns.Namespace(ns.protocol.group);
    ns.register("core");
    ns.register("protocol");
    ns.protocol.register("group")
})(DIMP, DaoKeDao);
(function(ns) {
    var ReliableMessage = ns.protocol.ReliableMessage;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var ForwardContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FORWARD);
            this.__forward = null
        } else {
            if (ns.Interface.conforms(arguments[0], ReliableMessage)) {
                BaseContent.call(this, ContentType.FORWARD);
                this.setMessage(arguments[0])
            } else {
                BaseContent.call(this, arguments[0]);
                this.__forward = null
            }
        }
    };
    ns.Class(ForwardContent, BaseContent, null);
    ForwardContent.getMessage = function(content) {
        var secret = content["forward"];
        if (secret) {
            return ReliableMessage.parse(secret)
        } else {
            return null
        }
    };
    ForwardContent.setMessage = function(secret, content) {
        if (secret) {
            content["forward"] = secret.getMap()
        } else {
            delete content["forward"]
        }
    };
    ForwardContent.prototype.getMessage = function() {
        if (!this.__forward) {
            this.__forward = ForwardContent.getMessage(this.getMap())
        }
        return this.__forward
    };
    ForwardContent.prototype.setMessage = function(secret) {
        ForwardContent.setMessage(secret, this.getMap());
        this.__forward = secret
    };
    ns.protocol.ForwardContent = ForwardContent;
    ns.protocol.register("ForwardContent")
})(DaoKeDao);
(function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var FileContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.FILE);
            this.__data = null
        } else {
            if (arguments.length === 1) {
                BaseContent.call(this, arguments[0]);
                this.__data = null
            } else {
                if (arguments.length === 2) {
                    BaseContent.call(this, ContentType.FILE);
                    this.setFilename(arguments[0]);
                    this.setData(arguments[1])
                } else {
                    if (arguments.length === 3) {
                        BaseContent.call(this, arguments[0]);
                        this.setFilename(arguments[1]);
                        this.setData(arguments[2])
                    } else {
                        throw new SyntaxError("file content arguments error: " + arguments)
                    }
                }
            }
        }
        this.__password = null
    };
    ns.Class(FileContent, BaseContent, null);
    FileContent.getURL = function(content) {
        return content["URL"]
    };
    FileContent.setURL = function(url, content) {
        if (url && url.indexOf("://") > 0) {
            content["URL"] = url
        } else {
            delete content["URL"]
        }
    };
    FileContent.getFilename = function(content) {
        return content["filename"]
    };
    FileContent.setFilename = function(filename, content) {
        if (filename && filename.length > 0) {
            content["filename"] = filename
        } else {
            delete content["filename"]
        }
    };
    FileContent.getData = function(content) {
        var base64 = content["data"];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    FileContent.setData = function(data, content) {
        if (data && data.length > 0) {
            content["data"] = ns.format.Base64.encode(data)
        } else {
            delete content["data"]
        }
    };
    FileContent.getPassword = function(content) {
        var key = content["password"];
        if (key) {
            return SymmetricKey.parse(key)
        } else {
            return null
        }
    };
    FileContent.setPassword = function(key, content) {
        if (key) {
            content["password"] = key.getMap()
        } else {
            delete content["password"]
        }
    };
    FileContent.prototype.getURL = function() {
        return FileContent.getURL(this.getMap())
    };
    FileContent.prototype.setURL = function(url) {
        FileContent.setURL(url, this.getMap())
    };
    FileContent.prototype.getFilename = function() {
        return FileContent.getFilename(this.getMap())
    };
    FileContent.prototype.setFilename = function(filename) {
        FileContent.setFilename(filename, this.getMap())
    };
    FileContent.prototype.getData = function() {
        if (!this.__data) {
            this.__data = FileContent.getData(this.getMap())
        }
        return this.__data
    };
    FileContent.prototype.setData = function(data) {
        FileContent.setData(data, this.getMap());
        this.__data = data
    };
    FileContent.prototype.getPassword = function() {
        if (!this.__password) {
            this.__password = FileContent.getPassword(console)
        }
        return this.__password
    };
    FileContent.prototype.setPassword = function(key) {
        FileContent.setPassword(key, this.getMap());
        this.__password = key
    };
    ns.protocol.FileContent = FileContent;
    ns.protocol.register("FileContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var ImageContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.IMAGE)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.IMAGE, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("image content arguments error: " + arguments)
                }
            }
        }
        this.__thumbnail = null
    };
    ns.Class(ImageContent, FileContent, null);
    ImageContent.getThumbnail = function(content) {
        var base64 = content["thumbnail"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    ImageContent.setThumbnail = function(image, content) {
        if (image && image.length > 0) {
            content["thumbnail"] = ns.format.Base64.encode(image)
        } else {
            delete content["thumbnail"]
        }
    };
    ImageContent.prototype.getThumbnail = function() {
        if (!this.__thumbnail) {
            this.__thumbnail = ImageContent.getThumbnail(this.getMap())
        }
        return this.__thumbnail
    };
    ImageContent.prototype.setThumbnail = function(image) {
        ImageContent.setThumbnail(image, this.getMap());
        this.__thumbnail = image
    };
    ns.protocol.ImageContent = ImageContent;
    ns.protocol.register("ImageContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var VideoContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.VIDEO)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.VIDEO, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("video content arguments error: " + arguments)
                }
            }
        }
        this.__snapshot = null
    };
    ns.Class(VideoContent, FileContent, null);
    VideoContent.getSnapshot = function(content) {
        var base64 = content["snapshot"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    VideoContent.setSnapshot = function(image, content) {
        if (image && image.length > 0) {
            content["snapshot"] = ns.format.Base64.encode(image)
        } else {
            delete content["snapshot"]
        }
    };
    VideoContent.prototype.getSnapshot = function() {
        if (!this.__snapshot) {
            this.__snapshot = VideoContent.getSnapshot(this.getMap())
        }
        return this.__snapshot
    };
    VideoContent.prototype.setSnapshot = function(image) {
        VideoContent.setSnapshot(image, this.getMap());
        this.__snapshot = image
    };
    ns.protocol.VideoContent = VideoContent;
    ns.protocol.register("VideoContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var FileContent = ns.protocol.FileContent;
    var AudioContent = function() {
        if (arguments.length === 0) {
            FileContent.call(this, ContentType.AUDIO)
        } else {
            if (arguments.length === 1) {
                FileContent.call(this, arguments[0])
            } else {
                if (arguments.length === 2) {
                    FileContent.call(this, ContentType.AUDIO, arguments[0], arguments[1])
                } else {
                    throw new SyntaxError("audio content arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(AudioContent, FileContent, null);
    AudioContent.prototype.getText = function() {
        return this.getValue("text")
    };
    AudioContent.prototype.setText = function(asr) {
        this.setValue("text", asr)
    };
    ns.protocol.AudioContent = AudioContent;
    ns.protocol.register("AudioContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var TextContent = function() {
        if (arguments.length === 0) {
            BaseContent.call(this, ContentType.TEXT)
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.TEXT);
                this.setText(arguments[0])
            } else {
                BaseContent.call(this, arguments[0])
            }
        }
    };
    ns.Class(TextContent, BaseContent, null);
    TextContent.prototype.getText = function() {
        return this.getValue("text")
    };
    TextContent.prototype.setText = function(text) {
        this.setValue("text", text)
    };
    ns.protocol.TextContent = TextContent;
    ns.protocol.register("TextContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var PageContent = function() {
        if (arguments.length === 1) {
            BaseContent.call(this, arguments[0]);
            this.__icon = null
        } else {
            if (arguments.length === 4) {
                BaseContent.call(this, ContentType.PAGE);
                this.setURL(arguments[0]);
                this.setTitle(arguments[1]);
                this.setDesc(arguments[2]);
                this.setIcon(arguments[3])
            } else {
                throw new SyntaxError("web page content arguments error: " + arguments)
            }
        }
    };
    ns.Class(PageContent, BaseContent, null);
    PageContent.getURL = function(content) {
        return content["URL"]
    };
    PageContent.setURL = function(url, content) {
        if (url && url.indexOf("://") > 0) {
            content["URL"] = url
        } else {
            delete content["URL"]
        }
    };
    PageContent.getTitle = function(content) {
        return content["title"]
    };
    PageContent.setTitle = function(title, content) {
        if (title && title.length > 0) {
            content["title"] = title
        } else {
            delete content["title"]
        }
    };
    PageContent.getDesc = function(content) {
        return content["desc"]
    };
    PageContent.setDesc = function(text, content) {
        if (text && text.length > 0) {
            content["desc"] = text
        } else {
            delete content["desc"]
        }
    };
    PageContent.getIcon = function(content) {
        var base64 = content["icon"];
        if (base64 && base64.length > 0) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    PageContent.setIcon = function(image, content) {
        if (image && image.length > 0) {
            content["icon"] = ns.format.Base64.encode(image)
        } else {
            delete content["icon"]
        }
    };
    PageContent.prototype.getURL = function() {
        return PageContent.getURL(this.getMap())
    };
    PageContent.prototype.setURL = function(url) {
        PageContent.setURL(url, this.getMap())
    };
    PageContent.prototype.getTitle = function() {
        return PageContent.getTitle(this.getMap())
    };
    PageContent.prototype.setTitle = function(title) {
        PageContent.setTitle(title, this.getMap())
    };
    PageContent.prototype.getDesc = function() {
        return PageContent.getDesc(this.getMap())
    };
    PageContent.prototype.setDesc = function(text) {
        PageContent.setDesc(text, this.getMap())
    };
    PageContent.prototype.getIcon = function() {
        if (!this.__icon) {
            this.__icon = PageContent.getIcon(this.getMap())
        }
        return this.__icon
    };
    PageContent.prototype.setIcon = function(image) {
        PageContent.setIcon(image, this.getMap());
        this.__icon = image
    };
    ns.protocol.PageContent = PageContent;
    ns.protocol.register("PageContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var MoneyContent = function() {
        if (arguments.length === 3) {
            BaseContent.call(arguments[0]);
            this.setCurrency(arguments[1]);
            this.setAmount(arguments[2])
        } else {
            if (arguments.length === 2) {
                BaseContent.call(ContentType.MONEY);
                this.setCurrency(arguments[0]);
                this.setAmount(arguments[1])
            } else {
                if (typeof arguments[0] === "string") {
                    BaseContent.call(ContentType.MONEY);
                    this.setCurrency(arguments[0])
                } else {
                    BaseContent.call(arguments[0])
                }
            }
        }
    };
    ns.Class(MoneyContent, BaseContent, null);
    MoneyContent.getCurrency = function(content) {
        return content["currency"]
    };
    MoneyContent.setCurrency = function(currency, content) {
        content["currency"] = currency
    };
    MoneyContent.getAmount = function(content) {
        return content["amount"]
    };
    MoneyContent.setAmount = function(amount, content) {
        content["amount"] = amount
    };
    MoneyContent.prototype.getCurrency = function() {
        return MoneyContent.getCurrency(this.getMap())
    };
    MoneyContent.prototype.setCurrency = function(currency) {
        MoneyContent.setCurrency(currency, this.getMap())
    };
    MoneyContent.prototype.getAmount = function() {
        return MoneyContent.getAmount(this.getMap())
    };
    MoneyContent.prototype.setAmount = function(amount) {
        MoneyContent.setAmount(amount, this.getMap())
    };
    ns.protocol.MoneyContent = MoneyContent;
    ns.protocol.register("MoneyContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var MoneyContent = ns.MoneyContent;
    var TransferContent = function() {
        if (arguments.length === 2) {
            MoneyContent.call(ContentType.TRANSFER, arguments[0], arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                MoneyContent.call(ContentType.TRANSFER, arguments[0], 0)
            } else {
                MoneyContent.call(arguments[0])
            }
        }
    };
    ns.Class(TransferContent, MoneyContent, null);
    ns.protocol.TransferContent = TransferContent;
    ns.protocol.register("TransferContent")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var BaseContent = ns.BaseContent;
    var Command = function() {
        if (arguments.length === 2) {
            BaseContent.call(this, arguments[0]);
            this.setCommand(arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                BaseContent.call(this, ContentType.COMMAND);
                this.setCommand(arguments[0])
            } else {
                BaseContent.call(this, arguments[0])
            }
        }
    };
    ns.Class(Command, BaseContent, null);
    Command.getCommand = function(cmd) {
        return cmd["command"]
    };
    Command.setCommand = function(name, cmd) {
        if (name && name.length > 0) {
            cmd["command"] = name
        } else {
            delete cmd["command"]
        }
    };
    Command.prototype.getCommand = function() {
        return Command.getCommand(this.getMap())
    };
    Command.prototype.setCommand = function(name) {
        Command.setCommand(name, this.getMap())
    };
    Command.META = "meta";
    Command.PROFILE = "profile";
    Command.DOCUMENT = "document";
    Command.RECEIPT = "receipt";
    Command.HANDSHAKE = "handshake";
    Command.LOGIN = "login";
    ns.protocol.Command = Command;
    ns.protocol.register("Command")
})(DIMP);
(function(ns) {
    var Command = ns.protocol.Command;
    var CommandFactory = function() {};
    ns.Interface(CommandFactory, null);
    CommandFactory.prototype.parseCommand = function(cmd) {
        console.assert(false, "implement me!");
        return null
    };
    Command.Factory = CommandFactory;
    var s_factories = {};
    Command.register = function(name, factory) {
        s_factories[name] = factory
    };
    Command.getFactory = function(name) {
        return s_factories[name]
    }
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Command = ns.protocol.Command;
    var MetaCommand = function() {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0])
            } else {
                Command.call(this, arguments[0]);
                this.__identifier = null
            }
            this.__meta = null
        } else {
            if (arguments.length === 2) {
                Command.call(this, Command.META);
                this.setIdentifier(arguments[0]);
                this.setMeta(arguments[1])
            } else {
                if (arguments.length === 3) {
                    Command.call(this, arguments[0]);
                    this.setIdentifier(arguments[1]);
                    this.setMeta(arguments[2])
                } else {
                    throw new SyntaxError("meta command arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(MetaCommand, Command, null);
    MetaCommand.getIdentifier = function(cmd) {
        return ID.parse(cmd["ID"])
    };
    MetaCommand.setIdentifier = function(identifier, cmd) {
        if (identifier) {
            cmd["ID"] = identifier.toString()
        } else {
            delete cmd["ID"]
        }
    };
    MetaCommand.getMeta = function(cmd) {
        return Meta.parse(cmd["meta"])
    };
    MetaCommand.setMeta = function(meta, cmd) {
        if (meta) {
            cmd["meta"] = meta.getMap()
        } else {
            delete cmd["meta"]
        }
    };
    MetaCommand.prototype.getIdentifier = function() {
        if (!this.__identifier) {
            this.__identifier = MetaCommand.getIdentifier(this.getMap())
        }
        return this.__identifier
    };
    MetaCommand.prototype.setIdentifier = function(identifier) {
        MetaCommand.setIdentifier(identifier, this.getMap());
        this.__identifier = identifier
    };
    MetaCommand.prototype.getMeta = function() {
        if (!this.__meta) {
            this.__meta = MetaCommand.getMeta(this.getMap())
        }
        return this.__meta
    };
    MetaCommand.prototype.setMeta = function(meta) {
        MetaCommand.setMeta(meta, this.getMap());
        this.__meta = meta
    };
    MetaCommand.query = function(identifier) {
        return new MetaCommand(identifier)
    };
    MetaCommand.response = function(identifier, meta) {
        return new MetaCommand(identifier, meta)
    };
    ns.protocol.MetaCommand = MetaCommand;
    ns.protocol.register("MetaCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var Command = ns.protocol.Command;
    var MetaCommand = ns.protocol.MetaCommand;
    var DocumentCommand = function() {
        if (arguments.length === 1) {
            if (ns.Interface.conforms(arguments[0], ID)) {
                MetaCommand.call(this, Command.PROFILE, arguments[0])
            } else {
                MetaCommand.call(this, arguments[0])
            }
            this.__document = null
        } else {
            if (arguments.length === 2) {
                if (ns.Interface.conforms(arguments[1], Meta)) {
                    MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1])
                } else {
                    if (typeof arguments[1] === "string") {
                        MetaCommand.call(this, Command.PROFILE, arguments[0], null);
                        this.setSignature(arguments[1])
                    } else {
                        throw new SyntaxError("document command arguments error: " + arguments)
                    }
                }
                this.__document = null
            } else {
                if (arguments.length === 3) {
                    MetaCommand.call(this, Command.PROFILE, arguments[0], arguments[1]);
                    this.setDocument(arguments[2])
                } else {
                    throw new SyntaxError("document command arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(DocumentCommand, MetaCommand, null);
    DocumentCommand.getDocument = function(cmd) {
        var data = cmd["profile"];
        if (!data) {
            data = cmd["document"]
        } else {
            if (typeof data === "string") {
                data = {
                    "ID": cmd["ID"],
                    "data": data,
                    "signature": cmd["signature"]
                }
            }
        }
        if (data) {
            return Document.parse(data)
        } else {
            return null
        }
    };
    DocumentCommand.setDocument = function(doc, cmd) {
        if (doc) {
            cmd["document"] = doc.getMap()
        } else {
            delete cmd["command"]
        }
    };
    DocumentCommand.getSignature = function(cmd) {
        return cmd["signature"]
    };
    DocumentCommand.setSignature = function(base64, cmd) {
        cmd["signature"] = base64
    };
    DocumentCommand.prototype.getDocument = function() {
        if (!this.__document) {
            this.__document = DocumentCommand.getDocument(this.getMap())
        }
        return this.__document
    };
    DocumentCommand.prototype.setDocument = function(doc) {
        DocumentCommand.setDocument(doc, this.getMap());
        this.__document = doc
    };
    DocumentCommand.prototype.getSignature = function() {
        return DocumentCommand.getSignature(this.getMap())
    };
    DocumentCommand.prototype.setSignature = function(base64) {
        DocumentCommand.setSignature(base64, this.getMap())
    };
    DocumentCommand.query = function(identifier, signature) {
        return new DocumentCommand(identifier, signature)
    };
    DocumentCommand.response = function(identifier, meta, doc) {
        return new DocumentCommand(identifier, meta, doc)
    };
    ns.protocol.DocumentCommand = DocumentCommand;
    ns.protocol.register("DocumentCommand")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Command = ns.protocol.Command;
    var HistoryCommand = function() {
        if (arguments.length === 2) {
            Command.call(this, arguments[0], arguments[1])
        } else {
            if (typeof arguments[0] === "string") {
                Command.call(this, ContentType.HISTORY, arguments[0])
            } else {
                Command.call(this, arguments[0])
            }
        }
    };
    ns.Class(HistoryCommand, Command, null);
    HistoryCommand.register = Command.register;
    HistoryCommand.REGISTER = "register";
    HistoryCommand.SUICIDE = "suicide";
    ns.protocol.HistoryCommand = HistoryCommand;
    ns.protocol.register("HistoryCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = function() {
        if (arguments.length === 1) {
            HistoryCommand.call(this, arguments[0]);
            this.__member = null;
            this.__members = null
        } else {
            if (arguments.length === 2) {
                HistoryCommand.call(this, arguments[0]);
                this.setGroup(arguments[1]);
                this.__member = null;
                this.__members = null
            } else {
                if (arguments[2] instanceof Array) {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.__member = null;
                    this.setMembers(arguments[2])
                } else {
                    HistoryCommand.call(this, arguments[0]);
                    this.setGroup(arguments[1]);
                    this.setMember(arguments[2]);
                    this.__members = null
                }
            }
        }
    };
    ns.Class(GroupCommand, HistoryCommand, null);
    GroupCommand.getMember = function(cmd) {
        return ID.parse(cmd["member"])
    };
    GroupCommand.setMember = function(member, cmd) {
        if (member) {
            cmd["member"] = member.toString()
        } else {
            delete cmd["member"]
        }
    };
    GroupCommand.getMembers = function(cmd) {
        var members = cmd["members"];
        if (members) {
            return ID.convert(members)
        } else {
            return null
        }
    };
    GroupCommand.setMembers = function(members, cmd) {
        if (members && members.length > 0) {
            cmd["members"] = ID.revert(members)
        } else {
            delete cmd["members"]
        }
    };
    GroupCommand.prototype.getMember = function() {
        if (!this.__member) {
            this.__member = GroupCommand.getMember(this.getMap())
        }
        return this.__member
    };
    GroupCommand.prototype.setMember = function(identifier) {
        GroupCommand.setMembers(null, this.getMap());
        GroupCommand.setMember(identifier, this.getMap());
        this.__member = identifier
    };
    GroupCommand.prototype.getMembers = function() {
        if (!this.__members) {
            this.__members = GroupCommand.getMembers(this.getMap())
        }
        return this.__members
    };
    GroupCommand.prototype.setMembers = function(members) {
        GroupCommand.setMember(null, this.getMap());
        GroupCommand.setMembers(members, this.getMap());
        this.__members = members
    };
    GroupCommand.register = HistoryCommand.register;
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
    ns.protocol.GroupCommand = GroupCommand;
    ns.protocol.register("GroupCommand")
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var GroupCommand = ns.protocol.GroupCommand;
    var InviteCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.INVITE, arguments[0], arguments[1])
        }
    };
    ns.Class(InviteCommand, GroupCommand, null);
    var ExpelCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.EXPEL, arguments[0], arguments[1])
        }
    };
    ns.Class(ExpelCommand, GroupCommand, null);
    var JoinCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.JOIN, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(JoinCommand, GroupCommand, null);
    var QuitCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.QUIT, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(QuitCommand, GroupCommand, null);
    var ResetCommand = function() {
        if (arguments.length === 1) {
            GroupCommand.call(this, arguments[0])
        } else {
            GroupCommand.call(this, GroupCommand.RESET, arguments[0], arguments[1])
        }
    };
    ns.Class(ResetCommand, GroupCommand, null);
    var QueryCommand = function() {
        if (ns.Interface.conforms(arguments[0], ID)) {
            GroupCommand.call(this, GroupCommand.QUERY, arguments[0])
        } else {
            GroupCommand.call(this, arguments[0])
        }
    };
    ns.Class(QueryCommand, GroupCommand, null);
    GroupCommand.invite = function(group, members) {
        return new InviteCommand(group, members)
    };
    GroupCommand.expel = function(group, members) {
        return new ExpelCommand(group, members)
    };
    GroupCommand.join = function(group) {
        return new JoinCommand(group)
    };
    GroupCommand.quit = function(group) {
        return new QuitCommand(group)
    };
    GroupCommand.reset = function(group, members) {
        return new ResetCommand(group, members)
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
})(DIMP);
(function(ns) {
    var ID = ns.protocol.ID;
    var Entity = function(identifier) {
        this.identifier = identifier;
        this.__datasource = null
    };
    ns.Class(Entity, ns.type.Object, null);
    Entity.prototype.equals = function(other) {
        if (this === other) {
            return true
        } else {
            if (other instanceof Entity) {
                return this.identifier.equals(other.identifier)
            } else {
                if (ns.Interface.conforms(other, ID)) {
                    return this.identifier.equals(other)
                } else {
                    return false
                }
            }
        }
    };
    Entity.prototype.valueOf = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.toString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.toLocaleString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + ">"
    };
    Entity.prototype.getType = function() {
        return this.identifier.getType()
    };
    Entity.prototype.getDataSource = function() {
        return this.__datasource
    };
    Entity.prototype.setDataSource = function(delegate) {
        this.__datasource = delegate
    };
    Entity.prototype.getMeta = function() {
        return this.getDataSource().getMeta(this.identifier)
    };
    Entity.prototype.getDocument = function(type) {
        return this.getDataSource().getDocument(this.identifier, type)
    };
    ns.Entity = Entity;
    ns.register("Entity")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var EntityDataSource = function() {};
    ns.Interface(EntityDataSource, null);
    EntityDataSource.prototype.getMeta = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDataSource.prototype.getDocument = function(identifier, type) {
        console.assert(false, "implement me!");
        return null
    };
    Entity.DataSource = EntityDataSource
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var EntityDelegate = function() {};
    ns.Interface(EntityDelegate, null);
    EntityDelegate.prototype.selectLocalUser = function(receiver) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getUser = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    EntityDelegate.prototype.getGroup = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Entity.Delegate = EntityDelegate
})(DIMP);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Entity = ns.Entity;
    var User = function(identifier) {
        Entity.call(this, identifier)
    };
    ns.Class(User, Entity, null);
    User.prototype.getVisa = function() {
        var doc = this.getDocument(Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            return doc
        } else {
            return null
        }
    };
    User.prototype.getContacts = function() {
        return this.getDataSource().getContacts(this.identifier)
    };
    User.prototype.verify = function(data, signature) {
        var keys = this.getDataSource().getPublicKeysForVerification(this.identifier);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get verify keys for user: " + this.identifier)
        }
        for (var i = 0; i < keys.length; ++i) {
            if (keys[i].verify(data, signature)) {
                return true
            }
        }
        return false
    };
    User.prototype.encrypt = function(plaintext) {
        var key = this.getDataSource().getPublicKeyForEncryption(this.identifier);
        if (!key) {
            throw new Error("failed to get encrypt key for user: " + this.identifier)
        }
        return key.encrypt(plaintext)
    };
    User.prototype.sign = function(data) {
        var key = this.getDataSource().getPrivateKeyForSignature(this.identifier);
        if (!key) {
            throw new Error("failed to get sign key for user: " + this.identifier)
        }
        return key.sign(data)
    };
    User.prototype.decrypt = function(ciphertext) {
        var keys = this.getDataSource().getPrivateKeysForDecryption(this.identifier);
        if (!keys || keys.length === 0) {
            throw new Error("failed to get decrypt keys for user: " + this.identifier)
        }
        var plaintext;
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
    User.prototype.signVisa = function(visa) {
        if (!this.identifier.equals(visa.getIdentifier())) {
            return null
        }
        var key = this.getDataSource().getPrivateKeyForVisaSignature(this.identifier);
        if (!key) {
            throw new Error("failed to get sign key for user: " + this.identifier)
        }
        visa.sign(key);
        return visa
    };
    User.prototype.verifyVisa = function(visa) {
        if (!this.identifier.equals(visa.getIdentifier())) {
            return null
        }
        var key = this.getMeta().getKey();
        if (!key) {
            throw new Error("failed to get meta key for user: " + this.identifier)
        }
        return visa.verify(key)
    };
    ns.User = User;
    ns.register("User")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var User = ns.User;
    var UserDataSource = function() {};
    ns.Interface(UserDataSource, [Entity.DataSource]);
    UserDataSource.prototype.getContacts = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function(identifier) {
        return null
    };
    UserDataSource.prototype.getPublicKeysForVerification = function(identifier) {
        return null
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForVisaSignature = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    User.DataSource = UserDataSource
})(DIMP);
(function(ns) {
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.Entity;
    var Group = function(identifier) {
        Entity.call(this, identifier);
        this.__founder = null
    };
    ns.Class(Group, Entity, null);
    Group.prototype.getBulletin = function() {
        var doc = this.getDocument(Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            return doc
        } else {
            return null
        }
    };
    Group.prototype.getFounder = function() {
        if (!this.__founder) {
            this.__founder = this.getDataSource().getFounder(this.identifier)
        }
        return this.__founder
    };
    Group.prototype.getOwner = function() {
        return this.getDataSource().getOwner(this.identifier)
    };
    Group.prototype.getMembers = function() {
        return this.getDataSource().getMembers(this.identifier)
    };
    Group.prototype.getAssistants = function() {
        return this.getDataSource().getAssistants(this.identifier)
    };
    ns.Group = Group;
    ns.register("Group")
})(DIMP);
(function(ns) {
    var Entity = ns.Entity;
    var Group = ns.Group;
    var GroupDataSource = function() {};
    ns.Interface(GroupDataSource, [Entity.DataSource]);
    GroupDataSource.prototype.getFounder = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getOwner = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getMembers = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getAssistants = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Group.DataSource = GroupDataSource
})(DIMP);
(function(ns) {
    var CipherKeyDelegate = function() {};
    ns.Interface(CipherKeyDelegate, null);
    CipherKeyDelegate.prototype.getCipherKey = function(from, to, generate) {
        console.assert(false, "implement me!");
        return null
    };
    CipherKeyDelegate.prototype.cacheCipherKey = function(from, to, key) {
        console.assert(false, "implement me!")
    };
    ns.CipherKeyDelegate = CipherKeyDelegate;
    ns.register("CipherKeyDelegate")
})(DIMP);
(function(ns) {
    var Packer = function() {};
    ns.Interface(Packer, null);
    Packer.prototype.getOvertGroup = function(content) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.encryptMessage = function(iMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.signMessage = function(sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.serializeMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.deserializeMessage = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.verifyMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Packer.prototype.decryptMessage = function(sMsg) {
        console.assert(false, "implement me!");
        return null
    };
    var Processor = function() {};
    ns.Interface(Processor, null);
    Processor.prototype.processData = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processReliableMessage = function(rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processSecureMessage = function(sMsg, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processInstantMessage = function(iMsg, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    Processor.prototype.processContent = function(content, rMsg) {
        console.assert(false, "implement me!");
        return null
    };
    var Message = ns.protocol.Message;
    var Entity = ns.Entity;
    var CipherKeyDelegate = ns.CipherKeyDelegate;
    var Transceiver = function() {};
    ns.Interface(Transceiver, [Entity.Delegate, CipherKeyDelegate, Message.Delegate, Packer, Processor]);
    Transceiver.Packer = Packer;
    Transceiver.Processor = Processor;
    ns.Transceiver = Transceiver;
    ns.register("Transceiver")
})(DIMP);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var ID = ns.protocol.ID;
    var NetworkType = ns.protocol.NetworkType;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var Bulletin = ns.protocol.Bulletin;
    var Entity = ns.Entity;
    var User = ns.User;
    var Group = ns.Group;
    var Barrack = function() {
        this.__users = {};
        this.__groups = {}
    };
    ns.Class(Barrack, ns.type.Object, [Entity.Delegate, User.DataSource, Group.DataSource]);
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
        finger = thanos(this.__users, finger);
        finger = thanos(this.__groups, finger);
        return finger >> 1
    };
    var cacheUser = function(user) {
        if (!user.getDataSource()) {
            user.setDataSource(this)
        }
        this.__users[user.identifier.toString()] = user;
        return true
    };
    var cacheGroup = function(group) {
        if (!group.getDataSource()) {
            group.setDataSource(this)
        }
        this.__groups[group.identifier.toString()] = group;
        return true
    };
    Barrack.prototype.createUser = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.createGroup = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.getLocalUsers = function() {
        console.assert(false, "implement me!");
        return null
    };
    Barrack.prototype.selectLocalUser = function(receiver) {
        var users = this.getLocalUsers();
        if (users == null || users.length === 0) {
            throw new Error("local users should not be empty")
        } else {
            if (receiver.isBroadcast()) {
                return users[0]
            }
        }
        var i, user;
        if (receiver.isGroup()) {
            var members = this.getMembers(receiver);
            if (members == null || members.length === 0) {
                return null
            }
            var j, member;
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                for (j = 0; j < members.length; ++j) {
                    member = members[j];
                    if (member.equals(user.identifier)) {
                        return user
                    }
                }
            }
        } else {
            for (i = 0; i < users.length; ++i) {
                user = users[i];
                if (receiver.equals(user.identifier)) {
                    return user
                }
            }
        }
        return null
    };
    Barrack.prototype.getUser = function(identifier) {
        var user = this.__users[identifier.toString()];
        if (!user) {
            user = this.createUser(identifier);
            if (user) {
                cacheUser.call(this, user)
            }
        }
        return user
    };
    Barrack.prototype.getGroup = function(identifier) {
        var group = this.__groups[identifier.toString()];
        if (!group) {
            group = this.createGroup(identifier);
            if (group) {
                cacheGroup.call(this, group)
            }
        }
        return group
    };
    var visa_key = function(user) {
        var doc = this.getDocument(user, Document.VISA);
        if (ns.Interface.conforms(doc, Visa)) {
            if (doc.isValid()) {
                return doc.getKey()
            }
        }
        return null
    };
    var meta_key = function(user) {
        var meta = this.getMeta(user);
        if (meta) {
            return meta.getKey()
        }
        return null
    };
    Barrack.prototype.getPublicKeyForEncryption = function(identifier) {
        var key = visa_key.call(this, identifier);
        if (key) {
            return key
        }
        key = meta_key.call(this, identifier);
        if (ns.Interface.conforms(key, EncryptKey)) {
            return key
        }
        return null
    };
    Barrack.prototype.getPublicKeysForVerification = function(identifier) {
        var keys = [];
        var key = visa_key.call(this, identifier);
        if (ns.Interface.conforms(key, VerifyKey)) {
            keys.push(key)
        }
        key = meta_key.call(this, identifier);
        if (key) {
            keys.push(key)
        }
        return keys
    };
    var group_seed = function(identifier) {
        var seed = identifier.getName();
        if (seed) {
            var len = seed.length;
            if (len === 0 || (len === 8 && seed.toLowerCase() === "everyone")) {
                seed = null
            }
        }
        return seed
    };
    Barrack.prototype.getBroadcastFounder = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".founder@anywhere")
        } else {
            return ID.FOUNDER
        }
    };
    Barrack.prototype.getBroadcastOwner = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".owner@anywhere")
        } else {
            return ID.ANYONE
        }
    };
    Barrack.prototype.getBroadcastMembers = function(group) {
        var seed = group_seed(group);
        if (seed) {
            return ID.parse(seed + ".member@anywhere")
        } else {
            return ID.ANYONE
        }
    };
    Barrack.prototype.getFounder = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastFounder(group)
        }
        var gMeta = this.getMeta(group);
        if (!gMeta) {
            return null
        }
        var members = this.getMembers(group);
        if (members != null) {
            var mMeta;
            for (var i = 0; i < members.length; ++i) {
                mMeta = this.getMeta(members[i]);
                if (!mMeta) {
                    continue
                }
                if (gMeta.matches(mMeta.getKey())) {
                    return members[i]
                }
            }
        }
        return null
    };
    Barrack.prototype.getOwner = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastOwner(group)
        }
        if (NetworkType.POLYLOGUE.equals(group.getType())) {
            return this.getFounder(group)
        }
        return null
    };
    Barrack.prototype.getMembers = function(group) {
        if (group.isBroadcast()) {
            return this.getBroadcastMembers(group)
        }
        return null
    };
    Barrack.prototype.getAssistants = function(group) {
        var doc = this.getDocument(group, Document.BULLETIN);
        if (ns.Interface.conforms(doc, Bulletin)) {
            if (doc.isValid()) {
                return doc.getAssistants()
            }
        }
        return null
    };
    ns.core.Barrack = Barrack;
    ns.core.register("Barrack")
})(DIMP);
(function(ns) {
    var Command = ns.protocol.Command;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var CorePacker = function(transceiver) {
        this.__transceiver = transceiver
    };
    ns.Class(CorePacker, ns.type.Object, [Transceiver.Packer]);
    CorePacker.prototype.getTransceiver = function() {
        return this.__transceiver
    };
    CorePacker.prototype.getOvertGroup = function(content) {
        var group = content.getGroup();
        if (!group) {
            return null
        }
        if (group.isBroadcast()) {
            return group
        }
        if (content instanceof Command) {
            return null
        }
        return group
    };
    CorePacker.prototype.encryptMessage = function(iMsg) {
        var transceiver = this.getTransceiver();
        if (!iMsg.getDelegate()) {
            iMsg.setDelegate(transceiver)
        }
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var group = transceiver.getOvertGroup(iMsg.getContent());
        var password;
        if (group) {
            password = transceiver.getCipherKey(sender, group, true)
        } else {
            password = transceiver.getCipherKey(sender, receiver, true)
        }
        var sMsg;
        if (receiver.isGroup()) {
            var grp = transceiver.getGroup(receiver);
            if (!grp) {
                return null
            }
            var members = grp.getMembers();
            if (!members || members.length === 0) {
                return null
            }
            sMsg = iMsg.encrypt(password, members)
        } else {
            sMsg = iMsg.encrypt(password, null)
        }
        if (!sMsg) {
            return null
        }
        if (group && !receiver.equals(group)) {
            sMsg.getEnvelope().setGroup(group)
        }
        sMsg.getEnvelope().setType(iMsg.getContent().getType());
        return sMsg
    };
    CorePacker.prototype.signMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.sign()
    };
    CorePacker.prototype.serializeMessage = function(rMsg) {
        return ns.format.JSON.encode(rMsg.getMap())
    };
    CorePacker.prototype.deserializeMessage = function(data) {
        var dict = ns.format.JSON.decode(data);
        return ReliableMessage.parse(dict)
    };
    CorePacker.prototype.verifyMessage = function(rMsg) {
        if (!rMsg.getDelegate()) {
            rMsg.setDelegate(this.getTransceiver())
        }
        return rMsg.verify()
    };
    CorePacker.prototype.decryptMessage = function(sMsg) {
        if (!sMsg.getDelegate()) {
            sMsg.setDelegate(this.getTransceiver())
        }
        return sMsg.decrypt()
    };
    ns.core.Packer = CorePacker;
    ns.core.register("Packer")
})(DIMP);
(function(ns) {
    var Envelope = ns.protocol.Envelope;
    var InstantMessage = ns.protocol.InstantMessage;
    var Transceiver = ns.Transceiver;
    var CoreProcessor = function(transceiver) {
        this.__transceiver = transceiver
    };
    ns.Class(CoreProcessor, ns.type.Object, [Transceiver.Processor]);
    CoreProcessor.prototype.getTransceiver = function() {
        return this.__transceiver
    };
    CoreProcessor.prototype.processData = function(data) {
        var transceiver = this.getTransceiver();
        var rMsg = transceiver.deserializeMessage(data);
        if (rMsg == null) {
            return null
        }
        rMsg = transceiver.processReliableMessage(rMsg);
        if (rMsg == null) {
            return null
        }
        return transceiver.serializeMessage(rMsg)
    };
    CoreProcessor.prototype.processReliableMessage = function(rMsg) {
        var transceiver = this.getTransceiver();
        var sMsg = transceiver.verifyMessage(rMsg);
        if (sMsg == null) {
            return null
        }
        sMsg = transceiver.processSecureMessage(sMsg, rMsg);
        if (sMsg == null) {
            return null
        }
        return transceiver.signMessage(sMsg)
    };
    CoreProcessor.prototype.processSecureMessage = function(sMsg, rMsg) {
        var transceiver = this.getTransceiver();
        var iMsg = transceiver.decryptMessage(sMsg);
        if (iMsg == null) {
            return null
        }
        iMsg = transceiver.processInstantMessage(iMsg, rMsg);
        if (iMsg == null) {
            return null
        }
        return transceiver.encryptMessage(iMsg)
    };
    CoreProcessor.prototype.processInstantMessage = function(iMsg, rMsg) {
        var transceiver = this.getTransceiver();
        var response = transceiver.processContent(iMsg.getContent(), rMsg);
        if (response == null) {
            return null
        }
        var sender = iMsg.getSender();
        var receiver = iMsg.getReceiver();
        var user = transceiver.selectLocalUser(receiver);
        var env = Envelope.create(user.identifier, sender, null);
        return InstantMessage.create(env, response)
    };
    ns.core.Processor = CoreProcessor;
    ns.core.register("Processor")
})(DIMP);
(function(ns) {
    var SymmetricKey = ns.crypto.SymmetricKey;
    var Content = ns.protocol.Content;
    var InstantMessage = ns.protocol.InstantMessage;
    var ReliableMessage = ns.protocol.ReliableMessage;
    var Transceiver = ns.Transceiver;
    var CoreTransceiver = function() {
        this.__barrack = null;
        this.__keycache = null;
        this.__packer = null;
        this.__processor = null
    };
    ns.Class(CoreTransceiver, ns.type.Object, [Transceiver, InstantMessage.Delegate, ReliableMessage.Delegate]);
    CoreTransceiver.prototype.setEntityDelegate = function(barrack) {
        this.__barrack = barrack
    };
    CoreTransceiver.prototype.getEntityDelegate = function() {
        return this.__barrack
    };
    CoreTransceiver.prototype.selectLocalUser = function(receiver) {
        return this.getEntityDelegate().selectLocalUser(receiver)
    };
    CoreTransceiver.prototype.getUser = function(identifier) {
        return this.getEntityDelegate().getUser(identifier)
    };
    CoreTransceiver.prototype.getGroup = function(identifier) {
        return this.getEntityDelegate().getGroup(identifier)
    };
    CoreTransceiver.prototype.setCipherKeyDelegate = function(keyCache) {
        this.__keycache = keyCache
    };
    CoreTransceiver.prototype.getCipherKeyDelegate = function() {
        return this.__keycache
    };
    CoreTransceiver.prototype.getCipherKey = function(from, to, generate) {
        return this.getCipherKeyDelegate().getCipherKey(from, to, generate)
    };
    CoreTransceiver.prototype.cacheCipherKey = function(from, to, key) {
        return this.getCipherKeyDelegate().cacheCipherKey(from, to, key)
    };
    CoreTransceiver.prototype.setPacker = function(packer) {
        this.__packer = packer
    };
    CoreTransceiver.prototype.getPacker = function() {
        return this.__packer
    };
    CoreTransceiver.prototype.getOvertGroup = function(content) {
        return this.getPacker().getOvertGroup(content)
    };
    CoreTransceiver.prototype.encryptMessage = function(iMsg) {
        return this.getPacker().encryptMessage(iMsg)
    };
    CoreTransceiver.prototype.signMessage = function(sMsg) {
        return this.getPacker().signMessage(sMsg)
    };
    CoreTransceiver.prototype.serializeMessage = function(rMsg) {
        return this.getPacker().serializeMessage(rMsg)
    };
    CoreTransceiver.prototype.deserializeMessage = function(data) {
        return this.getPacker().deserializeMessage(data)
    };
    CoreTransceiver.prototype.verifyMessage = function(rMsg) {
        return this.getPacker().verifyMessage(rMsg)
    };
    CoreTransceiver.prototype.decryptMessage = function(sMsg) {
        return this.getPacker().decryptMessage(sMsg)
    };
    CoreTransceiver.prototype.setProcessor = function(processor) {
        this.__processor = processor
    };
    CoreTransceiver.prototype.getProcessor = function() {
        return this.__processor
    };
    CoreTransceiver.prototype.processData = function(data) {
        return this.getProcessor().processData(data)
    };
    CoreTransceiver.prototype.processReliableMessage = function(rMsg) {
        return this.getProcessor().processReliableMessage(rMsg)
    };
    CoreTransceiver.prototype.processSecureMessage = function(sMsg, rMsg) {
        return this.getProcessor().processSecureMessage(sMsg, rMsg)
    };
    CoreTransceiver.prototype.processInstantMessage = function(iMsg, rMsg) {
        return this.getProcessor().processInstantMessage(iMsg, rMsg)
    };
    CoreTransceiver.prototype.processContent = function(content, rMsg) {
        return this.getProcessor().processContent(content, rMsg)
    };
    var is_broadcast_msg = function(msg) {
        var receiver = msg.getGroup();
        if (!receiver) {
            receiver = msg.getReceiver()
        }
        return receiver.isBroadcast()
    };
    CoreTransceiver.prototype.serializeContent = function(content, pwd, iMsg) {
        return ns.format.JSON.encode(content.getMap())
    };
    CoreTransceiver.prototype.encryptContent = function(data, pwd, iMsg) {
        return pwd.encrypt(data)
    };
    CoreTransceiver.prototype.encodeData = function(data, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            return ns.format.UTF8.decode(data)
        }
        return ns.format.Base64.encode(data)
    };
    CoreTransceiver.prototype.serializeKey = function(pwd, iMsg) {
        if (is_broadcast_msg(iMsg)) {
            return null
        }
        return ns.format.JSON.encode(pwd)
    };
    CoreTransceiver.prototype.encryptKey = function(data, receiver, iMsg) {
        var contact = this.getUser(receiver);
        return contact.encrypt(data)
    };
    CoreTransceiver.prototype.encodeKey = function(key, iMsg) {
        return ns.format.Base64.encode(key)
    };
    CoreTransceiver.prototype.decodeKey = function(key, sMsg) {
        return ns.format.Base64.decode(key)
    };
    CoreTransceiver.prototype.decryptKey = function(data, sender, receiver, sMsg) {
        var identifier = sMsg.getReceiver();
        var user = this.getUser(identifier);
        return user.decrypt(data)
    };
    CoreTransceiver.prototype.deserializeKey = function(data, sender, receiver, sMsg) {
        if (data) {
            var dict = ns.format.JSON.decode(data);
            return SymmetricKey.parse(dict)
        } else {
            return this.getCipherKey(sender, receiver, false)
        }
    };
    CoreTransceiver.prototype.decodeData = function(data, sMsg) {
        if (is_broadcast_msg(sMsg)) {
            return ns.format.UTF8.encode(data)
        }
        return ns.format.Base64.decode(data)
    };
    CoreTransceiver.prototype.decryptContent = function(data, pwd, sMsg) {
        return pwd.decrypt(data)
    };
    CoreTransceiver.prototype.deserializeContent = function(data, pwd, sMsg) {
        var dict = ns.format.JSON.decode(data);
        var content = Content.parse(dict);
        if (!is_broadcast_msg(sMsg)) {
            var sender = sMsg.getSender();
            var group = this.getOvertGroup(content);
            if (group) {
                this.cacheCipherKey(sender, group, pwd)
            } else {
                var receiver = sMsg.getReceiver();
                this.cacheCipherKey(sender, receiver, pwd)
            }
        }
        return content
    };
    CoreTransceiver.prototype.signData = function(data, sender, sMsg) {
        var user = this.getUser(sender);
        return user.sign(data)
    };
    CoreTransceiver.prototype.encodeSignature = function(signature, sMsg) {
        return ns.format.Base64.encode(signature)
    };
    CoreTransceiver.prototype.decodeSignature = function(signature, rMsg) {
        return ns.format.Base64.decode(signature)
    };
    CoreTransceiver.prototype.verifyDataSignature = function(data, signature, sender, rMsg) {
        var contact = this.getUser(sender);
        return contact.verify(data, signature)
    };
    ns.core.Transceiver = CoreTransceiver;
    ns.core.register("Transceiver")
})(DIMP);
(function(ns) {
    var ContentType = ns.protocol.ContentType;
    var Content = ns.protocol.Content;
    var Command = ns.protocol.Command;
    var HistoryCommand = ns.protocol.HistoryCommand;
    var GroupCommand = ns.protocol.GroupCommand;
    var ContentFactory = function(clazz) {
        this.__class = clazz
    };
    ns.Class(ContentFactory, null, [Content.Factory]);
    ContentFactory.prototype.parseContent = function(content) {
        return new this.__class(content)
    };
    var CommandFactory = function(clazz) {
        this.__class = clazz
    };
    ns.Class(CommandFactory, null, [Command.Factory]);
    CommandFactory.prototype.parseCommand = function(content) {
        return new this.__class(content)
    };
    var GeneralCommandFactory = function() {};
    ns.Class(GeneralCommandFactory, null, [Content.Factory, Command.Factory]);
    GeneralCommandFactory.prototype.parseContent = function(content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            if (Content.getGroup(content)) {
                factory = Command.getFactory("group")
            }
            if (!factory) {
                factory = this
            }
        }
        return factory.parseCommand(content)
    };
    GeneralCommandFactory.prototype.parseCommand = function(cmd) {
        return new Command(cmd)
    };
    var HistoryCommandFactory = function() {};
    ns.Class(HistoryCommandFactory, GeneralCommandFactory, null);
    HistoryCommandFactory.prototype.parseCommand = function(cmd) {
        return new HistoryCommand(cmd)
    };
    var GroupCommandFactory = function() {};
    ns.Class(GroupCommandFactory, HistoryCommandFactory, null);
    GroupCommandFactory.prototype.parseContent = function(content) {
        var command = Command.getCommand(content);
        var factory = Command.getFactory(command);
        if (!factory) {
            factory = this
        }
        return factory.parseCommand(content)
    };
    GroupCommandFactory.prototype.parseCommand = function(cmd) {
        return new GroupCommand(cmd)
    };
    var registerContentFactories = function() {
        Content.register(ContentType.FORWARD, new ContentFactory(ns.protocol.ForwardContent));
        Content.register(ContentType.TEXT, new ContentFactory(ns.protocol.TextContent));
        Content.register(ContentType.FILE, new ContentFactory(ns.protocol.FileContent));
        Content.register(ContentType.IMAGE, new ContentFactory(ns.protocol.ImageContent));
        Content.register(ContentType.AUDIO, new ContentFactory(ns.protocol.AudioContent));
        Content.register(ContentType.VIDEO, new ContentFactory(ns.protocol.VideoContent));
        Content.register(ContentType.PAGE, new ContentFactory(ns.protocol.PageContent));
        Content.register(ContentType.MONEY, new ContentFactory(ns.protocol.MoneyContent));
        Content.register(ContentType.TRANSFER, new ContentFactory(ns.protocol.TransferContent));
        Content.register(ContentType.COMMAND, new GeneralCommandFactory());
        Content.register(ContentType.HISTORY, new HistoryCommandFactory());
        Content.register(0, new ContentFactory(ns.BaseContent))
    };
    var registerCommandFactories = function() {
        Command.register(Command.META, new CommandFactory(ns.protocol.MetaCommand));
        var dpu = new CommandFactory(ns.protocol.DocumentCommand);
        Command.register(Command.DOCUMENT, dpu);
        Command.register(Command.PROFILE, dpu);
        Command.register("group", new GroupCommandFactory());
        Command.register(GroupCommand.INVITE, new CommandFactory(ns.protocol.group.InviteCommand));
        Command.register(GroupCommand.EXPEL, new CommandFactory(ns.protocol.group.ExpelCommand));
        Command.register(GroupCommand.JOIN, new CommandFactory(ns.protocol.group.JoinCommand));
        Command.register(GroupCommand.QUIT, new CommandFactory(ns.protocol.group.QuitCommand));
        Command.register(GroupCommand.QUERY, new CommandFactory(ns.protocol.group.QueryCommand));
        Command.register(GroupCommand.RESET, new CommandFactory(ns.protocol.group.ResetCommand))
    };
    registerContentFactories();
    registerCommandFactories();
    ns.core.ContentFactory = ContentFactory;
    ns.core.CommandFactory = CommandFactory;
    ns.core.GeneralCommandFactory = GeneralCommandFactory;
    ns.core.HistoryCommandFactory = HistoryCommandFactory;
    ns.core.GroupCommandFactory = GroupCommandFactory;
    ns.core.register("ContentFactory");
    ns.core.register("CommandFactory");
    ns.core.register("GeneralCommandFactory");
    ns.core.register("HistoryCommandFactory");
    ns.core.register("GroupCommandFactory")
})(DIMP);
