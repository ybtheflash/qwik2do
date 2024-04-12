import React, { useState, useEffect } from "react";
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
import { motion } from "framer-motion";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
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
      <Card className="z-10 w-full max-w-xl my-8 bg-black/30 backdrop-blur-lg shadow-lg rounded-lg p-4">
        <CardContent>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5" component="h2" className="text-black">
                Your To-Dos
              </Typography>
              <IconButton onClick={handleSignOut} color="inherit">
                <LogoutIcon />
              </IconButton>
            </div>
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
