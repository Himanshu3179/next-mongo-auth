"use client"
import React from 'react'
import { Button } from './button'
import { signIn, signOut } from 'next-auth/react'

export const SignInButton = () => {
    return (
        <Button
            onClick={() => signIn()}
        >
            Sign In
        </Button>
    )
}

export const SignOutButton = () => {
    return (
        <Button
            onClick={() => signOut({
                redirect: true,
                callbackUrl: '/sign-in'
            })}
            variant='destructive'
        >
            Sign Out
        </Button>
    )
}
