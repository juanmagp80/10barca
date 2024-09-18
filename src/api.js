// src/api.js
export async function fetchLastMatches() {
    const response = await fetch('https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4335'); // ID de la Liga Española
    const data = await response.json();
    return data.events;
}
