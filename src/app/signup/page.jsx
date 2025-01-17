"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth.jsx";
import Loading from "@/components/Loading.jsx";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [division, setDivision] = useState("");
  const [batch, setBatch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { signUp, signInWithGoogle, addUser, loading, loginuser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, name, division, batch, branch, rollNumber);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to create an account");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign up with Google");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (loginuser) {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="branch" className="sr-only">
                Branch
              </label>
              <input
                id="branch"
                name="branch"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="roll-number" className="sr-only">
                Roll Number
              </label>
              <input
                id="roll-number"
                name="roll-number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="division" className="sr-only">
                Division
              </label>
              <input
                id="division"
                name="division"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Division"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="batch" className="sr-only">
                Batch
              </label>
              <input
                id="batch"
                name="batch"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-200 border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                placeholder="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-zinc-200 border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border-zinc-800"
            >
              Sign up
            </button>
          </div>
        </form>
        {/* <div>
          <button
            onClick={handleGoogleSignUp}
            className="group relative w-full flex justify-center py-2 px-4 border border-zinc-200 border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:border-zinc-800"
          >
            Sign up with Google
          </button>
        </div> */}
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        <div className="text-sm text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
