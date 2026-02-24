export type ParamsRequestType = {
    method: string,
    headers: {
        'Content-Type': string,
        'Accept': string,
        'x-auth-token'?: string,
    },
    body?: BodyInit | null
}

export type BodyRequestLoginType = {
    email: string,
    password: string,
    rememberMe: boolean,
}

export type BodyRequestSignupType = {
    name: string,
    lastName: string,
    email: string,
    password: string,
    passwordRepeat: string,
}

export type BodyRequestCategoryType = {
    title: string,
}

export type BodyRequestOperationType = {
    type: string,
    category_id: number
    amount: number,
    date: string,
    comment: string,
}