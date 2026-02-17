import type { Exercise } from '../types';

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'ex-chair-squats',
    name: 'Chair Squats',
    description:
      'A lower-body strengthening exercise using a chair for support and guidance.',
    instructions:
      'Stand in front of a sturdy chair with feet shoulder-width apart. Slowly lower your hips back and down as if sitting in the chair. Lightly touch the seat, then press through your heels to stand back up. Repeat 8\u201312 times.',
    category: 'strength',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-wall-push-ups',
    name: 'Wall Push-ups',
    description:
      'An upper-body exercise performed against a wall, easier on the joints than floor push-ups.',
    instructions:
      "Stand arm\u2019s length from a wall with palms flat against it at shoulder height. Bend your elbows to bring your chest toward the wall. Push back to the starting position. Repeat 10\u201315 times.",
    category: 'strength',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-heel-raises',
    name: 'Heel Raises',
    description:
      'Strengthens calf muscles and improves balance by rising onto your toes.',
    instructions:
      'Stand behind a chair and hold the back for support. Slowly rise up onto your toes as high as comfortable. Hold for 2 seconds, then lower back down. Repeat 10\u201315 times.',
    category: 'strength',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-marching-in-place',
    name: 'Marching in Place',
    description:
      'A gentle cardio exercise that raises your heart rate without impact.',
    instructions:
      'Stand tall with feet hip-width apart. Lift one knee toward your chest, then lower it. Alternate legs in a marching motion. Continue for 1\u20133 minutes at a comfortable pace.',
    category: 'cardio',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-seated-leg-raises',
    name: 'Seated Leg Raises',
    description:
      'Strengthens the quadriceps while seated, ideal for those with limited mobility.',
    instructions:
      'Sit in a sturdy chair with feet flat on the floor. Slowly extend one leg out straight and hold for 3 seconds. Lower the leg back down. Repeat 10 times on each leg.',
    category: 'strength',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-arm-circles',
    name: 'Arm Circles',
    description:
      'A shoulder flexibility exercise that warms up the upper body.',
    instructions:
      'Stand with arms extended straight out to the sides. Make small forward circles for 15 seconds. Reverse direction for another 15 seconds. Gradually increase circle size if comfortable.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-neck-stretches',
    name: 'Neck Stretches',
    description:
      'Gentle stretches to relieve neck tension and improve range of motion.',
    instructions:
      'Sit or stand with good posture. Slowly tilt your head toward one shoulder and hold for 15 seconds. Return to centre, then tilt toward the other shoulder. Repeat 3 times on each side.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-ankle-rotations',
    name: 'Ankle Rotations',
    description:
      'Improves ankle mobility and helps prevent stiffness.',
    instructions:
      'Sit in a chair and lift one foot slightly off the ground. Rotate your ankle clockwise 10 times. Rotate counter-clockwise 10 times. Switch to the other foot and repeat.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-standing-balance',
    name: 'Standing Balance',
    description:
      'A single-leg balance hold that strengthens stabilizer muscles and reduces fall risk.',
    instructions:
      'Stand next to a chair or countertop for support. Lift one foot a few inches off the ground. Hold for 10\u201330 seconds, focusing on a fixed point ahead. Switch legs and repeat. Aim for 3 holds per side.',
    category: 'balance',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-shoulder-shrugs',
    name: 'Shoulder Shrugs',
    description:
      'Relieves upper back tension by raising and lowering the shoulders.',
    instructions:
      'Stand or sit with arms at your sides. Raise both shoulders up toward your ears. Hold for 2 seconds, then relax them down. Repeat 10\u201315 times.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-bicep-curls',
    name: 'Bicep Curls (Light)',
    description:
      'Arm strengthening using light weights or water bottles.',
    instructions:
      'Hold a light weight (1\u20133 lbs) or water bottle in each hand. Stand with arms at your sides, palms facing forward. Slowly curl the weights toward your shoulders. Lower back down with control. Repeat 10\u201312 times.',
    category: 'strength',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-toe-touches',
    name: 'Toe Touches',
    description:
      'A standing forward bend to stretch the hamstrings and lower back.',
    instructions:
      'Stand with feet hip-width apart. Slowly bend forward at the hips, reaching toward your toes. Go only as far as comfortable \u2014 do not force the stretch. Hold for 15 seconds, then slowly return to standing.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'intermediate',
    source: 'default',
  },
  {
    id: 'ex-side-bends',
    name: 'Side Bends',
    description:
      'Stretches the obliques and improves lateral flexibility.',
    instructions:
      'Stand with feet shoulder-width apart, one hand on your hip. Raise the other arm overhead. Slowly lean to the side of the hand on your hip. Hold for 10 seconds, return to centre, and switch sides. Repeat 5 times each.',
    category: 'flexibility',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-knee-lifts',
    name: 'Knee Lifts',
    description:
      'A standing balance and cardio exercise that works the core and hip flexors.',
    instructions:
      'Stand tall, holding a chair or wall for support if needed. Lift one knee up toward your chest. Lower it slowly, then lift the other knee. Alternate for 1\u20132 minutes at a steady pace.',
    category: 'balance',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
  {
    id: 'ex-hip-circles',
    name: 'Hip Circles',
    description:
      'Loosens the hip joints and improves range of motion.',
    instructions:
      'Stand with feet shoulder-width apart, hands on hips. Make large, slow circles with your hips clockwise. Complete 10 circles, then reverse direction. Keep your upper body as still as possible.',
    category: 'balance',
    image_uri: null,
    difficulty_level: 'beginner',
    source: 'default',
  },
];
