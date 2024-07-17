// firestorefunctions.js
import { db } from './firebase'; // Ensure the path is correct
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

// Function to add a comment
const addComment = async (commentData) => {
  try {
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    return { id: docRef.id, ...commentData };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Function to get all comments
const getComments = async () => {
  const querySnapshot = await getDocs(collection(db, 'comments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to update a comment
const updateComment = async (id, updatedData) => {
  const docRef = doc(db, 'comments', id);
  await updateDoc(docRef, updatedData);
};

export { addComment, getComments, updateComment };
