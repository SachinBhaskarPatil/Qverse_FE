'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-gray-800/30 p-8 rounded-2xl shadow-xl border border-gray-700/50"
            >
                <h1 className="text-3xl font-bold text-gray-100 mb-8">Refund & Cancellations Policy</h1>

                <div className="space-y-8 text-gray-300">
                    <section className="space-y-4">
                        <p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service
                            that you have purchased through the Platform. Under this policy:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cancellations will only be considered if the request is made 7 days of placing the order. However,
                                cancellation requests may not be entertained if the orders have been communicated to such sellers /
                                merchant(s) listed on the Platform and they have initiated the process of shipping them, or the
                                product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</li>
                            <li>Creatonomy Live Technologies Private Limited does not accept cancellation requests for
                                perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the
                                user establishes that the quality of the product delivered is not good.</li>
                            <li>In case of receipt of damaged or defective items, please report to our customer service team. The
                                request would be entertained once the seller/ merchant listed on the Platform, has checked and
                                determined the same at its own end. This should be reported within 7 days of receipt of products.
                                In case you feel that the product received is not as shown on the site or as per your expectations,
                                you must bring it to the notice of our customer service within 7 days of receiving the product. The
                                customer service team after looking into your complaint will take an appropriate decision</li>
                            <li>In case of complaints regarding the products that come with a warranty from the manufacturers,
                                please refer the issue to them.</li>
                            <li>In case of any refunds approved by Creatonomy Live Technologies Private Limited, it will take
                                7 days for the refund to be processed to you.</li>
                        </ul>
                    </section>

                    <h1 className="text-3xl font-bold text-gray-100 mb-8">Return Policy</h1>
                    <section className="space-y-4">
                        <p>We offer refund / exchange within first 7 days from the date of your purchase. If 7 days have passed
                            since your purchase, you will not be offered a return, exchange or refund of any kind. In order to become
                            eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as
                            you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale,
                            then the item may not be eligible for a return / exchange. Further, only such items are replaced by us
                            (based on an exchange request), if such items are found defective or damaged.</p>
                        <p>You agree that there may be a certain category of products / items that are exempted from returns or
                            refunds. Such categories of the products would be identified to you at the item of purchase. For exchange
                            / return accepted request(s) (as applicable), once your returned product / item is received and inspected
                            by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further.
                            If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will
                            be processed in accordance with our policies.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-100">Contact Information</h2>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p>Email: kaushik@zo.live</p>
                            <p>Phone: +91 6366460460</p>
                            <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                        </div>
                    </section>

                    <section className="mt-8 pt-8 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            This refund policy was last updated on November 27, 2024. We reserve the right to modify these terms at any time.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}