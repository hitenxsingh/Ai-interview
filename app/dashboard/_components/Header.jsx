"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path=usePathname();
    useEffect(()=>{

    },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <img src={'/logo.svg'} width={50} height={50} alt='logo' />
      <ul className=' hidden md:flex gap-6'>
        <li  className={`hover:text-primary hover:font-bold transition-all cursor-pointer${path=='/dashboard'&&' font-bold text-primary '}`}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer${path=='/dashboard/question'&&' font-bold text-primary '}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer${path=='/dashboard/upgrade'&&'  font-bold text-primary '}`}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer${path=='/dashboard/how'&&'  font-bold text-primary '}`}>How it works?</li>
      </ul>
      
      <UserButton/>
    </div>
  )
}

export default Header