class Miner {
	constructor(blockchain, p2pService, wallet) {
		this.blockchain = blockchain;
		this.p2pService = p2pService;
		this.wallet = wallet;
	}

	mine() {
		const {
			blockchain: { memoryPool }
	 	} = this;

		// 1. Include reward for the miner
		// 2. Create a block consisting of the transactions in the memory pool
		// 3. Sync new blockchain with the network
		// 4. Wipe transaction from memory pool
		// 5. Broadcast wipe message to every node
	}
}

export default Miner;