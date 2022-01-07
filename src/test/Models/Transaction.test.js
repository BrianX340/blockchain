import Transaction from "../../Models/Transaction";
import Wallet from "../../Models/Wallet";

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

	it('Inputs has a signature usign tge wallet', () => {
		expect(typeof transaction.input.signature).toEqual('object');
		expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
	});
})
