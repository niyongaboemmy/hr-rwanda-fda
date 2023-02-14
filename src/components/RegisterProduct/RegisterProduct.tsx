import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { IoAddCircleOutline, IoSaveOutline } from "react-icons/io5";
import { FC_RegisterProduct } from "../../actions";
import Alert, { AlertType } from "../Alert/Alert";
import MainContainer from "../MainContainer/MainContainer";

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

export interface RegisterProductDataInterface {
  registration_number: string;
  application_ref_number: string;
  name_of_the_active_ingredient: string;
  therapeutic_indication: string;
  pack_size: string;
  pack_type: string;
  shelf_life_in_month: string;
  storage_statement: string;
  distribution_category: string;
  name_of_marketing_authorization_holder: string;
  date_ma_certificate_issued_to_applicant: string;
  product_category: string;
}

interface RegisterProductProps {
  type: "Edit" | "Add";
  display: "Page" | "Modal";
  editData: RegisterProductDataInterface;
  onBack: () => void;
  onSave: () => void;
}
interface RegisterProductState {
  registration_number: string;
  application_ref_number: string;
  name_of_the_active_ingredient: string;
  therapeutic_indication: string;
  pack_size: string;
  pack_type: string;
  shelf_life_in_month: string;
  storage_statement: string;
  distribution_category: string;
  name_of_marketing_authorization_holder: string;
  date_ma_certificate_issued_to_applicant: string;
  product_category: string;
  loading: boolean;
  success: string;
  error: {
    target:
      | "registration_number"
      | "application_ref_number"
      | "name_of_the_active_ingredient"
      | "therapeutic_indication"
      | "pack_size"
      | "pack_type"
      | "shelf_life_in_month"
      | "storage_statement"
      | "distribution_category"
      | "name_of_marketing_authorization_holder"
      | "date_ma_certificate_issued_to_applicant"
      | "product_category"
      | "main";
    msg: string;
  } | null;
}

export class RegisterProduct extends Component<
  RegisterProductProps,
  RegisterProductState
