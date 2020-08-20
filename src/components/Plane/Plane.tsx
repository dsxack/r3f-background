import {ReactThreeFiber} from "react-three-fiber";
import React from "react";

type PlaneProps = {
    color?: ReactThreeFiber.Color
    segments?: number
    width?: number
    height?: number
    position: [number, number, number]
    rotation: [number, number, number]
}

function Plane(params: PlaneProps) {
    const {
        position, rotation,
        color,
        width, height,
        segments,
    } = params

    // noinspection RequiredAttributes
    return (
        <mesh
            position={position}
            rotation={rotation}
        >
            <planeBufferGeometry
                attach="geometry"
                args={[width, height, segments, segments]}
            />
            <meshPhongMaterial
                attach="material"
                color={color}
            />
        </mesh>
    )
}

export default Plane
