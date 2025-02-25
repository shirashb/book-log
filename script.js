import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const bookForm = document.getElementById("book-form");
const bookTableBody = document
  .getElementById("book-list")
  .getElementsByTagName("tbody")[0];
const genreFilter = document.getElementById("genre-filter");

genreFilter.addEventListener("change", loadBooks);

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;
  const status = document.getElementById("status").value;

  try {
    // Assuming you have a way to get the current user's ID
    const userId = "currentUser Id"; // Replace with actual user ID

    await addDoc(collection(db, "books"), {
      userId: userId, // Add userId to associate the book with the user
      title,
      author,
      genre,
      rating,
      status,
    });
    alert("Book added successfully!");
    bookForm.reset();
    loadBooks();
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

async function loadBooks() {
  const selectedGenre = genreFilter.value;
  bookTableBody.innerHTML = "";
  const genresSet = new Set();

  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((docSnapshot) => {
      const book = docSnapshot.data();
      if (book.userId !== "currentUser Id") return; // Only load books for the current user

      genresSet.add(book.genre);

      if (selectedGenre && book.genre !== selectedGenre) {
        return;
      }

      const docRef = docSnapshot.ref;
      const row = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.textContent = book.title;
      row.appendChild(titleCell);

      const authorCell = document.createElement("td");
      authorCell.textContent = book.author;
      row.appendChild(authorCell);

      const genreCell = document.createElement("td");
      genreCell.textContent = book.genre;
      row.appendChild(genreCell);

      const ratingCell = document.createElement("td");
      ratingCell.textContent = book.rating;
      row.appendChild(ratingCell);

      const statusCell = document.createElement("td");
      statusCell.textContent = book.status;
      row.appendChild(statusCell);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.onclick = async () => {
        try {
          await deleteDoc(docRef);
          alert("Book deleted successfully!");
          loadBooks();
        } catch (error) {
          console.error("Error deleting book: ", error);
        }
      };
      actionsCell.appendChild(deleteButton);
      row.appendChild(actionsCell);
      bookTableBody.appendChild(row);
    });

    genreFilter.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Genres";
    genreFilter.appendChild(allOption);

    Array.from(genresSet)
      .sort()
      .forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
      });

    genreFilter.value = selectedGenre;
  } catch (error) {
    console.error("Error loading books: ", error);
  }
}

loadBooks();
