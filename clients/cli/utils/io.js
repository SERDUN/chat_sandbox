import { EventEmitter } from 'node:events';
import readline from 'node:readline';

const emitter = new EventEmitter();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const trimmed = input.trim();
  if (trimmed) {
    emitter.emit('message', trimmed);
  }
});

function askName(question = 'Provide your name: ') {
  rl.question(question, (name) => {
    emitter.emit('name', name.trim());
    prompt();
  });
}

function prompt(label = 'Я: ') {
  rl.setPrompt(label);
  rl.prompt();
}

function print(text, color = '\x1b[37m') {
  console.log(`${color}${text}\x1b[0m`);
}

function clean() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

const io = {
  askName,
  prompt,
  print,
  clean,
  on: emitter.on.bind(emitter),
  emit: emitter.emit.bind(emitter),
};

export default io;
