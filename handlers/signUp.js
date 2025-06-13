const { CognitoIdentityProviderClient, SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const UserModel = require('../models/UserModel');

// Initialized Cognito Client With Specified AWS Region

const client = new CognitoIdentityProviderClient({
	region: 'ap-southeast-1',
});

// Define Cpognito App Client ID for User pool Identification

const CLIENT_ID = process.env.CLIENT_ID;

// Exported sign-up function to handle new user Registration

exports.signUp = async (event) => {
	// Parse the incoming request body to extract user data

	const { email, password, fullName } = JSON.parse(event.body);

	//Configure the parameters for Cognito SignUpCommand

	const params = {
		ClientId: CLIENT_ID, // required
		Username: email, // required
		Password: password,
		UserAttributes: [
			{
				Name: 'name',
				Value: fullName,
			},
			{
				Name: 'email',
				Value: email,
			},
		],
	};

	try {
		const command = new SignUpCommand(params);
		await client.send(command);

		// Create a new user instance and save it to DynamoDB
		const user = new UserModel(email, fullName);
		await user.save();

		return {
			statusCode: 200,
			body: JSON.stringify({ msg: 'Account created! Please verify your email' }),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ msg: 'Signed up failed!', error: error.message }),
		};
	}
};
