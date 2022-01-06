import Blockchain from './blockchain/Blockchain';

const blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
  const block = blockchain.addBlock(`Block ${i+1}`);
  console.log(block.toString());
}