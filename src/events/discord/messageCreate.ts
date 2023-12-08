import { ChannelType, Message, StageChannel, TextChannel, VoiceChannel, channelMention, userMention } from 'discord.js';
import AssistantBot from '../../AssistantBot';

export default async (client: AssistantBot, message: Message) => {
    if (message.author.bot || message.system || !message.guild) return;

    const twitterRegex = /https?:\/\/(x|twitter)\.com/g;
    if (twitterRegex.test(message.content)) {
        await message.reply(
            `${message.content.replace(twitterRegex, 'https://twitter.com')}\n${message.content.replace(
                twitterRegex,
                'https://fxtwitter.com'
            )}`
        );
    }

    // Text
    if (message.channelId === client.createTextTestChannel) {
        if (!message.content) return;
        const channel = await message.guild.channels.create({
            name: message.content,
            parent: client.testTextChannelCategory,
            topic: `${new Date().toLocaleString()}に作成されたテストチャンネル\n作成者: ${message.author.tag}`,
            reason: `${message.author.tag}によって作成されたテストチャンネル`,
        });

        await message.reply(`テストチャンネルを作成しました: ${channelMention(channel.id)}`);
    }
    // Voice
    else if (message.channelId === client.createVoiceTestChannel) {
        if (!message.content) return;
        const channel = await message.guild.channels.create({
            name: message.content,
            parent: client.testVoiceChannelCategory,
            type: ChannelType.GuildVoice,
            topic: `${new Date().toLocaleString()}に作成されたテストチャンネル\n作成者: ${message.author.tag}`,
            reason: `${message.author.tag}によって作成されたテストチャンネル`,
        });

        await message.reply(`テストチャンネルを作成しました: ${channelMention(channel.id)}`);
    }
    // Stage
    else if (message.channelId === client.createStageTestChannel) {
        if (!message.content) return;
        const channel = await message.guild.channels.create({
            name: message.content,
            parent: client.testStageChannelCategory,
            type: ChannelType.GuildStageVoice,
            topic: `${new Date().toLocaleString()}に作成されたテストチャンネル\n作成者: ${message.author.tag}`,
            reason: `${message.author.tag}によって作成されたテストチャンネル`,
        });

        await message.reply(`テストチャンネルを作成しました: ${channelMention(channel.id)}`);
    } else if (
        [client.testTextChannelCategory, client.testVoiceChannelCategory, client.testStageChannelCategory].includes(
            (message.channel as TextChannel | VoiceChannel | StageChannel).parentId as string
        ) &&
        !client.disableTestChannels.includes(message.channelId)
    ) {
        const channel: TextChannel | VoiceChannel | StageChannel = message.channel as
            | TextChannel
            | VoiceChannel
            | StageChannel;
        const mentionMemberIds = message.mentions.members?.map((member) => member.id) ?? [];

        for (const memberId of mentionMemberIds) {
            if (channel.permissionsFor(memberId)?.has('Administrator')) {
                await message.reply(`管理者権限を所持しているため、権限の剥奪ができません: ${userMention(memberId)}`);
            } else if (channel.permissionsFor(memberId)?.has('ViewChannel')) {
                await channel.permissionOverwrites.delete(memberId);

                await message.reply(`テストチャンネルのアクセス権限を剥奪しました: ${userMention(memberId)}`);
            } else {
                await channel.permissionOverwrites.create(memberId, {
                    ViewChannel: true,
                    ManageChannels: true,
                    ManageRoles: true,
                    ManageWebhooks: true,
                    CreateInstantInvite: true,
                    SendMessages: true,
                    SendMessagesInThreads: true,
                    CreatePublicThreads: true,
                    CreatePrivateThreads: true,
                    EmbedLinks: true,
                    AttachFiles: true,
                    AddReactions: true,
                    UseExternalEmojis: true,
                    UseExternalStickers: true,
                    MentionEveryone: true,
                    ManageMessages: true,
                    ManageThreads: true,
                    ReadMessageHistory: true,
                    SendTTSMessages: true,
                    UseApplicationCommands: true,
                    SendVoiceMessages: true,
                    Connect: true,
                    Speak: true,
                    Stream: true,
                    UseEmbeddedActivities: true,
                    UseSoundboard: true,
                    UseExternalSounds: true,
                    UseVAD: true,
                    PrioritySpeaker: true,
                    MuteMembers: true,
                    DeafenMembers: true,
                    MoveMembers: true,
                    ManageEvents: true,
                });

                await message.reply(`テストチャンネルのアクセス権限を付与しました: ${userMention(memberId)}`);
            }
        }
    }
};
