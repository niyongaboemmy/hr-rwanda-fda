import React, { Component } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdAddComment, MdSchedule } from "react-icons/md";
import {
  ApplicationDetailsInterface,
  AssessmentInterface,
  AssessmentOutcomeValues,
  AssessmentQueryInterface,
  LevelsValues,
  RoundsArray,
  RoundValues,
} from "../../../actions";
import { DATE } from "../../../utils/functions";
import {
  FCGetAssessmentStatusElement,
  GetLastAssessmentValue,
  getLastQuery,
  GetRoundName,
  queryAnsweringNumberOfDays,
  validateQuery90Days,
} from "../Assessment";
import EditAssessment from "../edit/EditAssessment";
import EditQuery from "../edit/EditQuery";

interface AssessmentDetailsProps {
  data: ApplicationDetailsInterface;
  openAssessmentDetails: (status: boolean) => void;
  onSave: (reference_number: string) => void;
}

interface AssessmentDetailsState {
  open_edit_assessment: {
    selected_level: LevelsValues;
    selected_round: RoundValues;
    action_type: "Update" | "Add";
    assessment_start_date: string;
    assessment_end_date: string;
    assessment_outcome: AssessmentOutcomeValues;
    assessment_comment: string;
    done_by: string;
  } | null;
  openQuery: {
    EditQuery: "Issue" | "Response";
    selectedRound: RoundValues;
    application_ref_number: string;
    query_issued: string;
    query_issued_date: string;
    query_response: string;
    query_response_date: string;
  } | null;
}

export const ValidateAssessmentRound = (
  round: RoundValues,
  data: ApplicationDetailsInterface
) => {
  const temp_data = [];
  if (data.assessments.length > 0) {
    let i = data.assessments.length - 1;
    while (i >= 0) {
      temp_data.push(data.assessments[i]);
      i = i - 1;
    }
    // Get data
    const test = temp_data.find(
      (itm) =>
        itm.assessment_round === round &&
        itm.assessment_level === LevelsValues.LEVEL_TWO
    );
    if (
      test !== undefined &&
      test.assessment_start_date !== null &&
      test.assessment_end_date !== null
    ) {
      return test;
    }
  }
  return null;
};

export const ValidateQueryRound = (
  round: RoundValues,
  data: ApplicationDetailsInterface
) => {
  const temp_data: AssessmentQueryInterface[] = [];
  if (data.assessmentqueries.length > 0) {
    let i = data.assessmentqueries.length - 1;
    while (i >= 0) {
      temp_data.push(data.assessmentqueries[i]);
      i = i - 1;
    }
    // Get data
    const test = temp_data.find((itm) => itm.assessment_round === round);
    if (
      test !== undefined &&
      test.query_issued_date !== null &&
      test.query_response_date !== null &&
      test.query_response !== ""
    ) {
      return test;
    }
  }
  return null;
};

export const ValidateDisplayRound = (
  round: RoundValues,
  data: ApplicationDetailsInterface
) => {
  if (round === RoundValues.ROUND_ONE) {
    return true;
  }
  if (round === RoundValues.ROUND_TWO) {
    if (ValidateQueryRound(RoundValues.ROUND_ONE, data) !== null) {
      return true;
    }
  }
  if (round === RoundValues.ROUND_THREE) {
    if (ValidateQueryRound(RoundValues.ROUND_TWO, data) !== null) {
      return true;
    }
  }
  if (round === RoundValues.ROUND_FOUR) {
    if (ValidateQueryRound(RoundValues.ROUND_THREE, data) !== null) {
      return true;
    }
  }
  return false;
};

export const GetEmptyQueryElement = (props: {
  round: RoundValues;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={props.onClick}
      className="col-span-12 sm:cols-span-6 lg:col-span-4 flex flex-col items-center justify-center bg-white rounded border border-white hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer w-full h-full group px-2 py-2"
    >
      <div>
        <MdAddComment className="text-6xl text-gray-200 group-hover:text-yellow-700" />
      </div>
      <div className="No query found font-normal text-sm">
        Query for {GetRoundName(props.round)}
      </div>
      <div className="text-xs font-bold text-gray-400 group-hover:text-yellow-700">
        Click here to add query
      </div>
    </div>
  );
};

