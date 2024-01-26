import { UserType } from '../../src/Models/Users/user.model';

declare global {
    declare namespace Express {
        interface Request {
            user: UserType;
        }
    }
}
