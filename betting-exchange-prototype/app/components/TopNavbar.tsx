// components/TopNavbar.tsx

export default function TopNavbar() {
    return (
        <nav className="bg-teal-700 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-4">
                {/* Logo or Brand Name */}
                <h1 className="text-2xl font-extrabold text-gold-500 dark:text-gold-300">Side₿et</h1>
            </div>
            <div className="space-x-4">
                <a href="/" className="text-white hover:underline">Home</a>
                <a href="/about" className="text-white hover:underline">About</a>
                {/* ... other links */}
            </div>
        </nav>
    );
}
