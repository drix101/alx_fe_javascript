// Array of quote objects
let quotes = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>— ${randomQuote.category}</small>`;
}

// Function to dynamically create the add-quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Quote input
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  // Category input
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  // Add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);
  formContainer.appendChild(addButton);

  // Append the form to body or a specific section
  document.body.appendChild(formContainer);
}

// Function to add a new quote from user input
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Load event listener for 'Show New Quote' button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call the form creation function on page load
window.onload = createAddQuoteForm;
