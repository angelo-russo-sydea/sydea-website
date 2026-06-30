import React, {useContext, useEffect, useState} from 'react';
import "./org-chart.scss";
import { AppContext } from '../../services/translationContext';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { OrgChart } from '../../components/orgchart/orgchart';
import Branch from '../../components/branch/branch';
import NewOrganizationalChart from '../new-org-chart/new-org-chart';
import * as d3 from 'd3';

const orgData = {
  name: "Tony De Vivo",
  role: 'CEO',
  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
  showChildren: true,
  children: [
    {
      name: "Yuri De Vivo",
      role: 'Finance & Control',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      showChildren: true,
      team: [
        {
          name: "Mena Napoletano",
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          role: "",
        }
      ]
    },
    {
      name: "Yuri De Vivo",
      role: 'Purchasing',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: []
    },
    {
      name: "Cesario Marino",
      role: 'Quality & BPM',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: []
    },
    {
      name: "Yuri De Vivo",
      role: 'HR',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: [
        {
          name: "Yuri De Vivo",
          role: 'Payroll',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Tony De Vivo",
          role: 'Recruiting',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Tony De Vivo",
          role: 'Performance',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Paolo Sabino",
          role: 'Training',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Clara Sansone",
          role: 'Timeoff',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "*Marketing & Communication",
          role: 'InfoPoint',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
      ]
    },
    {
      name: "Yuri De Vivo",
      role: 'Health & Safety',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: [
        {
          name: "",
          role: 'Office Administration',
          photo:'',
          team: [
            {
              name: "Clara Sansone",
              role: '',
              photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
            },
            {
              name: "Cristina Alexandru",
              role: '',
              photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
            },
            {
              name: "",
              role: 'Bologna',
              photo:'',
              team: [
                {
                  name: "Mario Rossi",
                  role: 'Preposto',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: 'RLS',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
              ]
            },
            {
              name: "",
              role: 'Napoli',
              photo:'',
              team: [
                {
                  name: "Franceso Agrillo",
                  role: 'Preposto',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Paolo Sabino",
                  role: 'RLS',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Franceso Agrillo",
                  role: 'Antincendio',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
              ]
            },
            {
              name: "",
              role: 'Skopje',
              photo:'',
              team: [
                {
                  name: "Gianmichele Mele",
                  role: '',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                }
              ]
            },
            {
              name: "",
              role: 'Vancouver',
              photo:'',
              team: [
                {
                  name: "Armin Suljovikj",
                  role: '',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                }
              ]
            },
          ]
        },
      ]
    },
    {
      name: "",
      role: 'Business Units',
      photo:'',
      showChildren: false,
      children: [
        {
          name: "Tony De Vivo",
          role: 'ERP',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          showChildren: false,
          childrenDxToSx: true,
          team: [
            {
              name: "Cesario Marino",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Rosario Marano", role: '', photo:'', },
                { name: "Rossella Mele", role: '', photo:'', }
              ]
            },
            {
              name: "Francesco Agrillo",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Andrea Agrillo", role: '', photo:'', },
                { name: "Giovanni Cangiano", role: '', photo:'', },
                { name: "Luigi Antacido", role: '', photo:'', },
                { name: "Luca Ferrigno", role: '', photo:'', },
                { name: "Yuri Caruso", role: '', photo:'', }
              ]
            },
            {
              name: "Gianmichele Mele",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Elena Tanska", role: '', photo:'',
                  team: [
                    { name: "Ile Stevanovski", role: '', photo:'' },
                    { name: "Maja Nechkoska", role: '', photo:'' },
                    { name: "Simona Trajanovska", role: '', photo:'' }
                  ]
                 },
                { name: "Hristijan Najdeski", role: '', photo:'' },
                { name: "Ivana Savik", role: '', photo:'' },
                { name: "Monika Nechkoska", role: '', photo:'' }
              ]
            },
            {
              name: "Paolo Sabino",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Lorenzo Costa", role: '', photo:'' },
                { name: "Simone Castiello", role: '', photo:'' },
                { name: "Vincezo Iannaccone", role: '', photo:'' }
              ]
            },
            {
              name: "Pietro Natale",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Antonio Silvestro", role: '', photo:'' },
                { name: "Maria Ferrara", role: '', photo:'' }
              ]
            },
            {
              name: "Tony De Vivo",
              role: '',
              photo:'',
              showChildren: false,
              team: [
                { name: "Antonio Riviergi", role: '', photo:'' },
                { name: "Erminio Russomando", role: '', photo:'' },
                { name: "Eugenia D'Alconzo", role: '', photo:'' },
                { name: "Simona Focacci", role: '', photo:'' },
                { name: "Vincenzo Marseglia", role: '', photo:'' },
                { name: "Armin Suljovikj", role: '', photo:'' }
              ]
            },
          ]
        },
        {
          name: "Andrea Scarpante",
          role: 'Digital',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          showChildren: false,
          team: [
            { name: "Al-Fahad Asaduz", role: '', photo:'' },
            { name: "Andrea Gesualdi", role: '', photo:'' },
            { name: "Andrea Tasselli", role: '', photo:'' },
            { name: "Andrea Veneziano", role: '', photo:'' },
            { name: "Carlo Bottardi", role: '', photo:'' },
            { name: "Carlo Liaci", role: '', photo:'' },
            { name: "Lorizo Pozzuoli", role: '', photo:'' },
            { name: "Marco Isolato", role: '', photo:'' }
          ]
          // team: [
          //   { name: "Al-Fahad Asaduz", role: '', photo:'' },
          //   { name: "Andrea Gesualdi", role: '', photo:'' },
          //   { name: "Andrea Tasselli", role: '', photo:'' },
          //   { name: "Andrea Veneziano", role: '', photo:'' },
          //   { name: "Carlo Bottardi", role: '', photo:'' },
          //   { name: "Carlo Liaci", role: '', photo:'' },
          //   { name: "Lorizo Pozzuoli", role: '', photo:'' },
          //   { name: "Marco Isolato", role: '', photo:'' }
          // ]
        }
      ]
    },
    {
      name: "-",
      role: 'Planning & Procurement',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: []
    },
    {
      name: "Paolo Sabino",
      role: 'Learning',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: []
    },
    {
      name: "Angelo Russo",
      role: 'R&D',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      team: []
    },
    {
      name: "Angelo Russo",
      role: 'Marketing & Communication',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      showChildren: false,
      team: [
        {
          name: "Gianni Nardone",
          role: '',
          photo:'',
        }
      ]
    }
  ]
};

const orgData1 = {
  name: "Tony De Vivo",
  role: 'CEO',
  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
  showChildren: true,
  children: [
    {
      name: "Yuri De Vivo",
      role: 'Finance & Control',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      showChildren: true,
      children: [
        {
          name: "Mena Napoletano",
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          role: "",
        }
      ]
    },
    {
      name: "Yuri De Vivo",
      role: 'Purchasing',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: []
    },
    {
      name: "Cesario Marino",
      role: 'Quality & BPM',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: []
    },
    {
      name: "Yuri De Vivo",
      role: 'HR',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: [
        {
          name: "Yuri De Vivo",
          role: 'Payroll',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Tony De Vivo",
          role: 'Recruiting',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Tony De Vivo",
          role: 'Performance',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Paolo Sabino",
          role: 'Training',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "Clara Sansone",
          role: 'Timeoff',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
        {
          name: "InfoPoint",
          role: '* Marketing & Communication',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
        },
      ]
    },
    {
      name: "Yuri De Vivo",
      role: 'Health & Safety',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: [
        {
          name: "",
          role: 'Office Administration',
          photo:'',
          children: [
            {
              name: "Clara Sansone",
              role: '',
              photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
            },
            {
              name: "Cristina Alexandru",
              role: '',
              photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
            },
            {
              name: "",
              role: 'Bologna',
              photo:'',
              children: [
                {
                  name: "Mario Rossi",
                  role: 'Preposto',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: 'RLS',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
              ]
            },
            {
              name: "",
              role: 'Napoli',
              photo:'',
              children: [
                {
                  name: "Franceso Agrillo",
                  role: 'Preposto',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Paolo Sabino",
                  role: 'RLS',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: '1° soccorso',
                  photo:''
                },
                {
                  name: "Franceso Agrillo",
                  role: 'Antincendio',
                  photo:''
                },
                {
                  name: "Mario Rossi",
                  role: 'Antincendio',
                  photo:''
                },
              ]
            },
            {
              name: "",
              role: 'Skopje',
              photo:'',
              children: [
                {
                  name: "Gianmichele Mele",
                  role: '',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                }
              ]
            },
            {
              name: "",
              role: 'Vancouver',
              photo:'',
              children: [
                {
                  name: "Armin Suljovikj",
                  role: '',
                  photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png'
                }
              ]
            },
          ]
        },
      ]
    },
    {
      name: "Business Units",
      role: '',
      photo:'',
      showChildren: false,
      children: [
        {
          name: "Tony De Vivo",
          role: 'ERP',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          showChildren: false,
          childrenDxToSx: true,
          children: [
            {
              name: "Cesario Marino",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Rosario Marano", role: '', photo:'', },
                { name: "Rossella Mele", role: '', photo:'', }
              ]
            },
            {
              name: "Francesco Agrillo",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Andrea Agrillo", role: '', photo:'', },
                { name: "Giovanni Cangiano", role: '', photo:'', },
                { name: "Luigi Antacido", role: '', photo:'', },
                { name: "Luca Ferrigno", role: '', photo:'', },
                { name: "Yuri Caruso", role: '', photo:'', }
              ]
            },
            {
              name: "Gianmichele Mele",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Elena Tanska", role: '', photo:'',
                  children: [
                    { name: "Ile Stevanovski", role: '', photo:'' },
                    { name: "Maja Nechkoska", role: '', photo:'' },
                    { name: "Simona Trajanovska", role: '', photo:'' }
                  ]
                 },
                { name: "Hristijan Najdeski", role: '', photo:'' },
                { name: "Ivana Savik", role: '', photo:'' },
                { name: "Monika Nechkoska", role: '', photo:'' }
              ]
            },
            {
              name: "Paolo Sabino",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Lorenzo Costa", role: '', photo:'' },
                { name: "Simone Castiello", role: '', photo:'' },
                { name: "Vincezo Iannaccone", role: '', photo:'' }
              ]
            },
            {
              name: "Pietro Natale",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Antonio Silvestro", role: '', photo:'' },
                { name: "Maria Ferrara", role: '', photo:'' }
              ]
            },
            {
              name: "Tony De Vivo",
              role: '',
              photo:'',
              showChildren: false,
              children: [
                { name: "Antonio Riviergi", role: '', photo:'' },
                { name: "Erminio Russomando", role: '', photo:'' },
                { name: "Eugenia D'Alconzo", role: '', photo:'' },
                { name: "Simona Focacci", role: '', photo:'' },
                { name: "Vincenzo Marseglia", role: '', photo:'' },
                { name: "Armin Suljovikj", role: '', photo:'' }
              ]
            },
          ]
        },
        {
          name: "Andrea Scarpante",
          role: 'Digital',
          photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
          showChildren: false,
          children: [
            { name: "Al-Fahad Asaduz", role: '', photo:'' },
            { name: "Andrea Gesualdi", role: '', photo:'' },
            { name: "Andrea Tasselli", role: '', photo:'' },
            { name: "Andrea Veneziano", role: '', photo:'' },
            { name: "Carlo Bottardi", role: '', photo:'' },
            { name: "Carlo Liaci", role: '', photo:'' },
            { name: "Lorizo Pozzuoli", role: '', photo:'' },
            { name: "Marco Isolato", role: '', photo:'' }
          ]
          // children: [
          //   { name: "Al-Fahad Asaduz", role: '', photo:'' },
          //   { name: "Andrea Gesualdi", role: '', photo:'' },
          //   { name: "Andrea Tasselli", role: '', photo:'' },
          //   { name: "Andrea Veneziano", role: '', photo:'' },
          //   { name: "Carlo Bottardi", role: '', photo:'' },
          //   { name: "Carlo Liaci", role: '', photo:'' },
          //   { name: "Lorizo Pozzuoli", role: '', photo:'' },
          //   { name: "Marco Isolato", role: '', photo:'' }
          // ]
        }
      ]
    },
    {
      name: "-",
      role: 'Planning & Procurement',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: []
    },
    {
      name: "Paolo Sabino",
      role: 'Learning',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: []
    },
    {
      name: "Angelo Russo",
      role: 'R&D',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      children: []
    },
    {
      name: "Angelo Russo",
      role: 'Marketing & Communication',
      photo:'https://www.farmaciecomunalitorino.it/wp-content/uploads/2023/11/Doodle_2023-11-06T13_20_48Z-850x370.png',
      showChildren: false,
      children: [
        {
          name: "Gianni Nardone",
          role: '',
          photo:'',
        }
      ]
    },
  ]
};

