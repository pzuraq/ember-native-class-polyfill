'use strict';
const BroccoliFunnel = require('broccoli-funnel');
const VersionChecker = require('ember-cli-version-checker');
const browserslist = require('browserslist');
const extractTrueVersion = require('./lib/extract-true-version');
const semver = require('semver');

const supportedVersions = ['3.5.0', '3.4.0'];

module.exports = {
  name: require('./package').name,

  _shouldPolyfill: false,
  _polyfillPath: null,

  included(parent) {
    this._super.included.apply(this, arguments);

    let host = this._findHost();

    // Create a root level version checker for checking the Ember version later on
    const emberVersion = new VersionChecker(this.project).forEmber().version;
    const trueEmberVersion = extractTrueVersion(emberVersion);

    if (semver.gte(trueEmberVersion, '3.6.0')) {

      // If the host is the parent, warn to let users know they can remove the polyfill.
      // Otherwise it is probably in an addon, and we shouldn't warn, just do nothing.
      if (host === parent) {
        this.project.ui.writeWarnLine(
          'ember-native-class-polyfill: This polyfill is not needed for Ember >= 3.6.0'
        );
      }
    } else if (supportedVersions.some(v => semver.satisfies(trueEmberVersion, `~${v}`))) {
      this._shouldPolyfill = true;
      this._polyfillPath = supportedVersions.find(v => semver.satisfies(trueEmberVersion, `~${v}`));

      if (this.project.targets) {
        const browsers = browserslist(this.project.targets.browsers);

        if (browsers.find(browser => browser.includes('ie'))) {
          this._polyfillPath += '/ie'
        }
      }
    } else {
      let supportedVersionString = supportedVersions
        .map(v => `~${v}`)
        .join(', ');

      throw new Error(
        `ember-native-class-polyfill: This polyfill only supports Ember versions ${supportedVersionString}`
      );
    }
  },

  treeForVendor(tree) {
    if (!this._shouldPolyfill) {
      return tree;
    }

    return new BroccoliFunnel(`vendor/ember-native-class-polyfill/${this._polyfillPath}`, {
      destDir: 'ember'
    });
  },
};
