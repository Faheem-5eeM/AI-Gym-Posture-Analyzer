import React, { useRef, useEffect, useState } from "react";
// import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
// import { Pose } from '@mediapipe/pose';
// import { Camera } from '@mediapipe/camera_utils';
// import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import "./App.css";

// const PoseDetectionApp = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const [currentExercise, setCurrentExercise] = useState('pushups');
//   const [feedback, setFeedback] = useState('');
//   const [repCount, setRepCount] = useState(0);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [poseDetector, setPoseDetector] = useState(null);
//   const [exerciseState, setExerciseState] = useState('neutral');
//   const [mediaPipeStatus, setMediaPipeStatus] = useState('Loading...');
//   const [camera, setCamera] = useState(null);
//   const [lastRepTime, setLastRepTime] = useState(0);

//   // Exercise configurations
//   const exercises = {
//     pushups: {
//       name: 'Push-ups',
//       keyPoints: ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist'],
//       instructions: 'Keep your body in a straight line. Lower chest to ground, then push up.'
//     },
//     squats: {
//       name: 'Squats',
//       keyPoints: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
//       instructions: 'Keep knees aligned with toes. Lower hips back and down, chest up.'
//     },
//     planks: {
//       name: 'Planks',
//       keyPoints: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip', 'left_ankle', 'right_ankle'],
//       instructions: 'Maintain straight line from head to heels. Engage core muscles.'
//     }
//   };

//   // Initialize MediaPipe Pose
//   useEffect(() => {
//     const initializePose = async () => {
//       try {
//         console.log('Initializing MediaPipe Pose...');

//         const pose = new Pose({
//           locateFile: (file) => {
//             return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//           }
//         });

//         await pose.setOptions({
//           modelComplexity: 1,
//           smoothLandmarks: true,
//           enableSegmentation: false,
//           smoothSegmentation: false,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         pose.onResults(onPoseResults);
//         setPoseDetector(pose);
//         setMediaPipeStatus('Ready');
//         console.log('MediaPipe Pose initialized successfully');
//       } catch (error) {
//         console.error('Failed to initialize pose detection:', error);
//         setMediaPipeStatus('Error: ' + error.message);
//       }
//     };

//     initializePose();

//     // Cleanup
//     return () => {
//       if (poseDetector) {
//         poseDetector.close && poseDetector.close();
//       }
//     };
//   }, []);

//   // Pose analysis results handler
//   const onPoseResults = (results) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw video frame
//     ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//     if (results.poseLandmarks) {
//       drawPose(ctx, results.poseLandmarks);
//       analyzePose(results.poseLandmarks);
//     }
//   };

//   // Draw pose landmarks and connections
//   const drawPose = (ctx, landmarks) => {
//     // Use MediaPipe's built-in drawing utilities if available
//     if (window.drawConnectors && window.drawLandmarks) {
//       // Define pose connections (MediaPipe format)
//       const POSE_CONNECTIONS = [
//         [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
//         [11, 23], [12, 24], [23, 24], // Torso
//         [23, 25], [25, 27], [24, 26], [26, 28], // Legs
//         [25, 27], [26, 28], [23, 25], [24, 26] // Additional connections
//       ];

//       // Draw connections
//       ctx.save();
//       window.drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
//         color: '#00ff00',
//         lineWidth: 2
//       });

//       // Draw landmarks
//       window.drawLandmarks(ctx, landmarks, {
//         color: '#ff0000',
//         lineWidth: 2,
//         radius: 3
//       });
//       ctx.restore();
//     } else {
//       // Fallback to custom drawing
//       const connections = [
//         [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
//         [11, 23], [12, 24], [23, 24], // Torso
//         [23, 25], [25, 27], [24, 26], [26, 28] // Legs
//       ];

//       ctx.strokeStyle = '#00ff00';
//       ctx.lineWidth = 2;

//       connections.forEach(([start, end]) => {
//         const startPoint = landmarks[start];
//         const endPoint = landmarks[end];
//         if (startPoint && endPoint && startPoint.visibility > 0.5 && endPoint.visibility > 0.5) {
//           ctx.beginPath();
//           ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
//           ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
//           ctx.stroke();
//         }
//       });

//       // Draw landmarks
//       ctx.fillStyle = '#ff0000';
//       landmarks.forEach((landmark, index) => {
//         if (landmark.visibility > 0.5) {
//           ctx.beginPath();
//           ctx.arc(
//             landmark.x * ctx.canvas.width,
//             landmark.y * ctx.canvas.height,
//             3,
//             0,
//             2 * Math.PI
//           );
//           ctx.fill();
//         }
//       });
//     }
//   };