const orgDataCard = [
  {
    name: "Tony De Vivo",
    role: 'CEO',
  },
  {
    name: "Yuri De Vivo",
    role: 'Finance & Control',
    children: [
      {
        name: "Mena Napoletano",
        role: "",
      }
    ]
  },
  {
    name: "Yuri De Vivo",
    role: 'Purchasing',
    children: []
  },
  {
    name: "Cesario Marino",
    role: 'Quality & BPM',
    children: []
  },
  {
    name: "Yuri De Vivo",
    role: 'HR',
    children: [
      {
        name: "Yuri De Vivo",
        role: 'Payroll',
      },
      {
        name: "Tony De Vivo",
        role: 'Recruiting',
      },
      {
        name: "Tony De Vivo",
        role: 'Performance',
      },
      {
        name: "Paolo Sabino",
        role: 'Training',
      },
      {
        name: "Clara Sansone",
        role: 'Timeoff',
      },
      {
        name: "InfoPoint",
        role: '* Marketing & Communication',
      },
    ]
  },
  {
    name: "Yuri De Vivo",
    role: 'Health & Safety',
    children: [
      {
        name: "",
        role: 'Office Administration',
        children: [
          {
            name: "Clara Sansone",
            role: '',
          },
          {
            name: "Cristina Alexandru",
            role: '',
          },
          {
            name: "",
            role: 'Bologna',
            children: [
              {
                name: "Mario Rossi",
                role: 'Preposto',
              },
              {
                name: "Mario Rossi",
                role: 'RLS',
              },
              {
                name: "Mario Rossi",
                role: '1° soccorso',
              },
              {
                name: "Mario Rossi",
                role: '1° soccorso',
              },
              {
                name: "Mario Rossi",
                role: 'Antincendio',
              },
              {
                name: "Mario Rossi",
                role: 'Antincendio',
              },
            ]
          },
          {
            name: "",
            role: 'Napoli',
            photo:'',
            children: [
              {
                name: "Franceso Agrillo",
                role: 'Preposto',
              },
              {
                name: "Paolo Sabino",
                role: 'RLS',
              },
              {
                name: "Mario Rossi",
                role: '1° soccorso',
              },
              {
                name: "Mario Rossi",
                role: '1° soccorso',
              },
              {
                name: "Franceso Agrillo",
                role: 'Antincendio',
              },
              {
                name: "Mario Rossi",
                role: 'Antincendio',
              },
            ]
          },
          {
            name: "",
            role: 'Skopje',
            children: [
              {
                name: "Gianmichele Mele",
                role: '',
              }
            ]
          },
          {
            name: "",
            role: 'Vancouver',
            children: [
              {
                name: "Armin Suljovikj",
                role: '',
              }
            ]
          },
        ]
      },
    ]
  },
  {
    name: "Tony De Vivo",
    role: 'BU - ERP',
    children: [
      {
        name: "Cesario Marino",
        role: '',
        photo:'',
        children: [
          { name: "Rosario Marano", role: '', photo:'', },
          { name: "Rossella Mele", role: '', photo:'', }
        ]
      },
      {
        name: "Francesco Agrillo",
        role: '',
        children: [
          { name: "Andrea Agrillo", role: '', photo:'', },
          { name: "Giovanni Cangiano", role: '', photo:'', },
          { name: "Luigi Antacido", role: '', photo:'', },
          { name: "Luca Ferrigno", role: '', photo:'', },
          { name: "Yuri Caruso", role: '', photo:'', }
        ]
      },
      {
        name: "Gianmichele Mele",
        role: '',
        children: [
          { name: "Elena Tanska", role: '', photo:'',
            children: [
              { name: "Ile Stevanovski", role: '', photo:'' },
              { name: "Maja Nechkoska", role: '', photo:'' },
              { name: "Simona Trajanovska", role: '', photo:'' }
            ]
           },
          { name: "Hristijan Najdeski", role: '', photo:'' },
          { name: "Ivana Savik", role: '', photo:'' },
          { name: "Monika Nechkoska", role: '', photo:'' }
        ]
      },
      {
        name: "Paolo Sabino",
        role: '',
        children: [
          { name: "Lorenzo Costa", role: '', photo:'' },
          { name: "Simone Castiello", role: '', photo:'' },
          { name: "Vincezo Iannaccone", role: '', photo:'' }
        ]
      },
      {
        name: "Pietro Natale",
        role: '',
        children: [
          { name: "Antonio Silvestro", role: '', photo:'' },
          { name: "Maria Ferrara", role: '', photo:'' }
        ]
      },
      {
        name: "Tony De Vivo",
        role: '',
        children: [
          { name: "Antonio Riviergi", role: '', photo:'' },
          { name: "Erminio Russomando", role: '', photo:'' },
          { name: "Eugenia D'Alconzo", role: '', photo:'' },
          { name: "Simona Focacci", role: '', photo:'' },
          { name: "Vincenzo Marseglia", role: '', photo:'' },
          { name: "Armin Suljovikj", role: '', photo:'' }
        ]
      },
    ]
  },
  {
    name: "Andrea Scarpante",
    role: 'BU - Digital',
    children: [
      { name: "Al-Fahad Asaduz", role: '', photo:'' },
      { name: "Andrea Gesualdi", role: '', photo:'' },
      { name: "Andrea Tasselli", role: '', photo:'' },
      { name: "Andrea Veneziano", role: '', photo:'' },
      { name: "Carlo Bottardi", role: '', photo:'' },
      { name: "Carlo Liaci", role: '', photo:'' },
      { name: "Lorizo Pozzuoli", role: '', photo:'' },
      { name: "Marco Isolato", role: '', photo:'' }
    ]
  },
  {
    name: "-",
    role: 'Planning & Procurement',
  },
  {
    name: "Paolo Sabino",
    role: 'Learning',
    team: []
  },
  {
    name: "Angelo Russo",
    role: 'R&D',
    team: []
  },
  {
    name: "Angelo Russo",
    role: 'Marketing & Communication',
    children: [
      {
        name: "Gianni Nardone",
        role: '',
      }
    ]
  }
];

