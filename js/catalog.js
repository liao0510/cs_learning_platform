const PREFIX = new URL('../', import.meta.url);
const fetchJSON = async path => { const r=await fetch(new URL(path,PREFIX));if(!r.ok) throw new Error('無法讀取資料：'+path);return r.json();};
let cache;
export async function getCatalog(){if(!cache){cache=Promise.all(['data/categories.json','data/subcategories.json','data/topics.json'].map(fetchJSON)).then(([categories,subcategories,topics])=>({categories,subcategories,topics}));}return cache;}
export async function getLesson(id){if(!/^[a-z0-9-]+$/.test(id))throw new Error('無效的文章編號');return fetchJSON('data/lessons/'+id+'.json');}
export const urlFor=(page='',params={})=>{let url=new URL(page,PREFIX);for(const [k,v] of Object.entries(params))url.searchParams.set(k,v);return url.href;};
export const diffName={beginner:'初階',intermediate:'中階',advanced:'進階'};
export function el(tag,attrs={},children=[]){const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else if(k==='html')throw Error('不接受不可信 HTML');else n.setAttribute(k,String(v));}for(const child of (Array.isArray(children)?children:[children]))if(child!==null && child!==undefined)n.append(child instanceof Node?child:document.createTextNode(String(child)));return n;}
export const clear=n=>n.replaceChildren();
export function footerHeader(){const b=document.querySelector('#mobile-menu');const links=document.querySelector('#nav-links');b?.addEventListener('click',()=>{const open=links.classList.toggle('open');b.setAttribute('aria-expanded',String(open));});}
export function handleFailure(e,target){console.error(e);target.replaceChildren(el('div',{class:'notice warning',text:'內容載入失敗。請透過本機 HTTP 伺服器或 GitHub Pages 開啟網站，並確認 JSON 檔案完整。'}));}
