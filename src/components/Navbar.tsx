'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { LockKeyhole } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className='fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-[#00DF9A]/20'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-6'>
                <Link 
                    href="/" 
                    className='flex items-center space-x-2 group'
                >
                    <LockKeyhole className="w-6 h-6 text-[#00DF9A] group-hover:text-[#00DF9A]/80 transition-colors" />
                    <span className='text-xl font-bold text-[#00DF9A] group-hover:text-[#00DF9A]/80 transition-all'>
                        Mystery Message
                    </span>
                </Link>

                <div className='flex items-center mt-4 md:mt-0 space-x-4'>
                    {session ? (
                        <>
                            <span className='text-gray-300'>
                                Welcome, {' '}
                                <span className='text-[#00DF9A] font-medium'>
                                    {user?.username || user?.email}
                                </span>
                            </span>
                            <Button 
                                onClick={() => signOut()}
                                className='bg-black hover:bg-black/80 text-[#00DF9A] border border-[#00DF9A]/50 hover:border-[#00DF9A] transition-all duration-300'
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button 
                                className='bg-[#00DF9A] hover:bg-[#00DF9A]/80 text-black font-semibold border-none transition-all duration-300'
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar