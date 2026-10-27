import {Component, OnDestroy, ChangeDetectorRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonApp} from '@ionic/angular/standalone';
import {Capacitor, CapacitorHttp} from '@capacitor/core';
import {App} from '@capacitor/app';
import {PROFILE} from './profile';
import {GenderizeClient} from './genderize-client';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule,IonApp],templateUrl:'./app.component.html'})
export class AppComponent implements OnDestroy {
 private cdr=inject(ChangeDetectorRef);
 profile=PROFILE; titles=['El comienzo','Identidad','Una vida al azar','Sin fronteras','El cielo de hoy','Criaturas extraordinarias','La revista','La autora'];
 subtitles=['Tu caja de posibilidades','El significado de un nombre','Historias que aún no conoces','El conocimiento conecta','Santo Domingo · República Dominicana','Archivo Pokémon','Ideas que merecen compartirse','Detrás de MUSEUM X'];
 page=0; catalog=false; busy=false; error=''; note=''; data:any=null; name=''; country='Dominican Republic'; pokemon='pikachu'; wp=PROFILE.wordpressUrl; wpLogo=''; wpTitle=''; endpoint=''; touchX=0; touchY=0; token=0; history:number[]=[]; audio?:HTMLAudioElement;
 private genderize=new GenderizeClient(url=>this.reply(url),this.localStorage());
 private localStorage():Storage|undefined {try{return window.localStorage;}catch{return undefined;}}
 private back=App.addListener('backButton',()=>this.goBack());
 constructor(){window.addEventListener('popstate',this.onPop);}
 onPop=()=>{if(this.catalog){this.catalog=false;this.cdr.markForCheck();return;} this.show(this.history.pop()??0);};
 ngOnDestroy(){window.removeEventListener('popstate',this.onPop);this.back.then(h=>h.remove());this.audio?.pause();}
 show(p:number){this.page=p;this.token++;this.busy=false;this.data=null;this.error='';this.note='';this.catalog=false;this.audio?.pause();document.querySelector('main')?.scrollTo({top:0});if(p===4)this.weather();if(p===6&&this.wp)this.wordpress();this.cdr.markForCheck();}
 navigate(p:number){if(p<0||p>7||p===this.page)return;this.history.push(this.page);window.history.pushState({page:p},'');this.show(p);}
 goBack(){if(this.catalog){this.catalog=false;this.cdr.markForCheck();return;}if(this.history.length){window.history.back();}else if(this.page!==0)this.show(0);else App.exitApp();}
 swipe(e:TouchEvent){let dx=e.changedTouches[0].clientX-this.touchX,dy=e.changedTouches[0].clientY-this.touchY;if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.5)this.navigate(this.page+(dx<0?1:-1));}
 httpError(status:number){return status===404?'No se encontraron resultados. Revisa lo que escribiste.':status===429?'El servicio alcanzó su límite de consultas. Inténtalo más tarde.':`El servicio no pudo responder (${status}). Inténtalo más tarde.`;}
 async reply(url:string){
 if(Capacitor.isNativePlatform()){const r=await CapacitorHttp.get({url,connectTimeout:15000,readTimeout:20000});let data=r.data;try{if(typeof data==='string')data=JSON.parse(data);}catch{}return {status:r.status,data,headers:r.headers};}
 const r=await fetch(url,{signal:AbortSignal.timeout(20000)});let data:any=null;try{data=await r.json();}catch{}const headers:Record<string,string>={};r.headers.forEach((v,k)=>headers[k]=v);return {status:r.status,data,headers};
 }
 async get(url:string):Promise<any>{const r=await this.reply(url);if(r.status<200||r.status>=300)throw Error(this.httpError(r.status));return r.data;}
 async run(action:()=>Promise<any>){if(this.busy)return;const id=this.token;this.busy=true;this.error='';this.note='';this.data=null;try{let result=await action();if(id===this.token)this.data=result;}catch(e:any){if(id===this.token)this.error=e.name==='TimeoutError'||e.name==='AbortError'?'La consulta tardó demasiado. Inténtalo otra vez.':e instanceof TypeError?'No se pudo conectar. Revisa tu conexión e inténtalo otra vez.':(e.message||'No se pudo conectar. Inténtalo otra vez.');}finally{if(id===this.token){this.busy=false;this.cdr.markForCheck();}}}
 gender(){const n=this.name.trim();if(!n){this.error='Escribe un nombre.';return;}const id=this.token;this.run(async()=>{const result=await this.genderize.lookup(n);if(id===this.token&&result.cached)this.note='Respuesta real guardada el '+new Intl.DateTimeFormat('es-DO',{dateStyle:'short'}).format(result.checkedAt)+'. No consume una nueva consulta.';return result.prediction;});}
 person(){this.run(async()=>{const d=await this.get('https://randomuser.me/api/?inc=name,picture,dob');if(!d.results?.[0]?.dob)throw Error('Respuesta de persona inválida.');return d.results[0];});}
 universities(){if(!/^[A-Za-z .'-]+$/.test(this.country.trim())){this.error='Escribe el país en inglés, por ejemplo Dominican Republic.';return;}this.run(async()=>{const d=await this.get('https://adamix.net/proxy.php?country='+encodeURIComponent(this.country.trim()));if(!Array.isArray(d))throw Error('Respuesta de universidades inválida.');return d;});}
 weather(){this.run(async()=>{const d=await this.get('https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=America%2FSanto_Domingo');if(typeof d.current?.temperature_2m!=='number')throw Error('Respuesta meteorológica inválida.');return d.current;});}
 weatherLabel(code:number){if(code===0)return 'Cielo despejado';if(code<=3)return 'Parcialmente nublado';if(code<=48)return 'Niebla';if(code<=67)return 'Lluvia';if(code<=77)return 'Nieve';if(code<=82)return 'Chubascos';return 'Tormentas o precipitación';}
 poke(){const n=this.pokemon.trim().toLowerCase();if(!/^[a-z0-9-]+$/.test(n)){this.error='Escribe un nombre Pokémon o número válido.';return;}this.audio?.pause();this.run(async()=>{const d=await this.get('https://pokeapi.co/api/v2/pokemon/'+encodeURIComponent(n));if(!d.name||!d.abilities)throw Error('Respuesta Pokémon inválida.');return d;});}
 async play(){const url=this.data?.cries?.latest;if(!url){this.note='Este Pokémon no tiene sonido disponible.';return;}try{this.audio?.pause();this.audio=new Audio(url);await this.audio.play();}catch{this.error='No fue posible reproducir el sonido. Inténtalo nuevamente.';this.cdr.markForCheck();}}
 text(html:string){return new DOMParser().parseFromString(html,'text/html').body.textContent?.trim()||'';}
 safe(url:string){try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
 wordpress(){let base:string;try{const u=new URL(this.wp);if(u.protocol!=='https:'||u.username||u.password)throw Error();base=u.origin+u.pathname.replace(/\/$/,'');}catch{this.error='Introduce la dirección HTTPS de un sitio WordPress.';return;}this.wpLogo='';this.wpTitle='';this.endpoint=base+'/wp-json/wp/v2/posts?per_page=3&orderby=date&order=desc';this.run(async()=>{const root=await this.get(base+'/wp-json/');this.wpTitle=root.name||'WordPress';this.wpLogo=this.safe(root.site_icon_url)||'';const posts=await this.get(this.endpoint);if(!Array.isArray(posts))throw Error('El sitio no expone una lista pública de posts.');if(!this.wpLogo)this.note='El sitio no publica un icono en su API. Selecciona un sitio con logo público para completar este requisito.';return posts;});}
}
