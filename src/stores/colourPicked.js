import { defineStore } from "pinia";

export const useColourPicked = defineStore("counter", {
  state: () => ({
    colourSelected: "#ff8000",
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
