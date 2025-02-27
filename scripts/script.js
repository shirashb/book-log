import { db, auth } from "../firebase/firebaseConfig.js";
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

  if (!auth.currentUser) {
    alert("Please login first!");
    return;
  }

  try {
    const userId = auth.currentUser.uid;
    const userBooksRef = collection(db, "users", userId, "books");

    await addDoc(userBooksRef, {
      title,
      author,
      genre,
      rating,
      status,
      userId: auth.currentUser.uid,
    });
    alert("Book added successfully!");
    bookForm.reset();
    loadBooks();
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

async function loadBooks() {
  if (!auth.currentUser) {
    alert("Please login first!");
    return;
  }

  const selectedGenre = genreFilter.value;
  bookTableBody.innerHTML = "";
  const genresSet = new Set();

  try {
    const userId = auth.currentUser.uid;
    const userBooksRef = collection(db, "users", userId, "books");

    const querySnapshot = await getDocs(userBooksRef);
    querySnapshot.forEach((docSnapshot) => {
      const book = docSnapshot.data();
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

      const editButton = document.createElement("button");
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.setAttribute("aria-label", "Edit book details");
      editButton.onclick = () => {
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

        const statusInput = document.createElement("select");
        const statuses = ["Not Started", "Reading", "Completed"];
        statuses.forEach((status) => {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          if (status === book.status) {
            option.selected = true;
          }
          statusInput.appendChild(option);
        });
        statusCell.innerHTML = "";
        statusCell.appendChild(statusInput);

        actionsCell.innerHTML = "";

        const saveButton = document.createElement("button");
        saveButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        saveButton.setAttribute("aria-label", "Save book details");
        saveButton.onclick = async () => {
          const newTitle = titleInput.value;
          const newAuthor = authorInput.value;
          const newGenre = genreInput.value;
          const newRating = ratingInput.value;
          const newStatus = statusInput.value;

          try {
            await updateDoc(docRef, {
              title: newTitle,
              author: newAuthor,
              genre: newGenre,
              rating: newRating,
              status: newStatus,
            });
            alert("Book updated successfully!");
            loadBooks();
          } catch (error) {
            console.error("Error updating book: ", error);
          }
        };

        const cancelButton = document.createElement("button");
        cancelButton.innerHTML = '<i class="fa-solid fa-ban"></i>';
        cancelButton.setAttribute("aria-label", "Cancel book details");
        cancelButton.onclick = () => {
          loadBooks();
        };

        actionsCell.appendChild(saveButton);
        actionsCell.appendChild(cancelButton);

        titleInput.addEventListener("keydown", handleEnterKey);
        authorInput.addEventListener("keydown", handleEnterKey);
        genreInput.addEventListener("keydown", handleEnterKey);
        ratingInput.addEventListener("keydown", handleEnterKey);
        statusInput.addEventListener("keydown", handleEnterKey);

        function handleEnterKey(event) {
          if (event.key === "Enter") {
            saveButton.click();
          }
        }
      };
      actionsCell.appendChild(editButton);

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
