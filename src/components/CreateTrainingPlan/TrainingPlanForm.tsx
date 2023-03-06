import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineExpandMore } from "react-icons/md";
import { connect } from "react-redux";
import {
  CreateTrainingPlanData,
  DivisionItem,
  FC_CreateTrainingPlan,
  FC_GetSystemInfo,
  FC_GetTrainingOfferModes,
  FC_UpdateTrainingPlan,
  System,
  TrainingOfferModeItem,
  UpdateTrainingPlanData,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import { NoResultFound } from "../Fragments/NoResultFound";
import LoaderComponent from "../Loading/LoaderComponent";
import SelectCustom from "../SelectCustom/SelectCustom";

export interface TrainingPlanTempData {
  training_plan_id: string;
  title: string;
  selectedDivision: DivisionItem | null;
  training_offer_modes: TrainingOfferModeItem[];
  allocated_budget: string;
  budget_source: string;
  start_date: string;
  year: string;
}

interface TrainingPlanFormProps {
  system: System;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
  FC_GetTrainingOfferModes: (callback: (loading: boolean) => void) => void;
  FC_CreateTrainingPlan: (
    data: CreateTrainingPlanData,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
        training_plan_id: string;
      } | null
    ) => void
  ) => void;
  onSubmit: (data: TrainingPlanTempData) => void;
  temp_data?: TrainingPlanTempData;
  FC_UpdateTrainingPlan: (
    data: UpdateTrainingPlanData,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
        training_plan_id: string;
      } | null
    ) => void
  ) => void;
}
interface TrainingPlanFormState {
  loading: boolean;
  title: string;
  selectedDivision: DivisionItem | null;
  training_offer_modes: TrainingOfferModeItem[];
  allocated_budget: string;
  budget_source: string;
  start_date: string;
  year: string;
  openSelectDivision: boolean;
  formError: {
    target:
      | "title"
      | "training_offer_mode_id"
      | "allocated_budget"
      | "budget_source"
      | "start_date"
      | "selectedDivision"
      | "main";
    msg: string;
  } | null;
  formLoading: boolean;
  success: string;
}

export class _TrainingPlanForm extends Component<
  TrainingPlanFormProps,
  TrainingPlanFormState
