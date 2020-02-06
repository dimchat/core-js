# Decentralized Instant Messaging Protocol (JavaScript)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/dimchat/core-js/blob/master/LICENSE)
[![Version](https://img.shields.io/badge/alpha-0.1.0-red.svg)](https://github.com/dimchat/core-js/archive/master.zip)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dimchat/core-js/pulls)
[![Platform](https://img.shields.io/badge/Platform-ECMAScript%205.1-brightgreen.svg)](https://github.com/dimchat/core-js/wiki)

## Talk is cheap, show you the codes!

### Dependencies

1. Crypto - <https://github.com/dimchat/mkm-js/blob/master/Crypto/dist/crypto.js>
2. MingKeMing - <https://github.com/dimchat/mkm-js/blob/master/MingKeMing/dist/mkm.js>
3. DaoKeDao - <https://github.com/dimchat/dkd-js/blob/master/DaoKeDao/dist/dkd.js>
4. Core - <https://github.com/dimchat/core-js/blob/master/DIMP/dist/core.js>

All in one - <https://github.com/dimchat/core-js/blob/master/DIMP/dist/dimp.js>

### Common Extensions

facebook.js

```javascript
    /**
     *  Access database to load/save user's private key, meta and profiles
     */
    var Facebook = function() {
        Barrack.call(this);
    };
    Facebook.inherits(Barrack);

    Facebook.prototype.verifyProfile = function (profile, identifier) {
        if (identifier) {
            if (!profile || !identifier.equals(profile.getIdentifier())) {
                // profile ID not match
                return false;
            }
        } else {
            identifier = profile.getIdentifier();
            identifier = this.getIdentifier(identifier);
            if (!identifier) {
                throw Error('profile ID error: ' + profile);
            }
        }
        // NOTICE: if this is a group profile,
        //             verify it with each member's meta.key
        //         else (this is a user profile)
        //             verify it with the user's meta.key
        var meta;
        if (identifier.getType().isGroup()) {
            // check by each member
            var members = this.getMembers(identifier);
            if (members) {
                var id;
                for (var i = 0; i < members.length; ++i) {
                    id = this.getIdentifier(members[i]);
                    meta = this.getMeta(id);
                    if (!meta) {
                        // FIXME: meta not found for this member
                        continue;
                    }
                    if (profile.verify(meta.key)) {
                        return true;
                    }
                }
            }
            // DISCUSS: what to do about assistants?

            // check by owner
            var owner = this.getOwner(identifier);
            if (!owner) {
                if (identifier.getType().equals(NetworkType.Polylogue)) {
                    // NOTICE: if this is a polylogue profile
                    //             verify it with the founder's meta.key
                    //             (which equals to the group's meta.key)
                    meta = this.getMeta(identifier);
                } else {
                    // FIXME: owner not found for this group
                    return false;
                }
            } else if (members && members.contains(owner)) {
                // already checked
                return false;
            } else {
                meta = this.getMeta(owner);
            }
        } else {
            meta = this.getMeta(identifier);
        }
        return meta && profile.verify(meta.key);
    };
    
    //...
```

store.js

```javascript
    /**
     *  For reusable symmetric key, with direction (from, to)
     */
    var KeyStore = function() {
        KeyCache.call(this);
    };
    KeyStore.inherits(KeyCache);
    
    // ...
```

messenger.js

```javascript
    /**
     *  Transform and send message
     */

    var Messenger = function () {
        Transceiver.call(this);
        // Messenger delegate for sending data
        this.delegate = null;
    };
    Messenger.inherits(Transceiver, ConnectionDelegate);
    
    // ...
```

### User Account

register.js

```javascript
    var PrivateKey  = DIMP.crypto.PrivateKey;
    var NetworkType = DIMP.protocol.NetworkType;
    var Meta        = DIMP.Meta;
    
    var register = function (name) {
        // 1. generate private key
        var sk = PrivateKey.generate(PrivateKey.RSA);
        
        // 2. generate meta with username(as seed) and private key
        var seed = name;
        var meta = Meta.generate(MetaType.Default, sk, seed);
        
        // 3. generate ID with network type by meta
        var identifier = meta.generateIdentifier(NetworkType.Main);
        
        // 4. save meta and private key
        facebook.saveMeta(meta, identifier);
        facebook.savePrivateKey(sk, identifier);
        
        // 5. create user with ID
        return facebook.getUser(identifier);
    }
```

### Messaging

send.js

```javascript
    var pack = function (content, sender, receiver) {
        // 1. create InstantMessage
        var env = Envelope.newEnvelope(sender, receiver);
        var iMsg = new InstantMessage(content, env);

        // 2. encrypt 'content' to 'data' for receiver
        var sMsg = messenger.encryptMessage(iMsg);

        // 3. sign 'data' by sender
        var rMsg = messenger.signMessage(sMsg);

        // OK
        return rMsg;
    }
    
    var send = function (content, sender, receiver) {
        // 1. pack message
        var rMsg = pack(content, sender, receiver);
        
        // 2. callback handler
        var callback = null;
        
        // 3. encode and send out
        return messenger.sendMessage(rMsg, callback);
    }
    
    // test
    var moki = facebook.getIdentifier("moki@4WDfe3zZ4T7opFSi3iDAKiuTnUHjxmXekk");
    var hulk = facebook.getIdentifier("hulk@4YeVEN3aUnvC1DNUufCq1bs9zoBSJTzVEj");
        
    var content = new TextContent("Hello world!");
    send(content, moki, hulk);
```

receive.js

```javascript
    var unpack = function (rMsg) {
        // 1. verify 'data' with 'signature'
        var sMsg = messenger.verifyMessage(rMsg);

        // 2. check group message
        var receiver = facebook.getIdentifier(sMsg.envelope.receiver);
        if (receiver.getType().isGroup()) {
            // TODO: split it
        }

        // 3. decrypt 'data' to 'content'
        var iMsg = messenger.decryptMessage(sMsg);

        // OK
        return iMsg.content;
    }
    
    //
    //  StationDelegate
    //
    var didReceivePackage = function (data, server) {
        // 1. decode message package
        var rMsg = messenger.deserializeMessage(data);
        
        // 2. verify and decrypt message
        var content = unpack(rMsg);
        
        // TODO: process message content
    }
```


Copyright &copy; 2019 Albert Moky
