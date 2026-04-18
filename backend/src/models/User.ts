import { BaseEntity } from './BaseEntity';
import bcrypt from 'bcryptjs';

export interface IUserData {
    name: string;
    email: string;
    password: string;
}

export class User extends BaseEntity {
    private _name: string;
    private _email: string;
    private _passwordHash: string;

    constructor(id: number, data: IUserData & { passwordHash: string }) {
        super(id);
        this._name = data.name;
        this._email = data.email;
        this._passwordHash = data.passwordHash;
    }

    get name(): string { return this._name; }
    set name(v: string) { this._name = v; }

    get email(): string { return this._email; }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this._passwordHash);
    }

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            createdAt: this._createdAt,
        };
    }
}
