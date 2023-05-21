import AssistantBot from '../../AssistantBot';

export default (client: AssistantBot, code: number) => {
  client.logger.info(`コード${code}で終了しました`);
  client.shutdown();
};