> {
  constructor(props: RegisterProductProps) {
    super(props);

    this.state = {
      registration_number: this.props.editData.registration_number,
      application_ref_number: this.props.editData.application_ref_number,
      name_of_the_active_ingredient:
        this.props.editData.name_of_the_active_ingredient,
      therapeutic_indication: this.props.editData.therapeutic_indication,
      pack_size: this.props.editData.pack_size,
      pack_type: this.props.editData.pack_type,
      shelf_life_in_month: this.props.editData.shelf_life_in_month,
      storage_statement: this.props.editData.storage_statement,
      distribution_category: this.props.editData.distribution_category,
      name_of_marketing_authorization_holder:
        this.props.editData.name_of_marketing_authorization_holder,
      date_ma_certificate_issued_to_applicant:
        this.props.editData.date_ma_certificate_issued_to_applicant === ""
          ? ""
          : this.props.editData.date_ma_certificate_issued_to_applicant,
      product_category:
        this.props.editData.product_category === null ||
        this.props.editData.product_category === undefined
          ? ""
          : this.props.editData.product_category,
      loading: false,
      success: "",
      error: null,
    };
  }
  saveProductDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.registration_number === "") {
      return this.setState({
        error: {
          target: "registration_number",
          msg: "This field is required",
        },
      });
    }
    if (this.state.name_of_the_active_ingredient === "") {
      return this.setState({
        error: {
          target: "name_of_the_active_ingredient",
          msg: "This field is required",
        },
      });
    }
    if (this.state.therapeutic_indication === "") {
      return this.setState({
        error: {
          target: "therapeutic_indication",
          msg: "This field is required",
        },
      });
    }
    if (this.state.pack_size === "") {
      return this.setState({
        error: {
          target: "pack_size",
          msg: "This field is required",
        },
      });
    }
    if (this.state.pack_type === "") {
      return this.setState({
        error: {
          target: "pack_type",
          msg: "This field is required",
        },
      });
    }
    if (this.state.shelf_life_in_month === "") {
      return this.setState({
        error: {
          target: "shelf_life_in_month",
          msg: "This field is required",
        },
      });
    }
    if (this.state.storage_statement === "") {
      return this.setState({
        error: {
          target: "storage_statement",
          msg: "This field is required",
        },
      });
    }
    if (this.state.distribution_category === "") {
      return this.setState({
        error: {
          target: "distribution_category",
          msg: "This field is required",
        },
      });
    }
    if (this.state.name_of_marketing_authorization_holder === "") {
      return this.setState({
        error: {
          target: "name_of_marketing_authorization_holder",
          msg: "This field is required",
        },
      });
    }
    if (this.state.date_ma_certificate_issued_to_applicant === "") {
      return this.setState({
        error: {
          target: "date_ma_certificate_issued_to_applicant",
          msg: "This field is required",
        },
      });
    }
    if (
      this.state.product_category === "" ||
      this.state.product_category.length < 2
    ) {
      return this.setState({
        error: {
          target: "product_category",
          msg: "Please select product category",
        },
      });
    }
    this.setState({ loading: true });
    // Save the data
    const data: RegisterProductDataInterface = {
      registration_number: this.state.registration_number,
      application_ref_number: this.state.application_ref_number,
      name_of_the_active_ingredient: this.state.name_of_the_active_ingredient,
      therapeutic_indication: this.state.therapeutic_indication,
      pack_size: this.state.pack_size,
      pack_type: this.state.pack_type,
      shelf_life_in_month: this.state.shelf_life_in_month,
      storage_statement: this.state.storage_statement,
      distribution_category: this.state.distribution_category,
      name_of_marketing_authorization_holder:
        this.state.name_of_marketing_authorization_holder,
      date_ma_certificate_issued_to_applicant:
        this.state.date_ma_certificate_issued_to_applicant,
      product_category: this.state.product_category,
    };
    console.log("Submitted data: ", data);
    FC_RegisterProduct(
      data,
      this.props.type === "Add" ? "Add" : "Update",
      (
        loading: boolean,
        feedback: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (feedback !== null) {
          if (feedback.type === "success") {
            this.props.onSave();
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
                  {this.props.type === "Edit" ? (
                    <BsArrowLeft className="text-3xl" />
                  ) : (
                    <IoAddCircleOutline className="text-3xl" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold">
                  {this.props.type === "Edit"
                    ? "Edit the product"
                    : "Register a product"}
                </span>
                <span className="text-xs">
                  Fill the following product details before submit
                </span>
              </div>
            </div>
            <form
              onSubmit={this.saveProductDetails}
              className="grid grid-cols-12 gap-3 w-full"
            >
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Product registration number"
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
                  value={this.state.registration_number}
                  onChange={(value: string) => {
                    this.setState({ registration_number: value, error: null });
                  }}
                  error_key_name={"registration_number"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Name of the active ingredient"
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
                  value={this.state.name_of_the_active_ingredient}
                  onChange={(value: string) => {
                    this.setState({
                      name_of_the_active_ingredient: value,
                      error: null,
                    });
                  }}
                  error_key_name={"name_of_the_active_ingredient"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Therapeutic indication"
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
                  value={this.state.therapeutic_indication}
                  onChange={(value: string) => {
                    this.setState({
                      therapeutic_indication: value,
                      error: null,
                    });
                  }}
                  error_key_name={"therapeutic_indication"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Pack size"
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
                  value={this.state.pack_size}
                  onChange={(value: string) => {
                    this.setState({
                      pack_size: value,
                      error: null,
                    });
                  }}
                  error_key_name={"pack_size"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Packaging type"
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
                  value={this.state.pack_type}
                  onChange={(value: string) => {
                    this.setState({
                      pack_type: value,
                      error: null,
                    });
                  }}
                  error_key_name={"pack_type"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Shelf life in month"
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
                  value={this.state.shelf_life_in_month}
                  onChange={(value: string) => {
                    this.setState({
                      shelf_life_in_month: value,
                      error: null,
                    });
                  }}
                  error_key_name={"shelf_life_in_month"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Storage statement"
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
                  value={this.state.storage_statement}
                  onChange={(value: string) => {
                    this.setState({
                      storage_statement: value,
                      error: null,
                    });
                  }}
                  error_key_name={"storage_statement"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Distribution category"
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
                  value={this.state.distribution_category}
                  onChange={(value: string) => {
                    this.setState({
                      distribution_category: value,
                      error: null,
                    });
                  }}
                  error_key_name={"distribution_category"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Name of marketing authorization holder"
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
                  value={this.state.name_of_marketing_authorization_holder}
                  onChange={(value: string) => {
                    this.setState({
                      name_of_marketing_authorization_holder: value,
                      error: null,
                    });
                  }}
                  error_key_name={"name_of_marketing_authorization_holder"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <FormInput
                  title="Date of certificate issued to applicant"
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
                  value={this.state.date_ma_certificate_issued_to_applicant}
                  onChange={(value: string) => {
                    this.setState({
                      date_ma_certificate_issued_to_applicant: value,
                      error: null,
                    });
                  }}
                  error_key_name={"date_ma_certificate_issued_to_applicant"}
                  onCloseError={() => {
                    this.setState({ error: null, success: "" });
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col w-full">
                <span className="text-sm">
                  Choose product category{" "}
                  {console.log("test : ", this.state.product_category)}
                </span>
                <select
                  className={`border ${
                    this.state.error !== null &&
                    this.state.error.target === "product_category"
                      ? "border-red-600 text-red-600"
                      : "border-primary-800"
                  }  rounded-md px-3 py-2 w-full font-bold mb-2`}
                  value={this.state.product_category}
                  onChange={(e) =>
                    this.setState({
                      product_category: e.target.value,
                      error: null,
                    })
                  }
                >
                  <option value="">Choose product category</option>
                  <option value="Human Medicinal Products">
                    Human Medicinal Products
                  </option>
                  <option value="Human Biological Products">
                    Human Biological Products
                  </option>
                </select>
                {this.state.error !== null &&
                  this.state.error.target === "product_category" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={"Invalid input!"}
                      description={this.state.error.msg}
                      close={() => {
                        this.setState({
                          error: null,
                        });
                      }}
                    />
                  )}
              </div>
              <div className="col-span-6">
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
