import { JWTOption } from '@elysiajs/jwt';

export default {
    name: 'jwt',
    secret: process.env.JWT_SECRET as string,
    exp: '7d',
} satisfies JWTOption;
