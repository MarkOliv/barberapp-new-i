import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, home, square } from "ionicons/icons";
import Home from "./pages/Home";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/SignUp";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RedefinePassword from "./pages/auth/RedefinePassword";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import { EditService } from "./pages/EditService";
import Products from "./pages/Products";
import { EditProduct } from "./pages/EditProduct";
import Calendar from "./pages/Calendar";
import { EditSchedule } from "./pages/EditSchedule";
import { useAuth } from "./contexts";
import BarberRegister from "./pages/auth/BarberRegister";
import Barbers from "./pages/Barbers";
import Config from "./pages/config/HomeConfig";
import Help from "./pages/config/Help";

import Product_categories from "./pages/config/Categories/ProductsCategories";
import Services_categories from "./pages/config/Categories/ServicesCategories";
import Reports from "./pages/config/Reports";
import Categories from "./pages/config/Categories";
import RegisterSpecialties from "./pages/config/Specialties/RegisterSpecialties";
import Specialties from "./pages/config/Specialties";
import EditMyEspecialties from "./pages/config/Specialties/EditMyEspecialties";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Balance from "./pages/config/Reports/Balance";
import Expenses from "./pages/config/Reports/Expenses";
import DaysOff from "./pages/config/DaysOff";
import LunchTime from "./pages/config/DaysOff/LunchTime";
import BlockTimes from "./pages/config/DaysOff/BlockTimes";
import EditBlockedTimes from "./pages/config/DaysOff/BlockTimes/EditBlockedTimes";
import BalanceDay from "./pages/config/Reports/BalanceDay";
import NumberClientsMonth from "./pages/config/Reports/numberClientsMonth";
import NumberClientsDay from "./pages/config/Reports/numberClientsDay";

setupIonicReact();

const App: React.FC = () => {
  const { sessionUser } = useAuth();

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to={sessionUser ? "/app/home" : "/signup"} />
            </Route>

            <Route exact path="/app/config/reports" component={Reports} />
            <Route
              exact
              path="/app/config/reports/balance"
              component={Balance}
            />
            <Route
              exact
              path="/app/config/reports/balanceday"
              component={BalanceDay}
            />
            <Route
              exact
              path="/app/config/reports/number-clients-month"
              component={NumberClientsMonth}
            />
            <Route
              exact
              path="/app/config/reports/number-clients-day"
              component={NumberClientsDay}
            />

            <Route
              exact
              path="/app/config/reports/add-expenses"
              component={Expenses}
            />

            <Route exact path="/app/config/daysoff" component={DaysOff} />
            <Route
              exact
              path="/app/config/daysoff/lunch-time"
              component={LunchTime}
            />
            <Route
              exact
              path="/app/config/daysoff/block-times"
              component={BlockTimes}
            />
            <Route
              path="/app/config/daysoff/block-times/edit/:blockId"
              component={EditBlockedTimes}
            />

            <Route exact path="/app/profile/:id" component={Profile} />
            <Route exact path="/app/config" component={Config} />
            <Route exact path="/app/config/help" component={Help} />
            <Route exact path="/app/notifications" component={Notifications} />
            <Route exact path="/app/chat" component={Chat} />
            <Route
              exact
              path="/app/config/specialties"
              component={Specialties}
            />
            <Route
              exact
              path="/app/config/register-specialties"
              component={RegisterSpecialties}
            />
            <Route
              exact
              path="/app/config/edit-my-specialties"
              component={EditMyEspecialties}
            />
            <Route exact path="/app/config/categories" component={Categories} />
            <Route
              exact
              path="/app/config/products-categories"
              component={Product_categories}
            />
            <Route
              exact
              path="/app/config/services-categories"
              component={Services_categories}
            />

            <Route exact path="/app/home">
              <Home />
            </Route>

            <Route exact path="/app/calendar" component={Calendar} />
            <Route
              exact
              path="/app/edit-schedule/:scheduleId"
              component={EditSchedule}
            />
            {/* barber */}

            <Route exact path="/register-barber" component={BarberRegister} />
            <Route exact path="/app/barbers" component={Barbers} />

            {/* auth */}

            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
              exact
              path="/redefine-password"
              component={RedefinePassword}
            />

            {/* services */}

            <Route exact path="/app/services" component={Services} />
            <Route
              exact
              path="/app/edit-service/:ServiceId"
              component={EditService}
            />

            {/* products */}

            <Route exact path="/app/products" component={Products} />
            <Route
              exact
              path="/app/edit-product/:ProductId"
              component={EditProduct}
            />
          </IonRouterOutlet>

          <IonTabBar className="hidden" slot="bottom">
            <IonTabButton tab="Home" href="/Home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={ellipse} />
              <IonLabel>Tab 2</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
