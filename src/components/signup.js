import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Alert, Snackbar } from "@mui/material";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Failed to sign up. Please check your email and password.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      router.push("/dashboard");
    } catch (error) {
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
        <title>Sign Up - Qwik2Do</title>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className="absolute inset-0 -z-10 opacity-90">
        <Image
          src="/images/signup-bg.jpg"
          layout="fill"
          objectFit="cover"
          alt="Background"
        />
      </div>

      <div className="bg-black/60 p-4 sm:p-8 rounded-lg shadow-lg max-w-md w-full mx-4 sm:mx-0 backdrop-blur-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white mb-8">
          Sign Up | Qwik2Do
        </h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-black/50 text-white mt-1 border border-gray-600 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-black/50 text-white mt-1 border border-gray-600 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full p-3 flex justify-center items-center rounded-md bg-red-500 text-white font-medium hover:bg-red-600 disabled:bg-red-400 mt-4"
          >
            {loading ? (
              "Signing Up with Google..."
            ) : (
              <>
                Sign Up with
                <Image
                  src="/images/google.png"
                  alt="Google Sign Up"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </>
            )}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-500 hover:text-green-600">
            Sign In
          </Link>
          &nbsp;|{" "}
          <Link href="/" className="text-yellow-500 hover:text-yellow-300">
            Go Home
          </Link>
        </p>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </div>
    </motion.div>
  );
}
