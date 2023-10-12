<template>
  <q-page> </q-page>
</template>

<script>
// import { useColourPicked } from "stores/colourPicked";

export default {
  // name: 'PageName',
  date() {
    return {
      // zoomedPixelData: null,
      // store: useColourPicked(),
    };
  },
  methods: {
    // openEyedropper() {
    //   const eyeDropper = new EyeDropper();
    //   eyeDropper
    //     .open()
    //     .then((result) => {
    //       this.store.newColour(result.sRGBHex);
    //       window.electronAPI.manageColourPickerViewer(false);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       window.electronAPI.printLog(e.message);
    //       window.electronAPI.manageColourPickerViewer(false);
    //     });
    // },
  },
  async mounted() {
    // console.log("Mounted");
    // this.openEyedropper();
  },
};
</script>
