import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion,activeQuestion}) {

  const textToSpeach=(text)=>{
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('Your browser does not support text to speech')
    }
  }

  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question,index)=>(
                <h2 className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer
                ${activeQuestion==index?' text-white bg-primary ':'bg-secondary'}`}>Question #{index+1}</h2>
            ))}

        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestion]?.question}</h2>
        <Volume2 className='hover:scale-105 cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestion]?.question)} />

        {/* Notes section */}
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
          <h2 className='flex gap-2 items-center text-primary'>
              <Lightbulb/>
              <strong>Note:</strong>
          </h2>
          <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_INFO}</h2>
        </div>
    </div>
  )
}

export default QuestionsSection
