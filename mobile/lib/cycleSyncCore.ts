import type {CycleEntry} from "./tracking";

/** Date equality alone is not evidence of a successful synchronization. */
export function sameCycle(a:CycleEntry,b:CycleEntry):boolean{
 return a.entry_date===b.entry_date&&a.flow===b.flow&&a.pain===b.pain
  &&a.notes===b.notes&&a.period_start===b.period_start;
}

/** Query only the unsynced dates, never a capped overview of the user's entire history. */
export function pendingBatches<T>(records:T[],batchSize=100):T[][]{
 if(!Number.isSafeInteger(batchSize)||batchSize<1||batchSize>500)throw Error("Invalid sync batch size");
 const chunks:T[][]=[];
 for(let i=0;i<records.length;i+=batchSize)chunks.push(records.slice(i,i+batchSize));
 return chunks;
}
