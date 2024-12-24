const rootElem = document.getElementById("root");
const searchBox = document.getElementById("search-box");
const showSelector = document.getElementById("show-selector");
const episodeSelector = document.getElementById("episode-selector");
const resultsCount = document.getElementById("results-count");
const backToShowsBtn = document.getElementById("back-to-shows");

let allShows = [];
let allEpisodes = [];
let currentShowId = null;

// Format episode code (e.g., S01E01)
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

// Display show cards
function displayShows(shows) {
  rootElem.innerHTML = "";
  backToShowsBtn.style.display = "none";
  episodeSelector.style.display = "none";
  showSelector.style.display = "block";
  resultsCount.textContent = `Displaying ${shows.length} shows`;

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = show.image?.medium || "https://via.placeholder.com/300";
    img.alt = `Image for ${show.name}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = show.name;

    const summary = document.createElement("p");
    summary.className = "card-text";
    summary.innerHTML = show.summary;

    cardBody.appendChild(title);
    cardBody.appendChild(summary);
    card.appendChild(img);
    card.appendChild(cardBody);
    rootElem.appendChild(card);

    card.addEventListener("click", () => fetchEpisodes(show.id));
  });
}

// Display episode cards
function displayEpisodes(episodes) {
  rootElem.innerHTML = "";
  backToShowsBtn.style.display = "block";
  showSelector.style.display = "none";
  episodeSelector.style.display = "block";
  resultsCount.textContent = `Displaying ${episodes.length} episodes`;

  episodes.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = episode.image?.medium || "https://via.placeholder.com/300";
    img.alt = `Image for ${episode.name}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;

    const summary = document.createElement("p");
    summary.className = "card-text";
    summary.innerHTML = episode.summary;

    cardBody.appendChild(title);
    cardBody.appendChild(summary);
    card.appendChild(img);
    card.appendChild(cardBody);
    rootElem.appendChild(card);
  });
}

// Fetch and display all shows
function fetchShows() {
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((data) => {
      allShows = data.sort((a, b) => a.name.localeCompare(b.name));
      populateShowSelector(allShows);
      displayShows(allShows);
    })
    .catch(() => (resultsCount.textContent = "Failed to load shows."));
}

// Fetch and display episodes for a specific show
function fetchEpisodes(showId) {
  currentShowId = showId;
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      populateEpisodeSelector(allEpisodes);
      displayEpisodes(allEpisodes);
    })
    .catch(() => (resultsCount.textContent = "Failed to load episodes."));
}

// Populate show selector dropdown
function populateShowSelector(shows) {
  showSelector.innerHTML = '<option value="" selected>Jump to a show...</option>';
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

// Populate episode selector dropdown
function populateEpisodeSelector(episodes) {
  episodeSelector.innerHTML = '<option value="" selected>Jump to an episode...</option>';
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

// Event listeners
searchBox.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();

  if (currentShowId) {
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    displayEpisodes(filteredEpisodes);
  } else {
    const filteredShows = allShows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        show.summary.toLowerCase().includes(searchTerm) ||
        show.genres.join(" ").toLowerCase().includes(searchTerm)
    );
    displayShows(filteredShows);
  }
});

showSelector.addEventListener("change", (event) => {
  const showId = event.target.value;
