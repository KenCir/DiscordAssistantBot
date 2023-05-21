import AssistantBot from '../../AssistantBot';

export default (client: AssistantBot) => {
  client.user?.setActivity('/help 幻想地帝国システム課');
  client.logger.info(`Logged in as ${client.user?.tag as string}`);
};
