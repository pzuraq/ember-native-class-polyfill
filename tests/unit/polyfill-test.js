import { module, test } from 'qunit';
import EmberObject from '@ember/object';

module('Unit | Utility | polyfill', function() {
  test('default values work correctly', function(assert) {
    class Foo extends EmberObject {
      constructor() {
        super(...arguments);
        this.prop = 'default value';
      }
    }

    let foo = Foo.create({ prop: 'other value' });

    assert.equal(foo.prop, 'other value', 'default value is correct');
  });

  test('init/constructor order is correct', function(assert) {
    let calls = [];

    class Foo extends EmberObject {
      constructor() {
        calls.push('constructor before');
        super(...arguments);
        calls.push('constructor after');
      }

      init() {
        calls.push('init before');
        super.init(...arguments);
        calls.push('init after');
      }
    }

    Foo.create();

    assert.deepEqual(
      calls,
      [
        'constructor before',
        'constructor after',
        'init before',
        'init after',
      ],
      'call orders are correct'
    );
  })

  test('it works with zebra-striping', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {}

    const Bar = Foo.extend();

    class Baz extends Bar {}

    const Qux = Baz.extend();

    Qux.create();
  });
});
