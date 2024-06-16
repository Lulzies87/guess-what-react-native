step 1
enter the following query into an ai generator:

Write me a short story that contains 4 sentences. Then, select one keyword from each sentence and rewrite the story without those keywords, replacing them with $+number ($0 for the first word replacement, $1 for the second etc...). Additionally, provide the list of keywords in a JavaScript array format and call that array keywords. Finally, create a JavaScript array named acceptableGuesses that consists of nested arrays. Each nested array should contain objects with a word string and a points number, where the keywords and their synonyms are worth 100 points, and closely related words are worth 50 points.

// this query needs improvment and it might be a good idea to first copy the wanted result from the stories.ts file just for refrence

step 2
enter the following example as a wanted resault:

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
}