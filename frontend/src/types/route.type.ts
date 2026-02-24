export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string,
    load?(): void
}

export type OpenNewRouteType = {
    (url: string): Promise<void>
}