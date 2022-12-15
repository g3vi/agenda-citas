let user = JSON.parse(sessionStorage.user || null)

const navbar=document.querySelector('.navbar')
window.addEventListener('scroll', () => {
    if(scrollY >= 180){
        navbar.classList.add('bg')
    }else{
        navbar.classList.remove('bg')
    }
})
const createNavbar = () => {
    if (user)
    {
        navbar.innerHTML +=
        `
        <button class="navbar-burger" onclick="toggleMenu()"></button>
        <nav class="menu">
        <a href="/" style="animation-delay: 0.1s">Home</a>
        <a href="/contacto" style="animation-delay: 0.2s">Contacto</a>
        <a href="/citas" style="animation-delay: 0.3s">Citas</a>
        <div class="user">
            <img src="./img/user.png" class="user-icon">
            <div class="user-icon-popup">
                <p>Login to your acount</p>
                <a href="/login">Login</a>
            </div>
        </div>
        </nav>
        `
    }else 
    {
        navbar.innerHTML +=
        `
        <button class="navbar-burger" onclick="toggleMenu()"></button>
        <nav class="menu">
        <a href="/" style="animation-delay: 0.1s">Home</a>
        <a href="/contacto" style="animation-delay: 0.2s">Contacto</a>
        <a href="/citas" style="animation-delay: 0.3s">Citas</a>
        <a href="/signup" style="animation-delay: 0.5s">Sign up</a>
        </nav>
        <div class="user">
            <img src="./img/user.png" class="user-icon">
            <div class="user-icon-popup">
                <p>Login to your acount</p>
                <a href="/login">Login</a>
            </div>
        </div>
        `
    }
}


createNavbar()
//user icon popup
let userIccon=document.querySelector('.user-icon')
let userPopupIcon=document.querySelector('.user-icon-popup')
userIccon.addEventListener('click',()=>{
    userPopupIcon.classList.toggle('active')
})
let text=userPopupIcon.querySelector('p')
let actionBtn=userPopupIcon.querySelector('a')

if(user!=null){
    text.innerHTML=`log in as, ${user.name}`
    actionBtn.innerHTML='logout'
    actionBtn.addEventListener('click', () => {
        logout()
    })
}else{
    text.innerHTML='log in to your account'
    actionBtn.innerHTML='login'
    actionBtn.addEventListener('click', () => {
        location.href('/login')
    })
}
const logout=()=>{
    sessionStorage.clear()
    location.reload()
}