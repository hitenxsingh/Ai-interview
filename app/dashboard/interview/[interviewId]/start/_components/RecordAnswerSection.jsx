'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Heading2, Mic } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { UserAnswer } from '@/utils/schema'


function RecordAnswerSection({activeQuestion, 
    mockInterviewQuestion, interviewData}) {

    const [userAnswer,SetUserAnswer]=useState('')
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    
    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>(
            SetUserAnswer(prev=>prev+result?.transcript)
        ))
      },[results])

      useEffect(()=>{
        if(!isRecording&&userAnswer.length>10)
        {
            UpdateUserAnswer();
        }
        // if(userAnswer?.length<10){
        //     toast('error while saving your answer, Please record again')
        //     setLoading(false)
        //     return;
        // }
      },[userAnswer])

      const StartStopRecording=async()=>{
        if(isRecording){
            stopSpeechToText()
        }
        else{
            startSpeechToText()
        }
      }

      const UpdateUserAnswer=async()=>{

        setLoading(true)
        // console.log(userAnswer)
        const feedBackPromt="question"+mockInterviewQuestion[activeQuestion]?.question+", user answer: "+userAnswer+", Depends on question and user answerfor given interview question "+
        " please give a rating and feedback as area of improvment if any "+" in just three to five lines to improve it in JSON format with rating and feedback as json field . just give only this in json format nothing more"

        const result=await chatSession.sendMessage(feedBackPromt)

        const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');

        console.log(mockJsonResp)

        const jsonFeedbackResp=JSON.parse(mockJsonResp)

        const resp=await db.insert(UserAnswer).values({
            question:mockInterviewQuestion[activeQuestion]?.question,
            correctAns:mockInterviewQuestion[activeQuestion]?.answer,
            mockIdRef:interviewData.mockId,
            userAns:userAnswer,
            feedback:jsonFeedbackResp?.feedback,
            rating:jsonFeedbackResp?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')
        })
        if(resp){
            toast('User answer recorded successfully')
            setResults([]);
        }
        setResults([]);
        SetUserAnswer('')
        setLoading(false)
      }

  return (
    <div className='flex flex-col items-center'>
    <div className='flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20 '>
        <img className='absolute' src="/webcam.png" alt="" width={200} height={200}/>
        <Webcam mirrored={true}
         style={{height:300,width:'100%',}}
        />

    </div>
        <Button disabled={loading} variant='outline' className='my-10 ' onClick={StartStopRecording} >
            {isRecording?<h2 className='text-red-600 flex items-center'><Mic/> Recording...</h2>:<h2 className='text-primary flex items-center'><Mic/> Record Answer</h2>}
            </Button>
          
    </div>
  )
}

export default RecordAnswerSection
