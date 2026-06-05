(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class Lr{callbacks;constructor(){this.callbacks={},this.callbacks.base={}}on(e,t){return typeof e>"u"||e===""?(console.warn("wrong names"),!1):typeof t>"u"?(console.warn("wrong callback"),!1):(this.resolveNames(e).forEach(s=>{const r=this.resolveName(s);this.callbacks[r.namespace]instanceof Object||(this.callbacks[r.namespace]={}),this.callbacks[r.namespace][r.value]instanceof Array||(this.callbacks[r.namespace][r.value]=[]),this.callbacks[r.namespace][r.value].push(t)}),this)}off(e){return typeof e>"u"||e===""?(console.warn("wrong name"),!1):(this.resolveNames(e).forEach(n=>{const s=this.resolveName(n);if(s.namespace!=="base"&&s.value==="")delete this.callbacks[s.namespace];else if(s.namespace==="base")for(const r in this.callbacks)this.callbacks[r]instanceof Object&&this.callbacks[r][s.value]instanceof Array&&(delete this.callbacks[r][s.value],Object.keys(this.callbacks[r]).length===0&&delete this.callbacks[r]);else this.callbacks[s.namespace]instanceof Object&&this.callbacks[s.namespace][s.value]instanceof Array&&(delete this.callbacks[s.namespace][s.value],Object.keys(this.callbacks[s.namespace]).length===0&&delete this.callbacks[s.namespace])}),this)}trigger(e,t){if(typeof e>"u"||e==="")return console.warn("wrong name"),!1;let n=null;const s=Array.isArray(t)?t:[];let r=this.resolveNames(e),o=this.resolveName(r[0]);if(o.namespace==="base")for(const a in this.callbacks)this.callbacks[a]instanceof Object&&this.callbacks[a][o.value]instanceof Array&&this.callbacks[a][o.value].forEach(l=>{l.apply(this,s)});else if(this.callbacks[o.namespace]instanceof Object){if(o.value==="")return console.warn("wrong name"),this;this.callbacks[o.namespace][o.value].forEach(a=>{a.apply(this,s)})}return n}resolveNames(e){let t=e;return t=t.replace(/[^a-zA-Z0-9 ,/.]/g,""),t=t.replace(/[,/]+/g," "),t.split(" ")}resolveName(e){const t=e.split(".");return{original:e,value:t[0],namespace:t.length>1&&t[1]!==""?t[1]:"base"}}}class Jf extends Lr{width;height;pixelRatio;maxPixelRatio=.75;constructor(){super(),this.width=window.innerWidth,this.height=window.innerHeight,this.pixelRatio=Math.min(window.devicePixelRatio,this.maxPixelRatio),window.addEventListener("resize",()=>{this.width=window.innerWidth,this.height=window.innerHeight,this.pixelRatio=Math.min(window.devicePixelRatio,this.maxPixelRatio),this.trigger("resize")})}}class Qf extends Lr{start;current;elapsed;delta;constructor(){super(),this.start=Date.now(),this.current=this.start,this.elapsed=0,this.delta=16,window.requestAnimationFrame(()=>{this.tick()})}tick(){const e=Date.now();this.delta=e-this.current,this.current=e,this.elapsed=(this.current-this.start)/1e3,this.trigger("tick"),window.requestAnimationFrame(()=>{this.tick()})}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const hc="180",ep=0,lu=1,tp=2,sd=1,np=2,ai=3,Xn=0,qt=1,sn=2,hi=0,Rs=1,cu=2,uu=3,hu=4,ip=5,Ki=100,sp=101,rp=102,op=103,ap=104,lp=200,cp=201,up=202,hp=203,ll=204,cl=205,dp=206,fp=207,pp=208,mp=209,gp=210,vp=211,_p=212,xp=213,bp=214,ul=0,hl=1,dl=2,Os=3,fl=4,pl=5,ml=6,gl=7,rd=0,yp=1,Sp=2,Li=0,wp=1,Mp=2,Ep=3,Tp=4,Cp=5,Ap=6,Pp=7,du="attached",Rp="detached",od=300,Ns=301,ks=302,vl=303,_l=304,na=306,Fs=1e3,yn=1001,Vo=1002,jt=1003,ad=1004,pr=1005,Pt=1006,Lo=1007,In=1008,ln=1009,ld=1010,cd=1011,br=1012,dc=1013,qn=1014,rn=1015,Hn=1016,fc=1017,pc=1018,Bs=1020,ud=35902,hd=35899,dd=1021,fd=1022,Xt=1023,yr=1026,zs=1027,Zi=1028,mc=1029,Yi=1030,gc=1031,vc=1033,Uo=33776,Oo=33777,No=33778,ko=33779,xl=35840,bl=35841,yl=35842,Sl=35843,wl=36196,Ml=37492,El=37496,Tl=37808,Cl=37809,Al=37810,Pl=37811,Rl=37812,Dl=37813,Il=37814,Ll=37815,Ul=37816,Ol=37817,Nl=37818,kl=37819,Fl=37820,Bl=37821,zl=36492,Vl=36494,Hl=36495,Gl=36283,Wl=36284,Xl=36285,ql=36286,Dp=2200,Ip=2201,Lp=2202,Sr=2300,wr=2301,ha=2302,Ts=2400,Cs=2401,Ho=2402,_c=2500,Up=2501,Op=0,pd=1,jl=2,md=3200,Np=3201,gd=0,kp=1,Di="",yt="srgb",It="srgb-linear",Go="linear",gt="srgb",ls=7680,fu=519,Fp=512,Bp=513,zp=514,vd=515,Vp=516,Hp=517,Gp=518,Wp=519,Kl=35044,on="300 es",Gn=2e3,Wo=2001;class ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pu=1234567;const gr=Math.PI/180,Vs=180/Math.PI;function Ln(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[i&255]+Yt[i>>8&255]+Yt[i>>16&255]+Yt[i>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function xc(i,e){return(i%e+e)%e}function Xp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function qp(i,e,t){return i!==e?(t-i)/(e-i):0}function vr(i,e,t){return(1-t)*i+t*e}function jp(i,e,t,n){return vr(i,e,1-Math.exp(-t*n))}function Kp(i,e=1){return e-Math.abs(xc(i,e*2)-e)}function Yp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function $p(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Zp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Jp(i,e){return i+Math.random()*(e-i)}function Qp(i){return i*(.5-Math.random())}function em(i){i!==void 0&&(pu=i);let e=pu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function tm(i){return i*gr}function nm(i){return i*Vs}function im(i){return(i&i-1)===0&&i!==0}function sm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function rm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function om(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),m=r((n-e)/2),_=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*f,a*c);break;case"YZY":i.set(l*f,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*f,a*u,a*c);break;case"XZX":i.set(a*u,l*_,l*m,a*c);break;case"YXY":i.set(l*m,a*u,l*_,a*c);break;case"ZYZ":i.set(l*_,l*m,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const At={DEG2RAD:gr,RAD2DEG:Vs,generateUUID:Ln,clamp:nt,euclideanModulo:xc,mapLinear:Xp,inverseLerp:qp,lerp:vr,damp:jp,pingpong:Kp,smoothstep:Yp,smootherstep:$p,randInt:Zp,randFloat:Jp,randFloatSpread:Qp,seededRandom:em,degToRad:tm,radToDeg:nm,isPowerOfTwo:im,ceilPowerOfTwo:sm,floorPowerOfTwo:rm,setQuaternionFromProperEuler:om,normalize:pt,denormalize:Rn};class Me{constructor(e=0,t=0){Me.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Un{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[o+0],m=r[o+1],_=r[o+2],b=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=m,e[t+2]=_,e[t+3]=b;return}if(h!==b||l!==f||c!==m||u!==_){let v=1-a;const p=l*f+c*m+u*_+h*b,D=p>=0?1:-1,P=1-p*p;if(P>Number.EPSILON){const U=Math.sqrt(P),L=Math.atan2(U,p*D);v=Math.sin(v*L)/U,a=Math.sin(a*L)/U}const M=a*D;if(l=l*v+f*M,c=c*v+m*M,u=u*v+_*M,h=h*v+b*M,v===1-a){const U=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=U,c*=U,u*=U,h*=U}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],f=r[o+1],m=r[o+2],_=r[o+3];return e[t]=a*_+u*h+l*m-c*f,e[t+1]=l*_+u*f+c*h-a*m,e[t+2]=c*_+u*m+a*f-l*h,e[t+3]=u*_-a*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),f=l(n/2),m=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=f*u*h+c*m*_,this._y=c*m*h-f*u*_,this._z=c*u*_+f*m*h,this._w=c*u*h-f*m*_;break;case"YXZ":this._x=f*u*h+c*m*_,this._y=c*m*h-f*u*_,this._z=c*u*_-f*m*h,this._w=c*u*h+f*m*_;break;case"ZXY":this._x=f*u*h-c*m*_,this._y=c*m*h+f*u*_,this._z=c*u*_+f*m*h,this._w=c*u*h-f*m*_;break;case"ZYX":this._x=f*u*h-c*m*_,this._y=c*m*h+f*u*_,this._z=c*u*_-f*m*h,this._w=c*u*h+f*m*_;break;case"YZX":this._x=f*u*h+c*m*_,this._y=c*m*h+f*u*_,this._z=c*u*_-f*m*h,this._w=c*u*h-f*m*_;break;case"XZY":this._x=f*u*h-c*m*_,this._y=c*m*h-f*u*_,this._z=c*u*_+f*m*h,this._w=c*u*h+f*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+a+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>h){const m=2*Math.sqrt(1+n-a-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>h){const m=2*Math.sqrt(1+a-n-h);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,n=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return da.copy(this).projectOnVector(e),this.sub(da)}reflect(e){return this.sub(da.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const da=new F,mu=new Un;class Ye{constructor(e,t,n,s,r,o,a,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],_=n[8],b=s[0],v=s[3],p=s[6],D=s[1],P=s[4],M=s[7],U=s[2],L=s[5],k=s[8];return r[0]=o*b+a*D+l*U,r[3]=o*v+a*P+l*L,r[6]=o*p+a*M+l*k,r[1]=c*b+u*D+h*U,r[4]=c*v+u*P+h*L,r[7]=c*p+u*M+h*k,r[2]=f*b+m*D+_*U,r[5]=f*v+m*P+_*L,r[8]=f*p+m*M+_*k,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*r,m=c*r-o*l,_=t*h+n*f+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/_;return e[0]=h*b,e[1]=(s*c-u*n)*b,e[2]=(a*n-s*o)*b,e[3]=f*b,e[4]=(u*t-s*l)*b,e[5]=(s*r-a*t)*b,e[6]=m*b,e[7]=(n*l-c*t)*b,e[8]=(o*t-n*r)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(fa.makeScale(e,t)),this}rotate(e){return this.premultiply(fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const fa=new Ye;function _d(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function am(){const i=Mr("canvas");return i.style.display="block",i}const gu={};function Er(i){i in gu||(gu[i]=!0,console.warn(i))}function lm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const vu=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_u=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cm(){const i={enabled:!0,workingColorSpace:It,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===gt&&(s.r=di(s.r),s.g=di(s.g),s.b=di(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===gt&&(s.r=Ds(s.r),s.g=Ds(s.g),s.b=Ds(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Di?Go:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Er("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Er("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[It]:{primaries:e,whitePoint:n,transfer:Go,toXYZ:vu,fromXYZ:_u,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:yt},outputColorSpaceConfig:{drawingBufferColorSpace:yt}},[yt]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:vu,fromXYZ:_u,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:yt}}}),i}const ot=cm();function di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ds(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let cs;class um{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{cs===void 0&&(cs=Mr("canvas")),cs.width=e.width,cs.height=e.height;const s=cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=cs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Mr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=di(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(di(t[n]/255)*255):t[n]=di(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let hm=0;class bc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Ln(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(pa(s[o].image)):r.push(pa(s[o]))}else r=pa(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function pa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?um.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let dm=0;const ma=new F;class Ut extends ss{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=yn,s=yn,r=Pt,o=In,a=Xt,l=ln,c=Ut.DEFAULT_ANISOTROPY,u=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=Ln(),this.name="",this.source=new bc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ma).x}get height(){return this.source.getSize(ma).y}get depth(){return this.source.getSize(ma).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==od)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fs:e.x=e.x-Math.floor(e.x);break;case yn:e.x=e.x<0?0:1;break;case Vo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fs:e.y=e.y-Math.floor(e.y);break;case yn:e.y=e.y<0?0:1;break;case Vo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=od;Ut.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,n=0,s=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],_=l[9],b=l[2],v=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-b)<.01&&Math.abs(_-v)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+b)<.1&&Math.abs(_+v)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const P=(c+1)/2,M=(m+1)/2,U=(p+1)/2,L=(u+f)/4,k=(h+b)/4,H=(_+v)/4;return P>M&&P>U?P<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(P),s=L/n,r=k/n):M>U?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=L/s,r=H/s):U<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(U),n=k/r,s=H/r),this.set(n,s,r,t),this}let D=Math.sqrt((v-_)*(v-_)+(h-b)*(h-b)+(f-u)*(f-u));return Math.abs(D)<.001&&(D=1),this.x=(v-_)/D,this.y=(h-b)/D,this.z=(f-u)/D,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class fm extends ss{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Ut(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Pt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new bc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nn extends fm{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xd extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class pm extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vi{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,En):En.fromBufferAttribute(r,o),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),to.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),to.copy(n.boundingBox)),to.applyMatrix4(e.matrixWorld),this.union(to)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tr),no.subVectors(this.max,tr),us.subVectors(e.a,tr),hs.subVectors(e.b,tr),ds.subVectors(e.c,tr),bi.subVectors(hs,us),yi.subVectors(ds,hs),Fi.subVectors(us,ds);let t=[0,-bi.z,bi.y,0,-yi.z,yi.y,0,-Fi.z,Fi.y,bi.z,0,-bi.x,yi.z,0,-yi.x,Fi.z,0,-Fi.x,-bi.y,bi.x,0,-yi.y,yi.x,0,-Fi.y,Fi.x,0];return!ga(t,us,hs,ds,no)||(t=[1,0,0,0,1,0,0,0,1],!ga(t,us,hs,ds,no))?!1:(io.crossVectors(bi,yi),t=[io.x,io.y,io.z],ga(t,us,hs,ds,no))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ei),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ei=[new F,new F,new F,new F,new F,new F,new F,new F],En=new F,to=new vi,us=new F,hs=new F,ds=new F,bi=new F,yi=new F,Fi=new F,tr=new F,no=new F,io=new F,Bi=new F;function ga(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Bi.fromArray(i,r);const a=s.x*Math.abs(Bi.x)+s.y*Math.abs(Bi.y)+s.z*Math.abs(Bi.z),l=e.dot(Bi),c=t.dot(Bi),u=n.dot(Bi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const mm=new vi,nr=new F,va=new F;class $n{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):mm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;nr.subVectors(e,this.center);const t=nr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(nr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(va.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(nr.copy(e.center).add(va)),this.expandByPoint(nr.copy(e.center).sub(va))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ti=new F,_a=new F,so=new F,Si=new F,xa=new F,ro=new F,ba=new F;class ia{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ti)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ti.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ti.copy(this.origin).addScaledVector(this.direction,t),ti.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){_a.copy(e).add(t).multiplyScalar(.5),so.copy(t).sub(e).normalize(),Si.copy(this.origin).sub(_a);const r=e.distanceTo(t)*.5,o=-this.direction.dot(so),a=Si.dot(this.direction),l=-Si.dot(so),c=Si.lengthSq(),u=Math.abs(1-o*o);let h,f,m,_;if(u>0)if(h=o*l-a,f=o*a-l,_=r*u,h>=0)if(f>=-_)if(f<=_){const b=1/u;h*=b,f*=b,m=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f<=-_?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c):f<=_?(h=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(_a).addScaledVector(so,f),m}intersectSphere(e,t){ti.subVectors(e.center,this.origin);const n=ti.dot(this.direction),s=ti.dot(ti)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ti)!==null}intersectTriangle(e,t,n,s,r){xa.subVectors(t,e),ro.subVectors(n,e),ba.crossVectors(xa,ro);let o=this.direction.dot(ba),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Si.subVectors(this.origin,e);const l=a*this.direction.dot(ro.crossVectors(Si,ro));if(l<0)return null;const c=a*this.direction.dot(xa.cross(Si));if(c<0||l+c>o)return null;const u=-a*Si.dot(ba);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Je{constructor(e,t,n,s,r,o,a,l,c,u,h,f,m,_,b,v){Je.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,f,m,_,b,v)}set(e,t,n,s,r,o,a,l,c,u,h,f,m,_,b,v){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=f,p[3]=m,p[7]=_,p[11]=b,p[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Je().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/fs.setFromMatrixColumn(e,0).length(),r=1/fs.setFromMatrixColumn(e,1).length(),o=1/fs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=o*u,m=o*h,_=a*u,b=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+_*c,t[5]=f-b*c,t[9]=-a*l,t[2]=b-f*c,t[6]=_+m*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,_=c*u,b=c*h;t[0]=f+b*a,t[4]=_*a-m,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=m*a-_,t[6]=b+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,_=c*u,b=c*h;t[0]=f-b*a,t[4]=-o*h,t[8]=_+m*a,t[1]=m+_*a,t[5]=o*u,t[9]=b-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,m=o*h,_=a*u,b=a*h;t[0]=l*u,t[4]=_*c-m,t[8]=f*c+b,t[1]=l*h,t[5]=b*c+f,t[9]=m*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,m=o*c,_=a*l,b=a*c;t[0]=l*u,t[4]=b-f*h,t[8]=_*h+m,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=m*h+_,t[10]=f-b*h}else if(e.order==="XZY"){const f=o*l,m=o*c,_=a*l,b=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+b,t[5]=o*u,t[9]=m*h-_,t[2]=_*h-m,t[6]=a*u,t[10]=b*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gm,e,vm)}lookAt(e,t,n){const s=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),wi.crossVectors(n,hn),wi.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),wi.crossVectors(n,hn)),wi.normalize(),oo.crossVectors(hn,wi),s[0]=wi.x,s[4]=oo.x,s[8]=hn.x,s[1]=wi.y,s[5]=oo.y,s[9]=hn.y,s[2]=wi.z,s[6]=oo.z,s[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],_=n[2],b=n[6],v=n[10],p=n[14],D=n[3],P=n[7],M=n[11],U=n[15],L=s[0],k=s[4],H=s[8],E=s[12],w=s[1],N=s[5],q=s[9],$=s[13],te=s[2],ne=s[6],J=s[10],ce=s[14],Y=s[3],pe=s[7],be=s[11],Re=s[15];return r[0]=o*L+a*w+l*te+c*Y,r[4]=o*k+a*N+l*ne+c*pe,r[8]=o*H+a*q+l*J+c*be,r[12]=o*E+a*$+l*ce+c*Re,r[1]=u*L+h*w+f*te+m*Y,r[5]=u*k+h*N+f*ne+m*pe,r[9]=u*H+h*q+f*J+m*be,r[13]=u*E+h*$+f*ce+m*Re,r[2]=_*L+b*w+v*te+p*Y,r[6]=_*k+b*N+v*ne+p*pe,r[10]=_*H+b*q+v*J+p*be,r[14]=_*E+b*$+v*ce+p*Re,r[3]=D*L+P*w+M*te+U*Y,r[7]=D*k+P*N+M*ne+U*pe,r[11]=D*H+P*q+M*J+U*be,r[15]=D*E+P*$+M*ce+U*Re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],_=e[3],b=e[7],v=e[11],p=e[15];return _*(+r*l*h-s*c*h-r*a*f+n*c*f+s*a*m-n*l*m)+b*(+t*l*m-t*c*f+r*o*f-s*o*m+s*c*u-r*l*u)+v*(+t*c*h-t*a*m-r*o*h+n*o*m+r*a*u-n*c*u)+p*(-s*a*u-t*l*h+t*a*f+s*o*h-n*o*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],_=e[12],b=e[13],v=e[14],p=e[15],D=h*v*c-b*f*c+b*l*m-a*v*m-h*l*p+a*f*p,P=_*f*c-u*v*c-_*l*m+o*v*m+u*l*p-o*f*p,M=u*b*c-_*h*c+_*a*m-o*b*m-u*a*p+o*h*p,U=_*h*l-u*b*l-_*a*f+o*b*f+u*a*v-o*h*v,L=t*D+n*P+s*M+r*U;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/L;return e[0]=D*k,e[1]=(b*f*r-h*v*r-b*s*m+n*v*m+h*s*p-n*f*p)*k,e[2]=(a*v*r-b*l*r+b*s*c-n*v*c-a*s*p+n*l*p)*k,e[3]=(h*l*r-a*f*r-h*s*c+n*f*c+a*s*m-n*l*m)*k,e[4]=P*k,e[5]=(u*v*r-_*f*r+_*s*m-t*v*m-u*s*p+t*f*p)*k,e[6]=(_*l*r-o*v*r-_*s*c+t*v*c+o*s*p-t*l*p)*k,e[7]=(o*f*r-u*l*r+u*s*c-t*f*c-o*s*m+t*l*m)*k,e[8]=M*k,e[9]=(_*h*r-u*b*r-_*n*m+t*b*m+u*n*p-t*h*p)*k,e[10]=(o*b*r-_*a*r+_*n*c-t*b*c-o*n*p+t*a*p)*k,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*m-t*a*m)*k,e[12]=U*k,e[13]=(u*b*s-_*h*s+_*n*f-t*b*f-u*n*v+t*h*v)*k,e[14]=(_*a*s-o*b*s-_*n*l+t*b*l+o*n*v-t*a*v)*k,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*f+t*a*f)*k,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,f=r*c,m=r*u,_=r*h,b=o*u,v=o*h,p=a*h,D=l*c,P=l*u,M=l*h,U=n.x,L=n.y,k=n.z;return s[0]=(1-(b+p))*U,s[1]=(m+M)*U,s[2]=(_-P)*U,s[3]=0,s[4]=(m-M)*L,s[5]=(1-(f+p))*L,s[6]=(v+D)*L,s[7]=0,s[8]=(_+P)*k,s[9]=(v-D)*k,s[10]=(1-(f+b))*k,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=fs.set(s[0],s[1],s[2]).length();const o=fs.set(s[4],s[5],s[6]).length(),a=fs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Tn.copy(this);const c=1/r,u=1/o,h=1/a;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=u,Tn.elements[5]*=u,Tn.elements[6]*=u,Tn.elements[8]*=h,Tn.elements[9]*=h,Tn.elements[10]*=h,t.setFromRotationMatrix(Tn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Gn,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),m=(n+s)/(n-s);let _,b;if(l)_=r/(o-r),b=o*r/(o-r);else if(a===Gn)_=-(o+r)/(o-r),b=-2*o*r/(o-r);else if(a===Wo)_=-o/(o-r),b=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Gn,l=!1){const c=this.elements,u=2/(t-e),h=2/(n-s),f=-(t+e)/(t-e),m=-(n+s)/(n-s);let _,b;if(l)_=1/(o-r),b=o/(o-r);else if(a===Gn)_=-2/(o-r),b=-(o+r)/(o-r);else if(a===Wo)_=-1/(o-r),b=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const fs=new F,Tn=new Je,gm=new F(0,0,0),vm=new F(1,1,1),wi=new F,oo=new F,hn=new F,xu=new Je,bu=new Un;class jn{constructor(e=0,t=0,n=0,s=jn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bu.setFromEuler(this),this.setFromQuaternion(bu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}jn.DEFAULT_ORDER="XYZ";class bd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _m=0;const yu=new F,ps=new Un,ni=new Je,ao=new F,ir=new F,xm=new F,bm=new Un,Su=new F(1,0,0),wu=new F(0,1,0),Mu=new F(0,0,1),Eu={type:"added"},ym={type:"removed"},ms={type:"childadded",child:null},ya={type:"childremoved",child:null};class Rt extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new F,t=new jn,n=new Un,s=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Je},normalMatrix:{value:new Ye}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ps.setFromAxisAngle(e,t),this.quaternion.multiply(ps),this}rotateOnWorldAxis(e,t){return ps.setFromAxisAngle(e,t),this.quaternion.premultiply(ps),this}rotateX(e){return this.rotateOnAxis(Su,e)}rotateY(e){return this.rotateOnAxis(wu,e)}rotateZ(e){return this.rotateOnAxis(Mu,e)}translateOnAxis(e,t){return yu.copy(e).applyQuaternion(this.quaternion),this.position.add(yu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Su,e)}translateY(e){return this.translateOnAxis(wu,e)}translateZ(e){return this.translateOnAxis(Mu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ni.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ao.copy(e):ao.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ir.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ni.lookAt(ir,ao,this.up):ni.lookAt(ao,ir,this.up),this.quaternion.setFromRotationMatrix(ni),s&&(ni.extractRotation(s.matrixWorld),ps.setFromRotationMatrix(ni),this.quaternion.premultiply(ps.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Eu),ms.child=e,this.dispatchEvent(ms),ms.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ym),ya.child=e,this.dispatchEvent(ya),ya.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Eu),ms.child=e,this.dispatchEvent(ms),ms.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,e,xm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ir,bm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),m=o(e.animations),_=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new F(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Cn=new F,ii=new F,Sa=new F,si=new F,gs=new F,vs=new F,Tu=new F,wa=new F,Ma=new F,Ea=new F,Ta=new at,Ca=new at,Aa=new at;class Dn{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Cn.subVectors(e,t),s.cross(Cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Cn.subVectors(s,t),ii.subVectors(n,t),Sa.subVectors(e,t);const o=Cn.dot(Cn),a=Cn.dot(ii),l=Cn.dot(Sa),c=ii.dot(ii),u=ii.dot(Sa),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,m=(c*l-a*u)*f,_=(o*u-a*l)*f;return r.set(1-m-_,_,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,si)===null?!1:si.x>=0&&si.y>=0&&si.x+si.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,si.x),l.addScaledVector(o,si.y),l.addScaledVector(a,si.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ta.setScalar(0),Ca.setScalar(0),Aa.setScalar(0),Ta.fromBufferAttribute(e,t),Ca.fromBufferAttribute(e,n),Aa.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ta,r.x),o.addScaledVector(Ca,r.y),o.addScaledVector(Aa,r.z),o}static isFrontFacing(e,t,n,s){return Cn.subVectors(n,t),ii.subVectors(e,t),Cn.cross(ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Cn.subVectors(this.c,this.b),ii.subVectors(this.a,this.b),Cn.cross(ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Dn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Dn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Dn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Dn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Dn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;gs.subVectors(s,n),vs.subVectors(r,n),wa.subVectors(e,n);const l=gs.dot(wa),c=vs.dot(wa);if(l<=0&&c<=0)return t.copy(n);Ma.subVectors(e,s);const u=gs.dot(Ma),h=vs.dot(Ma);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(gs,o);Ea.subVectors(e,r);const m=gs.dot(Ea),_=vs.dot(Ea);if(_>=0&&m<=_)return t.copy(r);const b=m*c-l*_;if(b<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(vs,a);const v=u*_-m*h;if(v<=0&&h-u>=0&&m-_>=0)return Tu.subVectors(r,s),a=(h-u)/(h-u+(m-_)),t.copy(s).addScaledVector(Tu,a);const p=1/(v+b+f);return o=b*p,a=f*p,t.copy(n).addScaledVector(gs,o).addScaledVector(vs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mi={h:0,s:0,l:0},lo={h:0,s:0,l:0};function Pa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ce{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ot.workingColorSpace){if(e=xc(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Pa(o,r,e+1/3),this.g=Pa(o,r,e),this.b=Pa(o,r,e-1/3)}return ot.colorSpaceToWorking(this,s),this}setStyle(e,t=yt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yt){const n=yd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yt){return ot.workingToColorSpace($t.copy(this),e),Math.round(nt($t.r*255,0,255))*65536+Math.round(nt($t.g*255,0,255))*256+Math.round(nt($t.b*255,0,255))}getHexString(e=yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace($t.copy(this),t);const n=$t.r,s=$t.g,r=$t.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace($t.copy(this),t),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=yt){ot.workingToColorSpace($t.copy(this),e);const t=$t.r,n=$t.g,s=$t.b;return e!==yt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Mi),this.setHSL(Mi.h+e,Mi.s+t,Mi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Mi),e.getHSL(lo);const n=vr(Mi.h,lo.h,t),s=vr(Mi.s,lo.s,t),r=vr(Mi.l,lo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $t=new Ce;Ce.NAMES=yd;let Sm=0;class On extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=Rs,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ls,this.stencilZFail=ls,this.stencilZPass=ls,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ll&&(n.blendSrc=this.blendSrc),this.blendDst!==cl&&(n.blendDst=this.blendDst),this.blendEquation!==Ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ls&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ls&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ls&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ji extends On{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jn,this.combine=rd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const li=wm();function wm(){const i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;(c&8388608)===0;)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Mm(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=nt(i,-65504,65504),li.floatView[0]=i;const e=li.uint32View[0],t=e>>23&511;return li.baseTable[t]+((e&8388607)>>li.shiftTable[t])}function Em(i){const e=i>>10;return li.uint32View[0]=li.mantissaTable[li.offsetTable[e]+(i&1023)]+li.exponentTable[e],li.floatView[0]}class Cu{static toHalfFloat(e){return Mm(e)}static fromHalfFloat(e){return Em(e)}}const Ft=new F,co=new Me;let Tm=0;class Kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Kl,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)co.fromBufferAttribute(this,t),co.applyMatrix3(e),this.setXY(t,co.x,co.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array),r=pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Kl&&(e.usage=this.usage),e}}class Sd extends Kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class wd extends Kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class fi extends Kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Cm=0;const vn=new Je,Ra=new Rt,_s=new F,dn=new vi,sr=new vi,Wt=new F;class kn extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_d(e)?wd:Sd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return vn.makeRotationFromQuaternion(e),this.applyMatrix4(vn),this}rotateX(e){return vn.makeRotationX(e),this.applyMatrix4(vn),this}rotateY(e){return vn.makeRotationY(e),this.applyMatrix4(vn),this}rotateZ(e){return vn.makeRotationZ(e),this.applyMatrix4(vn),this}translate(e,t,n){return vn.makeTranslation(e,t,n),this.applyMatrix4(vn),this}scale(e,t,n){return vn.makeScale(e,t,n),this.applyMatrix4(vn),this}lookAt(e){return Ra.lookAt(e),Ra.updateMatrix(),this.applyMatrix4(Ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fi(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $n);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];sr.setFromBufferAttribute(a),this.morphTargetsRelative?(Wt.addVectors(dn.min,sr.min),dn.expandByPoint(Wt),Wt.addVectors(dn.max,sr.max),dn.expandByPoint(Wt)):(dn.expandByPoint(sr.min),dn.expandByPoint(sr.max))}dn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Wt.fromBufferAttribute(a,c),l&&(_s.fromBufferAttribute(e,c),Wt.add(_s)),s=Math.max(s,n.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let H=0;H<n.count;H++)a[H]=new F,l[H]=new F;const c=new F,u=new F,h=new F,f=new Me,m=new Me,_=new Me,b=new F,v=new F;function p(H,E,w){c.fromBufferAttribute(n,H),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,w),f.fromBufferAttribute(r,H),m.fromBufferAttribute(r,E),_.fromBufferAttribute(r,w),u.sub(c),h.sub(c),m.sub(f),_.sub(f);const N=1/(m.x*_.y-_.x*m.y);isFinite(N)&&(b.copy(u).multiplyScalar(_.y).addScaledVector(h,-m.y).multiplyScalar(N),v.copy(h).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(N),a[H].add(b),a[E].add(b),a[w].add(b),l[H].add(v),l[E].add(v),l[w].add(v))}let D=this.groups;D.length===0&&(D=[{start:0,count:e.count}]);for(let H=0,E=D.length;H<E;++H){const w=D[H],N=w.start,q=w.count;for(let $=N,te=N+q;$<te;$+=3)p(e.getX($+0),e.getX($+1),e.getX($+2))}const P=new F,M=new F,U=new F,L=new F;function k(H){U.fromBufferAttribute(s,H),L.copy(U);const E=a[H];P.copy(E),P.sub(U.multiplyScalar(U.dot(E))).normalize(),M.crossVectors(L,E);const N=M.dot(l[H])<0?-1:1;o.setXYZW(H,P.x,P.y,P.z,N)}for(let H=0,E=D.length;H<E;++H){const w=D[H],N=w.start,q=w.count;for(let $=N,te=N+q;$<te;$+=3)k(e.getX($+0)),k(e.getX($+1)),k(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new F,r=new F,o=new F,a=new F,l=new F,c=new F,u=new F,h=new F;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),b=e.getX(f+1),v=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,b),o.fromBufferAttribute(t,v),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,v),a.add(u),l.add(u),c.add(u),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let m=0,_=0;for(let b=0,v=l.length;b<v;b++){a.isInterleavedBufferAttribute?m=l[b]*a.data.stride+a.offset:m=l[b]*u;for(let p=0;p<u;p++)f[_++]=c[m++]}return new Kt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kn,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Au=new Je,zi=new ia,uo=new $n,Pu=new F,ho=new F,fo=new F,po=new F,Da=new F,mo=new F,Ru=new F,go=new F;class Et extends Rt{constructor(e=new kn,t=new Ji){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){mo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Da.fromBufferAttribute(h,e),o?mo.addScaledVector(Da,u):mo.addScaledVector(Da.sub(t),u))}t.add(mo)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),uo.copy(n.boundingSphere),uo.applyMatrix4(r),zi.copy(e.ray).recast(e.near),!(uo.containsPoint(zi.origin)===!1&&(zi.intersectSphere(uo,Pu)===null||zi.origin.distanceToSquared(Pu)>(e.far-e.near)**2))&&(Au.copy(r).invert(),zi.copy(e.ray).applyMatrix4(Au),!(n.boundingBox!==null&&zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,zi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,b=f.length;_<b;_++){const v=f[_],p=o[v.materialIndex],D=Math.max(v.start,m.start),P=Math.min(a.count,Math.min(v.start+v.count,m.start+m.count));for(let M=D,U=P;M<U;M+=3){const L=a.getX(M),k=a.getX(M+1),H=a.getX(M+2);s=vo(this,p,e,n,c,u,h,L,k,H),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),b=Math.min(a.count,m.start+m.count);for(let v=_,p=b;v<p;v+=3){const D=a.getX(v),P=a.getX(v+1),M=a.getX(v+2);s=vo(this,o,e,n,c,u,h,D,P,M),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,b=f.length;_<b;_++){const v=f[_],p=o[v.materialIndex],D=Math.max(v.start,m.start),P=Math.min(l.count,Math.min(v.start+v.count,m.start+m.count));for(let M=D,U=P;M<U;M+=3){const L=M,k=M+1,H=M+2;s=vo(this,p,e,n,c,u,h,L,k,H),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let v=_,p=b;v<p;v+=3){const D=v,P=v+1,M=v+2;s=vo(this,o,e,n,c,u,h,D,P,M),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}}}function Am(i,e,t,n,s,r,o,a){let l;if(e.side===qt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Xn,a),l===null)return null;go.copy(a),go.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(go);return c<t.near||c>t.far?null:{distance:c,point:go.clone(),object:i}}function vo(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ho),i.getVertexPosition(l,fo),i.getVertexPosition(c,po);const u=Am(i,e,t,n,ho,fo,po,Ru);if(u){const h=new F;Dn.getBarycoord(Ru,ho,fo,po,h),s&&(u.uv=Dn.getInterpolatedAttribute(s,a,l,c,h,new Me)),r&&(u.uv1=Dn.getInterpolatedAttribute(r,a,l,c,h,new Me)),o&&(u.normal=Dn.getInterpolatedAttribute(o,a,l,c,h,new F),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new F,materialIndex:0};Dn.getNormal(ho,fo,po,f.normal),u.face=f,u.barycoord=h}return u}class Ur extends kn{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,m=0;_("z","y","x",-1,-1,n,t,e,o,r,0),_("z","y","x",1,-1,n,t,-e,o,r,1),_("x","z","y",1,1,e,n,t,s,o,2),_("x","z","y",1,-1,e,n,-t,s,o,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new fi(c,3)),this.setAttribute("normal",new fi(u,3)),this.setAttribute("uv",new fi(h,2));function _(b,v,p,D,P,M,U,L,k,H,E){const w=M/k,N=U/H,q=M/2,$=U/2,te=L/2,ne=k+1,J=H+1;let ce=0,Y=0;const pe=new F;for(let be=0;be<J;be++){const Re=be*N-$;for(let Be=0;Be<ne;Be++){const it=Be*w-q;pe[b]=it*D,pe[v]=Re*P,pe[p]=te,c.push(pe.x,pe.y,pe.z),pe[b]=0,pe[v]=0,pe[p]=L>0?1:-1,u.push(pe.x,pe.y,pe.z),h.push(Be/k),h.push(1-be/H),ce+=1}}for(let be=0;be<H;be++)for(let Re=0;Re<k;Re++){const Be=f+Re+ne*be,it=f+Re+ne*(be+1),ht=f+(Re+1)+ne*(be+1),Qe=f+(Re+1)+ne*be;l.push(Be,it,Qe),l.push(it,ht,Qe),Y+=6}a.addGroup(m,Y,E),m+=Y,f+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ur(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Hs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Jt(i){const e={};for(let t=0;t<i.length;t++){const n=Hs(i[t]);for(const s in n)e[s]=n[s]}return e}function Pm(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Md(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const Rm={clone:Hs,merge:Jt};var Dm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Im=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tt extends On{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dm,this.fragmentShader=Im,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hs(e.uniforms),this.uniformsGroups=Pm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}let yc=class extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}};const Ei=new F,Du=new Me,Iu=new Me;class Qt extends yc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Vs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Vs*2*Math.atan(Math.tan(gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z),Ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z)}getViewSize(e,t){return this.getViewBounds(e,Du,Iu),t.subVectors(Iu,Du)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const xs=-90,bs=1;class Lm extends Rt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qt(xs,bs,e,t);s.layers=this.layers,this.add(s);const r=new Qt(xs,bs,e,t);r.layers=this.layers,this.add(r);const o=new Qt(xs,bs,e,t);o.layers=this.layers,this.add(o);const a=new Qt(xs,bs,e,t);a.layers=this.layers,this.add(a);const l=new Qt(xs,bs,e,t);l.layers=this.layers,this.add(l);const c=new Qt(xs,bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Wo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Sc extends Ut{constructor(e=[],t=Ns,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Um extends Nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Sc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ur(5,5,5),r=new Tt({name:"CubemapFromEquirect",uniforms:Hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:hi});r.uniforms.tEquirect.value=t;const o=new Et(s,r),a=t.minFilter;return t.minFilter===In&&(t.minFilter=Pt),new Lm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class Qi extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Om={type:"move"};class Ia{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const b of e.hand.values()){const v=t.getJointPose(b,n),p=this._getHandJoint(c,b);v!==null&&(p.matrix.fromArray(v.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=v.radius),p.visible=v!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,_=.005;c.inputState.pinching&&f>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Om)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Qi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Yl extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new jn,this.environmentIntensity=1,this.environmentRotation=new jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Nm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Kl,this.updateRanges=[],this.version=0,this.uuid=Ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Zt=new F;class wc{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array),r=pt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new wc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Lu=new F,Uu=new at,Ou=new at,km=new F,Nu=new Je,_o=new F,La=new $n,ku=new Je,Ua=new ia;class Fm extends Et{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=du,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new vi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,_o),this.boundingBox.expandByPoint(_o)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new $n),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,_o),this.boundingSphere.expandByPoint(_o)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),La.copy(this.boundingSphere),La.applyMatrix4(s),e.ray.intersectsSphere(La)!==!1&&(ku.copy(s).invert(),Ua.copy(e.ray).applyMatrix4(ku),!(this.boundingBox!==null&&Ua.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ua)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===du?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Rp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;Uu.fromBufferAttribute(s.attributes.skinIndex,e),Ou.fromBufferAttribute(s.attributes.skinWeight,e),Lu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=Ou.getComponent(r);if(o!==0){const a=Uu.getComponent(r);Nu.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(km.copy(Lu).applyMatrix4(Nu),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Ed extends Rt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Mc extends Ut{constructor(e=null,t=1,n=1,s,r,o,a,l,c=jt,u=jt,h,f){super(null,o,a,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Fu=new Je,Bm=new Je;class Ec{constructor(e=[],t=[]){this.uuid=Ln(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:Bm;Fu.multiplyMatrices(a,t[r]),Fu.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Ec(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Mc(t,e,e,Xt,rn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Ed),this.bones.push(o),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const o=t[s];e.bones.push(o.uuid);const a=n[s];e.boneInverses.push(a.toArray())}return e}}class $l extends Kt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ys=new Je,Bu=new Je,xo=[],zu=new vi,zm=new Je,rr=new Et,or=new $n;class Vm extends Et{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new $l(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,zm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new vi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),zu.copy(e.boundingBox).applyMatrix4(ys),this.boundingBox.union(zu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $n),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),or.copy(e.boundingSphere).applyMatrix4(ys),this.boundingSphere.union(or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(rr.geometry=this.geometry,rr.material=this.material,rr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),or.copy(this.boundingSphere),or.applyMatrix4(n),e.ray.intersectsSphere(or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ys),Bu.multiplyMatrices(n,ys),rr.matrixWorld=Bu,rr.raycast(e,xo);for(let o=0,a=xo.length;o<a;o++){const l=xo[o];l.instanceId=r,l.object=this,t.push(l)}xo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new $l(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mc(new Float32Array(s*this.count),s,this.count,Zi,rn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Oa=new F,Hm=new F,Gm=new Ye;class qi{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Oa.subVectors(n,t).cross(Hm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Oa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Gm.getNormalMatrix(e),s=this.coplanarPoint(Oa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vi=new $n,Wm=new Me(.5,.5),bo=new F;class Tc{constructor(e=new qi,t=new qi,n=new qi,s=new qi,r=new qi,o=new qi){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Gn,n=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],f=r[6],m=r[7],_=r[8],b=r[9],v=r[10],p=r[11],D=r[12],P=r[13],M=r[14],U=r[15];if(s[0].setComponents(c-o,m-u,p-_,U-D).normalize(),s[1].setComponents(c+o,m+u,p+_,U+D).normalize(),s[2].setComponents(c+a,m+h,p+b,U+P).normalize(),s[3].setComponents(c-a,m-h,p-b,U-P).normalize(),n)s[4].setComponents(l,f,v,M).normalize(),s[5].setComponents(c-l,m-f,p-v,U-M).normalize();else if(s[4].setComponents(c-l,m-f,p-v,U-M).normalize(),t===Gn)s[5].setComponents(c+l,m+f,p+v,U+M).normalize();else if(t===Wo)s[5].setComponents(l,f,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vi)}intersectsSprite(e){Vi.center.set(0,0,0);const t=Wm.distanceTo(e.center);return Vi.radius=.7071067811865476+t,Vi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(bo.x=s.normal.x>0?e.max.x:e.min.x,bo.y=s.normal.y>0?e.max.y:e.min.y,bo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(bo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Td extends On{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ce(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Xo=new F,qo=new F,Vu=new Je,ar=new ia,yo=new $n,Na=new F,Hu=new F;class Cc extends Rt{constructor(e=new kn,t=new Td){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Xo.fromBufferAttribute(t,s-1),qo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Xo.distanceTo(qo);e.setAttribute("lineDistance",new fi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yo.copy(n.boundingSphere),yo.applyMatrix4(s),yo.radius+=r,e.ray.intersectsSphere(yo)===!1)return;Vu.copy(s).invert(),ar.copy(e.ray).applyMatrix4(Vu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const m=Math.max(0,o.start),_=Math.min(u.count,o.start+o.count);for(let b=m,v=_-1;b<v;b+=c){const p=u.getX(b),D=u.getX(b+1),P=So(this,e,ar,l,p,D,b);P&&t.push(P)}if(this.isLineLoop){const b=u.getX(_-1),v=u.getX(m),p=So(this,e,ar,l,b,v,_-1);p&&t.push(p)}}else{const m=Math.max(0,o.start),_=Math.min(f.count,o.start+o.count);for(let b=m,v=_-1;b<v;b+=c){const p=So(this,e,ar,l,b,b+1,b);p&&t.push(p)}if(this.isLineLoop){const b=So(this,e,ar,l,_-1,m,_-1);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function So(i,e,t,n,s,r,o){const a=i.geometry.attributes.position;if(Xo.fromBufferAttribute(a,s),qo.fromBufferAttribute(a,r),t.distanceSqToSegment(Xo,qo,Na,Hu)>n)return;Na.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Na);if(!(c<e.near||c>e.far))return{distance:c,point:Hu.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const Gu=new F,Wu=new F;class Xm extends Cc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Gu.fromBufferAttribute(t,s),Wu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Gu.distanceTo(Wu);e.setAttribute("lineDistance",new fi(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qm extends Cc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Cd extends On{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xu=new Je,Zl=new ia,wo=new $n,Mo=new F;class jm extends Rt{constructor(e=new kn,t=new Cd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wo.copy(n.boundingSphere),wo.applyMatrix4(s),wo.radius+=r,e.ray.intersectsSphere(wo)===!1)return;Xu.copy(s).invert(),Zl.copy(e.ray).applyMatrix4(Xu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let _=f,b=m;_<b;_++){const v=c.getX(_);Mo.fromBufferAttribute(h,v),qu(Mo,v,l,s,e,t,this)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,b=m;_<b;_++)Mo.fromBufferAttribute(h,_),qu(Mo,_,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function qu(i,e,t,n,s,r,o){const a=Zl.distanceSqToPoint(i);if(a<t){const l=new F;Zl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Ad extends Ut{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Tr extends Ut{constructor(e,t,n=qn,s,r,o,a=jt,l=jt,c,u=yr,h=1){if(u!==yr&&u!==zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Pd extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class un extends kn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,f=t/l,m=[],_=[],b=[],v=[];for(let p=0;p<u;p++){const D=p*f-o;for(let P=0;P<c;P++){const M=P*h-r;_.push(M,-D,0),b.push(0,0,1),v.push(P/a),v.push(1-p/l)}}for(let p=0;p<l;p++)for(let D=0;D<a;D++){const P=D+c*p,M=D+c*(p+1),U=D+1+c*(p+1),L=D+1+c*p;m.push(P,M,L),m.push(M,U,L)}this.setIndex(m),this.setAttribute("position",new fi(_,3)),this.setAttribute("normal",new fi(b,3)),this.setAttribute("uv",new fi(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new un(e.width,e.height,e.widthSegments,e.heightSegments)}}class Eo extends Tt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ac extends On{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gd,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Zn extends Ac{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ce(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ce(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ce(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Km extends On{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=md,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ym extends On{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function To(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function $m(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Zm(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function ju(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function Rd(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}class Or{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Jm extends Or{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ts,endingEnd:Ts}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Cs:r=e,a=2*t-n;break;case Ho:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Cs:o=e,l=2*n-t;break;case Ho:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,m=this._weightNext,_=(n-t)/(s-t),b=_*_,v=b*_,p=-f*v+2*f*b-f*_,D=(1+f)*v+(-1.5-2*f)*b+(-.5+f)*_+1,P=(-1-m)*v+(1.5+m)*b+.5*_,M=m*v-m*b;for(let U=0;U!==a;++U)r[U]=p*o[u+U]+D*o[c+U]+P*o[l+U]+M*o[h+U];return r}}class Dd extends Or{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),h=1-u;for(let f=0;f!==a;++f)r[f]=o[c+f]*h+o[l+f]*u;return r}}class Qm extends Or{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class Fn{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=To(t,this.TimeBufferType),this.values=To(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:To(e.times,Array),values:To(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Qm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Dd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Jm(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Sr:t=this.InterpolantFactoryMethodDiscrete;break;case wr:t=this.InterpolantFactoryMethodLinear;break;case ha:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Sr;case this.InterpolantFactoryMethodLinear:return wr;case this.InterpolantFactoryMethodSmooth:return ha}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&$m(s))for(let a=0,l=s.length;a!==l;++a){const c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ha,r=e.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{const h=a*n,f=h-n,m=h+n;for(let _=0;_!==n;++_){const b=t[h+_];if(b!==t[f+_]||b!==t[m+_]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const h=a*n,f=o*n;for(let m=0;m!==n;++m)t[f+m]=t[h+m]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Fn.prototype.ValueTypeName="";Fn.prototype.TimeBufferType=Float32Array;Fn.prototype.ValueBufferType=Float32Array;Fn.prototype.DefaultInterpolation=wr;class js extends Fn{constructor(e,t,n){super(e,t,n)}}js.prototype.ValueTypeName="bool";js.prototype.ValueBufferType=Array;js.prototype.DefaultInterpolation=Sr;js.prototype.InterpolantFactoryMethodLinear=void 0;js.prototype.InterpolantFactoryMethodSmooth=void 0;class Id extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Id.prototype.ValueTypeName="color";class Gs extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Gs.prototype.ValueTypeName="number";class e0 extends Or{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t);let c=e*a;for(let u=c+a;c!==u;c+=4)Un.slerpFlat(r,0,o,c-a,o,c,l);return r}}class Ws extends Fn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new e0(this.times,this.values,this.getValueSize(),e)}}Ws.prototype.ValueTypeName="quaternion";Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Ks extends Fn{constructor(e,t,n){super(e,t,n)}}Ks.prototype.ValueTypeName="string";Ks.prototype.ValueBufferType=Array;Ks.prototype.DefaultInterpolation=Sr;Ks.prototype.InterpolantFactoryMethodLinear=void 0;Ks.prototype.InterpolantFactoryMethodSmooth=void 0;class Xs extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Xs.prototype.ValueTypeName="vector";class Jl{constructor(e="",t=-1,n=[],s=_c){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Ln(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(n0(n[o]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Fn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const u=Zm(l);l=ju(l,1,u),c=ju(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Gs(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],u=c.name.match(r);if(u&&u.length>1){const h=u[1];let f=s[h];f||(s[h]=f=[]),f.push(c)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,f,m,_,b){if(m.length!==0){const v=[],p=[];Rd(m,v,p,_),v.length!==0&&b.push(new h(f,v,p))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const f=c[h].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const m={};let _;for(_=0;_<f.length;_++)if(f[_].morphTargets)for(let b=0;b<f[_].morphTargets.length;b++)m[f[_].morphTargets[b]]=-1;for(const b in m){const v=[],p=[];for(let D=0;D!==f[_].morphTargets.length;++D){const P=f[_];v.push(P.time),p.push(P.morphTarget===b?1:0)}s.push(new Gs(".morphTargetInfluence["+b+"]",v,p))}l=m.length*o}else{const m=".bones["+t[h].name+"]";n(Xs,m+".position",f,"pos",s),n(Ws,m+".quaternion",f,"rot",s),n(Xs,m+".scale",f,"scl",s)}}return s.length===0?null:new this(r,l,s,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function t0(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Gs;case"vector":case"vector2":case"vector3":case"vector4":return Xs;case"color":return Id;case"quaternion":return Ws;case"bool":case"boolean":return js;case"string":return Ks}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function n0(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=t0(i.type);if(i.times===void 0){const t=[],n=[];Rd(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const ci={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class i0{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const m=c[h],_=c[h+1];if(m.global&&(m.lastIndex=0),m.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const s0=new i0;class Ni{constructor(e){this.manager=e!==void 0?e:s0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Ni.DEFAULT_MATERIAL_NAME="__DEFAULT";const ri={};class r0 extends Error{constructor(e,t){super(e),this.response=t}}class Pc extends Ni{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ci.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ri[e]!==void 0){ri[e].push({onLoad:t,onProgress:n,onError:s});return}ri[e]=[],ri[e].push({onLoad:t,onProgress:n,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=ri[e],h=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),m=f?parseInt(f):0,_=m!==0;let b=0;const v=new ReadableStream({start(p){D();function D(){h.read().then(({done:P,value:M})=>{if(P)p.close();else{b+=M.byteLength;const U=new ProgressEvent("progress",{lengthComputable:_,loaded:b,total:m});for(let L=0,k=u.length;L<k;L++){const H=u[L];H.onProgress&&H.onProgress(U)}p.enqueue(M),D()}},P=>{p.error(P)})}}});return new Response(v)}else throw new r0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,m=new TextDecoder(f);return c.arrayBuffer().then(_=>m.decode(_))}}}).then(c=>{ci.add(`file:${e}`,c);const u=ri[e];delete ri[e];for(let h=0,f=u.length;h<f;h++){const m=u[h];m.onLoad&&m.onLoad(c)}}).catch(c=>{const u=ri[e];if(u===void 0)throw this.manager.itemError(e),c;delete ri[e];for(let h=0,f=u.length;h<f;h++){const m=u[h];m.onError&&m.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ss=new WeakMap;class Ld extends Ni{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ci.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let h=Ss.get(o);h===void 0&&(h=[],Ss.set(o,h)),h.push({onLoad:t,onError:s})}return o}const a=Mr("img");function l(){u(),t&&t(this);const h=Ss.get(this)||[];for(let f=0;f<h.length;f++){const m=h[f];m.onLoad&&m.onLoad(this)}Ss.delete(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),ci.remove(`image:${e}`);const f=Ss.get(this)||[];for(let m=0;m<f.length;m++){const _=f[m];_.onError&&_.onError(h)}Ss.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ci.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class o0 extends Ni{constructor(e){super(e)}load(e,t,n,s){const r=new Sc;r.colorSpace=yt;const o=new Ld(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(e[c],function(u){r.images[c]=u,a++,a===6&&(r.needsUpdate=!0,t&&t(r))},void 0,s)}for(let c=0;c<e.length;++c)l(c);return r}}class a0 extends Ni{constructor(e){super(e)}load(e,t,n,s){const r=this,o=new Mc,a=new Pc(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:yn,o.wrapT=c.wrapT!==void 0?c.wrapT:yn,o.magFilter=c.magFilter!==void 0?c.magFilter:Pt,o.minFilter=c.minFilter!==void 0?c.minFilter:Pt,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(o.colorSpace=c.colorSpace),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=In),c.mipmapCount===1&&(o.minFilter=Pt),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,t&&t(o,c)},n,s),o}}class Rc extends Ni{constructor(e){super(e)}load(e,t,n,s){const r=new Ut,o=new Ld(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class sa extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const ka=new Je,Ku=new F,Yu=new F;class Dc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Me(512,512),this.mapType=ln,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tc,this._frameExtents=new Me(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ku.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ku),Yu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yu),t.updateMatrixWorld(),ka.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ka,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ka)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class l0 extends Dc{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Vs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class c0 extends sa{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new l0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const $u=new Je,lr=new F,Fa=new F;class u0 extends Dc{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Me(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),lr.setFromMatrixPosition(e.matrixWorld),n.position.copy(lr),Fa.copy(n.position),Fa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Fa),n.updateMatrixWorld(),s.makeTranslation(-lr.x,-lr.y,-lr.z),$u.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix($u,n.coordinateSystem,n.reversedDepth)}}class h0 extends sa{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new u0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ic extends yc{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class d0 extends Dc{constructor(){super(new Ic(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ud extends sa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new d0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class f0 extends sa{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class _r{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Ba=new WeakMap;class p0 extends Ni{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ci.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{if(Ba.has(o)===!0)s&&s(Ba.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ci.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Ba.set(l,c),ci.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ci.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class m0 extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class g0{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,o;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,s=this.valueSize,r=e*s+s;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==s;++a)n[r+a]=n[a];o=t}else{o+=t;const a=t/o;this._mixBufferRegion(n,r,0,a,s)}this.cumulativeWeight=o}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,s,l,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,o=s;r!==o;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,s){Un.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){const o=this._workIndex*r;Un.multiplyQuaternionsFlat(e,o,e,t,e,n),Un.slerpFlat(e,t,e,t,e,o,s)}_lerp(e,t,n,s,r){const o=1-s;for(let a=0;a!==r;++a){const l=t+a;e[l]=e[l]*o+e[n+a]*s}}_lerpAdditive(e,t,n,s,r){for(let o=0;o!==r;++o){const a=t+o;e[a]=e[a]+e[n+o]*s}}}const Lc="\\[\\]\\.:\\/",v0=new RegExp("["+Lc+"]","g"),Uc="[^"+Lc+"]",_0="[^"+Lc.replace("\\.","")+"]",x0=/((?:WC+[\/:])*)/.source.replace("WC",Uc),b0=/(WCOD+)?/.source.replace("WCOD",_0),y0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Uc),S0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Uc),w0=new RegExp("^"+x0+b0+y0+S0+"$"),M0=["material","materials","bones","map"];class E0{constructor(e,t,n){const s=n||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class dt{constructor(e,t,n){this.path=t,this.parsedPath=n||dt.parseTrackName(t),this.node=dt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new dt.Composite(e,t,n):new dt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(v0,"")}static parseTrackName(e){const t=w0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);M0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=dt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[s];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}dt.Composite=E0;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class T0{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;const r=t.tracks,o=r.length,a=new Array(o),l={endingStart:Ts,endingEnd:Ts};for(let c=0;c!==o;++c){const u=r[c].createInterpolant(null);a[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Ip,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const s=this._clip.duration,r=e._clip.duration,o=r/s,a=s/r;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const s=this._mixer,r=s.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=s._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const o=this._updateTime(t),a=this._updateWeight(e);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Up:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(o),c[u].accumulateAdditive(a);break;case _c:default:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(o),c[u].accumulate(s,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let s=this.time+e,r=this._loopCount;const o=n===Lp;if(e===0)return r===-1?s:o&&(r&1)===1?t-s:s;if(n===Dp){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),s>=t||s<0){const a=Math.floor(s/t);s-=t*a,r+=Math.abs(a);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=s;if(o&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){const s=this._interpolantSettings;n?(s.endingStart=Cs,s.endingEnd=Cs):(e?s.endingStart=this.zeroSlopeAtStart?Cs:Ts:s.endingStart=Ho,t?s.endingEnd=this.zeroSlopeAtEnd?Cs:Ts:s.endingEnd=Ho)}_scheduleFading(e,t,n){const s=this._mixer,r=s.time;let o=this._weightInterpolant;o===null&&(o=s._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}}const C0=new Float32Array(1);class A0 extends ss{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let u=c[l];u===void 0&&(u={},c[l]=u);for(let h=0;h!==r;++h){const f=s[h],m=f.name;let _=u[m];if(_!==void 0)++_.referenceCount,o[h]=_;else{if(_=o[h],_!==void 0){_._cacheIndex===null&&(++_.referenceCount,this._addInactiveBinding(_,l,m));continue}const b=t&&t._propertyBindings[h].binding.parsedPath;_=new g0(dt.create(n,m,b),f.ValueTypeName,f.getValueSize()),++_.referenceCount,this._addInactiveBinding(_,l,m),o[h]=_}a[h].resultBuffer=_.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const s=this._actions,r=this._actionsByClip;let o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{const a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=s.length,s.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,o=this._actionsByClip,a=o[r],l=a.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;const h=a.actionByRoot,f=(e._localRoot||this._root).uuid;delete h[f],l.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const s=this._bindingsByRootAndName,r=this._bindings;let o=s[t];o===void 0&&(o={},s[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[s]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Dd(new Float32Array(2),new Float32Array(2),1,C0),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const s=t||this._root,r=s.uuid;let o=typeof e=="string"?Jl.findByName(s,e):e;const a=o!==null?o.uuid:e,l=this._actionsByClip[a];let c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=_c),l!==void 0){const h=l.actionByRoot[r];if(h!==void 0&&h.blendMode===n)return h;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;const u=new T0(this,o,t,n);return this._bindAction(u,c),this._addInactiveAction(u,a,r),u}existingAction(e,t){const n=t||this._root,s=n.uuid,r=typeof e=="string"?Jl.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(s,e,r,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const o=r.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const o in r){const a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class jo{constructor(e){this.value=e}clone(){return new jo(this.value.clone===void 0?this.value:this.value.clone())}}function Zu(i,e,t,n){const s=P0(n);switch(t){case dd:return i*e;case Zi:return i*e/s.components*s.byteLength;case mc:return i*e/s.components*s.byteLength;case Yi:return i*e*2/s.components*s.byteLength;case gc:return i*e*2/s.components*s.byteLength;case fd:return i*e*3/s.components*s.byteLength;case Xt:return i*e*4/s.components*s.byteLength;case vc:return i*e*4/s.components*s.byteLength;case Uo:case Oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case No:case ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case bl:case Sl:return Math.max(i,16)*Math.max(e,8)/4;case xl:case yl:return Math.max(i,8)*Math.max(e,8)/2;case wl:case Ml:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case El:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Tl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Al:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Pl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Rl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Dl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ll:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ul:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Bl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case zl:case Vl:case Hl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Gl:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xl:case ql:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function P0(i){switch(i){case ln:case ld:return{byteLength:1,components:1};case br:case cd:case Hn:return{byteLength:2,components:1};case fc:case pc:return{byteLength:2,components:4};case qn:case dc:case rn:return{byteLength:4,components:1};case ud:case hd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:hc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=hc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Od(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function R0(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<h.length;m++){const _=h[f],b=h[m];b.start<=_.start+_.count+1?_.count=Math.max(_.count,b.start+b.count-_.start):(++f,h[f]=b)}h.length=f+1;for(let m=0,_=h.length;m<_;m++){const b=h[m];i.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var D0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,I0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,L0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,U0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,O0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,N0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,k0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,F0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,B0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,z0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,V0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,H0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,G0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,W0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,X0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,q0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,j0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Z0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,J0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Q0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,eg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ng=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ig=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,og=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ag="gl_FragColor = linearToOutputTexel( gl_FragColor );",lg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ug=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,pg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_g=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,xg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,wg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Mg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Eg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ag=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Rg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Dg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ug=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,zg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,jg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ev=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ov=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,av=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,uv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,fv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,_v=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,bv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ev=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Tv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Av=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Dv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Uv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ov=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,kv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Fv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Bv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Yv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$v=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Zv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,t_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,l_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:D0,alphahash_pars_fragment:I0,alphamap_fragment:L0,alphamap_pars_fragment:U0,alphatest_fragment:O0,alphatest_pars_fragment:N0,aomap_fragment:k0,aomap_pars_fragment:F0,batching_pars_vertex:B0,batching_vertex:z0,begin_vertex:V0,beginnormal_vertex:H0,bsdfs:G0,iridescence_fragment:W0,bumpmap_pars_fragment:X0,clipping_planes_fragment:q0,clipping_planes_pars_fragment:j0,clipping_planes_pars_vertex:K0,clipping_planes_vertex:Y0,color_fragment:$0,color_pars_fragment:Z0,color_pars_vertex:J0,color_vertex:Q0,common:eg,cube_uv_reflection_fragment:tg,defaultnormal_vertex:ng,displacementmap_pars_vertex:ig,displacementmap_vertex:sg,emissivemap_fragment:rg,emissivemap_pars_fragment:og,colorspace_fragment:ag,colorspace_pars_fragment:lg,envmap_fragment:cg,envmap_common_pars_fragment:ug,envmap_pars_fragment:hg,envmap_pars_vertex:dg,envmap_physical_pars_fragment:wg,envmap_vertex:fg,fog_vertex:pg,fog_pars_vertex:mg,fog_fragment:gg,fog_pars_fragment:vg,gradientmap_pars_fragment:_g,lightmap_pars_fragment:xg,lights_lambert_fragment:bg,lights_lambert_pars_fragment:yg,lights_pars_begin:Sg,lights_toon_fragment:Mg,lights_toon_pars_fragment:Eg,lights_phong_fragment:Tg,lights_phong_pars_fragment:Cg,lights_physical_fragment:Ag,lights_physical_pars_fragment:Pg,lights_fragment_begin:Rg,lights_fragment_maps:Dg,lights_fragment_end:Ig,logdepthbuf_fragment:Lg,logdepthbuf_pars_fragment:Ug,logdepthbuf_pars_vertex:Og,logdepthbuf_vertex:Ng,map_fragment:kg,map_pars_fragment:Fg,map_particle_fragment:Bg,map_particle_pars_fragment:zg,metalnessmap_fragment:Vg,metalnessmap_pars_fragment:Hg,morphinstance_vertex:Gg,morphcolor_vertex:Wg,morphnormal_vertex:Xg,morphtarget_pars_vertex:qg,morphtarget_vertex:jg,normal_fragment_begin:Kg,normal_fragment_maps:Yg,normal_pars_fragment:$g,normal_pars_vertex:Zg,normal_vertex:Jg,normalmap_pars_fragment:Qg,clearcoat_normal_fragment_begin:ev,clearcoat_normal_fragment_maps:tv,clearcoat_pars_fragment:nv,iridescence_pars_fragment:iv,opaque_fragment:sv,packing:rv,premultiplied_alpha_fragment:ov,project_vertex:av,dithering_fragment:lv,dithering_pars_fragment:cv,roughnessmap_fragment:uv,roughnessmap_pars_fragment:hv,shadowmap_pars_fragment:dv,shadowmap_pars_vertex:fv,shadowmap_vertex:pv,shadowmask_pars_fragment:mv,skinbase_vertex:gv,skinning_pars_vertex:vv,skinning_vertex:_v,skinnormal_vertex:xv,specularmap_fragment:bv,specularmap_pars_fragment:yv,tonemapping_fragment:Sv,tonemapping_pars_fragment:wv,transmission_fragment:Mv,transmission_pars_fragment:Ev,uv_pars_fragment:Tv,uv_pars_vertex:Cv,uv_vertex:Av,worldpos_vertex:Pv,background_vert:Rv,background_frag:Dv,backgroundCube_vert:Iv,backgroundCube_frag:Lv,cube_vert:Uv,cube_frag:Ov,depth_vert:Nv,depth_frag:kv,distanceRGBA_vert:Fv,distanceRGBA_frag:Bv,equirect_vert:zv,equirect_frag:Vv,linedashed_vert:Hv,linedashed_frag:Gv,meshbasic_vert:Wv,meshbasic_frag:Xv,meshlambert_vert:qv,meshlambert_frag:jv,meshmatcap_vert:Kv,meshmatcap_frag:Yv,meshnormal_vert:$v,meshnormal_frag:Zv,meshphong_vert:Jv,meshphong_frag:Qv,meshphysical_vert:e_,meshphysical_frag:t_,meshtoon_vert:n_,meshtoon_frag:i_,points_vert:s_,points_frag:r_,shadow_vert:o_,shadow_frag:a_,sprite_vert:l_,sprite_frag:c_},ye={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Vn={basic:{uniforms:Jt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Jt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Ce(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Jt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Jt([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Jt([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Ce(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Jt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Jt([ye.points,ye.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Jt([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Jt([ye.common,ye.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Jt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Jt([ye.sprite,ye.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Jt([ye.common,ye.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Jt([ye.lights,ye.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Vn.physical={uniforms:Jt([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Co={r:0,b:0,g:0},Hi=new jn,u_=new Je;function h_(i,e,t,n,s,r,o){const a=new Ce(0);let l=r===!0?0:1,c,u,h=null,f=0,m=null;function _(P){let M=P.isScene===!0?P.background:null;return M&&M.isTexture&&(M=(P.backgroundBlurriness>0?t:e).get(M)),M}function b(P){let M=!1;const U=_(P);U===null?p(a,l):U&&U.isColor&&(p(U,1),M=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(P,M){const U=_(M);U&&(U.isCubeTexture||U.mapping===na)?(u===void 0&&(u=new Et(new Ur(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:Hs(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,k,H){this.matrixWorld.copyPosition(H.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Hi.copy(M.backgroundRotation),Hi.x*=-1,Hi.y*=-1,Hi.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(Hi.y*=-1,Hi.z*=-1),u.material.uniforms.envMap.value=U,u.material.uniforms.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(u_.makeRotationFromEuler(Hi)),u.material.toneMapped=ot.getTransfer(U.colorSpace)!==gt,(h!==U||f!==U.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=U,f=U.version,m=i.toneMapping),u.layers.enableAll(),P.unshift(u,u.geometry,u.material,0,0,null)):U&&U.isTexture&&(c===void 0&&(c=new Et(new un(2,2),new Tt({name:"BackgroundMaterial",uniforms:Hs(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=U,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=ot.getTransfer(U.colorSpace)!==gt,U.matrixAutoUpdate===!0&&U.updateMatrix(),c.material.uniforms.uvTransform.value.copy(U.matrix),(h!==U||f!==U.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=U,f=U.version,m=i.toneMapping),c.layers.enableAll(),P.unshift(c,c.geometry,c.material,0,0,null))}function p(P,M){P.getRGB(Co,Md(i)),n.buffers.color.setClear(Co.r,Co.g,Co.b,M,o)}function D(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(P,M=1){a.set(P),l=M,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(P){l=P,p(a,l)},render:b,addToRenderList:v,dispose:D}}function d_(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(w,N,q,$,te){let ne=!1;const J=h($,q,N);r!==J&&(r=J,c(r.object)),ne=m(w,$,q,te),ne&&_(w,$,q,te),te!==null&&e.update(te,i.ELEMENT_ARRAY_BUFFER),(ne||o)&&(o=!1,M(w,N,q,$),te!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function l(){return i.createVertexArray()}function c(w){return i.bindVertexArray(w)}function u(w){return i.deleteVertexArray(w)}function h(w,N,q){const $=q.wireframe===!0;let te=n[w.id];te===void 0&&(te={},n[w.id]=te);let ne=te[N.id];ne===void 0&&(ne={},te[N.id]=ne);let J=ne[$];return J===void 0&&(J=f(l()),ne[$]=J),J}function f(w){const N=[],q=[],$=[];for(let te=0;te<t;te++)N[te]=0,q[te]=0,$[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:q,attributeDivisors:$,object:w,attributes:{},index:null}}function m(w,N,q,$){const te=r.attributes,ne=N.attributes;let J=0;const ce=q.getAttributes();for(const Y in ce)if(ce[Y].location>=0){const be=te[Y];let Re=ne[Y];if(Re===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(Re=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(Re=w.instanceColor)),be===void 0||be.attribute!==Re||Re&&be.data!==Re.data)return!0;J++}return r.attributesNum!==J||r.index!==$}function _(w,N,q,$){const te={},ne=N.attributes;let J=0;const ce=q.getAttributes();for(const Y in ce)if(ce[Y].location>=0){let be=ne[Y];be===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(be=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(be=w.instanceColor));const Re={};Re.attribute=be,be&&be.data&&(Re.data=be.data),te[Y]=Re,J++}r.attributes=te,r.attributesNum=J,r.index=$}function b(){const w=r.newAttributes;for(let N=0,q=w.length;N<q;N++)w[N]=0}function v(w){p(w,0)}function p(w,N){const q=r.newAttributes,$=r.enabledAttributes,te=r.attributeDivisors;q[w]=1,$[w]===0&&(i.enableVertexAttribArray(w),$[w]=1),te[w]!==N&&(i.vertexAttribDivisor(w,N),te[w]=N)}function D(){const w=r.newAttributes,N=r.enabledAttributes;for(let q=0,$=N.length;q<$;q++)N[q]!==w[q]&&(i.disableVertexAttribArray(q),N[q]=0)}function P(w,N,q,$,te,ne,J){J===!0?i.vertexAttribIPointer(w,N,q,te,ne):i.vertexAttribPointer(w,N,q,$,te,ne)}function M(w,N,q,$){b();const te=$.attributes,ne=q.getAttributes(),J=N.defaultAttributeValues;for(const ce in ne){const Y=ne[ce];if(Y.location>=0){let pe=te[ce];if(pe===void 0&&(ce==="instanceMatrix"&&w.instanceMatrix&&(pe=w.instanceMatrix),ce==="instanceColor"&&w.instanceColor&&(pe=w.instanceColor)),pe!==void 0){const be=pe.normalized,Re=pe.itemSize,Be=e.get(pe);if(Be===void 0)continue;const it=Be.buffer,ht=Be.type,Qe=Be.bytesPerElement,j=ht===i.INT||ht===i.UNSIGNED_INT||pe.gpuType===dc;if(pe.isInterleavedBufferAttribute){const se=pe.data,Se=se.stride,ze=pe.offset;if(se.isInstancedInterleavedBuffer){for(let Le=0;Le<Y.locationSize;Le++)p(Y.location+Le,se.meshPerAttribute);w.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Le=0;Le<Y.locationSize;Le++)v(Y.location+Le);i.bindBuffer(i.ARRAY_BUFFER,it);for(let Le=0;Le<Y.locationSize;Le++)P(Y.location+Le,Re/Y.locationSize,ht,be,Se*Qe,(ze+Re/Y.locationSize*Le)*Qe,j)}else{if(pe.isInstancedBufferAttribute){for(let se=0;se<Y.locationSize;se++)p(Y.location+se,pe.meshPerAttribute);w.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let se=0;se<Y.locationSize;se++)v(Y.location+se);i.bindBuffer(i.ARRAY_BUFFER,it);for(let se=0;se<Y.locationSize;se++)P(Y.location+se,Re/Y.locationSize,ht,be,Re*Qe,Re/Y.locationSize*se*Qe,j)}}else if(J!==void 0){const be=J[ce];if(be!==void 0)switch(be.length){case 2:i.vertexAttrib2fv(Y.location,be);break;case 3:i.vertexAttrib3fv(Y.location,be);break;case 4:i.vertexAttrib4fv(Y.location,be);break;default:i.vertexAttrib1fv(Y.location,be)}}}}D()}function U(){H();for(const w in n){const N=n[w];for(const q in N){const $=N[q];for(const te in $)u($[te].object),delete $[te];delete N[q]}delete n[w]}}function L(w){if(n[w.id]===void 0)return;const N=n[w.id];for(const q in N){const $=N[q];for(const te in $)u($[te].object),delete $[te];delete N[q]}delete n[w.id]}function k(w){for(const N in n){const q=n[N];if(q[w.id]===void 0)continue;const $=q[w.id];for(const te in $)u($[te].object),delete $[te];delete q[w.id]}}function H(){E(),o=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:H,resetDefaultState:E,dispose:U,releaseStatesOfGeometry:L,releaseStatesOfProgram:k,initAttributes:b,enableAttribute:v,disableUnusedAttributes:D}}function f_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_];t.update(m,n,1)}function l(c,u,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)o(c[_],u[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let _=0;for(let b=0;b<h;b++)_+=u[b]*f[b];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function p_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const k=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(k.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(k){return!(k!==Xt&&n.convert(k)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(k){const H=k===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(k!==ln&&n.convert(k)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&k!==rn&&!H)}function l(k){if(k==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";k="mediump"}return k==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),D=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),P=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),U=_>0,L=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:b,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:D,maxVaryings:P,maxFragmentUniforms:M,vertexTextures:U,maxSamples:L}}function m_(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new qi,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||s;return s=f,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const _=h.clippingPlanes,b=h.clipIntersection,v=h.clipShadows,p=i.get(h);if(!s||_===null||_.length===0||r&&!v)r?u(null):c();else{const D=r?0:n,P=D*4;let M=p.clippingState||null;l.value=M,M=u(_,f,P,m);for(let U=0;U!==P;++U)M[U]=t[U];p.clippingState=M,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=D}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,m,_){const b=h!==null?h.length:0;let v=null;if(b!==0){if(v=l.value,_!==!0||v===null){const p=m+b*4,D=f.matrixWorldInverse;a.getNormalMatrix(D),(v===null||v.length<p)&&(v=new Float32Array(p));for(let P=0,M=m;P!==b;++P,M+=4)o.copy(h[P]).applyMatrix4(D,a),o.normal.toArray(v,M),v[M+3]=o.constant}l.value=v,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,v}}function g_(i){let e=new WeakMap;function t(o,a){return a===vl?o.mapping=Ns:a===_l&&(o.mapping=ks),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===vl||a===_l)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Um(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const As=4,Ju=[.125,.215,.35,.446,.526,.582],$i=20,za=new Ic,Qu=new Ce;let Va=null,Ha=0,Ga=0,Wa=!1;const ji=(1+Math.sqrt(5))/2,ws=1/ji,eh=[new F(-ji,ws,0),new F(ji,ws,0),new F(-ws,0,ji),new F(ws,0,ji),new F(0,ji,-ws),new F(0,ji,ws),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)],v_=new F;class th{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:o=256,position:a=v_}=r;Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ih(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Va,Ha,Ga),this._renderer.xr.enabled=Wa,e.scissorTest=!1,Ao(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ns||e.mapping===ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Pt,minFilter:Pt,generateMipmaps:!1,type:Hn,format:Xt,colorSpace:It,depthBuffer:!1},s=nh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nh(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=__(r)),this._blurMaterial=x_(r,e,t)}return s}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,za)}_sceneToCubeUV(e,t,n,s,r){const l=new Qt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,m=h.toneMapping;h.getClearColor(Qu),h.toneMapping=Li,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const b=new Ji({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),v=new Et(new Ur,b);let p=!1;const D=e.background;D?D.isColor&&(b.color.copy(D),e.background=null,p=!0):(b.color.copy(Qu),p=!0);for(let P=0;P<6;P++){const M=P%3;M===0?(l.up.set(0,c[P],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[P],r.y,r.z)):M===1?(l.up.set(0,0,c[P]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[P],r.z)):(l.up.set(0,c[P],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[P]));const U=this._cubeSize;Ao(s,M*U,P>2?U:0,U,U),h.setRenderTarget(s),p&&h.render(v,l),h.render(e,l)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=m,h.autoClear=f,e.background=D}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ns||e.mapping===ks;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=sh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ih());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Et(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Ao(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,za)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=eh[(s-r-1)%eh.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Et(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*$i-1),b=r/_,v=isFinite(r)?1+Math.floor(u*b):$i;v>$i&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${$i}`);const p=[];let D=0;for(let k=0;k<$i;++k){const H=k/b,E=Math.exp(-H*H/2);p.push(E),k===0?D+=E:k<v&&(D+=2*E)}for(let k=0;k<p.length;k++)p[k]=p[k]/D;f.envMap.value=e.texture,f.samples.value=v,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:P}=this;f.dTheta.value=_,f.mipInt.value=P-n;const M=this._sizeLods[s],U=3*M*(s>P-As?s-P+As:0),L=4*(this._cubeSize-M);Ao(t,U,L,3*M,2*M),l.setRenderTarget(t),l.render(h,za)}}function __(i){const e=[],t=[],n=[];let s=i;const r=i-As+1+Ju.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-As?l=Ju[o-i+As-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,_=6,b=3,v=2,p=1,D=new Float32Array(b*_*m),P=new Float32Array(v*_*m),M=new Float32Array(p*_*m);for(let L=0;L<m;L++){const k=L%3*2/3-1,H=L>2?0:-1,E=[k,H,0,k+2/3,H,0,k+2/3,H+1,0,k,H,0,k+2/3,H+1,0,k,H+1,0];D.set(E,b*_*L),P.set(f,v*_*L);const w=[L,L,L,L,L,L];M.set(w,p*_*L)}const U=new kn;U.setAttribute("position",new Kt(D,b)),U.setAttribute("uv",new Kt(P,v)),U.setAttribute("faceIndex",new Kt(M,p)),e.push(U),s>As&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function nh(i,e,t){const n=new Nn(i,e,t);return n.texture.mapping=na,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ao(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function x_(i,e,t){const n=new Float32Array($i),s=new F(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:$i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Oc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function ih(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function sh(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function Oc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function b_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===vl||l===_l,u=l===Ns||l===ks;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new th(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const m=a.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new th(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function y_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Er("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function S_(i,e,t,n){const s={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",o),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function c(h){const f=[],m=h.index,_=h.attributes.position;let b=0;if(m!==null){const D=m.array;b=m.version;for(let P=0,M=D.length;P<M;P+=3){const U=D[P+0],L=D[P+1],k=D[P+2];f.push(U,L,L,k,k,U)}}else if(_!==void 0){const D=_.array;b=_.version;for(let P=0,M=D.length/3-1;P<M;P+=3){const U=P+0,L=P+1,k=P+2;f.push(U,L,L,k,k,U)}}else return;const v=new(_d(f)?wd:Sd)(f,1);v.version=b;const p=r.get(h);p&&e.remove(p),r.set(h,v)}function u(h){const f=r.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function w_(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*o),t.update(m,n,1)}function c(f,m,_){_!==0&&(i.drawElementsInstanced(n,m,r,f*o,_),t.update(m,n,_))}function u(f,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,_);let v=0;for(let p=0;p<_;p++)v+=m[p];t.update(v,n,1)}function h(f,m,_,b){if(_===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let p=0;p<f.length;p++)c(f[p]/o,m[p],b[p]);else{v.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,b,0,_);let p=0;for(let D=0;D<_;D++)p+=m[D]*b[D];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function M_(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function E_(i,e,t){const n=new WeakMap,s=new at;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(a);if(f===void 0||f.count!==h){let E=function(){k.dispose(),n.delete(a),a.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const m=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,b=a.morphAttributes.color!==void 0,v=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],D=a.morphAttributes.color||[];let P=0;m===!0&&(P=1),_===!0&&(P=2),b===!0&&(P=3);let M=a.attributes.position.count*P,U=1;M>e.maxTextureSize&&(U=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const L=new Float32Array(M*U*4*h),k=new xd(L,M,U,h);k.type=rn,k.needsUpdate=!0;const H=P*4;for(let w=0;w<h;w++){const N=v[w],q=p[w],$=D[w],te=M*U*4*w;for(let ne=0;ne<N.count;ne++){const J=ne*H;m===!0&&(s.fromBufferAttribute(N,ne),L[te+J+0]=s.x,L[te+J+1]=s.y,L[te+J+2]=s.z,L[te+J+3]=0),_===!0&&(s.fromBufferAttribute(q,ne),L[te+J+4]=s.x,L[te+J+5]=s.y,L[te+J+6]=s.z,L[te+J+7]=0),b===!0&&(s.fromBufferAttribute($,ne),L[te+J+8]=s.x,L[te+J+9]=s.y,L[te+J+10]=s.z,L[te+J+11]=$.itemSize===4?s.w:1)}}f={count:h,texture:k,size:new Me(M,U)},n.set(a,f),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let m=0;for(let b=0;b<c.length;b++)m+=c[b];const _=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function T_(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const Nd=new Ut,rh=new Tr(1,1),kd=new xd,Fd=new pm,Bd=new Sc,oh=[],ah=[],lh=new Float32Array(16),ch=new Float32Array(9),uh=new Float32Array(4);function Ys(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=oh[s];if(r===void 0&&(r=new Float32Array(s),oh[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ht(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ra(i,e){let t=ah[e];t===void 0&&(t=new Int32Array(e),ah[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function C_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function A_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2fv(this.addr,e),Ht(t,e)}}function P_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;i.uniform3fv(this.addr,e),Ht(t,e)}}function R_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4fv(this.addr,e),Ht(t,e)}}function D_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,n))return;uh.set(n),i.uniformMatrix2fv(this.addr,!1,uh),Ht(t,n)}}function I_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,n))return;ch.set(n),i.uniformMatrix3fv(this.addr,!1,ch),Ht(t,n)}}function L_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,n))return;lh.set(n),i.uniformMatrix4fv(this.addr,!1,lh),Ht(t,n)}}function U_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function O_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2iv(this.addr,e),Ht(t,e)}}function N_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3iv(this.addr,e),Ht(t,e)}}function k_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4iv(this.addr,e),Ht(t,e)}}function F_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function B_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2uiv(this.addr,e),Ht(t,e)}}function z_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3uiv(this.addr,e),Ht(t,e)}}function V_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4uiv(this.addr,e),Ht(t,e)}}function H_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rh.compareFunction=vd,r=rh):r=Nd,t.setTexture2D(e||r,s)}function G_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Fd,s)}function W_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Bd,s)}function X_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||kd,s)}function q_(i){switch(i){case 5126:return C_;case 35664:return A_;case 35665:return P_;case 35666:return R_;case 35674:return D_;case 35675:return I_;case 35676:return L_;case 5124:case 35670:return U_;case 35667:case 35671:return O_;case 35668:case 35672:return N_;case 35669:case 35673:return k_;case 5125:return F_;case 36294:return B_;case 36295:return z_;case 36296:return V_;case 35678:case 36198:case 36298:case 36306:case 35682:return H_;case 35679:case 36299:case 36307:return G_;case 35680:case 36300:case 36308:case 36293:return W_;case 36289:case 36303:case 36311:case 36292:return X_}}function j_(i,e){i.uniform1fv(this.addr,e)}function K_(i,e){const t=Ys(e,this.size,2);i.uniform2fv(this.addr,t)}function Y_(i,e){const t=Ys(e,this.size,3);i.uniform3fv(this.addr,t)}function $_(i,e){const t=Ys(e,this.size,4);i.uniform4fv(this.addr,t)}function Z_(i,e){const t=Ys(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function J_(i,e){const t=Ys(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Q_(i,e){const t=Ys(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ex(i,e){i.uniform1iv(this.addr,e)}function tx(i,e){i.uniform2iv(this.addr,e)}function nx(i,e){i.uniform3iv(this.addr,e)}function ix(i,e){i.uniform4iv(this.addr,e)}function sx(i,e){i.uniform1uiv(this.addr,e)}function rx(i,e){i.uniform2uiv(this.addr,e)}function ox(i,e){i.uniform3uiv(this.addr,e)}function ax(i,e){i.uniform4uiv(this.addr,e)}function lx(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Nd,r[o])}function cx(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Fd,r[o])}function ux(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Bd,r[o])}function hx(i,e,t){const n=this.cache,s=e.length,r=ra(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||kd,r[o])}function dx(i){switch(i){case 5126:return j_;case 35664:return K_;case 35665:return Y_;case 35666:return $_;case 35674:return Z_;case 35675:return J_;case 35676:return Q_;case 5124:case 35670:return ex;case 35667:case 35671:return tx;case 35668:case 35672:return nx;case 35669:case 35673:return ix;case 5125:return sx;case 36294:return rx;case 36295:return ox;case 36296:return ax;case 35678:case 36198:case 36298:case 36306:case 35682:return lx;case 35679:case 36299:case 36307:return cx;case 35680:case 36300:case 36308:case 36293:return ux;case 36289:case 36303:case 36311:case 36292:return hx}}class fx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=q_(t.type)}}class px{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dx(t.type)}}class mx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Xa=/(\w+)(\])?(\[|\.)?/g;function hh(i,e){i.seq.push(e),i.map[e.id]=e}function gx(i,e,t){const n=i.name,s=n.length;for(Xa.lastIndex=0;;){const r=Xa.exec(n),o=Xa.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){hh(t,c===void 0?new fx(a,i,e):new px(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new mx(a),hh(t,h)),t=h}}}class Fo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);gx(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function dh(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const vx=37297;let _x=0;function xx(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const fh=new Ye;function bx(i){ot._getMatrix(fh,ot.workingColorSpace,i);const e=`mat3( ${fh.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case Go:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ph(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+xx(i.getShaderSource(e),a)}else return r}function yx(i,e){const t=bx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Sx(i,e){let t;switch(e){case wp:t="Linear";break;case Mp:t="Reinhard";break;case Ep:t="Cineon";break;case Tp:t="ACESFilmic";break;case Ap:t="AgX";break;case Pp:t="Neutral";break;case Cp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Po=new F;function wx(){ot.getLuminanceCoefficients(Po);const i=Po.x.toFixed(4),e=Po.y.toFixed(4),t=Po.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Mx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function Ex(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Tx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function mr(i){return i!==""}function mh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Cx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ql(i){return i.replace(Cx,Px)}const Ax=new Map;function Px(i,e){let t=Ze[e];if(t===void 0){const n=Ax.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ql(t)}const Rx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vh(i){return i.replace(Rx,Dx)}function Dx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _h(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ix(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===sd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===np?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ai&&(e="SHADOWMAP_TYPE_VSM"),e}function Lx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ns:case ks:e="ENVMAP_TYPE_CUBE";break;case na:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ux(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ks:e="ENVMAP_MODE_REFRACTION";break}return e}function Ox(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case rd:e="ENVMAP_BLENDING_MULTIPLY";break;case yp:e="ENVMAP_BLENDING_MIX";break;case Sp:e="ENVMAP_BLENDING_ADD";break}return e}function Nx(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function kx(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Ix(t),c=Lx(t),u=Ux(t),h=Ox(t),f=Nx(t),m=Mx(t),_=Ex(r),b=s.createProgram();let v,p,D=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(mr).join(`
`),v.length>0&&(v+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(mr).join(`
`),p.length>0&&(p+=`
`)):(v=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),p=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Li?"#define TONE_MAPPING":"",t.toneMapping!==Li?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Li?Sx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,yx("linearToOutputTexel",t.outputColorSpace),wx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(mr).join(`
`)),o=Ql(o),o=mh(o,t),o=gh(o,t),a=Ql(a),a=mh(a,t),a=gh(a,t),o=vh(o),a=vh(a),t.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,v=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,p=["#define varying in",t.glslVersion===on?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===on?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const P=D+v+o,M=D+p+a,U=dh(s,s.VERTEX_SHADER,P),L=dh(s,s.FRAGMENT_SHADER,M);s.attachShader(b,U),s.attachShader(b,L),t.index0AttributeName!==void 0?s.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function k(N){if(i.debug.checkShaderErrors){const q=s.getProgramInfoLog(b)||"",$=s.getShaderInfoLog(U)||"",te=s.getShaderInfoLog(L)||"",ne=q.trim(),J=$.trim(),ce=te.trim();let Y=!0,pe=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(Y=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,U,L);else{const be=ph(s,U,"vertex"),Re=ph(s,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+ne+`
`+be+`
`+Re)}else ne!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ne):(J===""||ce==="")&&(pe=!1);pe&&(N.diagnostics={runnable:Y,programLog:ne,vertexShader:{log:J,prefix:v},fragmentShader:{log:ce,prefix:p}})}s.deleteShader(U),s.deleteShader(L),H=new Fo(s,b),E=Tx(s,b)}let H;this.getUniforms=function(){return H===void 0&&k(this),H};let E;this.getAttributes=function(){return E===void 0&&k(this),E};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(b,vx)),w},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_x++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=U,this.fragmentShader=L,this}let Fx=0;class Bx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new zx(e),t.set(e,n)),n}}class zx{constructor(e){this.id=Fx++,this.code=e,this.usedTimes=0}}function Vx(i,e,t,n,s,r,o){const a=new bd,l=new Bx,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(E){return c.add(E),E===0?"uv":`uv${E}`}function v(E,w,N,q,$){const te=q.fog,ne=$.geometry,J=E.isMeshStandardMaterial?q.environment:null,ce=(E.isMeshStandardMaterial?t:e).get(E.envMap||J),Y=ce&&ce.mapping===na?ce.image.height:null,pe=_[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const be=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,Re=be!==void 0?be.length:0;let Be=0;ne.morphAttributes.position!==void 0&&(Be=1),ne.morphAttributes.normal!==void 0&&(Be=2),ne.morphAttributes.color!==void 0&&(Be=3);let it,ht,Qe,j;if(pe){const ct=Vn[pe];it=ct.vertexShader,ht=ct.fragmentShader}else it=E.vertexShader,ht=E.fragmentShader,l.update(E),Qe=l.getVertexShaderID(E),j=l.getFragmentShaderID(E);const se=i.getRenderTarget(),Se=i.state.buffers.depth.getReversed(),ze=$.isInstancedMesh===!0,Le=$.isBatchedMesh===!0,$e=!!E.map,Ot=!!E.matcap,I=!!ce,vt=!!E.aoMap,Xe=!!E.lightMap,He=!!E.bumpMap,Ae=!!E.normalMap,_t=!!E.displacementMap,Ee=!!E.emissiveMap,je=!!E.metalnessMap,Nt=!!E.roughnessMap,wt=E.anisotropy>0,R=E.clearcoat>0,y=E.dispersion>0,G=E.iridescence>0,ee=E.sheen>0,oe=E.transmission>0,Z=wt&&!!E.anisotropyMap,Ue=R&&!!E.clearcoatMap,fe=R&&!!E.clearcoatNormalMap,De=R&&!!E.clearcoatRoughnessMap,Oe=G&&!!E.iridescenceMap,he=G&&!!E.iridescenceThicknessMap,ve=ee&&!!E.sheenColorMap,Pe=ee&&!!E.sheenRoughnessMap,Ie=!!E.specularMap,_e=!!E.specularColorMap,Ne=!!E.specularIntensityMap,O=oe&&!!E.transmissionMap,de=oe&&!!E.thicknessMap,X=!!E.gradientMap,we=!!E.alphaMap,le=E.alphaTest>0,ie=!!E.alphaHash,Te=!!E.extensions;let qe=Li;E.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(qe=i.toneMapping);const mt={shaderID:pe,shaderType:E.type,shaderName:E.name,vertexShader:it,fragmentShader:ht,defines:E.defines,customVertexShaderID:Qe,customFragmentShaderID:j,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:Le,batchingColor:Le&&$._colorsTexture!==null,instancing:ze,instancingColor:ze&&$.instanceColor!==null,instancingMorph:ze&&$.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:It,alphaToCoverage:!!E.alphaToCoverage,map:$e,matcap:Ot,envMap:I,envMapMode:I&&ce.mapping,envMapCubeUVHeight:Y,aoMap:vt,lightMap:Xe,bumpMap:He,normalMap:Ae,displacementMap:f&&_t,emissiveMap:Ee,normalMapObjectSpace:Ae&&E.normalMapType===kp,normalMapTangentSpace:Ae&&E.normalMapType===gd,metalnessMap:je,roughnessMap:Nt,anisotropy:wt,anisotropyMap:Z,clearcoat:R,clearcoatMap:Ue,clearcoatNormalMap:fe,clearcoatRoughnessMap:De,dispersion:y,iridescence:G,iridescenceMap:Oe,iridescenceThicknessMap:he,sheen:ee,sheenColorMap:ve,sheenRoughnessMap:Pe,specularMap:Ie,specularColorMap:_e,specularIntensityMap:Ne,transmission:oe,transmissionMap:O,thicknessMap:de,gradientMap:X,opaque:E.transparent===!1&&E.blending===Rs&&E.alphaToCoverage===!1,alphaMap:we,alphaTest:le,alphaHash:ie,combine:E.combine,mapUv:$e&&b(E.map.channel),aoMapUv:vt&&b(E.aoMap.channel),lightMapUv:Xe&&b(E.lightMap.channel),bumpMapUv:He&&b(E.bumpMap.channel),normalMapUv:Ae&&b(E.normalMap.channel),displacementMapUv:_t&&b(E.displacementMap.channel),emissiveMapUv:Ee&&b(E.emissiveMap.channel),metalnessMapUv:je&&b(E.metalnessMap.channel),roughnessMapUv:Nt&&b(E.roughnessMap.channel),anisotropyMapUv:Z&&b(E.anisotropyMap.channel),clearcoatMapUv:Ue&&b(E.clearcoatMap.channel),clearcoatNormalMapUv:fe&&b(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&b(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Oe&&b(E.iridescenceMap.channel),iridescenceThicknessMapUv:he&&b(E.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&b(E.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&b(E.sheenRoughnessMap.channel),specularMapUv:Ie&&b(E.specularMap.channel),specularColorMapUv:_e&&b(E.specularColorMap.channel),specularIntensityMapUv:Ne&&b(E.specularIntensityMap.channel),transmissionMapUv:O&&b(E.transmissionMap.channel),thicknessMapUv:de&&b(E.thicknessMap.channel),alphaMapUv:we&&b(E.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(Ae||wt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!ne.attributes.uv&&($e||we),fog:!!te,useFog:E.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Se,skinning:$.isSkinnedMesh===!0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:Re,morphTextureStride:Be,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:qe,decodeVideoTexture:$e&&E.map.isVideoTexture===!0&&ot.getTransfer(E.map.colorSpace)===gt,decodeVideoTextureEmissive:Ee&&E.emissiveMap.isVideoTexture===!0&&ot.getTransfer(E.emissiveMap.colorSpace)===gt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===sn,flipSided:E.side===qt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Te&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Te&&E.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return mt.vertexUv1s=c.has(1),mt.vertexUv2s=c.has(2),mt.vertexUv3s=c.has(3),c.clear(),mt}function p(E){const w=[];if(E.shaderID?w.push(E.shaderID):(w.push(E.customVertexShaderID),w.push(E.customFragmentShaderID)),E.defines!==void 0)for(const N in E.defines)w.push(N),w.push(E.defines[N]);return E.isRawShaderMaterial===!1&&(D(w,E),P(w,E),w.push(i.outputColorSpace)),w.push(E.customProgramCacheKey),w.join()}function D(E,w){E.push(w.precision),E.push(w.outputColorSpace),E.push(w.envMapMode),E.push(w.envMapCubeUVHeight),E.push(w.mapUv),E.push(w.alphaMapUv),E.push(w.lightMapUv),E.push(w.aoMapUv),E.push(w.bumpMapUv),E.push(w.normalMapUv),E.push(w.displacementMapUv),E.push(w.emissiveMapUv),E.push(w.metalnessMapUv),E.push(w.roughnessMapUv),E.push(w.anisotropyMapUv),E.push(w.clearcoatMapUv),E.push(w.clearcoatNormalMapUv),E.push(w.clearcoatRoughnessMapUv),E.push(w.iridescenceMapUv),E.push(w.iridescenceThicknessMapUv),E.push(w.sheenColorMapUv),E.push(w.sheenRoughnessMapUv),E.push(w.specularMapUv),E.push(w.specularColorMapUv),E.push(w.specularIntensityMapUv),E.push(w.transmissionMapUv),E.push(w.thicknessMapUv),E.push(w.combine),E.push(w.fogExp2),E.push(w.sizeAttenuation),E.push(w.morphTargetsCount),E.push(w.morphAttributeCount),E.push(w.numDirLights),E.push(w.numPointLights),E.push(w.numSpotLights),E.push(w.numSpotLightMaps),E.push(w.numHemiLights),E.push(w.numRectAreaLights),E.push(w.numDirLightShadows),E.push(w.numPointLightShadows),E.push(w.numSpotLightShadows),E.push(w.numSpotLightShadowsWithMaps),E.push(w.numLightProbes),E.push(w.shadowMapType),E.push(w.toneMapping),E.push(w.numClippingPlanes),E.push(w.numClipIntersection),E.push(w.depthPacking)}function P(E,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),w.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),E.push(a.mask)}function M(E){const w=_[E.type];let N;if(w){const q=Vn[w];N=Rm.clone(q.uniforms)}else N=E.uniforms;return N}function U(E,w){let N;for(let q=0,$=u.length;q<$;q++){const te=u[q];if(te.cacheKey===w){N=te,++N.usedTimes;break}}return N===void 0&&(N=new kx(i,w,E,r),u.push(N)),N}function L(E){if(--E.usedTimes===0){const w=u.indexOf(E);u[w]=u[u.length-1],u.pop(),E.destroy()}}function k(E){l.remove(E)}function H(){l.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:M,acquireProgram:U,releaseProgram:L,releaseShaderCache:k,programs:u,dispose:H}}function Hx(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Gx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function xh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function bh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,f,m,_,b,v){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:m,groupOrder:_,renderOrder:h.renderOrder,z:b,group:v},i[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=m,p.groupOrder=_,p.renderOrder=h.renderOrder,p.z=b,p.group=v),e++,p}function a(h,f,m,_,b,v){const p=o(h,f,m,_,b,v);m.transmission>0?n.push(p):m.transparent===!0?s.push(p):t.push(p)}function l(h,f,m,_,b,v){const p=o(h,f,m,_,b,v);m.transmission>0?n.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function c(h,f){t.length>1&&t.sort(h||Gx),n.length>1&&n.sort(f||xh),s.length>1&&s.sort(f||xh)}function u(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function Wx(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new bh,i.set(n,[o])):s>=r.length?(o=new bh,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Xx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Ce};break;case"SpotLight":t={position:new F,direction:new F,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":t={color:new Ce,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function qx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let jx=0;function Kx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Yx(i){const e=new Xx,t=qx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);const s=new F,r=new Je,o=new Je;function a(c){let u=0,h=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,_=0,b=0,v=0,p=0,D=0,P=0,M=0,U=0,L=0,k=0;c.sort(Kx);for(let E=0,w=c.length;E<w;E++){const N=c[E],q=N.color,$=N.intensity,te=N.distance,ne=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)u+=q.r*$,h+=q.g*$,f+=q.b*$;else if(N.isLightProbe){for(let J=0;J<9;J++)n.probe[J].addScaledVector(N.sh.coefficients[J],$);k++}else if(N.isDirectionalLight){const J=e.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const ce=N.shadow,Y=t.get(N);Y.shadowIntensity=ce.intensity,Y.shadowBias=ce.bias,Y.shadowNormalBias=ce.normalBias,Y.shadowRadius=ce.radius,Y.shadowMapSize=ce.mapSize,n.directionalShadow[m]=Y,n.directionalShadowMap[m]=ne,n.directionalShadowMatrix[m]=N.shadow.matrix,D++}n.directional[m]=J,m++}else if(N.isSpotLight){const J=e.get(N);J.position.setFromMatrixPosition(N.matrixWorld),J.color.copy(q).multiplyScalar($),J.distance=te,J.coneCos=Math.cos(N.angle),J.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),J.decay=N.decay,n.spot[b]=J;const ce=N.shadow;if(N.map&&(n.spotLightMap[U]=N.map,U++,ce.updateMatrices(N),N.castShadow&&L++),n.spotLightMatrix[b]=ce.matrix,N.castShadow){const Y=t.get(N);Y.shadowIntensity=ce.intensity,Y.shadowBias=ce.bias,Y.shadowNormalBias=ce.normalBias,Y.shadowRadius=ce.radius,Y.shadowMapSize=ce.mapSize,n.spotShadow[b]=Y,n.spotShadowMap[b]=ne,M++}b++}else if(N.isRectAreaLight){const J=e.get(N);J.color.copy(q).multiplyScalar($),J.halfWidth.set(N.width*.5,0,0),J.halfHeight.set(0,N.height*.5,0),n.rectArea[v]=J,v++}else if(N.isPointLight){const J=e.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity),J.distance=N.distance,J.decay=N.decay,N.castShadow){const ce=N.shadow,Y=t.get(N);Y.shadowIntensity=ce.intensity,Y.shadowBias=ce.bias,Y.shadowNormalBias=ce.normalBias,Y.shadowRadius=ce.radius,Y.shadowMapSize=ce.mapSize,Y.shadowCameraNear=ce.camera.near,Y.shadowCameraFar=ce.camera.far,n.pointShadow[_]=Y,n.pointShadowMap[_]=ne,n.pointShadowMatrix[_]=N.shadow.matrix,P++}n.point[_]=J,_++}else if(N.isHemisphereLight){const J=e.get(N);J.skyColor.copy(N.color).multiplyScalar($),J.groundColor.copy(N.groundColor).multiplyScalar($),n.hemi[p]=J,p++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ye.LTC_FLOAT_1,n.rectAreaLTC2=ye.LTC_FLOAT_2):(n.rectAreaLTC1=ye.LTC_HALF_1,n.rectAreaLTC2=ye.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const H=n.hash;(H.directionalLength!==m||H.pointLength!==_||H.spotLength!==b||H.rectAreaLength!==v||H.hemiLength!==p||H.numDirectionalShadows!==D||H.numPointShadows!==P||H.numSpotShadows!==M||H.numSpotMaps!==U||H.numLightProbes!==k)&&(n.directional.length=m,n.spot.length=b,n.rectArea.length=v,n.point.length=_,n.hemi.length=p,n.directionalShadow.length=D,n.directionalShadowMap.length=D,n.pointShadow.length=P,n.pointShadowMap.length=P,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=D,n.pointShadowMatrix.length=P,n.spotLightMatrix.length=M+U-L,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=k,H.directionalLength=m,H.pointLength=_,H.spotLength=b,H.rectAreaLength=v,H.hemiLength=p,H.numDirectionalShadows=D,H.numPointShadows=P,H.numSpotShadows=M,H.numSpotMaps=U,H.numLightProbes=k,n.version=jx++)}function l(c,u){let h=0,f=0,m=0,_=0,b=0;const v=u.matrixWorldInverse;for(let p=0,D=c.length;p<D;p++){const P=c[p];if(P.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(v),h++}else if(P.isSpotLight){const M=n.spot[m];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(v),M.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(v),m++}else if(P.isRectAreaLight){const M=n.rectArea[_];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(v),o.identity(),r.copy(P.matrixWorld),r.premultiply(v),o.extractRotation(r),M.halfWidth.set(P.width*.5,0,0),M.halfHeight.set(0,P.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),_++}else if(P.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(v),f++}else if(P.isHemisphereLight){const M=n.hemi[b];M.direction.setFromMatrixPosition(P.matrixWorld),M.direction.transformDirection(v),b++}}}return{setup:a,setupView:l,state:n}}function yh(i){const e=new Yx(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function $x(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new yh(i),e.set(s,[a])):r>=o.length?(a=new yh(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Zx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Qx(i,e,t){let n=new Tc;const s=new Me,r=new Me,o=new at,a=new Km({depthPacking:Np}),l=new Ym,c={},u=t.maxTextureSize,h={[Xn]:qt,[qt]:Xn,[sn]:sn},f=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:Zx,fragmentShader:Jx}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new kn;_.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Et(_,f),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sd;let p=this.type;this.render=function(L,k,H){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||L.length===0)return;const E=i.getRenderTarget(),w=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),q=i.state;q.setBlending(hi),q.buffers.depth.getReversed()===!0?q.buffers.color.setClear(0,0,0,0):q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);const $=p!==ai&&this.type===ai,te=p===ai&&this.type!==ai;for(let ne=0,J=L.length;ne<J;ne++){const ce=L[ne],Y=ce.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const pe=Y.getFrameExtents();if(s.multiply(pe),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/pe.x),s.x=r.x*pe.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/pe.y),s.y=r.y*pe.y,Y.mapSize.y=r.y)),Y.map===null||$===!0||te===!0){const Re=this.type!==ai?{minFilter:jt,magFilter:jt}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Nn(s.x,s.y,Re),Y.map.texture.name=ce.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const be=Y.getViewportCount();for(let Re=0;Re<be;Re++){const Be=Y.getViewport(Re);o.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),q.viewport(o),Y.updateMatrices(ce,Re),n=Y.getFrustum(),M(k,H,Y.camera,ce,this.type)}Y.isPointLightShadow!==!0&&this.type===ai&&D(Y,H),Y.needsUpdate=!1}p=this.type,v.needsUpdate=!1,i.setRenderTarget(E,w,N)};function D(L,k){const H=e.update(b);f.defines.VSM_SAMPLES!==L.blurSamples&&(f.defines.VSM_SAMPLES=L.blurSamples,m.defines.VSM_SAMPLES=L.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Nn(s.x,s.y)),f.uniforms.shadow_pass.value=L.map.texture,f.uniforms.resolution.value=L.mapSize,f.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(k,null,H,f,b,null),m.uniforms.shadow_pass.value=L.mapPass.texture,m.uniforms.resolution.value=L.mapSize,m.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(k,null,H,m,b,null)}function P(L,k,H,E){let w=null;const N=H.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(N!==void 0)w=N;else if(w=H.isPointLight===!0?l:a,i.localClippingEnabled&&k.clipShadows===!0&&Array.isArray(k.clippingPlanes)&&k.clippingPlanes.length!==0||k.displacementMap&&k.displacementScale!==0||k.alphaMap&&k.alphaTest>0||k.map&&k.alphaTest>0||k.alphaToCoverage===!0){const q=w.uuid,$=k.uuid;let te=c[q];te===void 0&&(te={},c[q]=te);let ne=te[$];ne===void 0&&(ne=w.clone(),te[$]=ne,k.addEventListener("dispose",U)),w=ne}if(w.visible=k.visible,w.wireframe=k.wireframe,E===ai?w.side=k.shadowSide!==null?k.shadowSide:k.side:w.side=k.shadowSide!==null?k.shadowSide:h[k.side],w.alphaMap=k.alphaMap,w.alphaTest=k.alphaToCoverage===!0?.5:k.alphaTest,w.map=k.map,w.clipShadows=k.clipShadows,w.clippingPlanes=k.clippingPlanes,w.clipIntersection=k.clipIntersection,w.displacementMap=k.displacementMap,w.displacementScale=k.displacementScale,w.displacementBias=k.displacementBias,w.wireframeLinewidth=k.wireframeLinewidth,w.linewidth=k.linewidth,H.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const q=i.properties.get(w);q.light=H}return w}function M(L,k,H,E,w){if(L.visible===!1)return;if(L.layers.test(k.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&w===ai)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,L.matrixWorld);const $=e.update(L),te=L.material;if(Array.isArray(te)){const ne=$.groups;for(let J=0,ce=ne.length;J<ce;J++){const Y=ne[J],pe=te[Y.materialIndex];if(pe&&pe.visible){const be=P(L,pe,E,w);L.onBeforeShadow(i,L,k,H,$,be,Y),i.renderBufferDirect(H,null,$,be,L,Y),L.onAfterShadow(i,L,k,H,$,be,Y)}}}else if(te.visible){const ne=P(L,te,E,w);L.onBeforeShadow(i,L,k,H,$,ne,null),i.renderBufferDirect(H,null,$,ne,L,null),L.onAfterShadow(i,L,k,H,$,ne,null)}}const q=L.children;for(let $=0,te=q.length;$<te;$++)M(q[$],k,H,E,w)}function U(L){L.target.removeEventListener("dispose",U);for(const H in c){const E=c[H],w=L.target.uuid;w in E&&(E[w].dispose(),delete E[w])}}}const eb={[ul]:hl,[dl]:ml,[fl]:gl,[Os]:pl,[hl]:ul,[ml]:dl,[gl]:fl,[pl]:Os};function tb(i,e){function t(){let O=!1;const de=new at;let X=null;const we=new at(0,0,0,0);return{setMask:function(le){X!==le&&!O&&(i.colorMask(le,le,le,le),X=le)},setLocked:function(le){O=le},setClear:function(le,ie,Te,qe,mt){mt===!0&&(le*=qe,ie*=qe,Te*=qe),de.set(le,ie,Te,qe),we.equals(de)===!1&&(i.clearColor(le,ie,Te,qe),we.copy(de))},reset:function(){O=!1,X=null,we.set(-1,0,0,0)}}}function n(){let O=!1,de=!1,X=null,we=null,le=null;return{setReversed:function(ie){if(de!==ie){const Te=e.get("EXT_clip_control");ie?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),de=ie;const qe=le;le=null,this.setClear(qe)}},getReversed:function(){return de},setTest:function(ie){ie?se(i.DEPTH_TEST):Se(i.DEPTH_TEST)},setMask:function(ie){X!==ie&&!O&&(i.depthMask(ie),X=ie)},setFunc:function(ie){if(de&&(ie=eb[ie]),we!==ie){switch(ie){case ul:i.depthFunc(i.NEVER);break;case hl:i.depthFunc(i.ALWAYS);break;case dl:i.depthFunc(i.LESS);break;case Os:i.depthFunc(i.LEQUAL);break;case fl:i.depthFunc(i.EQUAL);break;case pl:i.depthFunc(i.GEQUAL);break;case ml:i.depthFunc(i.GREATER);break;case gl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=ie}},setLocked:function(ie){O=ie},setClear:function(ie){le!==ie&&(de&&(ie=1-ie),i.clearDepth(ie),le=ie)},reset:function(){O=!1,X=null,we=null,le=null,de=!1}}}function s(){let O=!1,de=null,X=null,we=null,le=null,ie=null,Te=null,qe=null,mt=null;return{setTest:function(ct){O||(ct?se(i.STENCIL_TEST):Se(i.STENCIL_TEST))},setMask:function(ct){de!==ct&&!O&&(i.stencilMask(ct),de=ct)},setFunc:function(ct,Mn,mn){(X!==ct||we!==Mn||le!==mn)&&(i.stencilFunc(ct,Mn,mn),X=ct,we=Mn,le=mn)},setOp:function(ct,Mn,mn){(ie!==ct||Te!==Mn||qe!==mn)&&(i.stencilOp(ct,Mn,mn),ie=ct,Te=Mn,qe=mn)},setLocked:function(ct){O=ct},setClear:function(ct){mt!==ct&&(i.clearStencil(ct),mt=ct)},reset:function(){O=!1,de=null,X=null,we=null,le=null,ie=null,Te=null,qe=null,mt=null}}}const r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,m=[],_=null,b=!1,v=null,p=null,D=null,P=null,M=null,U=null,L=null,k=new Ce(0,0,0),H=0,E=!1,w=null,N=null,q=null,$=null,te=null;const ne=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,ce=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(Y)[1]),J=ce>=1):Y.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),J=ce>=2);let pe=null,be={};const Re=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),it=new at().fromArray(Re),ht=new at().fromArray(Be);function Qe(O,de,X,we){const le=new Uint8Array(4),ie=i.createTexture();i.bindTexture(O,ie),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Te=0;Te<X;Te++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,le):i.texImage2D(de+Te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,le);return ie}const j={};j[i.TEXTURE_2D]=Qe(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=Qe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=Qe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=Qe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(i.DEPTH_TEST),o.setFunc(Os),He(!1),Ae(lu),se(i.CULL_FACE),vt(hi);function se(O){u[O]!==!0&&(i.enable(O),u[O]=!0)}function Se(O){u[O]!==!1&&(i.disable(O),u[O]=!1)}function ze(O,de){return h[O]!==de?(i.bindFramebuffer(O,de),h[O]=de,O===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=de),O===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=de),!0):!1}function Le(O,de){let X=m,we=!1;if(O){X=f.get(de),X===void 0&&(X=[],f.set(de,X));const le=O.textures;if(X.length!==le.length||X[0]!==i.COLOR_ATTACHMENT0){for(let ie=0,Te=le.length;ie<Te;ie++)X[ie]=i.COLOR_ATTACHMENT0+ie;X.length=le.length,we=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,we=!0);we&&i.drawBuffers(X)}function $e(O){return _!==O?(i.useProgram(O),_=O,!0):!1}const Ot={[Ki]:i.FUNC_ADD,[sp]:i.FUNC_SUBTRACT,[rp]:i.FUNC_REVERSE_SUBTRACT};Ot[op]=i.MIN,Ot[ap]=i.MAX;const I={[lp]:i.ZERO,[cp]:i.ONE,[up]:i.SRC_COLOR,[ll]:i.SRC_ALPHA,[gp]:i.SRC_ALPHA_SATURATE,[pp]:i.DST_COLOR,[dp]:i.DST_ALPHA,[hp]:i.ONE_MINUS_SRC_COLOR,[cl]:i.ONE_MINUS_SRC_ALPHA,[mp]:i.ONE_MINUS_DST_COLOR,[fp]:i.ONE_MINUS_DST_ALPHA,[vp]:i.CONSTANT_COLOR,[_p]:i.ONE_MINUS_CONSTANT_COLOR,[xp]:i.CONSTANT_ALPHA,[bp]:i.ONE_MINUS_CONSTANT_ALPHA};function vt(O,de,X,we,le,ie,Te,qe,mt,ct){if(O===hi){b===!0&&(Se(i.BLEND),b=!1);return}if(b===!1&&(se(i.BLEND),b=!0),O!==ip){if(O!==v||ct!==E){if((p!==Ki||M!==Ki)&&(i.blendEquation(i.FUNC_ADD),p=Ki,M=Ki),ct)switch(O){case Rs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cu:i.blendFunc(i.ONE,i.ONE);break;case uu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Rs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cu:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case uu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}D=null,P=null,U=null,L=null,k.set(0,0,0),H=0,v=O,E=ct}return}le=le||de,ie=ie||X,Te=Te||we,(de!==p||le!==M)&&(i.blendEquationSeparate(Ot[de],Ot[le]),p=de,M=le),(X!==D||we!==P||ie!==U||Te!==L)&&(i.blendFuncSeparate(I[X],I[we],I[ie],I[Te]),D=X,P=we,U=ie,L=Te),(qe.equals(k)===!1||mt!==H)&&(i.blendColor(qe.r,qe.g,qe.b,mt),k.copy(qe),H=mt),v=O,E=!1}function Xe(O,de){O.side===sn?Se(i.CULL_FACE):se(i.CULL_FACE);let X=O.side===qt;de&&(X=!X),He(X),O.blending===Rs&&O.transparent===!1?vt(hi):vt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);const we=O.stencilWrite;a.setTest(we),we&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Ee(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):Se(i.SAMPLE_ALPHA_TO_COVERAGE)}function He(O){w!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),w=O)}function Ae(O){O!==ep?(se(i.CULL_FACE),O!==N&&(O===lu?i.cullFace(i.BACK):O===tp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Se(i.CULL_FACE),N=O}function _t(O){O!==q&&(J&&i.lineWidth(O),q=O)}function Ee(O,de,X){O?(se(i.POLYGON_OFFSET_FILL),($!==de||te!==X)&&(i.polygonOffset(de,X),$=de,te=X)):Se(i.POLYGON_OFFSET_FILL)}function je(O){O?se(i.SCISSOR_TEST):Se(i.SCISSOR_TEST)}function Nt(O){O===void 0&&(O=i.TEXTURE0+ne-1),pe!==O&&(i.activeTexture(O),pe=O)}function wt(O,de,X){X===void 0&&(pe===null?X=i.TEXTURE0+ne-1:X=pe);let we=be[X];we===void 0&&(we={type:void 0,texture:void 0},be[X]=we),(we.type!==O||we.texture!==de)&&(pe!==X&&(i.activeTexture(X),pe=X),i.bindTexture(O,de||j[O]),we.type=O,we.texture=de)}function R(){const O=be[pe];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function G(){try{i.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ee(){try{i.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function oe(){try{i.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ue(){try{i.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function fe(){try{i.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function De(){try{i.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Oe(){try{i.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function he(){try{i.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ve(O){it.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),it.copy(O))}function Pe(O){ht.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),ht.copy(O))}function Ie(O,de){let X=c.get(de);X===void 0&&(X=new WeakMap,c.set(de,X));let we=X.get(O);we===void 0&&(we=i.getUniformBlockIndex(de,O.name),X.set(O,we))}function _e(O,de){const we=c.get(de).get(O);l.get(de)!==we&&(i.uniformBlockBinding(de,we,O.__bindingPointIndex),l.set(de,we))}function Ne(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},pe=null,be={},h={},f=new WeakMap,m=[],_=null,b=!1,v=null,p=null,D=null,P=null,M=null,U=null,L=null,k=new Ce(0,0,0),H=0,E=!1,w=null,N=null,q=null,$=null,te=null,it.set(0,0,i.canvas.width,i.canvas.height),ht.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:Se,bindFramebuffer:ze,drawBuffers:Le,useProgram:$e,setBlending:vt,setMaterial:Xe,setFlipSided:He,setCullFace:Ae,setLineWidth:_t,setPolygonOffset:Ee,setScissorTest:je,activeTexture:Nt,bindTexture:wt,unbindTexture:R,compressedTexImage2D:y,compressedTexImage3D:G,texImage2D:Oe,texImage3D:he,updateUBOMapping:Ie,uniformBlockBinding:_e,texStorage2D:fe,texStorage3D:De,texSubImage2D:ee,texSubImage3D:oe,compressedTexSubImage2D:Z,compressedTexSubImage3D:Ue,scissor:ve,viewport:Pe,reset:Ne}}function nb(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,y){return m?new OffscreenCanvas(R,y):Mr("canvas")}function b(R,y,G){let ee=1;const oe=wt(R);if((oe.width>G||oe.height>G)&&(ee=G/Math.max(oe.width,oe.height)),ee<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor(ee*oe.width),Ue=Math.floor(ee*oe.height);h===void 0&&(h=_(Z,Ue));const fe=y?_(Z,Ue):h;return fe.width=Z,fe.height=Ue,fe.getContext("2d").drawImage(R,0,0,Z,Ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+Z+"x"+Ue+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),R;return R}function v(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function D(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function P(R,y,G,ee,oe=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=y;if(y===i.RED&&(G===i.FLOAT&&(Z=i.R32F),G===i.HALF_FLOAT&&(Z=i.R16F),G===i.UNSIGNED_BYTE&&(Z=i.R8)),y===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.R8UI),G===i.UNSIGNED_SHORT&&(Z=i.R16UI),G===i.UNSIGNED_INT&&(Z=i.R32UI),G===i.BYTE&&(Z=i.R8I),G===i.SHORT&&(Z=i.R16I),G===i.INT&&(Z=i.R32I)),y===i.RG&&(G===i.FLOAT&&(Z=i.RG32F),G===i.HALF_FLOAT&&(Z=i.RG16F),G===i.UNSIGNED_BYTE&&(Z=i.RG8)),y===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RG8UI),G===i.UNSIGNED_SHORT&&(Z=i.RG16UI),G===i.UNSIGNED_INT&&(Z=i.RG32UI),G===i.BYTE&&(Z=i.RG8I),G===i.SHORT&&(Z=i.RG16I),G===i.INT&&(Z=i.RG32I)),y===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),G===i.UNSIGNED_INT&&(Z=i.RGB32UI),G===i.BYTE&&(Z=i.RGB8I),G===i.SHORT&&(Z=i.RGB16I),G===i.INT&&(Z=i.RGB32I)),y===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),G===i.UNSIGNED_INT&&(Z=i.RGBA32UI),G===i.BYTE&&(Z=i.RGBA8I),G===i.SHORT&&(Z=i.RGBA16I),G===i.INT&&(Z=i.RGBA32I)),y===i.RGB&&(G===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),y===i.RGBA){const Ue=oe?Go:ot.getTransfer(ee);G===i.FLOAT&&(Z=i.RGBA32F),G===i.HALF_FLOAT&&(Z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Z=Ue===gt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function M(R,y){let G;return R?y===null||y===qn||y===Bs?G=i.DEPTH24_STENCIL8:y===rn?G=i.DEPTH32F_STENCIL8:y===br&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===qn||y===Bs?G=i.DEPTH_COMPONENT24:y===rn?G=i.DEPTH_COMPONENT32F:y===br&&(G=i.DEPTH_COMPONENT16),G}function U(R,y){return v(R)===!0||R.isFramebufferTexture&&R.minFilter!==jt&&R.minFilter!==Pt?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function L(R){const y=R.target;y.removeEventListener("dispose",L),H(y),y.isVideoTexture&&u.delete(y)}function k(R){const y=R.target;y.removeEventListener("dispose",k),w(y)}function H(R){const y=n.get(R);if(y.__webglInit===void 0)return;const G=R.source,ee=f.get(G);if(ee){const oe=ee[y.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&E(R),Object.keys(ee).length===0&&f.delete(G)}n.remove(R)}function E(R){const y=n.get(R);i.deleteTexture(y.__webglTexture);const G=R.source,ee=f.get(G);delete ee[y.__cacheKey],o.memory.textures--}function w(R){const y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(y.__webglFramebuffer[ee]))for(let oe=0;oe<y.__webglFramebuffer[ee].length;oe++)i.deleteFramebuffer(y.__webglFramebuffer[ee][oe]);else i.deleteFramebuffer(y.__webglFramebuffer[ee]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[ee])}else{if(Array.isArray(y.__webglFramebuffer))for(let ee=0;ee<y.__webglFramebuffer.length;ee++)i.deleteFramebuffer(y.__webglFramebuffer[ee]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let ee=0;ee<y.__webglColorRenderbuffer.length;ee++)y.__webglColorRenderbuffer[ee]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[ee]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const G=R.textures;for(let ee=0,oe=G.length;ee<oe;ee++){const Z=n.get(G[ee]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(G[ee])}n.remove(R)}let N=0;function q(){N=0}function $(){const R=N;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),N+=1,R}function te(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function ne(R,y){const G=n.get(R);if(R.isVideoTexture&&je(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&G.__version!==R.version){const ee=R.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(G,R,y);return}}else R.isExternalTexture&&(G.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+y)}function J(R,y){const G=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){j(G,R,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+y)}function ce(R,y){const G=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){j(G,R,y);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+y)}function Y(R,y){const G=n.get(R);if(R.version>0&&G.__version!==R.version){se(G,R,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+y)}const pe={[Fs]:i.REPEAT,[yn]:i.CLAMP_TO_EDGE,[Vo]:i.MIRRORED_REPEAT},be={[jt]:i.NEAREST,[ad]:i.NEAREST_MIPMAP_NEAREST,[pr]:i.NEAREST_MIPMAP_LINEAR,[Pt]:i.LINEAR,[Lo]:i.LINEAR_MIPMAP_NEAREST,[In]:i.LINEAR_MIPMAP_LINEAR},Re={[Fp]:i.NEVER,[Wp]:i.ALWAYS,[Bp]:i.LESS,[vd]:i.LEQUAL,[zp]:i.EQUAL,[Gp]:i.GEQUAL,[Vp]:i.GREATER,[Hp]:i.NOTEQUAL};function Be(R,y){if(y.type===rn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Pt||y.magFilter===Lo||y.magFilter===pr||y.magFilter===In||y.minFilter===Pt||y.minFilter===Lo||y.minFilter===pr||y.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,pe[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,pe[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,pe[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,be[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,be[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Re[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===jt||y.minFilter!==pr&&y.minFilter!==In||y.type===rn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function it(R,y){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",L));const ee=y.source;let oe=f.get(ee);oe===void 0&&(oe={},f.set(ee,oe));const Z=te(y);if(Z!==R.__cacheKey){oe[Z]===void 0&&(oe[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),oe[Z].usedTimes++;const Ue=oe[R.__cacheKey];Ue!==void 0&&(oe[R.__cacheKey].usedTimes--,Ue.usedTimes===0&&E(y)),R.__cacheKey=Z,R.__webglTexture=oe[Z].texture}return G}function ht(R,y,G){return Math.floor(Math.floor(R/G)/y)}function Qe(R,y,G,ee){const Z=R.updateRanges;if(Z.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,G,ee,y.data);else{Z.sort((he,ve)=>he.start-ve.start);let Ue=0;for(let he=1;he<Z.length;he++){const ve=Z[Ue],Pe=Z[he],Ie=ve.start+ve.count,_e=ht(Pe.start,y.width,4),Ne=ht(ve.start,y.width,4);Pe.start<=Ie+1&&_e===Ne&&ht(Pe.start+Pe.count-1,y.width,4)===_e?ve.count=Math.max(ve.count,Pe.start+Pe.count-ve.start):(++Ue,Z[Ue]=Pe)}Z.length=Ue+1;const fe=i.getParameter(i.UNPACK_ROW_LENGTH),De=i.getParameter(i.UNPACK_SKIP_PIXELS),Oe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let he=0,ve=Z.length;he<ve;he++){const Pe=Z[he],Ie=Math.floor(Pe.start/4),_e=Math.ceil(Pe.count/4),Ne=Ie%y.width,O=Math.floor(Ie/y.width),de=_e,X=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ne),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),t.texSubImage2D(i.TEXTURE_2D,0,Ne,O,de,X,G,ee,y.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,fe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,De),i.pixelStorei(i.UNPACK_SKIP_ROWS,Oe)}}function j(R,y,G){let ee=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(ee=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(ee=i.TEXTURE_3D);const oe=it(R,y),Z=y.source;t.bindTexture(ee,R.__webglTexture,i.TEXTURE0+G);const Ue=n.get(Z);if(Z.version!==Ue.__version||oe===!0){t.activeTexture(i.TEXTURE0+G);const fe=ot.getPrimaries(ot.workingColorSpace),De=y.colorSpace===Di?null:ot.getPrimaries(y.colorSpace),Oe=y.colorSpace===Di||fe===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);let he=b(y.image,!1,s.maxTextureSize);he=Nt(y,he);const ve=r.convert(y.format,y.colorSpace),Pe=r.convert(y.type);let Ie=P(y.internalFormat,ve,Pe,y.colorSpace,y.isVideoTexture);Be(ee,y);let _e;const Ne=y.mipmaps,O=y.isVideoTexture!==!0,de=Ue.__version===void 0||oe===!0,X=Z.dataReady,we=U(y,he);if(y.isDepthTexture)Ie=M(y.format===zs,y.type),de&&(O?t.texStorage2D(i.TEXTURE_2D,1,Ie,he.width,he.height):t.texImage2D(i.TEXTURE_2D,0,Ie,he.width,he.height,0,ve,Pe,null));else if(y.isDataTexture)if(Ne.length>0){O&&de&&t.texStorage2D(i.TEXTURE_2D,we,Ie,Ne[0].width,Ne[0].height);for(let le=0,ie=Ne.length;le<ie;le++)_e=Ne[le],O?X&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,_e.width,_e.height,ve,Pe,_e.data):t.texImage2D(i.TEXTURE_2D,le,Ie,_e.width,_e.height,0,ve,Pe,_e.data);y.generateMipmaps=!1}else O?(de&&t.texStorage2D(i.TEXTURE_2D,we,Ie,he.width,he.height),X&&Qe(y,he,ve,Pe)):t.texImage2D(i.TEXTURE_2D,0,Ie,he.width,he.height,0,ve,Pe,he.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){O&&de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ie,Ne[0].width,Ne[0].height,he.depth);for(let le=0,ie=Ne.length;le<ie;le++)if(_e=Ne[le],y.format!==Xt)if(ve!==null)if(O){if(X)if(y.layerUpdates.size>0){const Te=Zu(_e.width,_e.height,y.format,y.type);for(const qe of y.layerUpdates){const mt=_e.data.subarray(qe*Te/_e.data.BYTES_PER_ELEMENT,(qe+1)*Te/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,qe,_e.width,_e.height,1,ve,mt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,_e.width,_e.height,he.depth,ve,_e.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,le,Ie,_e.width,_e.height,he.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?X&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,_e.width,_e.height,he.depth,ve,Pe,_e.data):t.texImage3D(i.TEXTURE_2D_ARRAY,le,Ie,_e.width,_e.height,he.depth,0,ve,Pe,_e.data)}else{O&&de&&t.texStorage2D(i.TEXTURE_2D,we,Ie,Ne[0].width,Ne[0].height);for(let le=0,ie=Ne.length;le<ie;le++)_e=Ne[le],y.format!==Xt?ve!==null?O?X&&t.compressedTexSubImage2D(i.TEXTURE_2D,le,0,0,_e.width,_e.height,ve,_e.data):t.compressedTexImage2D(i.TEXTURE_2D,le,Ie,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?X&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,_e.width,_e.height,ve,Pe,_e.data):t.texImage2D(i.TEXTURE_2D,le,Ie,_e.width,_e.height,0,ve,Pe,_e.data)}else if(y.isDataArrayTexture)if(O){if(de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ie,he.width,he.height,he.depth),X)if(y.layerUpdates.size>0){const le=Zu(he.width,he.height,y.format,y.type);for(const ie of y.layerUpdates){const Te=he.data.subarray(ie*le/he.data.BYTES_PER_ELEMENT,(ie+1)*le/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,he.width,he.height,1,ve,Pe,Te)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,ve,Pe,he.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ie,he.width,he.height,he.depth,0,ve,Pe,he.data);else if(y.isData3DTexture)O?(de&&t.texStorage3D(i.TEXTURE_3D,we,Ie,he.width,he.height,he.depth),X&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,ve,Pe,he.data)):t.texImage3D(i.TEXTURE_3D,0,Ie,he.width,he.height,he.depth,0,ve,Pe,he.data);else if(y.isFramebufferTexture){if(de)if(O)t.texStorage2D(i.TEXTURE_2D,we,Ie,he.width,he.height);else{let le=he.width,ie=he.height;for(let Te=0;Te<we;Te++)t.texImage2D(i.TEXTURE_2D,Te,Ie,le,ie,0,ve,Pe,null),le>>=1,ie>>=1}}else if(Ne.length>0){if(O&&de){const le=wt(Ne[0]);t.texStorage2D(i.TEXTURE_2D,we,Ie,le.width,le.height)}for(let le=0,ie=Ne.length;le<ie;le++)_e=Ne[le],O?X&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,ve,Pe,_e):t.texImage2D(i.TEXTURE_2D,le,Ie,ve,Pe,_e);y.generateMipmaps=!1}else if(O){if(de){const le=wt(he);t.texStorage2D(i.TEXTURE_2D,we,Ie,le.width,le.height)}X&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Pe,he)}else t.texImage2D(i.TEXTURE_2D,0,Ie,ve,Pe,he);v(y)&&p(ee),Ue.__version=Z.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function se(R,y,G){if(y.image.length!==6)return;const ee=it(R,y),oe=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);const Z=n.get(oe);if(oe.version!==Z.__version||ee===!0){t.activeTexture(i.TEXTURE0+G);const Ue=ot.getPrimaries(ot.workingColorSpace),fe=y.colorSpace===Di?null:ot.getPrimaries(y.colorSpace),De=y.colorSpace===Di||Ue===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const Oe=y.isCompressedTexture||y.image[0].isCompressedTexture,he=y.image[0]&&y.image[0].isDataTexture,ve=[];for(let ie=0;ie<6;ie++)!Oe&&!he?ve[ie]=b(y.image[ie],!0,s.maxCubemapSize):ve[ie]=he?y.image[ie].image:y.image[ie],ve[ie]=Nt(y,ve[ie]);const Pe=ve[0],Ie=r.convert(y.format,y.colorSpace),_e=r.convert(y.type),Ne=P(y.internalFormat,Ie,_e,y.colorSpace),O=y.isVideoTexture!==!0,de=Z.__version===void 0||ee===!0,X=oe.dataReady;let we=U(y,Pe);Be(i.TEXTURE_CUBE_MAP,y);let le;if(Oe){O&&de&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Ne,Pe.width,Pe.height);for(let ie=0;ie<6;ie++){le=ve[ie].mipmaps;for(let Te=0;Te<le.length;Te++){const qe=le[Te];y.format!==Xt?Ie!==null?O?X&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,0,0,qe.width,qe.height,Ie,qe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,Ne,qe.width,qe.height,0,qe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?X&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,0,0,qe.width,qe.height,Ie,_e,qe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te,Ne,qe.width,qe.height,0,Ie,_e,qe.data)}}}else{if(le=y.mipmaps,O&&de){le.length>0&&we++;const ie=wt(ve[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Ne,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(he){O?X&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ve[ie].width,ve[ie].height,Ie,_e,ve[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Ne,ve[ie].width,ve[ie].height,0,Ie,_e,ve[ie].data);for(let Te=0;Te<le.length;Te++){const mt=le[Te].image[ie].image;O?X&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,0,0,mt.width,mt.height,Ie,_e,mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,Ne,mt.width,mt.height,0,Ie,_e,mt.data)}}else{O?X&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ie,_e,ve[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Ne,Ie,_e,ve[ie]);for(let Te=0;Te<le.length;Te++){const qe=le[Te];O?X&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,0,0,Ie,_e,qe.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te+1,Ne,Ie,_e,qe.image[ie])}}}v(y)&&p(i.TEXTURE_CUBE_MAP),Z.__version=oe.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Se(R,y,G,ee,oe,Z){const Ue=r.convert(G.format,G.colorSpace),fe=r.convert(G.type),De=P(G.internalFormat,Ue,fe,G.colorSpace),Oe=n.get(y),he=n.get(G);if(he.__renderTarget=y,!Oe.__hasExternalTextures){const ve=Math.max(1,y.width>>Z),Pe=Math.max(1,y.height>>Z);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,Z,De,ve,Pe,y.depth,0,Ue,fe,null):t.texImage2D(oe,Z,De,ve,Pe,0,Ue,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),Ee(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,oe,he.__webglTexture,0,_t(y)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ee,oe,he.__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(R,y,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){const ee=y.depthTexture,oe=ee&&ee.isDepthTexture?ee.type:null,Z=M(y.stencilBuffer,oe),Ue=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=_t(y);Ee(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,Z,y.width,y.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,Z,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Z,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ue,i.RENDERBUFFER,R)}else{const ee=y.textures;for(let oe=0;oe<ee.length;oe++){const Z=ee[oe],Ue=r.convert(Z.format,Z.colorSpace),fe=r.convert(Z.type),De=P(Z.internalFormat,Ue,fe,Z.colorSpace),Oe=_t(y);G&&Ee(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,De,y.width,y.height):Ee(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Oe,De,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,De,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=n.get(y.depthTexture);ee.__renderTarget=y,(!ee.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),ne(y.depthTexture,0);const oe=ee.__webglTexture,Z=_t(y);if(y.depthTexture.format===yr)Ee(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0);else if(y.depthTexture.format===zs)Ee(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function $e(R){const y=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){const ee=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),ee){const oe=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,ee.removeEventListener("dispose",oe)};ee.addEventListener("dispose",oe),y.__depthDisposeCallback=oe}y.__boundDepthTexture=ee}if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const ee=R.texture.mipmaps;ee&&ee.length>0?Le(y.__webglFramebuffer[0],R):Le(y.__webglFramebuffer,R)}else if(G){y.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[ee]),y.__webglDepthbuffer[ee]===void 0)y.__webglDepthbuffer[ee]=i.createRenderbuffer(),ze(y.__webglDepthbuffer[ee],R,!1);else{const oe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer[ee];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,Z)}}else{const ee=R.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),ze(y.__webglDepthbuffer,R,!1);else{const oe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,Z)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(R,y,G){const ee=n.get(R);y!==void 0&&Se(ee.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&$e(R)}function I(R){const y=R.texture,G=n.get(R),ee=n.get(y);R.addEventListener("dispose",k);const oe=R.textures,Z=R.isWebGLCubeRenderTarget===!0,Ue=oe.length>1;if(Ue||(ee.__webglTexture===void 0&&(ee.__webglTexture=i.createTexture()),ee.__version=y.version,o.memory.textures++),Z){G.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer[fe]=[];for(let De=0;De<y.mipmaps.length;De++)G.__webglFramebuffer[fe][De]=i.createFramebuffer()}else G.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer=[];for(let fe=0;fe<y.mipmaps.length;fe++)G.__webglFramebuffer[fe]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Ue)for(let fe=0,De=oe.length;fe<De;fe++){const Oe=n.get(oe[fe]);Oe.__webglTexture===void 0&&(Oe.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Ee(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let fe=0;fe<oe.length;fe++){const De=oe[fe];G.__webglColorRenderbuffer[fe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[fe]);const Oe=r.convert(De.format,De.colorSpace),he=r.convert(De.type),ve=P(De.internalFormat,Oe,he,De.colorSpace,R.isXRRenderTarget===!0),Pe=_t(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,ve,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,G.__webglColorRenderbuffer[fe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),ze(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture),Be(i.TEXTURE_CUBE_MAP,y);for(let fe=0;fe<6;fe++)if(y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Se(G.__webglFramebuffer[fe][De],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,De);else Se(G.__webglFramebuffer[fe],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);v(y)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ue){for(let fe=0,De=oe.length;fe<De;fe++){const Oe=oe[fe],he=n.get(Oe);let ve=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ve=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ve,he.__webglTexture),Be(ve,Oe),Se(G.__webglFramebuffer,R,Oe,i.COLOR_ATTACHMENT0+fe,ve,0),v(Oe)&&p(ve)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,ee.__webglTexture),Be(fe,y),y.mipmaps&&y.mipmaps.length>0)for(let De=0;De<y.mipmaps.length;De++)Se(G.__webglFramebuffer[De],R,y,i.COLOR_ATTACHMENT0,fe,De);else Se(G.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,fe,0);v(y)&&p(fe),t.unbindTexture()}R.depthBuffer&&$e(R)}function vt(R){const y=R.textures;for(let G=0,ee=y.length;G<ee;G++){const oe=y[G];if(v(oe)){const Z=D(R),Ue=n.get(oe).__webglTexture;t.bindTexture(Z,Ue),p(Z),t.unbindTexture()}}}const Xe=[],He=[];function Ae(R){if(R.samples>0){if(Ee(R)===!1){const y=R.textures,G=R.width,ee=R.height;let oe=i.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ue=n.get(R),fe=y.length>1;if(fe)for(let Oe=0;Oe<y.length;Oe++)t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer);const De=R.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer);for(let Oe=0;Oe<y.length;Oe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),fe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ue.__webglColorRenderbuffer[Oe]);const he=n.get(y[Oe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,he,0)}i.blitFramebuffer(0,0,G,ee,0,0,G,ee,oe,i.NEAREST),l===!0&&(Xe.length=0,He.length=0,Xe.push(i.COLOR_ATTACHMENT0+Oe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Xe.push(Z),He.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,He)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Xe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),fe)for(let Oe=0;Oe<y.length;Oe++){t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,Ue.__webglColorRenderbuffer[Oe]);const he=n.get(y[Oe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,he,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function _t(R){return Math.min(s.maxSamples,R.samples)}function Ee(R){const y=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function je(R){const y=o.render.frame;u.get(R)!==y&&(u.set(R,y),R.update())}function Nt(R,y){const G=R.colorSpace,ee=R.format,oe=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==It&&G!==Di&&(ot.getTransfer(G)===gt?(ee!==Xt||oe!==ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),y}function wt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=q,this.setTexture2D=ne,this.setTexture2DArray=J,this.setTexture3D=ce,this.setTextureCube=Y,this.rebindTextures=Ot,this.setupRenderTarget=I,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ee}function ib(i,e){function t(n,s=Di){let r;const o=ot.getTransfer(s);if(n===ln)return i.UNSIGNED_BYTE;if(n===fc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===pc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ud)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ld)return i.BYTE;if(n===cd)return i.SHORT;if(n===br)return i.UNSIGNED_SHORT;if(n===dc)return i.INT;if(n===qn)return i.UNSIGNED_INT;if(n===rn)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===dd)return i.ALPHA;if(n===fd)return i.RGB;if(n===Xt)return i.RGBA;if(n===yr)return i.DEPTH_COMPONENT;if(n===zs)return i.DEPTH_STENCIL;if(n===Zi)return i.RED;if(n===mc)return i.RED_INTEGER;if(n===Yi)return i.RG;if(n===gc)return i.RG_INTEGER;if(n===vc)return i.RGBA_INTEGER;if(n===Uo||n===Oo||n===No||n===ko)if(o===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Uo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Oo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Uo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Oo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ko)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===xl||n===bl||n===yl||n===Sl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===xl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===yl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===wl||n===Ml||n===El)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===wl||n===Ml)return o===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===El)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Tl||n===Cl||n===Al||n===Pl||n===Rl||n===Dl||n===Il||n===Ll||n===Ul||n===Ol||n===Nl||n===kl||n===Fl||n===Bl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Tl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Cl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Al)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Pl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Rl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Dl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Il)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ll)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ul)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ol)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Nl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===kl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bl)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===zl||n===Vl||n===Hl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===zl)return o===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gl||n===Wl||n===Xl||n===ql)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Gl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const sb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class ob{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Pd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Tt({vertexShader:sb,fragmentShader:rb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new un(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ab extends ss{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,_=null;const b=typeof XRWebGLBinding<"u",v=new ob,p={},D=t.getContextAttributes();let P=null,M=null;const U=[],L=[],k=new Me;let H=null;const E=new Qt;E.viewport=new at;const w=new Qt;w.viewport=new at;const N=[E,w],q=new m0;let $=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let se=U[j];return se===void 0&&(se=new Ia,U[j]=se),se.getTargetRaySpace()},this.getControllerGrip=function(j){let se=U[j];return se===void 0&&(se=new Ia,U[j]=se),se.getGripSpace()},this.getHand=function(j){let se=U[j];return se===void 0&&(se=new Ia,U[j]=se),se.getHandSpace()};function ne(j){const se=L.indexOf(j.inputSource);if(se===-1)return;const Se=U[se];Se!==void 0&&(Se.update(j.inputSource,j.frame,c||o),Se.dispatchEvent({type:j.type,data:j.inputSource}))}function J(){s.removeEventListener("select",ne),s.removeEventListener("selectstart",ne),s.removeEventListener("selectend",ne),s.removeEventListener("squeeze",ne),s.removeEventListener("squeezestart",ne),s.removeEventListener("squeezeend",ne),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",ce);for(let j=0;j<U.length;j++){const se=L[j];se!==null&&(L[j]=null,U[j].disconnect(se))}$=null,te=null,v.reset();for(const j in p)delete p[j];e.setRenderTarget(P),m=null,f=null,h=null,s=null,M=null,Qe.stop(),n.isPresenting=!1,e.setPixelRatio(H),e.setSize(k.width,k.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h===null&&b&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(P=e.getRenderTarget(),s.addEventListener("select",ne),s.addEventListener("selectstart",ne),s.addEventListener("selectend",ne),s.addEventListener("squeeze",ne),s.addEventListener("squeezestart",ne),s.addEventListener("squeezeend",ne),s.addEventListener("end",J),s.addEventListener("inputsourceschange",ce),D.xrCompatible!==!0&&await t.makeXRCompatible(),H=e.getPixelRatio(),e.getSize(k),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,ze=null,Le=null;D.depth&&(Le=D.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=D.stencil?zs:yr,ze=D.stencil?Bs:qn);const $e={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer($e),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new Nn(f.textureWidth,f.textureHeight,{format:Xt,type:ln,depthTexture:new Tr(f.textureWidth,f.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:D.stencil,colorSpace:e.outputColorSpace,samples:D.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Se={antialias:D.antialias,alpha:!0,depth:D.depth,stencil:D.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new Nn(m.framebufferWidth,m.framebufferHeight,{format:Xt,type:ln,colorSpace:e.outputColorSpace,stencilBuffer:D.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Qe.setContext(s),Qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function ce(j){for(let se=0;se<j.removed.length;se++){const Se=j.removed[se],ze=L.indexOf(Se);ze>=0&&(L[ze]=null,U[ze].disconnect(Se))}for(let se=0;se<j.added.length;se++){const Se=j.added[se];let ze=L.indexOf(Se);if(ze===-1){for(let $e=0;$e<U.length;$e++)if($e>=L.length){L.push(Se),ze=$e;break}else if(L[$e]===null){L[$e]=Se,ze=$e;break}if(ze===-1)break}const Le=U[ze];Le&&Le.connect(Se)}}const Y=new F,pe=new F;function be(j,se,Se){Y.setFromMatrixPosition(se.matrixWorld),pe.setFromMatrixPosition(Se.matrixWorld);const ze=Y.distanceTo(pe),Le=se.projectionMatrix.elements,$e=Se.projectionMatrix.elements,Ot=Le[14]/(Le[10]-1),I=Le[14]/(Le[10]+1),vt=(Le[9]+1)/Le[5],Xe=(Le[9]-1)/Le[5],He=(Le[8]-1)/Le[0],Ae=($e[8]+1)/$e[0],_t=Ot*He,Ee=Ot*Ae,je=ze/(-He+Ae),Nt=je*-He;if(se.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Nt),j.translateZ(je),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Le[10]===-1)j.projectionMatrix.copy(se.projectionMatrix),j.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const wt=Ot+je,R=I+je,y=_t-Nt,G=Ee+(ze-Nt),ee=vt*I/R*wt,oe=Xe*I/R*wt;j.projectionMatrix.makePerspective(y,G,ee,oe,wt,R),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Re(j,se){se===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(se.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let se=j.near,Se=j.far;v.texture!==null&&(v.depthNear>0&&(se=v.depthNear),v.depthFar>0&&(Se=v.depthFar)),q.near=w.near=E.near=se,q.far=w.far=E.far=Se,($!==q.near||te!==q.far)&&(s.updateRenderState({depthNear:q.near,depthFar:q.far}),$=q.near,te=q.far),q.layers.mask=j.layers.mask|6,E.layers.mask=q.layers.mask&3,w.layers.mask=q.layers.mask&5;const ze=j.parent,Le=q.cameras;Re(q,ze);for(let $e=0;$e<Le.length;$e++)Re(Le[$e],ze);Le.length===2?be(q,E,w):q.projectionMatrix.copy(E.projectionMatrix),Be(j,q,ze)};function Be(j,se,Se){Se===null?j.matrix.copy(se.matrixWorld):(j.matrix.copy(Se.matrixWorld),j.matrix.invert(),j.matrix.multiply(se.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(se.projectionMatrix),j.projectionMatrixInverse.copy(se.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Vs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(j){l=j,f!==null&&(f.fixedFoveation=j),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(q)},this.getCameraTexture=function(j){return p[j]};let it=null;function ht(j,se){if(u=se.getViewerPose(c||o),_=se,u!==null){const Se=u.views;m!==null&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let ze=!1;Se.length!==q.cameras.length&&(q.cameras.length=0,ze=!0);for(let I=0;I<Se.length;I++){const vt=Se[I];let Xe=null;if(m!==null)Xe=m.getViewport(vt);else{const Ae=h.getViewSubImage(f,vt);Xe=Ae.viewport,I===0&&(e.setRenderTargetTextures(M,Ae.colorTexture,Ae.depthStencilTexture),e.setRenderTarget(M))}let He=N[I];He===void 0&&(He=new Qt,He.layers.enable(I),He.viewport=new at,N[I]=He),He.matrix.fromArray(vt.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(vt.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),I===0&&(q.matrix.copy(He.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),ze===!0&&q.cameras.push(He)}const Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){h=n.getBinding();const I=h.getDepthInformation(Se[0]);I&&I.isValid&&I.texture&&v.init(I,s.renderState)}if(Le&&Le.includes("camera-access")&&b){e.state.unbindTexture(),h=n.getBinding();for(let I=0;I<Se.length;I++){const vt=Se[I].camera;if(vt){let Xe=p[vt];Xe||(Xe=new Pd,p[vt]=Xe);const He=h.getCameraImage(vt);Xe.sourceTexture=He}}}}for(let Se=0;Se<U.length;Se++){const ze=L[Se],Le=U[Se];ze!==null&&Le!==void 0&&Le.update(ze,se,c||o)}it&&it(j,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),_=null}const Qe=new Od;Qe.setAnimationLoop(ht),this.setAnimationLoop=function(j){it=j},this.dispose=function(){}}}const Gi=new jn,lb=new Je;function cb(i,e){function t(v,p){v.matrixAutoUpdate===!0&&v.updateMatrix(),p.value.copy(v.matrix)}function n(v,p){p.color.getRGB(v.fogColor.value,Md(i)),p.isFog?(v.fogNear.value=p.near,v.fogFar.value=p.far):p.isFogExp2&&(v.fogDensity.value=p.density)}function s(v,p,D,P,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(v,p):p.isMeshToonMaterial?(r(v,p),h(v,p)):p.isMeshPhongMaterial?(r(v,p),u(v,p)):p.isMeshStandardMaterial?(r(v,p),f(v,p),p.isMeshPhysicalMaterial&&m(v,p,M)):p.isMeshMatcapMaterial?(r(v,p),_(v,p)):p.isMeshDepthMaterial?r(v,p):p.isMeshDistanceMaterial?(r(v,p),b(v,p)):p.isMeshNormalMaterial?r(v,p):p.isLineBasicMaterial?(o(v,p),p.isLineDashedMaterial&&a(v,p)):p.isPointsMaterial?l(v,p,D,P):p.isSpriteMaterial?c(v,p):p.isShadowMaterial?(v.color.value.copy(p.color),v.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(v,p){v.opacity.value=p.opacity,p.color&&v.diffuse.value.copy(p.color),p.emissive&&v.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(v.map.value=p.map,t(p.map,v.mapTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.bumpMap&&(v.bumpMap.value=p.bumpMap,t(p.bumpMap,v.bumpMapTransform),v.bumpScale.value=p.bumpScale,p.side===qt&&(v.bumpScale.value*=-1)),p.normalMap&&(v.normalMap.value=p.normalMap,t(p.normalMap,v.normalMapTransform),v.normalScale.value.copy(p.normalScale),p.side===qt&&v.normalScale.value.negate()),p.displacementMap&&(v.displacementMap.value=p.displacementMap,t(p.displacementMap,v.displacementMapTransform),v.displacementScale.value=p.displacementScale,v.displacementBias.value=p.displacementBias),p.emissiveMap&&(v.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,v.emissiveMapTransform)),p.specularMap&&(v.specularMap.value=p.specularMap,t(p.specularMap,v.specularMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest);const D=e.get(p),P=D.envMap,M=D.envMapRotation;P&&(v.envMap.value=P,Gi.copy(M),Gi.x*=-1,Gi.y*=-1,Gi.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(Gi.y*=-1,Gi.z*=-1),v.envMapRotation.value.setFromMatrix4(lb.makeRotationFromEuler(Gi)),v.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=p.reflectivity,v.ior.value=p.ior,v.refractionRatio.value=p.refractionRatio),p.lightMap&&(v.lightMap.value=p.lightMap,v.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,v.lightMapTransform)),p.aoMap&&(v.aoMap.value=p.aoMap,v.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,v.aoMapTransform))}function o(v,p){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,p.map&&(v.map.value=p.map,t(p.map,v.mapTransform))}function a(v,p){v.dashSize.value=p.dashSize,v.totalSize.value=p.dashSize+p.gapSize,v.scale.value=p.scale}function l(v,p,D,P){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,v.size.value=p.size*D,v.scale.value=P*.5,p.map&&(v.map.value=p.map,t(p.map,v.uvTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest)}function c(v,p){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,v.rotation.value=p.rotation,p.map&&(v.map.value=p.map,t(p.map,v.mapTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest)}function u(v,p){v.specular.value.copy(p.specular),v.shininess.value=Math.max(p.shininess,1e-4)}function h(v,p){p.gradientMap&&(v.gradientMap.value=p.gradientMap)}function f(v,p){v.metalness.value=p.metalness,p.metalnessMap&&(v.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,v.metalnessMapTransform)),v.roughness.value=p.roughness,p.roughnessMap&&(v.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,v.roughnessMapTransform)),p.envMap&&(v.envMapIntensity.value=p.envMapIntensity)}function m(v,p,D){v.ior.value=p.ior,p.sheen>0&&(v.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),v.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(v.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,v.sheenColorMapTransform)),p.sheenRoughnessMap&&(v.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,v.sheenRoughnessMapTransform))),p.clearcoat>0&&(v.clearcoat.value=p.clearcoat,v.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(v.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,v.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(v.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qt&&v.clearcoatNormalScale.value.negate())),p.dispersion>0&&(v.dispersion.value=p.dispersion),p.iridescence>0&&(v.iridescence.value=p.iridescence,v.iridescenceIOR.value=p.iridescenceIOR,v.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(v.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,v.iridescenceMapTransform)),p.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),p.transmission>0&&(v.transmission.value=p.transmission,v.transmissionSamplerMap.value=D.texture,v.transmissionSamplerSize.value.set(D.width,D.height),p.transmissionMap&&(v.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,v.transmissionMapTransform)),v.thickness.value=p.thickness,p.thicknessMap&&(v.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=p.attenuationDistance,v.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(v.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(v.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=p.specularIntensity,v.specularColor.value.copy(p.specularColor),p.specularColorMap&&(v.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,v.specularColorMapTransform)),p.specularIntensityMap&&(v.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,v.specularIntensityMapTransform))}function _(v,p){p.matcap&&(v.matcap.value=p.matcap)}function b(v,p){const D=e.get(p).light;v.referencePosition.value.setFromMatrixPosition(D.matrixWorld),v.nearDistance.value=D.shadow.camera.near,v.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ub(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(D,P){const M=P.program;n.uniformBlockBinding(D,M)}function c(D,P){let M=s[D.id];M===void 0&&(_(D),M=u(D),s[D.id]=M,D.addEventListener("dispose",v));const U=P.program;n.updateUBOMapping(D,U);const L=e.render.frame;r[D.id]!==L&&(f(D),r[D.id]=L)}function u(D){const P=h();D.__bindingPointIndex=P;const M=i.createBuffer(),U=D.__size,L=D.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,U,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,P,M),M}function h(){for(let D=0;D<a;D++)if(o.indexOf(D)===-1)return o.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(D){const P=s[D.id],M=D.uniforms,U=D.__cache;i.bindBuffer(i.UNIFORM_BUFFER,P);for(let L=0,k=M.length;L<k;L++){const H=Array.isArray(M[L])?M[L]:[M[L]];for(let E=0,w=H.length;E<w;E++){const N=H[E];if(m(N,L,E,U)===!0){const q=N.__offset,$=Array.isArray(N.value)?N.value:[N.value];let te=0;for(let ne=0;ne<$.length;ne++){const J=$[ne],ce=b(J);typeof J=="number"||typeof J=="boolean"?(N.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,q+te,N.__data)):J.isMatrix3?(N.__data[0]=J.elements[0],N.__data[1]=J.elements[1],N.__data[2]=J.elements[2],N.__data[3]=0,N.__data[4]=J.elements[3],N.__data[5]=J.elements[4],N.__data[6]=J.elements[5],N.__data[7]=0,N.__data[8]=J.elements[6],N.__data[9]=J.elements[7],N.__data[10]=J.elements[8],N.__data[11]=0):(J.toArray(N.__data,te),te+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,q,N.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(D,P,M,U){const L=D.value,k=P+"_"+M;if(U[k]===void 0)return typeof L=="number"||typeof L=="boolean"?U[k]=L:U[k]=L.clone(),!0;{const H=U[k];if(typeof L=="number"||typeof L=="boolean"){if(H!==L)return U[k]=L,!0}else if(H.equals(L)===!1)return H.copy(L),!0}return!1}function _(D){const P=D.uniforms;let M=0;const U=16;for(let k=0,H=P.length;k<H;k++){const E=Array.isArray(P[k])?P[k]:[P[k]];for(let w=0,N=E.length;w<N;w++){const q=E[w],$=Array.isArray(q.value)?q.value:[q.value];for(let te=0,ne=$.length;te<ne;te++){const J=$[te],ce=b(J),Y=M%U,pe=Y%ce.boundary,be=Y+pe;M+=pe,be!==0&&U-be<ce.storage&&(M+=U-be),q.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=M,M+=ce.storage}}}const L=M%U;return L>0&&(M+=U-L),D.__size=M,D.__cache={},this}function b(D){const P={boundary:0,storage:0};return typeof D=="number"||typeof D=="boolean"?(P.boundary=4,P.storage=4):D.isVector2?(P.boundary=8,P.storage=8):D.isVector3||D.isColor?(P.boundary=16,P.storage=12):D.isVector4?(P.boundary=16,P.storage=16):D.isMatrix3?(P.boundary=48,P.storage=48):D.isMatrix4?(P.boundary=64,P.storage=64):D.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D),P}function v(D){const P=D.target;P.removeEventListener("dispose",v);const M=o.indexOf(P.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[P.id]),delete s[P.id],delete r[P.id]}function p(){for(const D in s)i.deleteBuffer(s[D]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class hb{constructor(e={}){const{canvas:t=am(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;const _=new Uint32Array(4),b=new Int32Array(4);let v=null,p=null;const D=[],P=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let U=!1;this._outputColorSpace=yt;let L=0,k=0,H=null,E=-1,w=null;const N=new at,q=new at;let $=null;const te=new Ce(0);let ne=0,J=t.width,ce=t.height,Y=1,pe=null,be=null;const Re=new at(0,0,J,ce),Be=new at(0,0,J,ce);let it=!1;const ht=new Tc;let Qe=!1,j=!1;const se=new Je,Se=new F,ze=new at,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function Ot(){return H===null?Y:1}let I=n;function vt(d,x){return t.getContext(d,x)}try{const d={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${hc}`),t.addEventListener("webglcontextlost",X,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",le,!1),I===null){const x="webgl2";if(I=vt(x,d),I===null)throw vt(x)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(d){throw console.error("THREE.WebGLRenderer: "+d.message),d}let Xe,He,Ae,_t,Ee,je,Nt,wt,R,y,G,ee,oe,Z,Ue,fe,De,Oe,he,ve,Pe,Ie,_e,Ne;function O(){Xe=new y_(I),Xe.init(),Ie=new ib(I,Xe),He=new p_(I,Xe,e,Ie),Ae=new tb(I,Xe),He.reversedDepthBuffer&&f&&Ae.buffers.depth.setReversed(!0),_t=new M_(I),Ee=new Hx,je=new nb(I,Xe,Ae,Ee,He,Ie,_t),Nt=new g_(M),wt=new b_(M),R=new R0(I),_e=new d_(I,R),y=new S_(I,R,_t,_e),G=new T_(I,y,R,_t),he=new E_(I,He,je),fe=new m_(Ee),ee=new Vx(M,Nt,wt,Xe,He,_e,fe),oe=new cb(M,Ee),Z=new Wx,Ue=new $x(Xe),Oe=new h_(M,Nt,wt,Ae,G,m,l),De=new Qx(M,G,He),Ne=new ub(I,_t,He,Ae),ve=new f_(I,Xe,_t),Pe=new w_(I,Xe,_t),_t.programs=ee.programs,M.capabilities=He,M.extensions=Xe,M.properties=Ee,M.renderLists=Z,M.shadowMap=De,M.state=Ae,M.info=_t}O();const de=new ab(M,I);this.xr=de,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const d=Xe.get("WEBGL_lose_context");d&&d.loseContext()},this.forceContextRestore=function(){const d=Xe.get("WEBGL_lose_context");d&&d.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(d){d!==void 0&&(Y=d,this.setSize(J,ce,!1))},this.getSize=function(d){return d.set(J,ce)},this.setSize=function(d,x,S=!0){if(de.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=d,ce=x,t.width=Math.floor(d*Y),t.height=Math.floor(x*Y),S===!0&&(t.style.width=d+"px",t.style.height=x+"px"),this.setViewport(0,0,d,x)},this.getDrawingBufferSize=function(d){return d.set(J*Y,ce*Y).floor()},this.setDrawingBufferSize=function(d,x,S){J=d,ce=x,Y=S,t.width=Math.floor(d*S),t.height=Math.floor(x*S),this.setViewport(0,0,d,x)},this.getCurrentViewport=function(d){return d.copy(N)},this.getViewport=function(d){return d.copy(Re)},this.setViewport=function(d,x,S,C){d.isVector4?Re.set(d.x,d.y,d.z,d.w):Re.set(d,x,S,C),Ae.viewport(N.copy(Re).multiplyScalar(Y).round())},this.getScissor=function(d){return d.copy(Be)},this.setScissor=function(d,x,S,C){d.isVector4?Be.set(d.x,d.y,d.z,d.w):Be.set(d,x,S,C),Ae.scissor(q.copy(Be).multiplyScalar(Y).round())},this.getScissorTest=function(){return it},this.setScissorTest=function(d){Ae.setScissorTest(it=d)},this.setOpaqueSort=function(d){pe=d},this.setTransparentSort=function(d){be=d},this.getClearColor=function(d){return d.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(d=!0,x=!0,S=!0){let C=0;if(d){let A=!1;if(H!==null){const T=H.texture.format;A=T===vc||T===gc||T===mc}if(A){const T=H.texture.type,V=T===ln||T===qn||T===br||T===Bs||T===fc||T===pc,z=Oe.getClearColor(),B=Oe.getClearAlpha(),W=z.r,Q=z.g,K=z.b;V?(_[0]=W,_[1]=Q,_[2]=K,_[3]=B,I.clearBufferuiv(I.COLOR,0,_)):(b[0]=W,b[1]=Q,b[2]=K,b[3]=B,I.clearBufferiv(I.COLOR,0,b))}else C|=I.COLOR_BUFFER_BIT}x&&(C|=I.DEPTH_BUFFER_BIT),S&&(C|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(C)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",X,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",le,!1),Oe.dispose(),Z.dispose(),Ue.dispose(),Ee.dispose(),Nt.dispose(),wt.dispose(),G.dispose(),_e.dispose(),Ne.dispose(),ee.dispose(),de.dispose(),de.removeEventListener("sessionstart",mn),de.removeEventListener("sessionend",jr),Jn.stop()};function X(d){d.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const d=_t.autoReset,x=De.enabled,S=De.autoUpdate,C=De.needsUpdate,A=De.type;O(),_t.autoReset=d,De.enabled=x,De.autoUpdate=S,De.needsUpdate=C,De.type=A}function le(d){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",d.statusMessage)}function ie(d){const x=d.target;x.removeEventListener("dispose",ie),Te(x)}function Te(d){qe(d),Ee.remove(d)}function qe(d){const x=Ee.get(d).programs;x!==void 0&&(x.forEach(function(S){ee.releaseProgram(S)}),d.isShaderMaterial&&ee.releaseShaderCache(d))}this.renderBufferDirect=function(d,x,S,C,A,T){x===null&&(x=Le);const V=A.isMesh&&A.matrixWorld.determinant()<0,z=Qr(d,x,S,C,A);Ae.setMaterial(C,V);let B=S.index,W=1;if(C.wireframe===!0){if(B=y.getWireframeAttribute(S),B===void 0)return;W=2}const Q=S.drawRange,K=S.attributes.position;let re=Q.start*W,me=(Q.start+Q.count)*W;T!==null&&(re=Math.max(re,T.start*W),me=Math.min(me,(T.start+T.count)*W)),B!==null?(re=Math.max(re,0),me=Math.min(me,B.count)):K!=null&&(re=Math.max(re,0),me=Math.min(me,K.count));const ae=me-re;if(ae<0||ae===1/0)return;_e.setup(A,C,z,S,B);let ue,xe=ve;if(B!==null&&(ue=R.get(B),xe=Pe,xe.setIndex(ue)),A.isMesh)C.wireframe===!0?(Ae.setLineWidth(C.wireframeLinewidth*Ot()),xe.setMode(I.LINES)):xe.setMode(I.TRIANGLES);else if(A.isLine){let ge=C.linewidth;ge===void 0&&(ge=1),Ae.setLineWidth(ge*Ot()),A.isLineSegments?xe.setMode(I.LINES):A.isLineLoop?xe.setMode(I.LINE_LOOP):xe.setMode(I.LINE_STRIP)}else A.isPoints?xe.setMode(I.POINTS):A.isSprite&&xe.setMode(I.TRIANGLES);if(A.isBatchedMesh)if(A._multiDrawInstances!==null)Er("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xe.renderMultiDrawInstances(A._multiDrawStarts,A._multiDrawCounts,A._multiDrawCount,A._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))xe.renderMultiDraw(A._multiDrawStarts,A._multiDrawCounts,A._multiDrawCount);else{const ge=A._multiDrawStarts,Fe=A._multiDrawCounts,ke=A._multiDrawCount,Ke=B?R.get(B).bytesPerElement:1,Ve=Ee.get(C).currentProgram.getUniforms();for(let st=0;st<ke;st++)Ve.setValue(I,"_gl_DrawID",st),xe.render(ge[st]/Ke,Fe[st])}else if(A.isInstancedMesh)xe.renderInstances(re,ae,A.count);else if(S.isInstancedBufferGeometry){const ge=S._maxInstanceCount!==void 0?S._maxInstanceCount:1/0,Fe=Math.min(S.instanceCount,ge);xe.renderInstances(re,ae,Fe)}else xe.render(re,ae)};function mt(d,x,S){d.transparent===!0&&d.side===sn&&d.forceSinglePass===!1?(d.side=qt,d.needsUpdate=!0,as(d,x,S),d.side=Xn,d.needsUpdate=!0,as(d,x,S),d.side=sn):as(d,x,S)}this.compile=function(d,x,S=null){S===null&&(S=d),p=Ue.get(S),p.init(x),P.push(p),S.traverseVisible(function(A){A.isLight&&A.layers.test(x.layers)&&(p.pushLight(A),A.castShadow&&p.pushShadow(A))}),d!==S&&d.traverseVisible(function(A){A.isLight&&A.layers.test(x.layers)&&(p.pushLight(A),A.castShadow&&p.pushShadow(A))}),p.setupLights();const C=new Set;return d.traverse(function(A){if(!(A.isMesh||A.isPoints||A.isLine||A.isSprite))return;const T=A.material;if(T)if(Array.isArray(T))for(let V=0;V<T.length;V++){const z=T[V];mt(z,S,A),C.add(z)}else mt(T,S,A),C.add(T)}),p=P.pop(),C},this.compileAsync=function(d,x,S=null){const C=this.compile(d,x,S);return new Promise(A=>{function T(){if(C.forEach(function(V){Ee.get(V).currentProgram.isReady()&&C.delete(V)}),C.size===0){A(d);return}setTimeout(T,10)}Xe.get("KHR_parallel_shader_compile")!==null?T():setTimeout(T,10)})};let ct=null;function Mn(d){ct&&ct(d)}function mn(){Jn.stop()}function jr(){Jn.start()}const Jn=new Od;Jn.setAnimationLoop(Mn),typeof self<"u"&&Jn.setContext(self),this.setAnimationLoop=function(d){ct=d,de.setAnimationLoop(d),d===null?Jn.stop():Jn.start()},de.addEventListener("sessionstart",mn),de.addEventListener("sessionend",jr),this.render=function(d,x){if(x!==void 0&&x.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld(),x.parent===null&&x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),de.enabled===!0&&de.isPresenting===!0&&(de.cameraAutoUpdate===!0&&de.updateCamera(x),x=de.getCamera()),d.isScene===!0&&d.onBeforeRender(M,d,x,H),p=Ue.get(d,P.length),p.init(x),P.push(p),se.multiplyMatrices(x.projectionMatrix,x.matrixWorldInverse),ht.setFromProjectionMatrix(se,Gn,x.reversedDepth),j=this.localClippingEnabled,Qe=fe.init(this.clippingPlanes,j),v=Z.get(d,D.length),v.init(),D.push(v),de.enabled===!0&&de.isPresenting===!0){const T=M.xr.getDepthSensingMesh();T!==null&&er(T,x,-1/0,M.sortObjects)}er(d,x,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(pe,be),$e=de.enabled===!1||de.isPresenting===!1||de.hasDepthSensing()===!1,$e&&Oe.addToRenderList(v,d),this.info.render.frame++,Qe===!0&&fe.beginShadows();const S=p.state.shadowsArray;De.render(S,d,x),Qe===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const C=v.opaque,A=v.transmissive;if(p.setupLights(),x.isArrayCamera){const T=x.cameras;if(A.length>0)for(let V=0,z=T.length;V<z;V++){const B=T[V];Yr(C,A,d,B)}$e&&Oe.render(d);for(let V=0,z=T.length;V<z;V++){const B=T[V];Kr(v,d,B,B.viewport)}}else A.length>0&&Yr(C,A,d,x),$e&&Oe.render(d),Kr(v,d,x);H!==null&&k===0&&(je.updateMultisampleRenderTarget(H),je.updateRenderTargetMipmap(H)),d.isScene===!0&&d.onAfterRender(M,d,x),_e.resetDefaultState(),E=-1,w=null,P.pop(),P.length>0?(p=P[P.length-1],Qe===!0&&fe.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,D.pop(),D.length>0?v=D[D.length-1]:v=null};function er(d,x,S,C){if(d.visible===!1)return;if(d.layers.test(x.layers)){if(d.isGroup)S=d.renderOrder;else if(d.isLOD)d.autoUpdate===!0&&d.update(x);else if(d.isLight)p.pushLight(d),d.castShadow&&p.pushShadow(d);else if(d.isSprite){if(!d.frustumCulled||ht.intersectsSprite(d)){C&&ze.setFromMatrixPosition(d.matrixWorld).applyMatrix4(se);const V=G.update(d),z=d.material;z.visible&&v.push(d,V,z,S,ze.z,null)}}else if((d.isMesh||d.isLine||d.isPoints)&&(!d.frustumCulled||ht.intersectsObject(d))){const V=G.update(d),z=d.material;if(C&&(d.boundingSphere!==void 0?(d.boundingSphere===null&&d.computeBoundingSphere(),ze.copy(d.boundingSphere.center)):(V.boundingSphere===null&&V.computeBoundingSphere(),ze.copy(V.boundingSphere.center)),ze.applyMatrix4(d.matrixWorld).applyMatrix4(se)),Array.isArray(z)){const B=V.groups;for(let W=0,Q=B.length;W<Q;W++){const K=B[W],re=z[K.materialIndex];re&&re.visible&&v.push(d,V,re,S,ze.z,K)}}else z.visible&&v.push(d,V,z,S,ze.z,null)}}const T=d.children;for(let V=0,z=T.length;V<z;V++)er(T[V],x,S,C)}function Kr(d,x,S,C){const A=d.opaque,T=d.transmissive,V=d.transparent;p.setupLightsView(S),Qe===!0&&fe.setGlobalState(M.clippingPlanes,S),C&&Ae.viewport(N.copy(C)),A.length>0&&ki(A,x,S),T.length>0&&ki(T,x,S),V.length>0&&ki(V,x,S),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function Yr(d,x,S,C){if((S.isScene===!0?S.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[C.id]===void 0&&(p.state.transmissionRenderTarget[C.id]=new Nn(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?Hn:ln,minFilter:In,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));const T=p.state.transmissionRenderTarget[C.id],V=C.viewport||N;T.setSize(V.z*M.transmissionResolutionScale,V.w*M.transmissionResolutionScale);const z=M.getRenderTarget(),B=M.getActiveCubeFace(),W=M.getActiveMipmapLevel();M.setRenderTarget(T),M.getClearColor(te),ne=M.getClearAlpha(),ne<1&&M.setClearColor(16777215,.5),M.clear(),$e&&Oe.render(S);const Q=M.toneMapping;M.toneMapping=Li;const K=C.viewport;if(C.viewport!==void 0&&(C.viewport=void 0),p.setupLightsView(C),Qe===!0&&fe.setGlobalState(M.clippingPlanes,C),ki(d,S,C),je.updateMultisampleRenderTarget(T),je.updateRenderTargetMipmap(T),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let re=!1;for(let me=0,ae=x.length;me<ae;me++){const ue=x[me],xe=ue.object,ge=ue.geometry,Fe=ue.material,ke=ue.group;if(Fe.side===sn&&xe.layers.test(C.layers)){const Ke=Fe.side;Fe.side=qt,Fe.needsUpdate=!0,$r(xe,S,C,ge,Fe,ke),Fe.side=Ke,Fe.needsUpdate=!0,re=!0}}re===!0&&(je.updateMultisampleRenderTarget(T),je.updateRenderTargetMipmap(T))}M.setRenderTarget(z,B,W),M.setClearColor(te,ne),K!==void 0&&(C.viewport=K),M.toneMapping=Q}function ki(d,x,S){const C=x.isScene===!0?x.overrideMaterial:null;for(let A=0,T=d.length;A<T;A++){const V=d[A],z=V.object,B=V.geometry,W=V.group;let Q=V.material;Q.allowOverride===!0&&C!==null&&(Q=C),z.layers.test(S.layers)&&$r(z,x,S,B,Q,W)}}function $r(d,x,S,C,A,T){d.onBeforeRender(M,x,S,C,A,T),d.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,d.matrixWorld),d.normalMatrix.getNormalMatrix(d.modelViewMatrix),A.onBeforeRender(M,x,S,C,d,T),A.transparent===!0&&A.side===sn&&A.forceSinglePass===!1?(A.side=qt,A.needsUpdate=!0,M.renderBufferDirect(S,x,C,A,d,T),A.side=Xn,A.needsUpdate=!0,M.renderBufferDirect(S,x,C,A,d,T),A.side=sn):M.renderBufferDirect(S,x,C,A,d,T),d.onAfterRender(M,x,S,C,A,T)}function as(d,x,S){x.isScene!==!0&&(x=Le);const C=Ee.get(d),A=p.state.lights,T=p.state.shadowsArray,V=A.state.version,z=ee.getParameters(d,A.state,T,x,S),B=ee.getProgramCacheKey(z);let W=C.programs;C.environment=d.isMeshStandardMaterial?x.environment:null,C.fog=x.fog,C.envMap=(d.isMeshStandardMaterial?wt:Nt).get(d.envMap||C.environment),C.envMapRotation=C.environment!==null&&d.envMap===null?x.environmentRotation:d.envMapRotation,W===void 0&&(d.addEventListener("dispose",ie),W=new Map,C.programs=W);let Q=W.get(B);if(Q!==void 0){if(C.currentProgram===Q&&C.lightsStateVersion===V)return Jr(d,z),Q}else z.uniforms=ee.getUniforms(d),d.onBeforeCompile(z,M),Q=ee.acquireProgram(z,B),W.set(B,Q),C.uniforms=z.uniforms;const K=C.uniforms;return(!d.isShaderMaterial&&!d.isRawShaderMaterial||d.clipping===!0)&&(K.clippingPlanes=fe.uniform),Jr(d,z),C.needsLights=ua(d),C.lightsStateVersion=V,C.needsLights&&(K.ambientLightColor.value=A.state.ambient,K.lightProbe.value=A.state.probe,K.directionalLights.value=A.state.directional,K.directionalLightShadows.value=A.state.directionalShadow,K.spotLights.value=A.state.spot,K.spotLightShadows.value=A.state.spotShadow,K.rectAreaLights.value=A.state.rectArea,K.ltc_1.value=A.state.rectAreaLTC1,K.ltc_2.value=A.state.rectAreaLTC2,K.pointLights.value=A.state.point,K.pointLightShadows.value=A.state.pointShadow,K.hemisphereLights.value=A.state.hemi,K.directionalShadowMap.value=A.state.directionalShadowMap,K.directionalShadowMatrix.value=A.state.directionalShadowMatrix,K.spotShadowMap.value=A.state.spotShadowMap,K.spotLightMatrix.value=A.state.spotLightMatrix,K.spotLightMap.value=A.state.spotLightMap,K.pointShadowMap.value=A.state.pointShadowMap,K.pointShadowMatrix.value=A.state.pointShadowMatrix),C.currentProgram=Q,C.uniformsList=null,Q}function Zr(d){if(d.uniformsList===null){const x=d.currentProgram.getUniforms();d.uniformsList=Fo.seqWithValue(x.seq,d.uniforms)}return d.uniformsList}function Jr(d,x){const S=Ee.get(d);S.outputColorSpace=x.outputColorSpace,S.batching=x.batching,S.batchingColor=x.batchingColor,S.instancing=x.instancing,S.instancingColor=x.instancingColor,S.instancingMorph=x.instancingMorph,S.skinning=x.skinning,S.morphTargets=x.morphTargets,S.morphNormals=x.morphNormals,S.morphColors=x.morphColors,S.morphTargetsCount=x.morphTargetsCount,S.numClippingPlanes=x.numClippingPlanes,S.numIntersection=x.numClipIntersection,S.vertexAlphas=x.vertexAlphas,S.vertexTangents=x.vertexTangents,S.toneMapping=x.toneMapping}function Qr(d,x,S,C,A){x.isScene!==!0&&(x=Le),je.resetTextureUnits();const T=x.fog,V=C.isMeshStandardMaterial?x.environment:null,z=H===null?M.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:It,B=(C.isMeshStandardMaterial?wt:Nt).get(C.envMap||V),W=C.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,Q=!!S.attributes.tangent&&(!!C.normalMap||C.anisotropy>0),K=!!S.morphAttributes.position,re=!!S.morphAttributes.normal,me=!!S.morphAttributes.color;let ae=Li;C.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(ae=M.toneMapping);const ue=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,xe=ue!==void 0?ue.length:0,ge=Ee.get(C),Fe=p.state.lights;if(Qe===!0&&(j===!0||d!==w)){const bt=d===w&&C.id===E;fe.setState(C,d,bt)}let ke=!1;C.version===ge.__version?(ge.needsLights&&ge.lightsStateVersion!==Fe.state.version||ge.outputColorSpace!==z||A.isBatchedMesh&&ge.batching===!1||!A.isBatchedMesh&&ge.batching===!0||A.isBatchedMesh&&ge.batchingColor===!0&&A.colorTexture===null||A.isBatchedMesh&&ge.batchingColor===!1&&A.colorTexture!==null||A.isInstancedMesh&&ge.instancing===!1||!A.isInstancedMesh&&ge.instancing===!0||A.isSkinnedMesh&&ge.skinning===!1||!A.isSkinnedMesh&&ge.skinning===!0||A.isInstancedMesh&&ge.instancingColor===!0&&A.instanceColor===null||A.isInstancedMesh&&ge.instancingColor===!1&&A.instanceColor!==null||A.isInstancedMesh&&ge.instancingMorph===!0&&A.morphTexture===null||A.isInstancedMesh&&ge.instancingMorph===!1&&A.morphTexture!==null||ge.envMap!==B||C.fog===!0&&ge.fog!==T||ge.numClippingPlanes!==void 0&&(ge.numClippingPlanes!==fe.numPlanes||ge.numIntersection!==fe.numIntersection)||ge.vertexAlphas!==W||ge.vertexTangents!==Q||ge.morphTargets!==K||ge.morphNormals!==re||ge.morphColors!==me||ge.toneMapping!==ae||ge.morphTargetsCount!==xe)&&(ke=!0):(ke=!0,ge.__version=C.version);let Ke=ge.currentProgram;ke===!0&&(Ke=as(C,x,A));let Ve=!1,st=!1,Mt=!1;const Ge=Ke.getUniforms(),We=ge.uniforms;if(Ae.useProgram(Ke.program)&&(Ve=!0,st=!0,Mt=!0),C.id!==E&&(E=C.id,st=!0),Ve||w!==d){Ae.buffers.depth.getReversed()&&d.reversedDepth!==!0&&(d._reversedDepth=!0,d.updateProjectionMatrix()),Ge.setValue(I,"projectionMatrix",d.projectionMatrix),Ge.setValue(I,"viewMatrix",d.matrixWorldInverse);const kt=Ge.map.cameraPosition;kt!==void 0&&kt.setValue(I,Se.setFromMatrixPosition(d.matrixWorld)),He.logarithmicDepthBuffer&&Ge.setValue(I,"logDepthBufFC",2/(Math.log(d.far+1)/Math.LN2)),(C.isMeshPhongMaterial||C.isMeshToonMaterial||C.isMeshLambertMaterial||C.isMeshBasicMaterial||C.isMeshStandardMaterial||C.isShaderMaterial)&&Ge.setValue(I,"isOrthographic",d.isOrthographicCamera===!0),w!==d&&(w=d,st=!0,Mt=!0)}if(A.isSkinnedMesh){Ge.setOptional(I,A,"bindMatrix"),Ge.setOptional(I,A,"bindMatrixInverse");const bt=A.skeleton;bt&&(bt.boneTexture===null&&bt.computeBoneTexture(),Ge.setValue(I,"boneTexture",bt.boneTexture,je))}A.isBatchedMesh&&(Ge.setOptional(I,A,"batchingTexture"),Ge.setValue(I,"batchingTexture",A._matricesTexture,je),Ge.setOptional(I,A,"batchingIdTexture"),Ge.setValue(I,"batchingIdTexture",A._indirectTexture,je),Ge.setOptional(I,A,"batchingColorTexture"),A._colorsTexture!==null&&Ge.setValue(I,"batchingColorTexture",A._colorsTexture,je));const et=S.morphAttributes;if((et.position!==void 0||et.normal!==void 0||et.color!==void 0)&&he.update(A,S,Ke),(st||ge.receiveShadow!==A.receiveShadow)&&(ge.receiveShadow=A.receiveShadow,Ge.setValue(I,"receiveShadow",A.receiveShadow)),C.isMeshGouraudMaterial&&C.envMap!==null&&(We.envMap.value=B,We.flipEnvMap.value=B.isCubeTexture&&B.isRenderTargetTexture===!1?-1:1),C.isMeshStandardMaterial&&C.envMap===null&&x.environment!==null&&(We.envMapIntensity.value=x.environmentIntensity),st&&(Ge.setValue(I,"toneMappingExposure",M.toneMappingExposure),ge.needsLights&&eo(We,Mt),T&&C.fog===!0&&oe.refreshFogUniforms(We,T),oe.refreshMaterialUniforms(We,C,Y,ce,p.state.transmissionRenderTarget[d.id]),Fo.upload(I,Zr(ge),We,je)),C.isShaderMaterial&&C.uniformsNeedUpdate===!0&&(Fo.upload(I,Zr(ge),We,je),C.uniformsNeedUpdate=!1),C.isSpriteMaterial&&Ge.setValue(I,"center",A.center),Ge.setValue(I,"modelViewMatrix",A.modelViewMatrix),Ge.setValue(I,"normalMatrix",A.normalMatrix),Ge.setValue(I,"modelMatrix",A.matrixWorld),C.isShaderMaterial||C.isRawShaderMaterial){const bt=C.uniformsGroups;for(let kt=0,nn=bt.length;kt<nn;kt++){const gn=bt[kt];Ne.update(gn,Ke),Ne.bind(gn,Ke)}}return Ke}function eo(d,x){d.ambientLightColor.needsUpdate=x,d.lightProbe.needsUpdate=x,d.directionalLights.needsUpdate=x,d.directionalLightShadows.needsUpdate=x,d.pointLights.needsUpdate=x,d.pointLightShadows.needsUpdate=x,d.spotLights.needsUpdate=x,d.spotLightShadows.needsUpdate=x,d.rectAreaLights.needsUpdate=x,d.hemisphereLights.needsUpdate=x}function ua(d){return d.isMeshLambertMaterial||d.isMeshToonMaterial||d.isMeshPhongMaterial||d.isMeshStandardMaterial||d.isShadowMaterial||d.isShaderMaterial&&d.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(d,x,S){const C=Ee.get(d);C.__autoAllocateDepthBuffer=d.resolveDepthBuffer===!1,C.__autoAllocateDepthBuffer===!1&&(C.__useRenderToTexture=!1),Ee.get(d.texture).__webglTexture=x,Ee.get(d.depthTexture).__webglTexture=C.__autoAllocateDepthBuffer?void 0:S,C.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(d,x){const S=Ee.get(d);S.__webglFramebuffer=x,S.__useDefaultFramebuffer=x===void 0};const Qn=I.createFramebuffer();this.setRenderTarget=function(d,x=0,S=0){H=d,L=x,k=S;let C=!0,A=null,T=!1,V=!1;if(d){const B=Ee.get(d);if(B.__useDefaultFramebuffer!==void 0)Ae.bindFramebuffer(I.FRAMEBUFFER,null),C=!1;else if(B.__webglFramebuffer===void 0)je.setupRenderTarget(d);else if(B.__hasExternalTextures)je.rebindTextures(d,Ee.get(d.texture).__webglTexture,Ee.get(d.depthTexture).__webglTexture);else if(d.depthBuffer){const K=d.depthTexture;if(B.__boundDepthTexture!==K){if(K!==null&&Ee.has(K)&&(d.width!==K.image.width||d.height!==K.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");je.setupDepthRenderbuffer(d)}}const W=d.texture;(W.isData3DTexture||W.isDataArrayTexture||W.isCompressedArrayTexture)&&(V=!0);const Q=Ee.get(d).__webglFramebuffer;d.isWebGLCubeRenderTarget?(Array.isArray(Q[x])?A=Q[x][S]:A=Q[x],T=!0):d.samples>0&&je.useMultisampledRTT(d)===!1?A=Ee.get(d).__webglMultisampledFramebuffer:Array.isArray(Q)?A=Q[S]:A=Q,N.copy(d.viewport),q.copy(d.scissor),$=d.scissorTest}else N.copy(Re).multiplyScalar(Y).floor(),q.copy(Be).multiplyScalar(Y).floor(),$=it;if(S!==0&&(A=Qn),Ae.bindFramebuffer(I.FRAMEBUFFER,A)&&C&&Ae.drawBuffers(d,A),Ae.viewport(N),Ae.scissor(q),Ae.setScissorTest($),T){const B=Ee.get(d.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+x,B.__webglTexture,S)}else if(V){const B=x;for(let W=0;W<d.textures.length;W++){const Q=Ee.get(d.textures[W]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+W,Q.__webglTexture,S,B)}}else if(d!==null&&S!==0){const B=Ee.get(d.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,B.__webglTexture,S)}E=-1},this.readRenderTargetPixels=function(d,x,S,C,A,T,V,z=0){if(!(d&&d.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let B=Ee.get(d).__webglFramebuffer;if(d.isWebGLCubeRenderTarget&&V!==void 0&&(B=B[V]),B){Ae.bindFramebuffer(I.FRAMEBUFFER,B);try{const W=d.textures[z],Q=W.format,K=W.type;if(!He.textureFormatReadable(Q)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(K)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}x>=0&&x<=d.width-C&&S>=0&&S<=d.height-A&&(d.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+z),I.readPixels(x,S,C,A,Ie.convert(Q),Ie.convert(K),T))}finally{const W=H!==null?Ee.get(H).__webglFramebuffer:null;Ae.bindFramebuffer(I.FRAMEBUFFER,W)}}},this.readRenderTargetPixelsAsync=async function(d,x,S,C,A,T,V,z=0){if(!(d&&d.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let B=Ee.get(d).__webglFramebuffer;if(d.isWebGLCubeRenderTarget&&V!==void 0&&(B=B[V]),B)if(x>=0&&x<=d.width-C&&S>=0&&S<=d.height-A){Ae.bindFramebuffer(I.FRAMEBUFFER,B);const W=d.textures[z],Q=W.format,K=W.type;if(!He.textureFormatReadable(Q))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(K))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const re=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,re),I.bufferData(I.PIXEL_PACK_BUFFER,T.byteLength,I.STREAM_READ),d.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+z),I.readPixels(x,S,C,A,Ie.convert(Q),Ie.convert(K),0);const me=H!==null?Ee.get(H).__webglFramebuffer:null;Ae.bindFramebuffer(I.FRAMEBUFFER,me);const ae=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await lm(I,ae,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,re),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,T),I.deleteBuffer(re),I.deleteSync(ae),T}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(d,x=null,S=0){const C=Math.pow(2,-S),A=Math.floor(d.image.width*C),T=Math.floor(d.image.height*C),V=x!==null?x.x:0,z=x!==null?x.y:0;je.setTexture2D(d,0),I.copyTexSubImage2D(I.TEXTURE_2D,S,0,0,V,z,A,T),Ae.unbindTexture()};const Bn=I.createFramebuffer(),g=I.createFramebuffer();this.copyTextureToTexture=function(d,x,S=null,C=null,A=0,T=null){T===null&&(A!==0?(Er("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),T=A,A=0):T=0);let V,z,B,W,Q,K,re,me,ae;const ue=d.isCompressedTexture?d.mipmaps[T]:d.image;if(S!==null)V=S.max.x-S.min.x,z=S.max.y-S.min.y,B=S.isBox3?S.max.z-S.min.z:1,W=S.min.x,Q=S.min.y,K=S.isBox3?S.min.z:0;else{const et=Math.pow(2,-A);V=Math.floor(ue.width*et),z=Math.floor(ue.height*et),d.isDataArrayTexture?B=ue.depth:d.isData3DTexture?B=Math.floor(ue.depth*et):B=1,W=0,Q=0,K=0}C!==null?(re=C.x,me=C.y,ae=C.z):(re=0,me=0,ae=0);const xe=Ie.convert(x.format),ge=Ie.convert(x.type);let Fe;x.isData3DTexture?(je.setTexture3D(x,0),Fe=I.TEXTURE_3D):x.isDataArrayTexture||x.isCompressedArrayTexture?(je.setTexture2DArray(x,0),Fe=I.TEXTURE_2D_ARRAY):(je.setTexture2D(x,0),Fe=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,x.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,x.unpackAlignment);const ke=I.getParameter(I.UNPACK_ROW_LENGTH),Ke=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ve=I.getParameter(I.UNPACK_SKIP_PIXELS),st=I.getParameter(I.UNPACK_SKIP_ROWS),Mt=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ue.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ue.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,W),I.pixelStorei(I.UNPACK_SKIP_ROWS,Q),I.pixelStorei(I.UNPACK_SKIP_IMAGES,K);const Ge=d.isDataArrayTexture||d.isData3DTexture,We=x.isDataArrayTexture||x.isData3DTexture;if(d.isDepthTexture){const et=Ee.get(d),bt=Ee.get(x),kt=Ee.get(et.__renderTarget),nn=Ee.get(bt.__renderTarget);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,kt.__webglFramebuffer),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,nn.__webglFramebuffer);for(let gn=0;gn<B;gn++)Ge&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ee.get(d).__webglTexture,A,K+gn),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ee.get(x).__webglTexture,T,ae+gn)),I.blitFramebuffer(W,Q,V,z,re,me,V,z,I.DEPTH_BUFFER_BIT,I.NEAREST);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(A!==0||d.isRenderTargetTexture||Ee.has(d)){const et=Ee.get(d),bt=Ee.get(x);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,Bn),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,g);for(let kt=0;kt<B;kt++)Ge?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,et.__webglTexture,A,K+kt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,et.__webglTexture,A),We?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,bt.__webglTexture,T,ae+kt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,bt.__webglTexture,T),A!==0?I.blitFramebuffer(W,Q,V,z,re,me,V,z,I.COLOR_BUFFER_BIT,I.NEAREST):We?I.copyTexSubImage3D(Fe,T,re,me,ae+kt,W,Q,V,z):I.copyTexSubImage2D(Fe,T,re,me,W,Q,V,z);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else We?d.isDataTexture||d.isData3DTexture?I.texSubImage3D(Fe,T,re,me,ae,V,z,B,xe,ge,ue.data):x.isCompressedArrayTexture?I.compressedTexSubImage3D(Fe,T,re,me,ae,V,z,B,xe,ue.data):I.texSubImage3D(Fe,T,re,me,ae,V,z,B,xe,ge,ue):d.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,T,re,me,V,z,xe,ge,ue.data):d.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,T,re,me,ue.width,ue.height,xe,ue.data):I.texSubImage2D(I.TEXTURE_2D,T,re,me,V,z,xe,ge,ue);I.pixelStorei(I.UNPACK_ROW_LENGTH,ke),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ke),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ve),I.pixelStorei(I.UNPACK_SKIP_ROWS,st),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Mt),T===0&&x.generateMipmaps&&I.generateMipmap(Fe),Ae.unbindTexture()},this.initRenderTarget=function(d){Ee.get(d).__webglFramebuffer===void 0&&je.setupRenderTarget(d)},this.initTexture=function(d){d.isCubeTexture?je.setTextureCube(d,0):d.isData3DTexture?je.setTexture3D(d,0):d.isDataArrayTexture||d.isCompressedArrayTexture?je.setTexture2DArray(d,0):je.setTexture2D(d,0),Ae.unbindTexture()},this.resetState=function(){L=0,k=0,H=null,Ae.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}class db{experience;scene;instance;constructor(){this.experience=new xi,this.scene=this.experience.scene,this.setInstance()}setInstance(){this.instance=new Qt,this.instance.position.set(0,-.4,15),this.scene.add(this.instance)}}class fb{experience;canvas;sizes;instance;constructor(){this.experience=new xi,this.canvas=this.experience.canvas,this.sizes=this.experience.sizes,this.setInstance()}setInstance(){this.instance=new hb({canvas:this.canvas,antialias:!0}),this.instance.setClearColor(0,1),this.instance.setSize(this.sizes.width,this.sizes.height),this.instance.setPixelRatio(this.sizes.pixelRatio)}resize(){this.instance.setSize(this.sizes.width,this.sizes.height),this.instance.setPixelRatio(this.sizes.pixelRatio)}}const pb=`void main() {
    gl_Position = vec4(position, 1.0);
}`,zd=`#define MAX_STEPS 40
#define MAX_METABALLS 32

// Les Uniforms d'origine
uniform int uMetaballsCount;
uniform vec2 uResolution;
uniform vec4 uMetaballs[MAX_METABALLS];
uniform float uMaxDistance;
uniform float uSurfaceDistance;
uniform float uMergeForce;
uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform vec3 uBaseColor;
uniform float uAmbientStrength;
uniform float uDiffuseIntensity;

// 🟢 NOUVEAUX UNIFORMS : La caméra et la profondeur
uniform sampler2D uSceneTexture;
uniform sampler2D uSceneDepth;
uniform mat4 uCameraMatrixWorld;
uniform mat4 uProjectionMatrixInverse;
uniform mat4 uViewMatrix;
uniform float uCameraNear;
uniform float uCameraFar;

out vec4 fragColor;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float getDist(vec3 p) {
    float globalDist = uMaxDistance;
    for(int i = 0; i < MAX_METABALLS; i++) {
        if (i >= uMetaballsCount) break;
        vec4 mb = uMetaballs[i]; 
        float sphereDist = length(p - mb.xyz) - mb.w;
        globalDist = smin(globalDist, sphereDist, uMergeForce);
    }
    return globalDist;
}

float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.; 
    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd * dO; 
        float dS = getDist(p); 
        dO += dS; 
        if(dS < uSurfaceDistance || dO > uMaxDistance) break;
    }
    return dO; 
}

// 🟢 UTILITAIRE 1 : Convertir la profondeur en distance réelle
float perspectiveDepthToViewZ(float depth, float near, float far) {
    return (near * far) / ((far - near) * depth - far);
}

// 🟢 UTILITAIRE 2 : Reconstruire le rayon 3D depuis la vraie caméra
vec3 getRayDirection(vec2 fragCoord) {
    vec2 ndc = (fragCoord / uResolution) * 2.0 - 1.0;
    vec4 viewDirection = uProjectionMatrixInverse * vec4(ndc, -1.0, 1.0);
    viewDirection = vec4(viewDirection.xy, -1.0, 0.0);
    return normalize((uCameraMatrixWorld * viewDirection).xyz);
}

vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 e = vec2(.01, 0); 
    vec3 n = d - vec3(
        getDist(p-e.xyy),
        getDist(p-e.yxy),
        getDist(p-e.yyx));
    return normalize(n);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec4 sceneColor = texture(uSceneTexture, uv); // L'image de la méduse

    // 🟢 Utilisation de la vraie caméra
    vec3 ro = uCameraPosition;
    vec3 rd = getRayDirection(gl_FragCoord.xy);

    float d = rayMarch(ro, rd);

    if(d < uMaxDistance) {
        vec3 p = ro + rd * d; 
        
        // 🟢 TEST D'OCCLUSION (Z-Testing)
        vec4 viewPosition = uViewMatrix * vec4(p, 1.0);
        float hitViewZ = viewPosition.z; // Profondeur de la metaball
        
        float sceneDepth = texture(uSceneDepth, uv).x; // Profondeur de la méduse
        float sceneViewZ = perspectiveDepthToViewZ(sceneDepth, uCameraNear, uCameraFar);

        // Si la metaball est cachée derrière la méduse, on annule et on affiche la méduse
        if(sceneDepth < 1.0 && hitViewZ < sceneViewZ - 0.02) {
            fragColor = sceneColor;
            return;
        }

        // Sinon, on dessine la metaball (avec la lumière)
        vec3 normal = getNormal(p); 
        vec3 lightDir = normalize(uLightPosition - p); 
        float dif = clamp(dot(normal, lightDir), 0., 1.);
        vec3 metaballColor = uBaseColor * dif * uDiffuseIntensity + vec3(uAmbientStrength); 
        
        // On remplace le fond par la metaball
        fragColor = vec4(metaballColor, 1.0);
    } else {
        // Le rayon part dans le vide : on affiche la scène normale
        fragColor = sceneColor;
    }
}`;class mb{metaballsData=[];initialPositions=[];floatParams=[];burstDirections=[];burstValues={currentForce:0,targetForce:0};experience;debugParams={floatAmplitudeMultiplier:1,sphereBoundaryRadius:1.5,metaballRadiusMultiplier:.5,burstExitSpeed:.2,burstBackSpeed:.15,targetBurst:4,uMetaballsCount:10,uSurfaceDistance:.01,uMaxDistance:100,uCameraPosition:new F(0,0,6),maxMetaballNumber:32,uMergeForce:.8,uFov:1,uLightPosition:new F(2,5,3),uBaseColor:new Ce("#ffffff"),uAmbientStrength:.1,uDiffuseIntensity:1};audio;material;constructor(){this.experience=new xi,this.initMetaballs(),this.setupDebug(),this.audio=this.experience.soundManager.audio}initBallsArray(){for(let e=0;e<this.debugParams.maxMetaballNumber;e++){const t=Math.random(),n=Math.random(),s=t*2*Math.PI,r=Math.acos(2*n-1),o=Math.cbrt(Math.random())*this.debugParams.sphereBoundaryRadius,a=o*Math.sin(r)*Math.cos(s),l=o*Math.sin(r)*Math.sin(s),c=o*Math.cos(r);this.initialPositions.push(new F(a,l,c));const u=.3+Math.random()*this.debugParams.metaballRadiusMultiplier;this.metaballsData.push(new at(a,l,c,u));const h=new F(a,l,c).normalize();this.burstDirections.push(h),this.floatParams.push({amplitude:.2+Math.random()*.8,speed:new F(.5+Math.random(),.5+Math.random(),.5+Math.random()),offset:new F(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2)})}}initMetaballs(){this.initBallsArray(),this.material=new Tt({vertexShader:pb,fragmentShader:zd,uniforms:{uResolution:{value:new Me(this.experience.sizes.width*this.experience.sizes.pixelRatio,this.experience.sizes.height*this.experience.sizes.pixelRatio)},uMetaballs:{value:this.metaballsData},uMetaballsCount:{value:this.debugParams.uMetaballsCount},uMaxDistance:{value:this.debugParams.uMaxDistance},uSurfaceDistance:{value:this.debugParams.uSurfaceDistance},uMergeForce:{value:this.debugParams.uMergeForce},uCameraPosition:{value:new F(this.debugParams.uCameraPosition.x,this.debugParams.uCameraPosition.y,this.debugParams.uCameraPosition.z)},uFov:{value:this.debugParams.uFov},uLightPosition:{value:new F(this.debugParams.uLightPosition.x,this.debugParams.uLightPosition.y,this.debugParams.uLightPosition.z)},uBaseColor:{value:this.debugParams.uBaseColor},uAmbientStrength:{value:this.debugParams.uAmbientStrength},uDiffuseIntensity:{value:this.debugParams.uDiffuseIntensity}}})}update(){const e=this.audio.volumeSmooth;this.material.uniforms.uFov.value=At.lerp(this.material.uniforms.uFov.value,e,.5),this.material.uniforms.uMergeForce.value=Math.min(.6,this.audio.volumeSmooth),this.burstValues.targetForce=this.audio.kick*4,this.burstValues.currentForce=At.lerp(this.burstValues.currentForce,this.burstValues.targetForce,this.debugParams.burstExitSpeed),this.burstValues.targetForce=At.lerp(this.burstValues.targetForce,0,this.debugParams.burstBackSpeed);for(let t=0;t<this.debugParams.uMetaballsCount;t++){const n=this.metaballsData[t],s=this.initialPositions[t],r=this.floatParams[t],o=this.burstDirections[t],a=Math.sin(this.experience.time.elapsed*r.speed.x+r.offset.x)*r.amplitude,l=Math.cos(this.experience.time.elapsed*r.speed.y+r.offset.y)*r.amplitude,c=Math.sin(this.experience.time.elapsed*r.speed.z+r.offset.z)*r.amplitude,u=o.x*this.burstValues.currentForce*r.amplitude,h=o.y*this.burstValues.currentForce*r.amplitude,f=o.z*this.burstValues.currentForce*r.amplitude;n.x=s.x+a*this.debugParams.floatAmplitudeMultiplier+u,n.y=s.y+l*this.debugParams.floatAmplitudeMultiplier+h,n.z=s.z+c*this.debugParams.floatAmplitudeMultiplier+f}}resetMetaBalls(){this.metaballsData.length=0,this.initialPositions.length=0,this.floatParams.length=0,this.burstDirections.length=0}setupDebug(){const e=this.experience.debug.metaballs,t=e.addFolder({title:"Configuration & Anim"});t.addBinding(this.debugParams,"floatAmplitudeMultiplier",{label:"Float Amplitude",min:0,max:3,step:.1}),t.addBinding(this.debugParams,"sphereBoundaryRadius",{label:"Spawn Radius",min:.5,max:5,step:.1}),t.addBinding(this.debugParams,"metaballRadiusMultiplier",{label:"Ball Size Scale",min:.1,max:2,step:.05}),t.addBinding(this.debugParams,"burstExitSpeed",{label:"Burst Speed",min:.01,max:1,step:.01}),t.addBinding(this.debugParams,"burstBackSpeed",{label:"Return Speed",min:.01,max:.5,step:.01}),t.addBinding(this.debugParams,"targetBurst",{label:"Burst Force",min:1,max:10,step:.5}),e.addButton({title:"Burst",label:"Trigger"}).on("click",()=>{this.burstValues.targetForce=this.debugParams.targetBurst}),e.addButton({title:"ReInit",label:"Trigger"}).on("click",()=>{this.resetMetaBalls(),this.initBallsArray()});const n=e.addFolder({title:"Shader Uniforms"});n.addBinding(this.debugParams,"uMetaballsCount",{label:"Metaballs Count",min:1,max:this.debugParams.maxMetaballNumber,step:1}).on("change",s=>{this.material?.uniforms.uMetaballsCount&&(this.material.uniforms.uMetaballsCount.value=s.value)}),n.addBinding(this.debugParams,"uMergeForce",{label:"Glow / Merge Force",min:.1,max:2,step:.05}).on("change",s=>{this.material?.uniforms.uMergeForce&&(this.material.uniforms.uMergeForce.value=s.value)}),n.addBinding(this.debugParams,"uSurfaceDistance",{label:"Surface Dist",min:.001,max:.2,step:.001}).on("change",s=>{this.material?.uniforms.uSurfaceDistance&&(this.material.uniforms.uSurfaceDistance.value=s.value)}),n.addBinding(this.debugParams,"uMaxDistance",{label:"Max Render Dist",min:10,max:300,step:5}).on("change",s=>{this.material?.uniforms.uMaxDistance&&(this.material.uniforms.uMaxDistance.value=s.value)}),n.addBinding(this.debugParams,"uCameraPosition",{label:"Camera Position"}).on("change",s=>{this.material?.uniforms.uCameraPosition&&this.material.uniforms.uCameraPosition.value.copy(s.value)}),n.addBinding(this.debugParams,"uFov",{label:"Field of view",min:0,max:3,step:.01}).on("change",s=>{this.material?.uniforms.uFov&&(this.material.uniforms.uFov.value=s.value)}),n.addBinding(this.debugParams,"uLightPosition",{label:"Light Position"}).on("change",s=>{this.material?.uniforms.uLightPosition&&this.material.uniforms.uLightPosition.value.copy(s.value)}),n.addBinding(this.debugParams,"uBaseColor",{view:"color",color:{type:"float"}}).on("change",s=>{this.material?.uniforms.uBaseColor&&this.material.uniforms.uBaseColor.value.setRGB(s.value.r,s.value.g,s.value.b)}),n.addBinding(this.debugParams,"uAmbientStrength",{label:"Ambiant Strength",min:0,max:1,step:.01}).on("change",s=>{this.material?.uniforms.uAmbientStrength&&(this.material.uniforms.uAmbientStrength.value=s.value)}),n.addBinding(this.debugParams,"uDiffuseIntensity",{label:"Diffuse Intensity",min:0,max:1,step:.01}).on("change",s=>{this.material?.uniforms.uDiffuseIntensity&&(this.material.uniforms.uDiffuseIntensity.value=s.value)})}}class gb{experience;scene;metaBallsManager;constructor(){this.experience=new xi,this.scene=this.experience.scene,this.metaBallsManager=new mb}update(){this.metaBallsManager.update()}}/*! Tweakpane 4.0.5 (c) 2016 cocopon, licensed under the MIT license. */function xt(i){return i==null}function Nc(i){return i!==null&&typeof i=="object"}function ec(i){return i!==null&&typeof i=="object"}function vb(i,e){if(i.length!==e.length)return!1;for(let t=0;t<i.length;t++)if(i[t]!==e[t])return!1;return!0}function ts(i,e){return Array.from(new Set([...Object.keys(i),...Object.keys(e)])).reduce((n,s)=>{const r=i[s],o=e[s];return ec(r)&&ec(o)?Object.assign(Object.assign({},n),{[s]:ts(r,o)}):Object.assign(Object.assign({},n),{[s]:s in e?o:r})},{})}function kc(i){return Nc(i)?"target"in i:!1}const _b={alreadydisposed:()=>"View has been already disposed",invalidparams:i=>`Invalid parameters for '${i.name}'`,nomatchingcontroller:i=>`No matching controller for '${i.key}'`,nomatchingview:i=>`No matching view for '${JSON.stringify(i.params)}'`,notbindable:()=>"Value is not bindable",notcompatible:i=>`Not compatible with  plugin '${i.id}'`,propertynotfound:i=>`Property '${i.name}' not found`,shouldneverhappen:()=>"This error should never happen"};class Lt{static alreadyDisposed(){return new Lt({type:"alreadydisposed"})}static notBindable(){return new Lt({type:"notbindable"})}static notCompatible(e,t){return new Lt({type:"notcompatible",context:{id:`${e}.${t}`}})}static propertyNotFound(e){return new Lt({type:"propertynotfound",context:{name:e}})}static shouldNeverHappen(){return new Lt({type:"shouldneverhappen"})}constructor(e){var t;this.message=(t=_b[e.type](e.context))!==null&&t!==void 0?t:"Unexpected error",this.name=this.constructor.name,this.stack=new Error(this.message).stack,this.type=e.type}toString(){return this.message}}class Ko{constructor(e,t){this.obj_=e,this.key=t}static isBindable(e){return!(e===null||typeof e!="object"&&typeof e!="function")}read(){return this.obj_[this.key]}write(e){this.obj_[this.key]=e}writeProperty(e,t){const n=this.read();if(!Ko.isBindable(n))throw Lt.notBindable();if(!(e in n))throw Lt.propertyNotFound(e);n[e]=t}}class Bt{constructor(){this.observers_={}}on(e,t,n){var s;let r=this.observers_[e];return r||(r=this.observers_[e]=[]),r.push({handler:t,key:(s=n?.key)!==null&&s!==void 0?s:t}),this}off(e,t){const n=this.observers_[e];return n&&(this.observers_[e]=n.filter(s=>s.key!==t)),this}emit(e,t){const n=this.observers_[e];n&&n.forEach(s=>{s.handler(t)})}}class xb{constructor(e,t){var n;this.constraint_=t?.constraint,this.equals_=(n=t?.equals)!==null&&n!==void 0?n:((s,r)=>s===r),this.emitter=new Bt,this.rawValue_=e}get constraint(){return this.constraint_}get rawValue(){return this.rawValue_}set rawValue(e){this.setRawValue(e,{forceEmit:!1,last:!0})}setRawValue(e,t){const n=t??{forceEmit:!1,last:!0},s=this.constraint_?this.constraint_.constrain(e):e,r=this.rawValue_;this.equals_(r,s)&&!n.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.rawValue_=s,this.emitter.emit("change",{options:n,previousRawValue:r,rawValue:s,sender:this}))}}class bb{constructor(e){this.emitter=new Bt,this.value_=e}get rawValue(){return this.value_}set rawValue(e){this.setRawValue(e,{forceEmit:!1,last:!0})}setRawValue(e,t){const n=t??{forceEmit:!1,last:!0},s=this.value_;s===e&&!n.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.value_=e,this.emitter.emit("change",{options:n,previousRawValue:s,rawValue:this.value_,sender:this}))}}class yb{constructor(e){this.emitter=new Bt,this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.value_=e,this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_)}get rawValue(){return this.value_.rawValue}onValueBeforeChange_(e){this.emitter.emit("beforechange",Object.assign(Object.assign({},e),{sender:this}))}onValueChange_(e){this.emitter.emit("change",Object.assign(Object.assign({},e),{sender:this}))}}function Ct(i,e){const t=e?.constraint,n=e?.equals;return!t&&!n?new bb(i):new xb(i,e)}function Sb(i){return[new yb(i),(e,t)=>{i.setRawValue(e,t)}]}class tt{constructor(e){this.emitter=new Bt,this.valMap_=e;for(const t in this.valMap_)this.valMap_[t].emitter.on("change",()=>{this.emitter.emit("change",{key:t,sender:this})})}static createCore(e){return Object.keys(e).reduce((n,s)=>Object.assign(n,{[s]:Ct(e[s])}),{})}static fromObject(e){const t=this.createCore(e);return new tt(t)}get(e){return this.valMap_[e].rawValue}set(e,t){this.valMap_[e].rawValue=t}value(e){return this.valMap_[e]}}class Nr{constructor(e){this.values=tt.fromObject({max:e.max,min:e.min})}constrain(e){const t=this.values.get("max"),n=this.values.get("min");return Math.min(Math.max(e,n),t)}}class wb{constructor(e){this.values=tt.fromObject({max:e.max,min:e.min})}constrain(e){const t=this.values.get("max"),n=this.values.get("min");let s=e;return xt(n)||(s=Math.max(s,n)),xt(t)||(s=Math.min(s,t)),s}}class Mb{constructor(e,t=0){this.step=e,this.origin=t}constrain(e){const t=this.origin%this.step,n=Math.round((e-t)/this.step);return t+n*this.step}}class Eb{constructor(e){this.text=e}evaluate(){return Number(this.text)}toString(){return this.text}}const Tb={"**":(i,e)=>Math.pow(i,e),"*":(i,e)=>i*e,"/":(i,e)=>i/e,"%":(i,e)=>i%e,"+":(i,e)=>i+e,"-":(i,e)=>i-e,"<<":(i,e)=>i<<e,">>":(i,e)=>i>>e,">>>":(i,e)=>i>>>e,"&":(i,e)=>i&e,"^":(i,e)=>i^e,"|":(i,e)=>i|e};class Cb{constructor(e,t,n){this.left=t,this.operator=e,this.right=n}evaluate(){const e=Tb[this.operator];if(!e)throw new Error(`unexpected binary operator: '${this.operator}`);return e(this.left.evaluate(),this.right.evaluate())}toString(){return["b(",this.left.toString(),this.operator,this.right.toString(),")"].join(" ")}}const Ab={"+":i=>i,"-":i=>-i,"~":i=>~i};class Pb{constructor(e,t){this.operator=e,this.expression=t}evaluate(){const e=Ab[this.operator];if(!e)throw new Error(`unexpected unary operator: '${this.operator}`);return e(this.expression.evaluate())}toString(){return["u(",this.operator,this.expression.toString(),")"].join(" ")}}function Fc(i){return(e,t)=>{for(let n=0;n<i.length;n++){const s=i[n](e,t);if(s!=="")return s}return""}}function Cr(i,e){var t;const n=i.substr(e).match(/^\s+/);return(t=n&&n[0])!==null&&t!==void 0?t:""}function Rb(i,e){const t=i.substr(e,1);return t.match(/^[1-9]$/)?t:""}function Ar(i,e){var t;const n=i.substr(e).match(/^[0-9]+/);return(t=n&&n[0])!==null&&t!==void 0?t:""}function Db(i,e){const t=Ar(i,e);if(t!=="")return t;const n=i.substr(e,1);if(e+=1,n!=="-"&&n!=="+")return"";const s=Ar(i,e);return s===""?"":n+s}function Bc(i,e){const t=i.substr(e,1);if(e+=1,t.toLowerCase()!=="e")return"";const n=Db(i,e);return n===""?"":t+n}function Vd(i,e){const t=i.substr(e,1);if(t==="0")return t;const n=Rb(i,e);return e+=n.length,n===""?"":n+Ar(i,e)}function Ib(i,e){const t=Vd(i,e);if(e+=t.length,t==="")return"";const n=i.substr(e,1);if(e+=n.length,n!==".")return"";const s=Ar(i,e);return e+=s.length,t+n+s+Bc(i,e)}function Lb(i,e){const t=i.substr(e,1);if(e+=t.length,t!==".")return"";const n=Ar(i,e);return e+=n.length,n===""?"":t+n+Bc(i,e)}function Ub(i,e){const t=Vd(i,e);return e+=t.length,t===""?"":t+Bc(i,e)}const Ob=Fc([Ib,Lb,Ub]);function Nb(i,e){var t;const n=i.substr(e).match(/^[01]+/);return(t=n&&n[0])!==null&&t!==void 0?t:""}function kb(i,e){const t=i.substr(e,2);if(e+=t.length,t.toLowerCase()!=="0b")return"";const n=Nb(i,e);return n===""?"":t+n}function Fb(i,e){var t;const n=i.substr(e).match(/^[0-7]+/);return(t=n&&n[0])!==null&&t!==void 0?t:""}function Bb(i,e){const t=i.substr(e,2);if(e+=t.length,t.toLowerCase()!=="0o")return"";const n=Fb(i,e);return n===""?"":t+n}function zb(i,e){var t;const n=i.substr(e).match(/^[0-9a-f]+/i);return(t=n&&n[0])!==null&&t!==void 0?t:""}function Vb(i,e){const t=i.substr(e,2);if(e+=t.length,t.toLowerCase()!=="0x")return"";const n=zb(i,e);return n===""?"":t+n}const Hb=Fc([kb,Bb,Vb]),Gb=Fc([Hb,Ob]);function Wb(i,e){const t=Gb(i,e);return e+=t.length,t===""?null:{evaluable:new Eb(t),cursor:e}}function Xb(i,e){const t=i.substr(e,1);if(e+=t.length,t!=="(")return null;const n=Gd(i,e);if(!n)return null;e=n.cursor,e+=Cr(i,e).length;const s=i.substr(e,1);return e+=s.length,s!==")"?null:{evaluable:n.evaluable,cursor:e}}function qb(i,e){var t;return(t=Wb(i,e))!==null&&t!==void 0?t:Xb(i,e)}function Hd(i,e){const t=qb(i,e);if(t)return t;const n=i.substr(e,1);if(e+=n.length,n!=="+"&&n!=="-"&&n!=="~")return null;const s=Hd(i,e);return s?(e=s.cursor,{cursor:e,evaluable:new Pb(n,s.evaluable)}):null}function jb(i,e,t){t+=Cr(e,t).length;const n=i.filter(s=>e.startsWith(s,t))[0];return n?(t+=n.length,t+=Cr(e,t).length,{cursor:t,operator:n}):null}function Kb(i,e){return(t,n)=>{const s=i(t,n);if(!s)return null;n=s.cursor;let r=s.evaluable;for(;;){const o=jb(e,t,n);if(!o)break;n=o.cursor;const a=i(t,n);if(!a)return null;n=a.cursor,r=new Cb(o.operator,r,a.evaluable)}return r?{cursor:n,evaluable:r}:null}}const Yb=[["**"],["*","/","%"],["+","-"],["<<",">>>",">>"],["&"],["^"],["|"]].reduce((i,e)=>Kb(i,e),Hd);function Gd(i,e){return e+=Cr(i,e).length,Yb(i,e)}function $b(i){const e=Gd(i,0);return!e||e.cursor+Cr(i,e.cursor).length!==i.length?null:e.evaluable}function mi(i){var e;const t=$b(i);return(e=t?.evaluate())!==null&&e!==void 0?e:null}function Wd(i){if(typeof i=="number")return i;if(typeof i=="string"){const e=mi(i);if(!xt(e))return e}return 0}function Zb(i){return String(i)}function cn(i){return e=>e.toFixed(Math.max(Math.min(i,20),0))}function ft(i,e,t,n,s){const r=(i-e)/(t-e);return n+r*(s-n)}function Sh(i){return String(i.toFixed(10)).split(".")[1].replace(/0+$/,"").length}function zt(i,e,t){return Math.min(Math.max(i,e),t)}function Xd(i,e){return(i%e+e)%e}function Jb(i,e){return xt(i.step)?Math.max(Sh(e),2):Sh(i.step)}function qd(i){var e;return(e=i.step)!==null&&e!==void 0?e:1}function jd(i,e){var t;const n=Math.abs((t=i.step)!==null&&t!==void 0?t:e);return n===0?.1:Math.pow(10,Math.floor(Math.log10(n))-1)}function Kd(i,e){return xt(i.step)?null:new Mb(i.step,e)}function Yd(i){return!xt(i.max)&&!xt(i.min)?new Nr({max:i.max,min:i.min}):!xt(i.max)||!xt(i.min)?new wb({max:i.max,min:i.min}):null}function $d(i,e){var t,n,s;return{formatter:(t=i.format)!==null&&t!==void 0?t:cn(Jb(i,e)),keyScale:(n=i.keyScale)!==null&&n!==void 0?n:qd(i),pointerScale:(s=i.pointerScale)!==null&&s!==void 0?s:jd(i,e)}}function Zd(i){return{format:i.optional.function,keyScale:i.optional.number,max:i.optional.number,min:i.optional.number,pointerScale:i.optional.number,step:i.optional.number}}function zc(i){return{constraint:i.constraint,textProps:tt.fromObject($d(i.params,i.initialValue))}}class rs{constructor(e){this.controller=e}get element(){return this.controller.view.element}get disabled(){return this.controller.viewProps.get("disabled")}set disabled(e){this.controller.viewProps.set("disabled",e)}get hidden(){return this.controller.viewProps.get("hidden")}set hidden(e){this.controller.viewProps.set("hidden",e)}dispose(){this.controller.viewProps.set("disposed",!0)}importState(e){return this.controller.importState(e)}exportState(){return this.controller.exportState()}}class oa{constructor(e){this.target=e}}class kr extends oa{constructor(e,t,n){super(e),this.value=t,this.last=n??!0}}class Qb extends oa{constructor(e,t){super(e),this.expanded=t}}class ey extends oa{constructor(e,t){super(e),this.index=t}}class ty extends oa{constructor(e,t){super(e),this.native=t}}class Pr extends rs{constructor(e){super(e),this.onValueChange_=this.onValueChange_.bind(this),this.emitter_=new Bt,this.controller.value.emitter.on("change",this.onValueChange_)}get label(){return this.controller.labelController.props.get("label")}set label(e){this.controller.labelController.props.set("label",e)}get key(){return this.controller.value.binding.target.key}get tag(){return this.controller.tag}set tag(e){this.controller.tag=e}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}refresh(){this.controller.value.fetch()}onValueChange_(e){const t=this.controller.value;this.emitter_.emit("change",new kr(this,t.binding.target.read(),e.options.last))}}class ny{constructor(e,t){this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.binding=t,this.value_=e,this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_),this.emitter=new Bt}get rawValue(){return this.value_.rawValue}set rawValue(e){this.value_.rawValue=e}setRawValue(e,t){this.value_.setRawValue(e,t)}fetch(){this.value_.rawValue=this.binding.read()}push(){this.binding.write(this.value_.rawValue)}onValueBeforeChange_(e){this.emitter.emit("beforechange",Object.assign(Object.assign({},e),{sender:this}))}onValueChange_(e){this.push(),this.emitter.emit("change",Object.assign(Object.assign({},e),{sender:this}))}}function iy(i){if(!("binding"in i))return!1;const e=i.binding;return kc(e)&&"read"in e&&"write"in e}function sy(i,e){const n=Object.keys(e).reduce((s,r)=>{if(s===void 0)return;const o=e[r],a=o(i[r]);return a.succeeded?Object.assign(Object.assign({},s),{[r]:a.value}):void 0},{});return n}function ry(i,e){return i.reduce((t,n)=>{if(t===void 0)return;const s=e(n);if(!(!s.succeeded||s.value===void 0))return[...t,s.value]},[])}function oy(i){return i===null?!1:typeof i=="object"}function oi(i){return e=>t=>{if(!e&&t===void 0)return{succeeded:!1,value:void 0};if(e&&t===void 0)return{succeeded:!0,value:void 0};const n=i(t);return n!==void 0?{succeeded:!0,value:n}:{succeeded:!1,value:void 0}}}function wh(i){return{custom:e=>oi(e)(i),boolean:oi(e=>typeof e=="boolean"?e:void 0)(i),number:oi(e=>typeof e=="number"?e:void 0)(i),string:oi(e=>typeof e=="string"?e:void 0)(i),function:oi(e=>typeof e=="function"?e:void 0)(i),constant:e=>oi(t=>t===e?e:void 0)(i),raw:oi(e=>e)(i),object:e=>oi(t=>{if(oy(t))return sy(t,e)})(i),array:e=>oi(t=>{if(Array.isArray(t))return ry(t,e)})(i)}}const tc={optional:wh(!0),required:wh(!1)};function Dt(i,e){const t=e(tc),n=tc.required.object(t)(i);return n.succeeded?n.value:void 0}function fn(i,e,t,n){if(e&&!e(i))return!1;const s=Dt(i,t);return s?n(s):!1}function pn(i,e){var t;return ts((t=i?.())!==null&&t!==void 0?t:{},e)}function es(i){return"value"in i}function Jd(i){if(!Nc(i)||!("binding"in i))return!1;const e=i.binding;return kc(e)}const Wn="http://www.w3.org/2000/svg";function Yo(i){i.offsetHeight}function ay(i,e){const t=i.style.transition;i.style.transition="none",e(),i.style.transition=t}function Vc(i){return i.ontouchstart!==void 0}function ly(){return globalThis}function cy(){return ly().document}function uy(i){const e=i.ownerDocument.defaultView;return e&&"document"in e?i.getContext("2d",{willReadFrequently:!0}):null}const hy={check:'<path d="M2 8l4 4l8 -8"/>',dropdown:'<path d="M5 7h6l-3 3 z"/>',p2dpad:'<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'};function aa(i,e){const t=i.createElementNS(Wn,"svg");return t.innerHTML=hy[e],t}function Qd(i,e,t){i.insertBefore(e,i.children[t])}function Hc(i){i.parentElement&&i.parentElement.removeChild(i)}function ef(i){for(;i.children.length>0;)i.removeChild(i.children[0])}function dy(i){for(;i.childNodes.length>0;)i.removeChild(i.childNodes[0])}function tf(i){return i.relatedTarget?i.relatedTarget:"explicitOriginalTarget"in i?i.explicitOriginalTarget:null}function pi(i,e){i.emitter.on("change",t=>{e(t.rawValue)}),e(i.rawValue)}function Kn(i,e,t){pi(i.value(e),t)}const fy="tp";function lt(i){return(t,n)=>[fy,"-",i,"v",t?`_${t}`:"",n?`-${n}`:""].join("")}const cr=lt("lbl");function py(i,e){const t=i.createDocumentFragment();return e.split(`
`).map(s=>i.createTextNode(s)).forEach((s,r)=>{r>0&&t.appendChild(i.createElement("br")),t.appendChild(s)}),t}class nf{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(cr()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(cr("l")),Kn(t.props,"label",r=>{xt(r)?this.element.classList.add(cr(void 0,"nol")):(this.element.classList.remove(cr(void 0,"nol")),dy(n),n.appendChild(py(e,r)))}),this.element.appendChild(n),this.labelElement=n;const s=e.createElement("div");s.classList.add(cr("v")),this.element.appendChild(s),this.valueElement=s}}class sf{constructor(e,t){this.props=t.props,this.valueController=t.valueController,this.viewProps=t.valueController.viewProps,this.view=new nf(e,{props:t.props,viewProps:this.viewProps}),this.view.valueElement.appendChild(this.valueController.view.element)}importProps(e){return fn(e,null,t=>({label:t.optional.string}),t=>(this.props.set("label",t.label),!0))}exportProps(){return pn(null,{label:this.props.get("label")})}}function my(){return["veryfirst","first","last","verylast"]}const Mh=lt(""),Eh={veryfirst:"vfst",first:"fst",last:"lst",verylast:"vlst"};class la{constructor(e){this.parent_=null,this.blade=e.blade,this.view=e.view,this.viewProps=e.viewProps;const t=this.view.element;this.blade.value("positions").emitter.on("change",()=>{my().forEach(n=>{t.classList.remove(Mh(void 0,Eh[n]))}),this.blade.get("positions").forEach(n=>{t.classList.add(Mh(void 0,Eh[n]))})}),this.viewProps.handleDispose(()=>{Hc(t)})}get parent(){return this.parent_}set parent(e){this.parent_=e,this.viewProps.set("parent",this.parent_?this.parent_.viewProps:null)}importState(e){return fn(e,null,t=>({disabled:t.required.boolean,hidden:t.required.boolean}),t=>(this.viewProps.importState(t),!0))}exportState(){return pn(null,Object.assign({},this.viewProps.exportState()))}}class ns extends la{constructor(e,t){if(t.value!==t.valueController.value)throw Lt.shouldNeverHappen();const n=t.valueController.viewProps,s=new sf(e,{blade:t.blade,props:t.props,valueController:t.valueController});super(Object.assign(Object.assign({},t),{view:new nf(e,{props:t.props,viewProps:n}),viewProps:n})),this.labelController=s,this.value=t.value,this.valueController=t.valueController,this.view.valueElement.appendChild(this.valueController.view.element)}importState(e){return fn(e,t=>{var n,s,r;return super.importState(t)&&this.labelController.importProps(t)&&((r=(s=(n=this.valueController).importProps)===null||s===void 0?void 0:s.call(n,e))!==null&&r!==void 0?r:!0)},t=>({value:t.optional.raw}),t=>(t.value&&(this.value.rawValue=t.value),!0))}exportState(){var e,t,n;return pn(()=>super.exportState(),Object.assign(Object.assign({value:this.value.rawValue},this.labelController.exportProps()),(n=(t=(e=this.valueController).exportProps)===null||t===void 0?void 0:t.call(e))!==null&&n!==void 0?n:{}))}}function Th(i){const e=Object.assign({},i);return delete e.value,e}class rf extends ns{constructor(e,t){super(e,t),this.tag=t.tag}importState(e){return fn(e,t=>super.importState(Th(e)),t=>({tag:t.optional.string}),t=>(this.tag=t.tag,!0))}exportState(){return pn(()=>Th(super.exportState()),{binding:{key:this.value.binding.target.key,value:this.value.binding.target.read()},tag:this.tag})}}function gy(i){return es(i)&&Jd(i.value)}class vy extends rf{importState(e){return fn(e,t=>super.importState(t),t=>({binding:t.required.object({value:t.required.raw})}),t=>(this.value.binding.inject(t.binding.value),this.value.fetch(),!0))}}function _y(i){return es(i)&&iy(i.value)}function of(i,e){for(;i.length<e;)i.push(void 0)}function xy(i){const e=[];return of(e,i),e}function by(i){const e=i.indexOf(void 0);return e<0?i:i.slice(0,e)}function yy(i,e){const t=[...by(i),e];return t.length>i.length?t.splice(0,t.length-i.length):of(t,i.length),t}class Sy{constructor(e){this.emitter=new Bt,this.onTick_=this.onTick_.bind(this),this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.binding=e.binding,this.value_=Ct(xy(e.bufferSize)),this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_),this.ticker=e.ticker,this.ticker.emitter.on("tick",this.onTick_),this.fetch()}get rawValue(){return this.value_.rawValue}set rawValue(e){this.value_.rawValue=e}setRawValue(e,t){this.value_.setRawValue(e,t)}fetch(){this.value_.rawValue=yy(this.value_.rawValue,this.binding.read())}onTick_(){this.fetch()}onValueBeforeChange_(e){this.emitter.emit("beforechange",Object.assign(Object.assign({},e),{sender:this}))}onValueChange_(e){this.emitter.emit("change",Object.assign(Object.assign({},e),{sender:this}))}}function wy(i){if(!("binding"in i))return!1;const e=i.binding;return kc(e)&&"read"in e&&!("write"in e)}class My extends rf{exportState(){return pn(()=>super.exportState(),{binding:{readonly:!0}})}}function Ey(i){return es(i)&&wy(i.value)}class Ty extends rs{get label(){return this.controller.labelController.props.get("label")}set label(e){this.controller.labelController.props.set("label",e)}get title(){var e;return(e=this.controller.buttonController.props.get("title"))!==null&&e!==void 0?e:""}set title(e){this.controller.buttonController.props.set("title",e)}on(e,t){const n=t.bind(this);return this.controller.buttonController.emitter.on(e,r=>{n(new ty(this,r.nativeEvent))}),this}off(e,t){return this.controller.buttonController.emitter.off(e,t),this}}function Cy(i,e,t){t?i.classList.add(e):i.classList.remove(e)}function $s(i,e){return t=>{Cy(i,e,t)}}function Gc(i,e){pi(i,t=>{e.textContent=t??""})}const qa=lt("btn");class Ay{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(qa()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("button");n.classList.add(qa("b")),t.viewProps.bindDisabled(n),this.element.appendChild(n),this.buttonElement=n;const s=e.createElement("div");s.classList.add(qa("t")),Gc(t.props.value("title"),s),this.buttonElement.appendChild(s)}}class Py{constructor(e,t){this.emitter=new Bt,this.onClick_=this.onClick_.bind(this),this.props=t.props,this.viewProps=t.viewProps,this.view=new Ay(e,{props:this.props,viewProps:this.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}importProps(e){return fn(e,null,t=>({title:t.optional.string}),t=>(this.props.set("title",t.title),!0))}exportProps(){return pn(null,{title:this.props.get("title")})}onClick_(e){this.emitter.emit("click",{nativeEvent:e,sender:this})}}class Ch extends la{constructor(e,t){const n=new Py(e,{props:t.buttonProps,viewProps:t.viewProps}),s=new sf(e,{blade:t.blade,props:t.labelProps,valueController:n});super({blade:t.blade,view:s.view,viewProps:t.viewProps}),this.buttonController=n,this.labelController=s}importState(e){return fn(e,t=>super.importState(t)&&this.buttonController.importProps(t)&&this.labelController.importProps(t),()=>({}),()=>!0)}exportState(){return pn(()=>super.exportState(),Object.assign(Object.assign({},this.buttonController.exportProps()),this.labelController.exportProps()))}}class af{constructor(e){const[t,n]=e.split("-"),s=t.split(".");this.major=parseInt(s[0],10),this.minor=parseInt(s[1],10),this.patch=parseInt(s[2],10),this.prerelease=n??null}toString(){const e=[this.major,this.minor,this.patch].join(".");return this.prerelease!==null?[e,this.prerelease].join("-"):e}}const Zs=new af("2.0.5");function tn(i){return Object.assign({core:Zs},i)}const Ry=tn({id:"button",type:"blade",accept(i){const e=Dt(i,t=>({title:t.required.string,view:t.required.constant("button"),label:t.optional.string}));return e?{params:e}:null},controller(i){return new Ch(i.document,{blade:i.blade,buttonProps:tt.fromObject({title:i.params.title}),labelProps:tt.fromObject({label:i.params.label}),viewProps:i.viewProps})},api(i){return i.controller instanceof Ch?new Ty(i.controller):null}});function Dy(i,e){return i.addBlade(Object.assign(Object.assign({},e),{view:"button"}))}function Iy(i,e){return i.addBlade(Object.assign(Object.assign({},e),{view:"folder"}))}function Ly(i,e){return i.addBlade(Object.assign(Object.assign({},e),{view:"tab"}))}function Uy(i){return Nc(i)?"refresh"in i&&typeof i.refresh=="function":!1}function Oy(i,e){if(!Ko.isBindable(i))throw Lt.notBindable();return new Ko(i,e)}class Ny{constructor(e,t){this.onRackValueChange_=this.onRackValueChange_.bind(this),this.controller_=e,this.emitter_=new Bt,this.pool_=t,this.controller_.rack.emitter.on("valuechange",this.onRackValueChange_)}get children(){return this.controller_.rack.children.map(e=>this.pool_.createApi(e))}addBinding(e,t,n){const s=n??{},r=this.controller_.element.ownerDocument,o=this.pool_.createBinding(r,Oy(e,t),s),a=this.pool_.createBindingApi(o);return this.add(a,s.index)}addFolder(e){return Iy(this,e)}addButton(e){return Dy(this,e)}addTab(e){return Ly(this,e)}add(e,t){const n=e.controller;return this.controller_.rack.add(n,t),e}remove(e){this.controller_.rack.remove(e.controller)}addBlade(e){const t=this.controller_.element.ownerDocument,n=this.pool_.createBlade(t,e),s=this.pool_.createApi(n);return this.add(s,e.index)}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}refresh(){this.children.forEach(e=>{Uy(e)&&e.refresh()})}onRackValueChange_(e){const t=e.bladeController,n=this.pool_.createApi(t),s=Jd(t.value)?t.value.binding:null;this.emitter_.emit("change",new kr(n,s?s.target.read():t.value.rawValue,e.options.last))}}class Wc extends rs{constructor(e,t){super(e),this.rackApi_=new Ny(e.rackController,t)}refresh(){this.rackApi_.refresh()}}class Xc extends la{constructor(e){super({blade:e.blade,view:e.view,viewProps:e.rackController.viewProps}),this.rackController=e.rackController}importState(e){return fn(e,t=>super.importState(t),t=>({children:t.required.array(t.required.raw)}),t=>this.rackController.rack.children.every((n,s)=>n.importState(t.children[s])))}exportState(){return pn(()=>super.exportState(),{children:this.rackController.rack.children.map(e=>e.exportState())})}}function nc(i){return"rackController"in i}class ky{constructor(e){this.emitter=new Bt,this.items_=[],this.cache_=new Set,this.onSubListAdd_=this.onSubListAdd_.bind(this),this.onSubListRemove_=this.onSubListRemove_.bind(this),this.extract_=e}get items(){return this.items_}allItems(){return Array.from(this.cache_)}find(e){for(const t of this.allItems())if(e(t))return t;return null}includes(e){return this.cache_.has(e)}add(e,t){if(this.includes(e))throw Lt.shouldNeverHappen();const n=t!==void 0?t:this.items_.length;this.items_.splice(n,0,e),this.cache_.add(e);const s=this.extract_(e);s&&(s.emitter.on("add",this.onSubListAdd_),s.emitter.on("remove",this.onSubListRemove_),s.allItems().forEach(r=>{this.cache_.add(r)})),this.emitter.emit("add",{index:n,item:e,root:this,target:this})}remove(e){const t=this.items_.indexOf(e);if(t<0)return;this.items_.splice(t,1),this.cache_.delete(e);const n=this.extract_(e);n&&(n.allItems().forEach(s=>{this.cache_.delete(s)}),n.emitter.off("add",this.onSubListAdd_),n.emitter.off("remove",this.onSubListRemove_)),this.emitter.emit("remove",{index:t,item:e,root:this,target:this})}onSubListAdd_(e){this.cache_.add(e.item),this.emitter.emit("add",{index:e.index,item:e.item,root:this,target:e.target})}onSubListRemove_(e){this.cache_.delete(e.item),this.emitter.emit("remove",{index:e.index,item:e.item,root:this,target:e.target})}}function Fy(i,e){for(let t=0;t<i.length;t++){const n=i[t];if(es(n)&&n.value===e)return n}return null}function By(i){return nc(i)?i.rackController.rack.bcSet_:null}class zy{constructor(e){var t,n;this.emitter=new Bt,this.onBladePositionsChange_=this.onBladePositionsChange_.bind(this),this.onSetAdd_=this.onSetAdd_.bind(this),this.onSetRemove_=this.onSetRemove_.bind(this),this.onChildDispose_=this.onChildDispose_.bind(this),this.onChildPositionsChange_=this.onChildPositionsChange_.bind(this),this.onChildValueChange_=this.onChildValueChange_.bind(this),this.onChildViewPropsChange_=this.onChildViewPropsChange_.bind(this),this.onRackLayout_=this.onRackLayout_.bind(this),this.onRackValueChange_=this.onRackValueChange_.bind(this),this.blade_=(t=e.blade)!==null&&t!==void 0?t:null,(n=this.blade_)===null||n===void 0||n.value("positions").emitter.on("change",this.onBladePositionsChange_),this.viewProps=e.viewProps,this.bcSet_=new ky(By),this.bcSet_.emitter.on("add",this.onSetAdd_),this.bcSet_.emitter.on("remove",this.onSetRemove_)}get children(){return this.bcSet_.items}add(e,t){var n;(n=e.parent)===null||n===void 0||n.remove(e),e.parent=this,this.bcSet_.add(e,t)}remove(e){e.parent=null,this.bcSet_.remove(e)}find(e){return this.bcSet_.allItems().filter(e)}onSetAdd_(e){this.updatePositions_();const t=e.target===e.root;if(this.emitter.emit("add",{bladeController:e.item,index:e.index,root:t,sender:this}),!t)return;const n=e.item;if(n.viewProps.emitter.on("change",this.onChildViewPropsChange_),n.blade.value("positions").emitter.on("change",this.onChildPositionsChange_),n.viewProps.handleDispose(this.onChildDispose_),es(n))n.value.emitter.on("change",this.onChildValueChange_);else if(nc(n)){const s=n.rackController.rack;if(s){const r=s.emitter;r.on("layout",this.onRackLayout_),r.on("valuechange",this.onRackValueChange_)}}}onSetRemove_(e){this.updatePositions_();const t=e.target===e.root;if(this.emitter.emit("remove",{bladeController:e.item,root:t,sender:this}),!t)return;const n=e.item;if(es(n))n.value.emitter.off("change",this.onChildValueChange_);else if(nc(n)){const s=n.rackController.rack;if(s){const r=s.emitter;r.off("layout",this.onRackLayout_),r.off("valuechange",this.onRackValueChange_)}}}updatePositions_(){const e=this.bcSet_.items.filter(s=>!s.viewProps.get("hidden")),t=e[0],n=e[e.length-1];this.bcSet_.items.forEach(s=>{const r=[];s===t&&(r.push("first"),(!this.blade_||this.blade_.get("positions").includes("veryfirst"))&&r.push("veryfirst")),s===n&&(r.push("last"),(!this.blade_||this.blade_.get("positions").includes("verylast"))&&r.push("verylast")),s.blade.set("positions",r)})}onChildPositionsChange_(){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildViewPropsChange_(e){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildDispose_(){this.bcSet_.items.filter(t=>t.viewProps.get("disposed")).forEach(t=>{this.bcSet_.remove(t)})}onChildValueChange_(e){const t=Fy(this.find(es),e.sender);if(!t)throw Lt.alreadyDisposed();this.emitter.emit("valuechange",{bladeController:t,options:e.options,sender:this})}onRackLayout_(e){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onRackValueChange_(e){this.emitter.emit("valuechange",{bladeController:e.bladeController,options:e.options,sender:this})}onBladePositionsChange_(){this.updatePositions_()}}class qc{constructor(e){this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this),this.element=e.element,this.viewProps=e.viewProps;const t=new zy({blade:e.root?void 0:e.blade,viewProps:e.viewProps});t.emitter.on("add",this.onRackAdd_),t.emitter.on("remove",this.onRackRemove_),this.rack=t,this.viewProps.handleDispose(()=>{for(let n=this.rack.children.length-1;n>=0;n--)this.rack.children[n].viewProps.set("disposed",!0)})}onRackAdd_(e){e.root&&Qd(this.element,e.bladeController.view.element,e.index)}onRackRemove_(e){e.root&&Hc(e.bladeController.view.element)}}function Js(){return new tt({positions:Ct([],{equals:vb})})}class Fr extends tt{constructor(e){super(e)}static create(e){const t={completed:!0,expanded:e,expandedHeight:null,shouldFixHeight:!1,temporaryExpanded:null},n=tt.createCore(t);return new Fr(n)}get styleExpanded(){var e;return(e=this.get("temporaryExpanded"))!==null&&e!==void 0?e:this.get("expanded")}get styleHeight(){if(!this.styleExpanded)return"0";const e=this.get("expandedHeight");return this.get("shouldFixHeight")&&!xt(e)?`${e}px`:"auto"}bindExpandedClass(e,t){const n=()=>{this.styleExpanded?e.classList.add(t):e.classList.remove(t)};Kn(this,"expanded",n),Kn(this,"temporaryExpanded",n)}cleanUpTransition(){this.set("shouldFixHeight",!1),this.set("expandedHeight",null),this.set("completed",!0)}}function Vy(i,e){let t=0;return ay(e,()=>{i.set("expandedHeight",null),i.set("temporaryExpanded",!0),Yo(e),t=e.clientHeight,i.set("temporaryExpanded",null),Yo(e)}),t}function Ah(i,e){e.style.height=i.styleHeight}function jc(i,e){i.value("expanded").emitter.on("beforechange",()=>{if(i.set("completed",!1),xt(i.get("expandedHeight"))){const t=Vy(i,e);t>0&&i.set("expandedHeight",t)}i.set("shouldFixHeight",!0),Yo(e)}),i.emitter.on("change",()=>{Ah(i,e)}),Ah(i,e),e.addEventListener("transitionend",t=>{t.propertyName==="height"&&i.cleanUpTransition()})}class lf extends Wc{constructor(e,t){super(e,t),this.emitter_=new Bt,this.controller.foldable.value("expanded").emitter.on("change",n=>{this.emitter_.emit("fold",new Qb(this,n.sender.rawValue))}),this.rackApi_.on("change",n=>{this.emitter_.emit("change",n)})}get expanded(){return this.controller.foldable.get("expanded")}set expanded(e){this.controller.foldable.set("expanded",e)}get title(){return this.controller.props.get("title")}set title(e){this.controller.props.set("title",e)}get children(){return this.rackApi_.children}addBinding(e,t,n){return this.rackApi_.addBinding(e,t,n)}addFolder(e){return this.rackApi_.addFolder(e)}addButton(e){return this.rackApi_.addButton(e)}addTab(e){return this.rackApi_.addTab(e)}add(e,t){return this.rackApi_.add(e,t)}remove(e){this.rackApi_.remove(e)}addBlade(e){return this.rackApi_.addBlade(e)}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}}const cf=lt("cnt");class Hy{constructor(e,t){var n;this.className_=lt((n=t.viewName)!==null&&n!==void 0?n:"fld"),this.element=e.createElement("div"),this.element.classList.add(this.className_(),cf()),t.viewProps.bindClassModifiers(this.element),this.foldable_=t.foldable,this.foldable_.bindExpandedClass(this.element,this.className_(void 0,"expanded")),Kn(this.foldable_,"completed",$s(this.element,this.className_(void 0,"cpl")));const s=e.createElement("button");s.classList.add(this.className_("b")),Kn(t.props,"title",c=>{xt(c)?this.element.classList.add(this.className_(void 0,"not")):this.element.classList.remove(this.className_(void 0,"not"))}),t.viewProps.bindDisabled(s),this.element.appendChild(s),this.buttonElement=s;const r=e.createElement("div");r.classList.add(this.className_("i")),this.element.appendChild(r);const o=e.createElement("div");o.classList.add(this.className_("t")),Gc(t.props.value("title"),o),this.buttonElement.appendChild(o),this.titleElement=o;const a=e.createElement("div");a.classList.add(this.className_("m")),this.buttonElement.appendChild(a);const l=e.createElement("div");l.classList.add(this.className_("c")),this.element.appendChild(l),this.containerElement=l}}class ic extends Xc{constructor(e,t){var n;const s=Fr.create((n=t.expanded)!==null&&n!==void 0?n:!0),r=new Hy(e,{foldable:s,props:t.props,viewName:t.root?"rot":void 0,viewProps:t.viewProps});super(Object.assign(Object.assign({},t),{rackController:new qc({blade:t.blade,element:r.containerElement,root:t.root,viewProps:t.viewProps}),view:r})),this.onTitleClick_=this.onTitleClick_.bind(this),this.props=t.props,this.foldable=s,jc(this.foldable,this.view.containerElement),this.rackController.rack.emitter.on("add",()=>{this.foldable.cleanUpTransition()}),this.rackController.rack.emitter.on("remove",()=>{this.foldable.cleanUpTransition()}),this.view.buttonElement.addEventListener("click",this.onTitleClick_)}get document(){return this.view.element.ownerDocument}importState(e){return fn(e,t=>super.importState(t),t=>({expanded:t.required.boolean,title:t.optional.string}),t=>(this.foldable.set("expanded",t.expanded),this.props.set("title",t.title),!0))}exportState(){return pn(()=>super.exportState(),{expanded:this.foldable.get("expanded"),title:this.props.get("title")})}onTitleClick_(){this.foldable.set("expanded",!this.foldable.get("expanded"))}}const Gy=tn({id:"folder",type:"blade",accept(i){const e=Dt(i,t=>({title:t.required.string,view:t.required.constant("folder"),expanded:t.optional.boolean}));return e?{params:e}:null},controller(i){return new ic(i.document,{blade:i.blade,expanded:i.params.expanded,props:tt.fromObject({title:i.params.title}),viewProps:i.viewProps})},api(i){return i.controller instanceof ic?new lf(i.controller,i.pool):null}}),Wy=lt("");function Ph(i,e){return $s(i,Wy(void 0,e))}class _i extends tt{constructor(e){var t;super(e),this.onDisabledChange_=this.onDisabledChange_.bind(this),this.onParentChange_=this.onParentChange_.bind(this),this.onParentGlobalDisabledChange_=this.onParentGlobalDisabledChange_.bind(this),[this.globalDisabled_,this.setGlobalDisabled_]=Sb(Ct(this.getGlobalDisabled_())),this.value("disabled").emitter.on("change",this.onDisabledChange_),this.value("parent").emitter.on("change",this.onParentChange_),(t=this.get("parent"))===null||t===void 0||t.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_)}static create(e){var t,n,s;const r=e??{};return new _i(tt.createCore({disabled:(t=r.disabled)!==null&&t!==void 0?t:!1,disposed:!1,hidden:(n=r.hidden)!==null&&n!==void 0?n:!1,parent:(s=r.parent)!==null&&s!==void 0?s:null}))}get globalDisabled(){return this.globalDisabled_}bindClassModifiers(e){pi(this.globalDisabled_,Ph(e,"disabled")),Kn(this,"hidden",Ph(e,"hidden"))}bindDisabled(e){pi(this.globalDisabled_,t=>{e.disabled=t})}bindTabIndex(e){pi(this.globalDisabled_,t=>{e.tabIndex=t?-1:0})}handleDispose(e){this.value("disposed").emitter.on("change",t=>{t&&e()})}importState(e){this.set("disabled",e.disabled),this.set("hidden",e.hidden)}exportState(){return{disabled:this.get("disabled"),hidden:this.get("hidden")}}getGlobalDisabled_(){const e=this.get("parent");return(e?e.globalDisabled.rawValue:!1)||this.get("disabled")}updateGlobalDisabled_(){this.setGlobalDisabled_(this.getGlobalDisabled_())}onDisabledChange_(){this.updateGlobalDisabled_()}onParentGlobalDisabledChange_(){this.updateGlobalDisabled_()}onParentChange_(e){var t;const n=e.previousRawValue;n?.globalDisabled.emitter.off("change",this.onParentGlobalDisabledChange_),(t=this.get("parent"))===null||t===void 0||t.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_),this.updateGlobalDisabled_()}}const Rh=lt("tbp");class Xy{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Rh()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Rh("c")),this.element.appendChild(n),this.containerElement=n}}const ur=lt("tbi");class qy{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(ur()),t.viewProps.bindClassModifiers(this.element),Kn(t.props,"selected",r=>{r?this.element.classList.add(ur(void 0,"sel")):this.element.classList.remove(ur(void 0,"sel"))});const n=e.createElement("button");n.classList.add(ur("b")),t.viewProps.bindDisabled(n),this.element.appendChild(n),this.buttonElement=n;const s=e.createElement("div");s.classList.add(ur("t")),Gc(t.props.value("title"),s),this.buttonElement.appendChild(s),this.titleElement=s}}class jy{constructor(e,t){this.emitter=new Bt,this.onClick_=this.onClick_.bind(this),this.props=t.props,this.viewProps=t.viewProps,this.view=new qy(e,{props:t.props,viewProps:t.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}onClick_(){this.emitter.emit("click",{sender:this})}}class sc extends Xc{constructor(e,t){const n=new Xy(e,{viewProps:t.viewProps});super(Object.assign(Object.assign({},t),{rackController:new qc({blade:t.blade,element:n.containerElement,viewProps:t.viewProps}),view:n})),this.onItemClick_=this.onItemClick_.bind(this),this.ic_=new jy(e,{props:t.itemProps,viewProps:_i.create()}),this.ic_.emitter.on("click",this.onItemClick_),this.props=t.props,Kn(this.props,"selected",s=>{this.itemController.props.set("selected",s),this.viewProps.set("hidden",!s)})}get itemController(){return this.ic_}importState(e){return fn(e,t=>super.importState(t),t=>({selected:t.required.boolean,title:t.required.string}),t=>(this.ic_.props.set("selected",t.selected),this.ic_.props.set("title",t.title),!0))}exportState(){return pn(()=>super.exportState(),{selected:this.ic_.props.get("selected"),title:this.ic_.props.get("title")})}onItemClick_(){this.props.set("selected",!0)}}class Ky extends Wc{constructor(e,t){super(e,t),this.emitter_=new Bt,this.onSelect_=this.onSelect_.bind(this),this.pool_=t,this.rackApi_.on("change",n=>{this.emitter_.emit("change",n)}),this.controller.tab.selectedIndex.emitter.on("change",this.onSelect_)}get pages(){return this.rackApi_.children}addPage(e){const t=this.controller.view.element.ownerDocument,n=new sc(t,{blade:Js(),itemProps:tt.fromObject({selected:!1,title:e.title}),props:tt.fromObject({selected:!1}),viewProps:_i.create()}),s=this.pool_.createApi(n);return this.rackApi_.add(s,e.index)}removePage(e){this.rackApi_.remove(this.rackApi_.children[e])}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}onSelect_(e){this.emitter_.emit("select",new ey(this,e.rawValue))}}class Yy extends Wc{get title(){var e;return(e=this.controller.itemController.props.get("title"))!==null&&e!==void 0?e:""}set title(e){this.controller.itemController.props.set("title",e)}get selected(){return this.controller.props.get("selected")}set selected(e){this.controller.props.set("selected",e)}get children(){return this.rackApi_.children}addButton(e){return this.rackApi_.addButton(e)}addFolder(e){return this.rackApi_.addFolder(e)}addTab(e){return this.rackApi_.addTab(e)}add(e,t){this.rackApi_.add(e,t)}remove(e){this.rackApi_.remove(e)}addBinding(e,t,n){return this.rackApi_.addBinding(e,t,n)}addBlade(e){return this.rackApi_.addBlade(e)}}const Dh=-1;class $y{constructor(){this.onItemSelectedChange_=this.onItemSelectedChange_.bind(this),this.empty=Ct(!0),this.selectedIndex=Ct(Dh),this.items_=[]}add(e,t){const n=t??this.items_.length;this.items_.splice(n,0,e),e.emitter.on("change",this.onItemSelectedChange_),this.keepSelection_()}remove(e){const t=this.items_.indexOf(e);t<0||(this.items_.splice(t,1),e.emitter.off("change",this.onItemSelectedChange_),this.keepSelection_())}keepSelection_(){if(this.items_.length===0){this.selectedIndex.rawValue=Dh,this.empty.rawValue=!0;return}const e=this.items_.findIndex(t=>t.rawValue);e<0?(this.items_.forEach((t,n)=>{t.rawValue=n===0}),this.selectedIndex.rawValue=0):(this.items_.forEach((t,n)=>{t.rawValue=n===e}),this.selectedIndex.rawValue=e),this.empty.rawValue=!1}onItemSelectedChange_(e){if(e.rawValue){const t=this.items_.findIndex(n=>n===e.sender);this.items_.forEach((n,s)=>{n.rawValue=s===t}),this.selectedIndex.rawValue=t}else this.keepSelection_()}}const hr=lt("tab");class Zy{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(hr(),cf()),t.viewProps.bindClassModifiers(this.element),pi(t.empty,$s(this.element,hr(void 0,"nop")));const n=e.createElement("div");n.classList.add(hr("t")),this.element.appendChild(n),this.itemsElement=n;const s=e.createElement("div");s.classList.add(hr("i")),this.element.appendChild(s);const r=e.createElement("div");r.classList.add(hr("c")),this.element.appendChild(r),this.contentsElement=r}}class Ih extends Xc{constructor(e,t){const n=new $y,s=new Zy(e,{empty:n.empty,viewProps:t.viewProps});super({blade:t.blade,rackController:new qc({blade:t.blade,element:s.contentsElement,viewProps:t.viewProps}),view:s}),this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this);const r=this.rackController.rack;r.emitter.on("add",this.onRackAdd_),r.emitter.on("remove",this.onRackRemove_),this.tab=n}add(e,t){this.rackController.rack.add(e,t)}remove(e){this.rackController.rack.remove(this.rackController.rack.children[e])}onRackAdd_(e){if(!e.root)return;const t=e.bladeController;Qd(this.view.itemsElement,t.itemController.view.element,e.index),t.itemController.viewProps.set("parent",this.viewProps),this.tab.add(t.props.value("selected"))}onRackRemove_(e){if(!e.root)return;const t=e.bladeController;Hc(t.itemController.view.element),t.itemController.viewProps.set("parent",null),this.tab.remove(t.props.value("selected"))}}const uf=tn({id:"tab",type:"blade",accept(i){const e=Dt(i,t=>({pages:t.required.array(t.required.object({title:t.required.string})),view:t.required.constant("tab")}));return!e||e.pages.length===0?null:{params:e}},controller(i){const e=new Ih(i.document,{blade:i.blade,viewProps:i.viewProps});return i.params.pages.forEach(t=>{const n=new sc(i.document,{blade:Js(),itemProps:tt.fromObject({selected:!1,title:t.title}),props:tt.fromObject({selected:!1}),viewProps:_i.create()});e.add(n)}),e},api(i){return i.controller instanceof Ih?new Ky(i.controller,i.pool):i.controller instanceof sc?new Yy(i.controller,i.pool):null}});function Jy(i,e){const t=i.accept(e.params);if(!t)return null;const n=Dt(e.params,s=>({disabled:s.optional.boolean,hidden:s.optional.boolean}));return i.controller({blade:Js(),document:e.document,params:Object.assign(Object.assign({},t.params),{disabled:n?.disabled,hidden:n?.hidden}),viewProps:_i.create({disabled:n?.disabled,hidden:n?.hidden})})}class Kc extends Pr{get options(){return this.controller.valueController.props.get("options")}set options(e){this.controller.valueController.props.set("options",e)}}class Qy{constructor(){this.disabled=!1,this.emitter=new Bt}dispose(){}tick(){this.disabled||this.emitter.emit("tick",{sender:this})}}class eS{constructor(e,t){this.disabled_=!1,this.timerId_=null,this.onTick_=this.onTick_.bind(this),this.doc_=e,this.emitter=new Bt,this.interval_=t,this.setTimer_()}get disabled(){return this.disabled_}set disabled(e){this.disabled_=e,this.disabled_?this.clearTimer_():this.setTimer_()}dispose(){this.clearTimer_()}clearTimer_(){if(this.timerId_===null)return;const e=this.doc_.defaultView;e&&e.clearInterval(this.timerId_),this.timerId_=null}setTimer_(){if(this.clearTimer_(),this.interval_<=0)return;const e=this.doc_.defaultView;e&&(this.timerId_=e.setInterval(this.onTick_,this.interval_))}onTick_(){this.disabled_||this.emitter.emit("tick",{sender:this})}}class Br{constructor(e){this.constraints=e}constrain(e){return this.constraints.reduce((t,n)=>n.constrain(t),e)}}function $o(i,e){if(i instanceof e)return i;if(i instanceof Br){const t=i.constraints.reduce((n,s)=>n||(s instanceof e?s:null),null);if(t)return t}return null}class zr{constructor(e){this.values=tt.fromObject({options:e})}constrain(e){const t=this.values.get("options");return t.length===0||t.filter(s=>s.value===e).length>0?e:t[0].value}}function Vr(i){var e;const t=tc;if(Array.isArray(i))return(e=Dt({items:i},n=>({items:n.required.array(n.required.object({text:n.required.string,value:n.required.raw}))})))===null||e===void 0?void 0:e.items;if(typeof i=="object")return t.required.raw(i).value}function Yc(i){if(Array.isArray(i))return i;const e=[];return Object.keys(i).forEach(t=>{e.push({text:t,value:i[t]})}),e}function $c(i){return xt(i)?null:new zr(Yc(i))}const ja=lt("lst");class tS{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),this.props_=t.props,this.element=e.createElement("div"),this.element.classList.add(ja()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("select");n.classList.add(ja("s")),t.viewProps.bindDisabled(n),this.element.appendChild(n),this.selectElement=n;const s=e.createElement("div");s.classList.add(ja("m")),s.appendChild(aa(e,"dropdown")),this.element.appendChild(s),t.value.emitter.on("change",this.onValueChange_),this.value_=t.value,Kn(this.props_,"options",r=>{ef(this.selectElement),r.forEach(o=>{const a=e.createElement("option");a.textContent=o.text,this.selectElement.appendChild(a)}),this.update_()})}update_(){const e=this.props_.get("options").map(t=>t.value);this.selectElement.selectedIndex=e.indexOf(this.value_.rawValue)}onValueChange_(){this.update_()}}class Oi{constructor(e,t){this.onSelectChange_=this.onSelectChange_.bind(this),this.props=t.props,this.value=t.value,this.viewProps=t.viewProps,this.view=new tS(e,{props:this.props,value:this.value,viewProps:this.viewProps}),this.view.selectElement.addEventListener("change",this.onSelectChange_)}onSelectChange_(e){const t=e.currentTarget;this.value.rawValue=this.props.get("options")[t.selectedIndex].value}importProps(e){return fn(e,null,t=>({options:t.required.custom(Vr)}),t=>(this.props.set("options",Yc(t.options)),!0))}exportProps(){return pn(null,{options:this.props.get("options")})}}const Lh=lt("pop");class nS{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Lh()),t.viewProps.bindClassModifiers(this.element),pi(t.shows,$s(this.element,Lh(void 0,"v")))}}class hf{constructor(e,t){this.shows=Ct(!1),this.viewProps=t.viewProps,this.view=new nS(e,{shows:this.shows,viewProps:this.viewProps})}}const Uh=lt("txt");class iS{constructor(e,t){this.onChange_=this.onChange_.bind(this),this.element=e.createElement("div"),this.element.classList.add(Uh()),t.viewProps.bindClassModifiers(this.element),this.props_=t.props,this.props_.emitter.on("change",this.onChange_);const n=e.createElement("input");n.classList.add(Uh("i")),n.type="text",t.viewProps.bindDisabled(n),this.element.appendChild(n),this.inputElement=n,t.value.emitter.on("change",this.onChange_),this.value_=t.value,this.refresh()}refresh(){const e=this.props_.get("formatter");this.inputElement.value=e(this.value_.rawValue)}onChange_(){this.refresh()}}class Rr{constructor(e,t){this.onInputChange_=this.onInputChange_.bind(this),this.parser_=t.parser,this.props=t.props,this.value=t.value,this.viewProps=t.viewProps,this.view=new iS(e,{props:t.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_)}onInputChange_(e){const n=e.currentTarget.value,s=this.parser_(n);xt(s)||(this.value.rawValue=s),this.view.refresh()}}function sS(i){return String(i)}function df(i){return i==="false"?!1:!!i}function Oh(i){return sS(i)}function rS(i){return e=>i.reduce((t,n)=>t!==null?t:n(e),null)}const oS=cn(0);function Zo(i){return oS(i)+"%"}function ff(i){return String(i)}function rc(i){return i}function Qs({primary:i,secondary:e,forward:t,backward:n}){let s=!1;function r(o){s||(s=!0,o(),s=!1)}i.emitter.on("change",o=>{r(()=>{e.setRawValue(t(i.rawValue,e.rawValue),o.options)})}),e.emitter.on("change",o=>{r(()=>{i.setRawValue(n(i.rawValue,e.rawValue),o.options)}),r(()=>{e.setRawValue(t(i.rawValue,e.rawValue),o.options)})}),r(()=>{e.setRawValue(t(i.rawValue,e.rawValue),{forceEmit:!1,last:!0})})}function an(i,e){const t=i*(e.altKey?.1:1)*(e.shiftKey?10:1);return e.upKey?+t:e.downKey?-t:0}function Dr(i){return{altKey:i.altKey,downKey:i.key==="ArrowDown",shiftKey:i.shiftKey,upKey:i.key==="ArrowUp"}}function gi(i){return{altKey:i.altKey,downKey:i.key==="ArrowLeft",shiftKey:i.shiftKey,upKey:i.key==="ArrowRight"}}function aS(i){return i==="ArrowUp"||i==="ArrowDown"}function pf(i){return aS(i)||i==="ArrowLeft"||i==="ArrowRight"}function Ka(i,e){var t,n;const s=e.ownerDocument.defaultView,r=e.getBoundingClientRect();return{x:i.pageX-(((t=s&&s.scrollX)!==null&&t!==void 0?t:0)+r.left),y:i.pageY-(((n=s&&s.scrollY)!==null&&n!==void 0?n:0)+r.top)}}class os{constructor(e){this.lastTouch_=null,this.onDocumentMouseMove_=this.onDocumentMouseMove_.bind(this),this.onDocumentMouseUp_=this.onDocumentMouseUp_.bind(this),this.onMouseDown_=this.onMouseDown_.bind(this),this.onTouchEnd_=this.onTouchEnd_.bind(this),this.onTouchMove_=this.onTouchMove_.bind(this),this.onTouchStart_=this.onTouchStart_.bind(this),this.elem_=e,this.emitter=new Bt,e.addEventListener("touchstart",this.onTouchStart_,{passive:!1}),e.addEventListener("touchmove",this.onTouchMove_,{passive:!0}),e.addEventListener("touchend",this.onTouchEnd_),e.addEventListener("mousedown",this.onMouseDown_)}computePosition_(e){const t=this.elem_.getBoundingClientRect();return{bounds:{width:t.width,height:t.height},point:e?{x:e.x,y:e.y}:null}}onMouseDown_(e){var t;e.preventDefault(),(t=e.currentTarget)===null||t===void 0||t.focus();const n=this.elem_.ownerDocument;n.addEventListener("mousemove",this.onDocumentMouseMove_),n.addEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("down",{altKey:e.altKey,data:this.computePosition_(Ka(e,this.elem_)),sender:this,shiftKey:e.shiftKey})}onDocumentMouseMove_(e){this.emitter.emit("move",{altKey:e.altKey,data:this.computePosition_(Ka(e,this.elem_)),sender:this,shiftKey:e.shiftKey})}onDocumentMouseUp_(e){const t=this.elem_.ownerDocument;t.removeEventListener("mousemove",this.onDocumentMouseMove_),t.removeEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("up",{altKey:e.altKey,data:this.computePosition_(Ka(e,this.elem_)),sender:this,shiftKey:e.shiftKey})}onTouchStart_(e){e.preventDefault();const t=e.targetTouches.item(0),n=this.elem_.getBoundingClientRect();this.emitter.emit("down",{altKey:e.altKey,data:this.computePosition_(t?{x:t.clientX-n.left,y:t.clientY-n.top}:void 0),sender:this,shiftKey:e.shiftKey}),this.lastTouch_=t}onTouchMove_(e){const t=e.targetTouches.item(0),n=this.elem_.getBoundingClientRect();this.emitter.emit("move",{altKey:e.altKey,data:this.computePosition_(t?{x:t.clientX-n.left,y:t.clientY-n.top}:void 0),sender:this,shiftKey:e.shiftKey}),this.lastTouch_=t}onTouchEnd_(e){var t;const n=(t=e.targetTouches.item(0))!==null&&t!==void 0?t:this.lastTouch_,s=this.elem_.getBoundingClientRect();this.emitter.emit("up",{altKey:e.altKey,data:this.computePosition_(n?{x:n.clientX-s.left,y:n.clientY-s.top}:void 0),sender:this,shiftKey:e.shiftKey})}}const _n=lt("txt");class lS{constructor(e,t){this.onChange_=this.onChange_.bind(this),this.props_=t.props,this.props_.emitter.on("change",this.onChange_),this.element=e.createElement("div"),this.element.classList.add(_n(),_n(void 0,"num")),t.arrayPosition&&this.element.classList.add(_n(void 0,t.arrayPosition)),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("input");n.classList.add(_n("i")),n.type="text",t.viewProps.bindDisabled(n),this.element.appendChild(n),this.inputElement=n,this.onDraggingChange_=this.onDraggingChange_.bind(this),this.dragging_=t.dragging,this.dragging_.emitter.on("change",this.onDraggingChange_),this.element.classList.add(_n()),this.inputElement.classList.add(_n("i"));const s=e.createElement("div");s.classList.add(_n("k")),this.element.appendChild(s),this.knobElement=s;const r=e.createElementNS(Wn,"svg");r.classList.add(_n("g")),this.knobElement.appendChild(r);const o=e.createElementNS(Wn,"path");o.classList.add(_n("gb")),r.appendChild(o),this.guideBodyElem_=o;const a=e.createElementNS(Wn,"path");a.classList.add(_n("gh")),r.appendChild(a),this.guideHeadElem_=a;const l=e.createElement("div");l.classList.add(lt("tt")()),this.knobElement.appendChild(l),this.tooltipElem_=l,t.value.emitter.on("change",this.onChange_),this.value=t.value,this.refresh()}onDraggingChange_(e){if(e.rawValue===null){this.element.classList.remove(_n(void 0,"drg"));return}this.element.classList.add(_n(void 0,"drg"));const t=e.rawValue/this.props_.get("pointerScale"),n=t+(t>0?-1:t<0?1:0),s=zt(-n,-4,4);this.guideHeadElem_.setAttributeNS(null,"d",[`M ${n+s},0 L${n},4 L${n+s},8`,`M ${t},-1 L${t},9`].join(" ")),this.guideBodyElem_.setAttributeNS(null,"d",`M 0,4 L${t},4`);const r=this.props_.get("formatter");this.tooltipElem_.textContent=r(this.value.rawValue),this.tooltipElem_.style.left=`${t}px`}refresh(){const e=this.props_.get("formatter");this.inputElement.value=e(this.value.rawValue)}onChange_(){this.refresh()}}class Hr{constructor(e,t){var n;this.originRawValue_=0,this.onInputChange_=this.onInputChange_.bind(this),this.onInputKeyDown_=this.onInputKeyDown_.bind(this),this.onInputKeyUp_=this.onInputKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.parser_=t.parser,this.props=t.props,this.sliderProps_=(n=t.sliderProps)!==null&&n!==void 0?n:null,this.value=t.value,this.viewProps=t.viewProps,this.dragging_=Ct(null),this.view=new lS(e,{arrayPosition:t.arrayPosition,dragging:this.dragging_,props:this.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_),this.view.inputElement.addEventListener("keydown",this.onInputKeyDown_),this.view.inputElement.addEventListener("keyup",this.onInputKeyUp_);const s=new os(this.view.knobElement);s.emitter.on("down",this.onPointerDown_),s.emitter.on("move",this.onPointerMove_),s.emitter.on("up",this.onPointerUp_)}constrainValue_(e){var t,n;const s=(t=this.sliderProps_)===null||t===void 0?void 0:t.get("min"),r=(n=this.sliderProps_)===null||n===void 0?void 0:n.get("max");let o=e;return s!==void 0&&(o=Math.max(o,s)),r!==void 0&&(o=Math.min(o,r)),o}onInputChange_(e){const n=e.currentTarget.value,s=this.parser_(n);xt(s)||(this.value.rawValue=this.constrainValue_(s)),this.view.refresh()}onInputKeyDown_(e){const t=an(this.props.get("keyScale"),Dr(e));t!==0&&this.value.setRawValue(this.constrainValue_(this.value.rawValue+t),{forceEmit:!1,last:!1})}onInputKeyUp_(e){an(this.props.get("keyScale"),Dr(e))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}onPointerDown_(){this.originRawValue_=this.value.rawValue,this.dragging_.rawValue=0}computeDraggingValue_(e){if(!e.point)return null;const t=e.point.x-e.bounds.width/2;return this.constrainValue_(this.originRawValue_+t*this.props.get("pointerScale"))}onPointerMove_(e){const t=this.computeDraggingValue_(e.data);t!==null&&(this.value.setRawValue(t,{forceEmit:!1,last:!1}),this.dragging_.rawValue=this.value.rawValue-this.originRawValue_)}onPointerUp_(e){const t=this.computeDraggingValue_(e.data);t!==null&&(this.value.setRawValue(t,{forceEmit:!0,last:!0}),this.dragging_.rawValue=null)}}const Ya=lt("sld");class cS{constructor(e,t){this.onChange_=this.onChange_.bind(this),this.props_=t.props,this.props_.emitter.on("change",this.onChange_),this.element=e.createElement("div"),this.element.classList.add(Ya()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Ya("t")),t.viewProps.bindTabIndex(n),this.element.appendChild(n),this.trackElement=n;const s=e.createElement("div");s.classList.add(Ya("k")),this.trackElement.appendChild(s),this.knobElement=s,t.value.emitter.on("change",this.onChange_),this.value=t.value,this.update_()}update_(){const e=zt(ft(this.value.rawValue,this.props_.get("min"),this.props_.get("max"),0,100),0,100);this.knobElement.style.width=`${e}%`}onChange_(){this.update_()}}class uS{constructor(e,t){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDownOrMove_=this.onPointerDownOrMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.props=t.props,this.view=new cS(e,{props:this.props,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new os(this.view.trackElement),this.ptHandler_.emitter.on("down",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("move",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.trackElement.addEventListener("keydown",this.onKeyDown_),this.view.trackElement.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(e,t){e.point&&this.value.setRawValue(ft(zt(e.point.x,0,e.bounds.width),0,e.bounds.width,this.props.get("min"),this.props.get("max")),t)}onPointerDownOrMove_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerUp_(e){this.handlePointerEvent_(e.data,{forceEmit:!0,last:!0})}onKeyDown_(e){const t=an(this.props.get("keyScale"),gi(e));t!==0&&this.value.setRawValue(this.value.rawValue+t,{forceEmit:!1,last:!1})}onKeyUp_(e){an(this.props.get("keyScale"),gi(e))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const $a=lt("sldtxt");class hS{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add($a());const n=e.createElement("div");n.classList.add($a("s")),this.sliderView_=t.sliderView,n.appendChild(this.sliderView_.element),this.element.appendChild(n);const s=e.createElement("div");s.classList.add($a("t")),this.textView_=t.textView,s.appendChild(this.textView_.element),this.element.appendChild(s)}}class Jo{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.sliderC_=new uS(e,{props:t.sliderProps,value:t.value,viewProps:this.viewProps}),this.textC_=new Hr(e,{parser:t.parser,props:t.textProps,sliderProps:t.sliderProps,value:t.value,viewProps:t.viewProps}),this.view=new hS(e,{sliderView:this.sliderC_.view,textView:this.textC_.view})}get sliderController(){return this.sliderC_}get textController(){return this.textC_}importProps(e){return fn(e,null,t=>({max:t.required.number,min:t.required.number}),t=>{const n=this.sliderC_.props;return n.set("max",t.max),n.set("min",t.min),!0})}exportProps(){const e=this.sliderC_.props;return pn(null,{max:e.get("max"),min:e.get("min")})}}function mf(i){return{sliderProps:new tt({keyScale:i.keyScale,max:i.max,min:i.min}),textProps:new tt({formatter:Ct(i.formatter),keyScale:i.keyScale,pointerScale:Ct(i.pointerScale)})}}const dS={containerUnitSize:"cnt-usz"};function gf(i){return`--${dS[i]}`}function Ir(i){return Zd(i)}function Ii(i){if(ec(i))return Dt(i,Ir)}function ui(i,e){if(!i)return;const t=[],n=Kd(i,e);n&&t.push(n);const s=Yd(i);return s&&t.push(s),new Br(t)}function fS(i){return i?i.major===Zs.major:!1}function vf(i){if(i==="inline"||i==="popup")return i}function Gr(i,e){i.write(e)}const Ro=lt("ckb");class pS{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),this.element=e.createElement("div"),this.element.classList.add(Ro()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("label");n.classList.add(Ro("l")),this.element.appendChild(n),this.labelElement=n;const s=e.createElement("input");s.classList.add(Ro("i")),s.type="checkbox",this.labelElement.appendChild(s),this.inputElement=s,t.viewProps.bindDisabled(this.inputElement);const r=e.createElement("div");r.classList.add(Ro("w")),this.labelElement.appendChild(r);const o=aa(e,"check");r.appendChild(o),t.value.emitter.on("change",this.onValueChange_),this.value=t.value,this.update_()}update_(){this.inputElement.checked=this.value.rawValue}onValueChange_(){this.update_()}}class mS{constructor(e,t){this.onInputChange_=this.onInputChange_.bind(this),this.onLabelMouseDown_=this.onLabelMouseDown_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.view=new pS(e,{value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_),this.view.labelElement.addEventListener("mousedown",this.onLabelMouseDown_)}onInputChange_(e){const t=e.currentTarget;this.value.rawValue=t.checked,e.preventDefault(),e.stopPropagation()}onLabelMouseDown_(e){e.preventDefault()}}function gS(i){const e=[],t=$c(i.options);return t&&e.push(t),new Br(e)}const vS=tn({id:"input-bool",type:"input",accept:(i,e)=>{if(typeof i!="boolean")return null;const t=Dt(e,n=>({options:n.optional.custom(Vr),readonly:n.optional.constant(!1)}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>df,constraint:i=>gS(i.params),writer:i=>Gr},controller:i=>{const e=i.document,t=i.value,n=i.constraint,s=n&&$o(n,zr);return s?new Oi(e,{props:new tt({options:s.values.value("options")}),value:t,viewProps:i.viewProps}):new mS(e,{value:t,viewProps:i.viewProps})},api(i){return typeof i.controller.value.rawValue!="boolean"?null:i.controller.valueController instanceof Oi?new Kc(i.controller):null}}),Wi=lt("col");class _S{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Wi()),t.foldable.bindExpandedClass(this.element,Wi(void 0,"expanded")),Kn(t.foldable,"completed",$s(this.element,Wi(void 0,"cpl")));const n=e.createElement("div");n.classList.add(Wi("h")),this.element.appendChild(n);const s=e.createElement("div");s.classList.add(Wi("s")),n.appendChild(s),this.swatchElement=s;const r=e.createElement("div");if(r.classList.add(Wi("t")),n.appendChild(r),this.textElement=r,t.pickerLayout==="inline"){const o=e.createElement("div");o.classList.add(Wi("p")),this.element.appendChild(o),this.pickerElement=o}else this.pickerElement=null}}function xS(i,e,t){const n=zt(i/255,0,1),s=zt(e/255,0,1),r=zt(t/255,0,1),o=Math.max(n,s,r),a=Math.min(n,s,r),l=o-a;let c=0,u=0;const h=(a+o)/2;return l!==0&&(u=l/(1-Math.abs(o+a-1)),n===o?c=(s-r)/l:s===o?c=2+(r-n)/l:c=4+(n-s)/l,c=c/6+(c<0?1:0)),[c*360,u*100,h*100]}function bS(i,e,t){const n=(i%360+360)%360,s=zt(e/100,0,1),r=zt(t/100,0,1),o=(1-Math.abs(2*r-1))*s,a=o*(1-Math.abs(n/60%2-1)),l=r-o/2;let c,u,h;return n>=0&&n<60?[c,u,h]=[o,a,0]:n>=60&&n<120?[c,u,h]=[a,o,0]:n>=120&&n<180?[c,u,h]=[0,o,a]:n>=180&&n<240?[c,u,h]=[0,a,o]:n>=240&&n<300?[c,u,h]=[a,0,o]:[c,u,h]=[o,0,a],[(c+l)*255,(u+l)*255,(h+l)*255]}function yS(i,e,t){const n=zt(i/255,0,1),s=zt(e/255,0,1),r=zt(t/255,0,1),o=Math.max(n,s,r),a=Math.min(n,s,r),l=o-a;let c;l===0?c=0:o===n?c=60*(((s-r)/l%6+6)%6):o===s?c=60*((r-n)/l+2):c=60*((n-s)/l+4);const u=o===0?0:l/o,h=o;return[c,u*100,h*100]}function _f(i,e,t){const n=Xd(i,360),s=zt(e/100,0,1),r=zt(t/100,0,1),o=r*s,a=o*(1-Math.abs(n/60%2-1)),l=r-o;let c,u,h;return n>=0&&n<60?[c,u,h]=[o,a,0]:n>=60&&n<120?[c,u,h]=[a,o,0]:n>=120&&n<180?[c,u,h]=[0,o,a]:n>=180&&n<240?[c,u,h]=[0,a,o]:n>=240&&n<300?[c,u,h]=[a,0,o]:[c,u,h]=[o,0,a],[(c+l)*255,(u+l)*255,(h+l)*255]}function SS(i,e,t){const n=t+e*(100-Math.abs(2*t-100))/200;return[i,n!==0?e*(100-Math.abs(2*t-100))/n:0,t+e*(100-Math.abs(2*t-100))/200]}function wS(i,e,t){const n=100-Math.abs(t*(200-e)/100-100);return[i,n!==0?e*t/n:0,t*(200-e)/200]}function Yn(i){return[i[0],i[1],i[2]]}function ca(i,e){return[i[0],i[1],i[2],e]}const MS={hsl:{hsl:(i,e,t)=>[i,e,t],hsv:SS,rgb:bS},hsv:{hsl:wS,hsv:(i,e,t)=>[i,e,t],rgb:_f},rgb:{hsl:xS,hsv:yS,rgb:(i,e,t)=>[i,e,t]}};function qs(i,e){return[e==="float"?1:i==="rgb"?255:360,e==="float"?1:i==="rgb"?255:100,e==="float"?1:i==="rgb"?255:100]}function ES(i,e){return i===e?e:Xd(i,e)}function xf(i,e,t){var n;const s=qs(e,t);return[e==="rgb"?zt(i[0],0,s[0]):ES(i[0],s[0]),zt(i[1],0,s[1]),zt(i[2],0,s[2]),zt((n=i[3])!==null&&n!==void 0?n:1,0,1)]}function Nh(i,e,t,n){const s=qs(e,t),r=qs(e,n);return i.map((o,a)=>o/s[a]*r[a])}function bf(i,e,t){const n=Nh(i,e.mode,e.type,"int"),s=MS[e.mode][t.mode](...n);return Nh(s,t.mode,"int",t.type)}class ut{static black(){return new ut([0,0,0],"rgb")}constructor(e,t){this.type="int",this.mode=t,this.comps_=xf(e,t,this.type)}getComponents(e){return ca(bf(Yn(this.comps_),{mode:this.mode,type:this.type},{mode:e??this.mode,type:this.type}),this.comps_[3])}toRgbaObject(){const e=this.getComponents("rgb");return{r:e[0],g:e[1],b:e[2],a:e[3]}}}const Ti=lt("colp");class TS{constructor(e,t){this.alphaViews_=null,this.element=e.createElement("div"),this.element.classList.add(Ti()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Ti("hsv"));const s=e.createElement("div");s.classList.add(Ti("sv")),this.svPaletteView_=t.svPaletteView,s.appendChild(this.svPaletteView_.element),n.appendChild(s);const r=e.createElement("div");r.classList.add(Ti("h")),this.hPaletteView_=t.hPaletteView,r.appendChild(this.hPaletteView_.element),n.appendChild(r),this.element.appendChild(n);const o=e.createElement("div");if(o.classList.add(Ti("rgb")),this.textsView_=t.textsView,o.appendChild(this.textsView_.element),this.element.appendChild(o),t.alphaViews){this.alphaViews_={palette:t.alphaViews.palette,text:t.alphaViews.text};const a=e.createElement("div");a.classList.add(Ti("a"));const l=e.createElement("div");l.classList.add(Ti("ap")),l.appendChild(this.alphaViews_.palette.element),a.appendChild(l);const c=e.createElement("div");c.classList.add(Ti("at")),c.appendChild(this.alphaViews_.text.element),a.appendChild(c),this.element.appendChild(a)}}get allFocusableElements(){const e=[this.svPaletteView_.element,this.hPaletteView_.element,this.textsView_.modeSelectElement,...this.textsView_.inputViews.map(t=>t.inputElement)];return this.alphaViews_&&e.push(this.alphaViews_.palette.element,this.alphaViews_.text.inputElement),e}}function CS(i){return i==="int"?"int":i==="float"?"float":void 0}function Zc(i){return Dt(i,e=>({color:e.optional.object({alpha:e.optional.boolean,type:e.optional.custom(CS)}),expanded:e.optional.boolean,picker:e.optional.custom(vf),readonly:e.optional.constant(!1)}))}function is(i){return i?.1:1}function yf(i){var e;return(e=i.color)===null||e===void 0?void 0:e.type}class Jc{constructor(e,t){this.type="float",this.mode=t,this.comps_=xf(e,t,this.type)}getComponents(e){return ca(bf(Yn(this.comps_),{mode:this.mode,type:this.type},{mode:e??this.mode,type:this.type}),this.comps_[3])}toRgbaObject(){const e=this.getComponents("rgb");return{r:e[0],g:e[1],b:e[2],a:e[3]}}}const AS={int:(i,e)=>new ut(i,e),float:(i,e)=>new Jc(i,e)};function Qc(i,e,t){return AS[t](i,e)}function PS(i){return i.type==="float"}function RS(i){return i.type==="int"}function DS(i){const e=i.getComponents(),t=qs(i.mode,"int");return new ut([Math.round(ft(e[0],0,1,0,t[0])),Math.round(ft(e[1],0,1,0,t[1])),Math.round(ft(e[2],0,1,0,t[2])),e[3]],i.mode)}function IS(i){const e=i.getComponents(),t=qs(i.mode,"int");return new Jc([ft(e[0],0,t[0],0,1),ft(e[1],0,t[1],0,1),ft(e[2],0,t[2],0,1),e[3]],i.mode)}function en(i,e){if(i.type===e)return i;if(RS(i)&&e==="float")return IS(i);if(PS(i)&&e==="int")return DS(i);throw Lt.shouldNeverHappen()}function LS(i,e){return i.alpha===e.alpha&&i.mode===e.mode&&i.notation===e.notation&&i.type===e.type}function Sn(i,e){const t=i.match(/^(.+)%$/);return Math.min(t?parseFloat(t[1])*.01*e:parseFloat(i),e)}const US={deg:i=>i,grad:i=>i*360/400,rad:i=>i*360/(2*Math.PI),turn:i=>i*360};function Sf(i){const e=i.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);if(!e)return parseFloat(i);const t=parseFloat(e[1]),n=e[2];return US[n](t)}function wf(i){const e=i.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!e)return null;const t=[Sn(e[1],255),Sn(e[2],255),Sn(e[3],255)];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])?null:t}function OS(i){const e=wf(i);return e?new ut(e,"rgb"):null}function Mf(i){const e=i.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!e)return null;const t=[Sn(e[1],255),Sn(e[2],255),Sn(e[3],255),Sn(e[4],1)];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])||isNaN(t[3])?null:t}function NS(i){const e=Mf(i);return e?new ut(e,"rgb"):null}function Ef(i){const e=i.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!e)return null;const t=[Sf(e[1]),Sn(e[2],100),Sn(e[3],100)];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])?null:t}function kS(i){const e=Ef(i);return e?new ut(e,"hsl"):null}function Tf(i){const e=i.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!e)return null;const t=[Sf(e[1]),Sn(e[2],100),Sn(e[3],100),Sn(e[4],1)];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])||isNaN(t[3])?null:t}function FS(i){const e=Tf(i);return e?new ut(e,"hsl"):null}function Cf(i){const e=i.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(e)return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)];const t=i.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:null}function BS(i){const e=Cf(i);return e?new ut(e,"rgb"):null}function Af(i){const e=i.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(e)return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16),ft(parseInt(e[4]+e[4],16),0,255,0,1)];const t=i.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16),ft(parseInt(t[4],16),0,255,0,1)]:null}function zS(i){const e=Af(i);return e?new ut(e,"rgb"):null}function Pf(i){const e=i.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!e)return null;const t=[parseFloat(e[1]),parseFloat(e[2]),parseFloat(e[3])];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])?null:t}function VS(i){return e=>{const t=Pf(e);return t?Qc(t,"rgb",i):null}}function Rf(i){const e=i.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!e)return null;const t=[parseFloat(e[1]),parseFloat(e[2]),parseFloat(e[3]),parseFloat(e[4])];return isNaN(t[0])||isNaN(t[1])||isNaN(t[2])||isNaN(t[3])?null:t}function HS(i){return e=>{const t=Rf(e);return t?Qc(t,"rgb",i):null}}const GS=[{parser:Cf,result:{alpha:!1,mode:"rgb",notation:"hex"}},{parser:Af,result:{alpha:!0,mode:"rgb",notation:"hex"}},{parser:wf,result:{alpha:!1,mode:"rgb",notation:"func"}},{parser:Mf,result:{alpha:!0,mode:"rgb",notation:"func"}},{parser:Ef,result:{alpha:!1,mode:"hsl",notation:"func"}},{parser:Tf,result:{alpha:!0,mode:"hsl",notation:"func"}},{parser:Pf,result:{alpha:!1,mode:"rgb",notation:"object"}},{parser:Rf,result:{alpha:!0,mode:"rgb",notation:"object"}}];function WS(i){return GS.reduce((e,{parser:t,result:n})=>e||(t(i)?n:null),null)}function XS(i,e="int"){const t=WS(i);return t?t.notation==="hex"&&e!=="float"?Object.assign(Object.assign({},t),{type:"int"}):t.notation==="func"?Object.assign(Object.assign({},t),{type:e}):null:null}function Wr(i){const e=[BS,zS,OS,NS,kS,FS];e.push(VS("int"),HS("int"));const t=rS(e);return n=>{const s=t(n);return s?en(s,i):null}}function qS(i){const e=Wr("int");if(typeof i!="string")return ut.black();const t=e(i);return t??ut.black()}function Df(i){const e=zt(Math.floor(i),0,255).toString(16);return e.length===1?`0${e}`:e}function eu(i,e="#"){const t=Yn(i.getComponents("rgb")).map(Df).join("");return`${e}${t}`}function tu(i,e="#"){const t=i.getComponents("rgb"),n=[t[0],t[1],t[2],t[3]*255].map(Df).join("");return`${e}${n}`}function If(i){const e=cn(0),t=en(i,"int");return`rgb(${Yn(t.getComponents("rgb")).map(s=>e(s)).join(", ")})`}function Bo(i){const e=cn(2),t=cn(0);return`rgba(${en(i,"int").getComponents("rgb").map((r,o)=>(o===3?e:t)(r)).join(", ")})`}function jS(i){const e=[cn(0),Zo,Zo],t=en(i,"int");return`hsl(${Yn(t.getComponents("hsl")).map((s,r)=>e[r](s)).join(", ")})`}function KS(i){const e=[cn(0),Zo,Zo,cn(2)];return`hsla(${en(i,"int").getComponents("hsl").map((s,r)=>e[r](s)).join(", ")})`}function Lf(i,e){const t=cn(e==="float"?2:0),n=["r","g","b"],s=en(i,e);return`{${Yn(s.getComponents("rgb")).map((o,a)=>`${n[a]}: ${t(o)}`).join(", ")}}`}function YS(i){return e=>Lf(e,i)}function Uf(i,e){const t=cn(2),n=cn(e==="float"?2:0),s=["r","g","b","a"];return`{${en(i,e).getComponents("rgb").map((a,l)=>{const c=l===3?t:n;return`${s[l]}: ${c(a)}`}).join(", ")}}`}function $S(i){return e=>Uf(e,i)}const ZS=[{format:{alpha:!1,mode:"rgb",notation:"hex",type:"int"},stringifier:eu},{format:{alpha:!0,mode:"rgb",notation:"hex",type:"int"},stringifier:tu},{format:{alpha:!1,mode:"rgb",notation:"func",type:"int"},stringifier:If},{format:{alpha:!0,mode:"rgb",notation:"func",type:"int"},stringifier:Bo},{format:{alpha:!1,mode:"hsl",notation:"func",type:"int"},stringifier:jS},{format:{alpha:!0,mode:"hsl",notation:"func",type:"int"},stringifier:KS},...["int","float"].reduce((i,e)=>[...i,{format:{alpha:!1,mode:"rgb",notation:"object",type:e},stringifier:YS(e)},{format:{alpha:!0,mode:"rgb",notation:"object",type:e},stringifier:$S(e)}],[])];function Of(i){return ZS.reduce((e,t)=>e||(LS(t.format,i)?t.stringifier:null),null)}const dr=lt("apl");class JS{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),this.value=t.value,this.value.emitter.on("change",this.onValueChange_),this.element=e.createElement("div"),this.element.classList.add(dr()),t.viewProps.bindClassModifiers(this.element),t.viewProps.bindTabIndex(this.element);const n=e.createElement("div");n.classList.add(dr("b")),this.element.appendChild(n);const s=e.createElement("div");s.classList.add(dr("c")),n.appendChild(s),this.colorElem_=s;const r=e.createElement("div");r.classList.add(dr("m")),this.element.appendChild(r),this.markerElem_=r;const o=e.createElement("div");o.classList.add(dr("p")),this.markerElem_.appendChild(o),this.previewElem_=o,this.update_()}update_(){const e=this.value.rawValue,t=e.getComponents("rgb"),n=new ut([t[0],t[1],t[2],0],"rgb"),s=new ut([t[0],t[1],t[2],255],"rgb"),r=["to right",Bo(n),Bo(s)];this.colorElem_.style.background=`linear-gradient(${r.join(",")})`,this.previewElem_.style.backgroundColor=Bo(e);const o=ft(t[3],0,1,0,100);this.markerElem_.style.left=`${o}%`}onValueChange_(){this.update_()}}class QS{constructor(e,t){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.view=new JS(e,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new os(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(e,t){if(!e.point)return;const n=e.point.x/e.bounds.width,s=this.value.rawValue,[r,o,a]=s.getComponents("hsv");this.value.setRawValue(new ut([r,o,a,n],"hsv"),t)}onPointerDown_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerMove_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerUp_(e){this.handlePointerEvent_(e.data,{forceEmit:!0,last:!0})}onKeyDown_(e){const t=an(is(!0),gi(e));if(t===0)return;const n=this.value.rawValue,[s,r,o,a]=n.getComponents("hsv");this.value.setRawValue(new ut([s,r,o,a+t],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(e){an(is(!0),gi(e))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Ms=lt("coltxt");function ew(i){const e=i.createElement("select"),t=[{text:"RGB",value:"rgb"},{text:"HSL",value:"hsl"},{text:"HSV",value:"hsv"},{text:"HEX",value:"hex"}];return e.appendChild(t.reduce((n,s)=>{const r=i.createElement("option");return r.textContent=s.text,r.value=s.value,n.appendChild(r),n},i.createDocumentFragment())),e}class tw{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Ms()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Ms("m")),this.modeElem_=ew(e),this.modeElem_.classList.add(Ms("ms")),n.appendChild(this.modeSelectElement),t.viewProps.bindDisabled(this.modeElem_);const s=e.createElement("div");s.classList.add(Ms("mm")),s.appendChild(aa(e,"dropdown")),n.appendChild(s),this.element.appendChild(n);const r=e.createElement("div");r.classList.add(Ms("w")),this.element.appendChild(r),this.inputsElem_=r,this.inputViews_=t.inputViews,this.applyInputViews_(),pi(t.mode,o=>{this.modeElem_.value=o})}get modeSelectElement(){return this.modeElem_}get inputViews(){return this.inputViews_}set inputViews(e){this.inputViews_=e,this.applyInputViews_()}applyInputViews_(){ef(this.inputsElem_);const e=this.element.ownerDocument;this.inputViews_.forEach(t=>{const n=e.createElement("div");n.classList.add(Ms("c")),n.appendChild(t.element),this.inputsElem_.appendChild(n)})}}function nw(i){return cn(i==="float"?2:0)}function iw(i,e,t){const n=qs(i,e)[t];return new Nr({min:0,max:n})}function sw(i,e,t){return new Hr(i,{arrayPosition:t===0?"fst":t===2?"lst":"mid",parser:e.parser,props:tt.fromObject({formatter:nw(e.colorType),keyScale:is(!1),pointerScale:e.colorType==="float"?.01:1}),value:Ct(0,{constraint:iw(e.colorMode,e.colorType,t)}),viewProps:e.viewProps})}function rw(i,e){const t={colorMode:e.colorMode,colorType:e.colorType,parser:mi,viewProps:e.viewProps};return[0,1,2].map(n=>{const s=sw(i,t,n);return Qs({primary:e.value,secondary:s.value,forward(r){return en(r,e.colorType).getComponents(e.colorMode)[n]},backward(r,o){const a=e.colorMode,c=en(r,e.colorType).getComponents(a);c[n]=o;const u=Qc(ca(Yn(c),c[3]),a,e.colorType);return en(u,"int")}}),s})}function ow(i,e){const t=new Rr(i,{parser:Wr("int"),props:tt.fromObject({formatter:eu}),value:Ct(ut.black()),viewProps:e.viewProps});return Qs({primary:e.value,secondary:t.value,forward:n=>new ut(Yn(n.getComponents()),n.mode),backward:(n,s)=>new ut(ca(Yn(s.getComponents(n.mode)),n.getComponents()[3]),n.mode)}),[t]}function aw(i){return i!=="hex"}class lw{constructor(e,t){this.onModeSelectChange_=this.onModeSelectChange_.bind(this),this.colorType_=t.colorType,this.value=t.value,this.viewProps=t.viewProps,this.colorMode=Ct(this.value.rawValue.mode),this.ccs_=this.createComponentControllers_(e),this.view=new tw(e,{mode:this.colorMode,inputViews:[this.ccs_[0].view,this.ccs_[1].view,this.ccs_[2].view],viewProps:this.viewProps}),this.view.modeSelectElement.addEventListener("change",this.onModeSelectChange_)}createComponentControllers_(e){const t=this.colorMode.rawValue;return aw(t)?rw(e,{colorMode:t,colorType:this.colorType_,value:this.value,viewProps:this.viewProps}):ow(e,{value:this.value,viewProps:this.viewProps})}onModeSelectChange_(e){const t=e.currentTarget;this.colorMode.rawValue=t.value,this.ccs_=this.createComponentControllers_(this.view.element.ownerDocument),this.view.inputViews=this.ccs_.map(n=>n.view)}}const Za=lt("hpl");class cw{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),this.value=t.value,this.value.emitter.on("change",this.onValueChange_),this.element=e.createElement("div"),this.element.classList.add(Za()),t.viewProps.bindClassModifiers(this.element),t.viewProps.bindTabIndex(this.element);const n=e.createElement("div");n.classList.add(Za("c")),this.element.appendChild(n);const s=e.createElement("div");s.classList.add(Za("m")),this.element.appendChild(s),this.markerElem_=s,this.update_()}update_(){const e=this.value.rawValue,[t]=e.getComponents("hsv");this.markerElem_.style.backgroundColor=If(new ut([t,100,100],"hsv"));const n=ft(t,0,360,0,100);this.markerElem_.style.left=`${n}%`}onValueChange_(){this.update_()}}class uw{constructor(e,t){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.view=new cw(e,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new os(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(e,t){if(!e.point)return;const n=ft(zt(e.point.x,0,e.bounds.width),0,e.bounds.width,0,360),s=this.value.rawValue,[,r,o,a]=s.getComponents("hsv");this.value.setRawValue(new ut([n,r,o,a],"hsv"),t)}onPointerDown_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerMove_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerUp_(e){this.handlePointerEvent_(e.data,{forceEmit:!0,last:!0})}onKeyDown_(e){const t=an(is(!1),gi(e));if(t===0)return;const n=this.value.rawValue,[s,r,o,a]=n.getComponents("hsv");this.value.setRawValue(new ut([s+t,r,o,a],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(e){an(is(!1),gi(e))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Ja=lt("svp"),kh=64;class hw{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),this.value=t.value,this.value.emitter.on("change",this.onValueChange_),this.element=e.createElement("div"),this.element.classList.add(Ja()),t.viewProps.bindClassModifiers(this.element),t.viewProps.bindTabIndex(this.element);const n=e.createElement("canvas");n.height=kh,n.width=kh,n.classList.add(Ja("c")),this.element.appendChild(n),this.canvasElement=n;const s=e.createElement("div");s.classList.add(Ja("m")),this.element.appendChild(s),this.markerElem_=s,this.update_()}update_(){const e=uy(this.canvasElement);if(!e)return;const n=this.value.rawValue.getComponents("hsv"),s=this.canvasElement.width,r=this.canvasElement.height,o=e.getImageData(0,0,s,r),a=o.data;for(let u=0;u<r;u++)for(let h=0;h<s;h++){const f=ft(h,0,s,0,100),m=ft(u,0,r,100,0),_=_f(n[0],f,m),b=(u*s+h)*4;a[b]=_[0],a[b+1]=_[1],a[b+2]=_[2],a[b+3]=255}e.putImageData(o,0,0);const l=ft(n[1],0,100,0,100);this.markerElem_.style.left=`${l}%`;const c=ft(n[2],0,100,100,0);this.markerElem_.style.top=`${c}%`}onValueChange_(){this.update_()}}class dw{constructor(e,t){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.view=new hw(e,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new os(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(e,t){if(!e.point)return;const n=ft(e.point.x,0,e.bounds.width,0,100),s=ft(e.point.y,0,e.bounds.height,100,0),[r,,,o]=this.value.rawValue.getComponents("hsv");this.value.setRawValue(new ut([r,n,s,o],"hsv"),t)}onPointerDown_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerMove_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerUp_(e){this.handlePointerEvent_(e.data,{forceEmit:!0,last:!0})}onKeyDown_(e){pf(e.key)&&e.preventDefault();const[t,n,s,r]=this.value.rawValue.getComponents("hsv"),o=is(!1),a=an(o,gi(e)),l=an(o,Dr(e));a===0&&l===0||this.value.setRawValue(new ut([t,n+a,s+l,r],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(e){const t=is(!1),n=an(t,gi(e)),s=an(t,Dr(e));n===0&&s===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class fw{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.hPaletteC_=new uw(e,{value:this.value,viewProps:this.viewProps}),this.svPaletteC_=new dw(e,{value:this.value,viewProps:this.viewProps}),this.alphaIcs_=t.supportsAlpha?{palette:new QS(e,{value:this.value,viewProps:this.viewProps}),text:new Hr(e,{parser:mi,props:tt.fromObject({pointerScale:.01,keyScale:.1,formatter:cn(2)}),value:Ct(0,{constraint:new Nr({min:0,max:1})}),viewProps:this.viewProps})}:null,this.alphaIcs_&&Qs({primary:this.value,secondary:this.alphaIcs_.text.value,forward:n=>n.getComponents()[3],backward:(n,s)=>{const r=n.getComponents();return r[3]=s,new ut(r,n.mode)}}),this.textsC_=new lw(e,{colorType:t.colorType,value:this.value,viewProps:this.viewProps}),this.view=new TS(e,{alphaViews:this.alphaIcs_?{palette:this.alphaIcs_.palette.view,text:this.alphaIcs_.text.view}:null,hPaletteView:this.hPaletteC_.view,supportsAlpha:t.supportsAlpha,svPaletteView:this.svPaletteC_.view,textsView:this.textsC_.view,viewProps:this.viewProps})}get textsController(){return this.textsC_}}const Qa=lt("colsw");class pw{constructor(e,t){this.onValueChange_=this.onValueChange_.bind(this),t.value.emitter.on("change",this.onValueChange_),this.value=t.value,this.element=e.createElement("div"),this.element.classList.add(Qa()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Qa("sw")),this.element.appendChild(n),this.swatchElem_=n;const s=e.createElement("button");s.classList.add(Qa("b")),t.viewProps.bindDisabled(s),this.element.appendChild(s),this.buttonElement=s,this.update_()}update_(){const e=this.value.rawValue;this.swatchElem_.style.backgroundColor=tu(e)}onValueChange_(){this.update_()}}class mw{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.view=new pw(e,{value:this.value,viewProps:this.viewProps})}}class nu{constructor(e,t){this.onButtonBlur_=this.onButtonBlur_.bind(this),this.onButtonClick_=this.onButtonClick_.bind(this),this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.foldable_=Fr.create(t.expanded),this.swatchC_=new mw(e,{value:this.value,viewProps:this.viewProps});const n=this.swatchC_.view.buttonElement;n.addEventListener("blur",this.onButtonBlur_),n.addEventListener("click",this.onButtonClick_),this.textC_=new Rr(e,{parser:t.parser,props:tt.fromObject({formatter:t.formatter}),value:this.value,viewProps:this.viewProps}),this.view=new _S(e,{foldable:this.foldable_,pickerLayout:t.pickerLayout}),this.view.swatchElement.appendChild(this.swatchC_.view.element),this.view.textElement.appendChild(this.textC_.view.element),this.popC_=t.pickerLayout==="popup"?new hf(e,{viewProps:this.viewProps}):null;const s=new fw(e,{colorType:t.colorType,supportsAlpha:t.supportsAlpha,value:this.value,viewProps:this.viewProps});s.view.allFocusableElements.forEach(r=>{r.addEventListener("blur",this.onPopupChildBlur_),r.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=s,this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(s.view.element),Qs({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:r=>r,backward:(r,o)=>o})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),jc(this.foldable_,this.view.pickerElement))}get textController(){return this.textC_}onButtonBlur_(e){if(!this.popC_)return;const t=this.view.element,n=e.relatedTarget;(!n||!t.contains(n))&&(this.popC_.shows.rawValue=!1)}onButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(e){if(!this.popC_)return;const t=this.popC_.view.element,n=tf(e);n&&t.contains(n)||n&&n===this.swatchC_.view.buttonElement&&!Vc(t.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(e){this.popC_?e.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&e.key==="Escape"&&this.swatchC_.view.buttonElement.focus()}}function gw(i){return Yn(i.getComponents("rgb")).reduce((e,t)=>e<<8|Math.floor(t)&255,0)}function vw(i){return i.getComponents("rgb").reduce((e,t,n)=>{const s=Math.floor(n===3?t*255:t)&255;return e<<8|s},0)>>>0}function _w(i){return new ut([i>>16&255,i>>8&255,i&255],"rgb")}function xw(i){return new ut([i>>24&255,i>>16&255,i>>8&255,ft(i&255,0,255,0,1)],"rgb")}function bw(i){return typeof i!="number"?ut.black():_w(i)}function yw(i){return typeof i!="number"?ut.black():xw(i)}function zo(i,e){return typeof i!="object"||xt(i)?!1:e in i&&typeof i[e]=="number"}function Nf(i){return zo(i,"r")&&zo(i,"g")&&zo(i,"b")}function kf(i){return Nf(i)&&zo(i,"a")}function Ff(i){return Nf(i)}function iu(i,e){if(i.mode!==e.mode||i.type!==e.type)return!1;const t=i.getComponents(),n=e.getComponents();for(let s=0;s<t.length;s++)if(t[s]!==n[s])return!1;return!0}function Fh(i){return"a"in i?[i.r,i.g,i.b,i.a]:[i.r,i.g,i.b]}function Sw(i){const e=Of(i);return e?(t,n)=>{Gr(t,e(n))}:null}function ww(i){const e=i?vw:gw;return(t,n)=>{Gr(t,e(n))}}function Mw(i,e,t){const s=en(e,t).toRgbaObject();i.writeProperty("r",s.r),i.writeProperty("g",s.g),i.writeProperty("b",s.b),i.writeProperty("a",s.a)}function Ew(i,e,t){const s=en(e,t).toRgbaObject();i.writeProperty("r",s.r),i.writeProperty("g",s.g),i.writeProperty("b",s.b)}function Tw(i,e){return(t,n)=>{i?Mw(t,n,e):Ew(t,n,e)}}function Cw(i){var e;return!!(!((e=i?.color)===null||e===void 0)&&e.alpha)}function Aw(i){return i?e=>tu(e,"0x"):e=>eu(e,"0x")}function Pw(i){return"color"in i||i.view==="color"}const Rw=tn({id:"input-color-number",type:"input",accept:(i,e)=>{if(typeof i!="number"||!Pw(e))return null;const t=Zc(e);return t?{initialValue:i,params:Object.assign(Object.assign({},t),{supportsAlpha:Cw(e)})}:null},binding:{reader:i=>i.params.supportsAlpha?yw:bw,equals:iu,writer:i=>ww(i.params.supportsAlpha)},controller:i=>{var e,t;return new nu(i.document,{colorType:"int",expanded:(e=i.params.expanded)!==null&&e!==void 0?e:!1,formatter:Aw(i.params.supportsAlpha),parser:Wr("int"),pickerLayout:(t=i.params.picker)!==null&&t!==void 0?t:"popup",supportsAlpha:i.params.supportsAlpha,value:i.value,viewProps:i.viewProps})}});function Dw(i,e){if(!Ff(i))return en(ut.black(),e);if(e==="int"){const t=Fh(i);return new ut(t,"rgb")}if(e==="float"){const t=Fh(i);return new Jc(t,"rgb")}return en(ut.black(),"int")}function Iw(i){return kf(i)}function Lw(i){return e=>{const t=Dw(e,i);return en(t,"int")}}function Uw(i,e){return t=>i?Uf(t,e):Lf(t,e)}const Ow=tn({id:"input-color-object",type:"input",accept:(i,e)=>{var t;if(!Ff(i))return null;const n=Zc(e);return n?{initialValue:i,params:Object.assign(Object.assign({},n),{colorType:(t=yf(e))!==null&&t!==void 0?t:"int"})}:null},binding:{reader:i=>Lw(i.params.colorType),equals:iu,writer:i=>Tw(Iw(i.initialValue),i.params.colorType)},controller:i=>{var e,t;const n=kf(i.initialValue);return new nu(i.document,{colorType:i.params.colorType,expanded:(e=i.params.expanded)!==null&&e!==void 0?e:!1,formatter:Uw(n,i.params.colorType),parser:Wr("int"),pickerLayout:(t=i.params.picker)!==null&&t!==void 0?t:"popup",supportsAlpha:n,value:i.value,viewProps:i.viewProps})}}),Nw=tn({id:"input-color-string",type:"input",accept:(i,e)=>{if(typeof i!="string"||e.view==="text")return null;const t=XS(i,yf(e));if(!t)return null;const n=Of(t);if(!n)return null;const s=Zc(e);return s?{initialValue:i,params:Object.assign(Object.assign({},s),{format:t,stringifier:n})}:null},binding:{reader:()=>qS,equals:iu,writer:i=>{const e=Sw(i.params.format);if(!e)throw Lt.notBindable();return e}},controller:i=>{var e,t;return new nu(i.document,{colorType:i.params.format.type,expanded:(e=i.params.expanded)!==null&&e!==void 0?e:!1,formatter:i.params.stringifier,parser:Wr("int"),pickerLayout:(t=i.params.picker)!==null&&t!==void 0?t:"popup",supportsAlpha:i.params.format.alpha,value:i.value,viewProps:i.viewProps})}});class su{constructor(e){this.components=e.components,this.asm_=e.assembly}constrain(e){const t=this.asm_.toComponents(e).map((n,s)=>{var r,o;return(o=(r=this.components[s])===null||r===void 0?void 0:r.constrain(n))!==null&&o!==void 0?o:n});return this.asm_.fromComponents(t)}}const Bh=lt("pndtxt");class kw{constructor(e,t){this.textViews=t.textViews,this.element=e.createElement("div"),this.element.classList.add(Bh()),this.textViews.forEach(n=>{const s=e.createElement("div");s.classList.add(Bh("a")),s.appendChild(n.element),this.element.appendChild(s)})}}function Fw(i,e,t){return new Hr(i,{arrayPosition:t===0?"fst":t===e.axes.length-1?"lst":"mid",parser:e.parser,props:e.axes[t].textProps,value:Ct(0,{constraint:e.axes[t].constraint}),viewProps:e.viewProps})}class ru{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.acs_=t.axes.map((n,s)=>Fw(e,t,s)),this.acs_.forEach((n,s)=>{Qs({primary:this.value,secondary:n.value,forward:r=>t.assembly.toComponents(r)[s],backward:(r,o)=>{const a=t.assembly.toComponents(r);return a[s]=o,t.assembly.fromComponents(a)}})}),this.view=new kw(e,{textViews:this.acs_.map(n=>n.view)})}get textControllers(){return this.acs_}}class Bw extends Pr{get max(){return this.controller.valueController.sliderController.props.get("max")}set max(e){this.controller.valueController.sliderController.props.set("max",e)}get min(){return this.controller.valueController.sliderController.props.get("min")}set min(e){this.controller.valueController.sliderController.props.set("min",e)}}function zw(i,e){const t=[],n=Kd(i,e);n&&t.push(n);const s=Yd(i);s&&t.push(s);const r=$c(i.options);return r&&t.push(r),new Br(t)}const Vw=tn({id:"input-number",type:"input",accept:(i,e)=>{if(typeof i!="number")return null;const t=Dt(e,n=>Object.assign(Object.assign({},Zd(n)),{options:n.optional.custom(Vr),readonly:n.optional.constant(!1)}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>Wd,constraint:i=>zw(i.params,i.initialValue),writer:i=>Gr},controller:i=>{const e=i.value,t=i.constraint,n=t&&$o(t,zr);if(n)return new Oi(i.document,{props:new tt({options:n.values.value("options")}),value:e,viewProps:i.viewProps});const s=$d(i.params,e.rawValue),r=t&&$o(t,Nr);return r?new Jo(i.document,Object.assign(Object.assign({},mf(Object.assign(Object.assign({},s),{keyScale:Ct(s.keyScale),max:r.values.value("max"),min:r.values.value("min")}))),{parser:mi,value:e,viewProps:i.viewProps})):new Hr(i.document,{parser:mi,props:tt.fromObject(s),value:e,viewProps:i.viewProps})},api(i){return typeof i.controller.value.rawValue!="number"?null:i.controller.valueController instanceof Jo?new Bw(i.controller):i.controller.valueController instanceof Oi?new Kc(i.controller):null}});class Ui{constructor(e=0,t=0){this.x=e,this.y=t}getComponents(){return[this.x,this.y]}static isObject(e){if(xt(e))return!1;const t=e.x,n=e.y;return!(typeof t!="number"||typeof n!="number")}static equals(e,t){return e.x===t.x&&e.y===t.y}toObject(){return{x:this.x,y:this.y}}}const Bf={toComponents:i=>i.getComponents(),fromComponents:i=>new Ui(...i)},Es=lt("p2d");class Hw{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Es()),t.viewProps.bindClassModifiers(this.element),pi(t.expanded,$s(this.element,Es(void 0,"expanded")));const n=e.createElement("div");n.classList.add(Es("h")),this.element.appendChild(n);const s=e.createElement("button");s.classList.add(Es("b")),s.appendChild(aa(e,"p2dpad")),t.viewProps.bindDisabled(s),n.appendChild(s),this.buttonElement=s;const r=e.createElement("div");if(r.classList.add(Es("t")),n.appendChild(r),this.textElement=r,t.pickerLayout==="inline"){const o=e.createElement("div");o.classList.add(Es("p")),this.element.appendChild(o),this.pickerElement=o}else this.pickerElement=null}}const Ci=lt("p2dp");class Gw{constructor(e,t){this.onFoldableChange_=this.onFoldableChange_.bind(this),this.onPropsChange_=this.onPropsChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.props_=t.props,this.props_.emitter.on("change",this.onPropsChange_),this.element=e.createElement("div"),this.element.classList.add(Ci()),t.layout==="popup"&&this.element.classList.add(Ci(void 0,"p")),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("div");n.classList.add(Ci("p")),t.viewProps.bindTabIndex(n),this.element.appendChild(n),this.padElement=n;const s=e.createElementNS(Wn,"svg");s.classList.add(Ci("g")),this.padElement.appendChild(s),this.svgElem_=s;const r=e.createElementNS(Wn,"line");r.classList.add(Ci("ax")),r.setAttributeNS(null,"x1","0"),r.setAttributeNS(null,"y1","50%"),r.setAttributeNS(null,"x2","100%"),r.setAttributeNS(null,"y2","50%"),this.svgElem_.appendChild(r);const o=e.createElementNS(Wn,"line");o.classList.add(Ci("ax")),o.setAttributeNS(null,"x1","50%"),o.setAttributeNS(null,"y1","0"),o.setAttributeNS(null,"x2","50%"),o.setAttributeNS(null,"y2","100%"),this.svgElem_.appendChild(o);const a=e.createElementNS(Wn,"line");a.classList.add(Ci("l")),a.setAttributeNS(null,"x1","50%"),a.setAttributeNS(null,"y1","50%"),this.svgElem_.appendChild(a),this.lineElem_=a;const l=e.createElement("div");l.classList.add(Ci("m")),this.padElement.appendChild(l),this.markerElem_=l,t.value.emitter.on("change",this.onValueChange_),this.value=t.value,this.update_()}get allFocusableElements(){return[this.padElement]}update_(){const[e,t]=this.value.rawValue.getComponents(),n=this.props_.get("max"),s=ft(e,-n,+n,0,100),r=ft(t,-n,+n,0,100),o=this.props_.get("invertsY")?100-r:r;this.lineElem_.setAttributeNS(null,"x2",`${s}%`),this.lineElem_.setAttributeNS(null,"y2",`${o}%`),this.markerElem_.style.left=`${s}%`,this.markerElem_.style.top=`${o}%`}onValueChange_(){this.update_()}onPropsChange_(){this.update_()}onFoldableChange_(){this.update_()}}function zh(i,e,t){return[an(e[0],gi(i)),an(e[1],Dr(i))*(t?1:-1)]}class Ww{constructor(e,t){this.onPadKeyDown_=this.onPadKeyDown_.bind(this),this.onPadKeyUp_=this.onPadKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.props=t.props,this.value=t.value,this.viewProps=t.viewProps,this.view=new Gw(e,{layout:t.layout,props:this.props,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new os(this.view.padElement),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.padElement.addEventListener("keydown",this.onPadKeyDown_),this.view.padElement.addEventListener("keyup",this.onPadKeyUp_)}handlePointerEvent_(e,t){if(!e.point)return;const n=this.props.get("max"),s=ft(e.point.x,0,e.bounds.width,-n,+n),r=ft(this.props.get("invertsY")?e.bounds.height-e.point.y:e.point.y,0,e.bounds.height,-n,+n);this.value.setRawValue(new Ui(s,r),t)}onPointerDown_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerMove_(e){this.handlePointerEvent_(e.data,{forceEmit:!1,last:!1})}onPointerUp_(e){this.handlePointerEvent_(e.data,{forceEmit:!0,last:!0})}onPadKeyDown_(e){pf(e.key)&&e.preventDefault();const[t,n]=zh(e,[this.props.get("xKeyScale"),this.props.get("yKeyScale")],this.props.get("invertsY"));t===0&&n===0||this.value.setRawValue(new Ui(this.value.rawValue.x+t,this.value.rawValue.y+n),{forceEmit:!1,last:!1})}onPadKeyUp_(e){const[t,n]=zh(e,[this.props.get("xKeyScale"),this.props.get("yKeyScale")],this.props.get("invertsY"));t===0&&n===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class Xw{constructor(e,t){var n,s;this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.onPadButtonBlur_=this.onPadButtonBlur_.bind(this),this.onPadButtonClick_=this.onPadButtonClick_.bind(this),this.value=t.value,this.viewProps=t.viewProps,this.foldable_=Fr.create(t.expanded),this.popC_=t.pickerLayout==="popup"?new hf(e,{viewProps:this.viewProps}):null;const r=new Ww(e,{layout:t.pickerLayout,props:new tt({invertsY:Ct(t.invertsY),max:Ct(t.max),xKeyScale:t.axes[0].textProps.value("keyScale"),yKeyScale:t.axes[1].textProps.value("keyScale")}),value:this.value,viewProps:this.viewProps});r.view.allFocusableElements.forEach(o=>{o.addEventListener("blur",this.onPopupChildBlur_),o.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=r,this.textC_=new ru(e,{assembly:Bf,axes:t.axes,parser:t.parser,value:this.value,viewProps:this.viewProps}),this.view=new Hw(e,{expanded:this.foldable_.value("expanded"),pickerLayout:t.pickerLayout,viewProps:this.viewProps}),this.view.textElement.appendChild(this.textC_.view.element),(n=this.view.buttonElement)===null||n===void 0||n.addEventListener("blur",this.onPadButtonBlur_),(s=this.view.buttonElement)===null||s===void 0||s.addEventListener("click",this.onPadButtonClick_),this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(this.pickerC_.view.element),Qs({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:o=>o,backward:(o,a)=>a})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),jc(this.foldable_,this.view.pickerElement))}get textController(){return this.textC_}onPadButtonBlur_(e){if(!this.popC_)return;const t=this.view.element,n=e.relatedTarget;(!n||!t.contains(n))&&(this.popC_.shows.rawValue=!1)}onPadButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(e){if(!this.popC_)return;const t=this.popC_.view.element,n=tf(e);n&&t.contains(n)||n&&n===this.view.buttonElement&&!Vc(t.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(e){this.popC_?e.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&e.key==="Escape"&&this.view.buttonElement.focus()}}function qw(i){return Ui.isObject(i)?new Ui(i.x,i.y):new Ui}function jw(i,e){i.writeProperty("x",e.x),i.writeProperty("y",e.y)}function Kw(i,e){return new su({assembly:Bf,components:[ui(Object.assign(Object.assign({},i),i.x),e.x),ui(Object.assign(Object.assign({},i),i.y),e.y)]})}function Vh(i,e){var t,n;if(!xt(i.min)||!xt(i.max))return Math.max(Math.abs((t=i.min)!==null&&t!==void 0?t:0),Math.abs((n=i.max)!==null&&n!==void 0?n:0));const s=qd(i);return Math.max(Math.abs(s)*10,Math.abs(e)*10)}function Yw(i,e){var t,n;const s=Vh(ts(i,(t=i.x)!==null&&t!==void 0?t:{}),e.x),r=Vh(ts(i,(n=i.y)!==null&&n!==void 0?n:{}),e.y);return Math.max(s,r)}function $w(i){if(!("y"in i))return!1;const e=i.y;return e&&"inverted"in e?!!e.inverted:!1}const Zw=tn({id:"input-point2d",type:"input",accept:(i,e)=>{if(!Ui.isObject(i))return null;const t=Dt(e,n=>Object.assign(Object.assign({},Ir(n)),{expanded:n.optional.boolean,picker:n.optional.custom(vf),readonly:n.optional.constant(!1),x:n.optional.custom(Ii),y:n.optional.object(Object.assign(Object.assign({},Ir(n)),{inverted:n.optional.boolean}))}));return t?{initialValue:i,params:t}:null},binding:{reader:()=>qw,constraint:i=>Kw(i.params,i.initialValue),equals:Ui.equals,writer:()=>jw},controller:i=>{var e,t;const n=i.document,s=i.value,r=i.constraint,o=[i.params.x,i.params.y];return new Xw(n,{axes:s.rawValue.getComponents().map((a,l)=>{var c;return zc({constraint:r.components[l],initialValue:a,params:ts(i.params,(c=o[l])!==null&&c!==void 0?c:{})})}),expanded:(e=i.params.expanded)!==null&&e!==void 0?e:!1,invertsY:$w(i.params),max:Yw(i.params,s.rawValue),parser:mi,pickerLayout:(t=i.params.picker)!==null&&t!==void 0?t:"popup",value:s,viewProps:i.viewProps})}});class Is{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}getComponents(){return[this.x,this.y,this.z]}static isObject(e){if(xt(e))return!1;const t=e.x,n=e.y,s=e.z;return!(typeof t!="number"||typeof n!="number"||typeof s!="number")}static equals(e,t){return e.x===t.x&&e.y===t.y&&e.z===t.z}toObject(){return{x:this.x,y:this.y,z:this.z}}}const zf={toComponents:i=>i.getComponents(),fromComponents:i=>new Is(...i)};function Jw(i){return Is.isObject(i)?new Is(i.x,i.y,i.z):new Is}function Qw(i,e){i.writeProperty("x",e.x),i.writeProperty("y",e.y),i.writeProperty("z",e.z)}function eM(i,e){return new su({assembly:zf,components:[ui(Object.assign(Object.assign({},i),i.x),e.x),ui(Object.assign(Object.assign({},i),i.y),e.y),ui(Object.assign(Object.assign({},i),i.z),e.z)]})}const tM=tn({id:"input-point3d",type:"input",accept:(i,e)=>{if(!Is.isObject(i))return null;const t=Dt(e,n=>Object.assign(Object.assign({},Ir(n)),{readonly:n.optional.constant(!1),x:n.optional.custom(Ii),y:n.optional.custom(Ii),z:n.optional.custom(Ii)}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>Jw,constraint:i=>eM(i.params,i.initialValue),equals:Is.equals,writer:i=>Qw},controller:i=>{const e=i.value,t=i.constraint,n=[i.params.x,i.params.y,i.params.z];return new ru(i.document,{assembly:zf,axes:e.rawValue.getComponents().map((s,r)=>{var o;return zc({constraint:t.components[r],initialValue:s,params:ts(i.params,(o=n[r])!==null&&o!==void 0?o:{})})}),parser:mi,value:e,viewProps:i.viewProps})}});class Ls{constructor(e=0,t=0,n=0,s=0){this.x=e,this.y=t,this.z=n,this.w=s}getComponents(){return[this.x,this.y,this.z,this.w]}static isObject(e){if(xt(e))return!1;const t=e.x,n=e.y,s=e.z,r=e.w;return!(typeof t!="number"||typeof n!="number"||typeof s!="number"||typeof r!="number")}static equals(e,t){return e.x===t.x&&e.y===t.y&&e.z===t.z&&e.w===t.w}toObject(){return{x:this.x,y:this.y,z:this.z,w:this.w}}}const Vf={toComponents:i=>i.getComponents(),fromComponents:i=>new Ls(...i)};function nM(i){return Ls.isObject(i)?new Ls(i.x,i.y,i.z,i.w):new Ls}function iM(i,e){i.writeProperty("x",e.x),i.writeProperty("y",e.y),i.writeProperty("z",e.z),i.writeProperty("w",e.w)}function sM(i,e){return new su({assembly:Vf,components:[ui(Object.assign(Object.assign({},i),i.x),e.x),ui(Object.assign(Object.assign({},i),i.y),e.y),ui(Object.assign(Object.assign({},i),i.z),e.z),ui(Object.assign(Object.assign({},i),i.w),e.w)]})}const rM=tn({id:"input-point4d",type:"input",accept:(i,e)=>{if(!Ls.isObject(i))return null;const t=Dt(e,n=>Object.assign(Object.assign({},Ir(n)),{readonly:n.optional.constant(!1),w:n.optional.custom(Ii),x:n.optional.custom(Ii),y:n.optional.custom(Ii),z:n.optional.custom(Ii)}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>nM,constraint:i=>sM(i.params,i.initialValue),equals:Ls.equals,writer:i=>iM},controller:i=>{const e=i.value,t=i.constraint,n=[i.params.x,i.params.y,i.params.z,i.params.w];return new ru(i.document,{assembly:Vf,axes:e.rawValue.getComponents().map((s,r)=>{var o;return zc({constraint:t.components[r],initialValue:s,params:ts(i.params,(o=n[r])!==null&&o!==void 0?o:{})})}),parser:mi,value:e,viewProps:i.viewProps})}});function oM(i){const e=[],t=$c(i.options);return t&&e.push(t),new Br(e)}const aM=tn({id:"input-string",type:"input",accept:(i,e)=>{if(typeof i!="string")return null;const t=Dt(e,n=>({readonly:n.optional.constant(!1),options:n.optional.custom(Vr)}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>ff,constraint:i=>oM(i.params),writer:i=>Gr},controller:i=>{const e=i.document,t=i.value,n=i.constraint,s=n&&$o(n,zr);return s?new Oi(e,{props:new tt({options:s.values.value("options")}),value:t,viewProps:i.viewProps}):new Rr(e,{parser:r=>r,props:tt.fromObject({formatter:rc}),value:t,viewProps:i.viewProps})},api(i){return typeof i.controller.value.rawValue!="string"?null:i.controller.valueController instanceof Oi?new Kc(i.controller):null}}),Xr={monitor:{defaultInterval:200,defaultRows:3}},Hh=lt("mll");class lM{constructor(e,t){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=t.formatter,this.element=e.createElement("div"),this.element.classList.add(Hh()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("textarea");n.classList.add(Hh("i")),n.style.height=`calc(var(${gf("containerUnitSize")}) * ${t.rows})`,n.readOnly=!0,t.viewProps.bindDisabled(n),this.element.appendChild(n),this.textareaElem_=n,t.value.emitter.on("change",this.onValueUpdate_),this.value=t.value,this.update_()}update_(){const e=this.textareaElem_,t=e.scrollTop===e.scrollHeight-e.clientHeight,n=[];this.value.rawValue.forEach(s=>{s!==void 0&&n.push(this.formatter_(s))}),e.textContent=n.join(`
`),t&&(e.scrollTop=e.scrollHeight)}onValueUpdate_(){this.update_()}}class ou{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.view=new lM(e,{formatter:t.formatter,rows:t.rows,value:this.value,viewProps:this.viewProps})}}const Gh=lt("sgl");class cM{constructor(e,t){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=t.formatter,this.element=e.createElement("div"),this.element.classList.add(Gh()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("input");n.classList.add(Gh("i")),n.readOnly=!0,n.type="text",t.viewProps.bindDisabled(n),this.element.appendChild(n),this.inputElement=n,t.value.emitter.on("change",this.onValueUpdate_),this.value=t.value,this.update_()}update_(){const e=this.value.rawValue,t=e[e.length-1];this.inputElement.value=t!==void 0?this.formatter_(t):""}onValueUpdate_(){this.update_()}}class au{constructor(e,t){this.value=t.value,this.viewProps=t.viewProps,this.view=new cM(e,{formatter:t.formatter,value:this.value,viewProps:this.viewProps})}}const uM=tn({id:"monitor-bool",type:"monitor",accept:(i,e)=>{if(typeof i!="boolean")return null;const t=Dt(e,n=>({readonly:n.required.constant(!0),rows:n.optional.number}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>df},controller:i=>{var e;return i.value.rawValue.length===1?new au(i.document,{formatter:Oh,value:i.value,viewProps:i.viewProps}):new ou(i.document,{formatter:Oh,rows:(e=i.params.rows)!==null&&e!==void 0?e:Xr.monitor.defaultRows,value:i.value,viewProps:i.viewProps})}});class hM extends Pr{get max(){return this.controller.valueController.props.get("max")}set max(e){this.controller.valueController.props.set("max",e)}get min(){return this.controller.valueController.props.get("min")}set min(e){this.controller.valueController.props.set("min",e)}}const Ai=lt("grl");class dM{constructor(e,t){this.onCursorChange_=this.onCursorChange_.bind(this),this.onValueUpdate_=this.onValueUpdate_.bind(this),this.element=e.createElement("div"),this.element.classList.add(Ai()),t.viewProps.bindClassModifiers(this.element),this.formatter_=t.formatter,this.props_=t.props,this.cursor_=t.cursor,this.cursor_.emitter.on("change",this.onCursorChange_);const n=e.createElementNS(Wn,"svg");n.classList.add(Ai("g")),n.style.height=`calc(var(${gf("containerUnitSize")}) * ${t.rows})`,this.element.appendChild(n),this.svgElem_=n;const s=e.createElementNS(Wn,"polyline");this.svgElem_.appendChild(s),this.lineElem_=s;const r=e.createElement("div");r.classList.add(Ai("t"),lt("tt")()),this.element.appendChild(r),this.tooltipElem_=r,t.value.emitter.on("change",this.onValueUpdate_),this.value=t.value,this.update_()}get graphElement(){return this.svgElem_}update_(){const{clientWidth:e,clientHeight:t}=this.element,n=this.value.rawValue.length-1,s=this.props_.get("min"),r=this.props_.get("max"),o=[];this.value.rawValue.forEach((h,f)=>{if(h===void 0)return;const m=ft(f,0,n,0,e),_=ft(h,s,r,t,0);o.push([m,_].join(","))}),this.lineElem_.setAttributeNS(null,"points",o.join(" "));const a=this.tooltipElem_,l=this.value.rawValue[this.cursor_.rawValue];if(l===void 0){a.classList.remove(Ai("t","a"));return}const c=ft(this.cursor_.rawValue,0,n,0,e),u=ft(l,s,r,t,0);a.style.left=`${c}px`,a.style.top=`${u}px`,a.textContent=`${this.formatter_(l)}`,a.classList.contains(Ai("t","a"))||(a.classList.add(Ai("t","a"),Ai("t","in")),Yo(a),a.classList.remove(Ai("t","in")))}onValueUpdate_(){this.update_()}onCursorChange_(){this.update_()}}class Hf{constructor(e,t){if(this.onGraphMouseMove_=this.onGraphMouseMove_.bind(this),this.onGraphMouseLeave_=this.onGraphMouseLeave_.bind(this),this.onGraphPointerDown_=this.onGraphPointerDown_.bind(this),this.onGraphPointerMove_=this.onGraphPointerMove_.bind(this),this.onGraphPointerUp_=this.onGraphPointerUp_.bind(this),this.props=t.props,this.value=t.value,this.viewProps=t.viewProps,this.cursor_=Ct(-1),this.view=new dM(e,{cursor:this.cursor_,formatter:t.formatter,rows:t.rows,props:this.props,value:this.value,viewProps:this.viewProps}),!Vc(e))this.view.element.addEventListener("mousemove",this.onGraphMouseMove_),this.view.element.addEventListener("mouseleave",this.onGraphMouseLeave_);else{const n=new os(this.view.element);n.emitter.on("down",this.onGraphPointerDown_),n.emitter.on("move",this.onGraphPointerMove_),n.emitter.on("up",this.onGraphPointerUp_)}}importProps(e){return fn(e,null,t=>({max:t.required.number,min:t.required.number}),t=>(this.props.set("max",t.max),this.props.set("min",t.min),!0))}exportProps(){return pn(null,{max:this.props.get("max"),min:this.props.get("min")})}onGraphMouseLeave_(){this.cursor_.rawValue=-1}onGraphMouseMove_(e){const{clientWidth:t}=this.view.element;this.cursor_.rawValue=Math.floor(ft(e.offsetX,0,t,0,this.value.rawValue.length))}onGraphPointerDown_(e){this.onGraphPointerMove_(e)}onGraphPointerMove_(e){if(!e.data.point){this.cursor_.rawValue=-1;return}this.cursor_.rawValue=Math.floor(ft(e.data.point.x,0,e.data.bounds.width,0,this.value.rawValue.length))}onGraphPointerUp_(){this.cursor_.rawValue=-1}}function oc(i){return xt(i.format)?cn(2):i.format}function fM(i){var e;return i.value.rawValue.length===1?new au(i.document,{formatter:oc(i.params),value:i.value,viewProps:i.viewProps}):new ou(i.document,{formatter:oc(i.params),rows:(e=i.params.rows)!==null&&e!==void 0?e:Xr.monitor.defaultRows,value:i.value,viewProps:i.viewProps})}function pM(i){var e,t,n;return new Hf(i.document,{formatter:oc(i.params),rows:(e=i.params.rows)!==null&&e!==void 0?e:Xr.monitor.defaultRows,props:tt.fromObject({max:(t=i.params.max)!==null&&t!==void 0?t:100,min:(n=i.params.min)!==null&&n!==void 0?n:0}),value:i.value,viewProps:i.viewProps})}function Wh(i){return i.view==="graph"}const mM=tn({id:"monitor-number",type:"monitor",accept:(i,e)=>{if(typeof i!="number")return null;const t=Dt(e,n=>({format:n.optional.function,max:n.optional.number,min:n.optional.number,readonly:n.required.constant(!0),rows:n.optional.number,view:n.optional.string}));return t?{initialValue:i,params:t}:null},binding:{defaultBufferSize:i=>Wh(i)?64:1,reader:i=>Wd},controller:i=>Wh(i.params)?pM(i):fM(i),api:i=>i.controller.valueController instanceof Hf?new hM(i.controller):null}),gM=tn({id:"monitor-string",type:"monitor",accept:(i,e)=>{if(typeof i!="string")return null;const t=Dt(e,n=>({multiline:n.optional.boolean,readonly:n.required.constant(!0),rows:n.optional.number}));return t?{initialValue:i,params:t}:null},binding:{reader:i=>ff},controller:i=>{var e;const t=i.value;return t.rawValue.length>1||i.params.multiline?new ou(i.document,{formatter:rc,rows:(e=i.params.rows)!==null&&e!==void 0?e:Xr.monitor.defaultRows,value:t,viewProps:i.viewProps}):new au(i.document,{formatter:rc,value:t,viewProps:i.viewProps})}});class vM{constructor(){this.map_=new Map}get(e){var t;return(t=this.map_.get(e))!==null&&t!==void 0?t:null}has(e){return this.map_.has(e)}add(e,t){return this.map_.set(e,t),e.viewProps.handleDispose(()=>{this.map_.delete(e)}),t}}class _M{constructor(e){this.target=e.target,this.reader_=e.reader,this.writer_=e.writer}read(){return this.reader_(this.target.read())}write(e){this.writer_(this.target,e)}inject(e){this.write(this.reader_(e))}}function xM(i,e){var t;const n=i.accept(e.target.read(),e.params);if(xt(n))return null;const s={target:e.target,initialValue:n.initialValue,params:n.params},r=Dt(e.params,h=>({disabled:h.optional.boolean,hidden:h.optional.boolean,label:h.optional.string,tag:h.optional.string})),o=i.binding.reader(s),a=i.binding.constraint?i.binding.constraint(s):void 0,l=new _M({reader:o,target:e.target,writer:i.binding.writer(s)}),c=new ny(Ct(o(n.initialValue),{constraint:a,equals:i.binding.equals}),l),u=i.controller({constraint:a,document:e.document,initialValue:n.initialValue,params:n.params,value:c,viewProps:_i.create({disabled:r?.disabled,hidden:r?.hidden})});return new vy(e.document,{blade:Js(),props:tt.fromObject({label:"label"in e.params?(t=r?.label)!==null&&t!==void 0?t:null:e.target.key}),tag:r?.tag,value:c,valueController:u})}class bM{constructor(e){this.target=e.target,this.reader_=e.reader}read(){return this.reader_(this.target.read())}}function yM(i,e){return e===0?new Qy:new eS(i,e??Xr.monitor.defaultInterval)}function SM(i,e){var t,n,s;const r=i.accept(e.target.read(),e.params);if(xt(r))return null;const o={target:e.target,initialValue:r.initialValue,params:r.params},a=Dt(e.params,f=>({bufferSize:f.optional.number,disabled:f.optional.boolean,hidden:f.optional.boolean,interval:f.optional.number,label:f.optional.string})),l=i.binding.reader(o),c=(n=(t=a?.bufferSize)!==null&&t!==void 0?t:i.binding.defaultBufferSize&&i.binding.defaultBufferSize(r.params))!==null&&n!==void 0?n:1,u=new Sy({binding:new bM({reader:l,target:e.target}),bufferSize:c,ticker:yM(e.document,a?.interval)}),h=i.controller({document:e.document,params:r.params,value:u,viewProps:_i.create({disabled:a?.disabled,hidden:a?.hidden})});return h.viewProps.bindDisabled(u.ticker),h.viewProps.handleDispose(()=>{u.ticker.dispose()}),new My(e.document,{blade:Js(),props:tt.fromObject({label:"label"in e.params?(s=a?.label)!==null&&s!==void 0?s:null:e.target.key}),value:u,valueController:h})}class wM{constructor(e){this.pluginsMap_={blades:[],inputs:[],monitors:[]},this.apiCache_=e}getAll(){return[...this.pluginsMap_.blades,...this.pluginsMap_.inputs,...this.pluginsMap_.monitors]}register(e,t){if(!fS(t.core))throw Lt.notCompatible(e,t.id);t.type==="blade"?this.pluginsMap_.blades.unshift(t):t.type==="input"?this.pluginsMap_.inputs.unshift(t):t.type==="monitor"&&this.pluginsMap_.monitors.unshift(t)}createInput_(e,t,n){return this.pluginsMap_.inputs.reduce((s,r)=>s??xM(r,{document:e,target:t,params:n}),null)}createMonitor_(e,t,n){return this.pluginsMap_.monitors.reduce((s,r)=>s??SM(r,{document:e,params:n,target:t}),null)}createBinding(e,t,n){const s=t.read();if(xt(s))throw new Lt({context:{key:t.key},type:"nomatchingcontroller"});const r=this.createInput_(e,t,n);if(r)return r;const o=this.createMonitor_(e,t,n);if(o)return o;throw new Lt({context:{key:t.key},type:"nomatchingcontroller"})}createBlade(e,t){const n=this.pluginsMap_.blades.reduce((s,r)=>s??Jy(r,{document:e,params:t}),null);if(!n)throw new Lt({type:"nomatchingview",context:{params:t}});return n}createInputBindingApi_(e){const t=this.pluginsMap_.inputs.reduce((n,s)=>{var r,o;return n||((o=(r=s.api)===null||r===void 0?void 0:r.call(s,{controller:e}))!==null&&o!==void 0?o:null)},null);return this.apiCache_.add(e,t??new Pr(e))}createMonitorBindingApi_(e){const t=this.pluginsMap_.monitors.reduce((n,s)=>{var r,o;return n||((o=(r=s.api)===null||r===void 0?void 0:r.call(s,{controller:e}))!==null&&o!==void 0?o:null)},null);return this.apiCache_.add(e,t??new Pr(e))}createBindingApi(e){if(this.apiCache_.has(e))return this.apiCache_.get(e);if(_y(e))return this.createInputBindingApi_(e);if(Ey(e))return this.createMonitorBindingApi_(e);throw Lt.shouldNeverHappen()}createApi(e){if(this.apiCache_.has(e))return this.apiCache_.get(e);if(gy(e))return this.createBindingApi(e);const t=this.pluginsMap_.blades.reduce((n,s)=>n??s.api({controller:e,pool:this}),null);if(!t)throw Lt.shouldNeverHappen();return this.apiCache_.add(e,t)}}const MM=new vM;function EM(){const i=new wM(MM);return[Zw,tM,rM,aM,Vw,Nw,Ow,Rw,vS,uM,gM,mM,Ry,Gy,uf].forEach(e=>{i.register("core",e)}),i}class TM extends rs{constructor(e){super(e),this.emitter_=new Bt,this.controller.value.emitter.on("change",t=>{this.emitter_.emit("change",new kr(this,t.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(e){this.controller.labelController.props.set("label",e)}get options(){return this.controller.valueController.props.get("options")}set options(e){this.controller.valueController.props.set("options",e)}get value(){return this.controller.value.rawValue}set value(e){this.controller.value.rawValue=e}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}}class CM extends rs{}class AM extends rs{constructor(e){super(e),this.emitter_=new Bt,this.controller.value.emitter.on("change",t=>{this.emitter_.emit("change",new kr(this,t.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(e){this.controller.labelController.props.set("label",e)}get max(){return this.controller.valueController.sliderController.props.get("max")}set max(e){this.controller.valueController.sliderController.props.set("max",e)}get min(){return this.controller.valueController.sliderController.props.get("min")}set min(e){this.controller.valueController.sliderController.props.set("min",e)}get value(){return this.controller.value.rawValue}set value(e){this.controller.value.rawValue=e}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}}class PM extends rs{constructor(e){super(e),this.emitter_=new Bt,this.controller.value.emitter.on("change",t=>{this.emitter_.emit("change",new kr(this,t.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(e){this.controller.labelController.props.set("label",e)}get formatter(){return this.controller.valueController.props.get("formatter")}set formatter(e){this.controller.valueController.props.set("formatter",e)}get value(){return this.controller.value.rawValue}set value(e){this.controller.value.rawValue=e}on(e,t){const n=t.bind(this);return this.emitter_.on(e,s=>{n(s)},{key:t}),this}off(e,t){return this.emitter_.off(e,t),this}}const RM=(function(){return{id:"list",type:"blade",core:Zs,accept(i){const e=Dt(i,t=>({options:t.required.custom(Vr),value:t.required.raw,view:t.required.constant("list"),label:t.optional.string}));return e?{params:e}:null},controller(i){const e=new zr(Yc(i.params.options)),t=Ct(i.params.value,{constraint:e}),n=new Oi(i.document,{props:new tt({options:e.values.value("options")}),value:t,viewProps:i.viewProps});return new ns(i.document,{blade:i.blade,props:tt.fromObject({label:i.params.label}),value:t,valueController:n})},api(i){return!(i.controller instanceof ns)||!(i.controller.valueController instanceof Oi)?null:new TM(i.controller)}}})();class DM extends lf{constructor(e,t){super(e,t)}get element(){return this.controller.view.element}}class IM extends ic{constructor(e,t){super(e,{expanded:t.expanded,blade:t.blade,props:t.props,root:!0,viewProps:t.viewProps})}}const Xh=lt("spr");class LM{constructor(e,t){this.element=e.createElement("div"),this.element.classList.add(Xh()),t.viewProps.bindClassModifiers(this.element);const n=e.createElement("hr");n.classList.add(Xh("r")),this.element.appendChild(n)}}class qh extends la{constructor(e,t){super(Object.assign(Object.assign({},t),{view:new LM(e,{viewProps:t.viewProps})}))}}const UM={id:"separator",type:"blade",core:Zs,accept(i){const e=Dt(i,t=>({view:t.required.constant("separator")}));return e?{params:e}:null},controller(i){return new qh(i.document,{blade:i.blade,viewProps:i.viewProps})},api(i){return i.controller instanceof qh?new CM(i.controller):null}},OM={id:"slider",type:"blade",core:Zs,accept(i){const e=Dt(i,t=>({max:t.required.number,min:t.required.number,view:t.required.constant("slider"),format:t.optional.function,label:t.optional.string,value:t.optional.number}));return e?{params:e}:null},controller(i){var e,t;const n=(e=i.params.value)!==null&&e!==void 0?e:0,s=new Nr({max:i.params.max,min:i.params.min}),r=Ct(n,{constraint:s}),o=new Jo(i.document,Object.assign(Object.assign({},mf({formatter:(t=i.params.format)!==null&&t!==void 0?t:Zb,keyScale:Ct(1),max:s.values.value("max"),min:s.values.value("min"),pointerScale:jd(i.params,n)})),{parser:mi,value:r,viewProps:i.viewProps}));return new ns(i.document,{blade:i.blade,props:tt.fromObject({label:i.params.label}),value:r,valueController:o})},api(i){return!(i.controller instanceof ns)||!(i.controller.valueController instanceof Jo)?null:new AM(i.controller)}},NM=(function(){return{id:"text",type:"blade",core:Zs,accept(i){const e=Dt(i,t=>({parse:t.required.function,value:t.required.raw,view:t.required.constant("text"),format:t.optional.function,label:t.optional.string}));return e?{params:e}:null},controller(i){var e;const t=Ct(i.params.value),n=new Rr(i.document,{parser:i.params.parse,props:tt.fromObject({formatter:(e=i.params.format)!==null&&e!==void 0?e:(s=>String(s))}),value:t,viewProps:i.viewProps});return new ns(i.document,{blade:i.blade,props:tt.fromObject({label:i.params.label}),value:t,valueController:n})},api(i){return!(i.controller instanceof ns)||!(i.controller.valueController instanceof Rr)?null:new PM(i.controller)}}})();function kM(i){const e=i.createElement("div");return e.classList.add(lt("dfw")()),i.body&&i.body.appendChild(e),e}function FM(i,e,t){if(i.querySelector(`style[data-tp-style=${e}]`))return;const n=i.createElement("style");n.dataset.tpStyle=e,n.textContent=t,i.head.appendChild(n)}class BM extends DM{constructor(e){var t,n;const s=e??{},r=(t=s.document)!==null&&t!==void 0?t:cy(),o=EM(),a=new IM(r,{expanded:s.expanded,blade:Js(),props:tt.fromObject({title:s.title}),viewProps:_i.create()});super(a,o),this.pool_=o,this.containerElem_=(n=s.container)!==null&&n!==void 0?n:kM(r),this.containerElem_.appendChild(this.element),this.doc_=r,this.usesDefaultWrapper_=!s.container,this.setUpDefaultPlugins_()}get document(){if(!this.doc_)throw Lt.alreadyDisposed();return this.doc_}dispose(){const e=this.containerElem_;if(!e)throw Lt.alreadyDisposed();if(this.usesDefaultWrapper_){const t=e.parentElement;t&&t.removeChild(e)}this.containerElem_=null,this.doc_=null,super.dispose()}registerPlugin(e){e.css&&FM(this.document,`plugin-${e.id}`,e.css),("plugin"in e?[e.plugin]:"plugins"in e?e.plugins:[]).forEach(n=>{this.pool_.register(e.id,n)})}setUpDefaultPlugins_(){this.registerPlugin({id:"default",css:'.tp-tbiv_b,.tp-coltxtv_ms,.tp-colswv_b,.tp-ckbv_i,.tp-sglv_i,.tp-mllv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-rotv_b,.tp-fldv_b,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--bld-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--cnt-usz);line-height:var(--cnt-usz);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tbpv_c>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-vp))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tbpv_c>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--cnt-usp)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tbpv_c>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tbpv_c>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tbpv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tbpv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tbpv_c>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tbpv_c>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--bld-br);border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tbpv_c .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tbpv_c>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tbpv_c>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--bld-br)}.tp-tbpv_c .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--bld-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);overflow:hidden;padding-left:var(--cnt-hp);padding-right:calc(4px + var(--cnt-usz) + var(--cnt-hp));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-hp) + (var(--cnt-usz) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-vp);padding-top:var(--cnt-vp);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-sglv_i,.tp-mllv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--mo-fg);height:var(--cnt-usz);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-sglv_i::-webkit-scrollbar,.tp-mllv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-sglv_i::-webkit-scrollbar-corner,.tp-mllv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-sglv_i::-webkit-scrollbar-thumb,.tp-mllv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-rotv{--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-br: var(--tp-base-border-radius, 6px);--bs-ff: var(--tp-base-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--bld-br: var(--tp-blade-border-radius, 2px);--bld-hp: var(--tp-blade-horizontal-padding, 4px);--bld-vw: var(--tp-blade-value-width, 160px);--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--cnt-hp: var(--tp-container-horizontal-padding, 4px);--cnt-vp: var(--tp-container-vertical-padding, 4px);--cnt-usp: var(--tp-container-unit-spacing, 4px);--cnt-usz: var(--tp-container-unit-size, 20px);--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--bld-br);cursor:pointer;display:block;height:var(--cnt-usz);position:relative;width:var(--cnt-usz)}.tp-ckbv_w svg{display:block;height:16px;inset:0;margin:auto;opacity:0;position:absolute;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--cnt-usz)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-expanded.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--cnt-usp);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--cnt-usp)}.tp-colpv_rgb{display:flex;margin-top:var(--cnt-usp);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-vp);padding-top:calc(var(--cnt-vp) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-hp));position:absolute;right:calc(-1*var(--cnt-hp));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--bld-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--cnt-usz)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{inset:0;position:absolute}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--bld-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;inset:0;position:absolute}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--bld-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{cursor:pointer;display:block;height:var(--cnt-usz);left:0;position:absolute;top:0;width:var(--cnt-usz)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--bld-br);content:"";display:block;inset:0;position:absolute}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--bld-br);color:var(--lbl-fg);cursor:pointer;height:var(--cnt-usz);line-height:var(--cnt-usz);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--cnt-usz)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-hp);padding-right:var(--cnt-hp)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:var(--bld-vw)}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 var(--bld-hp);width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--cnt-usz)*3);line-height:var(--cnt-usz);padding-left:var(--bld-hp);padding-right:var(--bld-hp);resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--cnt-usz);margin-right:4px;position:relative;width:var(--cnt-usz)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--cnt-usp);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-p2dpv{padding-left:calc(var(--cnt-usz) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:var(--bld-vw);padding:var(--cnt-vp) var(--cnt-hp);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--cnt-usz);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin:auto;position:absolute}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin-bottom:auto;margin-top:auto;position:absolute}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--bld-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--cnt-usz) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-hp) + 4px);padding-right:calc(var(--cnt-hp) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);content:"";inset:0 0 2px;pointer-events:none;position:absolute}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);opacity:.5;overflow:hidden;position:relative;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-tbpv_c{padding-bottom:var(--cnt-vp);padding-left:4px;padding-top:var(--cnt-vp)}.tp-txtv{position:relative}.tp-txtv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:calc(var(--bld-hp) - 5px);position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--cnt-usz) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--bld-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--bs-ff);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--cnt-usz) + var(--cnt-hp));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0;transition-delay:0s;transition-duration:0s}.tp-rotv.tp-rotv-not>.tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst.tp-fldv-expanded>.tp-fldv_b{transition-delay:0s;transition-duration:0s}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}',plugins:[RM,UM,OM,uf,NM]})}}new af("4.0.5");class zM{ui;metaballs;postprocessing;constructor(){this.ui=new BM,this.metaballs=this.ui.addFolder({title:"metaballs",expanded:!1}),this.postprocessing=this.ui.addFolder({title:"Postprocessing"}),this.ui.hidden=!0}}/**
 * postprocessing v6.37.8 build Fri Sep 12 2025
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2025 Raoul van Rüschen
 * @license Zlib
 */var el=1/1e3,VM=1e3,HM=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(i){typeof document<"u"&&document.hidden!==void 0&&(i?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=i)}get delta(){return this._delta*el}get fixedDelta(){return this._fixedDelta*el}set fixedDelta(i){this._fixedDelta=i*VM}get elapsed(){return this._elapsed*el}update(i){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(i!==void 0?i:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(i){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},GM=(()=>{const i=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),e=new Float32Array([0,0,2,0,0,2]),t=new kn;return t.setAttribute("position",new Kt(i,3)),t.setAttribute("uv",new Kt(e,2)),t})(),Gt=class ac{static get fullscreenGeometry(){return GM}constructor(e="Pass",t=new Yl,n=new yc){this.name=e,this.renderer=null,this.scene=t,this.camera=n,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(e){if(this.rtt===e){const t=this.fullscreenMaterial;t!==null&&(t.needsUpdate=!0),this.rtt=!e}}set mainScene(e){}set mainCamera(e){}setRenderer(e){this.renderer=e}isEnabled(){return this.enabled}setEnabled(e){this.enabled=e}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(e){let t=this.screen;t!==null?t.material=e:(t=new Et(ac.fullscreenGeometry,e),t.frustumCulled=!1,this.scene===null&&(this.scene=new Yl),this.scene.add(t),this.screen=t)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(e){this.fullscreenMaterial=e}getDepthTexture(){return null}setDepthTexture(e,t=md){}render(e,t,n,s,r){throw new Error("Render method not implemented!")}setSize(e,t){}initialize(e,t,n){}dispose(){for(const e of Object.keys(this)){const t=this[e];(t instanceof Nn||t instanceof On||t instanceof Ut||t instanceof ac)&&this[e].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},WM=class extends Gt{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(i,e,t,n,s){const r=i.state.buffers.stencil;r.setLocked(!1),r.setTest(!1)}},XM=`#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <colorspace_fragment>
#include <dithering_fragment>
}`,qM="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",jM=class extends Tt{constructor(){super({name:"CopyMaterial",uniforms:{inputBuffer:new jo(null),opacity:new jo(1)},blending:hi,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:XM,vertexShader:qM})}set inputBuffer(i){this.uniforms.inputBuffer.value=i}setInputBuffer(i){this.uniforms.inputBuffer.value=i}getOpacity(i){return this.uniforms.opacity.value}setOpacity(i){this.uniforms.opacity.value=i}},KM=class extends Gt{constructor(i,e=!0){super("CopyPass"),this.fullscreenMaterial=new jM,this.needsSwap=!1,this.renderTarget=i,i===void 0&&(this.renderTarget=new Nn(1,1,{minFilter:Pt,magFilter:Pt,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=e}get resize(){return this.autoResize}set resize(i){this.autoResize=i}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(i){this.autoResize=i}render(i,e,t,n,s){this.fullscreenMaterial.inputBuffer=e.texture,i.setRenderTarget(this.renderToScreen?null:this.renderTarget),i.render(this.scene,this.camera)}setSize(i,e){this.autoResize&&this.renderTarget.setSize(i,e)}initialize(i,e,t){t!==void 0&&(this.renderTarget.texture.type=t,t!==ln?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":i!==null&&i.outputColorSpace===yt&&(this.renderTarget.texture.colorSpace=yt))}},jh=new Ce,Gf=class extends Gt{constructor(i=!0,e=!0,t=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=i,this.depth=e,this.stencil=t,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(i,e,t){this.color=i,this.depth=e,this.stencil=t}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(i){this.overrideClearColor=i}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(i){this.overrideClearAlpha=i}render(i,e,t,n,s){const r=this.overrideClearColor,o=this.overrideClearAlpha,a=i.getClearAlpha(),l=r!==null,c=o>=0;l?(i.getClearColor(jh),i.setClearColor(r,c?o:a)):c&&i.setClearAlpha(o),i.setRenderTarget(this.renderToScreen?null:e),i.clear(this.color,this.depth,this.stencil),l?i.setClearColor(jh,a):c&&i.setClearAlpha(a)}},YM=class extends Gt{constructor(i,e){super("MaskPass",i,e),this.needsSwap=!1,this.clearPass=new Gf(!1,!1,!0),this.inverse=!1}set mainScene(i){this.scene=i}set mainCamera(i){this.camera=i}get inverted(){return this.inverse}set inverted(i){this.inverse=i}get clear(){return this.clearPass.enabled}set clear(i){this.clearPass.enabled=i}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(i){this.inverted=i}render(i,e,t,n,s){const r=i.getContext(),o=i.state.buffers,a=this.scene,l=this.camera,c=this.clearPass,u=this.inverted?0:1,h=1-u;o.color.setMask(!1),o.depth.setMask(!1),o.color.setLocked(!0),o.depth.setLocked(!0),o.stencil.setTest(!0),o.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),o.stencil.setFunc(r.ALWAYS,u,4294967295),o.stencil.setClear(h),o.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?c.render(i,null):(c.render(i,e),c.render(i,t))),this.renderToScreen?(i.setRenderTarget(null),i.render(a,l)):(i.setRenderTarget(e),i.render(a,l),i.setRenderTarget(t),i.render(a,l)),o.color.setLocked(!1),o.depth.setLocked(!1),o.stencil.setLocked(!1),o.stencil.setFunc(r.EQUAL,1,4294967295),o.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),o.stencil.setLocked(!0)}},Kh=class{constructor(i=null,{depthBuffer:e=!0,stencilBuffer:t=!1,multisampling:n=0,frameBufferType:s}={}){this.renderer=null,this.inputBuffer=this.createBuffer(e,t,s,n),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new KM,this.depthTexture=null,this.passes=[],this.timer=new HM,this.autoRenderToScreen=!0,this.setRenderer(i)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(i){const e=this.inputBuffer,t=this.multisampling;t>0&&i>0?(this.inputBuffer.samples=i,this.outputBuffer.samples=i,this.inputBuffer.dispose(),this.outputBuffer.dispose()):t!==i&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(e.depthBuffer,e.stencilBuffer,e.texture.type,i),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(i){if(this.renderer=i,i!==null){const e=i.getSize(new Me),t=i.getContext().getContextAttributes().alpha,n=this.inputBuffer.texture.type;n===ln&&i.outputColorSpace===yt&&(this.inputBuffer.texture.colorSpace=yt,this.outputBuffer.texture.colorSpace=yt,this.inputBuffer.dispose(),this.outputBuffer.dispose()),i.autoClear=!1,this.setSize(e.width,e.height);for(const s of this.passes)s.initialize(i,t,n)}}replaceRenderer(i,e=!0){const t=this.renderer,n=t.domElement.parentNode;return this.setRenderer(i),e&&n!==null&&(n.removeChild(t.domElement),n.appendChild(i.domElement)),t}createDepthTexture(){const i=this.depthTexture=new Tr;return this.inputBuffer.depthTexture=i,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(i.format=zs,i.type=Bs):i.type=qn,i}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(const i of this.passes)i.setDepthTexture(null)}}createBuffer(i,e,t,n){const s=this.renderer,r=s===null?new Me:s.getDrawingBufferSize(new Me),o={minFilter:Pt,magFilter:Pt,stencilBuffer:e,depthBuffer:i,type:t},a=new Nn(r.width,r.height,o);return n>0&&(a.ignoreDepthForMultisampleCopy=!1,a.samples=n),t===ln&&s!==null&&s.outputColorSpace===yt&&(a.texture.colorSpace=yt),a.texture.name="EffectComposer.Buffer",a.texture.generateMipmaps=!1,a}setMainScene(i){for(const e of this.passes)e.mainScene=i}setMainCamera(i){for(const e of this.passes)e.mainCamera=i}addPass(i,e){const t=this.passes,n=this.renderer,s=n.getDrawingBufferSize(new Me),r=n.getContext().getContextAttributes().alpha,o=this.inputBuffer.texture.type;if(i.setRenderer(n),i.setSize(s.width,s.height),i.initialize(n,r,o),this.autoRenderToScreen&&(t.length>0&&(t[t.length-1].renderToScreen=!1),i.renderToScreen&&(this.autoRenderToScreen=!1)),e!==void 0?t.splice(e,0,i):t.push(i),this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!0),i.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const a=this.createDepthTexture();for(i of t)i.setDepthTexture(a)}else i.setDepthTexture(this.depthTexture)}removePass(i){const e=this.passes,t=e.indexOf(i);if(t!==-1&&e.splice(t,1).length>0){if(this.depthTexture!==null){const r=(a,l)=>a||l.needsDepthTexture;e.reduce(r,!1)||(i.getDepthTexture()===this.depthTexture&&i.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&t===e.length&&(i.renderToScreen=!1,e.length>0&&(e[e.length-1].renderToScreen=!0))}}removeAllPasses(){const i=this.passes;this.deleteDepthTexture(),i.length>0&&(this.autoRenderToScreen&&(i[i.length-1].renderToScreen=!1),this.passes=[])}render(i){const e=this.renderer,t=this.copyPass;let n=this.inputBuffer,s=this.outputBuffer,r=!1,o,a,l;i===void 0&&(this.timer.update(),i=this.timer.getDelta());for(const c of this.passes)c.enabled&&(c.render(e,n,s,i,r),c.needsSwap&&(r&&(t.renderToScreen=c.renderToScreen,o=e.getContext(),a=e.state.buffers.stencil,a.setFunc(o.NOTEQUAL,1,4294967295),t.render(e,n,s,i,r),a.setFunc(o.EQUAL,1,4294967295)),l=n,n=s,s=l),c instanceof YM?r=!0:c instanceof WM&&(r=!1))}setSize(i,e,t){const n=this.renderer,s=n.getSize(new Me);(i===void 0||e===void 0)&&(i=s.width,e=s.height),(s.width!==i||s.height!==e)&&n.setSize(i,e,t);const r=n.getDrawingBufferSize(new Me);this.inputBuffer.setSize(r.width,r.height),this.outputBuffer.setSize(r.width,r.height);for(const o of this.passes)o.setSize(r.width,r.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const i of this.passes)i.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),Gt.fullscreenGeometry.dispose()}},tl=!1,Yh=class{constructor(i=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(i),this.meshCount=0,this.replaceMaterial=e=>{if(e.isMesh){let t;if(e.material.flatShading)switch(e.material.side){case sn:t=this.materialsFlatShadedDoubleSide;break;case qt:t=this.materialsFlatShadedBackSide;break;default:t=this.materialsFlatShaded;break}else switch(e.material.side){case sn:t=this.materialsDoubleSide;break;case qt:t=this.materialsBackSide;break;default:t=this.materials;break}this.originalMaterials.set(e,e.material),e.isSkinnedMesh?e.material=t[2]:e.isInstancedMesh?e.material=t[1]:e.material=t[0],++this.meshCount}}}cloneMaterial(i){if(!(i instanceof Tt))return i.clone();const e=i.uniforms,t=new Map;for(const s in e){const r=e[s].value;r.isRenderTargetTexture&&(e[s].value=null,t.set(s,r))}const n=i.clone();for(const s of t)e[s[0]].value=s[1],n.uniforms[s[0]].value=s[1];return n}setMaterial(i){if(this.disposeMaterials(),this.material=i,i!==null){const e=this.materials=[this.cloneMaterial(i),this.cloneMaterial(i),this.cloneMaterial(i)];for(const t of e)t.uniforms=Object.assign({},i.uniforms),t.side=Xn;e[2].skinning=!0,this.materialsBackSide=e.map(t=>{const n=this.cloneMaterial(t);return n.uniforms=Object.assign({},i.uniforms),n.side=qt,n}),this.materialsDoubleSide=e.map(t=>{const n=this.cloneMaterial(t);return n.uniforms=Object.assign({},i.uniforms),n.side=sn,n}),this.materialsFlatShaded=e.map(t=>{const n=this.cloneMaterial(t);return n.uniforms=Object.assign({},i.uniforms),n.flatShading=!0,n}),this.materialsFlatShadedBackSide=e.map(t=>{const n=this.cloneMaterial(t);return n.uniforms=Object.assign({},i.uniforms),n.flatShading=!0,n.side=qt,n}),this.materialsFlatShadedDoubleSide=e.map(t=>{const n=this.cloneMaterial(t);return n.uniforms=Object.assign({},i.uniforms),n.flatShading=!0,n.side=sn,n})}}render(i,e,t){const n=i.shadowMap.enabled;if(i.shadowMap.enabled=!1,tl){const s=this.originalMaterials;this.meshCount=0,e.traverse(this.replaceMaterial),i.render(e,t);for(const r of s)r[0].material=r[1];this.meshCount!==s.size&&s.clear()}else{const s=e.overrideMaterial;e.overrideMaterial=this.material,i.render(e,t),e.overrideMaterial=s}i.shadowMap.enabled=n}disposeMaterials(){if(this.material!==null){const i=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const e of i)e.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return tl}static set workaroundEnabled(i){tl=i}},$M=class extends Gt{constructor(i,e="inputBuffer"){super("ShaderPass"),this.fullscreenMaterial=i,this.input=e}setInput(i){this.input=i}render(i,e,t,n,s){const r=this.fullscreenMaterial.uniforms;e!==null&&r!==void 0&&r[this.input]!==void 0&&(r[this.input].value=e.texture),i.setRenderTarget(this.renderToScreen?null:t),i.render(this.scene,this.camera)}initialize(i,e,t){t!==void 0&&t!==ln&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},ZM=class extends Gt{constructor(i,e,t=null){super("RenderPass",i,e),this.needsSwap=!1,this.clearPass=new Gf,this.overrideMaterialManager=t===null?null:new Yh(t),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(i){this.scene=i}set mainCamera(i){this.camera=i}get renderToScreen(){return super.renderToScreen}set renderToScreen(i){super.renderToScreen=i,this.clearPass.renderToScreen=i}get overrideMaterial(){const i=this.overrideMaterialManager;return i!==null?i.material:null}set overrideMaterial(i){const e=this.overrideMaterialManager;i!==null?e!==null?e.setMaterial(i):this.overrideMaterialManager=new Yh(i):e!==null&&(e.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(i){this.overrideMaterial=i}get clear(){return this.clearPass.enabled}set clear(i){this.clearPass.enabled=i}getSelection(){return this.selection}setSelection(i){this.selection=i}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(i){this.ignoreBackground=i}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(i){this.skipShadowMapUpdate=i}getClearPass(){return this.clearPass}render(i,e,t,n,s){const r=this.scene,o=this.camera,a=this.selection,l=o.layers.mask,c=r.background,u=i.shadowMap.autoUpdate,h=this.renderToScreen?null:e;a!==null&&o.layers.set(a.getLayer()),this.skipShadowMapUpdate&&(i.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(r.background=null),this.clearPass.enabled&&this.clearPass.render(i,e),i.setRenderTarget(h),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(i,r,o):i.render(r,o),o.layers.mask=l,r.background=c,i.shadowMap.autoUpdate=u}};class JM extends Kh{staticPasses=[];dynamicPasses=[];staticComposer;staticTexture;renderer;staticDisplayPass;constructor(e){super(e,{depthBuffer:!0}),this.renderer=e;const t=new Tr(window.innerWidth,window.innerHeight);t.type=qn;const n=new Tr(window.innerWidth,window.innerHeight);n.type=qn,this.inputBuffer&&(this.inputBuffer.depthTexture=t),this.outputBuffer&&(this.outputBuffer.depthTexture=n)}addCustomPass(e,t=!1){t?this.staticPasses.push(e):this.dynamicPasses.push(e)}renderPass(){this.staticComposer=new Kh(this.renderer),this.staticPasses.forEach(t=>{this.staticComposer.addPass(t)}),this.staticDisplayPass=new $M(new Tt({uniforms:{uStaticTexture:{value:null}},vertexShader:`
          varying vec2 vUv;
           void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          varying vec2 vUv;
          uniform sampler2D uStaticTexture;

          void main() {
            gl_FragColor = texture2D(uStaticTexture, vUv);
          }
        `})),this.staticComposer.passes.length>0&&(this.staticComposer.passes[this.staticComposer.passes.length-1].renderToScreen=!1),this.staticComposer.render(),this.staticTexture=this.staticComposer.outputBuffer.texture;const e=this.staticDisplayPass.fullscreenMaterial;e.uniforms.uStaticTexture.value=this.staticTexture,super.addPass(this.staticDisplayPass),this.dynamicPasses.forEach(t=>{super.addPass(t)})}resize(e,t){if(this.staticTexture&&this.staticTexture.dispose(),super.setSize(e,t),this.staticComposer&&this.staticComposer.setSize(e,t),this.staticComposer&&this.staticComposer.passes.length>0){this.staticComposer.render(),this.staticTexture=this.staticComposer.outputBuffer.texture;const n=this.staticDisplayPass.fullscreenMaterial;n.uniforms.uStaticTexture.value=this.staticTexture}}dispose(){this.dynamicPasses.forEach(e=>{e.dispose()}),this.staticPasses.forEach(e=>{e.dispose()}),this.staticComposer&&this.staticComposer.dispose(),this.staticDisplayPass&&this.staticDisplayPass.dispose(),this.staticTexture&&this.staticTexture.dispose(),this.staticPasses=[],this.dynamicPasses=[]}rebuildDynamicPasses(){this.removeAllPasses(),this.staticDisplayPass&&super.addPass(this.staticDisplayPass),this.dynamicPasses.forEach(e=>{super.addPass(e)})}}function Qo(i,e,t){const n=Math.max(1-t,.05);return i*(1-n)+e*n}const ea={Normal:0,Add:1,Subtract:2,Multiply:3,Screen:4,Overlay:5,Darken:6,Lighten:7,ColorDodge:8,ColorBurn:9,LinearBurn:10,HardLight:11,SoftLight:12,Difference:13,Exclusion:14,LinearLight:15,PinLight:16,VividLight:17};var QM=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`,eE=`precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uSprite;
uniform sampler2D uCustomTexture;
uniform float uGlyphCount;
uniform float uScale;
uniform float uMix;
uniform float uGamma;
uniform int uBlendMode; 
uniform vec2 uPos;
uniform vec3 uColor;

uniform sampler2D uMaskTexture;
uniform float uTrackMouse;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uParentTrackMouse;

uniform vec2 uCustomTextureSize;
uniform vec2 uSpriteTextureSize;

vec3 blend(int blendMode, vec3 src, vec3 dst) {
  if(blendMode == 0) return src;
  if(blendMode == 1) return src + dst;
  if(blendMode == 2) return src - dst;
  if(blendMode == 3) return src * dst;
  if(blendMode == 4) return 1.0 - (1.0 - src) * (1.0 - dst);
  if(blendMode == 5) return vec3(
    (dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), 
    (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), 
    (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z))
  );
  if(blendMode == 6) return min(src, dst);
  if(blendMode == 7) return max(src, dst);
  if(blendMode == 8) return vec3(
    (src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), 
    (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), 
    (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z))
  );
  if(blendMode == 9) return vec3(
    (src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), 
    (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), 
    (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z))
  );
  if(blendMode == 10) return (src + dst) - 1.0;
  if(blendMode == 11) return vec3(
    (src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), 
    (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)),  
    (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z))
  );
  if(blendMode == 12) return vec3(
    (src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), 
    (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), 
    (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z)))
  );
  if(blendMode == 13) return abs(dst - src);
  if(blendMode == 14) return src + dst - 2.0 * src * dst;
  if(blendMode == 15) return 2.0 * src + dst - 1.0;
  if(blendMode == 16) return vec3(
    (src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), 
    (src.y > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), 
    (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z)
  );
  if(blendMode == 17) return vec3(
    (src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), 
    (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), 
    (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z)))
  );
  return src; 
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);
  float aspectRatio = uResolution.x / uResolution.y;
  float aspectCorrection = mix(aspectRatio, 1.0 / aspectRatio, 0.5);

  float gridSize = mix(0.05, 0.005, uScale);

  float baseGrid = 1.0 / gridSize;
  vec2 cellSize = vec2(1.0 / (baseGrid * aspectRatio), 1.0 / baseGrid) * aspectCorrection;
  vec2 offsetUv = uv - pos;
  vec2 cell = floor(offsetUv / cellSize);
  vec2 cellCenter = (cell + 0.5) * cellSize;
  vec2 pixelatedCoord = cellCenter + pos;

  vec4 bg = texture2D(uTexture, vUv);
  vec4 color = texture2D(uTexture, pixelatedCoord);

  float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

  #ifdef USE_INVERT_LUMA
    luminance = 1.0 - luminance;
  #endif

  float gamma = pow(mix(0.2, 2.2, uGamma), 2.2);

  #ifdef USE_CUSTOM_GLYPH
    float selectedWidth = uCustomTextureSize.x;
    float GLYPH_HEIGHT = uCustomTextureSize.y;
  #else
    float selectedWidth = uSpriteTextureSize.x;
    float GLYPH_HEIGHT = uSpriteTextureSize.y;
  #endif

  float scaleFactor = gridSize / GLYPH_HEIGHT;
  float numSprites = min(uGlyphCount, selectedWidth / GLYPH_HEIGHT);
  float numGlyphRows = 1.0;

  float spriteIndex = clamp(floor(luminance * numSprites), 0.0, numSprites - 1.0);
  float spriteIndexWithGamma = clamp(floor(luminance * numSprites * gamma), 0.0, numSprites - 1.0);
  float glyphIndex = 0.0;

  float normalizedSpriteSizeX = 1.0 / numSprites;
  float normalizedSpriteSizeY = 1.0 / numGlyphRows;

  float spriteX = (spriteIndexWithGamma * normalizedSpriteSizeX);

  vec2 spriteSheetUV = vec2(
      spriteX,
      glyphIndex / numGlyphRows
  );

  vec2 spriteSize = vec2(GLYPH_HEIGHT / aspectRatio, GLYPH_HEIGHT) * scaleFactor * aspectCorrection;
  vec2 localOffset = mod(uv - pos, spriteSize) / spriteSize;

  float inset = 0.5 / GLYPH_HEIGHT;
  localOffset = clamp(localOffset, vec2(inset), vec2(1.0 - inset));

  spriteSheetUV += vec2(
      localOffset.x * normalizedSpriteSizeX,
      localOffset.y * normalizedSpriteSizeY
  );

  vec4 spriteColor = vec4(0.0);

  #ifdef USE_CUSTOM_GLYPH
    spriteColor = texture2D(uCustomTexture, spriteSheetUV);
  #else
    spriteColor = texture2D(uSprite, spriteSheetUV);
  #endif

  float alpha = smoothstep(0.0, 1.0, spriteColor.r);

  vec3 col;
  #ifdef USE_MONOCHROME
    col = uColor;
  #else
    vec3 cc = (color.rgb - spriteIndex * 0.04) * 1.4;
    col = cc; 
  #endif

  vec3 ditherTarget;
  #ifdef USE_INVERT_LUMA
    ditherTarget = vec3(1.0);
  #else
    ditherTarget = vec3(0.0);
  #endif

  vec3 dithered = mix(ditherTarget, col, alpha);

  color.rgb = mix(bg.rgb, dithered, uMix);

  #ifdef USE_BLEND_MODE
    vec3 blended = blend(uBlendMode, dithered, bg.rgb);
    color.rgb = mix(bg.rgb, blended, uMix);
  #endif

  #ifdef USE_MASK
    vec2 maskPos = mix(vec2(0.0), (uMousePos - 0.5), uParentTrackMouse);
    vec4 maskColor = texture2D(uMaskTexture, vUv - maskPos);
    color = color * (maskColor.a * maskColor.a);
  #endif

  gl_FragColor = color;
}`;function wn(i,e){i.value instanceof Me&&e?.x!==void 0?i.value.set(e.x,e.y):i.value instanceof F&&e?.x!==void 0?i.value.set(e.x,e.y,e.z):i.value instanceof Ce?i.value.set(e):i.value=e}class tE extends Gt{previousMousePos=new Me(.5,.5);constructor({pos:e=new Me,preset:t="Squares",characters:n=" .:-=+*#9P%@",scale:s=.5,gamma:r=.5,mix:o=.5,monochrome:a=0,color:l="0xFF0000",order:c=0,blendMode:u="Normal",mousePos:h=new Me,trackMouse:f=0,isMask:m=0,parentTrackMouse:_=0,maskTexture:b=new Ut}={}){super("GlypheDitherPass");let v;const p={};t==="Characters"?(v=this.generateCustomGlyphs(n),p.USE_CUSTOM_GLYPH=""):v=this.loadPresetTexture(t),a===1&&(p.USE_MONOCHROME=""),c===1&&(p.USE_INVERT_LUMA=""),m===1&&(p.USE_MASK=""),ea[u]>0&&(p.USE_BLEND_MODE="");const D={uTexture:{value:null},uTime:{value:0},uSprite:{value:v},uCustomTexture:{value:v},uMaskTexture:{value:b},uSpriteTextureSize:{value:new Me(v.width,v.height)},uCustomTextureSize:{value:new Me(v.width,v.height)},uGlyphCount:{value:n.length},uPos:{value:e},uScale:{value:s},uGamma:{value:r},uMix:{value:o},uBlendMode:{value:ea[u]},uColor:{value:l},uMousePos:{value:h},uTrackMouse:{value:f},uParentTrackMouse:{value:_},uResolution:{value:new Me(window.innerWidth,window.innerHeight)}};this.fullscreenMaterial=new Tt({defines:p,uniforms:D,vertexShader:QM,fragmentShader:eE}),this.needsSwap=!0}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture,r.uniforms.uTime.value+=s,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}updateMousePosition(e,t){const n={x:Qo(this.previousMousePos.x,e.x,t),y:Qo(this.previousMousePos.y,e.y,t)};this.fullscreenMaterial.uniforms.uMousePos.value.copy(n),this.previousMousePos.copy(n)}loadPresetTexture(e){return new Rc().load(`/textures/${e.toLowerCase()}.png`,s=>{const r=this.fullscreenMaterial;r.uniforms.uSpriteTextureSize.value.set(s.width,s.height),r.uniforms.uCustomTextureSize.value.set(s.width,s.height)})}generateCustomGlyphs(e){const t=e.split(""),n=40,s=(t.length+1)*n,r=n,o=document.createElement("canvas");o.width=s,o.height=r;const a=o.getContext("2d");a.fillStyle="#000",a.fillRect(0,0,s,r),a.fillStyle="#fff",a.textAlign="center",a.textBaseline="middle",a.font="40px IBM Plex Mono, monospace";for(let c=0;c<t.length;c++){const u=(c+1)*n+n/2,h=n/2;a.fillText(t[c],u,h)}const l=new Ad(o);return l.needsUpdate=!0,l}}const nE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,iE=`precision highp float;

in vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float uContrast;
uniform float uGlow;
uniform float uNoise;
uniform float uScanlines;
uniform float uShift;
uniform float uMixAmount; // Rappel : clamp cette valeur côté CPU entre 0 et 1
uniform vec2 uTimeOffset; 

// Nouveaux uniforms recommandés (à calculer côté CPU) :
// uniform vec2 uTexelSize; 

out vec4 fragColor;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 78.233);
    return fract(p.x * p.y);
}

// Version sans branching (les if). 
// Note : Le top absolu en perfs serait d'utiliser une texture 1D pour la palette.
vec3 thermalPalette(float t) {
    vec3 c0 = vec3(0.02, 0.01, 0.05);
    vec3 c1 = vec3(0.12, 0.02, 0.35);
    vec3 c2 = vec3(0.00, 0.28, 0.95);
    vec3 c3 = vec3(0.00, 0.85, 0.70);
    vec3 c4 = vec3(0.98, 0.92, 0.12);
    vec3 c5 = vec3(1.00, 0.36, 0.04);
    vec3 c6 = vec3(1.00, 0.98, 0.98);

    t = clamp(t, 0.0, 1.0);

    vec3 color = mix(c0, c1, smoothstep(0.0, 0.16, t));
    color = mix(color, c2, smoothstep(0.16, 0.34, t));
    color = mix(color, c3, smoothstep(0.34, 0.52, t));
    color = mix(color, c4, smoothstep(0.52, 0.72, t));
    color = mix(color, c5, smoothstep(0.72, 0.88, t));
    color = mix(color, c6, smoothstep(0.88, 1.0, t));
    
    return color;
}

void main() {
    vec4 scene = texture(uTexture, vUv);
    
    float brightness = luma(scene.rgb);
    
    // Optimisation massive : fwidth remplace les 4 appels à "texture"
    // fwidth(x) est l'équivalent de abs(dFdx(x)) + abs(dFdy(x))
    float edges = fwidth(brightness) * 2.0; // * 2.0 pour compenser l'échelle selon tes goûts
    
    float heat = clamp((brightness - 0.5) * uContrast + 0.5 + uShift, 0.0, 1.0);
    heat += smoothstep(0.02, 0.22, edges) * uGlow * 0.35;

    // Utilisation directe de gl_FragCoord.y pour gagner une multiplication
    float fragY = gl_FragCoord.y;
    float shimmer = sin(fragY * 0.08 + uTime * 8.0) * 0.5 + 0.5;
    
    vec2 timeOffset = vec2(uTime * 37.0, uTime * 11.0); 
    float noise = (hash(gl_FragCoord.xy + timeOffset) - 0.5) * uNoise;
    
    float scan = sin(fragY * 0.35 + uTime * 6.0) * uScanlines * 0.08;

    heat = clamp(heat + noise + scan + shimmer * uNoise * 0.15, 0.0, 1.0);

    vec3 thermal = thermalPalette(heat);
    thermal += smoothstep(0.1, 0.9, heat) * edges * uGlow * 1.1;
    thermal = clamp(thermal, 0.0, 1.0);

    vec3 mixed = mix(scene.rgb, thermal, uMixAmount); // uMixAmount clampé côté CPU
    fragColor = vec4(mixed, scene.a);
}`;class sE extends Gt{constructor({contrast:e=1,glow:t=1,noise:n=1,scanlines:s=1,shift:r=0,mixAmount:o=1}={}){super("ThermalVision");const a=At.clamp(o,0,1),l={uTime:{value:0},uTimeOffset:{value:new Me(0,0)},uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uContrast:{value:e},uGlow:{value:t},uNoise:{value:n},uScanlines:{value:s},uShift:{value:r},uMixAmount:{value:a}};this.fullscreenMaterial=new Tt({uniforms:l,vertexShader:nE,fragmentShader:iE,glslVersion:on});const c=new un(2,2,32,32),u=new Et(c,this.fullscreenMaterial);this.scene.clear(),this.scene.add(u),this.needsSwap=!0}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture;const o=r.uniforms.uTime.value+s;r.uniforms.uTime.value=o,r.uniforms.uTimeOffset.value.set(o*37,o*11),e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}setMixAmount(e){const t=this.fullscreenMaterial;t.uniforms.uMixAmount.value=At.clamp(e,0,1)}}const rE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,oE=`precision highp float;

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uThickness;
uniform float uThreshold;
uniform float uSoftness;
uniform float uStrength;
uniform float uMixAmount;

out vec4 fragColor;

vec4 applyLayerMix(vec4 color, vec4 bg, float amount) {
    color.rgb = mix(bg.rgb, color.rgb, amount);
    color.a = max(bg.a, amount);
    return color;
}

float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
}

float interleavedGradientNoise(vec2 st) {
    return fract(52.9829189 * fract(dot(st, vec2(0.06711056, 0.00583715))));
}

void main() {
    vec2 uv = vUv;
    float thickness = max(uThickness, 0.001);
    float dist = distance(uv, uMousePos);
    float influence = (1.0 - smoothstep(0.0, max(0.1600, 0.01), dist)) * 0.0900;
    thickness += influence * 3.0;

    vec2 pixel = (1.0 / uResolution) * max(thickness * 4.0, 0.001);
    float noise = interleavedGradientNoise(gl_FragCoord.xy);
    pixel *= mix(1.0, noise, 0.1);

    float tl = luma(texture(uTexture, uv + pixel * vec2(-1.0, -1.0)).rgb);
    float t = luma(texture(uTexture, uv + pixel * vec2( 0.0, -1.0)).rgb);
    float tr = luma(texture(uTexture, uv + pixel * vec2( 1.0, -1.0)).rgb);
    float l = luma(texture(uTexture, uv + pixel * vec2(-1.0,  0.0)).rgb);
    float r = luma(texture(uTexture, uv + pixel * vec2( 1.0,  0.0)).rgb);
    float bl = luma(texture(uTexture, uv + pixel * vec2(-1.0,  1.0)).rgb);
    float b = luma(texture(uTexture, uv + pixel * vec2( 0.0,  1.0)).rgb);
    float br = luma(texture(uTexture, uv + pixel * vec2( 1.0,  1.0)).rgb);

    float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
    float gy = -tl - 2.0 * t - tr + bl + 2.0 * b + br;
    float edge = length(vec2(gx, gy));

    float soft = max(uSoftness * 0.5, 0.001);
    edge = smoothstep(uThreshold - soft, uThreshold + soft, edge);
    edge *= (uStrength * 2.0);

    vec4 scene = texture(uTexture, uv);
    vec3 outline = vec3(1.0) * edge;
    vec3 blended = outline;
    vec4 col = applyLayerMix(vec4(blended, 1.0), scene, clamp(uMixAmount, 0.0, 1.0));
    fragColor = col;
}
`;class aE extends Gt{constructor({thickness:e=1,threshold:t=.5,softness:n=.1,strength:s=1,mixAmount:r=1,mousePos:o=new Me(.5,.5)}={}){super("Outline");const a=At.clamp(r,0,1),l={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uMousePos:{value:o},uThickness:{value:e},uThreshold:{value:t},uSoftness:{value:n},uStrength:{value:s},uMixAmount:{value:a}};this.fullscreenMaterial=new Tt({uniforms:l,vertexShader:rE,fragmentShader:oE,glslVersion:on});const c=new un(2,2,32,32),u=new Et(c,this.fullscreenMaterial);this.scene.clear(),this.scene.add(u),this.needsSwap=!0}render(e,t,n){const s=this.fullscreenMaterial;s.uniforms.uTexture.value=t.texture,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}setMixAmount(e){const t=this.fullscreenMaterial;t.uniforms.uMixAmount.value=At.clamp(e,0,1)}updateMousePosition(e,t){this.fullscreenMaterial.uniforms.uMousePos.value.set(e,t)}}const lE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,cE=`precision highp float;

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uRelief;
uniform float uIntensity;
uniform float uCoverage;
uniform vec3 uAmbientColor;
uniform vec3 uLight1Color;
uniform vec3 uLight2Color;
uniform vec3 uLight3Color;
uniform float uMixAmount;

out vec4 fragColor;

vec4 applyLayerMixAlpha(vec4 color, vec4 bg, float amount) {
    return mix(bg, color, amount);
}

const float PI = 3.14159265359;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float getHeight(vec2 uv) {
    return luma(texture(uTexture, uv).rgb);
}

vec2 rotate(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(value.x * c - value.y * s, value.x * s + value.y * c);
}

vec3 rotateLight(vec3 lightDir, float angle) {
    return normalize(vec3(rotate(lightDir.xy, angle), lightDir.z));
}

vec3 calculateNormal(vec2 uv) {
    vec2 texel = 1.0 / max(uResolution, vec2(1.0));
    float relief = clamp(uRelief, 0.0, 1.0);
    float sampleRadius = mix(1.0, 3.0, relief);
    float heightScale = mix(1.0, 7.0, relief);
    vec2 stepUv = texel * sampleRadius;

    float left = getHeight(uv - vec2(stepUv.x, 0.0));
    float right = getHeight(uv + vec2(stepUv.x, 0.0));
    float top = getHeight(uv - vec2(0.0, stepUv.y));
    float bottom = getHeight(uv + vec2(0.0, stepUv.y));

    return normalize(
        vec3(
            (right - left) * heightScale,
            -(bottom - top) * heightScale,
            0.5
        )
    );
}

void main() {
    vec2 uv = vUv;
    vec4 scene = texture(uTexture, uv);
    float coverage = smoothstep(0.02, 0.08, luma(scene.rgb) * scene.a) *
        clamp(uCoverage, 0.0, 1.0);

    vec3 normal = -calculateNormal(uv);
    vec2 lightPos = vec2(0.5, 0.65) + mix(vec2(0.0), (uMousePos - 0.5), 0.0);
    float angle = atan(lightPos.y - 0.5, lightPos.x - 0.5) + 0.0 * PI * 2.0;

    vec3 light1 = rotateLight(normalize(vec3(0.2, 1.0, 0.2)), angle);
    vec3 light2 = rotateLight(normalize(vec3(0.8, -0.1, 0.35)), angle + PI * 0.08);
    vec3 light3 = rotateLight(normalize(vec3(-0.45, -0.7, 0.45)), angle - PI * 0.12);

    vec3 lighting = scene.rgb * clamp(uAmbientColor, 0.0, 1.0) * 0.0800;
    lighting += clamp(uLight1Color, 0.0, 1.0) * max(dot(normal, light1), 0.0);
    lighting += clamp(uLight2Color, 0.0, 1.0) * max(dot(normal, light2), 0.0);
    lighting += clamp(uLight3Color, 0.0, 1.0) * max(dot(normal, light3), 0.0);
    lighting *= mix(0.75, 1.35, clamp(uIntensity, 0.0, 1.0));
    lighting = clamp(lighting, 0.0, 1.0);

    vec3 blended = lighting;
    vec4 color = applyLayerMixAlpha(
        vec4(blended, scene.a),
        scene,
        clamp(uMixAmount, 0.0, 1.0) * coverage
    );

    fragColor = color;
}
`;class uE extends Gt{constructor({relief:e=.5,intensity:t=1,coverage:n=1,ambientColor:s=16777215,light1Color:r=16711680,light2Color:o=65280,light3Color:a=255,mixAmount:l=1,mousePos:c=new Me(.5,.5)}={}){super("Trilight");const u=At.clamp(l,0,1),h=At.clamp(e,0,1),f=At.clamp(t,0,1),m=At.clamp(n,0,1),_={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uMousePos:{value:c},uRelief:{value:h},uIntensity:{value:f},uCoverage:{value:m},uAmbientColor:{value:new Ce(s)},uLight1Color:{value:new Ce(r)},uLight2Color:{value:new Ce(o)},uLight3Color:{value:new Ce(a)},uMixAmount:{value:u}};this.fullscreenMaterial=new Tt({uniforms:_,vertexShader:lE,fragmentShader:cE,glslVersion:on});const b=new un(2,2,32,32),v=new Et(b,this.fullscreenMaterial);this.scene.clear(),this.scene.add(v),this.needsSwap=!0}render(e,t,n){const s=this.fullscreenMaterial;s.uniforms.uTexture.value=t.texture,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}setMixAmount(e){const t=this.fullscreenMaterial;t.uniforms.uMixAmount.value=At.clamp(e,0,1)}setIntensity(e){const t=this.fullscreenMaterial;t.uniforms.uIntensity.value=At.clamp(e,0,1)}setLightColor(e,t){const n=this.fullscreenMaterial,s=`uLight${e}Color`;n.uniforms[s].value.set(t)}updateMousePosition(e,t){this.fullscreenMaterial.uniforms.uMousePos.value.set(e,t)}}const hE=`

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {

    gl_Position = vec4(position.xy, 0.0, 1.0);
    
    vVertexPosition = position;
    vTextureCoord = uv;
}`,dE=`precision highp float;
precision highp int;

in vec2 vTextureCoord;
in vec3 vVertexPosition;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSize;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uBlockiness;
uniform float uAberration;
uniform float uWaves;
uniform float uFrequency;
uniform float uPhase;
uniform float uSpeed;

out vec4 fragColor;

uvec2 pcg2d(uvec2 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.y * 1664525u + 1013904223u;
    v.y += v.x * v.x * 1664525u + 1013904223u;
    v ^= v >> 16;
    v.x += v.y * v.y * 1664525u + 1013904223u;
    v.y += v.x * v.x * 1664525u + 1013904223u;
    return v;
}

float randFibo(vec2 p) {
    uvec2 v = floatBitsToUint(p);
    v = pcg2d(v);
    uint r = v.x ^ v.y;
    return float(r) / float(0xffffffffu);
}

const float UV_MIN = 0.005;
const float UV_MAX = 0.995;

float glitchMask(float noise, float amount) {
    return max(UV_MIN, sign(noise + amount - 1.0));
}

float centeredOffset(float noise, float amount) {
    return (noise * amount - amount / 2.0) / 5.0;
}

vec2 clampUv(vec2 value) {
    return clamp(value, vec2(UV_MIN), vec2(UV_MAX));
}

void main() {
    vec2 uv = vTextureCoord;

    float size = uSize * 0.01;
    float offsetXAmount = uOffsetX * 0.01;
    float offsetYAmount = uOffsetY * 0.01;
    float blockiness = uBlockiness * 0.01;
    float chromab = uAberration * 0.01 * 0.75;
    float waves = uWaves * 0.01;
    float frequency = max(uFrequency * 0.01, UV_MIN);
    float phase = uPhase * 0.01;
    float speed = max(uSpeed * 0.08, 0.001);

    float steppedTime = floor(uTime * speed) * 2.0;
    float timeRand1 = randFibo(vec2(steppedTime + 0.001, 0.5));
    float timeRand2 = randFibo(vec2(steppedTime + 1.001, 0.5));

    float sizeX = max(size * 0.2 * timeRand1, 0.0001);
    float sizeY = max(size * 0.2 * timeRand2, 0.0001);
    float floorY = floor(uv.y / sizeY) + UV_MIN;
    float floorX = floor(uv.x / sizeX) + UV_MIN;

    vec2 blockSize = max(vec2(1.0), vec2(50.0, 50.0) * max(1.0 - size, 0.02));
    vec2 blockUV = floor(uv * blockSize) / blockSize;
    float blockRand = randFibo(blockUV);
    float blockTimeRand = timeRand1;
    float blockNoise = mix(
        1.0,
        step(0.8, randFibo(vec2(blockTimeRand, blockRand))),
        blockiness
    );

    float offsetX = offsetXAmount * 0.5 * blockNoise;
    float offsetY = offsetYAmount * 0.5 * blockNoise;

    float randY = randFibo(vec2(sin(floorY + phase), 0.5));
    float randX = randFibo(vec2(cos(floorX + phase), 0.5));
    float glitchModX = glitchMask(randY, frequency);
    float glitchModY = glitchMask(randX, frequency);

    float randOffX = randFibo(vec2(floorY + phase, 0.7));
    float randOffY = randFibo(vec2(floorX + phase, 0.9));
    float offX = centeredOffset(randOffX, offsetX);
    float offY = centeredOffset(randOffY, offsetY);

    offX = clamp(offX, -1.0, 1.0);
    offY = clamp(offY, -1.0, 1.0);

    uv.x = mix(uv.x, uv.x + offX * 2.0, glitchModX);
    uv.y = mix(uv.y, uv.y + offY * 2.0, glitchModY);

    float waveFreq = 30.0;
    float waveAmp = 0.005 * waves;
    float timeOffset = uTime * 0.05;
    float sinY = sin((uv.y + phase) * waveFreq * (1.0 - size) * 2.0 + timeOffset);
    float rogue = smoothstep(0.0, 2.0, sinY - 0.5) * 0.2 * waves;
    float sinWaveX = sin(uv.y * waveFreq + uTime);
    float sinWaveY = sin(uv.x * waveFreq + uTime);

    uv.x += sinWaveX * waveAmp + rogue;
    uv.y += sinWaveY * waveAmp;

    float waveX = sinWaveX * waveAmp + rogue * chromab * 0.2;

    uv = clampUv(uv);

    vec4 color = texture(uTexture, uv);
    vec2 glitchOffset = vec2(offX, offY) * glitchModX * chromab;
    vec2 redOffset = clampUv(uv + vec2(-glitchOffset.x - waveX, -glitchOffset.y));
    vec2 blueOffset = clampUv(uv + vec2(glitchOffset.x + waveX, glitchOffset.y));

    color.r = texture(uTexture, redOffset).r;
    color.b = texture(uTexture, blueOffset).b;

    fragColor = color;
}
`;class fE extends Gt{constructor({size:e=50,offsetX:t=10,offsetY:n=10,blockiness:s=50,aberration:r=10,waves:o=10,frequency:a=50,phase:l=0,speed:c=10}={}){super("Glitch");const u={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uTime:{value:0},uSize:{value:e},uOffsetX:{value:t},uOffsetY:{value:n},uBlockiness:{value:s},uAberration:{value:r},uWaves:{value:o},uFrequency:{value:a},uPhase:{value:l},uSpeed:{value:c}};this.fullscreenMaterial=new Tt({uniforms:u,vertexShader:hE,fragmentShader:dE,glslVersion:on});const h=new un(2,2,32,32),f=new Et(h,this.fullscreenMaterial);this.scene.clear(),this.scene.add(f),this.needsSwap=!0}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture,r.uniforms.uTime.value+=s,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}setAberration(e){const t=this.fullscreenMaterial;t.uniforms.uAberration.value=e}}const pE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,mE=`precision highp float;

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float uScale;
uniform float uSpeed;
uniform vec2 uDrift;
uniform float uEdge;
uniform float uWarp;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uLineColor;
uniform float uMixAmount;

out vec4 fragColor;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

vec2 hash22(vec2 p) {
    float n = sin(dot(p, vec2(41.0, 289.0)));
    return fract(vec2(262144.0, 32768.0) * n);
}

vec3 voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float minDist = 8.0;
    float secondDist = 8.0;
    vec2 nearestCell = vec2(0.0);

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash22(n + g);
            vec2 r = g + o - f;
            float d = dot(r, r);

            if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                nearestCell = n + g + o;
            } else if (d < secondDist) {
                secondDist = d;
            }
        }
    }

    return vec3(sqrt(minDist), sqrt(secondDist), hash22(nearestCell).x);
}

void main() {
    vec2 uv = vUv;
    vec4 scene = texture(uTexture, uv);

    float coverage = smoothstep(0.05, 0.22, luma(scene.rgb));
    if (coverage <= 0.0001) {
        fragColor = scene;
        return;
    }

    vec2 aspectUv = vec2(uv.x * (uResolution.x / max(uResolution.y, 1.0)), uv.y);
    float motionTime = uTime * uSpeed;
    vec2 flow = uDrift * motionTime;
    vec2 warp = vec2(
        sin((aspectUv.y + flow.y) * 6.0 + motionTime * 0.8),
        cos((aspectUv.x + flow.x) * 5.0 - motionTime * 0.7)
    ) * uWarp * 0.18;
    vec2 fieldUv = aspectUv * max(uScale, 0.001) + flow + warp;

    vec3 cell = voronoi(fieldUv);
    float cells = cell.z;
    float dist = cell.x;
    float edgeWidth = max(uEdge, 0.001);
    float edgeMask = 1.0 - smoothstep(edgeWidth, edgeWidth + 0.04, cell.y - cell.x);

    vec3 baseColor = mix(uColorA, uColorB, cells);
    baseColor *= 0.85 + 0.35 * smoothstep(0.0, 0.8, 1.0 - dist);
    vec3 voronoiColor = mix(baseColor, uLineColor, edgeMask);

    float shapeLight = smoothstep(0.08, 0.9, coverage);
    voronoiColor *= 0.7 + shapeLight * 0.45;

    vec3 combined = mix(scene.rgb, voronoiColor, clamp(uMixAmount, 0.0, 1.0) * coverage);
    fragColor = vec4(combined, scene.a);
}
`;class gE extends Gt{constructor({scale:e=5,speed:t=1,drift:n=new Me(.1,.05),edge:s=.05,warp:r=1,colorA:o=657930,colorB:a=13421772,lineColor:l=16724787,mixAmount:c=1}={}){super("Voronoi");const u=At.clamp(c,0,1),h={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uTime:{value:0},uScale:{value:e},uSpeed:{value:t},uDrift:{value:n},uEdge:{value:s},uWarp:{value:r},uColorA:{value:new Ce(o)},uColorB:{value:new Ce(a)},uLineColor:{value:new Ce(l)},uMixAmount:{value:u}};this.fullscreenMaterial=new Tt({uniforms:h,vertexShader:pE,fragmentShader:mE,glslVersion:on});const f=new un(2,2,32,32),m=new Et(f,this.fullscreenMaterial);this.scene.clear(),this.scene.add(m),this.needsSwap=!0}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture,r.uniforms.uTime.value+=s,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}}const vE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,_E=`precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
uniform float uEvolution;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uMixAmount;

out vec4 fragColor;

vec3 getColor(int index) {
    switch (index) {
        case 0: return uColor0;
        case 1: return uColor1;
        case 2: return uColor2;
        case 3: return uColor3;
        default: return vec3(0.0);
    }
}

float getStop(int index) {
    switch (index) {
        case 0: return 0.0;
        case 1: return 0.3333;
        case 2: return 0.6667;
        case 3: return 1.0;
        default: return 0.0;
    }
}

uvec2 pcg2d(uvec2 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.y * 1664525u + 1013904223u;
    v.y += v.x * v.x * 1664525u + 1013904223u;
    v ^= v >> 16;
    v.x += v.y * v.y * 1664525u + 1013904223u;
    v.y += v.x * v.x * 1664525u + 1013904223u;
    return v;
}

float randFibo(vec2 p) {
    uvec2 v = floatBitsToUint(p);
    v = pcg2d(v);
    uint r = v.x ^ v.y;
    return float(r) / float(0xffffffffu);
}

float deband() {
    return (randFibo(gl_FragCoord.xy) - 0.5) / 255.0;
}

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 linear_from_srgb(vec3 rgb) {
    return pow(max(rgb, vec3(0.0)), vec3(2.2));
}

vec3 srgb_from_linear(vec3 lin) {
    return pow(max(lin, vec3(0.0)), vec3(1.0 / 2.2));
}

vec3 safeCbrt(vec3 v) {
    return sign(v) * pow(abs(v), vec3(1.0 / 3.0));
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
    return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

vec3 animateColor(vec3 color, float index) {
    float evolution = clamp(uEvolution, 0.0, 2.0);
    if (evolution <= 0.0001) {
        return color;
    }

    vec3 hsv = rgb2hsv(clamp(color, 0.0, 1.0));
    float phase = uTime * 0.04 * evolution + index * 0.21;
    hsv.x = fract(hsv.x + phase);
    hsv.y = clamp(hsv.y * (0.9 + 0.1 * sin(phase * 1.7 + index)), 0.0, 1.0);
    hsv.z = clamp(hsv.z * (0.92 + 0.08 * cos(phase * 1.3 + index * 0.7)), 0.0, 1.0);
    return hsv2rgb(hsv);
}

vec3 oklab_mix(vec3 lin1, vec3 lin2, float a) {
    const mat3 kCONEtoLMS = mat3(
        0.4121656120, 0.2118591070, 0.0883097947,
        0.5362752080, 0.6807189584, 0.2818474174,
        0.0514575653, 0.1074065790, 0.6302613616
    );
    const mat3 kLMStoCONE = mat3(
        4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827, 2.6093323231, -0.7034763098,
        0.2307590544, -0.3411344290, 1.7068625689
    );

    vec3 lms1 = safeCbrt(kCONEtoLMS * lin1);
    vec3 lms2 = safeCbrt(kCONEtoLMS * lin2);
    vec3 lms = mix(lms1, lms2, a);
    lms *= 1.0 + 0.02 * a * (1.0 - a);
    return kLMStoCONE * (lms * lms * lms);
}

vec3 getGradientColor(float position) {
    position = clamp(position, 0.0, 1.0);
    int count = 3;

    for (int i = 0; i < count; i++) {
        float colorPosition = getStop(i);
        float nextColorPosition = getStop(i + 1);

        if (position <= nextColorPosition) {
            float stopDelta = nextColorPosition - colorPosition;
            float mixFactor = clamp(
                stopDelta > 0.0001 ? (position - colorPosition) / stopDelta : 0.0,
                0.0,
                1.0
            );
            vec3 startColor = animateColor(getColor(i), float(i));
            vec3 endColor = animateColor(getColor(i + 1), float(i + 1));
            vec3 linStart = linear_from_srgb(startColor);
            vec3 linEnd = linear_from_srgb(endColor);
            vec3 mixedLin = oklab_mix(linStart, linEnd, mixFactor);
            return srgb_from_linear(mixedLin);
        }
    }

    return getColor(count);
}

void main() {
    vec2 uv = vUv; // ou vTextureCoord selon ta version
    vec4 color = texture(uTexture, uv);

    
    if (color.a > 0.001 && length(color.rgb) > 0.01) {
        
        float position = smoothstep(0.0, 1.0, luma(color.rgb));
        float posOffset = (0.25 + 0.2500 + 0.0001) * 2.0;
        position -= (uTime * 0.01 * uSpeed + posOffset);

        float cycle = floor(position);
        bool reverse = int(cycle) % 2 == 0;
        float animatedPos = reverse ? fract(-position) : fract(position);
        animatedPos = clamp(animatedPos, 0.0, 1.0);

        vec3 gradientColor = getGradientColor(animatedPos);
        gradientColor += deband();
        color.rgb = mix(color.rgb, gradientColor, clamp(uMixAmount, 0.0, 1.0));
    }

    // Le fond restera noir et transparent !
    fragColor = color;
}
`;class xE extends Gt{constructor({speed:e=1,evolution:t=0,color0:n=0,color1:s=5592405,color2:r=11184810,color3:o=16777215,mixAmount:a=1}={}){super("GradientMap");const l=At.clamp(a,0,1),c=At.clamp(t,0,2),u={uTexture:{value:null},uTime:{value:0},uSpeed:{value:e},uEvolution:{value:c},uColor0:{value:new Ce(n)},uColor1:{value:new Ce(s)},uColor2:{value:new Ce(r)},uColor3:{value:new Ce(o)},uMixAmount:{value:l}};this.fullscreenMaterial=new Tt({uniforms:u,vertexShader:vE,fragmentShader:_E,glslVersion:on});const h=new un(2,2,32,32),f=new Et(h,this.fullscreenMaterial);this.scene.clear(),this.scene.add(f),this.needsSwap=!0}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture,r.uniforms.uTime.value+=s,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}}const bE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,yE=`precision highp float;

in vec3 vVertexPosition;
in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uAmount;
uniform float uMixAmount;

out vec4 fragColor;

vec2 distortUV(vec2 uv) {
    vec2 pos = vec2(0.5, 0.5) + mix(vec2(0.0), (uMousePos - 0.5), 0.0);
    float aspectRatio = uResolution.x / uResolution.y;
    float gridSize = (uAmount * 0.01 + 0.01) * 0.083;
    float baseGrid = 1.0 / max(gridSize, 1e-5);
    vec2 cellSize = vec2(1.0 / (baseGrid * aspectRatio), 1.0 / baseGrid) *
        mix(aspectRatio, 1.0 / aspectRatio, 0.5);
    vec2 offsetUv = uv - pos;
    vec2 cell = floor(offsetUv / cellSize);
    vec2 cellCenter = (cell + 0.5) * cellSize;
    vec2 pixelatedCoord = cellCenter + pos;

    return vec2(
        mix(uv.x, pixelatedCoord.x, vec2(1.0).x),
        mix(uv.y, pixelatedCoord.y, vec2(1.0).y)
    );
}

void main() {
    vec4 bg = texture(uTexture, vUv);
    vec2 uv = distortUV(vUv);
    vec4 color = texture(uTexture, uv);
    fragColor = mix(bg, color, clamp(uMixAmount, 0.0, 1.0));
}
`;class SE extends Gt{constructor({amount:e=50,mixAmount:t=1,mousePos:n=new Me(.5,.5)}={}){super("Pixelate");const s=At.clamp(t,0,1),r={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uMousePos:{value:n},uAmount:{value:e},uMixAmount:{value:s}};this.fullscreenMaterial=new Tt({uniforms:r,vertexShader:bE,fragmentShader:yE,glslVersion:on});const o=new un(2,2,32,32),a=new Et(o,this.fullscreenMaterial);this.scene.clear(),this.scene.add(a),this.needsSwap=!0}render(e,t,n){const s=this.fullscreenMaterial;s.uniforms.uTexture.value=t.texture,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}setMixAmount(e){const t=this.fullscreenMaterial;t.uniforms.uMixAmount.value=At.clamp(e,0,1)}setAmount(e){const t=this.fullscreenMaterial;t.uniforms.uAmount.value=e}updateMousePosition(e,t){this.fullscreenMaterial.uniforms.uMousePos.value.set(e,t)}}const wE=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`,ME=`varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uMixAmount;

void main() {
    vec2 texel = max(uRadius, 0.0) / uResolution;
    vec4 blurred = vec4(0.0);
    float totalWeight = 0.0;

    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 offset = vec2(float(x), float(y)) * texel;
            float weight = 1.0 - min(length(vec2(float(x), float(y))) / 3.5, 0.95);

            blurred += texture2D(uTexture, vUv + offset) * weight;
            totalWeight += weight;
        }
    }

    vec4 baseColor = texture2D(uTexture, vUv);
    vec4 blurColor = blurred / totalWeight;

    gl_FragColor = mix(baseColor, blurColor, clamp(uMixAmount, 0.0, 1.0));
}
`;class EE extends Gt{constructor({radius:e=2,mixAmount:t=1}={}){super("Blur");const n=At.clamp(t,0,1),s={uTexture:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uRadius:{value:e},uMixAmount:{value:n}};this.fullscreenMaterial=new Tt({uniforms:s,vertexShader:wE,fragmentShader:ME});const r=new un(2,2,32,32),o=new Et(r,this.fullscreenMaterial);this.scene.clear(),this.scene.add(o),this.needsSwap=!0}setParams(e){const t=this.fullscreenMaterial;e.radius!==void 0&&(t.uniforms.uRadius.value=Math.max(e.radius,0)),e.mixAmount!==void 0&&(t.uniforms.uMixAmount.value=At.clamp(e.mixAmount,0,1)),e.enabled!==void 0&&(this.enabled=e.enabled)}render(e,t,n){const s=this.fullscreenMaterial;s.uniforms.uTexture.value=t.texture,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}}var TE=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`,CE=`precision highp float;

varying vec3 vVertexPosition;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uRadius;
uniform float uFalloff;
uniform float uMix;
uniform float uDisplace;
uniform float uColorAlpha;
uniform float uSkew;
uniform float uAngle;
uniform int uBlendMode;
uniform vec3 uColor;
uniform vec2 uPos;

uniform sampler2D uMaskTexture;
uniform int uIsMask;
uniform float uTrackMouse;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uParentTrackMouse;

vec3 blend(int blendMode, vec3 src, vec3 dst) {
  if(blendMode == 0) return src;
  if(blendMode == 1) return src + dst;
  if(blendMode == 2) return src - dst;
  if(blendMode == 3) return src * dst;
  if(blendMode == 4) return 1.0 - (1.0 - src) * (1.0 - dst);
  if(blendMode == 5) return vec3(
    (dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), 
    (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), 
    (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z))
  );
  if(blendMode == 6) return min(src, dst);
  if(blendMode == 7) return max(src, dst);
  if(blendMode == 8) return vec3(
    (src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), 
    (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), 
    (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z))
  );
  if(blendMode == 9) return vec3(
    (src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), 
    (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), 
    (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z))
  );
  if(blendMode == 10) return (src + dst) - 1.0;
  if(blendMode == 11) return vec3(
    (src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), 
    (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)),  
    (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z))
  );
  if(blendMode == 12) return vec3(
    (src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), 
    (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), 
    (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z)))
  );
  if(blendMode == 13) return abs(dst - src);
  if(blendMode == 14) return src + dst - 2.0 * src * dst;
  if(blendMode == 15) return 2.0 * src + dst - 1.0;
  if(blendMode == 16) return vec3(
    (src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), 
    (src.y > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), 
    (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z)
  );
  if(blendMode == 17) return vec3(
    (src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), 
    (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), 
    (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z)))
  );
  return src; 
}
mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

#define TWO_PI 6.28318530718

void main() {
  vec2 uv = vUv;

  vec4 bg = texture2D(uTexture, uv);
  float luma = dot(bg.rgb, vec3(0.299, 0.587, 0.114));

  #ifdef USE_DISPLACEMENT
    float luma = dot(bg.rgb, vec3(0.299, 0.587, 0.114));
    float displacement = (luma - 0.5) * uDisplace * 0.5;
  #else
    float displacement = 0.0;
  #endif

  vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 skew = vec2(uSkew, 1.0 - uSkew);

  float halfRadius = uRadius * 0.5;
  float innerEdge = halfRadius - uFalloff * halfRadius * 0.5;
  float outerEdge = halfRadius + uFalloff * halfRadius * 0.5;

  #ifdef USE_MOUSE_TRACKING
    vec2 pos = uPos + (uMousePos - 0.5) * uTrackMouse;
  #else
    vec2 pos = uPos;
  #endif

  vec2 scaledUV = uv * aspectRatio * rot(uAngle * TWO_PI) * skew;
  vec2 scaledPos = pos * aspectRatio * rot(uAngle * TWO_PI) * skew;
  float radius = distance(scaledUV, scaledPos);

  float falloff = smoothstep(innerEdge + displacement, outerEdge + displacement, radius);

  vec3 finalColor;
  #ifdef USE_BLEND_MODE
    vec3 blended = blend(uBlendMode, uColor, bg.rgb);
    finalColor = mix(bg.rgb, blended, falloff * uMix);
  #else
    finalColor = mix(bg.rgb, mix(bg.rgb, uColor, uMix), falloff);
  #endif

  float alpha = max(bg.a, falloff * uMix);
  vec4 color = mix(bg * (1.0 - falloff), vec4(finalColor * alpha, alpha), uColorAlpha);

  #ifdef USE_MASK
    vec2 maskPos = mix(vec2(0.0),uMousePos-0.5,uParentTrackMouse);
    vec4 maskColor = texture2D(uMaskTexture,vUv-maskPos);
    color *= maskColor.a*maskColor.a;
  #endif

  gl_FragColor = color;
}`;class AE extends Gt{previousMousePos=new Me(.5,.5);constructor({pos:e=new Me(.5,.5),color:t="#000000",colorAlpha:n=1,radius:s=.5,falloff:r=.5,skew:o=0,angle:a=0,mix:l=1,displace:c=0,blendMode:u="Normal",trackMouse:h=0,mousePos:f=new Me,isMask:m=0,parentTrackMouse:_=0,maskTexture:b=new Ut}={}){super("VignettePass");const v={};ea[u]>0&&(v.USE_BLEND_MODE=""),h!==0&&(v.USE_MOUSE_TRACKING=""),m!==0&&(v.USE_MASK="");const p={uTime:{value:0},uTexture:{value:null},uPos:{value:e},uColor:{value:new Ce(t)},uColorAlpha:{value:n},uRadius:{value:s},uFalloff:{value:r},uSkew:{value:o},uAngle:{value:a},uMix:{value:l},uDisplace:{value:c},uBlendMode:{value:ea[u]},uTrackMouse:{value:h},uMousePos:{value:f},uIsMask:{value:m},uParentTrackMouse:{value:_},uMaskTexture:{value:b},uResolution:{value:new Me(window.innerWidth,window.innerHeight)}};this.fullscreenMaterial=new Tt({defines:v,uniforms:p,vertexShader:TE,fragmentShader:CE}),this.needsSwap=!0}render(e,t,n,s){const r=this.fullscreenMaterial;r.uniforms.uTexture.value=t.texture,r.uniforms.uTime.value+=s,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&wn(o,s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}updateMousePosition(e,t){const n={x:Qo(this.previousMousePos.x,e.x,t),y:Qo(this.previousMousePos.y,e.y,t)};this.fullscreenMaterial.uniforms.uMousePos.value.copy(n),this.previousMousePos.copy(n)}}const PE={2:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!0,thickness:1,threshold:.5,softness:1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1.5999999999999999,glow:1.5999999999999999,noise:.2,scanlines:0,shift:0,mixAmount:3.3000000000000003,passOrder:1},trilight:{enabled:!0,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},characters:"@",scale:.8300000000000001,gamma:1,mix:1,monochrome:.7000000000000001,color:"#ff0000",order:.1,passOrder:3},glitch:{enabled:!0,size:100,offsetX:14,offsetY:73,blockiness:0,aberration:58,waves:100,frequency:100,phase:0,speed:100,passOrder:10},blobTracking:{enabled:!1}},3:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:9,mixAmount:1,passOrder:8},outline:{enabled:!0,thickness:1.8,threshold:1,softness:.68,strength:3.6,mixAmount:2.9000000000000004,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:3.7,noise:3469446951953614e-33,scanlines:0,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:17},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#f70101",color1:"#00ff0e",color2:"#a000ff",color3:"#00deff",mixAmount:1,passOrder:8},glypheDither:{enabled:!0,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%",scale:.8400000000000001,gamma:1,mix:1,monochrome:0,color:"#f6f6f6",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:28,offsetY:33,blockiness:100,aberration:45,waves:53,frequency:50,phase:.47000000000000003,speed:100,passOrder:9},blobTracking:{enabled:!1,maxBlobs:6.4,mixAmount:10,background:!0,smoothing:29,threshold:0,persistence:12,signal:55,trackRadius:40,minSpacing:7,size:0,rectScale:.5,fill:0,color:"#ffffff",lineWidth:0,labelScale:100,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:78,connectorStroke:"dotted",passOrder:20}},4:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!0,scale:10,speed:3.4000000000000004,drift:{x:.22,y:.05},edge:.028000000000000004,warp:2.6,colorA:"#371ef6",colorB:"#fff000",lineColor:"#ff3333",mixAmount:3.9000000000000004,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!0,contrast:1.5999999999999999,glow:.09999999999999995,noise:.09,scanlines:0,shift:.15,mixAmount:3.3000000000000003,passOrder:11},trilight:{enabled:!0,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},characters:"@",scale:.8300000000000001,gamma:1,mix:1,monochrome:.7000000000000001,color:"#ff0000",order:.1,passOrder:3},glitch:{enabled:!0,size:100,offsetX:14,offsetY:22,blockiness:0,aberration:58,waves:62,frequency:42,phase:0,speed:86,passOrder:6},blobTracking:{enabled:!1}},5:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!0,contrast:1,glow:3.7,noise:3469446951953614e-33,scanlines:0,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!0,size:50,offsetX:28,offsetY:33,blockiness:100,aberration:45,waves:53,frequency:50,phase:.47000000000000003,speed:100,passOrder:9},blobTracking:{enabled:!0,maxBlobs:6.4,mixAmount:10,background:!0,smoothing:29,threshold:0,persistence:12,signal:55,trackRadius:40,minSpacing:7,size:0,rectScale:.5,fill:0,color:"#ffffff",lineWidth:0,labelScale:100,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:78,connectorStroke:"dotted",passOrder:10}},6:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!0,amount:10,mixAmount:1,passOrder:20},outline:{enabled:!1,thickness:.9,threshold:.47000000000000003,softness:1,strength:1.3,mixAmount:10,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!0,speed:5.4,evolution:.72,color0:"#0d59ff",color1:"#7b20c8",color2:"#0e46c1",color3:"#8c14e1",mixAmount:1,passOrder:18},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},7:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!0,amount:12,mixAmount:1,passOrder:3},outline:{enabled:!0,thickness:.19999999999999996,threshold:.16999999999999998,softness:3469446951953614e-33,strength:.5,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},characters:" .:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},8:{blur:{enabled:!0,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!0,amount:9,mixAmount:1,passOrder:8},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:3.7,noise:3469446951953614e-33,scanlines:0,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!0,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:17},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!0,speed:1,evolution:0,color0:"#f70101",color1:"#00ff0e",color2:"#a000ff",color3:"#00deff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:28,offsetY:33,blockiness:100,aberration:45,waves:53,frequency:50,phase:.47000000000000003,speed:100,passOrder:9},blobTracking:{enabled:!0,maxBlobs:6.4,mixAmount:10,background:!0,smoothing:29,threshold:0,persistence:12,signal:55,trackRadius:40,minSpacing:7,size:0,rectScale:.5,fill:0,color:"#ffffff",lineWidth:0,labelScale:100,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:78,connectorStroke:"dotted",passOrder:20}},9:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!0,contrast:.7000000000000001,glow:5.5,noise:.52,scanlines:0,shift:0,mixAmount:1,passOrder:1},trilight:{enabled:!0,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},characters:" .:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},10:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!0,contrast:.7000000000000001,glow:5.5,noise:.52,scanlines:0,shift:0,mixAmount:1,passOrder:1},trilight:{enabled:!0,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:6},vignette:{enabled:!0,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.32,falloff:.6,skew:.47000000000000003,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},characters:" .:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},11:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:10,mixAmount:1,passOrder:20},outline:{enabled:!1,thickness:.9,threshold:.47000000000000003,softness:1,strength:1.3,mixAmount:10,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!0,speed:10,evolution:.78,color0:"#0d59ff",color1:"#7b20c8",color2:"#0e46c1",color3:"#8c14e1",mixAmount:10,passOrder:1},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},12:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:10,mixAmount:1,passOrder:20},outline:{enabled:!0,thickness:.09999999999999995,threshold:.47000000000000003,softness:1,strength:.9,mixAmount:10,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:10,evolution:.78,color0:"#0d59ff",color1:"#7b20c8",color2:"#0e46c1",color3:"#8c14e1",mixAmount:10,passOrder:1},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},13:{blur:{enabled:!0,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!0,amount:10,mixAmount:1,passOrder:20},outline:{enabled:!0,thickness:.9,threshold:.47000000000000003,softness:1,strength:1.3,mixAmount:10,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},14:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:10,mixAmount:1,passOrder:20},outline:{enabled:!0,thickness:.4,threshold:.47000000000000003,softness:.72,strength:2.9000000000000004,mixAmount:10,passOrder:4},thermalVision:{enabled:!0,contrast:.7000000000000001,glow:.29999999999999993,noise:.27,scanlines:.29999999999999993,shift:0,mixAmount:1.5999999999999999,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:10,evolution:.78,color0:"#0d59ff",color1:"#7b20c8",color2:"#0e46c1",color3:"#8c14e1",mixAmount:10,passOrder:1},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1}},15:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:9,mixAmount:1,passOrder:8},outline:{enabled:!0,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:3.7,noise:3469446951953614e-33,scanlines:0,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:17},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!0,speed:1,evolution:0,color0:"#f70101",color1:"#00ff0e",color2:"#a000ff",color3:"#00deff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:28,offsetY:33,blockiness:100,aberration:45,waves:53,frequency:50,phase:.47000000000000003,speed:100,passOrder:9},blobTracking:{enabled:!0,maxBlobs:6.4,mixAmount:10,background:!0,smoothing:29,threshold:0,persistence:12,signal:55,trackRadius:40,minSpacing:7,size:0,rectScale:.5,fill:0,color:"#ffffff",lineWidth:0,labelScale:100,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:78,connectorStroke:"dotted",passOrder:20}},16:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:9,mixAmount:1,passOrder:8},outline:{enabled:!0,thickness:1,threshold:1,softness:1,strength:6.3,mixAmount:2.9000000000000004,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:3.7,noise:3469446951953614e-33,scanlines:0,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ffd131",light2Color:"#61d9ff",light3Color:"#e60d05",mixAmount:1,passOrder:17},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#f70101",color1:"#00ff0e",color2:"#a000ff",color3:"#00deff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:28,offsetY:33,blockiness:100,aberration:45,waves:53,frequency:50,phase:.47000000000000003,speed:100,passOrder:9},blobTracking:{enabled:!0,maxBlobs:6.4,mixAmount:10,background:!0,smoothing:29,threshold:0,persistence:12,signal:55,trackRadius:40,minSpacing:7,size:0,rectScale:.5,fill:0,color:"#ffffff",lineWidth:0,labelScale:100,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:78,connectorStroke:"dotted",passOrder:20}},17:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!0,relief:.8400000000000001,intensity:1,coverage:10,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:20},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!0,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.85,gamma:.5,mix:1,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1,maxBlobs:5,mixAmount:1,background:!0,smoothing:32,threshold:50,persistence:50,signal:55,trackRadius:24,minSpacing:7,size:45,rectScale:1,fill:15,color:"#ffffff",lineWidth:34,labelScale:72,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:50,connectorStroke:"dotted",passOrder:11}},18:{blur:{enabled:!1,radius:3,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!0,amount:9,mixAmount:1,passOrder:15},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!0,contrast:1.3,glow:1,noise:.27,scanlines:0,shift:.33,mixAmount:1.5,passOrder:20},trilight:{enabled:!1,relief:.8400000000000001,intensity:1,coverage:10,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:20},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!0,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.85,gamma:1,mix:1,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1,maxBlobs:5,mixAmount:1,background:!0,smoothing:32,threshold:50,persistence:50,signal:55,trackRadius:24,minSpacing:7,size:45,rectScale:1,fill:15,color:"#ffffff",lineWidth:34,labelScale:72,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:50,connectorStroke:"dotted",passOrder:11}},19:{blur:{enabled:!0,radius:3,mixAmount:1,passOrder:4},voronoi:{enabled:!0,scale:10,speed:2.4000000000000004,drift:{x:.1,y:.05},edge:.064,warp:5.3,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:9,mixAmount:1,passOrder:15},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1.3,glow:1,noise:.27,scanlines:0,shift:.33,mixAmount:1.5,passOrder:20},trilight:{enabled:!1,relief:.8400000000000001,intensity:1,coverage:10,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:20},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!0,speed:2,evolution:0,color0:"#ff0000",color1:"#3300ff",color2:"#1dff00",color3:"#000000",mixAmount:10,passOrder:8},glypheDither:{enabled:!0,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.85,gamma:1,mix:1,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!0,size:14,offsetX:34,offsetY:10,blockiness:95,aberration:50,waves:32,frequency:50,phase:0,speed:10,passOrder:20},blobTracking:{enabled:!1,maxBlobs:5,mixAmount:1,background:!0,smoothing:32,threshold:50,persistence:50,signal:55,trackRadius:24,minSpacing:7,size:45,rectScale:1,fill:15,color:"#ffffff",lineWidth:34,labelScale:72,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:50,connectorStroke:"dotted",passOrder:11}}},RE={metaballs:{enabled:!0,passOrder:0,metaballsCount:15,maxMetaballNumber:32,floatAmplitudeMultiplier:1,sphereBoundaryRadius:1.5,metaballRadiusMultiplier:.85,burstExitSpeed:.2,burstBackSpeed:.15,maxDistance:100,surfaceDistance:.01,mergeForce:.8,lightPosition:new F(2,5,3),baseColor:"#ffffff",ambientStrength:.1,diffuseIntensity:1},blur:{enabled:!1,radius:2,mixAmount:1,passOrder:1},voronoi:{enabled:!1,scale:5,speed:1,drift:{x:.1,y:.05},edge:.05,warp:1,colorA:"#0a0a0a",colorB:"#cccccc",lineColor:"#ff3333",mixAmount:1,passOrder:2},pixelate:{enabled:!1,amount:15,mixAmount:1,passOrder:3},outline:{enabled:!1,thickness:1,threshold:.5,softness:.1,strength:1,mixAmount:1,passOrder:4},thermalVision:{enabled:!1,contrast:1,glow:1,noise:.1,scanlines:1,shift:0,mixAmount:1,passOrder:5},trilight:{enabled:!1,relief:.5,intensity:1,coverage:1,ambientColor:"#ffffff",light1Color:"#ff0000",light2Color:"#00ff00",light3Color:"#0000ff",mixAmount:1,passOrder:6},vignette:{enabled:!1,pos:{x:.5,y:.5},color:"#000000",colorAlpha:1,radius:.5,falloff:.5,skew:0,angle:0,mix:1,displace:0,passOrder:7},gradientMap:{enabled:!1,speed:1,evolution:0,color0:"#000000",color1:"#555555",color2:"#aaaaaa",color3:"#ffffff",mixAmount:1,passOrder:8},glypheDither:{enabled:!1,pos:{x:.5,y:.5},preset:"Characters",characters:".:-=+*#9P%@",scale:.5,gamma:.5,mix:.5,monochrome:0,color:"#ff0000",order:0,passOrder:9},glitch:{enabled:!1,size:50,offsetX:10,offsetY:10,blockiness:50,aberration:10,waves:10,frequency:50,phase:0,speed:10,passOrder:10},blobTracking:{enabled:!1,maxBlobs:5,mixAmount:1,background:!0,smoothing:32,threshold:50,persistence:50,signal:55,trackRadius:24,minSpacing:7,size:45,rectScale:1,fill:15,color:"#ffffff",lineWidth:34,labelScale:72,infoAmount:2,labelOffsetX:0,labelOffsetY:0,maxDistance:50,connectorStroke:"dotted",passOrder:11}},ta=PE;class DE extends Lr{sceneIndex=0;currentMode="2";modeKeys=Object.keys(ta);experience;soundManager;lastChangeTime=0;cooldown=1;isActivated=!0;currentModeDebug;constructor(){super(),this.experience=new xi,this.soundManager=this.experience.soundManager,this.soundManager.on("hardKick",()=>{this.experience.time.elapsed-this.lastChangeTime>this.cooldown&&(this.changeScene(),this.lastChangeTime=this.experience.time.elapsed)}),this.setupDebugs()}setupDebugs(){this.experience.debug.postprocessing.addButton({label:"Toggle Scene",title:this.isActivated.toString()}).on("click",()=>{this.isActivated=!this.isActivated}),this.currentModeDebug=this.experience.debug.postprocessing.addBlade({view:"text",label:"Current Visual",parse:e=>String(e),value:this.currentMode})}changeScene(){if(!this.isActivated)return;const e=Math.floor(Math.random()*this.modeKeys.length);let t=this.modeKeys[e];t===this.currentMode&&(t=this.modeKeys[(e+1)%this.modeKeys.length]),this.currentMode=t,this.currentModeDebug.value=this.currentMode,console.log(this.currentMode),this.trigger("changeScene",[ta[t]])}}const Do=`precision highp float;

in vec3 position;
in vec2 uv;


out vec2 vTextureCoord;

void main() {


    vTextureCoord = uv;

    gl_Position = vec4(position.xy, 1.0, 1.0);
}`,IE=`precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uPreviousFrameTexture;
uniform vec2 uResolution;
uniform float uThreshold;
uniform float uPersistence;
uniform float uSignalAmount;

out vec4 fragColor;

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

vec4 maskPass(vec2 uv) {
    vec2 texel = 1.0 / uResolution;
    vec4 current = texture(uTexture, uv);
    float currentLuma = luma(current.rgb);

    // if (current.a < 0.005 && currentLuma < 0.005) {
    //     return vec4(0.0);
    // }

    float l = luma(texture(uTexture, uv + vec2(-1.0, 0.0) * texel).rgb);
    float r = luma(texture(uTexture, uv + vec2( 1.0, 0.0) * texel).rgb);
    float t = luma(texture(uTexture, uv + vec2( 0.0,-1.0) * texel).rgb);
    float b = luma(texture(uTexture, uv + vec2( 0.0, 1.0) * texel).rgb);

    float gx = r - l;
    float gy = b - t;
    float gradMag = length(vec2(gx, gy));

    vec4 prevOutput = texture(uPreviousFrameTexture, uv);
    if (all(equal(prevOutput, vec4(0.0)))) {
        return vec4(0.0, currentLuma, gx * 0.5 + 0.5, gy * 0.5 + 0.5);
    }

    float prevLuma = prevOutput.g;
    vec2 prevGrad = (prevOutput.ba - 0.5) * 2.0;
    float prevGradMag = length(prevGrad);

    float lumaDiff = abs(currentLuma - prevLuma);
    float threshold = mix(0.0, 0.2, clamp(uThreshold, 0.0, 1.0));
    float lumaMotion = smoothstep(threshold, threshold + 0.15, lumaDiff);

    float magChange = abs(gradMag - prevGradMag);
    float structuralMotion = smoothstep(0.08, 0.5, magChange);
    float detected = max(lumaMotion, lumaMotion * structuralMotion);

    float signalAmount = clamp(uSignalAmount, 0.0, 1.0);
    float brightSignal = smoothstep(
        mix(0.72, 0.25, signalAmount),
        mix(0.95, 0.55, signalAmount),
        currentLuma
    );
    float edgeSignal = smoothstep(0.035, 0.22, gradMag) * signalAmount;
    float directSignal = max(brightSignal, edgeSignal * 0.8);
    detected = max(detected, directSignal * signalAmount);
    detected = smoothstep(0.05, 0.4, detected);

    float prevDetected = prevOutput.r;
    float riseRate = 0.6;
    float fallRate = mix(0.35, 0.95, clamp(uPersistence, 0.0, 1.0));

    detected = (detected > prevDetected)
        ? mix(prevDetected, detected, riseRate)
        : prevDetected * fallRate;

    return vec4(detected, currentLuma, gx * 0.5 + 0.5, gy * 0.5 + 0.5);
}

void main() {
    fragColor = maskPass(vTextureCoord);
}
`,LE=`precision highp float;
precision highp int;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uResolution;

out vec4 fragColor;

vec2 getDirection(int i) {
    float angle = float(i) * 0.7853981634;
    return vec2(cos(angle), sin(angle));
}

vec4 peakPass(vec2 uv) {
    vec2 texel = 1.0 / uResolution;
    const float ACTIVE_THRESHOLD = 0.02;
    const float FILL_RADIUS = 6.0;

    vec4 centerSample = texture(uTexture, uv);
    float centerVal = centerSample.r;

    float quickMax = centerVal;
    quickMax = max(quickMax, texture(uTexture, uv + vec2(4.0, 0.0) * texel).r);
    quickMax = max(quickMax, texture(uTexture, uv + vec2(-4.0, 0.0) * texel).r);
    quickMax = max(quickMax, texture(uTexture, uv + vec2(0.0, 4.0) * texel).r);
    quickMax = max(quickMax, texture(uTexture, uv + vec2(0.0, -4.0) * texel).r);

    if (quickMax < ACTIVE_THRESHOLD * 0.5) {
        return vec4(0.0, 0.5, 0.5, 0.0);
    }

    float nearestActiveDist = FILL_RADIUS + 1.0;
    float maxVal = centerVal;
    vec2 gradient = vec2(0.0);

    if (centerVal > ACTIVE_THRESHOLD) {
        nearestActiveDist = 0.0;
    }

    for (int i = 0; i < 8; i++) {
        vec2 dir = getDirection(i);
        for (float d = 2.0; d <= FILL_RADIUS; d += 2.0) {
            vec2 offset = dir * d * texel;
            float v = texture(uTexture, uv + offset).r;

            if (v > ACTIVE_THRESHOLD) {
                nearestActiveDist = min(nearestActiveDist, d);
            }

            maxVal = max(maxVal, v);

            if (v > 0.01) {
                gradient += dir * d * v;
            }
        }
    }

    float result = 0.0;
    if (nearestActiveDist <= FILL_RADIUS) {
        result = 1.0 - smoothstep(
            FILL_RADIUS * 0.5,
            FILL_RADIUS,
            nearestActiveDist
        );
        result *= mix(0.7, 1.0, smoothstep(0.0, 0.1, maxVal));
    }

    float gradLen = length(gradient);
    vec2 gradDir = (gradLen > 0.001) ? gradient / gradLen : vec2(0.0);
    vec2 gradEncoded = gradDir * 0.5 + 0.5;
    float peakness = (maxVal > ACTIVE_THRESHOLD && result > 0.02)
        ? clamp(maxVal / 0.2, 0.0, 1.0)
        : 0.0;

    return vec4(result, gradEncoded.x, gradEncoded.y, peakness);
}

void main() {
    fragColor = peakPass(vTextureCoord);
}
`,UE=`precision highp float;
precision highp int;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uPreviousFrameTexture;
uniform vec2 uResolution;
uniform float uThreshold;
uniform float uPersistence;
uniform float uSmoothing;
uniform float uSizeScale;
uniform float uTrackRadius;
uniform float uMinSpacing;
uniform float uMaxBlobs;

out vec4 fragColor;

const int MAX_BLOBS = 16;
const float GRID_SIZE = 8.0;
const float BLOB_SLOT_HEIGHT = 0.02;

vec2 getBlobSlotUV(int blobIndex) {
    float slotX = (float(blobIndex) + 0.5) / 16.0;
    return vec2(slotX, BLOB_SLOT_HEIGHT * 0.5);
}

bool isBlobSlot(vec2 uv) {
    return uv.y < BLOB_SLOT_HEIGHT;
}

int getBlobIndexForUV(vec2 uv) {
    return int(floor(uv.x * 16.0));
}

bool isBlobStateAlive(vec4 state) {
    return state.z > 0.01 && state.w > 0.05 && state.x >= 0.0;
}

bool checkBlobCollision(
    vec2 cPos,
    int slotIndex,
    float minSpacing,
    bool checkLower,
    bool checkHigher
) {
    if (checkLower) {
        for (int j = 0; j < MAX_BLOBS; j++) {
            if (float(j) >= uMaxBlobs) break;
            if (j >= slotIndex) break;
            if (j >= 16) break;
            vec4 jState = textureLod(uPreviousFrameTexture, getBlobSlotUV(j), 0.0);
            if (!isBlobStateAlive(jState)) continue;
            if (length(cPos - jState.xy) < minSpacing) return true;
        }
    }

    if (checkHigher) {
        for (int j = 0; j < MAX_BLOBS; j++) {
            int idx = slotIndex + 1 + j;
            if (float(idx) >= uMaxBlobs) break;
            if (idx >= 16) break;
            vec4 jState = textureLod(uPreviousFrameTexture, getBlobSlotUV(idx), 0.0);
            if (!isBlobStateAlive(jState)) continue;
            if (length(cPos - jState.xy) < minSpacing) return true;
        }
    }

    return false;
}

vec4 sampleGridCell(vec2 cellCenter, vec2 cellSize, out vec2 sumPos2, out vec2 bestPeakPos) {
    const int SAMPLE_COUNT = 25;
    float sumW = 0.0;
    vec2 sumPos = vec2(0.0);
    sumPos2 = vec2(0.0);
    float bestPeakStrength = 0.0;
    bestPeakPos = vec2(0.0);

    for (int s = 0; s < SAMPLE_COUNT; s++) {
        float x = float(s % 5);
        float y = float(s / 5);
        vec2 offset = (vec2(x, y) / 4.0 - 0.5) * cellSize;
        vec2 samplePos = cellCenter + offset;

        if (
            samplePos.x < 0.0 || samplePos.x > 1.0 ||
            samplePos.y < 0.0 || samplePos.y > 1.0
        ) {
            continue;
        }

        vec4 peakData = texture(uTexture, samplePos);
        float fieldStrength = peakData.r;
        float peakness = peakData.a;

        if (fieldStrength > 0.01) {
            float w = fieldStrength * (1.0 + peakness * 0.3);
            sumW += w;
            sumPos += samplePos * w;
            sumPos2 += samplePos * samplePos * w;

            float peakScore = fieldStrength * (0.5 + peakness);
            if (peakScore > bestPeakStrength) {
                bestPeakStrength = peakScore;
                bestPeakPos = samplePos;
            }
        }
    }

    return vec4(sumW, sumPos.x, sumPos.y, bestPeakStrength);
}

vec4 slotPass(vec2 uv) {
    if (!isBlobSlot(uv)) return vec4(0.0);

    int slotIndex = getBlobIndexForUV(uv);
    if (slotIndex >= 16 || float(slotIndex) >= uMaxBlobs) return vec4(0.0);

    vec2 slotUV = getBlobSlotUV(slotIndex);
    vec4 prevState = texture(uPreviousFrameTexture, slotUV);
    vec2 prevPos = prevState.xy;
    float prevSize = prevState.z;
    float prevConf = prevState.w;
    bool wasAlive = (prevSize > 0.01 && prevConf > 0.05 && prevPos.x >= 0.0);

    vec2 bestPos = vec2(-1.0);
    vec2 bestSize = vec2(0.0);
    float bestScore = 0.0;

    float cols = ceil(sqrt(16.0));
    float rows = ceil(16.0 / cols);
    float col = mod(float(slotIndex), cols);
    float row = floor(float(slotIndex) / cols);
    vec2 slotCenter = vec2((col + 0.5) / cols, (row + 0.5) / rows);
    float slotRadius = 0.5 / max(cols, rows);

    float minSpacing = mix(0.0, 0.25, clamp(uMinSpacing, 0.0, 1.0));
    float trackRadius = mix(0.025, 0.45, clamp(uTrackRadius, 0.0, 1.0));
    vec2 cellSize = vec2(1.0 / GRID_SIZE);

    for (int cell = 0; cell < 64; cell++) {
        int cx = cell % 8;
        int cy = cell / 8;
        vec2 cellCenter = (vec2(float(cx), float(cy)) + 0.5) / GRID_SIZE;
        vec2 sumPos2;
        vec2 bestPeakPos;
        vec4 sampleResult = sampleGridCell(cellCenter, cellSize, sumPos2, bestPeakPos);
        float sumW = sampleResult.x;
        vec2 sumPos = sampleResult.yz;
        float bestPeakStrength = sampleResult.w;

        if (sumW < 0.015) continue;

        vec2 cPos = sumPos / sumW;
        if (bestPeakStrength > 0.2) {
            cPos = mix(cPos, bestPeakPos, 0.05);
        }

        vec2 var = max(sumPos2 / sumW - cPos * cPos, vec2(0.0));
        float activity = clamp(sumW / 0.25, 0.0, 1.0);
        float minActivity = wasAlive ? 0.12 : 0.2;
        if (activity < minActivity) continue;

        float sizeScalar = sqrt(max(var.x, var.y)) * mix(1.5, 3.5, activity);
        float maxSize = mix(0.04, 1.2, clamp(uSizeScale, 0.0, 1.0));
        sizeScalar = sizeScalar * maxSize;

        float distFromSelf = length(cPos - prevPos);
        if (checkBlobCollision(cPos, slotIndex, minSpacing, true, false)) continue;
        if (wasAlive && distFromSelf > trackRadius) continue;
        if (!wasAlive && checkBlobCollision(cPos, slotIndex, minSpacing, false, true)) continue;

        float score = sumW * activity;
        float distFromSlot = length(cPos - slotCenter);
        float regionBonus = exp(-distFromSlot * distFromSlot / (slotRadius * slotRadius * 2.0));

        if (wasAlive) {
            score *= exp(-distFromSelf * 2.0);
            score *= (0.5 + 0.5 * regionBonus);
        } else {
            score *= (0.8 + 0.2 * regionBonus);
        }

        if (score > bestScore) {
            bestScore = score;
            bestPos = cPos;
            bestSize = vec2(sizeScalar);
        }
    }

    vec2 newPos;
    vec2 newSize;
    float thresholdAmount = clamp(uThreshold, 0.0, 1.0);
    float persistenceAmount = clamp(uPersistence, 0.0, 1.0);
    float smoothingAmount = clamp(uSmoothing, 0.0, 1.0);
    float spawnThreshold = mix(0.12, 0.05, thresholdAmount);
    float trackThreshold = mix(0.06, 0.02, thresholdAmount);
    float acceptThreshold = wasAlive ? trackThreshold : spawnThreshold;
    float newConf = 0.0;
    float bestConf = clamp(bestScore * 8.0, 0.0, 1.0);
    const float MIN_PEAK_STRENGTH = 0.02;
    float peakAtBest = 0.0;
    vec2 texel = 1.0 / uResolution;

    for (int p = 0; p < 25; p++) {
        float px = float(p % 5) - 2.0;
        float py = float(p / 5) - 2.0;
        float pVal = texture(uTexture, bestPos + vec2(px, py) * texel * 2.0).r;
        peakAtBest = max(peakAtBest, pVal);
    }

    bool canAccept = bestScore > acceptThreshold && peakAtBest > MIN_PEAK_STRENGTH;
    if (canAccept) {
        if (wasAlive) {
            float smoothFactor = mix(1.0, 0.05, smoothingAmount);
            newPos = mix(prevPos, bestPos, smoothFactor);
            newSize = mix(vec2(prevSize), bestSize, smoothFactor * 0.45);
        } else {
            newPos = bestPos;
            newSize = bestSize;
        }

        newConf = clamp(max(prevConf * mix(0.45, 0.95, persistenceAmount), bestConf), 0.0, 1.0);
    } else {
        float falloff = mix(0.35, 0.96, persistenceAmount);
        newConf = prevConf * falloff;
        if (wasAlive && newConf > 0.035) {
            newPos = prevPos;
            newSize = vec2(prevSize * mix(0.8, 0.995, persistenceAmount));
        } else {
            newPos = vec2(-1.0);
            newSize = vec2(0.0);
            newConf = 0.0;
        }
    }

    return vec4(newPos, newSize.x, newConf);
}

void main() {
    fragColor = slotPass(vTextureCoord);
}
`,OE=`precision highp float;
precision highp int;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uBgTexture;
uniform sampler2D uFontAtlas;
uniform vec2 uResolution;
uniform float uLineWidth;
uniform float uConnectionDistance;
uniform float uFillOpacity;
uniform float uSizeScale;
uniform float uRectScale;
uniform vec3 uColor;
uniform float uLabelScale;
uniform float uInfoAmount;
uniform vec2 uLabelOffset;
uniform float uMaxBlobs;
uniform float uBackgroundEnabled;
uniform float uStrokeMode;
uniform float uMixAmount;

out vec4 fragColor;

const float FONT_COLS = 8.0;
const int FONT_START_CHAR = 32;
const int MAX_BLOBS = 40;
const float BLOB_SLOT_HEIGHT = 0.02;

float sampleChar(vec2 uv, int charCode) {
    int charIndex = charCode - FONT_START_CHAR;
    if (charIndex < 0 || charIndex >= 64) return 0.0;
    float col = mod(float(charIndex), FONT_COLS);
    float row = floor(float(charIndex) / FONT_COLS);
    float cellSize = 1.0 / 8.0;
    float x = (col + uv.x) * cellSize;
    float y = 1.0 - (row + 1.0 - uv.y) * cellSize;
    return textureLod(uFontAtlas, vec2(x, y), 0.0).r;
}

float sampleCharBold(vec2 uv, int charCode) {
    vec2 px = vec2(0.01, 0.0);
    vec2 py = vec2(0.0, 0.01);
    float c = sampleChar(uv, charCode);
    c = max(c, sampleChar(uv + px, charCode));
    c = max(c, sampleChar(uv - px, charCode));
    c = max(c, sampleChar(uv + py, charCode));
    c = max(c, sampleChar(uv - py, charCode));
    return c;
}

float renderDigit(vec2 uv, vec2 pos, vec2 size, int digit) {
    vec2 localUV = (uv - pos) / size;
    if (
        localUV.x < 0.0 || localUV.x > 1.0 ||
        localUV.y < 0.0 || localUV.y > 1.0
    ) {
        return 0.0;
    }
    return clamp(sampleCharBold(localUV, 48 + digit) * 1.25, 0.0, 1.0);
}

float renderChar(vec2 uv, vec2 pos, vec2 size, int charCode) {
    vec2 localUV = (uv - pos) / size;
    if (
        localUV.x < 0.0 || localUV.x > 1.0 ||
        localUV.y < 0.0 || localUV.y > 1.0
    ) {
        return 0.0;
    }
    return clamp(sampleCharBold(localUV, charCode) * 1.25, 0.0, 1.0);
}

float renderFloat(vec2 uv, vec2 pos, vec2 charSize, float value) {
    float result = 0.0;
    float spacing = charSize.x * 0.48;
    float clamped = clamp(value, 0.0, 0.9999);
    int digits = int(clamped * 10000.0);
    int d1 = digits / 1000;
    int d2 = (digits / 100) % 10;
    int d3 = (digits / 10) % 10;
    int d4 = digits % 10;
    float startX = pos.x - spacing * 2.5;

    result = max(result, renderDigit(uv, vec2(startX, pos.y), charSize, 0));
    result = max(result, renderChar(uv, vec2(startX + spacing, pos.y), charSize, 46));
    result = max(result, renderDigit(uv, vec2(startX + spacing * 2.0, pos.y), charSize, d1));
    result = max(result, renderDigit(uv, vec2(startX + spacing * 3.0, pos.y), charSize, d2));
    result = max(result, renderDigit(uv, vec2(startX + spacing * 4.0, pos.y), charSize, d3));
    result = max(result, renderDigit(uv, vec2(startX + spacing * 5.0, pos.y), charSize, d4));
    return result;
}

float renderCoordinateLine(vec2 uv, vec2 pos, vec2 charSize, int labelCode, float value) {
    float result = 0.0;
    float spacing = charSize.x * 0.58;
    result = max(result, renderChar(uv, pos, charSize, labelCode));
    result = max(result, renderFloat(uv, vec2(pos.x + spacing * 6.6, pos.y), charSize, value));
    return result;
}

vec2 getBlobSlotUV(int blobIndex) {
    // On divise par 16.0 car on a 16 blobs max (comme dans le slotFragment)
    float slotX = (float(blobIndex) + 0.5) / 16.0;
    
    // ✅ On lit la mémoire TOUT EN BAS de l'écran, là où elle est vraiment stockée !
    return vec2(slotX, BLOB_SLOT_HEIGHT * 0.5);
}

vec4 getBlobStateFromSlot(int i, sampler2D tex) {
    if (i >= MAX_BLOBS || float(i) >= uMaxBlobs) return vec4(-1.0, -1.0, 0.0, 0.0);
    return textureLod(tex, getBlobSlotUV(i), 0.0);
}

bool isBlobStateActive(vec4 state) {
    return state.x >= 0.0 && state.z >= 0.01 && state.w >= 0.1;
}

float boxSDF(vec2 p, vec2 center, vec2 halfSize) {
    vec2 d = abs(p - center) - halfSize;
    float outside = length(max(d, 0.0));
    float inside = min(max(d.x, d.y), 0.0);
    return outside + inside;
}

float dashedLineSDF(vec2 p, vec2 a, vec2 b, float dashLength, float gapLength) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float lineLen = length(ba);
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float distAlongLine = h * lineLen;
    float period = dashLength + gapLength;
    float inPeriod = mod(distAlongLine, period);
    if (inPeriod > dashLength) return 1.0;
    return length(pa - ba * h);
}

float dottedLineSDF(vec2 p, vec2 a, vec2 b) {
    return dashedLineSDF(p, a, b, 0.004, 0.011);
}

float lineStyleDistance(vec2 p, vec2 a, vec2 b) {
    if (uStrokeMode < 0.5) {
        return dashedLineSDF(p, a, b, 0.05, 0.0);
    }
    if (uStrokeMode < 1.5) {
        return dashedLineSDF(p, a, b, 0.012, 0.008);
    }
    return dottedLineSDF(p, a, b);
}

vec2 getHudHalfSize(float blobSize, float confidence, float aspectRatio) {
    float boxHeight = clamp(
        (
            0.008 +
            blobSize * mix(0.12, 1.6, clamp(uSizeScale, 0.0, 1.0)) +
            confidence * 0.015
        ) * max(uRectScale, 0.001),
        0.009,
        0.22
    );
    float boxWidth = boxHeight * 0.92;
    return vec2(boxWidth * aspectRatio, boxHeight);
}

vec2 getHudCenter(vec2 blobPos, vec2 halfSize, float aspectRatio) {
    return vec2(blobPos.x * aspectRatio, blobPos.y);
}

vec2 getGuidePoint(vec2 centerA, vec2 halfSize) {
    return centerA;
}

void computeLineDistances(
    vec2 uvA,
    float aspectRatio,
    sampler2D tex,
    float maxConnectionDist,
    inout float minLineDist
) {
    for (int i = 0; i < MAX_BLOBS; i++) {
        vec4 stateI = getBlobStateFromSlot(i, tex);
        if (!isBlobStateActive(stateI)) continue;
        float blobSizeI = stateI.z * 0.5;
        vec2 halfSizeI = getHudHalfSize(blobSizeI, stateI.w, aspectRatio);
        vec2 posA = getGuidePoint(getHudCenter(stateI.xy, halfSizeI, aspectRatio), halfSizeI);

        for (int j = 0; j < MAX_BLOBS; j++) {
            if (j <= i) continue;
            vec4 stateJ = getBlobStateFromSlot(j, tex);
            if (!isBlobStateActive(stateJ)) continue;
            if (distance(stateI.xy, stateJ.xy) > maxConnectionDist) continue;

            float blobSizeJ = stateJ.z * 0.5;
            vec2 halfSizeJ = getHudHalfSize(blobSizeJ, stateJ.w, aspectRatio);
            vec2 posB = getGuidePoint(getHudCenter(stateJ.xy, halfSizeJ, aspectRatio), halfSizeJ);
            minLineDist = min(minLineDist, lineStyleDistance(uvA, posA, posB));
        }
    }
}

float renderLabelIntensity(vec2 uvA, float aspectRatio, sampler2D tex) {
    float textResult = 0.0;

    for (int i = 0; i < MAX_BLOBS; i++) {
        vec4 state = getBlobStateFromSlot(i, tex);
        if (!isBlobStateActive(state)) continue;

        float blobSize = state.z * 0.5;
        vec2 halfSize = getHudHalfSize(blobSize, state.w, aspectRatio);
        vec2 centerA = getHudCenter(state.xy, halfSize, aspectRatio);
        float charHeight = clamp(
            halfSize.y * mix(0.06, 0.24, clamp(uLabelScale, 0.0, 1.0)),
            0.009,
            0.045
        );
        vec2 charSize = vec2(charHeight, charHeight);
        vec2 labelPos = vec2(
            centerA.x - halfSize.x + charSize.x * 1.8 + uLabelOffset.x,
            centerA.y + halfSize.y - charSize.y * 2.25 + uLabelOffset.y
        );
        float infoAmount = clamp(uInfoAmount, 0.0, 3.0);
        float lineGap = charSize.y * 0.86;
        if (infoAmount >= 0.5) {
            textResult = max(
                textResult,
                renderCoordinateLine(uvA, labelPos, charSize, 88, state.x)
            );
        }
        if (infoAmount >= 1.5) {
            textResult = max(
                textResult,
                renderCoordinateLine(uvA, vec2(labelPos.x, labelPos.y - lineGap), charSize, 89, state.y)
            );
        }
        if (infoAmount >= 2.5) {
            textResult = max(
                textResult,
                renderCoordinateLine(uvA, vec2(labelPos.x, labelPos.y - lineGap * 2.0), charSize, 83, state.z)
            );
        }
    }

    return textResult;
}

vec2 blobStyleBoxData(vec2 uvA, vec2 centerA, vec2 halfSize) {
    float d = boxSDF(uvA, centerA, halfSize);
    return vec2(abs(d), d);
}

vec4 drawPass(vec2 uv) {
    vec4 background = texture(uBgTexture, uv);

    float aspectRatio = uResolution.x / uResolution.y;
    float minBlobDist = 1.0;
    float minLineDist = 1.0;
    float minFillDist = 1.0;
    bool foundAny = false;

    for (int i = 0; i < MAX_BLOBS; i++) {
        vec4 state = getBlobStateFromSlot(i, uTexture);
        if (isBlobStateActive(state)) {
            foundAny = true;
            break;
        }
    }

    if (!foundAny) {
        return background;
    }

    vec2 uvA = vec2(uv.x * aspectRatio, uv.y);
    float lineWidth = max(uLineWidth * 0.0075, 0.0008);

    for (int i = 0; i < MAX_BLOBS; i++) {
        vec4 state = getBlobStateFromSlot(i, uTexture);
        if (!isBlobStateActive(state)) continue;

        float blobSize = state.z * 0.5;
        vec2 halfSize = getHudHalfSize(blobSize, state.w, aspectRatio);
        vec2 centerA = getHudCenter(state.xy, halfSize, aspectRatio);
        vec2 blobData = blobStyleBoxData(uvA, centerA, halfSize);
        minBlobDist = min(minBlobDist, blobData.x);
        minFillDist = min(minFillDist, blobData.y);
    }

    computeLineDistances(uvA, aspectRatio, uTexture, uConnectionDistance, minLineDist);

    float borderMask = 1.0 - smoothstep(lineWidth * 0.5, lineWidth * 1.5, minBlobDist);
    float borderHaloMask = 1.0 - smoothstep(lineWidth * 1.1, lineWidth * 3.2, minBlobDist);
    float borderGlowMask = 1.0 - smoothstep(lineWidth * 1.8, lineWidth * 6.0, minBlobDist);
    float fillMask = (
        1.0 - smoothstep(0.0, lineWidth * 5.0, max(minFillDist, 0.0))
    ) * clamp(uFillOpacity, 0.0, 1.0) * 0.42;
    float lineMask = 1.0 - smoothstep(lineWidth * 0.5, lineWidth * 1.8, minLineDist);
    float lineHaloMask = 1.0 - smoothstep(lineWidth * 1.0, lineWidth * 3.0, minLineDist);
    float lineGlowMask = 1.0 - smoothstep(lineWidth * 1.6, lineWidth * 5.0, minLineDist);
    float textMask = renderLabelIntensity(uvA, aspectRatio, uTexture);

    vec3 fillColor = mix(background.rgb * 0.85, uColor, 0.18);
    vec3 finalColor = mix(
        background.rgb,
        fillColor,
        fillMask * clamp(uMixAmount, 0.0, 1.0) * step(0.5, uBackgroundEnabled)
    );

    float hudInk = max(max(borderMask, lineMask), textMask);
    float hudGlow = max(borderGlowMask, lineGlowMask) * (1.0 - hudInk);
    finalColor = mix(
        finalColor,
        uColor,
        hudGlow * clamp(uMixAmount, 0.0, 1.0) * 0.22
    );
    float hudHalo = max(borderHaloMask, lineHaloMask) * (1.0 - hudInk);
    finalColor = mix(
        finalColor,
        vec3(0.0),
        hudHalo * clamp(uMixAmount, 0.0, 1.0) * 0.75
    );
    finalColor = mix(
        finalColor,
        uColor,
        hudInk * clamp(uMixAmount, 0.0, 1.0)
    );

    float overlayAlpha = max(max(hudInk, hudGlow * 0.45), fillMask);
    return vec4(finalColor, max(background.a, overlayAlpha * clamp(uMixAmount, 0.0, 1.0)));
}

void main() {
    fragColor = drawPass(vTextureCoord);
}
`;class NE extends Gt{resolution;maskRead;maskWrite;peak;slotRead;slotWrite;maskMaterial;peakMaterial;slotMaterial;drawMaterial;mesh;fontAtlas;constructor(e={}){super("BlobTracking"),this.resolution=new Me(window.innerWidth,window.innerHeight),this.fontAtlas=this.createFontAtlasTexture();const t=()=>new Nn(this.resolution.x,this.resolution.y,{minFilter:jt,magFilter:jt,type:Hn,depthBuffer:!1});this.maskRead=t(),this.maskWrite=t(),this.peak=t(),this.slotRead=t(),this.slotWrite=t(),this.maskMaterial=new Eo({vertexShader:Do,fragmentShader:IE,glslVersion:on,depthWrite:!1,depthTest:!1,uniforms:{uTexture:{value:null},uPreviousFrameTexture:{value:this.maskRead.texture},uResolution:{value:this.resolution},uThreshold:{value:.5},uPersistence:{value:.5},uSignalAmount:{value:.55}}}),this.peakMaterial=new Eo({vertexShader:Do,fragmentShader:LE,glslVersion:on,depthWrite:!1,depthTest:!1,uniforms:{uTexture:{value:null},uResolution:{value:this.resolution}}}),this.slotMaterial=new Eo({vertexShader:Do,fragmentShader:UE,glslVersion:on,depthWrite:!1,depthTest:!1,uniforms:{uTexture:{value:null},uPreviousFrameTexture:{value:this.slotRead.texture},uResolution:{value:this.resolution},uThreshold:{value:.5},uPersistence:{value:.5},uSmoothing:{value:.32},uSizeScale:{value:.45},uTrackRadius:{value:.24},uMinSpacing:{value:.07},uMaxBlobs:{value:16}}}),this.drawMaterial=new Eo({vertexShader:Do,fragmentShader:OE,glslVersion:on,depthWrite:!1,depthTest:!1,uniforms:{uTexture:{value:null},uBgTexture:{value:null},uFontAtlas:{value:this.fontAtlas},uResolution:{value:this.resolution},uLineWidth:{value:.34},uConnectionDistance:{value:.5},uFillOpacity:{value:.15},uSizeScale:{value:.45},uRectScale:{value:1.25},uColor:{value:new Ce("#ffffff")},uLabelScale:{value:.72},uInfoAmount:{value:2},uLabelOffset:{value:new Me(0,0)},uMaxBlobs:{value:16},uBackgroundEnabled:{value:1},uStrokeMode:{value:2},uMixAmount:{value:1}}}),this.mesh=new Et(new un(2,2,1,1),this.drawMaterial),this.scene.clear(),this.scene.add(this.mesh),this.needsSwap=!0,this.setParams(e)}render(e,t,n){this.mesh.material=this.maskMaterial,this.maskMaterial.uniforms.uTexture.value=t.texture,this.maskMaterial.uniforms.uPreviousFrameTexture.value=this.maskRead.texture,e.setRenderTarget(this.maskWrite),e.render(this.scene,this.camera),this.mesh.material=this.peakMaterial,this.peakMaterial.uniforms.uTexture.value=this.maskWrite.texture,e.setRenderTarget(this.peak),e.render(this.scene,this.camera),this.mesh.material=this.slotMaterial,this.slotMaterial.uniforms.uTexture.value=this.peak.texture,this.slotMaterial.uniforms.uPreviousFrameTexture.value=this.slotRead.texture,e.setRenderTarget(this.slotWrite),e.render(this.scene,this.camera),this.mesh.material=this.drawMaterial,this.drawMaterial.uniforms.uTexture.value=this.slotWrite.texture,this.drawMaterial.uniforms.uBgTexture.value=t.texture,e.setRenderTarget(this.renderToScreen?null:n),e.render(this.scene,this.camera);const s=this.maskRead;this.maskRead=this.maskWrite,this.maskWrite=s;const r=this.slotRead;this.slotRead=this.slotWrite,this.slotWrite=r}setParams(e){const t=[this.maskMaterial,this.peakMaterial,this.slotMaterial,this.drawMaterial];for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}let r=s,o=`u${n.charAt(0).toUpperCase()+n.slice(1)}`;if(n==="color"&&(r=new Ce(s)),n==="background"&&(r=s?1:0),n==="connectorStroke"&&(r=s==="solid"?0:s==="dashed"?1:2,o="uStrokeMode"),n==="labelOffsetX"||n==="labelOffsetY"){const l=this.drawMaterial.uniforms.uLabelOffset.value;n==="labelOffsetX"?l.x=s:l.y=s;continue}["threshold","persistence","signal","smoothing","size","trackRadius","minSpacing","lineWidth","maxDistance","fill","labelScale"].includes(n)&&typeof s=="number"&&(r=s/100);for(const l of t)l.uniforms[o]&&wn(l.uniforms[o],r)}}setSize(e,t){this.resolution.set(e,t),this.maskRead.setSize(e,t),this.maskWrite.setSize(e,t),this.peak.setSize(e,t),this.slotRead.setSize(e,t),this.slotWrite.setSize(e,t)}createFontAtlasTexture(){const e=document.createElement("canvas");e.width=1024,e.height=1024;const t=e.getContext("2d");if(!t)throw new Error("Impossible de creer la texture de font atlas.");t.clearRect(0,0,e.width,e.height),t.fillStyle="#000000",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffffff",t.textAlign="center",t.textBaseline="middle",t.font='600 88px Inter, ui-monospace, "SF Mono", "Roboto Mono", "Helvetica Neue", Arial, monospace';const n=8,s=8,r=e.width/n,o=e.height/s;for(let l=0;l<64;l++){const c=String.fromCharCode(32+l),u=l%n,h=Math.floor(l/n),f=u*r+r*.5,m=h*o+o*.54;t.fillText(c,f,m)}const a=new Ad(e);return a.generateMipmaps=!0,a.minFilter=In,a.magFilter=Pt,a.anisotropy=4,a.wrapS=yn,a.wrapT=yn,a}}class kE extends Gt{experience;metaballsData=[];initialPositions=[];floatParams=[];burstDirections=[];burstValues={currentForce:0,targetForce:0};physicsParams={};targetObject=null;constructor({metaballsCount:e=10,maxMetaballNumber:t=32,floatAmplitudeMultiplier:n=1,sphereBoundaryRadius:s=1.5,metaballRadiusMultiplier:r=.5,burstExitSpeed:o=.2,burstBackSpeed:a=.15,maxDistance:l=100,surfaceDistance:c=.01,mergeForce:u=.8,lightPosition:h=new F(2,5,3),baseColor:f="#ffffff",ambientStrength:m=.1,diffuseIntensity:_=1}={}){super("MetaballPass"),this.experience=new xi,this.physicsParams={metaballsCount:e,maxMetaballNumber:t,floatAmplitudeMultiplier:n,sphereBoundaryRadius:s,metaballRadiusMultiplier:r,burstExitSpeed:o,burstBackSpeed:a},this.initBallsArray();const b=this.experience.camera.instance,v={uSceneTexture:{value:null},uSceneDepth:{value:null},uResolution:{value:new Me(window.innerWidth,window.innerHeight)},uCameraPosition:{value:b.position},uCameraMatrixWorld:{value:b.matrixWorld},uProjectionMatrixInverse:{value:b.projectionMatrixInverse},uViewMatrix:{value:b.matrixWorldInverse},uCameraNear:{value:b.near},uCameraFar:{value:b.far},uMetaballs:{value:this.metaballsData},uMetaballsCount:{value:e},uMaxDistance:{value:l},uSurfaceDistance:{value:c},uMergeForce:{value:u},uLightPosition:{value:h},uBaseColor:{value:new Ce(f)},uAmbientStrength:{value:m},uDiffuseIntensity:{value:_}};this.fullscreenMaterial=new Tt({uniforms:v,vertexShader:`
        void main() { gl_Position = vec4(position, 1.0); }
      `,fragmentShader:zd,glslVersion:on});const p=new un(2,2,32,32),D=new Et(p,this.fullscreenMaterial);this.scene.clear(),this.scene.add(D),this.needsSwap=!0}initBallsArray(){const e=this.physicsParams.maxMetaballNumber;for(let t=0;t<e;t++){const n=Math.random(),s=Math.random(),r=n*2*Math.PI,o=Math.acos(2*s-1),a=Math.cbrt(Math.random())*this.physicsParams.sphereBoundaryRadius,l=a*Math.sin(o)*Math.cos(r),c=a*Math.sin(o)*Math.sin(r),u=a*Math.cos(o);this.initialPositions.push(new F(l,c,u));const h=.3+Math.random()*this.physicsParams.metaballRadiusMultiplier;this.metaballsData.push(new at(l,c,u,h)),this.burstDirections.push(new F(l,c,u).normalize()),this.floatParams.push({amplitude:.2+Math.random()*.8,speed:new F(.5+Math.random(),.5+Math.random(),.5+Math.random()),offset:new F(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2)})}}updatePhysics(){const e=this.experience.soundManager?.audio;if(!e)return;const t=e.volumeSmooth||0,n=this.fullscreenMaterial;n.uniforms.uMergeForce.value=Math.min(.6,t),this.burstValues.targetForce=(e.kick||0)*(10*e.kick),this.burstValues.currentForce=At.lerp(this.burstValues.currentForce,this.burstValues.targetForce,this.physicsParams.burstExitSpeed),this.burstValues.targetForce=At.lerp(this.burstValues.targetForce,0,this.physicsParams.burstBackSpeed);const s=this.experience.time.elapsed,r=this.physicsParams.metaballsCount,o=new F(0,0,0);this.targetObject&&this.targetObject.getWorldPosition(o);for(let a=0;a<r;a++){const l=this.metaballsData[a],c=this.initialPositions[a],u=this.floatParams[a],h=this.burstDirections[a],f=Math.sin(s*u.speed.x+u.offset.x)*u.amplitude,m=Math.cos(s*u.speed.y+u.offset.y)*u.amplitude,_=Math.sin(s*u.speed.z+u.offset.z)*u.amplitude,b=h.x*this.burstValues.currentForce*u.amplitude,v=h.y*this.burstValues.currentForce*u.amplitude,p=h.z*this.burstValues.currentForce*u.amplitude;l.x=o.x+c.x+f*this.physicsParams.floatAmplitudeMultiplier+b,l.y=o.y+c.y+m*this.physicsParams.floatAmplitudeMultiplier+v,l.z=o.z+c.z+_*this.physicsParams.floatAmplitudeMultiplier+p}}render(e,t,n){this.enabled&&this.updatePhysics();const s=this.fullscreenMaterial,r=this.experience.camera.instance;s.uniforms.uSceneTexture.value=t.texture,s.uniforms.uSceneDepth.value=t.depthTexture,s.uniforms.uCameraPosition.value.copy(r.position),s.uniforms.uCameraMatrixWorld.value.copy(r.matrixWorld),s.uniforms.uProjectionMatrixInverse.value.copy(r.projectionMatrixInverse),s.uniforms.uViewMatrix.value.copy(r.matrixWorldInverse),e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera)}setParams(e){const t=this.fullscreenMaterial;for(const[n,s]of Object.entries(e)){if(n==="enabled"){this.enabled=s;continue}const r=`u${n.charAt(0).toUpperCase()+n.slice(1)}`,o=t.uniforms[r];o&&(n==="baseColor"?wn(o,new Ce(s)):wn(o,s)),n in this.physicsParams&&(this.physicsParams[n]=s)}}setSize(e,t){this.fullscreenMaterial.uniforms.uResolution.value.set(e,t)}}class FE{instance;experience;metaballs;fogPass;liquifyPass;renderPass;glypheDither;thermalVision;outline;trilight;glitch;voronoi;gradientMap;pixelate;vignette;blur;blobTracking;sceneManager;activeParams;exportSettings={presetName:"monNouveauPreset"};debugState={pipelineStr:"Chargement..."};passDictionary;dynamicAllPasses=[];postproFolder;constructor(e){this.experience=new xi,this.instance=new JM(e),this.sceneManager=this.experience.sceneManager,this.activeParams=structuredClone(RE);const t=ta[this.sceneManager.currentMode],n=Object.keys(t);for(const s of n)this.activeParams[s]&&Object.assign(this.activeParams[s],t[s]);this.setupDebugs(),this.renderPass=new ZM(this.experience.scene,this.experience.camera.instance),this.metaballs=new kE,this.blur=new EE(this.activeParams.blur),this.voronoi=new gE(this.activeParams.voronoi),this.pixelate=new SE(this.activeParams.pixelate),this.outline=new aE(this.activeParams.outline),this.thermalVision=new sE(this.activeParams.thermalVision),this.trilight=new uE(this.activeParams.trilight),this.vignette=new AE(this.activeParams.vignette),this.gradientMap=new xE(this.activeParams.gradientMap),this.glypheDither=new tE(this.activeParams.glypheDither),this.glitch=new fE(this.activeParams.glitch),this.blobTracking=new NE(this.activeParams.glitch),this.passDictionary={metaballs:this.metaballs,blur:this.blur,voronoi:this.voronoi,pixelate:this.pixelate,outline:this.outline,thermalVision:this.thermalVision,trilight:this.trilight,vignette:this.vignette,gradientMap:this.gradientMap,glypheDither:this.glypheDither,glitch:this.glitch,blobTracking:this.blobTracking},this.sortAndRebuildPasses(),this.instance.renderPass(),this.syncPasses(),this.sceneManager.on("changeScene",s=>{for(const r of Object.keys(s))this.activeParams[r]&&Object.assign(this.activeParams[r],s[r]);this.sortAndRebuildPasses(),this.syncPasses()})}syncPasses(){this.metaballs.setParams(this.activeParams.metaballs),this.blur.setParams(this.activeParams.blur),this.voronoi.setParams(this.activeParams.voronoi),this.pixelate.setParams(this.activeParams.pixelate),this.outline.setParams(this.activeParams.outline),this.thermalVision.setParams(this.activeParams.thermalVision),this.trilight.setParams(this.activeParams.trilight),this.vignette.setParams(this.activeParams.vignette),this.gradientMap.setParams(this.activeParams.gradientMap),this.glypheDither.setParams(this.activeParams.glypheDither),this.glitch.setParams(this.activeParams.glitch),this.blobTracking.setParams(this.activeParams.blobTracking),this.updateRenderToScreen()}updateRenderToScreen(){this.dynamicAllPasses.forEach(t=>{t&&(t.renderToScreen=!1)});const e=this.dynamicAllPasses.slice().reverse().find(t=>t&&t.enabled);e&&(e.renderToScreen=!0)}setVisualMode(e){this.activeParams=structuredClone(ta[e]),this.syncPasses()}sortAndRebuildPasses(){const e=Object.keys(this.passDictionary).sort((n,s)=>{const r=this.activeParams[n]?.passOrder??99,o=this.activeParams[s]?.passOrder??99;return r-o}),t=e.filter(n=>this.activeParams[n]?.enabled).map((n,s)=>`${s+2}. ${n.toUpperCase()}`);this.debugState.pipelineStr=["1. RENDER",...t].join(`
`),this.postproFolder&&this.postproFolder.refresh(),this.instance.dynamicPasses=[],this.instance.addCustomPass(this.renderPass,!1),this.dynamicAllPasses=[this.renderPass],e.forEach(n=>{const s=this.passDictionary[n];this.instance.addCustomPass(s,!1),this.dynamicAllPasses.push(s)}),this.instance.rebuildDynamicPasses(),this.updateRenderToScreen()}exportCurrentConfig(){const e=this.exportSettings.presetName.trim()||"unnamedPreset",t={[e]:this.activeParams};return console.log(`📥 PRESET EXPORTÉ [${e}] :`),console.log(JSON.stringify(t,null,2)),t}update(){this.instance.render()}setupDebugs(){this.postproFolder=this.experience.debug.postprocessing,this.postproFolder.addBinding(this.debugState,"pipelineStr",{readonly:!0,label:"ORDRE",rows:8,multiline:!0});for(const[e,t]of Object.entries(this.activeParams)){const n=this.postproFolder.addFolder({title:e.toUpperCase(),expanded:!1}),s=t;for(const r of Object.keys(s)){const o=s[r];let a={label:r};if(r==="passOrder")a={label:"PassOrder",min:1,max:20,step:1};else if(typeof o=="number"){let l=Math.pow(10,Math.ceil(Math.log10(o)))||1;l<=o&&(l*=10);const c=l/100;a={label:r,min:0,max:l,step:c}}else(o instanceof Me||o&&typeof o=="object"&&"x"in o)&&(a={label:r,x:{min:-2,max:2,step:.01},y:{min:-2,max:2,step:.01}});n.addBinding(s,r,a).on("change",l=>{r==="passOrder"||r==="enabled"?l.last&&(this.sortAndRebuildPasses(),this.syncPasses()):this.syncPasses()})}}this.postproFolder.addBinding(this.exportSettings,"presetName",{label:"Nom du Preset"}),this.postproFolder.addButton({title:"Exporter JSON"}).on("click",()=>{const e=this.exportCurrentConfig(),t=JSON.stringify(e,null,2);navigator.clipboard.writeText(t)})}}const BE="modulepreload",zE=function(i){return"/"+i},$h={},Zh=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let l=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");s=l(t.map(c=>{if(c=zE(c),c in $h)return;$h[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":BE,u||(f.as="script"),f.crossOrigin="",f.href=c,a&&f.setAttribute("nonce",a),document.head.appendChild(f),u)return new Promise((m,_)=>{f.addEventListener("load",m),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},Jh={tame:{startBin:1,endBin:8,beatHold:.28,beatDecay:.98,beatMin:.15,beatMult:1.15,beat2Hold:.35,beat2Decay:.993,beat2Min:.26,beat2Mult:1.32,volumeMult:1.25},stones:{startBin:2,endBin:9,beatHold:.18,beatDecay:.968,beatMin:.12,beatMult:1.12,beat2Hold:.22,beat2Decay:.988,beat2Min:.22,beat2Mult:1.28,volumeMult:1.15},digeridoo:{startBin:4,endBin:10,beatHold:.26,beatDecay:.975,beatMin:.18,beatMult:1.18,beat2Hold:.32,beat2Decay:.994,beat2Min:.3,beat2Mult:1.35,volumeMult:1.3},default:{startBin:1,endBin:8,beatHold:.3,beatDecay:.982,beatMin:.15,beatMult:1.15,beat2Hold:.4,beat2Decay:.994,beat2Min:.28,beat2Mult:1.35,volumeMult:1}};function VE(i){return Jh[i]??Jh.default}function X1(i){const e=decodeURIComponent(i);return/01-Tame/i.test(e)?"tame":/02-The/i.test(e)?"stones":/03-Digeridoo/i.test(e)?"digeridoo":""}class HE{constructor({mode:e="auto",fftSize:t=512,autoTick:n=!0}={}){const s=window.self!==window.top;this.mode=e==="auto"?s?"receive":"live":e,this.fftSize=t,this.autoTick=n,this.binCount=t/2,this.volume=0,this.volumeSmooth=0,this.volumeByFrequency=new Float32Array(this.binCount),this.kick=0,this.kickEnergy=0,this.kickThreshold=.15,this.kickTimer=0,this.kickHard=0,this.kickHardEnergy=0,this.kickHardThreshold=.3,this.kickHardTimer=0,this.onCallbacks={load:[],warmup:[],play:[],stop:[],audio:[]},this.queue=Promise.resolve(),this.agc=.2,this.activeTrackId="",this.mode==="receive"?this.initReceive():this.initLive()}onLoad=e=>(this.onCallbacks.load.push(e),e);onWarmup=e=>(this.onCallbacks.warmup.push(e),e);onPlay=e=>(this.onCallbacks.play.push(e),e);onStop=e=>(this.onCallbacks.stop.push(e),e);onAudio=e=>(this.onCallbacks.audio.push(e),e);fire=e=>{this.queue=this.queue.then(()=>Promise.all(this.onCallbacks[e].map(t=>t()))).catch(t=>console.error("[analyzer] "+e,t))};emitAudio=()=>{for(let e=0;e<this.onCallbacks.audio.length;e++)this.onCallbacks.audio[e](this)};onMessage=e=>{const t=e.data;t?.type==="vj"&&(t.kind==="audio"?(this.volume=t.volume,this.volumeSmooth=t.volumeSmooth,this.kick=t.kick,this.kickEnergy=t.kickEnergy??0,this.kickThreshold=t.kickThreshold??0,this.kickHard=t.kickHard??0,this.kickHardEnergy=t.kickHardEnergy??0,this.kickHardThreshold=t.kickHardThreshold??0,t.volumeByFrequency&&this.volumeByFrequency.set(t.volumeByFrequency),this.emitAudio()):this.onCallbacks[t.kind]&&this.fire(t.kind))};initReceive=()=>{window.addEventListener("message",this.onMessage)};gesture=()=>this.start();onKey=e=>{document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")||e.key==="d"&&this.toggleDebug()};initLive=()=>{if(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=this.fftSize,this.binCount=this.analyser.frequencyBinCount,this.volumeByFrequency=new Float32Array(this.binCount),this.freqBytes=new Uint8Array(this.binCount),this.waveBytes=new Uint8Array(this.binCount),this.mediaNode=null,this.mediaEl=null,this.micNode=null,this.payload={type:"vj",kind:"audio",volume:0,volumeSmooth:0,kick:0,kickEnergy:0,kickThreshold:0,kickHard:0,kickHardEnergy:0,kickHardThreshold:0,volumeByFrequency:this.volumeByFrequency},this.autoTick){for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,this.gesture);this.fire("load"),this.fire("warmup"),window.addEventListener("keydown",this.onKey),this.toggleDebug(),this.start(),this.last=0,this.raf=requestAnimationFrame(this.tick)}};start=async()=>{if(!this.started){if(this.ctx.state!=="running")try{await this.ctx.resume()}catch{}if(this.ctx.state==="running"){this.started=!0;for(const e of["pointerdown","keydown","touchstart"])window.removeEventListener(e,this.gesture);if(this.autoTick&&!this.player)try{const{default:e}=await Zh(async()=>{const{default:t}=await import("./SoundPlayer-DOFvdzMy.js");return{default:t}},[]);this.player=new e(this)}catch(e){console.error("[analyzer] failed to load SoundPlayer",e)}this.fire("play")}}};connectMediaElement=e=>{this.mediaEl!==e&&(this.mediaNode=this.ctx.createMediaElementSource(e),this.mediaEl=e),this.disconnectSources(),this.mediaNode.connect(this.analyser),this.mediaNode.connect(this.ctx.destination)};connectMic=e=>{this.micNode||(this.micNode=this.ctx.createMediaStreamSource(e)),this.disconnectSources(),this.micNode.connect(this.analyser)};disconnectSources=()=>{try{this.mediaNode?.disconnect()}catch{}try{this.micNode?.disconnect()}catch{}};setTrackId=e=>{this.activeTrackId=e??""};toggleDebug=async()=>{if(this.debugOverlay)this.debugOverlay.toggle();else try{const{default:e}=await Zh(async()=>{const{default:t}=await import("./AnalyzerDebug-DzJEkUjj.js");return{default:t}},[]);this.debugOverlay=new e(this)}catch(e){console.error("Failed to load AnalyzerDebug",e)}};tick=(e=0)=>{if(this.disposed)return;const t=this.last?Math.min(.05,(e-this.last)/1e3):0;this.last=e,this.started&&this.update(t),this.raf=requestAnimationFrame(this.tick)};update=e=>{if(this.mode!=="live"||!this.analyser)return;const t=this.binCount;this.analyser.getByteFrequencyData(this.freqBytes),this.analyser.getByteTimeDomainData(this.waveBytes);for(let c=0;c<t;c++)this.volumeByFrequency[c]=this.freqBytes[c]/255;let n=0;for(let c=0;c<t;c++){const u=(this.waveBytes[c]-128)/128;n+=u*u}const s=Math.sqrt(n/t);this.agc=Math.max(s,this.agc*.999);const r=VE(this.activeTrackId);this.volume=Math.min(s/Math.max(this.agc,.05)*r.volumeMult,1);const o=this.volume>this.volumeSmooth?.5:.08;this.volumeSmooth+=(this.volume-this.volumeSmooth)*(1-Math.pow(1-o,e*120));let a=0;for(let c=r.startBin;c<r.endBin;c++)a+=this.freqBytes[c];a/=(r.endBin-r.startBin)*255,this.kickTimer+=e,this.kickTimer>=r.beatHold&&a>this.kickThreshold&&a>r.beatMin?(this.kick=1,this.kickThreshold=a*r.beatMult,this.kickTimer=0):this.kickTimer>r.beatHold&&(this.kickThreshold*=Math.pow(r.beatDecay,e*60),this.kickThreshold=Math.max(this.kickThreshold,r.beatMin)),this.kick=Math.max(0,this.kick-e*6),this.kickEnergy=a,this.kickHardTimer+=e,this.kickHardTimer>=r.beat2Hold&&a>this.kickHardThreshold&&a>r.beat2Min?(this.kickHard=1,this.kickHardThreshold=a*r.beat2Mult,this.kickHardTimer=0):this.kickHardTimer>r.beat2Hold&&(this.kickHardThreshold*=Math.pow(r.beat2Decay,e*60),this.kickHardThreshold=Math.max(this.kickHardThreshold,r.beat2Min)),this.kickHard=Math.max(0,this.kickHard-e*2.5),this.kickHardEnergy=a;const l=this.payload;l.volume=this.volume,l.volumeSmooth=this.volumeSmooth,l.kick=this.kick,l.kickEnergy=this.kickEnergy,l.kickThreshold=this.kickThreshold,l.kickHard=this.kickHard,l.kickHardEnergy=this.kickHardEnergy,l.kickHardThreshold=this.kickHardThreshold,this.emitAudio()};dispose=()=>{if(this.disposed=!0,this.raf&&cancelAnimationFrame(this.raf),this.onMessage&&window.removeEventListener("message",this.onMessage),this.onKey&&window.removeEventListener("keydown",this.onKey),this.gesture)for(const e of["pointerdown","keydown","touchstart"])window.removeEventListener(e,this.gesture);if(this.player?.dispose(),this.disconnectSources(),this.ctx)try{this.ctx.close()}catch{}}}class GE extends Lr{audio=new HE;kickCounter=0;targetKick=5;constructor(){super(),this.audio.onWarmup(()=>{this.trigger("audioWarmup")}),this.audio.onLoad(()=>{this.trigger("audioLoad")}),this.audio.onPlay(()=>{this.trigger("audioPlay")}),this.audio.onStop(()=>{this.trigger("audioPause")})}update(){this.audio.kick>.65&&(this.kickCounter+=1,this.kickCounter>this.targetKick&&(this.trigger("hardKick"),this.kickCounter=0,this.targetKick=Math.floor(Math.random()*3)))}}function Qh(i,e){if(e===Op)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===jl||e===pd){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===jl)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class WE extends Ni{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new YE(t)}),this.register(function(t){return new $E(t)}),this.register(function(t){return new r1(t)}),this.register(function(t){return new o1(t)}),this.register(function(t){return new a1(t)}),this.register(function(t){return new JE(t)}),this.register(function(t){return new QE(t)}),this.register(function(t){return new e1(t)}),this.register(function(t){return new t1(t)}),this.register(function(t){return new KE(t)}),this.register(function(t){return new n1(t)}),this.register(function(t){return new ZE(t)}),this.register(function(t){return new s1(t)}),this.register(function(t){return new i1(t)}),this.register(function(t){return new qE(t)}),this.register(function(t){return new l1(t)}),this.register(function(t){return new c1(t)})}load(e,t,n,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const c=_r.extractUrlBase(e);o=_r.resolveURL(c,this.path)}else o=_r.extractUrlBase(e);this.manager.itemStart(e);const a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Pc(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Wf){try{o[rt.KHR_BINARY_GLTF]=new u1(e)}catch(h){s&&s(h);return}r=JSON.parse(o[rt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new w1(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(h){case rt.KHR_MATERIALS_UNLIT:o[h]=new jE;break;case rt.KHR_DRACO_MESH_COMPRESSION:o[h]=new h1(r,this.dracoLoader);break;case rt.KHR_TEXTURE_TRANSFORM:o[h]=new d1;break;case rt.KHR_MESH_QUANTIZATION:o[h]=new f1;break;default:f.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function XE(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const rt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class qE{constructor(e){this.parser=e,this.name=rt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const u=new Ce(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],It);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ud(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new h0(u),c.distance=h;break;case"spot":c=new c0(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),zn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}}class jE{constructor(){this.name=rt.KHR_MATERIALS_UNLIT}getMaterialType(){return Ji}extendParams(e,t,n){const s=[];e.color=new Ce(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],It),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,yt))}return Promise.all(s)}}class KE{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class YE{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Me(a,a)}return Promise.all(r)}}class $E{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class ZE{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}}class JE{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new Ce(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=s.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],It)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,yt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}}class QE{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}}class e1{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Ce().setRGB(a[0],a[1],a[2],It),Promise.all(r)}}class t1{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class n1{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new Ce().setRGB(a[0],a[1],a[2],It),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,yt)),Promise.all(r)}}class i1{constructor(e){this.parser=e,this.name=rt.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}}class s1{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Zn}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}}class r1{constructor(e){this.parser=e,this.name=rt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class o1{constructor(e){this.parser=e,this.name=rt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}}class a1{constructor(e){this.parser=e,this.name=rt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}}class l1{constructor(e){this.name=rt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const l=s.byteOffset||0,c=s.byteLength||0,u=s.count,h=s.byteStride,f=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,f,s.mode,s.filter).then(function(m){return m.buffer}):o.ready.then(function(){const m=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(m),u,h,f,s.mode,s.filter),m})})}else return null}}class c1{constructor(e){this.name=rt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const c of s.primitives)if(c.mode!==xn.TRIANGLES&&c.mode!==xn.TRIANGLE_STRIP&&c.mode!==xn.TRIANGLE_FAN&&c.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],l={};for(const c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],f=c[0].count,m=[];for(const _ of h){const b=new Je,v=new F,p=new Un,D=new F(1,1,1),P=new Vm(_.geometry,_.material,f);for(let M=0;M<f;M++)l.TRANSLATION&&v.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,M),l.SCALE&&D.fromBufferAttribute(l.SCALE,M),P.setMatrixAt(M,b.compose(v,p,D));for(const M in l)if(M==="_COLOR_0"){const U=l[M];P.instanceColor=new $l(U.array,U.itemSize,U.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&_.geometry.setAttribute(M,l[M]);Rt.prototype.copy.call(P,_),this.parser.assignFinalMaterial(P),m.push(P)}return u.isGroup?(u.clear(),u.add(...m),u):m[0]}))}}const Wf="glTF",fr=12,ed={JSON:1313821514,BIN:5130562};class u1{constructor(e){this.name=rt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,fr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Wf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-fr,r=new DataView(e,fr);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const l=r.getUint32(o,!0);if(o+=4,l===ed.JSON){const c=new Uint8Array(e,fr+o,a);this.content=n.decode(c)}else if(l===ed.BIN){const c=fr+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class h1{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=rt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(const u in o){const h=lc[u]||u.toLowerCase();a[h]=o[u]}for(const u in e.attributes){const h=lc[u]||u.toLowerCase();if(o[u]!==void 0){const f=n.accessors[e.attributes[u]],m=Us[f.componentType];c[h]=m.name,l[h]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,f){s.decodeDracoFile(u,function(m){for(const _ in m.attributes){const b=m.attributes[_],v=l[_];v!==void 0&&(b.normalized=v)}h(m)},a,c,It,f)})})}}class d1{constructor(){this.name=rt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class f1{constructor(){this.name=rt.KHR_MESH_QUANTIZATION}}class Xf extends Or{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,h=(n-t)/u,f=h*h,m=f*h,_=e*c,b=_-c,v=-2*m+3*f,p=m-f,D=1-v,P=p-f+h;for(let M=0;M!==a;M++){const U=o[b+M+a],L=o[b+M+l]*u,k=o[_+M+a],H=o[_+M]*u;r[M]=D*U+P*L+v*k+p*H}return r}}const p1=new Un;class m1 extends Xf{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return p1.fromArray(r).normalize().toArray(r),r}}const xn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Us={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},td={9728:jt,9729:Pt,9984:ad,9985:Lo,9986:pr,9987:In},nd={33071:yn,33648:Vo,10497:Fs},nl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},lc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Pi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},g1={CUBICSPLINE:void 0,LINEAR:wr,STEP:Sr},il={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function v1(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ac({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Xn})),i.DefaultMaterial}function Xi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function zn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function _1(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(n){const f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;o.push(f)}if(s){const f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;a.push(f)}if(r){const f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;l.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],f=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=h),r&&(i.morphAttributes.color=f),i.morphTargetsRelative=!0,i})}function x1(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function b1(i){let e;const t=i.extensions&&i.extensions[rt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+sl(t.attributes):e=i.indices+":"+sl(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+sl(i.targets[n]);return e}function sl(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function cc(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function y1(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const S1=new Je;class w1{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new XE,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Rc(this.options.manager):this.textureLoader=new p0(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Pc(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Xi(r,a,s),zn(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(const l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(o,a)=>{const l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(const[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[rt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){n.load(_r.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const o=nl[s.type],a=Us[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Kt(c,o,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],l=nl[s.type],c=Us[s.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,f=s.byteOffset||0,m=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,_=s.normalized===!0;let b,v;if(m&&m!==h){const p=Math.floor(f/m),D="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let P=t.cache.get(D);P||(b=new c(a,p*m,s.count*m/u),P=new Nm(b,m/u),t.cache.add(D,P)),v=new wc(P,l,f%m/u,_)}else a===null?b=new c(s.count*l):b=new c(a,f,s.count*l),v=new Kt(b,l,_);if(s.sparse!==void 0){const p=nl.SCALAR,D=Us[s.sparse.indices.componentType],P=s.sparse.indices.byteOffset||0,M=s.sparse.values.byteOffset||0,U=new D(o[1],P,s.sparse.count*p),L=new c(o[2],M,s.sparse.count*l);a!==null&&(v=new Kt(v.array.slice(),v.itemSize,v.normalized)),v.normalized=!1;for(let k=0,H=U.length;k<H;k++){const E=U[k];if(v.setX(E,L[k*l]),l>=2&&v.setY(E,L[k*l+1]),l>=3&&v.setZ(E,L[k*l+2]),l>=4&&v.setW(E,L[k*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}v.normalized=_}return v})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const f=(r.samplers||{})[o.sampler]||{};return u.magFilter=td[f.magFilter]||Pt,u.minFilter=td[f.minFilter]||In,u.wrapS=nd[f.wrapS]||Fs,u.wrapT=nd[f.wrapT]||Fs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==jt&&u.minFilter!==Pt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const o=s.images[e],a=self.URL||self.webkitURL;let l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(h){c=!0;const f=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(f,m){let _=f;t.isImageBitmapLoader===!0&&(_=function(b){const v=new Ut(b);v.needsUpdate=!0,f(v)}),t.load(_r.resolveURL(h,r.path),_,void 0,m)})}).then(function(h){return c===!0&&a.revokeObjectURL(l),zn(h,o),h.userData.mimeType=o.mimeType||y1(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[rt.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[rt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const l=r.associations.get(o);o=r.extensions[rt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Cd,On.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Td,On.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ac}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let o;const a={},l=r.extensions||{},c=[];if(l[rt.KHR_MATERIALS_UNLIT]){const h=s[rt.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),c.push(h.extendParams(a,r,t))}else{const h=r.pbrMetallicRoughness||{};if(a.color=new Ce(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const f=h.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],It),a.opacity=f[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,yt)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=sn);const u=r.alphaMode||il.OPAQUE;if(u===il.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===il.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Ji&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Me(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==Ji&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Ji){const h=r.emissiveFactor;a.emissive=new Ce().setRGB(h[0],h[1],h[2],It)}return r.emissiveTexture!==void 0&&o!==Ji&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,yt)),Promise.all(c).then(function(){const h=new o(a);return r.name&&(h.name=r.name),zn(h,r),t.associations.set(h,{materials:e}),r.extensions&&Xi(s,h,r),h})}createUniqueName(e){const t=dt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[rt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return id(l,a,t)})}const o=[];for(let a=0,l=e.length;a<l;a++){const c=e[a],u=b1(c),h=s[u];if(h)o.push(h.promise);else{let f;c.extensions&&c.extensions[rt.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=id(new kn,c,t),s[u]={primitive:c,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){const u=o[l].material===void 0?v1(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let m=0,_=u.length;m<_;m++){const b=u[m],v=o[m];let p;const D=c[m];if(v.mode===xn.TRIANGLES||v.mode===xn.TRIANGLE_STRIP||v.mode===xn.TRIANGLE_FAN||v.mode===void 0)p=r.isSkinnedMesh===!0?new Fm(b,D):new Et(b,D),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),v.mode===xn.TRIANGLE_STRIP?p.geometry=Qh(p.geometry,pd):v.mode===xn.TRIANGLE_FAN&&(p.geometry=Qh(p.geometry,jl));else if(v.mode===xn.LINES)p=new Xm(b,D);else if(v.mode===xn.LINE_STRIP)p=new Cc(b,D);else if(v.mode===xn.LINE_LOOP)p=new qm(b,D);else if(v.mode===xn.POINTS)p=new jm(b,D);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+v.mode);Object.keys(p.geometry.morphAttributes).length>0&&x1(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),zn(p,r),v.extensions&&Xi(s,p,v),t.assignFinalMaterial(p),h.push(p)}for(let m=0,_=h.length;m<_;m++)t.associations.set(h[m],{meshes:e,primitives:m});if(h.length===1)return r.extensions&&Xi(s,h[0],r),h[0];const f=new Qi;r.extensions&&Xi(s,f,r),t.associations.set(f,{meshes:e});for(let m=0,_=h.length;m<_;m++)f.add(h[m]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Qt(At.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Ic(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),zn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){const h=o[c];if(h){a.push(h);const f=new Je;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ec(a,l)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let h=0,f=s.channels.length;h<f;h++){const m=s.channels[h],_=s.samplers[m.sampler],b=m.target,v=b.node,p=s.parameters!==void 0?s.parameters[_.input]:_.input,D=s.parameters!==void 0?s.parameters[_.output]:_.output;b.node!==void 0&&(o.push(this.getDependency("node",v)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",D)),c.push(_),u.push(b))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const f=h[0],m=h[1],_=h[2],b=h[3],v=h[4],p=[];for(let P=0,M=f.length;P<M;P++){const U=f[P],L=m[P],k=_[P],H=b[P],E=v[P];if(U===void 0)continue;U.updateMatrix&&U.updateMatrix();const w=n._createAnimationTracks(U,L,k,H,E);if(w)for(let N=0;N<w.length;N++)p.push(w[N])}const D=new Jl(r,void 0,p);return zn(D,s),D})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));const l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){const u=c[0],h=c[1],f=c[2];f!==null&&u.traverse(function(m){m.isSkinnedMesh&&m.bind(f,S1)});for(let m=0,_=h.length;m<_;m++)u.add(h[m]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new Ed:c.length>1?u=new Qi:c.length===1?u=c[0]:u=new Rt,u!==c[0])for(let h=0,f=c.length;h<f;h++)u.add(c[h]);if(r.name&&(u.userData.name=r.name,u.name=o),zn(u,r),r.extensions&&Xi(n,u,r),r.matrix!==void 0){const h=new Je;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const h=s.associations.get(u);s.associations.set(u,{...h})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new Qi;n.name&&(r.name=s.createUniqueName(n.name)),zn(r,n),n.extensions&&Xi(t,r,n);const o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,h=l.length;u<h;u++)r.add(l[u]);const c=u=>{const h=new Map;for(const[f,m]of s.associations)(f instanceof On||f instanceof Ut)&&h.set(f,m);return u.traverse(f=>{const m=s.associations.get(f);m!=null&&h.set(f,m)}),h};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){const o=[],a=e.name?e.name:e.uuid,l=[];Pi[r.path]===Pi.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(a);let c;switch(Pi[r.path]){case Pi.weights:c=Gs;break;case Pi.rotation:c=Ws;break;case Pi.translation:case Pi.scale:c=Xs;break;default:switch(n.itemSize){case 1:c=Gs;break;case 2:case 3:default:c=Xs;break}break}const u=s.interpolation!==void 0?g1[s.interpolation]:wr,h=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){const _=new c(l[f]+"."+Pi[r.path],t.array,h,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),o.push(_)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=cc(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof Ws?m1:Xf;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function M1(i,e,t){const n=e.attributes,s=new vi;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new F(l[0],l[1],l[2]),new F(c[0],c[1],c[2])),a.normalized){const u=cc(Us[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new F,l=new F;for(let c=0,u=r.length;c<u;c++){const h=r[c];if(h.POSITION!==void 0){const f=t.json.accessors[h.POSITION],m=f.min,_=f.max;if(m!==void 0&&_!==void 0){if(l.setX(Math.max(Math.abs(m[0]),Math.abs(_[0]))),l.setY(Math.max(Math.abs(m[1]),Math.abs(_[1]))),l.setZ(Math.max(Math.abs(m[2]),Math.abs(_[2]))),f.normalized){const b=cc(Us[f.componentType]);l.multiplyScalar(b)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;const o=new $n;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function id(i,e,t){const n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(const o in n){const a=lc[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return ot.workingColorSpace!==It&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ot.workingColorSpace}" not supported.`),zn(i,e),M1(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?_1(i,e.targets,t):i})}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.2
*/var bn=Uint8Array,Ps=Uint16Array,E1=Int32Array,qf=new bn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),jf=new bn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),T1=new bn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Kf=function(i,e){for(var t=new Ps(31),n=0;n<31;++n)t[n]=e+=1<<i[n-1];for(var s=new E1(t[30]),n=1;n<30;++n)for(var r=t[n];r<t[n+1];++r)s[r]=r-t[n]<<5|n;return{b:t,r:s}},Yf=Kf(qf,2),$f=Yf.b,C1=Yf.r;$f[28]=258,C1[258]=28;var A1=Kf(jf,0),P1=A1.b,uc=new Ps(32768);for(var St=0;St<32768;++St){var Ri=(St&43690)>>1|(St&21845)<<1;Ri=(Ri&52428)>>2|(Ri&13107)<<2,Ri=(Ri&61680)>>4|(Ri&3855)<<4,uc[St]=((Ri&65280)>>8|(Ri&255)<<8)>>1}var xr=(function(i,e,t){for(var n=i.length,s=0,r=new Ps(e);s<n;++s)i[s]&&++r[i[s]-1];var o=new Ps(e);for(s=1;s<e;++s)o[s]=o[s-1]+r[s-1]<<1;var a;if(t){a=new Ps(1<<e);var l=15-e;for(s=0;s<n;++s)if(i[s])for(var c=s<<4|i[s],u=e-i[s],h=o[i[s]-1]++<<u,f=h|(1<<u)-1;h<=f;++h)a[uc[h]>>l]=c}else for(a=new Ps(n),s=0;s<n;++s)i[s]&&(a[s]=uc[o[i[s]-1]++]>>15-i[s]);return a}),qr=new bn(288);for(var St=0;St<144;++St)qr[St]=8;for(var St=144;St<256;++St)qr[St]=9;for(var St=256;St<280;++St)qr[St]=7;for(var St=280;St<288;++St)qr[St]=8;var Zf=new bn(32);for(var St=0;St<32;++St)Zf[St]=5;var R1=xr(qr,9,1),D1=xr(Zf,5,1),rl=function(i){for(var e=i[0],t=1;t<i.length;++t)i[t]>e&&(e=i[t]);return e},An=function(i,e,t){var n=e/8|0;return(i[n]|i[n+1]<<8)>>(e&7)&t},ol=function(i,e){var t=e/8|0;return(i[t]|i[t+1]<<8|i[t+2]<<16)>>(e&7)},I1=function(i){return(i+7)/8|0},L1=function(i,e,t){return(t==null||t>i.length)&&(t=i.length),new bn(i.subarray(e,t))},U1=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Pn=function(i,e,t){var n=new Error(e||U1[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,Pn),!t)throw n;return n},O1=function(i,e,t,n){var s=i.length,r=0;if(!s||e.f&&!e.l)return t||new bn(0);var o=!t,a=o||e.i!=2,l=e.i;o&&(t=new bn(s*3));var c=function($e){var Ot=t.length;if($e>Ot){var I=new bn(Math.max(Ot*2,$e));I.set(t),t=I}},u=e.f||0,h=e.p||0,f=e.b||0,m=e.l,_=e.d,b=e.m,v=e.n,p=s*8;do{if(!m){u=An(i,h,1);var D=An(i,h+1,3);if(h+=3,D)if(D==1)m=R1,_=D1,b=9,v=5;else if(D==2){var L=An(i,h,31)+257,k=An(i,h+10,15)+4,H=L+An(i,h+5,31)+1;h+=14;for(var E=new bn(H),w=new bn(19),N=0;N<k;++N)w[T1[N]]=An(i,h+N*3,7);h+=k*3;for(var q=rl(w),$=(1<<q)-1,te=xr(w,q,1),N=0;N<H;){var ne=te[An(i,h,$)];h+=ne&15;var P=ne>>4;if(P<16)E[N++]=P;else{var J=0,ce=0;for(P==16?(ce=3+An(i,h,3),h+=2,J=E[N-1]):P==17?(ce=3+An(i,h,7),h+=3):P==18&&(ce=11+An(i,h,127),h+=7);ce--;)E[N++]=J}}var Y=E.subarray(0,L),pe=E.subarray(L);b=rl(Y),v=rl(pe),m=xr(Y,b,1),_=xr(pe,v,1)}else Pn(1);else{var P=I1(h)+4,M=i[P-4]|i[P-3]<<8,U=P+M;if(U>s){l&&Pn(0);break}a&&c(f+M),t.set(i.subarray(P,U),f),e.b=f+=M,e.p=h=U*8,e.f=u;continue}if(h>p){l&&Pn(0);break}}a&&c(f+131072);for(var be=(1<<b)-1,Re=(1<<v)-1,Be=h;;Be=h){var J=m[ol(i,h)&be],it=J>>4;if(h+=J&15,h>p){l&&Pn(0);break}if(J||Pn(2),it<256)t[f++]=it;else if(it==256){Be=h,m=null;break}else{var ht=it-254;if(it>264){var N=it-257,Qe=qf[N];ht=An(i,h,(1<<Qe)-1)+$f[N],h+=Qe}var j=_[ol(i,h)&Re],se=j>>4;j||Pn(3),h+=j&15;var pe=P1[se];if(se>3){var Qe=jf[se];pe+=ol(i,h)&(1<<Qe)-1,h+=Qe}if(h>p){l&&Pn(0);break}a&&c(f+131072);var Se=f+ht;if(f<pe){var ze=r-pe,Le=Math.min(pe,Se);for(ze+f<0&&Pn(3);f<Le;++f)t[f]=n[ze+f]}for(;f<Se;++f)t[f]=t[f-pe]}}e.l=m,e.p=Be,e.b=f,e.f=u,m&&(u=1,e.m=b,e.d=_,e.n=v)}while(!u);return f!=t.length&&o?L1(t,0,f):t.subarray(0,f)},N1=new bn(0),k1=function(i,e){return((i[0]&15)!=8||i[0]>>4>7||(i[0]<<8|i[1])%31)&&Pn(6,"invalid zlib data"),(i[1]>>5&1)==1&&Pn(6,"invalid zlib data: "+(i[1]&32?"need":"unexpected")+" dictionary"),(i[1]>>3&4)+2};function Io(i,e){return O1(i.subarray(k1(i),-4),{i:2},e,e)}var F1=typeof TextDecoder<"u"&&new TextDecoder,B1=0;try{F1.decode(N1,{stream:!0}),B1=1}catch{}class z1 extends a0{constructor(e){super(e),this.type=Hn,this.outputFormat=Xt}parse(e){const E=Math.pow(2.7182818,2.2);function w(g,d){let x=0;for(let C=0;C<65536;++C)(C==0||g[C>>3]&1<<(C&7))&&(d[x++]=C);const S=x-1;for(;x<65536;)d[x++]=0;return S}function N(g){for(let d=0;d<16384;d++)g[d]={},g[d].len=0,g[d].lit=0,g[d].p=null}const q={l:0,c:0,lc:0};function $(g,d,x,S,C){for(;x<g;)d=d<<8|Ie(S,C),x+=8;x-=g,q.l=d>>x&(1<<g)-1,q.c=d,q.lc=x}const te=new Array(59);function ne(g){for(let x=0;x<=58;++x)te[x]=0;for(let x=0;x<65537;++x)te[g[x]]+=1;let d=0;for(let x=58;x>0;--x){const S=d+te[x]>>1;te[x]=d,d=S}for(let x=0;x<65537;++x){const S=g[x];S>0&&(g[x]=S|te[S]++<<6)}}function J(g,d,x,S,C,A){const T=d;let V=0,z=0;for(;S<=C;S++){if(T.value-d.value>x)return!1;$(6,V,z,g,T);const B=q.l;if(V=q.c,z=q.lc,A[S]=B,B==63){if(T.value-d.value>x)throw new Error("Something wrong with hufUnpackEncTable");$(8,V,z,g,T);let W=q.l+6;if(V=q.c,z=q.lc,S+W>C+1)throw new Error("Something wrong with hufUnpackEncTable");for(;W--;)A[S++]=0;S--}else if(B>=59){let W=B-59+2;if(S+W>C+1)throw new Error("Something wrong with hufUnpackEncTable");for(;W--;)A[S++]=0;S--}}ne(A)}function ce(g){return g&63}function Y(g){return g>>6}function pe(g,d,x,S){for(;d<=x;d++){const C=Y(g[d]),A=ce(g[d]);if(C>>A)throw new Error("Invalid table entry");if(A>14){const T=S[C>>A-14];if(T.len)throw new Error("Invalid table entry");if(T.lit++,T.p){const V=T.p;T.p=new Array(T.lit);for(let z=0;z<T.lit-1;++z)T.p[z]=V[z]}else T.p=new Array(1);T.p[T.lit-1]=d}else if(A){let T=0;for(let V=1<<14-A;V>0;V--){const z=S[(C<<14-A)+T];if(z.len||z.p)throw new Error("Invalid table entry");z.len=A,z.lit=d,T++}}}return!0}const be={c:0,lc:0};function Re(g,d,x,S){g=g<<8|Ie(x,S),d+=8,be.c=g,be.lc=d}const Be={c:0,lc:0};function it(g,d,x,S,C,A,T,V,z){if(g==d){S<8&&(Re(x,S,C,A),x=be.c,S=be.lc),S-=8;let B=x>>S;if(B=new Uint8Array([B])[0],V.value+B>z)return!1;const W=T[V.value-1];for(;B-- >0;)T[V.value++]=W}else if(V.value<z)T[V.value++]=g;else return!1;Be.c=x,Be.lc=S}function ht(g){return g&65535}function Qe(g){const d=ht(g);return d>32767?d-65536:d}const j={a:0,b:0};function se(g,d){const x=Qe(g),C=Qe(d),A=x+(C&1)+(C>>1),T=A,V=A-C;j.a=T,j.b=V}function Se(g,d){const x=ht(g),S=ht(d),C=x-(S>>1)&65535,A=S+C-32768&65535;j.a=A,j.b=C}function ze(g,d,x,S,C,A,T){const V=T<16384,z=x>C?C:x;let B=1,W,Q;for(;B<=z;)B<<=1;for(B>>=1,W=B,B>>=1;B>=1;){Q=0;const K=Q+A*(C-W),re=A*B,me=A*W,ae=S*B,ue=S*W;let xe,ge,Fe,ke;for(;Q<=K;Q+=me){let Ke=Q;const Ve=Q+S*(x-W);for(;Ke<=Ve;Ke+=ue){const st=Ke+ae,Mt=Ke+re,Ge=Mt+ae;V?(se(g[Ke+d],g[Mt+d]),xe=j.a,Fe=j.b,se(g[st+d],g[Ge+d]),ge=j.a,ke=j.b,se(xe,ge),g[Ke+d]=j.a,g[st+d]=j.b,se(Fe,ke),g[Mt+d]=j.a,g[Ge+d]=j.b):(Se(g[Ke+d],g[Mt+d]),xe=j.a,Fe=j.b,Se(g[st+d],g[Ge+d]),ge=j.a,ke=j.b,Se(xe,ge),g[Ke+d]=j.a,g[st+d]=j.b,Se(Fe,ke),g[Mt+d]=j.a,g[Ge+d]=j.b)}if(x&B){const st=Ke+re;V?se(g[Ke+d],g[st+d]):Se(g[Ke+d],g[st+d]),xe=j.a,g[st+d]=j.b,g[Ke+d]=xe}}if(C&B){let Ke=Q;const Ve=Q+S*(x-W);for(;Ke<=Ve;Ke+=ue){const st=Ke+ae;V?se(g[Ke+d],g[st+d]):Se(g[Ke+d],g[st+d]),xe=j.a,g[st+d]=j.b,g[Ke+d]=xe}}W=B,B>>=1}return Q}function Le(g,d,x,S,C,A,T,V,z){let B=0,W=0;const Q=T,K=Math.trunc(S.value+(C+7)/8);for(;S.value<K;)for(Re(B,W,x,S),B=be.c,W=be.lc;W>=14;){const me=B>>W-14&16383,ae=d[me];if(ae.len)W-=ae.len,it(ae.lit,A,B,W,x,S,V,z,Q),B=Be.c,W=Be.lc;else{if(!ae.p)throw new Error("hufDecode issues");let ue;for(ue=0;ue<ae.lit;ue++){const xe=ce(g[ae.p[ue]]);for(;W<xe&&S.value<K;)Re(B,W,x,S),B=be.c,W=be.lc;if(W>=xe&&Y(g[ae.p[ue]])==(B>>W-xe&(1<<xe)-1)){W-=xe,it(ae.p[ue],A,B,W,x,S,V,z,Q),B=Be.c,W=Be.lc;break}}if(ue==ae.lit)throw new Error("hufDecode issues")}}const re=8-C&7;for(B>>=re,W-=re;W>0;){const me=d[B<<14-W&16383];if(me.len)W-=me.len,it(me.lit,A,B,W,x,S,V,z,Q),B=Be.c,W=Be.lc;else throw new Error("hufDecode issues")}return!0}function $e(g,d,x,S,C,A){const T={value:0},V=x.value,z=Pe(d,x),B=Pe(d,x);x.value+=4;const W=Pe(d,x);if(x.value+=4,z<0||z>=65537||B<0||B>=65537)throw new Error("Something wrong with HUF_ENCSIZE");const Q=new Array(65537),K=new Array(16384);N(K);const re=S-(x.value-V);if(J(g,x,re,z,B,Q),W>8*(S-(x.value-V)))throw new Error("Something wrong with hufUncompress");pe(Q,z,B,K),Le(Q,K,g,x,W,B,A,C,T)}function Ot(g,d,x){for(let S=0;S<x;++S)d[S]=g[d[S]]}function I(g){for(let d=1;d<g.length;d++){const x=g[d-1]+g[d]-128;g[d]=x}}function vt(g,d){let x=0,S=Math.floor((g.length+1)/2),C=0;const A=g.length-1;for(;!(C>A||(d[C++]=g[x++],C>A));)d[C++]=g[S++]}function Xe(g){let d=g.byteLength;const x=new Array;let S=0;const C=new DataView(g);for(;d>0;){const A=C.getInt8(S++);if(A<0){const T=-A;d-=T+1;for(let V=0;V<T;V++)x.push(C.getUint8(S++))}else{const T=A;d-=2;const V=C.getUint8(S++);for(let z=0;z<T+1;z++)x.push(V)}}return x}function He(g,d,x,S,C,A){let T=new DataView(A.buffer);const V=x[g.idx[0]].width,z=x[g.idx[0]].height,B=3,W=Math.floor(V/8),Q=Math.ceil(V/8),K=Math.ceil(z/8),re=V-(Q-1)*8,me=z-(K-1)*8,ae={value:0},ue=new Array(B),xe=new Array(B),ge=new Array(B),Fe=new Array(B),ke=new Array(B);for(let Ve=0;Ve<B;++Ve)ke[Ve]=d[g.idx[Ve]],ue[Ve]=Ve<1?0:ue[Ve-1]+Q*K,xe[Ve]=new Float32Array(64),ge[Ve]=new Uint16Array(64),Fe[Ve]=new Uint16Array(Q*64);for(let Ve=0;Ve<K;++Ve){let st=8;Ve==K-1&&(st=me);let Mt=8;for(let We=0;We<Q;++We){We==Q-1&&(Mt=re);for(let et=0;et<B;++et)ge[et].fill(0),ge[et][0]=C[ue[et]++],_t(ae,S,ge[et]),Ee(ge[et],xe[et]),je(xe[et]);Nt(xe);for(let et=0;et<B;++et)wt(xe[et],Fe[et],We*64)}let Ge=0;for(let We=0;We<B;++We){const et=x[g.idx[We]].type;for(let bt=8*Ve;bt<8*Ve+st;++bt){Ge=ke[We][bt];for(let kt=0;kt<W;++kt){const nn=kt*64+(bt&7)*8;T.setUint16(Ge+0*et,Fe[We][nn+0],!0),T.setUint16(Ge+2*et,Fe[We][nn+1],!0),T.setUint16(Ge+4*et,Fe[We][nn+2],!0),T.setUint16(Ge+6*et,Fe[We][nn+3],!0),T.setUint16(Ge+8*et,Fe[We][nn+4],!0),T.setUint16(Ge+10*et,Fe[We][nn+5],!0),T.setUint16(Ge+12*et,Fe[We][nn+6],!0),T.setUint16(Ge+14*et,Fe[We][nn+7],!0),Ge+=16*et}}if(W!=Q)for(let bt=8*Ve;bt<8*Ve+st;++bt){const kt=ke[We][bt]+8*W*2*et,nn=W*64+(bt&7)*8;for(let gn=0;gn<Mt;++gn)T.setUint16(kt+gn*2*et,Fe[We][nn+gn],!0)}}}const Ke=new Uint16Array(V);T=new DataView(A.buffer);for(let Ve=0;Ve<B;++Ve){x[g.idx[Ve]].decoded=!0;const st=x[g.idx[Ve]].type;if(x[Ve].type==2)for(let Mt=0;Mt<z;++Mt){const Ge=ke[Ve][Mt];for(let We=0;We<V;++We)Ke[We]=T.getUint16(Ge+We*2*st,!0);for(let We=0;We<V;++We)T.setFloat32(Ge+We*2*st,X(Ke[We]),!0)}}}function Ae(g,d,x,S,C,A){const T=new DataView(A.buffer),V=x[g],z=V.width,B=V.height,W=Math.ceil(z/8),Q=Math.ceil(B/8),K=Math.floor(z/8),re=z-(W-1)*8,me=B-(Q-1)*8,ae={value:0};let ue=0;const xe=new Float32Array(64),ge=new Uint16Array(64),Fe=new Uint16Array(W*64);for(let ke=0;ke<Q;++ke){let Ke=8;ke==Q-1&&(Ke=me);for(let Ve=0;Ve<W;++Ve)ge.fill(0),ge[0]=C[ue++],_t(ae,S,ge),Ee(ge,xe),je(xe),wt(xe,Fe,Ve*64);for(let Ve=8*ke;Ve<8*ke+Ke;++Ve){let st=d[g][Ve];for(let Mt=0;Mt<K;++Mt){const Ge=Mt*64+(Ve&7)*8;for(let We=0;We<8;++We)T.setUint16(st+We*2*V.type,Fe[Ge+We],!0);st+=16*V.type}if(W!=K){const Mt=K*64+(Ve&7)*8;for(let Ge=0;Ge<re;++Ge)T.setUint16(st+Ge*2*V.type,Fe[Mt+Ge],!0)}}}V.decoded=!0}function _t(g,d,x){let S,C=1;for(;C<64;)S=d[g.value],S==65280?C=64:S>>8==255?C+=S&255:(x[C]=S,C++),g.value++}function Ee(g,d){d[0]=X(g[0]),d[1]=X(g[1]),d[2]=X(g[5]),d[3]=X(g[6]),d[4]=X(g[14]),d[5]=X(g[15]),d[6]=X(g[27]),d[7]=X(g[28]),d[8]=X(g[2]),d[9]=X(g[4]),d[10]=X(g[7]),d[11]=X(g[13]),d[12]=X(g[16]),d[13]=X(g[26]),d[14]=X(g[29]),d[15]=X(g[42]),d[16]=X(g[3]),d[17]=X(g[8]),d[18]=X(g[12]),d[19]=X(g[17]),d[20]=X(g[25]),d[21]=X(g[30]),d[22]=X(g[41]),d[23]=X(g[43]),d[24]=X(g[9]),d[25]=X(g[11]),d[26]=X(g[18]),d[27]=X(g[24]),d[28]=X(g[31]),d[29]=X(g[40]),d[30]=X(g[44]),d[31]=X(g[53]),d[32]=X(g[10]),d[33]=X(g[19]),d[34]=X(g[23]),d[35]=X(g[32]),d[36]=X(g[39]),d[37]=X(g[45]),d[38]=X(g[52]),d[39]=X(g[54]),d[40]=X(g[20]),d[41]=X(g[22]),d[42]=X(g[33]),d[43]=X(g[38]),d[44]=X(g[46]),d[45]=X(g[51]),d[46]=X(g[55]),d[47]=X(g[60]),d[48]=X(g[21]),d[49]=X(g[34]),d[50]=X(g[37]),d[51]=X(g[47]),d[52]=X(g[50]),d[53]=X(g[56]),d[54]=X(g[59]),d[55]=X(g[61]),d[56]=X(g[35]),d[57]=X(g[36]),d[58]=X(g[48]),d[59]=X(g[49]),d[60]=X(g[57]),d[61]=X(g[58]),d[62]=X(g[62]),d[63]=X(g[63])}function je(g){const d=.5*Math.cos(.7853975),x=.5*Math.cos(3.14159/16),S=.5*Math.cos(3.14159/8),C=.5*Math.cos(3*3.14159/16),A=.5*Math.cos(5*3.14159/16),T=.5*Math.cos(3*3.14159/8),V=.5*Math.cos(7*3.14159/16),z=new Array(4),B=new Array(4),W=new Array(4),Q=new Array(4);for(let K=0;K<8;++K){const re=K*8;z[0]=S*g[re+2],z[1]=T*g[re+2],z[2]=S*g[re+6],z[3]=T*g[re+6],B[0]=x*g[re+1]+C*g[re+3]+A*g[re+5]+V*g[re+7],B[1]=C*g[re+1]-V*g[re+3]-x*g[re+5]-A*g[re+7],B[2]=A*g[re+1]-x*g[re+3]+V*g[re+5]+C*g[re+7],B[3]=V*g[re+1]-A*g[re+3]+C*g[re+5]-x*g[re+7],W[0]=d*(g[re+0]+g[re+4]),W[3]=d*(g[re+0]-g[re+4]),W[1]=z[0]+z[3],W[2]=z[1]-z[2],Q[0]=W[0]+W[1],Q[1]=W[3]+W[2],Q[2]=W[3]-W[2],Q[3]=W[0]-W[1],g[re+0]=Q[0]+B[0],g[re+1]=Q[1]+B[1],g[re+2]=Q[2]+B[2],g[re+3]=Q[3]+B[3],g[re+4]=Q[3]-B[3],g[re+5]=Q[2]-B[2],g[re+6]=Q[1]-B[1],g[re+7]=Q[0]-B[0]}for(let K=0;K<8;++K)z[0]=S*g[16+K],z[1]=T*g[16+K],z[2]=S*g[48+K],z[3]=T*g[48+K],B[0]=x*g[8+K]+C*g[24+K]+A*g[40+K]+V*g[56+K],B[1]=C*g[8+K]-V*g[24+K]-x*g[40+K]-A*g[56+K],B[2]=A*g[8+K]-x*g[24+K]+V*g[40+K]+C*g[56+K],B[3]=V*g[8+K]-A*g[24+K]+C*g[40+K]-x*g[56+K],W[0]=d*(g[K]+g[32+K]),W[3]=d*(g[K]-g[32+K]),W[1]=z[0]+z[3],W[2]=z[1]-z[2],Q[0]=W[0]+W[1],Q[1]=W[3]+W[2],Q[2]=W[3]-W[2],Q[3]=W[0]-W[1],g[0+K]=Q[0]+B[0],g[8+K]=Q[1]+B[1],g[16+K]=Q[2]+B[2],g[24+K]=Q[3]+B[3],g[32+K]=Q[3]-B[3],g[40+K]=Q[2]-B[2],g[48+K]=Q[1]-B[1],g[56+K]=Q[0]-B[0]}function Nt(g){for(let d=0;d<64;++d){const x=g[0][d],S=g[1][d],C=g[2][d];g[0][d]=x+1.5747*C,g[1][d]=x-.1873*S-.4682*C,g[2][d]=x+1.8556*S}}function wt(g,d,x){for(let S=0;S<64;++S)d[x+S]=Cu.toHalfFloat(R(g[S]))}function R(g){return g<=1?Math.sign(g)*Math.pow(Math.abs(g),2.2):Math.sign(g)*Math.pow(E,Math.abs(g)-1)}function y(g){return new DataView(g.array.buffer,g.offset.value,g.size)}function G(g){const d=g.viewer.buffer.slice(g.offset.value,g.offset.value+g.size),x=new Uint8Array(Xe(d)),S=new Uint8Array(x.length);return I(x),vt(x,S),new DataView(S.buffer)}function ee(g){const d=g.array.slice(g.offset.value,g.offset.value+g.size),x=Io(d),S=new Uint8Array(x.length);return I(x),vt(x,S),new DataView(S.buffer)}function oe(g){const d=g.viewer,x={value:g.offset.value},S=new Uint16Array(g.columns*g.lines*(g.inputChannels.length*g.type)),C=new Uint8Array(8192);let A=0;const T=new Array(g.inputChannels.length);for(let me=0,ae=g.inputChannels.length;me<ae;me++)T[me]={},T[me].start=A,T[me].end=T[me].start,T[me].nx=g.columns,T[me].ny=g.lines,T[me].size=g.type,A+=T[me].nx*T[me].ny*T[me].size;const V=we(d,x),z=we(d,x);if(z>=8192)throw new Error("Something is wrong with PIZ_COMPRESSION BITMAP_SIZE");if(V<=z)for(let me=0;me<z-V+1;me++)C[me+V]=_e(d,x);const B=new Uint16Array(65536),W=w(C,B),Q=Pe(d,x);$e(g.array,d,x,Q,S,A);for(let me=0;me<g.inputChannels.length;++me){const ae=T[me];for(let ue=0;ue<T[me].size;++ue)ze(S,ae.start+ue,ae.nx,ae.size,ae.ny,ae.nx*ae.size,W)}Ot(B,S,A);let K=0;const re=new Uint8Array(S.buffer.byteLength);for(let me=0;me<g.lines;me++)for(let ae=0;ae<g.inputChannels.length;ae++){const ue=T[ae],xe=ue.nx*ue.size,ge=new Uint8Array(S.buffer,ue.end*2,xe*2);re.set(ge,K),K+=xe*2,ue.end+=xe}return new DataView(re.buffer)}function Z(g){const d=g.array.slice(g.offset.value,g.offset.value+g.size),x=Io(d),S=g.inputChannels.length*g.lines*g.columns*g.totalBytes,C=new ArrayBuffer(S),A=new DataView(C);let T=0,V=0;const z=new Array(4);for(let B=0;B<g.lines;B++)for(let W=0;W<g.inputChannels.length;W++){let Q=0;switch(g.inputChannels[W].pixelType){case 1:z[0]=T,z[1]=z[0]+g.columns,T=z[1]+g.columns;for(let re=0;re<g.columns;++re){const me=x[z[0]++]<<8|x[z[1]++];Q+=me,A.setUint16(V,Q,!0),V+=2}break;case 2:z[0]=T,z[1]=z[0]+g.columns,z[2]=z[1]+g.columns,T=z[2]+g.columns;for(let re=0;re<g.columns;++re){const me=x[z[0]++]<<24|x[z[1]++]<<16|x[z[2]++]<<8;Q+=me,A.setUint32(V,Q,!0),V+=4}break}}return A}function Ue(g){const d=g.viewer,x={value:g.offset.value},S=new Uint8Array(g.columns*g.lines*(g.inputChannels.length*g.type*2)),C={version:Ne(d,x),unknownUncompressedSize:Ne(d,x),unknownCompressedSize:Ne(d,x),acCompressedSize:Ne(d,x),dcCompressedSize:Ne(d,x),rleCompressedSize:Ne(d,x),rleUncompressedSize:Ne(d,x),rleRawSize:Ne(d,x),totalAcUncompressedCount:Ne(d,x),totalDcUncompressedCount:Ne(d,x),acCompression:Ne(d,x)};if(C.version<2)throw new Error("EXRLoader.parse: "+Qn.compression+" version "+C.version+" is unsupported");const A=new Array;let T=we(d,x)-2;for(;T>0;){const ae=fe(d.buffer,x),ue=_e(d,x),xe=ue>>2&3,ge=(ue>>4)-1,Fe=new Int8Array([ge])[0],ke=_e(d,x);A.push({name:ae,index:Fe,type:ke,compression:xe}),T-=ae.length+3}const V=Qn.channels,z=new Array(g.inputChannels.length);for(let ae=0;ae<g.inputChannels.length;++ae){const ue=z[ae]={},xe=V[ae];ue.name=xe.name,ue.compression=0,ue.decoded=!1,ue.type=xe.pixelType,ue.pLinear=xe.pLinear,ue.width=g.columns,ue.height=g.lines}const B={idx:new Array(3)};for(let ae=0;ae<g.inputChannels.length;++ae){const ue=z[ae];for(let xe=0;xe<A.length;++xe){const ge=A[xe];ue.name==ge.name&&(ue.compression=ge.compression,ge.index>=0&&(B.idx[ge.index]=ae),ue.offset=ae)}}let W,Q,K;if(C.acCompressedSize>0)switch(C.acCompression){case 0:W=new Uint16Array(C.totalAcUncompressedCount),$e(g.array,d,x,C.acCompressedSize,W,C.totalAcUncompressedCount);break;case 1:const ae=g.array.slice(x.value,x.value+C.totalAcUncompressedCount),ue=Io(ae);W=new Uint16Array(ue.buffer),x.value+=C.totalAcUncompressedCount;break}if(C.dcCompressedSize>0){const ae={array:g.array,offset:x,size:C.dcCompressedSize};Q=new Uint16Array(ee(ae).buffer),x.value+=C.dcCompressedSize}if(C.rleRawSize>0){const ae=g.array.slice(x.value,x.value+C.rleCompressedSize),ue=Io(ae);K=Xe(ue.buffer),x.value+=C.rleCompressedSize}let re=0;const me=new Array(z.length);for(let ae=0;ae<me.length;++ae)me[ae]=new Array;for(let ae=0;ae<g.lines;++ae)for(let ue=0;ue<z.length;++ue)me[ue].push(re),re+=z[ue].width*g.type*2;B.idx[0]!==void 0&&z[B.idx[0]]&&He(B,me,z,W,Q,S);for(let ae=0;ae<z.length;++ae){const ue=z[ae];if(!ue.decoded)switch(ue.compression){case 2:let xe=0,ge=0;for(let Fe=0;Fe<g.lines;++Fe){let ke=me[ae][xe];for(let Ke=0;Ke<ue.width;++Ke){for(let Ve=0;Ve<2*ue.type;++Ve)S[ke++]=K[ge+Ve*ue.width*ue.height];ge++}xe++}break;case 1:Ae(ae,me,z,W,Q,S);break;default:throw new Error("EXRLoader.parse: unsupported channel compression")}}return new DataView(S.buffer)}function fe(g,d){const x=new Uint8Array(g);let S=0;for(;x[d.value+S]!=0;)S+=1;const C=new TextDecoder().decode(x.slice(d.value,d.value+S));return d.value=d.value+S+1,C}function De(g,d,x){const S=new TextDecoder().decode(new Uint8Array(g).slice(d.value,d.value+x));return d.value=d.value+x,S}function Oe(g,d){const x=ve(g,d),S=Pe(g,d);return[x,S]}function he(g,d){const x=Pe(g,d),S=Pe(g,d);return[x,S]}function ve(g,d){const x=g.getInt32(d.value,!0);return d.value=d.value+4,x}function Pe(g,d){const x=g.getUint32(d.value,!0);return d.value=d.value+4,x}function Ie(g,d){const x=g[d.value];return d.value=d.value+1,x}function _e(g,d){const x=g.getUint8(d.value);return d.value=d.value+1,x}const Ne=function(g,d){let x;return"getBigInt64"in DataView.prototype?x=Number(g.getBigInt64(d.value,!0)):x=g.getUint32(d.value+4,!0)+Number(g.getUint32(d.value,!0)<<32),d.value+=8,x};function O(g,d){const x=g.getFloat32(d.value,!0);return d.value+=4,x}function de(g,d){return Cu.toHalfFloat(O(g,d))}function X(g){const d=(g&31744)>>10,x=g&1023;return(g>>15?-1:1)*(d?d===31?x?NaN:1/0:Math.pow(2,d-15)*(1+x/1024):6103515625e-14*(x/1024))}function we(g,d){const x=g.getUint16(d.value,!0);return d.value+=2,x}function le(g,d){return X(we(g,d))}function ie(g,d,x,S){const C=x.value,A=[];for(;x.value<C+S-1;){const T=fe(d,x),V=ve(g,x),z=_e(g,x);x.value+=3;const B=ve(g,x),W=ve(g,x);A.push({name:T,pixelType:V,pLinear:z,xSampling:B,ySampling:W})}return x.value+=1,A}function Te(g,d){const x=O(g,d),S=O(g,d),C=O(g,d),A=O(g,d),T=O(g,d),V=O(g,d),z=O(g,d),B=O(g,d);return{redX:x,redY:S,greenX:C,greenY:A,blueX:T,blueY:V,whiteX:z,whiteY:B}}function qe(g,d){const x=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],S=_e(g,d);return x[S]}function mt(g,d){const x=ve(g,d),S=ve(g,d),C=ve(g,d),A=ve(g,d);return{xMin:x,yMin:S,xMax:C,yMax:A}}function ct(g,d){const x=["INCREASING_Y","DECREASING_Y","RANDOM_Y"],S=_e(g,d);return x[S]}function Mn(g,d){const x=["ENVMAP_LATLONG","ENVMAP_CUBE"],S=_e(g,d);return x[S]}function mn(g,d){const x=["ONE_LEVEL","MIPMAP_LEVELS","RIPMAP_LEVELS"],S=["ROUND_DOWN","ROUND_UP"],C=Pe(g,d),A=Pe(g,d),T=_e(g,d);return{xSize:C,ySize:A,levelMode:x[T&15],roundingMode:S[T>>4]}}function jr(g,d){const x=O(g,d),S=O(g,d);return[x,S]}function Jn(g,d){const x=O(g,d),S=O(g,d),C=O(g,d);return[x,S,C]}function er(g,d,x,S,C){if(S==="string"||S==="stringvector"||S==="iccProfile")return De(d,x,C);if(S==="chlist")return ie(g,d,x,C);if(S==="chromaticities")return Te(g,x);if(S==="compression")return qe(g,x);if(S==="box2i")return mt(g,x);if(S==="envmap")return Mn(g,x);if(S==="tiledesc")return mn(g,x);if(S==="lineOrder")return ct(g,x);if(S==="float")return O(g,x);if(S==="v2f")return jr(g,x);if(S==="v3f")return Jn(g,x);if(S==="int")return ve(g,x);if(S==="rational")return Oe(g,x);if(S==="timecode")return he(g,x);if(S==="preview")return x.value+=C,"skipped";x.value+=C}function Kr(g,d){const x=Math.log2(g);return d=="ROUND_DOWN"?Math.floor(x):Math.ceil(x)}function Yr(g,d,x){let S=0;switch(g.levelMode){case"ONE_LEVEL":S=1;break;case"MIPMAP_LEVELS":S=Kr(Math.max(d,x),g.roundingMode)+1;break;case"RIPMAP_LEVELS":throw new Error("THREE.EXRLoader: RIPMAP_LEVELS tiles currently unsupported.")}return S}function ki(g,d,x,S){const C=new Array(g);for(let A=0;A<g;A++){const T=1<<A;let V=d/T|0;S=="ROUND_UP"&&V*T<d&&(V+=1);const z=Math.max(V,1);C[A]=(z+x-1)/x|0}return C}function $r(){const g=this,d=g.offset,x={value:0};for(let S=0;S<g.tileCount;S++){const C=ve(g.viewer,d),A=ve(g.viewer,d);d.value+=8,g.size=Pe(g.viewer,d);const T=C*g.blockWidth,V=A*g.blockHeight;g.columns=T+g.blockWidth>g.width?g.width-T:g.blockWidth,g.lines=V+g.blockHeight>g.height?g.height-V:g.blockHeight;const z=g.columns*g.totalBytes,W=g.size<g.lines*z?g.uncompress(g):y(g);d.value+=g.size;for(let Q=0;Q<g.lines;Q++){const K=Q*g.columns*g.totalBytes;for(let re=0;re<g.inputChannels.length;re++){const me=Qn.channels[re].name,ae=g.channelByteOffsets[me]*g.columns,ue=g.decodeChannels[me];if(ue===void 0)continue;x.value=K+ae;const xe=(g.height-(1+V+Q))*g.outLineWidth;for(let ge=0;ge<g.columns;ge++){const Fe=xe+(ge+T)*g.outputChannels+ue;g.byteArray[Fe]=g.getter(W,x)}}}}}function as(){const g=this,d=g.offset,x={value:0};for(let S=0;S<g.height/g.blockHeight;S++){const C=ve(g.viewer,d)-Qn.dataWindow.yMin;g.size=Pe(g.viewer,d),g.lines=C+g.blockHeight>g.height?g.height-C:g.blockHeight;const A=g.columns*g.totalBytes,V=g.size<g.lines*A?g.uncompress(g):y(g);d.value+=g.size;for(let z=0;z<g.blockHeight;z++){const B=S*g.blockHeight,W=z+g.scanOrder(B);if(W>=g.height)continue;const Q=z*A,K=(g.height-1-W)*g.outLineWidth;for(let re=0;re<g.inputChannels.length;re++){const me=Qn.channels[re].name,ae=g.channelByteOffsets[me]*g.columns,ue=g.decodeChannels[me];if(ue!==void 0){x.value=Q+ae;for(let xe=0;xe<g.columns;xe++){const ge=K+xe*g.outputChannels+ue;g.byteArray[ge]=g.getter(V,x)}}}}}}function Zr(g,d,x){const S={};if(g.getUint32(0,!0)!=20000630)throw new Error("THREE.EXRLoader: Provided file doesn't appear to be in OpenEXR format.");S.version=g.getUint8(4);const C=g.getUint8(5);S.spec={singleTile:!!(C&2),longName:!!(C&4),deepFormat:!!(C&8),multiPart:!!(C&16)},x.value=8;let A=!0;for(;A;){const T=fe(d,x);if(T==="")A=!1;else{const V=fe(d,x),z=Pe(g,x),B=er(g,d,x,V,z);B===void 0?console.warn(`THREE.EXRLoader: Skipped unknown header attribute type '${V}'.`):S[T]=B}}if((C&-7)!=0)throw console.error("THREE.EXRHeader:",S),new Error("THREE.EXRLoader: Provided file is currently unsupported.");return S}function Jr(g,d,x,S,C,A){const T={size:0,viewer:d,array:x,offset:S,width:g.dataWindow.xMax-g.dataWindow.xMin+1,height:g.dataWindow.yMax-g.dataWindow.yMin+1,inputChannels:g.channels,channelByteOffsets:{},shouldExpand:!1,scanOrder:null,totalBytes:null,columns:null,lines:null,type:null,uncompress:null,getter:null,format:null,colorSpace:It};switch(g.compression){case"NO_COMPRESSION":T.blockHeight=1,T.uncompress=y;break;case"RLE_COMPRESSION":T.blockHeight=1,T.uncompress=G;break;case"ZIPS_COMPRESSION":T.blockHeight=1,T.uncompress=ee;break;case"ZIP_COMPRESSION":T.blockHeight=16,T.uncompress=ee;break;case"PIZ_COMPRESSION":T.blockHeight=32,T.uncompress=oe;break;case"PXR24_COMPRESSION":T.blockHeight=16,T.uncompress=Z;break;case"DWAA_COMPRESSION":T.blockHeight=32,T.uncompress=Ue;break;case"DWAB_COMPRESSION":T.blockHeight=256,T.uncompress=Ue;break;default:throw new Error("EXRLoader.parse: "+g.compression+" is unsupported")}const V={};for(const K of g.channels)switch(K.name){case"Y":case"R":case"G":case"B":case"A":V[K.name]=!0,T.type=K.pixelType}let z=!1,B=!1;if(V.R&&V.G&&V.B)T.outputChannels=4;else if(V.Y)T.outputChannels=1;else throw new Error("EXRLoader.parse: file contains unsupported data channels.");switch(T.outputChannels){case 4:A==Xt?(z=!V.A,T.format=Xt,T.colorSpace=It,T.outputChannels=4,T.decodeChannels={R:0,G:1,B:2,A:3}):A==Yi?(T.format=Yi,T.colorSpace=It,T.outputChannels=2,T.decodeChannels={R:0,G:1}):A==Zi?(T.format=Zi,T.colorSpace=It,T.outputChannels=1,T.decodeChannels={R:0}):B=!0;break;case 1:A==Xt?(z=!0,T.format=Xt,T.colorSpace=It,T.outputChannels=4,T.shouldExpand=!0,T.decodeChannels={Y:0}):A==Yi?(T.format=Yi,T.colorSpace=It,T.outputChannels=2,T.shouldExpand=!0,T.decodeChannels={Y:0}):A==Zi?(T.format=Zi,T.colorSpace=It,T.outputChannels=1,T.decodeChannels={Y:0}):B=!0;break;default:B=!0}if(B)throw new Error("EXRLoader.parse: invalid output format for specified file.");if(T.type==1)switch(C){case rn:T.getter=le;break;case Hn:T.getter=we;break}else if(T.type==2)switch(C){case rn:T.getter=O;break;case Hn:T.getter=de}else throw new Error("EXRLoader.parse: unsupported pixelType "+T.type+" for "+g.compression+".");T.columns=T.width;const W=T.width*T.height*T.outputChannels;switch(C){case rn:T.byteArray=new Float32Array(W),z&&T.byteArray.fill(1,0,W);break;case Hn:T.byteArray=new Uint16Array(W),z&&T.byteArray.fill(15360,0,W);break;default:console.error("THREE.EXRLoader: unsupported type: ",C);break}let Q=0;for(const K of g.channels)T.decodeChannels[K.name]!==void 0&&(T.channelByteOffsets[K.name]=Q),Q+=K.pixelType*2;if(T.totalBytes=Q,T.outLineWidth=T.width*T.outputChannels,g.lineOrder==="INCREASING_Y"?T.scanOrder=K=>K:T.scanOrder=K=>T.height-1-K,g.spec.singleTile){T.blockHeight=g.tiles.ySize,T.blockWidth=g.tiles.xSize;const K=Yr(g.tiles,T.width,T.height),re=ki(K,T.width,g.tiles.xSize,g.tiles.roundingMode),me=ki(K,T.height,g.tiles.ySize,g.tiles.roundingMode);T.tileCount=re[0]*me[0];for(let ae=0;ae<K;ae++)for(let ue=0;ue<me[ae];ue++)for(let xe=0;xe<re[ae];xe++)Ne(d,S);T.decode=$r.bind(T)}else{T.blockWidth=T.width;const K=Math.ceil(T.height/T.blockHeight);for(let re=0;re<K;re++)Ne(d,S);T.decode=as.bind(T)}return T}const Qr={value:0},eo=new DataView(e),ua=new Uint8Array(e),Qn=Zr(eo,e,Qr),Bn=Jr(Qn,eo,ua,Qr,this.type,this.outputFormat);if(Bn.decode(),Bn.shouldExpand){const g=Bn.byteArray;if(this.outputFormat==Xt)for(let d=0;d<g.length;d+=4)g[d+2]=g[d+1]=g[d];else if(this.outputFormat==Yi)for(let d=0;d<g.length;d+=2)g[d+1]=g[d]}return{header:Qn,width:Bn.width,height:Bn.height,data:Bn.byteArray,format:Bn.format,colorSpace:Bn.colorSpace,type:this.type}}setDataType(e){return this.type=e,this}setOutputFormat(e){return this.outputFormat=e,this}load(e,t,n,s){function r(o,a){o.colorSpace=a.colorSpace,o.minFilter=Pt,o.magFilter=Pt,o.generateMipmaps=!1,o.flipY=!1,t&&t(o,a)}return super.load(e,r,n,s)}}class V1 extends Lr{sources;loaders;items={};toLoad;loaded=0;progressWeights;constructor(e){super(),this.sources=e,this.toLoad=this.sources.length,this.progressWeights=new Array(this.toLoad).fill(0),this.setLoaders(),console.log(e)}startLoading(){this.progressWeights.fill(0),this.emitProgress(),this.sources.forEach((e,t)=>{const n=s=>{s.lengthComputable&&s.total>0&&(this.progressWeights[t]=s.loaded/s.total,this.emitProgress())};switch(console.log(e.type,e),e.type){case"gltfModel":this.loaders.gltfLoader.load(e.path,s=>{console.log("LOADED"),this.progressWeights[t]=1,this.emitProgress(),this.sourceLoaded(e,s)},n);break;case"texture":this.loaders.textureLoader.load(e.path,s=>{this.progressWeights[t]=1,this.emitProgress(),this.sourceLoaded(e,s)},n);break;case"cubeTexture":this.loaders.cubeTextureLoader.load(e.path,s=>{this.progressWeights[t]=1,this.emitProgress(),this.sourceLoaded(e,s)},n);break;case"exrTexture":this.loaders.exrLoader.load(e.path,s=>{this.progressWeights[t]=1,this.emitProgress(),this.sourceLoaded(e,s)},n);break}})}setLoaders(){this.loaders={gltfLoader:new WE,textureLoader:new Rc,cubeTextureLoader:new o0,exrLoader:new z1}}emitProgress(){const e=this.progressWeights.reduce((n,s)=>n+s,0),t=this.toLoad>0?e/this.toLoad:1;this.trigger("progress",[t])}sourceLoaded(e,t){this.items[e.name]=t,this.loaded++,this.loaded===this.toLoad&&this.trigger("ready")}getItem(e){return this.items[e]||console.log("No ressources with this name"),this.items[e]}}const H1=[{name:"jellyfish",type:"gltfModel",path:"3d/jellyfish.glb"}];class G1{experience;instance;mixer;constructor(e){this.experience=new xi,this.instance=e.scene,this.instance.scale.set(1,1,1),this.experience.scene.add(this.instance),this.mixer=new A0(this.instance),this.mixer.clipAction(e.animations[1]).play();const n=new f0(16777215,2),s=new Ud(16777215,3);s.position.set(1,2,3),this.experience.scene.add(n,s)}update(){this.mixer.update(this.experience.time.delta*.001)}}let al=null;class xi{sizes;time;scene;canvas;camera;renderer;world;debug;composer;soundManager;resources;jellyfishes;sceneManager;constructor(e){if(al)return al;al=this,this.canvas=e,this.debug=new zM,this.sizes=new Jf,this.time=new Qf,this.scene=new Yl,this.camera=new db,this.soundManager=new GE,this.sceneManager=new DE,this.renderer=new fb,this.world=new gb,this.resources=new V1(H1),this.soundManager.on("audioLoad",()=>{console.log("load"),this.resources.startLoading()}),this.soundManager.on("audioWramup",()=>{console.log("warmup"),this.composer.instance.render()}),this.resources.on("ready",()=>{const t=this.resources.getItem("jellyfish");console.log(t.animations),this.jellyfishes=new G1(t),this.composer=new FE(this.renderer.instance),this.composer&&this.composer.metaballs&&(this.composer.metaballs.targetObject=t.scene)}),this.soundManager.on("audioPlay",()=>{this.renderer.instance.setAnimationLoop(()=>this.update())}),this.soundManager.on("audioPause",()=>{this.renderer.instance.setAnimationLoop(null)})}resize(){this.renderer.resize()}update(){this.composer&&this.composer.update(),this.world.update(),this.soundManager.update(),this.jellyfishes&&this.jellyfishes.update()}destroy(){}}new xi(document.getElementById("canvas-3d"));export{X1 as t};
