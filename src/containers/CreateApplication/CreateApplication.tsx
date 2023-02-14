import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import { connect } from "react-redux";
import { Auth, FC_CreateApplication, System } from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";

export const FormInput = (props: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  type: "text" | "number" | "date";
  disabled: boolean;
  error: {
    target: string;
    msg: string;
  };
  error_key_name: string;
  onCloseError: () => void;
}) => {
  return (
    <div className="w-full">
      <span className="text-sm">{props.title}</span>
      <input
        type={props.type}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        disabled={props.disabled}
        className={`px-3 py-2 rounded-md border font-bold ${
          props.error.target === props.error_key_name
            ? "border-red-600"
            : "border-primary-800"
        } w-full text-sm`}
      />
      {props.error.target === props.error_key_name && (
        <Alert
          alertType={AlertType.DANGER}
          title={
            props.error.target === props.error_key_name
              ? "Invalid input!"
              : "Error Occurred"
          }
          description={props.error.msg}
          close={props.onCloseError}
        />
      )}
    </div>
  );
};

export interface CreateApplicationInterface {
  application_ref_number: string;
  submission_date: string;
  product_brand_name: string;
  product_common_name: string;
  product_strength: string;
  product_dosage_form: string;
  manufacturer_name_and_country: string;
  manufacturing_site_address: string;
  applicant_name: string;
  applicant_address: string;
  local_technical_representative: string;
  date_ma_certificate_issued_to_applicant: string | null;
  registration_Status: string;
  created_by: string;
}

interface CreateApplicationProps {
  auth: Auth;
  system: System;
  type?: "Edit" | "Add";
  display?: "Page" | "Modal";
  editData?: CreateApplicationInterface;
  onBack?: () => void;
  onSave?: () => void;
}
interface CreateApplicationState {
  application_ref_number: string;
  submission_date: string;
  product_brand_name: string;
  product_common_name: string;
  product_strength: string;
  product_dosage_form: string;
  manufacturer_name_and_country: string;
  manufacturing_site_address: string;
  applicant_name: string;
  applicant_address: string;
  local_technical_representative: string;
  date_ma_certificate_issued_to_applicant: string | null;
  registration_Status: string;
  loading: boolean;
  success: string;
  error: {
    target:
      | "application_ref_number"
      | "submission_date"
      | "product_brand_name"
      | "product_common_name"
      | "product_strength"
      | "product_dosage_form"
      | "manufacturer_name_and_country"
      | "manufacturing_site_address"
      | "applicant_name"
      | "applicant_address"
      | "local_technical_representative"
      | "date_ma_certificate_issued_to_applicant"
      | "main";
    msg: string;
  } | null;
}

export class _CreateApplication extends Component<
  CreateApplicationProps,
  CreateApplicationState
