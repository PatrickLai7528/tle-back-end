import * as crypto from "crypto";

export const hash = (str: string) => {
   const hash = crypto.createHash('md5');
   hash.update(str);
   let ret = hash.digest('hex');
   return ret;
}