import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBackgroundImage } from "../lib/api";
import Head from "next/head";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
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
    width: 400,
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
              efficiently and stay organized.
            </Typography>
          </Box>
        </Modal>

        <Modal open={openPrivacy} onClose={handleClosePrivacy}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Privacy Policy
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Your privacy is important to us.
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
