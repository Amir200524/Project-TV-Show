// You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes(); // Fetch all episodes
  makePageForEpisodes(allEpisodes); // Render episodes
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear the root element
  rootElem.innerHTML = "";

  // Display the number of episodes
  const episodeCount = document.createElement("p");
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.appendChild(episodeCount);

  // Create cards for each episode
  episodeList.forEach((episode) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "card";

    // Set card content
    card.innerHTML = `
      <img src="${episode.image.medium}" alt="${episode.name}">
      <div class="card-body">
        <h2 class="card-title">${episode.name}</h2>
        <p class="episode-code">${formatEpisodeCode(episode.season, episode.number)}</p>
        <div class="card-text">${episode.summary}</div>
        <a href="${episode.url}" target="_blank" class="link">View on TVMaze</a>
      </div>
    `;

    // Append card to root element
    rootElem.appendChild(card);
  });
}

// Helper function to format episode code
function formatEpisodeCode(season, number) {
  const seasonStr = season.toString().padStart(2, "0");
  const numberStr = number.toString().padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

// Run setup when the page loads
window.onload = setup;

