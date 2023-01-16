import React from "react";
import { Stack, Switch, Typography, Box, SwitchProps } from "@mui/material";

interface Props {
  checked: boolean;
  onChange: (event: any) => void;
  disabled?: boolean;
  uncheckedText?: string;
  checkedText?: string;
  color?: SwitchProps["color"];
}

const DataSwitch: React.FC<Props> = ({
  checked,
  onChange,
  disabled = false,
  uncheckedText = "CURRENT",
  checkedText = "ALL",
  color = "default",
}) => {
  return (
    <Stack direction="row" width="auto">
      <Typography fontSize={14} alignSelf="center">
        {uncheckedText}
      </Typography>
      <Box flex={1} margin="0 3pt" />
      <Switch
        color={color}
        checked={checked}
        onChange={onChange}
        size="small"
        disabled={disabled}
      />
      <Box flex={1} margin="0 3pt" />
      <Typography fontSize={14} alignSelf="center">
        {checkedText}
      </Typography>
    </Stack>
  );
};

export default DataSwitch;
