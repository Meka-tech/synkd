This is a personal project [Synkd](https://synkd.netlify.app/) , a web app to chat with people of similar interests in music , movies, etc around you.

Stacks - Typescript ,Javascript, Next js, node js,Mongo DB.

Features

\*Music
Using @Spotify developers API you can
-login and all the artists you follow would be recorded
Or
-Search Manually for artists
Or
-Choose artists from genres

\*Matching
Users are matched using the Jaccard similarity algorithm.A list of users a user matches with comes up in descending order of the percentage at which they matched with. There will be other categories and there are preferences such as proximity or worldwide.

\*Real time communication using [Socket.io](Socket.io)
There's instant transmission of data using sockets. Data such as when a user sends a message, a user receives a message, a user is typing ,a user receives a notification and when a user updates their profile

\*Dexie database
Using Dexie for local storage for storin data such as messages ‚un sent messages , user data and user friends data.

\*Redux for state management and caching temporary data

\*Context Api for socket management

\*Requests and notifications
Notifications are sent in real time when a user sends a request to another. A request can be sent , unsent, accepted or rejected.

\*Update profile
Usernames, bios, Avatars and also interest categories can be updated and the changes would be reflected in real-time across all devices using sockets
