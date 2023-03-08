import React, { Component } from "react";
import { EmployeeLeaveInterface } from "../../actions";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import { EmployeeLeaveItem } from "./EmployeeLeaveItem";

interface EmployeeLeavesListProps {
  leaves: EmployeeLeaveInterface[];
  RemoveLeave?: (item: EmployeeLeaveInterface) => void;
  setRemovingItem?: (item: EmployeeLeaveInterface) => void;
  removingLeave?: EmployeeLeaveInterface | null;
  allowed_to_validate: boolean;
  onValidate?: (item: EmployeeLeaveInterface) => void;
}
interface EmployeeLeavesListState {}

export class EmployeeLeavesList extends Component<
  EmployeeLeavesListProps,
  EmployeeLeavesListState
> {
  render() {
    return (
      <div className="mt-6 animate__animated animate__fadeIn">
        {this.props.leaves.length === 0 ? (
          <NoResultFound />
        ) : (
          <div className="w-full">
            {this.props.leaves.map((item, i) => (
              <EmployeeLeaveItem
                key={i + 1}
                allowed_to_validate={true}
                item={item}
                onValidate={this.props.onValidate}
                RemoveLeave={this.props.RemoveLeave}
                removingLeave={this.props.removingLeave}
                setRemovingItem={this.props.setRemovingItem}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
