import {el} from '../catalog.js';
const log10=Math.log10;
const mw=x=>10**(x/10);
export const fspl=(fMHz,dm)=>32.44+20*log10(fMHz)+20*log10(dm/1000);
export const rssi=(power,gTx,gRx,fMHz,dm,loss)=>power+gTx+gRx-fspl(fMHz,dm)-loss;
export const noise=(bMHz,nf)=>-174+10*log10(bMHz*1e6)+nf;
export const sinr=(signal,interference,noiseDbm)=>10*log10(mw(signal)/(mw(interference)+mw(noiseDbm)));
export const shannon=(bMHz,sinrDb)=>bMHz*Math.log2(1+10**(sinrDb/10));
export const ofdmRate=(nsd,bpsc,codeRate,streams,symbolUs)=>nsd*bpsc*codeRate*streams/symbolUs; // bit/us = Mbps
export const cidrInfo=(prefix)=>({total:2**(32-prefix),usable:prefix<=30?Math.max(0,2**(32-prefix)-2):prefix===31?2:1});
export const fcfsWait=(a,b,c)=>({p1:0,p2:a,p3:a+b,average:(2*a+b)/3,turnaround:(a+(a+b)+(a+b+c))/3});
export const pageSplit=(address,pageSize)=>({page:Math.floor(address/pageSize),offset:address%pageSize});
export const idealAirtime=(kbit,mbps)=>kbit/mbps; // kbit / Mbps => ms
export const backhaulBottleneck=(a,b,c)=>Math.min(a,b,c);
export const qamBits=m=>Math.log2(m);
export const dbmToMw=dbm=>10**(dbm/10);
export const allocationBytes=(count,bytes)=>count*bytes;
export const binaryWorstSteps=n=>Math.ceil(Math.log2(n+1));
const definitions={
 cidr:{name:'IPv4 CIDR 主機數',fields:[['prefix','前綴長度 (bit)',26,0,32]],run:v=>[cidrInfo(v.prefix).usable,'個可用位址（一般子網；/31 /32 為特殊用途）'],note:'輸入 0–32 的整數。/31 點對點可使用兩個位址；/32 代表單一主機位址。一般 /0–/30 扣除網路與廣播位址。'},
 schedule:{name:'FCFS 等待時間（所有工作同時到達）',fields:[['a','P1 CPU Burst (時間單位)',5,0,100000],['b','P2 CPU Burst (時間單位)',3,0,100000],['c','P3 CPU Burst (時間單位)',2,0,100000]],run:v=>[fcfsWait(v.a,v.b,v.c).average,'時間單位（平均等待）'],note:'固定順序 P1→P2→P3，所有程序於 t=0 到達，非搶先、無切換成本，不考慮 I/O。'},
 paging:{name:'虛擬位址拆分 Page / Offset',fields:[['address','虛擬位址 (Byte)',12345,0,4294967295],['size','頁大小 (Byte)',4096,1,65536]],run:v=>[pageSplit(v.address,v.size).offset,'Byte（Page Offset）'],note:'此處只顯示頁內位移；頁號為 floor(address/pageSize)。頁大小需為二的冪次，不代表已取得實體位址。'},
 'log-steps':{name:'二分搜尋最壞比較次數（模型）',fields:[['n','已排序元素數量 (筆)',100,1,1000000000]],run:v=>[binaryWorstSteps(v.n),'次'],note:'以典型二分搜尋在排序陣列中最多比較 ceil(log2(n+1)) 次作為教學估計。'},
 'wifi-airtime':{name:'理想 Payload 傳輸時間',fields:[['kbits','Payload 大小 (kbit)',12000,.001,1e10],['rate','PHY 速率 (Mbps)',300,.001,100000]],run:v=>[idealAirtime(v.kbits,v.rate),'ms'],note:'忽略前導碼、競爭、ACK、MAC Header 和重傳；不是真實 Wi-Fi Airtime。'},
 backhaul:{name:'三跳路徑最小容量上界',fields:[['a','第一跳容量 (Mbps)',300,.001,100000],['b','第二跳容量 (Mbps)',120,.001,100000],['c','第三跳容量 (Mbps)',200,.001,100000]],run:v=>[backhaulBottleneck(v.a,v.b,v.c),'Mbps'],note:'只取路徑最小容量，是不計多跳同頻 airtime 競爭的上界；不等於端到端 Throughput。'},
 qam:{name:'M-QAM 每符號承載位元數',fields:[['m','調變階數 M',256,4,4096]],run:v=>[qamBits(v.m),'bit/符號'],note:'M 必須是 4、16、64、256、1024 或 4096 等受支援的二次方階數；不計編碼與錯誤率。'},
 'dbm-mw':{name:'dBm 轉線性功率',fields:[['dbm','功率 (dBm)',0,-200,100]],run:v=>[dbmToMw(v.dbm),'mW'],note:'兩個功率相加請先轉成 mW，再把加總結果換算為 dBm。'},
 allocation:{name:'陣列資料容量估算',fields:[['count','元素數量',100,0,1e9],['bytes','單一元素大小 (Byte)',4,1,100000]],run:v=>[allocationBytes(v.count,v.bytes),'Byte'],note:'純元素資料的位元組數；不含 allocator header 或 padding，實際 malloc 仍須檢查 count * bytes 是否溢位。'},
 fspl:{name:'自由空間損耗 FSPL',fields:[['f','頻率 (MHz)',5000,1,100000],['d','距離 (m)',10,.01,1000000]],run:v=>[fspl(v.f,v.d),'dB'],note:'遠場、自由空間假設；此數值不包含牆壁或多徑損失。'},
 rssi:{name:'接收功率 RSSI 近似',fields:[['p','發射功率 (dBm)',20,-100,100],['gt','發射天線增益 (dBi)',0,-50,100],['gr','接收天線增益 (dBi)',0,-50,100],['f','頻率 (MHz)',5000,1,100000],['d','距離 (m)',10,.01,1000000],['l','額外損耗 (dB)',5,0,300]],run:v=>[rssi(v.p,v.gt,v.gr,v.f,v.d,v.l),'dBm'],note:'簡化鏈路預算；設備實際 RSSI 讀數可能不同。'},
 noise:{name:'熱雜訊功率',fields:[['b','頻寬 (MHz)',80,.001,10000],['nf','Noise Figure (dB)',7,0,80]],run:v=>[noise(v.b,v.nf),'dBm'],note:'約 290K、等效矩形頻寬近似；−174 dBm/Hz 熱雜訊底。'},
 sinr:{name:'SINR：訊號/(干擾+雜訊)',fields:[['s','訊號 S (dBm)',-50,-200,100],['i','合計干擾 I (dBm)',-80,-200,100],['n','雜訊 N (dBm)',-88,-200,100]],run:v=>[sinr(v.s,v.i,v.n),'dB'],note:'S、I、N 先轉成 mW；I 為所有干擾源總合（以 dBm 表示）。若需多個干擾源，先在 mW 加總。'},
 shannon:{name:'Shannon 理論容量上界',fields:[['b','頻寬 (MHz)',20,.001,10000],['s','SINR (dB)',20,-100,100]],run:v=>[shannon(v.b,v.s),'Mbps'],note:'理想化模型之容量上界；非 Wi-Fi PHY 速率或實際 Throughput。'},
 'ofdm-rate':{name:'OFDM PHY 速率教學模型',fields:[['nsd','資料子載波數 N_SD',234,1,100000],['bpsc','每子載波位元數 N_BPSC',8,1,12],['rate','編碼率 R_c',.75,.01,1],['ss','Spatial Streams N_SS',2,1,16],['ts','符號時間 T (μs)',13.6,.1,1000]],run:v=>[ofdmRate(v.nsd,v.bpsc,v.rate,v.ss,v.ts),'Mbps'],note:'預設示例類似 HE 20 MHz 242-tone RU、256-QAM、3/4、2SS、0.8 μs GI 的理想資料位元率。非完整 IEEE 速率查表，不含前導碼、MAC、重傳或資源競爭。'}
};
export function renderCalculator(id){const def=definitions[id];if(!def)return el('div',{class:'notice warning',text:'找不到計算器：'+id});const box=el('div',{class:'calculator'});box.append(el('div',{class:'calculator-header'},[el('span',{class:'calculator-title',text:'∑ '+def.name}),el('span',{class:'chip green',text:'互動計算'})]));const grid=el('div',{class:'calc-grid'}),controls={};for(const [key,label,initial,min,max] of def.fields){const idAttr='calc-'+id+'-'+key;const inp=el('input',{id:idAttr,type:'number',step:'any',value:initial,min,max,'aria-label':label});controls[key]={inp,initial,min,max};grid.append(el('div',{class:'field'},[el('label',{for:idAttr,text:label}),inp]));}box.append(grid);const result=el('div',{class:'calc-result',role:'status','aria-live':'polite'});const error=el('div',{class:'calc-error',role:'alert'});const calc=()=>{error.textContent='';result.textContent='';let values={};for(const [key,c] of Object.entries(controls)){const raw=c.inp.value.trim(),v=Number(raw);if(!raw||!Number.isFinite(v)||v<c.min||v>c.max){error.textContent=`請檢查「${def.fields.find(f=>f[0]===key)[1]}」：有效範圍 ${c.min} 至 ${c.max}。`;return;}values[key]=v;}if(id==='cidr' && !Number.isInteger(values.prefix)){error.textContent='CIDR 前綴須為整數。';return;}
 if(id==='log-steps' && !Number.isInteger(values.n)){error.textContent='元素數量須為正整數。';return;}
 if(id==='paging' && (!Number.isSafeInteger(values.address)||!Number.isSafeInteger(values.size)||!Number.isInteger(Math.log2(values.size)))){error.textContent='虛擬位址需為非負整數，頁大小必須是 2 的整數次方。';return;}
 if(id==='qam' && ![4,16,64,256,1024,4096].includes(values.m)){error.textContent='請選擇 4、16、64、256、1024 或 4096。';return;}
 if(id==='allocation' && (!Number.isSafeInteger(values.count)||!Number.isSafeInteger(values.bytes)||!Number.isSafeInteger(values.count*values.bytes))){error.textContent='元素數量與大小必須為安全整數，乘積不可溢位。';return;}
 if(id==='ofdm-rate' && (!Number.isInteger(values.nsd)||!Number.isInteger(values.bpsc)||!Number.isInteger(values.ss))){error.textContent='子載波數、位元數及空間串流數必須為整數。';return;}const [value,unit]=def.run(values);if(!Number.isFinite(value)){error.textContent='計算結果無效，請檢查輸入。';return;}result.textContent=`計算結果：${value.toLocaleString('zh-TW',{maximumFractionDigits:3})} ${unit}`;};const reset=()=>{for(const c of Object.values(controls))c.inp.value=c.initial;calc();};box.append(el('div',{class:'calc-actions'},[el('button',{class:'btn primary small',type:'button',text:'開始計算'}),el('button',{class:'btn secondary small',type:'button',text:'重設數值'})]));box.querySelector('.primary').addEventListener('click',calc);box.querySelector('.secondary').addEventListener('click',reset);for(const c of Object.values(controls))c.inp.addEventListener('keydown',e=>{if(e.key==='Enter')calc();});box.append(result,error,el('div',{class:'calc-footnote',text:'模型假設：'+def.note}));calc();return box;}
