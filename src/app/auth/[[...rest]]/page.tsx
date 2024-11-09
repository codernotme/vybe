"use client";
import AuthCard from "./card";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <main>
        <section id="join" className="py-20 px-4 bg-gray-900">
          <div className="container mx-auto max-w-md text-center">
            <h3 className="text-4xl font-bold mb-6 text-blue-400">
              Ready to VYBE?
            </h3>
            <p className="mb-8 text-gray-300 text-xl">
              Join VYBE now and let your voice resonate!
            </p>
            <div className="flex justify-center">
              <AuthCard />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
