import { hash } from '../utils/Hash';
import { Service } from "egg";
import { IUser } from '../entity/User';
import CRUD from './CRUD';
import { randomStr } from '../utils/Random';

export default class User extends Service {

   private getCRUD(): CRUD {
      return this.ctx.service.cRUD as CRUD;
   }

   private getModel() {
      return this.ctx.model.User;
   }

   public async findAll(): Promise<IUser[]> {
      return await this.getCRUD().read({}, this.getModel()) as IUser[];
   }

   public async update(target: Partial<IUser>, user: Partial<IUser>): Promise<void> {
      await this.getCRUD().update(target, user, this.getModel());
   }

   public async logIn(email: string, password: string): Promise<boolean> {
      const hashedPassword = hash(password + this.findSalt(email));
      try {
         const users: IUser[] = await this.getCRUD().read({ email }, this.getModel()) as IUser[];
         if (users[0].password === hashedPassword) {
            return true;
         } else return false;
      } catch (e) {
         return false;
      }
   }

   public async findUserByEmail(email: string): Promise<IUser | undefined> {
      const users = await this.getCRUD().read({ email }, this.getModel()) as IUser[];
      return users[0]
   }

   public async isEmailExist(email: string): Promise<boolean> {
      const found: IUser[] = await this.getCRUD().read({ email }, this.getModel()) as IUser[];
      return found && found.length > 0;
   }

   private async generateSalt(email: string): Promise<string> {
      const random = randomStr();
      const SaltTable = this.ctx.model.SaltTable;
      const salt = hash(email + random);

      await this.getCRUD().create({ email, salt }, SaltTable);

      return salt;
   }

   private async findSalt(email: string): Promise<string> {
      const res: { email: string, salt: string } | undefined = await this.getCRUD().read({ email }, this.ctx.model.SaltTable)[0];
      if (!res) throw new Error("no salt");
      return res.salt;
   }

   public async registry(email: string, password: string): Promise<boolean> {
      const hashedPassword = hash(password + this.generateSalt(email));
      const user: Partial<IUser> = { email, password: hashedPassword };
      await this.getCRUD().create(user, this.getModel());
      return true;
   }

}