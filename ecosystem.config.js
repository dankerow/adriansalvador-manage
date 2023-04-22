const env = require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'adriansalvador-manage',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        ...env.parsed
      },
      script: './.output/server/index.mjs'
    }
  ]
}
