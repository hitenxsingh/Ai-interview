'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import feedback from '../feedback/page';

function StartInterview({params}) {
    const [interviewData, setInterviewData] = useState([]);
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState([]);
    const [activeQuestion,setActiveQuestion]= useState(0);
    useEffect(()=>{
        GetInterviewDetails();
    },[]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId))

        const jsonMockResp=JSON.parse(result[0].jsonMockResp)

        // console.log(jsonMockResp)
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);

    }
  return (
    <div>
       <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* questions */}
        <QuestionsSection activeQuestion={activeQuestion} 
        mockInterviewQuestion={mockInterviewQuestion}/>

        {/* video/audio record */}
        <RecordAnswerSection activeQuestion={activeQuestion} 
        mockInterviewQuestion={mockInterviewQuestion} interviewData={interviewData}/>
       </div>

       <div className='flex justify-end gap-6'>
         {activeQuestion>0&& <Button onClick={()=>setActiveQuestion(activeQuestion-1)} >Previous Question</Button>} 
         {activeQuestion!=mockInterviewQuestion?.length-1&& <Button onClick={()=>setActiveQuestion(activeQuestion+1)} >Next Question</Button>}
         <Link href={'/dashboard/interview/'+params.interviewId+'/feedback'} >
            {activeQuestion==mockInterviewQuestion?.length-1&& <Button>End Interview</Button>} 
         </Link>  
       </div>

    </div>
  )
}

export default StartInterview
