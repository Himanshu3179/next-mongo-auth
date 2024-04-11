import { ListTodo } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInButton, SignOutButton } from './ui/NavButtons'

export const Navbar = async () => {
    const session = await getServerSession(authOptions);
    return (
        <div className='w-full h-12 bg-neutral-800 items-center px-6
             text-white
            grid grid-cols-3 gap-5
            fixed top-0 left-0
        '>
            <div className='flex justify-start cursor-pointer '>
                <Link href='/'>
                    <ListTodo />
                </Link>

            </div>
            <div className='flex gap-5 justify-center'>
                <Link href='/'>Home </Link>
                <Link href='/about'>About</Link>
                <Link href='/contact'>Contact Us</Link>
            </div>
            <div className='flex justify-end'>
                {
                    session ? (
                        <SignOutButton />
                    ) : (
                        <SignInButton />
                    )
                }
            </div>
        </div>
    )
}