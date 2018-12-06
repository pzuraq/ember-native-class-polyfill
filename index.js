'use strict';
const BroccoliFunnel = require('broccoli-funnel');
const VersionChecker = require('ember-cli-version-checker');
const extractTrueVersion = require('./lib/extract-true-version');
const semver = require('semver');
const path = require('path');

const supportedVersions = ['3.5.1', '3.4.6'];

module.exports = {
  name: require('./package').name,

  _shouldPolyfill: false,
  _polyfillPath: null,

  included(parent) {
    this._super.included.apply(this, arguments);

    let host = this._findHost();

    // Create a root level version checker for checking the Ember version later on
    let emberChecker = new VersionChecker(this.project).forEmber();
    let emberVersion = extractTrueVersion(emberChecker.version);
    let requiredEmberVersion = `~${emberVersion}`;

    if (semver.gte(emberVersion, '3.6.0')) {

      // If the host is the parent, warn to let users know they can remove the polyfill.
      // Otherwise it is probably in an addon, and we shouldn't warn, just do nothing.
      if (host === parent) {
        this.project.ui.writeWarnLine(
          'ember-native-class-polyfill: This polyfill is not needed for Ember >= 3.6.0'
        );
      }
    } else if (supportedVersions.some(v => semver.satisfies(v, requiredEmberVersion))) {
      this._shouldPolyfill = true;
      this._polyfillPath = supportedVersions.find(v => semver.satisfies(v, requiredEmberVersion));

      let emberCliBabel = this.addons.find(a => a.name === 'ember-cli-babel');
      let needsLegacyBuild = [
        'transform-template-literals',
        'transform-literals',
        'transform-arrow-functions',
        'transform-destructuring',
        'transform-spread',
        'transform-parameters',
        'transform-computed-properties',
        'transform-shorthand-properties',
        'transform-block-scoping',
      ].some(p => emberCliBabel.isPluginRequired(p));

      if (needsLegacyBuild) {
        this._polyfillPath = path.join(this._polyfillPath, 'legacy');
      }
    } else {
      let supportedVersionString = supportedVersions
        .join(', ');

      throw new Error(
        `ember-native-class-polyfill: This polyfill only supports the Ember LTS versions: ${
          supportedVersionString
        }. You required ${
          emberVersion
        }. If you are using this polyfill with a more recent patch release of one of the supported versions, you may need to upgrade the polyfill package.`
      );
    }
  },

  treeForVendor(tree) {
    if (!this._shouldPolyfill) {
      return tree;
    }

    return new BroccoliFunnel(`${this.root}/vendor/ember-native-class-polyfill/${this._polyfillPath}`, {
      destDir: 'ember'
    });
  },
};