> {
  constructor(props: TrainingPlanFormProps) {
    super(props);

    this.state = {
      loading: false,
      allocated_budget:
        this.props.temp_data !== undefined
          ? this.props.temp_data.allocated_budget
          : "",
      budget_source:
        this.props.temp_data !== undefined
          ? this.props.temp_data.budget_source
          : "",
      selectedDivision:
        this.props.temp_data !== undefined
          ? this.props.temp_data.selectedDivision
          : null,
      start_date:
        this.props.temp_data !== undefined
          ? this.props.temp_data.start_date
          : "",
      title:
        this.props.temp_data !== undefined ? this.props.temp_data.title : "",
      training_offer_modes:
        this.props.temp_data !== undefined
          ? this.props.temp_data.training_offer_modes
          : [],
      year:
        this.props.temp_data !== undefined
          ? this.props.temp_data.year
          : new Date().getFullYear().toString(),
      openSelectDivision: false,
      formError: null,
      formLoading: false,
      success: "",
    };
  }
  GetAllBasicInfo = () => {
    this.setState({ loading: true });
    this.props.FC_GetSystemInfo((loading: boolean) =>
      this.setState({ loading: loading })
    );
  };
  GetTrainingOfferModes = () => {
    this.props.FC_GetTrainingOfferModes((loading: boolean) =>
      this.setState({ loading: loading })
    );
  };
  UpdateTrainingPlan = (data: UpdateTrainingPlanData) => {
    this.props.FC_UpdateTrainingPlan(
      data,
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          training_plan_id: string;
        } | null
      ) => {
        if (res?.type === "error") {
          this.setState({
            formError: { target: "main", msg: res.msg },
            formLoading: false,
          });
        }
        if (res?.type === "success") {
          this.setState({
            formError: null,
            success: "Training Plan created successfully",
          });
          setTimeout(() => {
            this.setState({
              formLoading: loading,
            });
            // onSubmit
            this.props.onSubmit({
              allocated_budget: this.state.allocated_budget,
              budget_source: this.state.budget_source,
              selectedDivision: this.state.selectedDivision,
              start_date: this.state.start_date,
              title: this.state.title,
              training_offer_modes: this.state.training_offer_modes,
              training_plan_id: res.training_plan_id,
              year: this.state.year,
            });
          }, 2000);
        }
      }
    );
  };
  SubmitFormData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.title === "") {
      return this.setState({
        formError: {
          target: "title",
          msg: "Please type the title",
        },
      });
    }
    if (this.state.selectedDivision === null) {
      return this.setState({
        formError: {
          target: "selectedDivision",
          msg: "Please select division",
        },
      });
    }
    if (this.state.training_offer_modes.length === 0) {
      return this.setState({
        formError: {
          target: "training_offer_mode_id",
          msg: "Please add training offer modes",
        },
      });
    }
    if (this.state.allocated_budget === "") {
      return this.setState({
        formError: {
          target: "allocated_budget",
          msg: "Please add allocated budget",
        },
      });
    }
    if (this.state.budget_source === "") {
      return this.setState({
        formError: {
          target: "budget_source",
          msg: "Please type source of budget",
        },
      });
    }
    this.setState({ formLoading: true });
    const formData: CreateTrainingPlanData = {
      allocated_budget: parseInt(this.state.allocated_budget),
      budget_source: this.state.budget_source,
      division_id: this.state.selectedDivision.division_id,
      title: this.state.title,
      training_offer_mode_id: JSON.stringify(this.state.training_offer_modes),
      year: parseInt(this.state.year),
    };
    if (this.props.temp_data !== undefined) {
      this.UpdateTrainingPlan({
        allocated_budget: parseInt(this.state.allocated_budget),
        budget_source: this.state.budget_source,
        division_id: this.state.selectedDivision.division_id,
        title: this.state.title,
        training_offer_mode_id: JSON.stringify(this.state.training_offer_modes),
        year: parseInt(this.state.year),
        training_plan_id: this.props.temp_data.training_plan_id,
      });
    } else {
      this.props.FC_CreateTrainingPlan(
        formData,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            training_plan_id: string;
          } | null
        ) => {
          if (res?.type === "error") {
            this.setState({
              formError: { target: "main", msg: res.msg },
              formLoading: false,
            });
          }
          if (res?.type === "success") {
            this.setState({
              formError: null,
              success: "Training Plan created successfully",
            });
            setTimeout(() => {
              this.setState({
                formLoading: loading,
              });
              // onSubmit
              this.props.onSubmit({
                allocated_budget: this.state.allocated_budget,
                budget_source: this.state.budget_source,
                selectedDivision: this.state.selectedDivision,
                start_date: this.state.start_date,
                title: this.state.title,
                training_offer_modes: this.state.training_offer_modes,
                training_plan_id: res.training_plan_id,
                year: this.state.year,
              });
            }, 2000);
          }
        }
      );
    }
  };
  componentDidMount = () => {
    if (
      this.props.system.basic_info === null ||
      this.props.system.basic_info.division.length === 0
    ) {
      this.GetAllBasicInfo();
    }
    if (
      this.props.system.basic_info === null ||
      this.props.system.basic_info.training_offer_modes.length === 0
    ) {
      this.GetTrainingOfferModes();
    }
  };
  render() {
    if (this.state.loading === true || this.props.system.basic_info === null) {
      return (
        <div>
          <LoaderComponent />
        </div>
      );
    }
    return (
      <div>
        <div className="border-t p-3 mt-3">
          <form className="w-full" onSubmit={this.SubmitFormData}>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6">
                <div className="">
                  <div className="mb-1 text-sm">Training title</div>
                  <textarea
                    className="bg-gray-100 rounded-md w-full px-3 py-2 font-semibold"
                    style={{ minHeight: "120px" }}
                    value={this.state.title}
                    onChange={(e) =>
                      this.setState({ title: e.target.value, formError: null })
                    }
                    disabled={this.state.formLoading}
                  />
                  {this.state.formError !== null &&
                    this.state.formError.target === "title" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="relative w-full mb-3">
                  <div className="mb-1 text-sm">Choose division</div>
                  <div
                    onClick={() =>
                      this.setState({
                        openSelectDivision: !this.state.openSelectDivision,
                      })
                    }
                    className={`${
                      this.state.selectedDivision !== null
                        ? "bg-primary-50 text-primary-800 animate__animated animate__fadeIn"
                        : "bg-gray-100"
                    }  rounded-md px-2 py-2 pl-3 font-semibold w-full flex flex-row items-center justify-between gap-2 cursor-pointer`}
                  >
                    <div>
                      {this.state.selectedDivision === null
                        ? "Division"
                        : this.state.selectedDivision.division_name}
                    </div>
                    <div>
                      <MdOutlineExpandMore className="text-xl" />
                    </div>
                  </div>
                  {this.state.openSelectDivision === true && (
                    <div className="absolute pt-2 w-full animate__animated animate__fadeInUp animate__faster">
                      <SelectCustom
                        loading={false}
                        id={"division_id"}
                        title={"division_name"}
                        close={() =>
                          this.setState({ openSelectDivision: false })
                        }
                        data={this.props.system.basic_info.division}
                        click={(data: DivisionItem) => {
                          this.state.formLoading === false &&
                            this.setState({
                              selectedDivision: data,
                              openSelectDivision: false,
                              formError: null,
                            });
                        }}
                      />
                    </div>
                  )}
                  {this.state.formError !== null &&
                    this.state.formError.target === "selectedDivision" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                </div>
                <div className="">
                  <div className="mb-1 text-sm">Year</div>
                  <input
                    type={"text"}
                    className="bg-gray-100 rounded-md w-full px-3 py-2 font-bold"
                    value={this.state.year}
                    onChange={(e) =>
                      this.setState({ year: e.target.value, formError: null })
                    }
                    disabled={true}
                  />
                  {this.state.formError !== null &&
                    this.state.formError.target === "main" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="">
                  <div className="mb-1 text-sm">Training Offer Modes</div>
                  <select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        const SelectedTrainingOffer =
                          this.props.system.basic_info === null
                            ? undefined
                            : this.props.system.basic_info.training_offer_modes.find(
                                (itm) =>
                                  itm.training_offer_mode_id.toString() ===
                                  e.target.value
                              );
                        if (SelectedTrainingOffer !== undefined) {
                          this.setState({
                            training_offer_modes: [
                              ...this.state.training_offer_modes.filter(
                                (itm) =>
                                  itm.training_offer_mode_id !==
                                  SelectedTrainingOffer.training_offer_mode_id
                              ),
                              SelectedTrainingOffer,
                            ],
                          });
                        }
                      }
                    }}
                    value={""}
                    className="bg-gray-100 rounded-md px-3 py-2 w-full mb-2"
                  >
                    <option value="">Choose training offer</option>
                    {this.props.system.basic_info.training_offer_modes.map(
                      (item, i) => (
                        <option key={i + 1} value={item.training_offer_mode_id}>
                          {item.offer_mode}
                        </option>
                      )
                    )}
                  </select>
                  <div>
                    {this.state.training_offer_modes.length === 0 ? (
                      <div>
                        <NoResultFound
                          title="Training offer modes"
                          description="No training offer modes added"
                        />
                      </div>
                    ) : (
                      <div>
                        <table className="text-sm text-left w-full">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 border">#</th>
                              <th className="px-3 py-2 border">Name</th>
                              <th className="px-3 py-2 border"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.training_offer_modes.map((item, i) => (
                              <tr key={i + 1}>
                                <td className="px-3 py-2 border">{i + 1}</td>
                                <td className="px-3 py-2 border">
                                  {item.offer_mode}
                                </td>
                                <td className="px-1 py-1 border w-10">
                                  <div
                                    onClick={() =>
                                      this.setState({
                                        training_offer_modes:
                                          this.state.training_offer_modes.filter(
                                            (itm) =>
                                              itm.training_offer_mode_id !==
                                              item.training_offer_mode_id
                                          ),
                                      })
                                    }
                                    className="px-3 py-2 text-sm font-semibold cursor-pointer bg-red-100 text-red-700 hover:bg-red-600 hover:text-white w-max rounded-md"
                                  >
                                    Remove
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  {this.state.formError !== null &&
                    this.state.formError.target ===
                      "training_offer_mode_id" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="mb-3">
                  <div className="mb-1 text-sm">Allocated budget</div>
                  <input
                    type={"text"}
                    className="bg-gray-100 rounded-md w-full px-3 py-2 font-semibold"
                    value={this.state.allocated_budget}
                    onChange={(e) =>
                      this.setState({
                        allocated_budget: e.target.value,
                        formError: null,
                      })
                    }
                    disabled={this.state.formLoading}
                  />
                  {this.state.formError !== null &&
                    this.state.formError.target === "allocated_budget" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                </div>
                <div className="">
                  <div className="mb-1 text-sm">Source of budget</div>
                  <input
                    type={"text"}
                    className="bg-gray-100 rounded-md w-full px-3 py-2 font-semibold"
                    value={this.state.budget_source}
                    onChange={(e) =>
                      this.setState({
                        budget_source: e.target.value,
                        formError: null,
                      })
                    }
                    disabled={this.state.formLoading}
                  />
                  {this.state.formError !== null &&
                    this.state.formError.target === "budget_source" && (
                      <div className="mt-1">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={this.state.formError.msg}
                          close={() => this.setState({ formError: null })}
                        />
                      </div>
                    )}
                  <div className="mt-5 flex flex-row items-center justify-end w-full">
                    <button
                      type="submit"
                      disabled={this.state.formLoading}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex flex-row items-center gap-2 justify-center"
                    >
                      {this.state.formLoading === true && (
                        <div>
                          <AiOutlineLoading3Quarters className="text-xl text-white animate-spin" />
                        </div>
                      )}
                      <span>
                        {this.state.formLoading === true ? (
                          <span className="animate__animated animate__fadeIn animate__infinite">
                            Saving data...
                          </span>
                        ) : (
                          "Save & Continue"
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({
  system,
}: StoreState): {
  system: System;
} => {
  return { system };
};

export const TrainingPlanForm = connect(mapStateToProps, {
  FC_GetSystemInfo,
  FC_GetTrainingOfferModes,
  FC_CreateTrainingPlan,
  FC_UpdateTrainingPlan,
})(_TrainingPlanForm);
