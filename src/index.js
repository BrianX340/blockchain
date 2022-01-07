import express from 'express';
import bodyParser from 'body-parser';
import { Blockchain } from './Models';
import P2PService from './p2p';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const p2pService = new P2PService(blockchain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blocks', (req, res) => {
	res.json(blockchain.blocks);
})

app.post('/mine',(req,res)=>{
	const { body: { data } } = req;
	const block = blockchain.addBlock(data);

	p2pService.sync();

	res.json({
		blocks: blockchain.blocks.length,
		block
	});
})

app.get('/transactions',(req,res)=>{
	const { memoryPool: { transactions } } = blockchain;
	res.json(transactions);
})


app.listen(HTTP_PORT, () => {
	console.log(`Service BC PORT: ${HTTP_PORT}`);
	p2pService.listen();
})
