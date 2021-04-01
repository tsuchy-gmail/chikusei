import { useState, useCallback } from "react";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import Button from "@material-ui/core/Button";
import { chikusei, myOrganization } from "./organization";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import LabelImportantRoundedIcon from "@material-ui/icons/LabelImportantRounded";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import TimerIcon from "@material-ui/icons/Timer";
import Person from "@material-ui/icons/Person";

const organization = chikusei;
const LoogiaURL = "https://dev.loogia.tech/api/v0/projects";
const solutionURL = (id) => LoogiaURL + "/" + id + "/" + "solution";
const fetchPostOption = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Loogia-App-Id": organization.AppID,
    "X-Loogia-API-Key": organization.ApiKey,
  },
  mode: "cors",
};
const fetchGetOption = {
  headers: {
    "Content-Type": "application/json",
    "X-Loogia-App-Id": organization.AppID,
    "X-Loogia-API-Key": organization.ApiKey,
  },
};

const fmsPostOption = {
  mode: "same-origin",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {},
};

const requestBody = {
  name: "Tier4-筑西市",
  depot: {
    name: "スタート地点",
    //geocode: { lat: 36.322318, lng: 139.994189 },
    geocode: { lat: 36.32247, lng: 139.99437 },
  },
  carriers: [
    {
      id: "car1",
    },
  ],
  spots: [],
  jobs: [],
};

let month = new Date().getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}
let date = new Date().getDate();
if (date < 10) {
  date = "0" + date;
}
const toISO = (str) => "2021" + month + date + "T" + str + "00+0900";
const initialName = month + "月" + date + "日のプロジェクト";

const spotsInNagoya = new Map([
  ["名古屋駅", { lat: 35.171371, lng: 136.88188 }],
  ["伏見駅", { lat: 35.1694, lng: 136.897077 }],
  ["栄駅", { lat: 35.169936, lng: 136.909219 }],
  ["矢場町駅", { lat: 35.163643, lng: 136.909352 }],
  ["大曽根駅", { lat: 35.19155, lng: 136.93661 }],
  ["千種駅", { lat: 35.170035, lng: 136.93033 }],
  ["鶴舞駅", { lat: 35.15638, lng: 136.917269 }],
  ["金山駅", { lat: 35.142794, lng: 136.900635 }],
  ["名古屋大学", { lat: 35.154004, lng: 136.967833 }],
  ["オプティマインド", { lat: 35.165864, lng: 136.89898 }],
  ["テスト1", { lat: 35.159324, lng: 136.808888 }],
  ["テスト2", { lat: 35.210011, lng: 136.853333 }],
  ["テスト3", { lat: 35.179923, lng: 136.952222 }],
  ["テスト4", { lat: 35.183599, lng: 136.923333 }],
]);
/**
 * とりあえず不要
  [
    "ピックアップ1",
    {
      geocode: { lat: 36.32188580030059, lng: 139.99469793433065 },
      spotId: 3179,
    },
  ],
  [
    "ピックアップ2",
    {
      geocode: { lat: 36.32105002951943, lng: 139.99277072570814 },
      spotId: 520,
    },
  ],
  [
    "ピックアップ3",
    {
      geocode: { lat: 36.32000486821778, lng: 139.99450669389185 },
      spotId: 1128,
    },
  ],
  [
    "ドロップオフ1",
    {
      geocode: { lat: 36.31917669466058, lng: 139.99367187759788 },
      spotId: 1622,
    },
  ],
  [
    "ドロップオフ2",
    {
      geocode: { lat: 36.31999908924234, lng: 139.99373697787138 },
      spotId: 170,
    },
  ],

**/
const spotsData = new Map([
  [
    "広場1",
    {
      geocode: { lat: 36.32252318009725, lng: 139.99366269618343 },
      //spotId: 2237,
      spotId: 2151,
    },
  ],
  [
    "広場2",
    {
      geocode: { lat: 36.32210875352407, lng: 139.9939489607223 },
      //spotId: 4072,
      spotId: 3685,
    },
  ],
  [
    "広場3",
    {
      geocode: { lat: 36.32225523676537, lng: 139.99426288485392 },
      //spotId: 2400,
      spotId: 2299,
    },
  ],
  [
    "セコマ",
    // geocode: { lat: 36.32284253999432, lng: 139.99449705557956 },
    {
      geocode: { lat: 36.322843, lng: 139.994497 },
      //spotId: 1988,
      spotId: 4159,
    },
  ],
  [
    "産直",
    // geocode: { lat: 36.322969947733945, lng: 139.99360406570923 },
    {
      geocode: { lat: 36.32297, lng: 139.993604 },
      //spotId: 2106,
      spotId: 2029,
    },
  ],
  [
    "BBQ場",
    {
      geocode: { lat: 36.32234189423509, lng: 139.9932988585709 },
      //spotId: 2217,
      spotId: 2115,
    },
  ],
  [
    "チョコ",
    // geocode: { lat: 36.32259183382302, lng: 139.9942112262038 },
    {
      geocode: { lat: 36.322592, lng: 139.994211 },
      //spotId: 4111,
      spotId: 3963,
    },
  ],
  [
    "SSゴール",
    //fmsからのデータ
    {
      //DLしたデータ　geocode: { lat: 36.322318, lng: 139.994189 },
      //↓SSBのデータ↓
      geocode: { lat: 36.32241079770609, lng: 139.99436800405215 },
      //geocode: { lat: 36.32247093891628, lng: 139.99431240609871 },
      //spotId: 4399,
      spotId: 3942,
    },
  ],
  [
    "SSゴールB",
    {
      geocode: { lat: 36.32241079770609, lng: 139.99436800405215 },
      //spotId: 4133,
      spotId: 3785,
    },
  ],
  [
    "STCゴール",
    {
      geocode: { lat: 36.32243574033299, lng: 139.99434376738662 },
      //spotId: 4156,
      spotId: 3808,
    },
  ],
]);

