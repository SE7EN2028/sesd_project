import { BaseEntity } from './BaseEntity';

export interface ICategoryData {
    name: string;
    color: string;
}

export class Category extends BaseEntity {
    private _name: string;
    private _color: string;

    constructor(id: number, data: ICategoryData) {
        super(id);
        this._name = data.name;
        this._color = data.color;
    }

    get name(): string { return this._name; }
    set name(v: string) { this._name = v; }

    get color(): string { return this._color; }
    set color(v: string) { this._color = v; }

    toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            name: this._name,
            color: this._color,
            createdAt: this._createdAt,
        };
    }
}
