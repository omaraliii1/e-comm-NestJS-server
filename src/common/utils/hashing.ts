import * as bcrypt from 'bcryptjs';

export async function hashingPassword(plainPassword: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
}

export function compareHashed(plainPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
