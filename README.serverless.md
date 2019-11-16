1) serverless - Global n local install
2) create account in serverless dashboard(web).
3) Run `serverless config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_ACCESS_KEY}`.
4) Run `serverless login`.
5) Run  `serverless deploy`.

Note: Above IAM user should have `Administrator` access.