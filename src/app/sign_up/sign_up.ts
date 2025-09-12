import {z} from 'zod';

const userSchema = z.object({
  name: z.string,
});

const user = {name: 'ali'};

console.log(userSchema.parse(user));
