import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, {Suspense, useRef, useEffect, useState} from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'

import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  console.log('component render')
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [handData, setHandData] = useState(null)
  const handPositionRef = useRef([0,0,0])
  const [webcamReady, setWebcamReady] = useState(false)
  const webcamReadyRef = useRef(false)
  const videoRef = useRef(null)

  const [vectorFromHandData, setVectorFromHandData] = useState([0,0,0])

  const runHandPose = async () => {
    const net = await handpose.load({
      inputResolution:{width:640, height:480}, 
      scale:.5
    })

    setInterval(() => {
      detectHand(net)
    }, 200)
    
  }

  // console.log(handPositionRef.current)

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


        const hand = await net.estimateHands(videoRef.current)
        if (hand[0]) {
          console.log('HAND DETECTED')
          // console.log('hand in sight')
          // console.log(hand)
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



  useEffect(() => {
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
          runHandPose()
        }
    }
    checkWebcam()
  }, [])
  // }, [webcamRef.current])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Webcam ref={webcamRef} style={
            {
                // position: 'absolute',
                // marginLeft: 'auto',
                // marginRight: 'auto',
                // left: 0,
                // right: 0,
                textAlign: 'center',
                zIndex:9,
                width: 640,
                height: 480,
            }
          }/>
        {/* <canvas ref={canvasRef} style={
         {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex:9,
            width: 640,
            height: 480,
          }
        }/> */}
        
        <div
          style={{
            width: 640,
            height: 480,
            // backgroundColor: 'red'
          }}
        >
          
        <Canvas>
          <CameraController />
          {/* <Suspense>
              <Model/>
          </Suspense> */}

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />

          {/* <Box position={[-1.2, 0, 0]} /> */}
          <Boxy 
            // position={[
            //     (handPositionRef.current[2]/ 5),
            //     (handPositionRef.current[0]/ 5),
            //     0,
            //   ]} 
            // position={[
            //     (vectorFromHandData[2]/ 5),
            //     (vectorFromHandData[0]/ 5),
            //     0,
            //   ]} 
              // rotation={[1, 3, 50]}
              // rotation={vectorFromHandData}
              // handRotation={handPositionRef.current}
              position={[0, 0, 0]} 
            // position={handPositionRef.current}
            rotation={handPositionRef.current}
            // rotation={
            //   [
            //     `${handData ? (Math.round(handData.annotations.indexFinger[0][1]) / 50) : 0}`, 
            //     0,
            //     `${handData ? (Math.round(handData.annotations.indexFinger[0][0]) / 100) : 0}`, 
            //   ]}
          />
        </Canvas>
        </div>
        
        {/* {
          handData &&
        // <h1>finger position is {typeof handData.annotations.indexFinger[0][0]}</h1>
        <h1>finger position is {Math.round(handData.annotations.indexFinger[0][0])}</h1>
        } */}

    </div>
  )
}
