"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Champion {
  id: string;
  name: string;
  tags: string[];
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

const laneRoleMap: Record<string, string[]> = {
  Aatrox: ["Top"],
  Ahri: ["Mid"],
  Akali: ["Top", "Mid"],
  Akshan: ["Mid"],
  Alistar: ["Support"],
  Ambessa: ["Top"],
  Amumu: ["Jungle"],
  Anivia: ["Mid"],
  Annie: ["Mid", "Support"],
  Aphelios: ["Bottom"],
  Ashe: ["Bottom", "Support"],
  "Aurelion Sol": ["Mid"],
  Aurora: ["Mid", "Top"],
  Azir: ["Mid"],
  "Bel'Veth": ["Jungle"],
  Bard: ["Support"],
  Blitzcrank: ["Support"],
  Brand: ["Jungle", "Support", "Mid"],
  Braum: ["Support"],
  Briar: ["Jungle"],
  Camille: ["Top"],
  Cassiopeia: ["Mid", "Top"],
  "Cho'Gath": ["Top", "Mid"],
  Corki: ["Mid", "Bottom"],
  Darius: ["Top"],
  Diana: ["Mid", "Jungle"],
  "Dr. Mundo": ["Top", "Jungle"],
  Draven: ["Bottom"],
  Ekko: ["Mid", "Jungle"],
  Elise: ["Jungle"],
  Evelynn: ["Jungle"],
  Ezreal: ["Bottom"],
  Fiddlesticks: ["Jungle", "Support"],
  Fiora: ["Top"],
  Fizz: ["Mid"],
  Galio: ["Mid", "Support"],
  Gangplank: ["Top"],
  Garen: ["Top"],
  Gnar: ["Top"],
  Gragas: ["Jungle", "Top", "Mid"],
  Graves: ["Jungle"],
  Gwen: ["Top"],
  Hecarim: ["Jungle"],
  Heimerdinger: ["Top", "Mid"],
  Hwei: ["Mid", "Bottom"],
  Irelia: ["Top", "Mid"],
  Janna: ["Support"],
  "Jarvan IV": ["Jungle"],
  Jax: ["Top", "Jungle"],
  Jayce: ["Top", "Mid"],
  Jhin: ["Bottom"],
  Jinx: ["Bottom"],
  "Kai'Sa": ["Bottom"],
  Kalista: ["Bottom"],
  Karma: ["Support", "Mid"],
  Kassadin: ["Mid"],
  Katarina: ["Mid"],
  Kayle: ["Top"],
  Kayn: ["Jungle"],
  Kennen: ["Top", "Support"],
  "K'Sante": ["Top"],
  "Kha'Zix": ["Jungle"],
  LeBlanc: ["Mid"],
  "Lee Sin": ["Jungle", "Top"],
  Leona: ["Support"],
  Lillia: ["Jungle"],
  Lucian: ["Bottom", "Mid"],
  Lulu: ["Support", "Mid"],
  Lux: ["Mid", "Support"],
  Malphite: ["Top", "Jungle", "Support"],
  Malzahar: ["Mid"],
  Maokai: ["Top", "Support"],
  "Master Yi": ["Jungle"],
  "Miss Fortune": ["Bottom"],
  Mordekaiser: ["Top"],
  Seraphine: ["Support"],
  Morgana: ["Support", "Mid"],
  Milio: ["Support"],
  Naafiri: ["Jungle", "Mid"],
  Nami: ["Support"],
  Nasus: ["Top"],
  Nautilus: ["Support", "Jungle"],
  Neeko: ["Mid", "Support"],
  Nidalee: ["Jungle", "Mid"],
  Nilah: ["Bottom"],
  Nocturne: ["Jungle"],
  "Nunu & Willump": ["Jungle"],
  Mel: ["Support", "Mid"],
  Olaf: ["Jungle"],
  Orianna: ["Mid"],
  Ornn: ["Top"],
  Pantheon: ["Top", "Middle", "Jungle", "Support"],
  Poppy: ["Top", "Jungle", "Support"],
  Pyke: ["Support"],
  Qiyana: ["Mid", "Jungle"],
  Quinn: ["Top", "Mid"],
  Rakan: ["Support"],
  Samira: ["Bottom"],
  Rammus: ["Jungle", "Support"],
  "Rek'Sai": ["Jungle"],
  "Renata Glasc": ["Support"],
  Rengar: ["Jungle"],
  Renekton: ["Top"],
  Riven: ["Top"],
  Rumble: ["Top", "Mid"],
  Ryze: ["Mid", "Top"],
  Senna: ["Support", "Bottom"],
  Sett: ["Top", "Jungle"],
  Shaco: ["Jungle"],
  Shen: ["Top", "Support"],
  Shyvana: ["Jungle"],
  Singed: ["Top"],
  Sion: ["Top", "Jungle"],
  Sivir: ["Bottom"],
  Skarner: ["Jungle"],
  Smolder: ["Bottom", "Mid"],
  Sona: ["Support"],
  Soraka: ["Support"],
  Swain: ["Mid", "Support"],
  Sylas: ["Mid", "Jungle"],
  Syndra: ["Mid"],
  "Tahm Kench": ["Top", "Support"],
  Talon: ["Mid", "Jungle"],
  Taric: ["Support"],
  Teemo: ["Top"],
  Thresh: ["Support"],
  Tristana: ["Bottom", "Mid"],
  Tryndamere: ["Top", "Jungle"],
  "Twisted Fate": ["Mid"],
  Twitch: ["Bottom", "Mid"],
  Udyr: ["Jungle", "Top"],
  Urgot: ["Top"],
  Varus: ["Bottom"],
  Vayne: ["Bottom", "Top"],
  Veigar: ["Mid"],
  Viego: ["Jungle", "Mid", "Top"],
  Rell: ["Support"],

  "Vel'Koz": ["Mid", "Support"],
  Vi: ["Jungle", "Top"],
  Vex: ["Mid"],
  Viktor: ["Mid"],
  Vladimir: ["Mid", "Top"],
  Volibear: ["Top", "Jungle"],
  Warwick: ["Jungle", "Top"],
  Wukong: ["Top", "Jungle"],
  Xerath: ["Mid", "Support"],
  "Xin Zhao": ["Jungle", "Top"],
  Yasuo: ["Mid", "Top"],
  Yone: ["Mid", "Top"],
  Yunara: ["Bottom"],
  Yorick: ["Top"],
  Yuumi: ["Support"],
  Zac: ["Jungle", "Top"],
  Zed: ["Mid", "Jungle"],
  Zeri: ["Bottom"],
  Ziggs: ["Mid", "Bottom"],
  Zilean: ["Support"],
  Zoe: ["Mid", "Support"],
  Zyra: ["Support", "Jungle"],
};

