const env = require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'adriansalvador-manage',
      env: {
        ...env.parsed
      },
      script: './.output/server/index.mjs'
    }
  ]
}
