import { Transaction } from ".";

class MemoryPool {
	constructor() {
		this.transactions = [];
	}

	addOrUpdateTransaction(transaction) {
		const { input, outputs = [] } = transaction;
		const outputTotal = outputs.reduce((total, { amount }) => total + Number(amount), 0);

		if (input.amount !== outputTotal) throw Error(`Invalid transaction from ${input.address}`);
    	if (!Transaction.verify(transaction)) throw Error(`Invalid signature from ${input.address}`);

		const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
		if (txIndex >= 0) {
			this.transactions[txIndex] = transaction;
		} else {
			this.transactions.push(transaction);
		}
	}

	find(addres){
		return this.transactions.find(({ input }) => input.address === addres);
	}
}

export default MemoryPool;