let spotNames = [];
let spotIDs = [];
let k = 1;
let allSpots = [];
spotsData.forEach((value, key) => {
  allSpots.push({
    name: key,
    id: String(k++),
    geocode: value.geocode,
  });
  spotNames.push(key);
  spotIDs.push(value.spotId);
});

/**spotsInNagoya.forEach((value, key) => {
  requestBody.spots.push({ name: key, id: String(k++), geocode: value });
  spotNames.push(key);
  spotIDs.push(value.spotId)
});
**/

function App() {
  const [pickupSpot, setPickupSpot] = useState(
    new Array(rowNumber).fill(null, 0)
  );
  const [deliverySpot, setDeliverySpot] = useState(
    new Array(rowNumber).fill(null, 0)
  );
  const [pickupServiceDuration, setPickupServiceDuration] = useState(
    new Array(rowNumber).fill(null, 0)
  );
  const [deliveryServiceDuration, setDeliveryServiceDuration] = useState(
    new Array(rowNumber).fill(null, 0)
  );
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");

  const [text, setText] = useState(initialName);

  const handleChangePickup = useCallback((e, index) => {
    pickupSpot.splice(index, 1, e.target.value);
    setPickupSpot([...pickupSpot]);
  }, []);
  const handleChangeDelivery = useCallback((e, index) => {
    deliverySpot.splice(index, 1, e.target.value);
    setDeliverySpot([...deliverySpot]);
  }, []);
  const handleChangePickupTime = useCallback((e, index) => {
    pickupServiceDuration.splice(index, 1, e.target.value);
    setPickupServiceDuration([...pickupServiceDuration]);
  }, []);
  const handleChangeDeliveryTime = useCallback((e, index) => {
    deliveryServiceDuration.splice(index, 1, e.target.value);
    setDeliveryServiceDuration([...deliveryServiceDuration]);
  }, []);
  const handleChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleChangeHour = useCallback((e) => {
    setStartHour(e.target.value);
  }, []);
  const handleChangeMinute = useCallback((e) => {
    setStartMinute(e.target.value);
  }, []);

  return (
    <div>
      <Logo />
      <HeaderBackground />
      <ProjectName text={text} handleChangeText={handleChangeText} />
      <StartTime
        startHour={startHour}
        handleChangeHour={handleChangeHour}
        startMinute={startMinute}
        handleChangeMinute={handleChangeMinute}
      />
      <ListOfCombinations
        pickupSpot={pickupSpot}
        deliverySpot={deliverySpot}
        handleChangePickup={handleChangePickup}
        handleChangeDelivery={handleChangeDelivery}
        pickupServiceDuration={pickupServiceDuration}
        deliveryServiceDuration={deliveryServiceDuration}
        handleChangePickupTime={handleChangePickupTime}
        handleChangeDeliveryTime={handleChangeDeliveryTime}
      />
      <PostAndGet
        startHour={startHour}
        startMinute={startMinute}
        projectName={text}
        pickupSpot={pickupSpot}
        deliverySpot={deliverySpot}
        pickupServiceDuration={pickupServiceDuration}
        deliveryServiceDuration={deliveryServiceDuration}
      />
    </div>
  );
}

