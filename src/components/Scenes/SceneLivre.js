import Bg from '../../assets/img/01_Image/sol_et_fond.png'
import Armoire from '../../assets/img/01_Image/armoire.png'
import Flowers from '../../assets/img/01_Image/plan_horizontal.png'
import Table from '../../assets/img/01_Image/table.png'
import Cadre from '../../assets/img/01_Image/cadre_photo.svg'
import Visage from '../../assets/img/01_Image/visage-seul-1.gif'
import VisageParle from '../../assets/animations-vid/visage-one-loop.gif'
import Shake from '../../assets/gestures/geste_shake.gif'
import AudioS1 from '../../assets/audio/scene1.mp3'
import AudioS2 from '../../assets/audio/image_qui_parle.mp3'
import './styles/SceneLivre.css'
import { useEffect, useRef, useState } from 'react'
import Boussole from '../../assets/gestures/boussole-02.svg'
import FlecheBoussole from '../../assets/gestures/boussole-03.svg'
import { Redirect } from "react-router-dom";

const SceneLivre = (props) => {
    let bodySceneLivre = useRef(null)
    let armoirRef = useRef(null)
    let fleursRef = useRef(null)
    let tableRef = useRef(null)
    let shakeRef = useRef(null)
    let audioRef = useRef(null)
    let audioRef2 = useRef(null)
    let boussoleRef = useRef(null)
    let flecheBoussoleRef = useRef(null)
    let visageRef = useRef(null)
    let cadreRef = useRef(null)

    let [gestureIsDisplay, setGestureIsDisplay] = useState(false)
    let [compassIsDisplay, setCompassIsDisplay] = useState(false)
    let [redirect, setRedirect] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            bodySceneLivre.current.style.opacity = .5
            armoirRef.current.style.right = '0'
            fleursRef.current.style.top = '25%'
            tableRef.current.style.bottom = '7%'
            cadreRef.current.style.bottom = '40%'
        }, 1000)
        
        // TO DO : Implémenter le nombre de seconde de la durée de la première voix : TIMEOUT à 25000
        setTimeout(() => {
            setGestureIsDisplay(true)
            shakeRef.current.style.opacity = 1
            runSecousse()
        }, 2000)
        // window.addEventListener('scroll', noScroll);
    }, [])

    useEffect(() => {
        // console.log('mon mute :', props.isVoice)
        if(props.isVoice === true && audioRef.current.currentTime < 1){
            props.soundEffect.src = AudioS1
            // props.soundEffect.play()
        }

        // props.soundEffectplay()
        // } else if (props.isVoice === false){
        //     // console.log('stop ', props.soundEffect )
        //     props.soundEffect.pause()
        // } else if (props.isVoice === true && props.soundEffect.currentTime > 1){
        //     // audioRef2.current.play()
        // } else if (props.soundEffect.currentTime > 1){
        //     props.soundEffect.pause()
        //     // audioRef2.current.pause()
        // }
    }, [props.isVoice, props.soundEffect])

    const runSecousse = () => {
        try{
            window.addEventListener('devicemotion', callBackSecousse, true);
        } catch (e){
            console.log('erreur', e)
        }
    }

    const runBoussole = () => {
        if (window.DeviceOrientationEvent) {
            // Listen for the deviceorientation event and handle the raw data
            window.addEventListener('deviceorientation', callBackBoussole, true);
        }
    }

    let progressionFaceDisplaying = 0
    const callBackSecousse = (event) => {
        console.log('callBackSecousse se lance')
            console.log(progressionFaceDisplaying)
            if(event.acceleration.y > 25){
                progressionFaceDisplaying++
                console.log(progressionFaceDisplaying)

                visageRef.current.style.opacity = progressionFaceDisplaying / 10
            }
            if(progressionFaceDisplaying >= 10){
                window.removeEventListener('devicemotion', callBackSecousse, true)
                bodySceneLivre.current.style.opacity = 1

            } else if (progressionFaceDisplaying === 2){
                setGestureIsDisplay(false)
            }
    }

    const callBackBoussole = (event) => {
            let compassdir;

            if(event.webkitCompassHeading) {
                // Apple works only with this, alpha doesn't work
                compassdir = event.webkitCompassHeading;  
                // console.log(compassdir)
            }
            else compassdir = event.alpha;

            compassdir = -compassdir
            boussoleRef.current.style.transform = `rotate(${compassdir}deg)`
            // console.log(boussole.style.transform)
            if(-compassdir > 179 && -compassdir < 181){
                boussoleRef.current.style.opacity = 0
                flecheBoussoleRef.current.style.opacity = 0
                bodySceneLivre.current.style.opacity = 1
                window.removeEventListener('deviceorientation', callBackBoussole, true)
                bodySceneLivre.current.style.opacity = 0
                setTimeout(() => {
                    setRedirect('/experience/indoor/scene/2')
                }, 1000)
                // TODO : Déclencher l'animation 
                console.log('DECLENCHED ANINMATION')
            }
        }

    return(
        <div className="w-full h-screen fixed">
            <div ref={bodySceneLivre} className="body w-full h-screen  overflow-x-hidden transition-opacity duration-700 ease-in-out">
                <img src={Bg} alt="background" className="w-screen h-screen"/>
                <img ref={armoirRef} src={Armoire} alt="armoire" className="z-1 w-5/12 -top-2 -right-40 transition duration-700 ease-in-out"></img>
                <img ref={fleursRef} src={Flowers} alt="fleurs" className="fleurs -top-2/3"/>
                <img ref={tableRef} src={Table} alt="table" className="z-10 -bottom-80"/>
                <img src={Cadre} ref={cadreRef} alt="cadre" className="cadre w-1/2 z-10 left-1/4 -bottom-80"/>
                <img src={Visage} ref={visageRef} onClick={() => {
                    visageRef.current.src = VisageParle
                    props.soundEffect.src = AudioS2
                    console.log('play')
                    props.soundEffect.play()
                    // TO DO : Lancer le son et l'animation du visage

                    const interval = setInterval(() => {
                        if(props.soundEffect.currentTime > 14.5){
                            setTimeout(() => {
                                setCompassIsDisplay(true)
                                console.log('boussole ok')
                                console.log(compassIsDisplay)
                                bodySceneLivre.current.style.opacity = .5
                                boussoleRef.current.style.opacity = 1
                                flecheBoussoleRef.current.style.opacity = 1
                                runBoussole()
                            }, 1000)
                            clearInterval(interval)
                        }
                    }, 500)
                }} alt="visage" className="visage mb-20 z-10 bottom-60 left-1/4 opacity-0"/>
                {/* <img src={Cadre} alt="Cadre Obey" className="bottom-0 z-10"/> */}

                <audio ref={audioRef}
                    src={AudioS1}>
                        Your browser does not support the
                        <code>audio</code> element.
                </audio>
                <audio ref={audioRef2}
                    src={AudioS2}>
                        Your browser does not support the
                        <code>audio</code> element.
                </audio>

            </div>
            {/* <button className="bottom-0 disa absolute" onClick={() => {
                    setProgressionFaceDisplaying(10)
                    // Là je lance dans x secondes l'indication gesture qu'il faut tourner son téléphone vers le su

                    audioRef2.current.play()
                }
                    }>Quitter le shake</button> */}
            {gestureIsDisplay && <img ref={shakeRef} src={Shake} alt="shake" className="anim absolute top-0 opacity-0 z-50"/>}
            {compassIsDisplay && <img ref={boussoleRef} src={Boussole} className="w-40 absolute transform left-1/3  top-1/3 opacity-0 transition-opacity duration-500 ease-in-out" alt="fleche boussole" />}
            {compassIsDisplay && <img ref={flecheBoussoleRef} src={FlecheBoussole} className="w-20 absolute left-1/3 ml-10 mb-2 transform rotate-180 top-1/4 opacity-0 transition-opacity duration-500 ease-in-out" alt="fleche boussole" />}

            {redirect && <Redirect to={redirect} />}
        </div>
        
    )
}

export default SceneLivre;
