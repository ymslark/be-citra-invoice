const optionValueNotExist = async (form, answers) =>{
    const found = form.questions.filter((question) => {
        //cek type apakah radio atau Dropdown, atau bukan
        if(question.type == 'Radio' || question.type == 'Dropdown' ){
            //apakah questionId dari user sama dengan yang di database
            const answer = answers.find((answer) => answer.questionId == question.id)
            // setelah questionId dari user sesuai maka cek lagi 
            if(answer){
                //cek apakah option yang dikirim sesuai dengan yang ada di database
                const option = question.options.find((option)=> option.value == answer.value)

                //jika tidak ditemukan, maka kembalikan nilai true
                if(option === undefined){
                    return true
                }
            }
        }
        else if(question.type == 'Checkbox'){
            const answer = answers.find((answer) => answer.questionId == question.id)
            if(answer){
                return answer.value.some((value) => {
                    const option = question.options.find((option) => option.value == value)

                    if(option === undefined){
                        return true
                    }
                })
            }
        }
    }) 

    return found.length > 0 ? found[0].question : false
}

export default optionValueNotExist