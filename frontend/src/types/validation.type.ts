export type ValidationType = {
    element: HTMLElement | null,
    options?: OptionsType;
}

export type OptionsType = {
    pattern?: RegExp,
    compareTo?: string,
    select?: boolean,
}