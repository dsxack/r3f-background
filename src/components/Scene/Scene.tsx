import React from "react";
import map from "lodash/map";
import Plane from "../Plane/Plane";
import * as THREE from "three";
import {useEffects} from "../../hooks/effects";
import {useTiles} from "../../logic/logic";
import {useAspect} from "../../hooks/aspect";


const startPalette1: THREE.Color[] = map([
    "#818181", "#A6A6A6", "#8B8B8B", "#6A6A6A", "#7B7B7B",
    "#737373", "#8C8C8C", "#A3A3A3", "#B0B0B0", "#ADADAD",
    "#A0A0A0", "#666666", "#ADADAD", "#9E9E9E", "#848484",
    "#707070", "#737373", "#9C9C9C", "#6D6D6D", "#6A6A6A",
    "#7B7B7B", "#828282", "#717171", "#575757", "#5C5C5C",
    "#797979", "#686868", "#5B5B5B", "#616161", "#676767",
    "#828282", "#4A4A4A", "#4D4D4D", "#686868", "#595959",
    "#6B6B6B", "#717171", "#545454", "#343434", "#4F4F4F",
    "#A7A7A7", "#959595", "#707070", "#5D5D5D", "#858585",
], (hex: string) => {
    const color = new THREE.Color(hex)
    color.r = color.r * 1
    color.g = color.g * 1.5
    color.b = color.b * 2
    return color
})


const startPalette2: THREE.Color[] = map([
    "#818181", "#A6A6A6", "#8B8B8B", "#6A6A6A", "#7B7B7B",
    "#737373", "#8C8C8C", "#A3A3A3", "#B0B0B0", "#ADADAD",
    "#A0A0A0", "#666666", "#ADADAD", "#9E9E9E", "#848484",
    "#707070", "#737373", "#9C9C9C", "#6D6D6D", "#6A6A6A",
    "#7B7B7B", "#828282", "#717171", "#575757", "#5C5C5C",
    "#797979", "#686868", "#5B5B5B", "#616161", "#676767",
    "#828282", "#4A4A4A", "#4D4D4D", "#686868", "#595959",
    "#6B6B6B", "#717171", "#545454", "#343434", "#4F4F4F",
    "#A7A7A7", "#959595", "#707070", "#5D5D5D", "#858585",
], (hex: string) => {
    const color = new THREE.Color(hex)
    color.r = color.r * 1.5
    color.g = color.g * 2
    color.b = color.b * 1.5
    return color
})

const posY = (i: number, rowSize: number) => Math.floor(i / rowSize)
const posX = (i: number, rowSize: number) => i % rowSize

type SceneProps = {
    scrollHeight: number
}

const landscapeCameraPosition = new THREE.Vector3(4, 3.25, 2)
const portraitCameraPosition = new THREE.Vector3(4, 5.85, 2)

export const Scene : React.FunctionComponent<SceneProps> = (props) => {
    const { scrollHeight } = props
    const { colors } = useTiles(
        9*5,
        startPalette1,
        startPalette2,
        scrollHeight,
    )
    useAspect(
        landscapeCameraPosition,
        portraitCameraPosition,
        9/5,
        5/9
    )
    useEffects()

    // noinspection RequiredAttributes
    return (
        <>
            <ambientLight args={[0xFFFFFF]}/>
            {map(colors, (color, i: number) => (
                <Plane
                    key={i}
                    position={[posX(i, 9), 0, posY(i, 9)]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    height={1}
                    width={1}
                    color={color}
                    segments={1}
                />
            ))}
        </>
    )
}
