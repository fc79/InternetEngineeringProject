import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import "./Drawer.css";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import ReconnectingWebSocket from "reconnecting-websocket";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "black",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    marginLeft: "30%",
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  form: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const allowedState = [{ username: 1, password: "Alabama" }];
  const usersList = [];
  const [list, setList] = useState([]);
  const [groulist, setGroupList] = useState([]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [grouplink, setGroupLink] = useState("");
  const [privateGroup, setPrivateGroup] = useState("");
  const [message, setMessage] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    axios({
      method: "POST",
      url: "http://127.0.0.1:8000/users/",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setGroupLink(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let str = "chatapp/groupname.join";
    // console.log("jjjjjjjjj", str.substring(8, str.length - 5));
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/users/",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // usersList.push(res.data.data);
        setList(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/groups/" + Cookies.get("userId"),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        //console.log("Ressss", res);
        setGroupList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [list]);
  const [id, setId] = useState();
  const selectUser = (e) => {
    setId(e);
    const payload = {
      id1: parseInt(Cookies.get("userId"), 10),
      id2: e,
    };
    const back = JSON.stringify(payload);
    axios({
      method: "POST",
      url: "http://127.0.0.1:8000/create-group/",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    })
      .then((res) => {
        setPrivateGroup(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const chatSocket = new ReconnectingWebSocket(
    "ws://" + "127.0.0.1:8000" + "/chat_ws/" + privateGroup + "/"
  );
  const sendToChannel = () => {
    console.log("message", message);
    // chatSocket.send(
    //   JSON.stringify({
    //     msg_type: 1,
    //     text: message,
    //     user_id: Cookies.get("userId"),
    //     group_name: privateGroup,
    //   })
    // );
  };

  // chatSocket.onmessage = function (e) {
  //   console.log("onMessage", e.data);

  //   const data = JSON.parse(e.data);
  //   if (data.message) {
  //     console.log("data", data.message);
  //   } else {
  //     alert("The Message Was Empty");
  //   }
  // };
  const drawer = (
    <div style={{ backgroundColor: "#201f22	" }}>
      <button className="buttonCreate" onClick={handleClickOpen}>
        Create Group
      </button>
      <div className={classes.toolbar} />
      <Divider />
      <div className="headings">Groups</div>
      <List style={{ backgroundColor: "#513686	" }}>
        {groulist.map((e) => (
          <div onClick={() => selectUser(e.id)}>
            <ListItem button key={e.id}>
              <ListItemIcon>
                {/* <Avatar
     alt="Remy Sharp"
     src="/broken-image.jpg"
     className={classes.orange}
   >
     B
   </Avatar>{" "} */}
                <Avatar src="/broken-image.jpg" />
              </ListItemIcon>
              <ListItemText primary={e.username} style={{ color: "white" }} />
            </ListItem>
          </div>
        ))}
      </List>
      <div className="headings">Contacts</div>
      <List style={{ backgroundColor: "#513686	" }}>
        {list.map((e) => (
          <div onClick={() => selectUser(e.id)}>
            <ListItem button key={e.id}>
              <ListItemIcon>
                {/* <Avatar
     alt="Remy Sharp"
     src="/broken-image.jpg"
     className={classes.orange}
   >
     B
   </Avatar>{" "} */}
                <Avatar src="/broken-image.jpg" />
              </ListItemIcon>
              <ListItemText primary={e.username} style={{ color: "white" }} />
            </ListItem>
          </div>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ backgroundColor: "#201f22	" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            group name
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <div
          style={{
            marginRight: "12%",
            marginLeft: "20%",
            borderRadius: "8px",
            width: "50%",
            backgroundColor: "#513686	",
          }}
        >
          <p class="font-semibold" style={{ color: "white" }}>
            luugukgjkj
          </p>
          <p> lll </p>
        </div>

        <div class="lg:w-2/4 mx-4 lg:mx-auto p-5 rounded-xl">
          <form action="." class="flex">
            <input
              type="text"
              name="content"
              class="flex-1 mr-3 bg-violet-200	rounded-xl"
              placeholder="Type a Message..."
              id="chat-message-input"
              className="messageInput"
              style={{ marginRight: "2%", marginLeft: "20%" }}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              class="px-5 py-3 rounded-xl text-white bg-violet-400 hover:bg-violet-500"
              id="chat-message-submit"
              className="buttonStyle"
              style={{ marginRight: "2%" }}
              onClick={sendToChannel}
            >
              Submit
            </button>
            <input
              className="fileButtonStyle"
              type="file"
              accept="image/*"
              id="file-input"
            />
          </form>
        </div>
      </main>
      <React.Fragment>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            Please choose group name
          </DialogTitle>
          <DialogContent>
            <DialogContentText> </DialogContentText>
            <form className={classes.form} noValidate>
              <FormControl className={classes.formControl}>
                <TextField id="standard-basic" label="group name" />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

export default ResponsiveDrawer;
