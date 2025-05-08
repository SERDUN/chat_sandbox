import io from './utils/io.js';
import app from './app.js';

io.on('name', async (name) =>  app.launch(name));
io.on('message', async (text) =>  app.sendMessage(text));

io.askName();
