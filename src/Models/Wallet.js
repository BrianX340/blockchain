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
		const { currentBalance, blockchain: { memoryPool } } = this;

		if (amount > currentBalance) {
			throw new Error('Amount exceeds balance');
		}

		let tx = memoryPool.find(this.publicKey);
		if (tx) {
			tx.update(this, recipientAddress, amount);
		} else {
			tx = Transaction.create(this, recipientAddress, amount);
			memoryPool.addOrUpdateTransaction(tx);
		}
		return tx;
	}

	get currentBalance() {
		const {
			blockchain: {blocks=[]},
			publicKey
		} = this;
		let { balance } = this;
		let txs = [];

		blocks.forEach(({data=[]}) => {
			if(Array.isArray(data)){
				data.forEach(tx=>{
					txs.push(tx);
				})
			}
		})

		const walletInputTxs = txs.filter(tx => tx.input.address === publicKey);
		let timestamp;
		if(walletInputTxs.length > 0){
			const recentInputTx = walletInputTxs.sort((a,b) => a.input.timestamp - b.input.timestamp).pop();
			balance = recentInputTx.outputs.find(({address}) => address === publicKey).amount;
			timestamp = recentInputTx.input.timestamp;
		}

		txs.filter(({input}) => input.timestamp  > timestamp ).forEach(({outputs}) => {
			outputs.forEach(({ address, amount }) => {
				if (address === publicKey) {
					balance += amount;
				}
			});
		});

		return balance;
	}

}

export { INITIAL_BALANCE };
export default Wallet;