export const GetQueryElement = (props: {
  allData: ApplicationDetailsInterface;
  data: AssessmentQueryInterface;
  round: RoundValues;
  onClick: () => void;
  days_status: boolean;
}) => {
  return (
    <div
      onClick={props.onClick}
      className="col-span-12 sm:cols-span-6 lg:col-span-4 flex flex-col bg-white rounded border border-white hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900 cursor-pointer w-full h-full group px-3 py-2"
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className="font-bold group-hover:text-primary-900">
          Query issued
        </div>
        <div className="rounded-full px-2 py-1 bg-primary-50 text-primary-900 font-bold group-hover:bg-primary-800 group-hover:text-white text-left text-xs">
          {DATE(props.data.query_issued_date)}
        </div>
      </div>
      <div className="w-full text-left text-xs">
        <span>{props.data.query_issued}</span>
      </div>
      {props.data.query_response_date !== null &&
      props.data.query_response_date !== "" &&
      props.data.query_response !== "" ? (
        <>
          <div className="border-b w-full border-gray-300 group-hover:border-primary-700 my-3"></div>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="font-bold group-hover:text-primary-900">
              Query response
            </div>
            <div className="rounded-full px-2 py-1 bg-primary-50 text-primary-900 font-bold group-hover:bg-primary-800 group-hover:text-white text-left text-xs">
              {DATE(props.data.query_response_date)}
            </div>
          </div>
          <div className="w-full text-left text-xs">
            <span>{props.data.query_response}</span>
          </div>
        </>
      ) : (
        <div>
          {/* Verify remaining days */}
          {props.days_status === false && (
            <div className="text-sm mt-2 font-extrabold bg-red-100 text-red-700 px-1 py-1 rounded-full animate__animated animate__bounceIn animate__infinite">
              This is taking{" "}
              {Math.round(queryAnsweringNumberOfDays(props.allData) / 30)}{" "}
              months to get response
            </div>
          )}
          <div className="text-lg font-light mt-2 group-hover:underline text-yellow-700">
            Click to add response
          </div>
        </div>
      )}
    </div>
  );
};

export class AssessmentDetails extends Component<
  AssessmentDetailsProps,
  AssessmentDetailsState
