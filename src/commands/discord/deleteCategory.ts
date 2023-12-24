import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CacheType,
    CategoryChannel,
    ChannelType,
    ChatInputCommandInteraction,
    ComponentType,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/Command';
import AssistantBot from '../../AssistantBot';

export default class DeleteCategoryCommand extends Command {
    constructor() {
        super(
            'delete_category',
            'カテゴリーとカテゴリー内のチャンネルを削除します',
            'utils',
            '/delete',
            false,
            true,
            new SlashCommandBuilder()
                .setName('delete_category')
                .setDescription('カテゴリーとカテゴリー内のチャンネルを削除します')
                .addChannelOption((option) =>
                    option
                        .setName('category')
                        .setDescription('削除するカテゴリー')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildCategory)
                )
        );
    }

    async execute(client: AssistantBot, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const category = interaction.options.getChannel('category') as CategoryChannel;
        const msg: Message = await interaction.followUp({
            content: `カテゴリー\`${category.name}\`とカテゴリー内のチャンネルを削除しますか？`,
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder().setCustomId('ok').setEmoji('881574101041442887').setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setEmoji('881574101444083742')
                        .setStyle(ButtonStyle.Danger),
                ]),
            ],
        });

        const filter = (i: MessageComponentInteraction) =>
            (i.customId === 'ok' || i.customId === 'cancel') && i.user.id === interaction.user.id;
        const response = await msg.awaitMessageComponent({
            time: 60000,
            componentType: ComponentType.Button,
            filter: filter,
        });
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

        for (const channel of category.children.cache.values()) {
            await channel.delete();
        }

        await category.delete();
        await response.editReply({
            content: '削除しました',
            embeds: [],
            components: [],
        });
    }
}
