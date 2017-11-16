# Bare Bones Starter Kit

## Bare Bones Starter Kit

This is a pretty bare bones starter kit. It does have support for mocha and linting. None of the linting or testing is run automatically. While there is a .travis.yml file it doesn't have to do anything. See the alm-starter-kit (Application Life Cycle management) for a more comprehensive Continuous Deployment approach.

This is a reminder how to get back to just the eslint recommended settings instead of the google set. Modify .eslintrc.json with the following:
```json
	"extends": ["eslint:recommended"],
	"parserOptions": {
		"ecmaVersion": 2017,
		"sourceType": "module"
	},
	"env": {
		"node": true,
		"mocha": true,
		"es6": true
	},
	"rules": {
		"no-console": "off",
		"max-len": [
			1,
			{
				"code": 132,
				"ignoreStrings": true
			}
		],
		"eol-last": "off"
	}
}

## Basic Git Stuff

After cloning delete the .git folder from the Finder
Then create a new repo up in GitHub (don't create the readme)
At the command line

```bash
git init
#update the readme and commit locally in vscode
#change basic-starter-kit.git to the name of the new github repo
git remote add origin git@github.com:Rolias/basic-starter-kit.git
git push -u origin master
```
After those two commands are run, VScode can do push and pull

Don't forget to `npm install`
to install all the packages in the package.json


```json
"extends": [
 "eslint:recommended"
     ],
