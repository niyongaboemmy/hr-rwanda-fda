import React, { Component, Fragment } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import {
  ApplicationCustomSearchInterface,
  ApplicationDetailsInterface,
} from "../../../actions/applications";
import Alert, { AlertType } from "../../../components/Alert/Alert";
import { ApplicationDetails } from "../../../components/ApplicationDetails/ApplicationDetails";
import Loading from "../../../components/Loading/Loading";
import MainContainer from "../../../components/MainContainer/MainContainer";
import Modal, {
  ModalMarginTop,
  ModalSize,
  Themes,
} from "../../../components/Modal/Modal";
import { CustomResultTable } from "./CustomResultTable";

interface SearchByReferenceNumberProps {
  onGoBack: () => void;
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
  FC_Error: (msg: string) => void;
}
interface SearchByReferenceNumberState {
  loading: boolean;
  reference_number: string;
  error: {
    target: "form" | "main";
    msg: string;
  } | null;
  data: ApplicationDetailsInterface | null;
  custom_search_result: ApplicationCustomSearchInterface[] | null;
}

export class SearchByReferenceNumber extends Component<
  SearchByReferenceNumberProps,
  SearchByReferenceNumberState
> {
  constructor(props: SearchByReferenceNumberProps) {
    super(props);

    this.state = {
      loading: false,
      reference_number: "106/2018",
      error: null,
      data: null,
      custom_search_result: null,
    };
  }
  FC_GetApplicationsListByKeyword = (reference_number: string) => {
    this.setState({ loading: true });
    this.props.FC_GetCustomSearchResults(
      reference_number,
      (
        loading: boolean,
        res: ApplicationCustomSearchInterface[] | null,
        msg: string
      ) => {
        console.log("data: ", res);
        this.setState({ loading: loading });
        if (loading === false) {
          this.setState({ custom_search_result: res });
        }
        if (msg !== "") {
          this.setState({
            error: {
              target: "main",
              msg: msg,
            },
          });
        }
      }
    );
  };
  FC_RequestApplicationDetails = (reference_number: string) => {
    this.setState({ loading: true });
    this.props.FC_GetApplicationByReferenceNumber(
      reference_number,
      (
        loading: boolean,
        res: ApplicationDetailsInterface | null,
        msg: string
      ) => {
        console.log("data: ", res);
        this.setState({ loading: loading });
        if (loading === false) {
          this.setState({ data: res, custom_search_result: null });
        }
        if (msg !== "") {
          this.setState({
            error: {
              target: "main",
              msg: msg,
            },
          });
        }
      }
    );
  };
  SearchDataByReferenceNumber = async (application_ref_number: string) => {
    if (application_ref_number === "") {
      return this.setState({
        error: {
          target: "form",
          msg: "Please fill reference number of the application",
        },
      });
    }
    this.FC_RequestApplicationDetails(application_ref_number);
  };
  SearchResultsByKeyword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.reference_number === "") {
      return this.setState({
        error: {
          target: "form",
          msg: "Please fill search keyword for the application",
        },
      });
    }
    this.FC_GetApplicationsListByKeyword(this.state.reference_number);
  };
  render() {
    return (
      <Fragment>
        <div>
          {/* Search box */}
          <MainContainer className="mt-3 animate__animated animate__fadeIn">
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
              <div className="col-span-6 flex flex-row items-center gap-3">
                <div className="">
                  <div
                    onClick={this.props.onGoBack}
                    className={`bg-gray-100 cursor-pointer hover:bg-primary-100 hover:text-primary-800 flex items-center justify-center h-10 w-10 rounded-full`}
                  >
                    <BsArrowLeft className="text-3xl" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold">
                    Get Application by keyword
                  </span>
                  <span className="text-xs text-gray-600">
                    Searching for an application using application reference
                    number, manufacturer name or product name
                  </span>
                </div>
              </div>
              <form
                onSubmit={this.SearchResultsByKeyword}
                className="col-span-6 flex flex-row items-end justify-end gap-3"
              >
                <div className="flex flex-col w-full">
                  <span className="text-sm">Type search keyword</span>
                  <input
                    type="text"
                    value={this.state.reference_number}
                    onChange={(e) => {
                      this.setState({
                        reference_number: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border-2 font-light ${
                      this.state.error?.target === "form"
                        ? "border-red-600"
                        : "border-primary-800"
                    } w-full text-sm`}
                    placeholder="Reference number or Manufacture or Product name"
                  />
                </div>
                <button
                  type="submit"
                  className="flex flex-row items-center justify-center gap-2 font-normal px-3 py-2 rounded-md cursor-pointer text-white bg-primary-800 hover:bg-primary-900"
                >
                  <div>
                    {this.state.loading === true ? (
                      <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                    ) : (
                      <RiSearchLine className="text-xl" />
                    )}
                  </div>
                  <span>Search</span>
                </button>
              </form>
            </div>
            {this.state.error !== null && (
              <div className="w-full mt-3">
                {this.state.error.msg !== "" && (
                  <Alert
                    alertType={AlertType.DANGER}
                    title={
                      this.state.error.target === "form"
                        ? "Invalid input!"
                        : "Error Occurred"
                    }
                    description={this.state.error.msg}
                    close={() => {
                      this.setState({
                        error: null,
                      });
                    }}
                  />
                )}
              </div>
            )}
          </MainContainer>
          {this.state.loading === true && (
            <MainContainer className="mt-2">
              <Loading />
              <div className="ml-4 -mt-10 text-xl font-light animate-pulse">
                Loading, please wait...
              </div>
            </MainContainer>
          )}
          {this.state.loading === false && this.state.data !== null && (
            <MainContainer className="mt-2">
              <ApplicationDetails
                data={this.state.data}
                modal={false}
                onClose={() => {}}
                source="search"
                onUpdate={(reference_number: string) => {
                  this.setState({ reference_number: reference_number });
                  this.FC_RequestApplicationDetails(reference_number);
                }}
                FC_SetSuccess={this.props.FC_SetSuccess}
                FC_Error={this.props.FC_Error}
              />
            </MainContainer>
          )}
        </div>
        {this.state.custom_search_result !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => {
              this.state.loading === false &&
                this.setState({ custom_search_result: null });
            }}
            backDropClose={true}
            widthSizeClass={ModalSize.maxWidth}
            displayClose={false}
            padding={{
              title: undefined,
              body: true,
              footer: undefined,
            }}
            marginTop={ModalMarginTop.small}
          >
            <CustomResultTable
              loading={this.state.loading}
              custom_search_result={this.state.custom_search_result}
              search_keyword={this.state.reference_number}
              onSelect={this.SearchDataByReferenceNumber}
              GoBack={() => {
                this.setState({ custom_search_result: null });
              }}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}
