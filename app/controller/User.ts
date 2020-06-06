import { extractToken } from "./../utils/Token";
import { IUser } from "./../entity/User";
import axios from "axios";
import { Context, Controller } from "egg";
import * as Httpstatus from "http-status-codes";
import { sign } from "jsonwebtoken";

export default class UserController extends Controller {
  public async index() {
    const users: IUser[] = await this.ctx.service.user.findAll();
    this.ctx.body = { success: true, payload: users };
  }

  public async tradeGitHubAccessCode() {
    const { ctx, config } = this;
    const requestToken = ctx.query.code;

    const token = ctx.cookies.get("tle_app_token", { signed: false });
    const { clientID, clientSecret } = config.githubApps;

    const tokenResponse = await axios({
      method: "post",
      url:
        "https://github.com/login/oauth/access_token?" +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
        `code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    });

    const accessToken = tokenResponse.data.access_token;

    if (token) {
      const { email } = extractToken(ctx, config);
      if (email) {
        const user: IUser | undefined = await ctx.service.user.findUserByEmail(
          email
        );
        if (user && !user.githubId) {
          const result = await axios({
            method: "get",
            url: `https://api.github.com/user`,
            headers: {
              accept: "application/json",
              Authorization: `token ${accessToken}`,
            },
          });
          const githubId = result.data.login;
          if (githubId) {
            await ctx.service.user.update(user, { githubId });
          }
          console.log("here");
        }
        const newUser:
          | IUser
          | undefined = await ctx.service.user.findUserByEmail(email);
        const token = sign(
          {
            email: email,
            githubId: newUser?.githubId!,
          },
          this.config.passportJwt.secret
        );
        ctx.cookies.set("tle_app_token", token, { signed: false });
      }
    }

    ctx.cookies.set("tle_app_gh_token", accessToken, { signed: false });
    ctx.body = { success: true, payload: accessToken };
    ctx.status = Httpstatus.OK;
  }

  public async login() {
    const ctx: Context = this.ctx;
    const { email, password } = ctx.request.body;
    const success = await ctx.service.user.logIn(email, password);
    const user = await ctx.service.user.findUserByEmail(email);
    if (success && user) {
      const token = sign(
        {
          email: email,
          githubId: user.githubId,
        },
        this.config.passportJwt.secret
      );
      ctx.body = {
        success: true,
        payload: {
          token: token,
          githubId: user.githubId,
        },
      };
      ctx.cookies.set("tle_app_token", token, { signed: false });
    } else {
      ctx.body = { success: false, meta: "用戶不存在" };
    }
    ctx.status = Httpstatus.OK;
  }

  public async registry() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;

    const success = await ctx.service.user.registry(email, password);
    ctx.body = success
      ? { success: true }
      : { success: false, meta: "用戶已存在" };
    ctx.status = Httpstatus.OK;
  }
}
