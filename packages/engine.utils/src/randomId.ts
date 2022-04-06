import { customAlphabet } from "nanoid";

// https://zelark.github.io/nano-id-cc/
// ~138 thousand years needed, in order to have a 1% probability of at least one collision.
// this character set ensures ids can be used in many situations
const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
  15
);

export const randomId = (): string => nanoid();
