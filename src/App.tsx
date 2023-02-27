import React, { Fragment, lazy, Suspense } from "react";
import { connect } from "react-redux";
import {
  Auth,
  FC_CheckLoggedIn,
  FC_GetSystemInfo,
  FC_Logout,
  System,
  FC_SetError,
  FC_SetSuccess,
  EmploymentItem,
  FC_SwitchSelectedEmployment,
} from "./actions";
import { StoreState } from "./reducers";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LazyLoading from "./components/LazyLoading/LazyLoading";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Homepage } from "./containers/Homepage/Homepage";
// import AppLoading from "./components/AppLoading/AppLoading";
import MainLoading from "./components/MainLoading/MainLoading";
import { NavBar } from "./components/NavBar/NavBar";
import SideNavBar from "./components/SideNavBar/SideNavBar";
import AppLoading from "./components/AppLoading/AppLoading";
import Alert, { AlertType } from "./components/Alert/Alert";
import NetworkError from "./components/NetworkError/NetworkError";
import Footer from "./components/Footer/Footer";
import { SwitchEmployment } from "./components/SwitchEmployment/SwitchEmployment";
import { isAccessAuthorized, UserAccessList } from "./config/userAccess";

//* Components

const Dashboard = lazy(() =>
  import("./containers/Dashboard/Dashboard").then(({ Dashboard }) => ({
    default: Dashboard,
  }))
);
const Profile = lazy(() =>
  import("./containers/Profile/Profile").then(({ Profile }) => ({
    default: Profile,
  }))
);
const ChangePassword = lazy(() =>
  import("./containers/ChangePassword/ChangePassword").then(
    ({ ChangePassword }) => ({
      default: ChangePassword,
    })
  )
);
// Private pages with access
const PositionsManagement = lazy(() =>
  import("./containers/PositionsManagement/PositionsManagement").then(
    ({ PositionsManagement }) => ({
      default: PositionsManagement,
    })
  )
);
const EmployeesManagement = lazy(() =>
  import("./containers/EmployeesManagement/EmployeesManagement").then(
    ({ EmployeesManagement }) => ({
      default: EmployeesManagement,
    })
  )
);

//* Interfaces
// props for the component
interface AppProps {
  auth: Auth;
  system: System;
  FC_CheckLoggedIn: (callBack: (status: boolean) => void) => void;
  FC_Logout: () => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
  FC_SetError: (msg: string) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_SwitchSelectedEmployment: (employment: EmploymentItem | null) => void;
}

interface AppState {
  loading: boolean;
  openSideNav: boolean;
}

