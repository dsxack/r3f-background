import {useEffect, useMemo} from "react";
import {useFrame, useThree} from "react-three-fiber";
import * as THREE from "three";
// @ts-ignore
import {BlurPass, EffectComposer, RenderPass, KernelSize} from "postprocessing";

export const useEffects = () => {
    const {gl, scene, camera, size} = useThree()

    const blurPass = useMemo(() => {
        const blurPass = new BlurPass({
            kernelSize: KernelSize.HUGE,
        })
        blurPass.renderToScreen = true
        return blurPass
    }, [])
    useEffect(() => {
        blurPass.scale = 1.5 + size.width / 2000
        blurPass.setSize(size.width, size.height)
    }, [blurPass, size])

    const composer = useMemo(() => {
        const composer = new EffectComposer(gl, {frameBufferType: THREE.HalfFloatType})

        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(blurPass)

        return composer
    }, [blurPass, camera, gl, scene])
    useEffect(() => {
        composer.setSize(size.width, size.height)
    }, [composer, size])


    return useFrame((_, delta) => composer.render(delta), 1)
}
