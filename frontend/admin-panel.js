const role = localStorage.getItem("role");

// Protect Admin Page
if(role !== "admin"){
alert("Access Denied");
window.location.href="dashboard.html";
}

const content = document.getElementById("contentArea");

// =============================
// MANAGE USERS
// =============================

async function openUsers(){

content.innerHTML = "<h2>Users</h2>Loading...";

const res = await fetch("http://localhost:5000/api/auth/users");
const users = await res.json();

let html = "<h2>Users</h2>";

users.forEach(user => {

html += `

<div class="user-card">
<span>${user.email}</span>
<button onclick="deleteUser(${user.id})">Delete</button>
</div>
`;

});

content.innerHTML = html;

}

async function deleteUser(id){

if(!confirm("Delete this user?")) return;

await fetch(`http://localhost:5000/api/auth/users/${id}`,{
method:"DELETE"
});

openUsers();

}

// =============================
// VIEW UPLOAD STATS
// =============================
async function openStats(){

content.innerHTML = "Loading stats...";

const res = await fetch("http://localhost:5000/api/admin/stats");
const stats = await res.json();

content.innerHTML = `

<h2>System Dashboard</h2>

<div class="stats-cards">

<div class="card">
<h3>${stats.users}</h3>
<p>👥 Users</p>
</div>

<div class="card">
<h3>${stats.books}</h3>
<p>📚 Books</p>
</div>

<div class="card">
<h3>${stats.pyqs}</h3>
<p>📄 PYQs</p>
</div>

<div class="card">
<h3>${stats.syllabus}</h3>
<p>📖 Syllabus</p>
</div>

<div class="card">
<h3>${stats.subjects}</h3>
<p>🧪 Subjects</p>
</div>

</div>

<canvas id="statsChart" width="400" height="200"></canvas>

`;

createChart(stats);

}

function createChart(stats){

const ctx = document.getElementById("statsChart").getContext("2d");

new Chart(ctx, {
type: "bar",
data: {
labels: ["Books","PYQs","Syllabus","Subjects"],
datasets: [{
label: "Uploads",
data: [
stats.books,
stats.pyqs,
stats.syllabus,
stats.subjects
]
}]
},
options: {
responsive: true
}
});

}

// =============================
// SYSTEM SETTINGS
// =============================

function openSettings(){

content.innerHTML = `

<h2>System Settings</h2>

<div class="settings-box">

<label>Platform Name</label> <input type="text" id="platformName" value="EduQuest"/>

<label>Contact Email</label> <input type="email" id="contactEmail" value="admin@eduquest.com"/>

<label>
<input type="checkbox" id="maintenanceMode">
Enable Maintenance Mode
</label>

<label>
<input type="checkbox" id="allowUploads" checked>
Allow Student Uploads
</label>

<br>

<button onclick="saveSettings()">Save Settings</button>

</div>

`;

}

function saveSettings(){

alert("Settings Saved Successfully");

}