> {
  constructor(props: AssessmentDetailsProps) {
    super(props);

    this.state = {
      open_edit_assessment: null,
      openQuery: null,
    };
  }
  GetLastAssessmentValue = () => {
    if (this.props.data.assessments.length <= 0) {
      return null;
    }
    const res =
      this.props.data.assessments[this.props.data.assessments.length - 1];
    return res;
  };
  FilterByRounds = (selected_round: RoundValues) => {
    return this.props.data.assessments.filter(
      (itm) => itm.assessment_round === selected_round
    );
  };
  FindDataByLevelRound = (level: LevelsValues, selected_round: RoundValues) => {
    const temp: AssessmentInterface[] = [];
    let iteration =
      this.props.data.assessments.length === 0
        ? -1
        : this.props.data.assessments.length - 1;
    while (iteration >= 0) {
      temp.push(this.props.data.assessments[iteration]);
      iteration = iteration - 1;
    }
    const res = temp.find(
      (itm) =>
        itm.assessment_level === level &&
        itm.assessment_round === selected_round
    );
    if (res === undefined) {
      return null;
    }
    return res;
  };
  FindQueriesByRound = (selected_round: RoundValues) => {
    const test = this.props.data.assessmentqueries.filter(
      (itm) => itm.assessment_round === selected_round
    );
    return test.length === 0 ? [] : [test[test.length - 1]];
  };
  GetLastQuery = (round: RoundValues) => {
    const temp = this.FindQueriesByRound(round);
    const res = temp.find((itm) => itm.assessment_round === round);
    if (res !== undefined) {
      return res;
    }
    return null;
  };
  componentDidMount = () => {
    if (this.props.data.assessments.length === 0) {
      this.setState({
        open_edit_assessment: {
          selected_level: LevelsValues.LEVEL_ONE,
          selected_round: RoundValues.ROUND_ONE,
          action_type: "Add",
          assessment_comment: "",
          assessment_end_date: "",
          assessment_outcome: AssessmentOutcomeValues.OG,
          assessment_start_date: "",
          done_by: "",
        },
      });
    }
  };

  SetSelectQuery = (selected_round: RoundValues) => {
    if (
      ValidateAssessmentRound(selected_round, this.props.data) !== null &&
      ValidateAssessmentRound(selected_round, this.props.data)
        ?.assessment_outcome !== AssessmentOutcomeValues.R &&
      ValidateAssessmentRound(selected_round, this.props.data)
        ?.assessment_outcome !== AssessmentOutcomeValues.NR
    ) {
      this.setState({
        openQuery: {
          EditQuery:
            this.GetLastQuery(selected_round) === null ? "Issue" : "Response",
          selectedRound: selected_round,
          application_ref_number: this.props.data.application_ref_number,
          query_issued:
            this.GetLastQuery(selected_round) === null
              ? ""
              : this.GetLastQuery(selected_round)!.query_issued,
          query_issued_date:
            this.GetLastQuery(selected_round) === null
              ? ""
              : this.GetLastQuery(selected_round)!.query_issued_date,
          query_response:
            this.GetLastQuery(selected_round) === null ||
            this.GetLastQuery(selected_round)!.query_response === null
              ? ""
              : this.GetLastQuery(selected_round)!.query_response!,
          query_response_date:
            this.GetLastQuery(selected_round) === null ||
            this.GetLastQuery(selected_round)!.query_response_date === null
              ? ""
              : this.GetLastQuery(selected_round)!.query_response_date!,
        },
      });
    } else {
      alert("Please you are not allowed to add query!");
    }
  };

  ReturnAssessmentRoundDetails = (props: {
    title: string;
    selected_level: LevelsValues;
    selected_round: RoundValues;
    waiting_status_component: JSX.Element;
  }) => {
    return (
      <div
        onClick={() => {
          if (
            (props.selected_level === LevelsValues.LEVEL_TWO &&
              this.FindDataByLevelRound(
                LevelsValues.LEVEL_ONE,
                props.selected_round
              ) !== null) ||
            props.selected_level === LevelsValues.LEVEL_ONE
          ) {
            this.setState({
              open_edit_assessment: {
                selected_level: props.selected_level,
                selected_round: props.selected_round,
                action_type:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null
                    ? "Add"
                    : "Update",
                assessment_comment:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null
                    ? ""
                    : this.FindDataByLevelRound(
                        props.selected_level,
                        props.selected_round
                      )!.assessment_comment,
                assessment_end_date:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null
                    ? ""
                    : this.FindDataByLevelRound(
                        props.selected_level,
                        props.selected_round
                      )!.assessment_end_date,
                assessment_outcome:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null
                    ? props.selected_round === RoundValues.ROUND_FOUR &&
                      props.selected_level === LevelsValues.LEVEL_TWO
                      ? AssessmentOutcomeValues.R
                      : AssessmentOutcomeValues.OG
                    : this.FindDataByLevelRound(
                        props.selected_level,
                        props.selected_round
                      )!.assessment_outcome,
                assessment_start_date:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null
                    ? ""
                    : this.FindDataByLevelRound(
                        props.selected_level,
                        props.selected_round
                      )!.assessment_start_date,
                done_by:
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  ) === null ||
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  )!.done_by === undefined
                    ? ""
                    : this.FindDataByLevelRound(
                        props.selected_level,
                        props.selected_round
                      )!.done_by!,
              },
            });
          } else {
            alert("You are required to complete the first assessment");
          }
        }}
        className="col-span-12 sm:cols-span-6 lg:col-span-4  bg-white rounded-md p-2 py-2 w-full flex flex-row gap-4 cursor-pointer border border-white hover:border-primary-300 hover:bg-primary-50 group h-full"
      >
        <div>
          <div
            className={`${
              this.FindDataByLevelRound(
                props.selected_level,
                props.selected_round
              ) === null
                ? "bg-gray-100"
                : "bg-primary-100"
            } group-hover:bg-white flex items-center justify-center h-28 w-28 rounded-md`}
          >
            <IoShieldCheckmarkSharp
              className={`text-7xl ${
                this.FindDataByLevelRound(
                  props.selected_level,
                  props.selected_round
                ) === null
                  ? "text-gray-200"
                  : "text-primary-700"
              } group-hover:text-primary-800`}
            />
          </div>
        </div>
        <div className="flex flex-col text-left">
          <div className="text-lg font-bold mb-1 group-hover:text-primary-800">
            {props.title}
          </div>
          {this.FindDataByLevelRound(
            props.selected_level,
            props.selected_round
          ) === null ? (
            <div>{props.waiting_status_component}</div>
          ) : (
            <div>
              <div className="text-xs">
                Start date:{" "}
                {DATE(
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  )!.assessment_start_date
                )}
              </div>
              <div className="text-xs">
                Ending date:{" "}
                {DATE(
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  )!.assessment_end_date
                )}
              </div>
              <div className="text-xs">
                Comment:{" "}
                {
                  this.FindDataByLevelRound(
                    props.selected_level,
                    props.selected_round
                  )!.assessment_comment
                }
              </div>
              <div className="my-1"></div>
              {
                <FCGetAssessmentStatusElement
                  assessment_status={
                    this.FindDataByLevelRound(
                      props.selected_level,
                      props.selected_round
                    )!.assessment_outcome
                  }
                  loading={
                    GetLastAssessmentValue(this.props.data.assessments)
                      ?.assessment_level !== LevelsValues.LEVEL_ONE
                      ? false
                      : true
                  }
                />
              }
            </div>
          )}
        </div>
      </div>
    );
  };

  validateAssessmentQuery = () => {
    if (
      this.props.data.assessmentqueries.length > 0 &&
      getLastQuery(this.props.data) !== null &&
      validateQuery90Days(this.props.data) === "INVALID" &&
      (getLastQuery(this.props.data)!.query_response_date === null ||
        getLastQuery(this.props.data)!.query_response_date !== "")
    ) {
      return false;
    }
    return true;
  };

  render() {
    const waiting_status_component = (
      <div>
        <div className="font-light">Click here to add details</div>
        <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-gray-100 text-gray-900 border border-gray-300 font-bold text-xs pr-3 w-max mt-1">
          <div>
            <MdSchedule className="text-xl animate-pulse" />
          </div>
          <div>{"Waiting"}</div>
        </div>
      </div>
    );
    if (this.state.open_edit_assessment !== null) {
      return (
        <EditAssessment
          onGoBack={() => {
            this.setState({ open_edit_assessment: null });
            if (this.props.data.assessments.length === 0) {
              this.props.openAssessmentDetails(false);
            }
          }}
          data={this.props.data}
          onSave={(application_ref_number: string) => {
            this.setState({ open_edit_assessment: null });
            this.props.onSave(application_ref_number);
          }}
          assessment_level={this.state.open_edit_assessment.selected_level}
          assessment_round={this.state.open_edit_assessment.selected_round}
          action_type={this.state.open_edit_assessment.action_type}
          assessment_start_date={
            this.state.open_edit_assessment.assessment_start_date
          }
          assessment_end_date={
            this.state.open_edit_assessment.assessment_end_date
          }
          assessment_outcome={
            this.state.open_edit_assessment.assessment_outcome
          }
          assessment_comment={
            this.state.open_edit_assessment.assessment_comment
          }
          done_by={this.state.open_edit_assessment.done_by}
        />
      );
    }
    if (this.state.openQuery !== null) {
      return (
        <EditQuery
          onGoBack={() => {
            this.setState({ openQuery: null });
            if (this.props.data.assessments.length === 0) {
              this.props.openAssessmentDetails(false);
            }
          }}
          onSave={(application_ref_number: string) => {
            this.setState({ openQuery: null });
            this.props.onSave(application_ref_number);
          }}
          data={this.props.data}
          EditQuery={this.state.openQuery.EditQuery}
          selectedRound={this.state.openQuery.selectedRound}
          application_ref_number={this.state.openQuery.application_ref_number}
          query_issued={this.state.openQuery.query_issued}
          query_issued_date={this.state.openQuery.query_issued_date}
          query_response={this.state.openQuery.query_response}
          query_response_date={this.state.openQuery.query_response_date}
        />
      );
    }
    return (
      <div className="animate__animated animate__fadeIn rounded-md bg-white p-3">
        <div className="flex flex-row items-center gap-2">
          <div>
            <div
              onClick={() => this.props.openAssessmentDetails(false)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-primary-100 hover:text-primary-900 cursor-pointer"
            >
              <BsArrowLeft className="text-2xl" />
            </div>
          </div>
          <div className="font-extrabold text-xl flex flex-col">
            <span>Assessment details</span>
            <span className="text-sm font-light">
              This is the historical information for application assessment
              phases
            </span>
          </div>
        </div>
        {/* Details */}
        <div className="my-3">
          {this.props.data.assessments.length === 0 ? (
            <div className="w-full rounded-md bg-gray-200 text-lg font-light px-3 py-2">
              No assessment found!
            </div>
          ) : (
            RoundsArray.filter(
              (itm) => ValidateDisplayRound(itm, this.props.data) === true
            ).map((selected_round, r) => (
              <div
                key={r + 2}
                className="w-full mt-3 bg-gray-100 p-3 rounded-md"
              >
                <div className="mb-2 font-bold flex flex-col gap-3 text-base text-gray-500">
                  {GetRoundName(selected_round)} assessment details
                </div>
                <div className="grid grid-cols-12 items-center justify-center text-center gap-3 w-full">
                  <this.ReturnAssessmentRoundDetails
                    selected_level={LevelsValues.LEVEL_ONE}
                    selected_round={selected_round}
                    title="First assessment"
                    waiting_status_component={waiting_status_component}
                  />
                  <this.ReturnAssessmentRoundDetails
                    selected_level={LevelsValues.LEVEL_TWO}
                    selected_round={selected_round}
                    title="Second assessment"
                    waiting_status_component={waiting_status_component}
                  />
                  {this.GetLastQuery(selected_round) === null
                    ? selected_round !== RoundValues.ROUND_FOUR && (
                        <GetEmptyQueryElement
                          round={selected_round}
                          onClick={() => {
                            this.SetSelectQuery(selected_round);
                          }}
                        />
                      )
                    : selected_round !== RoundValues.ROUND_FOUR && (
                        <GetQueryElement
                          allData={this.props.data}
                          data={this.GetLastQuery(selected_round)!}
                          round={selected_round}
                          onClick={() => {
                            this.SetSelectQuery(selected_round);
                          }}
                          days_status={this.validateAssessmentQuery()}
                        />
                      )}
                </div>
              </div>
            ))
          )}
        </div>
        {this.props.data.assessments.length === 0 && (
          <div className="mt-5 flex flex-row items-center gap-2">
            <div
              onClick={() => {
                this.setState({
                  open_edit_assessment: {
                    selected_level: LevelsValues.LEVEL_ONE,
                    selected_round: RoundValues.ROUND_ONE,
                    action_type: "Add",
                    assessment_comment: "",
                    assessment_end_date: "",
                    assessment_outcome: AssessmentOutcomeValues.OG,
                    assessment_start_date: "",
                    done_by: "",
                  },
                });
              }}
              className="px-3 py-2 text-sm font-bold rounded-md bg-primary-100 text-primary-900 hover:bg-primary-800 hover:text-white cursor-pointer w-max flex flex-row items-center gap-2"
            >
              <div>
                <BiMessageSquareEdit className="text-2xl" />
              </div>
              <span>Update Assessment</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
