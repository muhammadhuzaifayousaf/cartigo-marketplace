import { Link } from 'react-router-dom'
import { Shield, Truck, CreditCard, Headphones, Globe, Users, ArrowRight, MapPin, Package, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { img } from '../utils/helpers'

const milestones = [
  { year: '2022', title: 'Founded', description: 'Cartiqo started with a vision to revolutionize online shopping by connecting buyers directly with trusted suppliers.' },
  { year: '2023', title: 'First 1,000 Sellers', description: 'Our marketplace grew rapidly, attracting sellers from over 30 countries within the first year.' },
  { year: '2024', title: 'Global Expansion', description: 'We expanded operations to serve customers across 50+ countries with localized payment and shipping options.' },
  { year: '2025', title: '1 Million Orders', description: 'Reached the milestone of one million successful orders with a 99.2% customer satisfaction rate.' },
  { year: '2026', title: 'AI-Powered Shopping', description: 'Launched personalized recommendations and smart search powered by artificial intelligence.' },
]

const features = [
  { icon: Shield, title: 'Buyer Protection', description: 'Every purchase is covered by our comprehensive buyer protection program. If you\'re not satisfied, we\'ll make it right.' },
  { icon: Truck, title: 'Worldwide Shipping', description: 'We partner with trusted logistics companies to deliver to over 100 countries with real-time tracking on every order.' },
  { icon: CreditCard, title: 'Secure Payments', description: 'Your payment information is encrypted with bank-level security. We support all major payment methods worldwide.' },
  { icon: Headphones, title: 'Dedicated Support', description: 'Our customer support team is available 24/7 via chat, email, and phone to assist you with anything you need.' },
]

const offices = [
  { city: 'Islamabad', country: 'Pakistan', type: 'Head Office' },
  { city: 'Dubai', country: 'UAE', type: 'Regional Hub' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-border-col">
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
            <img src={img('logo.png')} alt="Cartiqo" className="h-24 md:h-32 mx-auto mb-8" />
            <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
              About Cartiqo
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make global commerce accessible to everyone. Cartiqo connects millions of buyers with thousands of verified suppliers, delivering quality products at competitive prices.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20">
                <Globe size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-3">Our Mission</h2>
              <p className="text-text-secondary leading-relaxed">
                To empower businesses and consumers worldwide by providing a trusted, transparent, and efficient marketplace. We strive to eliminate barriers in global trade, making it easy for anyone to buy or sell across borders.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <Star size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-3">Our Vision</h2>
              <p className="text-text-secondary leading-relaxed">
                To become the world's most customer-centric marketplace — a platform where trust, quality, and innovation come together to create exceptional shopping experiences for millions of people every day.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Our Story</h2>
              <p className="text-text-secondary leading-relaxed">
                Cartiqo was founded with a clear purpose: to build a marketplace where trust isn't a luxury — it's the standard. We saw an industry full of fragmented experiences, unreliable sellers, and complicated logistics. So we set out to change that.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-bg-light rounded-xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <Package size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">50K+ Products</h3>
                <p className="text-sm text-text-muted">Across electronics, fashion, home, and more</p>
              </div>
              <div className="bg-bg-light rounded-xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <Users size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">10K+ Happy Customers</h3>
                <p className="text-sm text-text-muted">Trust us for their everyday shopping needs</p>
              </div>
              <div className="bg-bg-light rounded-xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <MapPin size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">100+ Countries</h3>
                <p className="text-sm text-text-muted">Global reach with localized experiences</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border-col" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} items-start md:items-center gap-4 md:gap-8 group`}>
                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-10 md:pl-0 bg-white rounded-xl p-4 hover:shadow-card transition-shadow duration-300`}>
                    <span className="text-sm font-bold text-primary">{m.year}</span>
                    <h3 className="text-lg font-semibold text-text-primary">{m.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{m.description}</p>
                  </div>
                  <div className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow group-hover:scale-125 transition-transform duration-300" />
                  <div className="w-full md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Why Shop With Us</h2>
              <p className="text-text-muted">Everything you need for a safe and seamless shopping experience</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-bg-light rounded-xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20">
                    <f.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-10">Our Offices</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {offices.map((o) => (
              <div key={o.city} className="bg-white rounded-xl shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{o.city}, {o.country}</h3>
                  <p className="text-sm text-text-muted">{o.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-10">Meet the Founder</h2>
            <div className="flex justify-center">
              <div className="bg-bg-light rounded-2xl p-8 md:p-10 text-center max-w-lg w-full hover:shadow-card-hover transition-shadow duration-300">
                <img src={img('Huzaifa.png')} alt="Muhammad Huzaifa Yousaf" className="w-28 h-28 rounded-full object-cover mx-auto mb-5 border-4 border-primary/20" />
                <h3 className="text-xl font-bold text-text-primary">Muhammad Huzaifa Yousaf</h3>
                <p className="text-primary font-medium mb-4">Founder & Developer</p>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  Full-stack developer passionate about building products that make a difference. Created Cartiqo to bridge the gap between global buyers and trusted suppliers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://github.com/muhammadhuzaifayousaf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-white hover:bg-gray-800 transition-all duration-300 border border-border-col rounded-lg px-5 py-2.5 hover:border-gray-800 hover:shadow-md"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub Profile
                  </a>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary px-5 py-2.5 rounded-lg hover:bg-primary-dark hover:shadow-lg transition-all duration-300"
                  >
                    View Products <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-primary rounded-2xl py-12 px-6 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Start Shopping Today</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Join Cartiqo and discover thousands of quality products from verified suppliers worldwide.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
