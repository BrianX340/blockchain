import { Transaction } from '.';
import { blockchainWallet } from ".";
class Miner {
	constructor(blockchain, p2pService, wallet) {
		this.blockchain = blockchain;
		this.p2pService = p2pService;
		this.wallet = wallet;
	}

	mine() {
		const {
			blockchain: { memoryPool },
			p2pService,
			wallet
	 	} = this;

		if (memoryPool.transactions.length === 0) {
			throw new Error('Memory pool is empty');
		}

		memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
		const block = this.blockchain.addBlock(memoryPool.transactions);
		p2pService.sync();

		return block;
	}
}

export default Miner;