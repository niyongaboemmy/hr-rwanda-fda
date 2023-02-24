import React, { Component } from "react";
import { connect } from "react-redux";
import {
  FC_GetPositionCompetencies,
  GetPositionFormattedCompetency,
  PositionInterface,
  PositionStore,
} from "../../actions";
import { StoreState } from "../../reducers";
import CompetencyItem from "../CompetencyItem/CompetencyItem";
import { NoResultFound } from "../Fragments/NoResultFound";
import Loading from "../Loading/Loading";

interface PositionCompetenciesProps {
  selectedPosition: PositionInterface;
  position: PositionStore;
  FC_GetPositionCompetencies: (
    position_id: string,
    callback: (loading: boolean, error: string) => void
  ) => void;
}
interface PositionCompetenciesState {}

class _PositionCompetencies extends Component<
  PositionCompetenciesProps,
  PositionCompetenciesState
> {
  componentDidMount(): void {
    if (this.props.selectedPosition.competency === undefined) {
      this.props.FC_GetPositionCompetencies(
        this.props.selectedPosition.position_id,
        (loading: boolean, error: string) => {}
      );
    }
  }
  render() {
    if (this.props.selectedPosition.competency === undefined) {
      return <Loading />;
    }
    return (
      <div>
        {GetPositionFormattedCompetency(
          this.props.selectedPosition.competency !== undefined
            ? this.props.selectedPosition.competency
            : []
        ).length === 0 ? (
          <div>
            <NoResultFound />
          </div>
        ) : (
          GetPositionFormattedCompetency(
            this.props.selectedPosition.competency !== undefined
              ? this.props.selectedPosition.competency
              : []
          ).map((competency, c) => (
            <CompetencyItem competency={competency} key={c + 1} />
          ))
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  position,
}: StoreState): {
  position: PositionStore;
} => {
  return { position };
};

export const PositionCompetencies = connect(mapStateToProps, {
  FC_GetPositionCompetencies,
})(_PositionCompetencies);
