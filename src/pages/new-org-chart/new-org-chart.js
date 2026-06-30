import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import "./new-org-chart.scss";
import ReactDOMServer from "react-dom/server";
import { OrgChart } from "d3-org-chart";
import CustomNodeContent from "./customNodeContent";
import CustomExpandButton from "./customExpandButton";
import FitButton from "./fitButton";
import SwapButton from "./swapButton";
import EmployeeDetailsCard from "./employeeDetailsCard";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, TextField } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import InputAdornment from '@mui/material/InputAdornment';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useParams } from "react-router-dom";

const styles = {
  orgChart: {
    height: "calc(100vh - 60px)",
    backgroundColor: "#141414",
  },
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const NewOrganizationalChart = (props) => {
  const { lang } = useParams();
  const d3Container = useRef(null);
  const chartRef = useRef(new OrgChart());
  const [cardShow, setCardShow] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [layoutIndex, setLayoutIndex] = useState(1);

  const [expandeAllNodes, setExpandeAllNodes] = useState(false);
  const [isCollapsedView, setIsCollapsedView] = useState(false);
  const [alignment, setAlignment] = useState('collapse');
  const [arrayLayout, setArrayLayout] = useState(["left", "top", "right", "bottom"]);

  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea | Organizational Chart';

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  useEffect(() => {
    const updateArray = () => {
      if (window.innerWidth <= 768) {
        setArrayLayout(["top", "left", "right", "bottom"]); // Mobile layout
      } else {
        setArrayLayout(["left", "top", "right", "bottom"]); // Desktop layout
      }
    };
    updateArray();
    window.addEventListener("resize", updateArray);
    return () => window.removeEventListener("resize", updateArray);
  }, []);

  const handleShow = () => setCardShow(true);
  const handleClose = () => {
    chartRef.current.clearHighlighting();
    setCardShow(false)};

  const handleFit = (event) => {
    event.preventDefault();
    if (chartRef.current) {
      chartRef.current.fit(event);
    }
  };

  const handleSwapLayout = useCallback((event) => {
    if (event) {
      setLayoutIndex((prevIndex) => (prevIndex + 1) % 4);
      setIsCollapsedView(false);
      return layoutIndex;
    }
    return layoutIndex;
  });

  useLayoutEffect(() => {
    const toggleDetailsCard = (nodeId) => {
      setEmployeeId(nodeId.id);
      // setEmployeeId(Number(nodeId.id));
      setTimeout(() => {
        handleShow();
      }, 0);
    };

    const handleLayout = () => handleSwapLayout();

    if (props.data && d3Container.current) {
      chartRef.current
        .container(d3Container.current)
        .data(props.data)
        // .nodeWidth((d) => 300)
        // .nodeHeight((d) => 150)
        .childrenMargin((d) => 50)
        .compactMarginBetween((d) => 35)
        .compactMarginPair((d) => 30)
        .neighbourMargin((a, b) => 20)
        // .initialZoom(0.7)
        .layout(arrayLayout [handleLayout()])
        // .layout(["left", "top", "right", "bottom"][handleLayout()])
        .compact(false).render().fit()
        // .connections([{from:"54",to:"62",label:"Conflicts of interest"}])
        // .defaultFont("Helvetica")
        .imageName('Sydea Organizational Chart')
        // .setActiveNodeCentered(false)
        // .initialExpandLevel(1)
        .onNodeClick((d) => {
          if(d.data.description){
            toggleDetailsCard(d);
          }
          chartRef.current.clearHighlighting()
          chartRef.current.setUpToTheRootHighlighted(d.id).render().fit();
        })
        .buttonContent((node, state) => {
          return ReactDOMServer.renderToStaticMarkup(
            <CustomExpandButton {...node.node} />
          );
        })
        .nodeContent((d) => {
          return ReactDOMServer.renderToStaticMarkup(
            <CustomNodeContent {...d} />
          );
        })
        .render();
    }
  }, [props, props.data, handleSwapLayout]);

  const expandAll = () => {
    chartRef.current.expandAll();
  };

  const handleChangeExpandeAll = (event) => {
    setExpandeAllNodes(event.target.checked);
    if(event.target.checked){
      chartRef.current.expandAll();
    }
    else{
      chartRef.current.collapseAll();
    }
  };

  const handleChangeTreeView = (event) => {
    setIsCollapsedView(event.target.checked);
    setTimeout(() => {
      if(event.target.checked){
        chartRef.current.compact(true).render().fit()
      }
      else{
        chartRef.current.compact(false).render().fit()
      }
    }, 0);

  }

  const collapseAll = () => {
    if (chartRef.current) {
      chartRef.current.collapseAll();
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.initialExpandLevel(1);
          chartRef.current.render();
        }
      }, 0);
    }
  };

  const filterChart = (e) => {
    const value = e.target.value;
    chartRef.current.clearHighlighting();
    const data = chartRef.current.data();
    data.forEach((d) => (d._expanded = false));
    data.forEach((d) => {
      if (value != '' && d.name?.toLowerCase().includes(value.toLowerCase())) {
        d._highlighted = true;
        d._expanded = true;
      }
    });
    chartRef.current.data(data).render().fit();
  }

  const exportCurrentChart = () => {
    // const element = d3Container.current.querySelector('.help-icon-org-chart');
    // if (element) {
    //   element.style.display = 'none';
    // } else {
    //   console.error('Elemento non trovato');
    // }
    handleCloseMenu();
    chartRef.current.exportImg();
  }

  const exportFullChart = () => {
    handleCloseMenu();
    chartRef.current.exportImg({full:true});
  }

  const exportSvgChart = () => {
    handleCloseMenu();
    chartRef.current.exportSvg();
  }

  const downloadPdf = () => {
    // chartRef.current.exportImg({
    //   save: false,
    //   full: true,
    //   onLoad: (base64) => {
    //     var pdf = new jspdf.jsPDF();
    //     var img = new Image();
    //     img.src = base64;
    //     img.onload = function () {
    //       pdf.addImage(
    //         img,
    //         'JPEG',
    //         5,
    //         5,
    //         595 / 3,
    //         ((img.height / img.width) * 595) / 3
    //       );
    //       pdf.save('chart.pdf');
    //     };
    //   },
    // });
  }
  const horizontalview = () => {
    chartRef.current.compact(false).render().fit()
  }

  const compactlview = () => {
    chartRef.current.compact(true).render().fit()
  }

  const highlitroot = () => {
    // chartRef.current.setHighlighted('54').render();
    chartRef.current.setUpToTheRootHighlighted('14').render().fit();
    // chartRef.current.clearHighlighting()
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeToggle = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
    <div className='section-home position-relative'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
          <Toolbar className='justify-content-between'>
            <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
              <Link to={`/${lang}/sydea-hub`} className="text-deco-none" style={{color:'#ffffff'}}>
                <ArrowBackIosIcon/>
              </Link>
            </IconButton>

            <Link to={`/${lang}/sydea-hub`} className="text-deco-none showDesktop" style={{color:'#ffffff'}}>
              <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3">
                <span className='px-1'>Hub</span>
              </Button>
            </Link>

              {/* <div className='box-logo-news-communications d-flex justify-content-center'>
                <img src={SydeaLogoNewsComm} className='logo-news-communications' alt='Sydea Logo News & Communications'></img>
              </div> */}
              <div className='d-flex gap-3 align-items-center'>
              {
              activeAccount && 
                <div>
                  <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                    <p className='fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0' style={{lineHeight:'normal'}}>{activeAccount.name}</p>
                    <p className='m-0 p-0 fs-6' style={{lineHeight:'normal'}}>{activeAccount.username}</p>
                  </Typography>
                </div>
              }
              <div>
                {
                  activeAccount ?
                  (
                    <IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signOut}>
                      <LogoutIcon />
                    </IconButton>
                  )
                  :
                  (
                    <IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signIn}>
                      <LoginIcon />
                    </IconButton>
                  )
                }
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{height:'60px'}}></div>
      <div style={styles.orgChart} ref={d3Container}>
        <div
          className="row-tools-org-chart"
        >
          <FitButton onFitChart={handleFit} ref={d3Container} />
          <SwapButton onSwapLayout={handleSwapLayout} ref={d3Container} />

          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color:'#fff' }}>
            <Typography variant="span">Collapse</Typography>
            <IOSSwitch checked={expandeAllNodes} onChange={handleChangeExpandeAll}/>
            <Typography variant="span">Expand</Typography>
          </Stack> */}
          
          <ButtonGroup size="small" aria-label="Small button group">
            <Button key="collapse" onClick={collapseAll} style={{color: '#fece2f', borderColor:'#fece2f'}} className="btn-switch-group">Collapse</Button>
            <Button key="expande" onClick={expandAll} style={{color: '#fece2f', borderColor:'#fece2f'}} className="btn-switch-group">Expand</Button>
          </ButtonGroup>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color:'#fff' }}>
            <IOSSwitch checked={isCollapsedView} onChange={handleChangeTreeView}/>
            <Typography variant="span" className="btn-switch-group">Compact</Typography>
          </Stack>

          {/* <FormControlLabel
            control={<IOSSwitch checked={expandeAllNodes} onChange={handleChangeExpandeAll}/>}
            label="Expande All"
          /> */}
          {/* <button onClick={expandAll}>Expand</button>
          <button onClick={collapseAll}>Collapse</button> */}

          {/* <input
            type="search"
            placeholder="Search by name..."
            onInput={(event) => filterChart(event)}
            className="saerchbar-org-chart"
          /> */}
          
          <Paper
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, backgroundColor: '#141414', border: '1px solid #fece2f'}}
            style={{paddingTop: 0, paddingBottom: 0}}
            className="hide-mobile"
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color:'#fff' }}
              placeholder="Search by name..."
              type="search"
              onInput={(event) => filterChart(event)}
            />
            <IconButton type="button" sx={{ p: '10px', color:'#f6f6f6' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

        {/* <div>
          <IconButton style={{color:'#fece2f'}}
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <DownloadIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={exportCurrentChart}>Export Current Image</MenuItem>
            <MenuItem onClick={exportFullChart}>Export Full Image</MenuItem>
            <MenuItem onClick={exportSvgChart}>Export SVG</MenuItem>
          </Menu>
        </div> */}

          {/* <button onClick={exportCurrentChart}>Export Current</button>
          <button onClick={exportFullChart}>Export Full</button>
          <button onClick={exportSvgChart}>Export SVG</button>
          <button onClick={downloadPdf}>Export PDF</button> */}
          {/* <button onClick={horizontalview}>horizonal view</button>
          <button onClick={compactlview}>compact view</button> */}
          {/* <button onClick={highlitroot}>highlitroot</button> */}
        </div>
        {cardShow && (
          <EmployeeDetailsCard
            employees={props.data}
            employee={props.data.find((employee) => employee.id === employeeId)}
            handleClose={handleClose}
          />
        )}
      </div>
      </div>
    </MsalAuthenticationTemplate>
  );
};

export default NewOrganizationalChart;
