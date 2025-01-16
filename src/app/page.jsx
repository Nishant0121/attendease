import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users, Clock, School } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                Simplify Your Timetable Management
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
                Effortlessly manage batch schedules, track attendance, and
                optimize your academic resources.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/signup"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
              Features that Make a Difference
            </h2>
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CalendarDays className="h-8 w-8 text-indigo-600" />}
                title="Multi-Day Scheduling"
                description="Manage schedules from Monday to Friday with ease."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-indigo-600" />}
                title="Multiple Batch Support"
                description="Handle schedules for S21, S22, S23 batches simultaneously."
              />
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-indigo-600" />}
                title="Detailed Time Slots"
                description="Assign precise time slots for each subject and activity."
              />
              <FeatureCard
                icon={<School className="h-8 w-8 text-indigo-600" />}
                title="Room Assignment"
                description="Efficiently allocate rooms for lectures, tutorials, and projects."
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to Optimize Your Academic Schedule?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join AttendEase today and experience the future of timetable
              management.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <p>&copy; 2025 AttendEase. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-indigo-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
