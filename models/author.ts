import { Request } from "express";

export type Author = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface AuthorRequest extends Request {
    author: Author;
}
