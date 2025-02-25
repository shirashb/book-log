import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Get references to the form and the table body
const bookForm = document.getElementById("book-form");
const bookTableBody = document
  .getElementById("book-list")
  .getElementsByTagName("tbody")[0];

// We no longer use the form for editing in this version.
// The form remains available for adding new books.
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;

  try {
    // Add a new document to the "books" collection
    await addDoc(collection(db, "books"), {
      title,
      author,
      genre,
      rating,
    });
    alert("Book added successfully!");
    bookForm.reset();
    loadBooks();
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

async function loadBooks() {
  // Clear the current table body
  bookTableBody.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((docSnapshot) => {
      const book = docSnapshot.data();
      const docRef = docSnapshot.ref; // Get the document reference
      const row = document.createElement("tr");

      // Create cells for each field
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

      // Create the Actions cell
      const actionsCell = document.createElement("td");

      // Create the Edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = () => {
        // Replace cell contents with input fields for inline editing
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = titleCell.textContent;
        titleCell.innerHTML = "";
        titleCell.appendChild(titleInput);

        const authorInput = document.createElement("input");
        authorInput.type = "text";
        authorInput.value = authorCell.textContent;
        authorCell.innerHTML = "";
        authorCell.appendChild(authorInput);

        const genreInput = document.createElement("input");
        genreInput.type = "text";
        genreInput.value = genreCell.textContent;
        genreCell.innerHTML = "";
        genreCell.appendChild(genreInput);

        const ratingInput = document.createElement("input");
        ratingInput.type = "number";
        ratingInput.value = ratingCell.textContent;
        ratingInput.min = 1;
        ratingInput.max = 5;
        ratingCell.innerHTML = "";
        ratingCell.appendChild(ratingInput);

        // Replace the Edit button with Save and Cancel buttons
        actionsCell.innerHTML = "";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.onclick = async () => {
          const newTitle = titleInput.value;
          const newAuthor = authorInput.value;
          const newGenre = genreInput.value;
          const newRating = ratingInput.value;

          try {
            await updateDoc(docRef, {
              title: newTitle,
              author: newAuthor,
              genre: newGenre,
              rating: newRating,
            });
            alert("Book updated successfully!");
            loadBooks(); // Reload the table to reflect changes
          } catch (error) {
            console.error("Error updating book: ", error);
          }
        };

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.onclick = () => {
          // Reload the books to revert changes
          loadBooks();
        };

        actionsCell.appendChild(saveButton);
        actionsCell.appendChild(cancelButton);
      };

      actionsCell.appendChild(editButton);

      // Create the Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
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
  } catch (error) {
    console.error("Error loading books: ", error);
  }
}

// Initial load of books
loadBooks();
