const { merge } = require('webpack-merge');
const loadCommonConfig = require('./configs/common');

const mode = process.env.NODE_ENV;

const loadModeConfig = env => require(`./configs/${mode}`)(env);

module.exports = env => merge(loadCommonConfig(env), loadModeConfig(env));
