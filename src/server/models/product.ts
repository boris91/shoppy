import { SchemaDefinition } from 'mongoose';

export const name: string = 'product';

export const schema: SchemaDefinition = {
	createdAt: Date,
	updatedAt: Date,
	title: {
		type: String,
		default: 'Untitled.',
		required: true
	},
	slug: {
		type: String,
		default: '',
		required: true,
		unique: true,
		lowercase: true
	},
	price: {
		type: Number,
		default: 0,
		required: true
	},
	image: {
		type: String,
		default: '',
		required: true
	},
	description: {
		type: String,
		default: 'Undescriptioned.',
		required: true
	}
};