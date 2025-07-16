'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API_URL from '@/config';
import axios from 'axios';

export default function ContactUsPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);

        try {
            const response = await axios.post('https://api.qverse.life/api/gameplay/suggest_universe/', {
                universe_description: `\nSupport Query: ${formValues['message']}`,
                name: formValues['name'],
                email: formValues['email'],
            }
            , 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status != 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(response.status);
            

            setSuccessMessage('Thank you for your message. We will get back to you soon!');
            event.target.reset();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-gray-800/30 p-8 rounded-2xl shadow-xl border border-gray-700/50"
                >
                    <div className="space-y-8 text-gray-300">
                        <section className="space-y-4">
                            <h2 className="text-1xl font-bold text-gray-100 mb-8">You may contact us using the information below:</h2>
                            <p><span className='font-semibold'>Legal entity name:</span> Creatonomy Live Technologies Private Limited</p>
                        </section>
                        <section className="space-y-4">
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <p><span className='font-semibold'>Email:</span> kaushik@zo.live</p>
                                <p><span className='font-semibold'>Phone:</span> +91 6366460460</p>
                                <p><span className='font-semibold'>Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                            </div>
                        </section>
                        <section className="mt-8 pt-8 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            This was last updated on November 27, 2024. We reserve the right to modify these terms at any time.
                        </p>
                    </section>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full backdrop-blur-lg bg-gray-800/30 p-8 rounded-[30px] shadow-xl border border-gray-700/50"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-8">
                        Contact Us
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="group"
                        >
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full p-3 bg-white opacity-30 border-1 border-black rounded-[15px] focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 outline-none text-black placeholder-grey-700"
                                placeholder="John Doe"
                            />
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="group"
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full p-3 bg-white opacity-30 border-1 border-black rounded-[15px] focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 outline-none text-black placeholder-grey-700"
                                placeholder="john@example.com"
                            />
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="group"
                        >
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                className="w-full p-3 bg-white opacity-30 border-1 border-black rounded-[15px] focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 outline-none text-black placeholder-grey-700"
                                placeholder="Your message here..."
                            />
                        </motion.div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-full py-3 px-6 text-white font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : 'Send Message'}
                        </button>

                        {successMessage && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-400 text-center mt-4 p-3 bg-green-900/20 rounded-[15px] border border-green-800/50"
                            >
                                {successMessage}
                            </motion.p>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
}