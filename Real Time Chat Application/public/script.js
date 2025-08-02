const socket = io();

const loginContainer = document.getElementById("login-container");
const chatSection = document.getElementById("chat-section");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("join");
const userListDiv = document.getElementById("users");
const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

let selectedUser = null;

// Join chat with username
joinBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username !== "") {
        socket.emit("setUsername", username);
        loginContainer.style.display = "none";
        chatSection.style.display = "block";
    } else {
        alert("Please enter a username!");
    }
});

// Update online user list
socket.on("userList", (users) => {
    userListDiv.innerHTML = "<b>Online Users:</b><br>";

    // Create buttons for each user except yourself
    for (let id in users) {
        if (id !== socket.id) {
            const btn = document.createElement("button");
            btn.textContent = users[id]; // Show username instead of ID
            btn.onclick = () => {
                selectedUser = id;
                alert(`You will now send messages to ${users[id]}`);
            };
            userListDiv.appendChild(btn);
            userListDiv.appendChild(document.createElement("br"));
        }
    }

    // If no other users are online
    if (Object.keys(users).length <= 1) {
        userListDiv.innerHTML += "<i>No other users online</i>";
    }
});

// Send private message
sendBtn.addEventListener("click", () => {
    const message = msgInput.value.trim();
    if (message === "") return;

    if (selectedUser) {
        // Send to selected user
        socket.emit("privateMessage", { to: selectedUser, message });
        addMessage(`You (private): ${message}`);
        msgInput.value = "";
    } else {
        alert("Select a user to send message!");
    }
});

// Receive private message
socket.on("privateMessage", ({ from, message }) => {
    addMessage(`${from}: ${message}`);
});

// Add message to chat box
function addMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
