import { Box, Stack, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      setShowFooter(currentScrollTop > lastScrollTop || currentScrollTop === 0);
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const contentHeight = 500;
  return (
    <footer
      style={{
        position: "fixed",
        bottom: showFooter ? 0 : `-${contentHeight}px`,
        width: "100%",
        transform: showFooter ? "scale(1.0)" : "scale(0)",
        transition: "all 0.5s",
        overflowX: "hidden",
      }}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-around"
        padding="30px 0"
        sx={{ backgroundColor: "#443355" }}
      >
        <Box textAlign="left">
          <Typography variant="body1" color="#FFFF">
            © 2024. All rights reserved. <br />
            <span
              style={{
                color: "gray",

                opacity: "0.7",
                fontSize: "12px",
              }}
            >
              {" "}
              PSMURF254{" "}
            </span>
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton
            aria-label="Facebook"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook />
          </IconButton>
          <IconButton
            aria-label="Twitter"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </IconButton>
        </Stack>
      </Stack>
    </footer>
  );
};

export default Footer;
