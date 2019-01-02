[![Build Status](https://travis-ci.org/pzuraq/ember-native-class-polyfill.svg?branch=master)](https://travis-ci.org/pzuraq/ember-native-class-polyfill)

ember-native-class-polyfill
==============================================================================

This addon provides a polyfill for the native class behavior that was proposed
in Ember RFCs [#240](https://emberjs.github.io/rfcs/0240-es-classes.html) and
[#337](https://emberjs.github.io/rfcs/0337-native-class-constructor-update.html).

Installation
------------------------------------------------------------------------------

```
ember install ember-native-class-polyfill
```

Version Support
------------------------------------------------------------------------------

This polyfill currently supports the latest LTS versions of Ember 3.4 and 3.5.

If used with a more recent version of Ember in an app, it will not include the
polyfill, and will warn the user. If included in an addon and used with a more
recent version of Ember it will not include the polyfill and it will _not_ warn
the user, allowing addon authors to safely include the polyfill and support
3.4+.

Usage
------------------------------------------------------------------------------

With this polyfill installed, you can extend from any Ember class using native
class syntax:

```js
import Component from '@ember/component';

class ButtonComponent extends Component {}
```

## Init vs Constructor

Although it was possible to use native classes before the RFCs, there were some
subtle changes to behavior made to classes as part of the RFCs. Most notably,
`constructor` code will occur _before_ `init`:

```js
import Component from '@ember/component';

class ButtonComponent extends Component {
  constructor() {
    super();
    console.log('first');
  }

  init() {
    super.init(...arguments);
    console.log('second');
  }
}
```

This behavior change was made in preparation for class fields, since they occur
during construction. The subtleties of these methods can be confusing, and as
such, it is recommended that you continue to use `init` instead of `constructor`
for any initialization code in your classes.

## Class Fileds and Decorators

Note that this polyfill does _not_ enable the usage of class field or
decorators, and does _not_ include any decorators. Ember has not yet added first
class support for these features, and support for them will need to be added in
future RFCs. This polyfill, and the behaviors shipped in the native class RFCs,
solidify the behavior of classes so that we can prepare for both class fields
and decorators separately.

If you would like to use these features, you can check out the
[ember-decorators](https://github.com/ember-decorators/ember-decorators)
project. The project is _stable_ and committed to providing a stable API to
build on, but cannot provide guarantees on changes to the behavior of decorators
and class fields themselves.


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-native-class-polyfill`
* `yarn install`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
