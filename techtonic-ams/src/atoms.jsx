import { C } from './constants.js';

export const Tag=({children,color=C.sub,bg="#1a2030"})=>(<span style={{background:bg,color,padding:"2px 7px",borderRadius:"3px",fontSize:"9px",fontWeight:"bold",whiteSpace:"nowrap"}}>{children}</span>);

export const Dot=({s})=>{const col=["running","active","automated","complete"].includes(s)?C.green:s==="paused"?C.orange:["onboarding","pending","idle"].includes(s)?C.accent:C.yellow;return<span style={{display:"inline-block",width:"7px",height:"7px",borderRadius:"50%",background:col,flexShrink:0}}/>;};

export const Hr=({title})=>(<div style={{color:C.sub,fontSize:"8px",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px",marginTop:"4px",borderBottom:`1px solid ${C.border}`,paddingBottom:"5px"}}>{title}</div>);

export const Btn=({children,onClick,v="ghost",sm,disabled,full})=>{
  const s={primary:{background:C.accent,border:"none",color:"#fff"},danger:{background:"transparent",border:`1px solid ${C.red}`,color:C.red},ghost:{background:"transparent",border:`1px solid ${C.border}`,color:C.sub},warn:{background:"transparent",border:`1px solid ${C.orange}`,color:C.orange},success:{background:"transparent",border:`1px solid ${C.green}`,color:C.green},teal:{background:C.teal,border:"none",color:"#fff"},purple:{background:C.purple,border:"none",color:"#fff"}};
  return(<button onClick={onClick} disabled={disabled} style={{...s[v],padding:sm?"3px 8px":"6px 12px",borderRadius:"4px",cursor:disabled?"not-allowed":"pointer",fontSize:sm?"9px":"10px",fontFamily:"monospace",opacity:disabled?0.4:1,width:full?"100%":"auto"}}>{children}</button>);
};

export const Inp=({label,value,onChange,placeholder,rows,type="text"})=>(
  <div style={{marginBottom:"11px"}}>
    {label&&<label style={{color:C.sub,fontSize:"9px",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>{label.toUpperCase()}</label>}
    {rows
      ?<textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,color:C.text,padding:"7px 9px",borderRadius:"4px",fontSize:"11px",resize:"vertical",boxSizing:"border-box",fontFamily:"monospace"}}/>
      :<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,color:C.text,padding:"7px 9px",borderRadius:"4px",fontSize:"11px",boxSizing:"border-box",fontFamily:"monospace"}}/>
    }
  </div>
);
