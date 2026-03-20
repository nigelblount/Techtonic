import { C, MODELS } from './constants.js';
import { getProv } from './helpers.js';
import { Hr, Btn, Inp, Tag } from './atoms.jsx';

export default function EnvModal({cid,eid,clients,updEnvModel,onClose}){
  const ecl=clients.find(x=>x.id===cid);
  const env=ecl?.environments.find(e=>e.id===eid);
  if(!ecl||!env)return null;
  const prov=getProv(env)||MODELS[0];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div style={{background:C.panel,border:`1px solid ${C.accent}`,borderRadius:"10px",width:"480px",maxHeight:"85vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{color:"#f1f5f9",fontWeight:"bold",fontSize:"14px"}}>{env.id} {"\u2014"} Model Config</div><div style={{color:C.sub,fontSize:"9px"}}>{ecl.name}</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.sub,cursor:"pointer",fontSize:"20px"}}>{"\u00d7"}</button>
        </div>
        <div style={{padding:"18px"}}>
          <Hr title="Provider"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"6px",marginBottom:"14px"}}>
            {MODELS.map(p=>(
              <div key={p.id} onClick={()=>updEnvModel(ecl.id,env.id,{providerId:p.id,modelId:p.models[0].id})} style={{padding:"10px",background:env.model.providerId===p.id?"#0d1a2a":C.bg,border:`1px solid ${env.model.providerId===p.id?C.accent:C.border}`,borderRadius:"5px",cursor:"pointer",display:"flex",gap:"8px",alignItems:"center"}}>
                <span style={{fontSize:"15px"}}>{p.icon}</span>
                <div style={{flex:1}}><div style={{color:env.model.providerId===p.id?C.accent:C.text,fontSize:"11px",fontWeight:"bold"}}>{p.name}</div><Tag color={p.hosting==="cloud"?C.accent:C.teal}>{p.hosting}</Tag></div>
                {env.model.providerId===p.id&&<span style={{color:C.accent}}>{"\u2713"}</span>}
              </div>
            ))}
          </div>
          <Hr title="Model"/>
          <div style={{display:"flex",flexDirection:"column",gap:"5px",marginBottom:"14px"}}>
            {prov.models.map(m=>(
              <div key={m.id} onClick={()=>updEnvModel(ecl.id,env.id,{modelId:m.id})} style={{padding:"9px 12px",background:env.model.modelId===m.id?"#0d1a2a":C.bg,border:`1px solid ${env.model.modelId===m.id?C.accent:C.border}`,borderRadius:"5px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{color:env.model.modelId===m.id?C.accent:C.text,fontWeight:"bold",fontSize:"11px"}}>{m.label}</span><span style={{marginLeft:"8px"}}><Tag color={m.tier==="powerful"?C.purple:m.tier==="fast"?C.green:C.accent}>{m.tier}</Tag></span></div>
                {env.model.modelId===m.id&&<span style={{color:C.accent}}>{"\u2713"}</span>}
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <Inp label="Temperature" value={String(env.model.temperature)} onChange={v=>updEnvModel(ecl.id,env.id,{temperature:parseFloat(v)})} type="number"/>
            <Inp label="Max Tokens" value={String(env.model.maxTokens)} onChange={v=>updEnvModel(ecl.id,env.id,{maxTokens:parseInt(v)})} type="number"/>
          </div>
          <Inp label="Monthly Cap (USD)" value={String(env.model.monthlyCapUSD)} onChange={v=>updEnvModel(ecl.id,env.id,{monthlyCapUSD:parseFloat(v)||0})} type="number"/>
          <Inp label="Base System Prompt" value={env.model.systemPromptBase} onChange={v=>updEnvModel(ecl.id,env.id,{systemPromptBase:v})} rows={3}/>
          <Btn v="primary" full onClick={onClose}>Save</Btn>
        </div>
      </div>
    </div>
  );
}
