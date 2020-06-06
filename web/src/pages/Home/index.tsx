import React from 'react'
import './styles.css'

import {Link} from 'react-router-dom'

import logo from '../../Assets/logo.svg'

const Home = () => {
  return(
     <div id="page-home">
       <div className="content">
         <header>
            <img src={logo} alt="Ecoleta" />
         </header>

         <main>
           <h1> Seu marketplace de coleta de resíduos.</h1>
           <p> Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente </p>
           <Link to='/point'>
             <span> > </span>
             <strong> Cadastre um ponto de coleta </strong>
           </Link>
         </main>
       </div>
     </div>
  )
}

export default Home