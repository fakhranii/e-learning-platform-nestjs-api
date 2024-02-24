import * as bcrypt from 'bcrypt';

export function comparePasswords(plainPassword: string, hash: string) {
  // compare the hashingPassword with plainPassword to make sure they're the same password
  return bcrypt.compareSync(plainPassword, hash);
}