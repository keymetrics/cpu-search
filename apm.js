const io = require('@pm2/io').init({ // eslint-disable-line
  apmOptions: {
    appName: 'cpu-search',
    serverName: process.env.NOMAD_ALLOC_ID,
    sendLogs: true
  }
})
