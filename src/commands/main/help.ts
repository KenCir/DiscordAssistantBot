import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandStringOption, EmbedBuilder, codeBlock, ComponentType, Message, MessageComponentInteraction } from 'discord.js';
import { Command } from '../../interfaces/Command';
import AssistantBot from '../../AssistantBot';

export default class HelpCommand extends Command {
  constructor() {
    super(
      'help',
      'ヘルプを表示します',
      'main',
      '/help <command>',
      false,
      true,
      (new SlashCommandBuilder()
        .setName('help')
        .setDescription('ヘルプを表示します')
        .addStringOption(option => {
          return option
            .setName('command')
            .setDescription('コマンド名')
            .setRequired(false);
        }) as SlashCommandBuilder & SlashCommandStringOption),
    );
  }

  async execute(client: AssistantBot, interaction: CommandInteraction<CacheType>): Promise<void> {
    const commandName = (interaction.options as CommandInteractionOptionResolver).getString('commandName');
    if (!commandName) {
      const embeds: Array<EmbedBuilder> = [];
      embeds.push(
        new EmbedBuilder()
          .setTitle(`${client.user?.tag as string} HELP`)
          .setDescription('Ken_CirのアシスタントBotです\n\n開発者: 幻想地帝国システム課')
          .addFields([
            { name: 'メインコマンド', value: client.commands.filter(x => x.category == 'main').map((x) => '`' + x.name + '`').join(', ') },
            { name: 'テストチャンネル用コマンド', value: client.commands.filter(x => x.category == 'test_channel').map((x) => '`' + x.name + '`').join(', ') },
            { name: 'ユーティリティコマンド', value: client.commands.filter(x => x.category == 'util').map((x) => '`' + x.name + '`').join(', ') },
          ]),

        new EmbedBuilder()
          .setTitle('メインコマンド')
          .setDescription(codeBlock(client.commands.filter(x => x.category == 'main').map((x) => `/${x.name}: ${x.description}`).join('\n'))),

        new EmbedBuilder()
          .setTitle('テストチャンネル用コマンド')
          .setDescription(codeBlock(client.commands.filter(x => x.category == 'test_channel').map((x) => `/${x.name}: ${x.description}`).join('\n'))),

        new EmbedBuilder()
          .setTitle('ユーティリティコマンド')
          .setDescription(codeBlock(client.commands.filter(x => x.category == 'util').map((x) => `/${x.name}: ${x.description}`).join('\n'))),
      );


      let select = 0;
      const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          [
            new ButtonBuilder()
              .setCustomId('left')
              .setLabel('◀️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(),
            new ButtonBuilder()
              .setCustomId('right')
              .setLabel('▶️')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('stop')
              .setLabel('⏹️')
              .setStyle(ButtonStyle.Primary),
          ],
        );

      const msg: Message = await interaction.followUp(
        {
          embeds: [embeds[0]],
          components: [buttons],
        },
      );

      const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button });
      collector.on('collect', async i => {
        if (i.customId === 'left') {
          select--;
          buttons.components[1].setDisabled(false);
          if (select < 1) {
            buttons.components[0].setDisabled();
          }
          await i.update(
            {
              embeds: [embeds[select]],
              components: [buttons],
            },
          );
        }
        else if (i.customId === 'right') {
          select++;
          buttons.components[0].setDisabled(false);
          if (select >= embeds.length - 1) {
            buttons.components[1].setDisabled();
          }
          await i.update(
            {
              embeds: [embeds[select]],
              components: [buttons],
            },
          );
        }
        else if (i.customId === 'stop') {
          await i.update(
            {
              embeds: [embeds[select]],
              components: [],
            },
          );
          collector.stop();
        }
      });
    }
    else {
      const command = client.commands.get(commandName);
      if (!command) {
        await interaction.followUp(`コマンド名: ${commandName}は存在しません`);
        return;
      }
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle(`コマンド名: ${command.name}の詳細`)
            .addFields([
              { name: 'コマンド名', value: command.name },
              { name: '説明', value: command.description },
              { name: '使用法', value: codeBlock(`/${command.usage}`) },
              { name: 'コマンドカテゴリ', value: command.category },
              { name: 'BotOwner専用コマンド', value: command.ownerOnly ? 'はい' : 'いいえ' },
            ])
            .setFooter({ text: '[]は必須, <>は任意' }),
        ],
      });
    }
  }
}
