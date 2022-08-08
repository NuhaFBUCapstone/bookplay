const axios = require('axios');


class createPlaylist {
    constructor() {
        this.super();
    }

    static async createPlaylist(songs, title, token) {
        let userId = await this.getId(token)
        const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            "name": title
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let playlistId = response.data.id
        console.log(response.data)
        await this.addSongs(playlistId, token, songs)
    }

    static async getId(token) {
        const response = await axios.get(`https://api.spotify.com/v1/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.id
    }


    static async addSongs(playlistId, token, songs) {
        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            "uris": songs
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } 
}

module.exports = createPlaylist