const employees = [
  {
    id: 1, parentId: null, name: "Tony De Vivo", positionName: "CEO", team: "",
    description: "<span><b>Chief Executive Officer</b></span> <br/><br/> The CEO is primarily responsible for the company’s strategy and vision, leading the executive team and ensuring that all departments are aligned with corporate goals.<br/><br/>The CEO oversees resource management and makes long-term strategic decisions.<br/>This role serves as the main point of contact for stakeholders and represents the company both internally and externally.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png",
    mainArea: true
  },
  {
    id: 2, parentId: 1, name: "Yuri De Vivo", positionName: "Finance & Control", team: "",
    description: "The Finance & Control team manages the company's financial health, overseeing budgeting, forecasting, and financial reporting.<br/>They ensure accurate financial records, compliance with regulatory requirements, and monitor financial performance to guide strategic decisions.<br/><br/>This area is responsible for controlling costs and providing insights to support the company's growth and profitability.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png",
    mainArea: true
  },
  {
    id: 3, parentId: 2, name: "Mena Napoletano", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/m.napoletano.circle.png"
  },
  {
    id: 4, parentId: 1, team: "GDPR",
    description: "The <b>General Data Protection Regulation</b> (Regulation (EU) 2016/679), abbreviated <b>GDPR</b>, is a European Union regulation on information privacy in the European Union (EU) and the European Economic Area (EEA).<br/><br/>The GDPR is an important component of EU privacy law and human rights law. It also governs the transfer of personal data outside the EU and EEA.<br/><br/>The GDPR's goals are to enhance individuals' control and rights over their personal information and to simplify the regulations for international business.",
    mainArea: true
  },
  {
    id: 5, parentId: 4, name: "Cesario Marino", positionName: "DPO", team: "",
    description: "<span><b>Data Protection Officer</b></span> <br/><br/> The DPO ensures the company’s compliance with data protection regulations, such as the GDPR, safeguarding the personal data of clients, employees, and partners. <br/>This role involves advising management on privacy policies, conducting regular data protection audits, and acting as the contact point for regulatory authorities on privacy matters. <br/><br/>The DPO also fosters a culture of data privacy within the company, ensuring that all data processing activities meet legal and ethical standards.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.marino.circle.png"
  },
  {
    id: 6, parentId: "1", name: "Yuri De Vivo", positionName: "HR", team: "",
    description: "<span><b>Human Resources</b></span> <br/><br/> The HR area is responsible for recruiting, developing, and retaining talent within the company. <br/>This department manages the entire employee lifecycle, from onboarding and training to performance evaluations and career development.<br/><br/> HR also ensures compliance with labor laws, fosters a positive workplace culture, and supports employee well-being.<br/> Additionally, HR oversees benefits administration, employee relations, and implements policies that align with the company's values and objectives.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png",
    mainArea: true
  },
  {
    id: 7, parentId: "6", name: "Yuri De Vivo", positionName: "Payroll", team: "",
    description: "The Payroll area is responsible for accurate and timely processing of salaries, benefits and deductions for employees.<br/>This includes managing payroll calculations, tax compliance, and recording all payroll data.<br/><br/>Ensures compliance with local labor laws and tax regulations, handles payroll-related inquiries, and supports general human resources initiatives by maintaining transparency and accuracy of employee payments.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png"
  },
  {
    id: 70, parentId: "6", name: "Yuri De Vivo", positionName: "Expense Notes", team: "", description: "??", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png"
  },
  {
    id: 8, parentId: "6", name: "Tony De Vivo", positionName: "Recruiting", team: "",
    description: "The Recruiting area focuses on attracting, screening, and selecting top talent to meet the company’s hiring needs.<br/>This includes creating job descriptions, sourcing candidates, conducting interviews, and collaborating with department heads to identify role requirements.<br/><br/>Recruiting manages the candidate experience from application to offer, ensuring a fair and efficient process that reflects the company's values.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png"
  },
  {
    id: 9, parentId: "6", name: "Tony De Vivo", positionName: "Performance", team: "",
    description: "The Performance area is dedicated to managing and enhancing employee performance across the organization.<br/>This involves setting up performance evaluation frameworks, establishing clear goals, and providing tools for regular feedback and development.<br/><br/>Performance management includes organizing appraisals, identifying training needs, and supporting managers in coaching their teams to achieve high standards.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png"
  },
  {
    id: 10, parentId: "6", name: "Tony De Vivo", positionName: "Training", team: "",
    description: "The Training area focuses on developing employees’ skills and knowledge to support their professional growth and enhance organizational performance.<br/>This involves assessing training needs, designing programs, and organizing workshops, courses, or e-learning sessions.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png"
  },
  {
    id: 11, parentId: "6", name: "Clara Sansone", positionName: "Time Off", team: "",
    description: "The Time Off area manages all aspects related to employee leave, including vacation, sick leave, and other types of absence.<br/>This includes tracking leave balances, processing time-off requests, and ensuring compliance with labor laws and company policies.<br/><br/>Time Off management also involves coordinating with payroll to ensure accurate leave accounting and providing support to employees and managers on time-off policies and entitlements.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.sansone.circle.png"
  },
  {
    id: 12, parentId: "6", name: "Marketing & Communication", positionName: "InfoPoint", team: "",
    description: "The InfoPoint area provides clear and accessible information on topics such as benefits, company policies, opportunities, and employee services and is a listening center for all employee needs.<br/>The InfoPoint is responsible for answering day-to-day questions, guiding employees through HR processes, and referring them to the appropriate HR staff for more complex issues.<br/><br/>This area facilitates communication between employees and management, is the spokesperson for the needs of the company, and promotes employee satisfaction and well-being.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.russo.circle.png"
  },
  {
    id: 13, parentId: "1", name: "Yuri De Vivo", positionName: "Health & Safety", team: "",
    description: "The Health & Safety area is responsible for ensuring a safe and healthy working environment for all employees.<br/>This includes implementing and enforcing safety protocols, conducting regular risk assessments, and ensuring compliance with health and safety regulations. <br/><br/>The department develops and delivers training on safety practices, handles accident reporting and investigations, and works to prevent workplace hazards.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png",
    mainArea: true
  },
  {
    id: 14, parentId: "13", name: "Yuri De Vivo", positionName: "RSPP", team: "",
    description: "??",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png"
  },
  {
    id: 15, parentId: "13", team: "Preposto",
    description: "??"
  },
  {
    id: 16, parentId: "15", name: "Da definire", positionName: "Bologna", team: "", description: "", imageUrl: ""
  },
  {
    id: 17, parentId: "15", name: "Francesco Agrillo", positionName: "Napoli", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/f.agrillo.circle.png"
  },
  {
    id: 18, parentId: "13", team: "RLS",
    description: "??"
  },
  {
    id: 19, parentId: "18", name: "Da definire", positionName: "Bologna", team: "", description: "", imageUrl: ""
  },
  {
    id: 20, parentId: "18", name: "Paolo Sabino", positionName: "Napoli", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/p.sabino.circle.png"
  },
  {
    id: 21, parentId: "13", team: "Fire-fighting manager",
    description: "??"
  },
  {
    id: 71, parentId: "21", team: "Bologna", description: ""
  },
  {
    id: 72, parentId: "71", name: "Rossella Mele", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/r.mele.circle.png"
  },
  {
    id: 73, parentId: "71", name: "Rosario Marano", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/r.marano.circle.png"
  },
  {
    id: 74, parentId: "21", team: "Napoli", description: ""
  },
  {
    id: 75, parentId: "74", name: "Francesco Agrillo", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/f.agrillo.circle.png"
  },
  {
    id: 76, parentId: "74", name: "Erminio Russomando", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/e.russomando.circle.png"
  },
  {
    id: 77, parentId: "13", team: "First Aid Manager", description: "??"
  },
  {
    id: 78, parentId: "77", team: "Bologna", description: ""
  },
  {
    id: 79, parentId: "78", name: "Andrea Gesualdi", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.gesualdi.circle.png"
  },
  {
    id: 80, parentId: "78", name: "Da definire", positionName: "", team: "", description: "", imageUrl: ""
  },
  {
    id: 81, parentId: "77", team: "Napoli", description: ""
  },
  {
    id: 82, parentId: "81", name: "Vincenzo Marseglia", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/v.marseglia.circle.png"
  },
  {
    id: 83, parentId: "81", name: "Erminio Russomando", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/e.russomando.circle.png"
  },
  {
    id: 84, parentId: 1, team: "Offices", description: "??", mainArea: true
  },
  {
    id: 85, parentId: "84", team: "Bologna", description: ""
  },
  {
    id: 86, parentId: "85", name: "Preposto Da definire", positionName: "", team: "", description: "", imageUrl: ""
  },
  {
    id: 87, parentId: "86", name: "Cristina Alexandru", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.alexandru.circle.png"
  },
  {
    id: 88, parentId: "84", team: "Napoli", description: ""
  },
  {
    id: 89, parentId: "88", name: "Francesco Agrillo", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/f.agrillo.circle.png"
  },
  {
    id: 90, parentId: "89", name: "Clara Sansone", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.sansone.circle.png"
  },
  {
    id: 91, parentId: "84", team: "Skopje", description: "",
  },
  {
    id: 92, parentId: "91", name: "Gianmichele Mele", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/g.mele.circle.png"
  },
  {
    id: 93, parentId: "92", name: "Magdalena Gjorgieva", positionName: "", team: "", description: "", imageUrl: ""
  },
  {
    id: 94, parentId: "84", team: "Vancouver", description: "",
  },
  {
    id: 95, parentId: "94", name: "Armin Suljovikj", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.suljovikj.circle.png"
  },
  {
    id: 22, parentId: "1", team: "Business Units",
    description: "The Business Units (BUs) represent the core divisions within the company, each focusing on a specific area of expertise or service offering.<br/>They operate semi-autonomously, with dedicated teams and resources, while aligning with the overall strategy of the organization.<br/><br/>Each Business Unit is responsible for driving its own growth, managing client relationships, and delivering value in its area.",
    mainArea: true
  },
  {
    id: 23, parentId: "22", name: "Tony De Vivo", positionName: "ERP", team: "",
    description: "The ERP Business Unit is responsible for implementing and supporting ERP systems that help organizations manage resources, finance, inventory, procurement, human resources, and customer relations in a unified platform.<br/>The ERP Business Unit works closely with clients to customize and optimize ERP solutions tailored to their specific industry needs, ensuring seamless integration and enhancing overall operational efficiency. <br/><br/>Additionally, the unit provides ongoing support, training, and system upgrades to ensure clients maximize the value of their ERP investments.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png"
  },
  {
    id: 24, parentId: "23", name: "Cesario Marino", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.marino.circle.png"
  },
  {
    id: 25, parentId: "24", name: "Rosario Marano", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/r.marano.circle.png"
  },
  {
    id: 26, parentId: "24", name: "Rossella Mele", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/r.mele.circle.png"
  },
  {
    id: 27, parentId: "23", name: "Francesco Agrillo", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/f.agrillo.circle.png"
  },
  {
    id: 28, parentId: "27", name: "Andrea Agrillo", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.agrillo.circle.png"
  },
  {
    id: 29, parentId: "27", name: "Giovanni Cangiano", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/g.cangiano.circle.png"
  },
  {
    id: 30, parentId: "27", name: "Luigi Antacido", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/L.Antacido.png"
  },
  {
    id: 32, parentId: "27", name: "Yuri Caruso", positionName: "", team: "", description: "", imageUrl: ""
  },
  { id: 33, parentId: "23", name: "Gianmichele Mele", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/g.mele.circle.png" },
  { id: 34, parentId: "33", name: "Elena Tanska", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/e.tanska.circle.png" },
  { id: 35, parentId: "33", name: "Hristijan Najdeski", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/h.najdeski.circle.png" },
  { id: 36, parentId: "33", name: "Ivana Savik", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/i.savik.png" },
  { id: 37, parentId: "33", name: "Monika Nechkoska", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/mo.neckoska.circle.png" },
  { id: 38, parentId: "34", name: "Ile Stevanovski", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/i.stevanovski.circle.png" },
  { id: 39, parentId: "34", name: "Maja Nechkoska", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/ma.neckoska.circle.png" },
  { id: 40, parentId: "34", name: "Simona Trajanovska", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/S.Trajanovska.png" },
  { id: 41, parentId: "23", name: "Paolo Sabino", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/p.sabino.circle.png" },
  { id: 42, parentId: "41", name: "Lorenzo Costa", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/L.Costa.png" },
  { id: 43, parentId: "41", name: "Simone Castiello", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/s.castiello.circle.png" },
  { id: 44, parentId: "41", name: "Vincenzo Iannaccone", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/v.iannaccone.circle.png" },
  { id: 45, parentId: "23", name: "Pietro Natale", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/p.natale.circle.png" },
  { id: 46, parentId: "45", name: "Antonio Silvestro", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.silvestro.circle.png" },
  { id: 47, parentId: "45", name: "Maria Ferrara", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/m.ferrara.circle.png" },
  { id: 48, parentId: "23", name: "Tony De Vivo", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png" },
  { id: 49, parentId: "48", name: "Antonio Riviergi", positionName: "", team: "", description: "", imageUrl: "" },
  { id: 50, parentId: "48", name: "Erminio Russomando", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/e.russomando.circle.png" },
  { id: 51, parentId: "48", name: "Eugenia D’Alconzo", positionName: "", team: "", description: "", imageUrl: "" },
  { id: 52, parentId: "48", name: "Simona Focacci", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/s.focacci-circle.png" },
  { id: 53, parentId: "48", name: "Vincenzo Marseglia", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/v.marseglia.circle.png" },
  { id: 54, parentId: "48", name: "Armin Suljovikj", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.suljovikj.circle.png" },
  {
    id: 55, parentId: "22", name: "Andrea Scarpante", positionName: "Digital", team: "",
    description: "The Digital Business Unit specializes in areas such as custom software development, web and mobile app development, UX/UI design, and digital strategy. <br/>It aims to help businesses adapt to the digital age by improving their online presence, automating processes, and creating user-centered digital experiences. <br/>The Digital Business Unit works with clients to design and implement cutting-edge technologies, ensuring they stay competitive and responsive to market changes. <br/><br/>Additionally, this unit supports continuous improvement through data analytics and agile project management methodologies.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.scarpante.circle.png"
  },
  { id: 56, parentId: "55", name: "Al-Fahad Asaduz", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/Al-fahad.circle.png" },
  { id: 57, parentId: "55", name: "Andrea Gesualdi", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.gesualdi.circle.png" },
  { id: 58, parentId: "55", name: "Andrea Tasselli", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.tasselli.circle.png" },
  { id: 59, parentId: "55", name: "Andrea Veneziano", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.veneziano.circle.png" },
  { id: 60, parentId: "55", name: "Carlo Bottardi", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.bottardi.circle.png" },
  { id: 61, parentId: "55", name: "Carlo Liaci", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/c.liaci.circle.png" },
  { id: 62, parentId: "55", name: "Marco Isolato", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/m.isolato.circle.png" },
  {
    id: 63, parentId: 1, name: "Yuri De Vivo", positionName: "Purchasing", team: "",
    description: "The Purchasing area is responsible for the acquisition of goods and services needed for the company's activities.<br/> This includes managing relationships with suppliers, negotiating contracts, and ensuring timely delivery of materials or services at competitive prices.<br/> The Purchasing department works closely with other business units to understand their needs and ensure that purchases are in line with company requirements and budgets. <br/><br/>This area is responsible for quality control, monitoring supplier performance, and optimizing procurement processes to reduce costs and improve organizational efficiency.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/y.devivo.circle.png",
    mainArea: true
  },
  {
    id: 64, parentId: 1, name: "Tony De Vivo", positionName: "Planning & Procurement", team: "",
    description: "The Planning & Procurement area is responsible for coordinating the procurement of goods and services in alignment with the company’s strategic objectives.<br/> This area involves forecasting and planning the required resources, ensuring that all purchasing activities are well-organized and executed to meet project timelines and budget requirements. <br/><br/>The team works closely with other departments to understand their needs, optimize procurement processes, and maintain efficient inventory management.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/t.devivo.circle.png",
    mainArea: true
  },
  {
    id: 65, parentId: 1, name: "Paolo Sabino", positionName: "Learning", team: "",
    description: "The Learning area is focused on the development and continuous education of employees to enhance their skills and support career growth within the company.<br/>This area designs and implements training programs, workshops, and e-learning opportunities to ensure that employees are equipped with the knowledge and tools necessary for their roles.<br/><br/> The Learning department collaborates with other areas to identify skill gaps, set learning objectives, and deliver personalized development plans.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/p.sabino.circle.png",
    mainArea: true
  },
  {
    id: 66, parentId: 1, name: "Angelo Russo", positionName: "Marketing & Communication", team: "",
    description: "The Marketing and Communications area is responsible for developing and executing strategies to promote the company's brand, products and services.<br/>It creates marketing campaigns, manages the digital presence (website, social media, e-mail) and coordinates public relations activities.<br/><br/>The team is responsible for creating brand awareness, customer engagement and generating leads through content creation, advertising and events. It manages the organization of company events and internal communications, promoting company culture and information to employees.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.russo.circle.png",
    mainArea: true
  },
  { id: 67, parentId: "66", name: "Gianni Nardone", positionName: "", team: "", description: "", imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/g.nardone.circle.png" },
  {
    id: 68, parentId: 1, name: "Angelo Russo", positionName: "R&D", team: "",
    description: "The R&D area is responsible for innovation within the company through research, design, and development of new products, services, or solutions.<br/> This team focuses on identifying emerging trends, technologies and customer needs to create cutting-edge solutions that provide a competitive advantage. <br/><br/>The R&D department works closely with other business units to bring innovative ideas to life, ensuring that they are in line with the company's strategic goals.",
    imageUrl: "https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.russo.circle.png",
    mainArea: true
  },
  {
    id: 69, parentId: 1, team: "Operations",
    description: '<div><?xml version="1.0" encoding="UTF-8"?><svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1559.1 749.05"><defs><style>.cls-1{font-family:Play-Bold, Play;font-weight:700;}.cls-1,.cls-2{fill:#1d1d1b;font-size:50px;}.cls-3{fill:none;stroke:#1d1d1b;stroke-miterlimit:10;stroke-width:4px;}.cls-2{font-family:Play-Regular, Play;}</style></defs><text class="cls-1" transform="translate(667.77 41.23)"><tspan x="0" y="0">Operation</tspan></text><text class="cls-2" transform="translate(104.88 256.28)"><tspan x="0" y="0">Project 1</tspan></text><line class="cls-3" x1="203.57" y1="290.96" x2="203.57" y2="349.93"/><text class="cls-2" transform="translate(0 414.83)"><tspan x="0" y="0">Project Manager 1</tspan></text><text class="cls-2" transform="translate(20.08 573.39)"><tspan x="0" y="0">Team Member 1</tspan></text><text class="cls-2" transform="translate(20.08 655.72)"><tspan x="0" y="0">Team Member 2</tspan></text><text class="cls-2" transform="translate(20.08 738.05)"><tspan x="0" y="0">Team Member 3</tspan></text><line class="cls-3" x1="203.57" y1="449.51" x2="203.57" y2="508.49"/><text class="cls-2" transform="translate(680.87 256.28)"><tspan x="0" y="0">Project 2</tspan></text><line class="cls-3" x1="779.55" y1="290.96" x2="779.55" y2="349.93"/><line class="cls-3" x1="779.55" y1="125.12" x2="779.55" y2="184.09"/><line class="cls-3" x1="779.55" y1="66.14" x2="779.55" y2="125.12"/><polyline class="cls-3" points="203.57 184.09 203.57 125.12 1355.54 125.12 1355.54 184.09"/><text class="cls-2" transform="translate(575.99 414.83)"><tspan x="0" y="0">Project Manager 2</tspan></text><text class="cls-2" transform="translate(596.06 573.39)"><tspan x="0" y="0">Team Member 4</tspan></text><text class="cls-2" transform="translate(596.06 655.72)"><tspan x="0" y="0">Team Member 5</tspan></text><text class="cls-2" transform="translate(596.06 738.05)"><tspan x="0" y="0">Team Member 6</tspan></text><line class="cls-3" x1="779.55" y1="449.51" x2="779.55" y2="508.49"/><text class="cls-2" transform="translate(1256.86 256.28)"><tspan x="0" y="0">Project 3</tspan></text><line class="cls-3" x1="1355.54" y1="290.96" x2="1355.54" y2="349.93"/><text class="cls-2" transform="translate(1151.97 414.83)"><tspan x="0" y="0">Project Manager 3</tspan></text><text class="cls-2" transform="translate(1172.05 573.39)"><tspan x="0" y="0">Team Member 7</tspan></text><text class="cls-2" transform="translate(1172.05 655.72)"><tspan x="0" y="0">Team Member 8</tspan></text><text class="cls-2" transform="translate(1172.05 738.05)"><tspan x="0" y="0">Team Member 9</tspan></text><line class="cls-3" x1="1355.54" y1="449.51" x2="1355.54" y2="508.49"/></svg></div>',
    mainArea: true
  }
];

const pathUrl = process.env.REACT_APP_BASE_URL;

export const OrganizationalChart = () => {
  // const [treeData, setTreeData] = useState(orgData);
  // const [treeDataCard, setTreeDataCard] = useState(orgDataCard);
  const [dragItem, setDragItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [sydeaEmployees, setsydeaEmployees] = useState(null);


  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch(`${pathUrl}/static/people/data-people.csv?_cache_buster=${Date.now()}`, {
          cache: 'no-store',
        });
        
        const text = await response.text();
        const parsedData = d3.csvParse(text);
        setsydeaEmployees(parsedData);
      } catch (error) {
        console.error('Errore nel caricamento del CSV:', error);
      }
    };
    loadCSV();
  }, []); 

  const searchChildren = (team) => {
    let dragIndex = null, dropOverIndex = null;
    for (let k = 0; k < team.length; k++) {
      if (team[k].name === dragItem) {
        dragIndex = k;
      }
      if (team[k].name === dragOverItem) {
        dropOverIndex = k;
      }
    }
    if (dragIndex == null || dropOverIndex == null) {
      for (let kj = 0; kj < team.length; kj++) {
        if (team[kj] && team[kj].team) {
          searchChildren(team[kj].team);
        }
      }
    }
    else {
      let newDragData = team[dropOverIndex];
      team[dropOverIndex] = team[dragIndex];
      team[dragIndex] = newDragData;
    }
  }

  const onDrop = () => {
    // const { treeData } = this.state;
    // searchChildren(treeData.team);
    // this.setState({
    //   treeData
    // })
  }


  const drag = (node) => {
    setDragItem(node.name);
  }

  const dragOver = (event, node) => {
    event.preventDefault();
    setDragOverItem(node.name);
  }

  const MyNodeComponent = ({ node }) => {
    return <div
      onDrop={() => onDrop()}
      onDragOver={(event) => dragOver(event, node)}
      draggable="true"
      onDragStart={() => drag(node)}>
      <Branch data={node} />
    </div>;
  };
  

  return (
    <div style={{backgroundColor:'#141414', paddingTop:'3rem', overflow:'auto'}} className='p-3'>

      <NewOrganizationalChart data={sydeaEmployees}></NewOrganizationalChart>
      {/* <div className="box-org">
        <OrgChart tree={treeData} NodeComponent={MyNodeComponent} />
      </div> */}

      {/* <div style={{color:'#ffff'}} className='d-flex row mt-5'>
        {treeData.children.map((item, index) => (
          <div key={index} className='col-sm-12 col-md-6 pb-4'>
            <div>
              <p className='m-0 fw-bold fs-5'>{item.role}</p>
              <p className='m-0'>{item.name}</p>
            </div>
            {item.team && item.team.map((item, i) => (
              <div key={i} style={{paddingLeft:'2rem'}}>
                <p className='m-0 fw-bold fs-5'>{item.role}</p>
                <p className='m-0'>{item.name}</p>
              </div>
            ))}
            {item.children && item.children.map((item, i) => (
              <div key={i} style={{paddingLeft:'2rem'}}>
                <div>
                  <p className='m-0 fw-bold fs-5'>{item.role}</p>
                  <p className='m-0'>{item.name}</p>
                </div>
                {item.team && item.team.map((item, i) => (
                  <div key={i} style={{paddingLeft:'2rem'}}>
                    <div>
                      <p className='m-0 fw-bold fs-5'>{item.role}</p>
                      <p className='m-0'>{item.name}</p>
                    </div>
                    {item.team && item.team.map((item, i) => (
                      <div key={i} style={{paddingLeft:'2rem'}}>
                        <p className='m-0 fw-bold fs-5'>{item.role}</p>
                        <p className='m-0'>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div> */}

      {/* <div className='mt-5'>
        <div className="my-card gap-2">
        {treeDataCard.map((item, index) => (
          <div key={index} className='detail-card-ord'>
            <div className='label-area-org'>
              <p className='m-0'>{item.role}</p>
            </div>
            <div style={{color:'#ffff'}} className='team-1-visibility'>
              <p className='m-0'>{item.name}</p>
            </div>
          </div>
        ))}
        </div>
      </div> */}

    </div>
  );
};
