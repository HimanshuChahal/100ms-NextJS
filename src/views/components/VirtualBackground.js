import { useEffect, useRef } from "react";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { getRandomVirtualBackground } from "../../common/utils";
import {
  useHMSActions,
  useHMSStore,
  selectIsLocalVideoPluginPresent,
  selectLocalPeer
} from "@100mslive/react-sdk";
import { VirtualBackgroundIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import GrayScalePlugin from './PluginCameraRenderer'

const grayScalePlugin = new GrayScalePlugin()
export const VirtualBackground = () => {
  // const pluginRef = useRef(null);
  const hmsActions = useHMSActions();
  const isPluginAdded = useHMSStore(
    selectIsLocalVideoPluginPresent(grayScalePlugin.getName())
  );

  const localPeer = useHMSStore(selectLocalPeer)

  // function createPlugin() {
  //   if (!pluginRef.current) {
  //     pluginRef.current = new HMSVirtualBackgroundPlugin("none", true);
  //   }
  // }
  // useEffect(() => {
  //   createPlugin();
  // }, []);

  async function addPlugin() {
    try {
      // createPlugin();
      // window.HMS.virtualBackground = pluginRef.current;
      // await pluginRef.current.setBackground(getRandomVirtualBackground());
      //Running VB on every alternate frame rate for optimized cpu usage
      // await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
      if (!isPluginAdded) {
        await hmsActions.addPluginToVideoTrack(grayScalePlugin);
      }
    } catch (err) {
      console.error("add virtual background plugin failed", err);
    }
  }

  async function removePlugin() {
    // if (pluginRef.current) {
    //   await hmsActions.removePluginFromVideoTrack(pluginRef.current);
    //   pluginRef.current = null;
    // }
    await hmsActions.removePluginFromVideoTrack(grayScalePlugin);
  }
  
  useEffect(() => {

    localPeer.roleName === 'client' && (
      setTimeout(() => {
        addPlugin()
      }, 5000)
    )

  }, [])

  // if (pluginRef.current && !pluginRef.current.isSupported()) {
  //   return null;
  // }

  return (
    <div style = {{ display: 'none' }}>
      <Tooltip title={`Turn ${!isPluginAdded ? "on" : "off"} virtual background`}>
        <IconButton
          active={!isPluginAdded}
          onClick={() => {
            !isPluginAdded ? addPlugin() : removePlugin();
          }}
          css={{ mx: "$2", "@md": { display: "none" } }}
        >
          <VirtualBackgroundIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
