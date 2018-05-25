var environments = {
  staging: {
    http_port: 3100,
    https_port: 3101,
    env_name: 'staging',
  },
  production: {
    http_port: 4100,
    https_port: 4101,
    env_name: 'production',
  }
};

var current_env = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : ''; 

var environment_to_export = typeof environments[current_env] == 'object' ? environments[current_env] : environments.staging;

module.exports = environment_to_export;