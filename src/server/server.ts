import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as http from 'http';
import * as debug from 'debug';
import * as routers from './routers';
import config from './config';

export default class Server {
	constructor() {
		this.config();
	}

	private MONGODB_URI: string = config.mongoDbUri;

	private API_PATH: string = config.apiPath;

	private app: express.Application;

	private port: number | string | boolean;

	private server: http.Server;

	private async config(): Promise<void> {
		await mongoose.connect(this.MONGODB_URI);
		this.app = express();
		this.app
			.use(bodyParser.urlencoded({ extended: true }))
			.use(bodyParser.json())
			.use(morgan('dev'))
			.use(compression())
			.use(helmet())
			.use(cors());
		this.defineRoutes();
		this.runServer();
	}

	private defineRoutes(): void {
		this.app.use('/', express.Router());
		Object.keys(routers).forEach(key => {
			if ('BaseRouter' !== key) {
				const router: routers.BaseRouter = new routers[key]();
				router.init();
				this.app.use(`${this.API_PATH}/${router.uriRoute}`, router.expressRouter);
			}
		});
	}

	private runServer(): void {
		debug('ts-express:server');

		this.port = this.normalizePort(process.env.PORT || 3000);
		this.app.set('port', this.port);

		console.log(`Server listening on port ${this.port}`);

		this.server = http.createServer(this.app);
		this.server.on('error', this.onError.bind(this));
		this.server.on('listening', this.onListening.bind(this));
		this.server.listen(this.port);
	}

	private normalizePort(val: number | string): number | string | boolean {
		const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
		if (isNaN(port)) {
			return val;
		} else if (port >= 0) {
			return port;
		} else {
			return false;
		}
	}

	private onError(error: NodeJS.ErrnoException): void {
		if (error.syscall !== 'listen') {
			throw error;
		}
		const bind: string = `${'string' === typeof this.port ? 'Pipe' : 'Port'} ${this.port}`;
		switch (error.code) {
			case 'EACCES':
				console.error(`${bind} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(`${bind} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	private onListening(): void {
		const addr = this.server.address();
		const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
		debug(`Listening on ${bind}`);
	}
}