import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../lib/auth';

type Role = 'teacher' | 'student' | 'admin';

// middleware/roleMiddleware.ts
export const requireRole = (roles: Role[]) => {
   return async (req: any, res: any, next: any) => {
      const session = await auth.api.getSession({
         headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
         return res.status(401).json({ message: 'Unauthorized' });
      }

      if (
         !roles.includes(session.user.role as Role)
      ) {
         return res.status(403).json({
            message:
               'Forbidden: Requires one of the following roles: ' +
               roles.join(', '),
         });
      }

      req.user = session.user;
      next();
   };
};
