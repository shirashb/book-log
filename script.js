import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;

  try {
    await addDoc(collection(db, "books"), {
      title,
      author,
      genre,
      rating,
    });
    bookForm.reset();
    loadBooks();
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

async function loadBooks() {
  bookList.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((doc) => {
      const book = doc.data();
      const li = document.createElement("li");
      li.textContent = `${book.title} by ${book.author} - Genre: ${book.genre} - Rating: ${book.rating}`;
      bookList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading books: ", error);
  }
}

// Initial load of books
loadBooks();
