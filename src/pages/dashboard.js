import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../public/animations/loading.json";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  fetchBackgroundImage,
  fetchLocationData,
  fetchWeatherData,
} from "../lib/api";
import { addTodo, getTodos, deleteTodo } from "../lib/firestore";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Fab,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const auth = getAuth();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchBackground = async () => {
      const imageUrl = await fetchBackgroundImage();
      setBackgroundImage(imageUrl);
    };

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchTodos(user.uid);
        fetchBackground();
        const locationData = await fetchLocationData();
        if (locationData) {
          fetchWeather(locationData.latitude, locationData.longitude);
        }
        updateCurrentTime();
        setUserEmail(user.email);
      } else {
        router.push("/signin");
      }
    });
  }, [auth, router]);

  const fetchWeather = async (latitude, longitude) => {
    const weatherData = await fetchWeatherData(latitude, longitude);
    setWeather(weatherData);
  };

  const updateCurrentTime = () => {
    setCurrentTime(new Date().toLocaleTimeString());
    setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
  };

  const fetchTodos = async (userId) => {
    setLoading(true);
    const fetchedTodos = await getTodos(userId);
    setTodos(fetchedTodos);
    setLoading(false);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo(auth.currentUser.uid, newTodo);
    setNewTodo("");
    fetchTodos(auth.currentUser.uid);
  };

  const handleDeleteTodo = async (todoId) => {
    await deleteTodo(todoId);
    fetchTodos(auth.currentUser.uid);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/signin");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
    );
  }

  const buttonVariants = {
    hover: { scale: 1.2 },
    tap: { scale: 0.8 },
  };

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative p-4">
      <Head>
        <title>Home - Qwik2Do</title>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center blur-sm"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url(${backgroundImage})`,
        }}
      ></div>

      <div
        className={`absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 p-4 rounded-full ${
          expanded ? "w-44" : "w-14"
        } flex items-center justify-center`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {expanded ? (
          <Typography
            variant="body1"
            style={{ fontSize: "0.8rem" }}
            className="flex items-center"
          >
            {userEmail}
          </Typography>
        ) : (
          <PersonIcon />
        )}
      </div>

      <Card className="z-10 w-full max-w-xl my-8 bg-black/30 backdrop-blur-lg shadow-lg rounded-lg p-4">
        <CardContent>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5" component="h2" className="text-black">
                Your To-Dos
              </Typography>
              <div>
                <IconButton onClick={() => router.push("/")} color="inherit">
                  <HomeIcon />
                </IconButton>
                <IconButton onClick={handleSignOut} color="inherit">
                  <LogoutIcon />
                </IconButton>
              </div>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <List>
                {todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={todo.text}
                      secondary={`Added at: ${new Date(
                        todo.createdAt.seconds * 1000
                      ).toLocaleTimeString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
            <div className="flex gap-4 items-center mb-4">
              <TextField
                label="New To-Do"
                variant="outlined"
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-grow"
              />
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Fab color="primary" aria-label="add" onClick={handleAddTodo}>
                  <AddIcon />
                </Fab>
              </motion.div>
            </div>
            {weather && (
              <div className="weather mt-4 text-black">
                <p>Weather: {weather.WeatherText}</p>
                <p>Temperature: {weather.Temperature.Metric.Value}°C</p>
                <p>Current Time: {currentTime}</p>
                <p>{dateString}</p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
