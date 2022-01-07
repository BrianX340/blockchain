import { MemoryPool, Transaction, Wallet } from "../../Models";

describe('MemoryPool', () => {
	let memoryPool;
	let transaction;
	let wallet;

	beforeEach(() => {
		memoryPool = new MemoryPool();
		wallet = new Wallet();
		transaction = Transaction.create(wallet, 'recipient', 50);
		memoryPool.addOrUpdateTransaction(transaction);
	});

	it('addOrUpdateTransaction()', () => {
		expect(memoryPool.transactions.length).toEqual(1);
		expect(memoryPool.transactions[0]).toEqual(transaction);
	});

	it('Add a transaction to the memoryPool',()=>{
		const found = memoryPool.transactions.find(({id}) => id === transaction.id);
		expect(found).toEqual(transaction);
	});

	it('Update a transaction in the memoryPool',()=>{
		const txOld = JSON.stringify(transaction);
		const txNew = transaction.update(wallet, 'recipient', 50);
		memoryPool.addOrUpdateTransaction(txNew);
		expect(memoryPool.transactions.length).toEqual(1);

		const found = memoryPool.transactions.find(({id}) => id === transaction.id);
		expect(JSON.stringify(found)).not.toEqual(txOld);
		expect(found).toEqual(txNew);
	})

})