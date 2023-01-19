import React, { ReactElement, ReactNode } from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

interface Props {
  disabled: boolean;
  error?: boolean;
  value?: any[];
  onChange: (e: any) => void;
  menuItems: ReactElement[];
  labelText: string;
  renderValue?: (selected: any) => ReactNode;
}

const MultiSelect: React.FC<Props> = ({
  disabled,
  error = false,
  value = [],
  onChange,
  menuItems,
  labelText,
  renderValue = (selected: any) => selected.join(", "),
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <FormControl
      style={{ width: "90%", marginTop: "10px" }}
      disabled={disabled}
    >
      <InputLabel style={{ paddingLeft: "5px" }}>{labelText}</InputLabel>
      <Select
        id="select-ratings"
        multiple
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        error={error}
        value={value}
        onChange={onChange}
        renderValue={renderValue}
      >
        {menuItems.map((mi) => mi)}
        <MenuItem>
          <Button
            onClick={() => setOpen(false)}
            color="primary"
            variant="contained"
          >
            CONFIRM
          </Button>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
