const API_URL = "https://eduquest-campus-management-system.onrender.com/api/pyqs";

const pyqsList = document.getElementById("pyqsList");
const pyqSemesterSelect = document.getElementById("pyqSemesterSelect");
const uploadForm = document.getElementById("uploadPYQForm");
const adminSection = document.getElementById("adminUploadSection");

const role = localStorage.getItem("role");

/* ================= ROLE CONTROL ================= */

if(role !== "admin"){
    adminSection.style.display = "none";
}

/* ================= LOAD PYQS ================= */

async function loadPYQs(){

    try{

        const res = await fetch(API_URL);
        const pyqs = await res.json();

        displayPYQs(pyqs);

    }catch(err){

        console.error("Error loading PYQs",err);

    }

}

/* ================= DISPLAY ================= */

function displayPYQs(pyqs){

    pyqsList.innerHTML = "";

    const semester = pyqSemesterSelect.value;

    const filtered = pyqs.filter(p => p.semester_id == semester);

    filtered.forEach(pyq=>{

        let deleteBtn = "";

        if(role === "admin"){
            deleteBtn = `
                <button onclick="deletePYQ(${pyq.id})"
                class="btn btn-danger btn-sm">
                Delete
                </button>
            `;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${pyq.subject}</td>
        <td>${pyq.year}</td>
        <td>${pyq.semester_name}</td>

        <td>

        <a href="https://eduquest-campus-management-system.onrender.com${pyq.file_url}"
        target="_blank"
        class="btn btn-success btn-sm">
        Download
        </a>

        ${deleteBtn}

        </td>
        `;

        pyqsList.appendChild(row);

    });

}

/* ================= FILTER ================= */

function filterPYQs(){
    loadPYQs();
}

/* ================= UPLOAD ================= */

uploadForm.addEventListener("submit",async function(e){

    e.preventDefault();

    const subject = document.getElementById("subject").value;
    const year = document.getElementById("year").value;
    const semester_id = document.getElementById("semester_id").value;
    const pdfFile = document.getElementById("pdfFile").files[0];

    const formData = new FormData();

    formData.append("subject",subject);
    formData.append("year",year);
    formData.append("semester_id",semester_id);
    formData.append("pdf",pdfFile);

    try{

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        const res = await fetch(`${API_URL}/upload`,{

            method:"POST",

            headers:{
                "authorization": token,
                "role": role
            },

            body:formData

        });

        const data = await res.json();

        alert(data.message);

        uploadForm.reset();

        loadPYQs();

    }catch(err){

        console.error("Upload error",err);

    }

});

/* ================= DELETE ================= */

async function deletePYQ(id){

    if(!confirm("Delete this PYQ?")) return;

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

        loadPYQs();

    }catch(err){

        console.error("Delete error",err);

    }

}

loadPYQs();