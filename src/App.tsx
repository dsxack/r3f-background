import React, {Fragment} from 'react';
import {Canvas} from "react-three-fiber";
import './App.css';
import {Scene} from "./components/Scene/Scene";
import { useWindowHeight } from "@react-hook/window-size"
import range from "lodash/range"
import map from "lodash/map"
// @ts-ignore
import useDimensions from "react-use-dimensions"

function App() {
    const [dimensionsRef, dimensionsSize] = useDimensions();
    const windowHeight = useWindowHeight()

    return (
        <>
            <Canvas
                className={"canvas"}
                camera={{
                    position: [4, 3.25, 2],
                }}
                gl={{
                    powerPreference: "high-performance",
                    antialias: false,
                    stencil: false,
                    // depth: false
                }}
                pixelRatio={window.devicePixelRatio}
                shadowMap
                onCreated={three => {
                    three.camera.lookAt(4, 0, 2)
                }}
                // invalidateFrameloop
            >
                <Scene
                    scrollHeight={dimensionsSize.height - windowHeight}
                />
            </Canvas>

            <div className="content" ref={dimensionsRef}>
                {map(range(0, 20), (i) => (
                    <Fragment key={i}>
                        <h3>Lorem ipsum dolor sit amet</h3>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium commodi debitis eum facilis fugiat praesentium qui? Architecto fuga nam non tempora unde. Commodi consectetur culpa eveniet maxime sit ut!
                        </div>
                    </Fragment>
                ))}
            </div>
        </>
    );
}

export default App;


