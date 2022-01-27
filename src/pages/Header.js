import {
    selectIsConnectedToRoom,
    useHMSActions,
    useHMSStore,
} from "@100mslive/hms-video-react";
import React from "react";
import { PluginButton } from "./plugin";

function Header() {
const isConnected = useHMSStore(selectIsConnectedToRoom);
const hmsActions = useHMSActions();

return (
    <header>
        {isConnected && (
            <div>
            <PluginButton />
            </div>
        )}
    </header>
);
}

export default Header;
