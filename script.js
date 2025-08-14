const userContainer = document.getElementById("user-container");
const loader = document.getElementById("loader");
const reloadBtn = document.getElementById("reload-btn");
const searchBar = document.getElementById("search-bar");
const errorPopup = document.getElementById("error-popup");
const retryBtn = document.getElementById("retry-btn");

let allUsers = [];

async function fetchUsers() {
  userContainer.innerHTML = "";
  loader.style.display = "block";
  hidePopup();

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    allUsers = await response.json();
    displayUsers(allUsers, "");

  } catch (error) {
    console.error(error);
    showPopup();
  } finally {
    loader.style.display = "none";
  }
}

function highlightMatch(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<mark>$1</mark>`);
}

function displayUsers(users, searchTerm) {
  userContainer.innerHTML = "";
  users.forEach((user, index) => {
    const card = document.createElement("div");
    card.classList.add("user-card");
    card.style.animationDelay = `${index * 0.1}s`;

    const address = `${user.address.street}, ${user.address.city}`;

    card.innerHTML = `
      <h3>${highlightMatch(user.name, searchTerm)}</h3>
      <p><strong>Email:</strong> ${highlightMatch(user.email, searchTerm)}</p>
      <p><strong>Address:</strong> ${highlightMatch(address, searchTerm)}</p>
    `;

    userContainer.appendChild(card);
  });

  if (users.length === 0) {
    userContainer.innerHTML = "<p style='text-align:center;color:gray;'>No users found.</p>";
  }
}

// Search functionality
searchBar.addEventListener("input", () => {
  const searchTerm = searchBar.value.toLowerCase();
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    `${user.address.street}, ${user.address.city}`.toLowerCase().includes(searchTerm)
  );
  displayUsers(filteredUsers, searchTerm);
});

// Popup control
function showPopup() {
  errorPopup.style.display = "flex";
}

function hidePopup() {
  errorPopup.style.display = "none";
}

// Button events
reloadBtn.addEventListener("click", fetchUsers);
retryBtn.addEventListener("click", fetchUsers);

// Initial load
fetchUsers();
