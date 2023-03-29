import crypto from "crypto";
import {ObjectId} from 'bson';
import dayjs from "dayjs";
/**
 * generate mongo id from seed and creation date
 * https://docs.mongodb.com/manual/reference/method/ObjectId/
 * @param seed - string allowing to create predictable mongo id value ( the same for any execution )
 * @param date - date of creation - first 4 bytes of id
 * @returns {ObjectId}
 */
export function mongoIdFromSeed(seed: string, date = '2022-01-01'): ObjectId {
  return new ObjectId(
    dayjs(date).unix().toString(16) + crypto.createHash('md5').update(seed).digest('hex').substring(0, 16)
  )
}

export function mongoStringFromSeed(seed: string, date = '2022-01-01'): string {
  return mongoIdFromSeed(seed, date).toString();
}
