import {State} from "./logic";
import map from "lodash/map";

export const selectTilesColors = (state: State) => map(state.tiles, tile => tile.color)
export const selectFunctions = (state: State) => ({
    scrollTo: state.scrollTo,
    init: state.init,
    update: state.update,
})
