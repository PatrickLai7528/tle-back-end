import { Controller } from "egg";

export default class Test extends Controller {
  public async test() {
    this.ctx.body = "TEST SUCCESS";
  }
}
