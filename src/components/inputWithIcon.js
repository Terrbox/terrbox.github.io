import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function InputWithIcon() {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", width: 24 }}>
      <TextField id="input-with-sx" label="AC" variant="standard" />
    </Box>
  );
}
