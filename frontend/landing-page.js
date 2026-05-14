function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

/* ---------------- LOGIN VALIDATION ---------------- */
// ================= LOGIN API =================

document.getElementById("loginForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try{

        const response = await fetch("http://localhost:5000/api/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if(response.ok){

            // Save user info in browser
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("role", data.user.role);

            alert("Login Successful!");

            window.location.href = "home-page.html";

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);
        alert("Server error");

    }

});
/* ---------------- RECOVER VALIDATION ---------------- */

document.getElementById("recoverForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let isValid = true;

    const username = document.getElementById("recoverUsername");
    const email = document.getElementById("recoverEmail");

    clearErrors();

    if (username.value.trim() === "") {
        showError(username, "recoverUsernameError", "Username is required");
        isValid = false;
    }

    if (!validateEmail(email.value)) {
        showError(email, "recoverEmailError", "Enter valid email address");
        isValid = false;
    }

    if (isValid) {
        alert("Recovery Email Sent 📩");
    }
});

// ================= REGISTER API =================

document.getElementById("registerForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if(!role){
        alert("Please select account type");
        return;
    }

    try{

        const response = await fetch("http://localhost:5000/api/auth/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username,
                password,
                email,
                role
            })
        });

        const data = await response.json();

        if(response.ok){

            alert("Account created successfully!");

            showPage("loginPage");

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);
        alert("Server error");

    }

});
/* ---------------- HELPER FUNCTIONS ---------------- */

function showError(input, errorId, message) {
    input.classList.add("error-input");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(input => input.classList.remove("error-input"));
}

function validateEmail(email) {
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return pattern.test(email);
}