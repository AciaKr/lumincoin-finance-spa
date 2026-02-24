import {OperationName} from "../config/config";
import {
    Chart,
    PieController,
    ArcElement,
    Tooltip,
    Legend,
    Colors,
    ChartConfiguration,
    ChartDataset,
    ChartTypeRegistry,
    TooltipItem
} from 'chart.js';
import {ToolbarUtils} from "../utils/toolbar-utils";
import {AuthUtils} from "../utils/auth-utils";
import {OpenNewRouteType} from "../types/route.type";
import {OperationResponseType} from "../types/response.type";
import {ListIE} from "./operations/list-ie";
import {DOMUtils} from "../utils/DOM-utils";

export class Dashboard {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly chartIncomeCanvas: CanvasRenderingContext2D | null | undefined;
    private readonly chartExpenseCanvas: CanvasRenderingContext2D | null | undefined;
    private chartIncome: Chart | undefined;
    private chartExpense: Chart | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        const chartIncomeElement: HTMLCanvasElement | null = DOMUtils.getById('chart-income', HTMLCanvasElement);
        this.chartIncomeCanvas = chartIncomeElement?.getContext('2d');
        const chartExpenseElement: HTMLCanvasElement | null = DOMUtils.getById('chart-expenses', HTMLCanvasElement);
        this.chartExpenseCanvas = chartExpenseElement?.getContext('2d');

        DOMUtils.getById('toolbar-period')?.addEventListener('click', this.init.bind(this));

        const rangeElements = document.querySelectorAll('#range-date input') as NodeListOf<HTMLInputElement>;
        if (rangeElements?.length > 0) {
            for (let rangeElement of rangeElements) {
                rangeElement.addEventListener('click', ToolbarUtils.showRangeDate);
                rangeElement.addEventListener('change', this.init.bind(this));
            }
        }

        this.init().then();
    }

    private async init(e: Event | null = null): Promise<void | null> {
        const operations: OperationResponseType[] | null | void = await ListIE.getIE(e);
        if (!operations) return;

        this.chartIncome?.destroy();
        this.chartExpense?.destroy();

        this.showCharts(operations);
    }

    private getConfigPie(data: OperationResponseType[]): ChartConfiguration {
        Chart.register([PieController, ArcElement, Tooltip, Legend, Colors]);

        const configPie: ChartConfiguration = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: ['#ffffff'],
                    //backgroundColor: Colors,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context: TooltipItem<keyof ChartTypeRegistry>): string[] {
                                const value: string = context.formattedValue;
                                return [' ' + value + '$'];
                            }
                        }
                    },
                    colors: {
                        enabled: true,
                        forceOverride: true
                    }
                }
            }
        };

        let dataCategories: { [x: string]: number } = {};

        data?.forEach((item: OperationResponseType): void => {
            if (!item.category) {
                const nameCategory = 'Без категории';
                dataCategories[nameCategory] = +item.amount;
            } else if (dataCategories[item.category] && typeof (dataCategories[item.category]) === 'number') {
                (dataCategories[item.category] as number) += +item.amount;
            } else {
                dataCategories[item.category] = +item.amount;
            }
        });

        configPie.data.labels = Object.keys(dataCategories);
        const datasets = configPie.data.datasets[0] as ChartDataset;
        datasets.data = Object.values(dataCategories);

        return configPie;
    }

    private showCharts(data: OperationResponseType[]): void {
        const incomeArray: OperationResponseType[] = data?.filter((item: OperationResponseType): boolean => item.type === OperationName.income);
        if (this.chartIncomeCanvas && incomeArray.length > 0) {
            this.chartIncome = new Chart(this.chartIncomeCanvas, this.getConfigPie(incomeArray));
        }

        const expenseArray: OperationResponseType[] = data?.filter((item: OperationResponseType): boolean => item.type === OperationName.expense);
        if (this.chartExpenseCanvas && expenseArray.length > 0) {
            this.chartExpense = new Chart(this.chartExpenseCanvas, this.getConfigPie(expenseArray));
        }
    }
}