// ======= HOME PAGE JS =======

// Refresh Page
function refreshPage() {
    location.reload();
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function openPage(url) {
    window.location.href = url;
}

// ================= PROFILE MODAL =================

// Open Profile Modal
function openProfile() {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") || "USER";
    const joined = localStorage.getItem("joinedDate") || new Date().toISOString().replace("T", " ").split(".")[0];

    document.getElementById("profileName").innerText = username.toUpperCase();
    document.querySelector(".profile-role").innerText = role.toUpperCase();
    document.getElementById("profileEmail").innerText = email;
    document.getElementById("profileJoined").innerText = joined;

    document.getElementById("profileModal").classList.remove("hidden");
    document.getElementById("profileModal").classList.add("show");
}

// Close Profile Modal
function closeProfile() {
    document.getElementById("profileModal").classList.remove("show");
    document.getElementById("profileModal").classList.add("hidden");
}

// ================= ROLE BASED CONTROL =================

document.addEventListener("DOMContentLoaded", () => {

    const username = localStorage.getItem("username") || "User";
    const role = localStorage.getItem("role") || "user";

    document.getElementById("loggedUser").innerText = `Logged in as: ${role}`;

    // If Admin → Show Admin Controls
    if(role === "admin"){

        const dashboard = document.querySelector(".dashboard");

        const adminPanel = document.createElement("div");
        adminPanel.classList.add("card","admin-card");

        adminPanel.innerHTML = `
            <div class="icon">⚙️</div>
            <h3>Admin Panel</h3>
            <p>Manage System</p>
        `;

        adminPanel.onclick = () => {
            window.location.href = "admin-panel.html";
        };

        dashboard.appendChild(adminPanel);
    }

});






async function globalSearch(){

const query = document.getElementById("searchInput").value;

if(query.length < 2){
document.getElementById("searchResults").style.display="none";
return;
}

const res = await fetch(`https://eduquest-campus-management-system.onrender.com/api/search?q=${query}`);
const results = await res.json();

let html = "";

results.forEach(item => {

html += `

<div class="result-item">

<strong>${item.type}</strong> : ${item.title}

</div>
`;

});

const box = document.getElementById("searchResults");

box.innerHTML = html;
box.style.display="block";

}
