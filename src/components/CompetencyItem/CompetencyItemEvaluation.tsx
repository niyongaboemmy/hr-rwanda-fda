import React from "react";
import {
  EmployeeBehavior,
  PositionCompetencyFormatInterface,
} from "../../actions";
import { NoResultFound } from "../Fragments/NoResultFound";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { AiTwotoneDislike, AiTwotoneLike } from "react-icons/ai";

export const ProficiencyLevelComponent = (props: {
  proficiency_level_id: string;
  proficiency_name: string;
}): JSX.Element => {
  return (
    <div
      className={`text-sm px-2 py-0 rounded-full font-light w-max ${
        props.proficiency_level_id.toString() === "3"
          ? "bg-green-100 text-green-700"
          : props.proficiency_level_id.toString() === "2"
          ? "bg-primary-100 text-primary-800"
          : "bg-gray-200 text-black"
      }`}
    >
      {props.proficiency_name}
    </div>
  );
};

export const ValidatePositionBehavior = (
  position_behavior: {
    behavior_id: string;
    competency_type_id: string;
  },
  employee_behaviors: EmployeeBehavior[]
): boolean => {
  if (
    employee_behaviors.find(
      (itm) =>
        itm.behavior_id.toString() ===
          position_behavior.behavior_id.toString() &&
        parseInt(position_behavior.competency_type_id) <=
          parseInt(itm.proficiency_level_id)
    ) !== undefined
  ) {
    return true;
  }
  return false;
};

export const ValidatePositionCompetency = (
  position_behavior: {
    behavior_id: string;
    competency_type_id: string;
  }[],
  employee_behaviors: EmployeeBehavior[]
): boolean => {
  if (
    position_behavior.find(
      (itm) => ValidatePositionBehavior(itm, employee_behaviors) === false
    ) === undefined
  ) {
    return true;
  }
  return false;
};

const CompetencyItemEvaluation = (props: {
  competency: PositionCompetencyFormatInterface;
  employee_behaviors: EmployeeBehavior[];
}): JSX.Element => {
  return (
    <div className="mb-3">
      <div className="border-b border-blue-200 bg-white py-3 md:py-5 md:px-0 md:pb-2">
        <div className="flex flex-row gap-3 items-start">
          <div className="flex flex-row items-center gap-2">
            <div>
              {ValidatePositionCompetency(
                props.competency.behaviors.map((item) => ({
                  behavior_id: item.behavior_id,
                  competency_type_id: item.competency_type_id,
                })),
                props.employee_behaviors
              ) === true ? (
                // <div className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-green-500">
                <AiTwotoneLike className="text-3xl text-green-500" />
              ) : (
                // </div>
                // <div className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-red-500">
                <AiTwotoneDislike className="text-3xl text-red-600" />
                // </div>
              )}
            </div>
          </div>
          <div>
            <div className="w-full">
              <div className="font-bold mb-2 mt-1">
                {props.competency.domain_name}
              </div>
              <div className="text-sm w-full">
                {props.competency.behaviors.length === 0 ? (
                  <div>
                    <NoResultFound />
                  </div>
                ) : (
                  props.competency.behaviors.map((behavior, b) => (
                    <div
                      key={b + 1}
                      className="flex flex-row items-center justify-between gap-3 w-full mb-2"
                    >
                      <div className="flex flex-row items-center gap-2">
                        <div>
                          {ValidatePositionBehavior(
                            {
                              behavior_id: behavior.behavior_id,
                              competency_type_id: behavior.competency_type_id,
                            },
                            props.employee_behaviors
                          ) === true ? (
                            <BsCheckCircle className="text-2xl text-green-500" />
                          ) : (
                            <MdOutlineDoNotDisturbAlt className="text-2xl text-red-600" />
                          )}
                        </div>
                        <div className="">{behavior.behavior_name}</div>
                      </div>
                      <div>
                        <ProficiencyLevelComponent
                          proficiency_level_id={behavior.proficiency_level_id}
                          proficiency_name={behavior.proficiency_level}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyItemEvaluation;
