import React, { Component } from "react";
import { connect } from "react-redux";
import { StoreState } from "../../reducers";
import { Auth, FC_SetError, FC_SetSuccess, System } from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import DashboardLoading from "../../components/DashboardLoading/DashboardLoading";
import { MdOutlineDashboard } from "react-icons/md";

interface AppProps {
  auth: Auth;
  system: System;
  FC_SetSuccess: (msg: string) => void;
  FC_SetError: (msg: string) => void;
}

interface AppState {
  loading: boolean;
  success: string;
  error: string;
}
class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loading: false,
      success: "",
      error: "",
    };
  }

  componentDidMount = () => {};
  render() {
    if (this.state.loading === true) {
      return <DashboardLoading />;
    }

    return (
      <div className="mt-3">
        <div className="flex flex-row items-center gap-3 mb-6">
          <div>
            <MdOutlineDashboard className="text-3xl" />
          </div>
          <span className="font-extrabold text-xl">Application Dashboard</span>
        </div>
        {this.state.error !== null && (
          <div className="w-full my-3">
            {this.state.error !== "" && (
              <Alert
                alertType={AlertType.WARNING}
                title={"Not found!"}
                description={this.state.error}
                close={() => {
                  this.setState({
                    error: "",
                  });
                }}
                className={"border-2 border-white"}
              />
            )}
          </div>
        )}
        <div className="bg-white p-3 py-8 text-center w-full rounded-md text-3xl flex flex-col items-center justify-center">
          <div>
            <MdOutlineDashboard className="text-6xl text-gray-300 mb-2" />
          </div>
          <div className="font-light">WELCOME</div>
          <div className="text-primary-700 text-xl">
            {this.props.auth.user?.first_name} {this.props.auth.user?.last_name}
          </div>
        </div>
      </div>
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

export const Dashboard = connect(mapStateToProps, {
  FC_SetSuccess,
  FC_SetError,
})(App);