//   // Analyze pose for the current exercise
//   const analyzePose = (landmarks) => {
//     const exercise = exercises[currentExercise];
//     let feedbackText = '';
//     let isGoodForm = true;
//     const currentTime = Date.now();

//     if (currentExercise === 'pushups') {
//       const leftShoulder = landmarks[11];
//       const rightShoulder = landmarks[12];
//       const leftElbow = landmarks[13];
//       const rightElbow = landmarks[14];
//       const leftWrist = landmarks[15];
//       const rightWrist = landmarks[16];

//       if (leftShoulder && rightShoulder && leftElbow && rightElbow && leftWrist && rightWrist) {
//         // Calculate average positions
//         const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
//         const elbowY = (leftElbow.y + rightElbow.y) / 2;
//         const wristY = (leftWrist.y + rightWrist.y) / 2;

//         // Use wrist position relative to shoulder for better detection
//         const wristToShoulderDiff = wristY - shoulderY;

//         // Debug output - check browser console
//         console.log('🔍 Push-up Debug:', {
//           shoulderY: shoulderY.toFixed(3),
//           wristY: wristY.toFixed(3),
//           wristToShoulderDiff: wristToShoulderDiff.toFixed(3),
//           exerciseState,
//           repCount
//         });

//         // Detect down position (wrists lower than shoulders)
//         if (wristToShoulderDiff > 0.03) {
//           feedbackText = '⬇️ DOWN POSITION DETECTED';
//           if (exerciseState !== 'down') {
//             console.log('🟡 STATE CHANGE: neutral/up → down');
//             setExerciseState('down');
//           }
//         }
//         // Detect up position (wrists higher than shoulders)
//         else if (wristToShoulderDiff < -0.02) {
//           feedbackText = '⬆️ UP POSITION';
//           if (exerciseState === 'down') {
//             console.log('🎉 REP COMPLETED! Counting rep...');
//             setRepCount(prev => {
//               const newCount = prev + 1;
//               console.log('📊 NEW REP COUNT:', newCount);
//               return newCount;
//             });
//             setExerciseState('up');
//             setLastRepTime(currentTime);
//           }
//         }
//         // Middle position
//         else {
//           feedbackText = `🔄 MIDDLE (diff: ${wristToShoulderDiff.toFixed(3)})`;
//         }
//       } else {
//         feedbackText = '❌ Can\'t detect all body parts - position yourself better';
//       }
//     }

//     else if (currentExercise === 'squats') {
//       const leftHip = landmarks[23];
//       const rightHip = landmarks[24];
//       const leftKnee = landmarks[25];
//       const rightKnee = landmarks[26];

//       if (leftHip && rightHip && leftKnee && rightKnee) {
//         const hipY = (leftHip.y + rightHip.y) / 2;
//         const kneeY = (leftKnee.y + rightKnee.y) / 2;
//         const hipToKneeDiff = hipY - kneeY;

//         // Debug output
//         console.log('🔍 Squat Debug:', {
//           hipY: hipY.toFixed(3),
//           kneeY: kneeY.toFixed(3),
//           hipToKneeDiff: hipToKneeDiff.toFixed(3),
//           exerciseState,
//           repCount
//         });

//         // Detect down position (hips lower than knees)
//         if (hipToKneeDiff > 0.03) {
//           feedbackText = '⬇️ SQUAT DOWN POSITION';
//           if (exerciseState !== 'down') {
//             console.log('🟡 STATE CHANGE: neutral/up → down (squat)');
//             setExerciseState('down');
//           }
//         }
//         // Detect up position (hips higher than knees)
//         else if (hipToKneeDiff < -0.02) {
//           feedbackText = '⬆️ STANDING UP';
//           if (exerciseState === 'down') {
//             console.log('🎉 SQUAT REP COMPLETED!');
//             setRepCount(prev => {
//               const newCount = prev + 1;
//               console.log('📊 NEW SQUAT REP COUNT:', newCount);
//               return newCount;
//             });
//             setExerciseState('up');
//             setLastRepTime(currentTime);
//           }
//         }
//         // Middle position
//         else {
//           feedbackText = `🔄 SQUAT MIDDLE (diff: ${hipToKneeDiff.toFixed(3)})`;
//         }
//       } else {
//         feedbackText = '❌ Can\'t detect hips/knees - stand in full view';
//       }
//     }

//     setFeedback(feedbackText);
//   };

//   // Audio feedback
//   const playAudioFeedback = (type) => {
//     if (!isAudioEnabled) return;

//     try {
//       // Create new AudioContext each time to avoid issues
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//       // Check if AudioContext is supported and can be created
//       if (audioContext.state === 'suspended') {
//         audioContext.resume();
//       }

//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);

