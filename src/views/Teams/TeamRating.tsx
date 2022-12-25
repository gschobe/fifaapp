import Rating from "@mui/material/Rating";
import React from "react";
import { storeConnector, StoreProps } from "store/StoreReducer";

export interface TeamRatingProps {
  id: string;
  value: number;
  readOnly: boolean;
}

const TeamRating: React.FC<TeamRatingProps & StoreProps> = ({
  id,
  value,
  readOnly,
  updateTeamRating,
}) => {
  const [v, setValue] = React.useState(value);
  const onChange = React.useCallback((event: any, newValue: number | null) => {
    setValue(newValue || 0);
    updateTeamRating({ id: id, rating: newValue || 0 });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Rating
        key={`${id}_rating`}
        precision={0.5}
        value={v}
        onChange={onChange}
        size="medium"
        readOnly={readOnly}
        // onChangeActive={(event, newHover) => {
        //   setLabel(newHover);
        // }}
      />
    </div>
  );
};

export default storeConnector(TeamRating);
