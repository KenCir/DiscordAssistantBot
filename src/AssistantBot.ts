import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { getLogger, configure, shutdown, Logger } from 'log4js';
import { Command } from './interfaces/Command';

export default class AssistantBot extends Client {
    /**
     * ロガー
     */
    public readonly logger!: Logger;

    /**
     * コマンドのコレクション
     */
    public readonly commands!: Collection<string, Command>;

    /**
     * テストチャンネル(テキスト)を作成するチャンネルのID
     */
    public readonly createTextTestChannel!: string;

    /**
     * テストチャンネル(テキスト)を作成するカテゴリのID
     */
    public readonly testTextChannelCategory!: string;

    /**
     * テストチャンネル(ボイス)を作成するチャンネルのID
     */
    public readonly createVoiceTestChannel!: string;

    /**
     * テストチャンネル(ボイス)を作成するカテゴリのID
     */
    public readonly testVoiceChannelCategory!: string;

    /**
     * テストチャンネル(ステージ)を作成するチャンネルのID
     */
    public readonly createStageTestChannel!: string;

    /**
     * テストチャンネル(ステージ)を作成するカテゴリのID
     */
    public readonly testStageChannelCategory!: string;

    /**
     * 無効なテストチャンネルのID、消しちゃいけないチャンネルとか
     */
    public readonly disableTestChannels!: Array<string>;

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            allowedMentions: {
                parse: ['users'],
                repliedUser: false,
            },
        });

        configure({
            appenders: {
                out: { type: 'stdout', layout: { type: 'coloured' } },
                app: {
                    type: 'file',
                    filename: 'logs/discord-assistant-bot.log',
                    pattern: 'yyyy-MM-dd.log',
                },
            },
            categories: {
                default: { appenders: ['out', 'app'], level: 'all' },
            },
        });

        this.logger = getLogger('DiscordAssistantBot');
        this.commands = new Collection();

        this.createTextTestChannel = '1105882049535021127';
        this.testTextChannelCategory = '1105881905586516028';
        this.createVoiceTestChannel = '1107289762999574651';
        this.testVoiceChannelCategory = '1107276410453758013';
        this.createStageTestChannel = '1107290871549923328';
        this.testStageChannelCategory = '1107276410453758013';
        this.disableTestChannels = [
            '972836497747226654',
            '1105882049535021127',
            '1107289762999574651',
            '1107290871549923328',
            '1107289865235734568',
            '1107289828623667220',
        ];
    }

    public shutdown(): void {
        this.logger.info('シャットダウンしています...');
        this.destroy();
        shutdown();
    }
}
