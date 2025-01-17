// Parse the sportsTerms.txt file and organize terms by category
function parseSportsTerms(text) {
  const categories = {
    teams: [],
    places: [],
    sports: [],
    additionalSportsTerms: []
  };

  const validCategories = Object.keys(categories);

  let currentCategory = null;

  text.split('\n').forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('#')) {
      // Ignore comments
      return;
    }

    if (validCategories.includes(trimmedLine)) {
      // Update current category when a valid category title is found
      currentCategory = trimmedLine;
    } else if (trimmedLine && currentCategory) {
      // Add terms to the current category
      categories[currentCategory].push(trimmedLine.toLowerCase());
    }
  });

  return categories;
}

// Load sports terms from the file
async function loadSportsTerms() {
  const response = await fetch(chrome.runtime.getURL('sportsTerms.txt'));
  const text = await response.text();
  return parseSportsTerms(text); // Parse and return categorized terms
}

// On installation, setup if needed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
  // Perform initial setup or define declarative rules if needed
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSportsTerms') {
    loadSportsTerms().then(categories => {
      sendResponse(categories);  // Send the categories as they are
    });
    return true; // Ensure the response is sent asynchronously
  }
});
