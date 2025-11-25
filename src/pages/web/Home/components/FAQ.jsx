import React from 'react'

const faqs = [
    {
        q: 'How do I register as a vendor?',
        a: 'Click on Get Started and fill the shop details.',
    },
    {
        q: 'What is the commission rate?',
        a: 'You can customize commission in dashboard settings.',
    },
];

function FAQ() {
    return (
        <>
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
                    {faqs.map((item, i) => (
                        <details key={i} className="mb-4 border-b">
                            <summary className="cursor-pointer py-2 font-semibold">{item.q}</summary>
                            <p className="pl-4 pb-2 text-sm text-gray-600">{item.a}</p>
                        </details>
                    ))}
                </div>
            </section>
        </>
    )
}

export default FAQ
