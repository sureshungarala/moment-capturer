### Serverless setup

1. serverless - Global n local install
2. create account in serverless dashboard(web).
3. Run `serverless config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_ACCESS_KEY}`.
4. Run `serverless login`.
5. Run `serverless deploy`.

Note: Above IAM user should have `Administrator` access.

#### Credits:

1. https://medium.com/@P_Lessing/single-page-apps-on-aws-part-1-hosting-a-website-on-s3-3c9871f126 (part1)
2. https://medium.com/@P_Lessing/single-page-apps-on-aws-part-2-deploying-a-compiled-frontend-33723e8f6814 (part2)
