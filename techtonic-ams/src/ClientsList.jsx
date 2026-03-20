import { C, PHASES } from './constants.js';
import { fmtCost } from './helpers.js';
import { Tag, Btn, Inp } from './atoms.jsx';

export default function ClientsList({clients,agents,newMode,setNewMode,draft,setDraft,onCreate,openClient}){
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"17px"}}>
        <div><h1 style={{fontSize:"16px",fontWeight:"bold",color:"#f1f5f9",margin:0}}>Clients</h1><div style={{color:C.sub,fontSize:"10px",marginTop:"3px"}}>Select a client to enter their isolated workspace</div></div>
        <Btn v="primary" onClick={()=>setNewMode(true)}>+ New Client</Btn>
      </div>
      {newMode&&(
        <div style={{background:C.panel,border:`1px solid ${C.accent}`,borderRadius:"8px",padding:"20px",marginBottom:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>New Client</div><button onClick={()=>setNewMode(false)} style={{background:"transparent",border:"none",color:C.sub,cursor:"pointer",fontSize:"18px"}}>{"\u00d7"}</button></div>
          <div style={{background:"#0d1a2a",border:"1px solid #1a2a3a",borderRadius:"5px",padding:"9px 12px",marginBottom:"14px",fontSize:"10px",color:"#93c5fd"}}>After creating the client you will enter their workspace to start the five-phase onboarding process.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <Inp label="Company Name *" value={draft.name} onChange={v=>setDraft({...draft,name:v})} placeholder="e.g. CzechBank s.r.o."/>
            <Inp label="Industry" value={draft.industry} onChange={v=>setDraft({...draft,industry:v})} placeholder="e.g. Finance, Healthcare"/>
            <Inp label="Primary Contact" value={draft.contact} onChange={v=>setDraft({...draft,contact:v})} placeholder="Name \u00b7 email"/>
            <div><label style={{color:C.sub,fontSize:"9px",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>TIER</label><select value={draft.tier} onChange={e=>setDraft({...draft,tier:e.target.value})} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,color:C.text,padding:"7px 9px",borderRadius:"4px",fontSize:"11px",fontFamily:"monospace"}}><option>Professional</option><option>Enterprise</option></select></div>
          </div>
          <Inp label="Brief Description" value={draft.description} onChange={v=>setDraft({...draft,description:v})} rows={2} placeholder="What does this company do?"/>
          <div style={{display:"flex",gap:"8px",justifyContent:"flex-end",marginTop:"4px"}}><Btn onClick={()=>setNewMode(false)}>Cancel</Btn><Btn v="primary" disabled={!draft.name} onClick={onCreate}>Create & Start Onboarding {"\u2192"}</Btn></div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px"}}>
        {clients.map(cl=>{
          const cA=agents.filter(a=>a.client===cl.name);
          const ob=cl.onboarding;const cost=cA.reduce((s,a)=>s+a.usage.costUSD,0);
          return(
            <div key={cl.id} onClick={()=>openClient(cl.id)} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"17px",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.accent} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"9px"}}><div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>{cl.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{cl.industry} {"\u00b7"} {cl.tier} {"\u00b7"} since {cl.since}</div></div><Tag color={cl.status==="active"?C.green:C.accent} bg={cl.status==="active"?"#0d2a0d":"#0d1a2a"}>{cl.status}</Tag></div>
              <div style={{color:C.sub,fontSize:"10px",marginBottom:"10px",lineHeight:"1.5",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{cl.description}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"5px",marginBottom:"9px"}}>
                {[{l:"Agents",v:cA.length},{l:"Running",v:cA.filter(a=>a.status==="running").length},{l:"Envs",v:cl.environments.length},{l:"$/mo",v:fmtCost(cost)}].map(s=>(
                  <div key={s.l} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"3px",padding:"5px",textAlign:"center"}}><div style={{color:s.l==="$/mo"?C.green:C.accent,fontWeight:"bold",fontSize:s.l==="$/mo"?"11px":"14px"}}>{s.v}</div><div style={{color:C.sub,fontSize:"8px"}}>{s.l}</div></div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"6px",background:C.bg,borderRadius:"4px",padding:"6px 9px"}}>
                <span style={{fontSize:"10px"}}>{PHASES[ob.currentPhase]?.icon}</span>
                <span style={{color:ob.currentPhase>=4?C.green:C.accent,fontSize:"10px",flex:1}}>Phase {ob.currentPhase+1}: {PHASES[ob.currentPhase]?.label}</span>
                <div style={{display:"flex",gap:"2px"}}>{PHASES.map((_,i)=><div key={i} style={{width:"9px",height:"4px",borderRadius:"2px",background:i<ob.currentPhase?C.green:i===ob.currentPhase?C.accent:C.border}}/>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
