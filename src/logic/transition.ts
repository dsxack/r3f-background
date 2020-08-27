import * as THREE from "three";
import {normalizeNumber} from "./normalizenumber";
import each from "lodash/each";

export type ColorTransitionByTimeParams = {
    startTime: number
    endTime: number
}
export const transitColorByTime = (
    fromColor: THREE.Color,
    toColor: THREE.Color,
    params: ColorTransitionByTimeParams,
): THREE.Color => {
    const {startTime, endTime} = params
    const diffTime = endTime - startTime
    const restTime = endTime - Date.now()

    return transitColor(
        fromColor,
        toColor,
        normalizeNumber(1 - restTime / diffTime, 0, 1)
    )
}

export type ColorTransitionByRangeParams = {
    transitionSteps: number[][]
}
export const transitColorByRange = (
    colors: THREE.Color[],
    currentPercent: number,
    params: ColorTransitionByRangeParams,
): THREE.Color => {
    const {transitionSteps} = params

    let toPercent = null;
    let fromPercent = null;
    let fromColor = null;
    let toColor = null;

    // search a color section and transition percents.
    each(transitionSteps, (step, i) => {
        if ((step[0] < currentPercent && step[1] > currentPercent) || currentPercent < step[0]) {
            fromPercent = step[0]
            toPercent = step[1]
            fromColor = colors[i]
            toColor = colors[i + 1]
            return false
        }
    })

    // the last color section.
    if (toPercent == null || fromPercent == null || fromColor == null || toColor == null) {
        return colors[colors.length - 1]
    }

    const range = toPercent - fromPercent

    return transitColor(
        fromColor,
        toColor,
        normalizeNumber(1 - (fromPercent - currentPercent) / range, 0, 1),
    )
}

const transitColor = (
    fromColor: THREE.Color,
    toColor: THREE.Color,
    currentPercent: number,
): THREE.Color => {
    const upperPercent = currentPercent
    const lowerPercent = 1 - currentPercent

    return new THREE.Color(
        fromColor.r * lowerPercent + toColor.r * upperPercent,
        fromColor.g * lowerPercent + toColor.g * upperPercent,
        fromColor.b * lowerPercent + toColor.b * upperPercent,
    )
}
