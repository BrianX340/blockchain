import uuidV1 from 'uuid/v1';

class Transaction {
	constructor() {
		this.id = uuidV1();
		this.input = null;
		this.outputs = [];
	}

	static create(senderWallet, receptorWallet, amount) {
		const { balance, publicKey } = senderWallet;

		if (amount > balance) {
			throw new Error('Amount exceeds balance');
		}

		const transaction = new this();
		transaction.outputs.push(...[
			{ amount: balance - amount, address: publicKey },
			{ amount, address: receptorWallet }
		]);

		return transaction;
	}
}

export default Transaction;