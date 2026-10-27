export interface GenderPrediction { name:string; gender:'male'|'female'|null; probability:number; count:number; }
export interface ApiReply { status:number; data:any; headers:Record<string,string>; }
interface SavedPrediction { key:string; checkedAt:number; expiresAt:number; prediction:GenderPrediction; }
interface SavedLimit { resetAt:number; knownReset:boolean; }
type StorageAccess=Pick<Storage,'getItem'|'setItem'>;
export class GenderizeLimitError extends Error {
 constructor(public resetAt:number,public knownReset:boolean){
  super(knownReset
   ?'Genderize agotó su cuota. Podrás consultar nombres nuevos a partir del '+new Intl.DateTimeFormat('es-DO',{timeZone:'America/Santo_Domingo',dateStyle:'medium',timeStyle:'short'}).format(resetAt)+' (hora dominicana). Los nombres guardados siguen disponibles.'
   :'Genderize limitó temporalmente las consultas. Espera un minuto antes de volver a intentar. Los nombres guardados siguen disponibles.');
 }
}
export class GenderizeClient {
 private static readonly cacheKey='museum-x.gender-cache.v1';
 private static readonly limitKey='museum-x.gender-limit.v1';
 private cache:SavedPrediction[]=[];
 private limit:SavedLimit|null=null;
 constructor(private request:(url:string)=>Promise<ApiReply>,private storage?:StorageAccess,private now:()=>number=Date.now){
  try{const saved=JSON.parse(storage?.getItem(GenderizeClient.cacheKey)||'[]');
   if(Array.isArray(saved))this.cache=saved.filter(x=>typeof x?.key==='string'&&Number.isFinite(x.checkedAt)&&x.checkedAt<=now()&&Number.isFinite(x.expiresAt)&&x.expiresAt>now()&&this.valid(x.prediction)).slice(-150);
   const limit=JSON.parse(storage?.getItem(GenderizeClient.limitKey)||'null');
   if(Number.isFinite(limit?.resetAt)&&limit.resetAt>now()&&typeof limit.knownReset==='boolean')this.limit=limit;
  }catch{/* Storage unavailable or corrupted: live requests still work. */}
 }
 private valid(d:any):d is GenderPrediction{return typeof d?.name==='string'&&['male','female',null].includes(d.gender)&&Number.isFinite(d.probability)&&d.probability>=0&&d.probability<=1&&Number.isFinite(d.count)&&d.count>=0;}
 private save(){try{this.storage?.setItem(GenderizeClient.cacheKey,JSON.stringify(this.cache));this.storage?.setItem(GenderizeClient.limitKey,JSON.stringify(this.limit));}catch{/* Storage failure does not discard the result. */}}
 private quota(reply:ApiReply){
  const h=Object.fromEntries(Object.entries(reply.headers).map(([k,v])=>[k.toLowerCase(),v]));
  const reset=h['x-rate-limit-reset'];const retry=h['retry-after'];
  const hasReset=reset!==undefined&&reset.trim()!==''&&Number.isFinite(Number(reset))&&Number(reset)>=0;
  let seconds=hasReset?Number(reset):60;
  if(!hasReset&&retry){const n=Number(retry);seconds=Number.isFinite(n)?Math.max(1,n):Math.max(1,(Date.parse(retry)-this.now())/1000)||60;}
  const throttled=reply.data?.error==='Request too low to process';
  if(throttled&&!retry){seconds=60;}
  if(reply.status===429||h['x-rate-limit-remaining']==='0'){
   this.limit={resetAt:this.now()+Math.max(1,seconds)*1000,knownReset:hasReset&&!throttled};this.save();
  }
 }
 async lookup(name:string){
  const clean=name.normalize('NFC').trim().replace(/\s+/g,' ');const key=clean.toLocaleLowerCase('es');
  if(!clean||clean.length>100)throw Error('Escribe un nombre de hasta 100 caracteres.');
  const stored=this.cache.find(x=>x.key===key&&x.expiresAt>this.now());
  if(stored)return {prediction:stored.prediction,cached:true,checkedAt:stored.checkedAt};
  if(this.limit&&this.limit.resetAt>this.now())throw new GenderizeLimitError(this.limit.resetAt,this.limit.knownReset);
  const reply=await this.request('https://api.genderize.io/?name='+encodeURIComponent(clean));this.quota(reply);
  if(reply.status===429)throw new GenderizeLimitError(this.limit!.resetAt,this.limit!.knownReset);
  if(reply.status<200||reply.status>=300)throw Error(reply.status===401||reply.status===402?'Genderize no tiene una autorización activa para esta consulta.':'Genderize no pudo responder. Inténtalo más tarde.');
  if(!this.valid(reply.data))throw Error('Respuesta de identidad inválida.');
  const checkedAt=this.now();this.cache=this.cache.filter(x=>x.key!==key&&x.expiresAt>checkedAt);
  this.cache.push({key,checkedAt,expiresAt:checkedAt+7*24*60*60*1000,prediction:reply.data});this.cache=this.cache.slice(-150);this.save();
  return {prediction:reply.data,cached:false,checkedAt};
 }
}
