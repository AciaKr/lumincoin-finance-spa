export class DOMUtils {

    public static getById<T extends HTMLElement>(
        id: string,
        constructor?: new () => T
    ): T | null {
        const element: HTMLElement | null = document.getElementById(id);
        if (!element) return null;

        if (constructor) {
            return element instanceof constructor ? element : null;
        }

        return element as T;
    }

    public static createElement<T extends HTMLElement>(
        tagName: string,
        constructor?: new () => T,
        attributes?: Partial<Record<keyof T, any>>
    ): T {
        const element: HTMLElement = document.createElement(tagName);

        if (constructor && !(element instanceof constructor)) {
            throw new Error(`Созданный элемент не является экземпляром ${constructor.name}`);
        }

        if (attributes) {
            Object.assign(element, attributes);
        }

        return element as T;
    }
}