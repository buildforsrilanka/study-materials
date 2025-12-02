import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";


export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 pb-40">
      <main className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Student Material Platform
        </h1>
        <p className="text-lg text-slate-600">
          Access and share educational resources efficiently.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">For Creators</h2>
            <p className="text-slate-500">Upload and manage learning materials.</p>
            <div className="flex gap-2 justify-center">
              {user ? (
                <>
                  <Link href="/creator/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Link href="/creator/upload">
                    <Button>Upload Material</Button>
                  </Link>

                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Create Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">For Students</h2>
            <p className="text-slate-500">Browse and access study content.</p>
            <div className="flex gap-2 justify-center">
              <Link href="/student/browse">
                <Button>Browse Materials</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
