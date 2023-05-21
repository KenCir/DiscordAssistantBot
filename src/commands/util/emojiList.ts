import { CacheType, CommandInteraction, SlashCommandBuilder, formatEmoji } from 'discord.js';
import { Command } from '../../interfaces/Command';
import AssistantBot from '../../AssistantBot';

export default class EmojiListCommand extends Command {
  constructor() {
    super(
      'emojilist',
      '絵文字リストを表示します',
      'util',
      '/emojiList',
      false,
      true,
      (new SlashCommandBuilder()
        .setName('emojilist')
        .setDescription('絵文字リストを表示します')),
    );
  }

  async execute(client: AssistantBot, interaction: CommandInteraction<CacheType>): Promise<void> {
    await interaction.guild?.emojis.fetch();
    interaction.guild?.emojis.cache.map(async e => await interaction.channel?.send(`${formatEmoji(e.id, e.animated ?? false)} \`${e.name ?? ''}\`  \`${e.id}\``));
    await interaction.followUp('絵文字リストを表示しました');
  }
}
