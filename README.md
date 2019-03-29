# karma-openfin-launcher

> Openfin launcher for [Karma](https://github.com/karma-runner/karma)

This plugin allows you to execute tests in an openfin browser. 

## Installation

Install using

```bash
$ npm install --save-dev git://github.com/reset-dev/karma-openfin-launcher.git
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['openfin']
  })
}
```

You can pass list of browsers as a CLI argument too:

```bash
$ karma start --browsers openfin
```

or with additional configuration arguments
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['custom_openfin'],

    customLaunchers: {
        custom_openfin: {
            base: 'openfin',
            config: { //standard openfin configuration json
              startup_app: {}
              runtime: {}
            }
        }
    },
  })


}
```


----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
