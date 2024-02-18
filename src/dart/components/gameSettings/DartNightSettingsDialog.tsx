import { Tab } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Tabs,
  TextField,
} from "@mui/material";
import { DartNight } from "dart/Definitions";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  open: boolean;
  dartNight: DartNight;
  cancel: () => void;
}

const DartNightSettingsDialog: React.FC<Props> = ({
  open,
  dartNight,
  cancel,
  changeSettings,
}) => {
  const [settings, setSettings] = React.useState(dartNight.settings);
  const [tab, setTab] = React.useState("SINGLE");
  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{`Dart Abend - Einstellungen`}</DialogTitle>
      <DialogContent>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_event, value) => value && setTab(value)}
        >
          <Tab value={"SINGLE"} label="Einzelspiel" />
          <Tab value={"TOURNAMENT"} label="Turnier" />
        </Tabs>
        {tab === "SINGLE" && (
          <div
            style={{
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
              columnGap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 6,
              }}
            >
              {settings.money.map((rankMoney) => {
                return (
                  <div
                    key={rankMoney.rank}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 5,
                    }}
                  >
                    <div>{`Platz ${rankMoney.rank}: `}</div>
                    <TextField
                      type="number"
                      size="small"
                      sx={{ width: "100px", textAlign: "center" }}
                      value={
                        settings.money.find((m) => m.rank === rankMoney.rank)
                          ?.money ?? 0
                      }
                      onChange={(event) => {
                        const moneyNew = [...settings.money];
                        const index = moneyNew.findIndex(
                          (m) => m.rank === rankMoney.rank
                        );
                        moneyNew[index] = {
                          rank: rankMoney.rank,
                          money: Number(event.target.value),
                        };
                        setSettings({ ...settings, money: moneyNew });
                      }}
                      inputMode="numeric"
                      inputProps={{ step: 0.5 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 6,
              }}
            >
              {settings.money.map((rankMoney) => {
                return (
                  <div
                    key={rankMoney.rank}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 5,
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      sx={{ width: "100px", textAlign: "center" }}
                      value={
                        settings.money.find((m) => m.rank === rankMoney.rank)
                          ?.points ?? 0
                      }
                      onChange={(event) => {
                        const moneyNew = [...settings.money];
                        const index = moneyNew.findIndex(
                          (m) => m.rank === rankMoney.rank
                        );
                        moneyNew[index] = {
                          ...rankMoney,
                          points: Number(event.target.value),
                        };
                        setSettings({ ...settings, money: moneyNew });
                      }}
                      inputMode="numeric"
                      inputProps={{ step: 1 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Pkt</InputAdornment>
                        ),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            cancel();
          }}
        >
          Abbrechen
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            changeSettings({ dartNightId: dartNight.id, settings: settings });
            cancel();
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default dartConnector(DartNightSettingsDialog);
