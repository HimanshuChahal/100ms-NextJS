import React, { Fragment, useState } from "react";
import {
  VideoList,
  FirstPersonDisplay,
  isMobileDevice,
  selectHMSMessages,
  useHMSStore
} from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import { ChatView } from "./chatView";
import { useWindowSize } from "../hooks/useWindowSize";
import { chatStyle, getBlurClass } from "../../common/utils";

const MAX_TILES_FOR_MOBILE = 4;

/**
 * the below variables are for showing webinar etc. related image if required on certain meeting urls
 */
const webinarProps = JSON.parse(process.env.REACT_APP_WEBINAR_PROPS || "{}");
const eventRoomIDs = webinarProps?.ROOM_IDS || [];
const eventsImg = webinarProps?.IMAGE_FILE || ""; // the image to show in center
// the link to navigate to when user clicks on the image
const webinarInfoLink = webinarProps?.LINK_HREF || "https://100ms.live/";

var timeout = null

// The center of the screen shows bigger tiles
export const GridCenterView = ({
  peers,
  maxTileCount,
  allowRemoteMute,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  hideSidePane,
  totalPeers,
  videoTileProps = () => ({}),
  localPeer
}) => {

  const [ openChat, setOpenChat ] = useState(false)

  const hmsMessages = useHMSStore(selectHMSMessages)

  React.useEffect(() => {

    if(hmsMessages.length > 0)
    {
      setOpenChat(true)

      if(timeout)
      {
        clearTimeout(timeout)
        timeout = null
      }
      
      timeout = setTimeout(() => {
        setOpenChat(false)
      }, 10000)
    }

  }, [ hmsMessages ])

  return (
    <Fragment>
      <Box
        css={{
          flex: "1 1 0",
          height: "100%",
          "@md": { flex: "2 1 0" },
        }}
      >
        {peers && peers.length > 0 ? (
          <VideoList
            peers={peers}
            classes={{
              videoTileContainer: "rounded-lg",
            }}
            maxTileCount={
              isMobileDevice() ? MAX_TILES_FOR_MOBILE : maxTileCount
            }
            allowRemoteMute={allowRemoteMute}
            videoTileProps={videoTileProps}
          />
        ) : eventRoomIDs.some(id => window.location.href.includes(id)) ? (
          <div className="h-full w-full grid place-items-center p-5">
            <a href={webinarInfoLink} target="_blank" rel="noreferrer">
              <img
                className="w-full rounded-lg shadow-lg p-2"
                alt=""
                src={eventsImg}
              />
            </a>
          </div>
        ) : (
          <FirstPersonDisplay classes={{ rootBg: "h-full" }} />
        )}
      </Box>
      {isChatOpen && hideSidePane && localPeer.roleName === 'trainer' && openChat && (
        <Flex
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          css={{
            height: "45%",
            flex: "0 0 20%",
            zIndex: 40,
            mr: "$2",
            alignSelf: "flex-end",
            "@md": chatStyle,
            "@ls": {
              minHeight: "100%", // no sidepeer tiles will be present
              bottom: "$7",
            },
          }}
        >
          <ChatView toggleChat = {() => {
            //toggleChat
          }} />
        </Flex>
      )}
    </Fragment>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({
  peers,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  totalPeers,
  videoTileProps = () => ({}),
  localPeer
}) => {

  const [ openChat, setOpenChat ] = useState(false)

  const hmsMessages = useHMSStore(selectHMSMessages)

  const { width } = useWindowSize();
  let rows = undefined;
  if (width < 768) {
    rows = 2;
  } else if (width === 768) {
    rows = 1;
  }

  React.useEffect(() => {

    if(hmsMessages.length > 0)
    {
      setOpenChat(true)

      if(timeout)
      {
        clearTimeout(timeout)
        timeout = null
      }
      
      timeout = setTimeout(() => {
        setOpenChat(false)
      }, 10000)
    }

  }, [ hmsMessages ])

  return (
    <Flex
      direction="column"
      css={{
        flex: "0 0 20%",
        mx: "$2",
        "@lg": {
          flex: "1 1 0",
        },
      }}
    >
      <Flex css={{ flex: "1 1 0" }} align="end">
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: `rounded-lg ${
                width <= 768 ? "p-0 mr-2" : ""
              }`,
            }}
            maxColCount={2}
            maxRowCount={rows}
            compact={peers.length > 2}
            // show stats for upto 2 peers in sidepane
            videoTileProps={videoTileProps}
          />
        )}
      </Flex>
      {isChatOpen && localPeer.roleName === 'trainer' && openChat && (
        <Flex
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          align="end"
          css={{
            flex: "1 1 0",
            h: "50%",
            p: "$2",
            "@md": chatStyle,
            "@ls": {
              ...chatStyle,
              minHeight: "85%",
            },
          }}
        >
          <ChatView toggleChat={() => {
            //toggleChat
          }} />
        </Flex>
      )}
    </Flex>
  );
};
