import api from './utils/api.js';
import io from './utils/io.js';
import store from './utils/store.js';

async function launch(name) {
    await register(name);
    await getMessages();
    io.prompt("Я: ");
    setInterval(() => getMessages(), 1000);

}

async function register(name) {
    const userId = await api.register(name);
    const user = await api.getUsersProfiles();

    store.setUserId(userId);
    store.setChatUsers(user.users);
}

async function getMessages() {
    const userId = store.getUserId();
    const lastTimestamp = store.getLastMessageTime();

    const user = await api.getUsersProfiles();

    store.setChatUsers(user.users);

    const [messagesResponse, eventsResponse] = await Promise.all([
        api.getMessages(userId, lastTimestamp),
        api.getEvents(userId, lastTimestamp),
    ]);

    const mapMessageLikeData = (items, type) =>
        items.map(item => ({
            userId: item.userId,
            text: item.text,
            type,
            eventType: item.type, // for events only
            timestamp: item.timestamp,
        }));

    const history = [
        ...mapMessageLikeData(messagesResponse.messages, 'message'),
        ...mapMessageLikeData(eventsResponse.events, 'event'),
    ].sort((a, b) => a.timestamp - b.timestamp);

    let lastShownTimestamp = lastTimestamp;
    let hasNewMessages = false;

    for (const entry of history) {
        const isCurrentUser = entry.userId === userId;
        const displayName = store.getUserById(entry.userId)?.name;

        if (isCurrentUser) continue;

        if (entry.type === 'event') {
            switch (entry.eventType) {
                case 'registered':
                    io.print(`👤 ${displayName} joined the chat`, '\x1b[34m');
                    break;
                case 'left':
                    io.print(`👤 ${displayName} left the chat`, '\x1b[31m');
                    break;
                default:
                    io.print(`🔔 ${displayName}: ${entry.text}`, '\x1b[32m');
                    break;
            }
        } else {
            io.print(`💬 ${displayName}: ${entry.text}`, '\x1b[37m');
            hasNewMessages = true;
        }

        lastShownTimestamp = Math.max(lastShownTimestamp, entry.timestamp);
    }

    store.setLastMessageTime(lastShownTimestamp);
}

async function sendMessage(text) {
    await api.sendMessage(store.getUserId(), text);
    io.prompt("Я: ");
}

export default {
    launch,
    sendMessage,
};