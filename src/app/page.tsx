// src/app/page.tsx

// Note: You might need to change the import path if your file structure is different.
import { ChampionFetcher } from "./ChampionFetcher"; 
import type { Metadata } from "next";

// You can keep the static metadata here
export const metadata: Metadata = {
    title: "A-Z Champion Challenge - League of Legends",
    description: "A-Z Champion Challenge - League of Legends",
};

// The default export of page.tsx is the Server Component wrapper.
export default function Page() {
    return <ChampionFetcher />;
}