class _App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loading: false,
      openSideNav: true,
    };
  }

  componentDidMount() {
    //* check if the user is logged in
    this.setState({ loading: true });
    this.props.FC_CheckLoggedIn((status: boolean) => {
      if (status === true) {
        // Check if basic info loaded
        // if (this.props.system.basic_info === null) {
        //   this.props.FC_GetSystemInfo((loading: boolean) => {
        //     this.setState({ loading: loading });
        //   });
        // } else {
        this.setState({ loading: false });
        // }
      }
    });
  }

  render() {
    // constants
    const authenticationPath = "/login";

    if (this.props.auth.loading === true) {
      return <MainLoading />;
    }

    if (this.state.loading === true) {
      return <AppLoading />;
    }
    if (
      this.props.auth.selectedEmployment === null &&
      this.props.auth.isAuthenticated === true
    ) {
      return (
        <SwitchEmployment
          auth={this.props.auth}
          setEmploymentItem={this.props.FC_SwitchSelectedEmployment}
        />
      );
    }
    return (
      <Fragment>
        <Router>
          <div className="h-screen">
            {this.props.system.success !== "" && (
              <div className="fixed right-3 top-14 z-50 animate__animated animate__zoomInUp animate__fast pt-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={"Done successfully!"}
                  description={this.props.system.success}
                  close={() => this.props.FC_SetSuccess("")}
                  className="shadow-xl"
                />
              </div>
            )}
            {this.props.system.error !== "" && (
              <div className="fixed right-3 top-14 z-50 animate__animated animate__zoomInUp animate__fast pt-3">
                <Alert
                  alertType={AlertType.DANGER}
                  title={"Error occurred!"}
                  description={this.props.system.error}
                  close={() => this.props.FC_SetError("")}
                  className="shadow-xl"
                />
              </div>
            )}
            {/* Check connectivity */}
            {navigator.onLine === false && <NetworkError />}
            {
              <NavBar
                auth={this.props.auth}
                FC_Logout={this.props.FC_Logout}
                sideNavbarStatus={this.state.openSideNav}
                setOpenVav={(status: boolean) =>
                  this.setState({ openSideNav: status })
                }
                SwitchEmployment={() =>
                  this.props.FC_SwitchSelectedEmployment(null)
                }
              />
            }
            <div
              className={`${
                this.props.auth.isAuthenticated === true
                  ? `bg-gray-200 h-full ${
                      this.state.openSideNav === true ? " w-full md:pl-64" : ""
                    } pt-14 overflow-y-auto`
                  : ""
              }`}
              style={{ zIndex: 9 }}
            >
              {this.props.auth.isAuthenticated === true &&
                this.state.openSideNav === true && (
                  <SideNavBar
                    auth={this.props.auth}
                    sideNavbarStatus={this.state.openSideNav}
                    setOpenVav={(status: boolean) =>
                      this.setState({ openSideNav: status })
                    }
                  />
                )}
              <div
                className={`${
                  this.props.auth.isAuthenticated === true
                    ? "p-1 md:p-2 h-full mt-5 md:mt-0 container mx-auto lg:px-2"
                    : ""
                }`}
              >
                <Switch>
                  <Route exact path="/" component={Homepage} />
                  <Route exact path="/login" component={Homepage} />
                  <Suspense fallback={<LazyLoading />}>
                    <ProtectedRoute
                      path="/dashboard"
                      component={Dashboard}
                      isAuthenticated={this.props.auth.isAuthenticated}
                      authenticationPath={authenticationPath}
                      loading={this.state.loading}
                      exact
                    />

                    <ProtectedRoute
                      path="/profile"
                      component={Profile}
                      isAuthenticated={this.props.auth.isAuthenticated}
                      authenticationPath={authenticationPath}
                      loading={this.state.loading}
                      exact
                    />
                    <ProtectedRoute
                      path="/change-password"
                      component={ChangePassword}
                      isAuthenticated={this.props.auth.isAuthenticated}
                      authenticationPath={authenticationPath}
                      loading={this.state.loading}
                      exact
                    />
                    {isAccessAuthorized(
                      this.props.auth.selectedEmployment,
                      UserAccessList.POSITIONS
                    ).view === true && (
                      <ProtectedRoute
                        path="/positions-management"
                        component={PositionsManagement}
                        isAuthenticated={this.props.auth.isAuthenticated}
                        authenticationPath={authenticationPath}
                        loading={this.state.loading}
                        exact
                      />
                    )}
                    {isAccessAuthorized(
                      this.props.auth.selectedEmployment,
                      UserAccessList.EMPLOYEES_LIST
                    ).view === true && (
                      <ProtectedRoute
                        path="/employees-management"
                        component={EmployeesManagement}
                        isAuthenticated={this.props.auth.isAuthenticated}
                        authenticationPath={authenticationPath}
                        loading={this.state.loading}
                        exact
                      />
                    )}
                  </Suspense>
                </Switch>
              </div>
            </div>
            {/* Footer */}
            {this.props.auth.isAuthenticated === false && <Footer />}
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): {
  auth: Auth;
  system: System;
} => {
  return {
    auth,
    system,
  };
};

export const App = connect(mapStateToProps, {
  FC_CheckLoggedIn,
  FC_Logout,
  FC_GetSystemInfo,
  FC_SetError,
  FC_SetSuccess,
  FC_SwitchSelectedEmployment,
})(_App);
