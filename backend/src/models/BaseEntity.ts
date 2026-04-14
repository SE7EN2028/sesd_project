export abstract class BaseEntity {
    protected _id: number;
    protected _createdAt: Date;

    constructor(id: number) {
        this._id = id;
        this._createdAt = new Date();
    }

    get id(): number {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    abstract toJSON(): Record<string, unknown>;
}
