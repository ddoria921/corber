const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android LaunchApp', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb monkey', function() {
    let spawnProps = {};

    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      spawnProps.cmd = cmd;
      spawnProps.args = args;
      return Promise.resolve();
    });

    let launchApp = require('../../../../../lib/targets/android/tasks/launch-app');

    return launchApp('io.corber.project').then(function() {
      expect(spawnProps.cmd).to.equal(adbPath);
      expect(spawnProps.args).to.deep.equal([
        'shell',
        'monkey',
        '-p',
        'io.corber.project',
        '-c',
        'android.intent.category.LAUNCHER',
        1
      ]);
    });
  });
});
