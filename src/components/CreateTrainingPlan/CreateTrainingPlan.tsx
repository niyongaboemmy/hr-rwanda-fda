import React, { Component } from "react";
import { connect } from "react-redux";
import { Auth, TrainingStore } from "../../actions";
import { StoreState } from "../../reducers";
import { TrainingPlanParticipants } from "./TrainingPlanParticipants";
import PageTitle from "./PageTitle";
import { TrainingPlanForm, TrainingPlanTempData } from "./TrainingPlanForm";

interface CreateTrainingPlanProps {
  onGoBack?: (reload: boolean) => void;
  temp_data: TrainingPlanTempData | undefined;
}
interface CreateTrainingPlanState {
  loading: boolean;
  step: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS";
  action: "CREATE" | "UPDATE";
  temp_data: TrainingPlanTempData | undefined;
  step2Completed: boolean;
}

class _CreateTrainingPlan extends Component<
  CreateTrainingPlanProps,
  CreateTrainingPlanState
> {
  constructor(props: CreateTrainingPlanProps) {
    super(props);

    this.state = {
      loading: false,
      step:
        this.props.temp_data !== undefined
          ? "ASSIGN_PARTICIPANTS"
          : "CREATE_TRAINING_PLAN",
      action: this.props.temp_data !== undefined ? "UPDATE" : "CREATE",
      temp_data: this.props.temp_data,
      step2Completed: false,
    };
  }
  validateStep = (
    selectedStep: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS"
  ): boolean => {
    if (this.state.step2Completed === true) {
      return true;
    }
    if (selectedStep === "CREATE_TRAINING_PLAN") {
      if (this.state.temp_data !== undefined) {
        return true;
      }
    }
    return false;
  };
  render() {
    return (
      <div>
        <div>
          <PageTitle
            selectedStep={this.state.step}
            onSetStep={(
              selectedStep: "CREATE_TRAINING_PLAN" | "ASSIGN_PARTICIPANTS"
            ) => this.setState({ step: selectedStep })}
            onGoBackToList={() =>
              this.props.onGoBack !== undefined && this.props.onGoBack(true)
            }
            isStepActive={this.validateStep}
            action={this.state.action}
            selectedTrainingPlanName={
              this.state.temp_data === undefined
                ? undefined
                : this.state.temp_data.title
            }
          />
          {/* body */}
          {this.state.step === "CREATE_TRAINING_PLAN" && (
            <TrainingPlanForm
              onSubmit={(data: TrainingPlanTempData) => {
                this.setState({ temp_data: data, step: "ASSIGN_PARTICIPANTS" });
              }}
              temp_data={this.state.temp_data}
            />
          )}
          {this.state.step === "ASSIGN_PARTICIPANTS" && (
            <div className="mt-3 pt-3 border-t">
              {this.state.temp_data !== undefined && (
                <TrainingPlanParticipants
                  selected_training_plan_id={
                    this.state.temp_data.training_plan_id
                  }
                  setStepCompleted={() =>
                    this.setState({ step2Completed: true })
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
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

export const CreateTrainingPlan = connect(
  mapStateToProps,
  {}
)(_CreateTrainingPlan);
