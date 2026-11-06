const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const source = fs.readFileSync('lib/version-manager.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = new Module('version-manager');
loaded._compile(compiled, 'version-manager.js');

test('storage quota failure never deletes another project', () => {
  let saved = '';
  global.window = {};
  global.localStorage = { getItem: () => null, setItem: (_key, value) => { if (value.length > 1200) throw new DOMException('full', 'QuotaExceededError'); saved = value; } };
  const manager = new loaded.exports.VersionManager();
  const first = manager.getActive();
  const now = Date.now;
  Date.now = () => now() + 1000;
  manager.create('other');
  Date.now = now;
  assert.throws(() => manager.update(first.id, 'x'.repeat(2000)), { name: 'QuotaExceededError' });
  assert.equal(manager.getAll().length, 2);
  assert.equal(JSON.parse(saved).versions.length, 2);
});

test('rapid canvas creation and duplication never reuse IDs, including after reload', () => {
  let saved = '';
  global.window = {};
  global.localStorage = {
    getItem: () => saved || null,
    setItem: (_key, value) => { saved = value; },
  };
  const originalNow = Date.now;
  try {
    Date.now = () => 1700000000000;
    const manager = new loaded.exports.VersionManager();
    const first = manager.getActive();
    const second = manager.create('Second');
    const copy = manager.duplicate(first.id, '{"objects":[]}', { width: 100, height: 100 });
    const fourth = manager.create('Fourth');
    const ids = manager.getAll().map((version) => version.id);
    assert.equal(new Set(ids).size, 4);
    assert.equal(copy.data, '{"objects":[]}');
    assert.notEqual(first.id, second.id);
    assert.notEqual(copy.id, fourth.id);
    const reloaded = new loaded.exports.VersionManager();
    assert.deepEqual(reloaded.getAll().map((version) => version.id), ids);
    assert.equal(reloaded.getById(copy.id).data, '{"objects":[]}');
  } finally {
    Date.now = originalNow;
    delete global.window;
    delete global.localStorage;
  }
});


test('failed storage writes roll back canvas data, metadata and active selection', () => {
  let persisted = '';
  let fail = false;
  global.window = {};
  global.localStorage = {
    getItem: () => persisted || null,
    setItem: (_key, value) => {
      if (fail) throw new DOMException('full', 'QuotaExceededError');
      persisted = value;
    },
  };
  const manager = new loaded.exports.VersionManager();
  const original = manager.getActive();
  manager.update(original.id, 'safe');
  const second = manager.create('second');
  const durable = persisted;

  fail = true;
  assert.throws(() => manager.update(original.id, 'lost'), { name: 'QuotaExceededError' });
  assert.equal(manager.getById(original.id).data, 'safe');
  assert.throws(() => manager.rename(original.id, 'lost name'), { name: 'QuotaExceededError' });
  assert.equal(manager.getById(original.id).name, original.name);
  assert.throws(() => manager.delete(second.id), { name: 'QuotaExceededError' });
  assert.equal(manager.getAll().length, 2);
  assert.throws(() => manager.create('unsaved'), { name: 'QuotaExceededError' });
  assert.equal(manager.getAll().length, 2);
  assert.throws(() => manager.duplicate(original.id, 'unsaved copy'), { name: 'QuotaExceededError' });
  assert.equal(manager.getAll().length, 2);
  assert.throws(() => manager.setActive(second.id), { name: 'QuotaExceededError' });
  assert.equal(manager.getActive().id, original.id);
  manager.setActive('does-not-exist');
  assert.equal(manager.getActive().id, original.id);
  assert.equal(persisted, durable);
  fail = false;
  manager.update(original.id, 'recovered');
  assert.equal(JSON.parse(persisted).versions.find((v) => v.id === original.id).data, 'recovered');
});
