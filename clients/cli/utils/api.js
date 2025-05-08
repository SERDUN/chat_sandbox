import http from './http.js';


const SERVER_URL = 'https://audio-content-type-test.fly.dev'

// Endpoint for registration
const registerEndpoint = () => `${SERVER_URL}/register`;
const registerEndpointBody = (name) => JSON.stringify({ name: name });

// Endpoint for sending messages
const sendEndpoint = () => `${SERVER_URL}/send`;
const sendEndpointBody = (userId, text) => JSON.stringify({ userId: userId, text: text });

// Endpoint for fetching messages
const messagesEndpoint = (userId, since) => `${SERVER_URL}/messages?userId=${userId}&since=${since}`;
const eventsEndpoint = (userId, since) => `${SERVER_URL}/events?userId=${userId}&since=${since}`;

// Endpoint for fetching user profile   
const profileEndpoint = (userId) => `${SERVER_URL}/users/${userId}`;
const profilesEndpoint = () => `${SERVER_URL}/users`;

async function register(username) {
    const response = await http.post(registerEndpoint(), registerEndpointBody(username))
    const data = await response.json()
    return data.userId;
}

async function sendMessage(userId, text) {
    const response = await http.post(sendEndpoint(), sendEndpointBody(userId, text))
    const data = await response.json()
}

async function getMessages(userId, since) {
    const response = await http.get(messagesEndpoint(userId, since))
    const data = await response.json()
    return data;
}

async function getEvents(userId, since) {
    const response = await http.get(eventsEndpoint(userId, since))
    const data = await response.json()
    return data;
}

async function getUserProfile(userId) {
    const response = await http.get(profileEndpoint(userId))
    const data = await response.json()
    return data;
}

async function getUsersProfiles() {
    const response = await http.get(profilesEndpoint())
    const data = await response.json()
    return data;
}

export default {
    register,
    sendMessage,
    getMessages,
    getEvents,
    getUserProfile,
    getUsersProfiles,
};