import Head from "next/head";
import ListPredictions from "../components/ListPredictions";
import MainComponent from "../components/MainComponent";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dice Game 🎲 </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Navbar />
      </nav>
      <main className="flex border-2  justify-end gap-4">
        <section className="w-6/12 min-h-[80vh]">
          <MainComponent />
        </section>
        <aside className="w-3/12">
          <ListPredictions />
        </aside>
      </main>

      <footer></footer>
    </div>
  );
}
