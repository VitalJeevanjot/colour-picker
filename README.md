# Colour Picker (com.jeevanjotsinghvital.colourpicker)

Colour Picker App

Choose a language from **Settings** in the toolbar. **System default** uses Electron’s startup locale, with English as the fallback. A language you select stays selected when you reopen the app.

## Install the dependencies

Use Node.js 22 or later and Yarn Classic.

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
yarn dev -m electron
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
yarn test
yarn build -m electron          # AppX on Windows
yarn build -m electron --skip-pkg
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
