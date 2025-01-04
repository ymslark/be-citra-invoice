import isEmailValid from "./isEmailValid.js"

const emailNotValid = async (form, answers) => {
    const found = form.questions.filter((question)=>{
        if(question.type == "Email"){
            const answer = answers.find((answer) => answer.questionId == question.id)
            
            if (question.required === false) {
                if (answer === undefined || answer.value === undefined || answer.value === null|| answer.value == "") {
                    return false
                }
            }
            if(answer){
                if(!isEmailValid(answer.value)){
                return true
                }
            }
        }
    })
    return found.length > 0 ? true : false
}
export default emailNotValid