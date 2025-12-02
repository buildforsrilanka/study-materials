'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                </>
            ) : (
                'Create Account'
            )}
        </Button>
    )
}

export default function SignupPage() {
    const [state, setState] = useState<{ message?: string; success?: boolean } | null>(null)

    async function handleSubmit(formData: FormData) {
        setState(null)
        const result = await signup(null, formData)
        if (result) {
            setState({ message: result.message, success: result.success })
        }
    }

    return (
        <div className="w-full flex items-center justify-center min-h-screen py-10 px-4 pb-20">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="mb-4">
                        <BackButton href="/" label="Back to Home" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state?.message && (
                        <Alert variant={state.success ? "default" : "destructive"} className="mb-4">
                            <AlertTitle>{state.success ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                            <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                    <div>
                        Already have an account?{' '}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
