import React, { Component, Fragment } from "react";
import { BsCalendar2Check, BsFilterCircle } from "react-icons/bs";
import { IoIosAddCircleOutline, IoMdRefreshCircle } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  FC_GetTrainingPlansByYear,
  TrainingPlanListInterface,
  TrainingStore,
  UnitInterface,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import { CreateTrainingPlan } from "../../components/CreateTrainingPlan/CreateTrainingPlan";
import { TrainingPlanTempData } from "../../components/CreateTrainingPlan/TrainingPlanForm";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import SearchInput from "../../components/Fragments/SearchInput";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import MainContainer from "../../components/MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { PositionItemLoading } from "../../components/PositionItem/PositionItemLoading";
import { SelectUnit } from "../../components/SelectUnit/SelectUnit";
import { StoreState } from "../../reducers";
import { commaFy, search } from "../../utils/functions";

interface TrainingPlansProps {
  auth: Auth;
  training: TrainingStore;
  FC_GetTrainingPlansByYear: (
    year: number,
    callback: (loading: boolean, error: string) => void
  ) => void;
}
interface TrainingPlansState {
  loading: boolean;
  tabs: "SUMMARY" | "TRAINING_PLANS";
  selectedUnit: UnitInterface | null;
  searchData: string;
  mainError: string;
  openSelectUnit: boolean;
  selectedYear: number;
  createTraining: boolean;
  temp_data: TrainingPlanTempData | undefined;
}

