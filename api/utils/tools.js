const mediaTools = {
    isVideo: (url) => {
        return url.match(/video/i)
    },
    isImage: (url) => {
        return url.match(/(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/g)
    }
}

module.exports = { mediaTools }