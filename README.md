# Guess What - Read me

Screens
-------
- Login / Register
- Main Menu
  New Game
  Challenges
  Saved Stories
  Settings (accessibility)
- Friends (Search/Add/Remove friend, friends list, send message(?))
- New Game Page
  Instructions modal for players that never played
  Display friends list and choose who to challenge
  Story with marked words for replacement
  Colored words link to camera
  After taking the picture - the word changes it's color
  After taking ALL photos - display "Done" button
- Challenge Game Page
  Display photo and instructions (noun / verb / number of words)
  After submitting a guess display next photo
  After all guesses are submitted - Display story with the guesses
  Update points and send results to the challenging player
  "Quit" button - returns to main menu
- Saved Stories
   list of saved stories, points and dates
   upon click - dynamiclly route to story display page
   - Story display page
      Story with filled out words
      Back / Forward buttons (Next story, previous story)

## DB
Stories
-------
id: string
story: (String)
magicWords: Object[{word: string, isHandled: boolean}]
acceptableAnswers: [
   [
   {Word: string, Points: number}
   ],[
   {Word: string, Points: number}
   ],[
   {Word: string, Points: number}
   ],[
   {Word: string, Points: number}
   ]
];

Players
-------
id: string
username: string
hashedPassword: string
points: number
friends: objectId[] (other players ids)
savedGames: {
   id: number (serial)
   storyId: (objectId)
   answers: string[]
   points: number
   date: dateTime
}