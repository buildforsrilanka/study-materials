import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { UserNav } from './UserNav'
import Image from 'next/image'
import { version } from '@/package.json'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                    Student Material Platform
                    <span className="text-xs text-muted-foreground font-normal border px-1.5 py-0.5 rounded-md">v{version}</span>
                </Link>

                <nav className="flex items-center gap-4">
                    {user && (
                        <UserNav email={user.email!} name={user.user_metadata?.full_name} />
                    )}
                </nav>
            </div>
        </header>
    )
}
