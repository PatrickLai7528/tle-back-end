import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  const jwt = (app as any).passport.authenticate('jwt', { session: false, successReturnToOrRedirect: null });

  router.get("/api/user", controller.user.index);
  router.post("/api/auth/login", controller.user.login);
  router.post("/api/auth/registry", controller.user.registry);
  router.get("/api/auth/access_token", controller.user.tradeGitHubAccessCode);

  router.get("/api/repository", jwt, controller.repository.index);
  router.post("/api/repository", jwt, controller.repository.create);
  router.get("/api/repository/recent", jwt, controller.repository.getRecentRepo);
  router.get("/api/repository/id/:id", jwt, controller.repository.show);
  router.get("/api/repository/if_imported", jwt, controller.repository.isRepoImported);


  router.post("/api/tracelink/init", jwt, controller.traceLink.initRepoTraceLink);
  router.post("/api/tracelink", jwt, controller.traceLink.create);
  router.get("/api/tracelink", jwt, controller.traceLink.query);

  router.get("/api/tracelink/history", jwt, controller.traceLink.queryHistory);

  router.post("/api/requirement", jwt, controller.requirement.create);
  router.get("/api/requirement", jwt, controller.requirement.query);

};
