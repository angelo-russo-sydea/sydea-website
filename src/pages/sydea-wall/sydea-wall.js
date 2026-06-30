import React, { useState, useEffect, useMemo } from 'react';
import "./sydea-wall.scss";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import FolderImage from '../../assets/image/folder-img.svg';
import Marquee from "react-fast-marquee";
import SydeaLogoNewsComm from '../../assets/logo/sydea-logo-news-comm.svg';
import SydeaLogoNewsCommCompact from '../../assets/logo/sydea-logo-news-comm-compact.svg';
import SharepointLogo from '../../assets/other/sharepoint.svg';
import OdooLogo from '../../assets/other/odoo.svg';
import EasyredmineLogo from '../../assets/other/easyredmine.svg';

const pathUrl = process.env.REACT_APP_BASE_URL;

export const SydeaWall = () => {
  const { lang } = useParams();
  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea Hub';

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const [badgeLists, setBadgeLists] = useState({
    innovationList: [],
    collaborationList: [],
    dedicationList: [],
    problemSolvingList: [],
    efficiencyList: []
  });

  const employeesData = [
    {
      name: "Cesario Marino",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.marino.circle.png",
      badge: [ {innovation: 1, collaboration: 3, dedication: 0, problemSolving: 1, efficiency: 4} ]
    },
    {
      name: "Yuri De Vivo",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png",
      badge: [ {innovation: 0, collaboration: 1, dedication: 4, problemSolving: 3, efficiency: 3} ]
    },
    {
      name: "Mena Napoletano",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/m.napoletano.circle.png",
      badge: [ {innovation: 3, collaboration: 2, dedication: 0, problemSolving: 0, efficiency: 1} ]
    },
    {
      name: "Tony De Vivo",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png",
      badge: [ {innovation: 1, collaboration: 0, dedication: 3, problemSolving: 4, efficiency: 4} ]
    },
    {
      name: "Clara Sansone",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.sansone.circle.png",
      badge: [ {innovation: 0, collaboration: 5, dedication: 1, problemSolving: 0, efficiency: 2} ]
    },
    {
      name: "Angelo Russo",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.russo.circle.png",
      badge: [ {innovation: 5, collaboration: 3, dedication: 2, problemSolving: 4, efficiency: 0} ]
    },
    {
      name: "Gianni Nardone ",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/g.nardone.circle.png",
      badge: [ {innovation: 3, collaboration: 7, dedication: 0, problemSolving: 0, efficiency: 1} ]
    },
    {
      name: "Andrea Scarpante",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.scarpante.circle.png",
      badge: [ {innovation: 10, collaboration: 1, dedication: 6, problemSolving: 2, efficiency: 2} ]
    },
    {
      name: "Francesco Agrillo",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/f.agrillo.circle.png",
      badge: [ {innovation: 2, collaboration: 0, dedication: 0, problemSolving: 3, efficiency: 0} ]
    },
    {
      name: "Paolo Sabino",
      image: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/p.sabino.circle.png",
      badge: [ {innovation: 0, collaboration: 3, dedication: 5, problemSolving: 5, efficiency: 5} ]
    }
  ];

  const [employees, setEmployees] = useState(employeesData);

  const badgeEmojis = {
    innovation: "🚀",
    collaboration: "🤝",
    dedication: "🔥",
    problemSolving: "🎯",
    efficiency: "⏳",
  };

  const badgeKeys = ['innovation', 'collaboration', 'dedication', 'problemSolving', 'efficiency'];

  useEffect(() => {
    const newBadgeLists = {
      innovationList: [],
      collaborationList: [],
      dedicationList: [],
      problemSolvingList: [],
      efficiencyList: []
    };

    // Estrai i badge da tutti i dipendenti e li aggiungi alle rispettive liste
    employees.forEach(employee => {
      badgeKeys.forEach(badge => {
        const badgeValue = employee.badge[0][badge];
        if (badgeValue > 0) {
          newBadgeLists[`${badge}List`].push({
            name: employee.name,
            image: employee.image,
            value: badgeValue
          });
        }
      });
    });

    // Ordina ciascuna lista per valore e poi per nome in caso di parità
    Object.keys(newBadgeLists).forEach(key => {
      newBadgeLists[key].sort((a, b) => {
        if (b.value === a.value) {
          return a.name.localeCompare(b.name); // Ordinamento alfabetico in caso di parità
        }
        return b.value - a.value; // Ordinamento per valore decrescente
      });
      newBadgeLists[key] = newBadgeLists[key].slice(0, 3);
    });

    setBadgeLists(newBadgeLists); // Imposta lo stato con le liste ordinate
  }, []);

  const increaseVote = (employeeIndex, badgeKey) => {
    setEmployees(prevEmployees => {
      const updatedEmployees = [...prevEmployees];
      const updatedEmployee = { ...updatedEmployees[employeeIndex] };
      updatedEmployee.badge[0][badgeKey] += 1; // Aumenta il valore del badge selezionato
      updatedEmployees[employeeIndex] = updatedEmployee;
      return updatedEmployees;
    });
  };
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light position-relative p-4'>
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

        <h1>Sydea Wall of Appreciation: Valorizzare il Talento e la Collaborazione</h1>

        <div>
          <p>LEGENDA</p>
          <ul>
            <li>🚀 <strong>Innovazione</strong> – Per chi introduce idee o soluzioni nuove che migliorano il lavoro o i processi.</li>
            <li>🤝 <strong>Collaborazione</strong> – Per chi dimostra spirito di squadra e aiuta i colleghi a raggiungere obiettivi comuni.</li>
            <li>🔥 <strong>Dedizione</strong> – Per chi dimostra grande impegno e passione nel proprio lavoro.</li>
            <li>🎯 <strong>Problem Solving</strong> – per chi ha risolto un problema complesso.</li>
            <li>⏳ <strong>Efficienza e Rapidità</strong> – Per chi ha completato un’attività in tempi record con ottimi risultati.</li>
            {/* <li>🎨 <strong>Creatività</strong> – Per chi propone idee originali e fuori dagli schemi.</li>
            <li>⚡ <strong>Energia Positiva</strong> – Per chi diffonde entusiasmo e un buon clima lavorativo.</li>
            <li>🛠 <strong>Supporto Tecnico</strong> – Per chi aiuta a risolvere problemi tecnici o operativi.</li>
            <li>🏆 <strong>Leader del Momento</strong> – Per chi ha guidato un progetto o un team con successo.</li>
            <li>🌍 <strong>Inclusione e Team Spirit</strong> – Per chi favorisce un ambiente di lavoro accogliente e collaborativo.</li>
            <li>🔄 <strong>Resilienza</strong> – Per chi ha superato una sfida complessa con determinazione.</li>
            <li>📚 <strong>Condivisione della Conoscenza</strong> – Per chi aiuta gli altri a crescere condividendo competenze e best practice.</li>
            <li>💡 <strong>Proposta di Miglioramento</strong> – Per chi suggerisce un’ottimizzazione che semplifica il lavoro o migliora un processo.</li> */}
          </ul>

        </div>

        <div className='row'>
          <div className='col-sm-12 col-md-10'>
            <div className="row">
              {employees.map((employee, employeeIndex) => (
                <div key={employeeIndex} className="col-sm-4 custom-box box-employee d-flex flex-column align-items-center justify-content-start p-2 py-4">
                  <p className="fw-bold mb-2">{employee.name}</p>
                  <img src={employee.image} className="img-employee-card" alt={employee.name} />
                  <div className="d-flex mt-2">
                    {Object.entries(employee.badge[0]).map(([key, value]) => (
                      <button 
                        key={key} 
                        className={`btn-vote ${value > 0 ? '' : 'empty-value'} d-flex align-items-center gap-1`} 
                        onClick={() => increaseVote(employeeIndex, key)}
                      >
                        {badgeEmojis[key]} 
                        {value > 0 && <span className='badge-number'>{value}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='col-sm-12 col-md-2'>
            <div>
              {badgeKeys.map((badge, index) => (
                <div key={index} className='box-badge-rank mb-3'>
                  <div className='header-rank'>
                    <p className='text-center m-0 p-1'>{badgeEmojis[badge]} {badge.charAt(0).toUpperCase() + badge.slice(1)}</p>
                  </div>
                  <ul style={{listStyle:'none'}} className='p-0 m-0'>
                    {badgeLists[`${badge}List`].map((item, idx) => (
                      <li key={idx} className={`d-flex align-items-center justify-content-between p-2 row-rank ${idx === 0 ? 'first-rank':''}`}>
                        <div className='d-flex align-items-center gap-2'>
                          {/* <p className='m-0'>{idx + 1}°</p> */}
                          <img src={item.image} alt={item.name} className='img-badge-rank' />
                          <span style={{fontSize:12}} className={`${idx === 0 ? 'fw-bold':''}`}>{item.name}</span>
                        </div>
                        {/* <strong>{item.name}</strong>: {item.value} */}
                        <p className='m-0'><b>{item.value}</b></p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </MsalAuthenticationTemplate>
  );
};
