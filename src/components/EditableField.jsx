import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";

const EditableField = ({ initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onSave(value);
    setEditMode(false);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {editMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
      {editMode ? (
        <IconButton size="small" sx={{ color: "green" }} onClick={handleSave}>
          <EditIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton size="small" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
};
export default EditableField;
