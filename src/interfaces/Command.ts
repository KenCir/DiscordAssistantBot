import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import AssistantBot from '../AssistantBot';

export abstract class Command {
  /**
   * コマンド名
   */
  public readonly name!: string;

  /**
   * コマンドの説明
   */
  public readonly description!: string;

  /**
   * コマンドカテゴリ
   */
  public readonly category!: string;

  /**
   * コマンドの使用方法
   */
  public readonly usage!: string;

  /**
   * オーナー専用コマンドかどうか
   */
  public readonly ownerOnly!: boolean;

  /**
   * このコマンドはdeferReplyを使用するかどうか
   */
  public readonly deferReply!: boolean;

  /**
   * スラッシュコマンドデータ
   */
  public readonly commandData!: SlashCommandBuilder;

  public constructor(name: string, description: string, category: string, usage: string, ownerOnly: boolean, deferReply: boolean, commandData: SlashCommandBuilder) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.usage = usage;
    this.ownerOnly = ownerOnly;
    this.deferReply = deferReply;
    this.commandData = commandData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, no-empty-function
  async execute(client: AssistantBot, interaction: CommandInteraction): Promise<void> {
  }
}
