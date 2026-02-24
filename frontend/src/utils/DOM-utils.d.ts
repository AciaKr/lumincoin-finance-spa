export declare class DOMUtils {
    static getById<T extends HTMLElement>(id: string, constructor?: new () => T): T | null;
    static createElement<T extends HTMLElement>(tagName: string, constructor?: new () => T, attributes?: Partial<Record<keyof T, any>>): T;
}
//# sourceMappingURL=DOM-utils.d.ts.map