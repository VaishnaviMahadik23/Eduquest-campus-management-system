const API_URL = "http://localhost:5000/api/books";

const booksList = document.getElementById("booksList");
const semesterSelect = document.getElementById("semesterSelect");
const uploadForm = document.getElementById("uploadForm");
const adminSection = document.getElementById("adminUploadSection");

/* =========================
CHECK USER ROLE
========================= */

const role = localStorage.getItem("role");

if (role !== "admin") {
    adminSection.style.display = "none";
}

/* =========================
LOAD BOOKS FROM BACKEND
========================= */

async function loadBooks() {

    try {

        const res = await fetch(API_URL);
        const books = await res.json();

        displayBooks(books);

    } catch (error) {

        console.error("Error loading books", error);

    }

}

/* =========================
DISPLAY BOOKS
========================= */

function displayBooks(books) {

    booksList.innerHTML = "";

    const selectedSemester = semesterSelect.value;

    const filtered = books.filter(book =>
        book.semester_id == selectedSemester
    );

    filtered.forEach(book => {

        const row = document.createElement("tr");

        let adminButtons = "";

        if(role === "admin"){

            adminButtons = `
                <button onclick="editBook(${book.id}, '${book.title}', '${book.author}', ${book.semester_id})"
                class="btn btn-warning btn-sm me-2">
                Edit
                </button>

                <button onclick="deleteBook(${book.id})"
                class="btn btn-danger btn-sm">
                Delete
                </button>
            `;
        }

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.semester_name}</td>

        <td>

            <a href="http://localhost:5000${book.pdf_url}" 
            target="_blank"
            class="btn btn-success btn-sm me-2">
            Download
            </a>

            ${adminButtons}

        </td>
        `;

        booksList.appendChild(row);

    });

}

/* =========================
FILTER SEMESTER
========================= */

function filterBooks() {
    loadBooks();
}

/* =========================
UPLOAD BOOK (ADMIN)
========================= */

uploadForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const semester_id = document.getElementById("semester_id").value;
    const pdfFile = document.getElementById("pdfFile").files[0];

    const formData = new FormData();

    formData.append("title", title);
    formData.append("author", author);
    formData.append("semester_id", semester_id);
    formData.append("pdf", pdfFile);

    try {

       const res = await fetch("http://localhost:5000/api/books/upload",{

        method:"POST",

        headers:{
        "authorization": localStorage.getItem("token"),
        "role": localStorage.getItem("role")
        },

        body:formData

        });
        const data = await res.json();

        alert("Book uploaded successfully");

        uploadForm.reset();

        loadBooks();

    } catch (error) {

        console.error("Upload error", error);

    }

});

/* =========================
DELETE BOOK
========================= */

async function deleteBook(id){

if(!confirm("Delete this book?")) return;

try{

const res = await fetch(`http://localhost:5000/api/books/delete/${id}`,{

method:"DELETE",

headers:{
"authorization": localStorage.getItem("token"),
"role": localStorage.getItem("role")
}

});

const data = await res.json();

alert(data.message);

loadBooks();

}catch(err){

console.error(err);

}

}

/* =========================
EDIT BOOK
========================= */

async function editBook(id, title, author, semester){

    const newTitle = prompt("Enter new title", title);
    const newAuthor = prompt("Enter new author", author);
    const newSemester = prompt("Enter semester id", semester);

    if(!newTitle || !newAuthor) return;

    try{

        const res = await fetch(`http://localhost:5000/api/books/update/${id}`,{

        method:"PUT",

        headers:{
        "Content-Type":"application/json",
        "authorization": localStorage.getItem("token"),
        "role": localStorage.getItem("role")
        },

        body:JSON.stringify({
        title:newTitle,
        author:newAuthor,
        semester_id:newSemester
        })

        });

        const data = await res.json();

        alert(data.message);

        loadBooks();

    }catch(err){

        console.error("Update error", err);

    }

}

/* =========================
INITIAL LOAD
========================= */

loadBooks();