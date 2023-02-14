import React, { Component } from "react";
import {
  ApplicationDetailsInterface,
  AssessmentOutcomeValues,
  LevelsValues,
  RoundValues,
  AssessmentInterface,
  ScreeningStatusValues,
  PeerReviewStatusValues,
  RegistrationStates,
} from "../../actions";
import { BiAnalyse, BiLoaderCircle } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoBanOutline } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  DATE,
  GetDaysFromTwoDates,
  timestampToDate,
} from "../../utils/functions";
import { GetLastScreeningValue } from "./Screening";
import { GetLastPeerReviewValue } from "./PeerReview";

interface AssessmentProps {
  data: ApplicationDetailsInterface;
  openAssessmentDetails: (status: boolean) => void;
}
interface AssessmentState {
  loading: boolean;
  error: {
    target: "assessment_status";
    msg: string;
  } | null;
}

export const GetLastAssessmentValue = (assessments: AssessmentInterface[]) => {
  const temp = [];
  let i = assessments.length === 0 ? -1 : assessments.length - 1;
  while (i >= 0) {
    temp.push(assessments[i]);
    i = i - 1;
  }
  // lEVEL 2
  const round1DataL2 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_ONE &&
      itm.assessment_level === LevelsValues.LEVEL_TWO
  );
  const round2DataL2 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_TWO &&
      itm.assessment_level === LevelsValues.LEVEL_TWO
  );
  const round3DataL2 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_THREE &&
      itm.assessment_level === LevelsValues.LEVEL_TWO
  );
  const round4DataL2 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_FOUR &&
      itm.assessment_level === LevelsValues.LEVEL_TWO
  );

  // lEVEL 1
  const round1DataL1 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_ONE &&
      itm.assessment_level === LevelsValues.LEVEL_ONE
  );
  const round2DataL1 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_TWO &&
      itm.assessment_level === LevelsValues.LEVEL_ONE
  );
  const round3DataL1 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_THREE &&
      itm.assessment_level === LevelsValues.LEVEL_ONE
  );
  const round4DataL1 = temp.filter(
    (itm) =>
      itm.assessment_round === RoundValues.ROUND_FOUR &&
      itm.assessment_level === LevelsValues.LEVEL_ONE
  );

  if (
    round1DataL2.length <= 0 &&
    round2DataL2.length <= 0 &&
    round3DataL2.length <= 0 &&
    round4DataL2.length <= 0 &&
    // ------------------------
    round1DataL1.length <= 0 &&
    round2DataL1.length <= 0 &&
    round3DataL1.length <= 0 &&
    round4DataL1.length <= 0
  ) {
    return null;
  }

  const RoundFour =
    round4DataL2.length > 0
      ? round4DataL2[round4DataL2.length - 1]
      : round4DataL1.length > 0
      ? round4DataL1[round4DataL1.length - 1]
      : null;

  const RoundThree =
    round3DataL2.length > 0
      ? round3DataL2[round3DataL2.length - 1]
      : round3DataL1.length > 0
      ? round3DataL1[round3DataL1.length - 1]
      : null;
  const RoundTwo =
    round2DataL2.length > 0
      ? round2DataL2[round2DataL2.length - 1]
      : round2DataL1.length > 0
      ? round2DataL1[round2DataL1.length - 1]
      : null;
  const RoundOne =
    round1DataL2.length > 0
      ? round1DataL2[round1DataL2.length - 1]
      : round1DataL1.length > 0
      ? round1DataL1[round1DataL1.length - 1]
      : null;
  const res =
    RoundFour !== null
      ? RoundFour
      : RoundThree !== null
      ? RoundThree
      : RoundTwo !== null
      ? RoundTwo
      : RoundOne !== null
      ? RoundOne
      : null;
  return res;
};

export const getLastQuery = (data: ApplicationDetailsInterface) => {
  const last_assessment = GetLastAssessmentValue(data.assessments);
  if (last_assessment !== undefined) {
    const last_query = data.assessmentqueries.find(
      (itm) => itm.assessment_round === last_assessment?.assessment_round
    );
    if (last_query !== undefined) {
      return last_query;
    }
  }
  return null;
};

// Get time taken to respond query

