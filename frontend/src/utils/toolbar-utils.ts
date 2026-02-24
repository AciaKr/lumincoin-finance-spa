import {DOMUtils} from "./DOM-utils";

export class ToolbarUtils {

    public static formatDate(date: Date | string): string {
        return new Date(date).toISOString().split('T')[0] as string;
    }

    public static showRangeDate(e: HTMLInputElement | Event): void {
        let elem: HTMLInputElement;

        if (e instanceof Event && e.target instanceof HTMLInputElement) {
            const intervalButtonElement: HTMLElement | null = DOMUtils.getById('interval');
            if (intervalButtonElement && intervalButtonElement instanceof HTMLInputElement) {
                intervalButtonElement.checked = true;
            }

            elem = e.target;
        } else if (e instanceof HTMLInputElement) {
            elem = e;
        } else {
            return;
        }

        elem.type = "date";
        elem.max = ToolbarUtils.formatDate(new Date());
        elem.style.width = '100%';
        elem.focus();
    }

    public static getQuery(e: Event | null): string {
        if (!e) return 'today';

        const [rangeWithElement, rangeByElement] = document.querySelectorAll('#range-date input') as NodeListOf<HTMLInputElement>;

        let dateFrom: string = rangeWithElement?.value || '';
        let dateTo: string = rangeByElement?.value || '';
        const defaultFrom: string = '2020-01-01';
        const defaultTo: string = ToolbarUtils.formatDate(new Date());

        const buildQuery: () => string = (): string =>
            `interval&dateFrom=${dateFrom || defaultFrom}&dateTo=${dateTo || defaultTo}`;

        if (e.target instanceof HTMLInputElement) {
            if (e.type === 'click' && e.target.type === 'radio') {
                if (e.target.value === 'interval' && rangeWithElement && rangeByElement) {
                    ToolbarUtils.showRangeDate(rangeWithElement);
                    ToolbarUtils.showRangeDate(rangeByElement);

                    return buildQuery();
                } else {
                    return e.target.value;
                }
            } else if (e.type === 'change') {
                if (e.target.id === 'range-with') dateFrom = e.target.value;
                if (e.target.id === 'range-by') dateTo = e.target.value;

                return buildQuery();
            }
        }

        return buildQuery();
    }
}