'use strict';

var core_sources = [
    //
    //  Protocol
    //
    'src/protocol/algorithms.js',
    // mkm document protocol
    'src/protocol/version.js',
    'src/protocol/docs.js',
    // dkd content protocol
    'src/protocol/types.js',
    'src/protocol/contents.js',
    'src/protocol/files.js',
    'src/protocol/forward.js',
    'src/protocol/quote.js',
    'src/protocol/assets.js',
    'src/protocol/app.js',
    // dkd command protocol
    'src/protocol/base.js',
    'src/protocol/commands.js',
    'src/protocol/groups.js',
    'src/protocol/receipt.js',

    //
    //  Crypto
    //
    'src/crypto/keys.js',
    'src/crypto/ted.js',
    'src/crypto/pnf.js',

    //
    //  MingKeMing
    //
    // mkm extensions
    'src/mkm/meta.js',
    'src/mkm/document.js',
    'src/mkm/docs.js',

    //
    //  DaoKeDao
    //
    // dkd content implementations
    'src/dkd/base.js',
    'src/dkd/contents.js',
    'src/dkd/files.js',
    'src/dkd/forward.js',
    'src/dkd/quote.js',
    'src/dkd/assets.js',
    'src/dkd/app.js',
    // dkd command implementations
    'src/dkd/commands.js',
    'src/dkd/groups.js',
    'src/dkd/receipt.js',

    // dkd message implementations
    'src/msg/envelope.js',
    'src/msg/base.js',
    'src/msg/instant.js',
    'src/msg/secure.js',
    'src/msg/reliable.js',

    //
    //  Extensions
    //
    'src/ext/cmd_helpers.js',
    'src/ext/cmd_plugins.js',
    null
];
