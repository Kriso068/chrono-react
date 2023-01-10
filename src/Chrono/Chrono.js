import React, {useState, useEffect, useReducer} from 'react'
import './Chrono.css'
import PauseImg from '../Images/pause.svg'
import PlayImg from '../Images/play.svg'
import ResetImg from '../Images/reset.svg'



export default function Chrono() {

    //sessionTime sera le compte à rebour 1500 /60  = 25min
    const [sessionTime, setSessionTime] = useState(1500);

    //SessionTimeFixed sera le nombre des minutes pour le compte à rebour 1500 / 60 = 25min
    const [sessionTimeFixed, setSessionTimeFixed] = useState(1500);

    //breakTime sera la pour la pause apres la fin du compte à rebour 300 / 60 = 5min
    const [breakTime, setBreakTime] = useState(300);

    //breakTimeFixed sera  le nombre des minutes apres la fin du compte à rebour 300 / 60  = 5min
    const [breakTimeFixed, setBreakTimeFixed] = useState(300);

    //workingChrono sera pour le démarage du chrono
    const [workingChrono, setWorkingChrono] = useState(false);

    const [state, dispatch] = useReducer(reducer);


    //on appel cette function en dehord du useEffect pour etre toujours a jour
    //car si on ne le fait pas comme ca vue que nous avons une cleanupfonction cela engenderait des bug
    function reducer(state, action){

        //on recupère l'qction type dans useEffect
        switch(action.type){
            case 'TICK':

                //si sessionTime est supérieur ou égal à 0 alors on décrémente
                if(sessionTime >= 0 ) {
                    setSessionTime(sessionTime -1)
                }
                //si breakTime est supérieur ou égal à 0 alors on décrémente
                else if (breakTime >= 1) {
                    setBreakTime(breakTime -1)
                }
                //quand  breakTime et sessionTime sont a 0 alors on reset les deux
                else if (breakTime <= 0 && sessionTime <= 0) {
                    setSessionTime(sessionTimeFixed)
                    setBreakTime(breakTimeFixed)
                }
        }
    }



    //useEffect sert à gérer le cycle de vie des composants
    useEffect(() =>{

        let id;

        //si workingChrono est a true alors
        if(workingChrono) {

            id = window.setInterval(() => {

                //a chaque TICK on va appeler la function reducer qui va update le state
                dispatch({type: 'TICK'})
                
            }, 1000)
        }

        //appellé cleanup function pour nettoyer tous les setInterval
        return () => {

            window.clearInterval(id)

        }

        //on met workingChrono pour surveiller a chaque fois que l'on click sur le button playPause
    }, [workingChrono])


    //function pour toggle le play pause button
    const playPause = () => {

        setWorkingChrono(!workingChrono)
    }

    const handleSession = e => {

        const el = e.target;

        //si el contient minus alors on va décrémenter
        if(el.classList.contains('minus')) {

            //si sessionTime / 60 est supérieur à 1
            if(sessionTime / 60 > 1) {

                setSessionTime(sessionTime - 60)
                setSessionTimeFixed(sessionTimeFixed - 60)
            }
              
        }
        //si el contient plus alors on va incrémenter
        else if(el.classList.contains('plus')) {

            setSessionTime(sessionTime + 60)
            setSessionTimeFixed(sessionTimeFixed + 60)
        }

    }


    const handleBreak = e => {
        
        const el = e.target;

        //si el contient minus alors on va décrémenter
        if(el.classList.contains('minus')) {

            //si breakTime / 60 est supérieur à 1
            if(breakTime / 60 > 1) {

                setBreakTime(breakTime - 60)
                setBreakTimeFixed(breakTimeFixed - 60)
            }
              
        }
        //si el contient plus alors on va incrémenter
        else if(el.classList.contains('plus')) {

            setBreakTime(breakTime + 60)
            setBreakTimeFixed(breakTimeFixed + 60)
        }

    }

    const resetFunc = () => {

        //si le chrono est en cours alors
        if(workingChrono) {

            //on va inverser donc stoper le chrono
            setWorkingChrono(!workingChrono);
        }

        //on remet les valeur par défault
        setSessionTime(sessionTimeFixed)
        setBreakTime(breakTimeFixed)
    }
    
  return (
    <div className={workingChrono ? 'container-chrono anim-glow' : 'container-chrono' }>
      <div className='container-config'>
        <div className='box-btns session'>
            <button
                onClick={handleSession} 
                className='minus'
            >
                -
            </button>
            <span>{sessionTimeFixed / 60}</span>
            <button 
                onClick={handleSession} 
                className='plus'
            >
                +
            </button>
        </div>
        <div className='box-btns break'>
            <button 
                onClick={handleBreak} 
                className='minus'
            >
                -
            </button>
            <span>{breakTimeFixed / 60}</span>
            <button 
                onClick={handleBreak} 
                className='plus'
            >
                +
            </button>
        </div>
      </div>

      <h1>
        {/* si sessionTime est supérieur ou égal à 0 alors */}
         {sessionTime >= 0 ? (

                <span>
                    {/* on enleve toute ce aui est derrière la virgule avec trunc et pour afficher les seconde nous allons utiliser le modulo qui est le reste de la sonmme*/}
                    {/* si sesstionTime < 10 alors on veut afficher un 0 avent le nombre sinon on affiche sessionTime modulo 60*/}
                    {`${Math.trunc(sessionTime / 60)} : ${sessionTime % 60 < 10 ? `0${sessionTime % 60}` : `${sessionTime % 60}`}`}
                </span>
            ) : 
            <span>
                {/* on refait la meme chose avec le breakTime */}
                {`${Math.trunc(breakTime / 60)} : ${breakTime % 60 < 10 ? `0${breakTime % 60}` : `${breakTime % 60}`}`}
            </span>
         }
      </h1>

      <div className='container-controllers'>
        <button 
            onClick={playPause}
        >
            <img src={workingChrono ? PauseImg : PlayImg} alt=''/>
        </button>
        <button
            onClick={resetFunc}
        >
            <img src={ResetImg} alt=''/>
        </button>
      </div>
    </div>
  )
}
