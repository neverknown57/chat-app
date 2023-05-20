const textMessage = (text) => {
    return { text: text, CreatedAt: new Date().getTime(), }
}
module.exports = {
    textMessage: textMessage
}