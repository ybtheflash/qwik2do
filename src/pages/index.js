import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBackgroundImage } from "../lib/api";
import Head from "next/head";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import { IconButton, Modal, Box, Typography } from "@mui/material";

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [openAbout, setOpenAbout] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const handleOpenAbout = () => setOpenAbout(true);
  const handleCloseAbout = () => setOpenAbout(false);
  const handleOpenPrivacy = () => setOpenPrivacy(true);
  const handleClosePrivacy = () => setOpenPrivacy(false);

  useEffect(() => {
    const fetchBackground = async () => {
      const imageUrl = await fetchBackgroundImage();
      setBackgroundImage(imageUrl);
    };

    fetchBackground();
  }, []);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600, // Set a max width to prevent the modal from becoming too wide
    maxHeight: "80vh", // Set a max height to make the modal scrollable
    overflowY: "auto", // Enable vertical scrolling
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative">
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center blur-sm"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      ></div>

      <div className="backdrop-blur-md bg-opacity-50 bg-black mx-4 p-5 md:mx-0 md:p-10 rounded-lg shadow-lg z-10">
        <div className="absolute top-0 right-0 m-4 flex">
          <IconButton
            color="inherit"
            onClick={handleOpenAbout}
            className="text-base sm:text-sm mr-2"
          >
            <InfoIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleOpenPrivacy}>
            <LockIcon />
          </IconButton>
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">
          Welcome to Qwik2Do
        </h1>
        <p className="mb-4">
          Your go-to app for managing tasks efficiently and staying organized.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray bg-opacity-20 backdrop-blur-lg p-5 rounded-lg">
            <h2 className="text-2xl font-semibold">New Here?</h2>
            <p className="mb-4">
              Sign up and start adding your tasks in a breeze.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-black hover:bg-white text-white hover:text-black font-bold py-2 px-4 rounded"
            >
              Sign Up
            </Link>
          </div>
          <div className="bg-gray bg-opacity-20 backdrop-blur-lg p-5 rounded-lg">
            <h2 className="text-2xl font-semibold">Already have an account?</h2>
            <p className="mb-4">Sign in and manage your tasks.</p>
            <Link
              href="/signin"
              className="inline-block bg-black hover:bg-white text-white hover:text-black font-bold py-2 px-4 rounded"
            >
              Sign In
            </Link>
          </div>
        </div>
        <Modal open={openAbout} onClose={handleCloseAbout}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              About Qwik2Do
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Qwik2Do is an app designed to help you manage your tasks
              efficiently and stay organized. Created by{" "}
              <Link
                href="https://github.com/ybtheflash"
                target="_blank"
                rel="noopener"
              >
                Yubaraj Biswas
              </Link>
              .
            </Typography>
          </Box>
        </Modal>

        <Modal open={openPrivacy} onClose={handleClosePrivacy}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Privacy Policy
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Last updated: 13 April, 2024.
              <br />
              <br />
              Information We Collect:
              <br />
              We collect and use the personal information you provide to us,
              such as your email address and Google account data, to operate and
              improve our website. We do not share your information with anyone
              except as described in this Privacy Policy.
              <br />
              <br />
              How We Use Your Information:
              <br />
              We use your information to provide and improve our website,
              communicate with you, and develop new products and services. We do
              not sell your personal information.
              <br />
              <br />
              Log Files:
              <br />
              We use log files to analyze website usage, but they do not contain
              personally identifiable information.
              <br />
              <br />
              Cookies and Web Beacons:
              <br />
              We use cookies to personalize content and improve your experience
              on our website.
              <br />
              <br />
              Third-Party Privacy Policies:
              <br />
              Our Privacy Policy does not apply to other websites. Please
              consult their Privacy Policies for more information.
              <br />
              <br />
              Your Privacy Rights:
              <br />
              Under the CCPA and GDPR, you have the right to access, correct, or
              delete your personal data. Please contact us to exercise these
              rights.
              <br />
              <br />
              Children&apos;s Information:
              <br />
              We do not knowingly collect personal information from children
              under 13. If you believe your child has provided us with personal
              information, please contact us to remove it.
              <br />
              <br />
              Consent:
              <br />
              By using our website, you consent to our Privacy Policy.
            </Typography>
          </Box>
        </Modal>
      </div>
      <footer className="text-center mt-4 text-xs">
        <Typography variant="body2">
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by{" "}
          <Link
            href="https://github.com/ybtheflash"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            Yubaraj Biswas
          </Link>{" "}
          &copy; {new Date().getFullYear()} All rights reserved
        </Typography>
        <IconButton
          component={Link}
          href="https://github.com/ybtheflash"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          sx={{ color: "white" }}
        >
          <GitHubIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.instagram.com/ybtheflash/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          sx={{ color: "white" }}
        >
          <InstagramIcon sx={{ color: "white" }} />
        </IconButton>
      </footer>
    </div>
  );
}
