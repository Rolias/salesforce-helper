# ALM Starter Kit

## Application Lifecycle Management Starter Kit
Since this version uses Travis and watches folder for changes and automatically runs things. I renamed it so that a basic starter kit would have a more bare bones approach. 

This however is suitable for a production project where I want to have some of this automated tooling in place. It is set up with ESLint and linting is part of the build. The tests are also run and then the application can be run. It uses package.json scripts to do all this rather than a tool like Gulp. 

This is a reminder how to get back to just the eslint recommended settings instead of the google set. Modify .eslintrc.json with the following:

```json
"extends": [
 "eslint:recommended"
     ],
