import * as THREE from "three";
import {useFrame, useThree} from "react-three-fiber";

export const useAspect = (
    landscapeCameraPos: THREE.Vector3,
    portraitCameraPos: THREE.Vector3,
    landscapeAspect: number,
    portraitAspect: number,
) => {
    const three = useThree()
    useFrame(() => {
        const camera = three.camera as THREE.PerspectiveCamera
        if (three.size.width > three.size.height) {
            camera.aspect = landscapeAspect
            camera.position.x = landscapeCameraPos.x
            camera.position.y = landscapeCameraPos.y
            camera.position.z = landscapeCameraPos.z
            camera.rotation.z = 0
        } else {
            camera.aspect = portraitAspect
            camera.position.x = portraitCameraPos.x
            camera.position.y = portraitCameraPos.y
            camera.position.z = portraitCameraPos.z
            camera.rotation.z = Math.PI / 2
        }
        camera.updateProjectionMatrix()
    })
}
