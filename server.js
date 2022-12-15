import express from 'express'
import bcrypt from "bcrypt"
import stripe from "stripe"
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// configuracion de firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOqT5ELCEvSjDOFrdbML59P5Ut-IT3kDU",
    authDomain: "agenda-citas-2a08c.firebaseapp.com",
    projectId: "agenda-citas-2a08c",
    storageBucket: "agenda-citas-2a08c.appspot.com",
    messagingSenderId: "831137341269",
    appId: "1:831137341269:web:f233de32080a785f50d9dc"
}
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()
const app = express()
app.use(express.static('public'))
app.use(express.json())
// Rutas 
app.get('/',(req,res) => {
    res.sendFile('index.html',{root:'public'})
})
// Ruta para registrar
app.get('/signup',(req,res) => {
    res.sendFile('signup.html',{root: 'public'})
})
app.post('/signup',(req,res) => {
    const { name, email, password, number } = req.body
    console.log(req.body)
    // Validaciones
    if(name.length <3){
        res.json({ 'alert': 'ingresa un nombre valido'})
    } else if (!email.length) {
        res.json({'alert': 'ingresa tu email'})
    }else if (password.length < 8) {
        res.json({'alert': 'el password debe de ser minimo de 8 caracteres'})
    }else if (!Number(number) || number.length < 10 ) {
        res.json({'alert': 'ingresa un numero valido'})
    }else {
        // Almacenar datos en BD
        const users = collection(db,"users")
        getDoc(doc(users,email)).then(user => {
            if(user.exists()){
            res.json({'alert': 'email existente'})
            }else {
                //encriptar password
                bcrypt.genSalt(10,(err,salt)=> {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash
                        setDoc(doc(users, email), req.body).then(data =>{
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                            })
                        })
                    })
                })
            }
        })
    }
})
// Ruta para registrar
app.get('/signup',(req,res) => {
    res.sendFile('signup.html',{root: 'public'})
})
app.post('/signup',(req,res) => {
    const { name, email, password, number, tac } = req.body
    console.log(req.body)
    // Validaciones
    if(name.length <3){
        res.json({ 'alert': 'name must be 3 letters long'})
    } else if (!email.length) {
        res.json({'alert': 'enter your email'})
    }else if (password.length < 8) {
        res.json({'alert': 'password must be 8 letters long'})
    }else if (!Number(number) || number.length < 10 ) {
        res.json({'alert': 'invalid number, please enter valid one'})
    }else if (!tac) {
        res.json({'alert': 'you must agree to our terms'})
    }else {
        // Almacenar datos en BD
        const users = collection(db,"users")
        getDoc(doc(users,email)).then(user => {
            if(user.exists()){
            res.json({'alert': 'email already exists'})
            }else {
                //encriptar password
                bcrypt.genSalt(10,(err,salt)=> {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash
                        setDoc(doc(users, email), req.body).then(data =>{
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                            })
                        })
                    })
                })
            }
        })
    }
})
// Ruta Login
app.get('/login',(req,res) => {
    res.sendFile('login.html',{root: 'public'})
})
app.post('/login',(req,res) => {
    let { email, password } = req.body
    console.log('login', email,password)
    if ( !email.length || !password.length){
        return res.json({
            'alert': 'fill all the inputs'
        })
    }   
    const users = collection(db, 'users')
    getDoc(doc(users, email))
        .then( user => {
            if(!user.exists()) {
                return res.json({
                    'alert': 'fill all the inputs'
                })
            }else {
                bcrypt.compare(password,user.data().password,(err,result) => {
                    if (result) {
                        let data = user.data()
                        return res.json({
                            name: data.name,
                            email: data.email,
                            seller: data.seller
                        })
                    } else {
                        return res.json({'alert': 'incorrect password'})
                }
            })
        }
    })
})
// Ruta Contacto
app.get('/contacto',(req,res) => {
    res.sendFile('contacto.html',{root: 'public'})
})
// Citas
app.get('/citas', (req,res) => {
    res.sendFile('citas.html',{ root: 'public'})
})
app.post('/citas', (req,res) => {
    let { name, address, about, number, email } = req.body
    if (!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        return res.json({
            'alert': 'somethitng was wrong'
        })
    } else {
        const cita = collection(db, "citas")
        setDoc(doc(cita, email), req.body)
        .then(data => {
            const users = collection(db, "users")
            updateDoc(doc(users, email), {
                seller: true
            })
            .then(data => {
                res.json( {
                    'cita': true
                })
            })
        })
    }
})
// Inicio del servidor 
app.listen(8080,()=>{
    console.log('Servidor en operacion')
})