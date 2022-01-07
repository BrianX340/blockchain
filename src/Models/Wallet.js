import { elliptic, hashGenerator } from "../modules";
import { Transaction } from ".";

const INITIAL_BALANCE = 100; //el dinero con el que comienza la wallet

class Wallet {
	constructor(blockchain, initialBalance = INITIAL_BALANCE) {
		this.balance = initialBalance;
		this.keyPair = elliptic.createKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
		this.blockchain = blockchain;
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
	
	createTransaction(recipientAddress, amount) {
		const { balance, blockchain: { memoryPool } } = this;
		if (amount > balance) {
			throw new Error('Amount exceeds balance');
		}

		let tx = memoryPool.find(this.publicKey);
		if (tx) {
			tx.update(this, recipientAddress, amount);
		} else {
			tx = Transaction.create(this, recipientAddress, amount);
			console.log(JSON.stringify(tx));
			memoryPool.addOrUpdateTransaction(tx);
		}
		return tx;
	}

}

export { INITIAL_BALANCE };
export default Wallet;