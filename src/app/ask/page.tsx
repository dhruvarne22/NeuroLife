"use client"

import { askNeuroAi } from '@/action/user';
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpIcon } from 'lucide-react'
import React, { Fragment, useRef, useState, useTransition } from 'react'

function AskAIPage() {

const [questionText , setQuestionText] = useState("");
const [questions, setQuestion]= useState<string[]>([]);
const [responses, setresponses]= useState<string[]>([]);
const [isPending , startTransition] = useTransition();



const textareaRef  = useRef<HTMLTextAreaElement>(null);
const contentRef  = useRef<HTMLDivElement>(null);


const scrollToBottom = () =>{
contentRef.current?.scrollTo({
    top: contentRef.current.scrollHeight,
    behavior: 'smooth',
});
}

const hadleInput = () => {
    const textarea = textareaRef.current;
    if(!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
};


const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        handleSubmit();
    }
}


const handleSubmit = () => {
    if(!questionText.trim()) return;


    const newQuestions = [...questions, questionText.trim()];
    setQuestion(newQuestions);
    setQuestionText("");

    setTimeout(scrollToBottom , 100);

    startTransition( async () => {
        const response = await askNeuroAi(newQuestions, responses);
        setresponses((prev)=> [...prev,response]);

        setTimeout(scrollToBottom , 100);
    })
}

  return (
   <div className='flex flex-col h-screen max-h-screen p-4'>
<h1 className='text-2xl font-bold mb-2'>Ask NeuroAI about your notes</h1>
<p className='text-muted-foreground mb-4'>Your personal AI assistant for your notebook.</p>

<div className='cutom-scrollbar flex-1 overflow-y-auto rounded-lg border p-4 space-y-6' ref={contentRef}>


    {questions.map((question, index)=> (

        <Fragment key={index}>
    <p className='bg-muted ml-auto max-w-[40%] rounded-md px-3 py-2 text-sm text-muted-foreground '>{question}</p>


    {responses[index] &&    <p className='  text-sm text-muted-foreground' dangerouslySetInnerHTML={{__html: responses[index]}}/>}  

    </Fragment>

    ))}


{isPending && <p className='animate-pulse text-sm'>Thinking...</p>}
    


</div>


<div className='mt-4 flex items-end gap-2 border rounded-lg p-3'>

    <Textarea
    ref = {textareaRef}
    placeholder='Ask anything about your notes...'
    className='resize-none focus-visible:ring-0 bg-trasparent '
    rows={1}
    onInput={hadleInput}
    onKeyDown={handleKeyDown}
    value={questionText}
    onChange={(e)=> setQuestionText(e.target.value)}
    
    />

    <Button className='rounded-full size-10'>
        <ArrowUpIcon className='text-background'/>
    </Button>
</div>
   </div>
  )
}

export default AskAIPage