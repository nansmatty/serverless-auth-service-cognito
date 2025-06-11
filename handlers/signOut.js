const { CognitoIdentityProviderClient, GlobalSignOutCommand } = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({
	region: 'ap-southeast-1',
});

exports.signOut = async (event) => {
	const { accessToken } = JSON.parse(event.body);

	const params = {
		// GlobalSignOutRequest
		AccessToken: accessToken, // required
	};

	try {
		const command = new GlobalSignOutCommand(params);
		await client.send(command);

		return {
			statusCode: 200,
			body: JSON.stringify({ msg: 'Sign out successfully' }),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ msg: 'Sign out failed!', error: error.message }),
		};
	}
};
