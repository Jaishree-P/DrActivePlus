import type { NavLink, Treatment, Testimonial, WhyChooseUsItem, DoctorProfile, BlogPost, Patient, ActivityLog } from './types';
import { Activity, Award, Bone, HeartPulse, ShieldCheck, Stethoscope, Users, Zap } from 'lucide-react';

export const navLinks: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/#about', label: 'Doctor' },
  { href: '/#services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
];

export const contactInfo = {
    address: "Above Bommanahalli Milk Producers' Cooperative Society, Bommanahalli Main Road, Bommanahalli, Bengaluru – 560049, Karnataka",
    email: 'info@doctoractiveplus.com',
    phone: '+91 92627 27272',
};

export const WHATSAPP_LINK = 'https://wa.me/919262727272';
export const WHATSAPP_MESSAGE = 'Hello! I would like to inquire about an appointment.';


export const treatments: Treatment[] = [
  {
    slug: 'laser-therapy',
    title: 'Laser Therapy',
    description: 'Advanced laser technology for pain relief and accelerated tissue repair.',
    icon: Zap,
    subTreatments: ["High-Intensity Laser Therapy", "Magnetherapy", "Spinal Decompression", "Matrix Rhythm Therapy", "Targeted Radiofrequency"],
  },
  {
    slug: 'spine-treatment',
    title: 'Spine Treatment',
    description: 'Comprehensive care for a wide range of spinal conditions and back pain.',
    icon: Bone,
    subTreatments: ["Slipped Disc (Herniated Disc)", "Spondylosis", "Spondylolisthesis", "Spinal Stenosis", "Degenerative Disc Disease", "Facet Joint Syndrome", "Kyphosis", "Lordosis", "Scoliosis", "Postural Back Pain", "Myofascial Pain Syndrome", "Tailbone Pain", "Whiplash Injury", "Lumbar Strain", "Radiculopathy"],
  },
  {
    slug: 'venous-treatment',
    title: 'Venous Treatment',
    description: 'Specialized therapies for venous disorders and circulation problems.',
    icon: HeartPulse,
    subTreatments: ["Diabetic Neuropathy", "Varicose Veins", "Peripheral Neuropathy", "Deep Vein Thrombosis", "Chronic Venous Insufficiency", "Restless Leg Syndrome", "Venous Ulcers", "Lymphedema", "Thrombophlebitis", "Post-Thrombotic Syndrome", "Spider Veins", "Foot Drop"],
  },
  {
    slug: 'joints-treatment',
    title: 'Joints Treatment',
    description: 'Effective solutions for arthritis, joint pain, and mobility issues.',
    icon: Users,
    subTreatments: ["Arthritis", "Shoulder Pain", "Knee Pain", "Frozen Shoulder", "Osteoarthritis", "Rheumatoid Arthritis", "Hip Pain", "Elbow Pain", "Ankle Pain", "Joint Stiffness", "Bursitis", "Tendonitis", "Sacroiliac Joint Dysfunction", "Wrist Pain", "Gout"],
  },
  {
    slug: 'sports-treatment',
    title: 'Sports Treatment',
    description: 'Rehabilitation and performance enhancement for athletes of all levels.',
    icon: Activity,
    subTreatments: ["ACL Tear", "Tennis Elbow", "Golfer's Elbow", "Rotator Cuff Injury", "Meniscus Tear", "Ankle Sprain", "Shin Splints", "Hamstring Strain", "Shoulder Dislocation", "Patellar Tendonitis", "Plantar Fasciitis", "Runner's Knee", "Achilles Tendonitis", "Muscle Pain/Tear", "Stress Fractures"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rohan Sharma',
    text: 'Dr. Anil is a true professional. My back pain is completely gone after just a few sessions of laser therapy. Highly recommended!',
    avatar: 'testimonial-1',
  },
  {
    id: '2',
    name: 'Priya Patel',
    text: 'After my ACL injury, I thought I would never play football again. Thanks to the amazing sports treatment here, I am back on the field!',
    avatar: 'testimonial-2',
  },
  {
    id: '3',
    name: 'Amit Singh',
    text: 'The team at Doctor Active Plus is incredibly knowledgeable and caring. They helped me manage my chronic knee pain effectively.',
    avatar: 'testimonial-3',
  },
];

export const whyChooseUs: WhyChooseUsItem[] = [
    {
        title: '20+ Years Experience',
        description: 'Our lead physiotherapist brings over two decades of hands-on expertise.',
        icon: Award,
    },
    {
        title: 'Certified Expert',
        description: 'Fully certified and trained in the latest physiotherapy techniques.',
        icon: ShieldCheck,
    },
    {
        title: 'Advanced Technology',
        description: 'We use state-of-the-art equipment for more effective treatments.',
        icon: Zap,
    },
    {
        title: 'Personalized Care',
        description: 'Every treatment plan is tailored to your specific needs and goals.',
        icon: Stethoscope,
    }
]

export const defaultDoctorProfile: DoctorProfile = {
  name: 'Dr. Anil Kumar',
  title: 'Lead Physiotherapist, BPT, MPT (Ortho)',
  bio: 'Dr. Anil Kumar is a highly experienced and dedicated physiotherapist with over 20 years of practice. He specializes in orthopedic and sports-related injuries, utilizing advanced therapeutic techniques to promote rapid recovery and long-term health. His patient-centered approach ensures that each individual receives personalized care tailored to their unique needs and goals. He is passionate about helping patients regain their mobility and live pain-free lives.',
  qualifications: [
    'Bachelor of Physiotherapy (BPT)',
    'Master of Physiotherapy in Orthopedics (MPT)',
  ],
  specializations: [
    'Spine and Joint Mobilization',
    'High-Intensity Laser Therapy',
    'Sports Injury Rehabilitation',
    'Post-operative Care',
  ],
  certifications: [
    'Certified Kinesio Taping Practitioner',
    'Certified in Dry Needling',
    'Advanced Manual Therapy Techniques',
  ],
};

export const defaultBlogPosts: BlogPost[] = [
    {
        slug: 'understanding-laser-therapy-1721151600898',
        title: 'The Power of Light: Understanding Laser Therapy',
        content: 'High-intensity laser therapy is a revolutionary treatment that uses focused light to stimulate tissue repair and provide pain relief. Discover how this non-invasive technology can help with a variety of musculoskeletal conditions, from acute injuries to chronic pain. Our clinic uses the latest laser equipment to ensure you get the best possible results...',
        author: 'Dr. Anil Kumar',
        date: '2024-05-15T10:00:00Z',
        imageUrl: 'https://picsum.photos/seed/blog1/600/400',
        imageHint: 'wellness article',
    },
    {
        slug: '5-exercises-for-a-healthy-spine-1721151600898',
        title: '5 Simple Exercises for a Healthy Spine',
        content: 'Maintaining a healthy spine is crucial for overall well-being. Regular exercise can help strengthen your back, improve posture, and prevent pain. In this post, we share five simple yet effective exercises that you can do at home to keep your spine in top condition. Remember to consult with a physiotherapist before starting any new exercise regimen...',
        author: 'Dr. Anil Kumar',
        date: '2024-05-10T14:30:00Z',
        imageUrl: 'https://picsum.photos/seed/blog2/600/400',
        imageHint: 'physiotherapy exercise',
    },
    {
        slug: 'recovering-from-a-sports-injury-1721151600898',
        title: 'Road to Recovery: A Guide to Sports Injury Rehab',
        content: 'Getting back in the game after a sports injury requires a structured and professional approach. Rehabilitation is not just about healing; it\'s about returning stronger and more resilient. This guide outlines the key phases of sports injury rehab, from initial assessment and pain management to strength training and sport-specific drills...',
        author: 'Dr. Anil Kumar',
        date: '2024-05-01T09:00:00Z',
        imageUrl: 'https://picsum.photos/seed/blog3/600/400',
        imageHint: 'healthy lifestyle',
    }
];

export const defaultPatients: Patient[] = [];
export const defaultActivityLog: ActivityLog[] = [];
