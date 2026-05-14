const API_URL = "https://eduquest-campus-management-system.onrender.com/api/syllabus";

const syllabusList = document.getElementById("syllabusList");
const semesterSelect = document.getElementById("semesterSelect");
const uploadForm = document.getElementById("uploadForm");
const adminSection = document.getElementById("adminUploadSection");

const role = localStorage.getItem("role");

if(role !== "admin"){
    adminSection.style.display = "none";
}

/* =========================
LOAD SYLLABUS
========================= */

async function loadSyllabus(){

    try{

        const res = await fetch(API_URL);
        const data = await res.json();

        displaySyllabus(data);

    }catch(err){

        console.error("Load error",err);

    }

}

/* =========================
DISPLAY SYLLABUS
========================= */

function displaySyllabus(data){

    syllabusList.innerHTML = "";

    const selectedSemester = semesterSelect.value;

    const filtered = data.filter(item =>
        item.semester_id == selectedSemester
    );

    filtered.forEach(item=>{

        const row = document.createElement("tr");

        let adminButtons = "";

        if(role === "admin"){

            adminButtons = `
            <button class="btn btn-warning btn-sm"
            onclick="editSyllabus(${item.id}, \`${item.subject}\`, ${item.semester_id})">
            Edit
            </button>

            <button class="btn btn-danger btn-sm"
            onclick="deleteSyllabus(${item.id})">
            Delete
            </button>
            `;

        }

        row.innerHTML = `
        <td>${item.subject}</td>
        <td>${item.semester_name}</td>

        <td>

        <a href="https://eduquest-campus-management-system.onrender.com${item.file_url}"
        target="_blank"
        class="btn btn-success btn-sm">
        Download
        </a>

        ${adminButtons}

        </td>
        `;

        syllabusList.appendChild(row);

    });

}

/* =========================
FILTER
========================= */

function filterSyllabus(){
    loadSyllabus();
}

/* =========================
UPLOAD SYLLABUS
========================= */

uploadForm.addEventListener("submit", async function(e){

e.preventDefault();

const subject = document.getElementById("subject").value;
const semester_id = document.getElementById("semester_id").value;
const pdfFile = document.getElementById("pdfFile").files[0];

const formData = new FormData();

formData.append("subject",subject);
formData.append("semester_id",semester_id);
formData.append("pdf",pdfFile);

try{

    const res = await fetch(`${API_URL}/upload`,{

        method:"POST",

        headers:{
            "authorization": localStorage.getItem("token"),
            "role": localStorage.getItem("role")
        },

        body:formData

    });

    const data = await res.json();

    alert(data.message);

    uploadForm.reset();

    loadSyllabus();

}catch(err){

    console.error("Upload error",err);

}

});

/* =========================
DELETE
========================= */

async function deleteSyllabus(id){

const confirmDelete = confirm("Delete this syllabus?");

if(!confirmDelete) return;

try{

    const res = await fetch(`${API_URL}/delete/${id}`,{

        method:"DELETE",

        headers:{
        "authorization": localStorage.getItem("token"),
        "role": localStorage.getItem("role")
        }

    });
    const data = await res.json();

    alert(data.message);

    loadSyllabus();

}catch(err){

    console.error("Delete error",err);

}

}

/* =========================
EDIT
========================= */

async function editSyllabus(id,subject,semester){

const newSubject = prompt("Enter subject name",subject);
const newSemester = prompt("Enter semester id",semester);

if(!newSubject) return;

try{

const res = await fetch(`${API_URL}/update/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json",
"authorization": localStorage.getItem("token"),
"role": localStorage.getItem("role")
},

body:JSON.stringify({
subject:newSubject,
semester_id:newSemester
})

});

const data = await res.json();

alert(data.message);

loadSyllabus();

}catch(err){

console.error("Update error",err);

}

}

/* =========================
INITIAL LOAD
========================= */

loadSyllabus();