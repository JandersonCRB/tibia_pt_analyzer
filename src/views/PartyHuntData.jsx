import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Schedule from "@material-ui/icons/Schedule";

const PartyHuntData = ({ ptData }) => {
  console.log(ptData);
  return (
    <Grid
      container
      direction="column"
      style={{ background: "#BABACA", minHeight: "100vh" }}
    >
      <Grid
        container
        justify="center"
        style={{
          padding: 20,
        }}
      >
        <Paper
          style={{
            minWidth: "80%",

            padding: 20,
          }}
        >
          <Grid container direction="row" justify="center">
            <Typography variant="h4">Resultado da hunt</Typography>
          </Grid>
          <Grid container direction="row">
            <Grid container direction="column">
              <Grid container direction="row">
                <Schedule />
                <Typography>
                  {"Tempo: " +
                    String(Math.floor(ptData.time / 60)).padStart(2, "0") +
                    ":" +
                    String(ptData.time % 60).padStart(2, "0")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <PlayersContainer chars={ptData.chars} />
    </Grid>
  );
};

const PlayersContainer = ({ chars }) => {
  return (
    <div style={{ padding: "0 12px" }}>
      <Grid container style={{ padding: "50px 20px" }} spacing={3}>
        {chars.map((char) => (
          <PartyHuntPlayer key={char.name} char={char} />
        ))}
      </Grid>
    </div>
  );
};

const PartyHuntPlayer = ({ char }) => {
  console.log(char);
  return (
    <Grid item xs={4}>
      <Paper style={{ padding: "20px 20px" }}>
        <Grid container direction="column" alignContent="center">
          <h4>{char.name}</h4>
          {char.transfers.map((transfer, i) => <TransferMessage key={i} transfer={transfer} />)}
        </Grid>
      </Paper>
    </Grid>
  );
};

const TransferMessage = ({ transfer }) => {
  if (transfer.type !== "give") {
    return null;
  }
  return <div>transfer {parseInt(transfer.value, 10)} to {transfer.from.name}</div>;
};

export default PartyHuntData;
