import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fspl,rssi,noise,sinr,shannon,ofdmRate,cidrInfo,fcfsWait,pageSplit,idealAirtime,backhaulBottleneck,qamBits,dbmToMw,allocationBytes,binaryWorstSteps} from './js/components/calculator.js';
const json=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const cats=json('./data/categories.json'),subs=json('./data/subcategories.json'),topics=json('./data/topics.json');
assert.equal(cats.length,6);assert.equal(subs.length,35);assert.equal(topics.length,43);
const unique=(arr,key)=>assert.equal(new Set(arr.map(x=>x[key])).size,arr.length,`Duplicated ${key}`);
unique(cats,'id');unique(subs,'id');unique(topics,'id');
for(const sub of subs){assert(cats.find(c=>c.id===sub.category),`Invalid subcategory ${sub.id}`);}
for(const topic of topics){
 assert(cats.some(c=>c.id===topic.category));assert(subs.some(s=>s.id===topic.subcategory&&s.category===topic.category));
 const lesson=json(`./data/lessons/${topic.id}.json`);for(const key of ['id','category','subcategory','title'])assert.equal(topic[key],lesson[key]);
 assert(lesson.sections?.length>=3);assert(lesson.quiz?.length);assert(lesson.takeaways?.length>=3);assert(lesson.sections.some(s=>s.title.includes('範例')||s.type==='demo'||s.type==='formula'||s.type==='table'||s.type==='code'||s.type==='diagram'),`Missing example: ${topic.id}`);
 for(const sec of lesson.sections)if(sec.type==='formula')assert(sec.calculator,`${topic.id}: formula must have calculator`);
}
for(const s of subs)assert(topics.some(t=>t.category===s.category&&t.subcategory===s.id),`Empty subcategory ${s.id}`);
assert.equal(readdirSync(new URL('./data/lessons/',import.meta.url)).filter(x=>x.endsWith('.json')).length,topics.length);
const near=(actual,expected,tolerance=1e-5)=>assert(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
near(fspl(5000,10),66.41940008672037,0.01);
near(noise(80,7),-87.96910013008056,0.01);
near(rssi(20,0,0,5000,10,5),-51.41940008672037,0.01);
near(sinr(-50,-80,-90),29.58607314841775,0.01);
near(shannon(20,0),20);
near(ofdmRate(234,8,.75,2,13.6),206.47058823529412,0.01);
assert.equal(cidrInfo(26).usable,62);assert.equal(cidrInfo(31).usable,2);
near(fcfsWait(5,3,2).average,13/3);
assert.deepEqual(pageSplit(12345,4096),{page:3,offset:57});
near(idealAirtime(12000,300),40);near(backhaulBottleneck(300,120,200),120);
near(qamBits(256),8);near(dbmToMw(10),10);near(allocationBytes(100,4),400);assert.equal(binaryWorstSteps(7),3);
console.log('PASS: 6 categories, 35 populated subcategories, 43 lessons, formula widgets, math checks.');
