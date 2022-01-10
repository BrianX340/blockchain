import { Transaction } from '.';
import { blockchainWallet } from "./BlockchainWallet";
import { MESSAGE } from '../p2p'
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
		memoryPool.transactions.push(Transaction.reward(this.wallet, blockchainWallet));
		const block = this.blockchain.addBlock(memoryPool.transactions);
		p2pService.sync();
		memoryPool.wipe();
		p2pService.broadcast(MESSAGE.WIPE);

		return block;
	}
}

export default Miner;