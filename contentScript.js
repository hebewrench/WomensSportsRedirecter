// Extract the search query from the URL
function getQueryParams(url) {
  const params = new URLSearchParams(new URL(url).search);
  return params.get('q') ? params.get('q').toLowerCase() : '';
}

// Check for sports-related terms while handling special cases
function checkAndRedirect(teams, places, sportsTerms, additionalSportsTerms) {
  const searchQuery = getQueryParams(window.location.href);

  // Exclude searches containing "ladies", "girls", or "boys"
  const excludedTerms = ['ladies', 'girls', 'boys'];
  const containsExcludedTerm = excludedTerms.some(term => searchQuery.includes(term));

  if (containsExcludedTerm) {
    return; // Don't redirect if the search query contains any excluded terms
  }

  // Find if there are any matching teams, sports terms, and places
  const matchedTeams = teams.some(term => new RegExp(`\\b${term}\\b`, 'i').test(searchQuery));
  const matchedSports = sportsTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(searchQuery));
  const matchedPlaces = places.some(term => new RegExp(`\\b${term}\\b`, 'i').test(searchQuery));
  const matchedAdditionalSportsTerm = additionalSportsTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(searchQuery));

  // If only a place term is found and no sports-related terms are found, do nothing
  if ((matchedPlaces)&&(!matchedTeams && !matchedSports &&!matchedAdditionalSportsTerm)) {
    return; // No redirection for just a place term without a sports term
  }

  // If a sports term (team or sport term) is found, redirect to add 'women' (if not already present)
  if ((matchedTeams || matchedSports || matchedAdditionalSportsTerm) && !searchQuery.includes('women') && !searchQuery.includes(' men')) {
    const newQuery = `${searchQuery} women`;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('q', newQuery);
    window.location.href = newUrl.toString();
    return; // Exit after redirecting for sports terms
  }

  // If a place term is found and an additional sports-related term is present, redirect to add 'women'
  if (((matchedPlaces && matchedAdditionalSportsTerm) || (matchedPlaces && matchedSports)) && !searchQuery.includes('women') && !searchQuery.includes(' men')) {
    const newQuery = `${searchQuery} women`;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('q', newQuery);
    window.location.href = newUrl.toString();
    return; // Exit after redirecting for place + sports-related term
  }
}

// Request sports terms from the background script
chrome.runtime.sendMessage({ action: 'getSportsTerms' }, (response) => {
  if (response && response.teams && response.places && response.sports && response.additionalSportsTerms) {
    // Flatten the terms array if necessary
    const allSportsTerms = [
      ...response.teams,
      ...response.places,
      ...response.sports,
      ...response.additionalSportsTerms
    ];
    checkAndRedirect(allSportsTerms);
  }
});
