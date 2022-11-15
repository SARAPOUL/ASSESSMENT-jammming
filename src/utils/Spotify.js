const client_id = 'a6e27d20a21a4785bdfe16d428d6eb41'
const redirect_uri = 'http://localhost:3000/'
// const redirect_uri = 'https://assessment-jammming.vercel.app'

let accessToken
// let expires_in = undefined
const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken
        }
        //check for access
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
            window.location = accessUrl
        }
    },

    async search(searchTerm) {
        const replaceEmptySpace = searchTerm.replace(' ', '%20')
        const url = `https://api.spotify.com/v1/search?q=${replaceEmptySpace}&type=track`
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (jsonResponse.tracks.items) {
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });
        }
    },
    async createPlaylist(name, trackIds) {
        if (Array.isArray(trackIds) && trackIds.length) {
            const createPlaylistUrl = `https://api.spotify.com/v1/me/playlists`
            const response = await fetch(createPlaylistUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    name: name,
                    public: true
                })
            });
            const jsonResponse = await response.json();
            const playlistId = jsonResponse.id;
            if (playlistId) {
                const replacePlaylistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
                await fetch(replacePlaylistTracksUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ uris: trackIds.map(id => "spotify:track:".concat(id)) })
                });
            }
        }
    }
}

export default Spotify
// const search = async (searchTerm, token) => {
//     const url = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`
//     const response = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     const jsonResponse = await response.json();
//     if (jsonResponse.tracks.items) {
//         return jsonResponse.tracks.items.map(track => {
//             return {
//                 id: track.id,
//                 title: track.name,
//                 artist: track.artists[0].name,
//                 album: track.album.name
//             };
//         });
//     }
// }

// const createPlaylist = async (name, trackIds, token) => {
//     if (Array.isArray(trackIds) && trackIds.length) {
//         const createPlaylistUrl = `https://api.spotify.com/v1/me/playlists`
//         const response = await fetch(createPlaylistUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 name: name,
//                 public: true
//             })
//         });
//         const jsonResponse = await response.json();
//         const playlistId = jsonResponse.id;
//         if (playlistId) {
//             const replacePlaylistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
//             await fetch(replacePlaylistTracksUrl, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ uris: trackIds.map(id => "spotify:track:".concat(id)) })
//             });
//         }
//     }
// }

// export { search, createPlaylist }