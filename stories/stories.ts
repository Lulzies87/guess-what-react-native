type AcceptableGuess = {
  word: string;
  points: number;
};

type Story = {
  plot: string;
  keywords: string[];
  acceptableGuesses: AcceptableGuess[][];
};

const stories: Story[] = [
  {
    plot: "In a quiet village nestled between the mountains, an $0 clockmaker worked tirelessly in his dimly lit shop. One evening, he discovered a tiny, magical $1 that brought his clocks to life, ticking with an ethereal glow. Word of his enchanted clocks spread, drawing $2 from distant lands to witness their beauty. The village thrived, forever transformed by the clockmaker's extraordinary $3.",
    keywords: ["old", "gear", "people", "discovery"],
    acceptableGuesses: [
      [
        { word: "old", points: 100 },
        { word: "ancient", points: 100 },
        { word: "aged", points: 100 },
        { word: "vintage", points: 50 },
        { word: "antique", points: 50 },
      ],
      [
        { word: "gear", points: 100 },
        { word: "cog", points: 100 },
        { word: "mechanism", points: 100 },
        { word: "component", points: 50 },
        { word: "part", points: 50 },
      ],
      [
        { word: "people", points: 100 },
        { word: "individuals", points: 100 },
        { word: "folks", points: 100 },
        { word: "crowd", points: 50 },
        { word: "gatherers", points: 50 },
      ],
      [
        { word: "discovery", points: 100 },
        { word: "finding", points: 100 },
        { word: "revelation", points: 100 },
        { word: "breakthrough", points: 50 },
        { word: "unveiling", points: 50 },
      ],
    ],
  },
  {
    plot: "Once upon a time, in a quaint little $0 nestled between rolling hills and lush forests, there lived a humble $1 named William. William was known throughout the $0 for his exceptional craftsmanship and his ability to forge intricate designs into his creations. One day, a mysterious traveler arrived in the $0, seeking the services of a skilled artisan to craft a special $2 for a noble $3. Hearing of William's reputation, the traveler sought him out, and soon the two were deep in discussion about the design and materials needed for the $2. As the days passed, William poured his heart and soul into crafting the $2, imbuing it with the strength and power needed for the $3 ahead. When the $2 was finally complete, the traveler marveled at its beauty and precision, knowing that with this $2 in hand, they would be unstoppable in their noble $3.",
    keywords: ["town", "blacksmith", "weapon", "quest"],
    acceptableGuesses: [
      [
        { word: "town", points: 100 },
        { word: "village", points: 50 },
        { word: "settlement", points: 50 },
        { word: "hamlet", points: 50 },
        { word: "city", points: 50 },
        { word: "community", points: 50 },
      ],
      [
        { word: "blacksmith", points: 100 },
        { word: "artisan", points: 50 },
        { word: "craftsman", points: 50 },
        { word: "metalworker", points: 50 },
        { word: "smith", points: 50 },
        { word: "forgemaster", points: 50 },
      ],
      [
        { word: "weapon", points: 100 },
        { word: "sword", points: 100 },
        { word: "blade", points: 100 },
        { word: "tool", points: 50 },
        { word: "armament", points: 50 },
        { word: "instrument", points: 50 },
      ],
      [
        { word: "quest", points: 100 },
        { word: "journey", points: 100 },
        { word: "adventure", points: 100 },
        { word: "mission", points: 50 },
        { word: "undertaking", points: 50 },
        { word: "expedition", points: 50 },
      ],
    ],
  },
  {
    plot: "In a bustling city filled with towering skyscrapers, a $0 artist struggled to find inspiration. One night, she stumbled upon a hidden $1, lush with vibrant flowers and cascading fountains. The beauty of the garden ignited her $2, leading her to create breathtaking masterpieces. The city's art scene was revolutionized, forever changed by her newfound $3.",
    keywords: ["young", "garden", "creativity", "muse"],
    acceptableGuesses: [
      [
        { word: "young", points: 100 },
        { word: "youthful", points: 100 },
        { word: "novice", points: 100 },
        { word: "new", points: 50 },
        { word: "fresh", points: 50 },
      ],
      [
        { word: "garden", points: 100 },
        { word: "park", points: 100 },
        { word: "oasis", points: 100 },
        { word: "greenery", points: 50 },
        { word: "sanctuary", points: 50 },
      ],
      [
        { word: "creativity", points: 100 },
        { word: "imagination", points: 100 },
        { word: "ingenuity", points: 100 },
        { word: "inventiveness", points: 50 },
        { word: "originality", points: 50 },
      ],
      [
        { word: "muse", points: 100 },
        { word: "inspiration", points: 100 },
        { word: "stimulus", points: 100 },
        { word: "motivation", points: 50 },
        { word: "spark", points: 50 },
      ],
    ],
  },
];
