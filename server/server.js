// Application server
const express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
const questions = require('./models/questions');
const answers = require('./models/answers');
const tags = require('./models/tags');
const userDatabase = require('./models/userDatabase')
let db = mongoose.connection
const port = '8000';
const app = express()
var mongoDB = 'mongodb://127.0.0.1:27017/fake_so'
mongoose.connect(mongoDB)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded( { extended: true}))

db.on('connected', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
    app.get('/main/question', async (req, res) => {
        res.send(await questions.find({}))
    })
    app.get('/main/tag', async (req, res) => {
        res.send(await tags.find({}))
    })
    app.get('/main/answer', async (req, res) => {
        res.send(await answers.find({}))
    })
    app.post('/newUser', async (req, res) => {
        const newUser = new userDatabase(req.body)
        await newUser.save()
        res.send(null)
    })
    app.get('/main/question/answer/:_id', async (req, res) => {
        const allQuestionsRelated = await questions.find(req.params)
        allQuestionsRelated[0].views += 1
        res.send(allQuestionsRelated)
    })
    app.get('/main/question/answer/responses/:_id', async (req, res) => {
        res.send(await answers.find(req.params))
    })
    app.post('/main/question/updateViews', async (req, res) => {
        const question = await questions.findOne(req.body)
        question.views += 1
        question.save().then(() => res.send())
    })
    app.post('/newTag', async (req, res) => {
        const newTabObj = req.body.list.map(x => new tags(x))
        for (let i = 0; i < newTabObj.length; i++) {
            if (await tags.exists({name:newTabObj[i].name})) {
                const y = await tags.find({name:newTabObj[i].name})
                newTabObj[i]._id = y[0]._id
                if (!y[0].userID.includes(req.body.userID)) {
                    y[0].userID.push(req.body.userID)
                    y[0].save()
                }
            }
            else {
                newTabObj[i].userID.push(req.body.userID)
                newTabObj[i].save()
            }
        }
        res.send(newTabObj)
    })
    app.post('/newQuestion', async (req, res) => {
        const newQuestion = new questions(req.body)
        await newQuestion.save()
        const question = await questions.find({})
        res.send(question)
    })
    app.get('/main/question/tag/:tag', async (req,res) => {
        const questionContainsSearch = []
        var tagID = ''
        const allTags = await tags.find(req.params)
        for (let i = 0; i < allTags.length; i++) {
            if (allTags[i].name == req.params.tag)
                tagID = allTags[i]
        }
        const allQuestions = await questions.find({})
        for (let i = 0; i < allQuestions.length; i++) {
            if (allQuestions[i].tags.includes(tagID._id)) {
                questionContainsSearch.push(allQuestions[i])
            }
        }
        res.send(questionContainsSearch)
    })
    app.get('/main/question/title/:title', async (req, res) => {
        const questionContainsSearch = []
        const allQuestions = await questions.find({})
        for (let i = 0; i < allQuestions.length; i++) {
            allQuestionsArray = allQuestions[i].title.toLowerCase().split(' ')
            if (allQuestionsArray.includes(req.params.title)) {
                questionContainsSearch.push(allQuestions[i])
            }
        }
        res.send(questionContainsSearch)
    })
    app.post('/newAnswer', (req, res) => {
        let newAnswer = new answers(req.body)
        newAnswer.save().then(() => res.send(newAnswer._id))
    })
    app.post('/updateQuestion', async (req, res) => {
        const question = await questions.findOne({_id:req.body.question})
        question.answers.unshift(req.body.ID)
        question.save().then(() => res.send(question))
    })
    app.get('/main/question:_id', async (req, res) => {
        res.send(await questions.find(req.params))
    })
    app.post('/main/question/comment', async (req, res) => {
        const question = await questions.findOne({_id:req.body.question._id})
        question.comments.push(req.body.input.trim())
        question.save().then(() => res.send(question.comments))
    })
    app.get('/main/answerDetails/:_id', async (req, res) => {
        res.send(await answers.find(req.params))
    })
    app.post('/main/answer/comment', async (req, res) => {
        const answer = await answers.findOne({_id:req.body.answer})
        answer.comments.push(req.body.input.trim())
        answer.save().then(() => res.send(answer.comments))
    })
    app.post('/createUser', async(req, res) => {
        const user = await userDatabase(req.body)
        user.save().then(() => res.send('added'))
    })
    app.get('/getUser/:email', async (req, res) => {
        const user = await userDatabase.findOne(req.params)
        res.send(user)
    })
    app.get('/checkUser/:user', async (req, res) => {
        const user = await userDatabase.findOne({email: req.params.user.split('~')})
        if (user === null) {
            res.send('User does not exist')
        }
        else if (user.password === req.params.user.split('~')[1]) {
            res.send(user)
        }
        else {
            res.send('Incorrect password')
        }
    })
    app.get('/questionsRelatedToName/:userID', async(req, res) => {
        res.send(await questions.find(req.params))
    })
    app.get('/answersRelatedToName/:userID', async(req, res) => {
        res.send(await answers.find(req.params))
    })
    app.get('/tagsRelatedToName/:userID', async(req, res) => {
        const AllTags = await tags.find({})
        let includesUserID = AllTags.filter(myfunction)
        function myfunction(value) {
            return value.userID.includes(req.params.userID)
        }
        res.send(includesUserID)
    }) 
    app.post('/update', async(req, res) => {
        const question = await questions.findOne({_id: req.body.original})
        question.title = req.body.title
        question.text = req.body.text
        question.summary = req.body.summary
        list = req.body.tags.trim().split(' ')
        list = [...new Set(list)]
        newTagList = []
        for (let i = 0; i < list.length; i++) {
            if (list[i] === '') {
                continue
            }
            const tag = await tags.find({name: list[i]})
            if (tag.length === 0) {
                const newTag = {
                    name: list[i],
                    userID: req.body.userID
                }
                let tagObj = new tags(newTag)
                tagObj.save()
                newTagList.push(tagObj._id)
            }
            else {
                newTagList.push(tag[0]._id)
            }
        }
        question.tags = newTagList
        question.save().then(res.send('saved'))
    })
    app.get('/getTagName/:list', async(req, res) => {
        list = req.params.list.split(',')
        x = []
        for (let i = 0; i < list.length; i++) {
            const z = await tags.findOne({_id: list[i]})
            x.push(z.name)
        }
        res.send(x)
    })
    app.get('/main/x/:_id', async(req, res) => {
        res.send(await questions.find({_id:req.params._id}))
    })
    app.get('/main/answer/:_id', async(req, res) => {
        res.send(await answers.find({_id:req.params._id}))
    })
    app.get('/main/tag/:_id', async(req, res) => {
        res.send(await tags.find({_id:req.params._id}))
    })
    app.post('/updateAnswer', async(req, res) => {
        const answer = await answers.findOne({_id: req.body.original})
        answer.text = req.body.text
        answer.save().then(res.send('saved'))
    })
    app.post('/updateTag', async(req, res) => {
        const x = await tags.findOne({name: req.body.name})
        if (x === null) {
            console.log('tag new')
            const tag = await tags.findOne({_id: req.body.original})
            tag.name = req.body.name
            tag.save().then(res.send('saved'))
        }
        else {
            if (!x.userID.includes(req.body.userID)) {
                x.userID.push(req.body.userID)
            }
            const tag = await tags.findOne({_id: req.body.original})
            tag.name = req.body.name
            tag.save()
            x.save().then(res.send('saved'))
        }
    })
    app.delete('/deleteQuestion/:_id', async(req, res) => {
        const x = (await questions.findById(req.params._id)).answers
        for (let i = 0; i < x.length; i++) {
            answers.findByIdAndDelete(x[i])
                .then(answer => {})
        }
        questions.findByIdAndDelete(req.params._id)
            .then(question => {
                if(!question) {
                    return res.send('p')
                }
                res.send('q')
            })
    })
    app.delete('/deleteAnswer/:_id', async(req, res) => {
        const AllQuestions = await questions.find({})
        for (let i = 0; i < AllQuestions.length; i++) {
            if (AllQuestions[i].answers.includes(req.params._id)) {
                const index = AllQuestions[i].answers.indexOf(req.params._id)
                AllQuestions[i].answers.splice(index, 1)
                AllQuestions[i].save()
            }
        }
        answers.findByIdAndDelete(req.params._id)
            .then(answer => {
                if(!answer) {
                    return res.send('p')
                }
                res.send('q')
            })
    })
    app.delete('/deleteTag/:_id', async(req, res) => {
        const AllQuestions = await questions.find({})
        for (let i = 0; i < AllQuestions.length; i++) {
            if (AllQuestions[i].tags.includes(req.params._id)) {
                const index = AllQuestions[i].tags.indexOf(req.params._id)
                AllQuestions[i].tags.splice(index, 1)
                AllQuestions[i].save()
            }
        }
        tags.findByIdAndDelete(req.params._id)
            .then(tag => {
                if(!tag) {
                    return res.send('p')
                }
                res.send('q')
            })
    })
    app.get('/getCreator/:_id', async(req, res) => {
        res.send(await userDatabase.findById(req.params._id))
    })
    app.post('/increaseQuestionVote', async(req, res) => {
        const question = await questions.findById(req.body.question._id)
        const userID = question.userID
        const creator = await userDatabase.findById(userID)
        creator.reputation += 5
        creator.save() 
        question.votes += 1
        question.save().then(res.send('like'))
    })
    app.post('/decreaseQuestionVote', async(req, res) => {
        const question = await questions.findById(req.body.question._id)
        const userID = question.userID
        const creator = await userDatabase.findById(userID)
        creator.reputation -= 10
        creator.save() 
        question.votes -= 1
        question.save().then(res.send('dislike'))
    })
    app.post('/increaseAnswerVote', async(req, res) => {
        const answer = await answers.findById(req.body.answer._id)
        const userID = answer.userID
        const creator = await userDatabase.findById(userID)
        creator.reputation += 5
        creator.save() 
        answer.votes += 1
        answer.save().then(res.send('like'))
    })
    app.post('/decreaseAnswerVote', async(req, res) => {
        const answer = await answers.findById(req.body.answer._id)
        const userID = answer.userID
        const creator = await userDatabase.findById(userID)
        creator.reputation -= 10
        creator.save() 
        answer.votes -= 1
        answer.save().then(res.send('like'))
    })
    app.get('/getCreationDate/:_id', async(req, res) => {
        const x = await userDatabase.findById(req.params._id)
        res.send(x.creation)
    })
})  
process.on('SIGINT', () => {
    console.log('Server closed. Database instance disconnected')
})