import { Stack, Typography } from "@mui/material";
import React, { useState, useRef } from "react";

import ReactPlayer from "react-player/youtube";
import TimeSince from "../../../utils/TimeFormat";

const ExerciseVideos = ({ video: { id, snippet } }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Stack borderRadius="5px">
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${id?.videoId}`}
        controls={true}
        width="100%"
        height={180}
        playing={isPlaying}
        onPlay={handlePlayPause}
        onPause={handlePlayPause}
        onEnded={handleEnded}
      />
      <Typography
        sx={{
          height: "80px",
          background: "#000",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "none",
          mt: "-2px",
          p: "7px",
        }}
      >
        {snippet?.title.slice(0, 40)} <br />
        <span style={{ opacity: 0.7 }}>
          {" "}
          <TimeSince publishTime={snippet?.publishTime} />
        </span>
      </Typography>
    </Stack>
  );
};

export default ExerciseVideos;
