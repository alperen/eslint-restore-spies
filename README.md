# eslint-plugin-eslint-restore-spies

An ESLint plugin for those people, who forget to restore their spies after the test run.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-eslint-restore-spies`:

```
$ npm install eslint-plugin-eslint-restore-spies --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-eslint-restore-spies` globally.

## Usage

Add `eslint-restore-spies` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "eslint-restore-spies"
    ]
}
```





