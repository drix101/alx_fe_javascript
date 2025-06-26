let quotes = [
    {text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "inspiration"},
    {text: "In the middle of every difficulty lies opportunity", category: "life"},
    {text:  "Your time is limited, so don’t waste it living someone else’s life", category: "motivation"}
];

function showRandomQuotes(){
        const quotesDisplay = document.getElementById("quoteDisplay");

        // Picking random quote from the array
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        // Display it in the quoteDisplay div
        quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>— ${randomQuote.category}</small>`;

}

//  Adding event listener to show the new random quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote from user input
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    // Add new quote object to the quotes array
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}