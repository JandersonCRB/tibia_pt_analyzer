import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const PartyHuntInput = ({ submit, onChange, ptText }) => {
  return (
    <Grid
      container
      justify="center"
      alignItems={"center"}
      style={{ minHeight: "100vh"}}
    >
      <form onSubmit={submit} style={{width: '50%'}}>
        <Grid container direction="column" justify="center" >
          <TextField variant="outlined" multiline rows={25} cols={20} onChange={onChange} value={ptText} />
          <Button type="submit" variant="contained" color="primary" style={{marginTop: 15}}>Enviar</Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default PartyHuntInput;
