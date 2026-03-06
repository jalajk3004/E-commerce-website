import { Link } from 'react-router-dom';

export default function Footer() {
    const sections = [
        {
            title: 'Shop Collections',
            links: ['New Arrivals', 'Best Sellers', 'Men', 'Women', 'Kids', 'Accessories', 'Limited Edition'],
        },
        {
            title: 'Customer Service',
            links: ['Order Status', 'Shipping & Delivery', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'FAQ'],
        },
        {
            title: 'About Aura',
            links: ['Our Story', 'Sustainability', 'Ethics & Craft', 'Careers', 'Store Locator', 'Newsroom'],
        },
        {
            title: 'Aura for Business',
            links: ['Corporate Gifting', 'Uniform Solutions', 'Bulk Orders'],
        },
    ];

    return (
        <footer className="bg-gray-50 text-secondary py-20 px-6 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-6">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <Link to="#" className="text-[13px] font-medium text-secondary hover:text-black transition-colors">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-10 text-[12px] font-medium">
                    <p className="mb-6 text-secondary/70 leading-relaxed">
                        Discover the art of minimalist fashion. <Link to="/shop" className="text-accent hover:underline font-bold">Join the Aura Club</Link> for exclusive early access to our seasonal collections and sustainable initiatives.
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex flex-col space-y-1">
                            <p>Copyright © 2026 Aura Clothing Inc. All rights reserved.</p>
                            <p className="text-secondary/50">Crafted with precision in San Francisco.</p>
                        </div>

                        <div className="flex space-x-6">
                            <Link to="#" className="hover:text-black transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-black transition-colors">Terms of Service</Link>
                            <Link to="#" className="hover:text-black transition-colors">Cookie Settings</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