export const queryAnsweringNumberOfDays = (
  data: ApplicationDetailsInterface
): number => {
  const last_assessment = GetLastAssessmentValue(data.assessments);
  if (last_assessment !== null) {
    const last_query = data.assessmentqueries.find(
      (itm) => itm.assessment_round === last_assessment?.assessment_round
    );

    if (last_query !== undefined) {
      const query_issued_date = last_query.query_issued_date;
      const query_response_date = last_query.query_response_date;
      const ToDayDate = new Date();
      let test = 0;
      if (query_response_date === null || query_response_date === "") {
        test = GetDaysFromTwoDates(
          DATE(query_issued_date, "MM/DD/YYYY"),
          DATE(timestampToDate(ToDayDate).fullDATE, "MM/DD/YYYY")
        );
      } else {
        test = GetDaysFromTwoDates(
          DATE(query_issued_date, "MM/DD/YYYY"),
          DATE(query_response_date, "MM/DD/YYYY")
        );
      }
      return test;
    }
  }
  return 0;
};

export const validateQuery90Days = (
  data: ApplicationDetailsInterface
): "VALID" | "INVALID" => {
  const lastQuery = getLastQuery(data);
  if (
    lastQuery !== null &&
    (lastQuery.query_response_date === null ||
      lastQuery.query_response_date === "")
  ) {
    if (queryAnsweringNumberOfDays(data) > 90) {
      return "INVALID";
    }
  }
  return "VALID";
};

export const GetAssessmentStatusName = (status: AssessmentOutcomeValues) => {
  switch (status) {
    case AssessmentOutcomeValues.NR:
      return "NOT RECOMMENDED";
    case AssessmentOutcomeValues.OG:
      return "ONGOING";
    case AssessmentOutcomeValues.R:
      return "RECOMMENDED";
  }
};

export const GetLevelName = (level: LevelsValues) => {
  if (level === LevelsValues.LEVEL_ONE) {
    return "First assessment";
  }
  return "Second assessment";
};

export const GetRoundName = (round: RoundValues) => {
  if (round === RoundValues.ROUND_ONE) {
    return "Initial";
  }
  if (round === RoundValues.ROUND_TWO) {
    return "First round";
  }
  if (round === RoundValues.ROUND_THREE) {
    return "Second round";
  }
  return "Third round";
};

export enum CurrentStatusEnum {
  NOT_SCREENED = "NOT SCREENED",
  SCREENING_PROCESS = "SCREENING PROCESS",
  NOT_ASSESSED = "NOT ASSESSED",
  WAITING_FOR_ASSESSMENT = "WAITING FOR ASSESSMENT",
  WAITING_TO_SEND_QUERY_ISSUE = "WAITING TO SEND QUERY ISSUE",
  WAITING_FOR_QUERY_RESPONSE = "WAITING FOR QUERY RESPONSE",
  QUERY_RESPONSE_WAITING_FOR_ASSESSOR = "QUERY RESPONSE WAITING FOR ASSESSOR",
  WAITING_FOR_PEER_REVIEW = "WAITING FOR PEER REVIEW",
  WAITING_FOR_REGISTRATION = "WAITING FOR REGISTRATION",
  NULL = "NULL",
}

