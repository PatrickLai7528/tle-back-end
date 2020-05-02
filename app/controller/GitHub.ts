import { OK } from "http-status-codes";
import { Controller } from "egg";
import parse from "co-body";

export default class GitHub extends Controller {
  public async webhook() {
    const payload = await parse(this.ctx);

    console.log(payload);

    this.ctx.body = "success";
    this.ctx.status = OK;
  }
}