const Logo = React.memo(() => {
  const src =
    "https://jp.techcrunch.com/wp-content/uploads/2019/10/optimind_logo-e1572066384165.png?resize=2048,348";

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <img
        src={src}
        style={{
          width: "180px",
          height: "32px",
          position: "relative",
          top: "68px",
          marginTop: "-52px",
          marginRight: "25px",
        }}
      />
    </div>
  );
});

const fonts = {
  alphabet: "'Playfair Display', serif",
  robot: "'Roboto', sans-serif",
  kaisyo: "'Noto Serif JP', serif",
  jp: "'Noto Sans JP', sans-serif",
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function CustomizedSnackbars() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return <div className={classes.root}></div>;
}
const colors = {
  primaryColor: "#2A68C9",
  loogia: "#01A0EB",
};

let rowNumber = 8;

function PaperBack({ width, height, margin, elevation }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        width: width ? width : "300px",
        height: height ? height : theme.spacing(8),
      },
    },
  }));

  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        width: width ? width : "300px",
        margin: margin ? margin : "0 auto",
      }}
    >
      <Paper elevation={elevation ? elevation : 5} />
    </div>
  );
}

const HeaderBackground = React.memo(() => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        width: "100%",
        height: theme.spacing(8),
      },
    },
  }));

  const classes = useStyles();
  const styleOfBackgoround = {
    background: colors.primaryColor,
  };
  const returnPaper = (elevation) => <Paper square elevation={elevation} />;

  return (
    <>
      <CustomizedSnackbars />
      <div
        className={classes.root}
        style={{ display: "flex", alignItems: "center" }}
      >
        {returnPaper(8)}
        <div
          style={{
            display: "flex",
            height: "40px",
            position: "absolute",
            fontSize: "25px",
            color: "#181A1F",
          }}
        >
          <DescriptionOutlinedIcon
            fontSize="large"
            color="primary"
            style={{
              margin: "3px 12px",
              marginRight: "3px",
              color: colors.loogia,
            }}
          />
          <div
            style={{
              color: "#181A1F",
              fontFamily: fonts.jp,
              letterSpacing: "1px",
              fontWeight: 700,
              marginTop: "1px",
            }}
          >
            配送依頼入力フォーム
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
});
const ListOfCombinations = React.memo(
  ({
    pickupSpot,
    deliverySpot,
    handleChangePickup,
    handleChangeDelivery,
    pickupServiceDuration,
    deliveryServiceDuration,
    handleChangePickupTime,
    handleChangeDeliveryTime,
  }) => {
    const styleOfCombination = {
      display: "flex",
      maxWidth: "830px",
      margin: "0 auto",
      position: "relative",
      top: "19px",
    };
    const styleOfIcon = {
      marginTop: "20px",
      color: "#757575",
    };

    const styleOfText = {
      fontFamily: fonts.jp,
      marginTop: "16px",
      position: "relative",
      right: "50px",
      minWidth: "50px",
    };
    const styleOfPaper = {
      position: "relative",
      top: "86px",
    };
    const styleOfRow = {
      marginTop: "-30px",
    };

    const combinationOfSpots = (index) => (
      <div style={styleOfRow}>
        <div style={styleOfPaper}>
          <PaperBack width="1000px" height="80px" elevation="3" />
        </div>
        <div style={styleOfCombination}>
          <div style={styleOfText}>注文{index + 1}</div>
          <SelectSpot
            value={pickupSpot[index]}
            setValue={(e) => handleChangePickup(e, index)}
            label={"pickup"}
          />
          <SelectDuration
            value={pickupServiceDuration[index]}
            setValue={(e) => handleChangePickupTime(e, index)}
          />
          <TrendingFlatIcon fontSize="large" style={styleOfIcon} />
          <SelectSpot
            value={deliverySpot[index]}
            setValue={(e) => handleChangeDelivery(e, index)}
            label={"delivery"}
          />
          <SelectDuration
            value={deliveryServiceDuration[index]}
            setValue={(e) => handleChangeDeliveryTime(e, index)}
          />
        </div>
      </div>
    );

    const heightAndTop = "980px";

    return (
      <div style={{ marginTop: "-50px" }}>
        <div
          style={{
            position: "relative",
            width: "980px",
            margin: "0 auto",
            top: "50px",
            right: "40px",
            fontFamily: fonts.robot,
            fontSize: "30px",
          }}
        >
          <EmojiTransportationIcon
            fontSize="large"
            style={{
              position: "relative",
              top: "9px",
              marginRight: "12px",
              color: "#01A0EB",
            }}
          />
          jobs
        </div>
        <PaperBack width="1100px" height={heightAndTop} />
        <div
          style={{
            marginTop: "-970px",
          }}
        >
          {combinationOfSpots(0)}
          {combinationOfSpots(1)}
          {combinationOfSpots(2)}
          {combinationOfSpots(3)}
          {combinationOfSpots(4)}
          {combinationOfSpots(5)}
          {combinationOfSpots(6)}
          {combinationOfSpots(7)}
        </div>
      </div>
    );
  }
);

