import { C, PHASES } from './constants.js';
import { fmtCost } from './helpers.js';
import { Tag } from './atoms.jsx';

export default function Dashboard({clients,agents}){
  const running=agents.filter(a=>a.status==="running").length;
  const totalCost=agents.reduce((s,a)=>s+a.usage.costUSD,0);
  return(
    <div>
      <div style={{marginBottom:"20px"}}><h1 style={{fontSize:"16px",fontWeight:"bold",color:"#f1f5f9",margin:0}}>Command Center</h1><div style={{color:C.sub,fontSize:"10px",marginTop:"3px"}}>Platform-wide overview</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"9px",marginBottom:"16px"}}>
        {[{l:"Active Agents",v:running,col:C.green},{l:"Clients",v:clients.length,col:C.accent},{l:"Total Memories",v:agents.reduce((s,a)=>s+(a.intelligence?.persistentMemory?.length||0),0),col:C.purple},{l:"Platform Cost/mo",v:fmtCost(totalCost),col:C.green},{l:"Onboarded",v:`${clients.filter(x=>x.onboarding.currentPhase>=4).length}/${clients.length}`,col:C.teal}].map(s=>(
          <div key={s.l} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"7px",padding:"14px"}}>
            <div style={{color:C.sub,fontSize:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>{s.l}</div>
            <div style={{color:s.col,fontSize:s.l.includes("Cost")?"17px":"22px",fontWeight:"bold",margin:"4px 0 2px"}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px"}}>
        {clients.map(cl=>{
          const cA=agents.filter(a=>a.client===cl.name);
          const ob=cl.onboarding;const ph=PHASES[ob.currentPhase];
          const cost=cA.reduce((s,a)=>s+a.usage.costUSD,0);
          return(
            <div key={cl.id} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"9px"}}><div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>{cl.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{cl.industry} {"\u00b7"} {cl.tier}</div></div><Tag color={cl.status==="active"?C.green:C.accent} bg={cl.status==="active"?"#0d2a0d":"#0d1a2a"}>{cl.status}</Tag></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"5px",marginBottom:"9px"}}>
                {[{l:"Agents",v:cA.length,col:C.accent},{l:"Running",v:cA.filter(a=>a.status==="running").length,col:C.green},{l:"Memories",v:cA.reduce((s,a)=>s+(a.intelligence?.persistentMemory?.length||0),0),col:C.purple},{l:"Envs",v:cl.environments.length,col:C.teal},{l:"$/mo",v:fmtCost(cost),col:C.green}].map(s=>(
                  <div key={s.l} style={{background:C.bg,borderRadius:"4px",padding:"5px",textAlign:"center"}}><div style={{color:s.col,fontWeight:"bold",fontSize:s.l==="$/mo"?"11px":"13px"}}>{s.v}</div><div style={{color:C.sub,fontSize:"8px"}}>{s.l}</div></div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"8px",background:C.bg,borderRadius:"5px",padding:"7px 10px"}}>
                <span>{ph?.icon}</span>
                <div style={{flex:1}}><div style={{color:ob.currentPhase>=4?C.green:C.accent,fontSize:"10px",fontWeight:"bold"}}>Phase {ob.currentPhase+1}: {ph?.label}</div></div>
                <div style={{display:"flex",gap:"2px"}}>{PHASES.map((_,i)=><div key={i} style={{width:"9px",height:"4px",borderRadius:"2px",background:i<ob.currentPhase?C.green:i===ob.currentPhase?C.accent:C.border}}/>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
