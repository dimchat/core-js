# Decentralized Instant Messaging Protocol (JavaScript)

[![License](https://img.shields.io/github/license/dimchat/core-js)](https://github.com/dimchat/core-js/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dimchat/core-js/pulls)
[![Platform](https://img.shields.io/badge/Platform-ECMAScript%205.1-brightgreen.svg)](https://github.com/dimchat/core-js/wiki)
[![Issues](https://img.shields.io/github/issues/dimchat/core-js)](https://github.com/dimchat/core-js/issues)
[![Repo Size](https://img.shields.io/github/repo-size/dimchat/core-js)](https://github.com/dimchat/core-js/archive/refs/heads/master.zip)
[![Tags](https://img.shields.io/github/tag/dimchat/core-js)](https://github.com/dimchat/core-js/tags)

[![Watchers](https://img.shields.io/github/watchers/dimchat/core-js)](https://github.com/dimchat/core-js/watchers)
[![Forks](https://img.shields.io/github/forks/dimchat/core-js)](https://github.com/dimchat/core-js/forks)
[![Stars](https://img.shields.io/github/stars/dimchat/core-js)](https://github.com/dimchat/core-js/stargazers)
[![Followers](https://img.shields.io/github/followers/dimchat)](https://github.com/orgs/dimchat/followers)

## Dependencies

* Latest Versions

| Name | Version | Description |
|------|---------|-------------|
| [Cryptography](https://github.com/dimchat/mkm-js) | [![Tags](https://img.shields.io/github/tag/dimchat/mkm-js)](https://github.com/dimchat/mkm-js) | Crypto Keys |
| [Ming Ke Ming (名可名)](https://github.com/dimchat/mkm-js) | [![Tags](https://img.shields.io/github/tag/dimchat/mkm-js)](https://github.com/dimchat/mkm-js) | Decentralized User Identity Authentication |
| [Dao Ke Dao (道可道)](https://github.com/dimchat/dkd-js) | [![Tags](https://img.shields.io/github/tag/dimchat/dkd-js)](https://github.com/dimchat/dkd-js) | Universal Message Module |

## Examples

### Extends Command

* _Handshake Command Protocol_
  0. (C-S) handshake start
  1. (S-C) handshake again with new session
  2. (C-S) handshake restart with new session
  3. (S-C) handshake success

```javascript
dkd.protocol.HandshakeState = Enum('HandshakeState', {
    START:   0, // C -> S, without session key(or session expired)
    AGAIN:   1, // S -> C, with new session key
    RESTART: 2, // C -> S, with new session key
    SUCCESS: 3  // S -> C, handshake accepted
});
var HandshakeState = dkd.protocol.HandshakeState;

HandshakeState.checkState = function (title, session) {
    if (title === 'DIM!'/* || title === 'OK!'*/) {
        return HandshakeState.SUCCESS;
    } else if (title === 'DIM?') {
        return HandshakeState.AGAIN;
    } else if (!session) {
        return HandshakeState.START;
    } else {
        return HandshakeState.RESTART;
    }
};

Command.HANDSHAKE = 'handshake';

/**
 *  Handshake command message: {
 *      type : 0x88,
 *      sn   : 123,
 *
 *      command : "handshake",    // command name
 *      title   : "Hello world!", // "DIM?", "DIM!"
 *      session : "{SESSION_KEY}" // session key
 *  }
 */
dkd.protocol.HandshakeCommand = Interface(null, [Command]);
var HandshakeCommand = dkd.protocol.HandshakeCommand;

/**
 *  Get title
 *
 * @returns {string}
 */
HandshakeCommand.prototype.getTitle = function () {};

/**
 *  Get session key
 *
 * @returns {string}
 */
HandshakeCommand.prototype.getSessionKey = function () {};

/**
 *  Get handshake state
 *
 * @return {HandshakeState}
 */
HandshakeCommand.prototype.getState = function () {};

//
//  Factories
//

HandshakeCommand.start = function () {
    return new BaseHandshakeCommand('Hello world!', null);
};

HandshakeCommand.restart = function (sessionKey) {
    return new BaseHandshakeCommand('Hello world!', sessionKey);
};

HandshakeCommand.again = function (sessionKey) {
    return new BaseHandshakeCommand('DIM?', sessionKey);
};

HandshakeCommand.success = function (sessionKey) {
    return new BaseHandshakeCommand('DIM!', sessionKey);
};


/**
 *  Create handshake command
 *
 *  Usages:
 *      1. new BaseHandshakeCommand(map);
 *      2. new BaseHandshakeCommand(title, session);
 */
dkd.dkd.BaseHandshakeCommand = function () {
    var title = null;
    var session = null;
    if (arguments.length === 2) {
        // new BaseHandshakeCommand(title, session);
        BaseCommand.call(this, Command.HANDSHAKE);
        title = arguments[0];
        session = arguments[1];
    } else if (typeof arguments[0] === 'string') {
        // new BaseHandshakeCommand(title);
        BaseCommand.call(this, Command.HANDSHAKE);
        title = arguments[0];
    } else {
        // new BaseHandshakeCommand(map);
        BaseCommand.call(this, arguments[0]);
    }
    if (title) {
        this.setValue('title', title);
    }
    if (session) {
        this.setValue('session', session);
    }
};
var BaseHandshakeCommand = dkd.dkd.BaseHandshakeCommand;

Class(BaseHandshakeCommand, BaseCommand, [HandshakeCommand]);

Implementation(BaseHandshakeCommand, {

    // Override
    getTitle: function () {
        return this.getString('title', null);
    },

    // Override
    getSessionKey: function () {
        return this.getString('session', null);
    },

    // Override
    getState: function () {
        return HandshakeState.checkState(this.getTitle(), this.getSessionKey());
    }
});
```

### Extends Content

```javascript
/**
 *  Application Customized message: {
 *      type : i2s(0xA0),
 *      sn   : 123,
 *
 *      app   : "{APP_ID}",  // application (e.g.: "chat.dim.sechat")
 *      extra : info         // action parameters
 *  }
 */
dkd.dkd.ApplicationContent = function () {
    var app = null;
    if (arguments.length === 2) {
        // new ApplicationContent(type, app);
        BaseContent.call(this, arguments[0]);
        app = arguments[1];
    } else {
        // new ApplicationContent(type);
        // new ApplicationContent(map);
        BaseContent.call(this, arguments[0]);
    }
    if (app) {
        this.setValue('app', app);
    }
};
var ApplicationContent = dkd.dkd.ApplicationContent;

Class(ApplicationContent, BaseContent, [AppContent]);

Implementation(ApplicationContent, {

    // Override
    getApplication: function () {
        return this.getString('app', '');
    }
});
```

### Extends ID Address

* Examples in [dim_plugins](https://github.com/dimchat/plugins-js)

----

Copyright &copy; 2018-2025 Albert Moky
[![Followers](https://img.shields.io/github/followers/moky)](https://github.com/moky?tab=followers)
