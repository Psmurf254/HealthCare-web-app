import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

function randomID(len) {
  let result = "";
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export default function VideoCall() {
  const roomID = getUrlParams().get("roomID") || randomID(5);

  const myMeeting = async (element) => {
    // Generate Kit Token
    const appID = 1651060580;
    const serverSecret = "73dae13162a03196642c96901393c0ca";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });

    // Send notification to patient
    await sendNotificationToPatient(patientId, roomID);
  };

  const { patientId } = useParams();
  const sendNotificationToPatient = async (roomId) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/notifications/createNotification/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: patientId,
            message: `You have a meeting invitation. Join the meeting here. ${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomId}`,
          }),
        }
      );

      console.log("data sent", response);

      if (!response.ok) {
        throw new Error("Failed to send notification to patient");
      }
    } catch (error) {
      console.error("Error sending notification to patient:", error);
    }
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
