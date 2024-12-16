// You can edit ALL of the code here
const allEpisodes = getAllEpisodes(); // Fetch all episodes
let state = {
  allEpisodes,
  searchTerm: "",
}
function setup() {
  
  makePageForEpisodes(state.allEpisodes); // Render episodes
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear the root element
  rootElem.innerHTML = "";

  let filteredEpisodes = state.allEpisodes.filter(function(episode){
    return(episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()))
  })

  let cards = filteredEpisodes.map ((item)=> createFilmCard(item))
  // Append card to root element
  cards.forEach((card) => rootElem.appendChild(card));

  let searchLabelDisplay = document.querySelector("#search-label-display");
  searchLabelDisplay.innerHTML = `Displaying ${filteredEpisodes.length}/${state.allEpisodes.length} episodes`

  
}

function createFilmCard(episode){
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
    return card;
}

let searchEpisode = document.querySelector("#search-episode");
searchEpisode.addEventListener("keyup", ()=> {
  state.searchTerm = searchEpisode.value;
  let bodyCards = document.querySelector("#root");
  bodyCards.innerHTML ="";
  makePageForEpisodes()
} )

// Helper function to format episode code
function formatEpisodeCode(season, number) {
  const seasonStr = season.toString().padStart(2, "0");
  const numberStr = number.toString().padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

// Run setup when the page loads
window.onload = setup;
