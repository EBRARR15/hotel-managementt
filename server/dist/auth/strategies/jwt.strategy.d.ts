import { Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces/user.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: UserPayload): Promise<UserPayload & {
        userId: string;
    }>;
}
export {};
