export default interface StudentInterface {
    create(name: string): Promise<any>;
    findAll(): Promise<any>;
    find(id: number): Promise<any>;
    update(id: number, name: string): Promise<any>;
    delete(id: number): Promise<any>;
}
