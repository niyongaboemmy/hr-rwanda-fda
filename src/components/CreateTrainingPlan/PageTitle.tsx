import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import BackButton from "../Fragments/BackButton";

const StepComponent = (props: {
  title: string;
  description: string;
  number: number;
  completed: boolean;
  onClick: () => void;
  selected: boolean;
}): JSX.Element => {
  return (
    <div
      onClick={props.onClick}
      className={`flex flex-row items-center gap-2 cursor-pointer ${
        props.selected === true ? "bg-gray-100 border" : "hover:bg-gray-100"
      } rounded-md w-max p-2 group`}
    >
      <div>
        <div
          className={`border-4 ${
            props.completed === true
              ? "bg-green-100 border-green-400 text-green-500 animate__animated animate__bounceIn"
              : props.selected === true
              ? "bg-white border-primary-700 group-hover:border-white text-primary-700 animate__animated animate__bounceIn"
              : "bg-gray-100 border-gray-300 text-gray-500  animate__animated animate__zoomIn"
          } h-10 w-10 rounded-full flex items-center justify-center text-2xl font-bold`}
        >
          {props.completed === true ? (
            <BsCheckCircle className="text-4xl animate__animated animate__bounceIn animate__slow" />
          ) : (
            props.number
          )}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold">{props.title}</div>
        <div className="text-xs text-gray-500">{props.description}</div>
      </div>
    </div>
  );
};

interface PageTitleProps {
  selectedStep: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS";
  onSetStep: (step: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS") => void;
  onGoBackToList?: () => void;
  isStepActive: (
    step: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS"
  ) => boolean;
  action: "CREATE" | "UPDATE";
  selectedTrainingPlanName?: string;
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-5 truncate">
          <div className="flex flex-row items-center gap-2 truncate">
            <BackButton
              title={"Back"}
              className="bg-primary-50 hover:bg-primary-100 text-primary-800"
              onClick={props.onGoBackToList}
            />
            <div className="truncate">
              <div className="text-lg font-bold">
                {props.action === "CREATE"
                  ? "Create new training plan"
                  : "Update Selected Training plan"}
              </div>
              <div className="text-sm font-light truncate">
                {props.selectedTrainingPlanName !== undefined
                  ? props.selectedTrainingPlanName
                  : "Complete both of the steps to create new training plan"}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <StepComponent
                title={
                  props.action === "CREATE"
                    ? "Create training plan"
                    : "Update Training Plan"
                }
                description={"Fill the form to create training plan"}
                number={1}
                completed={props.isStepActive("CREATE_TRAINING_PLAN")}
                selected={
                  props.selectedStep === "CREATE_TRAINING_PLAN" ? true : false
                }
                onClick={() => props.onSetStep("CREATE_TRAINING_PLAN")}
              />
            </div>
            <div className="col-span-6">
              <StepComponent
                title={
                  props.action === "CREATE"
                    ? "Add Participants"
                    : "Participants list"
                }
                description={"Assign participants to training"}
                number={2}
                completed={props.isStepActive("ASSIGN_PARTICIPANTS")}
                selected={
                  props.selectedStep === "ASSIGN_PARTICIPANTS" ? true : false
                }
                onClick={() => props.onSetStep("ASSIGN_PARTICIPANTS")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
