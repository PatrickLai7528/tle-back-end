import { EggAppConfig, EggAppInfo, PowerPartial, Context } from "egg";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.cluster = {
    listen: {
      port: 3000,
    },
  };

  config.githubApps = {
    clientID: "Iv1.61514a0dc0e75d1e",
    clientSecret: "5684cf24b2dc1613c82e1c1c11fb3a9ac6abcf3c",
    authorizeUrl: "https://github.com/login/oauth/authorize",
  };

  // 修改bodyParser配置
  config.bodyParser = {
    jsonLimit: "30mb",
    formLimit: "30mb", // Content-Type為application/json時，body的大小
  };

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1586951797220_1123";

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
    credentials: true,
  };

  // // database for testing
  // config.mongoose = {
  //   url: "mongodb://localhost:27017/tle",
  //   options: {},
  // };

  const user = "patrick";
  const password = "W3nyxwtY6bP8xBp";
  const database = "awardchaser";

  config.mongoose = {
    url: `mongodb://${user}:${password}@dds-m5ebe0a91746a2c4-pub.mongodb.rds.aliyuncs.com:3717/${database}`,
    options: {},
  };

  config.security = {
    csrf: { enable: false },
    domainWhiteList: [
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:3001",
    ],
  };

  config.onerror = {
    all(err: any, ctx: Context) {
      ctx.body = JSON.stringify({
        success: false,
        meta: err.message || "發生錯誤！",
      });
      ctx.status = INTERNAL_SERVER_ERROR;
    },
  };

  config.passportJwt = {
    secret: "MY SUPER SECRET KEY, LAI KIN MENG PATRICK",
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
