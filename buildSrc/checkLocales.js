const fs = require('node:fs'),
  path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const localesDir = path.join(rootDir, 'src', '_locales');
const labelsFile = path.join(rootDir, 'src', 'labels.ts');
const manifestFile = path.join(rootDir, 'src', 'manifest.json');
const localeFile = path.join(rootDir, 'src', 'locale.ts');

const problems = [];
const report = (text) => problems.push(text);

const readMessages = (locale) =>
  JSON.parse(
    fs.readFileSync(path.join(localesDir, locale, 'messages.json'), 'utf8')
  );

const placeholdersOf = (entry) =>
  [...entry.message.matchAll(/\$([A-Za-z0-9_]+)\$/g)]
    .map((match) => match[1].toLowerCase())
    .sort();

const usedKeys = new Set(
  [
    ...fs
      .readFileSync(labelsFile, 'utf8')
      .matchAll(/message\(\s*'([a-z0-9_]+)'/g),
  ].map((match) => match[1])
);
const locales = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const defaultLocale = JSON.parse(
  fs.readFileSync(manifestFile, 'utf8')
).default_locale;

if (!locales.includes(defaultLocale)) {
  report(`the default locale ${defaultLocale} has no messages file`);
}

const defaultMessages = locales.includes(defaultLocale)
  ? readMessages(defaultLocale)
  : {};

for (const key of usedKeys) {
  if (!(key in defaultMessages)) {
    report(`${defaultLocale}: missing key ${key}`);
  }
}
for (const key of Object.keys(defaultMessages)) {
  if (!usedKeys.has(key)) {
    report(`${defaultLocale}: unused key ${key}`);
  }
}

const localeSource = fs.readFileSync(localeFile, 'utf8');
const mappingStart = localeSource.indexOf(
  '{',
  localeSource.indexOf('const locales')
);
const mapping = localeSource.slice(
  mappingStart,
  localeSource.indexOf('}', mappingStart)
);
const mappedLocales = new Set(
  [...mapping.matchAll(/([A-Za-z_]+):/g)].map((match) => match[1])
);

for (const locale of locales) {
  if (!mappedLocales.has(locale)) {
    report(`${locale}: no Ant Design locale in src/locale.ts`);
  }
  const messages = readMessages(locale);
  for (const key of Object.keys(defaultMessages)) {
    if (!(key in messages)) {
      report(`${locale}: missing key ${key}`);
    }
  }
  for (const [key, entry] of Object.entries(messages)) {
    if (!(key in defaultMessages)) {
      report(`${locale}: unknown key ${key}`);
      continue;
    }
    const declared = Object.keys(entry.placeholders ?? {}).map((name) =>
      name.toLowerCase()
    );
    for (const name of placeholdersOf(entry)) {
      if (!declared.includes(name)) {
        report(`${locale}: ${key} uses the undeclared placeholder ${name}`);
      }
    }
    const expected = placeholdersOf(defaultMessages[key]).join(',');
    if (placeholdersOf(entry).join(',') !== expected) {
      report(`${locale}: ${key} placeholders differ from ${defaultLocale}`);
    }
  }
}

for (const problem of problems) {
  console.error(problem);
}
console.log(
  `${usedKeys.size} keys, ${locales.length} locales, ${problems.length} problems`
);
process.exitCode = problems.length === 0 ? 0 : 1;
