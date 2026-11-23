# Colour Picker Manage

A Windows app for picking colours off your screen and keeping them. Pick a colour from anywhere on the screen, name it, and find it again later in a saved, searchable list.

[Get it from the Microsoft Store](https://apps.microsoft.com/detail/9n8t8m67tr7w)

Built with Electron, Vue 3, Quasar and Pinia in October 2023, and sold on the Microsoft Store under the publisher name VitalVictor.

## What it does

- **Picks any colour on the screen.** The eyedropper works over every window, not only inside the app.
- **Keeps a palette.** Each picked colour is saved, up to 1,200 of them. Rename a colour, search the list by name, select it again or delete it.
- **Copies in the format you need.** Copy the current colour as HEX or as RGB.

## How it works

1. Clicking the eyedropper sends `manage:eyedropperview` to the main process, which makes the window full screen and always on top so the picker can reach every part of the screen.
2. The renderer opens Chromium's [EyeDropper API](https://developer.mozilla.org/docs/Web/API/EyeDropper_API). When you click, it returns the colour as an sRGB hex value, and the window goes back to its normal size.
3. The colour goes into a Pinia store and the saved list, which is kept in local storage.
4. The window is frameless and transparent, with a custom title bar (`TitleBar.vue`) whose minimise, maximise and close buttons call the main process over IPC.
5. The renderer runs with `contextIsolation` on and reaches the main process only through the calls in `src-electron/electron-preload.js`.

## Project layout

| Path | Contents |
| --- | --- |
| `src-electron/electron-main.js` | Frameless window, eyedropper mode, window controls |
| `src-electron/electron-preload.js` | The API exposed to the renderer |
| `src/pages/IndexPage.vue` | Picker, current colour, saved list with rename, search and delete |
| `src/components/TitleBar.vue` | The custom title bar |
| `quasar.config.js` | Electron Builder settings for the AppX (Microsoft Store) package |

## Building it yourself

```bash
yarn
quasar dev -m electron     # run in development
quasar build -m electron   # build the AppX package
```

## License

No license is granted. The source is published so you can see how the app is built. It isn't licensed for reuse or redistribution.

Built by [Jeevanjot Singh Vital](https://jeevanjotsinghvital.com).
