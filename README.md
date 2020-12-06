### This repos contains source code for https://momentcapturer.com

---

- **_Preact_** for prod build.
- _AWS_ **_Cognito_** for admin sign-in.
- Renders appropriate image with respect to **_screen size_** (srcSet in `Picture` tag).
- **_Serverless_** for CI/CD. Check out `serverless.yml` & `README.serverless.md` files.
- Site assets are stored in _AWS_ **_S3_** cached for 1 year, `gzipped` and served from _AWS_ **_CloudFront_**.
- **API**s are served from `https://api.momentcapturer.com`. Checkout [momentcapturer-API](https://github.com/sureshUngarala/momentcapturer-API) repo for server code.

This project was bootstrapped with [`Create React App`](https://github.com/facebook/create-react-app). So, all its scripts for build & run would work on this.
