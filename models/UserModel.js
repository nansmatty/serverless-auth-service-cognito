const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4 } = require('uuid');

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
	region: 'ap-southeast-1',
});

// Define the DynamoDB table name
const TABLE_NAME = process.env.TABLE_NAME;

// User Model Class to represent a user and handle user-related operations
class UserModel {
	constructor(email, fullName) {
		this.userId = v4(); // Generate a unique user ID
		this.email = email;
		this.fullName = fullName;
		this.state = ''; // Default state
		this.city = ''; // Default city
		this.locality = ''; // Default locality
		this.createdAt = new Date().toISOString(); // Set creation date
	}

	async save() {
		const params = {
			TableName: TABLE_NAME,
			Item: {
				userId: { S: this.userId },
				email: { S: this.email },
				fullName: { S: this.fullName },
				state: { S: this.state },
				city: { S: this.city },
				locality: { S: this.locality },
				createdAt: { S: this.createdAt },
			},
		};

		try {
			await dynamoClient.send(new PutItemCommand(params));
		} catch (error) {
			throw new Error(`Error saving user: ${error.message}`);
		}
	}
}

module.exports = UserModel;
