import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function InterviewItemCard({interview}) {
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt}</h2>

      <div className='flex justify-between mt-2 gap-5'>
        <Link href={'/dashboard/interview/'+interview.mockId+'/feedback'}>
            <Button className='w-full' size='sm' variant='outline'>Feedback</Button>
        </Link>
        <Link href={'/dashboard/interview/'+interview.mockId+'/start'}>
            <Button className='w-full' size='sm'>Start</Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewItemCard
