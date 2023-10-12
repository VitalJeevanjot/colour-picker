import { defineStore } from "pinia";

export const useColourPicked = defineStore("counter", {
  state: () => ({
    colourSelected: "#FFA500",
  }),

  getters: {
    getColour(state) {
      return state.colour;
    },
  },

  actions: {
    newColour(colour) {
      console.log("Calling it");
      this.colour = colour;
    },
  },
});
