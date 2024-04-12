import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Alert, Snackbar } from "@mui/material";

export default function SignIn() {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign in. Please check your email and password.");
      setOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      setOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <Head>
        <title>Sign In - Qwik2Do</title>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="absolute inset-0 -z-10 opacity-80">
        <Image
          src="/images/signin-bg.jpg"
          layout="fill"
          objectFit="cover"
          alt="Background"
        />
      </div>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-white mb-8">
          Sign In to Qwik2Do
        </h1>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-gray-700 text-white mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-gray-700 text-white mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:bg-blue-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full p-3 flex justify-center items-center rounded-md bg-red-500 text-white font-medium hover:bg-red-600 disabled:bg-red-400 mt-4"
          >
            {loading ? (
              "Signing In with Google..."
            ) : (
              <>
                Sign in with
                <Image
                  src="/images/google.png"
                  alt="Google Sign In"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </>
            )}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:text-blue-600">
            Sign Up
          </Link>
          &nbsp;|{" "}
          <Link href="/" className="text-yellow-500 hover:text-blue-600">
            Go Home
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
