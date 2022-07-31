const axios = require('axios');


class Playlist {
    constructor() {
        this.super();
    }

    /**
     * @param term is the search term 
     * @param token is access token for Spotify API 
     * @returns a list of the 5 top playlists using the provided search term
     */
    static async search(term, token) {
        let words = term.split(" ")
        if (words.length>4) {
            term = words.slice(0, 4).join(" ")
        }
        const url = `https://api.spotify.com/v1/search?q=${term}&type=playlist`
        const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          let songs = await this.getSongs(response.data.playlists.items, token)
          return await this.getRec(songs, token)
    }

    /**
     * 
     * @param playlistList is a list of 5 playlists from the function above
     * @param token is access token for Spotify API 
     * @returns 5 random songs from the given playlists
     */
    static async getSongs(playlistList, token) {
        const urls = playlistList.map(e => {
            return e.tracks.href
        })

        let songs = await this.getSongsHelper(urls[0], token)
        songs = songs.concat(await this.getSongsHelper(urls[1], token))
        songs = songs.concat(await this.getSongsHelper(urls[2], token))
        //choose 5 random indices: 
        let arr= []
        for (let i =0; i < 5; i++) {
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

    //from 5 songs, get recommendations
    static async getRec(seedSongs, token) {
        let str = seedSongs[0].track.id
        for (let i=1; i < seedSongs.length-1; i++) {
            str.concat(`,${seedSongs[i].track.id}`)

        }

        const response = await axios.get(`https://api.spotify.com/v1/recommendations?min_popularity=50&limit=12&seed_tracks=${str}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return response.data

    }

}

module.exports = Playlist