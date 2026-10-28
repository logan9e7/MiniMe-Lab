import PeriodDiary from "../../../features/periods/PeriodDiary";
export const metadata={title:"Private Period Diary | MiniMe Lab",description:"Track periods and symptoms locally in your browser."};
export default function DiaryPage(){return <main className="mx-auto max-w-4xl px-4 py-8"><nav className="mb-6"><a href="/" className="font-bold text-violet-800 hover:underline">← MiniMe Lab</a></nav><PeriodDiary/></main>}
