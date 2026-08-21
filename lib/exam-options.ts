import{createHash}from"node:crypto";

const letters=["A","B","C","D"]as const;
type Letter=typeof letters[number];
type QuestionOptions={id:string;content:string;optionA:string;optionB:string;optionC:string;optionD:string};

function permutation(attemptId:string,questionId:string){const values=[...letters];const bytes=createHash("sha256").update(`${attemptId}:${questionId}`).digest();for(let i=values.length-1;i>0;i--){const j=bytes[i]%(i+1);[values[i],values[j]]=[values[j],values[i]]}return values}

export function shuffleQuestionOptions(question:QuestionOptions,attemptId:string){const order=permutation(attemptId,question.id);const original={A:question.optionA,B:question.optionB,C:question.optionC,D:question.optionD};return{...question,optionA:original[order[0]],optionB:original[order[1]],optionC:original[order[2]],optionD:original[order[3]]}}

export function originalOption(attemptId:string,questionId:string,displayed:Letter):Letter{return permutation(attemptId,questionId)[letters.indexOf(displayed)]}
export function displayedOption(attemptId:string,questionId:string,original:Letter):Letter{const index=permutation(attemptId,questionId).indexOf(original);return letters[index]}
