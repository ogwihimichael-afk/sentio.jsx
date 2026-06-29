      <div style={{fontSize:20,fontWeight:800,letterSpacing:"-.3px",marginBottom:3}}>Settings</div>
      <div style={{fontSize:12,color:"rgba(226,226,238,.32)",marginBottom:22}}>Manage your account and preferences.</div>
      <div className="panel" style={{padding:20,marginBottom:12}}>
        <div className="lbl">Profile</div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:44,height:44,borderRadius:13,background:"rgba(201,169,110,.12)",border:"1px solid rgba(201,169,110,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,flexShrink:0,color:"#c9a96e"}}>{user.avatar||user.name[0]}</div>
          <div><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{user.name}</div><div style={{fontSize:11,color:"rgba(226,226,238,.35)"}}>{user.email}</div></div>
        </div>
        <div className="grid-2">
          <div><label className="lbl">Display Name</label><input className="input" defaultValue={user.name}/></div>
          <div><label className="lbl">Email</label><input className="input" defaultValue={user.email}/></div>
        </div>
        {user.emailVerified===false&&<div style={{fontSize:11,color:"rgba(201,169,110,.7)",marginTop:10,padding:"7px 11px",background:"rgba(201,169,110,.05)",borderRadius:8,border:"1px solid rgba(201,169,110,.1)"}}>Email not verified â€” check your inbox for the verification link.</div>}
      </div>
      <div className="panel" style={{padding:20,marginBottom:14}}>
        <div className="lbl">Preferences</div>
        {[["Claim notifications",notif,setNotif],["Always use Devnet",devnet,setDevnet]].map(([label,on,setOn])=>(
          <div key={label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{fontSize:13,fontWeight:500}}>{label}</div>
            <Toggle on={on} setOn={setOn}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button className="btn-primary" onClick={save}>{saved?<><Ic icon="check" size={12}/>Saved</>:"Save Changes"}</button>
        <button className="btn-secondary" onClick={onLogout} style={{color:"#f87171",borderColor:"rgba(248,113,113,.18)"}}>Sign Out</button>
      </div>
    </div>
  );
}

// â”€â”€â”€ NAV ITEMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAV_ITEMS=[
  {id:"dashboard",label:"Home",    icon:"home"},
  {id:"new-gift", label:"Send",    icon:"gift"},
  {id:"history",  label:"History", icon:"history"},
  {id:"analytics",label:"Stats",   icon:"chart"},
  {id:"settings", label:"Settings",icon:"settings"},
];

// â”€â”€â”€ ROOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App(){
  const [screen,setScreen]=useState("splash");
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [claimData,setClaimData]=useState(null);
  const [liveHistory,setLiveHistory]=useState([]);

  useEffect(()=>{
    storageGet("sentio_history").then(h=>{if(h&&Array.isArray(h))setLiveHistory(h);});
  },[]);

  const login=(u)=>{setUser(u);setScreen("app");};
  const logout=()=>{
    // Firebase sign out if available
    const fb=getFirebase();
    if(fb) fb.auth.signOut().catch(()=>{});
    setUser(null);setScreen("login");setPage("dashboard");setClaimData(null);
  };
  const openClaim=(data)=>{setClaimData(data);setPage("claim");};
  const onGiftSent=(record)=>{setLiveHistory(prev=>[record,...prev]);};

  if(screen==="splash") return(
    <div className="page"><style>{CSS}</style><Splash onDone={()=>setScreen("login")}/></div>
  );
  if(screen==="login"||!user) return(
    <div className="page"><style>{CSS}</style><div className="bg-static"/><LoginPage onLogin={login}/></div>
  );

  return(
    <div className="page">
      <style>{CSS}</style>
      <div className="bg-static"/>
      <div className="z1" style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <div className="nav">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#c9a96e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#08080f"}}>S</div>
            <span style={{fontSize:16,fontWeight:800,letterSpacing:"-.3px",color:"#e2e2ee"}}>Sentio</span>
            <span className="badge badge-dim nav-devnet" style={{marginLeft:2}}>Devnet</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="nav-devnet" style={{fontSize:9,color:"rgba(226,226,238,.2)",letterSpacing:".08em",textTransform:"uppercase"}}>Solana Devnet</span>
            <button onClick={logout} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,255,255,.07)",background:"transparent",cursor:"pointer",color:"rgba(226,226,238,.6)",fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:12,fontWeight:600,transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:22,height:22,borderRadius:7,background:"rgba(201,169,110,.15)",border:"1px solid rgba(201,169,110,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#c9a96e"}}>{user?.avatar||user?.name?.[0]||"U"}</div>
              {user?.name?.split(" ")[0]}
              <Ic icon="logout" size={12} color="rgba(226,226,238,.25)"/>
            </button>
          </div>
        </div>

        <div className="app-shell" style={{flex:1}}>
          <div className="sidebar">
            <div className="sidebar-section">Main</div>
            {NAV_ITEMS.slice(0,2).map(n=>(
              <div key={n.id} className={`sidebar-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <Ic icon={n.icon} size={15}/><span className="sidebar-label">{n.label}</span>
              </div>
            ))}
            <div className="sidebar-section">Manage</div>
            {NAV_ITEMS.slice(2,4).map(n=>(
              <div key={n.id} className={`sidebar-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <Ic icon={n.icon} size={15}/><span className="sidebar-label">{n.label}</span>
              </div>
            ))}
            <div style={{flex:1}}/>
            {NAV_ITEMS.slice(4).map(n=>(
              <div key={n.id} className={`sidebar-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <Ic icon={n.icon} size={15}/><span className="sidebar-label">{n.label}</span>
              </div>
            ))}
            <div style={{padding:"14px 10px 4px",borderTop:"1px solid rgba(255,255,255,.05)",marginTop:8}}>
              <div style={{fontSize:8.5,fontWeight:600,letterSpacing:".08em",color:"rgba(226,226,238,.2)",lineHeight:1.5}}>A BOHBOOverse<br/>Ecosystem Product</div>
            </div>
          </div>

          <div className="main">
            {page==="dashboard" &&<Dashboard user={user} onNewGift={()=>setPage("new-gift")} liveHistory={liveHistory}/>}
            {page==="new-gift"  &&<GiftWizard onPreviewClaim={openClaim} onGiftSent={onGiftSent}/>}
            {page==="history"   &&<History liveHistory={liveHistory}/>}
            {page==="analytics" &&<Analytics liveHistory={liveHistory}/>}
            {page==="settings"  &&<Settings user={user} onLogout={logout}/>}
            {page==="claim"     &&<ClaimPage data={claimData} onBack={()=>setPage("new-gift")}/>}
          </div>
        </div>

        <div className="bottom-nav">
          {NAV_ITEMS.map(n=>(
            <div key={n.id} className={`bottom-nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
              <Ic icon={n.icon} size={19}/>{n.label}
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,.04)",fontSize:9,color:"rgba(226,226,238,.15)",letterSpacing:".08em",textTransform:"uppercase"}}>
          Sentio Â· A BOHBOOverse Ecosystem Product Â· VBH3 Summer Solstice Â· Solana Devnet
        </div>
      </div>
    </div>
  );
}