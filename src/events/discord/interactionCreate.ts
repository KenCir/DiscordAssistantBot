import { Interaction, InteractionType } from 'discord.js';
import AssistantBot from '../../AssistantBot';

export default async (client: AssistantBot, interaction: Interaction) => {
  if (interaction.user.bot || !interaction.guild || interaction.type !== InteractionType.ApplicationCommand) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return await interaction.reply('ERROR: コマンドデータが見つかりませんでした');
  if (cmd.deferReply) await interaction.deferReply();

  await cmd.execute(client, interaction);
};
