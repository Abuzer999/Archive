export interface Workspace {
    id: string;
    name: string;
    role: 'CREATOR' | 'ADMIN' | 'USER';
    avatar?: string;
    alt: string;
    people: number;
}