function CircularIndeterminate() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}

function Header() {
  const styleOfHeader = {
    width: "100%",
    height: "58px",
    boxShadow: "3px",
  };
  return <div style={styleOfHeader}></div>;
}

function SelectSpot({ value, setValue, label }) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(4),
      minWidth: 120,
    },
  }));

  const classes = useStyles();
  const styelOfSelect = {
    width: "200px",
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={setValue}
          style={styelOfSelect}
        >
          <MenuItem value={null}>-</MenuItem>
          {spotNames.map((item, index) => (
            <MenuItem value={index + 1}>
              <b>{item}</b>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function SelectDuration({ value, setValue }) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(0),
      minWidth: 20,
    },
  }));

  const classes = useStyles();
  const styelOfSelect = {
    width: "114px",
  };

  const times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30];

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">作業時間(分)</InputLabel>
        <Select value={value} onChange={setValue} style={styelOfSelect}>
          <MenuItem value={null}>0 (default)</MenuItem>
          {times.map((time) => (
            <MenuItem value={time}>{time}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function SelectTime({ value, setValue, type }) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(0),
      minWidth: 20,
    },
  }));

  const classes = useStyles();
  const styelOfSelect = {
    width: "50px",
    fontSize: "20px",
  };

  let hours = [];
  for (let i = 1; i <= 23; i++) {
    hours.push(i);
  }
  let minutes = [];
  for (let i = 0; i <= 59; i++) {
    minutes.push(i);
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select value={value} onChange={setValue} style={styelOfSelect}>
          {type === "hours" && <MenuItem value={"00"}>0</MenuItem>}
          {type === "hours" &&
            hours.map((hour) => {
              let value;
              if (hour < 10) {
                value = "0" + hour;
              } else {
                value = "" + hour;
              }
              return (
                <MenuItem
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                  value={value}
                >
                  {value}
                </MenuItem>
              );
            })}
          {type === "minutes" &&
            minutes.map((minute) => {
              let value;
              if (minute < 10) {
                value = "0" + minute;
              } else {
                value = "" + minute;
              }
              return (
                <MenuItem
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                  value={value}
                >
                  {value}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
}

const ProjectName = React.memo(({ text, handleChangeText }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "51ch",
      },
    },
  }));
  const classes = useStyles();

  const styleOfTextField = {
    width: "100%",
  };
  const TextFieldWrapper = {
    width: "400px",
    margin: "32px auto 0",
    fontSize: "30px",
  };
  const styleOfFrame = {
    marginBottom: "10px",
  };

  return (
    <div style={styleOfFrame}>
      <PaperBack
        width="1100px"
        height="80px"
        margin="40px auto 0"
        elevation={3}
      />
      <div
        style={{
          position: "relative",
          width: "980px",
          margin: "0 auto",
          top: "-80px",
          marginBottom: "-125px",
          right: "40px",
          fontFamily: fonts.robot,
          fontSize: "30px",
        }}
      >
        <LabelImportantRoundedIcon
          fontSize="large"
          color="primary"
          style={{
            position: "relative",
            top: "10px",
            marginRight: "10px",
            color: "#01A0EB",
          }}
        />
        project name
      </div>
      <div style={TextFieldWrapper}>
        <TextField
          placeholder={initialName}
          InputProps={{ style: { fontSize: "20px", fontWeight: "bold" } }}
          autoComplete="off"
          onBlur={handleChangeText}
          style={styleOfTextField}
          size="medium"
          id="standard-basic"
        />
      </div>
    </div>
  );
});

