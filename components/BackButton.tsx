import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
    href: string
    label?: string
    className?: string
}

export default function BackButton({ href, label = 'Back', className }: BackButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn('gap-2 pl-0 hover:bg-transparent hover:text-slate-900 text-slate-500', className)}
            asChild
        >
            <Link href={href}>
                <ArrowLeft className="h-4 w-4" />
                {label}
            </Link>
        </Button>
    )
}