//       if (type === 'rep') {
//         oscillator.frequency.value = 800;
//         gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
//         oscillator.start();
//         oscillator.stop(audioContext.currentTime + 0.2);
//       } else if (type === 'correction') {
//         oscillator.frequency.value = 400;
//         gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
//         oscillator.start();
//         oscillator.stop(audioContext.currentTime + 0.3);
//       }

//       // Clean up AudioContext after use
//       setTimeout(() => {
//         audioContext.close();
//       }, 1000);

//     } catch (error) {
//       console.warn('Audio playback failed:', error);
//       // Silently fail audio - don't break the app
//     }
//   };

//   // Start/stop camera and pose detection
//   const toggleDetection = async () => {
//     if (!isRunning && poseDetector) {
//       try {
//         // Using MediaPipe Camera utility for better integration
//         if (Camera) {
//           const cameraInstance = new Camera(videoRef.current, {
//             onFrame: async () => {
//               if (poseDetector && videoRef.current) {
//                 await poseDetector.send({ image: videoRef.current });
//               }
//             },
//             width: 640,
//             height: 480
//           });

//           await cameraInstance.start();
//           setCamera(cameraInstance);
//         } else {
//           // Fallback to standard getUserMedia
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: { width: 640, height: 480 }
//           });
//           videoRef.current.srcObject = stream;

//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             processVideo();
//           };
//         }

//         setIsRunning(true);
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//         alert('Could not access camera. Please check permissions.');
//       }
//     } else {
//       // Stop camera
//       if (camera) {
//         camera.stop();
//         setCamera(null);
//       } else {
//         const stream = videoRef.current?.srcObject;
//         if (stream) {
//           stream.getTracks().forEach(track => track.stop());
//         }
//       }
//       setIsRunning(false);
//     }
//   };

//   // Process video frames
//   const processVideo = async () => {
//     if (!isRunning || !poseDetector || !videoRef.current) {
//       console.log('Not processing - missing requirements:', {
//         isRunning,
//         poseDetector: !!poseDetector,
//         video: !!videoRef.current
//       });
//       return;
//     }

//     try {
//       // Ensure video is ready
//       if (videoRef.current.readyState >= 2) {
//         await poseDetector.send({ image: videoRef.current });
//       }
//     } catch (error) {
//       console.error('Error processing video frame:', error);
//     }

//     // Continue processing if still running
//     if (isRunning) {
//       requestAnimationFrame(processVideo);
//     }
//   };

//   // Reset rep counter
//   const resetCounter = () => {
//     setRepCount(0);
//     setExerciseState('neutral');
//     setLastRepTime(0);
//     console.log('Counter reset');
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//             AI Gym Posture Trainer
//           </h1>
//           <p className="text-gray-300">Real-time posture correction with AI-powered feedback</p>
//         </header>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Video Feed */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-800 rounded-lg p-4">
//               <div className="relative mb-4">
//                 <video
//                   ref={videoRef}
//                   className="hidden"
//                   width="640"
//                   height="480"
//                 />
//                 <canvas
//                   ref={canvasRef}
//                   width="640"
//                   height="480"
//                   className="w-full h-auto bg-black rounded border border-gray-600"
//                 />
//                 {!isRunning && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
//                     <p className="text-gray-300">Camera feed will appear here</p>
//                   </div>
//                 )}
//               </div>

//               {/* Controls */}
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={toggleDetection}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
//                     isRunning
//                       ? 'bg-red-600 hover:bg-red-700'
//                       : 'bg-green-600 hover:bg-green-700'
//                   }`}
//                 >
//                   {isRunning ? <Pause size={20} /> : <Play size={20} />}
//                   {isRunning ? 'Stop' : 'Start'} Training
//                 </button>

//                 <button
//                   onClick={resetCounter}
//                   className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <RotateCcw size={20} />
//                   Reset
//                 </button>

//                 <button
//                   onClick={() => setIsAudioEnabled(!isAudioEnabled)}
//                   className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
//                     isAudioEnabled
//                       ? 'bg-blue-600 hover:bg-blue-700'
//                       : 'bg-gray-600 hover:bg-gray-700'
//                   }`}
//                 >
//                   {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Control Panel */}
//           <div className="space-y-6">
//             {/* MediaPipe Status */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-2">AI Status</h3>
//               <div className={`text-sm p-2 rounded ${
//                 mediaPipeStatus === 'Ready'
//                   ? 'bg-green-900 text-green-200'
//                   : mediaPipeStatus.includes('Error')
//                   ? 'bg-red-900 text-red-200'
//                   : 'bg-yellow-900 text-yellow-200'
//               }`}>
//                 {mediaPipeStatus}
//               </div>
//             </div>

