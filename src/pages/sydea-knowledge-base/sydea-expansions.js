import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import "./sydea-expansions.scss";

export default function SydeaExpansionSimulator() {
  const [turn, setTurn] = useState(1);
  const [projects, setProjects] = useState([]);
  const [talents, setTalents] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [resources, setResources] = useState({ tempo: 3, denaro: 3, formazione: 1 });

  useEffect(() => {
    // Mock deck generation on game start
    const mockProjects = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      nome: `Progetto ${i + 1}`,
      countdown: 7,
      costoAvvio: 1 + i,
      costoChiusura: { tempo: 1, denaro: 2, formazione: 3 },
      ricompensa: { pv: 2 + i, denaro: 1, formazione: 1 },
      malus: { pv: -1, denaro: -1, formazione: -1 },
    }));
    const mockTalents = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      nome: `Talento ${i + 1}`,
      formazione: 2 + i,
    }));
    const mockEvents = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      nome: `Evento ${i + 1}`,
      effetto: "+1 denaro",
    }));
    setProjects(mockProjects);
    setTalents(mockTalents);
    setEvents(mockEvents);
  }, []);

  const startProject = (project) => {
    if (resources.tempo >= project.costoAvvio) {
      setResources({ ...resources, tempo: resources.tempo - project.costoAvvio });
      setActiveProjects([...activeProjects, { ...project }]);
    }
  };

  const nextTurn = () => {
    setTurn(turn + 1);
    const updatedProjects = activeProjects.map((p) => ({ ...p, countdown: p.countdown - 1 }));
    updatedProjects.forEach((p) => {
      if (p.countdown <= 0) {
        console.log(`Il progetto ${p.nome} è fallito. Applica malus.`);
      }
    });
    setActiveProjects(updatedProjects.filter((p) => p.countdown > 0));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sydea Expansion Simulator</h1>
      <p>Turno: {turn}</p>
      <button onClick={nextTurn} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Avanza Turno</button>
      <h2 className="text-lg font-semibold mt-4">Progetti Disponibili</h2>
      {projects.map((p) => (
        <div key={p.id} className="border p-2 my-2">
          <p>{p.nome} - Countdown: {p.countdown}</p>
          <button onClick={() => startProject(p)} className="bg-green-500 text-white px-2 py-1 rounded">Avvia</button>
        </div>
      ))}
      <h2 className="text-lg font-semibold mt-4">Progetti Attivi</h2>
      {activeProjects.map((p) => (
        <div key={p.id} className="border p-2 my-2 bg-yellow-100">
          <p>{p.nome} - Countdown: {p.countdown}</p>
        </div>
      ))}
      <h2 className="text-lg font-semibold mt-4">Risorse</h2>
      <p>Tempo: {resources.tempo}</p>
      <p>Denaro: {resources.denaro}</p>
      <p>Formazione: {resources.formazione}</p>
    </div>
  );
}
