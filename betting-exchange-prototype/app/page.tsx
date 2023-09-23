import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-teal-500 dark:bg-teal-800 font-manrope">

      <div className="mb-6 relative rounded-full overflow-hidden"> {/* relative and overflow-hidden styles to ensure the image rounding works */}
        <Image
          src="/hero.png"
          alt="Hero image for Side₿et"
          width={800}
          height={800}
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-2 text-gold-500 dark:text-gold-300">Side₿et</h1>
        <p className="text-xl text-white dark:text-teal-300 font-semibold">Decentralize Your Bet</p>
      </div>

      <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md space-y-4">
        <p className="text-lg leading-relaxed text-teal-900 dark:text-teal-300">
          Under the New Moon in Virgo, we stand on the cusp of innovation.
        </p>
        <p className="text-lg leading-relaxed text-teal-900 dark:text-teal-300">
          Guided by the vision of Satoshi and the indomitable spirit of builders, we venture forward, forging a decentralized future.
        </p>
        <p className="text-lg leading-relaxed text-teal-900 dark:text-teal-300">
          Each line of code, a step towards financial sovereignty.
        </p>
      </div>

    </main>
  )
}