const StartTime = React.memo(
  ({ startHour, handleChangeHour, startMinute, handleChangeMinute }) => {
    const selectWrapper = {
      width: "50px",
      margin: "-30px auto 0",
      display: "flex",
      position: "relative",
      top: "1px",
    };
    const styleOfColon = {
      marginTop: "14px",
      marginRight: "18px",
      marginLeft: "-15px",
    };
    const styleOfFrame = {
      position: "relative",
      top: "6px",
    };

    return (
      <div style={styleOfFrame}>
        <PaperBack
          width="1100px"
          height="80px"
          margin="28px auto 0"
          elevation={3}
        />
        <div
          style={{
            position: "relative",
            width: "980px",
            margin: "0 auto -80px",
            top: "-80px",
            right: "40px",
            fontFamily: fonts.robot,
            fontSize: "30px",
          }}
        >
          <TimerIcon
            fontSize="large"
            color="primary"
            style={{
              position: "relative",
              top: "10px",
              marginRight: "10px",
              color: "#01A0EB",
            }}
          />
          start time
          <div style={selectWrapper}>
            <SelectTime
              value={startHour}
              setValue={handleChangeHour}
              type="hours"
            />
            <span style={styleOfColon}>:</span>
            <SelectTime
              value={startMinute}
              setValue={handleChangeMinute}
              type="minutes"
            />
          </div>
        </div>
      </div>
    );
  }
);

