# Example OAuth 2.0 flow with Express and Node.js
This example covers the use case of having a backend API server that safeguards your API by acting as a proxy for
passing over OAuth 2.0 access tokens from clients to Google or Facebook.

This is suitable for API servers that don't need to worry about returning rendered HTML or doesn't need its own OAuth 2.0 login and redirect flows.
For example, if your clients are mobile devices that grab OAuth 2.0 access tokens via PKCE (Proof key for code exchange), then you can
have the mobile devices go through their own OAuth 2.0 flow to fetch access tokens directly from OpenID Connect providers such as Google or Facebook.
The access tokens can then be passed over via request headers to the API server whenever you need to call an API.

If you want to have your own OAuth 2.0 login/redirect flow on the backend, consider using [Passport](
http://www.passportjs.org/) instead.


## How to start the server
    npm i
    docker-compose up --build

## How to test authorization

With curl:
```
curl --location --request GET 'http://localhost:3000/' \
--header 'Authorization: Bearer {OAuth 2.0 ID TOKEN here}'
```

Example response:
```
You're authenticated!
{"id":"foo@bar.com","name":"Diego","avatarURL":"..."}
```


