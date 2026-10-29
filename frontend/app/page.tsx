"use client";
import AppNavigation from "../components/AppNavigation";
import HomeHero from "../components/home/HomeHero";
import QuickActions from "../components/home/QuickActions";
import ScienceGuides from "../components/home/ScienceGuides";
import HomeFooter from "../components/home/HomeFooter";
import ScienceArcade from "../components/home/ScienceArcade";
import FertilityLab from "../features/fertility/FertilityLab";
import TwinsLab from "../features/genetics/TwinsLab";
import PeriodPlayground from "../features/periods/PeriodPlayground";
import BirthdayLab from "../features/pregnancy/BirthdayLab";
import SafeSexLab from "../features/safe-sex/SafeSexLab";
import PregnancyJourney from "../features/pregnancy/PregnancyJourney";
import HormoneExplorer from "../features/education/HormoneExplorer";
import DiscoveryCards from "../features/education/DiscoveryCards";
import ScienceLibrary from "../features/education/ScienceLibrary";
import BiologyExplorer from "../features/education/BiologyExplorer";
import ScienceQuiz from "../features/education/ScienceQuiz";
import ScienceCompanion from "../features/education/ScienceCompanion";
import GeneticsPlayground from "../features/genetics/GeneticsPlayground";
import FamilyDiscoveryLab from "../features/education/FamilyDiscoveryLab";
export default function Home(){
return <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:py-8"><a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3" href="#family-discovery">Skip to interactive labs</a><AppNavigation/>
<HomeHero/><QuickActions/>
<ScienceGuides/><FamilyDiscoveryLab/><div className="mt-8" id="hormone-explorer"><HormoneExplorer/></div><BiologyExplorer/><GeneticsPlayground/><ScienceCompanion/><ScienceQuiz/><ScienceArcade/><ScienceLibrary/><HomeFooter/></main>}
