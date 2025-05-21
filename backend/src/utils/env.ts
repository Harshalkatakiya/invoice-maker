/* eslint-disable node/no-process-env */
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'node:path';
import { NODE_ENV } from 'types/env';
import { z } from 'zod';

expand(config({ path: path.resolve(process.cwd(), '.env') }));

const EnvSchema = z.object({
  NODE_ENV: z.enum(NODE_ENV).default('development'),
  HOST_NAME: z.string().url().default('http://localhost'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url()
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error(
    '❌ Invalid env: ',
    JSON.stringify(error.flatten().fieldErrors, null, 2)
  );
  process.exit(1);
}

export default env!;