> {
  constructor(props: CreateApplicationProps) {
    super(props);

    this.state = {
      applicant_address:
        this.props.editData === undefined
          ? ""
          : this.props.editData.applicant_address,
      application_ref_number:
        this.props.editData === undefined
          ? ""
          : this.props.editData.application_ref_number,
      date_ma_certificate_issued_to_applicant:
        this.props.editData === undefined
          ? ""
          : this.props.editData.date_ma_certificate_issued_to_applicant,
      local_technical_representative:
        this.props.editData === undefined
          ? ""
          : this.props.editData.local_technical_representative,
      manufacturing_site_address:
        this.props.editData === undefined
          ? ""
          : this.props.editData.manufacturing_site_address,
      manufacturer_name_and_country:
        this.props.editData === undefined
          ? ""
          : this.props.editData.manufacturer_name_and_country,
      product_brand_name:
        this.props.editData === undefined
          ? ""
          : this.props.editData.product_brand_name,
      product_common_name:
        this.props.editData === undefined
          ? ""
          : this.props.editData.product_common_name,
      product_dosage_form:
        this.props.editData === undefined
          ? ""
          : this.props.editData.product_dosage_form,
      product_strength:
        this.props.editData === undefined
          ? ""
          : this.props.editData.product_strength,
      registration_Status:
        this.props.editData === undefined
          ? "NOT_SCREENED"
          : this.props.editData.registration_Status,
      submission_date:
        this.props.editData === undefined
          ? ""
          : this.props.editData.submission_date,
      applicant_name:
        this.props.editData === undefined
          ? ""
          : this.props.editData.applicant_name,

      loading: false,
      success: "",
      error: null,
    };
  }
  saveProductDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.applicant_name === "") {
      return this.setState({
        error: {
          target: "applicant_name",
          msg: "This field is required",
        },
      });
    }
    if (this.state.application_ref_number === "") {
      return this.setState({
        error: {
          target: "application_ref_number",
          msg: "This field is required",
        },
      });
    }
    // if (this.state.date_ma_certificate_issued_to_applicant === "") {
    //   return this.setState({
    //     error: {
    //       target: "date_ma_certificate_issued_to_applicant",
    //       msg: "This field is required",
    //     },
    //   });
    // }
    if (this.state.local_technical_representative === "") {
      return this.setState({
        error: {
          target: "local_technical_representative",
          msg: "This field is required",
        },
      });
    }
    if (this.state.manufacturer_name_and_country === "") {
      return this.setState({
        error: {
          target: "manufacturer_name_and_country",
          msg: "This field is required",
        },
      });
    }
    if (this.state.manufacturing_site_address === "") {
      return this.setState({
        error: {
          target: "manufacturing_site_address",
          msg: "This field is required",
        },
      });
    }
    if (this.state.product_brand_name === "") {
      return this.setState({
        error: {
          target: "product_brand_name",
          msg: "This field is required",
        },
      });
    }
    if (this.state.product_common_name === "") {
      return this.setState({
        error: {
          target: "product_common_name",
          msg: "This field is required",
        },
      });
    }
    if (this.state.product_dosage_form === "") {
      return this.setState({
        error: {
          target: "product_dosage_form",
          msg: "This field is required",
        },
      });
    }
    if (this.state.product_strength === "") {
      return this.setState({
        error: {
          target: "product_strength",
          msg: "This field is required",
        },
      });
    }
    if (this.state.submission_date === "") {
      return this.setState({
        error: {
          target: "submission_date",
          msg: "This field is required",
        },
      });
    }
    this.setState({ loading: true });
    // Save the data
    const data: CreateApplicationInterface = {
      applicant_address: this.state.applicant_address,
      application_ref_number: this.state.application_ref_number,
      date_ma_certificate_issued_to_applicant: "null",
      local_technical_representative: this.state.local_technical_representative,
      manufacturing_site_address: this.state.manufacturing_site_address,
      manufacturer_name_and_country: this.state.manufacturer_name_and_country,
      product_brand_name: this.state.product_brand_name,
      product_common_name: this.state.product_common_name,
      product_dosage_form: this.state.product_dosage_form,
      product_strength: this.state.product_strength,
      registration_Status: this.state.registration_Status,
      submission_date: this.state.submission_date,
      applicant_name: this.state.applicant_name,
      created_by:
        this.props.auth.user === null
          ? "No user selected"
          : this.props.auth.user.user_id, //User did the action
    };
    console.log("Submitted data: ", data);
    FC_CreateApplication(
      data,
      this.props.type === undefined || this.props.type === "Add"
        ? "Add"
        : "Update",
      (
        loading: boolean,
        feedback: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (feedback !== null) {
          if (feedback.type === "success") {
            this.setState({ success: feedback.msg, error: null });
            this.props.onSave && this.props.onSave();
          }
          if (feedback.type === "error") {
            this.setState({
              error: {
                target: "main",
                msg: feedback.msg,
              },
            });
          }
        }
      }
    );
  };
  render() {
    return (
      <div>
        <MainContainer className="mt-3 animate__animated animate__fadeIn">
          <div className="">
            <div className="flex flex-row items-center gap-3 mb-3">
              <div className="">
                <div
                  onClick={this.props.onBack}
                  className={`bg-gray-100 cursor-pointer hover:bg-primary-100 hover:text-primary-800 flex items-center justify-center h-10 w-10 rounded-full`}
                >
                  <BsArrowLeft className="text-3xl" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold">
                  {this.props.type === "Edit"
                    ? "Edit the application"
                    : "Create new application"}
                </span>
                <span className="text-xs">
                  Fill the following application details before submit
                </span>
              </div>
            </div>
            <form
              onSubmit={this.saveProductDetails}
              className="grid grid-cols-6 md:grid-cols-12 gap-3 w-full"
            >
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Applicant name"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.applicant_name}
                  onChange={(value: string) => {
                    this.setState({ applicant_name: value, error: null });
                  }}
                  error_key_name={"applicant_name"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Reference number"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.application_ref_number}
                  onChange={(value: string) => {
                    this.setState({
                      application_ref_number: value,
                      error: null,
                    });
                  }}
                  error_key_name={"application_ref_number"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Applicant address"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.applicant_address}
                  onChange={(value: string) => {
                    this.setState({
                      applicant_address: value,
                      error: null,
                    });
                  }}
                  error_key_name={"applicant_address"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Local technical representative"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.local_technical_representative}
                  onChange={(value: string) => {
                    this.setState({
                      local_technical_representative: value,
                      error: null,
                    });
                  }}
                  error_key_name={"local_technical_representative"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Manufacturer name and country"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.manufacturer_name_and_country}
                  onChange={(value: string) => {
                    this.setState({
                      manufacturer_name_and_country: value,
                      error: null,
                    });
                  }}
                  error_key_name={"manufacturer_name_and_country"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Manufacturing site address"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.manufacturing_site_address}
                  onChange={(value: string) => {
                    this.setState({
                      manufacturing_site_address: value,
                      error: null,
                    });
                  }}
                  error_key_name={"manufacturing_site_address"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Product brand name"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.product_brand_name}
                  onChange={(value: string) => {
                    this.setState({
                      product_brand_name: value,
                      error: null,
                    });
                  }}
                  error_key_name={"product_brand_name"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="product common name"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.product_common_name}
                  onChange={(value: string) => {
                    this.setState({
                      product_common_name: value,
                      error: null,
                    });
                  }}
                  error_key_name={"product_common_name"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Product dosage form and appearance"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.product_dosage_form}
                  onChange={(value: string) => {
                    this.setState({
                      product_dosage_form: value,
                      error: null,
                    });
                  }}
                  error_key_name={"product_dosage_form"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Product strength"
                  type="text"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.product_strength}
                  onChange={(value: string) => {
                    this.setState({
                      product_strength: value,
                      error: null,
                    });
                  }}
                  error_key_name={"product_strength"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Submission date"
                  type="date"
                  disabled={this.state.loading}
                  error={
                    this.state.error === null
                      ? {
                          target: "",
                          msg: "",
                        }
                      : this.state.error
                  }
                  value={this.state.submission_date}
                  onChange={(value: string) => {
                    this.setState({
                      submission_date: value,
                      error: null,
                    });
                  }}
                  error_key_name={"submission_date"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6">
                {this.state.success !== "" && (
                  <div className="w-full mt-3">
                    {
                      <Alert
                        alertType={AlertType.SUCCESS}
                        title={"Action done successfully"}
                        description={this.state.success}
                        close={() => {
                          this.setState({
                            error: null,
                          });
                        }}
                      />
                    }
                  </div>
                )}
                {this.state.error !== null &&
                  this.state.error.target === "main" && (
                    <div className="w-full mt-3">
                      {this.state.error.msg !== "" && (
                        <Alert
                          alertType={AlertType.DANGER}
                          title={
                            this.state.error.target === "main"
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
                <button
                  type="submit"
                  className="flex flex-row items-center justify-center gap-2 font-normal px-3 py-2 rounded-md cursor-pointer text-white bg-primary-800 hover:bg-primary-900 mt-5"
                >
                  <div>
                    {this.state.loading === true ? (
                      <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                    ) : (
                      <IoSaveOutline className="text-xl" />
                    )}
                  </div>
                  <span>
                    {this.state.loading === true
                      ? "Loading, please wait..."
                      : "Save changes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </MainContainer>
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

export const CreateApplication = connect(
  mapStateToProps,
  {}
)(_CreateApplication);
