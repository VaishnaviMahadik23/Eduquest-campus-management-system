const modal = document.getElementById("subjectsModal");
const subjectsList = document.getElementById("subjectsList");
const modalTitle = document.getElementById("modalTitle");

let currentSemester = null;

// GET USER ROLE
const role = localStorage.getItem("role");

// SHOW ADMIN CONTROLS ONLY FOR ADMIN
if(role === "admin"){
document.getElementById("adminControls").style.display = "block";
}

// OPEN MODAL
document.querySelectorAll(".view-details-btn").forEach(btn => {

btn.addEventListener("click", () => {

const sem = btn.getAttribute("data-sem");

currentSemester = sem;

modal.style.display = "block";

modalTitle.innerText = "Semester " + sem + " Subjects";

loadSubjects(sem);

});

});

// LOAD SUBJECTS
async function loadSubjects(sem){

const res = await fetch(`https://eduquest-campus-management-system.onrender.com/api/semester/${sem}`);

const data = await res.json();

subjectsList.innerHTML = "";

data.forEach(sub => {

subjectsList.innerHTML += `

<div class="subject-card">

<span class="subject-name">${sub.subject_name}</span>

<div class="subject-actions">

${sub.notes_url ? `<a class="notes-btn" href="https://eduquest-campus-management-system.onrender.com${sub.notes_url}" target="_blank">Download</a>` : ""}

${role === "admin" ? `<button class="edit-btn" onclick="editSubject(${sub.id},'${sub.subject_name}')">Edit</button> <button class="delete-btn" onclick="deleteSubject(${sub.id})">Delete</button>` : ""}

</div>

</div>

`;

});

}

// ADD SUBJECT
async function addSubject(){

const name = document.getElementById("subjectName").value;

const file = document.getElementById("notesFile").files[0];

if(!name){
alert("Enter subject name");
return;
}

const formData = new FormData();

formData.append("semester_id", currentSemester);
formData.append("subject_name", name);
formData.append("notes", file);

await fetch("https://eduquest-campus-management-system.onrender.com/api/semester/add", {

method: "POST",
body: formData

});

document.getElementById("subjectName").value = "";
document.getElementById("notesFile").value = "";

loadSubjects(currentSemester);

}

// DELETE SUBJECT
async function deleteSubject(id){

if(!confirm("Delete this subject?")) return;

await fetch(`https://eduquest-campus-management-system.onrender.com/api/semester/${id}`, {

method: "DELETE"

});

loadSubjects(currentSemester);

}

// EDIT SUBJECT
async function editSubject(id, oldName){

const newName = prompt("Update Subject Name", oldName);

if(!newName) return;

await fetch(`https://eduquest-campus-management-system.onrender.com/api/semester/${id}`, {

method: "PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
subject_name:newName
})

});

loadSubjects(currentSemester);

}

// CLOSE MODAL
function closeModal(){
modal.style.display = "none";
}

// BUTTON EVENT
document.getElementById("addSubjectBtn").addEventListener("click", addSubject);
