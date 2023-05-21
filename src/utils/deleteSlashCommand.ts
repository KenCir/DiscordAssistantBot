/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';
config();

void (async () => {
  const rest: REST = new REST().setToken(process.env.DISCORD_TOKEN as string);
  try {
    console.log('Started deleted all application commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: [] });

    console.log('Successfully deleted all application commands.');
  }
  catch (error) {
    console.error(error);
  }
})();
