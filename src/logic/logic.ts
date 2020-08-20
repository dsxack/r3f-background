import * as THREE from "three"
import map from "lodash/map"
import range from "lodash/range"
import random from "lodash/random"
import throttle from "lodash/throttle"
import create from 'zustand'
import useScrollPosition from '@react-hook/window-scroll'
import {useEffect, useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {
    ColorTransitionByRangeParams,
    ColorTransitionByTimeParams,
    transitColorByRange,
    transitColorByTime
} from "./transition";
import {normalizeNumber} from "./normalizenumber";
import {selectFunctions, selectTilesColors} from "./selectors";

type Colors = THREE.Color[]

type PaletteTile = {
    color: THREE.Color,
    nextColor: THREE.Color,
    transition: ColorTransitionByTimeParams
}

export type Tile = {
    color: THREE.Color
    transition: ColorTransitionByRangeParams
    startPaletteTile: PaletteTile
    endPaletteTile: PaletteTile
}

export type State = {
    tiles: Tile[]
    tilesCount: number
    scrollPercentValue: number
    startPalette: Colors
    endPalette: Colors

    init: (tileCount: number, startPalette: Colors, endPalette: Colors) => void
    scrollTo: (percent: number) => void
    update: () => void
}

const durationBetweenTileUpdatesMin = 0
const durationBetweenTileUpdatesMax = 1000 * 2
const tileUpdateDurationMin = 500
const tileUpdateDurationMax = 1000 * 2

const newPaletteTileTransition = (): ColorTransitionByTimeParams => {
    const tileUpdateDuration = random(tileUpdateDurationMin, tileUpdateDurationMax)
    const startTime = random(durationBetweenTileUpdatesMin, durationBetweenTileUpdatesMax)
    const now = Date.now()

    return {
        startTime: now + startTime,
        endTime: now + startTime + tileUpdateDuration,
    }
}

const updatePaletteTile = (tile: PaletteTile, colors: Colors): PaletteTile => {
    if (tile.transition.endTime > Date.now()) {
        return tile
    }

    return {
        color: tile.nextColor,
        transition: newPaletteTileTransition(),
        nextColor: colors[random(0, colors.length - 1)]
    }
}

const updatePaletteTiles = (state: State) => {
    const {
        tiles,
        endPalette,
        startPalette,
    } = state

    return {
        ...state,
        tiles: map(tiles, tile => ({
            ...tile,
            startPaletteTile: updatePaletteTile(tile.startPaletteTile, startPalette),
            endPaletteTile: updatePaletteTile(tile.endPaletteTile, endPalette)
        }))
    }
}

const newTile = (
    startPaletteTile: PaletteTile,
    endPaletteTile: PaletteTile,
    transition: ColorTransitionByRangeParams,
    scrollPercentValue: number,
): Tile => {
    const startPaletteColor = transitColorByTime(
        startPaletteTile.color,
        startPaletteTile.nextColor,
        startPaletteTile.transition,
    )
    const endPaletteColor = transitColorByTime(
        endPaletteTile.color,
        endPaletteTile.nextColor,
        endPaletteTile.transition,
    )
    return {
        color: transitColorByRange(startPaletteColor, endPaletteColor, scrollPercentValue, transition),
        startPaletteTile,
        endPaletteTile,
        transition,
    }
}

const updateTilesColor = (state: State) => {
    const {tiles, scrollPercentValue} = state
    return {
        ...state,
        tiles: map(tiles, tile => newTile(
            tile.startPaletteTile,
            tile.endPaletteTile,
            tile.transition,
            scrollPercentValue,
        ))
    }
}

const useStore = create<State>((set, get) => {
    const init = (
        tilesCount: number,
        startPaletteColors: Colors,
        endPaletteColors: Colors,
    ) => set(state => {
        return {
            ...state,
            tiles: map(range(0, tilesCount), () => newTile(
                {
                    color: startPaletteColors[random(0, startPaletteColors.length - 1)],
                    nextColor: startPaletteColors[random(0, startPaletteColors.length - 1)],
                    transition: newPaletteTileTransition(),
                },
                {
                    color: endPaletteColors[random(0, endPaletteColors.length - 1)],
                    nextColor: endPaletteColors[random(0, endPaletteColors.length - 1)],
                    transition: newPaletteTileTransition(),
                },
                {
                    fromPercent: random(30, 49) / 100,
                    toPercent: random(50, 60) / 100
                },
                0
            )),
            startPalette: startPaletteColors,
            endPalette: endPaletteColors,
            scrollPercentValue: 0,
            tilesCount,
        }
    })

    const scrollTo = (percent: number) => set(state => ({
        ...state,
        scrollPercentValue: percent,
    }))

    const update = () => set(state => {
        return updateTilesColor(updatePaletteTiles(state))
    })

    return {
        tilesCount: 0,
        tiles: [],
        scrollPercentValue: 0,
        startPalette: [],
        endPalette: [],

        init,
        scrollTo,
        update,
    }
})

export const useTiles = (
    tileCount: number,
    startPalette: Colors,
    endPalette: Colors,
    scrollHeight: number,
) => {
    const {scrollTo, init, update} = useStore(selectFunctions)
    const scrollPosition = useScrollPosition(30)

    useEffect(() => {
        init(tileCount, startPalette, endPalette)
    }, [init, tileCount, startPalette, endPalette])

    useEffect(() => {
        scrollTo(normalizeNumber(scrollPosition / scrollHeight, 0, 1))
    }, [scrollTo, scrollPosition, scrollHeight])

    useFrame(useCallback(throttle(update, 30), [update]))

    const colors = useStore(selectTilesColors)

    return {
        colors,
    }
}
