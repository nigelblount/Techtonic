import { C, MODELS } from './constants.js';
import { getProv, getMod, fmtCost } from './helpers.js';
import { Tag, Hr, Btn } from './atoms.jsx';

export default function AgentModal({agentId,agentTab,setAgentTab,agents,setAgents,clients,onClose}){
  const a=agents.find(x=>x.id===agentId);
  if(!a)return null;
  const acl=clients.find(x=>x.name===a.client);
  const env=acl?.environments.find(e=>e.id===a.env);
  const capPct=a.usage.monthlyCapUSD>0?Math.min(100,(a.usage.costUSD/a.usage.monthlyCapUSD)*100):0;
  const capCol=capPct>90?C.red:capPct>70?C.orange:C.green;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div style={{background:C.panel,border:`1px solid ${C.accent}`,borderRadius:"10px",width:"540px",maxHeight:"88vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#0d1a2a",border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px"}}>{"\uD83E\uDD16"}</div>
            <div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"14px"}}>{a.intelligence?.persona?.name||a.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{a.id} {"\u00b7"} {a.client} {"\u00b7"} {a.role}</div></div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.sub,cursor:"pointer",fontSize:"20px"}}>{"\u00d7"}</button>
        </div>
        <div style={{display:"flex",gap:"2px",padding:"0 20px",borderBottom:`1px solid ${C.border}`}}>
          {["overview","intelligence","memory","credentials","usage"].map(t=>(
            <button key={t} onClick={()=>setAgentTab(t)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${agentTab===t?C.accent:"transparent"}`,color:agentTab===t?C.accent:C.sub,padding:"7px 11px",cursor:"pointer",fontSize:"10px",fontFamily:"monospace",textTransform:"capitalize",marginBottom:"-1px"}}>{t}</button>
          ))}
        </div>
        <div style={{padding:"18px"}}>
          {agentTab==="overview"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:"12px"}}>
                {[["Success",`${a.success}%`,a.success>=95?C.green:C.yellow],["Runs",a.runs.toLocaleString(),C.accent],["Cost",fmtCost(a.usage.costUSD),C.green]].map(([l,val,col])=>(
                  <div key={l} style={{background:C.bg,borderRadius:"5px",padding:"10px",textAlign:"center"}}><div style={{color:col,fontWeight:"bold",fontSize:"18px"}}>{val}</div><div style={{color:C.sub,fontSize:"8px"}}>{l}</div></div>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:"5px",padding:"12px"}}>
                <Hr title="Configuration"/>
                {[["Role",a.role],["Activity",a.activity],["Tools",a.tools.join(", ")],["Env",a.env],["Model",`${getProv(env)?.icon} ${getMod(env)?.label||"\u2014"}`]].map(([k,val])=>(
                  <div key={k} style={{display:"flex",gap:"9px",marginBottom:"4px"}}><span style={{color:C.sub,width:"60px",fontSize:"9px",flexShrink:0}}>{k}</span><span style={{color:C.text,fontSize:"10px"}}>{val}</span></div>
                ))}
              </div>
            </div>
          )}
          {agentTab==="intelligence"&&a.intelligence&&(
            <div>
              <div style={{background:C.bg,borderRadius:"5px",padding:"12px",marginBottom:"10px"}}>
                <Hr title="Role DNA"/>
                <div style={{color:C.accent,fontWeight:"bold",fontSize:"14px",marginBottom:"8px"}}>{a.intelligence.persona.name}</div>
                {[["Tone",a.intelligence.persona.tone],["Expertise",a.intelligence.persona.expertise]].map(([k,val])=>(
                  <div key={k} style={{marginBottom:"8px"}}><div style={{color:C.sub,fontSize:"8px",letterSpacing:"1px",marginBottom:"2px"}}>{k.toUpperCase()}</div><div style={{color:C.text,fontSize:"11px"}}>{val}</div></div>
                ))}
                <Hr title="Hard Boundaries"/>
                {(a.intelligence.persona.boundaries||[]).map((b,i)=>(
                  <div key={i} style={{color:C.orange,fontSize:"10px",padding:"3px 0",borderBottom:"1px solid #0a0f1a"}}>{"\u26D4"} {b}</div>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:"5px",padding:"12px"}}><Hr title="Onboarding Context"/><div style={{color:"#93c5fd",fontSize:"10px",lineHeight:"1.7",fontStyle:"italic"}}>{a.intelligence.auditContext}</div></div>
            </div>
          )}
          {agentTab==="memory"&&a.intelligence&&(
            <div>
              <div style={{background:C.bg,borderRadius:"5px",padding:"12px",marginBottom:"10px"}}>
                <Hr title="Live Memory"/>
                {a.intelligence.liveMemory.map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:"9px",padding:"5px 0",borderBottom:"1px solid #0a0f1a"}}><span style={{color:C.sub,fontSize:"9px",width:"55px",flexShrink:0,fontFamily:"monospace"}}>{m.ts}</span><span style={{color:"#86efac",fontSize:"10px"}}>{m.entry}</span></div>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:"5px",padding:"12px"}}>
                <Hr title="Persistent Memory"/>
                {(a.intelligence.persistentMemory||[]).map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:"9px",padding:"6px 0",borderBottom:"1px solid #0a0f1a",alignItems:"flex-start"}}>
                    <span style={{color:C.sub,fontSize:"9px",width:"68px",flexShrink:0}}>{m.date}</span>
                    <Tag color={m.type==="correction"||m.type==="rule_update"?C.orange:m.type==="anomaly"?C.red:C.teal}>{m.type}</Tag>
                    <span style={{color:C.text,fontSize:"10px",flex:1}}>{m.entry}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {agentTab==="credentials"&&(
            <div>
              <div style={{background:C.bg,borderRadius:"6px",padding:"14px",marginBottom:"12px"}}>
                <Hr title="API Key"/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                  <div><div style={{color:C.text,fontFamily:"monospace",fontSize:"12px",marginBottom:"3px"}}>{a.credentials.masked}</div><div style={{color:C.sub,fontSize:"9px"}}>Key ID: {a.credentials.keyId}</div></div>
                  <Tag color={C.green} bg="#0d2a0d">{"\u25CF"} {a.credentials.status}</Tag>
                </div>
                {[["Provider",a.credentials.provider],["Created",a.credentials.createdAt],["Rotated",a.credentials.rotatedAt]].map(([k,val])=>(
                  <div key={k} style={{display:"flex",gap:"10px",marginBottom:"4px"}}><span style={{color:C.sub,width:"65px",fontSize:"9px",flexShrink:0}}>{k}</span><span style={{color:C.text,fontSize:"10px"}}>{val}</span></div>
                ))}
              </div>
              <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
                <Btn v="warn" onClick={()=>setAgents(p=>p.map(x=>x.id===a.id?{...x,credentials:{...x.credentials,keyId:`key_${Math.random().toString(36).slice(2,10)}`,rotatedAt:new Date().toISOString().slice(0,10)}}:x))}>{"\uD83D\uDD04"} Rotate Key</Btn>
                <Btn v="danger">{"\u26D4"} Revoke</Btn>
              </div>
              <div style={{background:C.bg,borderRadius:"6px",padding:"12px"}}>
                <Hr title="Monthly Spend Cap"/>
                <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"5px"}}>
                  <span style={{color:C.sub}}>$</span>
                  <input type="number" value={a.usage.monthlyCapUSD} onChange={e=>setAgents(p=>p.map(x=>x.id===a.id?{...x,usage:{...x.usage,monthlyCapUSD:parseFloat(e.target.value)||0}}:x))} style={{width:"100px",background:C.panel,border:`1px solid ${C.border}`,color:C.text,padding:"6px 9px",borderRadius:"4px",fontSize:"12px",fontFamily:"monospace"}}/>
                  <span style={{color:C.sub,fontSize:"10px"}}>USD / month</span>
                </div>
              </div>
            </div>
          )}
          {agentTab==="usage"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px",marginBottom:"12px"}}>
                {[["Cost",fmtCost(a.usage.costUSD),capCol],["Cap",a.usage.monthlyCapUSD>0?`$${a.usage.monthlyCapUSD}`:"Unlimited",C.sub],["Tokens In",a.usage.tokensIn>=1000?`${Math.floor(a.usage.tokensIn/1000)}K`:String(a.usage.tokensIn),C.teal],["Calls",a.usage.calls.toLocaleString(),C.accent]].map(([l,val,col])=>(
                  <div key={l} style={{background:C.bg,borderRadius:"5px",padding:"10px",textAlign:"center"}}><div style={{color:col,fontWeight:"bold",fontSize:"18px"}}>{val}</div><div style={{color:C.sub,fontSize:"8px"}}>{l}</div></div>
                ))}
              </div>
              {a.usage.monthlyCapUSD>0&&(
                <div style={{background:C.bg,borderRadius:"6px",padding:"12px",marginBottom:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}><span style={{color:C.sub,fontSize:"9px"}}>SPEND VS CAP</span><span style={{color:capCol,fontSize:"10px",fontWeight:"bold"}}>{capPct.toFixed(1)}%</span></div>
                  <div style={{background:C.border,borderRadius:"3px",height:"6px",overflow:"hidden"}}><div style={{width:`${capPct}%`,background:capCol,height:"100%"}}/></div>
                </div>
              )}
              <div style={{background:C.bg,borderRadius:"6px",padding:"12px"}}>
                <Hr title="Monthly History"/>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Month","Calls","Cost"].map(h=><th key={h} style={{padding:"6px 8px",color:C.sub,fontSize:"8px",textAlign:"left"}}>{h}</th>)}</tr></thead>
                  <tbody>{a.usage.history.map((h,i)=><tr key={i} style={{borderBottom:"1px solid #0a0f1a"}}><td style={{padding:"7px 8px",color:C.text,fontSize:"11px"}}>{h.month}</td><td style={{padding:"7px 8px",color:C.accent,fontSize:"11px"}}>{h.calls.toLocaleString()}</td><td style={{padding:"7px 8px",color:C.green,fontSize:"11px",fontWeight:"bold"}}>{fmtCost(h.costUSD)}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