export const ApplicationCurrentState = (
  data: ApplicationDetailsInterface
): CurrentStatusEnum => {
  if (GetLastScreeningValue(data.screenings) === null) {
    return CurrentStatusEnum.NOT_SCREENED;
  }
  if (
    GetLastScreeningValue(data.screenings) !== null &&
    GetLastScreeningValue(data.screenings)!.screening_status ===
      ScreeningStatusValues.PROGRESS_IN_SCREENING
  ) {
    return CurrentStatusEnum.SCREENING_PROCESS;
  }
  if (
    data.assessments.length === 0 &&
    GetLastScreeningValue(data.screenings) !== null &&
    GetLastScreeningValue(data.screenings)!.screening_status ===
      ScreeningStatusValues.SCREENING_COMPLETED
  ) {
    return CurrentStatusEnum.NOT_ASSESSED;
  }

  if (
    data.assessments.length % 2 !== 0 &&
    GetLastAssessmentValue(data.assessments) !== null
  ) {
    return CurrentStatusEnum.WAITING_FOR_ASSESSMENT;
  }

  if (
    data.assessments.length % 2 === 0 &&
    getLastQuery(data) === null &&
    GetLastAssessmentValue(data.assessments) !== null &&
    GetLastAssessmentValue(data.assessments)!.assessment_outcome ===
      AssessmentOutcomeValues.OG &&
    GetLastAssessmentValue(data.assessments)?.assessment_level ===
      LevelsValues.LEVEL_TWO
  ) {
    return CurrentStatusEnum.WAITING_TO_SEND_QUERY_ISSUE;
  }
  if (
    data.assessments.length % 2 === 0 &&
    data.assessmentqueries.length > 0 &&
    GetLastAssessmentValue(data.assessments) !== null &&
    GetLastAssessmentValue(data.assessments)!.assessment_outcome ===
      AssessmentOutcomeValues.OG &&
    getLastQuery(data) !== null &&
    (getLastQuery(data)!.query_response_date === null ||
      getLastQuery(data)!.query_response_date === "")
  ) {
    return CurrentStatusEnum.WAITING_FOR_QUERY_RESPONSE;
  }
  if (
    data.assessments.length > 1 &&
    data.assessments.length > 1 &&
    GetLastAssessmentValue(data.assessments) !== null &&
    GetLastAssessmentValue(data.assessments)!.assessment_outcome ===
      AssessmentOutcomeValues.OG &&
    getLastQuery(data) !== null &&
    getLastQuery(data)!.query_response_date !== null &&
    getLastQuery(data)!.query_response_date !== ""
  ) {
    return CurrentStatusEnum.QUERY_RESPONSE_WAITING_FOR_ASSESSOR;
  }
  if (
    GetLastAssessmentValue(data.assessments)?.assessment_outcome ===
      AssessmentOutcomeValues.R &&
    GetLastPeerReviewValue(data) === null
  ) {
    return CurrentStatusEnum.WAITING_FOR_PEER_REVIEW;
  }
  if (
    GetLastAssessmentValue(data.assessments)?.assessment_outcome ===
      AssessmentOutcomeValues.R &&
    GetLastPeerReviewValue(data) !== null &&
    GetLastPeerReviewValue(data)?.status.toLocaleLowerCase() ===
      PeerReviewStatusValues.approved.toLocaleLowerCase() &&
    data.registration_Status !== RegistrationStates.REGISTERED
  ) {
    return CurrentStatusEnum.WAITING_FOR_REGISTRATION;
  }
  return CurrentStatusEnum.NULL;
};

export const GetDaysQueryWaitingForAssessment = (
  data: ApplicationDetailsInterface
) => {
  if (
    ApplicationCurrentState(data) ===
    CurrentStatusEnum.QUERY_RESPONSE_WAITING_FOR_ASSESSOR
  ) {
    // Get last query
    const lastQuery = getLastQuery(data);
    if (
      lastQuery !== null &&
      lastQuery.query_response_date !== null &&
      lastQuery.query_response_date !== ""
    ) {
      const last_date = lastQuery.query_response_date;
      const ToDayDate = new Date();
      return GetDaysFromTwoDates(
        DATE(last_date, "MM/DD/YYYY"),
        DATE(timestampToDate(ToDayDate).fullDATE, "MM/DD/YYYY")
      );
    }
  }
  return 0;
};

export const FCGetAssessmentStatusElement = (props: {
  assessment_status: AssessmentOutcomeValues;
  loading: boolean;
}) => {
  if (props.assessment_status === AssessmentOutcomeValues.OG) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-primary-100 text-primary-900 border border-blue-400 font-bold text-xs pr-3 w-max h-max">
        {props.loading === true && (
          <div>
            <BiLoaderCircle className={`text-2xl animate-spin`} />
          </div>
        )}
        <div>
          {props.loading === false ? (
            <div className="px-4 py-0">
              {GetAssessmentStatusName(props.assessment_status)}
            </div>
          ) : (
            GetAssessmentStatusName(props.assessment_status)
          )}
        </div>
      </div>
    );
  }
  if (props.assessment_status === AssessmentOutcomeValues.R) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-green-50 text-green-700 border border-green-400 font-bold text-xs pr-3 w-max h-max">
        <div>
          <IoMdCheckmarkCircle className="text-2xl" />
        </div>
        <div>{GetAssessmentStatusName(props.assessment_status)}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-red-50 text-red-700 border border-red-400 font-bold text-xs pr-3 w-max h-max">
      <div>
        <IoBanOutline className="text-xl" />
      </div>
      <div>{GetAssessmentStatusName(props.assessment_status)}</div>
    </div>
  );
};

