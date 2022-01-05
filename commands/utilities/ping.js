module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: 'none',
    category: 'Utilities',
    permission: 0,
    execute(message, args){
        message.channel.send('Pong! ' + (args[0] || ''));
    }
}