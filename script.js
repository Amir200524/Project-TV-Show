// Get the DOM elements
const rootElem = document.getElementById("root");
const searchBox = document.getElementById("search-box");
const episodeSelector = document.getElementById("episode-selector");
const resultsCount = document.getElementById("results-count");

// Fetch all episodes
const episodes = getAllEpisodes(); // Provided function

// Function to format episode code (e.g., S01E01)
function formatEpisodeCode(season, number) {
  const seasonCode = season.toString().padStart(2, "0");
  const episodeCode = number.toString().padStart(2, "0");
  return `S${seasonCode}E${episodeCode}`;
}

// Function to create episode cards
function displayEpisodes(episodesList) {
  rootElem.innerHTML = ""; // Clear current content

  episodesList.forEach((episode) => {
    // Create episode card elements
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = episode.image?.medium || "https://via.placeholder.com/300";
    img.alt = `Image for ${episode.name}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = episode.name;

    const code = document.createElement("p");
    code.className = "episode-code";
    code.textContent = formatEpisodeCode(episode.season, episode.number);

    const summary = document.createElement("p");
    summary.className = "card-text";
    summary.innerHTML = episode.summary;

    // Append elements to card
    cardBody.appendChild(title);
    cardBody.appendChild(code);
    cardBody.appendChild(summary);
    card.appendChild(img);
    card.appendChild(cardBody);

    // Append card to root
    rootElem.appendChild(card);
  });
}

// Function to populate the episode selector dropdown
function populateEpisodeSelector(episodesList) {
  episodeSelector.innerHTML = `<option value="" selected>Jump to episode...</option>`;
  episodesList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id; // Use episode ID to find it later
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

// Function to handle live search
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = episodes.filter((episode) => {
    const nameMatch = episode.name.toLowerCase().includes(searchTerm);
    const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
    return nameMatch || summaryMatch;
  });

  // Update UI
  displayEpisodes(filteredEpisodes);
  resultsCount.textContent = `Showing ${filteredEpisodes.length} / ${episodes.length} episodes`;
}

// Function to handle episode selection
function handleEpisodeSelection(event) {
  const selectedId = event.target.value;

  if (selectedId) {
    const selectedEpisode = episodes.find((episode) => episode.id.toString() === selectedId);
    displayEpisodes([selectedEpisode]); // Show only the selected episode
    resultsCount.textContent = `Showing 1 / ${episodes.length} episode`;
  } else {
    // Show all episodes if no selection
    displayEpisodes(episodes);
    resultsCount.textContent = `Showing all episodes`;
  }
}

// Initial rendering
displayEpisodes(episodes);
populateEpisodeSelector(episodes);

// Event listeners
searchBox.addEventListener("input", handleSearch);
episodeSelector.addEventListener("change", handleEpisodeSelection);
