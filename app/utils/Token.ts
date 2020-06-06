import { Context, EggAppConfig } from "egg";
import { verify } from "jsonwebtoken";

export const extractToken = (
  ctx: Context,
  config: EggAppConfig
): { githubId: string; email: string } => {
  const token = ctx.cookies.get("tle_app_token", { signed: false });
  try {
    const res = verify(token, config.passportJwt.secret);
    const { githubId, email } = res;
    return { githubId, email };
  } catch (e) {
    throw new Error("請重新登入");
  }
};
