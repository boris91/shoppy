import { Router, Request, Response, NextFunction } from 'express';
import { Schema, model, Model, Document, SchemaDefinition } from 'mongoose';
import { ModelQueryMethods } from '../models/enums/query-methods';

export abstract class BaseRouter {

	protected router: Router;

	public readonly uriRoute: string;

	protected modelName: string;

	protected modelSchema: SchemaDefinition;

	private model: Model<Document>;

	public init(): void {
		this.model = model(this.modelName, new Schema(this.modelSchema));
		this.router = Router();
		this.bindRoutes();
	}

	public get expressRouter(): Router {
		return this.router;
	}

	private bindRoutes(): void {
		this.router.get(`/${this.uriRoute}`, this.performQuery.bind(this, ModelQueryMethods.Find));
	}

	private async performQuery(method: ModelQueryMethods, req: Request, res: Response, next: NextFunction): Promise<void> {
		let data = null;
		let error = null;
		let { params } = req;
		const conditions = params && 0 !== Object.keys(params).length ? params : undefined;

		try {
			data = await this.model[method](conditions);
		} catch(err) {
			error = err;
		} finally {
			res.json({
				error,
				data,
				status: res.statusCode
			});
			next();
		}
	}

}