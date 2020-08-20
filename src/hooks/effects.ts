import {useEffect, useMemo} from "react";
import {useFrame, useThree} from "react-three-fiber";
import * as THREE from "three";
// @ts-ignore
import {BlurPass, EffectComposer, RenderPass, KernelSize} from "postprocessing";

export const useEffects = () => {
    const { gl, scene, camera, size } = useThree()

    const blurPass = useMemo(() => {
        const blurPass = new BlurPass({
            kernelSize: KernelSize.VERY_LARGE,
        })
        blurPass.renderToScreen = true
        blurPass.scale = 1

        return blurPass
    }, [])

    const composer = useMemo(() => {
        const composer = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType })

        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(blurPass)

        return composer
    }, [blurPass, camera, gl, scene])

    useEffect(() => void composer.setSize(size.width, size.height), [composer, size])
    useEffect(() => void blurPass.setSize(size.width, size.height), [blurPass, size])

    return useFrame((_, delta) => composer.render(delta), 1)
}
