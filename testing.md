Testing
-------

## AWS Setup

1. Create a Cognito User Pool
2. Add an app client, making sure to enable `ALLOW_USER_PASSWORD_AUTH` auth flow.
   Store this client ID in the environment variable `COGNITO_CLIENT_ID`.
3. Create groups in the pool: `dolphin`, `manta`, and `shark`.
4. Create a user (ex. `user@example.com`).
   Store the credentials in `COGNITO_USER_EMAIL` and `COGNITO_USER_PASSWORD`.
5. Create a user (ex. `flipper@example.com`) and add to group `dolphin`.
   Store the credentials in `FLIPPER_EMAIL` and `FLIPPER_PASSWORD`.
6. Create a user (ex. `ray@example.com`) and add to group `manta`.
   Store the credentials in `RAY_EMAIL` and `RAY_PASSWORD`.
7. Create a user (ex. `blue@example.com`) and add to group `shark`.
   Store the credentials in `BLUE_EMAIL` and `BLUE_PASSWORD`.

Set `COGNITO_REGION` with the AWS region in which you created your user pool.
