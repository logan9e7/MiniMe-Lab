import AppNavigation from "../../components/AppNavigation";
import PregnancyTracker from "../../features/pregnancy/PregnancyTracker";
export const metadata={title:"Pregnancy Tracker | MiniMe Lab",description:"Private pregnancy timeline and check-ins for adults."};
export default function Page(){return <main className="mx-auto max-w-4xl px-4 py-8"><AppNavigation/><div className="mb-6 rounded-3xl bg-rose-50 p-6"><h1 className="text-3xl font-black">Pregnancy companion</h1><p className="mt-2 text-sm">Track what matters to you. Educational support, not medical diagnosis.</p></div><PregnancyTracker/></main>}