export class Assessment extends Component<AssessmentProps, AssessmentState> {
  constructor(props: AssessmentProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
    };
  }

  FilterByRounds = (selected_round: RoundValues) => {
    return this.props.data.assessments.filter(
      (itm) => itm.assessment_round === selected_round
    );
  };
  FindDataByLevelRound = (level: LevelsValues, selected_round: RoundValues) => {
    const temp = [];
    let i =
      this.props.data.assessments.length === 0
        ? -1
        : this.props.data.assessments.length - 1;
    while (i >= 0) {
      temp.push(this.props.data.assessments[i]);
      i = i - 1;
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
    return (
      <div>
        <div
          onClick={() => this.props.openAssessmentDetails(true)}
          className="rounded-md p-2 flex flex-row gap-2 justify-between bg-white border hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900 group cursor-pointer"
        >
          <div className="flex flex-row gap-2 justify-between items-center w-full">
            <div className="flex flex-row items-center gap-3">
              <div className="">
                <div
                  className={`h-16 w-16 rounded-md border ${
                    GetLastAssessmentValue(this.props.data.assessments) === null
                      ? "bg-gray-100 border-gray-100"
                      : this.validateAssessmentQuery() === false
                      ? "bg-red-100 border-red-300"
                      : "bg-primary-100 border-primary-100"
                  } group-hover:bg-white group-hover:border-primary-100 flex items-center justify-center`}
                >
                  <BiAnalyse
                    className={`text-5xl ${
                      GetLastAssessmentValue(this.props.data.assessments) ===
                      null
                        ? "text-gray-300"
                        : this.validateAssessmentQuery() === false
                        ? "text-red-700"
                        : "text-primary-700"
                    } group-hover:text-primary-800`}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base cursor-pointer">
                  {GetLastAssessmentValue(this.props.data.assessments) === null
                    ? "Assessment progress"
                    : GetLevelName(
                        GetLastAssessmentValue(this.props.data.assessments)!
                          .assessment_level
                      )}
                </span>
                <span className="text-xs font-light">
                  Current round of assessment
                </span>
                {GetLastAssessmentValue(this.props.data.assessments) ===
                null ? (
                  <div className="font-semibold text-sm text-gray-400 group-hover:text-yellow-700">
                    No details found!
                  </div>
                ) : (
                  <div className="text-xs font-light flex flex-row items-center gap-2">
                    {this.validateAssessmentQuery() === false ? (
                      <div className="px-2 py-1 w-max rounded-full font-bold text-xs bg-red-700 text-white animate__animated animate__bounceIn animate__infinite">
                        Feedback waiting months:{" "}
                        {Math.round(
                          queryAnsweringNumberOfDays(this.props.data) / 30
                        )}
                      </div>
                    ) : (
                      GetDaysQueryWaitingForAssessment(this.props.data) <=
                        60 && (
                        <div>
                          <div className="rounded-full bg-primary-100 text-primary-900 font-semibold w-max px-2 py-1 text-xs group-hover:bg-primary-800 group-hover:text-white">
                            {GetRoundName(
                              GetLastAssessmentValue(
                                this.props.data.assessments
                              )!.assessment_round
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {/* Check queries */}
                    {ApplicationCurrentState(this.props.data) ===
                      CurrentStatusEnum.QUERY_RESPONSE_WAITING_FOR_ASSESSOR &&
                      GetDaysQueryWaitingForAssessment(this.props.data) >
                        60 && (
                        <div className="px-2 py-1 w-max rounded-full font-bold text-xs bg-red-700 text-white animate__animated animate__bounceIn animate__infinite">
                          Query is waiting for :{" "}
                          {Math.round(
                            GetDaysQueryWaitingForAssessment(this.props.data) /
                              30
                          )}{" "}
                          months
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
            {/* Status */}
            <div>
              {GetLastAssessmentValue(this.props.data.assessments) === null ? (
                <div className="flex flex-row items-center gap-1 rounded-full p-1 bg-yellow-50 text-yellow-700 border border-yellow-200 font-bold text-xs pr-3">
                  <div>
                    <RiErrorWarningLine className="text-2xl animate__animated animate__zoomIn animate__infinite" />
                  </div>
                  <div>{"Not assessed"}</div>
                </div>
              ) : (
                GetLastAssessmentValue(this.props.data.assessments) !==
                  null && (
                  <FCGetAssessmentStatusElement
                    assessment_status={
                      GetLastAssessmentValue(this.props.data.assessments)!
                        .assessment_outcome
                    }
                    loading={
                      GetLastAssessmentValue(this.props.data.assessments)
                        ?.assessment_level !== LevelsValues.LEVEL_ONE
                        ? false
                        : true
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Assessment;
