# 3D object manipulation in-browser using TensorFlow's hand pose detection machine learning model

- Render 3D object using Threejs
- Gather data about a hands position in a webcam frame using TensorFlow
- Drive the rotation vector of the 3D object using the positional data of the hand
- Ability to use a url parameter to set the detection speed
- Orbit controls using drei

## This is the 'hello world' of this concept
There is a TON you could do with it, but ultimately I have zero real-world use case for this so I'm moving on to more important projects. 

## Performance concerns when using both 3D rendering and machine learning in the browser

I avoided using state to drive anything because performance was already heavy considering the combination of real-time 3D rendering and machine learning in the browser. I used a reference (useRef) in combination with React Three Fiber's useFrame hook which renders independently from React, saving me 

## About the code

It's pretty simple.

1. A check is done to make sure the webcam works
2. A check is done to see if any custom speed has been specified with a url parameter
3. The model is loaded and an interval is started at the selected speed which calls the detectHand() function
4. The detectHand() function gathers data (which is actually just the index finger, but it needs enough of the hand in frame to determine that it's an index finger) and stores a reference to it




https://www.tensorflow.org/js/models