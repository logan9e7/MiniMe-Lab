import "./globals.css";
import "../styles/learning.css";
import "../styles/shell.css";
import "../styles/navigation.css";import type {Metadata} from "next";export const metadata:Metadata={title:"MiniMe Lab",description:"Playful, privacy-first reproductive biology education"};export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
