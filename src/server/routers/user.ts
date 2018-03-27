import { SchemaDefinition } from 'mongoose';
import { BaseRouter } from './base';
import { name, schema } from '../models/user';

export class UserRouter extends BaseRouter {

	public readonly uriRoute: string = 'users';

	protected modelName: string = name;

	protected modelSchema: SchemaDefinition = schema;

}