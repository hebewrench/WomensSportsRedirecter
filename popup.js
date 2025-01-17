document.addEventListener('DOMContentLoaded', function () {
  // Initialize EmailJS
  emailjs.init("vyrEbuunAIpUp7LQN");

  // Load sports terms from the file
  fetch(chrome.runtime.getURL('sportsTerms.txt'))
    .then(response => response.text())
    .then(text => {
      document.getElementById('sportsTerms').textContent = text;
    });

  // Handle reload
  document.getElementById('reload').addEventListener('click', function () {
    chrome.runtime.reload();
  });

  // Handle suggestion submission
  document.getElementById('submitSuggestion').addEventListener('click', function () {
    const suggestion = document.getElementById('suggestionInput').value.trim().toLowerCase();
    if (suggestion) {
      // Prepare the email parameters
      const templateParams = { suggestion };

      // Send the suggestion via EmailJS
      emailjs.send('womens_sports_redirect', 'template_h8ejvr5', templateParams)
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
          document.getElementById('suggestionMessage').textContent = 'Suggestion submitted!';
          document.getElementById('suggestionInput').value = ''; // Clear input
        }, function (error) {
          console.log('FAILED...', error);
          document.getElementById('suggestionMessage').textContent = 'Failed to send suggestion.';
        });
    } else {
      // If no suggestion was entered
      document.getElementById('suggestionMessage').textContent = 'Please enter a term.';
    }
  });
});
