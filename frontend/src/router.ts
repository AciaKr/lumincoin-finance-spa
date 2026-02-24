import {OperationName} from "./config/config";
import {AuthUtils} from "./utils/auth-utils";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/signup";
import {Logout} from "./components/auth/logout";
import {Dashboard} from "./components/dashboard";
import {CreateCategory} from "./components/income-expenses/create-category";
import {EditCategory} from "./components/income-expenses/edit-category";
import {ListCategories} from "./components/income-expenses/list-categories";
import {CreateIE} from "./components/operations/create-ie";
import {EditIE} from "./components/operations/edit-ie";
import {ListIE} from "./components/operations/list-ie";
import {DeleteCategory} from "./components/income-expenses/delete-category";
import {DeleteIE} from "./components/operations/delete-ie";
import {AuthService} from "./services/auth-service";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/auth.type";
import {DOMUtils} from "./utils/DOM-utils";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private userName: string | null;
    private routes: RouteType[];

    constructor() {
        this.titlePageElement = DOMUtils.getById('title');
        this.contentPageElement = DOMUtils.getById('content');
        this.userName = null;

        this.init();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    document.body.className = '';
                    new Dashboard(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/login.html',
                load: (): void => {
                    document.body.className = 'auth-page login-page';
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/signup.html',
                load: (): void => {
                    document.body.className = 'auth-page signup-page';
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: (): void => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income-expenses/list-categories.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ListCategories(this.openNewRoute.bind(this), OperationName.income);
                },
            },
            {
                route: '/income/create-category',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/income-expenses/create-category.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateCategory(this.openNewRoute.bind(this), OperationName.income);
                },
            },
            {
                route: '/income/edit-category',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income-expenses/edit-category.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditCategory(this.openNewRoute.bind(this), OperationName.income);
                },
            },
            {
                route: '/income/delete-category',
                load: (): void => {
                    new DeleteCategory(this.openNewRoute.bind(this), OperationName.income);
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/income-expenses/list-categories.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ListCategories(this.openNewRoute.bind(this), OperationName.expense);
                },
            },
            {
                route: '/expense/create-category',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/income-expenses/create-category.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateCategory(this.openNewRoute.bind(this), OperationName.expense);
                },
            },
            {
                route: '/expense/edit-category',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/income-expenses/edit-category.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditCategory(this.openNewRoute.bind(this), OperationName.expense);
                },
            },
            {
                route: '/expense/delete-category',
                load: (): void => {
                    new DeleteCategory(this.openNewRoute.bind(this), OperationName.expense);
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ListIE(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateIE(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditIE(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/delete',
                load: (): void => {
                    new DeleteIE(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    private init(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async clickHandler(e: Event): Promise<void> {
        let element: HTMLElement | null = null;

        if (e.target && e.target instanceof HTMLElement) {
            if (e.target.id === 'icon-burger' || e.target.id === 'burger-link'
                || (e.target.parentNode && e.target.parentNode instanceof HTMLElement && e.target.parentNode.id === 'icon-burger')) {
                this.showSlideOutSidebar();
            }

            if (e.target.nodeName === 'A') {
                element = e.target;
            } else if (e.target.parentNode && e.target.parentNode instanceof HTMLElement && e.target.parentNode.nodeName === 'A') {
                element = e.target.parentNode;
            }
        }

        if (element && element instanceof HTMLAnchorElement) {
            const currentRoute: string = window.location.pathname;
            e.preventDefault();
            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute === '/login' || oldRoute === '/signup') {
            this.userName = null;
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout && this.contentPageElement) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then((response: Response): Promise<string> => response.text());
                    contentBlock = DOMUtils.getById('main');
                    // show user balance
                    const balanceElement: HTMLElement | null = DOMUtils.getById('balance');
                    if (balanceElement) {
                        balanceElement.innerText = new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0
                        }).format(await AuthService.getBalance());
                    }
                    // show username
                    if (!this.userName) {
                        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) as string | null;
                        if (userInfo) {
                            const parseUserInfo: UserInfoType = JSON.parse(userInfo);
                            if (parseUserInfo && parseUserInfo.name) {
                                this.userName = parseUserInfo.name;
                            }
                        }
                    }
                    const userNameElement: HTMLElement | null = DOMUtils.getById('user-name');
                    if (userNameElement && this.userName) {
                        userNameElement.innerText = this.userName;
                    }
                    // show activeMenuItem
                    this.showActiveMenuItem(newRoute);
                } else {
                    document.body.className = '';
                }

                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then((response: Response): Promise<string> => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState(null, '', '/404');
            await this.activateRoute(null);
        }
    }

    private showSlideOutSidebar() {
        const sidebarNav: HTMLElement | null = DOMUtils.getById('sidebar-nav');
        const offcanvasBody: HTMLElement | null = DOMUtils.getById('offcanvasBody');
        if (sidebarNav && offcanvasBody) {
            sidebarNav.classList.add('d-flex');
            offcanvasBody.appendChild(sidebarNav);
        }
    }

    private showActiveMenuItem(currentRoute: RouteType) {
        document.querySelectorAll('.sidebar .nav-link').forEach((link: Element): void => {
            const href: string | null = link.getAttribute('href');

            if (href && (currentRoute.route.startsWith(href) && href !== '/') || (href === currentRoute.route)) {
                link.classList.add('active');

                if (link.className.includes('dropdown-item')) {
                    const dropdownMenuButton: HTMLElement | null = DOMUtils.getById('dropdownMenuButton');
                    const dropdownMenu: HTMLElement | null = DOMUtils.getById('dropdownMenu');
                    if (dropdownMenu && dropdownMenuButton) {
                        dropdownMenuButton.classList.add('show');
                        dropdownMenu.classList.add('show');
                        dropdownMenu.style.position = 'absolute';
                        dropdownMenu.style.inset = '0px auto auto 0px';
                        dropdownMenu.style.margin = '0px';
                        dropdownMenu.style.transform = 'translate3d(0px, 42.4px, 0px)';
                    }
                }
            } else {
                link.classList.remove('active');
            }
        })
    }
}