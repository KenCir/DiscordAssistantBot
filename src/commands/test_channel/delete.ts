import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, Message, MessageComponentInteraction, SlashCommandBuilder, StageChannel, TextChannel, VoiceChannel } from 'discord.js';
import { Command } from '../../interfaces/Command';
import AssistantBot from '../../AssistantBot';

export default class DeleteCommand extends Command {
  constructor() {
    super(
      'delete',
      'テストチャンネルを削除します',
      'test_channel',
      '/delete',
      false,
      true,
      (new SlashCommandBuilder()
        .setName('delete')
        .setDescription('テストチャンネルを削除します')),
    );
  }

  async execute(client: AssistantBot, interaction: CommandInteraction<CacheType>): Promise<void> {
    if (client.disableTestChannels.includes(interaction.channelId) || ![client.testTextChannelCategory, client.testVoiceChannelCategory, client.testStageChannelCategory].includes((interaction.channel as TextChannel | VoiceChannel | StageChannel).parentId ?? '')) {
      await interaction.followUp('ERROR: このチャンネルは削除できません');
      return;
    }

    const msg: Message = await interaction.followUp({
      content: 'テストチャンネルを削除しますか？',
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId('ok')
              .setEmoji('881574101041442887')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('cancel')
              .setEmoji('881574101444083742')
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });

    const filter = (i: MessageComponentInteraction) => (i.customId === 'ok' || i.customId === 'cancel') && i.user.id === interaction.user.id;
    const response = await msg.awaitMessageComponent({ time: 60000, componentType: ComponentType.Button, filter: filter });
    if (response.customId === 'no') {
      await response.update({
        content: 'キャンセルしました',
        embeds: [],
        components: [],
      });
      return;
    }

    await response.update({
      content: '削除しています...',
      embeds: [],
      components: [],
    });
    await interaction.channel?.delete();
  }
}
