import { app } from 'egg-mock/bootstrap';
import * as assert from 'power-assert';
import { IUser } from './../../../app/entity/User';

describe('test/app/controller/User.test.ts', () => {

   afterEach(async () => {
      const ctx = app.mockContext();
      const users: IUser[] = await ctx.service.cRUD.read({}, ctx.model.User);
      // console.log(users);
      for (const user of users) {
         await ctx.service.cRUD.delete(user, ctx.model.User);
      }
   })

   it('should log in and registry', async () => {
      const res = await app.httpRequest().post("/api/auth/login").send({ email: "jkljiojo@gmail.com", password: "jlksjkdaklfjaosd" })
      // assert(result.text === 'hi, egg');
      // console.log(res);
      assert(res.body.success)
   });
});
