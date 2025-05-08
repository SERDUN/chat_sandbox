let userId;
let lastMessageId = 0;
let lastMessageTime = 0;

let chatUsers = [];

function setChatUsers(users) {
    chatUsers = users;
}

function getChatUsers() {
    return chatUsers;
}

function getUserById(userId) {
    return chatUsers.find(user => user.userId === userId);
}

function addUser(user) {
    chatUsers.push(user);
}

function removeUser(id) {
    chatUsers = chatUsers.filter(user => user.userId !== id);
}

function containsUser(id) {
    return chatUsers.some(user => user.userId === id);
}

function setUserId(id) {
    userId = id;
}
function getUserId() {
    return userId;
}
function setLastMessageId(id) {
    lastMessageId = id;
}
function getLastMessageId() {
    return lastMessageId;
}
function setLastMessageTime(time) {
    lastMessageTime = time;
}
function getLastMessageTime() {
    return lastMessageTime;
}
function reset() {
    userId = undefined;
    lastMessageId = 0;
    lastMessageTime = 0;
}

export default {
    setUserId,
    getUserId,
    setLastMessageId,
    getLastMessageId,
    setLastMessageTime,
    getLastMessageTime,
    reset,
    setChatUsers,
    getChatUsers,
    getUserById,
    setChatUsers,
    getChatUsers,
    getUserById,
    addUser,
    removeUser,
    containsUser,
};