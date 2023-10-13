import { defineStore } from "pinia";

export const useColourPicked = defineStore("counter", {
  state: () => ({
    colourSelected: "#fffefd",
  }),

  getters: {
    getColour(state) {
      return state.colourSelected;
    },
  },

  actions: {
    newColour(colour) {
      // console.log("Calling it");
      this.colourSelected = colour;
    },
  },
});
