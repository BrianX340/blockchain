import WebSocket from 'ws';
const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = { 
	BLOCKS:'blocks',
	TX: 'transactions',
	WIPE: 'wipe_memory_pool',
 };

class P2PService {
	constructor(blockchain){
		this.blockchain = blockchain;
		this.sockets = [];
	}

	listen() {
		const server = new WebSocket.Server({ port: P2P_PORT });
		server.on('connection', (socket)=> this.onConnection(socket));

		peers.forEach(peer => {
			const socket = new WebSocket(peer);
			socket.on('open', () => this.onConnection(socket));
		});
		console.log(`Service WS PORT: ${P2P_PORT}`);
	}

	onConnection(socket) {
		const { blockchain } = this;

		console.log('[ws:socket] connected.');
		this.sockets.push(socket);
		socket.on('message', (data) => {
			const { type, value } = JSON.parse(data);
			
			try {
				if (type===MESSAGE.BLOCKS) {
					blockchain.replace(value)
				} else if (type===MESSAGE.TX) {
					blockchain.memoryPool.addOrUpdateTransaction(value);
				} else if (type===MESSAGE.WIPE) {
					blockchain.memoryPool.wipe();
				}
			}
			catch (error) {
				throw Error(error);
			}
		});

		socket.send(JSON.stringify({
			type: 'GET_BLOCKCHAIN',
			value: blockchain
		}));
	}

	sync() {
		const { blockchain: { blocks } } = this;
		this.broadcast(MESSAGE.BLOCKS, blocks);
	}

	broadcast(type, value){
		console.log('[ws:broadcast]', type);
		const message = JSON.stringify({ type, value });
		this.sockets.forEach(socket => socket.send(message));
	}
}

export { MESSAGE }
export default P2PService;