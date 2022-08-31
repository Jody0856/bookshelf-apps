let bookList = [];

//Check Storage if exist in browser
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser not supported");
    return false;
  }
  return true;
}

// Insert Book
function addBook(event) {
  event.preventDefault();
  let title = document.getElementById("inputBookTitle").value;
  let author = document.getElementById("inputBookAuthor").value;
  let year = document.getElementById("inputBookYear").value;
  let isCompleted = document.getElementById("inputBookIsComplete").checked;
  const Book = {
    bookId: generateId(),
    bookTitle: title,
    bookAuthor: author,
    bookYear: year,
    isComplete: isCompleted,
  };
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to add this book!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Save!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "Your book has been saved.", "success");
      bookList.push(Book);
      document.dispatchEvent(new Event("saved_to_storage"));
      clearForm();
    }
  });
}
function clearForm() {
  let title = (document.getElementById("inputBookTitle").value = "");
  let author = (document.getElementById("inputBookAuthor").value = "");
  let year = (document.getElementById("inputBookYear").value = "");
  let isCompleted = (document.getElementById(
    "inputBookIsComplete"
  ).checked = false);
}

//generate id
function generateId() {
  return Math.floor(Math.random() * 100) + +new Date();
}

//Change Status Reading of  a book
function isRead(event) {
  const button_id = Number(event.target.id);
  const index = bookList.findIndex(function (item) {
    return item.bookId === button_id;
  });
  Swal.fire({
    title: "Are you sure?",
    text: "Change book status to read?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      if (index !== -1) {
        bookList[index] = { ...bookList[index], isComplete: true };
      }
      document.dispatchEvent(new Event("saved_to_storage"));
    }
  });
}

function isNotRead(event) {
  const button_id = Number(event.target.id);
  const index = bookList.findIndex(function (item) {
    return item.bookId === button_id;
  });
  Swal.fire({
    title: "Are you sure?",
    text: "Change book status to not read?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      if (index !== -1) {
        bookList[index] = { ...bookList[index], isComplete: false };
      }
      document.dispatchEvent(new Event("saved_to_storage"));
    }
  });
}
//Delete a Book
function deleteBook(event) {
  const button_id = Number(event.target.id);
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this book?",
    icon: "danger",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "Your book has been deleted.", "success");
      const index = bookList.findIndex(function (item) {
        return item.bookId === button_id;
      });
      if (index !== -1) {
        bookList.splice(index, 1);
      }
      document.dispatchEvent(new Event("saved_to_storage"));
    }
  });
}
//Load Book List
function loadBook(data) {
  const incomplete = document.getElementById("incompleteList");
  const complete = document.getElementById("completeList");
  complete.innerHTML = "";
  incomplete.innerHTML = "";
  for (const item of data) {
    const article = document.createElement("article");
    const title = document.createElement("h2");
    const author = document.createElement("p");
    const year = document.createElement("p");
    article.classList.add("book_item"); //Store Book Info
    title.innerHTML = "<i>" + item.bookTitle + "</i>"; //Book Title
    author.innerHTML = "<i>" + item.bookAuthor + "</i>"; //Book Author
    year.innerHTML = "<i>" + item.bookYear + "</i>"; //Book Year
    const action = document.createElement("div");
    const deleteButton = document.createElement("button");
    const readButton = document.createElement("button");
    action.classList.add("action");
    article.appendChild(title); //insert title element into book info
    article.appendChild(author);
    article.appendChild(year);
    if (item.isComplete) {
      readButton.innerText = "Not Finish Reading";
      readButton.classList.add("green");
      readButton.id = item.bookId; // give bookid
      readButton.addEventListener("click", isNotRead); // give unfinish button an action
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("red");
      deleteButton.id = item.bookId; // give bookid
      deleteButton.addEventListener("click", deleteBook);
      action.appendChild(readButton);
      action.appendChild(deleteButton);
      article.appendChild(action);
      complete.appendChild(article);
    } else {
      readButton.innerText = "Finish Reading";
      readButton.classList.add("green");
      readButton.id = item.bookId; // give bookid
      readButton.addEventListener("click", isRead); // give unfinish button an action
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("red");
      deleteButton.id = item.bookId; // give bookid
      deleteButton.addEventListener("click", deleteBook);
      action.appendChild(readButton);
      action.appendChild(deleteButton);
      article.appendChild(action);
      incomplete.appendChild(article);
    }
  }
}
//Filter Book
function filterBook(event) {
  event.preventDefault();
  const title = document.querySelector("#searchBookTitle");
  let keyword = title.value;
  const filteredData = bookList.filter(function (item) {
    return item.bookTitle.toLowerCase().includes(keyword.toLowerCase());
  });
  if (keyword) {
    loadBook(filteredData);
  } else {
    loadBook(bookList);
  }
}

function clearList() {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to clear all Books?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "All books has been deleted", "success");
      localStorage.clear();
      bookList = [];
      loadBook(bookList);
    }
  });
}
//Save to local Storage
function saveToStorage() {
  localStorage.setItem("book_list", JSON.stringify(bookList));
  loadBook(bookList);
}

document
  .getElementById("inputBookIsComplete")
  .addEventListener("click", function () {
    if (this.checked == true) {
      document.getElementById("info_finish").innerText = "Finish Reading";
    } else {
      document.getElementById("info_finish").innerText = "Not Finish Reading";
    }
  });
window.addEventListener("load", function () {
  if (isStorageExist()) {
    bookList = JSON.parse(localStorage.getItem("book_list")) || [];
    loadBook(bookList);
    const bookForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");
    const clearButton = document.getElementById("clearButton");
    bookForm.addEventListener("submit", addBook);
    searchForm.addEventListener("submit", filterBook);
    clearButton.addEventListener("click", clearList);
    document.addEventListener("saved_to_storage", saveToStorage);
  }
});
