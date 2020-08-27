import * as THREE from "three"
import map from "lodash/map"
import filter from "lodash/filter"
import range from "lodash/range"
import random from "lodash/random"
import throttle from "lodash/throttle"
import useScrollPosition from '@react-hook/window-scroll'
import {useEffect, useCallback, useLayoutEffect, useState} from "react";
import {useFrame} from "react-three-fiber";
import {
    ColorTransitionByRangeParams,
    ColorTransitionByTimeParams,
    transitColorByRange,
    transitColorByTime
} from "./transition";
import {normalizeNumber} from "./normalizenumber";

type Colors = THREE.Color[]

type Section = {
    colors: Colors
    transitions?: {
        start: number[]
        end: number[]
    }
}

type SectionTile = {
    color: THREE.Color,
    nextColor: THREE.Color,
    transition: ColorTransitionByTimeParams
}

export type Tile = {
    color?: THREE.Color
    sections: SectionTile[]
    transition: ColorTransitionByRangeParams
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

const updateSectionTile = (tile: SectionTile, colors: Colors): SectionTile => {
    if (tile.transition.endTime > Date.now()) {
        return tile
    }

    return {
        color: tile.nextColor,
        transition: newPaletteTileTransition(),
        nextColor: colors[random(0, colors.length - 1)]
    }
}

const updateSectionsTiles = (tiles: Tile[], sections: Section[]): Tile[] => {
    return map(tiles, tile => ({
        ...tile,
        sections: map(tile.sections, (sectionTile, i) => updateSectionTile(sectionTile, sections[i].colors)),
    }))
}

const calculateTileColor = (tile: Tile, scrollPercent: number): THREE.Color => {
    const sectionsColors = map(tile.sections, sectionTile => transitColorByTime(
        sectionTile.color,
        sectionTile.nextColor,
        sectionTile.transition,
    ))
    return transitColorByRange(sectionsColors, scrollPercent, tile.transition)
}

const updateTilesColors = (tiles: Tile[], scrollPercent: number): Tile[] => {
    return map(tiles, tile => ({
        ...tile,
        color: calculateTileColor(tile, scrollPercent)
    }))
}

const init = (tileCount: number, sections: Section[]): Tile[] => {
    return map(range(0, tileCount), () => ({
        sections:  map(sections, section => ({
            color: section.colors[random(0, section.colors.length - 1)],
            nextColor: section.colors[random(0, section.colors.length - 1)],
            transition: newPaletteTileTransition(),
        })),
        transition: {
            transitionSteps: filter(map(sections, (section) => {
                if (!section.transitions) {
                    return false
                }
                return [
                    random(section.transitions.start[0], section.transitions.start[1]) / 100,
                    random(section.transitions.end[0], section.transitions.end[1]) / 100,
                ]
            })) as number[][]
        }
    }))
}


export const useTiles = (
    tileCount: number,
    sections: Section[],
    scrollHeight: number,
) => {
    const [scrollPercent, setScrollPercent] = useState(0)
    const [tiles, setTiles] = useState<Tile[]>([])

    const scrollPosition = useScrollPosition(30)

    useEffect(() => {
        setTiles(init(tileCount, sections))
    }, [sections, setTiles, tileCount])

    useLayoutEffect(() => {
        setScrollPercent(normalizeNumber(scrollPosition / scrollHeight, 0, 1))
    }, [scrollPosition, scrollHeight])

    const update = useCallback(throttle(() => {
        let newTiles = updateSectionsTiles(tiles, sections)
        newTiles = updateTilesColors(newTiles, scrollPercent)
        setTiles(newTiles)
    }, 30), [tiles, scrollPercent])

    useFrame(update)

    return [
        map(tiles, tile => tile.color)
    ]
}
