import React, { useState } from "react"
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function SelfGrowth() {

    const [email, setEmail] = useState("");
    const router = useRouter()

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch('https://api.qverse.life/api/gameplay/suggest_universe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    universe_description: "Self Growth Feature Request",
                    name: "None",
                    email: email
                })
            });

            if (response.ok) {
                toast.success('Thank you for your interest!');
                setEmail("");
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            toast.error('Failed to submit. Please try again later.');
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-white">
            <ToastContainer position="top-center" />
            <main className="max-w-4xl w-full text-center space-y-12 relative z-20">
                <div className="flex items-center gap-2 leading-tight ml-0 sm:ml-20">
                    <div className="w-36 h-[8px] bg-[#FFEDE3] items-center"></div>
                    <span className="text-[#FEB98F] text-sm sm:text-xl font-light font-satoshi">Coming Soon</span>
                </div>

                <h1 className="text-[#2A9D8F] text-[1.85rem] sm:text-6xl font-begort leading-tight">
                    World's best daily self
                    <br />
                    growth, AI companion.
                </h1>

                <p className="text-[#555555] text-[0.8rem] sm:text-xl font-satoshi font-light">
                    Something transformative is coming your way! Share
                    <br />
                    your email and we'll let you know the moment we launch
                </p>
                <div className="space-y-4 max-w-md mx-auto">
                    <div className="relative flex items-center mb-10 sm:mb-28">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full py-3 pr-32 rounded-2xl border text-gray-500 border-gray-100 bg-white focus:outline-none focus:border-[#2A9D8F] text-sm sm:text-lg placeholder:text-gray-400 shadow-sm"
                        />
                        <button
                            onClick={handleSubmit}
                            className=" absolute right-2 bg-[#2A9D8F] text-white px-3 sm:px-5 py-1.5 sm:py-2 text-base sm:text-lg font-['Satoshi'] rounded-xl sm:rounded-2xl hover:bg-[#248277] transition-colors"
                        >
                            Notify Me
                        </button>
                    </div>

                    <div
                        onClick={() => router.push('/other-content')}
                        className="h-12 sm:h-14 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-[#2a9d8f] justify-center items-center gap-2 inline-flex cursor-pointer w-full"
                    >
                        <div className="text-center text-[#2a9d8f] text-sm sm:text-lg font-bold font-['Satoshi'] capitalize leading-normal">
                            check Zo's content capabilities
                        </div>
                        <div>
                            <ArrowOutwardIcon sx={{
                                color: ['#2A9D8F'],
                                fontSize: { xs: 20, sm: 25 }
                            }} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-14 sm:w-36 h-14 sm:h-36 bg-[#FFF] rounded-tr-full z-10" />
                <div className="absolute bottom-0 left-0 w-24 sm:w-64 h-24 sm:h-64 bg-[#FFEDE3] rounded-tr-full z-0" />
                <div className="absolute top-0 right-0 w-14 sm:w-36 h-14 sm:h-36 bg-[#FFF] rounded-bl-full z-10" />
                <div className="absolute top-0 right-0 w-24 sm:w-64 h-24 sm:h-64 bg-[#FFEDE3] rounded-bl-full z-0" />
            </div>
        </div>
    )
}