
class MemoryPool {
	constructor() {
		this.transactions = [];
	}

	addOrUpdateTransaction(transaction) {
		const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
		if (txIndex >= 0) {
			this.transactions[txIndex] = transaction;
		} else {
			this.transactions.push(transaction);
		}
	}
}

export default MemoryPool;