import * as THREE from "three";
import {normalizeNumber} from "./normalizenumber";

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
    fromPercent: number,
    toPercent: number
}
export const transitColorByRange = (
    fromColor: THREE.Color,
    toColor: THREE.Color,
    currentPercent: number,
    params: ColorTransitionByRangeParams,
): THREE.Color => {
    const {toPercent, fromPercent} = params
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
