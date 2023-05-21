/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';
config();

void (async () => {
  const rest: REST = new REST().setToken(process.env.DISCORD_TOKEN as string);
  try {
    console.log('Started deleted all guild commands.');

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string), { body: [] });

    console.log('Successfully deleted all guild commands.');
  }
  catch (error) {
    console.error(error);
  }
})();
