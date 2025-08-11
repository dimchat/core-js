'use strict';

//-------- namespace --------
// if (typeof mk.crypto !== 'object') {
//     mk.crypto = {};
// }
// if (typeof mk.format !== 'object') {
//     mk.format = {};
// }
//
// if (typeof mkm.protocol !== 'object') {
//     mkm.protocol = {};
// }
// if (typeof mkm.mkm !== 'object') {
//     mkm.mkm = {};
// }
//
// if (typeof dkd.protocol !== 'object') {
//     dkd.protocol = {};
// }
if (typeof dkd.dkd !== 'object') {
    dkd.dkd = {};
}
if (typeof dkd.msg !== 'object') {
    dkd.msg = {};
}
// if (typeof dkd.plugins !== 'object') {
//     dkd.plugins = {};
// }

//-------- requires --------
var Interface  = mk.type.Interface;
var Class      = mk.type.Class;
var IObject    = mk.type.Object;
var Dictionary = mk.type.Dictionary;
var Converter  = mk.type.Converter;
var CryptographyKey = mk.crypto.CryptographyKey;
var EncryptKey      = mk.crypto.EncryptKey;
var SymmetricKey    = mk.crypto.SymmetricKey;
var AsymmetricKey   = mk.crypto.AsymmetricKey;
var PrivateKey      = mk.crypto.PrivateKey;
var PublicKey       = mk.crypto.PublicKey;
var Base64              = mk.format.Base64;
var Base58              = mk.format.Base58;
var Hex                 = mk.format.Hex;
var UTF8                = mk.format.UTF8;
var JSONMap             = mk.format.JSONMap;
var TransportableData   = mk.format.TransportableData;
var PortableNetworkFile = mk.format.PortableNetworkFile;
var GeneralCryptoHelper    = mk.plugins.GeneralCryptoHelper;
var SharedCryptoExtensions = mk.plugins.SharedCryptoExtensions;

var ID       = mkm.protocol.ID;
var Meta     = mkm.protocol.Meta;
var Document = mkm.protocol.Document;
var SharedAccountExtensions = mkm.plugins.SharedAccountExtensions;

var Envelope        = dkd.protocol.Envelope;
var Content         = dkd.protocol.Content;
var Message         = dkd.protocol.Message;
var InstantMessage  = dkd.protocol.InstantMessage;
var SecureMessage   = dkd.protocol.SecureMessage;
var ReliableMessage = dkd.protocol.ReliableMessage;
var SharedMessageExtensions = dkd.plugins.SharedMessageExtensions;
