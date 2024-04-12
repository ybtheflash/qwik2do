import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const todosCollectionRef = collection(db, "todos");

export const addTodo = async (userId, text) => {
  return await addDoc(todosCollectionRef, {
    userId,
    text,
    completed: false,
    createdAt: new Date(),
  });
};

export const getTodos = async (userId) => {
  const q = query(todosCollectionRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTodo = async (todoId, updatedData) => {
  const todoDocRef = doc(db, "todos", todoId);
  return await updateDoc(todoDocRef, updatedData);
};

export const deleteTodo = async (todoId) => {
  const todoDocRef = doc(db, "todos", todoId);
  return await deleteDoc(todoDocRef);
};
