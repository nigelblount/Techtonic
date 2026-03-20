import { useState } from 'react';
import { C, DM } from './constants.js';
import { mkC, mkU, mkI } from './helpers.js';
import { SEED_CLIENTS, SEED_AGENTS } from './seed.js';
import Dashboard from './Dashboard.jsx';
import ClientsList from './ClientsList.jsx';
import ClientWorkspace from './ClientWorkspace.jsx';
import Monitor from './Monitor.jsx';
import AgentModal from './AgentModal.jsx';
import EnvModal from './EnvModal.jsx';

const NAV=[{id:"dashboard",label:"Command Center",icon:"📊"},{id:"clients",label:"Clients",icon:"🏢"},{id:"monitor",label:"Agent Monitor",icon:"🤖"}];

export default function App(){
  const [clients,setClients]=useState(SEED_CLIENTS);
  const [agents,setAgents]=useState(SEED_AGENTS);
  const [nav,setNav]=useState("dashboard");
  const [activeClient,setActiveClient]=useState(null);
  const [clientTab,setClientTab]=useState("overview");

  // new-client draft
  const [newMode,setNewMode]=useState(false);
  const [draft,setDraft]=useState({name:"",industry:"",contact:"",tier:"Professional",description:""});

  // monitor filter
  const [filterMonitor,setFilterMonitor]=useState("All");

  // modals
  const [agentModal,setAgentModal]=useState(null); // {id, tab}
  const [agentTab,setAgentTab]=useState("overview");
  const [envModal,setEnvModal]=useState(null); // {cid, eid}

  const openClient=(cid)=>{setActiveClient(cid);setClientTab("overview");setNav("clients");};
  const openAgentModal=(id,tab="overview")=>{setAgentModal(id);setAgentTab(tab);};
  const openEnvModal=(cid,eid)=>setEnvModal({cid,eid});

  const onCreate=()=>{
    if(!draft.name.trim())return;
    const newId=Date.now();
    const newCl={
      id:newId,name:draft.name.trim(),industry:draft.industry||"General",
      status:"onboarding",since:new Date().toISOString().slice(0,10),
      contact:draft.contact||"",tier:draft.tier,description:draft.description||"",
      integrations:[],environments:[{id:`ENV-${draft.name.slice(0,3).toUpperCase()}-01`,status:"idle",created:new Date().toISOString().slice(0,10),integrationIds:[],agentIds:[],model:{...DM}}],
      workflows:[],notes:"",
      onboarding:{currentPhase:0,phases:{discovery:{status:"active",data:{}},audit:{status:"pending",data:{workflows:[]}},systems:{status:"pending",data:{}},design:{status:"pending",data:{agents:[]}},package:{status:"pending",data:{}}}}
    };
    setClients(p=>[...p,newCl]);
    setDraft({name:"",industry:"",contact:"",tier:"Professional",description:""});
    setNewMode(false);
    openClient(newId);
  };

  const updEnvModel=(cid,eid,patch)=>setClients(p=>p.map(x=>x.id===cid?{...x,environments:x.environments.map(e=>e.id===eid?{...e,model:{...e.model,...patch}}:e)}:x));

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"monospace",fontSize:"12px",overflow:"hidden"}}>

      {/* Sidebar */}
      <div style={{width:"190px",flexShrink:0,background:C.panel,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"0"}}>
        <div style={{padding:"16px 14px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px",letterSpacing:".5px"}}>TechTonic AMS</div>
          <div style={{color:C.sub,fontSize:"8px",marginTop:"2px",letterSpacing:"1px"}}>AGENT MANAGEMENT</div>
        </div>
        <nav style={{padding:"10px 6px",flex:1}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{setNav(n.id);setActiveClient(null);}} style={{width:"100%",textAlign:"left",background:nav===n.id&&!activeClient?"#0d1a2a":"transparent",border:`1px solid ${nav===n.id&&!activeClient?C.accent:"transparent"}`,color:nav===n.id&&!activeClient?C.accent:C.sub,padding:"8px 10px",borderRadius:"5px",cursor:"pointer",fontSize:"10px",fontFamily:"monospace",marginBottom:"2px",display:"flex",gap:"8px",alignItems:"center"}}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
          {clients.length>0&&(
            <div style={{marginTop:"14px"}}>
              <div style={{color:C.sub,fontSize:"8px",letterSpacing:"1.5px",padding:"0 10px",marginBottom:"5px"}}>CLIENTS</div>
              {clients.map(cl=>(
                <button key={cl.id} onClick={()=>openClient(cl.id)} style={{width:"100%",textAlign:"left",background:activeClient===cl.id?"#0d1a2a":"transparent",border:`1px solid ${activeClient===cl.id?C.accent:"transparent"}`,color:activeClient===cl.id?C.accent:C.sub,padding:"6px 10px",borderRadius:"5px",cursor:"pointer",fontSize:"9px",fontFamily:"monospace",marginBottom:"1px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  <span style={{marginRight:"5px"}}>{cl.status==="active"?"🟢":"🔵"}</span>{cl.name}
                </button>
              ))}
            </div>
          )}
        </nav>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
          <div style={{color:C.sub,fontSize:"8px"}}>{agents.filter(a=>a.status==="running").length} agents running</div>
          <div style={{color:C.sub,fontSize:"8px"}}>{clients.length} clients</div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
        {!activeClient&&nav==="dashboard"&&<Dashboard clients={clients} agents={agents}/>}
        {!activeClient&&nav==="clients"&&(
          <ClientsList clients={clients} agents={agents} newMode={newMode} setNewMode={setNewMode} draft={draft} setDraft={setDraft} onCreate={onCreate} openClient={openClient}/>
        )}
        {!activeClient&&nav==="monitor"&&(
          <Monitor clients={clients} agents={agents} setAgents={setAgents} filterMonitor={filterMonitor} setFilterMonitor={setFilterMonitor} openAgentModal={openAgentModal} openClient={openClient}/>
        )}
        {activeClient&&(
          <ClientWorkspace cid={activeClient} clients={clients} setClients={setClients} agents={agents} openAgentModal={openAgentModal} openEnvModal={openEnvModal} onBack={()=>setActiveClient(null)} clientTab={clientTab} setClientTab={setClientTab}/>
        )}
      </div>

      {/* Modals */}
      {agentModal&&(
        <AgentModal agentId={agentModal} agentTab={agentTab} setAgentTab={setAgentTab} agents={agents} setAgents={setAgents} clients={clients} onClose={()=>setAgentModal(null)}/>
      )}
      {envModal&&(
        <EnvModal cid={envModal.cid} eid={envModal.eid} clients={clients} updEnvModel={updEnvModel} onClose={()=>setEnvModal(null)}/>
      )}
    </div>
  );
}
