'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import React, { useState } from 'react'
import { LoaderCircle, Target } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";


  
  function AddNewInterview() {
    const [openDailog, setOpenDialog] = useState(false);
    const [jobPostion,setJobPosition] = useState();
    const [jobDesc, setJobDesc] =useState();
    const [jobExperience,setJobExperience]= useState();
    const [loading,setloading] =useState(false);
    const [jsonResponse,setJsonResponse] =useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
      setloading(true);
      
      e.preventDefault();
      console.log(jobDesc,jobExperience,jobPostion);

      const InputPromt="Job position: "+jobPostion+", job description: "+jobDesc+", years of experience: "+jobExperience+" depends on job position, job description & years of experience give us "+ process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview questions along with Answered in JSON format. Give only question and answer as field in JSON nothing extra"
      console.log(InputPromt);

      const result=await chatSession.sendMessage(InputPromt);
      const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
      // console.log(JSON.parse(MockJsonResp));
      setJsonResponse(MockJsonResp);
      if(MockJsonResp){
        const res=await db.insert(MockInterview).values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPostion,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
      }).returning({mockId:MockInterview.mockId});
      // console.log("inserted ID",res);
      if(res){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+res[0]?.mockId)
      }
      }
      else{
        console.log("error occured");
      }
      setloading(false)
    }
    return (
      <div>
        <div onClick={()=>setOpenDialog(true)} className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
          <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl" >Tell us more about your job interviewing</DialogTitle>
              <DialogDescription>
                <form onSubmit={onSubmit} >
                <div>
                   <h2>Add Details about your job position/role, Job description and years of experience</h2>

                      <div className="mt-7 my-3">
                        <label>Job Role/Job Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required onChange={(event)=>setJobPosition(event.target.value)}></Input>
                      </div>

                      <div className=" my-3">
                        <label>Job Description/ Tech Stack (In Short)</label>
                        <Textarea placeholder='Ex. React, Angular, Nodejs, Nextjs' required onChange={(event)=>setJobDesc(event.target.value)}></Textarea>
                      </div>

                      <div className=" my-3">
                        <label>Years of experience</label>
                        <Input placeholder="Ex. 2" type="number" required onChange={(event)=>setJobExperience(event.target.value)}></Input>
                      </div>

                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}  >Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading? <><LoaderCircle className="animate-spin"/>'Generating from AI'</>: 
                    'Start Interview'}</Button>
                </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
  </Dialog>
  
      </div>
    )
  }
  
  export default AddNewInterview