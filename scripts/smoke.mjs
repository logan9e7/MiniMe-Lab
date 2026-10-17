#!/usr/bin/env node
// Run: node scripts/smoke.mjs
// Optional: FRONTEND_URL=... API_URL=... node scripts/smoke.mjs
const frontend=(process.env.FRONTEND_URL||"https://minime-lab-web.onrender.com").replace(/\/$/,"");
const api=(process.env.API_URL||"https://minime-lab-api.onrender.com").replace(/\/$/,"");
const checks=[
 {name:"Homepage",url:frontend+"/",expect:["MiniMe","How do families begin?","Virtual adoption journey"]},
 {name:"Privacy policy",url:frontend+"/privacy",expect:["Privacy and data"]},
 {name:"Editorial policy",url:frontend+"/editorial",expect:["science and learning principles"]},
 {name:"API health",url:api+"/health",json:"status",value:"ok"},
 {name:"Twins API",url:api+"/api/twins",json:"individual_probability",value:null},
 {name:"Genes API",url:api+"/api/science/genes",status:200},
 {name:"Quiz API",url:api+"/api/quiz/topics/genetics",status:200},
 {name:"Discovery API",url:api+"/api/discover/home?topic=genetics",status:200},
 {name:"Fertility API",url:api+"/api/fertility",method:"POST",body:{cycle_length:28,intercourse_day:14},json:"within_illustrative_window",value:true}
];
async function request(c){let error;for(let attempt=1;attempt<=3;attempt++){try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),45000);let res;try{res=await fetch(c.url,{method:c.method||"GET",headers:c.body?{"content-type":"application/json"}:{},body:c.body?JSON.stringify(c.body):undefined,signal:controller.signal,redirect:"follow"});}finally{clearTimeout(timer)}
if(!res.ok)throw new Error("HTTP "+res.status);const text=await res.text();if(c.expect){for(const value of c.expect)if(!text.toLowerCase().includes(value.toLowerCase()))throw new Error("Missing content: "+value)}if(c.json){const data=JSON.parse(text);if(data[c.json]!==c.value)throw new Error("Unexpected "+c.json+": "+JSON.stringify(data[c.json]))}return;}catch(e){error=e;if(attempt<3)await new Promise(r=>setTimeout(r,5000*attempt))}}throw error}
let failures=0;for(const c of checks){try{await request(c);console.log("PASS",c.name)}catch(e){failures++;console.error("FAIL",c.name,e.message)}}if(failures){console.error(failures+" smoke check(s) failed");process.exitCode=1}else console.log("All "+checks.length+" smoke checks passed");
