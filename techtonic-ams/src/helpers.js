import { MODELS, ROLES } from './constants.js';

export const mkU=(calls,ti,to,cap)=>({calls,tokensIn:ti,tokensOut:to,costUSD:parseFloat(((ti*0.000003)+(to*0.000015)).toFixed(4)),monthlyCapUSD:cap,lastCall:"2m ago",history:[{month:"Jan",calls:Math.floor(calls*0.7),costUSD:parseFloat(((ti*0.7*0.000003)+(to*0.7*0.000015)).toFixed(2))},{month:"Feb",calls:Math.floor(calls*0.85),costUSD:parseFloat(((ti*0.85*0.000003)+(to*0.85*0.000015)).toFixed(2))},{month:"Mar",calls,costUSD:parseFloat(((ti*0.000003)+(to*0.000015)).toFixed(2))}]});

export const mkC=p=>({provider:p,keyId:`key_${Math.random().toString(36).slice(2,10)}`,masked:`sk-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022${Math.random().toString(36).slice(2,6)}`,createdAt:"2026-01-15",rotatedAt:"2026-02-28",status:"active"});

export const mkI=(persona,ctx,mems)=>({persona,auditContext:ctx,persistentMemory:mems,liveMemory:[{ts:"09:42:11",entry:"Processing current batch"},{ts:"09:41:58",entry:"Queried data source \u2014 anomalies detected"}]});

export const mkOb=(phase,disc,wics,sys,ads)=>({currentPhase:phase,phases:{discovery:{status:phase>0?"complete":phase===0?"active":"pending",data:disc},audit:{status:phase>1?"complete":phase===1?"active":"pending",data:{workflows:wics}},systems:{status:phase>2?"complete":phase===2?"active":"pending",data:sys},design:{status:phase>3?"complete":phase===3?"active":"pending",data:{agents:ads}},package:{status:phase>=4?"active":"pending",data:{}}}});

export const getProv=env=>MODELS.find(p=>p.id===env?.model?.providerId);
export const getMod=env=>{const pv=getProv(env);return pv?.models.find(m=>m.id===env?.model?.modelId);};
export const fmtCost=n=>`$${(n||0).toFixed(2)}`;

export const compilePkg=(cl,ad)=>{
  const ob=cl.onboarding;const d=ob.phases.discovery.data;
  const wics=ob.phases.audit.data.workflows||[];const sys=ob.phases.systems.data;
  const wic=wics.find(w=>w.id===ad.workflowRef)||wics[0];
  return `=== DAY ONE PACKAGE: ${ad.personaName||ad.agentName} ===\nClient: ${cl.name} | ${new Date().toISOString().slice(0,10)}\n\n--- WHO YOU ARE ---\nName: ${ad.personaName}. Role: ${ROLES.find(r=>r.id===ad.roleId)?.label||""} at ${cl.name}.\nTone: ${ad.personaTone||"Professional"} | Expertise: ${ad.expertise||"\u2014"}\n\n--- THE BUSINESS ---\n${cl.name} (${cl.industry}): ${d.operationalFocus||""}\nPain points: ${(d.painPoints||[]).join("; ")}\nCompliance: ${d.complianceConstraints||"None"}\n\n--- KEY PEOPLE ---\n${(d.keyStakeholders||[]).map(s=>`${s.name} (${s.role}): ${s.authority}`).join("\n")}\n\n--- YOUR WORKFLOW: ${wic?.name||"\u2014"} ---\nOwner: ${wic?.owner||"\u2014"} | Frequency: ${wic?.frequency||"\u2014"}\n\nSteps:\n${(wic?.steps||[]).map(s=>`${s.order}. [${s.actor}] ${s.action} \u2014 ${s.system}`).join("\n")}\n\nDecision rules:\n${(wic?.decisionPoints||[]).map(dp=>`IF ${dp.condition} THEN ${dp.action}`).join("\n")}\n\nSuccess: ${wic?.successCriteria||"\u2014"}\nEscalation: ${ad.escalationTarget||"\u2014"}\n\n--- SYSTEMS ---\n${(sys?.systems||[]).map(s=>`${s.name}: ${s.role}. Quirks: ${(s.quirks||[]).join("; ")}`).join("\n")}\n\n--- BOUNDARIES ---\n${(ad.boundaries||[]).map(b=>"NEVER: "+b).join("\n")}`;
};
