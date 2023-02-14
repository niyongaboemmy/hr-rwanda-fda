import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {
  ApplicationCustomSearchInterface,
  ApplicationDetailsInterface,
  ApplicationsStore,
  Auth,
  FC_GetApplicationByReferenceNumber,
  FC_GetCustomSearchResults,
  FC_SetError,
  FC_SetSuccess,
  System,
} from "../../actions";
import { StoreState } from "../../reducers";
import { SearchByReferenceNumber } from "../ApplicationsList/SearchByReferenceNumber/SearchByReferenceNumber";

interface RegisterProductPageProps {
  auth: Auth;
  system: System;
  applications: ApplicationsStore;
  FC_GetApplicationByReferenceNumber: (
    reference_number: string,
    callback: (
      loading: boolean,
      res: ApplicationDetailsInterface | null,
      msg: string
    ) => void
  ) => void;
  FC_GetCustomSearchResults: (
    reference_number: string,
    callback: (
      loading: boolean,
      res: ApplicationCustomSearchInterface[] | null,
      msg: string
    ) => void
  ) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_SetError: (msg: string) => void;
}
interface RegisterProductPageState {
  loading: boolean;
  redirect: boolean;
}

class _RegisterProductPage extends Component<
  RegisterProductPageProps,
  RegisterProductPageState
> {
  constructor(props: RegisterProductPageProps) {
    super(props);

    this.state = {
      loading: false,
      redirect: false,
    };
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/applications-list" />;
    }
    return (
      <div>
        <SearchByReferenceNumber
          onGoBack={() => {
            this.setState({ redirect: true });
          }}
          FC_GetApplicationByReferenceNumber={
            this.props.FC_GetApplicationByReferenceNumber
          }
          FC_GetCustomSearchResults={this.props.FC_GetCustomSearchResults}
          FC_SetSuccess={this.props.FC_SetSuccess}
          FC_Error={this.props.FC_SetError}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
  applications,
}: StoreState): {
  auth: Auth;
  system: System;
  applications: ApplicationsStore;
} => {
  return {
    auth,
    system,
    applications,
  };
};
export const RegisterProductPage = connect(mapStateToProps, {
  FC_GetApplicationByReferenceNumber,
  FC_GetCustomSearchResults,
  FC_SetSuccess,
  FC_SetError,
})(_RegisterProductPage);