//             {/* Exercise Selection */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-4">Exercise</h3>
//               <select
//                 value={currentExercise}
//                 onChange={(e) => setCurrentExercise(e.target.value)}
//                 className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
//               >
//                 {Object.entries(exercises).map(([key, exercise]) => (
//                   <option key={key} value={key}>
//                     {exercise.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Rep Counter */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-2">Rep Counter</h3>
//               <div className="text-3xl font-bold text-center text-blue-400">
//                 {repCount}
//               </div>
//             </div>

//             {/* Instructions */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-2">Instructions</h3>
//               <p className="text-gray-300 text-sm">
//                 {exercises[currentExercise].instructions}
//               </p>
//             </div>

//             {/* Live Feedback */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-2">Live Feedback</h3>
//               <div className={`p-3 rounded text-sm ${
//                 feedback.includes('good') || feedback.includes('Good')
//                   ? 'bg-green-900 text-green-200'
//                   : 'bg-yellow-900 text-yellow-200'
//               }`}>
//                 {feedback || 'Start exercising to get feedback...'}
//               </div>
//             </div>

//             {/* Exercise Stats */}
//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-2">Session Stats</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Current Exercise:</span>
//                   <span className="text-blue-400">{exercises[currentExercise].name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total Reps:</span>
//                   <span className="text-green-400">{repCount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Audio Feedback:</span>
//                   <span className={isAudioEnabled ? 'text-green-400' : 'text-gray-400'}>
//                     {isAudioEnabled ? 'On' : 'Off'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="text-center mt-8 text-gray-400 text-sm">
//           <p>AI Gym Trainer - Keep your form perfect, one rep at a time!</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default PoseDetectionApp;

function App() {
  const [liveVideo, setLiveVideo] = useState(false);
  const [reps, setReps] = useState(0);
  const [form, setForm] = useState('N/A');
  const [accuracy, setAccuracy] = useState(0);

   useEffect(() => {
    let eventSource;
    if (liveVideo) {
      // Create a new EventSource connection to our /data route
      eventSource = new EventSource("http://localhost:5000/data");
      console.log("Event source working")

      // Listen for messages from the server
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Update state with the new data
        setReps(data.reps);
        setForm(data.form);
        setAccuracy(data.accuracy);
      };

      // Handle any errors
      eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
      };
    }

    // This cleanup function will be called when the component unmounts
    // or when liveVideo becomes false
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [liveVideo]); // This effect depends on the liveVideo state


  async function onPress()  {
   setLiveVideo(true);
   fetch("http://localhost:5000/video", {
      method: "GET",
    });
  }
  async function stopWorkout(){
    setLiveVideo(false);
    setReps(0);
    setForm('N/A');
    setAccuracy(0);
    await fetch("http://localhost:5000/stop", {
      method: "POST",
    });
  }
  return (
    <div className="min-h-screen text-center flex flex-col gap-10 items-center bg-black">
      <h1 className="text-blue-500 text-3xl font-heading font-bold mt-10">AI Gym Posture Analyzer</h1>
      <span>
      <button className="border-2    bg-red-500 m-4 hover:shadow-lg shadow-gray-500/80 rounded-lg p-3 hover:cursor-pointer" onClick={onPress} >Start Workout</button>
       <button className="border-2 hover:shadow-lg shadow-gray-500/80 bg-red-500 rounded-lg p-3 hover:cursor-pointer" onClick={stopWorkout} >Stop Workout</button>
      </span>
      { liveVideo === true?
      <div className="m-4 mb-2 ">
        <img
          src="http://localhost:5000/video"
          alt="AI Gym Trainer"
          className="rounded-lg shadow-lg border-4 border-orange-500  "
        />
      </div>:  <div></div>
      }
      {liveVideo && (
          <div className="m-3 mt-1 p-4 bg-gray-800 rounded-lg shadow-lg text-left text-2xl w-80 text-white">
            <h2 className="text-3xl font-bold mb-3 text-orange-500 text-center">WORKOUT STATS</h2>
            <div className="mb-2">
              <p className="font-semibold">REPS:</p>
              <p className="text-3xl font-bold text-green-400">{reps}</p>
            </div>
            <div className="mb-2">
              <p className="font-semibold">FORM:</p>
              <p className={`text-3xl font-bold ${form === 'Good Form' ? 'text-green-400' : 'text-red-500'}`}>{form}</p>
            </div>
            <div>
              <p className="font-semibold">ACCURACY:</p>
              <p className={`text-3xl font-bold ${accuracy > 85 ? 'text-green-400' : 'text-yellow-500'}`}>{accuracy}%</p>
            </div>
          </div>
        )}
    </div>
  );
}
export default App;
