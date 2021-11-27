# clasp-typescript
A starter template for Google Apps Script by [google/clasp](https://github.com/google/clasp)


## Tech Stack
- [google/clasp](https://github.com/google/clasp)
- [rollup](https://rollupjs.org/)
- [TypeScript](http://www.typescriptlang.org/)
- [ESLint](https://github.com/eslint/eslint)
- [Prettier](https://prettier.io/)
- [Jest](https://facebook.github.io/jest/)
- [Docker](https://www.docker.com/)

## Prerequisites
- [Node.js](https://nodejs.org/)
- [google/clasp](https://github.com/google/clasp)

## Getting Started
### Clone the repository
```
git clone --depth=1 git@github.com:ncukondo/clasp-typescript.git <project_name>
cd <project_name>
rm -Rf .git
```

### Install dependencies
```
yarn
```

### Configuration
#### Open `.clasp.json`, change scriptId
What is scriptId ? https://github.com/google/clasp#scriptid-required
```
{
  "scriptId": <your_script_id>,
  "rootDir": "dist"
}
```

#### Open `src/appsscript.json`, change timeZone (optional)
[Apps Script Manifests](https://developers.google.com/apps-script/concepts/manifests)
```
{
  "timeZone": "Asia/Tokyo", ## Change timeZone
  "dependencies": {
  },
  "exceptionLogging": "STACKDRIVER"
}
```

### Development and build project
```
yarn build
```

### Push
```
yarn run deploy
```



## Advanced
### Using Es6 with Apps Script
[Using Es6 with Apps Script](http://ramblings.mcpher.com/Home/excelquirks/gassnips/es6shim)



## Others
### howdy39/gas-clasp-library
This repository is created based on [howdy39/gas-clasp-library](https://github.com/howdy39/gas-clasp-library).
