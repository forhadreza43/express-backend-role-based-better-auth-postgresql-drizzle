import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../src/db/db'; // your drizzle instance
import * as schema from '../src/db/schema/auth-schema'; // your drizzle schema
import { oAuthProxy } from 'better-auth/plugins';

export const auth = betterAuth({
   secret: process.env.BETTER_AUTH_SECRET!,
   trustedOrigins: [process.env.FRONTEND_URL!],
   database: drizzleAdapter(db, {
      provider: 'pg', // or "mysql", "sqlite"
      schema, // optional, defaults to "public"
   }),

   emailAndPassword: {
      enabled: true,
   },

   // social login
   baseURL: process.env.BETTER_AUTH_URL,
   socialProviders: {
      google: {
         prompt: 'select_account',
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
   },

   user: {
      additionalFields: {
         role: {
            type: 'string',
            required: true,
            defaultValue: 'student',
            input: true,
         },
         image: {
            type: 'string',
            required: false,
            defaultValue:
               'https://res.cloudinary.com/dqs6k0so6/image/upload/v1769692289/profile_eguhty.png',
            input: true,
         },
      },
   },

   plugins: [
      oAuthProxy({
         productionURL: process.env.BETTER_AUTH_URL, //production backend URL
         currentURL: process.env.BETTER_AUTH_URL, //development backend URL
      }),
   ],
});
