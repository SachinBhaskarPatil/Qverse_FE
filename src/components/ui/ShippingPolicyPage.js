'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-gray-800/30 p-8 rounded-2xl shadow-xl border border-gray-700/50"
            >
                <h1 className="text-3xl font-bold text-gray-100 mb-8">Shipping & Delivery Policy</h1>

                <div className="space-y-8 text-gray-300">
                    <section className="space-y-4">
                        <p>The orders for the user are shipped through registered domestic courier companies and/or speed post
                            only. Orders are shipped within 14 days from the date of the order and/or payment or as per the delivery
                            date agreed at the time of order confirmation and delivering of the shipment, subject to courier company /
                            post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company /
                            postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of
                            purchase. Delivery of our services will be confirmed on your email ID as specified at the time of
                            registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be),
                            the same is not refundable.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-100">Contact Us</h2>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p><span className='font-semibold'>Email:</span> kaushik@zo.live</p>
                            <p><span className='font-semibold'>Phone:</span> +91 6366460460</p>
                            <p> <span className='font-semibold' >Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                        </div>
                    </section>

                    <section className="mt-8 pt-8 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            This shipping policy was last updated on November 27, 2024. Shipping rates and methods are subject to change without notice.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}