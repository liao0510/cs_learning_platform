import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fspl,rssi,noise,sinr,shannon,ofdmRate} from './js/components/calculator.js';
const json=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const cats=json('./data/categories.json'),subs=json('./data/subcategories.json'),topics=json('./data/topics.json');
assert.equal(cats.length,6);assert.equal(subs.length,35);assert.equal(topics.length,8);
const unique=(arr,key)=>assert.equal(new Set(arr.map(x=>x[key])).size,arr.length,`Duplicated ${key}`);
unique(cats,'id');unique(subs,'id');unique(topics,'id');
for(const sub of subs){assert(cats.find(c=>c.id===sub.category),`Invalid subcategory ${sub.id}`);}
for(const topic of topics){
 assert(cats.some(c=>c.id===topic.category));assert(subs.some(s=>s.id===topic.subcategory&&s.category===topic.category));
 const lesson=json(`./data/lessons/${topic.id}.json`);for(const key of ['id','category','subcategory','title'])assert.equal(topic[key],lesson[key]);
 assert(lesson.sections?.length);assert(lesson.quiz?.length);assert(lesson.takeaways?.length);
 for(const sec of lesson.sections)if(sec.type==='formula')assert(sec.calculator,`${topic.id}: formula must have calculator`);
}
assert.equal(readdirSync(new URL('./data/lessons/',import.meta.url)).filter(x=>x.endsWith('.json')).length,topics.length);
const near=(actual,expected,tolerance=1e-5)=>assert(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
near(fspl(5000,10),66.41940008672037,0.01);
near(noise(80,7),-87.96910013008056,0.01);
near(rssi(20,0,0,5000,10,5),-51.41940008672037,0.01);
near(sinr(-50,-80,-90),29.58607314841775,0.01);
near(shannon(20,0),20);
near(ofdmRate(234,8,.75,2,13.6),206.47058823529412,0.01);
console.log('PASS: 6 categories, 35 subcategories, 8 lessons, formula widgets, math checks.');
