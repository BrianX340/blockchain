import { Block } from '../Models';

export default (blockchain)=>{
	const [ genesisBlock, ...blocks ] = blockchain;

	if (JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis)) throw Error('Invalid Genesis Block');

	for (let i = 0; i < blocks.length; i++) {
		const { timestamp, hash, data, previousHash, nonce, difficulty } = blocks[i];
		const previousBlock = blockchain[i];

		if (previousHash !== previousBlock.hash) {
			throw new Error('Invalid Hashes');
		}
		if (hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty)) {
			throw new Error('Invalid Hashes');
		} 
	}

	return true
}