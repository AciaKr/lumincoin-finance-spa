import "./styles/styles.scss";
import {library, dom} from '@fortawesome/fontawesome-svg-core';
import {faEnvelopeOpen, faUser, faMoneyBill1} from '@fortawesome/free-regular-svg-icons';
import {faLock, faHouseChimney, faChevronRight, faPencil, faTrashCan, faBars, faCoins} from '@fortawesome/free-solid-svg-icons';
import {Router} from "./router";


library.add(faEnvelopeOpen, faLock, faUser, faHouseChimney, faMoneyBill1, faChevronRight, faPencil, faTrashCan, faBars, faCoins);
dom.watch();

class App {
    constructor() {
        new Router();
    }
}

(new App());