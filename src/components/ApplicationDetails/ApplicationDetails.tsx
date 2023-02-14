import React, { Component } from "react";
import {
  ApplicationDetailsInterface,
  AssessmentOutcomeValues,
  DownloadCertificate,
  PeerReviewStatusValues,
  RegistrationStates,
} from "../../actions";
import Assessment from "./Assessment";
import PeerReview from "./PeerReview";
import Screening from "./Screening";
import { ScreeningDetails } from "./details/ScreeningDetails";
import { PeerReviewDetails } from "./details/PeerReviewDetails";
import { AssessmentDetails } from "./details/AssessmentDetails";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdAddTask } from "react-icons/md";
import { RegisterProduct } from "../RegisterProduct/RegisterProduct";
import { ApplicationStatus } from "./ApplicationStatus";
import { ApplicationDetailsDashboard } from "./ApplicationDetailsDashboard/ApplicationDetailsDashboard";
import {
  CreateApplication,
  CreateApplicationInterface,
} from "../../containers/CreateApplication/CreateApplication";
import { DATE } from "../../utils/functions";

export const getOutcomeValues = (status_value: any) => {
  if (status_value === AssessmentOutcomeValues.NR) {
    return "NOT RECOMMENDED";
  }
  if (status_value === AssessmentOutcomeValues.OG) {
    return "ONGOING ASSESSMENT";
  }
  if (status_value === AssessmentOutcomeValues.R) {
    return "RECOMMENDED";
  }
  return status_value;
};

interface ApplicationDetailsProps {
  data: ApplicationDetailsInterface;
  modal: boolean;
  onClose: () => void;
  source: "search" | "list";
  onUpdate: (reference_number: string) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_Error: (msg: string) => void;
}

interface ApplicationDetailsState {
  open_screening: boolean;
  open_peer_review: boolean;
  open_assessment: boolean;
  loading: boolean;
  register_product: boolean;
  edit_application: CreateApplicationInterface | null;
}

export class ApplicationDetails extends Component<
  ApplicationDetailsProps,
  ApplicationDetailsState
