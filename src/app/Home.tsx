// src/app/Home.tsx 

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// --- INTERFACE DEFINITIONS ---
export interface Champion { // Exported for use in ChampionFetcher
    id: string;
    name: string;
    tags: string[]; // Used for filtering (Mage, Fighter, etc.)
    info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
    };
    image: {
        full: string;
    };
}

interface ChampionProgress {
    fun: number;
    games: number;
    notes: string;
}

// Data Dragon Template
const IMG_BASE_URL_TEMPLATE =
    `https://ddragon.leagueoflegends.com/cdn/{{VERSION}}/img/champion/`;

// Define the props for the Home component, received from ChampionFetcher
interface HomeProps {
    initialChampions: Champion[];
    version: string;
}

// --- HOME COMPONENT (Client-Side Logic) ---
export default function Home({ initialChampions, version }: HomeProps) {
    
    // The champion list is now static, provided via the prop.
    const [selectedTag, setSelectedTag] = useState<string>("All");
    const [progress, setProgress] = useState<Record<string, ChampionProgress>>({});
    const [activeChampion, setActiveChampion] = useState<Champion | null>(null);

    // DDragon official tags for filtering
    const allTags = [
        "All", 
        "Fighter", 
        "Tank", 
        "Mage", 
        "Assassin", 
        "Support", 
        "Marksman",
    ];
    
    // Construct the image base URL using the version fetched at build time
    const IMG_BASE_URL = IMG_BASE_URL_TEMPLATE.replace("{{VERSION}}", version);

    // --- Local Storage Effects ---
    useEffect(() => {
        // Load progress from localStorage
        const savedProgress = localStorage.getItem("lol-champion-progress");
        if (savedProgress) {
            try {
                setProgress(JSON.parse(savedProgress));
            } catch (e) {
                console.error("Failed to parse saved progress", e);
            }
        }
    }, []);

    useEffect(() => {
        // Save progress to localStorage whenever it changes
        localStorage.setItem("lol-champion-progress", JSON.stringify(progress));
    }, [progress]);

    // --- Handlers & Filtering ---
    function handleSaveProgress(fun: number, games: number, notes: string) {
        if (!activeChampion) return;
        setProgress((prev) => ({
            ...prev,
            [activeChampion.id]: { fun, games, notes },
        }));
        setActiveChampion(null);
    }

    // Filters based on the Champion's 'tags' property
    const filteredChampions =
        selectedTag === "All"
            ? initialChampions 
            : initialChampions.filter(
                  (champ) => champ.tags.includes(selectedTag)
              );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                League of Legends A-Z Challenge
            </h1>

            {/* Progress Counter */}
            <div className="mb-4 text-lg font-semibold">
                {Object.values(progress).filter((x) => x.games > 0).length} /{" "}
                {initialChampions.length} champions completed (
                {(
                    (Object.values(progress).filter((x) => x.games > 0).length /
                        initialChampions.length) *
                    100
                ).toFixed(1)}
                %)
            </div>

            {/* Tag Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded ${
                            selectedTag === tag
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Champions Grid */}
            <div className="grid grid-cols-10 gap-2">
                {filteredChampions.map((champ) => {
                    const done = progress[champ.id]?.games > 0;
                    return (
                        <div
                            key={champ.id}
                            onClick={() => setActiveChampion(champ)}
                            className={`cursor-pointer ${
                                done ? "border-green-500 border-2" : "border-gray-400 border-0"
                            }`}
                        >
                            <Image
                                src={IMG_BASE_URL + champ.image.full}
                                alt={champ.name}
                                width={124}
                                height={124}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {activeChampion && (
                <Modal
                    champion={activeChampion}
                    onClose={() => setActiveChampion(null)}
                    onSave={handleSaveProgress}
                    existing={progress[activeChampion.id]}
                    version={version} 
                />
            )}
        </div>
    );
}

// --- Modal Component ---
function Modal({
    champion,
    onClose,
    onSave,
    existing,
    version,
}: {
    champion: Champion;
    onClose: () => void;
    onSave: (fun: number, games: number, notes: string) => void;
    existing?: ChampionProgress;
    version: string;
}) {
    const [fun, setFun] = useState(existing?.fun ?? 5);
    const [games, setGames] = useState(existing?.games ?? 1);
    const [notes, setNotes] = useState(existing?.notes ?? "");
    
    // Construct the image URL inside the Modal
    const IMG_BASE_URL = IMG_BASE_URL_TEMPLATE.replace("{{VERSION}}", version);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{champion.name} Progress</h2>
                <Image
                    src={IMG_BASE_URL + champion.image.full}
                    alt={champion.name}
                    width={64}
                    height={64}
                    className="mb-4"
                />
                <label className="block mb-2">
                    Fun (1-10):{" "}
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={fun}
                        onChange={(e) => setFun(Number(e.target.value))}
                        className="border p-1 w-20"
                    />
                </label>
                <label className="block mb-2">
                    Games until Win:{" "}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="px-2 py-1 bg-gray-200"
                            onClick={() => setGames((g) => Math.max(0, g - 1))}
                        >
                            -
                        </button>
                        <span>{games}</span>
                        <button
                            type="button"
                            className="px-2 py-1 bg-gray-200"
                            onClick={() => setGames((g) => g + 1)}
                        >
                            +
                        </button>
                    </div>
                </label>
                <label className="block mb-2">
                    Notes:
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border p-2 w-full"
                    />
                </label>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(fun, games, notes)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}