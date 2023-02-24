import React from "react";
import { PositionCompetencyFormatInterface } from "../../actions";
import { BiLike } from "react-icons/bi";
import { NoResultFound } from "../Fragments/NoResultFound";
import { BsCheckCircle } from "react-icons/bs";

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
          ? "bg-gray-500 text-white"
          : "bg-red-100 text-red-700"
      }`}
    >
      {props.proficiency_name}
    </div>
  );
};

const CompetencyItem = (props: {
  competency: PositionCompetencyFormatInterface;
}) => {
  return (
    <div className="mb-3">
      <div className="rounded-md border border-blue-200 bg-white p-3 md:p-5">
        <div className="flex flex-row gap-3">
          <div>
            <BiLike className="text-2xl" />
          </div>
          <div className="w-full">
            <div className="font-bold mb-3">{props.competency.domain_name}</div>
            <div className="text-sm w-full">
              {props.competency.behaviors.length === 0 ? (
                <div>
                  <NoResultFound />
                </div>
              ) : (
                props.competency.behaviors.map((behavior, b) => (
                  <div
                    key={b + 1}
                    className="flex flex-row items-center justify-between gap-3 w-full"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div>
                        <BsCheckCircle className="text-xl" />
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
  );
};

export default CompetencyItem;
