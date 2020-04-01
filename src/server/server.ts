import express from "express";
import cors from "cors";

import PromiseRouter from "express-promise-router";
import proxy from "express-http-proxy";
import config from "./config";

/**
 * file contains routes specifically for the ui, othewise there should be no consumers
 */
const proxyApi = PromiseRouter();

proxyApi.use(
  "/nssac.bii.virginia.edu/",
  proxy("https://nssac.bii.virginia.edu", {
    // userResHeaderDecorator: ({
    // }) => {
    //   return headers
    // }
  })
);

proxyApi.use(
  "/github.com/",
  proxy("https://github.com", {
    // https: true
  })
);

proxyApi.use("/ui", proxy(config.ui));

const app = express();

// cors
const corsHandler = cors({ origin: true, credentials: true });
app.options("*", corsHandler);

app.use([proxyApi, corsHandler]);

const port = config.port;

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
