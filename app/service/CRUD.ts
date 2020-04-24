import { Service } from 'egg';

/**
 * CRUD Service
 */
export default class CRUD extends Service {

   public async create<T>(t: T, model: any): Promise<void> {
      const { _id, ...others } = t as any;
      return model.create({ ...others })
   }

   public async read<T>(t: Partial<T>, model: any): Promise<T[]> {
      return new Promise<T[]>((resolve, reject) => {
         model.find({ ...t }, (err, res) => {
            if (err) {
               reject(err);
            }
            resolve(res);
         });
      });
   }

   public async update<T>(target: T, obj: any, model?: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
         const { id, ...others } = obj;
         model.update(target, others, err => {
            if (err) {
               reject(err);
            }
            resolve();
         });
      });
   }

   public async delete(t: any, model: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
         model.deleteMany({ _id: t._id }, (err: any) => {
            if (err) {
               reject(err);
            }
            resolve();
         });
      });
   }
}
