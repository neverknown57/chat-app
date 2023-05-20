const users = [];

const add_user = ({ id, username, room }) => {
    // const id = obj.id || 0;
    // const username = obj.username;
    // const room = obj.room;
    username = username.trim().toLowerCase();
    room = room.trim();
    if (!username || !room)
        return { error: 'username or room not exist' };
    const userexist = users.find((user) => {
        return user.username === username && user.room === room;
    })
    if (userexist)
        return { error: 'user already exists' };

    users.push({ id, username, room })
    return { id, username, room };
}

// remove user
const remove_user = function (id) {
    const index = users.findIndex(user => user.id === id)
    if (!index) return { error: 'user does not exist' };

    return users.splice(index, 1)[0];

}

// getuser
const get_user = function (id) {
    const index = users.findIndex(user => user.id == id);
    // users.forEach((user) => {
    //     console.log('forEach\n', user)
    // })
    // console.log(index, users.at(index));
    // if (index != -1) 
    return users[index];

}

// get_usersInRoom
function get_usersInRoom(room) {
    return users.filter(user => user.room === room);
}
// console.log(get_user(2))
// console.log(get_usersInRoom(1))
// console.log(add_user({ id: 1, username: 'user', room: 'room' }))
module.exports = {
    add_user,
    remove_user,
    get_user,
    get_usersInRoom
}