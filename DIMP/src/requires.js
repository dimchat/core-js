'use strict';

//-------- namespace --------
if (typeof mk.crypto !== 'object') {
    mk.crypto = {};
}
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
// if (typeof dkd.ext !== 'object') {
//     dkd.ext = {};
// }

//-------- requires --------
var Interface  = mk.type.Interface;
var Class      = mk.type.Class;
var IObject    = mk.type.Object;
var Dictionary = mk.type.Dictionary;
var Converter  = mk.type.Converter;
var Base64  = mk.format.Base64;
var Base58  = mk.format.Base58;
var Hex     = mk.format.Hex;
var UTF8    = mk.format.UTF8;
var JSONMap = mk.format.JSONMap;
var TransportableData   = mk.protocol.TransportableData;
var PortableNetworkFile = mk.protocol.PortableNetworkFile;
var CryptographyKey     = mk.protocol.CryptographyKey;
var EncryptKey          = mk.protocol.EncryptKey;
var SymmetricKey        = mk.protocol.SymmetricKey;
var AsymmetricKey       = mk.protocol.AsymmetricKey;
var PrivateKey          = mk.protocol.PrivateKey;
var PublicKey           = mk.protocol.PublicKey;
var GeneralCryptoHelper    = mk.ext.GeneralCryptoHelper;
var SharedCryptoExtensions = mk.ext.SharedCryptoExtensions;

var ID       = mkm.protocol.ID;
var Meta     = mkm.protocol.Meta;
var Document = mkm.protocol.Document;
var SharedAccountExtensions = mkm.ext.SharedAccountExtensions;

var Envelope        = dkd.protocol.Envelope;
var Content         = dkd.protocol.Content;
var Message         = dkd.protocol.Message;
var InstantMessage  = dkd.protocol.InstantMessage;
var SecureMessage   = dkd.protocol.SecureMessage;
var ReliableMessage = dkd.protocol.ReliableMessage;
var SharedMessageExtensions = dkd.ext.SharedMessageExtensions;
