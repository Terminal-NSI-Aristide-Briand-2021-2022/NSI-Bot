import { ActivitiesOptions } from 'discord.js';
import { rss } from '../utils';
import { Bot, Command, Event, Logger } from '../utils/class/';

export default new Event('ready', async (client: Bot) => {
  const guilds = [
    client.guilds.cache.get(`887719893825388554`), //This is my testing guild
  ];
  Logger.log(`${client.user?.username} launched in ${Date.now() - client.launchedAt}ms !`);

  Logger.info('Commands', 'SETUP');
  client.user?.setPresence({
    status: 'dnd',
    activities: [
      {
        name: 'Loading...',
        type: 'PLAYING',
      },
    ],
  });

  for (const guild of guilds) {
    await guild?.commands.set(client.commands.filter(c => c instanceof Command).map(c => (c as Command).data)).catch(_ => _);
    for (const cmd of client.commands.filter(c => c instanceof Command && (c.permission?.user?.dev ?? false)).map(m => (m as Command).data.name)) {
      guild?.commands.cache
        .find(c => c.name === cmd)
        ?.permissions.add({
          permissions: client.developpers.map(d => {
            return {
              id: d,
              type: 'USER',
              permission: true,
            };
          }),
        })
        .catch(_ => _);
    }
  }

  Logger.info('Cache', 'SETUP');
  for (const guild of client.guilds.cache.map(m => m)) {
    await guild?.members.fetch();
  }
  Logger.info('Done', 'SETUP');

  const status: ActivitiesOptions = client.inDev
    ? {
        name: 'se fait taper dessus par Simon',
        type: 'PLAYING',
      }
    : {
        name: 'les devoirs à faire',
        type: 'WATCHING',
      };

  client.user?.setPresence({
    status: 'online',
    activities: [status],
  });
  setInterval(() => {
    client.user?.setPresence({
      status: 'online',
      activities: [status],
    });
  }, 60000);

  await rss(client);
});
