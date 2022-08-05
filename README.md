
# Overview
**Project Description**
This website is a book cataloging app that allows users to search for books, organize their books into lists, create reviews and ratings, and see what their friends are reading. The website also creates individualized book recommendations based on a user’s positively-reviewed books and global ratings. I also incorporated the Spotify API to generate song recommendations based on any given book, using a combination of title and genre information.

**Features:**

Book Recommendations
 - Popularity mapping algorithm using the user’s most recent positive review
 - Incorporates global ratings 

Spotify Playlist Generation
- Use title and genre to find 5 random songs and generate recommendations based off that
- Additional option to create a playlist out of the suggested songs and save to the user’s Spotify account

Ratings and Reviews
- Global ratings that are updated every time a user posts a rating
- Reviews displayed to all viewers, can post reviews once you log in
- Part of the Book Detail page

Libraries (User-specific)
- Add/remove books to lists
- Create/delete new lists

User authentication
- Login
- Create new account, requires password confirmation

Home/Friends
- View your recent activity
- Option to send, receive, and accept friend requests
- View what friends are currently reading
- Live chat within Home page to talk to friends

Book Detail Page

- Use Google API to get images, synopsis, link to buy book, etc
- Cache saved books in Parse database for quicker performance

**Required Features**
- Your app has multiple views
	- logged in/logged out views
	- Home, Landing Page, Search, My Library, Playlist Gen
- Your app interacts with a database
	- Parse database used for storing user data
- You can log in/log out of your app as a user
	- Login/Logout option for website and Spotify
- Your app integrates with at least one SDK
	- Google Books API, OpenLibrary API, Spotify API
- Your app has an interesting cursor interaction 
	- When hovering over books in your library, a delete button pops up for each book
- Your app demonstrates at least one component with complex visual styling 
	- Parallax screen, Book Detail page
- Your app uses a loading state to create visual polish
	- Playlist Generation Loading state, multiple loading states used throughout the website
- Your app provides opportunities for you to overcome difficult/ambiguous technical problems
	- Spotify book to song generation 
	- Popularity-based book recommendations
	- Live chatting with friends (Parse live queries)

**Technically Complex Components:**
 - Recommendations
 	- based off the user's most recent positively reviewed book and compared to people who have also read that book to get recommendations.
 - Friends' Books
 	- allow users to view what their friends are reading and chat with them.
 - Spotify playlist generation
 	- use multiple spotify API endpoints to create a song recommendation algorithm.
