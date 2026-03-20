import { useState } from 'react';
import { C, CTABS, TICONS, PHASES, INTS, ROLES, ACTS } from './constants.js';
import { fmtCost, getProv, getMod, compilePkg } from './helpers.js';
import { Tag, Dot, Hr, Btn, Inp } from './atoms.jsx';

// ── helpers ──────────────────────────────────────────────────────────────────
const S={row:{display:"flex",gap:"9px",marginBottom:"5px"},k:{color:C.sub,width:"130px",fontSize:"9px",flexShrink:0,letterSpacing:".5px"},v:{color:C.text,fontSize:"10px"},box:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",padding:"14px",marginBottom:"10px"}};

// ── Overview ─────────────────────────────────────────────────────────────────
function Overview({cl,cAgents,openAgentModal,openEnvModal}){
  const running=cAgents.filter(a=>a.status==="running").length;
  const cost=cAgents.reduce((s,a)=>s+a.usage.costUSD,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",marginBottom:"14px"}}>
        {[{l:"Agents",v:cAgents.length,col:C.accent},{l:"Running",v:running,col:C.green},{l:"Environments",v:cl.environments.length,col:C.teal},{l:"Cost / mo",v:fmtCost(cost),col:C.green}].map(s=>(
          <div key={s.l} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"7px",padding:"13px",textAlign:"center"}}><div style={{color:s.col,fontWeight:"bold",fontSize:s.l==="Cost / mo"?"14px":"20px"}}>{s.v}</div><div style={{color:C.sub,fontSize:"8px"}}>{s.l}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
        <div style={S.box}>
          <Hr title="Client Details"/>
          {[["Industry",cl.industry],["Tier",cl.tier],["Since",cl.since],["Contact",cl.contact],["Status",cl.status]].map(([k,v])=>(
            <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v}</span></div>
          ))}
          {cl.notes&&<div style={{marginTop:"8px",background:"#0d1a2a",border:`1px solid ${C.border}`,borderRadius:"4px",padding:"8px",color:"#93c5fd",fontSize:"10px",lineHeight:"1.6"}}>{cl.notes}</div>}
        </div>
        <div style={S.box}>
          <Hr title="Active Agents"/>
          {cAgents.length===0&&<div style={{color:C.sub,fontSize:"10px"}}>No agents yet.</div>}
          {cAgents.map(a=>(
            <div key={a.id} onClick={()=>openAgentModal(a.id,"overview")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <div><div style={{color:C.accent,fontSize:"11px",fontWeight:"bold"}}>{a.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{a.role} {"\u00b7"} {a.env}</div></div>
              <div style={{display:"flex",gap:"5px",alignItems:"center"}}><Dot s={a.status}/><span style={{color:C.sub,fontSize:"9px"}}>{a.status}</span></div>
            </div>
          ))}
        </div>
        <div style={{...S.box,gridColumn:"1/-1"}}>
          <Hr title="Environments"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px"}}>
            {cl.environments.map(env=>{
              const prov=getProv(env);const mod=getMod(env);
              const eA=cAgents.filter(a=>a.env===env.id);
              return(
                <div key={env.id} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"5px",padding:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                    <div style={{color:C.accent,fontWeight:"bold",fontSize:"11px"}}>{env.id}</div>
                    <div style={{display:"flex",gap:"5px"}}>
                      <Dot s={env.status}/>
                      <Btn sm onClick={()=>openEnvModal(cl.id,env.id)}>{"\u2699\uFE0F"} Config</Btn>
                    </div>
                  </div>
                  {[["Model",`${prov?.icon||""} ${mod?.label||"\u2014"}`],["Agents",eA.map(a=>a.name).join(", ")||"None"],["Integrations",env.integrationIds.join(", ")||"None"]].map(([k,v])=>(
                    <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v}</span></div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function PhaseBar({phase}){
  return(
    <div style={{display:"flex",gap:"4px",marginBottom:"16px"}}>
      {PHASES.map((p,i)=>{
        const done=i<phase,active=i===phase;
        return(
          <div key={p.id} style={{flex:1,padding:"8px 6px",background:done?"#0d2a0d":active?"#0d1a2a":C.panel,border:`1px solid ${done?C.green:active?C.accent:C.border}`,borderRadius:"5px",textAlign:"center"}}>
            <div style={{fontSize:"13px"}}>{p.icon}</div>
            <div style={{color:done?C.green:active?C.accent:C.sub,fontSize:"9px",fontWeight:active?"bold":"normal"}}>{p.label}</div>
            <div style={{color:done?C.green:active?C.accent:C.muted,fontSize:"8px"}}>{done?"✓":active?"active":"pending"}</div>
          </div>
        );
      })}
    </div>
  );
}

function DiscoveryView({data}){
  if(!data||!Object.keys(data).length)return <div style={{color:C.sub,fontSize:"10px"}}>No discovery data yet.</div>;
  return(
    <div>
      <div style={S.box}>
        <Hr title="Business Context"/>
        {[["Company Size",data.companySize],["Operational Focus",data.operationalFocus],["Compliance",data.complianceConstraints],["Automation Goal",data.automationGoal],["Readiness",data.automationReadiness!=null?`${data.automationReadiness}% automation-ready`:"—"]].map(([k,v])=>(
          <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v||"—"}</span></div>
        ))}
      </div>
      {data.keyStakeholders?.length>0&&(
        <div style={S.box}>
          <Hr title="Key Stakeholders"/>
          {data.keyStakeholders.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:"8px",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{color:C.accent,fontWeight:"bold",fontSize:"11px",width:"120px",flexShrink:0}}>{s.name}</div>
              <div style={{color:C.sub,fontSize:"9px",width:"100px",flexShrink:0}}>{s.role}</div>
              <div style={{color:C.text,fontSize:"10px"}}>{s.authority}</div>
            </div>
          ))}
        </div>
      )}
      {data.painPoints?.length>0&&(
        <div style={S.box}>
          <Hr title="Pain Points"/>
          {data.painPoints.map((p,i)=><div key={i} style={{color:C.orange,fontSize:"10px",padding:"3px 0"}}>{"⚡"} {p}</div>)}
        </div>
      )}
    </div>
  );
}

function AuditView({workflows}){
  const [open,setOpen]=useState(null);
  if(!workflows?.length)return <div style={{color:C.sub,fontSize:"10px"}}>No workflows audited yet.</div>;
  return workflows.map((w,wi)=>(
    <div key={w.id} style={S.box}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(open===wi?null:wi)}>
        <div><div style={{color:C.accent,fontWeight:"bold",fontSize:"12px"}}>{w.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{w.owner} {"\u00b7"} {w.frequency}</div></div>
        <span style={{color:C.sub}}>{open===wi?"▲":"▼"}</span>
      </div>
      {open===wi&&(
        <div style={{marginTop:"10px"}}>
          <Hr title="Steps"/>
          {w.steps?.map(s=>(
            <div key={s.order} style={{display:"grid",gridTemplateColumns:"20px 1fr 80px 80px",gap:"8px",padding:"5px 0",borderBottom:`1px solid ${C.border}`,alignItems:"start"}}>
              <span style={{color:C.sub,fontSize:"9px"}}>{s.order}.</span>
              <div><div style={{color:C.text,fontSize:"10px"}}>{s.action}</div><div style={{color:C.sub,fontSize:"9px"}}>[{s.actor}]</div></div>
              <Tag color={C.teal}>{s.system}</Tag>
              <div style={{color:C.sub,fontSize:"9px"}}>{s.dataIn}{s.dataOut?` → ${s.dataOut}`:""}</div>
            </div>
          ))}
          {w.decisionPoints?.length>0&&(
            <div style={{marginTop:"8px"}}>
              <Hr title="Decision Points"/>
              {w.decisionPoints.map((dp,i)=>(
                <div key={i} style={{fontSize:"10px",padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{color:C.yellow}}>IF </span><span style={{color:C.text}}>{dp.condition}</span>
                  <span style={{color:C.yellow}}> → </span><span style={{color:"#86efac"}}>{dp.action}</span>
                  {dp.rule&&<span style={{color:C.sub}}> [{dp.rule}]</span>}
                </div>
              ))}
            </div>
          )}
          {w.successCriteria&&<div style={{marginTop:"8px",background:"#0d2a0d",border:`1px solid ${C.green}`,borderRadius:"4px",padding:"7px",color:C.green,fontSize:"10px"}}>✓ {w.successCriteria}</div>}
        </div>
      )}
    </div>
  ));
}

function SystemsView({data}){
  if(!data?.systems?.length)return <div style={{color:C.sub,fontSize:"10px"}}>No systems mapped yet.</div>;
  return data.systems.map(s=>(
    <div key={s.id} style={S.box}>
      <div style={{color:C.accent,fontWeight:"bold",fontSize:"12px",marginBottom:"6px"}}>{s.name}</div>
      {[["Role",s.role],["Connection",s.connectionType],["Host",s.host],["Auth",s.auth]].map(([k,v])=>(
        <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v||"—"}</span></div>
      ))}
      {s.schemas?.length>0&&(
        <div style={{marginTop:"8px"}}>
          <Hr title="Schemas"/>
          {s.schemas.map((sc,i)=>(
            <div key={i} style={{marginBottom:"4px"}}>
              <span style={{color:C.teal,fontSize:"10px",fontWeight:"bold"}}>{sc.table}</span>
              <span style={{color:C.sub,fontSize:"9px",marginLeft:"8px"}}>{sc.fields?.join(", ")}</span>
            </div>
          ))}
        </div>
      )}
      {s.quirks?.length>0&&(
        <div style={{marginTop:"6px"}}>
          <Hr title="Quirks"/>
          {s.quirks.map((q,i)=><div key={i} style={{color:C.yellow,fontSize:"9px",padding:"2px 0"}}>⚠ {q}</div>)}
        </div>
      )}
    </div>
  ));
}

function DesignView({agents,cl}){
  const [open,setOpen]=useState(null);
  if(!agents?.length)return <div style={{color:C.sub,fontSize:"10px"}}>No agent designs yet.</div>;
  return agents.map((ad,i)=>(
    <div key={ad.id||i} style={S.box}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(open===i?null:i)}>
        <div>
          <span style={{fontSize:"15px",marginRight:"6px"}}>🤖</span>
          <span style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>{ad.personaName}</span>
          <span style={{color:C.sub,fontSize:"10px",marginLeft:"8px"}}>{ad.agentName}</span>
        </div>
        <span style={{color:C.sub}}>{open===i?"▲":"▼"}</span>
      </div>
      {open===i&&(
        <div style={{marginTop:"10px"}}>
          {[["Role",ROLES.find(r=>r.id===ad.roleId)?.label||ad.roleId],["Activity",ACTS.find(a=>a.id===ad.activityId)?.label||ad.activityId],["Tone",ad.personaTone],["Expertise",ad.expertise],["Escalation",ad.escalationTarget],["Success",ad.successCriteria]].map(([k,v])=>v&&(
            <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v}</span></div>
          ))}
          {ad.boundaries?.length>0&&(
            <div style={{marginTop:"8px"}}>
              <Hr title="Hard Boundaries"/>
              {ad.boundaries.map((b,j)=><div key={j} style={{color:C.orange,fontSize:"10px",padding:"3px 0"}}>⛔ {b}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  ));
}

function PackageView({cl}){
  const [copied,setCopied]=useState(false);
  const ob=cl.onboarding;
  const ads=ob.phases.design.data?.agents||[];
  if(!ads.length)return <div style={{color:C.sub,fontSize:"10px"}}>Complete Agent Design phase first.</div>;
  const pkg=compilePkg(cl,ads[0]);
  const copy=()=>{navigator.clipboard?.writeText(pkg);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return(
    <div>
      <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
        <Btn v="primary" onClick={copy}>{copied?"✓ Copied!":"📋 Copy Package"}</Btn>
        <Btn v="success">🚀 Deploy Agent</Btn>
      </div>
      <pre style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",padding:"14px",color:"#86efac",fontSize:"10px",lineHeight:"1.7",overflow:"auto",maxHeight:"420px",whiteSpace:"pre-wrap",fontFamily:"monospace"}}>{pkg}</pre>
    </div>
  );
}

function Onboarding({cl,setClients}){
  const ob=cl.onboarding;
  const phase=ob.currentPhase;
  const advance=()=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,onboarding:{...x.onboarding,currentPhase:Math.min(4,x.onboarding.currentPhase+1)}}:x));
  return(
    <div>
      <PhaseBar phase={phase}/>
      {phase===0&&<DiscoveryView data={ob.phases.discovery.data}/>}
      {phase===1&&<AuditView workflows={ob.phases.audit.data?.workflows}/>}
      {phase===2&&<SystemsView data={ob.phases.systems.data}/>}
      {phase===3&&<DesignView agents={ob.phases.design.data?.agents} cl={cl}/>}
      {phase>=4&&<PackageView cl={cl}/>}
      {phase<4&&(
        <div style={{marginTop:"14px"}}>
          <Btn v="primary" onClick={advance}>Advance to Phase {phase+2}: {PHASES[phase+1]?.label} →</Btn>
        </div>
      )}
    </div>
  );
}

// ── Workflows ─────────────────────────────────────────────────────────────────
function Workflows({cl,cAgents}){
  return(
    <div>
      {cl.workflows.map(w=>(
        <div key={w.id} style={{...S.box,marginBottom:"10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
            <div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>{w.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{w.id} {"\u00b7"} {w.type}</div></div>
            <Dot s={w.status}/>
          </div>
          <div style={{color:C.sub,fontSize:"10px",marginBottom:"8px",lineHeight:"1.6"}}>{w.description}</div>
          {w.agents.length>0&&(
            <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
              {w.agents.map(aid=>{const a=cAgents.find(x=>x.id===aid);return a?<Tag key={aid} color={C.accent}>🤖 {a.name}</Tag>:null;})}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Agents ────────────────────────────────────────────────────────────────────
function Agents({cAgents,openAgentModal}){
  if(!cAgents.length)return <div style={{color:C.sub,fontSize:"10px"}}>No agents deployed for this client.</div>;
  return(
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:"8px",overflow:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["ID","Persona","Name","Status","Role","Success","Cost/mo","Env"].map(h=><th key={h} style={{padding:"9px 10px",color:C.sub,fontSize:"8px",textAlign:"left",letterSpacing:"1px",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>
          {cAgents.map(a=>(
            <tr key={a.id} style={{borderBottom:"1px solid #0a0f1a",cursor:"pointer"}} onClick={()=>openAgentModal(a.id,"overview")}>
              <td style={{padding:"9px 10px",color:C.sub,fontSize:"9px"}}>{a.id}</td>
              <td style={{padding:"9px 10px",color:C.purple,fontWeight:"bold",fontSize:"11px"}}>{a.intelligence?.persona?.name||"—"}</td>
              <td style={{padding:"9px 10px",color:C.accent,fontWeight:"bold",fontSize:"11px"}}>{a.name}</td>
              <td style={{padding:"9px 10px"}}><div style={{display:"flex",alignItems:"center",gap:"4px"}}><Dot s={a.status}/><span style={{fontSize:"9px",color:a.status==="running"?C.green:C.orange}}>{a.status}</span></div></td>
              <td style={{padding:"9px 10px"}}><Tag color={C.teal}>{a.role}</Tag></td>
              <td style={{padding:"9px 10px",color:a.success>=95?C.green:C.yellow,fontWeight:"bold",fontSize:"11px"}}>{a.success}%</td>
              <td style={{padding:"9px 10px",color:C.green,fontWeight:"bold",fontSize:"11px"}}>{fmtCost(a.usage.costUSD)}</td>
              <td style={{padding:"9px 10px"}}><Tag color={C.accent}>{a.env}</Tag></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Integrations ──────────────────────────────────────────────────────────────
function Integrations({cl,setClients}){
  const toggle=(id)=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,integrations:x.integrations.map(i=>i.id===id?{...i,connected:!i.connected}:i)}:x));
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"9px"}}>
      {INTS.map(def=>{
        const ci=cl.integrations.find(i=>i.id===def.id);
        const connected=ci?.connected||false;
        return(
          <div key={def.id} style={{background:C.panel,border:`1px solid ${connected?C.green:C.border}`,borderRadius:"7px",padding:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <span style={{fontSize:"16px"}}>{def.icon}</span>
                <div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"11px"}}>{def.name}</div><div style={{color:C.sub,fontSize:"9px"}}>{def.type}</div></div>
              </div>
              <Tag color={connected?C.green:C.sub} bg={connected?"#0d2a0d":"#0a0f1a"}>{connected?"connected":"disconnected"}</Tag>
            </div>
            {ci?.label&&<div style={{color:C.sub,fontSize:"9px",marginBottom:"8px",fontFamily:"monospace"}}>{ci.label}</div>}
            <Btn v={connected?"danger":"success"} sm onClick={()=>toggle(def.id)}>{connected?"Disconnect":"Connect"}</Btn>
          </div>
        );
      })}
    </div>
  );
}

// ── Environments ──────────────────────────────────────────────────────────────
function Environments({cl,cAgents,openEnvModal}){
  return(
    <div>
      {cl.environments.map(env=>{
        const prov=getProv(env);const mod=getMod(env);
        const eA=cAgents.filter(a=>a.env===env.id);
        return(
          <div key={env.id} style={{...S.box,marginBottom:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}>
              <div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"13px"}}>{env.id}</div><div style={{color:C.sub,fontSize:"9px"}}>Created {env.created}</div></div>
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}><Dot s={env.status}/><Btn sm onClick={()=>openEnvModal(cl.id,env.id)}>⚙️ Configure</Btn></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"10px"}}>
              {[["Provider",`${prov?.icon||""} ${prov?.name||"—"}`],["Model",mod?.label||"—"],["Tier",mod?.tier||"—"],["Temperature",env.model.temperature],["Max Tokens",env.model.maxTokens],["Cap",env.model.monthlyCapUSD>0?`$${env.model.monthlyCapUSD}/mo`:"Unlimited"]].map(([k,v])=>(
                <div key={k} style={S.row}><span style={S.k}>{k}</span><span style={S.v}>{v}</span></div>
              ))}
            </div>
            <div style={{marginBottom:"8px"}}>
              <Hr title="Integrations"/>
              <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>{env.integrationIds.map(id=><Tag key={id} color={C.teal}>{id}</Tag>)}</div>
            </div>
            <Hr title="Agents"/>
            {eA.length===0?<div style={{color:C.sub,fontSize:"9px"}}>No agents in this environment.</div>:
              <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>{eA.map(a=><Tag key={a.id} color={C.accent}>🤖 {a.name}</Tag>)}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── Notes ─────────────────────────────────────────────────────────────────────
function Notes({cl,setClients}){
  const save=(v)=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,notes:v}:x));
  return(
    <div>
      <Inp label="Client Notes" value={cl.notes||""} onChange={save} rows={12} placeholder="Internal notes, constraints, escalation contacts…"/>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ClientWorkspace({cid,clients,setClients,agents,openAgentModal,openEnvModal,onBack,clientTab,setClientTab}){
  const cl=clients.find(x=>x.id===cid);
  if(!cl)return null;
  const cAgents=agents.filter(a=>a.client===cl.name);
  const ob=cl.onboarding;

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.sub,padding:"5px 10px",borderRadius:"4px",cursor:"pointer",fontSize:"10px",fontFamily:"monospace"}}>← Back</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
            <h1 style={{fontSize:"16px",fontWeight:"bold",color:"#f1f5f9",margin:0}}>{cl.name}</h1>
            <Tag color={cl.status==="active"?C.green:C.accent} bg={cl.status==="active"?"#0d2a0d":"#0d1a2a"}>{cl.status}</Tag>
          </div>
          <div style={{color:C.sub,fontSize:"9px",marginTop:"2px"}}>{cl.industry} {"\u00b7"} {cl.tier} {"\u00b7"} Phase {ob.currentPhase+1}: {PHASES[ob.currentPhase]?.label}</div>
        </div>
        <div style={{display:"flex",gap:"3px"}}>
          {PHASES.map((_,i)=><div key={i} style={{width:"11px",height:"5px",borderRadius:"2px",background:i<ob.currentPhase?C.green:i===ob.currentPhase?C.accent:C.border}}/>)}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:"1px",borderBottom:`1px solid ${C.border}`,marginBottom:"16px"}}>
        {CTABS.map(t=>(
          <button key={t} onClick={()=>setClientTab(t)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${clientTab===t?C.accent:"transparent"}`,color:clientTab===t?C.accent:C.sub,padding:"7px 12px",cursor:"pointer",fontSize:"10px",fontFamily:"monospace",marginBottom:"-1px"}}>
            {TICONS[t]} {t}
          </button>
        ))}
      </div>

      {/* Panel */}
      {clientTab==="overview"&&<Overview cl={cl} cAgents={cAgents} openAgentModal={openAgentModal} openEnvModal={openEnvModal}/>}
      {clientTab==="onboarding"&&<Onboarding cl={cl} setClients={setClients}/>}
      {clientTab==="workflows"&&<Workflows cl={cl} cAgents={cAgents}/>}
      {clientTab==="agents"&&<Agents cAgents={cAgents} openAgentModal={openAgentModal}/>}
      {clientTab==="integrations"&&<Integrations cl={cl} setClients={setClients}/>}
      {clientTab==="environments"&&<Environments cl={cl} cAgents={cAgents} openEnvModal={openEnvModal}/>}
      {clientTab==="notes"&&<Notes cl={cl} setClients={setClients}/>}
    </div>
  );
}
