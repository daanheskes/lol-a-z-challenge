// src/app/ChampionFetcher.tsx

import Home, { Champion } from "./Home"; // Import the client component and types

// Define the type for the external data structure
interface ChampionDataResponse {
    data: Record<string, Champion>;
}

// This is an ASYNC Server Component. 
export async function ChampionFetcher() {
    
    // 1. Get the latest DDragon version
    const versionsRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
        // *** This option forces SSG: runs only at build time ***
        cache: 'force-cache' 
    });

    const versions: string[] = await versionsRes.json();
    const latestVersion = versions[0];
    
    // 2. Construct the API URL and fetch the champion data
    const API_URL =
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`;

    const res = await fetch(API_URL, {
        // *** This option forces SSG: runs only at build time ***
        cache: 'force-cache'
    });
    
    const data: ChampionDataResponse = await res.json();
    const initialChampions = Object.values(data.data) as Champion[];

    
    // Pass the static data to the client component (Home)
    return (
        <Home 
            initialChampions={initialChampions} 
            version={latestVersion} 
        />
    );
}
