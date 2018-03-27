import { SchemaDefinition } from 'mongoose';

export const name: string = 'user';

export const schema: SchemaDefinition = {
	createdAt: Date,
	updatedAt: Date,
	name: {
		type: String,
		default: 'Unnamed.',
		required: true,
		unique: true,
		lowercase: true
	},
	email: {
		type: String,
		default: 'unemailed@mail.com',
		required: true,
		unique: true
	},
	password: {
		type: String,
		default: '0',
		required: true
	},
	age: {
		type: Number,
		default: 18,
		required: true
	},
	photo: {
		type: String,
		default: '',
		required: true
	}
};