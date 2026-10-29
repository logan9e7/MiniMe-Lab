import test from 'node:test';
import assert from 'node:assert/strict';
import {privateHistory} from './privateHistory';

test('signout clears history and late results cannot restore prior user records',async()=>{
 let finish!:(x:string[])=>void;let items:string[]=[];
 const h=privateHistory(()=>new Promise<string[]>(r=>{finish=r}),x=>{items=x},()=>{});
 h.changeOwner('A');const pending=h.refresh();h.changeOwner(null);
 finish(['private A']);await pending;assert.deepEqual(items,[]);
});
test('account switch prevents prior response overwriting new account history',async()=>{
 const finish:Array<(x:string[])=>void>=[];let items:string[]=[];
 const h=privateHistory(()=>new Promise<string[]>(r=>finish.push(r)),x=>{items=x},()=>{});
 h.changeOwner('A');const a=h.refresh();h.changeOwner('B');const b=h.refresh();
 finish[1](['B']);await b;finish[0](['A']);await a;assert.deepEqual(items,['B']);
});
test('unmounted histories ignore results and errors',async()=>{
 let reject!:(x:Error)=>void;let errors=0;
 const h=privateHistory(()=>new Promise<string[]>((_r,j)=>{reject=j}),()=>{},()=>{errors++});
 h.changeOwner('A');const p=h.refresh();h.dispose();reject(Error('old'));await p;assert.equal(errors,0);
});
