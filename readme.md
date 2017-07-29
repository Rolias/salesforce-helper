# ALM Starter Kit

## Application Lifecycle Management Starter Kit

This is a pretty bare bones starter kit. It does have support for mocha an linting. None of the linting or testing is run automatically. While there is a .travis.yml file it doesn't have to do anything. See the alm-starter-kit for a more comprehensive CD approach.

This is a reminder how to get back to just the eslint recommended settings instead of the google set. Modify .eslintrc.json with the following:

```json
"extends": [
 "eslint:recommended"
     ],
