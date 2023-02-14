import React, { Component } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { connect } from "react-redux";
import { Auth, FC_SetError, FC_SetSuccess, System } from "../../actions";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";
import { GrStackOverflow } from "react-icons/gr";
import { SearchByReferenceNumber } from "./SearchByReferenceNumber/SearchByReferenceNumber";
import { SearchByFilters } from "./SearchByFilters/SearchByFilters";
import {
  ApplicationCustomSearchInterface,
  ApplicationDetailsInterface,
  ApplicationsStore,
  FC_GetApplicationByDates,
  FC_GetApplicationByReferenceNumber,
  FC_GetCustomSearchResults,
  FC_SetApplications,
} from "../../actions/applications";

interface ApplicationsListProps {
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
  FC_GetApplicationByDates: (
    starting_date: string,
    ending_date: string,
    callback: (loading: boolean, msg: string) => void
  ) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_SetError: (msg: string) => void;
  FC_SetApplications: (
    applications: ApplicationDetailsInterface[] | null
  ) => void;
}
interface ApplicationsListState {
  loading: boolean;
  menus: "SEARCH_BY_REFERENCE" | "FILTER_APPLICATIONS" | null;
}

class _ApplicationsList extends Component<
  ApplicationsListProps,
  ApplicationsListState
> {
  constructor(props: ApplicationsListProps) {
    super(props);

    this.state = {
      loading: false,
      menus: null,
    };
  }
  render() {
    if (this.state.menus === "SEARCH_BY_REFERENCE") {
      /* Search by reference */
      return (
        <SearchByReferenceNumber
          onGoBack={() => this.setState({ menus: null })}
          FC_GetApplicationByReferenceNumber={
            this.props.FC_GetApplicationByReferenceNumber
          }
          FC_GetCustomSearchResults={this.props.FC_GetCustomSearchResults}
          FC_SetSuccess={this.props.FC_SetSuccess}
          FC_Error={this.props.FC_SetError}
        />
      );
    }
    if (this.state.menus === "FILTER_APPLICATIONS") {
      /* Search by applications list filters */
      return (
        <SearchByFilters
          applications={this.props.applications}
          onGoBack={() => this.setState({ menus: null })}
          FC_GetApplicationByDates={this.props.FC_GetApplicationByDates}
          FC_SetSuccess={this.props.FC_SetSuccess}
          FC_Error={this.props.FC_SetError}
          FC_GetApplicationByReferenceNumber={
            this.props.FC_GetApplicationByReferenceNumber
          }
          FC_SetApplications={this.props.FC_SetApplications}
        />
      );
    }
    return (
      <MainContainer className="mt-3">
        <div className="mb-6">
          <div className="text-2xl text-primary-900 font-extrabold">
            Explore Applications
          </div>
          <div className="text-sm font-light">
            Explore applications with different types of filters
          </div>
        </div>
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
          <div className="col-span-6">
            <div
              onClick={() => this.setState({ menus: "SEARCH_BY_REFERENCE" })}
              className="bg-gray-200 rounded-lg p-4 flex flex-row items-center gap-3 group hover:bg-primary-100 hover:text-primary-800 cursor-pointer animate__animated animate__slideInDown animate__faster"
            >
              <div>
                <MdOutlineAlternateEmail className="text-6xl text-gray-400 group-hover:text-primary-800" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl">
                  By Search keyword
                </span>
                <span className="font-light text-xs">
                  The system provides you access to application details search
                  by application reference number, product brand name, or
                  manufacturer
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <div
              onClick={() => this.setState({ menus: "FILTER_APPLICATIONS" })}
              className="bg-gray-200 rounded-lg p-4 flex flex-row items-center gap-3 group hover:bg-primary-100 hover:text-primary-800 cursor-pointer animate__animated animate__slideInDown animate__faster"
            >
              <div>
                <GrStackOverflow className="text-5xl text-gray-400 group-hover:text-primary-800" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl">
                  Get filtered data
                </span>
                <span className="font-light text-xs">
                  This option provides you a list of applications depending on
                  the selected date ranges and statuses
                </span>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
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

export const ApplicationsList = connect(mapStateToProps, {
  FC_GetApplicationByReferenceNumber,
  FC_GetCustomSearchResults,
  FC_GetApplicationByDates,
  FC_SetSuccess,
  FC_SetApplications,
  FC_SetError,
})(_ApplicationsList);