> {
  constructor(props: ApplicationDetailsProps) {
    super(props);

    this.state = {
      open_screening: false,
      open_peer_review: false,
      open_assessment: false,
      loading: false,
      register_product: false,
      edit_application: null,
    };
  }
  DownloadRegistrationCertificate = () => {
    this.setState({ loading: true });
    DownloadCertificate(
      this.props.data.application_ref_number,
      (
        loading: boolean,
        feedback: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loading: loading });
        if (feedback?.type === "success") {
          this.props.FC_SetSuccess(
            feedback.msg === ""
              ? "Certificate downloaded successfully!"
              : feedback.msg
          );
        } else {
          if (feedback?.type === "error") {
            if (feedback.msg === "") {
              alert("Failed to download, please try again!");
            } else {
              alert(feedback.msg);
            }
          }
        }
      }
    );
  };
  render() {
    if (this.state.edit_application !== null) {
      return (
        <CreateApplication
          editData={this.state.edit_application}
          display={"Page"}
          onBack={() => this.setState({ edit_application: null })}
          onSave={() => {
            this.props.onUpdate(
              this.state.edit_application!.application_ref_number
            );
            this.props.FC_SetSuccess(
              `Data of ${
                this.state.edit_application!.application_ref_number
              } application has updated successfully!`
            );
            this.setState({ edit_application: null });
          }}
          type={"Edit"}
        />
      );
    }
    if (this.state.open_screening === true) {
      return (
        <ScreeningDetails
          data={this.props.data}
          openScreeningDetails={(status: boolean) =>
            this.setState({ open_screening: status })
          }
          onSave={(reference_number: string) => {
            this.setState({ open_screening: false });
            this.props.onUpdate(reference_number);
            this.props.FC_SetSuccess(
              `Screening data of ${reference_number} application has updated successfully!`
            );
          }}
          modal={this.props.modal}
        />
      );
    }
    if (this.state.open_peer_review === true) {
      return (
        <PeerReviewDetails
          data={this.props.data}
          openPeerReviewDetails={(status: boolean) =>
            this.setState({ open_peer_review: status })
          }
          onSave={(reference_number: string) => {
            this.setState({ open_peer_review: false });
            this.props.onUpdate(reference_number);
            this.props.FC_SetSuccess(
              `Peer review data of ${reference_number} application has updated successfully!`
            );
          }}
          modal={this.props.modal}
        />
      );
    }
    if (this.state.open_assessment === true) {
      return (
        <AssessmentDetails
          data={this.props.data}
          openAssessmentDetails={(status: boolean) =>
            this.setState({ open_assessment: status })
          }
          onSave={(reference_number: string) => {
            this.setState({ open_screening: false });
            this.props.onUpdate(reference_number);
            this.props.FC_SetSuccess(
              `Assessment Outcome for ${reference_number} application has updated successfully!`
            );
          }}
        />
      );
    }
    if (this.state.register_product === true) {
      return (
        <RegisterProduct
          type={"Add"}
          display={this.props.modal === true ? "Modal" : "Page"}
          editData={{
            application_ref_number: this.props.data.application_ref_number,
            distribution_category: "",
            name_of_marketing_authorization_holder: "",
            name_of_the_active_ingredient: "",
            pack_size: "",
            pack_type: "",
            registration_number: "",
            shelf_life_in_month: "",
            storage_statement: "",
            therapeutic_indication: "",
            date_ma_certificate_issued_to_applicant: "",
            product_category: "",
          }}
          onBack={() => this.setState({ register_product: false })}
          onSave={() => {
            this.setState({ register_product: false });
            this.props.onUpdate(this.props.data.application_ref_number);
            this.props.FC_SetSuccess(
              `Product for ${this.props.data.application_ref_number} has been registered successfully!`
            );
          }}
        />
      );
    }
    return (
      <div className="animate__animated animate__fadeIn">
        <div className="mb-3">
          <ApplicationDetailsDashboard
            data={this.props.data}
            modal={this.props.modal}
            onGoBack={() => {
              this.props.onClose();
            }}
          />
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-6 pr-5">
            <div className="text-xl font-extrabold mb-3 flex flex-row items-center justify-between">
              <span>Application details</span>
              <div
                onClick={() =>
                  this.setState({
                    edit_application: {
                      applicant_address:
                        this.props.data.applicant_address === null
                          ? ""
                          : this.props.data.applicant_address,
                      applicant_name: this.props.data.applicant_name,
                      application_ref_number:
                        this.props.data.application_ref_number,
                      created_by: "1",
                      date_ma_certificate_issued_to_applicant: "null",
                      local_technical_representative:
                        this.props.data.local_technical_representative,
                      manufacturer_name_and_country:
                        this.props.data.manufacturer_name_and_country,
                      manufacturing_site_address:
                        this.props.data.manufacturing_site_address === null
                          ? ""
                          : this.props.data.manufacturing_site_address,
                      product_brand_name: this.props.data.product_brand_name,
                      product_common_name: this.props.data.product_common_name,
                      product_dosage_form: this.props.data.product_dosage_form,
                      product_strength: this.props.data.product_strength,
                      registration_Status: this.props.data.registration_Status,
                      submission_date: this.props.data.submission_date,
                    },
                  })
                }
                className="bg-primary-100 text-primary-900 hover:text-white hover:bg-primary-800 rounded font-bold text-sm w-max px-3 py-2 cursor-pointer"
              >
                Edit application
              </div>
            </div>
            {/* Other data */}
            <div className="animate__animated animate__fadeIn">
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Reference Number</span>
                <div className="rounded-xl px-2 border border-white font-semibold bg-primary-100 text-primary-900 w-max text-sm">
                  {this.props.data.application_ref_number}
                </div>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Submission date</span>
                <div className="rounded-xl px-2 border border-white font-semibold bg-primary-100 text-primary-900 w-max text-sm">
                  {DATE(this.props.data.submission_date)}
                </div>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Applicant Names</span>
                <span className="text-sm font-semibold">
                  {this.props.data.applicant_name}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Brand Name</span>
                <span className="text-sm font-semibold">
                  {this.props.data.product_brand_name}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Product common name</span>
                <span className="text-sm font-semibold">
                  {this.props.data.product_common_name}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">
                  Country of manufacturer
                </span>
                <span className="text-sm font-semibold">
                  {this.props.data.manufacturer_name_and_country}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">Product strength</span>
                <span className="text-sm font-semibold">
                  {this.props.data.product_strength}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">
                  Product dosage form and appearance
                </span>
                <span className="text-sm font-semibold">
                  {this.props.data.product_dosage_form}
                </span>
              </div>
              <div className="flex flex-col my-3 bg-gray-100 rounded-lg px-2 py-2">
                <span className="text-sm font-light">
                  Local Technical Representative (LTR)
                </span>
                <span className="text-sm font-semibold">
                  {this.props.data.local_technical_representative}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="text-xl font-extrabold mb-3">The progress</div>
            {/* Details here */}
            <div className="flex flex-col gap-3 w-full">
              <ApplicationStatus data={this.props.data} />
              <Screening
                data={this.props.data}
                openScreeningDetails={(status: boolean) =>
                  this.setState({ open_screening: status })
                }
              />
              <Assessment
                data={this.props.data}
                openAssessmentDetails={(status: boolean) =>
                  this.setState({ open_assessment: status })
                }
              />
              <PeerReview
                data={this.props.data}
                openPeerReview={(status: boolean) =>
                  this.setState({ open_peer_review: status })
                }
              />
              <div className="flex flex-row items-center justify-between gap-3 my-4 border rounded-md px-4 py-3 bg-gray-100">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold">
                    Application registration status
                  </span>
                  {this.props.data.registration_Status ===
                  RegistrationStates.REGISTERED ? (
                    <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-green-50 text-green-700 border border-green-400 font-bold text-xs pr-3 w-max">
                      <div>
                        <IoMdCheckmarkCircle className="text-2xl" />
                      </div>
                      <div>{this.props.data.registration_Status}</div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-gray-50 text-gray-700 border border-gray-300 font-bold text-xs pr-3 w-max">
                      <div>
                        <RiErrorWarningLine className="text-2xl animate-pulse" />
                      </div>
                      <div>
                        {getOutcomeValues(this.props.data.registration_Status)}
                      </div>
                    </div>
                  )}
                </div>
                {this.props.data.registration_Status ===
                  RegistrationStates.REGISTERED && (
                  <div
                    onClick={() => {
                      this.DownloadRegistrationCertificate();
                    }}
                    className="flex flex-row items-center justify-center gap-2 px-3 py-2 rounded-md cursor-pointer bg-white hover:bg-green-600 text-green-700 hover:text-white font-bold text-sm border border-green-600 w-max"
                  >
                    <div>
                      {this.state.loading === true ? (
                        <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                      ) : (
                        <HiOutlineDownload className="text-2xl" />
                      )}
                    </div>
                    <span>Registration Certificate</span>
                  </div>
                )}
                {this.props.data.registration_Status !==
                  RegistrationStates.REGISTERED &&
                  this.props.data.peerreviews.length > 0 &&
                  this.props.data.peerreviews[
                    this.props.data.peerreviews.length - 1
                  ].status.toUpperCase() ===
                    PeerReviewStatusValues.approved.toUpperCase() && (
                    <div
                      onClick={() => {
                        this.setState({ register_product: true });
                      }}
                      className="flex flex-row items-center justify-center gap-2 px-3 py-2 rounded-md cursor-pointer bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm w-max"
                    >
                      <div>
                        {this.state.loading === true ? (
                          <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                        ) : (
                          <MdAddTask className="text-2xl" />
                        )}
                      </div>
                      <span>Register product now</span>
                    </div>
                  )}
              </div>
            </div>
            {
              <div className="mt-8 flex flex-row justify-end">
                {/* <div
                  onClick={() =>
                    this.setState({
                      edit_application: {
                        applicant_address:
                          this.props.data.applicant_address === null
                            ? ""
                            : this.props.data.applicant_address,
                        applicant_name: this.props.data.applicant_name,
                        application_ref_number:
                          this.props.data.application_ref_number,
                        created_by: "1",
                        date_ma_certificate_issued_to_applicant: "null",
                        local_technical_representative:
                          this.props.data.local_technical_representative,
                        manufacturer_name_and_country:
                          this.props.data.manufacturer_name_and_country,
                        manufacturing_site_address:
                          this.props.data.manufacturing_site_address === null
                            ? ""
                            : this.props.data.manufacturing_site_address,
                        product_brand_name: this.props.data.product_brand_name,
                        product_common_name:
                          this.props.data.product_common_name,
                        product_dosage_form:
                          this.props.data.product_dosage_form,
                        product_strength: this.props.data.product_strength,
                        registration_Status:
                          this.props.data.registration_Status,
                        submission_date: this.props.data.submission_date,
                      },
                    })
                  }
                  className="bg-primary-100 text-primary-900 hover:text-white hover:bg-primary-800 rounded font-bold text-sm w-max px-3 py-2 cursor-pointer"
                >
                  Edit application
                </div> */}
                {this.props.modal === true && (
                  <div
                    onClick={this.props.onClose}
                    className="bg-gray-500 text-white hover:bg-gray-600 rounded font-bold text-sm w-max px-3 py-2 cursor-pointer"
                  >
                    Close window
                  </div>
                )}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
