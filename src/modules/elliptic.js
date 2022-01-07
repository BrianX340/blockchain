import Elliptic from 'elliptic';
import hashGenerator from '../modules/hash';
const ec = new Elliptic.ec('secp256k1');

export default {
	createKeyPair: ()=>{
		return ec.genKeyPair();
	},
	verifySignature: (publicKey, signature, dataHash)=>{
		return ec.keyFromPublic(publicKey, 'hex').verify(hashGenerator(dataHash), signature);
	}
}