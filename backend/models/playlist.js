const axios = require('axios');


class Playlist {
    constructor() {
        this.super();
    }

    /**
     * @param book is the selected book
     * @param token is access token for Spotify API 
     * @param instrumental is the level of instrumentalness desired for the recommendations
     * @returns a list of the 5 top playlists using the provided search term
     */
    static async search(book, token, instrumental) {
        const words = book.title.split(" ");
        let title = ""
        words.length > 4 ? (title = words.slice(0, 4).join(" ")) : (title = book.title)
        //use first 4 words of the title

        const url = `https://api.spotify.com/v1/search?q=${title}&type=playlist&limit=3`
        const titleResponse = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

        const genreArray = book.category.split(" / ")
        let genre = ""
        genreArray[genreArray.length-1]==="General" ? (genre = genreArray[genreArray.length-2]) : (genre = genreArray[genreArray.length-1])
        genre = genre.replace("& ", "")
        //get significant phrase from genre

        const genreUrl = `https://api.spotify.com/v1/search?q=${genre}&type=playlist&limit=3`
        const genreResponse = await axios.get(genreUrl, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        let titleSongs = await this.getSongs(titleResponse.data.playlists.items, token)
        let genreSongs = await this.getSongs(genreResponse.data.playlists.items, token)
        let songs = titleSongs.concat(genreSongs)
        return await this.getRec(songs, token, instrumental)
    }

    /**
     * 
     * @param playlistList is a list of 3 playlists from the function above
     * @param token is access token for Spotify API 
     * @returns 3 random songs from the given playlists
     */
    static async getSongs(playlistList, token) {
        const urls = playlistList.map(e => {
            return e.tracks.href
        })
        let songs = []
        for (let i = 0; i < urls.length; i++) {
            songs = songs.concat(await this.getSongsHelper(urls[i], token))
        }
        //choose 3 random indices: 
        let arr= []
        for (let i =0; i < 3; i++) {
            let index = (Math.random() * (songs.length-1)).toFixed(0)
            while (arr.includes(index)){
                index = (Math.random() * (songs.length-1)).toFixed(0)
            }
            arr.push(index)
        }
        let seedSongs = []
        arr.forEach(i => {
            seedSongs.push(songs[i])
        })
        return seedSongs
    }
    static async getSongsHelper(url, token) {
        const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        return response.data.items.slice(0, 8)
    }

    /**
     * 
     * @param {array} seedSongs 
     * @param {string} token 
     * @param {number} instrumental (use only if user inputted actual instrumental value)
     * @returns recommendations based on seedSongs array
     */
    static async getRec(seedSongs, token, instrumental) {
        let str = seedSongs[0].track.id
        for (let i=1; i < seedSongs.length-1; i++) {
            str.concat(`,${seedSongs[i].track.id}`)

        }
        let url = ""
        if (instrumental===null) {
            url = `https://api.spotify.com/v1/recommendations?min_popularity=30&limit=12&seed_tracks=${str}`
        }
        else {
            url = `https://api.spotify.com/v1/recommendations?min_popularity=30&limit=12&seed_tracks=${str}&target_instrumentalness=${instrumental}`
        }

        const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return response.data

    }

}

module.exports = Playlist