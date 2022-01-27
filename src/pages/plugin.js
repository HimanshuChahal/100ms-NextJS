import GrayscalePlugin from "../views/components/PluginCameraRenderer";
import {
    selectIsLocalVideoPluginPresent,
    useHMSActions,
    useHMSStore,
} from "@100mslive/hms-video-react";
import React from "react";

const grayScalePlugin = new GrayscalePlugin();
export function PluginButton() {
    const isPluginAdded = useHMSStore(
        selectIsLocalVideoPluginPresent(grayScalePlugin.getName())
    );
    const hmsActions = useHMSActions();

    React.useEffect(() => {

        setTimeout(() => {
            (async () => {
                if (!isPluginAdded) {
                    await hmsActions.addPluginToVideoTrack(grayScalePlugin);
                }
            })()
        }, 5000)

    }, [])

    return (
        <button id="grayscale-btn" className="btn" style = {{ display: 'none' }}>
            {`${isPluginAdded ? "Remove" : "Add"}`}
        </button>
    );
}
