import Config from "../types/config.type";

const host: string | undefined = process.env.HOST;

export enum OperationName {
    income = 'income',
    expense = 'expense',
    default = 'default',
}

export enum Page {
    createCategory = 'createCategory',
    editCategory = 'editCategory',
    listCategories = 'listCategories',
    createOperation = 'createOperation',
    editOperation = 'editOperation',
}

const config: Config = {
    host: host,
    api: host && (host + '/api'),
    titlePage: {
        createCategory: {
            income: 'Создание категории доходов',
            expense: 'Создание категории расходов',
            default: 'Создание категории'
        },
        editCategory: {
            income: 'Редактирование категории доходов',
            expense: 'Редактирование категории расходов',
            default: 'Редактирование категории'
        },
        listCategories: {
            income: 'Доходы',
            expense: 'Расходы',
            default: 'Учет домашних финансов'
        },
        createOperation: {
            income: 'Создание дохода',
            expense: 'Создание расхода',
            default: 'Создание операции'
        },
        editOperation: {
            income: 'Редактирование дохода',
            expense: 'Редактирование расхода',
            default: 'Редактирование операции'
        }
    },
}

export default config;