const API_URL =
  "https://ddragon.leagueoflegends.com/cdn/15.16.1/data/en_US/champion.json";
const IMG_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/15.16.1/img/champion/";

export default function Home() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [progress, setProgress] = useState<Record<string, ChampionProgress>>(
    {}
  );
  const [activeChampion, setActiveChampion] = useState<Champion | null>(null);

  const allTags = ["All", "Top", "Jungle", "Mid", "Bottom", "Support"];

  useEffect(() => {
    const fetchChampions = async () => {
      const res = await fetch(API_URL);
      const data = await res.json();
      const champsArray = Object.values(data.data) as Champion[];
      setChampions(champsArray);
    };
    fetchChampions();
  }, []);

  useEffect(() => {
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
    localStorage.setItem("lol-champion-progress", JSON.stringify(progress));
  }, [progress]);

  function handleSaveProgress(fun: number, games: number, notes: string) {
    if (!activeChampion) return;
    setProgress((prev) => ({
      ...prev,
      [activeChampion.id]: { fun, games, notes },
    }));
    setActiveChampion(null);
  }

  const filteredChampions =
    selectedTag === "All"
      ? champions
      : champions.filter(
          (champ) => laneRoleMap[champ.name]?.includes(selectedTag) // you can plug back your map here
        );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        League of Legends A-Z Challenge
      </h1>

      {/* Progress Counter */}
      <div className="mb-4 text-lg font-semibold">
        {Object.values(progress).filter((x) => x.games > 0).length} /{" "}
        {champions.length} champions completed (
        {(
          (Object.values(progress).filter((x) => x.games > 0).length /
            champions.length) *
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
        />
      )}
    </div>
  );
}

function Modal({
  champion,
  onClose,
  onSave,
  existing,
}: {
  champion: Champion;
  onClose: () => void;
  onSave: (fun: number, games: number, notes: string) => void;
  existing?: ChampionProgress;
}) {
  const [fun, setFun] = useState(existing?.fun ?? 5);
  const [games, setGames] = useState(existing?.games ?? 1);
  const [notes, setNotes] = useState(existing?.notes ?? "");

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
        {/* Fun Rating */}
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

        {/* Games Counter */}
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

        {/* Notes */}
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

