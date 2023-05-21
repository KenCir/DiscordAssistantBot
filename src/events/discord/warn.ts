import AssistantBot from '../../AssistantBot';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default (client: AssistantBot, info: string) => {
  client.logger.warn(info);
};
