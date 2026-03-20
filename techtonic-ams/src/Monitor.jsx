import { C } from './constants.js';
import { fmtCost } from './helpers.js';
import { Tag, Dot, Btn } from './atoms.jsx';

export default function Monitor({clients,agents,setAgents,filterMonitor,setFilterMonitor,openAgentModal,openClient}){
  const filtered=filterMonitor==="All"?agents:agents.filter(a=>a.client===filterMonitor);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"17px"}}>
        <div><h1 style={{fontSize:"16px",fontWeight:"bold",color:"#f1f5f9",margin:0}}>Agent Monitor</h1><div style={{color:C.sub,fontSize:"10px",marginTop:"3px"}}>Click agent or client name to drill in</div></div>
        <div style={{display:"flex",gap:"4px"}}>{["All",...clients.map(x=>x.name)].map(opt=><span key={opt} onClick={()=>setFilterMonitor(opt)} style={{background:filterMonitor===opt?C.accent:C.panel,color:filterMonitor===opt?"#fff":C.sub,padding:"4px 8px",borderRadius:"4px",fontSize:"9px",border:`1px solid ${filterMonitor===opt?C.accent:C.border}`,cursor:"pointer"}}>{opt}</span>)}</div>
      </div>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["ID","Persona","Agent","Client","Status","Role","Memories","Success","Cost/mo","Env"].map(h=><th key={h} style={{padding:"9px 10px",color:C.sub,fontSize:"8px",textAlign:"left",letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(a=>{
              const acl=clients.find(x=>x.name===a.client);
              const memCount=a.intelligence?.persistentMemory?.length||0;
              return(
                <tr key={a.id} style={{borderBottom:"1px solid #0a0f1a"}}>
                  <td style={{padding:"9px 10px",color:C.sub,fontSize:"9px"}}>{a.id}</td>
                  <td style={{padding:"9px 10px"}}><span style={{color:C.purple,fontWeight:"bold",fontSize:"11px",cursor:"pointer",textDecoration:"underline"}} onClick={()=>openAgentModal(a.id,"intelligence")}>{a.intelligence?.persona?.name||"\u2014"}</span></td>
                  <td style={{padding:"9px 10px",cursor:"pointer"}} onClick={()=>openAgentModal(a.id,"overview")}><span style={{color:C.accent,fontWeight:"bold",fontSize:"11px",textDecoration:"underline",whiteSpace:"nowrap"}}>{a.name}</span></td>
                  <td style={{padding:"9px 10px"}}><span onClick={()=>acl&&openClient(acl.id)} style={{color:C.accent,fontSize:"10px",cursor:"pointer",textDecoration:"underline",whiteSpace:"nowrap"}}>{a.client}</span></td>
                  <td style={{padding:"9px 10px"}}><span style={{display:"flex",alignItems:"center",gap:"4px"}}><Dot s={a.status}/><span style={{fontSize:"9px",color:a.status==="running"?C.green:C.orange}}>{a.status}</span></span></td>
                  <td style={{padding:"9px 10px"}}><Tag color={C.teal}>{a.role}</Tag></td>
                  <td style={{padding:"9px 10px"}}><span style={{cursor:"pointer",color:memCount>3?C.teal:C.sub,fontSize:"10px",fontWeight:"bold"}} onClick={()=>openAgentModal(a.id,"memory")}>{"\uD83D\uDCBE"} {memCount}</span></td>
                  <td style={{padding:"9px 10px",color:a.success>=95?C.green:C.yellow,fontWeight:"bold",fontSize:"11px"}}>{a.success}%</td>
                  <td style={{padding:"9px 10px",color:C.green,fontWeight:"bold",fontSize:"11px"}}>{fmtCost(a.usage.costUSD)}</td>
                  <td style={{padding:"9px 10px"}}><Tag color={C.accent}>{a.env}</Tag></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
