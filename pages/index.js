import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import mainStyles from '../styles/Main.module.scss'
import navStyles from '../styles/Nav.module.scss'

import React, {Suspense, useRef, useEffect, useState} from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'

import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Stars } from '@react-three/drei'
import { useRouter } from 'next/router'

const defaultSpeed = 200

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = 20;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};



export default function Home() {
  const router = useRouter()
  const reloadWindowWithNewSpeed = () => {
    router.replace('/nooo')
  }



  console.log('component render')
  const webcamRef = useRef(null)
  // const canvasRef = useRef(null)
  // const [handData, setHandData] = useState(null)
  const handPositionRef = useRef([0,0,0])
  // const [webcamReady, setWebcamReady] = useState(false)
  const webcamReadyRef = useRef(false)
  const videoRef = useRef(null)
  // const [updateSpeed, setUpdateSpeed] = useState(500)
  // const updateSpeed = useRef(router.query.speed)
  const updateSpeed = useRef(null)
  // const [updateSpeed, setUpdateSpeed] = useState(router.query.speed)
  // const [vectorFromHandData, setVectorFromHandData] = useState([0,0,0])
  const [navOpen, setNavOpen] = useState(false)

  const runHandPose = async () => {
    const net = await handpose.load({
      inputResolution:{width:640, height:480}, 
      // inputResolution:{width:900, height:480}, 
      scale:.25
    })
    setInterval(() => {
      detectHand(net)
    }, updateSpeed.current)
    
  }
  console.log('yeah')
  
  
  // function Boxy(props) {
  function Boxy() {
    const ref = useRef()
    useFrame((state, delta) => {
      ref.current.rotation.x = handPositionRef.current[0]
      ref.current.rotation.y = handPositionRef.current[2]
    })
    return (
      <mesh
      // {...props}
      ref={ref}
      scale={1}
      position={[0, 0, 0]} 
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
    )
  }
  
  
  const detectHand = async (net) => {
    if (
      // typeof webcamRef.current !=='undefined' && 
      // webcamRef.current !== null && 
      // webcamRef.current.video.readyState === 4
      webcamReadyRef.current == true && webcamRef.current.video.readyState === 4
      ) {
        const hand = await net.estimateHands(videoRef.current)
        if (hand[0]) {
          handPositionRef.current = [
            (Math.round(hand[0].annotations.indexFinger[0][1]) / 50),
            0,
            (Math.round(hand[0].annotations.indexFinger[0][0]) / 100)
          ]
          
        }
      }
  }


  useEffect(() => { // webcam and router query check
    console.log('webcamcheck useffect called')
    const checkWebcam = () => {
      if (
        typeof webcamRef.current !=='undefined' 
        && 
        webcamRef.current !== null 
        ) {
          console.log('check webcam success')
          // console.log(webcamRef.current.video)
          const video = webcamRef.current.video
          
          videoRef.current = video
          
          // const videoWidth = webcamRef.current.video.videoWidth
          // const videoHeight = webcamRef.current.video.videoHeight
          // webcamRef.current.video.width = videoWidth
          // webcamRef.current.video.height = videoHeight

          // console.log(webcamRef.current.video)

          
          // setWebcamReady(true)
          
          webcamReadyRef.current = true
          // setUpdateSpeed(router.query.speed)
          if (router.query.speed) {
            updateSpeed.current = router.query.speed

          } else {
            updateSpeed.current = defaultSpeed
          }
          // console.log(webcamRef.current.video.readyState)
          

          // runHandPose()
        }
    }
    checkWebcam()
  }, [router.query])
  
  

  return (
    // <div className={mainStyles.containerackground}>

    // </div>

    <div className={mainStyles.container}>
      {/* <h1>yee</h1> */}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className={mainStyles.main}> */}
        {/* <nav className={navStyles.nav}> */}
        {
          !navOpen &&
          <button className={navStyles.openMenu} onClick={() => setNavOpen(true)}>MENU</button>
        }
        {
          navOpen &&
          <nav className={navStyles.nav}>
            <section className={navStyles.navTopSection}>
              <h1 onClick={() => setNavOpen(false)} >X</h1>
            </section>
            <section className={navStyles.speedButtons}>
              {/* <h3>By default the hand detection occurs once every 200ms. You can increase or decrease this speed using the buttons below, or by including a value in the url by appending <span>?speed={'<'}NUMBER{'>'}</span></h3> */}
              <ul>
                <h1>how to use:</h1>
                <h2> {'>'} default detection speed is every 200ms</h2>
                <h2> {'>'} change this with buttons below</h2>
                <h2> {'>'} or include a value in the url by appending: </h2>
                <h2 style={{color: '#b9ffff', textAlign: 'center'}}>?speed={'<'}NUMBER{'>'}</h2>
                <h3>Maximum performance is dependent upon client hardware</h3>
                  {/* <li>default detection speed is every 200ms</li>
                  <li>change this with buttons below</li>
                  <li>or include a value in the url by appending: <br /><br /><span>?speed={'<'}NUMBER{'>'}</span></li>
                  <li>maximum performance is dependent upon client hardware</li> */}
              </ul>
              <div>
                {/* <button href='/?speed=10'>50</button> */}
                  {/* <Link href='/?speed=10'>
                    <button>10</button>
                  </Link>
                  <Link href='/?speed=50'>
                  </Link> */}
                <a href='/?speed=10'>10</a>
                <a href='/?speed=50'>50</a>
                {/* <button onClick={() => reloadWindowWithNewSpeed(10)}><a href='/?speed=10'>10</a></button> */}
                {/* <button>50</button> */}
              </div>
              <div>
                <a href='/?speed=200'>200</a>
                <a href='/?speed=1000'>1000</a>
                {/* <button>200</button>
                <button>1000</button> */}
              </div>
            </section>
            <section className={navStyles.detailsContainer}>
              <details>
                <summary>About</summary>
                <section>
                  <p>This project uses the hand pose detection model from TensorFlow to identify a single hand using a webcam. The positional x and y coordinates from the hands vector data is then referenced by the three.js object to drive its rotation vector values.</p>
                  <p>Consider this the 'hello world' of this use case. There's so much data generated about the position of the hands which would allow for <em>actual</em> gesture detection. Using the hand positional data for the position and that of the rotation for the rotation instead of reversing it like I have here would be neat. There's a lot you could do, but I have no <em>actual</em> use for this, so I'm moving on to different project.</p>

        

                </section>
              </details>
            </section>

          </nav>
        }
      <main >
        
      <div
            style={{
              width: '100vw',
              height: '100%'
              // width:
              // width: 640,
              //  height: 480,
              // width: '100vw', height: 480,
            }}
            className={`${mainStyles.threeCanvasContainer} ${mainStyles.box}`}
            >
            
            {/* <Suspense> <Model/> </Suspense> */}
          <Canvas>
            <CameraController />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Boxy />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1}/>
          </Canvas>
          </div>
            <Webcam 
              ref={webcamRef} 
              className={`${mainStyles.webcamElement}`}
              style={{
                // textAlign: 'center',
                zIndex:9,
                // width: 640,
                width: '100vw',
                maxWidth: '400px'
                // height: 480,
                // objectFit: 'cover'
              }}
            />
        
          
      </main>
    </div>
  )
}
