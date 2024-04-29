

	
	
	import React, { useState, useCallback } from "react";
  import { useDropzone } from "react-dropzone";
  import Papa from "papaparse";
  import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Box,
    Snackbar,
    IconButton,
  } from '@mui/material';
  import DescriptionIcon from '@mui/icons-material/Description';
  import DeleteIcon from '@mui/icons-material/Delete';
  import MuiAlert from '@mui/material/Alert';
  import Dialog from '@mui/material/Dialog';
  import DialogTitle  from '@mui/material/DialogTitle';
  import DialogContent   from '@mui/material/DialogContent';
  import DialogContentText   from '@mui/material/DialogContentText';
  import DialogActions   from '@mui/material/DialogActions';
  
  
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const CombineCSVs = () => {
    const [baseFile, setBaseFile] = useState(null);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    const onDrop = useCallback(async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        await new Promise((resolve) => {
          Papa.parse(file, {
            complete: (results) => {
              if (!baseFile) {
                setBaseFile(file);
                setHeaders(results.data[0]);
                setFiles((prevFiles) => [...prevFiles, file]);
              } else {
                if (JSON.stringify(results.data[0]) === JSON.stringify(headers)) {
                  setFiles((prevFiles) => [...prevFiles, file]);
                } else {
                  alert("This file does not have the same headers as the rest, you cannot add this file");
                }
              }
              resolve();
            }
          });
        });
      }
    }, [baseFile, headers]);
  
  
    const combineFiles = async () => {
      if (files.length === 0) {
        setDialogOpen(true);
        return;
      }
  
      const allFilesData = await Promise.all(
        files.map((file, index) =>
          new Promise((resolve) => {
            Papa.parse(file, {
              complete: (results) => {
                if (index !== 0) results.data.shift(); // This line skips the first line (headers) for all files except the first
                resolve(results.data);
              },
            });
          })
        )
      );
      const csvContent = Papa.unparse(allFilesData.flat());
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "combined.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
  
    const handleDelete = (file) => {
      setFiles(prevFiles => {
        const newFiles = prevFiles.filter(f => f !== file);
        if (newFiles.length === 0) { // no files left
          setBaseFile(null);
          setHeaders([]);
        }
        return newFiles;
      });
    }
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
    const clearFiles = () => {
      setBaseFile(null);
      setHeaders([]);
      setFiles([]);
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
    return (
      <Box border={1} borderColor="grey.500" borderRadius="borderRadius" p={3} my={3}>
  <div {...getRootProps()} style={{ height: "100px", border: "2px dashed gray", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>        <input {...getInputProps()} />
          <p>Drag and drop your CSV files here or simply click to select files.
  </p>
        </div>
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
  >
      <DialogTitle>{"No Files to Combine"}</DialogTitle>
      <DialogContent>
          <DialogContentText>
              There are no files to combine.
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
              OK
          </Button>
      </DialogActions>
  </Dialog>
        <List component="nav" aria-label="file list">
          {files.map((file) => (
            <ListItem key={file.path}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={file.path} />
              <IconButton edge="end" onClick={() => handleDelete(file)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
    
        <Button variant="contained" color="primary" onClick={combineFiles}>Combine</Button>
        <Button variant="contained" color="secondary" onClick={clearFiles} style={{ marginLeft: 10 }}>Clear</Button>
  
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            There are no files to combine.
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  
  export default CombineCSVs;