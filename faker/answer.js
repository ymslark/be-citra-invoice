import {faker} from '@faker-js/faker'
import answer from '../models/Answer.js'

const run = async (limit) =>{
        try {            
            let data = []
            for (let i = 0; i < limit; i++) {
                data.push({
                    '649e84b4f41255bcb1ba7de5': faker.helpers.arrayElements(['Semur', 'Rendang', 'Soto', 'Ayam Bakar']),
                    '649e84b7f41255bcb1ba7de7': faker.person.fullName(),
                    '64a843fc9fec62df5dc02335': faker.internet.email(),
                    '64b3a03cedb95d44480410ab': faker.helpers.arrayElement(['39', '40', '41', '42', '43', '44', '45']),
                    'formId': '649daad4fc7933ef3b7cf571',
                    'userId': faker.helpers.arrayElement(['64859adf549c880d302bdb84', '649db2574254989f7bf4ed9b'])
                })
            }
            const fakeData = await answer.insertMany(data)
                if(fakeData){
                    console.log(fakeData)
                    process.exit()
                }
        } catch (error) {
            console.log(data||null)
            process.exit()
        }
}

export {run}