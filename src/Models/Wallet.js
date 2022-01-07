import { elliptic, hashGenerator } from "../modules";

const INITIAL_BALANCE = 100;

class Wallet {
	constructor() {
		this.balance = INITIAL_BALANCE;
		this.keyPair = elliptic.createKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}

	toString() {
		return `Wallet { 
			balance: ${this.balance},
			publicKey: ${this.publicKey}
		}`;
	}

	sign(dataHash) {
		return this.keyPair.sign(hashGenerator(dataHash));
	}
	

}

export { INITIAL_BALANCE };

export default Wallet;