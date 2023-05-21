import AssistantBot from '../../AssistantBot';

export default (client: AssistantBot, error: Error) => {
  client.logger.error(error);
};
