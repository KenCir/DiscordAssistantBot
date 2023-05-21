/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises */
import { config } from 'dotenv';
config();
import { readdirSync } from 'fs';
import { join } from 'path';
import AssistantBot from './AssistantBot';
import { Command } from './interfaces/Command';
const client = new AssistantBot();

readdirSync(join(__dirname, '/events/process/'))
  .forEach(async file => {
    const event = await import(join(__dirname, `/events/process/${file}`));
    const eventName = file.split('.')[0];
    process.on(eventName, event.default.bind(null, client));
    client.logger.info(`Process ${eventName} event is Loading`);
  });

readdirSync(join(__dirname, '/events/discord/'))
  .forEach(async file => {
    const event = await import(join(__dirname, `/events/discord/${file}`));
    const eventName = file.split('.')[0];
    client.on(eventName, event.default.bind(null, client));
    client.logger.info(`Discord ${eventName} event is Loading`);
  });

const commandFolders = readdirSync(join(__dirname, '/commands'));
for (const folder of commandFolders) {
  readdirSync(join(__dirname, '/commands/', folder))
    .forEach(async file => {
      const command = await import(join(__dirname, '/commands/', folder, file));
      const cmd: Command = new command.default();
      client.commands.set(cmd.name, cmd);
      client.logger.info(`${cmd.name} command is Loading`);
    });
}

void client.login()
  .catch(() => process.exit(-1));
