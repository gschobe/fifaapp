import React from "react";
import { Stack, Switch, Typography, Box } from "@mui/material";

interface Props {
  checked: boolean;
  onChange: (event: any) => void;
  disabled?: boolean;
  uncheckedText?: string;
  checkedText?: string;
}

const DataSwitch: React.FC<Props> = ({
  checked,
  onChange,
  disabled = false,
  uncheckedText = "CURRENT",
  checkedText = "ALL",
}) => {
  return (
    <Stack direction="row" width="110pt">
      <Typography fontSize={14} alignSelf="center">
        {uncheckedText}
      </Typography>
      <Box flex={1} />
      <Switch
        color="default"
        checked={checked}
        onChange={onChange}
        size="small"
        disabled={disabled}
      />
      <Box flex={1} />
      <Typography fontSize={14} alignSelf="center">
        {checkedText}
      </Typography>
    </Stack>
  );
};

export default DataSwitch;