const PostAndGet = React.memo(
  ({
    projectName,
    pickupSpot,
    deliverySpot,
    pickupServiceDuration,
    deliveryServiceDuration,
    startHour,
    startMinute,
  }) => {
    const [isCalculating, setIsCalculating] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [beforePost, setBeforePost] = React.useState(false);
    const [fms, setFms] = useState(false);

    const postFMS = (routeOrder) => {
      fmsPostOption.body = JSON.stringify({ order: routeOrder });
      fetch("/fms", fmsPostOption)
        .then((data) => data.json())
        .then((data) => {
          setIsFinished(false);
          setFms(true);
          console.log("data = ", data);
        })
        .catch((error) => {
          setIsFinished(false);
          console.log("- error - ", error);
          window.alert("fmsのpostに失敗しました。");
        });
    };
    const handleClick = () => {
      setBeforePost(true);

      const strTime = String(startHour) + String(startMinute);

      requestBody.name = projectName ? projectName : "";
      requestBody.carriers[0].startTime = toISO(strTime);
      requestBody.spots = [];
      requestBody.jobs = [];
      const uniqueNumbers = new Set();

      for (let i = 0; i < rowNumber; i++) {
        if (pickupSpot[i] && deliverySpot[i]) {
          uniqueNumbers.add(pickupSpot[i] - 1);
          uniqueNumbers.add(deliverySpot[i] - 1);
        }
      }

      for (let num of uniqueNumbers) {
        requestBody.spots.push(allSpots[num]);
      }

      for (let i = 0; i < rowNumber; i++) {
        if (pickupSpot[i] && deliverySpot[i]) {
          requestBody.jobs.push({
            name:
              "注文" +
              (i + 1) +
              " (" +
              spotNames[pickupSpot[i] - 1] +
              "  →  " +
              spotNames[deliverySpot[i] - 1] +
              ")",
            id: String(i + 1),
            pickup: {
              spotId: String(pickupSpot[i]),
              serviceDuration: pickupServiceDuration[i]
                ? pickupServiceDuration[i] * 60
                : null,
            },
            delivery: {
              spotId: String(deliverySpot[i]),
              serviceDuration: deliveryServiceDuration[i]
                ? deliveryServiceDuration[i] * 60
                : null,
            },
          });
        }
      }
      console.log("requestBody = ", requestBody);

      function fetchGetTimer(id, time) {
        try {
          setTimeout(async () => {
            const data = await fetch(
              solutionURL(id),
              fetchGetOption
            ).then((data) => data.json());
            if (data.result) {
              if (data.result.carrierRoutes[0]) {
                const route = data.result.carrierRoutes[0].route;
                const routeOrder = new Set();

                route.forEach((spot) => {
                  if (spot.serviceType === "pickup") {
                    const spotNumber = pickupSpot[+spot.id - 1];
                    const spotName = spotNames[spotNumber - 1];
                    routeOrder.add(spotName);
                  }
                  if (spot.serviceType === "delivery") {
                    const spotNumber = deliverySpot[+spot.id - 1];
                    const spotName = spotNames[spotNumber - 1];
                    routeOrder.add(spotName);
                  }
                });
                setIsCalculating(false);
                setIsFinished(true);
                postFMS([...routeOrder]);
                console.log("Order = ", [...routeOrder]);
              } else {
                setIsCalculating(false);
                setIsFinished(false);
                setFms(false);
                window.alert("取得できるjobが存在しません。");
              }
            } else {
              fetchGetTimer(id, 2000);
            }
          }, time);
        } catch (error) {
          console.log("error - ", error);
          window.alert("error - " + error);
        }
      }

      fetchPostOption.body = JSON.stringify(requestBody);
      fetch(LoogiaURL, fetchPostOption)
        .then((response) => {
          if (response.status === 500) {
            setBeforePost(false);
            window.alert("エラー : error 500");
          }
          return response.json();
        })
        .then((data) => {
          const errorMessages = [];
          if (data.status === "error") {
            for (let i = 0; i < data.detail.length; i++) {
              console.log(data.detail[i].message);
              errorMessages.push(data.detail[i].message);
            }
            setBeforePost(false);
            window.alert("エラー :\n" + errorMessages.join("\n"));
          } else {
            console.log("response = ", data);
            setBeforePost(false);
            setIsCalculating(true);
            return data.id;
          }
        })
        .then((id) => fetchGetTimer(id, 9000))
        .catch((error) => {
          setBeforePost(false);
          setIsCalculating(false);
          setIsFinished(false);
          setFms(false);
          console.log("error = ", error);
          window.alert("error :", error);
        });
    };

    const styleOfButton = {
      width: "1100px",
      display: "block",
      margin: "30px auto",
      padding: "30px",
      fontSize: "18px",
      fontWeight: "bold",
    };

    const styleOfButton2 = {
      width: "1100px",
      display: "block",
      margin: "30px auto 0",
      padding: "10px",
      fontSize: "17px",
      fontWeight: "bold",
      color: colors.loogia,
      borderColor: colors.loogia,
    };
    const styleOfButtons = {
      marginTop: "160px",
      marginBottom: "60px",
    };
    const styleOfSendIcon = {
      marginLeft: "5px",
      position: "relative",
      top: "5px",
    };
    const styleOfArrowIcon = {
      marginLeft: "3px",
      position: "relative",
      top: "6px",
    };
    const handleCloseSnackBar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      setIsCalculating(false);
    };

    const handleCloseBackDrop = () => {
      setBeforePost(false);
    };

    return (
      <>
        <div style={styleOfButtons}>
          <Button
            onClick={handleClick}
            style={styleOfButton}
            variant="contained"
            color="primary"
          >
            配送依頼を確定する
            <CheckCircleIcon style={styleOfSendIcon} />
          </Button>
          <Button
            style={styleOfButton2}
            variant="outlined"
            color="primary"
            onClick={() =>
              window.open("https://dev.loogia.tech/app/manager/projects")
            }
          >
            <span style={{ textTransform: "capitalize" }}>Loogia</span>
            で計算結果を見る
            <DoubleArrowIcon style={styleOfArrowIcon} />
          </Button>
        </div>

        <Snackbar
          open={isCalculating}
          onClose={handleCloseSnackBar}
          style={{ display: "flex", alignItems: "baseline" }}
        >
          <Alert onClose={handleCloseSnackBar} icon={false}>
            Loogiaで計算中...
            <CircularProgress
              size={18}
              color="inherit"
              style={{ position: "relative", top: "3px", marginLeft: "6px" }}
            />
          </Alert>
        </Snackbar>
        <Snackbar open={isFinished} onClose={() => setIsFinished(false)}>
          <Alert
            onClose={() => setIsFinished(false)}
            severity="success"
            icon={false}
          >
            計算完了。スケジュールを登録しています...
            <CircularProgress
              size={18}
              color="inherit"
              style={{ position: "relative", top: "3px", marginLeft: "6px" }}
            />
          </Alert>
        </Snackbar>
        <Snackbar
          open={fms}
          autoHideDuration={3000}
          onClose={() => setFms(false)}
        >
          <Alert onClose={() => setFms(false)} severity="success">
            スケジュールの登録が完了しました。
          </Alert>
        </Snackbar>

        <Backdrop style={{ zIndex: 10 }} open={beforePost}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }
);

export default App;