class _TrainingPlans extends Component<TrainingPlansProps, TrainingPlansState> {
  constructor(props: TrainingPlansProps) {
    super(props);

    this.state = {
      loading: false,
      tabs: "TRAINING_PLANS",
      selectedUnit: null,
      searchData: "",
      mainError: "",
      openSelectUnit: false,
      selectedYear: new Date().getFullYear(),
      createTraining: false,
      temp_data: undefined,
    };
  }
  FilteredData = () => {
    if (this.props.training.training_plans === null) {
      return [];
    }
    var response = this.props.training.training_plans;
    return search(
      response,
      this.state.searchData
    ) as TrainingPlanListInterface[];
  };
  GetTrainingPlans = () => {
    this.setState({ loading: true });
    this.props.FC_GetTrainingPlansByYear(
      this.state.selectedYear,
      (loading: boolean, error: string) => {
        this.setState({ loading: loading, mainError: error });
      }
    );
  };
  componentDidMount(): void {
    if (
      this.props.training.training_plans === null ||
      this.props.training.training_plans.filter(
        (itm) => itm.year === this.state.selectedYear
      ).length === 0
    ) {
      this.GetTrainingPlans();
    }
  }
  render() {
    return (
      <Fragment>
        <div className="pt-3">
          <div className="flex flex-row items-center justify-between gap-2 w-full pl-2">
            <div className="flex flex-row items-center gap-3">
              <div>
                <BsCalendar2Check className="text-5xl text-gray-400" />
              </div>
              <div>
                <div className="text-xl font-bold truncate">
                  {this.state.createTraining === true
                    ? "Create Training Plan"
                    : "Training Plans"}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {this.state.createTraining === true
                    ? "Fill and complete the following steps to create training plan"
                    : "View and customize list of available training plans"}
                </div>
              </div>
            </div>
            {/* Right side */}
            {this.state.createTraining === true ? (
              <div>
                <div
                  onClick={() => this.setState({ createTraining: false })}
                  className="px-3 py-2 pl-2 rounded-md bg-white text-black hover:bg-primary-800 hover:text-white cursor-pointer w-max font-semibold flex flex-row items-center gap-2 justify-center"
                >
                  {/* <IoMdArrowBack className="text-2xl" /> */}
                  <span>Back to list</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-end gap-2 w-1/2">
                <div
                  onClick={() => this.setState({ openSelectUnit: true })}
                  className="flex flex-row items-center justify-between gap-6 bg-white hover:bg-primary-100 border border-primary-700 rounded cursor-pointer pr-2 group truncate"
                >
                  <div className="flex flex-row items-center gap-2 truncate">
                    <div>
                      <div className="bg-primary-700 flex items-center justify-center h-10 w-10">
                        <BsFilterCircle className="text-2xl text-white" />
                      </div>
                    </div>
                    {this.state.selectedUnit === null ? (
                      <div className="font-bold text-sm text-gray-500 group-hover:text-primary-800 py-1 truncate">
                        Search by Units
                      </div>
                    ) : (
                      <div className="font-bold text-sm text-primary-800 group-hover:text-primary-900 py-1 truncate">
                        {this.state.selectedUnit.unit_name}
                      </div>
                    )}
                  </div>
                  <div>
                    <MdOutlineKeyboardArrowDown className="text-2xl text-gray-500 group-hover:text-primary-700" />
                  </div>
                </div>
                {this.state.selectedUnit !== null && (
                  <div
                    onClick={() => this.setState({ selectedUnit: null })}
                    title="Reset to view back all of the list"
                    className=" rounded-full flex items-center justify-center text-yellow-600 hover:text-yellow-700 cursor-pointer"
                  >
                    <IoMdRefreshCircle className="text-4xl bg-white rounded-full" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 truncate">
                    Total Plans
                  </div>
                  <div className="font-bold text-xl -mt-1">
                    {commaFy(this.FilteredData().length)}
                  </div>
                </div>
                <div
                  onClick={() => this.setState({ createTraining: true })}
                  className="px-3 py-2 pl-2 rounded-md bg-primary-800 text-white hover:bg-primary-900 cursor-pointer w-max font-semibold flex flex-row items-center gap-2 justify-center"
                >
                  <IoIosAddCircleOutline className="text-2xl" />
                  <span>Create a Plan</span>
                </div>
              </div>
            )}
          </div>
          {/* Body */}
          {this.state.loading === true ||
          this.props.training.training_plans === null ? (
            <div className="mt-8 bg-white rounded-md p-3">
              <div>
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <PositionItemLoading key={i + 1} className="animate-pulse" />
                ))}
              </div>
            </div>
          ) : this.state.createTraining === true ? (
            <MainContainer className="mt-3">
              <CreateTrainingPlan
                temp_data={this.state.temp_data}
                onGoBack={(reload: boolean) => {
                  this.setState({
                    createTraining: false,
                    temp_data: undefined,
                  });
                  if (reload === true) {
                    this.GetTrainingPlans();
                  }
                }}
              />
            </MainContainer>
          ) : (
            <MainContainer className="mt-3">
              <div className="mb-3">
                <div className="grid grid-cols-12 w-full">
                  <div className="col-span-12 lg:col-span-6">
                    <div className="flex flex-row items-center gap-2">
                      <div
                        onClick={() => this.setState({ tabs: "SUMMARY" })}
                        className={`px-6 py-2 border-b-2 ${
                          this.state.tabs === "SUMMARY"
                            ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                            : "border-white hover:border-primary-700 hover:text-primary-800"
                        } cursor-pointer`}
                      >
                        Summary
                      </div>
                      <div
                        onClick={() =>
                          this.setState({ tabs: "TRAINING_PLANS" })
                        }
                        className={`px-6 py-2 border-b-2 ${
                          this.state.tabs === "TRAINING_PLANS"
                            ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                            : "border-white hover:border-primary-700 hover:text-primary-800"
                        } cursor-pointer`}
                      >
                        Training Plans
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-6 flex flex-row items-center justify-end gap-2 pb-2 -mt-1">
                    <SearchInput
                      searchData={this.state.searchData}
                      onChange={(value: string) =>
                        this.setState({ searchData: value })
                      }
                    />
                    <ExportToExcel
                      fileData={this.props.training.training_plans}
                      fileName={"Training Plans report"}
                    />
                  </div>
                </div>
              </div>
              {this.state.mainError !== "" && (
                <div className="py-3">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.mainError}
                    close={() => this.setState({ mainError: "" })}
                  />
                </div>
              )}
              {this.state.tabs === "TRAINING_PLANS" && (
                <div className="mt-6 animate__animated animate__fadeIn">
                  {this.FilteredData().length === 0 ? (
                    <NoResultFound />
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full text-sm text-left">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 border">#</th>
                            <th className="px-3 py-2 border">Title</th>
                            <th className="px-3 py-2 border">Division</th>
                            <th className="px-3 py-2 border">
                              Allocated budget
                            </th>
                            <th className="px-3 py-2 border">
                              Source of budget
                            </th>
                            <th className="px-3 py-2 border">Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.FilteredData().map((item, i) => (
                            <tr
                              onClick={() =>
                                this.setState({
                                  temp_data: {
                                    allocated_budget:
                                      item.allocated_budget.toString(),
                                    budget_source: item.budget_source,
                                    selectedDivision: {
                                      division_id: item.division_id,
                                      division_name: item.division_name,
                                    },
                                    start_date: "",
                                    title: item.title,
                                    training_offer_modes: [], //TO BE ADDED IN THE RESPONSE,
                                    training_plan_id: item.training_plan_id,
                                    year: item.year.toString(),
                                  },
                                  createTraining: true,
                                })
                              }
                              key={i + 1}
                              className="cursor-pointer hover:bg-primary-50 hover:text-primary-800"
                            >
                              <td className="px-3 py-2 border truncate">
                                {i + 1}
                              </td>
                              <td className="px-3 py-2 border w-1/2">
                                {item.title}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.division_name}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {commaFy(item.allocated_budget)}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.budget_source}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.year}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </MainContainer>
          )}
        </div>

        {this.state.openSelectUnit && (
          //  this.props.training.training_plans !== null &&
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ openSelectUnit: false })}
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <SelectUnit
              positionsCounter={[]}
              onSelect={(unit: UnitInterface | null) =>
                this.setState({ selectedUnit: unit, openSelectUnit: false })
              }
              onClose={() => this.setState({ openSelectUnit: false })}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  training,
}: StoreState): {
  auth: Auth;
  training: TrainingStore;
} => {
  return { auth, training };
};

export const TrainingPlans = connect(mapStateToProps, {
  FC_GetTrainingPlansByYear,
})(_TrainingPlans);
