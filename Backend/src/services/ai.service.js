const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")



const ai = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY

})





// ================= INTERVIEW REPORT SCHEMA =================


const interviewReportSchema = z.object({


    title:z.string(),


    matchScore:z.number(),



    technicalQuestions:z.array(

        z.object({

            question:z.string(),

            intention:z.string(),

            answer:z.string()

        })

    ),




    behavioralQuestions:z.array(

        z.object({

            question:z.string(),

            intention:z.string(),

            answer:z.string()

        })

    ),




    skillGaps:z.array(

        z.object({

            skill:z.string(),

            severity:z.enum([

                "low",
                "medium",
                "high"

            ])

        })

    ),





    preparationPlan:z.array(

        z.object({

            day:z.number(),

            focus:z.string(),

            tasks:z.array(
                z.string()
            )

        })

    )


})








// ================= GENERATE INTERVIEW REPORT =================


async function generateInterviewReport({

    resume,

    selfDescription,

    jobDescription


}){


const prompt = `


You are an expert technical interviewer.


Create detailed interview preparation report.


Candidate Resume:

${resume}



Candidate Profile:

${selfDescription}



Job Description:

${jobDescription}



Rules:


Return JSON only.



Technical questions:

Create unique interviewer intentions.

Do not repeat same intention.



Behavior questions:

Use STAR method.



Skill gaps:

Find missing skills.



Preparation plan:

Create realistic day wise plan.






`;





try{


const response = await ai.models.generateContent({


model:"gemini-2.5-flash",


contents:prompt,


config:{


responseMimeType:"application/json",


responseSchema:

zodToJsonSchema(
    interviewReportSchema
)


}


});




let data = JSON.parse(response.text);





// safety fix


data.technicalQuestions =

data.technicalQuestions.map(q=>({


question:q.question,


intention:
q.intention || 
"Interviewer wants to evaluate technical depth",


answer:
q.answer ||
"Explain with practical examples."


}));






data.behavioralQuestions =

data.behavioralQuestions.map(q=>({


question:q.question,


intention:
q.intention ||
"Interviewer wants to understand candidate experience",


answer:
q.answer ||
"Answer using STAR method."


}));





data.skillGaps =

data.skillGaps.map(s=>({


skill:s.skill,


severity:
s.severity || "medium"


}));






data.preparationPlan =

data.preparationPlan.map((p,i)=>({


day:p.day || i+1,


focus:p.focus,


tasks:p.tasks || []


}));





return data;



}

catch(error){


console.log(
"Gemini Error:",
error.message
);


throw new Error(
"AI service temporarily unavailable. Please try again."
);


}



}











// ================= HTML TO PDF =================


async function generatePdfFromHtml(htmlContent){



const browser = await puppeteer.launch({


headless:true,


args:[

"--no-sandbox",

"--disable-setuid-sandbox"

]


});




const page = await browser.newPage();





await page.setContent(


`

<html>


<head>


<style>


@page{

size:A4;

margin:12mm;

}



body{


font-family:Arial,Helvetica,sans-serif;


color:#111827;


line-height:1.5;


font-size:12px;


}



h1{

font-size:30px;

color:#111827;

}


h2{


color:#2563eb;

border-bottom:2px solid #2563eb;

padding-bottom:5px;


}


.skill{


background:#eff6ff;

padding:5px;

border-radius:5px;

}



.card{


padding:10px;

margin-bottom:10px;

background:#f9fafb;

border-radius:8px;


}



</style>


</head>



<body>


${htmlContent}


</body>


</html>


`,


{

waitUntil:"networkidle0"

}



);






const pdfBuffer = await page.pdf({


format:"A4",


printBackground:true,



margin:{


top:"12mm",

bottom:"15mm",

left:"12mm",

right:"12mm"


},



displayHeaderFooter:true,



footerTemplate:`


<div style="font-size:10px;width:100%;text-align:center">

Resume Generated | Page <span class="pageNumber"></span>

</div>


`



});





await browser.close();



return pdfBuffer;



}










// ================= GENERATE RESUME PDF =================



async function generateResumePdf({

resume,

selfDescription,

jobDescription


}){



const schema = z.object({


html:z.string()


});





const prompt = `


Create a premium software engineer resume.


Candidate:

${resume}


Profile:

${selfDescription}


Target Job:

${jobDescription}



Requirements:


- FAANG level resume style
- ATS friendly
- Professional layout
- No fake information
- Achievement based bullet points
- Include technologies
- Include projects
- Include measurable impact


Return JSON only:


{

"html":"resume html"

}


`;





const response = await ai.models.generateContent({


model:"gemini-2.5-flash",


contents:prompt,


config:{


responseMimeType:"application/json",


responseSchema:

zodToJsonSchema(schema)


}



});






const result = JSON.parse(response.text);




return await generatePdfFromHtml(
result.html
);



}







module.exports={


generateInterviewReport,

generateResumePdf


}