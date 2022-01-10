import { INITIAL_BALANCE } from "../../../src/Models/Wallet";
import { Wallet, Blockchain } from "../../../src/Models";


describe('Wallet',()=>{
	let blockchain;
	let wallet;
	beforeEach(()=>{
		blockchain = new Blockchain();
		wallet = new Wallet(blockchain);
	});

	it('has a properties',()=>{
		expect(wallet.balance).toEqual(INITIAL_BALANCE);
		expect(typeof wallet.keyPair).toEqual('object');
		expect(typeof wallet.publicKey).toEqual('string');
		expect(wallet.publicKey.length).toEqual(130);
	});

	it('Use sign()',()=>{
		const signature = wallet.sign('data');
		expect(typeof signature).toEqual('object');
		expect(signature).toEqual(wallet.sign('data'));
	})

	describe('Creating a transaction',()=>{
		let tx;
		let recipientAddress;
		let amount;

		beforeEach(()=>{
			recipientAddress = 'recipient-address';
			amount = 50;
			tx = wallet.createTransaction(recipientAddress,amount);
		});

		describe('And doing the same transaction',()=>{
			beforeEach(()=>{
				tx = wallet.createTransaction(recipientAddress,amount);
			});

			it('double the `amount` subtracted from the wallet balance',()=>{
				const output = tx.outputs.find(({address})=>address === wallet.publicKey);
				expect(output.amount).toEqual(wallet.balance - (amount*2));
			});

			it('Clones the amount output for the recipient', ()=>{
				const amounts = tx.outputs.filter(({address})=>address === recipientAddress).map(({amount})=>amount);
				expect(amounts).toEqual([amount,amount]);
			})
		});
	})
	
	describe('Calculating the balance',()=>{
		let addBalance;
		let times;
		let senderWallet;

		beforeEach(()=>{
			addBalance = 50;
			times = 3;
			senderWallet = new Wallet(blockchain);
		});

		for (let index = 0; index < times; index++) {
			senderWallet.createTransaction(recipientAddress,addBalance);
		}

		blockchain.addBlock(blockchain.memoryPool.transactions);

		it('Calculate the balance for blockchain txs matching the recipient',()=>{
			expect(wallet.calculateBalance).toEqual(INITIAL_BALANCE + (addBalance * times));
		});

		it('Calculatesx the balance for blockchain txs matching the senders',()=>{
			expect(senderWallet.calculateBalance).toEqual(INITIAL_BALANCE - (addBalance * times));
		});

		describe('And the recipuent conducts a transaction',()=>{
			let subtractBalance;
			let recipientBalance;

			beforeEach(()=>{
				blockchain.memoryPool.wipe()
				substractBalance = 10;
				recipientBalance = wallet.calculateBalance;

				wallet.createTransaction(senderWallet.publicKey, addBalance)

				blockchain.addBlock(blockchain.memoryPool.transactions);
			});

			describe('And the sender sends another transaction to the recipient',()=>{
				beforeEach(()=>{
					blockchain.memoryPool.wipe();
					senderWallet.createTransaction(wallet.publicKey,addBalance);

					blockchain.addBlock(blockchain.memoryPool.transactions);
				});

				it('The recipient balance only using txs since its most recent one',()=>{
					expect(wallet.calculateBalance).toEqual(recipientBalance - subtractBalance + addBalance);
				});
			});
		});
	});


})