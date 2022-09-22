import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import mainStyles from '../styles/Main.module.scss'

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
function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  // const [hovered, hover] = useState(false)
  // const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // useFrame((gl, delta) => (props.handRotation))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      scale={1}
      // onClick={(event) => click(!clicked)}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
      >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  )
}


export default function Home() {
  const router = useRouter()
  console.log('component render')
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [handData, setHandData] = useState(null)
  const handPositionRef = useRef([0,0,0])
  const [webcamReady, setWebcamReady] = useState(false)
  const webcamReadyRef = useRef(false)
  const videoRef = useRef(null)
  // const [updateSpeed, setUpdateSpeed] = useState(500)
  // const updateSpeed = useRef(router.query.speed)
  const updateSpeed = useRef(null)
  // const [updateSpeed, setUpdateSpeed] = useState(router.query.speed)
  const [vectorFromHandData, setVectorFromHandData] = useState([0,0,0])

  // const [windowSize, setWindowSize] = useState();


  // console.log(windowSize.innerWidth)
  // console.log(windowSize.innerHeight)

  const runHandPose = async () => {
    const net = await handpose.load({
      inputResolution:{width:640, height:480}, 
      // inputResolution:{width:900, height:480}, 
      scale:.25
    })
    // console.log(updateSpeed)
    setInterval(() => {
      detectHand(net)
    }, updateSpeed.current)
    // }, 200)
    
  }
  console.log('yeah')
  // console.log(updateSpeed)
  // ?speed=1000
  
  function Boxy(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    // const [hovered, hover] = useState(false)
    // const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    
    useFrame((state, delta) => {
      ref.current.rotation.x = handPositionRef.current[0]
      ref.current.rotation.y = handPositionRef.current[2]
    })
    
    // useFrame(({ gl, scene, camera }) => (ref.current.rotation.x = handPositionRef.current[0]));
    
    // useFrame((gl, delta) => (props.handRotation))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      scale={1}
      // onClick={(event) => click(!clicked)}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
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
      webcamReadyRef.current == true 
      &&
      webcamRef.current.video.readyState === 4
      
      ) {
        // console.log('webcam check passed')
        // const video = webcamRef.current.video
        // const videoWidth = webcamRef.current.video.videoWidth
        // const videoHeight = webcamRef.current.video.videoHeight
        // webcamRef.current.video.width = videoWidth
        // webcamRef.current.video.height = videoHeight
        
        // console.log(updateSpeed)
        
        const hand = await net.estimateHands(videoRef.current)
        if (hand[0]) {
          handPositionRef.current = [
            (Math.round(hand[0].annotations.indexFinger[0][1]) / 50),
            0,
            (Math.round(hand[0].annotations.indexFinger[0][0]) / 100)
          ]
          // console.log(handPositionRef.current)
          // setHandData(hand[0])
          // setVectorFromHandData(
          //   [
          //     (Math.round(hand[0].annotations.indexFinger[0][1]) / 50),
          //     0,
          //     (Math.round(hand[0].annotations.indexFinger[0][0]) / 100)
          //   ]
          // )


        } else {
          // setHandData(null)
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
        // && 
        // webcamRef.current.video.readyState === 4
        ) {
          console.log('check webcam success')

          const video = webcamRef.current.video
          const videoWidth = webcamRef.current.video.videoWidth
          const videoHeight = webcamRef.current.video.videoHeight
          videoRef.current = video

          webcamRef.current.video.width = videoWidth
          webcamRef.current.video.height = videoHeight
          // canvasRef.current.width = videoWidth
          // canvasRef.current.height = videoHeight

          setWebcamReady(true)
          webcamReadyRef.current = true
          // setUpdateSpeed(router.query.speed)
          if (router.query.speed) {
            updateSpeed.current = router.query.speed

          } else {
            updateSpeed.current = defaultSpeed
          }

          runHandPose()
        }
    }
    checkWebcam()
  }, [router.query])
  

  return (
    <div className={mainStyles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className={mainStyles.main}> */}
      <main >
        
        <Webcam ref={webcamRef} style={
              {
                  textAlign: 'center',
                  zIndex:9,
                  width: 640,
                  height: 480,
              }
            }/>
          <section>
            <h1>yeah title</h1>
            <button>button</button>

          </section>
          <div
            style={{
              width: 640,
              // width: '100vw',
              // height: 480,
              height: '33vh',
            }}
          >
            
          <Canvas>
            <CameraController />
            {/* <Suspense>
                <Model/>
            </Suspense> */}

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight 
            position={[-10, -10, -10]} 
            />

            {/* <Box position={[-1.2, 0, 0]} /> */}
            <Boxy 
                position={[0, 0, 0]} 
            />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1}/>
          </Canvas>
          </div>
      </main>
    </div>
  )
}
