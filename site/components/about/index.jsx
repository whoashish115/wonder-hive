import { globals } from '@/store/global'
import { sentenceTools, textTools } from '@/utils/tools'
import Link from 'next/link'
import React from 'react'
import { HiCode } from 'react-icons/hi'

const About = () => {
  return (
    <div className='w-full h-full flex flex-col bg-background-light p-6 justify-center items-center'>
      <div className='text-3xl font-semibold text-center flex-wrap items-center justify-center flex gap-2 '>
        <HiCode className='text-4xl flex-shrink'/>Developed By <Link href={globals.website}><span className='animate-pulse underline cursor-pointer font-bold text-primary-main'>{globals.author}</span></Link>
      </div>
      <ul className='p-4 flex flex-col '>
       {globals.features.map((f,i)=>(
        <li className='text-text-main list-disc' key={i}>
          {textTools.capitalize(f)}
        </li>
       )) }
      </ul>
    </div>
  )
}

export default About