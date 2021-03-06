import { Transaction, Wallet } from "../../Models";
import { REWARD } from "../../Models/Transaction";
import { blockchainWallet } from "../../Models/BlockchainWallet";

describe('Transaction test', () => {
	let wallet;
	let transaction;
	let amount;
	let recipientAddress;

	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipientAddress = 'recipient wallet';
		transaction = Transaction.create(wallet, recipientAddress, amount);
	});

	it('Outputs the amount subtracted from the wallet balance',()=>{
		const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
		expect(output.amount).toEqual(wallet.balance - amount);
	});

	it('Outputs the amount added to the recipient',()=>{
		const output = transaction.outputs.find(({ address }) => address === recipientAddress);
		expect(output.amount).toEqual(amount);
	});

	describe('Transacting with an amount that exceeds the balance', () => {
		beforeEach(() => {
			amount = 50000;
			transaction = undefined;
		});

		it('Does not create the transaction', () => {
			expect(() => {
				transaction = Transaction.create(wallet, recipientAddress, amount);
			}).toThrow('Amount exceeds balance');
		});
	})

	it('Inputs the balance of the wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	it('Inputs the sender address of the wallet', () => {
		expect(transaction.input.address).toEqual(wallet.publicKey);
	});

	it('Inputs has a signature usign the wallet', () => {
		expect(typeof transaction.input.signature).toEqual('object');
		expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
	});

	it('Validate a valid transaction',()=>{
		expect(Transaction.verify(transaction)).toBe(true);
	});

	it('Invalidate a corrupt transaction',()=>{
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verify(transaction)).toBe(false);
	});

	describe('Updating a transaction', () => {
		let nextAmount;
		let nextRecipient;

		beforeEach(() => {
			nextAmount = 20;
			nextRecipient = 'next recipient';
			transaction = transaction.update(wallet, nextRecipient, nextAmount);
		});

		it('Substracts the next amount from the senders wallet',()=>{
			const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
			expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
		});

		it('outputs an amount for the next recipient', () => {
			const output = transaction.outputs.find(({ address }) => address === nextRecipient);
			expect(output.amount).toEqual(nextAmount);
		  });
	});

	describe('Creating a reward transaction',()=>{

		beforeEach(()=>{
			transaction = Transaction.reward(wallet, blockchainWallet);
		});

		it('Reward the miner wallet',()=>{
			expect(transaction.outputs.length).toEqual(2);

			let output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
			expect(output.amount).toEqual(REWARD);

			output = transaction.outputs.find(({ address }) => address === blockchainWallet.publicKey);
			expect(output.amount).toEqual(blockchainWallet.balance - REWARD);
		});
	})
})
