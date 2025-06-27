// Quotes array
let quotes = [];

// Load existing quotes from localStorage or use defaults
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "Believe you can and you're halfway there.", category: "Inspiration" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote based on selected category
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter(q => q.category === category);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>— ${randomQuote.category}</small>`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Use map() to extract categories from the quotes array
  const categories = quotes.map(q => q.category);

  // Use Set to get unique categories
  const uniqueCategories = [...new Set(categories)];

  // Clear existing options except 'All'
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Populate the dropdown with unique categories
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category from localStorage if it exists
  const lastFilter = localStorage.getItem("lastSelectedFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedFilter", selectedCategory);
  showRandomQuote();
}

// Create form to add new quote
function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);
  formContainer.appendChild(addButton);
}

// Add new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expecting an array of quote objects.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize app on page load
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();

  // Restore last viewed quote from sessionStorage
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quoteObj = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${quoteObj.text}" <br><small>— ${quoteObj.category}</small>`;
  }

  // Attach event listener to category dropdown
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
};

// Server simulation URL (using JSONPlaceholder)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let lastSyncTimestamp = 0;

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const serverData = await response.json();
    return serverData.slice(0, 5).map(post => ({
      text: post.body.split('\n')[0],
      category: post.title.split(' ')[0],
      timestamp: Date.now(),
      id: post.id
    }));
  } catch (error) {
    console.error('Error fetching from server:', error);
    return null;
  }
}

// Post quote to server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: quote.category,
        body: quote.text,
        userId: 1
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error posting to server:', error);
    return null;
  }
}

// Update addQuote function to include server sync
async function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    const newQuote = {
      text: text,
      category: category,
      timestamp: Date.now(),
      id: Date.now()
    };

    // Add to local storage
    quotes.push(newQuote);
    saveQuotes();

    // Post to server
    const serverResponse = await postQuoteToServer(newQuote);
    if (serverResponse) {
      showSyncNotification('Quote synced with server');
    } else {
      showSyncNotification('Quote saved locally (offline)');
    }

    populateCategories();
    showRandomQuote();

    // Clear inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Sync with server
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes) return;

  // Get local quotes
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Merge quotes with conflict resolution
  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

  // Update local storage
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;

  // Update UI
  showSyncNotification('Quotes synchronized with server');
  populateCategories();
  showRandomQuote();

  lastSyncTimestamp = Date.now();
}

// Merge quotes with conflict resolution
function mergeQuotes(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes];
  
  serverQuotes.forEach(serverQuote => {
    const localIndex = mergedQuotes.findIndex(q => q.id === serverQuote.id);
    if (localIndex === -1) {
      // New quote from server
      mergedQuotes.push(serverQuote);
    } else if (!mergedQuotes[localIndex].timestamp || 
               serverQuote.timestamp > mergedQuotes[localIndex].timestamp) {
      // Server quote is newer
      mergedQuotes[localIndex] = serverQuote;
    }
  });

  return mergedQuotes;
}

// Show sync notification
function showSyncNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'sync-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add manual sync button
function addSyncButton() {
  const syncButton = document.createElement('button');
  syncButton.textContent = 'Sync with Server';
  syncButton.addEventListener('click', syncWithServer);
  document.getElementById('quoteFormContainer').appendChild(syncButton);
}

// Initialize sync functionality
function initializeSync() {
  addSyncButton();
  // Perform initial sync
  syncWithServer();
  // Set up periodic sync (every 5 minutes)
  setInterval(syncWithServer, 5 * 60 * 1000);
}

// Add to your existing initialization code
window.onload = function() {
  loadQuotes();
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
  initializeSync();
};

// Add CSS for notification
const style = document.createElement('style');
style.textContent = `
.sync-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
`;
document.head.appendChild(style);
