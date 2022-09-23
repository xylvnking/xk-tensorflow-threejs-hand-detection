:)

# 3D object manipulation in-browser using TensorFlow's hand pose detection machine learning model

- Render 3D object using Threejs
- Gather data about a hands position in a webcam frame using TensorFlow
- Drive the rotation vector of the 3D object using the positional data of the hand
- Ability to use a url parameter to set the detection speed
- Orbit controls using drei

## This is the 'hello world' of this concept

There is a TON you could do with it, but ultimately I have zero real-world use case for this so I'm moving on to more important projects. It was easy enough to get this working properly, but to do anything large scale with a full in browser game or something would be pretty taxing performance wise. It runs really well for what it is but I'd hesitate to build a full-scale game/project with this combination of technologies and expect good performance on weaker machines.

## Optimization and performance concerns when using both 3D rendering and machine learning in the browser

I avoided using state to drive anything because performance was already heavy. I used a reference (useRef) in combination with React Three Fiber's useFrame hook which renders independently from React, saving me from re-renders due to state changes. 

The performance for this project on mobile isn't great. It's a lot to ask of lower end phones. It works but the initial load time is slow

## About the code

It's pretty simple.

1. A check is done to make sure the webcam works
2. A check is done to see if any custom speed has been specified with a url parameter
3. The model is loaded and an interval is started at the selected speed which calls the detectHand() function
4. The detectHand() function gathers data (which is actually just the index finger, but it needs enough of the hand in frame to determine that it's an index finger) and stores a reference to it.
5. ThreeJS then checks the rotational data provided on each frame and drives itself accordingly. 

## Relevant links

[TensorFlow Hand Pose Model](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection)

[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

[Drei (helpers for R3F)](https://github.com/pmndrs/drei)
