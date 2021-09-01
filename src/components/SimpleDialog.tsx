import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import EmailForm from "./EmailForm";

const emails = ["username@gmail.com", "user02@gmail.com"];
export interface EmailDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function EmailDialog(props: EmailDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <EmailForm />
    </Dialog>
  );
}

export default function SimpleDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Want to work with me?
      </Button>
      <EmailDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
