const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({
	region: 'ap-southeast-1',
});

// Define Cognito App Client ID for User pool Identification

const CLIENT_ID = process.env.CLIENT_ID;

exports.confirmSignUp = async (event) => {
	const { email, confirmationCode } = JSON.parse(event.body);

	const params = {
		ClientId: CLIENT_ID, // required
		Username: email, // required
		ConfirmationCode: confirmationCode,
	};

	try {
		const command = new ConfirmSignUpCommand(params);
		await client.send(command);

		return {
			statusCode: 200,
			body: JSON.stringify({ msg: 'User confirmation successfully!' }),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ msg: 'User confirmation failed!', error: error.message }),
		};
	}
};
