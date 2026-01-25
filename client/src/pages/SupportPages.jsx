import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

const SupportLayout = ({ title, children }) => (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
        <PageTitle title={title} />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-accent/10">
                <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 text-accent text-center">{title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                    {children}
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

export const FAQ = () => (
    <SupportLayout title="Frequently Asked Questions">
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">How do I place an order?</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark/80">Simply browse our shop, select your favorite treats, and add them to your cart. Proceed to checkout to complete your purchase securely.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Do you offer gluten-free options?</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark/80">Yes! We have a selection of gluten-free cakes and cupcakes. Look for the 'GF' tag in the product description.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Can I customize my cake?</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark/80">Absolutely! Use our 'Designer' tool to create a custom cake with your preferred flavors, colors, and decorations.</p>
            </div>
        </div>
    </SupportLayout>
);

export const Shipping = () => (
    <SupportLayout title="Shipping & Delivery">
        <div className="space-y-6">
            <p>We deliver fresh tailored sweets right to your doorstep!</p>

            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-4">Delivery Areas</h3>
            <p>Currently serving the greater metropolitan area. Check your zip code at checkout to confirm availability.</p>

            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-4">Delivery Times</h3>
            <p>Orders placed before 2 PM are eligible for next-day delivery. Custom cakes require at least 48 hours notice.</p>

            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-4">Shipping Costs</h3>
            <p>Standard delivery is ₹50. Free delivery on orders over ₹1000.</p>
        </div>
    </SupportLayout>
);

export const Privacy = () => (
    <SupportLayout title="Privacy Policy">
        <div className="space-y-4 text-sm">
            <p>At Sweet Delights, we value your privacy.</p>
            <p><strong>Data Collection:</strong> We collect only necessary information to process your orders and improve your experience (name, email, address).</p>
            <p><strong>Data Usage:</strong> Your data is never sold to third parties. We use it strictly for order fulfillment and communication.</p>
            <p><strong>Cookies:</strong> We use cookies to remember your cart and preferences.</p>
            <p>For full details, please contact our support team.</p>
        </div>
    </SupportLayout>
);

export const Terms = () => (
    <SupportLayout title="Terms of Service">
        <div className="space-y-4 text-sm">
            <p>By using our website, you agree to the following terms:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>All content on this site is the property of Sweet Delights.</li>
                <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                <li>Prices for our products are subject to change without notice.</li>
                <li>We utilize secure payment gateways, but we are not liable for external banking errors.</li>
                <li>Cancellations must be made at least 24 hours before the scheduled delivery time.</li>
            </ul>
        </div>
    </SupportLayout>
);
