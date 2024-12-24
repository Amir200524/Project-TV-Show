const showCache = {};

// Setup function called on page load
function setup() {
  fetchShows();

  // Attach search input event
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearchInput);
}

// Fetch list of shows from TVMaze API
function fetchShows() {
  const showSelect = document.getElementById("show-select");
  if (!showSelect) return;

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch shows");
      return response.json();
    })
    .then((shows) => {
      shows.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      populateShowDropdown(shows);
    })
    .catch((error) => {
      console.error("Error fetching shows:", error);
      showSelect.innerHTML = "<option value=''>Error loading shows</option>";
    });
}

// Populate the dropdown with shows
function populateShowDropdown(shows) {
  const showSelect = document.getElementById("show-select");
  showSelect.innerHTML = "<option value=''>Select a show...</option>";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showCache[show.id] = { show };
    showSelect.appendChild(option);
  });

  // Event listener for show selection
  showSelect.addEventListener("change", (e) => {
    const showId = e.target.value;
    if (showId) fetchEpisodesForShow(showId);
  });
}

// Fetch episodes for a specific show
function fetchEpisodesForShow(showId) {
  const ulList = document.getElementById("ul-list");
  const episodeSelect = document.getElementById("episode-select");
  const searchResult = document.getElementById("search-result");

  if (showCache[showId]?.episodes) {
    displayEpisodes(showCache[showId].episodes);
    populateEpisodeDropdown(showCache[showId].episodes);
    searchResult.textContent = "Displaying all episodes";
    return;
  }

  ulList.innerHTML = "<li>Loading episodes...</li>";
  episodeSelect.innerHTML = "<option value=''>Loading episodes...</option>";

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    })
    .then((episodes) => {
      showCache[showId].episodes = episodes;
      displayEpisodes(episodes);
      populateEpisodeDropdown(episodes);
      searchResult.textContent = "Displaying all episodes";
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
      ulList.innerHTML = "<li>Error loading episodes. Please try again later.</li>";
    });
}

// Populate the episode dropdown
function populateEpisodeDropdown(episodes) {
  const episodeSelect = document.getElementById("episode-select");
  episodeSelect.innerHTML = "<option value=''>Select an episode...</option>";

  episodes.forEach((episode, index) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    episodeSelect.appendChild(option);
  });

  // Event listener for episode selection
  episodeSelect.addEventListener("change", (e) => {
    const episodeId = e.target.value;
    if (episodeId) scrollToEpisode(episodeId);
  });
}

// Scroll to the selected episode
function scrollToEpisode(episodeId) {
  const episodeCard = document.getElementById(`episode-${episodeId}`);
  if (episodeCard) {
    episodeCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Display episodes as cards
function displayEpisodes(episodes) {
  const ulList = document.getElementById("ul-list");
  ulList.innerHTML = "";

  episodes.forEach((episode) => {
    const li = document.createElement("li");
    li.classList.add("li-list-cls");
    li.id = `episode-${episode.id}`; // Assign ID for scrolling

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    title.classList.add("h2-title-cls");

    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "https://via.placeholder.com/250";
    img.alt = `Image for ${episode.name}`;
    img.classList.add("img-picture-cls");

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    summary.classList.add("p-summary-cls");

    const linkWrapper = document.createElement("p");
    linkWrapper.classList.add("p-episode-link");

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "View More";
    link.classList.add("episode-link");

    linkWrapper.appendChild(link);
    li.append(title, img, summary, linkWrapper);
    ulList.appendChild(li);
  });
}

// Handle search input to filter episodes
function handleSearchInput(e) {
  const query = e.target.value.toLowerCase();
  const showId = document.getElementById("show-select").value;
  const episodes = showCache[showId]?.episodes || [];
  const filteredEpisodes = episodes.filter((episode) =>
    `${episode.name} S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`
      .toLowerCase()
      .includes(query)
  );

  displayEpisodes(filteredEpisodes);
  document.getElementById("search-result").textContent = `Displaying ${filteredEpisodes.length} of ${episodes.length} episodes`;
}

// Initialize the setup function on page load
document.addEventListener("DOMContentLoaded", setup);
