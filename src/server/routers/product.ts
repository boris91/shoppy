import { SchemaDefinition } from 'mongoose';
import { BaseRouter } from './base';
import { name, schema } from '../models/product';

export class ProductRouter extends BaseRouter {

	public readonly uriRoute: string = 'products';

	protected modelName: string = name;

	protected modelSchema: SchemaDefinition = schema;

}